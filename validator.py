from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from difflib import SequenceMatcher
from typing import Any

from feedback_loader import feedback_rank_bonus
from utils import normalize_bool, normalize_text, normalize_title, normalize_url, parse_date, parse_score


@dataclass
class ValidationIssue:
    level: str
    row: int
    field: str
    message: str


@dataclass
class DigestSelection:
    重点资讯: list[dict[str, Any]] = field(default_factory=list)
    可发选题: list[dict[str, Any]] = field(default_factory=list)
    需人工核验: list[dict[str, Any]] = field(default_factory=list)
    归档内容: list[dict[str, Any]] = field(default_factory=list)
    待人工确认: list[dict[str, Any]] = field(default_factory=list)
    duplicates: list[dict[str, Any]] = field(default_factory=list)
    issues: list[ValidationIssue] = field(default_factory=list)
    total_today: int = 0


def _is_direct_article_url(url: str) -> bool:
    """排除搜索页、聚合页等不能一键直达原文的链接。"""
    normalized = normalize_url(url).lower()
    if not normalized:
        return False
    blocked_patterns = [
        "baidu.com/s?",
        "news.google.com/",
        "google.com/search",
        "bing.com/search",
        "sogou.com/web",
        "so.com/s?",
    ]
    return not any(pattern in normalized for pattern in blocked_patterns)


def validate_rows(rows: list[dict[str, Any]], run_date: date) -> list[ValidationIssue]:
    """检查每条资讯的字段质量，只提示风险，不替用户编造事实结论。"""
    issues: list[ValidationIssue] = []
    for row in rows:
        row_no = int(row.get("_excel_row", 0))
        title = normalize_text(row.get("title"))
        source = normalize_text(row.get("source"))
        url = normalize_text(row.get("url"))
        summary = normalize_text(row.get("summary_cn"))
        status = normalize_text(row.get("status"))
        relevance = normalize_text(row.get("relevance_to_zettalab"))
        need_verify = normalize_bool(row.get("need_verify"))
        note = normalize_text(row.get("reviewer_note"))
        score = parse_score(row.get("importance_score"))
        published = parse_date(row.get("published_date"))
        collected = parse_date(row.get("collected_date"))

        if not title:
            issues.append(ValidationIssue("ERROR", row_no, "title", "标题为空。"))
        if not source:
            issues.append(ValidationIssue("WARNING", row_no, "source", "来源为空。"))
        if not url:
            issues.append(ValidationIssue("WARNING", row_no, "url", "原文链接为空，将使用标题+来源近似去重。"))
        if not summary:
            issues.append(ValidationIssue("INFO", row_no, "summary_cn", "中文摘要为空，建议补充一句话摘要。"))
        if score is not None and not (1 <= score <= 5):
            issues.append(ValidationIssue("WARNING", row_no, "importance_score", "重要性评分不在 1-5 范围内。"))
        if row.get("importance_score") not in (None, "") and score is None:
            issues.append(ValidationIssue("WARNING", row_no, "importance_score", "重要性评分不是可识别数字。"))
        if relevance and relevance not in {"高", "中", "低"}:
            issues.append(ValidationIssue("WARNING", row_no, "relevance_to_zettalab", "相关性建议使用 高/中/低。"))
        if need_verify is True and not note:
            issues.append(ValidationIssue("INFO", row_no, "reviewer_note", "需人工核验但备注为空，建议补充核验原因。"))
        if not status:
            issues.append(ValidationIssue("INFO", row_no, "status", "状态为空，建议补充状态。"))
        if published and published > run_date:
            issues.append(ValidationIssue("WARNING", row_no, "published_date", "发布时间晚于运行日期，请检查日期。"))
        if not collected:
            issues.append(ValidationIssue("INFO", row_no, "collected_date", "收集时间为空，筛选时不会按今日收集命中。"))
    return issues


def _is_candidate(row: dict[str, Any], run_date: date, config: dict[str, Any]) -> bool:
    """判断资讯是否进入今日候选池。"""
    digest_cfg = config.get("digest", {})
    include_status = set(digest_cfg.get("include_status", []))
    collected = parse_date(row.get("collected_date"))
    push_today = normalize_bool(row.get("push_today"))
    pushed = normalize_bool(row.get("pushed"))
    score = parse_score(row.get("importance_score"))
    status = normalize_text(row.get("status"))
    title = normalize_text(row.get("title"))
    source = normalize_text(row.get("source"))
    category = normalize_text(row.get("category"))
    region = normalize_text(row.get("region"))
    url = normalize_text(row.get("url"))
    text = f"{title} {normalize_text(row.get('summary_cn'))} {normalize_text(row.get('content_angle'))}".lower()
    allowed_regions = [normalize_text(item) for item in digest_cfg.get("allowed_regions", [])]
    exclude_sources = [normalize_text(item).lower() for item in digest_cfg.get("exclude_source_keywords", [])]
    exclude_categories = [normalize_text(item).lower() for item in digest_cfg.get("exclude_category_keywords", [])]
    exclude_titles = [normalize_text(item).lower() for item in digest_cfg.get("exclude_title_keywords", [])]
    business_keywords = [normalize_text(item).lower() for item in digest_cfg.get("business_event_keywords", [])]

    if allowed_regions and region not in allowed_regions:
        return False
    if config.get("fetch", {}).get("require_direct_article_link", True) and not _is_direct_article_url(url):
        return False
    if any(keyword and keyword in source.lower() for keyword in exclude_sources):
        return False
    if any(keyword and keyword in category.lower() for keyword in exclude_categories):
        return False
    if any(keyword and keyword in text for keyword in exclude_titles):
        return False
    if "pr newswire" in source.lower() and business_keywords:
        if not any(keyword and keyword in text for keyword in business_keywords):
            return False

    if digest_cfg.get("date_mode", "today") == "today":
        date_hit = collected == run_date or push_today is True
    else:
        date_hit = push_today is True or collected == run_date

    score_hit = score is not None and score >= float(digest_cfg.get("min_importance_score", 4))
    status_hit = status in include_status

    if config.get("digest", {}).get("exclude_pushed", True) and pushed is True:
        return False
    return bool(date_hit and (score_hit or status_hit or score is None) and title and source)


def _deduplicate(rows: list[dict[str, Any]], config: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """URL 精确去重；URL 缺失时使用标题相似度近似去重。"""
    dedup_cfg = config.get("dedup", {})
    use_title_similarity = dedup_cfg.get("use_title_similarity", True)
    threshold = float(dedup_cfg.get("title_similarity_threshold", 0.9))
    keep_highest = dedup_cfg.get("keep", "highest_score") == "highest_score"

    kept: list[dict[str, Any]] = []
    duplicates: list[dict[str, Any]] = []
    url_index: dict[str, int] = {}

    for row in rows:
        url = normalize_url(row.get("url"))
        score = parse_score(row.get("importance_score")) or 0
        duplicate_of = None

        if dedup_cfg.get("use_url", True) and url:
            duplicate_of = url_index.get(url)
        if duplicate_of is None and use_title_similarity:
            title = normalize_title(row.get("title"))
            source = normalize_text(row.get("source")).lower()
            for idx, old in enumerate(kept):
                old_key = normalize_title(old.get("title"))
                old_source = normalize_text(old.get("source")).lower()
                same_source_family = source == old_source or ("google news" in source and "google news" in old_source)
                if same_source_family and old_key and SequenceMatcher(None, title, old_key).ratio() >= threshold:
                    duplicate_of = idx
                    break

        if duplicate_of is None:
            if url:
                url_index[url] = len(kept)
            kept.append(row)
            continue

        old_score = parse_score(kept[duplicate_of].get("importance_score")) or 0
        if keep_highest and score > old_score:
            duplicates.append(kept[duplicate_of])
            kept[duplicate_of] = row
            if url:
                url_index[url] = duplicate_of
        else:
            duplicates.append(row)

    return kept, duplicates


def select_digest_items(rows: list[dict[str, Any]], run_date: date, config: dict[str, Any]) -> DigestSelection:
    """筛选今日日报内容，并拆分重点资讯、需核验、选题和归档内容。"""
    selection = DigestSelection()
    selection.issues = validate_rows(rows, run_date)

    candidates = [row for row in rows if _is_candidate(row, run_date, config)]
    selection.total_today = len([row for row in rows if parse_date(row.get("collected_date")) == run_date or normalize_bool(row.get("push_today")) is True])
    candidates, selection.duplicates = _deduplicate(candidates, config)

    min_score = float(config.get("digest", {}).get("min_importance_score", 4))
    max_items = int(config.get("digest", {}).get("max_items", 10))
    for row in candidates:
        score = parse_score(row.get("importance_score"))
        need_verify = normalize_bool(row.get("need_verify")) is True
        status = normalize_text(row.get("status"))
        angle = normalize_text(row.get("content_angle"))

        if need_verify:
            selection.需人工核验.append(row)
            if score is not None and (score >= min_score or status in set(config.get("digest", {}).get("include_status", []))):
                selection.重点资讯.append(row)
                if score >= min_score and angle:
                    selection.可发选题.append(row)
        elif score is None:
            selection.待人工确认.append(row)
        elif score >= min_score or status in set(config.get("digest", {}).get("include_status", [])):
            selection.重点资讯.append(row)
            if score >= min_score and angle:
                selection.可发选题.append(row)
        elif score == 3 or status == "已归档":
            selection.归档内容.append(row)

    def editorial_rank(row: dict[str, Any]) -> tuple[int, int, int, int, int, float, int]:
        """按中文创新药产业情报口径排序，避免泛科研资讯压过本土产业资讯。"""
        score = parse_score(row.get("importance_score")) or 0
        text = f"{normalize_text(row.get('title'))} {normalize_text(row.get('category'))} {normalize_text(row.get('content_angle'))}".lower()
        source = normalize_text(row.get("source")).lower()
        region_bonus = 1 if normalize_text(row.get("region")) == "中国" else 0
        primary_bonus = 1 if any(name in source for name in [
            "fda", "ema", "nih", "business wire", "pr newswire", "globenewswire", "press release"
        ]) or "一级新闻稿" in normalize_text(row.get("category")) else 0
        industry_terms = [
            "创新药", "获批", "上市申请", "优先审评", "突破性疗法", "临床", "bd",
            "license-out", "license-in", "授权", "出海", "首付款", "里程碑",
            "adc", "双抗", "多抗", "核酸药物", "car-t", "细胞治疗", "基因编辑",
            "医保", "集采", "商业化", "ai制药", "人工智能制药",
        ]
        event_terms = [
            "获批", "批准", "受理", "优先审评", "上市申请", "ind", "nda", "bla",
            "达到主要终点", "主要终点", "顶线数据", "临床数据", "iii期", "3期",
            "完成入组", "启动临床", "签署", "达成合作", "授权", "license-out",
            "首付款", "里程碑", "完成融资", "融资", "并购", "收购", "集采中选",
            "医保谈判", "获受理",
        ]
        industry_bonus = sum(1 for term in industry_terms if term in text)
        event_bonus = sum(1 for term in event_terms if term in text)
        source_penalty = 1 if "google news" in source and industry_bonus == 0 else 0
        feedback_bonus = feedback_rank_bonus(row, config.get("_feedback_weights", {}))
        return (region_bonus, event_bonus, feedback_bonus, industry_bonus, primary_bonus, score, -source_penalty)

    selection.重点资讯 = sorted(selection.重点资讯, key=editorial_rank, reverse=True)[:max_items]
    selection.可发选题 = sorted(selection.可发选题, key=editorial_rank, reverse=True)[:max_items]
    selection.需人工核验 = sorted(selection.需人工核验, key=editorial_rank, reverse=True)[:max_items]
    return selection

from __future__ import annotations

import html
import hashlib
from datetime import date
from pathlib import Path
from typing import Any

from utils import clean_article_url, normalize_text, parse_date, parse_score
from validator import DigestSelection


def _date_text(value: Any) -> str:
    parsed = parse_date(value)
    return parsed.strftime("%Y-%m-%d") if parsed else "未标注"


def _value(row: dict[str, Any], field: str, default: str = "未填写") -> str:
    return normalize_text(row.get(field)) or default


def _source_link(row: dict[str, Any]) -> str:
    url = clean_article_url(_value(row, "url", ""))
    if not url:
        return "无链接"
    return url


def _feedback_id(row: dict[str, Any]) -> str:
    """生成稳定的短反馈编号，便于在附件中定位同一条资讯。"""
    raw = f"{_value(row, 'title', '')}|{_value(row, 'source', '')}|{_source_link(row)}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:8].upper()


def _short_note(row: dict[str, Any]) -> str:
    note = _value(row, "reviewer_note", "")
    if "Google News" in note:
        return "聚合链接，发布或转述前需打开最终来源核验。"
    if _value(row, "need_verify", "否") == "是":
        return "涉及临床、审批、授权、融资或监管信息，需核验原文。"
    return "建议人工阅读全文后再外部引用。"


def _verify_reason(row: dict[str, Any]) -> str:
    """解释为什么被放入核验区，避免运营同事误解为低质量信息。"""
    title = _value(row, "title", "")
    summary = _value(row, "summary_cn", "")
    source = _value(row, "source", "")
    text = f"{title} {summary}".lower()
    reasons: list[str] = []
    if "google news" in source.lower() or "聚合链接" in _value(row, "reviewer_note", ""):
        reasons.append("来源是聚合链接，需要打开最终原始来源确认")
    checks = [
        (["cde", "nmpa", "fda", "ema", "审批", "审评", "批准", "获批", "受理", "优先审评"], "涉及监管/审评审批口径"),
        (["clinical", "trial", "phase", "临床", "iii期", "ii期", "3期", "2期", "顶线数据", "主要终点"], "涉及临床阶段、终点或数据表述"),
        (["financing", "funding", "融资", "投资", "估值"], "涉及融资金额或估值"),
        (["license", "collaboration", "agreement", "partner", "授权", "合作", "首付款", "里程碑", "交易金额"], "涉及合作/授权/交易条款"),
    ]
    for keywords, reason in checks:
        if any(keyword in text for keyword in keywords):
            reasons.append(reason)
    if not reasons:
        reasons.append("系统判断该条存在事实核验风险")
    return "；".join(dict.fromkeys(reasons)) + "。"


def _item_plain(row: dict[str, Any], idx: int) -> list[str]:
    verify_flag = "｜需核验" if _value(row, "need_verify", "否") == "是" else ""
    return [
        f"{idx}. {_value(row, 'title')}{verify_flag}",
        f"   时间：{_date_text(row.get('published_date'))}｜地区：{_value(row, 'region')}｜类别：{_value(row, 'category')}",
        f"   来源：{_value(row, 'source')}",
        f"   链接：{_source_link(row)}",
        f"   摘要：{_value(row, 'summary_cn', 'RSS 未提供摘要，需人工补充。')}",
        f"   关注点：{_value(row, 'content_angle', '待人工判断。')}",
        f"   核验提示：{_verify_reason(row) if _value(row, 'need_verify', '否') == '是' else _short_note(row)}",
        f"   反馈编号：{_feedback_id(row)}｜请使用 HTML 邮件卡片中的反馈按钮，帮助后续筛选学习。",
    ]


def build_plain_text(selection: DigestSelection, run_date: date, config: dict[str, Any]) -> str:
    """生成清爽的纯文本日报，不包含 LinkedIn 或 ZettaLab 推广表达。"""
    title = f"{config.get('mail', {}).get('subject_prefix', '【生物医药产业资讯简报】')}{run_date:%Y-%m-%d}"
    preferred_days = config.get("fetch", {}).get("preferred_days", 3)
    days_back = config.get("fetch", {}).get("days_back", 7)
    lines: list[str] = [
        title,
        "",
        f"以下为自动检索到的生物医药产业资讯。系统优先筛选近 {preferred_days} 天事件，最多放宽至近 {days_back} 天；所有高风险事实请以原文为准。",
        "",
        "一、重点资讯",
    ]

    if selection.重点资讯:
        for idx, row in enumerate(selection.重点资讯, 1):
            lines.extend(["", *_item_plain(row, idx)])
    else:
        lines.append("暂无达到重点推荐标准的资讯。")

    lines.extend(["", "二、需人工核验的重点线索"])
    if selection.需人工核验:
        for idx, row in enumerate(selection.需人工核验, 1):
            lines.extend([
                "",
                f"{idx}. {_value(row, 'title')}",
                f"   来源：{_value(row, 'source')}｜时间：{_date_text(row.get('published_date'))}",
                f"   链接：{_source_link(row)}",
                f"   为什么要核验：{_verify_reason(row)}",
                f"   处理建议：先打开原文确认公司名、适应症、阶段、金额、终点等关键事实，再决定是否转述。",
            ])
    else:
        lines.append("暂无。")

    archive_rows = (selection.归档内容 + selection.待人工确认)[:8]
    lines.extend(["", "三、归档观察"])
    if archive_rows:
        for idx, row in enumerate(archive_rows, 1):
            score = parse_score(row.get("importance_score"))
            score_text = f"评分 {score:g}" if score is not None else "待确认"
            lines.append(f"{idx}. {_value(row, 'title')}｜{_value(row, 'source')}｜{score_text}")
    else:
        lines.append("暂无。")

    lines.extend([
        "",
        "四、统计",
        f"今日入库候选：{selection.total_today} 条",
        f"重点资讯：{len(selection.重点资讯)} 条",
        f"需人工核验：{len(selection.需人工核验)} 条",
        f"重复跳过：{len(selection.duplicates)} 条",
    ])
    return "\n".join(lines)


def _badge(text: str) -> str:
    return f'<span class="badge">{html.escape(text)}</span>' if text else ""


def _card(row: dict[str, Any], idx: int, verify: bool = False) -> str:
    title = html.escape(_value(row, "title"))
    url = html.escape(_source_link(row))
    source = html.escape(_value(row, "source"))
    summary = html.escape(_value(row, "summary_cn", "RSS 未提供摘要，需人工补充。"))
    angle = html.escape(_value(row, "content_angle", "待人工判断。"))
    note = html.escape(_short_note(row))
    verify_reason = html.escape(_verify_reason(row))
    feedback_id = _feedback_id(row)
    meta = " ".join([
        _badge(_date_text(row.get("published_date"))),
        _badge(_value(row, "region")),
        _badge(_value(row, "category")),
        _badge(f"评分 {_value(row, 'importance_score', 'NA')}"),
    ])
    is_need_verify = _value(row, "need_verify", "否") == "是"
    verify_class = " verify" if verify or is_need_verify else ""
    verify_badge = _badge("需核验") if is_need_verify else ""
    return f"""
    <article class="card{verify_class}">
      <div class="item-title"><span class="idx">{idx}</span><a href="{url}" target="_blank">{title}</a></div>
      <div class="meta">{verify_badge}{meta}</div>
      <div class="source">来源：{source}</div>
      <div class="block"><b>摘要</b><p>{summary}</p></div>
      <div class="block"><b>关注点</b><p>{angle}</p></div>
      <div class="note">{"为什么要核验：" + verify_reason if verify or is_need_verify else "核验提示：" + note}</div>
      <div class="feedback">反馈编号：{feedback_id}。可点击邮件顶部“批量反馈”统一评价本期资讯。</div>
    </article>
    """


def build_html(selection: DigestSelection, run_date: date, config: dict[str, Any]) -> str:
    """生成结构化 HTML 邮件，避免纯文本换行堆叠造成格式混乱。"""
    title = f"{config.get('mail', {}).get('subject_prefix', '【生物医药产业资讯简报】')}{run_date:%Y-%m-%d}"
    preferred_days = config.get("fetch", {}).get("preferred_days", 3)
    days_back = config.get("fetch", {}).get("days_back", 7)
    feedback_url = html.escape(config.get("_feedback_public_url", ""))
    feedback_cta = (
        f'<section class="feedback-panel"><b>本期资讯反馈</b><p>无需登录或发送邮件。打开反馈页，直接评价感兴趣的资讯，最后统一提交一次。</p><a href="{feedback_url}" target="_blank">反馈本期资讯</a></section>'
        if feedback_url
        else ""
    )
    key_cards = "\n".join(_card(row, idx) for idx, row in enumerate(selection.重点资讯, 1)) or '<p class="empty">暂无达到重点推荐标准的资讯。</p>'
    verify_cards = "\n".join(_card(row, idx, verify=True) for idx, row in enumerate(selection.需人工核验, 1)) or '<p class="empty">暂无。</p>'

    archive_rows = (selection.归档内容 + selection.待人工确认)[:8]
    archive_items = "\n".join(
        f"<li>{html.escape(_value(row, 'title'))}<span>{html.escape(_value(row, 'source'))}</span></li>"
        for row in archive_rows
    ) or "<li>暂无。</li>"

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <style>
    body {{ margin:0; padding:0; background:#f5f7fb; color:#172033; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",Arial,sans-serif; }}
    .wrap {{ max-width: 900px; margin: 0 auto; padding: 24px 18px 36px; }}
    .header {{ background:#ffffff; border:1px solid #e6eaf2; padding:22px 24px; border-radius:8px; }}
    h1 {{ margin:0 0 8px; font-size:22px; line-height:1.35; color:#0f172a; }}
    .subtitle {{ margin:0; color:#5b667a; font-size:14px; line-height:1.7; }}
    h2 {{ margin:24px 0 12px; font-size:17px; color:#0f172a; }}
    .card {{ background:#fff; border:1px solid #e4e9f1; border-radius:8px; padding:18px 20px; margin:12px 0; }}
    .card.verify {{ border-left:4px solid #d97706; }}
    .item-title {{ font-size:16px; font-weight:700; line-height:1.55; }}
    .item-title a {{ color:#0f3b75; text-decoration:none; }}
    .idx {{ display:inline-block; min-width:24px; color:#64748b; }}
    .meta {{ margin:10px 0 8px; }}
    .badge {{ display:inline-block; margin:0 6px 6px 0; padding:3px 8px; border-radius:999px; background:#eef3f8; color:#415169; font-size:12px; }}
    .source {{ color:#526070; font-size:13px; margin-bottom:12px; }}
    .block {{ margin:10px 0; }}
    .block b {{ display:block; color:#111827; font-size:13px; margin-bottom:4px; }}
    .block p {{ margin:0; color:#273244; font-size:14px; line-height:1.75; }}
    .note {{ margin-top:12px; padding:10px 12px; background:#fff7ed; border:1px solid #fed7aa; border-radius:6px; color:#8a4b12; font-size:13px; line-height:1.6; }}
    .feedback {{ margin-top:10px; padding:10px 12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; color:#166534; font-size:13px; line-height:1.6; }}
    .feedback-panel {{ background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px 20px; margin:14px 0; color:#166534; }}
    .feedback-panel p {{ margin:6px 0 12px; line-height:1.7; }}
    .feedback-panel a {{ display:inline-block; padding:8px 14px; background:#166534; color:#fff; border-radius:5px; text-decoration:none; font-weight:700; }}
    .hint {{ margin: -4px 0 12px; color:#64748b; font-size:13px; line-height:1.7; }}
    .archive {{ background:#fff; border:1px solid #e4e9f1; border-radius:8px; padding:14px 20px; }}
    .archive li {{ margin:8px 0; line-height:1.6; }}
    .archive span {{ color:#64748b; margin-left:8px; }}
    .stats {{ background:#0f172a; color:#e5e7eb; border-radius:8px; padding:16px 20px; font-size:14px; line-height:1.9; }}
    .empty {{ color:#64748b; background:#fff; border:1px solid #e4e9f1; border-radius:8px; padding:16px 20px; }}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="header">
      <h1>{html.escape(title)}</h1>
      <p class="subtitle">自动检索公开来源，优先近 {preferred_days} 天事件，最多放宽至近 {days_back} 天。审批、临床、融资、授权等高风险事实均需以原文核验。</p>
    </section>
    {feedback_cta}

    <h2>一、重点资讯</h2>
    {key_cards}

    <h2>二、需人工核验的重点线索</h2>
    <p class="hint">这些不是低质量内容，而是涉及监管、临床、融资、授权或聚合来源的高风险事实，发送或转述前需要打开原文确认。</p>
    {verify_cards}

    <h2>三、归档观察</h2>
    <ul class="archive">{archive_items}</ul>

    <h2>四、统计</h2>
    <div class="stats">
      今日入库候选：{selection.total_today} 条<br>
      重点资讯：{len(selection.重点资讯)} 条<br>
      需人工核验：{len(selection.需人工核验)} 条<br>
      重复跳过：{len(selection.duplicates)} 条
    </div>
  </div>
</body>
</html>"""


def save_digest_outputs(text: str, html_text: str, output_dir: Path, run_date: date, save_text: bool = True, save_html: bool = True) -> dict[str, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    paths: dict[str, Path] = {}
    if save_text:
        txt_path = output_dir / f"biomed_digest_{run_date:%Y%m%d}.txt"
        txt_path.write_text(text, encoding="utf-8")
        paths["text"] = txt_path
    if save_html:
        html_path = output_dir / f"biomed_digest_{run_date:%Y%m%d}.html"
        html_path.write_text(html_text, encoding="utf-8")
        paths["html"] = html_path
    return paths

from __future__ import annotations

import re
from datetime import date, datetime
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import yaml


TRUE_VALUES = {"是", "true", "1", "yes", "y", "已推送", "已发", "建议推送", "可发帖"}
FALSE_VALUES = {"否", "false", "0", "no", "n", "未推送", "未发", "无"}


def load_config(path: Path) -> dict[str, Any]:
    """读取 YAML 配置文件。"""
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def ensure_dirs(*paths: Path) -> None:
    """确保输出、日志、备份等目录存在。"""
    for path in paths:
        path.mkdir(parents=True, exist_ok=True)


def resolve_path(path_text: str | Path, base_dir: Path) -> Path:
    """兼容相对路径、绝对路径和常见 /mnt/data 路径。"""
    path = Path(path_text)
    if path.exists():
        return path.resolve()
    if not path.is_absolute():
        candidate = (base_dir / path).resolve()
        if candidate.exists():
            return candidate
    # 在 Windows 桌面环境中，/mnt/data 常来自 Linux 沙箱；这里给出原路径用于错误提示。
    return path


def parse_run_date(value: str | None) -> date:
    """解析命令行日期；为空时使用今天。"""
    if not value:
        return date.today()
    return datetime.strptime(value, "%Y-%m-%d").date()


def parse_date(value: Any) -> date | None:
    """尽量兼容 Excel 日期、字符串日期和 pandas/openpyxl 读出的 datetime。"""
    if value is None or value == "":
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    text = str(value).strip()
    if not text:
        return None
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y.%m.%d", "%Y-%m-%d %H:%M:%S", "%Y/%m/%d %H:%M:%S"):
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(text).date()
    except ValueError:
        return None


def normalize_bool(value: Any) -> bool | None:
    """把 是/否、TRUE/FALSE、1/0、已推送/未推送 等写法统一为布尔值。"""
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return value
    text = str(value).strip().lower()
    if text in TRUE_VALUES:
        return True
    if text in FALSE_VALUES:
        return False
    return None


def normalize_text(value: Any) -> str:
    """清洗单元格文本，避免 None、换行和多余空格影响判断。"""
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def normalize_url(value: Any) -> str:
    """清洗 URL，用于精确去重。"""
    text = normalize_text(value)
    if not text:
        return ""
    return text.rstrip("/").lower()


def clean_article_url(value: Any) -> str:
    """清理常见跟踪参数，让邮件和附件里的链接更接近原始文章地址。"""
    text = normalize_text(value)
    if not text:
        return ""
    try:
        parts = urlsplit(text)
    except Exception:
        return text
    drop_keys = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "spm", "from", "vt", "oid", "module"}
    query_items = [
        (key, val)
        for key, val in parse_qsl(parts.query, keep_blank_values=True)
        if key.lower() not in drop_keys and not key.lower().startswith("utm_")
    ]
    clean_query = urlencode(query_items, doseq=True)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, clean_query, parts.fragment)).rstrip("/")


def normalize_title(value: Any) -> str:
    """清洗标题，用于近似去重。"""
    text = normalize_text(value).lower()
    text = re.sub(r"[^\w\u4e00-\u9fff]+", "", text)
    return text


def parse_score(value: Any) -> float | None:
    """兼容数字或文本评分。"""
    if value is None or value == "":
        return None
    try:
        return float(str(value).strip())
    except ValueError:
        return None

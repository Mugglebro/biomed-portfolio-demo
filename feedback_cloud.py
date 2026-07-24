from __future__ import annotations

import csv
import json
import os
from datetime import date
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv

from digest_builder import _feedback_id
from utils import clean_article_url, normalize_text


def _credentials(base_dir: Path) -> tuple[str, str]:
    load_dotenv(base_dir / ".env", override=True)
    return os.getenv("FEEDBACK_PUBLIC_URL", "").rstrip("/"), os.getenv("FEEDBACK_ADMIN_TOKEN", "")


def publish_digest(base_dir: Path, run_date: date, rows: list[dict[str, Any]]) -> tuple[str, str]:
    """上传本期资讯并返回所有收件人可访问的公开反馈页。"""
    public_url, token = _credentials(base_dir)
    if not public_url or not token:
        return "", "公开反馈服务未配置，已跳过反馈页发布。"
    digest_id = f"{run_date:%Y%m%d}"
    items = []
    seen = set()
    for row in rows:
        feedback_id = _feedback_id(row)
        if feedback_id in seen:
            continue
        seen.add(feedback_id)
        items.append({
            "feedback_id": feedback_id,
            "title": normalize_text(row.get("title")),
            "source": normalize_text(row.get("source")),
            "category": normalize_text(row.get("category")),
            "url": clean_article_url(row.get("url")),
        })
    payload = {"digest_id": digest_id, "digest_date": f"{run_date:%Y-%m-%d}", "items": items}
    try:
        response = requests.post(
            f"{public_url}/api/digest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
            timeout=20,
        )
        response.raise_for_status()
        result = response.json()
        return result.get("url", f"{public_url}/feedback/{digest_id}"), f"公开反馈页已发布：{len(items)} 条资讯。"
    except Exception as exc:
        return "", f"公开反馈页发布失败，日报将继续生成：{exc}"


def sync_feedback(base_dir: Path) -> str:
    """从公开反馈服务下载反馈历史，供本地排序学习。"""
    public_url, token = _credentials(base_dir)
    if not public_url or not token:
        return "公开反馈服务未配置，已跳过反馈同步。"
    try:
        response = requests.get(
            f"{public_url}/api/export",
            headers={"Authorization": f"Bearer {token}"},
            timeout=20,
        )
        response.raise_for_status()
        rows = response.json()
        path = base_dir / "feedback" / "feedback_history.csv"
        path.parent.mkdir(parents=True, exist_ok=True)
        headers = ["collected_date", "message_id", "respondent_id", "feedback_id", "action", "preference", "tags", "title", "source", "category", "url", "note"]
        with path.open("w", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            for index, row in enumerate(rows):
                action = normalize_text(row.get("action"))
                value_scores = {"重点关注": 3, "可做选题": 2, "一般参考": 0, "无需关注": -3}
                writer.writerow({
                    "collected_date": row.get("created_at", ""),
                    "message_id": f"cloud-{row.get('id', index)}",
                    "respondent_id": row.get("respondent_id", ""),
                    "feedback_id": row.get("feedback_id", ""),
                    "action": action,
                    "preference": str(value_scores.get(action, 0)),
                    "tags": row.get("tags", "[]"),
                    "title": row.get("title", ""),
                    "source": row.get("source", ""),
                    "category": row.get("category", ""),
                    "url": row.get("url", ""),
                    "note": row.get("note", ""),
                })
        return f"公开反馈同步完成：{len(rows)} 条。"
    except Exception as exc:
        return f"公开反馈同步失败，已继续使用本地历史：{exc}"

from __future__ import annotations

from datetime import date

from validator import select_digest_items


def test_select_digest_items_basic():
    rows = [
        {"_excel_row": 2, "title": "AI 制药合作", "source": "新闻稿", "url": "https://example.com/a", "collected_date": date.today(), "importance_score": 5, "status": "建议推送", "pushed": "否", "need_verify": "否", "content_angle": "AI in Biopharma"},
        {"_excel_row": 3, "title": "AI 制药合作重复", "source": "新闻稿", "url": "https://example.com/a", "collected_date": date.today(), "importance_score": 4, "status": "建议推送", "pushed": "否", "need_verify": "否"},
    ]
    config = {"digest": {"min_importance_score": 4, "include_status": ["建议推送"], "max_items": 10}, "dedup": {"use_url": True, "use_title_similarity": True, "title_similarity_threshold": 0.9}}
    result = select_digest_items(rows, date.today(), config)
    assert len(result.重点资讯) == 1
    assert len(result.duplicates) == 1

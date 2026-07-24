from __future__ import annotations

import html
import json
from datetime import date
from pathlib import Path
from typing import Any

from digest_builder import _feedback_id
from utils import clean_article_url, normalize_text


def build_feedback_portal(output_dir: Path, run_date: date, rows: list[dict[str, Any]], port: int = 8765) -> tuple[Path, str]:
    """生成可一次提交多条评价的本地反馈页面。"""
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

    page_name = f"feedback_{run_date:%Y%m%d}.html"
    path = output_dir / page_name
    data_json = json.dumps(items, ensure_ascii=False).replace("</", "<\\/")
    page = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>生物医药资讯批量反馈 {run_date:%Y-%m-%d}</title>
  <style>
    body {{ margin:0; background:#f5f7fb; color:#172033; font-family:"Microsoft YaHei",Arial,sans-serif; }}
    main {{ max-width:920px; margin:0 auto; padding:24px 16px 100px; }}
    header {{ background:#fff; border:1px solid #e4e9f1; padding:20px; border-radius:8px; }}
    h1 {{ margin:0 0 8px; font-size:22px; }}
    p {{ color:#5b667a; line-height:1.7; }}
    .item {{ background:#fff; border:1px solid #e4e9f1; border-radius:8px; padding:16px; margin:12px 0; }}
    .title {{ color:#0f3b75; font-weight:700; line-height:1.6; text-decoration:none; }}
    .meta {{ color:#64748b; font-size:13px; margin:7px 0 12px; }}
    .choices {{ display:flex; flex-wrap:wrap; gap:8px; }}
    label {{ border:1px solid #cbd5e1; padding:7px 10px; border-radius:5px; cursor:pointer; }}
    label:has(input:checked) {{ border-color:#16a34a; background:#f0fdf4; color:#166534; }}
    textarea {{ width:100%; box-sizing:border-box; margin-top:10px; min-height:52px; border:1px solid #cbd5e1; border-radius:5px; padding:8px; }}
    .bar {{ position:fixed; bottom:0; left:0; right:0; background:#fff; border-top:1px solid #dbe2ea; padding:12px; text-align:center; }}
    button {{ border:0; background:#166534; color:#fff; padding:11px 28px; border-radius:5px; font-weight:700; cursor:pointer; }}
    #status {{ margin-left:12px; color:#166534; }}
  </style>
</head>
<body>
<main>
  <header><h1>生物医药资讯批量反馈</h1><p>选择需要评价的资讯，最后统一提交一次。未选择的资讯不会计入偏好。</p></header>
  <div id="list"></div>
</main>
<div class="bar"><button onclick="submitAll()">统一提交反馈</button><span id="status"></span></div>
<script>
const items = {data_json};
const actions = ["喜欢","不喜欢","链接问题","方向不符"];
document.getElementById("list").innerHTML = items.map((item, i) => `
  <section class="item" data-id="${{item.feedback_id}}">
    <a class="title" href="${{item.url}}" target="_blank">${{i+1}}. ${{escapeHtml(item.title)}}</a>
    <div class="meta">${{escapeHtml(item.source)}} · ${{escapeHtml(item.category)}} · 反馈编号 ${{item.feedback_id}}</div>
    <div class="choices">${{actions.map(a => `<label><input type="radio" name="f_${{item.feedback_id}}" value="${{a}}"> ${{a}}</label>`).join("")}}</div>
    <textarea placeholder="可选：补充说明"></textarea>
  </section>`).join("");
function escapeHtml(s) {{ return String(s || "").replace(/[&<>"']/g, c => ({{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}}[c])); }}
async function submitAll() {{
  const feedback = [];
  document.querySelectorAll(".item").forEach(el => {{
    const checked = el.querySelector("input:checked");
    if (!checked) return;
    const item = items.find(x => x.feedback_id === el.dataset.id);
    feedback.push({{...item, action:checked.value, note:el.querySelector("textarea").value}});
  }});
  if (!feedback.length) {{ document.getElementById("status").textContent = "请至少选择一条反馈"; return; }}
  const response = await fetch("/submit", {{method:"POST", headers:{{"Content-Type":"application/json"}}, body:JSON.stringify({{run_date:"{run_date:%Y-%m-%d}", feedback}})}});
  document.getElementById("status").textContent = response.ok ? `已保存 ${{feedback.length}} 条反馈` : "保存失败，请确认本地反馈服务正在运行";
}}
</script>
</body></html>"""
    path.write_text(page, encoding="utf-8")
    return path, f"http://127.0.0.1:{port}/{page_name}"

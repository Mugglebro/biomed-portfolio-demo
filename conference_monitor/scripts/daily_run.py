#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Daily WeChat public-article monitor for biomedical conference notices.

The script intentionally uses only Python standard-library modules so it can run
on this Windows machine without package installation.
"""

from __future__ import print_function

import argparse
import datetime as dt
import email.utils
import hashlib
import html
import json
import os
import re
import smtplib
import socket
import ssl
import sys
import time
import zipfile
import xml.etree.ElementTree as ET
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

try:
    from urllib.parse import quote, unquote, urlparse, parse_qs, urljoin
    from urllib.request import Request, urlopen
    from urllib.error import URLError, HTTPError
except ImportError:
    from urllib import quote, unquote
    from urlparse import urlparse, parse_qs, urljoin
    from urllib2 import Request, urlopen, URLError, HTTPError


ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config"
DATA = ROOT / "data"
REPORTS = ROOT / "reports"
LOGS = ROOT / "logs"


def now_local():
    return dt.datetime.now()


def today_date():
    return now_local().date()


def ensure_dirs():
    for path in (CONFIG, DATA, REPORTS, LOGS):
        path.mkdir(parents=True, exist_ok=True)


def log(message):
    ensure_dirs()
    line = "[%s] %s" % (now_local().strftime("%Y-%m-%d %H:%M:%S"), message)
    print(line)
    with (LOGS / "daily.log").open("a", encoding="utf-8") as fh:
        fh.write(line + "\n")


def load_json(path, default):
    if not path.exists():
        return default
    try:
        with path.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception as exc:
        log("Failed to read %s: %s" % (path, exc))
        return default


def save_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(value, fh, ensure_ascii=False, indent=2, sort_keys=True)
    tmp.replace(path)


def load_env(path):
    env = {}
    if not path.exists():
        return env
    with path.open("r", encoding="utf-8") as fh:
        for raw in fh:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            env[key.strip()] = val.strip()
    return env


def get_url(url, user_agent, timeout, extra_headers=None):
    headers = {"User-Agent": user_agent, "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.5"}
    if extra_headers:
        headers.update(extra_headers)
    req = Request(url, headers=headers)
    try:
        with urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            charset = resp.headers.get_content_charset() or "utf-8"
            return raw.decode(charset, errors="ignore"), resp.geturl()
    except (URLError, HTTPError, ssl.SSLError, TimeoutError) as exc:
        log("Fetch failed: %s (%s)" % (url, exc))
        return "", url
    except Exception as exc:
        log("Fetch failed: %s (%s)" % (url, exc))
        return "", url


def strip_tags(text):
    text = re.sub(r"<script[\s\S]*?</script>", " ", text, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def clean_url(url):
    url = html.unescape(url or "").strip()
    if not url:
        return ""
    if url.startswith("//"):
        url = "https:" + url
    if not (url.startswith("http://") or url.startswith("https://")):
        parsed_relative = urlparse(url)
        qs_relative = parse_qs(parsed_relative.query)
        for key in ("url", "u", "target", "uddg"):
            if key in qs_relative and qs_relative[key]:
                candidate = unquote(qs_relative[key][0])
                if candidate.startswith(("http://", "https://")) and "mp.weixin.qq.com" in candidate:
                    return candidate.split("#")[0]
        return ""
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    for key in ("url", "u", "target", "uddg"):
        if key in qs and qs[key]:
            candidate = unquote(qs[key][0])
            if "mp.weixin.qq.com" in candidate:
                return candidate.split("#")[0]
    return url.split("#")[0]


def normalize_article_url(url):
    url = clean_url(url)
    if "mp.weixin.qq.com" not in url:
        return ""
    parsed = urlparse(url)
    if parsed.path.startswith("/s/"):
        return ("https://mp.weixin.qq.com" + parsed.path).rstrip("/")
    if "__biz=" in parsed.query and "mid=" in parsed.query and "idx=" in parsed.query:
        keep = []
        qs = parse_qs(parsed.query)
        for key in ("__biz", "mid", "idx", "sn"):
            if key in qs:
                keep.append("%s=%s" % (key, quote(qs[key][0], safe="")))
        return "https://mp.weixin.qq.com/s?" + "&".join(keep)
    return ""


def is_sogou_jump_url(url):
    parsed = urlparse(url)
    return "sogou.com" in parsed.netloc and parsed.path.startswith("/link")


def extract_search_results(page_html, engine_name, search_url=""):
    results = []
    seen = set()
    for m in re.finditer(r'href=["\']([^"\']+)["\']', page_html, flags=re.I):
        raw = html.unescape(m.group(1)).strip()
        absolute = urljoin(search_url, raw) if search_url else raw
        cleaned = clean_url(absolute)
        url = normalize_article_url(cleaned)
        needs_resolve = False
        if not url and is_sogou_jump_url(absolute):
            url = absolute
            needs_resolve = True
        if not url or url in seen:
            continue
        seen.add(url)
        around = page_html[max(0, m.start() - 500):m.end() + 800]
        title = strip_tags(around)
        results.append({"url": url, "title_hint": title[:180], "source_platform": engine_name, "needs_resolve": needs_resolve})
    # Sogou often stores escaped WeChat URLs in JavaScript snippets.
    for m in re.finditer(r'https?://mp\.weixin\.qq\.com/[^"\'<>\s]+', html.unescape(page_html)):
        url = normalize_article_url(m.group(0))
        if url and url not in seen:
            seen.add(url)
            results.append({"url": url, "title_hint": "", "source_platform": engine_name, "needs_resolve": False})
    return results


def extract_meta(page_html, url, title_hint):
    def meta_value(patterns):
        for pattern in patterns:
            m = re.search(pattern, page_html, flags=re.I)
            if m:
                return html.unescape(m.group(1)).strip()
        return ""

    title = meta_value([
        r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:title["\']',
        r'<title[^>]*>([\s\S]*?)</title>'
    ])
    account = meta_value([
        r'var\s+nickname\s*=\s*["\']([^"\']+)["\']',
        r'<meta[^>]+property=["\']og:article:author["\'][^>]+content=["\']([^"\']+)["\']',
        r'id=["\']js_name["\'][^>]*>([\s\S]*?)</'
    ])
    publish_date = meta_value([
        r'var\s+ct\s*=\s*["\']?(\d{10})["\']?',
        r'publish_time["\']?\s*[:=]\s*["\']([^"\']+)["\']'
    ])
    if publish_date.isdigit() and len(publish_date) == 10:
        publish_date = dt.datetime.fromtimestamp(int(publish_date)).strftime("%Y-%m-%d")
    text = strip_tags(page_html)
    if not title:
        title = title_hint[:100] or url
    if not account:
        m = re.search(r"公众号[:：]\s*([^\s，。|_-]{2,30})", text)
        account = m.group(1) if m else "未知公众号"
    return {
        "article_url": normalize_article_url(url),
        "article_title": title.replace("微信公众平台", "").strip(" -_"),
        "account_name": strip_tags(account) or "未知公众号",
        "publish_date": publish_date[:10],
        "text": text[:12000]
    }


def parse_dates(text, reference_year):
    candidates = []
    patterns = [
        r'((?:20\d{2})年\s*\d{1,2}月\s*\d{1,2}[日号])',
        r'((?:20\d{2})[./-]\d{1,2}[./-]\d{1,2})',
        r'(\d{1,2}月\s*\d{1,2}[日号])'
    ]
    for pattern in patterns:
        for m in re.finditer(pattern, text):
            raw = m.group(1)
            parsed = parse_one_date(raw, reference_year)
            if parsed:
                candidates.append((m.start(), parsed, raw))
    candidates.sort(key=lambda item: item[0])
    return candidates


def has_review_or_past_cue(title, text):
    sample = (title or "") + " " + (text or "")[:800]
    cues = [
        "会议回顾", "展会回顾", "大会回顾", "精彩回顾", "盛况直击", "圆满落幕",
        "成功举办", "顺利召开", "会议纪要", "开展第二天", "开展首日", "次日盛况",
        "回放", "复盘", "精彩瞬间"
    ]
    return any(cue in sample for cue in cues)


def parse_one_date(raw, reference_year):
    raw = raw.strip()
    m = re.match(r'(20\d{2})年\s*(\d{1,2})月\s*(\d{1,2})[日号]', raw)
    if m:
        return safe_date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    m = re.match(r'(20\d{2})[./-](\d{1,2})[./-](\d{1,2})', raw)
    if m:
        return safe_date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    m = re.match(r'(\d{1,2})月\s*(\d{1,2})[日号]', raw)
    if m:
        return safe_date(reference_year, int(m.group(1)), int(m.group(2)))
    return None


def safe_date(year, month, day):
    try:
        return dt.date(year, month, day)
    except ValueError:
        return None


def extract_conference_name(title, text):
    title = re.sub(r'^[【\[]?(通知|报名|征稿|邀请函|会议通知)[】\]]?[:：\s-]*', '', title).strip()
    title = title.replace("微信公众平台", "").strip()
    name_patterns = [
        r'((?:第[一二三四五六七八九十百\d]+届)?[^。；;\n]{4,60}?(?:大会|会议|论坛|峰会|年会|研讨会|学术会|培训班|展会|博览会))',
        r'会议名称[:：]\s*([^。；;\n]{4,80})'
    ]
    for source in (title, text[:2500]):
        for pattern in name_patterns:
            m = re.search(pattern, source)
            if m:
                name = re.sub(r'\s+', ' ', m.group(1)).strip(" ：:-|｜")
                if len(name) >= 4:
                    return name[:90]
    return title[:90]


def extract_location(text):
    m = re.search(r'(地点|地址|会议地点|举办地点)[:：]\s*([^。；;\n]{2,50})', text)
    if m:
        return m.group(2).strip()
    for city in ("北京", "上海", "广州", "深圳", "杭州", "南京", "苏州", "成都", "武汉", "重庆", "天津", "西安", "青岛", "厦门", "线上"):
        if city in text[:4000]:
            return city
    return ""


def extract_official_link(text):
    for m in re.finditer(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&\'()*+,;=%-]+', text):
        url = m.group(0).rstrip("。；，,)")
        if "mp.weixin.qq.com" not in url:
            return url
    return ""


def classify_article(article, keywords, learned_topics):
    text = article["article_title"] + " " + article["text"]
    biomed_hits = [t for t in keywords["biomed_terms"] if t.lower() in text.lower()]
    conf_hits = [t for t in keywords["conference_terms"] if t.lower() in text.lower()]
    noise_hits = [t for t in keywords["noise_terms"] if t in text]
    topic_hits = [t for t in set(keywords["topic_seed_terms"] + list(learned_topics.keys())) if t and t.lower() in text.lower()]
    score = len(set(biomed_hits)) * 2 + len(set(conf_hits)) * 2 + len(set(topic_hits)) - len(set(noise_hits))
    return score, sorted(set(topic_hits + biomed_hits))[:10]


def title_may_be_conference(title, keywords):
    text = title or ""
    activity_forms = [
        "会议", "大会", "论坛", "峰会", "年会", "研讨会", "学术会", "展会", "博览会",
        "沙龙", "交流会", "发布会", "路演", "研学团", "考察团", "工作坊", "讲座",
        "直播", "培训班", "培训会", "网络研讨会", "线上研讨会", "闭门会", "圆桌会", "专题会"
    ]
    conf_hit = any(t in text for t in activity_forms)
    biomed_hit = any(t.lower() in text.lower() for t in keywords.get("biomed_terms", []))
    year_hit = bool(re.search(r"20\d{2}", text))
    action_hit = any(t in text for t in ("报名", "征稿", "摘要", "参会", "启幕", "召开", "开幕", "注册"))
    negative_only = any(t in text for t in ("研究结果", "重磅研究", "数据公布", "专家解读", "指南更新")) and not conf_hit and not action_hit
    return not negative_only and (conf_hit or (biomed_hit and action_hit and year_hit))


def conference_fingerprint(name, start_date, location, official_link):
    base = "%s|%s|%s|%s" % (
        re.sub(r'\W+', '', name.lower()),
        start_date or "",
        re.sub(r'\s+', '', location or ""),
        official_link or ""
    )
    return hashlib.sha1(base.encode("utf-8")).hexdigest()


def extract_activity_type(title, text):
    sample = "%s %s" % (title or "", (text or "")[:1500])
    activity_types = [
        "网络研讨会", "线上研讨会", "研讨会", "博览会", "发布会", "交流会", "培训班",
        "培训会", "工作坊", "闭门会", "圆桌会", "专题会", "沙龙", "峰会", "论坛",
        "年会", "大会", "展会", "会议", "直播", "讲座", "路演", "研学团", "考察团"
    ]
    for activity_type in activity_types:
        if activity_type in sample:
            return activity_type
    return "其他活动"


def extract_article_nature(title, text):
    sample = "%s %s" % (title or "", (text or "")[:1200])
    rules = [
        ("回顾/报道", ["会议回顾", "大会回顾", "圆满落幕", "成功举办", "盛况直击", "会议报道", "精彩回顾"]),
        ("征稿/摘要征集", ["征稿", "摘要征集", "论文征集"]),
        ("报名/邀请", ["报名", "参会邀请", "诚邀参会", "注册开放", "报名开启"]),
        ("预告/通知", ["预告", "通知", "即将启幕", "即将召开", "即将开幕"]),
        ("直播活动", ["直播", "线上直播"]),
        ("研究解读", ["研究结果", "最新研究", "数据公布", "专家解读"])
    ]
    for nature, terms in rules:
        if any(term in sample for term in terms):
            return nature
    return "无法判断"


def extract_mode(text):
    sample = text or ""
    online = any(term in sample for term in ("线上", "在线", "网络研讨会", "直播间", "腾讯会议", "视频号直播"))
    offline = any(term in sample for term in ("线下", "会议中心", "酒店", "会展中心", "现场参会"))
    if online and offline:
        return "线上+线下"
    if online:
        return "线上"
    if offline:
        return "线下"
    return "待确认"


def extract_organizer(text):
    for label in ("主办单位", "主办方", "主办", "承办单位", "承办方"):
        m = re.search(r'%s[:：]\s*([^。；;\n]{2,100})' % label, text or "")
        if m:
            return m.group(1).strip()
    return ""


def activity_entity_key(row):
    name = re.sub(r'\W+', '', row.get("活动名称", "").lower())
    date_part = row.get("开始日期", "")[:7]
    organizer = re.sub(r'\W+', '', row.get("主办方", "").lower())
    location = re.sub(r'\W+', '', row.get("地点", "").lower())
    base = "%s|%s|%s|%s" % (name, date_part, organizer, location)
    return hashlib.sha1(base.encode("utf-8")).hexdigest()


def activity_row_from_article(article, keywords, learned_topics):
    conference_row = row_from_article(article, keywords, learned_topics)
    nature = extract_article_nature(article["article_title"], article["text"])
    activity_type = extract_activity_type(article["article_title"], article["text"])
    status = "日期待确认"
    if conference_row["会议开始日期"]:
        try:
            start = dt.datetime.strptime(conference_row["会议开始日期"], "%Y-%m-%d").date()
            end = dt.datetime.strptime(conference_row["会议结束日期"] or conference_row["会议开始日期"], "%Y-%m-%d").date()
            if end < today_date():
                status = "已发生"
            elif start <= today_date() <= end:
                status = "正在进行"
            else:
                status = "未发生"
        except ValueError:
            pass
    row = {
        "活动ID": "",
        "活动名称": conference_row["会议名称"] or article["article_title"],
        "活动类型": activity_type,
        "活动状态": status,
        "开始日期": conference_row["会议开始日期"],
        "结束日期": conference_row["会议结束日期"],
        "地点": conference_row["会议地点"],
        "举办形式": extract_mode(article["text"]),
        "主办方": extract_organizer(article["text"]),
        "报名/投稿截止日期": conference_row["报名/投稿截止日期"],
        "领域标签": conference_row["领域标签"],
        "文章性质": nature,
        "公众号": article["account_name"],
        "文章标题": article["article_title"],
        "文章发布日期": article["publish_date"],
        "微信原文链接": article["article_url"],
        "官网/报名链接": conference_row["会议官网/报名链接"],
        "摘要": conference_row["摘要"],
        "首次发现日期": today_date().isoformat(),
        "解析置信度": "高" if conference_row["会议开始日期"] and conference_row["会议名称"] else ("中" if conference_row["会议名称"] else "低")
    }
    row["活动ID"] = activity_entity_key(row)
    return row


def merge_activity(existing, candidate):
    for key, value in candidate.items():
        if key == "相关文章数":
            continue
        if value and not existing.get(key):
            existing[key] = value
    existing["最近发现日期"] = today_date().isoformat()
    if candidate.get("解析置信度") == "高":
        existing["解析置信度"] = "高"
    return existing


def migrate_legacy_activity_candidates(seen_articles, keywords, learned_topics):
    migrated = []
    for url, info in seen_articles.items():
        title = info.get("title", "")
        if not title_may_be_conference(title, keywords):
            continue
        article = {
            "article_url": url,
            "article_title": title,
            "account_name": info.get("account", "未知公众号"),
            "publish_date": info.get("first_seen", ""),
            "text": title
        }
        migrated.append(activity_row_from_article(article, keywords, learned_topics))
    return migrated


def row_from_article(article, keywords, learned_topics):
    score, topics = classify_article(article, keywords, learned_topics)
    dates = parse_dates(article["article_title"] + " " + article["text"], today_date().year)
    name = extract_conference_name(article["article_title"], article["text"])
    start = dates[0][1] if dates else None
    end = dates[1][1] if len(dates) > 1 and dates[1][1] >= dates[0][1] else start
    location = extract_location(article["text"])
    official_link = extract_official_link(article["text"])
    status = "待人工核验"
    reason = ""
    if has_review_or_past_cue(article["article_title"], article["text"]):
        reason = "会议回顾或已发生线索"
    elif score < 4:
        reason = "生物医疗会议相关性不足"
    elif not name:
        reason = "未识别会议名称"
    elif not start:
        reason = "未识别明确会议日期"
    elif end and end < today_date():
        reason = "会议已举办"
    else:
        status = "未举办"
    fp = conference_fingerprint(name, start.isoformat() if start else "", location, official_link)
    return {
        "检索日期": today_date().isoformat(),
        "公众号名称": article["account_name"],
        "文章标题": article["article_title"],
        "文章发布日期": article["publish_date"],
        "会议名称": name,
        "会议开始日期": start.isoformat() if start else "",
        "会议结束日期": end.isoformat() if end else "",
        "会议地点": location,
        "报名/投稿截止日期": "",
        "领域标签": "、".join(topics),
        "会议状态": status,
        "微信公众号文章链接": article["article_url"],
        "会议官网/报名链接": official_link,
        "摘要": article["text"][:240],
        "去重标识": fp,
        "备注": reason
    }


def article_row_for_push(row):
    return {
        "公众号": row.get("公众号名称", ""),
        "文章标题": row.get("文章标题", ""),
        "发布日期": row.get("文章发布日期", ""),
        "发布时间": row.get("文章发布日期", ""),
        "文章地址": row.get("微信公众号文章链接", ""),
        "是否会议": "是",
        "是否包含群": "否"
    }


def should_show_in_pending(row):
    note = row.get("备注", "")
    if row.get("会议状态") == "未举办":
        return False
    if note in ("会议已举办", "会议回顾或已发生线索", "生物医疗会议相关性不足"):
        return False
    return True


def apply_seed_accounts(learned_accounts, seed_config):
    today = today_date().isoformat()
    added = []
    for account in seed_config.get("accounts", []):
        if account not in learned_accounts:
            learned_accounts[account] = {
                "first_seen": today,
                "last_seen": today,
                "valid_count": 0,
                "duplicate_count": 0,
                "invalid_count": 0,
                "future_count": 0,
                "official_link_count": 0,
                "score": 8,
                "tier": "候选观察",
                "last_article_url": "",
                "source": "seed"
            }
            added.append(account)
    return added


def apply_rss_accounts(learned_accounts, rss_config):
    today = today_date().isoformat()
    added = []
    for feed in rss_config.get("feeds", []):
        account = (feed.get("title") or "").strip()
        if not account:
            continue
        if account not in learned_accounts:
            learned_accounts[account] = {
                "first_seen": today,
                "last_seen": today,
                "valid_count": 0,
                "duplicate_count": 0,
                "invalid_count": 0,
                "future_count": 0,
                "official_link_count": 0,
                "score": 5,
                "tier": "RSS订阅源",
                "last_article_url": "",
                "rss_url": feed.get("xmlUrl", ""),
                "source": feed.get("source", "rss")
            }
            added.append(account)
        else:
            learned_accounts[account]["rss_url"] = feed.get("xmlUrl", learned_accounts[account].get("rss_url", ""))
            learned_accounts[account]["source"] = learned_accounts[account].get("source", feed.get("source", "rss"))
    return added


def parse_feed_date(value):
    if not value:
        return ""
    value = value.strip()
    for fmt in ("%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return dt.datetime.strptime(value[:26] if "%f" in fmt else value[:19], fmt).date().isoformat()
        except ValueError:
            pass
    m = re.search(r"20\d{2}-\d{1,2}-\d{1,2}", value)
    return m.group(0) if m else value[:10]


def child_text(node, names):
    wanted = set(n.split(":")[-1] for n in names)
    for child in list(node):
        tag = child.tag.split("}", 1)[-1]
        if tag in wanted and child.text:
            return strip_tags(child.text)
    return ""


def parse_feed_entries(feed_xml, feed_title):
    entries = []
    try:
        root = ET.fromstring(feed_xml.encode("utf-8"))
    except Exception:
        return entries
    ns = {"a": "http://www.w3.org/2005/Atom"}
    atom_entries = root.findall(".//a:entry", ns)
    if atom_entries:
        for entry in atom_entries:
            title = child_text(entry, ["a:title"])
            link = ""
            for link_node in entry.findall("a:link", ns):
                href = link_node.attrib.get("href", "")
                if href:
                    link = href
                    break
            updated = child_text(entry, ["a:updated", "a:published"])
            summary = child_text(entry, ["a:summary", "a:content"])
            if title and link:
                entries.append({"title": title, "link": normalize_article_url(link), "updated": parse_feed_date(updated), "summary": summary, "account": feed_title})
        return entries
    for item in root.findall(".//item"):
        title = child_text(item, ["title"])
        link = child_text(item, ["link"])
        updated = child_text(item, ["pubDate", "updated", "published"])
        summary = child_text(item, ["description", "summary", "content"])
        if title and link:
            entries.append({"title": title, "link": normalize_article_url(link), "updated": parse_feed_date(updated), "summary": summary, "account": feed_title})
    return entries


def discover_rss_articles(rss_config, keywords, learned_topics, user_agent):
    diagnostics = {
        "rss_feeds_configured": len(rss_config.get("feeds", [])),
        "rss_feeds_checked": 0,
        "rss_feed_fetch_success": 0,
        "rss_entries_seen": 0,
        "rss_title_matches": 0,
        "rss_article_fetch_attempts": 0,
        "rss_article_fetch_success": 0,
        "rss_start_index": 0,
        "rss_time_budget_hit": 0
    }
    if not rss_config.get("enabled", True):
        return [], diagnostics
    articles = []
    seen = set()
    started = time.time()
    max_feeds = int(rss_config.get("max_feeds_per_run", 200))
    max_run_seconds = int(rss_config.get("max_run_seconds", 80))
    max_items = int(rss_config.get("max_items_per_feed", 20))
    recent_days = int(rss_config.get("recent_days", 45))
    max_full_articles = int(rss_config.get("max_full_articles_per_run", 8))
    full_articles_fetched = 0
    cutoff = today_date() - dt.timedelta(days=recent_days)
    timeout = int(rss_config.get("request_timeout_seconds", 5))
    feeds = rss_config.get("feeds", [])
    if not feeds:
        return articles, diagnostics
    start_index = today_date().toordinal() % len(feeds)
    diagnostics["rss_start_index"] = start_index
    rotated_feeds = feeds[start_index:] + feeds[:start_index]
    for feed in rotated_feeds[:max_feeds]:
        if time.time() - started > max_run_seconds:
            diagnostics["rss_time_budget_hit"] = 1
            log("RSS time budget reached; continuing with collected candidates.")
            break
        diagnostics["rss_feeds_checked"] += 1
        feed_xml, _ = get_url(feed.get("xmlUrl", ""), user_agent, timeout)
        if not feed_xml:
            continue
        diagnostics["rss_feed_fetch_success"] += 1
        entries = parse_feed_entries(feed_xml, feed.get("title", ""))
        for entry in entries[:max_items]:
            diagnostics["rss_entries_seen"] += 1
            link = entry.get("link", "")
            if not link or link in seen:
                continue
            pub = entry.get("updated", "")
            if re.match(r"20\d{2}-\d{1,2}-\d{1,2}", pub):
                try:
                    if dt.datetime.strptime(pub[:10], "%Y-%m-%d").date() < cutoff:
                        continue
                except ValueError:
                    pass
            feed_article = {
                "article_url": link,
                "article_title": entry.get("title", ""),
                "account_name": entry.get("account", feed.get("title", "未知公众号")),
                "publish_date": pub[:10],
                "text": "%s %s" % (entry.get("title", ""), entry.get("summary", ""))
            }
            if not title_may_be_conference(feed_article["article_title"], keywords):
                continue
            diagnostics["rss_title_matches"] += 1
            seen.add(link)
            if rss_config.get("fetch_full_article_when_title_matches", True) and full_articles_fetched < max_full_articles:
                diagnostics["rss_article_fetch_attempts"] += 1
                page, final_url = get_url(link, user_agent, timeout)
                if page:
                    diagnostics["rss_article_fetch_success"] += 1
                    full_articles_fetched += 1
                    full_article = extract_meta(page, final_url, feed_article["article_title"])
                    full_article["account_name"] = full_article.get("account_name") or feed_article["account_name"]
                    full_article["publish_date"] = full_article.get("publish_date") or feed_article["publish_date"]
                    articles.append(full_article)
                    continue
            articles.append(feed_article)
    return articles, diagnostics


def discover_articles(keywords, sources, learned_accounts, seed_config):
    articles = []
    seen = set()
    started = time.time()
    diagnostics = {
        "search_terms_used": 0,
        "search_requests": 0,
        "search_pages_with_mp_text": 0,
        "raw_result_links": 0,
        "sogou_jump_links": 0,
        "resolved_sogou_links": 0,
        "unresolved_sogou_links": 0,
        "article_fetch_attempts": 0,
        "article_fetch_success": 0,
        "search_time_budget_hit": 0
    }
    account_terms = []
    seed_templates = seed_config.get("account_search_templates", ["{account} 会议 通知"])
    for account, info in sorted(learned_accounts.items(), key=lambda kv: kv[1].get("score", 0), reverse=True)[:40]:
        if info.get("tier") in ("高质量优先", "候选观察"):
            for template in seed_templates[:2]:
                account_terms.append(template.format(account=account))
    search_terms = account_terms + list(keywords["search_keywords"])
    # Keep order while removing duplicates.
    search_terms = list(dict((term, None) for term in search_terms).keys())
    max_terms = int(sources.get("max_search_terms_per_run", len(search_terms)))
    search_terms = search_terms[:max_terms]
    diagnostics["search_terms_used"] = len(search_terms)
    max_results = int(sources.get("max_results_per_keyword", 12))
    max_pages = int(sources.get("max_pages_per_run", 240))
    timeout = int(sources.get("request_timeout_seconds", 15))
    max_run_seconds = int(sources.get("max_run_seconds", 120))
    socket.setdefaulttimeout(timeout)
    ua = sources.get("user_agent", "Mozilla/5.0")
    for term in search_terms:
        for engine in sources["search_engines"]:
            if time.time() - started > max_run_seconds:
                log("Search time budget reached; continuing with collected candidates.")
                diagnostics["search_time_budget_hit"] = 1
                return articles, diagnostics
            if len(articles) >= max_pages:
                return articles, diagnostics
            url = engine["url"].format(query=quote(term, safe=""))
            log("Searching %s: %s" % (engine["name"], term))
            diagnostics["search_requests"] += 1
            page, final_url = get_url(url, ua, timeout)
            if not page:
                continue
            if "mp.weixin.qq.com" in page:
                diagnostics["search_pages_with_mp_text"] += 1
            results = extract_search_results(page, engine["name"], final_url)[:max_results]
            diagnostics["raw_result_links"] += len(results)
            diagnostics["sogou_jump_links"] += len([r for r in results if r.get("needs_resolve")])
            for result in results:
                article_url = result["url"]
                if result.get("needs_resolve"):
                    jump_html, resolved_url = get_url(article_url, ua, timeout, {"Referer": final_url})
                    resolved = normalize_article_url(resolved_url)
                    if not resolved:
                        resolved = normalize_article_url(clean_url(resolved_url))
                    if not resolved and jump_html:
                        nested = extract_search_results(jump_html, engine["name"], resolved_url)
                        resolved = nested[0]["url"] if nested else ""
                    if not resolved:
                        diagnostics["unresolved_sogou_links"] += 1
                        continue
                    diagnostics["resolved_sogou_links"] += 1
                    article_url = resolved
                if article_url in seen:
                    continue
                seen.add(article_url)
                diagnostics["article_fetch_attempts"] += 1
                article_html, article_final = get_url(article_url, ua, timeout)
                if not article_html:
                    continue
                diagnostics["article_fetch_success"] += 1
                article = extract_meta(article_html, article_final, result.get("title_hint", ""))
                article["source_platform"] = result["source_platform"]
                articles.append(article)
                time.sleep(0.5)
    return articles, diagnostics


def update_learning(rows, learned_accounts, learned_topics):
    today = today_date().isoformat()
    new_accounts = []
    new_topics = []
    for row in rows:
        account = row["公众号名称"] or "未知公众号"
        if account not in learned_accounts:
            learned_accounts[account] = {
                "first_seen": today, "last_seen": today, "valid_count": 0, "duplicate_count": 0,
                "invalid_count": 0, "future_count": 0, "official_link_count": 0, "score": 0,
                "tier": "新发现", "last_article_url": ""
            }
            new_accounts.append(account)
        info = learned_accounts[account]
        info["last_seen"] = today
        info["last_article_url"] = row["微信公众号文章链接"]
        if row["会议状态"] == "未举办":
            info["valid_count"] = info.get("valid_count", 0) + 1
            info["future_count"] = info.get("future_count", 0) + 1
            info["score"] = info.get("score", 0) + 6
            if row["会议官网/报名链接"]:
                info["official_link_count"] = info.get("official_link_count", 0) + 1
                info["score"] += 2
        else:
            info["invalid_count"] = info.get("invalid_count", 0) + 1
            info["score"] = info.get("score", 0) - 1
        if info["score"] >= 20:
            info["tier"] = "高质量优先"
        elif info["score"] >= 6:
            info["tier"] = "候选观察"
        elif info["score"] <= -8:
            info["tier"] = "低质量降权"
        for topic in [t for t in row["领域标签"].split("、") if t]:
            if topic not in learned_topics:
                learned_topics[topic] = {"first_seen": today, "last_seen": today, "count": 0, "score": 0}
                new_topics.append(topic)
            learned_topics[topic]["last_seen"] = today
            learned_topics[topic]["count"] = learned_topics[topic].get("count", 0) + 1
            learned_topics[topic]["score"] = learned_topics[topic].get("score", 0) + (3 if row["会议状态"] == "未举办" else 1)
    return new_accounts, new_topics


def xlsx_col(index):
    result = ""
    while index:
        index, rem = divmod(index - 1, 26)
        result = chr(65 + rem) + result
    return result


def xml_escape(value):
    return html.escape("" if value is None else str(value), quote=True)


def make_sheet_xml(rows, headers, hyperlink_cols):
    out = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>']
    out.append('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">')
    out.append('<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>')
    out.append('<sheetData>')
    all_rows = [headers] + [[row.get(h, "") for h in headers] for row in rows]
    hyperlinks = []
    for r_idx, row in enumerate(all_rows, start=1):
        out.append('<row r="%d">' % r_idx)
        for c_idx, value in enumerate(row, start=1):
            ref = "%s%d" % (xlsx_col(c_idx), r_idx)
            out.append('<c r="%s" t="inlineStr"><is><t>%s</t></is></c>' % (ref, xml_escape(value)))
            if r_idx > 1 and headers[c_idx - 1] in hyperlink_cols and value:
                hyperlinks.append((ref, value))
        out.append('</row>')
    out.append('</sheetData>')
    if hyperlinks:
        out.append('<hyperlinks>')
        for idx, (ref, _) in enumerate(hyperlinks, start=1):
            out.append('<hyperlink ref="%s" r:id="rId%d"/>' % (ref, idx))
        out.append('</hyperlinks>')
    out.append('</worksheet>')
    rels = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">']
    for idx, (_, url) in enumerate(hyperlinks, start=1):
        rels.append('<Relationship Id="rId%d" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="%s" TargetMode="External"/>' % (idx, xml_escape(url)))
    rels.append('</Relationships>')
    return "\n".join(out), "\n".join(rels)


def write_xlsx(path, sheets):
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(str(path), "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
%s
</Types>""" % "\n".join('<Override PartName="/xl/worksheets/sheet%d.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' % (i + 1) for i in range(len(sheets))))
        z.writestr("_rels/.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>""")
        sheet_nodes = []
        rel_nodes = []
        for i, sheet in enumerate(sheets, start=1):
            safe_name = sheet["name"][:31].replace("&", "和")
            sheet_nodes.append('<sheet name="%s" sheetId="%d" r:id="rId%d"/>' % (xml_escape(safe_name), i, i))
            rel_nodes.append('<Relationship Id="rId%d" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet%d.xml"/>' % (i, i))
        rel_nodes.append('<Relationship Id="rId%d" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' % (len(sheets) + 1))
        z.writestr("xl/workbook.xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>%s</sheets></workbook>""" % "".join(sheet_nodes))
        z.writestr("xl/_rels/workbook.xml.rels", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">%s</Relationships>""" % "".join(rel_nodes))
        z.writestr("xl/styles.xml", """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="1"><xf/></cellXfs></styleSheet>""")
        for i, sheet in enumerate(sheets, start=1):
            xml, rels = make_sheet_xml(sheet["rows"], sheet["headers"], sheet.get("hyperlink_cols", []))
            z.writestr("xl/worksheets/sheet%d.xml" % i, xml)
            z.writestr("xl/worksheets/_rels/sheet%d.xml.rels" % i, rels)


def build_report(today_rows, pending_rows, new_accounts, learned_accounts, new_topics, learned_topics, history, metrics):
    date_s = today_date().isoformat()
    report_path = REPORTS / ("%s_微信公众号生物医疗会议通知.xlsx" % date_s)
    summary_rows = [{"指标": k, "数值": v} for k, v in [
        ("检索日期", date_s),
        ("今日新增未举办会议数", metrics["new_conferences"]),
        ("今日新发现公众号数", metrics["new_accounts"]),
        ("今日新增主题数", metrics["new_topics"]),
        ("重复会议拦截数", metrics["duplicate_conferences"]),
        ("待人工核验数量", metrics["pending"]),
        ("已排除已发生/无关文章数", metrics.get("excluded", 0)),
        ("本次搜索词数量", metrics.get("search_terms_used", 0)),
        ("本次搜索请求数", metrics.get("search_requests", 0)),
        ("含微信域名的搜索页数", metrics.get("search_pages_with_mp_text", 0)),
        ("搜索结果候选链接数", metrics.get("raw_result_links", 0)),
        ("搜狗跳转链接数", metrics.get("sogou_jump_links", 0)),
        ("成功解析搜狗跳转数", metrics.get("resolved_sogou_links", 0)),
        ("未解析搜狗跳转数", metrics.get("unresolved_sogou_links", 0)),
        ("微信文章抓取尝试数", metrics.get("article_fetch_attempts", 0)),
        ("微信文章抓取成功数", metrics.get("article_fetch_success", 0)),
        ("搜索时间预算是否触发", metrics.get("search_time_budget_hit", 0)),
        ("RSS订阅源配置数", metrics.get("rss_feeds_configured", 0)),
        ("RSS订阅源检查数", metrics.get("rss_feeds_checked", 0)),
        ("RSS订阅源成功数", metrics.get("rss_feed_fetch_success", 0)),
        ("RSS轮转起点", metrics.get("rss_start_index", 0)),
        ("RSS时间预算是否触发", metrics.get("rss_time_budget_hit", 0)),
        ("RSS文章条目数", metrics.get("rss_entries_seen", 0)),
        ("RSS疑似会议标题数", metrics.get("rss_title_matches", 0)),
        ("RSS微信文章抓取成功数", metrics.get("rss_article_fetch_success", 0)),
        ("累计已记录会议数", len(history)),
        ("累计发现公众号数", len(learned_accounts)),
        ("累计主题数", len(learned_topics)),
        ("邮件发送状态", "待发送")
    ]]
    account_rows = []
    for name, info in sorted(learned_accounts.items(), key=lambda kv: kv[1].get("score", 0), reverse=True):
        r = {"公众号名称": name}
        r.update(info)
        account_rows.append(r)
    topic_rows = []
    for name, info in sorted(learned_topics.items(), key=lambda kv: kv[1].get("score", 0), reverse=True):
        r = {"主题词": name}
        r.update(info)
        topic_rows.append(r)
    history_rows = history[-500:]
    push_headers = ["公众号", "文章标题", "发布日期", "发布时间", "文章地址", "是否会议", "是否包含群"]
    push_rows = [article_row_for_push(row) for row in today_rows]
    conference_headers = ["检索日期", "公众号名称", "文章标题", "文章发布日期", "会议名称", "会议开始日期", "会议结束日期", "会议地点", "报名/投稿截止日期", "领域标签", "会议状态", "微信公众号文章链接", "会议官网/报名链接", "摘要", "去重标识", "备注"]
    sheets = [
        {"name": "Articles", "headers": push_headers, "rows": push_rows, "hyperlink_cols": ["文章地址"]},
        {"name": "今日摘要", "headers": ["指标", "数值"], "rows": summary_rows, "hyperlink_cols": []},
        {"name": "今日新增未举办会议", "headers": conference_headers, "rows": today_rows, "hyperlink_cols": ["微信公众号文章链接", "会议官网/报名链接"]},
        {"name": "待人工核验", "headers": conference_headers, "rows": pending_rows, "hyperlink_cols": ["微信公众号文章链接", "会议官网/报名链接"]},
        {"name": "公众号学习库", "headers": ["公众号名称", "first_seen", "last_seen", "valid_count", "duplicate_count", "invalid_count", "future_count", "official_link_count", "score", "tier", "last_article_url"], "rows": account_rows, "hyperlink_cols": ["last_article_url"]},
        {"name": "主题学习库", "headers": ["主题词", "first_seen", "last_seen", "count", "score"], "rows": topic_rows, "hyperlink_cols": []},
        {"name": "历史会议摘要", "headers": conference_headers, "rows": history_rows, "hyperlink_cols": ["微信公众号文章链接", "会议官网/报名链接"]}
    ]
    write_xlsx(report_path, sheets)
    all_path = DATA / "all_conferences.xlsx"
    write_xlsx(all_path, [{"name": "历史会议摘要", "headers": conference_headers, "rows": history, "hyperlink_cols": ["微信公众号文章链接", "会议官网/报名链接"]}])
    return report_path


def build_collection_workbook(activities, collected_articles, activity_links, learned_accounts, learned_topics, metrics):
    date_s = today_date().isoformat()
    report_path = REPORTS / ("%s_微信公众号生物医疗活动采集.xlsx" % date_s)
    activity_headers = [
        "活动ID", "活动名称", "活动类型", "活动状态", "开始日期", "结束日期", "地点", "举办形式",
        "主办方", "报名/投稿截止日期", "领域标签", "文章性质", "主来源公众号", "主文章标题",
        "主微信原文链接", "官网/报名链接", "摘要", "首次发现日期", "最近发现日期", "相关文章数", "解析置信度"
    ]
    activity_rows = []
    for activity in activities.values():
        activity_rows.append({
            "活动ID": activity.get("活动ID", ""),
            "活动名称": activity.get("活动名称", ""),
            "活动类型": activity.get("活动类型", ""),
            "活动状态": activity.get("活动状态", ""),
            "开始日期": activity.get("开始日期", ""),
            "结束日期": activity.get("结束日期", ""),
            "地点": activity.get("地点", ""),
            "举办形式": activity.get("举办形式", ""),
            "主办方": activity.get("主办方", ""),
            "报名/投稿截止日期": activity.get("报名/投稿截止日期", ""),
            "领域标签": activity.get("领域标签", ""),
            "文章性质": activity.get("文章性质", ""),
            "主来源公众号": activity.get("公众号", ""),
            "主文章标题": activity.get("文章标题", ""),
            "主微信原文链接": activity.get("微信原文链接", ""),
            "官网/报名链接": activity.get("官网/报名链接", ""),
            "摘要": activity.get("摘要", ""),
            "首次发现日期": activity.get("首次发现日期", ""),
            "最近发现日期": activity.get("最近发现日期", ""),
            "相关文章数": activity.get("相关文章数", 1),
            "解析置信度": activity.get("解析置信度", "")
        })
    article_headers = [
        "文章ID", "公众号", "文章标题", "发布日期", "文章地址", "是否活动候选", "活动类型",
        "文章性质", "活动状态", "活动ID", "领域标签", "首次发现日期", "最近发现日期"
    ]
    article_rows = list(collected_articles.values())
    link_headers = ["活动ID", "文章ID", "公众号", "文章标题", "文章地址", "关联日期"]
    link_rows = list(activity_links.values())
    source_rows = []
    for name, info in learned_accounts.items():
        source_rows.append({
            "公众号名称": name,
            "来源类型": info.get("source", ""),
            "RSS地址": info.get("rss_url", ""),
            "首次发现": info.get("first_seen", ""),
            "最近发现": info.get("last_seen", ""),
            "有效活动数": info.get("valid_count", 0),
            "无效/待确认数": info.get("invalid_count", 0),
            "评分": info.get("score", 0),
            "分层": info.get("tier", ""),
            "最近文章链接": info.get("last_article_url", "")
        })
    topic_rows = []
    for topic, info in learned_topics.items():
        topic_rows.append({"主题": topic, "首次发现": info.get("first_seen", ""), "最近发现": info.get("last_seen", ""), "出现次数": info.get("count", 0), "评分": info.get("score", 0)})
    diagnostic_rows = [{"指标": key, "数值": value} for key, value in sorted(metrics.items())]
    diagnostic_rows.extend([
        {"指标": "累计活动实体数", "数值": len(activities)},
        {"指标": "累计候选文章数", "数值": len(collected_articles)},
        {"指标": "累计活动文章关联数", "数值": len(activity_links)},
        {"指标": "累计来源数", "数值": len(learned_accounts)},
        {"指标": "累计主题数", "数值": len(learned_topics)}
    ])
    sheets = [
        {"name": "Activities", "headers": activity_headers, "rows": activity_rows, "hyperlink_cols": ["主微信原文链接", "官网/报名链接"]},
        {"name": "Articles", "headers": article_headers, "rows": article_rows, "hyperlink_cols": ["文章地址"]},
        {"name": "Activity-Article Links", "headers": link_headers, "rows": link_rows, "hyperlink_cols": ["文章地址"]},
        {"name": "Sources", "headers": ["公众号名称", "来源类型", "RSS地址", "首次发现", "最近发现", "有效活动数", "无效/待确认数", "评分", "分层", "最近文章链接"], "rows": source_rows, "hyperlink_cols": ["RSS地址", "最近文章链接"]},
        {"name": "Topics", "headers": ["主题", "首次发现", "最近发现", "出现次数", "评分"], "rows": topic_rows, "hyperlink_cols": []},
        {"name": "Diagnostics", "headers": ["指标", "数值"], "rows": diagnostic_rows, "hyperlink_cols": []}
    ]
    write_xlsx(report_path, sheets)
    write_xlsx(DATA / "all_activities.xlsx", sheets[:3])
    return report_path


def send_email(mail_env, subject, body, attachment):
    msg = MIMEMultipart()
    msg["From"] = mail_env["MAIL_FROM"]
    msg["To"] = mail_env["MAIL_TO"]
    if mail_env.get("MAIL_CC"):
        msg["Cc"] = mail_env["MAIL_CC"]
    msg["Date"] = email.utils.formatdate(localtime=True)
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))
    with attachment.open("rb") as fh:
        part = MIMEApplication(fh.read(), Name=attachment.name)
    part["Content-Disposition"] = 'attachment; filename="%s"' % attachment.name
    msg.attach(part)
    recipients = []
    for key in ("MAIL_TO", "MAIL_CC", "MAIL_BCC"):
        recipients.extend([x.strip() for x in mail_env.get(key, "").split(",") if x.strip()])
    host = mail_env["SMTP_HOST"]
    port = int(mail_env.get("SMTP_PORT", "465"))
    use_ssl = mail_env.get("MAIL_USE_SSL", "true").lower() == "true"
    use_tls = mail_env.get("MAIL_USE_TLS", "false").lower() == "true"
    if use_ssl:
        server = smtplib.SMTP_SSL(host, port, timeout=30)
    else:
        server = smtplib.SMTP(host, port, timeout=30)
    try:
        if use_tls:
            server.starttls()
        server.login(mail_env["SMTP_USER"], mail_env["SMTP_PASSWORD"])
        server.sendmail(mail_env["MAIL_FROM"], recipients, msg.as_string())
    finally:
        server.quit()


def run(args):
    ensure_dirs()
    keywords = load_json(CONFIG / "keywords.json", {})
    sources = load_json(CONFIG / "sources.json", {})
    seed_config = load_json(CONFIG / "seed_accounts.json", {"accounts": [], "account_search_templates": []})
    rss_config = load_json(CONFIG / "rss_feeds.json", {"enabled": False, "feeds": []})
    seen_articles = load_json(DATA / "seen_articles.json", {})
    seen_conferences = load_json(DATA / "seen_conferences.json", {})
    learned_accounts = load_json(DATA / "learned_accounts.json", {})
    learned_topics = load_json(DATA / "learned_topics.json", {})
    history = load_json(DATA / "history_conferences.json", [])
    activities = load_json(DATA / "activities.json", {})
    collected_articles = load_json(DATA / "collected_articles.json", {})
    activity_links = load_json(DATA / "activity_article_links.json", {})
    if args.rebuild_collection:
        activities = {}
        collected_articles = {}
        activity_links = {}
    run_state = load_json(DATA / "run_state.json", {})
    date_s = today_date().isoformat()
    if not args.force and run_state.get("last_successful_send_date") == date_s:
        log("Already sent today's report; exiting.")
        return 0

    seeded_accounts = apply_seed_accounts(learned_accounts, seed_config)
    if seeded_accounts:
        log("Seed accounts added: %d" % len(seeded_accounts))
    rss_seeded_accounts = apply_rss_accounts(learned_accounts, rss_config)
    if rss_seeded_accounts:
        log("RSS accounts added to learning pool: %d" % len(rss_seeded_accounts))

    ua = sources.get("user_agent", "Mozilla/5.0")
    if args.no_network:
        log("Network discovery skipped by --no-network.")
        rss_articles = []
        rss_diagnostics = {
            "rss_feeds_configured": len(rss_config.get("feeds", [])), "rss_feeds_checked": 0,
            "rss_feed_fetch_success": 0, "rss_entries_seen": 0, "rss_title_matches": 0,
            "rss_article_fetch_attempts": 0, "rss_article_fetch_success": 0,
            "rss_start_index": 0, "rss_time_budget_hit": 0
        }
    else:
        log("Discovering articles from RSS subscriptions...")
        rss_articles, rss_diagnostics = discover_rss_articles(rss_config, keywords, learned_topics, ua)
        log("Discovered %d RSS article candidates." % len(rss_articles))

    search_threshold = int(sources.get("search_when_rss_candidates_below", 8))
    if not args.no_network and sources.get("enabled", True) and len(rss_articles) < search_threshold:
        log("Discovering WeChat public articles from search engines...")
        search_articles, diagnostics = discover_articles(keywords, sources, learned_accounts, seed_config)
    else:
        log("Skipping search engine discovery; RSS candidates are sufficient or search is disabled.")
        search_articles = []
        diagnostics = {
            "search_terms_used": 0,
            "search_requests": 0,
            "search_pages_with_mp_text": 0,
            "raw_result_links": 0,
            "sogou_jump_links": 0,
            "resolved_sogou_links": 0,
            "unresolved_sogou_links": 0,
            "article_fetch_attempts": 0,
            "article_fetch_success": 0,
            "search_time_budget_hit": 0
        }
    articles = rss_articles + search_articles
    diagnostics.update(rss_diagnostics)
    log("Discovered %d total article candidates." % len(articles))

    rows = []
    activity_candidates = migrate_legacy_activity_candidates(seen_articles, keywords, learned_topics)
    duplicate_articles = 0
    for article in articles:
        article_url = article["article_url"]
        existing_article = seen_articles.get(article_url)
        row = row_from_article(article, keywords, learned_topics)
        rows.append(row)
        if title_may_be_conference(article["article_title"], keywords):
            activity_candidates.append(activity_row_from_article(article, keywords, learned_topics))
        seen_articles[article_url] = {
            "first_seen": existing_article.get("first_seen", date_s) if existing_article else date_s,
            "last_seen": date_s,
            "title": article["article_title"],
            "account": article["account_name"],
            "status": row["会议状态"],
            "note": row["备注"]
        }

    new_accounts, new_topics = update_learning(rows, learned_accounts, learned_topics)
    pending_rows = []
    excluded_rows = []
    new_rows = []
    duplicate_conferences = 0
    for row in rows:
        fp = row["去重标识"]
        if row["会议状态"] != "未举办":
            if should_show_in_pending(row):
                pending_rows.append(row)
            else:
                excluded_rows.append(row)
            continue
        if fp in seen_conferences:
            duplicate_conferences += 1
            account = row["公众号名称"]
            if account in learned_accounts:
                learned_accounts[account]["duplicate_count"] = learned_accounts[account].get("duplicate_count", 0) + 1
                learned_accounts[account]["score"] = learned_accounts[account].get("score", 0) - 2
            continue
        seen_conferences[fp] = {"first_seen": date_s, "meeting_name": row["会议名称"], "start_date": row["会议开始日期"], "article_url": row["微信公众号文章链接"]}
        history.append(row)
        new_rows.append(row)

    metrics = {
        "new_conferences": len(new_rows),
        "new_accounts": len(new_accounts),
        "new_topics": len(new_topics),
        "duplicate_conferences": duplicate_conferences + duplicate_articles,
        "pending": len(pending_rows),
        "excluded": len(excluded_rows),
        "seeded_accounts": len(seeded_accounts),
        "rss_seeded_accounts": len(rss_seeded_accounts)
    }
    metrics.update(diagnostics)
    new_activity_entities = 0
    new_collected_articles = 0
    new_activity_links = 0
    for candidate in activity_candidates:
        activity_id = candidate["活动ID"]
        article_url = candidate["微信原文链接"]
        article_id = hashlib.sha1(article_url.encode("utf-8")).hexdigest()
        if activity_id not in activities:
            stored = dict(candidate)
            stored["相关文章数"] = 0
            stored["最近发现日期"] = date_s
            activities[activity_id] = stored
            new_activity_entities += 1
        else:
            activities[activity_id] = merge_activity(activities[activity_id], candidate)
        if article_id not in collected_articles:
            new_collected_articles += 1
        collected_articles[article_id] = {
            "文章ID": article_id,
            "公众号": candidate["公众号"],
            "文章标题": candidate["文章标题"],
            "发布日期": candidate["文章发布日期"],
            "文章地址": article_url,
            "是否活动候选": "是",
            "活动类型": candidate["活动类型"],
            "文章性质": candidate["文章性质"],
            "活动状态": candidate["活动状态"],
            "活动ID": activity_id,
            "领域标签": candidate["领域标签"],
            "首次发现日期": collected_articles.get(article_id, {}).get("首次发现日期", date_s),
            "最近发现日期": date_s
        }
        link_id = "%s|%s" % (activity_id, article_id)
        if link_id not in activity_links:
            new_activity_links += 1
            activities[activity_id]["相关文章数"] = activities[activity_id].get("相关文章数", 0) + 1
        activity_links[link_id] = {
            "活动ID": activity_id,
            "文章ID": article_id,
            "公众号": candidate["公众号"],
            "文章标题": candidate["文章标题"],
            "文章地址": article_url,
            "关联日期": date_s
        }
    metrics["new_activity_entities"] = new_activity_entities
    metrics["new_collected_articles"] = new_collected_articles
    metrics["new_activity_links"] = new_activity_links
    report_path = build_collection_workbook(activities, collected_articles, activity_links, learned_accounts, learned_topics, metrics)
    log("Report generated: %s" % report_path)

    save_json(DATA / "seen_articles.json", seen_articles)
    save_json(DATA / "seen_conferences.json", seen_conferences)
    save_json(DATA / "learned_accounts.json", learned_accounts)
    save_json(DATA / "learned_topics.json", learned_topics)
    save_json(DATA / "history_conferences.json", history)
    save_json(DATA / "activities.json", activities)
    save_json(DATA / "collected_articles.json", collected_articles)
    save_json(DATA / "activity_article_links.json", activity_links)
    daily_metrics = load_json(DATA / "daily_metrics.json", [])
    daily_metrics.append({"date": date_s, **metrics})
    save_json(DATA / "daily_metrics.json", daily_metrics[-1000:])

    subject = "【每日生物医疗活动采集】%s 新增 %d 个活动实体" % (date_s, new_activity_entities)
    body = "\n".join([
        "今日新增活动实体：%d 个" % new_activity_entities,
        "今日新增候选文章：%d 篇" % new_collected_articles,
        "今日新增活动文章关联：%d 条" % new_activity_links,
        "今日新发现公众号：%d 个" % len(new_accounts),
        "今日冷启动种子公众号：%d 个" % len(seeded_accounts),
        "今日导入RSS公众号：%d 个" % metrics.get("rss_seeded_accounts", 0),
        "今日新增主题：%d 个" % len(new_topics),
        "重复会议/文章拦截：%d 条" % metrics["duplicate_conferences"],
        "待人工核验：%d 条" % len(pending_rows),
        "已排除已发生/无关文章：%d 条" % metrics.get("excluded", 0),
        "搜索候选链接：%d 条，微信文章抓取成功：%d 条" % (metrics.get("raw_result_links", 0), metrics.get("article_fetch_success", 0)),
        "RSS源检查：%d 个，RSS疑似会议标题：%d 条" % (metrics.get("rss_feeds_checked", 0), metrics.get("rss_title_matches", 0)),
        "",
        "Excel 附件已生成，详见各 Sheet。",
        "本地路径：%s" % report_path
    ])

    if args.no_email:
        log("Email skipped by --no-email.")
    else:
        mail_env = load_env(CONFIG / "mail.env")
        send_email(mail_env, subject, body, report_path)
        run_state["last_successful_send_date"] = date_s
        run_state["last_successful_send_at"] = now_local().isoformat(timespec="seconds")
        log("Email sent: %s" % mail_env.get("MAIL_TO", ""))
    run_state["last_run_date"] = date_s
    run_state["last_report_path"] = str(report_path)
    save_json(DATA / "run_state.json", run_state)
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Run even if today's report was already sent.")
    parser.add_argument("--no-email", action="store_true", help="Generate report and update data without sending email.")
    parser.add_argument("--no-network", action="store_true", help="Rebuild collection data from local history without network discovery.")
    parser.add_argument("--rebuild-collection", action="store_true", help="Rebuild activity collection entities from currently available candidates.")
    args = parser.parse_args()
    try:
        return run(args)
    except Exception as exc:
        log("Fatal error: %s" % exc)
        return 1


if __name__ == "__main__":
    sys.exit(main())

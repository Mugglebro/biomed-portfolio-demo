# 数据结构规划

## 为什么要从 Excel 逐步迁移到数据库

Excel 适合早期手工维护，但当系统进入网页化后，需要记录更多状态，例如用户反馈、日报批次、推送历史、规则版本。数据库更适合保存这些结构化关系。

建议使用 SQLite，原因是：

- 免费。
- 本地可运行。
- 不需要服务器。
- Python 原生支持。
- 后续可以平滑升级到 MySQL 或 PostgreSQL。

## 数据表设计

### news_items

保存所有候选资讯。

字段建议：

- id
- title
- source
- source_type
- url
- published_date
- collected_date
- category
- company
- summary_cn
- importance_score
- status
- need_verify
- verify_reason
- pushed
- pushed_at
- created_at
- updated_at

### digest_batches

保存每天的日报批次。

字段建议：

- id
- digest_date
- subject
- status
- sent_at
- item_count
- verify_count
- feedback_count
- output_txt_path
- output_html_path
- attachment_path

### digest_items

保存某一期日报包含了哪些资讯。

字段建议：

- id
- batch_id
- news_id
- sort_order
- section
- editor_note

### feedback_records

保存用户反馈。

字段建议：

- id
- batch_id
- news_id
- feedback_user
- feedback_type
- feedback_note
- created_at
- trust_score
- is_suspicious

### source_rules

保存来源权重。

字段建议：

- id
- source_name
- source_type
- weight
- require_primary_check
- last_reviewed_at

### topic_rules

保存主题偏好。

字段建议：

- id
- topic_name
- weight
- include_keywords
- exclude_keywords
- updated_reason

## 数据流

```text
自动检索脚本
  ↓
news_items 候选资讯表
  ↓
Web 工作台筛选和审核
  ↓
digest_batches / digest_items 日报批次
  ↓
邮件发送
  ↓
feedback_records 用户反馈
  ↓
source_rules / topic_rules 规则更新
```

## 第一版接入方式

短期不必立刻重写全部 Python 逻辑。可以先做一个中间层：

1. Python 继续检索并筛选资讯。
2. 每天输出 `outputs/web_candidates_YYYYMMDD.json`。
3. 网页读取这个 JSON 文件展示候选。
4. 后续再将 JSON 输出替换为 SQLite 查询。

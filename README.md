# 生物医药信息产品作品集

这个仓库用于集中展示三部分工作：

- `public_demo/`：医药情报台，适合直接通过 GitHub Pages 展示。
- `web_app/`：之前部署在腾讯云上的 BioEvent Intelligence 用户端与管理员端演示源码。
- `conference_monitor/`：微信公众号 / RSS 生物医疗会议活动检索、去重、学习和日报邮件推送的后端源码安全公开版。

GitHub Pages 发布后，根页面会提供两个可点击入口：

- `/med-desk/`：医药情报台。
- `/bioevent/`：BioEvent Intelligence 活动系统。

当前公开版本使用脱敏演示数据，不包含真实邮箱授权码、内部 Excel、运行日志、个人收件人或私有配置。

## 目录说明

### 医药情报台

`public_demo/` 是一个静态网页 Demo，展示内容运营每天处理公开医药产业资讯的流程：候选资讯筛选、来源核验、日报编排、规则库和日报推送记录。

### BioEvent Intelligence

`web_app/` 是完整的 Next.js 前端项目，包含用户端和管理员端：

- 用户端：活动发现、搜索筛选、详情追溯、收藏、备注、工作标签、个人账户。
- 管理员端：运营总览、活动待审、文章解析、来源管理、重复合并、变更确认、采集规则、账号管理。

为了适配 GitHub Pages，项目在发布时会以静态导出方式构建到 `/bioevent/` 子路径。

### 会议信息检索后端

`conference_monitor/` 是本地运行的后端工具，用于检索公开订阅源中的生物医疗会议活动，保留未举办活动，按历史记录去重，并生成每日 Excel 报告。邮件配置请参考 `conference_monitor/config/mail.env.example`。

真实的 `mail.env`、Excel 报告、日志和长期运行数据不会提交到仓库。

## GitHub Pages 发布方式

仓库已包含 `.github/workflows/pages.yml`。推送到 `main` 或 `master` 后，GitHub Actions 会：

1. 构建 `web_app/`；
2. 复制 `public_demo/` 到 `/med-desk/`；
3. 复制 `web_app/out/` 到 `/bioevent/`；
4. 生成根入口页；
5. 发布到 GitHub Pages。

如果是第一次发布，需要在 GitHub 仓库设置中开启 Pages，并将 Source 选择为 `GitHub Actions`。

## 本地运行 BioEvent Intelligence

```bash
cd web_app
npm install
npm run dev
```

## 本地运行会议信息检索

```bash
cd conference_monitor
python .\scripts\daily_run.py --force --no-email
```

如果要真实发送邮件，复制 `conference_monitor/config/mail.env.example` 为 `conference_monitor/config/mail.env`，填入自己的 SMTP 授权码。不要把真实配置提交到 GitHub。

---

以下内容是早期本地资讯雷达工具说明，作为实现背景保留。

## ZettaLab 生物医药资讯雷达

这是一个本地半自动化工具，用于维护 ZettaLab / 衍因科技生物医药资讯 Excel 库，可从公开 RSS/Atom 订阅源自动检索资讯，也支持人工录入后筛选今日重点内容，生成企业微信邮箱日报。

当前版本边界很清楚：不使用 PubMed API、ClinicalTrials.gov API、OpenAI API，不抓取微信公众号，不绕过登录或验证码。`--fetch` 模式只读取 `config.yaml` 中配置的公开 RSS/Atom 订阅源，并对审批、临床、融资、监管、合作金额等高风险信息打上“需人工核验”提醒。

## 适用场景

- 运营人员每天人工录入或复制粘贴资讯到 Excel。
- 自动检查标题、来源、链接、摘要、评分、推送状态等字段。
- 自动筛选今日建议推送资讯，生成 txt 和 HTML 日报。
- SMTP 配置完整时，可发送到企业微信邮箱。
- 邮件发送成功后，写回 `是否已推送` 和 `推送时间`，避免重复推送。

## 安装方式

建议使用 Python 3.10+。

```bash
cd zettalab_biomed_radar
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
```

推荐使用项目目录内的 `.venv` 虚拟环境，避免影响其他 Python 项目或全局配置。

如果你暂时没有真实模板，可以先生成样例：

```bash
python tests/create_sample_news.py
```

## Excel 字段说明

核心工作表默认是 `资讯库`。工具会自动兼容中文表头，不要求手动改成英文。

建议字段包括：编号、标题、来源、原文链接、发布时间、收集时间、语言、地区、类别、中文摘要、关键实体、与ZettaLab相关性、重要性评分、内容角度、推荐平台、状态、是否需人工核验、是否今日推送、是否已推送、推送时间、人工备注。

如果真实模板缺少字段，程序会在日志中提醒。缺少 `是否已推送` 或 `推送时间` 时，日报仍可生成，但发送成功后无法写回推送状态。

## 邮箱配置

复制 `.env.example` 为 `.env`，填写企业微信邮箱 SMTP 信息：

```bash
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_USER=your_name@example.com
SMTP_PASSWORD=邮箱授权码
MAIL_FROM=your_name@example.com
MAIL_TO=receiver@example.com
MAIL_CC=
MAIL_BCC=
MAIL_USE_SSL=true
MAIL_USE_TLS=false
```

请不要把真实密码写入代码或提交到版本库。企业微信邮箱常用授权码，不一定是登录密码。

## 运行示例

### Windows 一键运行

双击项目目录中的：

- `一键生成日报.bat`：自动检索公开资讯，写入 `auto_news_cn.xlsx`，并生成 dry-run 日报；
- `一键测试邮件发送.bat`：读取 `.env`，发送一封 SMTP 测试邮件；
- `一键生成并发送日报.bat`：自动检索、生成日报并通过 SMTP 真实发送；
- `一键安装每日定时任务.bat`：安装每天 10:00 自动发送任务，并在用户登录后延迟 5 分钟补跑一次；
- `一键取消每日定时任务.bat`：删除自动发送任务；
- `一键仅检索入库.bat`：只自动检索并写入 Excel，不生成日报；
- `一键检查数据质量.bat`：检查当前 `auto_news_cn.xlsx` 的字段质量。

这些脚本只使用项目目录内的 `.venv`，不会安装依赖到其他项目或全局环境。

`一键生成日报.bat` 会同时生成两类 Excel：

- 累计总表：`auto_news_cn.xlsx`，每天继续追加新资讯，按 URL 去重；
- 当日快照：`outputs/auto_news_cn_YYYYMMDD.xlsx`，例如 `outputs/auto_news_cn_20260525.xlsx`。

### 定时发送建议流程

1. 复制 `.env.example` 为 `.env`，填写 SMTP 信息。
2. 双击 `一键测试邮件发送.bat`，确认邮箱能正常发信。
3. 双击 `一键生成并发送日报.bat`，手动验证一次完整发送链路。
4. 双击 `一键安装每日定时任务.bat`，安装每天 10:00 自动任务。
5. 如果要停止自动发送，双击 `一键取消每日定时任务.bat`。

定时任务会创建两个 Windows 任务：

- `ZettaLab_Biomed_Radar_Daily_1000`：每天 10:00 运行；
- `ZettaLab_Biomed_Radar_Startup_Catchup`：用户登录后延迟 5 分钟运行，用于错过 10:00 后补跑。

生成日报但不发送：

```bash
python main.py --excel "ZettaLab_生物医药资讯库模板.xlsx" --dry-run
```

先从公开 RSS 源自动检索，再生成日报：

```bash
python main.py --excel "auto_news.xlsx" --fetch --dry-run --verbose
```

只自动检索并写入 Excel，不生成日报：

```bash
python main.py --excel "auto_news.xlsx" --fetch-only --verbose
```

使用样例表验证：

```bash
python main.py --excel "sample_news.xlsx" --dry-run --verbose
```

生成并发送日报：

```bash
python main.py --excel "ZettaLab_生物医药资讯库模板.xlsx" --send
```

指定日期生成：

```bash
python main.py --excel "ZettaLab_生物医药资讯库模板.xlsx" --date 2026-05-25 --dry-run
```

仅检查数据质量：

```bash
python main.py --excel "ZettaLab_生物医药资讯库模板.xlsx" --validate-only
```

输出调试信息：

```bash
python main.py --excel "ZettaLab_生物医药资讯库模板.xlsx" --dry-run --verbose
```

## 如何手动录入资讯

每天在 `资讯库` 中新增行，至少填写 `标题` 和 `来源`。建议补充 `原文链接`、`收集时间`、`重要性评分`、`状态`、`中文摘要`、`内容角度` 和 `推荐平台`。

筛选规则默认是：`收集时间` 为今天或 `是否今日推送=是`，并且 `重要性评分>=4` 或 `状态=可发帖/建议推送`，同时 `是否已推送` 不是“是”。

## 如何查看输出

- 文本日报：`outputs/zettalab_digest_YYYYMMDD.txt`
- HTML 邮件正文：`outputs/zettalab_digest_YYYYMMDD.html`
- 发送记录：`outputs/send_record_YYYYMMDD.csv`
- 运行日志：`logs/digest_YYYYMMDD.log`

## 如何确认邮件是否发送成功

查看日志中的 `邮件发送成功`。如果 SMTP 未配置完整，程序会提示“已跳过邮件发送”，并且不会写回 Excel 的推送状态。

`--dry-run` 一定不会发送邮件，也不会写回 Excel。

## 如何恢复备份

发送成功并写回 Excel 前，程序会在 `backups/` 中生成备份，例如：

```text
backups/ZettaLab_生物医药资讯库模板_20260525_142500.xlsx
```

如需恢复，关闭正在打开的 Excel 文件，将备份文件复制回原位置并改回原文件名即可。

## 常见问题

1. 提示 Excel 文件不存在：检查 `--excel` 路径。当前 Windows 工作区无法直接读取 `/mnt/data/...` 时，请把模板放到项目目录或传入 Windows 路径。
2. 提示工作表不存在：确认模板中是否有 `资讯库`，或在 `config.yaml` 修改 `excel.sheet_name`。
3. 日期格式混乱：建议统一使用 `YYYY-MM-DD`。
4. 评分是文本：程序会尽量转换，无法转换时进入提醒。
5. Excel 被打开导致写回失败：关闭 Excel 后重新运行 `--send`。
6. 没有符合条件资讯：仍会生成空日报文本；默认不会发送空日报，除非在配置中启用 `enable_empty_digest`。

## 后续升级方向

- 接入 RSS 自动采集；
- 接入 PubMed API；
- 接入 ClinicalTrials.gov API；
- 接入飞书机器人；
- 接入大模型 API 做自动摘要、标签和评分，但仍保留人工确认环节。

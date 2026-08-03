# BioEvent Intelligence Admin Demo Scope

## 目标

管理员后台用于展示 BioEvent Intelligence 在内容运营侧的管理能力。当前版本是前端演示后台，服务于作品集展示，不接入真实采集服务、生产数据库或企业权限系统。

## 路由

- `/admin`：质量看板
- `/admin/activities`：活动审核
- `/admin/articles`：来源文章
- `/admin/sources`：来源账号
- `/admin/dedupe`：合并处理
- `/admin/updates`：更新确认
- `/admin/rules`：采集规则

## 真实交互

- 活动审核状态切换
- 来源账号启用、观察、暂停
- 重复活动候选合并或忽略
- 活动更新确认或忽略
- 采集规则启停
- 采集关键词编辑

以上交互使用 `localStorage` 持久化，仅作用于当前浏览器。

## 暂不实现

- 真实管理员登录与角色权限
- 真实公众号或 RSS 抓取
- 后端数据库
- 审核流转通知
- 批量导入导出
- 生产环境审计日志

## 数据口径

后台复用固定演示数据快照，并增加管理员演示数据：

- `AdminActivityReview`
- `AdminSourceMonitor`
- `AdminMergeCandidate`
- `AdminUpdateReview`
- `AdminCollectionRule`

管理员状态集中定义在 `src/data/admin-fixtures.ts`。

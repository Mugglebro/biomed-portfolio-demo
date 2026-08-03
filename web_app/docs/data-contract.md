# BioEvent Intelligence 数据契约

## Activity

活动是多来源聚合、去重后的标准化结果。

字段：

- `id`: 活动唯一 ID；
- `title`: 展示标题；
- `normalizedTitle`: 去重和检索使用的标准化标题；
- `type`: 活动类型，例如峰会、研讨会、沙龙、展会、论坛；
- `topics`: 主题数组；
- `startDate`: 开始日期，ISO 日期字符串；
- `endDate`: 结束日期，ISO 日期字符串；
- `city`: 城市；
- `venue`: 场地；
- `format`: 举办形式，`offline`、`online` 或 `hybrid`；
- `organizerId`: 主办方 ID；
- `registrationStatus`: 报名状态，`open`、`not_open`、`closing_soon`、`closed`、`invite_only` 或 `unknown`；
- `registrationUrl`: 原始报名或发布页面 URL；
- `status`: 活动状态，`upcoming`、`ended`、`postponed` 或 `cancelled`；
- `firstDiscoveredAt`: 首次发现时间；
- `lastVerifiedAt`: 最近确认时间；
- `sourceCount`: 关联来源数量；
- `articleCount`: 关联文章数量；
- `completenessStatus`: 信息完整度，`complete`、`partial` 或 `needs_review`；
- `summary`: 活动摘要；
- `dedupeKey`: 去重键；
- `dedupeReason`: 多来源合并依据；
- `priorityScore`: 演示用排序分；
- `featured`: 是否作为重点活动展示。

## Article

文章是从公众号、主办方网站、行业媒体或 RSS 来源中发现的公开内容。

字段：

- `id`: 文章唯一 ID；
- `title`: 文章标题；
- `sourceId`: 来源 ID；
- `sourceAccountName`: 来源账号或站点名称；
- `publishedAt`: 发布时间；
- `originalUrl`: 原文链接；
- `articleNature`: 文章性质，`registration_invite`、`notice`、`agenda_update`、`speaker_update`、`recap`；
- `activityId`: 关联活动 ID；
- `extractedFields`: 从文章中抽取出的字段；
- `firstDiscoveredAt`: 首次发现时间。

## Source

来源表示公众号、网站、行业媒体或 RSS。

字段：

- `id`: 来源唯一 ID；
- `name`: 来源名称；
- `type`: 来源类型，`wechat`、`organizer_site`、`media` 或 `rss`；
- `accountName`: 账号名或站点名；
- `homepageUrl`: 主页 URL。

## Organizer

主办方是活动组织机构或发布主体。

字段：

- `id`: 主办方唯一 ID；
- `name`: 主办方名称；
- `type`: 主办方类型；
- `summary`: 简介；
- `homepageUrl`: 官网；
- `channels`: 公开发布渠道；
- `topicFocus`: 常见主题；
- `cityFocus`: 常见城市；
- `recentActivityIds`: 近期活动 ID；
- `lastVerifiedAt`: 最近确认时间。

## ActivityUpdate

活动更新表示系统从来源文章中发现并确认的字段变化。

字段：

- `id`: 更新唯一 ID；
- `activityId`: 活动 ID；
- `updateType`: 更新类型，`time_changed`、`location_changed`、`registration_open`、`deadline_soon`、`agenda_update`、`speaker_update`、`postponed`、`cancelled`；
- `field`: 变化字段；
- `previousValue`: 原值；
- `newValue`: 新值；
- `detectedAt`: 检测时间；
- `confirmedAt`: 确认时间；
- `articleId`: 支撑该更新的文章 ID。

## ActivityArticleLink

活动与文章之间的关联。

字段：

- `id`: 关联唯一 ID；
- `activityId`: 活动 ID；
- `articleId`: 文章 ID；
- `matchedBy`: 匹配方式；
- `matchedFields`: 匹配字段；
- `confidence`: 演示用匹配置信度；
- `isPrimary`: 是否主来源。

## UserSavedActivity

浏览器本地保存的用户工作清单。

字段：

- `activityId`: 活动 ID；
- `userId`: 用户 ID，未登录时为本地浏览器；
- `savedAt`: 收藏时间；
- `workTag`: 工作标签，`to_register`、`bd_follow_up`、`content_topic`、`recommended`、`attended`；
- `note`: 备注；
- `calendarSynced`: 是否已同步日历；
- `notificationsEnabled`: 是否开启该活动提醒；
- `updatedAt`: 最近修改时间。

## User

- `id`: 用户 ID；
- `name`: 姓名；
- `email`: 邮箱；
- `avatarUrl`: 头像；
- `organization`: 所属机构；
- `role`: 职业方向；
- `createdAt`: 创建时间。

## UserPreferences

- `topicIds`: 关注领域；
- `cities`: 关注城市；
- `eventTypes`: 活动类型；
- `includeOnline`: 是否包含线上活动；
- `notificationPreferences`: 通知偏好。

## UserFollow

- `userId`: 用户 ID；
- `entityType`: 关注对象类型；
- `entityId`: 关注对象 ID；
- `followedAt`: 关注时间。

## NotificationPreference

- `registrationOpened`: 活动开放报名；
- `registrationDeadline`: 报名截止提醒；
- `eventChanged`: 活动变更提醒；
- `agendaUpdated`: 议程更新；
- `speakersUpdated`: 嘉宾更新；
- `organizerPublished`: 主办方新活动提醒。

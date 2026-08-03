import type {
  AdminActivityReview,
  AdminCollectionRule,
  AdminMergeCandidate,
  AdminSourceMonitor,
  AdminUpdateReview,
  AdminUser,
} from "./types";

export const demoAdminUsers: Array<AdminUser & { password: string }> = [
  {
    id: "admin-demo-001",
    name: "运营管理员",
    email: "admin@bioevent.local",
    password: "BioAdmin2026",
    role: "super_admin",
    team: "内容运营",
  },
];

export const adminActivityReviews: AdminActivityReview[] = [
  {
    activityId: "act-adc-forum-2026",
    status: "approved",
    owner: "运营审核",
    note: "活动信息完整，来源可追溯。",
    reviewedAt: "2026-07-24T11:20:00+08:00",
  },
  {
    activityId: "act-rwe-summit-2026",
    status: "pending",
    owner: "数据运营",
    note: "待确认报名截止日期。",
  },
  {
    activityId: "act-cell-therapy-2026",
    status: "needs_revision",
    owner: "内容运营",
    note: "嘉宾信息仍不完整。",
  },
  {
    activityId: "act-cphi-biopharma-2026",
    status: "pending",
    owner: "数据运营",
    note: "等待主办方页面更新展区排期。",
  },
  {
    activityId: "act-ai-med-salon-2026",
    status: "needs_revision",
    owner: "运营审核",
    note: "延期后的日期需要二次确认。",
  },
  {
    activityId: "act-ivd-expo-2026",
    status: "approved",
    owner: "内容运营",
    note: "报名入口和场馆信息已确认。",
    reviewedAt: "2026-07-22T11:40:00+08:00",
  },
];

export const adminSourceMonitors: AdminSourceMonitor[] = [
  {
    sourceId: "src-wechat-medalpha",
    status: "active",
    reliabilityScore: 92,
    weeklyArticles: 18,
    lastCheckedAt: "2026-07-25T10:00:00+08:00",
  },
  {
    sourceId: "src-wechat-biochannel",
    status: "active",
    reliabilityScore: 88,
    weeklyArticles: 14,
    lastCheckedAt: "2026-07-25T10:00:00+08:00",
  },
  {
    sourceId: "src-organizer-cphi",
    status: "watching",
    reliabilityScore: 95,
    weeklyArticles: 6,
    lastCheckedAt: "2026-07-24T18:20:00+08:00",
  },
  {
    sourceId: "src-media-healthtech",
    status: "active",
    reliabilityScore: 81,
    weeklyArticles: 9,
    lastCheckedAt: "2026-07-25T09:30:00+08:00",
  },
  {
    sourceId: "src-rss-trial",
    status: "paused",
    reliabilityScore: 74,
    weeklyArticles: 3,
    lastCheckedAt: "2026-07-23T16:10:00+08:00",
  },
];

export const adminMergeCandidates: AdminMergeCandidate[] = [
  {
    id: "merge-adc-01",
    primaryActivityId: "act-adc-forum-2026",
    candidateTitle: "ADC 产业化论坛暨 CMC 圆桌",
    candidateMeta: "公众号文章 · 2026-07-22 · 上海",
    matchFields: ["标题核心词", "日期", "城市", "主办方"],
    confidence: 0.94,
    status: "pending",
  },
  {
    id: "merge-rwe-01",
    primaryActivityId: "act-rwe-summit-2026",
    candidateTitle: "医学数据应用峰会报名截止提醒",
    candidateMeta: "公众号文章 · 2026-07-25 · 杭州",
    matchFields: ["日期", "城市", "报名链接"],
    confidence: 0.89,
    status: "pending",
  },
  {
    id: "merge-ai-01",
    primaryActivityId: "act-ai-med-salon-2026",
    candidateTitle: "医疗 AI 产品合规沙龙延期通知",
    candidateMeta: "行业媒体 · 2026-07-25 · 线上",
    matchFields: ["标题核心词", "主办方", "延期字段"],
    confidence: 0.86,
    status: "pending",
  },
];

export const adminUpdateReviews: AdminUpdateReview[] = [
  {
    updateId: "upd-adc-agenda",
    status: "confirmed",
    reviewer: "内容运营",
    note: "议程更新已同步至活动详情。",
  },
  {
    updateId: "upd-rwe-deadline",
    status: "pending",
    reviewer: "数据运营",
    note: "待复核截止日期。",
  },
  {
    updateId: "upd-ai-postponed",
    status: "pending",
    reviewer: "运营审核",
    note: "延期信息需等待主办方二次发布。",
  },
];

export const adminCollectionRules: AdminCollectionRule[] = [
  {
    id: "rule-adc",
    keyword: "ADC 论坛 OR 抗体偶联药物 OR CMC 放大",
    topic: "创新药",
    sourceType: "wechat",
    status: "active",
  },
  {
    id: "rule-rwe",
    keyword: "真实世界研究 OR 医学数据治理 OR RWE 峰会",
    topic: "临床研究",
    sourceType: "rss",
    status: "active",
  },
  {
    id: "rule-ivd",
    keyword: "IVD 展会 OR 伴随诊断 OR 医疗器械注册",
    topic: "医疗器械",
    sourceType: "media",
    status: "active",
  },
  {
    id: "rule-ai",
    keyword: "医疗 AI 沙龙 OR 数字医疗研讨 OR 院内数据协作",
    topic: "数字医疗",
    sourceType: "wechat",
    status: "paused",
  },
  {
    id: "rule-commercialization",
    keyword: "创新药商业化 OR 医药 BD OR 授权合作",
    topic: "商业化",
    sourceType: "organizer_site",
    status: "active",
  },
];

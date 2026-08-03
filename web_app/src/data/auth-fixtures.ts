import type { NotificationPreference, User, UserPreferences } from "./types";

export const defaultNotificationPreference: NotificationPreference = {
  registrationOpened: true,
  registrationDeadline: true,
  eventChanged: true,
  agendaUpdated: true,
  speakersUpdated: true,
  organizerPublished: false,
};

export const defaultUserPreferences: UserPreferences = {
  topicIds: ["创新药", "ADC", "临床研究"],
  cities: ["上海", "北京", "线上活动"],
  eventTypes: ["行业大会", "专题研讨会", "线上直播"],
  includeOnline: true,
  notificationPreferences: defaultNotificationPreference,
};

export const demoUsers: Array<User & { password: string; preferences: UserPreferences }> = [
  {
    id: "user-demo-001",
    name: "高同学",
    email: "demo@bioevent.local",
    password: "Bioevent2026",
    avatarUrl: "",
    organization: "BioEvent Portfolio",
    role: "产品运营实习生",
    bio: "关注生物医疗活动线索、主办方动态和内容选题机会",
    createdAt: "2026-07-01T09:00:00+08:00",
    preferences: defaultUserPreferences,
  },
];

export const onboardingTopics = [
  "创新药",
  "ADC",
  "抗体药物",
  "细胞与基因治疗",
  "临床研究",
  "医疗器械",
  "医药投融资",
  "药企合作",
  "商业化",
  "产业园合作",
];

export const onboardingCities = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "苏州",
  "杭州",
  "成都",
  "武汉",
  "线上活动",
  "全国",
];

export const onboardingEventTypes = [
  "行业大会",
  "学术会议",
  "高峰论坛",
  "专题研讨会",
  "线上直播",
  "展会",
  "培训",
  "发布会",
  "商务交流会",
];

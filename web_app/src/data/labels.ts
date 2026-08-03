import type {
  ActivityFormat,
  ActivityStatus,
  ArticleNature,
  CompletenessStatus,
  RegistrationStatus,
  UpdateType,
  WorkTag,
} from "./types";

export const formatLabels: Record<ActivityFormat, string> = {
  offline: "线下",
  online: "线上",
  hybrid: "线上线下",
};

export const registrationLabels: Record<RegistrationStatus, string> = {
  open: "开放报名",
  not_open: "尚未开放",
  closing_soon: "即将截止",
  closed: "已截止",
  invite_only: "邀请制",
  unknown: "待确认",
};

export const statusLabels: Record<ActivityStatus, string> = {
  upcoming: "未举办",
  ended: "已结束",
  postponed: "延期",
  cancelled: "取消",
};

export const completenessLabels: Record<CompletenessStatus, string> = {
  complete: "信息较完整",
  partial: "信息部分完整",
  needs_review: "需继续确认",
};

export const articleNatureLabels: Record<ArticleNature, string> = {
  registration_invite: "报名或邀请",
  notice: "预告或通知",
  agenda_update: "议程更新",
  speaker_update: "嘉宾更新",
  recap: "活动回顾",
};

export const updateTypeLabels: Record<UpdateType, string> = {
  time_changed: "时间变化",
  location_changed: "地点变化",
  registration_open: "开放报名",
  deadline_soon: "报名即将截止",
  agenda_update: "议程更新",
  speaker_update: "嘉宾更新",
  postponed: "延期",
  cancelled: "取消",
};

export const workTagLabels: Record<WorkTag, string> = {
  to_register: "待跟进报名",
  bd_follow_up: "BD 跟进",
  content_topic: "内容选题",
  recommended: "建议参加",
  attended: "已参加",
};

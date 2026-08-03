export type ActivityType = "峰会" | "研讨会" | "沙龙" | "展会" | "论坛";
export type ActivityFormat = "offline" | "online" | "hybrid";
export type RegistrationStatus =
  | "open"
  | "not_open"
  | "closing_soon"
  | "closed"
  | "invite_only"
  | "unknown";
export type ActivityStatus = "upcoming" | "ended" | "postponed" | "cancelled";
export type CompletenessStatus = "complete" | "partial" | "needs_review";
export type SourceType = "wechat" | "organizer_site" | "media" | "rss";
export type ArticleNature =
  | "registration_invite"
  | "notice"
  | "agenda_update"
  | "speaker_update"
  | "recap";
export type UpdateType =
  | "time_changed"
  | "location_changed"
  | "registration_open"
  | "deadline_soon"
  | "agenda_update"
  | "speaker_update"
  | "postponed"
  | "cancelled";
export type WorkTag =
  | "to_register"
  | "bd_follow_up"
  | "content_topic"
  | "recommended"
  | "attended";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  organization: string;
  role: string;
  bio?: string;
  createdAt: string;
}

export interface NotificationPreference {
  registrationOpened: boolean;
  registrationDeadline: boolean;
  eventChanged: boolean;
  agendaUpdated: boolean;
  speakersUpdated: boolean;
  organizerPublished: boolean;
}

export interface UserPreferences {
  topicIds: string[];
  cities: string[];
  eventTypes: string[];
  includeOnline: boolean;
  notificationPreferences: NotificationPreference;
}

export interface UserFollow {
  userId: string;
  entityType: "organizer" | "topic" | "city";
  entityId: string;
  followedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  normalizedTitle: string;
  type: ActivityType;
  topics: string[];
  startDate: string;
  endDate: string;
  city: string;
  venue: string;
  format: ActivityFormat;
  organizerId: string;
  registrationStatus: RegistrationStatus;
  registrationUrl: string;
  coverImage: string;
  coverAlt: string;
  coverPosition?: string;
  status: ActivityStatus;
  firstDiscoveredAt: string;
  lastVerifiedAt: string;
  sourceCount: number;
  articleCount: number;
  completenessStatus: CompletenessStatus;
  summary: string;
  dedupeKey: string;
  dedupeReason: string;
  priorityScore: number;
  featured?: boolean;
}

export interface Article {
  id: string;
  title: string;
  sourceId: string;
  sourceAccountName: string;
  publishedAt: string;
  originalUrl: string;
  articleNature: ArticleNature;
  activityId: string;
  extractedFields: string[];
  firstDiscoveredAt: string;
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  accountName: string;
  homepageUrl: string;
}

export interface Organizer {
  id: string;
  name: string;
  type: string;
  summary: string;
  homepageUrl: string;
  channels: string[];
  topicFocus: string[];
  cityFocus: string[];
  recentActivityIds: string[];
  lastVerifiedAt: string;
}

export interface ActivityUpdate {
  id: string;
  activityId: string;
  updateType: UpdateType;
  field: string;
  previousValue: string;
  newValue: string;
  detectedAt: string;
  confirmedAt: string;
  articleId: string;
}

export interface ActivityArticleLink {
  id: string;
  activityId: string;
  articleId: string;
  matchedBy: string;
  matchedFields: string[];
  confidence: number;
  isPrimary: boolean;
}

export interface UserSavedActivity {
  userId: string;
  activityId: string;
  savedAt: string;
  workTag: WorkTag;
  note: string;
  calendarSynced: boolean;
  notificationsEnabled: boolean;
  updatedAt: string;
}

export interface ActivityFilters {
  query: string;
  type: "all" | ActivityType;
  topic: "all" | string;
  city: "all" | string;
  format: "all" | ActivityFormat;
  registrationStatus: "all" | RegistrationStatus;
  status: "all" | ActivityStatus;
  timeScope: "all" | "upcoming" | "next30" | "next90";
  sortBy: "startDate" | "lastVerifiedAt" | "sourceCount" | "priorityScore";
}

export type AdminReviewStatus = "pending" | "approved" | "needs_revision" | "rejected";
export type AdminSourceStatus = "active" | "paused" | "watching";
export type AdminMergeStatus = "pending" | "merged" | "ignored";
export type AdminUpdateReviewStatus = "pending" | "confirmed" | "ignored";

export interface AdminActivityReview {
  activityId: string;
  status: AdminReviewStatus;
  owner: string;
  note: string;
  reviewedAt?: string;
}

export interface AdminSourceMonitor {
  sourceId: string;
  status: AdminSourceStatus;
  reliabilityScore: number;
  weeklyArticles: number;
  lastCheckedAt: string;
}

export interface AdminMergeCandidate {
  id: string;
  primaryActivityId: string;
  candidateTitle: string;
  candidateMeta: string;
  matchFields: string[];
  confidence: number;
  status: AdminMergeStatus;
}

export interface AdminUpdateReview {
  updateId: string;
  status: AdminUpdateReviewStatus;
  reviewer: string;
  note: string;
}

export interface AdminCollectionRule {
  id: string;
  keyword: string;
  topic: string;
  sourceType: SourceType;
  status: "active" | "paused";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "operator" | "reviewer";
  team: string;
}

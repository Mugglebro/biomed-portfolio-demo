import {
  activities,
  activityArticleLinks,
  activityUpdates,
  articles,
  organizers,
  sources,
} from "@/data/fixtures";
import type { Activity, ActivityFilters } from "@/data/types";

const today = new Date("2026-07-25T00:00:00+08:00");

export const defaultFilters: ActivityFilters = {
  query: "",
  type: "all",
  topic: "all",
  city: "all",
  format: "all",
  registrationStatus: "all",
  status: "all",
  timeScope: "upcoming",
  sortBy: "lastVerifiedAt",
};

export function getOrganizer(organizerId: string) {
  return organizers.find((organizer) => organizer.id === organizerId);
}

export function getActivity(activityId: string) {
  return activities.find((activity) => activity.id === activityId);
}

export function getArticlesForActivity(activityId: string) {
  const linkedIds = activityArticleLinks
    .filter((link) => link.activityId === activityId)
    .map((link) => link.articleId);
  return articles.filter((article) => linkedIds.includes(article.id));
}

export function getUpdatesForActivity(activityId: string) {
  return activityUpdates
    .filter((update) => update.activityId === activityId)
    .sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt));
}

export function getSource(sourceId: string) {
  return sources.find((source) => source.id === sourceId);
}

export function getArticle(articleId: string) {
  return articles.find((article) => article.id === articleId);
}

export function getOrganizerActivities(organizerId: string) {
  return activities.filter((activity) => activity.organizerId === organizerId);
}

export function getAllTopics() {
  return Array.from(new Set(activities.flatMap((activity) => activity.topics))).sort();
}

export function getAllCities() {
  return Array.from(new Set(activities.map((activity) => activity.city))).sort();
}

export function filterActivities(filters: ActivityFilters) {
  const query = filters.query.trim().toLowerCase();

  return activities
    .filter((activity) => {
      const organizer = getOrganizer(activity.organizerId);
      const searchable = [
        activity.title,
        activity.normalizedTitle,
        activity.summary,
        activity.city,
        activity.venue,
        activity.type,
        organizer?.name ?? "",
        ...activity.topics,
      ]
        .join(" ")
        .toLowerCase();

      if (query && !searchable.includes(query)) return false;
      if (filters.type !== "all" && activity.type !== filters.type) return false;
      if (filters.topic !== "all" && !activity.topics.includes(filters.topic)) return false;
      if (filters.city !== "all" && activity.city !== filters.city) return false;
      if (filters.format !== "all" && activity.format !== filters.format) return false;
      if (
        filters.registrationStatus !== "all" &&
        activity.registrationStatus !== filters.registrationStatus
      ) {
        return false;
      }
      if (filters.status !== "all" && activity.status !== filters.status) return false;

      const start = new Date(`${activity.startDate}T00:00:00+08:00`);
      if (filters.timeScope === "upcoming" && start < today) return false;
      if (filters.timeScope === "next30") {
        const end = new Date(today);
        end.setDate(end.getDate() + 30);
        if (start < today || start > end) return false;
      }
      if (filters.timeScope === "next90") {
        const end = new Date(today);
        end.setDate(end.getDate() + 90);
        if (start < today || start > end) return false;
      }

      return true;
    })
    .sort((a, b) => compareActivities(a, b, filters.sortBy));
}

function compareActivities(
  a: Activity,
  b: Activity,
  sortBy: ActivityFilters["sortBy"],
) {
  if (sortBy === "startDate") return a.startDate.localeCompare(b.startDate);
  if (sortBy === "lastVerifiedAt") return b.lastVerifiedAt.localeCompare(a.lastVerifiedAt);
  if (sortBy === "sourceCount") return b.sourceCount - a.sourceCount;
  return b.priorityScore - a.priorityScore;
}

export function getMonthlyActivities(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  return activities.filter((activity) => {
    const date = new Date(`${activity.startDate}T00:00:00+08:00`);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${date}T00:00:00+08:00`));
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getSourceStats() {
  return {
    activities: activities.length,
    articles: articles.length,
    sources: sources.length,
    organizers: organizers.length,
    updates: activityUpdates.length,
  };
}

import type { UserSavedActivity, WorkTag } from "@/data/types";

export function upsertSavedActivity(
  saved: UserSavedActivity[],
  activityId: string,
  patch: Partial<Pick<UserSavedActivity, "note" | "workTag">> = {},
  userId = "local-browser",
) {
  const now = new Date().toISOString();
  const existing = saved.find((item) => item.activityId === activityId);

  if (!existing) {
    return [
      ...saved,
      {
        userId,
        activityId,
        savedAt: now,
        workTag: patch.workTag ?? "recommended",
        note: patch.note ?? "",
        calendarSynced: false,
        notificationsEnabled: false,
        updatedAt: now,
      },
    ];
  }

  return saved.map((item) =>
    item.activityId === activityId
      ? {
          ...item,
          ...patch,
          updatedAt: now,
        }
      : item,
  );
}

export function removeSavedActivity(saved: UserSavedActivity[], activityId: string) {
  return saved.filter((item) => item.activityId !== activityId);
}

export function setSavedTag(
  saved: UserSavedActivity[],
  activityId: string,
  workTag: WorkTag,
  userId?: string,
) {
  return upsertSavedActivity(saved, activityId, { workTag }, userId);
}

export function setSavedNote(
  saved: UserSavedActivity[],
  activityId: string,
  note: string,
  userId?: string,
) {
  return upsertSavedActivity(saved, activityId, { note }, userId);
}

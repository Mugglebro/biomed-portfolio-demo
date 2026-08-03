"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/auth/auth-provider";
import { activityUpdates } from "@/data/fixtures";
import type { Activity, ActivityFilters, UserSavedActivity, WorkTag } from "@/data/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultFilters } from "@/lib/data";
import {
  removeSavedActivity,
  setSavedNote,
  setSavedTag,
  upsertSavedActivity,
} from "@/lib/saved";
import { NotificationDrawer } from "./notification-drawer";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { SourceDrawer } from "./source-drawer";
import { LoginPromptDialog } from "./login-prompt-dialog";

interface AppState {
  filters: ActivityFilters;
  setFilters: (filters: ActivityFilters) => void;
  resetFilters: () => void;
  savedActivities: UserSavedActivity[];
  toggleSaved: (activityId: string) => void;
  updateSavedTag: (activityId: string, workTag: WorkTag) => void;
  updateSavedNote: (activityId: string, note: string) => void;
  openSourceDrawer: (activity: Activity) => void;
  requestLogin: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used inside AppShell");
  return value;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const [filters, setFilters] = useLocalStorage<ActivityFilters>(
    "bioevent.filters",
    defaultFilters,
  );
  const [savedActivities, setSavedActivities] = useLocalStorage<UserSavedActivity[]>(
    "bioevent.savedActivities",
    [],
  );
  const [readNotificationIds, setReadNotificationIds] = useLocalStorage<string[]>(
    "bioevent.readNotifications",
    [],
  );
  const [sourceActivity, setSourceActivity] = useState<Activity | undefined>();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  const unreadCount = activityUpdates.filter(
    (update) => !readNotificationIds.includes(update.id),
  ).length;

  const state = useMemo<AppState>(
    () => ({
      filters,
      setFilters,
      resetFilters: () => setFilters(defaultFilters),
      savedActivities,
      toggleSaved: (activityId: string) => {
        if (!auth.isAuthenticated) {
          setLoginPromptOpen(true);
          return;
        }
        const exists = savedActivities.some((item) => item.activityId === activityId);
        setSavedActivities(
          exists
            ? removeSavedActivity(savedActivities, activityId)
            : upsertSavedActivity(savedActivities, activityId, {}, auth.user?.id),
        );
      },
      updateSavedTag: (activityId: string, workTag: WorkTag) => {
        if (!auth.isAuthenticated) {
          setLoginPromptOpen(true);
          return;
        }
        setSavedActivities(setSavedTag(savedActivities, activityId, workTag, auth.user?.id));
      },
      updateSavedNote: (activityId: string, note: string) => {
        if (!auth.isAuthenticated) {
          setLoginPromptOpen(true);
          return;
        }
        setSavedActivities(setSavedNote(savedActivities, activityId, note, auth.user?.id));
      },
      openSourceDrawer: (activity: Activity) => setSourceActivity(activity),
      requestLogin: () => setLoginPromptOpen(true),
    }),
    [auth.isAuthenticated, auth.user?.id, filters, savedActivities, setFilters, setSavedActivities],
  );

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  if (pathname === "/") {
    return <AppStateContext.Provider value={state}>{children}</AppStateContext.Provider>;
  }

  return (
    <AppStateContext.Provider value={state}>
      <SiteHeader
        filters={filters}
        setFilters={setFilters}
        unreadCount={unreadCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <SourceDrawer
        activity={sourceActivity}
        open={Boolean(sourceActivity)}
        onClose={() => setSourceActivity(undefined)}
      />
      <NotificationDrawer
        open={notificationsOpen}
        readIds={readNotificationIds}
        onClose={() => setNotificationsOpen(false)}
        onMarkRead={(id) =>
          setReadNotificationIds(
            readNotificationIds.includes(id) ? readNotificationIds : [...readNotificationIds, id],
          )
        }
      />
      <LoginPromptDialog open={loginPromptOpen} onClose={() => setLoginPromptOpen(false)} />
    </AppStateContext.Provider>
  );
}

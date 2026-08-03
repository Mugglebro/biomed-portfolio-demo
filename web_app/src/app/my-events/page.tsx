"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { activities } from "@/data/fixtures";
import { workTagLabels } from "@/data/labels";
import type { WorkTag } from "@/data/types";
import { useAuth } from "@/auth/auth-provider";
import { useAppState } from "@/components/app-shell";
import { EventCard } from "@/components/event-card";
import { SnapshotBanner } from "@/components/snapshot-banner";
import { formatDate, getActivity } from "@/lib/data";

const tagOptions = Object.keys(workTagLabels) as WorkTag[];

export default function MyEventsPage() {
  const auth = useAuth();
  const { savedActivities, toggleSaved, updateSavedTag, updateSavedNote, requestLogin } = useAppState();
  const savedWithActivities = savedActivities
    .map((saved) => ({ saved, activity: getActivity(saved.activityId) }))
    .filter((item): item is { saved: typeof savedActivities[number]; activity: NonNullable<ReturnType<typeof getActivity>> } =>
      Boolean(item.activity),
    );
  const recommended = activities
    .filter((activity) => !savedActivities.some((saved) => saved.activityId === activity.id))
    .filter((activity) => activity.status === "upcoming")
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);

  return (
    <div>
      <SnapshotBanner />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6">
          <p className="text-sm font-medium text-teal-700">我的活动</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
            收藏活动
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
            {auth.isAuthenticated
              ? "管理已收藏的活动、标签和备注。"
              : "登录后可保存标签、备注和活动提醒。"}
          </p>
        </div>

        {savedWithActivities.length === 0 ? (
          <div className="border border-zinc-200 bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
              <div>
                <Bookmark className="size-7 text-teal-700" />
                <h2 className="mt-3 text-2xl font-semibold text-zinc-950">还没有收藏活动</h2>
                <p className="mt-2 text-base text-zinc-500">可以先把高优先级活动加入工作清单。</p>
              </div>
              <Link
                href="/app"
                className="inline-flex h-11 items-center rounded-md bg-teal-700 px-4 text-base font-medium text-white hover:bg-teal-800"
              >
                去发现活动
              </Link>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {recommended.map((activity) => (
                <article key={activity.id} className="border border-zinc-200 p-5">
                  <p className="mono-date text-sm font-semibold text-teal-700">
                    {formatDate(activity.startDate)} · {activity.city}
                  </p>
                  <Link
                    href={`/activities/${activity.id}`}
                    className="mt-3 block text-xl font-semibold leading-snug text-zinc-950 hover:text-teal-700"
                  >
                    {activity.title}
                  </Link>
                  <p className="mt-3 line-clamp-2 text-base leading-7 text-zinc-600">{activity.summary}</p>
                  <button
                    type="button"
                    onClick={() => toggleSaved(activity.id)}
                    className="mt-5 inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-base font-medium text-zinc-700 hover:border-teal-600 hover:text-teal-700"
                  >
                    加入工作清单
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedWithActivities.map(({ saved, activity }) => (
              <div key={activity.id} className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_320px]">
                <EventCard
                  activity={activity}
                  saved={saved}
                  onToggleSaved={toggleSaved}
                  compact
                />
                <div className="grid gap-3">
                  <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                    工作标签
                    <select
                      value={saved.workTag}
                      onFocus={() => {
                        if (!auth.isAuthenticated) requestLogin();
                      }}
                      onChange={(event) => updateSavedTag(activity.id, event.target.value as WorkTag)}
                      className="h-10 rounded-md border border-zinc-200 px-3 text-sm font-normal outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    >
                      {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                          {workTagLabels[tag]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                    备注
                    <textarea
                      value={saved.note}
                      onFocus={() => {
                        if (!auth.isAuthenticated) requestLogin();
                      }}
                      onChange={(event) => updateSavedNote(activity.id, event.target.value)}
                      rows={5}
                      placeholder="添加跟进备注"
                      className="resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm font-normal outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

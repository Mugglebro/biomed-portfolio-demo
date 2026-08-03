"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, BookmarkCheck, Building2, CalendarDays, MapPin } from "lucide-react";
import { formatLabels, workTagLabels } from "@/data/labels";
import type { WorkTag } from "@/data/types";
import { useAppState } from "@/components/app-shell";
import { ExternalRegistration } from "@/components/external-registration";
import {
  ActivityStatusBadge,
  CompletenessBadge,
  RegistrationBadge,
} from "@/components/status-badge";
import { UpdateTimeline } from "@/components/update-timeline";
import {
  formatDate,
  formatDateTime,
  getActivity,
  getOrganizer,
  getUpdatesForActivity,
} from "@/lib/data";

const tagOptions = Object.keys(workTagLabels) as WorkTag[];

export function ActivityDetailClient({ id }: { id: string }) {
  const activity = getActivity(id);
  const {
    savedActivities,
    toggleSaved,
    updateSavedTag,
    updateSavedNote,
    openSourceDrawer,
  } = useAppState();

  if (!activity) notFound();

  const organizer = getOrganizer(activity.organizerId);
  const updates = getUpdatesForActivity(activity.id);
  const saved = savedActivities.find((item) => item.activityId === activity.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">
              <ActivityStatusBadge status={activity.status} />
              <RegistrationBadge status={activity.registrationStatus} />
              <CompletenessBadge status={activity.completenessStatus} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              {activity.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">{activity.summary}</p>
            <div className="mt-6 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
              <Info icon={<CalendarDays className="size-4" />} label="时间">
                {formatDate(activity.startDate)}
                {activity.endDate !== activity.startDate ? ` 至 ${formatDate(activity.endDate)}` : ""}
              </Info>
              <Info icon={<MapPin className="size-4" />} label="地点">
                {activity.city} · {activity.venue} · {formatLabels[activity.format]}
              </Info>
              <Info icon={<Building2 className="size-4" />} label="主办方">
                {organizer ? (
                  <Link href={`/organizers/${organizer.id}`} className="font-medium text-teal-700">
                    {organizer.name}
                  </Link>
                ) : (
                  "待确认"
                )}
              </Info>
              <Info label="最近确认">{formatDateTime(activity.lastVerifiedAt)}</Info>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {activity.topics.map((topic) => (
                <span key={topic} className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-zinc-950">来源追溯</h2>
                <p className="mt-1 text-sm text-zinc-500">{activity.dedupeReason}</p>
              </div>
              <button
                type="button"
                onClick={() => openSourceDrawer(activity)}
                className="inline-flex h-10 items-center rounded-md border border-teal-600 px-3 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
              >
                信息整理自 {activity.sourceCount} 个公开来源
              </button>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Fact label="首次发现" value={formatDateTime(activity.firstDiscoveredAt)} />
              <Fact label="来源文章" value={`${activity.articleCount} 篇`} />
            </dl>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-zinc-950">活动更新记录</h2>
            <UpdateTimeline updates={updates} />
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ExternalRegistration url={activity.registrationUrl} />
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => toggleSaved(activity.id)}
              className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                saved
                  ? "border-teal-600 bg-teal-700 text-white hover:bg-teal-800"
                  : "border-zinc-200 text-zinc-700 hover:border-teal-600 hover:text-teal-700"
              }`}
            >
              {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {saved ? "已加入我的活动" : "加入我的活动"}
            </button>
            {saved ? (
              <div className="mt-4 grid gap-3">
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  工作标签
                  <select
                    value={saved.workTag}
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
                    onChange={(event) => updateSavedNote(activity.id, event.target.value)}
                    rows={4}
                    placeholder="记录跟进理由、候选客户或内容选题想法"
                    className="resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm font-normal outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  />
                </label>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-2 rounded-md bg-zinc-50 p-3">
      {icon ? <span className="mt-0.5 text-teal-700">{icon}</span> : null}
      <div>
        <div className="text-xs font-medium text-zinc-500">{label}</div>
        <div className="mt-1 text-sm text-zinc-900">{children}</div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-50 p-3">
      <dt className="text-xs font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-zinc-900">{value}</dd>
    </div>
  );
}

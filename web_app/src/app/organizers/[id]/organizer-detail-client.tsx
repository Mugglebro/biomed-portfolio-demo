"use client";

import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { SnapshotBanner } from "@/components/snapshot-banner";
import { useAppState } from "@/components/app-shell";
import { formatDateTime, getOrganizer, getOrganizerActivities } from "@/lib/data";

export function OrganizerDetailClient({ id }: { id: string }) {
  const organizer = getOrganizer(id);
  const { savedActivities, toggleSaved } = useAppState();

  if (!organizer) notFound();

  const organizerActivities = getOrganizerActivities(organizer.id);

  return (
    <div>
      <SnapshotBanner />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-medium text-teal-700">主办方详情</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              {organizer.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{organizer.summary}</p>
            <dl className="mt-5 grid gap-3 text-sm">
              <Fact label="类型" value={organizer.type} />
              <Fact label="最近确认" value={formatDateTime(organizer.lastVerifiedAt)} />
              <Fact label="发布渠道" value={organizer.channels.join("、")} />
              <Fact label="常见城市" value={organizer.cityFocus.join("、")} />
            </dl>
            <a
              href={organizer.homepageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-teal-600 px-3 text-sm font-medium text-teal-700 hover:bg-teal-50"
            >
              查看公开主页
              <ExternalLink className="size-4" />
            </a>
          </aside>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-zinc-950">近期关联活动</h2>
              <p className="mt-1 text-sm text-zinc-500">
                根据演示数据快照整理，共 {organizerActivities.length} 场。
              </p>
            </div>
            <div className="grid gap-4">
              {organizerActivities.map((activity) => (
                <EventCard
                  key={activity.id}
                  activity={activity}
                  saved={savedActivities.find((item) => item.activityId === activity.id)}
                  onToggleSaved={toggleSaved}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-50 p-3">
      <dt className="text-xs font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-900">{value}</dd>
    </div>
  );
}

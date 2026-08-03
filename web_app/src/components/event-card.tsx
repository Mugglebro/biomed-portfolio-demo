"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, BookmarkCheck, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { formatLabels } from "@/data/labels";
import type { Activity, UserSavedActivity } from "@/data/types";
import { formatDate, getOrganizer } from "@/lib/data";
import { ActivityStatusBadge, RegistrationBadge } from "./status-badge";

export function FeaturedEventCard({
  activity,
  saved,
  onToggleSaved,
}: {
  activity: Activity;
  saved?: UserSavedActivity;
  onToggleSaved: (activityId: string) => void;
}) {
  const organizer = getOrganizer(activity.organizerId);
  const [month, day] = formatDate(activity.startDate).split("/");

  return (
    <article className="group flex h-full flex-col">
      <Link href={`/activities/${activity.id}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
          <Image
            src={activity.coverImage}
            alt={activity.coverAlt}
            width={1200}
            height={750}
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${activity.coverPosition ?? "object-center"}`}
          />
        </div>
      </Link>
      <div className="mt-6 flex flex-1 gap-5">
        <div className="mono-date shrink-0 text-[15px] font-bold tracking-tight text-zinc-950">
          {month} / {day}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            {activity.type} · {activity.city} · {organizer?.name}
          </div>
          <Link
            href={`/activities/${activity.id}`}
            className="editorial-title block min-h-[3.4em] text-[26px] leading-[1.12] text-zinc-950 transition group-hover:text-teal-700"
          >
            {activity.title}
          </Link>
          <p className="mt-3 min-h-[3.5rem] max-w-[34rem] text-[16px] font-normal leading-7 text-zinc-600 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
            {activity.summary}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            <ActivityStatusBadge status={activity.status} />
            <RegistrationBadge status={activity.registrationStatus} />
            <button
              type="button"
              onClick={() => onToggleSaved(activity.id)}
              aria-label={saved ? "取消收藏活动" : "收藏活动"}
              className={`ml-auto inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition ${
                saved
                  ? "border-teal-600 bg-teal-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-teal-600 hover:text-teal-700"
              }`}
            >
              {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {saved ? "已收藏" : "收藏"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function EventCard({
  activity,
  saved,
  onToggleSaved,
  compact = false,
}: {
  activity: Activity;
  saved?: UserSavedActivity;
  onToggleSaved: (activityId: string) => void;
  compact?: boolean;
}) {
  const organizer = getOrganizer(activity.organizerId);
  const [month, day] = formatDate(activity.startDate).split("/");

  return (
    <article className="group border-t border-zinc-200 bg-white py-6 transition hover:bg-zinc-50">
      <div className="grid gap-5 md:grid-cols-[128px_76px_1fr_auto] md:items-start">
        <Link href={`/activities/${activity.id}`} className="block overflow-hidden bg-zinc-100">
          <Image
            src={activity.coverImage}
            alt={activity.coverAlt}
            width={320}
            height={220}
            className={`aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105 ${activity.coverPosition ?? "object-center"}`}
          />
        </Link>
        <Link
          href={`/activities/${activity.id}`}
          className="mono-date hidden text-sm font-bold tracking-tight text-zinc-950 md:block"
        >
          {month}
          <span className="mx-1 text-zinc-300">/</span>
          {day}
        </Link>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ActivityStatusBadge status={activity.status} />
            <RegistrationBadge status={activity.registrationStatus} />
          </div>
          <Link
            href={`/activities/${activity.id}`}
            className="block text-xl font-semibold leading-snug text-zinc-950 transition group-hover:text-teal-700"
          >
            {activity.title}
          </Link>
          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-600">
            {activity.summary}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2 xl:grid-cols-4">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-teal-700" />
              {formatDate(activity.startDate)}
              {activity.endDate !== activity.startDate ? ` 至 ${formatDate(activity.endDate)}` : ""}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-teal-700" />
              {activity.city} · {formatLabels[activity.format]}
            </span>
            <span>{organizer?.name}</span>
            {!compact ? (
              <span>
                {activity.sourceCount} 个来源 · {activity.articleCount} 篇文章
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activity.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 md:flex-col">
          <button
            type="button"
            onClick={() => onToggleSaved(activity.id)}
            className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
              saved
                ? "border-teal-600 bg-teal-700 text-white hover:bg-teal-800"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-teal-600 hover:text-teal-700"
            }`}
            aria-label={saved ? "取消收藏活动" : "收藏活动"}
          >
            {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            {saved ? "已收藏" : "收藏"}
          </button>
          <Link
            href={`/activities/${activity.id}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-teal-600 hover:text-teal-700"
          >
            详情
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

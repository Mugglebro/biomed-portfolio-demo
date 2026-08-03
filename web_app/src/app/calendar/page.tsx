"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { activities } from "@/data/fixtures";
import { formatLabels } from "@/data/labels";
import { SnapshotBanner } from "@/components/snapshot-banner";
import { ActivityStatusBadge } from "@/components/status-badge";
import { getMonthlyActivities, getOrganizer } from "@/lib/data";

export default function CalendarPage() {
  const [month, setMonth] = useState(new Date("2026-09-01T00:00:00+08:00"));
  const monthlyActivities = getMonthlyActivities(month);
  const days = buildMonthDays(month);

  function shiftMonth(delta: number) {
    const next = new Date(month);
    next.setMonth(next.getMonth() + delta);
    setMonth(next);
  }

  return (
    <div>
      <SnapshotBanner />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700">行业日历</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              活动排期
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="inline-flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:border-teal-600 hover:text-teal-700"
              aria-label="上个月"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="min-w-32 rounded-md border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-semibold">
              {month.getFullYear()} 年 {month.getMonth() + 1} 月
            </div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="inline-flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:border-teal-600 hover:text-teal-700"
              aria-label="下个月"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-zinc-500">
              {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const dayActivities = activities.filter(
                  (activity) => activity.startDate === day.isoDate,
                );
                return (
                  <div
                    key={day.key}
                    className={`min-h-28 rounded-md border p-2 ${
                      day.inMonth ? "border-zinc-200 bg-white" : "border-zinc-100 bg-zinc-50"
                    }`}
                  >
                    <div className={`text-xs font-medium ${day.inMonth ? "text-zinc-700" : "text-zinc-300"}`}>
                      {day.date.getDate()}
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayActivities.slice(0, 2).map((activity) => (
                        <Link
                          key={activity.id}
                          href={`/activities/${activity.id}`}
                          className="block rounded bg-teal-50 px-2 py-1 text-left text-[11px] leading-4 text-teal-900 hover:bg-teal-100"
                        >
                          {activity.title}
                        </Link>
                      ))}
                      {dayActivities.length > 2 ? (
                        <div className="text-[11px] text-zinc-500">
                          还有 {dayActivities.length - 2} 场
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">本月活动</h2>
            <p className="mt-1 text-sm text-zinc-500">共 {monthlyActivities.length} 场</p>
            <div className="mt-4 space-y-3">
              {monthlyActivities.map((activity) => {
                const organizer = getOrganizer(activity.organizerId);
                return (
                  <Link
                    key={activity.id}
                    href={`/activities/${activity.id}`}
                    className="block rounded-lg border border-zinc-200 p-3 transition hover:border-teal-200 hover:bg-teal-50"
                  >
                    <div className="mb-2 flex flex-wrap gap-2">
                      <ActivityStatusBadge status={activity.status} />
                    </div>
                    <h3 className="text-sm font-semibold leading-5 text-zinc-950">
                      {activity.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500">
                      {activity.startDate} · {activity.city} · {formatLabels[activity.format]}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">{organizer?.name}</p>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function buildMonthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  const weekday = first.getDay() === 0 ? 7 : first.getDay();
  start.setDate(first.getDate() - weekday + 1);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);
    return {
      key: `${isoDate}-${index}`,
      date,
      isoDate,
      inMonth: date.getMonth() === month.getMonth(),
    };
  });
}

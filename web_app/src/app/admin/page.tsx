"use client";

import Link from "next/link";
import { activities, articles, sources } from "@/data/fixtures";
import { AdminBadge, AdminCard, AdminPageHeader, useAdminState } from "@/components/admin-shell";
import type { AdminSourceMonitor } from "@/data/types";
import { getActivity, getSource } from "@/lib/data";

export default function AdminDashboardPage() {
  const { reviews, sources: sourceMonitors, merges, updates, rules } = useAdminState();
  const pendingReviews = reviews.filter((item) => item.status === "pending").length;
  const needsRevision = reviews.filter((item) => item.status === "needs_revision").length;
  const pendingMerges = merges.filter((item) => item.status === "pending").length;
  const pendingUpdates = updates.filter((item) => item.status === "pending").length;
  const activeRules = rules.filter((item) => item.status === "active").length;

  const reviewQueue = reviews
    .filter((item) => item.status !== "approved")
    .slice(0, 5)
    .map((review) => ({ review, activity: getActivity(review.activityId) }))
    .filter((item) => item.activity);

  return (
    <div className="space-y-7">
      <AdminPageHeader title="运营总览" />

      <div className="grid gap-5 md:grid-cols-4">
        <Metric title="活动待审" value={pendingReviews + needsRevision} />
        <Metric title="疑似重复" value={pendingMerges} />
        <Metric title="变更待确认" value={pendingUpdates} />
        <Metric title="采集规则" value={rules.length} />
      </div>

      <div className="grid gap-7 2xl:grid-cols-[minmax(0,1fr)_560px]">
        <AdminCard className="p-0">
          <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-6">
            <h2 className="text-[28px] font-semibold tracking-tight text-zinc-950">活动待办</h2>
            <Link href="/admin/activities" className="text-[17px] font-semibold text-teal-700 hover:text-teal-900">
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {reviewQueue.map(({ review, activity }) =>
              activity ? (
                <div key={review.activityId} className="grid gap-4 px-8 py-6 md:grid-cols-[minmax(0,1fr)_130px] md:items-center">
                  <div className="min-w-0">
                    <Link href={`/activities/${activity.id}`} className="text-[22px] font-semibold text-zinc-950 hover:text-teal-700">
                      {activity.title}
                    </Link>
                    <p className="mt-2 text-[17px] text-zinc-500">
                      {activity.city} · {activity.startDate} · {review.owner}
                    </p>
                  </div>
                  <AdminBadge tone={review.status === "pending" ? "amber" : "rose"}>
                    {review.status === "pending" ? "待审核" : "需修订"}
                  </AdminBadge>
                </div>
              ) : null,
            )}
          </div>
        </AdminCard>

        <AdminCard className="p-0">
          <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-6">
            <h2 className="text-[28px] font-semibold tracking-tight text-zinc-950">来源质量评估</h2>
            <Link href="/admin/sources" className="text-[17px] font-semibold text-teal-700 hover:text-teal-900">
              管理来源
            </Link>
          </div>
          <div className="grid gap-4 px-8 py-6">
            {sourceMonitors.map((monitor) => (
              <SourceQualityCard key={monitor.sourceId} monitor={monitor} />
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-5 2xl:grid-cols-3">
        <QueueCard title="活动库" href="/admin/activities" count={activities.length} meta="待审 / 修订 / 下线" />
        <QueueCard title="文章解析" href="/admin/articles" count={articles.length} meta={`${sources.length} 个公开来源`} />
        <QueueCard title="采集规则" href="/admin/rules" count={rules.length} meta={`${activeRules} 条启用`} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <AdminCard className="p-7">
      <p className="text-[18px] font-semibold text-zinc-500">{title}</p>
      <p className="mt-4 tabular-nums text-[48px] font-semibold leading-none text-zinc-950">{value}</p>
    </AdminCard>
  );
}

function QueueCard({ title, href, count, meta }: { title: string; href: string; count: number; meta: string }) {
  return (
    <Link href={href} className="block border border-zinc-200 bg-white p-7 transition hover:border-teal-300 hover:bg-teal-50/30">
      <p className="text-[18px] font-semibold text-zinc-500">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="tabular-nums text-[44px] font-semibold leading-none text-zinc-950">{count}</p>
        <p className="pb-1 text-[17px] text-zinc-400">{meta}</p>
      </div>
    </Link>
  );
}

function SourceQualityCard({ monitor }: { monitor: AdminSourceMonitor }) {
  const source = getSource(monitor.sourceId);
  const grade = getQualityGrade(monitor.reliabilityScore);
  const statusLabel = {
    active: "稳定收录",
    watching: "观察中",
    paused: "暂停采集",
  }[monitor.status];

  return (
    <article className="grid grid-cols-[76px_1fr] gap-5 border border-zinc-200 bg-zinc-50/40 p-5">
      <div
        className="relative grid size-[76px] place-items-center rounded-full"
        style={{
          background: `conic-gradient(#0f766e ${monitor.reliabilityScore * 3.6}deg, #e5e7eb 0deg)`,
        }}
      >
        <div className="grid size-[58px] place-items-center rounded-full bg-white">
          <span className="text-[18px] font-semibold text-teal-800">{grade}</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{source?.name ?? monitor.sourceId}</h3>
            <p className="mt-1 text-[15px] text-zinc-500">{source?.type ?? "公开来源"} · 本周 {monitor.weeklyArticles} 篇</p>
          </div>
          <span className="tabular-nums text-xl font-semibold text-zinc-700">{monitor.reliabilityScore}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[15px]">
          <span className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 font-medium text-teal-800">{statusLabel}</span>
          <span className="text-zinc-400">最近检查 {formatDateTime(monitor.lastCheckedAt)}</span>
        </div>
      </div>
    </article>
  );
}

function getQualityGrade(score: number) {
  if (score >= 93) return "A";
  if (score >= 86) return "B+";
  if (score >= 78) return "B";
  return "C";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

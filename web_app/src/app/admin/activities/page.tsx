"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { activities } from "@/data/fixtures";
import type { AdminReviewStatus } from "@/data/types";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminPagination,
  useAdminState,
} from "@/components/admin-shell";
import { formatDate, getOrganizer } from "@/lib/data";

const reviewLabels: Record<AdminReviewStatus, string> = {
  pending: "待审核",
  approved: "已通过",
  needs_revision: "需修订",
  rejected: "已驳回",
};

const reviewTones: Record<AdminReviewStatus, "teal" | "amber" | "rose" | "zinc"> = {
  pending: "amber",
  approved: "teal",
  needs_revision: "rose",
  rejected: "zinc",
};

export default function AdminActivitiesPage() {
  const { reviews, setReviews } = useAdminState();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AdminReviewStatus>("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const rows = useMemo(
    () =>
      activities
        .map((activity) => ({
          activity,
          review: reviews.find((item) => item.activityId === activity.id),
          organizer: getOrganizer(activity.organizerId),
        }))
        .filter(({ activity, organizer, review }) => {
          const text = `${activity.title} ${activity.city} ${organizer?.name ?? ""}`.toLowerCase();
          const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());
          const matchesStatus = status === "all" || review?.status === status;
          return matchesQuery && matchesStatus;
        }),
    [query, reviews, status],
  );
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  function updateReview(activityId: string, nextStatus: AdminReviewStatus) {
    setReviews(
      reviews.map((item) =>
        item.activityId === activityId
          ? { ...item, status: nextStatus, reviewedAt: new Date().toISOString() }
          : item,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="活动待审" />

      <AdminCard className="p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="搜索活动、城市或主办方"
            className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none focus:border-teal-700"
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "all" | AdminReviewStatus);
              setPage(1);
            }}
            className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none focus:border-teal-700"
          >
            <option value="all">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="needs_revision">需修订</option>
            <option value="rejected">已驳回</option>
          </select>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden p-0">
        <div className="hidden grid-cols-[minmax(320px,1fr)_190px_150px_130px_210px] border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-base font-semibold text-zinc-500 lg:grid">
          <div>活动</div>
          <div>时间地点</div>
          <div>来源</div>
          <div>审核</div>
          <div>操作</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {pagedRows.map(({ activity, review, organizer }) => (
            <div
              key={activity.id}
              className="grid gap-4 px-6 py-5 text-[17px] lg:grid-cols-[minmax(320px,1fr)_190px_150px_130px_210px] lg:items-center"
            >
              <div className="min-w-0">
                <Link href={`/activities/${activity.id}`} className="font-semibold text-zinc-950 hover:text-teal-700">
                  {activity.title}
                </Link>
                <p className="mt-1 truncate text-[17px] text-zinc-500">{organizer?.name}</p>
              </div>
              <div className="text-zinc-600">
                <p>{formatDate(activity.startDate)}</p>
                <p className="mt-1">{activity.city}</p>
              </div>
              <div className="text-zinc-600">
                <p>{activity.sourceCount} 个来源</p>
                <p className="mt-1">{activity.articleCount} 篇文章</p>
              </div>
              <div>
                <AdminBadge tone={reviewTones[review?.status ?? "pending"]}>
                  {reviewLabels[review?.status ?? "pending"]}
                </AdminBadge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Action onClick={() => updateReview(activity.id, "approved")}>通过</Action>
                <Action onClick={() => updateReview(activity.id, "needs_revision")}>修订</Action>
                <Action onClick={() => updateReview(activity.id, "rejected")}>驳回</Action>
              </div>
            </div>
          ))}
        </div>
        <AdminPagination total={rows.length} pageSize={pageSize} currentPage={page} onPageChange={setPage} />
      </AdminCard>
    </div>
  );
}

function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-md border border-zinc-200 px-3.5 text-base font-medium text-zinc-700 hover:border-teal-600 hover:text-teal-700"
    >
      {children}
    </button>
  );
}

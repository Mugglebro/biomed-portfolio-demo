"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdminUpdateReviewStatus } from "@/data/types";
import { activityUpdates } from "@/data/fixtures";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminPagination,
  useAdminState,
} from "@/components/admin-shell";
import { formatDateTime, getActivity } from "@/lib/data";

const statusLabels: Record<AdminUpdateReviewStatus, string> = {
  pending: "待确认",
  confirmed: "已确认",
  ignored: "已忽略",
};

export default function AdminUpdatesPage() {
  const { updates, setUpdates } = useAdminState();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const rows = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return activityUpdates;
    return activityUpdates.filter((update) => {
      const review = updates.find((item) => item.updateId === update.id);
      const activity = getActivity(update.activityId);
      const status = review?.status ?? "pending";
      return [
        activity?.title,
        update.field,
        update.previousValue,
        update.newValue,
        statusLabels[status],
      ]
        .join(" ")
        .toLowerCase()
        .includes(value);
    });
  }, [query, updates]);
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  function updateStatus(updateId: string, status: AdminUpdateReviewStatus) {
    setUpdates(updates.map((item) => (item.updateId === updateId ? { ...item, status } : item)));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="变更确认" />

      <AdminCard className="p-5">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="搜索活动、字段或变更内容"
          className="h-12 w-full rounded-md border border-zinc-200 px-4 text-base outline-none focus:border-teal-700"
        />
      </AdminCard>

      <AdminCard className="overflow-hidden p-0">
        <div className="hidden grid-cols-[minmax(340px,1fr)_190px_minmax(340px,1fr)_160px_200px] border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-base font-semibold text-zinc-500 lg:grid">
          <div>活动</div>
          <div>字段</div>
          <div>变更内容</div>
          <div>状态</div>
          <div>操作</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {pagedRows.map((update) => {
            const review = updates.find((item) => item.updateId === update.id);
            const activity = getActivity(update.activityId);
            const status = review?.status ?? "pending";
            return (
              <div
                key={update.id}
                className="grid gap-4 px-6 py-5 text-[17px] lg:grid-cols-[minmax(340px,1fr)_190px_minmax(340px,1fr)_160px_200px] lg:items-center"
              >
                <div className="min-w-0">
                  {activity ? (
                    <Link href={`/activities/${activity.id}`} className="font-semibold text-zinc-950 hover:text-teal-700">
                      {activity.title}
                    </Link>
                  ) : null}
                  <p className="mt-1 text-[17px] text-zinc-500">{formatDateTime(update.detectedAt)}</p>
                </div>
                <div className="text-zinc-600">{update.field}</div>
                <div className="text-zinc-600">
                  <p className="line-clamp-1">原：{update.previousValue}</p>
                  <p className="mt-1 line-clamp-1">新：{update.newValue}</p>
                </div>
                <div>
                  <AdminBadge tone={status === "pending" ? "amber" : status === "confirmed" ? "teal" : "zinc"}>
                    {statusLabels[status]}
                  </AdminBadge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Action onClick={() => updateStatus(update.id, "confirmed")}>确认</Action>
                  <Action onClick={() => updateStatus(update.id, "ignored")}>忽略</Action>
                  <Action onClick={() => updateStatus(update.id, "pending")}>重置</Action>
                </div>
              </div>
            );
          })}
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

"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { updateTypeLabels } from "@/data/labels";
import { activityUpdates } from "@/data/fixtures";
import { formatDateTime, getActivity } from "@/lib/data";

export function NotificationDrawer({
  open,
  readIds,
  onClose,
  onMarkRead,
}: {
  open: boolean;
  readIds: string[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
}) {
  if (!open) return null;
  const updates = [...activityUpdates].sort((a, b) => b.confirmedAt.localeCompare(a.confirmedAt));

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/30"
        onClick={onClose}
        aria-label="关闭通知抽屉背景"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">
          <div>
            <p className="text-sm font-medium text-teal-700">活动更新通知</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-950">来源于演示更新记录</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:border-teal-600 hover:text-teal-700"
            aria-label="关闭通知抽屉"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {updates.map((update) => {
              const activity = getActivity(update.activityId);
              const read = readIds.includes(update.id);
              return (
                <article
                  key={update.id}
                  className={`rounded-lg border p-4 ${
                    read ? "border-zinc-200 bg-white" : "border-teal-200 bg-teal-50"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-teal-800">
                      {updateTypeLabels[update.updateType]}
                    </span>
                    <span className="text-xs text-zinc-500">{formatDateTime(update.confirmedAt)}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-zinc-950">{activity?.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {update.field}：{update.newValue}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/activities/${update.activityId}`}
                      onClick={onClose}
                      className="inline-flex h-9 items-center rounded-md bg-teal-700 px-3 text-sm font-medium text-white transition hover:bg-teal-800"
                    >
                      查看活动
                    </Link>
                    <button
                      type="button"
                      onClick={() => onMarkRead(update.id)}
                      className="inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:border-teal-600 hover:text-teal-700"
                    >
                      {read ? "已读" : "标记已读"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

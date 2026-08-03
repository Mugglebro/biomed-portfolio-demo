"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { articles } from "@/data/fixtures";
import { AdminBadge, AdminCard, AdminPageHeader, AdminPagination } from "@/components/admin-shell";
import { formatDateTime, getActivity } from "@/lib/data";

const natureLabels: Record<string, string> = {
  registration_invite: "报名通知",
  notice: "活动预告",
  agenda_update: "议程更新",
  speaker_update: "嘉宾更新",
  recap: "活动回顾",
};

export default function AdminArticlesPage() {
  const [query, setQuery] = useState("");
  const [nature, setNature] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const rows = useMemo(
    () =>
      articles.filter((article) => {
        const activity = getActivity(article.activityId);
        const text = `${article.title} ${article.sourceAccountName} ${activity?.title ?? ""}`.toLowerCase();
        const matchesQuery = !query.trim() || text.includes(query.trim().toLowerCase());
        const matchesNature = nature === "all" || article.articleNature === nature;
        return matchesQuery && matchesNature;
      }),
    [nature, query],
  );
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="文章解析" />

      <AdminCard className="p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="搜索文章、来源或活动"
            className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none focus:border-teal-700"
          />
          <select
            value={nature}
            onChange={(event) => {
              setNature(event.target.value);
              setPage(1);
            }}
            className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none focus:border-teal-700"
          >
            <option value="all">全部性质</option>
            {Object.entries(natureLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden p-0">
        <div className="hidden grid-cols-[minmax(380px,1fr)_220px_190px_280px] border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-base font-semibold text-zinc-500 lg:grid">
          <div>文章</div>
          <div>来源</div>
          <div>性质</div>
          <div>关联活动</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {pagedRows.map((article) => {
            const activity = getActivity(article.activityId);
            return (
              <div
                key={article.id}
                className="grid gap-4 px-6 py-5 text-[17px] lg:grid-cols-[minmax(380px,1fr)_220px_190px_280px] lg:items-center"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-950">{article.title}</p>
                  <p className="mt-1 text-zinc-500">{formatDateTime(article.publishedAt)}</p>
                </div>
                <div className="text-zinc-600">{article.sourceAccountName}</div>
                <div>
                  <AdminBadge tone="blue">{natureLabels[article.articleNature]}</AdminBadge>
                </div>
                <div className="min-w-0">
                  {activity ? (
                    <Link href={`/activities/${activity.id}`} className="line-clamp-2 font-medium text-teal-700 hover:text-teal-900">
                      {activity.title}
                    </Link>
                  ) : (
                    <span className="text-zinc-400">未关联</span>
                  )}
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

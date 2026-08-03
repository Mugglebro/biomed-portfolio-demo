"use client";

import { useMemo, useState } from "react";
import { sources } from "@/data/fixtures";
import type { AdminSourceStatus } from "@/data/types";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminPagination,
  useAdminState,
} from "@/components/admin-shell";
import { getSource } from "@/lib/data";

const statusLabels: Record<AdminSourceStatus, string> = {
  active: "启用",
  paused: "暂停",
  watching: "观察",
};

const statusTones: Record<AdminSourceStatus, "teal" | "amber" | "zinc"> = {
  active: "teal",
  paused: "zinc",
  watching: "amber",
};

const sourceTypeLabels: Record<string, string> = {
  wechat: "微信公众号",
  organizer_site: "主办方官网",
  media: "行业媒体",
  rss: "RSS",
};

export default function AdminSourcesPage() {
  const { sources: monitors, setSources } = useAdminState();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const rows = useMemo(() => {
    const value = query.trim().toLowerCase();
    return monitors.filter((monitor) => {
      const source = getSource(monitor.sourceId) ?? sources.find((item) => item.id === monitor.sourceId);
      if (!value) return true;
      return [source?.name, source?.accountName, sourceTypeLabels[source?.type ?? ""], monitor.status]
        .join(" ")
        .toLowerCase()
        .includes(value);
    });
  }, [monitors, query]);
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  function updateStatus(sourceId: string, status: AdminSourceStatus) {
    setSources(
      monitors.map((item) =>
        item.sourceId === sourceId
          ? { ...item, status, lastCheckedAt: new Date().toISOString() }
          : item,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="来源管理" />

      <AdminCard className="p-5">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="搜索来源、账号或类型"
          className="h-12 w-full rounded-md border border-zinc-200 px-4 text-base outline-none focus:border-teal-700"
        />
      </AdminCard>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminCard className="p-5">
          <p className="text-base font-medium text-zinc-500">评分口径</p>
          <p className="mt-2 text-xl font-semibold text-zinc-950">可解析率 / 重复率 / 最近更新</p>
        </AdminCard>
        <AdminCard className="p-5">
          <p className="text-base font-medium text-zinc-500">建议启用</p>
          <p className="mt-2 text-xl font-semibold text-zinc-950">可信度 85 以上</p>
        </AdminCard>
        <AdminCard className="p-5">
          <p className="text-base font-medium text-zinc-500">需观察</p>
          <p className="mt-2 text-xl font-semibold text-zinc-950">更新不稳定或重复较高</p>
        </AdminCard>
      </div>

      <AdminCard className="overflow-hidden p-0">
        <div className="hidden grid-cols-[minmax(300px,1fr)_180px_140px_200px_220px] border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-base font-semibold text-zinc-500 lg:grid">
          <div>来源</div>
          <div>类型</div>
          <div>状态</div>
          <div>可信度</div>
          <div>操作</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {pagedRows.map((monitor) => {
            const source = getSource(monitor.sourceId) ?? sources.find((item) => item.id === monitor.sourceId);
            return (
              <div
                key={monitor.sourceId}
                className="grid gap-4 px-6 py-5 text-[17px] lg:grid-cols-[minmax(300px,1fr)_180px_140px_200px_220px] lg:items-center"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-950">{source?.name ?? monitor.sourceId}</p>
                  <p className="mt-1 truncate text-[17px] text-zinc-500">{source?.accountName}</p>
                </div>
                <div className="text-zinc-600">{sourceTypeLabels[source?.type ?? ""] ?? source?.type}</div>
                <div>
                  <AdminBadge tone={statusTones[monitor.status]}>{statusLabels[monitor.status]}</AdminBadge>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-2 flex-1 bg-zinc-100">
                      <div className="h-full bg-teal-700" style={{ width: `${monitor.reliabilityScore}%` }} />
                    </div>
                    <span className="w-8 text-right tabular-nums text-zinc-500">{monitor.reliabilityScore}</span>
                  </div>
                  <p className="mt-1 text-base text-zinc-400">本周 {monitor.weeklyArticles} 篇</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Action onClick={() => updateStatus(monitor.sourceId, "active")}>启用</Action>
                  <Action onClick={() => updateStatus(monitor.sourceId, "watching")}>观察</Action>
                  <Action onClick={() => updateStatus(monitor.sourceId, "paused")}>暂停</Action>
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

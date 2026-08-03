"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdminMergeStatus } from "@/data/types";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminPagination,
  useAdminState,
} from "@/components/admin-shell";
import { getActivity } from "@/lib/data";

const mergeLabels: Record<AdminMergeStatus, string> = {
  pending: "待处理",
  merged: "已合并",
  ignored: "已忽略",
};

export default function AdminDedupePage() {
  const { merges, setMerges } = useAdminState();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pageSize = 6;
  const rows = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return merges;
    return merges.filter((candidate) => {
      const activity = getActivity(candidate.primaryActivityId);
      return [activity?.title, candidate.candidateTitle, candidate.candidateMeta, mergeLabels[candidate.status]]
        .join(" ")
        .toLowerCase()
        .includes(value);
    });
  }, [merges, query]);
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const selectedCandidate = selectedId ? merges.find((item) => item.id === selectedId) : null;
  const selectedActivity = selectedCandidate ? getActivity(selectedCandidate.primaryActivityId) : undefined;

  function updateStatus(id: string, status: AdminMergeStatus) {
    setMerges(merges.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="重复合并" />

      <AdminCard className="p-5">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="搜索主记录、候选记录或状态"
          className="h-12 w-full rounded-md border border-zinc-200 px-4 text-base outline-none focus:border-teal-700"
        />
      </AdminCard>

      <AdminCard className="overflow-hidden p-0">
        <div className="hidden grid-cols-[minmax(360px,1fr)_minmax(360px,1fr)_140px_210px] border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-base font-semibold text-zinc-500 lg:grid">
          <div>主记录</div>
          <div>候选记录</div>
          <div>相似度</div>
          <div>操作</div>
        </div>
        <div className="divide-y divide-zinc-100">
          {pagedRows.map((candidate) => {
            const activity = getActivity(candidate.primaryActivityId);
            return (
              <div
                key={candidate.id}
                className="grid gap-5 px-6 py-5 text-[17px] lg:grid-cols-[minmax(360px,1fr)_minmax(360px,1fr)_140px_210px] lg:items-center"
              >
                <div className="min-w-0">
                  {activity ? (
                    <Link href={`/activities/${activity.id}`} className="font-semibold text-zinc-950 hover:text-teal-700">
                      {activity.title}
                    </Link>
                  ) : null}
                  <p className="mt-1 text-[17px] text-zinc-500">{mergeLabels[candidate.status]}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">{candidate.candidateTitle}</p>
                  <p className="mt-1 text-[17px] text-zinc-500">{candidate.candidateMeta}</p>
                </div>
                <div>
                  <AdminBadge tone={candidate.confidence > 0.9 ? "teal" : "amber"}>
                    {(candidate.confidence * 100).toFixed(0)}%
                  </AdminBadge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Action onClick={() => setSelectedId(candidate.id)}>查看对比</Action>
                  <Action onClick={() => updateStatus(candidate.id, "merged")}>合并</Action>
                  <Action onClick={() => updateStatus(candidate.id, "ignored")}>忽略</Action>
                </div>
              </div>
            );
          })}
        </div>
        <AdminPagination total={rows.length} pageSize={pageSize} currentPage={page} onPageChange={setPage} />
      </AdminCard>

      {selectedCandidate ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/30"
            onClick={() => setSelectedId(null)}
            aria-label="关闭对比抽屉背景"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-5 border-b border-zinc-200 pb-6">
              <div>
                <p className="text-base font-medium text-teal-700">重复合并</p>
                <h2 className="mt-2 text-[30px] font-semibold tracking-tight text-zinc-950">
                  记录对比
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="h-11 rounded-md border border-zinc-200 px-4 text-base font-medium text-zinc-700 hover:border-teal-600 hover:text-teal-700"
              >
                关闭
              </button>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <CompareCard
                title="主记录"
                rows={[
                  ["活动名称", selectedActivity?.title ?? "未找到"],
                  ["时间", selectedActivity?.startDate ?? "-"],
                  ["城市", selectedActivity?.city ?? "-"],
                  ["场地", selectedActivity?.venue ?? "-"],
                  ["来源数量", selectedActivity ? `${selectedActivity.sourceCount} 个来源` : "-"],
                ]}
              />
              <CompareCard
                title="候选记录"
                rows={[
                  ["活动名称", selectedCandidate.candidateTitle],
                  ["来源线索", selectedCandidate.candidateMeta],
                  ["相似度", `${(selectedCandidate.confidence * 100).toFixed(0)}%`],
                  ["命中字段", selectedCandidate.matchFields.join(" / ")],
                  ["当前状态", mergeLabels[selectedCandidate.status]],
                ]}
              />
            </div>

            <div className="mt-7 border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-xl font-semibold text-zinc-950">处理建议</h3>
              <p className="mt-2 text-base leading-7 text-zinc-600">
                标题核心词、活动时间或城市命中时，建议优先合并为同一活动；若候选记录只包含报名提醒或议程更新，可作为来源文章挂载到主记录下。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Action onClick={() => updateStatus(selectedCandidate.id, "merged")}>确认合并</Action>
                <Action onClick={() => updateStatus(selectedCandidate.id, "ignored")}>保留为独立记录</Action>
                <Action onClick={() => updateStatus(selectedCandidate.id, "pending")}>暂不处理</Action>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function CompareCard({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="border border-zinc-200 bg-white p-5">
      <h3 className="text-xl font-semibold text-zinc-950">{title}</h3>
      <dl className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 border-t border-zinc-100 pt-3">
            <dt className="text-sm font-medium text-zinc-500">{label}</dt>
            <dd className="text-base leading-7 text-zinc-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
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

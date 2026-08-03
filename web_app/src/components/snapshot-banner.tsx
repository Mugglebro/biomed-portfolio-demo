import { snapshotMeta } from "@/data/fixtures";
import { getSourceStats } from "@/lib/data";

export function SnapshotBanner() {
  const stats = getSourceStats();

  return (
    <div className="border-b border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-zinc-500 md:px-6">
        <span>演示数据快照</span>
        <span>
          {snapshotMeta.generatedAt.slice(0, 10)} · {stats.activities} 场活动 · {stats.articles} 篇来源
        </span>
      </div>
    </div>
  );
}

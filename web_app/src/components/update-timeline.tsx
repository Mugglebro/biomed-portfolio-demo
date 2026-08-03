import { updateTypeLabels } from "@/data/labels";
import type { ActivityUpdate } from "@/data/types";
import { formatDateTime, getArticle } from "@/lib/data";

export function UpdateTimeline({ updates }: { updates: ActivityUpdate[] }) {
  if (updates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm text-zinc-500">
        暂无已确认更新记录。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((update) => {
        const article = getArticle(update.articleId);
        return (
          <article key={update.id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
              <span className="rounded-md bg-teal-50 px-2 py-1 text-teal-800">
                {updateTypeLabels[update.updateType]}
              </span>
              <span>{formatDateTime(update.confirmedAt)}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-zinc-950">{update.field}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              从“{update.previousValue}”更新为“{update.newValue}”。
            </p>
            {article ? (
              <p className="mt-2 text-xs text-zinc-500">支撑来源：{article.title}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

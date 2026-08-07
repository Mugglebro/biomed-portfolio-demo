"use client";

import { X } from "lucide-react";
import { articleNatureLabels } from "@/data/labels";
import type { Activity } from "@/data/types";
import { formatDateTime, getArticlesForActivity, getSource } from "@/lib/data";
import { withBasePath } from "@/lib/paths";

const sourceChannelLabels: Record<string, string> = {
  wechat: "微信公众号",
  organizer_site: "主办方官网",
  media: "行业媒体",
  rss: "学会协会 RSS",
};

export function SourceDrawer({
  activity,
  open,
  onClose,
}: {
  activity?: Activity;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !activity) return null;
  const linkedArticles = getArticlesForActivity(activity.id);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/30"
        onClick={onClose}
        aria-label="关闭来源抽屉背景"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        <div className="border-b border-zinc-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-teal-700">
                信息整理自 {activity.sourceCount} 个公开来源
              </p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950">{activity.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{activity.dedupeReason}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition hover:border-teal-600 hover:text-teal-700"
              aria-label="关闭来源抽屉"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {linkedArticles.map((article) => {
              const source = getSource(article.sourceId);
              return (
                <article key={article.id} className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                    <span className="rounded-md bg-teal-50 px-2 py-1 text-teal-800">
                      {articleNatureLabels[article.articleNature]}
                    </span>
                    <span>{article.sourceAccountName}</span>
                    <span>{formatDateTime(article.publishedAt)}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-zinc-950">{article.title}</h3>
                  <dl className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-zinc-900">来源渠道</dt>
                      <dd>{source?.type ? sourceChannelLabels[source.type] : "未知"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-zinc-900">首次发现</dt>
                      <dd>{formatDateTime(article.firstDiscoveredAt)}</dd>
                    </div>
                  </dl>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-zinc-900">抽取字段</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {article.extractedFields.map((field) => (
                        <span key={field} className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={withBasePath(article.originalUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-900"
                  >
                    查看原文链接
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

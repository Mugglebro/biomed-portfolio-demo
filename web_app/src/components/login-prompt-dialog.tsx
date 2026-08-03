"use client";

import Link from "next/link";
import { X } from "lucide-react";

export function LoginPromptDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/30"
        onClick={onClose}
        aria-label="关闭登录提示"
      />
      <section className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
              登录后保存到我的活动
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              登录后可以保存收藏、备注、工作标签和更新提醒。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:border-teal-600 hover:text-teal-700"
            aria-label="关闭登录提示"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-full bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-full border border-teal-600 px-4 text-sm font-semibold text-teal-700 hover:bg-teal-50"
          >
            创建账户
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-600 hover:border-zinc-400"
          >
            暂时不用
          </button>
        </div>
      </section>
    </div>
  );
}

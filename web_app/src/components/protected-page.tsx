"use client";

import Link from "next/link";
import { useAuth } from "@/auth/auth-provider";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 md:px-6">
        <div className="border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Protected
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-950">需要登录</h1>
          <p className="mt-3 text-sm text-zinc-500">登录后可访问个人设置和账号安全页面。</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="inline-flex h-10 items-center rounded-full bg-teal-700 px-4 text-sm font-semibold text-white">登录</Link>
            <Link href="/register" className="inline-flex h-10 items-center rounded-full border border-teal-600 px-4 text-sm font-semibold text-teal-700">创建账户</Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

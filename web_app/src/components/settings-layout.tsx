"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedPage } from "./protected-page";

const tabs = [
  ["/settings/profile", "基本资料"],
  ["/settings/preferences", "兴趣偏好"],
  ["/settings/notifications", "通知设置"],
  ["/settings/security", "账号与安全"],
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedPage>
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-teal-700">个人设置</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">账户与偏好</h1>
          <p className="mt-2 text-sm text-zinc-500">当前为前端演示账号，未接入真实账户服务。</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="space-y-1">
            {tabs.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={`block border-l-2 px-3 py-2 text-sm font-medium ${
                  pathname === href || (pathname === "/settings" && href === "/settings/profile")
                    ? "border-teal-700 text-teal-700"
                    : "border-transparent text-zinc-500 hover:text-teal-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <section className="border border-zinc-200 bg-white p-6 shadow-sm">{children}</section>
        </div>
      </main>
    </ProtectedPage>
  );
}

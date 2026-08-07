"use client";

import Link from "next/link";
import { Bell, Search, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import type { ActivityFilters } from "@/data/types";

const navItems = [
  { href: "/app", label: "活动发现" },
  { href: "/calendar", label: "行业日历" },
];

export function SiteHeader({
  filters,
  setFilters,
  unreadCount,
  onOpenNotifications,
}: {
  filters: ActivityFilters;
  setFilters: (filters: ActivityFilters) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleNavItems = auth.isAuthenticated
    ? [...navItems, { href: "/my-events", label: "我的活动" }]
    : navItems;

  const goSearch = () => {
    if (pathname !== "/app") {
      router.push("/app#activity-search");
      return;
    }
    window.setTimeout(() => {
      document.getElementById("activity-search")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-x-12 gap-y-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-950">
            BioEvent <span className="text-teal-700">Intelligence</span>
          </Link>
          <nav className="flex items-center gap-8" aria-label="Primary">
            {visibleNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b-2 py-1 text-sm font-medium transition ${
                    active
                      ? "border-teal-700 text-zinc-950"
                      : "border-transparent text-zinc-500 hover:text-teal-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex min-w-0 items-center gap-5">
          <label className="relative hidden min-w-0 md:block md:w-64">
            <span className="sr-only">搜索活动</span>
            <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={filters.query}
              onChange={(event) => {
                setFilters({ ...filters, query: event.target.value });
                goSearch();
              }}
              onFocus={goSearch}
              placeholder="搜索活动"
              className="h-10 w-full border-0 border-b border-zinc-200 bg-transparent pl-7 pr-0 text-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-700"
            />
          </label>
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:border-teal-600 hover:text-teal-700"
            aria-label="打开更新通知"
          >
            <Bell className="size-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-teal-700 px-1.5 text-[11px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>
          {auth.isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-teal-700 hover:border-teal-600"
                aria-label="打开用户菜单"
              >
                <UserCircle className="size-5" />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 top-12 w-56 border border-zinc-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-zinc-100 px-3 py-2">
                    <p className="text-sm font-semibold text-zinc-950">{auth.user?.name}</p>
                    <p className="text-xs text-zinc-500">{auth.user?.email}</p>
                  </div>
                  <MenuLink href="/my-events" label="我的活动" />
                  <MenuLink href="/settings" label="个人设置" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      auth.logout();
                    }}
                    className="mt-1 block w-full px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 hover:text-teal-700"
                  >
                    退出登录
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login?role=user"
              className="inline-flex h-10 items-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:border-teal-600 hover:text-teal-700"
            >
              用户登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mt-1 block px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-teal-700"
    >
      {label}
    </Link>
  );
}

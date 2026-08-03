"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import {
  adminActivityReviews,
  adminCollectionRules,
  adminMergeCandidates,
  adminSourceMonitors,
  adminUpdateReviews,
  demoAdminUsers,
} from "@/data/admin-fixtures";
import type {
  AdminActivityReview,
  AdminCollectionRule,
  AdminMergeCandidate,
  AdminSourceMonitor,
  AdminUpdateReview,
  AdminUser,
} from "@/data/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface AdminAccountInput {
  name: string;
  email: string;
  password: string;
  role: AdminUser["role"];
  team: string;
}

interface StoredAdminUser extends AdminUser {
  password: string;
}

interface AdminState {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminUsers: StoredAdminUser[];
  loginAdmin: (email: string, password: string) => Promise<void>;
  createAdminAccount: (input: AdminAccountInput) => Promise<void>;
  logoutAdmin: () => void;
  reviews: AdminActivityReview[];
  setReviews: (value: AdminActivityReview[]) => void;
  sources: AdminSourceMonitor[];
  setSources: (value: AdminSourceMonitor[]) => void;
  merges: AdminMergeCandidate[];
  setMerges: (value: AdminMergeCandidate[]) => void;
  updates: AdminUpdateReview[];
  setUpdates: (value: AdminUpdateReview[]) => void;
  rules: AdminCollectionRule[];
  setRules: (value: AdminCollectionRule[]) => void;
}

const AdminContext = createContext<AdminState | null>(null);

const navGroups = [
  {
    title: "工作台",
    items: [
      { href: "/admin", label: "运营总览", short: "总览" },
      { href: "/admin/activities", label: "活动待审", short: "活动" },
      { href: "/admin/articles", label: "文章解析", short: "文章" },
    ],
  },
  {
    title: "数据治理",
    items: [
      { href: "/admin/sources", label: "来源管理", short: "来源" },
      { href: "/admin/dedupe", label: "重复合并", short: "合并" },
      { href: "/admin/updates", label: "变更确认", short: "变更" },
      { href: "/admin/rules", label: "采集规则", short: "规则" },
    ],
  },
  {
    title: "权限",
    items: [{ href: "/admin/accounts", label: "账号管理", short: "账号" }],
  },
];

function normalizeDemoAdmin(user: StoredAdminUser): StoredAdminUser {
  if (user.email !== "admin@bioevent.local") return user;
  return {
    ...user,
    name: "主管理员",
    role: "super_admin",
    team: "平台运营",
  };
}

export function useAdminState() {
  const value = useContext(AdminContext);
  if (!value) throw new Error("useAdminState must be used inside AdminShell");
  return value;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useLocalStorage<AdminUser | null>("bioevent.admin.user", null);
  const [managedAdmins, setManagedAdmins] = useLocalStorage<StoredAdminUser[]>(
    "bioevent.admin.managedUsers",
    [],
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "bioevent.admin.sidebar.collapsed",
    false,
  );
  const [reviews, setReviews] = useLocalStorage("bioevent.admin.reviews", adminActivityReviews);
  const [sources, setSources] = useLocalStorage("bioevent.admin.sources", adminSourceMonitors);
  const [merges, setMerges] = useLocalStorage("bioevent.admin.merges", adminMergeCandidates);
  const [updates, setUpdates] = useLocalStorage("bioevent.admin.updates", adminUpdateReviews);
  const [rules, setRules] = useLocalStorage("bioevent.admin.rules", adminCollectionRules);

  useEffect(() => {
    const missingRules = adminCollectionRules.filter(
      (defaultRule) => !rules.some((rule) => rule.id === defaultRule.id),
    );
    if (missingRules.length > 0) setRules([...rules, ...missingRules]);
  }, [rules, setRules]);

  useEffect(() => {
    if (adminUser?.email === "admin@bioevent.local") {
      const normalized = normalizeDemoAdmin({ ...adminUser, password: "Admin2026" });
      if (
        adminUser.name !== normalized.name ||
        adminUser.role !== normalized.role ||
        adminUser.team !== normalized.team
      ) {
        setAdminUser({
          id: normalized.id,
          name: normalized.name,
          email: normalized.email,
          role: normalized.role,
          team: normalized.team,
        });
      }
    }
  }, [adminUser, setAdminUser]);

  const normalizedDemoAdminUsers = useMemo(
    () => demoAdminUsers.map((user) => normalizeDemoAdmin(user)),
    [],
  );

  const adminUsers = useMemo<StoredAdminUser[]>(
    () => [...normalizedDemoAdminUsers, ...managedAdmins],
    [managedAdmins, normalizedDemoAdminUsers],
  );

  const loginAdmin = useCallback(
    async (email: string, password: string) => {
      await new Promise((resolve) => window.setTimeout(resolve, 300));
      const found = adminUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());
      if (!found || found.password !== password) throw new Error("管理员邮箱或密码不正确");
      setAdminUser({
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        team: found.team,
      });
      router.push("/admin");
    },
    [adminUsers, router, setAdminUser],
  );

  const createAdminAccount = useCallback(
    async (input: AdminAccountInput) => {
      await new Promise((resolve) => window.setTimeout(resolve, 300));
      if (adminUser?.role !== "super_admin") throw new Error("只有主管理员可以创建后台账号");
      const exists = adminUsers.some((item) => item.email.toLowerCase() === input.email.toLowerCase());
      if (exists) throw new Error("该邮箱已经存在");
      const nextUser: StoredAdminUser = {
        id: `admin-${Date.now()}`,
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
        team: input.team || "内容运营",
      };
      setManagedAdmins([nextUser, ...managedAdmins]);
    },
    [adminUser?.role, adminUsers, managedAdmins, setManagedAdmins],
  );

  const logoutAdmin = useCallback(() => {
    setAdminUser(null);
    router.push("/admin/login");
  }, [router, setAdminUser]);

  const state = useMemo(
    () => ({
      adminUser,
      isAdminAuthenticated: Boolean(adminUser),
      adminUsers,
      loginAdmin,
      createAdminAccount,
      logoutAdmin,
      reviews,
      setReviews,
      sources,
      setSources,
      merges,
      setMerges,
      updates,
      setUpdates,
      rules,
      setRules,
    }),
    [
      adminUser,
      adminUsers,
      createAdminAccount,
      loginAdmin,
      logoutAdmin,
      merges,
      reviews,
      rules,
      setMerges,
      setReviews,
      setRules,
      setSources,
      setUpdates,
      sources,
      updates,
    ],
  );

  if (pathname === "/admin/login") {
    return <AdminContext.Provider value={state}>{children}</AdminContext.Provider>;
  }

  if (!adminUser) {
    return (
      <AdminContext.Provider value={state}>
        <main className="min-h-screen bg-zinc-50 px-4 py-12">
          <div className="mx-auto max-w-md border border-zinc-200 bg-white p-7">
            <p className="text-sm font-semibold text-teal-700">BioEvent Admin</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">需要管理员登录</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              后台账号由主管理员分配，用于活动审核、来源管理和发布前校验。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/login"
                className="inline-flex h-10 items-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
              >
                管理员登录
              </Link>
              <Link href="/app" className="text-sm font-medium text-zinc-500 hover:text-teal-700">
                返回用户端
              </Link>
            </div>
          </div>
        </main>
      </AdminContext.Provider>
    );
  }

  return (
    <AdminContext.Provider value={state}>
      <div className="min-h-screen bg-[#f4f5f5] text-[18px] text-zinc-900">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
          <div className="flex h-[76px] items-center justify-between gap-4 px-6 md:px-10">
            <Link href="/" className="text-[22px] font-semibold tracking-tight">
              BioEvent <span className="text-teal-700">Admin</span>
            </Link>
            <div className="flex items-center gap-5 text-[17px]">
              <Link href="/app" className="text-zinc-500 hover:text-teal-700">
                返回用户端
              </Link>
              <span className="hidden text-zinc-400 sm:inline">{adminUser.name}</span>
              <button type="button" onClick={logoutAdmin} className="text-zinc-500 hover:text-teal-700">
                退出后台
              </button>
              <span className="rounded-md border border-teal-200 bg-teal-50 px-3.5 py-2 text-[15px] font-medium text-teal-800">
                演示后台
              </span>
            </div>
          </div>
        </header>

        <div
          className={`grid min-h-[calc(100vh-76px)] transition-[grid-template-columns] duration-200 ${
            sidebarCollapsed ? "lg:grid-cols-[112px_minmax(0,1fr)]" : "lg:grid-cols-[360px_minmax(0,1fr)]"
          }`}
        >
          <aside className="hidden border-r border-zinc-200 bg-white lg:block">
            <div className="sticky top-[76px] flex h-[calc(100vh-76px)] flex-col">
              <div className="border-b border-zinc-200 px-7 py-6">
                <div className="flex items-center justify-between gap-3">
                  {!sidebarCollapsed ? (
                    <p className="text-xl font-semibold text-zinc-950">后台导航</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="h-11 rounded-md border border-zinc-200 px-4 text-base font-medium text-zinc-600 hover:border-teal-700 hover:text-teal-700"
                  >
                    {sidebarCollapsed ? "展开" : "收起"}
                  </button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Admin">
                {navGroups.map((group) => (
                  <div key={group.title} className="mb-7 last:mb-0">
                    {!sidebarCollapsed ? (
                      <p className="px-3 pb-3 text-base font-semibold text-zinc-400">{group.title}</p>
                    ) : null}
                    <div className="grid gap-1.5">
                      {group.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            title={sidebarCollapsed ? item.label : undefined}
                            className={`flex h-[60px] items-center rounded-md px-3 font-semibold transition ${
                              sidebarCollapsed ? "justify-center text-base" : "justify-between text-[18px]"
                            } ${
                              active
                                ? "bg-teal-50 text-teal-800"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-teal-700"
                            }`}
                          >
                            <span>{sidebarCollapsed ? item.short : item.label}</span>
                            {!sidebarCollapsed && active ? (
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-700" />
                            ) : null}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <main className="min-w-0 px-6 py-10 md:px-10 xl:px-14">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}

export function AdminPageHeader({ title }: { label?: string; title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-[40px] font-semibold leading-tight tracking-tight text-zinc-950">{title}</h1>
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`border border-zinc-200 bg-white p-8 ${className}`}>{children}</section>;
}

export function AdminBadge({
  children,
  tone = "zinc",
}: {
  children: React.ReactNode;
  tone?: "teal" | "amber" | "rose" | "zinc" | "blue";
}) {
  const colors = {
    teal: "border-teal-200 bg-teal-50 text-teal-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    zinc: "border-zinc-200 bg-zinc-50 text-zinc-700",
  };

  return (
    <span className={`inline-flex rounded-md border px-3.5 py-1.5 text-[15px] font-medium ${colors[tone]}`}>
      {children}
    </span>
  );
}

export function AdminPagination({
  total,
  pageSize = 10,
  currentPage,
  onPageChange,
}: {
  total: number;
  pageSize?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (page) => page === 1 || page === pageCount || Math.abs(page - currentPage) <= 1,
  );

  function goToPage(page: number) {
    onPageChange(Math.min(pageCount, Math.max(1, page)));
  }

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-4 text-base text-zinc-500 md:flex-row md:items-center md:justify-between">
      <span>
        共 {total} 条 · 第 {currentPage} / {pageCount} 页
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          className="h-10 rounded-md border border-zinc-200 px-3.5 font-medium text-zinc-600 transition hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          上一页
        </button>
        {pages.map((page, index) => {
          const previous = pages[index - 1];
          return (
            <span key={page} className="inline-flex items-center gap-2">
              {previous && page - previous > 1 ? <span className="text-zinc-300">...</span> : null}
              <button
                type="button"
                onClick={() => goToPage(page)}
                className={`h-10 min-w-10 rounded-md border px-3 font-medium ${
                  page === currentPage
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-teal-600 hover:text-teal-700"
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}
        <button
          type="button"
          disabled={currentPage >= pageCount}
          onClick={() => goToPage(currentPage + 1)}
          className="h-10 rounded-md border border-zinc-200 px-3.5 font-medium text-zinc-600 transition hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          下一页
        </button>
        <form
          className="ml-1 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const input = form.elements.namedItem("page") as HTMLInputElement | null;
            const value = Number(input?.value);
            if (Number.isFinite(value)) goToPage(value);
          }}
        >
          <span>跳至</span>
          <input
            name="page"
            type="number"
            min={1}
            max={pageCount}
            placeholder="页码"
            className="h-10 w-24 rounded-md border border-zinc-200 px-2 text-center text-base text-zinc-700 outline-none focus:border-teal-700"
          />
          <span>页</span>
          <button
            type="submit"
            className="h-10 rounded-md border border-zinc-200 px-3.5 font-medium text-zinc-600 hover:border-teal-600 hover:text-teal-700"
          >
            跳转
          </button>
        </form>
      </div>
    </div>
  );
}

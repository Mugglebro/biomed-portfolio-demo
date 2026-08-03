"use client";

import { FormEvent, useMemo, useState } from "react";
import { AdminBadge, AdminCard, AdminPageHeader, useAdminState } from "@/components/admin-shell";
import type { AdminUser } from "@/data/types";

const roleOptions: Array<{
  value: AdminUser["role"];
  label: string;
  scope: string;
}> = [
  {
    value: "admin",
    label: "系统管理员",
    scope: "维护来源、采集规则、账号与核心配置",
  },
  {
    value: "operator",
    label: "内容运营",
    scope: "审核活动、处理重复线索、确认活动变更",
  },
  {
    value: "reviewer",
    label: "数据质检",
    scope: "查看待审队列并提交质检意见",
  },
];

const roleMeta: Record<AdminUser["role"], { label: string; scope: string; tone: "teal" | "blue" | "amber" | "zinc" }> = {
  super_admin: {
    label: "主管理员",
    scope: "拥有后台账号分配与全部管理权限",
    tone: "teal",
  },
  admin: {
    label: "系统管理员",
    scope: "维护来源、采集规则、账号与核心配置",
    tone: "blue",
  },
  operator: {
    label: "内容运营",
    scope: "审核活动、处理重复线索、确认活动变更",
    tone: "amber",
  },
  reviewer: {
    label: "数据质检",
    scope: "查看待审队列并提交质检意见",
    tone: "zinc",
  },
};

export default function AdminAccountsPage() {
  const { adminUser, adminUsers, createAdminAccount } = useAdminState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminUser["role"]>("operator");
  const [team, setTeam] = useState("内容运营");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const canManageAccounts = adminUser?.role === "super_admin";
  const filteredUsers = useMemo(
    () =>
      adminUsers.filter((user) =>
        [user.name, user.email, user.team, roleMeta[user.role].label]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [adminUsers, query],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!canManageAccounts) {
      setError("只有主管理员可以分配后台账号");
      return;
    }
    if (!name.trim()) {
      setError("请输入姓名");
      return;
    }
    if (!email.includes("@")) {
      setError("请输入有效邮箱");
      return;
    }
    if (password.length < 8) {
      setError("密码至少 8 位");
      return;
    }
    setLoading(true);
    try {
      await createAdminAccount({ name, email, password, role, team });
      setName("");
      setEmail("");
      setPassword("");
      setRole("operator");
      setTeam("内容运营");
      setSuccess("后台账号已创建，可使用该邮箱和初始密码登录。");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title="账号管理" />

      <div className="grid gap-7 2xl:grid-cols-[minmax(0,1fr)_520px]">
        <AdminCard>
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[30px] font-semibold tracking-tight text-zinc-950">后台成员</h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索姓名、邮箱、团队或角色"
              className="h-13 w-full border border-zinc-200 bg-white px-4 text-[17px] outline-none focus:border-teal-700 md:w-[380px]"
            />
          </div>

          <div className="grid gap-3">
            {filteredUsers.map((user) => {
              const meta = roleMeta[user.role];
              return (
                <article
                  key={user.id}
                  className="grid gap-5 border border-zinc-200 bg-zinc-50/40 p-6 transition hover:border-teal-200 hover:bg-white md:grid-cols-[minmax(0,1fr)_230px_130px]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-[22px] font-semibold tracking-tight text-zinc-950">{user.name}</h3>
                      <AdminBadge tone={meta.tone}>{meta.label}</AdminBadge>
                    </div>
                    <p className="mt-2 text-[17px] text-zinc-500">{user.email}</p>
                    <p className="mt-3 text-[17px] leading-7 text-zinc-600">{meta.scope}</p>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-zinc-400">所属团队</p>
                    <p className="mt-2 text-[17px] font-semibold text-zinc-800">{user.team}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-[15px] font-medium text-zinc-400">状态</p>
                    <p className="mt-2 text-[17px] font-semibold text-teal-700">可登录</p>
                  </div>
                </article>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-[30px] font-semibold tracking-tight text-zinc-950">分配后台账号</h2>
          <p className="mt-3 text-[17px] leading-7 text-zinc-500">
            管理员账号不开放自助注册，由主管理员按职责创建并分配。
          </p>

          {!canManageAccounts ? (
            <div className="mt-6 border border-amber-200 bg-amber-50 p-4 text-[17px] leading-7 text-amber-800">
              当前账号没有分配后台账号的权限。
            </div>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="姓名"
              disabled={!canManageAccounts}
              className="h-13 border border-zinc-200 px-4 text-[17px] outline-none focus:border-teal-700 disabled:bg-zinc-50"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="工作邮箱"
              type="email"
              disabled={!canManageAccounts}
              className="h-13 border border-zinc-200 px-4 text-[17px] outline-none focus:border-teal-700 disabled:bg-zinc-50"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="初始密码"
              type="password"
              autoComplete="new-password"
              disabled={!canManageAccounts}
              className="h-13 border border-zinc-200 px-4 text-[17px] outline-none focus:border-teal-700 disabled:bg-zinc-50"
            />
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AdminUser["role"])}
              disabled={!canManageAccounts}
              className="h-13 border border-zinc-200 px-4 text-[17px] outline-none focus:border-teal-700 disabled:bg-zinc-50"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="border border-zinc-200 bg-zinc-50 px-4 py-3 text-[15px] leading-6 text-zinc-500">
              {roleOptions.find((option) => option.value === role)?.scope}
            </div>
            <input
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              placeholder="团队"
              disabled={!canManageAccounts}
              className="h-13 border border-zinc-200 px-4 text-[17px] outline-none focus:border-teal-700 disabled:bg-zinc-50"
            />

            {error ? <p className="text-[17px] text-rose-600">{error}</p> : null}
            {success ? <p className="text-[17px] text-teal-700">{success}</p> : null}

            <button
              type="submit"
              disabled={!canManageAccounts || loading}
              className="h-13 rounded-md bg-teal-700 px-4 text-[17px] font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "创建中" : "创建账号"}
            </button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}

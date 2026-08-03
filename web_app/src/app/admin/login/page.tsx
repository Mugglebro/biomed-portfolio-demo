"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAdminState } from "@/components/admin-shell";

export default function AdminLoginPage() {
  const { loginAdmin } = useAdminState();
  const [email, setEmail] = useState("admin@bioevent.local");
  const [password, setPassword] = useState("BioAdmin2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event?: FormEvent) {
    event?.preventDefault();
    if (loading) return;
    setError("");
    if (!email.includes("@")) {
      setError("请输入管理员邮箱");
      return;
    }
    if (password.length < 8) {
      setError("密码至少 8 位");
      return;
    }
    setLoading(true);
    try {
      await loginAdmin(email, password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败，请检查邮箱和密码");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf9] px-5 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_0.78fr]">
        <section className="hidden lg:block">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-zinc-950">
            BioEvent <span className="text-teal-700">Admin</span>
          </Link>
          <h1 className="mt-16 max-w-2xl text-[64px] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
            管理后台账号入口
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-9 text-zinc-600">
            后台账号由主管理员分配。登录后可以进入账号管理，为运营成员创建演示账号。
          </p>
        </section>

        <section className="border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
          <Link href="/" className="text-base font-medium text-zinc-500 hover:text-teal-700">
            返回首页
          </Link>
          <div className="mt-8">
            <p className="text-base font-medium text-teal-700">BioEvent Admin</p>
            <h2 className="mt-3 text-[34px] font-semibold tracking-[-0.035em] text-zinc-950">
              管理员登录
            </h2>
          </div>

          <form className="mt-7 grid gap-5" onSubmit={onSubmit} noValidate>
            <label className="grid gap-2 text-base font-medium text-zinc-700">
              管理员邮箱
              <input
                className="h-12 border border-zinc-200 px-3.5 text-base font-normal outline-none focus:border-teal-600"
                type="email"
                value={email}
                autoComplete="username"
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-base font-medium text-zinc-700">
              密码
              <div className="relative">
                <input
                  className="h-12 w-full border border-zinc-200 px-3.5 pr-10 text-base font-normal outline-none focus:border-teal-600"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-teal-700"
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            {error ? <p className="text-base text-rose-600">{error}</p> : null}

            <button
              type="button"
              disabled={loading}
              onClick={() => void onSubmit()}
              className="h-12 rounded-md bg-teal-700 px-4 text-base font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {loading ? "登录中" : "进入后台"}
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-100 pt-4 text-sm leading-6 text-zinc-500">
            <p>演示主管理员：admin@bioevent.local</p>
            <p>账号分配入口：登录后进入「账号管理」。</p>
          </div>
        </section>
      </div>
    </main>
  );
}

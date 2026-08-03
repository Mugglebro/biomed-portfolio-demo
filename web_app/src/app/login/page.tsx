"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { AuthCard } from "@/components/auth-card";
import { FormField, inputClass } from "@/components/form-field";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("demo@bioevent.local");
  const [password, setPassword] = useState("Bioevent2026");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event?: FormEvent) {
    event?.preventDefault();
    if (loading) return;
    setError("");
    if (!email.includes("@")) {
      setError("请输入有效的工作邮箱");
      return;
    }
    if (password.length < 8) {
      setError("密码至少 8 位");
      return;
    }
    setLoading(true);
    try {
      await auth.login(email, password, remember);
      router.push("/app");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败，请检查邮箱和密码");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="登录 BioEvent Intelligence"
      description="保存活动、关注主办方并接收活动更新。"
      footer={
        <p className="text-base text-zinc-500">
          还没有账户？{" "}
          <Link href="/register" className="font-semibold text-teal-700 hover:text-teal-900">
            创建账户
          </Link>
        </p>
      }
    >
      <form className="grid gap-5" onSubmit={onSubmit} noValidate>
        <FormField label="工作邮箱">
          <input
            className={inputClass}
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>
        <FormField label="密码">
          <div className="relative">
            <input
              className={`${inputClass} w-full pr-10`}
              type={showPassword ? "text" : "password"}
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-teal-700"
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </FormField>
        <div className="flex items-center justify-between gap-4 text-base">
          <label className="inline-flex items-center gap-2 text-zinc-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            记住登录状态
          </label>
          <Link href="/forgot-password" className="font-semibold text-teal-700 hover:text-teal-900">
            忘记密码
          </Link>
        </div>
        {error ? <p className="text-base text-rose-600">{error}</p> : null}
        <button
          type="button"
          disabled={loading}
          onClick={() => void onSubmit()}
          className="h-12 rounded-full bg-teal-700 px-4 text-base font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? "登录中" : "登录"}
        </button>
      </form>
    </AuthCard>
  );
}

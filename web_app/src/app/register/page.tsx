"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { AuthCard } from "@/components/auth-card";
import { FormField, inputClass } from "@/components/form-field";

export default function RegisterPage() {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    role: "",
    agreed: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("请输入姓名");
    if (!form.email.includes("@")) return setError("请输入有效工作邮箱");
    if (form.password.length < 8) return setError("密码至少 8 位");
    if (form.password !== form.confirmPassword) return setError("两次密码不一致");
    if (!form.agreed) return setError("请同意服务条款和隐私政策");
    setLoading(true);
    try {
      await auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        organization: form.organization,
        role: form.role,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="创建 BioEvent Intelligence 账户"
      description="设置个人偏好后，可保存活动、备注和更新提醒。"
      footer={
        <p className="text-sm text-zinc-500">
          已有账户？{" "}
          <Link href="/login" className="font-medium text-teal-700">
            登录
          </Link>
        </p>
      }
    >
      <form className="grid gap-5" onSubmit={onSubmit}>
        <FormField label="姓名">
          <input
            className={inputClass}
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </FormField>
        <FormField label="工作邮箱">
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </FormField>
        <FormField label="密码">
          <div className="relative">
            <input
              className={`${inputClass} w-full pr-10`}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
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
        <FormField label="确认密码">
          <input
            className={inputClass}
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
          />
        </FormField>
        <FormField label="所属机构，可选">
          <input
            className={inputClass}
            value={form.organization}
            onChange={(event) => setForm({ ...form, organization: event.target.value })}
          />
        </FormField>
        <FormField label="职业方向，可选">
          <input
            className={inputClass}
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
          />
        </FormField>
        <label className="inline-flex items-start gap-2 text-sm leading-6 text-zinc-600">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(event) => setForm({ ...form, agreed: event.target.checked })}
            className="mt-1"
          />
          <span>同意服务条款和隐私政策</span>
        </label>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          disabled={loading}
          className="h-11 rounded-full bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? "创建中" : "创建账户"}
        </button>
      </form>
    </AuthCard>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth-card";
import { FormField, inputClass } from "@/components/form-field";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!email.includes("@")) return setError("请输入有效工作邮箱");
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setMessage("演示版本暂未发送真实邮件，已记录找回请求。");
    }, 350);
  }

  return (
    <AuthCard
      title="找回密码"
      description="输入工作邮箱，演示版本会展示请求状态。"
      footer={<Link href="/login" className="text-sm font-medium text-teal-700">返回登录</Link>}
    >
      <form className="grid gap-5" onSubmit={onSubmit}>
        <FormField label="工作邮箱">
          <input className={inputClass} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormField>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-teal-700">{message}</p> : null}
        <button disabled={loading} className="h-11 rounded-full bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
          {loading ? "提交中" : "提交请求"}
        </button>
      </form>
    </AuthCard>
  );
}

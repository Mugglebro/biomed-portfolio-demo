"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { FormField, inputClass } from "@/components/form-field";
import { SettingsLayout } from "@/components/settings-layout";

export default function SecuritySettingsPage() {
  const auth = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function changePassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (currentPassword.length < 8 || nextPassword.length < 8) {
      setError("密码至少 8 位");
      return;
    }
    setMessage("演示模式：密码修改未调用生产服务");
  }

  return (
    <SettingsLayout>
      <div className="grid gap-8">
        <form className="grid gap-5" onSubmit={changePassword}>
          <h2 className="text-xl font-semibold text-zinc-950">账号与安全</h2>
          <FormField label="当前密码">
            <input className={inputClass} type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </FormField>
          <FormField label="新密码">
            <input className={inputClass} type="password" autoComplete="new-password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
          </FormField>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {message ? <p className="text-sm text-teal-700">{message}</p> : null}
          <button className="h-10 w-fit rounded-full bg-teal-700 px-5 text-sm font-semibold text-white">修改密码</button>
        </form>
        <div className="grid gap-3 border-t border-zinc-100 pt-6">
          <button onClick={auth.logout} className="h-10 w-fit rounded-full border border-zinc-200 px-5 text-sm font-medium text-zinc-700">退出当前设备</button>
          <button onClick={auth.logout} className="h-10 w-fit rounded-full border border-zinc-200 px-5 text-sm font-medium text-zinc-700">退出所有设备</button>
          <button onClick={() => setMessage("演示模式：删除账户未调用生产服务")} className="h-10 w-fit rounded-full border border-rose-200 px-5 text-sm font-medium text-rose-700">删除账户</button>
        </div>
      </div>
    </SettingsLayout>
  );
}

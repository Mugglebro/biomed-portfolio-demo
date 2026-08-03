"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { FormField, inputClass } from "@/components/form-field";
import { SettingsLayout } from "@/components/settings-layout";

export default function ProfileSettingsPage() {
  const auth = useAuth();
  const user = auth.user;
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    organization: user?.organization ?? "",
    role: user?.role ?? "",
    bio: user?.bio ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    auth.updateUser(form);
    setMessage("资料已保存");
  }

  return (
    <SettingsLayout>
      <form className="grid gap-5" onSubmit={onSubmit}>
        <h2 className="text-xl font-semibold text-zinc-950">基本资料</h2>
        <FormField label="姓名">
          <input className={inputClass} autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </FormField>
        <FormField label="邮箱">
          <input className={inputClass} type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </FormField>
        <FormField label="所属机构">
          <input className={inputClass} value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} />
        </FormField>
        <FormField label="职业方向">
          <input className={inputClass} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
        </FormField>
        <FormField label="头像">
          <input className={inputClass} placeholder="头像 URL，演示可留空" value={form.avatarUrl} onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })} />
        </FormField>
        <FormField label="简短个人说明，可选">
          <textarea className="min-h-24 rounded-none border-0 border-b border-zinc-200 px-0 py-2 text-sm outline-none focus:border-teal-700" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
        </FormField>
        {message ? <p className="text-sm text-teal-700">{message}</p> : null}
        <button className="h-10 w-fit rounded-full bg-teal-700 px-5 text-sm font-semibold text-white">保存资料</button>
      </form>
    </SettingsLayout>
  );
}

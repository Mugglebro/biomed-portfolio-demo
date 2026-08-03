"use client";

import { useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { SettingsLayout } from "@/components/settings-layout";

const labels = {
  registrationOpened: "活动开放报名",
  registrationDeadline: "报名截止提醒",
  eventChanged: "活动变更提醒",
  agendaUpdated: "议程更新",
  speakersUpdated: "嘉宾更新",
  organizerPublished: "主办方新活动提醒",
};

export default function NotificationSettingsPage() {
  const auth = useAuth();
  const pref = auth.user?.preferences.notificationPreferences;
  const [values, setValues] = useState(
    pref ?? {
      registrationOpened: true,
      registrationDeadline: true,
      eventChanged: true,
      agendaUpdated: true,
      speakersUpdated: true,
      organizerPublished: false,
    },
  );
  const [siteNotification, setSiteNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);
  const [message, setMessage] = useState("");

  function save() {
    if (!auth.user) return;
    auth.updatePreferences({
      ...auth.user.preferences,
      notificationPreferences: values,
    });
    setMessage("通知设置已保存");
  }

  return (
    <SettingsLayout>
      <div className="grid gap-5">
        <h2 className="text-xl font-semibold text-zinc-950">通知设置</h2>
        <Toggle label="站内通知" checked={siteNotification} onChange={setSiteNotification} />
        <Toggle label="邮件通知" checked={emailNotification} onChange={setEmailNotification} />
        {emailNotification ? (
          <p className="text-sm text-amber-700">演示版本暂未发送真实邮件。</p>
        ) : null}
        {Object.entries(labels).map(([key, label]) => (
          <Toggle
            key={key}
            label={label}
            checked={values[key as keyof typeof values]}
            onChange={(checked) => setValues({ ...values, [key]: checked })}
          />
        ))}
        {message ? <p className="text-sm text-teal-700">{message}</p> : null}
        <button onClick={save} className="h-10 w-fit rounded-full bg-teal-700 px-5 text-sm font-semibold text-white">保存通知</button>
      </div>
    </SettingsLayout>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between border-b border-zinc-100 py-3 text-sm text-zinc-700">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

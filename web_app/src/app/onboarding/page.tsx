"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import {
  defaultNotificationPreference,
  onboardingCities,
  onboardingEventTypes,
  onboardingTopics,
} from "@/data/auth-fixtures";
import { PreferenceChips } from "@/components/preference-chips";

export default function OnboardingPage() {
  const auth = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState(auth.user?.preferences.topicIds ?? []);
  const [cities, setCities] = useState(auth.user?.preferences.cities ?? []);
  const [eventTypes, setEventTypes] = useState(auth.user?.preferences.eventTypes ?? []);
  const [notifications, setNotifications] = useState(defaultNotificationPreference);

  function finish() {
    if (auth.isAuthenticated) {
      auth.updatePreferences({
        topicIds: topics,
        cities,
        eventTypes,
        includeOnline: cities.includes("线上活动"),
        notificationPreferences: notifications,
      });
    }
    router.push("/app");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="border border-zinc-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Onboarding · Step {step}/3
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-950">首次偏好设置</h1>
        <p className="mt-2 text-sm text-zinc-500">可跳过，后续在设置中修改。</p>

        <div className="mt-8">
          {step === 1 ? (
            <div className="grid gap-6">
              <Section title="关注领域">
                <PreferenceChips options={onboardingTopics} selected={topics} onChange={setTopics} />
              </Section>
              <Section title="关注地区">
                <PreferenceChips options={onboardingCities} selected={cities} onChange={setCities} />
              </Section>
            </div>
          ) : null}
          {step === 2 ? (
            <Section title="活动类型">
              <PreferenceChips options={onboardingEventTypes} selected={eventTypes} onChange={setEventTypes} />
            </Section>
          ) : null}
          {step === 3 ? (
            <div className="grid gap-3">
              {Object.entries({
                registrationOpened: "活动开放报名",
                registrationDeadline: "报名即将截止",
                eventChanged: "时间或地点变更",
                agendaUpdated: "议程更新",
                speakersUpdated: "嘉宾更新",
                organizerPublished: "关注主办方发布新活动",
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between border-b border-zinc-100 py-3 text-sm">
                  <span>{label}</span>
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={(event) => setNotifications({ ...notifications, [key]: event.target.checked })}
                  />
                </label>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <Link href="/app" className="text-sm font-medium text-zinc-500 hover:text-teal-700">
            跳过
          </Link>
          <div className="flex gap-3">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="h-10 rounded-full border border-zinc-200 px-4 text-sm font-medium">
                上一步
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => (step < 3 ? setStep(step + 1) : finish())}
              className="h-10 rounded-full bg-teal-700 px-4 text-sm font-semibold text-white"
            >
              {step < 3 ? "下一步" : "完成"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-zinc-950">{title}</h2>
      {children}
    </section>
  );
}

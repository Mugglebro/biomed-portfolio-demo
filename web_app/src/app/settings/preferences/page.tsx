"use client";

import { useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { onboardingCities, onboardingEventTypes, onboardingTopics } from "@/data/auth-fixtures";
import { PreferenceChips } from "@/components/preference-chips";
import { SettingsLayout } from "@/components/settings-layout";

export default function PreferencesSettingsPage() {
  const auth = useAuth();
  const preferences = auth.user?.preferences;
  const [topics, setTopics] = useState(preferences?.topicIds ?? []);
  const [cities, setCities] = useState(preferences?.cities ?? []);
  const [eventTypes, setEventTypes] = useState(preferences?.eventTypes ?? []);
  const [includeOnline, setIncludeOnline] = useState(preferences?.includeOnline ?? true);
  const [message, setMessage] = useState("");

  function save() {
    auth.updatePreferences({
      topicIds: topics,
      cities,
      eventTypes,
      includeOnline,
      notificationPreferences: preferences?.notificationPreferences ?? {
        registrationOpened: true,
        registrationDeadline: true,
        eventChanged: true,
        agendaUpdated: true,
        speakersUpdated: true,
        organizerPublished: false,
      },
    });
    setMessage("偏好已保存");
  }

  return (
    <SettingsLayout>
      <div className="grid gap-7">
        <h2 className="text-xl font-semibold text-zinc-950">兴趣偏好</h2>
        <Section title="关注领域">
          <PreferenceChips options={onboardingTopics} selected={topics} onChange={setTopics} />
        </Section>
        <Section title="关注城市">
          <PreferenceChips options={onboardingCities} selected={cities} onChange={setCities} />
        </Section>
        <Section title="活动类型">
          <PreferenceChips options={onboardingEventTypes} selected={eventTypes} onChange={setEventTypes} />
        </Section>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" checked={includeOnline} onChange={(event) => setIncludeOnline(event.target.checked)} />
          包含线上活动
        </label>
        {message ? <p className="text-sm text-teal-700">{message}</p> : null}
        <button onClick={save} className="h-10 w-fit rounded-full bg-teal-700 px-5 text-sm font-semibold text-white">保存偏好</button>
      </div>
    </SettingsLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-zinc-950">{title}</h3>
      {children}
    </section>
  );
}

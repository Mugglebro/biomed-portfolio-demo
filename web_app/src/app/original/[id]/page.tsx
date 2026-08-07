import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { ActivityStatusBadge, RegistrationBadge } from "@/components/status-badge";
import { formatLabels } from "@/data/labels";
import { activities } from "@/data/fixtures";
import { formatDate, getActivity, getOrganizer } from "@/lib/data";
import { assetUrl, withBasePath } from "@/lib/paths";

export function generateStaticParams() {
  return activities.map((activity) => ({ id: activity.id }));
}

export default async function OriginalPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = getActivity(id);
  if (!activity) notFound();

  const organizer = getOrganizer(activity.organizerId);

  return (
    <main className="min-h-screen bg-[#f4f5f3] px-4 py-10 text-zinc-950 md:px-8">
      <div className="mx-auto max-w-5xl bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-72 bg-zinc-100">
            <Image
              src={assetUrl(activity.coverImage)}
              alt={activity.coverAlt}
              fill
              className={`object-cover ${activity.coverPosition ?? "object-center"}`}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          </div>
          <div className="p-8 md:p-12">
            <Link
              href={withBasePath(`/activities/${activity.id}`)}
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
            >
              <ArrowLeft className="size-4" />
              返回活动详情
            </Link>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                脱敏原始发布页预览
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                {activity.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
                {activity.summary}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <ActivityStatusBadge status={activity.status} />
              <RegistrationBadge status={activity.registrationStatus} />
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 p-8 md:p-12">
          <dl className="grid gap-4 md:grid-cols-2">
            <Info label="时间" icon={<CalendarDays className="size-4" />}>
              {formatDate(activity.startDate)}
              {activity.endDate !== activity.startDate ? ` 至 ${formatDate(activity.endDate)}` : ""}
            </Info>
            <Info label="地点" icon={<MapPin className="size-4" />}>
              {activity.city} · {activity.venue} · {formatLabels[activity.format]}
            </Info>
            <Info label="主办方">{organizer?.name ?? "待确认"}</Info>
            <Info label="页面状态">原始报名字段已脱敏</Info>
          </dl>

          <div className="mt-10 border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold text-zinc-950">报名入口说明</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              作品集演示中不展示真实报名表单，不收集个人信息。真实系统会跳转至主办方或原始发布渠道。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-t border-zinc-200 pt-4">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-zinc-900">{children}</dd>
    </div>
  );
}

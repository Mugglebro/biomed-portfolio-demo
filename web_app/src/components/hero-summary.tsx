import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Database, GitMerge, Newspaper, RefreshCcw } from "lucide-react";
import { getSourceStats } from "@/lib/data";
import { SnapshotBanner } from "./snapshot-banner";

export function HeroSummary() {
  const stats = getSourceStats();

  return (
    <>
      <SnapshotBanner />
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-35" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-4 py-12 md:px-6 md:py-14 lg:grid-cols-12 lg:gap-16 lg:py-16">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              BioEvent Intelligence
            </p>
            <h1 className="editorial-title mt-6 max-w-4xl text-6xl leading-[0.92] tracking-tight text-zinc-950 md:text-8xl lg:text-[112px]">
              生物医疗
              <br />
              行业情报
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-8 text-zinc-600">
              聚合公开活动线索，沉淀可追溯的会议、主办方与来源记录。
            </p>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              <Meta label="主题" value="ADC / CGT / RWE" />
              <Meta label="城市" value="上海 / 杭州 / 北京" />
              <Meta label="确认" value="2026.07.25" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid gap-5">
              <div className="relative h-[300px] overflow-hidden bg-zinc-100 md:h-[380px] lg:h-[470px]">
                <Image
                  src="/images/cover-adc.png"
                  alt="生物医疗行业会议现场"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  priority
                />
              </div>
              <div className="grid gap-4 border-t border-zinc-200 pt-4 sm:grid-cols-3">
                <SourceLine code="WX-042" title="ADC 议程更新" meta="公众号 · 07/24" />
                <SourceLine code="WEB-017" title="RWE 截止提醒" meta="主办方网站 · 07/25" />
                <SourceLine code="RSS-009" title="沙龙延期" meta="RSS · 07/25" />
              </div>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-teal-700 hover:text-teal-900"
              >
                查看活动日程排期
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 border-t border-zinc-200 px-4 md:grid-cols-4 md:px-6">
          <Metric icon={<Database className="size-4" />} label="聚合活动" value={stats.activities} />
          <Metric icon={<Newspaper className="size-4" />} label="来源文章" value={stats.articles} />
          <Metric icon={<GitMerge className="size-4" />} label="公开来源" value={stats.sources} />
          <Metric icon={<RefreshCcw className="size-4" />} label="确认更新" value={stats.updates} />
        </div>
      </section>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-zinc-200 pt-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-zinc-800">{value}</div>
    </div>
  );
}

function SourceLine({
  code,
  title,
  meta,
}: {
  code: string;
  title: string;
  meta: string;
}) {
  return (
    <div>
      <div className="mono-date text-[11px] font-semibold text-teal-700">{code}</div>
      <div className="mt-1 text-sm font-semibold leading-5 text-zinc-950">{title}</div>
      <div className="mt-1 text-xs text-zinc-500">{meta}</div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="border-r border-zinc-200 py-5 last:border-r-0 md:py-6">
      <div className="flex items-center gap-3 px-3 md:px-6">
        <div className="inline-flex size-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-semibold text-zinc-950">{value}</div>
          <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

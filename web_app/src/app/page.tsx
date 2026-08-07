"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { activities, articles, sources } from "@/data/fixtures";
import { assetUrl } from "@/lib/paths";

const metrics = [
  { label: "活动样例", value: activities.length },
  { label: "来源文章", value: articles.length },
  { label: "公开来源", value: sources.length },
];

const workflowItems = [
  ["公开线索", "整理会议、论坛、展会、沙龙等公开活动信息，保留时间、城市、主办方和报名入口。"],
  ["来源追溯", "关联原始文章、发布渠道和发布时间，便于回看活动信息的出处。"],
  ["活动合并", "把多篇来源指向的同一场活动合并成一条记录，减少重复跟进。"],
  ["变更确认", "记录时间、地点、议程、嘉宾和报名状态的变化，形成可复盘的更新链路。"],
  ["工作清单", "用户可收藏活动、添加标签和备注，把值得跟进的活动沉淀为个人清单。"],
  ["采集规则", "后台维护主题词、渠道类型和候选方向，让演示系统呈现完整的运营闭环。"],
];

const sampleRows = [
  ["09 / 18", "第七届 ADC 药物开发与产业化论坛", "上海", "4 篇来源"],
  ["08 / 28", "真实世界研究与医学数据应用峰会", "杭州", "3 篇来源"],
  ["10 / 16", "细胞治疗临床转化闭门研讨会", "北京", "2 篇来源"],
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fbfa] text-zinc-950">
      <HeroBackdrop />

      <header className="fixed inset-x-0 top-0 z-30 border-b border-teal-900/10 bg-white/76 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1520px] items-center justify-between px-6 md:px-10">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            BioEvent <span className="text-teal-700">Intelligence</span>
          </Link>
          <nav className="hidden items-center gap-10 text-sm font-semibold text-zinc-500 md:flex">
            <a href="#entry" className="transition hover:text-teal-700">
              选择入口
            </a>
            <a href="#workflow" className="transition hover:text-teal-700">
              项目结构
            </a>
            <a href="#samples" className="transition hover:text-teal-700">
              活动样例
            </a>
          </nav>
          <Link
            href="/app"
            className="hidden rounded-full border border-teal-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-teal-700/45 hover:text-teal-800 md:inline-flex"
          >
            活动发现
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[112dvh] max-w-[1520px] items-center gap-14 px-6 pb-24 pt-32 md:px-10 lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,0.58fr)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-teal-700">
            BioEvent Intelligence
          </p>
          <h1 className="mt-8 max-w-5xl text-[clamp(64px,10.4vw,156px)] font-semibold leading-[0.86] tracking-[-0.075em] text-zinc-950">
            生物医疗
            <br />
            活动情报
          </h1>
          <p className="mt-10 max-w-3xl text-[clamp(22px,1.8vw,30px)] leading-[1.5] text-zinc-600">
            面向行业研究、BD 拓展和内容运营，整理公开活动线索，保留来源、更新和跟进状态。
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/login?role=user"
              className="inline-flex h-14 items-center rounded-full bg-teal-700 px-8 text-base font-semibold text-white shadow-[0_18px_42px_rgba(15,118,110,0.2)] transition hover:bg-teal-800"
            >
              用户登录
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex h-14 items-center rounded-full border border-teal-900/15 bg-white/84 px-8 text-base font-semibold text-zinc-800 backdrop-blur transition hover:border-teal-700/45 hover:text-teal-800"
            >
              管理员登录
            </Link>
          </div>
        </div>

        <aside className="relative">
          <div className="relative overflow-hidden rounded-[34px] border border-teal-900/10 bg-white/82 p-7 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <p className="text-base font-semibold text-teal-700">近期活动</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-[-0.045em]">已整理记录</h2>
            <div className="mt-6 divide-y divide-zinc-100">
              {sampleRows.map(([date, title, city, source]) => (
                <Link href="/app" key={title} className="grid gap-3 py-6 transition hover:text-teal-800">
                  <div className="flex items-center justify-between gap-5">
                    <p className="mono-date text-base font-semibold text-zinc-950">{date}</p>
                    <p className="text-sm font-medium text-teal-700">{source}</p>
                  </div>
                  <h3 className="text-[22px] font-semibold leading-snug tracking-[-0.035em]">{title}</h3>
                  <p className="text-base text-zinc-500">{city}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 border-y border-teal-900/10 bg-white/62 backdrop-blur">
            {metrics.map((item) => (
              <div key={item.label} className="border-r border-teal-900/10 px-5 py-6 last:border-r-0">
                <p className="mono-date text-4xl font-semibold leading-none text-zinc-950">{item.value}</p>
                <p className="mt-3 text-sm text-zinc-500">{item.label}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section id="entry" className="relative z-10 border-y border-teal-900/10 bg-white/80 px-6 py-24 backdrop-blur md:px-10">
        <div className="mx-auto grid max-w-[1520px] gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-base font-semibold text-teal-700">入口选择</p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-tight tracking-[-0.05em] text-zinc-950 md:text-7xl">
              用户查看活动，后台维护数据。
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <EntryCard
              title="用户端"
              body="浏览活动、搜索筛选、查看详情和来源追溯，把重要活动加入个人清单。"
              href="/login?role=user"
              cta="登录用户端"
            />
            <EntryCard
              title="管理员端"
              body="维护来源、审核活动、处理重复线索，确认活动时间、地点、议程等信息变化。"
              href="/admin/login"
              cta="登录后台"
            />
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-[1520px] px-6 py-28 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.62fr_1.38fr]">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-base font-semibold text-teal-700">项目结构</p>
            <h2 className="mt-5 text-5xl font-semibold leading-tight tracking-[-0.05em] text-zinc-950 md:text-7xl">
              从公开线索到工作清单。
            </h2>
          </div>
          <div className="grid gap-0">
            {workflowItems.map(([title, body], index) => (
              <article
                key={title}
                className="grid gap-8 border-t border-teal-900/10 py-9 md:grid-cols-[120px_1fr]"
              >
                <p className="mono-date text-lg text-zinc-400">0{index + 1}</p>
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{title}</h3>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="samples" className="relative z-10 px-6 pb-32 md:px-10">
        <div className="mx-auto max-w-[1520px] border border-teal-900/10 bg-white/84 p-7 shadow-sm backdrop-blur-xl md:p-10">
          <div className="flex items-end justify-between gap-6 border-b border-zinc-200 pb-7">
            <div>
              <p className="text-base font-semibold text-teal-700">近期活动样例</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                已整理的活动记录
              </h2>
            </div>
            <Link href="/app" className="hidden text-base font-semibold text-teal-700 hover:text-teal-900 md:inline-flex">
              查看活动发现
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {sampleRows.map(([date, title, city, source]) => (
              <Link
                href="/app"
                key={title}
                className="grid gap-4 py-7 transition hover:bg-teal-50/60 md:grid-cols-[110px_1fr_110px_120px]"
              >
                <span className="mono-date text-lg font-semibold text-zinc-950">{date}</span>
                <span className="text-xl font-semibold text-zinc-950">{title}</span>
                <span className="text-zinc-500">{city}</span>
                <span className="text-teal-700">{source}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function EntryCard({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-[280px] flex-col justify-between border border-teal-900/10 bg-white/82 p-8 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-teal-700/35 hover:bg-white"
    >
      <div>
        <h3 className="text-4xl font-semibold tracking-[-0.045em]">{title}</h3>
        <p className="mt-6 text-lg leading-8 text-zinc-600">{body}</p>
      </div>
      <div className="mt-10 text-base font-semibold text-teal-700">{cta}</div>
    </Link>
  );
}

function HeroBackdrop() {
  const heroStyle = {
    "--bioevent-hero-image": `url("${assetUrl("/images/bioevent-hero-intelligence-lite.jpg")}")`,
  } as CSSProperties;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bioevent-hero-photo absolute inset-0" style={heroStyle} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,251,250,0.96)_0%,rgba(247,251,250,0.88)_36%,rgba(247,251,250,0.58)_68%,rgba(247,251,250,0.74)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(204,251,241,0.38),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(15,118,110,0.12),transparent_30%)]" />
      <div className="bioevent-light-sweep absolute -left-1/3 top-0 h-full w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.62),transparent)] blur-2xl" />
      <div className="absolute inset-0 bg-grain opacity-30" />
    </div>
  );
}

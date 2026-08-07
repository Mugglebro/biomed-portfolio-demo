"use client";

import { useState } from "react";
import type { DistributionItem, InsightMetric, TrendPoint } from "@/data/analytics-fixtures";

interface AdminAnalyticsWorkbenchProps {
  metrics: InsightMetric[];
  trend: TrendPoint[];
  conferenceTypeShare: DistributionItem[];
  sourceMix: DistributionItem[];
  feedbackTypes: DistributionItem[];
}

const palette = ["#0f766e", "#14b8a6", "#475569", "#f59e0b", "#94a3b8", "#a78bfa", "#cbd5e1"];

const metricCopy: Record<string, string> = {
  资讯有效率: "候选内容经过主题、时间、主办方和来源初筛后，仍值得进入运营判断的比例。",
  来源核验通过率: "能回溯到明确发布主体、发布时间和原始链接的来源占比。",
  会议重复率: "同一活动被多篇文章或多个渠道重复命中的比例，用于观察去重压力。",
  会议有效信息率: "活动时间、地点、主办方、报名状态、议程或嘉宾等关键字段的完整程度。",
};

function share(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function LineChart({ points }: { points: TrendPoint[] }) {
  const [activeIndex, setActiveIndex] = useState(points.length - 1);
  const width = 760;
  const height = 320;
  const padding = { left: 54, right: 28, top: 32, bottom: 48 };
  const values = points.map((point) => point.value);
  const floor = Math.max(0, Math.min(...values) - 8);
  const ceiling = Math.min(100, Math.max(...values) + 8);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const coords = points.map((point, index) => {
    const x = padding.left + (index / Math.max(points.length - 1, 1)) * plotWidth;
    const y = padding.top + ((ceiling - point.value) / Math.max(ceiling - floor, 1)) * plotHeight;
    return { ...point, x, y };
  });
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding.left},${height - padding.bottom} ${line} ${width - padding.right},${height - padding.bottom}`;
  const active = coords[activeIndex] ?? coords[coords.length - 1];

  return (
    <section className="border border-zinc-200 bg-white p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="text-[30px] font-semibold tracking-tight text-zinc-950">来源核验趋势</h2>
        </div>
        <div className="text-right">
          <span className="text-[15px] font-semibold text-zinc-500">最近批次</span>
          <strong className="mt-1 block text-[42px] font-semibold leading-none text-teal-700">{active?.value ?? 0}%</strong>
          <span className="mt-2 block text-[14px] text-zinc-500">{active?.label}</span>
        </div>
      </div>

      <div className="relative mt-7">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[360px] w-full" role="img" aria-label="来源核验趋势折线图">
          <defs>
            <linearGradient id="sourceTrendArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f766e" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((lineIndex) => {
            const y = padding.top + (lineIndex / 3) * plotHeight;
            const label = Math.round(ceiling - (lineIndex / 3) * (ceiling - floor));
            return (
              <g key={lineIndex}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <text x={padding.left - 12} y={y + 4} textAnchor="end" fontSize="13" fill="#64748b">
                  {label}%
                </text>
              </g>
            );
          })}
          <polygon points={area} fill="url(#sourceTrendArea)" />
          <polyline points={line} fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {coords.map((point, index) => (
            <g key={point.label} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} tabIndex={0}>
              <line x1={point.x} x2={point.x} y1={padding.top} y2={height - padding.bottom} stroke={index === activeIndex ? "#99f6e4" : "transparent"} strokeWidth="1" />
              <circle cx={point.x} cy={point.y} r={index === activeIndex ? 7 : 5} fill="#ffffff" stroke="#0f766e" strokeWidth="4" />
              <circle cx={point.x} cy={point.y} r="16" fill="transparent">
                <title>{`${point.label}: ${point.value}%`}</title>
              </circle>
              <text x={point.x} y={height - 16} textAnchor="middle" fontSize="13" fill="#64748b">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
        {active ? (
          <div
            className="pointer-events-none absolute rounded border border-zinc-200 bg-white px-4 py-3 text-[14px] shadow-[0_14px_34px_rgba(15,23,42,0.12)]"
            style={{
              left: `${(active.x / width) * 100}%`,
              top: `${(active.y / height) * 100}%`,
              transform: "translate(-50%, -118%)",
            }}
          >
            <b className="block text-zinc-950">{active.label}</b>
            <span className="mt-1 block text-zinc-500">来源核验通过率 {active.value}%</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DonutPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: DistributionItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const gradientStops = items
    .reduce<{ stops: string[]; running: number }>(
      (acc, item, index) => {
        const start = (acc.running / total) * 100;
        const nextRunning = acc.running + item.value;
        const end = (nextRunning / total) * 100;
        acc.stops.push(`${palette[index % palette.length]} ${start}% ${end}%`);
        return { stops: acc.stops, running: nextRunning };
      },
      { stops: [], running: 0 },
    )
    .stops.join(", ");
  const active = items[activeIndex] ?? items[0];

  return (
    <section className="border border-zinc-200 bg-white p-7">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[26px] font-semibold tracking-tight text-zinc-950">{title}</h2>
          <p className="mt-2 text-[15px] leading-6 text-zinc-500">{description}</p>
        </div>
        <div
          className="relative h-40 w-40 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${gradientStops})` }}
          aria-label={`${title}分布图`}
        >
          <div className="absolute inset-5 rounded-full bg-white" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[34px] font-semibold text-zinc-950">{share(active.value, total)}%</span>
            <span className="mt-1 max-w-[100px] truncate text-[13px] font-semibold text-zinc-500">{active.label}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-2">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            className="grid grid-cols-[18px_1fr_auto] items-center gap-3 border-b border-zinc-100 py-3 text-left last:border-b-0"
          >
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
            <span>
              <span className="block text-[16px] font-semibold text-zinc-900">{item.label}</span>
              {item.note ? <span className="mt-1 block text-[13px] leading-5 text-zinc-500">{item.note}</span> : null}
            </span>
            <span className="text-[16px] font-semibold text-zinc-500">{share(item.value, total)}%</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function AdminAnalyticsWorkbench({
  metrics,
  trend,
  conferenceTypeShare,
  sourceMix,
  feedbackTypes,
}: AdminAnalyticsWorkbenchProps) {
  return (
    <div className="space-y-7">
      <section className="grid overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-[0_16px_42px_rgba(15,23,42,0.06)] md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="border-b border-zinc-200 p-7 md:border-b-0 md:border-r md:last:border-r-0">
            <p className="text-[17px] font-semibold text-zinc-500">{metric.label}</p>
            <strong className="mt-4 block text-[54px] font-semibold leading-none tracking-tight text-zinc-950">{metric.value}</strong>
            <p className="mt-4 text-[14px] leading-6 text-zinc-500">{metricCopy[metric.label] ?? metric.helper}</p>
          </div>
        ))}
      </section>

      <LineChart points={trend} />

      <section className="grid gap-7 xl:grid-cols-3">
        <DonutPanel title="信息来源分布" description="观察主要线索来自哪些渠道，辅助判断采集结构是否均衡。" items={sourceMix} />
        <DonutPanel title="各类型会议占比" description="按活动形态拆分，评估内容供给是否覆盖常见工作场景。" items={conferenceTypeShare} />
        <DonutPanel title="用户反馈类型分布" description="把反馈拆成可复盘的问题类型，便于迭代规则和审核口径。" items={feedbackTypes} />
      </section>
    </div>
  );
}

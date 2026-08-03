"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { ActivityFilters, ActivityType } from "@/data/types";
import { getAllCities, getAllTopics } from "@/lib/data";

const activityTypes: Array<"all" | ActivityType> = [
  "all",
  "峰会",
  "研讨会",
  "沙龙",
  "展会",
  "论坛",
];

export function FiltersPanel({
  filters,
  setFilters,
  onReset,
  count,
}: {
  filters: ActivityFilters;
  setFilters: (filters: ActivityFilters) => void;
  onReset: () => void;
  count: number;
}) {
  const topics = getAllTopics();
  const cities = getAllCities();
  const activeFilters = [
    filters.query.trim() ? `关键词：${filters.query.trim()}` : "",
    filters.timeScope !== "all" ? labelOf(filters.timeScope, timeOptions) : "",
    filters.type !== "all" ? filters.type : "",
    filters.topic !== "all" ? filters.topic : "",
    filters.city !== "all" ? filters.city : "",
    filters.format !== "all" ? labelOf(filters.format, formatOptions) : "",
    filters.registrationStatus !== "all"
      ? labelOf(filters.registrationStatus, registrationOptions)
      : "",
    filters.status !== "all" ? labelOf(filters.status, statusOptions) : "",
  ].filter(Boolean);

  return (
    <section className="border-y border-zinc-200 bg-white py-7">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="inline-flex items-center gap-3 text-base font-semibold text-zinc-950">
              活动检索
              <SlidersHorizontal className="size-4 text-zinc-400" />
            </h3>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-teal-600 hover:text-teal-700 active:translate-y-px"
          >
            <RotateCcw className="size-4" />
            清除筛选
          </button>
        </div>

        <label className="block">
          <span className="sr-only">搜索活动、主办方、城市或主题</span>
          <div className="relative border-b border-zinc-300 transition focus-within:border-teal-700">
            <Search className="pointer-events-none absolute left-0 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
            <input
              value={filters.query}
              onChange={(event) => setFilters({ ...filters, query: event.target.value })}
              placeholder="搜索活动、主办方、城市或主题"
              className="h-14 w-full bg-transparent pl-8 text-[17px] outline-none placeholder:text-zinc-400"
            />
          </div>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div>
            <p className="text-base font-semibold text-zinc-950">当前结果</p>
            <p className="mt-1 text-sm text-zinc-500">
              {activeFilters.length > 0 ? activeFilters.join(" / ") : "全部活动"}
            </p>
          </div>
          <span className="mono-date text-lg font-semibold text-teal-800">{count} 场</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label="时间范围"
            value={filters.timeScope}
            onChange={(value) =>
              setFilters({ ...filters, timeScope: value as ActivityFilters["timeScope"] })
            }
            options={timeOptions}
          />
          <Select
            label="活动类型"
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value as ActivityFilters["type"] })}
            options={activityTypes.map((type) => [type, type === "all" ? "全部类型" : type])}
          />
          <Select
            label="主题"
            value={filters.topic}
            onChange={(value) => setFilters({ ...filters, topic: value })}
            options={[["all", "全部主题"], ...topics.map((topic) => [topic, topic])]}
          />
          <Select
            label="城市"
            value={filters.city}
            onChange={(value) => setFilters({ ...filters, city: value })}
            options={[["all", "全部城市"], ...cities.map((city) => [city, city])]}
          />
          <Select
            label="举办形式"
            value={filters.format}
            onChange={(value) =>
              setFilters({ ...filters, format: value as ActivityFilters["format"] })
            }
            options={formatOptions}
          />
          <Select
            label="报名状态"
            value={filters.registrationStatus}
            onChange={(value) =>
              setFilters({
                ...filters,
                registrationStatus: value as ActivityFilters["registrationStatus"],
              })
            }
            options={registrationOptions}
          />
          <Select
            label="活动状态"
            value={filters.status}
            onChange={(value) =>
              setFilters({ ...filters, status: value as ActivityFilters["status"] })
            }
            options={statusOptions}
          />
          <Select
            label="排序"
            value={filters.sortBy}
            onChange={(value) =>
              setFilters({ ...filters, sortBy: value as ActivityFilters["sortBy"] })
            }
            options={[
              ["lastVerifiedAt", "最近确认优先"],
              ["startDate", "开始时间优先"],
              ["sourceCount", "来源数量优先"],
              ["priorityScore", "活动热度优先"],
            ]}
          />
        </div>
      </div>
    </section>
  );
}

const timeOptions = [
  ["all", "全部时间"],
  ["upcoming", "未举办"],
  ["next30", "未来 30 天"],
  ["next90", "未来 90 天"],
];

const formatOptions = [
  ["all", "全部形式"],
  ["offline", "线下"],
  ["online", "线上"],
  ["hybrid", "线上线下"],
];

const registrationOptions = [
  ["all", "全部状态"],
  ["open", "开放报名"],
  ["not_open", "尚未开放"],
  ["closing_soon", "即将截止"],
  ["closed", "已截止"],
  ["invite_only", "邀请制"],
  ["unknown", "待确认"],
];

const statusOptions = [
  ["all", "全部状态"],
  ["upcoming", "未举办"],
  ["ended", "已结束"],
  ["postponed", "延期"],
  ["cancelled", "取消"],
];

function labelOf(value: string, options: string[][]) {
  return options.find(([optionValue]) => optionValue === value)?.[1] ?? value;
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="grid gap-1.5 text-[13px] font-semibold text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-none border-0 border-b border-zinc-200 bg-white px-0 text-base font-normal text-zinc-900 outline-none transition focus:border-teal-600"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

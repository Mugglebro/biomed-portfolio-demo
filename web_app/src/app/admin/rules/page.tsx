"use client";

import { FormEvent, useMemo, useState } from "react";
import type { SourceType } from "@/data/types";
import type { AdminCollectionRule } from "@/data/types";
import {
  AdminBadge,
  AdminCard,
  AdminPageHeader,
  AdminPagination,
  useAdminState,
} from "@/components/admin-shell";

const sourceTypeLabels: Record<SourceType, string> = {
  wechat: "微信公众号订阅源",
  organizer_site: "主办方官网",
  media: "行业媒体网站",
  rss: "学会/协会 RSS",
};

const channelExamples: Record<SourceType, string> = {
  wechat: "医药魔方、动脉网、药明康德内容号",
  organizer_site: "大会官网、主办方新闻页、报名入口页",
  media: "医谷、健康界、器械之家",
  rss: "学会通知、协会动态、展会公告",
};

export default function AdminRulesPage() {
  const { rules, setRules } = useAdminState();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState({
    topic: "",
    keyword: "",
    sourceType: "wechat" as SourceType,
    status: "active" as AdminCollectionRule["status"],
  });
  const [formMessage, setFormMessage] = useState("");
  const pageSize = 5;
  const activeCount = rules.filter((rule) => rule.status === "active").length;
  const pausedCount = rules.length - activeCount;
  const channelCount = Array.from(new Set(rules.map((rule) => rule.sourceType))).length;
  const filteredRules = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return rules;
    return rules.filter((rule) =>
      [rule.topic, rule.keyword, sourceTypeLabels[rule.sourceType]].join(" ").toLowerCase().includes(value),
    );
  }, [query, rules]);
  const pagedRules = filteredRules.slice((page - 1) * pageSize, page * pageSize);

  function toggleRule(ruleId: string) {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId
          ? { ...rule, status: rule.status === "active" ? "paused" : "active" }
          : rule,
      ),
    );
  }

  function updateKeyword(ruleId: string, keyword: string) {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, keyword } : rule)));
  }

  function addRule(event: FormEvent) {
    event.preventDefault();
    setFormMessage("");
    if (!draft.topic.trim()) {
      setFormMessage("请填写主题");
      return;
    }
    if (draft.keyword.trim().length < 4) {
      setFormMessage("请填写可执行的关键词表达式");
      return;
    }
    const id = `rule-${Date.now()}`;
    setRules([
      {
        id,
        topic: draft.topic.trim(),
        keyword: draft.keyword.trim(),
        sourceType: draft.sourceType,
        status: draft.status,
      },
      ...rules,
    ]);
    setDraft({ topic: "", keyword: "", sourceType: "wechat", status: "active" });
    setFormMessage("规则已加入当前演示后台");
    setDrawerOpen(false);
    setPage(1);
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader label="采集规则" title="采集规则" />

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="启用规则" value={activeCount} />
        <Metric label="暂停规则" value={pausedCount} />
        <Metric label="来源覆盖" value={channelCount} />
      </div>

      <div className="grid gap-6 min-[1800px]:grid-cols-[minmax(0,1fr)_460px]">
        <AdminCard className="p-0">
          <div className="flex flex-col gap-5 border-b border-zinc-200 px-7 py-6 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-[26px] font-semibold tracking-tight">采集主题词</h2>
            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="搜索规则、关键词或来源"
                className="h-12 min-w-0 rounded-md border border-zinc-200 bg-white px-4 text-base outline-none transition focus:border-teal-700 sm:w-96"
              />
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="h-12 rounded-md bg-teal-700 px-5 text-base font-semibold text-white transition hover:bg-teal-800 active:translate-y-px"
              >
                新增规则
              </button>
            </div>
          </div>

          <div className="hidden grid-cols-[150px_minmax(260px,1fr)_210px_100px_100px] border-b border-zinc-200 bg-zinc-50 px-7 py-4 text-base font-semibold text-zinc-500 lg:grid">
            <div>主题</div>
            <div>关键词表达式</div>
            <div>采集来源</div>
            <div>状态</div>
            <div>操作</div>
          </div>

          <div className="divide-y divide-zinc-100">
            {pagedRules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                onToggle={() => toggleRule(rule.id)}
                onKeywordChange={(keyword) => updateKeyword(rule.id, keyword)}
              />
            ))}
          </div>
          <AdminPagination
            total={filteredRules.length}
            pageSize={pageSize}
            currentPage={page}
            onPageChange={setPage}
          />
        </AdminCard>

        <aside className="grid gap-5 content-start">
          <AdminCard className="p-6">
            <h2 className="text-[24px] font-semibold tracking-tight">来源覆盖</h2>
            <div className="mt-5 space-y-4 text-base">
              {Object.entries(sourceTypeLabels).map(([type, label]) => {
                const count = rules.filter((rule) => rule.sourceType === type).length;
                return (
                  <div key={type} className="border-b border-zinc-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-zinc-800">{label}</span>
                      <span className="tabular-nums text-zinc-950">{count}</span>
                    </div>
                    <p className="mt-1 text-base leading-7 text-zinc-500">
                      {channelExamples[type as SourceType]}
                    </p>
                  </div>
                );
              })}
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="text-[24px] font-semibold tracking-tight">候选主题词</h2>
            <div className="mt-5 space-y-4">
              {[
                ["产业园合作", "张江、苏州工业园、成都高新区"],
                ["海外注册", "FDA、MDR、CE、出海合规"],
                ["投融资路演", "融资、并购、项目路演、商务对接"],
              ].map(([topic, keyword]) => (
                <div key={topic} className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-base font-semibold text-zinc-950">{topic}</p>
                  <p className="mt-1 text-base leading-7 text-zinc-500">{keyword}</p>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="text-[24px] font-semibold tracking-tight">规则命中</h2>
            <div className="mt-5 space-y-4">
              {rules.slice(0, 3).map((rule) => (
                <div key={rule.id} className="rounded-md border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-medium text-zinc-950">{rule.topic}</p>
                    <AdminBadge tone={rule.status === "active" ? "teal" : "zinc"}>
                      {rule.status === "active" ? "启用" : "暂停"}
                    </AdminBadge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-base leading-7 text-zinc-500">{rule.keyword}</p>
                </div>
              ))}
            </div>
          </AdminCard>
        </aside>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/30"
            onClick={() => setDrawerOpen(false)}
            aria-label="关闭新增规则抽屉背景"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-8 shadow-2xl">
            <div className="border-b border-zinc-200 pb-6">
              <p className="text-base font-medium text-teal-700">采集规则</p>
              <h2 className="mt-2 text-[30px] font-semibold tracking-tight text-zinc-950">
                新增主题词规则
              </h2>
            </div>

            <form className="mt-7 grid gap-5" onSubmit={addRule}>
              <label className="grid gap-2 text-base font-medium text-zinc-700">
                主题
                <input
                  value={draft.topic}
                  onChange={(event) => setDraft({ ...draft, topic: event.target.value })}
                  placeholder="如：产业园合作"
                  className="h-12 rounded-md border border-zinc-200 px-4 font-normal outline-none focus:border-teal-700"
                />
              </label>
              <label className="grid gap-2 text-base font-medium text-zinc-700">
                关键词表达式
                <textarea
                  value={draft.keyword}
                  onChange={(event) => setDraft({ ...draft, keyword: event.target.value })}
                  placeholder="如：产业园 OR 创新中心 OR 张江 OR 苏州工业园"
                  rows={4}
                  className="min-h-28 resize-none rounded-md border border-zinc-200 px-4 py-3 font-normal leading-7 outline-none focus:border-teal-700"
                />
              </label>
              <label className="grid gap-2 text-base font-medium text-zinc-700">
                采集来源
                <select
                  value={draft.sourceType}
                  onChange={(event) => setDraft({ ...draft, sourceType: event.target.value as SourceType })}
                  className="h-12 rounded-md border border-zinc-200 px-4 font-normal outline-none focus:border-teal-700"
                >
                  {Object.entries(sourceTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-base font-medium text-zinc-700">
                状态
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({ ...draft, status: event.target.value as AdminCollectionRule["status"] })
                  }
                  className="h-12 rounded-md border border-zinc-200 px-4 font-normal outline-none focus:border-teal-700"
                >
                  <option value="active">启用</option>
                  <option value="paused">暂停</option>
                </select>
              </label>
              {formMessage ? <p className="text-base text-rose-600">{formMessage}</p> : null}
              <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-5">
                <button
                  type="submit"
                  className="h-12 rounded-md bg-teal-700 px-5 text-base font-semibold text-white hover:bg-teal-800"
                >
                  保存规则
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="h-12 rounded-md border border-zinc-200 px-5 text-base font-medium text-zinc-700 hover:border-teal-600 hover:text-teal-700"
                >
                  取消
                </button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function RuleRow({
  rule,
  onToggle,
  onKeywordChange,
}: {
  rule: AdminCollectionRule;
  onToggle: () => void;
  onKeywordChange: (keyword: string) => void;
}) {
  return (
    <div className="grid gap-4 px-7 py-6 text-[17px] lg:grid-cols-[150px_minmax(260px,1fr)_210px_100px_100px] lg:items-center">
      <div>
        <p className="font-semibold text-zinc-950">{rule.topic}</p>
        <p className="mt-1 text-base text-zinc-500 lg:hidden">{sourceTypeLabels[rule.sourceType]}</p>
      </div>
      <textarea
        value={rule.keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        rows={2}
        className="min-h-16 w-full resize-none rounded-md border border-zinc-200 bg-white px-4 py-3 text-base leading-6 outline-none transition focus:border-teal-700"
      />
      <div className="hidden text-[17px] leading-7 text-zinc-700 lg:block">
        {sourceTypeLabels[rule.sourceType]}
      </div>
      <div>
        <AdminBadge tone={rule.status === "active" ? "teal" : "zinc"}>
          {rule.status === "active" ? "启用" : "暂停"}
        </AdminBadge>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="h-11 rounded-md border border-zinc-200 px-3 text-base font-medium text-zinc-700 transition hover:border-teal-600 hover:text-teal-700 active:translate-y-px"
      >
        {rule.status === "active" ? "暂停" : "启用"}
      </button>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <AdminCard className="p-6">
      <p className="text-[17px] font-medium text-zinc-500">{label}</p>
      <div className="mt-3">
        <p className="tabular-nums text-[44px] font-semibold leading-none tracking-tight text-zinc-950">
          {value}
        </p>
      </div>
    </AdminCard>
  );
}

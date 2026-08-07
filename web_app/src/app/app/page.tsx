"use client";

import { useState } from "react";
import { activities } from "@/data/fixtures";
import { EventCard, FeaturedEventCard } from "@/components/event-card";
import { FiltersPanel } from "@/components/filters-panel";
import { HeroSummary } from "@/components/hero-summary";
import { useAppState } from "@/components/app-shell";
import { ListPagination } from "@/components/list-pagination";
import { filterActivities } from "@/lib/data";

export default function ActivityDiscoveryPage() {
  const { filters, setFilters, resetFilters, savedActivities, toggleSaved } = useAppState();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const filtered = filterActivities(filters);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pagedActivities = filtered.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
  const featured = activities
    .filter((activity) => activity.featured)
    .sort((a, b) => b.lastVerifiedAt.localeCompare(a.lastVerifiedAt))
    .slice(0, 3);

  return (
    <div>
      <HeroSummary />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-14">
          <section id="activity-search" className="scroll-mt-28 grid gap-6">
            <FiltersPanel
              filters={filters}
              setFilters={(nextFilters) => {
                setCurrentPage(1);
                setFilters(nextFilters);
              }}
              onReset={() => {
                setCurrentPage(1);
                resetFilters();
              }}
              count={filtered.length}
            />
            {filtered.length > 0 ? (
              <div className="overflow-hidden border-b border-zinc-200">
                {pagedActivities.map((activity) => (
                  <EventCard
                    key={activity.id}
                    activity={activity}
                    saved={savedActivities.find((item) => item.activityId === activity.id)}
                    onToggleSaved={toggleSaved}
                  />
                ))}
                <ListPagination
                  total={filtered.length}
                  pageSize={pageSize}
                  currentPage={safeCurrentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            ) : (
              <div className="border-y border-zinc-200 bg-white py-12 text-center">
                <h3 className="text-lg font-semibold text-zinc-950">没有匹配活动</h3>
                <p className="mt-2 text-sm text-zinc-500">清除筛选后可查看全部活动</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex h-10 items-center rounded-full border border-teal-600 px-4 text-sm font-medium text-teal-700 hover:bg-teal-50"
                >
                  清除筛选
                </button>
              </div>
            )}
          </section>

          <section>
            <div className="mb-5">
              <h2 className="editorial-title text-3xl text-zinc-950">最新收录</h2>
            </div>
            <div className="grid gap-x-10 gap-y-12 lg:grid-cols-3">
              {featured.map((activity) => (
                <FeaturedEventCard
                  key={activity.id}
                  activity={activity}
                  saved={savedActivities.find((item) => item.activityId === activity.id)}
                  onToggleSaved={toggleSaved}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

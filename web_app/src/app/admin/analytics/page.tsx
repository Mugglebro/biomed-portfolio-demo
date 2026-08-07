import { AdminPageHeader } from "@/components/admin-shell";
import { AdminAnalyticsWorkbench } from "@/components/admin-analytics-workbench";
import { adminQualityAnalytics } from "@/data/analytics-fixtures";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-7">
      <AdminPageHeader title="数据分析" />

      <section className="border-b border-zinc-200 pb-2">
        <h2 className="text-[34px] font-semibold tracking-tight text-zinc-950">会议线索质量与运营复盘</h2>
      </section>

      <AdminAnalyticsWorkbench
        metrics={adminQualityAnalytics.metrics}
        trend={adminQualityAnalytics.trend}
        conferenceTypeShare={adminQualityAnalytics.conferenceTypeShare}
        sourceMix={adminQualityAnalytics.sourceMix}
        feedbackTypes={adminQualityAnalytics.feedbackTypes}
      />
    </div>
  );
}

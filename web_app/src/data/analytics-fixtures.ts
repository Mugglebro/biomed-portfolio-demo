export type MetricTone = "teal" | "slate" | "amber" | "rose";

export interface InsightMetric {
  label: string;
  value: string;
  helper: string;
  tone: MetricTone;
}

export interface DistributionItem {
  label: string;
  value: number;
  note?: string;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export const adminQualityAnalytics = {
  metrics: [
    {
      label: "资讯有效率",
      value: "74%",
      helper: "候选内容经过主题、时间、主办方和来源初筛后，仍值得进入运营判断的比例",
      tone: "teal",
    },
    {
      label: "来源核验通过率",
      value: "86%",
      helper: "能回溯到明确发布主体、发布时间和原始链接的来源占比",
      tone: "slate",
    },
    {
      label: "会议重复率",
      value: "21%",
      helper: "同一活动被多篇文章或多个渠道重复命中的比例，用于观察去重压力",
      tone: "amber",
    },
    {
      label: "会议有效信息率",
      value: "79%",
      helper: "活动时间、地点、主办方、报名状态、议程或嘉宾等关键字段的完整程度",
      tone: "teal",
    },
  ] satisfies InsightMetric[],
  conferenceTypeShare: [
    { label: "行业大会", value: 26 },
    { label: "高峰论坛", value: 21 },
    { label: "专题研讨会", value: 18 },
    { label: "展会", value: 14 },
    { label: "线上直播", value: 12 },
    { label: "商务交流会", value: 9 },
  ] satisfies DistributionItem[],
  sourceMix: [
    { label: "微信公众号", value: 42, note: "活动预告、议程和嘉宾更新较多" },
    { label: "主办方官网", value: 24, note: "报名入口和最终信息优先级最高" },
    { label: "行业媒体", value: 19, note: "适合发现专题活动和产业趋势" },
    { label: "协会/RSS", value: 15, note: "补充学术会议和通知类线索" },
  ] satisfies DistributionItem[],
  feedbackTypes: [
    { label: "重复活动", value: 30 },
    { label: "报名状态变化", value: 24 },
    { label: "议程缺失", value: 18 },
    { label: "地点不明确", value: 15 },
    { label: "主题误判", value: 13 },
  ] satisfies DistributionItem[],
  trend: [
    { label: "07/19", value: 62 },
    { label: "07/20", value: 68 },
    { label: "07/21", value: 71 },
    { label: "07/22", value: 76 },
    { label: "07/23", value: 74 },
    { label: "07/24", value: 82 },
    { label: "07/25", value: 86 },
  ] satisfies TrendPoint[],
};

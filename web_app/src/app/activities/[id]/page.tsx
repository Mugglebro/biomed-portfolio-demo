import { activities } from "@/data/fixtures";
import { ActivityDetailClient } from "./activity-detail-client";

export function generateStaticParams() {
  return activities.map((activity) => ({ id: activity.id }));
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ActivityDetailClient id={id} />;
}

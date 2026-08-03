import { organizers } from "@/data/fixtures";
import { OrganizerDetailClient } from "./organizer-detail-client";

export function generateStaticParams() {
  return organizers.map((organizer) => ({ id: organizer.id }));
}

export default async function OrganizerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganizerDetailClient id={id} />;
}

import {
  completenessLabels,
  registrationLabels,
  statusLabels,
} from "@/data/labels";
import type {
  ActivityStatus,
  CompletenessStatus,
  RegistrationStatus,
} from "@/data/types";

const statusTone: Record<ActivityStatus, string> = {
  upcoming: "border-emerald-200 bg-emerald-50 text-emerald-800",
  ended: "border-zinc-200 bg-zinc-100 text-zinc-600",
  postponed: "border-amber-200 bg-amber-50 text-amber-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
};

const registrationTone: Record<RegistrationStatus, string> = {
  open: "border-teal-200 bg-teal-50 text-teal-800",
  not_open: "border-slate-200 bg-slate-50 text-slate-700",
  closing_soon: "border-orange-200 bg-orange-50 text-orange-800",
  closed: "border-zinc-200 bg-zinc-100 text-zinc-600",
  invite_only: "border-indigo-200 bg-indigo-50 text-indigo-800",
  unknown: "border-slate-200 bg-slate-50 text-slate-700",
};

const completenessTone: Record<CompletenessStatus, string> = {
  complete: "border-teal-200 bg-teal-50 text-teal-800",
  partial: "border-sky-200 bg-sky-50 text-sky-800",
  needs_review: "border-amber-200 bg-amber-50 text-amber-800",
};

export function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
  return <Badge className={statusTone[status]}>{statusLabels[status]}</Badge>;
}

export function RegistrationBadge({ status }: { status: RegistrationStatus }) {
  return <Badge className={registrationTone[status]}>{registrationLabels[status]}</Badge>;
}

export function CompletenessBadge({ status }: { status: CompletenessStatus }) {
  return <Badge className={completenessTone[status]}>{completenessLabels[status]}</Badge>;
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

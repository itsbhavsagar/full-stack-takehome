import type { SavedProfileSummary } from "@/features/profile/saved-profile-utils";
import { PROFILE_COPY } from "@/lib/constants/profile";
import { cn } from "@/lib/utils";

interface SavedProfileSummaryPanelProps {
  summary: SavedProfileSummary;
  className?: string;
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function SavedProfileSummaryPanel({
  summary,
  className,
}: SavedProfileSummaryPanelProps) {
  return (
    <div className={cn("space-y-4 rounded-xl border border-border/60 bg-card p-5", className)}>
      <h2 className="text-lg font-semibold">{PROFILE_COPY.reviewSummary}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryStat label={PROFILE_COPY.fieldsSaved} value={summary.total} />
        <SummaryStat label={PROFILE_COPY.accepted} value={summary.accepted} />
        <SummaryStat label={PROFILE_COPY.edited} value={summary.edited} />
      </div>
    </div>
  );
}

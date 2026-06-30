import { Progress } from "@/components/ui/progress";
import { REVIEW_COPY, REVIEW_SUMMARY_LABELS } from "@/lib/constants/review";
import type { ReviewSummary } from "@/types/review";
import { cn } from "@/lib/utils";

interface ReviewSummaryPanelProps {
  summary: ReviewSummary;
  className?: string;
}

function SummaryStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warning" | "success" | "muted";
}) {
  const toneClasses = {
    default: "text-foreground",
    warning: "text-amber-700 dark:text-amber-300",
    success: "text-emerald-700 dark:text-emerald-300",
    muted: "text-muted-foreground",
  };

  return (
    <div className="rounded-lg bg-background/90 px-4 py-3 ring-1 ring-border/50">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-semibold tabular-nums", toneClasses[tone])}>
        {value}
      </p>
    </div>
  );
}

export function ReviewSummaryPanel({ summary, className }: ReviewSummaryPanelProps) {
  const progressPercent =
    summary.total === 0 ? 0 : Math.round((summary.completed / summary.total) * 100);

  return (
    <section
      className={cn(
        "space-y-4 rounded-2xl border border-border/50 bg-muted/30 p-5",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{REVIEW_COPY.reviewSummary}</h2>
          <span className="text-sm font-medium tabular-nums text-primary">
            {progressPercent}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {REVIEW_COPY.fieldsComplete(summary.completed, summary.total)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryStat
          label={REVIEW_SUMMARY_LABELS.accepted}
          value={summary.accepted}
          tone="success"
        />
        <SummaryStat
          label={REVIEW_SUMMARY_LABELS.pending}
          value={summary.needsAttention}
          tone="warning"
        />
        <SummaryStat
          label={REVIEW_SUMMARY_LABELS.conflict}
          value={summary.conflicts}
          tone="warning"
        />
        <SummaryStat label={REVIEW_SUMMARY_LABELS.missing} value={summary.missing} />
      </div>
    </section>
  );
}

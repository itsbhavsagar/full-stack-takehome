import { ExternalLink, FileText, Newspaper } from "lucide-react";
import { ConfidenceBadge } from "@/features/review/components/confidence-badge";
import { REVIEW_COPY } from "@/lib/constants/review";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: string;
  sourceUrl?: string;
  sourceDate?: string;
  isNews?: boolean;
  confidence?: number;
  className?: string;
}

function parseFilingLabel(source: string): { type: string; filed?: string } {
  const match = source.match(/^(.+?)\s+filed\s+(.+)$/i);
  if (match) {
    return { type: match[1], filed: match[2] };
  }
  return { type: source };
}

export function SourceBadge({
  source,
  sourceUrl,
  sourceDate,
  isNews = false,
  confidence,
  className,
}: SourceBadgeProps) {
  const Icon = isNews ? Newspaper : FileText;
  const typeLabel = isNews ? REVIEW_COPY.newsSource : REVIEW_COPY.secFiling;
  const parsed = parseFilingLabel(source);
  const showConfidence = confidence !== undefined;

  return (
    <div
      className={cn(
        "rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Icon className="size-3.5 shrink-0" />
          {typeLabel}
        </div>
        {showConfidence ? (
          <ConfidenceBadge confidence={confidence} className="shrink-0" />
        ) : null}
      </div>
      <p className="mt-1.5 text-sm font-medium text-foreground">{parsed.type}</p>
      {parsed.filed ? (
        <p className="text-xs text-muted-foreground">Filed {parsed.filed}</p>
      ) : null}
      {sourceDate ? (
        <p className="text-xs text-muted-foreground">Published {sourceDate}</p>
      ) : null}
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {REVIEW_COPY.openSource}
          <ExternalLink className="size-3" />
        </a>
      ) : null}
    </div>
  );
}

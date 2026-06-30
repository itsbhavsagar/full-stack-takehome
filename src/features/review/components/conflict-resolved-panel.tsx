import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SourceBadge } from "@/features/review/components/source-badge";
import { REVIEW_COPY } from "@/lib/constants/review";
import { cn } from "@/lib/utils";
import type { ProfileCandidate } from "@/types/profile";

interface ConflictResolvedPanelProps {
  candidate: ProfileCandidate;
  className?: string;
}

export function ConflictResolvedPanel({
  candidate,
  className,
}: ConflictResolvedPanelProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2.5">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        <p className="text-sm text-emerald-800 dark:text-emerald-200">
          {REVIEW_COPY.conflictResolved(candidate.source)}
        </p>
      </div>
      <Separator />
      <SourceBadge
        source={candidate.source}
        sourceUrl={candidate.source_url}
        confidence={candidate.confidence}
      />
    </div>
  );
}

import type { ProfileField } from "@/types/profile";
import type { ReviewDecision, ReviewStatus } from "@/types/review";
import { ReviewStatusBadge } from "@/components/review-status-badge";
import {
  getFieldDisplayValue,
  isConflictField,
  isMissingField,
} from "@/lib/utils/field-utils";
import { cn } from "@/lib/utils";

interface ValueRendererProps {
  field: ProfileField;
  decision: ReviewDecision;
  className?: string;
}

export function ValueRenderer({ field, decision, className }: ValueRendererProps) {
  if (decision.status === "edited" && decision.editedValue) {
    return (
      <p
        className={cn(
          "text-xl font-semibold leading-relaxed whitespace-pre-wrap break-words",
          className,
        )}
      >
        {decision.editedValue}
      </p>
    );
  }

  if (isConflictField(field)) {
    if (decision.selectedCandidateIndex === undefined) {
      return (
        <p className={cn("text-sm text-muted-foreground", className)}>
          Select a source value below
        </p>
      );
    }
    const candidate = field.candidates[decision.selectedCandidateIndex];
    return candidate ? (
      <p className={cn("text-xl font-semibold tracking-tight", className)}>
        {candidate.value}
      </p>
    ) : null;
  }

  if (isMissingField(field)) {
    return null;
  }

  const value = getFieldDisplayValue(field);
  return (
    <p
      className={cn(
        "text-xl font-semibold leading-relaxed whitespace-pre-wrap break-words",
        className,
      )}
    >
      {value}
    </p>
  );
}

interface FieldHeaderProps {
  label: string;
  status: ReviewStatus;
  className?: string;
}

const statusLabels: Record<ReviewStatus, string | null> = {
  pending: null,
  accepted: "Accepted",
  edited: "Edited",
  rejected: "Rejected",
};

const statusTones: Record<
  Exclude<ReviewStatus, "pending">,
  "accepted" | "edited" | "rejected"
> = {
  accepted: "accepted",
  edited: "edited",
  rejected: "rejected",
};

export function FieldHeader({
  label,
  status,
  className,
}: FieldHeaderProps) {
  const statusLabel = statusLabels[status];

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </h3>
        {statusLabel && status !== "pending" ? (
          <ReviewStatusBadge tone={statusTones[status]}>
            {statusLabel}
          </ReviewStatusBadge>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { REVIEW_COPY } from "@/lib/constants/review";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
  onBulkAccept: () => void;
  onSave: () => void;
  isBulkAccepting?: boolean;
  isBulkAcceptSucceeded?: boolean;
  isSaving?: boolean;
  isSaveSucceeded?: boolean;
  unresolvedCount: number;
  canSave: boolean;
  bulkEligibleCount: number;
  className?: string;
}

function AnimatedLoadingText({ text }: { text: string }) {
  return (
    <span>
      <span>{text}</span>
      <span className="inline-flex w-5" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="animate-loading-dot"
            style={{ animationDelay: `${index * 0.22}s` }}
          >
            .
          </span>
        ))}
      </span>
    </span>
  );
}

function getBulkAcceptLabel({
  isBulkAccepting,
  isBulkAcceptSucceeded,
  bulkEligibleCount,
}: {
  isBulkAccepting: boolean;
  isBulkAcceptSucceeded: boolean;
  bulkEligibleCount: number;
}) {
  if (isBulkAccepting) {
    return REVIEW_COPY.bulkAcceptLoading;
  }
  if (bulkEligibleCount === 0 && isBulkAcceptSucceeded) {
    return REVIEW_COPY.bulkAccepted;
  }
  return REVIEW_COPY.bulkAccept;
}

function getBulkAcceptTooltip({
  isBulkDisabled,
  isBulkAcceptSucceeded,
  bulkEligibleCount,
}: {
  isBulkDisabled: boolean;
  isBulkAcceptSucceeded: boolean;
  bulkEligibleCount: number;
}) {
  if (!isBulkDisabled) {
    return REVIEW_COPY.bulkAcceptTooltip;
  }
  if (bulkEligibleCount === 0) {
    return isBulkAcceptSucceeded
      ? REVIEW_COPY.bulkAcceptAlreadyAppliedTooltip
      : REVIEW_COPY.bulkAcceptNoEligibleTooltip;
  }
  return undefined;
}

export function BulkActions({
  onBulkAccept,
  onSave,
  isBulkAccepting = false,
  isBulkAcceptSucceeded = false,
  isSaving = false,
  isSaveSucceeded = false,
  unresolvedCount,
  canSave,
  bulkEligibleCount,
  className,
}: BulkActionsProps) {
  const isBulkDisabled = isBulkAccepting || isSaving || bulkEligibleCount === 0;
  const bulkLabel = getBulkAcceptLabel({
    isBulkAccepting,
    isBulkAcceptSucceeded,
    bulkEligibleCount,
  });
  const bulkTooltip = getBulkAcceptTooltip({
    isBulkDisabled,
    isBulkAcceptSucceeded,
    bulkEligibleCount,
  });
  const saveLabel = isSaveSucceeded
    ? "Saved"
    : canSave
      ? REVIEW_COPY.saveProfile
      : REVIEW_COPY.pendingDecisions(unresolvedCount);

  const bulkButton = (
    <Button
      type="button"
      variant="outline"
      onClick={onBulkAccept}
      disabled={isBulkDisabled}
      aria-busy={isBulkAccepting}
      title={!isBulkDisabled ? bulkTooltip : undefined}
      className={cn(
        "min-w-35 rounded-xl border-emerald-500/30 text-emerald-800 transition-colors duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/10",
        bulkEligibleCount === 0 &&
          isBulkAcceptSucceeded &&
          "border-emerald-500/30 bg-emerald-500/10",
      )}
    >
      {isBulkAccepting ? <AnimatedLoadingText text={bulkLabel} /> : bulkLabel}
    </Button>
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {isBulkDisabled && bulkTooltip ? (
        <span title={bulkTooltip} className="inline-flex">
          {bulkButton}
        </span>
      ) : (
        bulkButton
      )}

      <Button
        type="button"
        variant={canSave ? "success" : "default"}
        onClick={onSave}
        disabled={!canSave || isSaving || isSaveSucceeded}
        aria-busy={isSaving}
        className={cn(
          "min-w-54 rounded-xl transition-[background-color,border-color,box-shadow,opacity] duration-300",
          isSaveSucceeded && "border-emerald-500/30 bg-emerald-600",
          !canSave && !isSaveSucceeded && "disabled:opacity-100",
        )}
        size="lg"
      >
        {isSaving ? (
          <AnimatedLoadingText text={REVIEW_COPY.saveProfileLoading} />
        ) : (
          saveLabel
        )}
      </Button>
    </div>
  );
}

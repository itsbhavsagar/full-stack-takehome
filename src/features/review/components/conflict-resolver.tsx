"use client";

import { AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ConfidenceBadge } from "@/features/review/components/confidence-badge";
import { REVIEW_COPY } from "@/lib/constants/review";
import { buttonBusyClass } from "@/lib/utils/button-utils";
import { cn } from "@/lib/utils";
import type { ProfileCandidate } from "@/types/profile";

interface ConflictResolverProps {
  candidates: ProfileCandidate[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onAccept: () => void;
  disabled?: boolean;
  className?: string;
}

export function ConflictResolver({
  candidates,
  selectedIndex,
  onSelect,
  onAccept,
  disabled = false,
  className,
}: ConflictResolverProps) {
  const selectedValue =
    selectedIndex !== undefined ? selectedIndex.toString() : "";
  const canAccept = selectedIndex !== undefined && !disabled;

  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 transition-surface",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {REVIEW_COPY.conflict}
          </p>
          <p className="text-xs text-muted-foreground">{REVIEW_COPY.conflictDetail}</p>
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {REVIEW_COPY.chooseValue}
      </p>

      <RadioGroup
        value={selectedValue}
        onValueChange={(value) => {
          if (value !== "") {
            onSelect(Number(value));
          }
        }}
        className="space-y-2"
        disabled={disabled}
      >
        {candidates.map((candidate, index) => {
          const isSelected = selectedIndex === index;

          return (
            <label
              key={`${candidate.value}-${candidate.source}`}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 transition-surface",
                isSelected
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                  : "border-border/60 hover:border-border hover:bg-muted/40",
              )}
            >
              <RadioGroupItem value={index.toString()} className="mt-1" />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-lg font-semibold tracking-tight">{candidate.value}</p>
                <p className="text-sm text-muted-foreground">{candidate.source}</p>
                <ConfidenceBadge confidence={candidate.confidence} />
              </div>
            </label>
          );
        })}
      </RadioGroup>

      <Button
        type="button"
        size="sm"
        variant={canAccept ? "success" : "outline"}
        onClick={onAccept}
        disabled={!canAccept}
        aria-busy={disabled}
        className={buttonBusyClass(
          disabled,
          cn(
            "rounded-lg transition-[background-color,border-color,box-shadow] duration-200",
            !canAccept && "border-border/60 text-muted-foreground",
          ),
        )}
      >
        <Check className="size-3.5" />
        {REVIEW_COPY.acceptSelection}
      </Button>
    </div>
  );
}

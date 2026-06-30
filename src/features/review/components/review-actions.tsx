"use client";

import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonBusyClass } from "@/lib/utils/button-utils";
import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/types/review";

interface ReviewActionsProps {
  status: ReviewStatus;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  disabled?: boolean;
  isUpdating?: boolean;
  className?: string;
}

export function ReviewActions({
  status,
  onAccept,
  onReject,
  onEdit,
  disabled = false,
  isUpdating = false,
  className,
}: ReviewActionsProps) {
  const isAccepted = status === "accepted";
  const isRejected = status === "rejected";
  const isEdited = status === "edited";
  const isBusy = disabled || isUpdating;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 pt-0", className)}>
      <Button
        type="button"
        size="sm"
        variant={isAccepted ? "success" : "outline"}
        onClick={onAccept}
        disabled={isBusy || isAccepted}
        aria-busy={isUpdating}
        aria-pressed={isAccepted}
        className={buttonBusyClass(
          isUpdating,
          isAccepted
            ? undefined
            : "border-emerald-500/30 text-emerald-800 hover:border-emerald-500/50 hover:bg-emerald-500/10",
        )}
      >
        <Check className="size-3.5" />
        {isAccepted ? "Accepted" : "Accept"}
      </Button>

      <Button
        type="button"
        size="sm"
        variant={isEdited ? "info" : "outline"}
        onClick={onEdit}
        disabled={isBusy}
        aria-pressed={isEdited}
      >
        <Pencil className="size-3.5" />
        {isEdited ? "Edited" : "Edit"}
      </Button>

      <Button
        type="button"
        size="sm"
        variant={isRejected ? "destructive" : "ghost"}
        onClick={onReject}
        disabled={isBusy}
        aria-pressed={isRejected}
      >
        <X className="size-3.5" />
        {isRejected ? "Rejected" : "Reject"}
      </Button>
    </div>
  );
}

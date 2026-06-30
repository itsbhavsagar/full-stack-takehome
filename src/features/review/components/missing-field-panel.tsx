"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REVIEW_COPY } from "@/lib/constants/review";
import { cn } from "@/lib/utils";

interface MissingFieldPanelProps {
  note?: string;
  onEnterManually: () => void;
  onReject: () => void;
  disabled?: boolean;
  className?: string;
}

export function MissingFieldPanel({
  note,
  onEnterManually,
  onReject,
  disabled = false,
  className,
}: MissingFieldPanelProps) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="space-y-1">
          <p className="font-medium">{REVIEW_COPY.missing}</p>
          <p className="text-sm text-muted-foreground">
            {note ?? REVIEW_COPY.missingDetail}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onEnterManually}
          disabled={disabled}
          className="rounded-lg"
        >
          {REVIEW_COPY.enterManually}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onReject}
          disabled={disabled}
          className="rounded-lg text-muted-foreground"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

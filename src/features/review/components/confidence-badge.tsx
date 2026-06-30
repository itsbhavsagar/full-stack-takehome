import { Circle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import type { ConfidenceLevel } from "@/lib/utils/confidence";
import {
  formatConfidencePercent,
  getConfidenceLevel,
  getConfidenceLevelLabel,
} from "@/lib/utils/confidence";
import { cn } from "@/lib/utils";

const confidenceBadgeVariants = cva(
  "h-auto gap-1.5 rounded-md px-2.5 py-1 font-medium",
  {
    variants: {
      level: {
        high: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        medium: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        low: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
        missing: "border-border/60 bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      level: "medium",
    },
  },
);

const dotVariants = cva("size-2 shrink-0 fill-current", {
  variants: {
    level: {
      high: "text-emerald-500",
      medium: "text-amber-500",
      low: "text-rose-500",
      missing: "text-muted-foreground",
    },
  },
  defaultVariants: {
    level: "medium",
  },
});

interface ConfidenceBadgeProps extends VariantProps<typeof confidenceBadgeVariants> {
  confidence?: number;
  showPercent?: boolean;
  className?: string;
}

export function ConfidenceBadge({
  confidence,
  showPercent = true,
  className,
}: ConfidenceBadgeProps) {
  const level: ConfidenceLevel = getConfidenceLevel(confidence);

  return (
    <Badge
      variant="outline"
      className={cn(confidenceBadgeVariants({ level }), className)}
    >
      <Circle className={cn(dotVariants({ level }))} />
      <span>{getConfidenceLevelLabel(level)}</span>
      {showPercent && confidence !== undefined && confidence > 0 ? (
        <span className="text-muted-foreground">
          · {formatConfidencePercent(confidence)}
        </span>
      ) : null}
    </Badge>
  );
}
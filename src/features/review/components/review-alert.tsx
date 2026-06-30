import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewAlertProps {
  title: string;
  reason: string;
  className?: string;
}

export function ReviewAlert({ title, reason, className }: ReviewAlertProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{title}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Reason: </span>
          {reason}
        </p>
      </div>
    </div>
  );
}

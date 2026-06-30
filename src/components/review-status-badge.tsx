import { cva, type VariantProps } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const reviewStatusBadgeVariants = cva(
  "h-auto rounded-md px-2 py-0.5 font-medium",
  {
    variants: {
      tone: {
        accepted:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        edited:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        rejected: "border-border/60 bg-muted text-muted-foreground",
        saved:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
      },
    },
    defaultVariants: {
      tone: "accepted",
      size: "sm",
    },
  },
);

interface ReviewStatusBadgeProps
  extends VariantProps<typeof reviewStatusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function ReviewStatusBadge({
  tone,
  size,
  children,
  className,
}: ReviewStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(reviewStatusBadgeVariants({ tone, size }), className)}
    >
      {children}
    </Badge>
  );
}

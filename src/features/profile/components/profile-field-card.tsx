import type { SavedProfileField } from "@/types/profile";
import { ReviewStatusBadge } from "@/components/review-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SourceBadge } from "@/features/review/components/source-badge";
import { PROFILE_COPY } from "@/lib/constants/profile";
import { cn } from "@/lib/utils";

interface ProfileFieldCardProps {
  field: SavedProfileField;
  className?: string;
}

export function ProfileFieldCard({ field, className }: ProfileFieldCardProps) {
  const statusLabel =
    field.reviewStatus === "edited" ? PROFILE_COPY.edited : PROFILE_COPY.accepted;
  const statusTone = field.reviewStatus === "edited" ? "edited" : "accepted";

  const hasSourceMetadata = Boolean(field.source);

  return (
    <Card className={cn("overflow-hidden shadow-sm", className)}>
      <CardContent className="space-y-4 pt-(--card-spacing)">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              {field.label}
            </h3>
            <ReviewStatusBadge tone={statusTone}>{statusLabel}</ReviewStatusBadge>
          </div>
        </div>

        <p className="text-xl font-semibold whitespace-pre-wrap break-words leading-relaxed">
          {field.value ?? "—"}
        </p>

        {hasSourceMetadata ? (
          <>
            <Separator />
            <SourceBadge
              source={field.source ?? ""}
              sourceUrl={field.source_url}
              sourceDate={field.source_date}
              isNews={Boolean(field.source_date)}
              confidence={field.confidence}
            />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

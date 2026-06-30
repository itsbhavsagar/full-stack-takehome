"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ConflictResolvedPanel } from "@/features/review/components/conflict-resolved-panel";
import { ConflictResolver } from "@/features/review/components/conflict-resolver";
import { EditableField } from "@/features/review/components/editable-field";
import { MissingFieldPanel } from "@/features/review/components/missing-field-panel";
import { ReviewActions } from "@/features/review/components/review-actions";
import { ReviewAlert } from "@/features/review/components/review-alert";
import { SourceBadge } from "@/features/review/components/source-badge";
import {
  FieldHeader,
  ValueRenderer,
} from "@/features/review/components/value-renderer";
import { REVIEW_COPY } from "@/lib/constants/review";
import { getReviewReason } from "@/lib/utils/review-reason";
import {
  fieldNeedsReview,
  getSelectedConflictCandidate,
  isDecisionComplete,
  isUnresolvedConflictField,
} from "@/lib/utils/review-utils";
import {
  isConflictField,
  isMissingField,
  isNewsSourceField,
  isNormalField,
} from "@/lib/utils/field-utils";
import { cn } from "@/lib/utils";
import type { ReviewField } from "@/types/review";
import { useReviewUiStore } from "@/features/review/review-ui-store";

interface FieldCardProps {
  reviewField: ReviewField;
  onUpdate: (decision: {
    status: ReviewField["decision"]["status"];
    editedValue?: string;
    selectedCandidateIndex?: number;
  }) => void;
  isUpdating?: boolean;
}

export function FieldCard({ reviewField, onUpdate, isUpdating = false }: FieldCardProps) {
  const { original, decision, key } = reviewField;
  const editingFieldKey = useReviewUiStore((state) => state.editingFieldKey);
  const setEditingFieldKey = useReviewUiStore((state) => state.setEditingFieldKey);
  const [draftValue, setDraftValue] = useState(
    decision.editedValue ?? (isNormalField(original) ? original.value : ""),
  );

  const isEditing = editingFieldKey === key;
  const needsReview = fieldNeedsReview(original, decision);
  const isComplete = isDecisionComplete(original, decision);
  const reviewReason = getReviewReason(original);
  const isConflict = isConflictField(original);
  const isMissing = isMissingField(original);
  const isConflictPending = isUnresolvedConflictField(original, decision);
  const selectedCandidate = getSelectedConflictCandidate(original, decision);

  const handleAccept = () => {
    if (isConflict) {
      if (decision.selectedCandidateIndex === undefined) {
        return;
      }
      onUpdate({
        status: "accepted",
        selectedCandidateIndex: decision.selectedCandidateIndex,
      });
      return;
    }

    if (isMissing) {
      setEditingFieldKey(key);
      return;
    }

    onUpdate({ status: "accepted" });
  };

  const handleSaveEdit = () => {
    onUpdate({
      status: "edited",
      editedValue: draftValue.trim(),
    });
    setEditingFieldKey(null);
  };

  const handleChangeConflictSelection = () => {
    onUpdate({
      status: "pending",
      selectedCandidateIndex: decision.selectedCandidateIndex,
    });
  };

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-sm transition-[box-shadow,background-color] duration-200 ease-out hover:shadow-md",
        needsReview && "ring-amber-500/35",
        isComplete &&
          !needsReview &&
          decision.status !== "rejected" &&
          "bg-emerald-500/[0.03] ring-emerald-500/25",
        decision.status === "rejected" && "opacity-75 ring-border/60",
        !needsReview && !isComplete && "ring-border/60",
        isUpdating && "ring-2 ring-primary/10",
      )}
    >
      <CardContent className="space-y-4 pt-(--card-spacing)">
        <FieldHeader
          label={original.label}
          status={decision.status}
        />

        {isEditing ? (
          <EditableField
            value={draftValue}
            onChange={setDraftValue}
            onSave={handleSaveEdit}
            onCancel={() => setEditingFieldKey(null)}
            isSaving={isUpdating}
          />
        ) : (
          <ValueRenderer field={original} decision={decision} />
        )}

        {needsReview && reviewReason && !isConflict && !isMissing ? (
          <ReviewAlert title={REVIEW_COPY.lowConfidence} reason={reviewReason} />
        ) : null}

        <div
          className={cn(
            "transition-surface",
            isConflict && "min-h-[17rem]",
          )}
        >
          {isMissing && decision.status === "pending" && !isEditing ? (
            <MissingFieldPanel
              note={original.note}
              onEnterManually={() => setEditingFieldKey(key)}
              onReject={() => onUpdate({ status: "rejected" })}
              disabled={isUpdating}
            />
          ) : null}

          {isConflict && isConflictPending ? (
            <ConflictResolver
              candidates={original.candidates}
              selectedIndex={decision.selectedCandidateIndex}
              onSelect={(index) =>
                onUpdate({
                  status: "pending",
                  selectedCandidateIndex: index,
                })
              }
              onAccept={handleAccept}
              disabled={isUpdating}
            />
          ) : null}

          {isConflict && !isConflictPending && selectedCandidate ? (
            <ConflictResolvedPanel candidate={selectedCandidate} />
          ) : null}
        </div>

        {!isConflict && isNormalField(original) ? (
          <>
            <Separator />
            <SourceBadge
              source={original.source}
              sourceUrl={original.source_url}
              sourceDate={original.source_date}
              isNews={isNewsSourceField(original)}
              confidence={original.confidence}
            />
          </>
        ) : null}
      </CardContent>

      {isConflict && !isConflictPending ? (
        <CardFooter className="min-h-[3.25rem] flex-wrap gap-2 border-t border-border/60 bg-muted/20">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleChangeConflictSelection}
            disabled={isUpdating}
            className="rounded-lg"
          >
            Change selection
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onUpdate({ status: "rejected" })}
            disabled={isUpdating}
            className="rounded-lg text-muted-foreground hover:text-destructive"
          >
            Reject
          </Button>
        </CardFooter>
      ) : null}

      {!isConflict && !(isMissing && decision.status === "pending") ? (
        <CardFooter className="min-h-[4.5rem] border-t border-border/60 bg-muted/20">
          <ReviewActions
            status={decision.status}
            onAccept={handleAccept}
            onReject={() => onUpdate({ status: "rejected" })}
            onEdit={() => setEditingFieldKey(key)}
            disabled={isUpdating}
            isUpdating={isUpdating}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}

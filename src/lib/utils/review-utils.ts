import type { ProfileField } from "@/types/profile";
import type {
  ReviewDecision,
  ReviewDecisions,
  ReviewField,
  ReviewFilter,
  ReviewSummary,
} from "@/types/review";
import { canBulkAccept, shouldRequireReview } from "@/lib/utils/confidence";
import {
  getFieldConfidence,
  getFieldKey,
  isConflictField,
  isMissingField,
  isNewsSourceField,
} from "@/lib/utils/field-utils";
import { CONFIDENCE } from "@/lib/constants/review";

export function createInitialDecision(): ReviewDecision {
  return {
    status: "pending",
    updatedAt: new Date().toISOString(),
  };
}

export function createInitialDecisions(fields: ProfileField[]): ReviewDecisions {
  return fields.reduce<ReviewDecisions>((acc, field) => {
    acc[getFieldKey(field)] = createInitialDecision();
    return acc;
  }, {});
}

export function mergeDecisions(
  fields: ProfileField[],
  existing: ReviewDecisions,
): ReviewDecisions {
  const merged = createInitialDecisions(fields);
  for (const key of Object.keys(merged)) {
    if (existing[key]) {
      merged[key] = existing[key];
    }
  }
  return merged;
}

export function isUnresolvedConflictField(
  field: ProfileField,
  decision: ReviewDecision,
): boolean {
  return isConflictField(field) && decision.status === "pending";
}

export function isUnresolvedMissingField(
  field: ProfileField,
  decision: ReviewDecision,
): boolean {
  return isMissingField(field) && decision.status === "pending";
}

export function isUnresolvedConflict(item: ReviewField): boolean {
  return isUnresolvedConflictField(item.original, item.decision);
}

export function isUnresolvedMissing(item: ReviewField): boolean {
  return isUnresolvedMissingField(item.original, item.decision);
}

export function getSelectedConflictCandidate(
  field: ProfileField,
  decision: ReviewDecision,
) {
  if (!isConflictField(field) || decision.selectedCandidateIndex === undefined) {
    return undefined;
  }
  return field.candidates[decision.selectedCandidateIndex];
}

export function fieldNeedsReview(
  field: ProfileField,
  decision: ReviewDecision,
): boolean {
  if (decision.status !== "pending") {
    return false;
  }
  if (isConflictField(field) || isMissingField(field)) {
    return true;
  }
  if (isNewsSourceField(field)) {
    return true;
  }
  const confidence = getFieldConfidence(field);
  if (shouldRequireReview(confidence)) {
    return true;
  }

  if (confidence !== undefined && confidence < CONFIDENCE.BULK_ACCEPT_THRESHOLD) {
    return true;
  }
  return false;
}

export function isPendingDecision(
  field: ProfileField,
  decision: ReviewDecision,
): boolean {
  return !isDecisionComplete(field, decision);
}

export function isDecisionComplete(
  field: ProfileField,
  decision: ReviewDecision,
): boolean {
  if (decision.status === "accepted" || decision.status === "rejected") {
    if (isConflictField(field)) {
      return decision.selectedCandidateIndex !== undefined;
    }
    return true;
  }
  if (decision.status === "edited") {
    return Boolean(decision.editedValue?.trim());
  }
  return false;
}

export function buildReviewFields(
  fields: ProfileField[],
  decisions: ReviewDecisions,
): ReviewField[] {
  return fields.map((original) => ({
    key: getFieldKey(original),
    original,
    decision: decisions[getFieldKey(original)] ?? createInitialDecision(),
  }));
}

export function computeReviewSummary(reviewFields: ReviewField[]): ReviewSummary {
  const summary: ReviewSummary = {
    total: reviewFields.length,
    accepted: 0,
    completed: 0,
    needsAttention: 0,
    conflicts: 0,
    missing: 0,
  };

  for (const item of reviewFields) {
    const { decision, original } = item;

    if (decision.status === "accepted") {
      summary.accepted += 1;
    }

    if (isPendingDecision(original, decision)) {
      summary.needsAttention += 1;
    }

    if (isUnresolvedConflictField(original, decision)) {
      summary.conflicts += 1;
    }

    if (isUnresolvedMissingField(original, decision)) {
      summary.missing += 1;
    }

    if (isDecisionComplete(original, decision)) {
      summary.completed += 1;
    }
  }

  return summary;
}

export function filterReviewFields(
  reviewFields: ReviewField[],
  filter: ReviewFilter,
): ReviewField[] {
  switch (filter) {
    case "all":
      return reviewFields;
    case "needs_review":
      return reviewFields.filter((item) =>
        isPendingDecision(item.original, item.decision),
      );
    case "conflicts":
      return reviewFields.filter(isUnresolvedConflict);
    case "accepted":
      return reviewFields.filter((item) => item.decision.status === "accepted");
    case "rejected":
      return reviewFields.filter((item) => item.decision.status === "rejected");
    case "edited":
      return reviewFields.filter((item) => item.decision.status === "edited");
  }
}

export function canFieldBulkAccept(field: ProfileField): boolean {
  if (isConflictField(field) || isMissingField(field)) {
    return false;
  }
  return canBulkAccept(getFieldConfidence(field));
}

export function countBulkEligibleFields(reviewFields: ReviewField[]): number {
  return reviewFields.filter(
    (item) =>
      item.decision.status === "pending" && canFieldBulkAccept(item.original),
  ).length;
}

export function applyBulkAccept(
  fields: ProfileField[],
  decisions: ReviewDecisions,
): ReviewDecisions {
  const next = { ...decisions };
  const now = new Date().toISOString();

  for (const field of fields) {
    const key = getFieldKey(field);
    const current = next[key] ?? createInitialDecision();
    if (current.status !== "pending") {
      continue;
    }
    if (!canFieldBulkAccept(field)) {
      continue;
    }
    next[key] = {
      status: "accepted",
      updatedAt: now,
    };
  }

  return next;
}

export function getUnresolvedCount(reviewFields: ReviewField[]): number {
  return reviewFields.filter(
    (item) => !isDecisionComplete(item.original, item.decision),
  ).length;
}

export function canSaveProfile(reviewFields: ReviewField[]): boolean {
  return getUnresolvedCount(reviewFields) === 0;
}

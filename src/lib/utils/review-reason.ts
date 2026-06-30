import type { ProfileField } from "@/types/profile";
import { shouldRequireReview } from "@/lib/utils/confidence";
import {
  isConflictField,
  isMissingField,
  isNewsSourceField,
  isNormalField,
} from "@/lib/utils/field-utils";

export function getReviewReason(field: ProfileField): string | null {
  if (isConflictField(field)) {
    return "Two filings report different values for this metric.";
  }

  if (isMissingField(field)) {
    return field.note ?? "Latest filing does not report this value.";
  }

  if (isNewsSourceField(field)) {
    return "Sourced from news rather than a filed SEC document.";
  }

  if (isNormalField(field) && shouldRequireReview(field.confidence)) {
    if (field.source.toLowerCase().includes("presentation")) {
      return "Estimated from investor presentation rather than a primary SEC filing.";
    }
    if (field.source.toLowerCase().includes("estimate")) {
      return "Derived from management estimates with limited filing support.";
    }
    return "Confidence falls below the automatic acceptance threshold.";
  }

  return null;
}

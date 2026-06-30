import type { ProfileField, SavedProfileField } from "@/types/profile";
import type { ReviewDecisions } from "@/types/review";
import {
  getFieldKey,
  isConflictField,
  isMissingField,
  isNormalField,
} from "@/lib/utils/field-utils";

export function buildSavedFields(
  profile: ProfileField[],
  decisions: ReviewDecisions,
): SavedProfileField[] {
  const saved: SavedProfileField[] = [];

  for (const field of profile) {
    const key = getFieldKey(field);
    const decision = decisions[key];
    if (!decision || decision.status === "rejected" || decision.status === "pending") {
      continue;
    }

    if (decision.status === "edited") {
      saved.push({
        section: field.section,
        field: field.field,
        label: field.label,
        value: decision.editedValue ?? null,
        reviewStatus: "edited",
        userEdited: true,
      });
      continue;
    }

    if (isConflictField(field)) {
      const index = decision.selectedCandidateIndex ?? 0;
      const candidate = field.candidates[index];
      if (!candidate) {
        continue;
      }
      saved.push({
        section: field.section,
        field: field.field,
        label: field.label,
        value: candidate.value,
        source: candidate.source,
        source_url: candidate.source_url,
        confidence: candidate.confidence,
        reviewStatus: "accepted",
      });
      continue;
    }

    if (isMissingField(field)) {
      continue;
    }

    if (isNormalField(field)) {
      saved.push({
        section: field.section,
        field: field.field,
        label: field.label,
        value: field.value,
        source: field.source,
        source_url: field.source_url,
        confidence: field.confidence,
        source_date: field.source_date,
        reviewStatus: "accepted",
      });
    }
  }

  return saved;
}

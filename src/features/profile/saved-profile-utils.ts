import type { SavedProfileField } from "@/types/profile";

export interface SavedProfileSummary {
  total: number;
  accepted: number;
  edited: number;
}

export function computeSavedProfileSummary(
  fields: SavedProfileField[],
): SavedProfileSummary {
  return {
    total: fields.length,
    accepted: fields.filter((field) => field.reviewStatus === "accepted").length,
    edited: fields.filter((field) => field.reviewStatus === "edited").length,
  };
}

export function getSavedFieldKey(field: SavedProfileField): string {
  return `${field.section}.${field.field}`;
}

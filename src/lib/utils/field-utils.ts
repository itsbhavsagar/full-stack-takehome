import type {
  ConflictProfileField,
  MissingProfileField,
  NormalProfileField,
  ProfileField,
} from "@/types/profile";

export function getFieldKey(field: ProfileField): string {
  return `${field.section}.${field.field}`;
}

export function isConflictField(
  field: ProfileField,
): field is ConflictProfileField {
  return "conflict" in field && field.conflict === true;
}

export function isMissingField(field: ProfileField): field is MissingProfileField {
  return field.value === null && "note" in field;
}

export function isNewsSourceField(
  field: ProfileField,
): field is NormalProfileField & { source_date: string } {
  return (
    !isConflictField(field) &&
    !isMissingField(field) &&
    "source_date" in field &&
    typeof field.source_date === "string"
  );
}

export function isNormalField(field: ProfileField): field is NormalProfileField {
  return !isConflictField(field) && !isMissingField(field);
}

export function getFieldDisplayValue(field: ProfileField): string | null {
  if (isMissingField(field)) {
    return null;
  }
  if (isConflictField(field)) {
    return null;
  }
  return field.value;
}

export function getFieldConfidence(field: ProfileField): number | undefined {
  if (isConflictField(field) || isMissingField(field)) {
    return isMissingField(field) ? 0 : undefined;
  }
  return field.confidence;
}

export function getSectionOrderFromItems<T extends { section: string }>(
  fields: T[],
): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const field of fields) {
    if (!seen.has(field.section)) {
      seen.add(field.section);
      order.push(field.section);
    }
  }
  return order;
}

export function getSectionOrder(fields: ProfileField[]): string[] {
  return getSectionOrderFromItems(fields);
}

export interface ProfileCandidate {
  value: string;
  source: string;
  source_url: string;
  confidence: number;
}

export interface ProfileFieldBase {
  section: string;
  field: string;
  label: string;
}

export interface NormalProfileField extends ProfileFieldBase {
  value: string;
  source: string;
  source_url: string;
  confidence: number;
  source_date?: string;
  conflict?: never;
  candidates?: never;
  note?: never;
}

export interface MissingProfileField extends ProfileFieldBase {
  value: null;
  confidence: 0;
  note: string;
  source?: never;
  source_url?: never;
  source_date?: never;
  conflict?: never;
  candidates?: never;
}

export interface ConflictProfileField extends ProfileFieldBase {
  conflict: true;
  candidates: ProfileCandidate[];
  value?: never;
  source?: never;
  source_url?: never;
  confidence?: never;
  source_date?: never;
  note?: never;
}

export type ProfileField =
  | NormalProfileField
  | MissingProfileField
  | ConflictProfileField;

export interface SavedProfileField {
  section: string;
  field: string;
  label: string;
  value: string | null;
  source?: string;
  source_url?: string;
  confidence?: number;
  source_date?: string;
  reviewStatus: "accepted" | "edited";
  userEdited?: boolean;
}

export interface SavedProfile {
  id: string;
  buildSessionId: string;
  ticker: string;
  fields: SavedProfileField[];
  savedAt: string;
}

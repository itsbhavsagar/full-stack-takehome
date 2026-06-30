import type { ProfileField } from "@/types/profile";

export type ReviewStatus = "pending" | "accepted" | "rejected" | "edited";

export type ReviewFilter =
  | "all"
  | "needs_review"
  | "conflicts"
  | "accepted"
  | "rejected"
  | "edited";

export interface ReviewDecision {
  status: ReviewStatus;
  editedValue?: string;
  selectedCandidateIndex?: number;
  updatedAt: string;
}

export type ReviewDecisions = Record<string, ReviewDecision>;

export interface ReviewField {
  key: string;
  original: ProfileField;
  decision: ReviewDecision;
}

export interface ReviewSummary {
  total: number;
  accepted: number;
  completed: number;
  needsAttention: number;
  conflicts: number;
  missing: number;
}

export interface DraftReview {
  buildSessionId: string;
  decisions: ReviewDecisions;
  updatedAt: string;
}

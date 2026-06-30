import { apiClient } from "@/lib/api/client";
import type { DraftReview, ReviewDecision } from "@/types/review";

export const reviewApi = {
  getDraft: (buildSessionId: string) =>
    apiClient<DraftReview>(`/api/builds/${buildSessionId}/draft`),

  updateField: (
    buildSessionId: string,
    fieldKey: string,
    decision: Omit<ReviewDecision, "updatedAt">,
  ) =>
    apiClient<DraftReview>(`/api/builds/${buildSessionId}/draft/${fieldKey}`, {
      method: "PATCH",
      body: decision,
    }),

  bulkAccept: (buildSessionId: string) =>
    apiClient<DraftReview>(`/api/builds/${buildSessionId}/draft/bulk-accept`, {
      method: "POST",
    }),
};

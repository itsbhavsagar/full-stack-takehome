"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/lib/api/review";
import type { ReviewDecision } from "@/types/review";

export function useDraftReview(buildSessionId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["draft-review", buildSessionId],
    queryFn: () => {
      if (!buildSessionId) {
        throw new Error("Build session id is required");
      }
      return reviewApi.getDraft(buildSessionId);
    },
    enabled: Boolean(buildSessionId) && enabled,
  });
}

export function useUpdateFieldDecision(buildSessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fieldKey,
      decision,
    }: {
      fieldKey: string;
      decision: Omit<ReviewDecision, "updatedAt">;
    }) => reviewApi.updateField(buildSessionId, fieldKey, decision),
    onSuccess: (data) => {
      queryClient.setQueryData(["draft-review", buildSessionId], data);
    },
  });
}

export function useBulkAccept(buildSessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reviewApi.bulkAccept(buildSessionId),
    onSuccess: (data) => {
      queryClient.setQueryData(["draft-review", buildSessionId], data);
    },
  });
}

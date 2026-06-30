"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { buildApi } from "@/lib/api/build";

export function useStartBuild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticker: string) => buildApi.start(ticker),
    onSuccess: (session) => {
      queryClient.setQueryData(["build-session", session.id], session);
    },
  });
}

export function useRetryBuild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (buildSessionId: string) => buildApi.retry(buildSessionId),
    onSuccess: (_data, buildSessionId) => {
      queryClient.invalidateQueries({ queryKey: ["build-session", buildSessionId] });
      queryClient.removeQueries({ queryKey: ["draft-review", buildSessionId] });
    },
  });
}

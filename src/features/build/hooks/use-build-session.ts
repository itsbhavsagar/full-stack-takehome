"use client";

import { useQuery } from "@tanstack/react-query";
import { buildApi } from "@/lib/api/build";
import { BUILD_POLL_INTERVAL_MS } from "@/lib/constants/build";
import type { BuildSession } from "@/types/build";

export function useBuildSession(buildSessionId: string | undefined) {
  return useQuery({
    queryKey: ["build-session", buildSessionId],
    queryFn: () => {
      if (!buildSessionId) {
        throw new Error("Build session id is required");
      }
      return buildApi.get(buildSessionId);
    },
    enabled: Boolean(buildSessionId),
    refetchInterval: (query) => {
      const data = query.state.data as BuildSession | undefined;
      if (!data) {
        return BUILD_POLL_INTERVAL_MS;
      }
      if (data.status === "running") {
        return BUILD_POLL_INTERVAL_MS;
      }
      return false;
    },
  });
}

import { apiClient } from "@/lib/api/client";
import type { BuildSession } from "@/types/build";

export const buildApi = {
  start: (ticker: string) =>
    apiClient<BuildSession>("/api/builds", {
      method: "POST",
      body: { ticker },
    }),

  get: (id: string) => apiClient<BuildSession>(`/api/builds/${id}`),

  retry: (id: string) =>
    apiClient<BuildSession>(`/api/builds/${id}/retry`, {
      method: "POST",
    }),
};

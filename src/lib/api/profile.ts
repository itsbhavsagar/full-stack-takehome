import { apiClient } from "@/lib/api/client";
import type { SavedProfile } from "@/types/profile";

export const profileApi = {
  save: (buildSessionId: string) =>
    apiClient<SavedProfile>(`/api/builds/${buildSessionId}/save`, {
      method: "POST",
    }),

  get: (id: string) => apiClient<SavedProfile>(`/api/profiles/${id}`),
};

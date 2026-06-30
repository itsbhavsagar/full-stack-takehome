"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api/profile";

export function useSavedProfile(profileId: string | undefined) {
  return useQuery({
    queryKey: ["saved-profile", profileId],
    queryFn: () => {
      if (!profileId) {
        throw new Error("Profile id is required");
      }
      return profileApi.get(profileId);
    },
    enabled: Boolean(profileId),
  });
}

export function useSaveProfile(buildSessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileApi.save(buildSessionId),
    onSuccess: (data) => {
      queryClient.setQueryData(["saved-profile", data.id], data);
    },
  });
}

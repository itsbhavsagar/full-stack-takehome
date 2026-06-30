"use client";

import { SavedProfileHeader } from "@/features/profile/components/saved-profile-header";
import { SavedProfileSections } from "@/features/profile/components/saved-profile-sections";
import { SavedProfileSummaryPanel } from "@/features/profile/components/saved-profile-summary-panel";
import { useSavedProfile } from "@/features/profile/use-saved-profile";
import { computeSavedProfileSummary } from "@/features/profile/saved-profile-utils";
import { ApiError } from "@/lib/api/client";
import { PROFILE_COPY } from "@/lib/constants/profile";

interface SavedProfileViewProps {
  profileId: string;
}

export function SavedProfileView({ profileId }: SavedProfileViewProps) {
  const { data: profile, isLoading, isError, error } = useSavedProfile(profileId);

  if (isLoading) {
    return null;
  }

  if (isError) {
    const message =
      error instanceof ApiError && error.status === 404
        ? PROFILE_COPY.profileNotFound
        : PROFILE_COPY.profileLoadFailed;

    return <p className="text-center text-sm text-destructive">{message}</p>;
  }

  if (!profile) {
    return (
      <p className="text-center text-sm text-destructive">{PROFILE_COPY.profileNotFound}</p>
    );
  }

  const summary = computeSavedProfileSummary(profile.fields);

  return (
    <div className="space-y-6">
      <SavedProfileHeader profile={profile} />
      <SavedProfileSummaryPanel summary={summary} />
      <SavedProfileSections fields={profile.fields} />
    </div>
  );
}

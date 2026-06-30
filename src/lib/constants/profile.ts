export const PROFILE_COPY = {
  savedAt: (isoDate: string) =>
    `Saved ${new Date(isoDate).toLocaleString()}`,
  backToHome: "Back to home",
  buildAnother: "Build profile",
  reviewSummary: "Review summary",
  fieldsSaved: "Fields saved",
  accepted: "Accepted",
  edited: "Edited",
  profileNotFound: "Saved profile not found.",
  profileLoadFailed: "Unable to load saved profile.",
} as const;

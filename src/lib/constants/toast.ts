export const TOAST_COPY = {
  profileSaved: "Profile saved.",
  bulkAccepted: (count: number) =>
    count === 1 ? "1 field accepted." : `${count} fields accepted.`,
  buildFailed: "Build failed. Retry the build.",
  saveFailed: "Unable to save profile.",
  bulkAcceptFailed: "Unable to bulk accept fields.",
  fieldUpdateFailed: "Unable to update field. Please try again.",
} as const;

export const TOAST_NAVIGATION_DELAY_MS = 600;

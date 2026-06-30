export const CONFIDENCE = {
  BULK_ACCEPT_THRESHOLD: 0.8,
  LOW_THRESHOLD: 0.6,
  HIGH_THRESHOLD: 0.85,
} as const;

export const REVIEW_FILTER = {
  ALL: "all",
  NEEDS_REVIEW: "needs_review",
  CONFLICTS: "conflicts",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  EDITED: "edited",
} as const;

export const REVIEW_FILTER_LABELS: Record<
  (typeof REVIEW_FILTER)[keyof typeof REVIEW_FILTER],
  string
> = {
  all: "All",
  needs_review: "Needs review",
  conflicts: "Conflict",
  accepted: "Accepted",
  rejected: "Rejected",
  edited: "Edited",
};

export const REVIEW_FILTER_ACTIVE_VARIANT = {
  all: "default",
  needs_review: "warning",
  conflicts: "warning",
  accepted: "success",
  rejected: "destructiveFilled",
  edited: "info",
} as const satisfies Record<
  (typeof REVIEW_FILTER)[keyof typeof REVIEW_FILTER],
  string
>;

export const REVIEW_SUMMARY_LABELS = {
  accepted: "Accepted",
  pending: "Pending",
  conflict: "Conflict",
  missing: "Missing",
} as const;

export const EMPTY_FILTER_MESSAGES: Record<
  (typeof REVIEW_FILTER)[keyof typeof REVIEW_FILTER],
  { title: string; description: string }
> = {
  all: {
    title: "No fields to review",
    description: "This profile has no reviewable fields.",
  },
  needs_review: {
    title: "No fields need review",
    description: "Every field has an accept, edit, or reject decision.",
  },
  conflicts: {
    title: "No unresolved conflicts",
    description: "Every conflict has been resolved.",
  },
  accepted: {
    title: "No accepted fields",
    description: "Accept fields individually or use bulk accept.",
  },
  rejected: {
    title: "No rejected fields",
    description: "No fields have been rejected.",
  },
  edited: {
    title: "No edited fields",
    description: "No fields have been edited.",
  },
};

export const REVIEW_COPY = {
  reviewProfile: "Review profile",
  reviewProfileDetail:
    "Review each field with its source and confidence. Accept, edit, or reject fields, then save the profile.",
  reviewSummary: "Review summary",
  fieldsComplete: (completed: number, total: number) =>
    `${completed} of ${total} fields complete`,
  lowConfidence: "Low confidence",
  conflict: "Conflict",
  conflictDetail: "Two sources report different values. Choose one.",
  missing: "Missing",
  missingDetail: "Latest filing does not report this value.",
  bulkAccept: "Bulk accept",
  bulkAccepted: "Bulk accepted",
  bulkAcceptLoading: "Accepting bulk",
  bulkAcceptTooltip:
    "Accepts fields with confidence ≥80%. Conflict, missing, and low-confidence fields are excluded.",
  bulkAcceptAlreadyAppliedTooltip:
    "Trusted fields were already bulk accepted. Review remaining fields individually.",
  bulkAcceptNoEligibleTooltip:
    "No fields eligible for bulk accept. Conflict, missing, and low-confidence fields are excluded.",
  saveProfile: "Save profile",
  saveProfileLoading: "Saving profile",
  pendingDecisions: (count: number) =>
    count === 1 ? "1 field needs a decision" : `${count} fields need a decision`,
  buildingProfile: "Building profile",
  estimatedCompletion: "Estimated completion",
  newsSource: "News source",
  secFiling: "SEC filing",
  openSource: "Open source",
  enterManually: "Enter manually",
  chooseValue: "Choose one",
  acceptSelection: "Accept selection",
  conflictResolved: (source: string) => `Conflict resolved. Source: ${source}`,
  draftLoadFailedTitle: "Unable to load review",
  draftLoadFailedDescription:
    "We couldn't load your review progress. Refresh the page and try again.",
} as const;

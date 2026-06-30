"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BulkActions } from "@/features/review/components/bulk-actions";
import { ReviewFilterBar } from "@/features/review/components/review-filter-bar";
import { ReviewSummaryPanel } from "@/features/review/components/review-summary-panel";
import { SectionCard } from "@/features/review/components/section-card";
import { EmptyState } from "@/components/empty-state";
import {
  useBulkAccept,
  useDraftReview,
  useUpdateFieldDecision,
} from "@/features/review/hooks/use-draft-review";
import { useSaveProfile } from "@/features/profile/use-saved-profile";
import { EMPTY_FILTER_MESSAGES, REVIEW_COPY } from "@/lib/constants/review";
import { TOAST_NAVIGATION_DELAY_MS } from "@/lib/constants/toast";
import { appToast, delay } from "@/lib/toast/app-toast";
import { getSectionOrder } from "@/lib/utils/field-utils";
import {
  buildReviewFields,
  computeReviewSummary,
  countBulkEligibleFields,
  filterReviewFields,
  canSaveProfile,
  getUnresolvedCount,
} from "@/lib/utils/review-utils";
import { useReviewUiStore } from "@/features/review/review-ui-store";
import type { ProfileField } from "@/types/profile";

interface ReviewExperienceProps {
  buildSessionId: string;
  ticker: string;
  profile: ProfileField[];
}

export function ReviewExperience({
  buildSessionId,
  ticker,
  profile,
}: ReviewExperienceProps) {
  const router = useRouter();
  const activeFilter = useReviewUiStore((state) => state.activeFilter);
  const { data: draft, isLoading, isError } = useDraftReview(buildSessionId, true);
  const updateField = useUpdateFieldDecision(buildSessionId);
  const bulkAccept = useBulkAccept(buildSessionId);
  const saveProfile = useSaveProfile(buildSessionId);
  const [updatingFieldKey, setUpdatingFieldKey] = useState<string | null>(null);
  const [isSaveSucceeded, setIsSaveSucceeded] = useState(false);
  const [isBulkAcceptSucceeded, setIsBulkAcceptSucceeded] = useState(false);

  const reviewFields = useMemo(() => {
    if (!draft) {
      return [];
    }
    return buildReviewFields(profile, draft.decisions);
  }, [draft, profile]);

  const filteredFields = useMemo(
    () => filterReviewFields(reviewFields, activeFilter),
    [reviewFields, activeFilter],
  );

  const summary = useMemo(() => computeReviewSummary(reviewFields), [reviewFields]);
  const bulkEligibleCount = useMemo(
    () => countBulkEligibleFields(reviewFields),
    [reviewFields],
  );
  const sections = useMemo(() => getSectionOrder(profile), [profile]);
  const emptyMessage = EMPTY_FILTER_MESSAGES[activeFilter];

  const handleUpdateField = async (
    fieldKey: string,
    decision: {
      status: "pending" | "accepted" | "rejected" | "edited";
      editedValue?: string;
      selectedCandidateIndex?: number;
    },
  ) => {
    setUpdatingFieldKey(fieldKey);
    try {
      await updateField.mutateAsync({ fieldKey, decision });
    } catch {
      appToast.fieldUpdateFailed();
    } finally {
      setUpdatingFieldKey(null);
    }
  };

  const handleBulkAccept = async () => {
    const acceptedCount = bulkEligibleCount;

    if (acceptedCount === 0) {
      return;
    }

    try {
      await bulkAccept.mutateAsync();
      setIsBulkAcceptSucceeded(true);
      appToast.bulkAccepted(acceptedCount);
    } catch {
      appToast.bulkAcceptFailed();
    }
  };

  const handleSave = async () => {
    try {
      const saved = await saveProfile.mutateAsync();
      setIsSaveSucceeded(true);
      appToast.profileSaved();
      await delay(TOAST_NAVIGATION_DELAY_MS);
      router.push(`/profiles/${saved.id}`);
    } catch {
      setIsSaveSucceeded(false);
      appToast.saveFailed();
    }
  };

  if (isError) {
    return (
      <EmptyState
        title={REVIEW_COPY.draftLoadFailedTitle}
        description={REVIEW_COPY.draftLoadFailedDescription}
      />
    );
  }

  if (isLoading || !draft) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{REVIEW_COPY.reviewProfile}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{ticker}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {REVIEW_COPY.reviewProfileDetail}
          </p>
        </div>
        <BulkActions
          onBulkAccept={handleBulkAccept}
          onSave={handleSave}
          isBulkAccepting={bulkAccept.isPending}
          isBulkAcceptSucceeded={isBulkAcceptSucceeded}
          isSaving={saveProfile.isPending}
          isSaveSucceeded={isSaveSucceeded}
          unresolvedCount={getUnresolvedCount(reviewFields)}
          canSave={canSaveProfile(reviewFields)}
          bulkEligibleCount={bulkEligibleCount}
        />
      </div>

      <ReviewSummaryPanel summary={summary} />

      <div className="space-y-6">
        <ReviewFilterBar />

        {filteredFields.length === 0 ? (
          <EmptyState
            title={emptyMessage.title}
            description={emptyMessage.description}
          />
        ) : (
          <div className="space-y-8">
            {sections.map((section) => {
              const sectionFields = filteredFields.filter(
                (item) => item.original.section === section,
              );

              return (
                <SectionCard
                  key={section}
                  section={section}
                  fields={sectionFields}
                  onUpdateField={handleUpdateField}
                  updatingFieldKey={updatingFieldKey}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

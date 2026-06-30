"use client";

import { Button, type buttonVariants } from "@/components/ui/button";
import {
  REVIEW_FILTER,
  REVIEW_FILTER_ACTIVE_VARIANT,
  REVIEW_FILTER_LABELS,
} from "@/lib/constants/review";
import type { ReviewFilter } from "@/types/review";
import type { VariantProps } from "class-variance-authority";
import { useReviewUiStore } from "@/features/review/review-ui-store";

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

const FILTERS: ReviewFilter[] = [
  REVIEW_FILTER.ALL,
  REVIEW_FILTER.NEEDS_REVIEW,
  REVIEW_FILTER.CONFLICTS,
  REVIEW_FILTER.ACCEPTED,
  REVIEW_FILTER.REJECTED,
  REVIEW_FILTER.EDITED,
];

function ReviewFilterButton({
  filter,
  isActive,
  onClick,
}: {
  filter: ReviewFilter;
  isActive: boolean;
  onClick: () => void;
}) {
  const activeVariant = REVIEW_FILTER_ACTIVE_VARIANT[filter] as ButtonVariant;

  return (
    <Button
      type="button"
      size="sm"
      variant={isActive ? activeVariant : "outline"}
      onClick={onClick}
      aria-pressed={isActive}
    >
      {REVIEW_FILTER_LABELS[filter]}
    </Button>
  );
}

export function ReviewFilterBar() {
  const activeFilter = useReviewUiStore((state) => state.activeFilter);
  const setActiveFilter = useReviewUiStore((state) => state.setActiveFilter);

  return (
    <div className="sticky top-[calc(3.5rem+4px)] z-30 rounded-xl border border-border/40 bg-background/85 px-3 py-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <ReviewFilterButton
            key={filter}
            filter={filter}
            isActive={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>
    </div>
  );
}

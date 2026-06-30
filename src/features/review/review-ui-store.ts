import type { ReviewFilter } from "@/types/review";
import { create } from "zustand";

interface ReviewUiState {
  activeFilter: ReviewFilter;
  editingFieldKey: string | null;
  setActiveFilter: (filter: ReviewFilter) => void;
  setEditingFieldKey: (fieldKey: string | null) => void;
}

export const useReviewUiStore = create<ReviewUiState>((set) => ({
  activeFilter: "all",
  editingFieldKey: null,
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setEditingFieldKey: (editingFieldKey) => set({ editingFieldKey }),
}));

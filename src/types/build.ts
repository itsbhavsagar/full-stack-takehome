import type { ProfileField } from "@/types/profile";

export type BuildStatus = "running" | "done" | "failed";

export interface BuildSession {
  id: string;
  ticker: string;
  stubJobId: string;
  status: BuildStatus;
  progress: number;
  error?: string;
  profile?: ProfileField[];
  createdAt: string;
  updatedAt: string;
  hasDraft: boolean;
  hasSavedProfile: boolean;
  savedProfileId?: string;
}

export interface StubStatusResponse {
  status: BuildStatus;
  progress: number;
  profile?: ProfileField[];
  error?: string;
}

export interface BuildProgressStage {
  min: number;
  max: number;
  label: string;
}

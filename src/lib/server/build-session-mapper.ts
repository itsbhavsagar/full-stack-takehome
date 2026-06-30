import type { BuildSession } from "@/types/build";
import { parseProfileJson } from "@/lib/server/stub-client";

interface BuildSessionRecord {
  id: string;
  ticker: string;
  stubJobId: string;
  status: string;
  progress: number;
  error: string | null;
  profileJson: string | null;
  createdAt: Date;
  updatedAt: Date;
  draftReview: { id: string } | null;
  savedProfile: { id: string } | null;
}

export function toBuildSession(record: BuildSessionRecord): BuildSession {
  const profile = parseProfileJson(record.profileJson);

  return {
    id: record.id,
    ticker: record.ticker,
    stubJobId: record.stubJobId,
    status: record.status as BuildSession["status"],
    progress: record.progress,
    error: record.error ?? undefined,
    profile,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    hasDraft: Boolean(record.draftReview),
    hasSavedProfile: Boolean(record.savedProfile),
    savedProfileId: record.savedProfile?.id,
  };
}

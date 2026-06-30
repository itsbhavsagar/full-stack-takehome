import type { ProfileField } from "@/types/profile";
import type { StubStatusResponse } from "@/types/build";
import type { ReviewDecisions } from "@/types/review";
import { STUB_BUILDER_URL } from "@/lib/constants/build";

export async function startStubBuild(ticker: string): Promise<string> {
  const response = await fetch(`${STUB_BUILDER_URL}/build`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(payload?.detail ?? "Failed to start profile build");
  }

  const data = (await response.json()) as { job_id: string };
  return data.job_id;
}

export async function getStubBuildStatus(
  stubJobId: string,
): Promise<StubStatusResponse> {
  const response = await fetch(`${STUB_BUILDER_URL}/build/${stubJobId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch build status");
  }

  return (await response.json()) as StubStatusResponse;
}

export function parseProfileJson(profileJson: string | null): ProfileField[] | undefined {
  if (!profileJson) {
    return undefined;
  }
  return JSON.parse(profileJson) as ProfileField[];
}

export function parseDecisionsJson(decisionsJson: string): ReviewDecisions {
  return JSON.parse(decisionsJson) as ReviewDecisions;
}

export function serializeProfile(profile: ProfileField[]): string {
  return JSON.stringify(profile);
}

export function serializeDecisions(decisions: ReviewDecisions): string {
  return JSON.stringify(decisions);
}

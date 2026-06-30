"use client";

import { useEffect, useRef } from "react";
import { BuildErrorPanel } from "@/features/build/components/build-error-panel";
import { BuildProgressPanel } from "@/features/build/components/build-progress-panel";
import { useBuildSession } from "@/features/build/hooks/use-build-session";
import { useRetryBuild } from "@/features/build/hooks/use-start-build";
import { ReviewExperience } from "@/features/review/components/review-experience";
import { appToast } from "@/lib/toast/app-toast";

interface BuildExperienceProps {
  buildSessionId: string;
}

export function BuildExperience({ buildSessionId }: BuildExperienceProps) {
  const { data: session, isLoading, isError } = useBuildSession(buildSessionId);
  const retryBuild = useRetryBuild();
  const hasShownBuildFailureToast = useRef(false);

  useEffect(() => {
    if (session?.status === "failed" && !hasShownBuildFailureToast.current) {
      hasShownBuildFailureToast.current = true;
      appToast.buildFailed();
    }

    if (session?.status === "running") {
      hasShownBuildFailureToast.current = false;
    }
  }, [session?.status]);

  if (!session && isLoading) {
    return null;
  }

  if (isError || !session) {
    return (
      <p className="text-center text-sm text-destructive">
        Unable to load build session.
      </p>
    );
  }

  if (session.status === "running") {
    return (
      <BuildProgressPanel progress={session.progress} ticker={session.ticker} />
    );
  }

  if (session.status === "failed") {
    return (
      <BuildErrorPanel
        ticker={session.ticker}
        progress={session.progress}
        error={session.error}
        isRetrying={retryBuild.isPending}
        onRetry={() => retryBuild.mutateAsync(buildSessionId)}
      />
    );
  }

  if (session.status === "done" && session.profile) {
    return (
      <ReviewExperience
        buildSessionId={session.id}
        ticker={session.ticker}
        profile={session.profile}
      />
    );
  }

  return null;
}

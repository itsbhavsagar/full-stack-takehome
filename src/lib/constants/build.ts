import type { BuildProgressStage } from "@/types/build";

export const BUILD_POLL_INTERVAL_MS = 2000;
export const BUILD_ESTIMATE_SECONDS = 40;

export const BUILD_PROGRESS_STAGES: BuildProgressStage[] = [
  { min: 0, max: 20, label: "SEC filings found" },
  { min: 20, max: 40, label: "Reading latest 10-K" },
  { min: 40, max: 60, label: "Comparing 8-K filings" },
  { min: 60, max: 80, label: "Checking Reuters" },
  { min: 80, max: 100, label: "Resolving conflicting values" },
];

export const STUB_BUILDER_URL =
  process.env.STUB_BUILDER_URL ?? "http://localhost:9000";

export const HOME_FLOW_STEPS = [
  "Enter ticker",
  "Review fields",
  "Save profile",
] as const;

export const BUILD_COPY = {
  homeTitle: "Build profile from ticker",
  homeDescriptionLead: "Assemble a company profile from SEC filings and news.",
  homeDescriptionDetail:
    "Review each field with its source and confidence before saving.",
  tickerLabel: "Ticker",
  tickerInputLabel: "Enter Ticker Name",
  buildProfile: "Build profile",
  tickerHelpPrefix: "Enter a ticker to start a profile build. Use ",
  failcoTicker: "FAILCO",
  tickerHelpSuffix: " to test build failure.",
  startBuildFailed:
    "Unable to start profile build. Please check the builder service and try again.",
  assemblingProfileFor: "Building profile for",
  buildFailed: "Build failed",
  buildFailedDetail: "The build stopped before a reviewable profile was available.",
  retryBuild: "Retry build",
} as const;

export function getBuildStageLabel(progress: number): string {
  const stage = BUILD_PROGRESS_STAGES.find(
    (item) => progress >= item.min && progress < item.max,
  );
  return stage?.label ?? "Resolving conflicting values";
}

export function getCompletedStages(progress: number): string[] {
  return BUILD_PROGRESS_STAGES.filter((stage) => progress >= stage.max).map(
    (stage) => stage.label,
  );
}

export function getEstimatedRemainingSeconds(progress: number): number {
  return Math.max(1, Math.round(((100 - progress) / 100) * BUILD_ESTIMATE_SECONDS));
}

export function formatRemainingTime(seconds: number): string {
  if (seconds <= 1) {
    return "Almost done";
  }
  return `${seconds}s remaining`;
}

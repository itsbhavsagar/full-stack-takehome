import { CONFIDENCE } from "@/lib/constants/review";

export type ConfidenceLevel = "high" | "medium" | "low" | "missing";

export function getConfidenceLevel(confidence: number | undefined): ConfidenceLevel {
  if (confidence === undefined || confidence === 0) {
    return "missing";
  }
  if (confidence >= CONFIDENCE.HIGH_THRESHOLD) {
    return "high";
  }
  if (confidence >= CONFIDENCE.LOW_THRESHOLD) {
    return "medium";
  }
  return "low";
}

export function getConfidenceLabel(confidence: number | undefined): string {
  if (confidence === undefined || confidence === 0) {
    return "Not available";
  }
  return `${Math.round(confidence * 100)}%`;
}

export function getConfidenceLevelLabel(level: ConfidenceLevel): string {
  switch (level) {
    case "high":
      return "High confidence";
    case "medium":
      return "Moderate confidence";
    case "low":
      return "Low confidence";
    case "missing":
      return "Missing";
  }
}

export function shouldRequireReview(confidence: number | undefined): boolean {
  if (confidence === undefined) {
    return true;
  }
  return confidence < CONFIDENCE.LOW_THRESHOLD;
}

export function canBulkAccept(confidence: number | undefined): boolean {
  if (confidence === undefined) {
    return false;
  }
  return confidence >= CONFIDENCE.BULK_ACCEPT_THRESHOLD;
}

export function formatConfidencePercent(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

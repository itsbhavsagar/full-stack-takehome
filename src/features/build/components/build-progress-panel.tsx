"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  BUILD_PROGRESS_STAGES,
  formatRemainingTime,
  getBuildStageLabel,
  getCompletedStages,
  getEstimatedRemainingSeconds,
} from "@/lib/constants/build";
import { BUILD_COPY } from "@/lib/constants/build";
import { REVIEW_COPY } from "@/lib/constants/review";
import { cn } from "@/lib/utils";

interface BuildProgressPanelProps {
  progress: number;
  ticker: string;
}

function RemainingTime({ progress }: { progress: number }) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getEstimatedRemainingSeconds(progress),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-medium tabular-nums text-foreground">
      {formatRemainingTime(remainingSeconds)}
    </span>
  );
}

export function BuildProgressPanel({ progress, ticker }: BuildProgressPanelProps) {
  const completedStages = getCompletedStages(progress);
  const currentStage = getBuildStageLabel(progress);

  return (
    <Card className="mx-auto w-full max-w-xl shadow-sm">
      <CardContent className="space-y-6 pt-(--card-spacing)">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{BUILD_COPY.assemblingProfileFor}</p>
        <h2 className="text-2xl font-semibold tracking-tight">{ticker}</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium">{REVIEW_COPY.buildingProfile}</span>
          <span className="tabular-nums text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{REVIEW_COPY.estimatedCompletion}</span>
          <RemainingTime key={progress} progress={progress} />
        </div>
      </div>

      <ul className="space-y-2.5">
        {BUILD_PROGRESS_STAGES.map((stage) => {
          const isComplete = completedStages.includes(stage.label);
          const isCurrent = currentStage === stage.label;

          return (
            <li
              key={stage.label}
              className={cn(
                "flex items-center gap-2.5 text-sm",
                isComplete && "text-foreground",
                isCurrent && "font-medium text-foreground",
                !isComplete && !isCurrent && "text-muted-foreground",
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              ) : isCurrent ? (
                <Spinner className="size-4 shrink-0" />
              ) : (
                <Circle className="size-4 shrink-0 text-muted-foreground/40" />
              )}
              {isComplete ? `✓ ${stage.label}` : stage.label}
              {isCurrent ? "…" : ""}
            </li>
          );
        })}
      </ul>
      </CardContent>
    </Card>
  );
}

"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { BUILD_COPY } from "@/lib/constants/build";
import { buttonBusyClass } from "@/lib/utils/button-utils";

interface BuildErrorPanelProps {
  ticker: string;
  progress: number;
  error?: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export function BuildErrorPanel({
  ticker,
  progress,
  error,
  onRetry,
  isRetrying,
}: BuildErrorPanelProps) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <Alert variant="destructive" className="rounded-xl">
        <AlertCircle className="size-4" />
        <AlertTitle>{BUILD_COPY.buildFailed}</AlertTitle>
        <AlertDescription>
          {error ?? BUILD_COPY.buildFailedDetail}
        </AlertDescription>
      </Alert>

      <Card className="shadow-sm">
        <CardContent className="space-y-3 pt-(--card-spacing)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{BUILD_COPY.tickerLabel}</p>
              <p className="text-xl font-semibold">{ticker}</p>
            </div>
            <p className="text-sm tabular-nums text-muted-foreground">{progress}%</p>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{BUILD_COPY.buildFailedDetail}</p>
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            aria-busy={isRetrying}
            className={buttonBusyClass(isRetrying, "rounded-xl")}
          >
            <RotateCcw className="size-4" />
            {BUILD_COPY.retryBuild}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

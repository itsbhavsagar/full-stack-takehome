"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStartBuild } from "@/features/build/hooks/use-start-build";
import { BUILD_COPY } from "@/lib/constants/build";
import { buttonBusyClass } from "@/lib/utils/button-utils";
import { tickerSchema } from "@/lib/validators/build";

export function TickerForm() {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const [error, setError] = useState<string | null>(null);
  const startBuild = useStartBuild();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsed = tickerSchema.safeParse(ticker);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Ticker is required");
      return;
    }

    try {
      const session = await startBuild.mutateAsync(parsed.data);
      router.push(`/build/${session.id}`);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to start build";
      const isNetworkError =
        message === "fetch failed" ||
        message === "Failed to fetch" ||
        message.toLowerCase().includes("network");

      setError(
        isNetworkError ? BUILD_COPY.startBuildFailed : message || BUILD_COPY.startBuildFailed,
      );
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl border-primary/15 shadow-md">
      <CardContent className="pt-(--card-spacing)">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <label htmlFor="ticker" className="block text-base font-semibold text-foreground">
              {BUILD_COPY.tickerInputLabel}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="ticker"
                value={ticker}
                onChange={(event) => setTicker(event.target.value.toUpperCase())}
                placeholder="e.g. ACME"
                className="h-11 flex-1 rounded-xl uppercase"
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                type="submit"
                variant="default"
                disabled={startBuild.isPending}
                aria-busy={startBuild.isPending}
                className={buttonBusyClass(
                  startBuild.isPending,
                  "h-11 min-w-full rounded-xl px-5 sm:min-w-40",
                )}
                size="lg"
              >
                {BUILD_COPY.buildProfile}
                <ArrowRight className="size-4" />
              </Button>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {BUILD_COPY.tickerHelpPrefix}
            <span className="font-semibold text-foreground">{BUILD_COPY.failcoTicker}</span>
            {BUILD_COPY.tickerHelpSuffix}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

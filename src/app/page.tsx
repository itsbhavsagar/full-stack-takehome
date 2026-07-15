import { AppShell } from "@/components/app-shell";
import { TickerForm } from "@/features/build/components/ticker-form";
import { BUILD_COPY, HOME_FLOW_STEPS } from "@/lib/constants/build";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-10 py-10">
        <div className="space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-wide text-primary uppercase">
              IEC Profile Builder
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {BUILD_COPY.homeTitle}
            </h1>
            <div className="mx-auto max-w-xl space-y-2 text-base text-muted-foreground">
              <p>{BUILD_COPY.homeDescriptionLead}</p>
              <p>{BUILD_COPY.homeDescriptionDetail}</p>
            </div>
          </div>

          <ol className="flex list-none flex-wrap items-center justify-center gap-2 text-sm">
            {HOME_FLOW_STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
                  <span className="mr-1.5 tabular-nums text-primary/70">
                    {index + 1}.
                  </span>
                  {step}
                </span>
                {index < HOME_FLOW_STEPS.length - 1 ? (
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground/60"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <TickerForm />
      </div>
    </AppShell>
  );
}

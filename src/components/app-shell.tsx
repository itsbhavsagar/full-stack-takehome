import Link from "next/link";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background bg-[radial-gradient(ellipse_at_top,oklch(0.97_0.03_255)_0%,var(--background)_58%)]">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex cursor-pointer items-center gap-2.5 font-medium tracking-tight">
            <div className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary text-primary-foreground shadow-sm">
              <Building2 className="size-4" />
            </div>
            <span>IEC Profile Builder</span>
          </Link>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Build profile from ticker
          </p>
        </div>
      </header>
      <main
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}

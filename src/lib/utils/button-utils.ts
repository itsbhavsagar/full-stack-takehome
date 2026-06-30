import { cn } from "@/lib/utils";

export const BUTTON_BUSY_CLASS =
  "animate-pulse-soft transition-opacity duration-300 ease-in-out";

export function buttonBusyClass(isBusy: boolean, className?: string) {
  return cn(isBusy && BUTTON_BUSY_CLASS, className);
}

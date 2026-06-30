import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-border/70 bg-card/40 px-2.5 py-2 text-base transition-[border-color,box-shadow,background-color] duration-200 ease-out outline-none placeholder:text-muted-foreground focus-visible:border-foreground/30 focus-visible:bg-card focus-visible:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_14px_rgba(15,23,42,0.06)] disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive/70 md:text-sm dark:bg-input/30 dark:focus-visible:bg-card/80 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/60",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

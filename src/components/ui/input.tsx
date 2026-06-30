import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-border/70 bg-card/40 px-2.5 py-1 text-base transition-[border-color,box-shadow,background-color] duration-200 ease-out outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-foreground/30 focus-visible:bg-card focus-visible:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_14px_rgba(15,23,42,0.06)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive/70 md:text-sm dark:bg-input/30 dark:focus-visible:bg-card/80 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/60",
        className
      )}
      {...props}
    />
  )
}

export { Input }

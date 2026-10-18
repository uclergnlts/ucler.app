import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-border-strong bg-card px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-foreground disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

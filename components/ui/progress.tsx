"use client";
import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// shadcn/ui Progress; dolgu Motion ile yumuşak ilerler. Renk dersin rengidir (--acc).
function Progress({ value = 0, className, label }: { value?: number; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      data-slot="progress"
      role={label ? "progressbar" : undefined}
      aria-label={label}
      aria-valuenow={label ? Math.round(v) : undefined}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
      aria-hidden={label ? undefined : true}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-secondary", className)}
    >
      <motion.div
        className="h-full rounded-full bg-acc"
        initial={false}
        animate={{ width: `${v}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
      />
    </div>
  );
}

export { Progress };

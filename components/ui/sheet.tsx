"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// shadcn/ui Sheet (yalnızca alttan açılan biçim). Radix Dialog: odak içeride kalır, Escape kapatır,
// kapanınca odak açan düğmeye döner.
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

function SheetContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-40 bg-foreground/25 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto grid max-h-[80dvh] w-full max-w-[520px] gap-2 overflow-y-auto rounded-t-3xl bg-card px-5 pt-3 pb-[calc(20px+env(safe-area-inset-bottom,0px))] outline-none",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=closed]:duration-200",
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="mb-2 h-1 w-9 justify-self-center rounded-full bg-border-strong" />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" className={cn("font-display text-lg leading-snug font-extrabold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="sheet-description" className={cn("text-base leading-relaxed", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };

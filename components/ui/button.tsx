import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// shadcn/ui Button. Ana düğme dersin rengini (--acc) alır; ders dışında lacivert.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[transform,background-color,border-color,opacity] duration-150 outline-none select-none active:scale-[.98] disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Pasif ana düğme soluk renkte değil gri: basılamayacağı ilk bakışta anlaşılsın.
        default: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100",
        outline: "border border-border-strong bg-card text-foreground hover:bg-secondary",
        secondary: "bg-secondary text-foreground hover:bg-secondary/70",
        ghost: "text-foreground hover:bg-secondary",
        link: "text-primary underline-offset-4 hover:underline",
        // Hesap aç / Giriş yap: her yerde aynı mavi, ders renginden bağımsız.
        hesap: "bg-[var(--c1)] text-white hover:bg-[color-mix(in_srgb,var(--c1)_88%,black)] disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100",
        hesapCizgi: "border-[1.5px] border-[var(--c1)] bg-card text-[var(--c1)] hover:bg-[color-mix(in_srgb,var(--c1)_8%,white)]",
      },
      size: {
        default: "h-12 px-5 text-base",
        sm: "h-9 rounded-full px-3.5 text-sm",
        lg: "h-13 px-6 text-base",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

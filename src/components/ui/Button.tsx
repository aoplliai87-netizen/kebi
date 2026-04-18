import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gold text-accent-foreground shadow-sm hover:brightness-110 active:brightness-95 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
  secondary:
    "bg-brand-deep text-primary-foreground shadow-sm hover:bg-brand-deep-soft active:brightness-95 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep/50 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-surface hover:border-border " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
  ghost:
    "bg-transparent text-foreground hover:bg-surface " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 rounded-lg px-3 text-sm",
  md: "h-11 rounded-xl px-5 text-sm font-medium",
  lg: "h-12 rounded-xl px-8 text-base font-medium",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-[color,background-color,box-shadow,filter] duration-200 disabled:pointer-events-none",
          variantClass[variant],
          sizeClass[size],
          className
        )}
        {...props}
      />
    );
  }
);

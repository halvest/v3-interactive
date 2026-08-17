import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "pixel-button min-h-11 px-7 py-3 md:px-9 md:py-3.5 border font-geist text-sm font-medium tracking-wide transition-[transform,background-color,color,border-color,box-shadow] duration-150 ease-out hover:-translate-y-[2px] active:translate-y-[2px] active:scale-[0.99] active:shadow-none",
          variant === "primary"
            ? "border-love bg-love text-white hover:bg-love-deep hover:-translate-y-[1px]"
            : "border-plum/35 bg-surface text-text-primary hover:bg-lavender-soft",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:translate-y-0",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

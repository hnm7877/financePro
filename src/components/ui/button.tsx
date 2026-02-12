import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "w-full rounded-lg font-bold transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2",
          {
            "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-blue-700 hover:-translate-y-0.5": variant === "primary",
            "bg-primary/10 text-primary hover:bg-primary/20": variant === "secondary",
            "border border-gray-200 bg-transparent hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800": variant === "outline",
            "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300": variant === "ghost",
            
            "py-4 text-base": size === "default",
            "py-2 px-4 text-sm": size === "sm",
            "py-5 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="material-symbols-outlined animate-spin text-lg">
            progress_activity
          </span>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

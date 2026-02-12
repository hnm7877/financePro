import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  error?: string;
  label?: string;
  prefix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, label, prefix, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              {icon}
            </span>
          )}
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pl-1">
              {prefix}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "w-full py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500",
              icon ? "pl-10" : prefix ? "pl-14" : "px-4",
              "pr-4",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

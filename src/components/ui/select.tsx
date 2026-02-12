import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: string;
  error?: string;
  label?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon, error, label, options, placeholder, ...props }, ref) => {
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
          <select
            className={cn(
              "w-full py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none custom-select-arrow appearance-none text-gray-700 dark:text-gray-300",
              icon ? "pl-10 pr-4" : "px-4",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          >
             {placeholder && <option value="" disabled selected>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

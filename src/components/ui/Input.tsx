import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon hiển thị ở đầu input (optional) */
  leftIcon?: React.ReactNode;
}

/**
 * Input Component
 * Reusable input field, tùy chọn có icon bên trái
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, ...props }, ref) => {
    if (leftIcon) {
      return (
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
          <input
            ref={ref}
            className={cn(
              "w-full h-10 pl-9 pr-4 text-sm bg-white border border-gray-200 rounded-lg",
              "placeholder:text-gray-400 text-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400",
              "transition-colors",
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          "h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg",
          "placeholder:text-gray-400 text-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400",
          "transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

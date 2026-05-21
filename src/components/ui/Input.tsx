import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon hiển thị ở đầu input (optional) */
  leftIcon?: React.ReactNode;
  /** Icon/button hiển thị ở cuối input (optional) */
  rightIcon?: React.ReactNode;
}

/**
 * Input Component
 * Reusable input field, tùy chọn có icon bên trái
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, ...props }, ref) => {
    const hasLeft = Boolean(leftIcon);
    const hasRight = Boolean(rightIcon);

    if (hasLeft || hasRight) {
      return (
        <div className="relative flex items-center w-full">
          {hasLeft && (
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-10 text-sm bg-white border border-gray-200 rounded-lg",
              "placeholder:text-gray-400 text-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400",
              "transition-colors",
              hasLeft ? "pl-9" : "pl-4",
              hasRight ? "pr-9" : "pr-4",
              className
            )}
            {...props}
          />
          {hasRight && (
            <span className="absolute right-3 text-gray-400 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
      );
    }

    const isFile = props.type === "file";

    return (
      <input
        ref={ref}
        className={cn(
          "h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg",
          "placeholder:text-gray-400 text-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400",
          "transition-colors",
          isFile && "py-1.5 file:mr-3 file:border-0 file:bg-gray-100 file:text-gray-700 file:text-xs file:font-medium file:px-3 file:py-1 file:rounded file:cursor-pointer hover:file:bg-gray-200",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

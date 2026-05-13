"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Switch Component
 * Toggle button (ON/OFF). Xanh lá khi bật, xám nhạt khi tắt.
 * Dùng native checkbox với role="switch" để tránh lỗi ARIA validation.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-white",
          disabled && "cursor-not-allowed opacity-50",
          checked ? "bg-emerald-500" : "bg-gray-200",
          className
        )}
      >
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => {
            if (!disabled) onChange(e.target.checked);
          }}
          disabled={disabled}
          className="sr-only"
          ref={ref}
          {...props}
        />
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </label>
    );
  }
);
Switch.displayName = "Switch";

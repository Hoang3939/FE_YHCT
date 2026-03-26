import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0-100 */
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

/**
 * ProgressBar Component
 * Thanh tiến trình màu đơn, tái sử dụng trong toàn hệ thống
 */
export const ProgressBar = ({
  value,
  className,
  trackClassName,
  fillClassName,
  showLabel = false,
  size = "md",
}: ProgressBarProps) => {
  const clamped = Math.min(100, Math.max(0, value));
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", height, trackClassName)}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", fillClassName ?? "bg-emerald-500")}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 mt-0.5 block text-right">{clamped}%</span>
      )}
    </div>
  );
};

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  /** 2 chữ cái viết tắt */
  initials: string;
  /** Tailwind bg class, ví dụ: bg-blue-500 */
  colorClass?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Avatar Component
 * Hiển thị avatar hình tròn với initials và màu tùy chỉnh
 */
export const Avatar = ({ initials, colorClass = "bg-gray-400", size = "md", className }: AvatarProps) => {
  const sizes = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-bold shrink-0",
        sizes[size],
        colorClass,
        className
      )}
    >
      {initials}
    </div>
  );
};

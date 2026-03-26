import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Button Component
 * Reusable button with different variants
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
      outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
      ghost: "hover:bg-gray-100 text-gray-700",
      icon: "p-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full shadow-sm",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

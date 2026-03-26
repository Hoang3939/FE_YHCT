import React from "react";
import { cn } from "@/lib/utils";
import { Hexagon } from "lucide-react";

interface SettingSectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * SettingSectionCard Component
 * Card wrapper nền trắng, bo tròn, border mỏng chuyên dùng cho các trang Cấu hình.
 */
export const SettingSectionCard = ({
  title,
  description,
  icon,
  children,
  className,
}: SettingSectionCardProps) => {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          {icon || <Hexagon size={16} />}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {description && (
             <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

interface FormRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * FormRow
 * Dùng bên trong SettingSectionCard để chia bố cục nhãn & input (Flexbox)
 */
export const FormRow = ({ label, description, children }: FormRowProps) => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 border-b border-gray-50 last:border-0">
    <div className="sm:w-1/3">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
    <div className="sm:w-2/3 max-w-lg">
      {children}
    </div>
  </div>
);

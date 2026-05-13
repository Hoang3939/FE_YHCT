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
    <div className={cn("overflow-hidden rounded-xl border border-gray-200 bg-white", className)}>
      <div className="flex items-start gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-4 sm:px-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          {icon || <Hexagon size={16} />}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {description && (
             <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
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
  <div className="flex flex-col justify-between gap-4 border-b border-gray-50 py-4 first:pt-0 last:border-0 last:pb-0 lg:flex-row lg:items-start">
    <div className="min-w-0 lg:w-1/3">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
    <div className="min-w-0 lg:w-2/3 lg:max-w-xl">
      {children}
    </div>
  </div>
);

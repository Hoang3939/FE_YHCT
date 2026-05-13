"use client";

import { useMemo } from "react";
import { 
  Settings, Network, Shield, Bell, 
  Archive, Hexagon 
} from "lucide-react";
import { cn, sortConfigItems } from "@/lib/utils";

/** 
 * Mock Services Status.
 * Trong thực tế sẽ fetch từ health-check API.
 */
const SERVICES = [
  { name: "API Server",  status: "OK",   color: "bg-emerald-500" },
  { name: "Vector DB",   status: "OK",   color: "bg-emerald-500" },
  { name: "LLM Gateway", status: "OK",   color: "bg-emerald-500" },
  { name: "Redis Cache", status: "Down", color: "bg-red-500" },
];

/**
 * Danh sách menu cấu hình (chưa sort).
 */
const MENU_ITEMS_RAW = [
  { id: "backup",    label: "Backup & Logs", icon: Archive,  order: 6 },
  { id: "engine",    label: "RAG Engine",    icon: Settings, order: 2 },
  { id: "security",  label: "Bảo mật",       icon: Shield,   order: 4 },
  { id: "general",   label: "Tổng quát",     icon: Hexagon,  order: 1 },
  { id: "notifications", label: "Thông báo", icon: Bell,     order: 5 },
  { id: "embedding", label: "Embedding",     icon: Network,  order: 3 },
];

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * SettingsSidebar Component
 * Bao gồm menu các mục cấu hình và bảng trạng thái services.
 */
export const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
  // Demo sử dụng hàm sortConfigItems để sắp xếp menu theo `order`
  const sortedMenu = useMemo(() => {
    return sortConfigItems(MENU_ITEMS_RAW, "order", "asc");
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* Cấu hình Menu */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="mb-2 px-3 py-2">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Settings size={16} className="text-emerald-500" />
            Cấu hình
          </h2>
          <p className="mt-0.5 text-[10px] text-gray-400">v2.4.1-stable</p>
        </div>

        <nav className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-1">
          {sortedMenu.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={16} className={isActive ? "text-emerald-500" : "text-gray-400"} />
                <span className="min-w-0 truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Trạng thái Services */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Trạng thái
        </p>
        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 xl:grid-cols-1">
          {SERVICES.map((srv) => (
            <div key={srv.name} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
              <span className="flex min-w-0 items-center gap-1.5 text-gray-500">
                <span className="truncate">{srv.name}</span>
              </span>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${srv.color}`} />
                <span className={srv.status === "OK" ? "font-medium text-emerald-600" : "font-medium text-red-500"}>
                  {srv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

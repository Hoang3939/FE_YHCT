"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText, Activity, MessageSquare, Settings, Database, ClipboardCheck, X } from "lucide-react";
import { useRole, type AdminRole } from "@/hooks/useRole";

interface MenuItem {
  name: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  href: string;
  roles?: readonly AdminRole[];
}

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar = ({ isMobileOpen = false, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const role = useRole();

  const menuItems: MenuItem[] = [
    { name: "Bảng điều khiển", icon: Home, href: "/admin/dashboard", roles: ["admin"] },
    { name: "Quản lý người dùng", icon: Users, href: "/admin/users", roles: ["admin"] },
    { name: "Quản lý tài liệu", icon: FileText, href: "/admin/documents", roles: ["admin"] },
    { name: "Vận hành Pipeline", icon: Activity, href: "/admin/pipeline", roles: ["admin"] },
    { name: "Duyệt đóng góp", icon: ClipboardCheck, href: "/admin/contributions", roles: ["admin", "expert"] },
    { name: "Góp ý", icon: MessageSquare, href: "/admin/feedbacks", roles: ["admin"] },
    { name: "Cấu hình hệ thống", icon: Settings, href: "/admin/settings", roles: ["admin"] },
  ];

  const visibleItems = menuItems.filter((item) => role !== null && (!item.roles || item.roles.includes(role)));

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 transition-opacity lg:hidden ${
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col bg-[#111827] text-gray-300 shadow-2xl transition-transform duration-200 lg:w-64 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 text-sm font-bold text-white">
              Y
            </div>
            <span className="text-xl font-bold tracking-wide text-white">Y-RAG</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white lg:hidden"
            aria-label="Đóng menu quản trị"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-6">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Phân hệ chức năng</p>
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive ? "bg-emerald-500/10 font-medium text-emerald-400" : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-emerald-400" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-8 px-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Hệ thống</p>
            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-gray-400">Phiên bản</span>
                <span className="text-white">v2.4.1</span>
              </div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-400">
                  <Database size={12} /> Vector DB
                </span>
                <span className="font-medium text-emerald-400">94%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                <div className="h-full bg-emerald-500" style={{ width: "94%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-700 bg-emerald-600 font-medium text-white">
              {role === "expert" ? "E" : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{role === "expert" ? "Expert" : "Admin"}</p>
              <p className="truncate text-xs text-gray-400">{role === "expert" ? "expert@y-rag.com" : "admin@y-rag.com"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

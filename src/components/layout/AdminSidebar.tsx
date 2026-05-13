"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  Activity,
  MessageSquare,
  Settings,
  Database,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { useRole, type AdminRole } from "@/hooks/useRole";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
  /** Which roles can see this item. undefined = all roles */
  roles?: AdminRole[];
}

/**
 * AdminSidebar Component
 * Sidebar điều hướng bên trái cho trang Admin, nền tối, có logo và thông tin admin.
 * Role-aware: admin thấy tất cả, expert chỉ thấy contributions.
 */
export const AdminSidebar = () => {
  const activeSegment = useSelectedLayoutSegment();
  const role = useRole();

  const menuItems: MenuItem[] = [
    { name: "Bảng điều khiển", icon: Home, href: "/admin/dashboard", roles: ["admin"] },
    { name: "Quản lý người dùng", icon: Users, href: "/admin/users", roles: ["admin"] },
    { name: "Quản lý tài liệu", icon: FileText, href: "/admin/documents", roles: ["admin"] },
    { name: "Vận hành Pipeline", icon: Activity, href: "/admin/pipeline", roles: ["admin"] },
    { name: "Duyệt đóng góp", icon: ClipboardCheck, href: "/admin/contributions" },
    { name: "Góp ý", icon: MessageSquare, href: "/admin/feedbacks", roles: ["admin"] },
    { name: "Cấu hình hệ thống", icon: Settings, href: "/admin/settings", roles: ["admin"] },
  ];

  const visibleItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  const isItemActive = (href: string) => {
    const hrefSegment = href.split("/").filter(Boolean)[1] ?? null;
    return activeSegment === hrefSegment;
  };

  return (
    <aside className="w-64 h-screen bg-[#111827] text-gray-300 flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="text-xl font-bold text-white tracking-wide">Y-RAG</span>
        </div>
      </div>

      {/* Menu Options */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Phân hệ chức năng
        </p>
        {visibleItems.map((item) => {
          const isActive = isItemActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 font-medium" 
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-emerald-400" : "text-gray-400"} />
              {item.name}
            </Link>
          );
        })}

        {/* System Stats in Sidebar */}
        <div className="mt-8 px-3">
           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Hệ thống
          </p>
          <div className="bg-gray-800/50 rounded-lg p-3">
             <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Phiên bản</span>
                <span className="text-white">v2.4.1</span>
             </div>
             <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400 flex items-center gap-1"><Database size={12}/> Vector DB</span>
                <span className="text-emerald-400 font-medium">94%</span>
             </div>
             <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                <div className="h-full w-[94%] bg-emerald-500"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium border-2 border-gray-700">
            {role === "expert" ? "E" : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {role === "expert" ? "Expert" : "Admin"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {role === "expert" ? "expert@y-rag.com" : "admin@y-rag.com"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

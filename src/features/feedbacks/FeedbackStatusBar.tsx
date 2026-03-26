import React from "react";
import { MessageSquare, Bell } from "lucide-react";

/**
 * FeedbackStatusBar Component
 * Thanh trạng thái nền tối hiển thị hệ thống góp ý ONLINE và thống kê nhanh
 */
export const FeedbackStatusBar = () => {
  const quickStats = [
    { label: "Hôm nay",    value: "12 mới",  color: "text-white" },
    { label: "Chờ duyệt",  value: "32",      color: "text-yellow-400" },
    { label: "SLA 48h",    value: "97%",     color: "text-emerald-400" },
    { label: "Chuyên gia", value: "68%",     color: "text-blue-400" },
  ];

  return (
    <div className="bg-gray-900 rounded-xl px-5 py-3.5 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* System indicator */}
      <div className="flex items-center gap-3 shrink-0">
        <MessageSquare size={18} className="text-emerald-400" />
        <span className="text-sm font-bold text-white">Hệ thống Góp ý</span>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </span>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-6 flex-1">
        {quickStats.map((s) => (
          <div key={s.label} className="text-xs">
            <p className="text-gray-500">{s.label}</p>
            <p className={`font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toggle Góp ý / Thông báo */}
      <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1 shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gray-700 rounded-md transition-colors">
          <MessageSquare size={12} /> Góp ý
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-md transition-colors">
          <Bell size={12} /> Thông báo
        </button>
      </div>
    </div>
  );
};

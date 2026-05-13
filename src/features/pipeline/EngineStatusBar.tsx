import React from "react";
import { Activity, StopCircle, Play, List, LayoutDashboard } from "lucide-react";

/**
 * EngineStatusBar Component
 * Thanh trạng thái nền tối hiển thị thông tin engine đang chạy + action buttons
 */
export const EngineStatusBar = () => {
  const quickStats = [
    { label: "Active Workers", value: "2/3" },
    { label: "Queue Depth",    value: "2 jobs" },
    { label: "Avg Throughput", value: "118 chunks/min" },
    { label: "Error Rate",     value: "8.3%" },
  ];

  return (
    <div className="mb-5 flex flex-col gap-4 rounded-xl bg-gray-900 px-4 py-4 sm:px-5 xl:flex-row xl:items-center">
      {/* Engine name + pulse badge */}
      <div className="flex items-center gap-3 shrink-0">
        <Activity size={20} className="text-emerald-400" />
        <div>
          <p className="text-sm font-bold text-white">Pipeline Engine</p>
          <p className="text-[10px] text-gray-400">RAG Processing Core v2.4.1&#8209;stable</p>
        </div>
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ONLINE
        </span>
      </div>

      {/* Quick stats */}
      <div className="flex flex-1 flex-wrap items-center gap-4 lg:gap-5">
        {quickStats.map((s) => (
          <div key={s.label} className="text-xs">
            <p className="text-gray-500">{s.label}</p>
            <p className="text-white font-semibold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
          <LayoutDashboard size={13} /> Tổng quan
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
          <List size={13} /> Log
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors">
          <StopCircle size={13} /> Dừng tất cả
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors">
          <Play size={13} /> Chạy queue
        </button>
      </div>
    </div>
  );
};

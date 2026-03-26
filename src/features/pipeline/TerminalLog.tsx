import React from "react";
import { MOCK_LOGS } from "@/types/pipeline";
import type { LogLevel } from "@/types/pipeline";
import { Terminal } from "lucide-react";

/** Màu mỗi log level */
const LEVEL_COLOR: Record<LogLevel, string> = {
  INFO:    "text-cyan-400",
  SUCCESS: "text-emerald-400",
  WARNING: "text-yellow-400",
  ERROR:   "text-red-400",
  DEBUG:   "text-gray-500",
};

const LEVEL_BG: Record<LogLevel, string> = {
  INFO:    "bg-cyan-900/30",
  SUCCESS: "bg-emerald-900/30",
  WARNING: "bg-yellow-900/20",
  ERROR:   "bg-red-900/30",
  DEBUG:   "bg-gray-800",
};

/**
 * TerminalLog Component
 * Cửa sổ terminal nền tối mô phỏng real-time log của pipeline engine.
 * Font monospace, màu sắc theo log level.
 */
export const TerminalLog = () => (
  <div className="bg-slate-950 rounded-xl border border-gray-800 overflow-hidden">
    {/* Terminal title bar */}
    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border-b border-gray-800">
      <div className="flex gap-1.5">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-emerald-500" />
      </div>
      <div className="flex items-center gap-2 ml-2 text-xs text-gray-400">
        <Terminal size={12} />
        <span className="font-mono">pipeline-engine — log stream</span>
      </div>
      <div className="flex items-center gap-1 ml-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
      </div>
    </div>

    {/* Log output */}
    <div className="p-4 h-56 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col-reverse">
      {MOCK_LOGS.length === 0 && (
        <p className="text-gray-600">Chưa có logs...</p>
      )}
      {[...MOCK_LOGS].reverse().map((log) => (
        <div
          key={log.id}
          className={`flex items-start gap-3 px-2 py-1 rounded mb-0.5 ${LEVEL_BG[log.level]}`}
        >
          <span className="text-gray-600 shrink-0">{log.timestamp}</span>
          <span className={`font-bold shrink-0 w-14 ${LEVEL_COLOR[log.level]}`}>
            [{log.level}]
          </span>
          <span className="text-gray-200 break-all">{log.message}</span>
        </div>
      ))}
    </div>
  </div>
);

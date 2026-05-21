import React, { useMemo } from "react";
import { MOCK_LOGS } from "@/types/pipeline";
import type { Job, LogEntry, LogLevel } from "@/types/pipeline";
import { Terminal } from "lucide-react";

const LEVEL_COLOR: Record<LogLevel, string> = {
  INFO: "text-cyan-400",
  SUCCESS: "text-emerald-400",
  WARNING: "text-yellow-400",
  ERROR: "text-red-400",
  DEBUG: "text-gray-500",
};

const LEVEL_BG: Record<LogLevel, string> = {
  INFO: "bg-cyan-900/30",
  SUCCESS: "bg-emerald-900/30",
  WARNING: "bg-yellow-900/20",
  ERROR: "bg-red-900/30",
  DEBUG: "bg-gray-800",
};

function createSyntheticLogs(jobs: Job[]): LogEntry[] {
  return jobs.slice(0, 8).map((job, index) => {
    const level: LogLevel = job.status === "failed" ? "ERROR" : job.status === "success" ? "SUCCESS" : "INFO";
    const time = new Date(job.updatedAt || job.createdAt || Date.now()).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const message =
      job.status === "failed"
        ? `[${job.id}] ${job.name} thất bại${job.errorMessage ? ` — ${job.errorMessage}` : "."}`
        : job.status === "success"
          ? `[${job.id}] ${job.name} hoàn tất — ${job.chunksGenerated} chunks đã được tạo.`
          : `[${job.id}] ${job.name} đang ở trạng thái ${job.status} — tiến độ ${job.progress}%.`;

    return {
      id: `${job.id}-${index}`,
      timestamp: time,
      level,
      message,
    };
  });
}

export const TerminalLog = ({ jobs = [] }: { jobs?: Job[] }) => {
  const logs = useMemo(() => {
    if (jobs.length > 0) {
      return createSyntheticLogs(jobs);
    }
    return MOCK_LOGS;
  }, [jobs]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-slate-950">
      <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
        </div>
        <div className="ml-2 flex items-center gap-2 text-xs text-gray-400">
          <Terminal size={12} />
          <span className="font-mono">pipeline-engine — log stream</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-emerald-400">LIVE</span>
        </div>
      </div>

      <div className="flex h-56 flex-col-reverse overflow-y-auto p-4 font-mono text-[11px] leading-relaxed">
        {logs.length === 0 && <p className="text-gray-600">Chưa có logs...</p>}
        {[...logs].reverse().map((log) => (
          <div key={log.id} className={`mb-0.5 flex items-start gap-3 rounded px-2 py-1 ${LEVEL_BG[log.level]}`}>
            <span className="shrink-0 text-gray-600">{log.timestamp}</span>
            <span className={`w-14 shrink-0 font-bold ${LEVEL_COLOR[log.level]}`}>[{log.level}]</span>
            <span className="break-all text-gray-200">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

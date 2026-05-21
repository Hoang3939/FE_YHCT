import React, { useMemo } from "react";
import { Activity, RefreshCw, List, Layers, Timer } from "lucide-react";
import type { Job, PipelineStats } from "@/types/pipeline";

interface EngineStatusBarProps {
  jobs?: Job[];
  stats?: PipelineStats | null;
  isRefreshing?: boolean;
}

export const EngineStatusBar = ({ jobs = [], stats, isRefreshing = false }: EngineStatusBarProps) => {
  const runningJobs = useMemo(() => jobs.filter((job) => job.status === "running").length, [jobs]);
  const queuedJobs = useMemo(() => jobs.filter((job) => job.status === "queued").length, [jobs]);
  const averageProgress = useMemo(() => {
    if (jobs.length === 0) {
      return 0;
    }

    const totalProgress = jobs.reduce((sum, job) => sum + (Number(job.progress) || 0), 0);
    return Math.round(totalProgress / jobs.length);
  }, [jobs]);

  const quickStats = [
    { label: "Đang chạy", value: `${runningJobs} job`, icon: Activity },
    { label: "Đang chờ", value: `${queuedJobs} job`, icon: List },
    { label: "Chunks đã tạo", value: `${stats?.chunksCreated ?? 0}`, icon: Layers },
    { label: "Tiến độ TB", value: `${averageProgress}%`, icon: Timer },
  ];

  return (
    <div className="mb-5 flex flex-col gap-4 rounded-xl bg-gray-900 px-5 py-4 lg:flex-row lg:items-center">
      <div className="flex items-center gap-3 shrink-0">
        <Activity size={20} className="text-emerald-400" />
        <div>
          <p className="text-sm font-bold text-white">Pipeline Engine</p>
          <p className="text-[10px] text-gray-400">Polling từ pipeline-service mỗi 5 giây</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-5">
        {quickStats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="text-xs">
              <p className="flex items-center gap-1 text-gray-500">
                <Icon size={12} />
                {item.label}
              </p>
              <p className="mt-0.5 font-semibold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 self-start lg:self-center">
        <div className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-200">
          <RefreshCw size={13} className={isRefreshing ? "animate-spin text-emerald-400" : "text-gray-400"} />
          {isRefreshing ? "Đang đồng bộ" : "Đã đồng bộ"}
        </div>
      </div>
    </div>
  );
};

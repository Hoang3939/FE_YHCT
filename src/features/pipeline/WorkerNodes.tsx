import React from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MOCK_WORKERS } from "@/types/pipeline";
import type { WorkerState } from "@/types/pipeline";
import { Cpu, Wifi, WifiOff } from "lucide-react";

/** Badge trạng thái worker */
const WorkerStateBadge = ({ state }: { state: WorkerState }) => {
  const map: Record<WorkerState, { label: string; cls: string }> = {
    active:  { label: "Đang chạy", cls: "bg-emerald-100 text-emerald-700" },
    idle:    { label: "Rảnh",      cls: "bg-gray-100    text-gray-500"    },
    error:   { label: "Lỗi",       cls: "bg-red-100     text-red-600"     },
    offline: { label: "Offline",   cls: "bg-gray-800    text-gray-300"    },
  };
  const { label, cls } = map[state];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
};

/**
 * WorkerNodes Component
 * Danh sách worker nodes với CPU/RAM progress bars và job active count
 */
export const WorkerNodes = () => (
  <Card className="h-[340px] flex flex-col p-5">
    <div className="mb-4">
      <h3 className="text-sm font-bold text-gray-900">Worker Nodes</h3>
      <p className="text-xs text-gray-400">Tài nguyên và jobs đang xử lý</p>
    </div>

    <div className="flex flex-col gap-4 overflow-y-auto flex-1">
      {MOCK_WORKERS.map((worker) => (
        <div key={worker.id} className="border border-gray-100 rounded-xl p-3.5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {worker.state === "offline"
                ? <WifiOff size={14} className="text-gray-400" />
                : <Wifi size={14} className="text-emerald-500" />
              }
              <span className="text-sm font-semibold text-gray-900">{worker.name}</span>
            </div>
            <WorkerStateBadge state={worker.state} />
          </div>

          {/* CPU */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span className="flex items-center gap-1"><Cpu size={11} /> CPU</span>
              <span className="font-medium text-gray-700">{worker.cpuUsage}%</span>
            </div>
            <ProgressBar
              value={worker.cpuUsage}
              size="sm"
              fillClassName={
                worker.cpuUsage > 85 ? "bg-red-500" :
                worker.cpuUsage > 65 ? "bg-yellow-500" :
                "bg-emerald-500"
              }
            />
          </div>

          {/* RAM */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>RAM</span>
              <span className="font-medium text-gray-700">{worker.ramUsage}%</span>
            </div>
            <ProgressBar
              value={worker.ramUsage}
              size="sm"
              fillClassName={
                worker.ramUsage > 85 ? "bg-red-500" :
                worker.ramUsage > 65 ? "bg-orange-500" :
                "bg-blue-500"
              }
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span><span className="font-semibold text-gray-800">{worker.activeJobs}</span> jobs active</span>
            <span><span className="font-semibold text-gray-800">{worker.jobsToday}</span> hôm nay</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

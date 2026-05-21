import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import type { Job } from "@/types/pipeline";
import { Cpu, Database, ServerCog } from "lucide-react";

interface WorkerNodesProps {
  jobs?: Job[];
}

export const WorkerNodes = ({ jobs = [] }: WorkerNodesProps) => {
  const workerSummary = useMemo(() => {
    const map = new Map<string, { total: number; running: number; queued: number }>();

    jobs.forEach((job) => {
      const workerId = job.workerId || "unassigned";
      const current = map.get(workerId) ?? { total: 0, running: 0, queued: 0 };
      current.total += 1;
      if (job.status === "running") {
        current.running += 1;
      }
      if (job.status === "queued") {
        current.queued += 1;
      }
      map.set(workerId, current);
    });

    return Array.from(map.entries()).map(([workerId, value]) => ({ workerId, ...value }));
  }, [jobs]);

  return (
    <Card className="flex h-[340px] flex-col p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">Worker & Queue</h3>
        <p className="text-xs text-gray-400">Tóm tắt theo worker từ dữ liệu job hiện tại, thay cho node mock.</p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {workerSummary.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
            Chưa có worker thực tế nào từ API. Khi pipeline-service trả thêm worker metrics, khu này sẽ hiển thị chi tiết hơn.
          </div>
        ) : (
          workerSummary.map((worker) => (
            <div key={worker.workerId} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <ServerCog size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{worker.workerId}</p>
                    <p className="text-xs text-gray-500">Tổng {worker.total} job đã nhận</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  {worker.running} đang chạy
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Cpu size={12} />
                    Running
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">{worker.running}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Database size={12} />
                    Queued
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">{worker.queued}</p>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ServerCog size={12} />
                    Total
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">{worker.total}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

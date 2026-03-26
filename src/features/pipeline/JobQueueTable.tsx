import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MOCK_JOBS } from "@/types/pipeline";
import type { JobStatus } from "@/types/pipeline";
import { formatNumber } from "@/lib/utils";
import { RotateCcw, AlertTriangle } from "lucide-react";

/** Badge theo trạng thái job */
function getJobVariant(status: JobStatus): "success" | "warning" | "error" | "default" {
  switch (status) {
    case "running": return "default";
    case "success": return "success";
    case "failed":  return "error";
    case "queued":
    case "paused":
    default:        return "warning";
  }
}

const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  running: "Đang chạy",
  queued:  "Chờ",
  success: "Hoàn thành",
  failed:  "Thất bại",
  paused:  "Tạm dừng",
};

const JOB_TYPE_LABELS = {
  batch_import: "Batch",
  crawl:        "Crawl",
  re_embed:     "Re-embed",
  manual:       "Thủ công",
};

/**
 * JobQueueTable Component
 * Bảng danh sách jobs với progress bar màu, worker, docs/chunks và action
 */
export const JobQueueTable = () => (
  <Card className="p-5">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900">Hàng chờ & Lịch sử Job</h3>
        <p className="text-xs text-gray-400">Các tiến trình xử lý tài liệu đang chạy và chờ</p>
      </div>
      <span className="text-xs text-gray-500">{MOCK_JOBS.length} jobs</span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["TÊN JOB", "LOẠI", "TRẠNG THÁI", "TIẾN TRÌNH", "WORKER", "DOCS/CHUNKS", ""].map((h) => (
              <th key={h} className="py-2.5 px-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_JOBS.length === 0 && (
            <tr>
              <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                Không có job nào.
              </td>
            </tr>
          )}
          {MOCK_JOBS.map((job) => (
            <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
              {/* Tên */}
              <td className="py-3 px-3 max-w-[240px]">
                <p className="text-xs font-semibold text-gray-900 truncate" title={job.name}>{job.name}</p>
                <p className="text-[10px] text-gray-400">{job.id}</p>
              </td>

              {/* Loại */}
              <td className="py-3 px-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                  {JOB_TYPE_LABELS[job.type]}
                </span>
              </td>

              {/* Trạng thái */}
              <td className="py-3 px-3">
                {job.status === "running" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đang chạy
                  </span>
                ) : (
                  <Badge variant={getJobVariant(job.status)} className="text-[10px]">
                    {JOB_STATUS_LABELS[job.status]}
                  </Badge>
                )}
              </td>

              {/* Tiến trình */}
              <td className="py-3 px-3 w-36">
                <div className="flex items-center gap-2">
                  <ProgressBar
                    value={job.progress}
                    size="sm"
                    fillClassName={
                      job.status === "failed"  ? "bg-red-500" :
                      job.status === "queued"  ? "bg-gray-300" :
                      job.status === "success" ? "bg-emerald-500" :
                      "bg-yellow-400"
                    }
                  />
                  <span className="text-[10px] text-gray-500 w-8 shrink-0">{job.progress}%</span>
                </div>
              </td>

              {/* Worker */}
              <td className="py-3 px-3 text-xs text-gray-500 font-mono">{job.workerId}</td>

              {/* Docs / Chunks */}
              <td className="py-3 px-3 text-xs text-gray-700 whitespace-nowrap">
                {job.docsProcessed}/{job.docsTotal} docs
                <span className="text-gray-400 mx-1">·</span>
                {formatNumber(job.chunksGenerated)} chunks
              </td>

              {/* Action */}
              <td className="py-3 px-3">
                {job.status === "failed" && (
                  <button
                    title="Chạy lại"
                    className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600 transition-colors"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
                {job.status === "running" && (
                  <button
                    title="Cảnh báo"
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    <AlertTriangle size={13} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

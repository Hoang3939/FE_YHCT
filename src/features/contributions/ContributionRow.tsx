import React from "react";
import { Badge } from "@/components/ui/Badge";
import type { ContributionPipelineJob, KnowledgeContribution } from "@/types/contribution";
import {
  CONTRIBUTION_TYPE_LABELS,
  CONTRIBUTION_STATUS_LABELS,
} from "@/types/contribution";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, "success" | "warning" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const TYPE_CLS: Record<string, string> = {
  medicine: "text-violet-600 bg-violet-50",
  herb: "text-green-600 bg-green-50",
  document: "text-blue-600 bg-blue-50",
};

const PIPELINE_STATUS_LABELS: Record<NonNullable<ContributionPipelineJob["status"]>, string> = {
  queued: "Đang chờ",
  running: "Đang chạy",
  success: "Hoàn tất",
  failed: "Lỗi",
};

const PIPELINE_STATUS_VARIANT: Record<NonNullable<ContributionPipelineJob["status"]>, "brand" | "warning" | "success" | "error"> = {
  queued: "warning",
  running: "brand",
  success: "success",
  failed: "error",
};

/** Format ISO string theo giờ địa phương */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

interface ContributionRowProps {
  contribution: KnowledgeContribution;
  pipelineJob: ContributionPipelineJob | null;
  pipelineLoading: boolean;
  onClick: (id: string) => void;
  selected: boolean;
  onPublish?: (ebookId: string) => void;
}

/**
 * ContributionRow — Một hàng trong bảng danh sách đóng góp.
 * Hiển thị: tiêu đề, loại, trạng thái, ngày tạo.
 */
export const ContributionRow = ({
  contribution,
  pipelineJob,
  pipelineLoading,
  onClick,
  selected,
  onPublish,
}: ContributionRowProps) => {
  const typeCls = TYPE_CLS[contribution.contributionType] ?? "text-gray-600 bg-gray-50";
  const statusVariant = STATUS_VARIANT[contribution.status] ?? "warning";

  return (
    <tr
      onClick={() => onClick(contribution.contributionId)}
      className={`border-b border-gray-50 cursor-pointer transition-colors ${
        selected ? "bg-emerald-50/60" : "hover:bg-gray-50/70"
      }`}
    >
      {/* Tiêu đề */}
      <td className="py-3 px-4 align-top">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">
          {contribution.title}
        </p>
        {contribution.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {contribution.description}
          </p>
        )}
      </td>

      {/* Loại đóng góp */}
      <td className="py-3 px-3 align-top">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeCls}`}
        >
          {CONTRIBUTION_TYPE_LABELS[contribution.contributionType]}
        </span>
      </td>

      {/* Trạng thái */}
      <td className="py-3 px-3 align-top">
        <Badge variant={statusVariant}>
          {CONTRIBUTION_STATUS_LABELS[contribution.status]}
        </Badge>
      </td>

      {/* Ngày tạo */}
      <td className="py-3 px-3 align-top text-xs text-gray-500 whitespace-nowrap">
        {formatDate(contribution.createdAt)}
      </td>

      {/* Pipeline */}
      <td className="py-3 px-3 align-top min-w-[190px]">
        {contribution.status !== "approved" ? (
          <span className="text-xs text-gray-400">Chờ duyệt</span>
        ) : pipelineJob ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={PIPELINE_STATUS_VARIANT[pipelineJob.status]}>
                {PIPELINE_STATUS_LABELS[pipelineJob.status]}
              </Badge>
              <span className="text-[11px] font-medium text-gray-500">{pipelineJob.progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${
                  pipelineJob.status === "failed"
                    ? "bg-red-500"
                    : pipelineJob.status === "success"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${Math.max(6, pipelineJob.progress)}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 line-clamp-1">{pipelineJob.backendStatus}</p>
          </div>
        ) : pipelineLoading ? (
          <span className="text-xs text-blue-600">Đang đồng bộ...</span>
        ) : (
          <span className="text-xs text-amber-600">Chưa có job</span>
        )}
      </td>

      {/* Ngày duyệt */}
      <td className="py-3 px-3 align-top text-xs text-gray-400 whitespace-nowrap">
        {contribution.reviewedAt ? formatDate(contribution.reviewedAt) : "—"}
      </td>

      {/* Thao tác - Xuất bản */}
      <td className="py-3 px-3 align-top">
        {contribution.status === "approved" && contribution.ebookId && onPublish && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPublish(contribution.ebookId!);
            }}
            className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
          >
            Xuất bản
          </button>
        )}
      </td>
    </tr>
  );
};

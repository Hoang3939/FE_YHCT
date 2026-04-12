import React from "react";
import { Badge } from "@/components/ui/Badge";
import type { KnowledgeContribution } from "@/types/contribution";
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

/** Format ISO string → DD/MM/YYYY HH:MM */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

interface ContributionRowProps {
  contribution: KnowledgeContribution;
  onClick: (id: string) => void;
  selected: boolean;
}

/**
 * ContributionRow — Một hàng trong bảng danh sách đóng góp.
 * Hiển thị: tiêu đề, loại, trạng thái, ngày tạo.
 */
export const ContributionRow = ({
  contribution,
  onClick,
  selected,
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

      {/* Ngày duyệt */}
      <td className="py-3 px-3 align-top text-xs text-gray-400 whitespace-nowrap">
        {contribution.reviewedAt ? formatDate(contribution.reviewedAt) : "—"}
      </td>
    </tr>
  );
};

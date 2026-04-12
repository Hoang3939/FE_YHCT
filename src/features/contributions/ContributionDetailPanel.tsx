"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/hooks/useRole";
import { fetchContribution, reviewContribution } from "@/services/api/contribution.service";
import type { KnowledgeContribution } from "@/types/contribution";
import {
  CONTRIBUTION_TYPE_LABELS,
  CONTRIBUTION_STATUS_LABELS,
} from "@/types/contribution";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

interface ContributionDetailPanelProps {
  contributionId: string | null;
  /** Callback sau khi review thành công để refresh list */
  onReviewed?: () => void;
}

/**
 * ContributionDetailPanel — Cột phải hiển thị chi tiết đóng góp.
 * Expert: có nút Duyệt / Từ chối + form nhận xét.
 * Admin: chỉ xem (read-only).
 */
export const ContributionDetailPanel = ({
  contributionId,
  onReviewed,
}: ContributionDetailPanelProps) => {
  const role = useRole();
  const [detail, setDetail] = useState<KnowledgeContribution | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (!contributionId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchContribution(contributionId);
        if (!cancelled) {
          setDetail(data);
          setFeedbackText("");
        }
      } catch {
        if (!cancelled) {
          setDetail(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [contributionId]);

  const handleReview = async (status: "approved" | "rejected") => {
    if (!detail) return;
    setReviewing(true);
    try {
      await reviewContribution(detail.contributionId, {
        status,
        feedback: feedbackText.trim() || undefined,
      });
      onReviewed?.();
    } catch {
      // Lỗi review — giữ nguyên panel
    } finally {
      setReviewing(false);
    }
  };

  // Placeholder khi chưa chọn
  if (!contributionId) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-400">
          Chọn một đóng góp để xem chi tiết
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400 min-h-[400px]">
        Đang tải chi tiết...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-sm text-red-500 min-h-[400px]">
        Không tìm thấy đóng góp
      </div>
    );
  }

  const isExpert = role === "expert";
  const isPending = detail.status === "pending";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {detail.title}
          </h3>
          <Badge variant={STATUS_VARIANT[detail.status] ?? "warning"}>
            {CONTRIBUTION_STATUS_LABELS[detail.status]}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Loại: {CONTRIBUTION_TYPE_LABELS[detail.contributionType]}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Mô tả */}
        {detail.description && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Mô tả</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {detail.description}
            </p>
          </div>
        )}

        {/* Tham chiếu */}
        {detail.reference && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Tham chiếu</p>
            <p className="text-sm text-gray-700">{detail.reference}</p>
          </div>
        )}

        {/* File đính kèm */}
        {detail.filePath && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Tệp đính kèm</p>
            <a
              href={detail.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Xem tệp
            </a>
          </div>
        )}

        {/* Nhận xét đã có (nếu đã duyệt/từ chối) */}
        {detail.feedback && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Nhận xét của chuyên gia
            </p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
              {detail.feedback}
            </p>
          </div>
        )}
      </div>

      {/* Expert review actions — chỉ hiện cho expert + trạng thái pending */}
      {isExpert && isPending && (
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div>
            <label
              htmlFor="review-feedback"
              className="text-xs font-medium text-gray-500 mb-1 block"
            >
              Nhận xét (tuỳ chọn)
            </label>
            <textarea
              id="review-feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nhập nhận xét cho người đóng góp..."
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => void handleReview("approved")}
              disabled={reviewing}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Duyệt
            </Button>
            <Button
              onClick={() => void handleReview("rejected")}
              disabled={reviewing}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Từ chối
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

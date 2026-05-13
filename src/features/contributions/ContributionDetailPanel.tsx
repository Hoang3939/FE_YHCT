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

    const trimmedFeedback = feedbackText.trim();
    if (status === "rejected" && !trimmedFeedback) {
      return;
    }

    setReviewing(true);
    try {
      await reviewContribution(detail.contributionId, {
        status,
        feedback: trimmedFeedback || undefined,
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
    <div className="min-w-0 rounded-xl border border-gray-100 bg-white shadow-sm">
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
        <div className="space-y-3 border-t border-gray-100 p-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Đóng góp là flow có xét duyệt. Nếu chuyên gia từ chối, bắt buộc phải nhập lý do để người gửi nhận được phản hồi rõ ràng qua email.
          </div>

          <div>
            <label
              htmlFor="review-feedback"
              className="mb-1 block text-xs font-medium text-gray-500"
            >
              {feedbackText.trim().length > 0
                ? "Nhận xét cho người đóng góp"
                : "Nhận xét cho người đóng góp"}
            </label>
            <textarea
              id="review-feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nhập nhận xét cho người đóng góp. Khi từ chối, trường này là bắt buộc."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Duyệt: có thể để trống. Từ chối: bắt buộc nêu lý do cụ thể.
            </p>
          </div>
 
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => void handleReview("approved")}
              disabled={reviewing}
              className="flex-1 bg-emerald-600 text-sm text-white hover:bg-emerald-700"
            >
              <CheckCircle className="mr-1.5 h-4 w-4" />
              Duyệt & gửi email
            </Button>
            <Button
              onClick={() => void handleReview("rejected")}
              disabled={reviewing || !feedbackText.trim()}
              className="flex-1 bg-red-600 text-sm text-white hover:bg-red-700 disabled:bg-red-300"
              title={!feedbackText.trim() ? "Cần nhập lý do từ chối" : undefined}
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Từ chối
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

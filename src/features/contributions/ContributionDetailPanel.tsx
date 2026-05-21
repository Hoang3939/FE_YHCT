"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, FileText, Files, LoaderCircle, XCircle, Eye, Download, FileImage } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRole } from "@/hooks/useRole";
import {
  fetchContribution,
  fetchLatestContributionPipeline,
  reviewContribution,
} from "@/services/api/contribution.service";

const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || 'http://localhost:3004';
import type {
  ContributionAsset,
  ContributionPipelineJob,
  KnowledgeContribution,
} from "@/types/contribution";
import {
  CONTRIBUTION_ASSET_TYPE_LABELS,
  CONTRIBUTION_TYPE_LABELS,
  CONTRIBUTION_STATUS_LABELS,
} from "@/types/contribution";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

const PIPELINE_STATUS_LABELS: Record<NonNullable<ContributionPipelineJob["status"]>, string> = {
  queued: "Đang chờ worker nhận",
  running: "Pipeline đang chạy",
  success: "Pipeline hoàn tất",
  failed: "Pipeline lỗi",
};

const PIPELINE_STATUS_VARIANT: Record<NonNullable<ContributionPipelineJob["status"]>, "brand" | "warning" | "success" | "error"> = {
  queued: "warning",
  running: "brand",
  success: "success",
  failed: "error",
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
  const [pipelineJob, setPipelineJob] = useState<ContributionPipelineJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineLoading, setPipelineLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!contributionId) {
      setDetail(null);
      setPipelineJob(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchContribution(contributionId);
        if (!cancelled) {
          setDetail(data);
          setReviewNote("");
          setErrorMessage(null);
          setSuccessMessage(null);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setDetail(null);
          setSuccessMessage(null);
          setErrorMessage(error instanceof Error ? error.message : "Không thể tải chi tiết đóng góp.");
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

  useEffect(() => {
    if (!contributionId) {
      setPipelineJob(null);
      return;
    }

    let cancelled = false;

    const loadPipeline = async () => {
      setPipelineLoading(true);
      try {
        const data = await fetchLatestContributionPipeline(contributionId);
        if (!cancelled) {
          setPipelineJob(data);
        }
      } catch {
        if (!cancelled) {
          setPipelineJob(null);
        }
      } finally {
        if (!cancelled) {
          setPipelineLoading(false);
        }
      }
    };

    void loadPipeline();

    const interval = window.setInterval(() => {
      void loadPipeline();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [contributionId]);

  const assetCount = detail?.assets?.length ?? 0;
  const canApprove = assetCount > 0;

  const approvalHint = useMemo(() => {
    if (!detail || detail.status !== "pending") {
      return null;
    }

    if (canApprove) {
      return "Hồ sơ đã có asset metadata, expert có thể duyệt nếu thông tin hợp lệ.";
    }

    return "Chưa thể duyệt vì contribution chưa có asset metadata nào.";
  }, [canApprove, detail]);

  const handleReview = async (status: "approved" | "rejected") => {
    if (!detail) {
      return;
    }

    const trimmedNote = reviewNote.trim();
    if (status === "rejected" && trimmedNote.length < 5) {
      setErrorMessage("Vui lòng nhập lý do từ chối tối thiểu 5 ký tự.");
      setSuccessMessage(null);
      return;
    }

    if (status === "approved" && !canApprove) {
      setErrorMessage("Không thể duyệt contribution khi chưa có asset metadata.");
      setSuccessMessage(null);
      return;
    }

    setReviewing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await reviewContribution(detail.contributionId, {
        status,
        feedback: trimmedNote || undefined,
      });
      setDetail(updated);
      setSuccessMessage(
        status === "approved"
          ? "Đã duyệt contribution thành công."
          : "Đã từ chối contribution và lưu lý do thành công.",
      );
      setReviewNote("");
      const latestPipeline = await fetchLatestContributionPipeline(detail.contributionId).catch(() => null);
      setPipelineJob(latestPipeline);
      onReviewed?.();
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Cập nhật kết quả duyệt thất bại.");
    } finally {
      setReviewing(false);
    }
  };

  const renderAssetCard = (asset: ContributionAsset) => {
    const isImage = asset.mimeType?.startsWith("image/");
    const isPdf = asset.mimeType?.includes("pdf");
    const canPreview = isImage || isPdf;

    const handleDownload = async () => {
      try {
        const { ensureValidAccessToken } = await import("@/lib/session");
        const token = await ensureValidAccessToken();
        const CONTRIBUTION_BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_API ?? "http://localhost:3005";
        const res = await fetch(`${CONTRIBUTION_BASE_URL}/contributions/assets/${asset.assetId}/download-url`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Không lấy được đường dẫn tải xuống.");
        const { data } = (await res.json()) as { data: { url: string; fileName: string } };
        const a = document.createElement("a");
        a.href = data.url;
        a.download = data.fileName;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Tải xuống thất bại.");
      }
    };

    const handlePreview = async () => {
      try {
        const { ensureValidAccessToken } = await import("@/lib/session");
        const token = await ensureValidAccessToken();
        const CONTRIBUTION_BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_API ?? "http://localhost:3005";
        const res = await fetch(`${CONTRIBUTION_BASE_URL}/contributions/assets/${asset.assetId}/download-url`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error("Không lấy được đường dẫn xem trước.");
        const { data } = (await res.json()) as { data: { url: string; fileName: string } };
        window.open(data.url, "_blank", "noopener,noreferrer");
      } catch (err) {
        alert(err instanceof Error ? err.message : "Xem trước thất bại.");
      }
    };

    return (
      <div
        key={asset.assetId}
        className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            {isImage ? <FileImage className="w-4 h-4 text-gray-400" /> : <FileText className="w-4 h-4 text-gray-400" />}
            <div>
              <p className="text-sm font-medium text-gray-900 break-all">{asset.originalFileName}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {CONTRIBUTION_ASSET_TYPE_LABELS[asset.assetType]} · {asset.fileSize}
              </p>
            </div>
          </div>
          <Badge variant="warning">{CONTRIBUTION_ASSET_TYPE_LABELS[asset.assetType]}</Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {canPreview && (
            <button
              onClick={handlePreview}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Xem trước
            </button>
          )}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Tải xuống
          </button>
          <span className="text-xs text-gray-400 ml-auto">
            {new Date(asset.createdAt).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    );
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
        {errorMessage ?? "Không tìm thấy đóng góp"}
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
      <div className="p-4 space-y-4">
        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {approvalHint ? (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              canApprove
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{approvalHint}</span>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Mô tả</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {detail.description || "Không có mô tả."}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Tham chiếu</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {detail.reference || "Không có nguồn tham khảo."}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500">Pipeline xử lý</p>
              <p className="mt-1 text-sm text-gray-700">
                Theo dõi tiến trình tự động sau khi contribution được duyệt.
              </p>
            </div>
            {pipelineJob ? (
              <Badge variant={PIPELINE_STATUS_VARIANT[pipelineJob.status]}>
                {PIPELINE_STATUS_LABELS[pipelineJob.status]}
              </Badge>
            ) : detail.status === "approved" && pipelineLoading ? (
              <Badge variant="brand">
                <LoaderCircle className="mr-1 h-3.5 w-3.5 animate-spin" />
                Đang tải
              </Badge>
            ) : (
              <Badge variant="default">Chưa có job</Badge>
            )}
          </div>

          {pipelineJob ? (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-gray-500">Tiến độ</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{pipelineJob.progress}%</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Backend status</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{pipelineJob.backendStatus}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Job ID</p>
                <p className="mt-1 break-all text-sm text-gray-700">{pipelineJob.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Cập nhật lúc</p>
                <p className="mt-1 text-sm text-gray-700">
                  {new Date(pipelineJob.updatedAt).toLocaleString("vi-VN")}
                </p>
              </div>
              {pipelineJob.errorMessage ? (
                <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {pipelineJob.errorMessage}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-white px-3 py-3 text-sm text-gray-500">
              {detail.status === "approved"
                ? "Contribution đã duyệt nhưng worker chưa tạo hoặc chưa cập nhật pipeline job."
                : "Pipeline sẽ xuất hiện sau khi expert duyệt contribution."}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-100 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-gray-500">Tài liệu đính kèm</p>
              <p className="mt-1 text-sm text-gray-700">
                {assetCount > 0
                  ? `Có ${assetCount} tài liệu để expert thẩm định.`
                  : "Chưa có tài liệu nào được gửi kèm."}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              <Files className="h-3.5 w-3.5" />
              {assetCount} file
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {assetCount > 0 ? (
              detail.assets?.map((asset) => renderAssetCard(asset))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-sm text-gray-500 text-center">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>Chưa có tài liệu nào được gửi kèm contribution này.</p>
                <p className="text-xs text-gray-400 mt-1">Expert không thể duyệt nếu thiếu tài liệu.</p>
              </div>
            )}
          </div>
        </div>

        {detail.filePath ? (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 mb-1">File path gốc của hồ sơ</p>
            <p className="break-all text-sm text-gray-700">{detail.filePath}</p>
          </div>
        ) : null}

        {detail.feedback ? (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Nhận xét của chuyên gia
            </p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
              {detail.feedback}
            </p>
          </div>
        ) : null}
      </div>

      {/* Expert review actions — chỉ hiện cho expert + trạng thái pending */}
      {isExpert && isPending && (
        <div className="p-4 border-t border-gray-100 space-y-3">
          <div>
            <label
              htmlFor="review-feedback"
              className="text-xs font-medium text-gray-500 mb-1 block"
            >
              Lý do thẩm định / lý do từ chối
            </label>
            <textarea
              id="review-feedback"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Nhập nhận xét cho người đóng góp. Nếu từ chối, trường này là bắt buộc tối thiểu 5 ký tự."
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Khi từ chối, expert phải ghi rõ lý do. Khi duyệt, có thể để trống nếu không cần nhận xét thêm.
            </p>
          </div>

          {/* Debug info */}
          <div className="text-xs text-gray-400 mb-2">
            Status: {detail?.status} | EbookId: {detail?.ebookId || 'null'}
          </div>

          {/* Xuất bản ebook khi contribution đã duyệt và có ebook */}
          {detail?.status === "approved" && detail?.ebookId && (
            <div className="pt-3 border-t border-gray-100">
              <Button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('accessToken');
                    const res = await fetch(`${CATALOG_BASE_URL}/ebooks/${detail.ebookId}/publish`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                    });
                    if (!res.ok) throw new Error('Xuất bản thất bại.');
                    setSuccessMessage('Đã xuất bản ebook thành công.');
                    setDetail({ ...detail, ebook: { id: detail.ebookId!, isPublished: true } });
                  } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Xuất bản thất bại.');
                  }
                }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Xuất bản Ebook
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-3">
            <Button
              onClick={() => void handleReview("approved")}
              disabled={reviewing || !canApprove || detail?.status !== "pending"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Duyệt contribution
            </Button>
            <Button
              onClick={() => void handleReview("rejected")}
              disabled={reviewing || detail?.status !== "pending"}
              className="bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Từ chối contribution
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

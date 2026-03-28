import React from "react";
import { MoreHorizontal, Eye, MessageCircle, Star, Layers, Hash } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Document, DocStatus, RagStatus } from "@/types/document";
import { formatNumber } from "@/lib/utils";

interface DocCardProps {
  doc: Document;
}

// ─── helpers ───────────────────────────────
function getStatusVariant(status: DocStatus): "success" | "warning" | "error" | "default" {
  switch (status) {
    case "Đã xuất bản":      return "success";
    case "Đang kiểm duyệt":  return "warning";
    case "Lỗi embedding":    return "error";
    default:                  return "default";
  }
}

function getRagVariant(rag: RagStatus): "brand" | "default" | "error" {
  switch (rag) {
    case "Đã index RAG":  return "brand";
    case "Lỗi embedding": return "error";
    default:              return "default";
  }
}

const TYPE_ICON_COLORS: Record<string, string> = {
  "Bài thuốc":            "bg-emerald-100 text-emerald-600",
  "Dược liệu":            "bg-blue-100    text-blue-600",
  "Phương pháp":          "bg-violet-100  text-violet-600",
  "Kinh nghiệm lâm sàng": "bg-amber-100   text-amber-600",
};

/**
 * DocCard Component
 * Thẻ tài liệu dạng card hiển thị trong lưới — bao gồm:
 * checkbox, icon loại, nút 3-chấm, tiêu đề, tác giả, mô tả, tags, badges, footer metrics.
 */
export const DocCard = ({ doc }: DocCardProps) => {
  const iconColorClass = TYPE_ICON_COLORS[doc.type] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 accent-emerald-500 shrink-0"
            aria-label={`Chọn tài liệu ${doc.title}`}
          />
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColorClass} shrink-0`}>
            <Layers size={18} />
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Title + author */}
      <div className="px-4 pb-2">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
          {doc.title}
        </h3>
        <p className="text-xs text-gray-400 truncate">{doc.author}</p>
      </div>

      {/* Description */}
      <div className="px-4 pb-3 flex-1">
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {doc.description}
        </p>
      </div>

      {/* Tags */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {doc.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600"
          >
            <Hash size={9} />
            {tag}
          </span>
        ))}
        {doc.tags.length > 3 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-400">
            +{doc.tags.length - 3}
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
          {doc.type}
        </span>
        <Badge variant={getStatusVariant(doc.status)} className="text-[10px]">
          {doc.status}
        </Badge>
        <Badge variant={getRagVariant(doc.ragStatus)} className="text-[10px]">
          {doc.ragStatus}
        </Badge>
      </div>

      {/* Footer metrics */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Eye size={12} />
          {formatNumber(doc.metrics.views)}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={12} />
          {formatNumber(doc.metrics.queries)}
        </span>
        <span className="flex items-center gap-1">
          <Star size={12} className="text-yellow-400" />
          {doc.metrics.rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1 ml-auto font-medium text-gray-500">
          <Layers size={12} />
          {doc.chunks} chunks
        </span>
      </div>
    </div>
  );
};

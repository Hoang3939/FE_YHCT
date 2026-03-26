import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type {
  Feedback, FeedbackType, FeedbackPriority, FeedbackStatus
} from "@/types/feedback";
import { ChevronUp, Hash } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_ICON_MAP: Record<FeedbackType, { label: string; icon: string; cls: string }> = {
  "Báo lỗi":   { label: "Báo lỗi",   icon: "⊗", cls: "text-red-500   bg-red-50   border-red-100"     },
  "Đề xuất":   { label: "Đề xuất",   icon: "◈", cls: "text-violet-500 bg-violet-50 border-violet-100" },
  "Bổ sung":   { label: "Bổ sung",   icon: "⊕", cls: "text-blue-500  bg-blue-50  border-blue-100"     },
  "Chỉnh sửa": { label: "Chỉnh sửa", icon: "△", cls: "text-orange-500 bg-orange-50 border-orange-100" },
  "Câu hỏi":   { label: "Câu hỏi",   icon: "◎", cls: "text-cyan-500  bg-cyan-50  border-cyan-100"     },
};

const PRIORITY_MAP: Record<FeedbackPriority, { cls: string }> = {
  "Cao":       { cls: "bg-red-100    text-red-600"    },
  "Trung bình":{ cls: "bg-yellow-100 text-yellow-700" },
  "Thấp":      { cls: "bg-gray-100   text-gray-500"   },
};

const STATUS_MAP: Record<FeedbackStatus, "success" | "warning" | "error" | "default"> = {
  "Đã duyệt":      "success",
  "Đang xem xét":  "default",
  "Chờ duyệt":     "warning",
  "Từ chối":       "error",
};

const ROLE_CLS: Record<string, string> = {
  "Chuyên gia":      "bg-blue-100  text-blue-700",
  "Người dùng":      "bg-gray-100  text-gray-600",
  "Thầy thuốc":      "bg-violet-100 text-violet-700",
  "Nhà nghiên cứu":  "bg-teal-100  text-teal-700",
  "Nhà dược":        "bg-indigo-100 text-indigo-700",
};

/** Format ISO string → HH:MM DD-MM */
function formatDate(iso: string): { time: string; date: string } {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return { time: `${hh}:${mm}`, date: `${day}-${month}` };
}

interface FeedbackRowProps {
  feedback: Feedback;
  onClick: (id: string) => void;
  selected: boolean;
}

/**
 * FeedbackRow Component
 * Một hàng trong bảng danh sách góp ý — chứa: ID, tiêu đề + tác giả đầy đủ,
 * loại, ưu tiên, trạng thái, thời gian, upvotes.
 * Đây là component phức tạp nhất trong module, mỗi cell có quy tắc styling riêng.
 */
export const FeedbackRow = ({ feedback, onClick, selected }: FeedbackRowProps) => {
  const type = TYPE_ICON_MAP[feedback.type];
  const priority = PRIORITY_MAP[feedback.priority];
  const status = STATUS_MAP[feedback.status];
  const { time, date } = formatDate(feedback.createdAt);
  const roleCls = ROLE_CLS[feedback.author.role] ?? "bg-gray-100 text-gray-600";

  // Xác định variant status — "Đang xem xét" dùng inline vì Badge không có 'brand'
  const statusIsReviewing = feedback.status === "Đang xem xét";

  return (
    <tr
      onClick={() => onClick(feedback.id)}
      className={`border-b border-gray-50 cursor-pointer transition-colors ${
        selected ? "bg-emerald-50/60" : "hover:bg-gray-50/70"
      }`}
    >
      {/* ID */}
      <td className="py-3 px-3 text-[11px] text-gray-400 font-mono whitespace-nowrap align-top pt-4">
        {feedback.id}
      </td>

      {/* Tiêu đề / Tác giả */}
      <td className="py-3 px-3 max-w-[280px] align-top">
        {/* Title */}
        <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
          {feedback.title}
        </p>

        {/* Author row */}
        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
          <Avatar initials={feedback.author.initials} colorClass={feedback.author.avatarColor} size="sm" />
          <span className="text-[11px] text-gray-600 font-medium">{feedback.author.name}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleCls}`}>
            {feedback.author.role}
          </span>
        </div>

        {/* Related entity */}
        <p className="text-[11px] text-emerald-600 font-medium truncate mb-1.5" title={feedback.relatedEntity}>
          {feedback.relatedEntity}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {feedback.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-0.5 text-[10px] text-gray-400">
              <Hash size={9} />{tag.replace("#", "")}
            </span>
          ))}
        </div>
      </td>

      {/* Loại */}
      <td className="py-3 px-3 align-top pt-4">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${type.cls}`}>
          <span>{type.icon}</span>
          {type.label}
        </span>
      </td>

      {/* Ưu tiên */}
      <td className="py-3 px-3 align-top pt-4">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${priority.cls}`}>
          {feedback.priority}
        </span>
      </td>

      {/* Trạng thái */}
      <td className="py-3 px-3 align-top pt-4">
        {statusIsReviewing ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Đang xem xét
          </span>
        ) : (
          <Badge variant={status} className="text-[11px]">
            {feedback.status}
          </Badge>
        )}
      </td>

      {/* Thời gian */}
      <td className="py-3 px-3 text-[11px] text-gray-500 align-top pt-4 whitespace-nowrap">
        <p className="font-medium">{time}</p>
        <p className="text-gray-400">{date}-03</p>
      </td>

      {/* Upvotes */}
      <td className="py-3 px-3 align-top pt-4">
        <span className="flex items-center gap-1 text-xs font-bold text-gray-700">
          <ChevronUp size={13} className="text-emerald-500" />
          {feedback.upvotes}
        </span>
      </td>
    </tr>
  );
};

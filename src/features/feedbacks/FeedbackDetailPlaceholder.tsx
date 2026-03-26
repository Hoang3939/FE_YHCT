import React from "react";
import { MessageSquareDashed } from "lucide-react";

/**
 * FeedbackDetailPlaceholder Component
 * Cột phải trong split-view — hiển thị khi chưa có góp ý nào được chọn
 */
export const FeedbackDetailPlaceholder = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full min-h-[500px] flex flex-col items-center justify-center gap-3">
    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
      <MessageSquareDashed size={28} className="text-gray-300" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-gray-400">Chọn một góp ý để xem chi tiết</p>
      <p className="text-xs text-gray-300 mt-1">Nhấn vào bất kỳ hàng nào trong danh sách</p>
    </div>
  </div>
);

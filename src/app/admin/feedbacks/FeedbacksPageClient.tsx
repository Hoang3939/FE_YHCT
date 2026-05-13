"use client";

import React, { useState } from "react";
import { MessageSquareHeart, FileUp, MailCheck, BadgeCheck, BellRing } from "lucide-react";
import { FeedbackSummaryCards } from "@/features/feedbacks/FeedbackSummaryCards";
import { FeedbackStatusBar } from "@/features/feedbacks/FeedbackStatusBar";
import { FeedbackList } from "@/features/feedbacks/FeedbackList";
import { FeedbackDetailPlaceholder } from "@/features/feedbacks/FeedbackDetailPlaceholder";

/**
 * FeedbacksPageClient
 * Client component lắp ráp toàn bộ trang Góp ý hệ thống.
 * Layout bố cục:
 *   1. FeedbackSummaryCards  (6 thẻ thống kê)
 *   2. FeedbackStatusBar     (thanh nền tối ONLINE)
 *   3. Split View 65/35:
 *      - FeedbackList        (danh sách, search, tabs, sort)
 *      - FeedbackDetailPlaceholder (placeholder cột phải)
 */
const FeedbacksPageClient = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
      <section className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <BadgeCheck size={14} />
              Quy trình tiếp nhận cộng đồng
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">Phân tách rõ Góp ý nhanh và Đóng góp có xét duyệt</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Trang này dành cho góp ý hệ thống: người dùng gửi phản hồi nhanh và nhận toast cảm ơn ngay. Các nội dung cần đính kèm tài liệu,
              chờ chuyên gia xét duyệt và gửi email phản hồi sẽ đi theo flow Đóng góp riêng.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:w-[520px]">
            <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700">
                <MessageSquareHeart size={18} />
                <h3 className="text-sm font-semibold">Góp ý</h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Không yêu cầu tệp đính kèm</li>
                <li>• Phù hợp lỗi UI/UX, câu hỏi, đề xuất nhanh</li>
                <li>• Người gửi chỉ nhận toast cảm ơn</li>
              </ul>
            </div>
            <div className="rounded-xl border border-cyan-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-cyan-700">
                <FileUp size={18} />
                <h3 className="text-sm font-semibold">Đóng góp</h3>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Bắt buộc có tệp đính kèm</li>
                <li>• Chờ expert xét duyệt trước khi áp dụng</li>
                <li>• Có email phản hồi sau khi nộp/xét duyệt</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Row 1: Stats */}
      <FeedbackSummaryCards />
 
      {/* Row 2: Status bar */}
      <FeedbackStatusBar />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <BellRing size={16} className="text-amber-500" />
            Phản hồi tức thời cho người gửi góp ý
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Sau khi gửi góp ý, giao diện chỉ cần hiển thị toast cảm ơn. Không yêu cầu thêm bước phê duyệt hay email xác nhận như flow Đóng góp.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MailCheck size={16} className="text-emerald-500" />
            Email thuộc flow Đóng góp
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Khi người dùng gửi tài liệu hoặc nội dung chuyên môn có file đính kèm, hệ thống cần chuyển sang flow Đóng góp và gửi email xác nhận/nhận kết quả duyệt.
          </p>
        </div>
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <BadgeCheck size={16} />
            Quy tắc cho expert
          </div>
          <p className="mt-2 text-sm leading-6 text-red-700/90">
            Nếu từ chối một đóng góp, chuyên gia bắt buộc phải nêu lý do rõ ràng để người gửi có thể chỉnh sửa và nộp lại.
          </p>
        </div>
      </section>
 
      {/* Row 3: Split View */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[65%_35%]">
        {/* Left: List */}
        <FeedbackList selectedId={selectedId} onSelect={setSelectedId} />
 
        {/* Right: Detail placeholder */}
        <FeedbackDetailPlaceholder />
      </div>
    </div>
  );
};

export default FeedbacksPageClient;

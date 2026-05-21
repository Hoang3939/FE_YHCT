"use client";

import React from "react";
import { Settings, Hexagon, CheckCircle2, XCircle } from "lucide-react";

const SERVICES = [
  { name: "API Server", status: "Ổn định", color: "bg-emerald-500", textColor: "text-emerald-600" },
  { name: "Pipeline Service", status: "Đang polling", color: "bg-emerald-500", textColor: "text-emerald-600" },
  { name: "Vector DB", status: "Ổn định", color: "bg-emerald-500", textColor: "text-emerald-600" },
  { name: "LLM Gateway", status: "Cần kiểm tra", color: "bg-amber-400", textColor: "text-amber-600" },
] as const;

const MENU_ITEMS = [
  { id: "general", label: "Tổng quát", icon: Hexagon, description: "Tên hệ thống, múi giờ, giới hạn phiên." },
  { id: "engine", label: "RAG Engine", icon: Settings, description: "Cấu hình model AI, temperature, top-k." },
] as const;

export const SettingsSidebar = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 px-1">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Settings size={16} className="text-emerald-500" />
            Cấu hình hệ thống
          </h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">Tinh gọn theo đúng scope hiện có của nền tảng Y-RAG.</p>
        </div>

        <div className="grid gap-2">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isPrimary = index === 0;
            return (
              <div
                key={item.id}
                className={`rounded-xl border px-4 py-3 transition-colors ${
                  isPrimary ? "border-emerald-200 bg-emerald-50/70" : "border-gray-200 bg-gray-50/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isPrimary ? "bg-emerald-100 text-emerald-600" : "bg-white text-gray-500"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${isPrimary ? "text-emerald-700" : "text-gray-900"}`}>{item.label}</p>
                    <p className="text-xs leading-5 text-gray-500">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-gray-400">Trạng thái dịch vụ</p>
        <div className="space-y-3 text-sm">
          {SERVICES.map((service) => (
            <div key={service.name} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-3">
              <div>
                <p className="font-medium text-gray-800">{service.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${service.color}`} />
                <span className={`text-xs font-semibold ${service.textColor}`}>{service.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-6 text-gray-500">
          <div className="flex items-center gap-2 text-gray-700">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Admin settings hiện được rút gọn để tránh giữ các tab placeholder không dùng thực tế.
          </div>
          <div className="mt-2 flex items-center gap-2 text-gray-700">
            <XCircle size={14} className="text-amber-500" />
            Các cấu hình nâng cao sẽ chỉ mở lại khi backend tương ứng đã sẵn sàng.
          </div>
        </div>
      </div>
    </div>
  );
};

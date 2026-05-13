"use client";

import { useState } from "react";
import { SettingsSidebar } from "@/features/settings/SettingsSidebar";
import { GeneralSettingsForm } from "@/features/settings/GeneralSettingsForm";

/**
 * SettingsPageClient
 * Client component lắp ráp toàn bộ trang Cấu hình hệ thống.
 * Split View Layout:
 *   - Trái (25%): SettingsSidebar (Menu Cấu hình, Trạng thái API)
 *   - Phải (75%): Form Cấu hình tương ứng với Menu
 */
const SettingsPageClient = () => {
  const [activeTab, setActiveTab] = useState<string>("general");

  return (
    <div className="mx-auto flex max-w-[1600px] min-w-0 flex-col gap-6">
      {/* Split View */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Left Sidebar */}
        <div className="min-w-0 xl:sticky xl:top-24">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Right Content Form */}
        <div className="min-w-0">
          {activeTab === "general" && <GeneralSettingsForm />}

          {/* Placeholder cho các tab khác */}
          {activeTab !== "general" && (
            <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-400 shadow-sm sm:min-h-[384px]">
              <p>Màn hình cấu hình "{activeTab}" đang được phát triển...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPageClient;

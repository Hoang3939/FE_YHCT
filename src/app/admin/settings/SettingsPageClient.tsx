"use client";

import React, { useState } from "react";
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
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sidebar (25%) */}
        <div className="lg:col-span-1">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Right Content Form (75%) */}
        <div className="lg:col-span-3">
          {activeTab === "general" && <GeneralSettingsForm />}
          
          {/* Placeholder cho các tab khác */}
          {activeTab !== "general" && (
            <div className="bg-white rounded-xl border border-gray-200 h-96 flex items-center justify-center text-gray-400">
              <p>Màn hình cấu hình "{activeTab}" đang được phát triển...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPageClient;

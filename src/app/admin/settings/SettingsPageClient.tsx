"use client";

import React from "react";
import { SettingsSidebar } from "@/features/settings/SettingsSidebar";
import { GeneralSettingsForm } from "@/features/settings/GeneralSettingsForm";
import { ChangePasswordForm } from "@/features/settings/ChangePasswordForm";

const SettingsPageClient = () => {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
        <div>
          <SettingsSidebar />
        </div>

        <div className="min-w-0 flex flex-col gap-8">
          <GeneralSettingsForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default SettingsPageClient;

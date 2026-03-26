"use client";

import React, { useState } from "react";
import { Globe, ShieldCheck, Activity, Save, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { SettingSectionCard, FormRow } from "@/features/settings/SettingSectionCard";
import { 
  INITIAL_CONFIG, 
  LANGUAGES, 
  TIMEZONES, 
  DATE_FORMATS 
} from "@/types/settings";
import type { SystemConfig } from "@/types/settings";

/**
 * GeneralSettingsForm Component
 * Layout cột phải chứa các section form cấu hình (General Tab)
 */
export const GeneralSettingsForm = () => {
  const [config, setConfig] = useState<SystemConfig>(INITIAL_CONFIG);

  const handleChange = (key: keyof SystemConfig, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Globe size={18} className="text-emerald-600" />
          </div>
          Tổng quát
        </h2>
        <p className="text-sm text-gray-500 mt-1">Cấu hình phân hệ tổng quát</p>
      </div>

      {/* 1. Thông tin hệ thống */}
      <SettingSectionCard 
        title="Thông tin hệ thống" 
        icon={<Globe size={16} />} 
      >
        <FormRow label="Tên hệ thống" description="Hiển thị trên giao diện và email">
          <Input 
            value={config.systemName} 
            onChange={(e) => handleChange("systemName", e.target.value)}
          />
        </FormRow>

        <FormRow label="Mô tả" description="Mô tả ngắn về hệ thống">
          <Input 
            value={config.description} 
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </FormRow>

        <FormRow label="Ngôn ngữ mặc định">
          <Select 
            options={LANGUAGES} 
            value={config.defaultLanguage}
            onChange={(val) => handleChange("defaultLanguage", val)}
          />
        </FormRow>

        <FormRow label="Múi giờ">
          <Select 
            options={TIMEZONES} 
            value={config.timezone}
            onChange={(val) => handleChange("timezone", val)}
          />
        </FormRow>

        <FormRow label="Định dạng ngày tháng">
          <Select 
            options={DATE_FORMATS} 
            value={config.dateFormat}
            onChange={(val) => handleChange("dateFormat", val)}
          />
        </FormRow>
      </SettingSectionCard>

      {/* 2. Giới hạn & Hiệu suất */}
      <SettingSectionCard 
        title="Giới hạn & Hiệu suất" 
        icon={<Activity size={16} />} 
      >
        <FormRow label="Số người dùng tối đa" description="0 = Không giới hạn">
          <Input 
            type="number"
            value={config.maxUsers} 
            onChange={(e) => handleChange("maxUsers", Number(e.target.value))}
          />
        </FormRow>

        <FormRow label="Session timeout (phút)" description="Tự động đăng xuất sau thời gian không hoạt động">
          <Input 
            type="number"
            value={config.sessionTimeout} 
            onChange={(e) => handleChange("sessionTimeout", Number(e.target.value))}
          />
        </FormRow>
      </SettingSectionCard>

      {/* 3. Chế độ vận hành */}
      <SettingSectionCard 
        title="Chế độ vận hành" 
        icon={<ShieldCheck size={16} />} 
      >
        <FormRow label="Chế độ bảo trì" description="Tạm ngưng hệ thống để bảo trì. Chỉ Admin mới có thể truy cập.">
          <Switch 
            checked={config.maintenanceMode}
            onChange={(val) => handleChange("maintenanceMode", val)}
          />
        </FormRow>

        <FormRow label="Chế độ Debug" description="Ghi log chi tiết. Không sử dụng trên môi trường Production.">
          <Switch 
            checked={config.debugMode}
            onChange={(val) => handleChange("debugMode", val)}
          />
        </FormRow>
        
        <FormRow label="Thu thập Analytics" description="Theo dõi hành vi người dùng để cải thiện hệ thống.">
          <Switch 
            checked={config.analyticsEnabled}
            onChange={(val) => handleChange("analyticsEnabled", val)}
          />
        </FormRow>
      </SettingSectionCard>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" className="gap-2" onClick={handleReset}>
          <RotateCcw size={16} /> Đặt lại mặc định
        </Button>
        <Button variant="default" className="gap-2 px-6">
          <Save size={16} /> Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

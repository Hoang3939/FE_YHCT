"use client";

import React, { useState, useEffect } from "react";
import { Globe, ShieldCheck, Bot, Save, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { SettingSectionCard, FormRow } from "@/features/settings/SettingSectionCard";
import { 
  INITIAL_CONFIG, 
  INITIAL_RAG_CONFIG,
  LANGUAGES, 
  TIMEZONES, 
  DATE_FORMATS,
  MODEL_OPTIONS
} from "@/types/settings";
import type { SystemConfig, RagConfig } from "@/types/settings";
import { useToast } from "@/components/toast/ToastContext";

const SYSCONFIG_BASE = process.env.NEXT_PUBLIC_SYSCONFIG_BASE_URL || "http://localhost:3008";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
}

interface RawConfig { id: number; configKey: string; configValue: string }

/**
 * GeneralSettingsForm Component
 * Layout cột phải chứa các section form cấu hình (General Tab)
 */
export const GeneralSettingsForm = () => {
  const { showToast } = useToast();
  const [config, setConfig] = useState<SystemConfig>(INITIAL_CONFIG);
  const [ragConfig, setRagConfig] = useState<RagConfig>(INITIAL_RAG_CONFIG);
  const [rawConfigs, setRawConfigs] = useState<RawConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${SYSCONFIG_BASE}/sysconfig`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as RawConfig[];
        setRawConfigs(data);

        const get = (key: string) => data.find((d) => d.configKey === key)?.configValue;
        setConfig({
          systemName:      get("SystemName")      ?? INITIAL_CONFIG.systemName,
          defaultLanguage: get("DefaultLanguage") ?? INITIAL_CONFIG.defaultLanguage,
          timezone:        get("Timezone")        ?? INITIAL_CONFIG.timezone,
          dateFormat:      get("DateFormat")      ?? INITIAL_CONFIG.dateFormat,
          maintenanceMode: get("MaintenanceMode") === "true",
        });
        setRagConfig({
          modelName:    get("RAG_ModelName")    ?? INITIAL_RAG_CONFIG.modelName,
          temperature:  Number(get("RAG_Temperature") ?? INITIAL_RAG_CONFIG.temperature),
          maxTokens:    Number(get("RAG_MaxTokens")   ?? INITIAL_RAG_CONFIG.maxTokens),
          topK:         Number(get("RAG_TopK")        ?? INITIAL_RAG_CONFIG.topK),
          chunkSize:    Number(get("RAG_ChunkSize")   ?? INITIAL_RAG_CONFIG.chunkSize),
          chunkOverlap: Number(get("RAG_ChunkOverlap") ?? INITIAL_RAG_CONFIG.chunkOverlap),
        });
      } catch {
        showToast("Không tải được cấu hình — dùng giá trị mặc định", "error");
      } finally {
        setLoading(false);
      }
    };
    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: keyof SystemConfig, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleRagChange = (key: keyof RagConfig, value: unknown) => {
    setRagConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
    setRagConfig(INITIAL_RAG_CONFIG);
  };

  const handleSave = async () => {
    setSaving(true);
    const merged: Record<string, string> = {
      SystemName:        config.systemName,
      DefaultLanguage:   config.defaultLanguage,
      Timezone:          config.timezone,
      DateFormat:        config.dateFormat,
      MaintenanceMode:   String(config.maintenanceMode),
      RAG_ModelName:     ragConfig.modelName,
      RAG_Temperature:   String(ragConfig.temperature),
      RAG_MaxTokens:     String(ragConfig.maxTokens),
      RAG_TopK:          String(ragConfig.topK),
      RAG_ChunkSize:     String(ragConfig.chunkSize),
      RAG_ChunkOverlap:  String(ragConfig.chunkOverlap),
    };

    try {
      const token = getToken();
      const results = await Promise.allSettled(
        Object.entries(merged).map(([key, value]) => {
          const row = rawConfigs.find((r) => r.configKey === key);
          if (!row) return Promise.resolve();
          return fetch(`${SYSCONFIG_BASE}/sysconfig/${row.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ configValue: value }),
          });
        })
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        showToast(`Lưu thành công (${results.length - failed}/${results.length} mục)`, "success");
      } else {
        showToast("Đã lưu cấu hình thành công", "success");
      }
    } catch {
      showToast("Lưu cấu hình thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-5">
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-4" />
            {[...Array(3)].map((__, j) => (
              <div key={j} className="h-10 bg-gray-50 rounded animate-pulse mb-3" />
            ))}
          </div>
        ))}
      </div>
    );
  }

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

      {/* 2. RAG Engine Configuration */}
      <SettingSectionCard 
        title="Cấu hình RAG Engine" 
        icon={<Bot size={16} />} 
      >
        <FormRow label="Model AI" description="Model sử dụng cho chat">
          <Select 
            options={MODEL_OPTIONS} 
            value={ragConfig.modelName}
            onChange={(val) => handleRagChange("modelName", val)}
          />
        </FormRow>

        <FormRow label="Temperature" description="Độ sáng tạo (0.0 - 1.0). Cao = sáng tạo hơn, Thấp = chính xác hơn.">
          <Input 
            type="number"
            min={0}
            max={1}
            step={0.1}
            value={ragConfig.temperature} 
            onChange={(e) => handleRagChange("temperature", Number(e.target.value))}
          />
        </FormRow>

        <FormRow label="Max Tokens" description="Số token tối đa cho mỗi phản hồi">
          <Input 
            type="number"
            min={256}
            max={8192}
            step={256}
            value={ragConfig.maxTokens} 
            onChange={(e) => handleRagChange("maxTokens", Number(e.target.value))}
          />
        </FormRow>

        <FormRow label="Top K" description="Số tài liệu liên quan lấy từ Vector DB (1-20)">
          <Input 
            type="number"
            min={1}
            max={20}
            value={ragConfig.topK} 
            onChange={(e) => handleRagChange("topK", Number(e.target.value))}
          />
        </FormRow>

        <FormRow label="Chunk Size" description="Kích thước đoạn văn bản chunk (tokens)">
          <Input 
            type="number"
            min={128}
            max={2048}
            step={64}
            value={ragConfig.chunkSize} 
            onChange={(e) => handleRagChange("chunkSize", Number(e.target.value))}
          />
        </FormRow>

        <FormRow label="Chunk Overlap" description="Độ chồng lấn giữa các chunk">
          <Input 
            type="number"
            min={0}
            max={256}
            step={16}
            value={ragConfig.chunkOverlap} 
            onChange={(e) => handleRagChange("chunkOverlap", Number(e.target.value))}
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

      </SettingSectionCard>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" className="gap-2" onClick={handleReset} disabled={saving}>
          <RotateCcw size={16} /> Đặt lại mặc định
        </Button>
        <Button variant="default" className="gap-2 px-6" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
};

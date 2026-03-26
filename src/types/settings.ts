export interface SystemConfig {
  systemName: string;
  description: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  maxUsers: number;
  sessionTimeout: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  analyticsEnabled: boolean;
}

// ─── Constants & Mock Data cho Form Selects ─────────────────────────────────

export const LANGUAGES = [
  { value: "vi-VN", label: "Tiếng Việt" },
  { value: "en-US", label: "English" },
];

export const TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho_Chi_Minh (UTC+7)" },
  { value: "UTC",              label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New_York (UTC-5)" },
];

export const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const INITIAL_CONFIG: SystemConfig = {
  systemName: "DượcThảo AI",
  description: "Hệ thống quản lý tri thức và truy xuất bài thuốc cổ truyền Việt Nam ứng dụng AI (RAG)",
  defaultLanguage: "vi-VN",
  timezone: "Asia/Ho_Chi_Minh",
  dateFormat: "DD/MM/YYYY",
  maxUsers: 5000,
  sessionTimeout: 30, // in minutes
  maintenanceMode: false,
  debugMode: false,
  analyticsEnabled: true,
};

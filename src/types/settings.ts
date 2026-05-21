export interface SystemConfig {
  systemName: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  maintenanceMode: boolean;
}

export interface RagConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  topK: number;
  chunkSize: number;
  chunkOverlap: number;
}

export interface SystemStatus {
  version: string;
  vectorDbStatus: 'connected' | 'disconnected' | 'error';
  vectorDbUsagePercent: number;
  lastBackupDate: string;
  apiStatus: 'operational' | 'degraded' | 'down';
}

// ─── Constants & Mock Data cho Form Selects ─────────────────────────────────

export const LANGUAGES = [
  { value: "vi-VN", label: "Tiếng Việt" },
  { value: "en-US", label: "English" },
];

export const TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho_Chi_Minh (UTC+7)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New_York (UTC-5)" },
];

export const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const INITIAL_CONFIG: SystemConfig = {
  systemName: "DượcThảo AI",
  defaultLanguage: "vi-VN",
  timezone: "Asia/Ho_Chi_Minh",
  dateFormat: "DD/MM/YYYY",
  maintenanceMode: false,
};

export const INITIAL_RAG_CONFIG: RagConfig = {
  modelName: "gemma4-4b",
  temperature: 0.7,
  maxTokens: 2048,
  topK: 5,
  chunkSize: 512,
  chunkOverlap: 50,
};

export const MODEL_OPTIONS = [
  { value: "gemma4-4b", label: "Gemma 4 (4B)" },
  { value: "gemma4-9b", label: "Gemma 4 (9B)" },
  { value: "qwen2.5-7b", label: "Qwen 2.5 (7B)" },
  { value: "llama3.1-8b", label: "Llama 3.1 (8B)" },
];

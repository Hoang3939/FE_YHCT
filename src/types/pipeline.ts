/**
 * Định nghĩa các type và interface cho module Vận hành Pipeline RAG.
 */

// ─── Enums / Unions ───────────────────────────────────────────────────────────

export type JobStatus   = "running" | "queued" | "success" | "failed" | "paused";
export type LogLevel    = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "DEBUG";
export type WorkerState = "active" | "idle" | "error" | "offline";
export type StepStatus  = "done" | "active" | "pending" | "error";
export type JobType = "batch_import" | "crawl" | "re_embed" | "manual" | "contribution_queue";

// ─── Interfaces ───────────────────────────────────────────────────────────────

/** Bước xử lý trong sơ đồ pipeline */
export interface PipelineStep {
  id: string;
  label: string;
  sublabel: string;
  status: StepStatus;
  icon: string; // Lucide icon name — rendered in component
}

/** Một job trong hàng chờ xử lý */
export interface Job {
  id: string;
  name: string;
  type: JobType;
  status: JobStatus;
  /** 0-100 */
  progress: number;
  workerId: string;
  docsTotal: number;
  docsProcessed: number;
  chunksGenerated: number;
  startedAt?: string | null;
  estimatedEnd?: string | null;
  createdAt?: string;
  updatedAt?: string;
  backendStatus?: string;
  currentStep?: string | null;
  fileName?: string | null;
  errorMessage?: string | null;
}

/** Worker node đang chạy */
export interface WorkerNode {
  id: string;
  name: string;
  state: WorkerState;
  cpuUsage: number;   // 0-100
  ramUsage: number;   // 0-100
  activeJobs: number;
  jobsToday: number;
}

/** Dòng log trong terminal */
export interface LogEntry {
  id: string;
  timestamp: string; // HH:MM:SS
  level: LogLevel;
  message: string;
}

/** Thống kê tổng quan pipeline */
export interface PipelineStats {
  jobsToday: number;
  completed: number;
  failed: number;
  queued: number;
  chunksCreated: number;
  tokensProcessed: string; // vd: "2.4M"
  avgTimeSeconds: number;
  successRate: number;     // 0-100
}

/** Điểm dữ liệu cho biểu đồ throughput */
export interface ThroughputPoint {
  time: string;
  chunks: number;
  tokens: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const DEFAULT_PIPELINE_STEPS: PipelineStep[] = [
  { id: "collect", label: "Thu thập", sublabel: "Nhận tài liệu", status: "pending", icon: "Download" },
  { id: "analyze", label: "Làm sạch", sublabel: "Tiền xử lý", status: "pending", icon: "Braces" },
  { id: "segment", label: "Phân đoạn", sublabel: "Chunking", status: "pending", icon: "Scissors" },
  { id: "vectorize", label: "Vector hóa", sublabel: "Embedding", status: "pending", icon: "Layers" },
  { id: "store", label: "Lưu trữ", sublabel: "Vector DB", status: "pending", icon: "Database" },
  { id: "verify", label: "Hoàn tất", sublabel: "Kiểm tra & xuất bản", status: "pending", icon: "ShieldCheck" },
];

export const MOCK_WORKERS: WorkerNode[] = [
  { id: "W1",   name: "Pipeline Worker #1", state: "active",  cpuUsage: 78, ramUsage: 62, activeJobs: 2, jobsToday: 11 },
  { id: "W2",   name: "Pipeline Worker #2", state: "active",  cpuUsage: 54, ramUsage: 48, activeJobs: 1, jobsToday:  8 },
  { id: "SCH",  name: "Scheduler Service",  state: "idle",    cpuUsage:  8, ramUsage: 24, activeJobs: 0, jobsToday:  5 },
];

export const MOCK_LOGS: LogEntry[] = [
  { id: "L1",  timestamp: "07:08:42", level: "INFO",    message: "[JOB-001] Batch 1/6 - 72/142 chunks đang xử lý, vector hóa qua text-embedding-3-small" },
  { id: "L2",  timestamp: "07:08:39", level: "SUCCESS", message: "[JOB-003] Chunk #412 đã lưu vào vector DB — similarity score: 0.91" },
  { id: "L3",  timestamp: "07:08:35", level: "INFO",    message: "[W1] CPU 78% — RAM 62% — 2 jobs đang chạy song song" },
  { id: "L4",  timestamp: "07:08:30", level: "INFO",    message: "[JOB-002] OCR trang 10/22 — confidence avg: 94.3%" },
  { id: "L5",  timestamp: "07:08:21", level: "WARNING", message: "[JOB-002] Trang 9 OCR confidence thấp (71%) — đã đánh dấu để review thủ công" },
  { id: "L6",  timestamp: "07:08:10", level: "SUCCESS", message: "[JOB-001] Chunk 71/142 embedding hoàn thành — 0.84s/chunk avg" },
  { id: "L7",  timestamp: "07:07:55", level: "INFO",    message: "[SCHEDULER] Queue depth: 2 jobs — ước tính 18 phút để hết queue" },
  { id: "L8",  timestamp: "07:07:40", level: "ERROR",   message: "[JOB-006] Lỗi kết nối Pinecone API (timeout 30s) — job đã được đánh dấu FAILED" },
  { id: "L9",  timestamp: "07:07:30", level: "INFO",    message: "[W2] Job JOB-006 thất bại — worker chuyển sang trạng thái idle, nhận JOB-003" },
  { id: "L10", timestamp: "07:07:10", level: "SUCCESS", message: "[JOB-003] Re-embedding bắt đầu — 412 chunks được nạp vào pipeline" },
];

export const MOCK_THROUGHPUT: ThroughputPoint[] = [
  { time: "06:00", chunks: 45,  tokens: 1820 },
  { time: "06:10", chunks: 72,  tokens: 2940 },
  { time: "06:20", chunks: 58,  tokens: 2310 },
  { time: "06:30", chunks: 91,  tokens: 3710 },
  { time: "06:40", chunks: 63,  tokens: 2540 },
  { time: "06:50", chunks: 112, tokens: 4480 },
  { time: "07:00", chunks: 134, tokens: 5260 },
  { time: "07:08", chunks: 118, tokens: 4720 },
];

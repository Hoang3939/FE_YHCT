/**
 * Định nghĩa các type và interface cho module Duyệt đóng góp (Contributions).
 * Mapping 1:1 với KnowledgeContribution entity trên BE.
 */

export type ContributionType = "medicine" | "herb" | "document";
export type ContributionStatus = "pending" | "approved" | "rejected";
export type ContributionAssetType = "pdf" | "docx" | "image" | "zip" | "other";
export type ContributionPipelineStatus = "queued" | "running" | "success" | "failed" | null;

export interface ContributionPipelineJob {
  id: string;
  contributionId: string | null;
  processingType: string;
  backendStatus: "pending_approval" | "pending" | "processing" | "completed" | "failed";
  status: Exclude<ContributionPipelineStatus, null>;
  progress: number;
  fileName: string | null;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface ContributionAsset {
  assetId: string;
  contributionId: string;
  originalFileName: string;
  storedFilePath: string;
  mimeType: string;
  fileSize: string;
  checksum: string | null;
  assetType: ContributionAssetType;
  createdAt: string;
}

export interface KnowledgeContribution {
  contributionId: string;
  userId: string;
  title: string;
  description: string | null;
  contributionType: ContributionType;
  status: ContributionStatus;
  filePath: string | null;
  reference: string | null;
  feedback: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewerId: string | null;
  assets?: ContributionAsset[];
  ebookId?: string | null;
  ebook?: {
    id: string;
    isPublished: boolean;
  } | null;
}

export interface CreateContributionPayload {
  title: string;
  description?: string;
  contributionType: ContributionType;
  reference?: string;
  filePath?: string;
}

export interface AddContributionAssetPayload {
  file: File;
  originalFileName?: string;
  mimeType?: string;
  checksum?: string;
  assetType: ContributionAssetType;
}

export interface ContributionSubmissionResult {
  contribution: KnowledgeContribution;
  assets: ContributionAsset[];
}

export interface ReviewContributionPayload {
  status: "approved" | "rejected";
  feedback?: string;
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const CONTRIBUTION_TYPE_LABELS: Record<ContributionType, string> = {
  medicine: "Bài thuốc",
  herb: "Dược liệu",
  document: "Tài liệu",
};

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export const CONTRIBUTION_STATUS_COLORS: Record<ContributionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export const CONTRIBUTION_ASSET_TYPE_LABELS: Record<ContributionAssetType, string> = {
  pdf: "PDF",
  docx: "DOCX",
  image: "Hình ảnh",
  zip: "ZIP",
  other: "Khác",
};

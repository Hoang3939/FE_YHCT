import { ensureValidAccessToken } from "@/lib/session";
import type {
  AddContributionAssetPayload,
  ContributionAsset,
  ContributionPipelineJob,
  ContributionStatus,
  CreateContributionPayload,
  KnowledgeContribution,
  ReviewContributionPayload,
} from "@/types/contribution";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface MessageApiResponse<T> extends ApiResponse<T> {
  message?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_API ?? "http://localhost:3005";

async function buildJsonHeaders(): Promise<HeadersInit> {
  const token = await ensureValidAccessToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResponse<T>;
  return result.data;
}

async function parseMessageApiResponse<T>(response: Response): Promise<MessageApiResponse<T>> {
  return (await response.json()) as MessageApiResponse<T>;
}

function getErrorMessage(payload: { message?: string | string[] } | undefined, fallback: string): string {
  if (Array.isArray(payload?.message)) {
    return payload.message.join(", ");
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
}

/**
 * Fetch danh sách contributions.
 * @param status - Lọc theo trạng thái (optional)
 */
export async function fetchContributions(
  status?: ContributionStatus,
): Promise<KnowledgeContribution[]> {
  const url = new URL("/contributions", BASE_URL);
  if (status) {
    url.searchParams.set("status", status);
  }

  const res = await fetch(url.toString(), {
    headers: await buildJsonHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch contributions: ${res.status}`);
  }
  return parseApiResponse<KnowledgeContribution[]>(res);
}

/**
 * Fetch chi tiết một contribution.
 */
export async function fetchContribution(
  id: string,
): Promise<KnowledgeContribution> {
  const res = await fetch(`${BASE_URL}/contributions/${id}`, {
    headers: await buildJsonHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch contribution ${id}: ${res.status}`);
  }
  return parseApiResponse<KnowledgeContribution>(res);
}

/**
 * Expert review (approve/reject) một contribution.
 */
export async function reviewContribution(
  id: string,
  payload: ReviewContributionPayload,
): Promise<KnowledgeContribution> {
  const res = await fetch(`${BASE_URL}/contributions/${id}/review`, {
    method: "PATCH",
    headers: await buildJsonHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to review contribution ${id}: ${res.status}`);
  }
  return parseApiResponse<KnowledgeContribution>(res);
}

export async function createContribution(
  payload: CreateContributionPayload,
): Promise<MessageApiResponse<KnowledgeContribution>> {
  console.log('[DEBUG] Creating contribution with payload:', payload);
  const res = await fetch(`${BASE_URL}/contributions`, {
    method: "POST",
    headers: await buildJsonHeaders(),
    body: JSON.stringify(payload),
  });

  console.log('[DEBUG] Response status:', res.status, res.statusText);

  const result = await parseMessageApiResponse<KnowledgeContribution>(res).catch(() => undefined);
  console.log('[DEBUG] Response result:', result);

  if (!res.ok) {
    const errorMsg = getErrorMessage(result, `Lỗi ${res.status}: Tạo hồ sơ đóng góp thất bại.`);
    console.error('[ERROR] createContribution failed:', errorMsg);
    throw new Error(errorMsg);
  }

  return result as MessageApiResponse<KnowledgeContribution>;
}

export async function addContributionAsset(
  contributionId: string,
  payload: AddContributionAssetPayload,
): Promise<MessageApiResponse<ContributionAsset>> {
  const token = await ensureValidAccessToken();
  const formData = new FormData();

  formData.append("file", payload.file);
  formData.append("assetType", payload.assetType);

  if (payload.originalFileName) {
    formData.append("originalFileName", payload.originalFileName);
  }

  if (payload.mimeType) {
    formData.append("mimeType", payload.mimeType);
  }

  if (payload.checksum) {
    formData.append("checksum", payload.checksum);
  }

  const res = await fetch(`${BASE_URL}/contributions/${contributionId}/assets`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const result = await parseMessageApiResponse<ContributionAsset>(res).catch(() => undefined);

  if (!res.ok) {
    throw new Error(getErrorMessage(result, "Tải tài liệu đóng góp thất bại."));
  }

  return result as MessageApiResponse<ContributionAsset>;
}

export async function fetchLatestContributionPipeline(
  contributionId: string,
): Promise<ContributionPipelineJob | null> {
  const PIPELINE_BASE_URL = process.env.NEXT_PUBLIC_PIPELINE_BASE_URL ?? "http://localhost:3006";
  const res = await fetch(`${PIPELINE_BASE_URL}/pipelines/contributions/${contributionId}/latest`, {
    headers: await buildJsonHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch latest pipeline for contribution ${contributionId}: ${res.status}`);
  }

  return parseApiResponse<ContributionPipelineJob | null>(res);
}

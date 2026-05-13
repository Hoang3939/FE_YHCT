import { ensureValidAccessToken } from "@/lib/session";
import type {
  AddContributionAssetPayload,
  ContributionAsset,
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
  const res = await fetch(`${BASE_URL}/contributions`, {
    method: "POST",
    headers: await buildJsonHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await parseMessageApiResponse<KnowledgeContribution>(res).catch(() => undefined);

  if (!res.ok) {
    throw new Error(getErrorMessage(result, "Tạo hồ sơ đóng góp thất bại."));
  }

  return result as MessageApiResponse<KnowledgeContribution>;
}

export async function addContributionAsset(
  contributionId: string,
  payload: AddContributionAssetPayload,
): Promise<MessageApiResponse<ContributionAsset>> {
  const res = await fetch(`${BASE_URL}/contributions/${contributionId}/assets`, {
    method: "POST",
    headers: await buildJsonHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await parseMessageApiResponse<ContributionAsset>(res).catch(() => undefined);

  if (!res.ok) {
    throw new Error(getErrorMessage(result, "Gửi metadata tài liệu thất bại."));
  }

  return result as MessageApiResponse<ContributionAsset>;
}

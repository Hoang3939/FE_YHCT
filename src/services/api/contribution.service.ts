import type {
  KnowledgeContribution,
  ContributionStatus,
  ReviewContributionPayload,
} from "@/types/contribution";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_API ?? "http://localhost:3005";

async function parseApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResponse<T>;
  return result.data;
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

  const res = await fetch(url.toString());
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
  const res = await fetch(`${BASE_URL}/contributions/${id}`);
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to review contribution ${id}: ${res.status}`);
  }
  return parseApiResponse<KnowledgeContribution>(res);
}

import type { Feedback } from "@/types/feedback";

const BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_API ?? "http://localhost:3005";

/**
 * Fetch danh sách feedbacks từ BE mock API.
 * Endpoint: GET /feedbacks (admin-only trên BE).
 */
export async function fetchFeedbacks(): Promise<Feedback[]> {
  const res = await fetch(`${BASE_URL}/feedbacks`);
  if (!res.ok) {
    throw new Error(`Failed to fetch feedbacks: ${res.status}`);
  }
  return res.json() as Promise<Feedback[]>;
}

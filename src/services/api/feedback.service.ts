import type {
  CreateFeedbackInput,
  Feedback,
  FeedbackSubmissionResult,
} from '@/types/feedback';

const BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_API ?? 'http://localhost:3005';

interface FeedbackListResponse {
  success: boolean;
  data: Feedback[];
}

interface CreateFeedbackResponse {
  success: boolean;
  message: string;
  data: FeedbackSubmissionResult;
}

export async function fetchFeedbacks(): Promise<Feedback[]> {
  const res = await fetch(`${BASE_URL}/feedbacks`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch feedbacks: ${res.status}`);
  }

  const payload = (await res.json()) as FeedbackListResponse;
  return payload.data;
}

export async function createFeedback(
  input: CreateFeedbackInput,
): Promise<CreateFeedbackResponse> {
  const res = await fetch(`${BASE_URL}/feedbacks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await res.json().catch(() => ({}))) as Partial<CreateFeedbackResponse> & {
    message?: string | string[];
  };

  if (!res.ok) {
    const message = Array.isArray(payload.message)
      ? payload.message.join(', ')
      : payload.message || 'Gửi góp ý thất bại';
    throw new Error(message);
  }

  return payload as CreateFeedbackResponse;
}

// Admin: Update feedback status
export async function updateFeedbackStatus(
  feedbackId: string,
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected',
): Promise<Feedback> {
  const res = await fetch(`${BASE_URL}/feedbacks/${feedbackId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update feedback status: ${res.status}`);
  }

  return res.json();
}

// Admin: Assign feedback to expert
export async function assignFeedback(
  feedbackId: string,
  expertId: string,
): Promise<Feedback> {
  const res = await fetch(`${BASE_URL}/feedbacks/${feedbackId}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expertId }),
  });

  if (!res.ok) {
    throw new Error(`Failed to assign feedback: ${res.status}`);
  }

  return res.json();
}

// Admin: Get feedback statistics
export async function fetchFeedbackStats(): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
}> {
  const res = await fetch(`${BASE_URL}/feedbacks/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch feedback stats: ${res.status}`);
  }

  return res.json();
}

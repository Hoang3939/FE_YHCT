const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:3001';
const CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_BASE_URL || 'http://localhost:3002';
const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || 'http://localhost:3004';
const CONTRIBUTION_BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_BASE_URL || 'http://localhost:3005';
const PIPELINE_BASE_URL = process.env.NEXT_PUBLIC_PIPELINE_BASE_URL || 'http://localhost:3006';

// Helper to get auth token
function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') || '';
}

export interface DashboardStats {
  // Users
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;

  // Conversations/Queries
  totalConversations: number;
  todayQueries: number;

  // Documents
  totalEbooks: number;
  pendingContributions: number;

  // Feedback
  pendingFeedback: number;
}

export interface PipelineJob {
  id: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  progress: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleStats {
  user: number;
  admin: number;
  expert: number;
  total: number;
}

export interface FeedbackCategoryStats {
  name: string;
  dongGop: number;
  baoLoi: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  displayTime: string;
  type: 'success' | 'warning' | 'error' | 'info';
  actionType: 'approve' | 'pending' | 'error' | 'register' | 'feedback' | 'edit';
}

// Fetch dashboard statistics
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // For now, combine data from multiple endpoints
  // In production, this should be a single endpoint for performance

  const stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalConversations: 0,
    todayQueries: 0,
    totalEbooks: 0,
    pendingContributions: 0,
    pendingFeedback: 0,
  };

  try {
    const usersRes = await fetch(`${AUTH_BASE_URL}/auth/users/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (usersRes.ok) {
      const userData = await usersRes.json() as { totalUsers?: number; activeUsers?: number; newUsersToday?: number };
      stats.totalUsers = userData.totalUsers ?? 0;
      stats.activeUsers = userData.activeUsers ?? 0;
      stats.newUsersToday = userData.newUsersToday ?? 0;
    }
  } catch { /* ignore */ }

  try {
    const chatRes = await fetch(`${CHAT_BASE_URL}/chat/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (chatRes.ok) {
      const chatData = await chatRes.json() as { totalConversations?: number; todayQueries?: number };
      stats.totalConversations = chatData.totalConversations ?? 0;
      stats.todayQueries = chatData.todayQueries ?? 0;
    }
  } catch { /* ignore */ }

  try {
    const catalogRes = await fetch(`${CATALOG_BASE_URL}/ebooks/stats`);
    if (catalogRes.ok) {
      const catalogData = await catalogRes.json() as { total?: number };
      stats.totalEbooks = catalogData.total ?? 0;
    }
  } catch { /* ignore */ }

  try {
    const contribRes = await fetch(`${CONTRIBUTION_BASE_URL}/contributions?status=pending_review&pageSize=1`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (contribRes.ok) {
      const contribData = await contribRes.json() as { total?: number; meta?: { total?: number } };
      stats.pendingContributions = contribData.total ?? contribData.meta?.total ?? 0;
    }
  } catch { /* ignore */ }

  return stats;
}

// Fetch user role breakdown for pie chart
export async function fetchUserRoleStats(): Promise<UserRoleStats> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/users?pageSize=10000`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return { user: 0, admin: 0, expert: 0, total: 0 };
    const data = await res.json() as { data: { role: string }[]; total: number };
    const breakdown = { user: 0, admin: 0, expert: 0, total: data.total };
    for (const u of data.data) {
      if (u.role === 'admin') breakdown.admin++;
      else if (u.role === 'expert') breakdown.expert++;
      else breakdown.user++;
    }
    return breakdown;
  } catch {
    return { user: 0, admin: 0, expert: 0, total: 0 };
  }
}

// Fetch recent contributions for activity list
export async function fetchRecentActivity(): Promise<RecentActivityItem[]> {
  try {
    const res = await fetch(`${CONTRIBUTION_BASE_URL}/contributions?pageSize=8&sortBy=createdAt&sortOrder=desc`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return [];
    const data = await res.json() as { data: { id: string; title: string; status: string; createdAt: string; author?: { name?: string } }[] };
    return (data.data ?? []).map((c) => {
      const isApproved = c.status === 'approved';
      const isPending = c.status === 'pending_review';
      const now = Date.now();
      const diffMs = now - new Date(c.createdAt).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr = Math.floor(diffMin / 60);
      const displayTime = diffMin < 60
        ? `${diffMin} phút trước`
        : diffHr < 24
          ? `${diffHr} giờ trước`
          : `${Math.floor(diffHr / 24)} ngày trước`;
      return {
        id: c.id,
        title: c.title ?? '(Không có tiêu đề)',
        subtitle: c.author?.name ?? 'Người dùng',
        timestamp: c.createdAt,
        displayTime,
        type: isApproved ? 'success' : isPending ? 'warning' : 'info',
        actionType: isApproved ? 'approve' : isPending ? 'pending' : 'edit',
      } as RecentActivityItem;
    });
  } catch {
    return [];
  }
}

// Delete a pipeline job
export async function deletePipelineJob(id: string): Promise<void> {
  const res = await fetch(`${PIPELINE_BASE_URL}/pipelines/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to delete pipeline job');
}

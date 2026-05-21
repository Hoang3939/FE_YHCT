import type { User, UserRole, UserStatus } from '@/types/user';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:3001';

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  usersByRole: Record<string, number>;
}

// Helper to get auth token
function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') || '';
}

// Fetch all users with optional filters
export async function fetchUsers(params?: {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  pageSize?: number;
}): Promise<UsersResponse> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.set('search', params.search);
  if (params?.role) queryParams.set('role', params.role);
  if (params?.status) queryParams.set('status', params.status);
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));

  const url = `${AUTH_BASE_URL}/auth/users${queryParams.toString() ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

// Fetch user statistics
export async function fetchUserStats(): Promise<UserStats> {
  const url = `${AUTH_BASE_URL}/auth/users/stats`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }

  return response.json();
}

// Update user role
export async function updateUserRole(userId: string, role: UserRole): Promise<User> {
  const url = `${AUTH_BASE_URL}/auth/users/${userId}/role`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error('Failed to update user role');
  }

  return response.json();
}

// Lock/Unlock user account
export async function toggleUserLock(userId: string, locked: boolean): Promise<User> {
  const url = `${AUTH_BASE_URL}/auth/users/${userId}/status`;
  const status: UserStatus = locked ? 'Tạm khóa' : 'Hoạt động';

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update user status');
  }

  return response.json();
}

// Export users to CSV
export function exportUsersToCSV(users: User[]): string {
  const headers = ['ID', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tham gia', 'Hoạt động cuối', 'Phiên đăng nhập', 'Đóng góp'];

  const rows = users.map(user => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.status,
    user.joinedDate,
    user.lastActive,
    user.sessions,
    user.contributions,
  ]);

  // Convert to CSV format with UTF-8 BOM for Excel compatibility
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return '\ufeff' + csvContent; // Add BOM for Excel
}

// Update user (fullName, email, role)
export async function updateUser(
  userId: string,
  data: { fullName?: string; email?: string; role?: string },
): Promise<void> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? 'Failed to update user');
  }
}

// Delete user account
export async function deleteUser(userId: string): Promise<void> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error('Failed to delete user');
}

// Create new user
export async function createUser(data: {
  email: string;
  password: string;
  role?: string;
  fullName?: string;
}): Promise<{ id: string; email: string; role: string }> {
  const response = await fetch(`${AUTH_BASE_URL}/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? 'Failed to create user');
  }
  return response.json();
}

// Download CSV file
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

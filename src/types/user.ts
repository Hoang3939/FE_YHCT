/**
 * Interface chuẩn cho đối tượng User trong hệ thống Y-RAG Admin.
 * Dùng cho mock data, API response typing và props của các component.
 */

export type UserRole = "user" | "admin" | "expert";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  user: "Người dùng",
  admin: "Quản trị viên",
  expert: "Chuyên gia",
};

export type UserStatus = "Hoạt động" | "Không hoạt động" | "Chờ xác minh" | "Tạm khóa";

export interface User {
  /** ID duy nhất của user, dạng chuỗi */
  id: string;
  /** Họ tên đầy đủ */
  name: string;
  /** Địa chỉ email */
  email: string;
  /** Vai trò trong hệ thống */
  role: UserRole;
  /** Trạng thái tài khoản */
  status: UserStatus;
  /** Ngày tham gia hệ thống, định dạng YYYY-MM-DD */
  joinedDate: string;
  /** Thời điểm hoạt động cuối cùng, định dạng YYYY-MM-DD */
  lastActive: string;
  /** Tổng số phiên đăng nhập */
  sessions: number;
  /** Số lượng đóng góp (bài thuốc, góp ý ...) */
  contributions: number;
  /** Tài khoản đã xác minh email chưa */
  verified: boolean;
}


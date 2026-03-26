/**
 * Interface chuẩn cho đối tượng User trong hệ thống Y-RAG Admin.
 * Dùng cho mock data, API response typing và props của các component.
 */

export type UserRole = "Người dùng" | "Quản lý viên" | "Chuyên gia y tế" | "Nghiên cứu sinh";

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

// ─────────────────────────────────────────────
// MOCK DATA — 10 users cho dev/testing
// ─────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: "USR-001",
    name: "Dương Thị Quân",
    email: "duong.thi.quan@gmail.com",
    role: "Người dùng",
    status: "Không hoạt động",
    joinedDate: "2024-08-17",
    lastActive: "2024-09-09",
    sessions: 30,
    contributions: 0,
    verified: true,
  },
  {
    id: "USR-002",
    name: "Nguyễn Văn Nam",
    email: "nguyen.van.nam@gmail.com",
    role: "Người dùng",
    status: "Hoạt động",
    joinedDate: "2024-10-26",
    lastActive: "2024-11-18",
    sessions: 12,
    contributions: 0,
    verified: true,
  },
  {
    id: "USR-003",
    name: "Hoàng Văn Yến",
    email: "hoang.van.yen@gmail.com",
    role: "Quản lý viên",
    status: "Hoạt động",
    joinedDate: "2024-07-12",
    lastActive: "2024-09-09",
    sessions: 800,
    contributions: 5,
    verified: true,
  },
  {
    id: "USR-004",
    name: "Bùi Thị Bích",
    email: "bui.thi.bich@gmail.com",
    role: "Quản lý viên",
    status: "Hoạt động",
    joinedDate: "2024-07-01",
    lastActive: "2024-09-09",
    sessions: 782,
    contributions: 12,
    verified: true,
  },
  {
    id: "USR-005",
    name: "Bùi Thị Thanh",
    email: "bui.thi.thanh@gmail.com",
    role: "Người dùng",
    status: "Hoạt động",
    joinedDate: "2024-07-01",
    lastActive: "2024-11-18",
    sessions: 102,
    contributions: 33,
    verified: true,
  },
  {
    id: "USR-006",
    name: "Nguyễn Văn An",
    email: "nguyen.van.an@gmail.com",
    role: "Người dùng",
    status: "Chờ xác minh",
    joinedDate: "2024-07-01",
    lastActive: "2024-11-02",
    sessions: 201,
    contributions: 0,
    verified: false,
  },
  {
    id: "USR-007",
    name: "Hoàng Văn Thanh",
    email: "hoang.van.thanh@gmail.com",
    role: "Người dùng",
    status: "Hoạt động",
    joinedDate: "2024-10-18",
    lastActive: "2024-11-18",
    sessions: 143,
    contributions: 40,
    verified: true,
  },
  {
    id: "USR-008",
    name: "Đinh Thị An",
    email: "dinh.thi.an@gmail.com",
    role: "Người dùng",
    status: "Tạm khóa",
    joinedDate: "2024-12-10",
    lastActive: "2024-12-10",
    sessions: 118,
    contributions: 42,
    verified: true,
  },
  {
    id: "USR-009",
    name: "Cao Văn Giao",
    email: "cao.van.giao@gmail.com",
    role: "Quản lý viên",
    status: "Hoạt động",
    joinedDate: "2024-03-10",
    lastActive: "2024-11-18",
    sessions: 201,
    contributions: 33,
    verified: true,
  },
  {
    id: "USR-010",
    name: "Bùi Thị Việt",
    email: "bui.thi.viet@gmail.com",
    role: "Chuyên gia y tế",
    status: "Hoạt động",
    joinedDate: "2024-03-08",
    lastActive: "2024-11-18",
    sessions: 230,
    contributions: 75,
    verified: true,
  },
];

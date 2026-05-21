"use client";

import React from "react";
import { BadgeCheck, Lock, Unlock, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { User, UserRole, UserStatus } from "@/types/user";
import { USER_ROLE_LABELS } from "@/types/user";
import { formatNumber } from "@/lib/utils";

interface UserTableProps {
  /** Danh sách users cần hiển thị */
  users: User[];
  /** Callback khi khóa/mở khóa user */
  onToggleLock?: (userId: string, currentStatus: string) => void;
  /** Callback khi thay đổi vai trò */
  onRoleChange?: (userId: string, newRole: UserRole) => void;
  /** Callback khi xóa user */
  onDelete?: (userId: string, userName: string) => void;
  /** Callback khi chỉnh sửa user */
  onEdit?: (user: User) => void;
}

// ─────────────────────────────────────────────
// Helper: lấy màu badge theo status
// ─────────────────────────────────────────────
function getStatusVariant(status: UserStatus): "success" | "warning" | "error" | "default" {
  switch (status) {
    case "Hoạt động":    return "success";
    case "Chờ xác minh": return "warning";
    case "Tạm khóa":    return "error";
    default:             return "default";
  }
}

// ─────────────────────────────────────────────
// Helper: lấy màu badge theo role
// ─────────────────────────────────────────────
function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case "admin":  return "bg-emerald-100 text-emerald-700";
    case "expert": return "bg-blue-100 text-blue-700";
    case "user":   return "bg-gray-100 text-gray-600";
    default:       return "bg-gray-100 text-gray-600";
  }
}

// ─────────────────────────────────────────────
// Sub-component: Avatar với 2 chữ đầu
// ─────────────────────────────────────────────
const avatarColors = [
  "bg-emerald-500", "bg-blue-500", "bg-violet-500",
  "bg-rose-500",    "bg-amber-500", "bg-teal-500",
];

interface UserAvatarProps {
  name: string;
  index: number;
}

const UserAvatar = ({ name, index }: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colorClass = avatarColors[index % avatarColors.length];
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${colorClass}`}>
      {initials}
    </div>
  );
};

// ─────────────────────────────────────────────
// Sub-component: User info cell
// ─────────────────────────────────────────────
const UserInfoCell = ({ user, index }: { user: User; index: number }) => (
  <div className="flex items-center gap-3">
    <UserAvatar name={user.name} index={index} />
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold text-gray-900 truncate">{user.name}</span>
        {user.verified && <BadgeCheck size={14} className="text-emerald-500 shrink-0" />}
      </div>
      <p className="text-xs text-gray-400 truncate">{user.email}</p>
    </div>
  </div>
);

/**
 * UserTable Component
 * Bảng hiển thị danh sách người dùng với đầy đủ cột thông tin.
 * Avatar, badge vai trò/trạng thái, icon verified, nút action.
 */
export const UserTable = ({ users, onToggleLock, onRoleChange, onDelete, onEdit }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Không tìm thấy người dùng phù hợp.
      </div>
    );
  }

  const headers = [
    "NGƯỜI DÙNG", "VAI TRÒ", "TRẠNG THÁI",
    "NGÀY THAM GIA", "HOẠT ĐỘNG CUỐI", "PHIÊN", "ĐÓNG GÓP", "",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        {/* Head */}
        <thead>
          <tr className="border-b border-gray-100">
            {/* Checkbox col */}
            <th className="w-10 py-3 px-4">
              <input type="checkbox" className="rounded border-gray-300 accent-emerald-500" />
            </th>
            {headers.map((h) => (
              <th
                key={h}
                className="py-3 px-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"
            >
              {/* Checkbox */}
              <td className="py-3.5 px-4">
                <input type="checkbox" className="rounded border-gray-300 accent-emerald-500" />
              </td>

              {/* Người dùng */}
              <td className="py-3.5 px-3">
                <UserInfoCell user={user} index={index} />
              </td>

              {/* Vai trò */}
              <td className="py-3.5 px-3">
                {onRoleChange ? (
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value as UserRole)}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${getRoleBadgeClass(user.role)}`}
                  >
                    <option value="user">Người dùng</option>
                    <option value="expert">Chuyên gia</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                    {USER_ROLE_LABELS[user.role]}
                  </span>
                )}
              </td>

              {/* Trạng thái */}
              <td className="py-3.5 px-3">
                <Badge variant={getStatusVariant(user.status)}>
                  {user.status}
                </Badge>
              </td>

              {/* Ngày tham gia */}
              <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                {user.joinedDate}
              </td>

              {/* Hoạt động cuối */}
              <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">
                {user.lastActive}
              </td>

              {/* Phiên */}
              <td className="py-3.5 px-3 text-gray-700 font-medium text-right pr-6">
                {formatNumber(user.sessions)}
              </td>

              {/* Đóng góp */}
              <td className="py-3.5 px-3 text-gray-700 font-medium text-right pr-6">
                {user.contributions}
              </td>

              {/* Action */}
              <td className="py-3.5 px-3">
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(user)}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"
                      title="Chỉnh sửa"
                      aria-label="Chỉnh sửa người dùng"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onToggleLock?.(user.id, user.status)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      user.status === "Tạm khóa"
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                    title={user.status === "Tạm khóa" ? "Mở khóa" : "Khóa"}
                  >
                    {user.status === "Tạm khóa" ? <Unlock size={16} /> : <Lock size={16} />}
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(user.id, user.name)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa người dùng"
                      aria-label="Xóa người dùng"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

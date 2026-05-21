"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserSummaryCards } from "@/features/users/UserSummaryCards";
import { UserTableToolbar, type TabFilter } from "@/features/users/UserTableToolbar";
import { UserTable } from "@/features/users/UserTable";
import { UserPagination } from "@/features/users/UserPagination";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/toast/ToastContext";
import { fetchUsers, updateUserRole, toggleUserLock, exportUsersToCSV, downloadCSV, createUser, deleteUser, updateUser } from "@/services/api/user.service";
import type { User, UserRole } from "@/types/user";
import { Loader2 } from "lucide-react";
import { CreateUserDialog } from "@/features/users/CreateUserDialog";
import { DeleteConfirmDialog } from "@/features/users/DeleteConfirmDialog";
import { EditUserDialog } from "@/features/users/EditUserDialog";

const UsersPageClient = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);

  // Fetch users from API
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const role = activeTab === "all" ? undefined : activeTab;
      const response = await fetchUsers({
        search: searchQuery,
        role: role as UserRole,
        page: currentPage,
        pageSize,
      });
      setUsers(response.data);
      setTotal(response.total);
    } catch (error) {
      showToast("Không thể tải danh sách người dùng", "error");
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTab, currentPage, pageSize, showToast]);

  // Initial load and when filters change
  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle tab change
  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle lock/unlock user
  const handleToggleLock = async (userId: string, currentStatus: string) => {
    const isLocked = currentStatus === "Tạm khóa";
    try {
      await toggleUserLock(userId, !isLocked);
      showToast(isLocked ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản", "success");
      void loadUsers(); // Refresh list
    } catch (error) {
      showToast("Thao tác thất bại", "error");
    }
  };

  // Handle role update
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      showToast("Cập nhật vai trò thành công", "success");
      void loadUsers();
    } catch {
      showToast("Cập nhật vai trò thất bại", "error");
    }
  };

  // Handle create user
  const handleCreate = async (data: { email: string; password: string; fullName: string; role: UserRole }) => {
    await createUser(data);
  };

  // Handle delete user
  const handleDeleteRequest = (userId: string, userName: string) => {
    setDeleteTarget({ id: userId, name: userName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      showToast(`Đã xóa tài khoản ${deleteTarget.name}`, "success");
      setDeleteTarget(null);
      void loadUsers();
    } catch {
      showToast("Xóa tài khoản thất bại", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Handle edit user
  const handleEdit = async (userId: string, data: { fullName: string; email: string; role: UserRole }) => {
    await updateUser(userId, data);
  };

  // Handle CSV export — fetch all users (no pagination)
  const handleExportCSV = async () => {
    try {
      const allRes = await fetchUsers({ search: searchQuery, role: activeTab === "all" ? undefined : activeTab as UserRole, pageSize: 10000 });
      const csvContent = exportUsersToCSV(allRes.data);
      downloadCSV(csvContent, `users_export_${new Date().toISOString().split("T")[0]}.csv`);
      showToast(`Đã xuất ${allRes.total} người dùng ra CSV`, "success");
    } catch {
      showToast("Xuất CSV thất bại", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => { showToast("Tạo tài khoản thành công", "success"); void loadUsers(); }}
        onCreate={handleCreate}
      />
      <DeleteConfirmDialog
        open={!!deleteTarget}
        userName={deleteTarget?.name ?? ""}
        loading={deleting}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setDeleteTarget(null)}
      />
      <EditUserDialog
        open={!!editTarget}
        user={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={() => { showToast("Cập nhật tài khoản thành công", "success"); void loadUsers(); }}
        onSave={handleEdit}
      />

      {/* Stats cards */}
      <UserSummaryCards />

      {/* Table card */}
      <Card className="p-6">
        <div className="mb-4">
          <UserTableToolbar
            searchQuery={searchQuery}
            onSearch={handleSearch}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onExportCSV={handleExportCSV}
            onAddUser={() => setShowCreateDialog(true)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        ) : (
          <UserTable
            users={users}
            onToggleLock={handleToggleLock}
            onRoleChange={handleRoleChange}
            onDelete={handleDeleteRequest}
            onEdit={(user) => setEditTarget(user)}
          />
        )}

        <UserPagination
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
        />
      </Card>
    </div>
  );
};

export default UsersPageClient;

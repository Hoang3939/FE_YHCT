"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { UserRole } from "@/types/user";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onCreate: (data: { email: string; password: string; fullName: string; role: UserRole }) => Promise<void>;
}

const ROLE_OPTIONS = [
  { value: "user", label: "Người dùng" },
  { value: "expert", label: "Chuyên gia" },
  { value: "admin", label: "Quản trị viên" },
];

export const CreateUserDialog = ({ open, onClose, onSuccess, onCreate }: CreateUserDialogProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFullName(""); setEmail(""); setPassword(""); setRole("user"); setError("");
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Email và mật khẩu không được để trống"); return; }
    if (password.length < 6) { setError("Mật khẩu phải ít nhất 6 ký tự"); return; }
    setSaving(true); setError("");
    try {
      await onCreate({ email: email.trim(), password, fullName: fullName.trim(), role });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo người dùng thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <UserPlus size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Tạo người dùng mới</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Họ tên</label>
            <Input
              ref={firstRef}
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Email <span className="text-red-500">*</span></label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Mật khẩu <span className="text-red-500">*</span></label>
            <Input
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Vai trò</label>
            <Select
              options={ROLE_OPTIONS}
              value={role}
              onChange={(val) => setRole(val as UserRole)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Hủy</Button>
            <Button type="submit" variant="default" disabled={saving} className="gap-2 px-5">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
              {saving ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

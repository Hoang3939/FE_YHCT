"use client";

import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SettingSectionCard, FormRow } from "@/features/settings/SettingSectionCard";
import { useToast } from "@/components/toast/ToastContext";

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:3001";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
}

export const ChangePasswordForm = () => {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!currentPassword) e.current = "Vui lòng nhập mật khẩu hiện tại";
    if (newPassword.length < 8) e.new = "Mật khẩu mới phải có ít nhất 8 ký tự";
    if (newPassword && newPassword === currentPassword) e.new = "Mật khẩu mới không được trùng mật khẩu cũ";
    if (newPassword !== confirmPassword) e.confirm = "Xác nhận mật khẩu không khớp";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch(`${AUTH_BASE}/auth/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json() as { message?: string };

      if (!res.ok) {
        throw new Error(data.message ?? "Đổi mật khẩu thất bại");
      }

      showToast("Đổi mật khẩu thành công", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Đổi mật khẩu thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const eyeButton = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-gray-400 hover:text-gray-600 transition-colors"
      aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <KeyRound size={18} className="text-emerald-600" />
          </div>
          Đổi mật khẩu
        </h2>
        <p className="text-sm text-gray-500 mt-1">Cập nhật mật khẩu đăng nhập của bạn</p>
      </div>

      <SettingSectionCard title="Thông tin mật khẩu" icon={<KeyRound size={16} />}>
        <FormRow label="Mật khẩu hiện tại" description="Nhập mật khẩu đang dùng để xác nhận danh tính">
          <div className="flex flex-col gap-1">
            <Input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setErrors((prev) => ({ ...prev, current: undefined })); }}
              placeholder="••••••••"
              rightIcon={eyeButton(showCurrent, () => setShowCurrent((v) => !v))}
            />
            {errors.current && <p className="text-xs text-red-500">{errors.current}</p>}
          </div>
        </FormRow>

        <FormRow label="Mật khẩu mới" description="Tối thiểu 8 ký tự, nên kết hợp chữ + số + ký tự đặc biệt">
          <div className="flex flex-col gap-1">
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setErrors((prev) => ({ ...prev, new: undefined })); }}
              placeholder="••••••••"
              rightIcon={eyeButton(showNew, () => setShowNew((v) => !v))}
            />
            {errors.new && <p className="text-xs text-red-500">{errors.new}</p>}
          </div>
        </FormRow>

        <FormRow label="Xác nhận mật khẩu mới" description="Nhập lại mật khẩu mới để xác nhận">
          <div className="flex flex-col gap-1">
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors((prev) => ({ ...prev, confirm: undefined })); }}
              placeholder="••••••••"
              rightIcon={eyeButton(showConfirm, () => setShowConfirm((v) => !v))}
            />
            {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
          </div>
        </FormRow>
      </SettingSectionCard>

      <div className="flex justify-end mt-4">
        <Button type="submit" variant="default" className="gap-2 px-6" disabled={saving}>
          <Save size={16} /> {saving ? "Đang lưu..." : "Đổi mật khẩu"}
        </Button>
      </div>
    </form>
  );
};

"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmDialogProps {
  open: boolean;
  userName: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog = ({ open, userName, loading, onConfirm, onCancel }: DeleteConfirmDialogProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Xác nhận xóa tài khoản</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Tài khoản <span className="font-semibold text-gray-700">{userName}</span> sẽ bị xóa vĩnh viễn.
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
          Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến tài khoản này sẽ bị mất.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Hủy</Button>
          <Button
            variant="default"
            className="gap-2 bg-red-600 hover:bg-red-700 text-white border-red-600"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            {loading ? "Đang xóa..." : "Xóa tài khoản"}
          </Button>
        </div>
      </div>
    </div>
  );
};

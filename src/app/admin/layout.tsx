"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { useRoleGuard } from "@/hooks/useRole";
import { hasSession } from "@/lib/session";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { role, isLoading } = useRoleGuard();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    try {
      if (!hasSession()) {
        router.replace("/login");
        return;
      }

      if (!role) {
        router.replace("/chat");
      }
    } catch {
      router.replace("/login");
    }
  }, [isLoading, role, router]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  if (isLoading || !role) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 text-center text-sm text-gray-600">
        Đang xác thực quyền truy cập khu vực quản trị…
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

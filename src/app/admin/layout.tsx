"use client";

import React, { useEffect } from "react";
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

  if (isLoading || !role) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 text-center text-sm text-gray-600">
        Đang xác thực quyền truy cập khu vực quản trị…
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

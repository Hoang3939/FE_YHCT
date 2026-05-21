"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatNumber } from "@/lib/utils";
import { fetchUserRoleStats, type UserRoleStats } from "@/services/api/dashboard.service";
import { Loader2 } from "lucide-react";

const COLORS = [
  { key: "user" as const, name: "Người dùng", color: "#10b981" },
  { key: "admin" as const, name: "Quản trị viên", color: "#064e3b" },
  { key: "expert" as const, name: "Chuyên gia", color: "#a7f3d0" },
];

/**
 * UserPieChart Component
 * Biểu đồ tròn phân loại vai trò người dùng từ API thật
 */
export const UserPieChart = () => {
  const [stats, setStats] = useState<UserRoleStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRoleStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const chartData = COLORS.map((c) => ({
    ...c,
    value: stats?.[c.key] ?? 0,
    percent: stats && stats.total > 0
      ? `${((stats[c.key] / stats.total) * 100).toFixed(1)}%`
      : "0%",
  }));

  const dominantRole = chartData.reduce((a, b) => (a.value > b.value ? a : b), chartData[0]);

  return (
    <Card className="flex flex-col h-[460px]">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Phân loại vai trò người dùng</h3>
        <p className="text-sm text-gray-500">
          {loading ? "Đang tải..." : `Cơ cấu người dùng - ${formatNumber(stats?.total ?? 0)} tổng`}
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          <div className="flex-1 relative w-full flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} người dùng`, "Số lượng"] as [string, string]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">{formatNumber(dominantRole?.value ?? 0)}</span>
              <span className="text-xs text-gray-500">{dominantRole?.name ?? ""}</span>
              <span className="text-sm font-semibold text-emerald-600">{dominantRole?.percent ?? ""}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{formatNumber(item.value)}</span>
                  <span className="text-gray-500 w-12 text-right">{item.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { MOCK_THROUGHPUT } from "@/types/pipeline";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/**
 * ThroughputChart Component
 * Biểu đồ đường hiển thị tốc độ xử lý Chunks/phút và Tokens/phút theo thời gian
 */
export const ThroughputChart = () => (
  <Card className="h-[340px] flex flex-col p-5">
    <div className="mb-4">
      <h3 className="text-sm font-bold text-gray-900">Throughput xử lý</h3>
      <p className="text-xs text-gray-400">Chunks/phút và Tokens/phút theo thời gian thực</p>
    </div>
    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MOCK_THROUGHPUT} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="chunks"
            name="Chunks/phút"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="tokens"
            name="Tokens/phút"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

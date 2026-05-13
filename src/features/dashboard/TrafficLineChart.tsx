"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const data = [
  { name: "01/03", sessions: 160, hits: 100, users: 80 },
  { name: "05/03", sessions: 140, hits: 90,  users: 70 },
  { name: "10/03", sessions: 120, hits: 80,  users: 50 },
  { name: "15/03", sessions: 110, hits: 70,  users: 40 },
  { name: "20/03", sessions: 100, hits: 60,  users: 35 },
  { name: "25/03", sessions: 200, hits: 170, users: 80 },
  { name: "31/03", sessions: 180, hits: 150, users: 70 },
  { name: "05/04", sessions: 160, hits: 130, users: 60 },
  { name: "10/04", sessions: 150, hits: 110, users: 40 },
  { name: "15/04", sessions: 240, hits: 180, users: 90 },
  { name: "20/04", sessions: 200, hits: 110, users: 80 },
  { name: "25/04", sessions: 160, hits: 130, users: 40 },
];

/**
 * TrafficLineChart Component
 * Biểu đồ đường hiển thị lưu lượng truy cập hệ thống
 */
export const TrafficLineChart = () => {
  return (
    <Card className="col-span-1 lg:col-span-3 h-[400px] flex flex-col pt-6 w-full">
      <div className="flex-1 w-full relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -20,
              bottom: 15,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
               verticalAlign="bottom" 
               height={36} 
               iconType="circle"
               wrapperStyle={{ fontSize: '12px', color: '#4b5563', paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              name="Phiên truy cập"
              stroke="#06b6d4" // cyan-500
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="hits" 
              name="Truy vấn RAG"
              stroke="#f43f5e" // rose-500
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
            />
            <Line 
              type="monotone" 
              dataKey="users" 
              name="Người dùng"
              stroke="#8b5cf6" // violet-500
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

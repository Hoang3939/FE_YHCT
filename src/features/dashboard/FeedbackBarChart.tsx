"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const data = [
  { name: "Bài thuốc mới", dongGop: 160, baoLoi: 40, caiThien: 20 },
  { name: "Dược liệu", dongGop: 120, baoLoi: 80, caiThien: 30 },
  { name: "Phương pháp", dongGop: 100, baoLoi: 50, caiThien: 40 },
  { name: "Bài thuốc đã sửa", dongGop: 20, baoLoi: 120, caiThien: 10 },
  { name: "Gợi ý cải thiện", dongGop: 10, baoLoi: 20, caiThien: 140 },
  { name: "Dịch thuật", dongGop: 80, baoLoi: 30, caiThien: 10 },
  { name: "Hình ảnh", dongGop: 90, baoLoi: 10, caiThien: 5 },
];

/**
 * FeedbackBarChart Component
 * Biểu đồ cột hiển thị đóng góp & báo lỗi cộng đồng
 */
export const FeedbackBarChart = () => {
  return (
    <Card className="flex flex-col h-[420px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Đóng góp & Báo lỗi cộng đồng</h3>
          <p className="text-sm text-gray-500">Phân loại theo danh mục - 841 tổng</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
          <button className="px-3 py-1 bg-white shadow-sm rounded-md font-medium text-gray-900">7 ngày</button>
          <button className="px-3 py-1 text-gray-500 hover:text-gray-900 font-medium">30 ngày</button>
          <button className="px-3 py-1 text-gray-500 hover:text-gray-900 font-medium">3 tháng</button>
        </div>
      </div>

      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: -20,
              bottom: 40,
            }}
            barSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              angle={-45}
              textAnchor="end"
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
               verticalAlign="bottom" 
               height={36} 
               iconType="square"
               wrapperStyle={{ fontSize: '12px', color: '#4b5563', paddingTop: '20px' }}
            />
            <Bar dataKey="dongGop" name="Đóng góp mới" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="baoLoi" name="Báo lỗi dữ liệu" fill="#fda4af" radius={[4, 4, 0, 0]} />
            <Bar dataKey="caiThien" name="Gợi ý cải thiện" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

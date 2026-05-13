"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatNumber } from "@/lib/utils";

const data = [
  {
    name: "Người dùng đăng ký",
    value: 7842,
    color: "#10b981",
    dotClassName: "bg-emerald-500",
    percent: "62.8%",
  },
  {
    name: "Khách",
    value: 3220,
    color: "#a7f3d0",
    dotClassName: "bg-emerald-200",
    percent: "25.8%",
  },
  {
    name: "Chuyên gia y tế",
    value: 882,
    color: "#d1fae5",
    dotClassName: "bg-emerald-100",
    percent: "7.0%",
  },
  {
    name: "Nghiên cứu sinh",
    value: 444,
    color: "#064e3b",
    dotClassName: "bg-emerald-950",
    percent: "3.5%",
  },
];

const ChartTooltipContent = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-gray-900">{payload[0].value} người dùng</p>
      <p className="text-xs text-gray-500">Số lượng</p>
    </div>
  );
};

/**
 * UserPieChart Component
 * Biểu đồ tròn phân loại đối tượng truy cập
 */
export const UserPieChart = () => {

  return (
    <Card className="flex min-w-0 flex-col h-[420px]">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Phân loại đối tượng truy cập</h3>
        <p className="text-sm text-gray-500">Cơ cấu người dùng - 12,488 tổng phiên</p>
      </div>

      <div className="relative mt-4 h-[240px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={240} minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-900">7,842</span>
          <span className="text-xs text-gray-500">người dùng</span>
          <span className="text-sm font-semibold text-emerald-600">62.8%</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${item.dotClassName}`} />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">{formatNumber(item.value)}</span>
              <span className="text-gray-500 w-12 text-right">{item.percent}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

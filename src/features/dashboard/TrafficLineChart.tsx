"use client";

import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

const CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_BASE_URL || 'http://localhost:3002';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') || '';
}

interface ChartRow { name: string; sessions: number; hits: number; users: number; }

function buildEmptyDays(n: number): ChartRow[] {
  const rows: ChartRow[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    rows.push({
      name: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`,
      sessions: 0, hits: 0, users: 0,
    });
  }
  return rows;
}

/**
 * TrafficLineChart Component
 * Biểu đồ đưṑng lưu lượng thật từ chat-service
 */
export const TrafficLineChart = () => {
  const [data, setData] = useState<ChartRow[]>(buildEmptyDays(14));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${CHAT_BASE_URL}/chat/stats/daily?days=14`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) {
          const json = await res.json() as { data?: { date: string; sessions: number; hits: number; users: number }[] };
          const rows = json.data ?? [];
          if (rows.length > 0) {
            setData(rows.map((r) => ({
              name: r.date.slice(5).replace('-', '/'),
              sessions: r.sessions,
              hits: r.hits,
              users: r.users,
            })));
          }
        }
      } catch { /* fallback giữ empty */ } finally {
        setLoading(false);
      }
    };
    void load();
    const iv = setInterval(() => void load(), 60000);
    return () => clearInterval(iv);
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-3 h-[400px] flex flex-col w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Lưu lượng truy cập</h3>
          <p className="text-xs text-gray-400">14 ngày gần nhất</p>
        </div>
        {loading && <Loader2 size={16} className="animate-spin text-gray-400" />}
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
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

"use client";

import React, { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

const CONTRIBUTION_BASE_URL = process.env.NEXT_PUBLIC_CONTRIBUTION_BASE_URL || 'http://localhost:3005';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') || '';
}

interface ContribRow { name: string; dongGop: number; baoLoi: number; caiThien: number; }

const CATEGORY_MAP: Record<string, string> = {
  bat_thuoc: 'Bài thuốc',
  duoc_lieu: 'Dược liệu',
  phuong_phap: 'Phương pháp',
  other: 'Khác',
};

type Range = '7d' | '30d' | '3m';
const RANGE_DAYS: Record<Range, number> = { '7d': 7, '30d': 30, '3m': 90 };
const RANGE_LABELS: Record<Range, string> = { '7d': '7 ngày', '30d': '30 ngày', '3m': '3 tháng' };

/**
 * FeedbackBarChart Component
 * Biểu đồ cột đóng góp từ API thật, fix chồng nhãn
 */
export const FeedbackBarChart = () => {
  const [range, setRange] = useState<Range>('7d');
  const [data, setData] = useState<ContribRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const since = new Date();
        since.setDate(since.getDate() - RANGE_DAYS[range]);
        const res = await fetch(
          `${CONTRIBUTION_BASE_URL}/contributions?pageSize=500&since=${since.toISOString()}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (!res.ok) throw new Error();
        const json = await res.json() as { data: { category?: string; status: string }[]; total?: number };
        const items = json.data ?? [];
        setTotal(json.total ?? items.length);

        const buckets: Record<string, ContribRow> = {};
        for (const item of items) {
          const key = item.category ?? 'other';
          const label = CATEGORY_MAP[key] ?? key;
          if (!buckets[label]) buckets[label] = { name: label, dongGop: 0, baoLoi: 0, caiThien: 0 };
          if (item.status === 'rejected') buckets[label].baoLoi++;
          else if (item.status === 'approved') buckets[label].caiThien++;
          else buckets[label].dongGop++;
        }
        const rows = Object.values(buckets);
        setData(rows.length ? rows : [
          { name: 'Bài thuốc', dongGop: 0, baoLoi: 0, caiThien: 0 },
          { name: 'Dược liệu', dongGop: 0, baoLoi: 0, caiThien: 0 },
        ]);
      } catch {
        setData([
          { name: 'Bài thuốc', dongGop: 0, baoLoi: 0, caiThien: 0 },
          { name: 'Dược liệu', dongGop: 0, baoLoi: 0, caiThien: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [range]);

  return (
    <Card className="flex flex-col h-[420px]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-base font-bold text-gray-900">Đóng góp & Báo lỗi cộng đồng</h3>
          <p className="text-xs text-gray-500">
            {loading ? 'Đang tải...' : `${total} đóng góp - ${RANGE_LABELS[range]}`}
          </p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
          {(['7d', '30d', '3m'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                range === r ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 4, right: 4, left: -22, bottom: 60 }}
              barSize={10}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              />
              <Legend
                verticalAlign="top"
                height={24}
                iconType="square"
                iconSize={10}
                wrapperStyle={{ fontSize: '11px', color: '#4b5563', paddingBottom: '4px' }}
              />
              <Bar dataKey="dongGop" name="Đang chờ" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="baoLoi" name="Từ chối" fill="#fda4af" radius={[3, 3, 0, 0]} />
              <Bar dataKey="caiThien" name="Đã duyệt" fill="#6ee7b7" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

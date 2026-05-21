"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || 'http://localhost:3004';
const PIPELINE_BASE_URL = process.env.NEXT_PUBLIC_PIPELINE_BASE_URL || 'http://localhost:3006';

interface SystemStats {
  totalEbooks: number;
  chunksCreated: number;
  successRate: number;
  avgTimeSeconds: number;
  completed: number;
  failed: number;
}

function ProgressRow({
  label, value, display, color,
}: { label: string; value: number; display: React.ReactNode; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          {label}
        </span>
        <span className="font-bold text-xs flex items-center">{display}</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full transition-all duration-700`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

/**
 * SystemHealthPanel — panel hiệu suất hệ thống + stat cards từ API thật
 */
export const SystemHealthPanel = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catalogRes, pipelineRes] = await Promise.all([
          fetch(`${CATALOG_BASE_URL}/ebooks/stats`),
          fetch(`${PIPELINE_BASE_URL}/pipelines/stats`),
        ]);
        const s: SystemStats = {
          totalEbooks: 0, chunksCreated: 0, successRate: 0,
          avgTimeSeconds: 0, completed: 0, failed: 0,
        };
        if (catalogRes.ok) {
          const d = await catalogRes.json() as { data?: { total?: number } };
          s.totalEbooks = d.data?.total ?? 0;
        }
        if (pipelineRes.ok) {
          const d = await pipelineRes.json() as {
            data?: { chunksCreated?: number; successRate?: number; avgTimeSeconds?: number; completed?: number; failed?: number };
          };
          s.chunksCreated = d.data?.chunksCreated ?? 0;
          s.successRate = d.data?.successRate ?? 0;
          s.avgTimeSeconds = d.data?.avgTimeSeconds ?? 0;
          s.completed = d.data?.completed ?? 0;
          s.failed = d.data?.failed ?? 0;
        }
        setStats(s);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    void load();
    const iv = setInterval(() => void load(), 30000);
    return () => clearInterval(iv);
  }, []);

  const successRate = stats?.successRate ?? 0;
  const avgMs = stats ? stats.avgTimeSeconds * 1000 : 0;
  const chunkK = stats ? (stats.chunksCreated >= 1000 ? `${(stats.chunksCreated / 1000).toFixed(1)}K` : String(stats.chunksCreated)) : '—';

  return (
    <div className="col-span-1 flex flex-col gap-4">
      <Card className="flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
          <h3 className="text-sm font-bold text-gray-900">Hiệu suất hệ thống</h3>
          {loading
            ? <Loader2 size={13} className="animate-spin text-gray-400" />
            : <span className="text-[10px] text-gray-400">Cập nhật 30s</span>
          }
        </div>

        <div className="space-y-4">
          <ProgressRow
            label="Tỷ lệ thành công"
            value={successRate}
            display={<span className="font-bold">{successRate}%</span>}
            color="bg-emerald-500"
          />
          <ProgressRow
            label="Tốc độ xử lý"
            value={stats ? Math.min((avgMs / 120000) * 100, 100) : 0}
            display={
              <span>
                <span className="text-orange-500 bg-orange-50 px-1 py-0.5 rounded text-[10px]">
                  {avgMs > 0 ? `${(avgMs / 1000).toFixed(0)}s` : '—'}
                </span>{' '}avg
              </span>
            }
            color="bg-blue-500"
          />
          <ProgressRow
            label="Jobs hoàn thành"
            value={stats && (stats.completed + stats.failed) > 0
              ? (stats.completed / (stats.completed + stats.failed)) * 100
              : 0
            }
            display={<span>{stats?.completed ?? 0} / {stats ? stats.completed + stats.failed : 0}</span>}
            color="bg-purple-500"
          />
          <ProgressRow
            label="Pipeline thành công"
            value={successRate}
            display={<span className="font-bold">{successRate.toFixed(1)}%</span>}
            color="bg-teal-500"
          />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          {loading
            ? <Loader2 size={16} className="animate-spin text-gray-400 mx-auto" />
            : <p className="text-lg font-bold text-gray-900">{stats?.totalEbooks ?? 0}</p>
          }
          <p className="text-[10px] text-gray-500 uppercase mt-1">Tổng tài liệu</p>
        </Card>
        <Card className="p-3 text-center">
          {loading
            ? <Loader2 size={16} className="animate-spin text-gray-400 mx-auto" />
            : <p className="text-lg font-bold text-gray-900">{stats?.completed ?? 0}</p>
          }
          <p className="text-[10px] text-gray-500 uppercase mt-1">Đã xử lý</p>
        </Card>
        <Card className="p-3 text-center">
          {loading
            ? <Loader2 size={16} className="animate-spin text-emerald-500 mx-auto" />
            : <p className="text-lg font-bold text-emerald-600">{chunkK}</p>
          }
          <p className="text-[10px] text-emerald-600/70 uppercase mt-1">Chunks index</p>
        </Card>
      </div>
    </div>
  );
};

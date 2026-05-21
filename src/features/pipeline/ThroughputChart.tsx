"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import type { Job, PipelineStats } from "@/types/pipeline";
import { Activity, BarChart3, Clock3 } from "lucide-react";

interface ThroughputChartProps {
  jobs?: Job[];
  stats?: PipelineStats | null;
}

export const ThroughputChart = ({ jobs = [], stats }: ThroughputChartProps) => {
  const runningJobs = useMemo(() => jobs.filter((job) => job.status === "running"), [jobs]);
  const averageProgress = useMemo(() => {
    if (runningJobs.length === 0) {
      return 0;
    }

    return Math.round(
      runningJobs.reduce((sum, job) => sum + (Number(job.progress) || 0), 0) / runningJobs.length,
    );
  }, [runningJobs]);

  const cards = [
    {
      label: "Jobs đang chạy",
      value: String(runningJobs.length),
      icon: Activity,
      tone: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Chunks đã tạo",
      value: String(stats?.chunksCreated ?? 0),
      icon: BarChart3,
      tone: "text-blue-600 bg-blue-100",
    },
    {
      label: "Tiến độ TB",
      value: `${averageProgress}%`,
      icon: Clock3,
      tone: "text-amber-600 bg-amber-100",
    },
  ] as const;

  return (
    <Card className="flex flex-col p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">Thông lượng xử lý</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="mt-1 text-xs text-gray-500">{card.label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

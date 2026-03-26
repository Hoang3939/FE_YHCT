import React from "react";
import { Card } from "@/components/ui/Card";
import { MOCK_PIPELINE_STATS } from "@/types/pipeline";
import { formatNumber } from "@/lib/utils";
import {
  Zap, CheckCircle2, XCircle, Clock3,
  Layers, Cpu, Timer, TrendingUp,
} from "lucide-react";

interface StatTile {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

/**
 * PipelineSummary Component
 * 8 thẻ thống kê tổng quan pipeline: jobs, chunks, tokens, tốc độ, tỉ lệ thành công
 */
export const PipelineSummary = () => {
  const s = MOCK_PIPELINE_STATS;

  const tiles: StatTile[] = [
    { label: "Jobs hôm nay",         value: String(s.jobsToday),            icon: Zap,          color: "text-slate-600",   bg: "bg-slate-100"   },
    { label: "Hoàn thành",           value: String(s.completed),            icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Thất bại",             value: String(s.failed),               icon: XCircle,      color: "text-red-500",     bg: "bg-red-100"     },
    { label: "Chờ trong queue",      value: String(s.queued),               icon: Clock3,       color: "text-yellow-600",  bg: "bg-yellow-100"  },
    { label: "Chunks tạo ra",        value: formatNumber(s.chunksCreated),  icon: Layers,       color: "text-blue-600",    bg: "bg-blue-100"    },
    { label: "Tokens xử lý",         value: s.tokensProcessed,              icon: Cpu,          color: "text-purple-600",  bg: "bg-purple-100"  },
    { label: "Thời gian TB (giây)",  value: String(s.avgTimeSeconds) + "s", icon: Timer,        color: "text-cyan-600",    bg: "bg-cyan-100"    },
    { label: "Tỉ lệ thành công",     value: s.successRate + "%",            icon: TrendingUp,   color: "text-teal-600",    bg: "bg-teal-100"    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-5">
      {tiles.map((tile) => (
        <Card key={tile.label} className="flex flex-col gap-2 p-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tile.bg}`}>
            <tile.icon size={16} className={tile.color} />
          </div>
          <p className="text-xl font-bold text-gray-900 leading-none">{tile.value}</p>
          <p className="text-[10px] text-gray-500 leading-tight">{tile.label}</p>
        </Card>
      ))}
    </div>
  );
};

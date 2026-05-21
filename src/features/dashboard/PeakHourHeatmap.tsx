"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

const CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_BASE_URL || 'http://localhost:3002';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('accessToken') || '';
}

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const HOURS = ["6h", "8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];
const EMPTY_GRID = () => Array.from({ length: 7 }, () => Array(9).fill(0));

function toIntensity(value: number, max: number): number {
  if (max === 0 || value === 0) return 0;
  const ratio = value / max;
  if (ratio < 0.1) return 1;
  if (ratio < 0.3) return 2;
  if (ratio < 0.55) return 3;
  if (ratio < 0.8) return 4;
  return 5;
}

/**
 * PeakHourHeatmap Component
 * Biểu đồ nhiệt từ API thật /chat/stats/heatmap
 */
export const PeakHourHeatmap = () => {

  const [grid, setGrid] = useState<number[][]>(EMPTY_GRID());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${CHAT_BASE_URL}/chat/stats/heatmap`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) {
          const json = await res.json() as { grid?: number[][] };
          if (json.grid) setGrid(json.grid);
        }
      } catch { /* fallback empty */ } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const maxVal = Math.max(1, ...grid.flat());

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-gray-50";
      case 1: return "bg-emerald-100";
      case 2: return "bg-emerald-200";
      case 3: return "bg-emerald-400";
      case 4: return "bg-emerald-600";
      case 5: return "bg-emerald-800";
      default: return "bg-gray-50";
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-4 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Heatmap Giờ cao điểm</h3>
          <p className="text-sm text-gray-500">Tần suất truy cập theo khung giờ và ngày trong tuần - 30 ngày gần nhất</p>
        </div>
        {loading && <Loader2 size={16} className="animate-spin text-gray-400" />}
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header row (hours) */}
          <div className="flex mb-2">
            <div className="w-12" />
            <div className="flex-1 grid grid-cols-9 gap-2 px-2">
              {HOURS.map((hour, idx) => (
                <div key={idx} className="text-xs text-center text-gray-500 font-medium">{hour}</div>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex flex-col gap-2">
            {DAYS.map((day, dayIdx) => (
              <div key={dayIdx} className="flex items-center">
                <div className="w-12 text-sm text-gray-600 font-medium">{day}</div>
                <div className="flex-1 grid grid-cols-9 gap-2 px-2">
                  {HOURS.map((_, hourIdx) => {
                    const val = grid[dayIdx]?.[hourIdx] ?? 0;
                    const intensity = toIntensity(val, maxVal);
                    return (
                      <div
                        key={hourIdx}
                        className={`h-8 rounded-full transition-colors hover:ring-2 ring-emerald-300 ring-offset-1 ${
                          intensity === 0 ? 'bg-gray-50' : getIntensityColor(intensity)
                        }`}
                        title={`${day} lúc ${HOURS[hourIdx]} - ${val} phiên`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
        <span>Ít</span>
        <div className="flex gap-1.5 mx-2">
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className={`w-8 h-3 rounded-full ${getIntensityColor(level)}`}></div>
          ))}
        </div>
        <span>Nhiều</span>
      </div>
    </Card>
  );
};

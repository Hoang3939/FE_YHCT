import React from "react";
import { Card } from "@/components/ui/Card";
import { CLASSIFICATION_STATS } from "@/types/document";
import { formatNumber } from "@/lib/utils";

/**
 * DocClassificationBar Component
 * Thanh progress nằm ngang chia tỉ lệ theo phân loại tài liệu,
 * kèm legend phía dưới.
 */
export const DocClassificationBar = () => {
  const total = CLASSIFICATION_STATS.reduce((sum, s) => sum + s.count, 0);

  return (
    <Card className="mb-6 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Phân loại tài liệu</h3>
          <p className="text-xs text-gray-400 mt-0.5">Tỉ lệ theo danh mục — {total} tổng</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {CLASSIFICATION_STATS.map((stat) => {
          const pct = ((stat.count / total) * 100).toFixed(1);
          return (
            <div
              key={stat.type}
              className={`${stat.bgClass} transition-all`}
              style={{ width: `${pct}%` }}
              title={`${stat.type}: ${pct}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
        {CLASSIFICATION_STATS.map((stat) => {
          const pct = ((stat.count / total) * 100).toFixed(0);
          return (
            <div key={stat.type} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: stat.color }}
              />
              <span className="text-gray-600">{stat.type}</span>
              <span className="font-semibold text-gray-800">{formatNumber(stat.count)}</span>
              <span className="text-gray-400">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

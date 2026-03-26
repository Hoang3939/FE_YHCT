import React from "react";
import { Card } from "@/components/ui/Card";

/**
 * PeakHourHeatmap Component
 * Biểu đồ nhiệt hiển thị giờ cao điểm dựa trên thiết kế
 */
export const PeakHourHeatmap = () => {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const hours = ["6h", "8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];

  // Mock data generation: higher intensity in the middle of the week and middle of the day
  const generateIntensity = (dayIdx: number, hourIdx: number) => {
    // 0: empty, 1: very light, 2: light, 3: medium, 4: dark, 5: very dark
    if (dayIdx >= 5) { // Weekend
      if (hourIdx < 2 || hourIdx > 6) return 1;
      return 3;
    }
    
    // Weekday
    if (hourIdx < 2) return Math.random() > 0.5 ? 1 : 2;
    if (hourIdx > 7) return 2;
    
    // Peak hours (14h-18h)
    if (hourIdx >= 4 && hourIdx <= 6) return 4 + (Math.random() > 0.5 ? 1 : 0);
    
    return 3;
  };

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
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Heatmap Giờ cao điểm</h3>
        <p className="text-sm text-gray-500">Tần suất truy cập theo khung giờ và ngày trong tuần</p>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header row (hours) */}
          <div className="flex mb-2">
            <div className="w-12"></div> {/* Empty space for day column */}
            <div className="flex-1 grid grid-cols-9 gap-2 px-2">
              {hours.map((hour, idx) => (
                <div key={idx} className="text-xs text-center text-gray-500 font-medium">
                  {hour}
                </div>
              ))}
            </div>
          </div>

          {/* Grid setup */}
          <div className="flex flex-col gap-2">
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="flex items-center">
                <div className="w-12 text-sm text-gray-600 font-medium">{day}</div>
                <div className="flex-1 grid grid-cols-9 gap-2 px-2">
                  {hours.map((_, hourIdx) => {
                    const intensity = generateIntensity(dayIdx, hourIdx);
                    // Add some blank spots randomly for visual fidelity to wireframe
                    const isBlank = Math.random() < 0.1 && intensity < 3;
                    
                    return (
                      <div
                        key={hourIdx}
                        className={`h-8 rounded-full transition-colors hover:ring-2 ring-emerald-300 ring-offset-1 ${
                          isBlank ? 'bg-transparent' : getIntensityColor(intensity)
                        }`}
                        title={`${day} lúc ${hours[hourIdx]} - Mức: ${intensity}`}
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

import React from "react";
import { SummaryCards } from "@/features/dashboard/SummaryCards";
import { TrafficLineChart } from "@/features/dashboard/TrafficLineChart";
import { PeakHourHeatmap } from "@/features/dashboard/PeakHourHeatmap";
import { UserPieChart } from "@/features/dashboard/UserPieChart";
import { FeedbackBarChart } from "@/features/dashboard/FeedbackBarChart";
import { RecentActivityList } from "@/features/dashboard/RecentActivityList";
import { Card } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <div className="bg-emerald-700 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center shadow-md border-b-4 border-emerald-800">
        <div>
          <p className="text-emerald-100 text-sm font-medium tracking-wide uppercase mb-1">CHÀO MỪNG TRỞ LẠI, ADMIN NGUYỄN</p>
          <h2 className="text-2xl font-bold">Hệ thống RAG hoạt động bình thường - 94.3% độ chính xác truy xuất</h2>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <div className="text-right">
             <p className="text-emerald-100 text-xs">Truy vấn hôm nay</p>
             <p className="text-3xl font-bold">2,847</p>
          </div>
          <div className="text-right hidden sm:block">
             <p className="text-emerald-100 text-xs">Bài thuốc đã index</p>
             <p className="text-3xl font-bold">8,492</p>
          </div>
          <div className="text-right hidden lg:block">
             <p className="text-emerald-100 text-xs">Uptime</p>
             <p className="text-3xl font-bold">99.8%</p>
          </div>
        </div>
      </div>

      {/* Row 1: Summary Cards */}
      <SummaryCards />

      {/* Row 2: Traffic Line Chart & Small Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TrafficLineChart />
        
        {/* Right side stats of Row 2 */}
        <div className="col-span-1 flex flex-col gap-6">
          <Card className="flex-1 bg-white border border-gray-100 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">Hiệu suất hệ thống - Cập nhật 30s</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     Vector Database
                  </span>
                  <span className="font-bold">94.3%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '94.3%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                     Embedding Model
                  </span>
                  <span className="font-bold flex items-center gap-1 text-xs">
                     <span className="text-orange-500 bg-orange-50 px-1 py-0.5 rounded">128ms</span> latency
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                     Server Memory
                  </span>
                  <span className="font-bold text-xs">
                     7.2 <span className="text-gray-500 font-normal">GB / 16GB</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                     Retrieval Accuracy
                  </span>
                  <span className="font-bold">91.7%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full" style={{ width: '91.7%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3">
             <Card className="p-3 text-center">
                <p className="text-lg font-bold text-gray-900">8,492</p>
                <p className="text-[10px] text-gray-500 uppercase mt-1">Tổng bài thuốc</p>
             </Card>
             <Card className="p-3 text-center">
                <p className="text-lg font-bold text-gray-900">2,134</p>
                <p className="text-[10px] text-gray-500 uppercase mt-1">Dược liệu</p>
             </Card>
             <Card className="p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">142K</p>
                <p className="text-[10px] text-emerald-600/70 uppercase mt-1">Chunks đã index</p>
             </Card>
          </div>
        </div>
      </div>

      {/* Row 3: Heatmap */}
      <div className="grid grid-cols-1">
        <PeakHourHeatmap />
      </div>

      {/* Row 4: 3 Columns Chart & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserPieChart />
        <FeedbackBarChart />
        <RecentActivityList />
      </div>
    </div>
  );
}

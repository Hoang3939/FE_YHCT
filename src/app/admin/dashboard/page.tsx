import React from "react";
import { SummaryCards } from "@/features/dashboard/SummaryCards";
import { TrafficLineChart } from "@/features/dashboard/TrafficLineChart";
import { PeakHourHeatmap } from "@/features/dashboard/PeakHourHeatmap";
import { UserPieChart } from "@/features/dashboard/UserPieChart";
import { FeedbackBarChart } from "@/features/dashboard/FeedbackBarChart";
import { RecentActivityList } from "@/features/dashboard/RecentActivityList";
import { SystemHealthPanel } from "@/features/dashboard/SystemHealthPanel";
import { WelcomeBanner } from "@/features/dashboard/WelcomeBanner";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Row 1: Summary Cards */}
      <SummaryCards />

      {/* Row 2: Traffic Line Chart & System Health Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TrafficLineChart />
        <SystemHealthPanel />
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

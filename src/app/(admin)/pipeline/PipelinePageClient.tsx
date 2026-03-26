"use client";

import React from "react";
import { PipelineSummary }   from "@/features/pipeline/PipelineSummary";
import { EngineStatusBar }   from "@/features/pipeline/EngineStatusBar";
import { PipelineStepper }   from "@/features/pipeline/PipelineStepper";
import { ThroughputChart }   from "@/features/pipeline/ThroughputChart";
import { WorkerNodes }       from "@/features/pipeline/WorkerNodes";
import { JobQueueTable }     from "@/features/pipeline/JobQueueTable";
import { TerminalLog }       from "@/features/pipeline/TerminalLog";

/**
 * PipelinePageClient
 * Client component lắp ráp toàn bộ giao diện trang Vận hành Pipeline RAG.
 * Sơ đồ bố cục:
 *   1. PipelineSummary (8 tiles thống kê)
 *   2. EngineStatusBar (dark bar trạng thái engine)
 *   3. PipelineStepper (6-step flowchart + progress tổng)
 *   4. [Left 70%] ThroughputChart | [Right 30%] WorkerNodes
 *   5. JobQueueTable (bảng jobs)
 *   6. TerminalLog (terminal nền đen)
 */
const PipelinePageClient = () => (
  <div className="flex flex-col gap-5 max-w-[1600px] mx-auto">
    {/* Row 1: Stats */}
    <PipelineSummary />

    {/* Row 2: Engine bar */}
    <EngineStatusBar />

    {/* Row 3: Flowchart */}
    <PipelineStepper />

    {/* Row 4: Chart 70% + Workers 30% */}
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
      <div className="lg:col-span-7">
        <ThroughputChart />
      </div>
      <div className="lg:col-span-3">
        <WorkerNodes />
      </div>
    </div>

    {/* Row 5: Job queue */}
    <JobQueueTable />

    {/* Row 6: Terminal log */}
    <TerminalLog />
  </div>
);

export default PipelinePageClient;

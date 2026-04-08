"use client";

import React, { useEffect, useState } from "react";
import { PipelineSummary }   from "@/features/pipeline/PipelineSummary";
import { EngineStatusBar }   from "@/features/pipeline/EngineStatusBar";
import { PipelineStepper }   from "@/features/pipeline/PipelineStepper";
import { ThroughputChart }   from "@/features/pipeline/ThroughputChart";
import { WorkerNodes }       from "@/features/pipeline/WorkerNodes";
import { JobQueueTable }     from "@/features/pipeline/JobQueueTable";
import { TerminalLog }       from "@/features/pipeline/TerminalLog";
import type { Job, PipelineStats } from "@/types/pipeline";

const PIPELINE_BASE_URL = process.env.NEXT_PUBLIC_PIPELINE_BASE_URL ?? "http://localhost:3006";

/**
 * PipelinePageClient
 * Client component lắp ráp toàn bộ giao diện trang Vận hành Pipeline RAG.
 */
const PipelinePageClient = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          fetch(`${PIPELINE_BASE_URL}/pipelines`),
          fetch(`${PIPELINE_BASE_URL}/pipelines/stats`)
        ]);

        if (jobsRes.ok) {
          const result = await jobsRes.json();
          setJobs(result.data || []);
        }
        if (statsRes.ok) {
          const result = await statsRes.json();
          setStats(result.data || null);
        }
      } catch (error) {
        console.error("Failed to fetch pipeline data", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto">
      {/* Row 1: Stats */}
      <PipelineSummary stats={stats} />

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
    <JobQueueTable jobs={jobs} />

    {/* Row 6: Terminal log */}
    <TerminalLog />
  </div>
  );
};

export default PipelinePageClient;

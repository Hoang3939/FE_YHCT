"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { PipelineSummary }   from "@/features/pipeline/PipelineSummary";
import { EngineStatusBar }   from "@/features/pipeline/EngineStatusBar";
import { PipelineStepper }   from "@/features/pipeline/PipelineStepper";
import { ThroughputChart }   from "@/features/pipeline/ThroughputChart";
import { WorkerNodes }       from "@/features/pipeline/WorkerNodes";
import { JobQueueTable }     from "@/features/pipeline/JobQueueTable";
import { TerminalLog }       from "@/features/pipeline/TerminalLog";
import type { Job, PipelineStats } from "@/types/pipeline";
import { MOCK_JOBS, MOCK_PIPELINE_STATS } from "@/types/pipeline";

const PIPELINE_BASE_URL = process.env.NEXT_PUBLIC_PIPELINE_BASE_URL ?? "";
const POLL_INTERVAL_MS = 10_000;
const MAX_CONSECUTIVE_ERRORS = 3;

/**
 * PipelinePageClient
 * Client component lắp ráp toàn bộ giao diện trang Vận hành Pipeline RAG.
 */
const PipelinePageClient = () => {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [stats, setStats] = useState<PipelineStats | null>(MOCK_PIPELINE_STATS);
  const errorCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!PIPELINE_BASE_URL) return;

    try {
      const [jobsRes, statsRes] = await Promise.all([
        fetch(`${PIPELINE_BASE_URL}/pipelines`),
        fetch(`${PIPELINE_BASE_URL}/pipelines/stats`)
      ]);

      if (jobsRes.ok) {
        const result: { data?: Job[] } = await jobsRes.json();
        setJobs(result.data ?? MOCK_JOBS);
      }
      if (statsRes.ok) {
        const result: { data?: PipelineStats } = await statsRes.json();
        setStats(result.data ?? MOCK_PIPELINE_STATS);
      }
      errorCountRef.current = 0;
    } catch (error: unknown) {
      errorCountRef.current += 1;
      if (errorCountRef.current <= MAX_CONSECUTIVE_ERRORS) {
        const message = error instanceof Error ? error.message : String(error);
        // eslint-disable-next-line no-console
        console.warn(`[Pipeline] Fetch failed (${errorCountRef.current}/${MAX_CONSECUTIVE_ERRORS}): ${message}`);
      }
      if (errorCountRef.current >= MAX_CONSECUTIVE_ERRORS) {
        stopPolling();
      }
    }
  }, [stopPolling]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => stopPolling();
  }, [fetchData, stopPolling]);

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

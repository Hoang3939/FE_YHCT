"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PipelineSummary } from "@/features/pipeline/PipelineSummary";
import { EngineStatusBar } from "@/features/pipeline/EngineStatusBar";
import { PipelineStepper } from "@/features/pipeline/PipelineStepper";
import { ThroughputChart } from "@/features/pipeline/ThroughputChart";
import { WorkerNodes } from "@/features/pipeline/WorkerNodes";
import { JobQueueTable } from "@/features/pipeline/JobQueueTable";
import { TerminalLog } from "@/features/pipeline/TerminalLog";
import type { Job, PipelineStats } from "@/types/pipeline";
import { deletePipelineJob } from "@/services/api/dashboard.service";

const PIPELINE_BASE_URL = process.env.NEXT_PUBLIC_PIPELINE_BASE_URL ?? "http://localhost:3006";

const PipelinePageClient = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setIsRefreshing(true);
      }

      try {
        const [jobsRes, statsRes] = await Promise.all([
          fetch(`${PIPELINE_BASE_URL}/pipelines`, { cache: "no-store" }),
          fetch(`${PIPELINE_BASE_URL}/pipelines/stats`, { cache: "no-store" }),
        ]);

        if (!isMounted) {
          return;
        }

        if (jobsRes.ok) {
          const result = await jobsRes.json();
          setJobs(Array.isArray(result.data) ? result.data : []);
        }

        if (statsRes.ok) {
          const result = await statsRes.json();
          setStats(result.data || null);
        }
      } catch (error) {
        console.error("Failed to fetch pipeline data", error);
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
        }
      }
    };

    void fetchData();
    const interval = window.setInterval(() => {
      void fetchData();
    }, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Xác nhận xóa job này?")) return;
    try {
      await deletePipelineJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      alert("Xóa job thất bại");
    }
  };

  const activeJob = useMemo(() => {
    return jobs.find((job) => job.status === "running") ?? jobs.find((job) => job.status === "queued") ?? null;
  }, [jobs]);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-5">
      <PipelineSummary stats={stats} />
      <EngineStatusBar jobs={jobs} stats={stats} isRefreshing={isRefreshing} />
      <PipelineStepper activeJob={activeJob} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-10">
        <div className="lg:col-span-7">
          <ThroughputChart jobs={jobs} stats={stats} />
        </div>
        <div className="lg:col-span-3">
          <WorkerNodes jobs={jobs} />
        </div>
      </div>

      <JobQueueTable jobs={jobs} onDelete={handleDeleteJob} />
      <TerminalLog jobs={jobs} />
    </div>
  );
};

export default PipelinePageClient;

import React from "react";
import { Card } from "@/components/ui/Card";
import { DEFAULT_PIPELINE_STEPS, type Job, type PipelineStep, type StepStatus } from "@/types/pipeline";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Download,
  Braces,
  Scissors,
  Layers,
  Database,
  ShieldCheck,
  Circle,
  Loader2,
  ChevronRight,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Download,
  Braces,
  Scissors,
  Layers,
  Database,
  ShieldCheck,
};

const StepIcon = ({ iconName, status }: { iconName: string; status: StepStatus }) => {
  const Icon = ICON_MAP[iconName] ?? Circle;
  const configs: Record<StepStatus, { ring: string; bg: string; text: string }> = {
    done: { ring: "ring-emerald-400", bg: "bg-emerald-500", text: "text-white" },
    active: { ring: "ring-amber-300", bg: "bg-amber-400", text: "text-slate-900" },
    pending: { ring: "ring-slate-200", bg: "bg-slate-100", text: "text-slate-400" },
    error: { ring: "ring-red-300", bg: "bg-red-500", text: "text-white" },
  };
  const cfg = configs[status];

  return (
    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ring-2 ${cfg.ring} ${cfg.bg}`}>
      {status === "active" ? (
        <Loader2 size={26} className={`${cfg.text} animate-spin`} />
      ) : (
        <Icon size={26} className={cfg.text} />
      )}
    </div>
  );
};

const StepBadge = ({ status }: { status: StepStatus }) => {
  const map: Record<StepStatus, string> = {
    done: "bg-emerald-100 text-emerald-700",
    active: "bg-amber-100 text-amber-700",
    pending: "bg-slate-100 text-slate-500",
    error: "bg-red-100 text-red-600",
  };

  const labels: Record<StepStatus, string> = {
    done: "Hoàn thành",
    active: "Đang chạy",
    pending: "Chờ",
    error: "Lỗi",
  };

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}>{labels[status]}</span>;
};

function buildPipelineSteps(activeJob?: Job | null): PipelineStep[] {
  if (!activeJob) {
    return DEFAULT_PIPELINE_STEPS;
  }

  const progress = Math.max(0, Math.min(100, Number(activeJob.progress) || 0));
  const activeIndex =
    activeJob.status === "success"
      ? DEFAULT_PIPELINE_STEPS.length - 1
      : activeJob.status === "failed"
        ? Math.min(DEFAULT_PIPELINE_STEPS.length - 1, Math.max(0, Math.ceil(progress / 20) - 1))
        : Math.min(DEFAULT_PIPELINE_STEPS.length - 1, Math.floor(progress / 20));

  return DEFAULT_PIPELINE_STEPS.map((step, index) => {
    let status: StepStatus = "pending";

    if (activeJob.status === "failed" && index === activeIndex) {
      status = "error";
    } else if (activeJob.status === "success") {
      status = "done";
    } else if (index < activeIndex) {
      status = "done";
    } else if (index === activeIndex && activeJob.status === "running") {
      status = "active";
    }

    return {
      ...step,
      status,
    };
  });
}

function resolveActiveStepLabel(steps: PipelineStep[], activeJob?: Job | null): string {
  if (!activeJob) {
    return "Chưa có pipeline đang xử lý";
  }

  if (activeJob.currentStep) {
    return activeJob.currentStep;
  }

  if (activeJob.status === "failed") {
    return "Pipeline gặp lỗi và cần kiểm tra";
  }

  if (activeJob.status === "success") {
    return "Pipeline đã hoàn tất";
  }

  const activeStep = steps.find((step) => step.status === "active");
  return activeStep ? `${activeStep.label} — ${activeStep.sublabel}` : "Đang chờ worker tiếp nhận";
}

export const PipelineStepper = ({ activeJob }: { activeJob?: Job | null }) => {
  const overallProgress = Math.max(0, Math.min(100, Number(activeJob?.progress) || 0));
  const steps = buildPipelineSteps(activeJob);
  const activeStepLabel = resolveActiveStepLabel(steps, activeJob);

  return (
    <Card className="mb-5 p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Sơ đồ luồng xử lý</h3>
          <p className="mt-0.5 text-sm text-gray-400">{activeStepLabel}</p>
        </div>
        <span className="text-lg font-bold text-emerald-600">{overallProgress}%</span>
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto px-2 py-3">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex min-w-[120px] flex-col items-center gap-3">
              <StepIcon iconName={step.icon} status={step.status} />
              <div className="text-center">
                <p
                  className={`text-sm font-semibold ${
                    step.status === "active"
                      ? "text-amber-700"
                      : step.status === "done"
                        ? "text-emerald-700"
                        : step.status === "error"
                          ? "text-red-600"
                          : "text-slate-500"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-1 text-xs text-gray-400">{step.sublabel}</p>
                <div className="mt-2">
                  <StepBadge status={step.status} />
                </div>
              </div>
            </div>
            {index < steps.length - 1 && <ChevronRight size={22} className="mb-6 shrink-0 text-gray-300" />}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm text-gray-500">
          <span>Tiến trình tổng thể</span>
          <span className="font-semibold text-gray-800">{overallProgress}%</span>
        </div>
        <ProgressBar value={overallProgress} fillClassName="bg-emerald-500" />
      </div>
    </Card>
  );
};

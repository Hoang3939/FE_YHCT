import React from "react";
import { Card } from "@/components/ui/Card";
import { MOCK_PIPELINE_STEPS } from "@/types/pipeline";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  Download, Braces, Scissors, Layers, Database, ShieldCheck,
  CheckCircle2, Circle, Loader2, AlertCircle, ChevronRight,
} from "lucide-react";

// Map icon name string → Lucide component
const ICON_MAP: Record<string, React.ElementType> = {
  Download, Braces, Scissors, Layers, Database, ShieldCheck,
};

/** Render icon + ring màu theo trạng thái */
const StepIcon = ({ iconName, status }: { iconName: string; status: string }) => {
  const Icon = ICON_MAP[iconName] ?? Circle;
  const configs: Record<string, { ring: string; bg: string; text: string }> = {
    done:    { ring: "ring-emerald-400", bg: "bg-emerald-500", text: "text-white"      },
    active:  { ring: "ring-yellow-400",  bg: "bg-yellow-400",  text: "text-gray-900"   },
    pending: { ring: "ring-gray-200",    bg: "bg-gray-100",    text: "text-gray-400"   },
    error:   { ring: "ring-red-400",     bg: "bg-red-500",     text: "text-white"      },
  };
  const cfg = configs[status] ?? configs.pending;

  return (
    <div className={`w-11 h-11 rounded-full ring-2 ${cfg.ring} ${cfg.bg} flex items-center justify-center shrink-0`}>
      {status === "active" ? (
        <Loader2 size={18} className={`${cfg.text} animate-spin`} />
      ) : (
        <Icon size={18} className={cfg.text} />
      )}
    </div>
  );
};

/** Badge trạng thái mỗi step */
const StepBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    done:    "bg-emerald-100 text-emerald-700",
    active:  "bg-yellow-100  text-yellow-700",
    pending: "bg-gray-100    text-gray-500",
    error:   "bg-red-100     text-red-600",
  };
  const labels: Record<string, string> = {
    done: "Hoàn thành", active: "Đang chạy", pending: "Chờ", error: "Lỗi",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] ?? map.pending}`}>
      {labels[status] ?? "Chờ"}
    </span>
  );
};

/**
 * PipelineStepper Component
 * Sơ đồ 6 bước xử lý pipeline với icon, badge trạng thái và progress tổng
 */
export const PipelineStepper = () => {
  const overallProgress = 71;

  return (
    <Card className="mb-5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Sơ đồ luồng xử lý</h3>
          <p className="text-xs text-gray-400">Trạng thái pipeline hiện tại — bước đang chạy: Vector hóa</p>
        </div>
        <span className="text-sm font-bold text-emerald-600">{overallProgress}%</span>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {MOCK_PIPELINE_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 min-w-[90px]">
              <StepIcon iconName={step.icon} status={step.status} />
              <div className="text-center">
                <p className={`text-xs font-semibold ${step.status === "active" ? "text-yellow-700" : step.status === "done" ? "text-emerald-700" : "text-gray-500"}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{step.sublabel}</p>
                <div className="mt-1.5">
                  <StepBadge status={step.status} />
                </div>
              </div>
            </div>
            {index < MOCK_PIPELINE_STEPS.length - 1 && (
              <ChevronRight size={16} className="text-gray-300 shrink-0 mb-4" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Overall progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Tiến trình tổng thể</span>
          <span className="font-semibold text-gray-800">{overallProgress}%</span>
        </div>
        <ProgressBar value={overallProgress} fillClassName="bg-emerald-500" />
      </div>
    </Card>
  );
};

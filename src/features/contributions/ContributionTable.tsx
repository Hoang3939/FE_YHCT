"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { ContributionRow } from "@/features/contributions/ContributionRow";
import {
  fetchContributions,
  fetchLatestContributionPipeline,
} from "@/services/api/contribution.service";

const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || 'http://localhost:3004';
import type {
  KnowledgeContribution,
  ContributionStatus,
  ContributionPipelineJob,
} from "@/types/contribution";

type TabKey = "all" | ContributionStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "approved", label: "Đã duyệt" },
  { key: "rejected", label: "Từ chối" },
];

interface ContributionTableProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/**
 * ContributionTable — Danh sách đóng góp với tabs lọc + tìm kiếm.
 * Fetch data từ BE contribution-service.
 */
export const ContributionTable = ({
  selectedId,
  onSelect,
}: ContributionTableProps) => {
  const [contributions, setContributions] = useState<KnowledgeContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pipelineJobs, setPipelineJobs] = useState<Record<string, ContributionPipelineJob | null>>({});
  const [pipelineLoading, setPipelineLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPipelines = async (items: KnowledgeContribution[]) => {
      const approvedIds = items
        .filter((item) => item.status === "approved")
        .map((item) => item.contributionId);

      if (approvedIds.length === 0) {
        if (!cancelled) {
          setPipelineJobs({});
          setPipelineLoading(false);
        }
        return;
      }

      setPipelineLoading(true);

      try {
        const results = await Promise.all(
          approvedIds.map(async (contributionId) => {
            try {
              const job = await fetchLatestContributionPipeline(contributionId);
              return [contributionId, job] as const;
            } catch {
              return [contributionId, null] as const;
            }
          }),
        );

        if (!cancelled) {
          setPipelineJobs((prev) => ({ ...prev, ...Object.fromEntries(results) }));
        }
      } finally {
        if (!cancelled) {
          setPipelineLoading(false);
        }
      }
    };

    const loadContributions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchContributions();
        if (!cancelled) {
          setContributions(data);
        }
        await loadPipelines(data);
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Không thể tải danh sách đóng góp";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadContributions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (contributions.length === 0) {
      return;
    }

    let cancelled = false;

    const refreshPipelines = async () => {
      const approvedItems = contributions.filter((item) => item.status === "approved");
      if (approvedItems.length === 0) {
        if (!cancelled) {
          setPipelineJobs({});
          setPipelineLoading(false);
        }
        return;
      }

      setPipelineLoading(true);
      try {
        const results = await Promise.all(
          approvedItems.map(async (item) => {
            try {
              const job = await fetchLatestContributionPipeline(item.contributionId);
              return [item.contributionId, job] as const;
            } catch {
              return [item.contributionId, null] as const;
            }
          }),
        );

        if (!cancelled) {
          setPipelineJobs((prev) => ({ ...prev, ...Object.fromEntries(results) }));
        }
      } finally {
        if (!cancelled) {
          setPipelineLoading(false);
        }
      }
    };

    const interval = window.setInterval(() => {
      void refreshPipelines();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [contributions]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return contributions.filter((c) => {
      if (activeTab !== "all" && c.status !== activeTab) return false;
      if (q && !c.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [contributions, activeTab, searchQuery]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Danh sách đóng góp
        </h2>

        {/* Tabs */}
        <div className="flex gap-1 mb-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm đóng góp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading && (
          <div className="p-8 text-center text-sm text-gray-400">
            Đang tải...
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-400">
            Không có đóng góp nào
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 text-left font-medium">Tiêu đề</th>
                <th className="py-2.5 px-3 text-left font-medium">Loại</th>
                <th className="py-2.5 px-3 text-left font-medium">Trạng thái</th>
                <th className="py-2.5 px-3 text-left font-medium">Ngày tạo</th>
                <th className="py-2.5 px-3 text-left font-medium">Pipeline</th>
                <th className="py-2.5 px-3 text-left font-medium">Ngày duyệt</th>
                <th className="py-2.5 px-3 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <ContributionRow
                  key={c.contributionId}
                  contribution={c}
                  pipelineJob={pipelineJobs[c.contributionId] ?? null}
                  pipelineLoading={pipelineLoading}
                  onClick={onSelect}
                  selected={selectedId === c.contributionId}
                  onPublish={async (ebookId) => {
                    try {
                      const token = localStorage.getItem('accessToken');
                      const res = await fetch(`${CATALOG_BASE_URL}/ebooks/${ebookId}/publish`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                      });
                      if (!res.ok) throw new Error('Xuất bản thất bại.');
                      alert('Đã xuất bản ebook thành công.');
                    } catch (error) {
                      alert(error instanceof Error ? error.message : 'Xuất bản thất bại.');
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

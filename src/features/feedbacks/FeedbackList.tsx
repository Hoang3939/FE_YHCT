"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FeedbackTabs, type FeedbackTabKey } from "@/features/feedbacks/FeedbackTabs";
import { FeedbackRow } from "@/features/feedbacks/FeedbackRow";
import { MOCK_FEEDBACKS } from "@/types/feedback";
import type { Feedback } from "@/types/feedback";
import { sortFeedbacks } from "@/lib/utils";
import { fetchFeedbacks } from "@/services/api/feedback.service";

type SortKey = keyof Feedback;

interface FeedbackListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/**
 * FeedbackList Component
 * Cột trái của Split View: tiêu đề, filter, tabs, bảng danh sách góp ý với sort.
 */
export const FeedbackList = ({ selectedId, onSelect }: FeedbackListProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab]     = useState<FeedbackTabKey>("all");
  const [sortKey, setSortKey]         = useState<SortKey>("createdAt");
  const [sortDir, setSortDir]         = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchFeedbacks();
        if (!cancelled) {
          setFeedbacks(data);
        }
      } catch {
        // API unavailable — keep MOCK_FEEDBACKS as fallback
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const base = feedbacks.filter((f) => {
      if (activeTab !== "all" && f.status !== activeTab) return false;
      if (
        q &&
        !f.title.toLowerCase().includes(q) &&
        !f.author.name.toLowerCase().includes(q) &&
        !f.id.toLowerCase().includes(q)
      ) return false;
      return true;
    });
    return sortFeedbacks(base as unknown as Record<string, unknown>[], sortKey as string, sortDir) as unknown as Feedback[];
  }, [feedbacks, searchQuery, activeTab, sortKey, sortDir]);

  const handleSortToggle = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const headers: { label: string; key?: SortKey; cls: string }[] = [
    { label: "ID",             key: "id",        cls: "w-20" },
    { label: "Tiêu đề / Tác giả",               cls: "min-w-[240px]" },
    { label: "Loại",           key: "type",      cls: "w-32" },
    { label: "Ưu tiên",        key: "priority",  cls: "w-24" },
    { label: "Trạng thái",     key: "status",    cls: "w-32" },
    { label: "Thời gian",      key: "createdAt", cls: "w-24" },
    { label: "Upvotes",        key: "upvotes",   cls: "w-20" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Danh sách góp ý</h3>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} kết quả</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-1.5 h-9 text-xs">
              <SlidersHorizontal size={13} /> Bộ lọc
            </Button>
            <div className="w-52">
              <Input
                leftIcon={<Search size={13} />}
                placeholder="Tìm tiêu đề, tác giả, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {headers.map((h) => (
                <th
                  key={h.label}
                  className={`py-2.5 px-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider ${h.cls}`}
                >
                  {h.key ? (
                    <button
                      onClick={() => handleSortToggle(h.key!)}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      {h.label}
                      <ChevronDown
                        size={10}
                        className={`transition-transform ${
                          sortKey === h.key && sortDir === "asc" ? "rotate-180" : ""
                        } ${sortKey === h.key ? "text-emerald-500" : ""}`}
                      />
                    </button>
                  ) : h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                  Không có góp ý nào phù hợp.
                </td>
              </tr>
            )}
            {filtered.map((fb) => (
              <FeedbackRow
                key={fb.id}
                feedback={fb}
                onClick={onSelect}
                selected={selectedId === fb.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

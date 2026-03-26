"use client";

import React, { useState, useMemo } from "react";
import { DocSummaryCards } from "@/features/documents/DocSummaryCards";
import { DocClassificationBar } from "@/features/documents/DocClassificationBar";
import { DocTabs, type DocTabKey } from "@/features/documents/DocTabs";
import { DocToolbar } from "@/features/documents/DocToolbar";
import { DocGrid } from "@/features/documents/DocGrid";
import { DocPagination } from "@/features/documents/DocPagination";
import { MOCK_DOCUMENTS } from "@/types/document";
import type { SortOption } from "@/types/document";

/**
 * DocumentsPageClient
 * Client component chứa toàn bộ state: search, tab, sort, view mode, phân trang.
 */
const DocumentsPageClient = () => {
  const [searchQuery, setSearchQuery]   = useState("");
  const [activeTab, setActiveTab]       = useState<DocTabKey>("all");
  const [sortBy, setSortBy]             = useState<SortOption>("newest");
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(9);

  // Filter + search + sort
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let result = MOCK_DOCUMENTS.filter((doc) => {
      if (activeTab !== "all" && doc.type !== activeTab) return false;
      if (
        q &&
        !doc.title.toLowerCase().includes(q) &&
        !doc.author.toLowerCase().includes(q) &&
        !doc.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "views":   return b.metrics.views   - a.metrics.views;
        case "queries": return b.metrics.queries - a.metrics.queries;
        case "chunks":  return b.chunks          - a.chunks;
        case "newest":
        default:        return b.createdAt.localeCompare(a.createdAt);
      }
    });

    return result;
  }, [searchQuery, activeTab, sortBy]);

  // Pagination slice
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleSearch = (v: string) => { setSearchQuery(v); setCurrentPage(1); };
  const handleTab    = (t: DocTabKey) => { setActiveTab(t); setCurrentPage(1); };
  const handleSort   = (s: SortOption) => { setSortBy(s);  setCurrentPage(1); };

  return (
    <div className="flex flex-col gap-0 max-w-[1600px] mx-auto">
      <DocSummaryCards />
      <DocClassificationBar />

      <div>
        <DocTabs activeTab={activeTab} onTabChange={handleTab} />
        <DocToolbar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          sortBy={sortBy}
          onSortChange={handleSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <DocGrid documents={paginated} />
        <DocPagination
          total={filtered.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
        />
      </div>
    </div>
  );
};

export default DocumentsPageClient;

"use client";

import React, { useState, useMemo } from "react";
import { UserSummaryCards } from "@/features/users/UserSummaryCards";
import { UserTableToolbar, type TabFilter } from "@/features/users/UserTableToolbar";
import { UserTable } from "@/features/users/UserTable";
import { UserPagination } from "@/features/users/UserPagination";
import { Card } from "@/components/ui/Card";
import { MOCK_USERS } from "@/types/user";

/**
 * UsersPageClient
 * Client component chứa toàn bộ state: search, filter tab, phân trang.
 * Được tách riêng để page.tsx (Server Component) vẫn dùng được metadata.
 */
const UsersPageClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Client-side filter + search
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return MOCK_USERS.filter((user) => {
      // Tab filter
      if (activeTab === "user" && user.role !== "Người dùng") return false;

      // Search filter
      if (
        q &&
        !user.name.toLowerCase().includes(q) &&
        !user.email.toLowerCase().includes(q) &&
        !user.id.toLowerCase().includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeTab]);

  // Pagination slice
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Reset về trang 1 khi search/tab thay đổi
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: TabFilter) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto flex max-w-[1600px] min-w-0 flex-col gap-6">
      {/* Stats cards */}
      <UserSummaryCards />
 
      {/* Table card */}
      <Card className="min-w-0 p-4 sm:p-5 lg:p-6">
        <UserTableToolbar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <UserTable users={paginatedUsers} />

        <UserPagination
          total={filteredUsers.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setCurrentPage(1);
          }}
        />
      </Card>
    </div>
  );
};

export default UsersPageClient;

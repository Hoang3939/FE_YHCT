import type { Metadata } from "next";
import UsersPageClient from "./UsersPageClient";

export const metadata: Metadata = {
  title: "Quản lý người dùng | Y-RAG Admin",
  description: "Danh sách tài khoản và phân quyền hệ thống Y-RAG",
};

/**
 * UsersPage — Server Component
 * Entry point cho route /users. Metadata SEO được xử lý tại đây.
 * Logic state (search, filter, pagination) được đẩy xuống UsersPageClient.
 */
export default function UsersPage() {
  return <UsersPageClient />;
}

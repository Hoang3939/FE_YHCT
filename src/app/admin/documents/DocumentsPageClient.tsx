"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Rocket,
  Search,
  Upload,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { supabase } from "@/lib/supabaseClient";

type PipelineStatus = "pending_approval" | "pending" | "processing" | "completed" | "failed";

interface EbookRow {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  coverImage: string | null;
  totalChunks: number | null;
  isPublished: boolean;
  createdAt: string;
  latestPipelineStatus: PipelineStatus | null;
  latestPipelineId: string | null;
}

const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL ?? "http://localhost:3004";

export default function DocumentsPageClient() {
  const [ebooks, setEbooks] = useState<EbookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ebooks;

    return ebooks.filter((book) => {
      const titleHit = book.title?.toLowerCase().includes(q);
      const authorHit = book.author?.toLowerCase().includes(q);
      const categoryHit = book.category?.toLowerCase().includes(q);
      return Boolean(titleHit || authorHit || categoryHit);
    });
  }, [ebooks, query]);

  const loadEbooks = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${CATALOG_BASE_URL}/ebooks`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Không thể tải danh sách Ebook.");
      }

      setEbooks(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const publishEbook = async (ebookId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${CATALOG_BASE_URL}/ebooks/${ebookId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: true }),
      });
      if (!res.ok) {
        throw new Error('Xuất bản thất bại.');
      }
      setMessage('Đã xuất bản ebook.');
      await loadEbooks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Xuất bản thất bại.');
    }
  };

  useEffect(() => {
    void loadEbooks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("");
    setDescription("");
    setCoverFile(null);
    setPdfFile(null);
  };

  const uploadCoverToSupabase = async (file: File) => {
    const fileExt = file.name.split(".").pop() ?? "jpg";
    const objectPath = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage.from("public-assets").upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw new Error(`Upload ảnh bìa thất bại: ${error.message}`);

    const { data } = supabase.storage.from("public-assets").getPublicUrl(objectPath);
    return data.publicUrl;
  };

  const onCreateEbook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim()) {
      setMessage("Vui lòng nhập tiêu đề Ebook.");
      return;
    }

    if (!coverFile) {
      setMessage("Vui lòng chọn ảnh bìa.");
      return;
    }

    if (!pdfFile) {
      setMessage("Vui lòng chọn file PDF.");
      return;
    }

    setSubmitting(true);

    try {
      const coverImageUrl = await uploadCoverToSupabase(coverFile);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("category", category.trim());
      formData.append("description", description.trim());
      formData.append("coverImage", coverImageUrl);
      formData.append("pdfFile", pdfFile);

      const res = await fetch(`${CATALOG_BASE_URL}/ebooks`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Không thể tạo Ebook mới.");
      }

      setMessage("Tạo Ebook thành công. Job pipeline đang ở trạng thái chờ phê duyệt.");
      resetForm();
      await loadEbooks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Đã xảy ra lỗi.");
    } finally {
      setSubmitting(false);
    }
  };

  const onTriggerPipeline = async (pipelineId: string) => {
    setMessage(null);

    try {
      const res = await fetch(`${CATALOG_BASE_URL}/pipelines/${pipelineId}/trigger`, {
        method: "PATCH",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? "Không thể khởi chạy pipeline.");
      }

      setMessage("Đã khởi chạy RAG pipeline thành công.");
      await loadEbooks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Đã xảy ra lỗi.");
    }
  };

  const renderVectorCell = (book: EbookRow) => {
    const status = book.latestPipelineStatus;
    const totalChunks = Number(book.totalChunks ?? 0);

    if (status === "pending_approval" && book.latestPipelineId) {
      return (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium text-xs shadow-sm transition-all hover:bg-amber-100">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            Chờ duyệt
          </div>
          <button
            onClick={() => onTriggerPipeline(book.latestPipelineId!)}
            className="group relative inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-semibold text-white transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-md hover:shadow-lg hover:from-emerald-400 hover:to-teal-500 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <Rocket className="w-3 h-3 group-hover:animate-bounce" />
            Khởi chạy RAG
          </button>
        </div>
      );
    }

    if (status === "pending" || status === "processing") {
      return (
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium text-xs shadow-sm transition-all hover:bg-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Đang xử lý
        </div>
      );
    }

    if (totalChunks > 0 || status === "completed") {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium text-xs shadow-sm transition-all hover:bg-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          {totalChunks.toLocaleString("en-US")} Chunks
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-medium text-xs shadow-sm transition-all hover:bg-red-100">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          Thất bại
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-medium text-xs shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
        Chưa xử lý
      </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-semibold text-gray-900">Thêm mới Ebook</h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4" onSubmit={onCreateEbook}>
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề Ebook" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-gray-700">Tác giả</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ví dụ: Hải Thượng Lãn Ông" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-colors"
            >
              <option value="">— Chọn danh mục —</option>
              <option value="Y học cổ truyền">Y học cổ truyền</option>
              <option value="Bài thuốc">Bài thuốc</option>
              <option value="Dược liệu">Dược liệu</option>
              <option value="Châm cứu">Châm cứu</option>
              <option value="Bệnh học">Bệnh học</option>
              <option value="Giải phẫu">Giải phẫu</option>
              <option value="Dinh dưỡng">Dinh dưỡng</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-medium text-gray-700">Ảnh bìa</label>
            <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[96px] rounded-lg border border-gray-200 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
              placeholder="Mô tả ngắn nội dung Ebook"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">File PDF gốc</label>
            <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
            <p className="text-xs text-gray-400">Sau khi tạo, ebook sẽ được xử lý qua pipeline trước khi xuất bản.</p>
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
              {submitting ? "Đang tạo..." : "Lưu Ebook & Tạo pipeline"}
            </Button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-gray-900">Danh sách Ebook</h2>
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Tìm theo tiêu đề / tác giả / danh mục"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-[360px]"
          />
        </div>

        {message ? (
          <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {message}
          </div>
        ) : null}

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-3 pr-3">Ebook</th>
                  <th className="py-3 pr-3">Tác giả</th>
                  <th className="py-3 pr-3">Danh mục</th>
                  <th className="py-3 pr-3">Dữ liệu Vector</th>
                  <th className="py-3 pr-3">Xuất bản</th>
                  <th className="py-3 pr-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title || "cover"}
                            className="w-10 h-14 rounded object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-14 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{book.title || "(Chưa có tiêu đề)"}</p>
                          <p className="text-xs text-gray-500">{new Date(book.createdAt).toLocaleDateString("vi-VN")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-gray-700">{book.author || "—"}</td>
                    <td className="py-3 pr-3 text-gray-700">{book.category || "—"}</td>
                    <td className="py-3 pr-3">{renderVectorCell(book)}</td>
                    <td className="py-3 pr-3">
                      {book.isPublished ? <Badge variant="success">Published</Badge> : <Badge variant="default">Draft</Badge>}
                    </td>
                    <td className="py-3 pr-3">
                      {!book.isPublished && (
                        <button
                          onClick={() => publishEbook(book.id)}
                          className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                        >
                          Xuất bản
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      Không có Ebook phù hợp.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

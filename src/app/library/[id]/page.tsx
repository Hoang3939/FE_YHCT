"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen, Download, Loader2 } from "lucide-react";

const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "http://localhost:3004";

interface BookDetail {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  description: string | null;
  coverImage: string | null;
  storagePath: string | null;
  totalChunks: number;
  isPublished: boolean;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${CATALOG_BASE_URL}/ebooks/${params.id}`);
        if (!res.ok) throw new Error("Không tìm thấy sách");
        const json = await res.json();
        setBook(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-gray-500 text-lg font-medium">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">Không tìm thấy sách</p>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/library"
            className="px-6 py-3 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition-colors"
          >
            Về thư viện
          </Link>
        </div>
      </div>
    );
  }

  const hasEpub = !!book.storagePath;

  return (
    <div className="w-full flex flex-col items-center bg-stone-50">
      {/* Book Detail Content */}
      <div className="w-[1280px] mt-[103px] flex justify-start items-start gap-[80px]">
        {/* Left: Cover + Actions */}
        <div className="flex flex-col items-start gap-6">
          {/* Cover */}
          <div className="w-96 h-[520px] bg-white rounded-2xl shadow-[0px_4px_50px_0px_rgba(0,0,0,0.25)] border border-slate-300 flex items-center justify-center overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-300">
                <BookOpen className="w-16 h-16" />
                <span className="text-sm font-medium">Chưa có bìa</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {hasEpub ? (
              <Link
                href={`/library/${book.id}/read`}
                className="w-48 h-12 px-9 pt-3 pb-2.5 bg-emerald-800 rounded-xl inline-flex flex-col justify-center items-center gap-2.5 hover:bg-emerald-900 transition-colors"
              >
                <div className="flex justify-start items-center gap-1">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="text-center text-white text-base font-medium font-sans">
                    Đọc ngay
                  </span>
                </div>
              </Link>
            ) : (
              <div className="w-48 h-12 px-9 pt-3 pb-2.5 bg-gray-300 rounded-xl inline-flex flex-col justify-center items-center gap-2.5 cursor-not-allowed">
                <div className="flex justify-start items-center gap-1">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="text-center text-white text-base font-medium font-sans">
                    Chưa sẵn sàng
                  </span>
                </div>
              </div>
            )}
            <button
              disabled={!hasEpub}
              className={`w-48 h-12 rounded-xl flex justify-center items-center gap-2 transition-colors ${
                hasEpub
                  ? "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  : "bg-gray-100 opacity-50 cursor-not-allowed"
              }`}
            >
              <Download className="w-5 h-5 text-emerald-800" />
              <span className="text-center text-emerald-800 text-base font-medium font-sans">
                Tải EPUB
              </span>
            </button>
          </div>
        </div>

        {/* Right: Book Info */}
        <div className="flex-1 flex flex-col items-start">
          {/* Breadcrumb */}
          <div className="flex justify-start items-center gap-1.5 mb-6">
            <Link
              href="/library"
              className="text-gray-400 text-sm font-medium font-sans leading-5 hover:text-gray-600 transition-colors"
            >
              Thư viện
            </Link>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            <span className="text-green-700 text-sm font-medium font-sans leading-5">
              {book.category || "Dược học cổ truyền"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-teal-900 text-5xl font-bold font-display mb-4">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-black text-xl font-normal font-sans mb-8">
            {book.author || "Không rõ tác giả"}
          </p>

          {/* Tags */}
          <div className="flex justify-start items-center gap-5 mb-10">
            {book.category && (
              <span className="px-4 py-2.5 bg-emerald-50 rounded-full text-center text-gray-600 text-base font-medium font-sans">
                {book.category}
              </span>
            )}
            {hasEpub && (
              <span className="px-4 py-2.5 bg-blue-50 rounded-full text-center text-blue-600 text-base font-medium font-sans">
                EPUB
              </span>
            )}
          </div>

          {/* Description */}
          <h2 className="text-teal-900 text-xl font-semibold font-display mb-4">
            Mô tả tác phẩm
          </h2>
          <p className="text-gray-900 text-base font-normal font-sans leading-6 mb-8">
            {book.description || "Chưa có mô tả cho tác phẩm này."}
          </p>
        </div>
      </div>

      {/* Academic Info */}
      <div className="w-[1280px] mt-16 flex flex-col items-center">
        <h2 className="text-teal-950 text-xl font-semibold font-display mb-8">
          Thông tin học thuật
        </h2>
        <div className="flex justify-start items-center gap-20">
          <div className="w-24 flex flex-col items-start gap-1">
            <span className="self-stretch text-gray-500 text-xs font-bold font-sans leading-8">
              LƯỢT XEM
            </span>
            <span className="self-stretch text-neutral-950 text-base font-bold font-sans leading-8">
              {book.viewCount || 0}
            </span>
          </div>
          <div className="w-24 flex flex-col items-start gap-1">
            <span className="self-stretch text-gray-500 text-xs font-bold font-sans leading-8">
              CHUNKS
            </span>
            <span className="self-stretch text-neutral-950 text-base font-bold font-sans leading-8">
              {book.totalChunks || 0}
            </span>
          </div>
          <div className="w-24 flex flex-col items-start gap-1">
            <span className="self-stretch text-gray-500 text-xs font-bold font-sans leading-8">
              NGÔN NGỮ
            </span>
            <span className="self-stretch text-neutral-950 text-base font-bold font-sans leading-8">
              Tiếng Việt
            </span>
          </div>
          <div className="w-24 flex flex-col items-start gap-1">
            <span className="self-stretch text-gray-500 text-xs font-bold font-sans leading-8">
              ĐỊNH DẠNG
            </span>
            <span className="self-stretch text-neutral-950 text-base font-bold font-sans leading-8">
              {hasEpub ? "EPUB" : "Đang xử lý"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="mb-[100px]" />
    </div>
  );
}

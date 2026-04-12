"use client";

import { useState, useEffect, useMemo, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Bookmark,
  Menu,
  X,
  Search,
  Sun,
  Monitor,
  Moon,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { useScrollspy } from "@/hooks/useScrollspy";
import { MOCK_CHAPTERS } from "@/data/mockChapters";
import type { Chapter } from "@/types/book";

const CATALOG_BASE_URL =
  process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "http://localhost:3004";

export default function BookReaderPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const bookId = params.id;

  // --- State UI ---
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const [showSidebar, setShowSidebar] = useState(true);

  // --- State dữ liệu ---
  const [bookTitle, setBookTitle] = useState("Đang tải...");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mảng id các section để scrollspy theo dõi
  const sectionIds = useMemo(
    () => chapters.map((ch) => ch.id),
    [chapters]
  );

  // Scrollspy: trả về id của chương đang visible nhất
  const activeChapterId = useScrollspy(sectionIds);

  // Fetch thông tin sách, fallback dùng mock data
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const res = await fetch(
          `${CATALOG_BASE_URL}/ebooks/${bookId}/read-url`
        ).catch(() => ({ ok: false }));

        if (res && (res as Response).ok) {
          const json = await (res as Response).json();
          setBookTitle(json.data.title || "Untitled");
          // TODO: Khi API trả chapters thực, dùng json.data.chapters
        } else {
          // Fallback: dùng mock data YHCT
          setBookTitle("Y Học Cổ Truyền Việt Nam");
        }

        // Luôn dùng mock chapters cho vertical scroll reader
        setChapters(MOCK_CHAPTERS);
        setLoading(false);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Lỗi khi tải sách";
        setError(message);
        setLoading(false);
      }
    };
    fetchBookData();
  }, [bookId]);

  // Cuộn mượt đến chương khi click TOC
  const handleChapterClick = useCallback((chapterId: string) => {
    const element = document.getElementById(chapterId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // --- Theme styles ---
  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-black",
      sidebar: "bg-white",
      prose: "prose-slate",
    },
    sepia: {
      bg: "bg-[#f5f0e8]",
      text: "text-[#5b4636]",
      sidebar: "bg-[#f5f0e8]",
      prose: "prose-stone",
    },
    dark: {
      bg: "bg-[#1a1a2e]",
      text: "text-gray-300",
      sidebar: "bg-[#16213e]",
      prose: "prose-invert",
    },
  };

  const currentTheme = themeStyles[theme];

  // --- Loading state ---
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-gray-500 text-lg font-medium">
            Đang tải sách...
          </p>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">
            Không thể mở sách
          </p>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href={`/library/${bookId}`}
            className="px-6 py-3 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition-colors"
          >
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-screen flex flex-col ${currentTheme.bg} overflow-hidden`}
    >
      {/* Header cố định */}
      <header className="w-full h-20 bg-white border border-gray-200 flex-shrink-0 z-50">
        <div className="w-full h-full px-[26px] flex justify-between items-center">
          <div className="flex justify-start items-center gap-6">
            <Link
              href={`/library/${bookId}`}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 text-black" strokeWidth={2} />
            </Link>
            <div className="w-10 h-0 border-l border-gray-200 rotate-0 h-10" />
            <span className="text-black text-xl font-bold font-display uppercase leading-3 tracking-wide">
              {bookTitle}
            </span>
          </div>
          <div className="flex justify-start items-center gap-5">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Mở/đóng mục lục"
            >
              <Menu className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Mở/đóng cài đặt đọc"
            >
              <Settings className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity" aria-label="Đánh dấu trang">
              <Bookmark className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Bố cục 2 cột: Sidebar trái + Nội dung phải */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar mục lục */}
        {showSidebar && (
          <aside
            className={`w-96 ${currentTheme.sidebar} border-r border-b border-gray-200 flex-shrink-0 overflow-y-auto h-[calc(100vh-5rem)]`}
          >
            <div className="px-[26px] pt-[33px] pb-4 flex justify-between items-center">
              <span className="text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
                MỤC LỤC
              </span>
            </div>
            <div className="w-80 mx-[26px] flex flex-col gap-2 pb-8">
              {chapters.length > 0 ? (
                chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter.id)}
                    className={`self-stretch px-3.5 py-3 rounded-[10px] flex flex-col justify-center items-start text-left transition-colors ${
                      activeChapterId === chapter.id
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-transparent hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-base font-sans ${
                        activeChapterId === chapter.id
                          ? "font-semibold text-emerald-700"
                          : "font-medium text-stone-500"
                      }`}
                    >
                      {chapter.title}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm px-3.5 py-2">
                  Không có mục lục
                </p>
              )}
            </div>
          </aside>
        )}

        {/* Vùng nội dung chính — vertical scroll */}
        <main
          className={`flex-1 overflow-y-auto h-[calc(100vh-5rem)] ${currentTheme.bg} ${currentTheme.text}`}
        >
          <div
            className={`prose ${currentTheme.prose} max-w-3xl mx-auto px-8 py-10`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {chapters.map((chapter) => (
              <section key={chapter.id} id={chapter.id} className="mb-16">
                <h2 className="scroll-mt-24">{chapter.title}</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: chapter.content }}
                />
              </section>
            ))}
          </div>
        </main>

        {/* Panel cài đặt đọc */}
        {showSettings && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-neutral-700/50 z-40"
              onClick={() => setShowSettings(false)}
            />
            <div className="fixed right-0 top-0 w-96 h-full bg-white outline outline-2 outline-gray-200 z-50 overflow-y-auto">
              <div className="pl-9 pr-8 pt-14 pb-12">
                <div className="flex flex-col gap-16">
                  <div className="flex justify-between items-center">
                    <h2 className="text-black text-3xl font-semibold font-display">
                      Cài đặt đọc
                    </h2>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                      aria-label="Đóng cài đặt"
                    >
                      <X className="w-4 h-4 text-black" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-10">
                    {/* Kích thước chữ */}
                    <div className="self-stretch flex flex-col items-start gap-6">
                      <span className="self-stretch text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
                        KÍCH THƯỚC CHỮ
                      </span>
                      <div className="self-stretch flex justify-start items-center gap-7">
                        <button
                          onClick={() =>
                            setFontSize(Math.max(12, fontSize - 2))
                          }
                          className="w-28 h-14 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-black text-lg font-medium">
                            T
                          </span>
                          <Minus className="w-3 h-3 text-black" />
                        </button>
                        <span className="text-black text-3xl font-semibold font-sans">
                          {fontSize}px
                        </span>
                        <button
                          onClick={() =>
                            setFontSize(Math.min(32, fontSize + 2))
                          }
                          className="w-28 h-14 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-black text-lg font-medium">
                            T
                          </span>
                          <Plus className="w-3 h-3 text-black" />
                        </button>
                      </div>
                    </div>

                    {/* Giao diện */}
                    <div className="self-stretch flex flex-col items-start gap-6">
                      <span className="self-stretch text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
                        GIAO DIỆN
                      </span>
                      <div className="self-stretch flex justify-start items-center gap-5">
                        {[
                          {
                            key: "light" as const,
                            icon: Sun,
                            label: "Sáng",
                          },
                          {
                            key: "sepia" as const,
                            icon: Monitor,
                            label: "Ngà",
                          },
                          {
                            key: "dark" as const,
                            icon: Moon,
                            label: "Tối",
                          },
                        ].map(({ key, icon: Icon, label }) => (
                          <button
                            key={key}
                            onClick={() => setTheme(key)}
                            className={`w-28 h-24 px-7 py-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col items-center justify-center gap-3 transition-colors ${
                              theme === key
                                ? "bg-gray-100 outline-teal-950"
                                : "bg-white outline-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <Icon
                              className="w-6 h-6 text-black"
                              strokeWidth={2}
                            />
                            <span className="text-black text-lg font-medium font-sans leading-3 tracking-wide">
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-80 h-0 border-t border-gray-200" />

                    {/* Tìm trong sách */}
                    <button className="self-stretch h-14 px-20 py-4 bg-gray-100 rounded-[5px] flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
                      <Search
                        className="w-5 h-5 text-teal-950"
                        strokeWidth={2}
                      />
                      <span className="text-center text-teal-950 text-xl font-semibold font-sans leading-3 tracking-wide">
                        Tìm trong sách
                      </span>
                    </button>

                    {/* Danh sách đánh dấu */}
                    <button className="self-stretch h-14 px-20 py-4 bg-gray-100 rounded-[5px] flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
                      <Bookmark
                        className="w-5 h-5 text-teal-950"
                        strokeWidth={2}
                      />
                      <span className="text-center text-teal-950 text-xl font-semibold font-sans leading-3 tracking-wide">
                        Danh sách đánh dấu
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

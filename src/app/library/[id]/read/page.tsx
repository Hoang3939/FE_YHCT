"use client";

import { useState, useEffect, useRef } from "react";
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

const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "http://localhost:3004";

interface TocItem {
  id: string;
  label: string;
  href: string;
  subitems?: TocItem[];
}

export default function BookReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeChapterHref, setActiveChapterHref] = useState<string>("");
  const [bookTitle, setBookTitle] = useState("Đang tải...");
  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const readerRef = useRef<HTMLDivElement>(null);

  // Fetch EPUB signed URL
  useEffect(() => {
    const fetchReadUrl = async () => {
      try {
        const res = await fetch(`${CATALOG_BASE_URL}/ebooks/${params.id}/read-url`);
        if (!res.ok) throw new Error("Không thể lấy URL đọc sách");
        const json = await res.json();
        setEpubUrl(json.data.signedUrl);
        setBookTitle(json.data.title || "Untitled");
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải sách");
        setLoading(false);
      }
    };
    fetchReadUrl();
  }, [params.id]);

  const handleTocLoaded = (loadedToc: TocItem[]) => {
    setToc(loadedToc);
    if (loadedToc.length > 0) {
      setActiveChapterHref(loadedToc[0].href);
    }
  };

  const handleChapterClick = (href: string) => {
    setActiveChapterHref(href);
    // Navigate epub.js to the chapter
    if (readerRef.current) {
      const goToChapter = (readerRef.current as any).__goToChapter;
      if (goToChapter) goToChapter(href);
    }
  };

  const handleLocationChange = (location: { chapter: string; progress: number }) => {
    if (location.chapter) {
      setActiveChapterHref(location.chapter);
    }
  };

  const themeStyles = {
    light: { bg: "bg-white", text: "text-black", sidebar: "bg-white" },
    sepia: { bg: "bg-[#f5f0e8]", text: "text-[#5b4636]", sidebar: "bg-[#f5f0e8]" },
    dark: { bg: "bg-[#1a1a2e]", text: "text-gray-300", sidebar: "bg-[#16213e]" },
  };

  const currentTheme = themeStyles[theme];

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-gray-500 text-lg font-medium">Đang tải sách...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">Không thể mở sách</p>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href={`/library/${params.id}`}
            className="px-6 py-3 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition-colors"
          >
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-screen flex flex-col ${currentTheme.bg} overflow-hidden`}>
      {/* Reader Header */}
      <header className="w-full h-20 bg-white border border-gray-200 flex-shrink-0 z-50">
        <div className="w-full h-full px-[26px] flex justify-between items-center">
          <div className="flex justify-start items-center gap-6">
            <Link
              href={`/library/${params.id}`}
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
            >
              <Menu className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <Settings className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity">
              <Bookmark className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Table of Contents */}
        {showSidebar && (
          <aside className={`w-96 ${currentTheme.sidebar} border-r border-b border-gray-200 flex-shrink-0 overflow-y-auto`}>
            <div className="px-[26px] pt-[33px] pb-4 flex justify-between items-center">
              <span className="text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
                MỤC LỤC
              </span>
            </div>
            <div className="w-80 mx-[26px] flex flex-col gap-2">
              {toc.length > 0 ? (
                toc.map((item, i) => (
                  <button
                    key={item.id || i}
                    onClick={() => handleChapterClick(item.href)}
                    className={`self-stretch px-3.5 py-3 rounded-[10px] flex flex-col justify-center items-start text-left transition-colors ${
                      activeChapterHref === item.href
                        ? "bg-emerald-50"
                        : "bg-transparent hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-base font-sans ${
                        activeChapterHref === item.href
                          ? "font-semibold text-gray-700"
                          : "font-medium text-stone-500"
                      }`}
                    >
                      {item.label}
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

        {/* Main Content - EPUB Reader */}
        <main className="flex-1 overflow-hidden">
          {epubUrl && (
            <div ref={readerRef} className="w-full h-full">
              <EpubReaderLazy
                url={epubUrl}
                theme={theme}
                fontSize={fontSize}
                onTocLoaded={handleTocLoaded}
                onLocationChange={handleLocationChange}
              />
            </div>
          )}
        </main>

        {/* Settings Panel */}
        {showSettings && (
          <>
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
                    >
                      <X className="w-4 h-4 text-black" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-10">
                    {/* Font Size */}
                    <div className="self-stretch flex flex-col items-start gap-6">
                      <span className="self-stretch text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
                        KÍCH THƯỚC CHỮ
                      </span>
                      <div className="self-stretch flex justify-start items-center gap-7">
                        <button
                          onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                          className="w-28 h-14 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-black text-lg font-medium">T</span>
                          <Minus className="w-3 h-3 text-black" />
                        </button>
                        <span className="text-black text-3xl font-semibold font-sans">
                          {fontSize}px
                        </span>
                        <button
                          onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                          className="w-28 h-14 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-black text-lg font-medium">T</span>
                          <Plus className="w-3 h-3 text-black" />
                        </button>
                      </div>
                    </div>

                    {/* Theme */}
                    <div className="self-stretch flex flex-col items-start gap-6">
                      <span className="self-stretch text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
                        GIAO DIỆN
                      </span>
                      <div className="self-stretch flex justify-start items-center gap-5">
                        {([
                          { key: "light" as const, icon: Sun, label: "Sáng" },
                          { key: "sepia" as const, icon: Monitor, label: "Ngà" },
                          { key: "dark" as const, icon: Moon, label: "Tối" },
                        ]).map(({ key, icon: Icon, label }) => (
                          <button
                            key={key}
                            onClick={() => setTheme(key)}
                            className={`w-28 h-24 px-7 py-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col items-center justify-center gap-3 transition-colors ${
                              theme === key
                                ? "bg-gray-100 outline-teal-950"
                                : "bg-white outline-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <Icon className="w-6 h-6 text-black" strokeWidth={2} />
                            <span className="text-black text-lg font-medium font-sans leading-3 tracking-wide">
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-80 h-0 border-t border-gray-200" />

                    {/* Search in book */}
                    <button className="self-stretch h-14 px-20 py-4 bg-gray-100 rounded-[5px] flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
                      <Search className="w-5 h-5 text-teal-950" strokeWidth={2} />
                      <span className="text-center text-teal-950 text-xl font-semibold font-sans leading-3 tracking-wide">
                        Tìm trong sách
                      </span>
                    </button>

                    {/* Bookmarks */}
                    <button className="self-stretch h-14 px-20 py-4 bg-gray-100 rounded-[5px] flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
                      <Bookmark className="w-5 h-5 text-teal-950" strokeWidth={2} />
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

// Lazy-loaded EPUB reader to avoid SSR issues
function EpubReaderLazy({
  url,
  theme,
  fontSize,
  onTocLoaded,
  onLocationChange,
}: {
  url: string;
  theme: "light" | "sepia" | "dark";
  fontSize: number;
  onTocLoaded: (toc: TocItem[]) => void;
  onLocationChange: (location: { chapter: string; progress: number }) => void;
}) {
  const [EpubReader, setEpubReader] = useState<any>(null);

  useEffect(() => {
    import("@/components/EpubReader").then((mod) => {
      setEpubReader(() => mod.default);
    });
  }, []);

  if (!EpubReader) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Đang khởi tạo trình đọc...</p>
        </div>
      </div>
    );
  }

  return (
    <EpubReader
      url={url}
      theme={theme}
      fontSize={fontSize}
      onTocLoaded={onTocLoaded}
      onLocationChange={onLocationChange}
    />
  );
}

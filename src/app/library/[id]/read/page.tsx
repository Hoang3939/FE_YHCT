"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Maximize2,
  Bookmark,
  Menu,
  X,
  Search,
  Sun,
  Monitor,
  Moon,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import { getBookById } from "@/data/mockBooks";
import { notFound } from "next/navigation";

const renderContent = (content: string) => {
  if (!content) return null;
  // Tách văn bản tại vị trí các thẻ ảnh markdown ![](url)
  const parts = content.split(/(!\[.*?\]\(.*?\))/g);
  
  return parts.map((part, index) => {
    const match = part.match(/!\[(.*?)\]\((.*?)\)/);
    if (match) {
      return (
        <img
          key={index}
          src={match[2]}
          alt={match[1] || "Hình ảnh bài thuốc"}
          className="my-6 max-w-full rounded-lg shadow-md mx-auto block max-h-[500px] object-contain"
          loading="lazy"
        />
      );
    }
    // Nếu chỉ là text, hiển thị bình thường
    return <span key={index}>{part}</span>;
  });
};

export default function BookReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const book = getBookById(params.id);
  if (!book) return notFound();

  const [activeChapter, setActiveChapter] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("light");

  const currentChapter = book.chapters[activeChapter];
  const hasNextChapter = activeChapter < book.chapters.length - 1;

  const themeStyles = {
    light: { bg: "bg-white", text: "text-black" },
    sepia: { bg: "bg-[#f5f0e8]", text: "text-[#5b4636]" },
    dark: { bg: "bg-[#1a1a2e]", text: "text-gray-300" },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`w-full h-screen flex flex-col ${currentTheme.bg} overflow-hidden`}>
      {/* Reader Header */}
      <header className="w-full h-20 bg-white border border-gray-200 flex-shrink-0 z-50">
        <div className="w-full h-full px-[26px] flex justify-between items-center">
          <div className="flex justify-start items-center gap-6">
            <Link
              href={`/library/${book.id}`}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 text-black" strokeWidth={2} />
            </Link>
            <div className="w-10 h-0 border-l border-gray-200 rotate-0 h-10" />
            <span className="text-black text-xl font-bold font-display uppercase leading-3 tracking-wide">
              {book.title}
            </span>
          </div>
          <div className="flex justify-start items-center gap-5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <Settings className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity">
              <Maximize2 className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity">
              <Bookmark className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Table of Contents */}
        <aside className="w-96 bg-white border-r border-b border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="px-[26px] pt-[33px] pb-4 flex justify-between items-center">
            <span className="text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
              MỤC LỤC
            </span>
            <Menu className="w-6 h-6 text-black cursor-pointer" strokeWidth={2} />
          </div>
          <div className="w-80 mx-[26px] flex flex-col gap-3.5">
            {book.chapters.map((chapter, i) => (
              <button
                key={chapter.id}
                onClick={() => setActiveChapter(i)}
                className={`self-stretch h-16 pl-3.5 pr-2.5 py-2.5 rounded-[10px] flex flex-col justify-center items-start gap-2 text-left transition-colors ${
                  i === activeChapter
                    ? "bg-emerald-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-sm font-medium font-sans ${
                    i === activeChapter ? "text-gray-600" : "text-neutral-400"
                  }`}
                >
                  Chương {chapter.id}
                </span>
                <span
                  className={`text-lg font-sans ${
                    i === activeChapter
                      ? "font-semibold text-gray-600"
                      : "font-medium text-stone-500"
                  }`}
                >
                  {chapter.title}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[960px] mx-auto px-8 py-[72px]">
            {/* Chapter Title */}
            <h1 className={`text-center text-3xl font-bold font-display uppercase leading-relaxed tracking-wide mb-12 ${currentTheme.text}`}>
              Chương {currentChapter.id}: {currentChapter.title}
            </h1>

            {/* Chapter Content */}
            <div
              className={`font-sans leading-6 tracking-wide whitespace-pre-line ${currentTheme.text}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {renderContent(currentChapter.content)}
            </div>

            {/* Divider */}
            <div className="w-full h-0 border-t border-zinc-700/20 mt-16" />

            {/* Next Chapter Button */}
            {hasNextChapter && (
              <div className="flex justify-end mt-8 mb-12">
                <button
                  onClick={() => setActiveChapter(activeChapter + 1)}
                  className="h-11 pl-5 pr-4 py-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-black text-sm font-normal font-sans leading-6">
                    Chương tiếp
                  </span>
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Settings Panel */}
        {showSettings && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-neutral-700/50 z-40"
              onClick={() => setShowSettings(false)}
            />

            {/* Settings Drawer */}
            <div className="fixed right-0 top-0 w-96 h-full bg-white outline outline-2 outline-gray-200 z-50 overflow-y-auto">
              <div className="pl-9 pr-8 pt-14 pb-12">
                <div className="flex flex-col gap-16">
                  {/* Header */}
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

                    {/* Theme */}
                    <div className="self-stretch flex flex-col items-start gap-6">
                      <span className="self-stretch text-green-800 text-lg font-semibold font-sans uppercase leading-3 tracking-wide">
                        GIAO DIỆN
                      </span>
                      <div className="self-stretch flex justify-start items-center gap-5">
                        <button
                          onClick={() => setTheme("light")}
                          className={`w-28 h-24 px-7 py-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col items-center justify-center gap-3 transition-colors ${
                            theme === "light"
                              ? "bg-gray-100 outline-teal-950"
                              : "bg-white outline-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <Sun className="w-6 h-6 text-black" strokeWidth={2} />
                          <span className="text-black text-lg font-medium font-sans leading-3 tracking-wide">
                            Sáng
                          </span>
                        </button>
                        <button
                          onClick={() => setTheme("sepia")}
                          className={`w-28 h-24 px-7 py-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col items-center justify-center gap-3 transition-colors ${
                            theme === "sepia"
                              ? "bg-gray-100 outline-teal-950"
                              : "bg-white outline-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <Monitor
                            className="w-6 h-6 text-black"
                            strokeWidth={2}
                          />
                          <span className="text-black text-lg font-medium font-sans leading-3 tracking-wide">
                            Ngà
                          </span>
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`w-28 h-24 px-7 py-3.5 rounded-[5px] outline outline-2 outline-offset-[-2px] flex flex-col items-center justify-center gap-3 transition-colors ${
                            theme === "dark"
                              ? "bg-gray-100 outline-teal-950"
                              : "bg-white outline-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <Moon
                            className="w-6 h-6 text-black"
                            strokeWidth={2}
                          />
                          <span className="text-black text-lg font-medium font-sans leading-3 tracking-wide">
                            Tối
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-80 h-0 border-t border-gray-200" />

                    {/* Search in book */}
                    <button className="self-stretch h-14 px-20 py-4 bg-gray-100 rounded-[5px] flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors">
                      <Search
                        className="w-5 h-5 text-teal-950"
                        strokeWidth={2}
                      />
                      <span className="text-center text-teal-950 text-xl font-semibold font-sans leading-3 tracking-wide">
                        Tìm trong sách
                      </span>
                    </button>

                    {/* Bookmarks */}
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

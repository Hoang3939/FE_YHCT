"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { FEATURED_BOOKS, TRENDING_BOOKS, CATEGORIES } from "@/data/mockBooks";
import type { Book } from "@/data/mockBooks";

function BookCardFeatured({ book }: { book: Book }) {
  return (
    <Link
      href={`/library/${book.id}`}
      className="w-96 h-96 px-7 pt-52 pb-8 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex flex-col justify-start items-start gap-2.5 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="w-80 flex flex-col justify-start items-start gap-3">
        <h3 className="self-stretch text-stone-900 text-2xl font-semibold font-display">
          {book.title}
        </h3>
        <p className="self-stretch text-neutral-500 text-base font-normal font-sans">
          {book.author}
        </p>
        <p className="self-stretch text-zinc-500 text-sm font-medium font-sans">
          {book.year}
        </p>
        <p className="w-80 h-10 text-neutral-600 text-sm font-medium font-sans line-clamp-2">
          {book.description}
        </p>
        <div className="flex justify-start items-center gap-2.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-emerald-50 rounded-[20px] text-gray-600 text-sm font-medium font-sans"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function BookCardCompact({ book }: { book: Book }) {
  return (
    <Link
      href={`/library/${book.id}`}
      className="w-72 h-96 px-7 pt-60 pb-8 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex flex-col justify-start items-start gap-2.5 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="w-60 flex flex-col justify-start items-start gap-3">
        <h3 className="w-64 text-stone-900 text-2xl font-semibold font-display">
          {book.title}
        </h3>
        <p className="self-stretch text-neutral-500 text-base font-normal font-sans">
          {book.author}
        </p>
        <p className="self-stretch text-zinc-500 text-sm font-medium font-sans">
          {book.year}
        </p>
        <div className="flex justify-start items-center gap-2.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-emerald-50 rounded-[20px] text-gray-600 text-sm font-medium font-sans"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-[571px] mt-[112px] flex flex-col justify-start items-center gap-7">
        <h1 className="self-stretch text-center text-green-800 text-5xl font-semibold font-display">
          Thư viện Y học Cổ truyền
        </h1>
        <p className="w-[495px] text-center text-zinc-500 text-xl font-medium font-sans">
          Khám phá kho tàng tri thức Y học cổ truyền được số hóa và hỗ trợ bởi
          trí tuệ nhân tạo.
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-[725px] h-16 px-6 py-2 mt-8 bg-white rounded-[10px] shadow-[0px_4px_10px_0px_rgba(209,213,219,1.00)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-between items-center">
        <div className="flex justify-start items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm sách hoặc tác giả..."
            className="text-sm font-normal font-sans leading-5 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 w-[580px]"
          />
        </div>
        <button className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M3 5h14M5 10h10M7 15h6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={`min-w-16 px-3 py-2.5 rounded-xl backdrop-blur-2xl flex justify-center items-center gap-1 overflow-hidden transition-colors ${
              activeCategory === cat
                ? "bg-green-800 text-white"
                : "bg-white/50 text-foreground hover:bg-stone-200"
            }`}
          >
            <span className="px-1 text-xs font-medium font-geist leading-4">
              {cat}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Section */}
      <div className="w-[1280px] mt-[120px] flex flex-col justify-start items-start gap-14">
        <div className="self-stretch flex justify-between items-center">
          <div className="w-80 flex flex-col justify-start items-start gap-2.5">
            <span className="text-green-800 text-xl font-medium font-sans">
              NỔI BẬT
            </span>
            <h2 className="text-black text-4xl font-semibold font-display">
              Tác phẩm kinh điển
            </h2>
          </div>
          <button className="flex justify-start items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-black text-base font-medium font-sans leading-5">
              Xem tất cả
            </span>
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
        <div className="self-stretch flex justify-start items-center gap-14">
          {FEATURED_BOOKS.map((book) => (
            <BookCardFeatured key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div className="w-[1280px] mt-[120px] mb-[100px] flex flex-col justify-start items-start gap-14">
        <div className="self-stretch flex justify-between items-center">
          <div className="w-80 flex flex-col justify-start items-start gap-2.5">
            <span className="text-green-800 text-xl font-medium font-sans">
              XU HƯỚNG
            </span>
            <h2 className="text-black text-4xl font-semibold font-display">
              Tác phẩm nổi bật
            </h2>
          </div>
          <button className="flex justify-start items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-black text-base font-medium font-sans leading-5">
              Xem tất cả
            </span>
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
        <div className="self-stretch flex justify-start items-center gap-6">
          {TRENDING_BOOKS.map((book) => (
            <BookCardCompact key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}

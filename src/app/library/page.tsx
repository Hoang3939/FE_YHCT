"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";

const CATALOG_BASE_URL = process.env.NEXT_PUBLIC_CATALOG_BASE_URL || "http://localhost:3004";

interface BookItem {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  description: string | null;
  coverImage: string | null;
  viewCount: number;
  isPublished: boolean;
  createdAt: string;
}

const CATEGORIES = [
  "Tất cả",
  "Dược học",
  "Châm cứu",
  "Nội khoa",
  "Ngoại khoa",
  "Phụ khoa",
  "Nhi khoa",
];

function BookCardFeatured({ book }: { book: BookItem }) {
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
          {book.author || "Không rõ tác giả"}
        </p>
        {book.description && (
          <p className="w-80 h-10 text-neutral-600 text-sm font-medium font-sans line-clamp-2">
            {book.description}
          </p>
        )}
        <div className="flex justify-start items-center gap-2.5">
          {book.category && (
            <span className="px-2.5 py-0.5 bg-emerald-50 rounded-[20px] text-gray-600 text-sm font-medium font-sans">
              {book.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function BookCardCompact({ book }: { book: BookItem }) {
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
          {book.author || "Không rõ tác giả"}
        </p>
        <div className="flex justify-start items-center gap-2.5">
          {book.category && (
            <span className="px-2.5 py-0.5 bg-emerald-50 rounded-[20px] text-gray-600 text-sm font-medium font-sans">
              {book.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (activeCategory && activeCategory !== "Tất cả") {
          params.set("category", activeCategory);
        }

        const url = `${CATALOG_BASE_URL}/ebooks${params.toString() ? `?${params}` : ""}`;
        const res = await fetch(url);
        const json = await res.json();
        setBooks(json.data || []);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchBooks, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, activeCategory]);

  // Split into featured (first 3) and rest
  const featuredBooks = books.slice(0, 3);
  const restBooks = books.slice(3);

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

      {/* Loading */}
      {loading && (
        <div className="mt-20 flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-emerald-800 animate-spin" />
          <span className="text-gray-500">Đang tải sách...</span>
        </div>
      )}

      {/* No results */}
      {!loading && books.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-lg">Không tìm thấy sách nào</p>
          <p className="text-gray-400 text-sm mt-2">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
        </div>
      )}

      {/* Featured Section */}
      {!loading && featuredBooks.length > 0 && (
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
          </div>
          <div className="self-stretch flex justify-start items-center gap-14 flex-wrap">
            {featuredBooks.map((book) => (
              <BookCardFeatured key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* More Books Section */}
      {!loading && restBooks.length > 0 && (
        <div className="w-[1280px] mt-[120px] mb-[100px] flex flex-col justify-start items-start gap-14">
          <div className="self-stretch flex justify-between items-center">
            <div className="w-80 flex flex-col justify-start items-start gap-2.5">
              <span className="text-green-800 text-xl font-medium font-sans">
                TẤT CẢ
              </span>
              <h2 className="text-black text-4xl font-semibold font-display">
                Tác phẩm khác
              </h2>
            </div>
          </div>
          <div className="self-stretch flex justify-start items-center gap-6 flex-wrap">
            {restBooks.map((book) => (
              <BookCardCompact key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacer */}
      {!loading && books.length > 0 && restBooks.length === 0 && (
        <div className="mb-[100px]" />
      )}
    </div>
  );
}

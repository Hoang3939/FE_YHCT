import Link from "next/link";
import { ChevronRight, BookOpen, Download } from "lucide-react";
import { getBookById, getRelatedBooks, BOOKS } from "@/data/mockBooks";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return BOOKS.map((book) => ({ id: book.id }));
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = getBookById(params.id);
  if (!book) return notFound();

  const relatedBooks = getRelatedBooks(params.id);

  return (
    <div className="w-full flex flex-col items-center bg-stone-50">
      {/* Book Detail Content */}
      <div className="w-[1280px] mt-[103px] flex justify-start items-start gap-[80px]">
        {/* Left: Cover + Actions */}
        <div className="flex flex-col items-start gap-6">
          {/* Cover Placeholder */}
          <div className="w-96 h-[520px] bg-white rounded-2xl shadow-[0px_4px_50px_0px_rgba(0,0,0,0.25)] border border-slate-300" />

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
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
            <button className="w-48 h-12 bg-gray-100 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors">
              <Download className="w-5 h-5 text-emerald-800" />
              <span className="text-center text-emerald-800 text-base font-medium font-sans">
                Tải PDF
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
              {book.tags[0] || "Dược học cổ truyền"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-teal-900 text-5xl font-bold font-display mb-4">
            {book.title}
          </h1>

          {/* Author & Year */}
          <p className="text-black text-xl font-normal font-sans mb-8">
            {book.author} • {book.year}
          </p>

          {/* Tags */}
          <div className="flex justify-start items-center gap-5 mb-10">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2.5 bg-emerald-50 rounded-full text-center text-gray-600 text-base font-medium font-sans"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <h2 className="text-teal-900 text-xl font-semibold font-display mb-4">
            Mô tả tác phẩm
          </h2>
          <p className="text-gray-900 text-base font-normal font-sans leading-5 mb-8">
            {book.description.replace(",...", ".")} Tổng quát về các loại dược
            liệu, cách chế biến và phối ngũ các vị thuốc trong Đông y.
          </p>

          {/* Table of Contents */}
          <div className="w-full bg-gray-50 border border-gray-200 p-8">
            <h3 className="text-slate-500 text-2xl font-semibold font-display leading-5 mb-8">
              Mục lục
            </h3>
            <div className="flex flex-col gap-6">
              {book.chapters.map((chapter, i) => (
                <div key={chapter.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 p-[5px] bg-gray-100 rounded-xl flex flex-col justify-center items-center gap-2.5">
                        <span className="text-center text-teal-950 text-xs font-medium font-sans leading-5">
                          {chapter.id}
                        </span>
                      </div>
                      <span className="text-black text-lg font-medium font-sans leading-5">
                        Chương {chapter.id}: {chapter.title}
                      </span>
                    </div>
                    <span className="w-20 text-right text-gray-500 text-sm font-light font-sans leading-5">
                      Trang {chapter.page}
                    </span>
                  </div>
                  {i < book.chapters.length - 1 && (
                    <div className="mt-6 h-0 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
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
              {book.viewCount}
            </span>
          </div>
          <div className="w-24 flex flex-col items-start gap-1">
            <span className="self-stretch text-gray-500 text-xs font-bold font-sans leading-8">
              SỐ TRANG
            </span>
            <span className="self-stretch text-neutral-950 text-base font-bold font-sans leading-8">
              {book.pageCount}
            </span>
          </div>
          <div className="w-24 flex flex-col items-start gap-1">
            <span className="self-stretch text-gray-500 text-xs font-bold font-sans leading-8">
              NGÔN NGỮ
            </span>
            <span className="self-stretch text-neutral-950 text-base font-bold font-sans leading-8">
              {book.language}
            </span>
          </div>
          <div className="w-24 flex flex-col items-start gap-1">
            <span className="self-stretch text-gray-500 text-xs font-bold font-sans leading-8">
              ĐỊNH DẠNG
            </span>
            <span className="self-stretch text-neutral-950 text-base font-bold font-sans leading-8">
              {book.format}
            </span>
          </div>
        </div>
      </div>

      {/* Related Books */}
      <div className="w-[1280px] mt-16 mb-[100px] flex flex-col items-center gap-8">
        <h2 className="text-teal-950 text-xl font-semibold font-display">
          Sách liên quan
        </h2>
        <div className="self-stretch flex justify-start items-center gap-6">
          {relatedBooks.map((related) => (
            <Link
              key={related.id}
              href={`/library/${related.id}`}
              className="w-72 h-96 px-7 pt-60 pb-8 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex flex-col justify-start items-start gap-2.5 hover:shadow-lg transition-shadow"
            >
              <div className="w-60 flex flex-col justify-start items-start gap-3">
                <h3 className="w-64 text-stone-900 text-2xl font-semibold font-display">
                  {related.title}
                </h3>
                <p className="self-stretch text-neutral-500 text-base font-normal font-sans">
                  {related.author}
                </p>
                <p className="self-stretch text-zinc-500 text-sm font-medium font-sans">
                  {related.year}
                </p>
                <div className="flex justify-start items-center gap-2.5">
                  {related.tags.map((tag) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}

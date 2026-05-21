"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { hasSession, logoutSession } from "@/lib/session";

const NAV_ITEMS = [
  { href: "#features", label: "Tính năng" },
  { href: "#how-it-works", label: "Cách hoạt động" },
  { href: "/library", label: "Thư viện" },
  { href: "/contribute", label: "Đóng góp" },
] as const;

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      setIsAuthenticated(hasSession());
    };

    syncSession();
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logoutSession();
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b140d]/92 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-700 text-sm font-bold text-white shadow-lg shadow-emerald-500/25">
            Y
          </div>
          <div className="min-w-0 text-left">
            <p className="font-display text-xl font-semibold text-white">Y-RAG</p>
            <p className="truncate text-xs text-[#9fb0a5]">AI tra cứu minh xác cho Y học cổ truyền</p>
          </div>
        </Link>

        <nav className="ml-auto hidden items-center gap-2 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#c8d3cb] transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                void handleLogout();
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#d4ddd6] transition-colors hover:border-red-200/30 hover:text-red-200"
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#d4ddd6] transition-colors hover:border-emerald-200/30 hover:text-white"
            >
              Đăng nhập
            </Link>
          )}
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f8f67] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0c7454]"
          >
            Vào chat ngay
            <ArrowRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-white transition-colors hover:bg-white/5 lg:hidden"
          aria-label="Mở menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-[#d4ddd6] transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  void handleLogout();
                }}
                className="rounded-2xl border border-white/10 px-4 py-3 text-left text-sm font-medium text-[#d4ddd6] transition-colors hover:border-red-200/30 hover:text-red-200"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-[#d4ddd6] transition-colors hover:border-emerald-200/30 hover:text-white"
              >
                Đăng nhập
              </Link>
            )}
            <Link
              href="/chat"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f8f67] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0c7454]"
            >
              Vào chat ngay
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};

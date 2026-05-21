"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, MessageSquare, BookOpen, FileUp, MessageCircleWarning, User, X, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { hasSession, logoutSession } from "@/lib/session";

type UserAppShellProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  contentClassName?: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/chat", label: "Chat AI", icon: MessageSquare },
  { href: "/library", label: "Thư viện", icon: BookOpen },
  { href: "/contribute", label: "Đóng góp", icon: FileUp },
  { href: "/feedback", label: "Góp ý", icon: MessageCircleWarning },
];

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function UserAppShell({
  children,
  title,
  description,
  actions,
  contentClassName,
}: UserAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const syncSessionState = () => {
      const loggedIn = hasSession();
      setIsAuthenticated(loggedIn);
      setUserName(localStorage.getItem("userFullName") ?? "");
      setUserEmail(localStorage.getItem("userEmail") ?? "");
    };

    syncSessionState();
    window.addEventListener("storage", syncSessionState);

    return () => {
      window.removeEventListener("storage", syncSessionState);
    };
  }, []);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const userInitial = useMemo(() => {
    const source = userName || userEmail || "U";
    return source.charAt(0).toUpperCase();
  }, [userEmail, userName]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await logoutSession();
      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderNavLinks = (mobile = false) => (
    <nav className={mobile ? "grid gap-2" : "hidden items-center gap-2 md:flex"}>
      {navItems.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm"
                : "border-transparent text-slate-600 hover:border-emerald-100 hover:bg-white hover:text-emerald-700",
              mobile ? "w-full justify-start rounded-2xl px-4 py-3" : "",
            ].join(" ")}
          >
            <Icon size={16} className={active ? "text-emerald-600" : "text-slate-400"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/chat" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
              Y
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-semibold text-slate-900">Y-RAG</p>
              <p className="truncate text-xs text-slate-500">Tra cứu tri thức YHCT thuận tiện hơn</p>
            </div>
          </Link>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {renderNavLinks()}
            {isAuthenticated ? (
              <div className="ml-2 flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                  {userInitial}
                </div>
                <div className="max-w-[180px] min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{userName || "Người dùng Y-RAG"}</p>
                  <p className="truncate text-xs text-slate-500">{userEmail || "Đã đăng nhập"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={16} />
                  <span>{isLoggingOut ? "Đang thoát" : "Đăng xuất"}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <User size={16} />
                Đăng nhập
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-emerald-100 hover:text-emerald-700 md:hidden"
            aria-label="Mở menu điều hướng"
          >
            {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isDrawerOpen ? (
          <div className="border-t border-[var(--border-subtle)] bg-white px-4 py-4 shadow-lg md:hidden">
            <div className="mx-auto grid max-w-7xl gap-4">
              {renderNavLinks(true)}
              {isAuthenticated ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{userName || "Người dùng Y-RAG"}</p>
                      <p className="truncate text-xs text-slate-500">{userEmail || "Đã đăng nhập"}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      void handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    <span>{isLoggingOut ? "Đang thoát" : "Đăng xuất"}</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <User size={16} />
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="card-surface overflow-hidden rounded-[28px] px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Y-RAG Workspace</p>
              <h1 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
              {description ? (
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
          </div>
        </section>

        <section className={contentClassName ?? ""}>{children}</section>
      </main>
    </div>
  );
}

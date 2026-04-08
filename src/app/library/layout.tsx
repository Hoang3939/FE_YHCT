import Link from "next/link";


export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-stone-50 flex flex-col items-center overflow-x-hidden">
      {/* Header */}
      <header className="w-full h-20 px-20 py-7 bg-stone-200/80 flex flex-col justify-center items-center gap-2.5 sticky top-0 z-50">
        <div className="flex justify-start items-center gap-96">
          {/* Logo */}
          <Link
            href="/"
            className="w-24 h-10 px-2.5 py-1.5 flex justify-start items-center gap-1"
          >
            <div className="flex justify-start items-center gap-3">
              <div className="w-6 h-6 relative">
                <div className="w-6 h-6 absolute origin-top-left bg-gradient-to-l from-green-200 via-neutral-400 to-slate-500/0 rounded-full" />
                <div className="w-6 h-6 absolute mix-blend-darken bg-[radial-gradient(ellipse_55.38%_55.38%_at_48.12%_46.97%,_rgba(0,0,0,0)_53%,_rgba(0,0,0,0.15)_80%,_rgba(0,0,0,0.40)_96%)] rounded-full" />
              </div>
            </div>
            <span className="text-green-800 text-2xl font-normal font-display leading-7">
              Logo
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex justify-center items-center gap-10">
            <Link
              href="/"
              className="inline-flex flex-col justify-center items-center gap-px"
            >
              <span className="text-center text-zinc-500 text-xl font-normal font-sans hover:text-green-800 transition-colors">
                Trang chủ
              </span>
            </Link>
            <Link
              href="/library"
              className="inline-flex flex-col justify-center items-center gap-px"
            >
              <span className="text-center text-green-800 text-xl font-normal font-sans">
                Thư viện
              </span>
              <span className="self-stretch h-px bg-green-800 rounded-[10px]" />
            </Link>
            <Link
              href="#"
              className="inline-flex flex-col justify-center items-center gap-px"
            >
              <span className="text-center text-zinc-500 text-xl font-normal font-sans hover:text-green-800 transition-colors">
                Đóng góp
              </span>
            </Link>
          </nav>

          {/* Avatar */}
          <div className="w-16 flex justify-start items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="w-full flex-1">{children}</main>

      {/* Footer */}
      <footer className="w-full px-5 pb-5 flex flex-col justify-start items-center gap-2.5 overflow-hidden">
        <div className="w-full max-w-[1400px] px-10 pt-10 pb-5 bg-stone-200 rounded-[20px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] outline-stone-300/50 backdrop-blur-2xl flex flex-col justify-start items-end gap-32">
          <div className="self-stretch flex justify-start items-start gap-4">
            <div className="flex-1 flex flex-col items-start gap-3">
              <span className="text-sm font-medium font-geist leading-4">
                Resources
              </span>
              <span className="text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Documentation
              </span>
              <span className="text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Blog
              </span>
              <span className="text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Community
              </span>
            </div>
            <div className="flex-1 flex flex-col items-start gap-3">
              <span className="text-sm font-medium font-geist leading-4">
                Resources
              </span>
              <span className="text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Documentation
              </span>
              <span className="text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Blog
              </span>
              <span className="text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Community
              </span>
            </div>
            <div className="flex-1 flex flex-col items-start gap-3">
              <span className="text-foreground text-sm font-medium font-geist leading-4">
                Sản phẩm
              </span>
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Y-RAG
              </span>
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                E-book
              </span>
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Dashboard
              </span>
            </div>
            <div className="flex-1 flex flex-col items-start gap-3">
              <span className="text-foreground text-sm font-medium font-geist leading-4">
                Liên hệ
              </span>
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                X
              </span>
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Instagram
              </span>
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Linkedin
              </span>
            </div>
            <div className="flex-1 flex flex-col items-start gap-3">
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Chính sách
              </span>
              <span className="text-foreground text-sm font-normal font-geist leading-4 cursor-pointer hover:underline">
                Bảo mật
              </span>
            </div>
          </div>
          <div className="self-stretch flex justify-between items-end">
            <span className="text-foreground text-sm font-normal font-geist leading-4">
              ©2026 Team7.
            </span>
            <div className="h-12 px-3 py-1.5 flex justify-start items-center gap-1.5">
              <div className="w-7 h-7 relative">
                <div className="w-7 h-7 absolute bg-gradient-to-l from-green-200 via-neutral-400 to-slate-500/0 rounded-full" />
                <div className="w-7 h-7 absolute mix-blend-darken bg-[radial-gradient(ellipse_55.38%_55.38%_at_48.12%_46.97%,_rgba(0,0,0,0)_53%,_rgba(0,0,0,0.15)_80%,_rgba(0,0,0,0.40)_96%)] rounded-full" />
              </div>
              <span className="text-foreground text-3xl font-normal font-display leading-9">
                LOGO
              </span>
            </div>
            <span className="text-sm font-normal font-geist leading-4">
              ©2025 Discourse Inc.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

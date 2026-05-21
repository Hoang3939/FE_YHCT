import Link from "next/link";

const FOOTER_GROUPS = [
  {
    title: "Khám phá",
    links: [
      { label: "Chat AI", href: "/chat" },
      { label: "Thư viện", href: "/library" },
      { label: "Đóng góp tài liệu", href: "/contribute" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Gửi góp ý", href: "/feedback" },
      { label: "Đăng nhập", href: "/login" },
      { label: "Đăng ký", href: "/register" },
    ],
  },
  {
    title: "Nền tảng",
    links: [
      { label: "RAG pipeline", href: "/admin/pipeline" },
      { label: "Quản trị tài liệu", href: "/admin/documents" },
      { label: "Bảng điều khiển", href: "/admin/dashboard" },
    ],
  },
] as const;

export const Footer = () => {
  return (
    <footer className="w-full px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-[rgba(18,28,22,0.86)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-700 text-base font-bold text-white shadow-lg shadow-emerald-500/20">
                Y
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-white">Y-RAG</p>
                <p className="text-sm text-[#9fb0a5]">Tri thức YHCT minh xác, dễ tra cứu và dễ đóng góp hơn.</p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#c7d0c9]">
              Nền tảng hỗ trợ tra cứu, số hóa và quản trị tài liệu Y học cổ truyền với quy trình RAG
              rõ ràng hơn cho cả người dùng cuối lẫn đội vận hành.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8fe1bf]">{group.title}</p>
                <div className="grid gap-2.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-[#d9e1db] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-[#93a199] sm:flex-row sm:items-center sm:justify-between">
          <span>©2026 Team7 · Y-RAG platform.</span>
          <span>Thiết kế lại để ưu tiên điều hướng, khả năng đọc và quy trình RAG rõ ràng hơn.</span>
        </div>
      </div>
    </footer>
  );
};

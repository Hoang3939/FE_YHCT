'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3001';

export default function ChatPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const username = 'Cục đăng';

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      await fetch(`${AUTH_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ refreshToken: refreshToken ?? '' }),
      });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggingOut(false);
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#2b2f2b] flex items-center justify-center p-[24px]">
      <div className="w-[1200px] max-w-full h-[720px] rounded-[18px] overflow-hidden border border-[#1f2a23] bg-[#0c1210] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex">
        <aside className="w-[280px] border-r border-[#1f2a23] bg-[#0c120f] flex flex-col">
          <div className="p-[16px]">
            <button className="w-full h-[36px] rounded-[8px] bg-[#5b605d] text-white text-[12px] flex items-center justify-center gap-[8px]">
              <span className="text-[14px]">✎</span>
              Trò chuyện mới
            </button>
          </div>
          <div className="px-[16px] text-[12px] text-[#c4c9c4] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px]">🔍</span>
              Tìm kiếm
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px]">⚙️</span>
              Cài đặt
            </div>
          </div>
          <div className="mt-[16px] px-[16px] text-[12px] text-[#c4c9c4] flex-1">
            <div className="mb-[12px]">Cuộc trò chuyện</div>
          </div>
          <div className="p-[16px]">
            <div className="flex items-center gap-[10px] rounded-[10px] bg-[#1b2320] border border-[#28332b] px-[12px] py-[10px] text-[12px] text-[#cfd5cf]">
              <div className="w-[26px] h-[26px] rounded-[6px] bg-[#00d492] text-[#0c1210] flex items-center justify-center font-semibold">C</div>
              <div className="flex-1">
                <div className="text-[#e2e7e2]">Cục đăng</div>
                <div className="text-[10px] text-[#a7b0aa]">cucdang@gmail.com</div>
              </div>
              <div className="w-[6px] h-[6px] rounded-full bg-[#00d492]" />
            </div>
          </div>
        </aside>

        <section className="flex-1 relative">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:84px_100%] opacity-30" />
          <header className="h-[54px] border-b border-[#1f2a23] flex items-center justify-between px-[20px] text-[#cfd5cf] text-[13px]">
            <div className="flex items-center gap-[12px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#9adbc1]" />
              Logo
              <span className="text-[#6f7a73]">/</span>
              rag-fast-2.5
            </div>
            <div className="flex items-center gap-[8px]">
              <button className="px-[10px] py-[4px] rounded-[8px] bg-[#6b6f6c] text-white text-[11px]">Chia sẻ</button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-[10px] py-[4px] rounded-[8px] border border-[#2d3931] text-[#cfd5cf] text-[11px] hover:text-white"
              >
                {isLoggingOut ? '...' : 'Đăng xuất'}
              </button>
            </div>
          </header>

          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-[24px]">
            <div className="text-[28px] font-['Playfair_Display']">Chào {username}</div>
            <div className="text-[22px] font-['Playfair_Display']">Bạn muốn tra cứu bài thuốc nào?</div>

            <div className="mt-[18px] w-[520px] max-w-full bg-[#8a8f8c] text-[#1b1f1c] rounded-[14px] p-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="text-left text-[12px] text-[#2b2f2b] mb-[10px]">Nhập câu hỏi...</div>
              <div className="flex items-center justify-between text-[11px] text-[#2b2f2b]">
                <div className="flex items-center gap-[14px]">
                  <div className="w-[22px] h-[22px] rounded-[6px] bg-[#f4f6f5] flex items-center justify-center">+</div>
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[12px] h-[12px] rounded-full border border-[#2b2f2b]" />
                    Đính kèm
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[12px] h-[12px] rounded-full border border-[#2b2f2b]" />
                    Nghiên cứu
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="w-[22px] h-[22px] rounded-full bg-[#f4f6f5] flex items-center justify-center">🎤</div>
                  <div className="w-[22px] h-[22px] rounded-full bg-[#f4f6f5] flex items-center justify-center">↑</div>
                </div>
              </div>
            </div>

            <div className="mt-[12px] flex flex-wrap items-center justify-center gap-[10px] text-[11px] text-[#cfd5cf]">
              {['Bài thuốc trị ho khan?', 'Vị thuốc Cam Thảo có tác dụng gì?', 'Hà Thủ Ô là gì?'].map((item) => (
                <span key={item} className="px-[10px] py-[6px] rounded-[10px] bg-[#3b433f] border border-[#515b56]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

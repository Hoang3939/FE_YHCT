'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3001';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Thiếu token xác thực.');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `${AUTH_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`,
        );
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload?.message ?? 'Xác thực thất bại');
        }

        setStatus('success');
        setMessage(payload?.message ?? 'Xác thực thành công.');
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Xác thực thất bại');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="w-[520px] max-w-full rounded-[20px] bg-[#0c1410] border border-[#243127] shadow-[0_30px_80px_rgba(0,0,0,0.55)] p-[48px] text-center text-white">
      {status === 'loading' && (
        <>
          <div className="flex justify-center mb-[20px]">
            <div className="w-[48px] h-[48px] border-[3px] border-[#243127] border-t-[#7de0b0] rounded-full animate-spin" />
          </div>
          <div className="text-[26px] font-semibold font-['Playfair_Display'] mb-[12px]">
            Đang xác thực
          </div>
          <div className="text-[14px] text-[#c5d2c8]">
            Vui lòng chờ trong giây lát...
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="flex justify-center mb-[20px]">
            <div className="w-[56px] h-[56px] rounded-full bg-[#1a3a28] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7de0b0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <div className="text-[26px] font-semibold font-['Playfair_Display'] mb-[12px]">
            Xác thực thành công!
          </div>
          <div className="text-[14px] text-[#c5d2c8] mb-[28px] leading-[1.6]">
            Tài khoản của bạn đã được xác thực. Bạn có thể đóng trang này và tiến hành đăng nhập.
          </div>
          <Link
            href="/login"
            className="inline-block h-[42px] leading-[42px] px-[32px] rounded-[10px] bg-white text-[#1b1f1c] font-semibold text-[14px] hover:bg-[#e8ebe9] transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="flex justify-center mb-[20px]">
            <div className="w-[56px] h-[56px] rounded-full bg-[#3a1a1a] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff8a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </div>
          <div className="text-[26px] font-semibold font-['Playfair_Display'] mb-[12px]">
            Xác thực thất bại
          </div>
          <div className="text-[14px] text-[#ffb5b5] mb-[28px]">
            {message}
          </div>
          <Link
            href="/login"
            className="inline-block h-[42px] leading-[42px] px-[32px] rounded-[10px] bg-white text-[#1b1f1c] font-semibold text-[14px] hover:bg-[#e8ebe9] transition-colors"
          >
            Quay lại đăng nhập
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full bg-[#2e312e] flex items-center justify-center p-[32px]">
          <div className="w-[520px] max-w-full rounded-[20px] bg-[#0c1410] border border-[#243127] shadow-[0_30px_80px_rgba(0,0,0,0.55)] p-[48px] text-center text-white">
            <div className="flex justify-center mb-[20px]">
              <div className="w-[48px] h-[48px] border-[3px] border-[#243127] border-t-[#7de0b0] rounded-full animate-spin" />
            </div>
            <div className="text-[14px] text-[#c5d2c8]">Đang tải...</div>
          </div>
        </main>
      }
    >
      <main className="min-h-screen w-full bg-[#2e312e] flex items-center justify-center p-[32px]">
        <VerifyEmailContent />
      </main>
    </Suspense>
  );
}

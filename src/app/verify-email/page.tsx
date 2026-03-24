'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3000';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Thiếu token xác thực.');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${AUTH_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload?.message ?? 'Xác thực thất bại');
        }

        setStatus('success');
        setMessage(payload?.message ?? 'Xác thực thành công.');
        setTimeout(() => router.push('/login'), 1500);
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Xác thực thất bại');
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="w-[520px] max-w-full rounded-[20px] bg-[#0c1410] border border-[#243127] shadow-[0_30px_80px_rgba(0,0,0,0.55)] p-[40px] text-center text-white">
      <div className="text-[26px] font-semibold font-['Playfair_Display'] mb-[12px]">Xác thực email</div>
      <div className="text-[14px] text-[#c5d2c8]">
        {status === 'loading' ? 'Đang xác thực...' : message}
      </div>
      {status === 'error' && (
        <button
          className="mt-[20px] h-[40px] rounded-[10px] bg-white text-[#1b1f1c] font-semibold px-4"
          onClick={() => router.push('/login')}
        >
          Quay lại đăng nhập
        </button>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen w-full bg-[#2e312e] flex items-center justify-center p-[32px]">
      <Suspense fallback={<div className="text-white">Đang tải...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}

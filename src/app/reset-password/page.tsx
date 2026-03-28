'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3000';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Thiếu token đặt lại mật khẩu.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? 'Đặt lại mật khẩu thất bại');
      }

      setSuccess(payload?.message ?? 'Đặt lại mật khẩu thành công.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="w-[520px] max-w-full rounded-[20px] bg-[#0c1410] border border-[#243127] shadow-[0_30px_80px_rgba(0,0,0,0.55)] p-[40px] text-center text-white">
        <div className="text-[26px] font-semibold font-['Playfair_Display'] mb-[12px]">Đặt lại mật khẩu</div>
        <div className="text-[14px] text-[#ffb5b5]">Link đặt lại mật khẩu không hợp lệ.</div>
        <button
          className="mt-[20px] h-[40px] rounded-[10px] bg-white text-[#1b1f1c] font-semibold px-4"
          onClick={() => router.push('/login')}
        >
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="w-[1080px] max-w-full h-[640px] rounded-[20px] overflow-hidden bg-[#0c1410] border border-[#243127] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex">
      <section className="w-[520px] max-w-full p-[48px] text-white flex flex-col gap-[24px] relative">
        <div className="flex items-center gap-[10px] text-[#cfe7d8] text-[14px] tracking-[0.2em]">
          <span className="w-[10px] h-[10px] rounded-full bg-[#7de0b0]" />
          LOGO
        </div>
        <div className="mt-[8px]">
          <h1 className="text-[30px] font-semibold font-['Playfair_Display']">Đặt lại mật khẩu</h1>
          <p className="text-[14px] text-[#c5d2c8] mt-[8px]">
            Nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>

        <form className="flex flex-col gap-[16px] text-[14px]" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-[8px]">
            <span className="text-[#c5d2c8]">Mật khẩu mới</span>
            <input
              className="h-[40px] rounded-[8px] bg-[#3b413d] px-[12px] text-white placeholder:text-[#aab3ac] outline-none"
              placeholder="Nhập mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-[8px]">
            <span className="text-[#c5d2c8]">Xác nhận mật khẩu</span>
            <input
              className="h-[40px] rounded-[8px] bg-[#3b413d] px-[12px] text-white placeholder:text-[#aab3ac] outline-none"
              placeholder="Nhập lại mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          {error ? <div className="text-[12px] text-[#ffb5b5]">{error}</div> : null}
          {success ? <div className="text-[12px] text-[#9ff5c1]">{success}</div> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[42px] rounded-[10px] bg-white text-[#1b1f1c] font-semibold disabled:opacity-60"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>

        <div className="text-center text-[12px] text-[#aab3ac]">
          <Link href="/login" className="text-white hover:underline">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </section>

      <section className="flex-1 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(102,255,209,0.55),transparent_55%),radial-gradient(circle_at_90%_10%,rgba(196,219,255,0.35),transparent_60%),radial-gradient(circle_at_50%_80%,rgba(120,88,88,0.45),transparent_60%)]" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative h-full w-full flex flex-col items-center justify-center text-white">
          <div className="w-[320px] h-[46px] rounded-full bg-white/80 text-[#2a2f2c] flex items-center gap-[10px] px-[16px] text-[14px]">
            Tra cứu bài thuốc...
            <div className="ml-auto w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center text-[#5a5a5a]">↑</div>
          </div>
          <div className="mt-[24px] text-[24px] font-['Playfair_Display']">Trợ lý tri thức Y học cổ truyền</div>
        </div>
      </section>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen w-full bg-[#2e312e] flex items-center justify-center p-[32px]">
      <Suspense fallback={<div className="text-white">Đang tải...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}

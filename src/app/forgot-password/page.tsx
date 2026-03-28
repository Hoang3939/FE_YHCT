'use client';

import { useState } from 'react';
import Link from 'next/link';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3000';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.includes('@')) {
      setError('Email không hợp lệ.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? 'Gửi yêu cầu thất bại');
      }

      setSuccess(payload?.message ?? 'Vui lòng kiểm tra email của bạn.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi yêu cầu thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#2e312e] flex items-center justify-center p-[32px]">
      <div className="w-[1080px] max-w-full h-[640px] rounded-[20px] overflow-hidden bg-[#0c1410] border border-[#243127] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex">
        <section className="w-[520px] max-w-full p-[48px] text-white flex flex-col gap-[24px] relative">
          <div className="flex items-center gap-[10px] text-[#cfe7d8] text-[14px] tracking-[0.2em]">
            <span className="w-[10px] h-[10px] rounded-full bg-[#7de0b0]" />
            LOGO
          </div>
          <div className="mt-[8px]">
            <h1 className="text-[30px] font-semibold font-['Playfair_Display']">Quên mật khẩu</h1>
            <p className="text-[14px] text-[#c5d2c8] mt-[8px]">
              Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.
            </p>
          </div>

          <form className="flex flex-col gap-[16px] text-[14px]" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-[8px]">
              <span className="text-[#c5d2c8]">Email</span>
              <input
                className="h-[40px] rounded-[8px] bg-[#3b413d] px-[12px] text-white placeholder:text-[#aab3ac] outline-none"
                placeholder="Nhập địa chỉ Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
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
              {isSubmitting ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
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
    </main>
  );
}

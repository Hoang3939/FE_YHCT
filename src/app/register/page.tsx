'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3000';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatErrorMessage = (message: unknown) => {
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    return 'Đăng ký thất bại';
  };

  const validateClient = () => {
    if (!fullName.trim()) {
      return 'Họ và tên không được để trống.';
    }

    if (!email.includes('@')) {
      return 'Email không hợp lệ.';
    }

    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    if (password !== confirmPassword) {
      return 'Mật khẩu xác nhận không khớp.';
    }

    if (!acceptedTerms) {
      return 'Bạn cần đồng ý với điều khoản để tiếp tục.';
    }

    return '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${AUTH_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(formatErrorMessage(payload?.message));
      }

      setSuccess(payload?.message ?? 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#2e312e] flex items-center justify-center p-[32px]">
      <div className="w-[1080px] max-w-full min-h-[640px] rounded-[20px] overflow-visible bg-[#0c1410] border border-[#243127] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex">
        <section className="w-[520px] max-w-full p-[48px] text-white flex flex-col gap-[24px] relative overflow-y-auto">
          <div className="flex items-center gap-[10px] text-[#cfe7d8] text-[14px] tracking-[0.2em]">
            <span className="w-[10px] h-[10px] rounded-full bg-[#7de0b0]" />
            LOGO
          </div>
          <div className="mt-[8px]">
            <h1 className="text-[30px] font-semibold font-['Playfair_Display']">Đăng ký tài khoản</h1>
          </div>

          <form className="flex flex-col gap-[16px] text-[14px]" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-[8px]">
              <span className="text-[#c5d2c8]">Họ và tên</span>
              <input
                className="h-[40px] rounded-[8px] bg-[#3b413d] px-[12px] text-white placeholder:text-[#aab3ac] outline-none"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
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
            <label className="flex flex-col gap-[8px]">
              <span className="text-[#c5d2c8]">Mật khẩu</span>
              <input
                className="h-[40px] rounded-[8px] bg-[#3b413d] px-[12px] text-white placeholder:text-[#aab3ac] outline-none"
                placeholder="Nhập mật khẩu"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-[8px]">
              <span className="text-[#c5d2c8]">Xác nhận mật khẩu</span>
              <input
                className="h-[40px] rounded-[8px] bg-[#3b413d] px-[12px] text-white placeholder:text-[#aab3ac] outline-none"
                placeholder="Nhập lại mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>

            <label className="flex items-center gap-[8px] text-[12px] text-[#c5d2c8]">
              <input
                type="checkbox"
                className="accent-[#7de0b0]"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              Đồng ý với các Điều khoản và Chính sách bảo mật
            </label>

            {error ? <div className="text-[12px] text-[#ffb5b5]">{error}</div> : null}
            {success ? <div className="text-[12px] text-[#9ff5c1]">{success}</div> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[42px] rounded-[10px] bg-white text-[#1b1f1c] font-semibold disabled:opacity-60"
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng Ký'}
            </button>
          </form>

          <div className="text-center text-[12px] text-[#aab3ac]">Hoặc đăng nhập với</div>

          <div className="flex flex-col gap-[10px]">
            <button type="button" className="h-[40px] rounded-[10px] bg-white text-[#1b1f1c] flex items-center justify-center gap-[10px] text-[13px]">
              <img src="/icons/GoogleLogos.svg" alt="Google" className="w-[16px] h-[16px]" />
              Đăng nhập với Google
            </button>
            <button type="button" className="h-[40px] rounded-[10px] bg-white text-[#1b1f1c] flex items-center justify-center gap-[10px] text-[13px]">
              <img src="/icons/AppleLogos.svg" alt="Apple" className="w-[16px] h-[16px]" />
              Đăng nhập với Apple
            </button>
          </div>

          <div className="text-center text-[12px] text-[#aab3ac]">
            Bạn đã có tài khoản?{' '}
            <Link href="/login" className="text-white hover:underline">
              Đăng nhập
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

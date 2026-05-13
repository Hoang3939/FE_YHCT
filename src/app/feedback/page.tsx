'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createFeedback } from '@/services/api/feedback.service';
import type {
  CreateFeedbackInput,
  FeedbackCategoryValue,
  FeedbackSeverityValue,
} from '@/types/feedback';

const CATEGORY_OPTIONS: { value: FeedbackCategoryValue; label: string }[] = [
  { value: 'bug', label: 'Báo lỗi hệ thống' },
  { value: 'ux', label: 'Góp ý trải nghiệm' },
  { value: 'content', label: 'Góp ý nội dung' },
  { value: 'feature_request', label: 'Đề xuất tính năng' },
  { value: 'other', label: 'Khác' },
];

const SEVERITY_OPTIONS: { value: FeedbackSeverityValue; label: string }[] = [
  { value: 'low', label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high', label: 'Cao' },
];

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

export default function FeedbackPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<FeedbackCategoryValue>('bug');
  const [severity, setSeverity] = useState<FeedbackSeverityValue>('medium');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    setFullName(localStorage.getItem('userFullName') ?? '');
    setEmail(localStorage.getItem('userEmail') ?? '');
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const resetForm = () => {
    setCategory('bug');
    setSeverity('medium');
    setTitle('');
    setContent('');
  };

  const validateForm = (): string => {
    if (!title.trim()) {
      return 'Vui lòng nhập tiêu đề góp ý.';
    }

    if (title.trim().length < 5) {
      return 'Tiêu đề góp ý phải có ít nhất 5 ký tự.';
    }

    if (!content.trim()) {
      return 'Vui lòng nhập nội dung góp ý.';
    }

    if (content.trim().length < 10) {
      return 'Nội dung góp ý phải có ít nhất 10 ký tự.';
    }

    if (email.trim() && !email.includes('@')) {
      return 'Email liên hệ không hợp lệ.';
    }

    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);

    const validationError = validateForm();
    if (validationError) {
      setToast({ type: 'error', message: validationError });
      return;
    }

    const payload: CreateFeedbackInput = {
      category,
      severity,
      title: title.trim(),
      content: content.trim(),
      fullName: fullName.trim() || undefined,
      email: email.trim() || undefined,
      pageUrl: '/chat',
    };

    setIsSubmitting(true);

    try {
      const response = await createFeedback(payload);
      resetForm();
      setToast({
        type: 'success',
        message: response.message || 'Cảm ơn bạn đã góp ý. Chúng tôi đã ghi nhận phản hồi của bạn.',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gửi góp ý thất bại.';
      setToast({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#2b2f2b] px-6 py-10 text-white">
      {toast ? (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={
              toast.type === 'success'
                ? 'rounded-xl border border-emerald-400/30 bg-emerald-500/90 px-4 py-3 text-sm font-medium text-white shadow-2xl'
                : 'rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-3 text-sm font-medium text-white shadow-2xl'
            }
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#9adbc1]">YHCT Feedback</p>
            <h1 className="mt-2 text-3xl font-semibold font-['Playfair_Display']">Góp ý hệ thống</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c4c9c4]">
              Hãy gửi góp ý về trải nghiệm, lỗi hệ thống hoặc nội dung cần điều chỉnh.
              Chúng tôi sẽ ghi nhận và xử lý trong khu vực quản trị.
            </p>
          </div>
          <Link
            href="/chat"
            className="rounded-lg border border-[#2f3a34] px-4 py-2 text-sm text-[#cfd5cf] transition-colors hover:bg-[#1b2320] hover:text-white"
          >
            Quay lại chat
          </Link>
        </div>

        <div className="rounded-2xl border border-[#1f2a23] bg-[#0c1210] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="text-[#cfd5cf]">Họ và tên</span>
                <Input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                  className="h-11 border-[#334139] bg-[#141b17] text-white placeholder:text-[#6f7a73]"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[#cfd5cf]">Email liên hệ</span>
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Nhập email nếu bạn muốn được liên hệ"
                  type="email"
                  className="h-11 border-[#334139] bg-[#141b17] text-white placeholder:text-[#6f7a73]"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="text-[#cfd5cf]">Loại góp ý</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as FeedbackCategoryValue)}
                  className="h-11 rounded-lg border border-[#334139] bg-[#141b17] px-4 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[#cfd5cf]">Mức độ ưu tiên</span>
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value as FeedbackSeverityValue)}
                  className="h-11 rounded-lg border border-[#334139] bg-[#141b17] px-4 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                >
                  {SEVERITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm">
              <span className="text-[#cfd5cf]">Tiêu đề</span>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ví dụ: Trang chat bị trắng sau khi đăng nhập"
                className="h-11 border-[#334139] bg-[#141b17] text-white placeholder:text-[#6f7a73]"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-[#cfd5cf]">Nội dung góp ý</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Mô tả rõ vấn đề, trải nghiệm hoặc đề xuất của bạn..."
                className="min-h-[180px] rounded-lg border border-[#334139] bg-[#141b17] px-4 py-3 text-white outline-none placeholder:text-[#6f7a73] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/chat"
                className="rounded-lg border border-[#2f3a34] px-4 py-2 text-sm text-[#cfd5cf] transition-colors hover:bg-[#1b2320] hover:text-white"
              >
                Hủy
              </Link>
              <Button type="submit" disabled={isSubmitting} className="h-11 px-6">
                {isSubmitting ? 'Đang gửi...' : 'Gửi góp ý'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

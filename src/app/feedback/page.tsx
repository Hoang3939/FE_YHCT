'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserAppShell } from '@/components/layout/UserAppShell';
import { useToast } from '@/components/toast/ToastContext';
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


export default function FeedbackPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<FeedbackCategoryValue>('bug');
  const [severity, setSeverity] = useState<FeedbackSeverityValue>('medium');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setFullName(localStorage.getItem('userFullName') ?? '');
    setEmail(localStorage.getItem('userEmail') ?? '');
  }, []);

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

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, 'error');
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
      showToast(
        response.message || 'Cảm ơn bạn đã góp ý. Chúng tôi đã ghi nhận phản hồi của bạn.',
        'success'
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gửi góp ý thất bại.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserAppShell
      title="Góp ý hệ thống"
      description="Gửi phản hồi về trải nghiệm, lỗi hệ thống hoặc nội dung cần điều chỉnh để đội ngũ quản trị xử lý tập trung hơn."
      actions={
        <Link
          href="/chat"
          className="inline-flex items-center justify-center rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-700"
        >
          Quay lại chat
        </Link>
      }
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.55fr)]">
        <div className="card-surface rounded-[28px] p-6 sm:p-8">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Họ và tên</span>
                <Input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nhập họ và tên của bạn"
                  className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Email liên hệ</span>
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Nhập email nếu bạn muốn được liên hệ"
                  type="email"
                  className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Loại góp ý</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as FeedbackCategoryValue)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Mức độ ưu tiên</span>
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value as FeedbackSeverityValue)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {SEVERITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Tiêu đề</span>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ví dụ: Trang chat bị trắng sau khi đăng nhập"
                className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Nội dung góp ý</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Mô tả rõ vấn đề, trải nghiệm hoặc đề xuất của bạn..."
                className="min-h-[200px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                Hủy
              </Link>
              <Button type="submit" disabled={isSubmitting} className="h-11 rounded-full px-6">
                {isSubmitting ? 'Đang gửi...' : 'Gửi góp ý'}
              </Button>
            </div>
          </form>
        </div>

        <aside className="card-surface rounded-[28px] p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Hướng dẫn gửi góp ý</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900">Một góp ý tốt nên có gì?</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
            <p>• Nêu rõ trang hoặc thao tác xảy ra lỗi để admin dễ đối chiếu.</p>
            <p>• Nếu là lỗi giao diện, mô tả thiết bị hoặc kích thước màn hình đang dùng.</p>
            <p>• Nếu là góp ý nội dung, chỉ rõ tài liệu, thuật ngữ hoặc phản hồi AI liên quan.</p>
            <p>• Chọn mức ưu tiên phù hợp để đội ngũ sắp xếp xử lý nhanh hơn.</p>
          </div>
        </aside>
      </div>
    </UserAppShell>
  );
}

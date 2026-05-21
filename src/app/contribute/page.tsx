'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserAppShell } from '@/components/layout/UserAppShell';
import { useToast } from '@/components/toast/ToastContext';
import {
  addContributionAsset,
  createContribution,
  fetchLatestContributionPipeline,
} from '@/services/api/contribution.service';
import type {
  AddContributionAssetPayload,
  ContributionAsset,
  ContributionAssetType,
  ContributionPipelineJob,
  ContributionType,
  KnowledgeContribution,
} from '@/types/contribution';
import {
  CONTRIBUTION_ASSET_TYPE_LABELS,
  CONTRIBUTION_STATUS_LABELS,
  CONTRIBUTION_TYPE_LABELS,
} from '@/types/contribution';

const CONTRIBUTION_TYPE_OPTIONS: { value: ContributionType; label: string }[] = [
  { value: 'document', label: CONTRIBUTION_TYPE_LABELS.document },
  { value: 'medicine', label: CONTRIBUTION_TYPE_LABELS.medicine },
  { value: 'herb', label: CONTRIBUTION_TYPE_LABELS.herb },
];

interface PendingAsset {
  id: string;
  file: File;
  assetType: ContributionAssetType;
}


function inferAssetType(file: File): ContributionAssetType {
  const lowerName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  if (lowerName.endsWith('.pdf') || mimeType.includes('pdf')) {
    return 'pdf';
  }

  if (
    lowerName.endsWith('.docx') ||
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('msword')
  ) {
    return 'docx';
  }

  if (mimeType.startsWith('image/')) {
    return 'image';
  }

  if (lowerName.endsWith('.zip') || mimeType.includes('zip') || mimeType.includes('compressed')) {
    return 'zip';
  }

  return 'other';
}

function formatFileSize(fileSize: number): string {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  }

  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`;
  }

  return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ContributePage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [contributionType, setContributionType] = useState<ContributionType>('document');
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const [createdContribution, setCreatedContribution] = useState<KnowledgeContribution | null>(null);
  const [createdAssets, setCreatedAssets] = useState<ContributionAsset[]>([]);
  const [pipelineJob, setPipelineJob] = useState<ContributionPipelineJob | null>(null);

  useEffect(() => {
    setFullName(localStorage.getItem('userFullName') ?? '');
    setEmail(localStorage.getItem('userEmail') ?? '');
  }, []);


  useEffect(() => {
    if (!createdContribution?.contributionId) {
      setPipelineJob(null);
      return;
    }

    let cancelled = false;

    const loadPipeline = async () => {
      try {
        const data = await fetchLatestContributionPipeline(createdContribution.contributionId);
        if (!cancelled) {
          setPipelineJob(data);
        }
      } catch {
        if (!cancelled) {
          setPipelineJob(null);
        }
      }
    };

    void loadPipeline();
    const interval = window.setInterval(() => {
      void loadPipeline();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [createdContribution?.contributionId]);

  const hasFiles = pendingAssets.length > 0;

  const contributionSummary = useMemo(() => {
    if (!createdContribution) {
      return null;
    }

    const pipelineStatusLabel = pipelineJob
      ? {
          queued: 'Đang chờ worker nhận',
          running: `Đang xử lý (${pipelineJob.progress}%)`,
          success: 'Hoàn tất',
          failed: 'Thất bại',
        }[pipelineJob.status]
      : createdContribution.status === 'approved'
        ? 'Đã duyệt, chờ tạo job'
        : 'Chưa khởi chạy';

    return {
      contributionId: createdContribution.contributionId,
      statusLabel: CONTRIBUTION_STATUS_LABELS[createdContribution.status],
      assetCount: createdAssets.length,
      pipelineStatusLabel,
    };
  }, [createdAssets.length, createdContribution]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setReference('');
    setContributionType('document');
    setPendingAssets([]);
  };

  const validateForm = (): string => {
    if (!title.trim()) {
      return 'Vui lòng nhập tiêu đề tài liệu đóng góp.';
    }

    if (title.trim().length < 5) {
      return 'Tiêu đề tài liệu phải có ít nhất 5 ký tự.';
    }

    if (description.trim() && description.trim().length < 10) {
      return 'Mô tả tài liệu phải có ít nhất 10 ký tự nếu bạn nhập.';
    }

    if (reference.trim().length > 500) {
      return 'Nguồn tham khảo không được vượt quá 500 ký tự.';
    }

    if (!hasFiles) {
      return 'Vui lòng chọn ít nhất một tài liệu để gửi metadata.';
    }

    if (email.trim() && !email.includes('@')) {
      return 'Email liên hệ không hợp lệ.';
    }

    return '';
  };

  const handleChooseFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList?.length) {
      return;
    }

    const nextAssets = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      assetType: inferAssetType(file),
    }));

    setPendingAssets((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const merged = [...prev];

      nextAssets.forEach((item) => {
        if (!existingIds.has(item.id)) {
          merged.push(item);
        }
      });

      return merged;
    });

    event.target.value = '';
  };

  const handleRemoveAsset = (assetId: string) => {
    setPendingAssets((prev) => prev.filter((asset) => asset.id !== assetId));
  };

  const handleAssetTypeChange = (assetId: string, assetType: ContributionAssetType) => {
    setPendingAssets((prev) =>
      prev.map((asset) => (asset.id === assetId ? { ...asset, assetType } : asset)),
    );
  };

  const buildAssetPayload = (asset: PendingAsset): AddContributionAssetPayload => ({
    file: asset.file,
    originalFileName: asset.file.name,
    mimeType: asset.file.type || 'application/octet-stream',
    assetType: asset.assetType,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const contributionResponse = await createContribution({
        title: title.trim(),
        description: description.trim() || undefined,
        contributionType,
        reference: reference.trim() || undefined,
      });

      const contribution = contributionResponse.data;
      const savedAssets: ContributionAsset[] = [];

      for (const asset of pendingAssets) {
        const assetResponse = await addContributionAsset(
          contribution.contributionId,
          buildAssetPayload(asset),
        );
        savedAssets.push(assetResponse.data);
      }

      setCreatedContribution({
        ...contribution,
        filePath: contribution.filePath ?? savedAssets[0]?.storedFilePath ?? null,
      });
      setCreatedAssets(savedAssets);
      setPipelineJob(null);
      resetForm();
      showToast(
        contributionResponse.message || 'Đã tạo hồ sơ đóng góp và tải tài liệu thành công.',
        'success'
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gửi đóng góp thất bại.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserAppShell
      title="Đóng góp tài liệu"
      description="Gửi metadata và tài liệu gốc để đội ngũ chuyên gia phê duyệt, sau đó hệ thống sẽ theo dõi pipeline xử lý tự động ngay trên hồ sơ đóng góp của bạn."
      actions={
        <Link
          href="/chat"
          className="inline-flex items-center justify-center rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-700"
        >
          Quay lại chat
        </Link>
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        {contributionSummary ? (
          <section className="rounded-[28px] border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-sm text-white shadow-[0_20px_60px_rgba(15,143,103,0.25)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-50/80">Hồ sơ vừa tạo</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-emerald-50/80">Mã hồ sơ</p>
                <p className="mt-1 break-all text-base font-semibold">{contributionSummary.contributionId}</p>
              </div>
              <div>
                <p className="text-emerald-50/80">Trạng thái</p>
                <p className="mt-1 text-base font-semibold">{contributionSummary.statusLabel}</p>
              </div>
              <div>
                <p className="text-emerald-50/80">Metadata đã gửi</p>
                <p className="mt-1 text-base font-semibold">{contributionSummary.assetCount} tài liệu</p>
              </div>
              <div>
                <p className="text-emerald-50/80">Pipeline</p>
                <p className="mt-1 text-base font-semibold">{contributionSummary.pipelineStatusLabel}</p>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="card-surface rounded-[28px] p-6 sm:p-8">
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
                    placeholder="Nhập email nếu cần đối chiếu"
                    type="email"
                    className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Tiêu đề tài liệu</span>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ví dụ: Nam Y Nghiệm Phương bản scan rõ nét"
                    className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Loại đóng góp</span>
                  <select
                    value={contributionType}
                    onChange={(event) => setContributionType(event.target.value as ContributionType)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    {CONTRIBUTION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Nguồn tham khảo</span>
                  <Input
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Ví dụ: Thư viện gia đình, nhà thuốc, sách sưu tầm"
                    className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Mô tả tài liệu</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Mô tả nguồn gốc, chất lượng scan, tình trạng tài liệu hoặc ghi chú quan trọng..."
                  className="min-h-[180px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Chọn tài liệu để tải lên</span>
                <input
                  type="file"
                  multiple
                  onChange={handleChooseFiles}
                  className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-700"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.zip"
                />
                <p className="text-xs leading-6 text-slate-500">
                  Tệp nhị phân sẽ được tải lên storage bảo mật, đồng thời hệ thống vẫn lưu metadata
                  như tên file, mime type và loại asset để phục vụ thẩm định và pipeline.
                </p>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                >
                  Hủy
                </Link>
                <Button type="submit" disabled={isSubmitting} className="h-11 rounded-full px-6">
                  {isSubmitting ? 'Đang gửi metadata...' : 'Gửi đóng góp'}
                </Button>
              </div>
            </form>
          </section>

          <aside className="card-surface rounded-[28px] p-6 sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Danh sách metadata</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-slate-900">Tài liệu đã chọn</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Kiểm tra lại loại asset trước khi gửi để chuyên gia có đủ ngữ cảnh khi thẩm định và kích hoạt pipeline.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {pendingAssets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  Chưa có tài liệu nào được chọn.
                </div>
              ) : (
                pendingAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{asset.file.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(asset.file.size)} · {asset.file.type || 'application/octet-stream'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-red-200 hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </div>

                    <label className="mt-4 grid gap-2 text-xs font-medium text-slate-600">
                      <span>Loại asset</span>
                      <select
                        value={asset.assetType}
                        onChange={(event) =>
                          handleAssetTypeChange(
                            asset.id,
                            event.target.value as ContributionAssetType,
                          )
                        }
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        {Object.entries(CONTRIBUTION_ASSET_TYPE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </UserAppShell>
  );
}

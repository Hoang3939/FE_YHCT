'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  addContributionAsset,
  createContribution,
} from '@/services/api/contribution.service';
import type {
  AddContributionAssetPayload,
  ContributionAsset,
  ContributionAssetType,
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

interface ToastState {
  type: 'success' | 'error';
  message: string;
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

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]+/g, '-');
}

function buildStoredFilePath(file: File): string {
  return `pending-client-upload/${Date.now()}-${sanitizeFileName(file.name)}`;
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
  const [toast, setToast] = useState<ToastState | null>(null);
  const [createdContribution, setCreatedContribution] = useState<KnowledgeContribution | null>(null);
  const [createdAssets, setCreatedAssets] = useState<ContributionAsset[]>([]);

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
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const hasFiles = pendingAssets.length > 0;

  const contributionSummary = useMemo(() => {
    if (!createdContribution) {
      return null;
    }

    return {
      contributionId: createdContribution.contributionId,
      statusLabel: CONTRIBUTION_STATUS_LABELS[createdContribution.status],
      assetCount: createdAssets.length,
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
    originalFileName: asset.file.name,
    storedFilePath: buildStoredFilePath(asset.file),
    mimeType: asset.file.type || 'application/octet-stream',
    fileSize: asset.file.size,
    assetType: asset.assetType,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);

    const validationError = validateForm();
    if (validationError) {
      setToast({ type: 'error', message: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const contributionResponse = await createContribution({
        title: title.trim(),
        description: description.trim() || undefined,
        contributionType,
        reference: reference.trim() || undefined,
        filePath: pendingAssets.length === 1 ? buildStoredFilePath(pendingAssets[0].file) : undefined,
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

      setCreatedContribution(contribution);
      setCreatedAssets(savedAssets);
      resetForm();
      setToast({
        type: 'success',
        message:
          contributionResponse.message ||
          'Đã tạo hồ sơ đóng góp và ghi nhận metadata tài liệu thành công.',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gửi đóng góp thất bại.';
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

      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#9adbc1]">YHCT Contribution</p>
            <h1 className="mt-2 text-3xl font-semibold font-['Playfair_Display']">Đóng góp tài liệu</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#c4c9c4]">
              Pha hiện tại chỉ ghi nhận hồ sơ đóng góp và metadata tài liệu. File nhị phân chưa
              được tải lên máy chủ ở bước này, nên hệ thống sẽ lưu thông tin nhận diện file để
              expert tiếp tục xử lý ở pha sau.
            </p>
          </div>
          <Link
            href="/chat"
            className="rounded-lg border border-[#2f3a34] px-4 py-2 text-sm text-[#cfd5cf] transition-colors hover:bg-[#1b2320] hover:text-white"
          >
            Quay lại chat
          </Link>
        </div>

        {contributionSummary ? (
          <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-50 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">Hồ sơ vừa tạo</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-emerald-200/75">Mã hồ sơ</p>
                <p className="mt-1 break-all font-medium text-white">{contributionSummary.contributionId}</p>
              </div>
              <div>
                <p className="text-emerald-200/75">Trạng thái</p>
                <p className="mt-1 font-medium text-white">{contributionSummary.statusLabel}</p>
              </div>
              <div>
                <p className="text-emerald-200/75">Metadata đã gửi</p>
                <p className="mt-1 font-medium text-white">{contributionSummary.assetCount} tài liệu</p>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="rounded-2xl border border-[#1f2a23] bg-[#0c1210] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
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
                    placeholder="Nhập email nếu cần đối chiếu"
                    type="email"
                    className="h-11 border-[#334139] bg-[#141b17] text-white placeholder:text-[#6f7a73]"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm md:col-span-2">
                  <span className="text-[#cfd5cf]">Tiêu đề tài liệu</span>
                  <Input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ví dụ: Nam Y Nghiệm Phương bản scan rõ nét"
                    className="h-11 border-[#334139] bg-[#141b17] text-white placeholder:text-[#6f7a73]"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-[#cfd5cf]">Loại đóng góp</span>
                  <select
                    value={contributionType}
                    onChange={(event) => setContributionType(event.target.value as ContributionType)}
                    className="h-11 rounded-lg border border-[#334139] bg-[#141b17] px-4 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                  >
                    {CONTRIBUTION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-[#cfd5cf]">Nguồn tham khảo</span>
                  <Input
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Ví dụ: Thư viện gia đình, nhà thuốc, sách sưu tầm"
                    className="h-11 border-[#334139] bg-[#141b17] text-white placeholder:text-[#6f7a73]"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="text-[#cfd5cf]">Mô tả tài liệu</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Mô tả nguồn gốc, chất lượng scan, tình trạng tài liệu hoặc ghi chú quan trọng..."
                  className="min-h-[160px] rounded-lg border border-[#334139] bg-[#141b17] px-4 py-3 text-white outline-none placeholder:text-[#6f7a73] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[#cfd5cf]">Chọn tài liệu để gửi metadata</span>
                <input
                  type="file"
                  multiple
                  onChange={handleChooseFiles}
                  className="block w-full rounded-lg border border-dashed border-[#334139] bg-[#141b17] px-4 py-3 text-sm text-[#cfd5cf] file:mr-4 file:rounded-md file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-400"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.zip"
                />
                <p className="text-xs leading-5 text-[#8e9891]">
                  Hệ thống chỉ lưu metadata như tên file, dung lượng, mime type và loại asset. Chưa
                  upload file nhị phân trong pha này.
                </p>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/chat"
                  className="rounded-lg border border-[#2f3a34] px-4 py-2 text-sm text-[#cfd5cf] transition-colors hover:bg-[#1b2320] hover:text-white"
                >
                  Hủy
                </Link>
                <Button type="submit" disabled={isSubmitting} className="h-11 px-6">
                  {isSubmitting ? 'Đang gửi metadata...' : 'Gửi đóng góp'}
                </Button>
              </div>
            </form>
          </section>

          <aside className="rounded-2xl border border-[#1f2a23] bg-[#0c1210] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#9adbc1]">Danh sách metadata</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Tài liệu đã chọn</h2>
              <p className="mt-2 text-sm leading-6 text-[#c4c9c4]">
                Kiểm tra lại loại asset trước khi gửi để expert có ngữ cảnh chính xác khi thẩm định.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {pendingAssets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#334139] bg-[#131917] px-4 py-5 text-sm text-[#8e9891]">
                  Chưa có tài liệu nào được chọn.
                </div>
              ) : (
                pendingAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-xl border border-[#243127] bg-[#131917] p-4 text-sm text-[#d6ddd8]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{asset.file.name}</p>
                        <p className="mt-1 text-xs text-[#8e9891]">
                          {formatFileSize(asset.file.size)} · {asset.file.type || 'application/octet-stream'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset(asset.id)}
                        className="rounded-md border border-[#334139] px-2.5 py-1 text-xs text-[#cfd5cf] transition-colors hover:bg-[#1b2320] hover:text-white"
                      >
                        Xóa
                      </button>
                    </div>

                    <label className="mt-4 grid gap-2 text-xs text-[#cfd5cf]">
                      <span>Loại asset</span>
                      <select
                        value={asset.assetType}
                        onChange={(event) =>
                          handleAssetTypeChange(
                            asset.id,
                            event.target.value as ContributionAssetType,
                          )
                        }
                        className="h-10 rounded-lg border border-[#334139] bg-[#141b17] px-3 text-sm text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
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
    </main>
  );
}

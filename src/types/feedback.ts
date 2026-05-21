export type FeedbackType = 'Báo lỗi' | 'Đề xuất' | 'Bổ sung' | 'Chỉnh sửa' | 'Câu hỏi';
export type FeedbackPriority = 'Cao' | 'Trung bình' | 'Thấp';
export type FeedbackStatus = 'Chờ duyệt' | 'Đang xem xét' | 'Đã duyệt' | 'Từ chối';
export type AuthorRole = 'Chuyên gia' | 'Người dùng' | 'Thầy thuốc' | 'Nhà nghiên cứu' | 'Nhà dược';
export type FeedbackCategoryValue = 'bug' | 'ux' | 'content' | 'feature_request' | 'other';
export type FeedbackSeverityValue = 'high' | 'medium' | 'low';

export interface FeedbackAuthor {
  name: string;
  initials: string;
  role: AuthorRole;
  avatarColor: string;
}

export interface Feedback {
  id: string;
  title: string;
  author: FeedbackAuthor;
  relatedEntity: string;
  type: FeedbackType;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  createdAt: string;
  upvotes: number;
  tags: string[];
}

export interface CreateFeedbackInput {
  category: FeedbackCategoryValue;
  title: string;
  content: string;
  fullName?: string;
  email?: string;
  pageUrl?: string;
  severity?: FeedbackSeverityValue;
}

export interface FeedbackSubmissionResult {
  feedbackId: string;
  status: 'new' | 'reviewing' | 'resolved' | 'closed';
  createdAt: string;
}

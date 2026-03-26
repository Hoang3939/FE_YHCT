/**
 * Định nghĩa các type và interface cho module Quản lý Tài liệu.
 */

export type DocType =
  | "Bài thuốc"
  | "Dược liệu"
  | "Phương pháp"
  | "Kinh nghiệm lâm sàng";

export type DocStatus =
  | "Đã xuất bản"
  | "Đang kiểm duyệt"
  | "Bản nháp"
  | "Lỗi embedding";

export type RagStatus = "Đã index RAG" | "Chưa index" | "Lỗi embedding";

export type SortOption = "newest" | "views" | "queries" | "chunks";

/** Số liệu sử dụng / hiệu suất của tài liệu */
export interface DocMetrics {
  views: number;
  queries: number;
  rating: number;
}

/** Interface đầy đủ của một Document trong hệ thống Y-RAG */
export interface Document {
  /** ID duy nhất */
  id: string;
  /** Tiêu đề tài liệu */
  title: string;
  /** Tác giả / nguồn gốc */
  author: string;
  /** Đoạn mô tả ngắn */
  description: string;
  /** Loại phân loại */
  type: DocType;
  /** Trạng thái xuất bản */
  status: DocStatus;
  /** Trạng thái index RAG */
  ragStatus: RagStatus;
  /** Danh sách hashtag (không có dấu #) */
  tags: string[];
  /** Số liệu thống kê */
  metrics: DocMetrics;
  /** Số lượng text chunks đã tách */
  chunks: number;
  /** Ngày tạo YYYY-MM-DD */
  createdAt: string;
  /** Ngày cập nhật gần nhất YYYY-MM-DD */
  updatedAt: string;
}

// ─────────────────────────────────────────────
// MOCK DATA — 9 documents cho dev/testing
// ─────────────────────────────────────────────
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "DOC-001",
    title: "Bài thuốc trị phong thấp theo Hải Thượng Lãn Ông",
    author: "Hải Thượng Lãn Ông",
    description:
      "Tổng hợp các bài thuốc cổ truyền trị phong thấp, đau khớp từ bộ Lãn Ông tâm lĩnh. Bao gồm thành phần, liều dùng và phương pháp bào chế chi tiết.",
    type: "Bài thuốc",
    status: "Đã xuất bản",
    ragStatus: "Đã index RAG",
    tags: ["phongthap", "daukhop", "lanong", "cotruyen"],
    metrics: { views: 2847, queries: 931, rating: 4.8 },
    chunks: 124,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "DOC-002",
    title: "Dược liệu: Tam thất bắc - công dụng và bào chế",
    author: "DS. Nguyễn Văn An",
    description:
      "Mô tả chi tiết về cây tam thất bắc (Panax notoginseng), bao gồm hình thái, thu hái, bào chế và tác dụng điều trị theo y học cổ truyền và hiện đại.",
    type: "Dược liệu",
    status: "Đã xuất bản",
    ragStatus: "Đã index RAG",
    tags: ["tamthat", "duoclieu", "bochế", "chongviem"],
    metrics: { views: 1923, queries: 744, rating: 4.6 },
    chunks: 89,
    createdAt: "2024-02-01",
    updatedAt: "2024-03-08",
  },
  {
    id: "DOC-003",
    title: "Phác đồ điều trị mất ngủ bằng châm cứu và thảo dược",
    author: "BS. CKII Lê Hữu Trác",
    description:
      "Hướng dẫn toàn diện phác đồ điều trị mất ngủ kết hợp châm cứu và thảo dược theo Y học cổ truyền. Bao gồm chẩn đoán, lựa chọn huyệt vị và bài thuốc kèm theo.",
    type: "Phương pháp",
    status: "Đã xuất bản",
    ragStatus: "Đã index RAG",
    tags: ["matngủ", "chamcuu", "thaodược", "anminh"],
    metrics: { views: 3102, queries: 1205, rating: 4.9 },
    chunks: 156,
    createdAt: "2024-01-28",
    updatedAt: "2024-03-15",
  },
  {
    id: "DOC-004",
    title: "Kinh nghiệm dùng hoàng kỳ trong điều trị suy nhược",
    author: "ThS. Trần Thị Hoa",
    description:
      "Chia sẻ kinh nghiệm lâm sàng nhiều năm trong việc ứng dụng hoàng kỳ (Astragalus membranaceus) cho bệnh nhân suy nhược cơ thể, sau phẫu thuật và người cao tuổi.",
    type: "Kinh nghiệm lâm sàng",
    status: "Đang kiểm duyệt",
    ragStatus: "Chưa index",
    tags: ["hoangky", "suynhuoc", "bottonic", "laosuy"],
    metrics: { views: 410, queries: 89, rating: 4.2 },
    chunks: 0,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-18",
  },
  {
    id: "DOC-005",
    title: "Bài thuốc cổ phương: Tứ quân tử thang",
    author: "Biên soạn: Y điển",
    description:
      "Phân tích chi tiết bài thuốc Tứ quân tử thang — một trong tứ đại danh phương của YHCT, chủ trị chứng Tỳ Vị khí hư. Phân tích từng vị thuốc và ứng dụng hiện đại.",
    type: "Bài thuốc",
    status: "Đã xuất bản",
    ragStatus: "Đã index RAG",
    tags: ["coPhuong", "tVi", "kihư", "caOkhoa"],
    metrics: { views: 2195, queries: 876, rating: 4.7 },
    chunks: 112,
    createdAt: "2024-01-10",
    updatedAt: "2024-02-20",
  },
  {
    id: "DOC-006",
    title: "Ngải cứu: Từ vị thuốc đến ứng dụng cứu ngải",
    author: "DS. Phạm Thị Lan",
    description:
      "Tổng quan về ngải cứu (Artemisia vulgaris) trong Y học cổ truyền: thu hái, phơi sấy, làm mồi ngải và các chỉ định lâm sàng trong cứu ngải, điều hòa kinh nguyệt.",
    type: "Dược liệu",
    status: "Đã xuất bản",
    ragStatus: "Đã index RAG",
    tags: ["ngaicuu", "cuuNgai", "kinhNguyệt", "huyệtvi"],
    metrics: { views: 1654, queries: 623, rating: 4.5 },
    chunks: 98,
    createdAt: "2024-02-15",
    updatedAt: "2024-03-05",
  },
  {
    id: "DOC-007",
    title: "Phương pháp dưỡng sinh Bát đoạn cẩm",
    author: "GS. TS Nguyễn Nhược Kim",
    description:
      "Hướng dẫn đầy đủ 8 động tác dưỡng sinh Bát đoạn cẩm kèm phân tích tác dụng lên kinh lạc và tạng phủ theo YHCT, phù hợp cho người cao tuổi và người bệnh mãn tính.",
    type: "Phương pháp",
    status: "Đang kiểm duyệt",
    ragStatus: "Chưa index",
    tags: ["duongsinh", "batdoancam", "kinhlac", "thaicuc"],
    metrics: { views: 788, queries: 210, rating: 4.4 },
    chunks: 0,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-19",
  },
  {
    id: "DOC-008",
    title: "Đông trùng hạ thảo: Thần dược hay lầm tưởng?",
    author: "PGS. TS Vũ Nam",
    description:
      "Đánh giá khoa học về đông trùng hạ thảo (Cordyceps sinensis), phân biệt hàng thật giả, tác dụng được chứng minh lâm sàng và các quảng cáo thái quá cần tránh.",
    type: "Dược liệu",
    status: "Đã xuất bản",
    ragStatus: "Lỗi embedding",
    tags: ["dongtrunghathao", "cordyceps", "phanBiet", "khoahoc"],
    metrics: { views: 4821, queries: 1893, rating: 4.3 },
    chunks: 0,
    createdAt: "2024-01-05",
    updatedAt: "2024-02-28",
  },
  {
    id: "DOC-009",
    title: "Lục vị địa hoàng hoàn - bài thuốc bổ thận âm",
    author: "Nguồn: Kim quỹ yếu lược",
    description:
      "Nghiên cứu chuyên sâu bài thuốc Lục vị địa hoàng hoàn: thành phần 6 vị, cơ chế bổ thận âm, chỉ định điều trị đau lưng, ù tai, ra mồ hôi trộm và ứng dụng hiện đại.",
    type: "Bài thuốc",
    status: "Đã xuất bản",
    ragStatus: "Đã index RAG",
    tags: ["lucvi", "bothan", "thuanAm", "kimquy"],
    metrics: { views: 3344, queries: 1102, rating: 4.8 },
    chunks: 134,
    createdAt: "2024-01-20",
    updatedAt: "2024-03-12",
  },
];

/** Thống kê phân loại cho ClassificationBar */
export interface ClassificationStat {
  type: DocType;
  count: number;
  color: string;
  bgClass: string;
  textClass: string;
}

export const CLASSIFICATION_STATS: ClassificationStat[] = [
  { type: "Bài thuốc",             count: 3, color: "#10b981", bgClass: "bg-emerald-500", textClass: "text-emerald-700" },
  { type: "Dược liệu",             count: 3, color: "#3b82f6", bgClass: "bg-blue-500",    textClass: "text-blue-700"    },
  { type: "Phương pháp",           count: 2, color: "#8b5cf6", bgClass: "bg-violet-500",  textClass: "text-violet-700"  },
  { type: "Kinh nghiệm lâm sàng",  count: 1, color: "#f59e0b", bgClass: "bg-amber-400",   textClass: "text-amber-700"   },
];

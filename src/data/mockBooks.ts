export interface BookChapter {
  id: number;
  title: string;
  page: number;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  description: string;
  tags: string[];
  pageCount: number;
  language: string;
  format: string;
  viewCount: number;
  downloadCount: number;
  chapters: BookChapter[];
}

import bai10Chunks from "./Bai10.json";

const SAMPLE_CONTENT = `Cổ nhân nói: "Thuốc thang là chuyện cứu người, y thuật là đạo làm nhân." Trải qua hàng ngàn năm văn hiến, dân tộc Việt Nam đã đúc kết được kho tàng tri thức y học cổ truyền vô giá. Những bài thuốc từ cây cỏ quanh ta, những phương pháp bấm huyệt, châm cứu tinh diệu không chỉ chữa lành thân bệnh mà còn hướng tới sự cân bằng giữa con người và thiên nhiên.

Trong dòng chảy của thời đại mới, việc ứng dụng trí tuệ nhân tạo (AI) vào việc bảo tồn và phát huy giá trị y học cổ truyền là một bước đi đột phá. Hệ thống HerbalScholar được xây dựng với mục tiêu cung cấp một nền tảng tra cứu và học tập hiện đại, giúp các nhà nghiên cứu, sinh viên và những người quan tâm dễ dàng tiếp cận với các văn bản cổ và kiến thức chuyên sâu một cách minh xác nhất.

Chúng tôi hy vọng rằng, qua từng trang sách số này, quý độc giả sẽ tìm thấy không chỉ là kiến thức mà còn là niềm cảm hứng để tiếp tục gìn giữ ngọn lửa y thuật nước nhà, thực hiện đúng lời dạy của đại danh y Tuệ Tĩnh: "Nam dược trị Nam nhân".`;

const bai10Chapters: BookChapter[] = bai10Chunks.map((c: any) => ({
  id: c.metadata.chunk_index + 1,
  title: c.metadata.title.replace(/[\#\*]/g, '').trim(),
  page: c.metadata.chunk_index * 5 + 1,
  content: c.text
}));


export const BOOKS: Book[] = [
  {
    id: "0000-1111-2222-Bai10",
    title: "Bài 10: Dược liệu tẩy, nhuận tràng",
    author: "Số Hóa Bằng OCR Pipeline",
    year: 2024,
    description: "Toàn bộ hình ảnh, nội dung đều được máy trí tuệ nhân tạo tách bóc tự động từ file PDF. Chứa hình ảnh Public từ Supabase.",
    tags: ["Tự động", "Dược liệu", "AI"],
    pageCount: 15,
    language: "Tiếng Việt",
    format: "EPUB (Pipeline)",
    viewCount: 88,
    downloadCount: 5,
    chapters: bai10Chapters,
  },
  {
    id: "y-hoc-co-truyen",
    title: "Y Học Cổ Truyền",
    author: "PGS. TS. Nguyễn Nhược Kim",
    year: 2022,
    description: "Công trình nghiên cứu toàn diện về y học cổ truyền Việt Nam, bao gồm lý luận cơ bản,...",
    tags: ["Dược học", "Kinh điển"],
    pageCount: 200,
    language: "Tiếng Việt",
    format: "PDF",
    viewCount: 100,
    downloadCount: 45,
    chapters: [
      { id: 1, title: "Giới thiệu và tổng quan", page: 10, content: SAMPLE_CONTENT },
      { id: 2, title: "Lý luận cơ bản", page: 30, content: SAMPLE_CONTENT },
      { id: 3, title: "Phương pháp chẩn đoán", page: 70, content: SAMPLE_CONTENT },
      { id: 4, title: "Các phương pháp điều trị", page: 120, content: SAMPLE_CONTENT },
      { id: 5, title: "Bài thuốc ứng dụng", page: 160, content: SAMPLE_CONTENT },
    ],
  },
  {
    id: "hai-thuong-y-tong-tam-linh",
    title: "Hải Thượng Y Tông Tâm Lĩnh",
    author: "Hải Thượng Lãn Ông",
    year: 1770,
    description: "Bộ sách y học cổ điển vĩ đại nhất của Việt Nam, được Hải Thượng Lãn Ông biên soạn,...",
    tags: ["Bài thuốc", "Kinh điển"],
    pageCount: 350,
    language: "Tiếng Việt",
    format: "PDF",
    viewCount: 230,
    downloadCount: 89,
    chapters: [
      { id: 1, title: "Giới thiệu và tổng quan", page: 10, content: SAMPLE_CONTENT },
      { id: 2, title: "Nội khoa yếu lược", page: 50, content: SAMPLE_CONTENT },
      { id: 3, title: "Ngoại cảm thông trị", page: 100, content: SAMPLE_CONTENT },
      { id: 4, title: "Phụ đạo xán nhiên", page: 180, content: SAMPLE_CONTENT },
      { id: 5, title: "Bách bệnh cơ yếu", page: 250, content: SAMPLE_CONTENT },
    ],
  },
  {
    id: "nam-duoc-than-hieu",
    title: "Nam Dược Thần Hiệu",
    author: "Tuệ Tĩnh",
    year: 1417,
    description: "Tác phẩm của thiền sư Tuệ Tĩnh - 'Ông tổ của y học cổ truyền Việt Nam', ghi chép về,....",
    tags: ["Dược học", "Thảo mộc"],
    pageCount: 180,
    language: "Tiếng Việt",
    format: "PDF",
    viewCount: 180,
    downloadCount: 67,
    chapters: [
      { id: 1, title: "Giới thiệu và tổng quan", page: 10, content: SAMPLE_CONTENT },
      { id: 2, title: "Dược liệu bản địa", page: 40, content: SAMPLE_CONTENT },
      { id: 3, title: "Bài thuốc nam", page: 80, content: SAMPLE_CONTENT },
      { id: 4, title: "Phương pháp bào chế", page: 130, content: SAMPLE_CONTENT },
    ],
  },
  {
    id: "bai-thuoc-dan-gian",
    title: "Bài Thuốc Dân Gian Việt Nam",
    author: "TS. Trần Đức Tuấn",
    year: 2019,
    description: "Tổng hợp các bài thuốc dân gian phổ biến của người Việt Nam qua các thế hệ.",
    tags: ["Dân gian"],
    pageCount: 150,
    language: "Tiếng Việt",
    format: "PDF",
    viewCount: 95,
    downloadCount: 30,
    chapters: [
      { id: 1, title: "Giới thiệu và tổng quan", page: 10, content: SAMPLE_CONTENT },
      { id: 2, title: "Thuốc chữa cảm cúm", page: 30, content: SAMPLE_CONTENT },
      { id: 3, title: "Thuốc tiêu hóa", page: 70, content: SAMPLE_CONTENT },
    ],
  },
  {
    id: "thuong-han-luan-chu-giai",
    title: "Thương Hàn Luận Chú Giải",
    author: "Trương Trọng Cảnh",
    year: 2015,
    description: "Bản dịch và chú giải kinh điển Thương Hàn Luận cho người Việt.",
    tags: ["Bài thuốc"],
    pageCount: 280,
    language: "Tiếng Việt",
    format: "PDF",
    viewCount: 120,
    downloadCount: 55,
    chapters: [
      { id: 1, title: "Giới thiệu và tổng quan", page: 10, content: SAMPLE_CONTENT },
      { id: 2, title: "Thái dương bệnh", page: 40, content: SAMPLE_CONTENT },
      { id: 3, title: "Thiếu dương bệnh", page: 100, content: SAMPLE_CONTENT },
    ],
  },
  {
    id: "cham-cuu-hoc-viet-nam",
    title: "Châm Cứu Học Việt Nam",
    author: "PGS. Nguyễn Tài Thu",
    year: 2009,
    description: "Giáo trình châm cứu toàn diện của nền châm cứu Việt Nam.",
    tags: ["Châm cứu"],
    pageCount: 220,
    language: "Tiếng Việt",
    format: "PDF",
    viewCount: 110,
    downloadCount: 42,
    chapters: [
      { id: 1, title: "Giới thiệu và tổng quan", page: 10, content: SAMPLE_CONTENT },
      { id: 2, title: "Kinh lạc và huyệt vị", page: 50, content: SAMPLE_CONTENT },
      { id: 3, title: "Kỹ thuật châm cứu", page: 110, content: SAMPLE_CONTENT },
    ],
  },
  {
    id: "duoc-hoc-co-truyen",
    title: "Dược Học Cổ Truyền",
    author: "TS. Đỗ Tất Lợi",
    year: 2001,
    description: "Tổng quát về các loại dược liệu, cách chế biến và phối ngũ các vị thuốc trong Đông y.",
    tags: ["Dược học"],
    pageCount: 200,
    language: "Tiếng Việt",
    format: "PDF",
    viewCount: 100,
    downloadCount: 38,
    chapters: [
      { id: 1, title: "Giới thiệu và tổng quan", page: 10, content: SAMPLE_CONTENT },
      { id: 2, title: "Lý luận cơ bản", page: 30, content: SAMPLE_CONTENT },
      { id: 3, title: "Phương pháp chẩn đoán", page: 70, content: SAMPLE_CONTENT },
      { id: 4, title: "Các phương pháp điều trị", page: 120, content: SAMPLE_CONTENT },
      { id: 5, title: "Bài thuốc ứng dụng", page: 160, content: SAMPLE_CONTENT },
    ],
  },
];

export const FEATURED_BOOKS = BOOKS.slice(0, 3);
export const TRENDING_BOOKS = BOOKS.slice(3, 7);

export const CATEGORIES = [
  "Dược học",
  "Y học kinh điển",
  "Lý luận cơ bản",
  "Châm cứu",
  "Thuốc dân gian",
];

export function getBookById(id: string): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}

export function getRelatedBooks(currentId: string): Book[] {
  return BOOKS.filter((b) => b.id !== currentId).slice(0, 4);
}

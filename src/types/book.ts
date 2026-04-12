/**
 * Interface Chapter dùng cho Reader component
 * Mỗi chapter chứa id duy nhất, tiêu đề và nội dung (HTML hoặc plain text)
 */
export interface Chapter {
  id: string;
  title: string;
  /** Nội dung chương — có thể là HTML string hoặc plain text */
  content: string;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format số nguyên thành chuỗi có dấu phân cách nghìn, với locale CỐ ĐỊNH.
 *
 * ⚠️  QUAN TRỌNG - Next.js SSR Hydration Rule:
 * KHÔNG dùng `value.toLocaleString()` không có tham số locale trong Next.js.
 * Node.js (server) và browser của user có thể dùng locale khác nhau,
 * dẫn đến kết quả string khác nhau (ví dụ: "7,842" vs "7.842")
 * và gây ra lỗi React Hydration mismatch.
 * → Luôn truyền locale cố định, ví dụ 'en-US', để đảm bảo server và client đồng nhất.
 *
 * @param {number} value - Số cần format
 * @param {string} [locale="en-US"] - Locale cố định, mặc định là "en-US"
 * @returns {string} Chuỗi số đã được format, ví dụ: 7842 → "7,842"
 */
export function formatNumber(value: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Trình tự sắp xếp dữ liệu
 */
export type SortOrder = "asc" | "desc";

/**
 * Sắp xếp một mảng các object dựa trên một field thời gian / số.
 * 
 * @template T - Kiểu dữ liệu của các phần tử trong mảng (phải là object).
 * @param {T[]} data - Mảng dữ liệu cần sắp xếp.
 * @param {keyof T} sortBy - Tên thuộc tính trong object dùng để sắp xếp (ví dụ: 'createdAt', 'time').
 * @param {SortOrder} [order="desc"] - Thứ tự sắp xếp ("asc" - tăng dần, "desc" - giảm dần). Mặc định là "desc".
 * @returns {T[]} - Mảng mới đã được sắp xếp.
 * @throws {Error} Nếu dữ liệu truyền vào không hợp lệ (null, undefined, không phải mảng).
 */
export function sortData<T extends Record<string, any>>(
  data: T[],
  sortBy: keyof T,
  order: SortOrder = "desc"
): T[] {
  try {
    // 1. Kiểm tra input hợp lệ
    if (!data) {
      throw new Error("Invalid input: data is null or undefined.");
    }
    if (!Array.isArray(data)) {
      throw new Error("Invalid input: data must be an array.");
    }

    // Nếu mảng rỗng thì trả về luôn để tối ưu
    if (data.length === 0) return [];

    // 2. Clone mảng để tránh mutate mảng gốc (Best practice)
    const sortedData = [...data];

    // 3. Thực hiện sắp xếp
    sortedData.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      // Xử lý trường hợp value là string (ví dụ Date ISO string) hoặc number
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();

      // Nếu có thể parse thành ngày tháng hợp lệ thì so sánh theo ngày
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Trở lại quy tắc so sánh string/number thông thường
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    return sortedData;
  } catch (error) {
    console.error("Lỗi trong hàm sortData:", error);
    // Trả về mảng gốc thay vì crash app trong trường hợp unexpected error (tuỳ policy)
    // Nhưng vì yêu cầu là handle error, ta throw hoặc return [] tùy thuộc.
    return [];
  }
}

/**
 * Utility function to sort feedback data safely.
 * Handles strings, numbers, dates, and custom priority/status weighting.
 *
 * @param {T[] | null | undefined} array - The array of feedbacks to sort.
 * @param {keyof T} key - The property key to sort by (e.g., 'createdAt', 'upvotes', 'priority').
 * @param {'asc' | 'desc'} direction - Sort direction. Default is 'desc'.
 * @returns {T[]} A new safely sorted array.
 */
export function sortFeedbacks<T extends Record<string, unknown>>(
  array: T[] | null | undefined,
  key: keyof T,
  direction: "asc" | "desc" = "desc"
): T[] {
  try {
    // 1. Kiểm tra mảng hợp lệ
    if (!array || !Array.isArray(array)) {
      console.warn("sortFeedbacks: Dữ liệu đầu vào không hợp lệ.");
      return [];
    }
    if (array.length <= 1) return [...array];

    // Trọng số cho mức độ ưu tiên (Priority)
    const priorityWeight: Record<string, number> = {
      Cao: 3,
      "Trung bình": 2,
      Thấp: 1,
    };

    // 2. Logic sắp xếp
    return [...array].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      // Đẩy null/undefined xuống cuối
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Xử lý Custom Sort: Mức độ ưu tiên (Cao > Trung bình > Thấp)
      if (key === "priority") {
        const weightA = priorityWeight[valA as string] ?? 0;
        const weightB = priorityWeight[valB as string] ?? 0;
        return direction === "asc" ? weightA - weightB : weightB - weightA;
      }

      // Xử lý chuỗi (String)
      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Xử lý ngày tháng (Date/ISO String)
      const dateA = new Date(valA as string);
      const dateB = new Date(valB as string);
      if (
        !isNaN(dateA.getTime()) &&
        !isNaN(dateB.getTime()) &&
        typeof valA !== "number"
      ) {
        return direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Xử lý số học (Number)
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;

      return 0;
    });
  } catch (error) {
    // 3. Fallback khi có lỗi không mong muốn
    console.error(
      `sortFeedbacks: Lỗi khi sắp xếp theo key '${String(key)}'`,
      error
    );
    return array ? [...array] : [];
  }
}

/**
 * Utility function to sort an array of objects, highly useful for rendering 
 * sorted Select options (e.g., Timezones, Languages) or Menu Items.
 * Features: Type-safety, handles empty states, and falls back gracefully on errors.
 * 
 * @param array - The array of configuration items to sort.
 * @param key - The object key to sort by (e.g., 'label', 'order', 'value').
 * @param direction - Sort direction ('asc' or 'desc'). Default is 'asc'.
 * @returns A strictly sorted array without mutating the original input.
 */
export function sortConfigItems<T extends Record<string, unknown>>(
  array: T[] | null | undefined,
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  try {
    // 1. Validation: Xử lý an toàn nếu dữ liệu truyền vào bị hỏng hoặc chưa kịp load
    if (!array || !Array.isArray(array)) {
      console.warn("sortConfigItems: Dữ liệu đầu vào không hợp lệ (null/undefined).");
      return [];
    }

    // Tối ưu hiệu năng: Không cần sort nếu mảng <= 1 phần tử
    if (array.length <= 1) return [...array];

    // 2. Thuật toán sắp xếp an toàn
    return [...array].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      // Đẩy các object thiếu field xuống cuối danh sách
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      // Xử lý sort cho chuỗi (Ví dụ: tên quốc gia, múi giờ) - hỗ trợ Unicode tiếng Việt
      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB, "vi-VN", { sensitivity: "base" })
          : valB.localeCompare(valA, "vi-VN", { sensitivity: "base" });
      }

      // Xử lý sort cho số (Ví dụ: index ưu tiên của Menu)
      if (typeof valA === "number" && typeof valB === "number") {
        return direction === "asc" ? valA - valB : valB - valA;
      }

      // Fallback cho các kiểu dữ liệu khác
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;

      return 0;
    });
  } catch (error) {
    // 3. Bắt lỗi: Đảm bảo ứng dụng không bị crash (Trắng trang) nếu có lỗi xảy ra
    console.error(
      `sortConfigItems: Xảy ra lỗi khi sắp xếp theo thuộc tính '${String(key)}'`,
      error
    );
    return array ? [...array] : [];
  }
}

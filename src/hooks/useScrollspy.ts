"use client";

import { useEffect, useRef, useState } from "react";

/** Options cho IntersectionObserver trong useScrollspy */
interface UseScrollspyOptions {
  /** Margin xung quanh root element (CSS margin syntax) */
  rootMargin?: string;
  /** Tỷ lệ phần tử visible để trigger (0-1) */
  threshold?: number;
}

/**
 * Custom hook dùng IntersectionObserver để theo dõi section nào
 * đang hiển thị nhiều nhất trên viewport (scrollspy).
 *
 * @param sectionIds - Mảng id của các section cần theo dõi
 * @param options - Tùy chọn rootMargin và threshold
 * @returns activeId - id của section đang visible nhất
 */
export function useScrollspy(
  sectionIds: string[],
  options?: UseScrollspyOptions
): string {
  const [activeId, setActiveId] = useState<string>("");

  // Lưu trữ intersection ratio của từng section
  const ratioMap = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Không làm gì nếu không có section nào
    if (sectionIds.length === 0) return;

    const threshold = options?.threshold ?? 0.3;
    const rootMargin = options?.rootMargin ?? "0px 0px -40% 0px";

    /**
     * Callback khi IntersectionObserver phát hiện thay đổi visibility.
     * Cập nhật ratio map và chọn section có ratio cao nhất.
     */
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        ratioMap.current.set(entry.target.id, entry.intersectionRatio);
      }

      // Tìm section có intersection ratio cao nhất
      let maxRatio = 0;
      let maxId = "";

      ratioMap.current.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxId = id;
        }
      });

      // Chỉ cập nhật nếu tìm được section visible
      if (maxId) {
        setActiveId(maxId);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold: [0, threshold, 0.5, 0.75, 1],
    });

    // Observe từng section, bỏ qua nếu element không tồn tại
    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    // Cleanup: disconnect observer khi unmount hoặc deps thay đổi
    return () => {
      observer.disconnect();
      ratioMap.current.clear();
    };
  }, [sectionIds, options?.rootMargin, options?.threshold]);

  return activeId;
}

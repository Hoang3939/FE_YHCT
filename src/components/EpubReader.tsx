"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ePub, { Rendition, Book, NavItem } from "epubjs";

interface TocItem {
  id: string;
  label: string;
  href: string;
  subitems?: TocItem[];
}

interface EpubReaderProps {
  url: string;
  theme?: "light" | "sepia" | "dark";
  fontSize?: number;
  onTocLoaded?: (toc: TocItem[]) => void;
  onLocationChange?: (location: { chapter: string; progress: number }) => void;
}

const THEME_STYLES = {
  light: {
    body: { background: "#ffffff", color: "#1a1a1a", "font-family": "'Georgia', serif", "line-height": "1.8" },
  },
  sepia: {
    body: { background: "#f5f0e8", color: "#5b4636", "font-family": "'Georgia', serif", "line-height": "1.8" },
  },
  dark: {
    body: { background: "#1a1a2e", color: "#d1d5db", "font-family": "'Georgia', serif", "line-height": "1.8" },
  },
};

export default function EpubReader({
  url,
  theme = "light",
  fontSize = 18,
  onTocLoaded,
  onLocationChange,
}: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize book
  useEffect(() => {
    if (!viewerRef.current || !url) return;

    const book = ePub(url);
    bookRef.current = book;

    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      spread: "none",
      flow: "scrolled-doc",
    });

    renditionRef.current = rendition;

    // Apply initial theme
    Object.entries(THEME_STYLES).forEach(([name, styles]) => {
      rendition.themes.register(name, styles);
    });
    rendition.themes.select(theme);
    rendition.themes.fontSize(`${fontSize}px`);

    // Display and load TOC
    rendition.display().then(() => {
      setIsLoading(false);
    }).catch((err: Error) => {
      setError(`Failed to render EPUB: ${err.message}`);
      setIsLoading(false);
    });

    // Load TOC
    book.loaded.navigation.then((nav) => {
      if (onTocLoaded && nav.toc) {
        const toc: TocItem[] = nav.toc.map((item: NavItem) => ({
          id: item.id,
          label: item.label.trim(),
          href: item.href,
          subitems: item.subitems?.map((sub: NavItem) => ({
            id: sub.id,
            label: sub.label.trim(),
            href: sub.href,
          })),
        }));
        onTocLoaded(toc);
      }
    });

    // Track location changes
    rendition.on("relocated", (location: any) => {
      if (onLocationChange) {
        onLocationChange({
          chapter: location?.start?.href || "",
          progress: location?.start?.percentage || 0,
        });
      }
    });

    return () => {
      book.destroy();
      bookRef.current = null;
      renditionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Update theme
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.select(theme);
    }
  }, [theme]);

  // Update font size
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${fontSize}px`);
    }
  }, [fontSize]);

  // Navigate to specific chapter href
  const goToChapter = useCallback((href: string) => {
    if (renditionRef.current) {
      renditionRef.current.display(href);
    }
  }, []);

  // Expose goToChapter for parent components
  useEffect(() => {
    if (viewerRef.current) {
      (viewerRef.current as any).__goToChapter = goToChapter;
    }
  }, [goToChapter]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-2">Không thể mở sách</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Đang tải sách...</p>
          </div>
        </div>
      )}
      <div ref={viewerRef} className="w-full h-full" />
    </div>
  );
}

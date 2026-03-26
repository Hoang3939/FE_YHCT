import React from "react";
import { DocCard } from "@/features/documents/DocCard";
import type { Document } from "@/types/document";

interface DocGridProps {
  documents: Document[];
}

/**
 * DocGrid Component
 * Lưới hiển thị các DocCard theo bố cục 3 cột (responsive về 2/1 cột trên màn nhỏ)
 */
export const DocGrid = ({ documents }: DocGridProps) => {
  if (documents.length === 0) {
    return (
      <div className="col-span-3 text-center py-16 text-gray-400 text-sm">
        Không tìm thấy tài liệu phù hợp.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {documents.map((doc, index) => (
        <DocCard key={doc.id} doc={doc} index={index} />
      ))}
    </div>
  );
};

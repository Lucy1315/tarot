"use client";

import { useState } from "react";
import CardBack from "./CardBack";

interface ManualPickerProps {
  cardCount: number;
  onComplete: (selectedIds: number[]) => void;
}

export default function ManualPicker({
  cardCount,
  onComplete,
}: ManualPickerProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  function toggleCard(id: number) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= cardCount) return prev;
      return [...prev, id];
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        카드를 {cardCount}장 선택하세요 ({selectedIds.length}/{cardCount})
      </p>

      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1 sm:gap-1.5">
        {Array.from({ length: 78 }, (_, i) => {
          const orderIndex = selectedIds.indexOf(i);
          return (
            <CardBack
              key={i}
              selected={
                orderIndex !== -1 ? orderIndex + 1 : undefined
              }
              onClick={() => toggleCard(i)}
            />
          );
        })}
      </div>

      <button
        onClick={() => onComplete(selectedIds)}
        disabled={selectedIds.length !== cardCount}
        className="w-full py-3 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
      >
        결과 보기
      </button>
    </div>
  );
}

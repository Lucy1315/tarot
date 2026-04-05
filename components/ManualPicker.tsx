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
      <p className="text-sm text-gray-500 text-center">
        카드를 {cardCount}장 선택하세요 ({selectedIds.length}/{cardCount})
      </p>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-9 sm:grid-cols-13 gap-1.5 min-w-[600px]">
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
      </div>

      <button
        onClick={() => onComplete(selectedIds)}
        disabled={selectedIds.length !== cardCount}
        className="w-full py-3 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400 bg-gray-900 text-white hover:bg-gray-800"
      >
        결과 보기
      </button>
    </div>
  );
}

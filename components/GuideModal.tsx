"use client";

import { Spread } from "@/lib/types";

interface GuideModalProps {
  spread: Spread;
  onClose: () => void;
}

export default function GuideModal({ spread, onClose }: GuideModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl w-[90vw] max-w-md max-h-[85vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-100">
            {spread.name} 가이드
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Minimap */}
        <div className="relative bg-gray-800 rounded-lg mb-4" style={{ paddingBottom: "80%" }}>
          {spread.positions.map((pos) => (
            <div
              key={pos.index}
              className="absolute flex items-center justify-center bg-gray-600 rounded text-xs font-bold text-white"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%)${pos.rotation ? ` rotate(${pos.rotation}deg)` : ""}`,
                width: "32px",
                height: "44px",
              }}
            >
              {pos.index + 1}
            </div>
          ))}
        </div>

        {/* Position list */}
        <ol className="space-y-1.5 text-sm text-gray-300">
          {spread.positions.map((pos) => (
            <li key={pos.index} className="flex gap-2">
              <span className="text-gray-500 w-6 text-right shrink-0">
                {pos.index + 1}.
              </span>
              <span>{pos.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

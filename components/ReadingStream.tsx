"use client";

import { useEffect, useState, useRef } from "react";
import { DrawnCard, Spread } from "@/lib/types";

interface ReadingStreamProps {
  spread: Spread;
  drawnCards: DrawnCard[];
  question: string;
}

export default function ReadingStream({
  spread,
  drawnCards,
  question,
}: ReadingStreamProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchReading() {
      try {
        const response = await fetch("/api/reading", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            spread: spread.name,
            cards: drawnCards.map((d) => ({
              position:
                spread.positions.find((p) => p.index === d.position)?.label ??
                "",
              name: d.card.nameEn,
              reversed: d.reversed,
            })),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "해석 중 오류가 발생했습니다");
          setLoading(false);
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          setError("스트리밍을 시작할 수 없습니다");
          setLoading(false);
          return;
        }

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setText((prev) => prev + decoder.decode(value, { stream: true }));
        }
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("해석이 중단되었습니다.");
        setLoading(false);
      }
    }

    fetchReading();

    return () => controller.abort();
  }, [spread, drawnCards, question]);

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-bold">AI 해석</h3>
      <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {text}
        {loading && <span className="animate-pulse">▌</span>}
      </div>
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg p-3">
          {error}
          <button
            onClick={() => {
              setError(null);
              setText("");
              setLoading(true);
            }}
            className="ml-2 underline"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
}

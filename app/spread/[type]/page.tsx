"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { spreads } from "@/data/spreads";
import { DrawnCard } from "@/lib/types";
import { autoShuffle, manualPick } from "@/lib/shuffle";
import SetupForm from "@/components/SetupForm";
import ManualPicker from "@/components/ManualPicker";
import SpreadLayout from "@/components/SpreadLayout";
import ReadingStream from "@/components/ReadingStream";

type Phase = "setup" | "picking" | "result";

export default function SpreadPage() {
  const params = useParams();
  const router = useRouter();
  const spread = spreads.find((s) => s.id === params.type);

  const [phase, setPhase] = useState<Phase>("setup");
  const [question, setQuestion] = useState("");
  const [allowReversed, setAllowReversed] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [readingKey, setReadingKey] = useState(0);

  if (!spread) {
    router.replace("/");
    return null;
  }

  const resolvedSpread = spread;

  function handleStart(config: {
    question: string;
    allowReversed: boolean;
    mode: "auto" | "manual";
  }) {
    setQuestion(config.question);
    setAllowReversed(config.allowReversed);
    setMode(config.mode);

    if (config.mode === "auto") {
      const cards = autoShuffle(resolvedSpread.cardCount, config.allowReversed);
      setDrawnCards(cards);
      setReadingKey((k) => k + 1);
      setPhase("result");
    } else {
      setPhase("picking");
    }
  }

  function handleManualComplete(selectedIds: number[]) {
    const cards = manualPick(selectedIds, allowReversed);
    setDrawnCards(cards);
    setReadingKey((k) => k + 1);
    setPhase("result");
  }

  function handleReset() {
    setPhase("setup");
    setDrawnCards([]);
    setQuestion("");
  }

  return (
    <div>
      <button
        onClick={() => router.push("/")}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
      >
        ← 스프레드 선택
      </button>

      {phase === "setup" && (
        <SetupForm spreadName={spread.name} onStart={handleStart} />
      )}

      {phase === "picking" && (
        <ManualPicker
          cardCount={spread.cardCount}
          onComplete={handleManualComplete}
        />
      )}

      {phase === "result" && (
        <div>
          {question && (
            <div className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">나의 질문</p>
              <p className="text-sm font-medium dark:text-gray-200">{question}</p>
            </div>
          )}
          <SpreadLayout spread={spread} drawnCards={drawnCards} />
          <ReadingStream
            key={readingKey}
            spread={spread}
            drawnCards={drawnCards}
            question={question}
          />
          <button
            onClick={handleReset}
            className="mt-6 w-full py-3 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 dark:text-gray-300 transition-colors"
          >
            다시 뽑기
          </button>
        </div>
      )}
    </div>
  );
}

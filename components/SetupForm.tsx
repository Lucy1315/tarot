"use client";

import { useState } from "react";
import { Spread } from "@/lib/types";
import GuideModal from "./GuideModal";

interface SetupFormProps {
  spread: Spread;
  onStart: (config: {
    question: string;
    allowReversed: boolean;
    mode: "auto" | "manual";
  }) => void;
  onGoHome: () => void;
}

const spreadNameMap: Record<string, string> = {
  "원 카드": "ONE CARD",
  "2카드": "2 CARDS",
  "3카드": "3 CARDS",
  "4카드": "4 CARDS",
  "5카드": "5 CARDS",
  "더블 라인": "DOUBLE LINE",
  "켈틱 크로스": "CELTIC CROSS",
  "미니 켈틱 크로스": "MINI CELTIC",
  "십자": "CROSS",
  "말발굽": "HORSESHOE",
  "매직 세븐": "MAGIC SEVEN",
  "피라미드": "PYRAMID",
  "양자택일": "ALTERNATIVE",
  "탄뎀": "TANDEM",
  "릴레이션십": "RELATIONSHIP",
  "컵 오브 릴레이션십": "CUP OF RELATIONSHIP",
  "음양": "YIN-YANG",
  "리딩 마인드": "READING MIND",
  "호로스코프": "HOROSCOPE",
  "1년 운세": "YEARLY FORTUNE",
};

export default function SetupForm({
  spread,
  onStart,
  onGoHome,
}: SetupFormProps) {
  const [question, setQuestion] = useState("");
  const [allowReversed, setAllowReversed] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [showGuide, setShowGuide] = useState(false);

  const displayName = spreadNameMap[spread.name] || spread.name.toUpperCase();

  return (
    <div className="space-y-5">
      {/* Top tab navigation — half width, centered */}
      <div className="flex justify-center">
        <div className="flex w-1/2 rounded-lg overflow-hidden border border-gray-600">
          <button
            onClick={onGoHome}
            className="flex-1 py-2 text-sm font-medium transition-colors bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            홈
          </button>
          <button
            onClick={() => setShowGuide(true)}
            className="flex-1 py-2 text-sm font-medium transition-colors border-l border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
          >
            카드 위치 가이드
          </button>
        </div>
      </div>

      {/* Spread name in gold */}
      <h2 className="text-2xl font-bold text-center italic" style={{ color: "#D4A574" }}>
        {displayName}
      </h2>

      {/* Mode selection buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("auto")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            mode === "auto"
              ? "bg-[#B56B6B] text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          자동 셔플
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            mode === "manual"
              ? "bg-[#B56B6B] text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          수동 셔플
        </button>
      </div>

      {/* Question input */}
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="궁금한 것을 입력하세요"
        className="w-full border border-gray-600 bg-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B56B6B]"
      />

      {/* Reverse toggle */}
      <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
        <span className="text-gray-300">역방향</span>
        <button
          role="switch"
          aria-checked={allowReversed}
          onClick={() => setAllowReversed(!allowReversed)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            allowReversed ? "bg-[#B56B6B]" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              allowReversed ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={allowReversed ? "text-gray-200" : "text-gray-500"}>
          {allowReversed ? "On" : "Off"}
        </span>
        <div className="relative group">
          <button
            type="button"
            className="w-5 h-5 rounded-full border border-gray-500 text-gray-400 text-xs flex items-center justify-center hover:border-gray-300 hover:text-gray-200 transition-colors"
          >
            ?
          </button>
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 p-3 rounded-lg bg-gray-700 text-xs text-gray-200 shadow-lg z-20 leading-relaxed">
            역방향을 켜면 카드가 뒤집혀 나올 수 있어, 한 장의 카드에서 정방향과 역방향 두 가지 의미를 모두 읽을 수 있습니다. 더 섬세하고 깊이 있는 리딩이 가능해집니다.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart({ question, allowReversed, mode })}
        className="w-full py-3 rounded-lg text-sm font-medium transition-colors border-2 border-[#B56B6B] text-[#D4A574] hover:bg-[#B56B6B] hover:text-white"
      >
        {mode === "auto" ? "셔플하기" : "카드 선택하기"}
      </button>

      {/* Guide modal */}
      {showGuide && (
        <GuideModal spread={spread} onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
}

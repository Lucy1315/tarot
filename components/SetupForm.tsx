"use client";

import { useState } from "react";

interface SetupFormProps {
  spreadName: string;
  spreadDescription: string;
  cardCount: number;
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
  "더블 라인 6": "DOUBLE LINE 6",
  "더블 라인 7": "DOUBLE LINE 7",
  "더블 라인 8": "DOUBLE LINE 8",
  "더블 라인 9": "DOUBLE LINE 9",
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
};

export default function SetupForm({
  spreadName,
  spreadDescription,
  cardCount,
  onStart,
  onGoHome,
}: SetupFormProps) {
  const [question, setQuestion] = useState("");
  const [allowReversed, setAllowReversed] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [activeTab, setActiveTab] = useState<"menu" | "guide">("menu");

  const displayName = spreadNameMap[spreadName] || spreadName.toUpperCase();

  return (
    <div className="space-y-5">
      {/* Top tab navigation */}
      <div className="flex rounded-lg overflow-hidden border border-gray-600">
        <button
          onClick={() => {
            if (activeTab === "menu") {
              onGoHome();
            } else {
              setActiveTab("menu");
            }
          }}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "menu"
              ? "bg-gray-600 dark:bg-gray-600 text-gray-100"
              : "bg-gray-800 dark:bg-gray-800 text-gray-400 hover:text-gray-200"
          }`}
        >
          메뉴
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors border-l border-gray-600 ${
            activeTab === "guide"
              ? "bg-gray-600 dark:bg-gray-600 text-gray-100"
              : "bg-gray-800 dark:bg-gray-800 text-gray-400 hover:text-gray-200"
          }`}
        >
          가이드
        </button>
      </div>

      {activeTab === "guide" ? (
        /* Guide tab content */
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center italic" style={{ color: "#D4A574" }}>
            {displayName} 가이드
          </h2>
          <div className="p-4 rounded-lg bg-gray-800 dark:bg-gray-800 text-sm text-gray-300 space-y-2">
            <p>{spreadDescription}</p>
            <p className="text-gray-400">카드 수: {cardCount}장</p>
          </div>
        </div>
      ) : (
        /* Menu tab content */
        <>
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
          <div className="flex items-center justify-center text-sm text-gray-400">
            <button
              onClick={() => setAllowReversed(!allowReversed)}
              className="flex items-center gap-1.5 hover:text-gray-200 transition-colors"
            >
              <span
                className={`inline-block w-2.5 h-2.5 rounded-sm ${
                  allowReversed ? "bg-[#B56B6B]" : "bg-gray-600"
                }`}
              />
              역방향 {allowReversed ? "On" : "Off"}
            </button>
          </div>

          {/* Start button */}
          <button
            onClick={() => onStart({ question, allowReversed, mode })}
            className="w-full py-3 rounded-lg text-sm font-medium transition-colors border-2 border-[#B56B6B] text-[#D4A574] hover:bg-[#B56B6B] hover:text-white"
          >
            {mode === "auto" ? "셔플하기" : "카드 선택하기"}
          </button>
        </>
      )}
    </div>
  );
}

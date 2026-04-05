"use client";

import { useState } from "react";

interface SetupFormProps {
  spreadName: string;
  onStart: (config: {
    question: string;
    allowReversed: boolean;
    mode: "auto" | "manual";
  }) => void;
}

export default function SetupForm({ spreadName, onStart }: SetupFormProps) {
  const [question, setQuestion] = useState("");
  const [allowReversed, setAllowReversed] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{spreadName}</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          질문 (선택사항)
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="궁금한 것을 입력하세요"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">역방향 카드</span>
        <button
          type="button"
          onClick={() => setAllowReversed(!allowReversed)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            allowReversed ? "bg-gray-900 dark:bg-gray-200" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              allowReversed ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          선택 방식
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("auto")}
            className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
              mode === "auto"
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
            }`}
          >
            자동 셔플
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
              mode === "manual"
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
            }`}
          >
            수동 선택
          </button>
        </div>
      </div>

      <button
        onClick={() => onStart({ question, allowReversed, mode })}
        className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        {mode === "auto" ? "셔플하기" : "카드 선택하기"}
      </button>
    </div>
  );
}

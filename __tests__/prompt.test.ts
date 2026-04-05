import { describe, it, expect } from "vitest";
import { buildReadingPrompt } from "@/lib/prompt";

describe("buildReadingPrompt", () => {
  it("includes spread name and question", () => {
    const prompt = buildReadingPrompt({
      spreadName: "3카드",
      question: "이직해도 될까요?",
      cards: [
        { position: "과거", name: "The Fool", reversed: false },
        { position: "현재", name: "The Tower", reversed: true },
        { position: "미래", name: "The Sun", reversed: false },
      ],
    });
    expect(prompt).toContain("3카드");
    expect(prompt).toContain("이직해도 될까요?");
    expect(prompt).toContain("The Fool");
    expect(prompt).toContain("The Tower (역방향)");
    expect(prompt).toContain("The Sun");
  });

  it("handles empty question", () => {
    const prompt = buildReadingPrompt({
      spreadName: "원 카드",
      question: "",
      cards: [{ position: "핵심 메시지", name: "The Star", reversed: false }],
    });
    expect(prompt).toContain("원 카드");
    expect(prompt).not.toContain("질문:");
  });

  it("marks reversed cards", () => {
    const prompt = buildReadingPrompt({
      spreadName: "원 카드",
      question: "",
      cards: [{ position: "핵심 메시지", name: "Death", reversed: true }],
    });
    expect(prompt).toContain("Death (역방향)");
  });
});

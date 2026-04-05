import { describe, it, expect } from "vitest";
import { autoShuffle, manualPick } from "@/lib/shuffle";
import { cards } from "@/data/cards";

describe("autoShuffle", () => {
  it("returns the correct number of cards", () => {
    const result = autoShuffle(3, false);
    expect(result).toHaveLength(3);
  });

  it("returns unique cards", () => {
    const result = autoShuffle(10, false);
    const ids = result.map((d) => d.card.id);
    expect(new Set(ids).size).toBe(10);
  });

  it("assigns sequential positions starting from 0", () => {
    const result = autoShuffle(5, false);
    expect(result.map((d) => d.position)).toEqual([0, 1, 2, 3, 4]);
  });

  it("sets all reversed to false when allowReversed is false", () => {
    const result = autoShuffle(20, false);
    expect(result.every((d) => d.reversed === false)).toBe(true);
  });

  it("produces some reversed cards when allowReversed is true (statistical)", () => {
    let hasReversed = false;
    for (let i = 0; i < 100; i++) {
      const result = autoShuffle(20, true);
      if (result.some((d) => d.reversed)) {
        hasReversed = true;
        break;
      }
    }
    expect(hasReversed).toBe(true);
  });

  it("returns valid card objects from the deck", () => {
    const result = autoShuffle(5, false);
    const allIds = cards.map((c) => c.id);
    result.forEach((d) => {
      expect(allIds).toContain(d.card.id);
    });
  });
});

describe("manualPick", () => {
  it("returns cards matching the selected IDs in order", () => {
    const result = manualPick([0, 5, 21], false);
    expect(result).toHaveLength(3);
    expect(result[0].card.id).toBe(0);
    expect(result[1].card.id).toBe(5);
    expect(result[2].card.id).toBe(21);
  });

  it("assigns sequential positions", () => {
    const result = manualPick([10, 20, 30], false);
    expect(result.map((d) => d.position)).toEqual([0, 1, 2]);
  });

  it("sets all reversed to false when allowReversed is false", () => {
    const result = manualPick([0, 1, 2], false);
    expect(result.every((d) => d.reversed === false)).toBe(true);
  });
});

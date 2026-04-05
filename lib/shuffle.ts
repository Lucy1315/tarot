import { cards } from "@/data/cards";
import { DrawnCard } from "@/lib/types";

function cryptoRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(cryptoRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function assignReversed(allowReversed: boolean): boolean {
  if (!allowReversed) return false;
  return cryptoRandom() < 0.5;
}

export function autoShuffle(
  cardCount: number,
  allowReversed: boolean
): DrawnCard[] {
  const shuffled = fisherYatesShuffle(cards);
  return shuffled.slice(0, cardCount).map((card, index) => ({
    card,
    position: index,
    reversed: assignReversed(allowReversed),
  }));
}

export function manualPick(
  selectedIds: number[],
  allowReversed: boolean
): DrawnCard[] {
  return selectedIds.map((id, index) => {
    const card = cards.find((c) => c.id === id);
    if (!card) throw new Error(`Card not found: ${id}`);
    return {
      card,
      position: index,
      reversed: assignReversed(allowReversed),
    };
  });
}

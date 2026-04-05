export interface Card {
  id: number;
  name: string;
  nameEn: string;
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  number: number;
  image: string;
}

export interface SpreadPosition {
  index: number;
  label: string;
  x: number;
  y: number;
  rotation?: number;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  card: Card;
  position: number;
  reversed: boolean;
}

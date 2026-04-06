import { Spread, DrawnCard } from "@/lib/types";
import CardFace from "./CardFace";

interface SpreadLayoutProps {
  spread: Spread;
  drawnCards: DrawnCard[];
}

export default function SpreadLayout({
  spread,
  drawnCards,
}: SpreadLayoutProps) {
  // Calculate the actual height needed based on card positions
  // Cards are at y% positions, add some padding for card height
  const maxY = Math.max(...spread.positions.map((p) => p.y));
  // Add 15% for card height below the last card center + label text
  const heightPercent = Math.min(maxY + 18, 100);

  return (
    <div className="relative w-full" style={{ paddingBottom: `${heightPercent}%` }}>
      <div className="absolute inset-0">
        {spread.positions.map((pos) => {
          const drawn = drawnCards.find((d) => d.position === pos.index);
          if (!drawn) return null;

          return (
            <div
              key={pos.index}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: pos.rotation
                  ? `translate(-50%, -50%) rotate(${pos.rotation}deg)`
                  : "translate(-50%, -50%)",
              }}
            >
              <CardFace
                card={drawn.card}
                reversed={drawn.reversed}
                label={pos.label}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  return (
    <div className="relative w-full" style={{ paddingBottom: "100%" }}>
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

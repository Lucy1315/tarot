import Image from "next/image";
import { Card } from "@/lib/types";

interface CardFaceProps {
  card: Card;
  reversed: boolean;
  label: string;
}

export default function CardFace({ card, reversed, label }: CardFaceProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-20 h-36 sm:w-24 sm:h-40 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm ${
          reversed ? "rotate-180" : ""
        }`}
      >
        <Image
          src={card.image}
          alt={card.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium">
        {card.name}
        {reversed ? " (역)" : ""}
      </span>
    </div>
  );
}

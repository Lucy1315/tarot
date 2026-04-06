import Link from "next/link";
import { spreads } from "@/data/spreads";

export default function SpreadGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {spreads.map((spread) => (
        <Link
          key={spread.id}
          href={`/spread/${spread.id}`}
          className="block py-3 px-4 rounded-lg transition-colors bg-[#3B4557] hover:bg-[#4A5568] text-center"
        >
          <span className="block text-sm font-medium text-[#8EACC1]">
            {spread.name}
          </span>
          <span className="block text-xs text-gray-400 mt-1 line-clamp-2">
            {spread.description}
          </span>
        </Link>
      ))}
    </div>
  );
}

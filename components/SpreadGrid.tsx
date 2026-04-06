import Link from "next/link";
import { spreads } from "@/data/spreads";

export default function SpreadGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {spreads.map((spread) => (
        <Link
          key={spread.id}
          href={`/spread/${spread.id}`}
          className="block py-3.5 px-4 rounded-lg text-sm font-medium transition-colors bg-[#3B4557] hover:bg-[#4A5568] text-[#8EACC1]"
        >
          {spread.name}
        </Link>
      ))}
    </div>
  );
}

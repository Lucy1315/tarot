import Link from "next/link";
import { spreads } from "@/data/spreads";

export default function SpreadGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {spreads.map((spread) => (
        <Link
          key={spread.id}
          href={`/spread/${spread.id}`}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all"
        >
          <h3 className="font-medium text-sm">{spread.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{spread.cardCount}장</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
            {spread.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

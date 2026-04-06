interface CardBackProps {
  selected?: number;
  onClick?: () => void;
}

export default function CardBack({ selected, onClick }: CardBackProps) {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-[5/7] w-full rounded border-2 transition-all ${
        selected !== undefined
          ? "border-gray-900 dark:border-gray-200 bg-gray-800 dark:bg-gray-700"
          : "border-gray-300 dark:border-gray-600 bg-gray-700 dark:bg-gray-800 hover:border-gray-500"
      }`}
    >
      <div className="absolute inset-0.5 border border-gray-500 rounded opacity-50" />
      {selected !== undefined && (
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs sm:text-lg">
          {selected}
        </span>
      )}
    </button>
  );
}

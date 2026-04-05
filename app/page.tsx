import SpreadGrid from "@/components/SpreadGrid";

export default function Home() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">타로 리딩</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          스프레드를 선택하고 AI 타로 해석을 받아보세요
        </p>
      </div>
      <SpreadGrid />
    </div>
  );
}

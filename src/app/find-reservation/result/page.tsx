import { Suspense } from "react";
import ResultList from "./ResultList";

export default function FindReservationResultPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b py-4">
        <h1 className="text-center text-2xl font-semibold">検索結果</h1>
      </header>
      <Suspense>
        <ResultList />
      </Suspense>
    </div>
  );
} 
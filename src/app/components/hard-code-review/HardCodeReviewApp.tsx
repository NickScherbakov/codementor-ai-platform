import { useState } from "react";
import { CodeInputPage } from "./CodeInputPage";
import { ResultsPage, ReviewResult } from "./ResultsPage";
import { LoadingSpinner } from "./LoadingStates";
import { analyzeCode } from "./mockData";

type AppState = "input" | "processing" | "results";

export function HardCodeReviewApp() {
  const [state, setState] = useState<AppState>("input");
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleSubmit = async (code: string, language: string) => {
    setState("processing");
    try {
      const analysis = await analyzeCode(code, language);
      setResult(analysis);
      setState("results");
    } catch (error) {
      console.error("Analysis failed:", error);
      setState("input");
    }
  };

  const handleBack = () => {
    setState("input");
    setResult(null);
  };

  if (state === "processing") {
    return (
      <div className="min-h-screen bg-[#1F2937] flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="text-[#D1D5DB] mt-4 text-sm font-mono">Analyzing your code...</p>
        <p className="text-[#9CA3AF] mt-2 text-xs">This won't take long. Unlike your code review.</p>
      </div>
    );
  }

  if (state === "results" && result) {
    return <ResultsPage result={result} onBack={handleBack} />;
  }

  return <CodeInputPage onSubmit={handleSubmit} />;
}

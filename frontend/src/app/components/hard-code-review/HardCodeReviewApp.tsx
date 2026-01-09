import { useState } from "react";
import { CodeInputPage } from "./CodeInputPage";
import { ResultsPage, ReviewResult } from "./ResultsPage";
import { LoadingSpinner } from "./LoadingStates";
import { submitCodeReview } from "./api";

type AppState = "input" | "processing" | "results" | "error";

export function HardCodeReviewApp() {
  const [state, setState] = useState<AppState>("input");
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (code: string, language: string) => {
    setState("processing");
    setError(null);
    
    try {
      // Call real backend API
      const analysis = await submitCodeReview(code, language);
      setResult(analysis);
      setState("results");
    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze code";
      setError(errorMessage);
      setState("error");
    }
  };

  const handleBack = () => {
    setState("input");
    setResult(null);
    setError(null);
  };

  if (state === "processing") {
    return (
      <div className="min-h-screen bg-[#1F2937] flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="text-[#D1D5DB] mt-4 text-sm font-mono">Analyzing your code...</p>
        <p className="text-[#9CA3AF] mt-2 text-xs">Connecting to backend review engine...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="min-h-screen bg-[#1F2937] flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-[#374151] border border-[#EF4444] rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#EF4444] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">!</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">Review Failed</h2>
              <p className="text-[#9CA3AF] text-sm">Something went wrong</p>
            </div>
          </div>
          
          <div className="bg-[#1F2937] border border-[#4B5563] rounded p-4 mb-6">
            <p className="text-[#E5E7EB] font-mono text-sm">{error}</p>
          </div>

          {error?.includes('limit') && (
            <div className="bg-[#1E293B] border border-[#F59E0B] rounded p-4 mb-6">
              <p className="text-[#FCD34D] font-mono text-sm font-bold mb-2">🔒 Free Tier Limit Reached</p>
              <p className="text-[#D1D5DB] text-sm">
                You've used your 3 free reviews. Subscribe to continue getting hard, honest feedback.
              </p>
            </div>
          )}

          <button
            onClick={handleBack}
            className="w-full bg-[#EF4444] text-white font-mono text-sm uppercase tracking-wider py-3 hover:bg-[#DC2626] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (state === "results" && result) {
    return <ResultsPage result={result} onBack={handleBack} />;
  }

  return <CodeInputPage onSubmit={handleSubmit} />;
}

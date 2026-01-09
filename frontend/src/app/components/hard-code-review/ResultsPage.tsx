import { SeverityBadge } from "./SeverityBadge";
import { SummaryCard } from "./SummaryCard";
import { FindingsContainer } from "./FindingsContainer";
import { NextStepsSection } from "./NextStepsSection";
import { CodeComparison } from "./CodeComparison";
import { HCRButton } from "./HCRButton";
import { FindingType } from "./FindingCard";
import { ArrowLeft } from "lucide-react";

export interface ReviewResult {
  severity: "hard" | "medium" | "good";
  summary: string;
  findings: Array<{
    type: FindingType;
    title: string;
    explain: string;
    fix: string;
    example_patch: string;
  }>;
  next_steps: string[];
  comparison?: {
    yourCode: string;
    suggestedFix: string;
  };
}

interface ResultsPageProps {
  result: ReviewResult;
  onBack: () => void;
}

export function ResultsPage({ result, onBack }: ResultsPageProps) {
  return (
    <div className="min-h-screen bg-[#1F2937] text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6">
          <HCRButton variant="tertiary" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </HCRButton>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">CODE REVIEW RESULTS</h1>
          <SeverityBadge variant={result.severity} />
        </div>

        <div className="mb-6">
          <SummaryCard summary={result.summary} />
        </div>

        {result.comparison && (
          <div className="mb-6">
            <CodeComparison
              yourCode={result.comparison.yourCode}
              suggestedFix={result.comparison.suggestedFix}
            />
          </div>
        )}

        <div className="mb-6">
          <FindingsContainer findings={result.findings} />
        </div>

        {result.next_steps.length > 0 && (
          <div className="mb-6">
            <NextStepsSection steps={result.next_steps} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <HCRButton variant="primary" onClick={onBack}>
            Review Another File
          </HCRButton>
          <HCRButton variant="secondary" onClick={() => window.print()}>
            Export Results
          </HCRButton>
        </div>
      </div>
    </div>
  );
}

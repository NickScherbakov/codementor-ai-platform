// Main Application
export { HardCodeReviewApp } from "./HardCodeReviewApp";

// Pages
export { CodeInputPage } from "./CodeInputPage";
export { ResultsPage } from "./ResultsPage";
export type { ReviewResult } from "./ResultsPage";

// Components
export { HCRButton } from "./HCRButton";
export { SeverityBadge } from "./SeverityBadge";
export { SummaryCard } from "./SummaryCard";
export { FindingCard } from "./FindingCard";
export type { FindingType } from "./FindingCard";
export { FindingsContainer } from "./FindingsContainer";
export { NextStepsSection } from "./NextStepsSection";
export { CodeComparison } from "./CodeComparison";
export { LoadingSpinner, SkeletonLoader } from "./LoadingStates";

// Utilities
export { analyzeCode } from "./mockData";

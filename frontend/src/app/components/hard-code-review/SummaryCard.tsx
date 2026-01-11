import { SeverityBadge } from "./SeverityBadge";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

interface SummaryCardProps {
  summary?: string;
  label?: string;
  value?: string | number;
  severity?: Severity;
  description?: string;
}

const severityColors = {
  critical: "text-[#EF4444]",
  high: "text-[#F97316]",
  medium: "text-[#FBBF24]",
  low: "text-[#3B82F6]",
  info: "text-[#10B981]"
};

export function SummaryCard({ summary, label, value, severity, description }: SummaryCardProps) {
  // If summary is provided, use it as the main content
  if (summary) {
    return (
      <div className="bg-[#111827] border border-[#374151] rounded p-5 hover:shadow-lg hover:shadow-[#374151]/50 transition-all duration-300">
        <p className="text-base text-[#D1D5DB] leading-relaxed">{summary}</p>
      </div>
    );
  }

  // Otherwise, use the label/value format
  return (
    <div className="bg-[#111827] border border-[#374151] rounded p-5 hover:shadow-lg hover:shadow-[#374151]/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-bold text-[#9CA3AF] tracking-wider uppercase">
          {label}
        </div>
        {severity && <SeverityBadge severity={severity} />}
      </div>
      
      <div className={`text-3xl font-bold mb-2 ${severity ? severityColors[severity] : 'text-white'}`}>
        {value}
      </div>
      
      {description && (
        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
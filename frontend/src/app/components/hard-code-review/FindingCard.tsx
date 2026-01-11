import { XCircle, AlertTriangle, Zap, Shield, Info } from "lucide-react";
import { cn } from "../ui/utils";
import { SeverityBadge } from "./SeverityBadge";

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type FindingType = "bug" | "security" | "performance" | "design" | "style";

interface FindingCardProps {
  type?: FindingType;
  severity?: Severity;
  title: string;
  explain?: string;
  description?: string;
  fix?: string;
  examplePatch?: string;
  category?: string;
  lineNumbers?: string;
  impact?: string;
  effort?: string;
  codeSnippet?: string;
  index?: number;
}

const typeToSeverity: Record<FindingType, Severity> = {
  bug: "critical",
  security: "critical",
  performance: "high",
  design: "medium",
  style: "low"
};

const typeToCategory: Record<FindingType, string> = {
  bug: "BUG",
  security: "SECURITY",
  performance: "PERFORMANCE",
  design: "DESIGN",
  style: "STYLE"
};

const severityConfig = {
  critical: {
    icon: XCircle,
    borderColor: "border-l-[#EF4444]",
    bgColor: "bg-[#EF4444]/10"
  },
  high: {
    icon: AlertTriangle,
    borderColor: "border-l-[#F97316]",
    bgColor: "bg-[#F97316]/10"
  },
  medium: {
    icon: Zap,
    borderColor: "border-l-[#FBBF24]",
    bgColor: "bg-[#FBBF24]/10"
  },
  low: {
    icon: Info,
    borderColor: "border-l-[#3B82F6]",
    bgColor: "bg-[#3B82F6]/10"
  },
  info: {
    icon: Shield,
    borderColor: "border-l-[#10B981]",
    bgColor: "bg-[#10B981]/10"
  }
};

export function FindingCard({ 
  type,
  severity: propSeverity,
  title, 
  explain,
  description,
  fix,
  examplePatch,
  category,
  lineNumbers,
  impact,
  effort,
  codeSnippet,
  index = 0 
}: FindingCardProps) {
  const severity = propSeverity || (type ? typeToSeverity[type] : "info");
  const finalCategory = category || (type ? typeToCategory[type] : "GENERAL");
  const config = severityConfig[severity];
  const Icon = config.icon;
  const finalDescription = explain || description || "";

  return (
    <div
      className={cn(
        "bg-[#111827] border border-[#374151] border-l-4 rounded p-5 hover:shadow-lg hover:shadow-[#374151]/50 transition-all duration-300",
        config.borderColor,
        config.bgColor
      )}
      style={{
        animation: `slideUp 400ms ease-out ${index * 100}ms backwards`
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <SeverityBadge severity={severity} />
              <span className="text-xs font-bold text-[#9CA3AF] tracking-wider">{finalCategory}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
          </div>
        </div>
        {lineNumbers && (
          <div className="text-xs text-[#9CA3AF] font-mono">
            Lines {lineNumbers}
          </div>
        )}
      </div>

      {finalDescription && (
        <div className="mb-4">
          <p className="text-sm text-[#D1D5DB] leading-relaxed">{finalDescription}</p>
        </div>
      )}

      {fix && (
        <div className="mb-4">
          <div className="text-xs font-bold text-[#9CA3AF] mb-2 tracking-wider">HOW TO FIX</div>
          <p className="text-sm text-[#D1D5DB] leading-relaxed">{fix}</p>
        </div>
      )}

      {(impact || effort) && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {impact && (
            <div>
              <div className="text-xs font-bold text-[#9CA3AF] mb-1 tracking-wider">IMPACT</div>
              <p className="text-sm text-[#D1D5DB]">{impact}</p>
            </div>
          )}
          {effort && (
            <div>
              <div className="text-xs font-bold text-[#9CA3AF] mb-1 tracking-wider">EFFORT</div>
              <p className="text-sm text-[#D1D5DB]">{effort}</p>
            </div>
          )}
        </div>
      )}

      {(examplePatch || codeSnippet) && (
        <div>
          <div className="text-xs font-bold text-[#9CA3AF] mb-2 tracking-wider">CODE</div>
          <div className="bg-[#0F172A] border border-[#374151] rounded p-3 overflow-x-auto">
            <pre className="text-xs text-[#E5E7EB] font-mono leading-relaxed">{examplePatch || codeSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

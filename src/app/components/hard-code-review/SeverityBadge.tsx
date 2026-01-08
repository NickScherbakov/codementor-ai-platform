import { cn } from "../ui/utils";

interface SeverityBadgeProps {
  variant?: "hard" | "medium" | "good";
  severity?: "critical" | "high" | "medium" | "low" | "info";
  className?: string;
}

export function SeverityBadge({ variant, severity, className }: SeverityBadgeProps) {
  // Support both variant (for result severity) and severity (for finding severity)
  const finalSeverity = variant === "hard" ? "critical" : variant === "medium" ? "high" : variant === "good" ? "info" : severity || "info";

  const variants = {
    critical: {
      bg: "bg-[#EF4444]",
      text: "text-white",
      icon: "🔴",
      label: "CRITICAL"
    },
    high: {
      bg: "bg-[#F97316]",
      text: "text-white",
      icon: "⚠️",
      label: "HIGH"
    },
    medium: {
      bg: "bg-[#FBBF24]",
      text: "text-white",
      icon: "⚡",
      label: "MEDIUM"
    },
    low: {
      bg: "bg-[#3B82F6]",
      text: "text-white",
      icon: "ℹ️",
      label: "LOW"
    },
    info: {
      bg: "bg-[#10B981]",
      text: "text-white",
      icon: "✅",
      label: "INFO"
    }
  };

  const config = variants[finalSeverity];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded h-6",
        config.bg,
        config.text,
        className
      )}
    >
      <span className="text-sm">{config.icon}</span>
      <span className="text-xs font-bold tracking-wider">{config.label}</span>
    </div>
  );
}
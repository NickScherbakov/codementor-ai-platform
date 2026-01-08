import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export type StepPriority = "critical" | "high" | "medium" | "low";

interface NextStep {
  title: string;
  description: string;
  priority: StepPriority;
  estimatedTime?: string;
}

interface NextStepsSectionProps {
  steps: string[] | NextStep[];
}

const priorityConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "border-l-[#EF4444]"
  },
  high: {
    icon: AlertTriangle,
    color: "text-[#F97316]",
    bg: "bg-[#F97316]/10",
    border: "border-l-[#F97316]"
  },
  medium: {
    icon: Info,
    color: "text-[#FBBF24]",
    bg: "bg-[#FBBF24]/10",
    border: "border-l-[#FBBF24]"
  },
  low: {
    icon: Info,
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
    border: "border-l-[#3B82F6]"
  }
};

export function NextStepsSection({ steps }: NextStepsSectionProps) {
  const normalizedSteps: NextStep[] = steps.map((step, index) => {
    if (typeof step === 'string') {
      return {
        title: `Step ${index + 1}`,
        description: step,
        priority: "medium" as StepPriority
      };
    }
    return step;
  });

  return (
    <div className="bg-[#111827] border border-[#374151] rounded p-6">
      <h2 className="text-xl font-bold text-white mb-6 tracking-wide">NEXT STEPS</h2>
      <div className="space-y-4">
        {normalizedSteps.map((step, index) => {
          const config = priorityConfig[step.priority];
          const Icon = config.icon;
          
          return (
            <div 
              key={index} 
              className={`bg-[#1F2937] border border-[#374151] border-l-4 rounded p-4 ${config.border} ${config.bg}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white">{step.title}</h3>
                    {step.estimatedTime && (
                      <span className="text-xs text-[#9CA3AF] font-mono">
                        {step.estimatedTime}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#D1D5DB] leading-relaxed">{step.description}</p>
                  <div className="mt-2">
                    <span className={`text-xs font-bold tracking-wider uppercase ${config.color}`}>
                      {step.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

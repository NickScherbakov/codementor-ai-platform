import { FindingCard, FindingType } from "./FindingCard";

interface Finding {
  type: FindingType;
  title: string;
  explain: string;
  fix: string;
  example_patch: string;
}

interface FindingsContainerProps {
  findings: Finding[];
}

export function FindingsContainer({ findings }: FindingsContainerProps) {
  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <h2 className="text-xl font-bold text-white mb-6">
        FINDINGS ({findings.length} {findings.length === 1 ? "issue" : "issues"})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {findings.map((finding, index) => (
          <FindingCard
            key={index}
            type={finding.type}
            title={finding.title}
            explain={finding.explain}
            fix={finding.fix}
            examplePatch={finding.example_patch}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

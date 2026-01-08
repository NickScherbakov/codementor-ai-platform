interface CodeComparisonProps {
  yourCode?: string;
  suggestedFix?: string;
  before?: string;
  after?: string;
  title?: string;
  description?: string;
}

export function CodeComparison({ yourCode, suggestedFix, before, after, title, description }: CodeComparisonProps) {
  const beforeCode = yourCode || before || "";
  const afterCode = suggestedFix || after || "";
  const beforeLines = beforeCode.split('\n');
  const afterLines = afterCode.split('\n');

  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-bold text-white mb-2">{title}</h3>}
          {description && <p className="text-sm text-[#9CA3AF]">{description}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-bold text-[#EF4444] mb-2 tracking-wider">YOUR CODE</div>
          <div className="bg-[#0F172A] border border-[#374151] rounded overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full font-mono text-xs">
                <tbody>
                  {beforeLines.map((line, index) => (
                    <tr key={index} className="hover:bg-[#EF4444]/10">
                      <td className="text-[#6B7280] text-right pr-3 pl-2 py-1 select-none border-r border-[#374151] w-12">
                        {index + 1}
                      </td>
                      <td className="text-[#E5E7EB] pl-3 pr-2 py-1">
                        <pre className="whitespace-pre">{line || ' '}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-[#10B981] mb-2 tracking-wider">SUGGESTED FIX</div>
          <div className="bg-[#0F172A] border border-[#10B981]/50 rounded overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full font-mono text-xs">
                <tbody>
                  {afterLines.map((line, index) => (
                    <tr key={index} className="hover:bg-[#10B981]/10">
                      <td className="text-[#6B7280] text-right pr-3 pl-2 py-1 select-none border-r border-[#10B981]/30 w-12">
                        {index + 1}
                      </td>
                      <td className="text-[#E5E7EB] pl-3 pr-2 py-1 bg-[#10B981]/5">
                        <pre className="whitespace-pre">{line || ' '}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
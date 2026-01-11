import { useState } from "react";
import { Upload, Code2 } from "lucide-react";
import { HCRButton } from "./HCRButton";
import { sampleSnippets } from "./sampleSnippets";

interface CodeInputPageProps {
  onSubmit: (code: string, language: string) => void;
}

export function CodeInputPage({ onSubmit }: CodeInputPageProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isDragging, setIsDragging] = useState(false);
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code, language);
    }
  };

  const loadSample = (snippetKey: keyof typeof sampleSnippets) => {
    setCode(sampleSnippets[snippetKey]);
    setShowSamples(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">HARD CODE REVIEW</h1>
          <p className="text-base text-[#D1D5DB]">Brutal, senior-level feedback</p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2 tracking-wider">
            SELECT LANGUAGE
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full max-w-xs bg-[#111827] border border-[#374151] text-white px-4 py-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#EF4444]"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <div className="mb-6 relative">
          <label className="block text-xs font-medium text-[#9CA3AF] mb-2 tracking-wider">
            PASTE YOUR CODE
          </label>
          <div
            className="relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here or drag and drop a file..."
              className="w-full h-[500px] bg-[#0F172A] border border-[#374151] text-[#E5E7EB] p-4 rounded font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />

            {isDragging && (
              <div className="absolute inset-0 bg-[#EF4444]/10 border-2 border-dashed border-[#EF4444] rounded flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-[#EF4444] mx-auto mb-3" />
                  <p className="text-lg font-bold text-white">Drop your code file here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <button
            className="flex items-center gap-2 text-sm font-medium text-[#9CA3AF] hover:text-[#EF4444] transition-colors focus:outline-none mb-3"
            onClick={() => setShowSamples(!showSamples)}
          >
            <Code2 className="w-4 h-4" />
            {showSamples ? "Hide Sample Snippets" : "Try Sample Code Snippets"}
          </button>
          {showSamples && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => loadSample("badJavaScript")}
                className="bg-[#111827] border border-[#374151] hover:border-[#EF4444] rounded p-4 text-left transition-colors"
              >
                <div className="text-sm font-bold text-white mb-1">Bad JavaScript</div>
                <div className="text-xs text-[#9CA3AF] leading-relaxed">
                  Multiple critical issues (null checks, type coercion, race conditions)
                </div>
              </button>
              <button
                onClick={() => loadSample("mediocreTypeScript")}
                className="bg-[#111827] border border-[#374151] hover:border-[#F97316] rounded p-4 text-left transition-colors"
              >
                <div className="text-sm font-bold text-white mb-1">Mediocre TypeScript</div>
                <div className="text-xs text-[#9CA3AF] leading-relaxed">
                  Design and performance issues (O(n²) complexity)
                </div>
              </button>
              <button
                onClick={() => loadSample("badPython")}
                className="bg-[#111827] border border-[#374151] hover:border-[#EF4444] rounded p-4 text-left transition-colors"
              >
                <div className="text-sm font-bold text-white mb-1">Bad Python</div>
                <div className="text-xs text-[#9CA3AF] leading-relaxed">
                  Poor error handling and missing validations
                </div>
              </button>
              <button
                onClick={() => loadSample("goodCode")}
                className="bg-[#111827] border border-[#374151] hover:border-[#10B981] rounded p-4 text-left transition-colors"
              >
                <div className="text-sm font-bold text-white mb-1">Good Code</div>
                <div className="text-xs text-[#9CA3AF] leading-relaxed">
                  Well-written with proper error handling
                </div>
              </button>
              <button
                onClick={() => loadSample("securityIssue")}
                className="bg-[#111827] border border-[#374151] hover:border-[#EF4444] rounded p-4 text-left transition-colors"
              >
                <div className="text-sm font-bold text-white mb-1">Security Issues</div>
                <div className="text-xs text-[#9CA3AF] leading-relaxed">
                  Critical vulnerabilities (SQL injection)
                </div>
              </button>
              <button
                onClick={() => loadSample("performanceIssue")}
                className="bg-[#111827] border border-[#374151] hover:border-[#FBBF24] rounded p-4 text-left transition-colors"
              >
                <div className="text-sm font-bold text-white mb-1">Performance Issues</div>
                <div className="text-xs text-[#9CA3AF] leading-relaxed">
                  Severe performance problems (nested loops)
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <HCRButton
            variant="primary"
            onClick={handleSubmit}
            disabled={!code.trim()}
            className="px-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            SUBMIT FOR REVIEW
          </HCRButton>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6 font-mono">
          No account required. Your code is analyzed instantly.
        </p>
      </div>
    </div>
  );
}
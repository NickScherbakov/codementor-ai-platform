import { useState } from "react";
import { HardCodeReviewApp } from "./components/hard-code-review";
import { ComponentShowcase } from "./components/hard-code-review/ComponentShowcase";
import { MoneyPage } from "./components/MoneyPage";
import { ToneReference } from "./components/ToneReference";
import { DesignTokens } from "./components/DesignTokens";

type Page = "hcr" | "showcase" | "money" | "tone" | "tokens";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("hcr");

  return (
    <div className="min-h-screen">
      {/* Page Selector - Fixed Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0F172A] border-b border-[#374151] z-50 shadow-lg">
        <div className="flex items-center justify-center gap-1 p-2 flex-wrap">
          <button
            onClick={() => setCurrentPage("hcr")}
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              currentPage === "hcr"
                ? "bg-[#EF4444] text-white"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#374151]"
            }`}
          >
            App
          </button>
          <button
            onClick={() => setCurrentPage("showcase")}
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              currentPage === "showcase"
                ? "bg-[#EF4444] text-white"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#374151]"
            }`}
          >
            Components
          </button>
          <button
            onClick={() => setCurrentPage("money")}
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              currentPage === "money"
                ? "bg-[#EF4444] text-white"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#374151]"
            }`}
          >
            Money Page
          </button>
          <button
            onClick={() => setCurrentPage("tone")}
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              currentPage === "tone"
                ? "bg-[#EF4444] text-white"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#374151]"
            }`}
          >
            Tone Reference
          </button>
          <button
            onClick={() => setCurrentPage("tokens")}
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              currentPage === "tokens"
                ? "bg-[#EF4444] text-white"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#374151]"
            }`}
          >
            Design Tokens
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-16">
        {currentPage === "hcr" && <HardCodeReviewApp />}
        {currentPage === "showcase" && <ComponentShowcase />}
        {currentPage === "money" && <MoneyPage />}
        {currentPage === "tone" && <ToneReference />}
        {currentPage === "tokens" && <DesignTokens />}
      </div>
    </div>
  );
}
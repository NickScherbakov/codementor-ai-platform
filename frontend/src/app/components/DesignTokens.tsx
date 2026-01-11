export function DesignTokens() {
  const colors = {
    surface: [
      { name: "Surface 950", value: "#0a0a0a", usage: "Primary background (dark)" },
      { name: "Surface 900", value: "#171717", usage: "Secondary background, cards" },
      { name: "Surface 800", value: "#262626", usage: "Hover states, elevated surfaces" },
      { name: "Surface 50", value: "#fafafa", usage: "Primary background (light)" },
      { name: "Surface 100", value: "#f5f5f5", usage: "Secondary background" },
    ],
    text: [
      { name: "Text Primary", value: "#fafafa", usage: "Main text (dark mode)" },
      { name: "Text Secondary", value: "#a3a3a3", usage: "Supporting text" },
      { name: "Text Tertiary", value: "#525252", usage: "Disabled, metadata" },
      { name: "Text Primary Light", value: "#0a0a0a", usage: "Main text (light mode)" },
    ],
    severity: [
      { name: "Critical", value: "#ef4444", usage: "Bugs, crashes, blockers", hex: "#ef4444" },
      { name: "Security", value: "#dc2626", usage: "Security vulnerabilities", hex: "#dc2626" },
      { name: "Warning", value: "#f59e0b", usage: "Design flaws, bad patterns", hex: "#f59e0b" },
      { name: "Performance", value: "#3b82f6", usage: "Performance issues", hex: "#3b82f6" },
      { name: "Info", value: "#6b7280", usage: "Style, minor notes", hex: "#6b7280" },
    ],
    accent: [
      { name: "Primary Action", value: "#fafafa", usage: "CTA buttons on dark bg" },
      { name: "Secondary Action", value: "#171717", usage: "CTA buttons on light bg" },
    ],
  };

  const typography = {
    display: [
      { name: "Display Large", size: "72px", weight: "700", usage: "Hero headlines" },
      { name: "Display Medium", size: "56px", weight: "700", usage: "Section titles" },
      { name: "Display Small", size: "40px", weight: "700", usage: "Card headers" },
    ],
    body: [
      { name: "Body Large", size: "18px", weight: "400", usage: "Primary content" },
      { name: "Body Medium", size: "16px", weight: "400", usage: "Standard text" },
      { name: "Body Small", size: "14px", weight: "400", usage: "Captions, metadata" },
    ],
    mono: [
      { name: "Code Large", size: "16px", weight: "400", font: "monospace", usage: "Code blocks" },
      { name: "Code Medium", size: "14px", weight: "400", font: "monospace", usage: "Inline code" },
      { name: "Code Small", size: "12px", weight: "400", font: "monospace", usage: "Labels, tags" },
    ],
  };

  const spacing = [
    { name: "xs", value: "4px", usage: "Tight padding" },
    { name: "sm", value: "8px", usage: "Icon gaps" },
    { name: "md", value: "16px", usage: "Standard spacing" },
    { name: "lg", value: "24px", usage: "Section spacing" },
    { name: "xl", value: "32px", usage: "Large gaps" },
    { name: "2xl", value: "48px", usage: "Page margins" },
    { name: "3xl", value: "64px", usage: "Hero spacing" },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-4 block">
            Design System
          </span>
          <h1 className="text-6xl font-bold mb-4">Design Tokens (Lite)</h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Minimal, brutal, professional. No decoration. No friendly shapes. Just clarity and severity.
          </p>
        </div>

        {/* Color Palette */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 pb-4 border-b-2 border-neutral-900">Color Palette</h2>

          {/* Surface Colors */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-neutral-700">Surface</h3>
            <div className="grid grid-cols-5 gap-4">
              {colors.surface.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div
                    className="h-24 rounded-lg border-2 border-neutral-300"
                    style={{ backgroundColor: color.value }}
                  />
                  <div>
                    <p className="font-mono text-sm font-semibold mb-1">{color.name}</p>
                    <p className="font-mono text-xs text-neutral-600 mb-2">{color.value}</p>
                    <p className="text-xs text-neutral-500">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text Colors */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-neutral-700">Text</h3>
            <div className="grid grid-cols-4 gap-4">
              {colors.text.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div
                    className="h-24 rounded-lg border-2 border-neutral-300 flex items-center justify-center"
                    style={{ backgroundColor: color.value.includes("#0a") ? "#171717" : "#ffffff" }}
                  >
                    <span
                      className="font-mono text-sm"
                      style={{ color: color.value }}
                    >
                      Aa
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold mb-1">{color.name}</p>
                    <p className="font-mono text-xs text-neutral-600 mb-2">{color.value}</p>
                    <p className="text-xs text-neutral-500">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Colors */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-neutral-700">Severity (Critical System)</h3>
            <div className="grid grid-cols-5 gap-4">
              {colors.severity.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div
                    className="h-32 rounded-lg border-2 flex items-center justify-center"
                    style={{ 
                      backgroundColor: color.hex,
                      borderColor: color.hex
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="white"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold mb-1">{color.name}</p>
                    <p className="font-mono text-xs text-neutral-600 mb-2">{color.value}</p>
                    <p className="text-xs text-neutral-500 leading-tight">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accent */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-neutral-700">Accent / Actions</h3>
            <div className="grid grid-cols-4 gap-4">
              {colors.accent.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div
                    className="h-24 rounded-lg border-2 border-neutral-900 flex items-center justify-center font-semibold"
                    style={{ backgroundColor: color.value, color: color.value === "#fafafa" ? "#0a0a0a" : "#fafafa" }}
                  >
                    Button
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold mb-1">{color.name}</p>
                    <p className="font-mono text-xs text-neutral-600 mb-2">{color.value}</p>
                    <p className="text-xs text-neutral-500">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 pb-4 border-b-2 border-neutral-900">Typography</h2>

          <div className="space-y-12">
            {/* Display */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-neutral-700">Display</h3>
              <div className="space-y-6">
                {typography.display.map((type) => (
                  <div key={type.name} className="border-b border-neutral-200 pb-6">
                    <div className="mb-3">
                      <span className="font-mono text-xs text-neutral-500">
                        {type.size} · {type.weight} · {type.usage}
                      </span>
                    </div>
                    <p style={{ fontSize: type.size, fontWeight: type.weight as any, lineHeight: 1.1 }}>
                      {type.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-neutral-700">Body</h3>
              <div className="space-y-6">
                {typography.body.map((type) => (
                  <div key={type.name} className="border-b border-neutral-200 pb-6">
                    <div className="mb-3">
                      <span className="font-mono text-xs text-neutral-500">
                        {type.size} · {type.weight} · {type.usage}
                      </span>
                    </div>
                    <p style={{ fontSize: type.size, fontWeight: type.weight as any }}>
                      The quick brown fox jumps over the lazy dog. This is {type.name}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mono */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-neutral-700">Monospace / Code</h3>
              <div className="space-y-6">
                {typography.mono.map((type) => (
                  <div key={type.name} className="border-b border-neutral-200 pb-6">
                    <div className="mb-3">
                      <span className="font-mono text-xs text-neutral-500">
                        {type.size} · {type.weight} · {type.font} · {type.usage}
                      </span>
                    </div>
                    <p style={{ fontSize: type.size, fontWeight: type.weight as any, fontFamily: "monospace" }}>
                      const example = "Code text in {type.name}";
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Scale */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 pb-4 border-b-2 border-neutral-900">Spacing Scale</h2>
          <div className="space-y-4">
            {spacing.map((space) => (
              <div key={space.name} className="flex items-center gap-6">
                <div className="w-24 font-mono text-sm font-semibold">{space.name}</div>
                <div className="w-20 font-mono text-sm text-neutral-600">{space.value}</div>
                <div className="bg-neutral-900 rounded" style={{ width: space.value, height: "24px" }} />
                <div className="text-sm text-neutral-500">{space.usage}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Card Styles */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 pb-4 border-b-2 border-neutral-900">Card Styles</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Light Card */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-neutral-700">Light Surface</h3>
              <div className="bg-white border-2 border-neutral-200 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-2">Card Title</h4>
                <p className="text-neutral-600 text-sm mb-4">
                  Standard card for light backgrounds. Clean borders, minimal elevation.
                </p>
                <div className="font-mono text-xs text-neutral-500">
                  bg-white · border-neutral-200 · rounded-lg · p-6
                </div>
              </div>
            </div>

            {/* Dark Card */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-neutral-700">Dark Surface</h3>
              <div className="bg-neutral-900 border-2 border-neutral-800 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-2 text-neutral-50">Card Title</h4>
                <p className="text-neutral-400 text-sm mb-4">
                  Standard card for dark backgrounds. Subtle contrast, professional.
                </p>
                <div className="font-mono text-xs text-neutral-500">
                  bg-neutral-900 · border-neutral-800 · rounded-lg · p-6
                </div>
              </div>
            </div>

            {/* Critical Card */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-neutral-700">Critical / Error State</h3>
              <div className="bg-neutral-900 border-2 border-red-900 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-2 text-red-400">Critical Issue</h4>
                <p className="text-neutral-300 text-sm mb-4">
                  Used for severe code issues, bugs, security problems. Red accent border.
                </p>
                <div className="font-mono text-xs text-neutral-500">
                  bg-neutral-900 · border-red-900 · rounded-lg · p-6
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-neutral-700">Warning State</h3>
              <div className="bg-white border-2 border-amber-400 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-2 text-amber-900">Design Warning</h4>
                <p className="text-neutral-700 text-sm mb-4">
                  Used for design flaws, pattern violations. Amber accent border.
                </p>
                <div className="font-mono text-xs text-neutral-500">
                  bg-white · border-amber-400 · rounded-lg · p-6
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Design Principles */}
        <section className="pt-12 border-t-2 border-neutral-900">
          <h2 className="text-3xl font-bold mb-8">Design Principles</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Brutalism over Beauty</h3>
              <p className="text-sm text-neutral-600">
                Function first. No gradients, no shadows, no friendly shapes. Clarity is the only decoration.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Severity as Signal</h3>
              <p className="text-sm text-neutral-600">
                Color is not aesthetic—it's information. Red means critical. Amber means flawed. Blue means slow.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Monospace is Truth</h3>
              <p className="text-sm text-neutral-600">
                Code deserves monospace. Labels deserve monospace. This is a technical product for technical people.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

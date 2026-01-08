# CodeMentor AI Platform

> **Brutal, senior-level code reviews. No sugar-coating. No tutorials. Just honest technical judgment.**

CodeMentor AI is a hard code review platform that thinks like a senior team lead or technical interviewer—not like a friendly learning platform. Get the code review you'd get in a real interview, with direct feedback focused on career risks and professional judgment.

## 🎯 Product Vision

This is **not** a learning platform. This is **career insurance**. 

If your code can't handle a harsh review here, it won't survive:
- A real interview
- A production incident  
- A senior engineer's PR review

**We don't teach. We expose.**

---

## ✨ Features

### 🔴 Hard Code Review
- **Brutal, honest feedback** - No participation trophies
- **Senior-level analysis** - Security, performance, design, bugs
- **Real-world severity scoring** - Critical, high, medium, low
- **Side-by-side comparisons** - Your code vs. suggested fixes
- **Actionable next steps** - Prioritized by impact

### 📦 Components
- **10+ production-ready components**
- **Full responsive design**
- **Drag-and-drop file upload**
- **Sample code snippets** (good/bad examples)
- **Mock AI analysis engine**
- **Zero TypeScript errors**

### 🎨 Design System
- **Brutalist design philosophy** - Function over beauty
- **Severity-based color system** - Red = critical, not decoration
- **Monospace typography** - Technical products for technical people
- **Dark + light themes** - Professional, minimal contrast

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/NickScherbakov/codementor-ai-platform.git
cd codementor-ai-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
codementor-ai-platform/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main app with page navigation
│   │   ├── components/
│   │   │   ├── hard-code-review/         # Core review components
│   │   │   │   ├── HardCodeReviewApp.tsx    # Main app flow
│   │   │   │   ├── CodeInputPage.tsx        # Code submission UI
│   │   │   │   ├── ResultsPage.tsx          # Review results display
│   │   │   │   ├── HCRButton.tsx            # Custom button component
│   │   │   │   ├── SeverityBadge.tsx        # Severity indicators
│   │   │   │   ├── FindingCard.tsx          # Issue display cards
│   │   │   │   ├── CodeComparison.tsx       # Before/after code view
│   │   │   │   ├── NextStepsSection.tsx     # Action items
│   │   │   │   ├── mockData.ts              # AI analysis engine (mock)
│   │   │   │   ├── sampleSnippets.ts        # Code examples
│   │   │   │   └── ComponentShowcase.tsx    # Demo page
│   │   │   ├── MoneyPage.tsx             # Marketing landing page
│   │   │   ├── ToneReference.tsx         # Voice & tone guide
│   │   │   ├── DesignTokens.tsx          # Design system docs
│   │   │   └── ui/                       # Reusable UI components
│   │   │       ├── button.tsx
│   │   │       └── utils.ts
│   └── styles/
│       ├── index.css                 # Main stylesheet
│       ├── tailwind.css              # Tailwind v4 config
│       ├── theme.css                 # Design tokens
│       └── fonts.css                 # Font imports
├── package.json
├── vite.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 🎨 Design Philosophy

### Brutalism over Beauty
Function first. No gradients, no shadows, no friendly shapes. **Clarity is the only decoration.**

### Severity as Signal
Color is not aesthetic—it's information:
- **🔴 Red** = Critical bugs, security issues
- **🟠 Orange** = Design flaws, bad patterns  
- **🟡 Yellow** = Performance issues
- **🔵 Blue** = Style suggestions

### Monospace is Truth
Code deserves monospace. Labels deserve monospace. This is a **technical product for technical people.**

---

## 🔊 Voice & Tone

### Target Tone: "Hard / Senior Team Lead"

Brutally honest, zero patience, assumes competence. Examples:

**❌ Bad (ChatGPT-like):**
> "Consider adding a null check for the user object. This would help prevent potential runtime errors."

**✅ Good (CodeMentor AI):**
> "**No null check.** This crashes in production the moment find() returns undefined. Did you actually run this code, or just hope it works?"

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **Class Variance Authority** - Component variants

---

## 📊 Sample Code Analysis

The platform includes 6 sample code snippets:

1. **Bad JavaScript** - Multiple critical issues (null checks, type coercion)
2. **Mediocre TypeScript** - Design and performance issues (O(n²) complexity)
3. **Bad Python** - Poor error handling, missing validations
4. **Good Code** - Well-written with proper error handling
5. **Security Issues** - Critical vulnerabilities (SQL injection)
6. **Performance Issues** - Severe performance problems (nested loops)

---

## 📄 Pages

### 1. App (Main)
Full code review flow:
- Code input with drag-and-drop
- AI analysis (mock)
- Results with severity scoring
- Before/after comparisons
- Actionable next steps

### 2. Components Showcase
Demonstration of all 10+ reusable components in isolation

### 3. Money Page
Marketing landing page with value proposition

### 4. Tone Reference
Internal calibration guide showing 3 review tones (polite, neutral, hard)

### 5. Design Tokens
Complete design system documentation:
- Color palette (surface, text, severity, accent)
- Typography scale (display, body, monospace)
- Spacing system
- Card styles
- Design principles

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code quality standards:**
- Zero TypeScript errors
- Follow existing design patterns
- Maintain brutal, honest tone in feedback messages
- Test with sample snippets

---

## 📧 Contact

- **GitHub**: [@NickScherbakov](https://github.com/NickScherbakov)
- **Repository**: [codementor-ai-platform](https://github.com/NickScherbakov/codementor-ai-platform)

---

## ✨ Built with Figma Make

This project was created using **Figma Make** - a web application builder powered by AI.

---

**Remember:** This is not a learning platform. This is career insurance. We don't teach. We expose.

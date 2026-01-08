import { ReviewResult } from "./ResultsPage";

// Mock AI analysis function
export function analyzeCode(code: string, _language: string): Promise<ReviewResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock results based on code content
      const hasNullCheck = code.includes('null') || code.includes('undefined');
      const hasStrictEquality = code.includes('===');
      const hasAsyncAwait = code.includes('async') || code.includes('await');
      const hasComments = code.includes('//') || code.includes('/*');

      const findings: ReviewResult['findings'] = [];

      // Generate findings based on code analysis
      if (!hasNullCheck && code.length > 50) {
        findings.push({
          type: "bug",
          title: "Missing null/undefined checks",
          explain: "Your code doesn't handle cases where values might be null or undefined. In production, this will crash the moment an unexpected null appears. Real systems fail—gracefully handling edge cases isn't optional.",
          fix: "Add explicit null checks before accessing properties. Use optional chaining (?.) or nullish coalescing (??) operators. Better yet, use TypeScript and leverage its type system.",
          example_patch: `// Before\nconst value = obj.property.nested;\n\n// After\nconst value = obj?.property?.nested ?? defaultValue;\n\n// Or with explicit check\nif (obj && obj.property) {\n  const value = obj.property.nested;\n}`
        });
      }

      if (!hasStrictEquality && code.includes('==')) {
        findings.push({
          type: "style",
          title: "Using loose equality (==) instead of strict (===)",
          explain: "Loose equality causes type coercion, leading to bugs that are hard to track. This isn't 2005 JavaScript. Type coercion is a minefield, not a feature. What year is this?",
          fix: "Replace all == with ===, and != with !==. Enable ESLint rule 'eqeqeq' to catch these automatically. If you need type coercion, make it explicit with proper type conversion.",
          example_patch: `// Before\nif (userId == '123') { }\n\n// After\nif (userId === '123') { }\n\n// Or if type matters\nif (Number(userId) === 123) { }`
        });
      }

      if (code.includes('var ')) {
        findings.push({
          type: "style",
          title: "Using 'var' in modern JavaScript",
          explain: "'var' has function scope and hoisting behavior that causes bugs. It's been deprecated in favor of 'let' and 'const' since ES6. Using 'var' in 2025 signals you haven't updated your knowledge in a decade.",
          fix: "Use 'const' by default for values that don't change. Use 'let' only when reassignment is necessary. Never use 'var'. Configure your linter to ban it.",
          example_patch: `// Before\nvar count = 0;\nvar user = getUser();\n\n// After\nlet count = 0;  // needs reassignment\nconst user = getUser();  // immutable reference`
        });
      }

      if (!hasAsyncAwait && code.includes('.then(')) {
        findings.push({
          type: "design",
          title: "Promise chains instead of async/await",
          explain: "Nested .then() chains are harder to read and debug than async/await. Modern JavaScript has better syntax for asynchronous code. Your colleagues will thank you for readable code.",
          fix: "Refactor Promise chains to use async/await. Wrap your function with 'async' and use 'await' for promises. Handle errors with try/catch blocks.",
          example_patch: `// Before\nfunction getData() {\n  return fetch(url)\n    .then(res => res.json())\n    .then(data => process(data));\n}\n\n// After\nasync function getData() {\n  const res = await fetch(url);\n  const data = await res.json();\n  return process(data);\n}`
        });
      }

      if (code.includes('for (') && code.includes('.length')) {
        findings.push({
          type: "performance",
          title: "Inefficient loop with repeated length access",
          explain: "Accessing .length inside a loop condition recalculates on every iteration. This is a micro-optimization, but it signals sloppy habits. Cache the length or use modern iteration methods.",
          fix: "Cache the length in a variable, or better yet, use array methods like .forEach(), .map(), .filter() which are more declarative and harder to mess up.",
          example_patch: `// Before\nfor (let i = 0; i < array.length; i++) {\n  process(array[i]);\n}\n\n// Better\nconst len = array.length;\nfor (let i = 0; i < len; i++) {\n  process(array[i]);\n}\n\n// Best\narray.forEach(item => process(item));`
        });
      }

      if (!hasComments && code.length > 100) {
        findings.push({
          type: "design",
          title: "No documentation or comments",
          explain: "Code without comments or documentation is technical debt waiting to happen. In 6 months, even you won't remember why you wrote this. Comments aren't optional—they're professional courtesy.",
          fix: "Add JSDoc comments for functions explaining parameters, return values, and purpose. Document complex logic. Explain the 'why', not the 'what'.",
          example_patch: `/**\n * Processes user payment and updates account balance\n * @param {string} userId - User identifier\n * @param {number} amount - Payment amount in cents\n * @returns {Promise<boolean>} Success status\n * @throws {PaymentError} If payment fails\n */\nasync function processPayment(userId, amount) {\n  // Validate amount before processing\n  if (amount <= 0) throw new Error('Invalid amount');\n  // ... rest of function\n}`
        });
      }

      // Determine severity
      const criticalCount = findings.filter(f => f.type === 'bug' || f.type === 'security').length;
      const severity: ReviewResult['severity'] = 
        criticalCount >= 2 ? 'hard' : 
        findings.length >= 3 ? 'medium' : 
        'good';

      // Generate summary
      const summaries = {
        hard: `This code has ${criticalCount} critical issues that will cause production failures. These aren't style preferences—they're bugs waiting to happen. This doesn't ship until these are fixed. Take this seriously.`,
        medium: `This code has ${findings.length} issues that need attention. Not all are critical, but they indicate loose practices that compound over time. Clean this up before you move on. Technical debt starts here.`,
        good: findings.length === 0 
          ? `Clean code. No major issues found. The structure is solid, patterns are sound. This is production-ready. Keep this standard.`
          : `Mostly solid with ${findings.length} minor issue${findings.length === 1 ? '' : 's'}. Not blockers, but worth addressing. You're on the right track.`
      };

      // Generate next steps
      const nextSteps: string[] = [];
      if (findings.some(f => f.type === 'bug' || f.type === 'security')) {
        nextSteps.push('Fix all critical bugs and security issues immediately—these are production blockers');
      }
      if (findings.some(f => f.type === 'performance')) {
        nextSteps.push('Profile performance issues with real data to verify impact');
      }
      if (findings.some(f => f.type === 'design')) {
        nextSteps.push('Refactor design issues to improve maintainability and code clarity');
      }
      if (findings.length > 0) {
        nextSteps.push('Run ESLint and Prettier to catch similar issues automatically');
        nextSteps.push('Add unit tests to cover edge cases identified in this review');
      }
      if (nextSteps.length === 0) {
        nextSteps.push('Consider adding more comprehensive error handling');
        nextSteps.push('Document complex logic for future maintainers');
        nextSteps.push('Review performance under load with production-like data');
      }

      // Generate code comparison if we have findings
      let comparison = undefined;
      if (findings.length > 0 && code.length < 500) {
        comparison = {
          yourCode: code,
          suggestedFix: improveCode(code)
        };
      }

      resolve({
        severity,
        summary: summaries[severity],
        findings,
        next_steps: nextSteps,
        comparison
      });
    }, 2000); // Simulate processing time
  });
}

function improveCode(code: string): string {
  let improved = code;

  // Apply some basic improvements
  improved = improved.replace(/var /g, 'const ');
  improved = improved.replace(/ == /g, ' === ');
  improved = improved.replace(/ != /g, ' !== ');

  // Add null checks if missing
  if (!improved.includes('?') && improved.includes('.')) {
    improved = '// Added null safety\n' + improved;
  }

  // Add async/await example
  if (improved.includes('.then(')) {
    improved = '// Consider refactoring to async/await\n' + improved;
  }

  return improved;
}

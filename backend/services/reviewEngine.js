const DEFAULT_NEXT_STEPS = [
  'Add tests that cover edge cases and failure paths.',
  'Document any assumptions and constraints in code comments.',
  'Refactor the most complex function into smaller units.'
]

const LANGUAGE_LABELS = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript'
}

const FINDING_TYPES = ['bug', 'security', 'performance', 'design', 'style']

function addFinding(findings, finding) {
  if (!FINDING_TYPES.includes(finding.type)) {
    return
  }
  findings.push(finding)
}

function summarize(language, findings) {
  const label = LANGUAGE_LABELS[language] || language
  return `Hard review: ${findings.length} high-signal issues found in ${label} code.`
}

function buildNextSteps(findings) {
  const steps = new Set(DEFAULT_NEXT_STEPS)

  if (findings.some((finding) => finding.type === 'security')) {
    steps.add('Add input validation and sanitize untrusted data before execution.')
  }

  if (findings.some((finding) => finding.type === 'performance')) {
    steps.add('Profile hot paths and set explicit performance targets.')
  }

  if (findings.some((finding) => finding.type === 'design')) {
    steps.add('Clarify responsibilities between modules and enforce boundaries.')
  }

  return Array.from(steps)
}

function generateHardReview({ language, code }) {
  const findings = []
  const trimmedCode = (code || '').trim()

  if (/\b(eval|exec|Function)\s*\(/.test(trimmedCode)) {
    addFinding(findings, {
      type: 'security',
      title: 'Dynamic code execution introduces critical risk',
      explain:
        'Using eval/exec allows untrusted input to run arbitrary code, which is a common exploit vector.',
      fix: 'Remove dynamic execution and replace with explicit, validated logic paths.'
    })
  }

  if (/\b(TODO|FIXME)\b/.test(trimmedCode)) {
    addFinding(findings, {
      type: 'design',
      title: 'Deferred work left in the critical path',
      explain:
        'TODO/FIXME markers indicate incomplete logic that will ship to production without guardrails.',
      fix: 'Resolve the TODOs or feature-flag the incomplete path so it cannot execute unintentionally.'
    })
  }

  if (/\b(console\.log|print)\s*\(/.test(trimmedCode)) {
    addFinding(findings, {
      type: 'style',
      title: 'Debug logging left in runtime path',
      explain:
        'Console output in hot paths increases noise and can leak sensitive data in production logs.',
      fix: 'Remove debug statements or replace with structured logging at a controlled level.',
      example_patch: '// Remove console.log/print statements or replace with logger.debug(...)\n'
    })
  }

  const loopMatches = trimmedCode.match(/\b(for|while)\b/g) || []
  if (loopMatches.length >= 2) {
    addFinding(findings, {
      type: 'performance',
      title: 'Nested looping may cause quadratic behavior',
      explain:
        'Multiple loops over unbounded input can degrade performance quickly under load.',
      fix: 'Precompute lookups, use hash maps, or short-circuit early to reduce complexity.'
    })
  }

  const hasErrorHandling = /\b(try\s*\{|try:|catch\s*\()/m.test(trimmedCode)
  if (!hasErrorHandling) {
    addFinding(findings, {
      type: 'bug',
      title: 'No explicit error handling for failure paths',
      explain:
        'Unhandled errors will crash the request or return inconsistent data to callers.',
      fix: 'Add structured error handling and surface actionable error messages to the caller.'
    })
  }

  if (findings.length === 0) {
    addFinding(findings, {
      type: 'design',
      title: 'Missing validation for incoming inputs',
      explain:
        'The code accepts inputs without validation, which makes edge cases and abuse likely.',
      fix: 'Validate expected fields and reject malformed input early.'
    })
  }

  return {
    summary: summarize(language, findings),
    severity: 'hard',
    findings,
    next_steps: buildNextSteps(findings)
  }
}

module.exports = {
  generateHardReview
}

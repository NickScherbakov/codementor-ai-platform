'use client'

import { useMemo, useState } from 'react'

type ReviewFinding = {
  type: 'bug' | 'security' | 'performance' | 'design' | 'style'
  title: string
  explain: string
  fix: string
  example_patch?: string
}

type ReviewResponse = {
  summary: string
  severity: 'hard'
  findings: ReviewFinding[]
  next_steps: string[]
}

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' }
]

const DEFAULT_CODE = `def process_orders(orders):
    for order in orders:
        print(order)
        for line_item in order["items"]:
            total = line_item["price"] * line_item["qty"]
            print(total)
`

export default function ReviewPage() {
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(DEFAULT_CODE)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ReviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? '/api/backend'

  const findingsByType = useMemo(() => {
    if (!result) return []
    return result.findings
  }, [result])

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${apiBase}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'mvp-user'
        },
        body: JSON.stringify({
          language,
          code,
          mode: 'hard'
        })
      })

      if (response.status === 402) {
        const payload = await response.json()
        setError(payload.message || 'Free review limit reached. Subscribe to continue.')
        return
      }

      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload.message || 'Failed to run review.')
      }

      const payload = (await response.json()) as ReviewResponse
      setResult(payload)
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unexpected error.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Hard Code Review MVP
          </p>
          <h1 className="text-4xl font-semibold text-white">Ship-grade feedback in minutes</h1>
          <p className="max-w-2xl text-base text-slate-300">
            Paste code, choose a language, and get a tough-love review with concrete fixes and next steps.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Code Input</h2>
                <p className="text-sm text-slate-400">Monospace editor with hard review mode locked.</p>
              </div>
              <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                Mode: Hard
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-300" htmlFor="language">
                Language
              </label>
              <select
                id="language"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-300" htmlFor="code">
                Code
              </label>
              <textarea
                id="code"
                className="min-h-[320px] w-full rounded-lg border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-200 shadow-inner"
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
            >
              {isLoading ? 'Reviewing…' : 'Review (Hard)'}
            </button>

            {error ? (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div>
              <h3 className="text-lg font-semibold text-white">What you get</h3>
              <p className="mt-2 text-sm text-slate-400">
                A strict review that mimics a staff-level PR review: short summary, specific findings, and
                tactical next steps.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-emerald-400">✓</span> Findings labeled by severity type
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✓</span> Clear fixes and patches where applicable
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400">✓</span> Next steps to unblock engineering follow-up
              </li>
            </ul>
          </aside>
        </section>

        {result ? (
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xl font-semibold text-white">Summary</h2>
              <p className="mt-2 text-sm text-slate-300">{result.summary}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {findingsByType.map((finding, index) => (
                <div
                  key={`${finding.title}-${index}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{finding.title}</h3>
                    <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                      {finding.type}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{finding.explain}</p>
                  <p className="mt-3 text-sm text-emerald-200">Fix: {finding.fix}</p>
                  {finding.example_patch ? (
                    <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
                      {finding.example_patch}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-xl font-semibold text-white">Suggested Fixes / Next Steps</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {result.next_steps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="text-emerald-400">→</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

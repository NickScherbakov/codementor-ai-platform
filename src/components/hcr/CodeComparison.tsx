import React from 'react'

export type CodeComparisonProps = {
  before: string
  after: string
  beforeTitle?: string
  afterTitle?: string
  beforeDescription?: string
  afterDescription?: string
}

export function CodeComparison({
  before,
  after,
  beforeTitle = 'Your Code',
  afterTitle = 'Suggested Fix',
  beforeDescription,
  afterDescription
}: CodeComparisonProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      {(beforeDescription || afterDescription) && (
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          {beforeDescription && (
            <p className="text-sm text-slate-400">{beforeDescription}</p>
          )}
          {afterDescription && (
            <p className="text-sm text-slate-400">{afterDescription}</p>
          )}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{beforeTitle}</p>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-300 border border-slate-800">
            {before}
          </pre>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-400">{afterTitle}</p>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-emerald-300 border border-emerald-500/40">
            {after}
          </pre>
        </div>
      </div>
    </div>
  )
}

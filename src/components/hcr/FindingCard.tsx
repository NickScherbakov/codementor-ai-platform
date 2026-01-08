import React from 'react'
import { SeverityBadge } from './SeverityBadge'
import type { Finding, SeverityLevel } from './types'

export type FindingCardProps = {
  severity: SeverityLevel
  title: string
  description: string
  category?: string
  lineNumbers?: string
  impact?: string
  effort?: string
  codeSnippet?: string
}

export function FindingCard({
  severity,
  title,
  description,
  category,
  lineNumbers,
  impact,
  effort,
  codeSnippet
}: FindingCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex-1 text-lg font-semibold text-white">{title}</h3>
        <SeverityBadge severity={severity} />
      </div>

      {category ? (
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">{category}</p>
      ) : null}

      <p className="mt-3 text-sm text-slate-300">{description}</p>

      {lineNumbers ? (
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-medium">Lines:</span> {lineNumbers}
        </p>
      ) : null}

      {impact ? (
        <div className="mt-3 rounded bg-slate-950/50 px-2 py-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Impact:</span> {impact}
        </div>
      ) : null}

      {effort ? (
        <div className="mt-2 rounded bg-slate-950/50 px-2 py-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Effort:</span> {effort}
        </div>
      ) : null}

      {codeSnippet ? (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
          {codeSnippet}
        </pre>
      ) : null}
    </div>
  )
}

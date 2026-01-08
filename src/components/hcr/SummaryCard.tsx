import React from 'react'
import { SeverityBadge } from './SeverityBadge'
import type { SeverityLevel } from './types'

export type SummaryCardProps = {
  label: string
  value: string
  severity: SeverityLevel
  description?: string
}

export function SummaryCard({ label, value, severity, description }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-300">{label}</span>
        <SeverityBadge severity={severity} />
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      {description ? <p className="text-sm text-slate-400">{description}</p> : null}
    </div>
  )
}

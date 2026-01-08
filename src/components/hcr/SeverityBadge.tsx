import React from 'react'
import type { SeverityLevel } from './types'

const severityStyles: Record<SeverityLevel, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-rose-500/10 text-rose-200 border border-rose-500/40' },
  high: { label: 'High', className: 'bg-orange-500/10 text-orange-200 border border-orange-500/40' },
  medium: { label: 'Medium', className: 'bg-amber-500/10 text-amber-200 border border-amber-500/40' },
  low: { label: 'Low', className: 'bg-blue-500/10 text-blue-200 border border-blue-500/40' },
  info: { label: 'Info', className: 'bg-slate-500/10 text-slate-200 border border-slate-600/60' }
}

export type SeverityBadgeProps = {
  severity: SeverityLevel
  className?: string
}

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const style = severityStyles[severity]
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.className} ${className}`.trim()}
    >
      {style.label}
    </span>
  )
}

import React from 'react'
import type { NextStep } from './types'

export type NextStepsSectionProps = {
  steps: NextStep[]
}

const priorityMap: Record<'high' | 'medium' | 'low', { label: string; color: string }> = {
  high: { label: 'High Priority', color: 'text-rose-400' },
  medium: { label: 'Medium Priority', color: 'text-amber-400' },
  low: { label: 'Low Priority', color: 'text-blue-400' }
}

export function NextStepsSection({ steps }: NextStepsSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-xl font-semibold text-white">Next Steps</h2>
      <div className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const priority = priorityMap[step.priority]
          return (
            <div key={`step-${index}`} className="flex gap-3 rounded-lg bg-slate-950/40 p-3">
              <div className="flex flex-none items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-slate-200 w-6 h-6">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                  <span className={`text-xs font-medium ${priority.color}`}>{priority.label}</span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{step.description}</p>
                <p className="mt-1 text-xs text-slate-500">Est. {step.estimatedTime}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

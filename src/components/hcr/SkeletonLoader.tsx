import React from 'react'

export type SkeletonLoaderProps = {
  count?: number
  className?: string
}

export function SkeletonLoader({ count = 1, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="h-20 animate-pulse rounded-lg bg-gradient-to-r from-slate-800 to-slate-700"
        />
      ))}
    </div>
  )
}

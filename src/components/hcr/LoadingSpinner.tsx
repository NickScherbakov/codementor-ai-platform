import React from 'react'

const sizeMap: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-3'
}

export type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-transparent border-t-current ${sizeMap[size]} ${className}`.trim()}
      aria-label="Loading"
    />
  )
}

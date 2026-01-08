import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'

type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export type HCRButtonProps = {
  children: React.ReactNode
  loading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 border border-emerald-400/60',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-600',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-800 border border-slate-700',
  danger: 'bg-rose-500 text-slate-50 hover:bg-rose-400 border border-rose-400/70'
}

export function HCRButton({
  children,
  loading = false,
  size = 'md',
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  onClick
}: HCRButtonProps) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/50 disabled:cursor-not-allowed disabled:opacity-70 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
    >
      {loading ? <LoadingSpinner size="sm" className="border-current" /> : null}
      <span>{loading ? 'Loading…' : children}</span>
    </button>
  )
}

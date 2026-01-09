'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen">
      {/* Review Section Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0F172A] border-b border-[#374151] z-50 shadow-lg">
        <div className="flex items-center justify-center gap-1 p-2 flex-wrap">
          <Link
            href="/review"
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              isActive('/review')
                ? 'bg-[#EF4444] text-white'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#374151]'
            }`}
          >
            Hard Code Review
          </Link>
          <Link
            href="/review/showcase"
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              isActive('/review/showcase')
                ? 'bg-[#EF4444] text-white'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#374151]'
            }`}
          >
            Components
          </Link>
          <Link
            href="/review/money"
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              isActive('/review/money')
                ? 'bg-[#EF4444] text-white'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#374151]'
            }`}
          >
            Money Page
          </Link>
          <Link
            href="/review/tone"
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              isActive('/review/tone')
                ? 'bg-[#EF4444] text-white'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#374151]'
            }`}
          >
            Tone Reference
          </Link>
          <Link
            href="/review/tokens"
            className={`px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider transition-all ${
              isActive('/review/tokens')
                ? 'bg-[#EF4444] text-white'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#374151]'
            }`}
          >
            Design Tokens
          </Link>
          <Link
            href="/"
            className="px-4 lg:px-6 py-3 font-mono text-xs uppercase tracking-wider text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-all ml-4 border-l border-[#374151]"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  )
}

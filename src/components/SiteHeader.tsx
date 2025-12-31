import Link from 'next/link'
import { Brain, PlayCircle, Info, Github } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/playground', label: 'Playground' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/demo', label: 'Demo' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
            <Brain className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-blue-700">
              CodeMentor AI
            </Link>
            <span className="text-xs text-gray-500">Adaptive coding mentor</span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 sm:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-blue-700">
              {item.label}
            </Link>
          ))}
          <Link href="/demo/limitations" className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-slate-200">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Status
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#challenge"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Try live challenge
          </Link>
          <Link
            href="https://github.com/NickScherbakov/codementor-ai-platform"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-gray-300 sm:inline-flex"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Code
          </Link>
        </div>
      </div>
    </header>
  )
}

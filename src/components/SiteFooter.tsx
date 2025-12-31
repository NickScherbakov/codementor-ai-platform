import Link from 'next/link'
import { Mail, Github, BookOpen } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-gray-900">CodeMentor AI</p>
          <p className="text-sm text-gray-500">Personalized coding guidance with live AI + backend stack.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
          <Link href="/demo/limitations" className="hover:text-blue-700">
            Limitations
          </Link>
          <Link href="/docs" className="hover:text-blue-700">
            Docs
          </Link>
          <a href="mailto:hello@codementor.ai" className="inline-flex items-center gap-2 hover:text-blue-700">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact
          </a>
          <Link
            href="https://github.com/NickScherbakov/codementor-ai-platform"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-blue-700"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </Link>
          <Link href="/demo" className="inline-flex items-center gap-2 hover:text-blue-700">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Demo tour
          </Link>
        </div>
      </div>
    </footer>
  )
}

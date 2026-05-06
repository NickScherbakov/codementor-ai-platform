import Header from '@/components/Header'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodeMentor AI - Intelligent Programming Learning Platform',
  description: 'Master programming with AI-powered personalized tutoring, adaptive learning paths, and real-time code mentoring.',
  keywords: ['programming', 'learning', 'AI', 'coding', 'education', 'mentoring', 'typescript', 'javascript', 'python'],
  authors: [{ name: 'CodeMentor AI Team' }],
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-900 antialiased">
        <Header />
        {/* Status banner */}
          <div className="w-full border-b border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p>Free public alpha: playground, review, signup, login, and dashboard use live APIs when this environment is configured.</p>
              <div className="flex gap-3">
                <a
                  className="underline hover:no-underline"
                  href="/demo/limitations/"
                >
                  What is live
                </a>
                <a
                  className="underline hover:no-underline"
                  href="https://github.com/NickScherbakov/codementor-ai-platform"
                  target="_blank" rel="noreferrer"
                >
                  Source
                </a>
              </div>
            </div>
          </div>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
      </body>
    </html>
  )
}

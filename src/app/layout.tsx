import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeMentor AI - Intelligent Programming Learning Platform',
  description: 'Master programming with AI-powered personalized tutoring, adaptive learning paths, and real-time code mentoring.',
  keywords: ['programming', 'learning', 'AI', 'coding', 'education', 'mentoring', 'typescript', 'javascript', 'python'],
  authors: [{ name: 'CodeMentor AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Status banner */}
          <div className="w-full border-b border-green-200 bg-green-50 px-4 py-2 text-sm text-green-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p>✅ Full stack online: Backend + AI engine + MongoDB connected (~50 user capacity).</p>
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
          <SiteHeader />
          {children}
          <SiteFooter />
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
        </Providers>
      </body>
    </html>
  )
}
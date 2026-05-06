'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { apiRequest, setAuthToken } from '@/lib/backend'

type LoginResponse = {
  success: boolean
  token: string
  user: {
    firstName: string
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      setAuthToken(response.token)
      router.push('/dashboard')
      router.refresh()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Welcome back</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Sign in to your dashboard</h1>
          <p className="mt-4 text-base text-slate-600">
            Resume saved progress, open your dashboard, and keep your free usage inside the same account.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="you@example.com"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Password</span>
              <input
                required
                minLength={6}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Your password"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Need an account?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-500" href="/signup">
              Create one for free
            </Link>
          </p>
        </section>

        <aside className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Before you log in</p>
          <h2 className="mt-4 text-2xl font-bold">The core product stays open</h2>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            Hard review and the playground remain accessible without registration. Sign-in exists to persist history,
            progress, and your account state across sessions.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-300">
            If the backend is not configured in this environment, the page will return a clear API error instead of a fake
            success flow.
          </div>
        </aside>
      </div>
    </main>
  )
}

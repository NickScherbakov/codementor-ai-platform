'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { apiRequest, setAuthToken } from '@/lib/backend'

type RegisterResponse = {
  success: boolean
  token: string
  user: {
    firstName: string
  }
}

const initialForm = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passwordMismatch = useMemo(() => {
    return form.confirmPassword.length > 0 && form.password !== form.confirmPassword
  }, [form.confirmPassword, form.password])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (passwordMismatch) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await apiRequest<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      })

      setAuthToken(response.token)
      setSuccess(`Welcome, ${response.user.firstName}. Your free account is ready.`)
      router.push('/dashboard')
      router.refresh()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Free public access</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            Sign up to save progress, keep your review history, and return to your dashboard. Core playground and review
            flows stay free for everyone.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>First name</span>
                <input
                  required
                  value={form.firstName}
                  onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Ada"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Last name</span>
                <input
                  required
                  value={form.lastName}
                  onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Lovelace"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Username</span>
                <input
                  required
                  minLength={3}
                  maxLength={20}
                  value={form.username}
                  onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="adalovelace"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Password</span>
                <input
                  required
                  minLength={6}
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="At least 6 characters"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Confirm password</span>
                <input
                  required
                  minLength={6}
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Repeat your password"
                />
              </label>
            </div>

            {passwordMismatch && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Passwords must match before you can continue.
              </p>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            {success && (
              <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || passwordMismatch}
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already registered?{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-500" href="/login">
              Sign in
            </Link>
          </p>
        </section>

        <aside className="space-y-6 rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">What you unlock</p>
            <h2 className="mt-4 text-2xl font-bold">Account-backed learning without a paywall</h2>
          </div>
          <ul className="space-y-4 text-sm text-slate-200">
            <li>• Saved profile, preferences, and return sessions</li>
            <li>• Progress snapshots from the live backend</li>
            <li>• Free access to review and mentorship entry points</li>
            <li>• Operational guardrails instead of subscription blockers</li>
          </ul>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5 text-sm text-slate-300">
            Anonymous visitors can still try the playground and hard review. Registration is only for persistence and
            follow-up sessions.
          </div>
        </aside>
      </div>
    </main>
  )
}

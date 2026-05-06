'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { apiRequest, clearAuthToken, getAuthToken } from '@/lib/backend'

type AuthUser = {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  preferences?: {
    learningStyle?: string
    difficulty?: string
    preferredProgrammingLanguages?: string[]
  }
  progress?: {
    totalXP?: number
    level?: number
    currentStreak?: number
    longestStreak?: number
    completedChallenges?: number
    completedProjects?: number
  }
}

type ProgressResponse = {
  success: boolean
  data: {
    totalXP: number
    level: number
    rank: string
    streak: {
      current: number
      longest: number
    }
    statistics: {
      totalChallengesAttempted: number
      totalChallengesCompleted: number
      successRate: number
      averageScore: number
    }
    achievements: Array<{ achievement?: { _id?: string; title?: string; icon?: string } }>
    preferences?: {
      difficultyLevel?: string
      learningStyle?: string
      preferredLanguages?: string[]
    }
  }
}

type AuthResponse = {
  success: boolean
  user: AuthUser
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [progress, setProgress] = useState<ProgressResponse['data'] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      const token = getAuthToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const [authResponse, progressResponse] = await Promise.all([
          apiRequest<AuthResponse>('/auth/me', {}, true),
          apiRequest<ProgressResponse>('/progress/me', {}, true),
        ])

        setUser(authResponse.user)
        setProgress(progressResponse.data)
      } catch (requestError) {
        clearAuthToken()
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your dashboard.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const achievementPreview = useMemo(() => {
    if (!progress?.achievements?.length) {
      return []
    }

    return progress.achievements
      .map((entry) => entry.achievement)
      .filter(Boolean)
      .slice(0, 3)
  }, [progress?.achievements])

  const preferredLanguagesText = useMemo(() => {
    const preferredLanguages =
      progress?.preferences?.preferredLanguages || user?.preferences?.preferredProgrammingLanguages || []

    return preferredLanguages.join(', ') || 'Choose preferences after signup'
  }, [progress?.preferences?.preferredLanguages, user?.preferences?.preferredProgrammingLanguages])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
        <div className="rounded-2xl bg-white px-8 py-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          Loading your dashboard…
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Account dashboard</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Sign in to unlock saved progress</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            Anonymous visitors can still use the playground and code review. Sign in only when you want persistence,
            progress, and a returning dashboard.
          </p>

          {error && (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Create account
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Try the playground first
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Live account state</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Welcome back, {user.firstName} {user.lastName}
            </h1>
            <p className="mt-3 text-base text-slate-600">
              @{user.username} · {user.email}
            </p>
          </div>
          <button
            onClick={() => {
              clearAuthToken()
              window.location.href = '/login'
            }}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Sign out
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard label="Level" value={String(progress?.level || user.progress?.level || 1)} hint={progress?.rank || 'Starter'} />
          <DashboardCard label="XP tracked" value={String(progress?.totalXP || user.progress?.totalXP || 0)} hint="Account progress" />
          <DashboardCard
            label="Current streak"
            value={String(progress?.streak?.current || user.progress?.currentStreak || 0)}
            hint={`Best: ${progress?.streak?.longest || user.progress?.longestStreak || 0}`}
          />
          <DashboardCard
            label="Challenges completed"
            value={String(progress?.statistics?.totalChallengesCompleted || user.progress?.completedChallenges || 0)}
            hint={`${progress?.statistics?.successRate?.toFixed(0) || 0}% success rate`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Progress snapshot</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoRow
                label="Learning style"
                value={progress?.preferences?.learningStyle || user.preferences?.learningStyle || 'Not set yet'}
              />
              <InfoRow
                label="Difficulty"
                value={progress?.preferences?.difficultyLevel || user.preferences?.difficulty || 'beginner'}
              />
              <InfoRow
                label="Preferred languages"
                value={preferredLanguagesText}
              />
              <InfoRow
                label="Average score"
                value={progress?.statistics?.averageScore ? `${progress.statistics.averageScore.toFixed(0)}%` : 'No completed submissions yet'}
              />
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
            <h2 className="text-xl font-bold">Achievement feed</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-200">
              {achievementPreview.length > 0 ? (
                achievementPreview.map((achievement, index) => (
                  <div key={achievement?._id || achievement?.title || achievement?.icon || `achievement-${index}`} className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                    <p className="font-semibold text-white">{achievement?.icon || '🏁'} {achievement?.title || 'Unlocked achievement'}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  Finish your first tracked challenge to start building an achievement history.
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/playground"
                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Open playground
              </Link>
              <Link
                href="/review"
                className="inline-flex items-center rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
              >
                Run a code review
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function DashboardCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-base text-slate-900">{value}</p>
    </div>
  )
}

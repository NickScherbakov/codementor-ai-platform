export default function SignupStub() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Sign up flow (preview)</h1>
          <p className="mt-3 max-w-3xl text-gray-700">
            Account creation needs the backend API. While this static build keeps inputs disabled, you can still follow the
            steps you’d take in the live environment and jump to the live coding challenge.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl border border-gray-200 bg-slate-50 p-6 shadow-sm sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-500">How it works when live</p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
              <li>Enter email + password (or SSO) and receive JWT</li>
              <li>Profile bootstraps with recommended learning path</li>
              <li>First challenge unlocked with onboarding hints</li>
              <li>Progress, streaks, and XP sync to MongoDB/Redis</li>
            </ol>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Try the flow now</p>
            <p>Inputs are disabled here, but you can experience the immediate next step — solving your first challenge.</p>
            <a
              href="/#challenge"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Start with a live challenge
            </a>
          </div>
        </div>

        <div className="grid max-w-xl gap-4">
          <input className="w-full rounded border px-3 py-2 opacity-70" placeholder="Email (disabled in demo)" disabled />
          <input className="w-full rounded border px-3 py-2 opacity-70" placeholder="Password (disabled in demo)" type="password" disabled />
          <button className="rounded bg-blue-600 px-4 py-2 font-semibold text-white opacity-60" disabled>
            Create Account
          </button>
          <p className="text-sm text-gray-600">Live signup available when backend API is connected.</p>
        </div>
      </div>
    </main>
  )
}

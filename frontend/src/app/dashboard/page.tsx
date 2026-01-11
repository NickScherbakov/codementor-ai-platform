export default function DashboardStub() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard (guided preview)</h1>
            <p className="mt-2 max-w-2xl text-gray-700">
              See how progress, XP, and achievements will look once you connect to the live backend and AI engine.
              The cards below are mocked so you can understand the flow.
            </p>
          </div>
          <a
            href="/#challenge"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Jump to live challenge
          </a>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Current path</p>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">Python fundamentals</h2>
            <p className="mt-2 text-gray-600">8 / 12 modules complete · 92% streak</p>
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              Next up: Data structures · est. 20 mins · +150 XP
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Achievements</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>🎯 Consistency streak — 14 days</li>
              <li>⚡ Speed run — solved 3 challenges under 5 mins</li>
              <li>🧠 AI mentor — requested 5 actionable hints</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Live stack</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>Frontend: online</li>
              <li>Backend API: online</li>
              <li>Local AI engine: online (server capacity ~50 users)</li>
            </ul>
            <a href="/demo/limitations" className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-600">
              View what’s mocked →
            </a>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-blue-200 bg-white/70 p-6 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">What will work when connected</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            <li>✅ Real-time progress sync with MongoDB/Redis</li>
            <li>✅ AI tutor feedback on code submissions</li>
            <li>✅ WebSocket live collaboration</li>
            <li>✅ XP, streaks, and achievements persistence</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

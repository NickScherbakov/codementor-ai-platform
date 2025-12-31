'use client'

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Interactive demo tour</h1>
          <p className="mt-3 max-w-3xl text-gray-700">
            Explore how the platform feels. Core flows are mocked here, but the live stack (frontend + backend + local AI)
            is already running on the server instance and can handle ~50 concurrent users.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">What you can try right now</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Play with the live coding challenge on the home page</li>
              <li>• Toggle hints and see XP deductions (mocked)</li>
              <li>• View execution results flow (mocked run)</li>
              <li>• Navigate Dashboard/Playground/Signup guided previews</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">What’s available when fully connected</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Auth, persistence, and XP/achievements in MongoDB/Redis</li>
              <li>• AI tutor chat and code analysis via local AI engine</li>
              <li>• WebSocket collaboration and live execution sandbox</li>
              <li>• Adaptive challenge generation and progress analytics</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/#challenge"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Try the live coding challenge
          </a>
          <a
            href="/demo/limitations"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-800 hover:border-gray-300"
          >
            View limitations
          </a>
        </div>
      </div>
    </main>
  )
}

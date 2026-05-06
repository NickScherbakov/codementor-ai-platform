'use client'

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Interactive demo tour</h1>
          <p className="mt-3 max-w-3xl text-gray-700">
            Explore the product surface and current launch posture. This page focuses on honest status and guided entry
            points instead of pretending every flow is production-complete.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">What you can try right now</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Use the playground and hard review entry points</li>
              <li>• Create an account and open the live dashboard flow</li>
              <li>• Review the current production gaps before launch</li>
              <li>• Validate which features are live in this environment</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">What still needs hardening</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Sandbox code execution for challenge submissions</li>
              <li>• Budget-aware AI routing and degradation policies</li>
              <li>• Collaboration UX and broader persistence coverage</li>
              <li>• Production observability and launch automation</li>
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

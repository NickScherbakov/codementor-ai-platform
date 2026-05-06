export default function DemoLimitationsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">Platform Status</h1>
        <p className="mt-4 text-lg text-gray-700">
          This page tracks what is live in the current environment and what still needs more production hardening.
        </p>

        {/* Live Features */}
        <div className="mt-12">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-green-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Live &amp; Functional
          </h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Backend API</strong> — Node.js/Express server with health checks, auth routes, and rate-limited review APIs
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>AI Engine</strong> — Python Flask service used by the mentorship and analysis paths when configured
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Account flows</strong> — Signup, login, token-backed dashboard access, and password reset endpoints
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Hard review</strong> — Public code review remains free, with operational throttling instead of subscription prompts
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Dashboard data</strong> — Authenticated dashboard reads live profile and progress endpoints
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Platform messaging</strong> — UI no longer presents signup/dashboard as static preview-only pages
              </div>
            </li>
          </ul>
        </div>

        {/* Mocked/Disabled Features */}
        <div className="mt-12">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-orange-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Not Yet Implemented
          </h2>
          <ul className="mt-4 space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>Production-grade code execution</strong> — Some execution flows still rely on placeholder logic instead of a dedicated sandbox service
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>Progress depth</strong> — Dashboard persistence exists, but the broader challenge lifecycle still needs deeper end-to-end wiring
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>Real-time collaboration</strong> — WebSocket handlers exist, but collaboration UI and operational readiness are not complete yet
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>Cost routing and observability</strong> — Budget-aware AI routing and full launch dashboards still need additional hardening
              </div>
            </li>
          </ul>
        </div>

        {/* Capacity Info */}
        <div className="mt-12 rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-900">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo Capacity
          </h3>
          <p className="mt-2 text-sm text-blue-800">
            Capacity depends on the configured backend, AI provider, and guardrails in this environment. Public access is free, but operational rate limits remain in place to protect reliability.
          </p>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-gray-700">
            Want to test the live features?{' '}
            <a href="/#challenge" className="font-semibold text-blue-600 hover:text-blue-500">
              Try the coding challenge →
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

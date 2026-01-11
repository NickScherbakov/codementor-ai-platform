export default function DemoLimitationsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">Platform Status</h1>
        <p className="mt-4 text-lg text-gray-700">
          This deployment runs the full stack: frontend, backend API, AI engine, MongoDB, and Redis. Below is the current status of features.
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
                <strong>Backend API</strong> — Node.js/Express server (port 3001) with health checks, CORS, rate limiting
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>AI Engine</strong> — Python Flask service (port 5000) with local ML models for code analysis and tutoring
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>MongoDB + Redis</strong> — Database and caching layer running (ports 27017, 6379)
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Challenge Generation</strong> — AI endpoint <code className="rounded bg-gray-100 px-2 py-1 text-sm">/challenges/generate</code> creates adaptive coding tasks
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Code Execution (WebSocket)</strong> — Real-time code running via backend WebSocket with fallback to mock
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Judge0 Sandbox</strong> — Secure code execution environment for multiple languages
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-green-600">✓</span>
              <div>
                <strong>Monitoring</strong> — Prometheus + Grafana for metrics and observability
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
                <strong>Authentication</strong> — Sign up/login, JWT tokens, user sessions (routes exist but not connected)
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>User Progress Persistence</strong> — Completed challenges, XP, achievements not saved to DB yet
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>Real-time Collaboration</strong> — Pair programming, shared sessions (WebSocket handlers ready, UI not integrated)
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>AI Tutor Chat</strong> — Full conversational AI (endpoint exists, frontend integration pending)
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-600">⚠</span>
              <div>
                <strong>Learning Path Recommendations</strong> — Personalized curriculum (backend logic stubbed, needs ML training)
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
            The current deployment is configured for <strong>~50 concurrent users</strong> due to local AI model constraints (no GPU acceleration). For production use, the AI engine should be scaled with cloud GPU instances or switched to API-based services.
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

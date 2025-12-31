export default function PlaygroundStub() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Playground (guided preview)</h1>
            <p className="mt-2 max-w-2xl text-gray-700">
              The live playground connects to the backend executor and local AI for linting and feedback. In this demo, runs are
              mocked — jump to the live challenge to see the flow.
            </p>
          </div>
          <a
            href="/#challenge"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Open live challenge
          </a>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">How the playground behaves when live</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-gray-700">
            <li>• Monaco editor with language-aware autocomplete</li>
            <li>• Run code via backend sandbox and return stdout/stderr</li>
            <li>• AI mentor inline hints powered by local model</li>
            <li>• Shareable sessions over WebSocket for pair programming</li>
          </ul>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-gray-700">
            Want a quick feel? Scroll to the live coding challenge on the home page — it mirrors the same UX with mocked runs.
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-blue-200 bg-white/80 p-6 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Sample snippet (try in the live challenge)</p>
          <pre className="mt-3 overflow-auto rounded bg-gray-900 p-4 text-sm text-gray-100">
{`def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))
`}
          </pre>
        </section>
      </div>
    </main>
  )
}

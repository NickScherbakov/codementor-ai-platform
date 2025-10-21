export default function DashboardStub() {
  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-4xl font-bold">Dashboard (Demo)</h1>
      <p className="mt-4 max-w-2xl text-gray-700">
        This dashboard is a static preview. In the full app, you’ll see real-time progress, achievements, and
        personalized learning paths powered by the backend.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Progress</h2>
          <p className="mt-2 text-gray-600">Challenges completed: 0 (demo)</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Achievements</h2>
          <p className="mt-2 text-gray-600">Come back in the full app to unlock badges!</p>
        </div>
      </div>
    </main>
  )
}

'use client'

export default function DemoPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">CodeMentor AI Demo</h1>
      <p className="mt-4 text-gray-700">
        This is a static demo build deployed via GitHub Pages. Interactive features that require a backend
        or the AI engine are disabled in this demo.
      </p>
      <ul className="mt-6 list-disc pl-6 text-gray-700">
        <li>Landing page with features overview</li>
        <li>Static demo page (this page)</li>
      </ul>
    </main>
  )
}

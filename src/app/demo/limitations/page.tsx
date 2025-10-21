export default function DemoLimitationsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-4xl font-bold">Demo limitations</h1>
      <p className="mt-4 max-w-3xl text-gray-700">
        This GitHub Pages deployment is a static export intended to showcase the UI and information architecture. The following
        features are disabled because they require server-side APIs and/or the AI engine:
      </p>
      <ul className="mt-6 list-disc pl-6 text-gray-700">
        <li>Authentication (sign up / login) and JWT</li>
        <li>AI Tutor chat and code analysis endpoints</li>
        <li>Real-time collaboration (WebSocket)</li>
        <li>Challenge generation and solution validation</li>
        <li>Code execution sandbox</li>
        <li>Progress analytics and persistence (MongoDB/Redis)</li>
      </ul>
      <p className="mt-6 max-w-3xl text-gray-700">
        To experience the full functionality, run the application locally with the backend and AI engine enabled as described in
        the README.
      </p>
    </main>
  )
}

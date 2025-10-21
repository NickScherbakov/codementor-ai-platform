export default function PlaygroundStub() {
  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-4xl font-bold">Playground (Demo)</h1>
      <p className="mt-4 max-w-2xl text-gray-700">
        This is a static demo on GitHub Pages. Interactive code execution and the live editor require the backend
        and AI engine, which are disabled in this static build.
      </p>
      <section className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Sample Code</h2>
        <pre className="mt-4 overflow-auto rounded bg-gray-900 p-4 text-sm text-gray-100">
{`// Try this snippet locally in the full app
function greet(name) {
  return ` + "`Hello, ${name}!`" + `
}

console.log(greet('World')) // Hello, World!
`}
        </pre>
      </section>
    </main>
  )
}

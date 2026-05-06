export default function NotFound() {
  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="mt-4 max-w-2xl text-gray-700">
        The page you are looking for does not exist. Try one of the live entry points instead:
      </p>
      <ul className="mt-4 list-disc pl-6 text-blue-700">
        <li><a className="underline" href="./">Home</a></li>
        <li><a className="underline" href="./demo/">Demo</a></li>
        <li><a className="underline" href="./playground/">Playground</a></li>
        <li><a className="underline" href="./signup/">Sign up</a></li>
        <li><a className="underline" href="./login/">Log in</a></li>
        <li><a className="underline" href="./dashboard/">Dashboard</a></li>
      </ul>
    </main>
  )
}

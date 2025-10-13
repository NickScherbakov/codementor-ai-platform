export default function SignupStub() {
  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-4xl font-bold">Sign Up (Demo)</h1>
      <p className="mt-4 max-w-2xl text-gray-700">
        This is a static demo on GitHub Pages. The real sign up flow requires the backend API and is disabled here.
      </p>
      <div className="mt-8 grid max-w-xl gap-4">
        <input className="w-full rounded border px-3 py-2" placeholder="Email" disabled />
        <input className="w-full rounded border px-3 py-2" placeholder="Password" type="password" disabled />
        <button className="rounded bg-blue-600 px-4 py-2 font-semibold text-white opacity-60" disabled>
          Create Account
        </button>
        <p className="text-sm text-gray-600">Sign up is disabled in the static demo.</p>
      </div>
    </main>
  )
}

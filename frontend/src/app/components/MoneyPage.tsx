import { Button } from "./ui/button";
import { AlertTriangle, XCircle, AlertCircle } from "lucide-react";

export function MoneyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="max-w-7xl mx-auto px-8 py-24">
        {/* Header */}
        <div className="mb-24">
          <div className="inline-block mb-8">
            <span className="font-mono text-sm tracking-wider text-neutral-400">CODEMENTOR AI</span>
          </div>
          <h1 className="text-7xl font-bold tracking-tight mb-6 text-neutral-50 max-w-4xl leading-[1.1]">
            Your code is being judged. Make sure it survives.
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
            Get the code review you'd get in a real interview. No sugar-coating. No tutorials. Just honest technical judgment.
          </p>
        </div>

        {/* Code Review Example */}
        <div className="grid grid-cols-2 gap-8 mb-20">
          {/* Before */}
          <div>
            <div className="mb-4">
              <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">Your Code</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 font-mono text-sm">
              <pre className="text-neutral-300 leading-relaxed">
{`function getUserData(userId) {
  const user = users.find(u => u.id == userId);
  return {
    name: user.name,
    email: user.email,
    posts: user.posts.map(p => ({
      title: p.title,
      content: p.content
    }))
  };
}`}
              </pre>
            </div>
          </div>

          {/* After - Brutal Review */}
          <div>
            <div className="mb-4">
              <span className="text-sm font-mono text-neutral-500 uppercase tracking-wider">Senior Review</span>
            </div>
            <div className="bg-neutral-900 border border-red-900/50 rounded-lg p-6 space-y-4">
              {/* Critical Issues */}
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-xs text-red-400 mb-1 uppercase tracking-wider">Critical</div>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    <span className="font-semibold">No null check.</span> This crashes in production the moment <code className="bg-red-950/50 px-1.5 py-0.5 rounded text-red-300">user</code> is undefined. Did you even test this?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-xs text-red-400 mb-1 uppercase tracking-wider">Critical</div>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    <span className="font-semibold">Type coercion with ==</span> instead of ===. Are you writing JavaScript or playing roulette?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-xs text-amber-400 mb-1 uppercase tracking-wider">Design</div>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    <span className="font-semibold">Direct database coupling.</span> Why is this function responsible for data mapping? Single responsibility principle—heard of it?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-xs text-blue-400 mb-1 uppercase tracking-wider">Performance</div>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    <span className="font-semibold">O(n) lookup every time.</span> Use a Map. This doesn't scale past 100 users.
                  </p>
                </div>
              </div>

              {/* Bottom verdict */}
              <div className="pt-4 border-t border-neutral-800">
                <p className="text-xs font-mono text-neutral-500">
                  Verdict: <span className="text-red-400">Would not pass review</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-start gap-4">
          <Button className="bg-neutral-50 text-neutral-950 hover:bg-neutral-200 px-8 py-6 text-lg h-auto font-semibold">
            Get a real code review
          </Button>
          <p className="text-sm text-neutral-500 font-mono">
            No account required. Paste your code, get judged in 30 seconds.
          </p>
        </div>

        {/* Bottom positioning statement */}
        <div className="mt-32 pt-16 border-t border-neutral-800">
          <p className="text-neutral-500 text-sm max-w-3xl leading-relaxed">
            This is not a learning platform. This is career insurance. If your code can't handle a harsh review here, 
            it won't survive a real interview or a production incident. We don't teach. We expose.
          </p>
        </div>
      </div>
    </div>
  );
}

import { XCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

export function ToneReference() {
  const codeExample = `function processPayment(amount, userId) {
  const user = users.find(u => u.id == userId);
  if (user.balance >= amount) {
    user.balance = user.balance - amount;
    return true;
  }
  return false;
}`;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider mb-4 block">
            Internal Reference
          </span>
          <h1 className="text-5xl font-bold mb-4">Review Tone & Severity Calibration</h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            The same code, reviewed at three different severity levels. This defines the product voice.
          </p>
        </div>

        {/* Code Example */}
        <div className="mb-12 bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="mb-3">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
              Code Under Review
            </span>
          </div>
          <pre className="font-mono text-sm text-neutral-300 leading-relaxed">{codeExample}</pre>
        </div>

        {/* Three Tones */}
        <div className="space-y-12">
          {/* Tone 1: Polite / ChatGPT-like */}
          <div>
            <div className="mb-6 pb-4 border-b border-neutral-300">
              <h2 className="text-2xl font-bold mb-2">Tone 1: Polite / ChatGPT-like</h2>
              <p className="text-sm text-neutral-600">Helpful, educational, non-threatening</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-5">
              <div className="flex gap-4 items-start">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-blue-600 uppercase tracking-wider">Suggestion</div>
                  <p className="text-base text-neutral-700 leading-relaxed">
                    Consider adding a null check for the <code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 font-mono text-sm">user</code> object. 
                    This would help prevent potential runtime errors if the user is not found.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-blue-600 uppercase tracking-wider">Suggestion</div>
                  <p className="text-base text-neutral-700 leading-relaxed">
                    You might want to use strict equality (<code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 font-mono text-sm">===</code>) 
                    instead of loose equality (<code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 font-mono text-sm">==</code>) 
                    to avoid type coercion issues.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-blue-600 uppercase tracking-wider">Suggestion</div>
                  <p className="text-base text-neutral-700 leading-relaxed">
                    Have you thought about using a transaction here? This would make your payment processing safer and more reliable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tone 2: Neutral / Professional */}
          <div>
            <div className="mb-6 pb-4 border-b border-neutral-300">
              <h2 className="text-2xl font-bold mb-2">Tone 2: Neutral / Professional</h2>
              <p className="text-sm text-neutral-600">Direct, factual, standard code review</p>
            </div>
            <div className="bg-white border border-neutral-300 rounded-lg p-8 space-y-5">
              <div className="flex gap-4 items-start">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-red-600 uppercase tracking-wider">Bug</div>
                  <p className="text-base text-neutral-800 leading-relaxed">
                    Missing null check on <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-900 font-mono text-sm">user</code>. 
                    Will throw <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-900 font-mono text-sm">TypeError</code> if find() returns undefined.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-amber-600 uppercase tracking-wider">Style</div>
                  <p className="text-base text-neutral-800 leading-relaxed">
                    Use strict equality (===) instead of loose equality (==). Prevents unintended type coercion.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-red-600 uppercase tracking-wider">Critical</div>
                  <p className="text-base text-neutral-800 leading-relaxed">
                    Balance mutation without transaction. Race condition risk. Not atomic. Recommend database-level transaction or optimistic locking.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-mono text-xs text-blue-600 uppercase tracking-wider">Performance</div>
                  <p className="text-base text-neutral-800 leading-relaxed">
                    Linear search on every call. Index userId or use Map for O(1) lookup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tone 3: Hard / Senior Team Lead */}
          <div>
            <div className="mb-6 pb-4 border-b border-red-900">
              <h2 className="text-2xl font-bold mb-2">Tone 3: Hard / Senior Team Lead</h2>
              <p className="text-sm text-neutral-600">Brutally honest, zero patience, assumes competence</p>
            </div>
            <div className="bg-neutral-900 border-2 border-red-900 rounded-lg p-8 space-y-6">
              <div className="flex gap-4 items-start">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="font-mono text-xs text-red-400 uppercase tracking-wider font-bold">Critical · Bug</div>
                  <p className="text-base text-neutral-100 leading-relaxed font-medium">
                    <span className="text-red-400 font-bold">No null check.</span> This explodes the moment find() returns undefined. 
                    Did you actually run this code, or just hope it works? This is production—not your sandbox.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="font-mono text-xs text-red-400 uppercase tracking-wider font-bold">Critical · Security</div>
                  <p className="text-base text-neutral-100 leading-relaxed font-medium">
                    <span className="text-red-400 font-bold">Balance mutation without a transaction.</span> This is a textbook race condition. 
                    Two concurrent calls = corrupted state. You're processing <span className="underline">payments</span> like this?
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="font-mono text-xs text-amber-400 uppercase tracking-wider font-bold">Design Flaw</div>
                  <p className="text-base text-neutral-100 leading-relaxed font-medium">
                    <span className="text-amber-400 font-bold">== instead of ===.</span> What year is this? Type coercion is not a feature. It's a landmine.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="font-mono text-xs text-blue-400 uppercase tracking-wider font-bold">Performance</div>
                  <p className="text-base text-neutral-100 leading-relaxed font-medium">
                    <span className="text-blue-400 font-bold">O(n) user lookup on every payment.</span> Use a hash map. Or did Big-O notation not make it into your curriculum?
                  </p>
                </div>
              </div>

              {/* Verdict */}
              <div className="pt-6 mt-6 border-t-2 border-red-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-neutral-400 mb-1">VERDICT</p>
                    <p className="text-lg font-bold text-red-400">This doesn't ship. Rewrite it.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-neutral-500 mb-1">SEVERITY SCORE</p>
                    <p className="text-3xl font-bold text-red-500">8.5/10</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Legend */}
        <div className="mt-20 pt-12 border-t-2 border-neutral-300">
          <h2 className="text-3xl font-bold mb-8">Severity Classification</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1 text-red-900">Critical / Bug</h3>
                <p className="text-sm text-red-800">Crashes, data loss, security holes, production blockers</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-900/30 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-700 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1 text-red-900">Security</h3>
                <p className="text-sm text-red-800">Authentication, authorization, injection, race conditions</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-amber-50 border-2 border-amber-300 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-amber-700 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1 text-amber-900">Design / Style</h3>
                <p className="text-sm text-amber-800">Architecture flaws, bad patterns, maintainability issues</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <AlertCircle className="w-8 h-8 text-blue-700 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1 text-blue-900">Performance</h3>
                <p className="text-sm text-blue-800">Algorithmic complexity, inefficient queries, memory leaks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Note */}
        <div className="mt-16 p-8 bg-neutral-900 text-neutral-100 rounded-lg">
          <h3 className="font-mono text-sm text-neutral-400 uppercase tracking-wider mb-3">Product Note</h3>
          <p className="text-base leading-relaxed mb-4">
            <strong className="text-neutral-50">Tone 3 (Hard)</strong> is the target product voice. This is not cruelty—it's career preparation. 
            Real interviews, real PR reviews, and real production incidents do not come with gentle feedback.
          </p>
          <p className="text-sm text-neutral-400">
            Users should leave CodeMentor AI with thicker skin and better code. Not with a participation trophy.
          </p>
        </div>
      </div>
    </div>
  );
}

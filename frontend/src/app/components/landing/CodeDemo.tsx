'use client';

import { motion } from 'framer-motion';
import { Code, Play, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useState } from 'react';

export function CodeDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <section id="demo" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <Play className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Try it Live</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            See AI in Action
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Write code and get instant AI-powered feedback. Our system analyzes your code
            for quality, security, and best practices.
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Code Editor */}
          <Card className="bg-slate-950 border-slate-800 shadow-2xl overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-slate-400 font-mono">solution.js</span>
              </div>
              <Badge variant="outline" className="border-slate-700 text-slate-400">
                <Code className="w-3 h-3 mr-1" />
                JavaScript
              </Badge>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-sm space-y-2 min-h-[300px]">
              <div className="text-slate-500">
                <span className="text-purple-400">function</span>{' '}
                <span className="text-blue-400">fibonacci</span>
                <span className="text-slate-300">(</span>
                <span className="text-orange-400">n</span>
                <span className="text-slate-300">)</span>{' '}
                <span className="text-slate-300">{'{'}</span>
              </div>
              <div className="text-slate-300 pl-4">
                <span className="text-purple-400">if</span>{' '}
                <span className="text-slate-300">(</span>
                <span className="text-orange-400">n</span>{' '}
                <span className="text-slate-500">{'<='}</span>{' '}
                <span className="text-green-400">1</span>
                <span className="text-slate-300">)</span>{' '}
                <span className="text-purple-400">return</span>{' '}
                <span className="text-orange-400">n</span>
                <span className="text-slate-300">;</span>
              </div>
              <div className="text-slate-300 pl-4">
                <span className="text-purple-400">return</span>{' '}
                <span className="text-blue-400">fibonacci</span>
                <span className="text-slate-300">(</span>
                <span className="text-orange-400">n</span>{' '}
                <span className="text-slate-500">-</span>{' '}
                <span className="text-green-400">1</span>
                <span className="text-slate-300">)</span>{' '}
                <span className="text-slate-500">+</span>
              </div>
              <div className="text-slate-300 pl-12">
                <span className="text-blue-400">fibonacci</span>
                <span className="text-slate-300">(</span>
                <span className="text-orange-400">n</span>{' '}
                <span className="text-slate-500">-</span>{' '}
                <span className="text-green-400">2</span>
                <span className="text-slate-300">);</span>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-300">{'}'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-6 pb-6">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Analysis Results */}
          <Card className="bg-white border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                AI Analysis Results
              </h3>
            </div>

            <div className="p-6 space-y-4 min-h-[300px]">
              {!showResults && !isAnalyzing && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center space-y-2">
                    <AlertCircle className="w-12 h-12 mx-auto opacity-50" />
                    <p>Click &quot;Analyze with AI&quot; to see results</p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                    </div>
                  ))}
                </motion.div>
              )}

              {showResults && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Score */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <span className="font-semibold text-slate-900">Code Quality Score</span>
                    <span className="text-2xl font-bold text-blue-600">78/100</span>
                  </div>

                  {/* Issues */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-yellow-900 text-sm">Performance Warning</p>
                        <p className="text-yellow-700 text-sm">Recursive approach has O(2^n) complexity. Consider using memoization.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 text-sm">Best Practice</p>
                        <p className="text-red-700 text-sm">Missing input validation for negative numbers.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-900 text-sm">Good Practice</p>
                        <p className="text-green-700 text-sm">Clean and readable code structure.</p>
                      </div>
                    </div>
                  </div>

                  {/* Suggestion */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-semibold text-blue-900 text-sm mb-2">💡 AI Suggestion</p>
                    <p className="text-blue-700 text-sm">
                      Use dynamic programming with memoization to improve performance from O(2^n) to O(n).
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

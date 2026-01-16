'use client';

import { motion } from 'framer-motion';
import { Brain, Code, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Learning Platform
              </Badge>
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
                  Evolve Your
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Coding Skills
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                Experience revolutionary AI-powered code mentorship. Get instant feedback, 
                personalized learning paths, and rigorous assessments that adapt to your pace.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Brain, text: 'AI Mentorship' },
                { icon: Code, text: 'Real-time Feedback' },
                { icon: CheckCircle, text: 'Skill Assessment' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm"
                >
                  <feature.icon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 group"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                >
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900">50,000+ developers</p>
                <p className="text-slate-600">learning with CodeMentor AI</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            {/* Code Window Mock */}
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
              {/* Window Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-slate-400 font-mono">code-mentor.tsx</span>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="text-slate-500"
                >
                  <span className="text-purple-400">import</span> <span className="text-blue-400">{'{'} AI {'}'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'codementor'</span>;
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="h-4"
                />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="text-slate-300"
                >
                  <span className="text-purple-400">const</span> <span className="text-blue-300">mentor</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">AI</span>.<span className="text-blue-300">Mentor</span>();
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                  className="text-slate-300"
                >
                  <span className="text-blue-300">mentor</span>.<span className="text-yellow-400">analyze</span>(<span className="text-orange-400">myCode</span>);
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 }}
                  className="h-4"
                />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 }}
                  className="text-green-400"
                >
                  // ✨ AI: Your code is 94% optimal!
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.2 }}
                  className="text-green-400"
                >
                  // 💡 Tip: Consider using memoization
                </motion.div>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute -right-4 top-1/4 bg-white rounded-xl shadow-xl p-4 border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">94%</p>
                    <p className="text-xs text-slate-600">Code Quality</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 2.7 }}
                className="absolute -left-4 bottom-1/4 bg-white rounded-xl shadow-xl p-4 border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">AI</p>
                    <p className="text-xs text-slate-600">Analyzing...</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

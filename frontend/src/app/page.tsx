'use client'

import CodeEditor from '@/components/CodeEditor'
import HeroCodeDemo from '@/components/HeroCodeDemo'
import OnboardingTour from '@/components/OnboardingTour'
import QuickStartPlayground from '@/components/QuickStartPlayground'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, BookOpen, Brain, CheckCircle2, Code, Lightbulb, Target, Trophy, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed')
    if (!hasCompletedOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour
          onComplete={() => setShowOnboarding(false)}
          onDismiss={() => setShowOnboarding(false)}
        />
      )}
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 lg:origin-center" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200 bg-indigo-50 mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
                  AI-Powered Code Evolution
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                  Stop Writing <span className="text-indigo-600">Legacy Code</span>
                </h1>
                <p className="text-lg leading-8 text-gray-600 mb-8">
                  Most coding platforms just check syntax. We check your <strong>engineering</strong>.
                  Get brutal, senior-level feedback or gentle, adaptive mentoring. You choose the mode.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/review"
                    className="rounded-lg bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Roast My Code
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    Start Mentorship
                  </Link>
                  <Link
                    href="/playground"
                    className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:from-purple-500 hover:to-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Try AI Console
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <p>Joined by 500+ developers this week</p>
                </div>
              </motion.div>
            </div>
            <div className="mt-16 lg:mt-0 lg:col-span-6 lg:row-start-1 lg:col-start-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <HeroCodeDemo />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Split Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Two Ways to Grow</h2>
            <p className="mt-4 text-lg text-gray-600">Whether you need a hug or a kick in the pants, we&apos;ve got you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Mentorship Mode */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white ring-1 ring-gray-200 rounded-2xl p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Mentorship</h3>
                <p className="text-gray-600 mb-8 flex-grow">
                  A patient, adaptive tutor that guides you through concepts.
                  Perfect for learning new languages or frameworks from scratch.
                  It adapts to your pace and learning style.
                </p>
                <ul className="space-y-3 mb-8 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span>Personalized Learning Paths</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span>Interactive Quizzes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span>Progress Tracking</span>
                  </li>
                </ul>
                <Link href="/dashboard" className="mt-auto text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  Start Learning <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Hard Review Mode */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white ring-1 ring-gray-200 rounded-2xl p-8 h-full flex flex-col">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Hard Code Review</h3>
                <p className="text-gray-600 mb-8 flex-grow">
                  Simulates a strict Senior Engineer code review.
                  It won&apos;t be nice. It will find security holes, performance issues,
                  and bad patterns you didn&apos;t know you had.
                </p>
                <ul className="space-y-3 mb-8 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-500" />
                    <span>Security Vulnerability Scan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-500" />
                    <span>Performance Bottlenecks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-500" />
                    <span>Idiomatic Refactoring</span>
                  </li>
                </ul>
                <Link href="/review" className="mt-auto text-red-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                  Get Roasted <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sandbox Section */}
      <section id="challenge" className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-base font-semibold leading-7 text-blue-600">Try it now</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Live Code Editor & AI Analysis</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Write code and hit Run to get instant AI feedback. Our backend analyzes your code and opens it in the AI Console 
                with your choice of LLM: Google Gemini, local models, or any provider via OpenRouter.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-700">
                <span className="rounded-full bg-white px-3 py-1 shadow-sm">🚀 Real AI Analysis</span>
                <span className="rounded-full bg-white px-3 py-1 shadow-sm">🧠 Multiple LLM Providers</span>
                <span className="rounded-full bg-white px-3 py-1 shadow-sm">💬 Interactive Console</span>
                <span className="rounded-full bg-white px-3 py-1 shadow-sm">🎯 Instant Feedback</span>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              Full stack (frontend + backend + local AI) is online for demo load (~50 users)
            </div>
          </div>

          <div className="mt-10">
            <CodeEditor />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Intelligent Learning</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Revolutionary Programming Education
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience the future of coding education with our AI-powered platform that adapts to your learning style.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Quick Start Playground Section */}
      <QuickStartPlayground />

      {/* Stats Section */}
      <section className="bg-blue-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by developers worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-blue-200">
                Join thousands of programmers who have accelerated their learning journey
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col bg-blue-700/50 p-8">
                  <dt className="text-sm font-semibold leading-6 text-blue-200">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to revolutionize your coding journey?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Start learning with AI-powered mentoring today. No credit card required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
            >
              Get Started Free
            </Link>
            <Link href="/demo" className="text-lg font-semibold leading-6 text-gray-900">
              Watch Demo <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    name: 'AI-Powered Tutoring',
    description: 'Get personalized guidance from our advanced AI mentor that understands your learning style and adapts to your progress.',
    icon: Brain,
  },
  {
    name: 'Interactive Code Editor',
    description: 'Practice coding in our advanced online editor with syntax highlighting, auto-completion, and real-time error detection.',
    icon: Code,
  },
  {
    name: 'Adaptive Learning Paths',
    description: 'Follow customized learning tracks that adjust difficulty and topics based on your performance and goals.',
    icon: Target,
  },
  {
    name: 'Real-time Collaboration',
    description: 'Code together with peers and mentors in real-time, fostering a collaborative learning environment.',
    icon: Users,
  },
  {
    name: 'Instant Feedback',
    description: 'Receive immediate feedback on your code with suggestions for improvement and best practices.',
    icon: Zap,
  },
  {
    name: 'Achievement System',
    description: 'Stay motivated with our gamified learning system featuring badges, streaks, and progress tracking.',
    icon: Trophy,
  },
  {
    name: 'Multi-Language Support',
    description: 'Learn multiple programming languages including JavaScript, Python, Java, C++, and more.',
    icon: BookOpen,
  },
  {
    name: 'Smart Recommendations',
    description: 'Get intelligent suggestions for next topics, projects, and resources based on your learning journey.',
    icon: Lightbulb,
  },
]

const stats = [
  { id: 1, name: 'Active Learners', value: '50K+' },
  { id: 2, name: 'Code Challenges', value: '10K+' },
  { id: 3, name: 'Success Rate', value: '94%' },
  { id: 4, name: 'Languages Supported', value: '15+' },
]

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Brain, Code, Users, Zap, Trophy, Target, Lightbulb } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              <span className="block">Learn Programming with</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Mentoring
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Master coding through personalized AI tutoring, adaptive learning paths, and real-time feedback. 
              Your journey to programming excellence starts here.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
              >
                Start Learning
              </Link>
              <Link
                href="/playground"
                className="rounded-md border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 transition-all duration-200"
              >
                Try Playground
              </Link>
            </div>
          </motion.div>
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
              Watch Demo <span aria-hidden="true">→</span>
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
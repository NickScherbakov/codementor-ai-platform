'use client'

import { motion } from 'framer-motion'
import { Zap, Code, Play, Sparkles, Trophy } from 'lucide-react'
import { useState } from 'react'

interface Challenge {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  example: string
}

const quickChallenges: Challenge[] = [
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'easy',
    description: 'Write a function that reverses a string',
    example: 'reverseString("hello") → "olleh"'
  },
  {
    id: 'find-max',
    title: 'Find Maximum',
    difficulty: 'easy',
    description: 'Find the largest number in an array',
    example: 'findMax([1, 5, 3, 9, 2]) → 9'
  },
  {
    id: 'palindrome',
    title: 'Check Palindrome',
    difficulty: 'medium',
    description: 'Determine if a string is a palindrome',
    example: 'isPalindrome("racecar") → true'
  }
]

export default function QuickStartPlayground() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleTryChallenge = async (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setCode(`// ${challenge.description}\n// Example: ${challenge.example}\n\nfunction solution() {\n  // Your code here\n}\n`)
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    // Simulate API call to Gemini 3 Flash endpoint
    setTimeout(() => {
      setIsRunning(false)
      // In production, this would call /ai/quick-challenge
    }, 1000)
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    hard: 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-purple-600 ring-1 ring-inset ring-purple-200 bg-purple-50 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Gemini 3 Flash
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Quick Start AI Playground
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jump right in with instant coding challenges. Get sub-second feedback and start coding immediately.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Challenge Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Choose Your Challenge</h3>
              </div>

              <div className="space-y-4">
                {quickChallenges.map((challenge, index) => (
                  <motion.button
                    key={challenge.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleTryChallenge(challenge)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedChallenge?.id === challenge.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[challenge.difficulty]}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                    <code className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      {challenge.example}
                    </code>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Lightning Fast Feedback</p>
                    <p className="text-xs text-gray-600">
                      Our Gemini 3 Flash integration provides instant validation and hints in under a second.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Code Editor Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Code className="w-4 h-4" />
                  <span>playground.js</span>
                </div>
              </div>

              <div className="p-6">
                {selectedChallenge ? (
                  <>
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        Challenge: {selectedChallenge.title}
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                        placeholder="Write your solution here..."
                      />
                    </div>

                    <button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRunning ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Zap className="w-5 h-5" />
                          </motion.div>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Run Code
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                    <Code className="w-16 h-16 mb-4" />
                    <p className="text-sm">Select a challenge to start coding</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

const codeSnippet = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`

const improvedCodeSnippet = `const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
}`

export default function HeroCodeDemo() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full max-w-lg mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="ml-4 text-xs text-gray-400 font-mono">code_review.ts</div>
      </div>

      <div className="p-6 font-mono text-sm relative h-64">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: step >= 2 ? 0 : 1 }}
          className="absolute top-6 left-6 right-6"
        >
          <pre className="text-gray-300">
            <code>{codeSnippet}</code>
          </pre>

          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-8 right-0 bg-red-900/80 text-red-200 p-2 rounded text-xs border border-red-500/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1 font-bold mb-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Legacy Loop</span>
              </div>
              Use .reduce() for better readability
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 2 ? 1 : 0 }}
          className="absolute top-6 left-6 right-6"
        >
          <pre className="text-green-300">
            <code>{improvedCodeSnippet}</code>
          </pre>

          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-12 right-0 bg-green-900/80 text-green-200 p-2 rounded text-xs border border-green-500/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1 font-bold mb-1">
                <CheckCircle className="w-3 h-3" />
                <span>Optimized</span>
              </div>
              Type-safe & Functional!
            </motion.div>
          )}
        </motion.div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
                <Zap className={`w-3 h-3 ${step % 2 !== 0 ? 'text-yellow-400 animate-pulse' : ''}`} />
                AI Analyzing...
            </div>
        </div>
      </div>
    </div>
  )
}

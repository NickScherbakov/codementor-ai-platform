'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, AlertTriangle, Brain, Zap, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  highlight: string
  action?: {
    label: string
    href: string
  }
}

interface OnboardingTourProps {
  onComplete?: () => void
  onDismiss?: () => void
}

export default function OnboardingTour({ onComplete, onDismiss }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to CodeMentor AI! 👋',
      description: 'Your journey to becoming a better developer starts here. Let us show you around.',
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      highlight: 'platform'
    },
    {
      id: 'roast',
      title: 'Roast My Code 🔥',
      description: 'Get brutal, senior-level architectural feedback powered by GPT-5.2-Codex. No sugar-coating, just honest code review.',
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      highlight: 'roast',
      action: {
        label: 'Try Roast My Code',
        href: '/review'
      }
    },
    {
      id: 'mentorship',
      title: 'AI Mentorship 🧠',
      description: 'Get gentle, adaptive guidance from Claude Sonnet 4.5. Perfect for learning new concepts with empathetic support.',
      icon: <Brain className="w-8 h-8 text-indigo-500" />,
      highlight: 'mentorship',
      action: {
        label: 'Start Mentorship',
        href: '/dashboard'
      }
    },
    {
      id: 'playground',
      title: 'Quick Start Playground ⚡',
      description: 'Jump into instant coding challenges powered by Gemini 3 Flash. Sub-second responses for rapid learning.',
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      highlight: 'playground',
      action: {
        label: 'Try AI Playground',
        href: '/playground'
      }
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    if (onComplete) {
      onComplete()
    }
    // Store completion in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_completed', 'true')
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={handleDismiss}
          />

          {/* Onboarding Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Close Button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close onboarding"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="mb-6 flex justify-center"
                >
                  {currentStepData.icon}
                </motion.div>

                {/* Title & Description */}
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    {currentStepData.title}
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    {currentStepData.description}
                  </p>
                </motion.div>

                {/* Action Button */}
                {currentStepData.action && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <Link
                      href={currentStepData.action.href}
                      className="block w-full text-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-purple-500 transition-all"
                      onClick={handleComplete}
                    >
                      {currentStepData.action.label}
                    </Link>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  {/* Step Indicators */}
                  <div className="flex gap-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'w-8 bg-indigo-600'
                            : index < currentStep
                            ? 'w-2 bg-indigo-300'
                            : 'w-2 bg-gray-300'
                        }`}
                        aria-label={`Go to step ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {currentStep < steps.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Get Started
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

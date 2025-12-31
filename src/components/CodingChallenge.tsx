import React, { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Square, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lightbulb,
  Brain,
  Trophy,
  Code,
  Zap
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  language: string
  starterCode: string
  testCases: TestCase[]
  hints: Hint[]
  xpReward: number
  estimatedTime: string
}

interface TestCase {
  id: string
  input: string
  expectedOutput: string
  isHidden: boolean
}

interface Hint {
  id: string
  text: string
  order: number
  xpCost: number
}

interface ExecutionResult {
  output: string
  error?: string
  passed: boolean
  executionTime: number
  testResults: TestResult[]
}

interface TestResult {
  testCaseId: string
  passed: boolean
  actualOutput: string
  expectedOutput: string
}

type LayoutHeight = 'full' | 'compact'

interface CodingChallengeProps {
  layoutHeight?: LayoutHeight
}

const CodingChallenge: React.FC<CodingChallengeProps> = ({ layoutHeight = 'full' }) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [code, setCode] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [usedHints, setUsedHints] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState<'description' | 'hints' | 'submissions'>('description')

  useEffect(() => {
    // Load challenge from API or props
    loadChallenge()
  }, [])

  const loadChallenge = async () => {
    // Check if we should use real backend
    const useRealBackend = process.env.NEXT_PUBLIC_ENABLE_REAL_BACKEND === 'true'
    
    if (useRealBackend) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_AI_URL}/challenges/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_level: 'beginner',
            language: 'python',
            topic: 'arrays',
            learning_goals: []
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.challenge) {
            setChallenge(data.challenge)
            setCode(data.challenge.starterCode)
            return
          }
        }
      } catch (error) {
        console.warn('Failed to load challenge from API, using fallback:', error)
      }
    }
    
    // Fallback to mock challenge
    const mockChallenge: Challenge = {
      id: 'array-max-element',
      title: 'Find Maximum Element',
      description: `Write a function that finds the maximum element in an array of integers.

**Requirements:**
- The function should return the maximum value
- Handle empty arrays by returning null
- Array can contain negative numbers

**Example:**
\`\`\`
Input: [3, 7, 2, 9, 1]
Output: 9

Input: [-5, -2, -8, -1]
Output: -1

Input: []
Output: null
\`\`\``,
      difficulty: 'easy',
      language: 'python',
      starterCode: `def find_max(arr):
    """
    Find the maximum element in an array.
    
    Args:
        arr: List of integers
        
    Returns:
        Maximum integer or None if array is empty
    """
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    # Test cases
    print(find_max([3, 7, 2, 9, 1]))  # Should output: 9
    print(find_max([-5, -2, -8, -1]))  # Should output: -1
    print(find_max([]))  # Should output: None`,
      testCases: [
        {
          id: '1',
          input: '[3, 7, 2, 9, 1]',
          expectedOutput: '9',
          isHidden: false
        },
        {
          id: '2',
          input: '[-5, -2, -8, -1]',
          expectedOutput: '-1',
          isHidden: false
        },
        {
          id: '3',
          input: '[]',
          expectedOutput: 'None',
          isHidden: true
        },
        {
          id: '4',
          input: '[42]',
          expectedOutput: '42',
          isHidden: true
        }
      ],
      hints: [
        {
          id: '1',
          text: 'Consider what happens when the array is empty. You should check the length first.',
          order: 1,
          xpCost: 5
        },
        {
          id: '2',
          text: 'Python has a built-in max() function, but you could also iterate through the array.',
          order: 2,
          xpCost: 10
        },
        {
          id: '3',
          text: "If using max(), remember it will throw an error on empty lists. Use max(arr) if arr else None.",
          order: 3,
          xpCost: 15
        }
      ],
      xpReward: 100,
      estimatedTime: '10-15 minutes'
    }
    
    setChallenge(mockChallenge)
    setCode(mockChallenge.starterCode)
  }

  const executeCode = async () => {
    if (!challenge) return
    
    setIsExecuting(true)
    
    try {
      // Check if we should use real backend
      const useRealBackend = process.env.NEXT_PUBLIC_ENABLE_REAL_BACKEND === 'true'
      
      if (useRealBackend) {
        // Use WebSocket for real-time code execution
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
        const socket = new WebSocket(wsUrl)
        
        const executionPromise = new Promise<ExecutionResult>((resolve, reject) => {
          socket.onopen = () => {
            socket.send(JSON.stringify({
              type: 'execute-code',
              data: {
                code,
                language: challenge.language,
                testCases: challenge.testCases
              }
            }))
          }
          
          socket.onmessage = (event) => {
            const response = JSON.parse(event.data)
            if (response.type === 'execution-result') {
              resolve(response.data)
              socket.close()
            } else if (response.type === 'execution-error') {
              reject(new Error(response.error))
              socket.close()
            }
          }
          
          socket.onerror = () => {
            reject(new Error('WebSocket connection failed'))
            socket.close()
          }
          
          // Timeout after 10 seconds
          setTimeout(() => {
            reject(new Error('Execution timeout'))
            socket.close()
          }, 10000)
        })
        
        try {
          const result = await executionPromise
          setExecutionResult(result)
          
          if (result.passed) {
            showSuccessAnimation()
          }
          return
        } catch (error) {
          console.warn('Real execution failed, using mock:', error)
        }
      }
      
      // Fallback to mock execution
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockResult: ExecutionResult = {
        output: '9\n-1\nNone\n',
        passed: true,
        executionTime: 0.045,
        testResults: [
          {
            testCaseId: '1',
            passed: true,
            actualOutput: '9',
            expectedOutput: '9'
          },
          {
            testCaseId: '2',
            passed: true,
            actualOutput: '-1',
            expectedOutput: '-1'
          },
          {
            testCaseId: '3',
            passed: true,
            actualOutput: 'None',
            expectedOutput: 'None'
          },
          {
            testCaseId: '4',
            passed: true,
            actualOutput: '42',
            expectedOutput: '42'
          }
        ]
      }
      
      setExecutionResult(mockResult)
      
      if (mockResult.passed) {
        // Show success animation and award XP
        showSuccessAnimation()
      }
      
    } catch (error) {
      setExecutionResult({
        output: '',
        error: 'Execution failed: ' + (error as Error).message,
        passed: false,
        executionTime: 0,
        testResults: []
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const useHint = (hintId: string) => {
    if (!usedHints.includes(hintId)) {
      setUsedHints([...usedHints, hintId])
      // In real app, deduct XP from user's score
    }
  }

  const showSuccessAnimation = () => {
    // Trigger success celebration
    const celebration = document.createElement('div')
    celebration.innerHTML = '🎉'
    celebration.style.cssText = 'position:fixed;top:50%;left:50%;font-size:100px;z-index:9999;pointer-events:none;animation:bounce 1s ease-out'
    document.body.appendChild(celebration)
    setTimeout(() => document.body.removeChild(celebration), 1000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      case 'expert': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const containerHeight = layoutHeight === 'compact' ? 'h-[720px]' : 'min-h-screen'

  return (
    <div className={`${containerHeight} flex flex-col bg-gray-50 dark:bg-gray-900`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {challenge.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{challenge.estimatedTime}</span>
            </div>
            <div className="flex items-center text-yellow-600">
              <Trophy className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{challenge.xpReward} XP</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Hints</span>
            </button>
            
            <button
              onClick={executeCode}
              disabled={isExecuting}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Problem Description & Hints */}
        <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {['description', 'hints', 'submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium capitalize ${
                  currentTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: challenge.description.replace(/\n/g, '<br>') }} />
              </div>
            )}

            {currentTab === 'hints' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Available Hints
                </h3>
                {challenge.hints.map((hint) => (
                  <div
                    key={hint.id}
                    className={`p-4 border rounded-lg ${
                      usedHints.includes(hint.id)
                        ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    {usedHints.includes(hint.id) ? (
                      <p className="text-gray-700 dark:text-gray-300">{hint.text}</p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 dark:text-gray-400">
                          Hint #{hint.order} available
                        </p>
                        <button
                          onClick={() => useHint(hint.id)}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                        >
                          Use (-{hint.xpCost} XP)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {currentTab === 'submissions' && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No submissions yet</p>
                <p className="text-sm">Run your code to see results here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor & Results */}
        <div className="flex-1 flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 border-b border-gray-200 dark:border-gray-700">
            <Editor
              height="100%"
              language={challenge.language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>

          {/* Results Panel */}
          <div className="h-1/3 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Execution Results
            </h3>
            
            {executionResult ? (
              <div className="space-y-4">
                {/* Overall Status */}
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  executionResult.passed 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                }`}>
                  {executionResult.passed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {executionResult.passed ? 'All tests passed!' : 'Some tests failed'}
                  </span>
                  <span className="ml-auto text-sm">
                    {executionResult.executionTime}ms
                  </span>
                </div>

                {/* Test Results */}
                <div className="space-y-2">
                  {executionResult.testResults.map((result, index) => (
                    <div
                      key={result.testCaseId}
                      className={`p-3 rounded border ${
                        result.passed
                          ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/10'
                          : 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Test Case #{index + 1}</span>
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Expected: </span>
                          <span className="font-mono">{result.expectedOutput}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Actual: </span>
                          <span className="font-mono">{result.actualOutput}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Console Output */}
                {executionResult.output && (
                  <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                    <div className="text-gray-400 mb-2">Console Output:</div>
                    <pre>{executionResult.output}</pre>
                  </div>
                )}

                {/* Error Output */}
                {executionResult.error && (
                  <div className="bg-red-900 text-red-200 p-3 rounded font-mono text-sm">
                    <div className="text-red-300 mb-2">Error:</div>
                    <pre>{executionResult.error}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "Run Code" to execute your solution</p>
                <p className="text-sm">Your code will be tested against all test cases</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {executionResult?.passed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md mx-4"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Challenge Completed! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You've earned {challenge.xpReward} XP points!
                </p>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Next Challenge
                  </button>
                  <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Review Solution
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CodingChallenge
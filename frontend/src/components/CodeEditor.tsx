'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import { Play, Copy, Check } from 'lucide-react'

export default function CodeEditor() {
  const [code, setCode] = useState(`def fibonacci(n):
    """Calculate fibonacci number at position n"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Try to optimize this!
result = fibonacci(35)
print(f"Result: {result}")
`)

  const [language, setLanguage] = useState('python')
  const [copied, setCopied] = useState(false)

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = () => {
    // In a real implementation, this would send code to your backend/AI engine
    alert('In production, this would send your code to our AI engine for analysis!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full space-y-4"
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-700 text-white px-3 py-1.5 rounded text-sm border border-slate-600 hover:border-slate-500 transition-colors"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <span className="text-xs text-slate-400">Interactive Code Editor</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>

          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-all shadow-lg"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="border border-slate-200 rounded-b-lg overflow-hidden shadow-lg">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {/* Info message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <span className="font-semibold">💡 Pro tip:</span> This is a live editor. Write your code and hit <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">Run</span> to get AI feedback!
      </div>
    </motion.div>
  )
}

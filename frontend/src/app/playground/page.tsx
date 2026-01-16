'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, Send, Settings, Sparkles, X, ChevronDown, Code2, User, Bot, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [personality, setPersonality] = useState('encouraging')
  const [llmProvider, setLlmProvider] = useState('gemini')
  const [openrouterModel, setOpenrouterModel] = useState('openai/gpt-4-turbo')
  const [openrouterKey, setOpenrouterKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
    }
  }, [inputValue])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai-console/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputValue,
          personality: personality,
          llmProvider: llmProvider,
          ...(llmProvider === 'openrouter' && {
            openrouterModel: openrouterModel,
            openrouterKey: openrouterKey
          })
        })
      })

      const data = await response.json()

      if (data.success && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response.message || 'No response',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleCopyConversation = () => {
    const text = messages
      .map(m => `${m.type === 'user' ? 'You' : 'AI'}: ${m.content}`)
      .join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearConversation = () => {
    setMessages([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const personalityOptions = [
    { value: 'encouraging', label: 'Encouraging', icon: '😊' },
    { value: 'analytical', label: 'Analytical', icon: '🧠' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
    { value: 'practical', label: 'Practical', icon: '⚙️' },
  ]

  const providerOptions = [
    { value: 'gemini', label: 'Google Gemini', description: 'Cloud • Powerful • Free tier' },
    { value: 'local', label: 'Local Models', description: 'Private • Self-hosted' },
    { value: 'openrouter', label: 'OpenRouter', description: 'Multi-provider access' },
  ]

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-slate-900">CodeMentor AI</h1>
              <p className="text-xs text-slate-500">Playground</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showSettings
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-slate-200 bg-slate-50 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              {/* Personality Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                  Assistant Personality
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {personalityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setPersonality(option.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        personality === option.value
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LLM Provider */}
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                  AI Model Provider
                </label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {providerOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setLlmProvider(option.value)}
                      className={`flex flex-col items-start p-3 rounded-lg text-sm transition-all ${
                        llmProvider === option.value
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                      <span className={`text-xs mt-1 ${
                        llmProvider === option.value ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>

                {/* OpenRouter Settings */}
                {llmProvider === 'openrouter' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2 p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <input
                      type="password"
                      value={openrouterKey}
                      onChange={(e) => setOpenrouterKey(e.target.value)}
                      placeholder="OpenRouter API Key"
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-lg text-sm border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <select
                      value={openrouterModel}
                      onChange={(e) => setOpenrouterModel(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 text-slate-900 rounded-lg text-sm border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="openai/gpt-4-turbo">GPT-4 Turbo (OpenAI)</option>
                      <option value="openai/gpt-4">GPT-4 (OpenAI)</option>
                      <option value="anthropic/claude-3-opus">Claude 3 Opus (Anthropic)</option>
                      <option value="anthropic/claude-3-sonnet">Claude 3 Sonnet (Anthropic)</option>
                      <option value="meta-llama/llama-2-70b-chat">Llama 2 70B (Meta)</option>
                      <option value="mistralai/mistral-large">Mistral Large</option>
                    </select>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Welcome to AI Playground
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Your personal AI coding assistant. Ask questions, get code reviews, 
                explore concepts, or practice algorithms. I'm here to help you learn.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-left">
                {[
                  { title: 'Code Review', desc: 'Get feedback on your code' },
                  { title: 'Explain Concepts', desc: 'Learn programming topics' },
                  { title: 'Debug Help', desc: 'Solve errors together' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(`Help me with ${item.title.toLowerCase()}`)}
                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left group"
                  >
                    <div className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-600">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4"
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-slate-900'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">
                      {message.type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-900">AI Assistant</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {messages.length > 0 && (
            <div className="flex items-center justify-end gap-2 mb-2">
              <button
                onClick={handleCopyConversation}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy chat
                  </>
                )}
              </button>
            </div>
          )}

          <div className="relative flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-slate-300 focus-within:shadow-sm transition-all">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about programming..."
              disabled={loading}
              rows={1}
              className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none resize-none max-h-32 overflow-y-auto disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputValue.trim()}
              className="m-1.5 p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-2">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}

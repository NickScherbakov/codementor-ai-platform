"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  Code2,
  Copy,
  Send,
  Settings,
  Sparkles,
  Trash2,
  User,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

// API base URL for AI console endpoints - configurable for Cloud Run deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState("encouraging");
  const [llmProvider, setLlmProvider] = useState("local");
  const [openrouterModel, setOpenrouterModel] = useState("openai/gpt-4-turbo");
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check backend connection
  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-console/health`, {
        method: "GET",
      });
      setConnectionStatus(response.ok ? "online" : "offline");
    } catch {
      setConnectionStatus("offline");
    }
  }, []);

  // Manual test connection handler
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("checking");
    await checkConnection();
    setIsTestingConnection(false);
  };

  // Auto-check connection on mount and every 30s
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkConnection]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-console/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          personality: personality,
          llmProvider: llmProvider,
          ...(llmProvider === "openrouter" && {
            openrouterModel: openrouterModel,
            openrouterKey: openrouterKey,
          }),
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        setConnectionStatus("online");
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: data.response.message || "No response",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setConnectionStatus("offline");

      let errorText = "Connection failed.";

      // Check if backend is running
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorText =
          "Backend unavailable. Start services: npm start in /backend";
      } else if (llmProvider === "openrouter" && !openrouterKey) {
        errorText = "OpenRouter API key required. Add it in Settings.";
      } else if (llmProvider === "gemini") {
        errorText = "Gemini API error. Check GCP credentials.";
      } else if (llmProvider === "local") {
        errorText =
          "Local AI engine offline. Start: python main.py in /ai-engine";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: errorText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyConversation = () => {
    const text = messages
      .map((m) => `${m.type === "user" ? "You" : "AI"}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const personalityOptions = [
    { value: "encouraging", label: "Encouraging", icon: "😊" },
    { value: "analytical", label: "Analytical", icon: "🧠" },
    { value: "creative", label: "Creative", icon: "🎨" },
    { value: "practical", label: "Practical", icon: "⚙️" },
  ];

  const providerOptions = [
    {
      value: "local",
      label: "Local Models",
      description: "Private • Self-hosted",
      badge: "Default",
    },
    {
      value: "gemini",
      label: "Google Gemini",
      description: "Cloud • Powerful • Free tier",
      badge: "Cloud",
    },
    {
      value: "openrouter",
      label: "OpenRouter",
      description: "Multi-provider access",
      badge: "API",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center rounded-lg shadow-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-mono text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                CodeMentor
              </h1>
              <p className="font-mono text-xs text-slate-500">AI Console</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection Status Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all ${
              connectionStatus === "online"
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-700"
                : connectionStatus === "offline"
                  ? "bg-red-50/80 border-red-200 text-red-700"
                  : "bg-amber-50/80 border-amber-200 text-amber-700"
            }`}
          >
            {connectionStatus === "online" ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : connectionStatus === "offline" ? (
              <WifiOff className="w-3.5 h-3.5" />
            ) : (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            )}
            <span className="font-mono text-xs font-medium hidden sm:inline">
              {connectionStatus === "online"
                ? "Online"
                : connectionStatus === "offline"
                  ? "Offline"
                  : "Checking..."}
            </span>
          </div>

          {/* Test Connection Button */}
          <button
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg border border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
            title="Test backend connection"
          >
            {isTestingConnection ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            <span className="hidden md:inline">Test</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono text-slate-700 hover:text-red-600 hover:bg-red-50/80 rounded-lg border border-slate-200 hover:border-red-200 transition-all backdrop-blur-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono rounded-lg border transition-all ${
              showSettings
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border-slate-200 backdrop-blur-sm"
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
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 overflow-hidden shadow-sm z-10"
          >
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* Personality Selection */}
              <div>
                <label className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 block">
                  Tutor Personality
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {personalityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPersonality(option.value)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 font-mono text-sm font-medium rounded-xl transition-all transform hover:scale-105 ${
                        personality === option.value
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-2"
                          : "bg-white/60 text-slate-700 hover:bg-white border border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LLM Provider */}
              <div>
                <label className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 block">
                  AI Model Provider
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {providerOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLlmProvider(option.value)}
                      className={`relative flex flex-col items-start p-4 rounded-xl text-sm transition-all transform hover:scale-105 ${
                        llmProvider === option.value
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl ring-2 ring-indigo-400 ring-offset-2"
                          : "bg-white/60 text-slate-700 hover:bg-white border border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-2">
                        <span className="font-mono font-semibold">
                          {option.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-mono rounded-full ${
                            llmProvider === option.value
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {option.badge}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-xs ${
                          llmProvider === option.value
                            ? "text-white/80"
                            : "text-slate-500"
                        }`}
                      >
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Gemini Warning */}
                {llmProvider === "gemini" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl backdrop-blur-sm"
                  >
                    <p className="font-mono text-xs text-amber-800">
                      <strong>Note:</strong> Gemini uses server-side API credentials configured in backend environment variables.
                    </p>
                  </motion.div>
                )}

                {/* Local Info */}
                {llmProvider === "local" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-xl backdrop-blur-sm"
                  >
                    <p className="font-mono text-xs text-blue-800">
                      <strong>Local AI Engine:</strong> Running on your machine. Ensure Python AI engine is started.
                    </p>
                  </motion.div>
                )}

                {/* OpenRouter Settings */}
                {llmProvider === "openrouter" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-3 p-4 bg-white/60 border border-slate-200 rounded-xl backdrop-blur-sm shadow-sm"
                  >
                    <div>
                      <label className="font-mono text-xs font-semibold text-slate-700 mb-1.5 block">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={openrouterKey}
                        onChange={(e) => setOpenrouterKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="w-full px-3 py-2.5 bg-white text-slate-900 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs font-semibold text-slate-700 mb-1.5 block">
                        Model
                      </label>
                      <select
                        value={openrouterModel}
                        onChange={(e) => setOpenrouterModel(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white text-slate-900 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition-all"
                      >
                        <option value="openai/gpt-4-turbo">
                          GPT-4 Turbo (OpenAI)
                        </option>
                        <option value="openai/gpt-4">GPT-4 (OpenAI)</option>
                        <option value="anthropic/claude-3-opus">
                          Claude 3 Opus (Anthropic)
                        </option>
                        <option value="anthropic/claude-3-sonnet">
                          Claude 3 Sonnet (Anthropic)
                        </option>
                        <option value="meta-llama/llama-2-70b-chat">
                          Llama 2 70B (Meta)
                        </option>
                        <option value="mistralai/mistral-large">
                          Mistral Large
                        </option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center rounded-2xl shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                AI Console
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed font-mono text-sm">
                Technical assistant. Code review, concept explanation,
                debugging.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-left">
                {[
                  { title: "Code Review", desc: "Get feedback on your code", icon: "💻" },
                  {
                    title: "Explain Concepts",
                    desc: "Learn programming topics",
                    icon: "📚",
                  },
                  { title: "Debug Help", desc: "Solve errors together", icon: "🐛" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setInputValue(`Help me with ${item.title.toLowerCase()}`)
                    }
                    className="p-5 bg-white/60 hover:bg-white backdrop-blur-sm rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all text-left group transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-mono text-sm font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="font-mono text-xs text-slate-600">
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
                <div
                  className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl shadow-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-slate-700 to-slate-900"
                      : "bg-gradient-to-br from-indigo-600 to-purple-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      {message.type === "user" ? "You" : "AI"}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className={`p-4 rounded-xl font-mono text-sm leading-relaxed ${
                    message.type === "user"
                      ? "bg-slate-100/80 text-slate-800 border border-slate-200"
                      : "bg-white/80 backdrop-blur-sm text-slate-700 border border-indigo-100 shadow-sm"
                  }`}>
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
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center rounded-xl shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">
                      AI
                    </span>
                  </div>
                  <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100 shadow-sm">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-200/60 px-4 py-4 shadow-lg z-10">
        <div className="max-w-4xl mx-auto">
          {messages.length > 0 && (
            <div className="flex items-center justify-end gap-2 mb-3">
              <button
                onClick={handleCopyConversation}
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy All
                  </>
                )}
              </button>
            </div>
          )}

          <div className="relative flex items-end gap-3 bg-white rounded-xl border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about programming..."
              disabled={loading}
              rows={1}
              className="flex-1 px-4 py-3.5 bg-transparent text-slate-900 placeholder-slate-400 font-mono text-sm focus:outline-none resize-none max-h-32 overflow-y-auto disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputValue.trim()}
              className="m-2 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 flex-shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="font-mono text-xs text-slate-500 text-center mt-2.5">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-300">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 border border-slate-300">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}

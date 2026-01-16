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
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState("encouraging");
  const [llmProvider, setLlmProvider] = useState("gemini");
  const [openrouterModel, setOpenrouterModel] = useState("openai/gpt-4-turbo");
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "unknown" | "online" | "offline"
  >("unknown");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check backend connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/ai-console/health", {
          method: "GET",
        });
        setConnectionStatus(response.ok ? "online" : "offline");
      } catch {
        setConnectionStatus("offline");
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

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
      const response = await fetch("/api/ai-console/chat", {
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
      value: "gemini",
      label: "Google Gemini",
      description: "Cloud • Powerful • Free tier",
    },
    {
      value: "local",
      label: "Local Models",
      description: "Private • Self-hosted",
    },
    {
      value: "openrouter",
      label: "OpenRouter",
      description: "Multi-provider access",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b-2 border-neutral-900 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-neutral-50" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-mono text-sm font-bold text-neutral-900 uppercase tracking-wider">
                CodeMentor
              </h1>
              <p className="font-mono text-xs text-neutral-500">AI Console</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2 px-2 py-1 border border-neutral-300 bg-white">
            <div
              className={`w-2 h-2 ${
                connectionStatus === "online"
                  ? "bg-green-600"
                  : connectionStatus === "offline"
                    ? "bg-red-600"
                    : "bg-neutral-400"
              }`}
            ></div>
            <span className="font-mono text-xs text-neutral-600 hidden sm:inline">
              {connectionStatus === "online"
                ? "Online"
                : connectionStatus === "offline"
                  ? "Offline"
                  : "Checking..."}
            </span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono border-2 transition-colors ${
              showSettings
                ? "bg-neutral-900 text-neutral-50 border-neutral-900"
                : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 border-neutral-900"
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
            className="border-b-2 border-neutral-900 bg-neutral-100 overflow-hidden"
          >
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              {/* Personality Selection */}
              <div>
                <label className="font-mono text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 block">
                  Tutor Personality
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {personalityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPersonality(option.value)}
                      className={`flex items-center gap-2 px-3 py-2 font-mono text-sm font-medium border-2 transition-all ${
                        personality === option.value
                          ? "bg-neutral-900 text-neutral-50 border-neutral-900"
                          : "bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300"
                      }`}
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LLM Provider */}
              <div>
                <label className="font-mono text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 block">
                  AI Model Provider
                </label>
                <div className="grid sm:grid-cols-3 gap-2">
                  {providerOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLlmProvider(option.value)}
                      className={`flex flex-col items-start p-3 border-2 text-sm transition-all ${
                        llmProvider === option.value
                          ? "bg-neutral-900 text-neutral-50 border-neutral-900"
                          : "bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-300"
                      }`}
                    >
                      <span className="font-mono font-semibold">
                        {option.label}
                      </span>
                      <span
                        className={`font-mono text-xs mt-1 ${
                          llmProvider === option.value
                            ? "text-neutral-400"
                            : "text-neutral-500"
                        }`}
                      >
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>

                {/* OpenRouter Settings */}
                {llmProvider === "openrouter" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2 p-3 bg-white border-2 border-neutral-300"
                  >
                    <input
                      type="password"
                      value={openrouterKey}
                      onChange={(e) => setOpenrouterKey(e.target.value)}
                      placeholder="OpenRouter API Key"
                      className="w-full px-3 py-2 bg-neutral-50 text-neutral-900 font-mono text-sm border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none"
                    />
                    <select
                      value={openrouterModel}
                      onChange={(e) => setOpenrouterModel(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 text-neutral-900 font-mono text-sm border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none"
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
              <div className="w-20 h-20 mx-auto mb-6 bg-neutral-900 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-neutral-50" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                AI Console
              </h2>
              <p className="text-neutral-600 mb-8 leading-relaxed font-mono text-sm">
                Technical assistant. Code review, concept explanation,
                debugging.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-left">
                {[
                  { title: "Code Review", desc: "Get feedback on your code" },
                  {
                    title: "Explain Concepts",
                    desc: "Learn programming topics",
                  },
                  { title: "Debug Help", desc: "Solve errors together" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setInputValue(`Help me with ${item.title.toLowerCase()}`)
                    }
                    className="p-4 bg-white hover:bg-neutral-100 border-2 border-neutral-300 hover:border-neutral-900 transition-all text-left group"
                  >
                    <div className="font-mono text-sm font-semibold text-neutral-900 mb-1">
                      {item.title}
                    </div>
                    <div className="font-mono text-xs text-neutral-600">
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
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${
                    message.type === "user"
                      ? "bg-neutral-900"
                      : "bg-neutral-700"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-neutral-50" />
                  ) : (
                    <Bot className="w-4 h-4 text-neutral-50" />
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-neutral-900">
                      {message.type === "user" ? "You" : "AI"}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-neutral-700 leading-relaxed">
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
                <div className="flex-shrink-0 w-8 h-8 bg-neutral-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-neutral-50" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-neutral-900">
                      AI
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-neutral-900 animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-neutral-900 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-neutral-900 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-neutral-900 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {messages.length > 0 && (
            <div className="flex items-center justify-end gap-2 mb-2">
              <button
                onClick={handleCopyConversation}
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}

          <div className="relative flex items-end gap-3 bg-neutral-50 border-2 border-neutral-300 focus-within:border-neutral-900 transition-all">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about programming..."
              disabled={loading}
              rows={1}
              className="flex-1 px-4 py-3 bg-transparent text-neutral-900 placeholder-neutral-500 font-mono text-sm focus:outline-none resize-none max-h-32 overflow-y-auto disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputValue.trim()}
              className="m-1.5 p-2.5 bg-neutral-900 text-neutral-50 hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="font-mono text-xs text-neutral-500 text-center mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

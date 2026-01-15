/**
 * AI Console API Routes
 * Endpoint for communicating with AI Engine from the web
 */

const express = require("express");
const router = express.Router();

// Mock AI responses (в production будет реальное общение с AI Engine)
class MockAIEngine {
  constructor() {
    this.personality = "encouraging";
    this.context = {
      current_topic: "general programming",
      skill_level: "beginner",
      language: "python",
    };
  }

  generateResponse(message) {
    const responses = {
      "what is a closure": {
        message:
          "A closure is a function that captures variables from its surrounding scope. When you define a function inside another function, the inner function has access to the outer function's variables even after the outer function has returned.",
        suggestions: [
          "Try creating a simple closure in Python",
          'Think about how variables are "remembered"',
        ],
        resources: [
          {
            title: "Python Closures",
            url: "https://docs.python.org/3/faq/programming.html#what-are-closures",
          },
        ],
      },
      default: {
        message: `I'm an AI tutor! I can help you with ${this.context.language} programming. My current personality is ${this.personality}. Ask me anything about ${this.context.current_topic}!`,
        suggestions: [
          "Ask me a programming question",
          "Try /analyze to review code",
        ],
        resources: [],
      },
    };

    const key = message.toLowerCase();
    return responses[key] || responses["default"];
  }

  analyzeCode(code, language) {
    return {
      language: language,
      issues: [
        {
          type: "performance",
          message: "Consider using list comprehension for better performance",
        },
        {
          type: "style",
          message: "Add docstrings to explain function purpose",
        },
      ],
      suggestions: ["Refactor nested loops", "Add type hints"],
      score: 75,
    };
  }

  setPersonality(personality) {
    this.personality = personality;
    return true;
  }

  setContext(key, value) {
    if (this.context[key] !== undefined) {
      this.context[key] = value;
      return true;
    }
    return false;
  }

  getContext() {
    return this.context;
  }
}

// Initialize AI Engine
const aiEngine = new MockAIEngine();

// Chat endpoint
router.post("/api/ai-console/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = aiEngine.generateResponse(message);

    res.json({
      success: true,
      response: response,
      context: aiEngine.getContext(),
      personality: aiEngine.personality,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Code analysis endpoint
router.post("/api/ai-console/analyze", (req, res) => {
  try {
    const { code, language = "python" } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const analysis = aiEngine.analyzeCode(code, language);

    res.json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set personality
router.post("/api/ai-console/personality", (req, res) => {
  try {
    const { personality } = req.body;
    const valid = ["encouraging", "analytical", "creative", "practical"];

    if (!personality || !valid.includes(personality)) {
      return res.status(400).json({ error: "Invalid personality" });
    }

    aiEngine.setPersonality(personality);

    res.json({
      success: true,
      personality: personality,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set context
router.post("/api/ai-console/context", (req, res) => {
  try {
    const { key, value } = req.body;

    if (!aiEngine.setContext(key, value)) {
      return res.status(400).json({ error: `Invalid context key: ${key}` });
    }

    res.json({
      success: true,
      context: aiEngine.getContext(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get context
router.get("/api/ai-console/context", (req, res) => {
  res.json({
    success: true,
    context: aiEngine.getContext(),
    personality: aiEngine.personality,
  });
});

module.exports = router;

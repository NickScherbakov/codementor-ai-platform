/**
 * AI Console API Routes
 * Endpoint for communicating with AI Engine from the web
 * Supports: Google Gemini, Local Models, OpenRouter
 */

const express = require("express");
const router = express.Router();

// Google Gemini Provider
class GeminiProvider {
  async chat(message, personality, context) {
    try {
      const { VertexAI } = require("@google-cloud/vertexai");
      const projectId = process.env.GCP_PROJECT_ID || "codementor-ai-platform";
      const location = process.env.GCP_LOCATION || "us-central1";

      const vertexAI = new VertexAI({ project: projectId, location });
      const model = vertexAI.getGenerativeModel({
        model: "gemini-pro",
      });

      const personalityPrompt = {
        encouraging:
          "You are an encouraging programming tutor. Be supportive and positive.",
        analytical:
          "You are an analytical tutor. Focus on precision and logical reasoning.",
        creative:
          "You are a creative tutor. Encourage innovative solutions.",
        practical:
          "You are a practical tutor. Focus on real-world applications.",
      };

      const systemPrompt =
        personalityPrompt[personality] ||
        personalityPrompt.encouraging;

      const request = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }],
          },
        ],
      };

      const response = await model.generateContent(request);
      const responseText =
        response.response.candidates[0].content.parts[0].text;

      return {
        message: responseText,
        suggestions: ["Ask another question", "Request code review"],
        resources: [],
      };
    } catch (error) {
      console.error("Gemini error:", error);
      throw new Error("Gemini API failed");
    }
  }
}

// OpenRouter Provider
class OpenRouterProvider {
  async chat(message, personality, context, apiKey, model) {
    try {
      if (!apiKey) {
        throw new Error("OpenRouter API key not provided");
      }

      const personalitySystem = {
        encouraging:
          "You are an encouraging programming tutor. Be supportive and positive.",
        analytical:
          "You are an analytical tutor. Focus on precision and logical reasoning.",
        creative:
          "You are a creative tutor. Encourage innovative solutions.",
        practical:
          "You are a practical tutor. Focus on real-world applications.",
      };

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://codementor-ai-platform.vercel.app",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "openai/gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: personalitySystem[personality] || personalitySystem.encouraging,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        message: data.choices[0].message.content,
        suggestions: ["Ask another question", "Request code review"],
        resources: [],
      };
    } catch (error) {
      console.error("OpenRouter error:", error);
      throw new Error("OpenRouter API failed: " + error.message);
    }
  }
}

// Local Models Provider
class LocalModelsProvider {
  async chat(message, personality, context) {
    try {
      // Call local Python AI Engine
      const pythonBackendUrl = process.env.PYTHON_AI_ENGINE_URL || "http://localhost:5000";

      const personalityPrompts = {
        encouraging:
          "You are an encouraging programming tutor. Be supportive and positive.",
        analytical:
          "You are an analytical tutor. Focus on precision and logical reasoning.",
        creative:
          "You are a creative tutor. Encourage innovative solutions.",
        practical:
          "You are a practical tutor. Focus on real-world applications.",
      };

      const response = await fetch(`${pythonBackendUrl}/api/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          personality: personality,
          system_prompt: personalityPrompts[personality],
          context: context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Local AI engine returned ${response.status}`);
      }

      const data = await response.json();

      return {
        message: data.response || data.message,
        suggestions: data.suggestions || ["Ask another question"],
        resources: data.resources || [],
      };
    } catch (error) {
      console.error("Local models error:", error);
      // Fallback to mock
      return this.mockResponse(message, personality);
    }
  }

  mockResponse(message, personality) {
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
        message: `Hello! I'm your AI tutor (local mode). I can help you with programming questions. My current mode is: ${personality}. What would you like to learn?`,
        suggestions: ["Ask me a programming question", "Try code analysis"],
        resources: [],
      },
    };

    const key = message.toLowerCase();
    return responses[key] || responses.default;
  }
}

// Initialize providers
const providers = {
  gemini: new GeminiProvider(),
  local: new LocalModelsProvider(),
  openrouter: new OpenRouterProvider(),
};

// Chat endpoint with provider selection
router.post("/api/ai-console/chat", async (req, res) => {
  try {
    const {
      message,
      personality = "encouraging",
      llmProvider = "local",
      openrouterModel,
      openrouterKey,
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    let response;
    const context = {
      current_topic: "general programming",
      skill_level: "beginner",
      language: "python",
    };

    switch (llmProvider) {
      case "gemini":
        response = await providers.gemini.chat(message, personality, context);
        break;

      case "openrouter":
        if (!openrouterKey) {
          return res.status(400).json({
            error: "OpenRouter API key is required for this provider",
          });
        }
        response = await providers.openrouter.chat(
          message,
          personality,
          context,
          openrouterKey,
          openrouterModel
        );
        break;

      case "local":
      default:
        response = await providers.local.chat(message, personality, context);
    }

    res.json({
      success: true,
      response: response,
      context: context,
      personality: personality,
      provider: llmProvider,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error.message,
      success: false,
    });
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

function getNodeEnv() {
  return process.env.NODE_ENV || "development";
}

function isProduction() {
  return getNodeEnv() === "production";
}

let hasWarnedAboutDevelopmentJwtSecret = false;

function getEnv(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function requireEnv(name, { developmentFallback } = {}) {
  const configured = getEnv(name);
  if (configured) {
    return configured;
  }

  if (!isProduction() && developmentFallback) {
    return developmentFallback;
  }

  throw new Error(`${name} must be configured${isProduction() ? " in production" : ""}.`);
}

function getJwtSecret() {
  const secret = requireEnv("JWT_SECRET", {
    developmentFallback: "dev-jwt-secret-change-me",
  });

  if (secret === "dev-jwt-secret-change-me") {
    if (hasWarnedAboutDevelopmentJwtSecret) {
      return secret;
    }

    hasWarnedAboutDevelopmentJwtSecret = true;
    console.warn("[runtime] Using the development JWT secret fallback. Set JWT_SECRET explicitly before sharing this environment.");
  }

  return secret;
}

function getMongoUri() {
  return requireEnv("MONGODB_URI", {
    developmentFallback: "mongodb://localhost:27017/codementor-ai",
  });
}

function getAiEngineUrl() {
  return (
    getEnv("PYTHON_AI_ENGINE_URL") ||
    getEnv("AI_ENGINE_URL") ||
    (!isProduction() ? "http://localhost:5000" : undefined)
  );
}

function getPublicAppUrl() {
  return (
    getEnv("PUBLIC_APP_URL") ||
    getEnv("FRONTEND_URL") ||
    (!isProduction() ? "http://localhost:3000" : undefined)
  );
}

function getAllowedOrigins() {
  const configured = getEnv("ALLOWED_ORIGINS") || getEnv("FRONTEND_URL") || getEnv("PUBLIC_APP_URL");

  if (!configured) {
    if (!isProduction()) {
      return ["http://localhost:3000"];
    }

    throw new Error("ALLOWED_ORIGINS, FRONTEND_URL, or PUBLIC_APP_URL must be configured in production.");
  }

  return configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function redactConnectionString(value) {
  return value.replace(/\/\/([^/@]+)@/, "//***@");
}

module.exports = {
  getAiEngineUrl,
  getAllowedOrigins,
  getJwtSecret,
  getMongoUri,
  getNodeEnv,
  getPublicAppUrl,
  redactConnectionString,
};

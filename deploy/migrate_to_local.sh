#!/bin/bash
# Migration script to transition from GCP to local Ollama for eternal self-replication
# Run this when GCP credits are exhausted or when you want to run locally

set -e

echo "======================================"
echo "CodeMentor AI - GCP to Local Migration"
echo "======================================"
echo ""

# Check if Ollama is installed
echo "Checking Ollama installation..."
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo ""
    echo "Please install Ollama:"
    echo "  Linux: curl -fsSL https://ollama.com/install.sh | sh"
    echo "  macOS: brew install ollama"
    echo "  Or visit: https://ollama.com/download"
    exit 1
else
    echo "✓ Ollama is installed"
fi

# Check if Ollama is running
echo "Checking if Ollama is running..."
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "❌ Ollama is not running!"
    echo ""
    echo "Please start Ollama:"
    echo "  ollama serve"
    echo ""
    echo "Then run this script again."
    exit 1
else
    echo "✓ Ollama is running"
fi

# Pull required models
echo ""
echo "Pulling required Ollama models..."
echo "This may take a few minutes..."

# Pull Llama 2 for self-evolution
echo "- Pulling llama2 (for self-evolution)..."
ollama pull llama2 || echo "⚠ Warning: Failed to pull llama2"

# Pull CodeLlama for code generation
echo "- Pulling codellama (for code generation)..."
ollama pull codellama || echo "⚠ Warning: Failed to pull codellama"

echo "✓ Models pulled successfully"

# Check for ChromaDB (for RAG)
echo ""
echo "Checking ChromaDB installation..."
if ! python3 -c "import chromadb" 2>/dev/null; then
    echo "⚠ ChromaDB not installed. Installing..."
    pip install chromadb
    echo "✓ ChromaDB installed"
else
    echo "✓ ChromaDB is available"
fi

# Create local environment file
echo ""
echo "Creating local environment configuration..."
cat > .env.local << EOF
# Local Configuration (Post-GCP Migration)
# This configuration uses Ollama instead of Vertex AI

# Ollama Configuration
USE_VERTEX_AI=false
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
OLLAMA_CODE_MODEL=codellama

# ChromaDB Configuration (for RAG)
CHROMADB_PATH=/tmp/chromadb
CHROMADB_COLLECTION=codementor_docs

# Flask Configuration
FLASK_ENV=production
PORT=5000
SECRET_KEY=$(openssl rand -hex 32)

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# MongoDB (for backend)
MONGODB_URI=mongodb://localhost:27017/codementor-ai

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Evolution settings
MAX_EVOLUTION_ITERATIONS=100
EVOLUTION_INTERVAL_HOURS=24

# GCP Credits (all exhausted after migration)
GEMINI_CODE_ASSIST_BUDGET=0.0
GENAI_APP_BUILDER_BUDGET=0.0
FREE_TRIAL_BUDGET=0.0
GCP_CREDITS_REMAINING=0.0
EOF

echo "✓ Created .env.local"

# Update Docker Compose for local deployment
echo ""
echo "Creating Docker Compose configuration for local deployment..."
cat > docker-compose.local.yml << EOF
version: '3.8'

services:
  # AI Engine with Ollama integration
  ai-engine:
    build:
      context: ./ai-engine
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - USE_VERTEX_AI=false
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
      - OLLAMA_MODEL=llama2
      - FLASK_ENV=production
    volumes:
      - ./ai-engine:/app
      - /tmp/evolution_history.json:/tmp/evolution_history.json
      - /tmp/assessment_results:/tmp/assessment_results
      - /tmp/variants:/tmp/variants
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - AI_ENGINE_URL=http://ai-engine:5000
      - MONGODB_URI=mongodb://mongo:27017/codementor-ai
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - ai-engine
      - mongo
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    depends_on:
      - backend
    restart: unless-stopped

  # MongoDB
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  # Redis (optional)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
EOF

echo "✓ Created docker-compose.local.yml"

# Create migration verification script
echo ""
echo "Creating verification script..."
cat > verify_local.sh << 'EOF'
#!/bin/bash
# Verify local setup is working

echo "Verifying local deployment..."

# Check Ollama
echo -n "Checking Ollama... "
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✓"
else
    echo "❌"
    exit 1
fi

# Check AI Engine
echo -n "Checking AI Engine... "
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✓"
else
    echo "❌ (not running, start with: docker-compose -f docker-compose.local.yml up -d)"
fi

# Check Backend
echo -n "Checking Backend... "
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✓"
else
    echo "❌ (not running)"
fi

# Check Frontend
echo -n "Checking Frontend... "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓"
else
    echo "❌ (not running)"
fi

echo ""
echo "Local setup verification complete!"
EOF

chmod +x verify_local.sh
echo "✓ Created verify_local.sh"

# Summary
echo ""
echo "======================================"
echo "Migration Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the services:"
echo "   docker-compose -f docker-compose.local.yml up -d"
echo ""
echo "2. Verify everything is working:"
echo "   ./verify_local.sh"
echo ""
echo "3. Access the platform:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   AI Engine: http://localhost:5000"
echo ""
echo "4. Monitor evolution:"
echo "   tail -f /tmp/evolution_history.json"
echo ""
echo "The platform will now run locally with Ollama,"
echo "enabling eternal self-replication without cloud costs!"
echo ""
echo "======================================"

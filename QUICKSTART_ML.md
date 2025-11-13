# Quick Start Guide - Custom ML Models

This guide will help you set up and run the CodeMentor AI platform with custom ML models (no OpenAI API key required!).

## Prerequisites

- Python 3.9 or higher
- 4GB+ available RAM
- 5GB+ free disk space
- Internet connection (for initial model download)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/NickScherbakov/codementor-ai-platform.git
cd codementor-ai-platform

# Install AI engine dependencies
cd ai-engine
pip install -r requirements.txt
```

## Step 2: Download ML Models

Run the model initialization script (one-time setup):

```bash
python init_models.py
```

This will download:
- ✓ TinyLlama-1.1B-Chat (~2.2GB) - for AI tutor
- ✓ CodeT5-Small (~500MB) - for code analysis

**Time required**: 5-15 minutes depending on internet speed

The models are cached locally in `/tmp/model_cache` (or your custom `MODEL_CACHE_DIR`) and only need to be downloaded once.

## Step 3: Configure Environment

```bash
# Copy the environment template
cd ..
cp .env.example .env

# Edit .env (OpenAI API key is NO LONGER REQUIRED!)
# Just configure MongoDB and Redis if needed
```

**Minimal .env configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/codementor-ai
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secure-random-string
```

## Step 4: Start the Services

### Option A: Run AI Engine Only

```bash
cd ai-engine
python main.py
```

The AI engine will start on http://localhost:5000

### Option B: Run Full Stack with Docker

```bash
# From project root
docker-compose up --build
```

This starts:
- Frontend (Next.js) on http://localhost:3000
- Backend (Node.js) on http://localhost:3001
- AI Engine (Flask) on http://localhost:5000
- MongoDB, Redis, and other services

## Step 5: Test the API

### Test AI Tutor Chat

```bash
curl -X POST http://localhost:5000/ai-tutor/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I reverse a string in Python?",
    "context": {"current_topic": "strings"},
    "personality": "encouraging"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "response": {
    "message": "Great question! To reverse a string in Python...",
    "suggestions": ["Consider edge cases", "Write test cases"],
    "resources": [...],
    "model_used": "TinyLlama-1.1B"
  }
}
```

### Test Code Analysis

```bash
curl -X POST http://localhost:5000/code/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def add(a, b):\n    return a + b",
    "language": "python"
  }'
```

### Test Health Check

```bash
curl http://localhost:5000/health
```

## Troubleshooting

### Issue: "No module named 'torch'"

**Solution**: Install dependencies
```bash
cd ai-engine
pip install -r requirements.txt
```

### Issue: "Failed to load chat model"

**Solution**: Re-run model initialization
```bash
cd ai-engine
python init_models.py
```

### Issue: Out of memory

**Solutions**:
1. Close other applications
2. Use a machine with more RAM (4GB minimum)
3. Reduce workers in docker-compose.yml

### Issue: Models download too slowly

**Solutions**:
1. Check internet connection
2. Wait patiently (first download takes 5-15 min)
3. Models are cached - only download once

### Issue: Port 5000 already in use

**Solution**: Change port in .env
```env
AI_ENGINE_PORT=5001
```

Then start with:
```bash
PORT=5001 python main.py
```

## Performance Tips

### CPU Optimization
- Uses PyTorch CPU backend by default
- Expected latency: 1-3 seconds per request
- Suitable for development and moderate production use

### GPU Acceleration (Optional)
For production with high traffic, use GPU:

```bash
# Install CUDA-enabled PyTorch
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

**GPU benefits**:
- 3-5x faster inference
- <1 second per request
- Can handle more concurrent users

## What's Different from OpenAI?

| Feature | OpenAI API | Custom Models |
|---------|-----------|---------------|
| **Cost** | $0.002 per 1K tokens | $0 per request |
| **Setup** | API key only | Model download required |
| **Latency** | 2-5 seconds | 1-3 seconds (CPU) |
| **Privacy** | Data sent to OpenAI | All local |
| **Customization** | Limited | Fully customizable |
| **Dependency** | Internet required | Offline capable |

## Next Steps

1. ✓ Models downloaded and cached
2. ✓ AI engine running
3. ✓ API endpoints tested

**Now you can**:
- Integrate with the frontend
- Test the AI tutor chat
- Analyze student code
- Generate coding challenges
- All without external API costs!

## Resources

- **Documentation**: `ai-engine/README.md`
- **Migration Guide**: `ai-engine/MIGRATION.md`
- **API Reference**: `docs/api/README.md`
- **Model Details**: `ai-engine/models.py`

## Support

Having issues? Run the validation script:

```bash
cd ai-engine
python validate_code.py
```

This checks:
- ✓ Python syntax
- ✓ Import correctness
- ✓ OpenAI removal
- ✓ Custom model integration

## Success Indicators

You're ready when you see:

```
✓ All models downloaded and cached successfully!
✓ Chat model loaded successfully
✓ Code model loaded successfully
INFO: Starting CodeMentor AI Engine on port 5000
```

## Cost Savings Calculator

**Before (OpenAI API)**:
- 1,000 chat requests/day = $1/day = $30/month = $360/year
- 10,000 chat requests/day = $10/day = $300/month = $3,600/year

**After (Custom Models)**:
- Unlimited requests = $0/month = $0/year
- Only infrastructure costs (server/hosting)

**Savings**: 100% of API costs!

---

**You're all set!** 🚀

The CodeMentor AI platform now runs entirely with custom ML models, reducing costs while maintaining quality.

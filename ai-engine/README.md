# CodeMentor AI - Intelligent Programming Learning Platform

## Python AI Engine for Personalized Learning

This microservice powers the intelligent features of CodeMentor AI, including:
- Adaptive challenge generation
- Personalized learning path recommendations
- Code analysis and feedback
- AI-powered tutoring system

### Features

- **Adaptive Challenge Generation**: Creates personalized coding challenges based on user skill level
- **Code Analysis**: Analyzes student code for patterns, errors, and improvements
- **Learning Path Optimization**: Recommends optimal learning sequences
- **Natural Language Processing**: Powers conversational AI tutors
- **Custom ML Models**: Uses locally-hosted models instead of expensive third-party APIs

### Custom ML Models

**No OpenAI API Key Required!** This engine now uses custom, lightweight ML models:

- **Chat Model**: TinyLlama-1.1B-Chat (1.1B parameters) - Fast, efficient conversational AI
- **Code Analysis**: CodeT5-Small - Specialized for code understanding and suggestions
- **Local Inference**: All models run locally, reducing costs and improving privacy

### Requirements

- Python 3.9+
- PyTorch 2.x
- Transformers (Hugging Face)
- TensorFlow 2.x
- scikit-learn
- Redis (for caching)
- ~4GB disk space for model cache
- **No OpenAI API Key required!**

### Installation

```bash
cd ai-engine
pip install -r requirements.txt
```

### Model Setup

Download and cache the required models (first time only):

```bash
python init_models.py
```

This will download:
- TinyLlama-1.1B-Chat model (~2.2GB)
- CodeT5-Small model (~500MB)

Models are cached locally and only need to be downloaded once.

### Configuration

Create a `.env` file (OpenAI key no longer needed):

```
REDIS_URL=redis://localhost:6379
DATABASE_URL=your_database_url
MODEL_CACHE_DIR=/path/to/model/cache  # Optional, defaults to /tmp/model_cache
```

### Running the Service

```bash
python main.py
```

The AI engine will start on port 5000 and expose REST API endpoints for the main application.

### API Endpoints

- `POST /ai-tutor/chat` - AI tutor conversational interface (uses TinyLlama)
- `POST /code/analyze` - Code analysis with AI insights (uses CodeT5)
- `POST /challenges/generate` - Adaptive challenge generation
- `POST /learning-path/recommend` - Personalized learning paths
- `GET /health` - Health check

### Performance

- **Latency**: ~1-3 seconds per request (CPU), <1 second (GPU)
- **Memory**: ~2-4GB RAM for model loading
- **Cost**: $0 per request (no API fees!)

### GPU Support (Optional)

For faster inference, use a GPU:

```bash
# Install CUDA-enabled PyTorch
pip install torch --index-url https://download.pytorch.org/whl/cu118
```

The engine automatically detects and uses GPU if available.
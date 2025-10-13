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
- **Machine Learning Models**: Tracks learning patterns and predicts outcomes

### Requirements

- Python 3.9+
- TensorFlow 2.x
- scikit-learn
- OpenAI API key (for advanced AI features)
- Redis (for caching)

### Installation

```bash
cd ai-engine
pip install -r requirements.txt
```

### Configuration

Create a `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
REDIS_URL=redis://localhost:6379
DATABASE_URL=your_database_url
```

### Running the Service

```bash
python main.py
```

The AI engine will start on port 5000 and expose REST API endpoints for the main application.
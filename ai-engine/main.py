"""
CodeMentor AI - Python AI Engine
Main Flask application for AI-powered learning features
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import redis
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging
os.environ.setdefault("TRANSFORMERS_NO_TF", "1")
os.environ.setdefault("TRANSFORMERS_NO_TORCHVISION", "1")
from models import get_custom_tutor, get_custom_analyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
# Note: OpenAI API key is no longer required - using custom ML models

# Initialize Redis for caching
try:
    redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))
    redis_client.ping()
    logger.info("Connected to Redis")
except Exception as e:
    logger.warning(f"Redis connection failed: {e}")
    redis_client = None

class AITutor:
    """AI Tutor system for personalized learning assistance"""
    
    def __init__(self):
        self.personality_prompts = {
            'encouraging': "You are an encouraging and supportive programming tutor. Always stay positive and help students build confidence.",
            'analytical': "You are a precise and analytical programming tutor. Focus on logical problem-solving and detailed explanations.",
            'creative': "You are a creative and innovative programming tutor. Encourage out-of-the-box thinking and creative solutions.",
            'practical': "You are a practical and results-oriented programming tutor. Focus on real-world applications and industry best practices."
        }
    
    def generate_response(self, user_message, context, personality='encouraging'):
        """Generate AI tutor response based on user input and context"""
        try:
            # Use custom local ML model instead of OpenAI
            custom_tutor = get_custom_tutor()
            response = custom_tutor.generate_response(user_message, context, personality)
            
            return response
            
        except Exception as e:
            logger.error(f"AI tutor error: {e}")
            return {
                'message': "I apologize, but I'm having trouble processing your request right now. Please try again later.",
                'suggestions': [],
                'resources': []
            }
    
    def _extract_suggestions(self, response_text):
        """Extract actionable suggestions from AI response"""
        # Simple keyword-based suggestion extraction
        suggestions = []
        
        if 'loop' in response_text.lower():
            suggestions.append("Consider using appropriate loop structures")
        if 'function' in response_text.lower():
            suggestions.append("Break down the problem into smaller functions")
        if 'variable' in response_text.lower():
            suggestions.append("Use descriptive variable names")
        if 'test' in response_text.lower():
            suggestions.append("Write test cases to verify your solution")
            
        return suggestions[:3]  # Return top 3 suggestions
    
    def _recommend_resources(self, user_message, context):
        """Recommend learning resources based on context"""
        resources = []
        
        # Analyze the user's question for topics
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ['loop', 'for', 'while']):
            resources.append({
                'title': 'Mastering Loops in Programming',
                'url': '/learn/concepts/loops',
                'type': 'tutorial'
            })
        
        if any(word in message_lower for word in ['function', 'method', 'def']):
            resources.append({
                'title': 'Functions and Code Organization',
                'url': '/learn/concepts/functions',
                'type': 'tutorial'
            })
        
        if any(word in message_lower for word in ['algorithm', 'complexity']):
            resources.append({
                'title': 'Algorithm Design and Analysis',
                'url': '/learn/algorithms/intro',
                'type': 'course'
            })
        
        return resources

class ChallengeGenerator:
    """Generate adaptive programming challenges"""
    
    def __init__(self):
        self.difficulty_multipliers = {
            'beginner': 0.5,
            'intermediate': 1.0,
            'advanced': 1.5,
            'expert': 2.0
        }
    
    def generate_challenge(self, user_level, language, topic, learning_goals):
        """Generate a personalized coding challenge"""
        try:
            # Base challenge templates
            challenge_templates = self._get_challenge_templates(topic, language)
            
            # Select appropriate difficulty
            difficulty_score = self._calculate_difficulty_score(user_level, learning_goals)
            
            # Generate challenge using AI
            challenge = self._create_adaptive_challenge(challenge_templates, difficulty_score, language, topic)
            
            return challenge
            
        except Exception as e:
            logger.error(f"Challenge generation error: {e}")
            return self._get_fallback_challenge(language, topic)
    
    def _get_challenge_templates(self, topic, language):
        """Get challenge templates for specific topics and languages"""
        templates = {
            'arrays': {
                'easy': 'Find the maximum element in an array',
                'medium': 'Rotate an array by k positions',
                'hard': 'Find the longest increasing subsequence'
            },
            'strings': {
                'easy': 'Check if a string is a palindrome',
                'medium': 'Find all anagrams in a string',
                'hard': 'Implement string pattern matching'
            },
            'algorithms': {
                'easy': 'Implement binary search',
                'medium': 'Sort an array using merge sort',
                'hard': 'Find shortest path in a graph'
            }
        }
        
        return templates.get(topic, templates['arrays'])
    
    def _calculate_difficulty_score(self, user_level, learning_goals):
        """Calculate appropriate difficulty based on user profile"""
        base_score = {
            'beginner': 1,
            'intermediate': 3,
            'advanced': 5,
            'expert': 7
        }.get(user_level, 3)
        
        # Adjust based on learning goals
        if 'challenge_seeking' in learning_goals:
            base_score += 1
        if 'confidence_building' in learning_goals:
            base_score -= 1
            
        return max(1, min(7, base_score))
    
    def _create_adaptive_challenge(self, templates, difficulty_score, language, topic):
        """Create adaptive challenge using templates and AI"""
        # This would integrate with OpenAI to generate unique challenges
        # For now, return a structured challenge
        
        difficulty_map = {1: 'easy', 2: 'easy', 3: 'medium', 4: 'medium', 5: 'hard', 6: 'hard', 7: 'expert'}
        difficulty = difficulty_map.get(difficulty_score, 'medium')
        
        return {
            'id': f"challenge_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'title': f"{topic.title()} Challenge - {difficulty.title()}",
            'description': templates.get(difficulty, templates['medium']),
            'difficulty': difficulty,
            'language': language,
            'topic': topic,
            'starter_code': self._generate_starter_code(language, topic, difficulty),
            'test_cases': self._generate_test_cases(topic, difficulty),
            'hints': self._generate_hints(topic, difficulty),
            'estimated_time': self._estimate_completion_time(difficulty),
            'xp_reward': self._calculate_xp_reward(difficulty_score)
        }
    
    def _generate_starter_code(self, language, topic, difficulty):
        """Generate appropriate starter code"""
        starters = {
            'python': {
                'arrays': 'def solve_array_problem(arr):\n    # Your code here\n    pass',
                'strings': 'def solve_string_problem(s):\n    # Your code here\n    pass'
            },
            'javascript': {
                'arrays': 'function solveArrayProblem(arr) {\n    // Your code here\n}',
                'strings': 'function solveStringProblem(s) {\n    // Your code here\n}'
            }
        }
        
        return starters.get(language, {}).get(topic, '// Start coding here')
    
    def _generate_test_cases(self, topic, difficulty):
        """Generate test cases for the challenge"""
        # This would be more sophisticated in a real implementation
        return [
            {'input': 'example_input', 'expected_output': 'example_output', 'hidden': False},
            {'input': 'test_input_1', 'expected_output': 'test_output_1', 'hidden': True},
            {'input': 'test_input_2', 'expected_output': 'test_output_2', 'hidden': True}
        ]
    
    def _generate_hints(self, topic, difficulty):
        """Generate progressive hints"""
        return [
            {'text': 'Think about the problem step by step', 'order': 1, 'xp_cost': 5},
            {'text': 'Consider using a specific algorithm or data structure', 'order': 2, 'xp_cost': 10},
            {'text': 'Look at the edge cases carefully', 'order': 3, 'xp_cost': 15}
        ]
    
    def _estimate_completion_time(self, difficulty):
        """Estimate completion time based on difficulty"""
        time_map = {
            'easy': '10-15 minutes',
            'medium': '20-30 minutes',
            'hard': '45-60 minutes',
            'expert': '60+ minutes'
        }
        return time_map.get(difficulty, '20-30 minutes')
    
    def _calculate_xp_reward(self, difficulty_score):
        """Calculate XP reward based on difficulty"""
        return difficulty_score * 25
    
    def _get_fallback_challenge(self, language, topic):
        """Return a fallback challenge if generation fails"""
        return {
            'id': 'fallback_challenge',
            'title': f'Basic {topic.title()} Challenge',
            'description': f'Solve a basic {topic} problem in {language}',
            'difficulty': 'medium',
            'language': language,
            'topic': topic,
            'starter_code': f'# Write your {language} solution here',
            'test_cases': [],
            'hints': [],
            'estimated_time': '20-30 minutes',
            'xp_reward': 50
        }

class CodeAnalyzer:
    """Analyze code for feedback and suggestions"""
    
    def analyze_code(self, code, language, challenge_context=None):
        """Analyze submitted code and provide feedback"""
        try:
            # Get custom analyzer for AI-enhanced analysis
            custom_analyzer = get_custom_analyzer()
            
            analysis = {
                'syntax_errors': self._check_syntax(code, language),
                'code_quality': self._analyze_quality(code, language),
                'performance': self._analyze_performance(code, language),
                'best_practices': self._check_best_practices(code, language),
                'suggestions': self._generate_suggestions(code, language, challenge_context)
            }
            
            # Add AI-powered analysis if available
            try:
                ai_analysis = custom_analyzer.analyze_with_ai(code, language)
                analysis['ai_insights'] = ai_analysis
            except Exception as e:
                logger.warning(f"AI analysis unavailable: {e}")
                analysis['ai_insights'] = {
                    'ai_analysis': 'AI analysis temporarily unavailable',
                    'confidence': 0.0,
                    'model_used': 'none'
                }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Code analysis error: {e}")
            return {'error': 'Analysis failed', 'details': str(e)}
    
    def _check_syntax(self, code, language):
        """Check for syntax errors"""
        errors = []
        
        if language == 'python':
            try:
                compile(code, '<string>', 'exec')
            except SyntaxError as e:
                errors.append({
                    'line': e.lineno,
                    'message': e.msg,
                    'type': 'syntax_error'
                })
        
        return errors
    
    def _analyze_quality(self, code, language):
        """Analyze code quality metrics"""
        return {
            'readability_score': self._calculate_readability(code),
            'complexity_score': self._calculate_complexity(code),
            'maintainability_score': self._calculate_maintainability(code)
        }
    
    def _analyze_performance(self, code, language):
        """Analyze code performance characteristics"""
        return {
            'time_complexity': 'O(n)',  # This would be more sophisticated
            'space_complexity': 'O(1)',
            'optimization_opportunities': []
        }
    
    def _check_best_practices(self, code, language):
        """Check adherence to best practices"""
        issues = []
        
        if language == 'python':
            if 'import *' in code:
                issues.append('Avoid wildcard imports')
            if len([line for line in code.split('\n') if line.strip()]) > 50:
                issues.append('Consider breaking down into smaller functions')
        
        return issues
    
    def _generate_suggestions(self, code, language, context):
        """Generate improvement suggestions"""
        suggestions = []
        
        # Basic suggestions based on code patterns
        if 'for i in range(len(' in code:
            suggestions.append('Consider using enumerate() instead of range(len())')
        
        if language == 'python' and 'print(' in code:
            suggestions.append('Remove debug print statements for production code')
        
        return suggestions
    
    def _calculate_readability(self, code):
        """Calculate readability score (0-100)"""
        # Simple readability calculation
        lines = code.split('\n')
        avg_line_length = sum(len(line) for line in lines) / max(len(lines), 1)
        
        # Penalize very long lines
        if avg_line_length > 80:
            return max(50, 100 - (avg_line_length - 80) * 2)
        return min(100, 80 + avg_line_length / 4)
    
    def _calculate_complexity(self, code):
        """Calculate cyclomatic complexity"""
        # Simple complexity calculation
        complexity_keywords = ['if', 'elif', 'else', 'for', 'while', 'try', 'except', 'with']
        complexity = 1  # Base complexity
        
        for keyword in complexity_keywords:
            complexity += code.count(keyword)
        
        return min(10, complexity)
    
    def _calculate_maintainability(self, code):
        """Calculate maintainability score"""
        lines = len([line for line in code.split('\n') if line.strip()])
        
        # Penalize very long functions
        if lines > 50:
            return max(30, 100 - (lines - 50) * 2)
        
        return min(100, 70 + lines)

# Initialize AI components
ai_tutor = AITutor()
challenge_generator = ChallengeGenerator()
code_analyzer = CodeAnalyzer()

# API Routes

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/ai-tutor/chat', methods=['POST'])
def ai_tutor_chat():
    """Handle AI tutor chat interactions"""
    try:
        data = request.get_json()
        
        user_message = data.get('message', '')
        context = data.get('context', {})
        personality = data.get('personality', 'encouraging')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        response = ai_tutor.generate_response(user_message, context, personality)
        
        return jsonify({
            'success': True,
            'response': response
        })
        
    except Exception as e:
        logger.error(f"AI tutor chat error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/challenges/generate', methods=['POST'])
def generate_challenge():
    """Generate adaptive programming challenge"""
    try:
        data = request.get_json()
        
        user_level = data.get('user_level', 'intermediate')
        language = data.get('language', 'python')
        topic = data.get('topic', 'arrays')
        learning_goals = data.get('learning_goals', [])
        
        challenge = challenge_generator.generate_challenge(user_level, language, topic, learning_goals)
        
        # Cache the challenge
        if redis_client and challenge.get('id'):
            redis_client.setex(f"challenge:{challenge['id']}", 3600, json.dumps(challenge))
        
        return jsonify({
            'success': True,
            'challenge': challenge
        })
        
    except Exception as e:
        logger.error(f"Challenge generation error: {e}")
        return jsonify({'error': 'Failed to generate challenge'}), 500

@app.route('/code/analyze', methods=['POST'])
def analyze_code():
    """Analyze submitted code"""
    try:
        data = request.get_json()
        
        code = data.get('code', '')
        language = data.get('language', 'python')
        challenge_context = data.get('challenge_context')
        
        if not code:
            return jsonify({'error': 'Code is required'}), 400
        
        analysis = code_analyzer.analyze_code(code, language, challenge_context)
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        logger.error(f"Code analysis error: {e}")
        return jsonify({'error': 'Analysis failed'}), 500

@app.route('/learning-path/recommend', methods=['POST'])
def recommend_learning_path():
    """Recommend personalized learning path"""
    try:
        data = request.get_json()
        
        user_profile = data.get('user_profile', {})
        goals = data.get('goals', [])
        time_commitment = data.get('time_commitment', 'moderate')
        
        # This would use ML models to recommend optimal learning paths
        recommendations = {
            'suggested_path': 'Full Stack Web Development',
            'modules': [
                {
                    'name': 'HTML & CSS Basics',
                    'estimated_duration': '2 weeks',
                    'difficulty': 'beginner'
                },
                {
                    'name': 'JavaScript Fundamentals',
                    'estimated_duration': '3 weeks',
                    'difficulty': 'beginner'
                },
                {
                    'name': 'React Framework',
                    'estimated_duration': '4 weeks',
                    'difficulty': 'intermediate'
                }
            ],
            'total_duration': '9 weeks',
            'confidence_score': 0.85
        }
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
        
    except Exception as e:
        logger.error(f"Learning path recommendation error: {e}")
        return jsonify({'error': 'Failed to generate recommendations'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting CodeMentor AI Engine on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
"""
Self-Evolution and Replication Module
Enables the AI to analyze itself and generate improved variants
Supports both GCP Vertex AI (with credits) and local Ollama (post-credits)
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
import hashlib

logger = logging.getLogger(__name__)


class SelfEvolutionConfig:
    """Configuration for self-evolution system"""
    
    # GCP Vertex AI settings (for bootstrap phase with credits)
    USE_VERTEX_AI = os.getenv('USE_VERTEX_AI', 'false').lower() == 'true'
    VERTEX_PROJECT_ID = os.getenv('GCP_PROJECT_ID', '')
    VERTEX_LOCATION = os.getenv('GCP_LOCATION', 'us-central1')
    VERTEX_MODEL = os.getenv('VERTEX_MODEL', 'gemini-pro')
    
    # Local Ollama settings (for eternal self-replication post-credits)
    OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
    OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama2')
    
    # Evolution settings
    EVOLUTION_HISTORY_FILE = '/tmp/evolution_history.json'
    MAX_EVOLUTION_ITERATIONS = int(os.getenv('MAX_EVOLUTION_ITERATIONS', '100'))
    EVOLUTION_INTERVAL_HOURS = int(os.getenv('EVOLUTION_INTERVAL_HOURS', '24'))
    
    # GCP credits tracking
    GCP_CREDITS_REMAINING = float(os.getenv('GCP_CREDITS_REMAINING', '1000.0'))
    GCP_CREDITS_THRESHOLD = float(os.getenv('GCP_CREDITS_THRESHOLD', '100.0'))


class EvolutionHistory:
    """Track evolution history and variants"""
    
    def __init__(self, history_file: str = SelfEvolutionConfig.EVOLUTION_HISTORY_FILE):
        self.history_file = history_file
        self._ensure_history_file()
    
    def _ensure_history_file(self):
        """Ensure history file exists"""
        if not os.path.exists(self.history_file):
            os.makedirs(os.path.dirname(self.history_file), exist_ok=True)
            self._save_history([])
    
    def load_history(self) -> List[Dict]:
        """Load evolution history"""
        try:
            with open(self.history_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load history: {e}")
            return []
    
    def _save_history(self, history: List[Dict]):
        """Save evolution history"""
        try:
            with open(self.history_file, 'w') as f:
                json.dump(history, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save history: {e}")
    
    def add_evolution(self, evolution_data: Dict):
        """Add new evolution entry"""
        history = self.load_history()
        evolution_data['timestamp'] = datetime.now().isoformat()
        evolution_data['id'] = hashlib.md5(
            f"{evolution_data['timestamp']}{evolution_data.get('variant_name', '')}".encode()
        ).hexdigest()[:8]
        history.append(evolution_data)
        self._save_history(history)
        return evolution_data['id']
    
    def get_latest_evolution(self) -> Optional[Dict]:
        """Get most recent evolution"""
        history = self.load_history()
        return history[-1] if history else None
    
    def get_best_variant(self, metric: str = 'performance_score') -> Optional[Dict]:
        """Get best performing variant based on metric"""
        history = self.load_history()
        if not history:
            return None
        return max(history, key=lambda x: x.get('metrics', {}).get(metric, 0))


class SelfAnalyzer:
    """Analyze current AI system performance and identify improvement areas"""
    
    def analyze_system(self, analytics_data: Dict) -> Dict:
        """Analyze system performance from user analytics"""
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'metrics': {},
            'weaknesses': [],
            'improvement_suggestions': []
        }
        
        # Analyze user performance data
        user_metrics = analytics_data.get('user_performance', {})
        error_metrics = analytics_data.get('errors', {})
        
        # Calculate key metrics
        avg_success_rate = user_metrics.get('avg_success_rate', 0)
        avg_completion_time = user_metrics.get('avg_completion_time', 0)
        common_errors = error_metrics.get('common_errors', [])
        
        analysis['metrics'] = {
            'success_rate': avg_success_rate,
            'completion_time': avg_completion_time,
            'error_count': len(common_errors)
        }
        
        # Identify weaknesses
        if avg_success_rate < 0.7:
            analysis['weaknesses'].append('Low user success rate in challenges')
            analysis['improvement_suggestions'].append(
                'Improve challenge difficulty adaptation'
            )
        
        if avg_completion_time > 1800:  # 30 minutes
            analysis['weaknesses'].append('Users taking too long to complete tasks')
            analysis['improvement_suggestions'].append(
                'Optimize hint generation for faster learning'
            )
        
        if len(common_errors) > 10:
            analysis['weaknesses'].append('High error diversity indicates unclear guidance')
            analysis['improvement_suggestions'].append(
                'Enhance tutor explanations for common problem areas'
            )
        
        # Analyze code quality
        code_quality = analytics_data.get('code_quality', {})
        if code_quality.get('avg_readability', 100) < 70:
            analysis['weaknesses'].append('Low code readability scores')
            analysis['improvement_suggestions'].append(
                'Add more focus on code style and best practices'
            )
        
        return analysis


class VariantGenerator:
    """Generate improved AI variants based on analysis"""
    
    def __init__(self):
        self.use_vertex_ai = SelfEvolutionConfig.USE_VERTEX_AI
        self.vertex_client = None
        self.ollama_client = None
        
        if self.use_vertex_ai:
            self._init_vertex_ai()
        else:
            self._init_ollama()
    
    def _init_vertex_ai(self):
        """Initialize Vertex AI client"""
        try:
            import vertexai
            from vertexai.generative_models import GenerativeModel
            
            vertexai.init(
                project=SelfEvolutionConfig.VERTEX_PROJECT_ID,
                location=SelfEvolutionConfig.VERTEX_LOCATION
            )
            self.vertex_client = GenerativeModel(SelfEvolutionConfig.VERTEX_MODEL)
            logger.info("Vertex AI initialized for self-evolution")
        except Exception as e:
            logger.warning(f"Failed to initialize Vertex AI: {e}")
            self.use_vertex_ai = False
            self._init_ollama()
    
    def _init_ollama(self):
        """Initialize Ollama client for local generation"""
        try:
            import requests
            self.ollama_client = requests.Session()
            # Test connection
            response = self.ollama_client.get(f"{SelfEvolutionConfig.OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                logger.info("Ollama initialized for self-evolution")
            else:
                logger.warning("Ollama not available, using fallback")
        except Exception as e:
            logger.warning(f"Failed to initialize Ollama: {e}")
    
    def generate_variant(self, analysis: Dict, variant_type: str = 'general') -> Dict:
        """Generate improved code variant based on analysis"""
        improvement_focus = analysis.get('improvement_suggestions', [])
        
        if not improvement_focus:
            logger.warning("No improvement suggestions found")
            return self._generate_fallback_variant()
        
        prompt = self._create_generation_prompt(analysis, variant_type)
        
        if self.use_vertex_ai and self.vertex_client:
            return self._generate_with_vertex(prompt, analysis)
        elif self.ollama_client:
            return self._generate_with_ollama(prompt, analysis)
        else:
            return self._generate_fallback_variant()
    
    def _create_generation_prompt(self, analysis: Dict, variant_type: str) -> str:
        """Create prompt for variant generation"""
        suggestions = '\n'.join(f"- {s}" for s in analysis.get('improvement_suggestions', []))
        weaknesses = '\n'.join(f"- {w}" for w in analysis.get('weaknesses', []))
        
        return f"""You are an AI system that improves itself by generating better versions of its code.

Current System Analysis:
Weaknesses:
{weaknesses}

Improvement Suggestions:
{suggestions}

Current Metrics:
{json.dumps(analysis.get('metrics', {}), indent=2)}

Task: Generate an improved Python module that addresses the weaknesses above.
Focus on: {variant_type}

Requirements:
1. Maintain compatibility with existing Flask API
2. Improve performance and accuracy
3. Add better error handling
4. Optimize for the identified weaknesses
5. Keep code clean and well-documented

Generate the improved code module:
"""
    
    def _generate_with_vertex(self, prompt: str, analysis: Dict) -> Dict:
        """Generate variant using Vertex AI"""
        try:
            response = self.vertex_client.generate_content(prompt)
            generated_code = response.text
            
            return {
                'variant_name': f"vertex_variant_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                'code': generated_code,
                'generator': 'vertex_ai',
                'model': SelfEvolutionConfig.VERTEX_MODEL,
                'analysis_used': analysis,
                'generated_at': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Vertex AI generation failed: {e}")
            return self._generate_fallback_variant()
    
    def _generate_with_ollama(self, prompt: str, analysis: Dict) -> Dict:
        """Generate variant using local Ollama"""
        try:
            import requests
            
            response = requests.post(
                f"{SelfEvolutionConfig.OLLAMA_BASE_URL}/api/generate",
                json={
                    'model': SelfEvolutionConfig.OLLAMA_MODEL,
                    'prompt': prompt,
                    'stream': False
                },
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                generated_code = result.get('response', '')
                
                return {
                    'variant_name': f"ollama_variant_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                    'code': generated_code,
                    'generator': 'ollama',
                    'model': SelfEvolutionConfig.OLLAMA_MODEL,
                    'analysis_used': analysis,
                    'generated_at': datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
        
        return self._generate_fallback_variant()
    
    def _generate_fallback_variant(self) -> Dict:
        """Generate a basic fallback variant"""
        return {
            'variant_name': f"fallback_variant_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'code': '# Fallback variant - no improvements available',
            'generator': 'fallback',
            'model': 'none',
            'generated_at': datetime.now().isoformat()
        }


class VariantTester:
    """Test generated variants locally"""
    
    def test_variant(self, variant: Dict) -> Dict:
        """Test variant code for correctness and performance"""
        test_results = {
            'variant_id': variant.get('variant_name'),
            'tests_passed': 0,
            'tests_failed': 0,
            'performance_score': 0.0,
            'errors': []
        }
        
        code = variant.get('code', '')
        
        # Basic syntax check
        try:
            compile(code, '<string>', 'exec')
            test_results['tests_passed'] += 1
        except SyntaxError as e:
            test_results['tests_failed'] += 1
            test_results['errors'].append(f"Syntax error: {e}")
        
        # Check for required imports
        required_imports = ['flask', 'logging', 'json']
        for imp in required_imports:
            if f"import {imp}" in code or f"from {imp}" in code:
                test_results['tests_passed'] += 1
            else:
                test_results['tests_failed'] += 1
                test_results['errors'].append(f"Missing import: {imp}")
        
        # Calculate performance score
        total_tests = test_results['tests_passed'] + test_results['tests_failed']
        if total_tests > 0:
            test_results['performance_score'] = test_results['tests_passed'] / total_tests
        
        return test_results


class SelfEvolutionEngine:
    """Main self-evolution engine orchestrating the evolution cycle"""
    
    def __init__(self):
        self.history = EvolutionHistory()
        self.analyzer = SelfAnalyzer()
        self.generator = VariantGenerator()
        self.tester = VariantTester()
    
    def evolve(self, analytics_data: Dict) -> Dict:
        """Execute one evolution cycle"""
        logger.info("Starting evolution cycle")
        
        # Step 1: Analyze current system
        analysis = self.analyzer.analyze_system(analytics_data)
        logger.info(f"Analysis complete: {len(analysis['weaknesses'])} weaknesses found")
        
        # Step 2: Generate variant
        variant = self.generator.generate_variant(analysis)
        logger.info(f"Variant generated: {variant['variant_name']}")
        
        # Step 3: Test variant
        test_results = self.tester.test_variant(variant)
        logger.info(f"Testing complete: {test_results['performance_score']:.2f} score")
        
        # Step 4: Decide whether to deploy
        should_deploy = self._should_deploy_variant(test_results)
        
        # Step 5: Record evolution
        evolution_record = {
            'variant_name': variant['variant_name'],
            'analysis': analysis,
            'variant': variant,
            'test_results': test_results,
            'deployed': should_deploy,
            'metrics': {
                'performance_score': test_results['performance_score'],
                'tests_passed': test_results['tests_passed'],
                'tests_failed': test_results['tests_failed']
            }
        }
        
        evolution_id = self.history.add_evolution(evolution_record)
        
        if should_deploy:
            logger.info(f"Variant {variant['variant_name']} approved for deployment")
            # In production, this would trigger actual deployment
            self._save_variant_for_deployment(variant)
        else:
            logger.info(f"Variant {variant['variant_name']} rejected")
        
        return {
            'evolution_id': evolution_id,
            'success': True,
            'deployed': should_deploy,
            'variant_name': variant['variant_name'],
            'performance_score': test_results['performance_score']
        }
    
    def _should_deploy_variant(self, test_results: Dict) -> bool:
        """Determine if variant should be deployed"""
        # Deploy if performance score is above threshold
        return test_results['performance_score'] >= 0.8
    
    def _save_variant_for_deployment(self, variant: Dict):
        """Save variant code for deployment"""
        try:
            variant_dir = '/tmp/variants'
            os.makedirs(variant_dir, exist_ok=True)
            
            variant_file = os.path.join(variant_dir, f"{variant['variant_name']}.py")
            with open(variant_file, 'w') as f:
                f.write(variant['code'])
            
            logger.info(f"Variant saved to {variant_file}")
        except Exception as e:
            logger.error(f"Failed to save variant: {e}")
    
    def get_evolution_status(self) -> Dict:
        """Get current evolution status"""
        latest = self.history.get_latest_evolution()
        best = self.history.get_best_variant()
        all_history = self.history.load_history()
        
        return {
            'total_evolutions': len(all_history),
            'latest_evolution': latest,
            'best_variant': best,
            'using_vertex_ai': SelfEvolutionConfig.USE_VERTEX_AI,
            'credits_remaining': SelfEvolutionConfig.GCP_CREDITS_REMAINING
        }


def migrate_to_local():
    """Migrate from GCP Vertex AI to local Ollama"""
    logger.info("Migrating to local Ollama for eternal self-replication")
    
    # Update environment
    os.environ['USE_VERTEX_AI'] = 'false'
    
    # Verify Ollama availability
    try:
        import requests
        response = requests.get(f"{SelfEvolutionConfig.OLLAMA_BASE_URL}/api/tags")
        if response.status_code == 200:
            logger.info("Ollama verified and ready")
            return {'success': True, 'message': 'Migration to Ollama complete'}
        else:
            return {'success': False, 'message': 'Ollama not available'}
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        return {'success': False, 'message': str(e)}

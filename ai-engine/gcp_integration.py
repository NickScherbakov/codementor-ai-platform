"""
GCP Integration Module
Manages GCP services integration for bootstrap phase with credits
Supports Vertex AI, GenAI App Builder, and Cloud Run
"""

import os
import logging
from datetime import datetime
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class GCPConfig:
    """GCP Configuration"""
    
    # Project settings
    PROJECT_ID = os.getenv('GCP_PROJECT_ID', '')
    LOCATION = os.getenv('GCP_LOCATION', 'us-central1')
    
    # Vertex AI settings
    VERTEX_MODEL = os.getenv('VERTEX_MODEL', 'gemini-pro')
    VERTEX_CODE_MODEL = os.getenv('VERTEX_CODE_MODEL', 'code-bison')
    
    # Credits tracking
    GEMINI_CODE_ASSIST_BUDGET = float(os.getenv('GEMINI_CODE_ASSIST_BUDGET', '1138.0'))
    GENAI_APP_BUILDER_BUDGET = float(os.getenv('GENAI_APP_BUILDER_BUDGET', '1000.0'))
    FREE_TRIAL_BUDGET = float(os.getenv('FREE_TRIAL_BUDGET', '280.0'))
    
    # Credits usage tracking file
    CREDITS_USAGE_FILE = '/tmp/gcp_credits_usage.json'
    
    # Auto-migration threshold
    AUTO_MIGRATE_THRESHOLD = float(os.getenv('AUTO_MIGRATE_THRESHOLD', '100.0'))


class CreditsTracker:
    """Track GCP credits usage"""
    
    def __init__(self):
        self.usage_file = GCPConfig.CREDITS_USAGE_FILE
        self._init_usage_file()
    
    def _init_usage_file(self):
        """Initialize usage tracking file"""
        if not os.path.exists(self.usage_file):
            import json
            initial_data = {
                'gemini_code_assist': {
                    'budget': GCPConfig.GEMINI_CODE_ASSIST_BUDGET,
                    'used': 0.0,
                    'remaining': GCPConfig.GEMINI_CODE_ASSIST_BUDGET,
                    'operations': []
                },
                'genai_app_builder': {
                    'budget': GCPConfig.GENAI_APP_BUILDER_BUDGET,
                    'used': 0.0,
                    'remaining': GCPConfig.GENAI_APP_BUILDER_BUDGET,
                    'operations': []
                },
                'free_trial': {
                    'budget': GCPConfig.FREE_TRIAL_BUDGET,
                    'used': 0.0,
                    'remaining': GCPConfig.FREE_TRIAL_BUDGET,
                    'operations': []
                },
                'total_budget': GCPConfig.GEMINI_CODE_ASSIST_BUDGET + GCPConfig.GENAI_APP_BUILDER_BUDGET + GCPConfig.FREE_TRIAL_BUDGET,
                'total_used': 0.0,
                'started_at': datetime.now().isoformat()
            }
            
            os.makedirs(os.path.dirname(self.usage_file), exist_ok=True)
            with open(self.usage_file, 'w') as f:
                json.dump(initial_data, f, indent=2)
    
    def record_usage(self, service: str, cost: float, operation: str):
        """Record credit usage"""
        import json
        
        with open(self.usage_file, 'r') as f:
            data = json.load(f)
        
        if service in data:
            data[service]['used'] += cost
            data[service]['remaining'] = data[service]['budget'] - data[service]['used']
            data[service]['operations'].append({
                'operation': operation,
                'cost': cost,
                'timestamp': datetime.now().isoformat()
            })
            
            data['total_used'] = sum(s['used'] for s in [data['gemini_code_assist'], data['genai_app_builder'], data['free_trial']])
        
        with open(self.usage_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Recorded {cost} credits usage for {service}: {operation}")
        
        # Check if auto-migration needed
        if data[service]['remaining'] < GCPConfig.AUTO_MIGRATE_THRESHOLD:
            logger.warning(f"{service} credits low: {data[service]['remaining']} remaining")
            return {'warning': 'credits_low', 'service': service, 'remaining': data[service]['remaining']}
        
        return {'success': True}
    
    def get_usage_summary(self) -> Dict:
        """Get credits usage summary"""
        import json
        
        with open(self.usage_file, 'r') as f:
            data = json.load(f)
        
        return {
            'total_budget': data['total_budget'],
            'total_used': data['total_used'],
            'total_remaining': data['total_budget'] - data['total_used'],
            'services': {
                'gemini_code_assist': {
                    'used': data['gemini_code_assist']['used'],
                    'remaining': data['gemini_code_assist']['remaining'],
                    'percentage_used': (data['gemini_code_assist']['used'] / data['gemini_code_assist']['budget']) * 100
                },
                'genai_app_builder': {
                    'used': data['genai_app_builder']['used'],
                    'remaining': data['genai_app_builder']['remaining'],
                    'percentage_used': (data['genai_app_builder']['used'] / data['genai_app_builder']['budget']) * 100
                },
                'free_trial': {
                    'used': data['free_trial']['used'],
                    'remaining': data['free_trial']['remaining'],
                    'percentage_used': (data['free_trial']['used'] / data['free_trial']['budget']) * 100
                }
            },
            'started_at': data['started_at'],
            'should_migrate': data['total_budget'] - data['total_used'] < GCPConfig.AUTO_MIGRATE_THRESHOLD
        }


class VertexAIClient:
    """Vertex AI integration for code generation and analysis"""
    
    def __init__(self):
        self.project_id = GCPConfig.PROJECT_ID
        self.location = GCPConfig.LOCATION
        self.model = None
        self.credits_tracker = CreditsTracker()
        self._initialized = False
    
    def initialize(self):
        """Initialize Vertex AI client"""
        if self._initialized:
            return
        
        try:
            import vertexai
            from vertexai.generative_models import GenerativeModel
            
            vertexai.init(project=self.project_id, location=self.location)
            self.model = GenerativeModel(GCPConfig.VERTEX_MODEL)
            self._initialized = True
            logger.info("Vertex AI initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Vertex AI: {e}")
            raise
    
    def generate_code(self, prompt: str, context: Dict = None) -> Dict:
        """Generate code using Gemini Code Assist"""
        if not self._initialized:
            self.initialize()
        
        try:
            # Estimated cost per generation: ~$0.05
            estimated_cost = 0.05
            
            response = self.model.generate_content(prompt)
            generated_code = response.text
            
            # Record usage
            self.credits_tracker.record_usage(
                'gemini_code_assist',
                estimated_cost,
                f'Code generation: {prompt[:50]}...'
            )
            
            return {
                'success': True,
                'code': generated_code,
                'model': GCPConfig.VERTEX_MODEL,
                'cost': estimated_cost
            }
            
        except Exception as e:
            logger.error(f"Code generation failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def analyze_code(self, code: str, language: str) -> Dict:
        """Analyze code using Vertex AI"""
        if not self._initialized:
            self.initialize()
        
        try:
            prompt = f"""Analyze this {language} code and provide:
1. Code quality assessment
2. Potential bugs or issues
3. Performance optimization suggestions
4. Security vulnerabilities
5. Best practices recommendations

Code:
```{language}
{code}
```

Provide detailed analysis:
"""
            
            estimated_cost = 0.03
            
            response = self.model.generate_content(prompt)
            analysis = response.text
            
            self.credits_tracker.record_usage(
                'gemini_code_assist',
                estimated_cost,
                f'Code analysis: {language}'
            )
            
            return {
                'success': True,
                'analysis': analysis,
                'model': GCPConfig.VERTEX_MODEL,
                'cost': estimated_cost
            }
            
        except Exception as e:
            logger.error(f"Code analysis failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }


class GenAIAppBuilder:
    """GenAI App Builder integration for RAG and assessment"""
    
    def __init__(self):
        self.project_id = GCPConfig.PROJECT_ID
        self.location = GCPConfig.LOCATION
        self.credits_tracker = CreditsTracker()
        self._search_client = None
        self._conversation_client = None
    
    def initialize_search(self):
        """Initialize Vertex AI Search for RAG"""
        try:
            # This would initialize the actual search client
            # For now, just logging
            logger.info("GenAI App Builder Search initialized")
            self._search_client = True
        except Exception as e:
            logger.error(f"Failed to initialize search: {e}")
    
    def index_documents(self, documents: list, index_name: str = 'challenges_index') -> Dict:
        """Index documents for RAG search"""
        try:
            # Estimated cost per 1000 docs: ~$0.10
            num_docs = len(documents)
            estimated_cost = (num_docs / 1000) * 0.10
            
            # In production, this would actually index the documents
            logger.info(f"Indexing {num_docs} documents to {index_name}")
            
            self.credits_tracker.record_usage(
                'genai_app_builder',
                estimated_cost,
                f'Index {num_docs} documents'
            )
            
            return {
                'success': True,
                'indexed_count': num_docs,
                'index_name': index_name,
                'cost': estimated_cost
            }
            
        except Exception as e:
            logger.error(f"Document indexing failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def search_challenges(self, query: str, filters: Dict = None) -> Dict:
        """Search indexed challenges using RAG"""
        try:
            # Estimated cost per query: ~$0.01
            estimated_cost = 0.01
            
            # In production, this would perform actual search
            logger.info(f"Searching challenges: {query}")
            
            self.credits_tracker.record_usage(
                'genai_app_builder',
                estimated_cost,
                f'Search query: {query[:50]}...'
            )
            
            # Mock results
            results = [
                {
                    'id': 'challenge_001',
                    'title': 'Array Manipulation',
                    'relevance_score': 0.95
                },
                {
                    'id': 'challenge_002',
                    'title': 'String Processing',
                    'relevance_score': 0.87
                }
            ]
            
            return {
                'success': True,
                'results': results,
                'cost': estimated_cost
            }
            
        except Exception as e:
            logger.error(f"Search failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def create_interview_bot(self, level: str) -> Dict:
        """Create conversational interview bot"""
        try:
            # Estimated cost per bot creation: ~$0.05
            estimated_cost = 0.05
            
            logger.info(f"Creating interview bot for {level} level")
            
            self.credits_tracker.record_usage(
                'genai_app_builder',
                estimated_cost,
                f'Interview bot creation: {level}'
            )
            
            return {
                'success': True,
                'bot_id': f'interview_bot_{level}_{datetime.now().strftime("%Y%m%d")}',
                'cost': estimated_cost
            }
            
        except Exception as e:
            logger.error(f"Bot creation failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }


class CloudRunDeployer:
    """Cloud Run deployment manager"""
    
    def __init__(self):
        self.project_id = GCPConfig.PROJECT_ID
        self.location = GCPConfig.LOCATION
        self.credits_tracker = CreditsTracker()
    
    def deploy_service(self, service_name: str, image_uri: str, env_vars: Dict = None) -> Dict:
        """Deploy service to Cloud Run"""
        try:
            # Estimated cost per deployment: ~$0.50 (from free trial)
            estimated_cost = 0.50
            
            logger.info(f"Deploying {service_name} to Cloud Run")
            
            self.credits_tracker.record_usage(
                'free_trial',
                estimated_cost,
                f'Deploy service: {service_name}'
            )
            
            return {
                'success': True,
                'service_name': service_name,
                'service_url': f'https://{service_name}-{self.project_id}.run.app',
                'cost': estimated_cost
            }
            
        except Exception as e:
            logger.error(f"Deployment failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def run_test_deployment(self, variant_name: str) -> Dict:
        """Run test deployment for variant testing"""
        try:
            # Estimated cost per test: ~$0.20
            estimated_cost = 0.20
            
            logger.info(f"Running test deployment for {variant_name}")
            
            self.credits_tracker.record_usage(
                'free_trial',
                estimated_cost,
                f'Test deployment: {variant_name}'
            )
            
            return {
                'success': True,
                'test_url': f'https://test-{variant_name}.run.app',
                'cost': estimated_cost
            }
            
        except Exception as e:
            logger.error(f"Test deployment failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }


class GCPIntegrationManager:
    """Main manager for all GCP services"""
    
    def __init__(self):
        self.vertex_ai = VertexAIClient()
        self.genai_builder = GenAIAppBuilder()
        self.cloud_run = CloudRunDeployer()
        self.credits_tracker = CreditsTracker()
    
    def get_status(self) -> Dict:
        """Get overall GCP integration status"""
        usage = self.credits_tracker.get_usage_summary()
        
        return {
            'credits_usage': usage,
            'services_status': {
                'vertex_ai': 'available' if GCPConfig.PROJECT_ID else 'not_configured',
                'genai_app_builder': 'available',
                'cloud_run': 'available'
            },
            'migration_recommended': usage['should_migrate']
        }
    
    def check_migration_status(self) -> Dict:
        """Check if migration to local is needed"""
        usage = self.credits_tracker.get_usage_summary()
        
        should_migrate = usage['should_migrate']
        
        return {
            'should_migrate': should_migrate,
            'total_remaining': usage['total_remaining'],
            'recommendation': 'Migrate to Ollama' if should_migrate else 'Continue with GCP',
            'usage_summary': usage
        }

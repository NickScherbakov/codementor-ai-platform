"""
Custom ML Models for CodeMentor AI
This module provides local ML models to replace OpenAI API calls
"""

import torch
import logging
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM,
    AutoModelForSeq2SeqLM
)
from typing import Dict, List, Optional
import threading
import os

logger = logging.getLogger(__name__)


class ModelConfig:
    """Configuration for ML models"""
    
    # Use lightweight models that can run on CPU
    CHAT_MODEL = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # 1.1B parameter chat model
    CODE_MODEL = "Salesforce/codet5-small"  # Small code model for analysis
    
    # Model settings
    MAX_LENGTH = 512
    TEMPERATURE = 0.7
    TOP_P = 0.9
    
    # Device configuration
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Cache directory for models
    CACHE_DIR = os.getenv("MODEL_CACHE_DIR", "/tmp/model_cache")


class ModelLoader:
    """Singleton class to manage model loading and caching"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self._initialized = True
        self.chat_model = None
        self.chat_tokenizer = None
        self.code_model = None
        self.code_tokenizer = None
        self.device = ModelConfig.DEVICE
        
        logger.info(f"ModelLoader initialized. Using device: {self.device}")
    
    def load_chat_model(self):
        """Load the conversational model for AI tutor"""
        if self.chat_model is not None:
            return self.chat_model, self.chat_tokenizer
        
        try:
            logger.info(f"Loading chat model: {ModelConfig.CHAT_MODEL}")
            
            self.chat_tokenizer = AutoTokenizer.from_pretrained(
                ModelConfig.CHAT_MODEL,
                cache_dir=ModelConfig.CACHE_DIR,
                trust_remote_code=True
            )
            
            self.chat_model = AutoModelForCausalLM.from_pretrained(
                ModelConfig.CHAT_MODEL,
                cache_dir=ModelConfig.CACHE_DIR,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
                low_cpu_mem_usage=True,
                trust_remote_code=True
            )
            
            if self.device == "cpu":
                self.chat_model = self.chat_model.to(self.device)
            
            logger.info("Chat model loaded successfully")
            return self.chat_model, self.chat_tokenizer
            
        except Exception as e:
            logger.error(f"Failed to load chat model: {e}")
            raise
    
    def load_code_model(self):
        """Load the code analysis model"""
        if self.code_model is not None:
            return self.code_model, self.code_tokenizer
        
        try:
            logger.info(f"Loading code model: {ModelConfig.CODE_MODEL}")
            
            self.code_tokenizer = AutoTokenizer.from_pretrained(
                ModelConfig.CODE_MODEL,
                cache_dir=ModelConfig.CACHE_DIR,
                trust_remote_code=True
            )
            
            self.code_model = AutoModelForSeq2SeqLM.from_pretrained(
                ModelConfig.CODE_MODEL,
                cache_dir=ModelConfig.CACHE_DIR,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
                low_cpu_mem_usage=True,
                trust_remote_code=True
            )
            
            if self.device == "cpu":
                self.code_model = self.code_model.to(self.device)
            
            logger.info("Code model loaded successfully")
            return self.code_model, self.code_tokenizer
            
        except Exception as e:
            logger.error(f"Failed to load code model: {e}")
            raise


class CustomAITutor:
    """Custom AI tutor using local language models"""
    
    def __init__(self):
        self.model_loader = ModelLoader()
        self.personality_prompts = {
            'encouraging': "You are an encouraging and supportive programming tutor. Always stay positive and help students build confidence.",
            'analytical': "You are a precise and analytical programming tutor. Focus on logical problem-solving and detailed explanations.",
            'creative': "You are a creative and innovative programming tutor. Encourage out-of-the-box thinking and creative solutions.",
            'practical': "You are a practical and results-oriented programming tutor. Focus on real-world applications and industry best practices."
        }
    
    def generate_response(self, user_message: str, context: Dict, personality: str = 'encouraging') -> Dict:
        """Generate AI tutor response using local model"""
        try:
            model, tokenizer = self.model_loader.load_chat_model()
            
            # Get personality prompt
            system_prompt = self.personality_prompts.get(
                personality, 
                self.personality_prompts['encouraging']
            )
            
            # Format the conversation for TinyLlama
            # TinyLlama uses a chat format
            conversation = f"""<|system|>
{system_prompt}
You are helping a student learn programming. Context: {context.get('current_topic', 'general programming')}
</s>
<|user|>
{user_message}</s>
<|assistant|>
"""
            
            # Tokenize input
            inputs = tokenizer(
                conversation,
                return_tensors="pt",
                truncation=True,
                max_length=ModelConfig.MAX_LENGTH
            ).to(model.device)
            
            # Generate response
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=256,
                    temperature=ModelConfig.TEMPERATURE,
                    top_p=ModelConfig.TOP_P,
                    do_sample=True,
                    pad_token_id=tokenizer.eos_token_id
                )
            
            # Decode response
            response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the assistant's response
            if "<|assistant|>" in response_text:
                response_text = response_text.split("<|assistant|>")[-1].strip()
            
            # Extract suggestions from response
            suggestions = self._extract_suggestions(response_text)
            resources = self._recommend_resources(user_message, context)
            
            return {
                'message': response_text,
                'suggestions': suggestions,
                'resources': resources,
                'model_used': 'TinyLlama-1.1B'
            }
            
        except Exception as e:
            logger.error(f"Custom AI tutor error: {e}")
            return {
                'message': "I apologize, but I'm having trouble processing your request right now. Let me try to help you with what I understand from your question.",
                'suggestions': self._extract_suggestions(user_message),
                'resources': self._recommend_resources(user_message, context),
                'model_used': 'fallback'
            }
    
    def _extract_suggestions(self, response_text: str) -> List[str]:
        """Extract actionable suggestions from AI response"""
        suggestions = []
        
        response_lower = response_text.lower()
        
        if 'loop' in response_lower:
            suggestions.append("Consider using appropriate loop structures")
        if 'function' in response_lower:
            suggestions.append("Break down the problem into smaller functions")
        if 'variable' in response_lower:
            suggestions.append("Use descriptive variable names")
        if 'test' in response_lower:
            suggestions.append("Write test cases to verify your solution")
        if 'debug' in response_lower or 'error' in response_lower:
            suggestions.append("Use debugging tools to trace the issue")
            
        return suggestions[:3]
    
    def _recommend_resources(self, user_message: str, context: Dict) -> List[Dict]:
        """Recommend learning resources based on context"""
        resources = []
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
        
        if any(word in message_lower for word in ['array', 'list']):
            resources.append({
                'title': 'Working with Arrays and Lists',
                'url': '/learn/data-structures/arrays',
                'type': 'tutorial'
            })
        
        return resources


class CustomCodeAnalyzer:
    """Enhanced code analyzer using local models"""
    
    def __init__(self):
        self.model_loader = ModelLoader()
    
    def analyze_with_ai(self, code: str, language: str) -> Dict:
        """Use local model to analyze code and provide suggestions"""
        try:
            model, tokenizer = self.model_loader.load_code_model()
            
            # Create analysis prompt
            prompt = f"Analyze this {language} code and provide suggestions for improvement:\n\n{code}\n\nSuggestions:"
            
            # Tokenize
            inputs = tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=512
            ).to(model.device)
            
            # Generate analysis
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_length=256,
                    temperature=0.7,
                    num_beams=4,
                    early_stopping=True
                )
            
            analysis = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            return {
                'ai_analysis': analysis,
                'confidence': 0.85,
                'model_used': 'CodeT5-small'
            }
            
        except Exception as e:
            logger.error(f"AI code analysis error: {e}")
            return {
                'ai_analysis': 'Unable to perform AI analysis at this time.',
                'confidence': 0.0,
                'model_used': 'none'
            }


# Global instances
_custom_tutor = None
_custom_analyzer = None


def get_custom_tutor() -> CustomAITutor:
    """Get or create the custom AI tutor instance"""
    global _custom_tutor
    if _custom_tutor is None:
        _custom_tutor = CustomAITutor()
    return _custom_tutor


def get_custom_analyzer() -> CustomCodeAnalyzer:
    """Get or create the custom code analyzer instance"""
    global _custom_analyzer
    if _custom_analyzer is None:
        _custom_analyzer = CustomCodeAnalyzer()
    return _custom_analyzer

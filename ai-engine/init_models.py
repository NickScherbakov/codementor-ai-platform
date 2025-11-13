#!/usr/bin/env python3
"""
Model initialization script for CodeMentor AI
This script downloads and caches the required ML models
"""

import os
import sys
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def download_models():
    """Download and cache all required models"""
    try:
        logger.info("Starting model download and initialization...")
        
        # Import after setting cache directory
        from transformers import AutoTokenizer, AutoModelForCausalLM, AutoModelForSeq2SeqLM
        
        cache_dir = os.getenv("MODEL_CACHE_DIR", "/tmp/model_cache")
        Path(cache_dir).mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Using cache directory: {cache_dir}")
        
        # Download chat model
        logger.info("Downloading TinyLlama chat model (1.1B parameters)...")
        chat_model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        
        AutoTokenizer.from_pretrained(
            chat_model_name,
            cache_dir=cache_dir,
            trust_remote_code=True
        )
        
        AutoModelForCausalLM.from_pretrained(
            chat_model_name,
            cache_dir=cache_dir,
            trust_remote_code=True
        )
        
        logger.info("✓ Chat model downloaded successfully")
        
        # Download code model
        logger.info("Downloading CodeT5 code analysis model (small)...")
        code_model_name = "Salesforce/codet5-small"
        
        AutoTokenizer.from_pretrained(
            code_model_name,
            cache_dir=cache_dir,
            trust_remote_code=True
        )
        
        AutoModelForSeq2SeqLM.from_pretrained(
            code_model_name,
            cache_dir=cache_dir,
            trust_remote_code=True
        )
        
        logger.info("✓ Code model downloaded successfully")
        
        logger.info("\n" + "="*60)
        logger.info("✓ All models downloaded and cached successfully!")
        logger.info("="*60)
        logger.info(f"\nModel cache location: {cache_dir}")
        logger.info("\nYou can now start the AI engine with: python main.py")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to download models: {e}")
        logger.error("\nPlease check your internet connection and try again.")
        return False


if __name__ == "__main__":
    success = download_models()
    sys.exit(0 if success else 1)

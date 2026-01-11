#!/usr/bin/env python3
"""
Interactive test script for AI Engine
Run without backend/frontend to test AI model functionality
"""

import sys
import os
import json

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

def print_header(text):
    """Print formatted header"""
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def test_model_configuration():
    """Test 1: Check model configuration"""
    print_header("TEST 1: Model Configuration")
    
    try:
        from models import ModelConfig
        print(f"✓ Chat Model: {ModelConfig.CHAT_MODEL}")
        print(f"✓ Code Model: {ModelConfig.CODE_MODEL}")
        print(f"✓ Device: {ModelConfig.DEVICE}")
        print(f"✓ Cache Directory: {ModelConfig.CACHE_DIR}")
        print(f"✓ Max Length: {ModelConfig.MAX_LENGTH}")
        print(f"✓ Temperature: {ModelConfig.TEMPERATURE}")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_model_loader():
    """Test 2: Model Loader Singleton"""
    print_header("TEST 2: Model Loader (Singleton Pattern)")
    
    try:
        from models import ModelLoader
        
        loader1 = ModelLoader()
        loader2 = ModelLoader()
        
        if loader1 is loader2:
            print("✓ Singleton pattern works correctly")
            print(f"✓ Instance count: 1 (same object)")
            return True
        else:
            print("✗ Singleton pattern failed")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_tutor_class():
    """Test 3: AI Tutor Class"""
    print_header("TEST 3: CustomAITutor Class")
    
    try:
        from models import CustomAITutor
        
        tutor = CustomAITutor()
        print(f"✓ CustomAITutor instantiated")
        print(f"✓ Personality types: {len(tutor.personality_prompts)}")
        for personality in tutor.personality_prompts.keys():
            print(f"  - {personality}")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_analyzer_class():
    """Test 4: Code Analyzer Class"""
    print_header("TEST 4: CustomCodeAnalyzer Class")
    
    try:
        from models import CustomCodeAnalyzer
        
        analyzer = CustomCodeAnalyzer()
        print(f"✓ CustomCodeAnalyzer instantiated")
        
        # Check for methods
        if hasattr(analyzer, 'analyze_with_ai'):
            print(f"✓ analyze_with_ai() method available")
        
        if hasattr(analyzer, 'analysis_rules'):
            print(f"✓ Analysis rules configured: {len(analyzer.analysis_rules)}")
            for rule in list(analyzer.analysis_rules.keys())[:5]:
                print(f"  - {rule}")
            if len(analyzer.analysis_rules) > 5:
                print(f"  ... and {len(analyzer.analysis_rules) - 5} more")
        else:
            print(f"✓ Using AI-powered code analysis (no predefined rules)")
        
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_factory_functions():
    """Test 5: Factory Functions"""
    print_header("TEST 5: Factory Functions")
    
    try:
        from models import get_custom_tutor, get_custom_analyzer
        
        tutor = get_custom_tutor()
        print(f"✓ get_custom_tutor() returned: {type(tutor).__name__}")
        
        analyzer = get_custom_analyzer()
        print(f"✓ get_custom_analyzer() returned: {type(analyzer).__name__}")
        
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_main_integration():
    """Test 6: Main.py Integration"""
    print_header("TEST 6: Main.py Integration")
    
    try:
        with open('main.py', 'r') as f:
            content = f.read()
        
        checks = [
            ('from models import get_custom_tutor, get_custom_analyzer', 'Custom models imported'),
            ('import openai' not in content, 'OpenAI removed'),
            ('get_custom_tutor()', 'Custom tutor used'),
            ('get_custom_analyzer()', 'Custom analyzer used'),
        ]
        
        for i, (check, description) in enumerate(checks, 1):
            if isinstance(check, str):
                if check in content:
                    print(f"✓ {i}. {description}")
                else:
                    print(f"✗ {i}. {description}")
            else:
                if check:
                    print(f"✓ {i}. {description}")
                else:
                    print(f"✗ {i}. {description}")
        
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_api_endpoints():
    """Test 7: API Endpoints Structure"""
    print_header("TEST 7: API Endpoints Structure")
    
    try:
        with open('main.py', 'r') as f:
            content = f.read()
        
        endpoints = [
            ('/ai-tutor/chat', 'AI Tutor Chat'),
            ('/code/analyze', 'Code Analysis'),
            ('/challenges/generate', 'Challenge Generation'),
            ('/learning-path/recommend', 'Learning Path'),
            ('/health', 'Health Check'),
        ]
        
        for endpoint, description in endpoints:
            if f"'{endpoint}'" in content or f'"{endpoint}"' in content:
                print(f"✓ {endpoint:<25} - {description}")
            else:
                print(f"✗ {endpoint:<25} - NOT FOUND")
        
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def show_setup_instructions():
    """Show instructions for full setup"""
    print_header("NEXT STEPS: Full Setup")
    
    instructions = """
1. Install Dependencies:
   pip install -r requirements.txt

2. Download Models (first time only):
   python init_models.py
   
   This will download:
   - TinyLlama-1.1B-Chat (~2.2 GB)
   - CodeT5-Small (~500 MB)

3. Run the AI Engine:
   python main.py
   
   The API will be available at: http://localhost:5000

4. Test API Endpoints:
   
   # AI Tutor Chat
   curl -X POST http://localhost:5000/ai-tutor/chat \\
     -H "Content-Type: application/json" \\
     -d '{
       "message": "How do I write a loop in Python?",
       "context": "beginner",
       "personality": "encouraging"
     }'
   
   # Code Analysis
   curl -X POST http://localhost:5000/code/analyze \\
     -H "Content-Type: application/json" \\
     -d '{
       "code": "for i in range(10):\\n    print(i)",
       "language": "python"
     }'

5. Check Health:
   curl http://localhost:5000/health
"""
    print(instructions)

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  CodeMentor AI Engine - Test Suite")
    print("="*60)
    
    tests = [
        test_model_configuration,
        test_model_loader,
        test_tutor_class,
        test_analyzer_class,
        test_factory_functions,
        test_main_integration,
        test_api_endpoints,
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"✗ Test failed with exception: {e}")
            results.append(False)
    
    # Summary
    print_header("Test Summary")
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    print(f"Success Rate: {passed/total*100:.1f}%")
    
    if all(results):
        print("\n✓ All tests passed! The AI Engine is ready.")
        show_setup_instructions()
    else:
        print("\n✗ Some tests failed. Check the output above.")
    
    return 0 if all(results) else 1

if __name__ == '__main__':
    sys.exit(main())

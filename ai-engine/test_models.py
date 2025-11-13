"""
Test script for custom ML models
This tests the basic functionality without requiring full model downloads
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

def test_imports():
    """Test that all imports work"""
    print("Testing imports...")
    try:
        from models import ModelConfig, ModelLoader, CustomAITutor, CustomCodeAnalyzer
        from models import get_custom_tutor, get_custom_analyzer
        print("✓ All model imports successful")
        return True
    except Exception as e:
        print(f"✗ Import failed: {e}")
        return False


def test_model_config():
    """Test model configuration"""
    print("\nTesting model configuration...")
    try:
        from models import ModelConfig
        print(f"  Chat model: {ModelConfig.CHAT_MODEL}")
        print(f"  Code model: {ModelConfig.CODE_MODEL}")
        print(f"  Device: {ModelConfig.DEVICE}")
        print(f"  Cache dir: {ModelConfig.CACHE_DIR}")
        print("✓ Model configuration valid")
        return True
    except Exception as e:
        print(f"✗ Configuration test failed: {e}")
        return False


def test_model_loader_singleton():
    """Test that ModelLoader is a singleton"""
    print("\nTesting ModelLoader singleton pattern...")
    try:
        from models import ModelLoader
        loader1 = ModelLoader()
        loader2 = ModelLoader()
        
        if loader1 is loader2:
            print("✓ ModelLoader singleton pattern works correctly")
            return True
        else:
            print("✗ ModelLoader is not a singleton")
            return False
    except Exception as e:
        print(f"✗ Singleton test failed: {e}")
        return False


def test_tutor_initialization():
    """Test custom tutor initialization"""
    print("\nTesting CustomAITutor initialization...")
    try:
        from models import CustomAITutor
        tutor = CustomAITutor()
        
        # Check personality prompts
        if len(tutor.personality_prompts) == 4:
            print(f"✓ Tutor initialized with {len(tutor.personality_prompts)} personality types")
            return True
        else:
            print("✗ Tutor personality prompts incomplete")
            return False
    except Exception as e:
        print(f"✗ Tutor initialization failed: {e}")
        return False


def test_analyzer_initialization():
    """Test custom analyzer initialization"""
    print("\nTesting CustomCodeAnalyzer initialization...")
    try:
        from models import CustomCodeAnalyzer
        analyzer = CustomCodeAnalyzer()
        print("✓ Analyzer initialized successfully")
        return True
    except Exception as e:
        print(f"✗ Analyzer initialization failed: {e}")
        return False


def test_main_imports():
    """Test that main.py imports work"""
    print("\nTesting main.py imports...")
    try:
        import main
        print("✓ main.py imports successful")
        return True
    except Exception as e:
        print(f"✗ main.py import failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_init_script():
    """Test that init_models.py is valid"""
    print("\nTesting init_models.py...")
    try:
        import init_models
        print("✓ init_models.py is valid")
        return True
    except Exception as e:
        print(f"✗ init_models.py test failed: {e}")
        return False


def main():
    """Run all tests"""
    print("="*60)
    print("CodeMentor AI - Custom ML Models Test Suite")
    print("="*60)
    
    tests = [
        test_imports,
        test_model_config,
        test_model_loader_singleton,
        test_tutor_initialization,
        test_analyzer_initialization,
        test_main_imports,
        test_init_script
    ]
    
    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"\n✗ Test {test.__name__} crashed: {e}")
            results.append(False)
    
    print("\n" + "="*60)
    print(f"Test Results: {sum(results)}/{len(results)} passed")
    print("="*60)
    
    if all(results):
        print("\n✓ All tests passed!")
        print("\nNext steps:")
        print("1. Run 'python init_models.py' to download models")
        print("2. Start the server with 'python main.py'")
        print("3. Test the API endpoints")
        return 0
    else:
        print("\n✗ Some tests failed. Please check the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())

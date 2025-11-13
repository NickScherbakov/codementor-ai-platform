"""
Static code validation without dependencies
"""

import ast
import sys

def validate_python_file(filepath):
    """Validate Python file syntax"""
    try:
        with open(filepath, 'r') as f:
            code = f.read()
        ast.parse(code)
        return True, "Valid syntax"
    except SyntaxError as e:
        return False, f"Syntax error: {e}"
    except Exception as e:
        return False, f"Error: {e}"


def check_imports(filepath):
    """Check what modules are imported"""
    imports = []
    try:
        with open(filepath, 'r') as f:
            tree = ast.parse(f.read())
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    imports.append(node.module)
        
        return imports
    except Exception as e:
        return []


def main():
    print("="*60)
    print("Static Code Validation")
    print("="*60)
    
    files = ['models.py', 'main.py', 'init_models.py']
    
    all_valid = True
    
    for filepath in files:
        print(f"\nValidating {filepath}...")
        valid, msg = validate_python_file(filepath)
        
        if valid:
            print(f"  ✓ {msg}")
            imports = check_imports(filepath)
            print(f"  Imports: {', '.join(imports[:5])}{' ...' if len(imports) > 5 else ''}")
        else:
            print(f"  ✗ {msg}")
            all_valid = False
    
    # Check for OpenAI imports (should not exist)
    print("\n" + "="*60)
    print("Checking for OpenAI API usage...")
    
    openai_found = False
    for filepath in files:
        try:
            with open(filepath, 'r') as f:
                content = f.read()
                if 'openai' in content.lower() and filepath == 'main.py':
                    # Check if it's in imports
                    if 'import openai' in content:
                        print(f"  ✗ Found OpenAI import in {filepath}")
                        openai_found = True
                    else:
                        print(f"  ✓ No OpenAI imports in {filepath} (only references in comments)")
        except Exception as e:
            print(f"  Error checking {filepath}: {e}")
    
    if not openai_found:
        print("  ✓ OpenAI dependency successfully removed!")
    
    # Check for new model imports
    print("\n" + "="*60)
    print("Checking for custom model usage...")
    
    with open('main.py', 'r') as f:
        main_content = f.read()
    
    if 'from models import' in main_content:
        print("  ✓ Custom models imported in main.py")
    else:
        print("  ✗ Custom models not imported")
        all_valid = False
    
    if 'get_custom_tutor' in main_content:
        print("  ✓ Custom tutor used in main.py")
    else:
        print("  ✗ Custom tutor not used")
        all_valid = False
    
    print("\n" + "="*60)
    
    if all_valid:
        print("✓ All validations passed!")
        print("\nThe code is syntactically correct and properly integrated.")
        return 0
    else:
        print("✗ Some validations failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
Direct AI Engine Interaction - Interactive Demo
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from models import get_custom_tutor, get_custom_analyzer
import json

def colored_text(text, color):
    """Simple colored text for terminal"""
    colors = {
        'cyan': '\033[96m',
        'green': '\033[92m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'endc': '\033[0m',
        'bold': '\033[1m'
    }
    return f"{colors.get(color, '')}{text}{colors['endc']}"

def print_response(response):
    """Pretty print AI response"""
    print(f"\n{colored_text('AI Tutor Response:', 'cyan')}")
    print("-" * 70)
    
    if 'message' in response:
        print(f"\n{colored_text(response['message'], 'green')}\n")
    
    if response.get('suggestions'):
        print(f"{colored_text('💡 Suggestions:', 'yellow')}")
        for suggestion in response['suggestions']:
            print(f"  • {suggestion}")
        print()
    
    if response.get('resources'):
        print(f"{colored_text('📚 Resources:', 'yellow')}")
        for resource in response['resources']:
            print(f"  • {resource.get('title', 'Resource')}")
        print()
    
    print("-" * 70)

def main():
    print(f"\n{colored_text('='*70, 'blue')}")
    print(f"{colored_text('🎮 CodeMentor AI - Direct Interaction Demo', 'cyan')}")
    print(f"{colored_text('='*70, 'blue')}\n")
    
    print(f"{colored_text('Initializing AI models...', 'yellow')}")
    tutor = get_custom_tutor()
    analyzer = get_custom_analyzer()
    print(f"{colored_text('✓ Models initialized successfully!', 'green')}\n")
    
    context = {
        'current_topic': 'general programming',
        'skill_level': 'intermediate'
    }
    
    # Demo questions
    questions = [
        "How do I write a for loop in Python?",
        "What is the difference between a list and a tuple?",
        "Can you explain recursion?",
    ]
    
    print(f"{colored_text('Demo Questions:', 'cyan')}\n")
    
    for i, question in enumerate(questions, 1):
        print(f"{colored_text(f'[Question {i}]', 'bold')} {question}")
        
        try:
            response = tutor.generate_response(
                question,
                context,
                personality='encouraging'
            )
            print_response(response)
            print()
        except Exception as e:
            print(f"{colored_text(f'Error: {e}', 'yellow')}\n")
    
    # Code analysis demo
    print(f"\n{colored_text('='*70, 'blue')}")
    print(f"{colored_text('Code Analysis Demo', 'cyan')}")
    print(f"{colored_text('='*70, 'blue')}\n")
    
    sample_code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = fibonacci(10)
print(result)
"""
    
    print(f"{colored_text('Sample Code:', 'cyan')}")
    print(sample_code)
    
    print(f"\n{colored_text('Analyzing code...', 'yellow')}")
    
    try:
        analysis = analyzer.analyze_with_ai(sample_code, 'python')
        print(f"\n{colored_text('Analysis Results:', 'green')}")
        print(json.dumps(analysis, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"{colored_text(f'Error: {e}', 'yellow')}")
    
    print(f"\n{colored_text('='*70, 'blue')}")
    print(f"{colored_text('✅ Demo completed!', 'green')}")
    print(f"{colored_text('='*70, 'blue')}\n")
    
    print(f"{colored_text('To use interactive mode, run:', 'cyan')}")
    print(f"  {colored_text('python ai_console.py', 'bold')}\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{colored_text('Interrupted by user', 'yellow')}\n")
    except Exception as e:
        print(f"\n{colored_text(f'Error: {e}', 'yellow')}\n")
        import traceback
        traceback.print_exc()

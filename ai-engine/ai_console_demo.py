#!/usr/bin/env python3
"""
CodeMentor AI Console - Demo Mode
Non-interactive demo to show AI console capabilities
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from ai_console import AIConsole, Colors
import time

def demo_mode():
    """Run demo mode with simulated interactions"""
    
    console = AIConsole()
    
    if not console.initialize_models():
        return
    
    print(f"\n{Colors.BOLD}{Colors.CYAN}=" * 70)
    print("CodeMentor AI Console - DEMO MODE")
    print("=" * 70 + f"{Colors.ENDC}\n")
    
    # Demo 1: Basic chat
    demo_basic_chat(console)
    
    # Demo 2: Change personality
    demo_personality_change(console)
    
    # Demo 3: Set context
    demo_context_setting(console)
    
    # Demo 4: Show history
    demo_history(console)
    
    print(f"\n{Colors.GREEN}✓ Demo completed!{Colors.ENDC}")
    print(f"\n{Colors.YELLOW}To use interactive mode, run:{Colors.ENDC}")
    print(f"  {Colors.BOLD}python ai_console.py{Colors.ENDC}\n")

def demo_basic_chat(console):
    """Demo basic chat"""
    print(f"{Colors.BOLD}{Colors.CYAN}[DEMO 1] Basic Chat{Colors.ENDC}")
    print("-" * 70)
    
    question = "How do I write a simple loop in Python?"
    print(f"\n{Colors.BOLD}You:{Colors.ENDC} {question}\n")
    
    time.sleep(0.5)
    print(f"{Colors.YELLOW}Processing...{Colors.ENDC}\n")
    time.sleep(1)
    
    try:
        response = console.tutor.generate_response(question, console.context, console.personality)
        console._print_tutor_response(response)
    except Exception as e:
        print(f"{Colors.RED}Error: {e}{Colors.ENDC}")
    
    time.sleep(1)

def demo_personality_change(console):
    """Demo personality change"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}[DEMO 2] Personality Change{Colors.ENDC}")
    print("-" * 70)
    
    print(f"\n{Colors.YELLOW}Current personality: {console.personality}{Colors.ENDC}")
    
    new_personality = "analytical"
    console.set_personality(new_personality)
    
    question = "What are the advantages of using functions?"
    print(f"\n{Colors.BOLD}You:{Colors.ENDC} {question}\n")
    
    time.sleep(0.5)
    print(f"{Colors.YELLOW}Processing...{Colors.ENDC}\n")
    time.sleep(1)
    
    try:
        response = console.tutor.generate_response(question, console.context, console.personality)
        console._print_tutor_response(response)
    except Exception as e:
        print(f"{Colors.RED}Error: {e}{Colors.ENDC}")
    
    time.sleep(1)

def demo_context_setting(console):
    """Demo context setting"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}[DEMO 3] Learning Context{Colors.ENDC}")
    print("-" * 70)
    
    print(f"\n{Colors.YELLOW}Setting learning context...{Colors.ENDC}\n")
    
    console.set_context("level", "advanced")
    console.set_context("topic", "algorithms")
    console.set_context("language", "python")
    
    console.print_context()
    
    # Reset to original personality for demo
    console.set_personality("encouraging")
    
    time.sleep(1)

def demo_history(console):
    """Demo history"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}[DEMO 4] Conversation History{Colors.ENDC}")
    print("-" * 70)
    
    console.print_history()
    
    time.sleep(1)

if __name__ == '__main__':
    print(f"\n{Colors.CYAN}Starting AI Console Demo...{Colors.ENDC}\n")
    time.sleep(1)
    
    try:
        demo_mode()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Demo interrupted{Colors.ENDC}")
    except Exception as e:
        print(f"\n{Colors.RED}Error: {e}{Colors.ENDC}")
        import traceback
        traceback.print_exc()

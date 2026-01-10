#!/usr/bin/env python3
"""
CodeMentor AI - Interactive CLI Console
Direct chat with AI Engine without running the server
"""

import os
import sys
import json
import textwrap
from typing import Optional, Dict, List
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)

# ANSI Color codes
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    DIM = '\033[2m'

class AIConsole:
    """Interactive CLI console for AI Engine"""
    
    def __init__(self):
        self.personality = 'encouraging'
        self.context = {
            'current_topic': 'general programming',
            'skill_level': 'beginner',
            'language': 'python'
        }
        self.history: List[Dict] = []
        self.tutor = None
        self.analyzer = None
        self.mode = 'chat'  # 'chat' or 'analyze'
        
    def initialize_models(self):
        """Initialize AI models"""
        try:
            print(f"{Colors.CYAN}Initializing AI models...{Colors.ENDC}")
            from models import get_custom_tutor, get_custom_analyzer
            self.tutor = get_custom_tutor()
            self.analyzer = get_custom_analyzer()
            print(f"{Colors.GREEN}✓ Models initialized successfully{Colors.ENDC}\n")
            return True
        except Exception as e:
            print(f"{Colors.RED}✗ Failed to initialize models: {e}{Colors.ENDC}")
            print(f"  Make sure you have installed dependencies: pip install -r requirements.txt")
            return False
    
    def print_banner(self):
        """Print welcome banner"""
        banner = f"""
{Colors.BOLD}{Colors.CYAN}
╔════════════════════════════════════════════════════════╗
║                                                        ║
║          CodeMentor AI - Interactive Console          ║
║     AI-Powered Learning Assistant - Direct Mode      ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
{Colors.ENDC}

{Colors.GREEN}Available Commands:{Colors.ENDC}
  {Colors.BOLD}/help{Colors.ENDC}         - Show help and available commands
  {Colors.BOLD}/personality{Colors.ENDC}  - Change tutor personality
  {Colors.BOLD}/context{Colors.ENDC}      - Set learning context
  {Colors.BOLD}/analyze{Colors.ENDC}      - Switch to code analysis mode
  {Colors.BOLD}/chat{Colors.ENDC}         - Switch to chat mode
  {Colors.BOLD}/history{Colors.ENDC}      - Show conversation history
  {Colors.BOLD}/clear{Colors.ENDC}        - Clear conversation history
  {Colors.BOLD}/exit{Colors.ENDC}         - Exit the console

{Colors.YELLOW}Type your question or command to get started!{Colors.ENDC}
"""
        print(banner)
    
    def print_help(self):
        """Print help message"""
        help_text = f"""
{Colors.BOLD}Available Commands:{Colors.ENDC}

{Colors.CYAN}Chat Mode:{Colors.ENDC}
  Type any question to chat with your AI tutor
  The tutor will provide explanations and suggestions
  
  {Colors.BOLD}/personality{Colors.ENDC} <name>
    Change tutor personality:
    - {Colors.GREEN}encouraging{Colors.ENDC}   (supportive and positive)
    - {Colors.GREEN}analytical{Colors.ENDC}    (precise and logical)
    - {Colors.GREEN}creative{Colors.ENDC}      (innovative thinking)
    - {Colors.GREEN}practical{Colors.ENDC}     (real-world focused)
    
  Example: /personality analytical

{Colors.CYAN}Code Analysis Mode:{Colors.ENDC}
  {Colors.BOLD}/analyze{Colors.ENDC}
    Switch to code analysis mode and paste your code
    
  {Colors.BOLD}/chat{Colors.ENDC}
    Switch back to chat mode

{Colors.CYAN}Context Management:{Colors.ENDC}
  {Colors.BOLD}/context{Colors.ENDC} <key> <value>
    Set learning context
    - topic: current programming topic
    - level: skill level (beginner/intermediate/advanced)
    - language: programming language
    
  Example: /context topic arrays
  Example: /context level intermediate

{Colors.CYAN}Session Management:{Colors.ENDC}
  {Colors.BOLD}/history{Colors.ENDC}     - Show conversation history
  {Colors.BOLD}/clear{Colors.ENDC}       - Clear history
  {Colors.BOLD}/help{Colors.ENDC}        - Show this help
  {Colors.BOLD}/exit{Colors.ENDC}        - Exit console

{Colors.YELLOW}Current Settings:{Colors.ENDC}
  Personality: {self.personality}
  Mode: {self.mode}
  Topic: {self.context['current_topic']}
  Level: {self.context['skill_level']}
  Language: {self.context['language']}
"""
        print(help_text)
    
    def print_personality_options(self):
        """Print available personalities"""
        personalities = {
            'encouraging': 'Supportive and positive, builds confidence',
            'analytical': 'Precise and logical, focuses on problem-solving',
            'creative': 'Innovative, encourages out-of-the-box thinking',
            'practical': 'Results-oriented, focuses on real-world applications'
        }
        
        print(f"\n{Colors.BOLD}Available Personalities:{Colors.ENDC}")
        for name, description in personalities.items():
            marker = "→" if name == self.personality else " "
            print(f"  {marker} {Colors.CYAN}{name:<15}{Colors.ENDC} {Colors.DIM}{description}{Colors.ENDC}")
    
    def set_personality(self, personality: str):
        """Set tutor personality"""
        valid_personalities = ['encouraging', 'analytical', 'creative', 'practical']
        if personality not in valid_personalities:
            print(f"{Colors.RED}✗ Invalid personality: {personality}{Colors.ENDC}")
            self.print_personality_options()
            return
        
        self.personality = personality
        print(f"{Colors.GREEN}✓ Personality set to: {Colors.BOLD}{personality}{Colors.ENDC}")
    
    def set_context(self, key: str, value: str):
        """Set learning context"""
        valid_keys = ['current_topic', 'topic', 'skill_level', 'level', 'language']
        
        # Map shortcuts to full keys
        key_map = {'topic': 'current_topic', 'level': 'skill_level'}
        key = key_map.get(key, key)
        
        if key not in self.context:
            print(f"{Colors.RED}✗ Invalid context key: {key}{Colors.ENDC}")
            print(f"Valid keys: current_topic, skill_level, language")
            return
        
        self.context[key] = value
        print(f"{Colors.GREEN}✓ {key} set to: {Colors.BOLD}{value}{Colors.ENDC}")
    
    def print_context(self):
        """Print current context"""
        print(f"\n{Colors.BOLD}Current Context:{Colors.ENDC}")
        for key, value in self.context.items():
            print(f"  {Colors.CYAN}{key:<20}{Colors.ENDC} {value}")
        print(f"  {Colors.CYAN}{'personality':<20}{Colors.ENDC} {self.personality}")
        print(f"  {Colors.CYAN}{'mode':<20}{Colors.ENDC} {self.mode}\n")
    
    def chat_with_tutor(self, message: str):
        """Send message to AI tutor"""
        if not self.tutor:
            print(f"{Colors.RED}✗ Tutor not initialized{Colors.ENDC}")
            return
        
        try:
            print(f"\n{Colors.YELLOW}Processing...{Colors.ENDC}")
            
            # Get response from tutor
            response = self.tutor.generate_response(
                message,
                self.context,
                self.personality
            )
            
            # Store in history
            self.history.append({
                'timestamp': datetime.now().isoformat(),
                'user_message': message,
                'mode': 'chat',
                'personality': self.personality,
                'response': response
            })
            
            # Display response
            self._print_tutor_response(response)
            
        except Exception as e:
            print(f"{Colors.RED}✗ Error: {e}{Colors.ENDC}")
            logger.exception("Tutor error")
    
    def analyze_code(self):
        """Enter code analysis mode"""
        print(f"\n{Colors.CYAN}Enter code analysis mode{Colors.ENDC}")
        print(f"Language: {self.context['language']}")
        print(f"Paste your code (type {Colors.BOLD}END{Colors.ENDC} on a new line to finish):\n")
        
        lines = []
        while True:
            try:
                line = input()
                if line.strip() == 'END':
                    break
                lines.append(line)
            except KeyboardInterrupt:
                print(f"\n{Colors.YELLOW}Cancelled{Colors.ENDC}")
                return
        
        code = '\n'.join(lines)
        if not code.strip():
            print(f"{Colors.YELLOW}No code provided{Colors.ENDC}")
            return
        
        try:
            print(f"\n{Colors.YELLOW}Analyzing code...{Colors.ENDC}")
            
            # Analyze code
            analysis = self.analyzer.analyze_with_ai(
                code,
                self.context['language']
            )
            
            # Store in history
            self.history.append({
                'timestamp': datetime.now().isoformat(),
                'code': code,
                'mode': 'analyze',
                'language': self.context['language'],
                'analysis': analysis
            })
            
            # Display analysis
            self._print_code_analysis(analysis, code)
            
        except Exception as e:
            print(f"{Colors.RED}✗ Error analyzing code: {e}{Colors.ENDC}")
            logger.exception("Analysis error")
    
    def _print_tutor_response(self, response: Dict):
        """Pretty print tutor response"""
        print(f"\n{Colors.BOLD}{Colors.CYAN}AI Tutor:{Colors.ENDC}\n")
        
        # Main message
        if 'message' in response:
            message = response['message']
            # Wrap text to 80 characters
            wrapped = textwrap.fill(message, width=80)
            print(f"{Colors.GREEN}{wrapped}{Colors.ENDC}\n")
        
        # Suggestions
        if response.get('suggestions'):
            print(f"{Colors.BOLD}💡 Suggestions:{Colors.ENDC}")
            for suggestion in response['suggestions']:
                print(f"  {Colors.YELLOW}•{Colors.ENDC} {suggestion}")
            print()
        
        # Resources
        if response.get('resources'):
            print(f"{Colors.BOLD}📚 Learning Resources:{Colors.ENDC}")
            for resource in response['resources']:
                print(f"  {Colors.CYAN}•{Colors.ENDC} {resource.get('title', 'Resource')}")
                if resource.get('url'):
                    print(f"    {Colors.DIM}{resource['url']}{Colors.ENDC}")
            print()
        
        # Model used
        if response.get('model_used'):
            print(f"{Colors.DIM}(Model: {response['model_used']}){Colors.ENDC}\n")
    
    def _print_code_analysis(self, analysis: Dict, code: str):
        """Pretty print code analysis"""
        print(f"\n{Colors.BOLD}{Colors.CYAN}Code Analysis:{Colors.ENDC}\n")
        
        # Show code snippet
        print(f"{Colors.BOLD}Code:{Colors.ENDC}")
        lines = code.split('\n')
        for i, line in enumerate(lines[:10], 1):
            print(f"  {Colors.DIM}{i:3d}{Colors.ENDC} {line}")
        if len(lines) > 10:
            print(f"  {Colors.DIM}... ({len(lines) - 10} more lines){Colors.ENDC}")
        print()
        
        # Analysis results
        if isinstance(analysis, dict):
            for key, value in analysis.items():
                if key not in ['code', 'model_used']:
                    print(f"{Colors.BOLD}{key.replace('_', ' ').title()}:{Colors.ENDC}")
                    if isinstance(value, list):
                        for item in value:
                            print(f"  {Colors.YELLOW}•{Colors.ENDC} {item}")
                    else:
                        print(f"  {value}")
                    print()
    
    def print_history(self):
        """Print conversation history"""
        if not self.history:
            print(f"\n{Colors.YELLOW}No history yet{Colors.ENDC}\n")
            return
        
        print(f"\n{Colors.BOLD}Conversation History ({len(self.history)} items):{Colors.ENDC}\n")
        
        for i, item in enumerate(self.history, 1):
            timestamp = item.get('timestamp', '')[:19]
            mode = item.get('mode', 'unknown')
            
            print(f"{Colors.CYAN}[{i}] {timestamp} - {mode}{Colors.ENDC}")
            
            if mode == 'chat':
                user_msg = item.get('user_message', '')[:50]
                print(f"    User: {Colors.YELLOW}{user_msg}...{Colors.ENDC}")
            elif mode == 'analyze':
                lang = item.get('language', 'unknown')
                print(f"    Language: {Colors.YELLOW}{lang}{Colors.ENDC}")
            
            print()
    
    def clear_history(self):
        """Clear conversation history"""
        self.history.clear()
        print(f"{Colors.GREEN}✓ History cleared{Colors.ENDC}")
    
    def process_command(self, user_input: str):
        """Process user command"""
        user_input = user_input.strip()
        
        if user_input.startswith('/'):
            parts = user_input[1:].split(None, 2)
            command = parts[0].lower() if parts else ''
            args = parts[1:] if len(parts) > 1 else []
            
            if command == 'help':
                self.print_help()
            elif command == 'personality':
                if args:
                    self.set_personality(args[0])
                else:
                    self.print_personality_options()
            elif command == 'context':
                if len(args) >= 2:
                    self.set_context(args[0], args[1])
                else:
                    self.print_context()
            elif command == 'analyze':
                self.mode = 'analyze'
                print(f"{Colors.GREEN}✓ Switched to analysis mode{Colors.ENDC}")
                self.analyze_code()
                self.mode = 'chat'
                print(f"{Colors.GREEN}✓ Switched back to chat mode{Colors.ENDC}")
            elif command == 'chat':
                self.mode = 'chat'
                print(f"{Colors.GREEN}✓ Chat mode active{Colors.ENDC}")
            elif command == 'history':
                self.print_history()
            elif command == 'clear':
                self.clear_history()
            elif command == 'exit':
                return False
            else:
                print(f"{Colors.RED}✗ Unknown command: {command}{Colors.ENDC}")
                print(f"Type {Colors.BOLD}/help{Colors.ENDC} for available commands")
        else:
            # Regular chat message
            self.chat_with_tutor(user_input)
        
        return True
    
    def run(self):
        """Main console loop"""
        if not self.initialize_models():
            return
        
        self.print_banner()
        
        try:
            while True:
                try:
                    print(f"{Colors.BOLD}{Colors.CYAN}You:{Colors.ENDC} ", end='', flush=True)
                    user_input = input()
                    
                    if not user_input.strip():
                        continue
                    
                    should_continue = self.process_command(user_input)
                    if not should_continue:
                        break
                
                except KeyboardInterrupt:
                    print(f"\n{Colors.YELLOW}Goodbye!{Colors.ENDC}")
                    break
                except EOFError:
                    print(f"\n{Colors.YELLOW}End of input reached{Colors.ENDC}")
                    break
        
        except Exception as e:
            print(f"{Colors.RED}✗ Fatal error: {e}{Colors.ENDC}")
            logger.exception("Fatal error")
        
        finally:
            print(f"\n{Colors.CYAN}Console closed.{Colors.ENDC}")

def main():
    """Entry point"""
    console = AIConsole()
    console.run()

if __name__ == '__main__':
    main()

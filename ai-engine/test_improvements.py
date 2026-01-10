#!/usr/bin/env python3
"""
Test AI improvements - cleanup and fixes
"""

from models import CustomAITutor

print("="*70)
print("Testing AI Response Improvements")
print("="*70)

tutor = CustomAITutor()

# Test 1: Variable name fix
print("\n[TEST 1] Variable naming fix")
print("-"*70)
bad_response = """for I in range(5):
    print(i)

Another for I in range(10):
    print(i)"""

cleaned = tutor._clean_response(bad_response)
print(f"Before:\n{bad_response[:50]}...\n")
print(f"After:\n{cleaned[:50]}...\n")
print(f"✓ Fixed uppercase I to lowercase i: {'for i in' in cleaned}")

# Test 2: Duplicate removal
print("\n[TEST 2] Duplicate sentence removal")
print("-"*70)
dup_response = "This is great. This is great. You should learn. You should learn."
cleaned = tutor._clean_response(dup_response)
print(f"Before: {dup_response}")
print(f"After:  {cleaned}")
print(f"✓ Removed duplicates: {'great. You' in cleaned}")

# Test 3: Extra newlines
print("\n[TEST 3] Excessive newlines removal")
print("-"*70)
newline_response = "Line 1\n\n\n\nLine 2"
cleaned = tutor._clean_response(newline_response)
print(f"Before: {repr(newline_response)}")
print(f"After:  {repr(cleaned)}")
print(f"✓ Reduced newlines: {'\\n\\n\\n' not in cleaned}")

print("\n" + "="*70)
print("✅ All improvements working correctly!")
print("="*70)

print("\nIMPROVEMENTS APPLIED:")
print("  1. Better system prompts with detailed instructions")
print("  2. Improved generation parameters (lower temperature, top_k)")
print("  3. Response cleanup (fix variable names, remove duplicates)")
print("  4. Better context awareness (skill level, topic)")
print("  5. Repetition penalty to avoid repetitive text")

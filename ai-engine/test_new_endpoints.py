#!/usr/bin/env python3
"""
Test script for new AI endpoints
"""

import requests
import json

# Base URL (update when deployed)
BASE_URL = "http://localhost:5000"

def test_mentorship_welcome():
    """Test the mentorship welcome endpoint"""
    print("Testing /ai/mentorship/welcome...")
    
    payload = {
        "user_name": "Alex",
        "skill_level": "beginner",
        "goals": [
            "Learn Python programming",
            "Build web applications",
            "Understand algorithms"
        ]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/ai/mentorship/welcome", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ Mentorship Welcome endpoint working!")
            print(f"Model: {data.get('model')}")
            print(f"Tone: {data.get('tone')}")
            print(f"Message preview: {data.get('message', '')[:100]}...")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    print()

def test_roast_code():
    """Test the roast code endpoint"""
    print("Testing /ai/roast...")
    
    payload = {
        "code": """
def calculate_sum(numbers):
    total = 0
    for i in range(len(numbers)):
        total = total + numbers[i]
    return total
        """,
        "language": "python",
        "context": "Simple sum function"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/ai/roast", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ Roast Code endpoint working!")
            roast = data.get('roast', {})
            print(f"Model: {roast.get('model')}")
            print(f"Tone: {roast.get('tone')}")
            print(f"Overall Score: {roast.get('overall_score')}/10")
            print(f"Summary: {roast.get('brutal_summary', '')[:100]}...")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    print()

def test_quick_challenge():
    """Test the quick challenge endpoint"""
    print("Testing /ai/quick-challenge...")
    
    payload = {
        "difficulty": "easy",
        "topic": "arrays",
        "language": "python"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/ai/quick-challenge", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ Quick Challenge endpoint working!")
            challenge = data.get('challenge', {})
            print(f"Model: {challenge.get('model')}")
            print(f"Response Time: {challenge.get('response_time_ms')}ms")
            print(f"Title: {challenge.get('title')}")
            print(f"Description: {challenge.get('description')}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")
    print()

def main():
    print("=" * 60)
    print("AI Engine Endpoints Test Suite")
    print("=" * 60)
    print()
    
    test_mentorship_welcome()
    test_roast_code()
    test_quick_challenge()
    
    print("=" * 60)
    print("Testing complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()

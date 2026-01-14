"""
Rigorous Assessment Module for Junior/Middle Developer Testing
Provides hard coding challenges, mock interviews, and automated scoring
"""

import os
import json
import logging
import time
import subprocess
import tempfile
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import hashlib

logger = logging.getLogger(__name__)


class AssessmentConfig:
    """Configuration for assessment system"""
    
    # Test difficulty levels
    JUNIOR_LEVEL = 'junior'
    MIDDLE_LEVEL = 'middle'
    SENIOR_LEVEL = 'senior'
    
    # Time limits (in seconds)
    JUNIOR_TIME_LIMIT = 1800  # 30 minutes
    MIDDLE_TIME_LIMIT = 2700  # 45 minutes
    SENIOR_TIME_LIMIT = 3600  # 60 minutes
    
    # Passing scores
    JUNIOR_PASS_SCORE = 0.65
    MIDDLE_PASS_SCORE = 0.70
    SENIOR_PASS_SCORE = 0.75
    
    # Assessment storage
    ASSESSMENT_RESULTS_DIR = '/tmp/assessment_results'


class CodingChallenge:
    """Timed coding challenge with test cases"""
    
    def __init__(self, level: str, topic: str):
        self.level = level
        self.topic = topic
        self.challenges = self._load_challenge_bank()
    
    def _load_challenge_bank(self) -> Dict:
        """Load challenge bank by difficulty and topic"""
        return {
            'junior': {
                'arrays': [
                    {
                        'id': 'j_arr_001',
                        'title': 'Find Maximum in Array',
                        'description': 'Given an array of integers, find and return the maximum element.',
                        'difficulty': 'junior',
                        'time_limit': AssessmentConfig.JUNIOR_TIME_LIMIT,
                        'test_cases': [
                            {'input': '[1, 5, 3, 9, 2]', 'expected': '9'},
                            {'input': '[-1, -5, -3]', 'expected': '-1'},
                            {'input': '[42]', 'expected': '42'},
                            {'input': '[0, 0, 0, 1]', 'expected': '1'},
                        ],
                        'scoring_rubric': {
                            'correctness': 50,
                            'efficiency': 20,
                            'code_quality': 20,
                            'edge_cases': 10
                        }
                    },
                    {
                        'id': 'j_arr_002',
                        'title': 'Reverse Array',
                        'description': 'Reverse an array in-place without using built-in reverse functions.',
                        'difficulty': 'junior',
                        'time_limit': AssessmentConfig.JUNIOR_TIME_LIMIT,
                        'test_cases': [
                            {'input': '[1, 2, 3, 4, 5]', 'expected': '[5, 4, 3, 2, 1]'},
                            {'input': '[]', 'expected': '[]'},
                            {'input': '[1]', 'expected': '[1]'},
                            {'input': '[1, 2]', 'expected': '[2, 1]'},
                        ],
                        'scoring_rubric': {
                            'correctness': 50,
                            'efficiency': 20,
                            'code_quality': 20,
                            'edge_cases': 10
                        }
                    }
                ],
                'strings': [
                    {
                        'id': 'j_str_001',
                        'title': 'Palindrome Check',
                        'description': 'Check if a string is a palindrome (reads same forwards and backwards).',
                        'difficulty': 'junior',
                        'time_limit': AssessmentConfig.JUNIOR_TIME_LIMIT,
                        'test_cases': [
                            {'input': '"racecar"', 'expected': 'true'},
                            {'input': '"hello"', 'expected': 'false'},
                            {'input': '""', 'expected': 'true'},
                            {'input': '"a"', 'expected': 'true'},
                        ],
                        'scoring_rubric': {
                            'correctness': 50,
                            'efficiency': 20,
                            'code_quality': 20,
                            'edge_cases': 10
                        }
                    }
                ]
            },
            'middle': {
                'algorithms': [
                    {
                        'id': 'm_algo_001',
                        'title': 'Two Sum Problem',
                        'description': 'Given an array and a target sum, find two numbers that add up to the target. Return their indices.',
                        'difficulty': 'middle',
                        'time_limit': AssessmentConfig.MIDDLE_TIME_LIMIT,
                        'test_cases': [
                            {'input': '[2, 7, 11, 15], 9', 'expected': '[0, 1]'},
                            {'input': '[3, 2, 4], 6', 'expected': '[1, 2]'},
                            {'input': '[3, 3], 6', 'expected': '[0, 1]'},
                        ],
                        'scoring_rubric': {
                            'correctness': 40,
                            'efficiency': 30,
                            'code_quality': 20,
                            'edge_cases': 10
                        }
                    },
                    {
                        'id': 'm_algo_002',
                        'title': 'Merge Sorted Arrays',
                        'description': 'Merge two sorted arrays into one sorted array efficiently.',
                        'difficulty': 'middle',
                        'time_limit': AssessmentConfig.MIDDLE_TIME_LIMIT,
                        'test_cases': [
                            {'input': '[1, 3, 5], [2, 4, 6]', 'expected': '[1, 2, 3, 4, 5, 6]'},
                            {'input': '[], [1, 2]', 'expected': '[1, 2]'},
                            {'input': '[1], []', 'expected': '[1]'},
                        ],
                        'scoring_rubric': {
                            'correctness': 40,
                            'efficiency': 30,
                            'code_quality': 20,
                            'edge_cases': 10
                        }
                    }
                ],
                'data_structures': [
                    {
                        'id': 'm_ds_001',
                        'title': 'Valid Parentheses',
                        'description': 'Check if a string of parentheses is valid (properly opened and closed).',
                        'difficulty': 'middle',
                        'time_limit': AssessmentConfig.MIDDLE_TIME_LIMIT,
                        'test_cases': [
                            {'input': '"()"', 'expected': 'true'},
                            {'input': '"()[]{}"', 'expected': 'true'},
                            {'input': '"(]"', 'expected': 'false'},
                            {'input': '"([)]"', 'expected': 'false'},
                            {'input': '"{[]}"', 'expected': 'true'},
                        ],
                        'scoring_rubric': {
                            'correctness': 40,
                            'efficiency': 30,
                            'code_quality': 20,
                            'edge_cases': 10
                        }
                    }
                ]
            }
        }
    
    def get_challenge(self) -> Dict:
        """Get a random challenge for the specified level and topic"""
        level_challenges = self.challenges.get(self.level, {})
        topic_challenges = level_challenges.get(self.topic, [])
        
        if not topic_challenges:
            return self._get_fallback_challenge()
        
        import random
        return random.choice(topic_challenges)
    
    def _get_fallback_challenge(self) -> Dict:
        """Return a fallback challenge if no specific one found"""
        return {
            'id': 'fallback_001',
            'title': 'Basic Algorithm Challenge',
            'description': 'Implement a solution to a basic programming problem.',
            'difficulty': self.level,
            'time_limit': AssessmentConfig.JUNIOR_TIME_LIMIT,
            'test_cases': [],
            'scoring_rubric': {
                'correctness': 60,
                'code_quality': 40
            }
        }


class CodeExecutor:
    """Execute and test submitted code safely"""
    
    def __init__(self):
        self.timeout = 5  # 5 seconds max per test case
    
    def execute_code(self, code: str, language: str, test_input: str = '') -> Dict:
        """Execute code with given input and return result"""
        if language == 'python':
            return self._execute_python(code, test_input)
        elif language == 'javascript':
            return self._execute_javascript(code, test_input)
        else:
            return {'error': f'Unsupported language: {language}'}
    
    def _execute_python(self, code: str, test_input: str = '') -> Dict:
        """Execute Python code safely"""
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            # Execute with timeout
            start_time = time.time()
            result = subprocess.run(
                ['python3', temp_file],
                input=test_input,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            execution_time = time.time() - start_time
            
            # Clean up
            os.unlink(temp_file)
            
            return {
                'output': result.stdout.strip(),
                'error': result.stderr.strip() if result.returncode != 0 else None,
                'execution_time': execution_time,
                'exit_code': result.returncode
            }
            
        except subprocess.TimeoutExpired:
            os.unlink(temp_file)
            return {
                'output': '',
                'error': 'Execution timeout exceeded',
                'execution_time': self.timeout,
                'exit_code': -1
            }
        except Exception as e:
            return {
                'output': '',
                'error': str(e),
                'execution_time': 0,
                'exit_code': -1
            }
    
    def _execute_javascript(self, code: str, test_input: str = '') -> Dict:
        """Execute JavaScript code safely"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            start_time = time.time()
            result = subprocess.run(
                ['node', temp_file],
                input=test_input,
                capture_output=True,
                text=True,
                timeout=self.timeout
            )
            execution_time = time.time() - start_time
            
            os.unlink(temp_file)
            
            return {
                'output': result.stdout.strip(),
                'error': result.stderr.strip() if result.returncode != 0 else None,
                'execution_time': execution_time,
                'exit_code': result.returncode
            }
            
        except subprocess.TimeoutExpired:
            os.unlink(temp_file)
            return {
                'output': '',
                'error': 'Execution timeout exceeded',
                'execution_time': self.timeout,
                'exit_code': -1
            }
        except Exception as e:
            return {
                'output': '',
                'error': str(e),
                'execution_time': 0,
                'exit_code': -1
            }


class CodeScorer:
    """Score submitted code based on rubric"""
    
    def score_submission(self, code: str, language: str, challenge: Dict, test_results: List[Dict]) -> Dict:
        """Score code submission comprehensively"""
        rubric = challenge.get('scoring_rubric', {})
        
        scores = {}
        
        # Correctness score
        if 'correctness' in rubric:
            scores['correctness'] = self._score_correctness(test_results, rubric['correctness'])
        
        # Efficiency score
        if 'efficiency' in rubric:
            scores['efficiency'] = self._score_efficiency(code, test_results, rubric['efficiency'])
        
        # Code quality score
        if 'code_quality' in rubric:
            scores['code_quality'] = self._score_code_quality(code, language, rubric['code_quality'])
        
        # Edge cases score
        if 'edge_cases' in rubric:
            scores['edge_cases'] = self._score_edge_cases(test_results, rubric['edge_cases'])
        
        # Calculate total score
        total_score = sum(scores.values())
        
        return {
            'total_score': total_score,
            'max_score': 100,
            'percentage': total_score,
            'breakdown': scores,
            'passed': total_score >= 65  # 65% to pass
        }
    
    def _score_correctness(self, test_results: List[Dict], max_points: int) -> float:
        """Score based on test case pass rate"""
        if not test_results:
            return 0
        
        passed = sum(1 for r in test_results if r.get('passed', False))
        total = len(test_results)
        
        return (passed / total) * max_points
    
    def _score_efficiency(self, code: str, test_results: List[Dict], max_points: int) -> float:
        """Score based on time complexity and execution time"""
        # Check for efficient patterns
        score = max_points
        
        # Penalize nested loops (potential O(n^2))
        if code.count('for') >= 2 and 'for' in code:
            lines = code.split('\n')
            nested = any('for' in line and any('for' in lines[i+1:i+10] for i in range(len(lines)-1)) for line in lines)
            if nested:
                score *= 0.7
        
        # Penalize slow execution
        avg_time = sum(r.get('execution_time', 0) for r in test_results) / max(len(test_results), 1)
        if avg_time > 1.0:
            score *= 0.8
        
        return score
    
    def _score_code_quality(self, code: str, language: str, max_points: int) -> float:
        """Score based on code quality metrics"""
        score = max_points
        
        if language == 'python':
            # Check PEP8 compliance
            lines = code.split('\n')
            
            # Penalize very long lines
            long_lines = sum(1 for line in lines if len(line) > 100)
            if long_lines > 0:
                score *= 0.9
            
            # Check for proper naming
            if any(name.isupper() and len(name) > 1 for name in code.split() if name.isidentifier()):
                score *= 0.95
            
            # Reward comments and docstrings
            if '#' in code or '"""' in code or "'''" in code:
                score *= 1.05
        
        # Check for magic numbers
        import re
        numbers = re.findall(r'\b\d{2,}\b', code)
        if len(numbers) > 3:
            score *= 0.95
        
        return min(score, max_points)
    
    def _score_edge_cases(self, test_results: List[Dict], max_points: int) -> float:
        """Score based on edge case handling"""
        if not test_results:
            return 0
        
        # Check if edge case tests passed
        edge_case_results = [r for r in test_results if r.get('is_edge_case', False)]
        if not edge_case_results:
            return max_points * 0.5  # Half points if no edge cases tested
        
        passed = sum(1 for r in edge_case_results if r.get('passed', False))
        total = len(edge_case_results)
        
        return (passed / total) * max_points


class MockInterview:
    """Simulated technical interview system"""
    
    def __init__(self, level: str):
        self.level = level
        self.questions = self._load_interview_questions()
    
    def _load_interview_questions(self) -> List[Dict]:
        """Load interview questions by level"""
        questions = {
            'junior': [
                {
                    'id': 'int_j_001',
                    'category': 'algorithms',
                    'question': 'What is the difference between an array and a linked list?',
                    'expected_points': ['contiguous memory', 'dynamic size', 'access time O(1) vs O(n)'],
                    'difficulty': 'junior'
                },
                {
                    'id': 'int_j_002',
                    'category': 'algorithms',
                    'question': 'Explain what Big O notation is and why it matters.',
                    'expected_points': ['time complexity', 'scalability', 'algorithm efficiency'],
                    'difficulty': 'junior'
                },
                {
                    'id': 'int_j_003',
                    'category': 'problem_solving',
                    'question': 'How would you debug a program that crashes intermittently?',
                    'expected_points': ['logging', 'reproduce the issue', 'check error messages', 'isolate the problem'],
                    'difficulty': 'junior'
                }
            ],
            'middle': [
                {
                    'id': 'int_m_001',
                    'category': 'system_design',
                    'question': 'How would you design a URL shortening service like bit.ly?',
                    'expected_points': ['hash function', 'database design', 'scalability', 'collision handling'],
                    'difficulty': 'middle'
                },
                {
                    'id': 'int_m_002',
                    'category': 'algorithms',
                    'question': 'Explain different sorting algorithms and their time complexities.',
                    'expected_points': ['quicksort O(n log n)', 'mergesort', 'bubblesort O(n^2)', 'trade-offs'],
                    'difficulty': 'middle'
                },
                {
                    'id': 'int_m_003',
                    'category': 'architecture',
                    'question': 'What is the difference between SQL and NoSQL databases? When would you use each?',
                    'expected_points': ['ACID properties', 'scalability', 'schema flexibility', 'use cases'],
                    'difficulty': 'middle'
                }
            ]
        }
        
        return questions.get(self.level, questions['junior'])
    
    def get_questions(self, count: int = 5) -> List[Dict]:
        """Get interview questions"""
        import random
        return random.sample(self.questions, min(count, len(self.questions)))
    
    def score_answer(self, question_id: str, answer: str) -> Dict:
        """Score interview answer using AI"""
        question = next((q for q in self.questions if q['id'] == question_id), None)
        
        if not question:
            return {'error': 'Question not found'}
        
        expected_points = question.get('expected_points', [])
        
        # Simple keyword-based scoring (could be enhanced with AI)
        answer_lower = answer.lower()
        points_covered = sum(1 for point in expected_points if any(keyword in answer_lower for keyword in point.lower().split()))
        
        score = (points_covered / len(expected_points)) * 100 if expected_points else 0
        
        return {
            'question_id': question_id,
            'score': score,
            'points_covered': points_covered,
            'total_points': len(expected_points),
            'feedback': self._generate_feedback(score, expected_points, answer)
        }
    
    def _generate_feedback(self, score: float, expected_points: List[str], answer: str) -> str:
        """Generate feedback for interview answer"""
        if score >= 80:
            return "Excellent answer! You covered the key points well."
        elif score >= 60:
            return f"Good answer, but consider mentioning: {', '.join(expected_points[:2])}"
        else:
            return f"Your answer needs improvement. Key points to cover: {', '.join(expected_points)}"


class AssessmentEngine:
    """Main assessment engine coordinating all assessment activities"""
    
    def __init__(self):
        self.executor = CodeExecutor()
        self.scorer = CodeScorer()
        os.makedirs(AssessmentConfig.ASSESSMENT_RESULTS_DIR, exist_ok=True)
    
    def start_code_test(self, user_id: str, level: str, topic: str) -> Dict:
        """Start a timed coding test"""
        challenge_gen = CodingChallenge(level, topic)
        challenge = challenge_gen.get_challenge()
        
        test_session = {
            'session_id': hashlib.md5(f"{user_id}{datetime.now().isoformat()}".encode()).hexdigest()[:12],
            'user_id': user_id,
            'level': level,
            'topic': topic,
            'challenge': challenge,
            'start_time': datetime.now().isoformat(),
            'time_limit': challenge['time_limit'],
            'status': 'in_progress'
        }
        
        # Save session
        self._save_session(test_session)
        
        return {
            'session_id': test_session['session_id'],
            'challenge': {
                'id': challenge['id'],
                'title': challenge['title'],
                'description': challenge['description'],
                'time_limit': challenge['time_limit'],
                'difficulty': challenge['difficulty']
            }
        }
    
    def submit_code_test(self, session_id: str, code: str, language: str) -> Dict:
        """Submit code for testing"""
        session = self._load_session(session_id)
        
        if not session:
            return {'error': 'Session not found'}
        
        # Check if time limit exceeded
        start_time = datetime.fromisoformat(session['start_time'])
        elapsed = (datetime.now() - start_time).total_seconds()
        
        if elapsed > session['time_limit']:
            return {
                'error': 'Time limit exceeded',
                'time_taken': elapsed,
                'time_limit': session['time_limit']
            }
        
        # Run test cases
        challenge = session['challenge']
        test_results = []
        
        for i, test_case in enumerate(challenge['test_cases']):
            result = self.executor.execute_code(code, language, test_case['input'])
            
            passed = result.get('output') == test_case['expected'] and result.get('error') is None
            
            test_results.append({
                'test_case': i + 1,
                'input': test_case['input'],
                'expected': test_case['expected'],
                'actual': result.get('output'),
                'passed': passed,
                'execution_time': result.get('execution_time', 0),
                'error': result.get('error'),
                'is_edge_case': i >= len(challenge['test_cases']) - 2  # Last 2 are edge cases
            })
        
        # Score the submission
        score_data = self.scorer.score_submission(code, language, challenge, test_results)
        
        # Update session
        session['status'] = 'completed'
        session['end_time'] = datetime.now().isoformat()
        session['time_taken'] = elapsed
        session['code'] = code
        session['test_results'] = test_results
        session['score'] = score_data
        
        self._save_session(session)
        
        return {
            'session_id': session_id,
            'score': score_data,
            'test_results': test_results,
            'time_taken': elapsed,
            'passed': score_data['passed']
        }
    
    def start_interview(self, user_id: str, level: str) -> Dict:
        """Start mock interview session"""
        interview = MockInterview(level)
        questions = interview.get_questions()
        
        session = {
            'session_id': hashlib.md5(f"int_{user_id}{datetime.now().isoformat()}".encode()).hexdigest()[:12],
            'user_id': user_id,
            'level': level,
            'type': 'interview',
            'questions': questions,
            'start_time': datetime.now().isoformat(),
            'answers': {},
            'status': 'in_progress'
        }
        
        self._save_session(session)
        
        return {
            'session_id': session['session_id'],
            'questions': [
                {
                    'id': q['id'],
                    'category': q['category'],
                    'question': q['question']
                }
                for q in questions
            ]
        }
    
    def submit_interview_answer(self, session_id: str, question_id: str, answer: str) -> Dict:
        """Submit answer to interview question"""
        session = self._load_session(session_id)
        
        if not session:
            return {'error': 'Session not found'}
        
        interview = MockInterview(session['level'])
        score_data = interview.score_answer(question_id, answer)
        
        session['answers'][question_id] = {
            'answer': answer,
            'score': score_data,
            'timestamp': datetime.now().isoformat()
        }
        
        self._save_session(session)
        
        return score_data
    
    def complete_interview(self, session_id: str) -> Dict:
        """Complete interview and generate final report"""
        session = self._load_session(session_id)
        
        if not session:
            return {'error': 'Session not found'}
        
        # Calculate overall score
        answers = session.get('answers', {})
        total_score = sum(a['score']['score'] for a in answers.values()) / max(len(answers), 1)
        
        session['status'] = 'completed'
        session['end_time'] = datetime.now().isoformat()
        session['total_score'] = total_score
        
        pass_threshold = AssessmentConfig.MIDDLE_PASS_SCORE * 100 if session['level'] == 'middle' else AssessmentConfig.JUNIOR_PASS_SCORE * 100
        session['passed'] = total_score >= pass_threshold
        
        self._save_session(session)
        
        return {
            'session_id': session_id,
            'total_score': total_score,
            'passed': session['passed'],
            'level': session['level'],
            'answers_scored': len(answers),
            'recommendation': self._generate_recommendation(total_score, session['level'])
        }
    
    def _generate_recommendation(self, score: float, level: str) -> str:
        """Generate assessment recommendation"""
        if score >= 85:
            return f"Excellent performance! Ready for {level} position and beyond."
        elif score >= 70:
            return f"Good performance. Ready for {level} position with some areas for improvement."
        elif score >= 60:
            return f"Fair performance. May need additional preparation for {level} position."
        else:
            return f"Needs significant improvement. Not yet ready for {level} position. Recommend more practice in algorithms and data structures."
    
    def _save_session(self, session: Dict):
        """Save session data"""
        session_file = os.path.join(AssessmentConfig.ASSESSMENT_RESULTS_DIR, f"{session['session_id']}.json")
        with open(session_file, 'w') as f:
            json.dump(session, f, indent=2)
    
    def _load_session(self, session_id: str) -> Optional[Dict]:
        """Load session data"""
        session_file = os.path.join(AssessmentConfig.ASSESSMENT_RESULTS_DIR, f"{session_id}.json")
        if os.path.exists(session_file):
            with open(session_file, 'r') as f:
                return json.load(f)
        return None
    
    def get_user_report(self, user_id: str) -> Dict:
        """Generate comprehensive report for user"""
        # Load all sessions for user
        sessions = []
        for filename in os.listdir(AssessmentConfig.ASSESSMENT_RESULTS_DIR):
            if filename.endswith('.json'):
                session = self._load_session(filename[:-5])
                if session and session.get('user_id') == user_id:
                    sessions.append(session)
        
        if not sessions:
            return {'error': 'No assessment data found for user'}
        
        # Calculate stats
        completed_tests = [s for s in sessions if s.get('status') == 'completed' and s.get('type') != 'interview']
        completed_interviews = [s for s in sessions if s.get('status') == 'completed' and s.get('type') == 'interview']
        
        avg_test_score = sum(s.get('score', {}).get('percentage', 0) for s in completed_tests) / max(len(completed_tests), 1)
        avg_interview_score = sum(s.get('total_score', 0) for s in completed_interviews) / max(len(completed_interviews), 1)
        
        return {
            'user_id': user_id,
            'total_assessments': len(sessions),
            'completed_tests': len(completed_tests),
            'completed_interviews': len(completed_interviews),
            'average_test_score': avg_test_score,
            'average_interview_score': avg_interview_score,
            'strong_areas': self._identify_strong_areas(sessions),
            'weak_areas': self._identify_weak_areas(sessions),
            'readiness_level': self._determine_readiness(avg_test_score, avg_interview_score)
        }
    
    def _identify_strong_areas(self, sessions: List[Dict]) -> List[str]:
        """Identify user's strong areas"""
        # Simple implementation - would be more sophisticated in production
        return ['Problem solving', 'Code quality']
    
    def _identify_weak_areas(self, sessions: List[Dict]) -> List[str]:
        """Identify user's weak areas"""
        return ['Algorithm efficiency', 'Edge case handling']
    
    def _determine_readiness(self, test_score: float, interview_score: float) -> str:
        """Determine overall readiness level"""
        avg_score = (test_score + interview_score) / 2
        
        if avg_score >= 75:
            return 'Ready for middle-level position'
        elif avg_score >= 65:
            return 'Ready for junior position, approaching middle level'
        else:
            return 'Not yet ready - recommend more practice'

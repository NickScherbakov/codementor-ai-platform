'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  category: string;
  question: string;
}

interface InterviewSession {
  session_id: string;
  questions: Question[];
}

export default function InterviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionScores, setQuestionScores] = useState<{ [key: string]: any }>({});
  const [finalReport, setFinalReport] = useState<any>(null);
  const [level, setLevel] = useState('junior');

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessment/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo_user_' + Date.now(),
          level
        })
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.data.interview_session);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setQuestionScores({});
      } else {
        alert('Failed to start interview: ' + data.error);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!session || !currentAnswer.trim()) return;

    const currentQuestion = session.questions[currentQuestionIndex];
    
    setLoading(true);
    try {
      const response = await fetch('/api/assessment/interview/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.session_id,
          questionId: currentQuestion.id,
          answer: currentAnswer
        })
      });

      const data = await response.json();
      if (data.success) {
        setAnswers({ ...answers, [currentQuestion.id]: currentAnswer });
        setQuestionScores({ ...questionScores, [currentQuestion.id]: data.data.score });
        setCurrentAnswer('');
        
        if (currentQuestionIndex < session.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } else {
        alert('Failed to submit answer: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const completeInterview = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const response = await fetch('/api/assessment/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.session_id
        })
      });

      const data = await response.json();
      if (data.success) {
        setFinalReport(data.data.report);
      } else {
        alert('Failed to complete interview: ' + data.error);
      }
    } catch (error) {
      console.error('Error completing interview:', error);
      alert('Failed to complete interview');
    } finally {
      setLoading(false);
    }
  };

  if (finalReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Interview Complete!</h1>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Overall Score</h2>
                <div className={`text-3xl font-bold ${finalReport.passed ? 'text-green-600' : 'text-orange-600'}`}>
                  {finalReport.total_score?.toFixed(1)}%
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className={`h-4 rounded-full ${finalReport.passed ? 'bg-green-500' : 'bg-orange-500'}`}
                  style={{ width: `${finalReport.total_score}%` }}
                ></div>
              </div>
              
              <p className="text-lg mb-4">
                {finalReport.passed ? (
                  <span className="text-green-600 font-semibold">✓ Passed Interview</span>
                ) : (
                  <span className="text-orange-600 font-semibold">⚠ Needs Improvement</span>
                )}
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Recommendation</h3>
                <p className="text-gray-700">{finalReport.recommendation}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Question Scores</h3>
              <div className="space-y-3">
                {session?.questions.map((question, idx) => {
                  const score = questionScores[question.id];
                  return (
                    <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Question {idx + 1}: {question.category}</span>
                        <span className="text-indigo-600 font-bold">
                          {score?.score?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{question.question}</p>
                      {score?.feedback && (
                        <p className="text-sm text-gray-500 italic">{score.feedback}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSession(null);
                  setFinalReport(null);
                  setAnswers({});
                  setQuestionScores({});
                  setCurrentQuestionIndex(0);
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Take Another Interview
              </button>
              <button
                onClick={() => router.push('/assessment')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Mock Technical Interview</h1>
            
            <p className="text-gray-600 mb-8">
              Practice your technical interview skills with AI-powered mock interviews. 
              Answer questions on algorithms, system design, and problem-solving.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="junior">Junior Developer</option>
                  <option value="middle">Middle Developer</option>
                </select>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What to Expect:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>5 technical questions covering various topics</li>
                  <li>Questions on algorithms, data structures, and system design</li>
                  <li>AI-powered scoring and feedback</li>
                  <li>Comprehensive report at the end</li>
                </ul>
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Starting Interview...' : 'Start Interview'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === session.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Mock Interview</h1>
            <span className="text-gray-600">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </span>
          </div>

          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              {currentQuestion.category}
            </span>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Type your answer here..."
            />
          </div>

          <div className="flex gap-4">
            {!allQuestionsAnswered ? (
              <>
                <button
                  onClick={submitAnswer}
                  disabled={loading || !currentAnswer.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Submitting...' : isLastQuestion ? 'Submit Last Answer' : 'Submit & Next'}
                </button>
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={completeInterview}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Completing...' : 'Complete Interview'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

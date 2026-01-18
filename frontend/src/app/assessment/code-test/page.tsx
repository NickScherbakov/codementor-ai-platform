'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Challenge {
  id: string;
  title: string;
  description: string;
  time_limit: number;
  difficulty: string;
}

interface TestSession {
  session_id: string;
  challenge: Challenge;
}

export default function CodeTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<TestSession | null>(null);
  const [code, setCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testResults, setTestResults] = useState<any>(null);
  const [level, setLevel] = useState('junior');
  const [topic, setTopic] = useState('arrays');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (session && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session, timeRemaining]);

  const startTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessment/code-test/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo_user_' + Date.now(),
          level,
          topic
        })
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.data.test_session);
        setTimeRemaining(data.data.test_session.challenge.time_limit);
        setCode('# Write your solution here\n\n');
      } else {
        alert('Failed to start test: ' + data.error);
      }
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test');
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const response = await fetch('/api/assessment/code-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.session_id,
          code,
          language: 'python'
        })
      });

      const data = await response.json();
      if (data.success) {
        setTestResults(data.data.result);
      } else {
        alert('Failed to submit code: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Failed to submit code');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = () => {
    if (code && !testResults) {
      submitCode();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (testResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Test Results</h1>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Overall Score</h2>
                <div className={`text-3xl font-bold ${testResults.score?.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {testResults.score?.percentage.toFixed(1)}%
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className={`h-4 rounded-full ${testResults.score?.passed ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${testResults.score?.percentage}%` }}
                ></div>
              </div>
              
              <p className="text-lg">
                {testResults.score?.passed ? (
                  <span className="text-green-600 font-semibold">✓ Passed!</span>
                ) : (
                  <span className="text-red-600 font-semibold">✗ Not Passed</span>
                )}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(testResults.score?.breakdown || {}).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                    <div className="text-2xl font-bold text-indigo-600">{(value as number).toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
              <div className="space-y-3">
                {testResults.test_results?.map((test: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${test.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Test Case {test.test_case}</span>
                      <span className={test.passed ? 'text-green-600' : 'text-red-600'}>
                        {test.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </div>
                    {!test.passed && (
                      <div className="text-sm text-gray-600">
                        <p>Expected: {test.expected}</p>
                        <p>Got: {test.actual}</p>
                        {test.error && <p className="text-red-600 mt-1">Error: {test.error}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSession(null);
                  setTestResults(null);
                  setCode('');
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Take Another Test
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Code Assessment Test</h1>
            
            <p className="text-gray-600 mb-8">
              Take a timed coding challenge to assess your programming skills. 
              Choose your level and topic to get started.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="arrays">Arrays</option>
                  <option value="strings">Strings</option>
                  <option value="algorithms">Algorithms</option>
                  <option value="data_structures">Data Structures</option>
                </select>
              </div>
            </div>

            <button
              onClick={startTest}
              disabled={loading}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Starting Test...' : 'Start Test'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {session.challenge.title}
            </h1>
            <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-indigo-600'}`}>
              Time: {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {session.challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{session.challenge.description}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Solution (Python)
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Write your code here..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={submitCode}
              disabled={loading || !code.trim()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Solution'}
            </button>
            <button
              onClick={() => setSession(null)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

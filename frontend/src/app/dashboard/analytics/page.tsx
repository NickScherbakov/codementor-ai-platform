'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SkillGap {
  category: string;
  successRate: number;
  attempts: number;
}

interface CategoryPerformance {
  category: string;
  successRate: number;
  total: number;
  passed: number;
}

interface AnalyticsData {
  skillGaps: SkillGap[];
  categoryPerformance: Record<string, CategoryPerformance>;
  overallStats: {
    totalChallenges: number;
    passRate: number;
    strongestCategory: {
      category: string;
      successRate: number;
    };
  };
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // In production, this would call the real API
      // const response = await fetch('/api/ai-hints/skill-gaps', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Mock data for demonstration
      const mockData: AnalyticsData = {
        skillGaps: [
          { category: 'algorithms', successRate: 45, attempts: 12 },
          { category: 'data-structures', successRate: 62, attempts: 8 },
          { category: 'dynamic-programming', successRate: 38, attempts: 5 },
        ],
        categoryPerformance: {
          'algorithms': { category: 'algorithms', successRate: 45, total: 12, passed: 5 },
          'data-structures': { category: 'data-structures', successRate: 62, total: 8, passed: 5 },
          'web-development': { category: 'web-development', successRate: 85, total: 10, passed: 8 },
          'dynamic-programming': { category: 'dynamic-programming', successRate: 38, total: 5, passed: 2 },
        },
        overallStats: {
          totalChallenges: 35,
          passRate: 58,
          strongestCategory: {
            category: 'web-development',
            successRate: 85,
          },
        },
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available yet. Start solving challenges!</p>
      </div>
    );
  }

  const getPerformanceColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressBarColor = (rate: number) => {
    if (rate >= 70) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your progress, identify skill gaps, and optimize your learning path
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {(['week', 'month', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range === 'week' ? 'Last Week' : range === 'month' ? 'Last Month' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Challenges</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.overallStats.totalChallenges}</p>
          <p className="mt-1 text-sm text-gray-500">Attempted so far</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pass Rate</h3>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analyticsData.overallStats.passRate}%</p>
          <p className="mt-1 text-sm text-gray-500">Overall success rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Strongest Category</h3>
            <span className="text-2xl">💪</span>
          </div>
          <p className="text-xl font-bold text-gray-900 capitalize">
            {analyticsData.overallStats.strongestCategory?.category.replace(/-/g, ' ')}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {analyticsData.overallStats.strongestCategory?.successRate}% success
          </p>
        </motion.div>
      </div>

      {/* Skill Gaps Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">🎯 Skill Gaps to Address</h2>
          <span className="text-sm text-gray-500">Focus areas for improvement</span>
        </div>

        {analyticsData.skillGaps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Great job! No significant skill gaps detected.</p>
            <p className="text-sm mt-2">Keep up the excellent work! 🎉</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyticsData.skillGaps.map((gap, index) => (
              <motion.div
                key={gap.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`border rounded-lg p-4 ${getPerformanceColor(gap.successRate)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold capitalize">
                      {gap.category.replace(/-/g, ' ')}
                    </h3>
                    <p className="text-sm opacity-80">{gap.attempts} attempts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{gap.successRate}%</p>
                    <p className="text-xs opacity-80">success rate</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-white/50 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(gap.successRate)}`}
                    style={{ width: `${gap.successRate}%` }}
                  />
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-3 py-1 bg-white/70 rounded-full font-medium hover:bg-white transition-colors">
                    Practice More
                  </button>
                  <button className="text-xs px-3 py-1 bg-white/70 rounded-full font-medium hover:bg-white transition-colors">
                    Get AI Hints
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Category Performance Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Performance by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(analyticsData.categoryPerformance).map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {category.category.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.passed} / {category.total} passed
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(category.successRate)}`}>
                  {category.successRate}%
                </div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(category.successRate)}`}
                  style={{ width: `${category.successRate}%` }}
                />
              </div>

              <div className="mt-3 flex gap-2">
                <button className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors">
                  View Challenges
                </button>
                {category.successRate < 70 && (
                  <button className="text-xs px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-medium hover:bg-orange-100 transition-colors">
                    Get Help
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">💡 AI-Powered Insights</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-medium text-gray-900">Focus Recommendation</p>
              <p className="text-sm text-gray-700">
                Concentrate on algorithms and dynamic programming for the next week. Your success rate will improve significantly with targeted practice.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-medium text-gray-900">Learning Pattern</p>
              <p className="text-sm text-gray-700">
                You perform best on web-development challenges. Use this confidence to tackle similar problems in other categories.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-medium text-gray-900">Next Steps</p>
              <p className="text-sm text-gray-700">
                Try 3 more algorithm challenges this week. Use the AI hint system when stuck for more than 10 minutes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

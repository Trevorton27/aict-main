// apps/web/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { MasteryProgress } from '../components/ProgressBar';
import Link from 'next/link';

interface ProgressData {
  concept: string;
  description: string;
  difficulty: number;
  mastery: number;
  attempts: number;
  successes: number;
  successRate: string;
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Get actual user ID from auth
  const userId = 'demo-user';

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const res = await fetch(`/api/mastery?userId=${userId}`);
      const data = await res.json();
      setProgress(data.progress || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const overallMastery = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.mastery, 0) / progress.length)
    : 800;

  const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
  const totalSuccesses = progress.reduce((sum, p) => sum + p.successes, 0);
  const overallSuccessRate = totalAttempts > 0 
    ? ((totalSuccesses / totalAttempts) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Track your learning progress</p>
          </div>
          <Link
            href="/learn"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Learning
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">Overall Mastery</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{overallMastery}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">600 - 1800 scale</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">Total Attempts</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{totalAttempts}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">{totalSuccesses} successful</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">Success Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{overallSuccessRate}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">Across all concepts</p>
          </div>
        </div>

        {/* Concept Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Concept Mastery</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8 transition-colors">Loading progress...</p>
            ) : progress.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">No progress yet</p>
                <Link
                  href="/learn"
                  className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                  Start your first task →
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {progress.map((item) => (
                  <div key={item.concept} className="space-y-2">
                    <MasteryProgress
                      mastery={item.mastery}
                      conceptName={item.concept}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      <span>{item.attempts} attempts</span>
                      <span>{item.successRate}% success rate</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
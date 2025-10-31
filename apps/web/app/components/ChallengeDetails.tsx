"use client";

import { useState } from "react";

interface ChallengeDetailsProps {
  task: {
    title: string;
    description: string;
    detailedDescription?: string;
    realWorldContext?: string;
    tests: Array<{ id: string; code: string; label?: string }>;
    hints?: Array<{
      level: number;
      text: string;
    }>;
    solution?: Record<string, string>;
    alternativeSolutions?: Array<{
      label: string;
      files: Record<string, string>;
      explanation: string;
    }>;
  };
  onApplySolution?: (files: Record<string, string>) => void;
  attemptCount?: number;
  requiredAttempts?: number;
}

export function ChallengeDetails({
  task,
  onApplySolution,
  attemptCount = 0,
  requiredAttempts = 3
}: ChallengeDetailsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "tests" | "hints" | "solutions" | "context">("description");
  const solutionsUnlocked = attemptCount >= requiredAttempts;

  // Calculate total solutions count (main solution + alternatives)
  const solutionsCount = (task.solution ? 1 : 0) + (task.alternativeSolutions?.length || 0);

  const tabs = [
    { id: "description" as const, label: "Description", icon: "📝" },
    { id: "tests" as const, label: "Tests", icon: "✓", count: task.tests.length },
    { id: "hints" as const, label: "Hints", icon: "💡", count: task.hints?.length || 0 },
    { id: "solutions" as const, label: "Solutions", icon: "🔑", count: solutionsCount },
    { id: "context" as const, label: "Real World", icon: "🌍" },
  ];

  return (
    <div className="h-full flex flex-col bg-light-panel dark:bg-gray-800 transition-colors">
      {/* Tabs - Modern Pill Style */}
      <div className="flex flex-wrap border-b border-light-border dark:border-gray-700 px-4 py-3 bg-gradient-to-b from-light-header-start to-light-header-end dark:from-gray-700 dark:to-gray-700 transition-colors gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-accent-purple-light to-accent-indigo dark:bg-blue-500 text-white shadow-button-light"
                  : "text-text-light-body dark:text-gray-400 hover:text-text-light-heading dark:hover:text-white hover:bg-white dark:hover:bg-gray-600 border border-light-border dark:border-gray-600"
              }
            `}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
            {'count' in tab && tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/30 dark:bg-gray-600 text-current transition-colors">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "description" && (
          <div className="space-y-4 animate-fade-slide-in">
            <div>
              <h3 className="text-lg font-bold text-text-light-heading dark:text-white mb-3 transition-colors">{task.title}</h3>
              {task.detailedDescription ? (
                <div className="prose prose-sm max-w-none text-text-light-body dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {task.detailedDescription}
                </div>
              ) : (
                <p className="text-text-light-body dark:text-gray-300 transition-colors leading-relaxed">{task.description}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "tests" && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center transition-colors">
                <span className="mr-2">ℹ️</span>
                About Tests
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors">
                These are the criteria your code needs to meet. Tests run automatically when you click "Run Tests" or through the AI tutor.
                You can view them here but they cannot be edited.
              </p>
            </div>

            <div className="space-y-3">
              {task.tests.map((test, index) => (
                <div key={test.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-semibold transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors">
                        {test.label || `Test ${index + 1}`}
                      </h5>
                      <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                        {test.code}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "hints" && (
          <div className="space-y-4">
            {!task.hints || task.hints.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">
                <p className="text-lg mb-2">💡 No hints available</p>
                <p className="text-sm">Try solving the challenge! Ask the AI tutor if you need help.</p>
              </div>
            ) : (
              <>
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-colors">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center transition-colors">
                    <span className="mr-2">💡</span>
                    Progressive Hints
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 transition-colors">
                    Hints are organized by difficulty. Start with Level 1 and progress if you need more help.
                  </p>
                </div>

                <div className="space-y-3">
                  {task.hints.map((hint, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/40 dark:to-orange-900/40 px-4 py-3 border-b border-gray-200 dark:border-gray-700 transition-colors">
                        <h5 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 dark:bg-yellow-600 text-white flex items-center justify-center text-sm font-bold">
                            {hint.level}
                          </span>
                          Level {hint.level}
                        </h5>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 transition-colors">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap transition-colors">
                          {hint.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "solutions" && (
          <div className="space-y-4">
            {!solutionsUnlocked ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">
                <p className="text-lg mb-2">🔒 Solutions Locked</p>
                <p className="text-sm mb-4">
                  Complete {requiredAttempts - attemptCount} more attempt{requiredAttempts - attemptCount === 1 ? '' : 's'} to unlock solutions.
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: requiredAttempts }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
                        i < attemptCount
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {i < attemptCount ? '✓' : i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                  Attempts: {attemptCount} / {requiredAttempts}
                </p>
                <p className="text-sm mt-4 text-gray-600 dark:text-gray-400 transition-colors">
                  Try solving the challenge first! Click "Run Tests" to make an attempt.
                  <br />
                  Ask the AI tutor for hints if you need help.
                </p>
              </div>
            ) : !task.solution && (!task.alternativeSolutions || task.alternativeSolutions.length === 0) ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">
                <p className="text-lg mb-2">💡 No solutions available</p>
                <p className="text-sm">This challenge doesn't have solution examples yet.</p>
              </div>
            ) : (
              <>
                <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6 transition-colors">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center transition-colors">
                    <span className="mr-2">💡</span>
                    {task.alternativeSolutions && task.alternativeSolutions.length > 0 ? 'Multiple Approaches' : 'Solution'}
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-300 transition-colors">
                    {task.alternativeSolutions && task.alternativeSolutions.length > 0
                      ? "There's often more than one way to solve a problem! Each approach below shows a different method with its own trade-offs."
                      : "Review the solution code below to understand how to solve this challenge."}
                  </p>
                </div>

                {/* Main Solution */}
                {task.solution && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4 transition-colors">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40 px-4 py-3 border-b border-gray-200 dark:border-gray-700 transition-colors">
                      <h5 className="font-semibold text-gray-900 dark:text-white flex items-center justify-between transition-colors">
                        <span>Reference Solution</span>
                        {onApplySolution && (
                          <button
                            onClick={() => onApplySolution(task.solution!)}
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                          >
                            Apply to Editor
                          </button>
                        )}
                      </h5>
                    </div>
                    <div className="p-4 space-y-4 bg-white dark:bg-gray-800 transition-colors">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">
                        A straightforward solution that demonstrates the key concepts.
                      </p>
                      <div className="space-y-2">
                        {Object.entries(task.solution).map(([filename, code]) => {
                          if (!code || code.trim() === "") return null;
                          return (
                            <details key={filename} className="group" open={filename === 'index.html'}>
                              <summary className="cursor-pointer font-mono text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded transition-colors">
                                <span className="text-gray-400 dark:text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                                {filename}
                              </summary>
                              <div className="mt-2 bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                                <pre>{code}</pre>
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Alternative Solutions */}
                {task.alternativeSolutions && task.alternativeSolutions.map((solution, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40 px-4 py-3 border-b border-gray-200 dark:border-gray-700 transition-colors">
                      <h5 className="font-semibold text-gray-900 dark:text-white flex items-center justify-between transition-colors">
                        <span>{solution.label}</span>
                        {onApplySolution && (
                          <button
                            onClick={() => onApplySolution(solution.files)}
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                          >
                            Apply to Editor
                          </button>
                        )}
                      </h5>
                    </div>
                    <div className="p-4 space-y-4 bg-white dark:bg-gray-800 transition-colors">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">
                        {solution.explanation}
                      </p>
                      <div className="space-y-2">
                        {Object.entries(solution.files).map(([filename, code]) => {
                          if (!code || code.trim() === "") return null;
                          return (
                            <details key={filename} className="group">
                              <summary className="cursor-pointer font-mono text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded transition-colors">
                                <span className="text-gray-400 dark:text-gray-500 group-open:rotate-90 transition-transform">▶</span>
                                {filename}
                              </summary>
                              <div className="mt-2 bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                                <pre>{code}</pre>
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === "context" && (
          <div className="space-y-4">
            {task.realWorldContext ? (
              <>
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-colors">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center transition-colors">
                    <span className="mr-2">🌍</span>
                    Why This Matters
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-300 transition-colors">
                    Understanding how skills connect to real-world development helps you see the bigger picture.
                  </p>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap transition-colors">
                  {task.realWorldContext}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">
                <p className="text-lg mb-2">📚 Context coming soon</p>
                <p className="text-sm">Real-world examples and use cases will be added here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// apps/web/app/components/TestPanel.tsx
"use client";

import { useState } from "react";

interface TestResult {
  passed: boolean;
  passedIds: string[];
  failedIds: string[];
  messages: Record<string, string>;
  testLabels?: Record<string, string>;
  errorDetails?: Record<string, {
    stderr?: string;
    stackTrace?: string;
    domState?: string;
    consoleOutput?: string[];
    errorType?: 'runtime' | 'assertion' | 'syntax';
  }>;
}

interface TestPanelProps {
  result: TestResult | null;
  onRunTests?: () => void;
  isRunning?: boolean;
}

export function TestPanel({ result, onRunTests, isRunning }: TestPanelProps) {
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  const toggleExpanded = (testId: string) => {
    setExpandedTests(prev => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No tests run yet</p>
          {onRunTests && (
            <button
              onClick={onRunTests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Run Tests
            </button>
          )}
        </div>
      </div>
    );
  }

  const allTestIds = [...result.passedIds, ...result.failedIds];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 border-b border-gray-300 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">
            {result.passed ? "✅" : "❌"} Tests
          </span>
          <span className="text-sm text-gray-600">
            {result.passedIds.length} / {allTestIds.length} passed
          </span>
        </div>
        {onRunTests && (
          <button
            onClick={onRunTests}
            disabled={isRunning}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isRunning ? "Running..." : "Re-run"}
          </button>
        )}
      </div>
      {/* Overall Status */}
      <div
        className={`px-4 py-3 ${
          result.passed ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <p
          className={`text-sm font-medium ${
            result.passed ? "text-green-800" : "text-red-800"
          }`}
        >
          {result.passed
            ? "All tests passed! 🎉"
            : "Some tests failed. Keep going!"}
        </p>
      </div>

      {/* Test List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {allTestIds.map(testId => {
          const passed = result.passedIds.includes(testId);
          const message = result.messages[testId];
          const label = result.testLabels?.[testId] || testId;
          const errorDetail = result.errorDetails?.[testId];
          const isExpanded = expandedTests.has(testId);
          const hasErrorDetails = !passed && errorDetail;

          return (
            <div
              key={testId}
              className={`border rounded-lg ${
                passed
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <div className="p-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{passed ? "✅" : "❌"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {label}
                    </p>
                    {message && (
                      <p
                        className={`text-sm mt-1 ${
                          passed ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {message}
                      </p>
                    )}
                  </div>
                  {hasErrorDetails && (
                    <button
                      onClick={() => toggleExpanded(testId)}
                      className="flex-shrink-0 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                      title="Show error details"
                    >
                      {isExpanded ? "Hide Details" : "Show Details"}
                    </button>
                  )}
                </div>

                {/* Error Details - Collapsible */}
                {hasErrorDetails && isExpanded && (
                  <div className="mt-3 pt-3 border-t border-red-200 space-y-3">
                    {/* Error Type Badge */}
                    {errorDetail.errorType && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-200 text-red-800">
                          {errorDetail.errorType === 'runtime' ? '⚠️ Runtime Error' :
                           errorDetail.errorType === 'syntax' ? '📝 Syntax Error' :
                           '❌ Assertion Failed'}
                        </span>
                      </div>
                    )}

                    {/* Stack Trace */}
                    {errorDetail.stackTrace && (
                      <div>
                        <p className="text-xs font-semibold text-red-900 mb-1">Stack Trace:</p>
                        <pre className="text-xs bg-red-100 p-2 rounded overflow-x-auto font-mono text-red-900 border border-red-200">
                          {errorDetail.stackTrace}
                        </pre>
                      </div>
                    )}

                    {/* stderr */}
                    {errorDetail.stderr && !errorDetail.stackTrace && (
                      <div>
                        <p className="text-xs font-semibold text-red-900 mb-1">Error Message:</p>
                        <pre className="text-xs bg-red-100 p-2 rounded overflow-x-auto font-mono text-red-900 border border-red-200 whitespace-pre-wrap">
                          {errorDetail.stderr}
                        </pre>
                      </div>
                    )}

                    {/* Console Output */}
                    {errorDetail.consoleOutput && errorDetail.consoleOutput.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-900 mb-1">Console Output:</p>
                        <div className="bg-gray-900 p-2 rounded overflow-x-auto text-xs font-mono max-h-32 overflow-y-auto">
                          {errorDetail.consoleOutput.map((line, i) => (
                            <div
                              key={i}
                              className={
                                line.startsWith('[ERROR]') ? 'text-red-400' :
                                line.startsWith('[WARN]') ? 'text-yellow-400' :
                                'text-green-400'
                              }
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DOM State */}
                    {errorDetail.domState && (
                      <div>
                        <p className="text-xs font-semibold text-red-900 mb-1">DOM State at Failure:</p>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto font-mono text-gray-800 border border-gray-300 max-h-32 overflow-y-auto">
                          {errorDetail.domState}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
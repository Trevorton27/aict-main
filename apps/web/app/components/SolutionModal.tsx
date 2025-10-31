// apps/web/app/components/SolutionModal.tsx
"use client";

import { useState } from 'react';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: Record<string, string>;
  onReveal?: () => void;
  onApplySolution?: (files: Record<string, string>) => void;
}

export function SolutionModal({ isOpen, onClose, solution, onReveal, onApplySolution }: SolutionModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  if (!isOpen) return null;

  const handleReveal = () => {
    setRevealed(true);
    onReveal?.();
  };

  const handleApply = () => {
    if (onApplySolution) {
      onApplySolution(solution);
      setShowApplyConfirm(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            {revealed ? '🎓 Solution' : '⚠️ Reveal Solution?'}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!revealed ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-colors">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 transition-colors">
                  <strong>Warning:</strong> Seeing the full solution may reduce your learning effectiveness.
                  Studies show that struggling with problems leads to better long-term retention.
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                Before revealing the solution, consider:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 text-sm transition-colors">
                <li>Have you tried asking for a hint?</li>
                <li>Have you read the error messages carefully?</li>
                <li>Have you tested different approaches?</li>
                <li>Would a smaller example help you understand?</li>
              </ul>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-colors">
                <p className="text-sm text-blue-800 dark:text-blue-300 transition-colors">
                  💡 <strong>Tip:</strong> Try asking the AI tutor for a "level 3 hint" first.
                  It will show you code patterns without giving away the complete solution.
                </p>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  I understand that viewing the solution may impact my learning,
                  and I still want to see it.
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors">
                Here's the complete solution. Try to understand <em>why</em> each part works:
              </p>

              {Object.entries(solution).map(([filename, code]) => (
                <div key={filename} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">{filename}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(code)}
                      className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}

              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6 transition-colors">
                <p className="text-sm text-green-800 dark:text-green-300 transition-colors">
                  <strong>Next steps:</strong> Try recreating this solution from memory,
                  or modify it to add new features. Teaching yourself is the best way to learn!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
          {showApplyConfirm ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 transition-colors">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-medium">
                  This will replace all your current code with the solution. Are you sure?
                </span>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowApplyConfirm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Yes, Replace My Code
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                {revealed && onApplySolution && (
                  <button
                    onClick={() => setShowApplyConfirm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Solution to Editor
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {revealed ? 'Close' : 'Cancel'}
                </button>
                {!revealed && (
                  <button
                    onClick={handleReveal}
                    disabled={!confirmed}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                  >
                    Reveal Solution
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
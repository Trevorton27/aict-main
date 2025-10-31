"use client";

import { useState } from "react";

interface AITutorHelperProps {
  onAskForHint: (level: 1 | 2 | 3) => void;
  onAskQuestion: (question: string) => void;
}

export function AITutorHelper({ onAskForHint: _, onAskQuestion: __ }: AITutorHelperProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickQuestions = [
    "I'm stuck, can you give me a hint?",
    "I need more help with this",
    "Show me a more direct hint",
    "Can you explain the key concept?",
    "What am I doing wrong?",
  ];

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 transition-colors">
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
          <span className="text-white text-lg">🤖</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5 transition-colors">AI Tutor</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
            Copy these questions to the chat above →
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        {quickQuestions.map((q, index) => (
          <button
            key={index}
            onClick={() => handleCopy(q, index)}
            className="w-full text-left px-2.5 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-between group"
          >
            <span className="flex-1">{q}</span>
            <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 text-xs transition-colors">
              {copiedIndex === index ? "✓ Copied!" : "📋"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700 transition-colors">
        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
          💡 Start with simple hints, ask for more help if needed!
        </p>
      </div>
    </div>
  );
}

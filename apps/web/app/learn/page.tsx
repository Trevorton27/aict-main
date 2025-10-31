// apps/web/app/learn/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChatPanel } from "../components/ChatPanel";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewSandbox } from "../components/PreviewSandbox";
import { TestPanel } from "../components/TestPanel";
import { SolutionModal } from "../components/SolutionModal";
import { ChallengeDetails } from "../components/ChallengeDetails";
import { AITutorHelper } from "../components/AITutorHelper";
import { makeHostCapabilities } from "../lib/host";
import type { HostCapabilities } from "@aict/services/orchestrator";

// ----- Types -----
interface Task {
  id: string;
  title: string;
  description: string;
  scaffold: Record<string, string>;
  tests: Array<{ id: string; code: string; label?: string }>;
  solution?: Record<string, string>;
  hints?: Array<{ level: number; text: string }>;
  // Enhanced educational content:
  detailedDescription?: string;
  realWorldContext?: string;
  alternativeSolutions?: Array<{
    label: string;
    files: Record<string, string>;
    explanation: string;
  }>;
  // Optional fields when coming from DB/local JSON:
  difficulty?: number;
  category?: string | null;
}

export default function LearnPage() {
  // ---------- Core state ----------
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [editorFiles, setEditorFiles] = useState<Record<string, string>>({});
  const [activePath, setActivePath] = useState<string>("");
  const [testResult, setTestResult] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isTestRunning, setIsTestRunning] = useState(false);

  // ---------- NEW: difficulty + task list ----------
  const [difficulty, setDifficulty] = useState<number>(1);
  const [taskList, setTaskList] = useState<Task[]>([]);

  // ---------- NEW: attempt tracking ----------
  const [attemptCount, setAttemptCount] = useState(0);
  const REQUIRED_ATTEMPTS = 3;

  // ---------- Preview collapse state ----------
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

  // ---------- Preview theme state (independent of main app theme) ----------
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // ---------- AI Chat popup state ----------
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // ---------- Challenges list collapse state ----------
  const [isChallengesCollapsed, setIsChallengesCollapsed] = useState(false);


  // ---------- Variant Generation ----------
  async function loadVariantForCurrent() {
    if (!currentTask) return;
    try {
      const res = await fetch('/api/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: currentTask.id })
      });
      const data = await res.json();
      if (data?.task) {
        setCurrentTask(data.task);
        setEditorFiles(data.task.scaffold);
        setActivePath(Object.keys(data.task.scaffold)[0] || "index.html");
      }
    } catch (e) { console.error('variant error', e); }
  }

  // ---------- Solution modal state ----------
  const [showSolutionModal, setShowSolutionModal] = useState(false);


  // ---------- Refs for orchestrator ----------
  const currentTaskRef = useRef<Task | null>(null);
  const editorFilesRef = useRef<Record<string, string>>({});

  // Keep refs in sync
  useEffect(() => {
    currentTaskRef.current = currentTask;
  }, [currentTask]);

  useEffect(() => {
    editorFilesRef.current = editorFiles;
  }, [editorFiles]);

  // ---------- First render: load the original mock (fallback) ----------
  useEffect(() => {
    loadInitialTask();
  }, []);

  // ---------- When level changes: load 40 tasks for that level ----------
  useEffect(() => {
    loadTasksByLevel(difficulty);
  }, [difficulty]);

  // Fallback mock to keep MVP behavior intact on first paint
  const loadInitialTask = async () => {
    const mockTask: Task = {
      id: "html-basics-1",
      title: "Create a Simple Webpage",
      description: "Create an HTML page with a heading and paragraph",
      scaffold: {
        "index.html":
          "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Add your code here -->\n</body>\n</html>",
        "style.css": "/* Add your styles here */\n",
      },
      tests: [
        { id: "has-h1", code: "document.querySelector('h1') !== null" },
        { id: "has-paragraph", code: "document.querySelector('p') !== null" },
      ],
    };

    setCurrentTask(mockTask);
    setEditorFiles(mockTask.scaffold);
    setActivePath("index.html");
    setAttemptCount(0);
  };

  // ---------- Fetch tasks of a given level from /api/tasks (40 per level) ----------
  async function loadTasksByLevel(level: number) {
    try {
      const res = await fetch(`/api/tasks?level=${level}&limit=40`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`GET /api/tasks failed: ${res.status}`);
      const data = await res.json();

      const items: Task[] = Array.isArray(data?.items) ? data.items : [];
      setTaskList(items);

      const first = items[0];
      if (first) {
        setCurrentTask(first);
        setEditorFiles(first.scaffold);
        setActivePath(Object.keys(first.scaffold)[0] || "index.html");
        setAttemptCount(0);
      }
    } catch (err) {
      console.error("loadTasksByLevel error:", err);
      // keep the previously loaded mock task
    }
  }

  // ---------- Host capabilities ----------
  const hostCapabilities: HostCapabilities = makeHostCapabilities({
    loadTaskById: async (id: string) => {
      // If you later want to support direct load-by-id, query /api/tasks without level and filter by id
      console.log("Loading task:", id);
      const found = taskList.find((t) => t.id === id);
      if (found) {
        setCurrentTask(found);
        setEditorFiles(found.scaffold);
        setActivePath(Object.keys(found.scaffold)[0] || "index.html");
        setAttemptCount(0);
      }
    },

    pickNextTask: async (strategy: "just-right" | "sequential") => {
      // Simple placeholder: advance to next item in the current list
      const idx = taskList.findIndex((t) => t.id === currentTaskRef.current?.id);
      const next = taskList[idx + 1] ?? taskList[0];
      if (next) {
        setCurrentTask(next);
        setEditorFiles(next.scaffold);
        setActivePath(Object.keys(next.scaffold)[0] || "index.html");
        setAttemptCount(0);
      }
      console.log("Picking next task with strategy:", strategy);
    },

    openPath: async (path: string) => {
      setActivePath(path);
    },

    writeFiles: async (files: Record<string, string>) => {
      setEditorFiles((prev) => ({ ...prev, ...files }));
    },

    runSandbox: async () => {
      setRefreshTrigger((prev) => prev + 1);
    },

    runTestsApi: async (payload: any) => {
      setIsTestRunning(true);
      try {
        const res = await fetch("/api/eval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        return result;
      } finally {
        setIsTestRunning(false);
      }
    },

    updateMasteryApi: async (tags: string[], result: "pass" | "fail") => {
      await fetch("/api/mastery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags, result }),
      });
    },

    revealSolutionUI: async () => {
      setShowSolutionModal(true);
    },

    getCurrentTask: () => currentTaskRef.current,
    getCurrentCodeBundle: () => editorFilesRef.current,
  });

  // ---------- Model context ----------
  const buildContext = () => ({
    task: {
      ...currentTask,
      hints: currentTask?.hints || [],
    },
    test_result: testResult,
    editor: {
      open_path: activePath,
      files: editorFiles,
    },
    student: {
      hint_policy: "normal", // TODO: Make configurable
      requested_full_solution: false,
    },
  });

  // ---------- UI handlers ----------
  const handleRunTests = async () => {
    if (!currentTask) return;

    setIsTestRunning(true);
    try {
      // makeHostCapabilities typically exposes host.runTests() that builds the correct payload
      const result = await hostCapabilities.runTests();
      setTestResult(result);

      // Increment attempt count after running tests
      setAttemptCount(prev => prev + 1);
    } catch (error) {
      console.error("Test run failed:", error);
    } finally {
      setIsTestRunning(false);
    }
  };

  // ---------- AI Tutor helper methods ----------
  const handleAskForHint = (level: 1 | 2 | 3) => {
    // These quick actions help users know what to ask in the chat
    // The AI tutor will recognize these patterns and provide appropriate hints
    console.log(`User requested hint level ${level}`);
    // In a future enhancement, we could programmatically send this to chat
    // For now, these buttons educate users on how to interact with the AI
  };

  const handleAskQuestion = (question: string) => {
    console.log(`User wants to ask: ${question}`);
    // Guide users to type similar questions in the chat panel
  };

  const handleApplySolution = (files: Record<string, string>) => {
    setEditorFiles(files);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0 transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Coding Tutor</h1>
            {currentTask && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentTask.title}</p>
            )}
          </div>

          {/* Level Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={loadVariantForCurrent}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              title="Generate an AI-themed variation of this challenge (tests stay the same)"
            >
            Generate AI Variant Of Challenge🎨
            </button>

            <button
              onClick={() => setShowSolutionModal(true)}
              disabled={!currentTask?.solution || attemptCount < REQUIRED_ATTEMPTS}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium relative"
              title={
                !currentTask?.solution
                  ? "No solution available"
                  : attemptCount < REQUIRED_ATTEMPTS
                  ? `Complete ${REQUIRED_ATTEMPTS - attemptCount} more attempt${REQUIRED_ATTEMPTS - attemptCount === 1 ? '' : 's'} to unlock solution`
                  : "View solution"
              }
            >
              {attemptCount < REQUIRED_ATTEMPTS ? (
                <>
                  🔒 Solution ({attemptCount}/{REQUIRED_ATTEMPTS})
                </>
              ) : (
                <>
                  🔓 Show Solution
                </>
              )}
            </button>

            {/* Attempt Progress Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs font-medium text-gray-600">Attempts:</span>
              <div className="flex gap-1">
                {Array.from({ length: REQUIRED_ATTEMPTS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < attemptCount ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    title={i < attemptCount ? `Attempt ${i + 1} completed` : `Attempt ${i + 1} pending`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {attemptCount}/{REQUIRED_ATTEMPTS}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Test Results Banner */}
      {testResult && (
        <div className={`border-b transition-colors ${
          testResult.passed
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{testResult.passed ? "✅" : "❌"}</span>
                <div>
                  <p className={`font-semibold transition-colors ${
                    testResult.passed
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {testResult.passed ? "All tests passed! 🎉" : "Some tests failed"}
                  </p>
                  <p className={`text-sm transition-colors ${
                    testResult.passed
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {testResult.passedIds.length} / {testResult.passedIds.length + testResult.failedIds.length} tests passed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTestResult(null)}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  testResult.passed
                    ? 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40'
                    : 'text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40'
                }`}
              >
                Dismiss
              </button>
            </div>

            {/* Test Details - Only show if there are failed tests */}
            {!testResult.passed && (
              <div className="mt-3 space-y-2">
                {testResult.failedIds.map((testId: string) => {
                  const message = testResult.messages[testId];
                  const label = testResult.testLabels?.[testId] || testId;
                  return (
                    <div key={testId} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800 transition-colors">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">❌</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm transition-colors">{label}</p>
                          {message && (
                            <p className="text-sm mt-1 text-red-700 dark:text-red-300 transition-colors">{message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Challenge Details */}
        <div className="w-[480px] border-r border-light-border dark:border-gray-700 bg-light-panel dark:bg-gray-800 flex flex-col transition-colors">
          {/* Challenge Details - Takes full space */}
          <div className="flex-1 overflow-hidden">
            {currentTask && (
              <ChallengeDetails
                task={currentTask}
                onApplySolution={handleApplySolution}
                attemptCount={attemptCount}
                requiredAttempts={REQUIRED_ATTEMPTS}
              />
            )}
          </div>
        </div>

        {/* Middle: Editor + Preview */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Editor - Expands when preview is collapsed */}
          <div
            className="border-r border-gray-200 transition-all duration-300"
            style={{
              width: isPreviewCollapsed ? '100%' : '50%'
            }}
          >
            <CodeEditor
              files={editorFiles}
              onFilesChange={setEditorFiles}
              activePath={activePath}
              onActivePathChange={setActivePath}
              onRunTests={handleRunTests}
              isTestRunning={isTestRunning}
            />
          </div>
          {/* Preview - Completely hidden when collapsed */}
          <div
            className="transition-all duration-300 flex flex-col"
            style={{
              width: isPreviewCollapsed ? '0%' : '50%',
              overflow: isPreviewCollapsed ? 'hidden' : 'visible',
              height: '100%'
            }}
          >
            {!isPreviewCollapsed && (
              <PreviewSandbox
                files={editorFiles}
                refreshTrigger={refreshTrigger}
                isCollapsed={isPreviewCollapsed}
                onCollapseChange={setIsPreviewCollapsed}
              />
            )}
          </div>
          {/* Expand Preview Button - Shows when preview is collapsed */}
          {isPreviewCollapsed && (
            <button
              onClick={() => setIsPreviewCollapsed(false)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg font-medium transition-all flex items-center gap-2 z-50"
              title="Expand preview panel"
            >
              <span>👁️</span>
              <span>Show Preview</span>
            </button>
          )}
        </div>

        {/* Right Sidebar: Challenges List */}
        <div className={`border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col transition-all duration-300 ${isChallengesCollapsed ? 'w-12' : 'w-80'}`}>
          {/* Header with Collapse Toggle */}
          <div className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-3 py-3 flex items-center justify-between transition-colors">
            {!isChallengesCollapsed && (
              <h3 className="font-semibold text-gray-800 dark:text-white">Challenges</h3>
            )}
            <button
              onClick={() => setIsChallengesCollapsed(!isChallengesCollapsed)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ml-auto"
              title={isChallengesCollapsed ? "Expand challenges list" : "Collapse challenges list"}
            >
              {isChallengesCollapsed ? '◀' : '▶'}
            </button>
          </div>

          {/* Level Selector */}
          {!isChallengesCollapsed && (
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 px-3 py-3 transition-colors">
              <label className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1 block">Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value={1}>Level 1: HTML</option>
                <option value={2}>Level 2: HTML + CSS</option>
                <option value={3}>Level 3: JavaScript</option>
                <option value={4}>Level 4: Full Stack</option>
              </select>
            </div>
          )}

          {/* Challenges List - Scrollable */}
          {!isChallengesCollapsed && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {taskList.map((task, index) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setCurrentTask(task);
                      setEditorFiles(task.scaffold);
                      setActivePath(Object.keys(task.scaffold)[0] || "index.html");
                      setAttemptCount(0);
                    }}
                    className={`w-full text-left px-3 py-2 md:py-4 rounded-md transition-colors text-sm border-b border-gray-300 dark:border-gray-700 ${
                      currentTask?.id === task.id
                        ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-600 font-medium'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" style={{fontWeight: 370}}>
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="text-gray-900 dark:text-white" style={{fontWeight: 370}}>
                          {task.title}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collapsed State - Vertical Text */}
          {isChallengesCollapsed && (
            <div className="flex-1 flex items-center justify-center">
              <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400">
                CHALLENGES
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Chat Toggle Button */}
      {!isAIChatOpen && (
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center gap-3 px-5 py-3 transition-all z-40 group"
          title="AI Tutor Help"
        >
          <span className="text-2xl">💬</span>
          <span className="font-medium text-sm">Ask AI Tutor for help</span>
        </button>
      )}

      {/* Floating AI Chat Popup */}
      {isAIChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-600 flex flex-col z-40 transition-colors">
          {/* Header */}
          <div className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <h3 className="font-semibold">AI Tutor</h3>
            </div>
            <button
              onClick={() => setIsAIChatOpen(false)}
              className="text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* AI Tutor Helper - Quick Actions */}
          <div className="border-b border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700 transition-colors">
            <AITutorHelper
              onAskForHint={handleAskForHint}
              onAskQuestion={handleAskQuestion}
            />
          </div>

          {/* Chat Panel */}
          <div className="flex-1 overflow-hidden">
            <ChatPanel
              host={hostCapabilities}
              contextBuilder={buildContext}
              onTestResult={setTestResult}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex-shrink-0 transition-colors">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            AI Coding Tutor © 2025
          </div>
          <div className="flex items-center gap-4">
            <span>Level {difficulty}</span>
            <span>•</span>
            <span>{taskList.length} Challenges</span>
          </div>
        </div>
      </footer>

      {/* Solution Modal */}
      {currentTask?.solution && (
        <SolutionModal
          isOpen={showSolutionModal}
          onClose={() => setShowSolutionModal(false)}
          solution={currentTask.solution}
          onApplySolution={(files) => {
            setEditorFiles(files);
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}

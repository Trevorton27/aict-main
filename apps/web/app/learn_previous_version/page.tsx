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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Coding Tutor</h1>
            {currentTask && (
              <p className="text-sm text-gray-600 mt-1">{currentTask.title}</p>
            )}
          </div>

          {/* Level + Challenge pickers */}
          <div className="flex items-center gap-3">
            <button
              onClick={loadVariantForCurrent}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              title="Generate an AI-themed variation of this challenge (tests stay the same)"
            >
              New Variant 🎨
            </button>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Level 1: HTML</option>
                <option value={2}>Level 2: HTML + CSS</option>
                <option value={3}>Level 3: JavaScript</option>
                <option value={4}>Level 4: Full Stack</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Challenge</label>
              <select
                value={currentTask?.id ?? ""}
                onChange={(e) => {
                  const t = taskList.find((x) => x.id === e.target.value);
                  if (!t) return;
                  setCurrentTask(t);
                  setEditorFiles(t.scaffold);
                  setActivePath(
                    Object.keys(t.scaffold)[0] || "index.html"
                  );
                  setAttemptCount(0);
                }}
                className="border border-gray-300 rounded-md p-1 text-sm min-w-[240px]"
              >
                <option value="" disabled>
                  {taskList.length ? "Select challenge…" : "No tasks for level"}
                </option>
                {taskList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

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

            <button
              onClick={handleRunTests}
              disabled={isTestRunning}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
            >
              {isTestRunning ? "Running..." : "Run Tests"}
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

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Challenge Details & AI Helper */}
        <div className="w-96 border-r border-gray-200 flex flex-col">
          {/* Challenge Details - Takes most space */}
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

          {/* AI Tutor Helper - Fixed at bottom */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <AITutorHelper
              onAskForHint={handleAskForHint}
              onAskQuestion={handleAskQuestion}
            />
          </div>
        </div>

        {/* Middle: Editor + Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          <div className="flex-1 border-r border-gray-200 flex flex-col">
            <CodeEditor
              files={editorFiles}
              onFilesChange={setEditorFiles}
              activePath={activePath}
              onActivePathChange={setActivePath}
            />
          </div>

          {/* Preview Section - Conditionally render based on collapse state */}
          {!isPreviewCollapsed ? (
            /* Expanded Preview */
            <div className="flex-1 flex flex-col transition-all duration-300">
              {/* Preview Header with Collapse Button */}
              <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
                <button
                  onClick={() => {
                    console.log('Collapsing preview');
                    setIsPreviewCollapsed(true);
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                  title="Collapse preview panel"
                >
                  Collapse ▶
                </button>
              </div>
              {/* Preview Content */}
              <div className="flex-1 overflow-hidden">
                <PreviewSandbox files={editorFiles} refreshTrigger={refreshTrigger} />
              </div>
            </div>
          ) : (
            /* Collapsed Preview - Vertical Bar */
            <div
              className="w-16 flex flex-col bg-blue-600 border-l-2 border-blue-700 relative z-50 shadow-lg cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('DIV CLICKED - Expanding preview, current state:', isPreviewCollapsed);
                alert('Clicked! Expanding preview...');
                setIsPreviewCollapsed(false);
                console.log('After setIsPreviewCollapsed(false)');
              }}
              title="Click anywhere to expand preview panel"
            >
              {/* Expand Button - Vertical */}
              <div className="flex-1 flex flex-col items-center justify-center hover:bg-blue-700 transition-colors py-4">
                <span className="text-3xl text-white mb-4 font-bold pointer-events-none">◀</span>
                <div className="flex flex-col items-center gap-1 pointer-events-none">
                  {['P', 'R', 'E', 'V', 'I', 'E', 'W'].map((letter, i) => (
                    <span key={i} className="text-sm font-bold text-white">
                      {letter}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-xs text-white opacity-75 pointer-events-none">
                  Click
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Chat & Tests */}
        <div className="w-96 border-l border-gray-200 flex flex-col relative z-10">
          {/* Chat Panel - Top half */}
          <div className="flex-1 border-b border-gray-200 overflow-hidden">
            <ChatPanel
              host={hostCapabilities}
              contextBuilder={buildContext}
              onTestResult={setTestResult}
            />
          </div>

          {/* Test Panel - Bottom half */}
          <div className="flex-1 overflow-hidden">
            <TestPanel
              result={testResult}
              onRunTests={handleRunTests}
              isRunning={isTestRunning}
            />
          </div>
        </div>
      </div>

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

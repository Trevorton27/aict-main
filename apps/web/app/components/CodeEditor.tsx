// apps/web/app/components/CodeEditor.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  files: Record<string, string>;
  onFilesChange: (files: Record<string, string>) => void;
  activePath?: string;
  onActivePathChange?: (path: string) => void;
  onRunTests?: () => void;
  isTestRunning?: boolean;
}

export function CodeEditor({
  files,
  onFilesChange,
  activePath,
  onActivePathChange,
  onRunTests,
  isTestRunning = false
}: CodeEditorProps) {
  const [openPath, setOpenPath] = useState<string>(
    activePath || Object.keys(files)[0] || ""
  );
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (activePath && activePath !== openPath) {
      setOpenPath(activePath);
    }
  }, [activePath]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && openPath) {
      onFilesChange({ ...files, [openPath]: value });
    }
  };

  const switchFile = (path: string) => {
    setOpenPath(path);
    onActivePathChange?.(path);
  };

  const fileList = Object.keys(files).sort();

  // Detect language from file extension
  const getLanguage = (path: string) => {
    if (path.endsWith(".ts") || path.endsWith(".tsx")) return "typescript";
    if (path.endsWith(".js") || path.endsWith(".jsx")) return "javascript";
    if (path.endsWith(".html")) return "html";
    if (path.endsWith(".css")) return "css";
    if (path.endsWith(".json")) return "json";
    return "plaintext";
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 dark:bg-gray-950">
      {/* File Tabs with Run Tests Button */}
      <div className="flex items-center justify-between bg-light-header-end dark:bg-gray-900 border-b border-light-border dark:border-gray-800 p-2 gap-2">
        <div className="flex overflow-x-auto gap-1">
          {fileList.map(path => (
            <button
              key={path}
              onClick={() => switchFile(path)}
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-lg transition-all duration-150 ${
                openPath === path
                  ? "bg-gradient-to-r from-accent-purple-light to-accent-indigo dark:bg-gray-950 text-white shadow-button-light"
                  : "text-text-light-body dark:text-gray-400 hover:text-text-light-heading dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 border border-light-border dark:border-gray-700"
              }`}
            >
              {path.split("/").pop()}
            </button>
          ))}
        </div>
        {onRunTests && (
          <button
            onClick={onRunTests}
            disabled={isTestRunning}
            className="px-4 py-2 mr-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium whitespace-nowrap transition-colors"
          >
            {isTestRunning ? "Running..." : "Run Tests"}
          </button>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1">
        {openPath && files[openPath] !== undefined ? (
          <Editor
            height="100%"
            language={getLanguage(openPath)}
            value={files[openPath]}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on"
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No file selected
          </div>
        )}
      </div>
    </div>
  );
}
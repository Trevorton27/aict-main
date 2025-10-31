// apps/web/app/components/PreviewSandbox.tsx
"use client";

import { useRef, useEffect, useState } from "react";

interface PreviewSandboxProps {
  files: Record<string, string>;
  refreshTrigger?: number; // Change this to force refresh
  onCollapseChange?: (collapsed: boolean) => void; // Callback when collapse state changes
  isCollapsed?: boolean; // Controlled collapse state from parent
  previewTheme?: 'light' | 'dark'; // Independent preview theme
  onPreviewThemeChange?: (theme: 'light' | 'dark') => void; // Callback for theme change
}

export function PreviewSandbox({ files, refreshTrigger, onCollapseChange, isCollapsed: controlledCollapsed, previewTheme = 'light', onPreviewThemeChange }: PreviewSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Use controlled state if provided, otherwise use internal state
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  useEffect(() => {
    renderPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, refreshTrigger, previewTheme]);

  const renderPreview = () => {
    try {
      setError(null);
      const html = buildHTMLDocument(files);
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.srcdoc = html;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview error");
    }
  };

  const buildHTMLDocument = (files: Record<string, string>): string => {
    let htmlContent = files["index.html"] || files["main.html"] || "";

    if (!htmlContent) {
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
    }

    const cssFiles = Object.keys(files).filter((p) => p.endsWith(".css"));
    let styles = "";
    for (const cssPath of cssFiles) {
      styles += `<style>\n${files[cssPath]}\n</style>\n`;
    }

    const jsFiles = Object.keys(files).filter(
      (p) => p.endsWith(".js") || p.endsWith(".ts")
    );
    let scripts = "";
    for (const jsPath of jsFiles) {
      const jsCode = files[jsPath]
        .replace(/: \w+/g, "") // naive strip of simple TS annotations
        .replace(/interface \w+ \{[^}]+\}/g, ""); // naive strip of simple interfaces
      scripts += `<script>\n${jsCode}\n</script>\n`;
    }

    htmlContent = htmlContent.replace("</head>", `${styles}</head>`);
    htmlContent = htmlContent.replace("</body>", `${scripts}</body>`);

    // Add theme styling based on previewTheme
    const themeStyles = `
<style id="preview-theme-styles">
  :root {
    color-scheme: ${previewTheme};
  }
  ${previewTheme === 'dark' ? `
  body {
    background-color: #1a1a1a;
    color: #e5e5e5;
  }
  ` : `
  body {
    background-color: #ffffff;
    color: #000000;
  }
  `}
</style>`;

    const consoleCapture = `
<script>
  window.addEventListener('error', (e) => {
    console.error('Runtime error:', e.message);
  });
  const originalLog = console.log;
  console.log = function(...args) {
    originalLog.apply(console, args);
  };
</script>`;
    htmlContent = htmlContent.replace("</head>", `${themeStyles}${consoleCapture}</head>`);

    return htmlContent;
  };

  const handleToggle = () => {
    const newValue = !isCollapsed;

    // If using controlled state, notify parent
    if (controlledCollapsed !== undefined && onCollapseChange) {
      onCollapseChange(newValue);
    } else {
      // Otherwise update internal state
      setInternalCollapsed(newValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 min-h-0 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 px-4 py-2 transition-colors">
        <span
          id="preview-toolbar-label"
          className="text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
        >
          Preview{isCollapsed ? " (collapsed)" : ""}
        </span>
        <div className="flex items-center gap-2">
          {/* Preview Theme Toggle */}
          {onPreviewThemeChange && (
            <button
              type="button"
              onClick={() => onPreviewThemeChange(previewTheme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              title={previewTheme === 'light' ? "Switch preview to dark mode" : "Switch preview to light mode"}
            >
              {previewTheme === 'light' ? (
                <span className="text-lg">🌙</span>
              ) : (
                <span className="text-lg">☀️</span>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={renderPreview}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
          <button
            type="button"
            aria-controls="preview-frame"
            aria-expanded={!isCollapsed}
            onClick={handleToggle}
            className="px-3 py-1 text-sm bg-gray-700 dark:bg-gray-600 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors"
          >
            {isCollapsed ? "Expand Preview" : "Collapse Preview"}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 px-4 py-2 transition-colors">
          <p className="text-sm text-red-700 dark:text-red-300 transition-colors">⚠️ {error}</p>
        </div>
      )}

      {/* Preview region */}
      <div
        role="region"
        aria-labelledby="preview-toolbar-label"
        className="flex-1 overflow-hidden border-t"
      >
        <iframe
          ref={iframeRef}
          id="preview-frame"
          title="preview"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}

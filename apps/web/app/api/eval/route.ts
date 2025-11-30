// apps/web/app/api/eval/route.ts
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

interface EnhancedTestResult {
  passed: boolean;
  passedIds: string[];
  failedIds: string[];
  messages: Record<string, string>;
  testLabels: Record<string, string>;
  errorDetails?: Record<string, {
    stderr?: string;
    stackTrace?: string;
    domState?: string;
    consoleOutput?: string[];
    errorType?: 'runtime' | 'assertion' | 'syntax';
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const { task, files } = await req.json();

    if (!task || !files) {
      return NextResponse.json(
        { error: "Missing task or files" },
        { status: 400 }
      );
    }

    // Build HTML document from files
    const htmlContent = buildHTMLDocument(files);

    // Create virtual DOM
    const dom = new JSDOM(htmlContent, {
      runScripts: "dangerously",
      resources: "usable"
    });

    const { window } = dom;
    const { document } = window;

    // Capture console output
    const consoleCapture: string[] = [];
    const originalConsole = {
      log: window.console.log,
      error: window.console.error,
      warn: window.console.warn,
    };

    window.console.log = (...args: any[]) => {
      consoleCapture.push(`[LOG] ${args.map(a => String(a)).join(' ')}`);
      originalConsole.log.apply(window.console, args);
    };

    window.console.error = (...args: any[]) => {
      consoleCapture.push(`[ERROR] ${args.map(a => String(a)).join(' ')}`);
      originalConsole.error.apply(window.console, args);
    };

    window.console.warn = (...args: any[]) => {
      consoleCapture.push(`[WARN] ${args.map(a => String(a)).join(' ')}`);
      originalConsole.warn.apply(window.console, args);
    };

    // Capture runtime errors
    const runtimeErrors: string[] = [];
    window.addEventListener('error', (event: any) => {
      runtimeErrors.push(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
    });

    // Wait for scripts to execute
    await new Promise(resolve => setTimeout(resolve, 100));

    // Run tests
    const results: EnhancedTestResult = {
      passed: true,
      passedIds: [],
      failedIds: [],
      messages: {},
      testLabels: {},
      errorDetails: {}
    };

    for (const test of task.tests || []) {
      // Store test label for UI display
      results.testLabels[test.id] = test.label || test.id;

      // Clear console capture for this test
      const testConsoleStart = consoleCapture.length;

      try {
        // Evaluate test code in the context of the document
        // Check if test code already contains 'return' statement (new format)
        // or is a simple boolean expression (old format)
        const hasReturn = test.code.trim().includes('return ');
        const testFn = hasReturn
          ? new Function("document", "window", test.code)  // New format: full function body
          : new Function("document", "window", `return ${test.code}`);  // Old format: expression

        const result = testFn(document, window);

        // Handle both formats:
        // Old format returns boolean
        // New format returns { passed: boolean, passedIds: [], failedIds: [] }
        if (typeof result === 'object' && result !== null && 'passed' in result) {
          // New format with detailed results
          if (result.passed) {
            results.passedIds.push(test.id);
            results.messages[test.id] = test.successMessage || "Test passed";
          } else {
            results.passed = false;
            results.failedIds.push(test.id);
            results.messages[test.id] = test.failureMessage || "Test failed";

            // Capture error details for failed test
            results.errorDetails![test.id] = {
              errorType: 'assertion',
              stderr: test.failureMessage || "Test assertion failed",
              domState: formatDOMState(document.body),
              consoleOutput: consoleCapture.slice(testConsoleStart),
            };
          }
        } else if (result) {
          // Old format: simple boolean true
          results.passedIds.push(test.id);
          results.messages[test.id] = test.successMessage || "Test passed";
        } else {
          // Old format: simple boolean false
          results.passed = false;
          results.failedIds.push(test.id);
          results.messages[test.id] = test.failureMessage || "Test failed";

          // Capture error details for failed test
          results.errorDetails![test.id] = {
            errorType: 'assertion',
            stderr: buildFailureMessage(test, document),
            domState: formatDOMState(document.body),
            consoleOutput: consoleCapture.slice(testConsoleStart),
          };
        }
      } catch (error) {
        results.passed = false;
        results.failedIds.push(test.id);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const stackTrace = error instanceof Error ? error.stack : undefined;

        results.messages[test.id] = `Error: ${errorMessage}`;

        // Capture detailed error information
        results.errorDetails![test.id] = {
          errorType: 'runtime',
          stderr: errorMessage,
          stackTrace: stackTrace,
          domState: formatDOMState(document.body),
          consoleOutput: consoleCapture.slice(testConsoleStart),
        };
      }
    }

    // Add any runtime errors that occurred during script execution
    if (runtimeErrors.length > 0) {
      results.messages['_runtime_errors'] = runtimeErrors.join('\n');
      results.errorDetails!['_runtime_errors'] = {
        errorType: 'runtime',
        stderr: runtimeErrors.join('\n'),
        consoleOutput: consoleCapture,
      };
    }

    // Clean up
    window.close();

    return NextResponse.json(results);

  } catch (error) {
    console.error("Eval API error:", error);
    return NextResponse.json(
      {
        passed: false,
        passedIds: [],
        failedIds: [],
        messages: { "error": "Failed to run tests" },
        testLabels: {}
      },
      { status: 500 }
    );
  }
}

function buildHTMLDocument(files: Record<string, string>): string {
  let htmlContent = files["index.html"] || files["main.html"] || "";

  if (!htmlContent) {
    htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  }

  // Inject CSS
  const cssFiles = Object.keys(files).filter(p => p.endsWith(".css"));
  let styles = "";
  for (const cssPath of cssFiles) {
    styles += `<style>\n${files[cssPath]}\n</style>\n`;
  }

  // Inject JS (strip TypeScript for simple eval)
  const jsFiles = Object.keys(files).filter(p =>
    p.endsWith(".js") || p.endsWith(".ts")
  );
  let scripts = "";
  for (const jsPath of jsFiles) {
    const jsCode = files[jsPath]
      .replace(/: \w+/g, "")
      .replace(/interface \w+ \{[^}]+\}/g, "");

    scripts += `<script>\n${jsCode}\n</script>\n`;
  }

  htmlContent = htmlContent.replace("</head>", `${styles}</head>`);
  htmlContent = htmlContent.replace("</body>", `${scripts}</body>`);

  return htmlContent;
}

/**
 * Format DOM state for error reporting - truncate to reasonable size
 */
function formatDOMState(body: HTMLElement): string {
  const html = body.innerHTML;
  const maxLength = 500;

  if (html.length <= maxLength) {
    return html;
  }

  return html.substring(0, maxLength) + '\n... (truncated)';
}

/**
 * Build a helpful failure message based on test code
 */
function buildFailureMessage(test: any, document: Document): string {
  const code = test.code;

  // Try to extract what element/selector the test was looking for
  const selectorMatch = code.match(/querySelector\(['"]([^'"]+)['"]\)/);
  const querySelectorAllMatch = code.match(/querySelectorAll\(['"]([^'"]+)['"]\)/);
  const getElementByIdMatch = code.match(/getElementById\(['"]([^'"]+)['"]\)/);

  if (selectorMatch) {
    const selector = selectorMatch[1];
    const element = document.querySelector(selector);
    if (!element) {
      return `Expected element matching selector "${selector}" but found none.\nCurrent DOM has: ${getElementSummary(document)}`;
    }
    return `Test failed for selector "${selector}". Element exists but test condition not met.`;
  }

  if (querySelectorAllMatch) {
    const selector = querySelectorAllMatch[1];
    const elements = document.querySelectorAll(selector);
    return `Expected elements matching "${selector}". Found ${elements.length} element(s).`;
  }

  if (getElementByIdMatch) {
    const id = getElementByIdMatch[1];
    const element = document.getElementById(id);
    if (!element) {
      return `Expected element with id="${id}" but found none.\nCurrent DOM has: ${getElementSummary(document)}`;
    }
    return `Test failed for element with id="${id}". Element exists but test condition not met.`;
  }

  return test.failureMessage || "Test assertion failed. Check your code and try again.";
}

/**
 * Get a summary of elements in the document for error messages
 */
function getElementSummary(document: Document): string {
  const tags = new Set<string>();
  const ids = new Set<string>();
  const classes = new Set<string>();

  const elements = document.querySelectorAll('*');
  elements.forEach(el => {
    tags.add(el.tagName.toLowerCase());
    if (el.id) ids.add(`#${el.id}`);
    el.classList.forEach(cls => classes.add(`.${cls}`));
  });

  const summary = [];
  if (tags.size > 0) summary.push(`Tags: ${Array.from(tags).slice(0, 10).join(', ')}`);
  if (ids.size > 0) summary.push(`IDs: ${Array.from(ids).slice(0, 5).join(', ')}`);
  if (classes.size > 0) summary.push(`Classes: ${Array.from(classes).slice(0, 5).join(', ')}`);

  return summary.join(' | ') || 'empty body';
}
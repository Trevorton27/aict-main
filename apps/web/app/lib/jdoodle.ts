// apps/web/app/lib/jdoodle.ts

interface JDoodleRequest {
  clientId: string;
  clientSecret: string;
  script: string;
  language: string;
  versionIndex: string;
  stdin?: string;
}

interface JDoodleResponse {
  output: string;
  statusCode: number;
  memory: string;
  cpuTime: string;
  error?: string;
}

export class JDoodleService {
  private static readonly API_URL = 'https://api.jdoodle.com/v1/execute';
  private static readonly TIMEOUT = 10000; // 10 seconds

  /**
   * Execute JavaScript code using JDoodle API
   */
  static async execute(
    code: string,
    language: string = 'nodejs',
    versionIndex: string = '4'
  ): Promise<JDoodleResponse> {
    const clientId = process.env.JDOODLE_CLIENT_ID;
    const clientSecret = process.env.JDOODLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('JDoodle credentials not configured. Please add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to .env.local');
    }

    const payload: JDoodleRequest = {
      clientId,
      clientSecret,
      script: code,
      language,
      versionIndex,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`JDoodle API error (${response.status}): ${errorText}`);
      }

      const result: JDoodleResponse = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Code execution timeout (10s limit exceeded)');
      }
      throw error;
    }
  }

  /**
   * Build test wrapper code for JDoodle execution
   * Wraps user code and tests in a self-contained test runner
   */
  static buildTestWrapper(
    userCode: string,
    tests: Array<{ id: string; code: string; label?: string; successMessage?: string; failureMessage?: string }>
  ): string {
    return `
// ===== USER CODE =====
${userCode}

// ===== TEST FRAMEWORK =====
const results = {
  passed: true,
  passedIds: [],
  failedIds: [],
  messages: {},
  testLabels: {},
  errorDetails: {}
};

const tests = ${JSON.stringify(tests)};

// Capture console output for debugging
const consoleOutput = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  consoleOutput.push('[LOG] ' + args.map(a => String(a)).join(' '));
  originalLog.apply(console, args);
};

console.error = (...args) => {
  consoleOutput.push('[ERROR] ' + args.map(a => String(a)).join(' '));
  originalError.apply(console, args);
};

console.warn = (...args) => {
  consoleOutput.push('[WARN] ' + args.map(a => String(a)).join(' '));
  originalWarn.apply(console, args);
};

// Run each test
for (const test of tests) {
  results.testLabels[test.id] = test.label || test.id;

  const testConsoleStart = consoleOutput.length;

  try {
    // Create test function
    const hasReturn = test.code.trim().includes('return ');
    const testFn = hasReturn
      ? new Function(test.code)
      : new Function('return ' + test.code);

    const result = testFn();

    // Check if result is boolean or detailed object
    if (typeof result === 'object' && result !== null && 'passed' in result) {
      // New format with detailed results
      if (result.passed) {
        results.passedIds.push(test.id);
        results.messages[test.id] = test.successMessage || 'Test passed';
      } else {
        results.passed = false;
        results.failedIds.push(test.id);
        results.messages[test.id] = test.failureMessage || 'Test failed';
        results.errorDetails[test.id] = {
          errorType: 'assertion',
          stderr: test.failureMessage || 'Assertion failed',
          consoleOutput: consoleOutput.slice(testConsoleStart)
        };
      }
    } else if (result) {
      // Old format: simple boolean true
      results.passedIds.push(test.id);
      results.messages[test.id] = test.successMessage || 'Test passed';
    } else {
      // Old format: simple boolean false
      results.passed = false;
      results.failedIds.push(test.id);
      results.messages[test.id] = test.failureMessage || 'Test failed';
      results.errorDetails[test.id] = {
        errorType: 'assertion',
        stderr: test.failureMessage || 'Expected true but got false',
        consoleOutput: consoleOutput.slice(testConsoleStart)
      };
    }
  } catch (error) {
    results.passed = false;
    results.failedIds.push(test.id);
    results.messages[test.id] = 'Error: ' + error.message;
    results.errorDetails[test.id] = {
      errorType: 'runtime',
      stderr: error.message,
      stackTrace: error.stack,
      consoleOutput: consoleOutput.slice(testConsoleStart)
    };
  }
}

// Output results as JSON (with markers for parsing)
console.log('\\n__JDOODLE_RESULTS__');
console.log(JSON.stringify(results, null, 2));
console.log('__JDOODLE_RESULTS_END__');
`;
  }

  /**
   * Sanitize user code to prevent dangerous operations
   */
  static sanitizeCode(code: string): string {
    // Check for forbidden patterns
    const forbidden = [
      { pattern: /require\s*\(\s*['"]child_process['"]\s*\)/gi, msg: 'child_process module is not allowed' },
      { pattern: /require\s*\(\s*['"]fs['"]\s*\)/gi, msg: 'fs module is not allowed' },
      { pattern: /process\.exit/gi, msg: 'process.exit is not allowed' },
      { pattern: /eval\s*\(/gi, msg: 'eval() is not allowed for security reasons' },
    ];

    for (const { pattern, msg } of forbidden) {
      if (pattern.test(code)) {
        throw new Error(`Security violation: ${msg}`);
      }
    }

    return code;
  }
}

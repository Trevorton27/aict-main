// apps/web/app/api/eval-jdoodle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JDoodleService } from '@/lib/jdoodle';

interface EnhancedTestResult {
  passed: boolean;
  passedIds: string[];
  failedIds: string[];
  messages: Record<string, string>;
  testLabels: Record<string, string>;
  errorDetails?: Record<string, {
    stderr?: string;
    stackTrace?: string;
    consoleOutput?: string[];
    errorType?: 'runtime' | 'assertion' | 'syntax';
  }>;
  executionTime?: string;
  memory?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { task, files } = await req.json();

    if (!task || !files) {
      return NextResponse.json(
        { error: 'Missing task or files' },
        { status: 400 }
      );
    }

    // Extract JavaScript code from files
    // Try common file names: main.js, script.js, index.js, or any .js file
    let userCode = files['main.js'] || files['script.js'] || files['index.js'];

    if (!userCode) {
      // Find any .js file
      const jsFile = Object.keys(files).find(key => key.endsWith('.js'));
      if (jsFile) {
        userCode = files[jsFile];
      }
    }

    if (!userCode || !userCode.trim()) {
      return NextResponse.json(
        { error: 'No JavaScript code provided' },
        { status: 400 }
      );
    }

    // Sanitize user code for security
    try {
      JDoodleService.sanitizeCode(userCode);
    } catch (securityError) {
      return NextResponse.json({
        passed: false,
        passedIds: [],
        failedIds: task.tests.map((t: any) => t.id),
        messages: {
          _security_error: securityError instanceof Error ? securityError.message : 'Security violation'
        },
        testLabels: {},
        errorDetails: {
          _security_error: {
            errorType: 'syntax',
            stderr: securityError instanceof Error ? securityError.message : 'Code contains forbidden operations',
          }
        }
      });
    }

    // Build test wrapper code
    const wrappedCode = JDoodleService.buildTestWrapper(userCode, task.tests);

    // Execute on JDoodle
    const jdoodleResult = await JDoodleService.execute(
      wrappedCode,
      'nodejs',
      '4'
    );

    // Log complete JDoodle response for debugging
    console.log('JDoodle API Response:', JSON.stringify(jdoodleResult, null, 2));

    // Check for compilation/execution errors
    if (jdoodleResult.statusCode !== 0 || jdoodleResult.error) {
      const output = jdoodleResult.output || '';
      const errorOutput = jdoodleResult.error || output;

      return NextResponse.json({
        passed: false,
        passedIds: [],
        failedIds: task.tests.map((t: any) => t.id),
        messages: {
          _execution_error: 'Code execution failed'
        },
        testLabels: {},
        errorDetails: {
          _execution_error: {
            errorType: 'runtime',
            stderr: errorOutput || 'Unknown execution error',
            consoleOutput: output.split('\n').filter((line: string) => line.trim()),
            stackTrace: extractStackTrace(output)
          }
        },
        executionTime: jdoodleResult.cpuTime,
        memory: jdoodleResult.memory
      });
    }

    // Parse results from output
    const output = jdoodleResult.output || '';

    // Extract JSON results from console output
    const resultsMatch = output.match(
      /__JDOODLE_RESULTS__([\s\S]*?)__JDOODLE_RESULTS_END__/
    );

    if (!resultsMatch) {
      // Tests didn't complete - capture all output as error
      return NextResponse.json({
        passed: false,
        passedIds: [],
        failedIds: task.tests.map((t: any) => t.id),
        messages: {
          _runtime_error: 'Tests did not complete successfully'
        },
        testLabels: {},
        errorDetails: {
          _runtime_error: {
            errorType: 'runtime',
            stderr: 'Test execution did not complete. Check your code for errors.',
            consoleOutput: output.split('\n').filter((line: string) => line.trim())
          }
        },
        executionTime: jdoodleResult.cpuTime,
        memory: jdoodleResult.memory
      });
    }

    // Parse test results JSON
    const resultsJson = resultsMatch[1].trim();
    let results: EnhancedTestResult;
    console.log('JDoodle raw results JSON:', resultsJson);
    try {
      results = JSON.parse(resultsJson);
    } catch (parseError) {
      return NextResponse.json({
        passed: false,
        passedIds: [],
        failedIds: task.tests.map((t: any) => t.id),
        messages: {
          _parse_error: 'Failed to parse test results'
        },
        testLabels: {},
        errorDetails: {
          _parse_error: {
            errorType: 'runtime',
            stderr: 'Failed to parse test results JSON',
            consoleOutput: [resultsJson]
          }
        }
      });
    }

    // Extract console output (everything before __JDOODLE_RESULTS__)
    const consoleOutput = output.substring(0, output.indexOf('__JDOODLE_RESULTS__'))
      .split('\n')
      .filter((line: string) => line.trim());

    // Add console output to all failed tests that don't already have it
    if (results.errorDetails) {
      for (const testId of results.failedIds) {
        if (results.errorDetails[testId] && (!results.errorDetails[testId].consoleOutput || results.errorDetails[testId].consoleOutput!.length === 0)) {
          results.errorDetails[testId].consoleOutput = consoleOutput;
        }
      }
    }

    // Add execution metadata
    results.executionTime = jdoodleResult.cpuTime;
    results.memory = jdoodleResult.memory;

    // Log final processed results for debugging
    console.log('Final Test Results:', JSON.stringify(results, null, 2));

    return NextResponse.json(results);

  } catch (error) {
    console.error('JDoodle eval error:', error);

    // Check if it's a JDoodle API error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      passed: false,
      passedIds: [],
      failedIds: [],
      messages: {
        _api_error: errorMessage.includes('credentials')
          ? 'JDoodle service not configured. Please contact administrator.'
          : 'Code evaluation failed'
      },
      testLabels: {},
      errorDetails: {
        _api_error: {
          errorType: 'runtime',
          stderr: errorMessage,
          stackTrace: error instanceof Error ? error.stack : undefined
        }
      }
    }, { status: 500 });
  }
}

/**
 * Extract stack trace from JDoodle output
 */
function extractStackTrace(output: string): string | undefined {
  const stackLines = output.split('\n').filter((line: string) =>
    line.includes('at ') && (line.includes('(') || line.includes(':'))
  );

  return stackLines.length > 0 ? stackLines.join('\n') : undefined;
}

#!/usr/bin/env tsx
// scripts/validate-challenges.ts
// Validates all challenges to ensure test accuracy

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { JSDOM } from 'jsdom';

interface Challenge {
  id: string;
  slug: string;
  title: string;
  starter: {
    html?: string;
    css?: string;
    js?: string;
  };
  tests: Array<{
    id: string;
    code: string;
    label?: string;
    successMessage?: string;
    failureMessage?: string;
  }>;
}

interface ChallengeSolution {
  id: string;
  challengeId: string;
  label: string;
  files: {
    html?: string;
    css?: string;
    js?: string;
  };
}

interface TestResult {
  passed: boolean;
  passedIds: string[];
  failedIds: string[];
  messages: Record<string, string>;
}

interface ValidationReport {
  totalChallenges: number;
  passed: number;
  failed: number;
  errors: Array<{
    slug: string;
    title: string;
    issue: string;
  }>;
}

// Evaluation logic (same as /api/eval/route.ts)
async function evaluateChallenge(
  challenge: Challenge,
  files: Record<string, string>
): Promise<TestResult> {
  const htmlContent = buildHTMLDocument(files);

  const dom = new JSDOM(htmlContent, {
    runScripts: "dangerously",
    resources: "usable"
  });

  const { window } = dom;
  const { document } = window;

  // Wait for scripts to execute
  await new Promise(resolve => setTimeout(resolve, 100));

  const results: TestResult = {
    passed: true,
    passedIds: [],
    failedIds: [],
    messages: {}
  };

  for (const test of challenge.tests || []) {
    try {
      const hasReturn = test.code.trim().includes('return ');
      const testFn = hasReturn
        ? new Function("document", "window", test.code)
        : new Function("document", "window", `return ${test.code}`);

      const result = testFn(document, window);

      if (typeof result === 'object' && result !== null && 'passed' in result) {
        if (result.passed) {
          results.passedIds.push(test.id);
          results.messages[test.id] = test.successMessage || "Test passed";
        } else {
          results.passed = false;
          results.failedIds.push(test.id);
          results.messages[test.id] = test.failureMessage || "Test failed";
        }
      } else if (result) {
        results.passedIds.push(test.id);
        results.messages[test.id] = test.successMessage || "Test passed";
      } else {
        results.passed = false;
        results.failedIds.push(test.id);
        results.messages[test.id] = test.failureMessage || "Test failed";
      }
    } catch (error) {
      results.passed = false;
      results.failedIds.push(test.id);
      results.messages[test.id] = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  }

  window.close();
  return results;
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

  // Inject JS
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

function filesToRecord(files: { html?: string; css?: string; js?: string }): Record<string, string> {
  const record: Record<string, string> = {};
  if (files.html) record['index.html'] = files.html;
  if (files.css) record['style.css'] = files.css;
  if (files.js) record['script.js'] = files.js;
  return record;
}

async function validateChallenge(
  challenge: Challenge,
  solution: ChallengeSolution | null
): Promise<{ success: boolean; issues: string[] }> {
  const issues: string[] = [];

  // 1. Validate challenge structure
  if (!challenge.tests || challenge.tests.length === 0) {
    issues.push("No tests defined");
    return { success: false, issues };
  }

  if (!challenge.starter) {
    issues.push("No starter code defined");
    return { success: false, issues };
  }

  // 2. Test scaffold - should fail most tests (or at least not pass all)
  try {
    const scaffoldFiles = filesToRecord(challenge.starter);
    const scaffoldResult = await evaluateChallenge(challenge, scaffoldFiles);

    if (scaffoldResult.passed) {
      issues.push("⚠️  Scaffold passes all tests (should fail some/all)");
    }
  } catch (error) {
    issues.push(`Error testing scaffold: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // 3. Test solution - should pass all tests
  if (solution) {
    try {
      const solutionFiles = filesToRecord(solution.files);
      const solutionResult = await evaluateChallenge(challenge, solutionFiles);

      if (!solutionResult.passed) {
        issues.push(`❌ Solution fails tests: ${solutionResult.failedIds.join(', ')}`);
        for (const failedId of solutionResult.failedIds) {
          issues.push(`   Test "${failedId}": ${solutionResult.messages[failedId]}`);
        }
      }
    } catch (error) {
      issues.push(`Error testing solution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    issues.push("⚠️  No solution found to validate against");
  }

  return { success: issues.length === 0, issues };
}

async function main() {
  console.log("🔍 Validating challenges...\n");

  const dataDir = join(process.cwd(), 'data', 'challenges');

  let challengeFiles: string[];
  try {
    challengeFiles = (await readdir(dataDir)).filter(f => f.endsWith('.json'));
  } catch (error) {
    console.error(`❌ Could not read challenges directory: ${dataDir}`);
    process.exit(1);
  }

  const report: ValidationReport = {
    totalChallenges: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  for (const file of challengeFiles) {
    const filePath = join(dataDir, file);
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Handle both single challenge and solution files
    const challenge: Challenge = data;
    const solution: ChallengeSolution | null = data.solutions?.[0] || null;

    if (!challenge.slug) continue; // Skip non-challenge files

    report.totalChallenges++;

    console.log(`\n📝 ${challenge.slug}: ${challenge.title}`);

    const { success, issues } = await validateChallenge(challenge, solution);

    if (success) {
      console.log("   ✅ PASSED");
      report.passed++;
    } else {
      console.log("   ❌ FAILED");
      report.failed++;

      for (const issue of issues) {
        console.log(`      ${issue}`);
        report.errors.push({
          slug: challenge.slug,
          title: challenge.title,
          issue
        });
      }
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 VALIDATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total Challenges: ${report.totalChallenges}`);
  console.log(`✅ Passed: ${report.passed}`);
  console.log(`❌ Failed: ${report.failed}`);
  console.log(`Success Rate: ${((report.passed / report.totalChallenges) * 100).toFixed(1)}%`);

  if (report.errors.length > 0) {
    console.log("\n⚠️  Issues Found:");
    const groupedErrors = report.errors.reduce((acc, err) => {
      if (!acc[err.slug]) acc[err.slug] = [];
      acc[err.slug].push(err.issue);
      return acc;
    }, {} as Record<string, string[]>);

    for (const [slug, issues] of Object.entries(groupedErrors)) {
      console.log(`\n   ${slug}:`);
      for (const issue of issues) {
        console.log(`      - ${issue}`);
      }
    }
  }

  // Exit with error code if any failures
  process.exit(report.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});

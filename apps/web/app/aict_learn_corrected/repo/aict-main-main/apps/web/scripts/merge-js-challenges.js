// ============================================================
// merge-js-challenges.js
// ============================================================
// Purpose: Merges JavaScript challenges from js_logic_challenges_40.json
//          into tasks.levels.json, replacing existing JS challenges
//
// When to run: After updating js_logic_challenges_40.json
//
// Usage: node scripts/merge-js-challenges.js
//
// What it does:
// 1. Reads js_logic_challenges_40.json (source of truth for JS)
// 2. Reads tasks.levels.json (all challenges)
// 3. Replaces JS challenges in tasks.levels.json
// 4. Keeps other challenges (HTML, CSS, Full Stack) intact
// 5. Creates backup before overwriting
// ============================================================

const fs = require('fs');
const path = require('path');

// Read both files
const tasksPath = path.join(__dirname, '../data/tasks.levels.json');
const jsChallengesPath = path.join(__dirname, '../data/js_logic_challenges_40.json');

console.log('Reading tasks.levels.json...');
const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
console.log(`Found ${tasks.length} total tasks`);

console.log('Reading js_logic_challenges_40.json...');
const jsChallenges = JSON.parse(fs.readFileSync(jsChallengesPath, 'utf-8'));
console.log(`Found ${jsChallenges.length} new JavaScript challenges`);

// Filter out existing JS challenges (multiple possible category values)
const nonJsTasks = tasks.filter(t =>
  !['js', 'javascript', 'javascript-logic'].includes(t.category?.toLowerCase())
);
console.log(`Found ${tasks.length - nonJsTasks.length} existing JS challenges to replace`);
console.log(`Found ${nonJsTasks.length} non-JS tasks to keep`);

// Transform new JS challenges to match the expected schema
const transformedChallenges = jsChallenges.map((challenge, index) => {
  // Transform tests to match the old format
  const tests = challenge.tests.map(test => ({
    id: test.id,
    code: test.code,
    label: test.description || `Test ${test.id}`
  }));

  // Use the first solution as the main solution
  const solution = challenge.solutions && challenge.solutions.length > 0
    ? challenge.solutions[0].files
    : challenge.scaffold;

  // Build alternative solutions from the remaining solutions
  const alternativeSolutions = challenge.solutions && challenge.solutions.length > 1
    ? challenge.solutions.slice(1).map(sol => ({
        label: sol.id || 'Alternative',
        files: sol.files,
        explanation: sol.explanation || 'An alternative solution approach.'
      }))
    : [];

  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    category: 'javascript', // Normalize to 'javascript'
    scaffold: challenge.scaffold,
    tests: tests,
    solution: solution,
    hints: challenge.hints || [],
    alternativeSolutions: alternativeSolutions,
    realWorldContext: challenge.why_it_matters || `Learn ${challenge.title.toLowerCase()} - a fundamental JavaScript concept used in modern web development.`
  };
});

// Combine: non-JS tasks + new JS challenges
const updatedTasks = [...nonJsTasks, ...transformedChallenges];

// Sort to maintain order: HTML (1), CSS (2), JavaScript (3), Mixed (4+)
updatedTasks.sort((a, b) => {
  const categoryOrder = {
    html: 1,
    css: 2,
    javascript: 3,
    js: 3,
    'javascript-logic': 3,
    advanced: 4,
    'html, css': 5,
    'html, css, js': 6
  };
  const catA = categoryOrder[a.category] || 999;
  const catB = categoryOrder[b.category] || 999;

  if (catA !== catB) return catA - catB;
  return a.id.localeCompare(b.id);
});

console.log(`\nNew tasks.levels.json will have ${updatedTasks.length} tasks:`);
const byCategory = updatedTasks.reduce((acc, t) => {
  acc[t.category] = (acc[t.category] || 0) + 1;
  return acc;
}, {});
console.log('By category:', byCategory);

// Backup the original file
const backupPath = tasksPath + '.backup';
console.log(`\nCreating backup at ${backupPath}...`);
fs.copyFileSync(tasksPath, backupPath);

// Write the updated tasks
console.log(`Writing updated tasks to ${tasksPath}...`);
fs.writeFileSync(tasksPath, JSON.stringify(updatedTasks, null, 2), 'utf-8');

console.log('\n✅ Successfully merged JavaScript challenges!');
console.log(`   - Replaced ${tasks.length - nonJsTasks.length} old JS challenges`);
console.log(`   - Added ${transformedChallenges.length} new JS challenges`);
console.log(`   - Total tasks: ${updatedTasks.length}`);
console.log(`   - Backup saved to: ${backupPath}`);

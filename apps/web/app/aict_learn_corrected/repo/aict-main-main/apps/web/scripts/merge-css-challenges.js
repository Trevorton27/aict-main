// ============================================================
// merge-css-challenges.js
// ============================================================
// Purpose: Merges CSS challenges from css_challenges_40.json
//          into tasks.levels.json, replacing existing CSS challenges
//
// When to run: After updating css_challenges_40.json
//
// Usage: node scripts/merge-css-challenges.js
//
// What it does:
// 1. Reads css_challenges_40.json (source of truth for CSS)
// 2. Reads tasks.levels.json (all 160 challenges)
// 3. Replaces CSS challenges in tasks.levels.json
// 4. Keeps other challenges (HTML, JS, Full Stack) intact
// 5. Creates backup before overwriting
// ============================================================

const fs = require('fs');
const path = require('path');

// Read both files
const tasksPath = path.join(__dirname, '../data/tasks.levels.json');
const cssChallengesPath = path.join(__dirname, '../data/css_challenges_40.json');

console.log('Reading tasks.levels.json...');
const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
console.log(`Found ${tasks.length} total tasks`);

console.log('Reading css_challenges_40.json...');
const cssChallenges = JSON.parse(fs.readFileSync(cssChallengesPath, 'utf-8'));
console.log(`Found ${cssChallenges.length} new CSS challenges`);

// Filter out existing CSS challenges
const nonCssTasks = tasks.filter(t => t.category !== 'css');
console.log(`Found ${tasks.length - nonCssTasks.length} existing CSS challenges to replace`);
console.log(`Found ${nonCssTasks.length} non-CSS tasks to keep`);

// Transform new CSS challenges to match the expected schema
const transformedChallenges = cssChallenges.map((challenge, index) => {
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
    category: challenge.category,
    scaffold: challenge.scaffold,
    tests: tests,
    solution: solution,
    hints: challenge.hints || [],
    alternativeSolutions: alternativeSolutions,
    realWorldContext: challenge.realWorldContext || `Learn ${challenge.title.toLowerCase()} - a fundamental CSS concept used in modern web design.`
  };
});

// Combine: new CSS challenges + existing non-CSS tasks
const updatedTasks = [...nonCssTasks, ...transformedChallenges];

// Sort to maintain order: HTML (l1), CSS (l2), JS (l3), Advanced (l4)
updatedTasks.sort((a, b) => {
  const categoryOrder = { html: 1, css: 2, javascript: 3, js: 3, advanced: 4 };
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

console.log('\n✅ Successfully merged CSS challenges!');
console.log(`   - Replaced ${tasks.length - nonCssTasks.length} old CSS challenges`);
console.log(`   - Added ${transformedChallenges.length} new CSS challenges`);
console.log(`   - Total tasks: ${updatedTasks.length}`);
console.log(`   - Backup saved to: ${backupPath}`);

// ============================================================
// merge-fullstack-challenges.js
// ============================================================
// Purpose: Merges Full Stack (HTML+CSS+JS) challenges from
//          full_web_challenges_40.json into tasks.levels.json
//
// When to run: After updating full_web_challenges_40.json
//
// Usage: node scripts/merge-fullstack-challenges.js
//
// What it does:
// 1. Reads full_web_challenges_40.json (source of truth for Full Stack)
// 2. Reads tasks.levels.json (all 200 challenges)
// 3. Replaces Full Stack challenges in tasks.levels.json
// 4. Keeps other challenges (HTML, CSS, JS) intact
// 5. Creates backup before overwriting
// ============================================================

const fs = require('fs');
const path = require('path');

// Read both files
const tasksPath = path.join(__dirname, '../data/tasks.levels.json');
const fullStackChallengesPath = path.join(__dirname, '../data/full_web_challenges_40.json');

console.log('Reading tasks.levels.json...');
const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
console.log(`Found ${tasks.length} total tasks`);

console.log('Reading full_web_challenges_40.json...');
const fullStackChallenges = JSON.parse(fs.readFileSync(fullStackChallengesPath, 'utf-8'));
console.log(`Found ${fullStackChallenges.length} new Full Stack challenges`);

// Filter out existing Full Stack challenges (category: "html-css-js" or "advanced")
// web-001 to web-040 are the new IDs
const nonFullStackTasks = tasks.filter(t => {
  // Keep tasks that are NOT html-css-js category
  return t.category !== 'html-css-js';
});
console.log(`Found ${tasks.length - nonFullStackTasks.length} existing Full Stack challenges to replace`);
console.log(`Found ${nonFullStackTasks.length} non-Full Stack tasks to keep`);

// Transform new Full Stack challenges to match the expected schema
const transformedChallenges = fullStackChallenges.map((challenge, index) => {
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
    category: challenge.category, // Should be "html-css-js"
    scaffold: challenge.scaffold,
    tests: tests,
    solution: solution,
    hints: challenge.hints || [],
    alternativeSolutions: alternativeSolutions,
    realWorldContext: challenge.why_it_matters || `Learn ${challenge.title.toLowerCase()} - combining HTML, CSS, and JavaScript in real-world applications.`
  };
});

// Combine: new Full Stack challenges + existing non-Full Stack tasks
const updatedTasks = [...nonFullStackTasks, ...transformedChallenges];

// Sort to maintain order: HTML (l1), CSS (l2), JS (l3), Full Stack (l4)
updatedTasks.sort((a, b) => {
  const categoryOrder = {
    html: 1,
    css: 2,
    javascript: 3,
    js: 3,
    'html-css-js': 4,
    advanced: 4
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

console.log('\n✅ Successfully merged Full Stack challenges!');
console.log(`   - Replaced ${tasks.length - nonFullStackTasks.length} old Full Stack challenges`);
console.log(`   - Added ${transformedChallenges.length} new Full Stack challenges`);
console.log(`   - Total tasks: ${updatedTasks.length}`);
console.log(`   - Backup saved to: ${backupPath}`);

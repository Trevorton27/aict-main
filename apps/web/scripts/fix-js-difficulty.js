// fix-js-difficulty.js
// Updates all JavaScript challenges to have difficulty: 3 (Level 3)

const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '../data/tasks.levels.json');

console.log('Reading tasks.levels.json...');
const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
console.log(`Found ${tasks.length} total tasks`);

// Find JavaScript challenges
const jsChallenges = tasks.filter(t => t.category === 'javascript');
console.log(`Found ${jsChallenges.length} JavaScript challenges`);

// Count by current difficulty
const byDifficulty = jsChallenges.reduce((acc, t) => {
  acc[t.difficulty] = (acc[t.difficulty] || 0) + 1;
  return acc;
}, {});
console.log('Current difficulty distribution:', byDifficulty);

// Create backup
const backupPath = tasksPath + '.backup';
console.log(`\nCreating backup at ${backupPath}...`);
fs.copyFileSync(tasksPath, backupPath);

// Update all JavaScript challenges to difficulty: 3
const updatedTasks = tasks.map(task => {
  if (task.category === 'javascript') {
    return { ...task, difficulty: 3 };
  }
  return task;
});

// Write updated tasks
console.log(`\nWriting updated tasks to ${tasksPath}...`);
fs.writeFileSync(tasksPath, JSON.stringify(updatedTasks, null, 2), 'utf-8');

console.log('\n✅ Successfully updated JavaScript challenge difficulties to 3!');
console.log(`   - Updated ${jsChallenges.length} JavaScript challenges`);
console.log(`   - Backup saved to: ${backupPath}`);

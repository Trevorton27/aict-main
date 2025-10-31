// fix-all-difficulty-levels.js
// Sets difficulty levels based on category to match the level selector

const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '../data/tasks.levels.json');

console.log('Reading tasks.levels.json...');
const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));
console.log(`Found ${tasks.length} total tasks`);

// Create backup
const backupPath = tasksPath + '.backup';
console.log(`\nCreating backup at ${backupPath}...`);
fs.copyFileSync(tasksPath, backupPath);

// Map categories to difficulty levels
const categoryToDifficulty = {
  'html': 1,                    // Level 1: HTML
  'css': 2,                     // Level 2: CSS
  'javascript': 3,              // Level 3: JavaScript
  'js': 3,                      // Level 3: JavaScript (alternate)
  'html-css-js': 4,             // Level 4: Full Stack
  'html, css': 2,               // Level 2: HTML + CSS
  'html, css, js': 4,           // Level 4: Full Stack
  'html-css': 2,                // Level 2: HTML + CSS
  'logic+dom': 3                // Level 3: JavaScript Logic
};

// Update all tasks based on category
let updatedCount = 0;
const updatedTasks = tasks.map(task => {
  const targetDifficulty = categoryToDifficulty[task.category];

  if (targetDifficulty && task.difficulty !== targetDifficulty) {
    updatedCount++;
    return { ...task, difficulty: targetDifficulty };
  }

  return task;
});

// Write updated tasks
console.log(`\nWriting updated tasks to ${tasksPath}...`);
fs.writeFileSync(tasksPath, JSON.stringify(updatedTasks, null, 2), 'utf-8');

// Show summary
console.log('\n✅ Successfully updated difficulty levels!');
console.log(`   - Updated ${updatedCount} tasks`);
console.log(`   - Backup saved to: ${backupPath}`);

// Show counts by level
const byLevel = updatedTasks.reduce((acc, t) => {
  acc[t.difficulty] = (acc[t.difficulty] || 0) + 1;
  return acc;
}, {});
console.log('\nChallenges by level:');
console.log(`   Level 1 (HTML): ${byLevel[1] || 0}`);
console.log(`   Level 2 (CSS): ${byLevel[2] || 0}`);
console.log(`   Level 3 (JavaScript): ${byLevel[3] || 0}`);
console.log(`   Level 4 (Full Stack): ${byLevel[4] || 0}`);

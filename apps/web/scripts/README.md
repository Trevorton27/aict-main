# Scripts Documentation

This directory contains utility scripts for data management.

## Active Scripts

### merge-html-challenges.js

**Purpose**: Merges HTML challenges from `html_challenges_40.json` into `tasks.levels.json`

**When to run**: After updating `html_challenges_40.json` with new HTML challenges

**Usage**:
```bash
cd apps/web
node scripts/merge-html-challenges.js
```

**What it does**:
1. Reads `html_challenges_40.json` (source of truth for HTML challenges)
2. Reads `tasks.levels.json` (all challenges)
3. Replaces all HTML category challenges in `tasks.levels.json`
4. Keeps other categories (CSS, JS, Full Stack) intact
5. Creates `tasks.levels.json.backup` before overwriting
6. Transforms data structure to match app expectations

**Output**:
- Updates `data/tasks.levels.json`
- Creates `data/tasks.levels.json.backup`
- Prints summary of changes

---

### merge-css-challenges.js

**Purpose**: Merges CSS challenges from `css_challenges_40.json` into `tasks.levels.json`

**When to run**: After updating `css_challenges_40.json` with new CSS challenges

**Usage**:
```bash
cd apps/web
node scripts/merge-css-challenges.js
```

**What it does**:
1. Reads `css_challenges_40.json` (source of truth for CSS challenges)
2. Reads `tasks.levels.json` (all challenges)
3. Replaces all CSS category challenges in `tasks.levels.json`
4. Keeps other categories (HTML, JS, Full Stack) intact
5. Creates `tasks.levels.json.backup` before overwriting
6. Transforms data structure to match app expectations

**Output**:
- Updates `data/tasks.levels.json`
- Creates `data/tasks.levels.json.backup`
- Prints summary of changes

---

### merge-js-challenges.js

**Purpose**: Merges JavaScript challenges from `js_logic_challenges_40.json` into `tasks.levels.json`

**When to run**: After updating `js_logic_challenges_40.json` with new JavaScript challenges

**Usage**:
```bash
cd apps/web
node scripts/merge-js-challenges.js
```

**What it does**:
1. Reads `js_logic_challenges_40.json` (source of truth for JavaScript challenges)
2. Reads `tasks.levels.json` (all challenges)
3. Replaces all JavaScript category challenges in `tasks.levels.json`
4. Keeps other categories (HTML, CSS, Full Stack) intact
5. Creates `tasks.levels.json.backup` before overwriting
6. Transforms data structure to match app expectations

**Output**:
- Updates `data/tasks.levels.json`
- Creates `data/tasks.levels.json.backup`
- Prints summary of changes

---

### merge-fullstack-challenges.js

**Purpose**: Merges Full Stack challenges from `full_web_challenges_40.json` into `tasks.levels.json`

**When to run**: After updating `full_web_challenges_40.json` with new Full Stack challenges

**Usage**:
```bash
cd apps/web
node scripts/merge-fullstack-challenges.js
```

**What it does**:
1. Reads `full_web_challenges_40.json` (source of truth for Full Stack challenges)
2. Reads `tasks.levels.json` (all challenges)
3. Replaces all Full Stack (html-css-js) category challenges in `tasks.levels.json`
4. Keeps other categories (HTML, CSS, JS) intact
5. Creates `tasks.levels.json.backup` before overwriting
6. Transforms data structure to match app expectations

**Output**:
- Updates `data/tasks.levels.json`
- Creates `data/tasks.levels.json.backup`
- Prints summary of changes

---

## Legacy Scripts (Database Only)

The following scripts are **only needed if using database mode** (`TASKS_SOURCE=db`).

For development with JSON files (`TASKS_SOURCE=local`), these scripts are **not required**.

### seed-challenges.ts

**Purpose**: Seeds challenges into PostgreSQL database

**When to use**: Only when using database mode for production

**Usage**:
```bash
npx tsx scripts/seed-challenges.ts
```

### seed-tasks.ts

**Purpose**: Alternative database seeding script

**When to use**: Only when using database mode

**Usage**:
```bash
npx tsx scripts/seed-tasks.ts
```

---

## Recommended Workflow

### For Development (JSON Files)

**For HTML challenges:**
1. Edit `data/html_challenges_40.json` to add/modify HTML challenges
2. Run `node scripts/merge-html-challenges.js` to update main data file
3. Restart dev server to see changes

**For CSS challenges:**
1. Edit `data/css_challenges_40.json` to add/modify CSS challenges
2. Run `node scripts/merge-css-challenges.js` to update main data file
3. Restart dev server to see changes

**For JavaScript challenges:**
1. Edit `data/js_logic_challenges_40.json` to add/modify JavaScript challenges
2. Run `node scripts/merge-js-challenges.js` to update main data file
3. Restart dev server to see changes

**For Full Stack challenges:**
1. Edit `data/full_web_challenges_40.json` to add/modify Full Stack challenges
2. Run `node scripts/merge-fullstack-challenges.js` to update main data file
3. Restart dev server to see changes

**No database scripts needed!**

### For Production (Database)

1. Set `TASKS_SOURCE=db` in `.env.local`
2. Run `npx prisma generate` to generate Prisma client
3. Run `npx prisma migrate dev` to create database tables
4. Run `npx prisma db seed` to populate challenges
5. Deploy with database connection string

---

## Data File Structure

```
apps/web/data/
├── html_challenges_40.json       # Source of truth for HTML challenges
│                                  # - Rich metadata (hints, solutions)
│                                  # - Used by variants API
│                                  # - Edit this file to modify HTML challenges
│
├── css_challenges_40.json        # Source of truth for CSS challenges
│                                  # - Rich metadata (hints, solutions)
│                                  # - Used by variants API
│                                  # - Edit this file to modify CSS challenges
│
├── js_logic_challenges_40.json   # Source of truth for JavaScript challenges
│                                  # - Rich metadata (hints, solutions)
│                                  # - Used by variants API
│                                  # - Edit this file to modify JS challenges
│
├── full_web_challenges_40.json   # Source of truth for Full Stack challenges
│                                  # - Rich metadata (hints, solutions)
│                                  # - Used by variants API
│                                  # - Edit this file to modify Full Stack challenges
│
└── tasks.levels.json             # All 240 challenges merged
                                   # - Used by main app (/api/tasks)
                                   # - Generated by merge scripts
                                   # - Don't edit individual challenges here directly
```

---

## Tips

- Always backup before running merge scripts
- The merge script automatically creates backups
- Test changes in dev before deploying
- JSON files are version-controlled, database data is not

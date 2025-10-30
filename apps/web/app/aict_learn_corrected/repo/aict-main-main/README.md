# AI Coding Interactive Tutor

**An intelligent, adaptive web-based coding tutor powered by Claude AI**

---

## Overview

An interactive learning platform that teaches web development fundamentals through hands-on coding challenges. Students write real code in a browser-based editor, receive instant feedback, and get personalized guidance from an AI tutor powered by Claude 3.5.

### Key Features

- **240 Progressive Challenges** across HTML, CSS, JavaScript, and Full Stack
- **160 Enhanced Challenges** with progressive hints, multiple solutions, and real-world context
- **AI-Powered Hints System** with 3 progressive difficulty levels
- **Solution Unlocking** after 3 genuine attempts (encourages learning)
- **Live Code Editor** with Monaco Editor and real-time preview
- **Automated Testing** runs directly in the browser
- **AI Theme Variants** generates themed versions of challenges using Claude Haiku
- **Adaptive AI Tutor** provides contextual help and explanations

---

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor (VS Code's editor)
- **AI**: Anthropic Claude 3.5 (Haiku & Sonnet)
- **Testing**: JSDOM for server-side DOM testing
- **Optional Database**: PostgreSQL via Prisma (for production)

---

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd aictutor_static_core_plus_variants

# Install dependencies
pnpm install

# Configure environment
cd apps/web
cp .env.example .env.local
```

### Configuration

Edit `apps/web/.env.local`:

```bash
# Required: Your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional: Claude model to use (defaults to Haiku)
CLAUDE_MODEL=claude-3-5-haiku-20241022

# Data source: "local" uses JSON files, "db" uses PostgreSQL
TASKS_SOURCE=local

# Optional: Database (only if using TASKS_SOURCE=db)
DATABASE_URL="postgresql://..."

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
cd apps/web
pnpm dev
```

Open [http://localhost:3000/learn](http://localhost:3000/learn) to start coding!

---

## Project Structure

```
apps/web/
├── app/
│   ├── api/
│   │   ├── eval/          # Test execution API
│   │   ├── tasks/         # Challenge loading API
│   │   ├── variants/      # AI theme generation API
│   │   └── v1/            # AI tutor chat API
│   ├── components/        # React components
│   │   ├── ChallengeDetails.tsx   # Challenge info with hints/solutions
│   │   ├── CodeEditor.tsx         # Monaco editor wrapper
│   │   ├── ChatPanel.tsx          # AI tutor interface
│   │   └── ...
│   ├── learn/            # Main learning page
│   └── lib/              # Utilities and helpers
├── data/
│   ├── html_challenges_40.json       # Original HTML challenges (source of truth)
│   ├── css_challenges_40.json        # Original CSS challenges (source of truth)
│   ├── js_logic_challenges_40.json   # Original JavaScript challenges (source of truth)
│   ├── full_web_challenges_40.json   # Original Full Stack challenges (source of truth)
│   └── tasks.levels.json             # All 240 challenges merged
├── scripts/
│   ├── merge-html-challenges.js      # HTML data processing
│   ├── merge-css-challenges.js       # CSS data processing
│   ├── merge-js-challenges.js        # JavaScript data processing
│   └── merge-fullstack-challenges.js # Full Stack data processing
└── package.json
```

---

## Challenge Structure

### Challenge Levels

1. **Level 1 - HTML** (40 challenges): HTML fundamentals, semantic markup, forms, accessibility
2. **Level 2 - CSS** (40 challenges): Styling, selectors, box model, flexbox, grid, animations
3. **Level 3 - JavaScript** (40 challenges): DOM manipulation, events, functions, async
4. **Level 4 - Full Stack** (40 challenges): Integration, APIs, state management, HTML+CSS+JS combined
5. **Mixed Levels** (80 challenges): Additional HTML+CSS and HTML+CSS+JS challenges

### Enhanced Challenges (HTML, CSS, JavaScript, Full Stack)

The first 160 challenges (HTML + CSS + JavaScript + Full Stack) include:
- **Progressive Hints**: 3 levels of hints per challenge
- **Multiple Solutions**: Reference solutions with detailed code and alternative approaches
- **Tests**: Automated DOM assertions
- **Real-world Context**: Why each skill matters in professional development

Example challenge structure:
```json
{
  "id": "html-001",
  "title": "Headings 101",
  "description": "Create a document with one <h1> and two <h2> elements...",
  "difficulty": 1,
  "category": "html",
  "scaffold": { "index.html": "...", "style.css": "...", "script.js": "..." },
  "tests": [
    {
      "id": "t1",
      "description": "Has one h1 element",
      "type": "dom",
      "code": "const passed = []; ..."
    }
  ],
  "hints": [
    { "level": 1, "text": "Use <h1> for the main title..." },
    { "level": 2, "text": "You need exactly one h1 and two h2." },
    { "level": 3, "text": "Copy: <h1>My Web Page</h1>..." }
  ],
  "solutions": [
    {
      "id": "minimal",
      "files": { "index.html": "...", "style.css": "...", "script.js": "..." }
    }
  ]
}
```

---

## Features Explained

### Solution Locking System

Solutions are **locked until 3 attempts** to encourage genuine learning:

1. Student writes code and clicks "Run Tests" (Attempt 1)
2. Tests fail, student tries again (Attempt 2)
3. Student tries a third time (Attempt 3)
4. Solutions unlock - student can now view reference code

**Visual Indicators:**
- Header shows attempt progress: `●●● 3/3`
- "Show Solution" button displays lock status: `🔒 Solution (2/3)`
- Solutions tab shows unlock requirements with circular progress

### Progressive Hints System

Each HTML challenge includes 3 levels of hints:
- **Level 1**: General concept guidance
- **Level 2**: More specific direction
- **Level 3**: Nearly complete solution

Access hints through the "Hints" tab in the challenge details panel.

### AI Theme Variants

Generate themed versions of any challenge while keeping tests identical:

1. Click **"New Variant"** button
2. AI generates a themed version (e.g., space theme, cooking theme)
3. Tests remain the same - grading stays consistent
4. Great for practicing the same concepts in different contexts

Powered by Claude Haiku for cost-effective generation.

### AI Tutor Chat

Ask questions anytime:
- "I'm stuck, can you give me a hint?"
- "What does this error mean?"
- "Can you explain how flexbox works?"
- "Is my approach correct?"

The AI tutor has full context of:
- Current challenge and requirements
- Your code
- Test results
- Available hints

---

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
```

### Data Management

**Using JSON Files (Recommended for Development):**
- Set `TASKS_SOURCE=local` in `.env.local`
- Challenges loaded from `data/tasks.levels.json`
- No database setup required

**Using Database (Optional for Production):**
```bash
# Set TASKS_SOURCE=db in .env.local
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with challenges
npx prisma db seed
```

### Updating Challenges

**HTML challenges:**
```bash
cd apps/web
# Edit data/html_challenges_40.json
node scripts/merge-html-challenges.js
```

**CSS challenges:**
```bash
cd apps/web
# Edit data/css_challenges_40.json
node scripts/merge-css-challenges.js
```

**JavaScript challenges:**
```bash
cd apps/web
# Edit data/js_logic_challenges_40.json
node scripts/merge-js-challenges.js
```

**Full Stack challenges:**
```bash
cd apps/web
# Edit data/full_web_challenges_40.json
node scripts/merge-fullstack-challenges.js
```

These scripts update `tasks.levels.json` with the latest challenge data.

---

## Architecture Decisions

### Why JSON Files + Optional Database?

- **Development**: JSON files are simple, no database setup needed
- **Production**: Database enables user progress tracking, analytics
- **Flexibility**: Switch between modes with one environment variable

### Why Multiple Data Files?

- `html_challenges_40.json`: Original source with rich metadata (hints, solutions) for HTML
- `css_challenges_40.json`: Original source with rich metadata (hints, solutions) for CSS
- `js_logic_challenges_40.json`: Original source with rich metadata (hints, solutions) for JavaScript
- `full_web_challenges_40.json`: Original source with rich metadata (hints, solutions) for Full Stack
- `tasks.levels.json`: Merged data for all 240 challenges (used by main app)

The variants API uses the original challenge files directly to preserve data fidelity and enable theme generation.

### Test Execution

Tests run server-side using JSDOM:
1. Client sends code to `/api/eval`
2. Server creates virtual DOM with JSDOM
3. Tests execute in Node.js environment
4. Results returned to client

This keeps client-side execution sandboxed and secure.

---

## Deployment

### Vercel (Recommended)

```bash
# Build command (configured in package.json)
pnpm vercel-build

# Environment variables to set in Vercel dashboard:
ANTHROPIC_API_KEY=sk-ant-...
TASKS_SOURCE=local  # or "db" if using database
DATABASE_URL=postgresql://...  # only if using database
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Other Platforms

Standard Next.js deployment applies. Ensure environment variables are set.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

MIT License - feel free to use this for your own learning platform!

---

## Support

For issues or questions:
- Open a GitHub issue
- Check existing issues for solutions
- Review the code comments for implementation details

---

## Roadmap

- [ ] User authentication and progress tracking
- [ ] More challenge categories (React, TypeScript, Node.js)
- [ ] Leaderboards and achievements
- [ ] Code sharing and collaboration features
- [ ] Mobile-responsive improvements
- [ ] Offline mode support

---

Built with ❤️ for learners who love to code

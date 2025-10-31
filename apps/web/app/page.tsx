// apps/web/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Hero Section */}
      <header className="px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
          Learn to Code with AI Guidance
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 transition-colors">
          Master web development through hands-on practice with an intelligent tutor
          that guides you to discover solutions yourself.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/learn"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
          >
            Start Learning
          </Link>
          <Link
            href="/tasks"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 font-medium text-lg transition-colors"
          >
            Browse Tasks
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">AI-Powered Hints</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
              Get personalized guidance at three levels: conceptual, API reference, or code patterns
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">Real Code Editor</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
              Write code in a professional Monaco editor with syntax highlighting and live preview
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">Instant Feedback</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
              Run automated tests to validate your solution and track your progress
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white transition-colors">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Choose a Task</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Start with beginner-friendly tasks and progress to advanced projects
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Write Code</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Use the integrated editor to write HTML, CSS, and JavaScript
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Get Help When Stuck</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Ask the AI tutor for hints - it will guide you without giving away the answer
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Test Your Solution</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Run automated tests to verify your code works correctly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">Ready to Start Learning?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors">Join thousands of students learning to code the right way</p>
        <Link
          href="/learn"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
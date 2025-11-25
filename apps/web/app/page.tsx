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
          Start your journey in web development with interactive coding challenges and an AI tutor to help you along the way.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/learn"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
          >
            Try the AI tutor
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
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Select a Challenge</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Choose from HTML, CSS, JavaScript, or full-stack challenges across four difficulty levels
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Code in a Professional Editor</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Write HTML, CSS, and JavaScript with syntax highlighting, live preview, and instant feedback
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Get AI-Powered Guidance</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Chat with the AI tutor for conceptual hints, API references, or code patterns - tailored to your needs
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white transition-colors">Validate and Progress</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">
                  Run automated tests to check your solution and unlock the answer after three attempts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">Learn More About Trevor</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors">
          Explore more of my work and connect with me
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://trevormearns.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition-colors"
          >
            <span>🌐</span>
            <span>Personal Website</span>
          </a>
          <a
            href="https://github.com/Trevorton27"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 font-medium text-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </section>
    </div>
  );
}
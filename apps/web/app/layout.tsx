// apps/web/app/layout.tsx
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', String(newValue));
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-light-bg dark:bg-dark-900 transition-colors font-sans">
        {/* Modern Navigation Bar with Gradient */}
        <nav className="bg-gradient-to-b from-light-header-start to-light-header-end dark:from-dark-850 dark:to-dark-850 border-b border-light-border dark:border-dark-700 shadow-subtle transition-colors relative">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="flex items-center gap-2 text-xl font-bold text-text-light-heading dark:text-white transition-colors group">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-150">🧠</span>
                <span>AI Coding Tutor</span>
              </a>
              <div className="flex gap-2 items-center">
                <a href="/learn" className="px-4 py-2 rounded-xl text-sm font-medium text-text-light-body dark:text-gray-300 hover:bg-white dark:hover:bg-dark-800 hover:text-text-light-heading dark:hover:text-white transition-all duration-150 hover:shadow-subtle">
                  Try the AI tutor
                </a>
                <div className="w-px h-6 bg-light-border dark:bg-dark-700 mx-2"></div>
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-150 shadow-subtle hover:shadow-card-light"
                  title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <span className="text-xl">☀️</span>
                  ) : (
                    <span className="text-xl">🌙</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
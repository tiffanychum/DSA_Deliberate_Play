"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LinkedListFoundationalGame = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkModeMediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      
      darkModeMediaQuery.addEventListener('change', handleChange);
      return () => {
        darkModeMediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950">
      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/games/linked-list-adventure" className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Linked List Adventure
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
              Linked List Foundational
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 dark:border-gray-700/30">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <span className="text-4xl">🔗</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Linked List Foundational
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master the fundamentals of linked lists through interactive visualizations and hands-on challenges. 
              Learn traversal, insertion, deletion, and reversal operations with step-by-step guidance.
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-3">🚧</span>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                  Coming Soon!
                </h3>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-center">
                We're building an amazing interactive linked list learning experience. 
                Check back soon for hands-on challenges and visualizations!
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-xl border border-emerald-200 dark:border-emerald-700">
                <div className="text-2xl mb-3">🔄</div>
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Interactive Traversal</h4>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">
                  Step through linked lists node by node with visual animations
                </p>
              </div>
              
              <div className="bg-teal-50 dark:bg-teal-900/30 p-6 rounded-xl border border-teal-200 dark:border-teal-700">
                <div className="text-2xl mb-3">➕</div>
                <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-2">Dynamic Operations</h4>
                <p className="text-sm text-teal-600 dark:text-teal-300">
                  Practice insertion and deletion with real-time feedback
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <div className="text-2xl mb-3">🔀</div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Reversal Mastery</h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Master iterative and recursive reversal techniques
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/games/linked-list-adventure/multiple-choice"
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Try Multiple Choice Instead
              </Link>
              
              <Link 
                href="/games/linked-list-adventure"
                className="px-8 py-3 bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 font-semibold rounded-lg shadow-md hover:shadow-lg border border-emerald-200 dark:border-emerald-600 transform hover:scale-105 transition-all"
              >
                Back to Hub
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinkedListFoundationalGame;

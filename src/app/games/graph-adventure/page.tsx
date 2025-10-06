"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Import the games as components from subdirectories
import GraphFoundationalGame from './foundational/page';
import GraphMultipleChoiceGame from './multiple-choice/page';

const GraphAdventurePage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
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

  const games = [
    {
      id: 'graph-foundational',
      name: 'Graph Foundational',
      description: 'Master graph fundamentals through interactive visualizations. Learn BFS, DFS, shortest paths, and MST algorithms with step-by-step visual guidance and hands-on coding challenges.',
      icon: '🕸️',
      difficulty: 'Medium',
      color: 'from-blue-500 to-cyan-600',
      questionCount: '10+ Interactive Challenges'
    },
    {
      id: 'graph-multiple-choice',
      name: 'Graph Multiple Choice',
      description: 'Comprehensive assessment covering 9 major graph topics: SCC, Max Flow, BFS/DFS, Topological Sort, Shortest Paths, MST, Union-Find, Bipartite, plus advanced algorithms and optimization techniques.',
      icon: '🎯',
      difficulty: 'Medium',
      color: 'from-cyan-500 to-blue-600',
      questionCount: '120+ Questions + Follow-ups'
    }
  ];

  if (selectedGame === 'graph-foundational') {
    return <GraphFoundationalGame />;
  }

  if (selectedGame === 'graph-multiple-choice') {
    return <GraphMultipleChoiceGame />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[60%] -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/games" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Games
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Graph Algorithm Adventure
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Graph Algorithm Adventure
          </h1>
          
          {/* Topic Coverage Summary */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-white/20 dark:border-gray-700/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🕸️ Comprehensive Graph Algorithm Coverage
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-red-700 dark:text-red-300">SCC & Bridges</span>
                <div className="text-xs text-red-600 dark:text-red-400">15 Questions</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-orange-700 dark:text-orange-300">Max Flow</span>
                <div className="text-xs text-orange-600 dark:text-orange-400">12 Questions</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-yellow-700 dark:text-yellow-300">BFS & DFS</span>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">15 Questions</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-green-700 dark:text-green-300">Topological Sort</span>
                <div className="text-xs text-green-600 dark:text-green-400">12 Questions</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-blue-700 dark:text-blue-300">Shortest Paths</span>
                <div className="text-xs text-blue-600 dark:text-blue-400">18 Questions</div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-indigo-700 dark:text-indigo-300">MST</span>
                <div className="text-xs text-indigo-600 dark:text-indigo-400">12 Questions</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-purple-700 dark:text-purple-300">Union-Find</span>
                <div className="text-xs text-purple-600 dark:text-purple-400">12 Questions</div>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-pink-700 dark:text-pink-300">Bipartite</span>
                <div className="text-xs text-pink-600 dark:text-pink-400">12 Questions</div>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 px-3 py-2 rounded-lg">
                <span className="font-medium text-cyan-700 dark:text-cyan-300">Advanced</span>
                <div className="text-xs text-cyan-600 dark:text-cyan-400">12 Questions</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">45 Missing Lines</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">54 Conceptual</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">27 Optimization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-300">120+ Total + Follow-ups</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30 transform hover:scale-105 transition-all cursor-pointer"
              onClick={() => setSelectedGame(game.id)}
            >
              <div className={`h-2 bg-gradient-to-r ${game.color}`}></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl">{game.icon}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    game.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : game.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {game.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {game.description}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {game.questionCount}
                  </span>
                </div>
                
                <button className={`w-full py-3 px-6 bg-gradient-to-r ${game.color} text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all`}>
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            More Graph Games Coming Soon!
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-2xl mb-2 block">🎲</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Graph Puzzle Solver</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-2xl mb-2 block">🏗️</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Graph Builder</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-2xl mb-2 block">🎯</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Graph Race</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
              <span className="text-2xl mb-2 block">🧩</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Network Analysis</p>
            </div>
          </div>
        </div>
      </main>

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default GraphAdventurePage;

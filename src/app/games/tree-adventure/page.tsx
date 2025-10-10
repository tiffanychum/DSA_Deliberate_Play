'use client';

import Link from 'next/link';

export default function TreeAdventurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
            🌳 Tree Algorithm Adventure
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master tree algorithms through interactive challenges and comprehensive multiple-choice questions. 
            From basic traversals to advanced tree DP, build your expertise step by step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Foundational Game */}
          <Link href="/games/tree-adventure/foundational">
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-green-200 dark:border-green-800">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10"></div>
              <div className="relative p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    🌲
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tree Foundational</h2>
                    <p className="text-green-600 dark:text-green-400 font-medium">Interactive Coding Challenges</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Build tree algorithms from scratch with step-by-step guidance. Implement traversals, 
                  search operations, and tree modifications with real-time visualization.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Binary Tree Traversals (Inorder, Preorder, Postorder)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    Binary Search Tree Operations
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    Tree Construction and Serialization
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    Algorithm Visualization
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    🎯 Hands-on Practice
                  </span>
                  <div className="text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Multiple Choice Game */}
          <Link href="/games/tree-adventure/multiple-choice">
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-emerald-200 dark:border-emerald-800">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10"></div>
              <div className="relative p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    🧠
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tree Multiple Choice</h2>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">Comprehensive Knowledge Test</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Test your understanding of tree algorithms through carefully crafted multiple choice questions. 
                  Each question includes hints, detailed explanations, and follow-up questions about complexity and patterns.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">49</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Questions</div>
                  </div>
                  <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">12</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Major Topics</div>
                  </div>
                </div>

                {/* Topic Coverage Summary */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Topic Coverage:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Tree DP (12 questions)
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                      LCA & Distance (6 questions)
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                      BST Operations (8 questions)
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                      Tree Traversals (6 questions)
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Tree Construction (6 questions)
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                      Advanced Trees (11 questions)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    🧠 Select Topic - 49 Total Questions
                  </span>
                  <div className="text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              🌳 Complete Tree Algorithm Mastery
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Our Tree Algorithm Adventure covers everything from basic binary tree operations to advanced 
              tree dynamic programming. Whether you're preparing for technical interviews or building 
              algorithmic expertise, these interactive challenges will strengthen your tree algorithm skills.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400 text-xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Targeted Practice</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Focus on specific tree algorithm patterns with curated problem sets
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Progress Tracking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor your improvement with detailed analytics and achievements
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-teal-600 dark:text-teal-400 text-xl">🏆</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Expert Level</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Master advanced concepts like tree DP and complex tree transformations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

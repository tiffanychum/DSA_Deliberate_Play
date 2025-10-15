'use client';

import Link from 'next/link';

export default function PythonMathHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
            🐍 Python & Math Mastery Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master Python fundamentals and mathematical algorithms through comprehensive multiple-choice questions. 
            From lambda functions to binary exponentiation, build expertise for technical interviews at top tech companies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Python Fundamentals */}
          <Link href="/games/python-math-hub/python-foundamental">
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-200 dark:border-purple-800">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-400/10 dark:to-indigo-400/10"></div>
              <div className="relative p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    🐍
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Python Fundamentals</h2>
                    <p className="text-purple-600 dark:text-purple-400 font-medium">Core Python Concepts</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Master essential Python concepts through comprehensive multiple-choice questions. 
                  Cover lambda functions, data structures, string manipulation, and functional programming patterns.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Lambda Functions & Functional Programming (15 questions)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Collections & Data Structures (12 questions)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    String Manipulation & Processing (10 questions)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                    Advanced Python Patterns (8 questions)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">55</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Questions</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">8</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Core Topics</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    🧠 Python Interview Prep
                  </span>
                  <div className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Mathematical Algorithms */}
          <Link href="/games/python-math-hub/mathematical-algorithms">
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-indigo-200 dark:border-indigo-800">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-400/10 dark:to-blue-400/10"></div>
              <div className="relative p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    🧮
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mathematical Algorithms</h2>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">Math & Number Theory</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Dive deep into mathematical algorithms and number theory concepts. 
                  Master modulo operations, binary exponentiation, and advanced mathematical problem-solving techniques.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    Modulo Operations & Properties (12 questions)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Binary Exponentiation & Powers (10 questions)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    Number Theory & Algorithms (15 questions)
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    Mathematical Problem Solving (8 questions)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">45</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Questions</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">7</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Math Topics</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    🔢 Math Interview Mastery
                  </span>
                  <div className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Topic Coverage Details */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              📚 Comprehensive Topic Coverage
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Python Topics */}
              <div>
                <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🐍</span>
                  Python Fundamentals Topics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    Lambda Functions & Closures
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                    DefaultDict & Collections
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    Map, Filter, Reduce
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-3"></div>
                    String Processing & Indexing
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                    Sorting & Custom Keys
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></div>
                    Deque & Advanced Collections
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                    Functional Programming Patterns
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-3"></div>
                    Graph Algorithms with Python
                  </div>
                </div>
              </div>

              {/* Math Topics */}
              <div>
                <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🧮</span>
                  Mathematical Algorithm Topics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></div>
                    Modulo Operations & Properties
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    Binary Exponentiation (Pow)
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-3"></div>
                    Square Root Algorithms
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                    Max Points on Line (Geometry)
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></div>
                    Factorial & Trailing Zeros
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                    Palindrome Numbers
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                    Plus One Algorithm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              🚀 Big Tech Interview Preparation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Our Python & Math Mastery Hub is specifically designed for technical interviews at top tech companies. 
              Each question type includes missing code challenges, conceptual understanding, and optimization scenarios 
              commonly asked at Google, Meta, Amazon, Microsoft, and other leading tech firms.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 dark:text-purple-400 text-xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Interview-Focused</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Questions designed based on real interview patterns from FAANG companies
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 dark:text-indigo-400 text-xl">🧠</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Multi-Format Questions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missing code, conceptual understanding, and optimization challenges
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">📈</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Progressive Difficulty</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  From fundamentals to advanced concepts with detailed explanations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

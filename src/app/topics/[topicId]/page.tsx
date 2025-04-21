"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import NavLinks from '../../components/NavLinks';
import AlgorithmVisualizer from '../../components/AlgorithmVisualizer';

// Define types
type Challenge = {
  id: string;
  name: string;
  difficulty: string;
  description: string;
  isInteractive?: boolean;
};

type SubTopic = {
  id: string;
  name: string;
  completed: boolean;
  description: string;
  challenges: Challenge[];
};

type Topic = {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: SubTopic[];
};

// Move findSubtopic outside the component
const findSubtopic = (topicId: string, subtopicId?: string) => {
  const topic = topicsData[topicId as keyof typeof topicsData];
  if (!topic) return null;
  
  if (!subtopicId) return topic.topics[0]; // Default to first subtopic
  
  return topic.topics.find(t => t.id === subtopicId) || topic.topics[0];
};

// Define static data for visualizers to prevent recreation on each render
const ARRAY_SORT_DATA = [38, 27, 43, 3, 9, 82, 10];
const BINARY_SEARCH_DATA = { array: [3, 7, 11, 15, 19, 25, 36, 42, 51, 68, 74, 83, 99], target: 42 };

// Mock topic data
const topicsData: Record<string, Topic> = {
  "arrays": {
    id: "arrays",
    name: "Arrays & Strings",
    icon: "📊",
    description: "Arrays are the most fundamental data structure in computer science. This topic covers various techniques for manipulating and working with arrays and strings.",
    topics: [
      { 
        id: "two-pointers", 
        name: "Two Pointers", 
        completed: true,
        description: "Learn to use two pointers to efficiently solve array problems",
        challenges: [
          {
            id: "two-sum",
            name: "Two Sum",
            difficulty: "Easy",
            description: "Find two numbers in an array that add up to a specific target",
            isInteractive: true
          },
          {
            id: "container-with-most-water",
            name: "Container With Most Water",
            difficulty: "Medium",
            description: "Find two lines that together with the x-axis form a container that holds the most water"
          }
        ]
      },
      { 
        id: "sliding-window", 
        name: "Sliding Window", 
        completed: true,
        description: "Learn the sliding window technique for array/string problems",
        challenges: [
          {
            id: "longest-substring",
            name: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
            description: "Find the length of the longest substring without repeating characters",
            isInteractive: true
          },
          {
            id: "minimum-window-substring",
            name: "Minimum Window Substring",
            difficulty: "Hard",
            description: "Find the minimum window in a string that contains all characters of another string"
          }
        ]
      }
    ]
  }
};

export default function TopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [activeSubtopic, setActiveSubtopic] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'learn' | 'challenges'>('learn');
  
  const topic = topicsData[topicId as keyof typeof topicsData];
  
  // Use useMemo to prevent unnecessary recalculations
  const subtopic = useMemo(() => {
    if (!topic) return null;
    return findSubtopic(topicId, activeSubtopic);
  }, [topic, topicId, activeSubtopic]);
  
  if (!topic) {
    return <div className="min-h-screen flex items-center justify-center">Topic not found</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200 to-indigo-200 dark:from-pink-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[60%] -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header with modern glassmorphism effect */}
      <header className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  DSA
                </div>
                <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  DSA Play
                </h1>
              </Link>
              <div className="hidden md:block ml-8">
                <NavLinks />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="text-4xl mr-3">{topic.icon}</span> {topic.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{topic.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden sticky top-8 border border-white/20 dark:border-gray-700/30">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="font-medium text-gray-900 dark:text-white">Topics</h3>
              </div>
              <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {topic.topics.map(subtopic => (
                  <li key={subtopic.id}>
                    <button
                      onClick={() => setActiveSubtopic(subtopic.id)}
                      className={`w-full text-left px-6 py-3 flex items-center transition-colors duration-200 ${
                        activeSubtopic === subtopic.id || (!activeSubtopic && subtopic.id === topic.topics[0].id)
                          ? 'bg-indigo-50/70 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50/70 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-3 ${
                        subtopic.completed 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}></span>
                      {subtopic.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden mb-8 border border-white/20 dark:border-gray-700/30">
              <div className="border-b border-gray-200/50 dark:border-gray-700/50">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('learn')}
                    className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'learn'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                    }`}
                  >
                    Learn
                  </button>
                  <button
                    onClick={() => setActiveTab('challenges')}
                    className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'challenges'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                    }`}
                  >
                    Challenges
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'learn' && subtopic && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{subtopic.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{subtopic.description}</p>
                    
                    <div className="mb-8">
                      {subtopic.id === 'two-pointers' && (
                        <AlgorithmVisualizer 
                          type="array-sort"
                          initialData={ARRAY_SORT_DATA}
                        />
                      )}
                      
                      {subtopic.id === 'sliding-window' && (
                        <AlgorithmVisualizer 
                          type="binary-search"
                          initialData={BINARY_SEARCH_DATA}
                        />
                      )}
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setActiveTab('challenges')}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span>Practice Challenges</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'challenges' && subtopic && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Challenges</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Apply your knowledge by solving these challenges related to {subtopic.name}.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {subtopic.challenges?.map(challenge => (
                        <div 
                          key={challenge.id}
                          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="flex justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{challenge.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full self-start ${
                              challenge.difficulty === 'Easy' 
                                ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                                : challenge.difficulty === 'Medium'
                                ? 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                                : 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            }`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">{challenge.description}</p>
                          <div className="flex justify-between items-center">
                            <Link
                              href={`/challenges/${challenge.id}`}
                              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                            >
                              <span>Start Challenge</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </Link>
                            {challenge.isInteractive && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                                Interactive
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add the required styles for the animation */}
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
} 
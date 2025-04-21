"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUserProgress, getActivityHistory, getAchievements, getLevelProgressPercentage } from "../utils/storage";
import NavLinks from "../components/NavLinks";

type DSACategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  progress: number;
  topics: {
    id: string;
    name: string;
    completed: boolean;
  }[];
};

const dsaCategories: DSACategory[] = [
  {
    id: "arrays",
    name: "Arrays & Strings",
    icon: "📊",
    description: "Master manipulation of arrays and strings with playful challenges",
    progress: 65,
    topics: [
      { id: "two-pointers", name: "Two Pointers", completed: true },
      { id: "sliding-window", name: "Sliding Window", completed: true },
      { id: "prefix-sum", name: "Prefix Sum", completed: false },
      { id: "kadanes", name: "Kadane's Algorithm", completed: false },
    ]
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    icon: "🔗",
    description: "Learn to manipulate pointers and nodes through gamified exercises",
    progress: 40,
    topics: [
      { id: "singly-linked", name: "Singly Linked Lists", completed: true },
      { id: "doubly-linked", name: "Doubly Linked Lists", completed: false },
      { id: "cycles", name: "Cycle Detection", completed: false },
      { id: "reversing", name: "Reversing Techniques", completed: false },
    ]
  },
  {
    id: "trees",
    name: "Trees & Graphs",
    icon: "🌳",
    description: "Visualize and solve tree and graph problems in an interactive format",
    progress: 30,
    topics: [
      { id: "binary-trees", name: "Binary Trees", completed: true },
      { id: "bst", name: "Binary Search Trees", completed: false },
      { id: "graph-traversal", name: "Graph Traversal", completed: false },
      { id: "shortest-path", name: "Shortest Path Algorithms", completed: false },
    ]
  },
  {
    id: "dynamic",
    name: "Dynamic Programming",
    icon: "⚡",
    description: "Break down complex problems and build solutions incrementally",
    progress: 20,
    topics: [
      { id: "memoization", name: "Memoization", completed: true },
      { id: "tabulation", name: "Tabulation", completed: false },
      { id: "lcs", name: "Longest Common Subsequence", completed: false },
      { id: "knapsack", name: "Knapsack Problems", completed: false },
    ]
  },
  {
    id: "recursion",
    name: "Recursion & Backtracking",
    icon: "🔄",
    description: "Master the art of recursive thinking through visual challenges",
    progress: 15,
    topics: [
      { id: "recursion-basics", name: "Recursion Basics", completed: true },
      { id: "backtracking", name: "Backtracking", completed: false },
      { id: "combinatorial", name: "Combinatorial Problems", completed: false },
      { id: "maze-solving", name: "Maze Solving", completed: false },
    ]
  },
  {
    id: "sorting",
    name: "Sorting & Searching",
    icon: "🔍",
    description: "Compare and visualize different algorithms through games",
    progress: 50,
    topics: [
      { id: "binary-search", name: "Binary Search", completed: true },
      { id: "quicksort", name: "QuickSort", completed: true },
      { id: "mergesort", name: "MergeSort", completed: false },
      { id: "heap-operations", name: "Heap Operations", completed: false },
    ]
  },
];

const upcomingInterviews = [
  { id: 1, company: "Tech Giant", date: "Next Monday", type: "Algorithms & Data Structures" },
  { id: 2, company: "Startup X", date: "In 2 weeks", type: "System Design & Coding" },
];

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState<'topics' | 'daily' | 'interview'>('topics');
  const [userProgress, setUserProgress] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [levelProgress, setLevelProgress] = useState(0);
  
  // Load user data
  useEffect(() => {
    const progress = getUserProgress();
    setUserProgress(progress);
    
    const activities = getActivityHistory().slice(0, 3); // Get only the 3 most recent
    setRecentActivities(activities);
    
    const userAchievements = getAchievements();
    setAchievements(userAchievements);
    
    setLevelProgress(getLevelProgressPercentage());
  }, []);
  
  // Format date for activity display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
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
            <div className="flex space-x-4 items-center">
              <Link href="/profile" className="flex items-center space-x-2">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                  Level {userProgress?.level || 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  {userProgress?.name ? userProgress.name.split(' ').map((n: string) => n[0]).join('') : 'MS'}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Continue your deliberate practice journey to master DSA concepts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden mb-8 border border-white/20 dark:border-gray-700/30">
              <div className="border-b border-gray-200/50 dark:border-gray-700/50">
                <nav className="flex">
                  <button
                    onClick={() => setSelectedTab('topics')}
                    className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      selectedTab === 'topics'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                    }`}
                  >
                    Topic Journey
                  </button>
                  <button
                    onClick={() => setSelectedTab('daily')}
                    className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      selectedTab === 'daily'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                    }`}
                  >
                    Daily Challenges
                  </button>
                  <button
                    onClick={() => setSelectedTab('interview')}
                    className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      selectedTab === 'interview'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                    }`}
                  >
                    Interview Prep
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {selectedTab === 'topics' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Topic Journey</h3>
                      <Link href="/games" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                        <span>Try Algorithm Games</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {dsaCategories.map(category => {
                        // Update progress from user data if available
                        const userTopicProgress = userProgress?.topicsProgress?.[category.id];
                        const progress = userTopicProgress !== undefined ? userTopicProgress : category.progress;
                        
                        return (
                          <div 
                            key={category.id}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                          >
                            <div className="flex items-center mb-4">
                              <span className="text-3xl mr-3">{category.icon}</span>
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">{category.name}</h3>
                                <div className="w-full bg-gray-200/70 dark:bg-gray-700/70 rounded-full h-2.5 mt-2 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                              {category.description}
                            </p>
                            <Link
                              href={`/topics/${category.id}`}
                              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                            >
                              <span>Continue learning</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {selectedTab === 'daily' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Challenge</h3>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                        Streak: {userProgress?.dailyStreak || 0} days {userProgress?.dailyStreak >= 1 ? '🔥' : ''}
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Find the Longest Substring Without Repeating Characters
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">Medium</span>
                            <span className="bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">Sliding Window</span>
                            <span className="bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">Strings</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Solve this classic problem with a gamified approach that helps you visualize the sliding window technique.
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          +25 XP
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link
                          href="/challenges/longest-substring"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <span>Start Challenge</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Challenges</h3>
                    <div className="space-y-4">
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 transition-all duration-200 hover:shadow-md">
                        <h4 className="font-medium text-gray-900 dark:text-white">Valid Parentheses</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Available tomorrow</p>
                      </div>
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 transition-all duration-200 hover:shadow-md">
                        <h4 className="font-medium text-gray-900 dark:text-white">Maximum Subarray</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Available in 2 days</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTab === 'interview' && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mock Interview Simulator</h3>
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 shadow-sm">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Practice with our AI interviewer that simulates real tech interviews with timed coding challenges and verbal explanations.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                            Start Mock Interview
                          </button>
                          <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200">
                            View Past Interviews
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Interviews</h3>
                    {upcomingInterviews.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingInterviews.map(interview => (
                          <div key={interview.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 transition-all duration-200 hover:shadow-md">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-900 dark:text-white">{interview.company}</h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{interview.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{interview.type}</p>
                            <button className="mt-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center">
                              <span>Prepare now</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No upcoming interviews scheduled.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {recentActivities.length > 0 ? recentActivities.map(activity => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{activity.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.type === 'achievement' 
                            ? 'Achievement unlocked' 
                            : activity.type === 'challenge' 
                            ? `${activity.details?.category || 'Challenge'} ${activity.result}`
                            : activity.details?.category || activity.type}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    No recent activity. Start solving some challenges!
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-700/30">
                <Link 
                  href="/activity"
                  className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center"
                >
                  <span>View all activity</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Stats and Progress */}
            <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Stats</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Level Progress</h4>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{levelProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200/70 dark:bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" style={{ width: `${levelProgress}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 dark:bg-gray-700/40 rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userProgress?.problemsSolved || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Problems Solved</div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-700/40 rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userProgress?.subTopicsCompleted?.length || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Topics Mastered</div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-700/40 rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userProgress?.dailyStreak || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-700/40 rounded-xl p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      {achievements?.filter(a => a.completed)?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Achievements</div>
                  </div>
                </div>
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
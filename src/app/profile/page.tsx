"use client";

import Link from "next/link";
import { useState } from "react";

// Mock user data
const userData = {
  name: "Max Zelai",
  username: "maxdsa",
  level: 7,
  xp: 4250,
  nextLevelXp: 5000,
  joinedDate: "April 2024",
  stats: {
    problemsSolved: 72,
    dailyStreak: 7,
    topicsCompleted: 8,
    achievements: 12,
    badges: 5
  },
  strengths: [
    { category: "Arrays & Strings", score: 85 },
    { category: "Sorting & Searching", score: 78 },
    { category: "Linked Lists", score: 62 },
    { category: "Dynamic Programming", score: 45 },
    { category: "Trees & Graphs", score: 58 }
  ],
  achievements: [
    { 
      id: 1, 
      name: "Consistency Champion", 
      description: "Maintain a 7-day learning streak", 
      date: "May 5, 2024", 
      icon: "🔥"
    },
    { 
      id: 2, 
      name: "Array Master", 
      description: "Solve 15 array-related problems", 
      date: "April 28, 2024", 
      icon: "📊"
    },
    { 
      id: 3, 
      name: "Quick Learner", 
      description: "Complete 5 topics in a week", 
      date: "April 20, 2024", 
      icon: "🚀"
    },
    { 
      id: 4, 
      name: "Algorithmic Thinker", 
      description: "Solve 10 medium difficulty problems", 
      date: "April 15, 2024", 
      icon: "🧠"
    }
  ],
  recentActivity: [
    { type: "problem", name: "Two Sum", difficulty: "Easy", date: "2 hours ago", result: "Solved" },
    { type: "topic", name: "Sliding Window", category: "Arrays", date: "Yesterday", result: "Completed" },
    { type: "problem", name: "Merge Sort", difficulty: "Medium", date: "2 days ago", result: "In Progress" },
    { type: "achievement", name: "Consistency Champion", date: "3 days ago", result: "Unlocked" }
  ],
  studySchedule: [
    { day: "Monday", focus: "Arrays & Strings", duration: 60 },
    { day: "Tuesday", focus: "Rest Day", duration: 0 },
    { day: "Wednesday", focus: "Linked Lists", duration: 45 },
    { day: "Thursday", focus: "Trees & Graphs", duration: 60 },
    { day: "Friday", focus: "Dynamic Programming", duration: 30 },
    { day: "Saturday", focus: "Mixed Practice", duration: 90 },
    { day: "Sunday", focus: "Rest Day", duration: 0 }
  ],
  upcomingInterviews: [
    { id: 1, company: "Tech Giant", date: "May 15, 2024", preparation: 65 },
    { id: 2, company: "Startup X", date: "June 2, 2024", preparation: 40 }
  ]
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'schedule'>('overview');

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
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                DSA
              </div>
              <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                DSA Play
              </h1>
            </Link>
            <div className="flex space-x-4 items-center">
              <Link href="/dashboard" className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden mb-8 border border-white/20 dark:border-gray-700/30">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userData.name.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold border-4 border-white dark:border-gray-800 shadow-md">
                    {userData.level}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userData.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-3">@{userData.username} • Joined {userData.joinedDate}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Level Progress</span>
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                      {userData.xp} / {userData.nextLevelXp} XP
                    </span>
                  </div>
                  <div className="w-full bg-gray-200/70 dark:bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" style={{ width: `${(userData.xp / userData.nextLevelXp) * 100}%` }}></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/60 dark:bg-gray-700/40 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm">
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userData.stats.problemsSolved}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Problems Solved</div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-700/40 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm">
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userData.stats.dailyStreak}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-700/40 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm">
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userData.stats.topicsCompleted}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Topics Completed</div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-700/40 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm">
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{userData.stats.achievements}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200/50 dark:border-gray-700/50">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'achievements'
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'schedule'
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                }`}
              >
                Study Schedule
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Skill strengths */}
              <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skill Strengths</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {userData.strengths.map(strength => (
                      <div key={strength.category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{strength.category}</span>
                          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                            {strength.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200/70 dark:bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${
                              strength.score > 75 
                                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                : strength.score > 50 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                                : 'bg-gradient-to-r from-orange-400 to-orange-500'
                            }`} 
                            style={{ width: `${strength.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Recent activity */}
              <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{activity.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {activity.type === 'problem' && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                activity.difficulty === 'Easy' 
                                  ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                                  : activity.difficulty === 'Medium'
                                  ? 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                                  : 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                              }`}>
                                {activity.difficulty}
                              </span>
                            )}
                            {activity.type === 'topic' && (
                              <span className="bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-0.5 rounded-full">
                                {activity.category}
                              </span>
                            )}
                            {activity.result && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                activity.result === 'Solved' || activity.result === 'Completed' || activity.result === 'Unlocked'
                                  ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                                  : 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                              }`}>
                                {activity.result}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-700/30">
                  <Link 
                    href="/activity"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    <span>View all activity</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Upcoming interviews */}
              <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Interviews</h3>
                </div>
                {userData.upcomingInterviews.length > 0 ? (
                  <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {userData.upcomingInterviews.map(interview => (
                      <div key={interview.id} className="px-6 py-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{interview.company}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{interview.date}</span>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Preparation</span>
                            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                              {interview.preparation}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200/70 dark:bg-gray-700/70 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-2.5 rounded-full ${
                                interview.preparation >= 75 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                                interview.preparation >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                                'bg-gradient-to-r from-orange-400 to-orange-500'
                              }`}
                              style={{ width: `${interview.preparation}%` }}
                            ></div>
                          </div>
                        </div>
                        <Link
                          href={`/interviews/${interview.id}`}
                          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                        >
                          <span>Continue preparation</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    No upcoming interviews scheduled.
                  </div>
                )}
                <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-700/30">
                  <button className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200">
                    <span>Add new interview</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Recent achievements preview */}
              <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
                <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Achievements</h3>
                </div>
                <div className="p-6 space-y-4">
                  {userData.achievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3 text-xl text-white shadow-sm">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{achievement.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{achievement.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-700/30">
                  <button 
                    onClick={() => setActiveTab('achievements')}
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    <span>View all achievements</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Achievements</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData.achievements.map(achievement => (
                  <div key={achievement.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 flex items-start hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4 text-2xl text-white shadow-md">
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-lg">{achievement.name}</h4>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{achievement.description}</p>
                      <span className="text-xs text-gray-400 dark:text-gray-500">Earned on {achievement.date}</span>
                    </div>
                  </div>
                ))}
                
                {/* Locked achievements */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 flex items-start opacity-60 hover:shadow-md transition-all duration-200">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center mr-4 text-gray-400 dark:text-gray-500">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-lg">Algorithm Expert</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Solve 50 algorithm problems</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Progress: 72% complete (36/50)
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 flex items-start opacity-60 hover:shadow-md transition-all duration-200">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center mr-4 text-gray-400 dark:text-gray-500">
                    🔒
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-lg">Dynamic Programming Guru</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Master all DP concepts</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Progress: 45% complete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'schedule' && (
          <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Study Schedule</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your personalized deliberate practice schedule optimized for consistent learning while preventing burnout.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
                {userData.studySchedule.map((day, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-xl p-4 text-center backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                      day.duration === 0 
                        ? 'border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60' 
                        : 'border-indigo-200/50 dark:border-indigo-800/50 bg-indigo-50/70 dark:bg-indigo-900/20'
                    }`}
                  >
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">{day.day}</div>
                    <div className={`text-sm ${day.duration === 0 ? 'text-gray-500 dark:text-gray-400' : 'text-indigo-700 dark:text-indigo-300'}`}>
                      {day.focus}
                    </div>
                    {day.duration > 0 && (
                      <div className="mt-2 text-xs font-medium bg-indigo-100/80 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-200 rounded-full px-2 py-1 inline-block">
                        {day.duration} min
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Deliberate Play Strategy</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  Your schedule is designed based on deliberate play principles. It incorporates:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Focused learning sessions with clear goals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Strategic rest days to consolidate knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Varied topic rotation to maintain engagement</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Balanced duration suitable for optimal concentration</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <button className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200">
                    <span>Customize schedule</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
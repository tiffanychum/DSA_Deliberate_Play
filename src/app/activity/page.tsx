"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActivityHistory, ActivityEntry } from '../utils/storage';
import NavLinks from '../components/NavLinks';

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [filter, setFilter] = useState<'all' | 'challenge' | 'topic' | 'achievement'>('all');
  
  useEffect(() => {
    // Load activity history
    const history = getActivityHistory();
    setActivities(history);
  }, []);
  
  // Filter activities based on selected filter
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);
  
  // Format date for display
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
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden mb-8 border border-white/20 dark:border-gray-700/30">
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Activity History</h1>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'all' 
                    ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 font-medium' 
                    : 'bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 transition-colors'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('challenge')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'challenge' 
                    ? 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-medium' 
                    : 'bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 transition-colors'
                }`}
              >
                Challenges
              </button>
              <button 
                onClick={() => setFilter('topic')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'topic' 
                    ? 'bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 font-medium' 
                    : 'bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 transition-colors'
                }`}
              >
                Topics
              </button>
              <button 
                onClick={() => setFilter('achievement')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'achievement' 
                    ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-medium' 
                    : 'bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 transition-colors'
                }`}
              >
                Achievements
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          activity.type === 'challenge' 
                            ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                            : activity.type === 'topic' 
                            ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-gradient-to-br from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                        }`}>
                          {activity.type === 'challenge' ? '🧩' : activity.type === 'topic' ? '📚' : '🏆'}
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{activity.name}</h3>
                      </div>
                      <div className="ml-11 mt-1 flex items-center space-x-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activity.type === 'challenge' 
                            ? 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' 
                            : activity.type === 'topic' 
                            ? 'bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                            : 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        }`}>
                          {activity.type === 'challenge' ? 'Challenge' : activity.type === 'topic' ? 'Topic' : 'Achievement'}
                        </span>
                        
                        {activity.details?.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300">
                            {activity.details.category}
                          </span>
                        )}
                        
                        {activity.details?.difficulty && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activity.details.difficulty === 'Easy' 
                              ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                              : activity.details.difficulty === 'Medium'
                              ? 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}>
                            {activity.details.difficulty}
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
                        
                        {activity.details?.xpGained && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-800 dark:text-indigo-200">
                            +{activity.details.xpGained} XP
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                {filter === 'all' 
                  ? "No activity recorded yet. Start solving challenges to track your progress!"
                  : `No ${filter} activity recorded yet.`}
              </div>
            )}
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
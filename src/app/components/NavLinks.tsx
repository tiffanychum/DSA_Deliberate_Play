"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-6">
      <Link 
        href="/dashboard" 
        className={`text-sm font-medium ${
          pathname === '/dashboard' 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Dashboard
      </Link>
      
      <Link 
        href="/challenges/two-sum" 
        className={`text-sm font-medium ${
          pathname.includes('/challenges') 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Challenges
      </Link>
      
      <Link 
        href="/games" 
        className={`text-sm font-medium ${
          pathname === '/games' 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Games
      </Link>
      
      <Link 
        href="/activity" 
        className={`text-sm font-medium ${
          pathname === '/activity' 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        Activity
      </Link>
    </div>
  );
} 
import React from 'react';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  completed: boolean;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ 
  id, 
  title, 
  description, 
  icon, 
  difficulty, 
  completed, 
  onClick 
}) => {
  // Determine difficulty badge color
  const difficultyColor = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div 
      className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden 
        transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700/50
        ${completed ? 'ring-2 ring-green-400 dark:ring-green-600' : ''}
        cursor-pointer transform hover:-translate-y-1`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-2xl">
            {icon}
          </div>
          
          {completed && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Completed
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${difficultyColor()}`}>
            {difficulty}
          </span>
          
          <button 
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
            onClick={onClick}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard; 
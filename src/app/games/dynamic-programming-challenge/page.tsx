"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { addXP } from '../../utils/storage';

interface Challenge {
  id: number;
  type: 'coinChange' | 'gridPath' | 'knapsack';
  title: string;
  description: string;
  input: any;
  steps: any[];
  solution: any;
  hint: string;
  explanation: string;
}

const DPAdventureGame = () => {
  // Game state
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
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
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('dpAdventureHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem('dpAdventureHighScore', highScore.toString());
    }
  }, [highScore]);
  
  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Challenge generator functions
  const generateCoinChangeChallenge = (level: number): Challenge => {
    // Coins get more complex with higher levels
    const coins = level <= 2 
      ? [1, 5, 10, 25] 
      : level <= 4 
        ? [1, 3, 4, 5] 
        : [1, 3, 4, 5, 9, 10];
    
    // Amount increases with level
    const amount = Math.floor(Math.random() * (10 * level)) + 10;
    
    // Generate DP table for the solution
    const dp = Array(amount + 1).fill(Number.MAX_SAFE_INTEGER);
    dp[0] = 0;
    
    const coinUsed = Array(amount + 1).fill(-1);
    
    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i && dp[i - coin] !== Number.MAX_SAFE_INTEGER && dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1;
          coinUsed[i] = coin;
        }
      }
    }
    
    // Generate solution steps
    const steps = [];
    let remainingAmount = amount;
    const coinsUsed = [];
    
    while (remainingAmount > 0 && coinUsed[remainingAmount] !== -1) {
      const coin = coinUsed[remainingAmount];
      coinsUsed.push(coin);
      remainingAmount -= coin;
      steps.push({
        amount: remainingAmount,
        coin,
        dpState: [...dp]
      });
    }
    
    return {
      id: Date.now(),
      type: 'coinChange',
      title: 'Coin Change Challenge',
      description: `Find the minimum number of coins needed to make change for ${amount} cents, using coins of denominations: ${coins.join(', ')} cents.`,
      input: {
        coins,
        amount
      },
      steps,
      solution: {
        minCoins: dp[amount],
        coinsUsed
      },
      hint: "For each amount from 1 to target, consider using each coin and choose the option that minimizes the total number of coins.",
      explanation: `
        We use dynamic programming to solve this problem:
        1. Create a dp array where dp[i] = minimum coins needed to make i cents
        2. Initialize dp[0] = 0 and all other values to Infinity
        3. For each amount i and each coin, update dp[i] = min(dp[i], dp[i-coin] + 1)
        4. The answer is stored in dp[${amount}]
        
        The minimum number of coins needed is ${dp[amount]}.
        Coins used: ${coinsUsed.join(', ')}
      `
    };
  };
  
  const generateGridPathChallenge = (level: number): Challenge => {
    // Grid size increases with level
    const rows = Math.min(3 + Math.floor(level / 2), 8);
    const cols = Math.min(3 + Math.floor(level / 2), 8);
    
    // Generate grid with obstacles
    const grid: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));
    
    // Add obstacles (more with higher levels)
    const numObstacles = Math.floor(rows * cols * 0.2 * (1 + level * 0.1));
    
    for (let i = 0; i < numObstacles; i++) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      
      // Don't block start (0,0) or finish (rows-1, cols-1)
      if ((r === 0 && c === 0) || (r === rows - 1 && c === cols - 1)) {
        continue;
      }
      
      grid[r][c] = 1; // 1 = obstacle
    }
    
    // Calculate DP solution
    const dp: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));
    
    // Base case - if the starting point is an obstacle, there's no path
    if (grid[0][0] === 1) {
      dp[0][0] = 0;
    } else {
      dp[0][0] = 1;
    }
    
    // Fill first row
    for (let j = 1; j < cols; j++) {
      if (grid[0][j] === 1) {
        dp[0][j] = 0;
      } else {
        dp[0][j] = dp[0][j-1];
      }
    }
    
    // Fill first column
    for (let i = 1; i < rows; i++) {
      if (grid[i][0] === 1) {
        dp[i][0] = 0;
      } else {
        dp[i][0] = dp[i-1][0];
      }
    }
    
    // Fill the rest of the dp table
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        if (grid[i][j] === 1) {
          dp[i][j] = 0;
        } else {
          dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
      }
    }
    
    return {
      id: Date.now(),
      type: 'gridPath',
      title: 'Grid Path Challenge',
      description: `Find the number of unique paths from the top-left corner to the bottom-right corner of a ${rows}×${cols} grid. You can only move down or right at any point, and you cannot go through obstacles (marked in red).`,
      input: {
        grid,
        rows,
        cols
      },
      steps: [{ grid, dp }],
      solution: {
        uniquePaths: dp[rows-1][cols-1]
      },
      hint: "For each cell, the number of ways to reach it equals the sum of ways to reach the cell above it and the cell to its left.",
      explanation: `
        We use dynamic programming to solve this problem:
        1. Create a dp table where dp[i][j] = number of ways to reach cell (i,j)
        2. Initialize dp[0][0] = 1 (one way to reach the start)
        3. If a cell contains an obstacle, dp[i][j] = 0
        4. Otherwise, dp[i][j] = dp[i-1][j] + dp[i][j-1]
        5. The answer is dp[${rows-1}][${cols-1}]
        
        The number of unique paths is ${dp[rows-1][cols-1]}.
      `
    };
  };
  
  const generateKnapsackChallenge = (level: number): Challenge => {
    // Number of items increases with level
    const numItems = Math.min(3 + level, 10);
    
    // Generate items: weights and values
    const items = [];
    for (let i = 0; i < numItems; i++) {
      items.push({
        id: i,
        weight: Math.floor(Math.random() * 10) + 1,
        value: Math.floor(Math.random() * 20) + 5
      });
    }
    
    // Weight capacity increases with level but is constrained by number of items
    const capacity = Math.floor((numItems * 5) * (0.7 + Math.random() * 0.5));
    
    // Solve using DP
    const dp: number[][] = Array(numItems + 1).fill(0).map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= numItems; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (items[i-1].weight <= w) {
          dp[i][w] = Math.max(
            items[i-1].value + dp[i-1][w - items[i-1].weight],
            dp[i-1][w]
          );
        } else {
          dp[i][w] = dp[i-1][w];
        }
      }
    }
    
    // Backtrack to find which items were selected
    const selectedItems = [];
    let remainingCapacity = capacity;
    
    for (let i = numItems; i > 0; i--) {
      if (dp[i][remainingCapacity] !== dp[i-1][remainingCapacity]) {
        selectedItems.push(items[i-1].id);
        remainingCapacity -= items[i-1].weight;
      }
    }
    
    return {
      id: Date.now(),
      type: 'knapsack',
      title: '0/1 Knapsack Problem',
      description: `Find the maximum value that can be put in a knapsack of capacity ${capacity} using items with the given weights and values. You can either take an item or leave it (0/1 knapsack).`,
      input: {
        items,
        capacity
      },
      steps: [{ dp, items, capacity }],
      solution: {
        maxValue: dp[numItems][capacity],
        selectedItems
      },
      hint: "For each item and weight, decide whether to include the item (if it fits) or not, choosing the option that maximizes value.",
      explanation: `
        We use dynamic programming to solve this problem:
        1. Create a dp table where dp[i][w] = max value with first i items and weight limit w
        2. Initialize first row and column to 0
        3. For each item i and each weight w:
           - If item i fits (weight <= w), dp[i][w] = max(value_i + dp[i-1][w-weight_i], dp[i-1][w])
           - Otherwise, dp[i][w] = dp[i-1][w]
        4. The answer is dp[${numItems}][${capacity}]
        
        The maximum value possible is ${dp[numItems][capacity]}.
        Selected items: ${selectedItems.map(id => `Item ${id+1}`).join(', ')}
      `
    };
  };

  // Generate a random challenge based on level
  const generateChallenge = () => {
    const challengeTypes = [
      generateCoinChangeChallenge,
      generateGridPathChallenge,
      generateKnapsackChallenge
    ];
    
    // Choose challenge type (with weighting for different levels)
    let typeIndex;
    
    if (level <= 2) {
      // Lower levels: more coin change problems (easier to understand)
      typeIndex = Math.random() < 0.6 ? 0 : Math.random() < 0.5 ? 1 : 2;
    } else if (level <= 5) {
      // Mix of all three
      typeIndex = Math.floor(Math.random() * 3);
    } else {
      // Higher levels: more knapsack and grid problems (more complex)
      typeIndex = Math.random() < 0.3 ? 0 : Math.random() < 0.5 ? 1 : 2;
    }
    
    const challenge = challengeTypes[typeIndex](level);
    
    setCurrentChallenge(challenge);
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);
    setShowExplanation(false);
    setCurrentStep(0);
  };

  // Start a new game
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(120);
    setGameOver(false);
    setGameStarted(true);
    setStreak(0);
    generateChallenge();
  };

  // End the current game
  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
    addXP(Math.min(score, 100)); // Award XP based on score, with a cap
  };

  // Check the user's answer
  const checkAnswer = () => {
    if (!currentChallenge || !userAnswer.trim()) return;
    
    let expectedAnswer: string;
    
    switch(currentChallenge.type) {
      case 'coinChange':
        expectedAnswer = currentChallenge.solution.minCoins.toString();
        break;
      case 'gridPath':
        expectedAnswer = currentChallenge.solution.uniquePaths.toString();
        break;
      case 'knapsack':
        expectedAnswer = currentChallenge.solution.maxValue.toString();
        break;
      default:
        expectedAnswer = '';
    }
    
    const isAnswerCorrect = userAnswer.trim() === expectedAnswer;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Award points
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Calculate bonus points
      const streakBonus = Math.floor(newStreak / 3) * 5;
      const levelBonus = level * 3;
      const timeBonus = Math.floor(timeLeft / 10);
      
      const pointsEarned = 15 + streakBonus + levelBonus + timeBonus;
      setScore(score + pointsEarned);
      
      // Level up every 20 points
      if (score > 0 && Math.floor(score / 20) < Math.floor((score + pointsEarned) / 20)) {
        setLevel(prev => prev + 1);
        // Add time when leveling up
        setTimeLeft(prev => Math.min(prev + 30, 120));
      } else {
        // Add time for correct answers
        setTimeLeft(prev => Math.min(prev + 10, 120));
      }
      
      // Generate a new challenge after a short delay
      setTimeout(() => {
        generateChallenge();
      }, 2000);
    } else {
      // Penalty for wrong answer
      setStreak(0);
      setTimeLeft(prev => Math.max(prev - 5, 1));
    }
  };

  // Step through DP visualization
  const nextStep = () => {
    if (!currentChallenge) return;
    
    if (currentStep < currentChallenge.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Restart game with confirmation
  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart? Your current progress will be lost.')) {
      startGame();
    }
  };

  // Render different visualizations based on challenge type
  const renderVisualization = () => {
    if (!currentChallenge) return null;
    
    switch(currentChallenge.type) {
      case 'coinChange':
        return renderCoinChangeVisualization();
      case 'gridPath':
        return renderGridPathVisualization();
      case 'knapsack':
        return renderKnapsackVisualization();
      default:
        return null;
    }
  };

  const renderCoinChangeVisualization = () => {
    if (!currentChallenge || currentChallenge.type !== 'coinChange') return null;
    
    const { coins, amount } = currentChallenge.input;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Coin Change Problem</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {coins.map((coin, index) => (
            <div key={index} className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center text-yellow-800 dark:text-yellow-200 font-medium border-2 border-yellow-300 dark:border-yellow-600">
              {coin}
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-4">
          <p className="text-indigo-800 dark:text-indigo-200">
            Target Amount: <span className="font-bold">{amount}</span> cents
          </p>
        </div>
        
        {showSolution && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Solution: {currentChallenge.solution.minCoins} coins
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentChallenge.solution.coinsUsed.map((coin, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-800 dark:text-green-200 text-sm border border-green-300 dark:border-green-600">
                  {coin}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGridPathVisualization = () => {
    if (!currentChallenge || currentChallenge.type !== 'gridPath') return null;
    
    const { grid, rows, cols } = currentChallenge.input;
    const dp = showSolution ? currentChallenge.steps[0].dp : null;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Grid Path Problem</h3>
        
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <div 
                key={`${i}-${j}`} 
                className={`
                  w-10 h-10 flex items-center justify-center text-sm font-medium
                  ${(i === 0 && j === 0) ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' : ''}
                  ${(i === rows-1 && j === cols-1) ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200' : ''}
                  ${cell === 1 ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                  border border-gray-300 dark:border-gray-600
                `}
              >
                {dp ? dp[i][j] : ''}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 flex gap-3 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 dark:bg-green-800 mr-1 border border-gray-300 dark:border-gray-600"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800 mr-1 border border-gray-300 dark:border-gray-600"></div>
            <span>Finish</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 dark:bg-red-800 mr-1 border border-gray-300 dark:border-gray-600"></div>
            <span>Obstacle</span>
          </div>
        </div>
        
        {showSolution && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Unique Paths: {currentChallenge.solution.uniquePaths}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderKnapsackVisualization = () => {
    if (!currentChallenge || currentChallenge.type !== 'knapsack') return null;
    
    const { items, capacity } = currentChallenge.input;
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Knapsack Problem</h3>
        
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-4">
          <p className="text-indigo-800 dark:text-indigo-200">
            Knapsack Capacity: <span className="font-bold">{capacity}</span> units
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weight</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                {showSolution && (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selected</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((item, index) => (
                <tr key={index} className={showSolution && currentChallenge.solution.selectedItems.includes(item.id) ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">Item {item.id + 1}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{item.weight}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{item.value}</td>
                  {showSolution && (
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {currentChallenge.solution.selectedItems.includes(item.id) ? (
                        <span className="text-green-600 dark:text-green-400">✓</span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">✗</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {showSolution && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              Maximum Value: {currentChallenge.solution.maxValue}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[60%] -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
    
      <div className="container mx-auto px-4 py-8 relative">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              DP Adventure
            </h1>
            <Link 
              href="/games" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Games
            </Link>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Master dynamic programming through interactive puzzles! Solve classic DP problems like coin change, grid paths, and the knapsack problem.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  DP Adventure
                </h2>
                {gameStarted && !gameOver && (
                  <div className="flex items-center space-x-4">
                    <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      {timeLeft}s
                    </div>
                    <button
                      onClick={handleRestart}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
                    >
                      Restart
                    </button>
                  </div>
                )}
              </div>
              
              {!gameStarted ? (
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Solve classic dynamic programming problems and earn points!
                    Each correct answer earns points, but be quick - time is limited!
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Start Game
                  </button>
                </div>
              ) : gameOver ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Game Over!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Your Score: <span className="font-bold">{score}</span></p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">High Score: <span className="font-bold">{highScore}</span></p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-indigo-500 dark:text-indigo-400">Score</div>
                      <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{score}</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-purple-500 dark:text-purple-400">Level</div>
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{level}</div>
                    </div>
                  </div>
                  
                  {streak >= 3 && (
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-2 rounded-lg text-center mb-4">
                      <div className="text-amber-600 dark:text-amber-400 font-medium">
                        🔥 {streak} Streak! +{Math.floor(streak / 3) * 5} bonus points
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <div className="text-gray-700 dark:text-gray-300 mb-1 font-medium">DP Problem Types:</div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Coin Change Problem</li>
                      <li>Grid Path Navigation</li>
                      <li>0/1 Knapsack Problem</li>
                      <li>More challenges at higher levels</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Dynamic Programming Concepts</h3>
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Optimal Substructure</div>
                  <div className="text-gray-600 dark:text-gray-400">The optimal solution contains optimal solutions to subproblems</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Overlapping Subproblems</div>
                  <div className="text-gray-600 dark:text-gray-400">The same subproblems are solved multiple times</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Memoization</div>
                  <div className="text-gray-600 dark:text-gray-400">Storing results of expensive function calls to avoid recomputation</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Bottom-up Approach</div>
                  <div className="text-gray-600 dark:text-gray-400">Building solutions to larger problems from smaller ones</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">State Transitions</div>
                  <div className="text-gray-600 dark:text-gray-400">The recurrence relation between states in DP</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Challenge Panel */}
          <div className="lg:col-span-2">
            {gameStarted && !gameOver && currentChallenge && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {currentChallenge.title}
                  </h2>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                    Challenge #{Math.floor(score / 15) + 1}
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mb-6">
                    <p className="text-gray-800 dark:text-gray-200">
                      {currentChallenge.description}
                    </p>
                  </div>
                  
                  {renderVisualization()}
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Answer:
                    </label>
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        placeholder="Enter your answer"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            checkAnswer();
                          }
                        }}
                      />
                      <button
                        onClick={checkAnswer}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  
                  {isCorrect !== null && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                      {isCorrect ? (
                        <div className="font-medium">
                          Correct! +{15 + Math.floor(streak / 3) * 5 + level * 3 + Math.floor(timeLeft / 10)} points
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium mb-1">Incorrect! -5 seconds</div>
                          <div className="text-sm">
                            Try again or use the hint
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {showSolution ? 'Hide Solution' : 'Show Solution'}
                    </button>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  
                  {showHint && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                      <span className="font-medium">Hint:</span> {currentChallenge.hint}
                    </div>
                  )}
                  
                  {showExplanation && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                      <div className="font-medium mb-1">Explanation:</div>
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {currentChallenge.explanation}
                      </pre>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Why Dynamic Programming?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentChallenge.type === 'coinChange' && "The coin change problem perfectly illustrates DP by breaking down a complex problem into optimal sub-problems, avoiding redundant calculations."}
                    {currentChallenge.type === 'gridPath' && "Grid path problems demonstrate how DP stores and reuses previously computed results to solve larger instances efficiently."}
                    {currentChallenge.type === 'knapsack' && "The knapsack problem is a classic DP challenge where we must make optimal choices at each step to maximize the overall value."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
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
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default DPAdventureGame; 
"use client";

import React, { useState, useEffect } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';

const BitOperationsGame = () => {
  const [currentOperation, setCurrentOperation] = useState('AND');
  const [operand1, setOperand1] = useState(5);
  const [operand2, setOperand2] = useState(3);
  const [result, setResult] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<null | {
    operand1: number;
    operand2: number;
    operation: string;
    expectedResult: number;
    hint?: string;
  }>(null);
  const [showHint, setShowHint] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  
  const operations = ['AND', 'OR', 'XOR', 'NOT', 'Left Shift', 'Right Shift'];
  
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
    const savedHighScore = localStorage.getItem('bitwiseHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem('bitwiseHighScore', highScore.toString());
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

  // Convert a number to binary string with padding
  const toBinary = (num: number, bits = 8) => {
    // Handle negative numbers for display purposes
    if (num < 0) {
      return (num >>> 0).toString(2).padStart(32, '0').slice(-bits);
    }
    return num.toString(2).padStart(bits, '0');
  };

  // Generate a puzzle based on current level
  const generatePuzzle = () => {
    // Operations get more complex as levels increase
    // Operations.slice(0, X) takes the first X operations from the full list
    // Math.min(2 + Math.floor(level / 2), operations.length) ensures we don't exceed the total number of operations
    let availableOps = operations.slice(0, Math.min(2 + Math.floor(level / 2), operations.length));
    const operation = availableOps[Math.floor(Math.random() * availableOps.length)];
    
    // Operands get larger as levels increase
    const maxValue = Math.min(2 ** (3 + level), 255);
    //Generates first random operand between 0 and maxValue
    const operand1 = Math.floor(Math.random() * maxValue);
    const operand2 = operation === 'NOT' 
      ? 0 // NOT doesn't need a second operand
      : Math.floor(Math.random() * (operation.includes('Shift') ? 8 : maxValue));
    
    let expectedResult = 0;
    switch(operation) {
      case 'AND':
        expectedResult = operand1 & operand2;
        break;
      case 'OR':
        expectedResult = operand1 | operand2;
        break;
      case 'XOR':
        expectedResult = operand1 ^ operand2;
        break;
      case 'NOT':
        expectedResult = ~operand1;
        break;
      case 'Left Shift':
        expectedResult = operand1 << operand2;
        break;
      case 'Right Shift':
        expectedResult = operand1 >> operand2;
        break;
    }
    
    // Generate hint
    let hint = '';
    if (operation === 'AND') {
      hint = "1 & 1 = 1, everything else is 0";
    } else if (operation === 'OR') {
      hint = "0 | 0 = 0, everything else is 1";
    } else if (operation === 'XOR') {
      hint = "1 ^ 1 = 0, 0 ^ 0 = 0, different bits = 1";
    } else if (operation === 'NOT') {
      hint = "Flips all bits: 0 becomes 1, 1 becomes 0";
    } else if (operation === 'Left Shift') {
      hint = "Shifts bits left, multiplying by 2^n";
    } else if (operation === 'Right Shift') {
      hint = "Shifts bits right, dividing by 2^n";
    }
    
    setCurrentPuzzle({
      operand1,
      operand2,
      operation,
      expectedResult,
      hint
    });
    
    setOperand1(operand1);
    setOperand2(operand2);
    setCurrentOperation(operation);
    setResult(expectedResult);
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
  };

  // Start a new game
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(true);
    setStreak(0);
    generatePuzzle();
  };

  // End the current game
  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Check the user's answer
  const checkAnswer = () => {
    if (!currentPuzzle || !userAnswer) return;
    
    const userResult = parseInt(userAnswer.trim());
    const isAnswerCorrect = userResult === currentPuzzle.expectedResult;
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Award more points for higher levels and using binary
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Calculate bonus points based on streak and level
      const streakBonus = Math.floor(newStreak / 3) * 5;
      const levelBonus = level * 2;
      const timeBonus = Math.floor(timeLeft / 5);
      
      const pointsEarned = 10 + streakBonus + levelBonus + timeBonus;
      setScore(score + pointsEarned);
      
      // Level up every 15 points (faster progression)
      if (score > 0 && score % 15 < (score + pointsEarned) % 15) {
        setLevel(prev => prev + 1);
        // Add time when leveling up
        setTimeLeft(prev => Math.min(prev + 30, 60));
      } else {
        // Add a small amount of time for correct answers
        setTimeLeft(prev => Math.min(prev + 15, 60));
      }
      
      // Generate a new puzzle
      setTimeout(() => {
        generatePuzzle();
      }, 1000);
    } else {
      // Penalty for wrong answer
      setStreak(0);
      setTimeLeft(prev => Math.max(prev - 3, 1));
    }
  };

  // Get operation symbol for display
  const getOperationSymbol = (op = currentOperation) => {
    switch(op) {
      case 'AND': return '&';
      case 'OR': return '|';
      case 'XOR': return '^';
      case 'NOT': return '~';
      case 'Left Shift': return '<<';
      case 'Right Shift': return '>>';
      default: return '';
    }
  };

  // Render visual binary representation
  const renderBinaryVisualization = () => {
    const op1Binary = toBinary(operand1);
    const op2Binary = toBinary(operand2);
    const resultBinary = toBinary(result);
    
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
        <div className="grid grid-cols-8 gap-1 mb-4">
          {op1Binary.split('').map((bit, i) => (
            <div 
              key={`op1-${i}`} 
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                ${bit === '1' 
                  ? 'bg-blue-500 text-white animate-pulse' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              {bit}
            </div>
          ))}
        </div>
        
        <div className="flex items-center mb-2">
          <div className="w-8 text-center font-bold text-indigo-600 dark:text-indigo-400">{getOperationSymbol()}</div>
        </div>
        
        {currentOperation !== 'NOT' && (
          <div className="grid grid-cols-8 gap-1 mb-4">
            {op2Binary.split('').map((bit, i) => (
              <div 
                key={`op2-${i}`} 
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                  ${bit === '1' 
                    ? 'bg-green-500 text-white animate-pulse' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                {bit}
              </div>
            ))}
          </div>
        )}
        
        {showExplanation && (
          <div className="border-t border-gray-300 dark:border-gray-600 my-2 pt-2">
            <div className="grid grid-cols-8 gap-1">
              {resultBinary.split('').map((bit, i) => (
                <div 
                  key={`result-${i}`} 
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                    ${bit === '1' 
                      ? 'bg-purple-500 text-white animate-pulse' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                >
                  {bit}
                </div>
              ))}
            </div>
            
            <div className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              {operand1} {getOperationSymbol()} {currentOperation !== 'NOT' ? operand2 : ''} = {result} ({resultBinary})
            </div>
          </div>
        )}
      </div>
    );
  };

  // Restart game with confirmation
  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart? Your current progress will be lost.')) {
      startGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200 to-indigo-200 dark:from-pink-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[60%] -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
    
      <div className="container mx-auto px-4 py-8 relative">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              Bitwise Operations Game
            </h1>
            <Link 
              href="/games" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Games
            </Link>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Master bitwise operations by solving puzzles! Calculate the result of each operation to earn points.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Bit Master
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
                    Calculate the results of bitwise operations and test your knowledge!
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
                    <div className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Tips:</div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Higher levels = more points</li>
                      <li>Correct answers add time</li>
                      <li>Streaks give bonus points</li>
                      <li>Wrong answers cost time</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Bitwise Cheat Sheet</h3>
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">AND (&amp;)</div>
                  <div className="text-gray-600 dark:text-gray-400">1 &amp; 1 = 1, everything else = 0</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">OR (|)</div>
                  <div className="text-gray-600 dark:text-gray-400">0 | 0 = 0, everything else = 1</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">XOR (^)</div>
                  <div className="text-gray-600 dark:text-gray-400">Same bits = 0, different bits = 1</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">NOT (~)</div>
                  <div className="text-gray-600 dark:text-gray-400">Flips all bits: 0→1, 1→0</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Left Shift (&lt;&lt;)</div>
                  <div className="text-gray-600 dark:text-gray-400">Shifts bits left (× 2ⁿ)</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Right Shift (&gt;&gt;)</div>
                  <div className="text-gray-600 dark:text-gray-400">Shifts bits right (÷ 2ⁿ)</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Puzzle Panel */}
          <div className="lg:col-span-2">
            {gameStarted && !gameOver && currentPuzzle && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Solve the Puzzle
                  </h2>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                    Challenge #{Math.floor(score / 10) + 1}
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="text-center mb-4">
                    <div className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full text-lg font-medium text-indigo-800 dark:text-indigo-300">
                      {currentPuzzle.operand1} {getOperationSymbol(currentPuzzle.operation)} {currentPuzzle.operation !== 'NOT' ? currentPuzzle.operand2 : ''}
                    </div>
                  </div>
                  
                  {renderBinaryVisualization()}
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What's the result?
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
                          Correct! +{10 + Math.floor(streak / 3) * 5 + level * 2 + Math.floor(timeLeft / 5)} points
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium mb-1">Incorrect! -5 seconds</div>
                          <div className="text-sm">
                            The correct answer is {currentPuzzle.expectedResult}
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
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {showExplanation ? 'Hide Result' : 'Show Result'}
                    </button>
                  </div>
                  
                  {showHint && currentPuzzle.hint && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                      <span className="font-medium">Hint:</span> {currentPuzzle.hint}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Understanding {currentPuzzle.operation}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPuzzle.operation === 'AND' && "The AND operator compares each bit and returns 1 only if both bits are 1."}
                    {currentPuzzle.operation === 'OR' && "The OR operator compares each bit and returns 1 if at least one bit is 1."}
                    {currentPuzzle.operation === 'XOR' && "The XOR (exclusive OR) operator returns 1 only when exactly one bit is 1."}
                    {currentPuzzle.operation === 'NOT' && "The NOT operator flips each bit, changing 0 to 1 and 1 to 0."}
                    {currentPuzzle.operation === 'Left Shift' && `The Left Shift operator shifts bits to the left by ${currentPuzzle.operand2} positions, effectively multiplying by 2^${currentPuzzle.operand2}.`}
                    {currentPuzzle.operation === 'Right Shift' && `The Right Shift operator shifts bits to the right by ${currentPuzzle.operand2} positions, effectively dividing by 2^${currentPuzzle.operand2}.`}
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

export default BitOperationsGame; 
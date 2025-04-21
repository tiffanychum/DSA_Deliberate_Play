"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Define challenge type interfaces
interface XorSwapChallenge {
  type: 'xorSwap';
  title: string;
  description: string;
  initialValues: { a: number; b: number };
  steps: { instruction: string; expectedValue: number; variable: string }[];
  hint: string;
  explanation: string;
}

interface PowerOf2Challenge {
  type: 'powerOf2Check';
  title: string;
  description: string;
  number: number;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

interface BitCheckChallenge {
  type: 'isBitSet';
  title: string;
  description: string;
  number: number;
  position: number;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

interface CountBitsChallenge {
  type: 'countBits';
  title: string;
  description: string;
  number: number;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

interface ToggleBitChallenge {
  type: 'toggleBit';
  title: string;
  description: string;
  number: number;
  position: number;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

interface IsolateLSBChallenge {
  type: 'isolateLSB';
  title: string;
  description: string;
  number: number;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

interface ClearLSBChallenge {
  type: 'clearLSB';
  title: string;
  description: string;
  number: number;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

type Challenge = XorSwapChallenge | PowerOf2Challenge | BitCheckChallenge | 
  CountBitsChallenge | ToggleBitChallenge | IsolateLSBChallenge | ClearLSBChallenge;

// Type guard functions
function isXorSwapChallenge(challenge: Challenge): challenge is XorSwapChallenge {
  return challenge.type === 'xorSwap';
}

function hasBitPosition(challenge: Challenge): challenge is BitCheckChallenge | ToggleBitChallenge {
  return challenge.type === 'isBitSet' || challenge.type === 'toggleBit';
}

function isPowerOf2Challenge(challenge: Challenge): challenge is PowerOf2Challenge {
  return challenge.type === 'powerOf2Check';
}

const BitWizardryGame = () => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  
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
    const savedHighScore = localStorage.getItem('bitWizardryHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem('bitWizardryHighScore', highScore.toString());
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

  // Challenge types
  const challengeTypes = [
    'xorSwap',
    'powerOf2Check',
    'isBitSet',
    'countBits',
    'toggleBit',
    'isolateLSB',
    'clearLSB'
  ] as const;

  // Convert a number to binary string with padding
  const toBinary = (num: number, bits = 8) => {
    // Handle negative numbers for display purposes
    if (num < 0) {
      return (num >>> 0).toString(2).padStart(32, '0').slice(-bits);
    }
    return num.toString(2).padStart(bits, '0');
  };

  // XOR Swap Challenge
  const generateXorSwapChallenge = (): XorSwapChallenge => {
    // Generate two random numbers
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    
    // For step-by-step challenges
    const step1 = a ^ b;  // a ^= b
    const step2 = b ^ step1; // b ^= a (which is now a^b)
    const step3 = step1 ^ step2; // a ^= b (which is now the original value of a)
    
    return {
      type: 'xorSwap',
      title: 'XOR Swap Challenge',
      description: 'Track the XOR swap algorithm step by step. What value will variable A have at the end?',
      initialValues: {
        a,
        b
      },
      steps: [
        {
          instruction: `Step 1: a ^= b (a = ${a} ^ ${b})`,
          expectedValue: step1,
          variable: 'a'
        },
        {
          instruction: `Step 2: b ^= a (b = ${b} ^ ${step1})`,
          expectedValue: step2,
          variable: 'b'
        },
        {
          instruction: `Step 3: a ^= b (a = ${step1} ^ ${step2})`,
          expectedValue: step3,
          variable: 'a'
        }
      ],
      hint: "XOR (^) toggles bits that are different. a^b^b cancels out b, leaving a.",
      explanation: `XOR swap works because:
1. a ^= b stores a^b in a
2. b ^= a (which is a^b) equals b^a^b = b^b^a = 0^a = a
3. a ^= b (which is now a) equals a^b^a = a^a^b = 0^b = b`
    };
  };

  // Power of 2 Check Challenge
  const generatePowerOf2Challenge = (): PowerOf2Challenge => {
    const isPowerOf2 = Math.random() > 0.5;
    
    let num;
    if (isPowerOf2) {
      // Generate a power of 2 (2^0 to 2^8)
      const exponent = Math.floor(Math.random() * 9);
      num = Math.pow(2, exponent);
    } else {
      // Generate a non-power of 2
      let randomNum;
      do {
        randomNum = Math.floor(Math.random() * 255) + 1;
        // Make sure it's not accidentally a power of 2
      } while ((randomNum & (randomNum - 1)) === 0);
      num = randomNum;
    }
    
    return {
      type: 'powerOf2Check',
      title: 'Power of 2 Check',
      description: `Is ${num} a power of 2? Use the bit pattern to decide.`,
      number: num,
      expectedAnswer: isPowerOf2 ? 'Yes' : 'No',
      hint: "A power of 2 has exactly one bit set. The expression (n & (n-1)) == 0 checks this.",
      explanation: `${num} in binary is ${toBinary(num)}\n${num}-1 in binary is ${toBinary(num-1)}\n${num} & (${num}-1) = ${num & (num-1)}\n${isPowerOf2 ? 'This is 0, so it IS a power of 2' : 'This is NOT 0, so it\'s not a power of 2'}`
    };
  };
  
  // Bit Check Challenge
  const generateBitCheckChallenge = (): BitCheckChallenge => {
    const num = Math.floor(Math.random() * 255) + 1;
    const position = Math.floor(Math.random() * 8);
    const isBitSet = ((num & (1 << position)) !== 0);
    
    return {
      type: 'isBitSet',
      title: 'Check If Bit Is Set',
      description: `Is bit ${position} set in the number ${num}?`,
      number: num,
      position,
      expectedAnswer: isBitSet ? 'Yes' : 'No',
      hint: `To check if a bit is set, use: (num & (1 << position)) != 0`,
      explanation: `${num} in binary is ${toBinary(num)}\n1 << ${position} = ${1 << position} (${toBinary(1 << position)})\n${num} & (1 << ${position}) = ${num & (1 << position)}\nThis is ${isBitSet ? 'not 0, so bit IS set' : '0, so bit is NOT set'}`
    };
  };

  // Count Bits Challenge
  const generateCountBitsChallenge = (): CountBitsChallenge => {
    const num = Math.floor(Math.random() * 255) + 1;
    
    // Count set bits
    let count = 0;
    let n = num;
    while (n) {
      count += n & 1;
      n >>= 1;
    }
    
    return {
      type: 'countBits',
      title: 'Count the Bits',
      description: `How many bits are set (equal to 1) in the number ${num}?`,
      number: num,
      expectedAnswer: count.toString(),
      hint: "Count each 1 bit in the binary representation.",
      explanation: `${num} in binary is ${toBinary(num)}\nThere are ${count} bits set to 1`
    };
  };

  // Toggle Bit Challenge
  const generateToggleBitChallenge = (): ToggleBitChallenge => {
    const num = Math.floor(Math.random() * 255) + 1;
    const position = Math.floor(Math.random() * 8);
    const result = num ^ (1 << position);
    
    return {
      type: 'toggleBit',
      title: 'Toggle a Bit',
      description: `What is the result of toggling bit ${position} in the number ${num}?`,
      number: num,
      position,
      expectedAnswer: result.toString(),
      hint: `To toggle a bit, use: num ^ (1 << position)`,
      explanation: `${num} in binary is ${toBinary(num)}\n1 << ${position} = ${1 << position} (${toBinary(1 << position)})\n${num} ^ (1 << ${position}) = ${result} (${toBinary(result)})`
    };
  };

  // Isolate Least Significant Bit Challenge
  const generateIsolateLSBChallenge = (): IsolateLSBChallenge => {
    // Generate a number with at least one bit set
    let num;
    do {
      num = Math.floor(Math.random() * 255) + 1;
    } while (num === 0);
    
    const result = num & -num;
    
    return {
      type: 'isolateLSB',
      title: 'Isolate Rightmost Bit',
      description: `What is the value of isolating the rightmost 1 bit in ${num}? Use the formula n & -n.`,
      number: num,
      expectedAnswer: result.toString(),
      hint: "The expression n & -n isolates the rightmost 1 bit.",
      explanation: `${num} in binary is ${toBinary(num)}\n-${num} in two's complement is ${toBinary(-num)}\n${num} & -${num} = ${result} (${toBinary(result)})`
    };
  };

  // Clear Least Significant Bit Challenge
  const generateClearLSBChallenge = (): ClearLSBChallenge => {
    // Generate a number with at least one bit set
    let num;
    do {
      num = Math.floor(Math.random() * 255) + 1;
    } while (num === 0);
    
    const result = num & (num - 1);
    
    return {
      type: 'clearLSB',
      title: 'Clear Rightmost Bit',
      description: `What is the result of clearing the rightmost 1 bit in ${num}? Use the formula n & (n-1).`,
      number: num,
      expectedAnswer: result.toString(),
      hint: "The expression n & (n-1) clears the rightmost 1 bit.",
      explanation: `${num} in binary is ${toBinary(num)}\n${num}-1 in binary is ${toBinary(num-1)}\n${num} & (${num}-1) = ${result} (${toBinary(result)})`
    };
  };

  // Generate a challenge based on current level
  const generateChallenge = () => {
    // Determine available challenge types based on level
    const availableChallenges = challengeTypes.slice(0, Math.min(2 + Math.floor(level / 2), challengeTypes.length));
    const challengeType = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    
    let challenge: Challenge;
    switch (challengeType) {
      case 'xorSwap':
        challenge = generateXorSwapChallenge();
        break;
      case 'powerOf2Check':
        challenge = generatePowerOf2Challenge();
        break;
      case 'isBitSet':
        challenge = generateBitCheckChallenge();
        break;
      case 'countBits':
        challenge = generateCountBitsChallenge();
        break;
      case 'toggleBit':
        challenge = generateToggleBitChallenge();
        break;
      case 'isolateLSB':
        challenge = generateIsolateLSBChallenge();
        break;
      case 'clearLSB':
        challenge = generateClearLSBChallenge();
        break;
      default:
        challenge = generatePowerOf2Challenge();
    }
    
    setCurrentChallenge(challenge);
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
    setStepIndex(0);
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
  };

  // Check the user's answer
  const checkAnswer = () => {
    if (!currentChallenge || !userAnswer) return;
    
    let isAnswerCorrect = false;
    
    if (isXorSwapChallenge(currentChallenge)) {
      const currentStep = currentChallenge.steps[stepIndex];
      const expectedValue = currentStep.expectedValue;
      const userValue = parseInt(userAnswer.trim());
      
      isAnswerCorrect = userValue === expectedValue;
      
      if (isAnswerCorrect && stepIndex < currentChallenge.steps.length - 1) {
        // Move to next step
        setStepIndex(stepIndex + 1);
        setUserAnswer('');
        setIsCorrect(null);
        return;
      }
    } else {
      const expectedAnswer = currentChallenge.expectedAnswer;
      isAnswerCorrect = userAnswer.trim().toLowerCase() === expectedAnswer.toLowerCase();
    }
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Award points
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Calculate bonus points
      const streakBonus = Math.floor(newStreak / 3) * 5;
      const levelBonus = level * 3; // Bit wizardry challenges are harder
      const timeBonus = Math.floor(timeLeft / 10);
      
      const pointsEarned = 15 + streakBonus + levelBonus + timeBonus;
      setScore(score + pointsEarned);
      
      // Level up every 20 points
      if (score > 0 && score % 20 < (score + pointsEarned) % 20) {
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
      }, 1500);
    } else {
      // Penalty for wrong answer
      setStreak(0);
      setTimeLeft(prev => Math.max(prev - 5, 1));
    }
  };

  // Render binary visualization
  const renderBinaryVisualization = () => {
    if (!currentChallenge) return null;
    
    if (isXorSwapChallenge(currentChallenge)) {
      const { initialValues, steps } = currentChallenge;
      const currentStep = steps[stepIndex];
      
      return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial A: {initialValues.a}</div>
              <div className="grid grid-cols-8 gap-1">
                {toBinary(initialValues.a).split('').map((bit, i) => (
                  <div 
                    key={`a-${i}`} 
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                      ${bit === '1' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial B: {initialValues.b}</div>
              <div className="grid grid-cols-8 gap-1">
                {toBinary(initialValues.b).split('').map((bit, i) => (
                  <div 
                    key={`b-${i}`} 
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                      ${bit === '1' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
            <div className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">
              {currentStep.instruction}
            </div>
            
            {showExplanation && (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">After this step:</div>
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {toBinary(currentStep.expectedValue).split('').map((bit, i) => (
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
                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                  {currentStep.variable} = {currentStep.expectedValue} ({toBinary(currentStep.expectedValue)})
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // For other challenge types
      const num = currentChallenge.number;
      const binaryNum = toBinary(num);
      
      return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number: {num}</div>
            <div className="grid grid-cols-8 gap-1">
              {binaryNum.split('').map((bit, i) => (
                <div 
                  key={`num-${i}`} 
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                    ${bit === '1' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>
          
          {hasBitPosition(currentChallenge) && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {currentChallenge.type === 'toggleBit' ? 'Toggle' : 'Check'} Mask (1 {`<<`} {currentChallenge.position}): {1 << currentChallenge.position}
              </div>
              <div className="grid grid-cols-8 gap-1">
                {toBinary(1 << currentChallenge.position).split('').map((bit, i) => (
                  <div 
                    key={`mask-${i}`} 
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                      ${bit === '1' 
                        ? 'bg-green-500 text-white animate-pulse' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {showExplanation && isPowerOf2Challenge(currentChallenge) && (
            <div className="mt-4 border-t border-gray-300 dark:border-gray-600 pt-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">n-1: {num-1}</div>
              <div className="grid grid-cols-8 gap-1">
                {toBinary(num-1).split('').map((bit, i) => (
                  <div 
                    key={`n1-${i}`} 
                    className={`w-8 h-8 flex items-center justify-center rounded-md transition-all 
                      ${bit === '1' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                  >
                    {bit}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{num} & ({num}-1) = {num & (num-1)}</div>
                <div className="text-sm mt-2 font-medium text-indigo-600 dark:text-indigo-400">
                  {(num & (num-1)) === 0 ? "This is 0, so it IS a power of 2" : "This is NOT 0, so it's not a power of 2"}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // Restart game with confirmation
  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart? Your current progress will be lost.')) {
      startGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-teal-950 dark:to-blue-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-200 to-teal-200 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[60%] -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
    
      <div className="container mx-auto px-4 py-8 relative">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              Bit Wizardry
            </h1>
            <Link 
              href="/games" 
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Games
            </Link>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Master advanced bit manipulation techniques through puzzles! Solve challenges like XOR swaps, power of 2 detection, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Bit Wizard
                </h2>
                {gameStarted && !gameOver && (
                  <div className="flex items-center space-x-4">
                    <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-teal-600 dark:text-teal-400'}`}>
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
                    Solve advanced bit manipulation puzzles and algorithms!
                    Each correct answer earns points, but be quick - time is limited!
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg shadow-md hover:from-teal-700 hover:to-cyan-700 transition-all"
                  >
                    Start Game
                  </button>
                </div>
              ) : gameOver ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">Game Over!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Your Score: <span className="font-bold">{score}</span></p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">High Score: <span className="font-bold">{highScore}</span></p>
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-lg shadow-md hover:from-teal-700 hover:to-cyan-700 transition-all"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-teal-500 dark:text-teal-400">Score</div>
                      <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">{score}</div>
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-lg text-center">
                      <div className="text-sm text-cyan-500 dark:text-cyan-400">Level</div>
                      <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{level}</div>
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
                    <div className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Bit Wizardry Challenges:</div>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>XOR Swap Algorithm</li>
                      <li>Power of 2 Detection</li>
                      <li>Bit State Manipulation</li>
                      <li>Advanced Bit Operations</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Bit Techniques Reference</h3>
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">XOR Swap</div>
                  <div className="text-gray-600 dark:text-gray-400">a ^= b; b ^= a; a ^= b;</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Is Power of 2</div>
                  <div className="text-gray-600 dark:text-gray-400">n {`>`} 0 && (n & (n-1)) == 0</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Check if Bit is Set</div>
                  <div className="text-gray-600 dark:text-gray-400">(n & (1 {`<<`} pos)) != 0</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Isolate Rightmost Bit</div>
                  <div className="text-gray-600 dark:text-gray-400">n & -n</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Clear Rightmost Bit</div>
                  <div className="text-gray-600 dark:text-gray-400">n & (n-1)</div>
                </div>
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="font-medium">Toggle a Bit</div>
                  <div className="text-gray-600 dark:text-gray-400">n ^ (1 {`<<`} pos)</div>
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
                  <div className="text-teal-600 dark:text-teal-400 font-medium">
                    Challenge #{Math.floor(score / 15) + 1}
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg mb-6">
                    <p className="text-gray-800 dark:text-gray-200">
                      {currentChallenge.description}
                    </p>
                  </div>
                  
                  {renderBinaryVisualization()}
                  
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
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  
                  {isCorrect !== null && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                      {isCorrect ? (
                        <div className="font-medium">
                          Correct! {isXorSwapChallenge(currentChallenge) && stepIndex < currentChallenge.steps.length - 1 ? 
                            "Let's move to the next step." : 
                            `+${15 + Math.floor(streak / 3) * 5 + level * 3 + Math.floor(timeLeft / 10)} points`}
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium mb-1">Incorrect! -5 seconds</div>
                          {isXorSwapChallenge(currentChallenge) ? (
                            <div className="text-sm">
                              The correct value for this step is {currentChallenge.steps[stepIndex].expectedValue}
                            </div>
                          ) : (
                            <div className="text-sm">
                              The correct answer is {currentChallenge.expectedAnswer}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  
                  {showHint && currentChallenge.hint && (
                    <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                      <span className="font-medium">Hint:</span> {currentChallenge.hint}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Why This Matters</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentChallenge.type === 'xorSwap' && "XOR swap is a clever technique to swap variables without using extra memory. It's used in memory-constrained environments."}
                    {currentChallenge.type === 'powerOf2Check' && "Checking if a number is a power of 2 is useful in many algorithms, data structures, and optimizations."}
                    {currentChallenge.type === 'isBitSet' && "Checking individual bits is fundamental to low-level programming, networking, and embedded systems."}
                    {currentChallenge.type === 'countBits' && "Counting set bits has applications in cryptography, coding theory, and performance optimization."}
                    {currentChallenge.type === 'toggleBit' && "Toggling bits is used in hardware control, state management, and algorithm implementation."}
                    {currentChallenge.type === 'isolateLSB' && "Isolating the rightmost set bit is used in algorithms like counting set bits and finding unique numbers."}
                    {currentChallenge.type === 'clearLSB' && "Clearing the rightmost set bit is a key operation in many bit manipulation algorithms."}
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

export default BitWizardryGame; 
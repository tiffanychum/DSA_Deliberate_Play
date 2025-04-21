"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CodeEditor from "../../components/CodeEditor";
import { TestCase } from "../../utils/codeExecutor";
import { completeChallenge } from "../../utils/storage";
import NavLinks from "../../components/NavLinks";

// Type definitions for visualizations
type TwoSumVisualization = {
  type: "interactive";
  initialArray: number[];
  target: number;
}

type SlidingWindowVisualization = {
  type: "interactive";
  initialString: string;
}

type Visualization = TwoSumVisualization | SlidingWindowVisualization;

// Mock challenge data
const challengesData = {
  "two-sum": {
    id: "two-sum",
    name: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    technique: "Two Pointers",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    hints: [
      "A brute force approach would use two loops to check every pair of numbers",
      "Can we do better? Think about using a hash map to store numbers we've seen",
      "For each number, check if its complement (target - num) exists in the hash map"
    ],
    solution: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return null; // No solution found
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    visualization: {
      type: "interactive",
      initialArray: [2, 7, 11, 15],
      target: 9
    } as TwoSumVisualization,
    relatedProblems: [
      { id: "three-sum", name: "Three Sum", difficulty: "Medium" },
      { id: "two-sum-ii", name: "Two Sum II - Input Array Is Sorted", difficulty: "Easy" }
    ]
  },
  "longest-substring": {
    id: "longest-substring",
    name: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    technique: "Sliding Window",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      {
        input: "s = \"abcabcbb\"",
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3."
      },
      {
        input: "s = \"bbbbb\"",
        output: "1",
        explanation: "The answer is \"b\", with the length of 1."
      }
    ],
    hints: [
      "Try using a sliding window approach",
      "Use a set to keep track of characters in the current window",
      "When you find a duplicate, shrink the window from the left"
    ],
    solution: `function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m, n))", // where m is the size of the character set
    visualization: {
      type: "interactive",
      initialString: "abcabcbb"
    } as SlidingWindowVisualization,
    relatedProblems: [
      { id: "longest-repeating-character-replacement", name: "Longest Repeating Character Replacement", difficulty: "Medium" },
      { id: "longest-substring-with-at-most-k-distinct-chars", name: "Longest Substring with At Most K Distinct Characters", difficulty: "Medium" }
    ]
  }
};

// Component for interactive challenge visualization
const TwoSumVisualizer = ({ nums, target, onSolve }: { nums: number[], target: number, onSolve: () => void }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");
  const [solved, setSolved] = useState<boolean>(false);
  const [showCoding, setShowCoding] = useState<boolean>(false);
  
  const handleSelectIndex = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
      return;
    }
    
    if (selectedIndices.length < 2) {
      const newIndices = [...selectedIndices, index];
      setSelectedIndices(newIndices);
      
      if (newIndices.length === 2) {
        const [i, j] = newIndices;
        if (nums[i] + nums[j] === target) {
          setMessage(`Correct! ${nums[i]} + ${nums[j]} = ${target}`);
          setSolved(true);
          onSolve();
        } else {
          setMessage(`Incorrect. ${nums[i]} + ${nums[j]} = ${nums[i] + nums[j]}, not ${target}`);
          setTimeout(() => {
            setSelectedIndices([]);
            setMessage("");
          }, 2000);
        }
      }
    }
  };
  
  const testCases = [
    { id: 1, input: [nums, target], expected: [0, 1] },
    { id: 2, input: [[3, 2, 4], 6], expected: [1, 2] },
    { id: 3, input: [[3, 3], 6], expected: [0, 1] }
  ];
  
  const handleCodingSuccess = () => {
    setSolved(true);
    onSolve();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Interactive Visualization</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCoding(false)}
            className={`px-3 py-1 text-sm rounded-md ${
              !showCoding 
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Visual Mode
          </button>
          <button
            onClick={() => setShowCoding(true)}
            className={`px-3 py-1 text-sm rounded-md ${
              showCoding 
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Coding Mode
          </button>
        </div>
      </div>
      
      {showCoding ? (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Implement the Two Sum solution by writing code that finds the indices of two numbers that add up to the target.
          </p>
          <CodeEditor
            challengeId="two-sum"
            language="python"
            testCases={testCases}
            onSuccess={handleCodingSuccess}
          />
        </div>
      ) : (
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Select two numbers that add up to {target}.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {nums.map((num, index) => (
              <button
                key={index}
                onClick={() => !solved && handleSelectIndex(index)}
                className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 text-lg font-medium transition-colors
                  ${selectedIndices.includes(index) 
                    ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white'
                  } ${solved ? 'cursor-default' : 'hover:border-indigo-300 dark:hover:border-indigo-700'}`}
              >
                {num}
              </button>
            ))}
          </div>
          
          {message && (
            <div className={`text-center p-3 rounded-lg ${
              solved 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component for sliding window visualization
const SlidingWindowVisualizer = ({ initialString, onSolve }: { initialString: string, onSolve: () => void }) => {
  const [currentWindow, setCurrentWindow] = useState<number[]>([0, 0]);
  const [maxWindow, setMaxWindow] = useState<number[]>([0, 0]);
  const [charSet, setCharSet] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const reset = () => {
    setCurrentWindow([0, 0]);
    setMaxWindow([0, 0]);
    setCharSet(new Set([initialString[0]]));
    setStep(0);
    setAutoPlay(false);
    setFinished(false);
    setMessage("");
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const nextStep = () => {
    if (finished) return;
    
    const [left, right] = currentWindow;
    
    if (right + 1 >= initialString.length) {
      setFinished(true);
      setMessage(`Longest substring without repeating characters has length ${maxWindow[1] - maxWindow[0] + 1}`);
      onSolve();
      return;
    }
    
    // Try to extend the window
    const nextChar = initialString[right + 1];
    
    if (charSet.has(nextChar)) {
      // Contract from left until the duplicate is removed
      let newLeft = left;
      const newCharSet = new Set(charSet);
      
      while (initialString[newLeft] !== nextChar) {
        newCharSet.delete(initialString[newLeft]);
        newLeft++;
      }
      
      // Move past the duplicate
      newCharSet.delete(initialString[newLeft]);
      newLeft++;
      
      // Add the new character
      newCharSet.add(nextChar);
      
      setCurrentWindow([newLeft, right + 1]);
      setCharSet(newCharSet);
    } else {
      // Just extend the window
      const newCharSet = new Set(charSet);
      newCharSet.add(nextChar);
      
      const newWindow = [left, right + 1];
      setCurrentWindow(newWindow);
      setCharSet(newCharSet);
      
      // Check if this is a new maximum
      if (newWindow[1] - newWindow[0] + 1 > maxWindow[1] - maxWindow[0] + 1) {
        setMaxWindow(newWindow);
      }
    }
    
    setStep(step + 1);
  };
  
  useEffect(() => {
    // Initialize with the first character
    if (initialString.length > 0) {
      setCharSet(new Set([initialString[0]]));
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initialString]);
  
  useEffect(() => {
    if (autoPlay && !finished) {
      timerRef.current = setInterval(() => {
        nextStep();
      }, 800);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoPlay, finished]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sliding Window Visualization</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Watch how the sliding window algorithm finds the longest substring without repeating characters.
      </p>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-y-1">
          {/* String visualization */}
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {initialString.split('').map((char, index) => {
              const isInCurrentWindow = index >= currentWindow[0] && index <= currentWindow[1];
              const isInMaxWindow = index >= maxWindow[0] && index <= maxWindow[1];
              
              return (
                <div
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center rounded border text-base font-medium
                    ${isInCurrentWindow 
                      ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                      : isInMaxWindow && finished
                        ? 'border-green-500 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                >
                  {char}
                </div>
              );
            })}
          </div>
          
          {/* Current set */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-500 dark:text-gray-400 mr-2">Current Set:</span>
            <div className="flex flex-wrap gap-1">
              {Array.from(charSet).map((char, index) => (
                <div
                  key={index}
                  className="w-8 h-8 flex items-center justify-center rounded border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                >
                  {char}
                </div>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={reset}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1 border rounded-md ${
                autoPlay 
                  ? 'border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                  : 'border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              disabled={finished}
            >
              {autoPlay ? 'Pause' : 'Auto Play'}
            </button>
            <button
              onClick={nextStep}
              className="px-3 py-1 border border-indigo-300 dark:border-indigo-700 rounded-md text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              disabled={autoPlay || finished}
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
      
      {message && (
        <div className="text-center p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
          {message}
        </div>
      )}
    </div>
  );
};

export default function ChallengePage() {
  const params = useParams();
  const challengeId = params.challengeId as string;
  const challenge = challengesData[challengeId as keyof typeof challengesData];

  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'solution' | 'implementation'>('problem');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!challenge) {
    return <div className="min-h-screen flex items-center justify-center">Challenge not found</div>;
  }
  
  const handleSolve = () => {
    setSolved(true);
  };

  // Type guards for visualizations
  const isTwoSumVisualization = (visualization: Visualization): visualization is TwoSumVisualization => {
    return 'initialArray' in visualization && 'target' in visualization;
  };
  
  const isSlidingWindowVisualization = (visualization: Visualization): visualization is SlidingWindowVisualization => {
    return 'initialString' in visualization;
  };

  // Add test cases for challenges
  const getTestCases = (challengeId: string) => {
    if (challengeId === 'two-sum') {
      return [
        { id: 1, input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { id: 2, input: [[3, 2, 4], 6], expected: [1, 2] },
        { id: 3, input: [[3, 3], 6], expected: [0, 1] }
      ];
    } else if (challengeId === 'longest-substring') {
      return [
        { id: 1, input: ["abcabcbb"], expected: 3 },
        { id: 2, input: ["bbbbb"], expected: 1 },
        { id: 3, input: ["pwwkew"], expected: 3 }
      ];
    }
    return [];
  };
  
  const testCases = getTestCases(challengeId);
  
  // Python solution templates
  const getPythonSolution = (challengeId: string) => {
    if (challengeId === 'two-sum') {
      return `def solution(nums, target):
    # Your solution here
    # Return indices of the two numbers such that they add up to target
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution found
`;
    } else if (challengeId === 'longest-substring') {
      return `def solution(s):
    # Your solution here
    # Return the length of longest substring without repeating characters
    char_set = set()
    max_length = 0
    left = 0
    
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length
`;
    }
    return "def solution():\n    # Your solution here\n    pass";
  };
  
  // JavaScript solution templates
  const getJsSolution = (challengeId: string) => {
    if (challengeId === 'two-sum') {
      return `function solution(nums, target) {
    // Your solution here
    // Return indices of the two numbers such that they add up to target
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return null; // No solution found
}`;
    } else if (challengeId === 'longest-substring') {
      return `function solution(s) {
    // Your solution here
    // Return the length of longest substring without repeating characters
    const charSet = new Set();
    let maxLength = 0;
    let left = 0;
    
    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`;
    }
    return "function solution() {\n    // Your solution here\n    return null;\n}";
  };

  const handleCodeExecution = (success: boolean) => {
    if (success) {
      setSolved(true);
      setShowSuccess(true);
    }
  };

  const handlePythonError = (error: string) => {
    // Handle Python environment errors
    setError(error);
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
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100/80 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                Level 7
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden mb-8 border border-white/20 dark:border-gray-700/30">
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{challenge.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                  challenge.difficulty === 'Easy' 
                    ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                    : challenge.difficulty === 'Medium'
                    ? 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                    : 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="bg-purple-100/80 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full flex items-center">
                  {challenge.technique}
                </span>
                <span className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center">
                  {challenge.category}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {challenge.description}
            </p>
            
            {challenge.id === 'two-sum' && challenge.visualization && 
             isTwoSumVisualization(challenge.visualization) && (
              <TwoSumVisualizer 
                nums={challenge.visualization.initialArray} 
                target={challenge.visualization.target}
                onSolve={handleSolve}
              />
            )}
            
            {challenge.id === 'longest-substring' && challenge.visualization && 
             isSlidingWindowVisualization(challenge.visualization) && (
              <SlidingWindowVisualizer 
                initialString={challenge.visualization.initialString}
                onSolve={handleSolve}
              />
            )}
            
            <div className="border-b border-gray-200/50 dark:border-gray-700/50 mt-8">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('problem')}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'problem'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                  }`}
                >
                  Problem Description
                </button>
                <button
                  onClick={() => setActiveTab('hints')}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'hints'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                  }`}
                >
                  Hints
                </button>
                <button
                  onClick={() => setActiveTab('solution')}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'solution'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                  }`}
                >
                  Solution
                </button>
                <button
                  onClick={() => setActiveTab('implementation')}
                  className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'implementation'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/20'
                  }`}
                >
                  Implementation
                </button>
              </nav>
            </div>
            
            <div className="py-6">
              {activeTab === 'problem' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Constraints</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300">
                      {challenge.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Examples</h3>
                    <div className="space-y-6">
                      {challenge.examples.map((example, index) => (
                        <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4">
                          <div className="mb-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Input:</span>
                            <code className="ml-2 bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded font-mono text-sm">
                              {example.input}
                            </code>
                          </div>
                          <div className="mb-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Output:</span>
                            <code className="ml-2 bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded font-mono text-sm">
                              {example.output}
                            </code>
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Explanation:</span>
                              <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">{example.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'hints' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Hints</h3>
                  <ul className="space-y-4">
                    {challenge.hints.map((hint, index) => (
                      <li key={index} className="bg-indigo-50/80 dark:bg-indigo-900/30 p-3 rounded-xl text-gray-700 dark:text-gray-300">
                        <div className="flex items-start">
                          <span className="bg-indigo-100/80 dark:bg-indigo-800/70 text-indigo-700 dark:text-indigo-300 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                            {index + 1}
                          </span>
                          {hint}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'solution' && (
                <div>
                  {showSolution || solved ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Approach</h3>
                        {challenge.id === 'two-sum' && (
                          <p className="text-gray-600 dark:text-gray-300">
                            We can use a hash map to store the numbers we've seen so far along with their indices. 
                            For each number, we check if its complement (target - num) exists in the hash map. 
                            If it does, we've found our answer. If not, we add the current number to the hash map and continue.
                          </p>
                        )}
                        {challenge.id === 'longest-substring' && (
                          <p className="text-gray-600 dark:text-gray-300">
                            We use a sliding window approach with a set to keep track of characters in the current window.
                            We expand the window to the right as long as we don't encounter duplicates.
                            When we find a duplicate, we contract the window from the left until the duplicate is removed.
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Python Solution</h3>
                        <div className="mb-6">
                          <CodeEditor
                            challengeId={challenge.id}
                            language="python"
                            initialCode={getPythonSolution(challenge.id)}
                            testCases={testCases}
                            readOnly={true}
                          />
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">JavaScript Solution</h3>
                        <div className="mb-6">
                          <CodeEditor
                            challengeId={challenge.id}
                            language="javascript"
                            initialCode={getJsSolution(challenge.id)}
                            testCases={testCases}
                            readOnly={true}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Time Complexity</h3>
                          <p className="text-gray-600 dark:text-gray-300">{challenge.timeComplexity}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Space Complexity</h3>
                          <p className="text-gray-600 dark:text-gray-300">{challenge.spaceComplexity}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Are you sure you want to view the solution? 
                        Try solving the problem on your own first for the best learning experience.
                      </p>
                      <button
                        onClick={() => setShowSolution(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <span>Show Solution</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'implementation' && (
                <>
                  <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-md overflow-hidden mb-6 border border-white/20 dark:border-gray-700/30">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Your Implementation</h3>
                      
                      {error ? (
                        <div className="p-4 bg-red-50/80 dark:bg-red-900/20 rounded-xl mb-6">
                          <h4 className="text-red-700 dark:text-red-300 font-medium mb-2">Error</h4>
                          <p className="text-red-600 dark:text-red-400">{error}</p>
                          <button 
                            onClick={() => setError(null)}
                            className="mt-3 text-sm text-red-700 dark:text-red-300 underline"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : (
                        <CodeEditor
                          challengeId={challenge.id}
                          language="python"
                          testCases={testCases}
                          onSuccess={() => handleCodeExecution(true)}
                        />
                      )}
                    </div>
                  </div>
                  
                  {showSuccess && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl mb-8 border border-green-100/50 dark:border-green-800/30 shadow-sm">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-green-800 dark:text-green-200">Challenge Complete!</h3>
                          <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                            <p>Congratulations! You've successfully solved this challenge.</p>
                          </div>
                          <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex">
                              <button
                                onClick={() => setActiveTab('solution')}
                                className="inline-flex items-center bg-green-100 dark:bg-green-800 px-4 py-2 rounded-lg text-sm font-medium text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700 transition-colors duration-200"
                              >
                                <span>View Solution Explanation</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Related problems */}
        <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/30">
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Related Problems</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {challenge.relatedProblems.map(problem => (
                <div key={problem.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{problem.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                        problem.difficulty === 'Easy' 
                          ? 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                          : problem.difficulty === 'Medium'
                          ? 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                          : 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <Link
                      href={`/challenges/${problem.id}`}
                      className="inline-flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                    >
                      <span>Try Problem</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
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
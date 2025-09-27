"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { addXP } from '../../../utils/storage';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './animations.css';

interface MCQuestion {
  id: number;
  topic: string;
  functionName: string;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  followUpQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const DPMultipleChoiceGame = () => {
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<MCQuestion | null>(null);
  const [currentFollowUp, setCurrentFollowUp] = useState<number>(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // New interactive features
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [quizMode, setQuizMode] = useState<'practice' | 'challenge' | 'speed'>('practice');
  const [timeLeft, setTimeLeft] = useState(30); // For speed mode
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [userProgress, setUserProgress] = useState<{[key: string]: number}>({});

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
  }, []);

  // All DP Multiple Choice Questions
  const questions: MCQuestion[] = [
    // Tree DP Questions
    {
      id: 1,
      topic: "Tree DP",
      functionName: "rob (House Robber III)",
      question: "What does the tuple (rob_this, not_rob_this) represent in the tree DP solution?",
      code: `def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)  # (rob_this, not_rob_this)
        
        left_rob, left_not_rob = dfs(node.left)
        right_rob, right_not_rob = dfs(node.right)
        
        rob_current = node.val + left_not_rob + right_not_rob
        not_rob_current = max(left_rob, left_not_rob) + max(right_rob, right_not_rob)
        
        return (rob_current, not_rob_current)`,
      options: [
        "Maximum money if we rob this node, Maximum money if we don't rob this node",
        "Number of houses robbed, Number of houses not robbed",
        "Left subtree sum, Right subtree sum",
        "Current node value, Remaining node values"
      ],
      correctAnswer: 0,
      hint: "Think about what decision we're making at each node and what information we need to pass up to the parent.",
      explanation: "The tuple represents the maximum money we can rob from this subtree in two scenarios: (1) if we rob the current node, and (2) if we don't rob the current node. This allows the parent to make an optimal decision.",
      followUpQuestions: [
        {
          question: "What is the time complexity of this tree DP solution?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
          correctAnswer: 2,
          explanation: "We visit each node exactly once, performing constant work at each node, so the time complexity is O(n) where n is the number of nodes."
        },
        {
          question: "What DP pattern is being used here?",
          options: ["Memoization", "Bottom-up tabulation", "Tree DP with state passing", "2D grid DP"],
          correctAnswer: 2,
          explanation: "This uses Tree DP with state passing - we pass state information (rob/not rob) up from children to parent to make optimal decisions."
        }
      ]
    },
    {
      id: 2,
      topic: "Tree DP",
      functionName: "maxPathSum",
      question: "In the maximum path sum problem, why do we use `max(max_gain(node.left), 0)`?",
      code: `def maxPathSum(root):
    max_sum = float('-inf')
    
    def max_gain(node):
        nonlocal max_sum
        if not node:
            return 0
        
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)
        
        path_through_current = node.val + left_gain + right_gain
        max_sum = max(max_sum, path_through_current)
        
        return node.val + max(left_gain, right_gain)`,
      options: [
        "To ensure we don't include negative path sums",
        "To handle empty subtrees",
        "To prevent integer overflow",
        "To maintain the tree structure"
      ],
      correctAnswer: 0,
      hint: "Consider what happens when a subtree has all negative values - would including it help or hurt our maximum path sum?",
      explanation: "We use max(gain, 0) because if a subtree contributes a negative gain, we're better off not including it in our path. We can always choose to 'cut off' negative contributions."
    },
    // 2D Grid DP Questions
    {
      id: 3,
      topic: "2D Grid DP",
      functionName: "unique_paths",
      question: "In the space-optimized unique paths solution, what does `dp[j] = dp[j] + dp[j-1]` represent?",
      code: `def unique_paths(m, n):
    dp = [1] * n  # First row: all cells have 1 path
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] = dp[j] + dp[j-1]
    
    return dp[n-1]`,
      options: [
        "dp[j] (from top) + dp[j-1] (from left)",
        "Current cell + previous cell",
        "Row sum + column sum", 
        "Vertical paths + horizontal paths"
      ],
      correctAnswer: 0,
      hint: "Think about what dp[j] represents before and after the update, and what dp[j-1] represents.",
      explanation: "Before update: dp[j] contains paths from top (previous row). dp[j-1] contains paths from left (current row). After update: dp[j] = paths from top + paths from left."
    },
    {
      id: 4,
      topic: "2D Grid DP",
      functionName: "min_path_sum",
      question: "Why can we modify the input grid in-place for the minimum path sum problem?",
      code: `def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    
    # Initialize first row
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    
    # Initialize first column
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]
    
    # Fill rest of grid
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])`,
      options: [
        "Because we only need the current and previous values",
        "Because we process cells in the correct order (top-left to bottom-right)",
        "Because the problem allows modifying input",
        "Because it saves memory space"
      ],
      correctAnswer: 1,
      hint: "Consider the order in which we process cells and what values we need when computing grid[i][j].",
      explanation: "We can modify in-place because we process cells from top-left to bottom-right. When computing grid[i][j], we only need grid[i-1][j] (above) and grid[i][j-1] (left), which we've already processed."
    },
    // String DP Questions  
    {
      id: 5,
      topic: "String DP",
      functionName: "minDistance (Edit Distance)",
      question: "In the edit distance DP, what does `dp[i-1][j-1]` represent when characters match?",
      code: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # No operation needed
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],      # Delete
                    dp[i][j-1],      # Insert  
                    dp[i-1][j-1]     # Replace
                )`,
      options: [
        "Edit distance without the current characters",
        "Edit distance including both current characters", 
        "Number of matching characters so far",
        "Cost of replacing current character"
      ],
      correctAnswer: 0,
      hint: "When characters match, we don't need any operation for them, so what subproblem do we reduce to?",
      explanation: "When word1[i-1] == word2[j-1], the characters match, so no operation is needed. We take the edit distance of the strings without these matching characters: dp[i-1][j-1]."
    },
    {
      id: 6,
      topic: "String DP",
      functionName: "longestCommonSubsequence",
      question: "What is the recurrence relation for LCS when characters don't match?",
      code: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
      options: [
        "dp[i][j] = dp[i-1][j-1]",
        "dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
        "dp[i][j] = min(dp[i-1][j], dp[i][j-1])"
      ],
      correctAnswer: 1,
      hint: "When characters don't match, we have two choices: skip the character from text1 or skip the character from text2.",
      explanation: "When characters don't match, we take the maximum of: (1) LCS without current char from text1: dp[i-1][j], (2) LCS without current char from text2: dp[i][j-1]."
    },
    // Digit DP Questions
    {
      id: 7,
      topic: "Digit DP",
      functionName: "numDupDigitsAtMostN",
      question: "What does the 'tight' parameter represent in digit DP?",
      code: `def dp(pos, tight, started, mask):
    if pos == n:
        return 1 if started else 0
    
    limit = digits[pos] if tight else 9
    result = 0
    
    for digit in range(0, limit + 1):
        new_tight = tight and (digit == limit)
        # ... rest of logic`,
      options: [
        "Whether we've started placing non-zero digits",
        "Whether we're still bounded by the original number N",
        "Whether we've used all available digits",
        "Whether we've found duplicate digits"
      ],
      correctAnswer: 1,
      hint: "Think about when we can place any digit (0-9) vs when we're constrained by the digits of N.",
      explanation: "The 'tight' parameter indicates whether we're still constrained by the digits of the original number N. If tight=True, we can only place digits up to digits[pos]. If tight=False, we can place any digit 0-9."
    },
    {
      id: 8,
      topic: "Digit DP", 
      functionName: "findIntegers (Fibonacci Numbers)",
      question: "Why does the Fibonacci-based solution work for counting numbers without consecutive 1s?",
      code: `def findIntegersFib(num):
    binary = bin(num)[2:]
    n = len(binary)
    
    fib = [0] * (n + 2)
    fib2 = [0] * (n + 2)
    
    fib[0] = fib2[0] = 1
    for i in range(1, n + 2):
        fib[i] = fib[i-1] + fib2[i-1]  # Can append 0 to any pattern
        fib2[i] = fib[i-1]             # Can append 1 only to patterns ending in 0`,
      options: [
        "Because Fibonacci numbers count binary strings naturally",
        "Because valid binary strings follow the Fibonacci recurrence: f(n) = f(n-1) + f(n-2)",
        "Because we're counting in binary base",
        "Because the constraint creates a Fibonacci-like growth pattern"
      ],
      correctAnswer: 1,
      hint: "Think about how many valid n-bit strings you can form: you can append '0' to any (n-1)-bit valid string, and '1' only to (n-2)-bit valid strings ending in '0'.",
      explanation: "For n-bit strings without consecutive 1s: f(n) = f(n-1) + f(n-2). We can append '0' to any valid (n-1)-bit string, and '1' only to valid (n-2)-bit strings (to avoid consecutive 1s)."
    },
    // Code Completion Questions
    {
      id: 9,
      topic: "2D Grid DP",
      functionName: "maximal_rectangle",
      question: "What is the missing line in this maximal rectangle solution?",
      code: `def maximal_rectangle(matrix):
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    heights = [0] * n
    max_area = 0
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == '1':
                # MISSING LINE HERE
            else:
                heights[j] = 0
        
        max_area = max(max_area, largest_rectangle_in_histogram(heights))
    
    return max_area`,
      options: [
        "heights[j] += 1",
        "heights[j] = 1",
        "heights[j] = i + 1",
        "heights[j] = heights[j-1] + 1"
      ],
      correctAnswer: 0,
      hint: "Think about how we're building a histogram for each row. What happens to the height when we encounter a '1'?",
      explanation: "We use 'heights[j] += 1' because we're accumulating the consecutive '1's vertically to form histogram bars. Each '1' adds to the height of the bar at that column.",
      followUpQuestions: [
        {
          question: "Why do we reset heights[j] to 0 when matrix[i][j] is '0'?",
          options: [
            "Because '0' breaks the vertical continuity of '1's",
            "To save memory",
            "It's a bug in the code",
            "To optimize performance"
          ],
          correctAnswer: 0,
          explanation: "A '0' breaks the vertical continuity, so we can't have a rectangle that spans across a '0'. We must reset the height to 0."
        }
      ]
    },
    {
      id: 10,
      topic: "2D Grid DP",
      functionName: "cherry_pickup_optimized",
      question: "In the space-optimized cherry pickup, why is r2 calculated as 'r1 + c1 - c2'?",
      code: `def cherry_pickup_optimized(grid):
    n = len(grid)
    memo = {}
    
    def dp(r1, c1, c2):
        r2 = r1 + c1 - c2  # Why this formula?
        
        if (r1 == n-1 and c1 == n-1):
            return grid[n-1][n-1]`,
      options: [
        "Because both paths take the same number of steps: r1+c1 = r2+c2",
        "To reduce memory usage by half",
        "It's a mathematical optimization trick",
        "To avoid collision detection"
      ],
      correctAnswer: 0,
      hint: "Think about Manhattan distance - both people start at (0,0) and move the same number of steps.",
      explanation: "Since both people move from (0,0) taking exactly the same number of steps (only right or down), we have r1+c1 = r2+c2 (total steps). Rearranging: r2 = r1 + c1 - c2.",
      followUpQuestions: [
        {
          question: "How much space does this optimization save?",
          options: [
            "Reduces from O(n⁴) to O(n³)",
            "Reduces from O(n³) to O(n²)",
            "Reduces from O(n²) to O(n)",
            "No space savings"
          ],
          correctAnswer: 0,
          explanation: "By eliminating one dimension (r2), we reduce the memoization space from 4D to 3D, saving O(n) space complexity."
        }
      ]
    },
    {
      id: 11,
      topic: "String DP",
      functionName: "isMatch (Regex)",
      question: "What should be the missing condition in this regex matching DP?",
      code: `def isMatch(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # Handle patterns like "a*", "a*b*" that can match empty string
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            # MISSING LINE HERE
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] != '*':
                if s[i - 1] == p[j - 1] or p[j - 1] == '.':
                    dp[i][j] = dp[i - 1][j - 1]`,
      options: [
        "dp[0][j] = dp[0][j - 2]",
        "dp[0][j] = True",
        "dp[0][j] = dp[0][j - 1]",
        "dp[0][j] = False"
      ],
      correctAnswer: 0,
      hint: "Think about what 'a*' means - it can match zero occurrences of 'a'.",
      explanation: "dp[0][j] = dp[0][j-2] because '*' can match zero occurrences of the preceding character, so we look at the pattern without the 'char*' part (j-2 positions back)."
    },
    {
      id: 12,
      topic: "Tree DP",
      functionName: "rob (Memoization version)",
      question: "What's the correct way to calculate rob_current when robbing the current node?",
      code: `def robMemo(root):
    memo = {}
    
    def dfs(node):
        if not node:
            return 0
        if node in memo:
            return memo[node]
        
        # Option 1: Rob current node
        rob_current = node.val
        if node.left:
            # MISSING LINE HERE
        if node.right:
            rob_current += dfs(node.right.left) + dfs(node.right.right)`,
      options: [
        "rob_current += dfs(node.left.left) + dfs(node.left.right)",
        "rob_current += dfs(node.left)",
        "rob_current = max(rob_current, dfs(node.left))",
        "rob_current += dfs(node.left) + dfs(node.right)"
      ],
      correctAnswer: 0,
      hint: "If we rob the current node, we cannot rob its children. What's the next level we can rob?",
      explanation: "We add dfs(node.left.left) + dfs(node.left.right) because if we rob the current node, we skip its children and can rob its grandchildren."
    },
    {
      id: 13,
      topic: "String DP",
      functionName: "longestCommonSubsequenceOptimized",
      question: "Why do we swap 'prev' and 'curr' arrays at the end of each iteration?",
      code: `def longestCommonSubsequenceOptimized(text1, text2):
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        
        prev, curr = curr, prev  # Why this swap?`,
      options: [
        "To reuse arrays: curr becomes the new prev for next iteration",
        "To clear the curr array for next use",
        "To save the final result",
        "It's unnecessary, we could remove it"
      ],
      correctAnswer: 0,
      hint: "Think about what 'prev' represents in the next iteration of i.",
      explanation: "After processing row i, 'curr' contains the DP values for row i. For the next iteration (i+1), we need row i as 'prev'. The swap makes curr become prev, and the old prev array is reused as the new curr.",
      followUpQuestions: [
        {
          question: "What's the space complexity of this optimization?",
          options: ["O(n)", "O(m)", "O(min(m,n))", "O(m*n)"],
          correctAnswer: 0,
          explanation: "We only use two arrays of size (n+1), so space complexity is O(n), compared to O(m*n) for the standard 2D DP approach."
        }
      ]
    },
    {
      id: 14,
      topic: "Digit DP",
      functionName: "atMostNGivenDigitSet",
      question: "What should the base case return when pos == n?",
      code: `def atMostNGivenDigitSet(digits, N):
    str_n = str(N)
    n = len(str_n)
    memo = {}
    
    def dp(pos, tight, started):
        if pos == n:
            return ???  # What should this return?
        
        if (pos, tight, started) in memo:
            return memo[(pos, tight, started)]`,
      options: [
        "1 if started else 0",
        "1",
        "0",
        "started"
      ],
      correctAnswer: 0,
      hint: "We should count this as a valid number only if we've actually formed a number (not just leading zeros).",
      explanation: "Return '1 if started else 0' because we count it as valid only if we've started placing digits (started=True). If we haven't placed any digits (all leading zeros), it's not a valid number."
    },
    {
      id: 15,
      topic: "2D Grid DP",
      functionName: "min_path_sum_optimized",
      question: "What's wrong with this initialization in the space-optimized min path sum?",
      code: `def min_path_sum_optimized(grid):
    m, n = len(grid), len(grid[0])
    dp = [float('inf')] * n
    dp[0] = 0  # Is this correct?
    
    for i in range(m):
        dp[0] += grid[i][0]
        for j in range(1, n):
            dp[j] = min(dp[j], dp[j-1]) + grid[i][j]`,
      options: [
        "dp[0] should be grid[0][0], not 0",
        "Nothing wrong, it's correct",
        "dp[0] should be float('inf')",
        "We should initialize all dp values to 0"
      ],
      correctAnswer: 1,
      hint: "Think about what dp[0] represents before we start processing and how it's updated in the loop.",
      explanation: "Actually, dp[0] = 0 is correct! Before the loop starts, dp[0] is 0. In the first iteration (i=0), dp[0] becomes 0 + grid[0][0] = grid[0][0], which is what we want. The += operation correctly accumulates the path sum."
    }
  ];

  // Timer for speed mode
  useEffect(() => {
    if (quizMode === 'speed' && gameStarted && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizMode, gameStarted, isAnswered]);

  // Track time spent
  useEffect(() => {
    if (gameStarted && currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, gameStarted]);

  // Define achievements
  const allAchievements: Achievement[] = [
    { id: 'first_correct', title: 'First Steps', description: 'Answer your first question correctly', icon: '🎯', unlocked: false },
    { id: 'streak_5', title: 'On Fire!', description: 'Get 5 correct answers in a row', icon: '🔥', unlocked: false },
    { id: 'streak_10', title: 'DP Master', description: 'Get 10 correct answers in a row', icon: '🏆', unlocked: false },
    { id: 'no_hints', title: 'Independent Thinker', description: 'Complete 5 questions without hints', icon: '🧠', unlocked: false },
    { id: 'speed_demon', title: 'Speed Demon', description: 'Answer a question in under 10 seconds', icon: '⚡', unlocked: false },
    { id: 'topic_master', title: 'Topic Master', description: 'Complete all questions in a topic', icon: '📚', unlocked: false },
    { id: 'comeback', title: 'Comeback Kid', description: 'Get correct after 3 wrong answers', icon: '💪', unlocked: false },
    { id: 'perfectionist', title: 'Perfectionist', description: 'Get all follow-ups correct for 3 questions', icon: '✨', unlocked: false },
    { id: 'explorer', title: 'Explorer', description: 'Try all quiz modes', icon: '🗺️', unlocked: false },
    { id: 'persistent', title: 'Persistent', description: 'Complete 20 questions', icon: '🎖️', unlocked: false }
  ];

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('dpAchievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(allAchievements);
    }

    // Load progress
    const savedProgress = localStorage.getItem('dpProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      const updatedAchievements = achievements.map(a =>
        a.id === achievementId ? { ...a, unlocked: true } : a
      );
      setAchievements(updatedAchievements);
      localStorage.setItem('dpAchievements', JSON.stringify(updatedAchievements));
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 3000);
      
      // Add bonus XP for achievement
      addXP(10);
    }
  };

  const checkAchievements = () => {
    // Check streak achievements
    if (streak >= 5 && !achievements.find(a => a.id === 'streak_5')?.unlocked) {
      unlockAchievement('streak_5');
    }
    if (streak >= 10 && !achievements.find(a => a.id === 'streak_10')?.unlocked) {
      unlockAchievement('streak_10');
    }
    
    // Check speed achievement
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    if (timeTaken < 10 && isCorrect && !achievements.find(a => a.id === 'speed_demon')?.unlocked) {
      unlockAchievement('speed_demon');
    }
    
    // Check no hints achievement
    if (completedQuestions.size >= 5 && hintsUsed === 0 && !achievements.find(a => a.id === 'no_hints')?.unlocked) {
      unlockAchievement('no_hints');
    }
    
    // Check persistent achievement
    if (completedQuestions.size >= 20 && !achievements.find(a => a.id === 'persistent')?.unlocked) {
      unlockAchievement('persistent');
    }
  };

  const handleTimeOut = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    setStreak(0);
    setCombo(0);
    setShowExplanation(true);
  };

  const calculateScore = (correct: boolean, timeTaken: number) => {
    if (!correct) return 0;
    
    let points = currentFollowUp >= 0 ? 5 : 10;
    
    // Time bonus (speed mode)
    if (quizMode === 'speed' && timeTaken < 10) {
      points += 5;
    }
    
    // Combo multiplier
    if (combo > 0) {
      points = Math.floor(points * (1 + combo * 0.1));
    }
    
    // Difficulty multiplier
    const difficultyMultiplier: {[key: string]: number} = {
      'Easy': 1,
      'Medium': 1.5,
      'Hard': 2
    };
    points = Math.floor(points * (difficultyMultiplier[currentQuestion?.difficulty || 'Medium'] || 1));
    
    return points;
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      setHintsUsed(prev => prev + 1);
    }
  };

  const topics = ['all', 'Tree DP', '2D Grid DP', 'String DP', 'Digit DP'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const filteredQuestions = questions.filter(q => {
    const topicMatch = selectedTopic === 'all' || q.topic === selectedTopic;
    const difficultyMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return topicMatch && difficultyMatch;
  });

  const startGame = () => {
    setGameStarted(true);
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setCombo(0);
    setHintsUsed(0);
    setCompletedQuestions(new Set());
    loadQuestion(0);
    setQuestionStartTime(Date.now());
  };

  const loadQuestion = (index: number) => {
    if (index >= filteredQuestions.length) {
      endGame();
      return;
    }
    
    setCurrentQuestion(filteredQuestions[index]);
    setCurrentFollowUp(-1);
    setSelectedAnswer(-1);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());
    
    if (quizMode === 'speed') {
      setTimeLeft(30);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const correct = currentFollowUp >= 0 
      ? currentQuestion?.followUpQuestions?.[currentFollowUp].correctAnswer === answerIndex
      : currentQuestion?.correctAnswer === answerIndex;
    
    setIsCorrect(correct || false);
    
    if (correct) {
      const points = calculateScore(true, timeTaken);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCombo(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      
      // Show combo animation
      if (combo >= 2) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1000);
      }
      
      // First correct achievement
      if (completedQuestions.size === 0 && !achievements.find(a => a.id === 'first_correct')?.unlocked) {
        unlockAchievement('first_correct');
      }
    } else {
      setStreak(0);
      setCombo(0);
    }
    
    setShowExplanation(true);
    checkAchievements();
  };

  const nextQuestion = () => {
    if (!currentQuestion) return;
    
    if (currentFollowUp >= 0) {
      // Move to next follow-up or next main question
      if (currentFollowUp + 1 < (currentQuestion.followUpQuestions?.length || 0)) {
        setCurrentFollowUp(currentFollowUp + 1);
        setSelectedAnswer(-1);
        setIsAnswered(false);
        setIsCorrect(null);
        setShowExplanation(false);
        setQuestionStartTime(Date.now());
        if (quizMode === 'speed') setTimeLeft(30);
      } else {
        // Mark question as completed and move to next
        setCompletedQuestions(prev => new Set(prev).add(currentQuestion.id));
        setQuestionIndex(prev => prev + 1);
        loadQuestion(questionIndex + 1);
      }
    } else {
      // Move to follow-up questions or next main question
      if (currentQuestion.followUpQuestions && currentQuestion.followUpQuestions.length > 0) {
        setCurrentFollowUp(0);
        setSelectedAnswer(-1);
        setIsAnswered(false);
        setIsCorrect(null);
        setShowExplanation(false);
        setQuestionStartTime(Date.now());
        if (quizMode === 'speed') setTimeLeft(30);
      } else {
        setCompletedQuestions(prev => new Set(prev).add(currentQuestion.id));
        setQuestionIndex(prev => prev + 1);
        loadQuestion(questionIndex + 1);
      }
    }
    
    // Update progress
    const progress = { ...userProgress };
    const topic = currentQuestion.topic;
    progress[topic] = (progress[topic] || 0) + 1;
    setUserProgress(progress);
    localStorage.setItem('dpProgress', JSON.stringify(progress));
  };

  const endGame = () => {
    const xpEarned = Math.floor(score / 2);
    if (xpEarned > 0) {
      addXP(xpEarned);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(null);
    setCurrentFollowUp(-1);
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setCombo(0);
    setCompletedQuestions(new Set());
    setHintsUsed(0);
  };

  const getCurrentQuestionData = () => {
    if (!currentQuestion) return null;
    
    if (currentFollowUp >= 0 && currentQuestion.followUpQuestions) {
      return currentQuestion.followUpQuestions[currentFollowUp];
    }
    
    return currentQuestion;
  };

  const currentQuestionData = getCurrentQuestionData();

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        {/* Header */}
        <header className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/games" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Games
              </Link>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                DP Multiple Choice Challenge
              </h1>
            </div>
          </div>
        </header>

        {/* Start Screen */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🧮</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Dynamic Programming Multiple Choice
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Test your understanding of Dynamic Programming concepts through carefully crafted multiple choice questions. 
                Each question includes hints, detailed explanations, and follow-up questions about complexity and patterns.
              </p>
            </div>

            {/* Topic Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Topic:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedTopic === topic
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {topic === 'all' ? 'All Topics' : topic}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {filteredQuestions.length} questions available
              </p>
            </div>

            {/* Game Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💡</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hints Available</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get helpful hints when you're stuck on a question
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📚</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Detailed Explanations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Learn from comprehensive explanations for each answer
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Follow-up Questions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Deep dive into complexity analysis and patterns
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all"
              >
                Start Challenge
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (questionIndex >= filteredQuestions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Challenge Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've completed all questions in the selected topic.
            </p>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Final Score: {score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                XP Earned: {Math.floor(score / 2)}
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Play Again
              </button>
              <Link 
                href="/games"
                className="block w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-center"
              >
                Back to Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Combo Animation */}
      {showCombo && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg">
            🔥 Combo x{combo}! 🔥
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <span className="text-2xl">{showAchievement.icon}</span>
            <div>
              <p className="font-bold">Achievement Unlocked!</p>
              <p className="text-sm">{showAchievement.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/games/dynamic-programming-adventure" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to DP Adventure
            </Link>
            <div className="flex items-center space-x-6">
              {/* Score with animation */}
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Score: <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{score}</span>
              </div>
              
              {/* Streak indicator */}
              {streak > 0 && (
                <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400">
                  <span className="text-lg">🔥</span>
                  <span className="font-bold">{streak}</span>
                </div>
              )}
              
              {/* Progress */}
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {questionIndex + 1} / {filteredQuestions.length}
              </div>
              
              {/* Timer for speed mode */}
              {quizMode === 'speed' && !isAnswered && (
                <div className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-gray-600 dark:text-gray-300'}`}>
                  ⏱️ {timeLeft}s
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Panel */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-medium rounded-full">
                    {currentQuestion?.topic}
                  </span>
                  {currentQuestion?.difficulty && (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      currentQuestion.difficulty === 'Easy' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : currentQuestion.difficulty === 'Medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  )}
                  {currentFollowUp >= 0 && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium rounded-full">
                      Follow-up {currentFollowUp + 1}
                    </span>
                  )}
                </div>
                {!isAnswered && (
                  <button
                    onClick={handleShowHint}
                    className="flex items-center space-x-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    <span>💡</span>
                    <span>Hint</span>
                  </button>
                )}
              </div>
              
              {currentFollowUp < 0 && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {currentQuestion?.functionName}
                </h3>
              )}
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentQuestionData?.question}
              </p>
              
              {showHint && !isAnswered && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">💡</span>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      {currentQuestion?.hint}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {currentQuestionData?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isAnswered
                        ? index === (currentQuestionData?.correctAnswer ?? -1)
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          : selectedAnswer === index
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                        : selectedAnswer === index
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isAnswered && index === (currentQuestionData?.correctAnswer ?? -1) && (
                        <span className="text-green-600 dark:text-green-400">✓</span>
                      )}
                      {isAnswered && selectedAnswer === index && index !== (currentQuestionData?.correctAnswer ?? -1) && (
                        <span className="text-red-600 dark:text-red-400">✗</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">📚</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Explanation:</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {currentQuestionData?.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {isAnswered && (
                <div className="mt-6">
                  {/* Animated feedback */}
                  <div className={`mb-4 p-4 rounded-lg ${
                    isCorrect 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30'
                      : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isCorrect ? (
                          <>
                            <div className="text-3xl animate-bounce">🎉</div>
                            <div>
                              <p className="text-green-800 dark:text-green-300 font-bold">
                                Excellent! +{calculateScore(true, (Date.now() - questionStartTime) / 1000)} points
                              </p>
                              {combo > 2 && (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  Combo bonus applied! 🔥
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-3xl">💭</div>
                            <div>
                              <p className="text-red-800 dark:text-red-300 font-bold">
                                Not quite right
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Review the explanation below
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Stats for this question */}
                      {isCorrect && (
                        <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                          <p>Time: {((Date.now() - questionStartTime) / 1000).toFixed(1)}s</p>
                          {streak > 1 && <p>Streak: {streak} 🔥</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
                    >
                      {currentFollowUp >= 0 && currentFollowUp + 1 < (currentQuestion?.followUpQuestions?.length || 0)
                        ? '→ Next Follow-up'
                        : currentQuestion?.followUpQuestions && currentFollowUp < 0
                          ? '→ Continue to Follow-ups'
                          : '→ Next Question'
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Code Panel */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="font-semibold text-gray-900 dark:text-white">Code Reference</h3>
            </div>
            <div className="p-1">
              {currentQuestion?.code && (
                <SyntaxHighlighter
                  language="python"
                  style={isDarkMode ? vscDarkPlus : vs}
                  customStyle={{
                    background: isDarkMode ? 'rgb(30, 41, 59)' : 'rgb(243, 244, 246)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5rem',
                    margin: 0
                  }}
                  showLineNumbers={true}
                >
                  {currentQuestion.code}
                </SyntaxHighlighter>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DPMultipleChoiceGame;

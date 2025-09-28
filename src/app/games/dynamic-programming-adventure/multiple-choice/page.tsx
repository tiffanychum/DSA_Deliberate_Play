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
    },
    // More Comprehensive Digit DP Questions
    {
      id: 16,
      topic: "Digit DP",
      functionName: "countDigitOne",
      difficulty: "Hard",
      question: "What is the key insight for counting digit '1' occurrences from 1 to N using Digit DP?",
      code: `def countDigitOne(n):
    if n <= 0:
        return 0
    
    digits = []
    temp = n
    while temp:
        digits.append(temp % 10)
        temp //= 10
    digits.reverse()
    
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, count):
        if pos == length:
            return count
        
        if (pos, tight, count) in memo:
            return memo[(pos, tight, count)]
        
        limit = digits[pos] if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_count = count + (1 if digit == 1 else 0)
            result += dp(pos + 1, new_tight, new_count)
        
        memo[(pos, tight, count)] = result
        return result
    
    return dp(0, True, 0)`,
      options: [
        "Count how many times digit '1' appears in each position",
        "Use mathematical formula to calculate directly", 
        "Count all numbers containing digit '1'",
        "Sum up digit '1' occurrences across all valid numbers"
      ],
      correctAnswer: 3,
      hint: "Think about what we're accumulating - we want the total count of '1' digits, not the count of numbers.",
      explanation: "We sum up the total occurrences of digit '1' across all numbers from 1 to N. Each time we place a '1', we increment our count, and the final result is the sum of all these counts.",
      followUpQuestions: [
        {
          question: "Why do we pass 'count' as a parameter instead of using a global variable?",
          options: [
            "For memoization to work correctly with different count states",
            "To avoid global variable side effects",
            "For better performance",
            "It's just a coding preference"
          ],
          correctAnswer: 0,
          explanation: "We need 'count' as a state parameter because different paths can have different counts at the same position, and memoization needs to distinguish between these different states."
        },
        {
          question: "What would change if we wanted to count digit '0' instead?",
          options: [
            "Nothing, just change the condition to digit == 0",
            "We need to handle leading zeros differently",
            "We need to add a 'started' parameter to avoid counting leading zeros",
            "We need to change the base case"
          ],
          correctAnswer: 2,
          explanation: "For counting '0', we need a 'started' parameter because we don't want to count leading zeros in numbers like 007 (which is just 7)."
        }
      ]
    },
    {
      id: 17,
      topic: "Digit DP",
      functionName: "countNumbersWithUniqueDigits",
      difficulty: "Medium",
      question: "What's the mathematical insight behind counting numbers with unique digits?",
      code: `def countNumbersWithUniqueDigits(n):
    if n == 0:
        return 1
    
    # Mathematical approach
    result = 1  # for number 0
    
    for i in range(1, n + 1):
        if i == 1:
            result += 9  # 1-9
        else:
            # First digit: 9 choices (1-9)
            # Second digit: 9 choices (0-9 except first)
            # Third digit: 8 choices (0-9 except first two)
            # ...
            count = 9
            for j in range(i - 1):
                count *= (9 - j)
            result += count
    
    return result

# Alternative: Digit DP approach
def countNumbersWithUniqueDigitsDP(n):
    memo = {}
    
    def dp(pos, tight, started, mask):
        if pos == n:
            return 1 if started else 0
        
        if (pos, tight, started, mask) in memo:
            return memo[(pos, tight, started, mask)]
        
        limit = 9 if not tight else 9  # No upper bound in this problem
        result = 0
        
        for digit in range(0, limit + 1):
            if started and (mask & (1 << digit)):
                continue  # Digit already used
            
            new_started = started or digit > 0
            new_mask = mask | (1 << digit) if new_started else mask
            
            result += dp(pos + 1, False, new_started, new_mask)
        
        memo[(pos, tight, started, mask)] = result
        return result
    
    return dp(0, False, False, 0)`,
      options: [
        "Use permutations: P(10,k) for k-digit numbers",
        "For k digits: first digit has 9 choices, then (10-i) choices for position i",
        "Count all possible combinations of digits",
        "Use inclusion-exclusion principle"
      ],
      correctAnswer: 1,
      hint: "Think about how many choices you have for each position when digits must be unique.",
      explanation: "For k-digit numbers with unique digits: first digit has 9 choices (1-9), second has 9 choices (0-9 except first), third has 8 choices, and so on. This gives us 9 × 9 × 8 × 7 × ... for k digits.",
      followUpQuestions: [
        {
          question: "Why is the mathematical approach more efficient than Digit DP here?",
          options: [
            "No memoization overhead",
            "Direct formula calculation in O(n) time",
            "No need to track used digits",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "The mathematical approach is O(n) with no memoization overhead, while Digit DP has exponential state space due to the mask parameter."
        }
      ]
    },
    {
      id: 18,
      topic: "Digit DP",
      functionName: "countSteppingNumbers",
      difficulty: "Hard",
      question: "What is the missing condition for stepping numbers (adjacent digits differ by 1)?",
      code: `def countSteppingNumbers(low, high):
    def count_up_to(num):
        if num < 0:
            return 0
        
        digits = str(num)
        n = len(digits)
        memo = {}
        
        def dp(pos, tight, started, prev_digit):
            if pos == n:
                return 1 if started else 0
            
            if (pos, tight, started, prev_digit) in memo:
                return memo[(pos, tight, started, prev_digit)]
            
            limit = int(digits[pos]) if tight else 9
            result = 0
            
            for digit in range(0, limit + 1):
                # MISSING CONDITION HERE
                if started and prev_digit != -1 and abs(digit - prev_digit) != 1:
                    continue
                
                new_tight = tight and (digit == limit)
                new_started = started or digit > 0
                new_prev = digit if new_started else -1
                
                result += dp(pos + 1, new_tight, new_started, new_prev)
            
            memo[(pos, tight, started, prev_digit)] = result
            return result
        
        return dp(0, True, False, -1)
    
    return count_up_to(high) - count_up_to(low - 1)`,
      options: [
        "Check if current digit is adjacent to previous digit",
        "Check if absolute difference between digits is exactly 1",
        "Skip if not a stepping number pattern",
        "The condition is already complete"
      ],
      correctAnswer: 3,
      hint: "Look carefully at the existing condition - what does it check?",
      explanation: "The condition is already complete! It checks if we've started placing digits, have a previous digit, and the absolute difference is NOT 1 - if so, we skip this digit. This ensures only stepping numbers are counted.",
      followUpQuestions: [
        {
          question: "Why do we use prev_digit = -1 initially?",
          options: [
            "To indicate no previous digit has been placed",
            "To handle the first digit specially",
            "To avoid checking stepping condition for first digit",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We use -1 to indicate no previous digit exists yet. This allows the first digit to be any value (1-9) without stepping constraints."
        },
        {
          question: "What makes this different from regular digit constraints?",
          options: [
            "We need to track the previous digit",
            "The constraint depends on adjacent positions",
            "We need state for the last placed digit",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Stepping numbers require tracking the previous digit because the constraint (difference = 1) depends on the relationship between adjacent digits."
        }
      ]
    },
    {
      id: 19,
      topic: "Digit DP",
      functionName: "countNumbersWithEvenDigitSum",
      difficulty: "Medium",
      question: "What's the key insight for counting numbers with even digit sum using Digit DP?",
      code: `def countNumbersWithEvenDigitSum(n):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, sum_mod):
        if pos == length:
            return 1 if started and sum_mod == 0 else 0
        
        if (pos, tight, started, sum_mod) in memo:
            return memo[(pos, tight, started, sum_mod)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            new_sum_mod = (sum_mod + digit) % 2
            
            result += dp(pos + 1, new_tight, new_started, new_sum_mod)
        
        memo[(pos, tight, started, sum_mod)] = result
        return result
    
    return dp(0, True, False, 0)`,
      options: [
        "Track sum modulo 2 to determine even/odd",
        "Count all numbers then divide by 2",
        "Use mathematical formula for even sums",
        "Generate all numbers and check sum parity"
      ],
      correctAnswer: 0,
      hint: "We only care about whether the sum is even or odd, not the actual sum value.",
      explanation: "We track sum_mod = (sum of digits) % 2. When sum_mod = 0, the digit sum is even. This reduces our state space significantly since we only need to track 0 or 1 instead of the full sum.",
      followUpQuestions: [
        {
          question: "What's the space complexity of this DP approach?",
          options: [
            "O(n) - only position matters",
            "O(n * 2) - position and sum_mod",
            "O(n * 2 * 2) - position, sum_mod, and started",
            "O(n * 2 * 2 * 2) - position, sum_mod, started, and tight"
          ],
          correctAnswer: 3,
          explanation: "We have 4 state variables: position (n values), sum_mod (2 values), started (2 values), and tight (2 values), giving us O(n * 2 * 2 * 2) = O(8n) space."
        }
      ]
    },
    {
      id: 20,
      topic: "Digit DP",
      functionName: "countNumbersDivisibleByK",
      difficulty: "Hard",
      question: "How do we count numbers from 1 to N that are divisible by K using Digit DP?",
      code: `def countNumbersDivisibleByK(n, k):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, remainder):
        if pos == length:
            return 1 if started and remainder == 0 else 0
        
        if (pos, tight, started, remainder) in memo:
            return memo[(pos, tight, started, remainder)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            
            # Build number: current_number * 10 + digit
            # remainder of (current_number * 10 + digit) mod k
            # = ((remainder * 10) + digit) mod k
            new_remainder = (remainder * 10 + digit) % k
            
            result += dp(pos + 1, new_tight, new_started, new_remainder)
        
        memo[(pos, tight, started, remainder)] = result
        return result
    
    return dp(0, True, False, 0)`,
      options: [
        "Track remainder when building the number digit by digit",
        "Use mathematical formula n // k",
        "Generate all numbers and check divisibility",
        "Use modular arithmetic properties"
      ],
      correctAnswer: 0,
      hint: "Think about how the remainder changes as we add each digit to build the number.",
      explanation: "We track the remainder of the number formed so far. When adding a digit d to a number with remainder r, the new remainder is ((r * 10) + d) % k. Numbers with final remainder 0 are divisible by k.",
      followUpQuestions: [
        {
          question: "Why do we multiply remainder by 10 before adding the digit?",
          options: [
            "Because we're building the number from left to right",
            "To shift existing digits one position left",
            "Both - adding digit d to number with remainder r gives ((r*10)+d) mod k",
            "It's just a mathematical trick"
          ],
          correctAnswer: 2,
          explanation: "When we add digit d to the right of a number, we're essentially doing number * 10 + d. So the remainder becomes ((old_remainder * 10) + d) % k."
        },
        {
          question: "What's the advantage of Digit DP over the simple formula n // k?",
          options: [
            "Digit DP can handle additional constraints on digits",
            "Digit DP is more general and extensible",
            "Simple formula n // k only works for this specific problem",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "While n // k works for this simple case, Digit DP can easily handle additional constraints like 'divisible by k AND contains only certain digits' or 'divisible by k AND has unique digits'."
        }
      ]
    },
    {
      id: 21,
      topic: "Digit DP",
      functionName: "countNumbersWithKDistinctDigits",
      difficulty: "Hard",
      question: "What's the missing line for counting numbers with exactly K distinct digits?",
      code: `def countNumbersWithKDistinctDigits(n, k):
    if k > 10 or k == 0:
        return 0
    
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, mask, distinct_count):
        if pos == length:
            return 1 if started and distinct_count == k else 0
        
        if (pos, tight, started, mask, distinct_count) in memo:
            return memo[(pos, tight, started, mask, distinct_count)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            
            if new_started:
                is_new_digit = not (mask & (1 << digit))
                new_mask = mask | (1 << digit)
                # MISSING LINE HERE - what should new_distinct_count be?
                new_distinct_count = distinct_count + (1 if is_new_digit else 0)
            else:
                new_mask = mask
                new_distinct_count = distinct_count
            
            # Early pruning
            remaining_positions = length - pos - 1
            if new_distinct_count + remaining_positions < k:
                continue  # Can't reach k distinct digits
            if new_distinct_count > k:
                continue  # Already exceeded k distinct digits
            
            result += dp(pos + 1, new_tight, new_started, new_mask, new_distinct_count)
        
        memo[(pos, tight, started, mask, distinct_count)] = result
        return result
    
    return dp(0, True, False, 0, 0)`,
      options: [
        "new_distinct_count = distinct_count + 1",
        "new_distinct_count = distinct_count + (1 if is_new_digit else 0)",
        "new_distinct_count = bin(new_mask).count('1')",
        "new_distinct_count = distinct_count"
      ],
      correctAnswer: 1,
      hint: "We only increment the count when we encounter a digit we haven't used before.",
      explanation: "We increment distinct_count only when is_new_digit is True (the digit hasn't been used before). If the digit is already in our mask, the distinct count stays the same.",
      followUpQuestions: [
        {
          question: "What's the purpose of the early pruning conditions?",
          options: [
            "To avoid exploring impossible states",
            "To optimize performance by cutting branches early",
            "To ensure we can still reach exactly k distinct digits",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Early pruning cuts branches that can't possibly lead to exactly k distinct digits: if current + remaining < k, we can't reach k; if current > k, we've already exceeded k."
        }
      ]
    },
    {
      id: 22,
      topic: "Digit DP",
      functionName: "digitDP_Template",
      difficulty: "Medium",
      question: "What are the essential components of a Digit DP template?",
      code: `def digitDP_Template(N, additional_constraints):
    """
    Generic Digit DP template for counting numbers <= N with constraints
    """
    digits = [int(d) for d in str(N)]
    n = len(digits)
    memo = {}
    
    def dp(pos, tight, started, *constraint_states):
        # Base case
        if pos == n:
            return 1 if started else 0  # Or check final constraint
        
        # Memoization key
        state = (pos, tight, started, *constraint_states)
        if state in memo:
            return memo[state]
        
        # Determine digit range
        limit = digits[pos] if tight else 9
        result = 0
        
        # Try each possible digit
        for digit in range(0, limit + 1):
            # Update states
            new_tight = tight and (digit == limit)
            new_started = started or (digit > 0)
            
            # Update constraint states based on current digit
            new_constraint_states = update_constraints(digit, constraint_states, new_started)
            
            # Pruning (optional optimization)
            if is_valid_state(pos, digit, new_constraint_states):
                result += dp(pos + 1, new_tight, new_started, *new_constraint_states)
        
        memo[state] = result
        return result
    
    return dp(0, True, False, *initial_constraint_states)`,
      options: [
        "Position, tight constraint, started flag, and problem-specific states",
        "Just position and tight constraint",
        "Position, tight, and memoization",
        "Depends on the specific problem"
      ],
      correctAnswer: 0,
      hint: "Think about what information we need to track in every Digit DP problem.",
      explanation: "Essential components are: (1) pos - current position, (2) tight - whether we're still bounded by N, (3) started - whether we've placed a non-zero digit, and (4) problem-specific constraint states (like sum, mask, etc.).",
      followUpQuestions: [
        {
          question: "When can we omit the 'started' parameter?",
          options: [
            "When we don't care about leading zeros",
            "When counting all numbers including those with leading zeros",
            "When the constraint doesn't depend on whether number has started",
            "Never, it's always needed"
          ],
          correctAnswer: 0,
          explanation: "We can omit 'started' when leading zeros don't affect our constraint (e.g., when we want to count digit occurrences including leading zeros, or when we're only counting numbers of a fixed length)."
        }
      ]
    },
    // Missing Lines Questions for Digit DP Mastery
    {
      id: 23,
      topic: "Digit DP",
      functionName: "sumOfDigitsInRange",
      difficulty: "Hard",
      question: "What's the missing line to calculate the sum of all digits in numbers from 1 to N?",
      code: `def sumOfDigitsInRange(n):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, digit_sum):
        if pos == length:
            return digit_sum if started else 0
        
        if (pos, tight, started, digit_sum) in memo:
            return memo[(pos, tight, started, digit_sum)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            # MISSING LINE HERE - how to update digit_sum?
            new_digit_sum = digit_sum + digit if new_started else digit_sum
            
            result += dp(pos + 1, new_tight, new_started, new_digit_sum)
        
        memo[(pos, tight, started, digit_sum)] = result
        return result
    
    return dp(0, True, False, 0)`,
      options: [
        "new_digit_sum = digit_sum + digit if new_started else digit_sum",
        "new_digit_sum = digit_sum + digit",
        "new_digit_sum = digit_sum + (digit if started else 0)",
        "new_digit_sum = digit_sum"
      ],
      correctAnswer: 0,
      hint: "We should only add the digit to our sum if we've actually started forming a number (no leading zeros).",
      explanation: "We use 'digit_sum + digit if new_started else digit_sum' because we only want to count digits from actual numbers, not leading zeros. If we haven't started (leading zeros), the digit doesn't contribute to any real number.",
      followUpQuestions: [
        {
          question: "Why not always add the digit regardless of 'started' status?",
          options: [
            "Because leading zeros aren't part of the actual number",
            "Because it would count digits from numbers like 007 instead of just 7",
            "Because we want sum of digits in actual numbers, not digit patterns",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Leading zeros aren't part of actual numbers. We want to sum digits from real numbers (1, 2, 3, ..., N), not count digits from padded representations like 007."
        }
      ]
    },
    {
      id: 24,
      topic: "Digit DP",
      functionName: "countNumbersWithDigitProduct",
      difficulty: "Hard",
      question: "What's the missing line for counting numbers whose digit product equals P?",
      code: `def countNumbersWithDigitProduct(n, p):
    if p == 0:
        # Special case: count numbers containing digit 0
        return countNumbersContaining0(n)
    
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, product):
        if pos == length:
            return 1 if started and product == p else 0
        
        if (pos, tight, started, product) in memo:
            return memo[(pos, tight, started, product)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            
            # MISSING LINE HERE - how to update product?
            if new_started:
                new_product = product * digit if digit != 0 else 0
            else:
                new_product = product
            
            # Early termination: if product becomes 0 and p != 0, skip
            if new_product == 0 and p != 0 and new_started:
                continue
                
            result += dp(pos + 1, new_tight, new_started, new_product)
        
        memo[(pos, tight, started, product)] = result
        return result
    
    return dp(0, True, False, 1)`,
      options: [
        "new_product = product * digit if digit != 0 else 0",
        "new_product = product * digit",
        "new_product = product * max(digit, 1)",
        "new_product = product + digit"
      ],
      correctAnswer: 0,
      hint: "What happens to the product when we encounter a zero digit?",
      explanation: "We use 'product * digit if digit != 0 else 0' because any number containing a zero digit will have a digit product of 0. Once we multiply by 0, the entire product becomes 0.",
      followUpQuestions: [
        {
          question: "Why do we initialize the product to 1 instead of 0?",
          options: [
            "Because 1 is the multiplicative identity",
            "Because we haven't started multiplying digits yet",
            "Because empty product should be 1",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We start with product = 1 because it's the multiplicative identity. This allows the first digit to properly set the product value, and represents the 'empty product' before we start."
        }
      ]
    },
    {
      id: 25,
      topic: "Digit DP",
      functionName: "countAscendingNumbers",
      difficulty: "Medium",
      question: "What's the missing condition for counting numbers with non-decreasing digits?",
      code: `def countAscendingNumbers(n):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, last_digit):
        if pos == length:
            return 1 if started else 0
        
        if (pos, tight, started, last_digit) in memo:
            return memo[(pos, tight, started, last_digit)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            # MISSING CONDITION HERE - when is digit valid?
            if started and digit < last_digit:
                continue
            
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            new_last_digit = digit if new_started else last_digit
            
            result += dp(pos + 1, new_tight, new_started, new_last_digit)
        
        memo[(pos, tight, started, last_digit)] = result
        return result
    
    return dp(0, True, False, 0)`,
      options: [
        "if started and digit < last_digit:",
        "if digit < last_digit:",
        "if started and digit <= last_digit:",
        "if digit > last_digit:"
      ],
      correctAnswer: 0,
      hint: "We want non-decreasing digits, so each digit should be >= the previous digit. When should we skip?",
      explanation: "We use 'if started and digit < last_digit: continue' because we want non-decreasing digits. We only check this after we've started (to avoid issues with leading zeros), and we skip when the current digit is smaller than the last digit.",
      followUpQuestions: [
        {
          question: "Why do we check 'started' before comparing digits?",
          options: [
            "To handle leading zeros properly",
            "Because last_digit is meaningless before we start",
            "To avoid false constraints on the first digit",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We check 'started' because before we place the first non-zero digit, 'last_digit' doesn't represent a real constraint. Leading zeros don't count as actual digits in the number."
        }
      ]
    },
    {
      id: 26,
      topic: "Digit DP",
      functionName: "countBalancedNumbers",
      difficulty: "Hard",
      question: "What's the missing line for counting balanced numbers (sum of even-positioned digits = sum of odd-positioned digits)?",
      code: `def countBalancedNumbers(n):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, balance):
        if pos == length:
            return 1 if started and balance == 0 else 0
        
        if (pos, tight, started, balance) in memo:
            return memo[(pos, tight, started, balance)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            
            # MISSING LINE HERE - how to update balance?
            if new_started:
                # Even positions (0, 2, 4...) add, odd positions (1, 3, 5...) subtract
                new_balance = balance + digit if pos % 2 == 0 else balance - digit
            else:
                new_balance = balance
            
            result += dp(pos + 1, new_tight, new_started, new_balance)
        
        memo[(pos, tight, started, balance)] = result
        return result
    
    return dp(0, True, False, 0)`,
      options: [
        "new_balance = balance + digit if pos % 2 == 0 else balance - digit",
        "new_balance = balance + digit if pos % 2 == 1 else balance - digit",
        "new_balance = balance + (digit if pos % 2 == 0 else -digit)",
        "Both A and C are correct"
      ],
      correctAnswer: 3,
      hint: "Both expressions achieve the same result - adding for even positions and subtracting for odd positions.",
      explanation: "Both options A and C are mathematically equivalent. They both add the digit for even positions (0, 2, 4...) and subtract for odd positions (1, 3, 5...), which maintains the balance between even and odd positioned digits.",
      followUpQuestions: [
        {
          question: "Why do we only update balance when 'new_started' is true?",
          options: [
            "Because leading zeros don't contribute to the actual number",
            "Because we don't want to count digit positions that don't exist",
            "Because balance should only track real digits in the number",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We only update balance after starting because leading zeros aren't part of the actual number. We want to balance real digit positions, not phantom positions from leading zeros."
        }
      ]
    },
    {
      id: 27,
      topic: "Digit DP",
      functionName: "countNumbersWithMaxDigit",
      difficulty: "Medium",
      question: "What's the missing line for counting numbers where the maximum digit is exactly K?",
      code: `def countNumbersWithMaxDigit(n, k):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, max_digit, has_k):
        if pos == length:
            return 1 if started and has_k and max_digit <= k else 0
        
        if (pos, tight, started, max_digit, has_k) in memo:
            return memo[(pos, tight, started, max_digit, has_k)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            if digit > k:  # Skip digits larger than k
                continue
                
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            
            # MISSING LINE HERE - how to update max_digit and has_k?
            if new_started:
                new_max_digit = max(max_digit, digit)
                new_has_k = has_k or (digit == k)
            else:
                new_max_digit = max_digit
                new_has_k = has_k
            
            result += dp(pos + 1, new_tight, new_started, new_max_digit, new_has_k)
        
        memo[(pos, tight, started, max_digit, has_k)] = result
        return result
    
    return dp(0, True, False, 0, False)`,
      options: [
        "new_max_digit = max(max_digit, digit); new_has_k = has_k or (digit == k)",
        "new_max_digit = digit; new_has_k = (digit == k)",
        "new_max_digit = max(max_digit, digit); new_has_k = (digit == k)",
        "new_max_digit = digit; new_has_k = has_k or (digit == k)"
      ],
      correctAnswer: 0,
      hint: "We need to track both the maximum digit seen so far AND whether we've seen digit k specifically.",
      explanation: "We use 'max(max_digit, digit)' to maintain the maximum digit seen so far, and 'has_k or (digit == k)' to track whether we've encountered digit k at least once. Both conditions are needed to ensure the maximum digit is exactly k.",
      followUpQuestions: [
        {
          question: "Why do we need both max_digit and has_k variables?",
          options: [
            "max_digit tracks the largest digit, has_k ensures k appears at least once",
            "We need to distinguish between 'max digit ≤ k' and 'max digit = k'",
            "has_k ensures k actually appears in the number",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We need both because max_digit ≤ k only ensures no digit exceeds k, but has_k ensures that k actually appears in the number, making the maximum exactly k."
        }
      ]
    },
    {
      id: 28,
      topic: "Digit DP",
      functionName: "countNumbersModuloM",
      difficulty: "Hard",
      question: "What's the missing line for counting numbers ≤ N where (number mod M) = R?",
      code: `def countNumbersModuloM(n, m, r):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, remainder):
        if pos == length:
            return 1 if started and remainder == r else 0
        
        if (pos, tight, started, remainder) in memo:
            return memo[(pos, tight, started, remainder)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            
            # MISSING LINE HERE - how to update remainder?
            if new_started:
                new_remainder = (remainder * 10 + digit) % m
            else:
                new_remainder = remainder
            
            result += dp(pos + 1, new_tight, new_started, new_remainder)
        
        memo[(pos, tight, started, remainder)] = result
        return result
    
    return dp(0, True, False, 0)`,
      options: [
        "new_remainder = (remainder * 10 + digit) % m",
        "new_remainder = (remainder + digit) % m",
        "new_remainder = remainder * 10 % m + digit % m",
        "new_remainder = (remainder * digit) % m"
      ],
      correctAnswer: 0,
      hint: "Think about how we build a number digit by digit from left to right and how modular arithmetic works.",
      explanation: "We use '(remainder * 10 + digit) % m' because when we add a digit to the right of a number, we're doing number * 10 + digit. The modular arithmetic property (a * b + c) mod m = ((a * b) mod m + c) mod m allows us to track just the remainder.",
      followUpQuestions: [
        {
          question: "Why do we multiply by 10 before adding the digit?",
          options: [
            "Because we're building the number from left to right",
            "Because adding digit d to number n gives n*10 + d",
            "Because each existing digit shifts one position left",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "When we append a digit to the right of a number, we're essentially doing number * 10 + digit. This shifts all existing digits one position to the left and adds the new digit in the units place."
        }
      ]
    },
    {
      id: 29,
      topic: "Digit DP",
      functionName: "countPalindromeDigits",
      difficulty: "Hard",
      question: "What's the missing condition for counting palindromic numbers using Digit DP?",
      code: `def countPalindromeDigits(n):
    digits = str(n)
    length = len(digits)
    memo = {}
    
    def dp(pos, tight, started, first_half):
        mid = length // 2
        
        if pos == length:
            # Check if the formed number is a valid palindrome
            if not started:
                return 0
            
            # For odd length, we've built: first_half + middle + reverse(first_half)
            # For even length, we've built: first_half + reverse(first_half)
            palindrome_str = first_half
            if length % 2 == 1:
                palindrome_str += first_half[mid:]  # Include middle digit
            palindrome_str += first_half[:mid][::-1]  # Add reverse of first half
            
            return 1 if int(palindrome_str) <= n else 0
        
        if (pos, tight, started, first_half) in memo:
            return memo[(pos, tight, started, first_half)]
        
        # MISSING CONDITION HERE - when do we process digits?
        if pos <= mid:
            limit = int(digits[pos]) if tight else 9
            result = 0
            
            for digit in range(0, limit + 1):
                new_tight = tight and (digit == limit)
                new_started = started or digit > 0
                new_first_half = first_half + str(digit) if new_started else first_half
                
                result += dp(pos + 1, new_tight, new_started, new_first_half)
            
            memo[(pos, tight, started, first_half)] = result
            return result
        else:
            # For palindromes, second half is determined by first half
            return dp(length, tight, started, first_half)`,
      options: [
        "if pos <= mid:",
        "if pos < mid:",
        "if pos <= length // 2:",
        "Both A and C are correct"
      ],
      correctAnswer: 3,
      hint: "For palindromes, we only need to decide the first half. What positions should we process?",
      explanation: "Both 'pos <= mid' and 'pos <= length // 2' are equivalent since mid = length // 2. For palindromes, we only process positions up to and including the middle (for odd lengths) or up to the middle (for even lengths). The second half is automatically determined by mirroring.",
      followUpQuestions: [
        {
          question: "Why don't we process all positions in palindrome DP?",
          options: [
            "Because the second half mirrors the first half",
            "Because palindromes are determined by their first half only",
            "Because it reduces the state space significantly",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "In palindromes, once we decide the first half, the second half is completely determined by mirroring. This reduces our decision space and makes the DP more efficient."
        }
      ]
    },
    {
      id: 30,
      topic: "Digit DP",
      functionName: "countNumbersWithDigitConstraints",
      difficulty: "Hard",
      question: "What's the missing line for counting numbers where digit at position i must be ≥ constraints[i]?",
      code: `def countNumbersWithDigitConstraints(n, constraints):
    digits = str(n)
    length = len(digits)
    
    # Pad constraints to match length
    constraints = constraints + [0] * (length - len(constraints))
    memo = {}
    
    def dp(pos, tight, started):
        if pos == length:
            return 1 if started else 0
        
        if (pos, tight, started) in memo:
            return memo[(pos, tight, started)]
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for digit in range(0, limit + 1):
            # MISSING LINE HERE - when is digit valid based on constraints?
            if started and digit < constraints[pos]:
                continue
            
            new_tight = tight and (digit == limit)
            new_started = started or digit > 0
            
            result += dp(pos + 1, new_tight, new_started)
        
        memo[(pos, tight, started)] = result
        return result
    
    return dp(0, True, False)`,
      options: [
        "if started and digit < constraints[pos]:",
        "if digit < constraints[pos]:",
        "if new_started and digit < constraints[pos]:",
        "if pos < len(constraints) and digit < constraints[pos]:"
      ],
      correctAnswer: 0,
      hint: "We should only apply digit constraints after we've started forming the actual number.",
      explanation: "We use 'if started and digit < constraints[pos]: continue' because constraints should only apply to actual digit positions in the number, not to leading zeros. Before we start, we haven't placed any real digits yet.",
      followUpQuestions: [
        {
          question: "Why do we pad constraints with zeros?",
          options: [
            "To handle cases where n has more digits than constraints",
            "To ensure constraints[pos] is always valid",
            "To set no constraint (≥ 0) for extra positions",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Padding with zeros ensures that positions beyond the original constraints have no real constraint (since all digits ≥ 0), and prevents index out of bounds errors."
        }
      ]
    },
    // Additional Tree DP Questions
    {
      id: 31,
      topic: "Tree DP",
      functionName: "diameter_of_binary_tree",
      difficulty: "Medium",
      question: "What's the missing line in calculating the diameter of a binary tree?",
      code: `def diameterOfBinaryTree(root):
    max_diameter = 0
    
    def depth(node):
        nonlocal max_diameter
        if not node:
            return 0
        
        left_depth = depth(node.left)
        right_depth = depth(node.right)
        
        # MISSING LINE HERE - how to update max_diameter?
        max_diameter = max(max_diameter, left_depth + right_depth)
        
        return 1 + max(left_depth, right_depth)
    
    depth(root)
    return max_diameter`,
      options: [
        "max_diameter = max(max_diameter, left_depth + right_depth)",
        "max_diameter = max(max_diameter, left_depth + right_depth + 1)",
        "max_diameter = left_depth + right_depth",
        "max_diameter = max(left_depth, right_depth)"
      ],
      correctAnswer: 0,
      hint: "The diameter is the longest path between any two nodes, which passes through the current node.",
      explanation: "The diameter passing through the current node is left_depth + right_depth (the sum of depths from both subtrees). We take the maximum of this and previously computed diameters.",
      followUpQuestions: [
        {
          question: "Why don't we add 1 to left_depth + right_depth?",
          options: [
            "Because we're counting edges, not nodes",
            "Because depth already includes the current node",
            "Because diameter is measured in edges between nodes",
            "All of the above"
          ],
          correctAnswer: 2,
          explanation: "Diameter is typically measured as the number of edges in the longest path. left_depth + right_depth gives us the number of edges from left subtree + edges from right subtree."
        }
      ]
    },
    {
      id: 32,
      topic: "Tree DP",
      functionName: "tree_distance_sum",
      difficulty: "Hard",
      question: "In calculating sum of distances from each node to all other nodes, what's the key insight for optimization?",
      code: `def sumOfDistancesInTree(n, edges):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    count = [1] * n  # count[i] = number of nodes in subtree rooted at i
    ans = [0] * n    # ans[i] = sum of distances from node i to all others
    
    def dfs(node, parent):
        for child in graph[node]:
            if child != parent:
                dfs(child, node)
                count[node] += count[child]
                ans[node] += ans[child] + count[child]
    
    def dfs2(node, parent):
        for child in graph[node]:
            if child != parent:
                # Re-rooting: moving root from node to child
                ans[child] = ans[node] - count[child] + (n - count[child])
                dfs2(child, node)
    
    dfs(0, -1)
    dfs2(0, -1)
    return ans`,
      options: [
        "Use re-rooting technique to avoid recalculating from scratch for each node",
        "Calculate distances using BFS from each node",
        "Use dynamic programming on tree structure",
        "Precompute all pairwise distances"
      ],
      correctAnswer: 0,
      hint: "Think about how to efficiently transition from one root to another.",
      explanation: "Re-rooting technique allows us to calculate the answer for all nodes in O(n) time. Once we know the answer for one root, we can derive answers for adjacent nodes using the relationship between subtree sizes.",
      followUpQuestions: [
        {
          question: "What does the re-rooting formula ans[child] = ans[node] - count[child] + (n - count[child]) represent?",
          options: [
            "Remove child subtree contribution, add contribution from moving to child",
            "Subtract distances within child subtree, add distances from other nodes",
            "Account for changing perspective from parent to child as root",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "When we move root from parent to child: subtract count[child] (nodes in child subtree get 1 unit closer), add (n - count[child]) (nodes outside child subtree get 1 unit farther)."
        }
      ]
    },
    {
      id: 33,
      topic: "Tree DP",
      functionName: "binary_tree_cameras",
      difficulty: "Hard",
      question: "What are the three states in the tree DP solution for minimum cameras to monitor all nodes?",
      code: `def minCameraCover(root):
    # State definitions:
    # 0: Node is not monitored and has no camera
    # 1: Node is monitored but has no camera  
    # 2: Node has a camera
    
    def dfs(node):
        if not node:
            return (0, 0, float('inf'))  # (state0, state1, state2)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Current node not monitored, no camera
        state0 = left[1] + right[1]
        
        # Current node monitored, no camera (children must have cameras)
        state1 = min(left[2] + min(right[1], right[2]),
                    right[2] + min(left[1], left[2]))
        
        # Current node has camera (can monitor itself and children)
        state2 = 1 + min(left[0], left[1], left[2]) + min(right[0], right[1], right[2])
        
        return (state0, state1, state2)
    
    result = dfs(root)
    return min(result[1], result[2])  # Root must be monitored`,
      options: [
        "Not monitored/no camera, Monitored/no camera, Has camera",
        "Covered, Partially covered, Camera placed",
        "Safe, Unsafe, Guarded",
        "Watched, Unwatched, Watcher"
      ],
      correctAnswer: 0,
      hint: "Think about the monitoring status and camera placement for each node.",
      explanation: "The three states represent: (0) node not monitored and no camera, (1) node is monitored but has no camera, (2) node has a camera. This captures all possible states for optimal camera placement.",
      followUpQuestions: [
        {
          question: "Why can't the root be in state 0 (not monitored)?",
          options: [
            "Because the root must be monitored for the solution to be valid",
            "Because there's no parent to monitor the root",
            "Because we need to cover all nodes",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "The root cannot be in state 0 because it would be unmonitored and there's no parent node that could monitor it, violating the constraint that all nodes must be monitored."
        }
      ]
    },
    // Additional 2D Grid DP Questions
    {
      id: 34,
      topic: "2D Grid DP",
      functionName: "dungeon_game",
      difficulty: "Hard",
      question: "What's the missing line in the dungeon game DP solution?",
      code: `def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    
    # dp[i][j] = minimum health needed at (i,j) to reach princess
    dp = [[float('inf')] * n for _ in range(m)]
    
    # Base case: at princess location
    dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1])
    
    # Fill last row
    for j in range(n-2, -1, -1):
        dp[m-1][j] = max(1, dp[m-1][j+1] - dungeon[m-1][j])
    
    # Fill last column  
    for i in range(m-2, -1, -1):
        dp[i][n-1] = max(1, dp[i+1][n-1] - dungeon[i][n-1])
    
    # Fill rest of the grid
    for i in range(m-2, -1, -1):
        for j in range(n-2, -1, -1):
            # MISSING LINE HERE
            min_health_next = min(dp[i+1][j], dp[i][j+1])
            dp[i][j] = max(1, min_health_next - dungeon[i][j])
    
    return dp[0][0]`,
      options: [
        "min_health_next = min(dp[i+1][j], dp[i][j+1])",
        "min_health_next = max(dp[i+1][j], dp[i][j+1])",
        "min_health_next = dp[i+1][j] + dp[i][j+1]",
        "min_health_next = (dp[i+1][j] + dp[i][j+1]) / 2"
      ],
      correctAnswer: 0,
      hint: "We want to choose the path that requires minimum health from the current position.",
      explanation: "We take the minimum of the two possible next positions because we want the path that requires the least health. This represents the optimal choice from the current position.",
      followUpQuestions: [
        {
          question: "Why do we process the grid from bottom-right to top-left?",
          options: [
            "Because we need to know future health requirements to determine current needs",
            "Because we're working backwards from the goal",
            "Because DP dependencies flow from destination to source",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We process backwards because each cell's minimum health depends on the future path. We need to know what health is required at the next step to determine what's needed at the current step."
        }
      ]
    },
    {
      id: 35,
      topic: "2D Grid DP",
      functionName: "largest_square",
      difficulty: "Medium",
      question: "What's the recurrence relation for finding the largest square of 1s in a binary matrix?",
      code: `def maximalSquare(matrix):
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * n for _ in range(m)]
    max_side = 0
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    dp[i][j] = 1
                else:
                    # RECURRENCE RELATION HERE
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                
                max_side = max(max_side, dp[i][j])
    
    return max_side * max_side`,
      options: [
        "dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1",
        "dp[i][j] = max(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1",
        "dp[i][j] = dp[i-1][j] + dp[i][j-1] + dp[i-1][j-1] + 1",
        "dp[i][j] = (dp[i-1][j] + dp[i][j-1] + dp[i-1][j-1]) / 3 + 1"
      ],
      correctAnswer: 0,
      hint: "Think about what limits the size of a square ending at position (i,j).",
      explanation: "The size of the largest square ending at (i,j) is limited by the smallest of the three adjacent squares: top, left, and top-left diagonal. We take the minimum and add 1 for the current cell.",
      followUpQuestions: [
        {
          question: "Why do we take the minimum instead of maximum?",
          options: [
            "Because the square is constrained by its weakest dimension",
            "Because we need all three directions to form a complete square",
            "Because the bottleneck determines the maximum possible square size",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "A square requires equal length and width. The minimum of the three adjacent values represents the bottleneck that limits how large the square can be at the current position."
        }
      ]
    },
    {
      id: 36,
      topic: "2D Grid DP",
      functionName: "interleaving_string",
      difficulty: "Hard",
      question: "What's the state transition in the interleaving string DP?",
      code: `def isInterleave(s1, s2, s3):
    if len(s1) + len(s2) != len(s3):
        return False
    
    m, n = len(s1), len(s2)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    
    # Base case
    dp[0][0] = True
    
    # Fill first row (only using s2)
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] and s2[j-1] == s3[j-1]
    
    # Fill first column (only using s1)  
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]
    
    # Fill the rest
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Can we form s3[0:i+j] using s1[0:i] and s2[0:j]?
            dp[i][j] = (dp[i-1][j] and s1[i-1] == s3[i+j-1]) or \
                       (dp[i][j-1] and s2[j-1] == s3[i+j-1])
    
    return dp[m][n]`,
      options: [
        "Take from s1 if characters match OR take from s2 if characters match",
        "Take from s1 if characters match AND take from s2 if characters match", 
        "Always take from the longer string first",
        "Take characters in alphabetical order"
      ],
      correctAnswer: 0,
      hint: "We have two choices at each position - which string to take the next character from.",
      explanation: "At each position, we can either take the next character from s1 (if it matches s3) OR from s2 (if it matches s3). The OR operation represents these two possible choices.",
      followUpQuestions: [
        {
          question: "What does dp[i][j] represent in this problem?",
          options: [
            "Whether s3[0:i+j] can be formed by interleaving s1[0:i] and s2[0:j]",
            "The number of ways to interleave the strings",
            "The minimum operations needed",
            "The longest common subsequence"
          ],
          correctAnswer: 0,
          explanation: "dp[i][j] represents whether the first i+j characters of s3 can be formed by interleaving the first i characters of s1 with the first j characters of s2."
        }
      ]
    },
    // Additional String DP Questions  
    {
      id: 37,
      topic: "String DP",
      functionName: "palindrome_partitioning_ii",
      difficulty: "Hard",
      question: "What's the missing optimization in palindrome partitioning DP?",
      code: `def minCut(s):
    n = len(s)
    
    # Precompute palindrome information
    is_palindrome = [[False] * n for _ in range(n)]
    
    # Every single character is a palindrome
    for i in range(n):
        is_palindrome[i][i] = True
    
    # Check for palindromes of length 2
    for i in range(n-1):
        if s[i] == s[i+1]:
            is_palindrome[i][i+1] = True
    
    # Check for palindromes of length 3 and more
    for length in range(3, n+1):
        for i in range(n-length+1):
            j = i + length - 1
            # MISSING LINE HERE - palindrome check condition
            if s[i] == s[j] and is_palindrome[i+1][j-1]:
                is_palindrome[i][j] = True
    
    # DP for minimum cuts
    dp = [float('inf')] * n
    for i in range(n):
        if is_palindrome[0][i]:
            dp[i] = 0  # No cut needed if whole prefix is palindrome
        else:
            for j in range(i):
                if is_palindrome[j+1][i]:
                    dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n-1]`,
      options: [
        "if s[i] == s[j] and is_palindrome[i+1][j-1]:",
        "if s[i] == s[j] or is_palindrome[i+1][j-1]:",
        "if s[i] == s[j] and i+1 <= j-1:",
        "if s[i] == s[j]:"
      ],
      correctAnswer: 0,
      hint: "For a string to be a palindrome, what conditions must be satisfied?",
      explanation: "A string s[i:j+1] is a palindrome if s[i] == s[j] (first and last characters match) AND s[i+1:j] is also a palindrome. This gives us the recursive structure for palindrome checking.",
      followUpQuestions: [
        {
          question: "Why do we precompute palindrome information instead of checking on-the-fly?",
          options: [
            "To avoid redundant palindrome checks during DP",
            "To optimize time complexity from O(n³) to O(n²)",
            "To use the optimal substructure of palindromes",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Precomputing palindrome information avoids redundant checks during the main DP, reduces time complexity, and leverages the fact that palindrome checking has optimal substructure."
        }
      ]
    },
    {
      id: 38,
      topic: "String DP",
      functionName: "distinct_subsequences",
      difficulty: "Hard",
      question: "What's the recurrence relation for counting distinct subsequences?",
      code: `def numDistinct(s, t):
    m, n = len(s), len(t)
    
    # dp[i][j] = number of ways to form t[0:j] using s[0:i]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base case: empty string t can be formed in 1 way (by taking nothing)
    for i in range(m + 1):
        dp[i][0] = 1
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # We can always skip current character in s
            dp[i][j] = dp[i-1][j]
            
            # If characters match, we can also use current character
            if s[i-1] == t[j-1]:
                dp[i][j] += dp[i-1][j-1]
    
    return dp[m][n]`,
      options: [
        "dp[i][j] = dp[i-1][j] + (dp[i-1][j-1] if s[i-1] == t[j-1] else 0)",
        "dp[i][j] = max(dp[i-1][j], dp[i-1][j-1])",
        "dp[i][j] = dp[i-1][j] * dp[i-1][j-1]",
        "dp[i][j] = dp[i-1][j-1] if s[i-1] == t[j-1] else dp[i-1][j]"
      ],
      correctAnswer: 0,
      hint: "We have two choices: skip the current character in s, or use it if it matches.",
      explanation: "We always have dp[i-1][j] ways (skipping current character in s). If s[i-1] == t[j-1], we also add dp[i-1][j-1] ways (using the matching character). This counts all possible ways to form the subsequence.",
      followUpQuestions: [
        {
          question: "Why do we initialize dp[i][0] = 1 for all i?",
          options: [
            "Because there's exactly one way to form an empty string",
            "Because we can always form empty string by taking no characters",
            "Because it serves as the base case for our recurrence",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "dp[i][0] = 1 means there's exactly one way to form an empty target string from any source string: by selecting no characters at all. This is our base case."
        }
      ]
    },
    {
      id: 39,
      topic: "String DP",
      functionName: "word_break_ii",
      difficulty: "Hard",
      question: "What's the key insight for optimizing Word Break II with memoization?",
      code: `def wordBreak(s, wordDict):
    word_set = set(wordDict)
    memo = {}
    
    def backtrack(start):
        if start in memo:
            return memo[start]
        
        if start == len(s):
            return [[]]  # Empty sentence
        
        result = []
        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set:
                # Get all possible sentences from remaining string
                sub_sentences = backtrack(end)
                for sentence in sub_sentences:
                    result.append([word] + sentence)
        
        memo[start] = result
        return result
    
    sentences = backtrack(0)
    return [' '.join(sentence) for sentence in sentences]`,
      options: [
        "Memoize results for each starting position to avoid recomputing subproblems",
        "Use trie data structure for efficient word lookup",
        "Sort words by length for better pruning",
        "Use rolling hash for string matching"
      ],
      correctAnswer: 0,
      hint: "Think about what subproblems are repeated when exploring different word break possibilities.",
      explanation: "The key optimization is memoizing results for each starting position. When we explore different ways to break the string, we often encounter the same suffix multiple times. Memoization avoids recomputing all possible sentences for the same suffix.",
      followUpQuestions: [
        {
          question: "What's the difference between Word Break I and Word Break II in terms of DP approach?",
          options: [
            "Word Break I returns boolean, II returns all solutions",
            "Word Break I uses bottom-up DP, II uses memoized recursion",
            "Word Break I tracks existence, II tracks all possible constructions",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Word Break I only needs to know if a break is possible (boolean), while II needs all possible sentences. This requires tracking all solutions rather than just existence, making memoized recursion more natural."
        }
      ]
    },
    // Pattern Recognition Questions
    {
      id: 40,
      topic: "Pattern Recognition",
      functionName: "knapsack_variations",
      difficulty: "Medium",
      question: "What's the key difference between 0/1 Knapsack and Unbounded Knapsack in terms of DP iteration?",
      code: `# 0/1 Knapsack
def knapsack_01(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        for w in range(W, weights[i] - 1, -1):  # Reverse iteration
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[W]

# Unbounded Knapsack  
def knapsack_unbounded(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        for w in range(weights[i], W + 1):  # Forward iteration
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[W]`,
      options: [
        "0/1 uses reverse iteration to avoid reusing items, Unbounded uses forward to allow reuse",
        "0/1 processes items first, Unbounded processes weights first",
        "0/1 uses 2D array, Unbounded uses 1D array",
        "No significant difference in iteration pattern"
      ],
      correctAnswer: 0,
      hint: "Think about what happens when we update dp[w] and then later use that updated value.",
      explanation: "In 0/1 Knapsack, reverse iteration ensures we use the 'previous row' values (before current item). In Unbounded Knapsack, forward iteration allows us to use updated values from the same iteration, enabling item reuse.",
      followUpQuestions: [
        {
          question: "What would happen if we used forward iteration in 0/1 Knapsack?",
          options: [
            "Items could be used multiple times incorrectly",
            "We'd use updated values from the current iteration",
            "The same item could contribute multiple times to the same solution",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Forward iteration in 0/1 Knapsack would mean using already-updated values from the current iteration, effectively allowing the same item to be used multiple times, which violates the 0/1 constraint."
        }
      ]
    },
    {
      id: 41,
      topic: "Pattern Recognition", 
      functionName: "interval_dp_pattern",
      difficulty: "Hard",
      question: "What's the characteristic iteration pattern for Interval DP problems?",
      code: `# Matrix Chain Multiplication - Classic Interval DP
def matrixChainOrder(p):
    n = len(p) - 1
    dp = [[0] * n for _ in range(n)]
    
    # Length of chain
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + p[i] * p[k+1] * p[j+1]
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[0][n-1]`,
      options: [
        "Iterate by interval length, then by starting position, then by split point",
        "Iterate by starting position, then by ending position, then by length",
        "Use standard 2D DP iteration pattern",
        "Iterate in reverse order of positions"
      ],
      correctAnswer: 0,
      hint: "Notice how we build solutions for smaller intervals first, then use them for larger intervals.",
      explanation: "Interval DP follows the pattern: iterate by length (small to large), then by starting position, then by all possible split points. This ensures smaller subproblems are solved before larger ones that depend on them.",
      followUpQuestions: [
        {
          question: "Why do we iterate by length first instead of position?",
          options: [
            "To ensure smaller intervals are computed before larger ones",
            "To maintain the dependency order of subproblems",
            "To enable optimal substructure utilization",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Iterating by length ensures that when we compute dp[i][j], all smaller intervals dp[i][k] and dp[k+1][j] have already been computed, maintaining the correct dependency order."
        }
      ]
    },
    // Optimization Techniques Questions
    {
      id: 42,
      topic: "Optimization Techniques",
      functionName: "rolling_array_optimization",
      difficulty: "Medium",
      question: "What's the missing line in optimizing 2D DP to use rolling arrays?",
      code: `# Original 2D DP
def longestCommonSubsequence_2D(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

# Optimized with rolling arrays
def longestCommonSubsequence_optimized(text1, text2):
    m, n = len(text1), len(text2)
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        
        # MISSING LINE HERE - how to update for next iteration?
    
    return prev[n]`,
      options: [
        "prev, curr = curr, prev",
        "prev = curr.copy(); curr = [0] * (n + 1)",
        "prev = curr; curr = [0] * (n + 1)",
        "curr, prev = prev, curr"
      ],
      correctAnswer: 0,
      hint: "We want to reuse arrays efficiently without creating new ones each iteration.",
      explanation: "prev, curr = curr, prev swaps the arrays efficiently. The current array becomes the previous for the next iteration, and we reuse the old previous array as the new current array.",
      followUpQuestions: [
        {
          question: "Why is this more efficient than creating new arrays each time?",
          options: [
            "Avoids memory allocation overhead",
            "Reduces garbage collection pressure", 
            "Reuses existing memory",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Swapping references avoids creating new arrays each iteration, reducing memory allocation overhead, garbage collection pressure, and efficiently reuses existing memory."
        }
      ]
    },
    {
      id: 43,
      topic: "Optimization Techniques",
      functionName: "coordinate_compression",
      difficulty: "Hard",
      question: "When is coordinate compression useful in DP problems?",
      code: `# Problem: Count of integers in range [L, R] with digit sum = S
def countWithDigitSum(L, R, S):
    # Without compression: might need arrays of size up to 10^18
    # With compression: work with compressed coordinates
    
    def compress_and_solve(num, target_sum):
        digits = str(num)
        n = len(digits)
        
        # Only need to track positions 0 to n-1, and sums 0 to 9*n
        memo = {}
        
        def dp(pos, tight, started, current_sum):
            if pos == n:
                return 1 if started and current_sum == target_sum else 0
            
            if (pos, tight, started, current_sum) in memo:
                return memo[(pos, tight, started, current_sum)]
            
            limit = int(digits[pos]) if tight else 9
            result = 0
            
            for digit in range(0, limit + 1):
                new_tight = tight and (digit == limit)
                new_started = started or digit > 0
                new_sum = current_sum + (digit if new_started else 0)
                
                # Early pruning with compression
                remaining_digits = n - pos - 1
                if new_sum + remaining_digits * 9 < target_sum:
                    continue
                if new_sum > target_sum:
                    continue
                
                result += dp(pos + 1, new_tight, new_started, new_sum)
            
            memo[(pos, tight, started, current_sum)] = result
            return result
        
        return dp(0, True, False, 0)
    
    return compress_and_solve(R, S) - compress_and_solve(L - 1, S)`,
      options: [
        "When the coordinate space is sparse but the actual range of values is small",
        "When we have large numbers but limited possible states",
        "When the DP state space can be reduced by mapping to smaller range",
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "Think about problems where the input range is huge but the actual DP states are limited.",
      explanation: "Coordinate compression is useful when we have large input ranges (like 10^18) but the actual DP states are much smaller (like digit positions 0-18 and sums 0-162). We map the large space to a smaller, manageable space.",
      followUpQuestions: [
        {
          question: "What's an example where coordinate compression is NOT needed?",
          options: [
            "When input constraints are already small (n ≤ 1000)",
            "When the state space naturally matches the input size",
            "When all possible values in the range are actually used",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Coordinate compression is unnecessary when the input size is already manageable, the state space matches input size, or when the coordinate space is dense rather than sparse."
        }
      ]
    },
    // Additional Tree DP Questions - Missing Lines
    {
      id: 44,
      topic: "Tree DP",
      functionName: "tree_matching",
      difficulty: "Hard",
      question: "What's the missing line in the maximum matching DP for trees?",
      code: `def maxMatching(root):
    # dp[node] = (matched, not_matched)
    # matched = max matching when current node is matched
    # not_matched = max matching when current node is not matched
    
    def dfs(node):
        if not node:
            return (0, 0)
        
        matched = 0
        not_matched = 0
        
        for child in node.children:
            child_matched, child_not_matched = dfs(child)
            
            # If current node is matched, children cannot be matched
            matched += child_not_matched
            
            # If current node is not matched, children can be either matched or not
            # MISSING LINE HERE - how to update not_matched?
            not_matched += max(child_matched, child_not_matched)
        
        # If current node is matched, add 1 for the matching edge
        matched += 1
        
        return (matched, not_matched)
    
    matched, not_matched = dfs(root)
    return max(matched, not_matched)`,
      options: [
        "not_matched += max(child_matched, child_not_matched)",
        "not_matched += child_matched + child_not_matched",
        "not_matched += child_matched",
        "not_matched += min(child_matched, child_not_matched)"
      ],
      correctAnswer: 0,
      hint: "When current node is not matched, we want to maximize the matching in each subtree.",
      explanation: "When the current node is not matched, each child can independently choose to be matched or not matched. We take the maximum for each child to maximize the total matching.",
      followUpQuestions: [
        {
          question: "Why do we add 1 to matched after processing all children?",
          options: [
            "To count the edge between current node and one of its children",
            "To count the current node itself",
            "To account for the matching constraint",
            "To balance the DP states"
          ],
          correctAnswer: 0,
          explanation: "We add 1 because when the current node is matched, it forms an edge with one of its children, contributing 1 to the total matching count."
        }
      ]
    },
    {
      id: 45,
      topic: "Tree DP",
      functionName: "subtree_sum_queries",
      difficulty: "Medium",
      question: "What's the missing line in preprocessing subtree sums for range queries?",
      code: `def preprocessSubtreeSums(root, values):
    subtree_sum = {}
    subtree_size = {}
    
    def dfs(node):
        if not node:
            return 0, 0
        
        current_sum = values[node.val]
        current_size = 1
        
        for child in node.children:
            child_sum, child_size = dfs(child)
            current_sum += child_sum
            current_size += child_size
        
        # MISSING LINE HERE - how to store the results?
        subtree_sum[node.val] = current_sum
        subtree_size[node.val] = current_size
        
        return current_sum, current_size
    
    dfs(root)
    return subtree_sum, subtree_size`,
      options: [
        "subtree_sum[node.val] = current_sum",
        "subtree_sum[node] = current_sum",
        "subtree_sum.append(current_sum)",
        "subtree_sum[current_size] = current_sum"
      ],
      correctAnswer: 0,
      hint: "We need to map each node to its subtree sum for O(1) query access.",
      explanation: "We store subtree_sum[node.val] = current_sum to create a mapping from node identifier to its subtree sum, enabling O(1) queries later.",
      followUpQuestions: [
        {
          question: "What's the time complexity of this preprocessing?",
          options: [
            "O(n) where n is the number of nodes",
            "O(n log n)",
            "O(n²)",
            "O(h) where h is the height"
          ],
          correctAnswer: 0,
          explanation: "We visit each node exactly once during the DFS traversal, so the time complexity is O(n)."
        }
      ]
    },
    {
      id: 46,
      topic: "Tree DP",
      functionName: "tree_dp_optimization",
      difficulty: "Hard",
      question: "What's the missing line in optimizing tree DP with small-to-large merging?",
      code: `def treeDP_optimized(root):
    # Using small-to-large merging for efficiency
    result = {}
    
    def dfs(node):
        if not node:
            return {}
        
        # Get results from all children
        child_results = []
        for child in node.children:
            child_result = dfs(child)
            child_results.append(child_result)
        
        # Merge using small-to-large technique
        current_result = {}
        
        for child_result in child_results:
            if len(child_result) > len(current_result):
                # MISSING LINE HERE - how to merge efficiently?
                current_result, child_result = child_result, current_result
            
            # Merge smaller into larger
            for key, value in child_result.items():
                current_result[key] = current_result.get(key, 0) + value
        
        # Add current node's contribution
        current_result[node.val] = current_result.get(node.val, 0) + 1
        
        return current_result
    
    return dfs(root)`,
      options: [
        "current_result, child_result = child_result, current_result",
        "current_result = child_result.copy()",
        "current_result.update(child_result)",
        "child_result, current_result = current_result, child_result"
      ],
      correctAnswer: 0,
      hint: "We want to always merge the smaller dictionary into the larger one.",
      explanation: "We swap current_result and child_result so that current_result becomes the larger dictionary, and we merge the smaller child_result into it. This maintains the small-to-large merging property.",
      followUpQuestions: [
        {
          question: "What's the time complexity benefit of small-to-large merging?",
          options: [
            "Reduces amortized complexity from O(n²) to O(n log n)",
            "Reduces space complexity",
            "Improves cache locality",
            "Enables parallelization"
          ],
          correctAnswer: 0,
          explanation: "Small-to-large merging ensures that each element is moved at most O(log n) times, reducing the total time complexity from O(n²) to O(n log n)."
        }
      ]
    },
    // Additional Tree DP Questions - Conceptual
    {
      id: 47,
      topic: "Tree DP",
      functionName: "tree_dp_rerooting_concept",
      difficulty: "Hard",
      question: "What's the key insight behind re-rooting technique in tree DP?",
      code: `# Re-rooting example: Count nodes at distance K from each node
def countNodesAtDistanceK(root, k):
    # Phase 1: Calculate answer for original root
    def dfs1(node, parent):
        # ... calculate subtree answers
        pass
    
    # Phase 2: Re-root and calculate for all other nodes  
    def dfs2(node, parent, parent_contribution):
        # Use parent's contribution to calculate current node's answer
        # Then propagate to children
        for child in node.children:
            if child != parent:
                child_contribution = calculate_contribution(node, child)
                dfs2(child, node, child_contribution)
    
    dfs1(root, None)
    dfs2(root, None, 0)`,
      options: [
        "Calculate for one root, then use parent-child relationships to derive others",
        "Calculate independently for each possible root",
        "Use bottom-up DP for all nodes simultaneously",
        "Apply divide and conquer on the tree structure"
      ],
      correctAnswer: 0,
      hint: "Think about how changing the root affects the answer and how to propagate this change efficiently.",
      explanation: "Re-rooting works by first calculating the answer for one root, then using the relationship between parent and child to efficiently derive the answer when the root changes. This avoids recalculating from scratch for each root.",
      followUpQuestions: [
        {
          question: "Why is re-rooting more efficient than naive approach?",
          options: [
            "Reduces time complexity from O(n²) to O(n)",
            "Uses less memory",
            "Avoids redundant calculations",
            "Both A and C"
          ],
          correctAnswer: 3,
          explanation: "Re-rooting reduces time complexity from O(n²) to O(n) by avoiding redundant calculations. Instead of recalculating everything for each root, we use previously computed information."
        }
      ]
    },
    {
      id: 48,
      topic: "Tree DP",
      functionName: "tree_dp_state_design",
      difficulty: "Medium",
      question: "How do you design DP states for tree problems with constraints?",
      code: `# Example: Maximum weight independent set with color constraints
def maxWeightIndependentSet(root, colors, weights):
    # State design consideration:
    # dp[node][color][selected] = maximum weight in subtree
    # where:
    # - node: current node
    # - color: color constraint from parent
    # - selected: whether current node is selected
    
    def dfs(node, parent_color, parent_selected):
        if not node:
            return 0
        
        max_weight = 0
        
        # Try different colors for current node
        for color in valid_colors:
            if conflicts_with_parent(color, parent_color):
                continue
                
            # Try selecting or not selecting current node
            for selected in [True, False]:
                if selected and parent_selected:
                    continue  # Cannot select adjacent nodes
                
                current_weight = weights[node.val] if selected else 0
                
                for child in node.children:
                    current_weight += dfs(child, color, selected)
                
                max_weight = max(max_weight, current_weight)
        
        return max_weight`,
      options: [
        "Include all constraint variables that affect optimal substructure",
        "Minimize the number of states to reduce complexity",
        "Use only the current node as the state",
        "Always include parent information in the state"
      ],
      correctAnswer: 0,
      hint: "Think about what information from ancestors affects the optimal choice for descendants.",
      explanation: "DP states should include all constraint variables that affect the optimal substructure. If a constraint from an ancestor affects the optimal choice for descendants, it must be part of the state.",
      followUpQuestions: [
        {
          question: "What happens if you omit a necessary constraint from the DP state?",
          options: [
            "The solution becomes incorrect",
            "Optimal substructure is violated",
            "Invalid transitions may occur",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Omitting necessary constraints leads to incorrect solutions because optimal substructure is violated, and the DP may make invalid transitions that don't respect the problem constraints."
        }
      ]
    },
    {
      id: 49,
      topic: "Tree DP",
      functionName: "tree_centroid_decomposition",
      difficulty: "Hard",
      question: "What's the key property of centroid decomposition that makes it useful for tree DP?",
      code: `def centroidDecomposition(root):
    def findCentroid(node, parent, tree_size):
        for child in node.children:
            if child != parent and subtree_size[child] > tree_size // 2:
                return findCentroid(child, node, tree_size)
        return node
    
    def decompose(node, parent):
        tree_size = calculateSize(node)
        centroid = findCentroid(node, None, tree_size)
        
        # Process all paths through centroid
        processPathsThroughCentroid(centroid)
        
        # Mark centroid as removed and recurse on subtrees
        centroid.removed = True
        for child in centroid.children:
            if not child.removed:
                decompose(child, centroid)
    
    decompose(root, None)`,
      options: [
        "Guarantees O(log n) depth in the decomposition tree",
        "Each node appears in at most log n levels",
        "Reduces path counting complexity",
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "Think about how centroid decomposition affects the structure and what guarantees it provides.",
      explanation: "Centroid decomposition guarantees O(log n) depth because each level removes at least half the nodes. This means each node appears in at most log n levels, making path-based problems tractable with O(n log n) complexity.",
      followUpQuestions: [
        {
          question: "Why is centroid decomposition particularly useful for path queries?",
          options: [
            "Every path either goes through the centroid or lies entirely in a subtree",
            "It reduces the number of paths to consider",
            "It maintains tree structure while enabling efficient processing",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Centroid decomposition is powerful for path queries because it partitions all paths into two types: those passing through the centroid (processed at this level) and those within subtrees (handled recursively)."
        }
      ]
    },
    // Additional 2D Grid DP Questions - Missing Lines
    {
      id: 50,
      topic: "2D Grid DP",
      functionName: "edit_distance_2d",
      difficulty: "Medium",
      question: "What's the missing line in the 2D edit distance DP?",
      code: `def editDistance2D(grid1, grid2):
    m1, n1 = len(grid1), len(grid1[0])
    m2, n2 = len(grid2), len(grid2[0])
    
    # dp[i1][j1][i2][j2] = min operations to transform 
    # grid1[0:i1][0:j1] to grid2[0:i2][0:j2]
    dp = [[[[float('inf')] * (n2 + 1) for _ in range(m2 + 1)] 
           for _ in range(n1 + 1)] for _ in range(m1 + 1)]
    
    # Base case
    dp[0][0][0][0] = 0
    
    for i1 in range(m1 + 1):
        for j1 in range(n1 + 1):
            for i2 in range(m2 + 1):
                for j2 in range(n2 + 1):
                    if i1 == 0 and j1 == 0 and i2 == 0 and j2 == 0:
                        continue
                    
                    # Delete from grid1
                    if i1 > 0:
                        dp[i1][j1][i2][j2] = min(dp[i1][j1][i2][j2], 
                                                  dp[i1-1][j1][i2][j2] + 1)
                    if j1 > 0:
                        dp[i1][j1][i2][j2] = min(dp[i1][j1][i2][j2], 
                                                  dp[i1][j1-1][i2][j2] + 1)
                    
                    # Insert to match grid2
                    if i2 > 0:
                        dp[i1][j1][i2][j2] = min(dp[i1][j1][i2][j2], 
                                                  dp[i1][j1][i2-1][j2] + 1)
                    if j2 > 0:
                        dp[i1][j1][i2][j2] = min(dp[i1][j1][i2][j2], 
                                                  dp[i1][j1][i2][j2-1] + 1)
                    
                    # Match/Replace
                    if i1 > 0 and i2 > 0:
                        cost = 0 if grid1[i1-1][j1] == grid2[i2-1][j2] else 1
                        # MISSING LINE HERE
                        dp[i1][j1][i2][j2] = min(dp[i1][j1][i2][j2], 
                                                  dp[i1-1][j1][i2-1][j2] + cost)
    
    return dp[m1][n1][m2][n2]`,
      options: [
        "dp[i1][j1][i2][j2] = min(dp[i1][j1][i2][j2], dp[i1-1][j1][i2-1][j2] + cost)",
        "dp[i1][j1][i2][j2] = dp[i1-1][j1][i2-1][j2] + cost",
        "dp[i1][j1][i2][j2] = min(dp[i1][j1][i2][j2], dp[i1-1][j1-1][i2-1][j2-1] + cost)",
        "dp[i1][j1][i2][j2] += dp[i1-1][j1][i2-1][j2] + cost"
      ],
      correctAnswer: 0,
      hint: "We're comparing elements at the same column positions in both grids.",
      explanation: "We compare grid1[i1-1][j1] with grid2[i2-1][j2] (same column j1 and j2), and transition from dp[i1-1][j1][i2-1][j2] representing the cost to transform up to the previous row in both grids.",
      followUpQuestions: [
        {
          question: "Why do we only compare elements in the same column?",
          options: [
            "Because we're aligning rows, not rearranging columns",
            "Because column operations are not allowed",
            "Because it simplifies the DP state space",
            "Because columns have fixed correspondence"
          ],
          correctAnswer: 0,
          explanation: "In 2D edit distance, we typically align rows while keeping column correspondence fixed. We transform one grid to another by adding/removing/modifying rows."
        }
      ]
    },
    {
      id: 51,
      topic: "2D Grid DP",
      functionName: "matrix_chain_2d",
      difficulty: "Hard",
      question: "What's the missing line in 2D matrix chain multiplication?",
      code: `def matrixChain2D(matrices):
    # matrices[i] has dimensions rows[i] x cols[i]
    n = len(matrices)
    rows = [m[0] for m in matrices]
    cols = [m[1] for m in matrices]
    
    # dp[i][j][r][c] = min cost to compute product of matrices[i:j+1]
    # resulting in a matrix of size r x c
    dp = {}
    
    def solve(i, j, target_rows, target_cols):
        if i == j:
            return 0 if (rows[i], cols[i]) == (target_rows, target_cols) else float('inf')
        
        if (i, j, target_rows, target_cols) in dp:
            return dp[(i, j, target_rows, target_cols)]
        
        min_cost = float('inf')
        
        for k in range(i, j):
            # Try all possible intermediate dimensions
            for mid_dim in range(1, max(rows + cols) + 1):
                left_cost = solve(i, k, target_rows, mid_dim)
                right_cost = solve(k + 1, j, mid_dim, target_cols)
                
                if left_cost != float('inf') and right_cost != float('inf'):
                    # MISSING LINE HERE - cost of multiplying the two parts
                    multiply_cost = target_rows * mid_dim * target_cols
                    total_cost = left_cost + right_cost + multiply_cost
                    min_cost = min(min_cost, total_cost)
        
        dp[(i, j, target_rows, target_cols)] = min_cost
        return min_cost`,
      options: [
        "multiply_cost = target_rows * mid_dim * target_cols",
        "multiply_cost = target_rows * target_cols * mid_dim",
        "multiply_cost = mid_dim * target_rows * target_cols",
        "All are equivalent"
      ],
      correctAnswer: 3,
      hint: "Matrix multiplication cost for (a×b) * (b×c) is a*b*c operations.",
      explanation: "All options are mathematically equivalent since multiplication is commutative. The cost of multiplying a (target_rows × mid_dim) matrix with a (mid_dim × target_cols) matrix is target_rows * mid_dim * target_cols.",
      followUpQuestions: [
        {
          question: "What makes 2D matrix chain multiplication more complex than 1D?",
          options: [
            "We need to track the dimensions of intermediate results",
            "Multiple valid dimensions for intermediate matrices",
            "Higher state space complexity",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "2D matrix chain multiplication is more complex because we must track dimensions of intermediate results, there can be multiple valid intermediate dimensions, and the state space is much larger."
        }
      ]
    },
    {
      id: 52,
      topic: "2D Grid DP",
      functionName: "grid_path_obstacles",
      difficulty: "Medium",
      question: "What's the missing line in counting paths with dynamic obstacles?",
      code: `def countPathsWithDynamicObstacles(grid, queries):
    m, n = len(grid), len(grid[0])
    
    def countPaths():
        dp = [[0] * n for _ in range(m)]
        
        # Initialize first cell
        dp[0][0] = 1 if grid[0][0] == 0 else 0
        
        # Fill first row
        for j in range(1, n):
            # MISSING LINE HERE - how to handle obstacles in first row?
            if grid[0][j] == 0:
                dp[0][j] = dp[0][j-1]
            else:
                dp[0][j] = 0
        
        # Fill first column
        for i in range(1, m):
            if grid[i][0] == 0:
                dp[i][0] = dp[i-1][0]
            else:
                dp[i][0] = 0
        
        # Fill rest of grid
        for i in range(1, m):
            for j in range(1, n):
                if grid[i][j] == 0:
                    dp[i][j] = dp[i-1][j] + dp[i][j-1]
                else:
                    dp[i][j] = 0
        
        return dp[m-1][n-1]
    
    results = []
    for query in queries:
        # Apply obstacle changes
        for x, y, state in query:
            grid[x][y] = state
        results.append(countPaths())
    
    return results`,
      options: [
        "if grid[0][j] == 0: dp[0][j] = dp[0][j-1] else: dp[0][j] = 0",
        "dp[0][j] = dp[0][j-1] if grid[0][j] == 0 else 0",
        "dp[0][j] = 0 if grid[0][j] == 1 else dp[0][j-1]",
        "All are equivalent"
      ],
      correctAnswer: 3,
      hint: "All these expressions handle obstacles in the first row correctly.",
      explanation: "All options are equivalent ways to express: if the current cell is not an obstacle (grid[0][j] == 0), inherit paths from the left cell; otherwise, set paths to 0.",
      followUpQuestions: [
        {
          question: "Why do we need special handling for the first row and column?",
          options: [
            "They have only one possible direction to come from",
            "They form the boundary conditions for the DP",
            "Obstacles in these positions block all subsequent paths in that direction",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "First row and column need special handling because they have only one direction to come from, serve as boundary conditions, and obstacles in these positions block all paths in that direction."
        }
      ]
    },
    // Additional 2D Grid DP Questions - Conceptual
    {
      id: 53,
      topic: "2D Grid DP",
      functionName: "grid_dp_optimization",
      difficulty: "Medium",
      question: "What's the key insight for optimizing space complexity in 2D grid DP?",
      code: `# Original O(mn) space
def gridDP_original(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    for i in range(m):
        for j in range(n):
            # dp[i][j] depends on dp[i-1][j] and dp[i][j-1]
            if i == 0 and j == 0:
                dp[i][j] = grid[i][j]
            elif i == 0:
                dp[i][j] = dp[i][j-1] + grid[i][j]
            elif j == 0:
                dp[i][j] = dp[i-1][j] + grid[i][j]
            else:
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    return dp[m-1][n-1]

# Optimized O(n) space
def gridDP_optimized(grid):
    m, n = len(grid), len(grid[0])
    dp = [float('inf')] * n
    dp[0] = grid[0][0]
    
    # Fill first row
    for j in range(1, n):
        dp[j] = dp[j-1] + grid[0][j]
    
    # Process remaining rows
    for i in range(1, m):
        dp[0] += grid[i][0]  # First column
        for j in range(1, n):
            dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
    
    return dp[n-1]`,
      options: [
        "Only keep the previous row since current row only depends on it",
        "Use rolling array technique to reuse space",
        "Process row by row, updating in place",
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "Think about the dependency pattern in 2D grid DP.",
      explanation: "All approaches work: we only need the previous row for dependencies, can use rolling arrays to reuse space, and can process row by row updating in place since dependencies are from left and above only.",
      followUpQuestions: [
        {
          question: "When is space optimization NOT possible in 2D grid DP?",
          options: [
            "When we need to reconstruct the path",
            "When dependencies span multiple previous rows",
            "When we need the entire DP table for queries",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Space optimization isn't possible when we need path reconstruction, have dependencies beyond the immediate previous row, or need to answer queries about the entire DP table."
        }
      ]
    },
    {
      id: 54,
      topic: "2D Grid DP",
      functionName: "grid_boundary_conditions",
      difficulty: "Medium",
      question: "How should boundary conditions be handled in 2D grid DP?",
      code: `def gridDPBoundaries(grid):
    m, n = len(grid), len(grid[0])
    
    # Approach 1: Explicit boundary handling
    def approach1():
        dp = [[0] * n for _ in range(m)]
        dp[0][0] = grid[0][0]
        
        # Handle first row
        for j in range(1, n):
            dp[0][j] = dp[0][j-1] + grid[0][j]
        
        # Handle first column
        for i in range(1, m):
            dp[i][0] = dp[i-1][0] + grid[i][0]
        
        # Fill remaining cells
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        
        return dp[m-1][n-1]
    
    # Approach 2: Padding with sentinel values
    def approach2():
        dp = [[float('inf')] * (n + 1) for _ in range(m + 1)]
        dp[1][1] = grid[0][0]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if i == 1 and j == 1:
                    continue
                dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i-1][j-1]
        
        return dp[m][n]`,
      options: [
        "Use explicit boundary handling for clarity and efficiency",
        "Use padding with sentinel values for uniform code",
        "Choose based on problem constraints and readability",
        "Both approaches are valid with different trade-offs"
      ],
      correctAnswer: 3,
      hint: "Consider the trade-offs between code simplicity and efficiency.",
      explanation: "Both approaches are valid: explicit boundary handling is more efficient but requires more code, while padding with sentinel values provides uniform code at the cost of extra space and initialization.",
      followUpQuestions: [
        {
          question: "What sentinel value should be used for minimization problems?",
          options: [
            "float('inf') for positions that shouldn't be reached",
            "0 for valid starting positions",
            "The actual boundary values for valid transitions",
            "Depends on the specific problem constraints"
          ],
          correctAnswer: 3,
          explanation: "The sentinel value depends on the problem: use float('inf') for unreachable positions, 0 or actual values for valid positions, and consider the specific constraints and what constitutes a valid state."
        }
      ]
    },
    {
      id: 55,
      topic: "2D Grid DP",
      functionName: "grid_dp_patterns",
      difficulty: "Hard",
      question: "What are the common patterns in 2D grid DP problems?",
      code: `# Pattern 1: Path counting/optimization
def pathPattern(grid):
    # State: dp[i][j] = optimal value to reach (i,j)
    # Transition: dp[i][j] = f(dp[i-1][j], dp[i][j-1])
    pass

# Pattern 2: Range/interval on 2D
def intervalPattern(grid):
    # State: dp[i1][j1][i2][j2] = optimal for subgrid (i1,j1) to (i2,j2)
    # Transition: split the rectangle and combine results
    pass

# Pattern 3: State machine on grid
def stateMachinePattern(grid):
    # State: dp[i][j][state] = optimal value at (i,j) with given state
    # Transition: based on state transitions and grid constraints
    pass

# Pattern 4: Multi-dimensional optimization
def multiDimPattern(grid):
    # State: dp[i][j][k] where k represents additional constraint
    # Transition: consider all valid moves respecting constraint k
    pass`,
      options: [
        "Path problems, interval problems, state machines, multi-dimensional constraints",
        "Only path counting and optimization problems",
        "Depends on the specific grid structure",
        "All 2D problems follow the same pattern"
      ],
      correctAnswer: 0,
      hint: "Different types of 2D problems require different DP state designs.",
      explanation: "Common 2D grid DP patterns include: path problems (reaching destinations), interval problems (processing subrectangles), state machine problems (tracking states while moving), and multi-dimensional problems (additional constraints beyond position).",
      followUpQuestions: [
        {
          question: "How do you choose between these patterns?",
          options: [
            "Based on what information you need to track",
            "Based on the problem constraints and objectives",
            "Based on the transitions available in the problem",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Pattern choice depends on what information needs tracking, problem constraints and objectives, and available transitions. The key is identifying what state information is necessary for optimal substructure."
        }
      ]
    },
    // Additional String DP Questions - Missing Lines
    {
      id: 56,
      topic: "String DP",
      functionName: "longest_palindromic_subsequence",
      difficulty: "Medium",
      question: "What's the missing line in longest palindromic subsequence DP?",
      code: `def longestPalindromicSubsequence(s):
    n = len(s)
    
    # dp[i][j] = length of longest palindromic subsequence in s[i:j+1]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single characters
    for i in range(n):
        dp[i][i] = 1
    
    # Fill for lengths 2 to n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            if s[i] == s[j]:
                # MISSING LINE HERE - characters match
                if length == 2:
                    dp[i][j] = 2
                else:
                    dp[i][j] = dp[i+1][j-1] + 2
            else:
                # Characters don't match
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    
    return dp[0][n-1]`,
      options: [
        "dp[i][j] = dp[i+1][j-1] + 2 (with special case for length 2)",
        "dp[i][j] = dp[i+1][j-1] + 2 (always)",
        "dp[i][j] = dp[i][j-1] + 2",
        "dp[i][j] = dp[i+1][j] + 2"
      ],
      correctAnswer: 1,
      hint: "When characters match, we can include both in the palindrome.",
      explanation: "When s[i] == s[j], we can include both characters in the palindrome, so we add 2 to the longest palindromic subsequence of the inner substring s[i+1:j]. The length check is unnecessary since dp[i+1][j-1] = 0 when i+1 > j-1.",
      followUpQuestions: [
        {
          question: "Why don't we need the special case for length 2?",
          options: [
            "Because dp[i+1][j-1] = 0 when i+1 > j-1",
            "Because the base case handles it",
            "Because empty substring has 0 palindromic subsequences",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We don't need the special case because when length = 2 and characters match, dp[i+1][j-1] accesses an invalid range where i+1 > j-1, which we can initialize to 0, representing the empty substring."
        }
      ]
    },
    {
      id: 57,
      topic: "String DP",
      functionName: "string_matching_with_wildcards",
      difficulty: "Hard",
      question: "What's the missing line in wildcard pattern matching DP?",
      code: `def wildcardMatch(s, p):
    m, n = len(s), len(p)
    
    # dp[i][j] = whether s[0:i] matches p[0:j]
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    dp[0][0] = True
    
    # Handle patterns like "a*", "*a*", etc. that can match empty string
    for j in range(1, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-1]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                # '*' can match empty, single char, or multiple chars
                # MISSING LINE HERE - how to handle '*' wildcard?
                dp[i][j] = dp[i][j-1] or dp[i-1][j] or dp[i-1][j-1]
            elif p[j-1] == '?' or p[j-1] == s[i-1]:
                # '?' matches any single char, or exact character match
                dp[i][j] = dp[i-1][j-1]
            else:
                # No match
                dp[i][j] = False
    
    return dp[m][n]`,
      options: [
        "dp[i][j] = dp[i][j-1] or dp[i-1][j] or dp[i-1][j-1]",
        "dp[i][j] = dp[i][j-1] or dp[i-1][j]",
        "dp[i][j] = dp[i-1][j] or dp[i-1][j-1]",
        "dp[i][j] = dp[i][j-1]"
      ],
      correctAnswer: 1,
      hint: "Think about what '*' can match: nothing, or one or more characters.",
      explanation: "For '*': dp[i][j-1] means '*' matches nothing (skip '*'), dp[i-1][j] means '*' matches current character and potentially more. We don't need dp[i-1][j-1] as it's covered by the other cases.",
      followUpQuestions: [
        {
          question: "Why is dp[i-1][j-1] not needed for '*' handling?",
          options: [
            "It's redundant with other transitions",
            "It represents '*' matching exactly one character, covered by dp[i-1][j]",
            "The other transitions already cover all cases",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "dp[i-1][j-1] would mean '*' matches exactly one character, but this case is already covered by dp[i-1][j] (match one or more) combined with dp[i][j-1] (match nothing)."
        }
      ]
    },
    {
      id: 58,
      topic: "String DP",
      functionName: "string_compression_dp",
      difficulty: "Hard",
      question: "What's the missing line in optimal string compression DP?",
      code: `def stringCompression(s):
    n = len(s)
    
    # dp[i] = minimum length of compressed string for s[0:i]
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    def getCompressedLength(char, count):
        if count == 1:
            return 1
        elif count < 10:
            return 2  # char + digit
        elif count < 100:
            return 3  # char + two digits
        else:
            return 4  # char + three digits
    
    for i in range(1, n + 1):
        # Try all possible segments ending at position i
        for j in range(i):
            # Segment s[j:i]
            segment = s[j:i]
            
            if len(set(segment)) == 1:
                # All characters are the same
                char = segment[0]
                count = len(segment)
                compressed_length = getCompressedLength(char, count)
                
                # MISSING LINE HERE - update dp[i]
                dp[i] = min(dp[i], dp[j] + compressed_length)
            else:
                # Mixed characters, no compression benefit
                dp[i] = min(dp[i], dp[j] + len(segment))
    
    return dp[n]`,
      options: [
        "dp[i] = min(dp[i], dp[j] + compressed_length)",
        "dp[i] = dp[j] + compressed_length",
        "dp[i] = min(dp[i], compressed_length)",
        "dp[i] += dp[j] + compressed_length"
      ],
      correctAnswer: 0,
      hint: "We want to find the minimum compression length, so we compare with existing value.",
      explanation: "We use min(dp[i], dp[j] + compressed_length) because we're trying all possible ways to end at position i, and we want the minimum cost among all possibilities.",
      followUpQuestions: [
        {
          question: "Why do we try all possible segments ending at position i?",
          options: [
            "To find the optimal way to compress the string up to position i",
            "Because different segmentations can lead to different compression ratios",
            "To ensure we consider all possible compression strategies",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We try all segments because different ways of partitioning the string can lead to different compression results, and we want to find the globally optimal compression strategy."
        }
      ]
    },
    // Additional String DP Questions - Conceptual
    {
      id: 59,
      topic: "String DP",
      functionName: "string_dp_state_design",
      difficulty: "Medium",
      question: "How do you design DP states for string problems with multiple constraints?",
      code: `# Example: Edit distance with limited operations
def editDistanceWithLimits(s1, s2, max_ops):
    # State design options:
    
    # Option 1: Include operation count in state
    def approach1():
        # dp[i][j][ops] = min cost to transform s1[0:i] to s2[0:j] using exactly 'ops' operations
        pass
    
    # Option 2: Track operation types
    def approach2():
        # dp[i][j][ins][del][sub] = whether transformation is possible with given operation counts
        pass
    
    # Option 3: Multi-dimensional state
    def approach3():
        # dp[i][j][state] where state encodes multiple constraints
        pass`,
      options: [
        "Include all constraint variables that affect the optimal solution",
        "Use the minimum number of dimensions to reduce complexity",
        "Choose based on the specific constraints and their interactions",
        "Always use a single state variable for simplicity"
      ],
      correctAnswer: 2,
      hint: "Consider how different constraints interact and affect the optimal substructure.",
      explanation: "State design should be based on specific constraints and their interactions. Include constraint variables that affect optimal substructure, but balance complexity with necessity.",
      followUpQuestions: [
        {
          question: "What happens if you include unnecessary variables in the DP state?",
          options: [
            "Increased time and space complexity",
            "Correct but inefficient solution",
            "More complex implementation",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Including unnecessary variables increases complexity, makes implementation more complex, but still produces correct results. The key is finding the minimal sufficient state representation."
        }
      ]
    },
    {
      id: 60,
      topic: "String DP",
      functionName: "string_dp_optimization_techniques",
      difficulty: "Hard",
      question: "What optimization techniques are commonly used in string DP?",
      code: `# Technique 1: Rolling array for space optimization
def technique1(s1, s2):
    # Only keep current and previous row
    prev = [0] * (len(s2) + 1)
    curr = [0] * (len(s2) + 1)
    # ... implementation

# Technique 2: Early termination with bounds
def technique2(s1, s2):
    # If remaining characters can't possibly lead to optimal solution
    if abs(len(s1) - len(s2)) > max_allowed_diff:
        return float('inf')
    # ... implementation

# Technique 3: Suffix/prefix optimization
def technique3(s):
    # Precompute common suffixes/prefixes to avoid redundant work
    # ... implementation

# Technique 4: Memoization with state compression
def technique4(s1, s2):
    # Compress state representation to reduce memory usage
    # Use bit manipulation or hashing for complex states
    # ... implementation`,
      options: [
        "Rolling arrays, early termination, preprocessing, state compression",
        "Only space optimization techniques",
        "Only time optimization techniques",
        "Depends on the specific string problem"
      ],
      correctAnswer: 0,
      hint: "Different optimization techniques target different aspects of performance.",
      explanation: "Common string DP optimizations include: rolling arrays for space, early termination for pruning, preprocessing for avoiding redundant computations, and state compression for memory efficiency.",
      followUpQuestions: [
        {
          question: "When should you apply these optimizations?",
          options: [
            "When the basic DP solution exceeds time/space limits",
            "When the problem has specific structure that can be exploited",
            "When implementing for production systems",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Apply optimizations when basic DP is insufficient, when problem structure allows exploitation, or when building production systems where performance matters."
        }
      ]
    },
    {
      id: 61,
      topic: "String DP",
      functionName: "string_alignment_problems",
      difficulty: "Hard",
      question: "What's the key insight in string alignment DP problems?",
      code: `# Global alignment (Needleman-Wunsch)
def globalAlignment(s1, s2, match, mismatch, gap):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Initialize gaps
    for i in range(m + 1):
        dp[i][0] = i * gap
    for j in range(n + 1):
        dp[0][j] = j * gap
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            score = match if s1[i-1] == s2[j-1] else mismatch
            dp[i][j] = max(
                dp[i-1][j-1] + score,  # Match/mismatch
                dp[i-1][j] + gap,      # Deletion
                dp[i][j-1] + gap       # Insertion
            )
    
    return dp[m][n]

# Local alignment (Smith-Waterman)  
def localAlignment(s1, s2, match, mismatch, gap):
    # Key difference: allow starting fresh (score = 0)
    dp[i][j] = max(0, dp[i-1][j-1] + score, dp[i-1][j] + gap, dp[i][j-1] + gap)`,
      options: [
        "Global alignment optimizes end-to-end, local alignment finds best subregion",
        "Different scoring schemes for different biological meanings",
        "Trade-off between alignment length and quality",
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "Consider the difference between aligning entire sequences vs finding the best matching regions.",
      explanation: "String alignment problems involve: global vs local optimization strategies, different scoring schemes reflecting biological or computational meaning, and trade-offs between alignment coverage and quality.",
      followUpQuestions: [
        {
          question: "Why does local alignment allow starting fresh with score 0?",
          options: [
            "To find the best matching subsequences without penalty for poor regions",
            "To avoid negative scores from propagating",
            "To identify optimal local similarities",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Local alignment allows score 0 to identify optimal local similarities without penalty from poor-matching regions, preventing negative scores from affecting the best local alignment."
        }
      ]
    },
    // Additional Pattern Recognition Questions - Missing Lines
    {
      id: 62,
      topic: "Pattern Recognition",
      functionName: "dp_pattern_identification",
      difficulty: "Medium",
      question: "What's the missing line in identifying optimal substructure for a new DP problem?",
      code: `def analyzeOptimalSubstructure(problem_instance):
    # Step 1: Identify the decision at each step
    decisions = identifyDecisions(problem_instance)
    
    # Step 2: Check if optimal solution contains optimal solutions to subproblems
    def checkOptimalSubstructure(state):
        optimal_solution = findOptimalSolution(state)
        
        for decision in decisions:
            substate = applyDecision(state, decision)
            suboptimal = findOptimalSolution(substate)
            
            # MISSING LINE HERE - how to verify optimal substructure?
            if optimal_solution.value != decision.cost + suboptimal.value:
                return False  # Optimal substructure violated
            
        return True
    
    # Step 3: Verify overlapping subproblems
    def checkOverlappingSubproblems():
        visited = set()
        def dfs(state):
            if state in visited:
                return True  # Found overlapping subproblem
            visited.add(state)
            for decision in getValidDecisions(state):
                if dfs(applyDecision(state, decision)):
                    return True
        return dfs(initial_state)
    
    has_optimal_substructure = checkOptimalSubstructure(initial_state)
    has_overlapping_subproblems = checkOverlappingSubproblems()
    
    return has_optimal_substructure and has_overlapping_subproblems`,
      options: [
        "if optimal_solution.value != decision.cost + suboptimal.value:",
        "if optimal_solution.value < decision.cost + suboptimal.value:",
        "if optimal_solution.value > decision.cost + suboptimal.value:",
        "if optimal_solution != decision + suboptimal:"
      ],
      correctAnswer: 0,
      hint: "Optimal substructure means the optimal solution incorporates optimal solutions to subproblems.",
      explanation: "We check if optimal_solution.value != decision.cost + suboptimal.value because in optimal substructure, the optimal solution should equal the cost of the decision plus the optimal solution to the resulting subproblem.",
      followUpQuestions: [
        {
          question: "What happens if a problem lacks optimal substructure?",
          options: [
            "DP won't give the correct answer",
            "Greedy algorithms might work instead",
            "The problem requires different techniques",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Without optimal substructure, DP fails because local optimal choices don't lead to global optimality. Such problems might need greedy algorithms, complete search, or other specialized techniques."
        }
      ]
    },
    {
      id: 63,
      topic: "Pattern Recognition",
      functionName: "state_space_design",
      difficulty: "Hard",
      question: "What's the missing consideration in designing DP state space?",
      code: `def designStateSpace(problem):
    # Identify what information is needed to make optimal decisions
    decision_factors = []
    
    # Factor 1: Current position/progress
    decision_factors.append("position")
    
    # Factor 2: Resources/constraints
    if problem.has_resource_constraints():
        decision_factors.append("remaining_resources")
    
    # Factor 3: Previous decisions that affect future choices
    if problem.has_history_dependence():
        decision_factors.append("relevant_history")
    
    # MISSING CONSIDERATION HERE - what else affects the state?
    # Factor 4: Future constraints that limit current choices
    if problem.has_future_constraints():
        decision_factors.append("future_limitations")
    
    # Design state representation
    state_dimensions = len(decision_factors)
    
    # Validate state design
    def validateStateDesign():
        # Check if state captures all necessary information
        for test_case in problem.test_cases:
            if not canMakeOptimalDecision(test_case, decision_factors):
                return False
        return True
    
    return decision_factors if validateStateDesign() else None`,
      options: [
        "Future constraints that limit current choices",
        "Computational complexity considerations",
        "Memory usage optimization",
        "Implementation difficulty"
      ],
      correctAnswer: 0,
      hint: "Think about information from the future that affects current decisions.",
      explanation: "Future constraints that limit current choices must be considered in state design. If future limitations affect what decisions are valid now, this information must be part of the state.",
      followUpQuestions: [
        {
          question: "How do you balance state completeness with complexity?",
          options: [
            "Include only information that affects optimal decisions",
            "Use state compression techniques when possible",
            "Consider approximation methods for intractable state spaces",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Balance completeness with complexity by including only decision-affecting information, using compression techniques, and considering approximations when the exact state space is too large."
        }
      ]
    },
    {
      id: 64,
      topic: "Pattern Recognition",
      functionName: "dp_vs_greedy_identification",
      difficulty: "Medium",
      question: "What's the missing check to determine if a problem needs DP vs Greedy?",
      code: `def determineAlgorithmChoice(problem):
    # Check 1: Does greedy choice property hold?
    def hasGreedyChoiceProperty():
        for state in problem.sample_states:
            greedy_choice = makeGreedyChoice(state)
            optimal_solution = findOptimalSolution(state)
            
            if not optimal_solution.contains(greedy_choice):
                return False
        return True
    
    # Check 2: Optimal substructure (needed for both)
    def hasOptimalSubstructure():
        # ... implementation similar to previous question
        return True  # Assume we have this
    
    # MISSING CHECK HERE - what distinguishes DP from Greedy?
    def hasOverlappingSubproblems():
        # Check if same subproblems are solved multiple times
        subproblem_count = {}
        
        def countSubproblems(state):
            if state in subproblem_count:
                subproblem_count[state] += 1
            else:
                subproblem_count[state] = 1
                
            for decision in getValidDecisions(state):
                countSubproblems(applyDecision(state, decision))
        
        countSubproblems(problem.initial_state)
        return any(count > 1 for count in subproblem_count.values())
    
    if hasGreedyChoiceProperty() and hasOptimalSubstructure():
        return "Greedy"
    elif hasOptimalSubstructure() and hasOverlappingSubproblems():
        return "Dynamic Programming"
    else:
        return "Other technique needed"`,
      options: [
        "hasOverlappingSubproblems() - distinguishes DP from Greedy",
        "hasPolynomialComplexity() - for efficiency",
        "hasUniqueOptimalSolution() - for correctness",
        "hasSimpleImplementation() - for practicality"
      ],
      correctAnswer: 0,
      hint: "What property does DP have that Greedy doesn't need?",
      explanation: "Overlapping subproblems is what distinguishes DP from Greedy. Greedy makes one choice and never reconsiders, while DP solves overlapping subproblems multiple times, requiring memoization.",
      followUpQuestions: [
        {
          question: "Can a problem have optimal substructure but not be solvable by either Greedy or DP?",
          options: [
            "Yes, if it lacks greedy choice property and overlapping subproblems",
            "Yes, if the state space is too large",
            "Yes, if it requires global search",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "A problem can have optimal substructure but still not be suitable for Greedy (no greedy choice property) or DP (no overlapping subproblems, or intractable state space), requiring other techniques like complete search."
        }
      ]
    },
    // Additional Pattern Recognition Questions - Conceptual
    {
      id: 65,
      topic: "Pattern Recognition",
      functionName: "dp_problem_categories",
      difficulty: "Medium",
      question: "How do you categorize DP problems to choose the right approach?",
      code: `# Category 1: Optimization problems
def optimizationDP():
    # Find minimum/maximum value
    # State: dp[...] = optimal value for subproblem
    # Example: Shortest path, knapsack
    pass

# Category 2: Counting problems  
def countingDP():
    # Count number of ways/solutions
    # State: dp[...] = number of ways for subproblem
    # Example: Fibonacci, coin change ways
    pass

# Category 3: Decision problems
def decisionDP():
    # Determine if something is possible
    # State: dp[...] = boolean for subproblem
    # Example: Subset sum, word break
    pass

# Category 4: Construction problems
def constructionDP():
    # Build/construct the actual solution
    # State: dp[...] = partial construction + optimal value
    # Example: LIS construction, path reconstruction
    pass`,
      options: [
        "Optimization, Counting, Decision, Construction problems",
        "Linear, Tree, Graph, String problems",
        "1D, 2D, 3D, Multi-dimensional problems",
        "Easy, Medium, Hard problems"
      ],
      correctAnswer: 0,
      hint: "Think about what type of answer the problem is asking for.",
      explanation: "DP problems are best categorized by their objective: Optimization (find best value), Counting (count solutions), Decision (yes/no questions), and Construction (build the solution). This determines the DP state design and transitions.",
      followUpQuestions: [
        {
          question: "Can a single problem belong to multiple categories?",
          options: [
            "Yes, you might need to find the optimal value AND construct the solution",
            "Yes, counting problems often have corresponding decision versions",
            "Yes, but you typically focus on the primary objective",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Problems can span multiple categories. For example, finding the LIS length (optimization) and constructing the actual LIS (construction), or counting paths (counting) and determining if a path exists (decision)."
        }
      ]
    },
    {
      id: 66,
      topic: "Pattern Recognition",
      functionName: "dp_complexity_analysis",
      difficulty: "Hard",
      question: "How do you analyze the complexity of a DP solution?",
      code: `def analyzeDPComplexity(problem):
    # Step 1: Count the number of unique states
    def countStates():
        state_dimensions = problem.state_dimensions
        state_ranges = problem.state_ranges
        
        total_states = 1
        for dimension, range_size in zip(state_dimensions, state_ranges):
            total_states *= range_size
        
        return total_states
    
    # Step 2: Analyze transitions per state
    def analyzeTransitions():
        max_transitions = 0
        for state in problem.sample_states:
            transitions = len(getValidTransitions(state))
            max_transitions = max(max_transitions, transitions)
        
        return max_transitions
    
    # Step 3: Calculate complexities
    num_states = countStates()
    transitions_per_state = analyzeTransitions()
    work_per_transition = problem.work_per_transition
    
    time_complexity = num_states * transitions_per_state * work_per_transition
    space_complexity = num_states * problem.space_per_state
    
    return {
        'time': time_complexity,
        'space': space_complexity,
        'states': num_states,
        'transitions': transitions_per_state
    }`,
      options: [
        "States × Transitions per state × Work per transition",
        "Only count the number of states",
        "Use Big O notation without detailed analysis",
        "Focus only on the recursive depth"
      ],
      correctAnswer: 0,
      hint: "Consider all three components that contribute to DP time complexity.",
      explanation: "DP time complexity = (Number of unique states) × (Transitions per state) × (Work per transition). You must analyze all three components to get accurate complexity bounds.",
      followUpQuestions: [
        {
          question: "What's the most common mistake in DP complexity analysis?",
          options: [
            "Forgetting to count the work done per transition",
            "Not accounting for memoization lookup time",
            "Overcounting states due to invalid combinations",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Common mistakes include: forgetting work per transition (like string operations), not considering memoization overhead, and overcounting states by including invalid state combinations that never occur."
        }
      ]
    },
    {
      id: 67,
      topic: "Pattern Recognition",
      functionName: "dp_pattern_matching",
      difficulty: "Hard",
      question: "What's the systematic approach to recognize DP patterns in new problems?",
      code: `def recognizeDPPattern(problem_statement):
    patterns = {
        'linear_dp': {
            'indicators': ['sequence', 'array', 'previous elements'],
            'state': 'dp[i] = optimal for first i elements',
            'transition': 'dp[i] = f(dp[i-1], dp[i-2], ...)'
        },
        'interval_dp': {
            'indicators': ['substring', 'subarray', 'range', 'merge'],
            'state': 'dp[i][j] = optimal for range [i,j]',
            'transition': 'split range and combine results'
        },
        'tree_dp': {
            'indicators': ['tree', 'subtree', 'parent-child'],
            'state': 'dp[node] = optimal for subtree rooted at node',
            'transition': 'combine results from children'
        },
        'digit_dp': {
            'indicators': ['digits', 'number range', 'digit constraints'],
            'state': 'dp[pos][tight][...] = count/sum for position pos',
            'transition': 'try each valid digit'
        },
        'bitmask_dp': {
            'indicators': ['subset', 'set of items', 'combinations'],
            'state': 'dp[mask] = optimal for subset represented by mask',
            'transition': 'add/remove elements from subset'
        }
    }
    
    # Pattern recognition algorithm
    def identifyPattern():
        scores = {}
        for pattern_name, pattern_info in patterns.items():
            score = 0
            for indicator in pattern_info['indicators']:
                if indicator.lower() in problem_statement.lower():
                    score += 1
            scores[pattern_name] = score
        
        return max(scores, key=scores.get) if max(scores.values()) > 0 else 'custom'
    
    recognized_pattern = identifyPattern()
    return patterns.get(recognized_pattern, {'state': 'custom', 'transition': 'custom'})`,
      options: [
        "Systematically check keywords and structural indicators for each known pattern",
        "Try to fit the problem into the most common patterns first",
        "Look for mathematical relationships in the problem",
        "Start with the simplest DP approach and build up"
      ],
      correctAnswer: 0,
      hint: "Think about how to methodically identify which DP pattern applies.",
      explanation: "Systematic pattern recognition involves checking keywords, structural indicators, and problem characteristics against known DP patterns. This helps quickly identify the appropriate state design and transition structure.",
      followUpQuestions: [
        {
          question: "What should you do when a problem doesn't fit standard patterns?",
          options: [
            "Analyze the problem structure to design custom states",
            "Look for combinations of multiple patterns",
            "Consider if the problem actually needs DP",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "When standard patterns don't fit: design custom states based on problem structure, consider pattern combinations, or verify if DP is actually needed. Some problems may require other techniques."
        }
      ]
    },
    // Additional Optimization Techniques Questions - Missing Lines
    {
      id: 68,
      topic: "Optimization Techniques",
      functionName: "space_time_tradeoff",
      difficulty: "Medium",
      question: "What's the missing line in implementing space-time tradeoff for DP?",
      code: `def optimizeSpaceTime(problem):
    # Original: O(n²) time, O(n²) space
    def original_dp(arr):
        n = len(arr)
        dp = [[0] * n for _ in range(n)]
        
        for i in range(n):
            for j in range(n):
                dp[i][j] = compute_value(arr, i, j, dp)
        
        return dp[0][n-1]
    
    # Optimized: O(n²) time, O(n) space
    def space_optimized_dp(arr):
        n = len(arr)
        prev = [0] * n
        curr = [0] * n
        
        for i in range(n):
            for j in range(n):
                # MISSING LINE HERE - how to use space-optimized arrays?
                curr[j] = compute_value_optimized(arr, i, j, prev, curr)
            
            prev, curr = curr, prev
        
        return prev[n-1]
    
    # Further optimized: O(n³) time, O(1) space (recomputation)
    def time_space_tradeoff(arr):
        # Recompute values instead of storing them
        return compute_recursive_with_limited_memo(arr, 0, len(arr)-1)`,
      options: [
        "curr[j] = compute_value_optimized(arr, i, j, prev, curr)",
        "curr[j] = compute_value(arr, i, j, prev)",
        "curr[j] = prev[j] + arr[i]",
        "curr[j] = dp[i][j]"
      ],
      correctAnswer: 0,
      hint: "We need to adapt the computation to use the space-optimized arrays.",
      explanation: "We use compute_value_optimized which takes prev and curr arrays instead of the full 2D dp table. This function knows how to extract needed values from the limited space.",
      followUpQuestions: [
        {
          question: "When is space-time tradeoff beneficial?",
          options: [
            "When memory is more constrained than computation time",
            "When the original space complexity is prohibitive",
            "When recomputation is cheaper than storage",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Space-time tradeoff is beneficial when memory constraints are tighter than time constraints, when original space usage is too high, or when recomputation cost is acceptable compared to storage cost."
        }
      ]
    },
    {
      id: 69,
      topic: "Optimization Techniques",
      functionName: "memoization_optimization",
      difficulty: "Hard",
      question: "What's the missing optimization in advanced memoization techniques?",
      code: `def advancedMemoization(problem):
    # Basic memoization
    def basic_memo():
        cache = {}
        def dp(state):
            if state in cache:
                return cache[state]
            result = compute(state)
            cache[state] = result
            return result
    
    # Memory-efficient memoization with LRU eviction
    from collections import OrderedDict
    
    def lru_memo(max_size=1000):
        cache = OrderedDict()
        
        def dp(state):
            if state in cache:
                # Move to end (most recently used)
                cache.move_to_end(state)
                return cache[state]
            
            result = compute(state)
            
            # MISSING LINE HERE - how to handle cache overflow?
            if len(cache) >= max_size:
                cache.popitem(last=False)  # Remove least recently used
            
            cache[state] = result
            return result
        
        return dp
    
    # State compression memoization
    def compressed_memo():
        cache = {}
        
        def dp(state):
            compressed_state = compress_state(state)
            if compressed_state in cache:
                return cache[compressed_state]
            
            result = compute(state)
            cache[compressed_state] = result
            return result`,
      options: [
        "if len(cache) >= max_size: cache.popitem(last=False)",
        "if len(cache) >= max_size: cache.clear()",
        "if len(cache) >= max_size: cache.popitem(last=True)",
        "if len(cache) >= max_size: del cache[state]"
      ],
      correctAnswer: 0,
      hint: "We want to remove the least recently used item when cache is full.",
      explanation: "cache.popitem(last=False) removes the least recently used item (first item in OrderedDict). This implements LRU eviction policy to manage memory usage while keeping frequently accessed states.",
      followUpQuestions: [
        {
          question: "When should you use LRU memoization instead of unlimited caching?",
          options: [
            "When memory constraints are tight",
            "When the state space is very large",
            "When only recent states are likely to be reused",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "LRU memoization is beneficial when memory is constrained, state space is large, or when locality of reference means recent states are more likely to be reused than old ones."
        }
      ]
    },
    {
      id: 70,
      topic: "Optimization Techniques",
      functionName: "parallel_dp_optimization",
      difficulty: "Hard",
      question: "What's the missing consideration in parallelizing DP computations?",
      code: `def parallelizeDP(problem):
    import concurrent.futures
    import threading
    
    # Identify parallelizable computations
    def identifyParallelizableStates():
        # States that don't depend on each other can be computed in parallel
        independent_groups = []
        
        for level in problem.dependency_levels:
            # States at the same level with no interdependencies
            independent_states = []
            for state in level:
                if not hasDependenciesWithin(state, level):
                    independent_states.append(state)
            independent_groups.append(independent_states)
        
        return independent_groups
    
    # Parallel computation with proper synchronization
    def parallelDP():
        cache = {}
        cache_lock = threading.Lock()
        
        def compute_state_safe(state):
            # MISSING CONSIDERATION HERE - what about race conditions?
            with cache_lock:
                if state in cache:
                    return cache[state]
            
            # Compute without holding lock (allow parallel computation)
            result = compute_state(state)
            
            with cache_lock:
                cache[state] = result
            
            return result
        
        independent_groups = identifyParallelizableStates()
        
        for group in independent_groups:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                futures = [executor.submit(compute_state_safe, state) for state in group]
                results = [future.result() for future in futures]
        
        return cache[problem.target_state]`,
      options: [
        "Race conditions in cache access require proper synchronization",
        "Load balancing across different threads",
        "Memory bandwidth limitations",
        "Thread creation overhead"
      ],
      correctAnswer: 0,
      hint: "What's the most critical issue when multiple threads access shared data?",
      explanation: "Race conditions in cache access are the most critical consideration. Multiple threads reading/writing the cache simultaneously can cause data corruption. Proper synchronization with locks is essential.",
      followUpQuestions: [
        {
          question: "What are other challenges in parallel DP besides race conditions?",
          options: [
            "Identifying truly independent subproblems",
            "Balancing workload across threads",
            "Managing memory access patterns",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Parallel DP faces multiple challenges: identifying independent subproblems, balancing workload to avoid thread starvation, managing memory access patterns to avoid false sharing, and minimizing synchronization overhead."
        }
      ]
    },
    // Additional Optimization Techniques Questions - Conceptual
    {
      id: 71,
      topic: "Optimization Techniques",
      functionName: "dp_optimization_strategies",
      difficulty: "Medium",
      question: "What are the main categories of DP optimization strategies?",
      code: `# Category 1: Space Optimization
def spaceOptimization():
    # Rolling arrays, state compression, dimension reduction
    # Trade space for time or maintain same time complexity
    pass

# Category 2: Time Optimization  
def timeOptimization():
    # Early termination, pruning, better state transitions
    # Reduce the constant factors or improve complexity
    pass

# Category 3: Memory Access Optimization
def memoryAccessOptimization():
    # Cache-friendly traversal, data locality
    # Improve performance through better memory patterns
    pass

# Category 4: Algorithmic Optimization
def algorithmicOptimization():
    # Different DP formulation, mathematical insights
    # Fundamental improvements to the approach
    pass`,
      options: [
        "Space, Time, Memory Access, and Algorithmic optimizations",
        "Only space and time optimizations matter",
        "Focus on reducing Big O complexity only",
        "Optimization depends entirely on the specific problem"
      ],
      correctAnswer: 0,
      hint: "Consider all aspects that can affect DP performance.",
      explanation: "DP optimizations fall into four main categories: Space (reducing memory usage), Time (reducing computation), Memory Access (improving cache performance), and Algorithmic (better formulations). Each addresses different performance bottlenecks.",
      followUpQuestions: [
        {
          question: "Which optimization category typically provides the biggest performance gains?",
          options: [
            "Algorithmic optimizations (better complexity)",
            "Space optimizations (less memory usage)",
            "Memory access optimizations (better cache behavior)",
            "It depends on the bottleneck"
          ],
          correctAnswer: 3,
          explanation: "The biggest gains depend on the bottleneck: algorithmic improvements help with complexity, space optimization helps with memory-bound problems, and memory access optimization helps with cache-bound computations."
        }
      ]
    },
    {
      id: 72,
      topic: "Optimization Techniques", 
      functionName: "dp_implementation_choices",
      difficulty: "Medium",
      question: "How do implementation choices affect DP performance?",
      code: `# Choice 1: Top-down vs Bottom-up
def implementationChoice1():
    # Top-down (memoization): easier to write, handles only needed states
    # Bottom-up (tabulation): better cache behavior, no recursion overhead
    pass

# Choice 2: Data structure selection
def implementationChoice2():
    # Arrays: fast access, cache-friendly
    # Hash maps: flexible states, overhead for hashing
    # Custom structures: optimized for specific access patterns
    pass

# Choice 3: State representation
def implementationChoice3():
    # Explicit coordinates: clear but potentially wasteful
    # Compressed representation: space-efficient but complex
    # Bit manipulation: very compact for boolean states
    pass

# Choice 4: Computation order
def implementationChoice4():
    # Row-major: good for most problems
    # Column-major: better for some memory access patterns
    # Diagonal: optimal for interval DP
    pass`,
      options: [
        "All choices significantly impact performance in different ways",
        "Only the algorithm choice matters, implementation details don't",
        "Modern compilers optimize away most implementation differences",
        "Focus only on asymptotic complexity"
      ],
      correctAnswer: 0,
      hint: "Consider how each choice affects different aspects of performance.",
      explanation: "Implementation choices significantly affect performance: recursion vs iteration affects call overhead, data structures affect access time, state representation affects memory usage, and computation order affects cache behavior.",
      followUpQuestions: [
        {
          question: "When should you choose top-down over bottom-up DP?",
          options: [
            "When you don't need to compute all states",
            "When the state space is sparse",
            "When the recurrence is easier to express recursively",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Choose top-down when: not all states are needed (sparse computation), state space is sparse (many unreachable states), or when recursion makes the logic clearer and easier to implement correctly."
        }
      ]
    },
    // ===============================================
    // KNAPSACK DP QUESTIONS
    // ===============================================
    // Missing Lines Questions - Knapsack DP
    {
      id: 73,
      topic: "Knapsack DP",
      functionName: "coin_change_unbounded",
      difficulty: "Medium",
      question: "What's the missing line in the coin change unbounded knapsack implementation?",
      code: `def coinChange(coins, amount):
    if amount == 0:
        return 0
    
    # dp[i] = minimum coins needed to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins for amount 0
    
    # For each coin type (can use unlimited times)
    for coin in coins:
        # Update all amounts that can use this coin
        for curr_amount in range(coin, amount + 1):
            # MISSING LINE HERE - how to update dp[curr_amount]?
            dp[curr_amount] = min(dp[curr_amount], dp[curr_amount - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`,
      options: [
        "dp[curr_amount] = min(dp[curr_amount], dp[curr_amount - coin] + 1)",
        "dp[curr_amount] = dp[curr_amount - coin] + 1",
        "dp[curr_amount] = min(dp[curr_amount], dp[curr_amount - coin])",
        "dp[curr_amount] += dp[curr_amount - coin] + 1"
      ],
      correctAnswer: 0,
      hint: "We want to minimize the number of coins, so compare current best with using this coin.",
      explanation: "We use min(dp[curr_amount], dp[curr_amount - coin] + 1) because we want the minimum number of coins. We either keep the current best way to make this amount, or use this coin (adding 1 to the coins needed for the remaining amount).",
      followUpQuestions: [
        {
          question: "Why do we iterate coins in the outer loop for unbounded knapsack?",
          options: [
            "To allow using the same coin multiple times",
            "To process coins in order",
            "To avoid duplicate counting",
            "To optimize time complexity"
          ],
          correctAnswer: 0,
          explanation: "In unbounded knapsack, we iterate coins in the outer loop so that when we process each amount, we can use the same coin multiple times. This allows unlimited usage of each coin type."
        }
      ]
    },
    {
      id: 74,
      topic: "Knapsack DP",
      functionName: "partition_equal_subset",
      difficulty: "Medium",
      question: "What's the missing line in the 0/1 knapsack partition problem?",
      code: `def canPartition(nums):
    total_sum = sum(nums)
    
    # If total sum is odd, can't partition equally
    if total_sum % 2 != 0:
        return False
    
    target = total_sum // 2
    
    # dp[i] = whether sum i is achievable with some subset
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset has sum 0
    
    # For each number (0/1 knapsack - use each number at most once)
    for num in nums:
        # MISSING LINE HERE - iteration direction to avoid reusing same number
        for curr_sum in range(target, num - 1, -1):
            dp[curr_sum] = dp[curr_sum] or dp[curr_sum - num]
    
    return dp[target]`,
      options: [
        "for curr_sum in range(target, num - 1, -1):",
        "for curr_sum in range(num, target + 1):",
        "for curr_sum in range(target + 1):",
        "for curr_sum in range(1, target + 1):"
      ],
      correctAnswer: 0,
      hint: "We need to iterate backwards to ensure each number is used at most once.",
      explanation: "We iterate backwards (target down to num) to ensure each number is used at most once. Forward iteration would allow the same number to be used multiple times in the same iteration.",
      followUpQuestions: [
        {
          question: "What happens if we iterate forward in 0/1 knapsack?",
          options: [
            "Same number gets used multiple times",
            "Results in incorrect subset sums",
            "Violates the 0/1 constraint",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Forward iteration in 0/1 knapsack causes the same number to be used multiple times in one iteration, violating the constraint that each item can be used at most once."
        }
      ]
    },
    {
      id: 75,
      topic: "Knapsack DP",
      functionName: "target_sum_transformation",
      difficulty: "Hard",
      question: "What's the missing line in transforming target sum to subset sum problem?",
      code: `def findTargetSumWays(nums, target):
    total = sum(nums)
    
    # Check if target is achievable
    if target > total or target < -total or (total + target) % 2 != 0:
        return 0
    
    # Transform to subset sum problem
    # MISSING LINE HERE - what should target_sum be?
    target_sum = (total + target) // 2
    
    # dp[i] = number of ways to achieve sum i
    dp = [0] * (target_sum + 1)
    dp[0] = 1  # One way to achieve sum 0 (empty subset)
    
    for num in nums:
        for curr_sum in range(target_sum, num - 1, -1):
            dp[curr_sum] += dp[curr_sum - num]
    
    return dp[target_sum]`,
      options: [
        "target_sum = (total + target) // 2",
        "target_sum = (total - target) // 2",
        "target_sum = total // 2",
        "target_sum = target // 2"
      ],
      correctAnswer: 0,
      hint: "Think about the relationship: P - N = target and P + N = total, where P is positive subset sum.",
      explanation: "If P is the sum of positive numbers and N is the sum of negative numbers, then P - N = target and P + N = total. Solving these equations: P = (total + target) / 2.",
      followUpQuestions: [
        {
          question: "Why does this transformation work mathematically?",
          options: [
            "P + N = total and P - N = target, solving gives P = (total + target) / 2",
            "It converts the sign assignment problem to subset selection",
            "It reduces the problem space from 2^n to sum complexity",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "The transformation works because it converts the complex sign assignment problem into a simpler subset sum problem by using the mathematical relationship between positive and negative subsets."
        }
      ]
    },
    {
      id: 76,
      topic: "Knapsack DP",
      functionName: "bounded_knapsack",
      difficulty: "Hard",
      question: "What's the missing line in bounded knapsack where each item has limited quantity?",
      code: `def boundedKnapsack(weights, values, quantities, capacity):
    n = len(weights)
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        weight, value, quantity = weights[i], values[i], quantities[i]
        
        # MISSING LINE HERE - how to handle limited quantities?
        for _ in range(quantity):
            for w in range(capacity, weight - 1, -1):
                dp[w] = max(dp[w], dp[w - weight] + value)
    
    return dp[capacity]`,
      options: [
        "for _ in range(quantity):",
        "for q in range(1, quantity + 1):",
        "while quantity > 0:",
        "for q in quantity:"
      ],
      correctAnswer: 0,
      hint: "We need to process each copy of the item separately to respect the quantity limit.",
      explanation: "We use 'for _ in range(quantity):' to process each copy of the item individually. This ensures that we can use up to 'quantity' copies of each item, but not more.",
      followUpQuestions: [
        {
          question: "How does bounded knapsack differ from 0/1 and unbounded knapsack?",
          options: [
            "Each item can be used a limited number of times",
            "It's a hybrid between 0/1 (limited) and unbounded (multiple uses)",
            "Requires processing multiple copies of each item",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Bounded knapsack allows each item to be used multiple times but with a limit, making it a hybrid between 0/1 knapsack (once only) and unbounded knapsack (unlimited uses)."
        }
      ]
    },
    {
      id: 77,
      topic: "Knapsack DP",
      functionName: "knapsack_space_optimization",
      difficulty: "Medium",
      question: "What's the missing consideration for space-optimized knapsack?",
      code: `def knapsack01_optimized(weights, values, capacity):
    n = len(weights)
    # Space optimization: use only 1D array instead of 2D
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        weight, value = weights[i], values[i]
        # MISSING CONSIDERATION - iteration direction for space optimization
        for w in range(capacity, weight - 1, -1):
            dp[w] = max(dp[w], dp[w - weight] + value)
    
    return dp[capacity]`,
      options: [
        "Iterate backwards to avoid using updated values in same iteration",
        "Iterate forwards for better cache performance",
        "Iteration direction doesn't matter in space optimization",
        "Use two arrays to avoid conflicts"
      ],
      correctAnswer: 0,
      hint: "Think about what happens if we use a value that was already updated in the current iteration.",
      explanation: "We iterate backwards (capacity down to weight) to avoid using values that were already updated in the current iteration. This ensures we're using values from the previous 'row' of the conceptual 2D DP table.",
      followUpQuestions: [
        {
          question: "What's the space complexity improvement from 2D to 1D DP?",
          options: [
            "From O(n × capacity) to O(capacity)",
            "From O(n²) to O(n)",
            "From O(capacity²) to O(capacity)",
            "No improvement in space complexity"
          ],
          correctAnswer: 0,
          explanation: "Space optimization reduces complexity from O(n × capacity) to O(capacity) by using only one array instead of a 2D table."
        }
      ]
    },
    // Conceptual Questions - Knapsack DP
    {
      id: 78,
      topic: "Knapsack DP",
      functionName: "knapsack_variant_recognition",
      difficulty: "Medium",
      question: "How do you identify which knapsack variant to use for a given problem?",
      code: `# Problem characteristics and their corresponding knapsack variants:

# Characteristic 1: Item usage frequency
# - Each item used at most once → 0/1 Knapsack
# - Each item used unlimited times → Unbounded Knapsack  
# - Each item used limited times → Bounded Knapsack

# Characteristic 2: Objective function
# - Maximize/minimize value → Optimization DP
# - Count number of ways → Counting DP
# - Check if possible → Boolean DP

# Characteristic 3: Constraint type
# - Exact capacity → Standard knapsack
# - At most capacity → Standard knapsack
# - Partition into equal parts → Subset sum variant`,
      options: [
        "Analyze item usage frequency, objective function, and constraint type",
        "Always start with 0/1 knapsack and modify if needed",
        "Use unbounded knapsack for most problems",
        "The variant doesn't matter, all approaches work"
      ],
      correctAnswer: 0,
      hint: "Consider how many times each item can be used and what you're trying to optimize or count.",
      explanation: "To choose the right knapsack variant, analyze: (1) How many times each item can be used, (2) What you're optimizing/counting, and (3) The nature of the constraints. This determines the DP state and transitions.",
      followUpQuestions: [
        {
          question: "What's a key indicator that a problem is a knapsack variant?",
          options: [
            "Selection/rejection decisions with capacity constraints",
            "Optimization with resource limitations",
            "Subset selection with constraints",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Knapsack problems involve making selection decisions under capacity constraints, optimizing some objective while respecting resource limitations."
        }
      ]
    },
    {
      id: 79,
      topic: "Knapsack DP",
      functionName: "knapsack_state_design",
      difficulty: "Hard",
      question: "How should you design DP states for complex knapsack problems?",
      code: `# Example: Knapsack with multiple constraints
def multiConstraintKnapsack(items, weight_limit, volume_limit, count_limit):
    # State design options:
    
    # Option 1: Include all constraints in state
    # dp[i][w][v][c] = max value using first i items, weight ≤ w, volume ≤ v, count ≤ c
    
    # Option 2: Separate constraint handling
    # Process constraints one by one
    
    # Option 3: Transform constraints
    # Convert multiple constraints into single equivalent constraint
    
    # Which approach to choose depends on:
    # - Constraint interactions
    # - State space size
    # - Implementation complexity`,
      options: [
        "Include all constraints that interact with optimal substructure in the state",
        "Always use the maximum number of dimensions for completeness",
        "Minimize dimensions to reduce complexity, even if incorrect",
        "Use separate DP for each constraint independently"
      ],
      correctAnswer: 0,
      hint: "Include constraints that affect whether a subproblem's solution can be reused.",
      explanation: "Include constraints in the DP state if they affect optimal substructure - if a constraint from ancestors affects the optimal choice for descendants, it must be part of the state.",
      followUpQuestions: [
        {
          question: "What's the trade-off in adding more dimensions to DP state?",
          options: [
            "More accuracy vs. higher time/space complexity",
            "Better correctness vs. implementation difficulty",
            "Complete state representation vs. computational feasibility",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Adding dimensions improves accuracy and completeness but increases complexity and implementation difficulty. The key is finding the minimal sufficient state representation."
        }
      ]
    },
    {
      id: 80,
      topic: "Knapsack DP",
      functionName: "knapsack_optimization_techniques",
      difficulty: "Hard",
      question: "What are the key optimization techniques for knapsack problems?",
      code: `# Optimization techniques for knapsack DP:

# 1. Space optimization
def space_optimized():
    # Use 1D array instead of 2D table
    # Iterate in correct direction to avoid conflicts
    pass

# 2. Early termination
def early_termination():
    # If remaining items can't improve solution, stop
    # Use upper bounds to prune search space
    pass

# 3. Item preprocessing
def item_preprocessing():
    # Sort items by value/weight ratio
    # Remove dominated items (strictly worse)
    pass

# 4. State compression
def state_compression():
    # Use bit manipulation for subset representation
    # Compress multiple constraints into single dimension
    pass`,
      options: [
        "Space optimization, early termination, preprocessing, state compression",
        "Only space optimization matters for knapsack problems",
        "Optimization techniques depend on the specific problem variant",
        "Standard DP is already optimal, no improvements needed"
      ],
      correctAnswer: 0,
      hint: "Multiple techniques can be combined to improve both time and space efficiency.",
      explanation: "Knapsack problems benefit from various optimizations: space optimization (1D arrays), early termination (pruning), item preprocessing (sorting/filtering), and state compression (efficient representation).",
      followUpQuestions: [
        {
          question: "When should you apply these optimization techniques?",
          options: [
            "When the basic DP solution exceeds time/memory limits",
            "When the problem has specific structure that can be exploited",
            "When implementing for production systems requiring efficiency",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Apply optimizations when basic DP is insufficient, when problem structure allows exploitation, or when building efficient production systems."
        }
      ]
    },
    {
      id: 81,
      topic: "Knapsack DP",
      functionName: "knapsack_problem_transformations",
      difficulty: "Hard",
      question: "How do you recognize when to transform a problem into a knapsack variant?",
      code: `# Common problem transformations to knapsack:

# 1. Partition problems → Subset sum (0/1 knapsack)
# "Can we partition array into two equal subsets?"
# → "Can we find subset with sum = total/2?"

# 2. Assignment problems → Knapsack with constraints  
# "Assign +/- signs to reach target sum"
# → "Find subset with specific sum"

# 3. Resource allocation → Multi-dimensional knapsack
# "Distribute resources optimally across projects"
# → "Select projects with multiple resource constraints"

# 4. Scheduling problems → Knapsack with time
# "Select tasks to maximize value within time limit"
# → "Items with time cost and value benefit"`,
      options: [
        "Look for selection/rejection decisions with optimization under constraints",
        "Identify capacity-like limitations and item-like choices",
        "Transform complex constraints into knapsack-compatible form",
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "Knapsack problems involve making binary choices about items under capacity constraints.",
      explanation: "Transform problems to knapsack when you see: selection decisions, capacity constraints, optimization objectives, and the ability to model choices as 'items' with 'weights' and 'values'.",
      followUpQuestions: [
        {
          question: "What's the key insight that enables knapsack transformations?",
          options: [
            "Many optimization problems can be viewed as resource allocation",
            "Binary choices (include/exclude) are fundamental to many problems",
            "Constraints can often be modeled as capacity limitations",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Knapsack transformations work because many problems involve binary choices under resource constraints, which is the core structure of knapsack problems."
        }
      ]
    },
    // Optimization Questions - Knapsack DP
    {
      id: 82,
      topic: "Knapsack DP",
      functionName: "knapsack_memory_optimization",
      difficulty: "Medium",
      question: "How can you optimize memory usage in knapsack DP?",
      code: `# Memory optimization techniques:

# Technique 1: Rolling array (space reduction)
def rolling_array_optimization():
    # Use only current and previous row
    prev = [0] * (capacity + 1)
    curr = [0] * (capacity + 1)
    # Alternate between prev and curr
    
# Technique 2: In-place update (single array)
def in_place_optimization():
    # Update single array in correct order
    dp = [0] * (capacity + 1)
    # Process backwards to avoid conflicts
    
# Technique 3: Sparse representation
def sparse_optimization():
    # Use dictionary for non-zero values only
    # Effective when most dp[i] = 0`,
      options: [
        "Use rolling arrays, in-place updates, and sparse representations based on problem characteristics",
        "Always use the most memory-efficient approach regardless of complexity",
        "Memory optimization is not important for knapsack problems",
        "Only optimize memory when the problem size is very large"
      ],
      correctAnswer: 0,
      hint: "Choose optimization technique based on the specific characteristics of your problem.",
      explanation: "Memory optimization should match problem characteristics: rolling arrays for 2D→1D reduction, in-place updates when safe, sparse representation when most values are zero.",
      followUpQuestions: [
        {
          question: "What's the trade-off between memory optimization and code clarity?",
          options: [
            "Optimized code is harder to understand and debug",
            "Memory savings may not be worth implementation complexity",
            "Balance optimization with maintainability needs",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Memory optimization trades code clarity for efficiency. Consider whether the memory savings justify the increased implementation complexity and reduced maintainability."
        }
      ]
    },
    {
      id: 83,
      topic: "Knapsack DP",
      functionName: "knapsack_time_optimization",
      difficulty: "Hard",
      question: "What techniques can optimize the time complexity of knapsack DP?",
      code: `# Time optimization techniques:

# Technique 1: Early pruning
def early_pruning():
    # Stop when remaining items can't improve solution
    remaining_value = sum(values[i:])
    if current_value + remaining_value <= best_so_far:
        return  # Prune this branch

# Technique 2: Preprocessing items
def preprocessing():
    # Sort by value/weight ratio for better pruning
    # Remove dominated items (strictly worse)
    items.sort(key=lambda x: x.value/x.weight, reverse=True)

# Technique 3: Approximation algorithms
def approximation():
    # Use FPTAS (Fully Polynomial-Time Approximation Scheme)
    # Trade accuracy for polynomial time guarantee

# Technique 4: Branch and bound
def branch_and_bound():
    # Use upper bounds to prune search space
    # Combine with DP for hybrid approach`,
      options: [
        "Combine pruning, preprocessing, approximation, and advanced algorithms based on requirements",
        "Always use the fastest algorithm regardless of accuracy",
        "Time optimization is only needed for very large instances",
        "Standard DP is already optimal, no improvements possible"
      ],
      correctAnswer: 0,
      hint: "Different optimization techniques serve different purposes and can be combined.",
      explanation: "Time optimization uses multiple techniques: early pruning (eliminate bad branches), preprocessing (improve efficiency), approximation (trade accuracy for speed), and advanced algorithms (hybrid approaches).",
      followUpQuestions: [
        {
          question: "When should you use approximation algorithms for knapsack?",
          options: [
            "When exact solution is too slow and approximate solution is acceptable",
            "When you need polynomial-time guarantees",
            "When the problem size makes exact DP infeasible",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Use approximation algorithms when exact solutions are too slow, you need polynomial-time guarantees, or when problem size makes exact DP infeasible."
        }
      ]
    },
    {
      id: 84,
      topic: "Knapsack DP",
      functionName: "knapsack_parallel_optimization",
      difficulty: "Hard",
      question: "How can knapsack DP be optimized for parallel execution?",
      code: `# Parallel optimization strategies:

# Strategy 1: Parallel item processing
def parallel_items():
    # Process independent items simultaneously
    # Requires careful synchronization of DP table updates
    
# Strategy 2: Parallel capacity processing  
def parallel_capacity():
    # Process different capacity ranges in parallel
    # Merge results from different threads
    
# Strategy 3: Pipeline parallelism
def pipeline_parallelism():
    # Pipeline different stages of DP computation
    # One thread computes while another processes results
    
# Strategy 4: Data parallelism
def data_parallelism():
    # Distribute DP table across multiple processors
    # Use message passing for coordination`,
      options: [
        "Use parallel strategies based on problem structure and available hardware",
        "Knapsack DP cannot be effectively parallelized",
        "Only parallel item processing is effective",
        "Parallel optimization always improves performance"
      ],
      correctAnswer: 0,
      hint: "Different parallel strategies work better for different problem characteristics and hardware.",
      explanation: "Parallel knapsack optimization depends on problem structure: parallel item processing for independent items, capacity parallelism for large capacity ranges, and pipeline/data parallelism for specific architectures.",
      followUpQuestions: [
        {
          question: "What are the main challenges in parallelizing knapsack DP?",
          options: [
            "Dependencies between DP states limit parallelization opportunities",
            "Synchronization overhead can outweigh parallel benefits",
            "Load balancing across processors is difficult",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Parallel knapsack DP faces challenges from state dependencies, synchronization overhead, and load balancing issues. Success depends on carefully managing these trade-offs."
        }
      ]
    },
    // ===============================================
    // STATE MACHINE DP QUESTIONS  
    // ===============================================
    // Missing Lines Questions - State Machine DP
    {
      id: 85,
      topic: "State Machine DP",
      functionName: "stock_trading_basic",
      difficulty: "Medium",
      question: "What's the missing line in basic stock trading state machine DP?",
      code: `def maxProfit(prices):
    if not prices:
        return 0
    
    # State definitions
    hold = -prices[0]  # Bought on day 0, profit = -price[0]
    sold = 0           # No transaction yet, profit = 0
    
    for i in range(1, len(prices)):
        # Update states (order matters - use previous values)
        new_hold = max(hold, -prices[i])      # Keep holding or buy today
        # MISSING LINE HERE - how to update sold state?
        new_sold = max(sold, hold + prices[i]) # Keep not holding or sell today
        
        hold, sold = new_hold, new_sold
    
    return sold  # Best profit when not holding (sold or never bought)`,
      options: [
        "new_sold = max(sold, hold + prices[i])",
        "new_sold = hold + prices[i]",
        "new_sold = max(sold, prices[i])",
        "new_sold = sold + prices[i]"
      ],
      correctAnswer: 0,
      hint: "We want to maximize profit when not holding stock - either keep previous state or sell today.",
      explanation: "We use max(sold, hold + prices[i]) because we want the maximum profit when not holding stock. We either keep the previous 'sold' state or sell the stock we were holding today.",
      followUpQuestions: [
        {
          question: "Why do we initialize hold = -prices[0] instead of 0?",
          options: [
            "Because buying stock on day 0 costs money, reducing our profit",
            "To represent the cost of the initial purchase",
            "Because we need a negative value to track buying",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "hold = -prices[0] represents buying stock on day 0, which costs money and reduces our current profit by the purchase price."
        }
      ]
    },
    {
      id: 86,
      topic: "State Machine DP",
      functionName: "stock_trading_cooldown",
      difficulty: "Hard",
      question: "What's the missing line in stock trading with cooldown state machine?",
      code: `def maxProfitWithCooldown(prices):
    if len(prices) <= 1:
        return 0
    
    # State definitions
    hold = -prices[0]  # Bought on day 0
    sold = 0           # Just sold (impossible on day 0, but init to 0)
    rest = 0           # Resting, can buy
    
    for i in range(1, len(prices)):
        # Calculate new states (order matters!)
        new_hold = max(hold, rest - prices[i])     # Keep holding or buy today
        new_sold = hold + prices[i]                # Sell today (must have been holding)
        # MISSING LINE HERE - how to update rest state?
        new_rest = max(rest, sold)                 # Keep resting or finish cooldown
        
        hold, sold, rest = new_hold, new_sold, new_rest
    
    return max(sold, rest)  # Don't end holding stock`,
      options: [
        "new_rest = max(rest, sold)",
        "new_rest = sold",
        "new_rest = max(rest, hold)",
        "new_rest = rest + sold"
      ],
      correctAnswer: 0,
      hint: "Rest state represents being able to buy - either continue resting or complete cooldown from previous sale.",
      explanation: "new_rest = max(rest, sold) because the rest state represents maximum profit when we can buy. We either continue resting or complete the cooldown from a sale that happened yesterday.",
      followUpQuestions: [
        {
          question: "Why does the cooldown mechanism work with this state transition?",
          options: [
            "sold state forces a one-day wait before buying again",
            "rest state can only be entered from sold state (after cooldown)",
            "The state machine enforces the cooldown constraint naturally",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "The cooldown works because: selling puts you in 'sold' state, you can only buy from 'rest' state, and 'rest' can only be reached from 'sold' (completing cooldown)."
        }
      ]
    },
    {
      id: 87,
      topic: "State Machine DP",
      functionName: "paint_house_colors",
      difficulty: "Medium",
      question: "What's the missing line in paint house color state machine?",
      code: `def minCost(costs):
    if not costs:
        return 0
    
    n = len(costs)
    
    # State: [red_cost, blue_cost, green_cost]
    red = costs[0][0]
    blue = costs[0][1] 
    green = costs[0][2]
    
    for i in range(1, n):
        # Calculate new costs (use temp variables to avoid conflicts)
        new_red = costs[i][0] + min(blue, green)      # Paint red, prev was blue/green
        new_blue = costs[i][1] + min(red, green)      # Paint blue, prev was red/green
        # MISSING LINE HERE - how to calculate new_green?
        new_green = costs[i][2] + min(red, blue)      # Paint green, prev was red/blue
        
        red, blue, green = new_red, new_blue, new_green
    
    return min(red, blue, green)`,
      options: [
        "new_green = costs[i][2] + min(red, blue)",
        "new_green = costs[i][2] + min(blue, green)",
        "new_green = costs[i][2] + min(red, green)",
        "new_green = costs[i][2] + red + blue"
      ],
      correctAnswer: 0,
      hint: "If we paint the current house green, what colors could the previous house have been?",
      explanation: "new_green = costs[i][2] + min(red, blue) because if we paint the current house green, the previous house must have been red or blue (not green, due to adjacency constraint).",
      followUpQuestions: [
        {
          question: "Why do we use temporary variables for the new states?",
          options: [
            "To avoid using updated values in the same iteration",
            "To prevent state conflicts during calculation",
            "To ensure we use previous iteration's values",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Temporary variables ensure we use the previous iteration's values for all calculations before updating the states, preventing conflicts from using partially updated values."
        }
      ]
    },
    {
      id: 88,
      topic: "State Machine DP",
      functionName: "state_machine_transitions",
      difficulty: "Hard",
      question: "What's the missing consideration in designing state machine transitions?",
      code: `def designStateMachine(problem):
    # Step 1: Identify all possible states
    states = identifyStates(problem)
    
    # Step 2: Define valid transitions between states
    transitions = {}
    for from_state in states:
        transitions[from_state] = []
        for to_state in states:
            # MISSING CONSIDERATION - what makes a transition valid?
            if isValidTransition(from_state, to_state, problem.constraints):
                cost = calculateTransitionCost(from_state, to_state)
                transitions[from_state].append((to_state, cost))
    
    # Step 3: DP with state transitions
    def solve():
        dp = {state: float('inf') for state in states}
        dp[initial_state] = 0
        
        for step in range(problem.steps):
            new_dp = {state: float('inf') for state in states}
            for from_state in states:
                for to_state, cost in transitions[from_state]:
                    new_dp[to_state] = min(new_dp[to_state], 
                                         dp[from_state] + cost)
            dp = new_dp
        
        return min(dp.values())`,
      options: [
        "Check if transition respects problem constraints and state invariants",
        "Ensure transition cost is non-negative",
        "Verify that all states are reachable",
        "Only allow transitions between adjacent states"
      ],
      correctAnswer: 0,
      hint: "Consider what rules or constraints determine whether you can move from one state to another.",
      explanation: "Valid transitions must respect problem constraints (like cooldown periods, adjacency rules) and maintain state invariants. The transition must be logically possible given the problem's rules.",
      followUpQuestions: [
        {
          question: "What happens if you allow invalid transitions in state machine DP?",
          options: [
            "The solution becomes incorrect",
            "Optimal substructure is violated",
            "Constraint violations occur",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Invalid transitions lead to incorrect solutions because they violate problem constraints, break optimal substructure, and can result in infeasible solutions."
        }
      ]
    },
    {
      id: 89,
      topic: "State Machine DP",
      functionName: "multi_dimensional_states",
      difficulty: "Hard",
      question: "What's the missing line in multi-dimensional state machine DP?",
      code: `def multiDimensionalStateMachine(data, constraints):
    # Example: Stock trading with transaction limit
    # State: (day, holding_status, transactions_used)
    
    n = len(data)
    max_transactions = constraints.max_transactions
    
    # dp[day][holding][transactions] = max profit
    dp = [[[0 for _ in range(max_transactions + 1)] 
           for _ in range(2)] for _ in range(n + 1)]
    
    for day in range(n):
        for holding in range(2):
            for trans in range(max_transactions + 1):
                # Don't do anything
                dp[day + 1][holding][trans] = max(
                    dp[day + 1][holding][trans], 
                    dp[day][holding][trans]
                )
                
                if holding == 0 and trans < max_transactions:
                    # Buy stock (use a transaction)
                    # MISSING LINE HERE - how to handle buying?
                    dp[day + 1][1][trans + 1] = max(
                        dp[day + 1][1][trans + 1],
                        dp[day][0][trans] - data[day]
                    )
                
                if holding == 1:
                    # Sell stock
                    dp[day + 1][0][trans] = max(
                        dp[day + 1][0][trans],
                        dp[day][1][trans] + data[day]
                    )
    
    return max(dp[n][0])`,
      options: [
        "dp[day + 1][1][trans + 1] = max(dp[day + 1][1][trans + 1], dp[day][0][trans] - data[day])",
        "dp[day + 1][1][trans] = max(dp[day + 1][1][trans], dp[day][0][trans] - data[day])",
        "dp[day + 1][0][trans + 1] = max(dp[day + 1][0][trans + 1], dp[day][0][trans] - data[day])",
        "dp[day + 1][1][trans + 1] = dp[day][0][trans] - data[day]"
      ],
      correctAnswer: 0,
      hint: "When buying stock, we transition from not holding to holding, and use up one transaction.",
      explanation: "When buying, we transition from holding=0 to holding=1 and increment transactions (trans to trans+1), while subtracting the stock price from our profit.",
      followUpQuestions: [
        {
          question: "Why do we increment transactions on buy rather than sell?",
          options: [
            "Convention - a transaction is defined as a buy-sell pair",
            "It doesn't matter as long as we're consistent",
            "Buy operations are more constrained than sell operations",
            "To simplify the state transitions"
          ],
          correctAnswer: 0,
          explanation: "By convention, a transaction is typically counted as a complete buy-sell cycle, and we can choose to count it at either the buy or sell operation, as long as we're consistent."
        }
      ]
    },
    // Conceptual Questions - State Machine DP
    {
      id: 90,
      topic: "State Machine DP",
      functionName: "state_machine_design_principles",
      difficulty: "Medium",
      question: "What are the key principles for designing effective state machines in DP?",
      code: `# State machine design principles:

# Principle 1: Minimal sufficient states
# Include only states that affect optimal decisions
# Avoid redundant or unnecessary states

# Principle 2: Clear state transitions
# Define valid transitions between states
# Ensure transitions respect problem constraints

# Principle 3: State invariants
# Each state should represent a consistent problem state
# Maintain invariants across transitions

# Principle 4: Optimal substructure preservation
# State transitions should preserve optimal substructure
# Subproblems should be independent given the state`,
      options: [
        "Minimal sufficient states, clear transitions, state invariants, optimal substructure",
        "Include all possible states for completeness",
        "Focus only on minimizing the number of states",
        "State design doesn't affect DP correctness"
      ],
      correctAnswer: 0,
      hint: "Good state machine design balances completeness with efficiency while maintaining correctness.",
      explanation: "Effective state machines need: minimal sufficient states (include what's necessary), clear transitions (respect constraints), consistent state invariants, and preserved optimal substructure.",
      followUpQuestions: [
        {
          question: "What happens if your state representation is insufficient?",
          options: [
            "The DP solution becomes incorrect",
            "Optimal substructure is violated",
            "You can't distinguish between different problem scenarios",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Insufficient state representation leads to incorrect solutions because you can't distinguish between scenarios that require different optimal choices."
        }
      ]
    },
    {
      id: 91,
      topic: "State Machine DP",
      functionName: "state_machine_complexity_analysis",
      difficulty: "Hard",
      question: "How do you analyze the complexity of state machine DP?",
      code: `# Complexity analysis for state machine DP:

def analyzeComplexity(problem):
    # Time complexity factors:
    num_steps = problem.time_steps        # Usually n (input size)
    num_states = problem.state_count      # Number of distinct states
    transitions_per_state = problem.avg_transitions  # Average transitions per state
    work_per_transition = problem.transition_cost    # Work to compute each transition
    
    # Time complexity = steps × states × transitions × work
    time_complexity = num_steps * num_states * transitions_per_state * work_per_transition
    
    # Space complexity factors:
    space_for_states = num_states         # Current state values
    space_for_history = num_steps * num_states  # If we need history
    
    # Space complexity (optimized)
    space_complexity = num_states  # Only current states if no history needed
    
    return time_complexity, space_complexity`,
      options: [
        "Time = steps × states × transitions × work_per_transition, Space = states (optimized)",
        "Time = O(n), Space = O(1) for all state machine DP",
        "Complexity depends only on the number of states",
        "State machine DP always has exponential complexity"
      ],
      correctAnswer: 0,
      hint: "Consider all factors that contribute to the computational cost.",
      explanation: "State machine DP complexity depends on: number of time steps, number of states, transitions per state, and work per transition. Space can often be optimized to just store current states.",
      followUpQuestions: [
        {
          question: "When does state machine DP become impractical due to complexity?",
          options: [
            "When the state space becomes exponentially large",
            "When transitions between states are expensive to compute",
            "When the number of time steps is very large",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "State machine DP becomes impractical with exponential state spaces, expensive transition computations, or very large time horizons. Consider approximations or alternative approaches in these cases."
        }
      ]
    },
    {
      id: 92,
      topic: "State Machine DP",
      functionName: "state_machine_vs_other_dp",
      difficulty: "Medium",
      question: "When should you use state machine DP versus other DP patterns?",
      code: `# Comparison of DP patterns:

# State Machine DP - Use when:
# - Problem has distinct states with transitions
# - Current choice affects future valid choices
# - Need to track "mode" or "status" information

# Linear DP - Use when:
# - Building solution step by step
# - Each step depends on previous steps
# - No complex state transitions

# Interval DP - Use when:
# - Working with ranges or intervals
# - Optimal solution for range depends on subranges
# - Problems involving splitting/merging

# Tree DP - Use when:
# - Problem structure is tree-like
# - Solution for node depends on children
# - Hierarchical decision making`,
      options: [
        "Use state machine DP when the problem has distinct states with constrained transitions",
        "State machine DP is always better than other DP patterns",
        "Use state machine DP only for trading problems",
        "The choice of DP pattern doesn't matter for correctness"
      ],
      correctAnswer: 0,
      hint: "Consider whether your problem naturally has different 'modes' or 'states' that affect valid actions.",
      explanation: "Use state machine DP when your problem has distinct states (like 'holding stock' vs 'not holding') with constrained transitions between states, and where the current state affects future valid actions.",
      followUpQuestions: [
        {
          question: "Can you combine state machine DP with other DP patterns?",
          options: [
            "Yes, you can have state machines on trees, intervals, etc.",
            "No, DP patterns are mutually exclusive",
            "Only in very specific cases",
            "It's theoretically possible but not practical"
          ],
          correctAnswer: 0,
          explanation: "DP patterns can be combined - you can have state machines on tree structures, interval problems with state transitions, etc. The key is identifying all the structural aspects of your problem."
        }
      ]
    },
    {
      id: 93,
      topic: "State Machine DP",
      functionName: "state_machine_debugging",
      difficulty: "Medium",
      question: "How do you debug and validate state machine DP solutions?",
      code: `# Debugging techniques for state machine DP:

def debugStateMachine(dp_solution):
    # Technique 1: State transition validation
    def validateTransitions():
        for from_state in states:
            for to_state in transitions[from_state]:
                assert isValidTransition(from_state, to_state)
    
    # Technique 2: Invariant checking
    def checkInvariants():
        for state in states:
            assert stateInvariantHolds(state)
    
    # Technique 3: Small example tracing
    def traceSmallExample():
        # Manually trace through a small example
        # Verify each state transition and value
        pass
    
    # Technique 4: Boundary condition testing
    def testBoundaries():
        # Test edge cases: empty input, single element, etc.
        pass`,
      options: [
        "Validate transitions, check invariants, trace examples, test boundaries",
        "Only test the final result",
        "Debugging is not necessary for DP solutions",
        "Use random testing to find bugs"
      ],
      correctAnswer: 0,
      hint: "Systematic debugging checks the logic at each level of the state machine.",
      explanation: "Debug state machine DP by: validating all transitions are legal, checking state invariants hold, manually tracing small examples, and testing boundary conditions.",
      followUpQuestions: [
        {
          question: "What's the most common source of bugs in state machine DP?",
          options: [
            "Invalid state transitions",
            "Incorrect initialization of base cases",
            "Using updated values in the same iteration",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Common bugs include: allowing invalid transitions, wrong base case initialization, and using values updated in the current iteration instead of previous values."
        }
      ]
    },
    // Optimization Questions - State Machine DP
    {
      id: 94,
      topic: "State Machine DP",
      functionName: "state_machine_space_optimization",
      difficulty: "Medium",
      question: "How can you optimize space usage in state machine DP?",
      code: `# Space optimization techniques:

# Technique 1: Rolling states (only keep current and previous)
def rolling_optimization():
    prev_states = {state: 0 for state in states}
    curr_states = {state: 0 for state in states}
    
    for step in range(n):
        # Update curr_states based on prev_states
        # Then swap: prev_states, curr_states = curr_states, prev_states

# Technique 2: In-place updates (when safe)
def in_place_optimization():
    # Update states in an order that doesn't create conflicts
    # Requires careful analysis of dependencies

# Technique 3: Sparse representation
def sparse_optimization():
    # Only store non-default state values
    # Use dictionaries instead of arrays for sparse state spaces`,
      options: [
        "Use rolling states, in-place updates, or sparse representation based on problem structure",
        "Always use the most space-efficient approach",
        "Space optimization is not important for state machine DP",
        "Only optimize space when memory is limited"
      ],
      correctAnswer: 0,
      hint: "Choose the optimization technique that matches your problem's characteristics.",
      explanation: "Space optimization should match the problem: rolling states when you only need previous step, in-place when safe, sparse representation when most states have default values.",
      followUpQuestions: [
        {
          question: "When is in-place update safe in state machine DP?",
          options: [
            "When state updates don't depend on other states in the same iteration",
            "When you can order updates to avoid conflicts",
            "When transitions form a DAG with no cycles",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "In-place updates are safe when there are no dependencies between states in the same iteration, updates can be ordered properly, or the transition graph has no cycles."
        }
      ]
    },
    {
      id: 95,
      topic: "State Machine DP",
      functionName: "state_machine_time_optimization",
      difficulty: "Hard",
      question: "What techniques can optimize the time complexity of state machine DP?",
      code: `# Time optimization techniques:

# Technique 1: State pruning
def state_pruning():
    # Eliminate states that can't lead to optimal solutions
    # Use bounds to prune impossible states
    
# Technique 2: Transition caching
def transition_caching():
    # Cache expensive transition computations
    # Reuse results when same transition occurs multiple times
    
# Technique 3: State aggregation
def state_aggregation():
    # Combine similar states when exact distinction isn't needed
    # Trade precision for speed
    
# Technique 4: Early termination
def early_termination():
    # Stop computation when optimal solution is found
    # Use bounds to detect when no improvement is possible`,
      options: [
        "Combine pruning, caching, aggregation, and early termination based on problem needs",
        "Time optimization is not possible for state machine DP",
        "Only state pruning is effective",
        "These techniques always improve performance"
      ],
      correctAnswer: 0,
      hint: "Different optimization techniques work better for different types of problems and constraints.",
      explanation: "Time optimization uses multiple techniques: state pruning (eliminate bad states), transition caching (reuse computations), state aggregation (combine similar states), and early termination (stop when optimal).",
      followUpQuestions: [
        {
          question: "What's the trade-off in state aggregation?",
          options: [
            "Faster computation vs. potentially suboptimal solutions",
            "Less memory usage vs. more complex implementation",
            "Better performance vs. reduced accuracy",
            "Both A and C"
          ],
          correctAnswer: 3,
          explanation: "State aggregation trades computation speed and memory usage for potentially suboptimal solutions and reduced accuracy, as we lose some precision in state distinctions."
        }
      ]
    },
    {
      id: 96,
      topic: "State Machine DP",
      functionName: "state_machine_advanced_optimization",
      difficulty: "Hard",
      question: "What advanced optimization techniques apply to state machine DP?",
      code: `# Advanced optimization techniques:

# Technique 1: Matrix exponentiation (for linear recurrences)
def matrix_exponentiation():
    # Represent state transitions as matrix multiplication
    # Use fast matrix exponentiation for large time horizons
    
# Technique 2: Convex hull optimization (for convex cost functions)
def convex_hull_optimization():
    # Use convex hull trick when costs have convex properties
    # Reduces complexity from O(n²) to O(n log n)
    
# Technique 3: Divide and conquer optimization
def divide_conquer_optimization():
    # Split time horizon and combine results
    # Effective when optimal solutions have special structure
    
# Technique 4: Approximation algorithms
def approximation_algorithms():
    # Use approximation when exact solution is too expensive
    # FPTAS for polynomial-time approximate solutions`,
      options: [
        "Apply advanced techniques when problem structure allows and performance requirements demand it",
        "Advanced techniques are too complex to be practical",
        "Only use these for academic problems",
        "These techniques always provide better solutions"
      ],
      correctAnswer: 0,
      hint: "Advanced techniques require specific problem structure and are used when standard DP is insufficient.",
      explanation: "Advanced optimizations like matrix exponentiation, convex hull tricks, divide-and-conquer, and approximation algorithms apply when problems have special structure and performance requirements exceed standard DP capabilities.",
      followUpQuestions: [
        {
          question: "When should you consider matrix exponentiation for state machine DP?",
          options: [
            "When the time horizon is very large (e.g., 10^9 steps)",
            "When state transitions are linear and can be represented as matrix multiplication",
            "When you need O(log n) time complexity instead of O(n)",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Matrix exponentiation is useful for very large time horizons with linear state transitions that can be represented as matrices, providing O(log n) complexity instead of O(n)."
        }
      ]
    },
    // ===============================================
    // INTERVAL DP QUESTIONS
    // ===============================================
    // Missing Lines Questions - Interval DP
    {
      id: 97,
      topic: "Interval DP",
      functionName: "longest_palindromic_substring",
      difficulty: "Medium",
      question: "What's the missing line in the expand around center approach for longest palindromic substring?",
      code: `def longestPalindrome(s):
    if not s:
        return ""
    
    start = 0
    max_len = 1
    
    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        # MISSING LINE HERE - what should we return?
        return right - left - 1  # Length of palindrome
    
    for i in range(len(s)):
        # Check for odd-length palindromes (center at i)
        len1 = expand_around_center(i, i)
        
        # Check for even-length palindromes (center between i and i+1)
        len2 = expand_around_center(i, i + 1)
        
        # Update if we found a longer palindrome
        current_max = max(len1, len2)
        if current_max > max_len:
            max_len = current_max
            start = i - (current_max - 1) // 2
    
    return s[start:start + max_len]`,
      options: [
        "return right - left - 1",
        "return right - left + 1",
        "return right - left",
        "return (right - left - 1) // 2"
      ],
      correctAnswer: 0,
      hint: "When the loop exits, left and right point to positions just outside the palindrome.",
      explanation: "We return right - left - 1 because when the loop exits, left and right are positioned just outside the valid palindrome. The actual palindrome spans from (left+1) to (right-1), so length = (right-1) - (left+1) + 1 = right - left - 1.",
      followUpQuestions: [
        {
          question: "Why do we check both odd and even length palindromes?",
          options: [
            "Palindromes can have different center structures",
            "Odd-length palindromes have a single center character",
            "Even-length palindromes have center between two characters",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We check both because palindromes can have different structures: odd-length (like 'aba') has a single center character, while even-length (like 'abba') has its center between two characters."
        }
      ]
    },
    {
      id: 98,
      topic: "Interval DP",
      functionName: "burst_balloons_optimal",
      difficulty: "Hard",
      question: "What's the missing line in burst balloons interval DP?",
      code: `def maxCoins(nums):
    # Add boundary balloons
    nums = [1] + nums + [1]
    n = len(nums)
    
    # dp[i][j] = max coins from bursting balloons in open interval (i,j)
    dp = [[0] * n for _ in range(n)]
    
    # Fill by increasing length
    for length in range(2, n):  # length of interval
        for i in range(n - length):
            j = i + length
            # Try each k as last balloon to burst in (i,j)
            for k in range(i + 1, j):
                # MISSING LINE HERE - how to calculate coins for bursting k last?
                coins = nums[i] * nums[k] * nums[j]
                dp[i][j] = max(dp[i][j], 
                             dp[i][k] + dp[k][j] + coins)
    
    return dp[0][n - 1]`,
      options: [
        "coins = nums[i] * nums[k] * nums[j]",
        "coins = nums[k]",
        "coins = nums[i] * nums[j]",
        "coins = nums[i] + nums[k] + nums[j]"
      ],
      correctAnswer: 0,
      hint: "When balloon k is burst last in interval (i,j), what are its neighbors?",
      explanation: "coins = nums[i] * nums[k] * nums[j] because when k is the last balloon to burst in interval (i,j), all other balloons in the interval are already gone, so k's neighbors are exactly nums[i] and nums[j].",
      followUpQuestions: [
        {
          question: "Why do we think about the 'last' balloon to burst instead of 'first'?",
          options: [
            "It's easier to determine neighbors when everything else is gone",
            "The last balloon's neighbors are fixed (boundary elements)",
            "It avoids complex state tracking of remaining balloons",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Thinking about the last balloon to burst is easier because: its neighbors are clearly defined (the boundary elements), we avoid tracking which balloons remain, and the subproblems become independent."
        }
      ]
    },
    {
      id: 99,
      topic: "Interval DP",
      functionName: "matrix_chain_multiplication",
      difficulty: "Hard",
      question: "What's the missing line in matrix chain multiplication DP?",
      code: `def matrixChainOrder(p):
    n = len(p) - 1  # number of matrices
    
    # dp[i][j] = min cost to multiply matrices from i to j
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    
    # Fill by increasing chain length
    for length in range(2, n + 1):  # chain length
        for i in range(1, n - length + 2):
            j = i + length - 1
            dp[i][j] = float('inf')
            
            # Try all possible split points
            for k in range(i, j):
                # MISSING LINE HERE - how to calculate cost?
                cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j]
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[1][n]`,
      options: [
        "cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j]",
        "cost = dp[i][k] + dp[k + 1][j] + p[i] * p[k] * p[j]",
        "cost = dp[i][k] + dp[k + 1][j]",
        "cost = p[i - 1] * p[k] * p[j]"
      ],
      correctAnswer: 0,
      hint: "The cost includes subproblems plus the cost of multiplying the two resulting matrices.",
      explanation: "cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j] because we add the costs of the left subproblem (i to k), right subproblem (k+1 to j), plus the cost of multiplying the two resulting matrices which have dimensions p[i-1]×p[k] and p[k]×p[j].",
      followUpQuestions: [
        {
          question: "Why is p[i-1] * p[k] * p[j] the multiplication cost?",
          options: [
            "Matrix A[i...k] has dimensions p[i-1] × p[k]",
            "Matrix A[k+1...j] has dimensions p[k] × p[j]",
            "Multiplying (p×q) by (q×r) costs p*q*r scalar operations",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "The cost p[i-1] * p[k] * p[j] comes from multiplying two matrices: the left result has dimensions p[i-1] × p[k], the right result has dimensions p[k] × p[j], and multiplying matrices of size (p×q) and (q×r) requires p*q*r scalar multiplications."
        }
      ]
    },
    {
      id: 100,
      topic: "Interval DP",
      functionName: "stone_game_minimax",
      difficulty: "Hard",
      question: "What's the missing line in stone game interval DP with minimax?",
      code: `def stoneGame(piles):
    n = len(piles)
    
    # dp[i][j] = max score advantage for current player in range [i,j]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single pile
    for i in range(n):
        dp[i][i] = piles[i]
    
    # Fill by increasing length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Current player picks left or right optimally
            pick_left = piles[i] - dp[i + 1][j]   # Pick i, opponent plays [i+1,j]
            # MISSING LINE HERE - how to calculate pick_right?
            pick_right = piles[j] - dp[i][j - 1]  # Pick j, opponent plays [i,j-1]
            
            dp[i][j] = max(pick_left, pick_right)
    
    # Alice wins if she has positive advantage
    return dp[0][n - 1] > 0`,
      options: [
        "pick_right = piles[j] - dp[i][j - 1]",
        "pick_right = piles[j] + dp[i][j - 1]",
        "pick_right = piles[j] - dp[i + 1][j]",
        "pick_right = -dp[i][j - 1]"
      ],
      correctAnswer: 0,
      hint: "If current player picks from the right, what advantage does the opponent get in the remaining range?",
      explanation: "pick_right = piles[j] - dp[i][j - 1] because the current player gains piles[j] points, but then the opponent plays optimally on the remaining range [i, j-1] and achieves dp[i][j-1] advantage, which reduces the current player's advantage.",
      followUpQuestions: [
        {
          question: "Why do we subtract the opponent's advantage instead of adding it?",
          options: [
            "dp[i][j] represents relative advantage (my_score - opponent_score)",
            "The opponent's gain is the current player's loss",
            "We're computing the score difference, not absolute scores",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We subtract because dp[i][j] represents the score advantage (current_player_score - opponent_score). The opponent's advantage in the subgame reduces our overall advantage."
        }
      ]
    },
    {
      id: 101,
      topic: "Interval DP",
      functionName: "palindrome_partitioning",
      difficulty: "Hard",
      question: "What's the missing line in palindrome partitioning interval DP?",
      code: `def minCut(s):
    n = len(s)
    if n <= 1:
        return 0
    
    # First, precompute palindrome information
    is_palindrome = [[False] * n for _ in range(n)]
    
    # Every single character is a palindrome
    for i in range(n):
        is_palindrome[i][i] = True
    
    # Check for palindromes of length 2
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            is_palindrome[i][i + 1] = True
    
    # Check for palindromes of length 3 and more
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            # MISSING LINE HERE - condition for palindrome?
            if s[i] == s[j] and is_palindrome[i + 1][j - 1]:
                is_palindrome[i][j] = True
    
    # DP for minimum cuts
    dp = [float('inf')] * n
    for i in range(n):
        if is_palindrome[0][i]:
            dp[i] = 0
        else:
            for j in range(i):
                if is_palindrome[j + 1][i]:
                    dp[i] = min(dp[i], dp[j] + 1)
    
    return dp[n - 1]`,
      options: [
        "if s[i] == s[j] and is_palindrome[i + 1][j - 1]:",
        "if s[i] == s[j]:",
        "if is_palindrome[i + 1][j - 1]:",
        "if s[i] == s[j] or is_palindrome[i + 1][j - 1]:"
      ],
      correctAnswer: 0,
      hint: "For a string to be a palindrome, what two conditions must be met?",
      explanation: "if s[i] == s[j] and is_palindrome[i + 1][j - 1]: A substring s[i:j+1] is a palindrome if the first and last characters match AND the substring between them is also a palindrome.",
      followUpQuestions: [
        {
          question: "Why do we precompute palindrome information instead of checking on the fly?",
          options: [
            "To avoid redundant palindrome checks",
            "To improve time complexity from O(n³) to O(n²)",
            "To separate concerns: palindrome detection vs. minimum cuts",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Precomputing palindrome information avoids redundant checks, improves time complexity by reusing results, and separates the palindrome detection logic from the minimum cut calculation."
        }
      ]
    },
    // Conceptual Questions - Interval DP
    {
      id: 102,
      topic: "Interval DP",
      functionName: "interval_dp_pattern_recognition",
      difficulty: "Medium",
      question: "How do you recognize when a problem requires interval DP?",
      code: `# Interval DP Pattern Recognition:

# Key indicators:
# 1. Problem involves contiguous subarrays/substrings
# 2. Optimal solution for range [i,j] depends on solutions for smaller ranges
# 3. Need to consider all possible ways to split/partition a range
# 4. Often involves "last operation" or "split point" thinking

# Common problem types:
# - Palindrome problems (longest, partitioning)
# - Optimal parenthesization (matrix chain, expression evaluation)
# - Game theory on ranges (stone game, burst balloons)
# - String/array partitioning with optimization

# Template structure:
# for length in range(2, n+1):          # Increasing range size
#     for i in range(n-length+1):       # All start positions
#         j = i + length - 1            # End position
#         for k in range(i, j):         # All split points
#             # Combine solutions from [i,k] and [k+1,j]`,
      options: [
        "Look for range-based problems with optimal substructure across intervals",
        "Use interval DP for all optimization problems",
        "Only use interval DP for palindrome problems",
        "Interval DP is just a variant of linear DP"
      ],
      correctAnswer: 0,
      hint: "Consider whether the problem involves making optimal decisions about contiguous ranges.",
      explanation: "Use interval DP when: working with contiguous ranges, optimal solution for a range depends on optimal solutions for subranges, need to consider different ways to split ranges, or the problem has a natural interval structure.",
      followUpQuestions: [
        {
          question: "What's the key difference between interval DP and linear DP?",
          options: [
            "Interval DP works on ranges, linear DP works on individual elements",
            "Interval DP considers all possible split points within a range",
            "Interval DP has 2D state space, linear DP typically has 1D",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Interval DP differs from linear DP in working with ranges instead of individual elements, considering multiple split points, and typically requiring 2D state representation."
        }
      ]
    },
    {
      id: 103,
      topic: "Interval DP",
      functionName: "interval_dp_state_design",
      difficulty: "Hard",
      question: "How should you design states for interval DP problems?",
      code: `# State design principles for interval DP:

# Principle 1: Range representation
# dp[i][j] typically represents optimal solution for range [i,j]
# Consider whether range is inclusive or exclusive on boundaries

# Principle 2: Additional dimensions
# Sometimes need extra dimensions: dp[i][j][k] where k represents:
# - Additional constraints (like remaining operations)
# - Player turn (in game theory problems)
# - State information that affects optimal choice

# Principle 3: Base cases
# Single elements: dp[i][i] (what happens with range of size 1?)
# Empty ranges: dp[i][i-1] (sometimes useful for boundary conditions)

# Principle 4: Transition design
# How to split range [i,j]? Usually try all k where i ≤ k < j
# Combine: dp[i][k] + dp[k+1][j] + additional_cost(i,k,j)`,
      options: [
        "Design states to capture range boundaries and any additional constraints affecting optimal choice",
        "Always use dp[i][j] for any interval problem",
        "Add as many dimensions as possible for completeness",
        "State design doesn't affect correctness in interval DP"
      ],
      correctAnswer: 0,
      hint: "Include in the state what you need to make optimal decisions for that range.",
      explanation: "State design should capture: the range boundaries (i,j), any additional constraints that affect optimal choices within that range, and ensure that subproblems are independent given the state representation.",
      followUpQuestions: [
        {
          question: "When do you need additional dimensions beyond [i][j] in interval DP?",
          options: [
            "When the optimal choice depends on information not captured by range boundaries",
            "When there are additional constraints or game theory elements",
            "When the problem has multiple players or phases",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Additional dimensions are needed when range boundaries alone don't capture all information needed for optimal decisions, such as constraints, player turns, or phase information."
        }
      ]
    },
    {
      id: 104,
      topic: "Interval DP",
      functionName: "interval_dp_complexity_optimization",
      difficulty: "Hard",
      question: "What are the main complexity considerations and optimizations for interval DP?",
      code: `# Complexity analysis and optimization:

# Standard complexity:
# Time: O(n³) - n² ranges × n split points per range
# Space: O(n²) - dp[i][j] for all ranges

# Optimization techniques:

# 1. Knuth-Yao speedup (for specific problems)
def knuth_yao_optimization():
    # When optimal split point has monotonicity property
    # Can reduce from O(n³) to O(n²)
    # Applies to problems like matrix chain multiplication
    pass

# 2. Convex hull optimization
def convex_hull_optimization():
    # When cost functions have convex properties
    # Use convex hull trick to reduce complexity
    pass

# 3. Sparse computation
def sparse_optimization():
    # Only compute ranges that are actually needed
    # Use memoization to avoid unnecessary computation
    pass`,
      options: [
        "Apply specific optimizations based on problem structure and mathematical properties",
        "Interval DP always has O(n³) complexity with no room for improvement",
        "Only space optimization is possible for interval DP",
        "Complexity optimization is not important for interval DP"
      ],
      correctAnswer: 0,
      hint: "Some interval DP problems have special mathematical properties that allow for optimization.",
      explanation: "Interval DP can be optimized using: Knuth-Yao speedup (for problems with optimal split point monotonicity), convex hull optimization (for convex cost functions), sparse computation (memoization), and problem-specific mathematical properties.",
      followUpQuestions: [
        {
          question: "What makes Knuth-Yao optimization applicable to an interval DP problem?",
          options: [
            "The optimal split point k for range [i,j] satisfies monotonicity properties",
            "If opt[i,j-1] ≤ opt[i,j] ≤ opt[i+1,j], then we can limit search space",
            "The cost function satisfies quadrangle inequality",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Knuth-Yao optimization applies when the optimal split points satisfy monotonicity (opt[i,j-1] ≤ opt[i,j] ≤ opt[i+1,j]) and the cost function satisfies quadrangle inequality, allowing us to limit the search space for split points."
        }
      ]
    },
    // Optimization Questions - Interval DP
    {
      id: 105,
      topic: "Interval DP",
      functionName: "interval_dp_memory_optimization",
      difficulty: "Medium",
      question: "How can you optimize memory usage in interval DP?",
      code: `# Memory optimization strategies:

# Strategy 1: Diagonal computation
def diagonal_optimization():
    # Compute DP table diagonal by diagonal
    # Only keep necessary diagonals in memory
    # Useful when only need final answer, not reconstruction
    
# Strategy 2: Rolling array for specific patterns
def rolling_array_optimization():
    # Some interval DP problems allow rolling arrays
    # Depends on dependency structure
    # Not applicable to all interval DP problems
    
# Strategy 3: Sparse storage
def sparse_storage_optimization():
    # Use hash maps for sparse DP tables
    # Only store non-zero/non-default values
    # Effective when many ranges have same default value
    
# Strategy 4: Reconstruction vs storage trade-off
def reconstruction_tradeoff():
    # Store only values, recompute optimal choices
    # Or store choices, recompute values
    # Choose based on what's needed`,
      options: [
        "Use diagonal computation, sparse storage, or reconstruction trade-offs based on problem needs",
        "Interval DP cannot be memory optimized due to 2D structure",
        "Always store the complete DP table for correctness",
        "Memory optimization is not important for interval DP"
      ],
      correctAnswer: 0,
      hint: "Consider what information you actually need to keep and what can be recomputed.",
      explanation: "Memory optimization in interval DP uses: diagonal computation (process and discard), sparse storage (hash maps), reconstruction trade-offs (store values or choices, not both), and careful analysis of what information is actually needed.",
      followUpQuestions: [
        {
          question: "When is sparse storage most effective for interval DP?",
          options: [
            "When many ranges have the same default value (often 0 or infinity)",
            "When the DP table is large but only partially filled",
            "When memory is more constrained than computation time",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Sparse storage is most effective when the DP table has many default values, is large but sparsely populated, and when memory constraints are more critical than the computational overhead of hash map operations."
        }
      ]
    },
    // ===============================================
    // LINEAR DP QUESTIONS
    // ===============================================
    // Missing Lines Questions - Linear DP
    {
      id: 106,
      topic: "Linear DP",
      functionName: "house_robber_linear",
      difficulty: "Medium",
      question: "What's the missing line in the house robber linear DP solution?",
      code: `def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Space-optimized DP
    prev2 = nums[0]              # dp[i-2] 
    prev1 = max(nums[0], nums[1]) # dp[i-1]
    
    for i in range(2, len(nums)):
        # MISSING LINE HERE - how to calculate current maximum?
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1`,
      options: [
        "current = max(prev1, prev2 + nums[i])",
        "current = prev2 + nums[i]",
        "current = prev1 + nums[i]",
        "current = max(prev1 + nums[i], prev2)"
      ],
      correctAnswer: 0,
      hint: "At each house, you can either rob it or skip it. What are the implications of each choice?",
      explanation: "current = max(prev1, prev2 + nums[i]) because we have two choices: skip the current house (take prev1), or rob the current house (take prev2 + nums[i], since we can't rob adjacent houses).",
      followUpQuestions: [
        {
          question: "Why can't we use prev1 + nums[i] as an option?",
          options: [
            "Because prev1 might include robbing the previous house",
            "We can't rob two adjacent houses",
            "It would violate the constraint",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We can't use prev1 + nums[i] because prev1 represents the maximum money up to the previous house, which might include robbing that house. Adding nums[i] would mean robbing two adjacent houses, violating the constraint."
        }
      ]
    },
    {
      id: 107,
      topic: "Linear DP",
      functionName: "climbing_stairs_fibonacci",
      difficulty: "Easy",
      question: "What's the missing line in the climbing stairs DP solution?",
      code: `def climbStairs(n):
    if n <= 1:
        return 1
    
    # Space-optimized Fibonacci
    prev2 = 1  # dp[i-2], ways to reach step 0
    prev1 = 1  # dp[i-1], ways to reach step 1
    
    for i in range(2, n + 1):
        # MISSING LINE HERE - how to calculate ways to reach step i?
        current = prev1 + prev2  # ways to reach step i
        prev2 = prev1
        prev1 = current
    
    return prev1`,
      options: [
        "current = prev1 + prev2",
        "current = max(prev1, prev2)",
        "current = prev1 * prev2",
        "current = prev1 + prev2 + 1"
      ],
      correctAnswer: 0,
      hint: "To reach step i, from which previous steps can you come?",
      explanation: "current = prev1 + prev2 because to reach step i, you can either come from step (i-1) by taking 1 step, or from step (i-2) by taking 2 steps. The total ways is the sum of ways to reach both previous positions.",
      followUpQuestions: [
        {
          question: "Why is this problem equivalent to Fibonacci sequence?",
          options: [
            "The recurrence relation is f(n) = f(n-1) + f(n-2)",
            "Each step depends on the sum of two previous steps",
            "The base cases are f(0) = 1, f(1) = 1",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Climbing stairs follows the Fibonacci pattern because: the recurrence is f(n) = f(n-1) + f(n-2), each value depends on summing two previous values, and the base cases match Fibonacci initialization."
        }
      ]
    },
    {
      id: 108,
      topic: "Linear DP",
      functionName: "decode_ways_string",
      difficulty: "Medium",
      question: "What's the missing line in the decode ways DP solution?",
      code: `def numDecodings(s):
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    # dp[i] represents ways to decode s[0:i]
    prev2 = 1  # dp[i-2]
    prev1 = 1  # dp[i-1]
    
    for i in range(1, n):
        current = 0
        
        # Take single digit s[i]
        if s[i] != '0':
            current += prev1
        
        # Take double digit s[i-1:i+1]
        two_digit = int(s[i-1:i+1])
        # MISSING LINE HERE - condition for valid double digit?
        if 10 <= two_digit <= 26:
            current += prev2
        
        prev2 = prev1
        prev1 = current
    
    return prev1`,
      options: [
        "if 10 <= two_digit <= 26:",
        "if two_digit <= 26:",
        "if 1 <= two_digit <= 26:",
        "if two_digit >= 10:"
      ],
      correctAnswer: 0,
      hint: "What range of two-digit numbers can be decoded into letters A-Z?",
      explanation: "if 10 <= two_digit <= 26: because valid two-digit decodings are 10-26 (corresponding to letters J-Z). Numbers less than 10 would have a leading zero (invalid), and numbers greater than 26 don't correspond to any letter.",
      followUpQuestions: [
        {
          question: "Why do we check s[i] != '0' for single digit decoding?",
          options: [
            "Because '0' doesn't correspond to any letter",
            "Letters are mapped to 1-26, not 0-25",
            "Leading zeros are not allowed in valid encodings",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We check s[i] != '0' because: '0' doesn't map to any letter (A=1, B=2, ..., Z=26), the encoding uses 1-26 not 0-25, and standalone '0' is not a valid encoding."
        }
      ]
    },
    {
      id: 109,
      topic: "Linear DP",
      functionName: "word_break_segmentation",
      difficulty: "Medium",
      question: "What's the missing line in the word break DP solution?",
      code: `def wordBreak(s, wordDict):
    word_set = set(wordDict)  # O(1) lookup
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string can be segmented
    
    for i in range(1, n + 1):
        # Try all possible starting positions for current segment
        for j in range(i):
            # MISSING LINE HERE - condition for valid segmentation?
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Found one valid segmentation
    
    return dp[n]`,
      options: [
        "if dp[j] and s[j:i] in word_set:",
        "if s[j:i] in word_set:",
        "if dp[j]:",
        "if dp[j] or s[j:i] in word_set:"
      ],
      correctAnswer: 0,
      hint: "For position i to be reachable, what two conditions must be satisfied?",
      explanation: "if dp[j] and s[j:i] in word_set: because we need both conditions: dp[j] must be True (string up to position j can be segmented) AND the substring s[j:i] must be a valid word in the dictionary.",
      followUpQuestions: [
        {
          question: "Why do we break after finding the first valid segmentation?",
          options: [
            "We only need to know if segmentation is possible, not count all ways",
            "Once dp[i] is True, we don't need to check other possibilities",
            "It's an optimization to avoid unnecessary computation",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We break because: the problem asks if segmentation is possible (boolean), once we find one valid way dp[i] = True, and continuing would be unnecessary computation without changing the result."
        }
      ]
    },
    {
      id: 110,
      topic: "Linear DP",
      functionName: "longest_increasing_subsequence",
      difficulty: "Medium",
      question: "What's the missing line in the LIS DP solution?",
      code: `def lengthOfLIS(nums):
    if not nums:
        return 0
    
    n = len(nums)
    # dp[i] = length of LIS ending at index i
    dp = [1] * n  # Each element forms LIS of length 1
    
    for i in range(1, n):
        for j in range(i):
            # MISSING LINE HERE - condition to extend LIS?
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)`,
      options: [
        "if nums[j] < nums[i]:",
        "if nums[j] <= nums[i]:",
        "if nums[j] > nums[i]:",
        "if j < i:"
      ],
      correctAnswer: 0,
      hint: "For an increasing subsequence, what relationship must exist between consecutive elements?",
      explanation: "if nums[j] < nums[i]: because for an increasing subsequence, each element must be strictly greater than the previous one. If nums[j] < nums[i], we can extend the LIS ending at j by including nums[i].",
      followUpQuestions: [
        {
          question: "Why do we use strict inequality (<) instead of (≤)?",
          options: [
            "Because we want strictly increasing subsequences",
            "Equal elements would not make the subsequence longer",
            "The problem typically asks for strictly increasing LIS",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We use strict inequality because: the problem asks for strictly increasing subsequences, equal elements don't contribute to 'increasing' nature, and including equal elements wouldn't make a meaningful longest increasing subsequence."
        }
      ]
    },
    // Conceptual Questions - Linear DP
    {
      id: 111,
      topic: "Linear DP",
      functionName: "linear_dp_pattern_recognition",
      difficulty: "Medium",
      question: "How do you recognize when a problem requires linear DP?",
      code: `# Linear DP Pattern Recognition:

# Key indicators:
# 1. Building solution step by step from left to right
# 2. Each step depends on a fixed number of previous steps
# 3. Optimal substructure: optimal solution contains optimal solutions to subproblems
# 4. Overlapping subproblems: same subproblems solved multiple times

# Common problem types:
# - Fibonacci-like sequences (climbing stairs, tribonacci)
# - Decision-based optimization (house robber, buy/sell stock)
# - String processing (decode ways, word break)
# - Subsequence problems (LIS, edit distance)

# Template structure:
# dp[i] = optimal solution for first i elements
# dp[i] = f(dp[i-1], dp[i-2], ..., nums[i])
# Base cases: dp[0], dp[1], etc.`,
      options: [
        "Look for sequential decision-making with optimal substructure and overlapping subproblems",
        "Use linear DP for all array-based problems",
        "Only use linear DP when the recurrence is Fibonacci-like",
        "Linear DP is the same as greedy algorithms"
      ],
      correctAnswer: 0,
      hint: "Consider whether you're making sequential decisions where each choice depends on previous optimal choices.",
      explanation: "Use linear DP when: building solutions sequentially, each step depends on previous steps, optimal substructure exists (optimal solution contains optimal subsolutions), and there are overlapping subproblems that can be memoized.",
      followUpQuestions: [
        {
          question: "What's the difference between linear DP and simple iteration?",
          options: [
            "Linear DP involves optimal decision-making at each step",
            "Linear DP has overlapping subproblems that benefit from memoization",
            "Linear DP exhibits optimal substructure property",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Linear DP differs from simple iteration by involving optimal decisions, having overlapping subproblems that benefit from storing results, and exhibiting optimal substructure where optimal solutions contain optimal subsolutions."
        }
      ]
    },
    {
      id: 112,
      topic: "Linear DP",
      functionName: "linear_dp_state_design",
      difficulty: "Hard",
      question: "How should you design states for linear DP problems?",
      code: `# State design principles for linear DP:

# Principle 1: State meaning
# dp[i] should represent optimal solution for a well-defined subproblem
# Common patterns:
# - dp[i] = optimal solution using first i elements
# - dp[i] = optimal solution ending at position i
# - dp[i] = optimal solution for range [0, i]

# Principle 2: State transitions
# Ensure transitions capture all possible ways to reach state i
# Consider what decisions can be made at position i
# Verify that all cases are covered

# Principle 3: Base cases
# Initialize states that don't depend on previous states
# Often dp[0] and sometimes dp[1] need special handling
# Ensure base cases are consistent with state definition

# Principle 4: Dimensionality
# Add dimensions only when necessary for correctness
# Each dimension should represent independent information needed for optimal choice`,
      options: [
        "Design states to capture exactly the information needed for optimal decisions",
        "Always use dp[i] to represent solution ending at position i",
        "Add as many dimensions as possible for safety",
        "State design doesn't affect the correctness of linear DP"
      ],
      correctAnswer: 0,
      hint: "Include in the state exactly what you need to make optimal decisions, nothing more, nothing less.",
      explanation: "State design should: capture the minimal information needed for optimal decisions, have clear meaning (ending at i vs. using first i elements), ensure proper base cases, and add dimensions only when they provide necessary information for correctness.",
      followUpQuestions: [
        {
          question: "When do you need multiple dimensions in linear DP state?",
          options: [
            "When optimal choice depends on additional constraints or information",
            "When you need to track multiple types of solutions simultaneously",
            "When the problem has multiple phases or modes",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Multiple dimensions are needed when: optimal choices depend on additional constraints, you need to track different solution types, there are multiple phases/modes, or when single dimension doesn't capture all information needed for optimal decisions."
        }
      ]
    },
    // Optimization Questions - Linear DP
    {
      id: 113,
      topic: "Linear DP",
      functionName: "linear_dp_space_optimization",
      difficulty: "Medium",
      question: "How can you optimize space complexity in linear DP?",
      code: `# Space optimization techniques for linear DP:

# Technique 1: Rolling variables (most common)
def space_optimized_dp():
    # Instead of dp[i] array, use only necessary previous values
    prev2 = base_case_0
    prev1 = base_case_1
    
    for i in range(2, n):
        current = f(prev1, prev2, nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1

# Technique 2: In-place modification (when possible)
def in_place_optimization():
    # Modify input array directly if allowed
    # Process in order that doesn't overwrite needed values
    
# Technique 3: Sliding window for fixed dependencies
def sliding_window_optimization():
    # When dp[i] depends on fixed range of previous values
    # Use circular buffer or deque`,
      options: [
        "Use rolling variables when only a few previous values are needed",
        "Always keep the full DP array for debugging purposes",
        "Space optimization is not possible in linear DP",
        "Only optimize space when memory is extremely limited"
      ],
      correctAnswer: 0,
      hint: "Consider how many previous values you actually need to compute the current value.",
      explanation: "Space optimization in linear DP: use rolling variables when only a few previous values are needed (most common), in-place modification when input can be modified, or sliding window for fixed-size dependencies. Optimize from O(n) to O(1) when possible.",
      followUpQuestions: [
        {
          question: "When is space optimization NOT advisable in linear DP?",
          options: [
            "When you need to reconstruct the optimal solution path",
            "When debugging and need to inspect intermediate values",
            "When the space savings are minimal but code becomes much more complex",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Avoid space optimization when: you need to reconstruct the solution path (need to trace back), debugging requires intermediate values, or when the complexity increase outweighs minimal space savings."
        }
      ]
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

  const topics = [
    'all', 
    'Knapsack DP', 
    'State Machine DP', 
    'Interval DP', 
    'Linear DP', 
    'Digit DP', 
    'Tree DP', 
    '2D Grid DP', 
    'String DP', 
    'Pattern Recognition', 
    'Optimization Techniques'
  ];
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                📚 Select Topic - 113 Total Questions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {topics.map((topic, index) => {
                  const topicColors: { [key: string]: string } = {
                    'all': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                    'Knapsack DP': 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
                    'State Machine DP': 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
                    'Interval DP': 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
                    'Linear DP': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                    'Digit DP': 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                    'Tree DP': 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
                    '2D Grid DP': 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                    'String DP': 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
                    'Pattern Recognition': 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
                    'Optimization Techniques': 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  };
                  
                  const topicQuestionCounts: { [key: string]: number } = {
                    'all': 113,
                    'Knapsack DP': 12,
                    'State Machine DP': 12,
                    'Interval DP': 9,
                    'Linear DP': 8,
                    'Digit DP': 15,
                    'Tree DP': 9,
                    '2D Grid DP': 9,
                    'String DP': 9,
                    'Pattern Recognition': 6,
                    'Optimization Techniques': 8
                  };
                  
                  const displayName = topic === 'all' ? 'All Topics' : topic;
                  const questionCount = topicQuestionCounts[topic] || 0;
                  
                  return (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-3 rounded-lg font-medium transition-all text-center ${
                        selectedTopic === topic
                          ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 shadow-lg transform scale-105'
                          : 'hover:scale-105'
                      } ${topicColors[topic] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      <div className="font-semibold text-sm">{displayName}</div>
                      <div className="text-xs opacity-75 mt-1">{questionCount}Q</div>
                    </button>
                  );
                })}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 text-xs mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-300">47 Missing Lines</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-300">57 Conceptual</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-300">8 Optimization</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredQuestions.length} questions available in selected topic
                </p>
              </div>
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

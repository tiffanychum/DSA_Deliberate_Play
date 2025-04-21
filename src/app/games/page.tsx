"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import AlgorithmVisualizer from '../components/AlgorithmVisualizer';
import { addXP } from '../utils/storage';
import NavLinks from '../components/NavLinks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import GameCard from '../components/GameCard';

// Near the top of the file, add a type definition for the code snippet
interface CodeSnippet {
  step: string;
  code: string;
  highlightLines: {[key: number]: boolean | undefined};
}

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState<{[key: string]: boolean}>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [algorithmStep, setAlgorithmStep] = useState<string>('');
  const [lineHighlights, setLineHighlights] = useState<{[key: number]: boolean}>({});
  
  // Memoize initialData objects
  const sortRaceData = useMemo(() => [38, 27, 43, 3, 9, 82, 10, 57, 29, 17], []);
  const binarySearchData = useMemo(() => ({ array: [3, 7, 11, 15, 19, 25, 36, 42, 51, 68, 74, 83, 99], target: 42 }), []);
  const dpChallengeData = useMemo(() => [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], []);
  const greedyAlgoData = useMemo(() => ({ coins: [1, 5, 10, 25], amount: 63 }), []);
  const bitwiseOpsData = useMemo(() => ({
    operations: [
      { name: 'AND', left: 0b10101010, right: 0b11001100, result: 0b10001000 },
      { name: 'OR', left: 0b10101010, right: 0b11001100, result: 0b11101110 },
      { name: 'XOR', left: 0b10101010, right: 0b11001100, result: 0b01100110 },
      { name: 'NOT', value: 0b10101010, result: 0b01010101 },
      { name: 'LEFT SHIFT', value: 0b00001111, shift: 2, result: 0b00111100 },
      { name: 'RIGHT SHIFT', value: 0b00001111, shift: 1, result: 0b00000111 }
    ],
    currentOperation: 0
  }), []);
  const bitWizardryData = useMemo(() => ({
    challenges: [
      { 
        name: 'XOR Swap', 
        a: 25, 
        b: 42,
        steps: [
          { a: 25, b: 42, operation: 'Initial Values' },
          { a: 25^42, b: 42, operation: 'a ^= b' },
          { a: 25^42, b: 42^(25^42), operation: 'b ^= a' },
          { a: (25^42)^(42^(25^42)), b: 42^(25^42), operation: 'a ^= b' }
        ] 
      },
      { 
        name: 'Power of 2 Check', 
        value: 64,
        operation: 'n & (n-1) == 0',
        result: true 
      },
      { 
        name: 'Isolate Rightmost Bit', 
        value: 88,
        operation: 'n & -n',
        result: 8
      }
    ],
    currentChallenge: 0,
    currentStep: 0
  }), []);
  
  // Extended games list with more algorithm concepts
  const games = [
    {
      id: 'sort-race',
      name: 'Sorting Race',
      description: 'Race different sorting algorithms against each other to see which one is fastest',
      icon: '🏎️',
      difficulty: 'Easy',
      type: 'array-sort',
      xp: 15,
      algorithm: 'quicksort',
      pythonCode: [
        {
          step: 'Start',
          code: `def quicksort(arr, low, high):
    if low < high:
        # Find the partition index
        pi = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)`,
          highlightLines: {1: true, 2: true}
        },
        {
          step: 'Partition',
          code: `def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    i = low - 1
    
    # Compare each element with pivot
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
          highlightLines: {3: true, 4: true}
        },
        {
          step: 'Compare Elements',
          code: `def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    i = low - 1
    
    # Compare each element with pivot
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
          highlightLines: {6: true, 7: true, 8: true, 9: true}
        },
        {
          step: 'Place Pivot',
          code: `def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    i = low - 1
    
    # Compare each element with pivot
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
          highlightLines: {12: true, 13: true}
        },
        {
          step: 'Recursive Calls',
          code: `def quicksort(arr, low, high):
    if low < high:
        # Find the partition index
        pi = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)`,
          highlightLines: {6: true, 7: true}
        },
        {
          step: 'Complete',
          code: `# Complete quicksort algorithm
def quicksort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
        
    if low < high:
        pi = partition(arr, low, high)
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)
    
    return arr`,
          highlightLines: {}
        }
      ]
    },
    {
      id: 'binary-search-treasure',
      name: 'Binary Search Treasure Hunt',
      description: 'Use binary search to find hidden treasures with as few guesses as possible',
      icon: '🔍',
      difficulty: 'Easy',
      type: 'binary-search',
      xp: 10,
      algorithm: 'binary_search',
      pythonCode: [
        {
          step: 'Start',
          code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        # Find the middle element
        mid = left + (right - left) // 2
        
        # Check if target is at mid
        if arr[mid] == target:
            return mid
        
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        
        # If target is smaller, ignore right half
        else:
            right = mid - 1
    
    # Target not found
    return -1`,
          highlightLines: {1: true, 2: true, 3: true}
        },
        {
          step: 'Calculate Mid',
          code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        # Find the middle element
        mid = left + (right - left) // 2
        
        # Check if target is at mid
        if arr[mid] == target:
            return mid
        
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        
        # If target is smaller, ignore right half
        else:
            right = mid - 1
    
    # Target not found
    return -1`,
          highlightLines: {5: true, 6: true, 7: true}
        },
        {
          step: 'Compare',
          code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        # Find the middle element
        mid = left + (right - left) // 2
        
        # Check if target is at mid
        if arr[mid] == target:
            return mid
        
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        
        # If target is smaller, ignore right half
        else:
            right = mid - 1
    
    # Target not found
    return -1`,
          highlightLines: {9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true}
        }
      ]
    },
    {
      id: 'graph-explorer',
      name: 'Graph Explorer',
      description: 'Navigate through a maze using graph traversal algorithms',
      icon: '🧭',
      difficulty: 'Medium',
      type: 'graph-traversal',
      xp: 20,
      algorithm: 'bfs',
      pythonCode: [
        {
          step: 'BFS Initialization',
          code: `from collections import deque

def bfs(graph, start):
    # Keep track of visited nodes
    visited = set([start])
    
    # Queue for BFS traversal
    queue = deque([start])
    
    # Result to store the traversal order
    result = []
    
    while queue:
        # Dequeue a vertex from queue
        vertex = queue.popleft()
        result.append(vertex)
        
        # Get all adjacent vertices
        # If an adjacent vertex hasn't been visited, 
        # mark it visited and enqueue it
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
          highlightLines: {3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true}
        },
        {
          step: 'Process Queue',
          code: `from collections import deque

def bfs(graph, start):
    # Keep track of visited nodes
    visited = set([start])
    
    # Queue for BFS traversal
    queue = deque([start])
    
    # Result to store the traversal order
    result = []
    
    while queue:
        # Dequeue a vertex from queue
        vertex = queue.popleft()
        result.append(vertex)
        
        # Get all adjacent vertices
        # If an adjacent vertex hasn't been visited, 
        # mark it visited and enqueue it
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
          highlightLines: {12: true, 13: true, 14: true}
        },
        {
          step: 'Process Neighbors',
          code: `from collections import deque

def bfs(graph, start):
    # Keep track of visited nodes
    visited = set([start])
    
    # Queue for BFS traversal
    queue = deque([start])
    
    # Result to store the traversal order
    result = []
    
    while queue:
        # Dequeue a vertex from queue
        vertex = queue.popleft()
        result.append(vertex)
        
        # Get all adjacent vertices
        # If an adjacent vertex hasn't been visited, 
        # mark it visited and enqueue it
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
          highlightLines: {17: true, 18: true, 19: true, 20: true, 21: true}
        }
      ]
    },
    {
      id: 'linked-list-puzzle',
      name: 'Linked List Puzzle',
      description: 'Rearrange linked list nodes to solve puzzles and complete patterns',
      icon: '🔗',
      difficulty: 'Medium',
      type: 'linked-list',
      xp: 20,
      algorithm: 'linked_list_ops',
      pythonCode: [
        {
          step: 'Node Definition',
          code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true}
        },
        {
          step: 'Insert at Head',
          code: `def insert_at_head(self, data):
    # Create a new node
    new_node = Node(data)
    
    # Make the new node point to current head
    new_node.next = self.head
    
    # Update the head to the new node
    self.head = new_node`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true}
        },
        {
          step: 'Insert at Tail',
          code: `def insert_at_tail(self, data):
    # Create a new node
    new_node = Node(data)
    
    # If the list is empty, make new node the head
    if self.head is None:
        self.head = new_node
        return
    
    # Otherwise, traverse to the end
    current = self.head
    while current.next:
        current = current.next
        
    # Add the new node at the end
    current.next = new_node`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true}
        },
        {
          step: 'Delete Node',
          code: `def delete_node(self, key):
    # Store head node
    temp = self.head
    
    # If head node itself holds the key to be deleted
    if temp and temp.data == key:
        self.head = temp.next
        return
    
    # Search for the key to be deleted
    while temp and temp.next:
        if temp.next.data == key:
            # Unlink the node from linked list
            temp.next = temp.next.next
            return
        temp = temp.next`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true}
        }
      ]
    },
    {
      id: 'tree-balancer',
      name: 'Tree Balancer',
      description: 'Balance binary search trees to optimize search operations',
      icon: '🌳',
      difficulty: 'Hard',
      type: 'tree-traversal',
      xp: 25,
      algorithm: 'tree_traversal',
      pythonCode: [
        {
          step: 'Tree Node Definition',
          code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true}
        },
        {
          step: 'Inorder Traversal',
          code: `def inorder_traversal(root):
    result = []
    
    def inorder(node):
        if not node:
            return
        
        # First recur on left subtree
        inorder(node.left)
        
        # Then process the root
        result.append(node.val)
        
        # Finally recur on right subtree
        inorder(node.right)
    
    inorder(root)
    return result`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true}
        },
        {
          step: 'Left Subtree Traversal',
          code: `def inorder_traversal(root):
    result = []
    
    def inorder(node):
        if not node:
            return
        
        # First recur on left subtree
        inorder(node.left)
        
        # Then process the root
        result.append(node.val)
        
        # Finally recur on right subtree
        inorder(node.right)
    
    inorder(root)
    return result`,
          highlightLines: {7: true, 8: true}
        },
        {
          step: 'Process Root',
          code: `def inorder_traversal(root):
    result = []
    
    def inorder(node):
        if not node:
            return
        
        # First recur on left subtree
        inorder(node.left)
        
        # Then process the root
        result.append(node.val)
        
        # Finally recur on right subtree
        inorder(node.right)
    
    inorder(root)
    return result`,
          highlightLines: {10: true, 11: true}
        },
        {
          step: 'Right Subtree Traversal',
          code: `def inorder_traversal(root):
    result = []
    
    def inorder(node):
        if not node:
            return
        
        # First recur on left subtree
        inorder(node.left)
        
        # Then process the root
        result.append(node.val)
        
        # Finally recur on right subtree
        inorder(node.right)
    
    inorder(root)
    return result`,
          highlightLines: {13: true, 14: true}
        },
        {
          step: 'Preorder Traversal',
          code: `def preorder_traversal(root):
    result = []
    
    def preorder(node):
        if not node:
            return
        
        # First process the root
        result.append(node.val)
        
        # Then recur on left subtree
        preorder(node.left)
        
        # Finally recur on right subtree
        preorder(node.right)
    
    preorder(root)
    return result`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true}
        },
        {
          step: 'Process Root First',
          code: `def preorder_traversal(root):
    result = []
    
    def preorder(node):
        if not node:
            return
        
        # First process the root
        result.append(node.val)
        
        # Then recur on left subtree
        preorder(node.left)
        
        # Finally recur on right subtree
        preorder(node.right)
    
    preorder(root)
    return result`,
          highlightLines: {7: true, 8: true}
        },
        {
          step: 'Postorder Traversal',
          code: `def postorder_traversal(root):
    result = []
    
    def postorder(node):
        if not node:
            return
        
        # First recur on left subtree
        postorder(node.left)
        
        # Then recur on right subtree
        postorder(node.right)
        
        # Finally process the root
        result.append(node.val)
    
    postorder(root)
    return result`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true}
        }
      ]
    },
    {
      id: 'dynamic-programming-challenge',
      name: 'Dynamic Programming Challenge',
      description: 'Solve classic optimization problems using dynamic programming techniques',
      icon: '🧮',
      difficulty: 'Hard',
      type: 'array-sort', // We'll reuse the visualizer UI but with custom code
      xp: 30,
      algorithm: 'dynamic_programming',
      url: '/games/dynamic-programming',
      pythonCode: [
        {
          step: 'Fibonacci with DP',
          code: `def fibonacci_dp(n):
    # Initialize DP table
    dp = [0] * (n + 1)
    
    # Base cases
    dp[0] = 0
    dp[1] = 1
    
    # Build up the table
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true}
        },
        {
          step: 'Initialize DP Table',
          code: `def fibonacci_dp(n):
    # Initialize DP table
    dp = [0] * (n + 1)
    
    # Base cases
    dp[0] = 0
    dp[1] = 1
    
    # Build up the table
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]`,
          highlightLines: {2: true, 3: true}
        },
        {
          step: 'Set Base Cases',
          code: `def fibonacci_dp(n):
    # Initialize DP table
    dp = [0] * (n + 1)
    
    # Base cases
    dp[0] = 0
    dp[1] = 1
    
    # Build up the table
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]`,
          highlightLines: {5: true, 6: true}
        },
        {
          step: 'Fill DP Table',
          code: `def fibonacci_dp(n):
    # Initialize DP table
    dp = [0] * (n + 1)
    
    # Base cases
    dp[0] = 0
    dp[1] = 1
    
    # Build up the table
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]`,
          highlightLines: {8: true, 9: true, 10: true}
        },
        {
          step: 'Knapsack Problem',
          code: `def knapsack(weights, values, capacity):
    n = len(weights)
    # Initialize DP table
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    # Build table in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                # Include the item or exclude it (take maximum)
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                # Cannot include the item
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true}
        },
        {
          step: 'Initialize Knapsack DP Table',
          code: `def knapsack(weights, values, capacity):
    n = len(weights)
    # Initialize DP table
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    # Build table in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                # Include the item or exclude it (take maximum)
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                # Cannot include the item
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]`,
          highlightLines: {3: true, 4: true}
        },
        {
          step: 'Build Knapsack Table',
          code: `def knapsack(weights, values, capacity):
    n = len(weights)
    # Initialize DP table
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    # Build table in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                # Include the item or exclude it (take maximum)
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                # Cannot include the item
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]`,
          highlightLines: {6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true}
        },
        {
          step: 'Longest Common Subsequence',
          code: `def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    
    # Initialize DP table
    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
    
    # Build table in bottom-up manner
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true}
        }
      ]
    },
    {
      id: 'greedy-algorithms',
      name: 'Greedy Algorithms',
      description: 'Learn how to make locally optimal choices to reach a global optimum',
      icon: '💰',
      difficulty: 'Medium',
      type: 'array-sort', // Reusing visualizer
      xp: 20,
      algorithm: 'greedy',
      pythonCode: [
        {
          step: 'Activity Selection',
          code: `def activity_selection(start, finish):
    n = len(start)
    
    # Sort activities based on finish time
    activities = sorted(zip(start, finish), key=lambda x: x[1])
    start, finish = zip(*activities)
    
    # Select first activity
    i = 0
    selected = [i]
    
    # Consider rest of the activities
    for j in range(1, n):
        # If this activity has start time greater than
        # or equal to the finish time of previously 
        # selected activity, then select it
        if start[j] >= finish[i]:
            selected.append(j)
            i = j
    
    return selected`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true}
        },
        {
          step: 'Sort by Finish Time',
          code: `def activity_selection(start, finish):
    n = len(start)
    
    # Sort activities based on finish time
    activities = sorted(zip(start, finish), key=lambda x: x[1])
    start, finish = zip(*activities)
    
    # Select first activity
    i = 0
    selected = [i]
    
    # Consider rest of the activities
    for j in range(1, n):
        # If this activity has start time greater than
        # or equal to the finish time of previously 
        # selected activity, then select it
        if start[j] >= finish[i]:
            selected.append(j)
            i = j
    
    return selected`,
          highlightLines: {4: true, 5: true}
        },
        {
          step: 'Select First Activity',
          code: `def activity_selection(start, finish):
    n = len(start)
    
    # Sort activities based on finish time
    activities = sorted(zip(start, finish), key=lambda x: x[1])
    start, finish = zip(*activities)
    
    # Select first activity
    i = 0
    selected = [i]
    
    # Consider rest of the activities
    for j in range(1, n):
        # If this activity has start time greater than
        # or equal to the finish time of previously 
        # selected activity, then select it
        if start[j] >= finish[i]:
            selected.append(j)
            i = j
    
    return selected`,
          highlightLines: {8: true, 9: true}
        },
        {
          step: 'Greedy Choice',
          code: `def activity_selection(start, finish):
    n = len(start)
    
    # Sort activities based on finish time
    activities = sorted(zip(start, finish), key=lambda x: x[1])
    start, finish = zip(*activities)
    
    # Select first activity
    i = 0
    selected = [i]
    
    # Consider rest of the activities
    for j in range(1, n):
        # If this activity has start time greater than
        # or equal to the finish time of previously 
        # selected activity, then select it
        if start[j] >= finish[i]:
            selected.append(j)
            i = j
    
    return selected`,
          highlightLines: {11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true}
        },
        {
          step: 'Fractional Knapsack',
          code: `def fractional_knapsack(weights, values, capacity):
    # Create a list of (value, weight, value/weight) tuples
    items = [(values[i], weights[i], values[i]/weights[i]) 
             for i in range(len(weights))]
    
    # Sort items by value-to-weight ratio in descending order
    items.sort(key=lambda x: x[2], reverse=True)
    
    total_value = 0
    
    for value, weight, ratio in items:
        if capacity >= weight:
            # Take the whole item
            total_value += value
            capacity -= weight
        else:
            # Take a fraction of the item
            total_value += value * capacity / weight
            break
    
    return total_value`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true}
        },
        {
          step: 'Sort by Value-to-Weight Ratio',
          code: `def fractional_knapsack(weights, values, capacity):
    # Create a list of (value, weight, value/weight) tuples
    items = [(values[i], weights[i], values[i]/weights[i]) 
             for i in range(len(weights))]
    
    # Sort items by value-to-weight ratio in descending order
    items.sort(key=lambda x: x[2], reverse=True)
    
    total_value = 0
    
    for value, weight, ratio in items:
        if capacity >= weight:
            # Take the whole item
            total_value += value
            capacity -= weight
        else:
            # Take a fraction of the item
            total_value += value * capacity / weight
            break
    
    return total_value`,
          highlightLines: {2: true, 3: true, 4: true, 6: true, 7: true}
        },
        {
          step: 'Take Items Greedily',
          code: `def fractional_knapsack(weights, values, capacity):
    # Create a list of (value, weight, value/weight) tuples
    items = [(values[i], weights[i], values[i]/weights[i]) 
             for i in range(len(weights))]
    
    # Sort items by value-to-weight ratio in descending order
    items.sort(key=lambda x: x[2], reverse=True)
    
    total_value = 0
    
    for value, weight, ratio in items:
        if capacity >= weight:
            # Take the whole item
            total_value += value
            capacity -= weight
        else:
            # Take a fraction of the item
            total_value += value * capacity / weight
            break
    
    return total_value`,
          highlightLines: {10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true}
        },
        {
          step: 'Huffman Coding',
          code: `import heapq
from collections import defaultdict

def huffman_encoding(data):
    if not data:
        return "", {}
    
    # Count frequency of each character
    frequency = defaultdict(int)
    for char in data:
        frequency[char] += 1
    
    # Create a priority queue (min heap)
    heap = [[freq, [char, ""]] for char, freq in frequency.items()]
    heapq.heapify(heap)
    
    # Build Huffman tree
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    
    # Extract codes from the tree
    huffman_codes = {char: code for char, code in sorted(heap[0][1:])}
    
    # Encode the data
    encoded_data = ''.join(huffman_codes[char] for char in data)
    
    return encoded_data, huffman_codes`,
          highlightLines: {1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true, 25: true, 26: true, 27: true, 28: true, 29: true, 30: true, 31: true, 32: true, 33: true, 34: true, 35: true}
        },
        {
          step: 'Count Frequencies',
          code: `import heapq
from collections import defaultdict

def huffman_encoding(data):
    if not data:
        return "", {}
    
    # Count frequency of each character
    frequency = defaultdict(int)
    for char in data:
        frequency[char] += 1
    
    # Create a priority queue (min heap)
    heap = [[freq, [char, ""]] for char, freq in frequency.items()]
    heapq.heapify(heap)
    
    # Build Huffman tree
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    
    # Extract codes from the tree
    huffman_codes = {char: code for char, code in sorted(heap[0][1:])}
    
    # Encode the data
    encoded_data = ''.join(huffman_codes[char] for char in data)
    
    return encoded_data, huffman_codes`,
          highlightLines: {8: true, 9: true, 10: true, 11: true}
        },
        {
          step: 'Build Huffman Tree',
          code: `import heapq
from collections import defaultdict

def huffman_encoding(data):
    if not data:
        return "", {}
    
    # Count frequency of each character
    frequency = defaultdict(int)
    for char in data:
        frequency[char] += 1
    
    # Create a priority queue (min heap)
    heap = [[freq, [char, ""]] for char, freq in frequency.items()]
    heapq.heapify(heap)
    
    # Build Huffman tree
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    
    # Extract codes from the tree
    huffman_codes = {char: code for char, code in sorted(heap[0][1:])}
    
    # Encode the data
    encoded_data = ''.join(huffman_codes[char] for char in data)
    
    return encoded_data, huffman_codes`,
          highlightLines: {16: true, 17: true, 18: true, 19: true, 20: true, 21: true, 22: true, 23: true, 24: true, 25: true, 26: true}
        }
      ]
    },
    {
      id: 'bitwise-operations',
      name: 'Bitwise Operations',
      description: 'Master the fundamental bitwise operations with interactive puzzles',
      icon: '⚙️',
      difficulty: 'Medium',
      type: 'bit-manipulation',
      xp: 25,
      url: '/games/bitwise-operations',
      algorithm: 'bitwise'
    },
    {
      id: 'bit-wizardry',
      name: 'Bit Wizardry',
      description: 'Advanced bit manipulation techniques including XOR swap, power of 2 detection, and more',
      icon: '🧙',
      difficulty: 'Hard',
      type: 'bit-manipulation',
      xp: 35,
      url: '/games/bit-wizardry',
      algorithm: 'bit-algorithms'
    }
  ];
  
  const handleGameComplete = useCallback((gameId: string) => {
    if (!gameCompleted[gameId]) {
      // Find the game
      const game = games.find(g => g.id === gameId);
      if (game) {
        // Add XP
        addXP(game.xp);
        // Mark as completed
        setGameCompleted(prev => ({
          ...prev,
          [gameId]: true
        }));
      }
    }
  }, [gameCompleted]);
  
  // Replace the getCurrentCodeSnippet function with this improved version
  // Then update the getCurrentCodeSnippet function to use this type
  const getCurrentCodeSnippet = (gameId: string, stepNum: number): CodeSnippet | null => {
    const game = games.find(g => g.id === gameId);
    if (!game || !game.pythonCode) return null;
    
    const totalSteps = game.pythonCode.length;
    if (totalSteps === 0) return null;
    
    // Custom step mappings for each algorithm type
    if (gameId === 'sort-race') {
      // Quicksort step mappings
      if (stepNum < 10) return game.pythonCode[0]; // Initial setup
      else if (stepNum < 30) return game.pythonCode[1]; // Partition selection
      else if (stepNum < 60) return game.pythonCode[2]; // Compare elements
      else if (stepNum < 75) return game.pythonCode[3]; // Place pivot
      else if (stepNum < 90) return game.pythonCode[4]; // Recursive calls
      else return game.pythonCode[5]; // Complete
    } 
    else if (gameId === 'binary-search-treasure') {
      // Binary search step mappings
      if (stepNum < 15) return game.pythonCode[0]; // Initial setup
      else if (stepNum < 50) return game.pythonCode[1]; // Calculate mid
      else return game.pythonCode[2]; // Compare
    }
    else if (gameId === 'graph-explorer') {
      // BFS step mappings
      if (stepNum < 20) return game.pythonCode[0]; // BFS initialization
      else if (stepNum < 60) return game.pythonCode[1]; // Process queue
      else return game.pythonCode[2]; // Process neighbors
    }
    else if (gameId === 'linked-list-puzzle') {
      // Linked list step mappings
      const stepPercentage = Math.min(stepNum / 100, 0.99);
      const snippetIndex = Math.min(Math.floor(stepPercentage * totalSteps), totalSteps - 1);
      return game.pythonCode[snippetIndex];
    }
    else if (gameId === 'tree-balancer') {
      // Tree traversal step mappings
      if (stepNum < 10) return game.pythonCode[0]; // Node definition
      else if (stepNum < 20) return game.pythonCode[1]; // Inorder setup
      else if (stepNum < 40) return game.pythonCode[2]; // Left subtree
      else if (stepNum < 60) return game.pythonCode[3]; // Process root
      else if (stepNum < 70) return game.pythonCode[4]; // Right subtree
      else if (stepNum < 80) return game.pythonCode[5]; // Preorder setup
      else if (stepNum < 90) return game.pythonCode[6]; // Process root first
      else return game.pythonCode[7]; // Postorder
    }
    else if (gameId === 'dynamic-programming-challenge') {
      // DP step mappings
      if (stepNum < 10) return game.pythonCode[0]; // Fibonacci overview
      else if (stepNum < 25) return game.pythonCode[1]; // Initialize table
      else if (stepNum < 40) return game.pythonCode[2]; // Base cases
      else if (stepNum < 60) return game.pythonCode[3]; // Fill table
      else if (stepNum < 70) return game.pythonCode[4]; // Knapsack overview
      else if (stepNum < 80) return game.pythonCode[5]; // Init Knapsack table
      else if (stepNum < 90) return game.pythonCode[6]; // Build Knapsack table
      else return game.pythonCode[7]; // LCS
    }
    else if (gameId === 'greedy-algorithms') {
      // Greedy algorithms step mappings
      if (stepNum < 15) return game.pythonCode[0]; // Activity Selection overview
      else if (stepNum < 30) return game.pythonCode[1]; // Sort by finish time
      else if (stepNum < 45) return game.pythonCode[2]; // Select first activity
      else if (stepNum < 60) return game.pythonCode[3]; // Greedy choice
      else if (stepNum < 70) return game.pythonCode[4]; // Fractional Knapsack overview
      else if (stepNum < 80) return game.pythonCode[5]; // Sort by value-to-weight
      else if (stepNum < 90) return game.pythonCode[6]; // Take items greedily
      else return game.pythonCode[7]; // Huffman Coding
    }
    else if (gameId === 'bitwise-operations') {
      // Bitwise operations step mappings
      if (stepNum < 10) return game.pythonCode[0]; // Bitwise AND
      else if (stepNum < 20) return game.pythonCode[1]; // Bitwise OR
      else if (stepNum < 30) return game.pythonCode[2]; // Bitwise XOR
      else if (stepNum < 40) return game.pythonCode[3]; // Bitwise NOT
      else if (stepNum < 50) return game.pythonCode[4]; // Left Shift
      else if (stepNum < 60) return game.pythonCode[5]; // Right Shift
      else return game.pythonCode[6]; // Complete
    }
    
    // Default fallback to simple proportional mapping
    if (stepNum === 0) return game.pythonCode[0]; // First step
    else if (stepNum >= 98) return game.pythonCode[totalSteps - 1]; // Last step
    else {
      const normalizedStepNum = Math.floor((stepNum / 98) * (totalSteps - 1));
      return game.pythonCode[Math.min(normalizedStepNum, totalSteps - 1)];
    }
  };
  
  // Handle step change from visualizer
  const handleStepChange = useCallback((step: number, metadata?: any) => {
    setCurrentStep(step);
    
    // Update algorithm step name if provided in metadata
    if (metadata?.stepName) {
      setAlgorithmStep(metadata.stepName);
    } else {
      // Reset to default from code snippet
      const snippet = getCurrentCodeSnippet(selectedGame || '', step);
      setAlgorithmStep(snippet?.step || '');
    }
    
    // Update line highlights if provided in metadata
    if (metadata?.lineHighlights) {
      // Filter out undefined values and convert to required type
      const highlights: {[key: number]: boolean} = {};
      Object.entries(metadata.lineHighlights).forEach(([key, value]) => {
        if (value !== undefined) {
          highlights[Number(key)] = Boolean(value);
        }
      });
      setLineHighlights(highlights);
    } else {
      // Reset to default from code snippet
      const snippet = getCurrentCodeSnippet(selectedGame || '', step);
      if (snippet?.highlightLines) {
        const highlights: {[key: number]: boolean} = {};
        Object.entries(snippet.highlightLines).forEach(([key, value]) => {
          if (value !== undefined) {
            highlights[Number(key)] = Boolean(value);
          }
        });
        setLineHighlights(highlights);
      } else {
        setLineHighlights({});
      }
    }
  }, [selectedGame]); // Added useCallback and selectedGame dependency

  // Add displayCodeForAlgorithm function to show complete code based on algorithm type
  const displayCodeForAlgorithm = (gameId: string): string => {
    const game = games.find(g => g.id === gameId);
    if (!game) return '# No code available';

    switch (gameId) {
      case 'sort-race':
        return `def quicksort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
        
    if low < high:
        # Find the partition index
        pi = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)
    
    return arr

def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    i = low - 1
    
    # Compare each element with pivot
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`;

      case 'binary-search-treasure':
        return `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        # Find the middle element
        mid = left + (right - left) // 2
        
        # Check if target is at mid
        if arr[mid] == target:
            return mid
        
        # If target is greater, ignore left half
        elif arr[mid] < target:
            left = mid + 1
        
        # If target is smaller, ignore right half
        else:
            right = mid - 1
    
    # Target not found
    return -1`;

      case 'graph-explorer':
        return `from collections import deque

def bfs(graph, start):
    # Keep track of visited nodes
    visited = set([start])
    
    # Queue for BFS traversal
    queue = deque([start])
    
    # Result to store the traversal order
    result = []
    
    while queue:
        # Dequeue a vertex from queue
        vertex = queue.popleft()
        result.append(vertex)
        
        # Get all adjacent vertices
        # If an adjacent vertex hasn't been visited, 
        # mark it visited and enqueue it
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return result`;

      case 'linked-list-puzzle':
        return `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        
    def insert_at_head(self, data):
        # Create a new node
        new_node = Node(data)
        
        # Make the new node point to current head
        new_node.next = self.head
        
        # Update the head to the new node
        self.head = new_node
        
    def insert_at_tail(self, data):
        # Create a new node
        new_node = Node(data)
        
        # If the list is empty, make new node the head
        if self.head is None:
            self.head = new_node
            return
        
        # Otherwise, traverse to the end
        current = self.head
        while current.next:
            current = current.next
            
        # Add the new node at the end
        current.next = new_node
        
    def delete_node(self, key):
        # Store head node
        temp = self.head
        
        # If head node itself holds the key to be deleted
        if temp and temp.data == key:
            self.head = temp.next
            return
        
        # Search for the key to be deleted
        while temp and temp.next:
            if temp.next.data == key:
                # Unlink the node from linked list
                temp.next = temp.next.next
                return
            temp = temp.next`;

      case 'tree-balancer':
        return `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
        
def inorder_traversal(root):
    result = []
    
    def inorder(node):
        if not node:
            return
        
        # First recur on left subtree
        inorder(node.left)
        
        # Then process the root
        result.append(node.val)
        
        # Finally recur on right subtree
        inorder(node.right)
    
    inorder(root)
    return result
    
def preorder_traversal(root):
    result = []
    
    def preorder(node):
        if not node:
            return
        
        # First process the root
        result.append(node.val)
        
        # Then recur on left subtree
        preorder(node.left)
        
        # Finally recur on right subtree
        preorder(node.right)
    
    preorder(root)
    return result
    
def postorder_traversal(root):
    result = []
    
    def postorder(node):
        if not node:
            return
        
        # First recur on left subtree
        postorder(node.left)
        
        # Then recur on right subtree
        postorder(node.right)
        
        # Finally process the root
        result.append(node.val)
    
    postorder(root)
    return result`;

      case 'dynamic-programming-challenge':
        return `def fibonacci_dp(n):
    # Initialize DP table
    dp = [0] * (n + 1)
    
    # Base cases
    dp[0] = 0
    dp[1] = 1
    
    # Build up the table
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
    
def knapsack(weights, values, capacity):
    n = len(weights)
    # Initialize DP table
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    # Build table in bottom-up manner
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                # Include the item or exclude it (take maximum)
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                # Cannot include the item
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]
    
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    
    # Initialize DP table
    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
    
    # Build table in bottom-up manner
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]`;

      case 'greedy-algorithms':
        return `def activity_selection(start, finish):
    n = len(start)
    
    # Sort activities based on finish time
    activities = sorted(zip(start, finish), key=lambda x: x[1])
    start, finish = zip(*activities)
    
    # Select first activity
    i = 0
    selected = [i]
    
    # Consider rest of the activities
    for j in range(1, n):
        # If this activity has start time greater than
        # or equal to the finish time of previously 
        # selected activity, then select it
        if start[j] >= finish[i]:
            selected.append(j)
            i = j
    
    return selected
    
def fractional_knapsack(weights, values, capacity):
    # Create a list of (value, weight, value/weight) tuples
    items = [(values[i], weights[i], values[i]/weights[i]) 
             for i in range(len(weights))]
    
    # Sort items by value-to-weight ratio in descending order
    items.sort(key=lambda x: x[2], reverse=True)
    
    total_value = 0
    
    for value, weight, ratio in items:
        if capacity >= weight:
            # Take the whole item
            total_value += value
            capacity -= weight
        else:
            # Take a fraction of the item
            total_value += value * capacity / weight
            break
    
    return total_value`;

      case 'bitwise-operations':
        return `def bitwise_and(a, b):
    return a & b
    
def bitwise_or(a, b):
    return a | b
    
def bitwise_xor(a, b):
    return a ^ b
    
def bitwise_not(a):
    return ~a
    
def left_shift(a, n):
    return a << n
    
def right_shift(a, n):
    return a >> n`;

      case 'bit-wizardry':
        return `def xor_swap(a, b):
    a = a ^ b
    b = a ^ b
    a = a ^ b
    return a, b
    
def power_of_2(n):
    return (n & (n - 1)) == 0
    
def add_one(n):
    return -~n`;

      default:
        return '# No code available for this algorithm';
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
            
            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Algorithm Games</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Learn algorithms through interactive gameplay. These fun games will help you understand complex concepts while having fun!
          </p>
        </div>
        
        {selectedGame ? (
          <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg overflow-hidden mb-8 border border-white/20 dark:border-gray-700/30">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {games.find(g => g.id === selectedGame)?.name}
                </h2>
              </div>
              
              {gameCompleted[selectedGame] && (
                <div className="text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Completed! +{games.find(g => g.id === selectedGame)?.xp} XP
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[700px] flex flex-col">
                  {/* Algorithm Visualizer */}
                  <div className="flex-grow flex flex-col h-full">
                    {selectedGame === 'sort-race' && (
                      <AlgorithmVisualizer 
                        type="array-sort"
                        initialData={sortRaceData} // Use memoized data
                        onComplete={() => handleGameComplete('sort-race')}
                        onStepChange={handleStepChange}
                      />
                    )}
                    
                    {selectedGame === 'binary-search-treasure' && (
                      <AlgorithmVisualizer 
                        type="binary-search"
                        initialData={binarySearchData} // Use memoized data
                        onComplete={() => handleGameComplete('binary-search-treasure')}
                        onStepChange={handleStepChange}
                      />
                    )}
                    
                    {selectedGame === 'graph-explorer' && (
                      <AlgorithmVisualizer 
                        type="graph-traversal"
                        // No initialData needed for default graph
                        onComplete={() => handleGameComplete('graph-explorer')}
                        onStepChange={handleStepChange}
                      />
                    )}
                    
                    {selectedGame === 'linked-list-puzzle' && (
                      <AlgorithmVisualizer 
                        type="linked-list"
                        // No initialData needed for default list operations
                        onComplete={() => handleGameComplete('linked-list-puzzle')}
                        onStepChange={handleStepChange}
                      />
                    )}
                    
                    {selectedGame === 'tree-balancer' && (
                      <AlgorithmVisualizer 
                        type="tree-traversal"
                        // No initialData needed for default tree
                        onComplete={() => handleGameComplete('tree-balancer')}
                        onStepChange={handleStepChange}
                      />
                    )}

                    {selectedGame === 'dynamic-programming-challenge' && (
                      <AlgorithmVisualizer 
                        type="dynamic-programming"
                        initialData={dpChallengeData} // Use memoized data
                        onComplete={() => handleGameComplete('dynamic-programming-challenge')}
                        onStepChange={handleStepChange}
                      />
                    )}

                    {selectedGame === 'greedy-algorithms' && (
                      <AlgorithmVisualizer 
                        type="greedy-algorithm"
                        initialData={greedyAlgoData} // Use memoized data
                        onComplete={() => handleGameComplete('greedy-algorithms')}
                        onStepChange={handleStepChange}
                      />
                    )}
                    
                    {selectedGame === 'bitwise-operations' && (
                      <AlgorithmVisualizer 
                        type="bit-manipulation"
                        initialData={bitwiseOpsData} // Use memoized data
                        onComplete={() => handleGameComplete('bitwise-operations')}
                        onStepChange={handleStepChange}
                      />
                    )}
                    
                    {selectedGame === 'bit-wizardry' && (
                      <AlgorithmVisualizer 
                        type="bit-manipulation-advanced"
                        initialData={bitWizardryData} // Use memoized data
                        onComplete={() => handleGameComplete('bit-wizardry')}
                        onStepChange={handleStepChange}
                      />
                    )}
                  </div>
                </div>
                
                <div className="h-[700px] flex flex-col">
                  {/* Code snippet panel */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow h-full flex flex-col">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        Python Implementation
                      </h3>
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                          Step: {currentStep}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-1 overflow-auto flex-grow">
                      {selectedGame && (
                        <SyntaxHighlighter 
                          language="python"
                          style={isDarkMode ? vscDarkPlus : vs} // Ensure uses local state
                          customStyle={{
                            background: isDarkMode ? 'rgb(30, 41, 59)' : 'rgb(243, 244, 246)', // Ensure uses local state
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.5rem',
                            height: '100%'
                          }}
                          wrapLines={true}
                          showLineNumbers={true}
                          lineProps={(lineNumber: number | React.Key) => {
                            // Check if the current line should be highlighted
                            const snippet = getCurrentCodeSnippet(selectedGame, currentStep);
                            const snippetHighlights = snippet?.highlightLines || {};
                            
                            // Convert lineNumber to number if it's not already
                            const lineNum = typeof lineNumber === 'number' ? lineNumber : parseInt(String(lineNumber), 10);
                            
                            // Check if this line is highlighted (either in the current dynamic highlights or from the snippet)
                            const isHighlighted = Boolean(lineHighlights[lineNum] || snippetHighlights[lineNum]);
                            
                            return {
                              style: { 
                                display: 'block',
                                backgroundColor: isHighlighted 
                                  ? isDarkMode // Ensure uses local state
                                    ? 'rgba(45, 212, 191, 0.15)' 
                                    : 'rgba(16, 185, 129, 0.1)' 
                                  : undefined,
                                borderLeft: isHighlighted 
                                  ? `4px solid ${isDarkMode ? '#2dd4bf' : '#10b981'}` // Ensure uses local state
                                  : undefined,
                                paddingLeft: isHighlighted ? '0.75rem' : undefined
                              }
                            };
                          }}
                        >
                          {displayCodeForAlgorithm(selectedGame)}
                        </SyntaxHighlighter>
                      )}
                    </div>
                    
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {algorithmStep || getCurrentCodeSnippet(selectedGame || '', currentStep)?.step || 'Current Step'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedGame === 'sort-race' && 'Quicksort is a divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array.'}
                        {selectedGame === 'binary-search-treasure' && 'Binary search efficiently finds items in a sorted array by repeatedly dividing the search space in half.'}
                        {selectedGame === 'graph-explorer' && 'BFS explores all vertices at the present depth before moving on to vertices at the next depth level.'}
                        {selectedGame === 'linked-list-puzzle' && 'Linked lists are dynamic data structures that store elements in nodes with pointers to the next node.'}
                        {selectedGame === 'tree-balancer' && 'Tree traversal involves visiting every node in a tree data structure exactly once.'}
                        {selectedGame === 'dynamic-programming-challenge' && 'Dynamic programming breaks down a problem into simpler subproblems and stores the results to avoid redundant calculations.'}
                        {selectedGame === 'greedy-algorithms' && 'Greedy algorithms make locally optimal choices at each step with the hope of finding a global optimum.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">How to Play</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedGame === 'sort-race' && 'Watch how Quicksort partitions the array and recursively sorts each partition. Use the controls to play, pause, and step through the algorithm.'}
                  {selectedGame === 'binary-search-treasure' && 'Binary search efficiently finds elements in a sorted array by repeatedly dividing the search space in half. Watch how it narrows down the search range until it finds the target.'}
                  {selectedGame === 'graph-explorer' && 'Breadth-first search (BFS) explores a graph level by level, visiting all neighbors of a node before moving to the next level. Watch how it discovers nodes and builds the shortest path.'}
                  {selectedGame === 'linked-list-puzzle' && 'Explore common linked list operations such as insertion, deletion, and search. See how each operation modifies the list structure.'}
                  {selectedGame === 'tree-balancer' && 'Tree traversal explores all nodes in a tree in a specific order. This visualization shows inorder traversal, which visits left subtree, then the node itself, then the right subtree.'}
                  {selectedGame === 'dynamic-programming-challenge' && 'Dynamic programming solves complex problems by breaking them down into simpler subproblems. Study the Python implementation to understand how DP optimizes recursive solutions.'}
                  {selectedGame === 'greedy-algorithms' && 'Greedy algorithms make locally optimal choices at each stage. Watch how these choices lead to a global solution and study the Python implementation.'}
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Use the Play button to start the animation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pause to analyze specific steps in detail</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Use Next and Prev buttons for step-by-step exploration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Study the Python code that matches each step of the algorithm</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Complete the entire visualization to earn XP!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {games.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.name}
                description={game.description}
                icon={game.icon}
                difficulty={game.difficulty}
                completed={!!gameCompleted[game.id]}
                onClick={() => setSelectedGame(game.id)}
              />
            ))}
          </div>
        )}

        {selectedGame && (
          <div className="lg:col-span-2 space-y-6">
            {/* Display game visualizations based on selected game */}
            {selectedGame === 'sort-race' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Sorting Race Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Sorting Race game where you can compete against different sorting algorithms!
                </p>
                <Link 
                  href="/games/sort-race" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Sorting Race
                </Link>
              </div>
            )}
            {selectedGame === 'binary-search-treasure' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Binary Search Treasure Hunt Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Binary Search Treasure Hunt game where you can find hidden treasures using binary search!
                </p>
                <Link 
                  href="/games/binary-search-treasure" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Binary Search
                </Link>
              </div>
            )}
            {selectedGame === 'graph-explorer' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Graph Explorer Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Graph Explorer game where you can navigate through a maze using graph traversal algorithms!
                </p>
                <Link 
                  href="/games/graph-explorer" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Graph Explorer
                </Link>
              </div>
            )}
            {selectedGame === 'linked-list-puzzle' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Linked List Puzzle Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Linked List Puzzle game where you can rearrange linked list nodes to solve puzzles and complete patterns!
                </p>
                <Link 
                  href="/games/linked-list-puzzle" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Linked List Puzzle
                </Link>
              </div>
            )}
            {selectedGame === 'tree-balancer' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Tree Balancer Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Tree Balancer game where you can balance binary search trees to optimize search operations!
                </p>
                <Link 
                  href="/games/tree-balancer" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Tree Balancer
                </Link>
              </div>
            )}
            {selectedGame === 'dynamic-programming-challenge' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Dynamic Programming Challenge Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Dynamic Programming Challenge game where you can solve classic optimization problems using dynamic programming techniques!
                </p>
                <Link 
                  href="/games/dynamic-programming-challenge" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Dynamic Programming
                </Link>
              </div>
            )}
            {selectedGame === 'greedy-algorithms' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Greedy Algorithms Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Greedy Algorithms game where you can learn how to make locally optimal choices to reach a global optimum!
                </p>
                <Link 
                  href="/games/greedy-algorithms" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Greedy Algorithms
                </Link>
              </div>
            )}
            {selectedGame === 'bitwise-operations' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Bitwise Operations Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Bitwise Operations game where you can test your skills with binary operations!
                </p>
                <Link 
                  href="/games/bitwise-operations" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Bitwise Game
                </Link>
              </div>
            )}
            {selectedGame === 'bit-wizardry' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Bit Wizardry Game
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Click the button below to launch our interactive Bit Wizardry game where you can test your skills with advanced bit manipulation techniques!
                </p>
                <Link 
                  href="/games/bit-wizardry" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Play Bit Wizardry
                </Link>
              </div>
            )}
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
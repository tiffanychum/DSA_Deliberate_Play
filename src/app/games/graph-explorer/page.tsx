"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Graph type definitions
interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  visited: boolean;
  distance?: number;
  parent?: string;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
  visited: boolean;
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
}

// Algorithm step interface
interface AlgorithmStep {
  description: string;
  currentNode?: string;
  visitedNodes: string[];
  visitedEdges: string[];
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number>;
  parents?: Record<string, string>;
}

// Challenge interface
interface Challenge {
  id: string;
  title: string;
  description: string;
  initialGraph: Graph;
  expectedPath?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  algorithm: 'bfs' | 'dfs' | 'dijkstra' | 'mst';
  hint: string;
  explanation: string;
  pythonCode: PythonCodeSnippet[];
  timeComplexity: string;
  spaceComplexity: string;
  codingChallenge?: PythonCodingChallenge;
}

// Define Python code snippet interface
interface PythonCodeSnippet {
  title: string;
  code: string;
  explanation: string;
  highlightLines?: {[key: number]: boolean};
}

// Define Python coding challenge interface
interface PythonCodingChallenge {
  description: string;
  template: string;
  solution: string;
  testCases: string[];
}

// Define multiple choice question interface 
interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Define code optimization question interface
interface OptimizationQuestion {
  description: string;
  codeSnippets: {
    code: string;
    isOptimal: boolean;
    timeComplexity: string;
    spaceComplexity: string;
    explanation: string;
  }[];
  correctAnswer: number;
}

// Define time complexity matching question
interface ComplexityMatchingQuestion {
  description: string;
  operations: string[];
  complexities: string[];
  correctMatches: {[key: number]: number};
  explanation: string;
}

const GraphExplorerGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Graph state
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<'bfs' | 'dfs' | 'dijkstra' | 'mst'>('bfs');
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms between steps
  const [userSolution, setUserSolution] = useState<string[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Canvas reference for graph visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Auto-play timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Add new state for code display
  const [showCode, setShowCode] = useState(false);
  const [codeSnippetIndex, setCodeSnippetIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [codeResult, setCodeResult] = useState<string | null>(null);
  const [codeRunning, setCodeRunning] = useState(false);
  const [showOptimizedCode, setShowOptimizedCode] = useState(false);
  
  // Add new state for interactive learning
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string | number]: number | number[]}>({});
  const [showExplanations, setShowExplanations] = useState<{[key: string | number]: boolean}>({});
  const [questionScore, setQuestionScore] = useState(0);
  
  // After other state declarations, add the selected algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'bfs' | 'dfs' | 'dijkstra' | 'mst'>('bfs');
  
  // Detect dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    const savedHighScore = localStorage.getItem('graphExplorerHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem('graphExplorerHighScore', highScore.toString());
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

  // Function to initialize the game
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(300);
    setGameOver(false);
    setGameStarted(true);
    setStreak(0);
    setUserSolution([]);
    setAlgorithmSteps([]);
    setCurrentStep(0);
    setSelectedNode(null);
    setIsCorrect(null);
    generateChallenge();
  };

  // Function to end the game
  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Generate a challenge based on current level
  const generateChallenge = () => {
    // Select challenge based on level
    const challenge = getChallengeForLevel(level);
    
    // Reset state before setting new challenge
    setUserSolution([]);
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
    setAlgorithmSteps([]);
    setCurrentStep(0);
    setSelectedNode(null);
    
    // Set new challenge and graph
    setCurrentChallenge(challenge);
    setGraph(challenge.initialGraph);
  };
  
  // Get a challenge for the current level - enhanced with Python code
  const getChallengeForLevel = (level: number): Challenge => {
    // Basic graph for BFS and DFS (level 1-3)
    if (level <= 3) {
      return {
        id: `level-${level}-bfs`,
        title: 'Breadth-First Search Challenge',
        description: 'Find the shortest path from node A to node G using BFS.',
        initialGraph: generateSimpleGraph(),
        expectedPath: ['A', 'C', 'E', 'G'],
        difficulty: 'Easy',
        algorithm: 'bfs',
        hint: 'BFS explores all neighbors at the current depth before moving to nodes at the next depth level.',
        explanation: 'BFS uses a queue to keep track of nodes to visit. It visits all nodes at a given distance before moving on to nodes that are further away.',
        timeComplexity: 'O(V + E) where V is the number of vertices and E is the number of edges',
        spaceComplexity: 'O(V) for the queue and visited set',
        pythonCode: [
          {
            title: 'Basic BFS Implementation',
            code: `def bfs(graph, start, target):
    # Initialize a queue with the start node
    queue = [start]
    # Keep track of visited nodes to avoid cycles
    visited = {start}
    # Keep track of parents to reconstruct the path
    parent = {}
    
    while queue:
        # Get the next node to explore
        current = queue.pop(0)  # O(n) operation - not optimal!
        
        # Check if we reached the target
        if current == target:
            break
            
        # Explore all neighbors
        for neighbor in graph[current]:
            if neighbor not in visited:
                queue.append(neighbor)
                visited.add(neighbor)
                parent[neighbor] = current
    
    # Reconstruct path if target was found
    if target in parent or start == target:
        path = [target]
        while path[-1] != start:
            path.append(parent[path[-1]])
        return path[::-1]  # Reverse path
    
    # No path found
    return None`,
            explanation: 'This basic implementation uses a simple list as a queue. The pop(0) operation is O(n), making it less efficient for large graphs.'
          },
          {
            title: 'Optimized BFS Implementation',
            code: `from collections import deque

def bfs_optimized(graph, start, target):
    # Initialize queue with the start node
    queue = deque([start])  # O(1) operations with deque
    # Keep track of visited nodes to avoid cycles
    visited = {start}
    # Keep track of parents to reconstruct the path
    parent = {}
    
    while queue:
        # Get the next node to explore
        current = queue.popleft()  # O(1) operation - much better!
        
        # Check if we reached the target
        if current == target:
            break
            
        # Explore all neighbors
        for neighbor in graph[current]:
            if neighbor not in visited:
                queue.append(neighbor)
                visited.add(neighbor)
                parent[neighbor] = current
    
    # Reconstruct path if target was found
    if target in parent or start == target:
        path = [target]
        while path[-1] != start:
            path.append(parent[path[-1]])
        return path[::-1]  # Reverse path
    
    # No path found
    return None`,
            explanation: 'This optimized version uses a deque (double-ended queue) from collections, providing O(1) operations for both adding elements (append) and removing from the front (popleft).'
          }
        ],
        codingChallenge: {
          description: 'Implement BFS to find the shortest path between two nodes in a graph. Fill in the missing code:',
          template: `def bfs_shortest_path(graph, start, target):
    # Initialize queue with the start node
    queue = [start]
    # Track visited nodes
    visited = {start}
    # Track parents for path reconstruction
    parent = {}
    
    while queue:
        current = queue.pop(0)
        
        # If we found the target, break
        if current == target:
            break
            
        # YOUR CODE HERE: Explore all neighbors
        
    
    # YOUR CODE HERE: Reconstruct and return the path
    `,
          solution: `def bfs_shortest_path(graph, start, target):
    queue = [start]
    visited = {start}
    parent = {}
    
    while queue:
        current = queue.pop(0)
        
        if current == target:
            break
            
        for neighbor in graph[current]:
            if neighbor not in visited:
                queue.append(neighbor)
                visited.add(neighbor)
                parent[neighbor] = current
    
    if target in parent or start == target:
        path = [target]
        while path[-1] != start:
            path.append(parent[path[-1]])
        return path[::-1]
    
    return None`,
          testCases: [
            `graph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['E'], 'D': ['F'], 'E': ['G'], 'F': [], 'G': []}
assert bfs_shortest_path(graph, 'A', 'G') == ['A', 'C', 'E', 'G']`
          ]
        }
      };
    }
    // Weighted graph for Dijkstra's (level 4-6)
    else if (level <= 6) {
      return {
        id: `level-${level}-dijkstra`,
        title: 'Dijkstra\'s Algorithm Challenge',
        description: 'Find the shortest path from node A to node G considering edge weights.',
        initialGraph: generateWeightedGraph(),
        expectedPath: ['A', 'B', 'D', 'G'],
        difficulty: 'Medium',
        algorithm: 'dijkstra',
        hint: 'Dijkstra\'s algorithm finds the shortest path by prioritizing nodes with the smallest current distance.',
        explanation: 'Dijkstra\'s algorithm maintains a priority queue of nodes to visit next, always choosing the one with the smallest current distance from the start.',
        timeComplexity: 'O((V + E) log V) with a binary heap, where V is vertices and E is edges',
        spaceComplexity: 'O(V) for the priority queue and distance map',
        pythonCode: [
          {
            title: 'Basic Dijkstra Implementation',
            code: `def dijkstra(graph, start, target):
    # Initialize distances with infinity for all nodes except start
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    # Track visited nodes
    visited = set()
    # Track parents for path reconstruction
    parents = {}
    
    while len(visited) < len(graph):
        # Find unvisited node with minimum distance
        current = None
        min_distance = float('infinity')
        
        for node in graph:
            if node not in visited and distances[node] < min_distance:
                current = node
                min_distance = distances[node]
        
        # If no reachable unvisited nodes, break
        if current is None or current == target:
            break
            
        # Mark current as visited
        visited.add(current)
        
        # Update distances to neighbors
        for neighbor, weight in graph[current].items():
            if neighbor not in visited:
                distance = distances[current] + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    parents[neighbor] = current
    
    # Reconstruct path
    if target in parents or start == target:
        path = [target]
        while path[-1] != start:
            path.append(parents[path[-1]])
        return path[::-1]  # Reverse path
    
    return None  # No path found`,
            explanation: 'This basic implementation scans all vertices to find the minimum distance node, resulting in O(V²) time complexity.'
          },
          {
            title: 'Optimized Dijkstra Implementation',
            code: `import heapq

def dijkstra_optimized(graph, start, target):
    # Priority queue of (distance, node)
    pq = [(0, start)]
    # Track distances
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    # Track visited nodes
    visited = set()
    # Track parents for path reconstruction
    parents = {}
    
    while pq:
        # Get node with minimum distance
        current_distance, current = heapq.heappop(pq)
        
        # Skip if we've processed this node already
        if current in visited:
            continue
            
        # Mark as visited
        visited.add(current)
        
        # If we found the target, we can stop
        if current == target:
            break
            
        # If we've found a worse path, skip
        if current_distance > distances[current]:
            continue
            
        # Check all neighbors
        for neighbor, weight in graph[current].items():
            if neighbor in visited:
                continue
                
            # Calculate new distance
            distance = current_distance + weight
            
            # If we found a better path, update
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                parents[neighbor] = current
                heapq.heappush(pq, (distance, neighbor))
    
    # Reconstruct path
    if target in parents or start == target:
        path = [target]
        while path[-1] != start:
            path.append(parents[path[-1]])
        return path[::-1]  # Reverse path
    
    return None  # No path found`,
            explanation: 'This optimized implementation uses a priority queue (min-heap) to efficiently find the node with minimum distance, improving time complexity to O((V+E)log V).'
          }
        ],
        codingChallenge: {
          description: "Implement Dijkstra's algorithm using a priority queue to find the shortest path. Fill in the missing code:",
          template: `import heapq

def dijkstra_shortest_path(graph, start, target):
    # Initialize priority queue with (distance, node)
    pq = [(0, start)]
    # Track distances
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    # Track parents for path reconstruction
    parents = {}
    
    # YOUR CODE HERE: Implement the main algorithm loop
    
    
    # YOUR CODE HERE: Reconstruct and return the path`,
          solution: `import heapq

def dijkstra_shortest_path(graph, start, target):
    pq = [(0, start)]
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    parents = {}
    visited = set()
    
    while pq:
        current_distance, current = heapq.heappop(pq)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        if current == target:
            break
            
        if current_distance > distances[current]:
            continue
            
        for neighbor, weight in graph[current].items():
            if neighbor in visited:
                continue
                
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                parents[neighbor] = current
                heapq.heappush(pq, (distance, neighbor))
    
    if target in parents or start == target:
        path = [target]
        while path[-1] != start:
            path.append(parents[path[-1]])
        return path[::-1]
    
    return None`,
          testCases: [
            `graph = {
    'A': {'B': 2, 'C': 4},
    'B': {'D': 3, 'C': 1},
    'C': {'E': 3},
    'D': {'G': 2},
    'E': {'G': 4},
    'G': {}
}
assert dijkstra_shortest_path(graph, 'A', 'G') == ['A', 'B', 'D', 'G']`
          ]
        }
      };
    }
    // Complex graph for MST (level 7+)
    else {
      return {
        id: `level-${level}-mst`,
        title: 'Minimum Spanning Tree Challenge',
        description: 'Find the minimum spanning tree of this graph using Prim\'s algorithm.',
        initialGraph: generateComplexGraph(),
        expectedPath: ['A-B', 'B-C', 'A-D', 'D-E', 'E-G', 'C-F'],
        difficulty: 'Hard',
        algorithm: 'mst',
        hint: 'A minimum spanning tree connects all nodes with the minimum total edge weight.',
        explanation: 'Prim\'s algorithm builds the MST by always adding the edge with the minimum weight that connects a vertex in the tree to a vertex outside the tree.',
        timeComplexity: 'O(E log V) with a binary heap, where V is vertices and E is edges',
        spaceComplexity: 'O(V + E) for the priority queue and MST',
        pythonCode: [
          {
            title: 'Basic Prim\'s MST Implementation',
            code: `def prims_mst(graph):
    # Start with an arbitrary node (first node in graph)
    start = list(graph.keys())[0]
    
    # Track nodes in MST
    mst_nodes = {start}
    # Track edges in MST
    mst_edges = []
    
    # Continue until all nodes are in MST
    while len(mst_nodes) < len(graph):
        min_weight = float('infinity')
        min_edge = None
        
        # Find minimum weight edge from MST to outside
        for node in mst_nodes:
            for neighbor, weight in graph[node].items():
                if neighbor not in mst_nodes and weight < min_weight:
                    min_weight = weight
                    min_edge = (node, neighbor, weight)
        
        # If no edge found, graph is not connected
        if min_edge is None:
            break
            
        # Add edge to MST
        u, v, w = min_edge
        mst_edges.append((u, v, w))
        mst_nodes.add(v)
    
    return mst_edges`,
            explanation: 'This basic implementation scans all edges for each iteration, resulting in O(V²) time complexity for dense graphs.'
          },
          {
            title: 'Optimized Prim\'s MST Implementation',
            code: `import heapq

def prims_mst_optimized(graph):
    # Start with an arbitrary node (first node in graph)
    start = list(graph.keys())[0]
    
    # Track nodes in MST
    mst_nodes = set()
    # Track edges in MST
    mst_edges = []
    
    # Priority queue for edges
    # (weight, node, parent)
    edges = [(0, start, None)]
    
    # Track visited nodes to avoid cycles
    visited = set()
    
    while edges and len(mst_nodes) < len(graph):
        # Get minimum weight edge
        weight, node, parent = heapq.heappop(edges)
        
        # Skip if already in MST
        if node in visited:
            continue
            
        # Add to MST
        visited.add(node)
        mst_nodes.add(node)
        
        # Add edge to MST (except for the start node)
        if parent is not None:
            mst_edges.append((parent, node, weight))
        
        # Add edges to neighbors
        for neighbor, edge_weight in graph[node].items():
            if neighbor not in visited:
                heapq.heappush(edges, (edge_weight, neighbor, node))
    
    return mst_edges`,
            explanation: 'This optimized implementation uses a priority queue to efficiently find the minimum weight edge, improving time complexity to O(E log V).'
          }
        ],
        codingChallenge: {
          description: "Implement Prim's algorithm to find the minimum spanning tree of a graph. Fill in the missing code:",
          template: `import heapq

def prims_algorithm(graph):
    # Start with the first node
    start = list(graph.keys())[0]
    
    # Track visited nodes and MST edges
    visited = set()
    mst_edges = []
    
    # Priority queue to store edges (weight, node, parent)
    edges = [(0, start, None)]
    
    # YOUR CODE HERE: Implement the main algorithm loop
    
    
    return mst_edges`,
          solution: `import heapq

def prims_algorithm(graph):
    start = list(graph.keys())[0]
    
    visited = set()
    mst_edges = []
    
    edges = [(0, start, None)]
    
    while edges:
        weight, node, parent = heapq.heappop(edges)
        
        if node in visited:
            continue
            
        visited.add(node)
        
        if parent is not None:
            mst_edges.append((parent, node, weight))
        
        for neighbor, edge_weight in graph[node].items():
            if neighbor not in visited:
                heapq.heappush(edges, (edge_weight, neighbor, node))
    
    return mst_edges`,
          testCases: [
            `graph = {
    'A': {'B': 2, 'D': 1},
    'B': {'A': 2, 'C': 3, 'D': 5, 'E': 4},
    'C': {'B': 3, 'F': 2},
    'D': {'A': 1, 'B': 5, 'E': 2},
    'E': {'B': 4, 'D': 2, 'F': 6, 'G': 3},
    'F': {'C': 2, 'E': 6, 'G': 5},
    'G': {'E': 3, 'F': 5}
}
mst = prims_algorithm(graph)
total_weight = sum(edge[2] for edge in mst)
assert total_weight == 11`
          ]
        }
      };
    }
  };

  // Generate a simple unweighted graph
  const generateSimpleGraph = (): Graph => {
    return {
      nodes: [
        { id: 'A', label: 'A', x: 100, y: 100, visited: false },
        { id: 'B', label: 'B', x: 200, y: 50, visited: false },
        { id: 'C', label: 'C', x: 200, y: 150, visited: false },
        { id: 'D', label: 'D', x: 300, y: 50, visited: false },
        { id: 'E', label: 'E', x: 300, y: 150, visited: false },
        { id: 'F', label: 'F', x: 400, y: 50, visited: false },
        { id: 'G', label: 'G', x: 400, y: 150, visited: false },
      ],
      edges: [
        { source: 'A', target: 'B', weight: 1, visited: false },
        { source: 'A', target: 'C', weight: 1, visited: false },
        { source: 'B', target: 'D', weight: 1, visited: false },
        { source: 'C', target: 'E', weight: 1, visited: false },
        { source: 'D', target: 'F', weight: 1, visited: false },
        { source: 'E', target: 'G', weight: 1, visited: false },
        { source: 'D', target: 'E', weight: 1, visited: false },
        { source: 'F', target: 'G', weight: 1, visited: false },
      ]
    };
  };

  // Generate a weighted graph
  const generateWeightedGraph = (): Graph => {
    return {
      nodes: [
        { id: 'A', label: 'A', x: 100, y: 100, visited: false },
        { id: 'B', label: 'B', x: 200, y: 50, visited: false },
        { id: 'C', label: 'C', x: 200, y: 150, visited: false },
        { id: 'D', label: 'D', x: 300, y: 50, visited: false },
        { id: 'E', label: 'E', x: 300, y: 150, visited: false },
        { id: 'F', label: 'F', x: 400, y: 50, visited: false },
        { id: 'G', label: 'G', x: 400, y: 150, visited: false },
      ],
      edges: [
        { source: 'A', target: 'B', weight: 2, visited: false },
        { source: 'A', target: 'C', weight: 4, visited: false },
        { source: 'B', target: 'C', weight: 1, visited: false },
        { source: 'B', target: 'D', weight: 3, visited: false },
        { source: 'C', target: 'E', weight: 3, visited: false },
        { source: 'D', target: 'E', weight: 5, visited: false },
        { source: 'D', target: 'F', weight: 6, visited: false },
        { source: 'D', target: 'G', weight: 2, visited: false },
        { source: 'E', target: 'G', weight: 4, visited: false },
        { source: 'F', target: 'G', weight: 1, visited: false },
      ]
    };
  };

  // Generate a complex graph for MST
  const generateComplexGraph = (): Graph => {
    return {
      nodes: [
        { id: 'A', label: 'A', x: 100, y: 100, visited: false },
        { id: 'B', label: 'B', x: 200, y: 50, visited: false },
        { id: 'C', label: 'C', x: 300, y: 50, visited: false },
        { id: 'D', label: 'D', x: 150, y: 200, visited: false },
        { id: 'E', label: 'E', x: 250, y: 200, visited: false },
        { id: 'F', label: 'F', x: 350, y: 150, visited: false },
        { id: 'G', label: 'G', x: 350, y: 250, visited: false },
      ],
      edges: [
        { source: 'A', target: 'B', weight: 2, visited: false },
        { source: 'A', target: 'D', weight: 1, visited: false },
        { source: 'B', target: 'C', weight: 3, visited: false },
        { source: 'B', target: 'D', weight: 5, visited: false },
        { source: 'B', target: 'E', weight: 4, visited: false },
        { source: 'C', target: 'F', weight: 2, visited: false },
        { source: 'D', target: 'E', weight: 2, visited: false },
        { source: 'E', target: 'F', weight: 6, visited: false },
        { source: 'E', target: 'G', weight: 3, visited: false },
        { source: 'F', target: 'G', weight: 5, visited: false },
      ]
    };
  };

  // Update canvas when algorithm step changes
  useEffect(() => {
    if (algorithmSteps.length > 0 && currentStep < algorithmSteps.length) {
      // Apply the current step to the graph visualization
      updateGraphFromStep(algorithmSteps[currentStep]);
    }
  }, [currentStep, algorithmSteps]);

  // Run BFS algorithm
  const runBFS = (startNodeId: string, targetNodeId: string) => {
    // Clone the graph to avoid modifying the original
    const tempGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    
    // Reset states
    tempGraph.nodes.forEach(node => {
      node.visited = false;
      node.distance = undefined;
      node.parent = undefined;
    });
    tempGraph.edges.forEach(edge => {
      edge.visited = false;
    });
    
    // Initialize variables
    const steps: AlgorithmStep[] = [];
    const queue: string[] = [startNodeId];
    const visited: Set<string> = new Set([startNodeId]);
    const distances: Record<string, number> = { [startNodeId]: 0 };
    const parents: Record<string, string> = {};
    
    // Mark start node as visited
    const startNode = tempGraph.nodes.find(n => n.id === startNodeId);
    if (startNode) {
      startNode.visited = true;
      startNode.distance = 0;
    }
    
    steps.push({
      description: `Starting BFS from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [...visited],
      visitedEdges: [],
      queue: [...queue],
      distances: { ...distances },
      parents: { ...parents }
    });
    
    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      const currentNode = tempGraph.nodes.find(n => n.id === currentNodeId);
      
      if (!currentNode) continue;
      
      // Get all adjacent nodes
      const edges = tempGraph.edges.filter(e => e.source === currentNodeId || e.target === currentNodeId);
      
      for (const edge of edges) {
        // Get neighbor node
        const neighborId = edge.source === currentNodeId ? edge.target : edge.source;
        
        if (!visited.has(neighborId)) {
          // Mark edge as visited
          edge.visited = true;
          
          // Add neighbor to queue
          queue.push(neighborId);
          visited.add(neighborId);
          
          // Update distance and parent
          distances[neighborId] = distances[currentNodeId] + 1;
          parents[neighborId] = currentNodeId;
          
          // Mark node as visited
          const neighborNode = tempGraph.nodes.find(n => n.id === neighborId);
          if (neighborNode) {
            neighborNode.visited = true;
            neighborNode.distance = distances[neighborId];
            neighborNode.parent = currentNodeId;
          }
          
          // Add step
          const visitedEdgeIds = tempGraph.edges
            .filter(e => e.visited)
            .map(e => `${e.source}-${e.target}`);
          
          steps.push({
            description: `Visiting node ${neighborId} from ${currentNodeId}`,
            currentNode: neighborId,
            visitedNodes: [...visited],
            visitedEdges: visitedEdgeIds,
            queue: [...queue],
            distances: { ...distances },
            parents: { ...parents }
          });
          
          // If we've reached the target node, we can stop
          if (neighborId === targetNodeId) {
            break;
          }
        }
      }
    }
    
    // Reconstruct path
    const path: string[] = [];
    let current = targetNodeId;
    
    if (parents[current]) {
      path.unshift(current);
      
      while (current !== startNodeId) {
        current = parents[current];
        path.unshift(current);
      }
      
      // Add final step showing the complete path
      steps.push({
        description: `Found path from ${startNodeId} to ${targetNodeId}: ${path.join(' → ')}`,
        visitedNodes: [...visited],
        visitedEdges: tempGraph.edges
          .filter(e => e.visited)
          .map(e => `${e.source}-${e.target}`),
        queue: [],
        distances,
        parents
      });
    } else {
      // No path found
      steps.push({
        description: `No path found from ${startNodeId} to ${targetNodeId}`,
        visitedNodes: [...visited],
        visitedEdges: tempGraph.edges
          .filter(e => e.visited)
          .map(e => `${e.source}-${e.target}`),
        queue: [],
        distances,
        parents
      });
    }
    
    setAlgorithmSteps(steps);
    setCurrentStep(0);
  };

  // Run DFS algorithm
  const runDFS = (startNodeId: string, targetNodeId: string) => {
    // Clone the graph to avoid modifying the original
    const tempGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    
    // Reset states
    tempGraph.nodes.forEach(node => {
      node.visited = false;
      node.distance = undefined;
      node.parent = undefined;
    });
    tempGraph.edges.forEach(edge => {
      edge.visited = false;
    });
    
    // Initialize variables
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [startNodeId];
    const visited: Set<string> = new Set();
    const parents: Record<string, string> = {};
    let found = false;
    
    steps.push({
      description: `Starting DFS from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [...visited],
      visitedEdges: [],
      stack: [...stack],
      parents: { ...parents }
    });
    
    while (stack.length > 0 && !found) {
      const currentNodeId = stack.pop()!;
      
      if (!visited.has(currentNodeId)) {
        // Mark as visited
        visited.add(currentNodeId);
        
        // Mark node as visited in the graph
        const currentNode = tempGraph.nodes.find(n => n.id === currentNodeId);
        if (currentNode) {
          currentNode.visited = true;
        }
        
        // Get all edges for this node
        const edges = tempGraph.edges.filter(e => e.source === currentNodeId || e.target === currentNodeId);
        
        // Add neighbors to stack in reverse order (to match typical DFS traversal from left to right)
        const neighbors: string[] = [];
        
        for (const edge of edges) {
          const neighborId = edge.source === currentNodeId ? edge.target : edge.source;
          
          if (!visited.has(neighborId)) {
            neighbors.push(neighborId);
            parents[neighborId] = currentNodeId;
          }
        }
        
        // Sort to make traversal order predictable
        neighbors.sort().reverse();
        
        // Add neighbors to stack
        for (const neighborId of neighbors) {
          stack.push(neighborId);
        }
        
        // Mark all relevant edges as visited
        for (const edge of edges) {
          const neighborId = edge.source === currentNodeId ? edge.target : edge.source;
          if (stack.includes(neighborId) && !visited.has(neighborId)) {
            edge.visited = true;
          }
        }
        
        // Add step
        const visitedEdgeIds = tempGraph.edges
          .filter(e => e.visited)
          .map(e => `${e.source}-${e.target}`);
        
        steps.push({
          description: `Visited node ${currentNodeId}`,
          currentNode: currentNodeId,
          visitedNodes: [...visited],
          visitedEdges: visitedEdgeIds,
          stack: [...stack],
          parents: { ...parents }
        });
        
        // Check if we've reached the target
        if (currentNodeId === targetNodeId) {
          found = true;
          break;
        }
      }
    }
    
    // Reconstruct path if found
    if (found) {
      const path: string[] = [];
      let current = targetNodeId;
      
      path.unshift(current);
      while (current !== startNodeId) {
        current = parents[current];
        path.unshift(current);
      }
      
      steps.push({
        description: `Found path from ${startNodeId} to ${targetNodeId}: ${path.join(' → ')}`,
        visitedNodes: [...visited],
        visitedEdges: tempGraph.edges
          .filter(e => e.visited)
          .map(e => `${e.source}-${e.target}`),
        stack: [],
        parents
      });
    } else {
      steps.push({
        description: `No path found from ${startNodeId} to ${targetNodeId}`,
        visitedNodes: [...visited],
        visitedEdges: tempGraph.edges
          .filter(e => e.visited)
          .map(e => `${e.source}-${e.target}`),
        stack: [],
        parents
      });
    }
    
    setAlgorithmSteps(steps);
    setCurrentStep(0);
  };

  // Run the specified algorithm
  const runAlgorithm = (algorithm: 'bfs' | 'dfs' | 'dijkstra' | 'mst') => {
    if (!currentChallenge) return;
    
    const startNodeId = 'A'; // Starting node is always A
    const targetNodeId = 'G'; // Target node is always G
    
    switch (algorithm) {
      case 'bfs':
        runBFS(startNodeId, targetNodeId);
        break;
      case 'dfs':
        runDFS(startNodeId, targetNodeId);
        break;
      case 'dijkstra':
        // Placeholder for Dijkstra's algorithm
        runDijkstra(startNodeId, targetNodeId);
        break;
      case 'mst':
        // Placeholder for MST algorithm
        runMST();
        break;
    }
  };
  
  // Implementation for Dijkstra's algorithm
  const runDijkstra = (startNodeId: string, targetNodeId: string) => {
    // Clone the graph
    const tempGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    
    // Reset states
    tempGraph.nodes.forEach(node => {
      node.visited = false;
      node.distance = Infinity;
      node.parent = undefined;
    });
    tempGraph.edges.forEach(edge => {
      edge.visited = false;
    });
    
    // Initialize variables
    const steps: AlgorithmStep[] = [];
    const distances: Record<string, number> = {};
    const parents: Record<string, string> = {};
    const visited: Set<string> = new Set();
    
    // Set distance of start node to 0
    tempGraph.nodes.find(n => n.id === startNodeId)!.distance = 0;
    distances[startNodeId] = 0;
    
    steps.push({
      description: `Starting Dijkstra's algorithm from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [...visited],
      visitedEdges: [],
      distances: { ...distances },
      parents: { ...parents }
    });
    
    // Run Dijkstra's algorithm
    while (visited.size < tempGraph.nodes.length) {
      // Find node with minimum distance
      let minDistance = Infinity;
      let minNodeId = '';
      
      for (const node of tempGraph.nodes) {
        if (!visited.has(node.id) && node.distance! < minDistance) {
          minDistance = node.distance!;
          minNodeId = node.id;
        }
      }
      
      // If no node found, all remaining nodes are unreachable
      if (minNodeId === '') break;
      
      // Mark as visited
      visited.add(minNodeId);
      tempGraph.nodes.find(n => n.id === minNodeId)!.visited = true;
      
      // If it's the target node, we're done
      if (minNodeId === targetNodeId) break;
      
      // Update distances of neighbors
      const edges = tempGraph.edges.filter(e => e.source === minNodeId || e.target === minNodeId);
      
      for (const edge of edges) {
        const neighborId = edge.source === minNodeId ? edge.target : edge.source;
        
        if (!visited.has(neighborId)) {
          const newDistance = distances[minNodeId] + edge.weight;
          
          if (!distances[neighborId] || newDistance < distances[neighborId]) {
            distances[neighborId] = newDistance;
            parents[neighborId] = minNodeId;
            
            // Update node distance
            const neighborNode = tempGraph.nodes.find(n => n.id === neighborId);
            if (neighborNode) {
              neighborNode.distance = newDistance;
              neighborNode.parent = minNodeId;
            }
            
            // Mark edge as visited
            edge.visited = true;
          }
        }
      }
      
      // Add step
      const visitedEdgeIds = tempGraph.edges
        .filter(e => e.visited)
        .map(e => `${e.source}-${e.target}`);
      
      steps.push({
        description: `Processed node ${minNodeId} with distance ${distances[minNodeId]}`,
        currentNode: minNodeId,
        visitedNodes: [...visited],
        visitedEdges: visitedEdgeIds,
        distances: { ...distances },
        parents: { ...parents }
      });
    }
    
    // Reconstruct path
    if (distances[targetNodeId] !== undefined) {
      const path: string[] = [];
      let current = targetNodeId;
      
      path.unshift(current);
      while (current !== startNodeId) {
        current = parents[current];
        path.unshift(current);
      }
      
      steps.push({
        description: `Found shortest path from ${startNodeId} to ${targetNodeId}: ${path.join(' → ')} (total distance: ${distances[targetNodeId]})`,
        visitedNodes: [...visited],
        visitedEdges: tempGraph.edges
          .filter(e => e.visited)
          .map(e => `${e.source}-${e.target}`),
        distances: { ...distances },
        parents: { ...parents }
      });
    } else {
      steps.push({
        description: `No path found from ${startNodeId} to ${targetNodeId}`,
        visitedNodes: [...visited],
        visitedEdges: tempGraph.edges
          .filter(e => e.visited)
          .map(e => `${e.source}-${e.target}`),
        distances: { ...distances },
        parents: { ...parents }
      });
    }
    
    setAlgorithmSteps(steps);
    setCurrentStep(0);
  };
  
  // Implementation for MST algorithm (Prim's)
  const runMST = () => {
    // Clone the graph
    const tempGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    
    // Reset states
    tempGraph.nodes.forEach(node => {
      node.visited = false;
      node.distance = Infinity;
      node.parent = undefined;
    });
    tempGraph.edges.forEach(edge => {
      edge.visited = false;
    });
    
    // Initialize variables
    const steps: AlgorithmStep[] = [];
    const mst: Edge[] = [];
    const visited: Set<string> = new Set();
    
    // Start with node A
    const startNodeId = 'A';
    visited.add(startNodeId);
    tempGraph.nodes.find(n => n.id === startNodeId)!.visited = true;
    
    steps.push({
      description: `Starting MST algorithm from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [...visited],
      visitedEdges: []
    });
    
    // Run Prim's algorithm
    while (visited.size < tempGraph.nodes.length) {
      let minEdge: Edge | null = null;
      let minWeight = Infinity;
      
      // Find the minimum weight edge from visited to unvisited nodes
      for (const edge of tempGraph.edges) {
        const sourceVisited = visited.has(edge.source);
        const targetVisited = visited.has(edge.target);
        
        // Edge connects a visited and unvisited node
        if ((sourceVisited && !targetVisited) || (!sourceVisited && targetVisited)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }
      
      // If no edge found, graph is not connected
      if (!minEdge) break;
      
      // Add edge to MST
      mst.push(minEdge);
      minEdge.visited = true;
      
      // Add the unvisited endpoint to visited set
      const newNodeId = visited.has(minEdge.source) ? minEdge.target : minEdge.source;
      visited.add(newNodeId);
      tempGraph.nodes.find(n => n.id === newNodeId)!.visited = true;
      
      // Add step
      const visitedEdgeIds = tempGraph.edges
        .filter(e => e.visited)
        .map(e => `${e.source}-${e.target}`);
      
      steps.push({
        description: `Added edge ${minEdge.source}-${minEdge.target} with weight ${minEdge.weight} to MST`,
        currentNode: newNodeId,
        visitedNodes: [...visited],
        visitedEdges: visitedEdgeIds
      });
    }
    
    // Final MST
    const totalWeight = mst.reduce((sum, edge) => sum + edge.weight, 0);
    steps.push({
      description: `MST completed with total weight ${totalWeight}`,
      visitedNodes: [...visited],
      visitedEdges: mst.map(e => `${e.source}-${e.target}`)
    });
    
    setAlgorithmSteps(steps);
    setCurrentStep(0);
  };

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    if (!gameStarted || gameOver) return;
    
    // Add to user solution
    setUserSolution(prev => [...prev, nodeId]);
    
    // Update selected node
    setSelectedNode(nodeId);
    
    // Update graph with proper deep cloning to ensure reactivity
    setGraph(prevGraph => {
      const updatedGraph = {
        nodes: prevGraph.nodes.map(node => ({
          ...node,
          visited: node.id === nodeId ? true : node.visited
        })),
        edges: [...prevGraph.edges]
      };
      return updatedGraph;
    });
  };

  // Check if the user's solution is correct
  const checkSolution = () => {
    if (!currentChallenge || !currentChallenge.expectedPath) return;
    
    const isCorrectSolution = JSON.stringify(userSolution) === JSON.stringify(currentChallenge.expectedPath);
    setIsCorrect(isCorrectSolution);
    
    if (isCorrectSolution) {
      // Award points
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Calculate bonus points
      const streakBonus = Math.floor(newStreak / 3) * 5;
      const levelBonus = level * 5;
      const timeBonus = Math.floor(timeLeft / 20);
      
      const pointsEarned = 20 + streakBonus + levelBonus + timeBonus;
      setScore(prevScore => prevScore + pointsEarned);
      
      // Level up every 40 points
      if (score > 0 && score % 40 < (score + pointsEarned) % 40) {
        setLevel(prev => prev + 1);
        // Add time when leveling up
        setTimeLeft(prev => Math.min(prev + 60, 300));
      } else {
        // Add time for correct answers
        setTimeLeft(prev => Math.min(prev + 30, 300));
      }
      
      // Generate a new challenge after a delay
      setTimeout(() => {
        generateChallenge();
      }, 2000);
    } else {
      // Penalty for wrong answer
      setStreak(0);
      setTimeLeft(prev => Math.max(prev - 15, 1));
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Use the autoPlay hook
  useEffect(() => {
    if (autoPlay && currentStep < algorithmSteps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, algorithmSteps.length - 1));
      }, playbackSpeed);
    } else if (!autoPlay && timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoPlay, currentStep, algorithmSteps.length, playbackSpeed]);

  // Update graph based on algorithm step
  const updateGraphFromStep = (step: AlgorithmStep) => {
    // Perform a deep clone of the graph to ensure reactivity
    const updatedGraph = { 
      nodes: graph.nodes.map(node => ({...node, visited: false})),
      edges: graph.edges.map(edge => ({...edge, visited: false}))
    };
    
    // Mark visited nodes
    for (const nodeId of step.visitedNodes) {
      const node = updatedGraph.nodes.find(n => n.id === nodeId);
      if (node) node.visited = true;
    }
    
    // Mark visited edges
    for (const edgeId of step.visitedEdges) {
      const [source, target] = edgeId.split('-');
      const edge = updatedGraph.edges.find(e => 
        (e.source === source && e.target === target) || 
        (e.source === target && e.target === source)
      );
      if (edge) edge.visited = true;
    }
    
    // Update distances if available
    if (step.distances) {
      for (const [nodeId, distance] of Object.entries(step.distances)) {
        const node = updatedGraph.nodes.find(n => n.id === nodeId);
        if (node) node.distance = distance;
      }
    }
    
    // Apply changes to the graph
    setGraph(updatedGraph);
    
    // Set current node as selected - do this after setting the graph to avoid stale state
    setSelectedNode(step.currentNode || null);
  };

  // Draw the graph on the canvas
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set colors based on dark mode
    const nodeColor = isDarkMode ? '#8be9fd' : '#3498db';
    const visitedNodeColor = isDarkMode ? '#50fa7b' : '#2ecc71';
    const selectedNodeColor = isDarkMode ? '#ffb86c' : '#f39c12';
    const edgeColor = isDarkMode ? '#6272a4' : '#7f8c8d';
    const visitedEdgeColor = isDarkMode ? '#ff79c6' : '#e74c3c';
    const textColor = isDarkMode ? '#f8f8f2' : '#2c3e50';
    
    // Add some shadow for better visibility
    ctx.shadowBlur = 5;
    ctx.shadowColor = isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        // Draw edge line
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = edge.visited ? visitedEdgeColor : edgeColor;
        ctx.lineWidth = edge.visited ? 3 : 2;
        ctx.stroke();
        
        // Draw edge weight with background for better visibility
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        
        // Draw weight background
        ctx.fillStyle = isDarkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(midX, midY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw weight text
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    });
    
    // Remove shadow for nodes
    ctx.shadowBlur = 0;

    // Draw nodes
    graph.nodes.forEach(node => {
      // First draw node outline
      ctx.beginPath();
      ctx.arc(node.x, node.y, 21, 0, 2 * Math.PI);
      ctx.fillStyle = isDarkMode ? '#1e1e1e' : '#ffffff';
      ctx.fill();
      
      // Then draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      if (selectedNode === node.id) {
        ctx.fillStyle = selectedNodeColor;
      } else if (node.visited) {
        ctx.fillStyle = visitedNodeColor;
      } else {
        ctx.fillStyle = nodeColor;
      }
      
      ctx.fill();
      ctx.strokeStyle = isDarkMode ? '#555' : '#ddd';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = isDarkMode ? '#000' : '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
      
      // Draw node distance if available
      if (node.distance !== undefined && node.distance !== Infinity) {
        ctx.fillStyle = isDarkMode ? 'rgba(248, 248, 242, 0.7)' : 'rgba(44, 62, 80, 0.7)';
        ctx.font = '10px Arial';
        ctx.fillText(`d:${node.distance}`, node.x, node.y + 25);
      }
    });
  }, [graph, isDarkMode, selectedNode]);

  // Use a dedicated effect for initial graph rendering
  useEffect(() => {
    if (gameStarted && graph.nodes.length > 0) {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        drawGraph();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, graph, drawGraph]);

  // Get BFS multiple choice questions
  const getBFSQuestions = (): [MultipleChoiceQuestion[], OptimizationQuestion[], ComplexityMatchingQuestion[]] => {
    const mcQuestions: MultipleChoiceQuestion[] = [
      {
        question: "Which data structure is used in the optimal implementation of BFS?",
        options: [
          "Stack",
          "Regular List/Array",
          "Deque (Double-ended Queue)",
          "Priority Queue"
        ],
        correctAnswer: 2,
        explanation: "A deque (double-ended queue) is optimal for BFS because it allows O(1) operations for both adding elements (append) and removing from the front (popleft)."
      },
      {
        question: "What is the time complexity of BFS when using an adjacency list?",
        options: [
          "O(V²)",
          "O(V + E)",
          "O(E log V)",
          "O(V log E)"
        ],
        correctAnswer: 1,
        explanation: "BFS visits each vertex once (O(V)) and considers each edge once (O(E)), resulting in O(V + E) time complexity when using an adjacency list."
      },
      {
        question: "Which operation in the basic BFS implementation causes suboptimal performance?",
        options: [
          "list.append()",
          "list.pop(0)",
          "set.add()",
          "dictionary assignment"
        ],
        correctAnswer: 1,
        explanation: "The list.pop(0) operation has O(n) time complexity because it requires shifting all remaining elements, making it inefficient for large graphs."
      }
    ];
    
    const optimizationQuestions: OptimizationQuestion[] = [
      {
        description: "Which BFS implementation has better time complexity?",
        codeSnippets: [
          {
            code: `def bfs(graph, start):
    visited = {start}
    queue = [start]
    while queue:
        node = queue.pop(0)  # Remove from front
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
            isOptimal: false,
            timeComplexity: "O(V²) in worst case due to pop(0)",
            spaceComplexity: "O(V)",
            explanation: "Using list.pop(0) has O(n) time complexity, making the overall BFS potentially O(V²) for dense graphs."
          },
          {
            code: `from collections import deque
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        node = queue.popleft()  # O(1) operation
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
            isOptimal: true,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V)",
            explanation: "Using deque.popleft() has O(1) time complexity, preserving the optimal O(V + E) time complexity of BFS."
          }
        ],
        correctAnswer: 1
      }
    ];
    
    const complexityQuestions: ComplexityMatchingQuestion[] = [
      {
        description: "Match each operation in BFS with its time complexity:",
        operations: [
          "Adding a node to a queue (list.append)",
          "Removing a node from the front of a list (list.pop(0))",
          "Removing a node from the front of a deque (deque.popleft)",
          "Checking if a node is in a set (node in visited_set)"
        ],
        complexities: [
          "O(1)",
          "O(n)",
          "O(log n)",
          "O(n²)"
        ],
        correctMatches: {
          0: 0,  // list.append -> O(1)
          1: 1,  // list.pop(0) -> O(n)
          2: 0,  // deque.popleft -> O(1)
          3: 0   // node in set -> O(1) amortized
        },
        explanation: "Understanding the time complexity of each operation helps identify bottlenecks in algorithm implementations."
      }
    ];
    
    return [mcQuestions, optimizationQuestions, complexityQuestions];
  };
  
  // Get Dijkstra multiple choice questions
  const getDijkstraQuestions = (): [MultipleChoiceQuestion[], OptimizationQuestion[], ComplexityMatchingQuestion[]] => {
    const mcQuestions: MultipleChoiceQuestion[] = [
      {
        question: "Which data structure makes Dijkstra's algorithm most efficient?",
        options: [
          "Array/List",
          "Queue",
          "Stack",
          "Priority Queue (Min Heap)"
        ],
        correctAnswer: 3,
        explanation: "A priority queue (min heap) allows efficiently extracting the node with the minimum distance in O(log V) time, which is essential for Dijkstra's algorithm."
      },
      {
        question: "What is the time complexity of Dijkstra's algorithm with a binary heap implementation?",
        options: [
          "O(V + E)",
          "O(V²)",
          "O((V + E) log V)",
          "O(E log E)"
        ],
        correctAnswer: 2,
        explanation: "Using a binary heap (priority queue), Dijkstra's algorithm runs in O((V + E) log V) time: each vertex is extracted once (O(V log V)) and each edge relaxation takes O(log V)."
      },
      {
        question: "Why can't Dijkstra's algorithm handle negative edge weights?",
        options: [
          "It causes arithmetic overflow",
          "Negative cycles can lead to infinitely decreasing path lengths",
          "The algorithm only works with positive integers",
          "The priority queue implementation doesn't support negative values"
        ],
        correctAnswer: 1,
        explanation: "Dijkstra's algorithm assumes that adding an edge to a path never decreases its length. With negative weights, this assumption breaks, potentially causing infinite loops in graphs with negative cycles."
      }
    ];
    
    const optimizationQuestions: OptimizationQuestion[] = [
      {
        description: "Which Dijkstra implementation has better time complexity?",
        codeSnippets: [
          {
            code: `def dijkstra(graph, start):
    # Initialize distances with infinity
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    # Track visited nodes
    visited = set()
    
    while len(visited) < len(graph):
        # Find unvisited node with minimum distance
        current = None
        min_distance = float('infinity')
        
        for node in graph:
            if node not in visited and distances[node] < min_distance:
                current = node
                min_distance = distances[node]
        
        if current is None:
            break
            
        visited.add(current)
        
        # Update distances to neighbors
        for neighbor, weight in graph[current].items():
            distance = distances[current] + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance`,
            isOptimal: false,
            timeComplexity: "O(V²)",
            spaceComplexity: "O(V)",
            explanation: "This implementation scans all vertices to find the minimum distance node in each iteration, resulting in O(V²) time complexity."
          },
          {
            code: `import heapq

def dijkstra(graph, start):
    # Priority queue of (distance, node)
    pq = [(0, start)]
    # Track distances
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    # Track visited nodes
    visited = set()
    
    while pq:
        # Get node with minimum distance
        current_distance, current = heapq.heappop(pq)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        for neighbor, weight in graph[current].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))`,
            isOptimal: true,
            timeComplexity: "O((V + E) log V)",
            spaceComplexity: "O(V)",
            explanation: "This implementation uses a priority queue to efficiently find the node with minimum distance, improving time complexity to O((V+E)log V)."
          }
        ],
        correctAnswer: 1
      }
    ];
    
    const complexityQuestions: ComplexityMatchingQuestion[] = [
      {
        description: "Match each operation in Dijkstra's algorithm with its time complexity:",
        operations: [
          "Extracting minimum element from priority queue (heapq.heappop)",
          "Adding element to priority queue (heapq.heappush)",
          "Linear search for minimum distance node",
          "Updating a distance and adding to priority queue"
        ],
        complexities: [
          "O(1)",
          "O(log V)",
          "O(V)",
          "O(E log V)"
        ],
        correctMatches: {
          0: 1,  // heapq.heappop -> O(log V)
          1: 1,  // heapq.heappush -> O(log V)
          2: 2,  // Linear search -> O(V)
          3: 1   // Update and add to pq -> O(log V)
        },
        explanation: "Understanding the time complexity of priority queue operations explains why they're preferred for Dijkstra's algorithm."
      }
    ];
    
    return [mcQuestions, optimizationQuestions, complexityQuestions];
  };

  // Add getDFSQuestions function
  const getDFSQuestions = (): [MultipleChoiceQuestion[], OptimizationQuestion[], ComplexityMatchingQuestion[]] => {
    const mcQuestions: MultipleChoiceQuestion[] = [
      {
        question: "Which data structure is primarily used in iterative DFS?",
        options: [
          "Queue",
          "Stack",
          "Heap",
          "Priority Queue"
        ],
        correctAnswer: 1,
        explanation: "DFS uses a stack to keep track of nodes to visit next. This allows exploration to go as deep as possible along each branch before backtracking."
      },
      {
        question: "What is the time complexity of DFS on an adjacency list?",
        options: [
          "O(V)",
          "O(E)",
          "O(V + E)",
          "O(V * E)"
        ],
        correctAnswer: 2,
        explanation: "DFS visits each vertex once (O(V)) and traverses each edge once (O(E)), resulting in O(V + E) time complexity when using an adjacency list."
      },
      {
        question: "Which is NOT a typical application of DFS?",
        options: [
          "Topological sorting",
          "Finding shortest paths in unweighted graphs",
          "Detecting cycles",
          "Solving puzzles with unique solutions"
        ],
        correctAnswer: 1,
        explanation: "Finding shortest paths in unweighted graphs is typically done with BFS, not DFS. DFS explores deeply and doesn't guarantee the shortest path."
      },
      {
        question: "What problem can occur in a recursive DFS implementation for very large graphs?",
        options: [
          "Integer overflow",
          "Stack overflow",
          "Memory fragmentation",
          "Deadlock"
        ],
        correctAnswer: 1,
        explanation: "Recursive DFS can cause stack overflow for very large graphs due to the deep call stack. Iterative implementation uses an explicit stack data structure, avoiding this issue."
      },
      {
        question: "Which traversal property is true for DFS but not BFS?",
        options: [
          "Visits all vertices exactly once",
          "Always finds the shortest path",
          "Explores a branch completely before backtracking",
          "Requires O(V) extra space"
        ],
        correctAnswer: 2,
        explanation: "DFS explores a branch completely before backtracking, unlike BFS which explores all nodes at the current depth before moving deeper."
      }
    ];
    
    const optimizationQuestions: OptimizationQuestion[] = [
      {
        description: "Which DFS implementation is better for very large graphs?",
        codeSnippets: [
          {
            code: `def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(node)
    print(node)  # Process node
    
    # Recursively visit all neighbors
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)`,
            isOptimal: false,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V) for visited set + O(V) for call stack",
            explanation: "Recursive DFS uses the program call stack which can overflow on very large graphs. Each recursive call adds a frame to the call stack."
          },
          {
            code: `def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    
    while stack:
        node = stack.pop()
        
        if node not in visited:
            visited.add(node)
            print(node)  # Process node
            
            # Add neighbors to stack
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)`,
            isOptimal: true,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V) for visited set + O(V) for explicit stack",
            explanation: "Iterative DFS uses an explicit stack, avoiding call stack limitations. It has the same time complexity but is more robust for very large graphs."
          }
        ],
        correctAnswer: 1
      },
      {
        description: "Which implementation is better for detecting cycles in a directed graph?",
        codeSnippets: [
          {
            code: `def has_cycle(graph):
    visited = set()
    
    for node in graph:
        if node not in visited:
            if dfs_detect_cycle(graph, node, visited, set()):
                return True
    return False

def dfs_detect_cycle(graph, node, visited, recursion_stack):
    visited.add(node)
    recursion_stack.add(node)
    
    for neighbor in graph[node]:
        if neighbor not in visited:
            if dfs_detect_cycle(graph, neighbor, visited, recursion_stack):
                return True
        elif neighbor in recursion_stack:
            return True
    
    recursion_stack.remove(node)
    return False`,
            isOptimal: true,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V)",
            explanation: "This implementation keeps track of nodes in the current recursion stack, allowing it to detect back-edges (cycles) efficiently in directed graphs."
          },
          {
            code: `def has_cycle(graph):
    visited = set()
    
    for node in graph:
        if node not in visited:
            stack = [node]
            while stack:
                current = stack.pop()
                visited.add(current)
                
                for neighbor in graph[current]:
                    if neighbor in visited:
                        return True
                    stack.append(neighbor)
    return False`,
            isOptimal: false,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V)",
            explanation: "This implementation incorrectly identifies any previously visited node as part of a cycle, even if it's not in the current path. It doesn't distinguish between back-edges and cross-edges."
          }
        ],
        correctAnswer: 0
      }
    ];
    
    const complexityQuestions: ComplexityMatchingQuestion[] = [
      {
        description: "Match each DFS operation with its time complexity:",
        operations: [
          "Checking if a node has been visited (in a set)",
          "Adding a node to the stack",
          "Removing a node from the stack",
          "Finding all connected components in a graph"
        ],
        complexities: [
          "O(1)",
          "O(V)",
          "O(E)",
          "O(V + E)"
        ],
        correctMatches: {
          0: 0,  // set lookup -> O(1)
          1: 0,  // stack push -> O(1)
          2: 0,  // stack pop -> O(1)
          3: 3   // finding all components -> O(V + E)
        },
        explanation: "DFS operations on stacks and sets are constant time, while traversing the entire graph takes O(V + E) time."
      }
    ];
    
    return [mcQuestions, optimizationQuestions, complexityQuestions];
  };

  // Add getMSTQuestions function
  const getMSTQuestions = (): [MultipleChoiceQuestion[], OptimizationQuestion[], ComplexityMatchingQuestion[]] => {
    const mcQuestions: MultipleChoiceQuestion[] = [
      {
        question: "What does an MST (Minimum Spanning Tree) guarantee for a graph?",
        options: [
          "Shortest path between any two vertices",
          "Minimum total edge weight that connects all vertices",
          "Fastest traversal time through the graph",
          "Minimum number of edges in the graph"
        ],
        correctAnswer: 1,
        explanation: "A Minimum Spanning Tree guarantees the minimum total edge weight that connects all vertices without cycles."
      },
      {
        question: "Which algorithm builds an MST by adding the minimum weight edge that connects a vertex in the tree to a vertex outside the tree?",
        options: [
          "Kruskal's algorithm",
          "Prim's algorithm",
          "Dijkstra's algorithm",
          "Bellman-Ford algorithm"
        ],
        correctAnswer: 1,
        explanation: "Prim's algorithm starts with a single vertex and grows the MST by always adding the minimum weight edge that connects a vertex in the tree to a vertex outside the tree."
      },
      {
        question: "Which algorithm builds an MST by considering edges in ascending weight order?",
        options: [
          "Kruskal's algorithm",
          "Prim's algorithm",
          "Dijkstra's algorithm",
          "Floyd-Warshall algorithm"
        ],
        correctAnswer: 0,
        explanation: "Kruskal's algorithm sorts all edges by weight and adds them to the MST if they don't create a cycle, considering them in ascending weight order."
      },
      {
        question: "Which data structure makes Kruskal's algorithm efficient?",
        options: [
          "Priority Queue",
          "Disjoint Set (Union-Find)",
          "Balanced Binary Tree",
          "Hash Table"
        ],
        correctAnswer: 1,
        explanation: "Kruskal's algorithm uses a Disjoint Set (Union-Find) data structure to efficiently check if adding an edge would create a cycle in the MST."
      },
      {
        question: "What is the time complexity of Prim's algorithm using a binary heap?",
        options: [
          "O(V log V)",
          "O(E log V)",
          "O(V²)",
          "O((V + E) log V)"
        ],
        correctAnswer: 3,
        explanation: "Prim's algorithm with a binary heap has O((V + E) log V) time complexity. Each vertex is extracted once (O(V log V)) and each edge is considered for relaxation (O(E log V))."
      }
    ];
    
    const optimizationQuestions: OptimizationQuestion[] = [
      {
        description: "Which implementation of Prim's algorithm has better time complexity for dense graphs?",
        codeSnippets: [
          {
            code: `def prims_mst(graph):
    # Start from first vertex
    start = list(graph.keys())[0]
    
    # Track vertices in MST
    mst_vertices = {start}
    # Track edges in MST
    mst_edges = []
    
    # Continue until all vertices are included
    while len(mst_vertices) < len(graph):
        min_edge = None
        min_weight = float('infinity')
        
        # Find minimum weight edge from MST to outside
        for u in mst_vertices:
            for v, weight in graph[u].items():
                if v not in mst_vertices and weight < min_weight:
                    min_weight = weight
                    min_edge = (u, v, weight)
        
        # If no edge found, graph is disconnected
        if min_edge is None:
            break
            
        # Add edge to MST
        u, v, weight = min_edge
        mst_edges.append((u, v, weight))
        mst_vertices.add(v)
    
    return mst_edges`,
            isOptimal: false,
            timeComplexity: "O(V²)",
            spaceComplexity: "O(V + E)",
            explanation: "This implementation scans all potential edges in each iteration, resulting in O(V²) time complexity which is efficient for dense graphs where E ≈ V²."
        },
        {
          code: `import heapq

def prims_mst(graph):
    # Start from first vertex
    start = list(graph.keys())[0]
    
    # Priority queue for edges (weight, vertex, parent)
    edges = [(0, start, None)]
    
    # Track vertices in MST
    visited = set()
    # Track edges in MST
    mst_edges = []
    
    while edges and len(visited) < len(graph):
        # Get minimum weight edge
        weight, vertex, parent = heapq.heappop(edges)
        
        if vertex in visited:
            continue
            
        # Add vertex to MST
        visited.add(vertex)
        
        # Add edge to MST (except for start vertex)
        if parent is not None:
            mst_edges.append((parent, vertex, weight))
        
        # Add edges to neighbors
        for neighbor, edge_weight in graph[vertex].items():
            if neighbor not in visited:
                heapq.heappush(edges, (edge_weight, neighbor, vertex))
    
    return mst_edges`,
          isOptimal: true,
          timeComplexity: "O((V + E) log V)",
          spaceComplexity: "O(V + E)",
          explanation: "This implementation uses a priority queue to efficiently find the minimum weight edge, resulting in O((V + E) log V) time complexity which is better for sparse graphs."
        }
      ],
      correctAnswer: 0
    },
    {
      description: "Which Kruskal's implementation is more efficient?",
      codeSnippets: [
        {
          code: `def kruskal_mst(graph):
    # Convert graph to edge list
    edges = []
    for u in graph:
        for v, weight in graph[u].items():
            if u < v:  # Avoid duplicates
                edges.append((u, v, weight))
    
    # Sort edges by weight
    edges.sort(key=lambda x: x[2])
    
    # Simple cycle detection using path checking
    def has_path(graph, start, end, visited=None):
        if visited is None:
            visited = set()
        
        if start == end:
            return True
            
        visited.add(start)
        
        for neighbor in graph.get(start, []):
            if neighbor not in visited:
                if has_path(graph, neighbor, end, visited):
                    return True
                    
        return False
    
    # Build MST
    mst = {}
    for u, v, weight in edges:
        # Check if adding this edge creates a cycle
        temp_graph = {node: [] for node in graph}
        for src, dest in mst.items():
            temp_graph[src].append(dest)
            temp_graph[dest].append(src)
            
        if not has_path(temp_graph, u, v):
            mst[(u, v)] = weight
            
    return mst`,
          isOptimal: false,
          timeComplexity: "O(E² × V)",
          spaceComplexity: "O(V + E)",
          explanation: "This implementation checks for cycles by doing a path finding operation for each edge, which is very inefficient with O(E² × V) time complexity."
        },
        {
          code: `class DisjointSet:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}
        
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
        
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return
            
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

def kruskal_mst(graph):
    # Convert graph to edge list
    edges = []
    for u in graph:
        for v, weight in graph[u].items():
            if u < v:  # Avoid duplicates
                edges.append((u, v, weight))
    
    # Sort edges by weight
    edges.sort(key=lambda x: x[2])
    
    # Initialize disjoint set
    ds = DisjointSet(graph.keys())
    
    # Build MST
    mst = {}
    for u, v, weight in edges:
        # Check if adding this edge creates a cycle
        if ds.find(u) != ds.find(v):
            mst[(u, v)] = weight
            ds.union(u, v)
            
    return mst`,
          isOptimal: true,
          timeComplexity: "O(E log E)",
          spaceComplexity: "O(V + E)",
          explanation: "This implementation uses a Disjoint Set (Union-Find) with path compression and union by rank, achieving near constant time for union and find operations after initial setup, resulting in O(E log E) time complexity."
        }
      ],
      correctAnswer: 1
    }
  ];
  
  const complexityQuestions: ComplexityMatchingQuestion[] = [
    {
      description: "Match each MST operation with its time complexity:",
      operations: [
        "Sorting edges by weight in Kruskal's algorithm",
        "Finding the parent of a vertex in Union-Find with path compression (amortized)",
        "Extracting minimum edge from a binary heap in Prim's algorithm",
        "Union operation in Union-Find with path compression and rank (amortized)"
      ],
      complexities: [
        "O(1)",
        "O(log V)",
        "O(E log E)",
        "O(α(V))"  // α is inverse Ackermann function, effectively constant
      ],
      correctMatches: {
        0: 2,  // sorting edges -> O(E log E)
        1: 3,  // find operation -> O(α(V))
        2: 1,  // extract min -> O(log V)
        3: 3   // union operation -> O(α(V))
      },
      explanation: "Understanding the time complexity of MST operations helps identify the performance bottlenecks in both Prim's and Kruskal's algorithms."
    }
  ];
  
  return [mcQuestions, optimizationQuestions, complexityQuestions];
};

  // Update the useEffect to reset questions when algorithm is manually changed
  useEffect(() => {
    // Reset selected question when algorithm changes
    setSelectedQuestion(0);
    setUserAnswers({});
    setShowExplanations({});
  }, [selectedAlgorithm]);

  // Update/replace the getQuestionsForCurrentAlgorithm function
  const getQuestionsForCurrentAlgorithm = () => {
    // Use the explicitly selected algorithm instead of the current challenge
    switch (selectedAlgorithm) {
      case 'bfs':
        return getBFSQuestions();
      case 'dfs':
        return getDFSQuestions();
      case 'dijkstra':
        return getDijkstraQuestions();
      case 'mst':
        return getMSTQuestions();
      default:
        return [[], [], []];
    }
  };

  // Main game component
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/games" className={`font-bold hover:underline flex items-center gap-1 transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back to Games</span>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Graph Algorithm Master</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn graph algorithms through interactive challenges</p>
          </div>
          <div className="flex items-center space-x-4">
            {gameStarted && !gameOver && (
              <div className="text-lg">
                <span className="font-semibold">Time:</span> {formatTime(timeLeft)}
              </div>
            )}
            <div className="text-lg font-bold px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {score} pts
            </div>
          </div>
        </div>

        {!gameStarted && !gameOver ? (
          <div className="max-w-5xl mx-auto text-center p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-3xl font-bold mb-6">Master Graph Algorithms Through Interactive Learning</h2>
            <p className="mb-8 text-lg">
              Learn optimal implementations, time/space complexity trade-offs, and best practices for essential graph algorithms.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className={`p-6 rounded-lg text-left ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3">🔄</div>
                  <h3 className="text-xl font-semibold">Breadth-First Search (BFS)</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Optimal queue implementations with O(1) operations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Finding shortest paths in unweighted graphs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Time complexity: O(V + E)</span>
                  </li>
                </ul>
              </div>
              
              <div className={`p-6 rounded-lg text-left ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3">↘️</div>
                  <h3 className="text-xl font-semibold">Depth-First Search (DFS)</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Iterative vs. recursive implementations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Cycle detection and topological sorting</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Time complexity: O(V + E)</span>
                  </li>
                </ul>
              </div>
              
              <div className={`p-6 rounded-lg text-left ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3">⚡</div>
                  <h3 className="text-xl font-semibold">Dijkstra's Algorithm</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Priority queue optimizations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Shortest paths in weighted graphs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Time complexity: O((V+E) log V)</span>
                  </li>
                </ul>
              </div>
              
              <div className={`p-6 rounded-lg text-left ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                <div className="flex items-center mb-3">
                  <div className="text-3xl mr-3">🌳</div>
                  <h3 className="text-xl font-semibold">Minimum Spanning Tree</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Prim's vs. Kruskal's algorithms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Union-Find data structure optimizations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> 
                    <span>Time complexity: O(E log V)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={startGame}
                className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-200 shadow-md"
              >
                Start Learning
              </button>
              
              <a 
                href="https://en.wikipedia.org/wiki/Graph_traversal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                Learn More About Graphs
              </a>
            </div>
          </div>
        ) : gameOver ? (
          <div className="max-w-lg mx-auto text-center p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Session Completed!</h2>
            <div className="text-5xl font-bold mb-4">{score}</div>
            <p className="mb-6">
              High Score: <span className="font-bold">{highScore}</span>
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Start New Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left panel - Learning content and questions */}
            <div className="lg:col-span-1">
              <div className={`p-5 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-full`}>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p>Level: <span className="font-semibold">{level}</span></p>
                    <p>Streak: <span className="font-semibold">{streak}</span></p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (score % 40) * 2.5)}%` }}></div>
                  </div>
                </div>
                
                {/* After the currentChallenge section and before the Questions Section in the left panel */}
                <div className={`mb-5 p-5 rounded-xl ${isDarkMode ? 'bg-gray-800 bg-opacity-60' : 'bg-gray-50'} shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Choose Algorithm to Practice:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedAlgorithm('bfs')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedAlgorithm === 'bfs' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                              : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      Breadth-First Search
                    </button>
                    <button
                      onClick={() => setSelectedAlgorithm('dfs')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedAlgorithm === 'dfs' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                              : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      Depth-First Search
                    </button>
                    <button
                      onClick={() => setSelectedAlgorithm('dijkstra')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedAlgorithm === 'dijkstra' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                              : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      Dijkstra's Algorithm
                    </button>
                    <button
                      onClick={() => setSelectedAlgorithm('mst')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedAlgorithm === 'mst' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                          : isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                              : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      Minimum Spanning Tree
                    </button>
                  </div>
                </div>
                
                {currentChallenge && (
                  <div className={`mb-5 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{currentChallenge.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        currentChallenge.difficulty === 'Easy' ? 'bg-green-500' :
                        currentChallenge.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {currentChallenge.difficulty}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{currentChallenge.description}</p>
                    <div className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded inline-block">
                      Algorithm: {currentChallenge.algorithm.toUpperCase()}
                    </div>
                    <div className="mt-2 text-xs">
                      <span className="inline-block px-2 py-1 mr-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        Time: {currentChallenge.timeComplexity}
                      </span>
                      <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                        Space: {currentChallenge.spaceComplexity}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Questions Section */}
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} shadow-lg mb-5 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-xl text-blue-600 dark:text-blue-400">
                      {selectedAlgorithm.toUpperCase()} Concepts
                    </h4>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      Question {selectedQuestion + 1} / {getQuestionsForCurrentAlgorithm()[0].length + getQuestionsForCurrentAlgorithm()[1].length}
                    </span>
                  </div>
                  
                  {/* Add this inside the questions section, just after the header */}
                  <div className="flex items-center justify-between mt-2 mb-4">
                    <span className="text-sm font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {selectedQuestion < getQuestionsForCurrentAlgorithm()[0].length 
                        ? "Multiple Choice Question" 
                        : "Code Optimization Question"}
                    </span>
                    <div className="flex space-x-2">
                      {Array.from({ length: getQuestionsForCurrentAlgorithm()[0].length + getQuestionsForCurrentAlgorithm()[1].length }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedQuestion(idx)}
                          className={`w-4 h-4 rounded-full transition-all duration-200 ${selectedQuestion === idx 
                            ? 'bg-blue-600 shadow-sm transform scale-125' 
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
                          aria-label={`Go to question ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Render MC questions with improved styling */}
                  {selectedQuestion < getQuestionsForCurrentAlgorithm()[0].length && getQuestionsForCurrentAlgorithm()[0][selectedQuestion] && (
                    <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-50'} shadow-sm`}>
                      <p className="font-medium mb-4 text-lg">{getQuestionsForCurrentAlgorithm()[0][selectedQuestion].question}</p>
                      
                      <div className="space-y-3 mb-4">
                        {getQuestionsForCurrentAlgorithm()[0][selectedQuestion].options.map((option, optIdx) => (
                          <div 
                            key={optIdx}
                            onClick={() => {
                              const newAnswers = {...userAnswers};
                              newAnswers[selectedQuestion] = optIdx;
                              setUserAnswers(newAnswers);
                              
                              // Auto-show explanation after answering
                              const newExplanations = {...showExplanations};
                              newExplanations[selectedQuestion] = true;
                              setShowExplanations(newExplanations);
                              
                              // Update score if correct
                              if (optIdx === getQuestionsForCurrentAlgorithm()[0][selectedQuestion].correctAnswer && 
                                  userAnswers[selectedQuestion] !== getQuestionsForCurrentAlgorithm()[0][selectedQuestion].correctAnswer) {
                                setQuestionScore(prev => prev + 5);
                                setScore(prev => prev + 5);
                                
                                // Move to next question after a delay if correct
                                setTimeout(() => {
                                  const totalQuestions = getQuestionsForCurrentAlgorithm()[0].length + 
                                                   getQuestionsForCurrentAlgorithm()[1].length;
                                  setSelectedQuestion((selectedQuestion + 1) % totalQuestions);
                                }, 1500);
                              }
                            }}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                              userAnswers[selectedQuestion] === optIdx 
                                ? (optIdx === getQuestionsForCurrentAlgorithm()[0][selectedQuestion].correctAnswer 
                                    ? 'bg-green-50 dark:bg-green-900 border-green-500 border-2 shadow-md' 
                                    : 'bg-red-50 dark:bg-red-900 border-red-500 border-2')
                                : (isDarkMode 
                                    ? 'hover:bg-gray-600 bg-gray-700 border border-gray-600 text-gray-200' 
                                    : 'hover:bg-gray-100 bg-white border border-gray-200 text-gray-800 hover:shadow-sm')
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-bold ${
                                userAnswers[selectedQuestion] === optIdx 
                                  ? (optIdx === getQuestionsForCurrentAlgorithm()[0][selectedQuestion].correctAnswer 
                                      ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' 
                                      : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200')
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}>{String.fromCharCode(65 + optIdx)}</span>
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {showExplanations[selectedQuestion] && (
                        <div className={`mt-4 p-4 rounded-lg ${
                          isDarkMode 
                            ? 'bg-blue-900 bg-opacity-20 border border-blue-800 text-blue-200' 
                            : 'bg-blue-50 border border-blue-100 text-blue-800'
                        } transition-opacity duration-300 ease-in-out`}>
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-blue-800 dark:text-blue-200">{getQuestionsForCurrentAlgorithm()[0][selectedQuestion].explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Render optimization questions */}
                  {selectedQuestion >= getQuestionsForCurrentAlgorithm()[0].length && 
                   selectedQuestion < getQuestionsForCurrentAlgorithm()[0].length + getQuestionsForCurrentAlgorithm()[1].length && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} shadow-sm`}>
                      <p className="font-medium mb-3">
                        {getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].description}
                      </p>
                      
                      <div className="space-y-4 mb-3">
                        {getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].codeSnippets.map((snippet, snipIdx) => (
                          <div 
                            key={snipIdx}
                            onClick={() => {
                              const optIndex = selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length;
                              const questionKey = `opt-${currentChallenge?.algorithm}-${optIndex}`;
                              
                              const newAnswers = {...userAnswers};
                              newAnswers[questionKey] = snipIdx;
                              setUserAnswers(newAnswers);
                              
                              // Auto-show explanation
                              const newExplanations = {...showExplanations};
                              newExplanations[questionKey] = true;
                              setShowExplanations(newExplanations);
                              
                              // Update score if correct
                              if (snipIdx === getQuestionsForCurrentAlgorithm()[1][optIndex].correctAnswer && 
                                  userAnswers[questionKey] !== getQuestionsForCurrentAlgorithm()[1][optIndex].correctAnswer) {
                                setQuestionScore(prev => prev + 10);
                                setScore(prev => prev + 10);
                                
                                // Move to next question after a delay if correct
                                setTimeout(() => {
                                  const totalQuestions = getQuestionsForCurrentAlgorithm()[0].length + 
                                                   getQuestionsForCurrentAlgorithm()[1].length;
                                  setSelectedQuestion((selectedQuestion + 1) % totalQuestions);
                                }, 1500);
                              }
                            }}
                            className={`cursor-pointer rounded-md overflow-hidden border ${
                              userAnswers[`opt-${currentChallenge?.algorithm}-${selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length}`] === snipIdx
                                ? (snipIdx === getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].correctAnswer 
                                    ? 'border-green-500' 
                                    : 'border-red-500')
                                : (isDarkMode ? 'border-gray-700' : 'border-gray-200')
                            }`}
                          >
                            <div className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <span className="font-medium">Option {String.fromCharCode(65 + snipIdx)}</span>
                            </div>
                            <div className="bg-gray-900 p-2">
                              <SyntaxHighlighter
                                language="python"
                                style={vscDarkPlus}
                                customStyle={{ 
                                  backgroundColor: 'transparent',
                                  margin: 0,
                                  padding: 0,
                                  fontSize: '12px',
                                  maxHeight: '200px',
                                  overflowY: 'auto'
                                }}
                              >
                                {snippet.code}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {showExplanations[`opt-${currentChallenge?.algorithm}-${selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length}`] && (
                        <div className={`mt-3 p-3 rounded-md ${
                          isDarkMode ? 'bg-blue-900 bg-opacity-30 text-blue-200' : 'bg-blue-50 text-blue-800'
                        }`}>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="font-semibold">Option A:</p>
                              <p className="text-xs mb-1">Time: {getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].codeSnippets[0].timeComplexity}</p>
                              <p className="text-xs mb-1">Space: {getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].codeSnippets[0].spaceComplexity}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Option B:</p>
                              <p className="text-xs mb-1">Time: {getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].codeSnippets[1].timeComplexity}</p>
                              <p className="text-xs mb-1">Space: {getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].codeSnippets[1].spaceComplexity}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Optimal solution: Option {String.fromCharCode(65 + getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].correctAnswer)}</p>
                            <p className="text-sm mt-1">{getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].codeSnippets[getQuestionsForCurrentAlgorithm()[1][selectedQuestion - getQuestionsForCurrentAlgorithm()[0].length].correctAnswer].explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 mb-5 mt-6">
                  <button 
                    onClick={() => {
                      const totalQuestions = 
                        getQuestionsForCurrentAlgorithm()[0].length + 
                        getQuestionsForCurrentAlgorithm()[1].length;
                      setSelectedQuestion((selectedQuestion - 1 + totalQuestions) % totalQuestions);
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:shadow-md'
                    } flex items-center justify-center font-medium`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  <button 
                    onClick={() => {
                      const totalQuestions = 
                        getQuestionsForCurrentAlgorithm()[0].length + 
                        getQuestionsForCurrentAlgorithm()[1].length;
                      setSelectedQuestion((selectedQuestion + 1) % totalQuestions);
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:shadow-md'
                    } flex items-center justify-center font-medium`}
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <button 
                  onClick={() => runAlgorithm(currentChallenge?.algorithm || 'bfs')}
                  className="w-full px-4 py-3 rounded-lg mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md transition-all duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Visualize {currentChallenge?.algorithm.toUpperCase() || 'Algorithm'}
                </button>
                
                <button 
                  onClick={() => setShowCode(!showCode)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center font-medium ${
                    showCode
                      ? (isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800')
                      : (isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200')
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {showCode ? 'Hide Code Examples' : 'Show Code Examples'}
                </button>
              </div>
            </div>
            
            {/* Right panel - Graph visualization and code */}
            <div className="lg:col-span-2">
              <div className={`p-5 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-full`}>
                {/* Graph visualization */}
                <div className="relative mb-4">
                  <div className="flex justify-center">
                    <canvas 
                      ref={canvasRef} 
                      width={500} 
                      height={400}
                      className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-inner"
                      onClick={(e) => {
                        const canvas = canvasRef.current;
                        if (!canvas) return;
                        
                        const rect = canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        // Find if a node was clicked
                        const clickedNode = graph.nodes.find(node => {
                          const dx = node.x - x;
                          const dy = node.y - y;
                          return Math.sqrt(dx*dx + dy*dy) <= 20; // Node radius is 20
                        });
                        
                        if (clickedNode) {
                          handleNodeClick(clickedNode.id);
                        }
                      }}
                    />
                  </div>
                  
                  {algorithmSteps.length > 0 && currentStep < algorithmSteps.length && (
                    <div className={`mt-4 p-4 rounded-md ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-blue-50 text-blue-800'}`}>
                      <div className="font-medium mb-2">{algorithmSteps[currentStep].description}</div>
                      
                      {/* Visualization controls */}
                      <div className="flex justify-between items-center mt-3">
                        <button 
                          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                          disabled={currentStep === 0}
                          className={`p-2 rounded-full ${
                            currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="text-sm">Step {currentStep + 1} of {algorithmSteps.length}</span>
                        <button 
                          onClick={() => setCurrentStep(prev => Math.min(algorithmSteps.length - 1, prev + 1))}
                          disabled={currentStep === algorithmSteps.length - 1}
                          className={`p-2 rounded-full ${
                            currentStep === algorithmSteps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`w-full mt-2 px-4 py-2 rounded-md ${
                          autoPlay 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        } transition flex items-center justify-center`}
                      >
                        <span className="mr-2">{autoPlay ? 'Pause' : 'Auto Play'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            autoPlay ? "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M10 9v6m4-6v6" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          } />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Code viewer */}
                {showCode && currentChallenge && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold">{currentChallenge.pythonCode[codeSnippetIndex].title}</h3>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowOptimizedCode(!showOptimizedCode)}
                          className={`px-4 py-1 rounded-md text-sm transition ${
                            showOptimizedCode 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {showOptimizedCode ? 'View Basic' : 'View Optimized'}
                        </button>
                      </div>
                    </div>
                    
                    <div className={`p-1 rounded-md bg-gray-900 mb-4 ${isDarkMode ? 'border border-gray-700' : ''}`}>
                      <SyntaxHighlighter
                        language="python"
                        style={vscDarkPlus}
                        showLineNumbers={true}
                        customStyle={{ 
                          backgroundColor: 'transparent',
                          margin: 0,
                          padding: '10px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}
                      >
                        {showOptimizedCode ? currentChallenge.pythonCode[1].code : currentChallenge.pythonCode[0].code}
                      </SyntaxHighlighter>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Key Optimizations:</h4>
                      <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} text-sm`}>
                        {showOptimizedCode ? currentChallenge.pythonCode[1].explanation : currentChallenge.pythonCode[0].explanation}
                      </div>
                    </div>
                    
                    {/* Code optimization challenge */}
                    {getQuestionsForCurrentAlgorithm()[1][0] && (
                      <div className="mt-4 border-t pt-4 border-gray-300 dark:border-gray-700">
                        <h4 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">Time Complexity Challenge</h4>
                        <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{getQuestionsForCurrentAlgorithm()[1][0].description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {getQuestionsForCurrentAlgorithm()[1][0].codeSnippets.map((snippet, snipIdx) => (
                            <div 
                              key={snipIdx}
                              onClick={() => {
                                const newAnswers = {...userAnswers};
                                const questionKey = 'optimization-0';
                                newAnswers[questionKey] = snipIdx;
                                setUserAnswers(newAnswers);
                                
                                // Show explanation
                                const newExplanations = {...showExplanations};
                                newExplanations[questionKey] = true;
                                setShowExplanations(newExplanations);
                                
                                // Update score if correct
                                if (snipIdx === getQuestionsForCurrentAlgorithm()[1][0].correctAnswer && 
                                    userAnswers['optimization-0'] !== getQuestionsForCurrentAlgorithm()[1][0].correctAnswer) {
                                  setQuestionScore(prev => prev + 10);
                                  setScore(prev => prev + 10);
                                }
                              }}
                              className={`cursor-pointer rounded-lg overflow-hidden border ${
                                userAnswers['optimization-0'] === snipIdx
                                  ? (snipIdx === getQuestionsForCurrentAlgorithm()[1][0].correctAnswer 
                                      ? 'border-green-500' 
                                      : 'border-red-500')
                                  : (isDarkMode ? 'border-gray-700' : 'border-gray-300')
                              }`}
                            >
                              <div className={`p-2 text-sm font-medium ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                Option {String.fromCharCode(65 + snipIdx)}
                              </div>
                              <div className="bg-gray-900 p-2 overflow-x-auto" style={{ maxHeight: '150px' }}>
                                <SyntaxHighlighter
                                  language="python"
                                  style={vscDarkPlus}
                                  customStyle={{ 
                                    backgroundColor: 'transparent',
                                    margin: 0,
                                    padding: 0,
                                    fontSize: '12px'
                                  }}
                                >
                                  {snippet.code}
                                </SyntaxHighlighter>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {showExplanations['optimization-0'] && (
                          <div className={`mt-3 p-3 rounded-md ${
                            isDarkMode ? 'bg-blue-900 bg-opacity-30 text-blue-200' : 'bg-blue-50 text-blue-800'
                          }`}>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-semibold">Option A:</p>
                                <p className="text-xs mb-1">Time: {getQuestionsForCurrentAlgorithm()[1][0].codeSnippets[0].timeComplexity}</p>
                                <p className="text-xs mb-1">Space: {getQuestionsForCurrentAlgorithm()[1][0].codeSnippets[0].spaceComplexity}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Option B:</p>
                                <p className="text-xs mb-1">Time: {getQuestionsForCurrentAlgorithm()[1][0].codeSnippets[1].timeComplexity}</p>
                                <p className="text-xs mb-1">Space: {getQuestionsForCurrentAlgorithm()[1][0].codeSnippets[1].spaceComplexity}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Optimal solution: Option {String.fromCharCode(65 + getQuestionsForCurrentAlgorithm()[1][0].correctAnswer)}</p>
                              <p className="text-sm mt-1">{getQuestionsForCurrentAlgorithm()[1][0].codeSnippets[getQuestionsForCurrentAlgorithm()[1][0].correctAnswer].explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphExplorerGame; 
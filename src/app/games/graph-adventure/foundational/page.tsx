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

const GraphFoundationalGame = () => {
  // Component state
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [userPath, setUserPath] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<'learn' | 'challenge'>('learn');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectedCodeTab, setSelectedCodeTab] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [selectedOptimization, setSelectedOptimization] = useState<number | null>(null);
  const [showOptimizationResult, setShowOptimizationResult] = useState(false);
  const [complexityAnswers, setComplexityAnswers] = useState<number[]>([]);
  const [showComplexityResult, setShowComplexityResult] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

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
  }, []);

  // Graph challenges data
  const challenges: Challenge[] = [
    {
      id: 'bfs-basic',
      title: 'BFS Traversal',
      description: 'Learn Breadth-First Search by exploring nodes level by level',
      difficulty: 'Easy',
      algorithm: 'bfs',
      hint: 'BFS uses a queue (FIFO) to visit nodes level by level',
      explanation: 'BFS explores all neighbors at the current depth before moving to nodes at the next depth level.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      initialGraph: {
        nodes: [
          { id: 'A', label: 'A', x: 200, y: 100, visited: false },
          { id: 'B', label: 'B', x: 100, y: 200, visited: false },
          { id: 'C', label: 'C', x: 300, y: 200, visited: false },
          { id: 'D', label: 'D', x: 50, y: 300, visited: false },
          { id: 'E', label: 'E', x: 150, y: 300, visited: false },
          { id: 'F', label: 'F', x: 350, y: 300, visited: false }
        ],
        edges: [
          { source: 'A', target: 'B', weight: 1, visited: false },
          { source: 'A', target: 'C', weight: 1, visited: false },
          { source: 'B', target: 'D', weight: 1, visited: false },
          { source: 'B', target: 'E', weight: 1, visited: false },
          { source: 'C', target: 'F', weight: 1, visited: false }
        ]
      },
      expectedPath: ['A', 'B', 'C', 'D', 'E', 'F'],
      pythonCode: [
        {
          title: 'BFS Implementation',
          code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            result.append(node)
            
            # Add neighbors to queue
            for neighbor in graph[node]:
                if neighbor not in visited:
                    queue.append(neighbor)
    
    return result`,
          explanation: 'BFS uses a queue to maintain the order of exploration. We visit nodes level by level.'
        },
        {
          title: 'BFS with Path Tracking',
          code: `def bfs_with_path(graph, start, target):
    visited = set()
    queue = deque([(start, [start])])
    
    while queue:
        node, path = queue.popleft()
        
        if node == target:
            return path
            
        if node not in visited:
            visited.add(node)
            
            for neighbor in graph[node]:
                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))
    
    return None`,
          explanation: 'This version tracks the path to each node, useful for finding shortest paths in unweighted graphs.'
        }
      ],
      codingChallenge: {
        description: 'Implement BFS to find the shortest path between two nodes',
        template: `def shortest_path_bfs(graph, start, end):
    # Your code here
    pass`,
        solution: `def shortest_path_bfs(graph, start, end):
    from collections import deque
    
    if start == end:
        return [start]
    
    visited = set()
    queue = deque([(start, [start])])
    
    while queue:
        node, path = queue.popleft()
        
        if node in visited:
            continue
            
        visited.add(node)
        
        for neighbor in graph[node]:
            if neighbor == end:
                return path + [neighbor]
            if neighbor not in visited:
                queue.append((neighbor, path + [neighbor]))
    
    return []`,
        testCases: [
          "graph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': []}",
          "print(shortest_path_bfs(graph, 'A', 'D'))  # Expected: ['A', 'B', 'D'] or ['A', 'C', 'D']"
        ]
      }
    },
    {
      id: 'dfs-basic',
      title: 'DFS Traversal',
      description: 'Learn Depth-First Search by exploring as far as possible along each branch',
      difficulty: 'Easy',
      algorithm: 'dfs',
      hint: 'DFS uses a stack (LIFO) to explore deeply before backtracking',
      explanation: 'DFS explores as far as possible along each branch before backtracking.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      initialGraph: {
        nodes: [
          { id: 'A', label: 'A', x: 200, y: 100, visited: false },
          { id: 'B', label: 'B', x: 100, y: 200, visited: false },
          { id: 'C', label: 'C', x: 300, y: 200, visited: false },
          { id: 'D', label: 'D', x: 50, y: 300, visited: false },
          { id: 'E', label: 'E', x: 150, y: 300, visited: false },
          { id: 'F', label: 'F', x: 350, y: 300, visited: false }
        ],
        edges: [
          { source: 'A', target: 'B', weight: 1, visited: false },
          { source: 'A', target: 'C', weight: 1, visited: false },
          { source: 'B', target: 'D', weight: 1, visited: false },
          { source: 'B', target: 'E', weight: 1, visited: false },
          { source: 'C', target: 'F', weight: 1, visited: false }
        ]
      },
      expectedPath: ['A', 'B', 'D', 'E', 'C', 'F'],
      pythonCode: [
        {
          title: 'DFS Recursive Implementation',
          code: `def dfs_recursive(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))
    
    return result`,
          explanation: 'Recursive DFS is intuitive and uses the call stack implicitly.'
        },
        {
          title: 'DFS Iterative Implementation',
          code: `def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            result.append(node)
            
            # Add neighbors to stack (reverse order for consistent traversal)
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result`,
          explanation: 'Iterative DFS uses an explicit stack and avoids recursion depth limits.'
        }
      ],
      codingChallenge: {
        description: 'Implement DFS to detect cycles in a directed graph',
        template: `def has_cycle_dfs(graph):
    # Your code here
    pass`,
        solution: `def has_cycle_dfs(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}
    
    def dfs(node):
        if color[node] == GRAY:
            return True  # Back edge found - cycle detected
        if color[node] == BLACK:
            return False
        
        color[node] = GRAY
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        color[node] = BLACK
        return False
    
    for node in graph:
        if color[node] == WHITE:
            if dfs(node):
                return True
    return False`,
        testCases: [
          "graph = {'A': ['B'], 'B': ['C'], 'C': ['A']}",
          "print(has_cycle_dfs(graph))  # Expected: True"
        ]
      }
    },
    {
      id: 'dijkstra-basic',
      title: 'Dijkstra\'s Algorithm',
      description: 'Find shortest paths in weighted graphs using Dijkstra\'s algorithm',
      difficulty: 'Medium',
      algorithm: 'dijkstra',
      hint: 'Dijkstra uses a priority queue to always process the closest unvisited node',
      explanation: 'Dijkstra\'s algorithm finds shortest paths by maintaining distances and always processing the closest unvisited node.',
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V)',
      initialGraph: {
        nodes: [
          { id: 'A', label: 'A', x: 100, y: 100, visited: false, distance: 0 },
          { id: 'B', label: 'B', x: 250, y: 50, visited: false, distance: Infinity },
          { id: 'C', label: 'C', x: 250, y: 150, visited: false, distance: Infinity },
          { id: 'D', label: 'D', x: 400, y: 50, visited: false, distance: Infinity },
          { id: 'E', label: 'E', x: 400, y: 150, visited: false, distance: Infinity },
          { id: 'F', label: 'F', x: 400, y: 250, visited: false, distance: Infinity }
        ],
        edges: [
          { source: 'A', target: 'B', weight: 4, visited: false },
          { source: 'A', target: 'C', weight: 2, visited: false },
          { source: 'B', target: 'D', weight: 3, visited: false },
          { source: 'B', target: 'E', weight: 1, visited: false },
          { source: 'C', target: 'E', weight: 3, visited: false },
          { source: 'C', target: 'F', weight: 6, visited: false },
          { source: 'D', target: 'F', weight: 2, visited: false },
          { source: 'E', target: 'F', weight: 1, visited: false }
        ]
      },
      expectedPath: ['A', 'C', 'E', 'F'],
      pythonCode: [
        {
          title: 'Dijkstra with Priority Queue',
          code: `import heapq

def dijkstra(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        current_distance, current = heapq.heappop(pq)
        
        if current in visited:
            continue
        
        visited.add(current)
        
        for neighbor, weight in graph[current].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances`,
          explanation: 'Uses a min-heap to efficiently get the next closest unvisited node.'
        },
        {
          title: 'Dijkstra with Path Reconstruction',
          code: `def dijkstra_with_path(graph, start, end):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    previous = {}
    pq = [(0, start)]
    visited = set()
    
    while pq:
        current_distance, current = heapq.heappop(pq)
        
        if current == end:
            break
        
        if current in visited:
            continue
        
        visited.add(current)
        
        for neighbor, weight in graph[current].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current
                heapq.heappush(pq, (distance, neighbor))
    
    # Reconstruct path
    path = []
    current = end
    while current is not None:
        path.append(current)
        current = previous.get(current)
    
    return path[::-1], distances[end]`,
          explanation: 'Tracks previous nodes to reconstruct the shortest path.'
        }
      ],
      codingChallenge: {
        description: 'Implement Dijkstra\'s algorithm to find shortest path',
        template: `def shortest_path_dijkstra(graph, start, end):
    # Your code here
    pass`,
        solution: `def shortest_path_dijkstra(graph, start, end):
    import heapq
    
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    previous = {}
    pq = [(0, start)]
    visited = set()
    
    while pq:
        current_distance, current = heapq.heappop(pq)
        
        if current == end:
            break
        
        if current in visited:
            continue
        
        visited.add(current)
        
        for neighbor, weight in graph[current].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current
                heapq.heappush(pq, (distance, neighbor))
    
    # Reconstruct path
    path = []
    current = end
    while current is not None:
        path.append(current)
        current = previous.get(current)
    
    return path[::-1]`,
        testCases: [
          "graph = {'A': {'B': 4, 'C': 2}, 'B': {'D': 3, 'E': 1}, 'C': {'E': 3, 'F': 6}, 'D': {'F': 2}, 'E': {'F': 1}, 'F': {}}",
          "print(shortest_path_dijkstra(graph, 'A', 'F'))  # Expected: ['A', 'C', 'E', 'F']"
        ]
      }
    },
    {
      id: 'mst-basic',
      title: 'Minimum Spanning Tree',
      description: 'Find the minimum spanning tree using Prim\'s algorithm',
      difficulty: 'Hard',
      algorithm: 'mst',
      hint: 'MST connects all vertices with minimum total weight, no cycles allowed',
      explanation: 'Prim\'s algorithm builds MST by starting from any vertex and always adding the minimum weight edge that connects to a new vertex.',
      timeComplexity: 'O(E log V)',
      spaceComplexity: 'O(V + E)',
      initialGraph: {
        nodes: [
          { id: 'A', label: 'A', x: 150, y: 100, visited: false },
          { id: 'B', label: 'B', x: 300, y: 50, visited: false },
          { id: 'C', label: 'C', x: 400, y: 150, visited: false },
          { id: 'D', label: 'D', x: 300, y: 250, visited: false },
          { id: 'E', label: 'E', x: 150, y: 300, visited: false },
          { id: 'F', label: 'F', x: 50, y: 200, visited: false }
        ],
        edges: [
          { source: 'A', target: 'B', weight: 2, visited: false },
          { source: 'A', target: 'F', weight: 1, visited: false },
          { source: 'B', target: 'C', weight: 3, visited: false },
          { source: 'B', target: 'D', weight: 5, visited: false },
          { source: 'B', target: 'F', weight: 4, visited: false },
          { source: 'C', target: 'D', weight: 2, visited: false },
          { source: 'D', target: 'E', weight: 3, visited: false },
          { source: 'E', target: 'F', weight: 6, visited: false }
        ]
      },
      expectedPath: ['A-F', 'A-B', 'B-C', 'C-D', 'D-E'],
      pythonCode: [
        {
          title: 'Prim\'s Algorithm',
          code: `import heapq

def prim_mst(graph):
    if not graph:
        return []
    
    # Start with arbitrary vertex
    start = next(iter(graph))
    mst = []
    visited = {start}
    
    # Priority queue of edges (weight, from, to)
    edges = []
    for neighbor, weight in graph[start].items():
        heapq.heappush(edges, (weight, start, neighbor))
    
    while edges and len(visited) < len(graph):
        weight, u, v = heapq.heappop(edges)
        
        if v in visited:
            continue
        
        # Add edge to MST
        mst.append((u, v, weight))
        visited.add(v)
        
        # Add new edges from v
        for neighbor, edge_weight in graph[v].items():
            if neighbor not in visited:
                heapq.heappush(edges, (edge_weight, v, neighbor))
    
    return mst`,
          explanation: 'Prim\'s algorithm grows the MST one vertex at a time, always choosing the minimum weight edge.'
        },
        {
          title: 'Kruskal\'s Algorithm',
          code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.parent[py] = px
        else:
            self.parent[py] = px
            self.rank[px] += 1
        return True

def kruskal_mst(edges, n):
    edges.sort()  # Sort by weight
    uf = UnionFind(n)
    mst = []
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            if len(mst) == n - 1:
                break
    
    return mst`,
          explanation: 'Kruskal\'s algorithm sorts all edges and adds them if they don\'t create a cycle.'
        }
      ],
      codingChallenge: {
        description: 'Implement Prim\'s algorithm to find MST',
        template: `def prim_mst(graph):
    # Your code here
    pass`,
        solution: `def prim_mst(graph):
    import heapq
    
    if not graph:
        return []
    
    start = next(iter(graph))
    mst = []
    visited = {start}
    
    edges = []
    for neighbor, weight in graph[start].items():
        heapq.heappush(edges, (weight, start, neighbor))
    
    while edges and len(visited) < len(graph):
        weight, u, v = heapq.heappop(edges)
        
        if v in visited:
            continue
        
        mst.append((u, v, weight))
        visited.add(v)
        
        for neighbor, edge_weight in graph[v].items():
            if neighbor not in visited:
                heapq.heappush(edges, (edge_weight, v, neighbor))
    
    return mst`,
        testCases: [
          "graph = {'A': {'B': 2, 'F': 1}, 'B': {'A': 2, 'C': 3, 'D': 5, 'F': 4}, 'C': {'B': 3, 'D': 2}, 'D': {'B': 5, 'C': 2, 'E': 3}, 'E': {'D': 3, 'F': 6}, 'F': {'A': 1, 'B': 4, 'E': 6}}",
          "mst = prim_mst(graph)",
          "total_weight = sum(edge[2] for edge in mst)",
          "print(f'MST total weight: {total_weight}')  # Expected: 11"
        ]
      }
    }
  ];

  // Quiz questions for each challenge
  const quizQuestions: { [key: string]: MultipleChoiceQuestion[] } = {
    'bfs-basic': [
      {
        question: 'What data structure does BFS use?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
        correctAnswer: 1,
        explanation: 'BFS uses a queue (FIFO) to ensure nodes are visited level by level.'
      },
      {
        question: 'What is the time complexity of BFS?',
        options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
        correctAnswer: 2,
        explanation: 'BFS visits each vertex once (O(V)) and examines each edge once (O(E)), giving O(V + E).'
      }
    ],
    'dfs-basic': [
      {
        question: 'What data structure does DFS use?',
        options: ['Queue', 'Stack', 'Priority Queue', 'Hash Table'],
        correctAnswer: 1,
        explanation: 'DFS uses a stack (LIFO) to explore as deeply as possible before backtracking.'
      },
      {
        question: 'Which DFS application is most common?',
        options: ['Finding shortest paths', 'Cycle detection', 'Level-order traversal', 'Finding minimum weight'],
        correctAnswer: 1,
        explanation: 'DFS is commonly used for cycle detection, topological sorting, and finding connected components.'
      }
    ],
    'dijkstra-basic': [
      {
        question: 'What data structure makes Dijkstra\'s algorithm efficient?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
        correctAnswer: 2,
        explanation: 'Priority queue (min-heap) allows efficient extraction of the vertex with minimum distance.'
      },
      {
        question: 'Can Dijkstra\'s algorithm handle negative edge weights?',
        options: ['Yes, always', 'No, never', 'Only if no negative cycles', 'Only in directed graphs'],
        correctAnswer: 1,
        explanation: 'Dijkstra\'s algorithm cannot handle negative edge weights as it assumes adding edges never decreases path length.'
      }
    ],
    'mst-basic': [
      {
        question: 'What does MST stand for?',
        options: ['Maximum Spanning Tree', 'Minimum Spanning Tree', 'Most Spanning Tree', 'Multiple Spanning Tree'],
        correctAnswer: 1,
        explanation: 'MST stands for Minimum Spanning Tree - a tree that connects all vertices with minimum total edge weight.'
      },
      {
        question: 'How many edges does an MST of n vertices have?',
        options: ['n', 'n-1', 'n+1', '2n'],
        correctAnswer: 1,
        explanation: 'An MST of n vertices always has exactly n-1 edges, which is the minimum needed to connect all vertices.'
      }
    ]
  };

  // Optimization questions
  const optimizationQuestions: { [key: string]: OptimizationQuestion } = {
    'bfs-basic': {
      description: 'Which BFS implementation is more memory efficient?',
      codeSnippets: [
        {
          code: `# Version A
def bfs_a(graph, start):
    visited = []
    queue = [start]
    
    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.append(node)
            queue.extend(graph[node])`,
          isOptimal: false,
          timeComplexity: 'O(V²)',
          spaceComplexity: 'O(V)',
          explanation: 'Using list.pop(0) is O(n) operation, making overall complexity O(V²)'
        },
        {
          code: `# Version B
from collections import deque

def bfs_b(graph, start):
    visited = set()
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            queue.extend(graph[node])`,
          isOptimal: true,
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)',
          explanation: 'Using deque.popleft() is O(1), maintaining optimal O(V + E) complexity'
        }
      ],
      correctAnswer: 1
    },
    'dfs-basic': {
      description: 'Which DFS implementation is better for very deep graphs?',
      codeSnippets: [
        {
          code: `# Recursive DFS
def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)`,
          isOptimal: false,
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V) + call stack',
          explanation: 'Recursive DFS can cause stack overflow for very deep graphs'
        },
        {
          code: `# Iterative DFS
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            stack.extend(graph[node])`,
          isOptimal: true,
          timeComplexity: 'O(V + E)',
          spaceComplexity: 'O(V)',
          explanation: 'Iterative DFS uses explicit stack, avoiding call stack limitations'
        }
      ],
      correctAnswer: 1
    },
    'dijkstra-basic': {
      description: 'Which Dijkstra implementation has better time complexity?',
      codeSnippets: [
        {
          code: `# Linear search for minimum
def dijkstra_linear(graph, start):
    distances = {v: float('inf') for v in graph}
    distances[start] = 0
    visited = set()
    
    while len(visited) < len(graph):
        # Find unvisited node with min distance
        min_node = None
        for node in graph:
            if node not in visited:
                if min_node is None or distances[node] < distances[min_node]:
                    min_node = node
        
        visited.add(min_node)
        # Update neighbors...`,
          isOptimal: false,
          timeComplexity: 'O(V²)',
          spaceComplexity: 'O(V)',
          explanation: 'Linear search for minimum distance node results in O(V²) complexity'
        },
        {
          code: `# Priority queue implementation
import heapq

def dijkstra_heap(graph, start):
    distances = {v: float('inf') for v in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        dist, node = heapq.heappop(pq)
        if node in visited:
            continue
        visited.add(node)
        # Update neighbors...`,
          isOptimal: true,
          timeComplexity: 'O((V + E) log V)',
          spaceComplexity: 'O(V)',
          explanation: 'Priority queue reduces complexity to O((V + E) log V)'
        }
      ],
      correctAnswer: 1
    },
    'mst-basic': {
      description: 'Which MST algorithm is better for dense graphs?',
      codeSnippets: [
        {
          code: `# Prim's with linear search
def prim_linear(graph):
    visited = set()
    mst = []
    
    # Start with arbitrary vertex
    start = next(iter(graph))
    visited.add(start)
    
    while len(visited) < len(graph):
        min_edge = None
        # Linear search for minimum edge
        for u in visited:
            for v, weight in graph[u].items():
                if v not in visited:
                    if min_edge is None or weight < min_edge[2]:
                        min_edge = (u, v, weight)
        
        mst.append(min_edge)
        visited.add(min_edge[1])`,
          isOptimal: true,
          timeComplexity: 'O(V²)',
          spaceComplexity: 'O(V)',
          explanation: 'For dense graphs (E ≈ V²), O(V²) is optimal'
        },
        {
          code: `# Prim's with priority queue
import heapq

def prim_heap(graph):
    visited = set()
    mst = []
    start = next(iter(graph))
    visited.add(start)
    
    edges = []
    for neighbor, weight in graph[start].items():
        heapq.heappush(edges, (weight, start, neighbor))
    
    while edges and len(visited) < len(graph):
        weight, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        # Add to MST...`,
          isOptimal: false,
          timeComplexity: 'O(E log V)',
          spaceComplexity: 'O(E)',
          explanation: 'For dense graphs, O(E log V) ≈ O(V² log V) is worse than O(V²)'
        }
      ],
      correctAnswer: 0
    }
  };

  // Complexity matching questions
  const complexityQuestions: { [key: string]: ComplexityMatchingQuestion } = {
    'bfs-basic': {
      description: 'Match the graph operations with their time complexities:',
      operations: [
        'BFS traversal',
        'Finding shortest path (unweighted)',
        'Checking if graph is bipartite',
        'Finding connected components'
      ],
      complexities: [
        'O(V + E)',
        'O(V + E)',
        'O(V + E)',
        'O(V + E)'
      ],
      correctMatches: {0: 0, 1: 1, 2: 2, 3: 3},
      explanation: 'All BFS-based operations visit each vertex and edge once, resulting in O(V + E) complexity.'
    },
    'dfs-basic': {
      description: 'Match DFS applications with their time complexities:',
      operations: [
        'DFS traversal',
        'Cycle detection',
        'Topological sorting',
        'Finding strongly connected components'
      ],
      complexities: [
        'O(V + E)',
        'O(V + E)',
        'O(V + E)',
        'O(V + E)'
      ],
      correctMatches: {0: 0, 1: 1, 2: 2, 3: 3},
      explanation: 'All DFS-based operations visit each vertex and edge once, resulting in O(V + E) complexity.'
    },
    'dijkstra-basic': {
      description: 'Match Dijkstra operations with their complexities:',
      operations: [
        'Dijkstra with binary heap',
        'Dijkstra with Fibonacci heap',
        'Dijkstra with linear search',
        'Single-source shortest paths (weighted)'
      ],
      complexities: [
        'O((V + E) log V)',
        'O(V log V + E)',
        'O(V²)',
        'O((V + E) log V)'
      ],
      correctMatches: {0: 0, 1: 1, 2: 2, 3: 0},
      explanation: 'Different implementations of Dijkstra have different complexities based on the data structure used for the priority queue.'
    },
    'mst-basic': {
      description: 'Match MST algorithms with their complexities:',
      operations: [
        'Prim\'s with binary heap',
        'Kruskal\'s algorithm',
        'Prim\'s with linear search',
        'Borůvka\'s algorithm'
      ],
      complexities: [
        'O(E log V)',
        'O(E log E)',
        'O(V²)',
        'O(E log V)'
      ],
      correctMatches: {0: 0, 1: 1, 2: 2, 3: 0},
      explanation: 'MST algorithms have different complexities: Prim\'s depends on priority queue implementation, Kruskal\'s on edge sorting.'
    }
  };

  // BFS Algorithm implementation
  const runBFS = useCallback((graph: Graph, startNodeId: string) => {
    const steps: AlgorithmStep[] = [];
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];
    const visitedNodes: string[] = [];
    const visitedEdges: string[] = [];

    // Initial step
    steps.push({
      description: `Starting BFS from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [],
      visitedEdges: [],
      queue: [startNodeId]
    });

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        visitedNodes.push(currentNode);

        steps.push({
          description: `Visiting node ${currentNode}`,
          currentNode,
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          queue: [...queue]
        });

        // Find neighbors
        const neighbors = graph.edges
          .filter(edge => edge.source === currentNode || edge.target === currentNode)
          .map(edge => edge.source === currentNode ? edge.target : edge.source)
          .filter(neighbor => !visited.has(neighbor));

        // Add neighbors to queue
        for (const neighbor of neighbors) {
          if (!queue.includes(neighbor)) {
            queue.push(neighbor);
            const edgeId = graph.edges.find(edge => 
              (edge.source === currentNode && edge.target === neighbor) ||
              (edge.source === neighbor && edge.target === currentNode)
            );
            if (edgeId) {
              visitedEdges.push(`${currentNode}-${neighbor}`);
            }
          }
        }

        if (neighbors.length > 0) {
          steps.push({
            description: `Added neighbors ${neighbors.join(', ')} to queue`,
            currentNode,
            visitedNodes: [...visitedNodes],
            visitedEdges: [...visitedEdges],
            queue: [...queue]
          });
        }
      }
    }

    steps.push({
      description: 'BFS traversal complete!',
      currentNode: undefined,
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      queue: []
    });

    return steps;
  }, []);

  // DFS Algorithm implementation
  const runDFS = useCallback((graph: Graph, startNodeId: string) => {
    const steps: AlgorithmStep[] = [];
    const visited = new Set<string>();
    const stack: string[] = [startNodeId];
    const visitedNodes: string[] = [];
    const visitedEdges: string[] = [];

    // Initial step
    steps.push({
      description: `Starting DFS from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [],
      visitedEdges: [],
      stack: [startNodeId]
    });

    while (stack.length > 0) {
      const currentNode = stack.pop()!;
      
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
        visitedNodes.push(currentNode);

        steps.push({
          description: `Visiting node ${currentNode}`,
          currentNode,
          visitedNodes: [...visitedNodes],
          visitedEdges: [...visitedEdges],
          stack: [...stack]
        });

        // Find neighbors and add to stack (in reverse order for consistent traversal)
        const neighbors = graph.edges
          .filter(edge => edge.source === currentNode || edge.target === currentNode)
          .map(edge => edge.source === currentNode ? edge.target : edge.source)
          .filter(neighbor => !visited.has(neighbor))
          .reverse(); // Reverse to maintain left-to-right traversal order

        // Add neighbors to stack
        for (const neighbor of neighbors) {
          if (!stack.includes(neighbor)) {
            stack.push(neighbor);
            const edgeId = graph.edges.find(edge => 
              (edge.source === currentNode && edge.target === neighbor) ||
              (edge.source === neighbor && edge.target === currentNode)
            );
            if (edgeId) {
              visitedEdges.push(`${currentNode}-${neighbor}`);
            }
          }
        }

        if (neighbors.length > 0) {
          steps.push({
            description: `Added neighbors ${neighbors.join(', ')} to stack`,
            currentNode,
            visitedNodes: [...visitedNodes],
            visitedEdges: [...visitedEdges],
            stack: [...stack]
          });
        }
      }
    }

    steps.push({
      description: 'DFS traversal complete!',
      currentNode: undefined,
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      stack: []
    });

    return steps;
  }, []);

  // Dijkstra Algorithm implementation
  const runDijkstra = useCallback((graph: Graph, startNodeId: string) => {
    const steps: AlgorithmStep[] = [];
    const distances: Record<string, number> = {};
    const visited = new Set<string>();
    const visitedNodes: string[] = [];
    const visitedEdges: string[] = [];

    // Initialize distances
    graph.nodes.forEach(node => {
      distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    });

    steps.push({
      description: `Starting Dijkstra from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [],
      visitedEdges: [],
      distances: {...distances}
    });

    while (visited.size < graph.nodes.length) {
      // Find unvisited node with minimum distance
      let minNode = '';
      let minDistance = Infinity;
      
      for (const node of graph.nodes) {
        if (!visited.has(node.id) && distances[node.id] < minDistance) {
          minDistance = distances[node.id];
          minNode = node.id;
        }
      }

      if (minNode === '' || minDistance === Infinity) break;

      visited.add(minNode);
      visitedNodes.push(minNode);

      steps.push({
        description: `Processing node ${minNode} with distance ${distances[minNode]}`,
        currentNode: minNode,
        visitedNodes: [...visitedNodes],
        visitedEdges: [...visitedEdges],
        distances: {...distances}
      });

      // Update distances to neighbors
      const edges = graph.edges.filter(edge => 
        edge.source === minNode || edge.target === minNode
      );

      for (const edge of edges) {
        const neighbor = edge.source === minNode ? edge.target : edge.source;
        
        if (!visited.has(neighbor)) {
          const newDistance = distances[minNode] + edge.weight;
          
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            visitedEdges.push(`${minNode}-${neighbor}`);
            
            steps.push({
              description: `Updated distance to ${neighbor}: ${newDistance}`,
              currentNode: minNode,
              visitedNodes: [...visitedNodes],
              visitedEdges: [...visitedEdges],
              distances: {...distances}
            });
          }
        }
      }
    }

    steps.push({
      description: 'Dijkstra algorithm complete!',
      currentNode: undefined,
      visitedNodes: [...visitedNodes],
      visitedEdges: [...visitedEdges],
      distances: {...distances}
    });

    return steps;
  }, []);

  // MST Algorithm implementation (Prim's)
  const runMST = useCallback((graph: Graph, startNodeId: string) => {
    const steps: AlgorithmStep[] = [];
    const visited = new Set<string>([startNodeId]);
    const mstEdges: string[] = [];
    const visitedNodes: string[] = [startNodeId];

    steps.push({
      description: `Starting MST from node ${startNodeId}`,
      currentNode: startNodeId,
      visitedNodes: [startNodeId],
      visitedEdges: []
    });

    while (visited.size < graph.nodes.length) {
      let minEdge: { source: string; target: string; weight: number } | null = null;
      let minWeight = Infinity;

      // Find minimum weight edge from visited to unvisited nodes
      for (const edge of graph.edges) {
        const sourceVisited = visited.has(edge.source);
        const targetVisited = visited.has(edge.target);

        // Edge connects visited and unvisited node
        if ((sourceVisited && !targetVisited) || (!sourceVisited && targetVisited)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }

      if (!minEdge) break;

      // Add edge to MST
      const newNode = visited.has(minEdge.source) ? minEdge.target : minEdge.source;
      visited.add(newNode);
      visitedNodes.push(newNode);
      mstEdges.push(`${minEdge.source}-${minEdge.target}`);

      steps.push({
        description: `Added edge ${minEdge.source}-${minEdge.target} (weight: ${minEdge.weight}) to MST`,
        currentNode: newNode,
        visitedNodes: [...visitedNodes],
        visitedEdges: [...mstEdges]
      });
    }

    const totalWeight = graph.edges
      .filter(edge => mstEdges.includes(`${edge.source}-${edge.target}`) || 
                     mstEdges.includes(`${edge.target}-${edge.source}`))
      .reduce((sum, edge) => sum + edge.weight, 0);

    steps.push({
      description: `MST complete! Total weight: ${totalWeight}`,
      currentNode: undefined,
      visitedNodes: [...visitedNodes],
      visitedEdges: [...mstEdges]
    });

    return steps;
  }, []);

  // Canvas drawing functions
  const drawGraph = useCallback((canvas: HTMLCanvasElement, graph: Graph, step?: AlgorithmStep) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        
        // Highlight visited edges
        if (step?.visitedEdges.includes(`${edge.source}-${edge.target}`) || 
            step?.visitedEdges.includes(`${edge.target}-${edge.source}`)) {
          ctx.strokeStyle = isDarkMode ? '#60A5FA' : '#3B82F6';
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = isDarkMode ? '#6B7280' : '#9CA3AF';
          ctx.lineWidth = 2;
        }
        
        ctx.stroke();

        // Draw weight
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        ctx.fillStyle = isDarkMode ? '#F3F4F6' : '#1F2937';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight.toString(), midX, midY - 5);
      }
    });

    // Draw nodes
    graph.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      // Node coloring based on state
      if (step?.currentNode === node.id) {
        ctx.fillStyle = isDarkMode ? '#F59E0B' : '#F59E0B'; // Current node - amber
      } else if (step?.visitedNodes.includes(node.id)) {
        ctx.fillStyle = isDarkMode ? '#10B981' : '#059669'; // Visited - green
      } else if (step?.queue?.includes(node.id)) {
        ctx.fillStyle = isDarkMode ? '#8B5CF6' : '#7C3AED'; // In queue - purple
      } else {
        ctx.fillStyle = isDarkMode ? '#374151' : '#E5E7EB'; // Unvisited - gray
      }
      
      ctx.fill();
      ctx.strokeStyle = isDarkMode ? '#6B7280' : '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = isDarkMode ? '#F3F4F6' : '#1F2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 5);

      // Draw distance if available (for Dijkstra's algorithm)
      if (step?.distances && step.distances[node.id] !== undefined && step.distances[node.id] !== Infinity) {
        ctx.fillStyle = isDarkMode ? '#F59E0B' : '#D97706';
        ctx.font = '10px Arial';
        ctx.fillText(`d:${step.distances[node.id]}`, node.x, node.y - 35);
      } else if (node.distance !== undefined && node.distance !== Infinity) {
        ctx.fillStyle = isDarkMode ? '#F59E0B' : '#D97706';
        ctx.font = '10px Arial';
        ctx.fillText(`d:${node.distance}`, node.x, node.y - 35);
      }
    });
  }, [isDarkMode]);

  // Animation control
  useEffect(() => {
    if (isPlaying && algorithmSteps.length > 0) {
      const timer = setTimeout(() => {
        if (currentStep < algorithmSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, algorithmSteps.length, playbackSpeed]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && selectedChallenge) {
      canvas.width = 500;
      canvas.height = 400;
      
      const currentAlgorithmStep = algorithmSteps[currentStep];
      drawGraph(canvas, selectedChallenge.initialGraph, currentAlgorithmStep);
    }
  }, [selectedChallenge, currentStep, algorithmSteps, drawGraph]);

  // Event handlers
  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentStep(0);
    setUserPath([]);
    setShowHint(false);
    setAttempts(0);
    setShowCode(false);
    setShowQuiz(false);
    setUserCode(challenge.codingChallenge?.template || '');
    setCodeOutput('');
    
    // Generate algorithm steps
    const startNode = challenge.initialGraph.nodes[0].id;
    switch (challenge.algorithm) {
      case 'bfs':
        const bfsSteps = runBFS(challenge.initialGraph, startNode);
        setAlgorithmSteps(bfsSteps);
        break;
      case 'dfs':
        const dfsSteps = runDFS(challenge.initialGraph, startNode);
        setAlgorithmSteps(dfsSteps);
        break;
      case 'dijkstra':
        const dijkstraSteps = runDijkstra(challenge.initialGraph, startNode);
        setAlgorithmSteps(dijkstraSteps);
        break;
      case 'mst':
        const mstSteps = runMST(challenge.initialGraph, startNode);
        setAlgorithmSteps(mstSteps);
        break;
      default:
        setAlgorithmSteps([]);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setUserPath([]);
  };

  const handleRunCode = async () => {
    setIsRunningCode(true);
    // Simulate code execution
    setTimeout(() => {
      setCodeOutput('Code executed successfully!\nOutput: [\'A\', \'B\', \'C\', \'D\', \'E\', \'F\']');
      setIsRunningCode(false);
    }, 1000);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (!selectedChallenge) return;
    
    const questions = quizQuestions[selectedChallenge.id] || [];
    let correct = 0;
    
    questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    setQuizScore(correct);
    setShowQuizResults(true);
  };

  const handleOptimizationSelect = (index: number) => {
    setSelectedOptimization(index);
    setShowOptimizationResult(true);
  };

  const handleComplexityMatch = (operationIndex: number, complexityIndex: number) => {
    const newAnswers = [...complexityAnswers];
    newAnswers[operationIndex] = complexityIndex;
    setComplexityAnswers(newAnswers);
  };

  const handleSubmitComplexity = () => {
    setShowComplexityResult(true);
  };

  if (!selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        {/* Header */}
        <header className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/games" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Games
              </Link>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Graph Foundational Explorer
              </h1>
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Graph Algorithm Explorer
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Master graph algorithms through interactive visualizations and hands-on coding challenges!
            </p>
          </div>

          {/* Challenge Selection */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => handleChallengeSelect(challenge)}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 cursor-pointer transform hover:scale-105 transition-all border border-white/20 dark:border-gray-700/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {challenge.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    challenge.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : challenge.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {challenge.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Algorithm: {challenge.algorithm.toUpperCase()}</span>
                  <span>{challenge.timeComplexity}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Challenges
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedChallenge.title}
            </h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedChallenge.difficulty === 'Easy' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : selectedChallenge.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {selectedChallenge.difficulty}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Visualization */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Algorithm Visualization
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleStepBackward}
                  disabled={currentStep === 0}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  ⏮
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  onClick={handleStepForward}
                  disabled={currentStep === algorithmSteps.length - 1}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  ⏭
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex justify-center mb-4">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>

            {/* Algorithm Step Description */}
            {algorithmSteps[currentStep] && (
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  Step {currentStep + 1}: {algorithmSteps[currentStep].description}
                </p>
                {algorithmSteps[currentStep].queue && algorithmSteps[currentStep].queue!.length > 0 && (
                  <p className="text-blue-600 dark:text-blue-300 text-sm mt-2">
                    Queue: [{algorithmSteps[currentStep].queue!.join(', ')}]
                  </p>
                )}
                {algorithmSteps[currentStep].stack && algorithmSteps[currentStep].stack!.length > 0 && (
                  <p className="text-purple-600 dark:text-purple-300 text-sm mt-2">
                    Stack: [{algorithmSteps[currentStep].stack!.join(', ')}]
                  </p>
                )}
                {algorithmSteps[currentStep].distances && (
                  <p className="text-green-600 dark:text-green-300 text-sm mt-2">
                    Distances: {Object.entries(algorithmSteps[currentStep].distances!)
                      .filter(([_, dist]) => dist !== Infinity)
                      .map(([node, dist]) => `${node}:${dist}`)
                      .join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Speed Control */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Animation Speed
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Information and Code */}
          <div className="space-y-6">
            {/* Challenge Info */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Challenge Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedChallenge.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Time Complexity:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">{selectedChallenge.timeComplexity}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Space Complexity:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400">{selectedChallenge.spaceComplexity}</span>
                </div>
              </div>

              {showHint && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    💡 Hint: {selectedChallenge.hint}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowHint(!showHint)}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>

            {/* Tabs for different content */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
              <div className="flex border-b border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowCode(false)}
                  className={`px-6 py-3 font-medium ${!showCode 
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'}`}
                >
                  Algorithm
                </button>
                <button
                  onClick={() => setShowCode(true)}
                  className={`px-6 py-3 font-medium ${showCode 
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'}`}
                >
                  Code
                </button>
              </div>

              <div className="p-6">
                {!showCode ? (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Algorithm Explanation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedChallenge.explanation}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex space-x-2 mb-4">
                      {selectedChallenge.pythonCode.map((code, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCodeTab(index)}
                          className={`px-4 py-2 text-sm rounded-lg ${
                            selectedCodeTab === index
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {code.title}
                        </button>
                      ))}
                    </div>

                    <div className="mb-4">
                      <SyntaxHighlighter
                        language="python"
                        style={isDarkMode ? vscDarkPlus : vs}
                        className="rounded-lg"
                      >
                        {selectedChallenge.pythonCode[selectedCodeTab].code}
                      </SyntaxHighlighter>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {selectedChallenge.pythonCode[selectedCodeTab].explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GraphFoundationalGame;

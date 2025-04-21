"use client";

import { useState, useEffect } from 'react';
import { addXP } from '../utils/storage';

// Different visualization types
export type VisualizationType = 
  | 'array-sort'
  | 'binary-search' 
  | 'graph-traversal'
  | 'linked-list'
  | 'tree-traversal'
  | 'dynamic-programming'
  | 'greedy-algorithm'
  | 'bit-manipulation'
  | 'bit-manipulation-advanced';

interface AlgorithmVisualizerProps {
  type: VisualizationType;
  initialData?: any;
  onComplete?: () => void;
  onStepChange?: (step: number, metadata?: {
    stepName?: string;
    lineHighlights?: {[key: number]: boolean};
  }) => void;
  interactive?: boolean;
  speed?: 'slow' | 'medium' | 'fast';
}

// Speed mappings in milliseconds
const SPEED_MAP = {
  slow: 1000,
  medium: 500,
  fast: 200
};

export default function AlgorithmVisualizer({
  type,
  initialData,
  onComplete,
  onStepChange,
  interactive = true,
  speed = 'medium'
}: AlgorithmVisualizerProps) {
  // Common state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [visualData, setVisualData] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [gameScore, setGameScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Initialize visualization based on type
  useEffect(() => {
    console.log("Initializing visualization for type:", type);
    let data;
    switch (type) {
      case 'array-sort':
        data = initArraySort(initialData);
        break;
      case 'binary-search':
        data = initBinarySearch(initialData);
        break;
      case 'graph-traversal':
        data = initGraphTraversal(initialData);
        break;
      case 'linked-list':
        data = initLinkedList(initialData);
        break;
      case 'tree-traversal':
        data = initTreeTraversal(initialData);
        break;
      case 'dynamic-programming':
        data = initDynamicProgramming(initialData);
        break;
      case 'greedy-algorithm':
        data = initGreedyAlgorithm(initialData);
        break;
      case 'bit-manipulation':
        data = initBitManipulation(initialData);
        break;
      case 'bit-manipulation-advanced':
        data = initBitManipulationAdvanced(initialData);
        break;
    }
    setVisualData(data);
    console.log("Visualization initialized, steps count:", steps.length);
  }, [type, initialData]);
  
  // Update message when currentStep changes
  useEffect(() => {
    try {
      if (steps.length > 0) {
        const step = steps[currentStep] || steps[0];
        setMessage(step?.message || '');
        
        // Call the onStepChange callback with metadata if provided
        if (onStepChange) {
          try {
            // Create metadata object based on current step and algorithm type
            const metadata: {
              stepName?: string;
              lineHighlights?: {[key: number]: boolean};
            } = {};
            
            // Set step name based on the current step message
            if (step?.message) {
              metadata.stepName = getStepNameFromMessage(step.message);
            }
            
            // Set line highlights based on the current step and algorithm type
            metadata.lineHighlights = getLineHighlightsForStep(step, type);
            
            onStepChange(currentStep, metadata);
          } catch (error) {
            console.error("Error processing step metadata:", error);
            // Provide minimal metadata to avoid breaking the UI
            onStepChange(currentStep, { stepName: "Algorithm Step", lineHighlights: {} });
          }
        }
      }
    } catch (error) {
      console.error("Error in step processing:", error);
    }
  }, [currentStep, steps, onStepChange, type]);
  
  // Handle auto-play functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Debug the current state
    console.log("Auto-play effect: isPlaying=", isPlaying, "isPaused=", isPaused, "currentStep=", currentStep, "stepsLength=", steps.length);
    
    if (isPlaying && !isPaused && currentStep < steps.length - 1) {
      console.log("Setting timeout for next step");
      timer = setTimeout(() => {
        console.log("Advancing to next step");
        setCurrentStep(prev => prev + 1);
      }, SPEED_MAP[speed]);
    } else if (currentStep >= steps.length - 1 && steps.length > 0) {
      // Visualization completed
      console.log("Visualization completed");
      setIsPlaying(false);
      
      if (!gameCompleted && onComplete) {
        setGameCompleted(true);
        // Add XP when game completes
        addXP(25);
        onComplete();
      }
    }
    
    return () => {
      if (timer) {
        console.log("Clearing timeout");
        clearTimeout(timer);
      }
    };
  }, [isPlaying, isPaused, currentStep, steps, speed, gameCompleted, onComplete]);
  
  // Play/pause control
  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
    
    // Log for debugging
    console.log("Toggle play: isPlaying=", !isPlaying, "isPaused=", isPlaying ? !isPaused : false);
  };
  
  // Step forward manually
  const stepForward = () => {
    // Prevent manual step if auto-playing
    if (isPlaying && !isPaused) {
      console.warn("Attempted manual stepForward while auto-playing.");
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Step backward manually
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Reset to beginning
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
    setGameScore(0);
    setGameCompleted(false);
  };
  
  // Initialization functions for different visualizations
  function initArraySort(data: number[] = [38, 27, 43, 3, 9, 82, 10]) {
    // Setup for quicksort visualization
    const array = [...data];
    const allSteps = [];
    
    // Generate steps for quick sort
    function quickSort(arr: number[], low: number, high: number, steps: any[] = [], depth: number = 0) {
      steps.push({ 
        array: [...arr], 
        low, 
        high, 
        pivot: null,
        iteration: depth,
        message: `Starting quicksort with low=${low}, high=${high}`,
        timeComplexity: "O(n log n) average, O(n²) worst case",
        spaceComplexity: "O(log n)"
      });
      
      if (low < high) {
        // Partition the array and get the pivot index
        const pivotIndex = partition(arr, low, high, steps, depth);
        
        // Recursively sort elements before and after the pivot
        quickSort(arr, low, pivotIndex - 1, steps, depth + 1);
        quickSort(arr, pivotIndex + 1, high, steps, depth + 1);
      }
      
      return steps;
    }
    
    function partition(arr: number[], low: number, high: number, steps: any[], depth: number) {
      const pivot = arr[high];
      steps.push({ 
        array: [...arr], 
        low, 
        high, 
        pivot: high,
        iteration: depth,
        message: `Choosing pivot: ${pivot}`,
        timeComplexity: "O(n log n) average, O(n²) worst case",
        spaceComplexity: "O(log n)"
      });
      
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        steps.push({ 
          array: [...arr], 
          low, 
          high, 
          pivot: high, 
          comparing: j,
          iteration: depth,
          currentIndex: j,
          message: `Comparing ${arr[j]} with pivot ${pivot} (iteration ${j-low+1})`,
          timeComplexity: "O(n log n) average, O(n²) worst case",
          spaceComplexity: "O(log n)"
        });
        
        if (arr[j] <= pivot) {
          i++;
          // Swap arr[i] and arr[j]
          [arr[i], arr[j]] = [arr[j], arr[i]];
          
          if (i !== j) {
            steps.push({ 
              array: [...arr], 
              low, 
              high, 
              pivot: high, 
              swapped: [i, j],
              iteration: depth,
              currentIndex: j,
              message: `Swapped ${arr[i]} and ${arr[j]} (iteration ${j-low+1})`,
              timeComplexity: "O(n log n) average, O(n²) worst case",
              spaceComplexity: "O(log n)"
            });
          }
        }
      }
      
      // Swap arr[i+1] and arr[high] (pivot)
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({ 
        array: [...arr], 
        low, 
        high, 
        pivot: i + 1, 
        swapped: [i + 1, high],
        iteration: depth,
        message: `Placed pivot ${pivot} at position ${i + 1}`,
        timeComplexity: "O(n log n) average, O(n²) worst case",
        spaceComplexity: "O(log n)"
      });
      
      return i + 1;
    }
    
    // Generate all steps for the sorting algorithm
    const sortingSteps = quickSort(array, 0, array.length - 1);
    
    // Add a final step showing the sorted array
    sortingSteps.push({ 
      array: [...array], 
      message: "Array is now sorted!",
      completed: true,
      timeComplexity: "O(n log n) average, O(n²) worst case",
      spaceComplexity: "O(log n)"
    });
    
    setSteps(sortingSteps);
    return { 
      array: data,
      type: 'quicksort'
    };
  }
  
  function initBinarySearch(data: any = { 
    array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 
    target: 23 
  }) {
    // Setup for binary search visualization
    const { array, target } = data;
    const steps = [];
    
    let left = 0;
    let right = array.length - 1;
    let found = false;
    let iteration = 0;
    
    steps.push({
      array,
      left,
      right,
      mid: null,
      iteration: iteration,
      message: `Starting binary search for target ${target}`,
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)"
    });
    
    while (left <= right) {
      iteration++;
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        array,
        left,
        right,
        mid,
        iteration: iteration,
        message: `Iteration ${iteration}: Checking middle element at index ${mid}: ${array[mid]}`,
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      });
      
      if (array[mid] === target) {
        steps.push({
          array,
          left,
          right,
          mid,
          found: true,
          iteration: iteration,
          message: `Iteration ${iteration}: Found target ${target} at index ${mid}!`,
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)"
        });
        found = true;
        break;
      } else if (array[mid] < target) {
        steps.push({
          array,
          left,
          right,
          mid,
          iteration: iteration,
          message: `Iteration ${iteration}: ${array[mid]} < ${target}, search right half`,
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)"
        });
        left = mid + 1;
      } else {
        steps.push({
          array,
          left,
          right,
          mid,
          iteration: iteration,
          message: `Iteration ${iteration}: ${array[mid]} > ${target}, search left half`,
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)"
        });
        right = mid - 1;
      }
    }
    
    if (!found) {
      steps.push({
        array,
        left,
        right,
        iteration: iteration,
        message: `Iteration ${iteration}: Target ${target} not found in the array`,
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)"
      });
    }
    
    setSteps(steps);
    return {
      array,
      target,
      type: 'binary-search'
    };
  }
  
  function initGraphTraversal(data: any = null) {
    // Default graph if none provided
    if (!data) {
      data = {
        nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [
          ['A', 'B'], ['A', 'C'], 
          ['B', 'D'], ['B', 'E'], 
          ['C', 'F'], ['E', 'F']
        ],
        startNode: 'A'
      };
    }
    
    const { nodes, edges, startNode } = data;
    
    // Create adjacency list
    const adjacencyList = new Map();
    nodes.forEach((node: string) => {
      adjacencyList.set(node, []);
    });
    
    edges.forEach(([from, to]: [string, string]) => {
      adjacencyList.get(from).push(to);
      // For undirected graph
      adjacencyList.get(to).push(from);
    });
    
    // BFS traversal steps
    const visited = new Set();
    const queue = [startNode];
    visited.add(startNode);
    
    const steps = [];
    let iteration = 0;
    
    steps.push({
      queue: [...queue],
      visited: new Set(visited),
      current: null,
      iteration: iteration,
      message: `Starting BFS from node ${startNode}`,
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)"
    });
    
    while (queue.length > 0) {
      iteration++;
      const current = queue.shift();
      
      steps.push({
        queue: [...queue],
        visited: new Set(visited),
        current,
        iteration: iteration,
        message: `Iteration ${iteration}: Visiting node ${current}`,
        timeComplexity: "O(V + E)",
        spaceComplexity: "O(V)"
      });
      
      const neighbors = adjacencyList.get(current);
      let neighborCount = 0;
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          neighborCount++;
          visited.add(neighbor);
          queue.push(neighbor);
          
          steps.push({
            queue: [...queue],
            visited: new Set(visited),
            current,
            edge: [current, neighbor],
            iteration: iteration,
            message: `Iteration ${iteration}: Added neighbor ${neighbor} to queue (neighbor ${neighborCount} of ${neighbors.length})`,
            timeComplexity: "O(V + E)",
            spaceComplexity: "O(V)"
          });
        }
      }
    }
    
    steps.push({
      queue: [],
      visited: new Set(visited),
      iteration: iteration,
      message: `BFS traversal complete. Visited all reachable nodes.`,
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)"
    });
    
    setSteps(steps);
    return {
      nodes,
      edges,
      startNode,
      type: 'bfs'
    };
  }
  
  function initLinkedList(data: any = { operations: ['insert_tail', 'insert_head', 'delete', 'search'] }) {
    // Interactive linked list operations
    const { operations } = data;
    const steps = [];
    
    // Initial empty linked list
    let list: number[] = [];
    let iteration = 0;
    
    steps.push({
      list: [...list],
      iteration: iteration,
      message: "Starting with an empty linked list",
      timeComplexity: "N/A",
      spaceComplexity: "O(1)"
    });
    
    if (operations.includes('insert_tail')) {
      // Insert at tail
      iteration++;
      list.push(10);
      steps.push({
        list: [...list],
        operation: 'insert_tail',
        target: 10,
        iteration: iteration,
        message: `Iteration ${iteration}: Inserted 10 at the tail`,
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)"
      });
      
      iteration++;
      list.push(20);
      steps.push({
        list: [...list],
        operation: 'insert_tail',
        target: 20,
        iteration: iteration,
        message: `Iteration ${iteration}: Inserted 20 at the tail`,
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)"
      });
    }
    
    if (operations.includes('insert_head')) {
      // Insert at head
      iteration++;
      list.unshift(5);
      steps.push({
        list: [...list],
        operation: 'insert_head',
        target: 5,
        iteration: iteration,
        message: `Iteration ${iteration}: Inserted 5 at the head`,
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)"
      });
    }
    
    if (operations.includes('search')) {
      // Search for element
      iteration++;
      const target = 20;
      const index = list.indexOf(target);
      
      steps.push({
        list: [...list],
        operation: 'search',
        target,
        searching: true,
        iteration: iteration,
        message: `Iteration ${iteration}: Searching for element ${target}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      });
      
      iteration++;
      if (index !== -1) {
        steps.push({
          list: [...list],
          operation: 'search',
          target,
          found: index,
          iteration: iteration,
          message: `Iteration ${iteration}: Found ${target} at position ${index}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)"
        });
      } else {
        steps.push({
          list: [...list],
          operation: 'search',
          target,
          iteration: iteration,
          message: `Iteration ${iteration}: Element ${target} not found in the list`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)"
        });
      }
    }
    
    if (operations.includes('delete')) {
      // Delete element
      iteration++;
      const target = 10;
      const index = list.indexOf(target);
      
      steps.push({
        list: [...list],
        operation: 'delete',
        target,
        iteration: iteration,
        message: `Iteration ${iteration}: Deleting element ${target}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      });
      
      iteration++;
      if (index !== -1) {
        list.splice(index, 1);
        steps.push({
          list: [...list],
          operation: 'delete',
          iteration: iteration,
          message: `Iteration ${iteration}: Deleted element ${target}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)"
        });
      } else {
        steps.push({
          list: [...list],
          operation: 'delete',
          iteration: iteration,
          message: `Iteration ${iteration}: Element ${target} not found, nothing to delete`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)"
        });
      }
    }
    
    iteration++;
    steps.push({
      list: [...list],
      iteration: iteration,
      message: "All operations completed",
      timeComplexity: "Varies by operation",
      spaceComplexity: "O(1)"
    });
    
    setSteps(steps);
    return {
      operations,
      type: 'linked-list'
    };
  }
  
  function initTreeTraversal(data: any = null) {
    // Default binary tree
    if (!data) {
      data = {
        tree: {
          value: 10,
          left: {
            value: 5,
            left: { value: 3, left: null, right: null },
            right: { value: 7, left: null, right: null }
          },
          right: {
            value: 15,
            left: { value: 12, left: null, right: null },
            right: { value: 20, left: null, right: null }
          }
        },
        traversalType: 'inorder' // 'preorder', 'inorder', 'postorder'
      };
    }
    
    const { tree, traversalType } = data;
    const steps = [];
    const traversal: number[] = [];
    let nodeVisitCount = 0;
    
    steps.push({
      tree,
      current: null,
      traversal: [],
      iteration: 0,
      message: `Starting ${traversalType} traversal`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(h) where h is height"
    });
    
    // Recursive traversal functions
    function inorderTraversal(node: any, path: string[] = []) {
      if (!node) return;
      
      // Visit left subtree
      if (node.left) {
        steps.push({
          tree,
          current: node,
          visiting: 'left',
          traversal: [...traversal],
          path: [...path, 'left'],
          iteration: ++nodeVisitCount,
          message: `Iteration ${nodeVisitCount}: Moving to left child of ${node.value}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(h) where h is height"
        });
        inorderTraversal(node.left, [...path, 'left']);
      }
      
      // Visit current node
      traversal.push(node.value);
      steps.push({
        tree,
        current: node,
        traversal: [...traversal],
        path,
        iteration: ++nodeVisitCount,
        message: `Iteration ${nodeVisitCount}: Visited node ${node.value}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) where h is height"
      });
      
      // Visit right subtree
      if (node.right) {
        steps.push({
          tree,
          current: node,
          visiting: 'right',
          traversal: [...traversal],
          path: [...path, 'right'],
          iteration: ++nodeVisitCount,
          message: `Iteration ${nodeVisitCount}: Moving to right child of ${node.value}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(h) where h is height"
        });
        inorderTraversal(node.right, [...path, 'right']);
      }
    }
    
    function preorderTraversal(node: any, path: string[] = []) {
      if (!node) return;
      
      // Visit current node first
      traversal.push(node.value);
      steps.push({
        tree,
        current: node,
        traversal: [...traversal],
        path,
        iteration: ++nodeVisitCount,
        message: `Iteration ${nodeVisitCount}: Visited node ${node.value}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) where h is height"
      });
      
      // Visit left subtree
      if (node.left) {
        steps.push({
          tree,
          current: node,
          visiting: 'left',
          traversal: [...traversal],
          path: [...path, 'left'],
          iteration: ++nodeVisitCount,
          message: `Iteration ${nodeVisitCount}: Moving to left child of ${node.value}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(h) where h is height"
        });
        preorderTraversal(node.left, [...path, 'left']);
      }
      
      // Visit right subtree
      if (node.right) {
        steps.push({
          tree,
          current: node,
          visiting: 'right',
          traversal: [...traversal],
          path: [...path, 'right'],
          iteration: ++nodeVisitCount,
          message: `Iteration ${nodeVisitCount}: Moving to right child of ${node.value}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(h) where h is height"
        });
        preorderTraversal(node.right, [...path, 'right']);
      }
    }
    
    function postorderTraversal(node: any, path: string[] = []) {
      if (!node) return;
      
      // Visit left subtree
      if (node.left) {
        steps.push({
          tree,
          current: node,
          visiting: 'left',
          traversal: [...traversal],
          path: [...path, 'left'],
          iteration: ++nodeVisitCount,
          message: `Iteration ${nodeVisitCount}: Moving to left child of ${node.value}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(h) where h is height"
        });
        postorderTraversal(node.left, [...path, 'left']);
      }
      
      // Visit right subtree
      if (node.right) {
        steps.push({
          tree,
          current: node,
          visiting: 'right',
          traversal: [...traversal],
          path: [...path, 'right'],
          iteration: ++nodeVisitCount,
          message: `Iteration ${nodeVisitCount}: Moving to right child of ${node.value}`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(h) where h is height"
        });
        postorderTraversal(node.right, [...path, 'right']);
      }
      
      // Visit current node last
      traversal.push(node.value);
      steps.push({
        tree,
        current: node,
        traversal: [...traversal],
        path,
        iteration: ++nodeVisitCount,
        message: `Iteration ${nodeVisitCount}: Visited node ${node.value}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(h) where h is height"
      });
    }
    
    // Call the appropriate traversal method
    if (traversalType === 'inorder') {
      inorderTraversal(tree);
    } else if (traversalType === 'preorder') {
      preorderTraversal(tree);
    } else if (traversalType === 'postorder') {
      postorderTraversal(tree);
    }
    
    // Final step
    steps.push({
      tree,
      traversal,
      iteration: ++nodeVisitCount,
      message: `${traversalType} traversal complete: [${traversal.join(', ')}]`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(h) where h is height"
    });
    
    setSteps(steps);
    return {
      tree,
      traversalType,
      type: 'tree-traversal'
    };
  }
  
  // Initialize dynamic programming (Fibonacci sequence)
  function initDynamicProgramming(data: any = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]) {
    // Ensure data is an array, or use default
    const sequence = Array.isArray(data) ? [...data] : [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
    const steps = [];
    
    // Setup for Fibonacci DP visualization
    steps.push({
      sequence,
      dp: {},
      iteration: 0,
      message: "Initializing Fibonacci sequence calculation using dynamic programming",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    });
    
    const dp: {[key: number]: number} = {};
    
    // Ensure we have at least 2 elements for base cases
    if (sequence.length < 2) {
      // Add default base cases if sequence is too short
      if (sequence.length === 0) {
        sequence.push(0, 1);
      } else if (sequence.length === 1) {
        sequence.push(1);
      }
    }
    
    // Base cases
    dp[0] = sequence[0];
    dp[1] = sequence[1];
    
    steps.push({
      sequence,
      dp: {...dp},
      iteration: 1,
      message: "Setting base cases: dp[0] = 0, dp[1] = 1",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    });
    
    // Fill the dp table
    for (let i = 2; i < sequence.length; i++) {
      steps.push({
        sequence,
        dp: {...dp},
        iteration: i,
        current: i,
        highlight: [i-1, i-2],
        message: `Calculating Fibonacci number at position ${i}: dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      });
      
      dp[i] = dp[i-1] + dp[i-2];
      
      steps.push({
        sequence,
        dp: {...dp},
        iteration: i,
        current: i,
        result: dp[i],
        message: `Computed dp[${i}] = ${dp[i]}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
      });
    }
    
    // Final result
    steps.push({
      sequence,
      dp,
      message: `Fibonacci sequence calculated: [${Object.values(dp).join(', ')}]`,
      completed: true,
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    });
    
    setSteps(steps);
    return {
      sequence,
      dp,
      type: 'fibonacci-dp'
    };
  }
  
  // Initialize greedy algorithm (Coin change / Activity selection)
  function initGreedyAlgorithm(data: any = {
    coins: [1, 5, 10, 25],
    amount: 63
  }) {
    // Default values
    const defaultCoins = [1, 5, 10, 25];
    const defaultAmount = 63;
    
    // Extract values, using defaults as fallbacks
    let coinsArray, amountValue;
    
    if (data && typeof data === 'object') {
      if (data.coins && Array.isArray(data.coins) && data.coins.length > 0) {
        coinsArray = [...data.coins];
      } else {
        coinsArray = defaultCoins;
      }
      
      if (data.amount && typeof data.amount === 'number' && !isNaN(data.amount)) {
        amountValue = data.amount;
      } else {
        amountValue = defaultAmount;
      }
    } else {
      coinsArray = defaultCoins;
      amountValue = defaultAmount;
    }
    
    const sortedCoins = [...coinsArray].sort((a, b) => b - a); // Sort coins in descending order
    const steps = [];
    
    steps.push({
      coins: sortedCoins,
      amount: amountValue,
      remaining: amountValue,
      result: [],
      iteration: 0,
      message: `Using greedy approach to make change for ${amountValue} using coins ${sortedCoins.join(', ')}`,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)"
    });
    
    let remaining = amountValue;
    const result: {coin: number, count: number}[] = [];
    
    for (let i = 0; i < sortedCoins.length; i++) {
      const coin = sortedCoins[i];
      if (coin <= remaining) {
        const count = Math.floor(remaining / coin);
        remaining -= count * coin;
        
        steps.push({
          coins: sortedCoins,
          amount: amountValue,
          remaining: remaining + count * coin,
          current: coin,
          coinIndex: i,
          iteration: i + 1,
          message: `Considering coin ${coin}: We can use ${count} of these coins`,
          timeComplexity: "O(n log n)",
          spaceComplexity: "O(n)"
        });
        
        result.push({ coin, count });
        
        steps.push({
          coins: sortedCoins,
          amount: amountValue,
          remaining,
          result: [...result],
          current: coin,
          coinIndex: i,
          iteration: i + 1,
          message: `Used ${count} of coin ${coin}, remaining amount: ${remaining}`,
          timeComplexity: "O(n log n)",
          spaceComplexity: "O(n)"
        });
      } else {
        steps.push({
          coins: sortedCoins,
          amount: amountValue,
          remaining,
          result: [...result],
          current: coin,
          coinIndex: i,
          iteration: i + 1,
          message: `Coin ${coin} is too large for remaining amount ${remaining}, skipping`,
          timeComplexity: "O(n log n)",
          spaceComplexity: "O(n)"
        });
      }
    }
    
    // Final result
    steps.push({
      coins: sortedCoins,
      amount: amountValue,
      remaining,
      result,
      message: remaining === 0 
        ? `Change made successfully using greedy approach: ${result.map(r => `${r.count} x ${r.coin}`).join(', ')}` 
        : `Greedy approach couldn't make exact change, remaining: ${remaining}`,
      completed: true,
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)"
    });
    
    setSteps(steps);
    return {
      coins: sortedCoins,
      amount: amountValue,
      type: 'coin-change-greedy'
    };
  }
  
  // Add initialization function for bit manipulation
  function initBitManipulation(data: any = {
    operations: [
      { name: 'AND', left: 0b10101010, right: 0b11001100, result: 0b10001000 },
      { name: 'OR', left: 0b10101010, right: 0b11001100, result: 0b11101110 },
      { name: 'XOR', left: 0b10101010, right: 0b11001100, result: 0b01100110 },
      { name: 'NOT', value: 0b10101010, result: 0b01010101 },
      { name: 'LEFT SHIFT', value: 0b00001111, shift: 2, result: 0b00111100 },
      { name: 'RIGHT SHIFT', value: 0b00001111, shift: 1, result: 0b00000111 }
    ],
    currentOperation: 0
  }) {
    // Ensure data has the correct structure
    const defaultOperations = [
      { name: 'AND', left: 0b10101010, right: 0b11001100, result: 0b10001000 },
      { name: 'OR', left: 0b10101010, right: 0b11001100, result: 0b11101110 },
      { name: 'XOR', left: 0b10101010, right: 0b11001100, result: 0b01100110 },
      { name: 'NOT', value: 0b10101010, result: 0b01010101 },
      { name: 'LEFT SHIFT', value: 0b00001111, shift: 2, result: 0b00111100 },
      { name: 'RIGHT SHIFT', value: 0b00001111, shift: 1, result: 0b00000111 }
    ];
    
    // Get operations from data if it exists and is structured correctly, otherwise use default
    const operations = data && data.operations && Array.isArray(data.operations) && data.operations.length > 0
      ? data.operations
      : defaultOperations;
    
    const steps = [];
    let iteration = 0;
    
    steps.push({
      operations,
      currentOperation: 0,
      iteration: iteration,
      message: "Starting bitwise operations visualization",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)"
    });
    
    operations.forEach((op: any, index: number) => {
      iteration++;
      steps.push({
        operations,
        currentOperation: index,
        operation: op,
        iteration: iteration,
        message: `Iteration ${iteration}: ${op.name} operation`,
        timeComplexity: "O(1)",
        spaceComplexity: "O(1)"
      });
      
      // For operations with intermediate steps
      if (op.name === 'AND' || op.name === 'OR' || op.name === 'XOR') {
        iteration++;
        steps.push({
          operations,
          currentOperation: index,
          operation: op,
          showResult: true,
          iteration: iteration,
          message: `Iteration ${iteration}: Result of ${op.name} operation: ${op.result.toString(2).padStart(8, '0')}`,
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)"
        });
      }
    });
    
    iteration++;
    steps.push({
      operations,
      currentOperation: operations.length - 1,
      iteration: iteration,
      message: "All bitwise operations complete",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)"
    });
    
    setSteps(steps);
    return {
      operations,
      type: 'bit-manipulation'
    };
  }
  
  // Add initialization function for advanced bit manipulation
  function initBitManipulationAdvanced(data: any = {
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
  }) {
    // Default challenges
    const defaultChallenges = [
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
    ];
    
    // Get challenges from data if it exists and is structured correctly, otherwise use default
    const challenges = data && data.challenges && Array.isArray(data.challenges) && data.challenges.length > 0
      ? data.challenges
      : defaultChallenges;
    
    const steps = [];
    let iteration = 0;
    
    steps.push({
      challenges,
      currentChallenge: 0,
      currentStep: 0,
      iteration: iteration,
      message: "Starting bit wizardry challenges",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)"
    });
    
    challenges.forEach((challenge: any, challengeIndex: number) => {
      iteration++;
      
      if (challenge.name === 'XOR Swap') {
        steps.push({
          challenges,
          currentChallenge: challengeIndex,
          currentStep: 0,
          challenge,
          iteration: iteration,
          message: `Challenge ${challengeIndex + 1}: ${challenge.name} - Initial values a=${challenge.a}, b=${challenge.b}`,
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)"
        });
        
        if (challenge.steps && Array.isArray(challenge.steps)) {
          challenge.steps.forEach((step: any, stepIndex: number) => {
            if (stepIndex === 0) return; // Skip initial state
            
            iteration++;
            steps.push({
              challenges,
              currentChallenge: challengeIndex,
              currentStep: stepIndex,
              challenge,
              iteration: iteration,
              message: `Challenge ${challengeIndex + 1}: ${challenge.name} - Step ${stepIndex}: ${step.operation}`,
              timeComplexity: "O(1)",
              spaceComplexity: "O(1)"
            });
          });
        }
      } else {
        steps.push({
          challenges,
          currentChallenge: challengeIndex,
          challenge,
          iteration: iteration,
          message: `Challenge ${challengeIndex + 1}: ${challenge.name} - ${challenge.operation}`,
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)"
        });
        
        iteration++;
        steps.push({
          challenges,
          currentChallenge: challengeIndex,
          challenge,
          showResult: true,
          iteration: iteration,
          message: `Challenge ${challengeIndex + 1}: ${challenge.name} - Result: ${challenge.result}`,
          timeComplexity: "O(1)",
          spaceComplexity: "O(1)"
        });
      }
    });
    
    iteration++;
    steps.push({
      challenges,
      currentChallenge: challenges.length - 1,
      iteration: iteration,
      message: "All bit wizardry challenges complete",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)"
    });
    
    setSteps(steps);
    return {
      challenges,
      type: 'bit-manipulation-advanced'
    };
  }
  
  // Render visualization based on type and current step
  const renderVisualization = () => {
    if (!steps.length || currentStep >= steps.length) return null;
    
    const step = steps[currentStep];
    
    switch (type) {
      case 'array-sort':
        return renderArraySort(step);
      case 'binary-search':
        return renderBinarySearch(step);
      case 'graph-traversal':
        return renderGraphTraversal(step);
      case 'linked-list':
        return renderLinkedList(step);
      case 'tree-traversal':
        return renderTreeTraversal(step);
      case 'dynamic-programming':
        return renderDynamicProgramming(step);
      case 'greedy-algorithm':
        return renderGreedyAlgorithm(step);
      case 'bit-manipulation':
        return renderBitManipulation(step);
      case 'bit-manipulation-advanced':
        return renderBitManipulationAdvanced(step);
      default:
        return <div>No visualization available for this type</div>;
    }
  };
  
  // Render functions for each visualization type
  function renderArraySort(step: any) {
    const { array, pivot, comparing, swapped, iteration, low, high, currentIndex } = step;
    
    return (
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Quicksort Algorithm
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Time: {step.timeComplexity || "O(n log n) avg"} | Space: {step.spaceComplexity || "O(log n)"}
          </div>
          <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            Iteration: {iteration !== undefined ? iteration : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {comparing !== undefined && <span>j = {comparing} | </span>}
            {currentIndex !== undefined && <span>Current Index = {currentIndex} | </span>}
            {low !== undefined && <span>low = {low} | </span>}
            {high !== undefined && <span>high = {high} | </span>}
            {pivot !== undefined && pivot !== null && <span>pivot index = {pivot}</span>}
          </div>
        </div>

        <div className="flex items-end space-x-1 mb-8 h-64">
          {array.map((value: number, index: number) => {
            let bgColor = 'bg-blue-500 dark:bg-blue-600';
            
            if (index === pivot) {
              bgColor = 'bg-red-500 dark:bg-red-600';
            } else if (swapped && (index === swapped[0] || index === swapped[1])) {
              bgColor = 'bg-green-500 dark:bg-green-600';
            } else if (index === comparing) {
              bgColor = 'bg-yellow-500 dark:bg-yellow-600';
            }
            
            return (
              <div 
                key={index} 
                className={`w-10 flex flex-col items-center transition-all duration-300 ${bgColor}`}
                style={{ height: `${value * 3}px` }}
              >
                <div className="text-white text-center w-full p-1">
                  {value}
                </div>
                <div className="text-white text-center w-full bg-gray-800/30 text-xs">
                  {index}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  function renderBinarySearch(step: any) {
    const { array, left, right, mid, found, iteration } = step;
    
    return (
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Binary Search Algorithm
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Time: {step.timeComplexity || "O(log n)"} | Space: {step.spaceComplexity || "O(1)"}
          </div>
          <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            Iteration: {iteration !== undefined ? iteration : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {left !== undefined && <span>left = {left} | </span>}
            {right !== undefined && <span>right = {right} | </span>}
            {mid !== undefined && mid !== null && <span>mid = {mid}</span>}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 mb-8">
          {array.map((value: number, index: number) => {
            let bgColor = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            
            if (index === mid) {
              bgColor = found 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            } else if (index >= left && index <= right) {
              bgColor = 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200';
            } else {
              bgColor = 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400';
            }
            
            return (
              <div 
                key={index} 
                className={`w-12 h-14 flex flex-col items-center justify-center rounded-lg transition-all duration-300 ${bgColor}`}
              >
                <div>{value}</div>
                <div className="text-xs mt-1">[{index}]</div>
              </div>
            );
          })}
        </div>
        
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Search range: [{left !== undefined ? array[left] : '?'} ... {right !== undefined && right >= 0 ? array[right] : '?'}]
        </div>
        
        {mid !== null && (
          <div className={`text-sm font-medium ${found ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
            Mid: {array[mid]}
          </div>
        )}
      </div>
    );
  }
  
  function renderGraphTraversal(step: any) {
    const { queue, visited, current, edge, iteration } = step;
    
    if (!visualData) return null;
    const { nodes, edges } = visualData;
    
    // Simple circle packing layout for nodes
    const radius = 25;
    const width = 400;
    const height = 300;
    const nodePositions: Record<string, {x: number, y: number}> = {};
    
    // Place nodes in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const circleRadius = Math.min(width, height) / 2.5;
    
    nodes.forEach((node: string, index: number) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      nodePositions[node] = {
        x: centerX + circleRadius * Math.cos(angle),
        y: centerY + circleRadius * Math.sin(angle)
      };
    });
    
    return (
      <div className="flex flex-col items-center w-full" style={{ maxHeight: '450px' }}>
        <div className="mb-4 text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Graph Traversal (BFS)
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Time: {step.timeComplexity || "O(V + E)"} | Space: {step.spaceComplexity || "O(V)"}
          </div>
          <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            Iteration: {iteration !== undefined ? iteration : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {current && <span>Current Node: {current} | </span>}
            {edge && <span>Edge: {edge[0]} → {edge[1]} | </span>}
            {queue && queue.length > 0 && <span>Queue Front: {queue[0]}</span>}
          </div>
        </div>
        
        <div className="w-full overflow-auto flex justify-center mb-2">
          <svg width={width} height={height} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            {/* Draw edges */}
            {edges.map(([from, to]: [string, string], index: number) => {
              const fromPos = nodePositions[from];
              const toPos = nodePositions[to];
              
              let strokeColor = 'stroke-gray-300 dark:stroke-gray-600';
              if (edge && ((edge[0] === from && edge[1] === to) || (edge[0] === to && edge[1] === from))) {
                strokeColor = 'stroke-green-500 dark:stroke-green-400';
              }
              
              return (
                <line 
                  key={`edge-${index}`}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  className={`${strokeColor} stroke-2 transition-colors duration-300`}
                />
              );
            })}
            
            {/* Draw nodes */}
            {nodes.map((node: string) => {
              const pos = nodePositions[node];
              
              let fillColor = 'fill-blue-100 dark:fill-blue-900 text-blue-800 dark:text-blue-200';
              if (node === current) {
                fillColor = 'fill-green-100 dark:fill-green-900 text-green-800 dark:text-green-200';
              } else if (visited && visited.has(node)) {
                fillColor = 'fill-indigo-100 dark:fill-indigo-900 text-indigo-800 dark:text-indigo-200';
              } else if (queue && queue.includes(node)) {
                fillColor = 'fill-yellow-100 dark:fill-yellow-900 text-yellow-800 dark:text-yellow-200';
              }
              
              return (
                <g key={`node-${node}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    className={`${fillColor} stroke-gray-400 dark:stroke-gray-500 transition-colors duration-300`}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-medium text-sm"
                  >
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        
        <div className="flex space-x-4 text-sm mb-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500 mr-1"></div>
            <span>Queue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-400 dark:bg-indigo-500 mr-1"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500 mr-1"></div>
            <span>Current</span>
          </div>
        </div>
        
        {queue && queue.length > 0 && (
          <div className="mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-full max-w-md">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Queue:</div>
            <div className="flex flex-wrap gap-1">
              {queue.map((node: string, i: number) => (
                <div key={i} className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  {node}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  function renderLinkedList(step: any) {
    const { list, operation, target, found, searching, iteration } = step;
    
    return (
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Linked List Operations
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Time: {step.timeComplexity || "Varies by operation"} | Space: {step.spaceComplexity || "O(1)"}
          </div>
          <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            Iteration: {iteration !== undefined ? iteration : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {operation && <span>Operation: {operation} | </span>}
            {target !== undefined && <span>Target: {target} | </span>}
            {found !== undefined && <span>Found at index: {found}</span>}
          </div>
        </div>
        
        <div className="flex items-center mb-8">
          {list.map((value: number, index: number) => {
            let bgColor = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            
            if (operation === 'insert_tail' && index === list.length - 1 && target === value) {
              bgColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            } else if (operation === 'insert_head' && index === 0 && target === value) {
              bgColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            } else if (operation === 'search' && searching && value === target) {
              bgColor = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            } else if (operation === 'search' && found === index) {
              bgColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            } else if (operation === 'delete' && value === target) {
              bgColor = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
            }
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex flex-col ${bgColor} rounded-lg transition-all duration-300`}>
                  <div className="w-14 h-14 flex items-center justify-center">
                    {value}
                  </div>
                  <div className="text-xs text-center bg-gray-100 dark:bg-gray-700 py-1 rounded-b-lg">
                    index: {index}
                  </div>
                </div>
                {index < list.length - 1 && (
                  <div className="w-6 h-0.5 bg-gray-400 dark:bg-gray-500 mx-1"></div>
                )}
              </div>
            );
          })}
          
          {list.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400">Empty list</div>
          )}
        </div>
      </div>
    );
  }
  
  function renderTreeTraversal(step: any) {
    const { tree, current, visiting, traversal, path, iteration } = step;
    
    // Function to recursively render tree nodes
    const renderNode = (node: any, nodePath: string[] = []) => {
      if (!node) return null;
      
      // Determine node colors
      let bgColor = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      
      // Check if this is the current node
      if (current && path && JSON.stringify(nodePath) === JSON.stringify(path)) {
        bgColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      }
      
      // Check if we're visiting a child of the current node
      if (visiting && current && path && 
          JSON.stringify(path) === JSON.stringify(nodePath.slice(0, -1)) && 
          nodePath[nodePath.length - 1] === visiting) {
        bgColor = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      }
      
      return (
        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 ${bgColor} flex flex-col items-center justify-center rounded-full transition-all duration-300 mb-2`}>
            <div>{node.value}</div>
            <div className="text-xs">{nodePath.join('→')}</div>
          </div>
          
          {(node.left || node.right) && (
            <div className="flex space-x-6">
              <div className="flex flex-col items-center">
                {node.left ? (
                  <>
                    <div className="w-0.5 h-6 bg-gray-400 dark:bg-gray-500"></div>
                    {renderNode(node.left, [...nodePath, 'L'])}
                  </>
                ) : <div className="w-8 h-8"></div>}
              </div>
              
              <div className="flex flex-col items-center">
                {node.right ? (
                  <>
                    <div className="w-0.5 h-6 bg-gray-400 dark:bg-gray-500"></div>
                    {renderNode(node.right, [...nodePath, 'R'])}
                  </>
                ) : <div className="w-8 h-8"></div>}
              </div>
            </div>
          )}
        </div>
      );
    };
    
    return (
      <div className="flex flex-col items-center w-full" style={{ maxHeight: '450px' }}>
        <div className="mb-4 text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {visualData?.traversalType || 'Tree'} Traversal
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Time: {step.timeComplexity || "O(n)"} | Space: {step.spaceComplexity || "O(h)"}
          </div>
          <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            Iteration: {iteration !== undefined ? iteration : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {current && <span>Current Node: {current.value} | </span>}
            {visiting && <span>Visiting: {visiting} child | </span>}
            {path && <span>Path: {path.join('→')}</span>}
          </div>
        </div>
        
        <div className="w-full overflow-auto flex justify-center mb-2" style={{ maxHeight: '300px' }}>
          <div className="min-h-[200px]">
            {renderNode(tree)}
          </div>
        </div>
        
        {traversal && traversal.length > 0 && (
          <div className="mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-full max-w-md">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Traversal order so far:</div>
            <div className="flex flex-wrap gap-1">
              {traversal.map((value: number, i: number) => (
                <div key={i} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Render dynamic programming visualization (Fibonacci)
  function renderDynamicProgramming(step: any) {
    const { sequence, dp, current, highlight, result, iteration } = step;
    
    return (
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Fibonacci Sequence (Dynamic Programming)
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Time: {step.timeComplexity} | Space: {step.spaceComplexity}
          </div>
          <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            Iteration: {iteration !== undefined ? iteration : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {current !== undefined && <span>Current i = {current} | </span>}
            {highlight && <span>Using values from: {highlight.join(', ')} | </span>}
            {result !== undefined && <span>Result = {result}</span>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-6">
          {Object.keys(dp || {}).map((key, index) => {
            const k = Number(key);
            let bgColor = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            
            if (current !== undefined && k === current) {
              bgColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            } else if (highlight && highlight.includes(k)) {
              bgColor = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            } else if (result !== undefined && k === current) {
              bgColor = 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200';
            }
            
            return (
              <div key={key} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">dp[{key}]</div>
                <div className={`w-12 h-12 ${bgColor} flex items-center justify-center rounded-lg transition-all duration-300`}>
                  {dp[k]}
                </div>
              </div>
            );
          })}
        </div>
        
        {result !== undefined && current !== undefined && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-700 dark:text-indigo-300">
            dp[{current}] = dp[{current-1}] + dp[{current-2}] = {dp[current-1]} + {dp[current-2]} = {result}
          </div>
        )}
      </div>
    );
  }
  
  // Render greedy algorithm visualization (Coin change)
  function renderGreedyAlgorithm(step: any) {
    const { coins, amount, remaining, result, current, coinIndex, iteration } = step;
    
    return (
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Coin Change (Greedy Algorithm)
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Time: {step.timeComplexity} | Space: {step.spaceComplexity}
          </div>
          <div className="text-md text-indigo-600 dark:text-indigo-400 font-medium mb-2">
            Iteration: {iteration !== undefined ? iteration : 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {coinIndex !== undefined && <span>Current Coin Index: {coinIndex} | </span>}
            {current !== undefined && <span>Current Coin Value: {current}¢ | </span>}
            {result && <span>Coins Used: {result.length}</span>}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          {coins.map((coin: number, index: number) => {
            let bgColor = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            
            if (index === coinIndex) {
              bgColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            }
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-14 h-14 ${bgColor} flex items-center justify-center rounded-full transition-all duration-300 text-lg font-medium`}>
                  {coin}¢
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  coin[{index}]
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Amount to change</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{amount}¢</div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
            <div className="text-sm text-indigo-500 dark:text-indigo-400">Remaining</div>
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{remaining}¢</div>
          </div>
        </div>
        
        {result && result.length > 0 && (
          <div className="mt-2 w-full max-w-md">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Coins used so far:</div>
            <div className="flex flex-wrap gap-2">
              {result.map((item: {coin: number, count: number}, index: number) => (
                <div key={index} className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg text-green-700 dark:text-green-300">
                  {item.count} × {item.coin}¢
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Add helper functions to extract metadata
  function getStepNameFromMessage(message: string): string {
    // Check if message is null, undefined or not a string
    if (!message || typeof message !== 'string') {
      return "Algorithm Step";
    }
    
    // Extract a step name from the message
    if (message.includes("Starting quicksort")) return "Initialize Quicksort";
    if (message.includes("Choosing pivot")) return "Select Pivot";
    if (message.includes("Comparing")) return "Compare Elements";
    if (message.includes("Swapped")) return "Swap Elements";
    if (message.includes("Placed pivot")) return "Place Pivot";
    if (message.includes("sorted")) return "Completed Sort";
    
    if (message.includes("Starting binary search")) return "Initialize Binary Search";
    if (message.includes("Checking middle")) return "Check Middle Element";
    if (message.includes("Moving right")) return "Search Right Half";
    if (message.includes("Moving left")) return "Search Left Half";
    if (message.includes("Found target")) return "Found Target";
    
    if (message.includes("BFS")) return "BFS Initialization";
    if (message.includes("Visiting node")) return "Process Current Node";
    if (message.includes("Exploring neighbors")) return "Explore Neighbors";
    
    if (message.includes("Creating new node")) return "Create Node";
    if (message.includes("Inserting at head")) return "Insert at Head";
    if (message.includes("Inserting at tail")) return "Insert at Tail";
    if (message.includes("Deleting node")) return "Delete Node";
    
    if (message.includes("traversal")) return "Tree Traversal";
    if (message.includes("left subtree")) return "Visit Left Subtree";
    if (message.includes("right subtree")) return "Visit Right Subtree";
    if (message.includes("Processing node")) return "Process Node";
    
    // Default generic step name
    return "Algorithm Step";
  }

  function getLineHighlightsForStep(step: any, type: VisualizationType): {[key: number]: boolean} {
    // Initialize an empty highlights object
    const highlights: {[key: number]: boolean} = {};
    
    // If step is null or undefined, return empty highlights
    if (!step) return highlights;
    
    // Based on the algorithm type and current step, determine which lines to highlight
    switch (type) {
      case 'array-sort':
        // Quicksort line highlights with iteration information
        if (step.pivot !== undefined && step.pivot !== null && !step.swapped) {
          // Selecting pivot
          highlights[15] = true;  // pivot = arr[high]
          highlights[16] = true;  // i = low - 1
        } else if (step.comparing !== undefined) {
          // Comparing elements (iteration information in message)
          highlights[19] = true;  // for j in range
          highlights[20] = true;  // if arr[j] <= pivot
        } else if (step.swapped !== undefined) {
          if (step.swapped && Array.isArray(step.swapped) && step.swapped[1] === step.high) {
            // Placing pivot
            highlights[25] = true;  // arr[i+1], arr[high] = arr[high], arr[i+1]
            highlights[26] = true;  // return i + 1
          } else {
            // Swapping elements during partition
            highlights[21] = true;  // i++
            highlights[22] = true;  // arr[i], arr[j] = arr[j], arr[i]
          }
        } else if (step.message && typeof step.message === 'string' && step.message.includes("Starting")) {
          // Initial recursive call
          highlights[4] = true;  // if low < high
          highlights[5] = true;  // find partition index
          highlights[6] = true;  // pi = partition(arr, low, high)
        } else if (step.message && typeof step.message === 'string' && step.message.includes("sorted")) {
          // Returning from sort
          highlights[10] = true;  // return arr
        } else {
          // Recursive calls
          highlights[8] = true;  // quicksort(arr, low, pi - 1)
          highlights[9] = true;  // quicksort(arr, pi + 1, high)
        }
        break;
        
      case 'binary-search':
        // Binary search line highlights with iteration information
        if (step.message && typeof step.message === 'string' && step.message.includes("Starting")) {
          // Initialization
          highlights[2] = true;  // left = 0
          highlights[3] = true;  // right = len(arr) - 1
        } else if (step.mid !== undefined && step.mid !== null && step.message && typeof step.message === 'string' && step.message.includes("middle")) {
          // Calculating middle (iteration information in message)
          highlights[6] = true;  // mid = left + (right - left) // 2
        } else if (step.mid !== undefined && step.mid !== null && step.message && typeof step.message === 'string' && step.message.includes("Found")) {
          // Found target
          highlights[9] = true;  // return mid
        } else if (step.mid !== undefined && step.mid !== null && step.message && typeof step.message === 'string' && step.message.includes("right")) {
          // Moving right
          highlights[13] = true;  // left = mid + 1
        } else if (step.mid !== undefined && step.mid !== null && step.message && typeof step.message === 'string' && step.message.includes("left")) {
          // Moving left
          highlights[17] = true;  // right = mid - 1
        } else {
          // Comparison check
          highlights[9] = true;   // if arr[mid] == target
          highlights[13] = true;  // elif arr[mid] < target
          highlights[17] = true;  // else (arr[mid] > target)
        }
        break;
        
      case 'dynamic-programming':
        // Fibonacci DP line highlights with iteration information
        if (step.message && typeof step.message === 'string' && step.message.includes("Initializing")) {
          // Initialization
          highlights[2] = true;  // function fibonacci(n)
          highlights[3] = true;  // create dp array
        } else if (step.message && typeof step.message === 'string' && step.message.includes("base cases")) {
          // Base cases
          highlights[5] = true;  // dp[0] = 0
          highlights[6] = true;  // dp[1] = 1
        } else if (step.highlight) {
          // Calculating next Fibonacci number (with iteration information)
          highlights[9] = true;  // for i = 2 to n
          highlights[10] = true; // dp[i] = dp[i-1] + dp[i-2]
        } else if (step.result !== undefined) {
          // Storing result
          highlights[10] = true; // dp[i] = dp[i-1] + dp[i-2]
        } else if (step.completed) {
          // Final result
          highlights[13] = true; // return dp[n]
        }
        break;
        
      case 'greedy-algorithm':
        // Coin change greedy algorithm highlights with iteration information
        if (step.message && typeof step.message === 'string' && step.message.includes("Using greedy")) {
          // Initialization
          highlights[2] = true;  // function coinChange(coins, amount)
          highlights[3] = true;  // sort coins descending
          highlights[4] = true;  // result = []
        } else if (step.message && typeof step.message === 'string' && step.message.includes("Considering coin")) {
          // Considering a coin (with iteration information)
          highlights[7] = true;  // for each coin in coins
          highlights[8] = true;  // count = Math.floor(amount / coin)
        } else if (step.message && typeof step.message === 'string' && step.message.includes("Used")) {
          // Adding coins to result
          highlights[10] = true; // result.push({coin, count})
          highlights[11] = true; // amount -= count * coin
        } else if (step.message && typeof step.message === 'string' && step.message.includes("too large")) {
          // Skipping a coin
          highlights[7] = true;  // continue to next coin
        } else if (step.completed) {
          // Final result
          highlights[14] = true; // return result
        }
        break;
        
      // ... keep existing cases ...
        
      default:
        // For other cases, use a basic fallback highlighting
        highlights[1] = true;  // Highlight first line as fallback
        break;
    }
    
    return highlights;
  }
  
  // Add render functions for bit manipulation
  function renderBitManipulation(step: any) {
    const toBinary = (num: number) => num.toString(2).padStart(8, '0');
    
    return (
      <div className="flex flex-col space-y-6">
        <div className="text-center font-medium text-lg">Bitwise Operations</div>
        
        {step.operation && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-4">{step.operation.name} Operation</h3>
            
            <div className="space-y-6">
              {(step.operation.name === 'AND' || step.operation.name === 'OR' || step.operation.name === 'XOR') && (
                <>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Left Operand</div>
                      <div className="grid grid-cols-8 gap-1">
                        {toBinary(step.operation.left).split('').map((bit, i) => (
                          <div 
                            key={`left-${i}`} 
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              bit === '1' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {bit}
                          </div>
                        ))}
                      </div>
                      <div className="mt-1 text-right font-mono">{step.operation.left}</div>
                    </div>
                    
                    <div className="flex items-center justify-center py-2">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-xl font-bold">
                        {step.operation.name === 'AND' ? '&' : (step.operation.name === 'OR' ? '|' : '^')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Right Operand</div>
                      <div className="grid grid-cols-8 gap-1">
                        {toBinary(step.operation.right).split('').map((bit, i) => (
                          <div 
                            key={`right-${i}`} 
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              bit === '1' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {bit}
                          </div>
                        ))}
                      </div>
                      <div className="mt-1 text-right font-mono">{step.operation.right}</div>
                    </div>
                  </div>
                  
                  {step.showResult && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Result</div>
                      <div className="grid grid-cols-8 gap-1">
                        {toBinary(step.operation.result).split('').map((bit, i) => (
                          <div 
                            key={`result-${i}`} 
                            className={`w-8 h-8 flex items-center justify-center rounded-md ${
                              bit === '1' 
                                ? 'bg-purple-500 text-white animate-pulse' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {bit}
                          </div>
                        ))}
                      </div>
                      <div className="mt-1 text-right font-mono">{step.operation.result}</div>
                    </div>
                  )}
                </>
              )}
              
              {step.operation.name === 'NOT' && (
                <>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Input Value</div>
                    <div className="grid grid-cols-8 gap-1">
                      {toBinary(step.operation.value).split('').map((bit, i) => (
                        <div 
                          key={`value-${i}`} 
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            bit === '1' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 text-right font-mono">{step.operation.value}</div>
                  </div>
                  
                  <div className="flex items-center justify-center py-2">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-xl font-bold">
                      ~
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Result</div>
                    <div className="grid grid-cols-8 gap-1">
                      {toBinary(step.operation.result).split('').map((bit, i) => (
                        <div 
                          key={`result-${i}`} 
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            bit === '1' 
                              ? 'bg-purple-500 text-white animate-pulse' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 text-right font-mono">{step.operation.result}</div>
                  </div>
                </>
              )}
              
              {(step.operation.name === 'LEFT SHIFT' || step.operation.name === 'RIGHT SHIFT') && (
                <>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Original Value</div>
                    <div className="grid grid-cols-8 gap-1">
                      {toBinary(step.operation.value).split('').map((bit, i) => (
                        <div 
                          key={`value-${i}`} 
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            bit === '1' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 text-right font-mono">{step.operation.value}</div>
                  </div>
                  
                  <div className="flex items-center justify-center py-2">
                    <div className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-lg font-bold">
                      {step.operation.name === 'LEFT SHIFT' ? `<< ${step.operation.shift}` : `>> ${step.operation.shift}`}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Result</div>
                    <div className="grid grid-cols-8 gap-1">
                      {toBinary(step.operation.result).split('').map((bit, i) => (
                        <div 
                          key={`result-${i}`} 
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            bit === '1' 
                              ? 'bg-purple-500 text-white animate-pulse' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {bit}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 text-right font-mono">{step.operation.result}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">{step.message}</p>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <div>Time Complexity: {step.timeComplexity}</div>
            <div>Space Complexity: {step.spaceComplexity}</div>
          </div>
        </div>
      </div>
    );
  }
  
  function renderBitManipulationAdvanced(step: any) {
    const toBinary = (num: number) => num.toString(2).padStart(8, '0');
    
    if (!step.challenge) {
      return (
        <div className="flex flex-col space-y-6">
          <div className="text-center font-medium text-lg">Bit Wizardry Challenges</div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{step.message}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col space-y-6">
        <div className="text-center font-medium text-lg">Bit Wizardry: {step.challenge.name}</div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          {step.challenge.name === 'XOR Swap' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">XOR Swap Algorithm</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Swap two variables without using a temporary variable using XOR operations.
              </p>
              
              {step.currentStep !== undefined && step.challenge.steps[step.currentStep] && (
                <div className="space-y-6">
                  <div className="text-md text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    {step.challenge.steps[step.currentStep].operation}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        a = {step.challenge.steps[step.currentStep].a}
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {toBinary(step.challenge.steps[step.currentStep].a).split('').map((bit, i) => (
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
                    
                    <div className="flex items-center justify-center py-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="transform rotate-90">⇵</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        b = {step.challenge.steps[step.currentStep].b}
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {toBinary(step.challenge.steps[step.currentStep].b).split('').map((bit, i) => (
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
                </div>
              )}
            </div>
          )}
          
          {step.challenge.name === 'Power of 2 Check' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Power of 2 Check</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Check if a number is a power of 2 using bitwise operations.
              </p>
              
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Number: {step.challenge.value}</div>
                <div className="grid grid-cols-8 gap-1">
                  {toBinary(step.challenge.value).split('').map((bit, i) => (
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
              
              <div className="flex items-center justify-center py-2">
                <div className="px-4 py-2 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-md font-mono">
                  {step.challenge.operation}
                </div>
              </div>
              
              {step.showResult && (
                <div className="text-center mt-4">
                  <div className="inline-block px-4 py-2 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-lg font-bold">
                    Result: {step.challenge.result.toString()}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    {step.challenge.value} {step.challenge.result ? 'is' : 'is not'} a power of 2
                  </p>
                </div>
              )}
            </div>
          )}
          
          {step.challenge.name === 'Isolate Rightmost Bit' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Isolate Rightmost Bit</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Extract the rightmost set bit using the expression n & -n.
              </p>
              
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Number: {step.challenge.value}</div>
                <div className="grid grid-cols-8 gap-1">
                  {toBinary(step.challenge.value).split('').map((bit, i) => (
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
              
              <div className="flex items-center justify-center py-2">
                <div className="px-4 py-2 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-md font-mono">
                  {step.challenge.operation}
                </div>
              </div>
              
              {step.showResult && (
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Result: {step.challenge.result}</div>
                  <div className="grid grid-cols-8 gap-1">
                    {toBinary(step.challenge.result).split('').map((bit, i) => (
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
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300">{step.message}</p>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <div>Time Complexity: {step.timeComplexity || 'O(1)'}</div>
            <div>Space Complexity: {step.spaceComplexity || 'O(1)'}</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {type === 'array-sort' && 'Quicksort Visualization'}
          {type === 'binary-search' && 'Binary Search Visualization'}
          {type === 'graph-traversal' && 'BFS Graph Traversal'}
          {type === 'linked-list' && 'Linked List Operations'}
          {type === 'tree-traversal' && `${visualData?.traversalType || 'Tree'} Traversal`}
          {type === 'dynamic-programming' && 'Fibonacci Dynamic Programming'}
          {type === 'greedy-algorithm' && 'Coin Change Greedy Algorithm'}
          {type === 'bit-manipulation' && 'Bit Manipulation'}
          {type === 'bit-manipulation-advanced' && 'Bit Manipulation Advanced'}
        </h3>
        
        {interactive && gameCompleted && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            +25 XP
          </div>
        )}
      </div>
      
      {/* Use a flex layout with min-height */}
      <div className="flex flex-col h-full min-h-0">
        {/* Scrollable content area with flex-grow */}
        <div className="flex-grow overflow-auto p-4">
          <div className="flex items-center justify-center mb-4">
            {renderVisualization()}
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
            <p className="text-gray-700 dark:text-gray-300">{message}</p>
            {type === 'array-sort' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(n log n) average, O(n²) worst case | Space Complexity: O(log n)
              </p>
            )}
            {type === 'binary-search' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(log n) | Space Complexity: O(1)
              </p>
            )}
            {type === 'graph-traversal' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(V + E) | Space Complexity: O(V)
              </p>
            )}
            {type === 'linked-list' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(1) for insert, O(n) for search | Space Complexity: O(1)
              </p>
            )}
            {type === 'tree-traversal' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(n) | Space Complexity: O(h) where h is the height of the tree
              </p>
            )}
            {type === 'dynamic-programming' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(n) | Space Complexity: O(n)
              </p>
            )}
            {type === 'greedy-algorithm' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(n log n) | Space Complexity: O(n)
              </p>
            )}
            {type === 'bit-manipulation' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(1) | Space Complexity: O(1)
              </p>
            )}
            {type === 'bit-manipulation-advanced' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Time Complexity: O(1) | Space Complexity: O(1)
              </p>
            )}
          </div>
        </div>
        
        {/* Fixed footer with controls - always visible */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10 flex-shrink-0">
          <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <div className="flex space-x-2 overflow-x-auto pb-1">
              <button
                onClick={reset}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                disabled={!steps.length}
              >
                Reset
              </button>
              <button
                onClick={stepBackward}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                disabled={currentStep <= 0 || !steps.length}
              >
                ◀ Prev
              </button>
              <button
                onClick={togglePlay}
                className="px-4 py-1 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 whitespace-nowrap"
                disabled={currentStep >= steps.length - 1 || !steps.length}
              >
                {isPlaying ? (isPaused ? '▶ Resume' : '❚❚ Pause') : '▶ Play'}
              </button>
              <button
                onClick={stepForward}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                disabled={currentStep >= steps.length - 1 || !steps.length || isPlaying && !isPaused}
              >
                Next ▶
              </button>
            </div>
            
            <div className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
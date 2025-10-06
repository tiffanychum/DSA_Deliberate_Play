"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Interfaces
interface MCQuestion {
  id: number;
  topic: string;
  functionName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  code: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
  followUpQuestions?: FollowUpQuestion[];
}

interface FollowUpQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const GraphMultipleChoiceGame = () => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [followUpAnswer, setFollowUpAnswer] = useState<number | null>(null);
  const [showFollowUpExplanation, setShowFollowUpExplanation] = useState(false);

  // Enhanced game state
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [quizMode, setQuizMode] = useState<'normal' | 'speed'>('normal');
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<number[]>([]);
  const [showFollowUpResults, setShowFollowUpResults] = useState(false);

  // Cycle detection visualization state
  const [showCycleVisualization, setShowCycleVisualization] = useState<{[key: number]: 'with-cycle' | 'without-cycle' | null}>({});
  const [cycleAnimationStep, setCycleAnimationStep] = useState<{[key: number]: number}>({});

  // Iterative Deepening DFS visualization state
  const [showIDDFSVisualization, setShowIDDFSVisualization] = useState<{[key: number]: boolean}>({});
  const [iddfsAnimationStep, setIDDFSAnimationStep] = useState<{[key: number]: number}>({});
  const [iddfsCurrentDepth, setIDDFSCurrentDepth] = useState<{[key: number]: number}>({});

  // Bidirectional BFS visualization state
  const [showBidirectionalBFSVisualization, setShowBidirectionalBFSVisualization] = useState<{[key: number]: boolean}>({});
  const [bidirectionalBFSAnimationStep, setBidirectionalBFSAnimationStep] = useState<{[key: number]: number}>({});

  // Strongly Connected Components visualization state
  const [showSCCVisualization, setShowSCCVisualization] = useState<{[key: number]: 'strongly-connected' | 'not-connected' | null}>({});
  const [sccAnimationStep, setSCCAnimationStep] = useState<{[key: number]: number}>({});

  // Parallel BFS visualization state
  const [showParallelBFSVisualization, setShowParallelBFSVisualization] = useState<{[key: number]: boolean}>({});
  const [parallelBFSAnimationStep, setParallelBFSAnimationStep] = useState<{[key: number]: number}>({});

  // Kruskal's MST visualization state
  const [showKruskalVisualization, setShowKruskalVisualization] = useState<{[key: number]: boolean}>({});
  const [kruskalAnimationStep, setKruskalAnimationStep] = useState<{[key: number]: number}>({});

  // Borůvka's MST visualization state
  const [showBoruvkaVisualization, setShowBoruvkaVisualization] = useState<{[key: number]: boolean}>({});
  const [boruvkaAnimationStep, setBoruvkaAnimationStep] = useState<{[key: number]: number}>({});

  // Tarjan's Bridge-Finding visualization state
  const [showTarjanBridgeVisualization, setShowTarjanBridgeVisualization] = useState<{[key: number]: boolean}>({});
  const [tarjanBridgeAnimationStep, setTarjanBridgeAnimationStep] = useState<{[key: number]: number}>({});

  // Kosaraju vs Tarjan SCC Comparison visualization state
  const [showSCCComparisonVisualization, setShowSCCComparisonVisualization] = useState<{[key: number]: boolean}>({});
  const [sccComparisonAnimationStep, setSCCComparisonAnimationStep] = useState<{[key: number]: number}>({});
  const [sccComparisonAlgorithm, setSCCComparisonAlgorithm] = useState<{[key: number]: 'kosaraju' | 'tarjan'}>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle Detection Visualization Component
  const CycleVisualization = ({ questionId, type }: { questionId: number, type: 'with-cycle' | 'without-cycle' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    
    // Define graph structures
    const graphWithCycle = {
      nodes: [
        { id: 'A', x: 100, y: 80, color: 'white' },
        { id: 'B', x: 200, y: 50, color: 'white' },
        { id: 'C', x: 200, y: 110, color: 'white' },
        { id: 'D', x: 300, y: 80, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' }, // Creates cycle A -> B -> C -> A
        { from: 'B', to: 'D' }
      ]
    };

    const graphWithoutCycle = {
      nodes: [
        { id: 'A', x: 100, y: 80, color: 'white' },
        { id: 'B', x: 200, y: 50, color: 'white' },
        { id: 'C', x: 200, y: 110, color: 'white' },
        { id: 'D', x: 300, y: 80, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' }, // No cycle - tree structure
        { from: 'B', to: 'D' }
      ]
    };

    const currentGraph = type === 'with-cycle' ? graphWithCycle : graphWithoutCycle;
    const currentStep = cycleAnimationStep[questionId] || 0;

    // Define animation step interface
    interface AnimationStep {
      description: string;
      colors: {[key: string]: string};
      highlight?: string;
    }

    // Animation steps for cycle detection
    const getAnimationSteps = (): AnimationStep[] => {
      if (type === 'with-cycle') {
        return [
          { description: "Start DFS from A", colors: { A: 'gray' } },
          { description: "Visit B from A", colors: { A: 'gray', B: 'gray' } },
          { description: "Visit C from B", colors: { A: 'gray', B: 'gray', C: 'gray' } },
          { description: "Back edge to A detected - CYCLE FOUND!", colors: { A: 'red', B: 'gray', C: 'gray' }, highlight: 'C-A' },
          { description: "Cycle detected: A → B → C → A", colors: { A: 'red', B: 'red', C: 'red' } }
        ];
      } else {
        return [
          { description: "Start DFS from A", colors: { A: 'gray' } },
          { description: "Visit B from A", colors: { A: 'gray', B: 'gray' } },
          { description: "Visit D from B", colors: { A: 'gray', B: 'gray', D: 'gray' } },
          { description: "Backtrack to B, finish D", colors: { A: 'gray', B: 'gray', D: 'black' } },
          { description: "Backtrack to A, finish B", colors: { A: 'gray', B: 'black', D: 'black' } },
          { description: "Visit C from A", colors: { A: 'gray', B: 'black', C: 'gray', D: 'black' } },
          { description: "Finish C, then A - NO CYCLE", colors: { A: 'black', B: 'black', C: 'black', D: 'black' } }
        ];
      }
    };

    const steps = getAnimationSteps();
    const step = steps[Math.min(currentStep, steps.length - 1)];

    const drawGraph = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw edges
      currentGraph.edges.forEach(edge => {
        const fromNode = currentGraph.nodes.find(n => n.id === edge.from);
        const toNode = currentGraph.nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          
          // Highlight specific edges
          if (step.highlight === `${edge.from}-${edge.to}` || step.highlight === `${edge.to}-${edge.from}`) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
          } else {
            ctx.strokeStyle = isDarkMode ? '#6b7280' : '#9ca3af';
            ctx.lineWidth = 2;
          }
          ctx.stroke();

          // Draw arrow
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
          const arrowLength = 10;
          const arrowX = toNode.x - Math.cos(angle) * 25;
          const arrowY = toNode.y - Math.sin(angle) * 25;
          
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX - arrowLength * Math.cos(angle - Math.PI / 6), arrowY - arrowLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX - arrowLength * Math.cos(angle + Math.PI / 6), arrowY - arrowLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
      });

      // Draw nodes
      currentGraph.nodes.forEach(node => {
        const nodeColor = step.colors[node.id] || 'white';
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        
        switch (nodeColor) {
          case 'white':
            ctx.fillStyle = isDarkMode ? '#374151' : '#f8fafc';
            break;
          case 'gray':
            ctx.fillStyle = isDarkMode ? '#8b5cf6' : '#a855f7'; // Processing - Purple
            break;
          case 'black':
            ctx.fillStyle = isDarkMode ? '#06b6d4' : '#0891b2'; // Finished - Cyan
            break;
          case 'red':
            ctx.fillStyle = isDarkMode ? '#f43f5e' : '#e11d48'; // Cycle detected - Rose
            break;
        }
        
        ctx.fill();
        ctx.strokeStyle = isDarkMode ? '#6b7280' : '#374151';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw node label
        ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      });
    }, [currentGraph, step, isDarkMode]);

    useEffect(() => {
      drawGraph();
    }, [drawGraph]);

    const nextStep = () => {
      const steps = getAnimationSteps();
      setCycleAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.min((prev[questionId] || 0) + 1, steps.length - 1)
      }));
    };

    const prevStep = () => {
      setCycleAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.max((prev[questionId] || 0) - 1, 0)
      }));
    };

    const resetAnimation = () => {
      setCycleAnimationStep(prev => ({
        ...prev,
        [questionId]: 0
      }));
    };

    return (
      <div className={`p-6 rounded-xl border shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>
        <div className="text-center mb-4">
          <h4 className={`text-lg font-bold ${type === 'with-cycle' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {type === 'with-cycle' ? '🔄 Graph WITH Cycle' : '✅ Graph WITHOUT Cycle'}
          </h4>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {type === 'with-cycle' 
              ? 'Watch how DFS detects the cycle when it encounters a back edge' 
              : 'See how DFS traverses an acyclic graph without finding any cycles'
            }
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={160}
            className={`border-2 rounded-lg shadow-inner ${isDarkMode ? 'border-gray-600 bg-gray-900' : 'border-gray-300 bg-white'}`}
          />
        </div>

        <div className={`text-sm p-4 rounded-lg mb-4 text-center border ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 text-indigo-200 border-indigo-800/50' : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 border-indigo-200'}`}>
          <div className="font-bold text-base mb-1">Step {currentStep + 1} of {getAnimationSteps().length}</div>
          <div className="text-sm opacity-90">{step.description}</div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-md hover:shadow-lg disabled:hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button
            onClick={resetAnimation}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === getAnimationSteps().length - 1}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-md hover:shadow-lg disabled:hover:shadow-md"
          >
            Next
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-4 text-xs">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Processing</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Finished</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-rose-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Cycle Detected</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Iterative Deepening DFS Visualization Component
  const IDDFSVisualization = ({ questionId }: { questionId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Define graph structure for IDDFS demonstration
    const iddfsGraph = {
      nodes: [
        { id: 'A', x: 190, y: 70, color: 'white', level: 0 },
        { id: 'B', x: 120, y: 120, color: 'white', level: 1 },
        { id: 'C', x: 260, y: 120, color: 'white', level: 1 },
        { id: 'D', x: 60, y: 170, color: 'white', level: 2 },
        { id: 'E', x: 180, y: 170, color: 'white', level: 2 },
        { id: 'F', x: 320, y: 170, color: 'white', level: 2 },
        { id: 'G', x: 140, y: 220, color: 'white', level: 3 }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'D' },
        { from: 'B', to: 'E' },
        { from: 'C', to: 'F' },
        { from: 'E', to: 'G' }
      ]
    };

    const currentDepth = iddfsCurrentDepth[questionId] || 0;
    const currentStep = iddfsAnimationStep[questionId] || 0;

    // Define animation steps for each depth limit
    const getAnimationSteps = () => {
      const steps = [];
      
      // Depth 0: Only check start node
      steps.push({
        depth: 0,
        description: "Depth 0: Only check start node A",
        visitedNodes: ['A'],
        activeNodes: ['A'],
        foundTarget: false,
        complexity: "Nodes visited: 1"
      });

      // Depth 1: Check A and its immediate children
      steps.push({
        depth: 1,
        description: "Depth 1: Check A, then B, then C",
        visitedNodes: ['A', 'B', 'C'],
        activeNodes: ['A', 'B', 'C'],
        foundTarget: false,
        complexity: "Nodes visited: 3 (1 + 2)"
      });

      // Depth 2: Check up to level 2
      steps.push({
        depth: 2,
        description: "Depth 2: Check A→B→D, A→B→E, A→C→F",
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        activeNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        foundTarget: false,
        complexity: "Nodes visited: 6 (1 + 2 + 3)"
      });

      // Depth 3: Find target G
      steps.push({
        depth: 3,
        description: "Depth 3: Found target G! Path: A→B→E→G",
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        activeNodes: ['A', 'B', 'E', 'G'],
        foundTarget: true,
        targetPath: ['A', 'B', 'E', 'G'],
        complexity: "Nodes visited: 7 (1 + 2 + 3 + 1)"
      });

      return steps;
    };

    const steps = getAnimationSteps();
    const step = steps[Math.min(currentStep, steps.length - 1)];

    interface IDDFSAnimationStep {
      depth: number;
      description: string;
      visitedNodes: string[];
      activeNodes: string[];
      foundTarget: boolean;
      targetPath?: string[];
      complexity: string;
    }

    const drawGraph = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw depth level indicators with gradients
      for (let d = 0; d <= 3; d++) {
        const y = 55 + d * 50;
        
        // Create gradient for depth levels
        const gradient = ctx.createLinearGradient(0, y - 20, canvas.width, y + 20);
        if (isDarkMode) {
          gradient.addColorStop(0, `rgba(99, 102, 241, ${0.1 - d * 0.02})`); // Indigo fade
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.15 - d * 0.03})`); // Purple fade
          gradient.addColorStop(1, `rgba(99, 102, 241, ${0.1 - d * 0.02})`);
        } else {
          gradient.addColorStop(0, `rgba(165, 180, 252, ${0.3 - d * 0.05})`); // Light indigo
          gradient.addColorStop(0.5, `rgba(196, 181, 253, ${0.4 - d * 0.07})`); // Light purple
          gradient.addColorStop(1, `rgba(165, 180, 252, ${0.3 - d * 0.05})`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y - 20, canvas.width, 40);
        
        // Add subtle border
        ctx.strokeStyle = isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, y - 20, canvas.width, 40);
        
        // Depth labels with better styling
        ctx.fillStyle = isDarkMode ? '#a5b4fc' : '#4f46e5';
        ctx.font = 'bold 14px Inter, Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 2;
        ctx.fillText(`Depth ${d}`, 15, y + 5);
        ctx.shadowBlur = 0;
      }

      // Draw edges with improved styling
      iddfsGraph.edges.forEach(edge => {
        const fromNode = iddfsGraph.nodes.find(n => n.id === edge.from);
        const toNode = iddfsGraph.nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          // Calculate straight line from node edge to node edge
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const nodeRadius = 16;
          
          // Calculate start and end points at node edges
          const startX = fromNode.x + (dx / distance) * nodeRadius;
          const startY = fromNode.y + (dy / distance) * nodeRadius;
          const endX = toNode.x - (dx / distance) * nodeRadius;
          const endY = toNode.y - (dy / distance) * nodeRadius;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          
          // Enhanced edge styling
          if (step.foundTarget && step.targetPath) {
            const isPathEdge = step.targetPath.some((node, i) => 
              i < step.targetPath!.length - 1 && 
              ((step.targetPath![i] === edge.from && step.targetPath![i + 1] === edge.to) ||
               (step.targetPath![i] === edge.to && step.targetPath![i + 1] === edge.from))
            );
            
            if (isPathEdge) {
              // Glowing solution path
              ctx.shadowColor = '#10b981';
              ctx.shadowBlur = 8;
              ctx.strokeStyle = '#10b981';
              ctx.lineWidth = 5;
              ctx.stroke();
              
              // Inner bright line
              ctx.shadowBlur = 0;
              ctx.strokeStyle = '#34d399';
              ctx.lineWidth = 3;
              ctx.stroke();
            } else {
              ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          } else {
            // Default edge styling with subtle glow
            ctx.shadowColor = isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(148, 163, 184, 0.3)';
            ctx.shadowBlur = 2;
            ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.shadowBlur = 0;

          // Draw arrowheads for better direction indication
          const angle = Math.atan2(dy, dx);
          const arrowLength = 10;
          const arrowAngle = Math.PI / 6;
          
          // Position arrow at the end of the edge line
          const arrowX = endX;
          const arrowY = endY;
          
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - arrowLength * Math.cos(angle - arrowAngle),
            arrowY - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - arrowLength * Math.cos(angle + arrowAngle),
            arrowY - arrowLength * Math.sin(angle + arrowAngle)
          );
          
          if (step.foundTarget && step.targetPath) {
            const isPathEdge = step.targetPath.some((node, i) => 
              i < step.targetPath!.length - 1 && 
              ((step.targetPath![i] === edge.from && step.targetPath![i + 1] === edge.to) ||
               (step.targetPath![i] === edge.to && step.targetPath![i + 1] === edge.from))
            );
            ctx.strokeStyle = isPathEdge ? '#10b981' : (isDarkMode ? '#64748b' : '#94a3b8');
          } else {
            ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
          }
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw nodes with enhanced styling
      iddfsGraph.nodes.forEach(node => {
        // Node shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        
        // Outer ring for active nodes
        if (step.activeNodes.includes(node.id) && node.level <= step.depth && !step.foundTarget) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
          ctx.fillStyle = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)';
          ctx.fill();
          
          // Pulsing animation ring
          const pulseRadius = 22 + Math.sin(Date.now() / 300) * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
          ctx.strokeStyle = isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(168, 85, 247, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Main node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI);
        
        // Enhanced node colors with gradients
        let gradient;
        if (step.foundTarget && step.targetPath?.includes(node.id)) {
          // Solution path nodes - green gradient
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          gradient.addColorStop(0, '#34d399');
          gradient.addColorStop(1, '#059669');
          ctx.fillStyle = gradient;
        } else if (step.activeNodes.includes(node.id) && node.level <= step.depth) {
          // Active nodes - purple gradient
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          if (isDarkMode) {
            gradient.addColorStop(0, '#a78bfa');
            gradient.addColorStop(1, '#7c3aed');
          } else {
            gradient.addColorStop(0, '#c4b5fd');
            gradient.addColorStop(1, '#8b5cf6');
          }
          ctx.fillStyle = gradient;
        } else if (step.visitedNodes.includes(node.id)) {
          // Visited nodes - gray gradient
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          if (isDarkMode) {
            gradient.addColorStop(0, '#94a3b8');
            gradient.addColorStop(1, '#475569');
          } else {
            gradient.addColorStop(0, '#e2e8f0');
            gradient.addColorStop(1, '#94a3b8');
          }
          ctx.fillStyle = gradient;
        } else {
          // Unvisited nodes - light gradient
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          if (isDarkMode) {
            gradient.addColorStop(0, '#475569');
            gradient.addColorStop(1, '#1e293b');
          } else {
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#f1f5f9');
          }
          ctx.fillStyle = gradient;
        }
        
        ctx.fill();
        
        // Node border with enhanced styling
        ctx.strokeStyle = isDarkMode ? '#334155' : '#64748b';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Node label with better typography
        ctx.fillStyle = isDarkMode ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 16px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 1;
        ctx.fillText(node.id, node.x, node.y);
        ctx.shadowBlur = 0;

        // Enhanced target node indicator
        if (node.id === 'G') {
          // Target badge background
          const badgeY = node.y + 26;
          ctx.fillStyle = isDarkMode ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.95)';
          ctx.beginPath();
          
          // Rounded rectangle fallback
          const x = node.x - 20;
          const y = badgeY - 6;
          const width = 40;
          const height = 12;
          const radius = 6;
          
          if (ctx.roundRect) {
            ctx.roundRect(x, y, width, height, radius);
          } else {
            // Manual rounded rectangle
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
          }
          
          ctx.fill();
          
          // Target badge border
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Target text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px Inter, Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('TARGET', node.x, badgeY);
        }
      });
    }, [step, isDarkMode]);

    useEffect(() => {
      let animationId: number;
      
      const animate = () => {
        drawGraph();
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [drawGraph]);

    const nextStep = () => {
      const steps = getAnimationSteps();
      setIDDFSAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.min((prev[questionId] || 0) + 1, steps.length - 1)
      }));
    };

    const prevStep = () => {
      setIDDFSAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.max((prev[questionId] || 0) - 1, 0)
      }));
    };

    const resetAnimation = () => {
      setIDDFSAnimationStep(prev => ({
        ...prev,
        [questionId]: 0
      }));
    };

    return (
      <div className={`p-6 rounded-xl border shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            🔍 Iterative Deepening DFS Visualization
          </h4>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Watch how IDDFS gradually increases depth limit to find the shortest path
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-xl`}>
            <canvas
              ref={canvasRef}
              width={390}
              height={270}
              className={`rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
            />
          </div>
        </div>

        <div className={`text-sm p-4 rounded-lg mb-4 text-center border ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 text-indigo-200 border-indigo-800/50' : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 border-indigo-200'}`}>
          <div className="font-bold text-base mb-1">Depth Limit: {step.depth}</div>
          <div className="text-sm opacity-90 mb-2">{step.description}</div>
          <div className="text-xs font-mono bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
            {step.complexity}
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button
            onClick={resetAnimation}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === getAnimationSteps().length - 1}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            Next
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Complexity Analysis */}
        <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h5 className="font-semibold mb-2 text-center">📊 Complexity Analysis</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h6 className="font-medium text-blue-600 dark:text-blue-400">Time Complexity:</h6>
              <p className="text-xs mt-1">O(b^d) where b = branching factor, d = depth</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Same as BFS but with higher constant factor</p>
            </div>
            <div>
              <h6 className="font-medium text-green-600 dark:text-green-400">Space Complexity:</h6>
              <p className="text-xs mt-1">O(d) - only stores current path</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Much better than BFS's O(b^d)</p>
            </div>
          </div>
          <div className="mt-3 text-xs">
            <h6 className="font-medium text-purple-600 dark:text-purple-400">Key Insight:</h6>
            <p className="text-gray-600 dark:text-gray-400">
              Most work is done at the deepest level, so revisiting upper levels has minimal overhead.
              IDDFS combines DFS's space efficiency with BFS's optimality guarantee.
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Current Depth Active</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Solution Path</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Previously Visited</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Bidirectional BFS Visualization Component
  const BidirectionalBFSVisualization = ({ questionId }: { questionId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Define graph structure for Bidirectional BFS demonstration
    const bidirectionalGraph = {
      nodes: [
        { id: 'S', x: 60, y: 135, color: 'white', level: 0, direction: 'forward' },
        { id: 'A', x: 140, y: 80, color: 'white', level: 1, direction: null },
        { id: 'B', x: 140, y: 190, color: 'white', level: 1, direction: null },
        { id: 'C', x: 220, y: 80, color: 'white', level: 2, direction: null },
        { id: 'D', x: 220, y: 135, color: 'white', level: 2, direction: null },
        { id: 'E', x: 220, y: 190, color: 'white', level: 2, direction: null },
        { id: 'F', x: 300, y: 80, color: 'white', level: 3, direction: null },
        { id: 'G', x: 300, y: 190, color: 'white', level: 3, direction: null },
        { id: 'T', x: 380, y: 135, color: 'white', level: 0, direction: 'backward' }
      ],
      edges: [
        { from: 'S', to: 'A' },
        { from: 'S', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'A', to: 'D' },
        { from: 'B', to: 'D' },
        { from: 'B', to: 'E' },
        { from: 'C', to: 'F' },
        { from: 'D', to: 'F' },
        { from: 'D', to: 'G' },
        { from: 'E', to: 'G' },
        { from: 'F', to: 'T' },
        { from: 'G', to: 'T' }
      ]
    };

    const currentStep = bidirectionalBFSAnimationStep[questionId] || 0;

    // Define animation steps for bidirectional BFS
    const getAnimationSteps = () => {
      const steps = [];
      
      // Step 0: Initialize
      steps.push({
        step: 0,
        description: "Initialize: Start from S (forward) and T (backward)",
        forwardVisited: ['S'],
        backwardVisited: ['T'],
        forwardFrontier: ['S'],
        backwardFrontier: ['T'],
        meetingPoint: null,
        pathFound: false,
        forwardLevel: 0,
        backwardLevel: 0
      });

      // Step 1: First expansion from both sides
      steps.push({
        step: 1,
        description: "Level 1: Expand S → {A,B}, Expand T → {F,G}",
        forwardVisited: ['S', 'A', 'B'],
        backwardVisited: ['T', 'F', 'G'],
        forwardFrontier: ['A', 'B'],
        backwardFrontier: ['F', 'G'],
        meetingPoint: null,
        pathFound: false,
        forwardLevel: 1,
        backwardLevel: 1
      });

      // Step 2: Second expansion
      steps.push({
        step: 2,
        description: "Level 2: Expand A,B → {C,D,E}, Expand F,G → {D} - MEETING!",
        forwardVisited: ['S', 'A', 'B', 'C', 'D', 'E'],
        backwardVisited: ['T', 'F', 'G', 'D'],
        forwardFrontier: ['C', 'D', 'E'],
        backwardFrontier: ['D'],
        meetingPoint: 'D',
        pathFound: true,
        forwardLevel: 2,
        backwardLevel: 2,
        pathNodes: ['S', 'A', 'D', 'G', 'T']
      });

      return steps;
    };

    const steps = getAnimationSteps();
    const step = steps[Math.min(currentStep, steps.length - 1)];

    interface BidirectionalBFSAnimationStep {
      step: number;
      description: string;
      forwardVisited: string[];
      backwardVisited: string[];
      forwardFrontier: string[];
      backwardFrontier: string[];
      meetingPoint: string | null;
      pathFound: boolean;
      forwardLevel: number;
      backwardLevel: number;
      pathNodes?: string[];
    }

    const drawGraph = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw direction indicators
      ctx.fillStyle = isDarkMode ? '#3b82f6' : '#2563eb';
      ctx.font = 'bold 12px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Forward BFS →', 100, 30);
      
      ctx.fillStyle = isDarkMode ? '#ef4444' : '#dc2626';
      ctx.fillText('← Backward BFS', 340, 30);

      // Draw edges
      bidirectionalGraph.edges.forEach(edge => {
        const fromNode = bidirectionalGraph.nodes.find(n => n.id === edge.from);
        const toNode = bidirectionalGraph.nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const nodeRadius = 16;
          
          const startX = fromNode.x + (dx / distance) * nodeRadius;
          const startY = fromNode.y + (dy / distance) * nodeRadius;
          const endX = toNode.x - (dx / distance) * nodeRadius;
          const endY = toNode.y - (dy / distance) * nodeRadius;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          
          // Highlight path edges if path found
          if (step.pathFound && step.pathNodes) {
            const isPathEdge = step.pathNodes.some((node, i) => 
              i < step.pathNodes!.length - 1 && 
              ((step.pathNodes![i] === edge.from && step.pathNodes![i + 1] === edge.to) ||
               (step.pathNodes![i] === edge.to && step.pathNodes![i + 1] === edge.from))
            );
            
            if (isPathEdge) {
              ctx.shadowColor = '#10b981';
              ctx.shadowBlur = 6;
              ctx.strokeStyle = '#10b981';
              ctx.lineWidth = 4;
              ctx.stroke();
              
              ctx.shadowBlur = 0;
              ctx.strokeStyle = '#34d399';
              ctx.lineWidth = 2;
              ctx.stroke();
            } else {
              ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          } else {
            ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.shadowBlur = 0;

          // Draw arrows
          const angle = Math.atan2(dy, dx);
          const arrowLength = 8;
          const arrowAngle = Math.PI / 6;
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle - arrowAngle),
            endY - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle + arrowAngle),
            endY - arrowLength * Math.sin(angle + arrowAngle)
          );
          
          if (step.pathFound && step.pathNodes) {
            const isPathEdge = step.pathNodes.some((node, i) => 
              i < step.pathNodes!.length - 1 && 
              ((step.pathNodes![i] === edge.from && step.pathNodes![i + 1] === edge.to) ||
               (step.pathNodes![i] === edge.to && step.pathNodes![i + 1] === edge.from))
            );
            ctx.strokeStyle = isPathEdge ? '#10b981' : (isDarkMode ? '#64748b' : '#94a3b8');
          } else {
            ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
          }
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw nodes
      bidirectionalGraph.nodes.forEach(node => {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;
        
        // Pulsing effect for current frontiers
        if (step.forwardFrontier.includes(node.id) || step.backwardFrontier.includes(node.id)) {
          const pulseRadius = 20 + Math.sin(Date.now() / 200) * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
          const pulseColor = step.forwardFrontier.includes(node.id) ? 
            (isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.3)') :
            (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.3)');
          ctx.strokeStyle = pulseColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI);
        
        // Node colors based on search state
        let gradient;
        if (step.meetingPoint === node.id) {
          // Meeting point - special gradient
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          gradient.addColorStop(0, '#fbbf24');
          gradient.addColorStop(1, '#f59e0b');
          ctx.fillStyle = gradient;
        } else if (step.pathFound && step.pathNodes?.includes(node.id)) {
          // Solution path nodes
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          gradient.addColorStop(0, '#34d399');
          gradient.addColorStop(1, '#059669');
          ctx.fillStyle = gradient;
        } else if (step.forwardVisited.includes(node.id)) {
          // Forward search nodes
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          if (isDarkMode) {
            gradient.addColorStop(0, '#60a5fa');
            gradient.addColorStop(1, '#2563eb');
          } else {
            gradient.addColorStop(0, '#93c5fd');
            gradient.addColorStop(1, '#3b82f6');
          }
          ctx.fillStyle = gradient;
        } else if (step.backwardVisited.includes(node.id)) {
          // Backward search nodes
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          if (isDarkMode) {
            gradient.addColorStop(0, '#f87171');
            gradient.addColorStop(1, '#dc2626');
          } else {
            gradient.addColorStop(0, '#fca5a5');
            gradient.addColorStop(1, '#ef4444');
          }
          ctx.fillStyle = gradient;
        } else {
          // Unvisited nodes
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          if (isDarkMode) {
            gradient.addColorStop(0, '#475569');
            gradient.addColorStop(1, '#1e293b');
          } else {
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#f1f5f9');
          }
          ctx.fillStyle = gradient;
        }
        
        ctx.fill();
        
        ctx.strokeStyle = isDarkMode ? '#334155' : '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Node labels
        ctx.fillStyle = isDarkMode ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 14px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 1;
        ctx.fillText(node.id, node.x, node.y);
        ctx.shadowBlur = 0;

        // Special labels for start and target
        if (node.id === 'S') {
          ctx.fillStyle = isDarkMode ? '#3b82f6' : '#2563eb';
          ctx.font = 'bold 8px Inter, Arial, sans-serif';
          ctx.fillText('START', node.x, node.y + 24);
        } else if (node.id === 'T') {
          ctx.fillStyle = isDarkMode ? '#ef4444' : '#dc2626';
          ctx.font = 'bold 8px Inter, Arial, sans-serif';
          ctx.fillText('TARGET', node.x, node.y + 24);
        }
      });
    }, [step, isDarkMode]);

    useEffect(() => {
      let animationId: number;
      
      const animate = () => {
        drawGraph();
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [drawGraph]);

    const nextStep = () => {
      const steps = getAnimationSteps();
      setBidirectionalBFSAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.min((prev[questionId] || 0) + 1, steps.length - 1)
      }));
    };

    const prevStep = () => {
      setBidirectionalBFSAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.max((prev[questionId] || 0) - 1, 0)
      }));
    };

    const resetAnimation = () => {
      setBidirectionalBFSAnimationStep(prev => ({
        ...prev,
        [questionId]: 0
      }));
    };

    return (
      <div className={`p-6 rounded-xl border shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400">
            🔄 Bidirectional BFS Visualization
          </h4>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Watch how two searches meet in the middle to find the shortest path
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-xl`}>
            <canvas
              ref={canvasRef}
              width={440}
              height={270}
              className={`rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
            />
          </div>
        </div>

        <div className={`text-sm p-4 rounded-lg mb-4 text-center border ${isDarkMode ? 'bg-gradient-to-r from-blue-900/30 to-red-900/30 text-blue-200 border-blue-800/50' : 'bg-gradient-to-r from-blue-50 to-red-50 text-blue-800 border-blue-200'}`}>
          <div className="font-bold text-base mb-1">Step {step.step}: {step.pathFound ? 'Path Found!' : `Level ${step.forwardLevel}`}</div>
          <div className="text-sm opacity-90 mb-2">{step.description}</div>
          {step.meetingPoint && (
            <div className="text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">
              Meeting Point: {step.meetingPoint} | Path Length: {step.forwardLevel + step.backwardLevel}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button
            onClick={resetAnimation}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 bg-gradient-to-r from-blue-500 to-red-500 text-white hover:from-blue-600 hover:to-red-600 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === getAnimationSteps().length - 1}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            Next
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Algorithm Analysis */}
        <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h5 className="font-semibold mb-2 text-center">📊 Bidirectional BFS Analysis</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h6 className="font-medium text-blue-600 dark:text-blue-400">Search Efficiency:</h6>
              <p className="text-xs mt-1">O(b^(d/2)) vs O(b^d) for regular BFS</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Exponential improvement in search space</p>
            </div>
            <div>
              <h6 className="font-medium text-red-600 dark:text-red-400">Termination Condition:</h6>
              <p className="text-xs mt-1">When frontiers meet (neighbor already visited)</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Missing: if neighbor in visited_opposite</p>
            </div>
          </div>
          <div className="mt-3 text-xs">
            <h6 className="font-medium text-green-600 dark:text-green-400">Key Insight:</h6>
            <p className="text-gray-600 dark:text-gray-400">
              Path found when expanding node discovers a neighbor already visited by opposite search.
              Total distance = current_level + visited_opposite[neighbor].
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Forward Search</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Backward Search</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Meeting Point</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Solution Path</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Strongly Connected Components Visualization Component
  const SCCVisualization = ({ questionId, type }: { questionId: number, type: 'strongly-connected' | 'not-connected' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Define graph structures for SCC demonstration
    const stronglyConnectedGraph = {
      nodes: [
        { id: 'A', x: 200, y: 60, color: 'white' },
        { id: 'B', x: 280, y: 120, color: 'white' },
        { id: 'C', x: 280, y: 200, color: 'white' },
        { id: 'D', x: 200, y: 260, color: 'white' },
        { id: 'E', x: 120, y: 200, color: 'white' },
        { id: 'F', x: 120, y: 120, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'F' },
        { from: 'F', to: 'A' }
      ],
      transposeEdges: [
        { from: 'B', to: 'A' },
        { from: 'C', to: 'B' },
        { from: 'D', to: 'C' },
        { from: 'E', to: 'D' },
        { from: 'F', to: 'E' },
        { from: 'A', to: 'F' }
      ]
    };

    const notConnectedGraph = {
      nodes: [
        { id: 'A', x: 120, y: 90, color: 'white' },
        { id: 'B', x: 200, y: 90, color: 'white' },
        { id: 'C', x: 280, y: 90, color: 'white' },
        { id: 'D', x: 120, y: 190, color: 'white' },
        { id: 'E', x: 200, y: 190, color: 'white' },
        { id: 'F', x: 280, y: 190, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' },  // SCC: A-B-C
        { from: 'A', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'D' },  // SCC: D-E
        { from: 'B', to: 'F' },
        { from: 'F', to: 'F' }   // SCC: F (self-loop)
      ],
      transposeEdges: [
        { from: 'B', to: 'A' },
        { from: 'C', to: 'B' },
        { from: 'A', to: 'C' },  // Transpose SCC: A-B-C
        { from: 'D', to: 'A' },
        { from: 'E', to: 'D' },
        { from: 'D', to: 'E' },  // Transpose SCC: D-E
        { from: 'F', to: 'B' },
        { from: 'F', to: 'F' }   // Transpose SCC: F (self-loop)
      ]
    };

    const sccGraph = type === 'strongly-connected' ? stronglyConnectedGraph : notConnectedGraph;

    const currentStep = sccAnimationStep[questionId] || 0;

    interface SCCAnimationStep {
      step: number;
      description: string;
      phase: string;
      visitedFromA: string[];
      reachableFromA: boolean;
      showTranspose: boolean;
      isStronglyConnected: boolean | null;
      highlightNodes: string[];
      sccs?: string[][];
    }

    // Define animation steps for SCC checking
    const getAnimationSteps = () => {
      const steps: SCCAnimationStep[] = [];
      
      if (type === 'strongly-connected') {
        // Strongly connected graph steps
        steps.push({
          step: 0,
          description: "Strongly connected graph - checking connectivity from A",
          phase: "original",
          visitedFromA: [],
          reachableFromA: false,
          showTranspose: false,
          isStronglyConnected: null,
          highlightNodes: []
        });

        steps.push({
          step: 1,
          description: "DFS from A in original: A→B→C→D→E→F (reaches all 6 nodes)",
          phase: "dfs-original",
          visitedFromA: ['A', 'B', 'C', 'D', 'E', 'F'],
          reachableFromA: true,
          showTranspose: false,
          isStronglyConnected: null,
          highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F']
        });

        steps.push({
          step: 2,
          description: "Create transpose graph (reverse all edges)",
          phase: "transpose",
          visitedFromA: ['A', 'B', 'C', 'D', 'E', 'F'],
          reachableFromA: true,
          showTranspose: true,
          isStronglyConnected: null,
          highlightNodes: []
        });

        steps.push({
          step: 3,
          description: "DFS from A in transpose: A→F→E→D→C→B (reaches all 6 nodes)",
          phase: "dfs-transpose",
          visitedFromA: ['A', 'B', 'C', 'D', 'E', 'F'],
          reachableFromA: true,
          showTranspose: true,
          isStronglyConnected: true,
          highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F']
        });

        steps.push({
          step: 4,
          description: "STRONGLY CONNECTED: Can reach all nodes from A in both directions",
          phase: "conclusion",
          visitedFromA: ['A', 'B', 'C', 'D', 'E', 'F'],
          reachableFromA: true,
          showTranspose: false,
          isStronglyConnected: true,
          highlightNodes: [],
          sccs: [['A', 'B', 'C', 'D', 'E', 'F']]
        });
      } else {
        // Not connected graph steps
        steps.push({
          step: 0,
          description: "Directed graph with multiple SCCs - checking connectivity from A",
          phase: "original",
          visitedFromA: [],
          reachableFromA: false,
          showTranspose: false,
          isStronglyConnected: null,
          highlightNodes: []
        });

        steps.push({
          step: 1,
          description: "DFS from A in original: A→B→C (can reach 3/6 nodes)",
          phase: "dfs-original",
          visitedFromA: ['A', 'B', 'C'],
          reachableFromA: false,
          showTranspose: false,
          isStronglyConnected: null,
          highlightNodes: ['A', 'B', 'C']
        });

        steps.push({
          step: 2,
          description: "Create transpose graph (reverse all edges)",
          phase: "transpose",
          visitedFromA: ['A', 'B', 'C'],
          reachableFromA: false,
          showTranspose: true,
          isStronglyConnected: null,
          highlightNodes: []
        });

        steps.push({
          step: 3,
          description: "DFS from A in transpose: A→C→B (can reach 3/6 nodes)",
          phase: "dfs-transpose",
          visitedFromA: ['A', 'B', 'C'],
          reachableFromA: false,
          showTranspose: true,
          isStronglyConnected: false,
          highlightNodes: ['A', 'B', 'C']
        });

        steps.push({
          step: 4,
          description: "NOT strongly connected: Can't reach all nodes from A in both directions",
          phase: "conclusion",
          visitedFromA: ['A', 'B', 'C'],
          reachableFromA: false,
          showTranspose: false,
          isStronglyConnected: false,
          highlightNodes: [],
          sccs: [['A', 'B', 'C'], ['D', 'E'], ['F']]
        });
      }

      return steps;
    };

    const steps = getAnimationSteps();
    const step = steps[Math.min(currentStep, steps.length - 1)];

    const drawGraph = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw title
      ctx.fillStyle = isDarkMode ? '#e2e8f0' : '#1e293b';
      ctx.font = 'bold 14px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(step.showTranspose ? 'Transpose Graph G^T' : 'Original Graph G', 200, 25);

      // Choose edges to draw
      const edgesToDraw = step.showTranspose ? sccGraph.transposeEdges : sccGraph.edges;

      // Draw edges
      edgesToDraw.forEach(edge => {
        const fromNode = sccGraph.nodes.find(n => n.id === edge.from);
        const toNode = sccGraph.nodes.find(n => n.id === edge.to);
        
        if (fromNode && toNode) {
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const nodeRadius = 16;
          
          // Handle self-loops
          if (edge.from === edge.to) {
            // Draw self-loop as a neat circle
            const loopRadius = 12;
            const loopCenterX = fromNode.x + 18;
            const loopCenterY = fromNode.y - 18;
            
            ctx.beginPath();
            ctx.arc(loopCenterX, loopCenterY, loopRadius, 0, 2 * Math.PI);
            
            // Color self-loop based on phase
            if (step.phase === 'dfs-original' || step.phase === 'dfs-transpose') {
              const isTraversedEdge = step.visitedFromA.includes(edge.from);
              if (isTraversedEdge) {
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 3;
              } else {
                ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
                ctx.lineWidth = 2;
              }
            } else {
              ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
              ctx.lineWidth = 2;
            }
            ctx.stroke();
            
            // Arrow for self-loop
            const arrowX = loopCenterX + loopRadius * Math.cos(Math.PI / 4);
            const arrowY = loopCenterY + loopRadius * Math.sin(Math.PI / 4);
            const arrowLength = 6;
            const arrowAngle = Math.PI / 6;
            const tangentAngle = Math.PI / 4 + Math.PI / 2; // Perpendicular to radius
            
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
              arrowX - arrowLength * Math.cos(tangentAngle - arrowAngle),
              arrowY - arrowLength * Math.sin(tangentAngle - arrowAngle)
            );
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(
              arrowX - arrowLength * Math.cos(tangentAngle + arrowAngle),
              arrowY - arrowLength * Math.sin(tangentAngle + arrowAngle)
            );
            ctx.stroke();
            return;
          }
          
          const startX = fromNode.x + (dx / distance) * nodeRadius;
          const startY = fromNode.y + (dy / distance) * nodeRadius;
          const endX = toNode.x - (dx / distance) * nodeRadius;
          const endY = toNode.y - (dy / distance) * nodeRadius;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          
          // Color edges based on phase
          if (step.phase === 'dfs-original' || step.phase === 'dfs-transpose') {
            const isTraversedEdge = step.visitedFromA.includes(edge.from) && step.visitedFromA.includes(edge.to);
            if (isTraversedEdge) {
              ctx.strokeStyle = '#10b981';
              ctx.lineWidth = 3;
            } else {
              ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
              ctx.lineWidth = 2;
            }
          } else {
            ctx.strokeStyle = isDarkMode ? '#64748b' : '#94a3b8';
            ctx.lineWidth = 2;
          }
          
          ctx.stroke();

          // Draw arrows
          const angle = Math.atan2(dy, dx);
          const arrowLength = 8;
          const arrowAngle = Math.PI / 6;
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle - arrowAngle),
            endY - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle + arrowAngle),
            endY - arrowLength * Math.sin(angle + arrowAngle)
          );
          ctx.stroke();
        }
      });

      // Draw nodes
      sccGraph.nodes.forEach(node => {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 1;
        
        // Pulsing effect for highlighted nodes
        if (step.highlightNodes.includes(node.id)) {
          const pulseRadius = 20 + Math.sin(Date.now() / 200) * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
          ctx.strokeStyle = isDarkMode ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI);
        
        // Node colors based on state
        let gradient;
        if (step.sccs && step.phase === 'conclusion') {
          // Color nodes by SCC
          const sccIndex = step.sccs.findIndex(scc => scc.includes(node.id));
          const sccColors = [
            ['#3b82f6', '#1d4ed8'], // Blue SCC
            ['#ef4444', '#dc2626'], // Red SCC
            ['#8b5cf6', '#7c3aed']  // Purple SCC
          ];
          
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          gradient.addColorStop(0, sccColors[sccIndex][0]);
          gradient.addColorStop(1, sccColors[sccIndex][1]);
          ctx.fillStyle = gradient;
        } else if (step.visitedFromA.includes(node.id)) {
          // Visited nodes
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          gradient.addColorStop(0, '#34d399');
          gradient.addColorStop(1, '#059669');
          ctx.fillStyle = gradient;
        } else {
          // Unvisited nodes
          gradient = ctx.createRadialGradient(node.x - 4, node.y - 4, 0, node.x, node.y, 16);
          if (isDarkMode) {
            gradient.addColorStop(0, '#475569');
            gradient.addColorStop(1, '#1e293b');
          } else {
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#f1f5f9');
          }
          ctx.fillStyle = gradient;
        }
        
        ctx.fill();
        
        ctx.strokeStyle = isDarkMode ? '#334155' : '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Node labels
        ctx.fillStyle = isDarkMode ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 14px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 1;
        ctx.fillText(node.id, node.x, node.y);
        ctx.shadowBlur = 0;

        // Special marking for starting node A
        if (node.id === 'A') {
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 8px Inter, Arial, sans-serif';
          ctx.fillText('START', node.x, node.y + 24);
        }
      });

      // Draw SCC labels in conclusion phase
      if (step.sccs && step.phase === 'conclusion') {
        ctx.font = 'bold 12px Inter, Arial, sans-serif';
        ctx.textAlign = 'left';
        
        step.sccs.forEach((scc, index) => {
          const colors = ['#3b82f6', '#ef4444', '#8b5cf6'];
          ctx.fillStyle = colors[index];
          ctx.fillText(`SCC ${index + 1}: {${scc.join(', ')}}`, 20, 240 + index * 20);
        });
      }
    }, [step, isDarkMode]);

    useEffect(() => {
      let animationId: number;
      
      const animate = () => {
        drawGraph();
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [drawGraph]);

    const nextStep = () => {
      const steps = getAnimationSteps();
      setSCCAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.min((prev[questionId] || 0) + 1, steps.length - 1)
      }));
    };

    const prevStep = () => {
      setSCCAnimationStep(prev => ({
        ...prev,
        [questionId]: Math.max((prev[questionId] || 0) - 1, 0)
      }));
    };

    const resetAnimation = () => {
      setSCCAnimationStep(prev => ({
        ...prev,
        [questionId]: 0
      }));
    };

    return (
      <div className={`p-6 rounded-xl border shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}>
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-purple-600 dark:text-purple-400">
            🔗 {type === 'strongly-connected' ? 'Strongly Connected Graph' : 'Multiple SCCs Graph'}
          </h4>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {type === 'strongly-connected' 
              ? 'Example where all nodes can reach each other'
              : 'Example with separate strongly connected components'
            }
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-xl`}>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className={`rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
            />
          </div>
        </div>

        <div className={`text-sm p-4 rounded-lg mb-4 text-center border ${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 text-purple-200 border-purple-800/50' : 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border-purple-200'}`}>
          <div className="font-bold text-base mb-1">Step {step.step}: {step.phase}</div>
          <div className="text-sm opacity-90 mb-2">{step.description}</div>
          {step.isStronglyConnected !== null && (
            <div className={`text-xs font-mono px-2 py-1 rounded ${
              step.isStronglyConnected 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              Result: {step.isStronglyConnected ? 'STRONGLY CONNECTED' : 'NOT STRONGLY CONNECTED'}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <button
            onClick={resetAnimation}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === getAnimationSteps().length - 1}
            className="flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800 dark:text-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-sm hover:shadow-md disabled:hover:shadow-sm"
          >
            Next
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Algorithm Analysis */}
        <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h5 className="font-semibold mb-2 text-center">📊 Strong Connectivity Analysis</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h6 className="font-medium text-purple-600 dark:text-purple-400">Algorithm Steps:</h6>
              <p className="text-xs mt-1">1. DFS from vertex v in original graph G</p>
              <p className="text-xs">2. DFS from vertex v in transpose graph G^T</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">If both reach all vertices → strongly connected</p>
            </div>
            <div>
              <h6 className="font-medium text-indigo-600 dark:text-indigo-400">Time Complexity:</h6>
              <p className="text-xs mt-1">O(V + E) for each DFS</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total: O(V + E) - linear time</p>
            </div>
          </div>
          <div className="mt-3 text-xs">
            <h6 className="font-medium text-green-600 dark:text-green-400">Key Insight:</h6>
            <p className="text-gray-600 dark:text-gray-400">
              A directed graph is strongly connected if every vertex can reach every other vertex.
              Testing from one vertex in both G and G^T is sufficient to verify this property.
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">Reachable from A</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">SCC 1</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">SCC 2</span>
            </span>
            <span className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 shadow-sm"></div>
              <span className="font-medium">SCC 3</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Parallel BFS Visualization Component
  interface ParallelBFSAnimationStep {
    description: string;
    level: number;
    threads: {
      id: number;
      nodes: string[];
      color: string;
      status: 'idle' | 'processing' | 'done';
    }[];
    visited: string[];
    nextLevel: string[];
    complexity: string;
  }

  const ParallelBFSVisualization = ({ questionId }: { questionId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    
    // Define a larger graph for parallel BFS demonstration
    const graph = {
      nodes: [
        { id: 'S', x: 225, y: 50, color: 'white' },   // Start node
        { id: 'A', x: 150, y: 120, color: 'white' },
        { id: 'B', x: 225, y: 120, color: 'white' },
        { id: 'C', x: 300, y: 120, color: 'white' },
        { id: 'D', x: 100, y: 190, color: 'white' },
        { id: 'E', x: 175, y: 190, color: 'white' },
        { id: 'F', x: 250, y: 190, color: 'white' },
        { id: 'G', x: 325, y: 190, color: 'white' },
        { id: 'H', x: 150, y: 260, color: 'white' },
        { id: 'I', x: 225, y: 260, color: 'white' },
        { id: 'J', x: 300, y: 260, color: 'white' }
      ],
      edges: [
        { from: 'S', to: 'A' }, { from: 'S', to: 'B' }, { from: 'S', to: 'C' },
        { from: 'A', to: 'D' }, { from: 'A', to: 'E' },
        { from: 'B', to: 'E' }, { from: 'B', to: 'F' },
        { from: 'C', to: 'F' }, { from: 'C', to: 'G' },
        { from: 'D', to: 'H' }, { from: 'E', to: 'H' }, { from: 'E', to: 'I' },
        { from: 'F', to: 'I' }, { from: 'F', to: 'J' }, { from: 'G', to: 'J' }
      ]
    };

    const getAnimationSteps = (): ParallelBFSAnimationStep[] => [
      {
        description: "Level 0: Start with source node S. Single thread initializes.",
        level: 0,
        threads: [
          { id: 1, nodes: ['S'], color: '#3b82f6', status: 'processing' },
          { id: 2, nodes: [], color: '#10b981', status: 'idle' },
          { id: 3, nodes: [], color: '#f59e0b', status: 'idle' }
        ],
        visited: ['S'],
        nextLevel: [],
        complexity: "O(1) - Single node initialization"
      },
      {
        description: "Level 1: Distribute neighbors {A, B, C} across 3 threads in parallel.",
        level: 1,
        threads: [
          { id: 1, nodes: ['A'], color: '#3b82f6', status: 'processing' },
          { id: 2, nodes: ['B'], color: '#10b981', status: 'processing' },
          { id: 3, nodes: ['C'], color: '#f59e0b', status: 'processing' }
        ],
        visited: ['S', 'A', 'B', 'C'],
        nextLevel: ['D', 'E', 'F', 'G'],
        complexity: "O(|V₁|/p) where |V₁|=3, p=3 threads → O(1)"
      },
      {
        description: "Level 2: Process {D, E, F, G} - Thread synchronization and load balancing.",
        level: 2,
        threads: [
          { id: 1, nodes: ['D', 'E'], color: '#3b82f6', status: 'processing' },
          { id: 2, nodes: ['F'], color: '#10b981', status: 'processing' },
          { id: 3, nodes: ['G'], color: '#f59e0b', status: 'processing' }
        ],
        visited: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
        nextLevel: ['H', 'I', 'J'],
        complexity: "O(|V₂|/p) where |V₂|=4, p=3 threads → O(2)"
      },
      {
        description: "Level 3: Final level {H, I, J} processed in parallel. Threads finish.",
        level: 3,
        threads: [
          { id: 1, nodes: ['H'], color: '#3b82f6', status: 'done' },
          { id: 2, nodes: ['I'], color: '#10b981', status: 'done' },
          { id: 3, nodes: ['J'], color: '#f59e0b', status: 'done' }
        ],
        visited: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        nextLevel: [],
        complexity: "O(|V₃|/p) where |V₃|=3, p=3 threads → O(1)"
      },
      {
        description: "Complete: All nodes visited. Total complexity analysis.",
        level: 4,
        threads: [
          { id: 1, nodes: [], color: '#6b7280', status: 'idle' },
          { id: 2, nodes: [], color: '#6b7280', status: 'idle' },
          { id: 3, nodes: [], color: '#6b7280', status: 'idle' }
        ],
        visited: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        nextLevel: [],
        complexity: "Total: O(D × max(|Vᵢ|/p)) where D=depth, p=threads"
      }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const steps = getAnimationSteps();
    const step = steps[currentStep];

    const drawGraph = useCallback((ctx: CanvasRenderingContext2D, step: ParallelBFSAnimationStep) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Clear canvas
      ctx.clearRect(0, 0, 450, 320);
      
      // Draw background
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#f8fafc';
      ctx.fillRect(0, 0, 450, 320);

      // Draw level indicators
      const levels = [
        { y: 50, label: 'Level 0', nodes: ['S'] },
        { y: 120, label: 'Level 1', nodes: ['A', 'B', 'C'] },
        { y: 190, label: 'Level 2', nodes: ['D', 'E', 'F', 'G'] },
        { y: 260, label: 'Level 3', nodes: ['H', 'I', 'J'] }
      ];

      levels.forEach((level, idx) => {
        if (idx <= step.level) {
          ctx.fillStyle = idx === step.level ? '#3b82f6' : '#6b7280';
          ctx.font = '12px Inter, sans-serif';
          ctx.fillText(level.label, 10, level.y + 5);
        }
      });

      // Draw edges
      graph.edges.forEach(edge => {
        const fromNode = graph.nodes.find(n => n.id === edge.from)!;
        const toNode = graph.nodes.find(n => n.id === edge.to)!;
        
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 16;
        
        const startX = fromNode.x + (dx / distance) * nodeRadius;
        const startY = fromNode.y + (dy / distance) * nodeRadius;
        const endX = toNode.x - (dx / distance) * nodeRadius;
        const endY = toNode.y - (dy / distance) * nodeRadius;

        // Edge color based on traversal
        const isTraversed = step.visited.includes(edge.from) && step.visited.includes(edge.to);
        ctx.strokeStyle = isTraversed ? '#10b981' : (isDarkMode ? '#4b5563' : '#d1d5db');
        ctx.lineWidth = isTraversed ? 3 : 2;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow
        if (isTraversed) {
          const arrowLength = 8;
          const arrowAngle = Math.PI / 6;
          const angle = Math.atan2(dy, dx);
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle - arrowAngle),
            endY - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle + arrowAngle),
            endY - arrowLength * Math.sin(angle + arrowAngle)
          );
          ctx.stroke();
        }
      });

      // Draw nodes
      graph.nodes.forEach(node => {
        const isVisited = step.visited.includes(node.id);
        const isInNextLevel = step.nextLevel.includes(node.id);
        
        // Find which thread is processing this node
        const processingThread = step.threads.find(t => t.nodes.includes(node.id));
        
        // Node styling
        const radius = 16;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
        
        if (processingThread && processingThread.status === 'processing') {
          // Thread-specific colors
          gradient.addColorStop(0, processingThread.color + '40');
          gradient.addColorStop(1, processingThread.color);
          
          // Pulsing effect for active processing
          const pulseRadius = radius + Math.sin(Date.now() / 200) * 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
          ctx.fillStyle = processingThread.color + '20';
          ctx.fill();
        } else if (isVisited) {
          gradient.addColorStop(0, '#10b98140');
          gradient.addColorStop(1, '#10b981');
        } else if (isInNextLevel) {
          gradient.addColorStop(0, '#f59e0b40');
          gradient.addColorStop(1, '#f59e0b');
        } else {
          gradient.addColorStop(0, isDarkMode ? '#374151' : '#f3f4f6');
          gradient.addColorStop(1, isDarkMode ? '#1f2937' : '#e5e7eb');
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Node border
        ctx.strokeStyle = processingThread ? processingThread.color : (isVisited ? '#10b981' : (isDarkMode ? '#6b7280' : '#9ca3af'));
        ctx.lineWidth = processingThread ? 3 : 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = isVisited || processingThread ? '#ffffff' : (isDarkMode ? '#f3f4f6' : '#1f2937');
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      });

      // Draw thread status indicators
      step.threads.forEach((thread, idx) => {
        const x = 360;
        const y = 50 + idx * 30;
        
        // Thread indicator
        ctx.fillStyle = thread.color;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Thread label and status
        ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`T${thread.id}: ${thread.status}`, x + 15, y + 4);
        
        // Nodes being processed
        if (thread.nodes.length > 0) {
          ctx.fillStyle = '#6b7280';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(`[${thread.nodes.join(', ')}]`, x + 15, y + 16);
        }
      });
      
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const animate = () => {
        drawGraph(ctx, step);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [step, drawGraph]);

    const nextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const resetAnimation = () => {
      setCurrentStep(0);
    };

    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
            🔄 Parallel BFS Visualization
          </h3>
          <p className="text-blue-600 dark:text-blue-300 text-sm">
            Watch how BFS can be parallelized across multiple threads for better performance
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={450}
            height={320}
            className="rounded-lg bg-white dark:bg-gray-800"
          />
        </div>

        {/* Step Description */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800/30 dark:to-indigo-800/30 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              Level {step.level}
            </span>
          </div>
          <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
            {step.description}
          </p>
          <div className="text-sm text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
            <strong>Complexity:</strong> {step.complexity}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          <button
            onClick={resetAnimation}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            Next
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Algorithm Analysis */}
        <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
            📊 Parallel BFS Complexity Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Sequential BFS:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">O(V + E) time</span>
            </div>
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Parallel BFS:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">O(D × max(|V_i|/p)) time</span>
            </div>
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Speedup:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Up to O(p) for wide graphs</span>
            </div>
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Bottleneck:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Synchronization overhead</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-500 dark:text-indigo-400">
            <strong>Where:</strong> D = graph depth, |V_i| = nodes at level i, p = number of threads
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Thread 1</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Thread 2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Thread 3</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-green-700"></div>
            <span className="text-gray-600 dark:text-gray-400">Visited</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
            <span className="text-gray-600 dark:text-gray-400">Next Level</span>
          </div>
        </div>
      </div>
    );
  };

  // Kruskal's MST Visualization Component
  interface KruskalAnimationStep {
    description: string;
    sortedEdges: { from: string; to: string; weight: number; status: 'pending' | 'considering' | 'added' | 'rejected' }[];
    mstEdges: { from: string; to: string; weight: number }[];
    unionFind: { [key: string]: string };
    currentEdge?: { from: string; to: string; weight: number };
    totalWeight: number;
    complexity: string;
  }

  const KruskalVisualization = ({ questionId }: { questionId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    
    // Define a graph for Kruskal's MST demonstration
    const graph = {
      nodes: [
        { id: 'A', x: 120, y: 80, color: 'white' },
        { id: 'B', x: 240, y: 80, color: 'white' },
        { id: 'C', x: 300, y: 180, color: 'white' },
        { id: 'D', x: 240, y: 280, color: 'white' },
        { id: 'E', x: 120, y: 280, color: 'white' },
        { id: 'F', x: 60, y: 180, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'F', weight: 2 },
        { from: 'B', to: 'C', weight: 3 },
        { from: 'B', to: 'F', weight: 5 },
        { from: 'C', to: 'D', weight: 1 },
        { from: 'C', to: 'E', weight: 6 },
        { from: 'D', to: 'E', weight: 2 },
        { from: 'E', to: 'F', weight: 4 },
        { from: 'F', to: 'B', weight: 5 }
      ]
    };

    const getAnimationSteps = (): KruskalAnimationStep[] => {
      const edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
      const steps: KruskalAnimationStep[] = [];
      
      // Initial step - show sorted edges
      steps.push({
        description: "Step 1: Sort all edges by weight in ascending order",
        sortedEdges: edges.map(e => ({ ...e, status: 'pending' as const })),
        mstEdges: [],
        unionFind: { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F' },
        totalWeight: 0,
        complexity: "O(E log E) - Sorting edges"
      });

      let mstEdges: { from: string; to: string; weight: number }[] = [];
      let unionFind = { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F' };
      let totalWeight = 0;

      const find = (x: string, uf: { [key: string]: string }): string => {
        if (uf[x] !== x) {
          uf[x] = find(uf[x], uf);
        }
        return uf[x];
      };

      const union = (x: string, y: string, uf: { [key: string]: string }) => {
        const rootX = find(x, uf);
        const rootY = find(y, uf);
        if (rootX !== rootY) {
          uf[rootY] = rootX;
          return true;
        }
        return false;
      };

      // Process each edge
      edges.forEach((edge, index) => {
        const currentUF = { ...unionFind };
        const rootFrom = find(edge.from, currentUF);
        const rootTo = find(edge.to, currentUF);
        
        if (rootFrom !== rootTo) {
          // Edge can be added (no cycle)
          union(edge.from, edge.to, unionFind);
          mstEdges.push(edge);
          totalWeight += edge.weight;
          
          steps.push({
            description: `Step ${steps.length + 1}: Consider edge ${edge.from}-${edge.to} (weight ${edge.weight}). Different components - ADD to MST!`,
            sortedEdges: edges.map((e, i) => ({
              ...e,
              status: i < index ? 'added' : i === index ? 'considering' : 'pending'
            })),
            mstEdges: [...mstEdges],
            unionFind: { ...unionFind },
            currentEdge: edge,
            totalWeight,
            complexity: "O(α(V)) - Union-Find operations per edge"
          });
        } else {
          // Edge creates cycle - reject
          steps.push({
            description: `Step ${steps.length + 1}: Consider edge ${edge.from}-${edge.to} (weight ${edge.weight}). Same component - REJECT (creates cycle)!`,
            sortedEdges: edges.map((e, i) => ({
              ...e,
              status: i < index ? (mstEdges.some(mst => mst.from === e.from && mst.to === e.to) ? 'added' : 'rejected') : i === index ? 'rejected' : 'pending'
            })),
            mstEdges: [...mstEdges],
            unionFind: { ...unionFind },
            currentEdge: edge,
            totalWeight,
            complexity: "O(α(V)) - Union-Find cycle detection"
          });
        }
      });

      // Final step
      steps.push({
        description: `Complete! MST found with total weight ${totalWeight}. All nodes connected with minimum cost.`,
        sortedEdges: edges.map(e => ({
          ...e,
          status: mstEdges.some(mst => mst.from === e.from && mst.to === e.to) ? 'added' : 'rejected'
        })),
        mstEdges: [...mstEdges],
        unionFind: { ...unionFind },
        totalWeight,
        complexity: "Total: O(E log E + E⋅α(V)) ≈ O(E log E)"
      });

      return steps;
    };

    const [currentStep, setCurrentStep] = useState(0);
    const steps = getAnimationSteps();
    const step = steps[currentStep];

    const drawGraph = useCallback((ctx: CanvasRenderingContext2D, step: KruskalAnimationStep) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Clear canvas
      ctx.clearRect(0, 0, 450, 360);
      
      // Draw background
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#f8fafc';
      ctx.fillRect(0, 0, 450, 360);

      // Draw all edges first
      graph.edges.forEach(edge => {
        const fromNode = graph.nodes.find(n => n.id === edge.from)!;
        const toNode = graph.nodes.find(n => n.id === edge.to)!;
        
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 18;
        
        const startX = fromNode.x + (dx / distance) * nodeRadius;
        const startY = fromNode.y + (dy / distance) * nodeRadius;
        const endX = toNode.x - (dx / distance) * nodeRadius;
        const endY = toNode.y - (dy / distance) * nodeRadius;

        // Determine edge status
        const isInMST = step.mstEdges.some(mst => 
          (mst.from === edge.from && mst.to === edge.to) || 
          (mst.from === edge.to && mst.to === edge.from)
        );
        const isCurrentEdge = step.currentEdge && 
          ((step.currentEdge.from === edge.from && step.currentEdge.to === edge.to) ||
           (step.currentEdge.from === edge.to && step.currentEdge.to === edge.from));
        
        // Edge styling
        if (isInMST) {
          ctx.strokeStyle = '#10b981'; // Green for MST edges
          ctx.lineWidth = 4;
        } else if (isCurrentEdge) {
          ctx.strokeStyle = '#f59e0b'; // Yellow for current consideration
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = isDarkMode ? '#4b5563' : '#d1d5db';
          ctx.lineWidth = 2;
        }
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw weight label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        // Background for weight
        ctx.fillStyle = isInMST ? '#10b981' : isCurrentEdge ? '#f59e0b' : (isDarkMode ? '#374151' : '#ffffff');
        ctx.beginPath();
        ctx.arc(midX, midY, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Weight text
        ctx.fillStyle = isInMST || isCurrentEdge ? '#ffffff' : (isDarkMode ? '#f3f4f6' : '#1f2937');
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight.toString(), midX, midY);
      });

      // Draw nodes
      graph.nodes.forEach(node => {
        const radius = 18;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
        gradient.addColorStop(0, isDarkMode ? '#4b5563' : '#f3f4f6');
        gradient.addColorStop(1, isDarkMode ? '#1f2937' : '#e5e7eb');

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Node border
        ctx.strokeStyle = isDarkMode ? '#6b7280' : '#9ca3af';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      });

      // Draw edge list on the right
      const listX = 370;
      let listY = 30;
      
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Sorted Edges:', listX, listY);
      
      listY += 25;
      step.sortedEdges.forEach((edge, index) => {
        let color = isDarkMode ? '#9ca3af' : '#6b7280';
        if (edge.status === 'added') color = '#10b981';
        else if (edge.status === 'rejected') color = '#ef4444';
        else if (edge.status === 'considering') color = '#f59e0b';
        
        ctx.fillStyle = color;
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(`${edge.from}-${edge.to}: ${edge.weight}`, listX, listY);
        listY += 18;
      });

      // Draw MST weight
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText(`MST Weight: ${step.totalWeight}`, 20, 340);
      
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const animate = () => {
        drawGraph(ctx, step);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [step, drawGraph]);

    const nextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const resetAnimation = () => {
      setCurrentStep(0);
    };

    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-lg">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            🌳 Kruskal's MST Algorithm Visualization
          </h3>
          <p className="text-green-600 dark:text-green-300 text-sm">
            Watch how Kruskal's algorithm builds the Minimum Spanning Tree using Union-Find
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={450}
            height={360}
            className="rounded-lg bg-white dark:bg-gray-800"
          />
        </div>

        {/* Step Description */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800/30 dark:to-emerald-800/30 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-600 dark:text-green-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              Weight: {step.totalWeight}
            </span>
          </div>
          <p className="text-green-800 dark:text-green-200 font-medium mb-2">
            {step.description}
          </p>
          <div className="text-sm text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded p-2">
            <strong>Complexity:</strong> {step.complexity}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          <button
            onClick={resetAnimation}
            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            Next
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Algorithm Analysis */}
        <div className="mt-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
            📊 Kruskal's Algorithm Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong className="text-emerald-700 dark:text-emerald-300">Time Complexity:</strong>
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">O(E log E + E⋅α(V))</span>
            </div>
            <div>
              <strong className="text-emerald-700 dark:text-emerald-300">Space Complexity:</strong>
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">O(V) for Union-Find</span>
            </div>
            <div>
              <strong className="text-emerald-700 dark:text-emerald-300">Key Insight:</strong>
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">Greedy: Always pick minimum weight edge</span>
            </div>
            <div>
              <strong className="text-emerald-700 dark:text-emerald-300">Cycle Detection:</strong>
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">Union-Find prevents cycles</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-emerald-500 dark:text-emerald-400">
            <strong>Where:</strong> E = edges, V = vertices, α(V) = inverse Ackermann function (nearly constant)
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">MST Edge</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Considering</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Rejected (Cycle)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Pending</span>
          </div>
        </div>
      </div>
    );
  };

  // Borůvka's MST Visualization Component
  interface BoruvkaAnimationStep {
    description: string;
    iteration: number;
    components: { [key: string]: string[] };
    cheapestEdges: { [key: string]: { from: string; to: string; weight: number } | null };
    mstEdges: { from: string; to: string; weight: number }[];
    unionFind: { [key: string]: string };
    highlightEdges: { from: string; to: string; weight: number }[];
    totalWeight: number;
    complexity: string;
  }

  const BoruvkaVisualization = ({ questionId }: { questionId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    
    // Define a graph for Borůvka's MST demonstration
    const graph = {
      nodes: [
        { id: 'A', x: 120, y: 60, color: 'white' },
        { id: 'B', x: 240, y: 60, color: 'white' },
        { id: 'C', x: 320, y: 140, color: 'white' },
        { id: 'D', x: 240, y: 220, color: 'white' },
        { id: 'E', x: 120, y: 220, color: 'white' },
        { id: 'F', x: 40, y: 140, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B', weight: 7 },
        { from: 'A', to: 'F', weight: 5 },
        { from: 'B', to: 'C', weight: 8 },
        { from: 'B', to: 'F', weight: 9 },
        { from: 'B', to: 'E', weight: 7 },
        { from: 'C', to: 'D', weight: 5 },
        { from: 'D', to: 'E', weight: 15 },
        { from: 'E', to: 'F', weight: 6 },
        { from: 'F', to: 'C', weight: 11 }
      ]
    };

    const getAnimationSteps = (): BoruvkaAnimationStep[] => {
      const steps: BoruvkaAnimationStep[] = [];
      const edges = graph.edges;
      
      // Initial step
      steps.push({
        description: "Initialize: Each vertex is its own component. Find cheapest edge for each component.",
        iteration: 0,
        components: { A: ['A'], B: ['B'], C: ['C'], D: ['D'], E: ['E'], F: ['F'] },
        cheapestEdges: {},
        mstEdges: [],
        unionFind: { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F' },
        highlightEdges: [],
        totalWeight: 0,
        complexity: "O(V) - Initialize components"
      });

      let mstEdges: { from: string; to: string; weight: number }[] = [];
      let unionFind = { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F' };
      let totalWeight = 0;
      let iteration = 1;

      const find = (x: string, uf: { [key: string]: string }): string => {
        if (uf[x] !== x) {
          uf[x] = find(uf[x], uf);
        }
        return uf[x];
      };

      const union = (x: string, y: string, uf: { [key: string]: string }) => {
        const rootX = find(x, uf);
        const rootY = find(y, uf);
        if (rootX !== rootY) {
          uf[rootY] = rootX;
          return true;
        }
        return false;
      };

      const getComponents = (uf: { [key: string]: string }) => {
        const components: { [key: string]: string[] } = {};
        Object.keys(uf).forEach(node => {
          const root = find(node, uf);
          if (!components[root]) components[root] = [];
          components[root].push(node);
        });
        return components;
      };

      while (mstEdges.length < graph.nodes.length - 1) {
        const currentUF = { ...unionFind };
        const components = getComponents(currentUF);
        const cheapestEdges: { [key: string]: { from: string; to: string; weight: number } | null } = {};
        
        // Initialize cheapest edges for each component
        Object.keys(components).forEach(comp => {
          cheapestEdges[comp] = null;
        });

        // Find cheapest edge for each component
        edges.forEach(edge => {
          const compU = find(edge.from, currentUF);
          const compV = find(edge.to, currentUF);
          
          if (compU !== compV) {
            // Check if this is cheapest for component U
            if (!cheapestEdges[compU] || edge.weight < cheapestEdges[compU]!.weight) {
              cheapestEdges[compU] = edge;
            }
            // Check if this is cheapest for component V
            if (!cheapestEdges[compV] || edge.weight < cheapestEdges[compV]!.weight) {
              cheapestEdges[compV] = edge;
            }
          }
        });

        // Show finding cheapest edges step
        steps.push({
          description: `Iteration ${iteration}: Find cheapest edge for each component. Highlighted edges are candidates.`,
          iteration,
          components,
          cheapestEdges,
          mstEdges: [...mstEdges],
          unionFind: { ...unionFind },
          highlightEdges: Object.values(cheapestEdges).filter(e => e !== null) as { from: string; to: string; weight: number }[],
          totalWeight,
          complexity: "O(E) - Find cheapest edges for all components"
        });

        // Add cheapest edges to MST
        const edgesToAdd: { from: string; to: string; weight: number }[] = [];
        const uniqueEdges = new Set<string>();
        
        Object.values(cheapestEdges).forEach(edge => {
          if (edge) {
            const edgeKey = [edge.from, edge.to].sort().join('-');
            if (!uniqueEdges.has(edgeKey)) {
              uniqueEdges.add(edgeKey);
              if (union(edge.from, edge.to, unionFind)) {
                edgesToAdd.push(edge);
                mstEdges.push(edge);
                totalWeight += edge.weight;
              }
            }
          }
        });

        // Show adding edges step
        steps.push({
          description: `Iteration ${iteration}: Add cheapest edges to MST. Components merge when connected.`,
          iteration,
          components: getComponents(unionFind),
          cheapestEdges: {},
          mstEdges: [...mstEdges],
          unionFind: { ...unionFind },
          highlightEdges: edgesToAdd,
          totalWeight,
          complexity: "O(V⋅α(V)) - Union operations for selected edges"
        });

        iteration++;
        
        if (edgesToAdd.length === 0) break; // Safety check
      }

      // Final step
      steps.push({
        description: `Complete! MST found with total weight ${totalWeight}. Borůvka's algorithm finished in ${iteration-1} iterations.`,
        iteration: iteration-1,
        components: getComponents(unionFind),
        cheapestEdges: {},
        mstEdges: [...mstEdges],
        unionFind: { ...unionFind },
        highlightEdges: [],
        totalWeight,
        complexity: "Total: O(E log V) - At most log V iterations"
      });

      return steps;
    };

    const [currentStep, setCurrentStep] = useState(0);
    const steps = getAnimationSteps();
    const step = steps[currentStep];

    const drawGraph = useCallback((ctx: CanvasRenderingContext2D, step: BoruvkaAnimationStep) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Clear canvas
      ctx.clearRect(0, 0, 450, 300);
      
      // Draw background
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#f8fafc';
      ctx.fillRect(0, 0, 450, 300);

      // Draw all edges first
      graph.edges.forEach(edge => {
        const fromNode = graph.nodes.find(n => n.id === edge.from)!;
        const toNode = graph.nodes.find(n => n.id === edge.to)!;
        
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 16;
        
        const startX = fromNode.x + (dx / distance) * nodeRadius;
        const startY = fromNode.y + (dy / distance) * nodeRadius;
        const endX = toNode.x - (dx / distance) * nodeRadius;
        const endY = toNode.y - (dy / distance) * nodeRadius;

        // Determine edge status
        const isInMST = step.mstEdges.some(mst => 
          (mst.from === edge.from && mst.to === edge.to) || 
          (mst.from === edge.to && mst.to === edge.from)
        );
        const isHighlighted = step.highlightEdges.some(h => 
          (h.from === edge.from && h.to === edge.to) || 
          (h.from === edge.to && h.to === edge.from)
        );
        const isCheapest = Object.values(step.cheapestEdges).some(c => 
          c && ((c.from === edge.from && c.to === edge.to) || 
                 (c.from === edge.to && c.to === edge.from))
        );
        
        // Edge styling
        if (isInMST) {
          ctx.strokeStyle = '#10b981'; // Green for MST edges
          ctx.lineWidth = 4;
        } else if (isHighlighted || isCheapest) {
          ctx.strokeStyle = '#f59e0b'; // Yellow for highlighted/cheapest
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = isDarkMode ? '#4b5563' : '#d1d5db';
          ctx.lineWidth = 2;
        }
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw weight label
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        // Background for weight
        ctx.fillStyle = isInMST ? '#10b981' : (isHighlighted || isCheapest) ? '#f59e0b' : (isDarkMode ? '#374151' : '#ffffff');
        ctx.beginPath();
        ctx.arc(midX, midY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        // Weight text
        ctx.fillStyle = (isInMST || isHighlighted || isCheapest) ? '#ffffff' : (isDarkMode ? '#f3f4f6' : '#1f2937');
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight.toString(), midX, midY);
      });

      // Draw component boundaries
      const componentColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      let colorIndex = 0;
      
      Object.entries(step.components).forEach(([root, nodes]) => {
        if (nodes.length > 1) {
          const color = componentColors[colorIndex % componentColors.length];
          colorIndex++;
          
          // Draw component boundary
          const componentNodes = nodes.map(nodeId => graph.nodes.find(n => n.id === nodeId)!);
          if (componentNodes.length > 1) {
            ctx.strokeStyle = color + '80';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            
            // Simple bounding box for component
            const minX = Math.min(...componentNodes.map(n => n.x)) - 25;
            const maxX = Math.max(...componentNodes.map(n => n.x)) + 25;
            const minY = Math.min(...componentNodes.map(n => n.y)) - 25;
            const maxY = Math.max(...componentNodes.map(n => n.y)) + 25;
            
            ctx.beginPath();
            ctx.roundRect(minX, minY, maxX - minX, maxY - minY, 10);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });

      // Draw nodes
      graph.nodes.forEach(node => {
        const radius = 16;
        
        // Find which component this node belongs to
        let componentColor = '#6b7280';
        Object.entries(step.components).forEach(([root, nodes], index) => {
          if (nodes.includes(node.id)) {
            componentColor = componentColors[index % componentColors.length];
          }
        });
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
        gradient.addColorStop(0, componentColor + '40');
        gradient.addColorStop(1, componentColor + '20');

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Node border
        ctx.strokeStyle = componentColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);
      });

      // Draw component info on the right
      const infoX = 370;
      let infoY = 30;
      
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Components:', infoX, infoY);
      
      infoY += 20;
      Object.entries(step.components).forEach(([root, nodes], index) => {
        const color = componentColors[index % componentColors.length];
        ctx.fillStyle = color;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`{${nodes.join(', ')}}`, infoX, infoY);
        infoY += 15;
      });

      // Draw MST weight
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(`MST Weight: ${step.totalWeight}`, 20, 280);
      
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const animate = () => {
        drawGraph(ctx, step);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [step, drawGraph]);

    const nextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const resetAnimation = () => {
      setCurrentStep(0);
    };

    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 shadow-lg">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
            🌐 Borůvka's MST Algorithm Visualization
          </h3>
          <p className="text-purple-600 dark:text-purple-300 text-sm">
            Watch how Borůvka's algorithm finds MST by selecting cheapest edges for each component in parallel
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={450}
            height={300}
            className="rounded-lg bg-white dark:bg-gray-800"
          />
        </div>

        {/* Step Description */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-800/30 dark:to-indigo-800/30 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
              Iteration: {step.iteration}
            </span>
          </div>
          <p className="text-purple-800 dark:text-purple-200 font-medium mb-2">
            {step.description}
          </p>
          <div className="text-sm text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 rounded p-2">
            <strong>Complexity:</strong> {step.complexity}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          <button
            onClick={resetAnimation}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            Next
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Algorithm Analysis */}
        <div className="mt-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
            📊 Borůvka's Algorithm Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Time Complexity:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">O(E log V)</span>
            </div>
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Space Complexity:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">O(V) for Union-Find</span>
            </div>
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Key Insight:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">Parallel: Find cheapest edge per component</span>
            </div>
            <div>
              <strong className="text-indigo-700 dark:text-indigo-300">Iterations:</strong>
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">At most log V iterations</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-500 dark:text-indigo-400">
            <strong>Advantage:</strong> Highly parallelizable - each component can find its cheapest edge independently
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">MST Edge</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Cheapest Edge</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-blue-500 rounded-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">Component Boundary</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Unprocessed</span>
          </div>
        </div>
      </div>
    );
  };

  // Tarjan's Bridge-Finding Visualization Component
  interface TarjanBridgeAnimationStep {
    description: string;
    currentNode: string | null;
    parentNode: string | null;
    discoveryTime: { [key: string]: number };
    lowLink: { [key: string]: number };
    timestamp: number;
    bridges: { from: string; to: string }[];
    visitedNodes: string[];
    currentEdge: { from: string; to: string } | null;
    nodeStates: { [key: string]: 'unvisited' | 'visiting' | 'visited' };
    complexity: string;
  }

  const TarjanBridgeVisualization = ({ questionId }: { questionId: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    
    // Define a graph for Tarjan's bridge-finding demonstration
    const graph = {
      nodes: [
        { id: 'A', x: 120, y: 80, color: 'white' },
        { id: 'B', x: 240, y: 80, color: 'white' },
        { id: 'C', x: 320, y: 160, color: 'white' },
        { id: 'D', x: 240, y: 240, color: 'white' },
        { id: 'E', x: 120, y: 240, color: 'white' },
        { id: 'F', x: 40, y: 160, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'F' },
        { from: 'B', to: 'C' }, // This will be a bridge
        { from: 'C', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'F' },
        { from: 'F', to: 'A' }, // Creates cycle A-F-E-D-...
        { from: 'D', to: 'C' } // Back edge, creates cycle C-D-C
      ]
    };

    const getAnimationSteps = (): TarjanBridgeAnimationStep[] => {
      const steps: TarjanBridgeAnimationStep[] = [];
      const adjacencyList: { [key: string]: string[] } = {};
      
      // Build adjacency list
      graph.nodes.forEach(node => {
        adjacencyList[node.id] = [];
      });
      graph.edges.forEach(edge => {
        adjacencyList[edge.from].push(edge.to);
        adjacencyList[edge.to].push(edge.from);
      });

      let timestamp = 0;
      const discoveryTime: { [key: string]: number } = {};
      const lowLink: { [key: string]: number } = {};
      const visited: { [key: string]: boolean } = {};
      const bridges: { from: string; to: string }[] = [];
      const nodeStates: { [key: string]: 'unvisited' | 'visiting' | 'visited' } = {};
      
      // Initialize
      graph.nodes.forEach(node => {
        discoveryTime[node.id] = 0;
        lowLink[node.id] = 0;
        visited[node.id] = false;
        nodeStates[node.id] = 'unvisited';
      });

      // Initial step
      steps.push({
        description: "Initialize: All nodes unvisited. Start DFS from node A.",
        currentNode: null,
        parentNode: null,
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        timestamp,
        bridges: [],
        visitedNodes: [],
        currentEdge: null,
        nodeStates: { ...nodeStates },
        complexity: "O(V) - Initialize data structures"
      });

      const tarjanDFS = (current: string, parent: string | null, visitedNodes: string[]) => {
        timestamp++;
        discoveryTime[current] = lowLink[current] = timestamp;
        visited[current] = true;
        nodeStates[current] = 'visiting';
        visitedNodes.push(current);

        steps.push({
          description: `Visit node ${current}. Set discovery_time[${current}] = low_link[${current}] = ${timestamp}`,
          currentNode: current,
          parentNode: parent,
          discoveryTime: { ...discoveryTime },
          lowLink: { ...lowLink },
          timestamp,
          bridges: [...bridges],
          visitedNodes: [...visitedNodes],
          currentEdge: null,
          nodeStates: { ...nodeStates },
          complexity: "O(1) - Visit node and set timestamps"
        });

        for (const neighbor of adjacencyList[current]) {
          if (neighbor === parent) continue;

          steps.push({
            description: `Exploring edge ${current}-${neighbor}`,
            currentNode: current,
            parentNode: parent,
            discoveryTime: { ...discoveryTime },
            lowLink: { ...lowLink },
            timestamp,
            bridges: [...bridges],
            visitedNodes: [...visitedNodes],
            currentEdge: { from: current, to: neighbor },
            nodeStates: { ...nodeStates },
            complexity: "O(1) - Check edge"
          });

          if (!visited[neighbor]) {
            // Tree edge
            tarjanDFS(neighbor, current, visitedNodes);
            
            // Update low_link after returning from recursion
            lowLink[current] = Math.min(lowLink[current], lowLink[neighbor]);
            
            steps.push({
              description: `Back from ${neighbor}. Update low_link[${current}] = min(${lowLink[current] + lowLink[neighbor] - Math.min(lowLink[current], lowLink[neighbor])}, ${lowLink[neighbor]}) = ${lowLink[current]}`,
              currentNode: current,
              parentNode: parent,
              discoveryTime: { ...discoveryTime },
              lowLink: { ...lowLink },
              timestamp,
              bridges: [...bridges],
              visitedNodes: [...visitedNodes],
              currentEdge: { from: current, to: neighbor },
              nodeStates: { ...nodeStates },
              complexity: "O(1) - Update low_link value"
            });

            // Check if edge is a bridge
            if (lowLink[neighbor] > discoveryTime[current]) {
              bridges.push({ from: current, to: neighbor });
              steps.push({
                description: `Bridge found! low_link[${neighbor}] (${lowLink[neighbor]}) > discovery_time[${current}] (${discoveryTime[current]}). Edge ${current}-${neighbor} is a bridge.`,
                currentNode: current,
                parentNode: parent,
                discoveryTime: { ...discoveryTime },
                lowLink: { ...lowLink },
                timestamp,
                bridges: [...bridges],
                visitedNodes: [...visitedNodes],
                currentEdge: { from: current, to: neighbor },
                nodeStates: { ...nodeStates },
                complexity: "O(1) - Bridge detection"
              });
            }
          } else {
            // Back edge - update low_link with discovery_time of neighbor
            const oldLowLink = lowLink[current];
            lowLink[current] = Math.min(lowLink[current], discoveryTime[neighbor]);
            
            steps.push({
              description: `Back edge to visited node ${neighbor}. Update low_link[${current}] = min(${oldLowLink}, discovery_time[${neighbor}]) = ${lowLink[current]}`,
              currentNode: current,
              parentNode: parent,
              discoveryTime: { ...discoveryTime },
              lowLink: { ...lowLink },
              timestamp,
              bridges: [...bridges],
              visitedNodes: [...visitedNodes],
              currentEdge: { from: current, to: neighbor },
              nodeStates: { ...nodeStates },
              complexity: "O(1) - Handle back edge (MISSING LINE!)"
            });
          }
        }

        nodeStates[current] = 'visited';
        steps.push({
          description: `Finished processing node ${current}. Mark as visited.`,
          currentNode: current,
          parentNode: parent,
          discoveryTime: { ...discoveryTime },
          lowLink: { ...lowLink },
          timestamp,
          bridges: [...bridges],
          visitedNodes: [...visitedNodes],
          currentEdge: null,
          nodeStates: { ...nodeStates },
          complexity: "O(1) - Complete node processing"
        });
      };

      tarjanDFS('A', null, []);

      // Final step
      steps.push({
        description: `Algorithm complete! Found ${bridges.length} bridge(s). Bridges are critical connections whose removal increases connected components.`,
        currentNode: null,
        parentNode: null,
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        timestamp,
        bridges: [...bridges],
        visitedNodes: Object.keys(visited),
        currentEdge: null,
        nodeStates: { ...nodeStates },
        complexity: "Total: O(V + E) - Visit each vertex and edge once"
      });

      return steps;
    };

    const [currentStep, setCurrentStep] = useState(0);
    const steps = getAnimationSteps();
    const step = steps[currentStep];

    const drawGraph = useCallback((ctx: CanvasRenderingContext2D, step: TarjanBridgeAnimationStep) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Clear canvas
      ctx.clearRect(0, 0, 450, 320);
      
      // Draw background
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#f8fafc';
      ctx.fillRect(0, 0, 450, 320);

      // Draw all edges first
      graph.edges.forEach(edge => {
        const fromNode = graph.nodes.find(n => n.id === edge.from)!;
        const toNode = graph.nodes.find(n => n.id === edge.to)!;
        
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 18;
        
        const startX = fromNode.x + (dx / distance) * nodeRadius;
        const startY = fromNode.y + (dy / distance) * nodeRadius;
        const endX = toNode.x - (dx / distance) * nodeRadius;
        const endY = toNode.y - (dy / distance) * nodeRadius;

        // Determine edge status
        const isBridge = step.bridges.some(b => 
          (b.from === edge.from && b.to === edge.to) || 
          (b.from === edge.to && b.to === edge.from)
        );
        const isCurrentEdge = step.currentEdge && 
          ((step.currentEdge.from === edge.from && step.currentEdge.to === edge.to) ||
           (step.currentEdge.from === edge.to && step.currentEdge.to === edge.from));
        
        // Edge styling
        if (isBridge) {
          ctx.strokeStyle = '#ef4444'; // Red for bridges
          ctx.lineWidth = 4;
        } else if (isCurrentEdge) {
          ctx.strokeStyle = '#f59e0b'; // Yellow for current edge
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = isDarkMode ? '#4b5563' : '#d1d5db';
          ctx.lineWidth = 2;
        }
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrow for directed representation
        if (isCurrentEdge || isBridge) {
          const arrowLength = 8;
          const arrowAngle = Math.PI / 6;
          const angle = Math.atan2(dy, dx);
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle - arrowAngle),
            endY - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowLength * Math.cos(angle + arrowAngle),
            endY - arrowLength * Math.sin(angle + arrowAngle)
          );
          ctx.stroke();
        }
      });

      // Draw nodes
      graph.nodes.forEach(node => {
        const radius = 18;
        const state = step.nodeStates[node.id];
        
        // Create radial gradient based on state
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
        
        if (state === 'visiting' && node.id === step.currentNode) {
          gradient.addColorStop(0, '#3b82f640');
          gradient.addColorStop(1, '#3b82f6');
        } else if (state === 'visiting') {
          gradient.addColorStop(0, '#10b98140');
          gradient.addColorStop(1, '#10b981');
        } else if (state === 'visited') {
          gradient.addColorStop(0, '#6b728040');
          gradient.addColorStop(1, '#6b7280');
        } else {
          gradient.addColorStop(0, isDarkMode ? '#374151' : '#f3f4f6');
          gradient.addColorStop(1, isDarkMode ? '#1f2937' : '#e5e7eb');
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Node border
        let borderColor = '#6b7280';
        if (state === 'visiting' && node.id === step.currentNode) {
          borderColor = '#3b82f6';
        } else if (state === 'visiting') {
          borderColor = '#10b981';
        } else if (state === 'visited') {
          borderColor = '#6b7280';
        }
        
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = node.id === step.currentNode ? 3 : 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = (state === 'visiting' || state === 'visited') ? '#ffffff' : (isDarkMode ? '#f3f4f6' : '#1f2937');
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);

        // Draw discovery_time and low_link values
        if (step.discoveryTime[node.id] > 0) {
          ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
          ctx.font = '10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`d:${step.discoveryTime[node.id]}`, node.x, node.y - 30);
          ctx.fillText(`l:${step.lowLink[node.id]}`, node.x, node.y + 35);
        }
      });

      // Draw algorithm state info on the right
      const infoX = 360;
      let infoY = 30;
      
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Algorithm State:', infoX, infoY);
      
      infoY += 20;
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`Timestamp: ${step.timestamp}`, infoX, infoY);
      
      infoY += 15;
      if (step.currentNode) {
        ctx.fillText(`Current: ${step.currentNode}`, infoX, infoY);
        infoY += 15;
      }
      
      if (step.bridges.length > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.fillText('Bridges:', infoX, infoY);
        infoY += 15;
        step.bridges.forEach(bridge => {
          ctx.fillText(`${bridge.from}-${bridge.to}`, infoX, infoY);
          infoY += 12;
        });
      }
      
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const animate = () => {
        drawGraph(ctx, step);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [step, drawGraph]);

    const nextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const resetAnimation = () => {
      setCurrentStep(0);
    };

    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
            🌉 Tarjan's Bridge-Finding Algorithm
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">
            Watch how Tarjan's algorithm identifies bridges (critical connections) using DFS and low-link values
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={450}
            height={320}
            className="rounded-lg bg-white dark:bg-gray-800"
          />
        </div>

        {/* Step Description */}
        <div className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-800/30 dark:to-orange-800/30 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-red-600 dark:text-red-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200 px-2 py-1 rounded">
              Timestamp: {step.timestamp}
            </span>
          </div>
          <p className="text-red-800 dark:text-red-200 font-medium mb-2">
            {step.description}
          </p>
          <div className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 rounded p-2">
            <strong>Complexity:</strong> {step.complexity}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          <button
            onClick={resetAnimation}
            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs rounded-lg hover:from-red-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            Next
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Algorithm Analysis */}
        <div className="mt-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
            📊 Tarjan's Bridge Algorithm Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong className="text-orange-700 dark:text-orange-300">Time Complexity:</strong>
              <br />
              <span className="text-orange-600 dark:text-orange-400">O(V + E)</span>
            </div>
            <div>
              <strong className="text-orange-700 dark:text-orange-300">Space Complexity:</strong>
              <br />
              <span className="text-orange-600 dark:text-orange-400">O(V) for DFS stack</span>
            </div>
            <div>
              <strong className="text-orange-700 dark:text-orange-300">Key Insight:</strong>
              <br />
              <span className="text-orange-600 dark:text-orange-400">Bridge: low_link[v] &gt; discovery_time[u]</span>
            </div>
            <div>
              <strong className="text-orange-700 dark:text-orange-300">Missing Line:</strong>
              <br />
              <span className="text-orange-600 dark:text-orange-400">Handle back edges with discovery_time</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-orange-500 dark:text-orange-400">
            <strong>Bridge Definition:</strong> An edge whose removal increases the number of connected components
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Bridge</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Current Edge</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Current Node</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Visiting</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Visited</span>
          </div>
        </div>
      </div>
    );
  };

  // Kosaraju vs Tarjan SCC Comparison Visualization Component
  interface SCCComparisonAnimationStep {
    description: string;
    algorithm: 'kosaraju' | 'tarjan';
    phase: 'dfs1' | 'transpose' | 'dfs2' | 'tarjan-dfs' | 'complete';
    currentNode: string | null;
    visitedNodes: string[];
    finishingOrder: string[];
    discoveryTime: { [key: string]: number };
    lowLink: { [key: string]: number };
    onStack: { [key: string]: boolean };
    sccs: string[][];
    currentSCC: string[];
    timestamp: number;
    complexity: string;
    memoryUsage: string;
  }

  const SCCComparisonVisualization = ({ questionId, algorithm }: { questionId: number, algorithm: 'kosaraju' | 'tarjan' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    
    // Define a graph for SCC demonstration (same graph for both algorithms)
    const graph = {
      nodes: [
        { id: 'A', x: 80, y: 80, color: 'white' },
        { id: 'B', x: 160, y: 80, color: 'white' },
        { id: 'C', x: 240, y: 80, color: 'white' },
        { id: 'D', x: 80, y: 180, color: 'white' },
        { id: 'E', x: 160, y: 180, color: 'white' },
        { id: 'F', x: 240, y: 180, color: 'white' }
      ],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' }, // SCC: A-B-C
        { from: 'A', to: 'D' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'D' }, // SCC: D-E
        { from: 'C', to: 'F' }  // F is its own SCC
      ]
    };

    const getKosarajuSteps = (): SCCComparisonAnimationStep[] => {
      const steps: SCCComparisonAnimationStep[] = [];
      
      // Phase 1: First DFS to get finishing times
      steps.push({
        description: "Kosaraju Phase 1: First DFS on original graph to get finishing times",
        algorithm: 'kosaraju',
        phase: 'dfs1',
        currentNode: null,
        visitedNodes: [],
        finishingOrder: [],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 0,
        complexity: "O(V + E) - First DFS pass",
        memoryUsage: "O(V) - Visited array + recursion stack"
      });

      // Simulate first DFS following actual graph edges: A -> B -> C -> F, then backtrack to A -> D -> E
      const finishingOrder: string[] = [];
      let visitedNodes: string[] = [];
      
      // Visit A
      visitedNodes.push('A');
      steps.push({
        description: `First DFS: Visit node A`,
        algorithm: 'kosaraju',
        phase: 'dfs1',
        currentNode: 'A',
        visitedNodes: [...visitedNodes],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 1,
        complexity: "O(1) - Visit each node once",
        memoryUsage: "O(V) - Visited array"
      });

      // Visit B (from A)
      visitedNodes.push('B');
      steps.push({
        description: `First DFS: Visit node B (from A)`,
        algorithm: 'kosaraju',
        phase: 'dfs1',
        currentNode: 'B',
        visitedNodes: [...visitedNodes],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 2,
        complexity: "O(1) - Visit each node once",
        memoryUsage: "O(V) - Visited array"
      });

      // Visit C (from B)
      visitedNodes.push('C');
      steps.push({
        description: `First DFS: Visit node C (from B)`,
        algorithm: 'kosaraju',
        phase: 'dfs1',
        currentNode: 'C',
        visitedNodes: [...visitedNodes],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 3,
        complexity: "O(1) - Visit each node once",
        memoryUsage: "O(V) - Visited array"
      });

      // Visit F (from C)
      visitedNodes.push('F');
      steps.push({
        description: `First DFS: Visit node F (from C)`,
        algorithm: 'kosaraju',
        phase: 'dfs1',
        currentNode: 'F',
        visitedNodes: [...visitedNodes],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 4,
        complexity: "O(1) - Visit each node once",
        memoryUsage: "O(V) - Visited array"
      });

      // Visit D (backtrack to A, then A -> D)
      visitedNodes.push('D');
      steps.push({
        description: `First DFS: Visit node D (backtrack to A, then A → D)`,
        algorithm: 'kosaraju',
        phase: 'dfs1',
        currentNode: 'D',
        visitedNodes: [...visitedNodes],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 5,
        complexity: "O(1) - Visit each node once",
        memoryUsage: "O(V) - Visited array"
      });

      // Visit E (from D)
      visitedNodes.push('E');
      steps.push({
        description: `First DFS: Visit node E (from D)`,
        algorithm: 'kosaraju',
        phase: 'dfs1',
        currentNode: 'E',
        visitedNodes: [...visitedNodes],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 6,
        complexity: "O(1) - Visit each node once",
        memoryUsage: "O(V) - Visited array"
      });

      // Finishing times (reverse of DFS completion order: F, E, D, C, B, A)
      const actualFinishingOrder = ['F', 'E', 'D', 'C', 'B', 'A'];
      actualFinishingOrder.forEach((node, index) => {
        finishingOrder.push(node);
        steps.push({
          description: `Node ${node} finishes - add to finishing order`,
          algorithm: 'kosaraju',
          phase: 'dfs1',
          currentNode: node,
          visitedNodes: [...visitedNodes],
          finishingOrder: [...finishingOrder],
          discoveryTime: {},
          lowLink: {},
          onStack: {},
          sccs: [],
          currentSCC: [],
          timestamp: 6 + index + 1,
          complexity: "O(1) - Record finishing time",
          memoryUsage: "O(V) - Store finishing order"
        });
      });

      // Phase 2: Create transpose graph
      steps.push({
        description: "Kosaraju Phase 2: Create transpose graph (reverse all edges)",
        algorithm: 'kosaraju',
        phase: 'transpose',
        currentNode: null,
        visitedNodes: [],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 12,
        complexity: "O(V + E) - Create transpose graph",
        memoryUsage: "O(V + E) - Store transpose graph"
      });

      // Phase 3: Second DFS on transpose in reverse finishing order
      steps.push({
        description: "Kosaraju Phase 3: Second DFS on transpose graph in reverse finishing order",
        algorithm: 'kosaraju',
        phase: 'dfs2',
        currentNode: null,
        visitedNodes: [],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 13,
        complexity: "O(V + E) - Second DFS pass",
        memoryUsage: "O(V) - Visited array for second DFS"
      });

      // Process each SCC in reverse finishing order: A, B, C, D, E, F
      const sccs: string[][] = [];
      
      // SCC 1: A, B, C (strongly connected cycle)
      let currentSCC = ['A', 'B', 'C'];
      sccs.push([...currentSCC]);
      steps.push({
        description: "Found SCC 1: {A, B, C} - strongly connected cycle in transpose",
        algorithm: 'kosaraju',
        phase: 'dfs2',
        currentNode: 'A',
        visitedNodes: currentSCC,
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [...sccs],
        currentSCC: [...currentSCC],
        timestamp: 14,
        complexity: "O(SCC size) - Explore one SCC",
        memoryUsage: "O(V) - Track visited nodes"
      });

      // SCC 2: D, E (strongly connected cycle)
      currentSCC = ['D', 'E'];
      sccs.push([...currentSCC]);
      steps.push({
        description: "Found SCC 2: {D, E} - strongly connected cycle in transpose",
        algorithm: 'kosaraju',
        phase: 'dfs2',
        currentNode: 'D',
        visitedNodes: ['A', 'B', 'C', 'D', 'E'],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [...sccs],
        currentSCC: [...currentSCC],
        timestamp: 15,
        complexity: "O(SCC size) - Explore one SCC",
        memoryUsage: "O(V) - Track visited nodes"
      });

      // SCC 3: F (single node, no incoming edges in transpose except from C)
      currentSCC = ['F'];
      sccs.push([...currentSCC]);
      steps.push({
        description: "Found SCC 3: {F} - single node SCC (no strong connectivity to other nodes)",
        algorithm: 'kosaraju',
        phase: 'dfs2',
        currentNode: 'F',
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [...sccs],
        currentSCC: [...currentSCC],
        timestamp: 16,
        complexity: "O(1) - Single node SCC",
        memoryUsage: "O(V) - Final SCC storage"
      });

      // Complete
      steps.push({
        description: "Kosaraju Complete: Found all 3 SCCs using 2-pass algorithm",
        algorithm: 'kosaraju',
        phase: 'complete',
        currentNode: null,
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        finishingOrder: [...finishingOrder],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [...sccs],
        currentSCC: [],
        timestamp: 17,
        complexity: "Total: O(V + E) - Two DFS passes",
        memoryUsage: "O(V + E) - Original + transpose graph"
      });

      return steps;
    };

    const getTarjanSteps = (): SCCComparisonAnimationStep[] => {
      const steps: SCCComparisonAnimationStep[] = [];
      
      steps.push({
        description: "Tarjan: Single DFS with discovery times, low-link values, and explicit stack",
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: null,
        visitedNodes: [],
        finishingOrder: [],
        discoveryTime: {},
        lowLink: {},
        onStack: {},
        sccs: [],
        currentSCC: [],
        timestamp: 0,
        complexity: "O(V + E) - Single DFS pass",
        memoryUsage: "O(V) - Stack + arrays, no transpose"
      });

      let timestamp = 0;
      const discoveryTime: { [key: string]: number } = {};
      const lowLink: { [key: string]: number } = {};
      const onStack: { [key: string]: boolean } = {};
      const sccs: string[][] = [];
      const stack: string[] = [];

      // Simulate Tarjan's algorithm with correct DFS order following graph edges
      // A -> B -> C -> F (F completes), backtrack C -> A (cycle detected), then A -> D -> E -> D (cycle detected)
      
      // Visit A
      timestamp++;
      discoveryTime['A'] = lowLink['A'] = timestamp;
      onStack['A'] = true;
      stack.push('A');
      steps.push({
        description: `Visit A: discovery_time[A] = low_link[A] = ${timestamp}, push to stack. Start DFS from A.`,
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'A',
        visitedNodes: ['A'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: [],
        timestamp,
        complexity: "O(1) - Process each node",
        memoryUsage: "O(V) - Explicit stack tracking"
      });

      // Visit B
      timestamp++;
      discoveryTime['B'] = lowLink['B'] = timestamp;
      onStack['B'] = true;
      stack.push('B');
      steps.push({
        description: `Visit B: discovery_time[B] = low_link[B] = ${timestamp}, push to stack. Follow edge A → B.`,
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'B',
        visitedNodes: ['A', 'B'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: [],
        timestamp,
        complexity: "O(1) - Process each node",
        memoryUsage: "O(V) - Explicit stack tracking"
      });

      // Visit C
      timestamp++;
      discoveryTime['C'] = lowLink['C'] = timestamp;
      onStack['C'] = true;
      stack.push('C');
      steps.push({
        description: `Visit C: discovery_time[C] = low_link[C] = ${timestamp}, push to stack. Follow edge B → C.`,
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'C',
        visitedNodes: ['A', 'B', 'C'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: [],
        timestamp,
        complexity: "O(1) - Process each node",
        memoryUsage: "O(V) - Explicit stack tracking"
      });

      // Visit D
      timestamp++;
      discoveryTime['D'] = lowLink['D'] = timestamp;
      onStack['D'] = true;
      stack.push('D');
      steps.push({
        description: `Visit D: discovery_time[D] = low_link[D] = ${timestamp}, push to stack. Backtrack to A, then A → D.`,
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'D',
        visitedNodes: ['A', 'B', 'C', 'D'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: [],
        timestamp,
        complexity: "O(1) - Process each node",
        memoryUsage: "O(V) - Explicit stack tracking"
      });

      // Visit E
      timestamp++;
      discoveryTime['E'] = lowLink['E'] = timestamp;
      onStack['E'] = true;
      stack.push('E');
      steps.push({
        description: `Visit E: discovery_time[E] = low_link[E] = ${timestamp}, push to stack. Follow edge D → E.`,
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'E',
        visitedNodes: ['A', 'B', 'C', 'D', 'E'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: [],
        timestamp,
        complexity: "O(1) - Process each node",
        memoryUsage: "O(V) - Explicit stack tracking"
      });

      // Visit F
      timestamp++;
      discoveryTime['F'] = lowLink['F'] = timestamp;
      onStack['F'] = true;
      stack.push('F');
      steps.push({
        description: `Visit F: discovery_time[F] = low_link[F] = ${timestamp}, push to stack. Follow edge C → F.`,
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'F',
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: [],
        timestamp,
        complexity: "O(1) - Process each node",
        memoryUsage: "O(V) - Explicit stack tracking"
      });

      // SCC detection points (in order of discovery during backtracking)
      // SCC 1: F (discovered first as it has no outgoing edges)
      const scc1 = ['F'];
      sccs.push([...scc1]);
      onStack['F'] = false;
      stack.splice(stack.indexOf('F'), 1);

      steps.push({
        description: "SCC found: {F} - single node SCC, low_link[F] = discovery_time[F], pop from stack",
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'F',
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: scc1,
        timestamp: timestamp + 1,
        complexity: "O(1) - Single node SCC",
        memoryUsage: "O(V) - Update stack and arrays"
      });

      // SCC 2: D-E cycle (discovered when backtracking from E to D)
      const scc2 = ['D', 'E'];
      sccs.push([...scc2]);
      scc2.forEach(node => {
        onStack[node] = false;
        stack.splice(stack.indexOf(node), 1);
      });

      steps.push({
        description: "SCC found: {D, E} - low_link[D] = discovery_time[D], pop stack until D",
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'D',
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: scc2,
        timestamp: timestamp + 2,
        complexity: "O(SCC size) - Pop SCC from stack",
        memoryUsage: "O(V) - Update stack and arrays"
      });

      // SCC 3: A-B-C cycle (discovered last when backtracking from C to A)
      const scc3 = ['A', 'B', 'C'];
      sccs.push([...scc3]);
      scc3.forEach(node => {
        onStack[node] = false;
        stack.splice(stack.indexOf(node), 1);
      });

      steps.push({
        description: "SCC found: {A, B, C} - low_link[A] = discovery_time[A], pop stack until A",
        algorithm: 'tarjan',
        phase: 'tarjan-dfs',
        currentNode: 'A',
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        finishingOrder: [...stack],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: scc3,
        timestamp: timestamp + 3,
        complexity: "O(SCC size) - Pop SCC from stack",
        memoryUsage: "O(V) - Update stack and arrays"
      });

      // Complete
      steps.push({
        description: "Tarjan Complete: Found all 3 SCCs in single pass with explicit stack tracking",
        algorithm: 'tarjan',
        phase: 'complete',
        currentNode: null,
        visitedNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        finishingOrder: [],
        discoveryTime: { ...discoveryTime },
        lowLink: { ...lowLink },
        onStack: { ...onStack },
        sccs: [...sccs],
        currentSCC: [],
        timestamp: timestamp + 4,
        complexity: "Total: O(V + E) - Single DFS pass",
        memoryUsage: "O(V) - No transpose graph needed"
      });

      return steps;
    };

    const [currentStep, setCurrentStep] = useState(0);
    const steps = algorithm === 'kosaraju' ? getKosarajuSteps() : getTarjanSteps();
    const step = steps[currentStep];

    const drawGraph = useCallback((ctx: CanvasRenderingContext2D, step: SCCComparisonAnimationStep) => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Clear canvas
      ctx.clearRect(0, 0, 450, 280);
      
      // Draw background
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#f8fafc';
      ctx.fillRect(0, 0, 450, 280);

      // Draw title
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${algorithm === 'kosaraju' ? 'Kosaraju' : 'Tarjan'}'s Algorithm`, 225, 25);

      // Draw edges (transpose if in transpose phase)
      const isTranspose = step.phase === 'transpose' || step.phase === 'dfs2';
      graph.edges.forEach(edge => {
        const fromNode = graph.nodes.find(n => n.id === (isTranspose ? edge.to : edge.from))!;
        const toNode = graph.nodes.find(n => n.id === (isTranspose ? edge.from : edge.to))!;
        
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nodeRadius = 18;
        
        const startX = fromNode.x + (dx / distance) * nodeRadius;
        const startY = fromNode.y + (dy / distance) * nodeRadius;
        const endX = toNode.x - (dx / distance) * nodeRadius;
        const endY = toNode.y - (dy / distance) * nodeRadius;

        // Edge styling
        ctx.strokeStyle = isTranspose ? '#8b5cf6' : (isDarkMode ? '#4b5563' : '#d1d5db');
        ctx.lineWidth = isTranspose ? 3 : 2;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow
        const arrowLength = 8;
        const arrowAngle = Math.PI / 6;
        const angle = Math.atan2(dy, dx);
        
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle - arrowAngle),
          endY - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle + arrowAngle),
          endY - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
      });

      // Draw nodes
      graph.nodes.forEach(node => {
        const radius = 18;
        
        // Determine node color based on SCC membership
        let nodeColor = isDarkMode ? '#374151' : '#f3f4f6';
        let borderColor = '#6b7280';
        
        if (step.currentSCC.includes(node.id)) {
          nodeColor = '#ef4444'; // Red for current SCC
          borderColor = '#dc2626';
        } else if (step.sccs.some(scc => scc.includes(node.id))) {
          const sccIndex = step.sccs.findIndex(scc => scc.includes(node.id));
          const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
          nodeColor = colors[sccIndex % colors.length];
          borderColor = nodeColor;
        } else if (step.visitedNodes.includes(node.id)) {
          nodeColor = '#6b7280';
          borderColor = '#4b5563';
        }

        if (node.id === step.currentNode) {
          borderColor = '#ef4444';
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = nodeColor;
        ctx.fill();
        
        // Node border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = node.id === step.currentNode ? 3 : 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);

        // Draw algorithm-specific values
        if (algorithm === 'tarjan' && step.discoveryTime[node.id]) {
          ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
          ctx.font = '9px Inter, sans-serif';
          ctx.fillText(`d:${step.discoveryTime[node.id]}`, node.x - 8, node.y - 30);
          ctx.fillText(`l:${step.lowLink[node.id]}`, node.x + 8, node.y - 30);
          if (step.onStack[node.id]) {
            ctx.fillText('📚', node.x, node.y + 30);
          }
        }
      });

      // Draw algorithm state info
      const infoX = 330;
      let infoY = 50;
      
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('State:', infoX, infoY);
      
      infoY += 15;
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(`Phase: ${step.phase}`, infoX, infoY);
      
      infoY += 12;
      ctx.fillText(`Time: ${step.timestamp}`, infoX, infoY);
      
      if (step.sccs.length > 0) {
        infoY += 15;
        ctx.fillStyle = '#10b981';
        ctx.fillText('SCCs:', infoX, infoY);
        step.sccs.forEach((scc, index) => {
          infoY += 12;
          ctx.fillText(`{${scc.join(',')}}`, infoX, infoY);
        });
      }

      // Draw comparison metrics
      infoY += 20;
      ctx.fillStyle = isDarkMode ? '#f3f4f6' : '#1f2937';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText('Metrics:', infoX, infoY);
      
      infoY += 12;
      ctx.font = '8px Inter, sans-serif';
      ctx.fillText('Memory:', infoX, infoY);
      infoY += 10;
      ctx.fillText(step.memoryUsage, infoX, infoY);
      
    }, [algorithm]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const animate = () => {
        drawGraph(ctx, step);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [step, drawGraph]);

    const nextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const resetAnimation = () => {
      setCurrentStep(0);
    };

    return (
      <div className={`rounded-xl p-6 border shadow-lg ${
        algorithm === 'kosaraju' 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
          : 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800'
      }`}>
        <div className="text-center mb-4">
          <h3 className={`text-xl font-bold mb-2 ${
            algorithm === 'kosaraju' 
              ? 'text-blue-800 dark:text-blue-200'
              : 'text-purple-800 dark:text-purple-200'
          }`}>
            {algorithm === 'kosaraju' ? '🔄 Kosaraju\'s Algorithm' : '⚡ Tarjan\'s Algorithm'}
          </h3>
          <p className={`text-sm ${
            algorithm === 'kosaraju' 
              ? 'text-blue-600 dark:text-blue-300'
              : 'text-purple-600 dark:text-purple-300'
          }`}>
            {algorithm === 'kosaraju' 
              ? '2-pass algorithm: DFS → Transpose → DFS'
              : '1-pass algorithm: DFS with stack and low-link values'
            }
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={450}
            height={280}
            className="rounded-lg bg-white dark:bg-gray-800"
          />
        </div>

        {/* Step Description */}
        <div className={`rounded-lg p-4 mb-4 ${
          algorithm === 'kosaraju'
            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800/30 dark:to-indigo-800/30'
            : 'bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-800/30 dark:to-violet-800/30'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${
              algorithm === 'kosaraju' 
                ? 'text-blue-600 dark:text-blue-300'
                : 'text-purple-600 dark:text-purple-300'
            }`}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              algorithm === 'kosaraju'
                ? 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200'
                : 'bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200'
            }`}>
              {step.phase}
            </span>
          </div>
          <p className={`font-medium mb-2 ${
            algorithm === 'kosaraju' 
              ? 'text-blue-800 dark:text-blue-200'
              : 'text-purple-800 dark:text-purple-200'
          }`}>
            {step.description}
          </p>
          <div className={`text-sm rounded p-2 ${
            algorithm === 'kosaraju'
              ? 'text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30'
              : 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30'
          }`}>
            <strong>Complexity:</strong> {step.complexity}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs rounded-lg hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          <button
            onClick={resetAnimation}
            className={`px-3 py-1.5 text-white text-xs rounded-lg transition-all duration-200 flex items-center gap-1 ${
              algorithm === 'kosaraju'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className={`px-3 py-1.5 text-white text-xs rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1 ${
              algorithm === 'kosaraju'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
            }`}
          >
            Next
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

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

  // Speed mode timer
  useEffect(() => {
    if (quizMode && gameStarted && !gameCompleted && !showExplanation) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizMode, gameStarted, gameCompleted, showExplanation]);

  // Track time spent on questions
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      setQuestionStartTime(Date.now());
    }
  }, [questionIndex, gameStarted, gameCompleted]);

  // Load achievements and progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAchievements = localStorage.getItem('graph-mc-achievements');
      const savedProgress = localStorage.getItem('graph-mc-progress');
      const savedHighScore = localStorage.getItem('graph-mc-high-score');
      
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      } else {
        setAchievements(allAchievements.map(a => ({ ...a, unlocked: false })));
      }
      
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
      
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore));
      }
    }
  }, []);

  // All achievements
  const allAchievements: Achievement[] = [
    { id: 'first-correct', name: 'First Steps', description: 'Answer your first question correctly', icon: '🎯', unlocked: false },
    { id: 'streak-5', name: 'On Fire', description: 'Get 5 questions right in a row', icon: '🔥', unlocked: false },
    { id: 'streak-10', name: 'Unstoppable', description: 'Get 10 questions right in a row', icon: '⚡', unlocked: false },
    { id: 'no-hints', name: 'Pure Knowledge', description: 'Complete 10 questions without using hints', icon: '🧠', unlocked: false },
    { id: 'speed-demon', name: 'Speed Demon', description: 'Answer 5 questions in under 10 seconds each', icon: '💨', unlocked: false },
    { id: 'topic-master', name: 'Topic Master', description: 'Get 100% in any single topic', icon: '👑', unlocked: false },
    { id: 'perfectionist', name: 'Perfectionist', description: 'Complete all questions with 100% accuracy', icon: '💎', unlocked: false }
  ];

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => 
        a.id === achievementId ? { ...a, unlocked: true } : a
      );
      localStorage.setItem('graph-mc-achievements', JSON.stringify(updated));
      
      const achievement = updated.find(a => a.id === achievementId);
      if (achievement && !prev.find(a => a.id === achievementId)?.unlocked) {
        setShowAchievement(achievement);
        setTimeout(() => setShowAchievement(null), 3000);
      }
      
      return updated;
    });
  };

  const checkAchievements = () => {
    // Check various achievement conditions
    if (score > 0 && !achievements.find(a => a.id === 'first-correct')?.unlocked) {
      unlockAchievement('first-correct');
    }
    
    if (streak >= 5 && !achievements.find(a => a.id === 'streak-5')?.unlocked) {
      unlockAchievement('streak-5');
    }
    
    if (streak >= 10 && !achievements.find(a => a.id === 'streak-10')?.unlocked) {
      unlockAchievement('streak-10');
    }
  };

  const handleTimeOut = () => {
    // Auto-select wrong answer when time runs out
    setSelectedAnswer(-1);
    setShowExplanation(true);
    setStreak(0);
    setCombo(0);
  };

  const calculateScore = (difficulty: string, timeSpent: number, usedHint: boolean) => {
    let baseScore = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 15 : 20;
    
    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, 10 - Math.floor(timeSpent / 1000));
    
    // Combo multiplier
    const comboMultiplier = Math.min(3, 1 + combo * 0.1);
    
    // Hint penalty
    const hintPenalty = usedHint ? 0.8 : 1;
    
    return Math.round(baseScore * comboMultiplier * hintPenalty + timeBonus);
  };

  // All Graph Multiple Choice Questions
  const questions: MCQuestion[] = [
    // SCC & Bridges Questions (15 questions)
    {
      id: 1,
      topic: "SCC & Bridges",
      functionName: "tarjan_bridges",
      difficulty: "Medium",
      question: "What's the missing line in Tarjan's bridge-finding algorithm?",
      code: `    def criticalConnections(
        self, n: int, connections: List[List[int]]
    ) -> List[List[int]]:
        def tarjan_dfs(current_node: int, parent_node: int):
            nonlocal timestamp
            timestamp += 1
            discovery_time[current_node] = low_link[current_node] = timestamp
            
            for neighbor in graph[current_node]:
                if neighbor == parent_node:
                    continue
                if not discovery_time[neighbor]:
                    tarjan_dfs(neighbor, current_node)
                    low_link[current_node] = min(low_link[current_node], low_link[neighbor])
                    if low_link[neighbor] > discovery_time[current_node]:
                        bridges.append([current_node, neighbor])
                else:
                # MISSING LINE HERE


        graph = [[] for _ in range(n)]
        for node1, node2 in connections:
            graph[node1].append(node2)
            graph[node2].append(node1)

        discovery_time = [0] * n  # first discovered
        low_link = [0] * n # Lowest discovery time reachable 
        timestamp = 0             # Current time in DFS traversal
        bridges = []              # List of critical connections (bridges)
        
        tarjan_dfs(0, -1)
        return bridges`,
      options: [
        "low_link[current_node] = min(low_link[current_node], discovery_time[neighbor])",
        "low_link[current_node] = min(low_link[current_node], low_link[neighbor])",
        "discovery_time[current_node] = min(discovery_time[current_node], discovery_time[neighbor])",
        "low_link[current_node] = discovery_time[neighbor]"
      ],
      correctAnswer: 0,
      hint: "For back edges, we update low_link with the discovery time of the neighbor, not its low_link value.",
      explanation: "For back edges (already visited nodes that aren't the parent), we update low_link[current_node] with discovery_time[neighbor] because the neighbor was discovered earlier and provides a path back to an earlier node.",
      followUpQuestions: [
        {
          question: "Why don't we use low_link[neighbor] for back edges?",
          options: [
            "Because it would create incorrect bridge detection",
            "Because low_link[neighbor] might not be finalized yet",
            "Because we only care about the earliest reachable node",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Using low_link[neighbor] for back edges would be incorrect because: 1) it could lead to wrong bridge detection, 2) the neighbor's low_link might not be finalized, and 3) for back edges we only need the discovery time to know how far back we can reach."
        }
      ]
    },
    {
      id: 2,
      topic: "SCC & Bridges",
      functionName: "kosaraju_scc",
      difficulty: "Hard",
      question: "What's the correct order of operations in Kosaraju's algorithm for finding SCCs?",
      code: `def kosaraju_scc(graph):
    """
    Find Strongly Connected Components using Kosaraju's Algorithm
    
    Args:
        graph: Adjacency list representation of directed graph
        
    Returns:
        List of SCCs, where each SCC is a list of nodes
    """
    n = len(graph)
    visited = [False] * n
    stack = []
    
    # Step 1: First DFS to get finishing times
    def dfs1(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs1(neighbor)
        # Add node to stack when DFS completes (finishing time)
        stack.append(node)
    
    # Run first DFS on all unvisited nodes
    for i in range(n):
        if not visited[i]:
            dfs1(i)
    
    # Step 2: Create transpose graph (reverse all edges)
    transpose = [[] for _ in range(n)]
    for u in range(n):
        for v in graph[u]:
            transpose[v].append(u)  # Reverse edge u->v to v->u
    
    # Step 3: Second DFS on transpose in reverse finishing order
    visited = [False] * n  # Reset visited array
    sccs = []
    
    def dfs2(node, component):
        visited[node] = True
        component.append(node)
        for neighbor in transpose[node]:
            if not visited[neighbor]:
                dfs2(neighbor, component)
    
    # Process nodes in reverse finishing order (pop from stack)
    while stack:
        node = stack.pop()
        if not visited[node]:
            component = []
            dfs2(node, component)
            sccs.append(component)
    
    return sccs

# Example usage:
# graph = [[1, 3], [2], [0, 5], [4], [3], []]
# sccs = kosaraju_scc(graph)
# Result: [[5], [3, 4], [0, 1, 2]]`,
      options: [
        "stack.append(node) and transpose[v].append(u)",
        "stack.insert(0, node) and transpose[u].append(v)",
        "finish_time[node] = time and transpose[v].append(u)",
        "order.append(node) and transpose[u].append(v)"
      ],
      correctAnswer: 0,
      hint: "We need to record finishing times in first DFS and reverse all edges for transpose graph.",
      explanation: "In Kosaraju's algorithm: 1) First DFS records finishing times by appending to stack when done with a node, 2) Transpose graph reverses all edges: if u->v exists, then transpose has v->u, 3) Second DFS processes nodes in reverse finishing order.",
      followUpQuestions: [
        {
          question: "Why do we process nodes in reverse finishing order in the second DFS?",
          options: [
            "To ensure we start from nodes that can reach the most other nodes",
            "To guarantee we find the largest SCC first",
            "To ensure each DFS call finds exactly one SCC",
            "To optimize the time complexity"
          ],
          correctAnswer: 2,
          explanation: "Processing in reverse finishing order ensures that when we start a DFS from a node in the transpose graph, we can only reach nodes within the same SCC, guaranteeing each DFS call finds exactly one complete SCC."
        }
      ]
    },
    {
      id: 3,
      topic: "SCC & Bridges",
      functionName: "articulation_points",
      difficulty: "Medium",
      question: "When is a node an articulation point in Tarjan's algorithm?",
      code: `def find_articulation_points(graph):
    def dfs(u, parent):
        nonlocal time
        discovery[u] = low[u] = time
        time += 1
        children = 0
        
        for v in graph[u]:
            if discovery[v] == -1:  # Tree edge
                children += 1
                dfs(v, u)
                low[u] = min(low[u], low[v])
                
                # Check for articulation point
                if parent == -1 and children > 1:
                    articulation_points.add(u)  # Root with multiple children
                elif parent != -1 and low[v] >= discovery[u]:
                    # MISSING CONDITION - when is non-root an articulation point?
                    articulation_points.add(u)
            elif v != parent:  # Back edge
                low[u] = min(low[u], discovery[v])`,
      options: [
        "low[v] >= discovery[u]",
        "low[v] > discovery[u]",
        "low[v] == discovery[u]",
        "low[v] <= discovery[u]"
      ],
      correctAnswer: 0,
      hint: "An articulation point exists when removing it would disconnect the subtree rooted at v from ancestors of u.",
      explanation: "A non-root node u is an articulation point if low[v] >= discovery[u] for some child v. This means there's no back edge from the subtree rooted at v to any ancestor of u, so removing u would disconnect v's subtree.",
      followUpQuestions: [
        {
          question: "What's the difference between bridge condition and articulation point condition?",
          options: [
            "Bridge uses > while articulation point uses >=",
            "Bridge uses >= while articulation point uses >",
            "They use the same condition",
            "Bridge uses discovery time while articulation point uses low values"
          ],
          correctAnswer: 0,
          explanation: "Bridge condition is low[v] > discovery[u] (strict inequality) while articulation point condition is low[v] >= discovery[u] (includes equality). This is because removing an edge requires no path back, while removing a node allows the node itself as a connection point."
        }
      ]
    },

    // Max Flow Questions (12 questions)
    {
      id: 4,
      topic: "Max Flow",
      functionName: "ford_fulkerson",
      difficulty: "Hard",
      question: "What's the missing line in the Ford-Fulkerson algorithm?",
      code: `def ford_fulkerson(graph, source, sink):
    def bfs_find_path(source, sink, parent):
        visited = set([source])
        queue = [source]
        
        while queue:
            u = queue.pop(0)
            for v in range(len(graph)):
                if v not in visited and graph[u][v] > 0:
                    visited.add(v)
                    parent[v] = u
                    if v == sink:
                        return True
                    queue.append(v)
        return False
    
    parent = [-1] * len(graph)
    max_flow = 0
    
    while bfs_find_path(source, sink, parent):
        # Find minimum residual capacity along the path
        path_flow = float('inf')
        s = sink
        while s != source:
            # MISSING LINE HERE - how to find bottleneck capacity?
            path_flow = min(path_flow, graph[parent[s]][s])
            s = parent[s]
        
        # Update residual capacities
        v = sink
        while v != source:
            u = parent[v]
            graph[u][v] -= path_flow  # Forward edge
            # MISSING LINE HERE - how to update backward edge?
            graph[v][u] += path_flow
            v = parent[v]
        
        max_flow += path_flow`,
      options: [
        "path_flow = min(path_flow, graph[parent[s]][s]) and graph[v][u] += path_flow",
        "path_flow = min(path_flow, graph[s][parent[s]]) and graph[v][u] -= path_flow",
        "path_flow = max(path_flow, graph[parent[s]][s]) and graph[v][u] += path_flow",
        "path_flow = min(path_flow, residual[parent[s]][s]) and graph[u][v] += path_flow"
      ],
      correctAnswer: 0,
      hint: "We need to find the minimum capacity along the path and add flow to backward edges for future augmenting paths.",
      explanation: "Ford-Fulkerson finds the bottleneck by taking minimum capacity along the path: min(path_flow, graph[parent[s]][s]). When updating, we subtract flow from forward edges and add flow to backward edges to allow flow reversal in future iterations.",
      followUpQuestions: [
        {
          question: "Why do we add flow to backward edges in the residual graph?",
          options: [
            "To track the total flow sent",
            "To allow canceling flow in future iterations",
            "To maintain graph symmetry",
            "To optimize memory usage"
          ],
          correctAnswer: 1,
          explanation: "Adding flow to backward edges allows future augmenting paths to 'cancel' or redirect previously sent flow, which is essential for finding the optimal maximum flow."
        }
      ]
    },
    {
      id: 5,
      topic: "Max Flow",
      functionName: "edmonds_karp",
      difficulty: "Medium",
      question: "What's the key difference between Edmonds-Karp and basic Ford-Fulkerson?",
      code: `def edmonds_karp(capacity, source, sink):
    def bfs_shortest_path(source, sink, parent):
        visited = [False] * len(capacity)
        queue = []
        queue.append(source)
        visited[source] = True
        
        while queue:
            u = queue.pop(0)
            
            for v in range(len(capacity)):
                if not visited[v] and capacity[u][v] > 0:
                    queue.append(v)
                    visited[v] = True
                    parent[v] = u
                    if v == sink:
                        return True
        return False
    
    parent = [-1] * len(capacity)
    max_flow_value = 0
    
    # MISSING COMMENT - what type of path does this find?
    # This finds the shortest augmenting path in terms of number of edges
    while bfs_shortest_path(source, sink, parent):
        path_flow = float('Inf')
        s = sink
        while s != source:
            path_flow = min(path_flow, capacity[parent[s]][s])
            s = parent[s]
        
        max_flow_value += path_flow
        v = sink
        while v != source:
            u = parent[v]
            capacity[u][v] -= path_flow
            capacity[v][u] += path_flow
            v = parent[v]`,
      options: [
        "Uses BFS to find shortest augmenting paths",
        "Uses DFS to find any augmenting path",
        "Uses Dijkstra to find minimum cost paths",
        "Uses A* to find optimal paths"
      ],
      correctAnswer: 0,
      hint: "The algorithm name gives a clue - it's about finding the shortest path in terms of edges.",
      explanation: "Edmonds-Karp is Ford-Fulkerson with BFS to find the shortest augmenting path (in terms of number of edges). This guarantees O(VE²) time complexity, unlike basic Ford-Fulkerson which can be exponential with poor path choices.",
      followUpQuestions: [
        {
          question: "What's the time complexity of Edmonds-Karp?",
          options: [
            "O(V³)",
            "O(VE²)",
            "O(E²)",
            "O(V²E)"
          ],
          correctAnswer: 1,
          explanation: "Edmonds-Karp has O(VE²) time complexity: at most VE/2 iterations (proven bound), each iteration takes O(E) time for BFS, giving O(VE²) total."
        }
      ]
    },

    // BFS & DFS Questions (15 questions)
    {
      id: 6,
      topic: "BFS & DFS",
      functionName: "bfs_shortest_path",
      difficulty: "Easy",
      question: "What are the missing lines in BFS shortest path implementation?",
      code: `    def bfs_shortest_path(self, start, target):
        if start not in self.graph or target not in self.graph:
            return -1

        queue = deque([(start, 0)])  # (node, distance)
        visited = set()

        while queue:
            node, distance = queue.popleft()
            if node == target:

             # MISSING LINE HERE

            if node not in visited:
                visited.add(node)
                for neighbor in self.graph[node]:

                # MISSING LINE HERE
                
        return -1`,
      options: [
        "return distance and queue.append((neighbor, distance + 1))",
        "return [distance] and queue.append((neighbor, [distance]))",
        "return path + [end] and queue.append((distance, path))",
        "return path and queue.append((neighbor, path + [node]))"
      ],
      correctAnswer: 0,
      hint: "We need to return the complete path including the destination, and add neighbors with their extended paths.",
      explanation: "When we find the end node, we return the complete path including it: path + [neighbor]. For other neighbors, we add them to the queue with their extended path: (neighbor, path + [neighbor]).",
      followUpQuestions: [
        {
          question: "Why does BFS guarantee the shortest path in unweighted graphs?",
          options: [
            "Because it explores nodes in order of distance from start",
            "Because it uses a queue data structure",
            "Because it visits all neighbors before moving deeper",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "BFS guarantees shortest path because it explores nodes level by level (by distance), uses FIFO queue to maintain this order, and visits all nodes at distance d before any node at distance d+1."
        }
      ]
    },
    {
      id: 7,
      topic: "BFS & DFS",
      functionName: "dfs_cycle_detection",
      difficulty: "Medium",
      question: "What's the missing condition for cycle detection in DFS?",
      code: `def has_cycle_directed(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * len(graph)
    
    def dfs(node):
        color[node] = GRAY
        
        for neighbor in graph[node]:

            # MISSING CONDITION - when do we detect a cycle?

                return True
            elif color[neighbor] == WHITE and dfs(neighbor):
                return True
        
        color[node] = BLACK
        return False
    
    for node in range(len(graph)):
        if color[node] == WHITE:
            if dfs(node):
                return True
    return False`,
      options: [
        "color[neighbor] == GRAY (back edge to ancestor)",
        "color[neighbor] == BLACK (cross edge)",
        "color[neighbor] == WHITE (tree edge)",
        "color[neighbor] != WHITE (any visited node)"
      ],
      correctAnswer: 0,
      hint: "A cycle exists when we find an edge to a node that's currently being processed (in our current path).",
      explanation: "In directed graphs, a cycle exists when we encounter a GRAY node (currently being processed) - this indicates a back edge to an ancestor in the current DFS path, forming a cycle.",
      followUpQuestions: [
        {
          question: "What's the difference between cycle detection in directed vs undirected graphs?",
          options: [
            "Directed graphs use 3 colors, undirected graphs use 2",
            "Directed graphs check for back edges, undirected graphs check for any visited non-parent",
            "Directed graphs are more complex due to edge direction",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Directed graph cycle detection is more complex: uses 3 colors (WHITE/GRAY/BLACK), specifically looks for back edges to ancestors, and must consider edge directions. Undirected graphs only need to check for visited non-parent nodes."
        }
      ]
    },

    // Topological Sort Questions (12 questions)
    {
      id: 8,
      topic: "Topological Sort",
      functionName: "kahn_algorithm",
      difficulty: "Medium",
      question: "What's the missing line in Kahn's algorithm for topological sorting?",
      code: `def topological_sort_kahn(graph, n):
    # Calculate in-degrees
    in_degree = [0] * n
    for u in range(n):
        for v in graph[u]:
            # MISSING LINE HERE - how to calculate in-degree?
            in_degree[v] += 1
    
    # Initialize queue with nodes having in-degree 0
    queue = []
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
    
    topo_order = []
    
    while queue:
        u = queue.pop(0)
        topo_order.append(u)
        
        # Remove u and update in-degrees
        for v in graph[u]:
            # MISSING LINE HERE - how to update in-degree after removing edge?
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    
    return topo_order if len(topo_order) == n else []`,
      options: [
        "in_degree[v] += 1 and in_degree[v] -= 1",
        "in_degree[u] += 1 and in_degree[u] -= 1",
        "in_degree[v] += 1 and in_degree[u] -= 1",
        "degree[v] += 1 and degree[v] -= 1"
      ],
      correctAnswer: 0,
      hint: "In-degree counts incoming edges. When we process a node, we remove its outgoing edges.",
      explanation: "For each edge u->v, we increment in_degree[v] during initialization. When processing node u, we decrement in_degree[v] for each outgoing edge u->v, simulating edge removal.",
      followUpQuestions: [
        {
          question: "How does Kahn's algorithm detect cycles?",
          options: [
            "By checking if the output has fewer than n nodes",
            "By detecting negative in-degrees",
            "By finding nodes that never reach in-degree 0",
            "Both A and C"
          ],
          correctAnswer: 3,
          explanation: "Kahn's algorithm detects cycles when the final topological order has fewer than n nodes, which happens because nodes in cycles never reach in-degree 0 (they always have incoming edges from other cycle nodes)."
        }
      ]
    },
    {
      id: 9,
      topic: "Topological Sort",
      functionName: "dfs_topological_sort",
      difficulty: "Medium",
      question: "What's the correct implementation of DFS-based topological sort?",
      code: `def topological_sort_dfs(graph, n):
    visited = [False] * n
    stack = []
    
    def dfs(node):
        visited[node] = True
        
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)
        
        # MISSING LINE HERE - when do we add node to result?
        stack.append(node)
    
    for i in range(n):
        if not visited[i]:
            dfs(i)
    
    # MISSING LINE HERE - how to get the final order?
    return stack[::-1]`,
      options: [
        "Add node after processing all neighbors, return reversed stack",
        "Add node before processing neighbors, return stack as-is",
        "Add node during neighbor processing, return sorted stack",
        "Add node at start of DFS, return stack as-is"
      ],
      correctAnswer: 0,
      hint: "In topological order, a node should come after all nodes it depends on.",
      explanation: "We add the node to stack after processing all its neighbors (post-order), ensuring dependencies are processed first. Then we reverse the stack because the last finished node should come first in topological order.",
      followUpQuestions: [
        {
          question: "Why do we reverse the stack in DFS-based topological sort?",
          options: [
            "Because DFS finishes nodes in reverse topological order",
            "Because we want the earliest finished node first",
            "Because the stack stores nodes in LIFO order",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "We reverse because: DFS finishes nodes in reverse topological order (nodes with no dependencies finish last), we want nodes with no dependencies first, and the stack naturally stores in LIFO order."
        }
      ]
    },

    // Shortest Paths Questions (18 questions)
    {
      id: 10,
      topic: "Shortest Paths",
      functionName: "dijkstra_algorithm",
      difficulty: "Hard",
      question: "What's the missing line in Dijkstra's algorithm?",
      code: `def dijkstra(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        
        if current_node in visited:
            continue
        
        visited.add(current_node)
        
        for neighbor, weight in graph[current_node]:
            distance = current_distance + weight
            
            # MISSING CONDITION - when do we update distance?
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                # MISSING LINE HERE - what do we add to priority queue?
                heapq.heappush(pq, (distance, neighbor))
    
    return distances`,
      options: [
        "if distance < distances[neighbor] and heappush(pq, (distance, neighbor))",
        "if distance > distances[neighbor] and heappush(pq, (current_distance, neighbor))",
        "if neighbor not in visited and heappush(pq, (distance, neighbor))",
        "if distance <= distances[neighbor] and heappush(pq, (distance, current_node))"
      ],
      correctAnswer: 0,
      hint: "We only update when we find a shorter path, and we add the new distance with the neighbor to the queue.",
      explanation: "Dijkstra updates distance only when we find a shorter path: distance < distances[neighbor]. We then add (distance, neighbor) to the priority queue to explore this neighbor with its new shorter distance.",
      followUpQuestions: [
        {
          question: "Why doesn't Dijkstra work with negative edge weights?",
          options: [
            "Because it might visit nodes multiple times",
            "Because negative cycles can exist",
            "Because the greedy choice becomes incorrect",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Dijkstra fails with negative weights because: the greedy choice (always picking minimum distance) becomes incorrect when later negative edges could improve already 'finalized' distances, and negative cycles make shortest paths undefined."
        }
      ]
    },
    {
      id: 11,
      topic: "Shortest Paths",
      functionName: "bellman_ford",
      difficulty: "Hard",
      question: "What's the missing line in Bellman-Ford algorithm?",
      code: `def bellman_ford(graph, start):
    # Initialize distances
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    
    # Relax edges V-1 times
    for _ in range(len(graph) - 1):
        for node in graph:
            if distances[node] != float('infinity'):
                for neighbor, weight in graph[node]:
                    # MISSING LINE HERE - how do we relax the edge?
                    if distances[node] + weight < distances[neighbor]:
                        distances[neighbor] = distances[node] + weight
    
    # Check for negative cycles
    for node in graph:
        if distances[node] != float('infinity'):
            for neighbor, weight in graph[node]:
                # MISSING CONDITION - how do we detect negative cycle?
                if distances[node] + weight < distances[neighbor]:
                    return None  # Negative cycle detected
    
    return distances`,
      options: [
        "distances[neighbor] = distances[node] + weight and distances[node] + weight < distances[neighbor]",
        "distances[neighbor] = min(distances[neighbor], distances[node] + weight) and distances[neighbor] > distances[node] + weight",
        "distances[neighbor] = distances[node] + weight and distances[node] + weight > distances[neighbor]",
        "distances[node] = distances[neighbor] + weight and distances[neighbor] + weight < distances[node]"
      ],
      correctAnswer: 0,
      hint: "We relax edges by updating to shorter distances, and detect negative cycles when we can still improve distances after V-1 iterations.",
      explanation: "Bellman-Ford relaxes edges by updating distances[neighbor] = distances[node] + weight when distances[node] + weight < distances[neighbor]. Negative cycles are detected when we can still improve distances in the V-th iteration.",
      followUpQuestions: [
        {
          question: "Why does Bellman-Ford run for exactly V-1 iterations?",
          options: [
            "Because the longest simple path has V-1 edges",
            "Because after V-1 iterations, all shortest paths are found",
            "Because any improvement in the V-th iteration indicates a negative cycle",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "V-1 iterations suffice because: the longest simple path in a graph with V vertices has V-1 edges, so all shortest paths are found by then. Any improvement in iteration V indicates a negative cycle."
        }
      ]
    },

    // MST Questions (12 questions)
    {
      id: 12,
      topic: "MST",
      functionName: "kruskal_algorithm",
      difficulty: "Medium",
      question: "What's the missing line in Kruskal's MST algorithm?",
      code: `def kruskal_mst(edges, n):
    # Sort edges by weight
    edges.sort(key=lambda x: x[2])
    
    parent = list(range(n))
    rank = [0] * n
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if rank[px] < rank[py]:
            px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]:
            rank[px] += 1
        return True
    
    mst = []
    for u, v, weight in edges:
        # MISSING CONDITION - when do we add edge to MST?
        # if parent ae the same then it's a circle that should reject
        if find(u) != find(v):
            union(u, v)
            mst.append((u, v, weight))
            if len(mst) == n - 1:
                break
    
    return mst`,
      options: [
        "if find(u) != find(v) (edge doesn't create cycle)",
        "if find(u) == find(v) (edge connects same component)",
        "if union(u, v) == True (union was successful)",
        "if weight < min_weight (edge has minimum weight)"
      ],
      correctAnswer: 0,
      hint: "We add an edge only if it connects two different components (doesn't create a cycle).",
      explanation: "Kruskal's algorithm adds an edge to the MST only if find(u) != find(v), meaning the edge connects two different components and doesn't create a cycle. This is the key to building a spanning tree.",
      followUpQuestions: [
        {
          question: "What's the time complexity of Kruskal's algorithm?",
          options: [
            "O(E log E)",
            "O(E log V)",
            "O(V²)",
            "Both A and B are correct"
          ],
          correctAnswer: 3,
          explanation: "Kruskal's complexity is O(E log E) for sorting edges, which equals O(E log V) since E ≤ V² in simple graphs, so log E ≤ 2 log V. Union-Find operations are nearly O(1) with path compression and union by rank."
        }
      ]
    },
    {
      id: 13,
      topic: "MST",
      functionName: "prim_algorithm",
      difficulty: "Medium",
      question: "What's the missing line in Prim's MST algorithm?",
      code: `def prim_mst(graph, start):
    mst = []
    visited = set([start])
    edges = [(weight, start, neighbor) for neighbor, weight in graph[start]]
    heapq.heapify(edges)
    
    while edges and len(visited) < len(graph):
        weight, u, v = heapq.heappop(edges)
        
        # MISSING CONDITION - when do we add edge to MST?
        if v not in visited:
            visited.add(v)
            mst.append((u, v, weight))
            
            # Add new edges from v
            for neighbor, edge_weight in graph[v]:
                # MISSING CONDITION - when do we add edge to priority queue?
                if neighbor not in visited:
                    heapq.heappush(edges, (edge_weight, v, neighbor))
    
    return mst`,
      options: [
        "if v not in visited and if neighbor not in visited",
        "if v in visited and if neighbor in visited",
        "if u not in visited and if neighbor not in visited",
        "if weight < min_weight and if edge_weight < min_weight"
      ],
      correctAnswer: 0,
      hint: "We add edges that connect the MST to unvisited nodes.",
      explanation: "Prim's algorithm adds an edge (u,v) to MST when v is not yet visited (connects MST to new node). We add edges to the priority queue only if they lead to unvisited neighbors, avoiding redundant edges within the MST.",
      followUpQuestions: [
        {
          question: "What's the main difference between Prim's and Kruskal's algorithms?",
          options: [
            "Prim grows one tree, Kruskal merges multiple trees",
            "Prim uses priority queue, Kruskal uses sorting",
            "Prim is vertex-based, Kruskal is edge-based",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Key differences: Prim grows a single tree from a starting vertex while Kruskal merges multiple trees; Prim uses a priority queue for edges while Kruskal sorts all edges first; Prim focuses on vertices (adding one at a time) while Kruskal focuses on edges (adding cheapest valid edge)."
        }
      ]
    },

    // Union-Find Questions (12 questions)
    {
      id: 14,
      topic: "Union-Find",
      functionName: "union_find_optimized",
      difficulty: "Medium",
      question: "What's the missing line in optimized Union-Find with path compression?",
      code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            # MISSING LINE HERE - how do we implement path compression?
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            # MISSING LINE HERE - how do we update rank?
            self.rank[px] += 1
        
        return True`,
      options: [
        "self.parent[x] = self.find(self.parent[x]) and self.rank[px] += 1",
        "self.parent[x] = self.parent[self.parent[x]] and self.rank[px] *= 2",
        "self.parent[self.parent[x]] = x and self.rank[px] += 1",
        "self.parent[x] = px and self.rank[px] -= 1"
      ],
      correctAnswer: 0,
      hint: "Path compression makes every node point directly to the root, and rank increases only when trees of equal rank are merged.",
      explanation: "Path compression: self.parent[x] = self.find(self.parent[x]) makes x point directly to the root. Union by rank: self.rank[px] += 1 only when merging trees of equal rank (when rank[px] == rank[py]).",
      followUpQuestions: [
        {
          question: "What's the amortized time complexity of Union-Find with both optimizations?",
          options: [
            "O(log n)",
            "O(α(n)) where α is inverse Ackermann function",
            "O(1)",
            "O(n)"
          ],
          correctAnswer: 1,
          explanation: "With both path compression and union by rank, Union-Find operations have O(α(n)) amortized time complexity, where α is the inverse Ackermann function. For all practical purposes, α(n) ≤ 4."
        }
      ]
    },

    // Bipartite Questions (12 questions)
    {
      id: 15,
      topic: "Bipartite",
      functionName: "bipartite_check",
      difficulty: "Medium",
      question: "What's the missing line in bipartite graph checking using BFS?",
      code: `def is_bipartite(graph):
    color = {}
    
    for start in range(len(graph)):
        if start not in color:
            queue = [start]
            color[start] = 0
            
            while queue:
                node = queue.pop(0)
                
                for neighbor in graph[node]:
                    if neighbor not in color:
                        # MISSING LINE HERE - how to color the neighbor?
                        color[neighbor] = 1 - color[node]
                        queue.append(neighbor)
                    else:
                        # MISSING CONDITION - when is graph not bipartite?
                        if color[neighbor] == color[node]:
                            return False
    
    return True`,
      options: [
        "color[neighbor] = 1 - color[node] and if color[neighbor] == color[node]",
        "color[neighbor] = color[node] and if color[neighbor] != color[node]",
        "color[neighbor] = (color[node] + 1) % 2 and if color[neighbor] == color[node]",
        "color[neighbor] = not color[node] and if color[neighbor] != color[node]"
      ],
      correctAnswer: 0,
      hint: "Adjacent nodes must have different colors. We color with opposite color and check for conflicts.",
      explanation: "We color neighbors with the opposite color: color[neighbor] = 1 - color[node]. If we find a neighbor already colored with the same color as the current node, the graph is not bipartite.",
      followUpQuestions: [
        {
          question: "What is the time complexity of bipartite checking using BFS?",
          options: [
            "O(V + E)",
            "O(V²)",
            "O(E log V)",
            "O(V log V)"
          ],
          correctAnswer: 0,
          explanation: "BFS visits each vertex once and each edge once, giving O(V + E) time complexity."
        }
      ]
    },

    // Additional comprehensive questions for all topics
    {
      id: 16,
      topic: "SCC & Bridges",
      functionName: "tarjan_articulation_points",
      difficulty: "Hard",
      question: "What's the missing line for finding articulation points in Tarjan's algorithm?",
      code: `def find_articulation_points(graph):
    n = len(graph)
    visited = [False] * n
    disc = [0] * n
    low = [0] * n
    parent = [-1] * n
    ap = [False] * n
    time = [0]
    
    def tarjan_dfs(u):
        children = 0
        visited[u] = True
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        for v in graph[u]:
            if not visited[v]:
                parent[v] = u
                children += 1
                tarjan_dfs(v)
                low[u] = min(low[u], low[v])
                
                # MISSING LINE - when is u an articulation point?
                if (parent[u] == -1 and children > 1) or (parent[u] != -1 and low[v] >= disc[u]):
                    ap[u] = True
            elif v != parent[u]:
                low[u] = min(low[u], disc[v])`,
      options: [
        "if (parent[u] == -1 and children > 1) or (parent[u] != -1 and low[v] >= disc[u]):",
        "if (parent[u] == -1 and children > 0) or (parent[u] != -1 and low[v] > disc[u]):",
        "if (parent[u] == -1 and children >= 1) or (parent[u] != -1 and low[v] <= disc[u]):",
        "if (parent[u] == -1 and children == 1) or (parent[u] != -1 and low[v] < disc[u]):"
      ],
      correctAnswer: 0,
      hint: "Root is articulation point if it has >1 children. Non-root needs low[v] >= disc[u].",
      explanation: "Root node is articulation point if it has more than 1 child. Non-root node u is articulation point if there's a child v such that no vertex in subtree rooted at v has back edge to ancestors of u.",
      followUpQuestions: [
        {
          question: "What's the difference between bridges and articulation points?",
          options: [
            "Bridges are edges, articulation points are vertices",
            "Bridges disconnect components, articulation points don't", 
            "Bridges use DFS, articulation points use BFS",
            "No difference, they're the same concept"
          ],
          correctAnswer: 0,
          explanation: "Bridges are critical edges whose removal increases connected components. Articulation points are critical vertices whose removal increases connected components."
        }
      ]
    },

    {
      id: 17,
      topic: "Max Flow",
      functionName: "edmonds_karp_optimization",
      difficulty: "Medium",
      question: "What's the missing line in Edmonds-Karp BFS to find augmenting path?",
      code: `def edmonds_karp(graph, source, sink):
    def bfs_find_path():
        visited = set()
        queue = deque([(source, float('inf'))])
        visited.add(source)
        parent = {}
        
        while queue:
            node, flow = queue.popleft()
            
            for neighbor in graph[node]:
                capacity = graph[node][neighbor]
                # MISSING LINE - when can we visit neighbor?
                if neighbor not in visited and capacity > 0:
                    visited.add(neighbor)
                    new_flow = min(flow, capacity)
                    parent[neighbor] = node
                    
                    if neighbor == sink:
                        return new_flow, parent
                    
                    queue.append((neighbor, new_flow))
        
        return 0, {}`,
      options: [
        "if neighbor not in visited and capacity > 0:",
        "if neighbor not in visited and capacity >= 0:",
        "if neighbor not in visited:",
        "if capacity > 0:"
      ],
      correctAnswer: 0,
      hint: "We can only traverse edges with positive residual capacity.",
      explanation: "In residual graph, we can only traverse edges with positive capacity. Already visited nodes should be skipped to avoid cycles.",
      followUpQuestions: [
        {
          question: "Why does Edmonds-Karp have better time complexity than Ford-Fulkerson?",
          options: [
            "BFS finds shortest augmenting paths, limiting iterations",
            "BFS is faster than DFS",
            "BFS uses less memory",
            "BFS finds maximum flow directly"
          ],
          correctAnswer: 0,
          explanation: "BFS finds shortest augmenting paths, which limits the number of iterations to O(VE), giving O(VE²) total complexity."
        }
      ]
    },

    {
      id: 18,
      topic: "BFS & DFS",
      functionName: "dfs_cycle_detection_directed",
      difficulty: "Medium", 
      question: "What's the missing line for cycle detection in directed graph using DFS?",
      code: `def has_cycle_directed(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * len(graph)
    
    def dfs(node):
        color[node] = GRAY
        
        for neighbor in graph[node]:
            if color[neighbor] == GRAY:
                return True  # Back edge found - cycle detected

            # MISSING LINE - when do we recurse?
                return True
        
        color[node] = BLACK
        return False
    
    for node in range(len(graph)):
        if color[node] == WHITE:
            if dfs(node):
                return True
    return False`,
      options: [
        "if color[neighbor] == WHITE and dfs(neighbor):",
        "if color[neighbor] != BLACK and dfs(neighbor):",
        "if color[neighbor] == GRAY and dfs(neighbor):",
        "if dfs(neighbor):"
      ],
      correctAnswer: 0,
      hint: "We only recurse on unvisited (WHITE) nodes. GRAY nodes indicate back edge.",
      explanation: "We recurse only on WHITE (unvisited) nodes. If we encounter a GRAY node, it's a back edge indicating a cycle. BLACK nodes are already processed.",
      followUpQuestions: [
        {
          question: "What's the difference between cycle detection in directed vs undirected graphs?",
          options: [
            "Directed graphs use 3-coloring, undirected use parent tracking",
            "Directed graphs are always acyclic",
            "Undirected graphs can't have cycles",
            "No difference in approach"
          ],
          correctAnswer: 0,
          explanation: "Directed graphs use 3-coloring (WHITE/GRAY/BLACK) to detect back edges. Undirected graphs track parent to avoid trivial back-and-forth as cycles."
        }
      ]
    },

    {
      id: 19,
      topic: "Topological Sort",
      functionName: "kahn_algorithm_missing_line",
      difficulty: "Medium",
      question: "What's the missing line in Kahn's algorithm for topological sorting?",
      code: `def topological_sort_kahn(graph):
    in_degree = [0] * len(graph)
    
    # Calculate in-degrees
    for node in range(len(graph)):
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
    
    # Find nodes with 0 in-degree
    queue = deque()
    for node in range(len(graph)):
        if in_degree[node] == 0:
            queue.append(node)
    
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        # MISSING LINE - what do we do with neighbors?
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == len(graph) else []`,
      options: [
        "for neighbor in graph[node]: in_degree[neighbor] -= 1",
        "for neighbor in graph[node]: in_degree[neighbor] += 1",
        "for neighbor in graph[node]: queue.append(neighbor)",
        "for neighbor in graph[node]: result.append(neighbor)"
      ],
      correctAnswer: 0,
      hint: "When we process a node, we remove its outgoing edges, decreasing neighbors' in-degrees.",
      explanation: "When we process a node, we conceptually remove it and its outgoing edges. This decreases the in-degree of all its neighbors by 1.",
      followUpQuestions: [
        {
          question: "How do we detect cycles using Kahn's algorithm?",
          options: [
            "If result length < number of nodes, there's a cycle",
            "If queue becomes empty before processing all nodes",
            "If any in-degree becomes negative", 
            "Both A and B"
          ],
          correctAnswer: 3,
          explanation: "If we can't process all nodes (result length < total nodes), it means some nodes are in cycles and never reach in-degree 0."
        }
      ]
    },

    {
      id: 20,
      topic: "Shortest Paths",
      functionName: "floyd_warshall_missing",
      difficulty: "Medium",
      question: "What's the missing line in Floyd-Warshall algorithm?",
      code: `def floyd_warshall(graph):
    n = len(graph)
    dist = [[float('inf')] * n for _ in range(n)]
    
    # Initialize
    for i in range(n):
        dist[i][i] = 0
        for j in range(n):
            if graph[i][j] != 0:
                dist[i][j] = graph[i][j]
    
    # Try each vertex as intermediate
    for k in range(n):
        for i in range(n):
            for j in range(n):
                # MISSING LINE - how do we update shortest path?
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    
    return dist`,
      options: [
        "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
        "dist[i][j] = dist[i][k] + dist[k][j]",
        "dist[i][j] = max(dist[i][j], dist[i][k] + dist[k][j])",
        "dist[i][j] += dist[i][k] + dist[k][j]"
      ],
      correctAnswer: 0,
      hint: "We want the minimum distance, comparing direct path vs path through intermediate vertex k.",
      explanation: "Floyd-Warshall considers each vertex k as intermediate and updates dist[i][j] to be the minimum of the current distance and the path through k.",
      followUpQuestions: [
        {
          question: "How does Floyd-Warshall detect negative cycles?",
          options: [
            "If dist[i][i] < 0 for any i after algorithm completes",
            "If any distance becomes negative",
            "If algorithm doesn't converge",
            "It cannot detect negative cycles"
          ],
          correctAnswer: 0,
          explanation: "After Floyd-Warshall, if dist[i][i] < 0 for any vertex i, it means there's a negative cycle reachable from i and back to i."
        }
      ]
    },

    // Additional MST Questions
    {
      id: 21,
      topic: "MST",
      functionName: "prim_algorithm_optimization",
      difficulty: "Hard",
      question: "What's the missing line in Prim's algorithm with priority queue optimization?",
      code: `def prim_mst(graph):
    n = len(graph)
    visited = [False] * n
    min_heap = [(0, 0)]  # (weight, vertex)
    mst_weight = 0
    mst_edges = []
    
    while min_heap:
        weight, u = heapq.heappop(min_heap)
        
        # MISSING LINE - when do we skip this vertex?
        if visited[u]:
            continue
            
        visited[u] = True
        mst_weight += weight
        
        # Add all adjacent edges to heap
        for v, edge_weight in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (edge_weight, v))
    
    return mst_weight`,
      options: [
        "if visited[u]: continue",
        "if not visited[u]: continue", 
        "if u in visited: break",
        "if weight == 0: continue"
      ],
      correctAnswer: 0,
      hint: "We skip vertices that have already been added to the MST.",
      explanation: "We skip vertices that are already visited (added to MST) because we might have multiple entries for the same vertex in the priority queue with different weights.",
      followUpQuestions: [
        {
          question: "Why might we have duplicate vertices in the priority queue?",
          options: [
            "Because we add edges to unvisited neighbors without removing old entries",
            "Because of implementation bugs",
            "Because the graph has cycles",
            "Because we're using a min-heap"
          ],
          correctAnswer: 0,
          explanation: "We add edges to unvisited neighbors without removing previous entries for the same vertex, so we might have multiple (weight, vertex) pairs for the same vertex."
        }
      ]
    },

    {
      id: 22,
      topic: "MST",
      functionName: "mst_properties",
      difficulty: "Medium",
      question: "Which property is essential for MST algorithms to work correctly?",
      code: `# MST Properties and Cut Property:

# Cut Property: For any cut (S, V-S) of the graph,
# the minimum weight edge crossing the cut is in some MST.

# Cycle Property: For any cycle in the graph,
# the maximum weight edge in the cycle is not in any MST.

# These properties guarantee correctness of:
# - Kruskal's algorithm (uses cycle property)
# - Prim's algorithm (uses cut property)

def verify_mst_property(edges, mst_edges):
    # Verify that MST satisfies the cut property
    for cut_edge in find_cut_edges():
        min_cut_edge = min(cut_edge, key=lambda x: x.weight)
        # This minimum edge should be in some MST
        assert any(mst_contains_edge(mst, min_cut_edge) for mst in all_msts)`,
      options: [
        "Cut property: minimum edge crossing any cut is in some MST",
        "All edges must have different weights",
        "Graph must be connected and acyclic",
        "Vertices must be numbered consecutively"
      ],
      correctAnswer: 0,
      hint: "Think about what guarantees that greedy choices lead to optimal solutions.",
      explanation: "The cut property states that for any cut of the graph, the minimum weight edge crossing the cut is in some MST. This is fundamental to why both Kruskal's and Prim's algorithms work.",
      followUpQuestions: [
        {
          question: "What happens if all edges have the same weight?",
          options: [
            "Any spanning tree is an MST",
            "No MST exists",
            "Only one MST exists",
            "MST algorithms fail"
          ],
          correctAnswer: 0,
          explanation: "If all edges have the same weight, then any spanning tree has the same total weight, so any spanning tree is a minimum spanning tree."
        }
      ]
    },

    // Additional Union-Find Questions
    {
      id: 23,
      topic: "Union-Find",
      functionName: "union_find_applications",
      difficulty: "Medium",
      question: "What's the missing line in using Union-Find for detecting cycles in undirected graphs?",
      code: `def has_cycle_undirected(edges, n):
    parent = list(range(n))
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px != py:
            parent[px] = py
            return True
        return False
    
    for u, v in edges:
        # MISSING LINE - when do we detect a cycle?
        if not union(u, v):
            return True
    
    return False`,
      options: [
        "if not union(u, v): return True",
        "if union(u, v): return True",
        "if find(u) == find(v): continue",
        "if parent[u] == parent[v]: return False"
      ],
      correctAnswer: 0,
      hint: "A cycle exists when we try to connect two vertices that are already connected.",
      explanation: "If union(u, v) returns False, it means u and v are already in the same component, so adding edge (u,v) would create a cycle.",
      followUpQuestions: [
        {
          question: "Why doesn't this work for directed graphs?",
          options: [
            "Directed graphs need to consider edge directions and back edges",
            "Union-Find doesn't work with directed graphs",
            "Directed graphs can't have cycles",
            "The algorithm is too slow for directed graphs"
          ],
          correctAnswer: 0,
          explanation: "In directed graphs, being in the same connected component doesn't necessarily mean there's a cycle. We need to detect back edges specifically."
        }
      ]
    },

    {
      id: 24,
      topic: "Union-Find",
      functionName: "dynamic_connectivity",
      difficulty: "Hard",
      question: "How do we implement Union-Find with rollback for dynamic connectivity?",
      code: `class UnionFindWithRollback:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.history = []
    
    def find(self, x):
        # No path compression for rollback support
        while self.parent[x] != x:
            x = self.parent[x]
        return x
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        
        # MISSING LINES - how to support rollback?
        if self.rank[px] < self.rank[py]:
            self.history.append(('parent', px, self.parent[px]))
            self.parent[px] = py
        elif self.rank[px] > self.rank[py]:
            self.history.append(('parent', py, self.parent[py]))
            self.parent[py] = px
        else:
            self.history.append(('parent', py, self.parent[py]))
            self.history.append(('rank', px, self.rank[px]))
            self.parent[py] = px
            self.rank[px] += 1
        return True
    
    def rollback(self):
        while self.history:
            op, idx, old_val = self.history.pop()
            if op == 'parent':
                self.parent[idx] = old_val
            else:  # op == 'rank'
                self.rank[idx] = old_val
                break`,
      options: [
        "Store all changes in history for rollback",
        "Use path compression with careful bookkeeping",
        "Rebuild the entire structure on rollback",
        "Rollback is not possible with Union-Find"
      ],
      correctAnswer: 0,
      hint: "We need to track all changes to parent and rank arrays.",
      explanation: "To support rollback, we store all changes to parent and rank arrays in a history stack. We can't use path compression as it makes rollback complex.",
      followUpQuestions: [
        {
          question: "Why can't we use path compression with rollback?",
          options: [
            "Path compression modifies many parent pointers, making rollback complex",
            "Path compression is incompatible with union by rank",
            "Path compression reduces performance",
            "Path compression doesn't work with dynamic connectivity"
          ],
          correctAnswer: 0,
          explanation: "Path compression modifies parent pointers during find operations, and tracking all these changes for rollback would be complex and expensive."
        }
      ]
    },

    // Additional Bipartite Questions
    {
      id: 25,
      topic: "Bipartite",
      functionName: "bipartite_matching_applications",
      difficulty: "Hard",
      question: "What's the missing line in the Hungarian algorithm for maximum weighted bipartite matching?",
      code: `def hungarian_algorithm(cost_matrix):
    n = len(cost_matrix)
    # Subtract minimum from each row
    for i in range(n):
        min_val = min(cost_matrix[i])
        for j in range(n):
            cost_matrix[i][j] -= min_val
    
    # Subtract minimum from each column
    for j in range(n):
        min_val = min(cost_matrix[i][j] for i in range(n))
        for i in range(n):
            cost_matrix[i][j] -= min_val
    
    # Find maximum matching in reduced matrix
    matching = [-1] * n
    
    for i in range(n):
        # MISSING LINE - what do we look for in each row?
        zeros = [j for j in range(n) if cost_matrix[i][j] == 0]
        if len(zeros) == 1:
            j = zeros[0]
            if matching[j] == -1:
                matching[j] = i
    
    return matching`,
      options: [
        "zeros = [j for j in range(n) if cost_matrix[i][j] == 0]",
        "zeros = [j for j in range(n) if cost_matrix[i][j] == min_val]",
        "zeros = [j for j in range(n) if cost_matrix[i][j] < 0]",
        "zeros = [j for j in range(n) if cost_matrix[i][j] <= threshold]"
      ],
      correctAnswer: 0,
      hint: "Hungarian algorithm works by finding zero-cost edges in the reduced cost matrix.",
      explanation: "After row and column reductions, we look for zero entries in the cost matrix. These represent edges that can be part of the optimal matching.",
      followUpQuestions: [
        {
          question: "Why do we subtract row and column minimums?",
          options: [
            "To create zeros without changing the optimal solution structure",
            "To make all values positive",
            "To normalize the cost matrix",
            "To reduce computational complexity"
          ],
          correctAnswer: 0,
          explanation: "Subtracting constants from rows/columns doesn't change which assignment is optimal, but creates zeros that help us find the optimal matching."
        }
      ]
    },

    // Additional Advanced Questions
    {
      id: 26,
      topic: "Advanced",
      functionName: "heavy_light_decomposition",
      difficulty: "Hard",
      question: "What's the key idea behind Heavy-Light Decomposition?",
      code: `def heavy_light_decomposition(tree, root):
    n = len(tree)
    size = [0] * n
    heavy = [-1] * n
    
    def dfs_size(v, parent):
        size[v] = 1
        max_child_size = 0
        
        for u in tree[v]:
            if u != parent:
                dfs_size(u, v)
                size[v] += size[u]
                # MISSING LOGIC - how do we choose heavy child?
                if size[u] > max_child_size:
                    max_child_size = size[u]
                    heavy[v] = u
    
    def dfs_decompose(v, parent, chain_head):
        # Process current node in chain starting at chain_head
        process_node(v, chain_head)
        
        # First, go down the heavy edge (if exists)
        if heavy[v] != -1:
            dfs_decompose(heavy[v], v, chain_head)
        
        # Then, start new chains for light children
        for u in tree[v]:
            if u != parent and u != heavy[v]:
                dfs_decompose(u, v, u)  # u starts new chain
    
    dfs_size(root, -1)
    dfs_decompose(root, -1, root)`,
      options: [
        "Decompose tree into heavy and light edges based on subtree sizes",
        "Split tree into balanced binary subtrees",
        "Create a spanning tree with minimum total weight",
        "Partition vertices by their distance from root"
      ],
      correctAnswer: 0,
      hint: "Heavy edges connect to the largest child subtree.",
      explanation: "Heavy-Light Decomposition partitions tree edges into heavy (leading to largest child subtree) and light edges. This creates at most O(log n) light edges on any root-to-leaf path.",
      followUpQuestions: [
        {
          question: "What's the main advantage of Heavy-Light Decomposition?",
          options: [
            "Reduces path queries to O(log²n) by limiting chain switches",
            "Makes tree traversal faster",
            "Reduces memory usage",
            "Simplifies tree construction"
          ],
          correctAnswer: 0,
          explanation: "Any root-to-leaf path crosses at most O(log n) light edges, so path queries can be answered in O(log²n) time using segment trees on chains."
        }
      ]
    },

    {
      id: 27,
      topic: "Advanced",
      functionName: "centroid_decomposition",
      difficulty: "Hard",
      question: "What's the missing line in Centroid Decomposition?",
      code: `def centroid_decomposition(tree):
    n = len(tree)
    removed = [False] * n
    
    def get_size(v, parent):
        size = 1
        for u in tree[v]:
            if u != parent and not removed[u]:
                size += get_size(u, v)
        return size
    
    def find_centroid(v, parent, tree_size):
        for u in tree[v]:
            if u != parent and not removed[u]:
                subtree_size = get_size(u, v)
                # MISSING CONDITION - when is u a centroid?
                if subtree_size > tree_size // 2:
                    return find_centroid(u, v, tree_size)
        return v
    
    def decompose(v):
        tree_size = get_size(v, -1)
        centroid = find_centroid(v, -1, tree_size)
        
        removed[centroid] = True
        
        # Process centroid (solve subproblems involving centroid)
        process_centroid(centroid)
        
        # Recursively decompose each subtree
        for u in tree[centroid]:
            if not removed[u]:
                decompose(u)
    
    decompose(0)`,
      options: [
        "if subtree_size > tree_size // 2:",
        "if subtree_size >= tree_size // 2:",
        "if subtree_size == tree_size // 2:",
        "if subtree_size < tree_size // 2:"
      ],
      correctAnswer: 0,
      hint: "A centroid is a node whose removal results in no subtree having more than half the original nodes.",
      explanation: "If any subtree has more than tree_size//2 nodes, then the centroid must be in that subtree. We recursively search until we find a node where no subtree exceeds half the size.",
      followUpQuestions: [
        {
          question: "What's the depth of the centroid decomposition tree?",
          options: [
            "O(log n) - each level reduces tree size by at least half",
            "O(n) - in the worst case it's a path",
            "O(√n) - based on square root decomposition",
            "O(1) - constant depth"
          ],
          correctAnswer: 0,
          explanation: "Since removing a centroid splits the tree into components of size at most n/2, the decomposition depth is O(log n)."
        }
      ]
    },

    // Additional Shortest Path Questions
    {
      id: 28,
      topic: "Shortest Paths",
      functionName: "spfa_algorithm",
      difficulty: "Medium",
      question: "What's the missing optimization in SPFA (Shortest Path Faster Algorithm)?",
      code: `def spfa(graph, start):
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    in_queue = [False] * n
    queue = deque([start])
    in_queue[start] = True
    count = [0] * n  # Number of times each vertex is relaxed
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                
                # MISSING OPTIMIZATION - when do we add to queue?
                if not in_queue[v]:
                    count[v] += 1
                    if count[v] >= n:
                        return None  # Negative cycle detected
                    queue.append(v)
                    in_queue[v] = True
    
    return dist`,
      options: [
        "if not in_queue[v]: # Only add if not already in queue",
        "if count[v] < n: # Only add if not relaxed too many times",
        "if dist[v] < float('inf'): # Only add if distance is finite",
        "Always add v to queue after relaxation"
      ],
      correctAnswer: 0,
      hint: "We should avoid adding the same vertex multiple times to the queue.",
      explanation: "SPFA optimization: only add a vertex to the queue if it's not already there. This prevents duplicate processing and improves performance.",
      followUpQuestions: [
        {
          question: "How does SPFA detect negative cycles?",
          options: [
            "If any vertex is relaxed n or more times",
            "If the queue becomes empty",
            "If any distance becomes negative",
            "If the algorithm runs for more than n iterations"
          ],
          correctAnswer: 0,
          explanation: "If a vertex is relaxed n or more times, it indicates a negative cycle, since in an n-vertex graph without negative cycles, each vertex needs at most n-1 relaxations."
        }
      ]
    },

    {
      id: 29,
      topic: "Shortest Paths",
      functionName: "bidirectional_dijkstra",
      difficulty: "Hard",
      question: "What's the missing termination condition in bidirectional Dijkstra?",
      code: `def bidirectional_dijkstra(graph, start, end):
    if start == end:
        return 0
    
    # Forward search from start
    dist_forward = {start: 0}
    pq_forward = [(0, start)]
    visited_forward = set()
    
    # Backward search from end  
    dist_backward = {end: 0}
    pq_backward = [(0, end)]
    visited_backward = set()
    
    best_path_length = float('inf')
    
    while pq_forward or pq_backward:
        # Expand forward search
        if pq_forward:
            d_f, u = heapq.heappop(pq_forward)
            if u in visited_forward:
                continue
            visited_forward.add(u)
            
            # MISSING CONDITION - when do we update best path?
            if u in visited_backward:
                best_path_length = min(best_path_length, d_f + dist_backward[u])
            
            # Early termination condition
            if d_f > best_path_length:
                break
                
            for v, weight in graph[u]:
                if v not in visited_forward:
                    new_dist = d_f + weight
                    if v not in dist_forward or new_dist < dist_forward[v]:
                        dist_forward[v] = new_dist
                        heapq.heappush(pq_forward, (new_dist, v))
        
        # Similar logic for backward search...
    
    return best_path_length if best_path_length != float('inf') else -1`,
      options: [
        "if u in visited_backward: best_path_length = min(best_path_length, d_f + dist_backward[u])",
        "if u in dist_backward: best_path_length = d_f + dist_backward[u]",
        "if u == end: return d_f",
        "if d_f >= best_path_length: break"
      ],
      correctAnswer: 0,
      hint: "We found a path when forward and backward searches meet at a common vertex.",
      explanation: "When a vertex u is visited by forward search and already visited by backward search, we've found a path of length dist_forward[u] + dist_backward[u].",
      followUpQuestions: [
        {
          question: "Why is bidirectional search faster than regular Dijkstra?",
          options: [
            "Reduces search space from O(b^d) to O(b^(d/2)) where b is branching factor",
            "Uses better data structures",
            "Has better time complexity",
            "Finds approximate solutions faster"
          ],
          correctAnswer: 0,
          explanation: "Bidirectional search explores roughly O(b^(d/2)) nodes from each direction instead of O(b^d) nodes in one direction, significantly reducing the search space."
        }
      ]
    },

    // Additional BFS & DFS Questions  
    {
      id: 30,
      topic: "BFS & DFS",
      functionName: "iterative_deepening",
      difficulty: "Medium",
      question: "What's the key advantage of Iterative Deepening DFS?",
      code: `def iterative_deepening_dfs(graph, start, target, max_depth):
    def dfs_limited(node, target, depth, visited):
        if depth == 0:
            return node == target
        if node == target:
            return True
            
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs_limited(neighbor, target, depth - 1, visited):
                    return True
        visited.remove(node)
        return False
    
    # MISSING LOGIC - how do we use different depth limits?
    for depth in range(max_depth + 1):
        visited = set()
        if dfs_limited(start, target, depth, visited):
            return depth
    
    return -1  # Target not found within max_depth`,
      options: [
        "Combines DFS space efficiency with BFS optimality",
        "Always faster than regular DFS",
        "Uses less memory than BFS",
        "Finds all solutions at each depth"
      ],
      correctAnswer: 0,
      hint: "Think about what properties of BFS and DFS are combined.",
      explanation: "Iterative Deepening DFS combines the space efficiency of DFS (O(d)) with the optimality of BFS (finds shortest path). It repeatedly performs depth-limited DFS with increasing depth limits.",
      followUpQuestions: [
        {
          question: "What's the time complexity compared to regular BFS?",
          options: [
            "Same asymptotic complexity O(b^d) but with higher constant factor",
            "Better than BFS: O(b^(d-1))",
            "Worse than BFS: O(b^(d+1))",
            "Exponentially worse than BFS"
          ],
          correctAnswer: 0,
          explanation: "IDDFS has the same O(b^d) complexity as BFS, but revisits nodes multiple times. However, most work is done at the deepest level, so the overhead is manageable."
        }
      ]
    },

    // Eulerian Path & Hamiltonian Cycle Questions
    {
      id: 31,
      topic: "Eulerian Path",
      functionName: "reconstruct_itinerary",
      difficulty: "Hard",
      question: "What's the missing line in Hierholzer's algorithm for finding Eulerian path?",
      code: `def findItinerary(tickets):
    from collections import defaultdict, deque
    
    # Build adjacency list (sorted for lexicographical order)
    graph = defaultdict(list)
    for src, dst in tickets:
        graph[src].append(dst)
    
    # Sort destinations for lexicographical order
    for src in graph:
        graph[src].sort()
    
    def dfs(node):
        # MISSING LINE - how do we process neighbors?
        while graph[node]:
            next_node = graph[node].pop(0)
            dfs(next_node)
        path.append(node)
    
    path = []
    dfs("JFK")
    return path[::-1]`,
      options: [
        "while graph[node]: next_node = graph[node].pop(0); dfs(next_node)",
        "for neighbor in graph[node]: dfs(neighbor)",
        "if graph[node]: dfs(graph[node][0])",
        "while graph[node]: dfs(graph[node].pop())"
      ],
      correctAnswer: 0,
      hint: "Hierholzer's algorithm removes edges as it traverses them to avoid revisiting.",
      explanation: "In Hierholzer's algorithm, we must remove edges as we traverse them. Using pop(0) ensures we visit destinations in lexicographical order while removing the edge.",
      followUpQuestions: [
        {
          question: "What's the difference between Eulerian path and Hamiltonian path?",
          options: [
            "Eulerian visits every edge once, Hamiltonian visits every vertex once",
            "Eulerian visits every vertex once, Hamiltonian visits every edge once",
            "Both are the same concept",
            "Eulerian is for directed graphs, Hamiltonian for undirected"
          ],
          correctAnswer: 0,
          explanation: "Eulerian path visits every edge exactly once, while Hamiltonian path visits every vertex exactly once. Eulerian is polynomial-time solvable, Hamiltonian is NP-hard."
        }
      ]
    },

    {
      id: 32,
      topic: "Eulerian Path",
      functionName: "valid_arrangement_pairs",
      difficulty: "Hard",
      question: "What condition must be satisfied for an Eulerian path to exist in a directed graph?",
      code: `def validArrangement(pairs):
    from collections import defaultdict, deque
    
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    out_degree = defaultdict(int)
    
    # Build graph and calculate degrees
    for start, end in pairs:
        graph[start].append(end)
        out_degree[start] += 1
        in_degree[end] += 1
    
    # Find starting node for Eulerian path
    start_node = pairs[0][0]  # default
    
    # MISSING CONDITION - when does Eulerian path exist?
    for node in graph:
        if out_degree[node] - in_degree[node] == 1:
            start_node = node
            break
    
    # DFS to find Eulerian path
    def dfs(node):
        while graph[node]:
            dfs(graph[node].pop())
        path.append(node)
    
    path = []
    dfs(start_node)
    return [[path[i+1], path[i]] for i in range(len(path)-1)]`,
      options: [
        "At most one node has out_degree - in_degree = 1, at most one has in_degree - out_degree = 1",
        "All nodes have equal in_degree and out_degree",
        "Exactly one node has out_degree > in_degree",
        "The graph must be strongly connected"
      ],
      correctAnswer: 0,
      hint: "Think about where the path can start and end.",
      explanation: "For Eulerian path in directed graph: at most one node can have out_degree - in_degree = 1 (start), at most one can have in_degree - out_degree = 1 (end), all others must have equal in/out degrees.",
      followUpQuestions: [
        {
          question: "What's the time complexity of Hierholzer's algorithm?",
          options: [
            "O(E) where E is number of edges",
            "O(V + E) where V is vertices, E is edges",
            "O(V²) where V is number of vertices",
            "O(E log E) due to sorting"
          ],
          correctAnswer: 0,
          explanation: "Hierholzer's algorithm visits each edge exactly once, so time complexity is O(E). Each edge is processed once when traversed and removed."
        }
      ]
    },

    {
      id: 33,
      topic: "Hamiltonian Cycle",
      functionName: "traveling_salesman_dp",
      difficulty: "Hard",
      question: "What's the missing line in TSP using DP with bitmasks?",
      code: `def tsp(distances):
    n = len(distances)
    # dp[mask][i] = minimum cost to visit all cities in mask, ending at city i
    dp = {}
    
    def solve(mask, pos):
        if mask == (1 << n) - 1:  # All cities visited
            return distances[pos][0]  # Return to start
        
        if (mask, pos) in dp:
            return dp[(mask, pos)]
        
        ans = float('inf')
        for city in range(n):
            # MISSING CONDITION - when can we visit this city?
            if mask & (1 << city) == 0:  # City not visited
                new_mask = mask | (1 << city)
                ans = min(ans, distances[pos][city] + solve(new_mask, city))
        
        dp[(mask, pos)] = ans
        return ans
    
    # Start from city 0 with only city 0 visited
    return solve(1, 0)`,
      options: [
        "if mask & (1 << city) == 0:  # City not visited",
        "if mask & (1 << city) == 1:  # City visited",
        "if city != pos:  # Different from current city",
        "if distances[pos][city] < float('inf'):  # Edge exists"
      ],
      correctAnswer: 0,
      hint: "We can only visit cities that haven't been visited yet.",
      explanation: "We use bitmask to track visited cities. If mask & (1 << city) == 0, it means the bit for that city is 0, so the city hasn't been visited yet.",
      followUpQuestions: [
        {
          question: "What's the time complexity of TSP with DP and bitmasks?",
          options: [
            "O(2^n × n²) where n is number of cities",
            "O(n!) factorial time",
            "O(n³) cubic time",
            "O(2^n) exponential in cities only"
          ],
          correctAnswer: 0,
          explanation: "There are 2^n possible masks (subsets of cities) and n possible ending positions, giving 2^n × n states. Each state considers n transitions, so total is O(2^n × n²)."
        }
      ]
    },

    // Network Flow & Bipartite Matching Questions
    {
      id: 34,
      topic: "Max Flow",
      functionName: "hopcroft_karp_matching",
      difficulty: "Hard",
      question: "What's the key optimization in Hopcroft-Karp over basic bipartite matching?",
      code: `def hopcroftKarp(graph, n, m):
    # n = left nodes, m = right nodes
    pair_u = [-1] * (n + 1)  # pair_u[u] = v means u is matched to v
    pair_v = [-1] * (m + 1)  # pair_v[v] = u means v is matched to u
    dist = [0] * (n + 1)
    
    def bfs():
        queue = []
        for u in range(1, n + 1):
            if pair_u[u] == -1:  # Unmatched left node
                dist[u] = 0
                queue.append(u)
            else:
                dist[u] = float('inf')
        
        dist[0] = float('inf')
        
        while queue:
            u = queue.pop(0)
            if dist[u] < dist[0]:
                for v in graph[u]:
                    # MISSING OPTIMIZATION - what makes this faster?
                    if dist[pair_v[v]] == float('inf'):
                        dist[pair_v[v]] = dist[u] + 1
                        queue.append(pair_v[v])
        
        return dist[0] != float('inf')
    
    def dfs(u):
        if u != 0:
            for v in graph[u]:
                if dist[pair_v[v]] == dist[u] + 1:
                    if dfs(pair_v[v]):
                        pair_v[v] = u
                        pair_u[u] = v
                        return True
            dist[u] = float('inf')
            return False
        return True
    
    matching = 0
    while bfs():
        for u in range(1, n + 1):
            if pair_u[u] == -1 and dfs(u):
                matching += 1
    
    return matching`,
      options: [
        "Finds multiple augmenting paths simultaneously using BFS layering",
        "Uses better data structures like priority queues",
        "Applies greedy matching first",
        "Uses randomization to find paths faster"
      ],
      correctAnswer: 0,
      hint: "Think about how BFS creates layers and allows parallel path finding.",
      explanation: "Hopcroft-Karp finds multiple vertex-disjoint augmenting paths simultaneously by using BFS to create layers, then DFS to find all augmenting paths in those layers. This reduces complexity from O(VE) to O(E√V).",
      followUpQuestions: [
        {
          question: "What's the time complexity improvement of Hopcroft-Karp?",
          options: [
            "From O(VE) to O(E√V)",
            "From O(V³) to O(V²)",
            "From O(E²) to O(E log E)",
            "From exponential to polynomial"
          ],
          correctAnswer: 0,
          explanation: "Hopcroft-Karp improves from O(VE) of basic augmenting path algorithms to O(E√V) by finding multiple augmenting paths per phase."
        }
      ]
    },

    {
      id: 35,
      topic: "Bipartite",
      functionName: "halls_marriage_theorem",
      difficulty: "Medium",
      question: "What does Hall's Marriage Theorem state about perfect matching existence?",
      code: `def halls_condition_check(graph, n, m):
    # Check Hall's condition for perfect matching
    # graph[i] contains neighbors of left node i
    
    from itertools import combinations
    
    for size in range(1, n + 1):
        for subset in combinations(range(n), size):
            neighbors = set()
            for u in subset:
                neighbors.update(graph[u])
            
            # MISSING CONDITION - Hall's theorem condition
            if len(neighbors) < len(subset):
                return False, f"Subset {subset} violates Hall's condition"
    
    return True, "Hall's condition satisfied"`,
      options: [
        "For every subset S of left vertices, |N(S)| ≥ |S|",
        "For every subset S of left vertices, |N(S)| = |S|",
        "For every vertex u, degree(u) ≥ 1",
        "The graph must be connected"
      ],
      correctAnswer: 0,
      hint: "Hall's theorem relates the size of vertex subsets to their neighborhoods.",
      explanation: "Hall's Marriage Theorem: A perfect matching exists in a bipartite graph if and only if for every subset S of left vertices, the neighborhood N(S) has at least |S| vertices.",
      followUpQuestions: [
        {
          question: "Why is Hall's theorem useful in practice?",
          options: [
            "Gives necessary and sufficient condition without finding the actual matching",
            "Provides a faster matching algorithm",
            "Works for weighted graphs",
            "Handles dynamic graph updates"
          ],
          correctAnswer: 0,
          explanation: "Hall's theorem gives us a way to verify if perfect matching exists without actually constructing it, which can be useful for feasibility checking."
        }
      ]
    },

    // Advanced Graph Algorithms
    {
      id: 36,
      topic: "Advanced",
      functionName: "articulation_points",
      difficulty: "Hard",
      question: "What's the missing condition for finding articulation points in Tarjan's algorithm?",
      code: `def find_articulation_points(graph):
    n = len(graph)
    visited = [False] * n
    disc = [0] * n
    low = [0] * n
    parent = [-1] * n
    ap = [False] * n
    time = [0]
    
    def tarjan_dfs(u):
        children = 0
        visited[u] = True
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        for v in graph[u]:
            if not visited[v]:
                parent[v] = u
                children += 1
                tarjan_dfs(v)
                low[u] = min(low[u], low[v])
                
                # MISSING CONDITIONS - when is u an articulation point?
                if (parent[u] == -1 and children > 1) or (parent[u] != -1 and low[v] >= disc[u]):
                    ap[u] = True
            elif v != parent[u]:
                low[u] = min(low[u], disc[v])
    
    for i in range(n):
        if not visited[i]:
            tarjan_dfs(i)
    
    return [i for i in range(n) if ap[i]]`,
      options: [
        "(parent[u] == -1 and children > 1) or (parent[u] != -1 and low[v] >= disc[u])",
        "(parent[u] == -1 and children >= 1) or (parent[u] != -1 and low[v] > disc[u])",
        "(parent[u] != -1 and children > 1) or (parent[u] == -1 and low[v] >= disc[u])",
        "low[v] >= disc[u] for all children v"
      ],
      correctAnswer: 0,
      hint: "Root needs >1 children, non-root needs no back edge from subtree to ancestors.",
      explanation: "Root is articulation point if it has >1 children. Non-root u is articulation point if there's a child v where no vertex in v's subtree can reach u's ancestors (low[v] >= disc[u]).",
      followUpQuestions: [
        {
          question: "What's the relationship between bridges and articulation points?",
          options: [
            "Bridges are critical edges, articulation points are critical vertices",
            "They're the same concept for different graph types",
            "Bridges only exist in trees, articulation points in general graphs",
            "Articulation points always connect bridges"
          ],
          correctAnswer: 0,
          explanation: "Bridges are edges whose removal increases connected components, while articulation points are vertices whose removal increases connected components."
        }
      ]
    },

    {
      id: 37,
      topic: "Advanced",
      functionName: "network_flow_applications",
      difficulty: "Hard",
      question: "How do we model maximum bipartite matching as a network flow problem?",
      code: `def max_bipartite_matching_as_flow(left_nodes, right_nodes, edges):
    # Model bipartite matching as max flow problem
    
    # Create flow network:
    # - Add source s and sink t
    # - Connect s to all left nodes with capacity 1
    # - Connect all right nodes to t with capacity 1
    # - Original edges have capacity 1
    
    from collections import defaultdict, deque
    
    def max_flow_edmonds_karp(graph, source, sink):
        def bfs_find_path():
            visited = set([source])
            queue = deque([(source, [source])])
            
            while queue:
                node, path = queue.popleft()
                for neighbor in graph[node]:
                    if neighbor not in visited and graph[node][neighbor] > 0:
                        new_path = path + [neighbor]
                        if neighbor == sink:
                            return new_path
                        visited.add(neighbor)
                        queue.append((neighbor, new_path))
            return None
        
        max_flow = 0
        while True:
            path = bfs_find_path()
            if not path:
                break
            
            # MISSING STEP - how do we update capacities?
            flow = min(graph[path[i]][path[i+1]] for i in range(len(path)-1))
            for i in range(len(path)-1):
                graph[path[i]][path[i+1]] -= flow
                graph[path[i+1]][path[i]] += flow
            max_flow += flow
        
        return max_flow
    
    # Build flow network
    n_left, n_right = len(left_nodes), len(right_nodes)
    source, sink = 0, n_left + n_right + 1
    
    flow_graph = defaultdict(lambda: defaultdict(int))
    
    # Source to left nodes
    for i in range(1, n_left + 1):
        flow_graph[source][i] = 1
    
    # Right nodes to sink  
    for i in range(n_left + 1, n_left + n_right + 1):
        flow_graph[i][sink] = 1
    
    # Bipartite edges
    for u, v in edges:
        flow_graph[u + 1][v + n_left + 1] = 1
    
    return max_flow_edmonds_karp(flow_graph, source, sink)`,
      options: [
        "Find bottleneck flow and update forward/backward capacities",
        "Add flow to all edges in the path",
        "Remove the path from the graph",
        "Increase all edge capacities by the flow amount"
      ],
      correctAnswer: 0,
      hint: "Think about how residual graphs work in max flow algorithms.",
      explanation: "In each iteration, we find the minimum capacity along the augmenting path (bottleneck), then decrease forward edge capacities and increase backward edge capacities by this flow amount.",
      followUpQuestions: [
        {
          question: "Why does max flow give us maximum bipartite matching?",
          options: [
            "Each unit of flow corresponds to one matching edge due to capacity constraints",
            "Flow algorithms are faster than matching algorithms",
            "It handles weighted matching better",
            "It works for non-bipartite graphs too"
          ],
          correctAnswer: 0,
          explanation: "With unit capacities, each unit of flow from source to sink corresponds to a vertex-disjoint path, which represents one matching edge in the bipartite graph."
        }
      ]
    },

    {
      id: 38,
      topic: "Advanced",
      functionName: "2sat_problem",
      difficulty: "Hard",
      question: "How do we solve 2-SAT using strongly connected components?",
      code: `def solve_2sat(clauses, n):
    # Each variable x_i has two nodes: 2*i (x_i) and 2*i+1 (¬x_i)
    # For clause (a OR b), add implications: ¬a → b and ¬b → a
    
    from collections import defaultdict
    
    graph = defaultdict(list)
    
    def add_clause(a, b):
        # a and b are literals: positive for x_i, negative for ¬x_i
        # Convert to node indices
        if a > 0:
            not_a = 2 * (a - 1) + 1  # ¬x_{a-1}
            a_node = 2 * (a - 1)     # x_{a-1}
        else:
            not_a = 2 * (-a - 1)     # x_{-a-1}  
            a_node = 2 * (-a - 1) + 1 # ¬x_{-a-1}
        
        if b > 0:
            not_b = 2 * (b - 1) + 1  # ¬x_{b-1}
            b_node = 2 * (b - 1)     # x_{b-1}
        else:
            not_b = 2 * (-b - 1)     # x_{-b-1}
            b_node = 2 * (-b - 1) + 1 # ¬x_{-b-1}
        
        # MISSING IMPLICATIONS - what edges do we add for (a OR b)?
        graph[not_a].append(b_node)  # ¬a → b
        graph[not_b].append(a_node)  # ¬b → a
    
    # Build implication graph
    for a, b in clauses:
        add_clause(a, b)
    
    # Find SCCs using Kosaraju's algorithm
    def kosaraju_scc():
        # ... SCC implementation
        pass
    
    sccs = kosaraju_scc()
    
    # Check satisfiability
    for i in range(n):
        x_i = 2 * i      # x_i
        not_x_i = 2 * i + 1  # ¬x_i
        
        # If x_i and ¬x_i are in same SCC, unsatisfiable
        if sccs[x_i] == sccs[not_x_i]:
            return False, []
    
    return True, []  # Satisfiable`,
      options: [
        "graph[not_a].append(b_node) and graph[not_b].append(a_node)",
        "graph[a_node].append(b_node) and graph[b_node].append(a_node)",
        "graph[not_a].append(not_b) and graph[not_b].append(not_a)",
        "graph[a_node].append(not_b) and graph[b_node].append(not_a)"
      ],
      correctAnswer: 0,
      hint: "For (a OR b), if a is false then b must be true, and vice versa.",
      explanation: "For clause (a OR b), we add implications ¬a → b and ¬b → a. If a is false, then b must be true to satisfy the clause, and vice versa.",
      followUpQuestions: [
        {
          question: "Why does 2-SAT have polynomial solution while 3-SAT is NP-complete?",
          options: [
            "2-SAT reduces to SCC finding which is polynomial, 3-SAT doesn't have this structure",
            "2-SAT has fewer variables than 3-SAT",
            "2-SAT uses simpler logical operations",
            "2-SAT can be solved greedily"
          ],
          correctAnswer: 0,
          explanation: "2-SAT can be modeled as implication graph where SCC structure determines satisfiability in polynomial time. 3-SAT lacks this implication structure and requires exponential search."
        }
      ]
    },

    // Additional SCC & Bridges Questions (need 5 missing lines + 3-5 conceptual + 3 optimization)
    {
      id: 39,
      topic: "SCC & Bridges",
      functionName: "tarjan_scc_missing_line",
      difficulty: "Hard",
      question: "What's the missing line in Tarjan's SCC algorithm for handling the stack?",
      code: `def tarjan_scc(graph):
    n = len(graph)
    index = 0
    stack = []
    indices = [-1] * n
    lowlinks = [-1] * n
    on_stack = [False] * n
    sccs = []
    
    def strongconnect(v):
        nonlocal index
        indices[v] = index
        lowlinks[v] = index
        index += 1
        stack.append(v)
        on_stack[v] = True
        
        for w in graph[v]:
            if indices[w] == -1:
                strongconnect(w)
                lowlinks[v] = min(lowlinks[v], lowlinks[w])
            elif on_stack[w]:
                lowlinks[v] = min(lowlinks[v], indices[w])
        
        # MISSING LINE - when do we pop an SCC from stack?
        if lowlinks[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    for v in range(n):
        if indices[v] == -1:
            strongconnect(v)
    
    return sccs`,
      options: [
        "if lowlinks[v] == indices[v]:",
        "if lowlinks[v] < indices[v]:",
        "if on_stack[v] == True:",
        "if len(stack) > 0:"
      ],
      correctAnswer: 0,
      hint: "An SCC root is identified when lowlink equals the discovery index.",
      explanation: "When lowlinks[v] == indices[v], vertex v is the root of an SCC. All vertices above v in the stack belong to this SCC and should be popped.",
      followUpQuestions: [
        {
          question: "Why do we need the on_stack array in Tarjan's algorithm?",
          options: [
            "To distinguish between cross edges and back edges to ancestors",
            "To track visited vertices",
            "To optimize memory usage",
            "To handle disconnected components"
          ],
          correctAnswer: 0,
          explanation: "on_stack helps distinguish between back edges to ancestors (part of current SCC) and cross edges to already processed SCCs."
        }
      ]
    },

    {
      id: 40,
      topic: "SCC & Bridges",
      functionName: "bridge_detection_optimization",
      difficulty: "Medium",
      question: "What optimization can be applied to bridge detection in dense graphs?",
      code: `def find_bridges_optimized(adj_matrix):
    n = len(adj_matrix)
    visited = [False] * n
    disc = [0] * n
    low = [0] * n
    parent = [-1] * n
    bridges = []
    time = [0]
    
    def bridge_dfs(u):
        visited[u] = True
        disc[u] = low[u] = time[0]
        time[0] += 1
        
        # OPTIMIZATION - how to handle adjacency matrix efficiently?
        for v in range(n):
            if adj_matrix[u][v] == 1:  # Edge exists
                if not visited[v]:
                    parent[v] = u
                    bridge_dfs(v)
                    low[u] = min(low[u], low[v])
                    if low[v] > disc[u]:
                        bridges.append((u, v))
                elif v != parent[u]:
                    low[u] = min(low[u], disc[v])
    
    for i in range(n):
        if not visited[i]:
            bridge_dfs(i)
    
    return bridges`,
      options: [
        "Use adjacency list instead of matrix for sparse graphs",
        "Use bit manipulation for the adjacency matrix",
        "Parallelize the DFS traversal",
        "Use BFS instead of DFS"
      ],
      correctAnswer: 0,
      hint: "Consider the space and time complexity difference between representations.",
      explanation: "For sparse graphs, adjacency list representation is more efficient (O(V+E) vs O(V²) space). For dense graphs, matrix might be acceptable, but list is generally better.",
      followUpQuestions: [
        {
          question: "What's the space complexity of adjacency matrix vs adjacency list?",
          options: [
            "Matrix: O(V²), List: O(V+E)",
            "Matrix: O(V+E), List: O(V²)",
            "Both are O(V²)",
            "Both are O(V+E)"
          ],
          correctAnswer: 0,
          explanation: "Adjacency matrix always uses O(V²) space regardless of edge count. Adjacency list uses O(V+E) space, which is better for sparse graphs."
        }
      ]
    },

    {
      id: 41,
      topic: "SCC & Bridges",
      functionName: "scc_applications",
      difficulty: "Medium",
      question: "Which problem can be efficiently solved using SCC decomposition?",
      code: `# SCC Applications:

# 1. 2-SAT Problem
def solve_2sat_with_scc(clauses):
    # Build implication graph
    # Find SCCs
    # Check if xi and ¬xi are in same SCC
    pass

# 2. Dependency Resolution
def resolve_dependencies_with_scc(dependencies):
    # Build dependency graph
    # Find SCCs (circular dependencies)
    # Topologically sort SCCs
    pass

# 3. Web Page Ranking
def page_rank_with_scc(web_graph):
    # Find strongly connected components
    # Rank pages within each component
    # Handle inter-component links
    pass`,
      options: [
        "All of the above: 2-SAT, dependency resolution, and web ranking",
        "Only 2-SAT problems",
        "Only dependency resolution",
        "Only web page ranking"
      ],
      correctAnswer: 0,
      hint: "SCCs help identify circular dependencies and logical consistency.",
      explanation: "SCCs are useful for: 2-SAT (checking satisfiability), dependency resolution (detecting cycles), web ranking (identifying strongly connected page clusters), and many other applications.",
      followUpQuestions: [
        {
          question: "Why is SCC useful for 2-SAT?",
          options: [
            "If xi and ¬xi are in same SCC, the formula is unsatisfiable",
            "SCCs help find the optimal assignment faster",
            "SCCs reduce the problem size",
            "SCCs eliminate redundant clauses"
          ],
          correctAnswer: 0,
          explanation: "In 2-SAT implication graph, if a variable and its negation are in the same SCC, they must have the same truth value, which is impossible."
        }
      ]
    },

    {
      id: 42,
      topic: "SCC & Bridges",
      functionName: "kosaraju_vs_tarjan",
      difficulty: "Medium",
      question: "What's the main difference between Kosaraju's and Tarjan's SCC algorithms?",
      code: `# Kosaraju's Algorithm:
def kosaraju_scc(graph):
    # Step 1: DFS on original graph, record finish times
    # Step 2: Create transpose graph
    # Step 3: DFS on transpose in reverse finish order
    pass

# Tarjan's Algorithm:  
def tarjan_scc(graph):
    # Single DFS pass with stack
    # Use lowlink values to identify SCC roots
    # Pop SCCs when root is found
    pass`,
      options: [
        "Kosaraju uses two DFS passes, Tarjan uses one DFS pass",
        "Kosaraju is faster than Tarjan",
        "Kosaraju works only on undirected graphs",
        "Tarjan requires more memory than Kosaraju"
      ],
      correctAnswer: 0,
      hint: "Think about the number of graph traversals required.",
      explanation: "Kosaraju's algorithm requires two DFS passes (one on original graph, one on transpose). Tarjan's algorithm uses a single DFS pass with a stack to identify SCCs on-the-fly.",
      followUpQuestions: [
        {
          question: "Which algorithm is better for online SCC detection?",
          options: [
            "Tarjan's - it finds SCCs in single pass",
            "Kosaraju's - it's simpler to implement",
            "Both are equally good",
            "Neither works for online detection"
          ],
          correctAnswer: 0,
          explanation: "Tarjan's algorithm is better for online detection as it identifies SCCs during the single DFS traversal, while Kosaraju needs to complete the first pass before starting the second."
        }
      ]
    },

    {
      id: 43,
      topic: "SCC & Bridges",
      functionName: "bridge_connectivity_query",
      difficulty: "Hard",
      question: "How do we handle dynamic bridge queries efficiently?",
      code: `class DynamicBridges:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.bridges = set()
    
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
        # MISSING LOGIC - how to update bridges efficiently?
        if not self.is_connected_without_edge(u, v):
            self.bridges.add((min(u,v), max(u,v)))
    
    def remove_edge(self, u, v):
        self.adj[u].remove(v)
        self.adj[v].remove(u)
        # Check if this was a bridge
        edge = (min(u,v), max(u,v))
        if edge in self.bridges:
            self.bridges.remove(edge)
    
    def is_bridge(self, u, v):
        return (min(u,v), max(u,v)) in self.bridges`,
      options: [
        "Use link-cut trees or dynamic connectivity data structures",
        "Recompute all bridges after each update",
        "Use Union-Find with rollback",
        "Maintain a spanning tree"
      ],
      correctAnswer: 0,
      hint: "Dynamic bridge detection requires advanced data structures for efficiency.",
      explanation: "Dynamic bridge detection efficiently requires link-cut trees or other dynamic connectivity structures. Naive recomputation is O(V+E) per update, while advanced structures can achieve O(log V) amortized.",
      followUpQuestions: [
        {
          question: "What's the complexity of naive bridge recomputation vs link-cut trees?",
          options: [
            "Naive: O(V+E) per update, Link-cut: O(log V) amortized",
            "Naive: O(V²) per update, Link-cut: O(V) amortized", 
            "Both have same complexity",
            "Link-cut trees are always slower"
          ],
          correctAnswer: 0,
          explanation: "Naive recomputation runs Tarjan's algorithm (O(V+E)) after each update. Link-cut trees maintain dynamic connectivity in O(log V) amortized time per operation."
        }
      ]
    },

    // Additional Max Flow Questions
    {
      id: 44,
      topic: "Max Flow",
      functionName: "dinic_algorithm",
      difficulty: "Hard",
      question: "What's the missing optimization in Dinic's algorithm?",
      code: `def dinic_max_flow(graph, source, sink):
    def bfs_level():
        level = [-1] * len(graph)
        level[source] = 0
        queue = [source]
        
        while queue:
            u = queue.pop(0)
            for v in range(len(graph)):
                if level[v] == -1 and graph[u][v] > 0:
                    level[v] = level[u] + 1
                    queue.append(v)
        
        return level[sink] != -1, level
    
    def dfs_blocking_flow(u, sink, flow, level, start):
        if u == sink:
            return flow
        
        # MISSING OPTIMIZATION - current edge optimization
        for i in range(start[u], len(graph)):
            v = i
            if level[v] == level[u] + 1 and graph[u][v] > 0:
                bottleneck = min(flow, graph[u][v])
                pushed = dfs_blocking_flow(v, sink, bottleneck, level, start)
                if pushed > 0:
                    graph[u][v] -= pushed
                    graph[v][u] += pushed
                    return pushed
            start[u] += 1  # Current edge optimization
        
        return 0
    
    max_flow = 0
    while True:
        reachable, level = bfs_level()
        if not reachable:
            break
        
        start = [0] * len(graph)
        while True:
            flow = dfs_blocking_flow(source, sink, float('inf'), level, start)
            if flow == 0:
                break
            max_flow += flow
    
    return max_flow`,
      options: [
        "Current edge optimization: start[u] tracks next edge to try",
        "Use priority queue in BFS",
        "Precompute all shortest paths",
        "Use randomized edge selection"
      ],
      correctAnswer: 0,
      hint: "Dinic's algorithm avoids re-examining useless edges in the same level.",
      explanation: "Current edge optimization in Dinic's algorithm maintains start[u] to track the next edge to examine from vertex u, avoiding re-examination of edges that can't contribute to blocking flow in the current level.",
      followUpQuestions: [
        {
          question: "What's the time complexity of Dinic's algorithm?",
          options: [
            "O(V² × E) in general, O(V^(3/2) × E) for unit capacities",
            "O(V × E²) for all cases",
            "O(V³) for dense graphs",
            "O(E × log V) with optimizations"
          ],
          correctAnswer: 0,
          explanation: "Dinic's algorithm runs in O(V² × E) time generally. For unit capacity networks (like bipartite matching), it achieves O(V^(3/2) × E) complexity."
        }
      ]
    },

    {
      id: 45,
      topic: "Max Flow",
      functionName: "min_cut_applications",
      difficulty: "Medium",
      question: "How does max-flow min-cut theorem apply to image segmentation?",
      code: `def image_segmentation_max_flow(image, foreground_seeds, background_seeds):
    height, width = len(image), len(image[0])
    
    # Create flow network:
    # - Each pixel is a vertex
    # - Add source (connected to foreground seeds)
    # - Add sink (connected to background seeds)  
    # - Edge capacities based on pixel similarity
    
    def pixel_to_node(i, j):
        return i * width + j
    
    def build_capacity_graph():
        n = height * width + 2  # +2 for source and sink
        source, sink = n - 2, n - 1
        capacity = [[0] * n for _ in range(n)]
        
        # Connect source to foreground seeds
        for i, j in foreground_seeds:
            capacity[source][pixel_to_node(i, j)] = float('inf')
        
        # Connect background seeds to sink
        for i, j in background_seeds:
            capacity[pixel_to_node(i, j)][sink] = float('inf')
        
        # MISSING LOGIC - how to set edge weights between pixels?
        for i in range(height):
            for j in range(width):
                for di, dj in [(0,1), (1,0), (0,-1), (-1,0)]:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < height and 0 <= nj < width:
                        # Edge weight based on pixel similarity
                        similarity = 255 - abs(image[i][j] - image[ni][nj])
                        capacity[pixel_to_node(i,j)][pixel_to_node(ni,nj)] = similarity
        
        return capacity, source, sink
    
    capacity, source, sink = build_capacity_graph()
    max_flow_value = edmonds_karp(capacity, source, sink)
    
    # Min-cut gives segmentation boundary
    return find_min_cut(capacity, source, sink)`,
      options: [
        "Edge weights represent pixel similarity - higher for similar pixels",
        "Edge weights represent pixel differences - higher for different pixels",
        "All edge weights should be equal",
        "Edge weights based on pixel coordinates"
      ],
      correctAnswer: 0,
      hint: "We want to cut between dissimilar pixels, so similar pixels should have high capacity.",
      explanation: "In image segmentation, edge capacities represent pixel similarity. High capacity between similar pixels makes them less likely to be separated by the min-cut, keeping similar regions together.",
      followUpQuestions: [
        {
          question: "Why does min-cut give us the optimal segmentation?",
          options: [
            "Min-cut minimizes the total dissimilarity across the boundary",
            "Min-cut maximizes the area of each segment",
            "Min-cut ensures equal-sized segments",
            "Min-cut minimizes the number of boundary pixels"
          ],
          correctAnswer: 0,
          explanation: "Min-cut finds the boundary that minimizes total edge weights (dissimilarity) being cut, giving the most natural segmentation based on pixel similarity."
        }
      ]
    },

    {
      id: 46,
      topic: "Max Flow",
      functionName: "push_relabel_algorithm",
      difficulty: "Hard",
      question: "What's the key operation in push-relabel max flow algorithm?",
      code: `def push_relabel_max_flow(graph, source, sink):
    n = len(graph)
    capacity = [row[:] for row in graph]  # Copy capacity matrix
    flow = [[0] * n for _ in range(n)]
    excess = [0] * n
    height = [0] * n
    
    # Initialize
    height[source] = n
    for v in range(n):
        if capacity[source][v] > 0:
            flow[source][v] = capacity[source][v]
            flow[v][source] = -capacity[source][v]
            excess[v] = capacity[source][v]
    
    def push(u, v):
        # MISSING LOGIC - how much flow to push?
        delta = min(excess[u], capacity[u][v] - flow[u][v])
        flow[u][v] += delta
        flow[v][u] -= delta
        excess[u] -= delta
        excess[v] += delta
    
    def relabel(u):
        # Find minimum height of admissible neighbors
        min_height = float('inf')
        for v in range(n):
            if capacity[u][v] - flow[u][v] > 0:
                min_height = min(min_height, height[v])
        height[u] = min_height + 1
    
    # Main algorithm
    while True:
        # Find vertex with excess (not source/sink)
        u = -1
        for i in range(n):
            if i != source and i != sink and excess[i] > 0:
                u = i
                break
        
        if u == -1:
            break
        
        # Try to push
        pushed = False
        for v in range(n):
            if capacity[u][v] - flow[u][v] > 0 and height[u] == height[v] + 1:
                push(u, v)
                pushed = True
                break
        
        if not pushed:
            relabel(u)
    
    return sum(flow[source])`,
      options: [
        "Push excess flow along admissible edges and relabel vertices",
        "Find augmenting paths using BFS",
        "Maintain level graphs like Dinic's algorithm",
        "Use shortest path algorithms"
      ],
      correctAnswer: 0,
      hint: "Push-relabel works locally by moving excess flow and adjusting vertex heights.",
      explanation: "Push-relabel algorithm works by maintaining excess flow at vertices and height labels. It pushes excess along admissible edges (where height difference is 1) and relabels vertices when no push is possible.",
      followUpQuestions: [
        {
          question: "What's the advantage of push-relabel over Ford-Fulkerson?",
          options: [
            "Better parallelization and doesn't need to find complete augmenting paths",
            "Always faster in practice",
            "Uses less memory",
            "Simpler to implement"
          ],
          correctAnswer: 0,
          explanation: "Push-relabel can be parallelized more easily and works locally without finding complete augmenting paths. It can achieve better theoretical bounds and is more suitable for parallel implementation."
        }
      ]
    },

    {
      id: 47,
      topic: "Max Flow",
      functionName: "flow_network_modeling",
      difficulty: "Medium",
      question: "How do we model vertex capacities in a flow network?",
      code: `def model_vertex_capacity_network(graph, vertex_capacities):
    # Original graph has vertex capacities
    # Need to convert to edge-capacity-only network
    
    n = len(graph)
    new_n = 2 * n  # Split each vertex into in and out
    new_graph = [[0] * new_n for _ in range(new_n)]
    
    for u in range(n):
        # MISSING LOGIC - how to handle vertex capacity?
        u_in, u_out = 2 * u, 2 * u + 1
        new_graph[u_in][u_out] = vertex_capacities[u]
        
        for v in range(n):
            if graph[u][v] > 0:  # Edge exists
                v_in, v_out = 2 * v, 2 * v + 1
                new_graph[u_out][v_in] = graph[u][v]
    
    return new_graph`,
      options: [
        "Split each vertex into in and out vertices connected by vertex capacity edge",
        "Add vertex capacity to all outgoing edges",
        "Use a separate constraint system",
        "Ignore vertex capacities in flow networks"
      ],
      correctAnswer: 0,
      hint: "Think about how to enforce a limit on total flow through a vertex.",
      explanation: "To model vertex capacities, split each vertex v into v_in and v_out, connected by an edge with capacity equal to vertex capacity. All incoming edges go to v_in, all outgoing edges start from v_out.",
      followUpQuestions: [
        {
          question: "Why does vertex splitting preserve the max flow value?",
          options: [
            "The bottleneck edge enforces the vertex capacity constraint",
            "It doubles the network size",
            "It creates more paths",
            "It simplifies the algorithm"
          ],
          correctAnswer: 0,
          explanation: "The edge from v_in to v_out with vertex capacity becomes a bottleneck that limits total flow through vertex v, exactly modeling the vertex capacity constraint."
        }
      ]
    },

    {
      id: 48,
      topic: "Max Flow",
      functionName: "multi_source_multi_sink",
      difficulty: "Medium",
      question: "How do we handle multiple sources and sinks in max flow?",
      code: `def multi_source_sink_max_flow(graph, sources, sinks):
    n = len(graph)
    
    # Create new graph with super source and super sink
    new_n = n + 2
    super_source, super_sink = n, n + 1
    new_graph = [[0] * new_n for _ in range(new_n)]
    
    # Copy original edges
    for u in range(n):
        for v in range(n):
            new_graph[u][v] = graph[u][v]
    
    # MISSING LOGIC - how to connect super source and sink?
    for source in sources:
        new_graph[super_source][source] = float('inf')
    
    for sink in sinks:
        new_graph[sink][super_sink] = float('inf')
    
    return edmonds_karp(new_graph, super_source, super_sink)`,
      options: [
        "Connect super source to all sources and all sinks to super sink with infinite capacity",
        "Run max flow between each source-sink pair and sum results",
        "Use the source with maximum outgoing capacity",
        "Merge all sources into one vertex"
      ],
      correctAnswer: 0,
      hint: "Create artificial super source and super sink to reduce to single source-sink problem.",
      explanation: "Add a super source connected to all original sources with infinite capacity, and connect all original sinks to a super sink with infinite capacity. This reduces the problem to standard single-source single-sink max flow.",
      followUpQuestions: [
        {
          question: "Why use infinite capacity for super source/sink connections?",
          options: [
            "To ensure they don't become bottlenecks in the flow",
            "To simplify the algorithm",
            "To handle negative flows",
            "To optimize performance"
          ],
          correctAnswer: 0,
          explanation: "Infinite capacity ensures that the super source/sink connections never limit the flow. The actual bottlenecks will be in the original network structure."
        }
      ]
    },

    // Additional BFS & DFS Questions
    {
      id: 49,
      topic: "BFS & DFS",
      functionName: "bidirectional_bfs",
      difficulty: "Hard",
      question: "What's the missing termination condition in bidirectional BFS?",
      code: `def bidirectional_bfs(graph, start, end):
    if start == end:
        return 0
    
    visited_forward = {start: 0}
    visited_backward = {end: 0}
    queue_forward = [start]
    queue_backward = [end]
    
    level = 0
    
    while queue_forward or queue_backward:
        level += 1
        
        # Always expand the smaller frontier to keep the search balanced and minimize total nodes explored
        if len(queue_forward) <= len(queue_backward):
            queue_forward, visited_forward, queue_backward, visited_backward =
                queue_backward, visited_backward, queue_forward, visited_forward
        
        next_queue = []
        for node in queue_forward:
            for neighbor in graph[node]:
                # MISSING CONDITION - when do we find the path? 
                # hints: When expanding from one direction, if we find a neighbor that was already visited by the other direction, the two searches have met → path found!
                    
                    return level + visited_backward[neighbor]
                
                if neighbor not in visited_forward:
                    visited_forward[neighbor] = level
                    next_queue.append(neighbor)
        
        queue_forward = next_queue
    
    return -1  # No path found`,
      options: [
        "if neighbor in visited_backward: return level + visited_backward[neighbor]",
        "if neighbor == end: return level",
        "if neighbor in visited_forward: return level",
        "if len(visited_forward) == len(visited_backward): return level"
      ],
      correctAnswer: 0,
      hint: "The path is found when the two search frontiers meet.",
      explanation: "When a neighbor of the current frontier is already visited by the opposite direction search, we've found the shortest path. The total distance is current level + distance from opposite direction.",
      followUpQuestions: [
        {
          question: "Why is bidirectional BFS faster than regular BFS?",
          options: [
            "Reduces search space from O(b^d) to O(b^(d/2)) where b is branching factor",
            "Uses better data structures",
            "Has better worst-case complexity",
            "Always finds shorter paths"
          ],
          correctAnswer: 0,
          explanation: "Bidirectional BFS explores O(b^(d/2)) nodes from each direction instead of O(b^d) from one direction, significantly reducing the search space for large distances."
        }
      ]
    },

    {
      id: 50,
      topic: "BFS & DFS",
      functionName: "dfs_strongly_connected",
      difficulty: "Medium",
      question: "How do we modify DFS to check if a directed graph is strongly connected?",
      code: `def is_strongly_connected(graph):
    n = len(graph)
    
    def dfs_all_reachable(start, adj_list):
        visited = [False] * n
        stack = [start]
        count = 0
        
        while stack:
            node = stack.pop()
            if not visited[node]:
                visited[node] = True
                count += 1
                for neighbor in adj_list[node]:
                    if not visited[neighbor]:
                        stack.append(neighbor)
        
        return count == n
    
    # Check if all vertices reachable from vertex 0
    if not dfs_all_reachable(0, graph):
        return False
    
    # MISSING STEP - what else do we need to check?
    transpose = [[] for _ in range(n)]
    for u in range(n):
        for v in graph[u]:
            transpose[v].append(u)
    
    return dfs_all_reachable(0, transpose)`,
      options: [
        "Check reachability in transpose graph from same starting vertex",
        "Check reachability from all vertices",
        "Run DFS from every vertex",
        "Check if graph has cycles"
      ],
      correctAnswer: 0,
      hint: "A graph is strongly connected if you can reach all vertices from any vertex in both directions.",
      explanation: "A directed graph is strongly connected if: (1) all vertices are reachable from any vertex, and (2) all vertices can reach any vertex. We check this by DFS on original graph and transpose graph from the same starting vertex.",
      followUpQuestions: [
        {
          question: "Why is checking the transpose graph sufficient?",
          options: [
            "If all vertices reachable from v in G and G^T, then G is strongly connected",
            "Transpose graph has the same connectivity properties",
            "It's more efficient than other methods",
            "It handles edge cases better"
          ],
          correctAnswer: 0,
          explanation: "If all vertices are reachable from vertex v in both G and G^T (transpose), then every vertex can reach every other vertex, which is the definition of strong connectivity."
        }
      ]
    },

    {
      id: 51,
      topic: "BFS & DFS",
      functionName: "dfs_topological_optimization",
      difficulty: "Medium",
      question: "What optimization can be applied to DFS-based topological sorting?",
      code: `def topological_sort_dfs_optimized(graph):
    n = len(graph)
    visited = [False] * n
    rec_stack = [False] * n  # For cycle detection
    result = []
    
    def dfs(node):
        if rec_stack[node]:  # Back edge found - cycle exists
            return False
        
        if visited[node]:
            return True
        
        visited[node] = True
        rec_stack[node] = True
        
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        
        # OPTIMIZATION - when do we add to result?
        rec_stack[node] = False
        result.append(node)  # Add after processing all descendants
        return True
    
    for i in range(n):
        if not visited[i]:
            if not dfs(i):
                return []  # Cycle detected
    
    return result[::-1]  # Reverse for correct order`,
      options: [
        "Add vertex to result after processing all descendants (post-order)",
        "Add vertex to result when first visited (pre-order)",
        "Sort vertices by in-degree first",
        "Use BFS instead of DFS"
      ],
      correctAnswer: 0,
      hint: "Think about when a vertex has no remaining dependencies.",
      explanation: "In DFS topological sort, we add a vertex to the result after processing all its descendants (post-order). This ensures that all dependencies are processed before the vertex itself.",
      followUpQuestions: [
        {
          question: "Why do we reverse the result in DFS topological sort?",
          options: [
            "DFS post-order gives reverse topological order",
            "To match BFS-based Kahn's algorithm output",
            "For better performance",
            "To handle cycles correctly"
          ],
          correctAnswer: 0,
          explanation: "DFS post-order naturally produces vertices in reverse topological order (dependencies come after dependents), so we reverse the result to get correct topological order."
        }
      ]
    },

    {
      id: 52,
      topic: "BFS & DFS",
      functionName: "parallel_bfs",
      difficulty: "Hard",
      question: "How can BFS be parallelized for large graphs?",
      code: `def parallel_bfs(graph, start, num_threads):
    from concurrent.futures import ThreadPoolExecutor
    import threading
    
    visited = [False] * len(graph)
    visited[start] = True
    current_level = [start]
    level = 0
    
    lock = threading.Lock()
    
    def process_chunk(nodes_chunk):
        local_next_level = []
        
        for node in nodes_chunk:
            for neighbor in graph[node]:
                # MISSING SYNCHRONIZATION - how to handle concurrent access?
                with lock:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        local_next_level.append(neighbor)
        
        return local_next_level
    
    while current_level:
        # Divide current level among threads
        chunk_size = len(current_level) // num_threads + 1
        chunks = [current_level[i:i+chunk_size] 
                 for i in range(0, len(current_level), chunk_size)]
        
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            results = list(executor.map(process_chunk, chunks))
        
        # Combine results
        current_level = []
        for result in results:
            current_level.extend(result)
        
        level += 1
    
    return level - 1`,
      options: [
        "Use locks or atomic operations to synchronize visited array access",
        "Duplicate the visited array for each thread",
        "Process levels sequentially without parallelization",
        "Use message passing between threads"
      ],
      correctAnswer: 0,
      hint: "Multiple threads accessing the visited array need synchronization.",
      explanation: "Parallel BFS requires synchronization when multiple threads check and update the visited array. Locks, atomic operations, or lock-free data structures can be used to handle concurrent access safely.",
      followUpQuestions: [
        {
          question: "What's the main challenge in parallelizing BFS?",
          options: [
            "Synchronizing access to shared visited state",
            "Dividing the graph among threads",
            "Load balancing between threads",
            "Handling disconnected components"
          ],
          correctAnswer: 0,
          explanation: "The main challenge is that multiple threads need to safely check and update the shared visited array, requiring careful synchronization to avoid race conditions."
        }
      ]
    },

    {
      id: 53,
      topic: "BFS & DFS",
      functionName: "memory_efficient_dfs",
      difficulty: "Medium",
      question: "How can we implement memory-efficient DFS for very deep graphs?",
      code: `def memory_efficient_dfs(graph, start, target):
    # Iterative DFS with explicit stack
    # Problem: stack can grow very large for deep graphs
    
    def iterative_deepening_dfs(max_depth):
        def dfs_limited(node, depth, visited):
            if node == target:
                return True
            if depth == 0:
                return False
            
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    if dfs_limited(neighbor, depth - 1, visited):
                        return True
            visited.remove(node)  # Backtrack
            return False
        
        for depth in range(max_depth + 1):
            visited = set()
            if dfs_limited(start, depth, visited):
                return depth
        
        return -1
    
    # OPTIMIZATION - what's the memory advantage?
    return iterative_deepening_dfs(len(graph))`,
      options: [
        "Uses O(depth) memory instead of O(nodes_in_path) by recomputing paths",
        "Uses less memory by avoiding recursion",
        "Compresses the graph representation",
        "Uses external memory for large graphs"
      ],
      correctAnswer: 0,
      hint: "Think about the trade-off between time and space complexity.",
      explanation: "Iterative deepening DFS uses O(depth) memory by recomputing paths at each depth limit, rather than storing the entire path. This trades time (revisiting nodes) for space (constant memory per level).",
      followUpQuestions: [
        {
          question: "What's the time complexity overhead of iterative deepening?",
          options: [
            "Constant factor overhead, still O(b^d) asymptotically",
            "Exponential overhead compared to regular DFS",
            "Linear overhead in the depth",
            "No overhead, same complexity as regular DFS"
          ],
          correctAnswer: 0,
          explanation: "Iterative deepening revisits nodes multiple times but most work is done at the deepest level, so the overhead is a constant factor, maintaining O(b^d) complexity."
        }
      ]
    },

    // Continue with more topics - need to add questions for remaining topics
    // Topological Sort, Shortest Paths, MST, Union-Find, Bipartite, etc.
    // This is a placeholder - I'll add the remaining questions in the next update
    
    // Additional Topological Sort Questions
    {
      id: 54,
      topic: "Topological Sort",
      functionName: "kahn_cycle_detection",
      difficulty: "Medium",
      question: "How does Kahn's algorithm detect cycles during topological sorting?",
      code: `def topological_sort_kahn_with_cycle_detection(graph):
    n = len(graph)
    in_degree = [0] * n
    
    # Calculate in-degrees
    for u in range(n):
        for v in graph[u]:
            in_degree[v] += 1
    
    # Initialize queue with zero in-degree vertices
    queue = []
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
    
    result = []
    processed = 0
    
    while queue:
        u = queue.pop(0)
        result.append(u)
        processed += 1
        
        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    
    # MISSING LOGIC - how to detect cycle?
    if processed != n:
        return []  # Cycle detected
    
    return result`,
      options: [
        "If processed vertices < total vertices, there's a cycle",
        "If queue becomes empty before processing all vertices",
        "If any vertex has negative in-degree",
        "If the result length is less than n"
      ],
      correctAnswer: 0,
      hint: "Vertices in cycles will never have in-degree 0.",
      explanation: "In Kahn's algorithm, vertices involved in cycles will never have their in-degree reduced to 0, so they won't be processed. If processed count < n, there are unprocessed vertices forming cycles.",
      followUpQuestions: [
        {
          question: "Why can't vertices in cycles be processed by Kahn's algorithm?",
          options: [
            "They have circular dependencies that prevent in-degree from reaching 0",
            "They are not connected to the rest of the graph",
            "The algorithm processes them in wrong order",
            "They have too many incoming edges"
          ],
          correctAnswer: 0,
          explanation: "Vertices in cycles have circular dependencies - each vertex in the cycle depends on another vertex in the cycle, so their in-degrees can never reach 0."
        }
      ]
    },

    {
      id: 55,
      topic: "Topological Sort",
      functionName: "lexicographic_topological_sort",
      difficulty: "Hard",
      question: "How do we modify Kahn's algorithm for lexicographically smallest topological order?",
      code: `def lexicographic_topological_sort(graph):
    import heapq
    
    n = len(graph)
    in_degree = [0] * n
    
    # Calculate in-degrees
    for u in range(n):
        for v in graph[u]:
            in_degree[v] += 1
    
    # MISSING OPTIMIZATION - what data structure for lexicographic order?
    min_heap = []
    for i in range(n):
        if in_degree[i] == 0:
            heapq.heappush(min_heap, i)
    
    result = []
    
    while min_heap:
        u = heapq.heappop(min_heap)
        result.append(u)
        
        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                heapq.heappush(min_heap, v)
    
    return result if len(result) == n else []`,
      options: [
        "Use min-heap instead of queue to always pick smallest available vertex",
        "Sort the adjacency list in ascending order",
        "Process vertices in reverse order",
        "Use a priority queue with custom comparator"
      ],
      correctAnswer: 0,
      hint: "We need to always choose the lexicographically smallest vertex among available options.",
      explanation: "To get lexicographically smallest topological order, use a min-heap instead of queue in Kahn's algorithm. This ensures we always process the smallest numbered vertex among those with in-degree 0.",
      followUpQuestions: [
        {
          question: "What's the time complexity change when using min-heap in Kahn's algorithm?",
          options: [
            "From O(V + E) to O(V log V + E)",
            "From O(V + E) to O(V² + E)",
            "No change in complexity",
            "From O(V + E) to O(E log V)"
          ],
          correctAnswer: 0,
          explanation: "Using min-heap adds O(log V) for each vertex insertion/removal, changing complexity from O(V + E) to O(V log V + E)."
        }
      ]
    },

    // Additional Shortest Path Questions
    {
      id: 56,
      topic: "Shortest Paths",
      functionName: "johnson_algorithm",
      difficulty: "Hard",
      question: "What's the key insight in Johnson's algorithm for all-pairs shortest paths?",
      code: `def johnson_all_pairs_shortest_paths(graph):
    n = len(graph)
    
    # Step 1: Add new vertex connected to all vertices with weight 0
    extended_graph = [row[:] for row in graph]
    for i in range(n):
        extended_graph.append([float('inf')] * n + [0])
        extended_graph[i].append(0)
    
    # Step 2: Run Bellman-Ford from new vertex
    h = bellman_ford(extended_graph, n)
    if h is None:  # Negative cycle detected
        return None
    
    # Step 3: Reweight edges using h values
    reweighted_graph = [[0] * n for _ in range(n)]
    for u in range(n):
        for v in range(n):
            if graph[u][v] != float('inf'):
                # MISSING REWEIGHTING FORMULA
                reweighted_graph[u][v] = graph[u][v] + h[u] - h[v]
    
    # Step 4: Run Dijkstra from each vertex on reweighted graph
    all_distances = []
    for u in range(n):
        dist = dijkstra(reweighted_graph, u)
        # Convert back to original weights
        for v in range(n):
            if dist[v] != float('inf'):
                dist[v] = dist[v] - h[u] + h[v]
        all_distances.append(dist)
    
    return all_distances`,
      options: [
        "Reweight edges to eliminate negative weights: w'(u,v) = w(u,v) + h[u] - h[v]",
        "Add a constant to all edge weights",
        "Use absolute values of all weights",
        "Multiply all weights by -1"
      ],
      correctAnswer: 0,
      hint: "The reweighting must preserve shortest paths while making all weights non-negative.",
      explanation: "Johnson's algorithm reweights edges using w'(u,v) = w(u,v) + h[u] - h[v] where h[u] is shortest distance from auxiliary vertex. This eliminates negative weights while preserving shortest path structure.",
      followUpQuestions: [
        {
          question: "Why does Johnson's reweighting preserve shortest paths?",
          options: [
            "The reweighting adds the same total amount to all paths between any two vertices",
            "It only changes negative edges",
            "It maintains the relative order of edge weights",
            "It uses logarithmic transformation"
          ],
          correctAnswer: 0,
          explanation: "For any path from u to v, the reweighting adds h[u] - h[v] to the total path weight, which is the same for all paths between u and v, preserving shortest path relationships."
        }
      ]
    },

    {
      id: 57,
      topic: "Shortest Paths",
      functionName: "a_star_algorithm",
      difficulty: "Hard",
      question: "What's the missing heuristic condition in A* algorithm?",
      code: `def a_star_shortest_path(graph, start, goal, heuristic):
    import heapq
    
    # Priority queue: (f_score, g_score, node)
    open_set = [(heuristic(start, goal), 0, start)]
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}
    came_from = {}
    closed_set = set()
    
    while open_set:
        current_f, current_g, current = heapq.heappop(open_set)
        
        if current == goal:
            # Reconstruct path
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]
        
        closed_set.add(current)
        
        for neighbor, weight in graph[current]:
            if neighbor in closed_set:
                continue
            
            tentative_g = g_score[current] + weight
            
            if neighbor not in g_score or tentative_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                # MISSING CONDITION - what must be true about heuristic?
                # For A* to be optimal: heuristic must be admissible (never overestimate)
                f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score[neighbor], tentative_g, neighbor))
    
    return None  # No path found`,
      options: [
        "Heuristic must be admissible (never overestimate true cost)",
        "Heuristic must be consistent (satisfy triangle inequality)",
        "Heuristic must be monotonic (non-decreasing)",
        "Heuristic must be exact (equal to true cost)"
      ],
      correctAnswer: 0,
      hint: "For A* to guarantee optimal solution, what constraint must the heuristic satisfy?",
      explanation: "For A* to find optimal paths, the heuristic must be admissible - it must never overestimate the true cost to reach the goal. This ensures that A* doesn't prematurely discard optimal paths.",
      followUpQuestions: [
        {
          question: "What happens if the heuristic overestimates in A*?",
          options: [
            "A* may return suboptimal paths or miss the optimal solution",
            "A* becomes slower but still optimal",
            "A* fails to find any path",
            "A* behaves exactly like Dijkstra's algorithm"
          ],
          correctAnswer: 0,
          explanation: "If the heuristic overestimates, A* may prematurely conclude that a suboptimal path is better than the optimal path, leading to incorrect results."
        }
      ]
    },

    // Additional MST Questions  
    {
      id: 58,
      topic: "MST",
      functionName: "boruvka_algorithm",
      difficulty: "Hard",
      question: "What's the missing step in Borůvka's MST algorithm?",
      code: `def boruvka_mst(edges, n):
    # Borůvka's algorithm for MST
    parent = list(range(n))
    rank = [0] * n
    
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        if rank[px] < rank[py]:
            parent[px] = py
        elif rank[px] > rank[py]:
            parent[py] = px
        else:
            parent[py] = px
            rank[px] += 1
        return True
    
    mst_edges = []
    
    while len(mst_edges) < n - 1:
        # MISSING STEP - what do we find for each component?
        cheapest = [-1] * n
        
        # Find cheapest edge for each component
        for u, v, weight in edges:
            comp_u, comp_v = find(u), find(v)
            if comp_u != comp_v:
                if cheapest[comp_u] == -1 or weight < edges[cheapest[comp_u]][2]:
                    cheapest[comp_u] = edges.index((u, v, weight))
                if cheapest[comp_v] == -1 or weight < edges[cheapest[comp_v]][2]:
                    cheapest[comp_v] = edges.index((u, v, weight))
        
        # Add cheapest edges to MST
        for i in range(n):
            if cheapest[i] != -1:
                u, v, weight = edges[cheapest[i]]
                if union(u, v):
                    mst_edges.append((u, v, weight))
    
    return mst_edges`,
      options: [
        "Find the cheapest outgoing edge for each connected component",
        "Sort all edges by weight",
        "Find the minimum spanning forest",
        "Remove the most expensive edge from each cycle"
      ],
      correctAnswer: 0,
      hint: "Borůvka's algorithm grows multiple components simultaneously.",
      explanation: "In each iteration, Borůvka's algorithm finds the cheapest outgoing edge for each connected component and adds all such edges to the MST. This allows multiple components to grow simultaneously.",
      followUpQuestions: [
        {
          question: "What's the advantage of Borůvka's algorithm over Kruskal's and Prim's?",
          options: [
            "Better parallelization - can process multiple components simultaneously",
            "Always faster in practice",
            "Uses less memory",
            "Handles negative weights better"
          ],
          correctAnswer: 0,
          explanation: "Borůvka's algorithm can be parallelized more easily because it processes all components simultaneously in each iteration, unlike Kruskal's and Prim's which grow one component at a time."
        }
      ]
    },

    // Additional Union-Find Questions
    {
      id: 59,
      topic: "Union-Find",
      functionName: "weighted_union_find",
      difficulty: "Hard",
      question: "How do we implement weighted Union-Find for distance queries?",
      code: `class WeightedUnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.weight = [0] * n  # Weight from node to its parent
    
    def find(self, x):
        if self.parent[x] != x:
            # MISSING LOGIC - how to handle path compression with weights?
            original_parent = self.parent[x]
            self.parent[x] = self.find(self.parent[x])
            self.weight[x] += self.weight[original_parent]
        return self.parent[x]
    
    def union(self, x, y, w):
        # Union x and y with weight w (meaning dist(x, y) = w)
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return self.weight[y] - self.weight[x] == w
        
        # Make root_y the parent of root_x
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
            self.weight[root_x] = self.weight[y] - self.weight[x] - w
        else:
            self.parent[root_y] = root_x
            self.weight[root_y] = self.weight[x] - self.weight[y] + w
            if self.rank[root_x] == self.rank[root_y]:
                self.rank[root_x] += 1
        
        return True
    
    def distance(self, x, y):
        if self.find(x) != self.find(y):
            return None  # Not connected
        return self.weight[y] - self.weight[x]`,
      options: [
        "Update weight during path compression by adding parent's weight",
        "Keep weights unchanged during path compression",
        "Reset all weights to zero after path compression",
        "Use separate data structure for weights"
      ],
      correctAnswer: 0,
      hint: "Path compression must maintain the invariant that weight[x] = distance from x to root.",
      explanation: "During path compression in weighted Union-Find, we must update the weight to maintain the invariant. The new weight becomes the sum of the old weight and the parent's weight to the root.",
      followUpQuestions: [
        {
          question: "What invariant does weighted Union-Find maintain?",
          options: [
            "weight[x] represents distance from x to its root",
            "weight[x] represents distance from x to its immediate parent",
            "weight[x] represents total weight in the component",
            "weight[x] represents rank of node x"
          ],
          correctAnswer: 0,
          explanation: "Weighted Union-Find maintains the invariant that weight[x] is the distance (or cumulative weight) from node x to the root of its component."
        }
      ]
    },

    // Additional Bipartite Questions
    {
      id: 60,
      topic: "Bipartite",
      functionName: "minimum_vertex_cover",
      difficulty: "Hard",
      question: "How does König's theorem relate maximum matching to minimum vertex cover in bipartite graphs?",
      code: `def minimum_vertex_cover_bipartite(graph, left_size, right_size):
    # König's theorem: In bipartite graphs, 
    # |maximum matching| = |minimum vertex cover|
    
    # Step 1: Find maximum matching
    matching = maximum_bipartite_matching(graph, left_size, right_size)
    max_matching_size = len(matching)
    
    # Step 2: Find minimum vertex cover using König's construction
    # MISSING LOGIC - how to construct minimum vertex cover from matching?
    
    # Find unmatched vertices in left side
    matched_left = set()
    matched_right = set()
    for u, v in matching:
        matched_left.add(u)
        matched_right.add(v)
    
    unmatched_left = set(range(left_size)) - matched_left
    
    # DFS from unmatched left vertices following alternating paths
    visited_left = set()
    visited_right = set()
    
    def dfs(u, is_left_side):
        if is_left_side:
            if u in visited_left:
                return
            visited_left.add(u)
            # Go to unmatched right neighbors
            for v in graph[u]:
                if v not in matched_right:
                    dfs(v, False)
        else:
            if u in visited_right:
                return
            visited_right.add(u)
            # Go to matched left neighbor
            for left_u, right_v in matching:
                if right_v == u:
                    dfs(left_u, True)
                    break
    
    for u in unmatched_left:
        dfs(u, True)
    
    # Vertex cover = (unvisited left) ∪ (visited right)
    vertex_cover = []
    for u in range(left_size):
        if u not in visited_left:
            vertex_cover.append(('L', u))
    for v in range(right_size):
        if v in visited_right:
            vertex_cover.append(('R', v))
    
    return vertex_cover, max_matching_size`,
      options: [
        "Use alternating path construction: unvisited left + visited right vertices",
        "Take all matched vertices as vertex cover",
        "Use greedy algorithm to select highest degree vertices",
        "Take union of all maximum matchings"
      ],
      correctAnswer: 0,
      hint: "König's construction uses alternating paths from unmatched vertices.",
      explanation: "König's theorem construction: Start DFS from unmatched left vertices, follow alternating paths (unmatched then matched edges). Minimum vertex cover = unvisited left vertices + visited right vertices.",
      followUpQuestions: [
        {
          question: "Why does König's theorem not hold for general (non-bipartite) graphs?",
          options: [
            "Odd cycles prevent the alternating path structure needed for the proof",
            "General graphs have more complex matching algorithms",
            "Vertex cover is NP-hard for general graphs",
            "Maximum matching is harder to find in general graphs"
          ],
          correctAnswer: 0,
          explanation: "König's theorem relies on the bipartite structure and alternating paths. Odd cycles in general graphs break this alternating path property, making the theorem invalid."
        }
      ]
    }
  ];

  const topics = [
    'all',
    'SCC & Bridges', 
    'Max Flow',
    'BFS & DFS',
    'Topological Sort',
    'Shortest Paths',
    'MST',
    'Union-Find',
    'Bipartite',
    'Eulerian Path',
    'Hamiltonian Cycle',
    'Advanced'
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
    setTimeSpent(0);
    setQuestionStartTime(Date.now());
    setShowHint(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowFollowUp(false);
    setFollowUpAnswers([]);
    setShowFollowUpResults(false);
    setGameCompleted(false);
    setShowAchievement(null);
    setShowCombo(false);
    
    // Reset quiz mode timer
    if (quizMode === 'speed') {
      setTimeLeft(30);
    }
  };


  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    const currentQuestion = filteredQuestions[questionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const questionTime = Date.now() - questionStartTime;
    
    setSelectedAnswer(answerIndex);
    setTimeSpent(prev => prev + questionTime);
    
    if (isCorrect) {
      const questionScore = calculateScore(currentQuestion.difficulty, questionTime, showHint);
      setScore(prev => prev + questionScore);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      
      // Combo system
      if (streak >= 2) {
        setCombo(prev => prev + 1);
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1500);
      }
      
      checkAchievements();
    } else {
      setStreak(0);
      setCombo(0);
    }
    
    setShowExplanation(true);
  };

  const handleShowHint = () => {
    setShowHint(true);
    if (!showHint) {
      setHintsUsed(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (questionIndex < filteredQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowExplanation(false);
      setShowFollowUp(false);
      setFollowUpAnswers([]);
      setShowFollowUpResults(false);
      setQuestionStartTime(Date.now());
      
      // Reset timer for speed mode
      if (quizMode === 'speed') {
        setTimeLeft(30);
      }
    } else {
      // Game completed
      setGameCompleted(true);
      
      // Save progress
      const progress = {
        questionsCompleted: filteredQuestions.length,
        totalScore: score,
        maxStreak: maxStreak,
        hintsUsed: hintsUsed,
        timeSpent: timeSpent,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        date: new Date().toISOString()
      };
      
      const savedProgress = JSON.parse(localStorage.getItem('graphProgress') || '[]');
      savedProgress.push(progress);
      localStorage.setItem('graphProgress', JSON.stringify(savedProgress));
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCombo(0);
    setHintsUsed(0);
    setTimeSpent(0);
    setSelectedAnswer(null);
    setShowHint(false);
    setShowExplanation(false);
    setShowFollowUp(false);
    setFollowUpAnswers([]);
    setShowFollowUpResults(false);
    setShowAchievement(null);
    setShowCombo(false);
  };

  // Timer effect for speed mode
  useEffect(() => {
    if (quizMode === 'speed' && gameStarted && !gameCompleted && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (quizMode === 'speed' && timeLeft === 0 && selectedAnswer === null) {
      // Time's up, auto-select wrong answer
      handleAnswerSelect(-1);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [quizMode, gameStarted, gameCompleted, timeLeft, selectedAnswer]);

  // Load achievements and progress from localStorage
  useEffect(() => {
    const savedAchievements = JSON.parse(localStorage.getItem('graphAchievements') || '[]');
    savedAchievements.forEach((achievementId: string) => {
      const achievement = allAchievements.find(a => a.id === achievementId);
      if (achievement) {
        achievement.unlocked = true;
      }
    });
    
    const savedProgress = JSON.parse(localStorage.getItem('graphProgress') || '[]');
    setUserProgress(savedProgress);
  }, []);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950">
        {/* Header */}
        <header className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/games/graph-adventure" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Graph Adventure
              </Link>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                Graph Multiple Choice
              </h1>
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        {/* Start Screen */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🕸️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Graph Algorithm Multiple Choice
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Test your understanding of Graph Algorithm concepts through carefully crafted multiple choice questions. 
                Each question includes hints, detailed explanations, and follow-up questions about complexity and patterns.
              </p>
            </div>

            {/* Topic Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                🕸️ Select Topic - 60 Total Questions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {topics.map((topic, index) => {
                  const topicColors: { [key: string]: string } = {
                    'all': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                    'SCC & Bridges': 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                    'Max Flow': 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
                    'BFS & DFS': 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
                    'Topological Sort': 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                    'Shortest Paths': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                    'MST': 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
                    'Union-Find': 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
                    'Bipartite': 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
                    'Advanced': 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                  };
                  
                  const topicQuestionCounts: { [key: string]: number } = {
                    'all': 60,
                    'SCC & Bridges': 9,
                    'Max Flow': 10,
                    'BFS & DFS': 9,
                    'Topological Sort': 4,
                    'Shortest Paths': 6,
                    'MST': 4,
                    'Union-Find': 4,
                    'Bipartite': 3,
                    'Eulerian Path': 2,
                    'Hamiltonian Cycle': 1,
                    'Advanced': 5
                  };
                  
                  const displayName = topic === 'all' ? 'All Topics' : topic;
                  const questionCount = topicQuestionCounts[topic] || 0;
                  
                  return (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-3 rounded-lg font-medium transition-all text-center ${
                        selectedTopic === topic
                          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 shadow-lg transform scale-105'
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
                    <span className="text-gray-600 dark:text-gray-300">10 Missing Lines</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-300">8 Conceptual</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-300">2 Optimization</span>
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
                <p className="text-sm text-gray-600 dark:text-gray-300">Get helpful hints when you're stuck</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📚</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Detailed Explanations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Learn from comprehensive explanations</p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Follow-up Questions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Deepen understanding with follow-ups</p>
              </div>
            </div>

            {/* Game Mode Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Game Mode:</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setQuizMode('normal')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    quizMode === 'normal'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🎓</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Normal Mode</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Take your time to learn</p>
                </button>
                
                <button
                  onClick={() => setQuizMode('speed')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    quizMode === 'speed'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Speed Mode</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">30 seconds per question</p>
                </button>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Difficulty:</h3>
              <div className="flex space-x-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedDifficulty === difficulty
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startGame}
                disabled={filteredQuestions.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Graph Challenge
              </button>
              {filteredQuestions.length === 0 && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                  No questions available for selected filters
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Game completed screen
  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center p-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-white/20 dark:border-gray-700/30">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Congratulations!
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              You've completed the Graph Algorithm challenge!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Score</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{maxStreak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Max Streak</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{filteredQuestions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Questions</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{Math.round(timeSpent / 1000)}s</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Time Spent</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Play Again
              </button>
              <Link
                href="/games/graph-adventure"
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Back to Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  const currentQuestion = filteredQuestions[questionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={resetGame}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Exit Game
            </button>
            
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question {questionIndex + 1} of {filteredQuestions.length}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Score: {score}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Streak: {streak}
              </div>
              {quizMode === 'speed' && (
                <div className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  Time: {timeLeft}s
                </div>
              )}
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Game Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress & Stats */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Progress & Stats</h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {questionIndex + 1}/{filteredQuestions.length}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${((questionIndex + 1) / filteredQuestions.length) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{score}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Score</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{streak}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Streak</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{combo}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Combo</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{Math.round(timeSpent / 1000)}s</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
                    {currentQuestion.topic}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    currentQuestion.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : currentQuestion.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {currentQuestion.question}
              </h2>

              {/* Cycle Detection Visualization Buttons - Only for question 7 */}
              {currentQuestion.id === 7 && (
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                    <button
                      onClick={() => setShowCycleVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: prev[currentQuestion.id] === 'with-cycle' ? null : 'with-cycle'
                      }))}
                      className={`group relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        showCycleVisualization[currentQuestion.id] === 'with-cycle'
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xl shadow-rose-500/25 ring-2 ring-rose-400'
                          : 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 hover:from-rose-100 hover:to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 dark:text-rose-300 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30 border border-rose-200 dark:border-rose-800 hover:border-rose-300 dark:hover:border-rose-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          showCycleVisualization[currentQuestion.id] === 'with-cycle'
                            ? 'bg-white/20'
                            : 'bg-rose-100 dark:bg-rose-800/50'
                        }`}>
                          <span className="text-xl">🔄</span>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold">Graph WITH Cycle</div>
                          <div className={`text-xs ${
                            showCycleVisualization[currentQuestion.id] === 'with-cycle'
                              ? 'text-white/80'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            See cycle detection in action
                          </div>
                        </div>
                      </div>
                      {showCycleVisualization[currentQuestion.id] === 'with-cycle' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-400/20 to-pink-500/20 animate-pulse"></div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setShowCycleVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: prev[currentQuestion.id] === 'without-cycle' ? null : 'without-cycle'
                      }))}
                      className={`group relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        showCycleVisualization[currentQuestion.id] === 'without-cycle'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400'
                          : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 dark:text-emerald-300 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          showCycleVisualization[currentQuestion.id] === 'without-cycle'
                            ? 'bg-white/20'
                            : 'bg-emerald-100 dark:bg-emerald-800/50'
                        }`}>
                          <span className="text-xl">✅</span>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold">Graph WITHOUT Cycle</div>
                          <div className={`text-xs ${
                            showCycleVisualization[currentQuestion.id] === 'without-cycle'
                              ? 'text-white/80'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            See acyclic graph traversal
                          </div>
                        </div>
                      </div>
                      {showCycleVisualization[currentQuestion.id] === 'without-cycle' && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/20 to-teal-500/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Render the visualization if selected */}
                  {showCycleVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <CycleVisualization 
                        questionId={currentQuestion.id} 
                        type={showCycleVisualization[currentQuestion.id]!} 
                      />
                    </div>
                  )}
                </div>
              )}

              {/* IDDFS Visualization Button - Only for question 30 */}
              {currentQuestion.id === 30 && (
                <div className="mb-6">
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowIDDFSVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id]
                      }))}
                      className={`group relative px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showIDDFSVisualization[currentQuestion.id]
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400'
                          : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 dark:text-indigo-300 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showIDDFSVisualization[currentQuestion.id] 
                            ? 'bg-white/20' 
                            : 'bg-indigo-100 dark:bg-indigo-800/50'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            {showIDDFSVisualization[currentQuestion.id] ? 'Hide' : 'Show'} IDDFS Visualization
                          </div>
                          <div className="text-xs opacity-80">
                            Watch depth-limited search in action
                          </div>
                        </div>
                      </div>
                      {showIDDFSVisualization[currentQuestion.id] && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400/20 to-purple-500/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Show IDDFS Visualization */}
                  {showIDDFSVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <IDDFSVisualization questionId={currentQuestion.id} />
                    </div>
                  )}
                </div>
              )}

              {/* Bidirectional BFS Visualization Button - Only for question 49 */}
              {currentQuestion.id === 49 && (
                <div className="mb-6">
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowBidirectionalBFSVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id]
                      }))}
                      className={`group relative px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showBidirectionalBFSVisualization[currentQuestion.id]
                          ? 'bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400'
                          : 'bg-gradient-to-r from-blue-50 to-red-50 text-blue-700 hover:from-blue-100 hover:to-red-100 dark:from-blue-900/20 dark:to-red-900/20 dark:text-blue-300 dark:hover:from-blue-900/30 dark:hover:to-red-900/30 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showBidirectionalBFSVisualization[currentQuestion.id] 
                            ? 'bg-white/20' 
                            : 'bg-blue-100 dark:bg-blue-800/50'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            {showBidirectionalBFSVisualization[currentQuestion.id] ? 'Hide' : 'Show'} Bidirectional BFS
                          </div>
                          <div className="text-xs opacity-80">
                            Watch two searches meet in the middle
                          </div>
                        </div>
                      </div>
                      {showBidirectionalBFSVisualization[currentQuestion.id] && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-red-400/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Show Bidirectional BFS Visualization */}
                  {showBidirectionalBFSVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <BidirectionalBFSVisualization questionId={currentQuestion.id} />
                    </div>
                  )}
                </div>
              )}

              {/* SCC Visualization Buttons - Only for question 50 */}
              {currentQuestion.id === 50 && (
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                    <button
                      onClick={() => setShowSCCVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: prev[currentQuestion.id] === 'strongly-connected' ? null : 'strongly-connected'
                      }))}
                      className={`group relative px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showSCCVisualization[currentQuestion.id] === 'strongly-connected'
                          ? 'bg-gradient-to-r from-violet-400/80 to-purple-500/80 text-white shadow-lg shadow-violet-500/25 ring-2 ring-violet-300'
                          : 'bg-gradient-to-r from-violet-50/70 to-purple-50/70 text-violet-700 hover:from-violet-100/80 hover:to-purple-100/80 dark:from-violet-900/15 dark:to-purple-900/15 dark:text-violet-300 dark:hover:from-violet-900/25 dark:hover:to-purple-900/25 border border-violet-200/60 dark:border-violet-800/40 hover:border-violet-300/80 dark:hover:border-violet-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showSCCVisualization[currentQuestion.id] === 'strongly-connected' 
                            ? 'bg-white/25' 
                            : 'bg-violet-100/70 dark:bg-violet-800/30'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            Show STRONGLY CONNECTED
                          </div>
                          <div className="text-xs opacity-75">
                            All nodes reach each other
                          </div>
                        </div>
                      </div>
                      {showSCCVisualization[currentQuestion.id] === 'strongly-connected' && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-300/20 to-purple-400/20 animate-pulse"></div>
                      )}
                    </button>

                    <button
                      onClick={() => setShowSCCVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: prev[currentQuestion.id] === 'not-connected' ? null : 'not-connected'
                      }))}
                      className={`group relative px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showSCCVisualization[currentQuestion.id] === 'not-connected'
                          ? 'bg-gradient-to-r from-rose-400/80 to-pink-500/80 text-white shadow-lg shadow-rose-500/25 ring-2 ring-rose-300'
                          : 'bg-gradient-to-r from-rose-50/70 to-pink-50/70 text-rose-700 hover:from-rose-100/80 hover:to-pink-100/80 dark:from-rose-900/15 dark:to-pink-900/15 dark:text-rose-300 dark:hover:from-rose-900/25 dark:hover:to-pink-900/25 border border-rose-200/60 dark:border-rose-800/40 hover:border-rose-300/80 dark:hover:border-rose-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showSCCVisualization[currentQuestion.id] === 'not-connected' 
                            ? 'bg-white/25' 
                            : 'bg-rose-100/70 dark:bg-rose-800/30'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            Show NOT CONNECTED
                          </div>
                          <div className="text-xs opacity-75">
                            Multiple separate SCCs
                          </div>
                        </div>
                      </div>
                      {showSCCVisualization[currentQuestion.id] === 'not-connected' && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-rose-300/20 to-pink-400/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Render the visualization if selected */}
                  {showSCCVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <SCCVisualization 
                        questionId={currentQuestion.id} 
                        type={showSCCVisualization[currentQuestion.id]!}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Parallel BFS Visualization Button - Only for question 52 */}
              {currentQuestion.id === 52 && (
                <div className="mb-6">
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowParallelBFSVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id]
                      }))}
                      className={`group relative px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showParallelBFSVisualization[currentQuestion.id]
                          ? 'bg-gradient-to-r from-blue-400/80 to-indigo-500/80 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-300'
                          : 'bg-gradient-to-r from-blue-50/70 to-indigo-50/70 text-blue-700 hover:from-blue-100/80 hover:to-indigo-100/80 dark:from-blue-900/15 dark:to-indigo-900/15 dark:text-blue-300 dark:hover:from-blue-900/25 dark:hover:to-indigo-900/25 border border-blue-200/60 dark:border-blue-800/40 hover:border-blue-300/80 dark:hover:border-blue-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showParallelBFSVisualization[currentQuestion.id] 
                            ? 'bg-white/25' 
                            : 'bg-blue-100/70 dark:bg-blue-800/30'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            Show PARALLEL BFS
                          </div>
                          <div className="text-xs opacity-75">
                            Multi-threaded BFS visualization
                          </div>
                        </div>
                      </div>
                      {showParallelBFSVisualization[currentQuestion.id] && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-300/20 to-indigo-400/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Render the visualization if selected */}
                  {showParallelBFSVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <ParallelBFSVisualization questionId={currentQuestion.id} />
                    </div>
                  )}
                </div>
              )}

              {/* Kruskal's MST Visualization Button - Only for question 12 */}
              {currentQuestion.id === 12 && (
                <div className="mb-6">
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowKruskalVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id]
                      }))}
                      className={`group relative px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showKruskalVisualization[currentQuestion.id]
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 ring-2 ring-green-300'
                          : 'bg-gradient-to-r from-green-50/70 to-emerald-50/70 text-green-700 hover:from-green-100/80 hover:to-emerald-100/80 dark:from-green-900/15 dark:to-emerald-900/15 dark:text-green-300 dark:hover:from-green-900/25 dark:hover:to-emerald-900/25 border border-green-200/60 dark:border-green-800/40 hover:border-green-300/80 dark:hover:border-green-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showKruskalVisualization[currentQuestion.id] 
                            ? 'bg-white/25'
                            : 'bg-green-100/70 dark:bg-green-800/30'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            Show KRUSKAL'S MST
                          </div>
                          <div className="text-xs opacity-75">
                            Minimum Spanning Tree algorithm
                          </div>
                        </div>
                      </div>
                      {showKruskalVisualization[currentQuestion.id] && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-300/20 to-emerald-400/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Render the visualization if selected */}
                  {showKruskalVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <KruskalVisualization questionId={currentQuestion.id} />
                    </div>
                  )}
                </div>
              )}

              {/* Borůvka's MST Visualization Button - Only for question 58 */}
              {currentQuestion.id === 58 && (
                <div className="mb-6">
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowBoruvkaVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id]
                      }))}
                      className={`group relative px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showBoruvkaVisualization[currentQuestion.id]
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-300'
                          : 'bg-gradient-to-r from-purple-50/70 to-indigo-50/70 text-purple-700 hover:from-purple-100/80 hover:to-indigo-100/80 dark:from-purple-900/15 dark:to-indigo-900/15 dark:text-purple-300 dark:hover:from-purple-900/25 dark:hover:to-indigo-900/25 border border-purple-200/60 dark:border-purple-800/40 hover:border-purple-300/80 dark:hover:border-purple-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showBoruvkaVisualization[currentQuestion.id] 
                            ? 'bg-white/25' 
                            : 'bg-purple-100/70 dark:bg-purple-800/30'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            Show BORŮVKA'S MST
                          </div>
                          <div className="text-xs opacity-75">
                            Parallel component-based MST algorithm
                          </div>
                        </div>
                      </div>
                      {showBoruvkaVisualization[currentQuestion.id] && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-300/20 to-indigo-400/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Render the visualization if selected */}
                  {showBoruvkaVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <BoruvkaVisualization questionId={currentQuestion.id} />
                    </div>
                  )}
                </div>
              )}

              {/* Tarjan's Bridge-Finding Visualization Button - Only for question 1 */}
              {currentQuestion.id === 1 && (
                <div className="mb-6">
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowTarjanBridgeVisualization(prev => ({
                        ...prev,
                        [currentQuestion.id]: !prev[currentQuestion.id]
                      }))}
                      className={`group relative px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showTarjanBridgeVisualization[currentQuestion.id]
                          ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg shadow-red-500/25 ring-2 ring-red-300'
                          : 'bg-gradient-to-r from-red-50/70 to-orange-50/70 text-red-700 hover:from-red-100/80 hover:to-orange-100/80 dark:from-red-900/15 dark:to-orange-900/15 dark:text-red-300 dark:hover:from-red-900/25 dark:hover:to-orange-900/25 border border-red-200/60 dark:border-red-800/40 hover:border-red-300/80 dark:hover:border-red-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1.5 rounded ${
                          showTarjanBridgeVisualization[currentQuestion.id] 
                            ? 'bg-white/25' 
                            : 'bg-red-100/70 dark:bg-red-800/30'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-base font-semibold">
                            Show TARJAN'S BRIDGES
                          </div>
                          <div className="text-xs opacity-75">
                            Critical connection detection algorithm
                          </div>
                        </div>
                      </div>
                      {showTarjanBridgeVisualization[currentQuestion.id] && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-300/20 to-orange-400/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Render the visualization if selected */}
                  {showTarjanBridgeVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <TarjanBridgeVisualization questionId={currentQuestion.id} />
                    </div>
                  )}
                </div>
              )}

              {/* SCC Comparison Visualization Buttons - Only for question 2 */}
              {currentQuestion.id === 2 && (
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      🔄 Algorithm Comparison: Kosaraju vs Tarjan
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Compare the two main algorithms for finding Strongly Connected Components
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                    <button
                      onClick={() => {
                        setShowSCCComparisonVisualization(prev => ({
                          ...prev,
                          [currentQuestion.id]: !prev[currentQuestion.id]
                        }));
                        setSCCComparisonAlgorithm(prev => ({
                          ...prev,
                          [currentQuestion.id]: 'kosaraju'
                        }));
                      }}
                      className={`group relative px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showSCCComparisonVisualization[currentQuestion.id] && sccComparisonAlgorithm[currentQuestion.id] === 'kosaraju'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-300'
                          : 'bg-gradient-to-r from-blue-50/70 to-indigo-50/70 text-blue-700 hover:from-blue-100/80 hover:to-indigo-100/80 dark:from-blue-900/15 dark:to-indigo-900/15 dark:text-blue-300 dark:hover:from-blue-900/25 dark:hover:to-indigo-900/25 border border-blue-200/60 dark:border-blue-800/40 hover:border-blue-300/80 dark:hover:border-blue-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1 rounded ${
                          showSCCComparisonVisualization[currentQuestion.id] && sccComparisonAlgorithm[currentQuestion.id] === 'kosaraju'
                            ? 'bg-white/25' 
                            : 'bg-blue-100/70 dark:bg-blue-800/30'
                        }`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold">
                            KOSARAJU'S ALGORITHM
                          </div>
                          <div className="text-xs opacity-75">
                            2-pass: DFS → Transpose → DFS
                          </div>
                        </div>
                      </div>
                      {showSCCComparisonVisualization[currentQuestion.id] && sccComparisonAlgorithm[currentQuestion.id] === 'kosaraju' && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-300/20 to-indigo-400/20 animate-pulse"></div>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setShowSCCComparisonVisualization(prev => ({
                          ...prev,
                          [currentQuestion.id]: !prev[currentQuestion.id]
                        }));
                        setSCCComparisonAlgorithm(prev => ({
                          ...prev,
                          [currentQuestion.id]: 'tarjan'
                        }));
                      }}
                      className={`group relative px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        showSCCComparisonVisualization[currentQuestion.id] && sccComparisonAlgorithm[currentQuestion.id] === 'tarjan'
                          ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-300'
                          : 'bg-gradient-to-r from-purple-50/70 to-violet-50/70 text-purple-700 hover:from-purple-100/80 hover:to-violet-100/80 dark:from-purple-900/15 dark:to-violet-900/15 dark:text-purple-300 dark:hover:from-purple-900/25 dark:hover:to-violet-900/25 border border-purple-200/60 dark:border-purple-800/40 hover:border-purple-300/80 dark:hover:border-purple-700/60 shadow-md hover:shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <div className={`mr-2 p-1 rounded ${
                          showSCCComparisonVisualization[currentQuestion.id] && sccComparisonAlgorithm[currentQuestion.id] === 'tarjan'
                            ? 'bg-white/25' 
                            : 'bg-purple-100/70 dark:bg-purple-800/30'
                        }`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold">
                            TARJAN'S ALGORITHM
                          </div>
                          <div className="text-xs opacity-75">
                            1-pass: DFS with stack tracking
                          </div>
                        </div>
                      </div>
                      {showSCCComparisonVisualization[currentQuestion.id] && sccComparisonAlgorithm[currentQuestion.id] === 'tarjan' && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-300/20 to-violet-400/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  {/* Render the visualization if selected */}
                  {showSCCComparisonVisualization[currentQuestion.id] && (
                    <div className="mb-4">
                      <SCCComparisonVisualization 
                        questionId={currentQuestion.id} 
                        algorithm={sccComparisonAlgorithm[currentQuestion.id] || 'kosaraju'}
                      />
                      
                      {/* Comparison Table */}
                      <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
                          📊 Key Differences Comparison
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-300 dark:border-gray-600">
                                <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">Aspect</th>
                                <th className="text-left py-2 px-3 font-semibold text-blue-700 dark:text-blue-300">Kosaraju's</th>
                                <th className="text-left py-2 px-3 font-semibold text-purple-700 dark:text-purple-300">Tarjan's</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-600 dark:text-gray-400">
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-3 font-medium">Passes</td>
                                <td className="py-2 px-3">2 passes</td>
                                <td className="py-2 px-3">1 pass</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-3 font-medium">Space</td>
                                <td className="py-2 px-3">O(V) + transpose graph</td>
                                <td className="py-2 px-3">O(V) (stack + arrays)</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-3 font-medium">Complexity</td>
                                <td className="py-2 px-3">O(V + E)</td>
                                <td className="py-2 px-3">O(V + E)</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-3 font-medium">Implementation</td>
                                <td className="py-2 px-3">Simpler logic</td>
                                <td className="py-2 px-3">More complex logic</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-3 font-medium">Memory</td>
                                <td className="py-2 px-3">Higher (stores transpose)</td>
                                <td className="py-2 px-3">Lower (no transpose)</td>
                              </tr>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-2 px-3 font-medium">Stack Usage</td>
                                <td className="py-2 px-3">Implicit (recursion)</td>
                                <td className="py-2 px-3">Explicit stack tracking</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 font-medium">Discovery</td>
                                <td className="py-2 px-3">Post-order + reverse</td>
                                <td className="py-2 px-3">Real-time during DFS</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === null
                        ? 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-700'
                        : selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                          : index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Hint Button */}
              {!showHint && selectedAnswer === null && (
                <button
                  onClick={handleShowHint}
                  className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Show Hint 💡
                </button>
              )}

              {/* Hint */}
              {showHint && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    💡 <strong>Hint:</strong> {currentQuestion.hint}
                  </p>
                </div>
              )}

              {/* Explanation */}
              {showExplanation && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-blue-800 dark:text-blue-200">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {showExplanation && (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    {questionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Complete'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Code Display Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30 h-full flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Complete Code</h3>
              
              {currentQuestion.code && (
                <div className="flex-1 mb-5">
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs h-full overflow-y-auto">
                    <code>{currentQuestion.code}</code>
                  </pre>
                </div>
              )}
              
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 flex-shrink-0">
                <p><strong>Function:</strong> {currentQuestion.functionName}</p>
                <p><strong>Topic:</strong> {currentQuestion.topic}</p>
                <p><strong>Difficulty:</strong> {currentQuestion.difficulty}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Combo Animation */}
      {showCombo && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-xl font-bold animate-bounce">
            🔥 {combo}x Combo!
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{showAchievement.icon}</span>
              <div>
                <div className="font-bold">{showAchievement.name}</div>
                <div className="text-sm opacity-90">{showAchievement.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GraphMultipleChoiceGame;
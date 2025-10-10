'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';

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
  followUpQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface UserProgress {
  questionsAnswered: number;
  correctAnswers: number;
  topicsCompleted: string[];
  achievements: string[];
  streakCount: number;
  bestStreak: number;
}

export default function TreeMultipleChoiceGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [darkMode, setDarkMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizMode, setQuizMode] = useState<'practice' | 'timed' | 'challenge'>('practice');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // BST Deletion Visualization State
  const [showBSTDeletionVisualization, setShowBSTDeletionVisualization] = useState(false);
  const [bstDeletionAnimationStep, setBSTDeletionAnimationStep] = useState(0);
  
  // BST Trim Visualization State
  const [showBSTTrimVisualization, setShowBSTTrimVisualization] = useState(false);
  const [bstTrimAnimationStep, setBSTTrimAnimationStep] = useState(0);
  
  // BST Range Sum Visualization State
  const [showBSTRangeSumVisualization, setShowBSTRangeSumVisualization] = useState(false);
  const [bstRangeSumAnimationStep, setBSTRangeSumAnimationStep] = useState(0);
  
  // BST Recovery Visualization State
  const [showBSTRecoveryVisualization, setShowBSTRecoveryVisualization] = useState(false);
  const [bstRecoveryAnimationStep, setBSTRecoveryAnimationStep] = useState(0);
  
  // BST Balance Visualization State
  const [showBSTBalanceVisualization, setShowBSTBalanceVisualization] = useState(false);
  const [bstBalanceAnimationStep, setBSTBalanceAnimationStep] = useState(0);
  
  // Postorder Traversal Visualization State
  const [showPostorderVisualization, setShowPostorderVisualization] = useState(false);
  const [postorderAnimationStep, setPostorderAnimationStep] = useState(0);
  
  // Boundary Traversal Visualization State
  const [showBoundaryVisualization, setShowBoundaryVisualization] = useState(false);
  const [boundaryAnimationStep, setBoundaryAnimationStep] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    questionsAnswered: 0,
    correctAnswers: 0,
    topicsCompleted: [],
    achievements: [],
    streakCount: 0,
    bestStreak: 0
  });

  // BST Deletion Visualization Component
  const BSTDeletionVisualization = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface BSTDeletionStep {
      step: number;
      description: string;
      tree: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number}};
      highlightNodes: string[];
      action: string;
      successor?: string;
    }

    const getAnimationSteps = (): BSTDeletionStep[] => [
      {
        step: 0,
        description: "Initial BST - We want to delete node 50 (has two children)",
        tree: {
          "50": {val: 50, left: "30", right: "70", x: 200, y: 50},
          "30": {val: 30, left: "20", right: "40", x: 100, y: 120},
          "70": {val: 70, left: "60", right: "80", x: 300, y: 120},
          "20": {val: 20, x: 50, y: 190},
          "40": {val: 40, x: 150, y: 190},
          "60": {val: 60, x: 250, y: 190},
          "80": {val: 80, x: 350, y: 190}
        },
        highlightNodes: ["50"],
        action: "Target node to delete",
        successor: undefined
      },
      {
        step: 1,
        description: "Node 50 has two children - this is the trickiest case!",
        tree: {
          "50": {val: 50, left: "30", right: "70", x: 200, y: 50},
          "30": {val: 30, left: "20", right: "40", x: 100, y: 120},
          "70": {val: 70, left: "60", right: "80", x: 300, y: 120},
          "20": {val: 20, x: 50, y: 190},
          "40": {val: 40, x: 150, y: 190},
          "60": {val: 60, x: 250, y: 190},
          "80": {val: 80, x: 350, y: 190}
        },
        highlightNodes: ["50", "30", "70"],
        action: "Cannot simply replace with left or right child",
        successor: undefined
      },
      {
        step: 2,
        description: "Find inorder successor: smallest node in right subtree",
        tree: {
          "50": {val: 50, left: "30", right: "70", x: 200, y: 50},
          "30": {val: 30, left: "20", right: "40", x: 100, y: 120},
          "70": {val: 70, left: "60", right: "80", x: 300, y: 120},
          "20": {val: 20, x: 50, y: 190},
          "40": {val: 40, x: 150, y: 190},
          "60": {val: 60, x: 250, y: 190},
          "80": {val: 80, x: 350, y: 190}
        },
        highlightNodes: ["70", "60"],
        action: "Go right, then keep going left",
        successor: "60"
      },
      {
        step: 3,
        description: "Found successor: 60 (smallest in right subtree)",
        tree: {
          "50": {val: 50, left: "30", right: "70", x: 200, y: 50},
          "30": {val: 30, left: "20", right: "40", x: 100, y: 120},
          "70": {val: 70, left: "60", right: "80", x: 300, y: 120},
          "20": {val: 20, x: 50, y: 190},
          "40": {val: 40, x: 150, y: 190},
          "60": {val: 60, x: 250, y: 190},
          "80": {val: 80, x: 350, y: 190}
        },
        highlightNodes: ["60"],
        action: "Copy successor value to target node",
        successor: "60"
      },
      {
        step: 4,
        description: "Replace 50 with successor value 60",
        tree: {
          "50": {val: 60, left: "30", right: "70", x: 200, y: 50},
          "30": {val: 30, left: "20", right: "40", x: 100, y: 120},
          "70": {val: 70, left: "60", right: "80", x: 300, y: 120},
          "20": {val: 20, x: 50, y: 190},
          "40": {val: 40, x: 150, y: 190},
          "60": {val: 60, x: 250, y: 190},
          "80": {val: 80, x: 350, y: 190}
        },
        highlightNodes: ["50", "60"],
        action: "Now delete the duplicate successor",
        successor: "60"
      },
      {
        step: 5,
        description: "Delete the duplicate successor node (60) from right subtree",
        tree: {
          "50": {val: 60, left: "30", right: "70", x: 200, y: 50},
          "30": {val: 30, left: "20", right: "40", x: 100, y: 120},
          "70": {val: 70, right: "80", x: 300, y: 120},
          "20": {val: 20, x: 50, y: 190},
          "40": {val: 40, x: 150, y: 190},
          "80": {val: 80, x: 350, y: 190}
        },
        highlightNodes: ["50"],
        action: "BST deletion complete - BST property maintained",
        successor: undefined
      }
    ];

    const steps = getAnimationSteps();
    const currentStep = steps[bstDeletionAnimationStep] || steps[0];

    const drawTree = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw edges first
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        if (node.left && currentStep.tree[node.left]) {
          const leftNode = currentStep.tree[node.left];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(leftNode.x, leftNode.y);
          ctx.stroke();
        }
        if (node.right && currentStep.tree[node.right]) {
          const rightNode = currentStep.tree[node.right];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNode.x, rightNode.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        const isHighlighted = currentStep.highlightNodes.includes(nodeId);
        const isSuccessor = currentStep.successor === nodeId;
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        
        if (isSuccessor) {
          ctx.fillStyle = '#fbbf24'; // Yellow for successor
          ctx.strokeStyle = '#f59e0b';
        } else if (isHighlighted) {
          ctx.fillStyle = '#ef4444'; // Red for highlighted
          ctx.strokeStyle = '#dc2626';
        } else {
          ctx.fillStyle = '#10b981'; // Green for normal
          ctx.strokeStyle = '#059669';
        }
        
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();

        // Node value
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val.toString(), node.x, node.y);
      });

      // Draw info panel
      const infoX = 420;
      const infoY = 20;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillRect(infoX, infoY, 200, 200);
      ctx.strokeRect(infoX, infoY, 200, 200);

      // Info text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('BST Deletion Steps', infoX + 10, infoY + 25);
      
      ctx.font = '12px Arial';
      ctx.fillText(`Step ${currentStep.step + 1}/6`, infoX + 10, infoY + 50);
      
      // Wrap description text
      const words = currentStep.description.split(' ');
      let line = '';
      let y = infoY + 75;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(line, infoX + 10, y);
          line = words[i] + ' ';
          y += 15;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, infoX + 10, y);
      
      // Action
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('Action:', infoX + 10, y + 25);
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px Arial';
      
      const actionWords = currentStep.action.split(' ');
      let actionLine = '';
      let actionY = y + 40;
      
      for (let i = 0; i < actionWords.length; i++) {
        const testLine = actionLine + actionWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(actionLine, infoX + 10, actionY);
          actionLine = actionWords[i] + ' ';
          actionY += 15;
        } else {
          actionLine = testLine;
        }
      }
      ctx.fillText(actionLine, infoX + 10, actionY);

      // Legend
      const legendY = infoY + 160;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(infoX + 15, legendY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      ctx.fillText('Target/Highlighted', infoX + 25, legendY + 3);
      
      if (currentStep.successor) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(infoX + 15, legendY + 15, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.fillText('Successor', infoX + 25, legendY + 18);
      }
    };

    useEffect(() => {
      drawTree();
    }, [bstDeletionAnimationStep]);

    return (
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            🌳 BST Deletion Visualization
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setBSTDeletionAnimationStep(0)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setBSTDeletionAnimationStep(Math.max(0, bstDeletionAnimationStep - 1))}
              disabled={bstDeletionAnimationStep === 0}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setBSTDeletionAnimationStep(Math.min(5, bstDeletionAnimationStep + 1))}
              disabled={bstDeletionAnimationStep === 5}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={640}
          height={240}
          className="w-full border border-blue-200 dark:border-blue-600 rounded-lg bg-white"
        />
        
        <div className="mt-3 text-sm text-blue-700 dark:text-blue-300">
          <strong>Key Insight:</strong> When deleting a node with two children, we replace it with its inorder successor 
          (smallest value in right subtree) to maintain BST property.
        </div>
      </div>
    );
  };

  // BST Trim Visualization Component
  const BSTTrimVisualization = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface BSTTrimStep {
      step: number;
      description: string;
      tree: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number, status: 'normal' | 'valid' | 'invalid' | 'removed'}};
      currentNode?: string;
      action: string;
      range: {low: number, high: number};
    }

    const getAnimationSteps = (): BSTTrimStep[] => [
      {
        step: 0,
        description: "Initial BST - We want to trim to keep only nodes in range [3, 7]",
        tree: {
          "5": {val: 5, left: "2", right: "8", x: 200, y: 50, status: 'normal'},
          "2": {val: 2, left: "1", right: "4", x: 100, y: 120, status: 'normal'},
          "8": {val: 8, left: "6", right: "9", x: 300, y: 120, status: 'normal'},
          "1": {val: 1, x: 50, y: 190, status: 'normal'},
          "4": {val: 4, left: "3", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "9": {val: 9, x: 350, y: 190, status: 'normal'},
          "3": {val: 3, x: 125, y: 260, status: 'normal'}
        },
        currentNode: undefined,
        action: "Range [3, 7] - nodes outside will be trimmed",
        range: {low: 3, high: 7}
      },
      {
        step: 1,
        description: "Start at root (5) - value 5 is within range [3, 7]",
        tree: {
          "5": {val: 5, left: "2", right: "8", x: 200, y: 50, status: 'valid'},
          "2": {val: 2, left: "1", right: "4", x: 100, y: 120, status: 'normal'},
          "8": {val: 8, left: "6", right: "9", x: 300, y: 120, status: 'normal'},
          "1": {val: 1, x: 50, y: 190, status: 'normal'},
          "4": {val: 4, left: "3", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "9": {val: 9, x: 350, y: 190, status: 'normal'},
          "3": {val: 3, x: 125, y: 260, status: 'normal'}
        },
        currentNode: "5",
        action: "Keep root, trim both subtrees recursively",
        range: {low: 3, high: 7}
      },
      {
        step: 2,
        description: "Left child (2) < low (3) - entire left subtree of 2 is invalid",
        tree: {
          "5": {val: 5, left: "2", right: "8", x: 200, y: 50, status: 'valid'},
          "2": {val: 2, left: "1", right: "4", x: 100, y: 120, status: 'invalid'},
          "8": {val: 8, left: "6", right: "9", x: 300, y: 120, status: 'normal'},
          "1": {val: 1, x: 50, y: 190, status: 'invalid'},
          "4": {val: 4, left: "3", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "9": {val: 9, x: 350, y: 190, status: 'normal'},
          "3": {val: 3, x: 125, y: 260, status: 'normal'}
        },
        currentNode: "2",
        action: "Node 2 < 3, so trim right subtree of 2",
        range: {low: 3, high: 7}
      },
      {
        step: 3,
        description: "Replace node 2 with its right subtree (trim left, keep right)",
        tree: {
          "5": {val: 5, left: "4", right: "8", x: 200, y: 50, status: 'valid'},
          "4": {val: 4, left: "3", x: 100, y: 120, status: 'normal'},
          "8": {val: 8, left: "6", right: "9", x: 300, y: 120, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "9": {val: 9, x: 350, y: 190, status: 'normal'},
          "3": {val: 3, x: 75, y: 190, status: 'normal'}
        },
        currentNode: "4",
        action: "Node 4 is valid, trim its subtrees",
        range: {low: 3, high: 7}
      },
      {
        step: 4,
        description: "Right child (8) > high (7) - entire right subtree of 8 is invalid",
        tree: {
          "5": {val: 5, left: "4", right: "8", x: 200, y: 50, status: 'valid'},
          "4": {val: 4, left: "3", x: 100, y: 120, status: 'valid'},
          "8": {val: 8, left: "6", right: "9", x: 300, y: 120, status: 'invalid'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "9": {val: 9, x: 350, y: 190, status: 'invalid'},
          "3": {val: 3, x: 75, y: 190, status: 'valid'}
        },
        currentNode: "8",
        action: "Node 8 > 7, so trim left subtree of 8",
        range: {low: 3, high: 7}
      },
      {
        step: 5,
        description: "Final trimmed BST - only nodes in range [3, 7] remain",
        tree: {
          "5": {val: 5, left: "4", right: "6", x: 200, y: 50, status: 'valid'},
          "4": {val: 4, left: "3", x: 100, y: 120, status: 'valid'},
          "6": {val: 6, x: 300, y: 120, status: 'valid'},
          "3": {val: 3, x: 75, y: 190, status: 'valid'}
        },
        currentNode: undefined,
        action: "BST trimmed successfully - all nodes in [3, 7]",
        range: {low: 3, high: 7}
      }
    ];

    const steps = getAnimationSteps();
    const currentStep = steps[bstTrimAnimationStep] || steps[0];

    const drawTree = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw edges first
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        if (node.left && currentStep.tree[node.left]) {
          const leftNode = currentStep.tree[node.left];
          ctx.strokeStyle = node.status === 'removed' ? '#d1d5db' : '#64748b';
          ctx.lineWidth = node.status === 'removed' ? 1 : 2;
          ctx.setLineDash(node.status === 'removed' ? [5, 5] : []);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(leftNode.x, leftNode.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (node.right && currentStep.tree[node.right]) {
          const rightNode = currentStep.tree[node.right];
          ctx.strokeStyle = node.status === 'removed' ? '#d1d5db' : '#64748b';
          ctx.lineWidth = node.status === 'removed' ? 1 : 2;
          ctx.setLineDash(node.status === 'removed' ? [5, 5] : []);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNode.x, rightNode.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw nodes
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        const isCurrent = currentStep.currentNode === nodeId;
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        
        if (node.status === 'valid') {
          ctx.fillStyle = '#10b981'; // Green for valid
          ctx.strokeStyle = '#059669';
        } else if (node.status === 'invalid') {
          ctx.fillStyle = '#ef4444'; // Red for invalid
          ctx.strokeStyle = '#dc2626';
        } else if (node.status === 'removed') {
          ctx.fillStyle = '#d1d5db'; // Gray for removed
          ctx.strokeStyle = '#9ca3af';
        } else {
          ctx.fillStyle = '#6b7280'; // Gray for normal
          ctx.strokeStyle = '#4b5563';
        }
        
        if (isCurrent) {
          ctx.strokeStyle = '#fbbf24'; // Yellow border for current
          ctx.lineWidth = 4;
        } else {
          ctx.lineWidth = 3;
        }
        
        ctx.fill();
        ctx.stroke();

        // Node value
        ctx.fillStyle = node.status === 'removed' ? '#6b7280' : 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val.toString(), node.x, node.y);
      });

      // Draw range indicator
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Range: [${currentStep.range.low}, ${currentStep.range.high}]`, 20, 30);

      // Draw info panel
      const infoX = 420;
      const infoY = 50;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillRect(infoX, infoY, 200, 180);
      ctx.strokeRect(infoX, infoY, 200, 180);

      // Info text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('BST Trim Steps', infoX + 10, infoY + 25);
      
      ctx.font = '12px Arial';
      ctx.fillText(`Step ${currentStep.step + 1}/6`, infoX + 10, infoY + 45);
      
      // Wrap description text
      const words = currentStep.description.split(' ');
      let line = '';
      let y = infoY + 65;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(line, infoX + 10, y);
          line = words[i] + ' ';
          y += 15;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, infoX + 10, y);
      
      // Action
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('Action:', infoX + 10, y + 20);
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px Arial';
      
      const actionWords = currentStep.action.split(' ');
      let actionLine = '';
      let actionY = y + 35;
      
      for (let i = 0; i < actionWords.length; i++) {
        const testLine = actionLine + actionWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(actionLine, infoX + 10, actionY);
          actionLine = actionWords[i] + ' ';
          actionY += 15;
        } else {
          actionLine = testLine;
        }
      }
      ctx.fillText(actionLine, infoX + 10, actionY);

      // Legend
      const legendY = infoY + 140;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(infoX + 15, legendY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      ctx.fillText('Valid (in range)', infoX + 25, legendY + 3);
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(infoX + 15, legendY + 15, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillText('Invalid (out of range)', infoX + 25, legendY + 18);
    };

    useEffect(() => {
      drawTree();
    }, [bstTrimAnimationStep]);

    return (
      <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
            ✂️ BST Trim Visualization
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setBSTTrimAnimationStep(0)}
              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setBSTTrimAnimationStep(Math.max(0, bstTrimAnimationStep - 1))}
              disabled={bstTrimAnimationStep === 0}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setBSTTrimAnimationStep(Math.min(5, bstTrimAnimationStep + 1))}
              disabled={bstTrimAnimationStep === 5}
              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          className="w-full border border-purple-200 dark:border-purple-600 rounded-lg bg-white"
        />
        
        <div className="mt-3 text-sm text-purple-700 dark:text-purple-300">
          <strong>Key Insight:</strong> Use BST property to eliminate entire subtrees efficiently. 
          If node &lt; low, go right; if node &gt; high, go left; else trim both subtrees.
        </div>
      </div>
    );
  };

  // BST Range Sum Visualization Component
  const BSTRangeSumVisualization = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface BSTRangeSumStep {
      step: number;
      description: string;
      tree: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number, status: 'normal' | 'included' | 'excluded' | 'current' | 'skipped'}};
      currentNode?: string;
      action: string;
      range: {low: number, high: number};
      currentSum: number;
      traversalPath: string[];
    }

    const getAnimationSteps = (): BSTRangeSumStep[] => [
      {
        step: 0,
        description: "Initial BST - Calculate sum of nodes in range [6, 10]",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'normal'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'normal'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'normal'},
          "1": {val: 1, x: 50, y: 190, status: 'normal'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'normal'},
          "18": {val: 18, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 225, y: 260, status: 'normal'},
          "12": {val: 12, x: 275, y: 260, status: 'normal'}
        },
        currentNode: undefined,
        action: "Range [6, 10] - use BST property to avoid unnecessary traversals",
        range: {low: 6, high: 10},
        currentSum: 0,
        traversalPath: []
      },
      {
        step: 1,
        description: "Start at root (7) - value 7 is in range [6, 10]",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'current'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'normal'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'normal'},
          "1": {val: 1, x: 50, y: 190, status: 'normal'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'normal'},
          "18": {val: 18, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 225, y: 260, status: 'normal'},
          "12": {val: 12, x: 275, y: 260, status: 'normal'}
        },
        currentNode: "7",
        action: "Add 7 to sum. Check both subtrees since 7 > 6 and 7 < 10",
        range: {low: 6, high: 10},
        currentSum: 7,
        traversalPath: ["7"]
      },
      {
        step: 2,
        description: "Left child (3) < low (6) - skip left subtree of 3",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'included'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'current'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'normal'},
          "1": {val: 1, x: 50, y: 190, status: 'skipped'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'normal'},
          "18": {val: 18, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 225, y: 260, status: 'normal'},
          "12": {val: 12, x: 275, y: 260, status: 'normal'}
        },
        currentNode: "3",
        action: "3 < 6, so skip left subtree. Only check right subtree",
        range: {low: 6, high: 10},
        currentSum: 7,
        traversalPath: ["7", "3"]
      },
      {
        step: 3,
        description: "Node 5 < low (6) - exclude from sum, no further traversal needed",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'included'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'excluded'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'normal'},
          "1": {val: 1, x: 50, y: 190, status: 'skipped'},
          "5": {val: 5, x: 150, y: 190, status: 'current'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'normal'},
          "18": {val: 18, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 225, y: 260, status: 'normal'},
          "12": {val: 12, x: 275, y: 260, status: 'normal'}
        },
        currentNode: "5",
        action: "5 < 6, exclude from sum. No children to check",
        range: {low: 6, high: 10},
        currentSum: 7,
        traversalPath: ["7", "3", "5"]
      },
      {
        step: 4,
        description: "Right subtree: Node 15 > high (10) - skip right subtree of 15",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'included'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'excluded'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'current'},
          "1": {val: 1, x: 50, y: 190, status: 'skipped'},
          "5": {val: 5, x: 150, y: 190, status: 'excluded'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'normal'},
          "18": {val: 18, x: 350, y: 190, status: 'skipped'},
          "8": {val: 8, x: 225, y: 260, status: 'normal'},
          "12": {val: 12, x: 275, y: 260, status: 'normal'}
        },
        currentNode: "15",
        action: "15 > 10, so skip right subtree. Only check left subtree",
        range: {low: 6, high: 10},
        currentSum: 7,
        traversalPath: ["7", "3", "5", "15"]
      },
      {
        step: 5,
        description: "Node 9 is in range [6, 10] - add to sum",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'included'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'excluded'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'excluded'},
          "1": {val: 1, x: 50, y: 190, status: 'skipped'},
          "5": {val: 5, x: 150, y: 190, status: 'excluded'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'current'},
          "18": {val: 18, x: 350, y: 190, status: 'skipped'},
          "8": {val: 8, x: 225, y: 260, status: 'normal'},
          "12": {val: 12, x: 275, y: 260, status: 'normal'}
        },
        currentNode: "9",
        action: "9 is in range, add to sum. Check both children",
        range: {low: 6, high: 10},
        currentSum: 16,
        traversalPath: ["7", "3", "5", "15", "9"]
      },
      {
        step: 6,
        description: "Node 8 is in range [6, 10] - add to sum",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'included'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'excluded'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'excluded'},
          "1": {val: 1, x: 50, y: 190, status: 'skipped'},
          "5": {val: 5, x: 150, y: 190, status: 'excluded'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'included'},
          "18": {val: 18, x: 350, y: 190, status: 'skipped'},
          "8": {val: 8, x: 225, y: 260, status: 'current'},
          "12": {val: 12, x: 275, y: 260, status: 'normal'}
        },
        currentNode: "8",
        action: "8 is in range, add to sum. No children to check",
        range: {low: 6, high: 10},
        currentSum: 24,
        traversalPath: ["7", "3", "5", "15", "9", "8"]
      },
      {
        step: 7,
        description: "Node 12 > high (10) - exclude from sum",
        tree: {
          "7": {val: 7, left: "3", right: "15", x: 200, y: 50, status: 'included'},
          "3": {val: 3, left: "1", right: "5", x: 100, y: 120, status: 'excluded'},
          "15": {val: 15, left: "9", right: "18", x: 300, y: 120, status: 'excluded'},
          "1": {val: 1, x: 50, y: 190, status: 'skipped'},
          "5": {val: 5, x: 150, y: 190, status: 'excluded'},
          "9": {val: 9, left: "8", right: "12", x: 250, y: 190, status: 'included'},
          "18": {val: 18, x: 350, y: 190, status: 'skipped'},
          "8": {val: 8, x: 225, y: 260, status: 'included'},
          "12": {val: 12, x: 275, y: 260, status: 'current'}
        },
        currentNode: "12",
        action: "12 > 10, exclude from sum. Final result: 7 + 9 + 8 = 24",
        range: {low: 6, high: 10},
        currentSum: 24,
        traversalPath: ["7", "3", "5", "15", "9", "8", "12"]
      }
    ];

    const steps = getAnimationSteps();
    const currentStep = steps[bstRangeSumAnimationStep] || steps[0];

    const drawTree = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw edges first
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        if (node.left && currentStep.tree[node.left]) {
          const leftNode = currentStep.tree[node.left];
          ctx.strokeStyle = node.status === 'skipped' ? '#d1d5db' : '#64748b';
          ctx.lineWidth = node.status === 'skipped' ? 1 : 2;
          ctx.setLineDash(node.status === 'skipped' ? [5, 5] : []);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(leftNode.x, leftNode.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (node.right && currentStep.tree[node.right]) {
          const rightNode = currentStep.tree[node.right];
          ctx.strokeStyle = node.status === 'skipped' ? '#d1d5db' : '#64748b';
          ctx.lineWidth = node.status === 'skipped' ? 1 : 2;
          ctx.setLineDash(node.status === 'skipped' ? [5, 5] : []);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNode.x, rightNode.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Draw nodes
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        const isCurrent = currentStep.currentNode === nodeId;
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        
        if (node.status === 'included') {
          ctx.fillStyle = '#10b981'; // Green for included in sum
          ctx.strokeStyle = '#059669';
        } else if (node.status === 'excluded') {
          ctx.fillStyle = '#ef4444'; // Red for excluded
          ctx.strokeStyle = '#dc2626';
        } else if (node.status === 'skipped') {
          ctx.fillStyle = '#d1d5db'; // Gray for skipped
          ctx.strokeStyle = '#9ca3af';
        } else if (node.status === 'current') {
          ctx.fillStyle = '#fbbf24'; // Yellow for current
          ctx.strokeStyle = '#f59e0b';
        } else {
          ctx.fillStyle = '#6b7280'; // Gray for normal
          ctx.strokeStyle = '#4b5563';
        }
        
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        // Node value
        ctx.fillStyle = node.status === 'skipped' ? '#6b7280' : 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val.toString(), node.x, node.y);
      });

      // Draw range and sum info
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Range: [${currentStep.range.low}, ${currentStep.range.high}]`, 20, 30);
      ctx.fillText(`Current Sum: ${currentStep.currentSum}`, 20, 55);

      // Draw info panel
      const infoX = 420;
      const infoY = 20;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillRect(infoX, infoY, 200, 220);
      ctx.strokeRect(infoX, infoY, 200, 220);

      // Info text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('BST Range Sum', infoX + 10, infoY + 25);
      
      ctx.font = '12px Arial';
      ctx.fillText(`Step ${currentStep.step + 1}/8`, infoX + 10, infoY + 45);
      
      // Wrap description text
      const words = currentStep.description.split(' ');
      let line = '';
      let y = infoY + 65;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(line, infoX + 10, y);
          line = words[i] + ' ';
          y += 15;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, infoX + 10, y);
      
      // Action
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('Action:', infoX + 10, y + 20);
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px Arial';
      
      const actionWords = currentStep.action.split(' ');
      let actionLine = '';
      let actionY = y + 35;
      
      for (let i = 0; i < actionWords.length; i++) {
        const testLine = actionLine + actionWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(actionLine, infoX + 10, actionY);
          actionLine = actionWords[i] + ' ';
          actionY += 15;
        } else {
          actionLine = testLine;
        }
      }
      ctx.fillText(actionLine, infoX + 10, actionY);

      // Traversal path
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 10px Arial';
      ctx.fillText('Traversal Path:', infoX + 10, actionY + 25);
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      const pathText = currentStep.traversalPath.join(' → ');
      ctx.fillText(pathText, infoX + 10, actionY + 40);

      // Legend
      const legendY = infoY + 170;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(infoX + 15, legendY, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      ctx.fillText('Included in sum', infoX + 25, legendY + 3);
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(infoX + 15, legendY + 15, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillText('Excluded from sum', infoX + 25, legendY + 18);
      
      ctx.fillStyle = '#d1d5db';
      ctx.beginPath();
      ctx.arc(infoX + 15, legendY + 30, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillText('Skipped (pruned)', infoX + 25, legendY + 33);
    };

    useEffect(() => {
      drawTree();
    }, [bstRangeSumAnimationStep]);

    return (
      <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/30 rounded-xl border border-orange-200 dark:border-orange-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
            🧮 BST Range Sum Visualization
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setBSTRangeSumAnimationStep(0)}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setBSTRangeSumAnimationStep(Math.max(0, bstRangeSumAnimationStep - 1))}
              disabled={bstRangeSumAnimationStep === 0}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setBSTRangeSumAnimationStep(Math.min(7, bstRangeSumAnimationStep + 1))}
              disabled={bstRangeSumAnimationStep === 7}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={640}
          height={300}
          className="w-full border border-orange-200 dark:border-orange-600 rounded-lg bg-white"
        />
        
        <div className="mt-3 text-sm text-orange-700 dark:text-orange-300">
          <strong>Key Optimization:</strong> Only traverse left if root.val &gt; low, right if root.val &lt; high. 
          This avoids unnecessary subtree traversals using BST property.
        </div>
      </div>
    );
  };

  // BST Balance Visualization Component
  const BSTBalanceVisualization = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface BSTBalanceStep {
      step: number;
      description: string;
      originalTree?: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number}};
      balancedTree?: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number}};
      sortedArray?: number[];
      currentRange?: {start: number, end: number, mid: number};
      action: string;
      phase: 'original' | 'inorder' | 'building' | 'complete';
    }

    const getAnimationSteps = (): BSTBalanceStep[] => [
      {
        step: 0,
        description: "Original unbalanced BST - height is 4, very skewed to the right",
        originalTree: {
          "1": {val: 1, right: "2", x: 100, y: 50},
          "2": {val: 2, right: "3", x: 150, y: 100},
          "3": {val: 3, right: "4", x: 200, y: 150},
          "4": {val: 4, right: "5", x: 250, y: 200},
          "5": {val: 5, x: 300, y: 250}
        },
        action: "This BST is highly unbalanced - operations are O(n)",
        phase: 'original'
      },
      {
        step: 1,
        description: "Step 1: Perform inorder traversal to get sorted array",
        originalTree: {
          "1": {val: 1, right: "2", x: 100, y: 50},
          "2": {val: 2, right: "3", x: 150, y: 100},
          "3": {val: 3, right: "4", x: 200, y: 150},
          "4": {val: 4, right: "5", x: 250, y: 200},
          "5": {val: 5, x: 300, y: 250}
        },
        sortedArray: [1, 2, 3, 4, 5],
        action: "Inorder traversal gives us sorted array: [1, 2, 3, 4, 5]",
        phase: 'inorder'
      },
      {
        step: 2,
        description: "Step 2: Choose middle element (3) as root for balance",
        sortedArray: [1, 2, 3, 4, 5],
        currentRange: {start: 0, end: 4, mid: 2},
        balancedTree: {
          "3": {val: 3, x: 200, y: 50}
        },
        action: "Mid = (0 + 4) / 2 = 2, so root = arr[2] = 3",
        phase: 'building'
      },
      {
        step: 3,
        description: "Step 3: Recursively build left subtree from [1, 2]",
        sortedArray: [1, 2, 3, 4, 5],
        currentRange: {start: 0, end: 1, mid: 0},
        balancedTree: {
          "3": {val: 3, left: "1", x: 200, y: 50},
          "1": {val: 1, right: "2", x: 100, y: 120}
        },
        action: "Left subtree: mid = (0 + 1) / 2 = 0, root = arr[0] = 1",
        phase: 'building'
      },
      {
        step: 4,
        description: "Step 4: Add node 2 as right child of node 1",
        sortedArray: [1, 2, 3, 4, 5],
        currentRange: {start: 1, end: 1, mid: 1},
        balancedTree: {
          "3": {val: 3, left: "1", right: "4", x: 200, y: 50},
          "1": {val: 1, right: "2", x: 100, y: 120},
          "2": {val: 2, x: 150, y: 190},
          "4": {val: 4, x: 300, y: 120}
        },
        action: "Right child of 1: arr[1] = 2",
        phase: 'building'
      },
      {
        step: 5,
        description: "Step 5: Recursively build right subtree from [4, 5]",
        sortedArray: [1, 2, 3, 4, 5],
        currentRange: {start: 3, end: 4, mid: 3},
        balancedTree: {
          "3": {val: 3, left: "1", right: "4", x: 200, y: 50},
          "1": {val: 1, right: "2", x: 100, y: 120},
          "2": {val: 2, x: 150, y: 190},
          "4": {val: 4, right: "5", x: 300, y: 120},
          "5": {val: 5, x: 350, y: 190}
        },
        action: "Right subtree: mid = (3 + 4) / 2 = 3, root = arr[3] = 4",
        phase: 'building'
      },
      {
        step: 6,
        description: "Final balanced BST - height is 3, perfectly balanced",
        balancedTree: {
          "3": {val: 3, left: "1", right: "4", x: 200, y: 50},
          "1": {val: 1, right: "2", x: 100, y: 120},
          "2": {val: 2, x: 150, y: 190},
          "4": {val: 4, right: "5", x: 300, y: 120},
          "5": {val: 5, x: 350, y: 190}
        },
        action: "Balanced BST complete - operations are now O(log n)",
        phase: 'complete'
      }
    ];

    const steps = getAnimationSteps();
    const currentStep = steps[bstBalanceAnimationStep] || steps[0];

    const drawTree = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw original tree (left side)
      if (currentStep.originalTree) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Original (Unbalanced)', 200, 25);

        // Draw edges
        Object.entries(currentStep.originalTree).forEach(([nodeId, node]) => {
          if (node.right && currentStep.originalTree![node.right]) {
            const rightNode = currentStep.originalTree![node.right];
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(rightNode.x, rightNode.y);
            ctx.stroke();
          }
        });

        // Draw nodes
        Object.entries(currentStep.originalTree).forEach(([nodeId, node]) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 18, 0, 2 * Math.PI);
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3;
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.val.toString(), node.x, node.y);
        });
      }

      // Draw balanced tree (right side)
      if (currentStep.balancedTree) {
        const offsetX = currentStep.originalTree ? 250 : 0;
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Balanced BST', 200 + offsetX, 25);

        // Draw edges
        Object.entries(currentStep.balancedTree).forEach(([nodeId, node]) => {
          if (node.left && currentStep.balancedTree![node.left]) {
            const leftNode = currentStep.balancedTree![node.left];
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(node.x + offsetX, node.y);
            ctx.lineTo(leftNode.x + offsetX, leftNode.y);
            ctx.stroke();
          }
          if (node.right && currentStep.balancedTree![node.right]) {
            const rightNode = currentStep.balancedTree![node.right];
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(node.x + offsetX, node.y);
            ctx.lineTo(rightNode.x + offsetX, rightNode.y);
            ctx.stroke();
          }
        });

        // Draw nodes
        Object.entries(currentStep.balancedTree).forEach(([nodeId, node]) => {
          ctx.beginPath();
          ctx.arc(node.x + offsetX, node.y, 18, 0, 2 * Math.PI);
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 3;
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.val.toString(), node.x + offsetX, node.y);
        });
      }

      // Draw sorted array
      if (currentStep.sortedArray) {
        const arrayY = 320;
        const startX = 150;
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Sorted Array:', 50, arrayY - 10);

        currentStep.sortedArray.forEach((val, index) => {
          const x = startX + index * 40;
          const isMiddle = currentStep.currentRange && index === currentStep.currentRange.mid;
          
          ctx.beginPath();
          ctx.rect(x - 15, arrayY - 15, 30, 30);
          ctx.fillStyle = isMiddle ? '#fbbf24' : '#6b7280';
          ctx.strokeStyle = isMiddle ? '#f59e0b' : '#4b5563';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val.toString(), x, arrayY);

          // Draw index
          ctx.fillStyle = '#6b7280';
          ctx.font = '10px Arial';
          ctx.fillText(index.toString(), x, arrayY + 25);
        });

        // Draw range indicators
        if (currentStep.currentRange) {
          const {start, end, mid} = currentStep.currentRange;
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          
          // Start bracket
          ctx.beginPath();
          ctx.moveTo(startX + start * 40 - 20, arrayY - 20);
          ctx.lineTo(startX + start * 40 - 20, arrayY + 20);
          ctx.stroke();
          
          // End bracket
          ctx.beginPath();
          ctx.moveTo(startX + end * 40 + 20, arrayY - 20);
          ctx.lineTo(startX + end * 40 + 20, arrayY + 20);
          ctx.stroke();
          
          ctx.setLineDash([]);
        }
      }

      // Draw info panel
      const infoX = 450;
      const infoY = 50;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillRect(infoX, infoY, 180, 200);
      ctx.strokeRect(infoX, infoY, 180, 200);

      // Info text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('BST Balance Steps', infoX + 10, infoY + 25);
      
      ctx.font = '12px Arial';
      ctx.fillText(`Step ${currentStep.step + 1}/7`, infoX + 10, infoY + 45);
      
      // Phase indicator
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 11px Arial';
      ctx.fillText(`Phase: ${currentStep.phase}`, infoX + 10, infoY + 65);
      
      // Wrap description text
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px Arial';
      const words = currentStep.description.split(' ');
      let line = '';
      let y = infoY + 85;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 160 && i > 0) {
          ctx.fillText(line, infoX + 10, y);
          line = words[i] + ' ';
          y += 14;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, infoX + 10, y);
      
      // Action
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 10px Arial';
      ctx.fillText('Action:', infoX + 10, y + 20);
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      
      const actionWords = currentStep.action.split(' ');
      let actionLine = '';
      let actionY = y + 35;
      
      for (let i = 0; i < actionWords.length; i++) {
        const testLine = actionLine + actionWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 160 && i > 0) {
          ctx.fillText(actionLine, infoX + 10, actionY);
          actionLine = actionWords[i] + ' ';
          actionY += 12;
        } else {
          actionLine = testLine;
        }
      }
      ctx.fillText(actionLine, infoX + 10, actionY);

      // Height comparison
      if (currentStep.step === 6) {
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('Original Height: 5', infoX + 10, actionY + 25);
        ctx.fillStyle = '#059669';
        ctx.fillText('Balanced Height: 3', infoX + 10, actionY + 40);
      }
    };

    useEffect(() => {
      drawTree();
    }, [bstBalanceAnimationStep]);

    return (
      <div className="mt-6 p-4 bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/30 rounded-xl border border-teal-200 dark:border-teal-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-teal-800 dark:text-teal-200">
            ⚖️ BST Balance Visualization
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setBSTBalanceAnimationStep(0)}
              className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setBSTBalanceAnimationStep(Math.max(0, bstBalanceAnimationStep - 1))}
              disabled={bstBalanceAnimationStep === 0}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setBSTBalanceAnimationStep(Math.min(6, bstBalanceAnimationStep + 1))}
              disabled={bstBalanceAnimationStep === 6}
              className="px-3 py-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full border border-teal-200 dark:border-teal-600 rounded-lg bg-white"
        />
        
        <div className="mt-3 text-sm text-teal-700 dark:text-teal-300">
          <strong>Key Strategy:</strong> Choose middle element as root to ensure equal-sized left and right subtrees, 
          creating optimal height balance. Height reduces from O(n) to O(log n).
        </div>
      </div>
    );
  };

  // Postorder Traversal Visualization Component
  const PostorderTraversalVisualization = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface PostorderStep {
      step: number;
      description: string;
      tree: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number, status: 'normal' | 'current' | 'visited' | 'in_stack' | 'last_visited'}};
      stack: string[];
      result: number[];
      current?: string;
      lastVisited?: string;
      peekNode?: string;
      action: string;
      condition?: string;
      explanation: string;
    }

    const getAnimationSteps = (): PostorderStep[] => [
      {
        step: 0,
        description: "Initialize: current = root, stack = [], result = [], last_visited = null",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'current'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'normal'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'normal'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'}
        },
        stack: [],
        result: [],
        current: "1",
        action: "Start with root node as current",
        explanation: "Postorder: Left → Right → Root. We need to visit children before parent."
      },
      {
        step: 1,
        description: "Push current (1) to stack, move to left child (2)",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'current'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'normal'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'}
        },
        stack: ["1"],
        result: [],
        current: "2",
        action: "Go left: stack.append(1), current = 2",
        explanation: "Keep going left until we find a leaf or node without left child."
      },
      {
        step: 2,
        description: "Push current (2) to stack, move to left child (4)",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'in_stack'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'current'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'}
        },
        stack: ["1", "2"],
        result: [],
        current: "4",
        action: "Go left: stack.append(2), current = 4",
        explanation: "Continue going left. Node 4 is a leaf - no left child."
      },
      {
        step: 3,
        description: "Node 4 has no left child, so current = null. Peek at stack top (4)",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'in_stack'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'current'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'}
        },
        stack: ["1", "2", "4"],
        result: [],
        current: undefined,
        peekNode: "4",
        condition: "peek_node.right = null, last_visited = null",
        action: "Check: Can we process node 4?",
        explanation: "Node 4 has no right child, so we can process it immediately."
      },
      {
        step: 4,
        description: "Process node 4: add to result, set as last_visited",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'in_stack'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'last_visited'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'}
        },
        stack: ["1", "2"],
        result: [4],
        lastVisited: "4",
        action: "result.append(4), last_visited = 4, pop from stack",
        explanation: "Node 4 processed! Now peek at node 2."
      },
      {
        step: 5,
        description: "Peek at node 2. It has right child (5) and last_visited ≠ 5",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'current'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'last_visited'},
          "5": {val: 5, x: 150, y: 190, status: 'normal'}
        },
        stack: ["1", "2"],
        result: [4],
        lastVisited: "4",
        peekNode: "2",
        current: "5",
        condition: "peek_node.right = 5, last_visited = 4 ≠ 5",
        action: "Go right: current = 5 (must visit right subtree first)",
        explanation: "🔑 KEY: We haven't visited right subtree yet, so go right first!"
      },
      {
        step: 6,
        description: "Push node 5 to stack (no left child)",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'in_stack'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'last_visited'},
          "5": {val: 5, x: 150, y: 190, status: 'current'}
        },
        stack: ["1", "2", "5"],
        result: [4],
        lastVisited: "4",
        current: undefined,
        action: "stack.append(5), current = null (5 has no left child)",
        explanation: "Node 5 is a leaf, so we can process it next."
      },
      {
        step: 7,
        description: "Process node 5: no right child, so add to result",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'in_stack'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'visited'},
          "5": {val: 5, x: 150, y: 190, status: 'last_visited'}
        },
        stack: ["1", "2"],
        result: [4, 5],
        lastVisited: "5",
        condition: "peek_node.right = null, so process immediately",
        action: "result.append(5), last_visited = 5",
        explanation: "Node 5 processed! Now we can finally process node 2."
      },
      {
        step: 8,
        description: "Peek at node 2. Right child (5) was just visited, so process node 2",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'current'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'visited'},
          "5": {val: 5, x: 150, y: 190, status: 'visited'}
        },
        stack: ["1"],
        result: [4, 5, 2],
        lastVisited: "2",
        peekNode: "2",
        condition: "peek_node.right = 5, last_visited = 5 = 5 ✓",
        action: "Both children visited! result.append(2), last_visited = 2",
        explanation: "🔑 KEY: last_visited = right child means right subtree is done!"
      },
      {
        step: 9,
        description: "Peek at node 1. It has right child (3) and last_visited ≠ 3",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'current'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'last_visited'},
          "3": {val: 3, x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'visited'},
          "5": {val: 5, x: 150, y: 190, status: 'visited'}
        },
        stack: ["1"],
        result: [4, 5, 2],
        lastVisited: "2",
        peekNode: "1",
        current: "3",
        condition: "peek_node.right = 3, last_visited = 2 ≠ 3",
        action: "Go right: current = 3 (must visit right subtree)",
        explanation: "Left subtree of 1 is done, now visit right subtree (node 3)."
      },
      {
        step: 10,
        description: "Process node 3: it's a leaf, so add to result immediately",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'in_stack'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'visited'},
          "3": {val: 3, x: 300, y: 120, status: 'last_visited'},
          "4": {val: 4, x: 50, y: 190, status: 'visited'},
          "5": {val: 5, x: 150, y: 190, status: 'visited'}
        },
        stack: ["1"],
        result: [4, 5, 2, 3],
        lastVisited: "3",
        action: "stack.append(3), then immediately process (no children)",
        explanation: "Node 3 is a leaf - no children to visit first."
      },
      {
        step: 11,
        description: "Finally process root (1): both children visited",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'last_visited'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'visited'},
          "3": {val: 3, x: 300, y: 120, status: 'visited'},
          "4": {val: 4, x: 50, y: 190, status: 'visited'},
          "5": {val: 5, x: 150, y: 190, status: 'visited'}
        },
        stack: [],
        result: [4, 5, 2, 3, 1],
        lastVisited: "1",
        condition: "peek_node.right = 3, last_visited = 3 = 3 ✓",
        action: "result.append(1) - Postorder complete!",
        explanation: "🎉 Final result: [4, 5, 2, 3, 1] - Left, Right, Root order!"
      }
    ];

    const steps = getAnimationSteps();
    const currentStep = steps[postorderAnimationStep] || steps[0];

    const drawTree = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw edges first
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        if (node.left && currentStep.tree[node.left]) {
          const leftNode = currentStep.tree[node.left];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(leftNode.x, leftNode.y);
          ctx.stroke();
        }
        if (node.right && currentStep.tree[node.right]) {
          const rightNode = currentStep.tree[node.right];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNode.x, rightNode.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        
        if (node.status === 'current') {
          ctx.fillStyle = '#fbbf24'; // Yellow for current
          ctx.strokeStyle = '#f59e0b';
        } else if (node.status === 'in_stack') {
          ctx.fillStyle = '#3b82f6'; // Blue for in stack
          ctx.strokeStyle = '#2563eb';
        } else if (node.status === 'last_visited') {
          ctx.fillStyle = '#ef4444'; // Red for last visited
          ctx.strokeStyle = '#dc2626';
        } else if (node.status === 'visited') {
          ctx.fillStyle = '#10b981'; // Green for visited
          ctx.strokeStyle = '#059669';
        } else {
          ctx.fillStyle = '#6b7280'; // Gray for normal
          ctx.strokeStyle = '#4b5563';
        }
        
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        // Node value
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val.toString(), node.x, node.y);
      });

      // Draw stack visualization
      const stackX = 50;
      const stackY = 280;
      
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Stack:', stackX, stackY - 10);
      
      currentStep.stack.forEach((nodeId, index) => {
        const x = stackX + index * 35;
        ctx.beginPath();
        ctx.rect(x, stackY, 30, 30);
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nodeId, x + 15, stackY + 15);
      });

      // Draw result array
      const resultX = 250;
      const resultY = 280;
      
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Result:', resultX, resultY - 10);
      
      currentStep.result.forEach((val, index) => {
        const x = resultX + index * 35;
        ctx.beginPath();
        ctx.rect(x, resultY, 30, 30);
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toString(), x + 15, resultY + 15);
      });

      // Draw info panel
      const infoX = 420;
      const infoY = 20;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillRect(infoX, infoY, 200, 240);
      ctx.strokeRect(infoX, infoY, 200, 240);

      // Info text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Postorder Traversal', infoX + 10, infoY + 25);
      
      ctx.font = '12px Arial';
      ctx.fillText(`Step ${currentStep.step + 1}/12`, infoX + 10, infoY + 45);
      
      // Current state
      if (currentStep.current) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(`Current: ${currentStep.current}`, infoX + 10, infoY + 65);
      }
      
      if (currentStep.lastVisited) {
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(`Last Visited: ${currentStep.lastVisited}`, infoX + 10, infoY + 80);
      }
      
      if (currentStep.peekNode) {
        ctx.fillStyle = '#2563eb';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(`Peek: ${currentStep.peekNode}`, infoX + 10, infoY + 95);
      }

      // Condition check
      if (currentStep.condition) {
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'bold 10px Arial';
        ctx.fillText('Condition:', infoX + 10, infoY + 115);
        ctx.fillStyle = '#1e293b';
        ctx.font = '9px Arial';
        
        const condWords = currentStep.condition.split(' ');
        let condLine = '';
        let condY = infoY + 130;
        
        for (let i = 0; i < condWords.length; i++) {
          const testLine = condLine + condWords[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 180 && i > 0) {
            ctx.fillText(condLine, infoX + 10, condY);
            condLine = condWords[i] + ' ';
            condY += 12;
          } else {
            condLine = testLine;
          }
        }
        ctx.fillText(condLine, infoX + 10, condY);
      }

      // Action
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 10px Arial';
      ctx.fillText('Action:', infoX + 10, infoY + 160);
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      
      const actionWords = currentStep.action.split(' ');
      let actionLine = '';
      let actionY = infoY + 175;
      
      for (let i = 0; i < actionWords.length; i++) {
        const testLine = actionLine + actionWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(actionLine, infoX + 10, actionY);
          actionLine = actionWords[i] + ' ';
          actionY += 12;
        } else {
          actionLine = testLine;
        }
      }
      ctx.fillText(actionLine, infoX + 10, actionY);

      // Explanation
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 9px Arial';
      ctx.fillText('Why:', infoX + 10, actionY + 20);
      ctx.fillStyle = '#1e293b';
      ctx.font = '9px Arial';
      
      const explWords = currentStep.explanation.split(' ');
      let explLine = '';
      let explY = actionY + 35;
      
      for (let i = 0; i < explWords.length; i++) {
        const testLine = explLine + explWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(explLine, infoX + 10, explY);
          explLine = explWords[i] + ' ';
          explY += 11;
        } else {
          explLine = testLine;
        }
      }
      ctx.fillText(explLine, infoX + 10, explY);

      // Legend
      const legendY = infoY + 200;
      const legendItems = [
        {color: '#fbbf24', label: 'Current'},
        {color: '#3b82f6', label: 'In Stack'},
        {color: '#ef4444', label: 'Last Visited'},
        {color: '#10b981', label: 'Processed'}
      ];

      legendItems.forEach((item, index) => {
        const x = infoX + 10 + (index % 2) * 90;
        const y = legendY + Math.floor(index / 2) * 15;
        
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#1e293b';
        ctx.font = '8px Arial';
        ctx.fillText(item.label, x + 8, y + 3);
      });
    };

    useEffect(() => {
      drawTree();
    }, [postorderAnimationStep]);

    return (
      <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
            🔄 Postorder Traversal Visualization
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setPostorderAnimationStep(0)}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setPostorderAnimationStep(Math.max(0, postorderAnimationStep - 1))}
              disabled={postorderAnimationStep === 0}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setPostorderAnimationStep(Math.min(11, postorderAnimationStep + 1))}
              disabled={postorderAnimationStep === 11}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={640}
          height={340}
          className="w-full border border-indigo-200 dark:border-indigo-600 rounded-lg bg-white"
        />
        
        <div className="mt-3 text-sm text-indigo-700 dark:text-indigo-300">
          <strong>🔑 Key Insight:</strong> <code>last_visited != peek_node.right</code> prevents infinite loops! 
          If we just visited the right child, we know the right subtree is complete and can process the parent.
          Without this check, we'd keep going right infinitely.
        </div>
      </div>
    );
  };

  // Boundary Traversal Visualization Component
  const BoundaryTraversalVisualization = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface BoundaryStep {
      step: number;
      description: string;
      tree: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number, status: 'normal' | 'root' | 'left_boundary' | 'leaf' | 'right_boundary' | 'current' | 'processed'}};
      result: number[];
      phase: 'root' | 'left_boundary' | 'leaves' | 'right_boundary' | 'complete';
      currentNode?: string;
      action: string;
      explanation: string;
    }

    const getAnimationSteps = (): BoundaryStep[] => [
      {
        step: 0,
        description: "Start with root node - always included in boundary",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'normal'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'normal'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "7": {val: 7, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 125, y: 260, status: 'normal'}
        },
        result: [1],
        phase: 'root',
        action: "result = [1] - Root is always part of boundary",
        explanation: "Boundary traversal starts with root, then goes: left boundary → leaves → right boundary (reverse)"
      },
      {
        step: 1,
        description: "Phase 1: Traverse left boundary (excluding leaves)",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'current'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'normal'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "7": {val: 7, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 125, y: 260, status: 'normal'}
        },
        result: [1, 2],
        phase: 'left_boundary',
        currentNode: "2",
        action: "left_boundary(root.left) - Add node 2, continue left",
        explanation: "Left boundary: go left if possible, else go right. Skip leaves (they'll be added later)"
      },
      {
        step: 2,
        description: "Continue left boundary: node 4 is a leaf, so skip it",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'left_boundary'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'current'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "7": {val: 7, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 125, y: 260, status: 'normal'}
        },
        result: [1, 2],
        phase: 'left_boundary',
        currentNode: "4",
        action: "Node 4 is a leaf - skip in left boundary phase",
        explanation: "🔑 KEY: Left boundary excludes leaves! Leaves will be collected separately."
      },
      {
        step: 3,
        description: "Phase 2: Collect all leaf nodes (left to right)",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'left_boundary'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'current'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "7": {val: 7, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 125, y: 260, status: 'normal'}
        },
        result: [1, 2, 4],
        phase: 'leaves',
        currentNode: "4",
        action: "leaves(root) - Found leaf 4, add to result",
        explanation: "Leaf collection: traverse entire tree, add only leaf nodes (no children)"
      },
      {
        step: 4,
        description: "Continue collecting leaves: found leaf 8",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'left_boundary'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'leaf'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'normal'},
          "7": {val: 7, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 125, y: 260, status: 'current'}
        },
        result: [1, 2, 4, 8],
        phase: 'leaves',
        currentNode: "8",
        action: "Found leaf 8, add to result",
        explanation: "Continue inorder traversal to find all leaves from left to right"
      },
      {
        step: 5,
        description: "Continue collecting leaves: found leaf 6",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'left_boundary'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'leaf'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'current'},
          "7": {val: 7, x: 350, y: 190, status: 'normal'},
          "8": {val: 8, x: 125, y: 260, status: 'leaf'}
        },
        result: [1, 2, 4, 8, 6],
        phase: 'leaves',
        currentNode: "6",
        action: "Found leaf 6, add to result",
        explanation: "Leaves are collected in left-to-right order during tree traversal"
      },
      {
        step: 6,
        description: "Continue collecting leaves: found leaf 7",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'left_boundary'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'normal'},
          "4": {val: 4, x: 50, y: 190, status: 'leaf'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'normal'},
          "6": {val: 6, x: 250, y: 190, status: 'leaf'},
          "7": {val: 7, x: 350, y: 190, status: 'current'},
          "8": {val: 8, x: 125, y: 260, status: 'leaf'}
        },
        result: [1, 2, 4, 8, 6, 7],
        phase: 'leaves',
        currentNode: "7",
        action: "Found leaf 7, add to result",
        explanation: "All leaves collected: [4, 8, 6, 7] in left-to-right order"
      },
      {
        step: 7,
        description: "Phase 3: Traverse right boundary (bottom-up, excluding leaves)",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'left_boundary'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'current'},
          "4": {val: 4, x: 50, y: 190, status: 'leaf'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'processed'},
          "6": {val: 6, x: 250, y: 190, status: 'leaf'},
          "7": {val: 7, x: 350, y: 190, status: 'leaf'},
          "8": {val: 8, x: 125, y: 260, status: 'leaf'}
        },
        result: [1, 2, 4, 8, 6, 7, 3],
        phase: 'right_boundary',
        currentNode: "3",
        action: "right_boundary(root.right) - Add node 3 (bottom-up)",
        explanation: "🔑 KEY: Right boundary is added in REVERSE order (bottom-up) to maintain clockwise direction"
      },
      {
        step: 8,
        description: "Boundary traversal complete!",
        tree: {
          "1": {val: 1, left: "2", right: "3", x: 200, y: 50, status: 'root'},
          "2": {val: 2, left: "4", right: "5", x: 100, y: 120, status: 'left_boundary'},
          "3": {val: 3, left: "6", right: "7", x: 300, y: 120, status: 'right_boundary'},
          "4": {val: 4, x: 50, y: 190, status: 'leaf'},
          "5": {val: 5, left: "8", x: 150, y: 190, status: 'processed'},
          "6": {val: 6, x: 250, y: 190, status: 'leaf'},
          "7": {val: 7, x: 350, y: 190, status: 'leaf'},
          "8": {val: 8, x: 125, y: 260, status: 'leaf'}
        },
        result: [1, 2, 4, 8, 6, 7, 3],
        phase: 'complete',
        action: "Final result: [1, 2, 4, 8, 6, 7, 3] - Complete boundary!",
        explanation: "🎉 Perfect clockwise boundary: Root → Left boundary → Leaves → Right boundary (reverse)"
      }
    ];

    const steps = getAnimationSteps();
    const currentStep = steps[boundaryAnimationStep] || steps[0];

    const drawTree = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw edges first
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        if (node.left && currentStep.tree[node.left]) {
          const leftNode = currentStep.tree[node.left];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(leftNode.x, leftNode.y);
          ctx.stroke();
        }
        if (node.right && currentStep.tree[node.right]) {
          const rightNode = currentStep.tree[node.right];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNode.x, rightNode.y);
          ctx.stroke();
        }
      });

      // Draw boundary path
      if (currentStep.step >= 7) {
        const boundaryNodes = ['1', '2', '4', '8', '6', '7', '3'];
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 4]);
        
        for (let i = 0; i < boundaryNodes.length - 1; i++) {
          const current = currentStep.tree[boundaryNodes[i]];
          const next = currentStep.tree[boundaryNodes[i + 1]];
          if (current && next) {
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
        }
        
        // Close the boundary
        const first = currentStep.tree[boundaryNodes[0]];
        const last = currentStep.tree[boundaryNodes[boundaryNodes.length - 1]];
        if (first && last) {
          ctx.beginPath();
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(first.x, first.y);
          ctx.stroke();
        }
        
        ctx.setLineDash([]);
      }

      // Draw nodes
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        
        if (node.status === 'root') {
          ctx.fillStyle = '#dc2626'; // Red for root
          ctx.strokeStyle = '#b91c1c';
        } else if (node.status === 'left_boundary') {
          ctx.fillStyle = '#2563eb'; // Blue for left boundary
          ctx.strokeStyle = '#1d4ed8';
        } else if (node.status === 'right_boundary') {
          ctx.fillStyle = '#7c3aed'; // Purple for right boundary
          ctx.strokeStyle = '#6d28d9';
        } else if (node.status === 'leaf') {
          ctx.fillStyle = '#059669'; // Green for leaves
          ctx.strokeStyle = '#047857';
        } else if (node.status === 'current') {
          ctx.fillStyle = '#f59e0b'; // Orange for current
          ctx.strokeStyle = '#d97706';
        } else if (node.status === 'processed') {
          ctx.fillStyle = '#6b7280'; // Gray for processed
          ctx.strokeStyle = '#4b5563';
        } else {
          ctx.fillStyle = '#9ca3af'; // Light gray for normal
          ctx.strokeStyle = '#6b7280';
        }
        
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        // Node value
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val.toString(), node.x, node.y);
      });

      // Draw result array
      const resultX = 50;
      const resultY = 320;
      
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Boundary Result:', resultX, resultY - 10);
      
      currentStep.result.forEach((val, index) => {
        const x = resultX + index * 35;
        ctx.beginPath();
        ctx.rect(x, resultY, 30, 30);
        
        // Color code based on phase
        if (index === 0) {
          ctx.fillStyle = '#dc2626'; // Root
          ctx.strokeStyle = '#b91c1c';
        } else if (index === 1) {
          ctx.fillStyle = '#2563eb'; // Left boundary
          ctx.strokeStyle = '#1d4ed8';
        } else if (index >= 2 && index <= 5) {
          ctx.fillStyle = '#059669'; // Leaves
          ctx.strokeStyle = '#047857';
        } else {
          ctx.fillStyle = '#7c3aed'; // Right boundary
          ctx.strokeStyle = '#6d28d9';
        }
        
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toString(), x + 15, resultY + 15);
      });

      // Draw info panel
      const infoX = 420;
      const infoY = 20;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.fillRect(infoX, infoY, 200, 260);
      ctx.strokeRect(infoX, infoY, 200, 260);

      // Info text
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Boundary Traversal', infoX + 10, infoY + 25);
      
      ctx.font = '12px Arial';
      ctx.fillText(`Step ${currentStep.step + 1}/9`, infoX + 10, infoY + 45);
      
      // Phase indicator
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px Arial';
      ctx.fillText(`Phase: ${currentStep.phase}`, infoX + 10, infoY + 65);
      
      // Current node
      if (currentStep.currentNode) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(`Current: ${currentStep.currentNode}`, infoX + 10, infoY + 80);
      }

      // Wrap description text
      ctx.fillStyle = '#1e293b';
      ctx.font = '11px Arial';
      const words = currentStep.description.split(' ');
      let line = '';
      let y = infoY + 100;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(line, infoX + 10, y);
          line = words[i] + ' ';
          y += 14;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, infoX + 10, y);
      
      // Action
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 10px Arial';
      ctx.fillText('Action:', infoX + 10, y + 20);
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      
      const actionWords = currentStep.action.split(' ');
      let actionLine = '';
      let actionY = y + 35;
      
      for (let i = 0; i < actionWords.length; i++) {
        const testLine = actionLine + actionWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(actionLine, infoX + 10, actionY);
          actionLine = actionWords[i] + ' ';
          actionY += 12;
        } else {
          actionLine = testLine;
        }
      }
      ctx.fillText(actionLine, infoX + 10, actionY);

      // Explanation
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 9px Arial';
      ctx.fillText('Why:', infoX + 10, actionY + 20);
      ctx.fillStyle = '#1e293b';
      ctx.font = '9px Arial';
      
      const explWords = currentStep.explanation.split(' ');
      let explLine = '';
      let explY = actionY + 35;
      
      for (let i = 0; i < explWords.length; i++) {
        const testLine = explLine + explWords[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 180 && i > 0) {
          ctx.fillText(explLine, infoX + 10, explY);
          explLine = explWords[i] + ' ';
          explY += 11;
        } else {
          explLine = testLine;
        }
      }
      ctx.fillText(explLine, infoX + 10, explY);

      // Legend
      const legendY = infoY + 200;
      const legendItems = [
        {color: '#dc2626', label: 'Root'},
        {color: '#2563eb', label: 'Left Boundary'},
        {color: '#059669', label: 'Leaves'},
        {color: '#7c3aed', label: 'Right Boundary'}
      ];

      legendItems.forEach((item, index) => {
        const x = infoX + 10 + (index % 2) * 90;
        const y = legendY + Math.floor(index / 2) * 15;
        
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#1e293b';
        ctx.font = '8px Arial';
        ctx.fillText(item.label, x + 8, y + 3);
      });

      // Draw traversal order
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 9px Arial';
      ctx.fillText('Traversal Order:', infoX + 10, legendY + 35);
      ctx.font = '8px Arial';
      ctx.fillText('1. Root → 2. Left Boundary', infoX + 10, legendY + 50);
      ctx.fillText('3. Leaves → 4. Right Boundary ↑', infoX + 10, legendY + 62);
    };

    useEffect(() => {
      drawTree();
    }, [boundaryAnimationStep]);

    return (
      <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
            🔄 Boundary Traversal Visualization
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setBoundaryAnimationStep(0)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setBoundaryAnimationStep(Math.max(0, boundaryAnimationStep - 1))}
              disabled={boundaryAnimationStep === 0}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setBoundaryAnimationStep(Math.min(8, boundaryAnimationStep + 1))}
              disabled={boundaryAnimationStep === 8}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width={640}
          height={370}
          className="w-full border border-amber-200 dark:border-amber-600 rounded-lg bg-white"
        />
        
        <div className="mt-3 text-sm text-amber-700 dark:text-amber-300">
          <strong>🔑 Key Order:</strong> Root → Left Boundary (top-down) → Leaves (left-to-right) → Right Boundary (bottom-up).
          The right boundary is added in reverse to maintain clockwise direction around the tree boundary.
        </div>
      </div>
    );
  };

  // All Tree Multiple Choice Questions (flattened - follow-ups are now separate questions)
  const questions: MCQuestion[] = [
    // Tree DP Questions (15 questions total)
    {
      id: 1,
      topic: "Tree DP",
      functionName: "minCameraCover",
      difficulty: "Hard",
      question: "What's the missing state transition in the binary tree camera coverage problem?",
      code: `def minCameraCover(root):
    cameras = 0
    
    def dfs(node):
        nonlocal cameras
        if not node:
            return 2  # monitored (no camera needed)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # MISSING LOGIC - when to place camera?
        if left == 0 or right == 0:
            cameras += 1
            return 1  # has camera
        
        if left == 1 or right == 1:
            return 2  # monitored by child
        
        return 0  # not monitored
    
    result = dfs(root)
    return cameras + (1 if result == 0 else 0)`,
      options: [
        "Place camera when any child is not monitored (state 0)",
        "Place camera when all children have cameras (state 1)",
        "Place camera when node is a leaf",
        "Place camera at every other level"
      ],
      correctAnswer: 0,
      hint: "Think about when a node MUST have a camera to ensure coverage.",
      explanation: "If any child is not monitored (state 0), the current node must have a camera to monitor that child. This is the greedy optimal strategy.",
      followUpQuestions: []
    },
    {
      id: 2,
      topic: "Tree DP",
      functionName: "minCameraCover",
      difficulty: "Medium",
      question: "What's the time complexity of the binary tree camera coverage solution?",
      code: `def minCameraCover(root):
    cameras = 0
    
    def dfs(node):
        nonlocal cameras
        if not node:
            return 2
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        if left == 0 or right == 0:
            cameras += 1
            return 1
        
        if left == 1 or right == 1:
            return 2
        
        return 0
    
    result = dfs(root)
    return cameras + (1 if result == 0 else 0)`,
      options: ["O(n log n)", "O(n)", "O(n²)", "O(h) where h is height"],
      correctAnswer: 1,
      hint: "Consider how many times each node is visited in the DFS traversal.",
      explanation: "We visit each node exactly once in the DFS traversal, so it's O(n).",
      followUpQuestions: []
    },
    {
      id: 3,
      topic: "Tree DP",
      functionName: "minCameraCover",
      difficulty: "Medium",
      question: "Why is the greedy approach optimal for the camera coverage problem?",
      code: `def minCameraCover(root):
    # Greedy strategy: place cameras as high as possible
    # while ensuring all nodes are monitored
    cameras = 0
    
    def dfs(node):
        nonlocal cameras
        if not node:
            return 2  # monitored
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Place camera when child needs monitoring
        if left == 0 or right == 0:
            cameras += 1
            return 1  # has camera
        
        # Monitor from child cameras
        if left == 1 or right == 1:
            return 2  # monitored
        
        return 0  # not monitored
    
    result = dfs(root)
    return cameras + (1 if result == 0 else 0)`,
      options: [
        "It minimizes the number of recursive calls",
        "Placing cameras higher covers more nodes efficiently",
        "It reduces space complexity",
        "It's easier to implement"
      ],
      correctAnswer: 1,
      hint: "Think about the coverage area of cameras placed at different levels.",
      explanation: "Placing cameras at parent nodes rather than leaves covers more nodes (parent + children), leading to fewer total cameras needed.",
      followUpQuestions: []
    },
    {
      id: 4,
      topic: "Tree DP",
      functionName: "distributeCoins",
      difficulty: "Medium",
      question: "What's the key insight for the distribute coins problem?",
      code: `def distributeCoins(root):
    moves = 0
    # Need: each node has 1 coin
    
    def dfs(node):
        nonlocal moves
        if not node:
            return 0
        
        left_excess = dfs(node.left)
        right_excess = dfs(node.right)
        
        # MISSING LOGIC - how to calculate moves?
        moves += abs(left_excess) + abs(right_excess)
        
        return node.val + left_excess + right_excess - 1
    
    dfs(root)
    return moves`,
      options: [
        "Count total coins and distribute evenly",
        "Move excess coins from subtrees through current node",
        "Always move coins to the root first",
        "Calculate minimum spanning tree of coin movements"
      ],
      correctAnswer: 1,
      hint: "Think about how coins flow through each node from its subtrees.",
      explanation: "Each node acts as a conduit for excess coins from its subtrees. The absolute value of excess represents coins that must pass through this node.",
      followUpQuestions: []
    },
    {
      id: 5,
      topic: "Tree DP",
      functionName: "distributeCoins",
      difficulty: "Easy",
      question: "Why do we return 'node.val + left_excess + right_excess - 1' in distribute coins?",
      code: `def distributeCoins(root):
    moves = 0
    
    def dfs(node):
        nonlocal moves
        if not node:
            return 0
        
        left_excess = dfs(node.left)
        right_excess = dfs(node.right)
        
        moves += abs(left_excess) + abs(right_excess)
        
        # Return excess coins after keeping 1 for current node
        return node.val + left_excess + right_excess - 1
    
    dfs(root)
    return moves`,
      options: [
        "To calculate the total coins in subtree",
        "To find excess coins after keeping 1 for current node",
        "To minimize the number of moves",
        "To balance the tree"
      ],
      correctAnswer: 1,
      hint: "Each node needs exactly 1 coin. What happens to the rest?",
      explanation: "Each node needs exactly 1 coin. The excess (positive or negative) represents coins that need to flow to/from parent.",
      followUpQuestions: []
    },
    {
      id: 2,
      topic: "Tree DP",
      functionName: "distributeCoins",
      difficulty: "Medium",
      question: "What's the key insight for the distribute coins problem?",
      code: `def distributeCoins(root):
    moves = 0
    
    def dfs(node):
        nonlocal moves
        if not node:
            return 0
        
        left_excess = dfs(node.left)
        right_excess = dfs(node.right)
        
        # MISSING LOGIC - how to calculate moves?
        moves += abs(left_excess) + abs(right_excess)
        
        return node.val + left_excess + right_excess - 1
    
    dfs(root)
    return moves`,
      options: [
        "Count total coins and distribute evenly",
        "Move excess coins from subtrees through current node",
        "Always move coins to the root first",
        "Calculate minimum spanning tree of coin movements"
      ],
      correctAnswer: 1,
      hint: "Think about how coins flow through each node from its subtrees.",
      explanation: "Each node acts as a conduit for excess coins from its subtrees. The absolute value of excess represents coins that must pass through this node.",
      followUpQuestions: [
        {
          question: "Why do we return 'node.val + left_excess + right_excess - 1'?",
          options: [
            "To calculate the total coins in subtree",
            "To find excess coins after keeping 1 for current node",
            "To minimize the number of moves",
            "To balance the tree"
          ],
          correctAnswer: 1,
          explanation: "Each node needs exactly 1 coin. The excess (positive or negative) represents coins that need to flow to/from parent."
        }
      ]
    },
    {
      id: 3,
      topic: "Tree DP",
      functionName: "rob",
      difficulty: "Medium",
      question: "What's missing in the house robber tree DP solution?",
      code: `def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, not_rob)
        
        left_rob, left_not_rob = dfs(node.left)
        right_rob, right_not_rob = dfs(node.right)
        
        # MISSING LOGIC - how to calculate rob vs not_rob?
        rob_current = node.val + left_not_rob + right_not_rob
        not_rob_current = max(left_rob, left_not_rob) + max(right_rob, right_not_rob)
        
        return (rob_current, not_rob_current)
    
    rob_root, not_rob_root = dfs(root)
    return max(rob_root, not_rob_root)`,
      options: [
        "If we rob current, we can't rob children (use their not_rob values)",
        "If we rob current, we must rob all descendants",
        "Always rob the node with maximum value",
        "Rob nodes at alternating levels"
      ],
      correctAnswer: 0,
      hint: "Consider the constraint: adjacent houses cannot both be robbed.",
      explanation: "If we rob the current house, we cannot rob its direct children, so we take their 'not_rob' values. If we don't rob current, we can choose optimally from children.",
      followUpQuestions: [
        {
          question: "What's the space complexity of this solution?",
          options: ["O(1)", "O(log n)", "O(n)", "O(h) where h is height"],
          correctAnswer: 3,
          explanation: "The recursion depth equals the tree height, so space complexity is O(h) for the call stack."
        }
      ]
    },
    {
      id: 4,
      topic: "Tree DP",
      functionName: "maxPathSum",
      difficulty: "Hard",
      question: "What's the critical step in maximum path sum calculation?",
      code: `def maxPathSum(root):
    max_sum = float('-inf')
    
    def max_gain(node):
        nonlocal max_sum
        if not node:
            return 0
        
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)
        
        # MISSING LOGIC - update global maximum
        current_max = node.val + left_gain + right_gain
        max_sum = max(max_sum, current_max)
        
        return node.val + max(left_gain, right_gain)
    
    max_gain(root)
    return max_sum`,
      options: [
        "Always include both left and right subtrees in the path",
        "Update global max with path through current node, return single-side path",
        "Only consider paths that start from the root",
        "Calculate sum of all possible paths"
      ],
      correctAnswer: 1,
      hint: "A path can go through a node (using both subtrees) but can only extend in one direction.",
      explanation: "At each node, we consider the path that goes through it (left + node + right) for global maximum, but return only the best single-side path for parent nodes.",
      followUpQuestions: [
        {
          question: "Why do we take max(gain, 0) for subtree gains?",
          options: [
            "To handle negative values",
            "To ignore negative-sum subtrees",
            "To ensure positive path sums",
            "To simplify the calculation"
          ],
          correctAnswer: 1,
          explanation: "If a subtree has negative sum, it's better to not include it in the path, so we take 0 instead."
        }
      ]
    },
    {
      id: 5,
      topic: "Tree DP",
      functionName: "diameterOfBinaryTree",
      difficulty: "Easy",
      question: "What's the key insight for calculating tree diameter?",
      code: `def diameterOfBinaryTree(root):
    diameter = 0
    
    def depth(node):
        nonlocal diameter
        if not node:
            return 0
        
        left_depth = depth(node.left)
        right_depth = depth(node.right)
        
        # MISSING LOGIC - update diameter
        diameter = max(diameter, left_depth + right_depth)
        
        return 1 + max(left_depth, right_depth)
    
    depth(root)
    return diameter`,
      options: [
        "Diameter is the sum of left and right subtree depths",
        "Diameter is always through the root",
        "Diameter equals the height of the tree",
        "Diameter is the longest path between any two nodes"
      ],
      correctAnswer: 0,
      hint: "At each node, consider the longest path that passes through it.",
      explanation: "The diameter through any node is the sum of the depths of its left and right subtrees. We check this at every node to find the global maximum.",
      followUpQuestions: [
        {
          question: "Why might the diameter not pass through the root?",
          options: [
            "The root might not be the center of the tree",
            "Subtrees might have their own longer diameters",
            "The tree might be unbalanced",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "The diameter is the longest path between any two nodes, which might be entirely within a subtree and not involve the root."
        }
      ]
    },

    // LCA & Distance Questions (4 questions)
    {
      id: 6,
      topic: "LCA & Distance",
      functionName: "lowestCommonAncestor",
      difficulty: "Medium",
      question: "What's the base case for LCA in binary tree?",
      code: `def lowestCommonAncestor(root, p, q):
    # MISSING BASE CASE
    if not root or root == p or root == q:
        return root # None or p or q
    
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    if left and right:
        return root
    
    return left or right`,
      options: [
        "Return None when root is None",
        "Return root when it matches p or q",
        "Return root when root is None or matches p or q",
        "Always return the root"
      ],
      correctAnswer: 2,
      hint: "Think about when we've found one of the target nodes or reached the end.",
      explanation: "We return root when it's None (base case) or when it matches either p or q (found one target). This propagates the found nodes up the tree.",
      followUpQuestions: [
        {
          question: "Why do we return root when both left and right are non-null?",
          options: [
            "Root is always the LCA",
            "We found p in left subtree and q in right subtree",
            "It's the deepest common ancestor",
            "To avoid infinite recursion"
          ],
          correctAnswer: 1,
          explanation: "If left and right are both non-null, it means p and q are in different subtrees, making current root their LCA."
        }
      ]
    },
    {
      id: 7,
      topic: "LCA & Distance",
      functionName: "distanceK",
      difficulty: "Medium",
      question: "What's the key insight for finding nodes at distance K?",
      code: `def distanceK(root, target, K):
    def dfs(node, parent=None):
        if not node:
            return
        node.parent = parent
        dfs(node.left, node)
        dfs(node.right, node)
    
    dfs(root)
    
    result = []
    visited = set()
    
    def find_nodes(node, distance):
        if not node or node in visited:
            return
        visited.add(node)
        
        if distance == K:
            result.append(node.val)
            return
        
        # MISSING LOGIC - explore all directions
        find_nodes(node.left, distance + 1)
        find_nodes(node.right, distance + 1)
        find_nodes(node.parent, distance + 1)
    
    find_nodes(target, 0)
    return result`,
      options: [
        "Only search in subtrees of target",
        "Add parent pointers and search in all directions (left, right, parent)",
        "Use level-order traversal from target",
        "Calculate distance from root to all nodes"
      ],
      correctAnswer: 1,
      hint: "Think of the tree as an undirected graph from the target node's perspective.",
      explanation: "By adding parent pointers, we can treat the tree as an undirected graph and perform BFS/DFS in all three directions from the target node.",
      followUpQuestions: [
        {
          question: "Why do we need the visited set?",
          options: [
            "To optimize memory usage",
            "To prevent infinite loops when moving between parent and child",
            "To track the path to target",
            "To count the number of nodes visited"
          ],
          correctAnswer: 1,
          explanation: "Without visited tracking, we could go back and forth between a node and its parent infinitely."
        }
      ]
    },
    {
      id: 8,
      topic: "LCA & Distance",
      functionName: "findDistance",
      difficulty: "Medium",
      question: "How do you calculate distance between two nodes using LCA?",
      code: `def findDistance(root, p, q):
    def findLCA(node, p, q):
        if not node or node == p or node == q:
            return node
        left = findLCA(node.left, p, q)
        right = findLCA(node.right, p, q)
        if left and right:
            return node
        return left or right
    
    def getDistance(node, target, distance=0):
        if not node:
            return -1
        if node == target:
            return distance
        
        left_dist = getDistance(node.left, target, distance + 1)
        if left_dist != -1:
            return left_dist
        
        return getDistance(node.right, target, distance + 1)
    
    lca = findLCA(root, p, q)
    # MISSING LOGIC - calculate total distance
    return getDistance(lca, p) + getDistance(lca, q)`,
      options: [
        "Distance = depth(p) + depth(q)",
        "Distance = |depth(p) - depth(q)|",
        "Distance = distance(LCA, p) + distance(LCA, q)",
        "Distance = height of LCA"
      ],
      correctAnswer: 2,
      hint: "The path between two nodes always goes through their LCA.",
      explanation: "The shortest path between two nodes goes up from one node to their LCA, then down to the other node. Total distance is sum of both segments.",
      followUpQuestions: [
        {
          question: "What's the time complexity of this approach?",
          options: ["O(log n)", "O(n)", "O(n log n)", "O(h²)"],
          correctAnswer: 1,
          explanation: "Finding LCA takes O(n) and finding distances takes O(n), so total is O(n)."
        }
      ]
    },
    {
      id: 9,
      topic: "LCA & Distance",
      functionName: "lcaBST",
      difficulty: "Easy",
      question: "How is LCA different in a Binary Search Tree?",
      code: `def lowestCommonAncestor(root, p, q):
    while root:
        # MISSING LOGIC - use BST property
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None`,
      options: [
        "Use the same approach as binary tree",
        "Use BST property: if both nodes are smaller, go left; if both larger, go right",
        "Always start from the smallest value",
        "Find the median of p and q values"
      ],
      correctAnswer: 1,
      hint: "In BST, you can determine the direction to search based on node values.",
      explanation: "In BST, if both p and q are smaller than current node, LCA must be in left subtree. If both are larger, LCA is in right subtree. Otherwise, current node is LCA.",
      followUpQuestions: [
        {
          question: "What's the time complexity of BST LCA?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: 1,
          explanation: "In a balanced BST, we eliminate half the search space at each step, giving O(log n) complexity."
        }
      ]
    },

    // BST Operations Questions (5 questions)
    {
      id: 10,
      topic: "BST Operations",
      functionName: "isValidBST",
      difficulty: "Medium",
      question: "What's the correct way to validate a BST?",
      code: `def isValidBST(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        # MISSING VALIDATION LOGIC
        if node.val <= min_val or node.val >= max_val:
            return False
        
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))`,
      options: [
        "Check if left child < node < right child",
        "Use inorder traversal and check if sorted",
        "Validate with min/max bounds for each subtree",
        "Compare node values with their grandparents"
      ],
      correctAnswer: 2,
      hint: "Each node must satisfy constraints from all its ancestors, not just its parent.",
      explanation: "Each node must be within bounds set by all ancestors. Left subtree nodes must be less than current node, right subtree nodes must be greater.",
      followUpQuestions: [
        {
          question: "Why is checking only parent-child relationship insufficient?",
          options: [
            "It doesn't handle duplicate values",
            "A node might violate ancestor constraints while satisfying parent constraint",
            "It's too slow",
            "It doesn't work for unbalanced trees"
          ],
          correctAnswer: 1,
          explanation: "A node might be greater than its parent but less than its grandparent, violating BST property for the entire subtree."
        }
      ]
    },
    {
      id: 11,
      topic: "BST Operations",
      functionName: "kthSmallest",
      difficulty: "Medium",
      question: "What's the most efficient way to find kth smallest element in BST?",
      code: `def kthSmallest(root, k):
    count = 0
    result = None
    
    def inorder(node):
        nonlocal count, result
        if not node or result is not None:
            return
        
        inorder(node.left)
        
        # MISSING LOGIC - process current node
        count += 1
        if count == k:
            result = node.val
            return
        
        inorder(node.right)
    
    inorder(root)
    return result`,
      options: [
        "Convert to sorted array then return k-1 index",
        "Use inorder traversal and count until kth element",
        "Use level-order traversal",
        "Find minimum k times"
      ],
      correctAnswer: 1,
      hint: "Inorder traversal of BST gives elements in sorted order.",
      explanation: "Inorder traversal visits nodes in ascending order in BST. We can stop as soon as we reach the kth element, making it efficient.",
      followUpQuestions: [
        {
          question: "What's the time complexity in the worst case?",
          options: ["O(k)", "O(log n + k)", "O(n)", "O(k log n)"],
          correctAnswer: 2,
          explanation: "In worst case (skewed tree), we might visit all n nodes before finding the kth element."
        }
      ]
    },
    {
      id: 12,
      topic: "BST Operations",
      functionName: "convertBST",
      difficulty: "Medium",
      question: "How do you convert BST to Greater Sum Tree?",
      code: `def convertBST(root):
# converts each node's value to the sum of all values greater than 
# or equal to the original value, only largest value unchanged

    running_sum = 0
    
    def reverse_inorder(node):
        nonlocal running_sum
        if not node:
            return
        
        # MISSING LOGIC - traverse in reverse order
        reverse_inorder(node.right)
        
        running_sum += node.val
        node.val = running_sum
        
        reverse_inorder(node.left)
    
    reverse_inorder(root)
    return root`,
      options: [
        "Use normal inorder traversal",
        "Use reverse inorder (right, root, left) to process larger values first",
        "Use preorder traversal",
        "Use level-order traversal"
      ],
      correctAnswer: 1,
      hint: "To get sum of all greater elements, process nodes from largest to smallest.",
      explanation: "Reverse inorder traversal visits nodes in descending order, allowing us to maintain a running sum of all greater elements seen so far.",
      followUpQuestions: [
        {
          question: "Why does reverse inorder work for this problem?",
          options: [
            "It visits nodes in descending order",
            "It's more efficient than other traversals",
            "It maintains BST property",
            "It uses less memory"
          ],
          correctAnswer: 0,
          explanation: "By visiting larger values first, we can maintain a running sum of all values greater than the current node."
        }
      ]
    },
    {
      id: 13,
      topic: "BST Operations",
      functionName: "insertIntoBST",
      difficulty: "Medium",
      question: "What's the recursive approach to insert into BST?",
      code: `def insertIntoBST(root, val):
    if not root:
        return TreeNode(val)
    
    # MISSING LOGIC - where to insert?
    if val < root.val:
        root.left = insertIntoBST(root.left, val)
    else:
        root.right = insertIntoBST(root.right, val)
    
    return root`,
      options: [
        "Always insert as left child",
        "Insert based on BST property: left if smaller, right if larger",
        "Insert at the root and restructure",
        "Find the median position to insert"
      ],
      correctAnswer: 1,
      hint: "Follow BST property to find the correct position.",
      explanation: "In BST, smaller values go to left subtree and larger values go to right subtree. We recursively follow this property to find insertion point.",
      followUpQuestions: [
        {
          question: "What happens if the value already exists?",
          options: [
            "Insert as duplicate",
            "Replace the existing value",
            "Insert in right subtree (as per this implementation)",
            "Throw an error"
          ],
          correctAnswer: 2,
          explanation: "This implementation treats equal values as 'greater than', so they go to the right subtree."
        }
      ]
    },
    {
      id: 14,
      topic: "BST Operations",
      functionName: "deleteNode",
      difficulty: "Medium",
      question: "What's the trickiest case in BST deletion?",
      code: `def deleteNode(root, key):
    if not root:
        return root
    
    if key < root.val:
        root.left = deleteNode(root.left, key)
    elif key > root.val:
        root.right = deleteNode(root.right, key)
    else:
        # Found the node to delete
        if not root.left:
            return root.right
        elif not root.right:
            return root.left
        
        # MISSING LOGIC - node has two children
        # Find inorder successor (smallest in right subtree)
        min_node = root.right
        while min_node.left:
            min_node = min_node.left
        
        root.val = min_node.val
        root.right = deleteNode(root.right, min_node.val)
    
    return root`,
      options: [
        "Deleting a leaf node",
        "Deleting a node with one child",
        "Deleting a node with two children",
        "Deleting the root node"
      ],
      correctAnswer: 2,
      hint: "When a node has two children, you need to maintain BST property after deletion.",
      explanation: "With two children, we replace the node's value with its inorder successor (or predecessor), then delete that successor node.",
      followUpQuestions: [
        {
          question: "Why use inorder successor instead of predecessor?",
          options: [
            "It's always smaller",
            "It's easier to find",
            "Both work; it's a design choice",
            "It maintains balance better"
          ],
          correctAnswer: 2,
          explanation: "Both inorder successor and predecessor maintain BST property. The choice is arbitrary, though successor is commonly used."
        }
      ]
    },

    // Tree Traversals Questions (4 questions)
    {
      id: 15,
      topic: "Tree Traversals",
      functionName: "inorderTraversal",
      difficulty: "Easy",
      question: "What's the iterative approach for inorder traversal?",
      code: `def inorderTraversal(root):
    result = []
    stack = []
    current = root
    
    while stack or current:
        # MISSING LOGIC - go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        result.append(current.val)
        current = current.right
    
    return result`,
      options: [
        "Push all nodes to stack first",
        "Go to leftmost node, then process and move to right",
        "Use two stacks for left and right subtrees",
        "Process nodes level by level"
      ],
      correctAnswer: 1,
      hint: "Inorder means left, root, right. Use stack to remember nodes while going left.",
      explanation: "We go as far left as possible (pushing nodes to stack), then process the leftmost node, and move to its right subtree.",
      followUpQuestions: [
        {
          question: "Why do we need the stack in iterative traversal?",
          options: [
            "To store the result",
            "To remember parent nodes while exploring left subtree",
            "To optimize memory usage",
            "To handle duplicate values"
          ],
          correctAnswer: 1,
          explanation: "The stack replaces the function call stack from recursion, remembering nodes we need to return to after processing left subtrees."
        }
      ]
    },
    {
      id: 16,
      topic: "Tree Traversals",
      functionName: "preorderTraversal",
      difficulty: "Easy",
      question: "What's the key difference in preorder iterative traversal?",
      code: `def preorderTraversal(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        # MISSING LOGIC - when to process node?
        result.append(node.val)
        
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result`,
      options: [
        "Process node before pushing children",
        "Process node immediately when popped from stack",
        "Process node after visiting all children",
        "Process nodes in level order"
      ],
      correctAnswer: 1,
      hint: "Preorder means root, left, right. Process root first.",
      explanation: "In preorder, we process the node immediately when we visit it (pop from stack), then push right child first so left child is processed first.",
      followUpQuestions: [
        {
          question: "Why push right child before left child?",
          options: [
            "Right subtree is more important",
            "Stack is LIFO, so left child (pushed last) is processed first",
            "It's more efficient",
            "To maintain tree structure"
          ],
          correctAnswer: 1,
          explanation: "Since stack is Last-In-First-Out, pushing right first ensures left child is processed before right child."
        }
      ]
    },
    {
      id: 17,
      topic: "Tree Traversals",
      functionName: "postorderTraversal",
      difficulty: "Medium",
      question: "What makes postorder traversal more complex iteratively?",
      code: `def postorderTraversal(root):
    if not root:
        return []
    
    result = []
    stack = []
    last_visited = None
    current = root
    
    while stack or current:
        if current:
            stack.append(current)
            current = current.left
        else:
            peek_node = stack[-1]
            # MISSING LOGIC - when to process node?
            if peek_node.right and last_visited != peek_node.right:
                current = peek_node.right
            else:
                result.append(peek_node.val)
                last_visited = stack.pop()
    
    return result`,
      options: [
        "Need to track last visited node to avoid revisiting right subtree",
        "Need two stacks",
        "Need to reverse the result",
        "Need to use recursion"
      ],
      correctAnswer: 0,
      hint: "Postorder processes node after both children. How do you know when both children are processed?",
      explanation: "We need to track the last visited node to determine if we're returning from the right subtree, indicating both children have been processed.",
      followUpQuestions: [
        {
          question: "What does 'last_visited != peek_node.right' check?",
          options: [
            "If right child exists",
            "If we haven't processed the right subtree yet",
            "If right child is smaller",
            "If we're in the wrong subtree"
          ],
          correctAnswer: 1,
          explanation: "This checks if we haven't visited the right subtree yet. If not, we need to process it before processing the current node."
        }
      ]
    },
    {
      id: 18,
      topic: "Tree Traversals",
      functionName: "levelOrder",
      difficulty: "Medium",
      question: "How do you implement level-order traversal?",
      code: `def levelOrder(root):
    if not root:
        return []
    
    result = []
    queue = [root]
    
    while queue:
        level_size = len(queue)
        level_nodes = []
        
        # MISSING LOGIC - process one level at a time
        for _ in range(level_size):
            node = queue.pop(0)
            level_nodes.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_nodes)
    
    return result`,
      options: [
        "Use DFS with depth tracking",
        "Use BFS with queue, process one level at a time",
        "Use two queues alternately",
        "Use stack instead of queue"
      ],
      correctAnswer: 1,
      hint: "Level-order is breadth-first. Use queue and process all nodes at current level before moving to next.",
      explanation: "We use BFS with a queue. The key insight is to process exactly 'level_size' nodes in each iteration to handle one complete level.",
      followUpQuestions: [
        {
          question: "Why do we need to track level_size?",
          options: [
            "To optimize memory usage",
            "To separate nodes by levels in the result",
            "To avoid infinite loops",
            "To handle unbalanced trees"
          ],
          correctAnswer: 1,
          explanation: "By processing exactly level_size nodes, we ensure each iteration handles one complete level, allowing us to group nodes by level."
        }
      ]
    },

    // Tree Construction Questions (4 questions)
    {
      id: 19,
      topic: "Tree Construction",
      functionName: "buildTree",
      difficulty: "Medium",
      question: "How do you construct tree from preorder and inorder traversals?",
      code: `def buildTree(preorder, inorder):
    if not preorder or not inorder:
        return None
    
    # MISSING LOGIC - identify root and split arrays
    root_val = preorder[0]
    root = TreeNode(root_val)
    
    root_index = inorder.index(root_val)
    
    root.left = buildTree(preorder[1:root_index+1], inorder[:root_index])
    root.right = buildTree(preorder[root_index+1:], inorder[root_index+1:])
    
    return root`,
      options: [
        "First element of preorder is root, split inorder at root position",
        "First element of inorder is root",
        "Use the middle element as root",
        "Merge both arrays and find median"
      ],
      correctAnswer: 0,
      hint: "Preorder visits root first. Use root position in inorder to split left and right subtrees.",
      explanation: "Preorder's first element is always the root. Find this root in inorder array to determine left and right subtree elements, then recursively build subtrees.",
      followUpQuestions: [
        {
          question: "Why is the inorder split crucial?",
          options: [
            "It's more efficient",
            "It separates left subtree elements from right subtree elements",
            "It maintains sorted order",
            "It reduces recursion depth"
          ],
          correctAnswer: 1,
          explanation: "In inorder traversal, all elements to the left of root belong to left subtree, and all elements to the right belong to right subtree."
        }
      ]
    },
    {
      id: 20,
      topic: "Tree Construction",
      functionName: "serialize",
      difficulty: "Hard",
      question: "What's the key insight for tree serialization?",
      code: `def serialize(root):
    def preorder(node):
        if not node:
            vals.append("null")
            return
        
        # MISSING LOGIC - serialize current node and subtrees
        vals.append(str(node.val))
        preorder(node.left)
        preorder(node.right)
    
    vals = []
    preorder(root)
    return ','.join(vals)

def deserialize(data):
    def build():
        val = next(vals)
        if val == "null":
            return None
        
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node
    
    vals = iter(data.split(','))
    return build()`,
      options: [
        "Use level-order traversal",
        "Use preorder with null markers for complete structure",
        "Only store non-null values",
        "Use inorder traversal"
      ],
      correctAnswer: 1,
      hint: "You need to preserve the complete tree structure, including null nodes.",
      explanation: "Preorder with null markers preserves complete tree structure. During deserialization, we can reconstruct the tree by following the same preorder pattern.",
      followUpQuestions: [
        {
          question: "Why is preorder preferred over inorder for serialization?",
          options: [
            "It's faster",
            "Root-first order allows immediate node creation during deserialization",
            "It uses less space",
            "It handles duplicates better"
          ],
          correctAnswer: 1,
          explanation: "Preorder processes root first, allowing us to create nodes immediately during deserialization before processing children."
        }
      ]
    },
    {
      id: 21,
      topic: "Tree Construction",
      functionName: "bstFromPreorder",
      difficulty: "Medium",
      question: "How is BST construction from preorder different?",
      code: `def bstFromPreorder(preorder):
    def build(min_val, max_val):
        nonlocal idx
        if idx >= len(preorder):
            return None
        
        val = preorder[idx]
        # MISSING LOGIC - validate BST property
        if val < min_val or val > max_val:
            return None
        
        idx += 1
        node = TreeNode(val)
        node.left = build(min_val, val)
        node.right = build(val, max_val)
        return node
    
    idx = 0
    return build(float('-inf'), float('inf'))`,
      options: [
        "Same as regular tree construction",
        "Use BST property to validate node placement with min/max bounds",
        "Sort the preorder array first",
        "Convert to inorder then build"
      ],
      correctAnswer: 1,
      hint: "BST has ordering constraints. Use bounds to validate if current value can be placed.",
      explanation: "For BST, we can use the ordering property with min/max bounds to determine if the current preorder value can be placed at the current position.",
      followUpQuestions: [
        {
          question: "Why don't we need inorder for BST construction?",
          options: [
            "BST property provides the ordering constraint",
            "Preorder is sufficient for any tree",
            "Inorder is not useful for BST",
            "It's a special case"
          ],
          correctAnswer: 0,
          explanation: "The BST property (left < root < right) provides the ordering constraint that inorder traversal would normally provide."
        }
      ]
    },
    {
      id: 22,
      topic: "Tree Construction",
      functionName: "str2tree",
      difficulty: "Medium",
      question: "How do you construct tree from string representation?",
      code: `def str2tree(s):
    def build():
        nonlocal idx
        if idx >= len(s):
            return None
        
        # Parse number (handle negative numbers)
        start = idx
        if s[idx] == '-':
            idx += 1
        while idx < len(s) and s[idx].isdigit():
            idx += 1
        
        node = TreeNode(int(s[start:idx]))
        
        # MISSING LOGIC - parse children
        if idx < len(s) and s[idx] == '(':
            idx += 1  # skip '('
            node.left = build()
            idx += 1  # skip ')'
        
        if idx < len(s) and s[idx] == '(':
            idx += 1  # skip '('
            node.right = build()
            idx += 1  # skip ')'
        
        return node
    
    if not s:
        return None
    
    idx = 0
    return build()`,
      options: [
        "Parse number, then recursively parse left and right children in parentheses",
        "Split by parentheses and process each part",
        "Use regular expressions",
        "Convert to array first"
      ],
      correctAnswer: 0,
      hint: "String format is 'value(left_subtree)(right_subtree)'. Parse recursively.",
      explanation: "We parse the node value first, then recursively parse left and right subtrees enclosed in parentheses. The key is handling the parentheses correctly.",
      followUpQuestions: [
        {
          question: "Why do we need to handle negative numbers specially?",
          options: [
            "They're stored differently",
            "The '-' sign could be confused with operators",
            "We need to parse the complete number including the sign",
            "Negative numbers are not allowed"
          ],
          correctAnswer: 2,
          explanation: "We need to include the '-' sign as part of the number when parsing, not treat it as a separate character."
        }
      ]
    },

    // Advanced Trees Questions (8 questions)
    {
      id: 23,
      topic: "Advanced Trees",
      functionName: "verticalTraversal",
      difficulty: "Hard",
      question: "What's the key challenge in vertical order traversal? Question - Return nodes grouped by vertical columns, sorted by row",
      code: `def verticalTraversal(root):
    from collections import defaultdict
    
    def dfs(node, x, y):
        if not node:
            return
        
        # MISSING LOGIC - handle nodes at same position
        nodes[x].append((y, node.val))
        
        dfs(node.left, x - 1, y + 1)
        dfs(node.right, x + 1, y + 1)
    
    nodes = defaultdict(list)
    dfs(root, 0, 0)
    
    result = []
    for x in sorted(nodes.keys()):
        # Sort by y coordinate, then by value for same position
        nodes[x].sort(key=lambda item: (item[0], item[1]))
        result.append([val for y, val in nodes[x]])
    
    return result`,
      options: [
        "Sorting by x-coordinate only",
        "Handling nodes at same (x,y) position by sorting by value",
        "Using level-order traversal",
        "Avoiding negative coordinates"
      ],
      correctAnswer: 1,
      hint: "Multiple nodes can have the same (x,y) coordinate. How do you order them?",
      explanation: "When multiple nodes have the same (x,y) coordinate, we need to sort them by their values to ensure consistent ordering.",
      followUpQuestions: [
        {
          question: "Why use (y, value) as sort key instead of just y?",
          options: [
            "To handle ties when nodes have same y-coordinate",
            "To optimize sorting performance",
            "To maintain tree structure",
            "To handle negative values"
          ],
          correctAnswer: 0,
          explanation: "When nodes have the same y-coordinate (same level in vertical line), we sort by value to break ties consistently."
        }
      ]
    },
    {
      id: 24,
      topic: "Advanced Trees",
      functionName: "flatten",
      difficulty: "Medium",
      question: "How do you flatten binary tree to linked list in-place?",
      code: `def flatten(root):
    def dfs(node):
        if not node:
            return None
        left_tail = dfs(node.left)
        right_tail = dfs(node.right)
        if left_tail:
            left_tail.right = node.right
            node.right = node.left
            node.left = None
        return right_tail or left_tail or node
    dfs(root)`,
      options: [
        "Use extra space to store preorder traversal",
        "Recursively flatten subtrees and connect them in preorder",
        "Use iterative approach with stack",
        "Reverse the tree structure"
      ],
      correctAnswer: 1,
      hint: "Think about connecting the tail of left subtree to the head of right subtree.",
      explanation: "We recursively flatten left and right subtrees, then connect the tail of flattened left subtree to the head of right subtree, maintaining preorder.",
      followUpQuestions: [
        {
          question: "What does the function return?",
          options: [
            "The root of flattened tree",
            "The tail (rightmost node) of flattened subtree",
            "The number of nodes",
            "Boolean success status"
          ],
          correctAnswer: 1,
          explanation: "Returning the tail allows parent nodes to connect their left subtree's tail to their right subtree's head."
        }
      ]
    },
    {
      id: 25,
      topic: "Advanced Trees",
      functionName: "recoverTree",
      difficulty: "Hard",
      question: "How do you recover BST where two nodes are swapped?",
      code: `def recoverTree(root):
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        
        inorder(node.left)
        
        # MISSING LOGIC - detect violations
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        prev = node
        
        inorder(node.right)
    
    inorder(root)
    first.val, second.val = second.val, first.val`,
      options: [
        "Find all violations and fix them",
        "Identify first and second violation points in inorder traversal",
        "Rebuild the entire tree",
        "Use level-order traversal to find swapped nodes"
      ],
      correctAnswer: 1,
      hint: "In inorder traversal of BST, there will be 1 or 2 violations where prev > current.",
      explanation: "Inorder traversal of BST should be sorted. Two swapped nodes create 1-2 violations. First violation gives us the first swapped node, last violation gives us the second.",
      followUpQuestions: [
        {
          question: "Why might there be only one violation?",
          options: [
            "When swapped nodes are adjacent in inorder traversal",
            "When one node is the root",
            "When nodes are at same level",
            "When tree is balanced"
          ],
          correctAnswer: 0,
          explanation: "If adjacent nodes in inorder sequence are swapped, there's only one violation point where prev > current."
        }
      ]
    },
    {
      id: 26,
      topic: "Advanced Trees",
      functionName: "generateTrees",
      difficulty: "Medium",
      question: "How do you generate all unique BSTs with n nodes?",
      code: `def generateTrees(n):
    def generate(start, end):
        if start > end:
            return [None]
        
        trees = []
        # MISSING LOGIC - try each number as root
        for root_val in range(start, end + 1):
            left_trees = generate(start, root_val - 1)
            right_trees = generate(root_val + 1, end)
            
            for left in left_trees:
                for right in right_trees:
                    root = TreeNode(root_val)
                    root.left = left
                    root.right = right
                    trees.append(root)
        
        return trees
    
    if n == 0:
        return []
    return generate(1, n)`,
      options: [
        "Use dynamic programming with memoization",
        "Try each number as root and combine all possible left/right subtrees",
        "Generate trees level by level",
        "Use backtracking with pruning"
      ],
      correctAnswer: 1,
      hint: "For each possible root, combine all possible left subtrees with all possible right subtrees.",
      explanation: "We try each number as root, recursively generate all possible left and right subtrees, then combine them to create all possible trees.",
      followUpQuestions: [
        {
          question: "What's the time complexity of this approach?",
          options: ["O(n!)", "O(2^n)", "O(C_n) where C_n is nth Catalan number", "O(n^3)"],
          correctAnswer: 2,
          explanation: "The number of unique BSTs with n nodes is the nth Catalan number, and we generate all of them."
        }
      ]
    },
    {
      id: 27,
      topic: "Advanced Trees",
      functionName: "isSymmetric",
      difficulty: "Easy",
      question: "How do you check if a binary tree is symmetric?",
      code: `def isSymmetric(root):
    def isMirror(left, right):
        if not left and not right:
            return True
        if not left or not right:
            return False
        
        # MISSING LOGIC - check symmetry condition
        return (left.val == right.val and 
                isMirror(left.left, right.right) and 
                isMirror(left.right, right.left))
    
    return not root or isMirror(root.left, root.right)`,
      options: [
        "Compare inorder traversals of left and right subtrees",
        "Check if left subtree is mirror of right subtree",
        "Use level-order traversal and check palindrome",
        "Compare tree heights"
      ],
      correctAnswer: 1,
      hint: "Symmetric means left subtree is mirror image of right subtree.",
      explanation: "A tree is symmetric if its left subtree is a mirror image of its right subtree. We recursively check if left.left mirrors right.right and left.right mirrors right.left.",
      followUpQuestions: [
        {
          question: "What's the key insight for the recursive calls?",
          options: [
            "Compare corresponding nodes in mirror positions",
            "Compare all nodes at same level",
            "Compare parent-child relationships",
            "Compare tree depths"
          ],
          correctAnswer: 0,
          explanation: "In mirror trees, left.left corresponds to right.right, and left.right corresponds to right.left."
        }
      ]
    },
    {
      id: 28,
      topic: "Advanced Trees",
      functionName: "hasPathSum",
      difficulty: "Easy",
      question: "How do you check if tree has root-to-leaf path with given sum?",
      code: `def hasPathSum(root, targetSum):
    if not root:
        return False
    
    # MISSING LOGIC - check leaf node and path sum
    if not root.left and not root.right:
        return root.val == targetSum
    
    remaining = targetSum - root.val
    return (hasPathSum(root.left, remaining) or 
            hasPathSum(root.right, remaining))`,
      options: [
        "Sum all paths and compare with target",
        "Check if leaf node value equals remaining target sum",
        "Use BFS to explore all paths",
        "Calculate tree sum first"
      ],
      correctAnswer: 1,
      hint: "At leaf nodes, check if current node value equals the remaining target sum.",
      explanation: "We subtract current node value from target and recursively check subtrees. At leaf nodes, we check if the node value equals the remaining target.",
      followUpQuestions: [
        {
          question: "Why check 'not root.left and not root.right'?",
          options: [
            "To optimize performance",
            "To ensure we're at a leaf node (end of path)",
            "To handle empty trees",
            "To avoid null pointer errors"
          ],
          correctAnswer: 1,
          explanation: "We only count complete root-to-leaf paths, so we must verify we're at a leaf node before checking the sum."
        }
      ]
    },
    {
      id: 29,
      topic: "Advanced Trees",
      functionName: "pathSum",
      difficulty: "Medium",
      question: "How do you find all root-to-leaf paths with given sum?",
      code: `def pathSum(root, targetSum):
    result = []
    
    def dfs(node, remaining, path):
        if not node:
            return
        
        path.append(node.val)
        
        # MISSING LOGIC - check if valid path found
        if not node.left and not node.right and remaining == node.val:
            result.append(path[:])  # Make a copy
        
        dfs(node.left, remaining - node.val, path)
        dfs(node.right, remaining - node.val, path)
        
        path.pop()  # backtrack
    
    dfs(root, targetSum, [])
    return result`,
      options: [
        "Store all paths and filter by sum",
        "Use DFS with backtracking to build and validate paths",
        "Use BFS with path tracking",
        "Calculate all possible sums first"
      ],
      correctAnswer: 1,
      hint: "Build path incrementally and backtrack when returning from recursion.",
      explanation: "We use DFS with backtracking, building the path as we go down and removing nodes when we backtrack. We copy valid paths to the result.",
      followUpQuestions: [
        {
          question: "Why do we need 'path[:]' instead of just 'path'?",
          options: [
            "To save memory",
            "To create a copy since path will be modified by backtracking",
            "To improve performance",
            "To handle negative numbers"
          ],
          correctAnswer: 1,
          explanation: "We need a copy because the original path list will be modified as we backtrack and explore other branches."
        }
      ]
    },
    {
      id: 30,
      topic: "Advanced Trees",
      functionName: "connect",
      difficulty: "Medium",
      question: "How do you populate next right pointers in perfect binary tree?",
      code: `def connect(root):
    if not root:
        return root
    
    leftmost = root
    
    while leftmost.left:  # While not at leaf level
        head = leftmost
        
        while head:
            # MISSING LOGIC - connect children
            head.left.next = head.right
            
            if head.next:
                head.right.next = head.next.left
            
            head = head.next
        
        leftmost = leftmost.left
    
    return root`,
      options: [
        "Use level-order traversal with queue",
        "Use existing next pointers to connect next level",
        "Connect all nodes at same level first",
        "Use recursive approach"
      ],
      correctAnswer: 1,
      hint: "Use the next pointers from current level to connect the next level without extra space.",
      explanation: "We use the already established next pointers at current level to traverse and connect nodes at the next level, achieving O(1) space complexity.",
      followUpQuestions: [
        {
          question: "Why is this more efficient than using a queue?",
          options: [
            "It's faster",
            "It uses O(1) extra space instead of O(n)",
            "It's easier to implement",
            "It handles edge cases better"
          ],
          correctAnswer: 1,
          explanation: "By using existing next pointers, we avoid the O(n) space that a queue would require for level-order traversal."
        }
      ]
    },

    // Additional Tree DP Questions for Pattern Mastery
    {
      id: 31,
      topic: "Tree DP",
      functionName: "longestUnivaluePath",
      difficulty: "Medium",
      question: "What's the key insight for finding the longest univalue path in a binary tree?",
      code: `def longestUnivaluePath(root):
    max_path = 0
    
    def dfs(node):
        nonlocal max_path
        if not node:
            return 0
        
        left_length = dfs(node.left)
        right_length = dfs(node.right)
        
        # MISSING LOGIC - when to extend path?
        left_path = left_length + 1 if node.left and node.left.val == node.val else 0
        right_path = right_length + 1 if node.right and node.right.val == node.val else 0
        
        max_path = max(max_path, left_path + right_path)
        
        return max(left_path, right_path)
    
    dfs(root)
    return max_path`,
      options: [
        "Extend path only if child value equals current value",
        "Always extend path through both children",
        "Only extend path through the longer child",
        "Extend path based on node position"
      ],
      correctAnswer: 0,
      hint: "A univalue path means all nodes have the same value.",
      explanation: "We extend the path only when the child's value equals the current node's value, maintaining the univalue property.",
      followUpQuestions: []
    },
    {
      id: 32,
      topic: "Tree DP",
      functionName: "sumNumbers",
      difficulty: "Medium", 
      question: "How do you calculate the sum of all root-to-leaf numbers?",
      code: `def sumNumbers(root):
    #    1
   #    / \\
  #    2   3  The paths are 1->2 and 1->3,  
  # representing numbers 12 and 13, and their sum is 25.
    def dfs(node, current_num):
        if not node:
            return 0
        
        current_num = current_num * 10 + node.val
        
        # MISSING LOGIC - when to return the number?
        if not node.left and not node.right:
            return current_num
        
        return dfs(node.left, current_num) + dfs(node.right, current_num)
    
    return dfs(root, 0)`,
      options: [
        "Return current_num when at leaf node, sum recursive calls otherwise",
        "Always return the sum of left and right subtrees",
        "Return current_num at every node",
        "Only return non-zero values"
      ],
      correctAnswer: 0,
      hint: "Think about when a root-to-leaf path is complete.",
      explanation: "At leaf nodes, we return the complete number formed. At internal nodes, we sum the results from both subtrees.",
      followUpQuestions: []
    },
    {
      id: 45,
      topic: "Tree DP",
      functionName: "distributeValuesEqually",
      difficulty: "Hard",
      question: "How do you minimize moves when distributing values equally across all nodes with different target values?",
      code: `def distributeValuesEqually(root):
    """
    Distribute values equally across all nodes, minimizing number of moves
    Each move can transfer any amount between adjacent nodes
    """
    if not root:
        return 0
    
    # Step 1: Calculate total value and total nodes
    def calculate_totals(node):
        if not node:
            return 0, 0
        
        left_val, left_nodes = calculate_totals(node.left)
        right_val, right_nodes = calculate_totals(node.right)
        
        total_val = node.val + left_val + right_val
        total_nodes = 1 + left_nodes + right_nodes
        
        return total_val, total_nodes
    
    total_value, total_nodes = calculate_totals(root)
    
    # Check if equal distribution is possible
    if total_value % total_nodes != 0:
        return -1  # Cannot distribute equally
    
    target_per_node = total_value // total_nodes
    moves = 0
    
    def dfs(node):
        nonlocal moves
        
        if not node:
            return 0
        
        # Get excess/deficit from subtrees
        left_excess = dfs(node.left)
        right_excess = dfs(node.right)
        
        # MISSING LOGIC - how to count moves optimally?
        if left_excess != 0:
            moves += 1
        if right_excess != 0:
            moves += 1
        
        # Calculate current subtree's excess/deficit
        current_excess = (node.val - target_per_node) + left_excess + right_excess
        
        return current_excess
    
    dfs(root)
    return moves`,
      options: [
        "Count one move for each non-zero flow between parent and child",
        "Count moves based on absolute value of excess like coin distribution",
        "Count moves only when values are transferred upward",
        "Count total number of nodes that need value changes"
      ],
      correctAnswer: 0,
      hint: "Think about the difference between counting flow amount vs counting flow operations.",
      explanation: "Unlike coin distribution where we count the amount of flow (abs(excess)), here we count the number of flow operations. Each non-zero excess represents one move operation between parent and child, regardless of the amount transferred.",
      followUpQuestions: []
    },

    // Additional LCA & Distance Questions
    {
      id: 33,
      topic: "LCA & Distance",
      functionName: "lcaDeepestLeaves",
      difficulty: "Medium",
      question: "How do you find the LCA of the deepest leaves in a binary tree?",
      code: `def lcaDeepestLeaves(root):
    def dfs(node):
        if not node:
            return 0, None
        
        left_depth, left_lca = dfs(node.left)
        right_depth, right_lca = dfs(node.right)
        
        # MISSING LOGIC - when is current node the LCA?
        if left_depth > right_depth:
            return left_depth + 1, left_lca
        elif right_depth > left_depth:
            return right_depth + 1, right_lca
        else:
            return left_depth + 1, node
    
    _, lca = dfs(root)
    return lca`,
      options: [
        "When left and right subtrees have equal depth",
        "When current node is the deepest",
        "When left subtree is deeper",
        "When right subtree is deeper"
      ],
      correctAnswer: 0,
      hint: "The LCA is where the deepest paths from both sides meet.",
      explanation: "When both subtrees have equal depth, the current node is the LCA of all deepest leaves in both subtrees.",
      followUpQuestions: []
    },
    {
      id: 34,
      topic: "LCA & Distance",
      functionName: "distanceSum",
      difficulty: "Hard",
      question: "What's the efficient way to calculate sum of distances from all nodes to a target?",
      code: `def distanceSum(root, target):
    total_distance = 0
    
    def dfs(node, distance):
        nonlocal total_distance
        if not node:
            return
        
        total_distance += distance
        
        # MISSING OPTIMIZATION - how to avoid redundant calculations?
        dfs(node.left, distance + 1)
        dfs(node.right, distance + 1)
    
    # Find target and start DFS from there
    def find_and_calculate(node, target_val, distance_from_root):
        if not node:
            return False
        
        if node.val == target_val:
            dfs(node, 0)
            return True
        
        return (find_and_calculate(node.left, target_val, distance_from_root + 1) or
                find_and_calculate(node.right, target_val, distance_from_root + 1))
    
    find_and_calculate(root, target, 0)
    return total_distance`,
      options: [
        "Use BFS from target node to calculate all distances",
        "Pre-calculate distances using parent pointers",
        "Use DFS from target with distance parameter",
        "Build distance matrix for all pairs"
      ],
      correctAnswer: 2,
      hint: "Think about traversing from the target node outward.",
      explanation: "DFS from the target node with a distance parameter efficiently calculates distances to all other nodes in O(n) time.",
      followUpQuestions: []
    },

    // Additional BST Operations Questions
    {
      id: 35,
      topic: "BST Operations",
      functionName: "trimBST",
      difficulty: "Medium",
      question: "How do you trim a BST to keep only nodes within a given range [low, high]?",
      code: `def trimBST(root, low, high):
    if not root:
        return None
    
    # MISSING LOGIC - how to handle nodes outside range?
    if root.val < low:
        return trimBST(root.right, low, high)
    elif root.val > high:
        return trimBST(root.left, low, high)
    else:
        root.left = trimBST(root.left, low, high)
        root.right = trimBST(root.right, low, high)
        return root`,
      options: [
        "If node < low, go right; if node > high, go left; else trim both subtrees",
        "Always trim both left and right subtrees",
        "Remove nodes one by one using BST deletion",
        "Rebuild BST with only valid nodes"
      ],
      correctAnswer: 0,
      hint: "Use BST property to eliminate entire subtrees efficiently.",
      explanation: "If current node is too small, entire left subtree is invalid, so go right. If too large, entire right subtree is invalid, so go left.",
      followUpQuestions: []
    },
    {
      id: 36,
      topic: "BST Operations",
      functionName: "rangeSumBST",
      difficulty: "Easy",
      question: "What's the efficient way to find sum of BST nodes within a range [low, high]?",
      code: `def rangeSumBST(root, low, high):
    if not root:
        return 0
    
    total = 0
    
    # MISSING OPTIMIZATION - how to avoid unnecessary traversals?
    if root.val >= low and root.val <= high:
        total += root.val
    
    if root.val > low:
        total += rangeSumBST(root.left, low, high)
    
    if root.val < high:
        total += rangeSumBST(root.right, low, high)
    
    return total`,
      options: [
        "Only traverse left if root.val > low, right if root.val < high",
        "Always traverse both left and right subtrees",
        "Use inorder traversal and sum valid nodes",
        "Convert to array and use binary search"
      ],
      correctAnswer: 0,
      hint: "Use BST property to prune unnecessary subtrees.",
      explanation: "If root.val <= low, no need to check left subtree. If root.val >= high, no need to check right subtree.",
      followUpQuestions: []
    },
    {
      id: 37,
      topic: "BST Operations",
      functionName: "balanceBST",
      difficulty: "Medium",
      question: "How do you balance a BST optimally?",
      code: `def balanceBST(root):
    # Step 1: Get sorted array from BST
    def inorder(node, arr):
        if node:
            inorder(node.left, arr)
            arr.append(node.val)
            inorder(node.right, arr)
    
    # Step 2: Build balanced BST from sorted array
    def build_balanced(arr, start, end):
        if start > end:
            return None
        
        # MISSING LOGIC - how to choose root for balance?
        mid = (start + end) // 2
        root = TreeNode(arr[mid])
        
        root.left = build_balanced(arr, start, mid - 1)
        root.right = build_balanced(arr, mid + 1, end)
        
        return root
    
    arr = []
    inorder(root, arr)
    return build_balanced(arr, 0, len(arr) - 1)`,
      options: [
        "Choose middle element as root to ensure balanced subtrees",
        "Choose first element as root",
        "Choose last element as root", 
        "Choose random element as root"
      ],
      correctAnswer: 0,
      hint: "Think about how to create equal-sized left and right subtrees.",
      explanation: "Choosing the middle element ensures both left and right subtrees have approximately equal size, creating a balanced tree.",
      followUpQuestions: []
    },

    // Additional Tree Traversals Questions
    {
      id: 38,
      topic: "Tree Traversals",
      functionName: "zigzagLevelOrder",
      difficulty: "Medium",
      question: "How do you implement zigzag level order traversal?",
      code: `def zigzagLevelOrder(root):
    if not root:
        return []
    
    result = []
    queue = [root]
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        level_values = []
        
        for _ in range(level_size):
            node = queue.pop(0)
            level_values.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        # MISSING LOGIC - how to handle zigzag pattern?
        if not left_to_right:
            level_values.reverse()
        
        result.append(level_values)
        left_to_right = not left_to_right
    
    return result`,
      options: [
        "Reverse level values for right-to-left levels",
        "Use two stacks alternately",
        "Traverse nodes in reverse order",
        "Build result in reverse"
      ],
      correctAnswer: 0,
      hint: "Alternate the direction of reading each level.",
      explanation: "For zigzag traversal, we reverse the order of nodes at every alternate level while maintaining normal BFS.",
      followUpQuestions: []
    },
    {
      id: 39,
      topic: "Tree Traversals",
      functionName: "boundaryTraversal",
      difficulty: "Medium",
      question: "What's the correct order for boundary traversal of a binary tree?",
      code: `def boundaryTraversal(root):
    if not root:
        return []
    
    result = [root.val]
    
    def left_boundary(node):
        if not node or (not node.left and not node.right):
            return
        result.append(node.val)
        if node.left:
            left_boundary(node.left)
        else:
            left_boundary(node.right)
    
    def leaves(node):
        if not node:
            return
        if not node.left and not node.right:
            result.append(node.val)
        leaves(node.left)
        leaves(node.right)
    
    def right_boundary(node):
        if not node or (not node.left and not node.right):
            return
        if node.right:
            right_boundary(node.right)
        else:
            right_boundary(node.left)
        result.append(node.val)
    
    # MISSING LOGIC - what's the correct order?
    left_boundary(root.left)
    leaves(root)
    right_boundary(root.right)
    
    return result`,
      options: [
        "Root → Left boundary → Leaves → Right boundary (reverse)",
        "Left boundary → Root → Right boundary → Leaves",
        "Leaves → Left boundary → Root → Right boundary",
        "Root → Right boundary → Leaves → Left boundary"
      ],
      correctAnswer: 0,
      hint: "Think about traversing the perimeter of the tree clockwise.",
      explanation: "Boundary traversal goes clockwise: root, then left boundary (top-down), then leaves (left-right), then right boundary (bottom-up).",
      followUpQuestions: []
    },

    // Additional Tree Construction Questions  
    {
      id: 40,
      topic: "Tree Construction",
      functionName: "buildTreePostIn",
      difficulty: "Medium",
      question: "How is building tree from postorder and inorder different from preorder and inorder?",
      code: `def buildTree(postorder, inorder):
    if not postorder or not inorder:
        return None
    
    # MISSING LOGIC - where is root in postorder?
    root_val = postorder[-1]
    root = TreeNode(root_val)
    
    root_index = inorder.index(root_val)
    
    root.left = buildTree(postorder[:root_index], inorder[:root_index])
    root.right = buildTree(postorder[root_index:-1], inorder[root_index+1:])
    
    return root`,
      options: [
        "Root is last element in postorder (instead of first in preorder)",
        "Root is first element in postorder",
        "Root is middle element in postorder",
        "Root position is same as preorder"
      ],
      correctAnswer: 0,
      hint: "Think about when the root is processed in postorder traversal.",
      explanation: "In postorder (left→right→root), root is processed last, so it's the last element in the postorder array.",
      followUpQuestions: []
    },
    {
      id: 41,
      topic: "Tree Construction",
      functionName: "createBSTFromSorted",
      difficulty: "Easy",
      question: "How do you create a height-balanced BST from a sorted array?",
      code: `def sortedArrayToBST(nums):
    def build(left, right):
        if left > right:
            return None
        
        # MISSING LOGIC - how to ensure height balance?
        mid = (left + right) // 2
        root = TreeNode(nums[mid])
        
        root.left = build(left, mid - 1)
        root.right = build(mid + 1, right)
        
        return root
    
    return build(0, len(nums) - 1)`,
      options: [
        "Choose middle element as root to balance left and right subtrees",
        "Choose first element as root",
        "Choose last element as root",
        "Choose any element as root"
      ],
      correctAnswer: 0,
      hint: "Height balance means left and right subtrees have similar heights.",
      explanation: "Choosing the middle element ensures both subtrees have equal (or differ by 1) number of nodes, creating height balance.",
      followUpQuestions: []
    },

    // Additional Advanced Trees Questions
    {
      id: 42,
      topic: "Advanced Trees",
      functionName: "findDuplicateSubtrees",
      difficulty: "Medium", 
      question: "How do you find all duplicate subtrees in a binary tree?",
      code: `def findDuplicateSubtrees(root):
    subtrees = {}
    duplicates = []
    
    def serialize(node):
        if not node:
            return "null"
        
        # MISSING LOGIC - how to create unique subtree signature?
        subtree_id = f"{node.val},{serialize(node.left)},{serialize(node.right)}"
        
        subtrees[subtree_id] = subtrees.get(subtree_id, 0) + 1
        
        if subtrees[subtree_id] == 2:
            duplicates.append(node)
        
        return subtree_id
    
    serialize(root)
    return duplicates`,
      options: [
        "Serialize subtree as 'value,left_subtree,right_subtree'",
        "Use only node values to identify subtrees",
        "Compare subtrees by height and size",
        "Use hash of node addresses"
      ],
      correctAnswer: 0,
      hint: "Think about how to uniquely represent the structure and values of a subtree.",
      explanation: "Serializing as 'value,left,right' captures both structure and values, creating unique signatures for identical subtrees.",
      followUpQuestions: []
    },
    {
      id: 43,
      topic: "Advanced Trees",
      functionName: "maxWidthOfBinaryTree",
      difficulty: "Medium",
      question: "How do you calculate the maximum width of a binary tree?",
      code: `def widthOfBinaryTree(root):
    if not root:
        return 0
    
    max_width = 0
    queue = [(root, 0)]  # (node, position)
    
    while queue:
        level_size = len(queue)
        _, first_pos = queue[0]
        _, last_pos = queue[-1]
        
        # MISSING LOGIC - how to calculate width?
        max_width = max(max_width, last_pos - first_pos + 1)
        
        for _ in range(level_size):
            node, pos = queue.pop(0)
            
            if node.left:
                queue.append((node.left, 2 * pos))
            if node.right:
                queue.append((node.right, 2 * pos + 1))
    
    return max_width`,
      options: [
        "Width = last_position - first_position + 1 at each level",
        "Width = number of nodes at each level",
        "Width = maximum depth of the tree",
        "Width = number of non-null nodes at each level"
      ],
      correctAnswer: 0,
      hint: "Think about the positions of leftmost and rightmost nodes at each level.",
      explanation: "Width is the distance between the leftmost and rightmost nodes at each level, calculated using their positions in a complete binary tree.",
      followUpQuestions: []
    },
    {
      id: 44,
      topic: "Advanced Trees",
      functionName: "lowestCommonAncestorBT",
      difficulty: "Medium",
      question: "How do you find LCA when nodes might not exist in the tree?",
      code: `def lowestCommonAncestor(root, p, q):
    def find_lca(node):
        if not node:
            return None
        
        if node == p or node == q:
            return node
        
        left = find_lca(node.left)
        right = find_lca(node.right)
        
        # MISSING VALIDATION - what if nodes don't exist?
        if left and right:
            return node
        
        return left or right
    
    # Need to verify both nodes exist first
    def exists(node, target):
        if not node:
            return False
        return node == target or exists(node.left, target) or exists(node.right, target)
    
    if not exists(root, p) or not exists(root, q):
        return None
    
    return find_lca(root)`,
      options: [
        "Verify both nodes exist before finding LCA",
        "Assume nodes always exist in the tree",
        "Return None if LCA is not found",
        "Use exception handling for missing nodes"
      ],
      correctAnswer: 0,
      hint: "What happens if one or both nodes don't exist in the tree?",
      explanation: "We must verify both nodes exist in the tree before finding LCA, otherwise the result might be incorrect.",
      followUpQuestions: []
    }
  ];

  // BST Recovery Visualization Component
  const BSTRecoveryVisualization = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    interface BSTRecoveryStep {
      step: number;
      description: string;
      tree: {[key: string]: {val: number, left?: string, right?: string, x: number, y: number}};
      highlightNodes: string[];
      action: string;
      first?: string;
      second?: string;
      prev?: string;
      violations: string[];
    }

    const getAnimationSteps = (): BSTRecoveryStep[] => [
      {
        step: 1,
        description: "Initial BST with two swapped nodes (3 and 5)",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 300, y: 60},
          "2": {val: 2, left: "1", right: "5", x: 180, y: 140},
          "6": {val: 6, left: "3", right: "7", x: 420, y: 140},
          "1": {val: 1, x: 120, y: 220},
          "5": {val: 5, x: 240, y: 220}, // Should be 3
          "3": {val: 3, x: 360, y: 220}, // Should be 5
          "7": {val: 7, x: 480, y: 220}
        },
        highlightNodes: ["3", "5"],
        action: "Nodes 3 and 5 are swapped, violating BST property",
        violations: []
      },
      {
        step: 2,
        description: "Start inorder traversal: visit node 1 first",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 250, y: 60},
          "2": {val: 2, left: "1", right: "5", x: 150, y: 140},
          "6": {val: 6, left: "3", right: "7", x: 350, y: 140},
          "1": {val: 1, x: 100, y: 220},
          "5": {val: 5, x: 200, y: 220},
          "3": {val: 3, x: 300, y: 220},
          "7": {val: 7, x: 400, y: 220}
        },
        highlightNodes: ["1"],
        action: "Visit node 1, prev = null, no violation",
        prev: "1",
        violations: []
      },
      {
        step: 3,
        description: "Continue inorder: visit node 2",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 250, y: 60},
          "2": {val: 2, left: "1", right: "5", x: 150, y: 140},
          "6": {val: 6, left: "3", right: "7", x: 350, y: 140},
          "1": {val: 1, x: 100, y: 220},
          "5": {val: 5, x: 200, y: 220},
          "3": {val: 3, x: 300, y: 220},
          "7": {val: 7, x: 400, y: 220}
        },
        highlightNodes: ["2", "1"],
        action: "prev(1) < node(2) ✓ No violation detected",
        prev: "2",
        violations: []
      },
      {
        step: 4,
        description: "Visit node 5: detect first violation",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 250, y: 60},
          "2": {val: 2, left: "1", right: "5", x: 150, y: 140},
          "6": {val: 6, left: "3", right: "7", x: 350, y: 140},
          "1": {val: 1, x: 100, y: 220},
          "5": {val: 5, x: 200, y: 220},
          "3": {val: 3, x: 300, y: 220},
          "7": {val: 7, x: 400, y: 220}
        },
        highlightNodes: ["5", "2"],
        action: "prev(2) < node(5) ✓ But 5 should come after 4!",
        prev: "5",
        first: "5",
        violations: ["5 in wrong position"]
      },
      {
        step: 5,
        description: "Visit node 4: detect second violation",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 250, y: 60},
          "2": {val: 2, left: "1", right: "5", x: 150, y: 140},
          "6": {val: 6, left: "3", right: "7", x: 350, y: 140},
          "1": {val: 1, x: 100, y: 220},
          "5": {val: 5, x: 200, y: 220},
          "3": {val: 3, x: 300, y: 220},
          "7": {val: 7, x: 400, y: 220}
        },
        highlightNodes: ["4", "5"],
        action: "prev(5) > node(4) ✗ First violation! first = 5",
        prev: "4",
        first: "5",
        violations: ["5 > 4"]
      },
      {
        step: 6,
        description: "Visit node 3: detect second violation",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 250, y: 60},
          "2": {val: 2, left: "1", right: "5", x: 150, y: 140},
          "6": {val: 6, left: "3", right: "7", x: 350, y: 140},
          "1": {val: 1, x: 100, y: 220},
          "5": {val: 5, x: 200, y: 220},
          "3": {val: 3, x: 300, y: 220},
          "7": {val: 7, x: 400, y: 220}
        },
        highlightNodes: ["3", "4"],
        action: "prev(4) > node(3) ✗ Second violation! second = 3",
        prev: "3",
        first: "5",
        second: "3",
        violations: ["5 > 4", "4 > 3"]
      },
      {
        step: 7,
        description: "Complete traversal: visit nodes 6, 7",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 250, y: 60},
          "2": {val: 2, left: "1", right: "5", x: 150, y: 140},
          "6": {val: 6, left: "3", right: "7", x: 350, y: 140},
          "1": {val: 1, x: 100, y: 220},
          "5": {val: 5, x: 200, y: 220},
          "3": {val: 3, x: 300, y: 220},
          "7": {val: 7, x: 400, y: 220}
        },
        highlightNodes: ["6", "7"],
        action: "Visit 6, 7: prev(3) < node(6) < node(7) ✓ Traversal complete",
        prev: "7",
        first: "5",
        second: "3",
        violations: ["5 and 3 swapped"]
      },
      {
        step: 8,
        description: "Swap the values: first.val ↔ second.val",
        tree: {
          "4": {val: 4, left: "2", right: "6", x: 250, y: 60},
          "2": {val: 2, left: "1", right: "3", x: 150, y: 140}, // Fixed: 3 in correct position
          "6": {val: 6, left: "5", right: "7", x: 350, y: 140}, // Fixed: 5 in correct position
          "1": {val: 1, x: 100, y: 220},
          "3": {val: 3, x: 200, y: 220}, // Fixed: was 5
          "5": {val: 5, x: 300, y: 220}, // Fixed: was 3
          "7": {val: 7, x: 400, y: 220}
        },
        highlightNodes: ["3", "5"],
        action: "BST recovered! Swap 5 ↔ 3 → Inorder: [1,2,3,4,5,6,7] ✅",
        first: "5",
        second: "3",
        violations: []
      }
    ];

    const drawVisualization = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const steps = getAnimationSteps();
      const currentStep = steps[bstRecoveryAnimationStep];

      // Draw tree
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        const isHighlighted = currentStep.highlightNodes.includes(nodeId);
        const isFirst = currentStep.first === nodeId;
        const isSecond = currentStep.second === nodeId;
        const isPrev = currentStep.prev === nodeId;

        // Draw edges first
        if (node.left) {
          const leftNode = currentStep.tree[node.left];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(leftNode.x, leftNode.y);
          ctx.stroke();
        }
        if (node.right) {
          const rightNode = currentStep.tree[node.right];
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNode.x, rightNode.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      Object.entries(currentStep.tree).forEach(([nodeId, node]) => {
        const isHighlighted = currentStep.highlightNodes.includes(nodeId);
        const isFirst = currentStep.first === nodeId;
        const isSecond = currentStep.second === nodeId;
        const isPrev = currentStep.prev === nodeId;

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        
        if (isFirst) {
          ctx.fillStyle = '#0891b2'; // Teal for first violation
        } else if (isSecond) {
          ctx.fillStyle = '#06b6d4'; // Cyan for second violation
        } else if (isPrev) {
          ctx.fillStyle = '#14b8a6'; // Teal-500 for previous node
        } else if (isHighlighted) {
          ctx.fillStyle = '#22d3ee'; // Cyan-400 for highlighted
        } else {
          ctx.fillStyle = '#e2e8f0'; // Default gray
        }
        ctx.fill();
        
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node value
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.val.toString(), node.x, node.y);
      });

      // Draw info panel
      const infoX = 40;
      const infoY = 320;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(infoX - 10, infoY - 10, 620, 120);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(infoX - 10, infoY - 10, 620, 120);

      // Step info
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Step ${currentStep.step}: ${currentStep.description}`, infoX, infoY);
      
      ctx.font = '14px Arial';
      ctx.fillText(`Action: ${currentStep.action}`, infoX, infoY + 25);
      
      if (currentStep.first) {
        ctx.fillStyle = '#0891b2';
        ctx.fillText(`First violation node: ${currentStep.first}`, infoX, infoY + 50);
      }
      
      if (currentStep.second) {
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`Second violation node: ${currentStep.second}`, infoX + 200, infoY + 50);
      }
      
      if (currentStep.prev) {
        ctx.fillStyle = '#14b8a6';
        ctx.fillText(`Previous node: ${currentStep.prev}`, infoX + 350, infoY + 50);
      }

      // Legend
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.fillText('🔵 First violation  🟦 Second violation  🟢 Previous node  🔷 Current node', infoX, infoY + 80);
    };

    useEffect(() => {
      drawVisualization();
    }, [bstRecoveryAnimationStep]);

    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h4 className="font-semibold text-teal-800 dark:text-teal-400 mb-4 flex items-center">
          <span className="mr-2">🔧</span>
          BST Recovery Algorithm - Two Swapped Nodes
        </h4>
        
        <canvas
          ref={canvasRef}
          width={700}
          height={500}
          className="border border-teal-300 rounded-lg bg-white"
        />
        
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => setBSTRecoveryAnimationStep(Math.max(0, bstRecoveryAnimationStep - 1))}
            className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm"
            disabled={bstRecoveryAnimationStep === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setBSTRecoveryAnimationStep((bstRecoveryAnimationStep + 1) % getAnimationSteps().length)}
            className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm"
          >
            Next
          </button>
          <button
            onClick={() => setBSTRecoveryAnimationStep(0)}
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
          >
            Reset
          </button>
        </div>
        
        <div className="mt-4 text-sm text-teal-700 dark:text-teal-300 space-y-2">
          <p><strong>Algorithm Key Points:</strong></p>
          <p>• Inorder traversal of BST should give sorted sequence</p>
          <p>• Two violations possible: adjacent swapped nodes (1 violation) or non-adjacent (2 violations)</p>
          <p>• First violation: prev &gt; current → mark 'first' node</p>
          <p>• Second violation: prev &gt; current → update 'second' node</p>
          <p>• After traversal: swap values of 'first' and 'second' nodes</p>
        </div>
      </div>
    );
  };

  const topicQuestionCounts = {
    "Tree DP": 12,
    "LCA & Distance": 6,
    "BST Operations": 8,
    "Tree Traversals": 6,
    "Tree Construction": 6,
    "Advanced Trees": 11
  };

  const filteredQuestions = useMemo(() => {
    if (selectedTopic === 'all') {
      return questions;
    }
    return questions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic, questions]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setStreak(streak + 1);
      setCombo(combo + 1);
      const questionScore = calculateScore(currentQuestion.difficulty, timeSpent, hintsUsed);
      setScore(score + questionScore);
      
      setUserProgress(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        questionsAnswered: prev.questionsAnswered + 1,
        streakCount: streak + 1,
        bestStreak: Math.max(prev.bestStreak, streak + 1)
      }));
    } else {
      setStreak(0);
      setCombo(0);
      setUserProgress(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1
      }));
    }
    
    // Check for achievements
    checkAchievements();
  };

  const calculateScore = (difficulty: string, timeSpent: number, hintsUsed: number): number => {
    const baseScore = difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 150 : 200;
    const timeBonus = Math.max(0, 60 - timeSpent) * 2;
    const hintPenalty = hintsUsed * 25;
    const comboBonus = combo * 10;
    
    return Math.max(10, baseScore + timeBonus - hintPenalty + comboBonus);
  };

  const checkAchievements = () => {
    // Simplified achievement checking
    const newAchievements: string[] = [];
    
    if (streak >= 5 && !userProgress.achievements.includes('streak-5')) {
      newAchievements.push('streak-5');
    }
    
    if (userProgress.correctAnswers >= 10 && !userProgress.achievements.includes('correct-10')) {
      newAchievements.push('correct-10');
    }
    
    if (newAchievements.length > 0) {
      setUserProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
    setStreak(0);
    setCombo(0);
    setHintsUsed(0);
    setTimeSpent(0);
    setShowHint(false);
  };

  const handleShowHint = () => {
    setShowHint(true);
    setHintsUsed(hintsUsed + 1);
  };



  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-green-200 dark:border-green-800 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Congratulations!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've completed the Tree Algorithm Multiple Choice Challenge!
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Final Score:</span>
                <span className="font-bold text-green-600 dark:text-green-400">{score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">High Score:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{highScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Best Streak:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{userProgress.bestStreak}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Play Again
              </button>
              <Link href="/games/tree-adventure">
                <button className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                  Back to Tree Adventure
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            No questions available for selected topic
          </h2>
          <Link href="/games/tree-adventure">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Back to Tree Adventure
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/games/tree-adventure" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-2 inline-block">
              ← Back to Tree Adventure
            </Link>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              Score: {score}
            </div>
            <div className="text-sm text-green-600 dark:text-gray-400">
              High Score: {highScore}
            </div>
          </div>
        </div>

        {/* Topic Filter - Top Horizontal */}
        <div className="mb-8 w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 mb-2">
            Tree Multiple Choice
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedTopic === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-sm">All Topics</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  selectedTopic === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                }`}>
                  {questions.length}
                </span>
              </span>
            </button>
            
            {Object.entries(topicQuestionCounts).map(([topic, count]) => {
              const gradients: {[key: string]: string} = {
                "Tree DP": "from-green-500 to-emerald-600",
                "LCA & Distance": "from-blue-500 to-cyan-600", 
                "BST Operations": "from-yellow-500 to-orange-600",
                "Tree Traversals": "from-purple-500 to-indigo-600",
                "Tree Construction": "from-pink-500 to-rose-600",
                "Advanced Trees": "from-red-500 to-pink-600"
              };
              
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedTopic === topic
                      ? `bg-gradient-to-r ${gradients[topic]} text-white shadow-lg`
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-sm">{topic}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      selectedTopic === topic
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                    }`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>


        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Question */}
          <div className="space-y-6">
            {/* Progress & Stats */}
            <div className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                    {currentQuestionIndex + 1}/{filteredQuestions.length}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Progress</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-green-600 dark:from-teal-400 dark:to-green-400">
                    {Math.round((userProgress.correctAnswers / Math.max(1, userProgress.questionsAnswered)) * 100)}%
                  </div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">Accuracy</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                    {combo}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Combo</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
                    {currentQuestion.difficulty}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Difficulty</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-300/50 dark:border-emerald-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Progress</span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">{Math.round(((currentQuestionIndex + 1) / filteredQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-emerald-200/50 dark:bg-emerald-800/30 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
                  {currentQuestion.topic}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Function: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{currentQuestion.functionName}</code>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {currentQuestion.question}
            </h2>

            {/* BST Deletion Visualization Button */}
            {currentQuestion.id === 14 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowBSTDeletionVisualization(!showBSTDeletionVisualization)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>🌳</span>
                    <span>{showBSTDeletionVisualization ? 'Hide' : 'Show'} BST Deletion Steps</span>
                  </span>
                </button>
                
                {showBSTDeletionVisualization && <BSTDeletionVisualization />}
              </div>
            )}

            {/* BST Trim Visualization Button */}
            {currentQuestion.id === 35 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowBSTTrimVisualization(!showBSTTrimVisualization)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>✂️</span>
                    <span>{showBSTTrimVisualization ? 'Hide' : 'Show'} BST Trim Steps</span>
                  </span>
                </button>
                
                {showBSTTrimVisualization && <BSTTrimVisualization />}
              </div>
            )}

            {/* BST Range Sum Visualization Button */}
            {currentQuestion.id === 36 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowBSTRangeSumVisualization(!showBSTRangeSumVisualization)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>🧮</span>
                    <span>{showBSTRangeSumVisualization ? 'Hide' : 'Show'} BST Range Sum Steps</span>
                  </span>
                </button>
                
                {showBSTRangeSumVisualization && <BSTRangeSumVisualization />}
              </div>
            )}

            {/* BST Balance Visualization Button */}
            {currentQuestion.id === 37 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowBSTBalanceVisualization(!showBSTBalanceVisualization)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>⚖️</span>
                    <span>{showBSTBalanceVisualization ? 'Hide' : 'Show'} BST Balance Steps</span>
                  </span>
                </button>
                
                {showBSTBalanceVisualization && <BSTBalanceVisualization />}
              </div>
            )}

            {/* Postorder Traversal Visualization Button */}
            {currentQuestion.id === 17 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowPostorderVisualization(!showPostorderVisualization)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span>{showPostorderVisualization ? 'Hide' : 'Show'} Postorder Traversal Steps</span>
                  </span>
                </button>
                
                {showPostorderVisualization && <PostorderTraversalVisualization />}
              </div>
            )}

            {/* Boundary Traversal Visualization Button */}
            {currentQuestion.id === 39 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowBoundaryVisualization(!showBoundaryVisualization)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span>{showBoundaryVisualization ? 'Hide' : 'Show'} Boundary Traversal Steps</span>
                  </span>
                </button>
                
                {showBoundaryVisualization && <BoundaryTraversalVisualization />}
              </div>
            )}

            {/* BST Recovery Visualization Button */}
            {currentQuestion.id === 25 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowBSTRecoveryVisualization(!showBSTRecoveryVisualization)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>🔧</span>
                    <span>{showBSTRecoveryVisualization ? 'Hide' : 'Show'} BST Recovery Steps</span>
                  </span>
                </button>
                
                {showBSTRecoveryVisualization && <BSTRecoveryVisualization />}
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    showResult
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : index === selectedAnswer && index !== currentQuestion.correctAnswer
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      : selectedAnswer === index
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-4 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <span className="text-green-600 dark:text-green-400 ml-2">✓</span>
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <span className="text-red-600 dark:text-red-400 ml-2">✗</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Hint Button */}
            {!showResult && !showHint && (
              <button
                onClick={handleShowHint}
                className="mb-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
              >
                💡 Show Hint
              </button>
            )}

            {/* Hint Display */}
            {showHint && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start">
                  <span className="text-yellow-600 dark:text-yellow-400 mr-2">💡</span>
                  <p className="text-yellow-800 dark:text-yellow-400">{currentQuestion.hint}</p>
                </div>
              </div>
            )}

            {/* Result Display - Under Question */}
            {showResult && (
              <div className="mt-6 space-y-4">
                <div className={`p-4 rounded-lg border ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-center mb-2">
                    <span className={`mr-2 ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                    </span>
                    <span className="font-semibold">
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {currentQuestion.explanation}
                  </p>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'} →
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Right Side - Code Display */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-white text-lg">💻</span>
                    <div>
                      <h3 className="text-white font-semibold">{currentQuestion.functionName}</h3>
                      <p className="text-teal-100 text-sm">{currentQuestion.topic}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentQuestion.difficulty === 'Easy' 
                      ? 'bg-green-500/20 text-green-100'
                      : currentQuestion.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-100'
                        : 'bg-red-500/20 text-red-100'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>
            
              <div className="bg-gray-900 p-4 overflow-x-auto h-[680px] overflow-y-auto">
                <pre className="text-green-400 text-sm leading-relaxed">
                  <code>{currentQuestion.code}</code>
                </pre>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-t border-teal-200 dark:border-teal-800">
              <h4 className="font-semibold text-teal-800 dark:text-teal-400 mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Algorithm Insights
              </h4>
              <div className="text-sm text-teal-700 dark:text-teal-300 space-y-1">
                {currentQuestion.topic === "Tree DP" && (
                  <>
                    <p>• Tree DP uses post-order traversal to solve subproblems bottom-up</p>
                    <p>• Each node's state depends on its children's states</p>
                    <p>• Optimal substructure: global optimum from local optimal choices</p>
                    <p>• Node has no children (leaf) → Simply remove it</p>
                    <p>• Node has one child → Replace with its child</p>
                    <p>• Node has two children → Replace with inorder successor, then delete successor</p>
                  </>
                )}
                {currentQuestion.topic === "LCA & Distance" && (
                  <>
                    <p>• LCA is the deepest node that has both target nodes as descendants</p>
                    <p>• Distance between nodes = distance(LCA, node1) + distance(LCA, node2)</p>
                    <p>• Parent pointers enable bidirectional tree traversal</p>
                  </>
                )}
                {currentQuestion.topic === "BST Operations" && (
                  <>
                    <p>• BST property: left subtree &lt; node &lt; right subtree</p>
                    <p>• Inorder traversal of BST gives sorted sequence</p>
                    <p>• Range validation ensures BST property for entire subtree</p>
                  </>
                )}
                {currentQuestion.topic === "Tree Traversals" && (
                  <>
                    <p>• Iterative traversals use explicit stack to simulate recursion</p>
                    <p>• Stack order determines traversal sequence</p>
                    <p>• Level-order uses queue for breadth-first exploration</p>
                  </>
                )}
                {currentQuestion.topic === "Tree Construction" && (
                  <>
                    <p>• Preorder gives root positions, inorder gives left/right splits</p>
                    <p>• Serialization preserves complete tree structure with null markers</p>
                    <p>• BST construction uses ordering property for validation</p>
                  </>
                )}
                {currentQuestion.topic === "Advanced Trees" && (
                  <>
                    <p>• Advanced algorithms combine multiple tree concepts</p>
                    <p>• Coordinate systems enable complex tree operations</p>
                    <p>• In-place modifications require careful pointer management</p>
                  </>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


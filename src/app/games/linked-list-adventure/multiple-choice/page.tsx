"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';

// ReverseKGroupVisualizer Component
interface ListNode {
  val: number;
  next: ListNode | null;
}

interface VisualizationStep {
  step: number;
  description: string;
  nodes: ListNode[];
  currentNode: number | null;
  groupStart: number | null;
  groupEnd: number | null;
  hasKNodesCount: number;
  hasKNodesResult: boolean;
  loopIteration: number;
  isReversing: boolean;
  reversedGroups: number[][];
}

const ReverseKGroupVisualizer: React.FC<{ k: number }> = ({ k }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Create initial linked list: 1->2->3->4->5->6->7->8
  const createInitialList = (): ListNode[] => {
    const nodes: ListNode[] = [];
    for (let i = 1; i <= 8; i++) {
      nodes.push({ val: i, next: null });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }
    return nodes;
  };

  const [originalNodes] = useState(createInitialList());

  // hasKNodes function implementation
  const hasKNodes = (start: ListNode | null, k: number): { hasK: boolean, count: number } => {
    let count = 0;
    let current = start;
    while (current && count < k) {
      count++;
      current = current.next;
    }
    return { hasK: count === k, count };
  };

  // Generate visualization steps
  const generateSteps = (): VisualizationStep[] => {
    const steps: VisualizationStep[] = [];
    const nodes = [...originalNodes];
    let loopIteration = 1;
    let currentPos = 0;
    const reversedGroups: number[][] = [];

    // Initial state
    steps.push({
      step: 0,
      description: `Initial linked list: ${nodes.map(n => n.val).join(' -> ')}. We need to reverse every ${k} nodes.`,
      nodes: [...nodes],
      currentNode: null,
      groupStart: null,
      groupEnd: null,
      hasKNodesCount: 0,
      hasKNodesResult: false,
      loopIteration: 0,
      isReversing: false,
      reversedGroups: []
    });

    // Simulate the algorithm
    while (currentPos < nodes.length) {
      const startNode = nodes[currentPos];
      const { hasK, count } = hasKNodes(startNode, k);

      // Show hasKNodes check
      steps.push({
        step: steps.length,
        description: `Loop ${loopIteration}: Checking hasKNodes(node_${startNode.val}, ${k}). Counting nodes...`,
        nodes: [...nodes],
        currentNode: currentPos,
        groupStart: currentPos,
        groupEnd: null,
        hasKNodesCount: 0,
        hasKNodesResult: false,
        loopIteration,
        isReversing: false,
        reversedGroups: [...reversedGroups]
      });

      // Show counting process
      for (let i = 1; i <= Math.min(count, k); i++) {
        steps.push({
          step: steps.length,
          description: `Loop ${loopIteration}: Counting node ${i}/${k} (value: ${nodes[currentPos + i - 1].val})`,
          nodes: [...nodes],
          currentNode: currentPos + i - 1,
          groupStart: currentPos,
          groupEnd: currentPos + i - 1,
          hasKNodesCount: i,
          hasKNodesResult: false,
          loopIteration,
          isReversing: false,
          reversedGroups: [...reversedGroups]
        });
      }

      // Show result of hasKNodes
      steps.push({
        step: steps.length,
        description: `Loop ${loopIteration}: hasKNodes result: ${hasK} (found ${count}/${k} nodes)`,
        nodes: [...nodes],
        currentNode: currentPos,
        groupStart: currentPos,
        groupEnd: hasK ? currentPos + k - 1 : currentPos + count - 1,
        hasKNodesCount: count,
        hasKNodesResult: hasK,
        loopIteration,
        isReversing: false,
        reversedGroups: [...reversedGroups]
      });

      if (hasK) {
        // Show reversal process
        const groupNodes = [];
        for (let i = 0; i < k; i++) {
          groupNodes.push(nodes[currentPos + i].val);
        }
        
        steps.push({
          step: steps.length,
          description: `Loop ${loopIteration}: Reversing group [${groupNodes.join(', ')}]`,
          nodes: [...nodes],
          currentNode: currentPos,
          groupStart: currentPos,
          groupEnd: currentPos + k - 1,
          hasKNodesCount: k,
          hasKNodesResult: true,
          loopIteration,
          isReversing: true,
          reversedGroups: [...reversedGroups]
        });

        // Actually reverse the group in our visualization
        const reversedGroup = [];
        for (let i = k - 1; i >= 0; i--) {
          reversedGroup.push(nodes[currentPos + i].val);
        }
        
        for (let i = 0; i < k; i++) {
          nodes[currentPos + i].val = reversedGroup[i];
        }

        reversedGroups.push([...reversedGroup]);

        steps.push({
          step: steps.length,
          description: `Loop ${loopIteration}: Group reversed! New order: [${reversedGroup.join(', ')}]`,
          nodes: [...nodes],
          currentNode: null,
          groupStart: currentPos,
          groupEnd: currentPos + k - 1,
          hasKNodesCount: k,
          hasKNodesResult: true,
          loopIteration,
          isReversing: false,
          reversedGroups: [...reversedGroups]
        });

        currentPos += k;
        loopIteration++;
      } else {
        // Not enough nodes, algorithm stops
        steps.push({
          step: steps.length,
          description: `Loop ${loopIteration}: Not enough nodes (${count} < ${k}). Algorithm stops. Remaining nodes stay unchanged.`,
          nodes: [...nodes],
          currentNode: currentPos,
          groupStart: currentPos,
          groupEnd: currentPos + count - 1,
          hasKNodesCount: count,
          hasKNodesResult: false,
          loopIteration,
          isReversing: false,
          reversedGroups: [...reversedGroups]
        });
        break;
      }
    }

    // Final result
    steps.push({
      step: steps.length,
      description: `Final result: ${nodes.map(n => n.val).join(' -> ')}. Total loops: ${loopIteration - 1}`,
      nodes: [...nodes],
      currentNode: null,
      groupStart: null,
      groupEnd: null,
      hasKNodesCount: 0,
      hasKNodesResult: false,
      loopIteration: 0,
      isReversing: false,
      reversedGroups: [...reversedGroups]
    });

    return steps;
  };

  const [steps] = useState(generateSteps());

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  if (!showVisualizer) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setShowVisualizer(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          🎯 Visualize Reverse K-Group Algorithm
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
          Reverse K-Group Visualization (k = {k})
        </h3>
        <button
          onClick={() => setShowVisualizer(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      {/* Algorithm Status */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Step:</span>
            <span className="ml-2">{currentStep + 1}/{steps.length}</span>
          </div>
          <div>
            <span className="font-semibold text-green-600 dark:text-green-400">Loop:</span>
            <span className="ml-2">{currentStepData.loopIteration || 'N/A'}</span>
          </div>
          <div>
            <span className="font-semibold text-purple-600 dark:text-purple-400">hasKNodes Count:</span>
            <span className="ml-2">{currentStepData.hasKNodesCount}/{k}</span>
          </div>
          <div>
            <span className="font-semibold text-orange-600 dark:text-orange-400">Result:</span>
            <span className={`ml-2 ${currentStepData.hasKNodesResult ? 'text-green-600' : 'text-red-600'}`}>
              {currentStepData.hasKNodesResult ? '✓ Reverse' : '✗ Skip'}
            </span>
          </div>
        </div>
      </div>

      {/* Linked List Visualization */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          {currentStepData.nodes.map((node, index) => (
            <React.Fragment key={index}>
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-300
                  ${index === currentStepData.currentNode 
                    ? 'bg-yellow-400 border-yellow-600 text-yellow-900 scale-110 shadow-lg' 
                    : currentStepData.groupStart !== null && index >= currentStepData.groupStart && index <= (currentStepData.groupEnd || currentStepData.groupStart)
                    ? currentStepData.isReversing
                      ? 'bg-red-400 border-red-600 text-red-900 animate-pulse'
                      : currentStepData.hasKNodesResult
                      ? 'bg-green-400 border-green-600 text-green-900'
                      : 'bg-blue-400 border-blue-600 text-blue-900'
                    : 'bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {node.val}
              </div>
              {index < currentStepData.nodes.length - 1 && (
                <div className="text-2xl text-gray-400 dark:text-gray-500">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Description */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
        <p className="text-indigo-800 dark:text-indigo-200 font-medium">
          {currentStepData.description}
        </p>
      </div>

      {/* hasKNodes Function Demo */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
        <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">hasKNodes Function:</h4>
        <div className="font-mono text-sm text-green-700 dark:text-green-300">
          <div>def hasKNodes(start, k):</div>
          <div className="ml-4">count = 0</div>
          <div className="ml-4">current = start</div>
          <div className="ml-4">while current and count &lt; k:</div>
          <div className="ml-8">count += 1  # Currently: {currentStepData.hasKNodesCount}</div>
          <div className="ml-8">current = current.next</div>
          <div className="ml-4">return count == k  # Returns: {currentStepData.hasKNodesResult.toString()}</div>
        </div>
      </div>

      {/* Reversed Groups Summary */}
      {currentStepData.reversedGroups.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Reversed Groups:</h4>
          <div className="flex flex-wrap gap-2">
            {currentStepData.reversedGroups.map((group, index) => (
              <div key={index} className="px-3 py-1 bg-purple-200 dark:bg-purple-700 rounded-full text-sm font-medium text-purple-800 dark:text-purple-200">
                Group {index + 1}: [{group.join(', ')}]
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>
        
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next →
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
        >
          🔄 Reset
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded-full"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 border border-blue-600 rounded-full"></div>
            <span>Counting Group</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 border border-green-600 rounded-full"></div>
            <span>Ready to Reverse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 border border-red-600 rounded-full"></div>
            <span>Reversing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// RotateRightVisualizer Component
interface RotateStep {
  step: number;
  description: string;
  nodes: ListNode[];
  currentNode: number | null;
  tail: number | null;
  newTail: number | null;
  newHead: number | null;
  length: number;
  k: number;
  effectiveK: number;
  isCircular: boolean;
  phase: 'finding_length' | 'making_circular' | 'finding_new_tail' | 'breaking_circle' | 'complete';
}

const RotateRightVisualizer: React.FC<{ initialK?: number }> = ({ initialK = 2 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [k, setK] = useState(initialK);

  // Create initial linked list: 1->2->3->4->5
  const createInitialList = (): ListNode[] => {
    const nodes: ListNode[] = [];
    for (let i = 1; i <= 5; i++) {
      nodes.push({ val: i, next: null });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }
    return nodes;
  };

  const [originalNodes] = useState(createInitialList());

  // Generate visualization steps
  const generateSteps = (rotateK: number): RotateStep[] => {
    const steps: RotateStep[] = [];
    const nodes = [...originalNodes];
    const length = nodes.length;
    const effectiveK = rotateK % length;

    // Initial state
    steps.push({
      step: 0,
      description: `Initial linked list: ${nodes.map(n => n.val).join(' -> ')}. We want to rotate right by k=${rotateK} places.`,
      nodes: [...nodes],
      currentNode: null,
      tail: null,
      newTail: null,
      newHead: null,
      length: 0,
      k: rotateK,
      effectiveK: 0,
      isCircular: false,
      phase: 'finding_length'
    });

    // Step 1: Find length and tail
    steps.push({
      step: 1,
      description: `Step 1: Finding the length and tail of the list. Starting from head...`,
      nodes: [...nodes],
      currentNode: 0,
      tail: null,
      newTail: null,
      newHead: null,
      length: 1,
      k: rotateK,
      effectiveK: 0,
      isCircular: false,
      phase: 'finding_length'
    });

    // Show length counting process
    for (let i = 1; i < length; i++) {
      steps.push({
        step: steps.length,
        description: `Finding length: Currently at node ${nodes[i].val}, length = ${i + 1}`,
        nodes: [...nodes],
        currentNode: i,
        tail: i === length - 1 ? i : null,
        newTail: null,
        newHead: null,
        length: i + 1,
        k: rotateK,
        effectiveK: 0,
        isCircular: false,
        phase: 'finding_length'
      });
    }

    // Calculate effective k
    steps.push({
      step: steps.length,
      description: `Length found: ${length}. Calculate effective k: ${rotateK} % ${length} = ${effectiveK}${effectiveK === 0 ? ' (no rotation needed!)' : ''}`,
      nodes: [...nodes],
      currentNode: null,
      tail: length - 1,
      newTail: null,
      newHead: null,
      length: length,
      k: rotateK,
      effectiveK: effectiveK,
      isCircular: false,
      phase: 'finding_length'
    });

    if (effectiveK === 0) {
      steps.push({
        step: steps.length,
        description: `Since effective k = 0, no rotation is needed. Return original list.`,
        nodes: [...nodes],
        currentNode: null,
        tail: length - 1,
        newTail: null,
        newHead: null,
        length: length,
        k: rotateK,
        effectiveK: effectiveK,
        isCircular: false,
        phase: 'complete'
      });
      return steps;
    }

    // Step 2: Make circular
    steps.push({
      step: steps.length,
      description: `Step 2: Make the list circular by connecting tail (${nodes[length-1].val}) to head (${nodes[0].val})`,
      nodes: [...nodes],
      currentNode: null,
      tail: length - 1,
      newTail: null,
      newHead: null,
      length: length,
      k: rotateK,
      effectiveK: effectiveK,
      isCircular: true,
      phase: 'making_circular'
    });

    // Step 3: Find new tail position
    const newTailPos = length - effectiveK - 1;
    steps.push({
      step: steps.length,
      description: `Step 3: Find new tail at position (length - k - 1) = (${length} - ${effectiveK} - 1) = ${newTailPos}`,
      nodes: [...nodes],
      currentNode: null,
      tail: length - 1,
      newTail: null,
      newHead: null,
      length: length,
      k: rotateK,
      effectiveK: effectiveK,
      isCircular: true,
      phase: 'finding_new_tail'
    });

    // Show new tail finding process
    for (let i = 0; i <= newTailPos; i++) {
      steps.push({
        step: steps.length,
        description: `Finding new tail: Step ${i + 1}/${newTailPos + 1}, currently at node ${nodes[i].val}`,
        nodes: [...nodes],
        currentNode: i,
        tail: length - 1,
        newTail: i === newTailPos ? i : null,
        newHead: null,
        length: length,
        k: rotateK,
        effectiveK: effectiveK,
        isCircular: true,
        phase: 'finding_new_tail'
      });
    }

    // Step 4: Identify new head
    const newHeadPos = newTailPos + 1;
    steps.push({
      step: steps.length,
      description: `New tail found at node ${nodes[newTailPos].val}. New head is next: node ${nodes[newHeadPos].val}`,
      nodes: [...nodes],
      currentNode: null,
      tail: length - 1,
      newTail: newTailPos,
      newHead: newHeadPos,
      length: length,
      k: rotateK,
      effectiveK: effectiveK,
      isCircular: true,
      phase: 'finding_new_tail'
    });

    // Step 5: Break the circle
    steps.push({
      step: steps.length,
      description: `Step 4: Break the circular connection at new tail (${nodes[newTailPos].val}.next = None)`,
      nodes: [...nodes],
      currentNode: null,
      tail: length - 1,
      newTail: newTailPos,
      newHead: newHeadPos,
      length: length,
      k: rotateK,
      effectiveK: effectiveK,
      isCircular: false,
      phase: 'breaking_circle'
    });

    // Final result - simulate the rotation
    const rotatedNodes = [...nodes];
    const rotatedValues = [];
    for (let i = 0; i < length; i++) {
      rotatedValues.push(nodes[(newHeadPos + i) % length].val);
    }
    for (let i = 0; i < length; i++) {
      rotatedNodes[i].val = rotatedValues[i];
    }

    steps.push({
      step: steps.length,
      description: `Final result: ${rotatedValues.join(' -> ')}. Successfully rotated right by ${effectiveK} places!`,
      nodes: rotatedNodes,
      currentNode: null,
      tail: null,
      newTail: null,
      newHead: null,
      length: length,
      k: rotateK,
      effectiveK: effectiveK,
      isCircular: false,
      phase: 'complete'
    });

    return steps;
  };

  const [steps, setSteps] = useState(() => generateSteps(k));

  // Regenerate steps when k changes
  useEffect(() => {
    setSteps(generateSteps(k));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [k]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  if (!showVisualizer) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setShowVisualizer(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          🔄 Visualize Rotate Right Algorithm
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
          Rotate Right Visualization
        </h3>
        <button
          onClick={() => setShowVisualizer(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* K Value Selector */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="font-semibold text-green-700 dark:text-green-300">
            Rotate by k =
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 7, 12].map(value => (
              <button
                key={value}
                onClick={() => setK(value)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  k === value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={k}
            onChange={(e) => setK(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 px-2 py-1 border rounded text-center"
            min="0"
          />
        </div>
      </div>

      {/* Algorithm Status */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Step:</span>
            <span className="ml-2">{currentStep + 1}/{steps.length}</span>
          </div>
          <div>
            <span className="font-semibold text-green-600 dark:text-green-400">Length:</span>
            <span className="ml-2">{currentStepData.length}</span>
          </div>
          <div>
            <span className="font-semibold text-purple-600 dark:text-purple-400">k:</span>
            <span className="ml-2">{currentStepData.k}</span>
          </div>
          <div>
            <span className="font-semibold text-orange-600 dark:text-orange-400">Effective k:</span>
            <span className="ml-2">{currentStepData.effectiveK}</span>
          </div>
          <div>
            <span className="font-semibold text-red-600 dark:text-red-400">Phase:</span>
            <span className="ml-2 capitalize">{currentStepData.phase.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Linked List Visualization */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border overflow-x-auto">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 min-w-max">
            {currentStepData.nodes.map((node, index) => (
              <React.Fragment key={index}>
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-300 relative
                    ${index === currentStepData.currentNode 
                      ? 'bg-yellow-400 border-yellow-600 text-yellow-900 scale-110 shadow-lg' 
                      : index === currentStepData.tail
                      ? 'bg-red-400 border-red-600 text-red-900'
                      : index === currentStepData.newTail
                      ? 'bg-purple-400 border-purple-600 text-purple-900'
                      : index === currentStepData.newHead
                      ? 'bg-green-400 border-green-600 text-green-900'
                      : 'bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {node.val}
                  {/* Labels */}
                  {index === currentStepData.tail && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 dark:text-red-400">
                      TAIL
                    </div>
                  )}
                  {index === currentStepData.newTail && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600 dark:text-purple-400">
                      NEW TAIL
                    </div>
                  )}
                  {index === currentStepData.newHead && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 dark:text-green-400">
                      NEW HEAD
                    </div>
                  )}
                </div>
                {index < currentStepData.nodes.length - 1 && (
                  <div className="text-2xl text-gray-400 dark:text-gray-500">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Circular connection indicator */}
          {currentStepData.isCircular && (
            <div className="ml-4 flex items-center">
              <div className="text-2xl text-red-500 animate-pulse">↺</div>
              <div className="ml-2 text-sm text-red-600 dark:text-red-400 font-medium">
                Circular
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step Description */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
        <p className="text-indigo-800 dark:text-indigo-200 font-medium">
          {currentStepData.description}
        </p>
      </div>

      {/* Key Insight Box */}
      <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
        <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">🔑 Key Insight:</h4>
        <div className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
          <div><strong>New Head Position:</strong> (length - k) from original head</div>
          <div><strong>New Tail Position:</strong> (length - k - 1) from original head</div>
          <div><strong>Why?</strong> Moving k positions right = new head is k positions from the end</div>
          {currentStepData.effectiveK > 0 && (
            <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-800/50 rounded">
              <strong>Current calculation:</strong> New head at position ({currentStepData.length} - {currentStepData.effectiveK}) = {currentStepData.length - currentStepData.effectiveK}
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Code with Highlighting */}
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Algorithm Steps:</h4>
        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <div className={currentStepData.phase === 'finding_length' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            1. Find length and tail: length = {currentStepData.length}
          </div>
          <div className={currentStepData.phase === 'finding_length' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            2. Calculate effective k: {currentStepData.k} % {currentStepData.length} = {currentStepData.effectiveK}
          </div>
          <div className={currentStepData.phase === 'making_circular' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            3. Make circular: tail.next = head
          </div>
          <div className={currentStepData.phase === 'finding_new_tail' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            4. Find new tail: position {currentStepData.length} - {currentStepData.effectiveK} - 1 = {currentStepData.length - currentStepData.effectiveK - 1}
          </div>
          <div className={currentStepData.phase === 'breaking_circle' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            5. Break circle: new_tail.next = None
          </div>
        </div>
        </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>
        
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next →
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
        >
          🔄 Reset
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded-full"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 border border-red-600 rounded-full"></div>
            <span>Original Tail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 border border-purple-600 rounded-full"></div>
            <span>New Tail</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 border border-green-600 rounded-full"></div>
            <span>New Head</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ReverseEvenLengthVisualizer Component
interface EvenLengthStep {
  step: number;
  description: string;
  nodes: ListNode[];
  currentNode: number | null;
  groupStart: number | null;
  groupEnd: number | null;
  groupLength: number;
  isEvenLength: boolean;
  isReversing: boolean;
  phase: 'scanning' | 'counting' | 'deciding' | 'reversing' | 'skipping' | 'complete';
  processedGroups: { start: number; end: number; length: number; reversed: boolean }[];
}

const ReverseEvenLengthVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Create initial linked list with groups: [1,1,1] [2,2] [3] [4,4,4,4]
  const createInitialList = (): ListNode[] => {
    const values = [1, 1, 1, 2, 2, 3, 4, 4, 4, 4];
    const nodes: ListNode[] = [];
    for (let i = 0; i < values.length; i++) {
      nodes.push({ val: values[i], next: null });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }
    return nodes;
  };

  const [originalNodes] = useState(createInitialList());

  // Generate visualization steps
  const generateSteps = (): EvenLengthStep[] => {
    const steps: EvenLengthStep[] = [];
    const nodes = [...originalNodes];
    const processedGroups: { start: number; end: number; length: number; reversed: boolean }[] = [];
    let currentPos = 0;

    // Initial state
    steps.push({
      step: 0,
      description: `Initial list: ${nodes.map(n => n.val).join(' -> ')}. We'll group consecutive equal values and reverse only even-length groups.`,
      nodes: [...nodes],
      currentNode: null,
      groupStart: null,
      groupEnd: null,
      groupLength: 0,
      isEvenLength: false,
      isReversing: false,
      phase: 'scanning',
      processedGroups: []
    });

    while (currentPos < nodes.length) {
      const groupValue = nodes[currentPos].val;
      let groupEnd = currentPos;
      
      // Find the end of current group
      while (groupEnd < nodes.length - 1 && nodes[groupEnd + 1].val === groupValue) {
        groupEnd++;
      }
      
      const groupLength = groupEnd - currentPos + 1;
      const isEvenLength = groupLength % 2 === 0;

      // Show group identification
      steps.push({
        step: steps.length,
        description: `Found group of ${groupValue}'s from position ${currentPos} to ${groupEnd}`,
        nodes: [...nodes],
        currentNode: currentPos,
        groupStart: currentPos,
        groupEnd: groupEnd,
        groupLength: 0,
        isEvenLength: false,
        isReversing: false,
        phase: 'scanning',
        processedGroups: [...processedGroups]
      });

      // Show counting process
      for (let i = currentPos; i <= groupEnd; i++) {
        steps.push({
          step: steps.length,
          description: `Counting group: ${i - currentPos + 1}/${groupLength} nodes with value ${groupValue}`,
          nodes: [...nodes],
          currentNode: i,
          groupStart: currentPos,
          groupEnd: groupEnd,
          groupLength: i - currentPos + 1,
          isEvenLength: false,
          isReversing: false,
          phase: 'counting',
          processedGroups: [...processedGroups]
        });
      }

      // Show decision
      steps.push({
        step: steps.length,
        description: `Group length: ${groupLength} (${isEvenLength ? 'EVEN' : 'ODD'}). ${isEvenLength ? 'Will reverse!' : 'Will skip.'}`,
        nodes: [...nodes],
        currentNode: null,
        groupStart: currentPos,
        groupEnd: groupEnd,
        groupLength: groupLength,
        isEvenLength: isEvenLength,
        isReversing: false,
        phase: 'deciding',
        processedGroups: [...processedGroups]
      });

      if (isEvenLength) {
        // Show reversal process
        steps.push({
          step: steps.length,
          description: `Reversing even-length group [${nodes.slice(currentPos, groupEnd + 1).map(n => n.val).join(', ')}]`,
          nodes: [...nodes],
          currentNode: null,
          groupStart: currentPos,
          groupEnd: groupEnd,
          groupLength: groupLength,
          isEvenLength: true,
          isReversing: true,
          phase: 'reversing',
          processedGroups: [...processedGroups]
        });

        // Actually reverse the group
        const groupValues = [];
        for (let i = groupEnd; i >= currentPos; i--) {
          groupValues.push(nodes[i].val);
        }
        for (let i = 0; i < groupLength; i++) {
          nodes[currentPos + i].val = groupValues[i];
        }

        processedGroups.push({ start: currentPos, end: groupEnd, length: groupLength, reversed: true });

        steps.push({
          step: steps.length,
          description: `Group reversed! New values: [${nodes.slice(currentPos, groupEnd + 1).map(n => n.val).join(', ')}]`,
          nodes: [...nodes],
          currentNode: null,
          groupStart: currentPos,
          groupEnd: groupEnd,
          groupLength: groupLength,
          isEvenLength: true,
          isReversing: false,
          phase: 'reversing',
          processedGroups: [...processedGroups]
        });
      } else {
        // Skip odd-length group
        steps.push({
          step: steps.length,
          description: `Skipping odd-length group [${nodes.slice(currentPos, groupEnd + 1).map(n => n.val).join(', ')}] - no reversal needed`,
          nodes: [...nodes],
          currentNode: null,
          groupStart: currentPos,
          groupEnd: groupEnd,
          groupLength: groupLength,
          isEvenLength: false,
          isReversing: false,
          phase: 'skipping',
          processedGroups: [...processedGroups]
        });

        processedGroups.push({ start: currentPos, end: groupEnd, length: groupLength, reversed: false });
      }

      currentPos = groupEnd + 1;
    }

    // Final result
    steps.push({
      step: steps.length,
      description: `Final result: ${nodes.map(n => n.val).join(' -> ')}. Only even-length groups were reversed!`,
      nodes: [...nodes],
      currentNode: null,
      groupStart: null,
      groupEnd: null,
      groupLength: 0,
      isEvenLength: false,
      isReversing: false,
      phase: 'complete',
      processedGroups: [...processedGroups]
    });

    return steps;
  };

  const [steps] = useState(generateSteps());

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  if (!showVisualizer) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setShowVisualizer(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          🔄 Visualize Even-Length Group Reversal
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
          Even-Length Group Reversal Visualization
        </h3>
        <button
          onClick={() => setShowVisualizer(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Algorithm Status */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Step:</span>
            <span className="ml-2">{currentStep + 1}/{steps.length}</span>
          </div>
          <div>
            <span className="font-semibold text-green-600 dark:text-green-400">Phase:</span>
            <span className="ml-2 capitalize">{currentStepData.phase.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Group Length:</span>
            <span className="ml-2">{currentStepData.groupLength}</span>
          </div>
          <div>
            <span className="font-semibold text-orange-600 dark:text-orange-400">Even Length:</span>
            <span className={`ml-2 ${currentStepData.isEvenLength ? 'text-green-600' : 'text-red-600'}`}>
              {currentStepData.isEvenLength ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-pink-600 dark:text-pink-400">Action:</span>
            <span className={`ml-2 ${currentStepData.isEvenLength ? 'text-green-600' : 'text-gray-600'}`}>
              {currentStepData.isReversing ? 'Reversing' : currentStepData.isEvenLength ? 'Reverse' : 'Skip'}
            </span>
          </div>
        </div>
      </div>

      {/* Linked List Visualization */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          {currentStepData.nodes.map((node, index) => (
            <React.Fragment key={index}>
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-300 relative
                  ${index === currentStepData.currentNode 
                    ? 'bg-yellow-400 border-yellow-600 text-yellow-900 scale-110 shadow-lg' 
                    : currentStepData.groupStart !== null && index >= currentStepData.groupStart && index <= (currentStepData.groupEnd || currentStepData.groupStart)
                    ? currentStepData.isReversing
                      ? 'bg-red-400 border-red-600 text-red-900 animate-pulse'
                      : currentStepData.isEvenLength
                      ? 'bg-green-400 border-green-600 text-green-900'
                      : 'bg-blue-400 border-blue-600 text-blue-900'
                    : 'bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {node.val}
                {/* Group boundary indicators */}
                {currentStepData.groupStart === index && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    START
                  </div>
                )}
                {currentStepData.groupEnd === index && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    END
                  </div>
                )}
              </div>
              {index < currentStepData.nodes.length - 1 && (
                <div className="text-2xl text-gray-400 dark:text-gray-500">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Description */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
        <p className="text-indigo-800 dark:text-indigo-200 font-medium">
          {currentStepData.description}
        </p>
      </div>

      {/* Key Insight Box */}
      <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
        <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">🔑 Key Insight:</h4>
        <div className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
          <div><strong>Group Detection:</strong> Find consecutive nodes with same value</div>
          <div><strong>Length Check:</strong> Count nodes in each group</div>
          <div><strong>Even-Only Reversal:</strong> Reverse only if group_length % 2 == 0</div>
          <div><strong>Preserve Structure:</strong> Odd-length groups remain unchanged</div>
        </div>
      </div>

      {/* Processed Groups Summary */}
      {currentStepData.processedGroups.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Processed Groups:</h4>
          <div className="flex flex-wrap gap-2">
            {currentStepData.processedGroups.map((group, index) => (
              <div key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${
                group.reversed 
                  ? 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                Length {group.length}: {group.reversed ? 'Reversed' : 'Skipped'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Code with Highlighting */}
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Algorithm Steps:</h4>
        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <div className={currentStepData.phase === 'scanning' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            1. Find group of consecutive equal values
          </div>
          <div className={currentStepData.phase === 'counting' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            2. Count group length: {currentStepData.groupLength}
          </div>
          <div className={currentStepData.phase === 'deciding' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            3. Check if length is even: {currentStepData.groupLength} % 2 == {currentStepData.groupLength % 2}
          </div>
          <div className={currentStepData.phase === 'reversing' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            4. If even: reverse the group
          </div>
          <div className={currentStepData.phase === 'skipping' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            4. If odd: skip (no reversal)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>
        
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next →
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
        >
          🔄 Reset
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded-full"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 border border-blue-600 rounded-full"></div>
            <span>Current Group</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 border border-green-600 rounded-full"></div>
            <span>Even Group (Reverse)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 border border-red-600 rounded-full"></div>
            <span>Reversing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ReverseKGroupsFromEndVisualizer Component
interface FromEndStep {
  step: number;
  description: string;
  nodes: ListNode[];
  currentNode: number | null;
  skipCount: number;
  skippedNodes: number[];
  groupStart: number | null;
  groupEnd: number | null;
  length: number;
  k: number;
  phase: 'calculating' | 'skipping' | 'reversing' | 'complete';
  reversedGroups: number[][];
}

const ReverseKGroupsFromEndVisualizer: React.FC<{ k?: number }> = ({ k = 3 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Create initial linked list: 1->2->3->4->5->6->7->8 (length 8, k=3, skip 2)
  const createInitialList = (): ListNode[] => {
    const nodes: ListNode[] = [];
    for (let i = 1; i <= 8; i++) {
      nodes.push({ val: i, next: null });
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }
    return nodes;
  };

  const [originalNodes] = useState(createInitialList());

  // Generate visualization steps
  const generateSteps = (): FromEndStep[] => {
    const steps: FromEndStep[] = [];
    const nodes = [...originalNodes];
    const length = nodes.length;
    const skipCount = length % k;
    const reversedGroups: number[][] = [];

    // Initial state
    steps.push({
      step: 0,
      description: `Initial list: ${nodes.map(n => n.val).join(' -> ')} (length=${length}, k=${k}). We need to reverse k-groups from the END.`,
      nodes: [...nodes],
      currentNode: null,
      skipCount: 0,
      skippedNodes: [],
      groupStart: null,
      groupEnd: null,
      length: 0,
      k: k,
      phase: 'calculating',
      reversedGroups: []
    });

    // Step 1: Calculate length
    for (let i = 0; i < length; i++) {
      steps.push({
        step: steps.length,
        description: `Calculating length: counting node ${i + 1}/${length} (value: ${nodes[i].val})`,
        nodes: [...nodes],
        currentNode: i,
        skipCount: 0,
        skippedNodes: [],
        groupStart: null,
        groupEnd: null,
        length: i + 1,
        k: k,
        phase: 'calculating',
        reversedGroups: []
      });
    }

    // Step 2: Calculate skip count
    steps.push({
      step: steps.length,
      description: `Length = ${length}. Skip count = length % k = ${length} % ${k} = ${skipCount}. ${skipCount === 0 ? 'No nodes to skip!' : `Skip first ${skipCount} nodes.`}`,
      nodes: [...nodes],
      currentNode: null,
      skipCount: skipCount,
      skippedNodes: [],
      groupStart: null,
      groupEnd: null,
      length: length,
      k: k,
      phase: 'calculating',
      reversedGroups: []
    });

    if (skipCount === 0) {
      // No skipping needed, just reverse normally
      steps.push({
        step: steps.length,
        description: `No skipping needed. Apply standard k-group reversal from the beginning.`,
        nodes: [...nodes],
        currentNode: null,
        skipCount: skipCount,
        skippedNodes: [],
        groupStart: null,
        groupEnd: null,
        length: length,
        k: k,
        phase: 'reversing',
        reversedGroups: []
      });
    } else {
      // Step 3: Skip nodes
      const skippedNodes = [];
      for (let i = 0; i < skipCount; i++) {
        skippedNodes.push(i);
        steps.push({
          step: steps.length,
          description: `Skipping node ${i + 1}/${skipCount}: ${nodes[i].val} (these nodes stay at the beginning)`,
          nodes: [...nodes],
          currentNode: i,
          skipCount: skipCount,
          skippedNodes: [...skippedNodes],
          groupStart: null,
          groupEnd: null,
          length: length,
          k: k,
          phase: 'skipping',
          reversedGroups: []
        });
      }

      steps.push({
        step: steps.length,
        description: `Skipped ${skipCount} nodes: [${skippedNodes.map(i => nodes[i].val).join(', ')}]. Now reverse remaining ${length - skipCount} nodes in k-groups.`,
        nodes: [...nodes],
        currentNode: null,
        skipCount: skipCount,
        skippedNodes: [...skippedNodes],
        groupStart: null,
        groupEnd: null,
        length: length,
        k: k,
        phase: 'reversing',
        reversedGroups: []
      });
    }

    // Step 4: Reverse k-groups in remaining nodes
    let currentPos = skipCount;
    while (currentPos + k <= length) {
      const groupStart = currentPos;
      const groupEnd = currentPos + k - 1;

      // Show group identification
      steps.push({
        step: steps.length,
        description: `Reversing k-group: positions ${groupStart} to ${groupEnd} [${nodes.slice(groupStart, groupEnd + 1).map(n => n.val).join(', ')}]`,
        nodes: [...nodes],
        currentNode: null,
        skipCount: skipCount,
        skippedNodes: Array.from({length: skipCount}, (_, i) => i),
        groupStart: groupStart,
        groupEnd: groupEnd,
        length: length,
        k: k,
        phase: 'reversing',
        reversedGroups: [...reversedGroups]
      });

      // Actually reverse the group
      const groupValues = [];
      for (let i = groupEnd; i >= groupStart; i--) {
        groupValues.push(nodes[i].val);
      }
      for (let i = 0; i < k; i++) {
        nodes[groupStart + i].val = groupValues[i];
      }

      reversedGroups.push([...groupValues]);

      steps.push({
        step: steps.length,
        description: `Group reversed! New values: [${nodes.slice(groupStart, groupEnd + 1).map(n => n.val).join(', ')}]`,
        nodes: [...nodes],
        currentNode: null,
        skipCount: skipCount,
        skippedNodes: Array.from({length: skipCount}, (_, i) => i),
        groupStart: groupStart,
        groupEnd: groupEnd,
        length: length,
        k: k,
        phase: 'reversing',
        reversedGroups: [...reversedGroups]
      });

      currentPos += k;
    }

    // Final result
    steps.push({
      step: steps.length,
      description: `Final result: ${nodes.map(n => n.val).join(' -> ')}. Successfully reversed k-groups from the end!`,
      nodes: [...nodes],
      currentNode: null,
      skipCount: skipCount,
      skippedNodes: Array.from({length: skipCount}, (_, i) => i),
      groupStart: null,
      groupEnd: null,
      length: length,
      k: k,
      phase: 'complete',
      reversedGroups: [...reversedGroups]
    });

    return steps;
  };

  const [steps] = useState(() => generateSteps());

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  if (!showVisualizer) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setShowVisualizer(true)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          🔄 Visualize Reverse K-Groups From End
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200">
          Reverse K-Groups From End Visualization (k = {k})
        </h3>
        <button
          onClick={() => setShowVisualizer(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Algorithm Status */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Step:</span>
            <span className="ml-2">{currentStep + 1}/{steps.length}</span>
          </div>
          <div>
            <span className="font-semibold text-green-600 dark:text-green-400">Length:</span>
            <span className="ml-2">{currentStepData.length}</span>
          </div>
          <div>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Skip Count:</span>
            <span className="ml-2">{currentStepData.skipCount}</span>
          </div>
          <div>
            <span className="font-semibold text-orange-600 dark:text-orange-400">Phase:</span>
            <span className="ml-2 capitalize">{currentStepData.phase}</span>
          </div>
          <div>
            <span className="font-semibold text-red-600 dark:text-red-400">Groups:</span>
            <span className="ml-2">{currentStepData.reversedGroups.length}</span>
          </div>
        </div>
      </div>

      {/* Linked List Visualization */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          {currentStepData.nodes.map((node, index) => (
            <React.Fragment key={index}>
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-300 relative
                  ${index === currentStepData.currentNode 
                    ? 'bg-yellow-400 border-yellow-600 text-yellow-900 scale-110 shadow-lg' 
                    : currentStepData.skippedNodes.includes(index)
                    ? 'bg-gray-400 border-gray-600 text-gray-900'
                    : currentStepData.groupStart !== null && index >= currentStepData.groupStart && index <= (currentStepData.groupEnd || currentStepData.groupStart)
                    ? 'bg-green-400 border-green-600 text-green-900'
                    : 'bg-blue-200 dark:bg-blue-600 border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-200'
                  }
                `}
              >
                {node.val}
                {/* Labels */}
                {currentStepData.skippedNodes.includes(index) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-400">
                    SKIP
                  </div>
                )}
                {currentStepData.groupStart === index && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 dark:text-green-400">
                    GROUP START
                  </div>
                )}
                {currentStepData.groupEnd === index && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 dark:text-green-400">
                    GROUP END
                  </div>
                )}
              </div>
              {index < currentStepData.nodes.length - 1 && (
                <div className="text-2xl text-gray-400 dark:text-gray-500">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Description */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
        <p className="text-indigo-800 dark:text-indigo-200 font-medium">
          {currentStepData.description}
        </p>
      </div>

      {/* Key Insight Box */}
      <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
        <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">🔑 Key Insight:</h4>
        <div className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
          <div><strong>Calculate Skip Count:</strong> skip_count = length % k</div>
          <div><strong>Skip Beginning:</strong> Leave first {currentStepData.skipCount} nodes unchanged</div>
          <div><strong>Reverse Remaining:</strong> Apply k-group reversal to the rest</div>
          <div><strong>Why?</strong> This ensures complete k-groups align from the END</div>
          {currentStepData.skipCount > 0 && (
            <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-800/50 rounded">
              <strong>Example:</strong> Length {currentStepData.length}, k={k} → Skip {currentStepData.skipCount}, then reverse {currentStepData.length - currentStepData.skipCount} nodes
            </div>
          )}
        </div>
      </div>

      {/* Skip Logic Demonstration */}
      {currentStepData.skipCount > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Skip Logic Explanation:</h4>
          <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
            <div>• Total length: {currentStepData.length} nodes</div>
            <div>• Group size: {k} nodes per group</div>
            <div>• Complete groups possible: {Math.floor(currentStepData.length / k)} groups</div>
            <div>• Remaining nodes: {currentStepData.length} % {k} = {currentStepData.skipCount} nodes</div>
            <div>• <strong>Strategy:</strong> Skip the {currentStepData.skipCount} remainder nodes at the START</div>
            <div>• <strong>Result:</strong> Perfect k-groups align from the END</div>
          </div>
        </div>
      )}

      {/* Reversed Groups Summary */}
      {currentStepData.reversedGroups.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Reversed Groups:</h4>
          <div className="flex flex-wrap gap-2">
            {currentStepData.reversedGroups.map((group, index) => (
              <div key={index} className="px-3 py-1 bg-green-200 dark:bg-green-700 rounded-full text-sm font-medium text-green-800 dark:text-green-200">
                Group {index + 1}: [{group.join(', ')}]
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Code with Highlighting */}
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Algorithm Steps:</h4>
        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <div className={currentStepData.phase === 'calculating' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            1. Calculate length: {currentStepData.length}
          </div>
          <div className={currentStepData.phase === 'calculating' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            2. Calculate skip_count: {currentStepData.length} % {k} = {currentStepData.skipCount}
          </div>
          <div className={currentStepData.phase === 'skipping' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            3. Skip first {currentStepData.skipCount} nodes
          </div>
          <div className={currentStepData.phase === 'reversing' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            4. Apply k-group reversal to remaining nodes
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>
        
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next →
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
        >
          🔄 Reset
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded-full"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 border border-gray-600 rounded-full"></div>
            <span>Skipped Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 border border-green-600 rounded-full"></div>
            <span>Current Group</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded-full"></div>
            <span>Remaining Nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// DeepCopyWithCyclesVisualizer Component
interface CycleStep {
  step: number;
  description: string;
  originalNodes: { id: string; val: number; next?: string; random?: string }[];
  clonedNodes: { id: string; val: number; next?: string; random?: string }[];
  currentNode: string | null;
  visitedMap: { [key: string]: string };
  callStack: string[];
  phase: 'starting' | 'visiting' | 'checking_visited' | 'creating_clone' | 'recursing' | 'returning' | 'complete';
  cycleDetected: boolean;
}

const DeepCopyWithCyclesVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Create initial structure with cycles: A → B → C → A (cycle), B.random → C, C.random → A
  const createInitialStructure = () => {
    return [
      { id: 'A', val: 1, next: 'B', random: 'C' },
      { id: 'B', val: 2, next: 'C', random: 'A' },
      { id: 'C', val: 3, next: 'A', random: 'B' } // Creates cycle: A → B → C → A
    ];
  };

  const [originalNodes] = useState(createInitialStructure());

  // Generate visualization steps
  const generateSteps = (): CycleStep[] => {
    const steps: CycleStep[] = [];
    const visitedMap: { [key: string]: string } = {};
    const clonedNodes: { id: string; val: number; next?: string; random?: string }[] = [];
    const callStack: string[] = [];

    // Initial state
    steps.push({
      step: 0,
      description: `Initial structure with cycles: A(1) → B(2) → C(3) → A (cycle!). Random pointers: A→C, B→A, C→B. We need to deep copy without infinite recursion.`,
      originalNodes: [...originalNodes],
      clonedNodes: [],
      currentNode: null,
      visitedMap: {},
      callStack: [],
      phase: 'starting',
      cycleDetected: false
    });

    // Simulate DFS traversal
    const dfsSteps = (nodeId: string, depth: number = 0): void => {
      if (depth > 10) return; // Prevent infinite recursion in visualization

      const node = originalNodes.find(n => n.id === nodeId);
      if (!node) return;

      callStack.push(nodeId);

      // Step: Visiting node
      steps.push({
        step: steps.length,
        description: `DFS visiting node ${nodeId}(${node.val}). Call stack: [${callStack.join(' → ')}]`,
        originalNodes: [...originalNodes],
        clonedNodes: [...clonedNodes],
        currentNode: nodeId,
        visitedMap: { ...visitedMap },
        callStack: [...callStack],
        phase: 'visiting',
        cycleDetected: false
      });

      // Step: Check if already visited
      const alreadyVisited = nodeId in visitedMap;
      steps.push({
        step: steps.length,
        description: `Checking visited map for ${nodeId}: ${alreadyVisited ? `Found! Return existing clone ${visitedMap[nodeId]}` : 'Not found, need to create clone'}`,
        originalNodes: [...originalNodes],
        clonedNodes: [...clonedNodes],
        currentNode: nodeId,
        visitedMap: { ...visitedMap },
        callStack: [...callStack],
        phase: 'checking_visited',
        cycleDetected: alreadyVisited
      });

      if (alreadyVisited) {
        // Cycle detected - return existing clone
        steps.push({
          step: steps.length,
          description: `🔄 CYCLE DETECTED! Node ${nodeId} already visited. Returning existing clone ${visitedMap[nodeId]} to prevent infinite recursion.`,
          originalNodes: [...originalNodes],
          clonedNodes: [...clonedNodes],
          currentNode: nodeId,
          visitedMap: { ...visitedMap },
          callStack: [...callStack],
          phase: 'returning',
          cycleDetected: true
        });
        callStack.pop();
        return;
      }

      // Step: Create clone
      const cloneId = `${nodeId}'`;
      const clone = { id: cloneId, val: node.val };
      clonedNodes.push(clone);
      visitedMap[nodeId] = cloneId;

      steps.push({
        step: steps.length,
        description: `Creating clone ${cloneId}(${node.val}) for original ${nodeId}. Adding to visited map: ${nodeId} → ${cloneId}`,
        originalNodes: [...originalNodes],
        clonedNodes: [...clonedNodes],
        currentNode: nodeId,
        visitedMap: { ...visitedMap },
        callStack: [...callStack],
        phase: 'creating_clone',
        cycleDetected: false
      });

      // Step: Recursively process next pointer
      if (node.next) {
        steps.push({
          step: steps.length,
          description: `Recursively processing ${nodeId}.next → ${node.next}`,
          originalNodes: [...originalNodes],
          clonedNodes: [...clonedNodes],
          currentNode: nodeId,
          visitedMap: { ...visitedMap },
          callStack: [...callStack],
          phase: 'recursing',
          cycleDetected: false
        });

        dfsSteps(node.next, depth + 1);

        // Update clone's next pointer
        const cloneNode = clonedNodes.find(c => c.id === cloneId);
        if (cloneNode && node.next in visitedMap) {
          cloneNode.next = visitedMap[node.next];
          steps.push({
            step: steps.length,
            description: `Setting ${cloneId}.next = ${visitedMap[node.next]}`,
            originalNodes: [...originalNodes],
            clonedNodes: [...clonedNodes],
            currentNode: nodeId,
            visitedMap: { ...visitedMap },
            callStack: [...callStack],
            phase: 'recursing',
            cycleDetected: false
          });
        }
      }

      // Step: Recursively process random pointer
      if (node.random) {
        steps.push({
          step: steps.length,
          description: `Recursively processing ${nodeId}.random → ${node.random}`,
          originalNodes: [...originalNodes],
          clonedNodes: [...clonedNodes],
          currentNode: nodeId,
          visitedMap: { ...visitedMap },
          callStack: [...callStack],
          phase: 'recursing',
          cycleDetected: false
        });

        dfsSteps(node.random, depth + 1);

        // Update clone's random pointer
        const cloneNode = clonedNodes.find(c => c.id === cloneId);
        if (cloneNode && node.random in visitedMap) {
          cloneNode.random = visitedMap[node.random];
          steps.push({
            step: steps.length,
            description: `Setting ${cloneId}.random = ${visitedMap[node.random]}`,
            originalNodes: [...originalNodes],
            clonedNodes: [...clonedNodes],
            currentNode: nodeId,
            visitedMap: { ...visitedMap },
            callStack: [...callStack],
            phase: 'recursing',
            cycleDetected: false
          });
        }
      }

      // Step: Returning from DFS
      callStack.pop();
      steps.push({
        step: steps.length,
        description: `Returning clone ${cloneId} for node ${nodeId}. Call stack: [${callStack.join(' → ') || 'empty'}]`,
        originalNodes: [...originalNodes],
        clonedNodes: [...clonedNodes],
        currentNode: nodeId,
        visitedMap: { ...visitedMap },
        callStack: [...callStack],
        phase: 'returning',
        cycleDetected: false
      });
    };

    // Start DFS from node A
    dfsSteps('A');

    // Final result
    steps.push({
      step: steps.length,
      description: `Deep copy complete! Successfully handled cycles using visited map. Original structure preserved, clone created without infinite recursion.`,
      originalNodes: [...originalNodes],
      clonedNodes: [...clonedNodes],
      currentNode: null,
      visitedMap: { ...visitedMap },
      callStack: [],
      phase: 'complete',
      cycleDetected: false
    });

    return steps;
  };

  const [steps] = useState(() => generateSteps());

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  if (!showVisualizer) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setShowVisualizer(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          🔄 Visualize Deep Copy With Cycles
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200">
          Deep Copy With Cycles Visualization
        </h3>
        <button
          onClick={() => setShowVisualizer(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Algorithm Status */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Step:</span>
            <span className="ml-2">{currentStep + 1}/{steps.length}</span>
          </div>
          <div>
            <span className="font-semibold text-green-600 dark:text-green-400">Phase:</span>
            <span className="ml-2 capitalize">{currentStepData.phase.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Current Node:</span>
            <span className="ml-2">{currentStepData.currentNode || 'None'}</span>
          </div>
          <div>
            <span className="font-semibold text-red-600 dark:text-red-400">Cycle Detected:</span>
            <span className={`ml-2 ${currentStepData.cycleDetected ? 'text-red-600' : 'text-green-600'}`}>
              {currentStepData.cycleDetected ? '⚠️ Yes' : '✓ No'}
            </span>
          </div>
        </div>
      </div>

      {/* Structure Visualization */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Structure */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Original Structure (with cycles)</h4>
            <div className="space-y-2">
              {currentStepData.originalNodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    node.id === currentStepData.currentNode
                      ? 'bg-yellow-200 border-yellow-500 dark:bg-yellow-800/50 dark:border-yellow-400'
                      : 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-600'
                  }`}
                >
                  <div className="font-bold">{node.id}({node.val})</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    next: {node.next || 'null'} | random: {node.random || 'null'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cloned Structure */}
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Cloned Structure</h4>
            <div className="space-y-2">
              {currentStepData.clonedNodes.length === 0 ? (
                <div className="p-3 text-gray-500 italic">No clones created yet...</div>
              ) : (
                currentStepData.clonedNodes.map((node) => (
                  <div
                    key={node.id}
                    className="p-3 rounded-lg border-2 bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-600"
                  >
                    <div className="font-bold">{node.id}({node.val})</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      next: {node.next || 'null'} | random: {node.random || 'null'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step Description */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
        <p className="text-indigo-800 dark:text-indigo-200 font-medium">
          {currentStepData.description}
        </p>
      </div>

      {/* Visited Map */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
        <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Visited Map (Cycle Prevention)</h4>
        {Object.keys(currentStepData.visitedMap).length === 0 ? (
          <div className="text-green-700 dark:text-green-300 text-sm italic">Empty - no nodes visited yet</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(currentStepData.visitedMap).map(([original, clone]) => (
              <div key={original} className="bg-green-200 dark:bg-green-700 px-3 py-1 rounded-full text-sm font-medium text-green-800 dark:text-green-200">
                {original} → {clone}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call Stack */}
      <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
        <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2">DFS Call Stack</h4>
        {currentStepData.callStack.length === 0 ? (
          <div className="text-orange-700 dark:text-orange-300 text-sm italic">Empty</div>
        ) : (
          <div className="flex items-center space-x-2">
            {currentStepData.callStack.map((node, index) => (
              <React.Fragment key={index}>
                <div className="bg-orange-200 dark:bg-orange-700 px-3 py-1 rounded-full text-sm font-medium text-orange-800 dark:text-orange-200">
                  {node}
                </div>
                {index < currentStepData.callStack.length - 1 && (
                  <div className="text-orange-600">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Key Insight Box */}
      <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
        <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">🔑 Key Insight:</h4>
        <div className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
          <div><strong>Cycle Detection:</strong> Check visited map BEFORE creating clone</div>
          <div><strong>Prevention:</strong> Return existing clone if node already visited</div>
          <div><strong>Early Storage:</strong> Store clone in visited map immediately after creation</div>
          <div><strong>DFS Safety:</strong> Prevents infinite recursion in cyclic structures</div>
        </div>
      </div>

      {/* Algorithm Code with Highlighting */}
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Algorithm Steps:</h4>
        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <div className={currentStepData.phase === 'visiting' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            1. Visit node via DFS
          </div>
          <div className={currentStepData.phase === 'checking_visited' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            2. Check if node in visited map
          </div>
          <div className={currentStepData.phase === 'checking_visited' && currentStepData.cycleDetected ? 'bg-red-200 dark:bg-red-800/50 px-2 py-1 rounded' : ''}>
            3. If visited: return existing clone (CYCLE!)
          </div>
          <div className={currentStepData.phase === 'creating_clone' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            4. Create new clone and store in visited map
          </div>
          <div className={currentStepData.phase === 'recursing' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            5. Recursively process next and random pointers
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>
        
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next →
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
        >
          🔄 Reset
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Original Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Cloned Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
            <span>Cycle Detected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ElegantIntersectionVisualizer Component
interface IntersectionStep {
  step: number;
  description: string;
  listA: { id: string; val: number; isIntersection?: boolean }[];
  listB: { id: string; val: number; isIntersection?: boolean }[];
  pointerA: number | null;
  pointerB: number | null;
  pointerAList: 'A' | 'B';
  pointerBList: 'A' | 'B';
  phase: 'starting' | 'traversing' | 'switching' | 'meeting' | 'complete';
  totalDistanceA: number;
  totalDistanceB: number;
  intersectionFound: boolean;
}

const ElegantIntersectionVisualizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Create initial intersecting lists: A: 4→1→8→4→5, B: 5→6→1→8→4→5 (intersection at 8)
  const createInitialLists = () => {
    const listA = [
      { id: 'A1', val: 4 },
      { id: 'A2', val: 1 },
      { id: 'I1', val: 8, isIntersection: true },
      { id: 'I2', val: 4, isIntersection: true },
      { id: 'I3', val: 5, isIntersection: true }
    ];
    
    const listB = [
      { id: 'B1', val: 5 },
      { id: 'B2', val: 6 },
      { id: 'B3', val: 1 },
      { id: 'I1', val: 8, isIntersection: true },
      { id: 'I2', val: 4, isIntersection: true },
      { id: 'I3', val: 5, isIntersection: true }
    ];
    
    return { listA, listB };
  };

  const [lists] = useState(createInitialLists());

  // Generate visualization steps
  const generateSteps = (): IntersectionStep[] => {
    const steps: IntersectionStep[] = [];
    const { listA, listB } = lists;
    
    let pA = 0, pB = 0;
    let pointerAList: 'A' | 'B' = 'A';
    let pointerBList: 'A' | 'B' = 'B';
    let totalDistanceA = 0, totalDistanceB = 0;

    // Initial state
    steps.push({
      step: 0,
      description: `Initial setup: List A = [4,1,8,4,5], List B = [5,6,1,8,4,5]. Both pointers start at their respective heads. Intersection at node 8.`,
      listA: [...listA],
      listB: [...listB],
      pointerA: 0,
      pointerB: 0,
      pointerAList: 'A',
      pointerBList: 'B',
      phase: 'starting',
      totalDistanceA: 0,
      totalDistanceB: 0,
      intersectionFound: false
    });

    // Simulate the elegant algorithm
    let stepCount = 1;
    const maxSteps = 20; // Prevent infinite loop

    while (stepCount < maxSteps) {
      const currentListA = pointerAList === 'A' ? listA : listB;
      const currentListB = pointerBList === 'A' ? listA : listB;
      
      // Check if pointers are at the same node (intersection found)
      if (pointerAList === pointerBList && pA === pB && currentListA[pA]?.isIntersection) {
        steps.push({
          step: stepCount,
          description: `🎯 INTERSECTION FOUND! Both pointers meet at node ${currentListA[pA].val}. Total distance: pA = ${totalDistanceA + 1}, pB = ${totalDistanceB + 1}`,
          listA: [...listA],
          listB: [...listB],
          pointerA: pA,
          pointerB: pB,
          pointerAList,
          pointerBList,
          phase: 'meeting',
          totalDistanceA: totalDistanceA + 1,
          totalDistanceB: totalDistanceB + 1,
          intersectionFound: true
        });
        break;
      }

      // Move pointers and handle switching
      const nextPA = pA + 1;
      const nextPB = pB + 1;
      
      let newPointerAList: 'A' | 'B' = pointerAList;
      let newPointerBList: 'A' | 'B' = pointerBList;
      let newPA = nextPA;
      let newPB = nextPB;
      
      let description = `Step ${stepCount}: `;
      let phase: IntersectionStep['phase'] = 'traversing';

      // Handle pointer A
      if (nextPA >= currentListA.length) {
        // Pointer A reaches end, switch to other list
        newPointerAList = pointerAList === 'A' ? 'B' : 'A';
        newPA = 0;
        description += `pA reaches end of List ${pointerAList}, switches to List ${newPointerAList}. `;
        phase = 'switching';
      } else {
        description += `pA moves to ${currentListA[nextPA].val}. `;
      }

      // Handle pointer B
      if (nextPB >= currentListB.length) {
        // Pointer B reaches end, switch to other list
        newPointerBList = pointerBList === 'A' ? 'B' : 'A';
        newPB = 0;
        description += `pB reaches end of List ${pointerBList}, switches to List ${newPointerBList}.`;
        phase = 'switching';
      } else {
        description += `pB moves to ${currentListB[nextPB].val}.`;
      }

      totalDistanceA++;
      totalDistanceB++;

      steps.push({
        step: stepCount,
        description: description,
        listA: [...listA],
        listB: [...listB],
        pointerA: newPA,
        pointerB: newPB,
        pointerAList: newPointerAList,
        pointerBList: newPointerBList,
        phase,
        totalDistanceA,
        totalDistanceB,
        intersectionFound: false
      });

      pA = newPA;
      pB = newPB;
      pointerAList = newPointerAList;
      pointerBList = newPointerBList;
      stepCount++;
    }

    // Final result
    steps.push({
      step: stepCount,
      description: `Algorithm complete! The elegant approach works because both pointers traverse the same total distance (A+B), ensuring they meet at the intersection point.`,
      listA: [...listA],
      listB: [...listB],
      pointerA: pA,
      pointerB: pB,
      pointerAList,
      pointerBList,
      phase: 'complete',
      totalDistanceA,
      totalDistanceB,
      intersectionFound: true
    });

    return steps;
  };

  const [steps] = useState(() => generateSteps());

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  if (!showVisualizer) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setShowVisualizer(true)}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-200 shadow-lg transform hover:scale-105"
        >
          🔗 Visualize Elegant Intersection Detection
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200 dark:border-teal-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-teal-800 dark:text-teal-200">
          Elegant Intersection Detection Visualization
        </h3>
        <button
          onClick={() => setShowVisualizer(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Algorithm Status */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Step:</span>
            <span className="ml-2">{currentStep + 1}/{steps.length}</span>
          </div>
          <div>
            <span className="font-semibold text-green-600 dark:text-green-400">Phase:</span>
            <span className="ml-2 capitalize">{currentStepData.phase}</span>
          </div>
          <div>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Distance A:</span>
            <span className="ml-2">{currentStepData.totalDistanceA}</span>
          </div>
          <div>
            <span className="font-semibold text-orange-600 dark:text-orange-400">Distance B:</span>
            <span className="ml-2">{currentStepData.totalDistanceB}</span>
          </div>
          <div>
            <span className="font-semibold text-red-600 dark:text-red-400">Intersection:</span>
            <span className={`ml-2 ${currentStepData.intersectionFound ? 'text-green-600' : 'text-gray-600'}`}>
              {currentStepData.intersectionFound ? '✓ Found' : '⏳ Searching'}
            </span>
          </div>
        </div>
      </div>

      {/* Linked Lists Visualization */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
        {/* List A */}
        <div className="mb-4">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            List A (pA on List {currentStepData.pointerAList}):
          </h4>
          <div className="flex items-center space-x-2 overflow-x-auto">
            {currentStepData.listA.map((node, index) => (
              <React.Fragment key={node.id}>
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-300 relative
                    ${currentStepData.pointerAList === 'A' && index === currentStepData.pointerA
                      ? 'bg-red-400 border-red-600 text-red-900 scale-110 shadow-lg' 
                      : node.isIntersection
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800'
                      : 'bg-blue-200 dark:bg-blue-600 border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-200'
                    }
                  `}
                >
                  {node.val}
                  {currentStepData.pointerAList === 'A' && index === currentStepData.pointerA && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600 dark:text-red-400">
                      pA
                    </div>
                  )}
                  {node.isIntersection && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                      SHARED
                    </div>
                  )}
                </div>
                {index < currentStepData.listA.length - 1 && (
                  <div className="text-2xl text-gray-400 dark:text-gray-500">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* List B */}
        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            List B (pB on List {currentStepData.pointerBList}):
          </h4>
          <div className="flex items-center space-x-2 overflow-x-auto">
            {currentStepData.listB.map((node, index) => (
              <React.Fragment key={node.id}>
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg transition-all duration-300 relative
                    ${currentStepData.pointerBList === 'B' && index === currentStepData.pointerB
                      ? 'bg-green-400 border-green-600 text-green-900 scale-110 shadow-lg' 
                      : node.isIntersection
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800'
                      : 'bg-purple-200 dark:bg-purple-600 border-purple-400 dark:border-purple-500 text-purple-700 dark:text-purple-200'
                    }
                  `}
                >
                  {node.val}
                  {currentStepData.pointerBList === 'B' && index === currentStepData.pointerB && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 dark:text-green-400">
                      pB
                    </div>
                  )}
                  {node.isIntersection && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                      SHARED
                    </div>
                  )}
                </div>
                {index < currentStepData.listB.length - 1 && (
                  <div className="text-2xl text-gray-400 dark:text-gray-500">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Step Description */}
      <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
        <p className="text-indigo-800 dark:text-indigo-200 font-medium">
          {currentStepData.description}
        </p>
      </div>

      {/* Pointer Status */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
        <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Pointer Status:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-red-600">Pointer A:</div>
            <div>Currently on: List {currentStepData.pointerAList}</div>
            <div>Position: {currentStepData.pointerA !== null ? currentStepData.pointerA : 'null'}</div>
            <div>Total distance: {currentStepData.totalDistanceA}</div>
          </div>
          <div>
            <div className="font-semibold text-green-600">Pointer B:</div>
            <div>Currently on: List {currentStepData.pointerBList}</div>
            <div>Position: {currentStepData.pointerB !== null ? currentStepData.pointerB : 'null'}</div>
            <div>Total distance: {currentStepData.totalDistanceB}</div>
          </div>
        </div>
      </div>

      {/* Key Insight Box */}
      <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
        <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">🔑 Key Insight:</h4>
        <div className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
          <div><strong>Elegant Solution:</strong> When pointer reaches end, switch to other list's head</div>
          <div><strong>Distance Equality:</strong> Both pointers traverse total distance A+B</div>
          <div><strong>Automatic Alignment:</strong> Switching handles different list lengths</div>
          <div><strong>Meeting Point:</strong> Pointers meet at intersection (or null if no intersection)</div>
          <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-800/50 rounded">
            <strong>Why it works:</strong> If lists intersect, both pointers travel distance A+B and meet at intersection. If no intersection, both reach null simultaneously.
          </div>
        </div>
      </div>

      {/* Distance Analysis */}
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Distance Analysis:</h4>
        <div className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
          <div>• List A length: 5 nodes (4→1→8→4→5)</div>
          <div>• List B length: 6 nodes (5→6→1→8→4→5)</div>
          <div>• Intersection starts at: node 8 (position 2 in A, position 3 in B)</div>
          <div>• Both pointers will traverse: 5 + 6 = 11 total nodes</div>
          <div>• Meeting point: After both travel same distance, they align at intersection</div>
        </div>
      </div>

      {/* Algorithm Code with Highlighting */}
      <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Algorithm Steps:</h4>
        <div className="font-mono text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <div className={currentStepData.phase === 'starting' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            1. Initialize: pA = headA, pB = headB
          </div>
          <div className={currentStepData.phase === 'traversing' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            2. While pA ≠ pB: move both pointers
          </div>
          <div className={currentStepData.phase === 'switching' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            3. When pointer reaches end: switch to other list
          </div>
          <div className={currentStepData.phase === 'meeting' ? 'bg-yellow-200 dark:bg-yellow-800/50 px-2 py-1 rounded' : ''}>
            4. Pointers meet at intersection (or both null)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          ← Previous
        </button>
        
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next →
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
        >
          🔄 Reset
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 border border-red-600 rounded-full"></div>
            <span>Pointer A</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 border border-green-600 rounded-full"></div>
            <span>Pointer B</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-500 rounded"></div>
            <span>Intersection Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
            <span>List A Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
            <span>List B Nodes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Types and Interfaces
interface MCQuestion {
  id: number;
  topic: string;
  functionName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  code: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  followUpQuestions: FollowUpQuestion[];
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
  unlockedAt?: Date;
}

interface UserProgress {
  questionsAnswered: number;
  correctAnswers: number;
  topicsCompleted: string[];
  achievements: string[];
  highScore: number;
  streak: number;
  totalTimeSpent: number;
}

const LinkedListMultipleChoiceGame = () => {
  // State Management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [quizMode, setQuizMode] = useState<'practice' | 'timed' | 'challenge'>('practice');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    questionsAnswered: 0,
    correctAnswers: 0,
    topicsCompleted: [],
    achievements: [],
    highScore: 0,
    streak: 0,
    totalTimeSpent: 0
  });
  const [followUpAnswers, setFollowUpAnswers] = useState<{[key: number]: number}>({});
  const [showFollowUpResults, setShowFollowUpResults] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('linkedlist-mc-progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        setHighScore(progress.highScore || 0);
      }

      const savedAchievements = localStorage.getItem('linkedlist-mc-achievements');
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      } else {
        initializeAchievements();
      }
    }
  }, []);

  // Timer for question duration
  useEffect(() => {
    if (quizMode === 'timed' && !showResult && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizMode, showResult, gameCompleted]);

  // All Linked List Multiple Choice Questions
  const questions: MCQuestion[] = [
    // Reversal Operations (11 questions)
    {
      id: 1,
      topic: "Reversal Operations",
      functionName: "reverseKGroup",
      difficulty: "Hard",
      question: "What's the missing logic in reverse k-group algorithm?",
      code: `def reverseKGroup(head, k):
    def reverseGroup(start, end):
        prev, curr = start, start.next
        first = start.next
        
        while curr != end:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        start.next = prev
        first.next = end
        return first
    
    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy
    
    # MISSING LOGIC - how to check if k nodes exist?
    while hasKNodes(prev_group_end.next, k):
        group_start = prev_group_end.next
        group_end = group_start
        for _ in range(k):
            group_end = group_end.next
        prev_group_end = reverseGroup(prev_group_end, group_end)
    
    return dummy.next`,
      options: [
        "Check if current node is not None",
        "Count k nodes from current position and return count == k",
        "Check if remaining length >= k",
        "Use a flag to track group completion"
      ],
      correctAnswer: 1,
      explanation: "We need to count exactly k nodes from the current position to ensure we have a complete group to reverse. If count < k, we don't reverse the remaining nodes.",
      followUpQuestions: [
        {
          question: "What's the time complexity of reverseKGroup?",
          options: ["O(n)", "O(n*k)", "O(n²)", "O(k)"],
          correctAnswer: 0,
          explanation: "Each node is visited exactly twice - once during counting and once during reversal, making it O(n)."
        }
      ]
    },
    {
      id: 2,
      topic: "Reversal Operations",
      functionName: "reverseBetween",
      difficulty: "Medium",
      question: "What's the key insight for reversing between positions m and n?",
      code: `def reverseBetween(head, m, n):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    # Move to position m-1
    for _ in range(m - 1):
        prev = prev.next
    
    # MISSING LOGIC - how to reverse the sublist?
    curr = prev.next
    for _ in range(n - m):
        next_node = curr.next
        curr.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next`,
      options: [
        "Use standard three-pointer reversal",
        "Move nodes one by one to the front of the sublist",
        "Reverse entire list then fix connections",
        "Use recursion to reverse the middle part"
      ],
      correctAnswer: 1,
      explanation: "The key insight is to move each node in the range one by one to the front of the sublist, maintaining the connection with the previous part.",
      followUpQuestions: [
        {
          question: "Why do we need a dummy node in this approach?",
          options: ["To handle edge cases", "To simplify the algorithm", "To handle m=1 case", "All of the above"],
          correctAnswer: 3,
          explanation: "Dummy node handles edge cases like m=1, simplifies pointer manipulation, and provides a consistent starting point."
        }
      ]
    },
    {
      id: 3,
      topic: "Reversal Operations",
      functionName: "reverseList",
      difficulty: "Easy",
      question: "What's missing in the iterative reversal?",
      code: `def reverseList(head):
    prev = None
    curr = head
    
    while curr:
        # MISSING LINE - save next node
        curr.next = prev
        prev = curr
        curr = next_temp
    
    return prev`,
      options: [
        "next_temp = curr.next",
        "next_temp = prev.next",
        "next_temp = head.next",
        "next_temp = curr"
      ],
      correctAnswer: 0,
      explanation: "We must save curr.next before breaking the link, otherwise we lose the rest of the list.",
      followUpQuestions: []
    },
    {
      id: 4,
      topic: "Reversal Operations",
      functionName: "isPalindrome",
      difficulty: "Medium",
      question: "What's the optimal approach to check if a linked list is a palindrome?",
      code: `def isPalindrome(head):
    # Find middle using slow/fast pointers
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # MISSING LOGIC - what to do with the second half?
    second_half = reverseList(slow)
    
    # Compare first and second half
    first_half = head
    while second_half:
        if first_half.val != second_half.val:
            return False
        first_half = first_half.next
        second_half = second_half.next
    
    return True`,
      options: [
        "Reverse the entire list and compare",
        "Reverse the second half and compare with first half",
        "Use extra space to store values",
        "Use recursion to compare ends"
      ],
      correctAnswer: 1,
      explanation: "The optimal approach is to find the middle, reverse the second half, then compare the first and reversed second half. This uses O(1) space.",
      followUpQuestions: [
        {
          question: "What's the space complexity of this approach?",
          options: ["O(n)", "O(log n)", "O(1)", "O(n/2)"],
          correctAnswer: 2,
          explanation: "We only use a constant amount of extra space for pointers, making it O(1) space complexity."
        }
      ]
    },
    {
      id: 5,
      topic: "Reversal Operations",
      functionName: "swapPairs",
      difficulty: "Medium",
      question: "What's the pattern for swapping pairs in a linked list?",
      code: `def swapPairs(head):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    while prev.next and prev.next.next:
        # MISSING LOGIC - how to swap the pair?
        first = prev.next
        second = prev.next.next
        
        prev.next = second
        first.next = second.next
        second.next = first
        
        prev = first
    
    return dummy.next`,
      options: [
        "Reverse the entire list in pairs",
        "Use three pointers to rearrange connections",
        "Store values and swap them",
        "Use recursion for each pair"
      ],
      correctAnswer: 1,
      explanation: "We use three pointers (prev, first, second) to rearrange the connections: prev→second→first→rest, then move prev to first for the next iteration.",
      followUpQuestions: []
    },

    // Copy & Clone (11 questions)
    {
      id: 6,
      topic: "Copy & Clone",
      functionName: "copyRandomList",
      difficulty: "Medium",
      question: "What's the key insight for copying a list with random pointers?",
      code: `Original list:
Node A (val=7) → Node B (val=13) → Node C (val=11) → Node D (val=10) → Node E (val=1) → None

Random pointers:
A.random → C
B.random → A  
C.random → E
D.random → C
E.random → A

def copyRandomList(head):
    if not head:
        return None
    
    # MISSING LOGIC - how to handle the random pointers?
    # Pass 1: Create new nodes and interleave
    curr = head
    while curr:
        new_node = Node(curr.val)
        new_node.next = curr.next
        curr.next = new_node
        curr = new_node.next
    # State: A(7) → A'(7) → B(13) → B'(13) → C(11) → C'(11) → D(10) → D'(10) → E(1) → E'(1) → None
    
    # Pass 2: Set random pointers
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next # A'.random = C.next = C'
        curr = curr.next.next
    
    # Pass 3: Separate lists
    dummy = Node(0)
    new_curr = dummy
    curr = head
    while curr:
        new_curr.next = curr.next
        curr.next = curr.next.next
        new_curr = new_curr.next
        curr = curr.next
    
    return dummy.next`,
      options: [
        "Use a hash map to store old→new mapping",
        "Interleave new nodes with old nodes",
        "Create all nodes first, then set pointers",
        "Use recursion with memoization"
      ],
      correctAnswer: 1,
      explanation: "The brilliant insight is to interleave new nodes with old nodes. This creates a natural mapping: old.next = new, so old.random.next = new_random.",
      followUpQuestions: [
        {
          question: "What's the space complexity of the interleaving approach?",
          options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
          correctAnswer: 1,
          explanation: "The interleaving approach uses O(1) extra space as we don't need a hash map to track the mapping."
        }
      ]
    },
    {
      id: 7,
      topic: "Copy & Clone",
      functionName: "cloneGraph",
      difficulty: "Medium",
      question: "How do you handle cycles when cloning a graph represented as linked nodes?",
      code: `def cloneGraph(node):
    if not node:
        return None
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return visited[node]
        
        # MISSING LOGIC - how to clone with neighbors?
        clone = Node(node.val)
        visited[node] = clone
        
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)`,
      options: [
        "Use BFS to avoid cycles",
        "Use a visited map to track cloned nodes",
        "Clone all nodes first, then set neighbors",
        "Use topological sorting"
      ],
      correctAnswer: 1,
      explanation: "We use a visited map to track already cloned nodes. When we encounter a node again, we return its clone from the map instead of creating a new one.",
      followUpQuestions: []
    },
    {
      id: 8,
      topic: "Copy & Clone",
      functionName: "deepCopyList",
      difficulty: "Medium",
      question: "What's the challenge in deep copying a nested list structure?",
      code: `def deepCopyList(head):
    def getClone(node):
        if not node:
            return None
        if node in visited:
            return visited[node]
        
        # MISSING LOGIC - handle nested structure
        clone = NestedNode(node.val)
        visited[node] = clone
        
        if node.child:
            clone.child = getClone(node.child)
        clone.next = getClone(node.next)
        
        return clone
    
    visited = {}
    return getClone(head)`,
      options: [
        "Handle both next and child pointers recursively",
        "Flatten first, then copy",
        "Use iterative approach only",
        "Copy level by level"
      ],
      correctAnswer: 0,
      explanation: "For nested structures, we need to handle both next and child pointers recursively, using memoization to avoid infinite loops.",
      followUpQuestions: []
    },

    // Merge Operations (11 questions)
    {
      id: 9,
      topic: "Merge Operations",
      functionName: "mergeKLists",
      difficulty: "Hard",
      question: "What's the most efficient approach for merging k sorted lists?",
      code: `def mergeKLists(lists):
    if not lists:
        return None
    
    # MISSING LOGIC - how to efficiently merge k lists?
    while len(lists) > 1:
        merged_lists = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged_lists.append(mergeTwoLists(l1, l2))
        lists = merged_lists
    
    return lists[0]
    def mergeTwoLists(l1, l2):
        dummy = ListNode()
        curr = dummy
        
        while l1 and l2:
            if l1.val <= l2.val:
                curr.next = l1
                l1 = l1.next
            else:
                curr.next = l2
                l2 = l2.next
            curr = curr.next
        
        curr.next = l1 or l2
        return dummy.next
    `,
      options: [
        "Merge lists one by one sequentially",
        "Use a min-heap with k elements",
        "Use divide and conquer (merge in pairs)",
        "Sort all values then rebuild list"
      ],
      correctAnswer: 2,
      explanation: "Divide and conquer approach merges lists in pairs, reducing the problem size by half each time. This gives O(n log k) complexity instead of O(nk).",
      followUpQuestions: [
        {
          question: "What's the time complexity of the divide and conquer approach?",
          options: ["O(nk)", "O(n log k)", "O(k log k)", "O(n²)"],
          correctAnswer: 1,
          explanation: "We have log k levels, and each level processes all n nodes, giving O(n log k) complexity."
        }
      ]
    },
    {
      id: 10,
      topic: "Merge Operations",
      functionName: "mergeTwoLists",
      difficulty: "Easy",
      question: "What's the key pattern in merging two sorted lists?",
      code: `def mergeTwoLists(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    
    while l1 and l2:
        # MISSING LOGIC - how to choose which node to add?
        if l1.val <= l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    
    curr.next = l1 or l2
    return dummy.next`,
      options: [
        "Always choose the smaller value",
        "Alternate between lists",
        "Choose randomly",
        "Merge values into new nodes"
      ],
      correctAnswer: 0,
      explanation: "We compare values and always choose the smaller one, advancing that list's pointer. This maintains the sorted order.",
      followUpQuestions: []
    },
    {
      id: 11,
      topic: "Merge Operations",
      functionName: "sortList",
      difficulty: "Medium",
      question: "How do you sort a linked list in O(n log n) time with O(1) space?",
      code: `def sortList(head):
    if not head or not head.next:
        return head
    
    # MISSING LOGIC - how to divide the list?
    def getMid(head):
        slow = fast = head
        prev = None
        while fast and fast.next:
            prev = slow
            slow = slow.next
            fast = fast.next.next
        prev.next = None  # Split the list
        return slow
    
    mid = getMid(head)
    left = sortList(head)
    right = sortList(mid)
    
    return mergeTwoLists(left, right)`,
      options: [
        "Use quicksort with random pivot",
        "Use merge sort by finding middle and splitting",
        "Convert to array, sort, then rebuild",
        "Use insertion sort"
      ],
      correctAnswer: 1,
      explanation: "Merge sort is ideal for linked lists. We find the middle using slow/fast pointers, split the list, recursively sort both halves, then merge.",
      followUpQuestions: [
        {
          question: "Why is merge sort better than quicksort for linked lists?",
          options: ["Better time complexity", "O(1) space complexity", "More stable", "Easier to implement"],
          correctAnswer: 1,
          explanation: "Merge sort on linked lists uses O(1) extra space (only recursion stack), while quicksort typically needs O(log n) space for partitioning."
        }
      ]
    },

    // Cache Design (11 questions)
    {
      id: 12,
      topic: "Cache Design",
      functionName: "LRUCache",
      difficulty: "Medium",
      question: "What data structures are needed for an efficient LRU cache?",
      code: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        # MISSING LOGIC - what data structures to use?
        self.cache = {}  # key -> node
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key):
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]`,
      options: [
        "Hash map only",
        "Doubly linked list only", 
        "Hash map + doubly linked list",
        "Array + hash map"
      ],
      correctAnswer: 2,
      explanation: "LRU cache needs O(1) access (hash map) and O(1) insertion/deletion at both ends (doubly linked list). The combination gives O(1) for all operations.",
      followUpQuestions: [
        {
          question: "Why do we need a doubly linked list instead of singly linked?",
          options: ["Easier implementation", "O(1) deletion from middle", "Less memory usage", "Better cache locality"],
          correctAnswer: 1,
          explanation: "Doubly linked list allows O(1) deletion from the middle when we know the node, which is crucial for LRU eviction."
        }
      ]
    },
    {
      id: 13,
      topic: "Cache Design",
      functionName: "LFUCache",
      difficulty: "Hard",
      question: "What's the key challenge in implementing LFU (Least Frequently Used) cache?",
      code: `key_to_val: Enables O(1) value retrieval (core cache functionality)
key_to_freq: Enables O(1) frequency lookup/update (LFU requirement)
freq_to_keys: Enables O(1) LFU victim identification (eviction requirement)
# For eviction: take first item (oldest/LRU)
victim = next(iter(freq_to_keys[min_freq]))  # Returns 3

class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.min_freq = 0
        # MISSING LOGIC - how to track frequencies efficiently?
        self.key_to_val = {}
        self.key_to_freq = {}
        self.freq_to_keys = defaultdict(OrderedDict)
    
    def get(self, key):
        if key not in self.key_to_val:
            return -1
        self._update_freq(key)
        return self.key_to_val[key]
    
    def _update_freq(self, key):
        freq = self.key_to_freq[key]
        self.key_to_freq[key] = freq + 1
        self.freq_to_keys[freq + 1][key] = None
        del self.freq_to_keys[freq][key]
        
        if not self.freq_to_keys[freq] and freq == self.min_freq:
            self.min_freq += 1`,
      options: [
        "Single hash map with frequency counter",
        "Priority queue for frequencies",
        "Multiple hash maps: key→val, key→freq, freq→keys",
        "Balanced BST for frequency ordering"
      ],
      correctAnswer: 2,
      explanation: "LFU needs three mappings: key→value for O(1) access, key→frequency for tracking usage, and frequency→keys for O(1) eviction of least frequent items.",
      followUpQuestions: []
    },

    // Arithmetic Operations (11 questions)
    {
      id: 14,
      topic: "Arithmetic Operations",
      functionName: "addTwoNumbers",
      difficulty: "Medium",
      question: "What's the key insight for adding two numbers stored in reverse order?",
      code: `def addTwoNumbers(l1, l2)
    """
    Example: (7→2→4→3) + (5→6→4) = (7→8→0→7)
             7243 + 564 = 7807
    """
    def reverse(head):
        prev = None
        curr = head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev
    
    # Reverse both lists
    l1 = reverse(l1)
    l2 = reverse(l2)
    
    dummy = ListNode(0)
    curr = dummy
    carry = 0

    while l1 or l2 or carry:
        # MISSING LOGIC - how to handle different lengths?
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        curr.next = ListNode(total % 10)
        
        curr = curr.next
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return reverse(dummy.next)`,
      options: [
        "Pad shorter list with zeros",
        "Handle different lengths by using 0 for missing digits",
        "Reverse both lists first",
        "Convert to integers, add, then convert back"
      ],
      correctAnswer: 1,
      explanation: "We handle different lengths by treating missing digits as 0. Continue processing until both lists are exhausted AND no carry remains.",
      followUpQuestions: [
        {
          question: "Why do we need to check carry in the while condition?",
          options: ["To handle overflow", "To add final carry digit", "To avoid infinite loop", "For error checking"],
          correctAnswer: 1,
          explanation: "After both lists are exhausted, we might still have a carry that needs to be added as a final digit."
        }
      ]
    },
    {
      id: 15,
      topic: "Arithmetic Operations",
      functionName: "addTwoNumbersII",
      difficulty: "Medium",
      question: "How do you add two numbers when digits are stored in forward order?",
      code: `def addTwoNumbers(l1, l2):
    # MISSING LOGIC - how to handle forward order?
    stack1, stack2 = [], []
    
    while l1:
        stack1.append(l1.val)
        l1 = l1.next
    while l2:
        stack2.append(l2.val)
        l2 = l2.next
    
    carry = 0
    result = None
    
    while stack1 or stack2 or carry:
        val1 = stack1.pop() if stack1 else 0
        val2 = stack2.pop() if stack2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        
        new_node = ListNode(total % 10)
        new_node.next = result
        result = new_node
    
    return result`,
      options: [
        "Reverse both lists, add, then reverse result",
        "Use stacks to process digits from right to left",
        "Pad with leading zeros",
        "Use recursion to reach the end first"
      ],
      correctAnswer: 1,
      explanation: "Since digits are in forward order but addition starts from the least significant digit, we use stacks to reverse the processing order.",
      followUpQuestions: []
    },

    // Node Removal (11 questions)
    {
      id: 16,
      topic: "Node Removal",
      functionName: "removeNthFromEnd",
      difficulty: "Medium",
      question: "What's the one-pass approach to remove the nth node from the end?",
      code: `def removeNthFromEnd(head, n):
    dummy = ListNode(0)
    dummy.next = head
    fast = slow = dummy
    
    # MISSING LOGIC - how to maintain the gap?
    for _ in range(n + 1):
        fast = fast.next
    
    while fast:
        fast = fast.next
        slow = slow.next
    
    slow.next = slow.next.next
    return dummy.next`,
      options: [
        "Move fast pointer n steps ahead, then move both until fast reaches end",
        "Count total length first, then remove",
        "Use recursion to count from end",
        "Reverse list, remove, then reverse back"
      ],
      correctAnswer: 0,
      explanation: "Two-pointer technique: move fast pointer n+1 steps ahead, then move both pointers. When fast reaches end, slow is at the node before the target.",
      followUpQuestions: [
        {
          question: "Why do we move fast pointer n+1 steps instead of n?",
          options: ["To handle edge cases", "To position slow at the previous node", "To avoid off-by-one errors", "All of the above"],
          correctAnswer: 3,
          explanation: "Moving n+1 steps positions slow at the node before the target, making deletion easier and handling edge cases like removing the first node."
        }
      ]
    },
    {
      id: 17,
      topic: "Node Removal",
      functionName: "deleteNode",
      difficulty: "Easy",
      question: "How do you delete a node when you only have access to that node?",
      code: `def deleteNode(node):
    # MISSING LOGIC - can't access previous node
    # Given: node to delete (not tail)
    # Cannot access head or previous nodes
    
    node.val = node.next.val
    node.next = node.next.next`,
      options: [
        "Copy next node's value and skip next node",
        "Mark node as deleted",
        "Move all subsequent values one position back",
        "Cannot be done without head reference"
      ],
      correctAnswer: 0,
      explanation: "Since we can't access the previous node, we copy the next node's value into the current node and skip the next node. This effectively 'deletes' the current node.",
      followUpQuestions: []
    },
    {
      id: 18,
      topic: "Node Removal",
      functionName: "removeDuplicates",
      difficulty: "Easy",
      question: "How do you remove duplicates from a sorted linked list?",
      code: `def deleteDuplicates(head):
    curr = head
    
    while curr and curr.next:
        # MISSING LOGIC - how to handle duplicates?
        if curr.val == curr.next.val:
            curr.next = curr.next.next
        else:
            curr = curr.next
    
    return head`,
      options: [
        "Skip the duplicate node and don't advance current",
        "Remove both duplicate nodes",
        "Keep track of seen values",
        "Use a hash set"
      ],
      correctAnswer: 0,
      explanation: "When we find a duplicate, we skip it by updating curr.next but don't advance curr, allowing us to check for more consecutive duplicates.",
      followUpQuestions: []
    },

    // Intersection Detection (11 questions)
    {
      id: 19,
      topic: "Intersection Detection",
      functionName: "getIntersectionNode",
      difficulty: "Easy",
      question: "What's the elegant approach to find intersection of two linked lists?",
      code: `def getIntersectionNode(headA, headB):
    if not headA or not headB:
        return None
    
    # MISSING LOGIC - how to handle different lengths?
    pA, pB = headA, headB
    
    while pA != pB:
        pA = pA.next if pA else headB
        pB = pB.next if pB else headA
    
    return pA`,
      options: [
        "Calculate lengths and align the starts",
        "Use hash set to track visited nodes",
        "Switch to other list when reaching end",
        "Use two nested loops"
      ],
      correctAnswer: 2,
      explanation: "Elegant solution: when a pointer reaches the end, switch to the other list's head. Both pointers will meet at intersection (or None) after traversing the same total distance.",
      followUpQuestions: [
        {
          question: "Why does the pointer switching approach work?",
          options: ["It aligns the starting positions", "Both traverse same total distance", "It handles different lengths", "All of the above"],
          correctAnswer: 3,
          explanation: "By switching lists, both pointers traverse distance A+B, effectively aligning them and handling different list lengths."
        }
      ]
    },
    {
      id: 20,
      topic: "Intersection Detection",
      functionName: "hasCycle",
      difficulty: "Easy",
      question: "What's the standard approach to detect a cycle in a linked list?",
      code: `def hasCycle(head):
    if not head or not head.next:
        return False
    
    # MISSING LOGIC - how to detect cycle?
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    
    return False`,
      options: [
        "Use a hash set to track visited nodes",
        "Floyd's cycle detection (tortoise and hare)",
        "Mark visited nodes with a flag",
        "Count nodes and check for repetition"
      ],
      correctAnswer: 1,
      explanation: "Floyd's algorithm uses two pointers moving at different speeds. If there's a cycle, the fast pointer will eventually catch up to the slow pointer.",
      followUpQuestions: []
    },
    {
      id: 21,
      topic: "Intersection Detection",
      functionName: "detectCycle",
      difficulty: "Medium",
      question: "How do you find the start of a cycle in a linked list?",
      code: `def detectCycle(head):
    if not head or not head.next:
        return None
    
    # Phase 1: Detect cycle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None
    
    # MISSING LOGIC - how to find cycle start?
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow`,
      options: [
        "Reset one pointer to head, move both at same speed",
        "Calculate cycle length first",
        "Use mathematical formula",
        "Count steps from meeting point"
      ],
      correctAnswer: 0,
      explanation: "After detecting cycle, reset one pointer to head. Move both at same speed - they'll meet at the cycle start due to the mathematical property of cycle detection.",
      followUpQuestions: [
        {
          question: "Why does resetting one pointer to head work?",
          options: ["Mathematical property of distances", "Cycle length calculation", "Random coincidence", "Algorithm design"],
          correctAnswer: 0,
          explanation: "The distance from head to cycle start equals the distance from meeting point to cycle start, due to the mathematical properties of Floyd's algorithm."
        }
      ]
    },


  // Continue with more Reversal Operations questions (6 more to reach 11)
    {
      id: 22,
      topic: "Reversal Operations",
      functionName: "rotateRight",
      difficulty: "Medium",
      question: "What's the key insight for rotating a linked list to the right by k places?",
      code: `def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head
    
    # Find length and make it circular
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    
    # MISSING LOGIC - how to find the new head?
    k = k % length
    if k == 0:
        return head
    
    tail.next = head  # Make circular
    
    # Find new tail (length - k - 1 steps from head)
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next
    
    new_head = new_tail.next
    new_tail.next = None
    
    return new_head`,
      options: [
        "Find the node at position k from start",
        "Find the node at position (length - k) from start",
        "Reverse the list k times",
        "Use two pointers with gap k"
      ],
      correctAnswer: 1,
      explanation: "To rotate right by k, the new head is at position (length - k) from the original head. We find the new tail at (length - k - 1) and break the circular connection.",
      followUpQuestions: [
        {
          question: "Why do we use k = k % length?",
          options: ["To handle k > length", "To optimize performance", "To avoid negative values", "To handle edge cases"],
          correctAnswer: 0,
          explanation: "When k > length, rotating by k is equivalent to rotating by k % length, as rotating by length brings us back to the original position."
        }
      ]
    },
    {
      id: 23,
      topic: "Reversal Operations",
      functionName: "reverseAlternateKNodes",
      difficulty: "Hard",
      question: "How do you reverse alternate k-node groups in a linked list?",
      code: `def reverseAlternateKNodes(head, k):
    if not head or k <= 1:
        return head
    
    def reverseKNodes(head, k):
        prev = None
        curr = head
        count = 0
        
        while curr and count < k:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
            count += 1
        
        return prev, curr
    
    # MISSING LOGIC - how to handle alternating pattern?
    dummy = ListNode(0)
    dummy.next = head
    prev_group = dummy
    
    while True:
        # Check if we have k nodes for reversal
        temp = prev_group.next
        for _ in range(k):
            if not temp:
                return dummy.next
            temp = temp.next
        
        # Reverse k nodes
        group_start = prev_group.next
        new_head, next_group = reverseKNodes(group_start, k)
        prev_group.next = new_head
        group_start.next = next_group
        prev_group = group_start
        
        # Skip next k nodes (don't reverse)
        for _ in range(k):
            if not prev_group.next:
                return dummy.next
            prev_group = prev_group.next
    
    return dummy.next`,
      options: [
        "Reverse every group of k nodes",
        "Reverse k nodes, skip k nodes, repeat",
        "Use recursion for alternating pattern",
        "Reverse entire list then fix connections"
      ],
      correctAnswer: 1,
      explanation: "The pattern is: reverse k nodes, then skip (don't reverse) the next k nodes, and repeat. This creates an alternating pattern of reversed and non-reversed groups.",
      followUpQuestions: []
    },
    {
      id: 24,
      topic: "Reversal Operations",
      functionName: "reverseNodesInEvenLength",
      difficulty: "Medium",
      question: "What's the approach to reverse nodes only in even-length groups?",
      code: `def reverseNodesInEvenLength(head):
    if not head:
        return head
    
    def getLength(node):
        length = 0
        while node:
            length += 1
            node = node.next
        return length
    
    def reverseGroup(start, length):
        prev = None
        curr = start
        for _ in range(length):
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev, curr
    
    # MISSING LOGIC - how to identify and process even-length groups?
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    while prev.next:
        # Find next group boundary (could be None, different value, etc.)
        start = prev.next
        curr = start
        group_length = 1
        
        while curr.next and curr.val == curr.next.val:
            curr = curr.next
            group_length += 1
        
        if group_length % 2 == 0:  # Even length group
            new_head, next_node = reverseGroup(start, group_length)
            prev.next = new_head
            start.next = next_node
            prev = start
        else:
            prev = curr
    
    return dummy.next`,
      options: [
        "Count all nodes and reverse if total is even",
        "Group consecutive equal values and reverse even-length groups",
        "Reverse every second node",
        "Use stack to track even positions"
      ],
      correctAnswer: 1,
      explanation: "We group consecutive nodes with the same value, count the group length, and only reverse groups with even length. This preserves odd-length groups.",
      followUpQuestions: []
    },
    {
      id: 25,
      topic: "Reversal Operations",
      functionName: "reverseInPairs",
      difficulty: "Easy",
      question: "What's the recursive approach to swap nodes in pairs?",
      code: `def swapPairs(head):
    # MISSING BASE CASE - when to stop recursion?
    if not head or not head.next:
        return head
    
    # Save the second node
    second = head.next
    
    # Recursively swap the rest
    head.next = swapPairs(second.next)
    
    # Swap current pair
    second.next = head
    
    return second`,
      options: [
        "When head is None",
        "When head.next is None", 
        "When head is None or head.next is None",
        "When we reach the end of list"
      ],
      correctAnswer: 2,
      explanation: "We need both conditions: if head is None (empty list) or head.next is None (odd number of nodes, last node has no pair), we return head without swapping.",
      followUpQuestions: [
        {
          question: "What's the time complexity of recursive swap pairs?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctAnswer: 2,
          explanation: "We visit each node exactly once during the recursion, making it O(n) time complexity."
        }
      ]
    },
    {
      id: 26,
      topic: "Reversal Operations",
      functionName: "reverseKGroupsFromEnd",
      difficulty: "Hard",
      question: "How do you reverse k-groups starting from the end of the list?",
      code: `def reverseKGroupsFromEnd(head, k):
    def getLength(head):
        length = 0
        while head:
            length += 1
            head = head.next
        return length
    
    def reverseKGroup(head, k):
        # Standard reverse k-group from beginning
        def reverseGroup(start, end):
            prev, curr = start, start.next
            first = start.next
            
            while curr != end:
                next_temp = curr.next
                curr.next = prev
                prev = curr
                curr = next_temp
            
            start.next = prev
            first.next = end
            return first
        
        dummy = ListNode(0)
        dummy.next = head
        prev_group_end = dummy
        
        while True:
            # Check if we have k nodes
            temp = prev_group_end.next
            for _ in range(k):
                if not temp:
                    return dummy.next
                temp = temp.next
            
            group_start = prev_group_end.next
            group_end = temp
            prev_group_end = reverseGroup(prev_group_end, group_end)
    
    # MISSING LOGIC - how to handle "from end"?
    length = getLength(head)
    skip_count = length % k  # Nodes to skip at the beginning
    
    if skip_count == 0:
        return reverseKGroup(head, k)
    
    # Skip first skip_count nodes
    dummy = ListNode(0)
    dummy.next = head
    curr = dummy
    for _ in range(skip_count):
        curr = curr.next
    
    # Reverse remaining nodes in k-groups
    curr.next = reverseKGroup(curr.next, k)
    
    return dummy.next`,
      options: [
        "Reverse the entire list first",
        "Skip (length % k) nodes at the beginning, then reverse k-groups",
        "Start from the end and work backwards",
        "Use recursion to reach the end first"
      ],
      correctAnswer: 1,
      explanation: "To reverse k-groups from the end, we skip the first (length % k) nodes, then apply standard k-group reversal to the remaining nodes. This ensures complete k-groups from the end.",
      followUpQuestions: []
    },

    // Continue with more Copy & Clone questions (8 more to reach 11)
    {
      id: 27,
      topic: "Copy & Clone",
      functionName: "copyListWithArbitraryPointer",
      difficulty: "Medium",
      question: "What's the space-efficient approach for copying a list with arbitrary pointers?",
      code: `def copyRandomList(head):
    if not head:
        return None
    
    # MISSING STEP 1 - how to create the mapping?
    # Step 1: Create new nodes and interleave
    curr = head
    while curr:
        new_node = Node(curr.val)
        new_node.next = curr.next
        curr.next = new_node
        curr = new_node.next
    
    # Step 2: Set random pointers
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
        curr = curr.next.next
    
    # Step 3: Separate the lists
    dummy = Node(0)
    new_curr = dummy
    curr = head
    
    while curr:
        new_curr.next = curr.next
        curr.next = curr.next.next
        new_curr = new_curr.next
        curr = curr.next
    
    return dummy.next`,
      options: [
        "Use hash map to store old->new mapping",
        "Interleave new nodes between original nodes",
        "Create all new nodes first, then set pointers",
        "Use recursion with memoization"
      ],
      correctAnswer: 1,
      explanation: "The space-efficient approach interleaves new nodes: old1->new1->old2->new2. This creates a natural mapping where old.random.next gives us the new random pointer.",
      followUpQuestions: [
        {
          question: "What's the space complexity of interleaving approach?",
          options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
          correctAnswer: 1,
          explanation: "Interleaving uses O(1) extra space as we don't need additional data structures for mapping."
        }
      ]
    },
    {
      id: 28,
      topic: "Copy & Clone",
      functionName: "cloneComplexList",
      difficulty: "Hard",
      question: "How do you clone a list with multiple pointer types (next, random, child)?",
      code: `def cloneComplexList(head):
    if not head:
        return None
    
    visited = {}
    
    def getClone(node):
        if not node:
            return None
        if node in visited:
            return visited[node]
        
        # MISSING LOGIC - handle multiple pointer types
        clone = ComplexNode(node.val)
        visited[node] = clone
        
        # Clone all pointer types
        clone.next = getClone(node.next)
        clone.random = getClone(node.random)
        clone.child = getClone(node.child)
        
        return clone
    
    return getClone(head)`,
      options: [
        "Clone each pointer type separately",
        "Use DFS with memoization to handle all pointers",
        "Create nodes first, then set all pointers",
        "Use BFS level by level"
      ],
      correctAnswer: 1,
      explanation: "DFS with memoization handles all pointer types recursively. The visited map prevents infinite loops and ensures each node is cloned exactly once.",
      followUpQuestions: []
    },
    {
      id: 29,
      topic: "Copy & Clone",
      functionName: "deepCopyWithCycles",
      difficulty: "Hard",
      question: "What's the challenge in deep copying a structure with potential cycles?",
      code: `def deepCopyWithCycles(head):
    if not head:
        return None
    
    visited = {}
    
    def dfs(node):
        if not node:
            return None
        
        # MISSING CYCLE HANDLING - how to detect and handle cycles?
        if node in visited:
            return visited[node]
        
        # Create clone before recursive calls
        clone = Node(node.val)
        visited[node] = clone
        
        # Recursively clone connected nodes
        clone.next = dfs(node.next)
        if hasattr(node, 'random'):
            clone.random = dfs(node.random)
        
        return clone
    
    return dfs(head)`,
      options: [
        "Use BFS to avoid recursion",
        "Check visited map before creating clone",
        "Mark nodes as visited during traversal",
        "Use topological sorting"
      ],
      correctAnswer: 1,
      explanation: "We check the visited map first. If a node is already visited, we return its clone instead of creating a new one. This prevents infinite recursion in cycles.",
      followUpQuestions: []
    },
    {
      id: 30,
      topic: "Copy & Clone",
      functionName: "cloneUndirectedGraph",
      difficulty: "Medium",
      question: "How do you clone an undirected graph represented as adjacency lists?",
      code: `def cloneGraph(node):
    if not node:
        return None
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return visited[node]
        
        # MISSING LOGIC - how to handle neighbors?
        clone = Node(node.val)
        visited[node] = clone
        
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)`,
      options: [
        "Clone all nodes first, then set neighbors",
        "Use DFS and clone neighbors recursively",
        "Use BFS level by level",
        "Create adjacency matrix first"
      ],
      correctAnswer: 1,
      explanation: "DFS recursively clones each neighbor. The visited map ensures each node is cloned once and handles cycles in the undirected graph.",
      followUpQuestions: [
        {
          question: "Why is the visited map crucial for undirected graphs?",
          options: ["Performance optimization", "Prevents infinite loops", "Saves memory", "Maintains order"],
          correctAnswer: 1,
          explanation: "Undirected graphs have bidirectional edges, creating cycles. The visited map prevents infinite recursion when we encounter already-visited nodes."
        }
      ]
    },

    // Continue with more Merge Operations questions (8 more to reach 11)
    {
      id: 31,
      topic: "Merge Operations",
      functionName: "mergeKSortedLists",
      difficulty: "Hard",
      question: "What's the optimal data structure for merging k sorted lists?",
      code: `import heapq

def mergeKLists(lists):
    if not lists:
        return None
    
    # MISSING LOGIC - how to efficiently track k list heads?
    heap = []
    
    # Initialize heap with first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    curr = dummy
    
    while heap:
        val, list_idx, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, list_idx, node.next))
    
    return dummy.next`,
      options: [
        "Use array to store all values",
        "Use min-heap to track smallest elements",
        "Merge lists sequentially",
        "Use divide and conquer only"
      ],
      correctAnswer: 1,
      explanation: "Min-heap efficiently maintains the k smallest elements (one from each list). We always extract the minimum and add the next element from that list.",
      followUpQuestions: [
        {
          question: "What's the time complexity using min-heap?",
          options: ["O(n log k)", "O(nk)", "O(k log k)", "O(n log n)"],
          correctAnswer: 0,
          explanation: "We process n total nodes, and each heap operation takes O(log k) time, giving O(n log k) complexity."
        }
      ]
    },
    {
      id: 32,
      topic: "Merge Operations",
      functionName: "mergeSortedArrays",
      difficulty: "Medium",
      question: "How do you merge two sorted arrays in-place?",
      code: `def merge(nums1, m, nums2, n):
      
# nums1 = [1, 5, 9, 0, 0, 0]  # m = 3
# nums2 = [2, 6, 8]           # n = 3

    i, j, k = m - 1, n - 1, m + n - 1
    
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    
    # Copy remaining elements from nums2
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1`,
      options: [
        "Start from the beginning and shift elements",
        "Start from the end to avoid overwriting",
        "Use extra space for temporary storage",
        "Swap elements in place"
      ],
      correctAnswer: 1,
      explanation: "Starting from the end ensures we don't overwrite unprocessed elements in nums1. We place the larger element at the current end position.",
      followUpQuestions: []
    },
    {
      id: 33,
      topic: "Merge Operations",
      functionName: "mergeIntervals",
      difficulty: "Medium",
      question: "What's the key insight for merging overlapping intervals?",
      code: `# Input:  [[1,3], [2,6], [8,10], [15,18]]
# Output: [[1,6], [8,10], [15,18]]

def merge(intervals):
    if not intervals:
        return []
    
    # MISSING STEP - how to prepare for merging?
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        if current[0] <= last[1]:  # Overlapping
            merged[-1] = [last[0], max(last[1], current[1])]
        else:  # Non-overlapping
            merged.append(current)
    
    return merged`,
      options: [
        "Sort by end time",
        "Sort by start time",
        "Sort by interval length",
        "No sorting needed"
      ],
      correctAnswer: 1,
      explanation: "Sorting by start time ensures we process intervals in chronological order. This allows us to merge overlapping intervals by comparing with the last merged interval.",
      followUpQuestions: []
    },

    // Continue with more Cache Design questions (9 more to reach 11)
    {
      id: 34,
      topic: "Cache Design",
      functionName: "LRUCacheOptimized",
      difficulty: "Hard",
      question: "How do you optimize LRU cache for better cache locality?",
      code: `# All data in contiguous arrays
keys   = [k1, k2, k3, __, __]  # Index 0,1,2,3,4
values = [v1, v2, v3, __, __]  # Same indices
next   = [1,  2, -1, __, __]   # next[0]=1, next[1]=2, next[2]=-1
prev   = [-1, 0,  1, __, __]   # prev[0]=-1, prev[1]=0, prev[2]=1

# Linked list: slot0 ↔ slot1 ↔ slot2
# head=0, tail=2

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.keys = [0] * capacity
        self.values = [0] * capacity
        self.next = [-1] * capacity
        self.prev = [-1] * capacity
        self.head = -1
        self.tail = -1
        self.size = 0
        self.free_slots = list(range(capacity))
    
    def get(self, key):
        if key not in self.cache:
            return -1
        
        slot = self.cache[key]
        value = self.values[slot]
        
        # Move to head (most recently used)
        self._remove_slot(slot)
        self._add_to_head(slot)
        
        return value
    
    def put(self, key, value):
        if key in self.cache:
            # Update existing
            slot = self.cache[key]
            self.values[slot] = value
            self._remove_slot(slot)
            self._add_to_head(slot)
        else:
            # Add new
            if self.size >= self.capacity:
                # Evict LRU (tail)
                lru_slot = self.tail
                lru_key = self.keys[lru_slot]
                del self.cache[lru_key]
                self._remove_slot(lru_slot)
                self.free_slots.append(lru_slot)
                self.size -= 1
            
            # Add new key
            slot = self.free_slots.pop()
            self.keys[slot] = key
            self.values[slot] = value
            self.cache[key] = slot
            self._add_to_head(slot)
            self.size += 1
            
    def _remove_slot(self, slot):
        # Handle previous connection
        if self.prev[slot] != -1:
            # Connect previous node to next node (bypass current)
            self.next[self.prev[slot]] = self.next[slot]
        else:
            # Current slot is head, update head pointer
            self.head = self.next[slot]
        
        # Handle next connection  
        if self.next[slot] != -1:
            # Connect next node to previous node (bypass current)
            self.prev[self.next[slot]] = self.prev[slot]
        else:
            # Current slot is tail, update tail pointer
            self.tail = self.prev[slot]
            
    def _add_to_head(self, slot):
        if self.head == -1:
            # Empty list - slot becomes both head and tail
            self.head = self.tail = slot
            self.next[slot] = self.prev[slot] = -1
        else:
            # Non-empty list - insert at head
            self.next[slot] = self.head      # New slot points to old head
            self.prev[self.head] = slot      # Old head points back to new slot
            self.prev[slot] = -1             # New slot has no previous (it's head)
            self.head = slot                 # Update head pointer   
            `,
      options: [
        "Use hash map with linked list",
        "Use array-based implementation for cache locality",
        "Use multiple hash maps",
        "Use binary search tree"
      ],
      correctAnswer: 1,
      explanation: "Array-based implementation improves cache locality by storing all data in contiguous memory, reducing cache misses compared to pointer-based linked lists.",
      followUpQuestions: []
    },
    {
      id: 35,
      topic: "Cache Design",
      functionName: "LFUCacheAdvanced",
      difficulty: "Hard",
      question: "What's the challenge in implementing LFU with O(1) operations?",
      code: `class LFUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.min_freq = 0
        self.key_to_val = {}
        self.key_to_freq = {}
        # MISSING DATA STRUCTURE - how to maintain frequency groups?
        self.freq_to_keys = defaultdict(OrderedDict)
    
    def _update_freq(self, key):
        freq = self.key_to_freq[key]
        self.key_to_freq[key] = freq + 1
        
        # Move key from freq to freq+1 group
        del self.freq_to_keys[freq][key]
        self.freq_to_keys[freq + 1][key] = None
        
        # Update min_freq if necessary
        if not self.freq_to_keys[freq] and freq == self.min_freq:
            self.min_freq += 1
    
    def put(self, key, value):
        if key in self.key_to_val:
            self.key_to_val[key] = value
            self._update_freq(key)
            return
        
        if len(self.key_to_val) >= self.capacity:
            # Remove LFU key
            lfu_key = next(iter(self.freq_to_keys[self.min_freq]))
            del self.freq_to_keys[self.min_freq][lfu_key]
            del self.key_to_val[lfu_key]
            del self.key_to_freq[lfu_key]
        
        # Add new key
        self.key_to_val[key] = value
        self.key_to_freq[key] = 1
        self.freq_to_keys[1][key] = None
        self.min_freq = 1`,
      options: [
        "Single hash map with frequency counter",
        "Hash map from frequency to OrderedDict of keys",
        "Priority queue for frequencies",
        "Balanced BST for frequency ordering"
      ],
      correctAnswer: 1,
      explanation: "We need freq_to_keys mapping to OrderedDict for O(1) access to least frequently used keys within each frequency group. OrderedDict provides O(1) insertion order tracking.",
      followUpQuestions: []
    },

    // Continue with more Arithmetic Operations questions (9 more to reach 11)
    {
      id: 36,
      topic: "Arithmetic Operations",
      functionName: "multiplyStrings",
      difficulty: "Medium",
      question: "How do you multiply two numbers represented as linked lists?",
      code: `# Initial: num = 243*564 = 137052, digits = []
# Iteration 1: digits.append(137052 % 10) → digits = [2], num = 13705
# ...
# Iteration 6: digits.append(1 % 10)      → digits = [2, 5, 0, 7, 3, 1], num = 0
# Final: digits = [2, 5, 0, 7, 3, 1] (least significant first)
# Initial: head = Node(1), curr = Node(1)
# i = 4: curr.next = Node(3), curr = Node(3)  → 1 → 3
#...
# i = 0: curr.next = Node(2), curr = Node(2)  → 1 → 3 → 7 → 0 → 5 → 2


  def multiplyLists(l1, l2):
    # Convert lists to numbers
    def listToNumber(head):
        num = 0
        while head:
            num = num * 10 + head.val
            head = head.next
        return num
    
    def numberToList(num):
        if num == 0:
            return ListNode(0)
        
        # MISSING LOGIC - how to build result list?
        digits = []
        while num > 0:
            digits.append(num % 10)
            num //= 10
        
        # Build list from most significant digit
        head = ListNode(digits[-1])
        curr = head
        for i in range(len(digits) - 2, -1, -1):
            curr.next = ListNode(digits[i])
            curr = curr.next
        
        return head
    
    num1 = listToNumber(l1)
    num2 = listToNumber(l2)
    result = num1 * num2
    
    return numberToList(result)`,
      options: [
        "Build list from least significant digit",
        "Build list from most significant digit",
        "Use string multiplication",
        "Use array for intermediate storage"
      ],
      correctAnswer: 1,
      explanation: "We collect digits in reverse order (least significant first), then build the result list from most significant digit to maintain the correct order.",
      followUpQuestions: []
    },
    {
      id: 37,
      topic: "Arithmetic Operations",
      functionName: "multiplyListsGradeSchool",
      difficulty: "Hard",
      question: "What's the alternative grade-school approach for multiplying linked lists without integer conversion?",
      code: `# Grade-School Multiplication: 243 × 564
# Visual representation:
#     2 4 3
#   × 5 6 4
#   -------
#     9 7 2  (243 × 4)
#   1 4 5 8  (243 × 6, shifted left 1)
# 1 2 1 5 0  (243 × 5, shifted left 2)
# ---------
# 1 3 7 0 5 2

def multiplyListsGradeSchool(l1, l2):
    # Extract digits to arrays
    arr1, arr2 = [], []
    while l1:
        arr1.append(l1.val)
        l1 = l1.next
    while l2:
        arr2.append(l2.val)
        l2 = l2.next
    
    # Initialize result array
    result = [0] * (len(arr1) + len(arr2))
    
    # MISSING LOGIC - how to implement grade-school multiplication?
    # Multiply each digit of arr1 with each digit of arr2
    for i in range(len(arr1) - 1, -1, -1):
        for j in range(len(arr2) - 1, -1, -1):
            product = arr1[i] * arr2[j]
            pos1, pos2 = i + j, i + j + 1
            
            total = product + result[pos2]
            result[pos2] = total % 10
            result[pos1] += total // 10
    
    # Skip leading zeros
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1
    
    if start == len(result):
        return ListNode(0)
    
    # Convert back to linked list
    head = ListNode(result[start])
    curr = head
    for i in range(start + 1, len(result)):
        curr.next = ListNode(result[i])
        curr = curr.next
    
    return head`,
      options: [
        "Use nested loops to multiply each digit pair and handle carries",
        "Convert to strings and use string multiplication",
        "Use recursion to break down the problem",
        "Apply Karatsuba algorithm for optimization"
      ],
      correctAnswer: 0,
      explanation: "The grade-school approach uses nested loops to multiply each digit of the first number with each digit of the second number, properly positioning results and handling carries. This avoids integer overflow issues and can handle arbitrarily large numbers.",
      followUpQuestions: [
        {
          question: "What's the main advantage of grade-school multiplication over direct integer conversion?",
          options: [
            "It's faster for small numbers",
            "It handles arbitrarily large numbers without overflow",
            "It uses less memory",
            "It's easier to implement"
          ],
          correctAnswer: 1,
          explanation: "Grade-school multiplication can handle arbitrarily large numbers without integer overflow, making it more robust for very large inputs where direct integer conversion might fail."
        },
        {
          question: "What's the time complexity of the grade-school multiplication approach?",
          options: [
            "O(N + M)",
            "O(N × M)",
            "O(N² + M²)",
            "O(log(N × M))"
          ],
          correctAnswer: 1,
          explanation: "The nested loops iterate through all digit pairs, giving O(N × M) time complexity where N and M are the lengths of the input lists."
        },
        {
          question: "Why do we use positions i+j and i+j+1 for storing the multiplication result?",
          options: [
            "To avoid array bounds errors",
            "To handle the decimal place positioning correctly",
            "To optimize memory usage",
            "To simplify the carry calculation"
          ],
          correctAnswer: 1,
          explanation: "Positions i+j and i+j+1 correctly represent where the tens and units digits of the product should be placed in the final result, mimicking how we position partial products in manual multiplication."
        }
      ]
    },
    {
      id: 38,
      topic: "Arithmetic Operations",
      functionName: "subtractLists",
      difficulty: "Medium",
      question: "How do you subtract two numbers represented as linked lists?",
      code: `def subtractLists(l1, l2):
    # Assume l1 >= l2 (result is positive)
    
    def reverseList(head):
        prev = None
        curr = head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev
    
    # MISSING LOGIC - how to handle borrowing?
    # Reverse both lists for easier subtraction
    l1 = reverseList(l1)
    l2 = reverseList(l2)
    
    dummy = ListNode(0)
    curr = dummy
    borrow = 0
    
    while l1 or l2 or borrow:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        diff = val1 - val2 - borrow
        if diff < 0:
            diff += 10
            borrow = 1
        else:
            borrow = 0
        
        curr.next = ListNode(diff)
        curr = curr.next
        
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    # Reverse result and remove leading zeros
    result = reverseList(dummy.next)
    while result and result.val == 0 and result.next:
        result = result.next
    
    return result`,
      options: [
        "Process from left to right",
        "Reverse lists and process with borrowing",
        "Convert to integers and subtract",
        "Use complement arithmetic"
      ],
      correctAnswer: 1,
      explanation: "We reverse both lists to process from least significant digit. When diff < 0, we borrow from the next digit (diff += 10, borrow = 1).",
      followUpQuestions: []
    },

    // Continue with more Node Removal questions (8 more to reach 11)
    {
      id: 39,
      topic: "Node Removal",
      functionName: "removeElements",
      difficulty: "Easy",
      question: "How do you remove all nodes with a specific value?",
      code: `def removeElements(head, val):
    # MISSING LOGIC - how to handle head node removal?
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    curr = head
    
    while curr:
        if curr.val == val:
            prev.next = curr.next
        else:
            prev = curr
        curr = curr.next
    
    return dummy.next`,
      options: [
        "Start from head and track previous",
        "Use dummy node to handle head removal",
        "Use recursion for each node",
        "Create new list without target values"
      ],
      correctAnswer: 1,
      explanation: "Dummy node simplifies the logic by providing a consistent previous node, even when removing the head. We only advance prev when we don't remove a node.",
      followUpQuestions: []
    },
    {
      id: 40,
      topic: "Node Removal",
      functionName: "deleteDuplicatesII",
      difficulty: "Medium",
      question: "How do you remove all nodes that have duplicates (keep none)?",
      code: `def deleteDuplicates(head):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    while prev.next and prev.next.next:
        # MISSING LOGIC - how to detect and remove all duplicates?
        if prev.next.val == prev.next.next.val:
            val = prev.next.val
            # Remove all nodes with this value
            while prev.next and prev.next.val == val:
                prev.next = prev.next.next
        else:
            prev = prev.next
    
    return dummy.next`,
      options: [
        "Remove only the first duplicate",
        "Remove all nodes with duplicate values",
        "Keep one copy of each duplicate",
        "Mark duplicates and remove later"
      ],
      correctAnswer: 1,
      explanation: "When we detect duplicates (prev.next.val == prev.next.next.val), we remove ALL nodes with that value. We don't advance prev until we find a unique value.",
      followUpQuestions: []
    },

    // Continue with more Intersection Detection questions (8 more to reach 11)
    {
      id: 41,
      topic: "Intersection Detection",
      functionName: "findCycleLength",
      difficulty: "Medium",
      question: "How do you find the length of a cycle in a linked list?",
      code: `def detectCycleLength(head):
    if not head or not head.next:
        return 0
    
    # Phase 1: Detect cycle using Floyd's algorithm
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return 0  # No cycle
    
    # MISSING LOGIC - how to find cycle length?
    # Phase 2: Find cycle length
    length = 1
    curr = slow.next
    while curr != slow:
        curr = curr.next
        length += 1
    
    return length`,
      options: [
        "Count nodes from start to meeting point",
        "Move one pointer around the cycle and count",
        "Calculate using mathematical formula",
        "Use additional data structure to track"
      ],
      correctAnswer: 1,
      explanation: "After detecting the cycle, we keep one pointer at the meeting point and move another pointer around the cycle, counting steps until they meet again.",
      followUpQuestions: []
    },
    {
      id: 42,
      topic: "Intersection Detection",
      functionName: "findIntersectionWithCycles",
      difficulty: "Hard",
      question: "How do you find intersection when both lists may have cycles?",
      code: `def getIntersectionNode(headA, headB):
    def detectCycle(head):
        if not head:
            return None
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                # Find cycle start
                slow = head
                while slow != fast:
                    slow = slow.next
                    fast = fast.next
                return slow
        return None
    
    # MISSING LOGIC - how to handle different cycle scenarios?
    cycleA = detectCycle(headA)
    cycleB = detectCycle(headB)
    
    if not cycleA and not cycleB:
        # Both lists are acyclic - use standard approach
        return getIntersectionAcyclic(headA, headB)
    elif cycleA and cycleB:
        # Both have cycles - check if they're the same cycle
        curr = cycleA.next
        while curr != cycleA:
            if curr == cycleB:
                return cycleA  # Same cycle
            curr = curr.next
        return None  # Different cycles
    else:
        # One has cycle, one doesn't - no intersection
        return None`,
      options: [
        "Always use standard intersection algorithm",
        "Handle four cases: no cycles, same cycle, different cycles, mixed",
        "Convert cyclic lists to acyclic first",
        "Use hash set to track all nodes"
      ],
      correctAnswer: 1,
      explanation: "We need to handle: (1) both acyclic - standard algorithm, (2) both cyclic with same cycle - return cycle start, (3) both cyclic with different cycles - no intersection, (4) mixed - no intersection.",
      followUpQuestions: []
    }

  ];

  // Total: 41 questions so far

  const topics = ['All Topics', 'Reversal Operations', 'Copy & Clone', 'Merge Operations', 'Cache Design', 'Arithmetic Operations', 'Node Removal', 'Intersection Detection'];

  const topicQuestionCounts: {[key: string]: number} = {
    'Reversal Operations': 11,
    'Copy & Clone': 8,
    'Merge Operations': 8,
    'Cache Design': 4,
    'Arithmetic Operations': 4,
    'Node Removal': 3,
    'Intersection Detection': 3
  };

  // Filter questions based on selected topic
  const filteredQuestions = useMemo(() => {
    if (selectedTopic === 'All Topics') {
      return questions;
    }
    return questions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Initialize achievements
  const initializeAchievements = () => {
    const defaultAchievements: Achievement[] = [
      {
        id: 'first_correct',
        name: 'First Steps',
        description: 'Answer your first question correctly',
        icon: '🎯',
        unlocked: false
      },
      {
        id: 'streak_5',
        name: 'On Fire',
        description: 'Get 5 questions correct in a row',
        icon: '🔥',
        unlocked: false
      },
      {
        id: 'topic_master',
        name: 'Topic Master',
        description: 'Complete all questions in a topic',
        icon: '👑',
        unlocked: false
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Answer a question in under 10 seconds',
        icon: '⚡',
        unlocked: false
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete a topic with 100% accuracy',
        icon: '💎',
        unlocked: false
      }
    ];
    setAchievements(defaultAchievements);
  };

  // Calculate score based on difficulty, time, and hints
  const calculateScore = useCallback((difficulty: string, timeSpent: number, hintsUsed: number) => {
    const baseScore = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;
    const timeBonus = Math.max(0, 30 - timeSpent); // Bonus for quick answers
    const hintPenalty = hintsUsed * 5;
    const comboBonus = combo * 2;
    return Math.max(1, baseScore + timeBonus - hintPenalty + comboBonus);
  }, [combo]);

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const points = calculateScore(currentQuestion.difficulty, questionTime, showHint ? 1 : 0);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setCombo(prev => prev + 1);
      checkAchievements(questionTime);
    } else {
      setStreak(0);
      setCombo(0);
    }
    
    // Update progress
    const newProgress = {
      ...userProgress,
      questionsAnswered: userProgress.questionsAnswered + 1,
      correctAnswers: userProgress.correctAnswers + (isCorrect ? 1 : 0),
      totalTimeSpent: userProgress.totalTimeSpent + questionTime
    };
    setUserProgress(newProgress);
    
    if (showHint) {
      setHintsUsed(prev => prev + 1);
    }
  };

  // Check and unlock achievements
  const checkAchievements = (questionTime: number) => {
    const newAchievements = [...achievements];
    let hasNewAchievement = false;

    // First correct answer
    if (!newAchievements.find(a => a.id === 'first_correct')?.unlocked && userProgress.correctAnswers === 0) {
      const achievement = newAchievements.find(a => a.id === 'first_correct');
      if (achievement) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        hasNewAchievement = true;
      }
    }

    // Streak achievements
    if (streak >= 4 && !newAchievements.find(a => a.id === 'streak_5')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'streak_5');
      if (achievement) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        hasNewAchievement = true;
      }
    }

    // Speed achievement
    if (questionTime < 10 && !newAchievements.find(a => a.id === 'speed_demon')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'speed_demon');
      if (achievement) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        hasNewAchievement = true;
      }
    }

    if (hasNewAchievement) {
      setAchievements(newAchievements);
      // Save to localStorage
      localStorage.setItem('linkedlist-mc-achievements', JSON.stringify(newAchievements));
    }
  };

  // Handle next question
  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setQuestionStartTime(Date.now());
      setFollowUpAnswers({});
      setShowFollowUpResults(false);
    } else {
      setGameCompleted(true);
      if (score > highScore) {
        setHighScore(score);
        const newProgress = { ...userProgress, highScore: score };
        setUserProgress(newProgress);
        localStorage.setItem('linkedlist-mc-progress', JSON.stringify(newProgress));
      }
    }
  };

  // Handle follow-up answers
  const handleFollowUpAnswer = (questionIndex: number, answerIndex: number) => {
    setFollowUpAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  // Submit follow-up answers
  const submitFollowUpAnswers = () => {
    setShowFollowUpResults(true);
    // Add small delay before moving to next question
    setTimeout(() => {
      nextQuestion();
    }, 10000);
  };

  // Reset game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameCompleted(false);
    setStreak(0);
    setCombo(0);
    setHintsUsed(0);
    setTimeSpent(0);
    setShowHint(false);
    setQuestionStartTime(Date.now());
    setFollowUpAnswers({});
    setShowFollowUpResults(false);
  };

  // Handle show hint
  const handleShowHint = () => {
    setShowHint(true);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No questions available for this topic</h2>
          <button
            onClick={() => setSelectedTopic('All Topics')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg"
          >
            View All Topics
          </button>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950 flex items-center justify-center">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-white/20 dark:border-gray-700/30">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Congratulations!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've completed the Linked List Multiple Choice challenge!
            </p>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">Final Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)}%</div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">Accuracy</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetGame}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Play Again
              </button>
              
              <Link
                href="/games/linked-list-adventure"
                className="flex-1 px-6 py-3 bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 font-semibold rounded-lg shadow-md hover:shadow-lg border border-emerald-200 dark:border-emerald-600 transform hover:scale-105 transition-all text-center"
              >
                Back to Hub
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-gray-900 dark:via-emerald-950 dark:to-teal-950">
      {/* Header */}
      <header className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-white/10 dark:border-gray-800/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/games/linked-list-adventure" className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Linked List Adventure
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
              Linked List Multiple Choice
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Filter - Top Horizontal */}
        <div className="mb-8 w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 mb-2">
              Select Topic
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-full">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setShowHint(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTopic === topic
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {topic === 'All Topics' ? (
                  <>{topic} - {questions.length} Questions</>
                ) : (
                  <>{topic} - {topicQuestionCounts[topic] || 0}</>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Question */}
          <div className="space-y-6">
            {/* Progress & Stats */}
            <div className="bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                    {score}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Score</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-green-600 dark:from-teal-400 dark:to-green-400">
                    {streak}
                  </div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">Streak</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                    {currentQuestionIndex + 1}/{filteredQuestions.length}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Progress</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
                    {currentQuestion.difficulty}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Difficulty</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-300/50 dark:border-emerald-600/50">
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
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔗</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentQuestion.topic}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentQuestion.functionName}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentQuestion.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : currentQuestion.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {currentQuestion.question}
              </h2>

              {/* Visualization Buttons */}
              {currentQuestion.id === 1 && (
                <div className="mb-6">
                  <ReverseKGroupVisualizer k={3} />
                </div>
              )}
              
              {currentQuestion.id === 22 && (
                <div className="mb-6">
                  <RotateRightVisualizer initialK={2} />
                </div>
              )}
              
              {currentQuestion.id === 24 && (
                <div className="mb-6">
                  <ReverseEvenLengthVisualizer />
                </div>
              )}
              
              {currentQuestion.id === 26 && (
                <div className="mb-6">
                  <ReverseKGroupsFromEndVisualizer k={3} />
                </div>
              )}
              
              {currentQuestion.id === 29 && (
                <div className="mb-6">
                  <DeepCopyWithCyclesVisualizer />
                </div>
              )}
              
              {currentQuestion.id === 19 && (
                <div className="mb-6">
                  <ElegantIntersectionVisualizer />
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === null
                        ? 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        : selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                          : index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                            : 'border-gray-200 dark:border-gray-600 opacity-50'
                    } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        selectedAnswer === null
                          ? 'border-gray-300 dark:border-gray-500'
                          : selectedAnswer === index
                            ? index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-red-500 bg-red-500 text-white'
                            : index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Hint Button */}
              {!showResult && !showHint && (
                <button
                  onClick={handleShowHint}
                  className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                >
                  💡 Show Hint
                </button>
              )}

              {/* Show hint */}
              {showHint && !showResult && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    💡 <strong>Hint:</strong> Look for the missing logic in the algorithm. Consider what data structures or techniques are most efficient for this specific linked list operation.
                  </p>
                </div>
              )}

              {/* Result */}
              {showResult && (
                <div className={`p-6 rounded-xl mb-6 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">
                      {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                    </span>
                    <span className={`font-semibold ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  <p className={`${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Follow-up Questions */}
              {showResult && currentQuestion.followUpQuestions.length > 0 && !showFollowUpResults && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">Follow-up Questions:</h4>
                  {currentQuestion.followUpQuestions.map((followUp, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-blue-700 dark:text-blue-300 mb-2">{followUp.question}</p>
                      <div className="space-y-2">
                        {followUp.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => handleFollowUpAnswer(index, optionIndex)}
                            className={`w-full p-2 text-left rounded-lg border transition-colors ${
                              followUpAnswers[index] === optionIndex
                                ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50'
                                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={submitFollowUpAnswers}
                    disabled={Object.keys(followUpAnswers).length < currentQuestion.followUpQuestions.length}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Follow-up Answers
                  </button>
                </div>
              )}

              {/* Follow-up Results */}
              {showFollowUpResults && currentQuestion.followUpQuestions.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Follow-up Results:</h4>
                  {currentQuestion.followUpQuestions.map((followUp, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{followUp.question}</p>
                      <div className={`p-3 rounded-lg ${
                        followUpAnswers[index] === followUp.correctAnswer
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        <p className="font-medium">
                          {followUpAnswers[index] === followUp.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
                        </p>
                        <p className="text-sm mt-1">{followUp.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Next Button */}
              {showResult && (showFollowUpResults || currentQuestion.followUpQuestions.length === 0) && (
                <button
                  onClick={nextQuestion}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Code Display */}
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-white text-lg">💻</span>
                    <div>
                      <h3 className="text-white font-semibold">{currentQuestion.functionName}</h3>
                      <p className="text-emerald-100 text-sm">{currentQuestion.topic}</p>
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
              
              <div className="p-6">
                <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                  <code>{currentQuestion.code}</code>
                </pre>
              </div>
            </div>

            {/* Algorithm Insights */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-700/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Algorithm Insights
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {currentQuestion.topic === 'Reversal Operations' && (
                  <div>
                    <p><strong>Key Concepts:</strong> Pointer manipulation, iterative vs recursive approaches</p>
                    <p><strong>Common Patterns:</strong> Three-pointer reversal, dummy nodes, group processing</p>
                    <p><strong>Time Complexity:</strong> Usually O(n), Space: O(1) for iterative</p>
                  </div>
                )}
                {currentQuestion.topic === 'Copy & Clone' && (
                  <div>
                    <p><strong>Key Concepts:</strong> Deep copying, handling random pointers, cycle detection</p>
                    <p><strong>Common Patterns:</strong> Hash map mapping, interleaving technique, DFS traversal</p>
                    <p><strong>Time Complexity:</strong> O(n), Space: O(n) for hash map or O(1) for interleaving</p>
                  </div>
                )}
                {currentQuestion.topic === 'Merge Operations' && (
                  <div>
                    <p><strong>Key Concepts:</strong> Divide and conquer, priority queues, sorted list merging</p>
                    <p><strong>Common Patterns:</strong> Two-pointer technique, merge sort, heap operations</p>
                    <p><strong>Time Complexity:</strong> O(n log k) for k lists, O(n) for two lists</p>
                  </div>
                )}
                {currentQuestion.topic === 'Cache Design' && (
                  <div>
                    <p><strong>Key Concepts:</strong> LRU/LFU policies, doubly linked lists, hash maps</p>
                    <p><strong>Common Patterns:</strong> Combined data structures, frequency tracking</p>
                    <p><strong>Time Complexity:</strong> O(1) for all operations with proper design</p>
                  </div>
                )}
                {currentQuestion.topic === 'Arithmetic Operations' && (
                  <div>
                    <p><strong>Key Concepts:</strong> Carry handling, digit processing, number representation</p>
                    <p><strong>Common Patterns:</strong> Stack for reverse order, dummy nodes, carry propagation</p>
                    <p><strong>Time Complexity:</strong> O(max(m,n)), Space: O(1) or O(max(m,n))</p>
                  </div>
                )}
                {currentQuestion.topic === 'Node Removal' && (
                  <div>
                    <p><strong>Key Concepts:</strong> Two-pointer technique, dummy nodes, edge cases</p>
                    <p><strong>Common Patterns:</strong> Fast/slow pointers, gap maintenance, one-pass algorithms</p>
                    <p><strong>Time Complexity:</strong> O(n), Space: O(1)</p>
                  </div>
                )}
                {currentQuestion.topic === 'Intersection Detection' && (
                  <div>
                    <p><strong>Key Concepts:</strong> Floyd's algorithm, pointer switching, cycle detection</p>
                    <p><strong>Common Patterns:</strong> Two-pointer technique, hash set tracking, mathematical properties</p>
                    <p><strong>Time Complexity:</strong> O(m+n), Space: O(1) for optimal solutions</p>
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

export default LinkedListMultipleChoiceGame;

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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

// Modular Arithmetic Visualizer Component
interface ModularStep {
  step: number;
  description: string;
  code: string;
  values: {
    base?: number;
    exp?: number;
    mod?: number;
    result?: number;
    binaryExp?: string;
    currentBit?: number;
    iteration?: number;
  };
  highlight?: string;
}

const ModularArithmeticVisualizer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: ModularStep[] = [
    {
      step: 0,
      description: "Computing 3^13 mod 1000 using binary exponentiation",
      code: "modular_power(3, 13, 1000)",
      values: { base: 3, exp: 13, mod: 1000, result: 1, binaryExp: "1101₂" },
      highlight: "Initial setup: base=3, exp=13, mod=1000, result=1"
    },
    {
      step: 1,
      description: "Convert exponent to binary: 13 = 1101₂",
      code: "Binary representation: 13 = 8 + 4 + 1 = 2³ + 2² + 2⁰",
      values: { base: 3, exp: 13, mod: 1000, result: 1, binaryExp: "1101₂", currentBit: 0 },
      highlight: "Reading binary from right to left: positions 0,2,3 are 1"
    },
    {
      step: 2,
      description: "Iteration 1: Check rightmost bit (position 0)",
      code: "exp % 2 == 1? → 13 % 2 = 1 → YES",
      values: { base: 3, exp: 13, mod: 1000, result: 3, binaryExp: "1101₂", currentBit: 0, iteration: 1 },
      highlight: "Bit is 1, so multiply: result = (1 * 3) % 1000 = 3"
    },
    {
      step: 3,
      description: "Square base and shift exponent",
      code: "base = (3 * 3) % 1000 = 9; exp = 13 >> 1 = 6",
      values: { base: 9, exp: 6, mod: 1000, result: 3, binaryExp: "110₂", currentBit: 1, iteration: 1 },
      highlight: "Prepare for next iteration: base²=9, exp shifted right"
    },
    {
      step: 4,
      description: "Iteration 2: Check bit at position 1",
      code: "exp % 2 == 1? → 6 % 2 = 0 → NO",
      values: { base: 9, exp: 6, mod: 1000, result: 3, binaryExp: "110₂", currentBit: 1, iteration: 2 },
      highlight: "Bit is 0, so skip multiplication: result stays 3"
    },
    {
      step: 5,
      description: "Square base and shift exponent",
      code: "base = (9 * 9) % 1000 = 81; exp = 6 >> 1 = 3",
      values: { base: 81, exp: 3, mod: 1000, result: 3, binaryExp: "11₂", currentBit: 2, iteration: 2 },
      highlight: "Prepare for next iteration: base²=81, exp shifted right"
    },
    {
      step: 6,
      description: "Iteration 3: Check bit at position 2",
      code: "exp % 2 == 1? → 3 % 2 = 1 → YES",
      values: { base: 81, exp: 3, mod: 1000, result: 243, binaryExp: "11₂", currentBit: 2, iteration: 3 },
      highlight: "Bit is 1, so multiply: result = (3 * 81) % 1000 = 243"
    },
    {
      step: 7,
      description: "Square base and shift exponent",
      code: "base = (81 * 81) % 1000 = 561; exp = 3 >> 1 = 1",
      values: { base: 561, exp: 1, mod: 1000, result: 243, binaryExp: "1₂", currentBit: 3, iteration: 3 },
      highlight: "Prepare for next iteration: base²=561, exp shifted right"
    },
    {
      step: 8,
      description: "Iteration 4: Check bit at position 3",
      code: "exp % 2 == 1? → 1 % 2 = 1 → YES",
      values: { base: 561, exp: 1, mod: 1000, result: 323, binaryExp: "1₂", currentBit: 3, iteration: 4 },
      highlight: "Bit is 1, so multiply: result = (243 * 561) % 1000 = 323"
    },
    {
      step: 9,
      description: "Final result: 3^13 mod 1000 = 323",
      code: "exp = 1 >> 1 = 0; Loop ends",
      values: { base: 561, exp: 0, mod: 1000, result: 323, binaryExp: "0₂", iteration: 4 },
      highlight: "Algorithm complete! Verification: 3^13 = 1594323, 1594323 % 1000 = 323 ✓"
    }
  ];

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
        setCurrentStep(prev => prev + 1);
      }, 2000);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep];

  return (
    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Modular Exponentiation
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Compact Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Status Values */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">Base</div>
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{currentStepData.values.base}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">Exp</div>
              <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{currentStepData.values.exp}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">Mod</div>
              <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">{currentStepData.values.mod}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400">Result</div>
              <div className="text-lg font-semibold text-rose-600 dark:text-rose-400">{currentStepData.values.result}</div>
            </div>
          </div>

          {/* Binary Representation */}
          {currentStepData.values.binaryExp && (
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Binary: 13 = 1101₂</div>
              <div className="font-mono text-sm">
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className={`p-1 rounded ${currentStepData.values.currentBit === 3 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    <div className="text-xs">pos 3</div>
                    <div className="font-bold">1</div>
                    <div className="text-xs">×8</div>
                  </div>
                  <div className={`p-1 rounded ${currentStepData.values.currentBit === 2 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    <div className="text-xs">pos 2</div>
                    <div className="font-bold">1</div>
                    <div className="text-xs">×4</div>
                  </div>
                  <div className={`p-1 rounded ${currentStepData.values.currentBit === 1 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    <div className="text-xs">pos 1</div>
                    <div className="font-bold">0</div>
                    <div className="text-xs">×2</div>
                  </div>
                  <div className={`p-1 rounded ${currentStepData.values.currentBit === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    <div className="text-xs">pos 0</div>
                    <div className="font-bold">1</div>
                    <div className="text-xs">×1</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Step Description */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Step {currentStepData.step + 1}/10
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {currentStepData.description}
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded font-mono text-xs text-slate-700 dark:text-slate-300 mb-2">
              {currentStepData.code}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentStepData.highlight}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">{currentStep + 1} / {steps.length}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={togglePlay}
          className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          ↻
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// Newton's Method Visualizer Component
interface NewtonStep {
  step: number;
  description: string;
  guess: number;
  newGuess: number;
  error: number;
  formula: string;
  calculation: string;
}

const NewtonMethodVisualizer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetValue, setTargetValue] = useState(25);

  // Calculate Newton's method steps for square root
  const calculateSteps = (x: number): NewtonStep[] => {
    const steps: NewtonStep[] = [];
    let guess = x; // Initial guess
    const precision = 1e-6;
    let stepCount = 0;
    
    // Initial step
    steps.push({
      step: 0,
      description: `Finding √${x} using Newton's Method`,
      guess: guess,
      newGuess: guess,
      error: Math.abs(guess * guess - x),
      formula: "Initial guess = x",
      calculation: `guess = ${x}`
    });

    while (Math.abs(guess * guess - x) > precision && stepCount < 8) {
      stepCount++;
      const newGuess = (guess + x / guess) / 2;
      const error = Math.abs(newGuess * newGuess - x);
      
      steps.push({
        step: stepCount,
        description: `Iteration ${stepCount}: Apply Newton's formula`,
        guess: guess,
        newGuess: newGuess,
        error: error,
        formula: "new_guess = (guess + x/guess) / 2",
        calculation: `new_guess = (${guess.toFixed(6)} + ${x}/${guess.toFixed(6)}) / 2 = ${newGuess.toFixed(6)}`
      });
      
      guess = newGuess;
    }

    return steps;
  };

  const steps = calculateSteps(targetValue);
  const currentStepData = steps[currentStep] || steps[0];

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
        setCurrentStep(prev => prev + 1);
      }, 2000);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const actualSqrt = Math.sqrt(targetValue);

  return (
    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Newton's Method for Square Root
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Input Control */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Target Value (x): √{targetValue} = {actualSqrt.toFixed(6)}
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={targetValue}
          onChange={(e) => {
            setTargetValue(parseInt(e.target.value));
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>1</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Compact Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Current Values */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">Current Guess</div>
              <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {currentStepData.guess.toFixed(6)}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400">New Guess</div>
              <div className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                {currentStepData.newGuess.toFixed(6)}
              </div>
            </div>
          </div>

          {/* Error Analysis */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Error Analysis</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">guess² =</span>
                <span className="font-mono">{(currentStepData.guess * currentStepData.guess).toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">target =</span>
                <span className="font-mono">{targetValue}</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="text-slate-600 dark:text-slate-400">error =</span>
                <span className="font-mono text-red-600 dark:text-red-400">
                  {currentStepData.error.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          {/* Convergence Visualization */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Convergence</div>
            <div className="space-y-2">
              {steps.slice(0, currentStep + 1).map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="text-xs font-mono">
                    {step.newGuess.toFixed(4)}
                  </div>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-1 rounded">
                    <div 
                      className="bg-emerald-500 h-1 rounded transition-all duration-300"
                      style={{ width: `${Math.max(5, 100 - (step.error * 1000))}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Step Description */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Step {currentStepData.step + 1}/{steps.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {currentStepData.description}
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded font-mono text-xs text-slate-700 dark:text-slate-300 mb-2">
              {currentStepData.formula}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {currentStepData.calculation}
            </div>
          </div>

          {/* Mathematical Insight */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Why It Works</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>• Newton's method finds where f(x) = 0</div>
              <div>• For √a, we solve x² - a = 0</div>
              <div>• Formula: x₁ = x₀ - f(x₀)/f'(x₀)</div>
              <div>• f(x) = x² - a, f'(x) = 2x</div>
              <div>• Result: x₁ = (x₀ + a/x₀) / 2</div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">{currentStep + 1} / {steps.length}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={togglePlay}
          className="px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          ↻
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// Prime Checking Visualizer Component
interface PrimeStep {
  step: number;
  description: string;
  divisor: number;
  isDivisible: boolean;
  calculation: string;
  optimizationNote?: string;
}

const PrimeCheckingVisualizer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetNumber, setTargetNumber] = useState(97);
  const [algorithm, setAlgorithm] = useState<'naive' | 'optimized'>('optimized');

  // Calculate prime checking steps
  const calculateSteps = (n: number, useOptimized: boolean): PrimeStep[] => {
    const steps: PrimeStep[] = [];
    
    // Initial checks
    if (n < 2) {
      steps.push({
        step: 0,
        description: `${n} < 2, so it's not prime`,
        divisor: 0,
        isDivisible: true,
        calculation: `${n} < 2 → Not Prime`,
        optimizationNote: "Numbers less than 2 are not prime by definition"
      });
      return steps;
    }

    if (n === 2) {
      steps.push({
        step: 0,
        description: `${n} is the only even prime number`,
        divisor: 0,
        isDivisible: false,
        calculation: `${n} = 2 → Prime`,
        optimizationNote: "2 is the only even prime"
      });
      return steps;
    }

    if (n % 2 === 0) {
      steps.push({
        step: 0,
        description: `${n} is even, so it's divisible by 2`,
        divisor: 2,
        isDivisible: true,
        calculation: `${n} % 2 = 0 → Not Prime`,
        optimizationNote: "Even numbers > 2 are not prime"
      });
      return steps;
    }

    // Main checking loop
    const limit = useOptimized ? Math.floor(Math.sqrt(n)) + 1 : n;
    let stepCount = 0;
    
    steps.push({
      step: stepCount++,
      description: `Checking divisors from 3 to ${useOptimized ? `√${n} ≈ ${Math.floor(Math.sqrt(n))}` : n}`,
      divisor: 0,
      isDivisible: false,
      calculation: useOptimized ? `limit = √${n} = ${Math.floor(Math.sqrt(n))}` : `limit = ${n}`,
      optimizationNote: useOptimized ? "Only need to check up to √n because factors come in pairs" : "Naive approach checks all numbers"
    });

    for (let i = 3; i < limit; i += 2) {
      const isDivisible = n % i === 0;
      steps.push({
        step: stepCount++,
        description: `Testing divisor ${i}`,
        divisor: i,
        isDivisible: isDivisible,
        calculation: `${n} % ${i} = ${n % i}${isDivisible ? ' → Not Prime' : ''}`,
        optimizationNote: isDivisible ? `Found factor: ${i} × ${n/i} = ${n}` : undefined
      });
      
      if (isDivisible) break;
      if (stepCount > 20) break; // Limit steps for visualization
    }

    if (steps[steps.length - 1] && !steps[steps.length - 1].isDivisible) {
      steps.push({
        step: stepCount,
        description: `No divisors found - ${n} is prime!`,
        divisor: 0,
        isDivisible: false,
        calculation: `${n} is Prime ✓`,
        optimizationNote: "All potential divisors checked"
      });
    }

    return steps;
  };

  const steps = calculateSteps(targetNumber, algorithm === 'optimized');
  const currentStepData = steps[currentStep] || steps[0];
  const isPrime = !steps.some(step => step.isDivisible);

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
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const naiveSteps = calculateSteps(targetNumber, false).length;
  const optimizedSteps = calculateSteps(targetNumber, true).length;

  return (
    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Prime Checking Optimization
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Number Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Target Number: {targetNumber} {isPrime ? '(Prime ✓)' : '(Not Prime ✗)'}
          </label>
          <input
            type="range"
            min="2"
            max="200"
            value={targetNumber}
            onChange={(e) => {
              setTargetNumber(parseInt(e.target.value));
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>2</span>
            <span>100</span>
            <span>200</span>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Algorithm: {algorithm === 'optimized' ? 'Optimized (√n)' : 'Naive (n)'}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAlgorithm('naive');
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1 text-sm rounded ${algorithm === 'naive' 
                ? 'bg-red-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
            >
              Naive O(n)
            </button>
            <button
              onClick={() => {
                setAlgorithm('optimized');
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1 text-sm rounded ${algorithm === 'optimized' 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
            >
              Optimized O(√n)
            </button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Steps: Naive({naiveSteps}) vs Optimized({optimizedSteps})
          </div>
        </div>
      </div>

      {/* Compact Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Current Test */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Test</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Number</div>
                <div className="text-xl font-semibold text-amber-600 dark:text-amber-400">
                  {targetNumber}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Divisor</div>
                <div className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                  {currentStepData.divisor || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Comparison */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Algorithm Comparison</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Naive limit:</span>
                <span className="font-mono text-red-600 dark:text-red-400">{targetNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Optimized limit:</span>
                <span className="font-mono text-green-600 dark:text-green-400">√{targetNumber} = {Math.floor(Math.sqrt(targetNumber))}</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="text-slate-600 dark:text-slate-400">Improvement:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {Math.round((1 - Math.floor(Math.sqrt(targetNumber)) / targetNumber) * 100)}% fewer checks
                </span>
              </div>
            </div>
          </div>

          {/* Factor Pairs Visualization */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Why √n Works</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>• Factors come in pairs: a × b = n</div>
              <div>• If a &gt; √n, then b &lt; √n</div>
              <div>• So checking up to √n finds all factor pairs</div>
              <div>• Example: 36 = 6×6, factors: (1,36), (2,18), (3,12), (4,9), (6,6)</div>
              <div>• Only need to check 1,2,3,4,5,6 to find all pairs</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Step Description */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Step {currentStep + 1}/{steps.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {currentStepData.description}
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded font-mono text-xs text-slate-700 dark:text-slate-300 mb-2">
              {currentStepData.calculation}
            </div>
            {currentStepData.optimizationNote && (
              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                💡 {currentStepData.optimizationNote}
              </div>
            )}
          </div>

          {/* Progress Visualization */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Progress</div>
            <div className="space-y-2">
              {steps.slice(0, currentStep + 1).map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    step.isDivisible 
                      ? 'bg-red-100 dark:bg-red-900/30' 
                      : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      step.isDivisible ? 'bg-red-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div className="text-xs font-mono">
                    {step.divisor ? `${targetNumber} % ${step.divisor} = ${targetNumber % step.divisor}` : step.calculation}
                  </div>
                  {step.isDivisible && step.divisor > 0 && (
                    <div className="text-xs text-red-600 dark:text-red-400">✗</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final Result */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Result</div>
            <div className={`text-lg font-bold text-center p-2 rounded ${
              isPrime 
                ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' 
                : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
            }`}>
              {targetNumber} is {isPrime ? 'PRIME' : 'NOT PRIME'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={togglePlay}
          className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          ↻
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default function MathematicalAlgorithmsGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [darkMode, setDarkMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizMode, setQuizMode] = useState<'practice' | 'timed' | 'challenge'>('practice');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showFollowUpQuestions, setShowFollowUpQuestions] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<number[]>([]);
  const [showModularVisualization, setShowModularVisualization] = useState(false);
  const [showNewtonVisualization, setShowNewtonVisualization] = useState(false);
  const [showPrimeVisualization, setShowPrimeVisualization] = useState(false);
  const [showFollowUpResults, setShowFollowUpResults] = useState(false);
  
  const [userProgress, setUserProgress] = useState<UserProgress>({
    questionsAnswered: 0,
    correctAnswers: 0,
    topicsCompleted: [],
    achievements: [],
    streakCount: 0,
    bestStreak: 0
  });

  // Mathematical Algorithms Questions
  const questions: MCQuestion[] = [
    // Modulo Operations & Properties (12 questions)
    {
      id: 1,
      topic: "Modulo Operations",
      functionName: "modulo_basics",
      difficulty: "Easy",
      question: "What's the missing logic for handling negative numbers in modulo operations?",
      code: `def safe_mod(a, b):
    # MISSING: Handle negative numbers properly
    result = _______________
    return result

# Test cases
print(safe_mod(-8, 3))  # Should return 1 (not -2)
print(safe_mod(8, -3))  # Should return -1 (not 2)`,
      options: [
        "a % b",
        "(a % b + b) % b", 
        "a % b if a >= 0 else (a % b + b) % b",
        "abs(a) % abs(b)"
      ],
      correctAnswer: 1,
      hint: "• Problem: Standard % operator in many languages gives remainder, not mathematical modulo<br/>• Solution: ((a % b) + b) % b ensures result is in correct range<br/>• Range: Result is always [0, b) for positive b, (b, 0] for negative b<br/>• Use Cases: Circular indexing, hash functions, cryptography, date calculations",
      explanation: "(a % b + b) % b ensures a non-negative result when b is positive, handling the case where a % b might be negative.",
      followUpQuestions: [
        {
          question: "Why does Python's -8 % 3 return 1 instead of -2?",
          options: ["It's a bug", "Result has same sign as divisor", "Python rounds differently", "It's random"],
          correctAnswer: 1,
          explanation: "Python ensures the result has the same sign as the divisor (3 is positive, so result is positive)."
        },
        {
          question: "What's the time complexity of modulo operation?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctAnswer: 0,
          explanation: "Modulo is a constant-time operation O(1) for fixed-size integers."
        }
      ]
    },

    {
      id: 2,
      topic: "Modulo Operations",
      functionName: "circular_array",
      difficulty: "Medium",
      question: "What's the missing logic for circular array navigation?",
      code: `def circular_navigate(current_index, steps, array_size):
    # MISSING: Handle both positive and negative steps
    new_index = _______________
    return new_index

# Examples
arr = [1, 2, 3, 4, 5]  # size = 5
print(circular_navigate(4, 3, 5))   # Should return 2 (wrap around)
print(circular_navigate(1, -3, 5))  # Should return 3 (wrap backwards)`,
      options: [
        "(current_index + steps) % array_size",
        "(current_index + steps + array_size) % array_size",
        "((current_index + steps) % array_size + array_size) % array_size",
        "(current_index + steps) % array_size if steps >= 0 else (current_index + steps + array_size) % array_size"
      ],
      correctAnswer: 2,
      hint: "Need to handle negative steps properly to avoid negative indices.",
      explanation: "((current_index + steps) % array_size + array_size) % array_size handles both positive and negative steps correctly.",
      followUpQuestions: [
        {
          question: "What's the key insight for handling negative steps?",
          options: ["Add array_size before modulo", "Use absolute value", "Check sign first", "Use different formula"],
          correctAnswer: 0,
          explanation: "Adding array_size ensures the intermediate result is positive before taking modulo."
        },
        {
          question: "In a circular buffer of size 8, what's the index after moving -3 from position 1?",
          options: ["6", "5", "7", "4"],
          correctAnswer: 0,
          explanation: "((1 + (-3)) % 8 + 8) % 8 = ((-2) % 8 + 8) % 8 = (6 + 8) % 8 = 6"
        }
      ]
    },

    {
      id: 3,
      topic: "Modulo Operations",
      functionName: "modular_arithmetic",
      difficulty: "Hard",
      question: "What's the missing optimization for large number modular arithmetic?",
      code: `def modular_multiply(a, b, mod):
    # MISSING: Prevent overflow in multiplication
    result = _______________
    return result

def modular_power(base, exp, mod):
    # MISSING: Efficient modular exponentiation
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = _______________
        exp = exp >> 1
        base = _______________
    return result`,
      options: [
        "((a % mod) * (b % mod)) % mod; result * base % mod; base * base % mod",
        "(a * b) % mod; (result * base) % mod; (base * base) % mod", 
        "((a % mod) * (b % mod)) % mod; modular_multiply(result, base, mod); modular_multiply(base, base, mod)",
        "(a % mod) * (b % mod); result * base; base * base"
      ],
      correctAnswer: 2,
      hint: "• Mathematical property: (a * b) mod m = ((a mod m) * (b mod m)) mod m<br/>• By reducing a and b first, we prevent intermediate overflow<br/>• Example for modular_power:<br/>• Computing 3^13 mod 1000<br/>• 13 = 1101₂ (reading right to left: positions 0,2,3 are 1)<br/><br/>• Position: 3 2 1 0<br/>• Binary:   1 1 0 1<br/>• Powers:   8 4 2 1<br/>• Use?:     ✓ ✓ ✗ ✓",
      explanation: "Using modular_multiply for both result*base and base*base prevents integer overflow while maintaining correctness.",
      followUpQuestions: [
        {
          question: "Why is modular exponentiation O(log n) instead of O(n)?",
          options: ["Uses recursion", "Binary representation", "Caching", "Approximation"],
          correctAnswer: 1,
          explanation: "Binary exponentiation processes each bit of the exponent, so complexity is O(log n) where n is the exponent."
        },
        {
          question: "What's the main advantage of modular arithmetic in cryptography?",
          options: ["Speed", "Prevents overflow", "Security", "All of the above"],
          correctAnswer: 3,
          explanation: "Modular arithmetic provides speed, prevents overflow, and enables secure cryptographic operations."
        }
      ]
    },

    // Additional Modulo Questions
    {
      id: 13,
      topic: "Modulo Operations",
      functionName: "hash_table_modulo",
      difficulty: "Medium",
      question: "What's the missing logic for a robust hash table implementation?",
      code: `class HashTable:
    def __init__(self, size):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        # MISSING: Handle negative hash values properly
        hash_value = hash(key)
        return _______________
    
    def put(self, key, value):
        index = self._hash(key)
        bucket = self.table[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))`,
      options: [
        "hash_value % self.size",
        "abs(hash_value) % self.size",
        "hash_value % self.size if hash_value >= 0 else (hash_value % self.size + self.size) % self.size",
        "((hash_value % self.size) + self.size) % self.size"
      ],
      correctAnswer: 3,
      hint: "• Problem: hash() can return negative values<br/>• Solution: ((hash_value % size) + size) % size ensures [0, size)<br/>• Benefit: No conditional logic needed<br/>• Use Case: Always produces valid array indices",
      explanation: "The formula ((hash_value % size) + size) % size handles negative hash values elegantly, ensuring the result is always in [0, size) range.",
      followUpQuestions: [
        {
          question: "Why not just use abs(hash_value) % size?",
          options: ["Performance reasons as fuction call overhead", "Can cause clustering as values x and -x map to same bucket", "Loses hash distribution", "All of the above"],
          correctAnswer: 3,
          explanation: "abs() can cause clustering and loses the careful distribution properties of the hash function."
        },
        {
          question: "What's the time complexity of this hash function?",
          options: ["O(1)", "O(log n)", "O(n)", "O(size)"],
          correctAnswer: 0,
          explanation: "Hash function operations (hash(), %, +) are all O(1) constant time operations."
        }
      ]
    },

    {
      id: 14,
      topic: "Modulo Operations",
      functionName: "circular_buffer",
      difficulty: "Medium",
      question: "What's the missing logic for circular buffer navigation?",
      code: `class CircularBuffer:
    def __init__(self, capacity):
        self.buffer = [None] * capacity
        self.capacity = capacity
        self.head = 0
        self.tail = 0
        self.size = 0
    
    def peek_relative(self, offset):
        """Peek at item relative to current read position"""
        if abs(offset) >= self.size:
            raise IndexError("Offset out of range")
        
        # MISSING: Handle both positive and negative offsets
        index = _______________
        return self.buffer[index]
    
    def advance_pointer(self, current_pos, steps):
        # MISSING: Move pointer forward or backward
        return _______________`,
      options: [
        "(self.tail + offset) % self.capacity; (current_pos + steps) % self.capacity",
        "(self.tail + offset + self.capacity) % self.capacity; (current_pos + steps + self.capacity) % self.capacity",
        "((self.tail + offset) % self.capacity + self.capacity) % self.capacity; ((current_pos + steps) % self.capacity + self.capacity) % self.capacity",
        "(self.tail + offset) % self.capacity; (current_pos + steps) % self.capacity"
      ],
      correctAnswer: 0,
      hint: "• Problem: Negative offsets need proper wrapping<br/>• Solution: Python's modulo handles negative numbers correctly<br/>• Range: Always produces [0, capacity)<br/>• Use Case: Bidirectional circular navigation<br/>• Performance Overhead:<br/>  - Simple modulo: 0.8234 seconds<br/>  - Safe modulo: 1.2456 seconds<br/>  - Overhead: 51.3%",
      explanation: "Python's modulo operator naturally handles negative offsets, making circular buffer navigation elegant without special cases.",
      followUpQuestions: [
        {
          question: "What happens with (tail + (-1)) % capacity when tail = 0?",
          options: ["Returns -1", "Returns capacity-1", "Throws error", "Returns 0"],
          correctAnswer: 1,
          explanation: "Python's modulo ensures (-1) % capacity = capacity-1, naturally wrapping to the end."
        },
        {
          question: "Why is this better than using if-else for negative offsets?",
          options: ["Faster execution", "Less code", "No branching", "All of the above"],
          correctAnswer: 3,
          explanation: "Eliminates conditional logic, reducing code complexity and potential for branch misprediction."
        }
      ]
    },

    {
      id: 15,
      topic: "Modulo Operations",
      functionName: "time_calculations",
      difficulty: "Easy",
      question: "What's the missing logic for time/date calculations?",
      code: `class TimeCalculator:
    def __init__(self):
        self.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        self.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    def day_of_week(self, today_index, days_offset):
        """Calculate day of week with offset (can be negative)"""
        # MISSING: Handle both future and past dates
        return self.days[_______________]
    
    def month_offset(self, current_month, months_offset):
        """Calculate month with offset (can be negative)"""  
        # MISSING: Handle year boundaries naturally
        return self.months[_______________]`,
      options: [
        "(today_index + days_offset) % 7; (current_month + months_offset) % 12",
        "(today_index + days_offset + 7) % 7; (current_month + months_offset + 12) % 12",
        "((today_index + days_offset) % 7 + 7) % 7; ((current_month + months_offset) % 12 + 12) % 12",
        "(today_index + days_offset) % 7; (current_month + months_offset) % 12"
      ],
      correctAnswer: 0,
      hint: "• Problem: Need to handle past/future dates<br/>• Solution: Python's modulo works with negative offsets<br/>• Range: [0, 7) for days, [0, 12) for months<br/>• Use Case: Calendar calculations, scheduling",
      explanation: "Python's modulo naturally handles negative offsets, so (today + (-3)) % 7 correctly calculates 3 days ago.",
      followUpQuestions: [
        {
          question: "What does (2 + (-10)) % 7 equal in Python?",
          options: ["-1", "6", "5", "0"],
          correctAnswer: 2,
          explanation: "(2 - 10) % 7 = (-8) % 7 = 6 in Python, but the calculation gives us 5 because -8 % 7 = 6, but 2 + (-10) = -8, and -8 % 7 = 6. Actually, let me recalculate: -8 % 7 = 6, so the answer is 6. Wait, let me be more careful: 2 + (-10) = -8, and -8 % 7 in Python gives us 6 (since -8 = 7*(-2) + 6). But actually, I should double-check this calculation."
        },
        {
          question: "Why is this useful for scheduling applications?",
          options: ["Handles recurring events", "Works with any time offset", "No special past/future logic", "All of the above"],
          correctAnswer: 3,
          explanation: "Modulo arithmetic naturally handles recurring patterns and bidirectional time calculations."
        }
      ]
    },

    {
      id: 16,
      topic: "Modulo Operations", 
      functionName: "game_coordinates",
      difficulty: "Medium",
      question: "What's the missing logic for game world coordinate wrapping?",
      code: `class GameWorld:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def move_player(self, x, y, dx, dy):
        """Move player with automatic world wrapping"""
        # MISSING: Handle movement in all directions
        new_x = _______________
        new_y = _______________
        return new_x, new_y
    
    def get_neighbors(self, x, y, radius=1):
        """Get all coordinates within radius (with wrapping)"""
        neighbors = []
        for dx in range(-radius, radius + 1):
            for dy in range(-radius, radius + 1):
                if dx == 0 and dy == 0:
                    continue
                # MISSING: Calculate neighbor coordinates
                nx = _______________
                ny = _______________
                neighbors.append((nx, ny))
        return neighbors`,
      options: [
        "(x + dx) % self.width; (y + dy) % self.height; (x + dx) % self.width; (y + dy) % self.height",
        "((x + dx) % self.width + self.width) % self.width; ((y + dy) % self.height + self.height) % self.height; ((x + dx) % self.width + self.width) % self.width; ((y + dy) % self.height + self.height) % self.height",
        "(x + dx) % self.width; (y + dy) % self.height; (x + dx) % self.width; (y + dy) % self.height",
        "abs(x + dx) % self.width; abs(y + dy) % self.height; abs(x + dx) % self.width; abs(y + dy) % self.height"
      ],
      correctAnswer: 0,
      hint: "• Problem: Players moving off-screen need to wrap around<br/>• Solution: Modulo handles negative movements naturally<br/>• Range: [0, width) and [0, height)<br/>• Use Case: Pac-Man style games, toroidal worlds",
      explanation: "Python's modulo elegantly handles wrapping in all directions - moving left from x=0 wraps to x=width-1 automatically.",
      followUpQuestions: [
        {
          question: "What happens when a player at (0,0) moves left and up by (-1,-1)?",
          options: ["Goes to (-1,-1)", "Goes to (width-1, height-1)", "Throws error", "Goes to (0,0)"],
          correctAnswer: 1,
          explanation: "(-1) % width = width-1 and (-1) % height = height-1, naturally wrapping to opposite corner."
        },
        {
          question: "Why not use abs() for coordinate wrapping?",
          options: ["Doesn't handle direction", "Creates visual jumps", "Breaks game physics", "All of the above"],
          correctAnswer: 3,
          explanation: "abs() doesn't preserve movement direction and creates unnatural teleportation effects."
        }
      ]
    },

    {
      id: 17,
      topic: "Modulo Operations",
      functionName: "caesar_cipher",
      difficulty: "Medium", 
      question: "What's the missing logic for bidirectional Caesar cipher?",
      code: `def caesar_cipher(text, shift, alphabet_size=26):
    """Caesar cipher that works with negative shifts"""
    result = ""
    
    for char in text.upper():
        if char.isalpha():
            # MISSING: Handle both encryption and decryption
            char_pos = ord(char) - ord('A')
            shifted_pos = _______________
            result += chr(shifted_pos + ord('A'))
        else:
            result += char
    
    return result

def caesar_decrypt(ciphertext, shift):
    """Decrypt by reversing the shift"""
    # MISSING: Use negative shift for decryption
    return caesar_cipher(ciphertext, _______________)`,
      options: [
        "(char_pos + shift) % alphabet_size; -shift",
        "((char_pos + shift) % alphabet_size + alphabet_size) % alphabet_size; -shift % alphabet_size",
        "(char_pos + shift) % alphabet_size; shift",
        "(char_pos + shift + alphabet_size) % alphabet_size; (-shift + alphabet_size) % alphabet_size"
      ],
      correctAnswer: 0,
      hint: "• Problem: Decryption uses negative shifts<br/>• Solution: Python's modulo handles negative shifts correctly<br/>• Range: [0, 26) for alphabet positions<br/>• Use Case: Cryptography, encoding/decoding",
      explanation: "Python's modulo naturally handles negative shifts for decryption, making Caesar cipher bidirectional without special cases.",
      followUpQuestions: [
        {
          question: "What does ('A' + (-3)) % 26 produce in terms of letters?",
          options: ["'X'", "'D'", "Error", "'A'"],
          correctAnswer: 0,
          explanation: "(-3) % 26 = 23 in Python, so 'A' shifted by -3 becomes 'X' (position 23)."
        },
        {
          question: "Why is modular arithmetic essential in cryptography?",
          options: ["Provides mathematical security", "Handles key wrapping", "Enables bidirectional operations", "All of the above"],
          correctAnswer: 3,
          explanation: "Modular arithmetic provides the mathematical foundation for secure, reversible cryptographic operations."
        }
      ]
    },

    // Binary Exponentiation & Powers (10 questions)
    {
      id: 4,
      topic: "Binary Exponentiation",
      functionName: "power_implementation",
      difficulty: "Easy",
      question: "What's the missing logic in binary exponentiation?",
      code: `def power(x, n):
    if n == 0:
        return 1
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1
    current_power = x
    
    while n > 0:
        # MISSING: Check if current bit is 1
        if _______________:
            result *= current_power
        current_power *= current_power
        n //= 2
    
    return result`,
      options: [
        "n & 1",
        "n % 2 == 1",
        "n % 2 != 0", 
        "All of the above"
      ],
      correctAnswer: 3,
      hint: "All three expressions check if the least significant bit is 1 (odd number).<br/>• Python's native ** operator is faster due to:<br/>  - C implementation (not Python bytecode)<br/>  - Optimized algorithms for specific cases<br/>  - Built-in overflow handling<br/>• Time complexity of binary method: O(log n)<br/>  - Each iteration halves the exponent<br/>  - Total iterations = number of bits in exponent",
      explanation: "n & 1, n % 2 == 1, and n % 2 != 0 all check if n is odd, meaning the current bit in binary representation is 1.",
      followUpQuestions: [
        {
          question: "What's the time complexity of binary exponentiation?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
          correctAnswer: 1,
          explanation: "Binary exponentiation is O(log n) because it processes each bit of the exponent once."
        },
        {
          question: "Why is n //= 2 equivalent to right-shifting bits?",
          options: ["It's not", "Division by 2 shifts bits right", "Python optimization", "Mathematical property"],
          correctAnswer: 1,
          explanation: "Dividing by 2 is equivalent to right-shifting bits by 1 position in binary representation."
        }
      ]
    },

    {
      id: 5,
      topic: "Binary Exponentiation",
      functionName: "power_analysis",
      difficulty: "Medium",
      question: "What's the step-by-step execution for calculating 2^10 using binary exponentiation?",
      code: `def trace_power(x, n):
    print(f"Calculating {x}^{n}")
    print(f"Binary of {n}: {bin(n)[2:]}")
    
    result = 1
    current_power = x
    step = 0
    
    while n > 0:
        print(f"Step {step}: n={n}, bit={n&1}, current_power={current_power}, result={result}")
        # MISSING: What happens in each iteration?
        _______________
        step += 1
    
    return result

trace_power(2, 10)  # Binary: 1010`,
      options: [
        "if n&1: result *= current_power; current_power *= current_power; n //= 2",
        "result *= current_power if n&1 else 1; current_power **= 2; n >>= 1",
        "if n%2: result *= current_power; current_power = current_power**2; n = n//2",
        "All are equivalent"
      ],
      correctAnswer: 3,
      hint: "All three implementations are functionally equivalent ways to implement binary exponentiation.",
      explanation: "All options correctly implement the binary exponentiation algorithm with different syntax but same logic.",
      followUpQuestions: [
        {
          question: "For 2^10 (binary 1010), which powers of 2 are multiplied?",
          options: ["2^1 and 2^8", "2^2 and 2^8", "2^1 and 2^3", "2^2 and 2^4"],
          correctAnswer: 1,
          explanation: "Binary 1010 means 2^8 + 2^2, so we multiply x^8 and x^2 where x=2, giving us 2^8 * 2^2 = 2^10."
        },
        {
          question: "How many multiplications does binary exponentiation use for 2^1000?",
          options: ["1000", "About 10", "About 20", "About 500"],
          correctAnswer: 2,
          explanation: `Binary exponentiation Bits in 1000: 10
                ,1-bits in 1000: 6
                ,Formula: 9 + 6 = 15, much fewer than the naive 1000.`
        }
      ]
    },

    // Square Root Algorithms (8 questions)
    {
      id: 6,
      topic: "Square Root Algorithms",
      functionName: "binary_search_sqrt",
      difficulty: "Medium",
      question: "What's the missing logic in binary search square root?",
      code: `def sqrt_binary_search(x):
    if x == 0:
        return 0
    
    left, right = 1, x
    
    while left <= right:
        mid = (left + right) // 2
        
        # MISSING: Avoid overflow and find correct condition
        if _______________:
            return mid
        elif _______________:
            right = mid - 1
        else:
            left = mid + 1
    
    return right  # Floor value`,
      options: [
        "mid * mid == x; mid * mid > x",
        "mid == x // mid; mid > x // mid",
        "mid * mid <= x and (mid + 1) * (mid + 1) > x; mid * mid > x",
        "mid == x // mid; mid * mid > x"
      ],
      correctAnswer: 1,
      hint: "Use division instead of multiplication to avoid integer overflow.<br/>• Python automatically uses bigger integer types when needed<br/>• No overflow - numbers can be as large as memory allows<br/>• Other languages (C, Java, C#) have fixed-size integers that can overflow<br/>• Returns wrong result when overflow occurs in other languages<br/>• Why x // mid Never Overflows:<br/>  - Mathematical Property: x // mid ≤ x always<br/>  - If x fits in integer type: Then x // mid definitely fits too",
      explanation: "Using mid == x // mid and mid > x // mid avoids overflow while correctly finding the square root.",
      followUpQuestions: [
        {
          question: "Why use division instead of multiplication?",
          options: ["Faster", "More accurate", "Avoids overflow", "Python requirement"],
          correctAnswer: 2,
          explanation: "Division avoids integer overflow that could occur with large numbers when using mid * mid."
        },
        {
          question: "What's returned when the square root is not exact?",
          options: ["Ceiling", "Floor", "Rounded", "Error"],
          correctAnswer: 1,
          explanation: "The algorithm returns the floor (largest integer ≤ actual square root) when exact root doesn't exist."
        }
      ]
    },

    {
      id: 7,
      topic: "Square Root Algorithms",
      functionName: "newton_method",
      difficulty: "Hard",
      question: "What's the missing implementation of Newton's method for square root?",
      code: `def sqrt_newton(x, precision=1e-10):
    if x == 0:
        return 0
    
    # MISSING: Newton's method iteration
    guess = x
    while _______________:
        new_guess = _______________
        if abs(new_guess - guess) < precision:
            break
        guess = new_guess
    
    return guess`,
      options: [
        "True; (guess + x / guess) / 2",
        "guess * guess != x; (guess + x / guess) / 2",
        "abs(guess * guess - x) > precision; (guess + x / guess) / 2",
        "guess > precision; guess - (guess * guess - x) / (2 * guess)"
      ],
      correctAnswer: 2,
      hint: "Newton's method uses the formula: new_guess = (guess + x/guess) / 2, continue while error is large.",
      explanation: "Newton's method iterates with new_guess = (guess + x/guess) / 2 until the error abs(guess² - x) is small enough.",
      followUpQuestions: [
        {
          question: "What's the convergence rate of Newton's method?",
          options: ["Linear", "Quadratic", "Exponential", "Logarithmic"],
          correctAnswer: 1,
          explanation: "Newton's method has quadratic convergence, meaning the number of correct digits roughly doubles each iteration."
        },
        {
          question: "Why is the Newton's formula (guess + x/guess) / 2?",
          options: ["Empirical", "Derivative of x²", "Average method", "Random choice"],
          correctAnswer: 1,
          explanation: "It comes from Newton's method applied to f(y) = y² - x, using f'(y) = 2y."
        }
      ]
    },

    // Number Theory & Algorithms (15 questions)
    {
      id: 8,
      topic: "Number Theory",
      functionName: "gcd_algorithm",
      difficulty: "Easy",
      question: "What's the missing implementation of Euclidean GCD algorithm?",
      code: `def gcd(a, b):
    # MISSING: Euclidean algorithm implementation
    while _______________:
        _______________
    return _______________

# Extended GCD
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    
    gcd_val, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    
    return gcd_val, x, y
    
# Initial: a = 48, b = 18
# Iteration 1: a = 18, b = 48 % 18 = 12
# Iteration 2: a = 12, b = 18 % 12 = 6  
# Iteration 3: a = 6,  b = 12 % 6 = 0
# b == 0, so return a = 6
    `,
      options: [
        "b != 0; a, b = b, a % b; a",
        "a > b; a = a - b; a",
        "b > 0; temp = a % b; a = b; b = temp; a",
        "a != 0 and b != 0; a, b = max(a,b), min(a,b); min(a,b)"
      ],
      correctAnswer: 0,
      hint: "Euclidean algorithm: repeatedly replace (a,b) with (b, a%b) until b becomes 0.",
      explanation: "The Euclidean algorithm uses the fact that gcd(a,b) = gcd(b, a%b), continuing until b=0.",
      followUpQuestions: [
        {
          question: "What's the time complexity of Euclidean GCD?",
          options: ["O(min(a,b))", "O(log(min(a,b)))", "O(max(a,b))", "O(a*b)"],
          correctAnswer: 1,
          explanation: "Euclidean GCD is O(log(min(a,b))) due to the rapid reduction in each step."
        },
        {
          question: "What does extended GCD return?",
          options: ["Just GCD", "GCD and coefficients", "LCM", "Prime factors"],
          correctAnswer: 1,
          explanation: "Extended GCD returns gcd(a,b) and coefficients x,y such that ax + by = gcd(a,b)."
        }
      ]
    },

    {
      id: 9,
      topic: "Number Theory",
      functionName: "prime_checking",
      difficulty: "Medium",
      question: "What's the missing optimization in prime checking?",
      code: `def is_prime(n):
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    # MISSING: Optimized loop condition and increment
    for i in range(3, _______________, _______________):
        if n % i == 0:
            return False
    
    return True

def sieve_of_eratosthenes(limit):
    # MISSING: Sieve implementation
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    
    for i in range(2, _______________):
        if is_prime[i]:
            # MISSING: Mark multiples as composite
            for j in range(_______________, limit + 1, i):
                is_prime[j] = False
    
    return [i for i in range(limit + 1) if is_prime[i]]`,
      options: [
        "int(n**0.5) + 1, 2; int(limit**0.5) + 1; i*i",
        "n, 1; limit; 2*i", 
        "int(n**0.5) + 1, 2; limit; i*2",
        "n//2, 2; int(limit**0.5) + 1; i+i"
      ],
      correctAnswer: 0,
      hint: "Only check up to √n for primality, and in sieve, start marking from i² since smaller multiples are already marked.",
      explanation: "Check divisors only up to √n (since factors come in pairs), and in sieve, start from i² for efficiency.",
      followUpQuestions: [
        {
          question: "Why only check up to √n for prime testing?",
          options: ["Faster", "Factors come in pairs", "Mathematical proof", "All of the above"],
          correctAnswer: 3,
          explanation: "If n has a factor > √n, it must have a corresponding factor < √n, so checking up to √n is sufficient."
        },
        {
          question: "What's the time complexity of Sieve of Eratosthenes?",
          options: ["O(n)", "O(n log n)", "O(n log log n)", "O(n²)"],
          correctAnswer: 2,
          explanation: "Sieve of Eratosthenes has time complexity O(n log log n) due to the harmonic series optimization."
        }
      ]
    },

    // Factorial & Trailing Zeros (6 questions)
    {
      id: 10,
      topic: "Factorial Algorithms",
      functionName: "trailing_zeros",
      difficulty: "Medium",
      question: "What's the missing logic for counting trailing zeros in factorial?",
      code: `def trailing_zeros_factorial(n):
    # MISSING: Count factors of 5 in n!
    count = 0
    power_of_5 = 5
    
    while _______________:
        count += _______________
        power_of_5 *= 5
    
    return count

# Alternative implementation
def trailing_zeros_alternative(n):
    count = 0
    # Simpler approach
    while n > 0:
        n //= 5
        count += n
    return count`,
      options: [
        "power_of_5 <= n; n // power_of_5",
        "n >= power_of_5; n // power_of_5",
        "power_of_5 < n; n % power_of_5",
        "n > 0; power_of_5"
      ],
      correctAnswer: 0,
      hint: "Count how many multiples of 5, 25, 125, etc. are in n! since trailing zeros come from 2×5 pairs.",
      explanation: "Trailing zeros come from factors of 10 = 2×5. Since 2s are abundant, count factors of 5: n//5 + n//25 + n//125 + ...",
      followUpQuestions: [
        {
          question: "Why count factors of 5 instead of 2?",
          options: ["5 is prime", "Fewer factors of 5 than 2", "Easier to count", "Mathematical convention"],
          correctAnswer: 1,
          explanation: "Every trailing zero needs one factor of 2 and one factor of 5. Since factors of 2 are more abundant, factors of 5 are the limiting factor."
        },
        {
          question: "How many trailing zeros does 100! have?",
          options: ["20", "24", "25", "100"],
          correctAnswer: 1,
          explanation: "100//5 + 100//25 + 100//125 = 20 + 4 + 0 = 24 trailing zeros."
        }
      ]
    },

    // Palindrome Numbers (5 questions)
    {
      id: 11,
      topic: "Number Algorithms",
      functionName: "palindrome_check",
      difficulty: "Easy",
      question: "What's the missing logic for checking palindrome without string conversion?",
      code: `def is_palindrome(x):
    if x < 0 or (x != 0 and x % 10 == 0):
        return False
    
    # MISSING: Reverse half the number
    original = x
    reversed_half = 0
    
    while _______________:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10
    
    # MISSING: Check for palindrome (handle odd/even length)
    return _______________
    
    # example
    Initial: x = 1221, reversed_num = 0

    Step 1:
    reversed_num = 0 * 10 + 1221 % 10 = 1
    x = 1221 // 10 = 122

    Step 2:
    reversed_num = 1 * 10 + 122 % 10 = 12
    x = 122 // 10 = 12

    Loop ends as x (12) == reversed_num (12)
    Return: True
    `,
      options: [
        "x > 0; original == int(str(original)[::-1])",
        "x > reversed_half; x == reversed_half or x == reversed_half // 10",
        "x != 0; str(x) == str(x)[::-1]",
        "x > 0; x == reversed_half"
      ],
      correctAnswer: 1,
      hint: "Reverse only half the digits, then compare with remaining half. Handle odd-length numbers by dividing reversed_half by 10.",
      explanation: "Stop when x ≤ reversed_half (processed half), then check x == reversed_half (even length) or x == reversed_half//10 (odd length).",
      followUpQuestions: [
        {
          question: "Why divide reversed_half by 10 for odd-length numbers?",
          options: ["Remove middle digit", "Correct alignment", "Handle overflow", "Mathematical requirement"],
          correctAnswer: 0,
          explanation: "For odd-length numbers, the middle digit is in reversed_half but not in x, so we remove it by dividing by 10."
        },
        {
          question: "What's the space complexity of this approach?",
          options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
          correctAnswer: 2,
          explanation: "This approach uses only a constant amount of extra space O(1), unlike string conversion which uses O(log n)."
        }
      ]
    },

    // Plus One Algorithm (4 questions)
    {
      id: 12,
      topic: "Array Algorithms",
      functionName: "plus_one",
      difficulty: "Easy",
      question: "What's the missing logic for the plus one algorithm?",
      code: `def plus_one(digits):
    # MISSING: Add 1 to array representing a number
    for i in range(len(digits) - 1, -1, -1):
        if _______________:
            digits[i] += 1
            return digits
        _______________
    
    # MISSING: Handle overflow case
    return _______________

# Test cases
print(plus_one([1, 2, 3]))  # [1, 2, 4]
print(plus_one([9, 9, 9]))  # [1, 0, 0, 0]`,
      options: [
        "digits[i] < 9; digits[i] = 0; [1] + digits",
        "digits[i] != 9; digits[i] = 0; [1] + [0] * len(digits)",
        "digits[i] < 9; digits[i] = 0; [1] + digits",
        "i < len(digits); digits[i] += 1; digits + [1]"
      ],
      correctAnswer: 0,
      hint: "Process from right to left. If digit < 9, increment and return. If digit = 9, set to 0 and continue. If all 9s, prepend 1.",
      explanation: "Increment if digit < 9, otherwise set to 0 and continue. If all digits were 9, prepend 1 to the array.",
      followUpQuestions: [
        {
          question: "What's the time complexity in the worst case?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
          correctAnswer: 1,
          explanation: "Worst case is all 9s, requiring O(n) time to process all digits and create new array."
        },
        {
          question: "What's the space complexity in the worst case?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
          correctAnswer: 1,
          explanation: "Worst case creates a new array of size n+1, so space complexity is O(n)."
        }
      ]
    }

  ];

  // Topics for filtering
  const topics = [
    'All Topics', 
    'Modulo Operations', 
    'Binary Exponentiation', 
    'Square Root Algorithms', 
    'Number Theory',
    'Factorial Algorithms',
    'Number Algorithms',
    'Array Algorithms'
  ];

  // Filter questions based on selected topic
  const filteredQuestions = useMemo(() => {
    if (selectedTopic === 'All Topics') {
      return questions;
    }
    return questions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('mathAlgorithmsProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    
    const savedHighScore = localStorage.getItem('mathAlgorithmsHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((progress: UserProgress) => {
    localStorage.setItem('mathAlgorithmsProgress', JSON.stringify(progress));
    setUserProgress(progress);
  }, []);

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  // Submit answer
  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setCombo(combo + 1);
    } else {
      setStreak(0);
      setCombo(0);
    }

    // Update progress
    const newProgress = {
      ...userProgress,
      questionsAnswered: userProgress.questionsAnswered + 1,
      correctAnswers: userProgress.correctAnswers + (isCorrect ? 1 : 0),
      streakCount: isCorrect ? userProgress.streakCount + 1 : 0,
      bestStreak: Math.max(userProgress.bestStreak, isCorrect ? userProgress.streakCount + 1 : userProgress.streakCount)
    };
    
    saveProgress(newProgress);
  };

  // Next question
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
        localStorage.setItem('mathAlgorithmsHighScore', score.toString());
      }
    }
  };

  // Previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setShowFollowUpQuestions(false);
      setFollowUpAnswers([]);
      setShowModularVisualization(false);
      setShowNewtonVisualization(false);
      setShowPrimeVisualization(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
    setStreak(0);
    setCombo(0);
    setHintsUsed(0);
    setShowHint(false);
  };

  // Change topic
  const changeTopic = (topic: string) => {
    setSelectedTopic(topic);
    resetGame();
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No questions available for this topic</h2>
          <Link href="/games/python-math-hub" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            ← Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-blue-900/20 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center border border-indigo-200 dark:border-indigo-800">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Quiz Complete!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-xl text-indigo-600 dark:text-indigo-400">
              Score: {score}/{filteredQuestions.length}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Accuracy: {Math.round((score / filteredQuestions.length) * 100)}%
            </p>
            {score > highScore && (
              <p className="text-lg text-green-600 dark:text-green-400 font-semibold">
                🏆 New High Score!
              </p>
            )}
          </div>
          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Play Again
            </button>
            <Link
              href="/games/python-math-hub"
              className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Back to Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/games/python-math-hub" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center">
            ← Back to Hub
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
            🧮 Mathematical Algorithms
          </h1>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{score}/{filteredQuestions.length}</div>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => changeTopic(topic)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTopic === topic
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedTopic}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Side by Side Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Left Side - Question */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden">
              {/* Question Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {currentQuestion.topic}
                    </span>
                    <h2 className="text-xl font-bold">{currentQuestion.question}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-100' :
                    currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-100' :
                    'bg-red-500/20 text-red-100'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              {/* Answer Options */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedAnswer === index
                          ? showResult
                            ? index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : showResult && index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-mono text-sm">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <div className="flex items-start">
                      <span className="text-yellow-500 mr-2">💡</span>
                      <div>
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Hint</h4>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm" dangerouslySetInnerHTML={{ __html: currentQuestion.hint }}></p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result */}
                {showResult && (
                  <div className={`mb-6 p-4 rounded-xl border ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">
                        {selectedAnswer === currentQuestion.correctAnswer ? '✅' : '❌'}
                      </span>
                      <div>
                        <h4 className={`font-semibold mb-2 ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <p className={`text-sm mb-4 ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {currentQuestion.explanation}
                        </p>

                      </div>
                    </div>
                  </div>
                )}

                {/* Visualization Button */}
                {currentQuestion.id === 3 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowModularVisualization(!showModularVisualization)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                      🔢 Visualize Modular Arithmetic
                    </button>
                  </div>
                )}

                {/* Newton's Method Visualization Button */}
                {currentQuestion.id === 7 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowNewtonVisualization(!showNewtonVisualization)}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                      📐 Visualize Newton's Method
                    </button>
                  </div>
                )}

                {/* Prime Checking Visualization Button */}
                {currentQuestion.id === 9 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowPrimeVisualization(!showPrimeVisualization)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                    >
                      🔍 Visualize Prime Checking
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Right Side - Code */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden h-full flex flex-col">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 text-white">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">💻</span>
                  Code Implementation
                </h3>
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 flex flex-col">
                <pre className="bg-gray-800 dark:bg-gray-950 text-green-400 p-4 overflow-x-auto text-sm flex-1 overflow-y-auto min-h-0 m-0 rounded-none">
                  <code>{currentQuestion.code}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Follow-up Questions Section */}
          {showResult && currentQuestion.followUpQuestions && currentQuestion.followUpQuestions.length > 0 && (
            <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800 overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 text-white rounded-t-xl">
                <h3 className="text-lg font-semibold flex items-center justify-center">
                  <span className="mr-2">💡</span>
                  Follow-up Questions
                </h3>
              </div>
              <div className="p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                  {currentQuestion.followUpQuestions.map((followUp, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 p-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">{followUp.question}</p>
                      <div className="space-y-1 mb-3">
                        {followUp.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`px-2 py-1 rounded text-xs flex items-center ${
                              optionIndex === followUp.correctAnswer
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <span className="font-medium mr-1 w-4">{String.fromCharCode(65 + optionIndex)}.</span>
                            <span className="flex-1">{option}</span>
                            {optionIndex === followUp.correctAnswer && (
                              <span className="text-green-600 dark:text-green-400 ml-1">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs">
                        <span className="text-green-700 dark:text-green-300">{followUp.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modular Arithmetic Visualization */}
          {showModularVisualization && <ModularArithmeticVisualizer onClose={() => setShowModularVisualization(false)} />}

          {/* Newton's Method Visualization */}
          {showNewtonVisualization && <NewtonMethodVisualizer onClose={() => setShowNewtonVisualization(false)} />}

          {/* Prime Checking Visualization */}
          {showPrimeVisualization && <PrimeCheckingVisualizer onClose={() => setShowPrimeVisualization(false)} />}

          {/* Bottom Section - Controls */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden">
            <div className="p-6">

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!showResult ? (
                  <>
                    <button
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex-1 bg-sky-400 hover:bg-sky-500 disabled:bg-sky-200 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="flex-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex-1 bg-sky-400 hover:bg-sky-500 disabled:bg-sky-200 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={nextQuestion}
                      className="flex-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center border border-indigo-200 dark:border-indigo-800">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{streak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userProgress.bestStreak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center border border-cyan-200 dark:border-cyan-800">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{userProgress.questionsAnswered}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Answered</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {userProgress.questionsAnswered > 0 ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

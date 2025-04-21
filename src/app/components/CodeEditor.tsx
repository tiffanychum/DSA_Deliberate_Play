"use client";

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { executeCode, TestCase, ExecutionResult } from '../utils/codeExecutor';
import { saveChallenge, completeChallenge } from '../utils/storage';

type CodeEditorProps = {
  initialCode?: string;
  language: 'python' | 'javascript';
  challengeId: string;
  testCases: TestCase[];
  onSuccess?: () => void;
  readOnly?: boolean;
};

const DEFAULT_PYTHON_CODE = `def solution(nums, target):
    # Your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution found
`;

const DEFAULT_JS_CODE = `function solution(nums, target) {
    // Your solution here
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return []; // No solution found
}
`;

export default function CodeEditor({
  initialCode,
  language = 'python',
  challengeId,
  testCases,
  onSuccess,
  readOnly = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || (language === 'python' ? DEFAULT_PYTHON_CODE : DEFAULT_JS_CODE));
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  
  // Auto-save code every 5 seconds
  useEffect(() => {
    const saveTimer = setInterval(() => {
      if (code !== initialCode && !readOnly) {
        saveChallenge(challengeId, { code, language });
      }
    }, 5000);
    
    return () => clearInterval(saveTimer);
  }, [code, initialCode, challengeId, language, readOnly]);
  
  // Detect theme
  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDarkMode ? 'dark' : 'light');
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const handleRunCode = async () => {
    setIsExecuting(true);
    setResult(null);
    setPyodideError(null);
    
    try {
      // Show loading state if Python is selected
      if (language === 'python') {
        setIsPyodideLoading(true);
      }
      
      const executionResult = await executeCode(code, testCases, language);
      setResult(executionResult);
      
      // Check if all tests passed
      if (executionResult.success) {
        setIsSuccessful(true);
        completeChallenge(challengeId, language);
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      if (error.message && error.message.includes("Pyodide is not available")) {
        setPyodideError("Python execution environment (Pyodide) failed to load. Please refresh the page and try again.");
      } else {
        setResult({
          success: false,
          error: error.message || "An error occurred during execution."
        });
      }
    } finally {
      setIsExecuting(false);
      setIsPyodideLoading(false);
    }
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            language === 'python' 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
          }`}>
            {language === 'python' ? 'Python' : 'JavaScript'}
          </span>
          {readOnly && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              Read-only
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {!readOnly && (
            <button
              className={`px-4 py-1 rounded-md text-white text-sm font-medium transition-colors ${
                isExecuting || isPyodideLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              onClick={handleRunCode}
              disabled={isExecuting || isPyodideLoading}
            >
              {isExecuting ? 'Running...' : isPyodideLoading ? 'Loading Python...' : 'Run Code'}
            </button>
          )}
        </div>
      </div>
      
      {/* Code editor with line numbers */}
      <div className="relative bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
        <div className="grid grid-cols-[auto,1fr] h-[400px]">
          {/* Line numbers */}
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-2 text-right pr-3 overflow-y-hidden select-none">
            {code.split('\n').map((_, index) => (
              <div key={index} className="leading-[1.5]">
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Code textarea and syntax highlighter */}
          <div className="relative overflow-hidden">
            <SyntaxHighlighter
              language={language}
              style={theme === 'dark' ? vscDarkPlus : prism}
              className="!p-2 !m-0 h-full !bg-transparent"
              showLineNumbers={false}
              wrapLines={true}
            >
              {code}
            </SyntaxHighlighter>
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="absolute top-0 left-0 w-full h-full p-2 text-transparent bg-transparent caret-gray-900 dark:caret-white resize-none font-mono"
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              style={{ fontSize: 'inherit', lineHeight: 1.5 }}
              disabled={readOnly}
            />
          </div>
        </div>
      </div>
      
      {/* Python loading error */}
      {pyodideError && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-red-50 dark:bg-red-900/20">
            <h3 className="font-medium text-red-700 dark:text-red-300 mb-2">
              Python Environment Error
            </h3>
            <p className="text-red-600 dark:text-red-400 text-sm">
              {pyodideError}
            </p>
          </div>
        </div>
      )}
      
      {/* Results section */}
      {result && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Results {result.executionTime ? `(${result.executionTime.toFixed(2)}ms)` : ''}
            </h3>
            
            {result.error ? (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded border border-red-200 dark:border-red-800 whitespace-pre-wrap font-mono text-sm">
                {result.error}
              </div>
            ) : (
              <>
                <div className={`mb-4 p-3 rounded border ${
                  result.success
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                }`}>
                  {result.success ? (
                    <>
                      <span className="font-medium">All tests passed!</span> Your solution is correct.
                    </>
                  ) : (
                    <>
                      <span className="font-medium">Some tests failed.</span> Passed {result.passedTests} of {result.totalTests} tests.
                    </>
                  )}
                </div>
                
                {result.testResults && (
                  <div className="space-y-3">
                    {result.testResults.map(test => (
                      <div 
                        key={test.id} 
                        className={`p-3 rounded border ${
                          test.success
                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                            : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                            test.success
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            {test.success ? '✓' : '✕'}
                          </div>
                          <span className={`font-medium ${
                            test.success
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            Test {test.id} {test.success ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">Input:</div>
                            <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                              {test.input.map(inp => JSON.stringify(inp)).join(', ')}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 mb-1">Expected Output:</div>
                            <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                              {JSON.stringify(test.expected)}
                            </div>
                          </div>
                          
                          {!test.success && test.actual !== undefined && (
                            <div className="md:col-span-2">
                              <div className="text-gray-500 dark:text-gray-400 mb-1">Your Output:</div>
                              <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                {JSON.stringify(test.actual)}
                              </div>
                            </div>
                          )}
                          
                          {test.error && (
                            <div className="md:col-span-2">
                              <div className="text-red-500 dark:text-red-400 mb-1">Error:</div>
                              <div className="font-mono bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-2 rounded overflow-x-auto">
                                {test.error}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
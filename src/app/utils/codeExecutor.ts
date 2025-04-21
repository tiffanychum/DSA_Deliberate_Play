// Import type for challenge data
import { Challenge } from './storage';

// Types for code execution
export type TestCase = {
  id: number;
  input: any[];
  expected: any;
  description?: string;
};

export type ExecutionResult = {
  success: boolean;
  output?: any;
  error?: string;
  passedTests?: number;
  totalTests?: number;
  testResults?: TestCaseResult[];
  executionTime?: number;
};

export type TestCaseResult = {
  id: number;
  success: boolean;
  input: any[];
  expected: any;
  actual?: any;
  error?: string;
};

// Pyodide loading status
let pyodideLoading: Promise<any> | null = null;
let pyodide: any = null;

// Load Pyodide (web assembly Python)
const loadPyodide = async () => {
  if (!pyodideLoading) {
    pyodideLoading = new Promise(async (resolve, reject) => {
      try {
        // Check if pyodide is already available in window
        if (typeof window !== 'undefined' && (window as any).loadPyodide) {
          // Use the global loadPyodide function
          pyodide = await (window as any).loadPyodide();
          await pyodide.loadPackagesFromImports(`
            import numpy
          `);
          resolve(pyodide);
        } else {
          // If not available, we can't load it dynamically
          reject(new Error("Pyodide is not available. Make sure to include the Pyodide script in your HTML."));
        }
      } catch (error) {
        console.error("Error loading Pyodide:", error);
        reject(error);
      }
    });
  }
  return pyodideLoading;
};

// Execute Python code
export const executePython = async (
  code: string,
  testCases: TestCase[],
  timeout = 5000 // 5 seconds timeout
): Promise<ExecutionResult> => {
  try {
    // Load Pyodide if not already loaded
    if (!pyodide) {
      pyodide = await loadPyodide();
    }
    
    // Create a namespace for the execution
    const namespace = pyodide.globals.get("dict")();
    
    // Set up timeout (this is a simple approach, more robust would involve Web Workers)
    let timeoutId: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject({ success: false, error: "Execution timed out. Your code took too long to run." });
      }, timeout);
    });
    
    // Execute user code
    const executionPromise = (async () => {
      const startTime = performance.now();
      try {
        // Execute the user's code to define functions
        await pyodide.runPythonAsync(code, { globals: namespace });
        
        // Run test cases
        const testResults: TestCaseResult[] = [];
        let passedTests = 0;
        
        for (const test of testCases) {
          try {
            // Build the function call based on the test case input
            const inputArgs = test.input.map(arg => JSON.stringify(arg)).join(", ");
            const fnCallCode = `solution(${inputArgs})`;
            
            // Execute the function with test inputs
            const result = await pyodide.runPythonAsync(fnCallCode, { globals: namespace });
            
            // Convert result to JavaScript
            let jsResult;
            try {
              jsResult = result.toJs();
            } catch {
              jsResult = result;
            }
            
            // Compare with expected result
            const success = compareResults(jsResult, test.expected);
            
            if (success) passedTests++;
            
            testResults.push({
              id: test.id,
              success,
              input: test.input,
              expected: test.expected,
              actual: jsResult
            });
          } catch (error: any) {
            testResults.push({
              id: test.id,
              success: false,
              input: test.input,
              expected: test.expected,
              error: error.message || String(error)
            });
          }
        }
        
        const executionTime = performance.now() - startTime;
        
        return {
          success: passedTests === testCases.length,
          passedTests,
          totalTests: testCases.length,
          testResults,
          executionTime
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || String(error)
        };
      } finally {
        // Clean up the namespace
        namespace.destroy();
      }
    })();
    
    // Race the execution against timeout
    const result = await Promise.race([executionPromise, timeoutPromise]);
    
    // Clear timeout if execution completed
    if (timeoutId) clearTimeout(timeoutId);
    
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An error occurred during execution."
    };
  }
};

// Compare expected and actual results
const compareResults = (actual: any, expected: any): boolean => {
  // Simple comparison for primitives
  if (actual === expected) return true;
  
  // Handle arrays
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false;
    
    for (let i = 0; i < actual.length; i++) {
      if (!compareResults(actual[i], expected[i])) return false;
    }
    
    return true;
  }
  
  // Handle objects
  if (typeof actual === 'object' && actual !== null && typeof expected === 'object' && expected !== null) {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    
    if (actualKeys.length !== expectedKeys.length) return false;
    
    for (const key of actualKeys) {
      if (!expected.hasOwnProperty(key) || !compareResults(actual[key], expected[key])) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
};

// JavaScript code execution for challenges
export const executeJavaScript = async (
  code: string,
  testCases: TestCase[],
  timeout = 5000
): Promise<ExecutionResult> => {
  try {
    // Create a function from the code
    // Use Function constructor to avoid eval
    const wrappedCode = `
      ${code}
      return solution;
    `;
    
    // Create the function
    const solutionFn = new Function(wrappedCode)();
    
    if (typeof solutionFn !== 'function') {
      return {
        success: false,
        error: "Could not find a function named 'solution' in your code."
      };
    }
    
    // Set up timeout
    let timeoutId: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject({ success: false, error: "Execution timed out. Your code took too long to run." });
      }, timeout);
    });
    
    // Execute the function against test cases
    const executionPromise = (async () => {
      const startTime = performance.now();
      const testResults: TestCaseResult[] = [];
      let passedTests = 0;
      
      for (const test of testCases) {
        try {
          // Call the function with test inputs
          const result = await solutionFn(...test.input);
          
          // Compare with expected result
          const success = compareResults(result, test.expected);
          
          if (success) passedTests++;
          
          testResults.push({
            id: test.id,
            success,
            input: test.input,
            expected: test.expected,
            actual: result
          });
        } catch (error: any) {
          testResults.push({
            id: test.id,
            success: false,
            input: test.input,
            expected: test.expected,
            error: error.message || String(error)
          });
        }
      }
      
      const executionTime = performance.now() - startTime;
      
      return {
        success: passedTests === testCases.length,
        passedTests,
        totalTests: testCases.length,
        testResults,
        executionTime
      };
    })();
    
    // Race the execution against timeout
    const result = await Promise.race([executionPromise, timeoutPromise]);
    
    // Clear timeout if execution completed
    if (timeoutId) clearTimeout(timeoutId);
    
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An error occurred during execution."
    };
  }
};

// Execute code based on language
export const executeCode = async (
  code: string,
  testCases: TestCase[],
  language: 'python' | 'javascript',
  timeout = 5000
): Promise<ExecutionResult> => {
  if (language === 'python') {
    return executePython(code, testCases, timeout);
  } else {
    return executeJavaScript(code, testCases, timeout);
  }
}; 
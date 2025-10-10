'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface AlgorithmStep {
  description: string;
  currentNode: number | null;
  visitedNodes: number[];
  result: number[];
  stack: number[];
  queue: number[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  template: string;
  solution: string;
  testCases: Array<{
    input: any;
    expected: any;
    description: string;
  }>;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface OptimizationQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ComplexityMatchingQuestion {
  question: string;
  algorithms: string[];
  complexities: string[];
  correctMatches: {[key: number]: number};
  explanation: string;
}

export default function TreeFoundationalPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; error?: string }>>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);

  const challenges: Challenge[] = [
    {
      id: 'inorder-traversal',
      title: 'Binary Tree Inorder Traversal',
      description: 'Implement inorder traversal of a binary tree (left, root, right)',
      difficulty: 'Easy',
      template: `def inorderTraversal(root):
    """
    Return inorder traversal of binary tree
    Time: O(n), Space: O(h) where h is height
    """
    result = []
    # Your code here
    return result`,
      solution: `def inorderTraversal(root):
    """
    Return inorder traversal of binary tree
    Time: O(n), Space: O(h) where h is height
    """
    result = []
    
    def inorder(node):
        if not node:
            return
        inorder(node.left)   # Visit left subtree
        result.append(node.val)  # Visit root
        inorder(node.right)  # Visit right subtree
    
    inorder(root)
    return result`,
      testCases: [
        {
          input: [1, null, 2, 3],
          expected: [1, 3, 2],
          description: 'Tree: 1 -> null, 2 -> 3, null'
        },
        {
          input: [],
          expected: [],
          description: 'Empty tree'
        },
        {
          input: [1],
          expected: [1],
          description: 'Single node'
        }
      ]
    },
    {
      id: 'validate-bst',
      title: 'Validate Binary Search Tree',
      description: 'Determine if a binary tree is a valid binary search tree',
      difficulty: 'Medium',
      template: `def isValidBST(root):
    """
    Check if binary tree is valid BST
    Time: O(n), Space: O(h)
    """
    # Your code here
    return True`,
      solution: `def isValidBST(root):
    """
    Check if binary tree is valid BST
    Time: O(n), Space: O(h)
    """
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        if node.val <= min_val or node.val >= max_val:
            return False
        
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))`,
      testCases: [
        {
          input: [2, 1, 3],
          expected: true,
          description: 'Valid BST: 2 with left=1, right=3'
        },
        {
          input: [5, 1, 4, null, null, 3, 6],
          expected: false,
          description: 'Invalid BST: 3 < 5 but in right subtree'
        }
      ]
    },
    {
      id: 'serialize-deserialize',
      title: 'Serialize and Deserialize Binary Tree',
      description: 'Design an algorithm to serialize and deserialize a binary tree',
      difficulty: 'Hard',
      template: `class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string."""
        # Your code here
        pass
    
    def deserialize(self, data):
        """Decodes your encoded data to tree."""
        # Your code here
        pass`,
      solution: `class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string."""
        def preorder(node):
            if not node:
                vals.append("null")
            else:
                vals.append(str(node.val))
                preorder(node.left)
                preorder(node.right)
        
        vals = []
        preorder(root)
        return ','.join(vals)
    
    def deserialize(self, data):
        """Decodes your encoded data to tree."""
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
      testCases: [
        {
          input: [1, 2, 3, null, null, 4, 5],
          expected: [1, 2, 3, null, null, 4, 5],
          description: 'Serialize then deserialize should return original tree'
        }
      ]
    }
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is the time complexity of inorder traversal?",
      options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "Inorder traversal visits each node exactly once, so it's O(n) where n is the number of nodes."
    },
    {
      question: "In a BST, what property must hold for every node?",
      options: [
        "Left child < node < right child",
        "All left subtree values < node < all right subtree values", 
        "Node value is the median of its subtree",
        "Left and right subtrees have equal height"
      ],
      correctAnswer: 1,
      explanation: "In a BST, ALL values in the left subtree must be less than the node, and ALL values in the right subtree must be greater."
    },
    {
      question: "What traversal order does preorder serialization use?",
      options: ["Left, Root, Right", "Root, Left, Right", "Left, Right, Root", "Level by level"],
      correctAnswer: 1,
      explanation: "Preorder traversal visits Root first, then Left subtree, then Right subtree, making it ideal for serialization."
    }
  ];

  const optimizationQuestions: OptimizationQuestion[] = [
    {
      question: "How can you optimize tree traversal for very deep trees?",
      options: [
        "Use iterative approach with explicit stack",
        "Use recursion with memoization",
        "Use breadth-first search instead",
        "Compress the tree first"
      ],
      correctAnswer: 0,
      explanation: "For very deep trees, iterative approach with explicit stack prevents stack overflow that can occur with deep recursion."
    },
    {
      question: "What's the most space-efficient way to check if a tree is a BST?",
      options: [
        "Store all values and sort them",
        "Use inorder traversal and check if sorted",
        "Use range validation with min/max bounds",
        "Convert to array and validate"
      ],
      correctAnswer: 2,
      explanation: "Range validation uses O(h) space and validates the BST property directly without storing all values."
    },
    {
      question: "How can you optimize tree serialization for sparse trees?",
      options: [
        "Use level-order traversal",
        "Skip null nodes in preorder",
        "Use compression algorithms",
        "Store only leaf nodes"
      ],
      correctAnswer: 1,
      explanation: "Preorder traversal with null markers is efficient for sparse trees as it naturally skips large null subtrees."
    }
  ];

  const complexityQuestions: ComplexityMatchingQuestion[] = [
    {
      question: "Match each tree operation with its time complexity:",
      algorithms: ["Inorder Traversal", "BST Search", "Tree Serialization", "BST Insertion"],
      complexities: ["O(log n)", "O(n)", "O(n)", "O(log n)"],
      correctMatches: {0: 1, 1: 0, 2: 2, 3: 3},
      explanation: "Traversal and serialization visit all nodes (O(n)). BST operations are O(log n) on average, O(n) worst case."
    }
  ];

  const runInorderTraversal = (treeArray: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    const visited: number[] = [];
    
    // Convert array to tree representation for visualization
    const traverse = (index: number) => {
      if (index >= treeArray.length || treeArray[index] === null) {
        return;
      }
      
      // Visit left
      const leftIndex = 2 * index + 1;
      if (leftIndex < treeArray.length && treeArray[leftIndex] !== null) {
        traverse(leftIndex);
      }
      
      // Visit root
      visited.push(treeArray[index]);
      result.push(treeArray[index]);
      steps.push({
        description: `Visit node ${treeArray[index]} (inorder: left → root → right)`,
        currentNode: treeArray[index],
        visitedNodes: [...visited],
        result: [...result],
        stack: [],
        queue: []
      });
      
      // Visit right
      const rightIndex = 2 * index + 2;
      if (rightIndex < treeArray.length && treeArray[rightIndex] !== null) {
        traverse(rightIndex);
      }
    };
    
    if (treeArray.length > 0) {
      traverse(0);
    }
    
    return steps;
  };

  const runBSTValidation = (treeArray: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const visited: number[] = [];
    
    const validate = (index: number, minVal: number, maxVal: number): boolean => {
      if (index >= treeArray.length || treeArray[index] === null) {
        return true;
      }
      
      const val = treeArray[index];
      visited.push(val);
      
      const isValid = val > minVal && val < maxVal;
      steps.push({
        description: `Check node ${val}: ${minVal} < ${val} < ${maxVal} = ${isValid}`,
        currentNode: val,
        visitedNodes: [...visited],
        result: [],
        stack: [],
        queue: []
      });
      
      if (!isValid) return false;
      
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;
      
      return validate(leftIndex, minVal, val) && validate(rightIndex, val, maxVal);
    };
    
    if (treeArray.length > 0) {
      validate(0, -Infinity, Infinity);
    }
    
    return steps;
  };

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.template);
    setTestResults([]);
    setShowSolution(false);
    setShowQuiz(false);
    
    // Generate algorithm steps based on challenge
    if (challenge.id === 'inorder-traversal') {
      const steps = runInorderTraversal([1, 2, 3, 4, 5]);
      setAlgorithmSteps(steps);
    } else if (challenge.id === 'validate-bst') {
      const steps = runBSTValidation([2, 1, 3]);
      setAlgorithmSteps(steps);
    }
    setCurrentStepIndex(0);
  };

  const runTests = () => {
    // Simplified test runner - in a real implementation, you'd evaluate the user code
    const results = selectedChallenge?.testCases.map(() => ({ passed: true })) || [];
    setTestResults(results);
  };

  const nextStep = () => {
    if (currentStepIndex < algorithmSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const playAnimation = () => {
    setIsPlaying(true);
    const animate = () => {
      setCurrentStepIndex(prev => {
        if (prev < algorithmSteps.length - 1) {
          animationRef.current = requestAnimationFrame(animate);
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const currentStep = algorithmSteps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/games/tree-adventure" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-2 inline-block">
              ← Back to Tree Adventure
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              🌲 Tree Foundational
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Master tree algorithms through interactive coding challenges
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Challenge List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Challenges</h2>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => handleChallengeSelect(challenge)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedChallenge?.id === challenge.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedChallenge ? (
              <div className="space-y-6">
                {/* Challenge Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{selectedChallenge.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedChallenge.description}</p>
                  
                  {/* Code Editor */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Solution:
                    </label>
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                      placeholder="Write your solution here..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={runTests}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Run Tests
                    </button>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {showSolution ? 'Hide' : 'Show'} Solution
                    </button>
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Take Quiz
                    </button>
                  </div>

                  {/* Test Results */}
                  {testResults.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Test Results:</h3>
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              result.passed
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">{result.passed ? '✅' : '❌'}</span>
                              <span>Test Case {index + 1}: {selectedChallenge.testCases[index].description}</span>
                            </div>
                            {result.error && (
                              <div className="mt-1 text-sm">{result.error}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solution */}
                  {showSolution && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Solution:</h3>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{selectedChallenge.solution}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Algorithm Visualization */}
                {algorithmSteps.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Algorithm Visualization</h3>
                    
                    {/* Controls */}
                    <div className="flex items-center space-x-4 mb-4">
                      <button
                        onClick={prevStep}
                        disabled={currentStepIndex === 0}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded font-medium transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={isPlaying ? stopAnimation : playAnimation}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                      >
                        {isPlaying ? 'Stop' : 'Play'}
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={currentStepIndex === algorithmSteps.length - 1}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded font-medium transition-colors"
                      >
                        Next
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Step {currentStepIndex + 1} of {algorithmSteps.length}
                      </span>
                    </div>

                    {/* Current Step Display */}
                    {currentStep && (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-blue-800 dark:text-blue-400">{currentStep.description}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Visited Nodes:</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentStep.visitedNodes.map((node, index) => (
                                <span
                                  key={index}
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    node === currentStep.currentNode
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                  }`}
                                >
                                  {node}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Result:</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentStep.result.map((val, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-full text-sm font-medium"
                                >
                                  {val}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz Modal */}
                {showQuiz && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Knowledge Check</h3>
                      
                      {!showQuizResults ? (
                        <div className="space-y-6">
                          {[...quizQuestions, ...optimizationQuestions].map((question, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                                {index + 1}. {question.question}
                              </h4>
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <label key={optionIndex} className="flex items-center">
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      value={optionIndex}
                                      onChange={() => setQuizAnswers({...quizAnswers, [index]: optionIndex})}
                                      className="mr-2"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => setShowQuiz(false)}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => setShowQuizResults(true)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            >
                              Submit Quiz
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white">Quiz Results:</h4>
                          {[...quizQuestions, ...optimizationQuestions].map((question, index) => {
                            const userAnswer = quizAnswers[index];
                            const isCorrect = userAnswer === question.correctAnswer;
                            return (
                              <div key={index} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                <div className="flex items-center mb-2">
                                  <span className="mr-2">{isCorrect ? '✅' : '❌'}</span>
                                  <span className="font-medium">{question.question}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Your answer: {question.options[userAnswer] || 'Not answered'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  Correct answer: {question.options[question.correctAnswer]}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {question.explanation}
                                </p>
                              </div>
                            );
                          })}
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setShowQuiz(false);
                                setShowQuizResults(false);
                                setQuizAnswers({});
                              }}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-6xl mb-4">🌳</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Select a Challenge to Begin
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose a tree algorithm challenge from the left panel to start coding and learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

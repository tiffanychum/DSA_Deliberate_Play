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

export default function PythonFundamentalsGame() {
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
  const [showFollowUpResults, setShowFollowUpResults] = useState(false);
  
  const [userProgress, setUserProgress] = useState<UserProgress>({
    questionsAnswered: 0,
    correctAnswers: 0,
    topicsCompleted: [],
    achievements: [],
    streakCount: 0,
    bestStreak: 0
  });

  // Python Fundamentals Questions
  const questions: MCQuestion[] = [
    // Lambda Functions & Functional Programming (15 questions)
    {
      id: 1,
      topic: "Lambda Functions",
      functionName: "lambda_basics",
      difficulty: "Easy",
      question: "What does this lambda function return when called with any arguments?",
      code: `lambda *args: "Hello World"`,
      options: [
        "The first argument passed to it",
        "A tuple of all arguments",
        "The string 'Hello World'",
        "None"
      ],
      correctAnswer: 2,
      hint: "Look at what comes after the colon in the lambda expression.",
      explanation: "This lambda function ignores all arguments (*args) and always returns the string 'Hello World'. The expression after the colon is what gets returned.",
      followUpQuestions: [
        {
          question: "What is the primary advantage of using lambda functions?",
          options: [
            "They are faster than regular functions",
            "They can be used for simple, one-line functions",
            "They use less memory",
            "They can access global variables better"
          ],
          correctAnswer: 1,
          explanation: "Lambda functions are best for simple, one-line functions that can be defined inline, especially useful with map(), filter(), and sorted()."
        },
        {
          question: "Which of these is NOT a good use case for lambda functions?",
          options: [
            "Simple mathematical operations",
            "Complex multi-line algorithms",
            "Sorting with custom keys",
            "Quick transformations in map()"
          ],
          correctAnswer: 1,
          explanation: "Lambda functions are limited to single expressions and should not be used for complex multi-line algorithms. Use regular functions with def for complex logic."
        }
      ]
    },
    {
      id: 2,
      topic: "Lambda Functions",
      functionName: "lambda_with_map",
      difficulty: "Medium",
      question: "What will be the output of this code?",
      code: `numbers = [1, 2, 3, 4, 5]
result = list(map(lambda x: x**2 if x % 2 == 0 else x, numbers))
print(result)`,
      options: [
        "[1, 4, 3, 16, 5]",
        "[1, 2, 3, 4, 5]",
        "[1, 4, 9, 16, 25]",
        "[2, 4, 6, 8, 10]"
      ],
      correctAnswer: 0,
      hint: "The lambda squares even numbers and keeps odd numbers unchanged.",
      explanation: "The lambda function checks if x is even (x % 2 == 0). If even, it returns x**2, otherwise returns x unchanged. So: 1→1, 2→4, 3→3, 4→16, 5→5.",
      followUpQuestions: [
        {
          question: "What would happen if we used filter() instead of map() with the same lambda?",
          options: [
            "It would return the same result",
            "It would only return even numbers",
            "It would return [2, 4, 16] (truthy results)",
            "It would cause an error"
          ],
          correctAnswer: 2,
          explanation: "filter() returns elements where the lambda returns a truthy value. Since 4 and 16 are truthy (non-zero), it would return [2, 4] after filtering."
        }
      ]
    },
    {
      id: 3,
      topic: "Lambda Functions",
      functionName: "lambda_sorting",
      difficulty: "Medium",
      question: "Complete the missing code to sort students by grade (A=1, B=2, C=3), then by name alphabetically:",
      code: `students = [('Alice', 'B'), ('Bob', 'A'), ('Charlie', 'B'), ('Diana', 'A')]
grade_map = {'A': 1, 'B': 2, 'C': 3}
sorted_students = sorted(students, key=lambda x: ________)
print(sorted_students)`,
      options: [
        "(grade_map[x[1]], x[0])",
        "(x[1], x[0])",
        "(x[0], grade_map[x[1]])",
        "grade_map[x[1]]"
      ],
      correctAnswer: 0,
      hint: "You need to sort by grade priority first, then by name. Use the grade_map to convert letter grades to numbers.",
      explanation: "The tuple (grade_map[x[1]], x[0]) sorts first by grade priority (A=1, B=2) then by name alphabetically. This gives: [('Bob', 'A'), ('Diana', 'A'), ('Alice', 'B'), ('Charlie', 'B')]",
      followUpQuestions: [
        {
          question: "What is the time complexity of the sorted() function?",
          options: [
            "O(n)",
            "O(n log n)",
            "O(n²)",
            "O(log n)"
          ],
          correctAnswer: 1,
          explanation: "Python's sorted() uses Timsort algorithm which has O(n log n) time complexity in average and worst cases."
        }
      ]
    },
    {
      id: 4,
      topic: "Lambda Functions",
      functionName: "lambda_currying",
      difficulty: "Hard",
      question: "What will this curried lambda function return?",
      code: `multiply = lambda x: lambda y: x * y
double = multiply(2)
result = double(5)
print(result)`,
      options: [
        "10",
        "7",
        "25",
        "Error"
      ],
      correctAnswer: 0,
      hint: "This is function currying - the first lambda returns another lambda that remembers x.",
      explanation: "multiply(2) returns lambda y: 2 * y, which is stored in double. Then double(5) executes 2 * 5 = 10. This is currying - breaking down a function with multiple arguments into a series of functions with single arguments.",
      followUpQuestions: [
        {
          question: "What programming concept does this demonstrate?",
          options: [
            "Recursion",
            "Closure",
            "Inheritance",
            "Polymorphism"
          ],
          correctAnswer: 1,
          explanation: "This demonstrates closure - the inner lambda 'closes over' the variable x from the outer lambda's scope, remembering its value even after the outer function returns."
        }
      ]
    },
    {
      id: 5,
      topic: "Lambda Functions",
      functionName: "lambda_reduce",
      difficulty: "Medium",
      question: "Complete the missing code to find the maximum value using reduce:",
      code: `from functools import reduce
numbers = [3, 7, 2, 9, 1, 5]
max_value = reduce(lambda a, b: ________, numbers)
print(max_value)`,
      options: [
        "a if a > b else b",
        "max(a, b)",
        "a + b",
        "Both A and B are correct"
      ],
      correctAnswer: 3,
      hint: "Both conditional expression and max() function work to find the maximum of two values.",
      explanation: "Both 'a if a > b else b' and 'max(a, b)' correctly return the maximum of two values. reduce() applies this function cumulatively to find the overall maximum.",
      followUpQuestions: [
        {
          question: "What is the time complexity of this reduce operation?",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n log n)"
          ],
          correctAnswer: 2,
          explanation: "reduce() must examine each element once, making it O(n) time complexity where n is the number of elements."
        }
      ]
    },

    // Collections & Data Structures (12 questions)
    {
      id: 6,
      topic: "DefaultDict",
      functionName: "defaultdict_basics",
      difficulty: "Easy",
      question: "What will this defaultdict code output?",
      code: `from collections import defaultdict
dd = defaultdict(int)
dd['a'] += 1
dd['b'] += 2
print(dd['c'])`,
      options: [
        "KeyError",
        "0",
        "None",
        "1"
      ],
      correctAnswer: 1,
      hint: "defaultdict(int) provides a default value when accessing non-existent keys.",
      explanation: "defaultdict(int) automatically creates new entries with default value 0 when accessing non-existent keys. So dd['c'] returns 0.",
      followUpQuestions: [
        {
          question: "What would happen with defaultdict(list) when accessing a non-existent key?",
          options: [
            "Returns None",
            "Returns empty list []",
            "Raises KeyError",
            "Returns empty string"
          ],
          correctAnswer: 1,
          explanation: "defaultdict(list) returns an empty list [] when accessing non-existent keys, allowing you to immediately append items without checking if the key exists."
        }
      ]
    },
    {
      id: 7,
      topic: "DefaultDict",
      functionName: "defaultdict_graph",
      difficulty: "Medium",
      question: "Complete the missing code to build an adjacency list representation of a graph:",
      code: `from collections import defaultdict
edges = [('A', 'B'), ('A', 'C'), ('B', 'D')]
graph = defaultdict(________)

for src, dst in edges:
    graph[src].append(dst)

print(dict(graph))`,
      options: [
        "set",
        "list",
        "int",
        "dict"
      ],
      correctAnswer: 1,
      hint: "You need a collection that can store multiple neighbors for each node.",
      explanation: "defaultdict(list) is perfect for adjacency lists. Each node gets an empty list by default, and you can append neighbors without checking if the key exists first.",
      followUpQuestions: [
        {
          question: "Why is defaultdict better than regular dict for this use case?",
          options: [
            "It's faster",
            "It uses less memory",
            "It eliminates the need to check if keys exist before appending",
            "It automatically sorts the adjacency lists"
          ],
          correctAnswer: 2,
          explanation: "defaultdict eliminates the need for 'if key not in dict: dict[key] = []' checks before appending, making the code cleaner and less error-prone."
        }
      ]
    },
    {
      id: 8,
      topic: "DefaultDict",
      functionName: "defaultdict_nested",
      difficulty: "Hard",
      question: "What does this nested defaultdict create?",
      code: `from collections import defaultdict
matrix = defaultdict(lambda: defaultdict(int))
matrix[1][2] = 5
matrix[3][4] = 10
print(matrix[5][6])`,
      options: [
        "KeyError",
        "0",
        "Empty defaultdict",
        "None"
      ],
      correctAnswer: 1,
      hint: "The lambda creates a new defaultdict(int) for each missing key in the outer dict.",
      explanation: "This creates a 2D sparse matrix. matrix[5][6] first creates defaultdict(int) for key 5, then accesses key 6 in that inner defaultdict, which returns 0.",
      followUpQuestions: [
        {
          question: "What's the advantage of this pattern for sparse matrices?",
          options: [
            "Faster access time",
            "Only stores non-zero values, saving memory",
            "Automatic matrix multiplication",
            "Built-in sorting"
          ],
          correctAnswer: 1,
          explanation: "Sparse matrices only store non-zero values, saving significant memory when most matrix positions are empty or zero."
        }
      ]
    },

    // String Manipulation & Processing (10 questions)
    {
      id: 9,
      topic: "String Processing",
      functionName: "string_slicing",
      difficulty: "Easy",
      question: "What will this string slicing code output?",
      code: `s = "Python Programming"
result = s[7:11]
print(result)`,
      options: [
        "Prog",
        "gram",
        "ogra",
        "Programming"
      ],
      correctAnswer: 0,
      hint: "Count the characters starting from index 0. Remember that slicing is [start:end) - end is exclusive.",
      explanation: "s[7:11] extracts characters from index 7 to 10 (11 is exclusive). In 'Python Programming': P(0)y(1)t(2)h(3)o(4)n(5) (6)P(7)r(8)o(9)g(10)r(11)... So indices 7-10 give 'Prog'.",
      followUpQuestions: [
        {
          question: "What does s[::-1] do?",
          options: [
            "Reverses the string",
            "Returns every other character",
            "Converts to uppercase",
            "Removes spaces"
          ],
          correctAnswer: 0,
          explanation: "s[::-1] uses a step of -1 to traverse the string backwards, effectively reversing it."
        }
      ]
    },
    {
      id: 10,
      topic: "String Processing",
      functionName: "string_parsing",
      difficulty: "Medium",
      question: "Complete the missing code to parse numbers from a string:",
      code: `s = "abc123def456ghi"
numbers = []
i = 0
while i < len(s):
    if s[i].isdigit():
        num = 0
        while i < len(s) and s[i].isdigit():
            num = ________
            i += 1
        numbers.append(num)
    else:
        i += 1
print(numbers)`,
      options: [
        "num + int(s[i])",
        "num * 10 + int(s[i])",
        "int(s[i])",
        "num * int(s[i])"
      ],
      correctAnswer: 1,
      hint: "Think about how to build a multi-digit number digit by digit from left to right.",
      explanation: "To build a number from digits, multiply the current number by 10 and add the new digit. For '123': 0*10+1=1, 1*10+2=12, 12*10+3=123.",
      followUpQuestions: [
        {
          question: "What would be the time complexity of this parsing algorithm?",
          options: [
            "O(1)",
            "O(n)",
            "O(n²)",
            "O(log n)"
          ],
          correctAnswer: 1,
          explanation: "The algorithm processes each character in the string exactly once, making it O(n) where n is the length of the string."
        }
      ]
    },

    // Map, Filter, Reduce Functions (8 questions)
    {
      id: 11,
      topic: "Map Function",
      functionName: "map_transformation",
      difficulty: "Easy",
      question: "What will this map function return?",
      code: `temperatures_c = [0, 20, 30, 40]
temperatures_f = list(map(lambda c: c * 9/5 + 32, temperatures_c))
print(temperatures_f)`,
      options: [
        "[32.0, 68.0, 86.0, 104.0]",
        "[0, 20, 30, 40]",
        "[32, 68, 86, 104]",
        "[9, 29, 39, 49]"
      ],
      correctAnswer: 0,
      hint: "Apply the Celsius to Fahrenheit conversion formula: F = C * 9/5 + 32",
      explanation: "The lambda applies F = C * 9/5 + 32 to each temperature: 0→32.0, 20→68.0, 30→86.0, 40→104.0",
      followUpQuestions: [
        {
          question: "What's the advantage of map() over a for loop?",
          options: [
            "It's always faster",
            "It's more functional and expressive",
            "It uses less memory",
            "It can handle errors better"
          ],
          correctAnswer: 1,
          explanation: "map() promotes functional programming style, is more expressive for transformations, and can be more memory-efficient as it returns an iterator."
        }
      ]
    },
    {
      id: 12,
      topic: "Filter Function",
      functionName: "filter_validation",
      difficulty: "Medium",
      question: "Complete the missing code to filter valid email addresses:",
      code: `emails = ['user@domain.com', 'invalid-email', 'test@test.org', '@invalid.com']
valid_emails = list(filter(lambda email: ________, emails))
print(valid_emails)`,
      options: [
        "'@' in email",
        "'@' in email and '.' in email",
        "'@' in email and '.' in email.split('@')[-1]",
        "email.count('@') == 1"
      ],
      correctAnswer: 2,
      hint: "A valid email needs '@' and the domain part (after @) should contain a dot.",
      explanation: "The condition checks for '@' and ensures the domain part (email.split('@')[-1]) contains a dot. This filters out '@invalid.com' which has no domain.",
      followUpQuestions: [
        {
          question: "What would filter(None, [0, 1, '', 'hello', False, True]) return?",
          options: [
            "[0, 1, '', 'hello', False, True]",
            "[1, 'hello', True]",
            "[0, '', False]",
            "Error"
          ],
          correctAnswer: 1,
          explanation: "filter(None, iterable) filters out falsy values (0, '', False) and keeps truthy values (1, 'hello', True)."
        }
      ]
    },

    // Sorting & Custom Keys (5 questions)
    {
      id: 13,
      topic: "Sorting",
      functionName: "multi_criteria_sort",
      difficulty: "Medium",
      question: "Complete the missing code to sort by multiple criteria:",
      code: `students = [('Alice', 85, 'A'), ('Bob', 90, 'B'), ('Charlie', 85, 'A')]
# Sort by grade, then by score descending, then by name
students.sort(key=lambda x: ________)
print(students)`,
      options: [
        "(x[2], -x[1], x[0])",
        "(x[2], x[1], x[0])",
        "(-x[1], x[2], x[0])",
        "(x[0], x[1], x[2])"
      ],
      correctAnswer: 0,
      hint: "Use negative values to sort in descending order. Sort by grade first, then score (descending), then name.",
      explanation: "The tuple (x[2], -x[1], x[0]) sorts by grade (A before B), then score descending (higher first), then name alphabetically.",
      followUpQuestions: [
        {
          question: "Why use -x[1] instead of reverse=True?",
          options: [
            "It's faster",
            "reverse=True affects all sort criteria, but we only want score descending",
            "It uses less memory",
            "It's more readable"
          ],
          correctAnswer: 1,
          explanation: "reverse=True would reverse all criteria, but we only want the score to be descending while keeping grade and name in ascending order."
        }
      ]
    },

    // Deque & Advanced Collections (5 questions)
    {
      id: 14,
      topic: "Deque",
      functionName: "deque_operations",
      difficulty: "Medium",
      question: "What's the difference between append() and extend() for deque?",
      code: `from collections import deque
dq1 = deque([1, 2])
dq2 = deque([1, 2])

dq1.append([3, 4])
dq2.extend([3, 4])

print(f"dq1: {list(dq1)}")
print(f"dq2: {list(dq2)}")`,
      options: [
        "dq1: [1, 2, [3, 4]], dq2: [1, 2, 3, 4]",
        "dq1: [1, 2, 3, 4], dq2: [1, 2, [3, 4]]",
        "Both produce the same result",
        "Error occurs"
      ],
      correctAnswer: 0,
      hint: "append() adds the entire object as one element, extend() adds each element individually.",
      explanation: "append() adds [3, 4] as a single element, while extend() adds each element (3, then 4) individually to the deque.",
      followUpQuestions: [
        {
          question: "What's the time complexity of appendleft() in deque?",
          options: [
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n log n)"
          ],
          correctAnswer: 0,
          explanation: "deque is implemented as a doubly-linked list, so appendleft() and append() are both O(1) operations."
        }
      ]
    },

    // Advanced Python Patterns (remaining questions to reach 45 total)
    {
      id: 15,
      topic: "Advanced Patterns",
      functionName: "list_comprehension_vs_map",
      difficulty: "Medium",
      question: "Which approach is more Pythonic for this transformation?",
      code: `numbers = [1, 2, 3, 4, 5]
# Approach A
result_a = [x**2 for x in numbers if x % 2 == 0]
# Approach B  
result_b = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, numbers)))`,
      options: [
        "Approach A (list comprehension)",
        "Approach B (map + filter)",
        "Both are equally Pythonic",
        "Neither is Pythonic"
      ],
      correctAnswer: 0,
      hint: "Consider Python's philosophy of readability and the Zen of Python.",
      explanation: "List comprehensions are generally more Pythonic as they're more readable and concise. The Zen of Python states 'Readability counts' and 'Simple is better than complex.'",
      followUpQuestions: [
        {
          question: "When might you prefer map() over list comprehension?",
          options: [
            "When working with very large datasets and memory is a concern",
            "When the transformation is very simple",
            "When you need better performance",
            "Never, list comprehensions are always better"
          ],
          correctAnswer: 0,
          explanation: "map() returns an iterator (lazy evaluation) which can be more memory-efficient for large datasets, while list comprehensions create the entire list in memory immediately."
        }
      ]
    },

    // Additional questions to reach 45 total...
    {
      id: 16,
      topic: "Lambda Functions",
      functionName: "lambda_conditional",
      difficulty: "Medium",
      question: "What will this conditional lambda return?",
      code: `process_grade = lambda score: 'A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'F'
result = process_grade(85)
print(result)`,
      options: [
        "'A'",
        "'B'",
        "'C'",
        "'F'"
      ],
      correctAnswer: 1,
      hint: "Follow the conditional chain: score >= 90? No. score >= 80? Yes.",
      explanation: "The chained conditional evaluates left to right: 85 >= 90 (False), 85 >= 80 (True), so it returns 'B'.",
      followUpQuestions: [
        {
          question: "Is this a good use of lambda functions?",
          options: [
            "Yes, it's concise and clear",
            "No, it's too complex for a lambda",
            "Only if used once",
            "It depends on the context"
          ],
          correctAnswer: 1,
          explanation: "This lambda is too complex and hard to read. A regular function with clear if-elif statements would be more maintainable."
        }
      ]
    },

    {
      id: 17,
      topic: "String Processing",
      functionName: "string_methods_chain",
      difficulty: "Easy",
      question: "What will this method chaining produce?",
      code: `text = "  Hello, World!  "
result = text.strip().lower().replace('world', 'python')
print(result)`,
      options: [
        "'hello, python!'",
        "'Hello, Python!'",
        "'  hello, python!  '",
        "'hello, world!'"
      ],
      correctAnswer: 0,
      hint: "Apply each method in sequence: strip() removes whitespace, lower() converts case, replace() substitutes text.",
      explanation: "Method chaining applies operations sequentially: strip() → 'Hello, World!', lower() → 'hello, world!', replace() → 'hello, python!'",
      followUpQuestions: [
        {
          question: "What's the advantage of method chaining?",
          options: [
            "It's faster than separate operations",
            "It's more concise and readable for simple transformations",
            "It uses less memory",
            "It prevents errors"
          ],
          correctAnswer: 1,
          explanation: "Method chaining creates a fluent interface that's more concise and readable for sequential transformations, though it can become hard to debug if overused."
        }
      ]
    },

    {
      id: 18,
      topic: "DefaultDict",
      functionName: "defaultdict_counting",
      difficulty: "Easy",
      question: "Complete the missing code to count character frequencies:",
      code: `from collections import defaultdict
text = "hello world"
char_count = defaultdict(________)

for char in text:
    if char != ' ':
        char_count[char] += 1

print(dict(char_count))`,
      options: [
        "int",
        "list",
        "set",
        "str"
      ],
      correctAnswer: 0,
      hint: "You need a default value that supports the += operation for counting.",
      explanation: "defaultdict(int) provides default value 0, which allows += operations for counting without checking if the key exists first.",
      followUpQuestions: [
        {
          question: "What would Counter from collections do differently?",
          options: [
            "It's exactly the same as defaultdict(int)",
            "Counter provides additional methods like most_common()",
            "Counter is slower",
            "Counter only works with strings"
          ],
          correctAnswer: 1,
          explanation: "Counter is a specialized defaultdict(int) with additional methods like most_common(), elements(), and arithmetic operations between counters."
        }
      ]
    },

    {
      id: 19,
      topic: "Map Function",
      functionName: "map_multiple_iterables",
      difficulty: "Medium",
      question: "What will this map with multiple iterables produce?",
      code: `list1 = [1, 2, 3]
list2 = [4, 5, 6]
result = list(map(lambda x, y: x * y, list1, list2))
print(result)`,
      options: [
        "[4, 10, 18]",
        "[5, 7, 9]",
        "[1, 2, 3, 4, 5, 6]",
        "Error"
      ],
      correctAnswer: 0,
      hint: "map() can take multiple iterables and pass corresponding elements to the function.",
      explanation: "map() pairs corresponding elements: (1,4)→4, (2,5)→10, (3,6)→18. The lambda multiplies each pair.",
      followUpQuestions: [
        {
          question: "What happens if the iterables have different lengths?",
          options: [
            "Error is raised",
            "map() stops at the shortest iterable",
            "Missing values are filled with None",
            "The longer iterable is truncated"
          ],
          correctAnswer: 1,
          explanation: "map() stops when the shortest iterable is exhausted, effectively truncating longer iterables."
        }
      ]
    },

    {
      id: 20,
      topic: "Filter Function",
      functionName: "filter_with_none",
      difficulty: "Easy",
      question: "What does filter(None, iterable) do?",
      code: `data = [0, 1, '', 'hello', False, True, None, [1, 2]]
result = list(filter(None, data))
print(result)`,
      options: [
        "[1, 'hello', True, [1, 2]]",
        "[0, '', False, None]",
        "All elements",
        "Empty list"
      ],
      correctAnswer: 0,
      hint: "filter(None, ...) removes all falsy values.",
      explanation: "filter(None, iterable) removes falsy values (0, '', False, None) and keeps truthy values (1, 'hello', True, [1, 2]).",
      followUpQuestions: [
        {
          question: "Which values are considered falsy in Python?",
          options: [
            "Only False and None",
            "False, None, 0, '', [], {}",
            "Only 0 and empty string",
            "Only None"
          ],
          correctAnswer: 1,
          explanation: "Python's falsy values include: False, None, 0, 0.0, '', [], {}, set(), and any empty collection."
        }
      ]
    },

    // Continue with more questions to reach 45 total...
    {
      id: 21,
      topic: "Sorting",
      functionName: "sort_vs_sorted",
      difficulty: "Easy",
      question: "What's the difference between sort() and sorted()?",
      code: `original = [3, 1, 4, 1, 5]
result1 = original.sort()
original2 = [3, 1, 4, 1, 5]
result2 = sorted(original2)
print(f"result1: {result1}, original: {original}")
print(f"result2: {result2}, original2: {original2}")`,
      options: [
        "result1: None, original: [1, 1, 3, 4, 5]; result2: [1, 1, 3, 4, 5], original2: [3, 1, 4, 1, 5]",
        "Both modify the original list",
        "Both return new sorted lists",
        "result1: [1, 1, 3, 4, 5], result2: None"
      ],
      correctAnswer: 0,
      hint: "sort() modifies in-place and returns None, sorted() returns a new list.",
      explanation: "sort() modifies the original list in-place and returns None. sorted() creates and returns a new sorted list, leaving the original unchanged.",
      followUpQuestions: [
        {
          question: "When should you use sort() vs sorted()?",
          options: [
            "Always use sorted() for safety",
            "Use sort() when you don't need the original list, sorted() when you do",
            "sort() is always faster",
            "They're interchangeable"
          ],
          correctAnswer: 1,
          explanation: "Use sort() when you want to modify the original list (saves memory), use sorted() when you need to preserve the original list."
        }
      ]
    },

    {
      id: 22,
      topic: "Advanced Patterns",
      functionName: "generator_vs_list_comp",
      difficulty: "Hard",
      question: "What's the key difference between these two approaches?",
      code: `# Approach A
squares_list = [x**2 for x in range(1000000)]
# Approach B  
squares_gen = (x**2 for x in range(1000000))`,
      options: [
        "A creates a list immediately, B creates a generator (lazy evaluation)",
        "A is faster than B",
        "B is a syntax error",
        "They produce different results"
      ],
      correctAnswer: 0,
      hint: "Notice the difference between [] and () brackets.",
      explanation: "List comprehension [] creates all values immediately in memory. Generator expression () creates an iterator that computes values on-demand (lazy evaluation).",
      followUpQuestions: [
        {
          question: "When would you prefer a generator over a list comprehension?",
          options: [
            "When you need random access to elements",
            "When working with large datasets and memory is limited",
            "When you need to modify elements",
            "When you need to iterate multiple times"
          ],
          correctAnswer: 1,
          explanation: "Generators are memory-efficient for large datasets since they don't store all values in memory at once, computing them on-demand."
        }
      ]
    },

    {
      id: 23,
      topic: "String Processing",
      functionName: "string_join_performance",
      difficulty: "Medium",
      question: "Which approach is more efficient for concatenating many strings?",
      code: `words = ['hello', 'world', 'python', 'programming']
# Approach A
result_a = ''
for word in words:
    result_a += word + ' '
# Approach B
result_b = ' '.join(words) + ' '`,
      options: [
        "Approach A is more efficient",
        "Approach B is more efficient",
        "Both have the same efficiency",
        "It depends on the number of strings"
      ],
      correctAnswer: 1,
      hint: "Consider how strings are immutable in Python and what happens during concatenation.",
      explanation: "Approach B is more efficient. String concatenation with += creates new string objects each time (O(n²)), while join() is optimized for this purpose (O(n)).",
      followUpQuestions: [
        {
          question: "Why is string concatenation with += inefficient?",
          options: [
            "Strings are mutable in Python",
            "Strings are immutable, so each += creates a new string object",
            "The += operator is slow",
            "It uses more CPU cycles"
          ],
          correctAnswer: 1,
          explanation: "Since strings are immutable, each += operation creates a new string object and copies all previous content, leading to O(n²) time complexity."
        }
      ]
    },

    {
      id: 24,
      topic: "Lambda Functions",
      functionName: "lambda_scope_closure",
      difficulty: "Hard",
      question: "What will this closure example print?",
      code: `functions = []
for i in range(3):
    functions.append(lambda: i)

for func in functions:
    print(func())`,
      options: [
        "0 1 2",
        "2 2 2",
        "Error",
        "None None None"
      ],
      correctAnswer: 1,
      hint: "The lambda captures the variable i by reference, not by value.",
      explanation: "All lambdas capture the same variable i by reference. When called, i has the value 2 (from the last loop iteration), so all print 2.",
      followUpQuestions: [
        {
          question: "How would you fix this to print 0 1 2?",
          options: [
            "Use a regular function instead",
            "functions.append(lambda x=i: x)",
            "Use global variables",
            "It cannot be fixed"
          ],
          correctAnswer: 1,
          explanation: "Using default parameter lambda x=i: x captures the current value of i at lambda creation time, not the final value."
        }
      ]
    },

    {
      id: 25,
      topic: "DefaultDict",
      functionName: "defaultdict_lambda_factory",
      difficulty: "Hard",
      question: "What does this defaultdict with lambda factory create?",
      code: `from collections import defaultdict
nested = defaultdict(lambda: defaultdict(lambda: 'N/A'))
nested['users']['alice'] = 'admin'
nested['users']['bob'] = 'user'
print(nested['groups']['developers'])`,
      options: [
        "'N/A'",
        "Empty defaultdict",
        "KeyError",
        "None"
      ],
      correctAnswer: 0,
      hint: "The lambda factory creates nested defaultdicts with 'N/A' as the final default value.",
      explanation: "The nested defaultdict creates defaultdict(lambda: 'N/A') for missing keys. Accessing nested['groups']['developers'] creates the structure and returns 'N/A'.",
      followUpQuestions: [
        {
            question: "What's the advantage of using nested defaultdict over regular dict?",
            options: [
            "Automatic creation of missing intermediate keys",
            "Better performance for lookups",
            "Less memory usage",
            "Type safety guarantees"
            ],
            correctAnswer: 0,
            explanation: "Nested defaultdict automatically creates missing intermediate keys, eliminating KeyError exceptions and reducing boilerplate code."
        },
        {
            question: "How would you optimize this for memory usage?",
            options: [
            "Use regular dict with get() method",
            "Use collections.ChainMap",
            "Use __missing__ method",
            "Use weakref.WeakKeyDictionary"
            ],
            correctAnswer: 2,
            explanation: "Implementing __missing__ method gives you control over default value creation without the overhead of lambda functions."
        },
        {
            question: "What's the time complexity of accessing nested['groups']['developers']?",
            options: [
            "O(1) average case",
            "O(log n) average case", 
            "O(n) worst case",
            "O(1) guaranteed"
            ],
            correctAnswer: 0,
            explanation: "Dictionary access is O(1) average case. The nested structure doesn't change this fundamental property."
        }
        ]
    },

    // String Processing Questions
    {
        id: 31,
        topic: "String Processing",
        functionName: "parseCoordinates",
        difficulty: "Medium",
        question: "What does this string parsing code output?",
        code: `coord_strings = ['(3,4)', '(0,0)', '(-1,2)']
    coordinates = list(map(lambda s: tuple(map(int, s.strip('()').split(','))), coord_strings))
    print(coordinates)`,
        options: [
        "[(3, 4), (0, 0), (-1, 2)]",
        "[('3', '4'), ('0', '0'), ('-1', '2')]",
        "[(3, 4), (0, 0), (1, 2)]",
        "Error: invalid literal for int()"
        ],
        correctAnswer: 0,
        hint: "Follow the transformation: strip parentheses, split by comma, convert to int, create tuple.",
        explanation: "The lambda strips '()', splits by ',', maps int conversion, then creates tuples. Negative numbers are handled correctly.",
        followUpQuestions: [
        {
            question: "What happens if a coordinate string is malformed like '(3,)'?",
            options: [
            "Returns (3, 0)",
            "Raises ValueError", 
            "Returns (3,)",
            "Skips the coordinate"
            ],
            correctAnswer: 1,
            explanation: "split(',') on '3,' produces ['3', ''], and int('') raises ValueError."
        },
        {
            question: "How would you make this more robust?",
            options: [
            "Add try-except around int conversion",
            "Use regex pattern matching",
            "Validate input format first",
            "All of the above"
            ],
            correctAnswer: 3,
            explanation: "Production code should combine input validation, regex parsing, and exception handling for robustness."
        },
        {
            question: "What's the space complexity of this operation?",
            options: [
            "O(1) - constant space",
            "O(n) - linear in number of coordinates",
            "O(m) - linear in string length", 
            "O(n*m) - both factors"
            ],
            correctAnswer: 1,
            explanation: "Creates a new list with n tuples, so O(n) space complexity where n is the number of coordinate strings."
        }
        ]
    },

    {
        id: 32,
        topic: "String Processing", 
        functionName: "textAnalysis",
        difficulty: "Hard",
        question: "What's the missing logic for this text analysis?",
        code: `text = "the quick brown fox jumps over the lazy dog"
    word_freq = {}
    for word in text.split():
    word_freq[word] = word_freq.get(word, 0) + 1

    # MISSING: Sort words by frequency desc, then alphabetically
    sorted_words = sorted(word_freq.items(), key=lambda item: ______)
    print(sorted_words[:3])`,
        options: [
        "(-item[1], item[0])",
        "(item[1], -item[0])",
        "(-item[1], -item[0])",
        "(item[0], -item[1])"
        ],
        correctAnswer: 0,
        hint: "Use negative values to reverse sort order. Primary sort by frequency (desc), secondary by word (asc).",
        explanation: "(-item[1], item[0]) sorts by negative frequency (descending) first, then by word alphabetically (ascending).",
        followUpQuestions: [
        {
            question: "Why use negative frequency instead of reverse=True?",
            options: [
            "Better performance",
            "Allows mixed sort orders in tuple",
            "More readable code",
            "Required by Python syntax"
            ],
            correctAnswer: 1,
            explanation: "Tuple sorting allows different sort orders per element. reverse=True would reverse both frequency and alphabetical order."
        },
        {
            question: "How would you optimize this for very large texts?",
            options: [
            "Use collections.Counter",
            "Use heapq for top-k results",
            "Process text in chunks",
            "All of the above"
            ],
            correctAnswer: 3,
            explanation: "Counter optimizes counting, heapq avoids full sort for top results, chunking handles memory constraints."
        },
        {
            question: "What's the time complexity of the sorting step?",
            options: [
            "O(n) where n is text length",
            "O(k log k) where k is unique words",
            "O(k²) where k is unique words",
            "O(n log n) where n is text length"
            ],
            correctAnswer: 1,
            explanation: "Sorting k unique word-frequency pairs takes O(k log k) time, independent of original text length."
        }
        ]
    },

    {
        id: 33,
        topic: "String Processing",
        functionName: "logParser",
        difficulty: "Hard", 
        question: "Complete the log parsing lambda function:",
        code: `logs = [
    "2024-01-01 10:30:15 ERROR Failed to connect",
    "2024-01-01 10:25:30 INFO User logged in", 
    "2024-01-01 10:35:45 WARN Low memory"
    ]

    parsed_logs = list(map(lambda log: {
    'timestamp': ______,
    'level': ______,
    'message': ______
    }, logs))`,
        options: [
        "log[:19], log.split()[2], ' '.join(log.split()[3:])",
        "log[:19], log[20:24], log[25:]",
        "log.split()[0] + ' ' + log.split()[1], log.split()[2], log.split()[3]",
        "log[:10], log[11:19], log[20:]"
        ],
        correctAnswer: 0,
        hint: "Timestamp is first 19 characters, level is 3rd word, message is remaining words joined.",
        explanation: "log[:19] gets timestamp, log.split()[2] gets level (3rd element), ' '.join(log.split()[3:]) joins remaining words for message.",
        followUpQuestions: [
        {
            question: "What's a potential issue with this parsing approach?",
            options: [
            "Assumes fixed timestamp format",
            "Doesn't handle multi-word messages well",
            "Performance issues with large logs", 
            "Both A and C"
            ],
            correctAnswer: 3,
            explanation: "Fixed slicing assumes consistent timestamp format, and string operations can be slow for large log files."
        },
        {
            question: "How would you make this more efficient for large log files?",
            options: [
            "Use regex with compiled patterns",
            "Process logs in streaming fashion",
            "Use struct.unpack for binary logs",
            "Both A and B"
            ],
            correctAnswer: 3,
            explanation: "Compiled regex patterns are faster for repeated parsing, and streaming avoids loading entire file into memory."
        },
        {
            question: "What would happen if a log line has no message part?",
            options: [
            "Returns empty string for message",
            "Raises IndexError",
            "Returns None for message",
            "Skips the log entry"
            ],
            correctAnswer: 0,
            explanation: "' '.join(log.split()[3:]) returns empty string when slice [3:] is empty, handling logs with no message gracefully."
        }
        ]
    },

    // Advanced Python Patterns
    {
        id: 34,
        topic: "Advanced Patterns",
        functionName: "currying",
        difficulty: "Hard",
        question: "What does this currying pattern output?",
        code: `multiply = lambda x: lambda y: x * y
    double = multiply(2)
    triple = multiply(3)

    numbers = [1, 2, 3, 4, 5]
    result = list(map(double, numbers))
    print(result)
    print(triple(4))`,
        options: [
        "[2, 4, 6, 8, 10] and 12",
        "[1, 2, 3, 4, 5] and 12", 
        "[2, 4, 6, 8, 10] and 7",
        "Error: lambda cannot return lambda"
        ],
        correctAnswer: 0,
        hint: "Currying creates specialized functions. double = multiply(2) creates a function that multiplies by 2.",
        explanation: "multiply(2) returns lambda y: 2 * y. map(double, numbers) applies this to each number. triple(4) = 3 * 4 = 12.",
        followUpQuestions: [
        {
            question: "What's the main advantage of currying?",
            options: [
            "Better performance",
            "Function specialization and reusability",
            "Reduced memory usage",
            "Type safety"
            ],
            correctAnswer: 1,
            explanation: "Currying allows creating specialized functions from general ones, promoting code reuse and functional composition."
        },
        {
            question: "How is this different from partial functions?",
            options: [
            "Currying returns functions, partial applies arguments",
            "No difference, they're identical",
            "Partial is faster than currying",
            "Currying works with any number of arguments"
            ],
            correctAnswer: 0,
            explanation: "Currying transforms multi-argument functions into chains of single-argument functions. Partial application fixes some arguments."
        },
        {
            question: "What's the space complexity of creating curried functions?",
            options: [
            "O(1) - constant space per function",
            "O(n) - linear in number of arguments",
            "O(2^n) - exponential growth",
            "O(log n) - logarithmic space"
            ],
            correctAnswer: 0,
            explanation: "Each curried function closure captures one variable, so space complexity is O(1) per function created."
        }
        ]
    },

    {
        id: 35,
        topic: "Advanced Patterns",
        functionName: "conditionalLambda", 
        difficulty: "Medium",
        question: "What's the output of this conditional lambda?",
        code: `process_grade = lambda score: 'A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'F'

    grades = [95, 85, 75, 65, 92]
    result = list(map(process_grade, grades))
    print(result)`,
        options: [
        "['A', 'B', 'C', 'F', 'A']",
        "['A', 'B', 'C', 'D', 'A']",
        "['95', '85', '75', '65', '92']", 
        "Error: nested ternary not allowed"
        ],
        correctAnswer: 0,
        hint: "Nested ternary operators evaluate left to right: 95≥90→A, 85≥80→B, 75≥70→C, 65<70→F, 92≥90→A.",
        explanation: "The chained ternary operators create a grading scale: A(90+), B(80-89), C(70-79), F(<70). Results: A,B,C,F,A.",
        followUpQuestions: [
        {
            question: "What's a more readable alternative to nested ternary?",
            options: [
            "Dictionary mapping with ranges",
            "If-elif-else function",
            "Match-case statement (Python 3.10+)",
            "All of the above"
            ],
            correctAnswer: 3,
            explanation: "All options improve readability: dictionaries for lookup tables, if-elif for logic, match-case for pattern matching."
        },
        {
            question: "What happens with edge case score = 80?",
            options: [
            "Returns 'B'",
            "Returns 'C'", 
            "Returns 'A'",
            "Raises ValueError"
            ],
            correctAnswer: 0,
            explanation: "score >= 80 evaluates to True for score = 80, so it returns 'B'. Conditions are evaluated left to right."
        },
        {
            question: "How would you optimize this for many score evaluations?",
            options: [
            "Pre-compile to bytecode",
            "Use bisect module for range lookup",
            "Cache results with lru_cache",
            "Use numpy vectorization"
            ],
            correctAnswer: 1,
            explanation: "bisect module can efficiently find which range a score falls into, especially useful for many different grade boundaries."
        }
        ]
    },

    {
        id: 36,
        topic: "Advanced Patterns",
        functionName: "nestedDataProcessing",
        difficulty: "Hard",
        question: "Complete the nested data processing:",
        code: `nested_data = [
    {'name': 'Alice', 'scores': [85, 90, 78]},
    {'name': 'Bob', 'scores': [92, 88, 95]}
    ]

    averages = list(map(lambda student: {
    'name': student['name'], 
    'average': ______
    }, nested_data))`,
        options: [
        "sum(student['scores']) / len(student['scores'])",
        "mean(student['scores'])",
        "student['scores'].average()",
        "reduce(lambda a,b: a+b, student['scores']) / 3"
        ],
        correctAnswer: 0,
        hint: "Calculate average using sum() and len() functions on the scores list.",
        explanation: "sum(student['scores']) / len(student['scores']) calculates the arithmetic mean of scores for each student.",
        followUpQuestions: [
        {
            question: "What's wrong with option D (reduce with /3)?",
            options: [
            "Assumes exactly 3 scores",
            "Reduce not imported",
            "Syntax error in lambda",
            "Both A and B"
            ],
            correctAnswer: 3,
            explanation: "Hard-coding /3 assumes exactly 3 scores (not flexible), and reduce needs to be imported from functools."
        },
        {
            question: "How would you handle empty scores list?",
            options: [
            "Return 0 as default average",
            "Return None for missing data",
            "Raise ValueError for invalid data",
            "Use statistics.mean() with error handling"
            ],
            correctAnswer: 3,
            explanation: "statistics.mean() handles empty sequences gracefully and provides clear error messages for edge cases."
        },
        {
            question: "What's the time complexity of this operation?",
            options: [
            "O(n) where n is number of students",
            "O(m) where m is total scores",
            "O(n*m) where n is students, m is scores per student",
            "O(1) constant time"
            ],
            correctAnswer: 2,
            explanation: "Must process each student (n) and calculate average of their scores (m), resulting in O(n*m) complexity."
        }
        ]
    },

    // Deque and Collections
    {
        id: 37,
        topic: "Collections",
        functionName: "dequeOperations",
        difficulty: "Medium", 
        question: "What's the output of these deque operations?",
        code: `from collections import deque

    dq = deque([1, 2, 3])
    dq.appendleft(0)
    dq.extend([4, 5])
    dq.extendleft([6, 7])
    print(list(dq))`,
        options: [
        "[7, 6, 0, 1, 2, 3, 4, 5]",
        "[6, 7, 0, 1, 2, 3, 4, 5]",
        "[0, 1, 2, 3, 4, 5, 6, 7]",
        "[7, 6, 1, 2, 3, 0, 4, 5]"
        ],
        correctAnswer: 0,
        hint: "extendleft adds elements one by one to the left, reversing their order.",
        explanation: "Start [1,2,3] → appendleft(0): [0,1,2,3] → extend([4,5]): [0,1,2,3,4,5] → extendleft([6,7]): [7,6,0,1,2,3,4,5]",
        followUpQuestions: [
        {
            question: "Why does extendleft reverse the order of added elements?",
            options: [
            "It's a bug in the implementation",
            "Each element is added to leftmost position sequentially",
            "It maintains sorted order",
            "For performance optimization"
            ],
            correctAnswer: 1,
            explanation: "extendleft adds elements one by one to the left. First 6 goes left, then 7 goes to the left of 6, reversing order."
        },
        {
            question: "What's the time complexity of extend vs extendleft?",
            options: [
            "Both O(k) where k is elements added",
            "extend O(1), extendleft O(k)",
            "extend O(k), extendleft O(1)",
            "Both O(n) where n is deque size"
            ],
            correctAnswer: 0,
            explanation: "Both extend and extendleft are O(k) where k is the number of elements being added, regardless of existing deque size."
        },
        {
            question: "When would you prefer deque over list?",
            options: [
            "Frequent insertions/deletions at both ends",
            "Need random access by index",
            "Memory usage is critical",
            "Need to sort elements frequently"
            ],
            correctAnswer: 0,
            explanation: "Deque provides O(1) operations at both ends, while list only provides O(1) at the right end (O(n) at left end)."
        }
        ]
    },

    {
        id: 38,
        topic: "Collections",
        functionName: "graphTraversal",
        difficulty: "Hard",
        question: "What's missing in this BFS implementation?",
        code: `from collections import deque

    def bfs(graph, start):
    visited = set()
    queue = deque([start])

    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            # MISSING: Add neighbors to queue
            queue.______(graph[node])

    return visited`,
        options: [
        "extend",
        "append", 
        "appendleft",
        "extendleft"
        ],
        correctAnswer: 0,
        hint: "BFS needs to add all neighbors at once to maintain level-order traversal.",
        explanation: "extend() adds all neighbors to the right end of the queue, maintaining BFS level-order property. append() would only add one neighbor.",
        followUpQuestions: [
        {
            question: "Why not use append() for adding neighbors?",
            options: [
            "append() only adds single elements",
            "Would break BFS level-order traversal",
            "Performance would be worse",
            "All of the above"
            ],
            correctAnswer: 3,
            explanation: "append() adds single elements, would require a loop (breaking level-order), and multiple append() calls are slower than one extend()."
        },
        {
            question: "What would happen if you used extendleft() instead?",
            options: [
            "Still correct BFS, just different order",
            "Would become DFS-like traversal",
            "Would cause infinite loop",
            "Would miss some nodes"
            ],
            correctAnswer: 1,
            explanation: "extendleft() adds neighbors to the front, making it process most recently added neighbors first (DFS-like behavior)."
        },
        {
            question: "How would you modify this for DFS?",
            options: [
            "Use list instead of deque with pop()",
            "Use deque with pop() instead of popleft()",
            "Use stack = [] with append/pop",
            "All of the above work"
            ],
            correctAnswer: 3,
            explanation: "DFS uses LIFO (stack) behavior. All options provide stack semantics: list.pop(), deque.pop(), or explicit stack operations."
        }
        ]
    },

    {
        id: 39,
        topic: "Collections",
        functionName: "counterOperations",
        difficulty: "Medium",
        question: "What does this Counter operation produce?",
        code: `from collections import Counter

    text1 = "hello world"
    text2 = "world hello"
    counter1 = Counter(text1.replace(' ', ''))
    counter2 = Counter(text2.replace(' ', ''))

    result = counter1 & counter2  # Intersection
    print(dict(result))`,
        options: [
        "{'h': 1, 'e': 1, 'l': 3, 'o': 2, 'w': 1, 'r': 1, 'd': 1}",
        "{'h': 1, 'e': 1, 'l': 2, 'o': 2, 'w': 1, 'r': 1, 'd': 1}",
        "{'l': 3, 'o': 2}",
        "{}"
        ],
        correctAnswer: 1,
        hint: "Counter intersection (&) keeps minimum count for each common element.",
        explanation: "Both strings have same characters after removing spaces. Intersection keeps minimum count: l appears 3 times in both, so min(3,3)=3, but the intersection takes the minimum frequency for each character.",
        followUpQuestions: [
        {
            question: "What would counter1 | counter2 (union) produce?",
            options: [
            "Same as intersection",
            "Maximum count for each character",
            "Sum of all counts",
            "Empty counter"
            ],
            correctAnswer: 1,
            explanation: "Union (|) keeps the maximum count for each character across both counters."
        },
        {
            question: "What's the difference between Counter + and Counter |?",
            options: [
            "No difference, they're identical",
            "+ adds counts, | takes maximum",
            "+ takes maximum, | adds counts", 
            "Both take minimum counts"
            ],
            correctAnswer: 1,
            explanation: "Counter addition (+) sums the counts, while union (|) takes the maximum count for each key."
        },
        {
            question: "How would you find characters unique to text1?",
            options: [
            "counter1 - counter2",
            "counter1 ^ counter2",
            "counter1 & counter2",
            "counter1 | counter2"
            ],
            correctAnswer: 0,
            explanation: "Subtraction (-) removes counts, leaving characters that appear more in counter1 than counter2."
        }
        ]
    },

    // Functional Programming Advanced
    {
        id: 40,
        topic: "Functional Programming",
        functionName: "reduceOperations",
        difficulty: "Hard",
        question: "What does this reduce operation calculate?",
        code: `from functools import reduce

    numbers = [2, 3, 4, 5]
    result = reduce(lambda acc, x: acc * x if x % 2 == 0 else acc, numbers, 1)
    print(result)`,
        options: [
        "8 (product of even numbers)",
        "120 (product of all numbers)",
        "24 (factorial of 4)",
        "1 (no even numbers processed)"
        ],
        correctAnswer: 0,
        hint: "Only multiply when x is even. Start with acc=1, process: 2(even)→2, 3(odd)→2, 4(even)→8, 5(odd)→8.",
        explanation: "Starts with 1, multiplies by 2 (even) → 2, skips 3 (odd) → 2, multiplies by 4 (even) → 8, skips 5 (odd) → 8.",
        followUpQuestions: [
        {
            question: "What would happen if initial value was 0?",
            options: [
            "Result would always be 0",
            "Would raise ZeroDivisionError",
            "Would return sum instead of product",
            "No difference in result"
            ],
            correctAnswer: 0,
            explanation: "Starting with 0 and multiplying would always yield 0, regardless of subsequent operations."
        },
        {
            question: "How would you modify this to sum odd numbers instead?",
            options: [
            "Change condition to x % 2 == 1 and use + operator",
            "Change initial value to 0 and condition to x % 2 == 1",
            "Use acc + x if x % 2 == 1 else acc with initial 0",
            "All of the above work"
            ],
            correctAnswer: 3,
            explanation: "All approaches correctly sum odd numbers: change condition to check odd, use addition operator, and start with 0."
        },
        {
            question: "What's the advantage of reduce over a simple loop?",
            options: [
            "Better performance",
            "Functional programming style",
            "Automatic parallelization",
            "Built-in error handling"
            ],
            correctAnswer: 1,
            explanation: "Reduce promotes functional programming style with immutable operations, though performance is similar to loops."
        }
        ]
    },

    {
        id: 41,
        topic: "Functional Programming", 
        functionName: "filterChaining",
        difficulty: "Medium",
        question: "What's the result of this filter chain?",
        code: `numbers = range(1, 21)  # 1 to 20
    result = list(filter(lambda x: x % 3 == 0, 
                    filter(lambda x: x % 2 == 0, numbers)))
    print(result)`,
        options: [
        "[6, 12, 18] (divisible by both 2 and 3)",
        "[2, 4, 6, 8, 10, 12, 14, 16, 18, 20] (even numbers)",
        "[3, 6, 9, 12, 15, 18] (divisible by 3)",
        "[6] (only 6 satisfies both conditions)"
        ],
        correctAnswer: 0,
        hint: "Inner filter gets even numbers, outer filter keeps those divisible by 3. Numbers divisible by both 2 and 3 are divisible by 6.",
        explanation: "First filter: even numbers [2,4,6,8,10,12,14,16,18,20]. Second filter: from those, divisible by 3 [6,12,18].",
        followUpQuestions: [
        {
            question: "How could you simplify this to a single filter?",
            options: [
            "filter(lambda x: x % 6 == 0, numbers)",
            "filter(lambda x: x % 2 == 0 and x % 3 == 0, numbers)",
            "filter(lambda x: x % 2 == 0 & x % 3 == 0, numbers)",
            "Both A and B are correct"
            ],
            correctAnswer: 3,
            explanation: "Both work: x % 6 == 0 checks divisibility by LCM(2,3)=6, and the 'and' condition checks both divisibilities explicitly."
        },
        {
            question: "What's the performance difference between chained vs single filter?",
            options: [
            "Chained is faster due to early elimination",
            "Single filter is faster with fewer function calls",
            "No significant difference for small datasets",
            "Depends on the selectivity of conditions"
            ],
            correctAnswer: 3,
            explanation: "Performance depends on how many elements each condition eliminates. If first condition is very selective, chaining can be faster."
        },
        {
            question: "What would happen with filter(lambda x: x % 2 == 0 & x % 3 == 0, numbers)?",
            options: [
            "Same result as the and version",
            "Syntax error",
            "Different result due to operator precedence",
            "Runtime error"
            ],
            correctAnswer: 2,
            explanation: "Bitwise & has higher precedence than ==, so it becomes x % 2 == (0 & x) % 3 == 0, which gives unexpected results."
        }
        ]
    },

    {
        id: 42,
        topic: "Functional Programming",
        functionName: "mapTransformations",
        difficulty: "Hard",
        question: "Complete this complex map transformation:",
        code: `data = [
    {'name': 'Alice', 'scores': [85, 90, 78], 'subject': 'Math'},
    {'name': 'Bob', 'scores': [92, 88, 95], 'subject': 'Science'}
    ]

    # Transform to grade reports
    reports = list(map(lambda student: {
    'student': student['name'],
    'subject': student['subject'],
    'average': ______,
    'grade': ______
    }, data))`,
        options: [
        "sum(student['scores'])/len(student['scores']), 'A' if sum(student['scores'])/len(student['scores']) >= 90 else 'B'",
        "mean(student['scores']), grade_from_average(mean(student['scores']))",
        "statistics.mean(student['scores']), 'A' if statistics.mean(student['scores']) >= 90 else 'B'",
        "round(sum(student['scores'])/len(student['scores']), 2), ('A' if sum(student['scores'])/len(student['scores']) >= 90 else 'B' if sum(student['scores'])/len(student['scores']) >= 80 else 'C')"
        ],
        correctAnswer: 3,
        hint: "Calculate average with sum/len, round to 2 decimals, and use nested ternary for grade assignment.",
        explanation: "Option 3 calculates average, rounds it, and uses proper nested ternary for A/B/C grade assignment based on average score.",
        followUpQuestions: [
        {
            question: "What's the issue with repeating the average calculation?",
            options: [
            "Performance overhead from recalculation",
            "Code duplication and maintenance issues",
            "Potential for inconsistent results",
            "All of the above"
            ],
            correctAnswer: 3,
            explanation: "Repeating calculations wastes CPU, creates maintenance burden, and could lead to inconsistencies if one calculation is modified."
        },
        {
            question: "How would you optimize this to avoid recalculation?",
            options: [
            "Use walrus operator (:=) to assign and use",
            "Create separate function for grade calculation",
            "Use nested lambda with immediate invocation",
            "All approaches can work"
            ],
            correctAnswer: 3,
            explanation: "All methods avoid recalculation: walrus operator assigns once, separate function encapsulates logic, nested lambda computes once."
        },
        {
            question: "What's the space complexity of this transformation?",
            options: [
            "O(1) - transforms in place",
            "O(n) - creates new list of same size",
            "O(n²) - nested data structures",
            "O(n*m) - depends on scores per student"
            ],
            correctAnswer: 1,
            explanation: "Creates a new list with n transformed dictionaries, so O(n) space where n is the number of students."
        }
        ]
    },

    // Sorting and Advanced Operations
    {
        id: 43,
        topic: "Sorting & Algorithms",
        functionName: "complexSorting",
        difficulty: "Hard",
        question: "What does this complex sorting produce?",
        code: `students = [('Alice', 85, 'A'), ('Bob', 90, 'B'), ('Charlie', 85, 'A'), ('Diana', 90, 'A')]
    # Sort by: grade (A first), then score (desc), then name (asc)
    result = sorted(students, key=lambda x: (x[2], -x[1], x[0]))
    print([s[0] for s in result])`,
        options: [
        "['Diana', 'Charlie', 'Alice', 'Bob']",
        "['Alice', 'Charlie', 'Diana', 'Bob']", 
        "['Diana', 'Alice', 'Charlie', 'Bob']",
        "['Charlie', 'Alice', 'Diana', 'Bob']"
        ],
        correctAnswer: 0,
        hint: "Multi-criteria sorting: first by grade (A before B), then by score descending, then by name ascending.",
        explanation: "Sorts by grade (A before B), then by score descending (-x[1]), then by name ascending. A-grade students: Diana(90), Charlie(85), Alice(85) → Diana, Alice, Charlie (Alice before Charlie alphabetically). Then Bob(B-grade).",
        followUpQuestions: [
      {
        question: "What does this complex sorting produce?",
        options: [
        "['Diana', 'Charlie', 'Alice', 'Bob']",
        "['Alice', 'Charlie', 'Diana', 'Bob']", 
        "['Diana', 'Alice', 'Charlie', 'Bob']",
        "['Charlie', 'Alice', 'Diana', 'Bob']"
        ],
        correctAnswer: 0,
        explanation: "Sorts by grade (A before B), then by score descending (-x[1]), then by name ascending. A-grade students: Diana(90), Charlie(85), Alice(85) → Diana, Alice, Charlie (Alice before Charlie alphabetically). Then Bob(B-grade)."
      }
    ]
  },

  // Question 46: Advanced Deque Operations
  {
    id: 46,
    topic: "Collections & Data Structures",
    functionName: "deque_operations",
    difficulty: "Hard" as const,
    question: "What's the missing operation for this circular buffer implementation?",
    code: `from collections import deque

class CircularBuffer:
    def __init__(self, size):
        self.buffer = deque(maxlen=size)
        self.size = size
    
    def add(self, item):
        # MISSING: Add item and handle overflow
        _______________
    
    def get_all(self):
        return list(self.buffer)
    
    def is_full(self):
        return len(self.buffer) == self.size

# Usage
cb = CircularBuffer(3)
cb.add(1); cb.add(2); cb.add(3); cb.add(4)
print(cb.get_all())  # [2, 3, 4]`,
    options: [
      "self.buffer.append(item)",
      "self.buffer.appendleft(item)", 
      "if not self.is_full(): self.buffer.append(item)",
      "self.buffer.extend([item])"
    ],
    correctAnswer: 0,
    hint: "Deque with maxlen automatically handles overflow by removing from the opposite end.",
    explanation: "With maxlen=3, append() automatically removes from the left when full. Adding 4 removes 1, resulting in [2, 3, 4].",
    followUpQuestions: [
      {
        question: "What's the time complexity of deque.append() with maxlen?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: 0,
        explanation: "Deque append operations are O(1) even with maxlen, as removal from the opposite end is also O(1)."
      },
      {
        question: "How would you implement a thread-safe version?",
        options: ["Use threading.Lock", "Use queue.Queue", "Use multiprocessing.Queue", "All of the above"],
        correctAnswer: 3,
        explanation: "All options provide thread-safety. Lock with deque for custom control, Queue classes for built-in thread-safety."
      }
    ]
  },

  // Question 47: Counter and Most Common
  {
    id: 47,
    topic: "Collections & Data Structures",
    functionName: "counter_operations",
    difficulty: "Medium",
    question: "What's the missing logic for this Counter-based word frequency analyzer?",
    code: `from collections import Counter

def analyze_text(text):
    words = text.lower().split()
    word_count = Counter(words)
    
    # MISSING: Get top 3 most common words
    top_words = _______________
    
    # MISSING: Get words that appear exactly once
    unique_words = _______________
    
    return top_words, unique_words

text = "python is great python is powerful python rocks"
print(analyze_text(text))`,
    options: [
      "word_count.most_common(3); [word for word, count in word_count.items() if count == 1]",
      "word_count.top(3); word_count.unique()",
      "sorted(word_count.items(), key=lambda x: x[1], reverse=True)[:3]; word_count.singles()",
      "word_count.max(3); word_count.filter(lambda x: x == 1)"
    ],
    correctAnswer: 0,
    hint: "Counter has a most_common() method, and you can filter items by count value.",
    explanation: "Counter.most_common(n) returns the n most frequent elements. List comprehension filters items where count equals 1.",
    followUpQuestions: [
      {
        question: "What's the time complexity of Counter.most_common(k)?",
        options: ["O(k)", "O(n log k)", "O(n log n)", "O(n)"],
        correctAnswer: 2,
        explanation: "most_common() sorts all elements, so it's O(n log n) where n is the number of unique elements."
      },
      {
        question: "How can you combine two Counter objects?",
        options: ["counter1 + counter2", "counter1.update(counter2)", "counter1 | counter2", "All of the above"],
        correctAnswer: 3,
        explanation: "All methods work: + adds counts, update() adds counts, | takes maximum counts for each key."
      }
    ]
  },

  // Question 48: OrderedDict and LRU Cache
  {
    id: 48,
    topic: "Collections & Data Structures",
    functionName: "ordered_dict_lru",
    difficulty: "Hard",
    question: "What's the missing implementation for this LRU Cache using OrderedDict?",
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key):
        if key in self.cache:
            # MISSING: Move to end (most recently used)
            _______________
            return self.cache[key]
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            # MISSING: Update and move to end
            _______________
        else:
            if len(self.cache) >= self.capacity:
                # MISSING: Remove least recently used
                _______________
            self.cache[key] = value`,
    options: [
      "self.cache.move_to_end(key); self.cache.move_to_end(key); self.cache.popitem(last=False)",
      "self.cache[key] = self.cache.pop(key); self.cache[key] = value; del self.cache[list(self.cache.keys())[0]]",
      "self.cache.move_to_end(key); self.cache[key] = value; self.cache.move_to_end(key); self.cache.popitem(last=False)",
      "self.cache.refresh(key); self.cache.update(key, value); self.cache.remove_oldest()"
    ],
    correctAnswer: 0,
    hint: "OrderedDict has move_to_end() method and popitem(last=False) removes the first item.",
    explanation: "move_to_end() moves key to end, popitem(last=False) removes the least recently used (first) item.",
    followUpQuestions: [
      {
        question: "What's the time complexity of OrderedDict operations?",
        options: ["O(1) for all operations", "O(log n) for all operations", "O(n) for move_to_end", "O(1) for get/set, O(1) for move_to_end"],
        correctAnswer: 3,
        explanation: "OrderedDict maintains O(1) time complexity for basic operations including move_to_end()."
      },
      {
        question: "Why use OrderedDict instead of regular dict for LRU?",
        options: ["Better performance", "Maintains insertion order", "Built-in LRU methods", "Thread safety"],
        correctAnswer: 1,
        explanation: "OrderedDict maintains insertion order and provides move_to_end() for efficient LRU implementation."
      }
    ]
  },

  // Question 49: ChainMap and Context Management
  {
    id: 49,
    topic: "Collections & Data Structures",
    functionName: "chainmap_contexts",
    difficulty: "Medium",
    question: "What's the missing logic for this configuration management system using ChainMap?",
    code: `from collections import ChainMap

class ConfigManager:
    def __init__(self):
        self.defaults = {'debug': False, 'timeout': 30, 'retries': 3}
        self.user_config = {}
        self.env_config = {}
        
        # MISSING: Create ChainMap with proper precedence
        self.config = _______________
    
    def set_user_config(self, **kwargs):
        self.user_config.update(kwargs)
        # MISSING: Update ChainMap to reflect changes
        _______________
    
    def get_config(self, key, default=None):
        # MISSING: Get value with fallback
        return _______________

# Usage
cm = ConfigManager()
cm.set_user_config(debug=True, timeout=60)
print(cm.get_config('debug'))  # True
print(cm.get_config('retries'))  # 3`,
    options: [
      "ChainMap(self.user_config, self.env_config, self.defaults); self.config.maps[0] = self.user_config; self.config.get(key, default)",
      "ChainMap(self.defaults, self.env_config, self.user_config); self.config.update(); self.config[key] or default",
      "ChainMap(self.user_config, self.env_config, self.defaults); self.config = ChainMap(self.user_config, self.env_config, self.defaults); self.config.get(key, default)",
      "ChainMap.from_dicts(self.user_config, self.env_config, self.defaults); self.config.refresh(); self.config.lookup(key, default)"
    ],
    correctAnswer: 2,
    hint: "ChainMap searches maps in order, so put highest priority first. Recreate ChainMap after updates.",
    explanation: "ChainMap searches from left to right, so user_config has highest priority. Recreate ChainMap after updates to reflect changes.",
    followUpQuestions: [
      {
        question: "What's the advantage of ChainMap over dict.update()?",
        options: ["Better performance", "Preserves original dicts", "Automatic merging", "Type safety"],
        correctAnswer: 1,
        explanation: "ChainMap preserves original dictionaries without modifying them, allowing layered configurations."
      },
      {
        question: "How does ChainMap handle key conflicts?",
        options: ["Raises exception", "Merges values", "First map wins", "Last map wins"],
        correctAnswer: 2,
        explanation: "ChainMap returns the value from the first map in the chain that contains the key."
      }
    ]
  },

  // Question 50: NamedTuple and Data Classes
  {
    id: 50,
    topic: "Collections & Data Structures",
    functionName: "namedtuple_usage",
    difficulty: "Easy",
    question: "What's the missing implementation for this Point class using namedtuple?",
    code: `from collections import namedtuple

# MISSING: Create Point namedtuple
Point = _______________

def calculate_distance(p1, p2):
    # MISSING: Access x and y coordinates
    dx = _______________
    dy = _______________
    return (dx**2 + dy**2)**0.5

# Usage
p1 = Point(0, 0)
p2 = Point(3, 4)
print(calculate_distance(p1, p2))  # 5.0`,
    options: [
      "namedtuple('Point', ['x', 'y']); p2.x - p1.x; p2.y - p1.y",
      "namedtuple('Point', 'x y'); p2[0] - p1[0]; p2[1] - p1[1]",
      "namedtuple('Point', ['x', 'y']); p2[0] - p1[0]; p2[1] - p1[1]",
      "All of the above"
    ],
    correctAnswer: 3,
    hint: "namedtuple accepts field names as list or space-separated string. Access by name or index.",
    explanation: "All options work: namedtuple accepts list or string for fields, and supports both named and indexed access.",
    followUpQuestions: [
      {
        question: "What's the main advantage of namedtuple over regular tuple?",
        options: ["Better performance", "Named field access", "Mutable fields", "Dynamic fields"],
        correctAnswer: 1,
        explanation: "namedtuple provides named field access while maintaining tuple's immutability and performance."
      },
      {
        question: "How do you create a new namedtuple with modified values?",
        options: ["point.x = 5", "point._replace(x=5)", "point.update(x=5)", "point.set(x=5)"],
        correctAnswer: 1,
        explanation: "namedtuple._replace() returns a new instance with specified fields changed."
      }
    ]
  },

  // Question 51: Set Operations and Frozenset
  {
    id: 51,
    topic: "Collections & Data Structures",
    functionName: "set_operations",
    difficulty: "Medium",
    question: "What's the missing logic for this set-based data analysis?",
    code: `def analyze_user_behavior(user_actions):
    # user_actions = {'user1': {'login', 'view', 'purchase'}, 'user2': {'login', 'view'}}
    
    all_actions = set()
    for actions in user_actions.values():
        # MISSING: Union all action sets
        all_actions = _______________
    
    # MISSING: Find users who performed all actions
    complete_users = []
    for user, actions in user_actions.items():
        if _______________:
            complete_users.append(user)
    
    # MISSING: Find common actions across all users
    common_actions = set(next(iter(user_actions.values())))
    for actions in user_actions.values():
        common_actions = _______________
    
    return all_actions, complete_users, common_actions`,
    options: [
      "all_actions | actions; actions == all_actions; common_actions & actions",
      "all_actions.union(actions); all_actions.issubset(actions); common_actions.intersection(actions)",
      "all_actions | actions; all_actions.issubset(actions); common_actions & actions",
      "all_actions.add(actions); actions.issuperset(all_actions); common_actions.intersect(actions)"
    ],
    correctAnswer: 2,
    hint: "Use | for union, issubset() to check if all actions are performed, & for intersection.",
    explanation: "| unions sets, issubset() checks if all_actions is subset of user actions, & finds intersection.",
    followUpQuestions: [
      {
        question: "What's the difference between set and frozenset?",
        options: ["Performance", "Mutability", "Memory usage", "Syntax"],
        correctAnswer: 1,
        explanation: "frozenset is immutable and can be used as dictionary keys or in other sets."
      },
      {
        question: "What's the time complexity of set intersection?",
        options: ["O(1)", "O(min(len(s1), len(s2)))", "O(len(s1) + len(s2))", "O(len(s1) * len(s2))"],
        correctAnswer: 1,
        explanation: "Set intersection is O(min(len(s1), len(s2))) as it iterates through the smaller set."
      }
    ]
  },

  // Question 52: Heap Operations with heapq
  {
    id: 52,
    topic: "Collections & Data Structures",
    functionName: "heap_operations",
    difficulty: "Hard",
    question: "What's the missing implementation for this priority queue using heapq?",
    code: `import heapq

class PriorityQueue:
    def __init__(self):
        self._queue = []
        self._index = 0
    
    def push(self, item, priority):
        # MISSING: Push with priority (lower number = higher priority)
        _______________
        self._index += 1
    
    def pop(self):
        # MISSING: Pop highest priority item
        if self._queue:
            return _______________
        raise IndexError("pop from empty queue")
    
    def peek(self):
        # MISSING: Look at highest priority without removing
        if self._queue:
            return _______________
        return None

# Usage
pq = PriorityQueue()
pq.push("task1", 3)
pq.push("task2", 1)  # Higher priority
pq.push("task3", 2)`,
    options: [
      "heapq.heappush(self._queue, (priority, self._index, item)); heapq.heappop(self._queue)[2]; self._queue[0][2]",
      "heapq.heappush(self._queue, (item, priority)); heapq.heappop(self._queue)[0]; self._queue[0][0]",
      "self._queue.append((priority, item)); heapq.heapify(self._queue); self._queue.pop(0)[1]; self._queue[0][1]",
      "heapq.heappush(self._queue, [priority, item]); heapq.heappop(self._queue)[1]; self._queue[0][1]"
    ],
    correctAnswer: 0,
    hint: "Use heappush with tuple (priority, index, item). Index ensures stable ordering for equal priorities.",
    explanation: "heappush uses tuple comparison. Index breaks ties for equal priorities. heappop returns full tuple, access item with [2].",
    followUpQuestions: [
      {
        question: "Why include index in the heap tuple?",
        options: ["Better performance", "Stable sorting", "Memory efficiency", "Type safety"],
        correctAnswer: 1,
        explanation: "Index ensures stable ordering when priorities are equal, preventing comparison of non-comparable items."
      },
      {
        question: "What's the time complexity of heappush and heappop?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Both heappush and heappop maintain heap property in O(log n) time."
      }
    ]
  },

  // Question 53: Bisect Module for Sorted Lists
  {
    id: 53,
    topic: "Collections & Data Structures",
    functionName: "bisect_operations",
    difficulty: "Medium",
    question: "What's the missing logic for this sorted list with binary search?",
    code: `import bisect

class SortedList:
    def __init__(self):
        self._list = []
    
    def add(self, item):
        # MISSING: Insert item in sorted position
        _______________
    
    def remove(self, item):
        # MISSING: Find and remove item efficiently
        pos = _______________
        if pos < len(self._list) and self._list[pos] == item:
            del self._list[pos]
            return True
        return False
    
    def count_less_than(self, value):
        # MISSING: Count items less than value
        return _______________
    
    def count_range(self, low, high):
        # MISSING: Count items in range [low, high)
        return _______________`,
    options: [
      "bisect.insort(self._list, item); bisect.bisect_left(self._list, item); bisect.bisect_left(self._list, value); bisect.bisect_left(self._list, high) - bisect.bisect_left(self._list, low)",
      "self._list.append(item); self._list.sort(); self._list.index(item); len([x for x in self._list if x < value]); len([x for x in self._list if low <= x < high])",
      "bisect.insort_left(self._list, item); bisect.bisect(self._list, item); bisect.bisect(self._list, value); bisect.bisect_right(self._list, high) - bisect.bisect_left(self._list, low)",
      "bisect.insort(self._list, item); bisect.bisect_left(self._list, item); bisect.bisect_left(self._list, value); bisect.bisect_right(self._list, high) - bisect.bisect_left(self._list, low)"
    ],
    correctAnswer: 3,
    hint: "insort maintains sorted order. bisect_left finds leftmost position. Use left/right bisect for range counting.",
    explanation: "insort inserts in sorted position. bisect_left finds insertion point. Range count uses right-left difference.",
    followUpQuestions: [
      {
        question: "What's the difference between bisect_left and bisect_right?",
        options: ["Performance", "Return type", "Position for equal elements", "Error handling"],
        correctAnswer: 2,
        explanation: "bisect_left returns leftmost position for equal elements, bisect_right returns rightmost position."
      },
      {
        question: "What's the time complexity of bisect operations?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "Binary search operations in bisect module are O(log n) for finding positions."
      }
    ]
  },

  // Question 54: Set Methods vs Operators - Understanding the Differences
  {
    id: 54,
    topic: "Collections & Data Structures",
    functionName: "set_methods_vs_operators",
    difficulty: "Medium",
    question: "What's the key difference between these two approaches for set operations?",
    code: `# Approach 1: Using operators
set1 = {1, 2, 3}
set2 = {3, 4, 5}

result1 = set1 | set2        # Union
result2 = set1 & set2        # Intersection  
result3 = set1 - set2        # Difference
result4 = set1 ^ set2        # Symmetric difference

# Approach 2: Using methods
result5 = set1.union(set2)
result6 = set1.intersection(set2)
result7 = set1.difference(set2)
result8 = set1.symmetric_difference(set2)

# MISSING: What's the main difference when working with other iterables?
list_data = [3, 4, 5, 5]  # Note: has duplicates

# This works:
result_method = set1.union(list_data)

# This fails:
try:
    result_operator = set1 | list_data  # _______________
except TypeError as e:
    print(f"Error: {e}")`,
    options: [
      "Operators only work with sets, methods work with any iterable",
      "Methods are faster than operators",
      "Operators modify the original set, methods don't",
      "Methods handle duplicates better than operators"
    ],
    correctAnswer: 0,
    hint: "Think about what types of objects each approach can accept as arguments.",
    explanation: "Set operators (|, &, -, ^) only work with other sets, while methods (.union(), .intersection(), etc.) can work with any iterable (lists, tuples, strings, etc.).",
    followUpQuestions: [
      {
        question: "Which approach should you use when working with mixed data types?",
        options: [
          "Always use operators for consistency",
          "Use methods when you need to work with non-set iterables",
          "Convert everything to sets first, then use operators",
          "Use operators for performance, methods for readability"
        ],
        correctAnswer: 1,
        explanation: "Methods are more flexible as they accept any iterable, making them ideal when working with lists, tuples, or other non-set collections."
      },
      {
        question: "What happens with the in-place versions of these operations?",
        options: [
          "set1 |= set2 is the same as set1.update(set2)",
          "In-place operators modify the original set",
          "Both accept any iterable for in-place operations",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "In-place operators (|=, &=, -=, ^=) are equivalent to update methods and both modify the original set and accept any iterable."
      },
      {
        question: "Performance-wise, which is generally faster?",
        options: [
          "Operators are always faster",
          "Methods are always faster", 
          "They have similar performance for set-to-set operations",
          "It depends on the Python version"
        ],
        correctAnswer: 2,
        explanation: "For set-to-set operations, operators and methods have similar performance as they use the same underlying implementation."
      }
    ]
  },

  // Question 55: Dictionary Methods vs Operators - get() vs [] access
  {
    id: 55,
    topic: "Collections & Data Structures", 
    functionName: "dict_access_methods",
    difficulty: "Easy",
    question: "What's the difference between these dictionary access patterns?",
    code: `user_data = {'name': 'Alice', 'age': 25}

# Approach 1: Direct access with []
try:
    name = user_data['name']        # Works
    email = user_data['email']      # _______________
except KeyError as e:
    print(f"KeyError: {e}")

# Approach 2: Using get() method
name = user_data.get('name')        # Returns 'Alice'
email = user_data.get('email')      # Returns _______________
phone = user_data.get('phone', 'N/A')  # Returns _______________

# Approach 3: Using setdefault()
# MISSING: What does setdefault do differently?
country = user_data.setdefault('country', 'USA')
print(user_data)  # What's in the dict now?`,
    options: [
      "Raises KeyError; None; 'N/A'; setdefault() adds the key-value pair if key doesn't exist",
      "Returns None; None; 'N/A'; setdefault() only returns the value without modifying dict",
      "Raises KeyError; ''; 'N/A'; setdefault() raises error if key doesn't exist", 
      "Returns empty string; None; 'N/A'; setdefault() works like get() but faster"
    ],
    correctAnswer: 0,
    hint: "Think about what happens when keys don't exist and whether the dictionary gets modified.",
    explanation: "[] raises KeyError for missing keys. get() returns None (or default). setdefault() returns the value and adds the key-value pair if the key doesn't exist.",
    followUpQuestions: [
      {
        question: "When should you use setdefault() instead of get()?",
        options: [
          "When you want better performance",
          "When you need to initialize missing keys with default values",
          "When working with nested dictionaries",
          "When the default value is expensive to compute"
        ],
        correctAnswer: 1,
        explanation: "setdefault() is useful when you want to ensure a key exists in the dictionary with a default value, especially for initializing collections."
      },
      {
        question: "What's a common pattern with setdefault() for grouping data?",
        options: [
          "data.setdefault(key, []).append(value)",
          "data.setdefault(key, {}).update(value)",
          "data.setdefault(key, set()).add(value)",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "setdefault() is commonly used to initialize empty collections (list, dict, set) for grouping operations, avoiding the need to check if key exists."
      },
      {
        question: "How does defaultdict compare to using setdefault()?",
        options: [
          "defaultdict is slower but more readable",
          "defaultdict automatically creates missing keys, setdefault() requires explicit calls",
          "They're identical in functionality",
          "defaultdict only works with basic types"
        ],
        correctAnswer: 1,
        explanation: "defaultdict automatically creates missing keys with the factory function, while setdefault() requires explicit calls for each key."
      }
    ]
  }

  ];

  // Topics for filtering
  const topics = [
    'All Topics', 
    'Lambda Functions', 
    'Collections & Data Structures', 
    'String Processing', 
    'Functional Programming',
    'Sorting & Algorithms',
    'Advanced Patterns'
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
    const savedProgress = localStorage.getItem('pythonFundamentalsProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    
    const savedHighScore = localStorage.getItem('pythonFundamentalsHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((progress: UserProgress) => {
    localStorage.setItem('pythonFundamentalsProgress', JSON.stringify(progress));
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
        localStorage.setItem('pythonFundamentalsHighScore', score.toString());
      }
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No questions available for this topic</h2>
          <Link href="/games/python-math-hub" className="text-purple-600 hover:text-purple-700 dark:text-purple-400">
            ← Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 text-center border border-purple-200 dark:border-purple-800">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Quiz Complete!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-xl text-purple-600 dark:text-purple-400">
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
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/games/python-math-hub" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center">
            ← Back to Hub
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            🐍 Python Fundamentals
          </h1>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{score}/{filteredQuestions.length}</div>
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
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
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
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
            {/* Question Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {currentQuestion.topic}
                  </span>
                  <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
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

            {/* Code Block */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <pre className="bg-gray-800 dark:bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{currentQuestion.code}</code>
              </pre>
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
                          : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : showResult && index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
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
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">{currentQuestion.hint}</p>
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

                      {/* Follow-up Questions */}
                      {currentQuestion.followUpQuestions && currentQuestion.followUpQuestions.length > 0 && (
                        <div className="mt-4 space-y-4">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200">Follow-up Questions:</h5>
                          {currentQuestion.followUpQuestions.map((followUp, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                              <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">{followUp.question}</p>
                              <div className="space-y-2">
                                {followUp.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded text-sm ${
                                      optIndex === followUp.correctAnswer
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-medium'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </div>
                                ))}
                              </div>
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                                {followUp.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!showResult ? (
                  <>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                    >
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    <button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="flex-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  </>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                  >
                    {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{streak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center border border-indigo-200 dark:border-indigo-800">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{userProgress.bestStreak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Best Streak</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userProgress.questionsAnswered}</div>
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
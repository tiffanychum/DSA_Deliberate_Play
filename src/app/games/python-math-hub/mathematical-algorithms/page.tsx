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
      hint: "Python's modulo ensures the result has the same sign as the divisor, but sometimes you need non-negative results.",
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
      hint: "Use the modular_multiply function to prevent overflow in both multiplication operations.",
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
      hint: "All three expressions check if the least significant bit is 1 (odd number).",
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
          explanation: "Binary exponentiation uses about log₂(1000) ≈ 10 multiplications, much fewer than the naive 1000."
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
      hint: "Use division instead of multiplication to avoid integer overflow.",
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
    
    return gcd_val, x, y`,
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
    # MISSING: Simpler approach
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
          question: "Why count factors of 5 instead of 10?",
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
    if x < 0:
        return False
    
    # MISSING: Reverse half the number
    original = x
    reversed_half = 0
    
    while _______________:
        reversed_half = reversed_half * 10 + x % 10
        x //= 10
    
    # MISSING: Check for palindrome (handle odd/even length)
    return _______________`,
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

        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden">
            {/* Question Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
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
                      className="flex-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  </>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg"
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

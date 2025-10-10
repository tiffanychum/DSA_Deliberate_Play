"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';

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
      code: `def copyRandomList(head):
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
    
    # Pass 2: Set random pointers
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
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
    
    return lists[0]`,
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
      code: `class LFUCache:
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
      code: `def addTwoNumbers(l1, l2):
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
    
    return dummy.next`,
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
    # MISSING LOGIC - how to merge without extra space?
    # Start from the end to avoid overwriting
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
      code: `def merge(intervals):
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
      code: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        
        # MISSING OPTIMIZATION - how to improve cache locality?
        # Use array-based approach for better cache locality
        self.keys = [0] * capacity
        self.values = [0] * capacity
        self.next = [-1] * capacity
        self.prev = [-1] * capacity
        self.head = -1
        self.tail = -1
        self.size = 0
        self.free_slots = list(range(capacity))
    
    def _add_to_head(self, slot):
        if self.head == -1:
            self.head = self.tail = slot
            self.next[slot] = self.prev[slot] = -1
        else:
            self.next[slot] = self.head
            self.prev[self.head] = slot
            self.prev[slot] = -1
            self.head = slot
    
    def _remove_slot(self, slot):
        if self.prev[slot] != -1:
            self.next[self.prev[slot]] = self.next[slot]
        else:
            self.head = self.next[slot]
        
        if self.next[slot] != -1:
            self.prev[self.next[slot]] = self.prev[slot]
        else:
            self.tail = self.prev[slot]`,
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
      code: `def multiplyLists(l1, l2):
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
      id: 38,
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
      id: 39,
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
      id: 40,
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
      id: 41,
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
    }, 2000);
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

# Common questions
#interview/DSA/linked-list
Here are the most common **medium to hard** linked list questions from top tech companies with detailed solutions:

---

## 1. **Reverse Nodes in k-Group** (Hard - Google, Amazon)

**Problem**: Reverse every k consecutive nodes in a linked list.

```python
def reverseKGroup(head, k):
    """
    Example: 1→2→3→4→5, k=3 → 3→2→1→4→5
    """
    def reverseGroup(start, end):
        """Reverse nodes between start and end (exclusive)"""
        prev, curr = start, start.next
        first = start.next  # Will become last after reversal
        
        while curr != end:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        start.next = prev
        first.next = end
        return first  # New end of reversed group
    
    def hasKNodes(node, k):
        """Check if there are at least k nodes from current position"""
        count = 0
        while node and count < k:
            node = node.next
            count += 1
        return count == k
    
    dummy = ListNode(0)
    dummy.next = head
    prev_group_end = dummy
    
    while hasKNodes(prev_group_end.next, k):
        # Find the end of current k-group
        group_start = prev_group_end.next
        group_end = group_start
        for _ in range(k):
            group_end = group_end.next
        
        # Reverse the k-group
        prev_group_end = reverseGroup(prev_group_end, group_end)
    
    return dummy.next

# Time: O(n), Space: O(1)
```
I'll walk through the **Reverse Nodes in k-Group** step by step with a detailed example.

## Problem Setup
```
Input: 1→2→3→4→5→6→7→8, k=3
Output: 3→2→1→6→5→4→7→8
```

## Step-by-Step Execution

### Initial Setup
```python
head = 1→2→3→4→5→6→7→8
k = 3

# Create dummy node
dummy = ListNode(0)
dummy.next = head
prev_group_end = dummy

# State: dummy→1→2→3→4→5→6→7→8
```

---

## **Iteration 1: Reverse first k-group (1→2→3)**

### Step 1: Check if we have k nodes
```python
hasKNodes(prev_group_end.next, 3)  # Check from node 1
# Count: 1→2→3 = 3 nodes ✓

group_start = prev_group_end.next  # node 1
group_end = group_start
for _ in range(3):  # Move 3 positions ahead
    group_end = group_end.next
# group_end now points to node 4

# State: dummy→[1→2→3]→4→5→6→7→8
#              ↑start    ↑end
```

### Step 2: Reverse the group using reverseGroup(dummy, node4)
```python
def reverseGroup(start=dummy, end=node4):
    prev, curr = dummy, 1  # start, start.next
    first = 1              # Will become last after reversal
    
    # Reverse: 1→2→3 becomes 3→2→1
    while curr != node4:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
```

#### Detailed reversal steps:
```python
# Initial: dummy→1→2→3→4...
# prev=dummy, curr=1, first=1

# Step 1: curr=1
next_temp = 2
1.next = dummy  # 1→dummy
prev = 1, curr = 2

# Step 2: curr=2  
next_temp = 3
2.next = 1      # 2→1→dummy
prev = 2, curr = 3

# Step 3: curr=3
next_temp = 4
3.next = 2      # 3→2→1→dummy
prev = 3, curr = 4

# curr == end (node4), so stop
```

### Step 3: Connect the reversed group
```python
# After reversal: 3→2→1→dummy, but we need to connect properly
start.next = prev        # dummy.next = 3
first.next = end         # 1.next = 4

# Result: dummy→3→2→1→4→5→6→7→8
return first  # Return node 1 (new end of this group)
```

### Update prev_group_end
```python
prev_group_end = 1  # Node 1 is now end of first reversed group
```

**State after iteration 1**: `dummy→3→2→1→4→5→6→7→8`

---

## **Iteration 2: Reverse second k-group (4→5→6)**

### Step 1: Check if we have k nodes
```python
hasKNodes(prev_group_end.next, 3)  # Check from node 4
# Count: 4→5→6 = 3 nodes ✓

group_start = 4
group_end = 7  # 3 positions ahead of node 4

# State: dummy→3→2→1→[4→5→6]→7→8
#                    ↑start    ↑end
```

### Step 2: Reverse the group using reverseGroup(node1, node7)
```python
def reverseGroup(start=node1, end=node7):
    prev, curr = 1, 4    # start, start.next  
    first = 4            # Will become last after reversal
    
    # Reverse: 4→5→6 becomes 6→5→4
```

#### Detailed reversal steps:
```python
# Step 1: curr=4
4.next = 1      # 4→1
prev = 4, curr = 5

# Step 2: curr=5
5.next = 4      # 5→4→1
prev = 5, curr = 6

# Step 3: curr=6  
6.next = 5      # 6→5→4→1
prev = 6, curr = 7

# curr == end (node7), so stop
```

### Step 3: Connect the reversed group
```python
start.next = prev        # 1.next = 6
first.next = end         # 4.next = 7

# Result: dummy→3→2→1→6→5→4→7→8
return first  # Return node 4
```

### Update prev_group_end
```python
prev_group_end = 4  # Node 4 is now end of second reversed group
```

**State after iteration 2**: `dummy→3→2→1→6→5→4→7→8`

---

## **Iteration 3: Check remaining nodes (7→8)**

### Step 1: Check if we have k nodes
```python
hasKNodes(prev_group_end.next, 3)  # Check from node 7
# Count: 7→8 = only 2 nodes < 3 ❌
```

**No more k-groups to reverse, exit loop.**

---

## **Final Result**
```python
return dummy.next  # Return 3→2→1→6→5→4→7→8
```

## Visual Summary

```
Original:  1→2→3→4→5→6→7→8
           [---][---][-]
            k=3  k=3  <3

After:     3→2→1→6→5→4→7→8
           [---][---][-]
          reversed reversed unchanged
```

## Key Helper Functions

### hasKNodes Function
```python
def hasKNodes(node, k):
    count = 0
    while node and count < k:
        node = node.next
        count += 1
    return count == k

# Example: hasKNodes(node7, 3)
# node7→node8→None
# count: 0→1→2, node becomes None
# return 2 == 3? False
```

### reverseGroup Function Core Logic
```python
# Before: start→[a→b→c]→end
# After:  start→[c→b→a]→end

# The function:
# 1. Reverses internal pointers: a→b→c becomes c→b→a  
# 2. Connects start to new head: start→c
# 3. Connects old head to end: a→end
# 4. Returns old head (new tail of group)
```

## Complexity Analysis

- **Time**: O(n) - each node is visited exactly twice (once for checking, once for reversing)
- **Space**: O(1) - only using pointers, no extra data structures

## Edge Cases Handled

1. **k = 1**: No reversal needed
2. **k ≥ n**: Reverse entire list  
3. **Empty list**: Returns None
4. **Last group < k**: Left unchanged

This algorithm efficiently reverses k-groups in-place while maintaining the structure of remaining nodes!
---

## 2. **Copy List with Random Pointer** (Medium - Microsoft, Meta)

**Problem**: Deep copy a linked list where each node has a random pointer.
> "You are given a linked list where each node has a next pointer and a random pointer. The random pointer may point to any node in the list or be null. Create a **deep copy** of this list."
```python
class Node:
    def __init__(self, x, next=None, random=None):
        self.val = x
        self.next = next
        self.random = random

def copyRandomList(head):
    """
    Three-pass approach:
    1. Create new nodes interleaved with original
    2. Set random pointers for new nodes  
    3. Separate the two lists
    """
    if not head:
        return None
    
    # Pass 1: Create new nodes and interleave
    curr = head
    while curr:
        new_node = Node(curr.val)
        new_node.next = curr.next
        curr.next = new_node
        curr = new_node.next
    
    # Pass 2: Set random pointers for new nodes
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
        curr = curr.next.next
    
    # Pass 3: Separate the lists
    dummy = Node(0)
    new_curr = dummy
    curr = head
    
    while curr:
        new_curr.next = curr.next
        curr.next = curr.next.next
        curr = curr.next
        new_curr = new_curr.next
    
    return dummy.next

# Time: O(n), Space: O(1) - not counting output space
```
I'll walk through the **Copy List with Random Pointer** step by step with a detailed example.

## Problem Setup
```
Original list:
Node A (val=7) → Node B (val=13) → Node C (val=11) → Node D (val=10) → Node E (val=1) → None

Random pointers:
A.random → C
B.random → A  
C.random → E
D.random → C
E.random → A
```

## Step-by-Step Execution

### **Pass 1: Create new nodes and interleave them**

#### Initial State
```
Original: A(7) → B(13) → C(11) → D(10) → E(1) → None
```

#### Step 1: Process Node A
```python
curr = A
new_node = Node(7)  # Create A'
new_node.next = A.next  # A'.next = B
A.next = new_node       # A.next = A'
curr = A'.next          # curr = B

# State: A(7) → A'(7) → B(13) → C(11) → D(10) → E(1) → None
```

#### Step 2: Process Node B  
```python
curr = B
new_node = Node(13)  # Create B'
new_node.next = B.next  # B'.next = C
B.next = new_node       # B.next = B'
curr = B'.next          # curr = C

# State: A(7) → A'(7) → B(13) → B'(13) → C(11) → D(10) → E(1) → None
```

#### Step 3: Process Node C
```python
curr = C
new_node = Node(11)  # Create C'
new_node.next = C.next  # C'.next = D
C.next = new_node       # C.next = C'
curr = C'.next          # curr = D

# State: A(7) → A'(7) → B(13) → B'(13) → C(11) → C'(11) → D(10) → E(1) → None
```

#### Step 4: Process Node D
```python
curr = D
new_node = Node(10)  # Create D'
new_node.next = D.next  # D'.next = E
D.next = new_node       # D.next = D'
curr = D'.next          # curr = E

# State: A(7) → A'(7) → B(13) → B'(13) → C(11) → C'(11) → D(10) → D'(10) → E(1) → None
```

#### Step 5: Process Node E
```python
curr = E
new_node = Node(1)   # Create E'
new_node.next = E.next  # E'.next = None
E.next = new_node       # E.next = E'
curr = E'.next          # curr = None (exit loop)

# Final interleaved state:
# A(7) → A'(7) → B(13) → B'(13) → C(11) → C'(11) → D(10) → D'(10) → E(1) → E'(1) → None
```

---

### **Pass 2: Set random pointers for new nodes**

#### Step 1: Process Node A
```python
curr = A
if A.random:  # A.random = C
    A.next.random = A.random.next  # A'.random = C.next = C'

# A'.random now points to C'
curr = A.next.next  # curr = B
```

#### Step 2: Process Node B
```python
curr = B  
if B.random:  # B.random = A
    B.next.random = B.random.next  # B'.random = A.next = A'

# B'.random now points to A'
curr = B.next.next  # curr = C
```

#### Step 3: Process Node C
```python
curr = C
if C.random:  # C.random = E
    C.next.random = C.random.next  # C'.random = E.next = E'

# C'.random now points to E'
curr = C.next.next  # curr = D
```

#### Step 4: Process Node D
```python
curr = D
if D.random:  # D.random = C
    D.next.random = D.random.next  # D'.random = C.next = C'

# D'.random now points to C'
curr = D.next.next  # curr = E
```

#### Step 5: Process Node E
```python
curr = E
if E.random:  # E.random = A
    E.next.random = E.random.next  # E'.random = A.next = A'

# E'.random now points to A'
curr = E.next.next  # curr = None (exit loop)
```

**State after Pass 2**: All new nodes have correct random pointers!

---

### **Pass 3: Separate the two lists**

#### Initial Setup
```python
dummy = Node(0)
new_curr = dummy
curr = A  # Start from original head

# Current interleaved list:
# A → A' → B → B' → C → C' → D → D' → E → E' → None
```

#### Step 1: Process Node A
```python
curr = A
new_curr.next = A.next      # dummy.next = A'
A.next = A.next.next        # A.next = B (restore original)
curr = A.next               # curr = B
new_curr = new_curr.next    # new_curr = A'

# Original: A → B → C → D → E → None
# New:      dummy → A' → ...
```

#### Step 2: Process Node B
```python
curr = B
new_curr.next = B.next      # A'.next = B'
B.next = B.next.next        # B.next = C (restore original)  
curr = B.next               # curr = C
new_curr = new_curr.next    # new_curr = B'

# Original: A → B → C → D → E → None
# New:      dummy → A' → B' → ...
```

#### Step 3: Process Node C
```python
curr = C
new_curr.next = C.next      # B'.next = C'
C.next = C.next.next        # C.next = D (restore original)
curr = C.next               # curr = D  
new_curr = new_curr.next    # new_curr = C'

# Original: A → B → C → D → E → None
# New:      dummy → A' → B' → C' → ...
```

#### Step 4: Process Node D
```python
curr = D
new_curr.next = D.next      # C'.next = D'
D.next = D.next.next        # D.next = E (restore original)
curr = D.next               # curr = E
new_curr = new_curr.next    # new_curr = D'

# Original: A → B → C → D → E → None  
# New:      dummy → A' → B' → C' → D' → ...
```

#### Step 5: Process Node E
```python
curr = E
new_curr.next = E.next      # D'.next = E'
E.next = E.next.next        # E.next = None (restore original)
curr = E.next               # curr = None (exit loop)
new_curr = new_curr.next    # new_curr = E'

# Final state:
# Original: A → B → C → D → E → None (fully restored)
# New:      dummy → A' → B' → C' → D' → E' → None
```

---

## **Final Result**
```python
return dummy.next  # Returns A' (head of copied list)
```

## Visual Summary

### Before (Original List):
```
A(7) → B(13) → C(11) → D(10) → E(1) → None
↓       ↓       ↓       ↓       ↓
C(11)   A(7)    E(1)    C(11)   A(7)  (random pointers)
```

### After Pass 1 (Interleaved):
```
A → A' → B → B' → C → C' → D → D' → E → E' → None
```

### After Pass 2 (Random pointers set):
```
A → A' → B → B' → C → C' → D → D' → E → E' → None
    ↓       ↓       ↓       ↓       ↓
    C'      A'      E'      C'      A'  (new random pointers)
```

### After Pass 3 (Separated):
```
Original: A(7) → B(13) → C(11) → D(10) → E(1) → None
Copy:     A'(7) → B'(13) → C'(11) → D'(10) → E'(1) → None

Both with correct random pointers!
```

## Key Insights

### **Why Interleaving Works**:
```python
# Original node X has random pointer to node Y
# After interleaving: X → X' → ... → Y → Y' → ...
# So: X.random.next gives us Y', which is exactly what we want for X'.random!
```

### **The Brilliant Mapping**:
```python
# For any original node N:
# N.next = N' (the copy of N)
# N.random.next = copy of N.random

# This gives us O(1) access to the copy of any node!
```

## Complexity Analysis

- **Time**: O(n) - three passes through the list
- **Space**: O(1) - no extra data structures (not counting output)

## Alternative Approaches

### **Hash Map Approach** (uses O(n) extra space):
```python
def copyRandomList(head):
    if not head:
        return None
    
    # Pass 1: Create all nodes and store mapping
    old_to_new = {}
    curr = head
    while curr:
        old_to_new[curr] = Node(curr.val)
        curr = curr.next
    
    # Pass 2: Set next and random pointers
    curr = head
    while curr:
        if curr.next:
            old_to_new[curr].next = old_to_new[curr.next]
        if curr.random:
            old_to_new[curr].random = old_to_new[curr.random]
        curr = curr.next
    
    return old_to_new[head]
```

The interleaving approach is more elegant because it **uses the list itself as the hash map**!
---

## 3. **Merge k Sorted Lists** (Hard - Amazon, Google)

**Problem**: Merge k sorted linked lists into one sorted list.

```python
import heapq

def mergeKLists(lists):
    """
    Priority Queue approach - most efficient for large k
    """
    if not lists:
        return None
    
    # Remove empty lists
    lists = [lst for lst in lists if lst]
    if not lists:
        return None
    
    # Min-heap: (value, list_index, node)
    heap = [(lst.val, i, lst) for i, lst in enumerate(lists)]
    heapq.heapify(heap)
    
    dummy = ListNode()
    curr = dummy
    
    while heap:
        val, list_idx, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, list_idx, node.next))
    
    return dummy.next

# Alternative: Divide and Conquer
def mergeKListsDivideConquer(lists):
    """
    Divide and conquer approach
    """
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
    
    if not lists:
        return None
    
    while len(lists) > 1:
        merged_lists = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged_lists.append(mergeTwoLists(l1, l2))
        lists = merged_lists
    
    return lists[0]

# Heap approach: Time O(n*log k), Space O(k)
# Divide & Conquer: Time O(n*log k), Space O(log k)
```

---

## 4. **LRU Cache** (Medium - Google, Amazon, Microsoft)

```python
class DLinkedNode:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = {}
        self.capacity = capacity
        self.size = 0
        
        # Dummy head and tail
        self.head = DLinkedNode()
        self.tail = DLinkedNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _add_node(self, node):
        """Add node right after head"""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _remove_node(self, node):
        """Remove an existing node"""
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node
    
    def _move_to_head(self, node):
        """Move node to head"""
        self._remove_node(node)
        self._add_node(node)
    
    def _pop_tail(self):
        """Remove last node"""
        last_node = self.tail.prev
        self._remove_node(last_node)
        return last_node
    
    def get(self, key: int) -> int:
        node = self.cache.get(key)
        if not node:
            return -1
        
        self._move_to_head(node)
        return node.value
    
    def put(self, key: int, value: int) -> None:
        node = self.cache.get(key)
        
        if not node:
            new_node = DLinkedNode(key, value)
            self.cache[key] = new_node
            self._add_node(new_node)
            self.size += 1
            
            if self.size > self.capacity:
                tail = self._pop_tail()
                del self.cache[tail.key]
                self.size -= 1
        else:
            node.value = value
            self._move_to_head(node)

# Time: O(1) for both get and put, Space: O(capacity)
```

---

## 5. **Add Two Numbers II** (Medium - Amazon, Microsoft)

**Problem**: Add two numbers represented as linked lists (most significant digit first).

```python
def addTwoNumbers(l1, l2):
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
    
    dummy = ListNode()
    curr = dummy
    carry = 0
    
    # Add from least significant digit
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        curr.next = ListNode(total % 10)
        curr = curr.next
        
        if l1:
            l1 = l1.next
        if l2:
            l2 = l2.next
    
    # Reverse result to get correct order
    return reverse(dummy.next)

# Time: O(max(m,n)), Space: O(1) not counting output
```

---

## 6. **Remove Nth Node From End** (Medium - JP Morgan, Google)

```python
def removeNthFromEnd(head, n):
    """
    Two-pointer technique with one pass
    """
    dummy = ListNode(0)
    dummy.next = head
    fast = slow = dummy
    
    # Move fast pointer n+1 steps ahead, he +1 ensures that slow ends up at the predecessor of the target node
    for _ in range(n + 1):
        fast = fast.next
    
    # Move both pointers until fast reaches end
    while fast:
        fast = fast.next
        slow = slow.next
    
    # Remove the nth node from end
    slow.next = slow.next.next
    
    return dummy.next

# Time: O(n), Space: O(1)
```
I'll walk through the **Remove Nth Node From End** step by step with a detailed example.

## Problem Setup
```
Input: 1→2→3→4→5, n=2
Output: 1→2→3→5 (remove 4, which is 2nd from end)
```

## Algorithm: Two-Pointer Technique

The key insight is to maintain a **gap of n+1** between two pointers, so when the fast pointer reaches the end, the slow pointer is at the node **before** the one we want to remove.

## Step-by-Step Execution

### Initial Setup
```python
head = 1→2→3→4→5
n = 2

dummy = ListNode(0)
dummy.next = head
fast = slow = dummy

# State: dummy→1→2→3→4→5
#        ↑
#      fast,slow
```

---

### **Phase 1: Move fast pointer n+1 steps ahead**

#### Step 1: Move fast 1 step
```python
for _ in range(n + 1):  # range(3) = [0, 1, 2]
    fast = fast.next

# i=0: fast = fast.next
fast = dummy.next  # fast = 1

# State: dummy→1→2→3→4→5
#        ↑     ↑
#      slow   fast
```

#### Step 2: Move fast 1 more step
```python
# i=1: fast = fast.next  
fast = 1.next  # fast = 2

# State: dummy→1→2→3→4→5
#        ↑       ↑
#      slow     fast
```

#### Step 3: Move fast 1 more step
```python
# i=2: fast = fast.next
fast = 2.next  # fast = 3

# State: dummy→1→2→3→4→5
#        ↑         ↑
#      slow       fast
```

**After Phase 1**: Fast pointer is **3 positions ahead** of slow pointer.

---

### **Phase 2: Move both pointers until fast reaches end**

#### Step 1: Move both pointers
```python
while fast:  # fast = 3 (not None)
    fast = fast.next   # fast = 4
    slow = slow.next   # slow = 1

# State: dummy→1→2→3→4→5
#              ↑     ↑
#            slow   fast
```

#### Step 2: Move both pointers
```python
while fast:  # fast = 4 (not None)
    fast = fast.next   # fast = 5
    slow = slow.next   # slow = 2

# State: dummy→1→2→3→4→5
#                ↑     ↑
#              slow   fast
```

#### Step 3: Move both pointers
```python
while fast:  # fast = 5 (not None)
    fast = fast.next   # fast = None
    slow = slow.next   # slow = 3

# State: dummy→1→2→3→4→5→None
#                  ↑         ↑
#                slow       fast
```

#### Step 4: Exit loop
```python
while fast:  # fast = None (exit loop)
```

**After Phase 2**: Slow pointer is at node 3, which is **right before** the node we want to remove (node 4).

---

### **Phase 3: Remove the nth node from end**

```python
# slow points to node 3
# slow.next points to node 4 (the one we want to remove)
# slow.next.next points to node 5

slow.next = slow.next.next  # 3.next = 4.next = 5

# Before: dummy→1→2→3→4→5
# After:  dummy→1→2→3→5
```

### **Return Result**
```python
return dummy.next  # Return 1→2→3→5
```

---

## Visual Step-by-Step Summary

### Phase 1: Create gap of n+1
```
Step 0: dummy→1→2→3→4→5
        ↑
      fast,slow

Step 1: dummy→1→2→3→4→5
        ↑     ↑
      slow   fast

Step 2: dummy→1→2→3→4→5
        ↑       ↑
      slow     fast

Step 3: dummy→1→2→3→4→5
        ↑         ↑
      slow       fast
```

### Phase 2: Move both until fast reaches end
```
Step 1: dummy→1→2→3→4→5
              ↑     ↑
            slow   fast

Step 2: dummy→1→2→3→4→5
                ↑     ↑
              slow   fast

Step 3: dummy→1→2→3→4→5→None
                  ↑         ↑
                slow       fast
```

### Phase 3: Remove node
```
Before: dummy→1→2→3→4→5
                  ↑
                slow

After:  dummy→1→2→3→5
                  ↑
                slow
```

---

## Why This Works

### **Gap Maintenance**:
- We maintain a **constant gap of n+1** between fast and slow
- When fast reaches the end, slow is exactly at the **predecessor** of the target node

### **Visual Proof**:
```
List: dummy→1→2→3→4→5→None
      ↑         ↑
    slow       fast
    
Gap = 3 positions (n+1 where n=2)

When fast reaches None:
- slow is at position that's n+1 from end
- slow.next is the nth node from end (target to remove)
```

---

## Edge Cases Handled

### **Case 1: Remove first node (n = length)**
```python
Input: 1→2→3, n=3 (remove 1st node)

# After moving fast n+1=4 steps, fast goes past end
# slow remains at dummy
# slow.next = head (node 1)
# Result: dummy→2→3
```

### **Case 2: Remove last node**
```python
Input: 1→2→3, n=1 (remove last node)

# slow ends up at node 2
# slow.next = node 3 (target)
# slow.next.next = None
# Result: dummy→1→2
```

### **Case 3: Single node list**
```python
Input: 1, n=1

# slow stays at dummy
# slow.next = node 1 (target)
# Result: dummy→None (empty list)
```

---

## Alternative Approach (Two-Pass)

```python
def removeNthFromEnd(head, n):
    # Pass 1: Count total nodes
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    # Pass 2: Remove (length - n)th node from start
    dummy = ListNode(0)
    dummy.next = head
    curr = dummy
    
    for _ in range(length - n):
        curr = curr.next
    
    curr.next = curr.next.next
    return dummy.next

# Time: O(n), Space: O(1) - but requires two passes
```

## Complexity Analysis

**Two-Pointer Approach**:
- **Time**: O(n) - single pass through the list
- **Space**: O(1) - only using two pointers

**Why Two-Pointer is Better**:
- Only **one pass** through the list
- **More elegant** - no need to calculate length first
- **Same complexity** but more efficient in practice

## Key Insights

1. **Dummy node**: Handles edge case where we remove the first node
2. **Gap of n+1**: Ensures slow pointer stops at the right position
3. **Single pass**: More efficient than counting length first
4. **Pointer arithmetic**: The gap automatically positions us correctly

This technique is a classic example of the **two-pointer pattern** commonly used in linked list problems!
---

## 7. **Intersection of Two Linked Lists** (Easy-Medium - Amazon, Microsoft)

```python
def getIntersectionNode(headA, headB):
    """
    Two-pointer approach with path switching
    """
    if not headA or not headB:
        return None
    
    ptrA, ptrB = headA, headB
    
    # When a pointer reaches end, switch to other list's head
    # They will meet at intersection or both become None
    while ptrA != ptrB:
        ptrA = ptrA.next if ptrA else headB
        ptrB = ptrB.next if ptrB else headA
    
    return ptrA  # Either intersection node or None

# Time: O(m + n), Space: O(1)
```

---

## **Big O Analysis Summary**

| Problem | Time Complexity | Space Complexity | Key Technique |
|---------|----------------|------------------|---------------|
| Reverse K-Group | O(n) | O(1) | Group processing |
| Copy Random List | O(n) | O(1) | Interleaving |
| Merge K Lists | O(n log k) | O(k) | Priority Queue |
| LRU Cache | O(1) | O(capacity) | Hash + DLL |
| Add Two Numbers II | O(max(m,n)) | O(1) | Reverse technique |
| Remove Nth from End | O(n) | O(1) | Two pointers |
| Intersection | O(m + n) | O(1) | Path switching |

## **Interview Tips**

1. **Always ask about edge cases**: null inputs, single nodes, cycles
2. **Consider dummy nodes**: Simplifies edge case handling
3. **Two-pointer technique**: Very common for linked list problems
4. **Draw diagrams**: Visual representation helps avoid bugs
5. **Practice pointer manipulation**: Most bugs come from incorrect pointer updates

These problems cover the most frequently asked patterns in FAANG interviews!

# Leet - LRU Cache
#interview/DSA/linked-list

# LRU Cache Implementation

## Algorithm

To implement an LRU (Least Recently Used) Cache with O(1) time complexity for both get and put operations, we need to use a combination of:

1. A **doubly linked list** to maintain the order of usage (most recently used at the head, least recently used at the tail)
2. A **hash map** (dictionary) to provide O(1) access to nodes in the linked list

The key operations are:
- When we get or put a key, move it to the front of the list (most recently used)
- When we need to evict a key, remove from the end of the list (least recently used)
- Use the hash map to quickly locate nodes in the linked list

## Why Doubly Linked List?
### We Need O(1) Operations at BOTH Ends
**Operations Required**:
**1** **Add to front** (most recently used) - O(1)
**1** **Remove from back** (least recently used) - O(1)
**1** **Remove from middle** (when moving existing item to front) - O(1)

## Optimal Solution

```python
class DLinkedNode:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = {}  # map key to node
        self.capacity = capacity
        self.size = 0
        
        # Initialize dummy head and tail nodes
        self.head = DLinkedNode()
        self.tail = DLinkedNode()
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def _add_node(self, node):
        """Add node right after head (most recently used)"""
        node.prev = self.head
        node.next = self.head.next
        
        self.head.next.prev = node
        self.head.next = node
    
    def _remove_node(self, node):
        """Remove an existing node from the linked list"""
        prev = node.prev
        new = node.next
        
        prev.next = new
        new.prev = prev
    
    def _move_to_head(self, node):
        """Move a node to the head (mark as recently used)"""
        self._remove_node(node)
        self._add_node(node)
    
    def _pop_tail(self):
        """Remove and return the tail node (least recently used)"""
        res = self.tail.prev
        self._remove_node(res)
        return res
    
    def get(self, key: int) -> int:
        node = self.cache.get(key, None)
        if not node:
            return -1
        
        # Move the accessed node to the head
        self._move_to_head(node)
        
        return node.value
    
    def put(self, key: int, value: int) -> None:
        node = self.cache.get(key)
        
        if not node:
            # Create a new node
            newNode = DLinkedNode(key, value)
            
            # Add to the cache
            self.cache[key] = newNode
            
            # Add to the doubly linked list
            self._add_node(newNode)
            
            self.size += 1
            
            # Check if we need to evict
            if self.size > self.capacity:
                # Remove the least recently used node
                tail = self._pop_tail()
                del self.cache[tail.key]
                self.size -= 1
        else:
            # Update the value
            node.value = value
            
            # Move to the head
            self._move_to_head(node)
```




## Time and Space Complexity

- **Time Complexity**: O(1) for both get and put operations
  - Hash map provides O(1) lookup
  - Linked list operations (add, remove, move) are all O(1)

- **Space Complexity**: O(capacity), as we store at most capacity+2 nodes (including dummy head and tail)

## Step-by-Step Example

Let's trace through the example:

```
LRUCache lRUCache = new LRUCache(2);
```
- Initialize cache with capacity 2
- Create dummy head and tail: head ↔ tail

```
lRUCache.put(1, 1);
```
- Create node (1,1)
- Add to cache: {1: node(1,1)}
- Add to list: head ↔ (1,1) ↔ tail
- size = 1

```
lRUCache.put(2, 2);
```
- Create node (2,2)
- Add to cache: {1: node(1,1), 2: node(2,2)}
- Add to list: head ↔ (2,2) ↔ (1,1) ↔ tail
- size = 2

```
lRUCache.get(1);
```
- Find node(1,1) in cache
- Move to head: head ↔ (1,1) ↔ (2,2) ↔ tail
- Return 1

```
lRUCache.put(3, 3);
```
- Create node (3,3)
- Add to cache: {1: node(1,1), 3: node(3,3)} (removing 2)
- Add to list: head ↔ (3,3) ↔ (1,1) ↔ tail
- size = 2 + 1 = 3 > capacity
- Evict LRU: remove (2,2), size = 2

```
lRUCache.get(2);
```
- 2 not in cache, return -1

And so on...

This implementation efficiently maintains the LRU property while providing O(1) time complexity for all operations.


# Leet - merge k sorted link list
#interview/DSA/linked-list
# Merge k Sorted Lists Solution

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

import heapq

def mergeKLists(lists):
    # Remove empty lists
    lists = [lst for lst in lists if lst]
    
    if not lists:
        return None
    
    # Create a min-heap only add the FIRST node from each list
    # Each element is a tuple of (node_value, list_index, node)
    # We include list_index to handle cases where node values are equal
    heap = [(lst.val, i, lst) for i, lst in enumerate(lists)]
    heapq.heapify(heap)
    
    # Create a dummy node for the result list
    dummy = ListNode()
    current = dummy
    
    # Process nodes until the heap is empty
    while heap:
        val, list_idx, node = heapq.heappop(heap)
        
        # Add the node to our result list
        current.next = node
        current = current.next
        
        # If there are more nodes in this list, add the next one to the heap
        if node.next:
            heapq.heappush(heap, (node.next.val, list_idx, node.next))
    
    return dummy.next
```

**What** **lists** **Contains**
```
# lists is an array of ListNode objects (head pointers)
lists = [head1, head2, head3]

# Each element in lists IS the first node of a linked list:
# lists[0] points to: 1 → 4 → 5
# lists[1] points to: 1 → 3 → 4  
# lists[2] points to: 2 → 6

lists = [ListNode(1), ListNode(1), ListNode(2)]
#         ↓           ↓           ↓
#       1→4→5       1→3→4       2→6

# The list comprehension:
heap = [(lst.val, i, lst) for i, lst in enumerate(lists)]

# This creates:
# lst = lists[0] = first node of list 1 (value=1)
# lst = lists[1] = first node of list 2 (value=1)  
# lst = lists[2] = first node of list 3 (value=2)

# Result:
heap = [(1, 0, node_with_1), (1, 1, node_with_1), (2, 2, node_with_2)]

```



## Algorithm Explanation

This solution uses a **min-heap (priority queue)** approach with the following strategy:

1. Filter out empty lists from the input
2. Create a min-heap containing the first node from each list
   - Each heap element is a tuple of (node_value, list_index, node)
   - We include the list_index to break ties when node values are equal
3. Create a dummy node to build our result list
4. While the heap is not empty:
   - Pop the smallest node from the heap
   - Add it to our result list
   - If this node has a next node, add that to the heap
5. Return the head of the merged list (dummy.next)

The key insight is that we only need to keep track of k nodes (one from each list) at any time, and a min-heap allows us to efficiently find the smallest one.

## Example Walkthrough

For `lists = [[1,4,5],[1,3,4],[2,6]]`:

1. Initialize heap with first nodes: `[(1,0,Node1), (1,1,Node4), (2,2,Node7)]`
2. Pop smallest node (1,0,Node1):
   - Add Node1 to result
   - Push Node2 (4) to heap: `[(1,1,Node4), (2,2,Node7), (4,0,Node2)]`
3. Pop smallest node (1,1,Node4):
   - Add Node4 to result
   - Push Node5 (3) to heap: `[(2,2,Node7), (3,1,Node5), (4,0,Node2)]`
4. Pop smallest node (2,2,Node7):
   - Add Node7 to result
   - Push Node8 (6) to heap: `[(3,1,Node5), (4,0,Node2), (6,2,Node8)]`
5. Pop smallest node (3,1,Node5):
   - Add Node5 to result
   - Push Node6 (4) to heap: `[(4,0,Node2), (4,1,Node6), (6,2,Node8)]`
6. Pop smallest node (4,0,Node2):
   - Add Node2 to result
   - Push Node3 (5) to heap: `[(4,1,Node6), (5,0,Node3), (6,2,Node8)]`
7. Pop smallest node (4,1,Node6):
   - Add Node6 to result
   - No next node to push
8. Pop smallest node (5,0,Node3):
   - Add Node3 to result
   - No next node to push
9. Pop smallest node (6,2,Node8):
   - Add Node8 to result
   - No next node to push
10. Heap is empty, return result: `1->1->2->3->4->4->5->6`

## Time and Space Complexity

- **Time Complexity: O(N log k)**
  - N is the total number of nodes across all lists
  - k is the number of linked lists
  - Each push and pop operation on the heap takes O(log k) time
  - We do these operations once for each of the N nodes

- **Space Complexity: O(k)**
  - The heap contains at most k elements at any time
  - We're reusing the existing nodes, not creating new ones (except for the dummy node)

## Alternative Approaches

1. **Merge Lists One by One**:
   ```python
   def mergeKLists(lists):
       if not lists:
           return None
       
       result = lists[0]
       for i in range(1, len(lists)):
           result = mergeTwoLists(result, lists[i])
       
       return result
   
   def mergeTwoLists(l1, l2):
       # Implementation of merge two sorted lists
       # (similar to the solution for problem 21)
   ```


   - Time Complexity: O(N*k)
   - Space Complexity: O(1)
   - Simple but less efficient for large k

2. **Divide and Conquer**:
   ```python
   def mergeKLists(lists):
       if not lists:
           return None
       
       # Recursive helper function
       def merge(start, end):
           if start == end:
               return lists[start]
           if start + 1 == end:
               return mergeTwoLists(lists[start], lists[end])
           
           mid = (start + end) // 2
           left = merge(start, mid)
           right = merge(mid + 1, end)
           return mergeTwoLists(left, right)
       
       return merge(0, len(lists) - 1)
   ```


   - Time Complexity: O(N log k)
   - Space Complexity: O(log k) due to recursion stack
   - Efficient and doesn't require a heap

3. **Convert to Array, Sort, and Rebuild**:
   ```python
   def mergeKLists(lists):
       # Extract all values
       nodes = []
       for lst in lists:
           while lst:
               nodes.append(lst.val)
               lst = lst.next
       
       # Sort values
       nodes.sort()
       
       # Rebuild linked list
       dummy = ListNode()
       current = dummy
       for val in nodes:
           current.next = ListNode(val)
           current = current.next
       
       return dummy.next
   ```


   - Time Complexity: O(N log N)
   - Space Complexity: O(N)
   - Simple but uses more memory and creates new nodes

The heap-based approach is generally preferred for its optimal time complexity and moderate space usage, especially for large k.













# Clarification on Input Format for Merge k Sorted Lists

You've raised an excellent point about the input format. Let me clarify:

## Input Format Explanation

In the problem statement, `lists = [[1,4,5],[1,3,4],[2,6]]` is a simplified representation of the actual input. In the actual LeetCode problem:

- The input is an array of linked list heads
- Each linked list is represented by its head node
- The array notation `[1,4,5]` is just a convenient way to show the values in each linked list

When the code is executed on LeetCode, the input is already converted to linked lists. The actual input would be something like:

```
lists = [
    ListNode(1) -> ListNode(4) -> ListNode(5),
    ListNode(1) -> ListNode(3) -> ListNode(4),
    ListNode(2) -> ListNode(6)
]
```


## Corrected Solution with Proper Input Handling

Here's the solution with clarification on how the input is handled:

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

import heapq

def mergeKLists(lists):
    # Remove empty lists
    lists = [lst for lst in lists if lst]
    
    if not lists:
        return None
    
    # Create a min-heap
    # Each element is a tuple of (node_value, list_index, node)
    heap = []
    for i, head in enumerate(lists):
        # head is already a ListNode, so we can access its val
        heap.append((head.val, i, head))
    
    heapq.heapify(heap)
    
    # Create a dummy node for the result list
    dummy = ListNode()
    current = dummy
    
    # Process nodes until the heap is empty
    while heap:
        val, list_idx, node = heapq.heappop(heap)
        
        # Add the node to our result list
        current.next = node
        current = current.next
        
        # If there are more nodes in this list, add the next one to the heap
        if node.next:
            heapq.heappush(heap, (node.next.val, list_idx, node.next))
    
    return dummy.next
```


## How It Works with the Actual Input

When the function receives `lists`, it's already an array of `ListNode` objects (the heads of each linked list). So:

1. `lst.val` accesses the value of the head node of each linked list
2. `node.next` accesses the next node in a linked list
3. The references to "Node1", "Node2", etc. in my walkthrough were just to help visualize the different nodes in the linked lists

## Testing Locally

If you want to test this code locally, you would need to create the linked lists first:

```python
def create_linked_list(values):
    dummy = ListNode()
    current = dummy
    for val in values:
        current.next = ListNode(val)
        current = current.next
    return dummy.next

# Create the linked lists
list1 = create_linked_list([1, 4, 5])
list2 = create_linked_list([1, 3, 4])
list3 = create_linked_list([2, 6])

# Merge them
result = mergeKLists([list1, list2, list3])
```


## Summary

- The input `[[1,4,5],[1,3,4],[2,6]]` is a simplified representation
- The actual input is an array of `ListNode` objects
- Each `ListNode` is the head of a linked list
- The solution works correctly with this input format

Thank you for pointing this out - it's an important clarification that helps understand how the solution works with the actual input format.

# Leet - remove nth node from the end
#interview/DSA/linked-list
# Remove Nth Node From End of List Solution

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def removeNthFromEnd(head, n):
    # Create a dummy node to handle edge cases (like removing the head)
    dummy = ListNode(0)
    dummy.next = head
    
    # Initialize two pointers
    first = dummy
    second = dummy
    
    # Advance the first pointer by n+1 steps
    # This creates a gap of n nodes between first and second
    for i in range(n + 1):
        first = first.next
    
    # Move both pointers until first reaches the end
    # This positions second at the node before the one to be removed
    while first:
        first = first.next
        second = second.next
    
    # Remove the nth node from the end
    second.next = second.next.next
    
    # Return the new head
    return dummy.next
```

## Algorithm Explanation

This solution uses the **two-pointer technique** with the following approach:

1. Create a dummy node that points to the head to handle edge cases (like removing the head)
2. Initialize two pointers, `first` and `second`, both starting at the dummy node
3. Advance the `first` pointer by n+1 steps, creating a gap of n nodes between `first` and `second`
4. Move both pointers forward at the same pace until `first` reaches the end of the list
5. At this point, `second` will be at the node just before the one we want to remove
6. Update the `next` pointer of `second` to skip the node to be removed
7. Return the new head of the list (which is `dummy.next`)

The key insight is that by maintaining a gap of n nodes between the two pointers, when the first pointer reaches the end, the second pointer will be at the position just before the node we want to remove.

## Example Walkthrough

For `head = [1,2,3,4,5]`, `n = 2`:

1. Create `dummy` node: `dummy -> 1 -> 2 -> 3 -> 4 -> 5`
2. Initialize `first = dummy`, `second = dummy`
3. Advance `first` by n+1 (3) steps: `first` points to `3`
4. Move both pointers until `first` reaches the end:
   - `first` moves: `3 -> 4 -> 5 -> null`
   - `second` moves: `dummy -> 1 -> 2 -> 3`
5. Now `second` points to `3`, and we want to remove the node after it (which is `4`)
6. Update `second.next = second.next.next`: `3` now points to `5`
7. The list becomes: `dummy -> 1 -> 2 -> 3 -> 5`
8. Return `dummy.next`: `1 -> 2 -> 3 -> 5`

## Time and Space Complexity

- **Time Complexity: O(L)**
  - We traverse the list at most twice (once to advance `first` by n+1 steps, and once to move both pointers to the end)
  - L is the length of the linked list

- **Space Complexity: O(1)**
  - We only use a constant amount of extra space regardless of input size
  - Just a few pointers: `dummy`, `first`, and `second`


# Understanding Pointers and References in the Linked List Solution

Let me clarify how the pointers work in this solution and what happens to the `dummy` node and the original `head`:

## How Pointers Work in This Solution

In the linked list solution:

1. **`head`** is the original input parameter - a reference to the first node of the linked list.

2. **`dummy`** is a new node we create that points to the original head:
   ```python
   dummy = ListNode()
   dummy.next = head
   ```

3. **`first`** and **`second`** are pointers (references) that initially point to the `dummy` node:
   ```python
   first = dummy
   second = dummy
   ```

## Key Concept: Reference vs. Value

When we do `first = dummy` and `second = dummy`, we're not creating copies of the `dummy` node. Instead, we're creating new references that point to the same node in memory.

This means:
- `first`, `second`, and `dummy` all point to the same node initially
- When we move `first` or `second` by doing `first = first.next`, we're changing where these pointers point to, not modifying the nodes themselves

## How Changes Affect the List

When we do `second.next = second.next.next`, we are modifying the actual linked list structure:

1. `second` points to a specific node in the list
2. We change that node's `next` pointer to skip the next node
3. This change is reflected in the entire list structure, including what `dummy.next` points to

## Visual Example

For `head = [1,2,3,4,5]` and `n = 2`:

Initial setup:
```
dummy -> 1 -> 2 -> 3 -> 4 -> 5
first = dummy
second = dummy
```

After moving pointers:
```
dummy -> 1 -> 2 -> 3 -> 4 -> 5
                  ^        ^
               second    first=null
```

After `second.next = second.next.next`:
```
dummy -> 1 -> 2 -> 3 ------> 5
```

Final result (return `dummy.next`):
```
1 -> 2 -> 3 -> 5
```

## What "head" Means

In this context:
- `head` is the parameter that represents the original first node of the linked list
- After our operation, the structure of the list may change
- We return `dummy.next` as the new head of the modified list

If we removed the first node, `dummy.next` would now point to the second node of the original list, making it the new head.

## Summary

- The pointers `first` and `second` don't modify the `dummy` node itself; they just start at the same location
- When we modify `second.next`, we're changing the actual structure of the linked list
- These changes affect what `dummy.next` points to, which is why we return `dummy.next` as our result
- The original `head` variable doesn't change, but the structure it points to might be modified

## Alternative Approaches

1. **Two-Pass Approach**:
   ```python
   def removeNthFromEnd(head, n):
       # First pass: count the length of the list
       length = 0
       current = head
       while current:
           length += 1
           current = current.next
       
       # Calculate the position from the beginning
       position = length - n
       
       # Handle the case of removing the head
       if position == 0:
           return head.next
       
       # Second pass: find the node before the one to be removed
       current = head
       for i in range(position - 1):
           current = current.next
       
       # Remove the nth node
       current.next = current.next.next
       
       return head
   ```


   - Time Complexity: O(L)
   - Space Complexity: O(1)
   - Requires two passes through the list

2. **Recursive Approach**:
   ```python
   def removeNthFromEnd(head, n):
       def remove(node, count):
           if not node:
               return None, 0
           
           next_node, position = remove(node.next, count)
           position += 1
           
           if position == count:
               return next_node, position
           
           node.next = next_node
           return node, position
       
       result, _ = remove(head, n)
       return result
   ```


   - Time Complexity: O(L)
   - Space Complexity: O(L) due to the recursion stack
   - More complex but can be elegant in certain contexts

The one-pass approach with two pointers is generally preferred for its efficiency and clarity, especially since it addresses the follow-up question of solving the problem in one pass.

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # Create dummy node to handle edge cases
        dummy = ListNode(0)
        dummy.next = head
        prev_group_end = dummy  # Points to node before the group
        
        while True:
            # Find kth node of the current group
            kth_node = self.getKthNode(prev_group_end, k)
            if not kth_node:
                break

            next_group_start = kth_node.next
            curr = prev_group_end.next
            prev = next_group_start
            
            for _ in range(k):
                temp = curr.next
                curr.next = prev
                prev = curr
                curr = temp
            
            group_start = prev_group_end.next
            
            # Connect previous part to reversed group
            prev_group_end.next = kth_node
            
            # Update prev_group_end for next iteration
            prev_group_end = group_start
        
        return dummy.next
    
    def getKthNode(self, curr, k):
        curr = curr.next
        for _ in range(k-1):
            if not curr:
                return None
            curr = curr.next
        return curr

# Leet - Reverse a linked-list II
#interview/DSA/linked-list
# Reverse Linked List II - Solution

This problem asks us to reverse a portion of a linked list, from position `left` to position `right`.

## Algorithm
We can solve this in one pass with the following steps:

1. Use a dummy node to handle edge cases (like reversing from the head)
2. Find the node just before the reversal starts (position `left-1`)
3. Reverse the sublist from position `left` to `right`
4. Connect the reversed sublist back to the original list

## Code Solution

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseBetween(self, head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
        # Edge case: empty list or no reversal needed
        if not head or left == right:
            return head
        
        # Create a dummy node to handle edge cases
        dummy = ListNode(0)
        dummy.next = head
        
        # Find the node just before the reversal starts
        prev = dummy
        for _ in range(left - 1):
            prev = prev.next
        
        # 'prev' is now the node just before the reversal
        # 'current' is the first node to be reversed
        current = prev.next
        
        # Reverse the sublist from position 'left' to 'right'
        for _ in range(right - left):
            # Node to be moved
            temp = current.next
            
            # Remove temp from its current position
            current.next = temp.next
            
            # Insert temp after prev
            temp.next = prev.next
            prev.next = temp
        
        # Return the head of the modified list
        return dummy.next
```

## Step-by-step Execution
1. identify prev , which the anchor of the starting point forward
2. set current at the starting point and move its next in the starting point pointed by prev
3. use temp to be pointed by prev, while temp.next would be the current.next as it’s moved to the front
Let's trace through the example: `head = [1,2,3,4,5], left = 2, right = 4`

1. Initialize: `dummy.next = head`, `prev = dummy`
2. Move `prev` to position `left-1`:
   - `prev` moves to node with value 1
3. Set `current = prev.next`:
   - `current` is node with value 2
4. Reverse the sublist (2 iterations for `right - left = 4 - 2 = 2 = 0, 1`):
1 Number of iterations needed = right - left = 4 - 2 = 2
1 So we would iterate through 2 steps, which can be represented by indices 0 and 1
- First iteration:
  - `temp = current.next` (node with value 3)
  - `current.next = temp.next` (node with value 4)
  - `temp.next = prev.next` (node with value 2)
  - `prev.next = temp` (node with value 3)
  - List becomes: `1 -> 3 -> 2 -> 4 -> 5`
- Second iteration:
  - `temp = current.next` (node with value 4)
  - `current.next = temp.next` (node with value 5)
  - `temp.next = prev.next` (node with value 3)
  - `prev.next = temp` (node with value 4)
  - List becomes: `1 -> 4 -> 3 -> 2 -> 5`
5. Return `dummy.next` (the head of the modified list)

## Visual Explanation
For better understanding, let's visualize the reversal process:

Initial list: `1 -> 2 -> 3 -> 4 -> 5`
- `prev` points to 1
- `current` points to 2

After first iteration:
```
prev    current
 |        |
 v        v
 1 -> 3 -> 2 -> 4 -> 5
```

After second iteration:
```
prev    current
 |        |
 v        v
 1 -> 4 -> 3 -> 2 -> 5
```

Final result: `1 -> 4 -> 3 -> 2 -> 5`

## Complexity Analysis
- **Time Complexity**: O(n) where n is the length of the linked list - we traverse the list once
- **Space Complexity**: O(1) - we only use a constant amount of extra space

This solution efficiently reverses a portion of the linked list in one pass, as requested in the follow-up.

# Leet - Copy list with random pointer
#interview/DSA/linked-list

# Copy List with Random Pointer - Solution

This problem asks us to create a deep copy of a linked list where each node has an additional random pointer that can point to any node in the list or null.

## Algorithm
We can solve this in two approaches:

### Approach 1: Hash Map (Two-Pass)
1. First pass: Create a copy of each node and store the mapping from original to copy in a hash map
2. Second pass: Set the next and random pointers for each copied node using the hash map

### Approach 2: Interweaving (Three-Pass)
1. First pass: Create a copy of each node and place it right after the original node
2. Second pass: Set the random pointers for the copied nodes
3. Third pass: Separate the original and copied lists

Let's implement both approaches:

## Code Solution - Hash Map Approach

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""

class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if not head:
            return None
        
        # Dictionary to store mapping from original to copy
        node_map = {}
        
        # First pass: Create a copy of each node
        current = head
        while current:
            node_map[current] = Node(current.val)
            current = current.next
        
        # Second pass: Set next and random pointers
        current = head
        while current:
            # Set next pointer
            if current.next:
                node_map[current].next = node_map[current.next]
            
            # Set random pointer
            if current.random:
                node_map[current].random = node_map[current.random]
            
            current = current.next
        
        return node_map[head]
```


In LeetCode, the input [[7,null],[13,0],[11,4],[10,2],[1,0]] is just a representation format - it's not the actual linked list object that gets passed to your function. LeetCode converts this representation into a proper linked list before calling your function.
So what actually happens:
1 LeetCode takes the array representation [[7,null],[13,0],[11,4],[10,2],[1,0]]
1 Builds a real linked list with Node objects where:
* First node has value 7, random = null
* Second node has value 13, random = node at index 0 (the first node)
* Third node has value 11, random = node at index 4 (the fifth node)
* And so on
1 Passes the head of this actual linked list to your function

⠀When your function runs, you're working with actual Node objects, not the array representation. The node_map dictionary is storing:
* Keys: Original Node objects (memory addresses)
* Values: New Node objects you create with the same values

⠀This is why we need to create new Node objects - we're doing a deep copy, not just copying the values.

## Code Solution - Interweaving Approach

```python
class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        if not head:
            return None
        
        # First pass: Create a copy of each node and interweave
        current = head
        while current:
            copy = Node(current.val)
            copy.next = current.next
            current.next = copy
            current = copy.next
        
        # Second pass: Set random pointers for copied nodes
        current = head
        while current:
            if current.random:
                current.next.random = current.random.next
            current = current.next.next
        
        # Third pass: Separate the original and copied lists
        original = head
        copy_head = head.next
        copy_current = copy_head
        
        while original:
            original.next = original.next.next
            
            if copy_current.next:
                copy_current.next = copy_current.next.next
            
            original = original.next
            copy_current = copy_current.next
        
        return copy_head
```

The input `[[7,null],[13,0],[11,4],[10,2],[1,0]]` represents a linked list where each pair `[val, random_index]` contains:
1. The node's value
2. The index of the node that its random pointer points to (null means no random pointer)

When processed with our algorithm, the `node_map` would look like:

```python
node_map = {
    <original node 7>:  <new node with val=7>,
    <original node 13>: <new node with val=13>,
    <original node 11>: <new node with val=11>,
    <original node 10>: <new node with val=10>,
    <original node 1>:  <new node with val=1>
}
```

The algorithm:
1. Creates new nodes with the same values
2. Sets up `.next` connections following the original list order
3. Sets up `.random` connections using the dictionary to find the corresponding copied nodes

After processing, the linked list structure would be:
- Next pointers: 7 → 13 → 11 → 10 → 1 → null
- Random pointers:
  - 7's random: null
  - 13's random: points to node 7
  - 11's random: points to node 1
  - 10's random: points to node 11
  - 1's random: points to node 7

The dictionary isn't the final result - it's just a tool to help build the deep copy.

## Step-by-step Execution (Hash Map Approach)
Let's trace through the example: `head = [[7,null],[13,0],[11,4],[10,2],[1,0]]`

1. First pass: Create node copies and build the map
   - `node_map[node1(7)] = copy1(7)`
   - `node_map[node2(13)] = copy2(13)`
   - `node_map[node3(11)] = copy3(11)`
   - `node_map[node4(10)] = copy4(10)`
   - `node_map[node5(1)] = copy5(1)`

2. Second pass: Set next and random pointers
   - For node1(7):
     - `copy1.next = copy2`
     - `copy1.random = null`
   - For node2(13):
     - `copy2.next = copy3`
     - `copy2.random = copy1` (points to node at index 0)
   - For node3(11):
     - `copy3.next = copy4`
     - `copy3.random = copy5` (points to node at index 4)
   - For node4(10):
     - `copy4.next = copy5`
     - `copy4.random = copy3` (points to node at index 2)
   - For node5(1):
     - `copy5.next = null`
     - `copy5.random = copy1` (points to node at index 0)

3. Return `copy1` (the head of the copied list)

## Complexity Analysis
For both approaches:
- **Time Complexity**: O(n) where n is the number of nodes in the linked list
- **Space Complexity**: 
  - Hash Map Approach: O(n) for the dictionary
  - Interweaving Approach: O(1) extra space (not counting the output)

Both solutions efficiently create a deep copy of the linked list with random pointers, but the interweaving approach uses constant extra space.








I think there might be a misunderstanding about how the random pointers work in this problem.

The random pointer for each node is **fixed** and defined in the input. It doesn't "pick" nodes dynamically or change during the execution of the algorithm.

Let me clarify:

1. Each node in the linked list has a random pointer that points to a specific node in the list (or null).
2. These random connections are given to us in the input and don't change.
3. Our task is to create a deep copy where these same random connections exist between the copied nodes.

For example, in the input `[[7,null],[13,0],[11,4],[10,2],[1,0]]`:
- The node with value 7 has its random pointer set to null
- The node with value 13 has its random pointer set to the node at index 0 (value 7)
- The node with value 11 has its random pointer set to the node at index 4 (value 1)
- And so on...

These random pointers are part of the structure of the original linked list. They don't randomly select nodes during execution - they're predefined connections that we need to replicate in our copy.

Multiple nodes can have their random pointers pointing to the same node. For instance, in the example, both the node with value 13 and the node with value 1 have their random pointers pointing to the node with value 7.

Does this help clarify how the random pointers work in this problem?

# Leet - Has cycle
#interview/DSA/linked-list

# Linked List Cycle - Solution

This problem asks us to determine if a linked list contains a cycle, where a cycle exists if some node can be reached again by continuously following the next pointers.

## Algorithm: Floyd's Cycle-Finding Algorithm (Tortoise and Hare)

We can solve this using the "tortoise and hare" approach:

1. Use two pointers: a slow pointer (tortoise) that moves one step at a time and a fast pointer (hare) that moves two steps at a time
2. If there's a cycle, the fast pointer will eventually catch up to the slow pointer
3. If there's no cycle, the fast pointer will reach the end of the list

This approach uses O(1) memory as requested in the follow-up.

## Code Solution

```python
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def array_to_linked_list_with_cycle(arr, pos):
    if not arr:
        return None
    
    # Create nodes for all values
    nodes = [ListNode(val) for val in arr]
    
    # Link nodes together
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    
    # Create cycle if pos is valid
    if pos >= 0 and pos < len(nodes):
        # Connect the last node to the node at position pos
        nodes[-1].next = nodes[pos]
    
    # Return head of linked list
    return nodes[0]

head = array_to_linked_list_with_cycle([3,2,0,-4], 1)

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        # Handle empty list or single node
        if not head or not head.next:
            return False
        
        # Initialize slow and fast pointers
        slow = head
        fast = head
        
        # Move pointers until they meet or fast reaches the end
        while fast and fast.next:
            slow = slow.next        # Move slow one step
            fast = fast.next.next   # Move fast two steps
            
            # If they meet, there's a cycle
            if slow == fast:
                return True
        
        # If fast reached the end, there's no cycle
        return False
```


## Step-by-step Execution
Let's trace through the example: `head = [3,2,0,-4], pos = 1`

The linked list looks like: 3 → 2 → 0 → -4 → 2 → ...

1. Initialize: `slow = head` (node with value 3), `fast = head` (node with value 3)
2. First iteration:
   - `slow` moves to node with value 2
   - `fast` moves to node with value 0
3. Second iteration:
   - `slow` moves to node with value 0
   - `fast` moves to node with value 2 (the cycle node)
4. Third iteration:
   - `slow` moves to node with value -4
   - `fast` moves to node with value -4
   - `slow == fast` is True, so we return True

## Complexity Analysis
- **Time Complexity**: O(n) where n is the number of nodes in the linked list
  - If there's no cycle, we traverse the entire list once
  - If there's a cycle, we'll detect it before traversing the entire list twice
- **Space Complexity**: O(1) - we only use two pointers regardless of the list size

This solution efficiently detects cycles in a linked list while satisfying the O(1) memory constraint.

# Leet - Partition a list
#interview/DSA/linked-list
# Partition List Solution
Given the head of a linked list and a value x, partition it such that all nodes **less than** x come before nodes **greater than or equal** to x.
You should **preserve** the original relative order of the nodes in each of the two partitions.
 
**Example 1:**
![](partition.jpg)
**Input:** head = [1,4,3,2,5,2], x = 3
**Output:** [1,2,2,4,3,5]
## Algorithm

To partition a linked list such that all nodes less than x come before nodes greater than or equal to x while preserving the original relative order, we can:

1. Create two separate linked lists:
   - One for nodes with values less than x
   - One for nodes with values greater than or equal to x
2. Traverse the original list and append each node to the appropriate new list
3. Connect the two lists (less_than list followed by greater_equal list)
4. Return the head of the combined list

This approach ensures we maintain the original relative order within each partition.

## Optimal Solution

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def partition(head, x):
    # Create dummy heads for the two partitions
    less_head = ListNode(0)
    greater_head = ListNode(0)
    
    # Pointers to the current node in each partition
    less = less_head
    greater = greater_head
    
    # Traverse the original list
    current = head
    while current:
        # If current value is less than x, add to less list
        if current.val < x:
            less.next = current
            less = less.next
        # Otherwise, add to greater list
        else:
            greater.next = current
            greater = greater.next
        
        # Move to the next node in the original list
        current = current.next
    
    # Connect the two lists
    greater.next = None  # Ensure the end of the greater list points to None
    less.next = greater_head.next  # Connect less list to greater list
    
    # Return the head of the combined list
    return less_head.next
```



## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes in the linked list. We traverse the list exactly once.
- **Space Complexity**: O(1), as we only use a constant amount of extra space regardless of input size. We're rearranging the existing nodes, not creating new ones.

## Step-by-Step Example

Let's trace through the example: head = [1,4,3,2,5,2], x = 3

1. Initialize:
   - less_head = dummy node (0)
   - greater_head = dummy node (0)
   - less = less_head
   - greater = greater_head

2. Traverse the list:
   - Node 1: val = 1 < x, add to less list
     - less_head → 1
     - less = node 1
   - Node 2: val = 4 ≥ x, add to greater list
     - greater_head → 4
     - greater = node 4
   - Node 3: val = 3 ≥ x, add to greater list
     - greater_head → 4 → 3
     - greater = node 3
   - Node 4: val = 2 < x, add to less list
     - less_head → 1 → 2
     - less = node 2
   - Node 5: val = 5 ≥ x, add to greater list
     - greater_head → 4 → 3 → 5
     - greater = node 5
   - Node 6: val = 2 < x, add to less list
     - less_head → 1 → 2 → 2
     - less = node 2 (the second 2)

3. After traversal:
   - less list: less_head → 1 → 2 → 2
   - greater list: greater_head → 4 → 3 → 5

4. Connect the lists:
   - Set greater.next = None (terminate the greater list)
   - Set less.next = greater_head.next (connect less list to greater list)

5. Final result:
   - less_head → 1 → 2 → 2 → 4 → 3 → 5 → None

6. Return less_head.next, which is [1,2,2,4,3,5]

This solution efficiently partitions the list while maintaining the original relative order within each partition.

# UCARPT - DP Tree Bottom up
#interview/DSA/Tree
Excellent! Let me demonstrate **UCAPRT framework** on the remaining **Tree DP Optimization** problems, focusing on the new ones while providing brief recaps of previously covered problems.

# **Binary Tree Cameras (968) - Coverage Optimization** 📷
You are given the root of a binary tree. We install cameras on the tree nodes where each camera at a node can monitor its parent, itself, and its immediate children.
Return *the minimum number of cameras needed to monitor all nodes of the tree*.
 
**Example 1:**
![](bst_cameras_01.png)
**Input:** root = [0,0,null,0,0]
**Output:** 1
**Explanation:** One camera is enough to monitor all nodes if placed as shown.
**Example 2:**
![](bst_cameras_02.png)
**Input:** root = [0,0,null,0,null,0,null,null,0]
**Output:** 2
**Explanation:** At least two cameras are needed to monitor all nodes of the tree. The above image shows one of the valid configurations of camera placement.
 
**Constraints:**
* The number of nodes in the tree is in the range [1, 1000].
* Node.val == 0
## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Place minimum cameras to monitor entire binary tree
  
- What are inputs/outputs?
  → Input: Binary tree root
  → Output: Integer (minimum number of cameras needed)
  
- What are constraints?
  → Camera monitors node itself, parent, and children
  → Every node must be monitored by at least one camera
  → Want minimum number of cameras
  → Camera placement must ensure complete coverage
```

## **C - CLARIFY**
```python
# Example 1: Tree structure
#       0
#      / \
#     0   0
#        / \
#       0   0
#
# Optimal placement: 1 camera at root covers all 5 nodes
# Result: 1 camera

# Example 2: Larger tree
#       0
#      / \
#     0   0
#    /   / \
#   0   0   0
#
# Optimal: 2 cameras needed
# Place cameras strategically to minimize count while ensuring coverage

# Key insight: Greedy placement from leaves upward is optimal
# Prefer placing cameras at parents of leaves rather than leaves themselves

# Edge cases:
# - Single node: 1 camera needed
# - Two nodes: 1 camera (either node covers both)
# - Linear chain: every other node needs camera
```

## **A - ANALYZE PATTERN**
```
- Pattern: TREE DP with state-based optimization
- Key insight: Each node can be in 3 states: monitored, has camera, or needs monitoring
- State: (not_monitored, has_camera, monitored_by_child) for each subtree
- Transitions: Choose optimal camera placement based on children's states
- Goal: Minimize cameras while ensuring complete coverage
```

## **P - PLAN**
```python
# State definitions:
# 0 = not monitored (needs parent to have camera or be monitored)
# 1 = has camera (monitors itself, parent, and children)  
# 2 = monitored by child (child has camera, this node is covered)

# Transitions:
# If any child is not_monitored (0), current must have camera (1)
# If all children have cameras or are monitored, current can be not_monitored (0)
# Parent will handle monitoring if needed

# Greedy insight: Place cameras as high as possible while maintaining coverage

# Time: O(n), Space: O(h)
```

## **R - REFACTOR**
```python
def minCameraCover(root):
    cameras = 0
    
    def dfs(node):
        nonlocal cameras
        
        if not node:
            return 2  # Null nodes are considered monitored
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If any child is not monitored, current node must have camera
        if left == 0 or right == 0:
            cameras += 1
            return 1  # Current node has camera
        
        # If any child has camera, current node is monitored
        if left == 1 or right == 1:
            return 2  # Current node is monitored by child
        
        # Both children are monitored by their children
        # Current node is not monitored (parent needs to handle)
        return 0  # Current node not monitored
    
    # Special case: if root is not monitored, we need a camera at root
    root_state = dfs(root)
    if root_state == 0:
        cameras += 1
    
    return cameras

# Approach 2: Greedy with clear states
def minCameraCoverGreedy(root):
    NEEDS_CAMERA = 0
    HAS_CAMERA = 1  
    COVERED = 2
    
    cameras = 0
    
    def dfs(node):
        nonlocal cameras
        
        if not node:
            return COVERED
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If any child needs camera, place camera here
        if left == NEEDS_CAMERA or right == NEEDS_CAMERA:
            cameras += 1
            return HAS_CAMERA
        
        # If any child has camera, this node is covered
        if left == HAS_CAMERA or right == HAS_CAMERA:
            return COVERED
        
        # Both children are covered, but this node needs camera from parent
        return NEEDS_CAMERA
    
    # Handle root special case
    if dfs(root) == NEEDS_CAMERA:
        cameras += 1
    
    return cameras
```

## **T - TEST**
```python
# Test tree:
#       0
#      / \
#     0   0
#    /     \
#   0       0

# DFS trace:
# dfs(leftmost leaf): returns NEEDS_CAMERA (0)
# dfs(rightmost leaf): returns NEEDS_CAMERA (0)  
# dfs(left child): left=NEEDS_CAMERA → place camera, cameras=1, returns HAS_CAMERA
# dfs(right child): right=NEEDS_CAMERA → place camera, cameras=2, returns HAS_CAMERA
# dfs(root): left=HAS_CAMERA, right=HAS_CAMERA → returns COVERED

# Root state = COVERED, no additional camera needed
# Result: 2 cameras ✓
```

---

# **Distribute Coins in Binary Tree (979) - Resource Distribution** 🪙
You are given the root of a binary tree with n nodes where each node in the tree has node.val coins. There are n coins in total throughout the whole tree.
In one move, we may choose two adjacent nodes and move one coin from one node to another. A move may be from parent to child, or from child to parent.
Return *the* ***minimum*** *number of moves required to make every node have* ***exactly*** *one coin*.
 
**Example 1:**
![](tree1.png)
**Input:** root = [3,0,0]
**Output:** 2
**Explanation:** From the root of the tree, we move one coin to its left child, and one coin to its right child.
**Example 2:**
![](tree2.png)
**Input:** root = [0,3,0]
**Output:** 3
**Explanation:** From the left child of the root, we move two coins to the root [taking two moves]. Then, we move one coin from the root of the tree to the right child.
* The number of nodes in the tree is n.
* 1 <= n <= 100
* 0 <= Node.val <= n
* The sum of all Node.val is n.
## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Redistribute coins so each node has exactly 1 coin with minimum moves
  
- What are inputs/outputs?
  → Input: Binary tree where each node has some coins
  → Output: Integer (minimum moves to distribute coins)
  
- What are constraints?
  → Each node should end up with exactly 1 coin
  → Total coins = total nodes (redistribution possible)
  → Move = transfer 1 coin between adjacent nodes
  → Want minimum total moves
```

## **C - CLARIFY**
```python
# Example 1: Tree structure
#       3
#      / \
#     0   0
# 
# Node values represent current coin counts
# Need: each node has 1 coin
# Root has 3, children have 0 each
# Solution: move 1 coin from root to each child (2 moves)
# Result: 2 moves

# Example 2: More complex
#       2
#      / \
#     0   2
#        /
#       0
#
# Optimal redistribution requires moving coins through tree
# Some nodes need coins, others have excess

# Key insight: For each subtree, calculate net excess/deficit
# Coins must flow through parent-child edges

# Edge cases:
# - All nodes already have 1 coin: 0 moves
# - Single node with multiple coins: 0 moves (already valid)
# - Highly unbalanced distribution: many moves needed
```

## **A - ANALYZE PATTERN**
```
- Pattern: TREE DP with flow calculation
- Key insight: For each subtree, calculate net coin flow to parent
- State: Excess/deficit coins in each subtree
- Transitions: Accumulate flow requirements from children
- Goal: Minimize total coin movements across all edges
```

## **P - PLAN**
```python
# Key insight: Each node needs exactly 1 coin
# For each subtree rooted at node:
# - excess = (total_coins_in_subtree) - (nodes_in_subtree)
# - If excess > 0: subtree gives coins to parent
# - If excess < 0: subtree receives coins from parent
# - |excess| = number of coins flowing through parent edge

# Algorithm:
# 1. For each node, calculate subtree excess/deficit
# 2. Sum absolute values of all flows = total moves
# 3. Post-order traversal to calculate bottom-up

# Time: O(n), Space: O(h)
```

## **R - REFACTOR**
```python
def distributeCoins(root):
    moves = 0
    
    def dfs(node):
        nonlocal moves
        
        if not node:
            return 0
        
        # Get excess/deficit from left and right subtrees
        left_excess = dfs(node.left)
        right_excess = dfs(node.right)
        
        # Count moves needed for children's excess/deficit
        moves += abs(left_excess) + abs(right_excess)
        
        # Calculate current subtree's excess/deficit
        # excess = coins_in_subtree - nodes_in_subtree
        # For current node: need 1 coin, have node.val coins
        current_excess = node.val - 1 + left_excess + right_excess
        
        return current_excess
    
    dfs(root)
    return moves


# Approach 3: Flow-based calculation
def distributeCoinsFlow(root):
    total_moves = 0
    
    def calculate_flow(node):
        nonlocal total_moves
        
        if not node:
            return 0
        
        # Calculate flow from children
        left_flow = calculate_flow(node.left)
        right_flow = calculate_flow(node.right)
        
        # Add absolute flows to total moves
        total_moves += abs(left_flow) + abs(right_flow)
        
        # Current node's contribution to parent flow
        # = current coins - 1 (needed) + net flow from children
        return node.val - 1 + left_flow + right_flow
    
    calculate_flow(root)
    return total_moves

# Approach 4: Bottom-up with balance calculation
def distributeCoinsBalance(root):
    def dfs(node):
        if not node:
            return 0, 0  # (moves, balance)
        
        left_moves, left_balance = dfs(node.left)
        right_moves, right_balance = dfs(node.right)
        
        # Total moves = children moves + flows through current node
        total_moves = left_moves + right_moves + abs(left_balance) + abs(right_balance)
        
        # Balance for current subtree (positive = excess, negative = deficit)
        current_balance = node.val - 1 + left_balance + right_balance
        
        return total_moves, current_balance
    
    moves, _ = dfs(root)
    return moves
```
## omplexity Analysis Summary
| **Approach** | **Time Complexity** | **Space Complexity** | **Return Values** | **Code Clarity** | **Best Use Case** |
|---|---|---|---|---|---|
| **Approach 1: Global Counter** | O(n) | O(h) | 1 value | Simple | **General purpose** |
| **Approach 2: Flow-based** | O(n) | O(h) | 1 value | Simple | **Same as Approach 1** |
| **Approach 3: Bottom-up Balance** | O(n) | O(h) | 2 values | Complex | **When balance needed** |

## **T - TEST**
```python
# Test tree:
#       3
#      / \
#     0   0

# DFS trace:
# dfs(left child 0): returns 0-1 = -1 (needs 1 coin)
# dfs(right child 0): returns 0-1 = -1 (needs 1 coin)  
# dfs(root 3): 
#   left_excess = -1, right_excess = -1
#   moves += |-1| + |-1| = 2
#   current_excess = 3-1 + (-1) + (-1) = 0
#   returns 0

# Total moves = 2 ✓
# Interpretation: Root gives 1 coin to each child
```
I'll trace through the Distribute Coins in Binary Tree algorithm using a concrete example in nested format.

## Example Tree: [3,0,0] → Expected: 2 moves

```
       3
      / \
     0   0
```

**Initial state**: Root has 3 coins, children have 0 coins each
**Target**: Each node should have exactly 1 coin
**Solution**: Move 1 coin from root to left child, 1 coin from root to right child

## Nested Execution Trace:

```
🌟 distributeCoins([3,0,0])
    └─ moves = 0
    └─ dfs(3) [root]
        ├─ 🔍 LEFT: dfs(0)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   ├─ left_excess = 0, right_excess = 0
        │   ├─ moves += |0| + |0| = 0 → moves = 0 📝
        │   ├─ current_excess = 0 - 1 + 0 + 0 = -1 📍 (needs 1 coin)
        │   └─ return -1
        │
        ├─ 🔍 RIGHT: dfs(0)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   ├─ left_excess = 0, right_excess = 0
        │   ├─ moves += |0| + |0| = 0 → moves = 0 📝
        │   ├─ current_excess = 0 - 1 + 0 + 0 = -1 📍 (needs 1 coin)
        │   └─ return -1
        │
        ├─ left_excess = -1, right_excess = -1
        ├─ moves += |-1| + |-1| = 2 → moves = 2 📝 🎯 (2 MOVES!)
        ├─ current_excess = 3 - 1 + (-1) + (-1) = 0 ✅ (balanced)
        └─ return 0

🎯 FINAL RESULT: 2 moves
```

---

## More Complex Example: [1,0,2] → Expected: 2 moves

```
       1
      / \
     0   2
```

## Nested Execution Trace - Complex Example:

```
🌟 distributeCoins([1,0,2])
    └─ moves = 0
    └─ dfs(1) [root]
        ├─ 🔍 LEFT: dfs(0)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   ├─ left_excess = 0, right_excess = 0
        │   ├─ moves += |0| + |0| = 0 → moves = 0 📝
        │   ├─ current_excess = 0 - 1 + 0 + 0 = -1 📍 (needs 1 coin)
        │   └─ return -1
        │
        ├─ 🔍 RIGHT: dfs(2)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   ├─ left_excess = 0, right_excess = 0
        │   ├─ moves += |0| + |0| = 0 → moves = 0 📝
        │   ├─ current_excess = 2 - 1 + 0 + 0 = 1 💰 (has 1 extra coin)
        │   └─ return 1
        │
        ├─ left_excess = -1, right_excess = 1
        ├─ moves += |-1| + |1| = 2 → moves = 2 📝 🎯 (2 MOVES!)
        ├─ current_excess = 1 - 1 + (-1) + 1 = 0 ✅ (balanced)
        └─ return 0

🎯 FINAL RESULT: 2 moves
```

---

## Even More Complex Example: [1,0,0,null,3] → Expected: 4 moves

```
       1
      / \
     0   0
          \
           3
```

## Nested Execution Trace - Advanced Example:

```
🌟 distributeCoins([1,0,0,null,3])
    └─ moves = 0
    └─ dfs(1) [root]
        ├─ 🔍 LEFT: dfs(0)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   ├─ left_excess = 0, right_excess = 0
        │   ├─ moves += |0| + |0| = 0 → moves = 0 📝
        │   ├─ current_excess = 0 - 1 + 0 + 0 = -1 📍 (needs 1 coin)
        │   └─ return -1
        │
        ├─ 🔍 RIGHT: dfs(0)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(3)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_excess = 0, right_excess = 0
        │   │   ├─ moves += |0| + |0| = 0 → moves = 0 📝
        │   │   ├─ current_excess = 3 - 1 + 0 + 0 = 2 💰💰 (has 2 extra coins)
        │   │   └─ return 2
        │   │
        │   ├─ left_excess = 0, right_excess = 2
        │   ├─ moves += |0| + |2| = 2 → moves = 2 📝 (2 coins move from node 3)
        │   ├─ current_excess = 0 - 1 + 0 + 2 = 1 💰 (has 1 extra coin after receiving)
        │   └─ return 1
        │
        ├─ left_excess = -1, right_excess = 1
        ├─ moves += |-1| + |1| = 2 → moves = 4 📝 🎯 (4 TOTAL MOVES!)
        ├─ current_excess = 1 - 1 + (-1) + 1 = 0 ✅ (balanced)
        └─ return 0

🎯 FINAL RESULT: 4 moves
```

## Key Insights from Nested Execution:

### **Excess/Deficit Calculation:**
- **Formula**: `current_excess = node.val - 1 + left_excess + right_excess`
- **Meaning**: How many coins this subtree has relative to what it needs

### **Move Counting:**
- **Each excess/deficit unit = 1 move** across parent-child edge
- **Absolute values**: `|left_excess| + |right_excess|`
- **Direction doesn't matter**: Moving coin up or down both count as 1 move

### **Flow Analysis:**

**Example [1,0,0]:**
- Left child needs 1 coin ← Root provides 1 coin
- Right child needs 1 coin ← Root provides 1 coin  
- Total: 2 moves

**Example [1,0,0,null,3]:**
- Node 3 has 2 extra coins → moves 2 to parent (node 0)
- Node 0 receives 2, needs 1, so has 1 extra → moves 1 to parent (root)
- Root receives 1, needs 1 for left child → moves 1 to left child
- Total: 2 + 1 + 1 = 4 moves

### **Algorithm Magic:**
1. **Bottom-up processing**: Resolve deepest imbalances first
2. **Flow aggregation**: Each subtree reports net excess/deficit to parent
3. **Move accumulation**: Sum of all absolute excess values = total moves
4. **Conservation**: Total coins always equals total nodes (given constraint)

The algorithm elegantly calculates minimum moves by tracking coin flow through each edge exactly once!
----

---

# **Quick Recaps of Previously Covered Problems** 📝

## **House Robber III (337) - Previously Covered**
```python
# Key insight: Track (rob_current, not_rob_current) states
# rob_current = node.val + left_not_rob + right_not_rob  
# not_rob_current = max(left_states) + max(right_states)
# Time: O(n), Space: O(h)
```

## **Binary Tree Maximum Path Sum (124) - Previously Covered**
```python
# Key insight: Track max_gain_downward vs global_max_path
# max_gain = node.val + max(0, left_gain, right_gain)
# path_through_current = node.val + max(0,left_gain) + max(0,right_gain)
# Time: O(n), Space: O(h)
```

## **Diameter of Binary Tree (543) - Previously Covered**
```python
# Key insight: Diameter through node = left_depth + right_depth
# depth = 1 + max(left_depth, right_depth)
# diameter = max(diameter, left_depth + right_depth)
# Time: O(n), Space: O(h)
```

---

# **Tree DP Optimization Pattern Recognition** 🌳

## **Common Characteristics:**
1. **State Definition**: Each node has multiple possible states or values
2. **Optimal Substructure**: Optimal solution depends on optimal solutions of subtrees
3. **Bottom-up Processing**: Process children before parent (post-order)
4. **Global vs Local**: Often track both local optimum and global optimum

## **Template Recognition:**
```python
# Universal Tree DP Optimization Template
def tree_dp_optimization(root):
    global_optimum = initial_value
    
    def dfs(node):
        nonlocal global_optimum
        
        if not node:
            return base_case
        
        # Process children first (bottom-up)
        left_result = dfs(node.left)
        right_result = dfs(node.right)
        
        # Calculate all possible states for current node
        state_options = []
        for state in possible_states:
            value = calculate_state_value(node, left_result, right_result, state)
            state_options.append(value)
        
        # Update global optimum
        global_optimum = optimize(global_optimum, state_options)
        
        # Return best state for parent to use
        return best_state_for_parent(state_options)
    
    dfs(root)
    return global_optimum
```

## **When to Use Tree DP Optimization:** 🎯
- **Resource allocation** problems (cameras, coins, robber)
- **Path optimization** with constraints
- **Coverage/monitoring** problems
- **Flow/distribution** problems
- **Metric calculation** (diameter, depth, balance)

## **Key Insights:**
1. **Greedy often works**: Place resources optimally at each level
2. **State tracking**: Multiple states per node capture different scenarios
3. **Flow analysis**: Calculate net flow/excess for distribution problems
4. **Constraint propagation**: Parent decisions affect children and vice versa

**Tree DP optimization problems require careful state design and understanding how local decisions impact global optimality!** 🚀

# UCARPT - Path finding
#interview/DSA/Tree
# Path Sum Problems - UCAPRT Framework Analysis

## 1. Path Sum (112) - Binary Tree Path Sum Check

### **U**nderstand
- **Problem**: Given a binary tree and target sum, determine if there exists a root-to-leaf path with sum equal to target
- **Input**: TreeNode root, int targetSum
- **Output**: boolean (true if path exists)
- **Constraints**: Path must go from root to leaf

### **C**larify
```python
# Example 1: [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
#      5
#     / \
#    4   8
#   /   / \
#  11  13  4
# / \      \
#7   2      1
# Path: 5→4→11→2 = 22 ✓

# Example 2: [1,2,3], targetSum = 5
#   1
#  / \
# 2   3
# No root-to-leaf path sums to 5 ✗
```

### **A**nalyze Pattern
- **Pattern**: Tree DFS with sum tracking
- **Key Insight**: Subtract current node value from target, check if leaf node has remaining sum
- **Approach**: Recursive DFS with target reduction

### **P**lan
```python
def hasPathSum(root, targetSum):
    # Base case: empty tree
    if not root:
        return False
    
    # Leaf node check
    if not root.left and not root.right:
        return root.val == targetSum
    
    # Recursive case: reduce target by current value
    remaining = targetSum - root.val
    return hasPathSum(root.left, remaining) or hasPathSum(root.right, remaining)
```

### **R**efactor & **T**est
```python
def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
    if not root:
        return False
    
    # Check if leaf node equals remaining sum
    if not root.left and not root.right:
        return root.val == targetSum
    
    # Recurse with reduced target
    new_target = targetSum - root.val
    return (self.hasPathSum(root.left, new_target) or 
            self.hasPathSum(root.right, new_target))

# Time: O(n), Space: O(h) where h is height
```

---

## 2. Path Sum II (113) - All Root-to-Leaf Paths

### **U**nderstand
- **Problem**: Find all root-to-leaf paths where sum equals target
- **Input**: TreeNode root, int targetSum
- **Output**: List[List[int]] (all valid paths)
- **Constraints**: Must return actual paths, not just existence

### **C**larify
```python
# Example: [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
# Output: [[5,4,11,2], [5,8,4,1]]
# Both paths sum to 22
```

### **A**nalyze Pattern
- **Pattern**: Tree DFS with path tracking and backtracking
- **Key Insight**: Need to maintain current path and backtrack after exploring each branch
- **Approach**: DFS with path building and result collection

### **P**lan & Implementation
```python
def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
    def dfs(node, target, path, result):
        if not node:
            return
        
        # Add current node to path
        path.append(node.val)
        
        # Check if leaf node and sum matches
        if not node.left and not node.right and node.val == target:
            result.append(path[:])  # Copy current path
        
        # Recurse on children
        remaining = target - node.val
        dfs(node.left, remaining, path, result)
        dfs(node.right, remaining, path, result)
        
        # Backtrack
        path.pop()
    
    result = []
    dfs(root, targetSum, [], result)
    return result

# Time: O(n²) worst case (copying paths), Space: O(n²)

Call Stack          Path State           Action
-----------         ----------           ------
dfs(1, 7)          []                   append(1) → [1]
├─dfs(2, 6)        [1]                  append(2) → [1,2]
  ├─dfs(4, 4)      [1,2]                append(4) → [1,2,4]
    ├─dfs(None)    [1,2,4]              return
    └─dfs(None)    [1,2,4]              return
  │                [1,2,4]              pop() → [1,2]  ← BACKTRACK
  └─dfs(None)      [1,2]                return
│                  [1,2]                pop() → [1]    ← BACKTRACK
└─dfs(3, 6)        [1]                  append(3) → [1,3]
  ├─dfs(None)      [1,3]                return
  └─dfs(None)      [1,3]                return
                   [1,3]                pop() → [1]    ← BACKTRACK
                   [1]                  pop() → []     ← BACKTRACK

```

---

## 3. Path Sum III (437) - Any Path with Target Sum

### **U**nderstand
- **Problem**: Find number of paths (not necessarily root-to-leaf) that sum to target
- **Input**: TreeNode root, int targetSum
- **Output**: int (count of valid paths)
- **Constraints**: Path must go downward (parent to child)

### **C**larify
```python
# Example: [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
# Paths: [5,3], [5,2,1], [-3,11] all sum to 8
```

### **A**nalyze Pattern
- **Pattern**: Tree DFS with prefix sum optimization
- **Key Insight**: Use prefix sum technique - if prefix[j] - prefix[i] = target, then path from i+1 to j has target sum
- **Approach**: DFS with HashMap to store prefix sum frequencies

### **P**lan & Implementation
```python
def pathSum(self, root: Optional[TreeNode], targetSum: int) -> int:
    def dfs(node, current_sum, prefix_count):
        if not node:
            return 0
        
        # Update current sum
        current_sum += node.val
        
        # Count paths ending at current node
        count = prefix_count.get(current_sum - targetSum, 0)
        
        # Add current sum to prefix count
        prefix_count[current_sum] = prefix_count.get(current_sum, 0) + 1
        
        # Recurse on children
        count += dfs(node.left, current_sum, prefix_count)
        count += dfs(node.right, current_sum, prefix_count)
        
        # Backtrack: remove current sum
        prefix_count[current_sum] -= 1
        
        return count
    
    # Initialize with 0 sum (for paths starting from root)
    return dfs(root, 0, {0: 1})

# Time: O(n), Space: O(n)
```
I'll show the nested recursive execution with proper indentation to visualize the call stack depth.

## Tree: [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8

```python
            10
           /  \
          5    -3
         / \     \
        3   2     11
       / \   \
      3  -2   1
# Expected paths: [5,3]=8, [5,2,1]=8, [-3,11]=8
```

## Nested Execution Trace:

```
🌟 pathSum(root, 8)
    └─ dfs(10, current_sum=0, prefix_count={0: 1})
        ├─ current_sum = 0 + 10 = 10
        ├─ looking for: 10 - 8 = 2 → prefix_count.get(2) = 0 → count = 0
        ├─ prefix_count = {0: 1, 10: 1}
        │
        ├─ 🔍 LEFT: dfs(5, current_sum=10, prefix_count={0: 1, 10: 1})
        │   ├─ current_sum = 10 + 5 = 15
        │   ├─ looking for: 15 - 8 = 7 → prefix_count.get(7) = 0 → count = 0
        │   ├─ prefix_count = {0: 1, 10: 1, 15: 1}
        │   │
        │   ├─ 🔍 LEFT: dfs(3, current_sum=15, prefix_count={0: 1, 10: 1, 15: 1})
        │   │   ├─ current_sum = 15 + 3 = 18
        │   │   ├─ looking for: 18 - 8 = 10 → prefix_count.get(10) = 1 ✅ PATH [5,3] FOUND!
        │   │   ├─ count = 1
        │   │   ├─ prefix_count = {0: 1, 10: 1, 15: 1, 18: 1}
        │   │   │
        │   │   ├─ 🔍 LEFT: dfs(3, current_sum=18, prefix_count={0: 1, 10: 1, 15: 1, 18: 1})
        │   │   │   ├─ current_sum = 18 + 3 = 21
        │   │   │   ├─ looking for: 21 - 8 = 13 → prefix_count.get(13) = 0 → count = 0
        │   │   │   ├─ prefix_count = {0: 1, 10: 1, 15: 1, 18: 1, 21: 1}
        │   │   │   ├─ no children → count += 0
        │   │   │   ├─ 🔙 BACKTRACK: prefix_count[21] -= 1
        │   │   │   └─ return count = 0
        │   │   │
        │   │   ├─ 🔍 RIGHT: dfs(-2, current_sum=18, prefix_count={0: 1, 10: 1, 15: 1, 18: 1})
        │   │   │   ├─ current_sum = 18 + (-2) = 16
        │   │   │   ├─ looking for: 16 - 8 = 8 → prefix_count.get(8) = 0 → count = 0
        │   │   │   ├─ prefix_count = {0: 1, 10: 1, 15: 1, 18: 1, 16: 1}
        │   │   │   ├─ no children → count += 0
        │   │   │   ├─ 🔙 BACKTRACK: prefix_count[16] -= 1
        │   │   │   └─ return count = 0
        │   │   │
        │   │   ├─ count = 1 + 0 + 0 = 1
        │   │   ├─ 🔙 BACKTRACK: prefix_count[18] -= 1 → {0: 1, 10: 1, 15: 1}
        │   │   └─ return count = 1
        │   │
        │   ├─ 🔍 RIGHT: dfs(2, current_sum=15, prefix_count={0: 1, 10: 1, 15: 1})
        │   │   ├─ current_sum = 15 + 2 = 17
        │   │   ├─ looking for: 17 - 8 = 9 → prefix_count.get(9) = 0 → count = 0
        │   │   ├─ prefix_count = {0: 1, 10: 1, 15: 1, 17: 1}
        │   │   │
        │   │   ├─ 🔍 RIGHT: dfs(1, current_sum=17, prefix_count={0: 1, 10: 1, 15: 1, 17: 1})
        │   │   │   ├─ current_sum = 17 + 1 = 18
        │   │   │   ├─ looking for: 18 - 8 = 10 → prefix_count.get(10) = 1 ✅ PATH [5,2,1] FOUND!
        │   │   │   ├─ count = 1
        │   │   │   ├─ prefix_count = {0: 1, 10: 1, 15: 1, 17: 1, 18: 1}
        │   │   │   ├─ no children → count += 0
        │   │   │   ├─ 🔙 BACKTRACK: prefix_count[18] -= 1
        │   │   │   └─ return count = 1
        │   │   │
        │   │   ├─ count = 0 + 1 = 1
        │   │   ├─ 🔙 BACKTRACK: prefix_count[17] -= 1 → {0: 1, 10: 1, 15: 1}
        │   │   └─ return count = 1
        │   │
        │   ├─ count = 0 + 1 + 1 = 2
        │   ├─ 🔙 BACKTRACK: prefix_count[15] -= 1 → {0: 1, 10: 1}
        │   └─ return count = 2
        │
        ├─ 🔍 RIGHT: dfs(-3, current_sum=10, prefix_count={0: 1, 10: 1})
        │   ├─ current_sum = 10 + (-3) = 7
        │   ├─ looking for: 7 - 8 = -1 → prefix_count.get(-1) = 0 → count = 0
        │   ├─ prefix_count = {0: 1, 10: 1, 7: 1}
        │   │
        │   ├─ 🔍 RIGHT: dfs(11, current_sum=7, prefix_count={0: 1, 10: 1, 7: 1})
        │   │   ├─ current_sum = 7 + 11 = 18
        │   │   ├─ looking for: 18 - 8 = 10 → prefix_count.get(10) = 1 ✅ PATH [-3,11] FOUND!
        │   │   ├─ count = 1
        │   │   ├─ prefix_count = {0: 1, 10: 1, 7: 1, 18: 1}
        │   │   ├─ no children → count += 0
        │   │   ├─ 🔙 BACKTRACK: prefix_count[18] -= 1
        │   │   └─ return count = 1
        │   │
        │   ├─ count = 0 + 1 = 1
        │   ├─ 🔙 BACKTRACK: prefix_count[7] -= 1 → {0: 1, 10: 1}
        │   └─ return count = 1
        │
        ├─ count = 0 + 2 + 1 = 3
        ├─ 🔙 BACKTRACK: prefix_count[10] -= 1 → {0: 1}
        └─ return count = 3

🎯 FINAL RESULT: 3 paths found
```

## Key Observations in Nested Execution:

1. **Call Stack Depth**: Each level of indentation represents deeper recursion
2. **Prefix Count Evolution**: Watch how `prefix_count` grows and shrinks with backtracking
3. **Path Discovery**: Three paths found at different depths:
   - `[5,3]` found at depth 3
   - `[5,2,1]` found at depth 4
   - `[-3,11]` found at depth 3
4. **Backtracking**: Each return removes its contribution from `prefix_count`
5. **State Isolation**: Sibling nodes get clean `prefix_count` due to backtracking

## Magic Moment Breakdown:

**Path [5,3] Discovery:**
- At node 3: `current_sum = 18`, looking for `18 - 8 = 10`
- `prefix_count[10] = 1` (from node 10) ✅
- This means: sum from node 10 to node 3 minus sum from node 10 to some ancestor = 8

**Path [5,2,1] Discovery:**
- At node 1: `current_sum = 18`, looking for `18 - 8 = 10`  
- `prefix_count[10] = 1` (from node 10) ✅
- Different path, same math!

**Path [-3,11] Discovery:**
- At node 11: `current_sum = 18`, looking for `18 - 8 = 10`
- `prefix_count[10] = 1` (from node 10) ✅
- Path goes: 10 → -3 → 11, but we want just [-3,11]

The nested structure beautifully shows how the algorithm maintains context and discovers paths at different recursion levels!
---

## 4. Binary Tree Maximum Path Sum (124)

### **U**nderstand
- **Problem**: Find maximum sum of any path in binary tree
- **Input**: TreeNode root
- **Output**: int (maximum path sum)
- **Constraints**: Path can start and end at any nodes, must be connected

### **C**larify
```python
# Example: [1,2,3] → Maximum path is 2→1→3 = 6
# Example: [-10,9,20,null,null,15,7] → Maximum path is 15→20→7 = 42
```

### **A**nalyze Pattern
- **Pattern**: Tree DP with global maximum tracking
- **Key Insight**: At each node, decide whether to include it in path or start new path
- **Approach**: Post-order DFS returning maximum path sum through current node

### **P**lan & Implementation
```python
def maxPathSum(self, root: Optional[TreeNode]) -> int:
    def dfs(node):
        nonlocal max_sum
        
        if not node:
            return 0
        
        # Get maximum path sum from left and right subtrees
        # Use max(0, ...) to ignore negative contributions
        left_max = max(0, dfs(node.left))
        right_max = max(0, dfs(node.right))
        
        # Maximum path sum including current node as "peak"
        current_max = node.val + left_max + right_max
        
        # Update global maximum
        max_sum = max(max_sum, current_max)
        
        # Return maximum path sum that can be extended upward
        return node.val + max(left_max, right_max)
    
    max_sum = float('-inf')
    dfs(root)
    return max_sum

# Time: O(n), Space: O(h)
```
I'll trace through the Maximum Path Sum algorithm using your tree in nested format.

## Tree: [9,-10,20,null,null,15,7]

```
       9
      / \
   -10   20
         / \
        15  7
```

## Nested Execution Trace:

```
🌟 maxPathSum(root)
    └─ max_sum = -∞
    └─ dfs(9)
        ├─ 🔍 LEFT: dfs(-10)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   ├─ left_max = max(0, 0) = 0
        │   ├─ right_max = max(0, 0) = 0
        │   ├─ current_max = -10 + 0 + 0 = -10
        │   ├─ max_sum = max(-∞, -10) = -10 📝
        │   └─ return -10 + max(0, 0) = -10
        │
        ├─ 🔍 RIGHT: dfs(20)
        │   ├─ 🔍 LEFT: dfs(15)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_max = max(0, 0) = 0
        │   │   ├─ right_max = max(0, 0) = 0
        │   │   ├─ current_max = 15 + 0 + 0 = 15
        │   │   ├─ max_sum = max(-10, 15) = 15 📝
        │   │   └─ return 15 + max(0, 0) = 15
        │   │
        │   ├─ 🔍 RIGHT: dfs(7)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_max = max(0, 0) = 0
        │   │   ├─ right_max = max(0, 0) = 0
        │   │   ├─ current_max = 7 + 0 + 0 = 7
        │   │   ├─ max_sum = max(15, 7) = 15 📝
        │   │   └─ return 7 + max(0, 0) = 7
        │   │
        │   ├─ left_max = max(0, 15) = 15
        │   ├─ right_max = max(0, 7) = 7
        │   ├─ current_max = 20 + 15 + 7 = 42 🎯 PATH [15-20-7]
        │   ├─ max_sum = max(15, 42) = 42 📝
        │   └─ return 20 + max(15, 7) = 20 + 15 = 35
        │
        ├─ left_max = max(0, -10) = 0 🚫 (ignore negative)
        ├─ right_max = max(0, 35) = 35
        ├─ current_max = 9 + 0 + 35 = 44 🎯 PATH [9-20-15]
        ├─ max_sum = max(42, 44) = 44 📝
        └─ return 9 + max(0, 35) = 9 + 35 = 44

🎯 FINAL RESULT: 44
```

## Key Insights from Nested Execution:

### **Two Types of Returns:**
1. **`current_max`**: Path passing **through** current node (node as "peak")
2. **`return value`**: Path that can be **extended upward** (one-sided)

### **Critical Moments:**

**At Node 15 (Leaf):**
- `current_max = 15` (just the node itself)
- `return 15` (can extend upward)

**At Node 7 (Leaf):**
- `current_max = 7` (just the node itself)  
- `return 7` (can extend upward)

**At Node 20 (Internal):**
- `current_max = 20 + 15 + 7 = 42` 🎯 **PATH [15-20-7]**
- `return 20 + 15 = 35` (best upward path: 20→15)

**At Node -10 (Leaf):**
- `current_max = -10` (negative, but still candidate)
- `return -10` → becomes `max(0, -10) = 0` when used above

**At Node 9 (Root):**
- Ignores left subtree: `max(0, -10) = 0`
- Uses right subtree: `max(0, 35) = 35`
- `current_max = 9 + 0 + 35 = 44` 🎯 **PATH [9-20-15]**

### **Path Evolution:**
1. **First candidate**: Node 15 alone = 15
2. **Second candidate**: Path [15-20-7] = 42  
3. **Final winner**: Path [9-20-15] = 44

### **Algorithm Magic:**
- **Negative Pruning**: `max(0, ...)` ignores paths that would decrease sum
- **Local vs Global**: Each node considers both local optimum and global contribution
- **Bottom-up**: Leaf information propagates upward to form larger paths

The optimal path is **[9→20→15]** with sum **44**!
---

## 5. Longest Univalue Path (687)

### **U**nderstand
- **Problem**: Find length of longest path where all nodes have same value
- **Input**: TreeNode root
- **Output**: int (length of longest uniform path)
- **Constraints**: Path length = number of edges, not nodes

### **C**larify
```python
# Example: [5,4,5,1,1,null,5] → Longest path is 5→5→5 (2 edges)
# Example: [1,4,5,4,4,null,5] → Longest path is 4→4→4 (2 edges)
```

### **A**nalyze Pattern
- **Pattern**: Tree DP with path extension tracking
- **Key Insight**: Similar to maximum path sum, but track uniform value paths
- **Approach**: Return longest uniform path extending through current node

### **P**lan & Implementation
```python
def longestUnivaluePath(self, root: Optional[TreeNode]) -> int:
    def dfs(node):
        nonlocal max_length
        
        if not node:
            return 0
        
        # Get longest uniform paths from children
        left_length = dfs(node.left)
        right_length = dfs(node.right)
        
        # Extend path if values match
        left_extend = left_length + 1 if node.left and node.left.val == node.val else 0
        right_extend = right_length + 1 if node.right and node.right.val == node.val else 0
        
        # Maximum path through current node
        current_max = left_extend + right_extend
        max_length = max(max_length, current_max)
        
        # Return longest extendable path
        return max(left_extend, right_extend)
    
    max_length = 0
    dfs(root)
    return max_length

# Time: O(n), Space: O(h)
```
I'll trace through the Longest Univalue Path algorithm using both examples in nested format.

## Example 1: [5,4,5,1,1,null,5] → Expected: 2 edges (path 5→5→5)

```
       5
      / \
     4   5
    / \   \
   1   1   5
```

## Nested Execution Trace - Example 1:

```
🌟 longestUnivaluePath([5,4,5,1,1,null,5])
    └─ max_length = 0
    └─ dfs(5) [root]
        ├─ 🔍 LEFT: dfs(4)
        │   ├─ 🔍 LEFT: dfs(1)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_length = 0, right_length = 0
        │   │   ├─ left_extend = 0 (no left child)
        │   │   ├─ right_extend = 0 (no right child)
        │   │   ├─ current_max = 0 + 0 = 0
        │   │   ├─ max_length = max(0, 0) = 0 📝
        │   │   └─ return max(0, 0) = 0
        │   │
        │   ├─ 🔍 RIGHT: dfs(1)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_length = 0, right_length = 0
        │   │   ├─ left_extend = 0 (no left child)
        │   │   ├─ right_extend = 0 (no right child)
        │   │   ├─ current_max = 0 + 0 = 0
        │   │   ├─ max_length = max(0, 0) = 0 📝
        │   │   └─ return max(0, 0) = 0
        │   │
        │   ├─ left_length = 0, right_length = 0
        │   ├─ left_extend = 0 (node.left.val=1 ≠ node.val=4)
        │   ├─ right_extend = 0 (node.right.val=1 ≠ node.val=4)
        │   ├─ current_max = 0 + 0 = 0
        │   ├─ max_length = max(0, 0) = 0 📝
        │   └─ return max(0, 0) = 0
        │
        ├─ 🔍 RIGHT: dfs(5)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(5)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_length = 0, right_length = 0
        │   │   ├─ left_extend = 0 (no left child)
        │   │   ├─ right_extend = 0 (no right child)
        │   │   ├─ current_max = 0 + 0 = 0
        │   │   ├─ max_length = max(0, 0) = 0 📝
        │   │   └─ return max(0, 0) = 0
        │   │
        │   ├─ left_length = 0, right_length = 0
        │   ├─ left_extend = 0 (no left child)
        │   ├─ right_extend = 0 + 1 = 1 ✅ (node.right.val=5 = node.val=5)
        │   ├─ current_max = 0 + 1 = 1
        │   ├─ max_length = max(0, 1) = 1 📝
        │   └─ return max(0, 1) = 1
        │
        ├─ left_length = 0, right_length = 1
        ├─ left_extend = 0 (node.left.val=4 ≠ node.val=5)
        ├─ right_extend = 1 + 1 = 2 ✅ (node.right.val=5 = node.val=5)
        ├─ current_max = 0 + 2 = 2 🎯 PATH [5→5→5]
        ├─ max_length = max(1, 2) = 2 📝
        └─ return max(0, 2) = 2

🎯 FINAL RESULT: 2 edges
```

---

## Example 2: [1,4,5,4,4,null,5] → Expected: 2 edges (path 4→4→4)

```
       1
      / \
     4   5
    / \   \
   4   4   5
```

## Nested Execution Trace - Example 2:

```
🌟 longestUnivaluePath([1,4,5,4,4,null,5])
    └─ max_length = 0
    └─ dfs(1) [root]
        ├─ 🔍 LEFT: dfs(4)
        │   ├─ 🔍 LEFT: dfs(4)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_length = 0, right_length = 0
        │   │   ├─ left_extend = 0 (no left child)
        │   │   ├─ right_extend = 0 (no right child)
        │   │   ├─ current_max = 0 + 0 = 0
        │   │   ├─ max_length = max(0, 0) = 0 📝
        │   │   └─ return max(0, 0) = 0
        │   │
        │   ├─ 🔍 RIGHT: dfs(4)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_length = 0, right_length = 0
        │   │   ├─ left_extend = 0 (no left child)
        │   │   ├─ right_extend = 0 (no right child)
        │   │   ├─ current_max = 0 + 0 = 0
        │   │   ├─ max_length = max(0, 0) = 0 📝
        │   │   └─ return max(0, 0) = 0
        │   │
        │   ├─ left_length = 0, right_length = 0
        │   ├─ left_extend = 0 + 1 = 1 ✅ (node.left.val=4 = node.val=4)
        │   ├─ right_extend = 0 + 1 = 1 ✅ (node.right.val=4 = node.val=4)
        │   ├─ current_max = 1 + 1 = 2 🎯 PATH [4→4→4]
        │   ├─ max_length = max(0, 2) = 2 📝
        │   └─ return max(1, 1) = 1
        │
        ├─ 🔍 RIGHT: dfs(5)
        │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   ├─ 🔍 RIGHT: dfs(5)
        │   │   ├─ 🔍 LEFT: dfs(null) → return 0
        │   │   ├─ 🔍 RIGHT: dfs(null) → return 0
        │   │   ├─ left_length = 0, right_length = 0
        │   │   ├─ left_extend = 0 (no left child)
        │   │   ├─ right_extend = 0 (no right child)
        │   │   ├─ current_max = 0 + 0 = 0
        │   │   ├─ max_length = max(2, 0) = 2 📝
        │   │   └─ return max(0, 0) = 0
        │   │
        │   ├─ left_length = 0, right_length = 0
        │   ├─ left_extend = 0 (no left child)
        │   ├─ right_extend = 0 + 1 = 1 ✅ (node.right.val=5 = node.val=5)
        │   ├─ current_max = 0 + 1 = 1
        │   ├─ max_length = max(2, 1) = 2 📝
        │   └─ return max(0, 1) = 1
        │
        ├─ left_length = 1, right_length = 1
        ├─ left_extend = 0 (node.left.val=4 ≠ node.val=1)
        ├─ right_extend = 0 (node.right.val=5 ≠ node.val=1)
        ├─ current_max = 0 + 0 = 0
        ├─ max_length = max(2, 0) = 2 📝
        └─ return max(0, 0) = 0

🎯 FINAL RESULT: 2 edges
```

## Key Insights from Nested Execution:

### **Path Extension Logic:**
- **Extension Check**: `node.left.val == node.val` or `node.right.val == node.val`
- **Path Building**: `left_extend + right_extend` creates path through current node
- **Upward Return**: `max(left_extend, right_extend)` for single-direction extension

### **Critical Moments:**

**Example 1 - Node 5 (right child of root):**
- Can extend right to its child 5: `right_extend = 1`
- Path through this node: 1 edge
- When root processes: extends this to create 5→5→5 path

**Example 2 - Node 4 (left child of root):**
- Can extend both left and right to children 4: `left_extend = right_extend = 1`
- `current_max = 1 + 1 = 2` 🎯 **Complete path [4→4→4]**
- Returns only `max(1,1) = 1` for potential upward extension

### **Algorithm Magic:**
1. **Two-Phase Processing**: 
   - Compute path **through** current node (both directions)
   - Return path **from** current node (single direction)

2. **Value Matching**: Only extends when `child.val == parent.val`

3. **Global Tracking**: `max_length` captures best path found anywhere in tree

Both examples find optimal paths of **2 edges** but at different locations in their respective trees!
---

## 6. Sum Root to Leaf Numbers (129)

### **U**nderstand
- **Problem**: Sum all numbers formed by root-to-leaf paths
- **Input**: TreeNode root (digits 0-9)
- **Output**: int (sum of all root-to-leaf numbers)
- **Constraints**: Each path forms a number (e.g., 1→2→3 = 123)

### **C**larify
```python
# Example: [1,2,3] → Paths: 1→2 (12), 1→3 (13) → Sum = 25
# Example: [4,9,0,5,1] → Paths: 4→9→5 (495), 4→9→1 (491), 4→0 (40) → Sum = 1026
```

### **A**nalyze Pattern
- **Pattern**: Tree DFS with number building
- **Key Insight**: Build number incrementally as we traverse path
- **Approach**: DFS with current number parameter

### **P**lan & Implementation
```python
def sumNumbers(self, root: Optional[TreeNode]) -> int:
    def dfs(node, current_num):
        if not node:
            return 0
        
        # Build current number
        current_num = current_num * 10 + node.val
        
        # If leaf node, return the number
        if not node.left and not node.right:
            return current_num
        
        # Sum results from both subtrees
        return dfs(node.left, current_num) + dfs(node.right, current_num)
    
    return dfs(root, 0)

# Time: O(n), Space: O(h)
```
I'll trace through the Sum Root to Leaf Numbers algorithm using your example in nested format.

## Tree: [4,9,0,5,1] → Expected paths: 495 + 491 + 40 = 1026

```
       4
      / \
     9   0
    / \
   5   1
```

## Nested Execution Trace:

```
🌟 sumNumbers([4,9,0,5,1])
    └─ dfs(4, current_num=0)
        ├─ current_num = 0 * 10 + 4 = 4
        ├─ not leaf (has children), so continue DFS
        │
        ├─ 🔍 LEFT: dfs(9, current_num=4)
        │   ├─ current_num = 4 * 10 + 9 = 49
        │   ├─ not leaf (has children), so continue DFS
        │   │
        │   ├─ 🔍 LEFT: dfs(5, current_num=49)
        │   │   ├─ current_num = 49 * 10 + 5 = 495
        │   │   ├─ 🍃 LEAF NODE! → return 495
        │   │   └─ ✅ PATH [4→9→5] = 495
        │   │
        │   ├─ 🔍 RIGHT: dfs(1, current_num=49)
        │   │   ├─ current_num = 49 * 10 + 1 = 491
        │   │   ├─ 🍃 LEAF NODE! → return 491
        │   │   └─ ✅ PATH [4→9→1] = 491
        │   │
        │   ├─ return 495 + 491 = 986
        │   └─ ✅ SUBTREE SUM: 986
        │
        ├─ 🔍 RIGHT: dfs(0, current_num=4)
        │   ├─ current_num = 4 * 10 + 0 = 40
        │   ├─ 🍃 LEAF NODE! → return 40
        │   └─ ✅ PATH [4→0] = 40
        │
        ├─ return 986 + 40 = 1026
        └─ ✅ TOTAL SUM: 1026

🎯 FINAL RESULT: 1026
```

## Detailed Number Building Process:

### **Path 1: [4→9→5] = 495**
```
dfs(4, 0) → current_num = 0*10 + 4 = 4
  └─ dfs(9, 4) → current_num = 4*10 + 9 = 49
      └─ dfs(5, 49) → current_num = 49*10 + 5 = 495 🍃 LEAF!
```

### **Path 2: [4→9→1] = 491**
```
dfs(4, 0) → current_num = 0*10 + 4 = 4
  └─ dfs(9, 4) → current_num = 4*10 + 9 = 49
      └─ dfs(1, 49) → current_num = 49*10 + 1 = 491 🍃 LEAF!
```

### **Path 3: [4→0] = 40**
```
dfs(4, 0) → current_num = 0*10 + 4 = 4
  └─ dfs(0, 4) → current_num = 4*10 + 0 = 40 🍃 LEAF!
```

## Key Insights from Nested Execution:

### **Number Building Formula:**
- **At each node**: `current_num = parent_num * 10 + node.val`
- **Progressive construction**: 4 → 49 → 495/491

### **Base Cases:**
- **Null node**: Return 0 (contributes nothing)
- **Leaf node**: Return the complete number formed along path

### **Recursive Aggregation:**
- **Internal nodes**: Sum results from all child subtrees
- **Root returns**: Total sum of all root-to-leaf numbers

### **Path Discovery:**
```
Node 4 (root):  current_num = 4
├─ Node 9:      current_num = 49
│  ├─ Node 5:   current_num = 495 ✅ (leaf)
│  └─ Node 1:   current_num = 491 ✅ (leaf)
└─ Node 0:      current_num = 40  ✅ (leaf)
```

### **Return Value Propagation:**
```
dfs(5, 49) returns 495
dfs(1, 49) returns 491
dfs(9, 4)  returns 495 + 491 = 986

dfs(0, 4)  returns 40

dfs(4, 0)  returns 986 + 40 = 1026
```

### **Algorithm Magic:**
1. **Incremental Building**: Numbers constructed digit-by-digit during traversal
2. **Path Context**: Each recursive call carries the accumulated number
3. **Leaf Detection**: Only complete paths (to leaves) contribute to final sum
4. **Natural Backtracking**: Return from recursion automatically handles path exploration

The algorithm elegantly builds all root-to-leaf numbers simultaneously through DFS traversal, summing them as it discovers complete paths!
---

## **Pattern Summary & Key Insights**

### **Common Patterns**
1. **Path Tracking**: Use DFS with path building and backtracking
2. **Prefix Sum**: Optimize path sum counting with HashMap
3. **Tree DP**: Return values for subtree processing
4. **Global Maximum**: Track global optimum during traversal

### **Implementation Strategies**
```python
# Pattern 1: Path Existence/Collection
def pathExists(node, target, path=[]):
    if not node: return False
    path.append(node.val)
    # Process leaf logic
    # Recursive calls
    path.pop()  # Backtrack

# Pattern 2: Prefix Sum Optimization
def pathCount(node, target, prefix_sums):
    current_sum += node.val
    count = prefix_sums.get(current_sum - target, 0)
    prefix_sums[current_sum] += 1
    # Recursive calls
    prefix_sums[current_sum] -= 1  # Backtrack

# Pattern 3: Tree DP with Global Tracking
def maxPath(node):
    if not node: return 0
    left_max = max(0, maxPath(node.left))
    right_max = max(0, maxPath(node.right))
    global_max = max(global_max, node.val + left_max + right_max)
    return node.val + max(left_max, right_max)
```

### **Complexity Analysis**
- **Time**: Generally O(n) for single pass, O(n²) when copying paths
- **Space**: O(h) for recursion stack, O(n) for path storage/prefix sums

### **Edge Cases**
- Empty tree
- Single node tree
- Negative values (especially in maximum path sum)
- All same values (univalue path)
- Linear tree vs balanced tree

### **Real-World Applications**
- **Financial**: Portfolio optimization paths
- **Gaming**: Optimal move sequences
- **Networking**: Route optimization with constraints
- **Data Analysis**: Feature path analysis in decision trees

These path sum problems demonstrate the power of tree traversal combined with various optimization techniques, from simple DFS to advanced prefix sum optimizations.

# UCARPT - LCA
#interview/DSA/Tree
Excellent! Let me demonstrate **UCAPRT framework** on **Tree Relationship and Distance** problems. These focus on node relationships, paths, and distance calculations in tree structures.

# **Lowest Common Ancestor (236) - Basic LCA** 🌳

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find the lowest common ancestor of two given nodes in binary tree
  
- What are inputs/outputs?
  → Input: Binary tree root, two nodes p and q
  → Output: TreeNode (the LCA of p and q)
  
- What are constraints?
  → Both p and q exist in the tree
  → LCA is the deepest node that has both p and q as descendants
  → A node can be a descendant of itself
  → All node values are unique
```

## **C - CLARIFY**
```python
# Example 1: Tree structure
#       3
#      / \
#     5   1
#    / \ / \
#   6  2 0  8
#     / \
#    7   4
#
# LCA(5, 1) = 3 (root is common ancestor)
# LCA(5, 4) = 5 (5 is ancestor of 4, and itself)
# LCA(6, 4) = 5 (5 is lowest node containing both 6 and 4)

# Key insight: LCA is the split point where p and q are in different subtrees
# OR one of p/q is the LCA itself

# Edge cases:
# - One node is ancestor of other: ancestor is LCA
# - Nodes in same subtree: find split point
# - Root is one of the nodes: root is LCA
```

## **A - ANALYZE PATTERN**
```
- Pattern: RECURSIVE TREE SEARCH with backtracking
- Key insight: LCA is where paths to p and q diverge (or converge)
- State: Current node and whether subtrees contain p or q
- Transitions: Check if current node is p/q, search children
- Goal: Find deepest node that has both p and q in its subtree
```

## **P - PLAN**
```python
# Approach: Post-order traversal with boolean returns
# For each node, check:
# 1. Is current node p or q?
# 2. Does left subtree contain p or q?
# 3. Does right subtree contain p or q?
# 
# LCA conditions:
# - Current node is p/q AND one subtree contains the other
# - Both left and right subtrees contain one of p/q each
#
# Return node if it's LCA, otherwise return what children return

# Time: O(n), Space: O(h)
```

## **R - REFACTOR**
```python
# Approach 1: Recursive with node return
def lowestCommonAncestor(root, p, q):
    if not root:
        return None
    
    # If current node is one of the targets
    if root == p or root == q:
        return root
    
    # Search in left and right subtrees
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    # If both subtrees return a node, current is LCA
    if left and right:
        return root
    
    # Return whichever subtree found a target
    return left if left else right

# Approach 2: Explicit boolean tracking
def lowestCommonAncestorExplicit(root, p, q):
    result = None
    
    def dfs(node):
        nonlocal result
        
        if not node:
            return False
        
        # Check if current node is p or q
        current = (node == p or node == q)
        
        # Check left and right subtrees
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If current is LCA (two of three conditions are true)
        if current + left + right >= 2:
            result = node
        
        # Return true if current subtree contains p or q
        return current or left or right
    
    dfs(root)
    return result

# Approach 3: Path-based solution
def lowestCommonAncestorPath(root, p, q):
    def find_path(node, target, path):
        if not node:
            return False
        
        path.append(node)
        
        if node == target:
            return True
        
        if (find_path(node.left, target, path) or 
            find_path(node.right, target, path)):
            return True
        
        path.pop()  # Backtrack
        return False
    
    # Find paths to both nodes
    path_p, path_q = [], []
    find_path(root, p, path_p)
    find_path(root, q, path_q)
    
    # Find last common node in paths
    i = 0
    while (i < len(path_p) and i < len(path_q) and 
           path_p[i] == path_q[i]):
        i += 1
    
    return path_p[i - 1]
```
## Complexity Analysis Summary
| **Approach** | **Time Complexity** | **Space Complexity** | **Traversals** | **Early Exit?** | **Best Use Case** |
|---|---|---|---|---|---|
| **Approach 1: Recursive Node Return** | O(n) | O(h) | 1 pass | ✅ Yes | **Best overall** |
| **Approach 2: Boolean Tracking** | O(n) | O(h) | 1 pass | ❌ No | Educational |
| **Approach 3: Path-based** | O(n) | O(h) | 2 passes | ❌ No | When paths needed |

## **T - TEST**
```python
# Test tree:
#       3
#      / \
#     5   1
#    / \
#   6   2
#      / \
#     7   4
# Find LCA(6, 4):

# dfs(3): current=False
#   dfs(5): current=False  
#     dfs(6): current=True, returns 6
#     dfs(2): current=False
#       dfs(7): current=False, returns None
#       dfs(4): current=True, returns 4
#     left=6, right=4, both non-null → LCA found = 5
#   dfs(1): current=False, returns None
# left=5, right=None → return 5 ✓
```
I'll walk you through the nested recursive steps for finding LCA(6, 4) in your tree. This is a great example to understand how the recursive algorithm works!

Let me trace through each recursive call:

## Initial Call: `lowestCommonAncestor(3, 6, 4)`

**Root = 3**
- 3 ≠ 6 and 3 ≠ 4, so continue searching
- Make recursive calls to left and right subtrees

---

## Left Subtree: `lowestCommonAncestor(5, 6, 4)`

**Root = 5**
- 5 ≠ 6 and 5 ≠ 4, so continue searching
- Make recursive calls to left and right subtrees

### Left child of 5: `lowestCommonAncestor(6, 6, 4)`
**Root = 6**
- 6 = 6 ✓ (found one of our targets!)
- **Returns 6** immediately

### Right child of 5: `lowestCommonAncestor(2, 6, 4)`
**Root = 2**
- 2 ≠ 6 and 2 ≠ 4, so continue searching

#### Left child of 2: `lowestCommonAncestor(7, 6, 4)`
**Root = 7**
- 7 ≠ 6 and 7 ≠ 4, so continue searching
- 7 has no children, so both recursive calls return `None`
- **Returns None**

#### Right child of 2: `lowestCommonAncestor(4, 6, 4)`
**Root = 4**
- 4 = 4 ✓ (found our other target!)
- **Returns 4** immediately

#### Back to node 2:
- left = None, right = 4
- **Returns 4** (the non-None result)

### Back to node 5:
- left = 6, right = 4
- **Both are non-None!** This means 5 is the LCA
- **Returns 5**

---

## Right Subtree: `lowestCommonAncestor(1, 6, 4)`

**Root = 1**
- 1 ≠ 6 and 1 ≠ 4, so continue searching
- Searches through nodes 0 and 8, but neither contains 6 or 4
- **Returns None**

---

## Back to root node 3:
- left = 5, right = None
- **Returns 5** (the non-None result)

## Key Insights:

1. **Node 6 returns itself** when found
2. **Node 4 returns itself** when found  
3. **Node 5 receives both 6 and 4** from its subtrees, making it the LCA
4. **Node 3 only receives 5** from its left subtree, so it passes 5 upward
5. **The algorithm terminates early** when it finds target nodes, making it efficient

The beauty of this algorithm is that it uses the recursive structure to "bubble up" information about found nodes, and the first node that receives both targets from different subtrees is automatically the LCA!
I'll walk you through both approaches for finding LCA(6, 4) in the same tree. Let me trace through each one step by step!

## Approach 2: Explicit DFS with nonlocal result

This approach uses a helper function that returns `True/False` to indicate if a subtree contains either target node, while storing the LCA in a `result` variable.

### Initial Call: `lowestCommonAncestorExplicit(3, 6, 4)`
- `result = None`
- Call `dfs(3)`

---

### `dfs(3)` - Root node
- `current = False` (3 ≠ 6 and 3 ≠ 4)
- `left = dfs(5)` (call left subtree)
- `right = dfs(1)` (call right subtree)

#### `dfs(5)` - Left subtree of 3
- `current = False` (5 ≠ 6 and 5 ≠ 4)
- `left = dfs(6)` 
- `right = dfs(2)`

##### `dfs(6)` - Left child of 5
- `current = True` (6 = 6 ✓)
- `left = dfs(None) = False`
- `right = dfs(None) = False`
- `current + left + right = 1 + 0 + 0 = 1 < 2` (not LCA)
- **Returns True**

##### `dfs(2)` - Right child of 5
- `current = False` (2 ≠ 6 and 2 ≠ 4)
- `left = dfs(7)`
- `right = dfs(4)`

###### `dfs(7)` - Left child of 2
- `current = False` (7 ≠ 6 and 7 ≠ 4)
- `left = dfs(None) = False`
- `right = dfs(None) = False`
- **Returns False**

###### `dfs(4)` - Right child of 2
- `current = True` (4 = 4 ✓)
- `left = dfs(None) = False`
- `right = dfs(None) = False`
- `current + left + right = 1 + 0 + 0 = 1 < 2` (not LCA)
- **Returns True**

##### Back to `dfs(2)`:
- `current = False`, `left = False`, `right = True`
- `current + left + right = 0 + 0 + 1 = 1 < 2` (not LCA)
- **Returns True**

#### Back to `dfs(5)`:
- `current = False`, `left = True`, `right = True`
- `current + left + right = 0 + 1 + 1 = 2 ≥ 2` ✓
- **`result = 5`** (LCA found!)
- **Returns True**

#### `dfs(1)` - Right subtree of 3
- Searches through nodes 0 and 8, finds neither 6 nor 4
- **Returns False**

### Back to `dfs(3)`:
- `current = False`, `left = True`, `right = False`
- `current + left + right = 0 + 1 + 0 = 1 < 2` (not LCA)
- **Returns True**

**Final result: 5**

---

## Approach 3: Path-based Solution

This approach finds the path from root to each target node, then compares paths to find the last common node.

### Step 1: Find path to node 6
`find_path(3, 6, [])`:

1. **At node 3**: `path = [3]`
   - 3 ≠ 6, so continue searching
   - Try left subtree: `find_path(5, 6, [3])`

2. **At node 5**: `path = [3, 5]`
   - 5 ≠ 6, so continue searching
   - Try left subtree: `find_path(6, 6, [3, 5])`

3. **At node 6**: `path = [3, 5, 6]`
   - 6 = 6 ✓ Found target!
   - **Returns True**

4. **Back to node 5**: Left subtree returned True
   - **Returns True**

5. **Back to node 3**: Left subtree returned True
   - **Returns True**

**Final path_p = [3, 5, 6]**

### Step 2: Find path to node 4
`find_path(3, 4, [])`:

1. **At node 3**: `path = [3]`
   - 3 ≠ 4, so continue searching
   - Try left subtree: `find_path(5, 4, [3])`

2. **At node 5**: `path = [3, 5]`
   - 5 ≠ 4, so continue searching
   - Try left subtree: `find_path(6, 4, [3, 5])` → Returns False
   - Try right subtree: `find_path(2, 4, [3, 5])`

3. **At node 2**: `path = [3, 5, 2]`
   - 2 ≠ 4, so continue searching
   - Try left subtree: `find_path(7, 4, [3, 5, 2])` → Returns False
   - Try right subtree: `find_path(4, 4, [3, 5, 2])`

4. **At node 4**: `path = [3, 5, 2, 4]`
   - 4 = 4 ✓ Found target!
   - **Returns True**

5. **Backtrack**: 2 → 5 → 3 all return True

**Final path_q = [3, 5, 2, 4]**

### Step 3: Find last common node
- `path_p = [3, 5, 6]`
- `path_q = [3, 5, 2, 4]`

Compare indices:
- `i = 0`: path_p[0] = 3, path_q[0] = 3 ✓ (same)
- `i = 1`: path_p[1] = 5, path_q[1] = 5 ✓ (same)
- `i = 2`: path_p[2] = 6, path_q[2] = 2 ✗ (different)

Last common index = 1, so **LCA = path_p[1] = 5**

## Key Differences:

1. **Approach 2 (Explicit DFS)**: Uses boolean returns to track if subtrees contain targets, stores LCA in external variable
2. **Approach 3 (Path-based)**: Explicitly builds paths from root to each target, then compares paths

All three approaches correctly identify **node 5** as the LCA, but with different computational strategies!
---

# **Distance Between Nodes - Path Calculations** 📏

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find shortest distance (number of edges) between two nodes in tree
  
- What are inputs/outputs?
  → Input: Binary tree root, two target nodes p and q
  → Output: Integer (distance between p and q)
  
- What are constraints?
  → Both nodes exist in the tree
  → Distance = number of edges in path between nodes
  → Use tree structure (no cycles, unique path exists)
  → Handle case where one node is ancestor of other
```

## **C - CLARIFY**
```python
# Example: Tree structure
#       1
#      / \
#     2   3
#    / \   \
#   4   5   6
#
# Distance(4, 5) = 2 (4→2→5)
# Distance(4, 6) = 4 (4→2→1→3→6)  
# Distance(2, 5) = 1 (2→5)
# Distance(1, 4) = 2 (1→2→4)

# Key insight: Distance = depth(p) + depth(q) - 2*depth(LCA)
# Where depth is distance from root

# Edge cases:
# - Same node: distance = 0
# - Direct parent-child: distance = 1
# - Root involved: one depth calculation simplified
```

## **A - ANALYZE PATTERN**
```
- Pattern: LCA + DEPTH CALCULATION
- Key insight: Shortest path goes through LCA of the two nodes
- State: Node depths and LCA identification
- Transitions: Find LCA, calculate depths from LCA to each node
- Goal: Compute total path length via lowest common ancestor
```

## **P - PLAN**
```python
# Approach 1: LCA + depth calculation
# 1. Find LCA of p and q
# 2. Calculate distance from LCA to p
# 3. Calculate distance from LCA to q  
# 4. Total distance = dist(LCA,p) + dist(LCA,q)

# Approach 2: Root depth method
# 1. Find depth of p and q from root
# 2. Find depth of LCA from root
# 3. Distance = depth(p) + depth(q) - 2*depth(LCA)

# Time: O(n), Space: O(h)
```

## **R - REFACTOR**
```python
# Approach 1: LCA + distance to LCA
def findDistance(root, p, q):
    # Find LCA first
    def find_lca(node):
        if not node or node == p or node == q:
            return node
        
        left = find_lca(node.left)
        right = find_lca(node.right)
        
        if left and right:
            return node
        return left if left else right
    
    # Find distance from node to target
    def distance_to_target(node, target):
        if not node:
            return -1
        if node == target:
            return 0
        
        left_dist = distance_to_target(node.left, target)
        if left_dist >= 0:
            return left_dist + 1
        
        right_dist = distance_to_target(node.right, target)
        if right_dist >= 0:
            return right_dist + 1
        
        return -1
    
    lca = find_lca(root)
    dist_p = distance_to_target(lca, p)
    dist_q = distance_to_target(lca, q)
    
    return dist_p + dist_q

# Approach 2: One-pass solution
def findDistanceOnePass(root, p, q):
    result = 0
    
    def dfs(node):
        nonlocal result
        
        if not node:
            return -1
        
        # If current node is one of targets
        if node == p or node == q:
            return 0
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If both subtrees contain targets
        if left >= 0 and right >= 0:
            result = left + right + 2
            return -1  # LCA found, stop propagating
        
        # If one subtree contains a target
        if left >= 0:
            return left + 1
        if right >= 0:
            return right + 1
        
        return -1
    
    dfs(root)
    return result

# Approach 3: Depth-based calculation
def findDistanceDepth(root, p, q):
    # Find depth of node from root
    def find_depth(node, target, depth=0):
        if not node:
            return -1
        if node == target:
            return depth
        
        left_depth = find_depth(node.left, target, depth + 1)
        if left_depth >= 0:
            return left_depth
        
        return find_depth(node.right, target, depth + 1)
    
    # Find LCA and its depth
    def find_lca_depth(node, depth=0):
        if not node or node == p or node == q:
            return node, depth
        
        left_lca, left_depth = find_lca_depth(node.left, depth + 1)
        right_lca, right_depth = find_lca_depth(node.right, depth + 1)
        
        if left_lca and right_lca:
            return node, depth
        
        if left_lca:
            return left_lca, left_depth
        return right_lca, right_depth
    
    lca, lca_depth = find_lca_depth(root)
    depth_p = find_depth(root, p)
    depth_q = find_depth(root, q)
    
    return depth_p + depth_q - 2 * lca_depth
```
## Complexity Analysis Summary
| **Approach** | **Time Complexity** | **Space Complexity** | **Tree Traversals** | **Early Exit?** | **Code Complexity** |
|---|---|---|---|---|---|
| **Approach 1: LCA + Distance** | O(n) | O(h) | 3 separate | ✅ Partial | Simple |
| **Approach 2: One-pass** | O(n) | O(h) | 1 pass | ✅ Yes | **Best** |
| **Approach 3: Depth-based** | O(n) | O(h) | 3 separate | ❌ No | Complex |

## **T - TEST**
```python
# Test tree:
#       1
#      / \
#     2   3
#    / \
#   4   5
# Find distance(4, 5):

# find_lca(1):
#   left = find_lca(2):
#     left = find_lca(4): returns 4
#     right = find_lca(5): returns 5  
#     both non-null → returns 2
#   right = find_lca(3): returns None
#   left=2, right=None → returns 2

# distance_to_target(2, 4): 
#   left_dist = distance_to_target(4, 4) = 0
#   returns 0 + 1 = 1
# distance_to_target(2, 5):
#   right_dist = distance_to_target(5, 5) = 0  
#   returns 0 + 1 = 1

# Total distance = 1 + 1 = 2 ✓
```

---

# **All Nodes Distance K (863) - Distance-based Queries** 🎯

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find all nodes that are exactly distance K from target node
  
- What are inputs/outputs?
  → Input: Binary tree root, target node, integer K
  → Output: List of node values at distance K from target
  
- What are constraints?
  → Target node exists in tree
  → K ≥ 0
  → Distance measured in number of edges
  → Need to search in all directions (up to parent, down to children)
  → Tree has no parent pointers initially
```

## **C - CLARIFY**
```python
# Example: Tree structure
#       3
#      / \
#     5   1
#    / \ / \
#   6  2 0  8
#     / \
#    7   4
#
# Target = 5, K = 2
# Nodes at distance 2 from 5:
# - Down: 7, 4 (5→2→7, 5→2→4)
# - Up: 1 (5→3→1)
# Result: [7, 4, 1]

# Key challenge: Tree doesn't have parent pointers
# Need to search both downward (children) and upward (through parent)

# Edge cases:
# - K = 0: return [target.val]
# - K > tree height: return []
# - Target is root: only search downward
# - Target is leaf: only search upward
```

## **A - ANALYZE PATTERN**
```
- Pattern: BFS/DFS with bidirectional search from target
- Key insight: Convert tree to graph or track parent relationships
- State: Current node and remaining distance to travel
- Transitions: Move to children, parent, or siblings via parent
- Goal: Find all nodes exactly K steps away in any direction
```

## **P - PLAN**
```python
# Approach 1: Add parent pointers + BFS
# 1. First pass: add parent pointers to all nodes
# 2. BFS from target node, treating tree as undirected graph
# 3. Track visited nodes to avoid cycles
# 4. Collect nodes at distance exactly K

# Approach 2: DFS with distance tracking
# 1. Find path from root to target
# 2. For each node in path, search subtrees at appropriate distances
# 3. Handle both downward and upward searches

# Time: O(n), Space: O(n)
```

## **R - REFACTOR**
```python
# Approach 1: Parent pointers + BFS
def distanceK(root, target, K):
    if K == 0:
        return [target.val]
    
    # Add parent pointers
    parent = {}
    
    def add_parents(node, par=None):
        if not node:
            return
        parent[node] = par
        add_parents(node.left, node)
        add_parents(node.right, node)
    
    add_parents(root)
    
    # BFS from target
    from collections import deque
    queue = deque([(target, 0)])
    visited = {target}
    result = []
    
    while queue:
        node, dist = queue.popleft()
        
        if dist == K:
            result.append(node.val)
            continue
        
        # Explore all neighbors (children + parent) parent for moving up
        for neighbor in [node.left, node.right, parent[node]]:
            if neighbor and neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return result

# Approach 2: DFS with distance propagation
def distanceKDFS(root, target, K):
    result = []
    
    def find_nodes_at_distance(node, distance):
        """Find all nodes at given distance from current node (downward only)"""
        if not node:
            return
        
        if distance == 0:
            result.append(node.val)
            return
        
        find_nodes_at_distance(node.left, distance - 1)
        find_nodes_at_distance(node.right, distance - 1)
    
    def dfs(node):
        """Returns distance from current node to target, or -1 if not found"""
        if not node:
            return -1
        
        if node == target:
            # Found target, search downward for nodes at distance K
            find_nodes_at_distance(node, K)
            return 0
        
        # Search in left subtree
        left_dist = dfs(node.left)
        if left_dist >= 0:
            # Target found in left subtree
            if left_dist + 1 == K:
                result.append(node.val)
            else:
                # Search right subtree for remaining distance
                find_nodes_at_distance(node.right, K - left_dist - 2)
            return left_dist + 1
        
        # Search in right subtree
        right_dist = dfs(node.right)
        if right_dist >= 0:
            # Target found in right subtree
            if right_dist + 1 == K:
                result.append(node.val)
            else:
                # Search left subtree for remaining distance
                find_nodes_at_distance(node.left, K - right_dist - 2)
            return right_dist + 1
        
        return -1
    
    dfs(root)
    return result

# Approach 3: Convert to graph representation
def distanceKGraph(root, target, K):
    from collections import defaultdict, deque
    
    # Build adjacency list representation
    graph = defaultdict(list)
    
    def build_graph(node):
        if not node:
            return
        
        if node.left:
            graph[node.val].append(node.left.val)
            graph[node.left.val].append(node.val)
            build_graph(node.left)
        
        if node.right:
            graph[node.val].append(node.right.val)
            graph[node.right.val].append(node.val)
            build_graph(node.right)
    
    build_graph(root)
    
    # BFS from target
    queue = deque([(target.val, 0)])
    visited = {target.val}
    result = []
    
    while queue:
        node_val, dist = queue.popleft()
        
        if dist == K:
            result.append(node_val)
            continue
        
        for neighbor in graph[node_val]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return result
```
## Complexity Analysis Summary
| **Approach** | **Time Complexity** | **Space Complexity** | **Traversals** | **Implementation** | **Best Use Case** |
|---|---|---|---|---|---|
| **Approach 1: Parent Pointers + BFS** | O(n) | O(n) | 2 passes | Simple | **General purpose** |
| **Approach 2: DFS Propagation** | O(n) | O(h) | 1 pass | Complex | **Memory constrained** |
| **Approach 3: Graph Conversion** | O(n) | O(n) | 2 passes | Simple | **Multiple queries** |

## **T - TEST**
```python
# Test tree:
#       3
#      / \
#     5   1
#    / \ / \
#   6  2 0  8
#     / \
#    7   4
# Target = 5, K = 2

# After adding parent pointers:
# parent[5] = 3, parent[6] = 5, parent[2] = 5, etc.

# BFS from target=5:
# queue = [(5, 0)]
# dist=0: explore neighbors of 5: [6, 2, 3]
# queue = [(6, 1), (2, 1), (3, 1)]
# dist=1: 
#   - from 6: no unvisited neighbors
#   - from 2: neighbors [7, 4] 
#   - from 3: neighbor [1]
# queue = [(7, 2), (4, 2), (1, 2)]
# dist=2: collect [7, 4, 1] ✓
```
I'll walk you through both approaches for finding all nodes at distance K from a target node. Let me use a concrete example with the same tree and find all nodes at distance K=2 from target node 5.

```
       3
      / \
     5   1
    / \ / \
   6  2 0  8
     / \
    7   4
```

**Expected result: [7, 4, 1]** (nodes 7, 4, and 1 are all distance 2 from node 5)

## Approach 1: Parent Pointers + BFS

This approach treats the tree as an undirected graph by adding parent pointers, then performs BFS from the target.

### Step 1: Add Parent Pointers
`add_parents(3, None)`:

```
parent = {
    3: None,
    5: 3,
    1: 3,
    6: 5,
    2: 5,
    0: 1,
    8: 1,
    7: 2,
    4: 2
}
```

### Step 2: BFS from Target (node 5)
`queue = [(5, 0)]`, `visited = {5}`, `result = []`

#### Distance 0:
- **Process (5, 0)**: distance ≠ 2, so explore neighbors
- Neighbors: `[6, 2, 3]` (left child, right child, parent)
- Add to queue: `[(6, 1), (2, 1), (3, 1)]`
- `visited = {5, 6, 2, 3}`

#### Distance 1:
- **Process (6, 1)**: distance ≠ 2, explore neighbors
  - Neighbors: `[None, None, 5]` → only valid neighbor is 5, but already visited
  
- **Process (2, 1)**: distance ≠ 2, explore neighbors
  - Neighbors: `[7, 4, 5]` → 5 already visited
  - Add to queue: `[(7, 2), (4, 2)]`
  - `visited = {5, 6, 2, 3, 7, 4}`

- **Process (3, 1)**: distance ≠ 2, explore neighbors
  - Neighbors: `[5, 1, None]` → 5 already visited
  - Add to queue: `[(1, 2)]`
  - `visited = {5, 6, 2, 3, 7, 4, 1}`

#### Distance 2:
- **Process (7, 2)**: distance = 2 ✓
  - `result.append(7.val)` → `result = [7]`
  
- **Process (4, 2)**: distance = 2 ✓
  - `result.append(4.val)` → `result = [7, 4]`
  
- **Process (1, 2)**: distance = 2 ✓
  - `result.append(1.val)` → `result = [7, 4, 1]`

**Final result: [7, 4, 1]**

---

## Approach 2: DFS with Distance Propagation

This approach uses DFS to find the target, then propagates distance information upward while searching for nodes at the target distance.

### Initial Call: `dfs(3)`

#### `dfs(3)` - Root node
- 3 ≠ 5 (target), so search subtrees
- `left_dist = dfs(5)` (search left subtree)

##### `dfs(5)` - Found target!
- 5 = 5 ✓ (target found!)
- Call `find_nodes_at_distance(5, 2)` to search downward

###### `find_nodes_at_distance(5, 2)`:
- `distance = 2 ≠ 0`, so continue recursively
- `find_nodes_at_distance(6, 1)`: distance = 1 ≠ 0, continue to children (None) → no results
- `find_nodes_at_distance(2, 1)`: distance = 1 ≠ 0, continue to children

####### `find_nodes_at_distance(2, 1)`:
- `find_nodes_at_distance(7, 0)`: distance = 0 ✓ → `result.append(7)` → `result = [7]`
- `find_nodes_at_distance(4, 0)`: distance = 0 ✓ → `result.append(4)` → `result = [7, 4]`

##### Back to `dfs(5)`:
- **Returns 0** (distance from target to itself)

#### Back to `dfs(3)`:
- `left_dist = 0` (target found in left subtree)
- `left_dist + 1 = 1 ≠ 2` (current node 3 is not at distance 2)
- Need to search right subtree for remaining distance: `K - left_dist - 2 = 2 - 0 - 2 = 0`
- Call `find_nodes_at_distance(1, 0)`

##### `find_nodes_at_distance(1, 0)`:
- `distance = 0` ✓ → `result.append(1)` → `result = [7, 4, 1]`

#### Back to `dfs(3)`:
- **Returns 1** (distance from node 3 to target 5)

**Final result: [7, 4, 1]**

Excellent question! The `return left_dist + 1` is crucial for **propagating distance information up the tree**. Let me explain why.

## What `left_dist + 1` Represents

When we `return left_dist + 1`, we're telling the **parent node**: 
> "The target is `left_dist + 1` steps away from you through this child"

## Step-by-Step Example

Let's trace through this tree with **target=7, K=2**:

```
        3
       / \
      5   1
     / \   
    6   2   
       / \
      7   4
```

### **DFS Traversal Path:**

**1. dfs(3) calls dfs(5)**
**2. dfs(5) calls dfs(6)**  
**3. dfs(6) returns -1** (target not found)
**4. dfs(5) calls dfs(2)**
**5. dfs(2) calls dfs(7)**
**6. dfs(7) finds target!**
- Calls `find_nodes_at_distance(7, 2)` (searches downward)
- **Returns 0** (distance from target to itself)

### **Now the Key Part - Unwinding the Stack:**

**7. Back in dfs(2):**
```python
left_dist = dfs(7)  # left_dist = 0 (target found!)
if left_dist >= 0:  # True
    if left_dist + 1 == K:  # 0 + 1 == 2? False
        result.append(node.val)
    else:
        # Search right subtree: K - left_dist - 2 = 2 - 0 - 2 = 0
        find_nodes_at_distance(node.right, 0)  # Finds node 4
    return left_dist + 1  # Returns 0 + 1 = 1
```

**8. Back in dfs(5):**
```python
left_dist = dfs(2)  # left_dist = 1 (distance from 5 to target via 2)
if left_dist >= 0:  # True
    if left_dist + 1 == K:  # 1 + 1 == 2? True!
        result.append(node.val)  # Add node 5 to result!
    else:
        # Would search right subtree if condition was false
    return left_dist + 1  # Returns 1 + 1 = 2
```

**9. Back in dfs(3):**
```python
left_dist = dfs(5)  # left_dist = 2 (distance from 3 to target via 5)
if left_dist >= 0:  # True
    if left_dist + 1 == K:  # 2 + 1 == 2? False
        result.append(node.val)
    else:
        # Search right subtree: K - left_dist - 2 = 2 - 2 - 2 = -2 (invalid)
        # No search needed
    return left_dist + 1  # Returns 2 + 1 = 3
```


**Final result**: [4, 5] (nodes at distance 2 from target 7)

## The Bottom Line

`return left_dist + 1` is essential because:

1. **Propagates accurate distance** up the recursion tree
2. **Enables correct calculation** of which nodes are at distance K
3. **Allows proper searching** in opposite subtrees
4. **Without it, all ancestors would report wrong distances**

The `+ 1` represents the **edge cost** between parent and child in the tree!

---

## Key Differences:

### Approach 1 (Parent Pointers + BFS):
- **Pros**: Simple and intuitive - treats tree as undirected graph
- **Cons**: Requires extra space for parent pointers and BFS queue
- **Time**: O(N) for parent mapping + O(N) for BFS
- **Space**: O(N) for parent map + O(N) for BFS structures

### Approach 2 (DFS with Distance Propagation):
- **Pros**: More space-efficient, single DFS traversal
- **Cons**: More complex logic with distance calculations
- **Time**: O(N) single DFS traversal
- **Space**: O(H) recursion stack only

Both approaches correctly find all nodes at distance K=2 from target node 5:
- **Node 7**: path 5 → 2 → 7 (2 steps)
- **Node 4**: path 5 → 2 → 4 (2 steps)  
- **Node 1**: path 5 → 3 → 1 (2 steps)

The second approach is more elegant as it leverages the tree structure without converting it to an undirected graph!
---

# **Tree Relationship Pattern Recognition** 🌲

## **Common Characteristics:**
1. **Relationship Queries**: Finding ancestors, distances, paths between nodes
2. **Bidirectional Search**: Often need to search both up and down the tree
3. **Path Reconstruction**: May need to track or reconstruct paths
4. **Parent Access**: Sometimes need parent pointers or parent tracking

## **Template Recognition:**
```python
# Universal Tree Relationship Template
def tree_relationship_query(root, node1, node2=None):
    # Step 1: Add parent information if needed
    parent = {}
    def add_parents(node, par=None):
        if node:
            parent[node] = par
            add_parents(node.left, node)
            add_parents(node.right, node)
    
    # Step 2: Find LCA if comparing two nodes
    def find_lca(node):
        if not node or node == node1 or node == node2:
            return node
        left = find_lca(node.left)
        right = find_lca(node.right)
        return node if left and right else (left or right)
    
    # Step 3: Calculate distances or perform queries
    def distance_from(start, target):
        # BFS or DFS to find distance
        pass
    
    # Apply specific logic for the relationship query
    return query_result
```

## **When to Use Each Pattern:** 🎯
- **LCA**: Common ancestor queries, distance calculations
- **Distance**: Path length calculations, optimization problems
- **K-distance**: Range queries, neighborhood searches
- **Parent tracking**: When need to traverse upward in tree

**Tree relationship problems require understanding both tree structure and graph traversal techniques to handle bidirectional searches efficiently!** 🚀

# UCARPT - BST
#interview/DSA/Tree
Excellent! Let me demonstrate **UCAPRT framework** on **Binary Search Tree (BST)** problems. These focus on BST properties, operations, and transformations.

# **Validate Binary Search Tree (98) - BST Property Checking** ✅

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Determine if binary tree satisfies BST property
  
- What are inputs/outputs?
  → Input: Binary tree root
  → Output: Boolean (true if valid BST, false otherwise)
  
- What are constraints?
  → BST property: for every node, left subtree < node < right subtree
  → Must check entire tree, not just immediate children
  → Handle duplicate values (typically not allowed in BST)
  → Consider integer overflow cases
```

## **C - CLARIFY**
```python
# Example 1: Valid BST
#       5
#      / \
#     3   8
#    / \ / \
#   2 4 7  9
# All nodes satisfy: left < current < right ✓

# Example 2: Invalid BST  
#       5
#      / \
#     3   8
#    / \ / \
#   2 6 7  9
# Node 6 violates BST property (6 > 5 but in left subtree) ❌

# Key insight: Local checks insufficient!
# Wrong approach: only check node.left < node < node.right
# Correct: check entire range constraints

# Edge cases:
# - Single node: always valid BST
# - Empty tree: valid BST  
# - Integer limits: [Integer.MIN_VALUE, Integer.MAX_VALUE]
# - Duplicate values: typically invalid
```

## **A - ANALYZE PATTERN**
```
- Pattern: TREE TRAVERSAL with range validation
- Key insight: Each node must satisfy range constraints from ancestors
- State: Current node and valid value range [min, max]
- Transitions: Narrow range for children based on current node
- Goal: Verify all nodes respect BST property globally
```

## **P - PLAN**
```python
# Approach 1: Range validation (most efficient)
# Pass valid range [min_val, max_val] down the tree
# Each node must be within range, update range for children

# Approach 2: Inorder traversal
# BST inorder gives sorted sequence
# Check if inorder is strictly increasing

# Approach 3: Recursive with return values
# Each subtree returns (is_valid, min_val, max_val)

# Time: O(n), Space: O(h)
```

## **R - REFACTOR**
```python
# Approach 1: Range Validation (Best)
def isValidBST(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        # Check if current node violates BST property
        if node.val <= min_val or node.val >= max_val:
            return False
        
        # Recursively validate children with updated ranges
        return (validate(node.left, min_val, node.val) and 
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))

# Approach 2: Inorder Traversal
def isValidBSTInorder(root):
    def inorder(node):
        if not node:
            return []
        return inorder(node.left) + [node.val] + inorder(node.right)
    
    values = inorder(root)
    
    # Check if strictly increasing
    for i in range(1, len(values)):
        if values[i] <= values[i-1]:
            return False
    return True

# Approach 3: Optimized Inorder (Generator for memory efficent)
def isValidBSTInorderOpt(root):
    def inorder(node):
        if not node:
            return
        yield from inorder(node.left)   # Yield all values from left subtree
        yield node.val                  # Yield current node's value
        yield from inorder(node.right)  # Yield all values from right subtree

    
    prev = float('-inf')
    for val in inorder(root):
        if val <= prev:
            return False
        prev = val
    return True
```

## **T - TEST**
```python
# Test invalid BST:
#       5
#      / \
#     3   8
#    / \
#   2   6  ← This 6 violates BST property

# validate(5, -∞, ∞):
#   5 is in range ✓
#   left = validate(3, -∞, 5):
#     3 is in range ✓  
#     left = validate(2, -∞, 3): 2 in range ✓, returns True
#     right = validate(6, 3, 5): 6 > 5 ❌, returns False
#     returns False
#   Returns False ✓

# The range validation correctly catches the violation!
```
I'll walk you through this **optimized inorder BST validation** algorithm step-by-step using concrete examples.

## Example 1: Valid BST
```
    5
   / \
  3   8
 / \ / \
1  4 7  9
```

## Example 2: Invalid BST  
```
    5
   / \
  3   8
 / \ / \
1  6 7  9
```
*(Node 6 violates BST property - it's in left subtree of 5 but 6 > 5)*

---

## **Algorithm Breakdown:**

### **The Generator Function:**
```python
def inorder(node):
    if not node:
        return
    yield from inorder(node.left)   # Yield all left subtree values
    yield node.val                  # Yield current node value
    yield from inorder(node.right)  # Yield all right subtree values
```

**Key:** `yield from` delegates to sub-generators, creating a lazy inorder traversal.

---

## **Example 1: Valid BST - Step-by-Step**

### **Initial Setup:**
```python
prev = float('-inf')  # prev = -∞
# Create generator: inorder(root=5)
```

### **Generator Execution Flow:**

#### **inorder(5) - Root**
1. `yield from inorder(3)` ← Process left subtree first

#### **inorder(3) - Left subtree of 5**
1. `yield from inorder(1)` ← Process left subtree first

#### **inorder(1) - Left subtree of 3**
1. `yield from inorder(None)` → returns (empty)
2. `yield 1` ✅ **First value yielded**
3. `yield from inorder(None)` → returns (empty)

**Back to main loop:**
```python
val = 1
# 1 > -∞ ✓ (valid)
prev = 1
```

#### **Back to inorder(3):**
2. `yield 3` ✅ **Second value yielded**

**Back to main loop:**
```python
val = 3  
# 3 > 1 ✓ (valid)
prev = 3
```

#### **Back to inorder(3):**
3. `yield from inorder(4)` ← Process right subtree

#### **inorder(4) - Right subtree of 3**
1. `yield from inorder(None)` → returns (empty)
2. `yield 4` ✅ **Third value yielded**
3. `yield from inorder(None)` → returns (empty)

**Back to main loop:**
```python
val = 4
# 4 > 3 ✓ (valid)  
prev = 4
```

#### **Back to inorder(5):**
2. `yield 5` ✅ **Fourth value yielded**

**Back to main loop:**
```python
val = 5
# 5 > 4 ✓ (valid)
prev = 5
```

#### **Back to inorder(5):**
3. `yield from inorder(8)` ← Process right subtree

#### **inorder(8) - Right subtree of 5**
1. `yield from inorder(7)` ← Process left subtree first

#### **inorder(7) - Left subtree of 8**
1. `yield from inorder(None)` → returns (empty)
2. `yield 7` ✅ **Fifth value yielded**
3. `yield from inorder(None)` → returns (empty)

**Back to main loop:**
```python
val = 7
# 7 > 5 ✓ (valid)
prev = 7
```

#### **Back to inorder(8):**
2. `yield 7` ✅ **Sixth value yielded**

**Back to main loop:**
```python
val = 8
# 8 > 7 ✓ (valid)
prev = 8
```

#### **Back to inorder(8):**
3. `yield from inorder(9)` ← Process right subtree

#### **inorder(9) - Right subtree of 8**
1. `yield from inorder(None)` → returns (empty)
2. `yield 9` ✅ **Seventh value yielded**
3. `yield from inorder(None)` → returns (empty)

**Back to main loop:**
```python
val = 9
# 9 > 8 ✓ (valid)
prev = 9
```

### **Final Result:**
**Inorder sequence:** `1, 3, 4, 5, 7, 8, 9` (strictly increasing)  
**Return:** `True` ✅

---

## **Example 2: Invalid BST - Step-by-Step**

Using the invalid BST where node 6 is in the wrong position:

```
    5
   / \
  3   8
 / \ / \
1  6 7  9
```

### **Generator Execution (abbreviated):**

The generator will produce the inorder sequence:

#### **Execution Flow:**
1. **inorder(1):** `yield 1`
   ```python
   val = 1, prev = -∞
   # 1 > -∞ ✓, prev = 1
   ```

2. **inorder(3):** `yield 3`
   ```python  
   val = 3, prev = 1
   # 3 > 1 ✓, prev = 3
   ```

3. **inorder(6):** `yield 6` ❌ **Problem detected!**
   ```python
   val = 6, prev = 3
   # 6 > 3 ✓, prev = 6
   ```

4. **inorder(5):** `yield 5` ❌ **Violation!**
   ```python
   val = 5, prev = 6
   # 5 <= 6 ❌ INVALID!
   return False
   ```

### **Final Result:**
**Inorder sequence:** `1, 3, 6, 5, ...` (not strictly increasing)  
**Return:** `False` ❌

---

## **Key Algorithm Insights:**

### **1. Generator Benefits:**
```python
yield from inorder(node.left)   # Lazy evaluation
yield node.val                  # Process current
yield from inorder(node.right)  # Continue lazily
```

- **Memory efficient:** Only one value in memory at a time
- **Early termination:** Stops immediately when violation found
- **Clean separation:** Generator handles traversal, main loop handles validation

### **2. Validation Logic:**
```python
for val in inorder(root):
    if val <= prev:  # BST requires strict ordering
        return False
    prev = val
```

- **Strict inequality:** `val <= prev` catches duplicates and decreasing sequences
- **Single pass:** O(n) time, but can terminate early
- **O(1) extra space:** Only stores `prev`

### **3. Performance Analysis:**

| Aspect | Complexity | Notes |
|--------|------------|-------|
| **Time** | O(n) worst, O(k) average | k = position of first violation |
| **Space** | O(h) | Recursion stack for generator |
| **Memory** | O(1) extra | Only stores previous value |

### **4. Comparison with Other Approaches:**

| Method | Space | Early Exit | Simplicity |
|--------|-------|------------|------------|
| **Generator** | O(h) | ✅ Yes | ✅ High |
| **Range-based** | O(h) | ✅ Yes | ⚠️ Medium |
| **Full inorder** | O(n) | ❌ No | ✅ High |

### **5. Why `yield from`?**
```python
# Instead of:
def inorder_manual(node):
    if not node:
        return []
    return inorder_manual(node.left) + [node.val] + inorder_manual(node.right)

# We use yield from for:
# - Lazy evaluation (memory efficient)
# - Early termination capability
# - Cleaner code structure
```

This generator-based approach elegantly combines the simplicity of inorder traversal with the efficiency of range-based validation, providing an optimal solution for BST validation!
---

# **Kth Smallest Element in BST (230) - Order Statistics** 🔢

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find the kth smallest value in BST (1-indexed)
  
- What are inputs/outputs?
  → Input: BST root, integer k
  → Output: Integer (kth smallest value)
  
- What are constraints?
  → BST contains unique values
  → 1 ≤ k ≤ number of nodes
  → k is guaranteed to be valid
  → Optimize for frequent queries (follow-up)
```

## **C - CLARIFY**
```python
# Example: BST
#       5
#      / \
#     3   7
#    / \ / \
#   2 4 6  8

# Inorder: [2, 3, 4, 5, 6, 7, 8]
# k=1 → 2 (1st smallest)
# k=3 → 4 (3rd smallest)  
# k=5 → 6 (5th smallest)

# Key insight: Inorder traversal of BST gives sorted order
# So kth smallest = kth element in inorder traversal

# Edge cases:
# - k=1: leftmost node
# - k=n: rightmost node
# - Single node: return that node's value
# - Follow-up: optimize for multiple queries
```

## **A - ANALYZE PATTERN**
```
- Pattern: INORDER TRAVERSAL with early termination
- Key insight: BST inorder gives sorted sequence, stop at kth element
- State: Current position in inorder traversal
- Transitions: Track count, stop when reaching kth element
- Goal: Find kth element efficiently without full traversal
```

## **P - PLAN**
```python
# Approach 1: Inorder with counter
# Perform inorder traversal, increment counter, stop at k

# Approach 2: Recursive with global counter
# Use global counter, return result when counter reaches k

# Approach 3: Iterative with stack
# Manual stack implementation for inorder

# Follow-up: Augmented BST with subtree sizes
# Store size info in each node for O(log n) queries

# Time: O(h + k), Space: O(h)
```

## **R - REFACTOR**
```python
# Approach 1: Recursive with Global Counter
def kthSmallest(root, k):
    def inorder(node):
        nonlocal count, result
        if not node or count >= k:
            return
        
        # Traverse left subtree
        inorder(node.left)
        
        # Process current node
        count += 1
        if count == k:
            result = node.val
            return
        
        # Traverse right subtree
        inorder(node.right)
    
    count = 0
    result = 0
    inorder(root)
    return result

# Approach 2: Iterative with Stack
def kthSmallestIterative(root, k):
    stack = []
    current = root
    count = 0
    
    while stack or current:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process current node
        current = stack.pop()
        count += 1
        
        if count == k:
            return current.val
        
        # Move to right subtree
        current = current.right
    
    return -1  # Should not reach here if k is valid

# Approach 3: Clean Recursive
def kthSmallestClean(root, k):
    def inorder():
        if not root:
            return []
        
        result = []
        stack = []
        current = root
        
        while stack or current:
            while current:
                stack.append(current)
                current = current.left
            
            current = stack.pop()
            result.append(current.val)
            
            if len(result) == k:
                return result
            
            current = current.right
        
        return result
    
    return inorder()[k-1]

# Follow-up: Augmented BST for O(log n) queries
class TreeNodeAugmented:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
        self.size = 1  # Size of subtree rooted at this node

def kthSmallestOptimized(root, k):
    def get_size(node):
        return node.size if node else 0
    
    current = root
    while current:
        left_size = get_size(current.left)
        
        if k == left_size + 1:
            return current.val
        elif k <= left_size:
            current = current.left
        else:
            k -= left_size + 1
            current = current.right
    
    return -1
```
## Complexity Analysis Summary
| **Approach** | **Time Complexity** | **Space Complexity** | **Early Exit?** | **Best Use Case** |
|---|---|---|---|---|
| **Approach 1: Recursive Global** | O(k) average, O(n) worst | O(h) | ✅ Yes | Clean, readable code |
| **Approach 2: Iterative Stack** | O(k) average, O(n) worst | O(h) | ✅ Yes | **Best general solution** |
| **Approach 3: Clean Recursive** | O(k) | O(k + h) | ❌ No* | Simple but inefficient |
| **Follow-up: Augmented BST** | O(log n) | O(1) | ✅ Yes | Multiple queries |


## **T - TEST**
```python
# Test BST:
#       5
#      / \
#     3   7
#    / \ 
#   2   4

# Find k=3 (3rd smallest):
# Inorder traversal: 2, 3, 4, 5, 7
# count=1: visit 2
# count=2: visit 3  
# count=3: visit 4 ← k=3, return 4 ✓

# Iterative trace:
# Stack operations:
# Push path to leftmost: [5,3,2]
# Pop 2: count=1
# Pop 3: count=2  
# Push 4, pop 4: count=3, return 4 ✓
```

---

# **Convert BST to Greater Tree (538) - Cumulative Sum** ➕

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Transform BST so each node contains sum of all greater values + original value
  
- What are inputs/outputs?
  → Input: BST root
  → Output: TreeNode (modified tree, can be same root)
  
- What are constraints?
  → Modify tree in-place (preferred)
  → Each node gets: original_value + sum_of_all_greater_values
  → Maintain tree structure (only values change)
  → All values are unique
```

## **C - CLARIFY**
```python
# Example: Original BST
#       5
#      / \
#     2   7
#    / \ / \
#   1 3 6  8

# Values in order: [1, 2, 3, 5, 6, 7, 8]
# 
# For each node, add sum of all greater values:
# 1: 1 + (2+3+5+6+7+8) = 1 + 31 = 32
# 2: 2 + (3+5+6+7+8) = 2 + 29 = 31  
# 3: 3 + (5+6+7+8) = 3 + 26 = 29
# 5: 5 + (6+7+8) = 5 + 21 = 26
# 6: 6 + (7+8) = 6 + 15 = 21
# 7: 7 + 8 = 15
# 8: 8 + 0 = 8

# Result tree:
#       26
#      /  \
#    31   15
#   / |   | \
#  32 29 21  8

# Key insight: Reverse inorder (right→root→left) gives decreasing order
# Maintain running sum while traversing
```

## **A - ANALYZE PATTERN**
```
- Pattern: REVERSE INORDER TRAVERSAL with accumulation
- Key insight: Traverse right→root→left to process larger values first
- State: Running sum of all processed (greater) values
- Transitions: Add current value to running sum, update node
- Goal: Transform values using cumulative sum from right to left
```

## **P - PLAN**
```python
# Approach: Reverse inorder traversal
# 1. Visit right subtree (larger values)
# 2. Process current node: add running_sum to node.val
# 3. Update running_sum with current node's original value
# 4. Visit left subtree (smaller values)

# Time: O(n), Space: O(h)
```

## **R - REFACTOR**
```python
# Approach 1: Recursive with Global Sum
def convertBST(root):
    def reverse_inorder(node):
        nonlocal running_sum
        if not node:
            return
        
        # Visit right subtree first (greater values)
        reverse_inorder(node.right)
        
        # Process current node
        running_sum += node.val
        node.val = running_sum
        
        # Visit left subtree (smaller values)  
        reverse_inorder(node.left)
    
    running_sum = 0
    reverse_inorder(root)
    return root

# Approach 2: Iterative with Stack
def convertBSTIterative(root):
    if not root:
        return root
    
    stack = []
    current = root
    running_sum = 0
    
    # Reverse inorder: process nodes in decreasing order
    while stack or current:
        # Go to rightmost node
        while current:
            stack.append(current)
            current = current.right
        
        # Process current node
        current = stack.pop()
        running_sum += current.val
        current.val = running_sum
        
        # Move to left subtree
        current = current.left
    
    return root

# Approach 3: Morris Traversal (O(1) space)
def convertBSTMorris(root):
    current = root
    running_sum = 0
    
    while current:
        if not current.right:
            # No right subtree, process current
            running_sum += current.val
            current.val = running_sum
            current = current.left
        else:
            # Find inorder successor (leftmost in right subtree)
            successor = current.right
            while successor.left and successor.left != current:
                successor = successor.left
            
            if not successor.left:
                # Make threaded connection
                successor.left = current
                current = current.right
            else:
                # Remove threaded connection and process
                successor.left = None
                running_sum += current.val
                current.val = running_sum
                current = current.left
    
    return root

# Approach 4: Clean Class-based
class Solution:
    def convertBST(self, root):
        self.sum = 0
        
        def traverse(node):
            if not node:
                return
            
            traverse(node.right)     # Right subtree
            self.sum += node.val     # Process current
            node.val = self.sum      # Update value
            traverse(node.left)      # Left subtree
        
        traverse(root)
        return root
```

## **T - TEST**
```python
# Test BST:
#       5
#      / \
#     3   7
#    /   / \
#   2   6   8

# Reverse inorder traversal: 8, 7, 6, 5, 3, 2
# 
# Process 8: running_sum = 0 + 8 = 8, node.val = 8
# Process 7: running_sum = 8 + 7 = 15, node.val = 15  
# Process 6: running_sum = 15 + 6 = 21, node.val = 21
# Process 5: running_sum = 21 + 5 = 26, node.val = 26
# Process 3: running_sum = 26 + 3 = 29, node.val = 29
# Process 2: running_sum = 29 + 2 = 31, node.val = 31

# Result tree:
#       26
#      /  \
#    29   15
#   /    / \
#  31   21  8 ✓
```
I'll walk you through this **Morris traversal for BST to Greater Sum Tree conversion** step-by-step using a concrete example.

## Example BST:
```
    4
   / \
  2   6
 / \ / \
1  3 5  7
```

**Target Greater Sum Tree:**
```
    22
   /  \
  27   13
 / \  / \
28 25 18 7
```
*(Each node = sum of all nodes ≥ original value)*

---

## **Algorithm Overview:**

This algorithm performs **reverse inorder traversal** (right-root-left) using Morris threading to achieve O(1) space complexity. By visiting nodes in decreasing order, we can maintain a running sum and update each node as we process it.

### **Key Insight:**
- **Normal inorder:** Left → Root → Right (ascending order)
- **Reverse inorder:** Right → Root → Left (descending order)
- **Processing order:** 7, 6, 5, 4, 3, 2, 1

---

## **Step-by-Step Execution:**

### **Initial Setup:**
```python
current = 4 (root)
running_sum = 0
```

---

### **Iteration 1: current = 4**

#### **Branch: `else` (current has right child 6)**
```python
# Find inorder successor (leftmost in right subtree)
successor = current.right  # successor = 6
while successor.left and successor.left != current:
    successor = successor.left
# 6 has left child 5, so successor = 5
# 5 has no left child, so successor = 5
```

**Threading check:** `successor.left` is `None`
```python
# Make threaded connection
successor.left = current  # 5.left = 4
current = current.right   # current = 6
```

**Tree state after threading:**
```
    4
   / \
  2   6
 / \ / \
1  3 5←─4 7
    (thread)
```

---

### **Iteration 2: current = 6**

#### **Branch: `else` (current has right child 7)**
```python
# Find inorder successor
successor = current.right  # successor = 7
while successor.left and successor.left != current:
    successor = successor.left
# 7 has no left child, so successor = 7
```

**Threading check:** `successor.left` is `None`
```python
# Make threaded connection
successor.left = current  # 7.left = 6
current = current.right   # current = 7
```

**Tree state after threading:**
```
    4
   / \
  2   6
 / \ / \
1  3 5←─4 7←─6
    (thread) (thread)
```

---

### **Iteration 3: current = 7**

#### **Branch: `if` (current has no right child)**
```python
# No right subtree, process current
running_sum += current.val  # running_sum = 0 + 7 = 7
current.val = running_sum   # 7.val = 7
current = current.left      # current = 6 (following thread!)
```

**State:** `running_sum = 7`, node 7 updated, `current = 6`

---

### **Iteration 4: current = 6** (via thread)

#### **Branch: `else` (current has right child 7)**
```python
# Find inorder successor
successor = current.right  # successor = 7
while successor.left and successor.left != current:
    successor = successor.left
# 7.left = 6 (equals current), so loop exits immediately
```

**Threading check:** `successor.left == current` (thread exists!)
```python
# Remove threaded connection and process
successor.left = None      # 7.left = None (thread removed)
running_sum += current.val # running_sum = 7 + 6 = 13
current.val = running_sum  # 6.val = 13
current = current.left     # current = 5
```

**Tree state after thread removal:**
```
    4
   / \
  2   6(13)
 / \ / \
1  3 5←─4 7(7)
    (thread)
```

**State:** `running_sum = 13`, node 6 = 13, `current = 5`

---

### **Iteration 5: current = 5**

#### **Branch: `else` (current has threaded left pointer)**
```python
# Find inorder successor
successor = current.right  # successor = None (5 has no right child)
# Wait, this is wrong. Let me reconsider...

# Actually, current.right is None, so we go to the if branch
```

#### **Branch: `if` (current has no right child)**
```python
# No right subtree, process current
running_sum += current.val  # running_sum = 13 + 5 = 18
current.val = running_sum   # 5.val = 18
current = current.left      # current = 4 (following thread!)
```

**State:** `running_sum = 18`, node 5 = 18, `current = 4`

---

### **Iteration 6: current = 4** (via thread)

#### **Branch: `else` (current has right child 6)**
```python
# Find inorder successor
successor = current.right  # successor = 6
while successor.left and successor.left != current:
    successor = successor.left
# 6 → 5, 5.left = 4 (equals current), so loop exits
# Final: successor = 5
```

**Threading check:** `successor.left == current` (thread exists!)
```python
# Remove threaded connection and process
successor.left = None      # 5.left = None (thread removed)
running_sum += current.val # running_sum = 18 + 4 = 22
current.val = running_sum  # 4.val = 22
current = current.left     # current = 2
```

**Tree state after thread removal:**
```
    4(22)
   /  \
  2    6(13)
 / \  / \
1  3 5(18) 7(7)
```

**State:** `running_sum = 22`, node 4 = 22, `current = 2`

---

### **Iteration 7: current = 2**

#### **Branch: `else` (current has right child 3)**
```python
# Find inorder successor
successor = current.right  # successor = 3
while successor.left and successor.left != current:
    successor = successor.left
# 3 has no left child, so successor = 3
```

**Threading check:** `successor.left` is `None`
```python
# Make threaded connection
successor.left = current  # 3.left = 2
current = current.right   # current = 3
```

---

### **Iteration 8: current = 3**

#### **Branch: `if` (current has no right child)**
```python
# No right subtree, process current
running_sum += current.val  # running_sum = 22 + 3 = 25
current.val = running_sum   # 3.val = 25
current = current.left      # current = 2 (following thread!)
```

**State:** `running_sum = 25`, node 3 = 25, `current = 2`

---

### **Iteration 9: current = 2** (via thread)

#### **Branch: `else` (current has right child 3)**
```python
# Find inorder successor
successor = current.right  # successor = 3
# 3.left = 2 (equals current), thread exists
```

**Threading check:** Thread exists!
```python
# Remove threaded connection and process
successor.left = None      # 3.left = None
running_sum += current.val # running_sum = 25 + 2 = 27
current.val = running_sum  # 2.val = 27
current = current.left     # current = 1
```

**State:** `running_sum = 27`, node 2 = 27, `current = 1`

---

### **Iteration 10: current = 1**

#### **Branch: `if` (current has no right child)**
```python
# No right subtree, process current
running_sum += current.val  # running_sum = 27 + 1 = 28
current.val = running_sum   # 1.val = 28
current = current.left      # current = None
```

**State:** `running_sum = 28`, node 1 = 28, `current = None`

---

## **Final Result:**
```
    22
   /  \
  27   13
 / \  / \
28 25 18  7
```

**Processing order:** 7 → 6 → 5 → 4 → 3 → 2 → 1 (reverse inorder)

---

## **Key Insights:**

### **1. Reverse Inorder Pattern:**
```python
if not current.right:
    # Process current (no right subtree)
    current = current.left
else:
    # Thread to enable reverse inorder
    current = current.right
```

### **2. Threading Mechanism:**
- **Create thread:** `successor.left = current` (temporary link back)
- **Follow thread:** When revisiting via thread, process node then remove thread
- **Navigate:** Use threads to avoid recursion stack

### **3. Running Sum Logic:**
```python
running_sum += current.val  # Add original value
current.val = running_sum   # Update to cumulative sum
```

### **4. Space Complexity Achievement:**
- **O(1) extra space:** No recursion stack or auxiliary data structures
- **In-place modification:** Uses tree's own structure for navigation
- **Temporary threads:** Created and removed during traversal

### **5. Comparison with Other Approaches:**

| Method | Space | Time | Complexity |
|--------|-------|------|------------|
| **Recursive** | O(h) | O(n) | Simple |
| **Stack-based** | O(h) | O(n) | Iterative |
| **Morris** | O(1) | O(n) | Most space-efficient |

The Morris traversal successfully converts the BST to a Greater Sum Tree using constant extra space while maintaining linear time complexity!
---

# **Unique Binary Search Trees II (95) - Generating All BSTs** 🌳

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Generate all structurally unique BSTs with values 1 to n
  
- What are inputs/outputs?
  → Input: Integer n  
  → Output: List of TreeNode (roots of all possible BSTs)
  
- What are constraints?
  → Values are 1, 2, 3, ..., n
  → Return all structurally different BSTs
  → BST property must be maintained
  → Order of returned trees doesn't matter
```

## **C - CLARIFY**
```python
# Example: n = 3
# Values: [1, 2, 3]
# 
# All possible BSTs:
#   1     1       2      3    3
#    \     \     / \    /    /
#     3     2   1   3  2    1
#    /       \        /      \
#   2         3      1        2
# 
# Total: 5 structurally unique BSTs

# Key insight: For each value as root, recursively generate
# all possible left and right subtrees

# Example n = 2:
# 1. Root = 1, left = [], right = [2] → Tree: 1→2
# 2. Root = 2, left = [1], right = [] → Tree: 2←1
# Total: 2 trees

# Edge cases:
# - n = 0: return [None] or []
# - n = 1: return [TreeNode(1)]
```

## **A - ANALYZE PATTERN**
```
- Pattern: RECURSIVE GENERATION with memoization
- Key insight: For range [start, end], try each value as root
- State: Current range [start, end] to build BST from
- Transitions: Split range by root, combine left/right subtrees
- Goal: Generate all combinations of left and right subtrees
```

## **P - PLAN**
```python
# Algorithm:
# 1. For range [start, end], try each i as root
# 2. Generate all left subtrees from [start, i-1]  
# 3. Generate all right subtrees from [i+1, end]
# 4. Combine each left with each right subtree
# 5. Memoize results for efficiency

# Time: O(4^n / n^1.5) - Catalan number related
# Space: O(4^n / n^1.5)
```

## **R - REFACTOR**
```python
# Approach 1: Most efficient
class Solution:
    def allPossibleBST(self, start, end, memo):
        res = []
        if start > end:
            res.append(None)
            return res
        if (start, end) in memo:
            return memo[(start, end)]

        # Iterate through all values from start to end to construct left and right subtree recursively.
        for i in range(start, end + 1):
            leftSubTrees = self.allPossibleBST(start, i - 1, memo)
            rightSubTrees = self.allPossibleBST(i + 1, end, memo)

            # Loop through all left and right subtrees and connect them to ith root.
            for left in leftSubTrees:
                for right in rightSubTrees:
                    root = TreeNode(i, left, right)
                    res.append(root)

        memo[(start, end)] = res
        return res

    def generateTrees(self, n: int) -> List[Optional[TreeNode]]:
        memo = {}
        return self.allPossibleBST(1, n, memo)

# Approach 2: With Memoization
def generateTreesMemo(n):
    if n == 0:
        return []
    
    memo = {}
    
    def generate(start, end):
        if start > end:
            return [None]
        
        if (start, end) in memo:
            return memo[(start, end)]
        
        result = []
        
        for root_val in range(start, end + 1):
            left_trees = generate(start, root_val - 1)
            right_trees = generate(root_val + 1, end)
            
            for left in left_trees:
                for right in right_trees:
                    root = TreeNode(root_val)
                    root.left = left
                    root.right = right
                    result.append(root)
        
        memo[(start, end)] = result
        return result
    
    return generate(1, n)

# Approach 3: Dynamic Programming
def generateTreesDP(n):
    if n == 0:
        return []
    
    # dp[i] = all BSTs that can be formed with i nodes
    dp = [[] for _ in range(n + 1)]
    dp[0] = [None]
    
    for nodes in range(1, n + 1):
        for root in range(1, nodes + 1):
            left_nodes = root - 1
            right_nodes = nodes - root
            
            for left in dp[left_nodes]:
                for right in dp[right_nodes]:
                    # Clone and adjust values
                    root_node = TreeNode(root)
                    root_node.left = clone_tree(left, 0)
                    root_node.right = clone_tree(right, root)
                    dp[nodes].append(root_node)
    
    return dp[n]

def clone_tree(root, offset):
    if not root:
        return None
    
    new_root = TreeNode(root.val + offset)
    new_root.left = clone_tree(root.left, offset)
    new_root.right = clone_tree(root.right, offset)
    return new_root
```
## Complexity Analysis Summary
| **Approach** | **Time Complexity** | **Space Complexity** | **Memoization** | **Efficiency** |
|---|---|---|---|---|
| **Approach 1: Memoized Recursion** | O(4^n / n^1.5) | O(4^n / n^1.5) | ✅ Yes | **Best** |
| **Approach 2: Same as Approach 1** | O(4^n / n^1.5) | O(4^n / n^1.5) | ✅ Yes | **Best** |
| **Approach 3: Dynamic Programming** | O(n × 4^n / n^1.5) | O(4^n / n^1.5) | ❌ No | **Worst** |


## **T - TEST**
I'll show the detailed nested execution steps for all three approaches generating BSTs with n=3.

## **Approach 1: Range-Based with Memoization**

### **Complete Nested Execution Tree:**

```
allPossibleBST(1, 3, memo)
├── i = 1 (root = 1)
│   ├── leftSubTrees = allPossibleBST(1, 0, memo)
│   │   └── start > end → return [None]
│   ├── rightSubTrees = allPossibleBST(2, 3, memo)
│   │   ├── i = 2 (root = 2)
│   │   │   ├── leftSubTrees = allPossibleBST(2, 1, memo)
│   │   │   │   └── start > end → return [None]
│   │   │   ├── rightSubTrees = allPossibleBST(3, 3, memo)
│   │   │   │   ├── i = 3 (root = 3)
│   │   │   │   │   ├── leftSubTrees = allPossibleBST(3, 2, memo)
│   │   │   │   │   │   └── start > end → return [None]
│   │   │   │   │   ├── rightSubTrees = allPossibleBST(4, 3, memo)
│   │   │   │   │   │   └── start > end → return [None]
│   │   │   │   │   └── Combine: [None] × [None] → [TreeNode(3)]
│   │   │   │   └── memo[(3,3)] = [TreeNode(3)]
│   │   │   └── Combine: [None] × [TreeNode(3)] → [TreeNode(2, None, TreeNode(3))]
│   │   ├── i = 3 (root = 3)
│   │   │   ├── leftSubTrees = allPossibleBST(2, 2, memo)
│   │   │   │   ├── i = 2 (root = 2)
│   │   │   │   │   ├── leftSubTrees = allPossibleBST(2, 1, memo)
│   │   │   │   │   │   └── start > end → return [None]
│   │   │   │   │   ├── rightSubTrees = allPossibleBST(3, 2, memo)
│   │   │   │   │   │   └── start > end → return [None]
│   │   │   │   │   └── Combine: [None] × [None] → [TreeNode(2)]
│   │   │   │   └── memo[(2,2)] = [TreeNode(2)]
│   │   │   ├── rightSubTrees = allPossibleBST(4, 3, memo)
│   │   │   │   └── start > end → return [None]
│   │   │   └── Combine: [TreeNode(2)] × [None] → [TreeNode(3, TreeNode(2), None)]
│   │   └── memo[(2,3)] = [TreeNode(2, None, TreeNode(3)), TreeNode(3, TreeNode(2), None)]
│   └── Combine: [None] × [TreeNode(2,None,TreeNode(3)), TreeNode(3,TreeNode(2),None)]
│       └── Results:
│           ├── TreeNode(1, None, TreeNode(2, None, TreeNode(3)))     ←── Tree 1
│           └── TreeNode(1, None, TreeNode(3, TreeNode(2), None))     ←── Tree 2
├── i = 2 (root = 2)
│   ├── leftSubTrees = allPossibleBST(1, 1, memo)
│   │   ├── i = 1 (root = 1)
│   │   │   ├── leftSubTrees = allPossibleBST(1, 0, memo)
│   │   │   │   └── start > end → return [None]
│   │   │   ├── rightSubTrees = allPossibleBST(2, 1, memo)
│   │   │   │   └── start > end → return [None]
│   │   │   └── Combine: [None] × [None] → [TreeNode(1)]
│   │   └── memo[(1,1)] = [TreeNode(1)]
│   ├── rightSubTrees = allPossibleBST(3, 3, memo)
│   │   └── CACHE HIT → return [TreeNode(3)]
│   └── Combine: [TreeNode(1)] × [TreeNode(3)]
│       └── Result: TreeNode(2, TreeNode(1), TreeNode(3))             ←── Tree 3
└── i = 3 (root = 3)
    ├── leftSubTrees = allPossibleBST(1, 2, memo)
    │   ├── i = 1 (root = 1)
    │   │   ├── leftSubTrees = allPossibleBST(1, 0, memo)
    │   │   │   └── start > end → return [None]
    │   │   ├── rightSubTrees = allPossibleBST(2, 2, memo)
    │   │   │   └── CACHE HIT → return [TreeNode(2)]
    │   │   └── Combine: [None] × [TreeNode(2)] → [TreeNode(1, None, TreeNode(2))]
    │   ├── i = 2 (root = 2)
    │   │   ├── leftSubTrees = allPossibleBST(1, 1, memo)
    │   │   │   └── CACHE HIT → return [TreeNode(1)]
    │   │   ├── rightSubTrees = allPossibleBST(3, 2, memo)
    │   │   │   └── start > end → return [None]
    │   │   └── Combine: [TreeNode(1)] × [None] → [TreeNode(2, TreeNode(1), None)]
    │   └── memo[(1,2)] = [TreeNode(1, None, TreeNode(2)), TreeNode(2, TreeNode(1), None)]
    ├── rightSubTrees = allPossibleBST(4, 3, memo)
    │   └── start > end → return [None]
    └── Combine: [TreeNode(1,None,TreeNode(2)), TreeNode(2,TreeNode(1),None)] × [None]
        └── Results:
            ├── TreeNode(3, TreeNode(1, None, TreeNode(2)), None)     ←── Tree 4
            └── TreeNode(3, TreeNode(2, TreeNode(1), None), None)     ←── Tree 5
```

### **Final Result Assembly:**
```
Final Trees = [Tree 1, Tree 2, Tree 3, Tree 4, Tree 5]

Tree 1:  1        Tree 2:  1        Tree 3:    2       Tree 4:    3       Tree 5:    3
          \                 \                 /   \             /                  /
           2                 3               1     3           1                  2
            \               /                                   \                /
             3             2                                     2              1
```

---

## **Approach 2: Cleaner Memoization**

### **Complete Nested Execution Tree:**

```
generate(1, 3)
├── root_val = 1
│   ├── left_trees = generate(1, 0)
│   │   └── start > end → return [None]
│   ├── right_trees = generate(2, 3)
│   │   ├── root_val = 2
│   │   │   ├── left_trees = generate(2, 1)
│   │   │   │   └── start > end → return [None]
│   │   │   ├── right_trees = generate(3, 3)
│   │   │   │   ├── root_val = 3
│   │   │   │   │   ├── left_trees = generate(3, 2)
│   │   │   │   │   │   └── start > end → return [None]
│   │   │   │   │   ├── right_trees = generate(4, 3)
│   │   │   │   │   │   └── start > end → return [None]
│   │   │   │   │   └── Build: TreeNode(3, None, None)
│   │   │   │   └── memo[(3,3)] = [TreeNode(3)]
│   │   │   └── Build: TreeNode(2, None, TreeNode(3))
│   │   ├── root_val = 3
│   │   │   ├── left_trees = generate(2, 2)
│   │   │   │   ├── root_val = 2
│   │   │   │   │   ├── left_trees = generate(2, 1) → [None]
│   │   │   │   │   ├── right_trees = generate(3, 2) → [None]
│   │   │   │   │   └── Build: TreeNode(2, None, None)
│   │   │   │   └── memo[(2,2)] = [TreeNode(2)]
│   │   │   ├── right_trees = generate(4, 3) → [None]
│   │   │   └── Build: TreeNode(3, TreeNode(2), None)
│   │   └── memo[(2,3)] = [TreeNode(2,None,TreeNode(3)), TreeNode(3,TreeNode(2),None)]
│   └── Nested Loop Combinations:
│       ├── left=None, right=TreeNode(2,None,TreeNode(3))
│       │   └── Build: TreeNode(1, None, TreeNode(2,None,TreeNode(3)))
│       └── left=None, right=TreeNode(3,TreeNode(2),None)
│           └── Build: TreeNode(1, None, TreeNode(3,TreeNode(2),None))
├── root_val = 2
│   ├── left_trees = generate(1, 1)
│   │   ├── root_val = 1
│   │   │   ├── left_trees = generate(1, 0) → [None]
│   │   │   ├── right_trees = generate(2, 1) → [None]
│   │   │   └── Build: TreeNode(1, None, None)
│   │   └── memo[(1,1)] = [TreeNode(1)]
│   ├── right_trees = generate(3, 3)
│   │   └── CACHE HIT → [TreeNode(3)]
│   └── Nested Loop:
│       └── left=TreeNode(1), right=TreeNode(3)
│           └── Build: TreeNode(2, TreeNode(1), TreeNode(3))
└── root_val = 3
    ├── left_trees = generate(1, 2)
    │   ├── root_val = 1
    │   │   ├── left_trees = generate(1, 0) → [None]
    │   │   ├── right_trees = generate(2, 2)
    │   │   │   └── CACHE HIT → [TreeNode(2)]
    │   │   └── Build: TreeNode(1, None, TreeNode(2))
    │   ├── root_val = 2
    │   │   ├── left_trees = generate(1, 1)
    │   │   │   └── CACHE HIT → [TreeNode(1)]
    │   │   ├── right_trees = generate(3, 2) → [None]
    │   │   └── Build: TreeNode(2, TreeNode(1), None)
    │   └── memo[(1,2)] = [TreeNode(1,None,TreeNode(2)), TreeNode(2,TreeNode(1),None)]
    ├── right_trees = generate(4, 3) → [None]
    └── Nested Loop:
        ├── left=TreeNode(1,None,TreeNode(2)), right=None
        │   └── Build: TreeNode(3, TreeNode(1,None,TreeNode(2)), None)
        └── left=TreeNode(2,TreeNode(1),None), right=None
            └── Build: TreeNode(3, TreeNode(2,TreeNode(1),None), None)
```

---

## **Approach 3: Dynamic Programming**

### **Complete Nested Execution:**

```
Initial: dp = [[], [None], [], []]

nodes = 1:
├── root = 1
│   ├── left_nodes = 0, right_nodes = 0
│   ├── for left in dp[0]: # left = None
│   │   └── for right in dp[0]: # right = None
│   │       ├── root_node = TreeNode(1)
│   │       ├── root_node.left = clone_tree(None, 0) → None
│   │       ├── root_node.right = clone_tree(None, 1) → None
│   │       └── dp[1].append(TreeNode(1))
│   └── dp[1] = [TreeNode(1)]

nodes = 2:
├── root = 1
│   ├── left_nodes = 0, right_nodes = 1
│   ├── for left in dp[0]: # left = None
│   │   └── for right in dp[1]: # right = TreeNode(1)
│   │       ├── root_node = TreeNode(1)
│   │       ├── root_node.left = clone_tree(None, 0) → None
│   │       ├── root_node.right = clone_tree(TreeNode(1), 1)
│   │       │   └── clone_tree(TreeNode(1), 1):
│   │       │       ├── new_root = TreeNode(1 + 1) = TreeNode(2)
│   │       │       ├── new_root.left = clone_tree(None, 1) → None
│   │       │       ├── new_root.right = clone_tree(None, 1) → None
│   │       │       └── return TreeNode(2)
│   │       └── dp[2].append(TreeNode(1, None, TreeNode(2)))
├── root = 2
│   ├── left_nodes = 1, right_nodes = 0
│   ├── for left in dp[1]: # left = TreeNode(1)
│   │   └── for right in dp[0]: # right = None
│   │       ├── root_node = TreeNode(2)
│   │       ├── root_node.left = clone_tree(TreeNode(1), 0)
│   │       │   └── clone_tree(TreeNode(1), 0):
│   │       │       ├── new_root = TreeNode(1 + 0) = TreeNode(1)
│   │       │       ├── new_root.left = clone_tree(None, 0) → None
│   │       │       ├── new_root.right = clone_tree(None, 0) → None
│   │       │       └── return TreeNode(1)
│   │       ├── root_node.right = clone_tree(None, 2) → None
│   │       └── dp[2].append(TreeNode(2, TreeNode(1), None))
└── dp[2] = [TreeNode(1,None,TreeNode(2)), TreeNode(2,TreeNode(1),None)]

nodes = 3:
├── root = 1
│   ├── left_nodes = 0, right_nodes = 2
│   ├── for left in dp[0]: # left = None
│   │   ├── for right in dp[2][0]: # TreeNode(1,None,TreeNode(2))
│   │   │   ├── root_node = TreeNode(1)
│   │   │   ├── root_node.left = clone_tree(None, 0) → None
│   │   │   ├── root_node.right = clone_tree(TreeNode(1,None,TreeNode(2)), 1)
│   │   │   │   └── clone_tree(TreeNode(1,None,TreeNode(2)), 1):
│   │   │   │       ├── new_root = TreeNode(1 + 1) = TreeNode(2)
│   │   │   │       ├── new_root.left = clone_tree(None, 1) → None
│   │   │   │       ├── new_root.right = clone_tree(TreeNode(2), 1)
│   │   │   │       │   └── clone_tree(TreeNode(2), 1):
│   │   │   │       │       ├── new_root = TreeNode(2 + 1) = TreeNode(3)
│   │   │   │       │       ├── new_root.left = clone_tree(None, 1) → None
│   │   │   │       │       ├── new_root.right = clone_tree(None, 1) → None
│   │   │   │       │       └── return TreeNode(3)
│   │   │   │       └── return TreeNode(2, None, TreeNode(3))
│   │   │   └── dp[3].append(TreeNode(1, None, TreeNode(2,None,TreeNode(3))))
│   │   └── for right in dp[2][1]: # TreeNode(2,TreeNode(1),None)
│   │       ├── root_node = TreeNode(1)
│   │       ├── root_node.left = clone_tree(None, 0) → None
│   │       ├── root_node.right = clone_tree(TreeNode(2,TreeNode(1),None), 1)
│   │       │   └── clone_tree(TreeNode(2,TreeNode(1),None), 1):
│   │       │       ├── new_root = TreeNode(2 + 1) = TreeNode(3)
│   │       │       ├── new_root.left = clone_tree(TreeNode(1), 1)
│   │       │       │   └── TreeNode(1 + 1) = TreeNode(2)
│   │       │       ├── new_root.right = clone_tree(None, 1) → None
│   │       │       └── return TreeNode(3, TreeNode(2), None)
│   │       └── dp[3].append(TreeNode(1, None, TreeNode(3,TreeNode(2),None)))
├── root = 2
│   ├── left_nodes = 1, right_nodes = 1
│   ├── for left in dp[1]: # left = TreeNode(1)
│   │   └── for right in dp[1]: # right = TreeNode(1)
│   │       ├── root_node = TreeNode(2)
│   │       ├── root_node.left = clone_tree(TreeNode(1), 0)
│   │       │   └── clone_tree(TreeNode(1), 0) → TreeNode(1)
│   │       ├── root_node.right = clone_tree(TreeNode(1), 2)
│   │       │   └── clone_tree(TreeNode(1), 2):
│   │       │       └── TreeNode(1 + 2) = TreeNode(3)
│   │       └── dp[3].append(TreeNode(2, TreeNode(1), TreeNode(3)))
└── root = 3
    ├── left_nodes = 2, right_nodes = 0
    ├── for left in dp[2][0]: # TreeNode(1,None,TreeNode(2))
    │   └── for right in dp[0]: # None
    │       ├── root_node = TreeNode(3)
    │       ├── root_node.left = clone_tree(TreeNode(1,None,TreeNode(2)), 0)
    │       │   └── clone_tree returns TreeNode(1,None,TreeNode(2)) (no offset)
    │       ├── root_node.right = clone_tree(None, 3) → None
    │       └── dp[3].append(TreeNode(3, TreeNode(1,None,TreeNode(2)), None))
    └── for left in dp[2][1]: # TreeNode(2,TreeNode(1),None)
        └── for right in dp[0]: # None
            ├── root_node = TreeNode(3)
            ├── root_node.left = clone_tree(TreeNode(2,TreeNode(1),None), 0)
            │   └── clone_tree returns TreeNode(2,TreeNode(1),None) (no offset)
            ├── root_node.right = clone_tree(None, 3) → None
            └── dp[3].append(TreeNode(3, TreeNode(2,TreeNode(1),None), None))
```

### **Final DP State:**
```
dp[3] = [
    TreeNode(1, None, TreeNode(2,None,TreeNode(3))),      # Tree 1
    TreeNode(1, None, TreeNode(3,TreeNode(2),None)),      # Tree 2  
    TreeNode(2, TreeNode(1), TreeNode(3)),                # Tree 3
    TreeNode(3, TreeNode(1,None,TreeNode(2)), None),      # Tree 4
    TreeNode(3, TreeNode(2,TreeNode(1),None), None)       # Tree 5
]
```

---

## **Key Observations:**

1. **Memoization Impact:** Cache hits dramatically reduce redundant computations
2. **Nested Loops:** The Cartesian product of left and right subtrees generates all combinations
3. **Base Cases:** `start > end` returns `[None]` which serves as the empty subtree
4. **Clone Function:** In DP approach, adjusts node values when reusing subtree structures
5. **Call Stack Depth:** Recursive approaches have O(n) call stack depth
6. **Memory Reuse:** Memoization stores and reuses computed subtrees efficiently

All three approaches generate the exact same 5 BST structures but with different computational paths and optimization strategies!
---

# **BST Pattern Recognition** 🔍

## **Common Characteristics:**
1. **BST Property**: Left < Root < Right (global constraint)
2. **Inorder Traversal**: Gives sorted sequence for BSTs
3. **Range Constraints**: Each node has valid value range from ancestors
4. **Recursive Structure**: Left and right subtrees are also BSTs

## **Template Recognition:**
```python
# Universal BST Template
def bst_operation(root):
    def helper(node, constraints):
        if not node:
            return base_case
        
        # Validate/use BST property
        if violates_bst_property(node, constraints):
            return invalid_case
        
        # Process based on BST ordering
        if condition_left:
            return helper(node.left, updated_constraints_left)
        elif condition_right:
            return helper(node.right, updated_constraints_right)
        else:
            # Process current node and combine results
            left_result = helper(node.left, left_constraints)
            right_result = helper(node.right, right_constraints)
            return combine(left_result, right_result, node.val)
    
    return helper(root, initial_constraints)
```

## **When to Use Each Approach:** 🎯
- **Validation**: Use range constraints for global BST property
- **Order Statistics**: Use inorder traversal with early termination
- **Transformations**: Use reverse inorder for cumulative operations
- **Construction**: Use recursive generation with proper value ranges

**BST problems leverage the ordering property to achieve efficient solutions that would be much more complex on general binary trees!** 🚀

# UCARPT - Traversal
#interview/DSA/Tree
Excellent! Let me demonstrate **UCAPRT framework** on **Binary Tree Traversal** problems. These focus on different traversal patterns and tree structure manipulation rather than optimization.

# **Binary Tree Inorder Traversal (94) - Basic Traversals** 🌲

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Traverse binary tree in inorder sequence (left → root → right)
  
- What are inputs/outputs?
  → Input: Binary tree root
  → Output: List of integers (node values in inorder sequence)
  
- What are constraints?
  → Visit each node exactly once
  → Follow inorder pattern: process left subtree, current node, right subtree
  → Handle empty tree (return empty list)
```

## **C - CLARIFY**
```python
# Example 1: Tree structure
#       1
#        \
#         2
#        /
#       3
# Inorder: [1, 3, 2]
# Process: 1 (no left) → 1 → right subtree → 3 → 2 → 2 (no right)

# Example 2: Complete tree
#       3
#      / \
#     1   4
#      \
#       2
# Inorder: [1, 2, 3, 4]
# Process: left(1) → 1 → right(2) → 2 → root(3) → right(4) → 4

# Edge cases:
# - Empty tree: []
# - Single node: [node.val]
# - Linear tree: depends on structure
```

## **A - ANALYZE PATTERN**
```
- Pattern: RECURSIVE TREE TRAVERSAL
- Key insight: Inorder = left subtree + root + right subtree
- State: Current node position in traversal
- Transitions: Recursively process left, visit current, process right
- Goal: Collect all node values in specific order
```

## **P - PLAN**
```python
# Approach 1: Recursive
# def inorder(node):
#   if not node: return []
#   return inorder(node.left) + [node.val] + inorder(node.right)

# Approach 2: Iterative with stack
# Use stack to simulate recursion, process left spine first

# Approach 3: Morris traversal (O(1) space)
# Use threading to avoid stack

# Time: O(n), Space: O(h) recursive, O(1) Morris
```

## **R - REFACTOR**
```python
# Approach 1: Recursive
def inorderTraversal(root):
    result = []
    
    def inorder(node):
        if not node:
            return
        
        inorder(node.left)    # Process left subtree
        result.append(node.val)  # Visit current node
        inorder(node.right)   # Process right subtree
    
    inorder(root)
    return result

# Approach 2: Iterative with Stack
def inorderIterative(root):
    result = []
    stack = []
    current = root
    
    while stack or current:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process current node
        current = stack.pop()
        result.append(current.val)
        
        # Move to right subtree
        current = current.right
    
    return result

# Approach 3: Morris Traversal (O(1) space)
def inorderMorris(root):
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, visit current and go right
            result.append(current.val)
            current = current.right #via thread
        else:
            # Find inorder predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right 
            
            if not predecessor.right:
        # Make thread for rightmost in left subtree connect with current
                predecessor.right = current
                current = current.left
            else:
                # Remove threaded connection and visit
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

## **T - TEST**
```python
# Test tree:
#       3
#      / \
#     1   4
#      \
#       2

# Recursive trace:
# inorder(3): 
#   inorder(1): inorder(None) + [1] + inorder(2): [] + [1] + [2] = [1,2]
#   [3]
#   inorder(4): inorder(None) + [4] + inorder(None) = [4]
# Result: [1,2] + [3] + [4] = [1,2,3,4] ✓
```

---

# **Flatten Binary Tree to Linked List (114) - Preorder Modification** 🔗

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Flatten binary tree to linked list following preorder traversal
  
- What are inputs/outputs?
  → Input: Binary tree root (modify in-place)
  → Output: None (tree modified to linked list form)
  
- What are constraints?
  → Use right pointers as "next" pointers
  → Set all left pointers to null
  → Order follows preorder: root → left subtree → right subtree
  → Modify in-place (O(1) extra space preferred)
```

## **C - CLARIFY**
```python
# Example: Tree structure
#       1
#      / \
#     2   5
#    / \   \
#   3   4   6
#
# Preorder: [1, 2, 3, 4, 5, 6]
# 
# After flattening:
# 1 → 2 → 3 → 4 → 5 → 6
# (all connected via right pointers, left pointers = null)

# Resulting structure:
# 1
#  \
#   2
#    \
#     3
#      \
#       4
#        \
#         5
#          \
#           6

# Edge cases:
# - Empty tree: no change
# - Single node: no change
# - Linear tree: might already be flattened
```

## **A - ANALYZE PATTERN**
```
- Pattern: TREE RESTRUCTURING with traversal
- Key insight: Connect nodes in preorder sequence using right pointers
- State: Current node and its position in flattened sequence
- Transitions: Process current, then left, then right subtrees
- Goal: Rewire tree structure while preserving preorder sequence
```

## **P - PLAN**
```python
# Approach 1: Recursive - flatten subtrees and connect
# flatten(node) returns tail of flattened subtree
# Connect left subtree tail to right subtree head

# Approach 2: Preorder traversal + reconstruction
# Collect preorder sequence, then rebuild as linked list

# Approach 3: In-place with stack (simulate preorder)
# Use stack to track nodes, connect as we process

# Time: O(n), Space: O(h) recursive, O(n) iterative
```

## **R - REFACTOR**
```python
# Approach 1: Recursive (most elegant)
def flatten(root):
    def flatten_helper(node):
        if not node:
            return None
        
        # If leaf node, return itself as tail
        if not node.left and not node.right:
            return node
        
        # Flatten left and right subtrees
        left_tail = flatten_helper(node.left)
        right_tail = flatten_helper(node.right)
        
        # If left subtree exists, rewire connections
        if left_tail:
            left_tail.right = node.right  # Connect left tail to right subtree
            node.right = node.left        # Connect current to left subtree
            node.left = None             # Remove left pointer
        
        # Return the tail of current flattened subtree
        return right_tail if right_tail else left_tail
    
    flatten_helper(root)

# Approach 2: Iterative with Stack
def flattenIterative(root):
    if not root:
        return
    
    stack = [root]
    prev = None
    
    while stack:
        current = stack.pop()
        
        # Add children to stack (right first for preorder)
        if current.right:
            stack.append(current.right)
        if current.left:
            stack.append(current.left)
        
        # Connect previous node to current
        if prev:
            prev.right = current
            prev.left = None
        
        prev = current
    
    # Clean up the last node
    if prev:
        prev.left = None

# Approach 3: O(1) Space - Morris-like traversal
def flattenMorris(root):
    current = root
    
    while current:
        if current.left:
            # Find rightmost node in left subtree
            rightmost = current.left
            while rightmost.right:
                rightmost = rightmost.right
            
            # Connect rightmost to current's right subtree
            rightmost.right = current.right
            
            # Move left subtree to right
            current.right = current.left
            current.left = None
        
        current = current.right
```

## **T - TEST**
```python
# Test tree:
#       1
#      / \
#     2   5
#    / \   \
#   3   4   6

# Recursive trace:
# flatten(3): leaf, returns 3
# flatten(4): leaf, returns 4  
# flatten(2): left_tail=3, right_tail=4
#   3.right = 4, 2.right = 3, 2.left = None
#   returns 4
# flatten(6): leaf, returns 6
# flatten(5): left_tail=None, right_tail=6, returns 6
# flatten(1): left_tail=4, right_tail=6
#   4.right = 5, 1.right = 2, 1.left = None
#   Final: 1→2→3→4→5→6 ✓
```
I'll walk you through both algorithms step-by-step using the same example tree.

## Algorithm 1: Iterative Stack Approach

### Initial Setup
```
       1
      / \
     2   5
    / \   \
   3   4   6
```
- `stack = [1]`, `prev = None`

### Step 1: Process node 1
- `current = stack.pop()` → `current = 1`
- Add children to stack (right first): `stack = [5, 2]`
- `prev = None`, so no connection yet
- `prev = 1`

### Step 2: Process node 2
- `current = stack.pop()` → `current = 2`
- Add children to stack: `stack = [5, 4, 3]`
- `prev = 1`, so connect: `1.right = 2`, `1.left = None`
- `prev = 2`

Tree state:
```
1 → 2   5
    /    \
   3      6
```

### Step 3: Process node 3
- `current = stack.pop()` → `current = 3`
- No children to add: `stack = [5, 4]`
- `prev = 2`, so connect: `2.right = 3`, `2.left = None`
- `prev = 3`

Tree state:
```
1 → 2 → 3   5
             \
              6
```

### Step 4: Process node 4
- `current = stack.pop()` → `current = 4`
- No children to add: `stack = [5]`
- `prev = 3`, so connect: `3.right = 4`, `3.left = None`
- `prev = 4`

Tree state:
```
1 → 2 → 3 → 4   5
                 \
                  6
```

### Step 5: Process node 5
- `current = stack.pop()` → `current = 5`
- Add right child: `stack = [6]`
- `prev = 4`, so connect: `4.right = 5`, `4.left = None`
- `prev = 5`

Tree state:
```
1 → 2 → 3 → 4 → 5
                 \
                  6
```

### Step 6: Process node 6
- `current = stack.pop()` → `current = 6`
- No children: `stack = []`
- `prev = 5`, so connect: `5.right = 6`, `5.left = None`
- `prev = 6`

### Final Result
```
1 → 2 → 3 → 4 → 5 → 6
```

---

## Algorithm 2: Morris-like O(1) Space Approach

### Initial Setup
- `current = 1` (root)

### Step 1: Process node 1
- `current = 1` has left child (2)
- Find rightmost in left subtree: `rightmost = 2 → 4` (4 has no right child)
- Connect: `4.right = 5` (current's right subtree)
- Move left to right: `1.right = 2`, `1.left = None`
- `current = current.right` → `current = 2`

Tree after step 1:
```
1 → 2
    / \
   3   4 → 5
            \
             6
```

### Step 2: Process node 2
- `current = 2` has left child (3)
- Find rightmost in left subtree: `rightmost = 3` (3 has no right child)
- Connect: `3.right = 4` (current's right subtree)
- Move left to right: `2.right = 3`, `2.left = None`
- `current = current.right` → `current = 3`

Tree after step 2:
```
1 → 2 → 3 → 4 → 5
             \
              6
```

### Step 3: Process node 3
- `current = 3` has no left child
- `current = current.right` → `current = 4`

### Step 4: Process node 4
- `current = 4` has no left child
- `current = current.right` → `current = 5`

### Step 5: Process node 5
- `current = 5` has no left child
- `current = current.right` → `current = 6`

### Step 6: Process node 6
- `current = 6` has no left child
- `current = current.right` → `current = None`

### Final Result
```
1 → 2 → 3 → 4 → 5 → 6
```

## Key Differences

| Aspect | Iterative Stack | Morris-like |
|--------|----------------|-------------|
| **Space Complexity** | O(h) - stack space | O(1) - constant space |
| **Strategy** | Preorder traversal with stack | In-place rewiring |
| **Processing Order** | Reverse preorder via stack | Left-to-right traversal |
| **Key Insight** | Stack reverses order for correct connections | Find rightmost to bridge subtrees |

Both algorithms achieve the same result but with different space-time tradeoffs. The Morris-like approach is more space-efficient but harder to understand due to its in-place modifications.
---

# **Recover Binary Search Tree (99) - Inorder Property** 🔧

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Fix BST where exactly two nodes have been swapped
  
- What are inputs/outputs?
  → Input: Binary tree root (BST with two swapped nodes)
  → Output: None (fix tree in-place)
  
- What are constraints?
  → Exactly two nodes are swapped
  → Must restore BST property (inorder gives sorted sequence)
  → Solve without changing tree structure (only swap values)
  → O(1) space preferred
```

## **C - CLARIFY**
```python
# Example 1: Adjacent swap
# Original BST: [1,2,3,4,5] → Tree structure
# After swap: [1,3,2,4,5] → nodes 2 and 3 swapped
# Inorder shows: ...3,2,... (violation: decreasing sequence)

# Example 2: Non-adjacent swap  
# Original BST: [1,2,3,4,5] → Tree structure
# After swap: [1,4,3,2,5] → nodes 2 and 4 swapped
# Inorder shows: ...4,3,2,... (two violations)

# Key insight: In correct BST, inorder traversal gives sorted sequence
# After swap, we get 1 or 2 violations in inorder sequence

# Edge cases:
# - Two adjacent nodes swapped: one violation
# - Two distant nodes swapped: two violations
# - Root involved in swap
```

## **A - ANALYZE PATTERN**
```
- Pattern: INORDER TRAVERSAL with violation detection
- Key insight: BST property violated → inorder sequence has decreasing pairs
- State: Track previous node in inorder, detect violations
- Transitions: Compare current with previous, identify swapped nodes
- Goal: Find two swapped nodes and restore correct values
```

## **P - PLAN**
```python
# Approach: Inorder traversal to detect violations
# 1. Traverse inorder, track previous node
# 2. Find decreasing pairs: prev.val > current.val
# 3. Case 1: One violation → adjacent nodes swapped
#    Case 2: Two violations → distant nodes swapped
# 4. Swap the identified node values

# For adjacent swap: first violation gives both nodes
# For distant swap: first violation gives first node, second gives second node

# Time: O(n), Space: O(h) recursive, O(1) Morris traversal
```

## **R - REFACTOR**
```python
# Approach 1: Recursive Inorder
def recoverTree(root):
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        
        if not node:
            return
        
        inorder(node.left)
        
        # Check for violation
        if prev and prev.val > node.val:
            if not first:
                # First violation found
                first = prev
                second = node  # Tentative second (might be updated)
            else:
                # Second violation found
                second = node
        
        prev = node
        inorder(node.right)
    
    inorder(root)
    
    # Swap values of the two incorrectly placed nodes
    if first and second:
        first.val, second.val = second.val, first.val

# Approach 2: Morris Traversal (O(1) space)
def recoverTreeMorris(root):
    first = second = prev = None
    current = root
    
    while current:
        if not current.left:
            # Process current node
            if prev and prev.val > current.val:
                if not first:
                    first = prev
                    second = current
                else:
                    second = current
            prev = current
            current = current.right
        else:
            # Find inorder predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Make threaded connection
                predecessor.right = current
                current = current.left
            else:
                # Remove threaded connection and process
                predecessor.right = None
                if prev and prev.val > current.val:
                    if not first:
                        first = prev
                        second = current
                    else:
                        second = current
                prev = current
                current = current.right
    
    # Swap values
    if first and second:
        first.val, second.val = second.val, first.val

# Approach 3: Stack-based Iterative
def recoverTreeIterative(root):
    stack = []
    first = second = prev = None
    current = root
    
    while stack or current:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        # Check for violation
        if prev and prev.val > current.val:
            if not first:
                first = prev
                second = current
            else:
                second = current
        
        prev = current
        current = current.right
    
    # Swap values
    if first and second:
        first.val, second.val = second.val, first.val
```

## **T - TEST**
```python
# Test case: Adjacent swap
# Tree: 1,3,2 (nodes 2 and 3 swapped)
# Inorder traversal: 1, 3, 2

# During inorder:
# prev=1, current=3: 1 < 3 ✓
# prev=3, current=2: 3 > 2 ❌ (violation!)
#   first = 3, second = 2
# No more violations

# Swap: 3.val, 2.val = 2, 3
# Result: Tree becomes 1,2,3 ✓
```
I'll walk you through all three approaches for the **Recover Binary Search Tree** problem using a concrete example.

## Example Setup
**Original correct BST:**
```
    4
   / \
  2   6
 / \ / \
1  3 5  7
```
**Inorder:** 1, 2, 3, 4, 5, 6, 7 ✓

**After swapping nodes 2 and 6:**
```
    4
   / \
  6   2
 / \ / \
1  3 5  7
```
**Inorder:** 1, 6, 3, 4, 5, 2, 7 ❌ (violations: 6>3, 5>2)

---

## Approach 1: Recursive Inorder

### Step-by-Step Execution

**Initial:** `first = None`, `second = None`, `prev = None`

### Traversal Steps:

1. **Visit node 1**
   - `prev = None`, no violation check
   - `prev = 1`

2. **Visit node 6** 
   - `prev = 1`, `1 < 6` ✓ (no violation)
   - `prev = 6`

3. **Visit node 3**
   - `prev = 6`, `6 > 3` ❌ **First violation!**
   - `first = 6` (the larger node)
   - `second = 3` (tentative smaller node)
   - `prev = 3`

4. **Visit node 4**
   - `prev = 3`, `3 < 4` ✓
   - `prev = 4`

5. **Visit node 5**
   - `prev = 4`, `4 < 5` ✓
   - `prev = 5`

6. **Visit node 2**
   - `prev = 5`, `5 > 2` ❌ **Second violation!**
   - `first` already set, so `second = 2` (update)
   - `prev = 2`

7. **Visit node 7**
   - `prev = 2`, `2 < 7` ✓
   - `prev = 7`

### Final Swap:
- `first = 6`, `second = 2`
- Swap: `6.val, 2.val = 2, 6`

---

## Approach 2: Morris Traversal (O(1) Space)

I'll provide a detailed step-by-step walkthrough of the Morris traversal algorithm for recovering the BST.

## Example Tree (with swapped nodes 6 and 2):
```
    4
   / \
  6   2
 / \ / \
1  3 5  7
```

**Expected inorder:** 1, 2, 3, 4, 5, 6, 7  
**Actual inorder:** 1, 6, 3, 4, 5, 2, 7 (violations: 6>3, 5>2)

## Initial State:
- `first = None`, `second = None`, `prev = None`
- `current = 4` (root)

---

## **Iteration 1: current = 4**

### Branch: `else` (current has left child 6)
```python
# Find inorder predecessor
predecessor = current.left  # predecessor = 6
while predecessor.right and predecessor.right != current:
    predecessor = predecessor.right
# predecessor traversal: 6 → 3 (stop, 3.right is None)
# Final: predecessor = 3
```

**Threading check:** `predecessor.right` is `None`
```python
# Make threaded connection
predecessor.right = current  # 3.right = 4
current = current.left       # current = 6
```

**Tree state after threading:**
```
    4
   / \
  6   2
 / \ / \
1  3─→4 5  7
   (thread)
```

---

## **Iteration 2: current = 6**

### Branch: `else` (current has left child 1)
```python
# Find inorder predecessor
predecessor = current.left  # predecessor = 1
while predecessor.right and predecessor.right != current:
    predecessor = predecessor.right
# 1.right is None, so loop doesn't run
# Final: predecessor = 1
```

**Threading check:** `predecessor.right` is `None`
```python
# Make threaded connection
predecessor.right = current  # 1.right = 6
current = current.left       # current = 1
```

**Tree state after threading:**
```
    4
   / \
  6   2
 / \ / \
1─→6 3─→4 5  7
(thread) (thread)
```

---

## **Iteration 3: current = 1**

### Branch: `if` (current has no left child)
```python
# Process current node
if prev and prev.val > current.val:  # prev is None
    # No violation check
prev = current  # prev = 1
current = current.right  # current = 6 (following thread!)
```

**State:** `prev = 1`, `current = 6`

---

## **Iteration 4: current = 6** (via thread)

### Branch: `else` (current has left child 1)
```python
# Find inorder predecessor
predecessor = current.left  # predecessor = 1
while predecessor.right and predecessor.right != current:
    predecessor = predecessor.right
# 1.right = 6, which equals current, so loop exits immediately
# Final: predecessor = 1
```

**Threading check:** `predecessor.right == current` (thread exists!)
```python
# Remove threaded connection and process
predecessor.right = None  # 1.right = None (thread removed)
if prev and prev.val > current.val:  # prev=1, current=6, 1 < 6 ✓
    # No violation
prev = current     # prev = 6
current = current.right  # current = 3
```

**Tree state after thread removal:**
```
    4
   / \
  6   2
 / \ / \
1   3─→4 5  7
   (thread)
```

**State:** `prev = 6`, `current = 3`

---

## **Iteration 5: current = 3**

### Branch: `if` (current has no left child)
```python
# Process current node
if prev and prev.val > current.val:  # prev=6, current=3, 6 > 3 ❌
    if not first:  # first is None
        first = prev    # first = 6 ⭐ FIRST VIOLATION!
        second = current # second = 3 (tentative)
prev = current  # prev = 3
current = current.right  # current = 4 (following thread!)
```

**State:** `first = 6`, `second = 3`, `prev = 3`, `current = 4`

---

## **Iteration 6: current = 4** (via thread)

### Branch: `else` (current has left child 6)
```python
# Find inorder predecessor
predecessor = current.left  # predecessor = 6
while predecessor.right and predecessor.right != current:
    predecessor = predecessor.right
# 6 → 3, 3.right = 4 (equals current), so loop exits
# Final: predecessor = 3
```

**Threading check:** `predecessor.right == current` (thread exists!)
```python
# Remove threaded connection and process
predecessor.right = None  # 3.right = None (thread removed)
if prev and prev.val > current.val:  # prev=3, current=4, 3 < 4 ✓
    # No violation
prev = current     # prev = 4
current = current.right  # current = 2
```

**Tree state after thread removal:**
```
    4
   / \
  6   2
 / \ / \
1   3   5  7
```

**State:** `first = 6`, `second = 3`, `prev = 4`, `current = 2`

---

## **Iteration 7: current = 2**

### Branch: `else` (current has left child 5)
```python
# Find inorder predecessor
predecessor = current.left  # predecessor = 5
while predecessor.right and predecessor.right != current:
    predecessor = predecessor.right
# 5.right is None, so loop doesn't run
# Final: predecessor = 5
```

**Threading check:** `predecessor.right` is `None`
```python
# Make threaded connection
predecessor.right = current  # 5.right = 2
current = current.left       # current = 5
```

**Tree state after threading:**
```
    4
   / \
  6   2
 / \ / \
1   3 5─→2 7
     (thread)
```

---

## **Iteration 8: current = 5**

### Branch: `if` (current has no left child)
```python
# Process current node
if prev and prev.val > current.val:  # prev=4, current=5, 4 < 5 ✓
    # No violation
prev = current  # prev = 5
current = current.right  # current = 2 (following thread!)
```

**State:** `first = 6`, `second = 3`, `prev = 5`, `current = 2`

---

## **Iteration 9: current = 2** (via thread)

### Branch: `else` (current has left child 5)
```python
# Find inorder predecessor
predecessor = current.left  # predecessor = 5
while predecessor.right and predecessor.right != current:
    predecessor = predecessor.right
# 5.right = 2 (equals current), so loop exits immediately
# Final: predecessor = 5
```

**Threading check:** `predecessor.right == current` (thread exists!)
```python
# Remove threaded connection and process
predecessor.right = None  # 5.right = None (thread removed)
if prev and prev.val > current.val:  # prev=5, current=2, 5 > 2 ❌
    if not first:  # first = 6 (already set)
        # Skip
    else:
        second = current  # second = 2 ⭐ SECOND VIOLATION!
prev = current     # prev = 2
current = current.right  # current = 7
```

**State:** `first = 6`, `second = 2`, `prev = 2`, `current = 7`

---

## **Iteration 10: current = 7**

### Branch: `if` (current has no left child)
```python
# Process current node
if prev and prev.val > current.val:  # prev=2, current=7, 2 < 7 ✓
    # No violation
prev = current  # prev = 7
current = current.right  # current = None
```

**State:** `first = 6`, `second = 2`, `prev = 7`, `current = None`

---

## **Final Step: Swap Values**
```python
if first and second:  # first=6, second=2
    first.val, second.val = second.val, first.val  # Swap 6 ↔ 2
```

## **Result:**
The tree is now correctly recovered:
```
    4
   / \
  2   6
 / \ / \
1  3 5  7
```

## **Key Insights:**
1. **Two violations detected:** 6>3 (first) and 5>2 (second)
2. **Threading mechanism:** Temporary connections eliminated the need for recursion stack
3. **Processing pattern:** Each node processed exactly once during inorder traversal
4. **Space complexity:** O(1) - no additional data structures needed!

The Morris traversal successfully identified and swapped the two incorrectly placed nodes (6 and 2) while using constant space.

---

## Approach 3: Stack-based Iterative

### Step-by-Step Execution:

**Initial:** `stack = []`, `current = 4`, `first = None`, `second = None`, `prev = None`

### Traversal Steps:

1. **Push left spine:** `stack = [4, 6, 1]`, `current = None`

2. **Pop and process 1:**
   - `current = 1`, `prev = None`, no violation
   - `prev = 1`, `current = 1.right = None`

3. **Pop and process 6:**
   - `current = 6`, `prev = 1`, `1 < 6` ✓
   - `prev = 6`, push right spine: `stack = [4, 3]`

4. **Pop and process 3:**
   - `current = 3`, `prev = 6`, `6 > 3` ❌ **First violation!**
   - `first = 6`, `second = 3`
   - `prev = 3`, `current = 3.right = None`

5. **Pop and process 4:**
   - `current = 4`, `prev = 3`, `3 < 4` ✓
   - `prev = 4`, push right spine: `stack = [2, 5]`

6. **Pop and process 5:**
   - `current = 5`, `prev = 4`, `4 < 5` ✓
   - `prev = 5`, `current = 5.right = None`

7. **Pop and process 2:**
   - `current = 2`, `prev = 5`, `5 > 2` ❌ **Second violation!**
   - `second = 2` (update)
   - `prev = 2`, push right spine: `stack = [7]`

8. **Pop and process 7:**
   - `current = 7`, `prev = 2`, `2 < 7` ✓
   - Done

### Final Swap:
- `first = 6`, `second = 2`
- Swap: `6.val, 2.val = 2, 6`

---

## Key Insights

| Approach | Space | Key Mechanism | Advantage |
|----------|-------|---------------|-----------|
| **Recursive** | O(h) | Call stack for inorder | Simple and clean |
| **Morris** | O(1) | Threaded links | Constant space |
| **Iterative** | O(h) | Explicit stack | No recursion |

**Common Pattern:** All approaches detect **two violations** in the inorder sequence:
1. **First violation:** `first` = larger node, `second` = tentative smaller node
2. **Second violation:** Update `second` to the actual smaller node

The beauty is that in a BST with exactly two swapped nodes, there are at most 2 positions where `prev.val > current.val` during inorder traversal!
---

# **Vertical Order Traversal (987) - Custom Ordering** 📊

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Return nodes grouped by vertical columns, sorted by specific rules
  
- What are inputs/outputs?
  → Input: Binary tree root
  → Output: List of lists (each inner list contains nodes in one column)
  
- What are constraints?
  → Columns ordered left to right by x-coordinate
  → Within same column: order by y-coordinate (top to bottom)
  → Within same (x,y): order by node value
  → Root at position (0,0), left child at (x-1,y+1), right child at (x+1,y+1)
```

## **C - CLARIFY**
```python
# Example: Tree structure
#       3
#      / \
#     9  20
#       /  \
#      15   7
#
# Coordinates:
# 3: (0,0)
# 9: (-1,1)  
# 20: (1,1)
# 15: (0,2)
# 7: (2,2)
#
# Vertical columns:
# x=-1: [9]
# x=0: [3,15] (sorted by y-coordinate)
# x=1: [20]  
# x=2: [7]
# Result: [[9],[3,15],[20],[7]]

# Complex case with same coordinates:
#       1
#      / \
#     2   3
#    / \   \
#   4   5   6
#          /
#         7
# Some nodes might have same (x,y), need value sorting

# Edge cases:
# - Single node: [[root.val]]
# - Linear tree: depends on direction
# - Nodes with same coordinates: sort by value
```

## **A - ANALYZE PATTERN**
```
- Pattern: TREE TRAVERSAL with coordinate tracking
- Key insight: Assign (x,y) coordinates to each node, group by x, sort appropriately
- State: Node position (x,y) and value
- Transitions: Track coordinates during traversal
- Goal: Collect and sort nodes by complex multi-level criteria
```

## **P - PLAN**
```python
# Approach: BFS/DFS with coordinate tracking
# 1. Traverse tree, assign (x,y) coordinates to each node
# 2. Group nodes by x-coordinate (vertical column)
# 3. Within each column, sort by:
#    - y-coordinate (top to bottom)
#    - node value (if same y)
# 4. Return columns in x-coordinate order

# Time: O(n log n), Space: O(n)
```

## **R - REFACTOR**
```python
# Approach 1: DFS with coordinate tracking
def verticalTraversal(root):
    # Step 1: Collect all nodes with coordinates
    nodes = []
    
    def dfs(node, row, col):
        if not node:
            return
        nodes.append((col, row, node.val))  # Note the order!
        dfs(node.left, row + 1, col - 1)
        dfs(node.right, row + 1, col + 1)
    
    dfs(root, 0, 0)
    
    # Step 2: Sort by (col, row, val)
    nodes.sort()
    
    # Step 3: Group by column
    result = []
    prev_col = float('-inf')
    
    for col, row, val in nodes:
        if col != prev_col:
            result.append([])
            prev_col = col
        result[-1].append(val)
    
    return result

# Approach 3: More optimized grouping
def verticalTraversalOptimized(root):
    from collections import defaultdict
    
    column_map = defaultdict(list)
    
    def dfs(node, x, y):
        if not node:
            return
        
        column_map[x].append((y, node.val))
        dfs(node.left, x - 1, y + 1)
        dfs(node.right, x + 1, y + 1)
    
    dfs(root, 0, 0)
    
    # Build result in sorted order
    result = []
    for x in sorted(column_map.keys()):
        column = sorted(column_map[x], key=lambda item: (item[0], item[1]))
        result.append([val for y, val in column])
    
    return result
```

## **T - TEST**
I'll walk you through the **Vertical Order Traversal** algorithm step-by-step using a concrete example.

## Example Tree:
```
       1
      / \
     2   3
    / \   
   4   6
      /
     5
```

## Initial Setup:
- `column_map = defaultdict(list)` (empty)
- Call `dfs(root=1, x=0, y=0)`

---

## **DFS Traversal Steps:**

### **Call 1: dfs(node=1, x=0, y=0)**
```python
column_map[0].append((0, 1))  # column_map[0] = [(0, 1)]
dfs(node.left=2, x=-1, y=1)  # Recurse left
dfs(node.right=3, x=1, y=1)  # Recurse right
```

**State:** `column_map = {0: [(0, 1)]}`

### **Call 2: dfs(node=2, x=-1, y=1)**
```python
column_map[-1].append((1, 2))  # column_map[-1] = [(1, 2)]
dfs(node.left=4, x=-2, y=2)   # Recurse left
dfs(node.right=6, x=0, y=2)   # Recurse right
```

**State:** `column_map = {0: [(0, 1)], -1: [(1, 2)]}`

### **Call 3: dfs(node=4, x=-2, y=2)**
```python
column_map[-2].append((2, 4))  # column_map[-2] = [(2, 4)]
dfs(node.left=None, x=-3, y=3)  # Returns immediately
dfs(node.right=None, x=-1, y=3) # Returns immediately
```

**State:** `column_map = {0: [(0, 1)], -1: [(1, 2)], -2: [(2, 4)]}`

### **Call 4: dfs(node=6, x=0, y=2)**
```python
column_map[0].append((2, 6))   # column_map[0] = [(0, 1), (2, 6)]
dfs(node.left=5, x=-1, y=3)   # Recurse left
dfs(node.right=None, x=1, y=3) # Returns immediately
```

**State:** `column_map = {0: [(0, 1), (2, 6)], -1: [(1, 2)], -2: [(2, 4)]}`

### **Call 5: dfs(node=5, x=-1, y=3)**
```python
column_map[-1].append((3, 5))  # column_map[-1] = [(1, 2), (3, 5)]
dfs(node.left=None, x=-2, y=4)  # Returns immediately
dfs(node.right=None, x=0, y=4)  # Returns immediately
```

**State:** `column_map = {0: [(0, 1), (2, 6)], -1: [(1, 2), (3, 5)], -2: [(2, 4)]}`

### **Call 6: dfs(node=3, x=1, y=1)**
```python
column_map[1].append((1, 3))   # column_map[1] = [(1, 3)]
dfs(node.left=None, x=0, y=2)  # Returns immediately
dfs(node.right=None, x=2, y=2) # Returns immediately
```

**Final State:** 
```python
column_map = {
    0: [(0, 1), (2, 6)],   # Column 0: nodes 1, 6
    -1: [(1, 2), (3, 5)],  # Column -1: nodes 2, 5  
    -2: [(2, 4)],          # Column -2: node 4
    1: [(1, 3)]            # Column 1: node 3
}
```

---

## **Building the Result:**

### **Step 1: Sort columns by x-coordinate**
```python
sorted(column_map.keys()) = [-2, -1, 0, 1]
```

### **Step 2: Process each column**

#### **Column x = -2:**
```python
column = column_map[-2] = [(2, 4)]
# Sort by (y, val): [(2, 4)] → [(2, 4)] (no change)
# Extract values: [4]
```

#### **Column x = -1:**
```python
column = column_map[-1] = [(1, 2), (3, 5)]
# Sort by (y, val): [(1, 2), (3, 5)] → [(1, 2), (3, 5)] (already sorted)
# Extract values: [2, 5]
```

#### **Column x = 0:**
```python
column = column_map[0] = [(0, 1), (2, 6)]
# Sort by (y, val): [(0, 1), (2, 6)] → [(0, 1), (2, 6)] (already sorted)
# Extract values: [1, 6]
```

#### **Column x = 1:**
```python
column = column_map[1] = [(1, 3)]
# Sort by (y, val): [(1, 3)] → [(1, 3)] (no change)
# Extract values: [3]
```

### **Final Result:**
```python
result = [[4], [2, 5], [1, 6], [3]]
```

---

## **Visual Coordinate System:**

```
       1 (0,0)
      / \
(−1,1) 2   3 (1,1)
    / \   
(−2,2) 4   6 (0,2)
          /
   (−1,3) 5
```

**Column groupings:**
- **x = -2:** [4]
- **x = -1:** [2, 5] (sorted by y: y=1, y=3)
- **x = 0:** [1, 6] (sorted by y: y=0, y=2)  
- **x = 1:** [3]

---

## **Key Algorithm Insights:**

### **1. Coordinate Assignment:**
- **x-coordinate:** Column position (left = x-1, right = x+1)
- **y-coordinate:** Row level (increases going down)

### **2. Sorting Strategy:**
```python
key=lambda item: (item[0], item[1])  # Sort by (y, val)
```
- **Primary:** Sort by y-coordinate (top to bottom)
- **Secondary:** Sort by node value (left to right for same position)

### **3. Space-Time Complexity:**
- **Time:** O(N log N) for sorting
- **Space:** O(N) for storing coordinates

### **4. Edge Cases Handled:**
- Multiple nodes in same column
- Nodes at same (x,y) position (sorted by value)
- Empty subtrees (handled by base case)

This algorithm efficiently groups nodes by vertical column and sorts them correctly within each column!
---

# **Tree Traversal Pattern Recognition** 🌲

## **Common Characteristics:**
1. **Order Matters**: Different traversal orders serve different purposes
2. **State Tracking**: Often need to track position, coordinates, or previous nodes
3. **Multiple Approaches**: Recursive, iterative, Morris (space-optimized)
4. **Property Utilization**: Leverage BST properties, tree structure, etc.

## **Template Recognition:**
```python
# Universal Tree Traversal Template
def traverse_tree(root, order_type):
    result = []
    
    def dfs(node):
        if not node:
            return
        
        # Preorder: process current first
        if order_type == 'preorder':
            result.append(node.val)
        
        # Process left subtree
        dfs(node.left)
        
        # Inorder: process current between left and right
        if order_type == 'inorder':
            result.append(node.val)
        
        # Process right subtree  
        dfs(node.right)
        
        # Postorder: process current last
        if order_type == 'postorder':
            result.append(node.val)
    
    dfs(root)
    return result
```

## **When to Use Each Pattern:** 🎯
- **Inorder**: BST operations, sorted output
- **Preorder**: Tree copying, serialization
- **Postorder**: Tree deletion, bottom-up processing
- **Level-order**: BFS, shortest paths, level-based operations
- **Custom**: Special requirements like vertical ordering

**Tree traversal problems focus on visiting nodes in specific orders while potentially modifying structure or extracting information!** 🚀

# UCARPT - Construct Tree
#interview/DSA/Tree
Excellent! Let me demonstrate **UCAPRT framework** on **Tree Construction** problems. These focus on building/reconstructing trees from various input formats.

# **Construct Binary Tree from Preorder and Inorder (105)** 🏗️

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Reconstruct original binary tree from preorder and inorder traversal arrays
  
- What are inputs/outputs?
  → Input: Two arrays - preorder and inorder traversals
  → Output: TreeNode (root of reconstructed tree)
  
- What are constraints?
  → Tree has unique values (no duplicates)
  → Both arrays represent same tree
  → Arrays have same length
  → Valid tree structure possible
```

## **C - CLARIFY**
```python
# Example: 
# preorder = [3,9,20,15,7]
# inorder = [9,3,15,20,7]

# Key insight: 
# - First element in preorder is always root
# - In inorder, root splits left and right subtrees
# - Recursively apply same logic to subtrees

# Reconstruction:
# Root = 3 (first in preorder)
# Inorder: [9] | 3 | [15,20,7]
#          ↑         ↑
#       left      right
# 
# Resulting tree:
#       3
#      / \
#     9  20
#       /  \
#      15   7

# Edge cases:
# - Empty arrays: return None
# - Single element: return single node
# - Linear tree: one subtree always empty
```

## **A - ANALYZE PATTERN**
```
- Pattern: DIVIDE AND CONQUER with traversal properties
- Key insight: Preorder gives root, inorder gives subtree boundaries
- State: Current preorder/inorder subarrays for subtree
- Transitions: Split by root position, recursively build subtrees
- Goal: Reconstruct tree structure using traversal properties
```

## **P - PLAN**
```python
# Algorithm:
# 1. Take first element from preorder as root
# 2. Find root position in inorder array
# 3. Split inorder into left and right parts
# 4. Split preorder correspondingly (skip root)
# 5. Recursively build left and right subtrees
# 6. Connect and return root

# Optimization: Use hashmap for O(1) root lookup in inorder
# Time: O(n), Space: O(n)
```

## **R - REFACTOR**
```python
def buildTree(preorder, inorder):
    if not preorder or not inorder:
        return None
    
    # Build hashmap for O(1) inorder lookups
    inorder_map = {val: i for i, val in enumerate(inorder)}
    self.preorder_idx = 0
    
    def build(left, right):
        if left > right:
            return None
        
        # Root is current element in preorder
        root_val = preorder[self.preorder_idx]
        self.preorder_idx += 1
        root = TreeNode(root_val)
        
        # Find root position in inorder
        root_idx = inorder_map[root_val]
        
        # Build left subtree first (matches preorder sequence)
        root.left = build(left, root_idx - 1)
        # Build right subtree
        root.right = build(root_idx + 1, right)
        
        return root
    
    return build(0, len(inorder) - 1)

# Alternative: Explicit array slicing (less efficient but clearer)
def buildTreeSlicing(preorder, inorder):
    if not preorder:
        return None
    
    root = TreeNode(preorder[0])
    
    # Find root in inorder
    mid = inorder.index(preorder[0])
    
    # Build subtrees with corresponding slices
    root.left = buildTreeSlicing(preorder[1:mid+1], inorder[:mid])
    root.right = buildTreeSlicing(preorder[mid+1:], inorder[mid+1:])
    
    return root

# Using class to avoid global variable
class Solution:
    def buildTree(self, preorder, inorder):
        self.preorder_idx = 0
        inorder_map = {val: i for i, val in enumerate(inorder)}
        
        def build(left, right):
            if left > right:
                return None
            
            root_val = preorder[self.preorder_idx]
            self.preorder_idx += 1
            root = TreeNode(root_val)
            
            root_idx = inorder_map[root_val]
            
            # Order matters: left subtree first
            root.left = build(left, root_idx - 1)
            root.right = build(root_idx + 1, right)
            
            return root
        
        return build(0, len(inorder) - 1)
```

## **T - TEST**
```python
# Test: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]

# build(0, 4):
#   root_val = 3, root_idx = 1
#   left = build(0, 0): root_val = 9, returns TreeNode(9)
#   right = build(2, 4): root_val = 20, root_idx = 3
#     left = build(2, 2): root_val = 15, returns TreeNode(15)  
#     right = build(4, 4): root_val = 7, returns TreeNode(7)
#     returns TreeNode(20) with children 15, 7
#   returns TreeNode(3) with children 9, TreeNode(20)

# Result: Tree matches expected structure ✓
```

---

# **Serialize and Deserialize Binary Tree (297)** 💾

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Convert binary tree to string format and reconstruct tree from string
  
- What are inputs/outputs?
  → Serialize: TreeNode → String
  → Deserialize: String → TreeNode
  
- What are constraints?
  → Must handle any binary tree (including None nodes)
  → Serialization format should uniquely represent tree
  → Roundtrip property: deserialize(serialize(tree)) == tree
  → Efficient encoding preferred
```

## **C - CLARIFY**
```python
# Example tree:
#       1
#      / \
#     2   3
#        / \
#       4   5

# Possible serializations:
# Preorder with nulls: "1,2,null,null,3,4,null,null,5,null,null"
# Level-order: "1,2,3,null,null,4,5"
# Postorder: "null,null,2,null,null,4,null,null,5,3,1"

# Must be able to reconstruct exactly the same tree structure

# Edge cases:
# - Empty tree: "null" or ""
# - Single node: "1"
# - Linear tree: "1,2,null,null,3,null,null"
# - Complete tree: all levels filled
```

## **A - ANALYZE PATTERN**
```
- Pattern: TREE TRAVERSAL with structure encoding
- Key insight: Need to encode both values and structure (null positions)
- State: Current position in traversal/reconstruction
- Transitions: Process nodes and nulls systematically
- Goal: Bijective mapping between tree and string representation
```

## **P - PLAN**
```python
# Approach 1: Preorder with explicit nulls
# Serialize: preorder traversal, include "null" for empty nodes
# Deserialize: reconstruct using preorder sequence

# Approach 2: Level-order (BFS)
# Serialize: level by level, include nulls
# Deserialize: reconstruct level by level

# Time: O(n), Space: O(n)
```

## **R - REFACTOR**
```python
# Approach 1: Preorder Serialization
class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string."""
        def preorder(node):
            if not node:
                return "null"
            return str(node.val) + "," + preorder(node.left) + "," + preorder(node.right)
        
        return preorder(root)

    def deserialize(self, data):
        """Decodes your encoded data to tree."""
        def build():
            val = next(self.vals)
            if val == "null":
                return None
            
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        
        self.vals = iter(data.split(","))
        return build()

# Approach 2: Level-order Serialization
class CodecLevelOrder:
    def serialize(self, root):
        if not root:
            return ""
        
        from collections import deque
        queue = deque([root])
        result = []
        
        while queue:
            node = queue.popleft()
            if node:
                result.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append("null")
        
        # Remove trailing nulls
        while result and result[-1] == "null":
            result.pop()
        
        return ",".join(result)

    def deserialize(self, data):
        if not data:
            return None
        
        from collections import deque
        values = data.split(",")
        root = TreeNode(int(values[0]))
        queue = deque([root])
        i = 1
        
        while queue and i < len(values):
            node = queue.popleft()
            
            # Left child
            if i < len(values) and values[i] != "null":
                node.left = TreeNode(int(values[i]))
                queue.append(node.left)
            i += 1
            
            # Right child
            if i < len(values) and values[i] != "null":
                node.right = TreeNode(int(values[i]))
                queue.append(node.right)
            i += 1
        
        return root

# Approach 3: Optimized Preorder with Iterator
class CodecOptimized:
    def serialize(self, root):
        result = []
        
        def preorder(node):
            if not node:
                result.append("null")
                return
            
            result.append(str(node.val))
            preorder(node.left)
            preorder(node.right)
        
        preorder(root)
        return ",".join(result)

    def deserialize(self, data):
        def build():
            val = next(values)
            if val == "null":
                return None
            
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        
        values = iter(data.split(","))
        return build()
```

## **T - TEST**
```python
# Test tree:
#       1
#      / \
#     2   3
#        / \
#       4   5

# Preorder serialization:
# serialize: preorder(1) → "1," + preorder(2) + "," + preorder(3)
#   preorder(2) → "2,null,null"  
#   preorder(3) → "3,4,null,null,5,null,null"
# Result: "1,2,null,null,3,4,null,null,5,null,null"

# Deserialize:
# vals = iter(["1","2","null","null","3","4","null","null","5","null","null"])
# build(): val="1" → TreeNode(1)
#   left = build(): val="2" → TreeNode(2)
#     left = build(): val="null" → None
#     right = build(): val="null" → None
#   right = build(): val="3" → TreeNode(3)
#     left = build(): val="4" → TreeNode(4) with None children
#     right = build(): val="5" → TreeNode(5) with None children
# Result: Reconstructed tree matches original ✓
```
I'll walk you through all three serialization/deserialization approaches using a concrete example tree.

## Example Tree:
```
    1
   / \
  2   3
     / \
    4   5
```

---

## **Approach 1: Preorder Serialization**

### **Serialization Steps:**

#### **Initial Call: preorder(root=1)**
```python
# node = 1 (not null)
return str(1) + "," + preorder(node.left=2) + "," + preorder(node.right=3)
```

#### **Call 2: preorder(node=2)**
```python
# node = 2 (not null)
return str(2) + "," + preorder(node.left=None) + "," + preorder(node.right=None)
```

#### **Call 3: preorder(node=None)** ← Left child of 2
```python
# node is None
return "null"
```

#### **Call 4: preorder(node=None)** ← Right child of 2
```python
# node is None
return "null"
```

#### **Back to Call 2:**
```python
return "2" + "," + "null" + "," + "null" = "2,null,null"
```

#### **Call 5: preorder(node=3)** ← Right child of 1
```python
# node = 3 (not null)
return str(3) + "," + preorder(node.left=4) + "," + preorder(node.right=5)
```

#### **Call 6: preorder(node=4)** ← Left child of 3
```python
# node = 4 (not null)
return str(4) + "," + preorder(node.left=None) + "," + preorder(node.right=None)
return "4,null,null"
```

#### **Call 7: preorder(node=5)** ← Right child of 3
```python
# node = 5 (not null)
return str(5) + "," + preorder(node.left=None) + "," + preorder(node.right=None)
return "5,null,null"
```

#### **Back to Call 5:**
```python
return "3" + "," + "4,null,null" + "," + "5,null,null" = "3,4,null,null,5,null,null"
```

#### **Back to Initial Call:**
```python
return "1" + "," + "2,null,null" + "," + "3,4,null,null,5,null,null"
= "1,2,null,null,3,4,null,null,5,null,null"
```

**Serialized String:** `"1,2,null,null,3,4,null,null,5,null,null"`

### **Deserialization Steps:**

#### **Setup:**
```python
data = "1,2,null,null,3,4,null,null,5,null,null"
self.vals = iter(["1", "2", "null", "null", "3", "4", "null", "null", "5", "null", "null"])
```

#### **Call 1: build()**
```python
val = next(self.vals) = "1"  # val != "null"
node = TreeNode(1)
node.left = build()   # Call 2
node.right = build()  # Call 6
return node
```

#### **Call 2: build()** ← Left child of 1
```python
val = next(self.vals) = "2"  # val != "null"
node = TreeNode(2)
node.left = build()   # Call 3
node.right = build()  # Call 4
return node
```

#### **Call 3: build()** ← Left child of 2
```python
val = next(self.vals) = "null"  # val == "null"
return None
```

#### **Call 4: build()** ← Right child of 2
```python
val = next(self.vals) = "null"  # val == "null"
return None
```

#### **Back to Call 2:** TreeNode(2) with no children

#### **Call 6: build()** ← Right child of 1
```python
val = next(self.vals) = "3"  # val != "null"
node = TreeNode(3)
node.left = build()   # Call 7
node.right = build()  # Call 10
return node
```

#### **Call 7: build()** ← Left child of 3
```python
val = next(self.vals) = "4"  # val != "null"
node = TreeNode(4)
node.left = build()   # Call 8 → "null" → None
node.right = build()  # Call 9 → "null" → None
return TreeNode(4)
```

#### **Call 10: build()** ← Right child of 3
```python
val = next(self.vals) = "5"  # val != "null"
node = TreeNode(5)
node.left = build()   # "null" → None
node.right = build()  # "null" → None
return TreeNode(5)
```

**Reconstructed Tree:** Original tree structure restored!

---

## **Approach 2: Level-Order Serialization**

### **Serialization Steps:**

#### **Initial Setup:**
```python
queue = deque([1])  # Start with root
result = []
```

#### **Iteration 1:**
```python
node = queue.popleft() = 1  # node is not None
result.append("1")          # result = ["1"]
queue.append(node.left=2)   # queue = [2]
queue.append(node.right=3)  # queue = [2, 3]
```

#### **Iteration 2:**
```python
node = queue.popleft() = 2  # node is not None
result.append("2")          # result = ["1", "2"]
queue.append(node.left=None)  # queue = [3, None]
queue.append(node.right=None) # queue = [3, None, None]
```

#### **Iteration 3:**
```python
node = queue.popleft() = 3  # node is not None
result.append("3")          # result = ["1", "2", "3"]
queue.append(node.left=4)   # queue = [None, None, 4]
queue.append(node.right=5)  # queue = [None, None, 4, 5]
```

#### **Iteration 4:**
```python
node = queue.popleft() = None  # node is None
result.append("null")          # result = ["1", "2", "3", "null"]
```

#### **Iteration 5:**
```python
node = queue.popleft() = None  # node is None
result.append("null")          # result = ["1", "2", "3", "null", "null"]
```

#### **Iteration 6:**
```python
node = queue.popleft() = 4  # node is not None
result.append("4")          # result = ["1", "2", "3", "null", "null", "4"]
queue.append(node.left=None)  # queue = [5, None]
queue.append(node.right=None) # queue = [5, None, None]
```

#### **Iteration 7:**
```python
node = queue.popleft() = 5  # node is not None
result.append("5")          # result = ["1", "2", "3", "null", "null", "4", "5"]
queue.append(node.left=None)  # queue = [None, None, None]
queue.append(node.right=None) # queue = [None, None, None, None]
```

#### **Remaining iterations:** Add "null" for all remaining None nodes
```python
result = ["1", "2", "3", "null", "null", "4", "5", "null", "null", "null", "null"]
```

#### **Remove trailing nulls:**
```python
# Remove trailing "null"s
result = ["1", "2", "3", "null", "null", "4", "5"]
```

**Serialized String:** `"1,2,3,null,null,4,5"`

### **Deserialization Steps:**

#### **Setup:**
```python
data = "1,2,3,null,null,4,5"
values = ["1", "2", "3", "null", "null", "4", "5"]
root = TreeNode(1)
queue = deque([root])
i = 1
```

#### **Process Node 1:**
```python
node = queue.popleft() = TreeNode(1)

# Left child: values[1] = "2" != "null"
node.left = TreeNode(2)
queue.append(TreeNode(2))  # queue = [TreeNode(2)]
i = 2

# Right child: values[2] = "3" != "null"
node.right = TreeNode(3)
queue.append(TreeNode(3))  # queue = [TreeNode(2), TreeNode(3)]
i = 3
```

#### **Process Node 2:**
```python
node = queue.popleft() = TreeNode(2)

# Left child: values[3] = "null"
# node.left remains None
i = 4

# Right child: values[4] = "null"
# node.right remains None
i = 5
```

#### **Process Node 3:**
```python
node = queue.popleft() = TreeNode(3)

# Left child: values[5] = "4" != "null"
node.left = TreeNode(4)
queue.append(TreeNode(4))  # queue = [TreeNode(4)]
i = 6

# Right child: values[6] = "5" != "null"
node.right = TreeNode(5)
queue.append(TreeNode(5))  # queue = [TreeNode(4), TreeNode(5)]
i = 7
```

#### **Process Node 4:**
```python
node = queue.popleft() = TreeNode(4)
# i = 7, which is >= len(values), so no more children to process
```

**Reconstructed Tree:** Original tree structure restored!

---

## **Approach 3: Optimized Preorder**

### **Serialization Steps:**

#### **Execution with result list:**
```python
result = []

# preorder(1): result.append("1"), then recurse left and right
# preorder(2): result.append("2"), then recurse left and right
# preorder(None): result.append("null") (left child of 2)
# preorder(None): result.append("null") (right child of 2)
# preorder(3): result.append("3"), then recurse left and right
# preorder(4): result.append("4"), then recurse left and right
# preorder(None): result.append("null") (left child of 4)
# preorder(None): result.append("null") (right child of 4)
# preorder(5): result.append("5"), then recurse left and right
# preorder(None): result.append("null") (left child of 5)
# preorder(None): result.append("null") (right child of 5)

result = ["1", "2", "null", "null", "3", "4", "null", "null", "5", "null", "null"]
```

**Serialized String:** `"1,2,null,null,3,4,null,null,5,null,null"`

### **Deserialization Steps:**
```python
values = iter(["1", "2", "null", "null", "3", "4", "null", "null", "5", "null", "null"])
# Execution is identical to Approach 1
```

---

## **Key Comparisons:**

| Approach | Serialized Output | Traversal Order | Space Efficiency |
|----------|-------------------|-----------------|------------------|
| **Preorder** | `"1,2,null,null,3,4,null,null,5,null,null"` | DFS | More nulls stored |
| **Level-order** | `"1,2,3,null,null,4,5"` | BFS | Fewer nulls (trailing removed) |
| **Optimized** | `"1,2,null,null,3,4,null,null,5,null,null"` | DFS | Same as preorder, but list-based |

### **Performance Analysis:**
- **Preorder/Optimized:** O(n) time, natural recursion
- **Level-order:** O(n) time, more space-efficient serialization
- **Deserialization:** All are O(n), but level-order requires careful index management

All three approaches successfully serialize and deserialize the tree while preserving its complete structure!
---

# **Construct BST from Preorder (1008)** 🌲

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Build BST from preorder traversal array
  
- What are inputs/outputs?
  → Input: Array representing preorder traversal of BST
  → Output: TreeNode (root of reconstructed BST)
  
- What are constraints?
  → Input is valid preorder of BST (BST property guaranteed)
  → Values are unique
  → Can assume input forms valid BST
  → No inorder array provided (leverage BST property)
```

## **C - CLARIFY**
```python
# Example: preorder = [8,5,1,7,10,12]
# 
# BST property: for each node, left < node < right
# First element (8) is root
# Elements < 8 go to left subtree: [5,1,7]  
# Elements > 8 go to right subtree: [10,12]
#
# Resulting BST:
#       8
#      / \
#     5  10
#    / \   \
#   1   7  12

# Key insight: BST property allows us to determine subtree boundaries
# without needing inorder traversal

# Edge cases:
# - Single element: [5] → TreeNode(5)
# - Empty array: [] → None
# - Linear BST: [1,2,3,4] → right-skewed tree
# - Reverse: [4,3,2,1] → left-skewed tree
```

## **A - ANALYZE PATTERN**
```
- Pattern: RECURSIVE CONSTRUCTION with BST property
- Key insight: Use BST property to split preorder into subtrees
- State: Current preorder subarray and valid value range
- Transitions: Split by first element, constrain ranges for subtrees
- Goal: Efficiently build BST using ordering property
```

## **P - PLAN**
```python
# Approach 1: Range-based construction
# For each subtree, track valid range [min_val, max_val]
# First element in range becomes root, split remaining elements

# Approach 2: Find split point
# For each root, find where left subtree ends (first element > root)
# Split array and recursively build subtrees

# Approach 3: Stack simulation
# Simulate BST insertion process using stack

# Time: O(n), Space: O(n)
```

## **R - REFACTOR**
```python
# Approach 1: Range-based (most efficient)
def bstFromPreorder(preorder):
    def build(min_val, max_val):
        nonlocal idx
        if idx >= len(preorder):
            return None
        
        val = preorder[idx]
        if val < min_val or val > max_val:
            return None
        
        idx += 1
        root = TreeNode(val)
        
        # Left subtree: values must be < val
        root.left = build(min_val, val)
        # Right subtree: values must be > val  
        root.right = build(val, max_val)
        
        return root
    
    idx = 0
    return build(float('-inf'), float('inf'))

# Approach 2: Split point finding
def bstFromPreorderSplit(preorder):
    if not preorder:
        return None
    
    root = TreeNode(preorder[0])
    
    # Find split point: first element > root.val
    i = 1
    while i < len(preorder) and preorder[i] < preorder[0]:
        i += 1
    
    # Build subtrees
    root.left = bstFromPreorderSplit(preorder[1:i])
    root.right = bstFromPreorderSplit(preorder[i:])
    
    return root

# Approach 3: Stack simulation (mimics insertion)
def bstFromPreorderStack(preorder):
    if not preorder:
        return None
    
    root = TreeNode(preorder[0])
    stack = [root]
    
    for i in range(1, len(preorder)):
        node = TreeNode(preorder[i])
        
        if node.val < stack[-1].val:
            # Goes to left
            stack[-1].left = node
        else:
            # Goes to right - find correct parent
            parent = None
            while stack and stack[-1].val < node.val:
                parent = stack.pop()
            parent.right = node
        
        stack.append(node)
    
    return root

# Clean range-based with class
class Solution:
    def bstFromPreorder(self, preorder):
        self.idx = 0
        
        def build(min_val, max_val):
            if self.idx >= len(preorder):
                return None
            
            val = preorder[self.idx]
            if val < min_val or val > max_val:
                return None
            
            self.idx += 1
            root = TreeNode(val)
            root.left = build(min_val, val)
            root.right = build(val, max_val)
            return root
        
        return build(float('-inf'), float('inf'))
```

## **T - TEST**
```python
# Test: preorder = [8,5,1,7,10,12]

# build(-∞, ∞):
#   val = 8, idx = 1, root = TreeNode(8)
#   left = build(-∞, 8):
#     val = 5, idx = 2, root = TreeNode(5)  
#     left = build(-∞, 5):
#       val = 1, idx = 3, root = TreeNode(1)
#       left = build(-∞, 1): val = 7 > 1, return None
#       right = build(1, 5): val = 7 > 5, return None
#       returns TreeNode(1)
#     right = build(5, 8):
#       val = 7, idx = 4, root = TreeNode(7)
#       left/right = build(5,7)/build(7,8): val = 10 > 8, return None
#       returns TreeNode(7)
#     returns TreeNode(5) with children 1, 7
#   right = build(8, ∞):
#     val = 10, idx = 5, root = TreeNode(10)
#     left = build(8, 10): val = 12 > 10, return None
#     right = build(10, ∞): val = 12, creates TreeNode(12)
#     returns TreeNode(10) with right child 12
#   returns TreeNode(8) with correct structure ✓
```

---

# **Construct Binary Tree from String (536)** 📝

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Parse string representation to build binary tree
  
- What are inputs/outputs?
  → Input: String in format "4(2(3)(1))(6(5))"
  → Output: TreeNode (root of parsed tree)
  
- What are constraints?
  → Format: node_value(left_subtree)(right_subtree)
  → Parentheses indicate subtrees
  → Empty parentheses "()" represent null nodes
  → Numbers can be negative
  → No spaces in input
```

## **C - CLARIFY**
```python
# Example: s = "4(2(3)(1))(6(5))"
# 
# Parsing:
# 4 - root value
# (2(3)(1)) - left subtree with root 2
#   2 - subtree root  
#   (3) - left child 3
#   (1) - right child 1
# (6(5)) - right subtree with root 6
#   6 - subtree root
#   (5) - left child 5
#   () - right child null (implicit)
#
# Resulting tree:
#       4
#      / \
#     2   6
#    / \ /
#   3  1 5

# More examples:
# "4(2(3)(1))(6(5)())" - explicit right null for 6
# "-4(2(3)(1))(6(5))" - negative root value
# "1(2)(3)" - simple tree with two children

# Edge cases:
# - "4" - single node
# - "" - empty string  
# - "4()()" - root with null children
# - "4(2)" - root with only left child
```

## **A - ANALYZE PATTERN**
```
- Pattern: RECURSIVE PARSING with stack/recursive descent
- Key insight: Parse number, then recursively parse subtrees in parentheses
- State: Current position in string, current subtree being parsed
- Transitions: Parse value, then parse left/right subtrees
- Goal: Convert string representation to tree structure
```

## **P - PLAN**
```python
# Approach 1: Recursive descent parsing
# 1. Parse current node value (handle negative numbers)
# 2. If '(' follows, recursively parse left subtree
# 3. If another '(' follows, recursively parse right subtree
# 4. Handle empty parentheses as null nodes

# Approach 2: Stack-based parsing
# Use stack to track parent nodes, build tree bottom-up

# Time: O(n), Space: O(h) where h is tree height
```

## **R - REFACTOR**
```python
# Approach 1: Recursive descent
def str2tree(s):
    def parse():
        nonlocal index
        if index >= len(s):
            return None
        
        # Parse number (handle negative)
        start = index
        if s[index] == '-':
            index += 1
        while index < len(s) and s[index].isdigit():
            index += 1
        
        num = int(s[start:index])
        node = TreeNode(num)
        
        # Parse left subtree
        if index < len(s) and s[index] == '(':
            index += 1  # skip '('
            node.left = parse()
            index += 1  # skip ')'
        
        # Parse right subtree  
        if index < len(s) and s[index] == '(':
            index += 1  # skip '('
            node.right = parse()
            index += 1  # skip ')'
        
        return node
    
    if not s:
        return None
    
    index = 0
    return parse()

# Approach 2: Stack-based
def str2treeStack(s):
    if not s:
        return None
    
    stack = []
    i = 0
    
    while i < len(s):
        if s[i] == ')':
            stack.pop()
        elif s[i].isdigit() or s[i] == '-':
            # Parse number
            start = i
            if s[i] == '-':
                i += 1
            while i < len(s) and s[i].isdigit():
                i += 1
            
            num = int(s[start:i])
            node = TreeNode(num)
            
            if stack:
                if not stack[-1].left:
                    stack[-1].left = node
                else:
                    stack[-1].right = node
            
            stack.append(node)
            i -= 1  # Adjust for increment at end of loop
        
        i += 1
    
    return stack[0] if stack else None

# Approach 3: Clean recursive with helper
class Solution:
    def str2tree(self, s):
        self.index = 0
        return self.parse(s)
    
    def parse(self, s):
        if self.index >= len(s):
            return None
        
        # Parse number
        start = self.index
        if s[self.index] == '-':
            self.index += 1
        while self.index < len(s) and s[self.index].isdigit():
            self.index += 1
        
        if start == self.index:  # No number found
            return None
        
        num = int(s[start:self.index])
        node = TreeNode(num)
        
        # Parse left child
        if self.index < len(s) and s[self.index] == '(':
            self.index += 1  # skip '('
            node.left = self.parse(s)
            self.index += 1  # skip ')'
        
        # Parse right child
        if self.index < len(s) and s[self.index] == '(':
            self.index += 1  # skip '('  
            node.right = self.parse(s)
            self.index += 1  # skip ')'
        
        return node
```

## **T - TEST**
```python
# Test: s = "4(2(3)(1))(6(5))"

# parse() at index 0:
#   Parse "4": num = 4, node = TreeNode(4), index = 1
#   s[1] = '(': parse left subtree
#     index = 2, parse "2": node = TreeNode(2), index = 3  
#     s[3] = '(': parse left subtree
#       index = 4, parse "3": node = TreeNode(3), index = 5
#       s[5] = ')': no more children, return TreeNode(3)
#     index = 6, s[6] = '(': parse right subtree
#       index = 7, parse "1": node = TreeNode(1), index = 8
#       s[8] = ')': return TreeNode(1)
#     index = 9, s[9] = ')': return TreeNode(2) with children 3,1
#   index = 10, s[10] = '(': parse right subtree
#     Similar process for "6(5)"
#   Return TreeNode(4) with correct structure ✓
```
I'll walk you through all three approaches for constructing a binary tree from string representation using a concrete example.

## Example Input:
```python
s = "4(2(3)(1))(6(5))"
```

**Target Tree:**
```
    4
   / \
  2   6
 / \ /
3  1 5
```

---

## **Approach 1: Recursive Parsing**

### **Initial Setup:**
```python
s = "4(2(3)(1))(6(5))"
index = 0
# Call parse()
```

### **Step-by-Step Execution:**

#### **Call 1: parse() - Root node**
```python
# index = 0, s[0] = '4'
start = 0
# s[0] = '4' is digit, so index = 1
num = int(s[0:1]) = 4
node = TreeNode(4)

# index = 1, s[1] = '(' → parse left subtree
index = 2  # skip '('
node.left = parse()  # Call 2

# After left subtree, index will be at ')' 
index += 1  # skip ')'

# Check for right subtree: s[index] = '(' → parse right subtree  
index += 1  # skip '('
node.right = parse()  # Call 6
index += 1  # skip ')'

return TreeNode(4)
```

#### **Call 2: parse() - Left subtree of 4**
```python
# index = 2, s[2] = '2'
start = 2
# s[2] = '2' is digit, so index = 3
num = int(s[2:3]) = 2
node = TreeNode(2)

# index = 3, s[3] = '(' → parse left subtree
index = 4  # skip '('
node.left = parse()  # Call 3

# After left subtree, index will be at ')'
index += 1  # skip ')'

# index now at '(', s[index] = '(' → parse right subtree
index += 1  # skip '('
node.right = parse()  # Call 4
index += 1  # skip ')'

return TreeNode(2)
```

#### **Call 3: parse() - Left subtree of 2**
```python
# index = 4, s[4] = '3'
start = 4
# s[4] = '3' is digit, so index = 5
num = int(s[4:5]) = 3
node = TreeNode(3)

# index = 5, s[5] = ')' → no left subtree
# index = 5, s[5] = ')' → no right subtree

return TreeNode(3)
```

**Back to Call 2:** index = 6 (after skipping ')')

#### **Call 4: parse() - Right subtree of 2**
```python
# index = 7, s[7] = '1'
start = 7
# s[7] = '1' is digit, so index = 8
num = int(s[7:8]) = 1
node = TreeNode(1)

# index = 8, s[8] = ')' → no left subtree
# index = 8, s[8] = ')' → no right subtree

return TreeNode(1)
```

**Back to Call 2:** TreeNode(2) with left=3, right=1, index = 9

**Back to Call 1:** index = 10 (after skipping ')')

#### **Call 6: parse() - Right subtree of 4**
```python
# index = 11, s[11] = '6'
start = 11
# s[11] = '6' is digit, so index = 12
num = int(s[11:12]) = 6
node = TreeNode(6)

# index = 12, s[12] = '(' → parse left subtree
index = 13  # skip '('
node.left = parse()  # Call 7

# After left subtree
index += 1  # skip ')'

# index now at end, no right subtree

return TreeNode(6)
```

#### **Call 7: parse() - Left subtree of 6**
```python
# index = 13, s[13] = '5'  
start = 13
# s[13] = '5' is digit, so index = 14
num = int(s[13:14]) = 5
node = TreeNode(5)

# index = 14, s[14] = ')' → no left subtree
# index = 14, s[14] = ')' → no right subtree

return TreeNode(5)
```

**Final Tree Constructed Successfully!**

---

## **Approach 2: Stack-Based**

### **Step-by-Step Execution:**

#### **Initial Setup:**
```python
s = "4(2(3)(1))(6(5))"
stack = []
i = 0
```

#### **i = 0: Process '4'**
```python
# s[0] = '4' is digit
start = 0, i = 1
num = int(s[0:1]) = 4
node = TreeNode(4)

# stack is empty, so no parent to attach to
stack.append(TreeNode(4))  # stack = [4]
i = 0  # adjust for increment (i becomes 1 after loop increment)
```

#### **i = 1: Process '('**
```python
# s[1] = '(' is not ')' or digit, skip
# i = 2
```

#### **i = 2: Process '2'**
```python
# s[2] = '2' is digit
start = 2, i = 3
num = int(s[2:3]) = 2
node = TreeNode(2)

# stack = [4], stack[-1].left is None
stack[-1].left = TreeNode(2)  # 4.left = 2
stack.append(TreeNode(2))     # stack = [4, 2]
i = 2  # adjust for increment (i becomes 3 after loop increment)
```

**Tree state:**
```
4
/
2
```

#### **i = 3: Process '('**
```python
# s[3] = '(' is not ')' or digit, skip
# i = 4
```

#### **i = 4: Process '3'**
```python
# s[4] = '3' is digit
start = 4, i = 5
num = int(s[4:5]) = 3
node = TreeNode(3)

# stack = [4, 2], stack[-1].left is None
stack[-1].left = TreeNode(3)  # 2.left = 3
stack.append(TreeNode(3))     # stack = [4, 2, 3]
i = 4  # adjust for increment
```

**Tree state:**
```
4
/
2
/
3
```

#### **i = 5: Process ')'**
```python
# s[5] = ')' 
stack.pop()  # Remove 3, stack = [4, 2]
# i = 6
```

#### **i = 6: Process '('**
```python
# s[6] = '(' is not ')' or digit, skip
# i = 7
```

#### **i = 7: Process '1'**
```python
# s[7] = '1' is digit
start = 7, i = 8
num = int(s[7:8]) = 1
node = TreeNode(1)

# stack = [4, 2], stack[-1].left = 3 (not None)
# so stack[-1].right = TreeNode(1)  # 2.right = 1
stack.append(TreeNode(1))  # stack = [4, 2, 1]
i = 7  # adjust for increment
```

**Tree state:**
```
4
/
2
/ \
3   1
```

#### **i = 8: Process ')'**
```python
# s[8] = ')'
stack.pop()  # Remove 1, stack = [4, 2]
# i = 9
```

#### **i = 9: Process ')'**
```python
# s[9] = ')'
stack.pop()  # Remove 2, stack = [4]
# i = 10
```

#### **i = 10: Process '('**
```python
# s[10] = '(' is not ')' or digit, skip
# i = 11
```

#### **i = 11: Process '6'**
```python
# s[11] = '6' is digit
start = 11, i = 12
num = int(s[11:12]) = 6
node = TreeNode(6)

# stack = [4], stack[-1].left = 2 (not None)
# so stack[-1].right = TreeNode(6)  # 4.right = 6
stack.append(TreeNode(6))  # stack = [4, 6]
i = 11  # adjust for increment
```

**Tree state:**
```
  4
 / \
2   6
/ \
3   1
```

#### **i = 12: Process '('**
```python
# s[12] = '(' is not ')' or digit, skip
# i = 13
```

#### **i = 13: Process '5'**
```python
# s[13] = '5' is digit
start = 13, i = 14
num = int(s[13:14]) = 5
node = TreeNode(5)

# stack = [4, 6], stack[-1].left is None
stack[-1].left = TreeNode(5)  # 6.left = 5
stack.append(TreeNode(5))     # stack = [4, 6, 5]
i = 13  # adjust for increment
```

**Tree state:**
```
    4
   / \
  2   6
 / \ /
3  1 5
```

#### **i = 14: Process ')'**
```python
# s[14] = ')'
stack.pop()  # Remove 5, stack = [4, 6]
# i = 15
```

#### **i = 15: Process ')'**
```python
# s[15] = ')'
stack.pop()  # Remove 6, stack = [4]
# i = 16
```

#### **End of string:**
```python
return stack[0]  # Return TreeNode(4) - the root
```

**Final Tree Constructed Successfully!**

---

## **Approach 3: Class-Based Recursive (Same as Approach 1)**

### **Execution:**
```python
class Solution:
    def str2tree(self, s):
        self.index = 0  # Instance variable instead of nonlocal
        return self.parse(s)
```

The execution is identical to Approach 1, just using `self.index` instead of a nonlocal variable.

---

## **String Parsing Breakdown:**

### **String Structure Analysis:**
```
"4(2(3)(1))(6(5))"
 │ │ │  │   │ │
 │ │ │  │   │ └─ 5 (left child of 6)
 │ │ │  │   └─── 6 (right child of 4)  
 │ │ │  └─────── 1 (right child of 2)
 │ │ └────────── 3 (left child of 2)
 │ └─────────── 2 (left child of 4)
 └─────────── 4 (root)
```

### **Parsing Rules:**
1. **Number:** Create TreeNode with that value
2. **First '(' after number:** Indicates left subtree
3. **Second '(' after number:** Indicates right subtree  
4. **')':** End of current subtree

### **Performance Comparison:**

| Approach | Time Complexity | Space Complexity | Key Advantage |
|----------|----------------|------------------|---------------|
| **Recursive** | O(n) | O(h) | Clean and intuitive |
| **Stack-Based** | O(n) | O(h) | Iterative, no recursion |
| **Class-Based** | O(n) | O(h) | Clean OOP design |

### **Key Insights:**

1. **Parentheses determine structure:** Each '(' starts a subtree, each ')' ends it
2. **Order matters:** First subtree is left, second is right
3. **Stack approach:** Maintains parent-child relationships explicitly
4. **Recursive approach:** Uses call stack for the same relationships

All three approaches successfully parse the string representation and construct the correct binary tree structure!
---

# **Tree Construction Pattern Recognition** 🏗️

## **Common Characteristics:**
1. **Input Format Analysis**: Understanding how structure is encoded
2. **Recursive Decomposition**: Breaking into smaller subproblems
3. **Property Utilization**: Leveraging traversal orders, BST properties, etc.
4. **Parsing Techniques**: Handling string formats, delimiters, special cases

## **Template Recognition:**
```python
# Universal Tree Construction Template
def construct_tree(input_data):
    def build(constraints):
        # Base case
        if stopping_condition:
            return None
        
        # Extract root information
        root_info = extract_root(input_data, constraints)
        root = TreeNode(root_info)
        
        # Determine subtree boundaries/constraints
        left_constraints = determine_left_constraints(root_info, constraints)
        right_constraints = determine_right_constraints(root_info, constraints)
        
        # Recursively build subtrees
        root.left = build(left_constraints)
        root.right = build(right_constraints)
        
        return root
    
    return build(initial_constraints)
```

## **When to Use Each Approach:** 🎯
- **Traversal Arrays**: Use divide-and-conquer with array splitting
- **Serialization**: Choose format based on space/time requirements
- **BST Construction**: Leverage ordering property for efficiency
- **String Parsing**: Use recursive descent or stack-based parsing

**Tree construction problems require understanding how structural information is encoded and systematically reconstructing the hierarchy!** 🚀

# UCARPT - Encode and Decode
#interview/DSA/Tree
# Tree Serialization and Comparison Problems - UCAPRT Framework Analysis

## 1. Serialize and Deserialize Binary Tree (297)

### **U**nderstand
- **Problem**: Design algorithm to serialize binary tree to string and deserialize string back to tree
- **Input**: TreeNode root for serialization, string data for deserialization
- **Output**: String for serialization, TreeNode for deserialization
- **Constraints**: Must handle any binary tree structure, including null nodes

### **C**larify
```python
# Example: [1,2,3,null,null,4,5]
#     1
#    / \
#   2   3
#      / \
#     4   5
# Serialized: "1,2,null,null,3,4,null,null,5,null,null"
# Must be able to reconstruct exact same tree
```

### **A**nalyze Pattern
- **Pattern**: Tree traversal with encoding/decoding
- **Key Insight**: Need to preserve tree structure including null nodes
- **Approaches**: 
  1. **Preorder DFS**: Most intuitive, encodes structure naturally
  2. **Level-order BFS**: Alternative approach
  3. **Bracket notation**: Recursive structure representation

### **P**lan & Implementation

#### **Approach 1: Preorder DFS (Most Common)**
```python
class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string."""
        def preorder(node):
            if not node:
                vals.append("null")
                return
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
        return build()

# Time: O(n), Space: O(n)
```

#### **Approach 2: Level-order BFS**
```python
class Codec:
    def serialize(self, root):
        if not root:
            return ""
        
        result = []
        queue = [root]
        
        while queue:
            node = queue.pop(0)
            if node:
                result.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append("null")
        
        return ','.join(result)
    
    def deserialize(self, data):
        if not data:
            return None
        
        vals = data.split(',')
        root = TreeNode(int(vals[0]))
        queue = [root]
        i = 1
        
        while queue and i < len(vals):
            node = queue.pop(0)
            
            if vals[i] != "null":
                node.left = TreeNode(int(vals[i]))
                queue.append(node.left)
            i += 1
            
            if i < len(vals) and vals[i] != "null":
                node.right = TreeNode(int(vals[i]))
                queue.append(node.right)
            i += 1
        
        return root
```

#### **Approach 3: Bracket Notation (Elegant)**
```python
class Codec:
    def serialize(self, root):
        if not root:
            return ""
        
        left = self.serialize(root.left)
        right = self.serialize(root.right)
        
        # Only include brackets if children exist
        if not left and not right:
            return str(root.val)
        return f"{root.val}({left})({right})"
    
    def deserialize(self, data):
        if not data:
            return None
        
        def parse():
            nonlocal index
            if index >= len(data):
                return None
            
            # Parse number
            start = index
            if data[index] == '-':
                index += 1
            while index < len(data) and data[index].isdigit():
                index += 1
            
            val = int(data[start:index])
            node = TreeNode(val)
            
            # Parse left child
            if index < len(data) and data[index] == '(':
                index += 1  # skip '('
                node.left = parse()
                index += 1  # skip ')'
            
            # Parse right child
            if index < len(data) and data[index] == '(':
                index += 1  # skip '('
                node.right = parse()
                index += 1  # skip ')'
            
            return node
        
        index = 0
        return parse()
```

### **R**efactor & **T**est
**Best Solution: Preorder DFS**
```python
class Codec:
    def serialize(self, root):
        def dfs(node):
            if not node:
                vals.append("#")
                return
            vals.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        
        vals = []
        dfs(root)
        return ','.join(vals)
    
    def deserialize(self, data):
        def build():
            val = next(vals)
            if val == "#":
                return None
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        
        vals = iter(data.split(','))
        return build()

# Time: O(n), Space: O(n)
```
I'll trace through the Serialize and Deserialize Binary Tree algorithm using your example in nested format.

## Example Tree: [1,2,3,null,null,4,5]

```
     1
    / \
   2   3
      / \
     4   5
```

---

## **SERIALIZE Process**: Tree → String

```
🌟 serialize(root)
    └─ vals = []
    └─ preorder(1) [root]
        ├─ vals.append("1") → vals = ["1"]
        │
        ├─ 🔍 LEFT: preorder(2)
        │   ├─ vals.append("2") → vals = ["1", "2"]
        │   │
        │   ├─ 🔍 LEFT: preorder(null)
        │   │   ├─ vals.append("null") → vals = ["1", "2", "null"]
        │   │   └─ return
        │   │
        │   ├─ 🔍 RIGHT: preorder(null)
        │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null"]
        │   │   └─ return
        │   │
        │   └─ return
        │
        ├─ 🔍 RIGHT: preorder(3)
        │   ├─ vals.append("3") → vals = ["1", "2", "null", "null", "3"]
        │   │
        │   ├─ 🔍 LEFT: preorder(4)
        │   │   ├─ vals.append("4") → vals = ["1", "2", "null", "null", "3", "4"]
        │   │   │
        │   │   ├─ 🔍 LEFT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   ├─ 🔍 RIGHT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   └─ return
        │   │
        │   ├─ 🔍 RIGHT: preorder(5)
        │   │   ├─ vals.append("5") → vals = ["1", "2", "null", "null", "3", "4", "null", "null", "5"]
        │   │   │
        │   │   ├─ 🔍 LEFT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null", "null", "5", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   ├─ 🔍 RIGHT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null", "null", "5", "null", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   └─ return
        │   │
        │   └─ return
        │
        └─ return

    └─ return ','.join(vals) = "1,2,null,null,3,4,null,null,5,null,null"

🎯 SERIALIZED STRING: "1,2,null,null,3,4,null,null,5,null,null"
```

---

## **DESERIALIZE Process**: String → Tree

```
🌟 deserialize("1,2,null,null,3,4,null,null,5,null,null")
    └─ vals = iter(["1", "2", "null", "null", "3", "4", "null", "null", "5", "null", "null"])
    └─ build()
        ├─ val = next(vals) = "1"
        ├─ val ≠ "null" → create TreeNode(1)
        │
        ├─ 🔍 LEFT: build()
        │   ├─ val = next(vals) = "2"
        │   ├─ val ≠ "null" → create TreeNode(2)
        │   │
        │   ├─ 🔍 LEFT: build()
        │   │   ├─ val = next(vals) = "null"
        │   │   └─ return None
        │   │
        │   ├─ 🔍 RIGHT: build()
        │   │   ├─ val = next(vals) = "null"
        │   │   └─ return None
        │   │
        │   ├─ node.left = None, node.right = None
        │   └─ return TreeNode(2)
        │
        ├─ 🔍 RIGHT: build()
        │   ├─ val = next(vals) = "3"
        │   ├─ val ≠ "null" → create TreeNode(3)
        │   │
        │   ├─ 🔍 LEFT: build()
        │   │   ├─ val = next(vals) = "4"
        │   │   ├─ val ≠ "null" → create TreeNode(4)
        │   │   │
        │   │   ├─ 🔍 LEFT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ 🔍 RIGHT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ node.left = None, node.right = None
        │   │   └─ return TreeNode(4)
        │   │
        │   ├─ 🔍 RIGHT: build()
        │   │   ├─ val = next(vals) = "5"
        │   │   ├─ val ≠ "null" → create TreeNode(5)
        │   │   │
        │   │   ├─ 🔍 LEFT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ 🔍 RIGHT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ node.left = None, node.right = None
        │   │   └─ return TreeNode(5)
        │   │
        │   ├─ node.left = TreeNode(4), node.right = TreeNode(5)
        │   └─ return TreeNode(3)
        │
        ├─ node.left = TreeNode(2), node.right = TreeNode(3)
        └─ return TreeNode(1)

🎯 RECONSTRUCTED TREE:
     1
    / \
   2   3
      / \
     4   5
```

## Key Insights from Nested Execution:

### **Serialize Process:**
1. **Preorder traversal**: Root → Left → Right
2. **Null handling**: Every missing child becomes "null" in output
3. **Complete representation**: Every position in tree is encoded

### **Deserialize Process:**
1. **Iterator pattern**: `next(vals)` consumes values in sequence
2. **Recursive structure**: Same preorder pattern as serialize
3. **Null termination**: "null" values stop recursion branch

### **Serialization Order:**
```
Position:  Root  L    LL   LR   R    RL   RLL  RLR  RR   RRL  RRR
Value:     1     2    null null 3    4    null null 5    null null
```

### **Key Algorithm Properties:**

**Serialize:**
- **Complete encoding**: Every tree position represented
- **Unambiguous**: No two different trees produce same string
- **Efficient**: Single DFS traversal

**Deserialize:**
- **Streaming**: Processes values in sequence without lookahead
- **Recursive**: Mirrors serialize structure exactly
- **Robust**: Handles any valid serialized string

### **Why This Works:**
1. **Preorder consistency**: Both serialize and deserialize use same traversal order
2. **Null preservation**: Structure maintained by encoding missing nodes
3. **Iterator magic**: `next()` automatically advances position for recursive calls

The algorithm elegantly preserves complete tree structure through synchronized preorder processing! 

**Alternative visualization of the process:**
```
Serialize:  Tree → [1,2,null,null,3,4,null,null,5,null,null]
Deserialize: [1,2,null,null,3,4,null,null,5,null,null] → Tree
```

Both processes are perfect mirrors of each other! 🪞
---

## 2. Serialize and Deserialize BST (449)

### **U**nderstand
- **Problem**: Serialize/deserialize BST with space optimization
- **Input**: TreeNode root (BST) for serialization, string data for deserialization
- **Output**: Optimized string representation
- **Constraints**: Must leverage BST properties for efficiency

### **C**larify
```python
# Example BST: [2,1,3]
#   2
#  / \
# 1   3
# Regular serialization: "2,1,null,null,3,null,null"
# BST optimized: "2,1,3" (no nulls needed due to BST property)
```

### **A**nalyze Pattern
- **Pattern**: BST property exploitation + Tree traversal
- **Key Insight**: BST property allows reconstruction without null markers
- **Optimization**: Use preorder traversal + BST bounds to eliminate nulls

### **P**lan & Implementation

#### **Approach 1: Preorder with Bounds (Optimal)**
```python
class Codec:
    def serialize(self, root):
        def preorder(node):
            if not node:
                return
            vals.append(str(node.val))
            preorder(node.left)
            preorder(node.right)
        
        vals = []
        preorder(root)
        return ','.join(vals)
    
    def deserialize(self, data):
        if not data:
            return None
        
        def build(min_val, max_val):
            nonlocal index
            if index >= len(vals):
                return None
            
            val = int(vals[index])
            if val < min_val or val > max_val:
                return None
            
            index += 1
            node = TreeNode(val)
            node.left = build(min_val, val)
            node.right = build(val, max_val)
            return node
        
        vals = data.split(',')
        index = 0
        return build(float('-inf'), float('inf'))

# Time: O(n), Space: O(n)
```

#### **Approach 2: Inorder + Preorder (Alternative)**
```python
class Codec:
    def serialize(self, root):
        def inorder(node):
            if node:
                inorder(node.left)
                in_vals.append(node.val)
                inorder(node.right)
        
        def preorder(node):
            if node:
                pre_vals.append(node.val)
                preorder(node.left)
                preorder(node.right)
        
        in_vals, pre_vals = [], []
        inorder(root)
        preorder(root)
        return ','.join(map(str, pre_vals))  # Only need preorder for BST
    
    def deserialize(self, data):
        if not data:
            return None
        
        preorder = list(map(int, data.split(',')))
        inorder = sorted(preorder)  # BST inorder is sorted
        
        def build(pre_start, pre_end, in_start, in_end):
            if pre_start > pre_end:
                return None
            
            root_val = preorder[pre_start]
            root = TreeNode(root_val)
            
            # Find root position in inorder
            root_idx = inorder.index(root_val)
            left_size = root_idx - in_start
            
            root.left = build(pre_start + 1, pre_start + left_size, 
                            in_start, root_idx - 1)
            root.right = build(pre_start + left_size + 1, pre_end, 
                             root_idx + 1, in_end)
            
            return root
        
        return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

### **R**efactor & **T**est
**Optimal Solution: Preorder with Bounds**
```python
class Codec:
    def serialize(self, root):
        vals = []
        
        def dfs(node):
            if node:
                vals.append(str(node.val))
                dfs(node.left)
                dfs(node.right)
        
        dfs(root)
        return ','.join(vals)
    
    def deserialize(self, data):
        if not data:
            return None
        
        vals = list(map(int, data.split(',')))
        self.index = 0
        
        def build(min_val, max_val):
            if self.index >= len(vals):
                return None
            
            val = vals[self.index]
            if val < min_val or val > max_val:
                return None
            
            self.index += 1
            node = TreeNode(val)
            node.left = build(min_val, val)
            node.right = build(val, max_val)
            return node
        
        return build(float('-inf'), float('inf'))

# Time: O(n), Space: O(n) - More space efficient than general tree
```
I'll trace through the Serialize and Deserialize Binary Tree algorithm using your example in nested format.

## Example Tree: [1,2,3,null,null,4,5]

```
     1
    / \
   2   3
      / \
     4   5
```

---

## **SERIALIZE Process**: Tree → String

```
🌟 serialize(root)
    └─ vals = []
    └─ preorder(1) [root]
        ├─ vals.append("1") → vals = ["1"]
        │
        ├─ 🔍 LEFT: preorder(2)
        │   ├─ vals.append("2") → vals = ["1", "2"]
        │   │
        │   ├─ 🔍 LEFT: preorder(null)
        │   │   ├─ vals.append("null") → vals = ["1", "2", "null"]
        │   │   └─ return
        │   │
        │   ├─ 🔍 RIGHT: preorder(null)
        │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null"]
        │   │   └─ return
        │   │
        │   └─ return
        │
        ├─ 🔍 RIGHT: preorder(3)
        │   ├─ vals.append("3") → vals = ["1", "2", "null", "null", "3"]
        │   │
        │   ├─ 🔍 LEFT: preorder(4)
        │   │   ├─ vals.append("4") → vals = ["1", "2", "null", "null", "3", "4"]
        │   │   │
        │   │   ├─ 🔍 LEFT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   ├─ 🔍 RIGHT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   └─ return
        │   │
        │   ├─ 🔍 RIGHT: preorder(5)
        │   │   ├─ vals.append("5") → vals = ["1", "2", "null", "null", "3", "4", "null", "null", "5"]
        │   │   │
        │   │   ├─ 🔍 LEFT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null", "null", "5", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   ├─ 🔍 RIGHT: preorder(null)
        │   │   │   ├─ vals.append("null") → vals = ["1", "2", "null", "null", "3", "4", "null", "null", "5", "null", "null"]
        │   │   │   └─ return
        │   │   │
        │   │   └─ return
        │   │
        │   └─ return
        │
        └─ return

    └─ return ','.join(vals) = "1,2,null,null,3,4,null,null,5,null,null"

🎯 SERIALIZED STRING: "1,2,null,null,3,4,null,null,5,null,null"
```

---

## **DESERIALIZE Process**: String → Tree

```
🌟 deserialize("1,2,null,null,3,4,null,null,5,null,null")
    └─ vals = iter(["1", "2", "null", "null", "3", "4", "null", "null", "5", "null", "null"])
    └─ build()
        ├─ val = next(vals) = "1"
        ├─ val ≠ "null" → create TreeNode(1)
        │
        ├─ 🔍 LEFT: build()
        │   ├─ val = next(vals) = "2"
        │   ├─ val ≠ "null" → create TreeNode(2)
        │   │
        │   ├─ 🔍 LEFT: build()
        │   │   ├─ val = next(vals) = "null"
        │   │   └─ return None
        │   │
        │   ├─ 🔍 RIGHT: build()
        │   │   ├─ val = next(vals) = "null"
        │   │   └─ return None
        │   │
        │   ├─ node.left = None, node.right = None
        │   └─ return TreeNode(2)
        │
        ├─ 🔍 RIGHT: build()
        │   ├─ val = next(vals) = "3"
        │   ├─ val ≠ "null" → create TreeNode(3)
        │   │
        │   ├─ 🔍 LEFT: build()
        │   │   ├─ val = next(vals) = "4"
        │   │   ├─ val ≠ "null" → create TreeNode(4)
        │   │   │
        │   │   ├─ 🔍 LEFT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ 🔍 RIGHT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ node.left = None, node.right = None
        │   │   └─ return TreeNode(4)
        │   │
        │   ├─ 🔍 RIGHT: build()
        │   │   ├─ val = next(vals) = "5"
        │   │   ├─ val ≠ "null" → create TreeNode(5)
        │   │   │
        │   │   ├─ 🔍 LEFT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ 🔍 RIGHT: build()
        │   │   │   ├─ val = next(vals) = "null"
        │   │   │   └─ return None
        │   │   │
        │   │   ├─ node.left = None, node.right = None
        │   │   └─ return TreeNode(5)
        │   │
        │   ├─ node.left = TreeNode(4), node.right = TreeNode(5)
        │   └─ return TreeNode(3)
        │
        ├─ node.left = TreeNode(2), node.right = TreeNode(3)
        └─ return TreeNode(1)

🎯 RECONSTRUCTED TREE:
     1
    / \
   2   3
      / \
     4   5
```

## Key Insights from Nested Execution:

### **Serialize Process:**
1. **Preorder traversal**: Root → Left → Right
2. **Null handling**: Every missing child becomes "null" in output
3. **Complete representation**: Every position in tree is encoded

### **Deserialize Process:**
1. **Iterator pattern**: `next(vals)` consumes values in sequence
2. **Recursive structure**: Same preorder pattern as serialize
3. **Null termination**: "null" values stop recursion branch

### **Serialization Order:**
```
Position:  Root  L    LL   LR   R    RL   RLL  RLR  RR   RRL  RRR
Value:     1     2    null null 3    4    null null 5    null null
```

### **Key Algorithm Properties:**

**Serialize:**
- **Complete encoding**: Every tree position represented
- **Unambiguous**: No two different trees produce same string
- **Efficient**: Single DFS traversal

**Deserialize:**
- **Streaming**: Processes values in sequence without lookahead
- **Recursive**: Mirrors serialize structure exactly
- **Robust**: Handles any valid serialized string

### **Why This Works:**
1. **Preorder consistency**: Both serialize and deserialize use same traversal order
2. **Null preservation**: Structure maintained by encoding missing nodes
3. **Iterator magic**: `next()` automatically advances position for recursive calls

The algorithm elegantly preserves complete tree structure through synchronized preorder processing! 

**Alternative visualization of the process:**
```
Serialize:  Tree → [1,2,null,null,3,4,null,null,5,null,null]
Deserialize: [1,2,null,null,3,4,null,null,5,null,null] → Tree
```

Both processes are perfect mirrors of each other! 🪞
---

## 3. Find Duplicate Subtrees (652)

### **U**nderstand
- **Problem**: Find all duplicate subtrees in binary tree
- **Input**: TreeNode root
- **Output**: List[TreeNode] (roots of duplicate subtrees)
- **Constraints**: Return any node from each duplicate subtree group

### **C**larify
```python
# Example: [1,2,3,4,null,2,4,null,null,4]
#     1
#    / \
#   2   3
#  /   / \
# 4   2   4
#    /
#   4
# Duplicate subtrees: [2,4] and [2, 4] (both appear twice)
```

### **A**nalyze Pattern
- **Pattern**: Tree serialization + Hash map for duplicate detection
- **Key Insight**: Serialize each subtree to string, use HashMap to count occurrences
- **Approach**: Post-order traversal with subtree serialization

### **P**lan & Implementation

#### **Approach 1: Full Subtree Serialization**
```python
def findDuplicateSubtrees(self, root):
    def serialize(node):
        if not node:
            return "#"
        
        # Post-order: left, right, root
        left = serialize(node.left)
        right = serialize(node.right)
        subtree = f"{left},{right},{node.val}"
        
        # Count occurrences
        count[subtree] = count.get(subtree, 0) + 1
        
        # Add to result when we see it second time
        if count[subtree] == 2:
            result.append(node)
        
        return subtree
    
    count = {}
    result = []
    serialize(root)
    return result

# Time: O(n²) due to string operations, Space: O(n²)
```

#### **Approach 2: Optimized with Tuple Serialization**
```python
def findDuplicateSubtrees(self, root):
    def serialize(node):
        if not node:
            return None
        
        # Use tuple for better performance
        left = serialize(node.left)
        right = serialize(node.right)
        subtree = (left, right, node.val)
        
        count[subtree] = count.get(subtree, 0) + 1
        if count[subtree] == 2:
            result.append(node)
        
        return subtree
    
    count = {}
    result = []
    serialize(root)
    return result

# Time: O(n), Space: O(n) - Better due to tuple hashing
```

#### **Approach 3: Unique ID Assignment (Most Efficient)**
```python
def findDuplicateSubtrees(self, root):
    def serialize(node):
        if not node:
            return 0
        
        # Assign unique IDs to subtree patterns
        left_id = serialize(node.left)
        right_id = serialize(node.right)
        subtree = (left_id, right_id, node.val)
        
        if subtree not in tree_to_id:
            tree_to_id[subtree] = len(tree_to_id) + 1
        
        subtree_id = tree_to_id[subtree]
        count[subtree_id] = count.get(subtree_id, 0) + 1
        
        if count[subtree_id] == 2:
            result.append(node)
        
        return subtree_id
    
    tree_to_id = {}
    count = {}
    result = []
    serialize(root)
    return result

# Time: O(n), Space: O(n) - Most efficient
```

I'll trace through the Find Duplicate Subtrees algorithm using your example in nested format.

## Example Tree: [1,2,3,4,null,2,4,null,null,4]

```
     1
    / \
   2   3
  /   / \
 4   2   4
    /
   4
```

**Expected duplicates**: 
- Subtree [4] appears 3 times
- Subtree [2,4] appears 2 times

## Nested Execution Trace:

```
🌟 findDuplicateSubtrees(root)
    └─ count = {}, result = []
    └─ serialize(1) [root]
        ├─ 🔍 LEFT: serialize(2)
        │   ├─ 🔍 LEFT: serialize(4)
        │   │   ├─ 🔍 LEFT: serialize(null) → return None
        │   │   ├─ 🔍 RIGHT: serialize(null) → return None
        │   │   ├─ left = None, right = None
        │   │   ├─ subtree = (None, None, 4) 🌳
        │   │   ├─ count[(None, None, 4)] = 1 📊
        │   │   ├─ count = {(None, None, 4): 1}
        │   │   └─ return (None, None, 4)
        │   │
        │   ├─ 🔍 RIGHT: serialize(null) → return None
        │   ├─ left = (None, None, 4), right = None
        │   ├─ subtree = ((None, None, 4), None, 2) 🌳
        │   ├─ count[((None, None, 4), None, 2)] = 1 📊
        │   ├─ count = {(None, None, 4): 1, ((None, None, 4), None, 2): 1}
        │   └─ return ((None, None, 4), None, 2)
        │
        ├─ 🔍 RIGHT: serialize(3)
        │   ├─ 🔍 LEFT: serialize(2)
        │   │   ├─ 🔍 LEFT: serialize(4)
        │   │   │   ├─ 🔍 LEFT: serialize(null) → return None
        │   │   │   ├─ 🔍 RIGHT: serialize(null) → return None
        │   │   │   ├─ left = None, right = None
        │   │   │   ├─ subtree = (None, None, 4) 🌳
        │   │   │   ├─ count[(None, None, 4)] = 1 + 1 = 2 📊
        │   │   │   ├─ count[(None, None, 4)] == 2 ✅ DUPLICATE FOUND!
        │   │   │   ├─ result.append(TreeNode(4)) → result = [TreeNode(4)]
        │   │   │   └─ return (None, None, 4)
        │   │   │
        │   │   ├─ 🔍 RIGHT: serialize(null) → return None
        │   │   ├─ left = (None, None, 4), right = None
        │   │   ├─ subtree = ((None, None, 4), None, 2) 🌳
        │   │   ├─ count[((None, None, 4), None, 2)] = 1 + 1 = 2 📊
        │   │   ├─ count[((None, None, 4), None, 2)] == 2 ✅ DUPLICATE FOUND!
        │   │   ├─ result.append(TreeNode(2)) → result = [TreeNode(4), TreeNode(2)]
        │   │   └─ return ((None, None, 4), None, 2)
        │   │
        │   ├─ 🔍 RIGHT: serialize(4)
        │   │   ├─ 🔍 LEFT: serialize(null) → return None
        │   │   ├─ 🔍 RIGHT: serialize(null) → return None
        │   │   ├─ left = None, right = None
        │   │   ├─ subtree = (None, None, 4) 🌳
        │   │   ├─ count[(None, None, 4)] = 2 + 1 = 3 📊
        │   │   ├─ count[(None, None, 4)] ≠ 2 (already found)
        │   │   └─ return (None, None, 4)
        │   │
        │   ├─ left = ((None, None, 4), None, 2), right = (None, None, 4)
        │   ├─ subtree = (((None, None, 4), None, 2), (None, None, 4), 3) 🌳
        │   ├─ count[(((None, None, 4), None, 2), (None, None, 4), 3)] = 1 📊
        │   └─ return (((None, None, 4), None, 2), (None, None, 4), 3)
        │
        ├─ left = ((None, None, 4), None, 2), right = (((None, None, 4), None, 2), (None, None, 4), 3)
        ├─ subtree = (((None, None, 4), None, 2), (((None, None, 4), None, 2), (None, None, 4), 3), 1) 🌳
        ├─ count[...] = 1 📊 (root subtree is unique)
        └─ return (((None, None, 4), None, 2), (((None, None, 4), None, 2), (None, None, 4), 3), 1)

🎯 FINAL RESULT: [TreeNode(4), TreeNode(2)] representing subtrees [4] and [2,4]
```

## Final Count Map State:

```
count = {
    (None, None, 4): 3,                                    # Leaf node 4 appears 3 times
    ((None, None, 4), None, 2): 2,                        # Subtree [2,4] appears 2 times
    (((None, None, 4), None, 2), (None, None, 4), 3): 1, # Subtree [3,2,4] appears 1 time
    (((None, None, 4), None, 2), (((None, None, 4), None, 2), (None, None, 4), 3), 1): 1  # Root subtree appears 1 time
}
```

## Key Insights from Nested Execution:

### **Tuple Structure Understanding:**
- **Leaf node 4**: `(None, None, 4)` = (left_child, right_child, value)
- **Subtree [2,4]**: `((None, None, 4), None, 2)` = (left_subtree, right_subtree, value)
- **Complex subtree**: Nested tuples representing entire subtree structure

### **Duplicate Detection Process:**
1. **First occurrence**: `count[subtree] = 1` (recorded)
2. **Second occurrence**: `count[subtree] = 2` ✅ (duplicate found, add to result)
3. **Subsequent occurrences**: `count[subtree] > 2` (already recorded, skip)

### **Post-order Traversal Benefits:**
- **Bottom-up processing**: Leaf duplicates found before parent duplicates
- **Complete subtree info**: Each node processes after children are serialized
- **Efficient hashing**: Tuple structure enables fast comparison

### **Subtree Serialization:**
```
Node 4 (leaf):     (None, None, 4)
Node 2 with child: ((None, None, 4), None, 2)
Node 3 with children: (((None, None, 4), None, 2), (None, None, 4), 3)
```

### **Duplicate Identification Timeline:**
```
Step 1: First leaf 4 → count = 1
Step 2: First subtree [2,4] → count = 1  
Step 3: Second leaf 4 → count = 2 ✅ DUPLICATE!
Step 4: Second subtree [2,4] → count = 2 ✅ DUPLICATE!
Step 5: Third leaf 4 → count = 3 (already found)
```

### **Algorithm Advantages:**
1. **Efficient hashing**: Tuple structure enables O(1) lookup
2. **Exact matching**: Structural comparison via tuple equality
3. **Memory efficient**: No string concatenation overhead
4. **Single pass**: O(n) time complexity

The algorithm elegantly identifies both duplicate subtrees: the single node `[4]` and the two-node subtree `[2,4]`! 🌳🔍
---

## **Pattern Summary & Key Insights**

### **Common Patterns**
1. **Tree Serialization**: Convert tree structure to string representation
2. **Structure Preservation**: Maintain enough information to reconstruct exactly
3. **Optimization Opportunities**: Leverage tree properties (BST, etc.)
4. **Hash-based Comparison**: Use serialization for structural comparison

### **Serialization Strategies**
```python
# Pattern 1: Preorder with Nulls (General trees)
def serialize_general(node):
    if not node: return "#"
    return f"{node.val},{serialize_general(node.left)},{serialize_general(node.right)}"

# Pattern 2: BST Preorder (No nulls needed)
def serialize_bst(node):
    if not node: return ""
    return f"{node.val},{serialize_bst(node.left)},{serialize_bst(node.right)}"

# Pattern 3: Subtree Hashing (Duplicate detection)
def hash_subtree(node):
    if not node: return 0
    return hash((hash_subtree(node.left), hash_subtree(node.right), node.val))
```

### **Deserialization Strategies**
```python
# Pattern 1: Iterator-based (Clean state management)
def deserialize_preorder(data):
    vals = iter(data.split(','))
    def build():
        val = next(vals)
        if val == "#": return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node
    return build()

# Pattern 2: Bounds-based (BST optimization)
def deserialize_bst(data):
    vals = data.split(',')
    index = 0
    def build(min_val, max_val):
        nonlocal index
        if index >= len(vals): return None
        val = int(vals[index])
        if val < min_val or val > max_val: return None
        index += 1
        node = TreeNode(val)
        node.left = build(min_val, val)
        node.right = build(val, max_val)
        return node
    return build(float('-inf'), float('inf'))
```

### **Complexity Analysis**
| Problem | Serialization | Deserialization | Space | Notes |
|---------|---------------|-----------------|-------|-------|
| General Tree | O(n) | O(n) | O(n) | Must store nulls |
| BST | O(n) | O(n) | O(n) | More compact |
| Duplicate Detection | O(n) | N/A | O(n) | Hash-based |

### **Key Optimizations**
1. **BST Property**: Eliminate null markers using bounds
2. **Tuple Hashing**: Faster than string concatenation
3. **Unique ID Assignment**: Compress repeated subtree patterns
4. **Iterator Pattern**: Clean state management in deserialization

### **Edge Cases**
- Empty tree
- Single node tree
- Linear tree (worst case for serialization size)
- All nodes same value
- Very deep trees (stack overflow risk)

### **Real-World Applications**
- **Database Systems**: Query plan caching and optimization
- **Compilers**: Abstract syntax tree comparison and optimization
- **Version Control**: Tree diff algorithms
- **Caching**: Memoization of tree computations
- **Machine Learning**: Decision tree comparison and ensemble methods

These serialization problems demonstrate fundamental techniques for tree structure preservation and comparison, with important optimizations based on tree properties and use cases.
# UCAPRT - Knapsack DP
#interview/DSA/Dynamic
Excellent! Let me demonstrate **UCAPRT framework** on **Knapsack DP** problems. I'll cover three representative problems that show different knapsack variants and their applications.

# **Coin Change (322) - Unbounded Knapsack** 💰

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find minimum number of coins to make amount
  
- What are inputs/outputs?
  → Input: Array coins, integer amount
  → Output: Integer (minimum coins needed, or -1 if impossible)
  
- What are constraints?
  → Can use each coin type unlimited times (unbounded)
  → Each coin has positive value
  → Need exact amount, not less or more
```

## **C - CLARIFY**
```python
# Example 1: coins = [1,3,4], amount = 6
# Optimal: 3+3 = 6 (2 coins)
# Alternative: 1+1+4 = 6 (3 coins) - not optimal

# Example 2: coins = [2], amount = 3
# Impossible to make 3 with only coin value 2
# Return -1

# Example 3: coins = [1], amount = 0
# Need 0 coins to make amount 0

# Edge cases:
# - amount = 0: return 0
# - No valid combination: return -1
# - Single coin type: check divisibility
```

## **A - ANALYZE PATTERN**
```
- Pattern: UNBOUNDED KNAPSACK (minimize coins)
- Key insight: Can use same coin multiple times
- State: dp[amount] = minimum coins needed to make this amount
- Transitions: Try each coin type, take minimum
- Goal: Minimize number of items (coins) to reach target (amount)
```

## **P - PLAN**
```python
# Pseudocode:
# dp[i] = minimum coins needed to make amount i
# 
# Base case: dp[0] = 0 (0 coins for amount 0)
# Initialize: dp[i] = infinity for i > 0
#
# For each amount from 1 to target:
#   For each coin:
#     if amount >= coin:
#       dp[amount] = min(dp[amount], dp[amount - coin] + 1)
#
# Return dp[amount] if possible, else -1

# Time: O(amount × coins), Space: O(amount)
```

## **R - REFACTOR**
```python
def coinChange(coins, amount):
    if amount == 0:
        return 0
    
    # dp[i] = minimum coins needed to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins for amount 0
    
    # For each amount from 1 to target
    for curr_amount in range(1, amount + 1):
        # Try each coin type
        for coin in coins:
            if curr_amount >= coin:
                dp[curr_amount] = min(dp[curr_amount], 
                                    dp[curr_amount - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

# Alternative: Coin-first iteration (clearer for unbounded pattern)
def coinChangeUnbounded(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
# base case "We need 0 coins to make amount 0"
    
    # For each coin type (can use unlimited times)
    for coin in coins:
        # Update all amounts that can use this coin
        for curr_amount in range(coin, amount + 1):
            dp[curr_amount] = min(dp[curr_amount], 
                                dp[curr_amount - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

## **T - TEST**
```python
# Test coins = [1,3,4], amount = 6:
# Initial: dp = [0, inf, inf, inf, inf, inf, inf]
# After coin 1: dp = [0, 1, 2, 3, 4, 5, 6]
# After coin 3: dp = [0, 1, 2, 1, 2, 3, 2] 
# After coin 4: dp = [0, 1, 2, 1, 1, 2, 2]
# Result: dp[6] = 2 ✓ (using 3+3)
```

---

# **Partition Equal Subset Sum (416) - 0/1 Knapsack Variation** ⚖️
Given an integer array nums, return true *if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or* false *otherwise*.
## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Determine if array can be partitioned into two subsets with equal sum
  
- What are inputs/outputs?
  → Input: Array nums of positive integers
  → Output: Boolean (true if equal partition possible)
  
- What are constraints?
  → Each number used exactly once (0/1 knapsack)
  → Two subsets must have identical sums
  → All numbers are positive
```

## **C - CLARIFY**
```python
# Example 1: nums = [1,5,11,5]
# Subset 1: [1,5,5] = 11
# Subset 2: [11] = 11  
# Equal sums → return true

# Example 2: nums = [1,2,3,5]
# Total sum = 11 (odd) → impossible to split equally
# Return false

# Key insight: If total sum is odd, impossible
# If total sum is even, check if subset with sum = total_sum/2 exists

# Edge cases:
# - Single element: false (can't split into two subsets)
# - Two elements: true only if equal values
```

## **A - ANALYZE PATTERN**
```
- Pattern: 0/1 KNAPSACK (subset sum variant)
- Key insight: Equal partition ⟺ subset exists with sum = total_sum/2
- State: dp[sum] = whether this sum is achievable using some subset
- Transitions: For each number, choose to include or exclude
- Goal: Check if specific target sum is reachable
```

## **P - PLAN**
```python
# Pseudocode:
# 1. Calculate total_sum, if odd return false
# 2. target = total_sum // 2
# 3. dp[i] = whether sum i is achievable
# 4. For each number in nums:
#      For sum from target down to number (reverse to avoid reuse):
#        dp[sum] = dp[sum] or dp[sum - number]
# 5. Return dp[target]

# Time: O(n × sum), Space: O(sum)
```

## **R - REFACTOR**
```python
def canPartition(nums):
    total_sum = sum(nums)
    
    # If total sum is odd, can't partition equally
    if total_sum % 2 != 0:
        return False
    
    target = total_sum // 2
    
    # dp[i] = whether sum i is achievable with some subset
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset has sum 0
    
    # For each number (0/1 knapsack - use each number at most once)
    for num in nums:
        # Iterate backward to avoid using same number multiple times
        for curr_sum in range(target, num - 1, -1):
            dp[curr_sum] = dp[curr_sum] or dp[curr_sum - num]
    
    return dp[target]

# Alternative: 2D DP (more explicit)
def canPartition2D(nums):
    total_sum = sum(nums)
    if total_sum % 2 != 0:
        return False
    
    target = total_sum // 2
    n = len(nums)
    
    # dp[i][j] = whether sum j is achievable using nums[0:i]
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    
    # Base case: sum 0 is always achievable (empty subset)
    for i in range(n + 1):
        dp[i][0] = True
    
    for i in range(1, n + 1):
        for j in range(1, target + 1):
            # Don't include nums[i-1]
            dp[i][j] = dp[i-1][j]
            
            # Include nums[i-1] if possible
            if j >= nums[i-1]:
                dp[i][j] = dp[i][j] or dp[i-1][j - nums[i-1]]
    
    return dp[n][target]
```

## **T - TEST**
```python
# Test nums = [1,5,11,5], target = 11:
# Initial: dp = [T, F, F, F, F, F, F, F, F, F, F, F]
# After 1:    dp = [T, T, F, F, F, F, F, F, F, F, F, F]
# After 5:    dp = [T, T, F, F, F, T, T, F, F, F, F, F]
# After 11:   dp = [T, T, F, F, F, T, T, F, F, F, F, T]
# After 5:    dp = [T, T, F, F, F, T, T, F, F, F, T, T]
# Result: dp[11] = True ✓

# Test nums = [4, 11, 5], target = 10:
# Initial: dp = [T, F, F, F, F, F, F, F, F, F, F]
#               0  1  2  3  4  5  6  7  8  9  10
# After 4:    dp = [T, F, F, F, T, F, F, F, F, F, F]
#               0  1  2  3  4  5  6  7  8  9  10
# (Processing 4 backward: 10→4, only dp[4] = dp[0] = True)
# After 11:   dp = [T, F, F, F, T, F, F, F, F, F, F]  
#               0  1  2  3  4  5  6  7  8  9  10
# (Processing 11 backward: 10 down to 11, but 11 > 10, so no iterations)
# After 5:    dp = [T, F, F, F, T, T, F, F, F, T, F]
#               0  1  2  3  4  5  6  7  8  9  10
# (Processing 5 backward: 10→5, dp[9] = dp[4] = T, dp[5] = dp[0] = T)
# Result: dp[10] = False ❌

```
Excellent question! This is the **core mechanism** of 0/1 knapsack that ensures each number is used **at most once**. Let me break down exactly how the backward iteration works and why it's crucial.

#  Forward iteration would create **invalid subsets that use the same number multiple times**, not just duplicate valid subsets.

## Forward Iteration Problem: Using Same Number Multiple Times

Let me show you what happens with forward iteration:

### Example: `nums = [2]`, `target = 6`

**Backward (Correct):**
```python
dp = [T, F, F, F, F, F, F]  # Initial
#     0  1  2  3  4  5  6

# Process num = 2 backward (6 down to 2):
curr_sum=6: dp[6] = F or dp[4] = F or F = F
curr_sum=5: dp[5] = F or dp[3] = F or F = F  
curr_sum=4: dp[4] = F or dp[2] = F or F = F
curr_sum=3: dp[3] = F or dp[1] = F or F = F
curr_sum=2: dp[2] = F or dp[0] = F or T = T

Result: dp = [T, F, T, F, F, F, F]
# Valid subsets: {}, {2}
```

**Forward (Wrong):**
```python
dp = [T, F, F, F, F, F, F]  # Initial
#     0  1  2  3  4  5  6

# Process num = 2 forward (2 to 6):
curr_sum=2: dp[2] = F or dp[0] = F or T = T
dp = [T, F, T, F, F, F, F]

curr_sum=3: dp[3] = F or dp[1] = F or F = F  
dp = [T, F, T, F, F, F, F]

curr_sum=4: dp[4] = F or dp[2] = F or T = T  ← PROBLEM!
dp = [T, F, T, F, T, F, F]
# dp[2] was set to True earlier in THIS iteration!

curr_sum=5: dp[5] = F or dp[3] = F or F = F
curr_sum=6: dp[6] = F or dp[4] = F or T = T  ← PROBLEM!
dp = [T, F, T, F, T, F, T]

Result: dp = [T, F, T, F, T, F, T]
# This suggests we can make sums: 0, 2, 4, 6
# But we only have one number 2!
```

## What Forward Creates: Invalid Subsets

The forward iteration creates these **impossible subsets**:
- `dp[0] = True`: {} (valid)
- `dp[2] = True`: {2} (valid) 
- `dp[4] = True`: {2, 2} ← **INVALID!** Using 2 twice
- `dp[6] = True`: {2, 2, 2} ← **INVALID!** Using 2 three times

## More Complex Example: `nums = [1, 2]`

**Forward (Wrong):**
```python
# After processing num = 1:
dp = [T, T, T, T, T, T, T]  # 1+1+1+... (all invalid except first two)

# After processing num = 2:
dp = [T, T, T, T, T, T, T]  # Even more invalid combinations
```

**Backward (Correct):**
```python
# After processing num = 1:
dp = [T, T, F, F, F, F, F]  # Only {} and {1}

# After processing num = 2:  
dp = [T, T, T, T, F, F, F]  # {}, {1}, {2}, {1,2}
```

## Correct Understanding

**The real problem**: Forward iteration makes the algorithm think we can use **one array element** multiple times, violating the 0/1 knapsack constraint where each array element can be used **at most once**.

**Backward iteration ensures**: Each array element is considered exactly once per subset, maintaining the proper 0/1 knapsack behavior.

So yes, forward iteration creates invalid subsets by **reusing the same array element multiple times**, not by creating duplicate valid subsets!
---

# **Target Sum (494) - Subset Sum with Signs** 🎯
You are given an integer array nums and an integer target.
You want to build an **expression** out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers.
* For example, if nums = [2, 1], you can add a '+' before 2 and a '-' before 1 and concatenate them to build the expression "+2-1".

⠀Return the number of different **expressions** that you can build, which evaluates to target.
 
**Example 1:**
**Input:** nums = [1,1,1,1,1], target = 3
**Output:** 5
**Explanation:** There are 5 ways to assign symbols to make the sum of nums be target 3.
-1 + 1 + 1 + 1 + 1 = 3
+1 - 1 + 1 + 1 + 1 = 3
+1 + 1 - 1 + 1 + 1 = 3
+1 + 1 + 1 - 1 + 1 = 3
+1 + 1 + 1 + 1 - 1 = 3
**Example 2:**
**Input:** nums = [1], target = 1
**Output:** 1
## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Count ways to assign +/- signs to reach target sum
  
- What are inputs/outputs?
  → Input: Array nums, integer target
  → Output: Integer (number of ways to achieve target)
  
- What are constraints?
  → Each number used exactly once with + or - sign
  → Count all possible ways, not just find one
  → Numbers are non-negative
```

## **C - CLARIFY**
```python
# Example 1: nums = [1,1,1,1,1], target = 3
# Ways: +1+1+1+1-1 = 3, +1+1+1-1+1 = 3, etc.
# Total: 5 ways

# Example 2: nums = [1], target = 1  
# Only way: +1 = 1
# Total: 1 way

# Key insight: Transform to subset sum problem
# Let P = positive subset, N = negative subset
# P + N = sum(nums), P - N = target
# Solving: P = (sum(nums) + target) / 2

# Edge cases:
# - Target larger than possible range
# - Sum and target have different parity
```

## **A - ANALYZE PATTERN**
```
- Pattern: 0/1 KNAPSACK (counting ways)
- Key insight: Transform sign assignment to subset sum counting
- State: dp[sum] = number of ways to achieve this sum
- Transitions: For each number, accumulate ways from including/excluding
- Goal: Count all possible ways to reach target
```

## **P - PLAN**
```python
# Pseudocode:
# 1. Transform: find subset P with sum = (total + target) / 2
# 2. Check feasibility: (total + target) % 2 == 0 and target achievable
# 3. dp[i] = number of ways to achieve sum i
# 4. For each number:
#      For sum from target down to number:
#        dp[sum] += dp[sum - number]  # Add ways
# 5. Return dp[target_sum]

# Time: O(n × sum), Space: O(sum)
```

## **R - REFACTOR**
```python
def findTargetSumWays(nums, target): #(fastest)
    total = sum(nums)
    
    # Check if target is achievable
    if target > total or target < -total or (total + target) % 2 != 0:
        return 0
    
    # Transform to subset sum problem
    # Find number of ways to select subset with sum = (total + target) // 2
    target_sum = (total + target) // 2
    
    # dp[i] = number of ways to achieve sum i
    dp = [0] * (target_sum + 1)
    dp[0] = 1  # One way to achieve sum 0 (empty subset)
    
    # For each number (0/1 knapsack - use each number at most once)
    for num in nums:
        # Iterate backward to avoid using same number multiple times
        for curr_sum in range(target_sum, num - 1, -1):
            dp[curr_sum] += dp[curr_sum - num]
    
    return dp[target_sum]

# Alternative: Direct approach without transformation
def findTargetSumWaysDirect(nums, target):
    from functools import lru_cache
    
    @lru_cache(None)
    def dfs(index, current_sum):
        if index == len(nums):
            return 1 if current_sum == target else 0
        
        # Try both + and - for current number
        return (dfs(index + 1, current_sum + nums[index]) + 
                dfs(index + 1, current_sum - nums[index]))
    
    return dfs(0, 0)

# 2D DP approach (offset for negative sums)
def findTargetSumWays2D(nums, target):
    total = sum(nums)
    if target > total or target < -total:
        return 0
    
    # Offset to handle negative indices
    offset = total
    dp = [[0] * (2 * total + 1) for _ in range(len(nums) + 1)]
    dp[0][offset] = 1  # sum = 0 at index 0
    
    for i in range(1, len(nums) + 1):
        for j in range(2 * total + 1):
            num = nums[i - 1]
            # Add current number
            if j + num <= 2 * total:
                dp[i][j] += dp[i - 1][j + num]
            # Subtract current number  
            if j - num >= 0:
                dp[i][j] += dp[i - 1][j - num]
    
    return dp[len(nums)][target + offset]
```
Excellent question! Let me provide a detailed **Big O complexity comparison** between these two approaches.

# **Complexity Analysis** 📊
| Aspect | DP Transformation | Direct Recursion |
|--------|------------------|------------------|
| **Time** | O(n × sum) | O(n × sum) |
| **Space** | O(sum) | O(n × sum) |
| **Cache Size** | target_sum ≤ sum | n × 2×sum |
| **Memory Efficiency** | ✅ Better | ❌ Worse |
| **Code Clarity** | 🤔 Needs insight | ✅ More intuitive |

# I'll show you step-by-step execution for both approaches with a concrete example.

## Example: `nums = [1, 1, 1, 1, 1]`, `target = 3`

---

## Method 1: Subset Sum Transformation (DP)

### Step 1: Initial Calculations
```python
nums = [1, 1, 1, 1, 1], target = 3
total = sum(nums) = 5

# Check if achievable:
target > total? 3 > 5? No ✓
target < -total? 3 < -5? No ✓  
(total + target) % 2 != 0? (5 + 3) % 2 = 8 % 2 = 0 ✓

# Transform to subset sum:
target_sum = (total + target) // 2 = (5 + 3) // 2 = 4
```

**Key Insight**: We need to find subsets that sum to 4. If we assign `+` to these numbers and `-` to the rest, we get our target!

### Step 2: DP Execution
```python
# Initial: dp = [1, 0, 0, 0, 0]  # dp[i] = ways to make sum i
#               0  1  2  3  4

# Process num = 1 (first):
# Backward: range(4, 0, -1) = [4, 3, 2, 1]
curr_sum=4: dp[4] += dp[3] → dp[4] = 0 + 0 = 0
curr_sum=3: dp[3] += dp[2] → dp[3] = 0 + 0 = 0  
curr_sum=2: dp[2] += dp[1] → dp[2] = 0 + 0 = 0
curr_sum=1: dp[1] += dp[0] → dp[1] = 0 + 1 = 1
# After 1st: dp = [1, 1, 0, 0, 0]

# Process num = 1 (second):
curr_sum=4: dp[4] += dp[3] → dp[4] = 0 + 0 = 0
curr_sum=3: dp[3] += dp[2] → dp[3] = 0 + 0 = 0
curr_sum=2: dp[2] += dp[1] → dp[2] = 0 + 1 = 1  # {1,1} 
curr_sum=1: dp[1] += dp[0] → dp[1] = 1 + 1 = 2  # {1} or {1}
# After 2nd: dp = [1, 2, 1, 0, 0]

# Process num = 1 (third):
curr_sum=4: dp[4] += dp[3] → dp[4] = 0 + 0 = 0
curr_sum=3: dp[3] += dp[2] → dp[3] = 0 + 1 = 1  # {1,1,1}
curr_sum=2: dp[2] += dp[1] → dp[2] = 1 + 2 = 3  # Various {1,1} combos
curr_sum=1: dp[1] += dp[0] → dp[1] = 2 + 1 = 3  # Various {1} combos
# After 3rd: dp = [1, 3, 3, 1, 0]

# Process num = 1 (fourth):
curr_sum=4: dp[4] += dp[3] → dp[4] = 0 + 1 = 1  # {1,1,1,1}
curr_sum=3: dp[3] += dp[2] → dp[3] = 1 + 3 = 4  # Various {1,1,1} combos
curr_sum=2: dp[2] += dp[1] → dp[2] = 3 + 3 = 6  # Various {1,1} combos
curr_sum=1: dp[1] += dp[0] → dp[1] = 3 + 1 = 4  # Various {1} combos
# After 4th: dp = [1, 4, 6, 4, 1]

# Process num = 1 (fifth):
curr_sum=4: dp[4] += dp[3] → dp[4] = 1 + 4 = 5  # Various {1,1,1,1} combos
curr_sum=3: dp[3] += dp[2] → dp[3] = 4 + 6 = 10 # Various {1,1,1} combos  
curr_sum=2: dp[2] += dp[1] → dp[2] = 6 + 4 = 10 # Various {1,1} combos
curr_sum=1: dp[1] += dp[0] → dp[1] = 4 + 1 = 5  # Various {1} combos
# Final: dp = [1, 5, 10, 10, 5]

# Result: dp[4] = 5

#why 10 in dp
Ways to choose 2 positions out of 5:
1. Choose positions (0,1): nums[0] + nums[1] = 1 + 1 = 2
2. Choose positions (0,2): nums[0] + nums[2] = 1 + 1 = 2  
3. Choose positions (0,3): nums[0] + nums[3] = 1 + 1 = 2
4. Choose positions (0,4): nums[0] + nums[4] = 1 + 1 = 2
5. Choose positions (1,2): nums[1] + nums[2] = 1 + 1 = 2
6. Choose positions (1,3): nums[1] + nums[3] = 1 + 1 = 2
7. Choose positions (1,4): nums[1] + nums[4] = 1 + 1 = 2
8. Choose positions (2,3): nums[2] + nums[3] = 1 + 1 = 2
9. Choose positions (2,4): nums[2] + nums[4] = 1 + 1 = 2
10. Choose positions (3,4): nums[3] + nums[4] = 1 + 1 = 2

This is C(5,2) = 10 combinations!
```

**Answer**: 5 ways

---

## Method 2: Direct Recursive Approach

### Step-by-Step Tree Traversal
```python
nums = [1, 1, 1, 1, 1], target = 3

dfs(0, 0):  # Start at index 0, sum 0
├─ dfs(1, +1)  # Add nums[0] = 1
│  ├─ dfs(2, +2)  # Add nums[1] = 1  
│  │  ├─ dfs(3, +3)  # Add nums[2] = 1
│  │  │  ├─ dfs(4, +4)  # Add nums[3] = 1
│  │  │  │  ├─ dfs(5, +5) → 5 ≠ 3 → 0
│  │  │  │  └─ dfs(5, +3) → 3 = 3 → 1 ✓
│  │  │  └─ dfs(4, +2)  # Subtract nums[3] = 1
│  │  │     ├─ dfs(5, +3) → 3 = 3 → 1 ✓
│  │  │     └─ dfs(5, +1) → 1 ≠ 3 → 0
│  │  └─ dfs(3, +1)  # Subtract nums[2] = 1
│  │     ├─ dfs(4, +2)  # Add nums[3] = 1
│  │     │  ├─ dfs(5, +3) → 3 = 3 → 1 ✓
│  │     │  └─ dfs(5, +1) → 1 ≠ 3 → 0
│  │     └─ dfs(4, +0)  # Subtract nums[3] = 1
│  │        ├─ dfs(5, +1) → 1 ≠ 3 → 0
│  │        └─ dfs(5, -1) → -1 ≠ 3 → 0
│  └─ dfs(2, +0)  # Subtract nums[1] = 1
│     ├─ dfs(3, +1)  # Add nums[2] = 1
│     │  ├─ dfs(4, +2)  # Add nums[3] = 1
│     │  │  ├─ dfs(5, +3) → 3 = 3 → 1 ✓
│     │  │  └─ dfs(5, +1) → 1 ≠ 3 → 0
│     │  └─ dfs(4, +0)  # Subtract nums[3] = 1  
│     │     ├─ dfs(5, +1) → 1 ≠ 3 → 0
│     │     └─ dfs(5, -1) → -1 ≠ 3 → 0
│     └─ dfs(3, -1)  # Subtract nums[2] = 1
│        ├─ dfs(4, +0)  # Add nums[3] = 1
│        │  ├─ dfs(5, +1) → 1 ≠ 3 → 0
│        │  └─ dfs(5, -1) → -1 ≠ 3 → 0
│        └─ dfs(4, -2)  # Subtract nums[3] = 1
│           ├─ dfs(5, -1) → -1 ≠ 3 → 0
│           └─ dfs(5, -3) → -3 ≠ 3 → 0
└─ dfs(1, -1)  # Subtract nums[0] = 1
   └─ ... (similar structure, finds 1 more way)
```

**Counting the successful paths (where sum = 3):**
1. `+1 +1 +1 +1 -1` = 3 ✓
2. `+1 +1 +1 -1 +1` = 3 ✓  
3. `+1 +1 -1 +1 +1` = 3 ✓
4. `+1 -1 +1 +1 +1` = 3 ✓
5. `-1 +1 +1 +1 +1` = 3 ✓

**Answer**: 5 ways

---

## Summary

Both methods return **5**, confirming there are 5 ways to assign `+` and `-` signs to `[1,1,1,1,1]` to get target sum 3.

**Key Differences:**
- **Method 1**: Transforms to subset sum, uses DP table, O(n×sum) time
- **Method 2**: Direct recursion with memoization, explores all 2^n possibilities but caches results

**The 5 valid assignments:**
1. `+1 +1 +1 +1 -1 = 3`
2. `+1 +1 +1 -1 +1 = 3`
3. `+1 +1 -1 +1 +1 = 3`  
4. `+1 -1 +1 +1 +1 = 3`
5. `-1 +1 +1 +1 +1 = 3`
---

# **Knapsack DP Pattern Recognition** 🎯

## **Key Variants:**

### **1. 0/1 Knapsack**
```python
# Each item used at most once
for item in items:
    for w in range(capacity, item.weight - 1, -1):  # BACKWARD
        dp[w] = max(dp[w], dp[w - item.weight] + item.value)
```

### **2. Unbounded Knapsack**  
```python
# Each item can be used unlimited times
for w in range(1, capacity + 1):                    # FORWARD
    for item in items:
        if w >= item.weight:
            dp[w] = max(dp[w], dp[w - item.weight] + item.value)
```

### **3. Counting Ways**
```python
# Count number of ways instead of optimization
for item in items:
    for w in range(capacity, item.weight - 1, -1):
        dp[w] += dp[w - item.weight]  # ADD instead of MAX
```

## **Common Transformations:**

### **1. Boolean Problems → Subset Sum**
```python
# "Can we partition?" → "Can we achieve target sum?"
# Partition Equal Subset Sum → target = total_sum // 2
```

### **2. Sign Assignment → Subset Sum**
```python
# "+/- to reach target" → "subset with sum = (total + target) // 2"
# Target Sum transformation
```

### **3. Minimize Difference → Knapsack**
```python
# "Minimize |subset1 - subset2|" → "maximize subset1 ≤ total/2"
# Last Stone Weight II pattern
```

## **Recognition Patterns:** 🔍

### **Use 0/1 Knapsack when:**
- Each item/number used **at most once**
- **Subset selection** problems
- **Boolean feasibility** (can we achieve X?)

### **Use Unbounded Knapsack when:**
- Each item/number can be used **unlimited times**  
- **Coin change, cutting rod** type problems
- **Minimum/maximum ways** to achieve target

### **Use Counting Variant when:**
- Need **number of ways** instead of optimal value
- **Combination counting** problems

**The key insight: Many optimization problems can be transformed into knapsack variants by identifying the constraint (capacity) and items to select!** 🚀

# **UCAPRT - State Machine DP** 


# **Best Time to Buy/Sell Stock (121) - Basic Trading States** 💰

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find maximum profit from buying and selling stock once
  
- What are inputs/outputs?
  → Input: Array prices (stock prices on each day)
  → Output: Integer (maximum profit possible)
  
- What are constraints?
  → Buy before sell (only one transaction)
  → Can't sell without buying first
  → Must complete transaction within given days
```

## **C - CLARIFY**
```python
# Example 1: prices = [7,1,5,3,6,4]
# Best strategy: buy at 1, sell at 6 → profit = 5

# Example 2: prices = [7,6,4,3,1]  
# No profitable transaction → profit = 0

# Edge cases:
# - Single day: [5] → profit = 0 (can't buy and sell same day)
# - All decreasing: [5,4,3,2,1] → profit = 0
# - All increasing: [1,2,3,4,5] → buy first, sell last
```

## **A - ANALYZE PATTERN**
```
- Pattern: STATE MACHINE DP
- States: "holding" stock vs "not holding" stock
- Key insight: At each day, we're in one of two states
- Transitions: buy (not_holding → holding), sell (holding → not_holding)
- Goal: Maximize profit while respecting state constraints
```

## **P - PLAN**
```python
# Pseudocode:
# States: 
# - hold: maximum profit when holding stock
# - sold: maximum profit when not holding stock (after selling or never bought)
#
# Transitions:
# - buy: sold → hold (cost = current price)
# - sell: hold → sold (gain = current price)
# - wait: stay in current state
#
# dp[i][hold] = max profit holding stock on day i
# dp[i][sold] = max profit not holding stock on day i

# Time: O(n), Space: O(1) with optimization
```

## **R - REFACTOR**
```python
def maxProfit(prices):
    if not prices:
        return 0
    
    # State definitions
    hold = -prices[0]  # Bought on day 0, profit = -price[0]
    sold = 0           # No transaction yet, profit = 0
    
    for i in range(1, len(prices)):
        # Update states (order matters - use previous values)
        new_hold = max(hold, -prices[i])      # Keep holding or buy today
        new_sold = max(sold, hold + prices[i]) # Keep not holding or sell today
        
        hold, sold = new_hold, new_sold
    
    return sold  # Best profit when not holding (sold or never bought)

# Alternative: More explicit DP table
def maxProfitDP(prices):
    n = len(prices)
    if n <= 1:
        return 0
    
    # dp[i][0] = max profit on day i not holding stock
    # dp[i][1] = max profit on day i holding stock
    dp = [[0, 0] for _ in range(n)]
    
    dp[0][0] = 0          # Day 0, not holding (sell today)
    dp[0][1] = -prices[0] # Day 0, holding (bought today)
    
    for i in range(1, n):
        dp[i][0] = max(dp[i-1][0], dp[i-1][1] + prices[i])  # max selling
        dp[i][1] = max(dp[i-1][1], -prices[i])             # min buying
    
    return dp[n-1][0]

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        if not prices:
            return 0

        # Convert list to a NumPy array
        prices = np.array(prices)
        # Compute the cumulative minimum for each price, equivalent to 'min_price'
        cum_min = np.minimum.accumulate(prices)
        # Calculate profit array: difference between current price and the minimum so far
        profit = prices - cum_min
        # Return the maximum profit (converted to int for consistency)
        return int(np.max(profit))

```

## **T - TEST**
```python
# Test prices = [7,1,5,3,6,4]:
# Day 0: hold = -7, sold = 0
# Day 1: hold = max(-7, -1) = -1, sold = max(0, -7+1) = 0
# Day 2: hold = max(-1, -5) = -1, sold = max(0, -1+5) = 4  
# Day 3: hold = max(-1, -3) = -1, sold = max(4, -1+3) = 4
# Day 4: hold = max(-1, -6) = -1, sold = max(4, -1+6) = 5
# Day 5: hold = max(-1, -4) = -1, sold = max(5, -1+4) = 5
# Result: 5 ✓
```

---

# **Best Time to Buy/Sell Stock with Cooldown (309) - Complex States** ❄️

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find maximum profit with unlimited transactions but with cooldown
  
- What are inputs/outputs?
  → Input: Array prices (stock prices on each day)
  → Output: Integer (maximum profit possible)
  
- What are constraints?
  → After selling, must wait one day before buying again (cooldown)
  → Can do multiple buy-sell cycles
  → Must finish all transactions

Key Point: Cooldown Rule
After selling stock, you must rest for 1 day before you can buy again:
	•	Day N: Sell stock → enter cooldown
	•	Day N+1: Must rest (cannot buy)
	•	Day N+2: Can buy again

```

## **C - CLARIFY**
```python
# Example: prices = [1,2,3,0,2]
# Day 0: buy at 1
# Day 1: sell at 2 (profit = 1)
# Day 2: cooldown (required after selling)
# Day 3: buy at 0  
# Day 4: sell at 2 (profit = 2)
# Total profit: 1 + 2 = 3

# States needed:
# - holding: currently own stock
# - sold: just sold stock (must cooldown)  
# - rest: not holding, can buy anytime
```

## **A - ANALYZE PATTERN**
```
- Pattern: STATE MACHINE DP with 3 states
- States: holding, sold (cooldown), rest (ready to buy)
- Key insight: Cooldown creates a third state we must track
- Transitions form a cycle: rest → holding → sold → rest
```

## **P - PLAN**
```python
# State machine:
# rest → holding (buy)
# holding → sold (sell)  
# sold → rest (cooldown)
# rest → rest (wait)
# holding → holding (wait)

# dp[i][holding] = max profit holding stock on day i
# dp[i][sold] = max profit just sold on day i  
# dp[i][rest] = max profit resting (can buy) on day i
```

## **R - REFACTOR**
```python
def maxProfit(prices):
    if len(prices) <= 1:
        return 0
    
    # State definitions
    hold = -prices[0]  # Bought on day 0
    sold = 0           # Just sold (impossible on day 0, but init to 0)
    rest = 0           # Resting, can buy
    
    for i in range(1, len(prices)):
        # Calculate new states (order matters!)
        new_hold = max(hold, rest - prices[i])     # Keep holding or buy today
        new_sold = hold + prices[i]                # Sell today (must have been holding)
        new_rest = max(rest, sold)                 # Keep resting or finish cooldown
        
        hold, sold, rest = new_hold, new_sold, new_rest
    
    return max(sold, rest)  # Don't end holding stock

# Alternative: Explicit DP table
def maxProfitDP(prices):
    n = len(prices)
    if n <= 1:
        return 0
    
    # dp[i][0] = rest, dp[i][1] = hold, dp[i][2] = sold
    dp = [[0, 0, 0] for _ in range(n)]
    
    dp[0][0] = 0          # Day 0, rest
    dp[0][1] = -prices[0] # Day 0, hold
    dp[0][2] = 0          # Day 0, sold (invalid but init)
    
    for i in range(1, n):
        dp[i][0] = max(dp[i-1][0], dp[i-1][2])              # Rest or cooldown complete
        dp[i][1] = max(dp[i-1][1], dp[i-1][0] - prices[i])  # Hold or buy
        dp[i][2] = dp[i-1][1] + prices[i]                   # Sell
    
    return max(dp[n-1][0], dp[n-1][2])
```
No, that's not quite right! Let me clarify what `rest` means and show you the step-by-step execution.

## State Definitions

- **`hold`**: Currently holding stock (bought but not sold yet)
- **`sold`**: Just sold stock **today** (in cooldown, cannot buy tomorrow)
- **`rest`**: Not holding stock and **not in cooldown** (can buy today if wanted)

## Key Point: Cooldown Rule

After selling stock, you must **rest for 1 day** before you can buy again:
- Day N: Sell stock → enter cooldown
- Day N+1: **Must rest** (cannot buy)
- Day N+2: Can buy again

## Example: `prices = [1, 2, 3, 0, 2]`

### Initial State (Day 0)
```python
hold = -1  # Bought stock at price 1
sold = 0   # Can't sell on day 0
rest = 0   # Alternative: didn't buy, resting
```

### Day 1 (price = 2)
```python
# Calculate new states:
new_hold = max(-1, 0 - 2) = max(-1, -2) = -1  # Keep holding (better than buying at 2)
new_sold = -1 + 2 = 1                         # Sell stock bought at 1, profit = 1
new_rest = max(0, 0) = 0                      # Keep resting

# Update states:
hold = -1, sold = 1, rest = 0
```

**Current situation**: We can either hold stock (profit -1) or have just sold (profit 1, but in cooldown).

### Day 2 (price = 3)
```python
# Calculate new states:
new_hold = max(-1, 0 - 3) = max(-1, -3) = -1  # Keep holding
new_sold = -1 + 3 = 2                         # Sell stock, profit = 2
new_rest = max(0, 1) = 1                      # Come out of cooldown from day 1 sale

# Update states:
hold = -1, sold = 2, rest = 1
```

**Current situation**: 
- `rest = 1`: We completed cooldown from day 1 sale, now free to buy with profit 1
- `sold = 2`: Or we just sold today for profit 2 (but now in cooldown)

### Day 3 (price = 0) - Great buying opportunity!
```python
# Calculate new states:
new_hold = max(-1, 1 - 0) = max(-1, 1) = 1    # Buy at price 0 with previous profit 1!
new_sold = -1 + 0 = -1                        # Sell at 0 (bad idea)
new_rest = max(1, 2) = 2                      # Come out of cooldown from day 2 sale

# Update states:
hold = 1, sold = -1, rest = 2
```

**Current situation**: We bought stock at price 0 using profit from previous operations!

### Day 4 (price = 2) - Sell the stock we bought at 0
```python
# Calculate new states:
new_hold = max(1, 2 - 2) = max(1, 0) = 1      # Keep holding
new_sold = 1 + 2 = 3                          # Sell stock bought at 0, total profit = 3!
new_rest = max(2, -1) = 2                     # Keep resting

# Update states:
hold = 1, sold = 3, rest = 2

# Final answer: max(sold, rest) = max(3, 2) = 3
```

## State Transitions Visualized

```
Day 0: Buy at 1    → hold = -1
Day 1: Sell at 2   → sold = 1  (profit = 1, enter cooldown)
Day 2: Cooldown    → rest = 1  (exit cooldown, can buy tomorrow)
Day 3: Buy at 0    → hold = 1  (net profit after buying at 0)
Day 4: Sell at 2   → sold = 3  (final profit = 3)
```

## The Cooldown Mechanism

```python
new_rest = max(rest, sold)
```

This line means:
- `rest`: Continue resting from previous day
- `sold`: **Exit cooldown** from a sale that happened **yesterday**

So if you sell on day N:
- Day N: `sold` state is active (just sold, in cooldown)
- Day N+1: `sold` value moves to `rest` (cooldown complete, can buy again)

## Timeline Example

```
Day 1: Sell stock → sold = profit, rest = 0
Day 2: new_rest = max(rest, sold) → rest gets yesterday's sold value
       Now you can buy again because cooldown is over
```

**Answer**: `rest` represents being **out of cooldown** and free to buy, not the same day as selling. The cooldown lasts exactly 1 day after selling.

## **T - TEST**
Excellent! Let me walk through the **Stock Trading with Cooldown** algorithm step-by-step with a concrete example.

# **Step-by-Step Walkthrough** 📊

## **Example Input:**
```python
prices = [1, 2, 3, 0, 2]
n = 5
```

## **State Definitions:**
```python
# dp[i][0] = rest    → maximum profit on day i when resting (can buy)
# dp[i][1] = hold    → maximum profit on day i when holding stock  
# dp[i][2] = sold    → maximum profit on day i when just sold (must cooldown)
```

## **Initial Setup:**
```python
dp = [[0, 0, 0] for _ in range(5)]
# Creates:
# dp[0] = [0, 0, 0]
# dp[1] = [0, 0, 0] 
# dp[2] = [0, 0, 0]
# dp[3] = [0, 0, 0]
# dp[4] = [0, 0, 0]
```

## **Day 0 Initialization:**
```python
dp[0][0] = 0          # Day 0, rest (no action taken)
dp[0][1] = -prices[0] # Day 0, hold (bought stock for price[0] = 1)
dp[0][2] = 0          # Day 0, sold (impossible to sell on day 0)

# After Day 0:
# dp[0] = [0, -1, 0]
```
## Forced Cooldown Path:

**CRITICAL**: To buy today (dp[i-1][0] - prices[i]), you must have been in **rest** state yesterday!
```
Day 1: SOLD state (profit = 1)
       ↓
Day 2: REST state (dp[2][0] = max(dp[1][0], dp[1][2]) = max(0, 1) = 1)
       ↓  
Day 3: NOW can buy (dp[3][1] can use dp[2][0] = 1)
```
# **Day-by-Day Transitions** 🗓️

## **Day 1: prices[1] = 2**
```python
i = 1

# Calculate dp[1][0] (rest state)
dp[1][0] = max(dp[0][0], dp[0][2])
         = max(0, 0) = 0
# Meaning: Either continue resting (0) or start cooldown tdy with previous sale (0)

# Calculate dp[1][1] (hold state)  
dp[1][1] = max(dp[0][1], dp[0][0] - prices[1])
         = max(-1, 0 - 2) = max(-1, -2) = -1
# Meaning: Either keep holding from yesterday (-1) or buy today from rest yesterday (-2)

# Calculate dp[1][2] (sold state)
dp[1][2] = dp[0][1] + prices[1]
         = -1 + 2 = 1
# Meaning: Sell the stock we were holding (profit = purchase_cost + sale_price)

# After Day 1:
# dp[1] = [0, -1, 1]
```

## **Day 2: prices[2] = 3**
```python
i = 2

# Calculate dp[2][0] (rest state)
dp[2][0] = max(dp[1][0], dp[1][2])
         = max(0, 1) = 1
# Meaning: Either continue resting (0) or finish cooldown after selling yesterday (1)

# Calculate dp[2][1] (hold state)
dp[2][1] = max(dp[1][1], dp[1][0] - prices[2])
         = max(-1, 0 - 3) = max(-1, -3) = -1
# Meaning: Either keep holding (-1) or buy today from yesterday's rest state (-3)

# Calculate dp[2][2] (sold state)  
dp[2][2] = dp[1][1] + prices[2]
         = -1 + 3 = 2
# Meaning: Sell the stock we were holding for price 3

# After Day 2:
# dp[2] = [1, -1, 2]
```

## **Day 3: prices[3] = 0**
```python
i = 3

# Calculate dp[3][0] (rest state)
dp[3][0] = max(dp[2][0], dp[2][2])
         = max(1, 2) = 2  
# Meaning: Either continue resting (1) or finish cooldown after selling yesterday (2)

# Calculate dp[3][1] (hold state)
dp[3][1] = max(dp[2][1], dp[2][0] - prices[3])
         = max(-1, 1 - 0) = max(-1, 1) = 1
# Meaning: Either keep holding (-1) or buy today from yesterday's rest state (1-0=1)

# Calculate dp[3][2] (sold state)
dp[3][2] = dp[2][1] + prices[3]  
         = -1 + 0 = -1
# Meaning: Sell stock for price 0 (would be a loss)

# After Day 3:
# dp[3] = [2, 1, -1]
```

## **Day 4: prices[4] = 2**
```python
i = 4

# Calculate dp[4][0] (rest state)
dp[4][0] = max(dp[3][0], dp[3][2])
         = max(2, -1) = 2
# Meaning: Either continue resting (2) or finish cooldown after selling yesterday (-1)

# Calculate dp[4][1] (hold state)
dp[4][1] = max(dp[3][1], dp[3][0] - prices[4])
         = max(1, 2 - 2) = max(1, 0) = 1  
# Meaning: Either keep holding (1) or buy today from yesterday's rest state (0)

# Calculate dp[4][2] (sold state)
dp[4][2] = dp[3][1] + prices[4]
         = 1 + 2 = 3
# Meaning: Sell the stock we were holding for price 2

# After Day 4:
# dp[4] = [2, 1, 3]
```

# **Final DP Table** 📋

```python
# Complete DP table:
#       Day:  0    1    2    3    4
# Rest  [0]:  0    0    1    2    2
# Hold  [1]: -1   -1   -1    1    1  
# Sold  [2]:  0    1    2   -1    3
```

## **Final Answer:**
```python
return max(dp[n-1][0], dp[n-1][2])
     = max(dp[4][0], dp[4][2])
     = max(2, 3) = 3
```

# **Optimal Strategy Reconstruction** 🎯

From the DP table, the optimal strategy is:
1. **Day 0**: Buy stock at price 1 (hold state, profit = -1)
2. **Day 1**: Sell stock at price 2 (sold state, profit = 1) 
3. **Day 2**: Cooldown (rest state, profit = 1)
4. **Day 3**: Buy stock at price 0 (hold state, profit = 1)
5. **Day 4**: Sell stock at price 2 (sold state, profit = 3)

**Total Profit: 3** ✅

# **Key Transition Insights** 💡

## **State Transitions:**
```python
# rest → rest: Continue waiting
# rest → hold: Buy stock (cost = current price)
# hold → hold: Keep holding  
# hold → sold: Sell stock (gain = current price)
# sold → rest: Cooldown period complete
```

## **Why This Works:**
- **rest state** tracks best profit when ready to buy
- **hold state** tracks best profit when currently invested
- **sold state** tracks best profit after selling (forces cooldown)
- **Cooldown constraint** is naturally enforced by state transitions

The algorithm systematically explores all valid trading sequences and finds the optimal one! 🚀
---

# **Paint House (256) - Color States** 🎨

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Paint n houses with minimum cost, no adjacent houses same color
  
- What are inputs/outputs?
  → Input: 2D array costs[i][j] = cost to paint house i with color j
  → Output: Integer (minimum total cost)
  
- What are constraints?
  → Exactly 3 colors: red (0), blue (1), green (2)
  → Adjacent houses must have different colors
  → Each house must be painted exactly once
```

## **C - CLARIFY**
```python
# Example: costs = [[17,2,17],[16,16,5],[14,3,19]]
# House 0: costs [17,2,17] for [red,blue,green]
# House 1: costs [16,16,5] for [red,blue,green]  
# House 2: costs [14,3,19] for [red,blue,green]

# Optimal: House 0→blue(2), House 1→green(5), House 2→blue(3)
# Total: 2 + 5 + 3 = 10

# Edge cases:
# - Single house: min(costs[0])
# - Two houses: min cost avoiding same colors
```

## **A - ANALYZE PATTERN**
```
- Pattern: STATE MACHINE DP with color states
- States: red, blue, green (last color used)
- Key insight: Current house color depends on previous house color
- Transitions: can't use same color as previous house
- Goal: Minimize total cost while respecting color constraints
```

## **P - PLAN**
```python
# Pseudocode:
# States: dp[i][color] = min cost to paint houses 0..i with house i having 'color'
# 
# Transitions for house i:
# - dp[i][red] = costs[i][red] + min(dp[i-1][blue], dp[i-1][green])
# - dp[i][blue] = costs[i][blue] + min(dp[i-1][red], dp[i-1][green])  
# - dp[i][green] = costs[i][green] + min(dp[i-1][red], dp[i-1][blue])
#
# Answer: min(dp[n-1][red], dp[n-1][blue], dp[n-1][green])

# Time: O(n), Space: O(1) with optimization
```

## **R - REFACTOR**
```python
def minCost(costs):
    if not costs:
        return 0
    
    n = len(costs)
    
    # State: [red_cost, blue_cost, green_cost]
    red = costs[0][0]
    blue = costs[0][1] 
    green = costs[0][2]
    
    for i in range(1, n):
        # Calculate new costs (use temp variables to avoid conflicts)
        new_red = costs[i][0] + min(blue, green)      # Paint red, prev was blue/green
        new_blue = costs[i][1] + min(red, green)      # Paint blue, prev was red/green
        new_green = costs[i][2] + min(red, blue)      # Paint green, prev was red/blue
        
        red, blue, green = new_red, new_blue, new_green
    
    return min(red, blue, green)

# Alternative: Explicit DP table
def minCostDP(costs):
    if not costs:
        return 0
    
    n = len(costs)
    # dp[i][j] = min cost to paint houses 0..i with house i colored j
    dp = [[0] * 3 for _ in range(n)]
    
    # Base case: first house
    dp[0][0] = costs[0][0]  # Red
    dp[0][1] = costs[0][1]  # Blue  
    dp[0][2] = costs[0][2]  # Green
    
    for i in range(1, n):
        dp[i][0] = costs[i][0] + min(dp[i-1][1], dp[i-1][2])  # Red
        dp[i][1] = costs[i][1] + min(dp[i-1][0], dp[i-1][2])  # Blue
        dp[i][2] = costs[i][2] + min(dp[i-1][0], dp[i-1][1])  # Green
    
    return min(dp[n-1])
```

## **T - TEST**
```python
# Test costs = [[17,2,17],[16,16,5],[14,3,19]]:
# House 0: red = 17, blue = 2, green = 17
# House 1: red = 16+min(2,17) = 18, blue = 16+min(17,17) = 33, green = 5+min(17,2) = 7
# House 2: red = 14+min(33,7) = 21, blue = 3+min(18,7) = 10, green = 19+min(18,33) = 37
# Result: min(21, 10, 37) = 10 ✓
```

---

# **State Machine DP Pattern Recognition** 🎯

## **Common Characteristics:**
1. **Limited States**: Small, well-defined set of possible states
2. **State Transitions**: Clear rules for moving between states
3. **State Dependencies**: Current state depends on previous state + current input
4. **Optimization Goal**: Minimize/maximize value while respecting state constraints

## **Template Recognition:**
```python
# Universal State Machine DP Template
def solve(input_array):
    # 1. Define states clearly
    states = ['state1', 'state2', 'state3']
    
    # 2. Initialize base case
    dp = {state: initial_value[state] for state in states}
    
    # 3. Process each input
    for item in input_array:
        new_dp = {}
        
        # 4. Calculate transitions for each state
        for current_state in states:
            options = []
            for prev_state in states:
                if is_valid_transition(prev_state, current_state):
                    cost = transition_cost(prev_state, current_state, item)
                    options.append(dp[prev_state] + cost)
            
            new_dp[current_state] = optimize(options)  # min or max
        
        dp = new_dp
    
    # 5. Return optimal final state
    return optimize(dp.values())
```

**This pattern appears whenever you have a finite state machine with optimal transitions between states!** 🚀
#interview/DSA/Dynamic

# UCAPRT - Interval DP
#interview/DSA/Dynamic
Excellent! Let me demonstrate **UCAPRT framework** on these **Interval DP** problems. You'll see how they all share the core pattern of solving ranges from small to large, but with different objectives and state definitions.

# **Longest Palindromic Substring (5) - String Intervals** 🔤

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find the longest contiguous substring that reads the same forwards/backwards
  
- What are inputs/outputs?
  → Input: String s
  → Output: String (the longest palindromic substring)
  
- What are constraints?
  → Substring must be contiguous
  → Need the actual substring, not just length
  → Handle ties (any valid answer)
```

## **C - CLARIFY**
```python
# Example 1: s = "babad"
# Palindromes: "b", "a", "b", "a", "d", "aba", "bab"
# Longest: "bab" or "aba" (both length 3) → Return either

# Example 2: s = "cbbd" 
# Palindromes: "c", "b", "b", "d", "bb"
# Longest: "bb" (length 2) → Return "bb"

# Edge cases:
# - Single character: "a" → "a"
# - All same: "aaaa" → "aaaa" 
# - No palindrome > 1: "abc" → "a"
```

## **A - ANALYZE PATTERN**
```
- Pattern: INTERVAL DP
- Core insight: substring s[i:j+1] is palindrome if:
  → s[i] == s[j] AND s[i+1:j] is palindrome
- This is range/interval problem building from smaller ranges
- State: dp[i][j] = True if s[i:j+1] is palindrome
```

# P - Plan

```
**Expand Around Centers**: For each possible center, expand outwards while characters match. We need to check both odd-length (single center) and even-length (between two characters) palindromes.
```
## **R - REFACTOR**
## Optimal Solution

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        if not s:
            return ""
        
        start = 0
        max_len = 1
        
        def expand_around_center(left: int, right: int) -> int:
            while left >= 0 and right < len(s) and s[left] == s[right]:
                left -= 1
                right += 1
            return right - left - 1  # Length of palindrome
        
        for i in range(len(s)):
            # Check for odd-length palindromes (center at i)
            len1 = expand_around_center(i, i)
            
            # Check for even-length palindromes (center between i and i+1)
            len2 = expand_around_center(i, i + 1)
            
            # Update if we found a longer palindrome
            current_max = max(len1, len2)
            if current_max > max_len:
                max_len = current_max
                start = i - (current_max - 1) // 2
        
        return s[start:start + max_len]
```

## Big O Analysis

- **Time Complexity**: O(n²) - We check each possible center (n centers) and each expansion can take up to O(n) time
- **Space Complexity**: O(1) - Only using constant extra space

I'll walk you through the longest palindrome algorithm step by step with a detailed example.

## Example: `s = "babad"`

Let's trace through each step:

### Initial Setup
```python
s = "babad"
start = 0      # Start index of longest palindrome found
max_len = 1    # Length of longest palindrome found
```

### Step-by-Step Execution

#### **i = 0 (character 'b')**

**Check odd-length palindromes centered at index 0:**
```python
expand_around_center(0, 0)  # Center at 'b'
left=0, right=0: s[0]='b' == s[0]='b' ✓
left=-1, right=1: left < 0, stop
return 1 - (-1) - 1 = 1
len1 = 1
```

**Check even-length palindromes centered between 0 and 1:**
```python
expand_around_center(0, 1)  # Between 'b' and 'a'
left=0, right=1: s[0]='b' != s[1]='a' ❌, stop immediately
return 1 - 0 - 1 = 0
len2 = 0
```

**Update check:**
```python
current_max = max(1, 0) = 1
1 > 1? No, don't update
```

#### **i = 1 (character 'a')**

**Check odd-length palindromes centered at index 1:**
```python
expand_around_center(1, 1)  # Center at 'a'
left=1, right=1: s[1]='a' == s[1]='a' ✓
left=0, right=2: s[0]='b' == s[2]='b' ✓
left=-1, right=3: left < 0, stop
return 3 - (-1) - 1 = 3
len1 = 3  # Found "bab"!
```

**Check even-length palindromes centered between 1 and 2:**
```python
expand_around_center(1, 2)  # Between 'a' and 'b'  
left=1, right=2: s[1]='a' != s[2]='b' ❌, stop
return 2 - 1 - 1 = 0
len2 = 0
```

**Update check:**
```python
current_max = max(3, 0) = 3
3 > 1? Yes! Update:
max_len = 3
start = 1 - (3-1)//2 = 1 - 1 = 0
```

#### **i = 2 (character 'b')**

**Check odd-length palindromes centered at index 2:**
```python
expand_around_center(2, 2)  # Center at 'b'
left=2, right=2: s[2]='b' == s[2]='b' ✓  
left=1, right=3: s[1]='a' == s[3]='a' ✓
left=0, right=4: s[0]='b' != s[4]='d' ❌, stop
return 4 - 0 - 1 = 3
len1 = 3  # Found "aba"!
```

**Check even-length palindromes:**
```python
expand_around_center(2, 3)  # Between 'b' and 'a'
left=2, right=3: s[2]='b' != s[3]='a' ❌, stop
return 3 - 2 - 1 = 0  
len2 = 0
```

**Update check:**
```python
current_max = max(3, 0) = 3
3 > 3? No, don't update
```

#### **i = 3 (character 'a')**

**Check odd-length palindromes:**
```python
expand_around_center(3, 3)  # Center at 'a'
left=3, right=3: s[3]='a' == s[3]='a' ✓
left=2, right=4: s[2]='b' != s[4]='d' ❌, stop  
return 4 - 2 - 1 = 1
len1 = 1
```

**Check even-length palindromes:**
```python
expand_around_center(3, 4)  # Between 'a' and 'd'
left=3, right=4: s[3]='a' != s[4]='d' ❌, stop
return 4 - 3 - 1 = 0
len2 = 0
```

**Update check:**
```python
current_max = max(1, 0) = 1
1 > 3? No, don't update
```

#### **i = 4 (character 'd')**

**Check odd-length palindromes:**
```python
expand_around_center(4, 4)  # Center at 'd'
left=4, right=4: s[4]='d' == s[4]='d' ✓
left=3, right=5: right >= len(s), stop
return 5 - 3 - 1 = 1
len1 = 1
```

**Check even-length palindromes:**
```python
expand_around_center(4, 5)  # Between 'd' and beyond
left=4, right=5: right >= len(s), stop immediately
return 5 - 4 - 1 = 0
len2 = 0
```

**Update check:**
```python
current_max = max(1, 0) = 1  
1 > 3? No, don't update
```

### Final Result
```python
start = 0
max_len = 3
return s[0:0+3] = s[0:3] = "bab"
```

## Key Insights

1. **Why `return right - left - 1`?**
   ```python
   # When loop exits: s[left] != s[right] or out of bounds
   # Last valid palindrome was from (left+1) to (right-1)
   # Length = (right-1) - (left+1) + 1 = right - left - 1
   ```

2. **Why `start = i - (current_max - 1) // 2`?**
   ```python
   # For palindrome of length L centered at i:
   # Start position = i - (L-1)//2
   # Example: "bab" (length 3) centered at i=1
   # Start = 1 - (3-1)//2 = 1 - 1 = 0 ✓
   ```

3. **Even vs Odd palindromes:**
   - **Odd**: Single center character (e.g., "aba")
   - **Even**: Center between two characters (e.g., "abba")

The algorithm finds **"bab"** as the longest palindrome, which is correct! (Note: "aba" is also valid and same length, but the algorithm returns the first one found.)
---

# **Burst Balloons (312) - Range Optimization** 🎈
You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. You are asked to burst all the balloons.
If you burst the ith balloon, you will get nums[i - 1] * nums[i] * nums[i + 1] coins. If i - 1 or i + 1 goes out of bounds of the array, then treat it as if there is a balloon with a 1 painted on it.
Return *the maximum coins you can collect by bursting the balloons wisely*.
 
**Example 1:**
**Input:** nums = [3,1,5,8]
**Output:** 167
**Explanation:**
nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []
coins =  3*1*5    +   3*5*8   +  1*3*8  + 1*8*1 = 167
**Example 2:**
**Input:** nums = [1,5]
**Output:** 10
 
**Constraints:**
* n == nums.length
* 1 <= n <= 300
* 0 <= nums[i] <= 100
* 
## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Burst all balloons to maximize coins collected
  
- What are inputs/outputs?
  → Input: Array nums (balloon values)
  → Output: Integer (maximum coins possible)
  
- What are constraints?
  → When burst balloon i, get nums[i-1] * nums[i] * nums[i+1] coins
  → Adjacent balloons shift after bursting
  → Add virtual balloons with value 1 at boundaries
```

## **C - CLARIFY**
```python
# Example: nums = [3,1,5,8]
# Add boundaries: [1,3,1,5,8,1]

# Strategy: Think backwards - which balloon to burst LAST in range?
# If balloon k is burst last in range [i,j]:
# - Left subrange [i,k-1] already burst
# - Right subrange [k+1,j] already burst  
# - Only k remains, so get nums[i-1] * nums[k] * nums[j+1]

# Example walkthrough:
# Burst order: 1 -> 5 -> 3 -> 8
# Coins: 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15+120+24+8 = 167
```

## **A - ANALYZE PATTERN**
```
- Pattern: INTERVAL DP with "last operation" thinking
- Key insight: Instead of "first to burst", think "last to burst"
- State: dp[i][j] = max coins from bursting all balloons in (i,j)
- Transition: Try each k as the last balloon to burst in range
```

## **P - PLAN**
```python
# Pseudocode:
# 1. Add boundary balloons: nums = [1] + nums + [1]
# 2. dp[i][j] = max coins from bursting balloons in open interval (i,j)
# 3. For each range length and each possible last balloon k:
#    dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j])
# 4. Return dp[0][n+1]

# Time: O(n³), Space: O(n²)
```

## **R - REFACTOR**
```python
def maxCoins(nums):
    # Add boundary balloons
    nums = [1] + nums + [1]
    n = len(nums)
    
    # dp[i][j] = max coins from bursting balloons in open interval (i,j)
    dp = [[0] * n for _ in range(n)]
    
    # Fill by increasing length
    for length in range(2, n):  # length of interval
        for i in range(n - length):
            j = i + length
            # Try each k as last balloon to burst in (i,j)
            for k in range(i + 1, j):
                dp[i][j] = max(dp[i][j], 
                             dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])
    
    return dp[0][n - 1]
```

## **T - TEST**
Excellent! Let me trace through the **Burst Balloons** algorithm step-by-step with the example `nums = [3,1,5,8]`.

**Interpretation:**
* dp[i][k]: max coins from left subproblem (balloons between i and k)
* dp[k][j]: max coins from right subproblem (balloons between k and j)
* nums[i] * nums[k] * nums[j]: coins from bursting balloon k **last**

⠀**Why burst k last?**
* When we burst k last in interval (i,j), all other balloons in (i,j) are already gone
* So k's neighbors are exactly nums[i] and nums[j]

```
# For nums = [1, 3, 1, 5, 8, 1]
#            0  1  2  3  4  5

dp[i][j] table:
    0  1  2  3  4  5
0   0  0  3  30 159 167
1   0  0  0  15 135 159  
2   0  0  0  0  40 105
3   0  0  0  0  0  40
4   0  0  0  0  0  0
5   0  0  0  0  0  0

Answer: dp[0][5] = 167
```
# **Step-by-Step Walkthrough** 🎈

## **Initial Setup**
```python
# Original: nums = [3,1,5,8]
# After adding boundaries: nums = [1,3,1,5,8,1]
# Indices:                        0 1 2 3 4 5
n = 6

# dp[i][j] = max coins from bursting all balloons in open interval (i,j)
# "Open interval" means excluding balloons at positions i and j
dp = [[0]*6 for _ in range(6)]  # All zeros initially
```

## **Length = 2 (Intervals of size 2)**
```python
for length in range(2, n):  # length = 2
    for i in range(n - length):  # i = 0,1,2,3
```

### **i=0, j=2: Interval (0,2) - between balloons 1 and 1**
```python
# Available balloons in (0,2): only balloon at index 1 (value 3)
# k can only be 1
k = 1: dp[0][2] = max(0, dp[0][1] + dp[1][2] + nums[0]*nums[1]*nums[2])
                = max(0, 0 + 0 + 1*3*1) = 3
```

### **i=1, j=3: Interval (1,3) - between balloons 3 and 5**
```python
# Available balloons in (1,3): only balloon at index 2 (value 1)  
k = 2: dp[1][3] = max(0, dp[1][2] + dp[2][3] + nums[1]*nums[2]*nums[3])
                = max(0, 0 + 0 + 3*1*5) = 15
```

### **i=2, j=4: Interval (2,4) - between balloons 1 and 8**
```python
# Available balloons in (2,4): only balloon at index 3 (value 5)
k = 3: dp[2][4] = max(0, dp[2][3] + dp[3][4] + nums[2]*nums[3]*nums[4])
                = max(0, 0 + 0 + 1*5*8) = 40
```

### **i=3, j=5: Interval (3,5) - between balloons 5 and 1**
```python
# Available balloons in (3,5): only balloon at index 4 (value 8)
k = 4: dp[3][5] = max(0, dp[3][4] + dp[4][5] + nums[3]*nums[4]*nums[5])
                = max(0, 0 + 0 + 5*8*1) = 40
```

**After Length=2:**
```
dp[0][2] = 3
dp[1][3] = 15  
dp[2][4] = 40
dp[3][5] = 40
```

## **Length = 3 (Intervals of size 3)**

### **i=0, j=3: Interval (0,3) - between balloons 1 and 5**
```python
# Available balloons in (0,3): balloons at indices 1,2 (values 3,1)
# Try k=1 (burst balloon 1 last):
k = 1: dp[0][3] = max(0, dp[0][1] + dp[1][3] + nums[0]*nums[1]*nums[3])
                = max(0, 0 + 15 + 1*3*5) = 30

# Try k=2 (burst balloon 2 last):  
k = 2: dp[0][3] = max(30, dp[0][2] + dp[2][3] + nums[0]*nums[2]*nums[3])
                = max(30, 3 + 0 + 1*1*5) = max(30, 8) = 30
```

### **i=1, j=4: Interval (1,4) - between balloons 3 and 8**
```python
# Available balloons in (1,4): balloons at indices 2,3 (values 1,5)
# Try k=2 (burst balloon 2 last):
k = 2: dp[1][4] = max(0, dp[1][2] + dp[2][4] + nums[1]*nums[2]*nums[4])
                = max(0, 0 + 40 + 3*1*8) = 64

# Try k=3 (burst balloon 3 last):
k = 3: dp[1][4] = max(64, dp[1][3] + dp[3][4] + nums[1]*nums[3]*nums[4])
                = max(64, 15 + 0 + 3*5*8) = max(64, 135) = 135
```

### **i=2, j=5: Interval (2,5) - between balloons 1 and 1**
```python
# Available balloons in (2,5): balloons at indices 3,4 (values 5,8)
# Try k=3 (burst balloon 3 last):
k = 3: dp[2][5] = max(0, dp[2][3] + dp[3][5] + nums[2]*nums[3]*nums[5])
                = max(0, 0 + 40 + 1*5*1) = 45

# Try k=4 (burst balloon 4 last):
k = 4: dp[2][5] = max(45, dp[2][4] + dp[4][5] + nums[2]*nums[4]*nums[5])
                = max(45, 40 + 0 + 1*8*1) = max(45, 48) = 48
```

**After Length=3:**
```
dp[0][3] = 30
dp[1][4] = 135
dp[2][5] = 48
```

## **Length = 4 (Intervals of size 4)**

### **i=0, j=4: Interval (0,4) - between balloons 1 and 8**
```python
# Available balloons in (0,4): balloons at indices 1,2,3 (values 3,1,5)
# Try k=1 (burst balloon 1 last):
k = 1: dp[0][4] = max(0, dp[0][1] + dp[1][4] + nums[0]*nums[1]*nums[4])
                = max(0, 0 + 135 + 1*3*8) = 159

# Try k=2 (burst balloon 2 last):
k = 2: dp[0][4] = max(159, dp[0][2] + dp[2][4] + nums[0]*nums[2]*nums[4])
                = max(159, 3 + 40 + 1*1*8) = max(159, 51) = 159

# Try k=3 (burst balloon 3 last):
k = 3: dp[0][4] = max(159, dp[0][3] + dp[3][4] + nums[0]*nums[3]*nums[4])
                = max(159, 30 + 0 + 1*5*8) = max(159, 70) = 159
```

### **i=1, j=5: Interval (1,5) - between balloons 3 and 1**
```python
# Available balloons in (1,5): balloons at indices 2,3,4 (values 1,5,8)
# Try k=2 (burst balloon 2 last):
k = 2: dp[1][5] = max(0, dp[1][2] + dp[2][5] + nums[1]*nums[2]*nums[5])
                = max(0, 0 + 48 + 3*1*1) = 51

# Try k=3 (burst balloon 3 last):
k = 3: dp[1][5] = max(51, dp[1][3] + dp[3][5] + nums[1]*nums[3]*nums[5])
                = max(51, 15 + 40 + 3*5*1) = max(51, 70) = 70

# Try k=4 (burst balloon 4 last):
k = 4: dp[1][5] = max(70, dp[1][4] + dp[4][5] + nums[1]*nums[4]*nums[5])
                = max(70, 135 + 0 + 3*8*1) = max(70, 159) = 159
```

**After Length=4:**
```
dp[0][4] = 159
dp[1][5] = 159
```

## **Length = 5 (Final - Full interval)**

### **i=0, j=5: Interval (0,5) - between boundary balloons**
```python
# Available balloons in (0,5): all original balloons 1,2,3,4 (values 3,1,5,8)
# Try k=1 (burst balloon 1 last):
k = 1: dp[0][5] = max(0, dp[0][1] + dp[1][5] + nums[0]*nums[1]*nums[5])
                = max(0, 0 + 159 + 1*3*1) = 162

# Try k=2 (burst balloon 2 last):
k = 2: dp[0][5] = max(162, dp[0][2] + dp[2][5] + nums[0]*nums[2]*nums[5])
                = max(162, 3 + 48 + 1*1*1) = max(162, 52) = 162

# Try k=3 (burst balloon 3 last):
k = 3: dp[0][5] = max(162, dp[0][3] + dp[3][5] + nums[0]*nums[3]*nums[5])
                = max(162, 30 + 40 + 1*5*1) = max(162, 75) = 162

# Try k=4 (burst balloon 4 last):
k = 4: dp[0][5] = max(162, dp[0][4] + dp[4][5] + nums[0]*nums[4]*nums[5])
                = max(162, 159 + 0 + 1*8*1) = max(162, 167) = 167
```

## **Final Result** 🎯
```python
return dp[0][n-1] = dp[0][5] = 167
```

**The optimal strategy**: Burst balloon at index 4 (value 8) **last**, which gives us the maximum of **167 coins**!

This corresponds to bursting the balloons in an order that leaves balloon 4 for the very end, maximizing the total coins collected.
---

# **Matrix Chain Multiplication - Optimal Partitioning** ⛓️
# **Matrix Chain Multiplication Problem** ⛓️

## **Problem Statement**

Given a sequence of matrices, find the most efficient way to multiply these matrices together. The problem is not actually to perform the multiplications, but merely to decide in which order to perform the multiplications.

We have many options to multiply a chain of matrices because matrix multiplication is associative. In other words, no matter how we parenthesize the product, the result will be the same. However, the order in which we parenthesize the product affects the number of simple scalar multiplications needed to compute the product, or the efficiency.

## **Input**
An array `p[]` which represents the chain of matrices such that the i-th matrix `Ai` has dimensions `p[i-1] x p[i]`.

## **Output**  
The minimum number of scalar multiplications needed to multiply the chain.

## **Cost of Matrix Multiplication**
To multiply two matrices of dimensions `(p x q)` and `(q x r)`, we need `p * q * r` scalar multiplications.

---

# **Examples** 📊
![](url.png)
Excellent question! Let me explain the **meaning and significance** of Matrix Chain Multiplication with clear examples and real-world context.

# **What is Matrix Chain Multiplication?** 🧮

## **Core Concept**
Matrix Chain Multiplication is about finding the **most efficient way to multiply a sequence of matrices** when you have multiple matrices to multiply together.

## **Key Mathematical Facts**

### **1. Matrix Multiplication Rules**
```python
# To multiply two matrices A(p×q) and B(q×r):
# - Result is a matrix C(p×r)  
# - Cost: p × q × r scalar multiplications

# Example: A(2×3) × B(3×4) = C(2×4)
# Cost: 2 × 3 × 4 = 24 scalar multiplications
```

### **2. Associative Property**
```python
# Matrix multiplication is associative (but not commutative):
# (A × B) × C = A × (B × C)  ✓ Same result
# But A × B ≠ B × A           ✗ Different results (usually)
```

### **3. Different Costs for Same Result**
The **same final result** can be computed with **vastly different computational costs** depending on the order of operations!

# **Concrete Example with Numbers** 📊

Let me show you with actual small matrices:

## **Given Matrices:**
```python
p = [2, 3, 4, 2]  # Represents:
# A1: 2×3 matrix = [[1,2,3],
#                   [4,5,6]]
#
# A2: 3×4 matrix = [[1,2,3,4],
#                   [5,6,7,8], 
#                   [9,10,11,12]]
#
# A3: 4×2 matrix = [[1,2],
#                   [3,4],
#                   [5,6],
#                   [7,8]]
```

## **Goal: Compute A1 × A2 × A3**

### **Option 1: ((A1 × A2) × A3)**
```python
# Step 1: A1 × A2
# (2×3) × (3×4) = (2×4) result
# Cost: 2 × 3 × 4 = 24 scalar multiplications
# 
# Actual computation involves 24 individual multiplications:
# result[0][0] = A1[0][0]*A2[0][0] + A1[0][1]*A2[1][0] + A1[0][2]*A2[2][0]
# result[0][1] = A1[0][0]*A2[0][1] + A1[0][1]*A2[1][1] + A1[0][2]*A2[2][1]
# ... (24 total multiplications)

# Step 2: (A1×A2) × A3  
# (2×4) × (4×2) = (2×2) result
# Cost: 2 × 4 × 2 = 16 scalar multiplications

# Total Cost: 24 + 16 = 40 scalar multiplications
```

### **Option 2: (A1 × (A2 × A3))**
```python
# Step 1: A2 × A3
# (3×4) × (4×2) = (3×2) result  
# Cost: 3 × 4 × 2 = 24 scalar multiplications

# Step 2: A1 × (A2×A3)
# (2×3) × (3×2) = (2×2) result
# Cost: 2 × 3 × 2 = 12 scalar multiplications

# Total Cost: 24 + 12 = 36 scalar multiplications
```

**Result: Option 2 is more efficient (36 vs 40 operations)!**

# **Real-World Significance** 🌍

## **1. Computer Graphics**
```python
# 3D transformations involve matrix chains:
# FinalPosition = Projection × View × Model × Vertex
# 
# For thousands of vertices, optimal ordering saves massive computation
# Bad ordering: millions of extra operations per frame
# Good ordering: smooth 60fps rendering
```

## **2. Machine Learning**
```python
# Neural networks have matrix chain multiplications:
# Output = W4 × (W3 × (W2 × (W1 × Input)))
#
# For large networks with millions of parameters:
# Bad ordering: hours of training time
# Good ordering: minutes of training time
```

## **3. Scientific Computing**
```python
# Physics simulations, weather forecasting, etc.
# Matrix chains in solving linear systems:
# Solution = A⁻¹ × B × C × D × ...
#
# Wrong ordering can make computations infeasible
```

# **Why the Problem is Hard** 🧠

## **Exponential Possibilities**
For n matrices, there are **exponentially many** ways to parenthesize:

```python
# Number of ways to parenthesize n matrices:
# n=2: 1 way
# n=3: 2 ways  
# n=4: 5 ways
# n=5: 14 ways
# n=10: 16,796 ways!
# n=20: 6,564,120,420 ways!!
```

**Dynamic Programming finds the optimal solution in O(n³) time instead of exponential brute force!**

# **The Algorithm's Beauty** ✨

The Matrix Chain DP algorithm elegantly solves what would otherwise be an intractable problem:

```python
# Instead of checking millions of parenthesizations:
# Systematically build optimal solutions from smaller to larger chains
# Each subproblem: "What's the best way to multiply matrices i through j?"
# Combine solutions: "Try all possible split points between i and j"
```

**This is why Matrix Chain Multiplication is a classic DP problem** - it demonstrates how **optimal substructure** and **overlapping subproblems** can transform an exponential problem into a polynomial one! 🎯

The problem teaches us that **sometimes the order of operations matters tremendously**, even when the final result is mathematically identical.

# Matrix Multiplication Compatibility ❌
## Short Answer: NO
A **2×3** matrix **cannot** be multiplied by a **5×10** matrix.
# Memory Trick 🧠
Think of matrix dimensions like **puzzle pieces**:

[A: m×n] × [B: p×q] = [Result: m×q]
       ↑       ↑
   These must match to "connect"
**The inner dimensions must be identical for the matrices to "fit together"!**
So for your example:
* **2×3** and **5×10** have inner dimensions **3** and **5**
* Since **3 ≠ 5**, they don't fit together
* **No multiplication possible** ❌

---

# **Constraints** 📋

- `1 ≤ n ≤ 100` (where n is the number of matrices)
- `1 ≤ p[i] ≤ 1000` (matrix dimensions)
- The matrices can actually be multiplied (dimensions are compatible)

---

# **Key Insights** 💡

1. **Associative Property**: `(A×B)×C = A×(B×C)` - result is same, but cost differs
2. **Optimal Substructure**: Optimal way to multiply `A[i...j]` depends on optimal ways to multiply `A[i...k]` and `A[k+1...j]`
3. **Overlapping Subproblems**: Same subproblems appear multiple times
4. **No Actual Multiplication**: We only calculate the minimum cost, not perform the multiplication

This is why it's a perfect **Interval DP** problem - we need to find the optimal way to "split" the matrix chain at each possible point! 🎯
## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find minimum scalar multiplications to multiply chain of matrices
  
- What are inputs/outputs?
  → Input: Array p where matrix i has dimensions p[i-1] × p[i]
  → Output: Integer (minimum multiplications needed)
  
- What are constraints?
  → Matrix multiplication is associative: (AB)C = A(BC)
  → Different parenthesizations have different costs
  → Cost of multiplying (p×q) by (q×r) = p*q*r
```

## **C - CLARIFY**
```python
# Example: p = [1,2,3,4] represents matrices:
# A1: 1×2, A2: 2×3, A3: 3×4
# Want: A1 × A2 × A3

# Option 1: ((A1×A2)×A3)
# Cost: (1×2×3) + (1×3×4) = 6 + 12 = 18

# Option 2: (A1×(A2×A3))  
# Cost: (2×3×4) + (1×2×4) = 24 + 8 = 32

# Optimal: Option 1 with cost 18
```

## **A - ANALYZE PATTERN**
```
- Pattern: INTERVAL DP with optimal partitioning
- Key insight: Try all possible split points in range
- State: dp[i][j] = min cost to multiply matrices from i to j
- Transition: dp[i][j] = min over all k of (dp[i][k] + dp[k+1][j] + cost)
```

## **P - PLAN**
```python
# Pseudocode:
# 1. dp[i][j] = min cost to multiply matrices from i to j
# 2. Base case: dp[i][i] = 0 (single matrix, no multiplication)
# 3. For each length and each split point k:
#    dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j])
# 4. Return dp[1][n-1]

# Time: O(n³), Space: O(n²)
```

## **R - REFACTOR**
```python
def matrixChainOrder(p):
    n = len(p) - 1  # number of matrices
    
    # dp[i][j] = min cost to multiply matrices from i to j
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    
    # Fill by increasing chain length
    for length in range(2, n + 1):  # chain length
        for i in range(1, n - length + 2):
            j = i + length - 1
# min cost to multiply matrices i through j
            dp[i][j] = float('inf') #
            
            # Try all possible split points
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j]
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[1][n]
```

## **T - TEST**
Excellent! Let me trace through the **Matrix Chain Multiplication** algorithm step-by-step with the example `p = [1, 2, 3, 4]`.

# **Step-by-Step Walkthrough** ⛓️

## **Initial Setup**
```python
p = [1, 2, 3, 4]  # Represents 3 matrices:
                  # A1: 1×2, A2: 2×3, A3: 3×4
n = len(p) - 1 = 3  # Number of matrices

# dp[i][j] = min cost to multiply matrices from i to j (1-indexed)
dp = [[0, 0, 0, 0],
      [0, 0, 0, 0],  # dp[1][1], dp[1][2], dp[1][3]
      [0, 0, 0, 0],  # dp[2][1], dp[2][2], dp[2][3]  
      [0, 0, 0, 0]]  # dp[3][1], dp[3][2], dp[3][3]
```

**Base Case**: `dp[i][i] = 0` for all i (single matrix needs no multiplication)

## **Length = 2 (Chain of 2 matrices)**
```python
for length in range(2, n + 1):  # length = 2
    for i in range(1, n - length + 2):  # i = 1, 2
```
**The** **+2** **comes from:**
* +1 to convert from ≤ to < (range is exclusive)
* +1 because we use 1-indexed matrices

### **i=1, j=2: Multiply matrices A1 × A2**
```python
j = i + length - 1 = 1 + 2 - 1 = 2
dp[1][2] = float('inf')

# Try all split points k in range [i, j) = [1, 2)
k = 1: cost = dp[1][1] + dp[2][2] + p[1-1] * p[1] * p[2]
            = 0 + 0 + p[0] * p[1] * p[2]
            = 0 + 0 + 1 * 2 * 3 = 6
       dp[1][2] = min(inf, 6) = 6
```
**Interpretation**: Cost to multiply A1(1×2) × A2(2×3) = 1×2×3 = 6

### **i=2, j=3: Multiply matrices A2 × A3**
```python
j = i + length - 1 = 2 + 2 - 1 = 3
dp[2][3] = float('inf')

# Try all split points k in range [i, j) = [2, 3)
k = 2: cost = dp[2][2] + dp[3][3] + p[2-1] * p[2] * p[3]
            = 0 + 0 + p[1] * p[2] * p[3]
            = 0 + 0 + 2 * 3 * 4 = 24
       dp[2][3] = min(inf, 24) = 24
```
**Interpretation**: Cost to multiply A2(2×3) × A3(3×4) = 2×3×4 = 24

**After Length=2:**
```
dp = [[0, 0,  0,  0],
      [0, 0,  6,  0],   # dp[1][2] = 6
      [0, 0,  0, 24],   # dp[2][3] = 24
      [0, 0,  0,  0]]
```

## **Length = 3 (Chain of 3 matrices)**
```python
for length in range(2, n + 1):  # length = 3
    for i in range(1, n - length + 2):  # i = 1
```

### **i=1, j=3: Multiply matrices A1 × A2 × A3**
```python
j = i + length - 1 = 1 + 3 - 1 = 3
dp[1][3] = float('inf')

# Try all split points k in range [i, j) = [1, 3) = [1, 2]
```

#### **k=1: Split as (A1) × (A2 × A3)**
```python
k = 1: cost = dp[1][1] + dp[2][3] + p[1-1] * p[1] * p[3]
            = dp[1][1] + dp[2][3] + p[0] * p[1] * p[3]
            = 0 + 24 + 1 * 2 * 4 = 32
       dp[1][3] = min(inf, 32) = 32
```
**Interpretation**: 
- First: A2×A3 costs 24 (already computed)
- Then: A1×(result of A2×A3) = A1(1×2) × (2×4 result) = 1×2×4 = 8
- Total: 24 + 8 = 32

#### **k=2: Split as (A1 × A2) × (A3)**
```python
k = 2: cost = dp[1][2] + dp[3][3] + p[1-1] * p[2] * p[3]
            = dp[1][2] + dp[3][3] + p[0] * p[2] * p[3]
            = 6 + 0 + 1 * 3 * 4 = 18
       dp[1][3] = min(32, 18) = 18
```
**Interpretation**:
- First: A1×A2 costs 6 (already computed)  
- Then: (result of A1×A2)×A3 = (1×3 result) × A3(3×4) = 1×3×4 = 12
- Total: 6 + 12 = 18

**After Length=3:**
```
dp = [[0, 0,  0,  0],
      [0, 0,  6, 18],   # dp[1][3] = 18
      [0, 0,  0, 24],
      [0, 0,  0,  0]]
```

## **Final Result** 🎯
```python
return dp[1][n] = dp[1][3] = 18
```

# **Optimal Solution Breakdown** 📊

The minimum cost is **18**, achieved by the parenthesization: **(A1 × A2) × A3**

**Step-by-step execution:**
1. **A1 × A2**: (1×2) × (2×3) → costs 1×2×3 = 6, produces 1×3 matrix
2. **(A1×A2) × A3**: (1×3) × (3×4) → costs 1×3×4 = 12, produces 1×4 matrix
3. **Total cost**: 6 + 12 = 18

**Alternative (sub-optimal):**
- **A1 × (A2 × A3)**: A2×A3 costs 24, then A1×result costs 8, total = 32

This demonstrates why **order matters** in matrix multiplication - same result, different computational costs! 🎯

The DP table systematically explores all possible ways to parenthesize and chooses the minimum cost path.

-------
Excellent! Let me demonstrate **UCAPRT framework** on **Stone Game (877)** - another classic **Interval DP** problem with game theory elements.

# **Stone Game (877) - Game Theory on Ranges** 🪨
Alice and Bob play a game with piles of stones. There are an **even** number of piles arranged in a row, and each pile has a **positive** integer number of stones piles[i].
The objective of the game is to end with the most stones. The **total** number of stones across all the piles is **odd**, so there are no ties.
Alice and Bob take turns, with **Alice starting first**. Each turn, a player takes the entire pile of stones either from the **beginning** or from the **end** of the row. This continues until there are no more piles left, at which point the person with the **most stones wins**.
Assuming Alice and Bob play optimally, return true *if Alice wins the game, or* false *if Bob wins*.

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Two players take turns picking stones from either end of a row
  → Each player plays optimally to maximize their own score
  → Determine if Player 1 (Alice) can win
  
- What are inputs/outputs?
  → Input: Array piles (stone counts in each pile)
  → Output: Boolean (true if Alice wins, false if Bob wins)
  
- What are constraints?
  → Can only pick from either end (first or last pile)
  → Both players play optimally
  → Total number of stones is odd (no ties)
  → Alice goes first
```

## **C - CLARIFY**
```python
# Example 1: piles = [5,3,4,5]
# Alice's turn: pick 5 (left) or 5 (right)
# If Alice picks left 5: remaining [3,4,5]
# Bob's turn: pick 3 (left) or 5 (right) - Bob picks 5 optimally
# Alice's turn: pick 3 (left) or 4 (right) - Alice picks 4 optimally  
# Bob gets: 3
# Final scores: Alice = 5+4 = 9, Bob = 5+3 = 8
# Alice wins! → Return true

# Example 2: piles = [3,7,2,3]
# Need to check all possible optimal plays...

# Edge cases:
# - Two piles: [5,1] → Alice picks 5, Bob gets 1 → Alice wins
# - All equal: [2,2,2,2] → Alice gets 2 piles, Bob gets 2 piles → Alice wins (goes first)
```

## **A - ANALYZE PATTERN**
```
- Pattern: INTERVAL DP + GAME THEORY
- Key insight: At each state, current player chooses optimally
- This is a "minimax" problem - maximize your gain, minimize opponent's gain
- State: dp[i][j] = max advantage first player can achieve in range [i,j]
- "Advantage" = (first player's score) - (second player's score) in this range
```

## **P - PLAN**
```python
# Pseudocode:
# dp[i][j] = max score advantage for current player in range [i,j]
# 
# Base case: dp[i][i] = piles[i] (single pile, current player takes it)
#
# Transition: Current player can pick from left or right
# - Pick left (i): get piles[i] + (-dp[i+1][j])
#   The -dp[i+1][j] because opponent plays optimally in remaining range
# - Pick right (j): get piles[j] + (-dp[i][j-1])
#
# dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])
#
# Final: dp[0][n-1] > 0 means Alice wins

# Time: O(n²), Space: O(n²)
```

## **R - REFACTOR**
```python
def stoneGame(piles):
    n = len(piles)
    
    # dp[i][j] = max score advantage for current player in range [i,j]
    dp = [[0] * n for _ in range(n)]
    
    # Base case: single pile
    for i in range(n):
        dp[i][i] = piles[i]
    
    # Fill by increasing length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            
            # Current player picks left or right optimally
            pick_left = piles[i] - dp[i + 1][j]   # Pick i, opponent plays [i+1,j]
            pick_right = piles[j] - dp[i][j - 1]  # Pick j, opponent plays [i,j-1]
            
            dp[i][j] = max(pick_left, pick_right)
    
    # Alice wins if she has positive advantage
    return dp[0][n - 1] > 0

# Alternative: Since total stones is odd, Alice always wins in this version
# But the DP approach works for general stone game variants
def stoneGameOptimized(piles):
    return True  # Alice always wins when total is odd and she goes first
```
```
# Even number of piles → equal number of odd/even positions
# Since total stones is odd:
# odd_sum + even_sum = odd number
# This means: odd_sum ≠ even_sum
# One group always has more stones than the other
# Alice moves first → she gets to choose her strategy
# She can observe both sums and pick the better group
# Bob is forced to react, not dictate
```
## **T - TEST**
```python
# Test piles = [5,3,4,5]:

# Base cases (length=1):
# dp[0][0] = 5, dp[1][1] = 3, dp[2][2] = 4, dp[3][3] = 5

# Length=2:
# dp[0][1]: max(5-dp[1][1], 3-dp[0][0]) = max(5-3, 3-5) = max(2, -2) = 2
# dp[1][2]: max(3-dp[2][2], 4-dp[1][1]) = max(3-4, 4-3) = max(-1, 1) = 1  
# dp[2][3]: max(4-dp[3][3], 5-dp[2][2]) = max(4-5, 5-4) = max(-1, 1) = 1

# Length=3:
# dp[0][2]: max(5-dp[1][2], 4-dp[0][1]) = max(5-1, 4-2) = max(4, 2) = 4
# dp[1][3]: max(3-dp[2][3], 5-dp[1][2]) = max(3-1, 5-1) = max(2, 4) = 4

# Length=4:  
# dp[0][3]: max(5-dp[1][3], 5-dp[0][2]) = max(5-4, 5-4) = max(1, 1) = 1

# Result: dp[0][3] = 1 > 0 → Alice wins ✓
```

---

# **Stone Game Walkthrough Example** 📊

Let me trace through `piles = [5,3,4,5]` step by step:

## **Initial DP Table**
```
     j: 0  1  2  3
i: 0    5  ?  ?  ?
   1    0  3  ?  ?  
   2    0  0  4  ?
   3    0  0  0  5
```

## **Length = 2**

### **dp[0][1]: Range [5,3]**
```python
# Current player can pick 5 or 3
# Pick left (5): get 5, opponent gets 3 from remaining [3] → advantage = 5-3 = 2
# Pick right (3): get 3, opponent gets 5 from remaining [5] → advantage = 3-5 = -2
# Optimal: pick left → dp[0][1] = 2
```

### **dp[1][2]: Range [3,4]**
```python
# Pick left (3): get 3, opponent gets 4 from remaining [4] → advantage = 3-4 = -1
# Pick right (4): get 4, opponent gets 3 from remaining [3] → advantage = 4-3 = 1  
# Optimal: pick right → dp[1][2] = 1
```

### **dp[2][3]: Range [4,5]**
```python
# Pick left (4): get 4, opponent gets 5 from remaining [5] → advantage = 4-5 = -1
# Pick right (5): get 5, opponent gets 4 from remaining [4] → advantage = 5-4 = 1
# Optimal: pick right → dp[2][3] = 1
```

## **Final Answer** 🎯
```python
dp[0][3] = 1 > 0  # Alice has positive advantage
return True       # Alice wins!
```

**Key Insight**: The "advantage" represents how much better the current player can do compared to their opponent when both play optimally. A positive value means the first player (Alice) wins! 🏆

This demonstrates the power of **interval DP in game theory** - we systematically explore all possible game states and determine optimal play at each level.
---

# **Common Interval DP Pattern Recognition** 🎯

## **Key Characteristics:**
1. **State Definition**: `dp[i][j]` represents optimal solution for range `[i,j]`
2. **Filling Order**: By increasing length/range size
3. **Transition**: Try all possible split points `k` in range `[i,j)`
4. **Base Cases**: Usually single elements or empty ranges

## **Template Recognition:**
```python
# Universal Interval DP Template
for length in range(2, n + 1):           # Increasing range size
    for i in range(n - length + 1):      # All possible start positions
        j = i + length - 1               # End position
        for k in range(i, j):            # All possible split points
            # Update dp[i][j] based on dp[i][k] and dp[k+1][j]
            dp[i][j] = optimize(dp[i][j], dp[i][k] + dp[k+1][j] + cost)
```

This pattern works for **any problem where you need to find optimal way to handle a contiguous range by considering all possible ways to split it!**

# UCAPRT - Linear DP
#interview/DSA/Dynamic
Excellent! Let me demonstrate the **UCAPRT framework** on all three House Robber problems. This will show you how to systematically approach related problems and recognize the pattern evolution.

# **House Robber I (198) - Linear Houses** 🏠

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Find maximum money that can be robbed without robbing adjacent houses
  
- What are inputs/outputs?
  → Input: Array of integers (money in each house)
  → Output: Integer (maximum money possible)
  
- What are constraints?
  → Cannot rob two adjacent houses
  → Houses are in a straight line
  → All values are non-negative
```

## **C - CLARIFY**
```python
# Example 1: [1,2,3,1] 
# Rob house 0 (money=1) and house 2 (money=3) → Total=4
# Can't rob [1,2] or [2,3] (adjacent)

# Example 2: [2,7,9,3,1]
# Rob house 0 (money=2), house 2 (money=9), house 4 (money=1) → Total=12
# Or rob house 1 (money=7) and house 3 (money=3) → Total=10
# Maximum is 12

# Edge cases:
# [] → 0
# [5] → 5  
# [5,1] → 5
# [1,5] → 5
```

## **A - ANALYZE PATTERN**
```python
"""
- Does this remind me of a known pattern?
  → YES! This is DYNAMIC PROGRAMMING optimization pattern
  
- What's the core operation needed?
  → At each house, decide: rob this house or skip it
  → Need to track maximum money possible up to current house
  
- Which data structure fits best?
  → Array for DP state or just two variables (space optimization)
  
- Why DP?
  → Optimal substructure: max money at house i depends on previous decisions
  → Overlapping subproblems: same subproblems solved multiple times
"""
```

## **P - PLAN**
```python
"""
Pseudocode:
1. For each house i, we have two choices:
   a) Rob house i: money[i] + max_money_up_to[i-2]
   b) Skip house i: max_money_up_to[i-1]
   
2. Take maximum of these two choices

State definition: dp[i] = maximum money robbed up to house i
Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
Base cases: dp[0] = nums[0], dp[1] = max(nums[0], nums[1])

Time: O(n), Space: O(n) → can optimize to O(1)
"""
```

## **R - REFACTOR**
```python
def rob_linear(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Space-optimized DP
    prev2 = nums[0]              # dp[i-2] 
    prev1 = max(nums[0], nums[1]) # dp[i-1]
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1
```

## **T - TEST**
```python
# Test case 1: [1,2,3,1]
# i=0: prev2=1, prev1=max(1,2)=2
# i=2: current=max(2, 1+3)=4, prev2=2, prev1=4  
# i=3: current=max(4, 2+1)=4, return 4 ✓

# Test case 2: [2,7,9,3,1]  
# prev2=2, prev1=max(2,7)=7
# i=2: current=max(7, 2+9)=11, prev2=7, prev1=11
# i=3: current=max(11, 7+3)=11, prev2=11, prev1=11  
# i=4: current=max(11, 11+1)=12, return 12 ✓
```

---

# **House Robber II (213) - Circular Houses** 🔄

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Same as House Robber I, but houses are arranged in a circle
  
- What are inputs/outputs?
  → Input: Array of integers (money in each house)
  → Output: Integer (maximum money possible)
  
- What are constraints?
  → Cannot rob two adjacent houses
  → Houses form a circle (first and last are adjacent!)
  → All values are non-negative
```

## **C - CLARIFY**
```python
# Example 1: [2,3,2]
# Houses: 2 - 3 - 2 (in circle)
# Can't rob house 0 and house 2 (they're adjacent in circle!)
# Options: rob house 1 only → money = 3

# Example 2: [1,2,3,1]  
# Houses: 1 - 2 - 3 - 1 (in circle)
# Option 1: rob [1,3] from middle → money = 4
# Option 2: rob [2] only → money = 2
# Can't rob house 0 and house 3 together (adjacent in circle)

# Edge cases:
# [1] → 1
# [1,2] → max(1,2) = 2
```

## **A - ANALYZE PATTERN**
```python
"""
- Does this remind me of a known pattern?
  → YES! This is House Robber I with a twist (circular constraint)
  
- What's the core operation needed?
  → Same DP logic, but handle the circular constraint
  → Key insight: If we rob house 0, we can't rob house n-1
  
- Which data structure fits best?
  → Reuse House Robber I solution with two scenarios
  
- Circular constraint handling:
  → Scenario 1: Consider houses [0...n-2] (exclude last house)
  → Scenario 2: Consider houses [1...n-1] (exclude first house)
  → Take maximum of both scenarios
"""
```

## **P - PLAN**
```python
"""
Pseudocode:
1. If only one house, return that value
2. If two houses, return maximum of the two
3. Otherwise, solve two subproblems:
   a) Rob houses [0...n-2] using House Robber I logic
   b) Rob houses [1...n-1] using House Robber I logic
4. Return maximum of the two results

Why this works:
- If we include house 0, we can't include house n-1
- If we include house n-1, we can't include house 0
- One of these scenarios must be optimal

Time: O(n), Space: O(1)
"""
```

## **R - REFACTOR**
```python
def rob_circular(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    if len(nums) == 2:
        return max(nums)
    
    # For 3+ houses, use the two-scenario approach
    def rob_range(start, end):
        prev2 = prev1 = 0
        for i in range(start, end):
            current = max(prev1, prev2 + nums[i])
            prev2 = prev1
            prev1 = current
        return prev1
    
    # Two scenarios due to circular constraint
    scenario1 = rob_range(0, len(nums) - 1)  # Exclude last house
    scenario2 = rob_range(1, len(nums))      # Exclude first house
    
    return max(scenario1, scenario2)

```

## **T - TEST**
```python
# Test case 1: [2,3,2]
# Scenario 1: rob_range(0,1) on [2,3] → max(2,3) = 3
# Scenario 2: rob_range(1,2) on [3,2] → max(3,2) = 3  
# Result: max(3,3) = 3 ✓

# Test case 2: [1,2,3,1]
# Scenario 1: rob_range(0,2) on [1,2,3] → rob houses 0,2 → 1+3=4
# Scenario 2: rob_range(1,3) on [2,3,1] → rob houses 1,3 → 2+1=3
# Result: max(4,3) = 4 ✓
```

---

# **House Robber III (337) - Binary Tree Houses** 🌳

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Houses are arranged in a binary tree
  → Cannot rob two directly connected houses (parent-child)
  → Find maximum money that can be robbed
  
- What are inputs/outputs?
  → Input: Root of binary tree (each node has money value)
  → Output: Integer (maximum money possible)
  
- What are constraints?
  → Cannot rob adjacent nodes (parent-child relationship)
  → Can rob grandparent-grandchild
  → All values are non-negative
```

## **C - CLARIFY**
```python
# Example 1: Tree [3,2,3,null,3,null,1]
#       3
#      / \
#     2   3
#      \   \
#       3   1
# 
# Option 1: Rob root(3) + grandchildren(3,1) = 7
# Option 2: Rob children(2,3)  = 5
# Maximum: 7

# Example 2: Tree [3,4,5,1,3,null,1]
#       3
#      / \
#     4   5  
#    / \   \
#   1   3   1
#
# Option 1: Rob root(3) + grandchildren(1,3,1) = 8
# Option 2: Rob children(4,5) = 9
# Maximum: 9

# Edge cases:
# null → 0
# single node → node.val
```

## **A - ANALYZE PATTERN**
```python
"""
- Does this remind me of a known pattern?
  → YES! This is TREE DYNAMIC PROGRAMMING
  → Similar to House Robber but on tree structure instead of linear
  
- What's the core operation needed?  
  → For each node, decide: rob this node or not
  → If rob current node, cannot rob its children
  → If don't rob current node, can consider robbing children
  
- Which data structure fits best?
  → Tree traversal with state tracking
  → Each node returns two values: (rob_this_node, dont_rob_this_node)
  
- Tree DP pattern:
  → Post-order traversal (process children first)
  → Combine results from left and right subtrees
"""
```

## **P - PLAN**
```python
"""
Pseudocode:
1. For each node, calculate two values:
   a) max_with_root: maximum money if we rob current node
   b) max_without_root: maximum money if we don't rob current node

2. Recurrence relations:
   max_with_root = node.val + left_without + right_without
   max_without_root = max(left_with, left_without) + max(right_with, right_without)

3. Base case: null node returns (0, 0)

4. Return max(max_with_root, max_without_root) for root

Helper function returns: (rob_this_node, dont_rob_this_node)
Time: O(n), Space: O(h) where h is height of tree
"""
```

## **R - REFACTOR**
```python
def rob_tree(root):
    def dfs(node):
        if not node:
            return 0, 0  # (rob_this, dont_rob_this)
        
        # Get results from children
        left_rob, left_not_rob = dfs(node.left)
        right_rob, right_not_rob = dfs(node.right)
        
        # If we rob current node, we can't rob children
        rob_current = node.val + left_not_rob + right_not_rob
        
        # If we don't rob current node, we can choose optimal from children
        not_rob_current = max(left_rob, left_not_rob) + max(right_rob, right_not_rob)
        
        return rob_current, not_rob_current
    
    return max(dfs(root))
```

## **T - TEST**
```python
# Test case 1: [3,2,3,null,3,null,1]
#       3
#      / \
#     2   3
#      \   \
#       3   1

# DFS traversal (post-order):
# Node 3 (leaf): returns (3, 0)
# Node 1 (leaf): returns (1, 0)  
# Node 2: rob=2+0=2, not_rob=max(3,0)=3 → returns (2, 3)
# Node 3: rob=3+0=3, not_rob=max(1,0)=1 → returns (3, 1)
# Root 3: rob=3+3+1=7, not_rob=max(2,3)+max(3,1)=3+3=6 → returns (7, 6)
# Result: max(7, 6) = 7
```

---

# **Pattern Recognition Summary** 🎯

## **The Evolution Pattern:**
```python
HOUSE_ROBBER_PATTERN = {
    "Core Concept": "Skip adjacent elements optimization",
    
    "Version 1 (Linear)": {
        "Structure": "Array/List",
        "Constraint": "Can't take adjacent indices",
        "Solution": "1D DP with two states"
    },
    
    "Version 2 (Circular)": {
        "Structure": "Circular Array", 
        "Constraint": "Can't take adjacent + first/last adjacent",
        "Solution": "Two scenarios of 1D DP"
    },
    
    "Version 3 (Tree)": {
        "Structure": "Binary Tree",
        "Constraint": "Can't take parent-child nodes", 
        "Solution": "Tree DP with two states per node"
    }
}
```

## **Key Insights:**
1. **Same core problem** with different data structures
2. **Pattern recognition** helps you see: "Oh, this is just House Robber on a tree!"
3. **Template adaptation** rather than solving from scratch
4. **State tracking** is consistent: (include current, exclude current)

This demonstrates how **UCAPRT** helps you:
- **Recognize patterns** across different problem variations
- **Adapt solutions** rather than starting from zero
- **Build confidence** in tackling "new" problems that are actually familiar patterns

Would you like me to show you how to apply this same framework to other problem families? 🚀
Excellent! Let me demonstrate **UCAPRT framework** on these three **Linear DP** problems. You'll see how they share the same underlying pattern but with different contexts and constraints.

# **Climbing Stairs (70) - Fibonacci Variant** 🪜

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Count the number of distinct ways to reach the top of n stairs
  
- What are inputs/outputs?
  → Input: Integer n (number of stairs)
  → Output: Integer (number of distinct ways)
  
- What are constraints?
  → Can climb either 1 or 2 steps at a time
  → Need to reach exactly step n
  → All positive integers
```

## **C - CLARIFY**
```python
# Example 1: n = 2
# Ways: [1,1] or [2] → 2 ways

# Example 2: n = 3  
# Ways: [1,1,1], [1,2], [2,1] → 3 ways

# Example 3: n = 4
# Ways: [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2] → 5 ways

# Pattern emerging: 1, 1, 2, 3, 5, 8... (Fibonacci!)

# Edge cases:
# n = 0 → 1 way (do nothing)
# n = 1 → 1 way [1]
# n = 2 → 2 ways [1,1], [2]
```

## **A - ANALYZE PATTERN**
```python
"""
- Does this remind me of a known pattern?
  → YES! This is COUNTING DP (ways to reach a state)
  → Also recognizable as Fibonacci sequence
  
- What's the core operation needed?
  → Count all possible ways to reach step n
  → At each step, we can come from step (i-1) or step (i-2)
  
- Which data structure fits best?
  → Just need to track previous states (can optimize to O(1) space)
  
- Why DP?
  → Optimal substructure: ways to reach step i = ways to reach (i-1) + ways to reach (i-2)
  → Overlapping subproblems: same steps calculated multiple times
"""
```

## **P - PLAN**
```python
"""
Pseudocode:
1. To reach step i, we can either:
   a) Take 1 step from step (i-1)
   b) Take 2 steps from step (i-2)
   
2. Total ways = ways_to_reach(i-1) + ways_to_reach(i-2)

State definition: dp[i] = number of ways to reach step i
Recurrence: dp[i] = dp[i-1] + dp[i-2]
Base cases: dp[0] = 1, dp[1] = 1

Time: O(n), Space: O(n) → can optimize to O(1)
"""
```

## **R - REFACTOR**
```python
def climb_stairs(n):
    if n <= 1:
        return 1
    
    # Space-optimized Fibonacci
    prev2 = 1  # dp[i-2], ways to reach step 0
    prev1 = 1  # dp[i-1], ways to reach step 1
    
    for i in range(2, n + 1):
        current = prev1 + prev2  # ways to reach step i
        prev2 = prev1
        prev1 = current
    
    return prev1
```

## **T - TEST**
```python
# Test case 1: n = 3
# prev2=1, prev1=1
# i=2: current=1+1=2, prev2=1, prev1=2
# i=3: current=2+1=3, return 3 ✓

# Test case 2: n = 4  
# prev2=1, prev1=1
# i=2: current=2, prev2=1, prev1=2
# i=3: current=3, prev2=2, prev1=3  
# i=4: current=5, return 5 ✓

# Sequence: 1,1,2,3,5,8... Perfect Fibonacci!
```

---

# **Decode Ways (91) - String Partitioning** 🔤

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Count ways to decode a string of digits into letters
  → 'A'=1, 'B'=2, ..., 'Z'=26
  
- What are inputs/outputs?
  → Input: String of digits
  → Output: Integer (number of ways to decode)
  
- What are constraints?
  → Valid single digits: 1-9 (not 0)
  → Valid double digits: 10-26
  → Leading zeros are invalid
```

## **C - CLARIFY**
```python
# Example 1: "12"
# Ways: "1,2" → "AB" or "12" → "L" → 2 ways

# Example 2: "226"  
# Ways: 
# - "2,2,6" → "BBF"
# - "22,6" → "VF"  
# - "2,26" → "BZ"
# Total: 3 ways

# Example 3: "06"
# Invalid: can't start with 0 → 0 ways

# Example 4: "10"
# Ways: "10" → "J" (can't split as "1,0" because 0 is invalid) → 1 way

# Edge cases:
# "" → 1 way (empty string)
# "0" → 0 ways
# "30" → 0 ways (30 > 26 and ends with 0)
```

## **A - ANALYZE PATTERN**
```python
"""
- Does this remind me of a known pattern?
  → YES! This is STRING PARTITIONING DP
  → Similar to Climbing Stairs but with validity constraints
  
- What's the core operation needed?
  → At each position, decide: take 1 digit or 2 digits
  → Count valid partitions of the string
  
- Which data structure fits best?
  → DP array or space-optimized variables
  
- Key insight:
  → dp[i] = ways to decode string[0:i]
  → Can extend from dp[i-1] (take 1 digit) + dp[i-2] (take 2 digits)
  → But only if the digits form valid letters (1-26)
"""
```

## **P - PLAN**
```python
"""
Pseudocode:
1. For each position i, we can:
   a) Take single digit s[i-1] if it's valid (1-9)
   b) Take double digit s[i-2:i] if it's valid (10-26)
   
2. dp[i] = (dp[i-1] if single_valid) + (dp[i-2] if double_valid)

State definition: dp[i] = number of ways to decode string[0:i]
Recurrence: dp[i] = (dp[i-1] if valid_single) + (dp[i-2] if valid_double)
Base cases: dp[0] = 1 (empty string), dp[1] depends on first character

Time: O(n), Space: O(n) → can optimize to O(1)
"""
```

## **R - REFACTOR**
```python
def decode_ways(s):
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    # dp[i] represents ways to decode s[0:i]
    prev2 = 1  # dp[i-2], take current and prev as double digits
    prev1 = 1  # dp[i-1], take current as single digit
    
    for i in range(1, n):
        current = 0
        
        # Take single digit s[i]
        if s[i] != '0':
            current += prev1
        
        # Take double digit s[i-1:i+1]
        two_digit = int(s[i-1:i+1])
        if 10 <= two_digit <= 26:
            current += prev2
        
        prev2 = prev1
        prev1 = current
    
    return prev1
```

## **T - TEST**
```python
# Test case 1: "12"
# prev2=1, prev1=1 (for first char '1')
# i=1, s[i]='2':
#   - Single '2': valid, current += prev1 = 1
#   - Double '12': valid (12 ≤ 26), current += prev2 = 1
#   - current = 2, return 2 ✓

# Test case 2: "226"
# prev2=1, prev1=1
# i=1, s[i]='2': current = 1 + 1 = 2, prev2=1, prev1=2
# i=2, s[i]='6': 
#   - Single '6': valid, current += 2 = 2
#   - Double '26': valid, current += 1 = 3
#   - return 3 ✓

# Test case 3: "06"
# s[0]='0', return 0 immediately ✓
```

---

# **Word Break (139) - Substring Matching** 📝

## **U - UNDERSTAND**
```
- What exactly is being asked?
  → Determine if string can be segmented into dictionary words
  
- What are inputs/outputs?
  → Input: String s, List of dictionary words
  → Output: Boolean (true if can be segmented)
  
- What are constraints?
  → Each word in dictionary can be used multiple times
  → Must use entire string (no leftover characters)
  → Dictionary words are distinct
```

## **C - CLARIFY**
```python
# Example 1: s = "leetcode", wordDict = ["leet","code"]
# Segmentation: "leet" + "code" → True

# Example 2: s = "applepenapple", wordDict = ["apple","pen"]  
# Segmentation: "apple" + "pen" + "apple" → True

# Example 3: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
# Try: "cats" + "andog" (andog not in dict)
# Try: "cat" + "sandog" (sandog not in dict)  
# No valid segmentation → False

# Edge cases:
# s = "", wordDict = [] → True (empty string)
# s = "a", wordDict = ["a"] → True
# s = "a", wordDict = ["b"] → False
```

## **A - ANALYZE PATTERN**
```python
"""
- Does this remind me of a known pattern?
  → YES! This is STRING SEGMENTATION DP
  → Similar to Decode Ways but checking against dictionary
  
- What's the core operation needed?
  → For each position, check if we can form valid segmentation
  → Try all possible word endings at current position
  
- Which data structure fits best?
  → DP array + HashSet for fast dictionary lookup
  
- Key insight:
  → dp[i] = can we segment string[0:i]
  → dp[i] = True if exists j where dp[j] = True and string[j:i] in dictionary
"""
```

## **P - PLAN**
```python
"""
Pseudocode:
1. For each position i (0 to n):
   dp[i] represents whether string[0:i] can be segmented
   
2. For each position i, try all possible starting positions j (0 to i):
   if dp[j] is True and string[j:i] is in dictionary:
       dp[i] = True
       
3. Return dp[n]

State definition: dp[i] = whether string[0:i] can be segmented
Recurrence: dp[i] = OR over all j: (dp[j] AND string[j:i] in dict)
Base case: dp[0] = True (empty string can always be segmented)

Time: O(n² + m) where m is total length of dictionary words
Space: O(n + m)
"""
```

## **R - REFACTOR**
```python
def word_break(s, word_dict):
    word_set = set(word_dict)  # O(1) lookup
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True  # Empty string can be segmented
    
    for i in range(1, n + 1):
        # Try all possible starting positions for current segment
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break  # Found one valid segmentation
    
    return dp[n]

# Alternative optimization: iterate through dictionary words
def word_break_optimized(s, word_dict):
    word_set = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for word in word_set:
            word_len = len(word)
            if (i >= word_len and 
                dp[i - word_len] and #to check if prev is True
                s[i - word_len:i] == word):
                dp[i] = True
                break
    
    return dp[n]
```

## **T - TEST**
```python
# Test case 1: s = "leetcode", wordDict = ["leet","code"]
# dp = [T,F,F,F,F,F,F,F,F] initially
# i=1: s[0:1]="l" not in dict → dp[1]=F
# i=2: s[0:2]="le" not in dict → dp[2]=F  
# i=3: s[0:3]="lee" not in dict → dp[3]=F
# i=4: s[0:4]="leet" in dict and dp[0]=T → dp[4]=T
# i=5: s[1:5]="eetc" not in dict, s[4:5]="c" not in dict → dp[5]=F
# ...
# i=8: s[4:8]="code" in dict and dp[4]=T → dp[8]=T ✓

# Test case 2: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
# i=3: s[0:3]="cat" in dict → dp[3]=T
# i=4: s[0:4]="cats" in dict → dp[4]=T  
# i=7: s[4:7]="and" in dict and dp[4]=T → dp[7]=T
# i=9: s[7:9]="og" not in dict, no valid segmentation → dp[9]=F ✓
```

---

# **Pattern Recognition Summary** 🎯

## **The Linear DP Evolution:**
```python
LINEAR_DP_PATTERN = {
    "Core Concept": "Build solution step by step using previous states",
    
    "Climbing Stairs": {
        "State": "dp[i] = ways to reach step i",
        "Transition": "dp[i] = dp[i-1] + dp[i-2]",
        "Type": "Counting DP",
        "Constraint": "Can take 1 or 2 steps"
    },
    
    "Decode Ways": {
        "State": "dp[i] = ways to decode string[0:i]", 
        "Transition": "dp[i] = dp[i-1] + dp[i-2] (if valid)",
        "Type": "Counting DP with constraints",
        "Constraint": "Valid single/double digit letters"
    },
    
    "Word Break": {
        "State": "dp[i] = can segment string[0:i]",
        "Transition": "dp[i] = OR(dp[j] AND string[j:i] in dict)",
        "Type": "Boolean DP",
        "Constraint": "Must use dictionary words"
    }
}
```

## **Common Template Recognition:**
```python
# Generic Linear DP Template
def linear_dp_template(input_data, constraints):
    n = len(input_data)
    dp = initialize_dp_array(n)
    
    # Base cases
    dp[0] = base_case_0
    if n > 1:
        dp[1] = base_case_1
    
    # Fill DP table
    for i in range(2, n + 1):
        # Try all valid previous states
        for j in valid_previous_states(i):
            if is_valid_transition(j, i, constraints):
                dp[i] = combine(dp[i], dp[j], transition_cost(j, i))
    
    return dp[n]
```

## **Key Insights:**
1. **Same structural pattern** but different state meanings
2. **Counting vs Boolean DP** - different combination operations
3. **Constraint handling** varies but DP structure remains similar
4. **Space optimization** possible in all three (O(n) → O(1))

## **When you see a new Linear DP problem:**
```python
RECOGNITION_CHECKLIST = [
    "Can I build solution using previous smaller problems?",
    "Am I counting ways or finding optimal value or checking possibility?", 
    "What are the valid transitions from previous states?",
    "What constraints limit my transitions?",
    "Can I optimize space by only keeping recent states?"
]
```

This demonstrates how **UCAPRT** helps you:
- **Recognize the underlying pattern** across different contexts
- **Adapt the same template** with different state definitions
- **Handle constraints systematically** 
- **Optimize solutions** consistently

Would you like me to show you how this pattern extends to **2D DP problems** like Unique Paths, Edit Distance, etc.? 🚀
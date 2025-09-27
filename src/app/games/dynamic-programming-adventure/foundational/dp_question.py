#Topic - Tree DP
def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)  # (rob_this, not_rob_this)
        
        # Get optimal solutions from children
        left_rob, left_not_rob = dfs(node.left)
        right_rob, right_not_rob = dfs(node.right)
        
        # If we rob current node, cannot rob children
        rob_current = node.val + left_not_rob + right_not_rob
        
        # If we don't rob current, take best from children
        not_rob_current = max(left_rob, left_not_rob) + max(right_rob, right_not_rob)
        
        return (rob_current, not_rob_current)
    
    rob_root, not_rob_root = dfs(root)
    return max(rob_root, not_rob_root)

# Alternative: Single return value with memoization
def robMemo(root):
    memo = {}
    
    def dfs(node):
        if not node:
            return 0
        if node in memo:
            return memo[node]
        
        # Option 1: Rob current node
        rob_current = node.val
        if node.left:
            rob_current += dfs(node.left.left) + dfs(node.left.right)
        if node.right:
            rob_current += dfs(node.right.left) + dfs(node.right.right)
        
        # Option 2: Don't rob current node
        not_rob_current = dfs(node.left) + dfs(node.right)
        
        memo[node] = max(rob_current, not_rob_current)
        return memo[node]
    
    return dfs(root)

def maxPathSum(root):
    max_sum = float('-inf')
    
    def max_gain(node):
        nonlocal max_sum
        
        if not node:
            return 0
        
        # Maximum gain from left and right subtrees (ignore negative gains)
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)
        
        # Maximum path sum through current node as highest point
        path_through_current = node.val + left_gain + right_gain
        
        # Update global maximum
        max_sum = max(max_sum, path_through_current)
        
        # Return maximum gain if we continue path through current node
        # (can only choose one child to continue upward)
        return node.val + max(left_gain, right_gain)
    
    max_gain(root)
    return max_sum

# Alternative: More explicit state tracking
def maxPathSumExplicit(root):
    def dfs(node):
        if not node:
            return (0, float('-inf'))  # (max_down, max_path)
        
        left_down, left_path = dfs(node.left)
        right_down, right_path = dfs(node.right)
        
        # Maximum gain going down from current node
        max_down = node.val + max(0, left_down, right_down)
        
        # Maximum path through current node
        path_through_current = node.val + max(0, left_down) + max(0, right_down)
        
        # Overall maximum path in subtree
        max_path = max(left_path, right_path, path_through_current)
        
        return (max_down, max_path)
    
    _, result = dfs(root)
    return result

#Topic - 2D grid DP
def unique_paths(m, n):
    # Space-optimized solution using 1D array
    dp = [1] * n  # First row: all cells have 1 path
    
    for i in range(1, m):
        for j in range(1, n):
            dp[j] = dp[j] + dp[j-1]  # dp[j] from top, dp[j-1] from left
    
    return dp[n-1]

# Alternative: Mathematical solution (Combinatorics)
def unique_paths_math(m, n):
    from math import comb
    return comb(m + n - 2, m - 1)

# Full 2D DP for clarity
def unique_paths_2d(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]

def min_path_sum(grid):
    if not grid or not grid[0]:
        return 0
    
    m, n = len(grid), len(grid[0])
    
    # Space-optimized: modify input grid in-place
    # Initialize first row (can only come from left)
    for j in range(1, n):
        grid[0][j] += grid[0][j-1]
    
    # Initialize first column (can only come from top)
    for i in range(1, m):
        grid[i][0] += grid[i-1][0]
    
    # Fill rest of grid
    for i in range(1, m):
        for j in range(1, n):
            grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    
    return grid[m-1][n-1]

# Space-optimized with separate DP array
def min_path_sum_optimized(grid):
    m, n = len(grid), len(grid[0])
    dp = [float('inf')] * n
    dp[0] = 0
    
    for i in range(m):
        dp[0] += grid[i][0]  # Update first column
        for j in range(1, n):
            dp[j] = min(dp[j], dp[j-1]) + grid[i][j]
    
    return dp[n-1]

def maximal_rectangle(matrix):
    if not matrix or not matrix[0]:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    heights = [0] * n
    max_area = 0
    
    for i in range(m):
        # Update heights for current row
        for j in range(n):
            if matrix[i][j] == '1':
                heights[j] += 1
            else:
                heights[j] = 0
        
        # Find max rectangle in current histogram
        max_area = max(max_area, largest_rectangle_in_histogram(heights))
    
    return max_area

def largest_rectangle_in_histogram(heights):
    stack = []
    max_area = 0
    
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    
    while stack:
        height = heights[stack.pop()]
        width = len(heights) if not stack else len(heights) - stack[-1] - 1
        max_area = max(max_area, height * width)
    
    return max_area

# Alternative: DP approach
def maximal_rectangle_dp(matrix):
    if not matrix:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    left = [0] * n    # Left boundary of rectangle ending at each column
    right = [n] * n   # Right boundary of rectangle ending at each column  
    height = [0] * n  # Height of rectangle ending at each column
    max_area = 0
    
    for i in range(m):
        cur_left = 0
        cur_right = n
        
        # Update height
        for j in range(n):
            if matrix[i][j] == '1':
                height[j] += 1
            else:
                height[j] = 0
        
        # Update left boundary
        for j in range(n):
            if matrix[i][j] == '1':
                left[j] = max(left[j], cur_left)
            else:
                left[j] = 0
                cur_left = j + 1
        
        # Update right boundary
        for j in range(n-1, -1, -1):
            if matrix[i][j] == '1':
                right[j] = min(right[j], cur_right)
            else:
                right[j] = n
                cur_right = j
        
        # Calculate max area for current row
        for j in range(n):
            max_area = max(max_area, (right[j] - left[j]) * height[j])
    
    return max_area

def cherry_pickup(grid):
    n = len(grid)
    # Use memoization with (r1, c1, r2, c2) state
    memo = {}
    
    def dp(r1, c1, r2, c2):
        # Both people should reach (n-1, n-1)
        if (r1 == n-1 and c1 == n-1 and 
            r2 == n-1 and c2 == n-1):
            return grid[n-1][n-1]
        
        # Out of bounds or hit thorn
        if (r1 >= n or c1 >= n or r2 >= n or c2 >= n or
            grid[r1][c1] == -1 or grid[r2][c2] == -1):
            return float('-inf')
        
        if (r1, c1, r2, c2) in memo:
            return memo[(r1, c1, r2, c2)]
        
        # Current cherries
        cherries = grid[r1][c1]
        if (r1, c1) != (r2, c2):  # Different cells
            cherries += grid[r2][c2]
        
        # Try all possible moves
        # Person 1: right or down, Person 2: right or down
        cherries += max(
            dp(r1, c1+1, r2, c2+1),  # Both go right
            dp(r1, c1+1, r2+1, c2),  # P1 right, P2 down
            dp(r1+1, c1, r2, c2+1),  # P1 down, P2 right  
            dp(r1+1, c1, r2+1, c2)   # Both go down
        )
        
        memo[(r1, c1, r2, c2)] = cherries
        return cherries
    
    result = dp(0, 0, 0, 0)
    return max(0, result)  # Return 0 if no valid path

# Space-optimized version using the fact that r1 + c1 = r2 + c2
def cherry_pickup_optimized(grid):
    n = len(grid)
    memo = {}
    
    def dp(r1, c1, c2):
        r2 = r1 + c1 - c2  # Derived from r1 + c1 = r2 + c2 Equal Steps Constraint
        
        if (r1 == n-1 and c1 == n-1):
            return grid[n-1][n-1]
        
        if (r1 >= n or c1 >= n or r2 >= n or c2 >= n or
            grid[r1][c1] == -1 or grid[r2][c2] == -1):
            return float('-inf')
        
        if (r1, c1, c2) in memo:
            return memo[(r1, c1, c2)]
        
        cherries = grid[r1][c1]
        if c1 != c2:  # only compare col as if c1=c2, r1=r2 by 
#  r2 = r1 + c1 - c1 = r1, in this case comparing both or either r/ c would works

            cherries += grid[r2][c2]
        
        cherries += max(
            dp(r1, c1+1, c2+1),    # Both right
            dp(r1, c1+1, c2),      # P1 right, P2 down
            dp(r1+1, c1, c2+1),    # P1 down, P2 right
            dp(r1+1, c1, c2)       # Both down
        )
        
        memo[(r1, c1, c2)] = cherries
        return cherries
    
    result = dp(0, 0, 0)
    return max(0, result)

#topic - string DP
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    
    # dp[i][j] = min operations to transform word1[:i] to word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases
    for i in range(m + 1):
        dp[i][0] = i  # Delete all characters from word1
    for j in range(n + 1):
        dp[0][j] = j  # Insert all characters to match word2
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # Characters match, no operation
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # Delete word1[i-1]
                    dp[i][j - 1],      # Insert word2[j-1]
                    dp[i - 1][j - 1]   # Replace word1[i-1] with word2[j-1]
                )
    
    return dp[m][n]

def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    
    # dp[i][j] = length of LCS for text1[:i] and text2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases already handled by initialization (all zeros)
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1  # Characters match
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # Skip one char
    
    return dp[m][n]

# Space optimized version (only need previous row)
def longestCommonSubsequenceOptimized(text1, text2):
    m, n = len(text1), len(text2)
    
    # Only keep current and previous row
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = max(prev[j], curr[j - 1])
        
        prev, curr = curr, prev
    
    return prev[n]

def isMatch(s, p):
    m, n = len(s), len(p)
    
    # dp[i][j] = whether s[:i] matches p[:j]
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    
    # Base case: empty string matches empty pattern
    dp[0][0] = True
    
    # Handle patterns like "a*", "a*b*" that can match empty string
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] != '*':
                # Normal character or '.'
                if s[i - 1] == p[j - 1] or p[j - 1] == '.':
                    dp[i][j] = dp[i - 1][j - 1]
            else:
                # Handle '*' wildcard
                # Option 1: Use * for 0 occurrences (skip pattern char*)
                dp[i][j] = dp[i][j - 2]
                
                # Option 2: Use * for 1+ occurrences  
                if s[i - 1] == p[j - 2] or p[j - 2] == '.':
                    dp[i][j] = dp[i][j] or dp[i - 1][j]
    
    return dp[m][n]

# Alternative: Cleaner handling of star patterns
def isMatchCleaner(s, p):
    def dp(i, j):
        # Memoization with recursion
        if j == len(p):
            return i == len(s)
        
        first_match = i < len(s) and (s[i] == p[j] or p[j] == '.')
        
        if j + 1 < len(p) and p[j + 1] == '*':
            # Two choices with '*'
            return dp(i, j + 2) or (first_match and dp(i + 1, j))
        else:
            # Normal character matching
            return first_match and dp(i + 1, j + 1)
    
    return dp(0, 0)

#Topic - Digit DP
def numDupDigitsAtMostN(N):
    # Convert N to digit array
    digits = []
    temp = N
    while temp:
        digits.append(temp % 10)
        temp //= 10
    digits.reverse()
    
    n = len(digits)
    memo = {}
    
    def dp(pos, tight, started, mask):
        if pos == n:
            return 1 if started else 0
        
        if (pos, tight, started, mask) in memo:
            return memo[(pos, tight, started, mask)]
        
        limit = digits[pos] if tight else 9
        result = 0
        
        # Try each possible digit
        for digit in range(0, limit + 1):
            new_tight = tight and (digit == limit)
            new_started = started or (digit > 0)
            new_mask = mask
            
            # Check if digit is already used (only after we start the number)
            if new_started:
                if mask & (1 << digit):  # Digit already used
                    continue
                new_mask = mask | (1 << digit)
            
            result += dp(pos + 1, new_tight, new_started, new_mask)
        
        memo[(pos, tight, started, mask)] = result
        return result
    
    # Count numbers without repeated digits
    without_repeats = dp(0, True, False, 0)
    
    # Total numbers from 1 to N minus numbers without repeats
    return N - without_repeats

# Alternative: More explicit handling
def numDupDigitsExplicit(N):
    def count_without_repeats(max_num):
        if max_num <= 0:
            return 0
        
        digits = list(str(max_num))
        n = len(digits)
        memo = {}
        
        def dfs(pos, mask, tight, started):
            if pos == n:
                return started  # Count if we've formed a valid number
            
            state = (pos, mask, tight, started)
            if state in memo:
                return memo[state]
            
            upper_limit = int(digits[pos]) if tight else 9
            result = 0
            
            for d in range(0, upper_limit + 1):
                if started and (mask & (1 << d)):  # Skip if digit used
                    continue
                
                new_mask = mask | (1 << d) if (started or d > 0) else mask
                new_tight = tight and (d == upper_limit)
                new_started = started or (d > 0)
                
                result += dfs(pos + 1, new_mask, new_tight, new_started)
            
            memo[state] = result
            return result
        
        return dfs(0, 0, True, False)
    
    return N - count_without_repeats(N)

from functools import lru_cache
from math import factorial

def perm(n, r):
    """Calculate P(n,r) = n! / (n-r)!"""
    if r > n or r < 0:
        return 0
    return factorial(n) // factorial(n - r)

class Solution:
    def numDupDigitsAtMostN(self, N):
        L = list(map(int, str(N + 1)))
        n = len(L)
        res = sum(9 * perm(9, i) for i in range(n - 1))
        s = set()
        for i, x in enumerate(L):
            for y in range(i == 0, x):
                if y not in s:
                    res += perm(9 - i, n - i - 1)
            if x in s: break
            s.add(x)
        return N - res

def findIntegers(num):
    # Convert to binary string
    binary = bin(num)[2:]  # Remove '0b' prefix
    n = len(binary)
    memo = {}
    
    def dp(pos, tight, prev_bit):
        if pos == n:
            return 1  # Valid number formed
        
        if (pos, tight, prev_bit) in memo:
            return memo[(pos, tight, prev_bit)]
        
        limit = int(binary[pos]) if tight else 1
        result = 0
        
        # Try bit 0
        result += dp(pos + 1, tight and (0 == int(binary[pos])), 0)
        
        # Try bit 1 (only if previous bit wasn't 1)
        if prev_bit != 1 and limit >= 1:
            result += dp(pos + 1, tight and (1 == int(binary[pos])), 1)
        
        memo[(pos, tight, prev_bit)] = result
        return result
    
    return dp(0, True, 0)

# Alternative: Fibonacci-based approach (more elegant)
def findIntegersFib(num):
    # Key insight: This is related to Fibonacci sequence!
    # f(n) = f(n-1) + f(n-2) for numbers without consecutive 1s
    
    binary = bin(num)[2:]
    n = len(binary)
    
    # Precompute Fibonacci-like sequence
    # fib[i] = Append 0 to ANY previous pattern
	# fib2[i] = Append 1 only to patterns ending with 0


    fib = [0] * (n + 2)
    fib2 = [0] * (n + 2)
    
    fib[0] = fib2[0] = 1
    for i in range(1, n + 2):
        fib[i] = fib[i-1] + fib2[i-1]
        fib2[i] = fib[i-1]
    
    # Count valid numbers ≤ num using digit DP
    result = 0
    prev_bit = 0
    
    for i in range(n):
        if binary[i] == '1':
            # "How many valid ways to fill (n - i - 1) remaining positions"
            result += fib[n - i - 1]
            
            # Check if we can continue (no consecutive 1s)
            if prev_bit == 1:
                return result  # Cannot place 1 after 1
            
            prev_bit = 1
        else:
            prev_bit = 0
    
    return result + 1  # +1 for the number itself

def atMostNGivenDigitSet(digits, N):
    str_n = str(N)
    n = len(str_n)
    digit_set = set(int(d) for d in digits)
    memo = {}
    
    def dp(pos, tight, started):
        if pos == n:
            return 1 if started else 0
        
        if (pos, tight, started) in memo:
            return memo[(pos, tight, started)]
        
        result = 0
        limit = int(str_n[pos]) if tight else 9
        
        # Try not placing any digit (leading zeros)
        if not started:
            result += dp(pos + 1, False, False)
        
        # Try each digit from our set
        for digit in digit_set:
            if digit > limit:
                break  # No point trying larger digits
            
            new_tight = tight and (digit == limit)
            new_started = True  # We're placing a digit
            
            result += dp(pos + 1, new_tight, new_started)
        
        memo[(pos, tight, started)] = result
        return result
    
    return dp(0, True, False)

# Alternative: Separate counting for different lengths
def atMostNOptimized(digits, N):
    str_n = str(N)
    n = len(str_n)
    k = len(digits)
    
    # Count numbers with fewer digits
    result = 0
    for i in range(1, n):
        result += k ** i
    
    # Count numbers with same number of digits but ≤ N
    def count_same_length():
        memo = {}
        
        def dp(pos, tight):
            if pos == n:
                return 1
            
            if (pos, tight) in memo:
                return memo[(pos, tight)]
            
            count = 0
            limit = int(str_n[pos]) if tight else 9
            
            for digit_str in digits:
                digit = int(digit_str)
                if digit > limit:
                    break
                
                new_tight = tight and (digit == limit)
                count += dp(pos + 1, new_tight)
            
            memo[(pos, tight)] = count
            return count
        
        return dp(0, True)
    
    result += count_same_length()
    return result

# Clean version
def atMostNClean(digits, N):
    digits = sorted(digits)  # Ensure sorted order
    str_n = str(N)
    n = len(str_n)
    
    @lru_cache(None)
    def dp(pos, tight, started):
        if pos == n:
            return started #1 for true 0 for false
        
        result = 0
        limit = int(str_n[pos]) if tight else 9
        
        # Don't place digit (only if not started - for leading zeros)
        if not started:
            result += dp(pos + 1, False, False)
        
        # Place each valid digit
        for d in digits:
            digit = int(d)
            if digit > limit:
                break
            result += dp(pos + 1, tight and digit == limit, True)
        
        return result
    
    return dp(0, True, False)

    
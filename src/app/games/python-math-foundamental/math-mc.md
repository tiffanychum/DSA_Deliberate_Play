# Modulo
#interview/DSA/math
# Fundamental Concepts of Modulo Operation

## 1. Basic Definition

**Modulo (%)** gives you the **remainder** after division.

```python
17 ÷ 5 = 3 remainder 2
17 % 5 = 2

23 ÷ 7 = 3 remainder 2  
23 % 7 = 2
```

**Formula:** `a % b = a - b * floor(a/b)`

## 2. Visual Intuition - Clock Arithmetic

Think of modulo as a **circular clock**:

```
Clock with 12 hours (mod 12):
10 + 5 = 15, but 15 % 12 = 3 (3 o'clock)

    12
 11   1
10     2
 9     3
    6
```

```python
# Time examples:
(10 + 5) % 12 = 3   # 10 AM + 5 hours = 3 PM
(8 + 20) % 12 = 4   # 8 AM + 20 hours = 4 AM next day
```

## 3. Key Properties

### Cyclical Nature
```python
# Mod 5 cycles: 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, ...
for i in range(10):
    print(f"{i} % 5 = {i % 5}")

# Output:
# 0 % 5 = 0
# 1 % 5 = 1  
# 2 % 5 = 2
# 3 % 5 = 3
# 4 % 5 = 4
# 5 % 5 = 0  ← cycles back
# 6 % 5 = 1
# 7 % 5 = 2
# 8 % 5 = 3
# 9 % 5 = 4
```

### Range Property
```python
# a % b always gives result in range [0, b-1] for positive b
# Examples with mod 7:
# Result is always: 0, 1, 2, 3, 4, 5, or 6
```

## 4. Negative Numbers - The Tricky Part

### Python/Java/JavaScript Behavior
**Rule: Result has the same sign as the divisor**

```python
# Positive divisor → Non-negative result
-8 % 3 = 1    # Not -2!
-7 % 3 = 2    # Not -1!
-6 % 3 = 0
-5 % 3 = 1
-4 % 3 = 2
-3 % 3 = 0

# Negative divisor → Non-positive result  
8 % -3 = -1   # Not 2!
7 % -3 = -2   # Not 1!
```

### Step-by-Step Calculation
```python
# -8 % 3 calculation:
# floor(-8/3) = floor(-2.67) = -3
# -8 % 3 = -8 - 3 * (-3) = -8 + 9 = 1
```

### C/C++ Behavior (Different!)
**Rule: Result has the same sign as the dividend**

```c
// C/C++:
-8 % 3 = -2   // Same sign as -8
8 % -3 = 2    // Same sign as 8
```

## 5. Common Applications

### Array Wraparound
```python
# Circular buffer of size 5
def next_index(current, size):
    return (current + 1) % size

def prev_index(current, size):  
    return (current - 1) % size

# Examples:
next_index(4, 5) = 0  # Wrap to beginning
prev_index(0, 5) = 4  # Wrap to end
```

### Hash Tables
```python
def hash_function(key, table_size):
    return hash(key) % table_size

# Maps any hash value to valid table index [0, table_size-1]
```

### Cyclic Patterns
```python
# Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
def day_of_week(days_from_sunday):
    return days_from_sunday % 7

day_of_week(10) = 3  # Wednesday
day_of_week(-1) = 6  # Saturday (yesterday)
```

## 6. Mathematical Properties

### Distributive Properties
```python
(a + b) % m = ((a % m) + (b % m)) % m
(a * b) % m = ((a % m) * (b % m)) % m

# Useful for preventing overflow:
def big_multiply(a, b, mod):
    return ((a % mod) * (b % mod)) % mod
```

### Modular Inverse
```python
# If gcd(a, m) = 1, then a has an inverse mod m
# a * inverse(a) ≡ 1 (mod m)

# Example: 3 * 5 ≡ 1 (mod 7)
# So inverse of 3 mod 7 is 5
```

## 7. Common Pitfalls and Tips

### Negative Numbers in Circular Arrays
```python
# WRONG - might give negative index
def wrong_prev(i, size):
    return (i - 1) % size  # Works in Python, fails in C++

# SAFE - always positive  
def safe_prev(i, size):
    return (i - 1 + size) % size
```

### Floating Point Modulo
```python
# Python has fmod for floating point
import math
print(7.5 % 2.3)        # 0.5999999999999996
print(math.fmod(7.5, 2.3))  # 0.6
```

### Performance Optimization
```python
# Fast modulo for powers of 2
def fast_mod_power_of_2(x, n):
    # Only works when n is power of 2
    return x & (n - 1)

fast_mod_power_of_2(17, 8) = 17 & 7 = 1  # Same as 17 % 8
```

## 8. Visual Number Line

```
... -7  -6  -5  -4  -3  -2  -1   0   1   2   3   4   5   6   7 ...
     mod 3 behavior (Python):
...  2   0   1   2   0   1   2   0   1   2   0   1   2   0   1 ...
```

Notice how results cycle through `[0, 1, 2]` regardless of sign!

## 9. Key Takeaways

1. **Modulo = Remainder** after division
2. **Always cycles** through values `[0, b-1]` for positive divisor `b`
3. **Language dependent** for negative numbers
4. **Essential for circular operations** (arrays, clocks, hash tables)
5. **Prevents overflow** in mathematical computations
6. **Python's behavior** ensures non-negative results with positive divisors

Understanding modulo is crucial for algorithms involving:
- Circular data structures
- Hash functions  
- Cryptography
- Number theory
- Game development (wrapping coordinates)

# Leet - Max points on a line
#interview/DSA/math
# Max Points on a Line Solution

The key is to use slopes to determine if points are on the same line. Here's an efficient solution:

```python
class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        n = len(points)
        if n <= 2:
            return n
            
        def slope(p1, p2):
            x1, y1 = p1
            x2, y2 = p2
            # Handle vertical line
            if x1 == x2:
                return float('inf')
            return (y2 - y1) / (x2 - x1)
        
        max_points = 2
        # Check each point as potential line start
        for i in range(n):
            slopes = {}  # Dictionary to store slope counts
            # Compare with all other points
            for j in range(n):
                if i != j:
                    s = slope(points[i], points[j])
                    slopes[s] = slopes.get(s, 1) + 1
                    max_points = max(max_points, slopes[s])
                    
        return max_points
```

## Let's understand how it works:

### Example 1: points = [[1,1],[2,2],[3,3]]
```
For point [1,1]:
- Slope with [2,2]: 1
- Slope with [3,3]: 1
slopes = {1: 3}  # 3 points on line with slope 1

For point [2,2]:
- Already counted in previous iteration

For point [3,3]:
- Already counted in previous iteration

Result: 3 points
```

### Example 2: points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
```
For point [1,1]:
Calculate slopes with all other points:
- [3,2]: 0.5
- [5,3]: 0.5
- [4,1]: 0
- [2,3]: 2
- [1,4]: inf

slopes = {0.5: 3, 0: 2, 2: 2, inf: 2}
```

## Key Points:

1. Slope Calculation:
```python
def slope(p1, p2):
    x1, y1 = p1
    x2, y2 = p2
    if x1 == x2:  # Vertical line
        return float('inf')
    return (y2 - y1) / (x2 - x1)
```

2. Handle Special Cases:
   - Vertical lines (infinite slope)
   - Points less than 3
   - Duplicate points

3. Optimization:
   - Only need to check each point once as start
   - Use dictionary to count slopes

## Alternative Solution (Using GCD):
```python
class Solution:
    def maxPoints(self, points: List[List[int]]) -> int:
        def gcd(a, b):
            while b:
                a, b = b, a % b
            return a
            
        n = len(points)
        if n <= 2:
            return n
            
        max_points = 2
        for i in range(n):
            slopes = {}
            for j in range(n):
                if i != j:
                    dx = points[j][0] - points[i][0]
                    dy = points[j][1] - points[i][1]
                    g = gcd(dx, dy)
                    slope = (dx//g, dy//g)
                    slopes[slope] = slopes.get(slope, 1) + 1
                    max_points = max(max_points, slopes[slope])
                    
        return max_points
```

## Time & Space Complexity:
- Time: O(n²) - need to compare each point with others
- Space: O(n) - storing slopes for each point

## Edge Cases:
```python
# Single point
points = [[1,1]]  → 1

# Two points
points = [[1,1], [2,2]]  → 2

# Vertical line
points = [[1,1], [1,2], [1,3]]  → 3

# Horizontal line
points = [[1,1], [2,1], [3,1]]  → 3
```

## Why This Works:
1. For each point, calculate slopes with all other points
2. Points on same line will have same slope
3. Keep track of maximum points with same slope
4. Handle vertical lines separately

Choose this solution because:
1. Handles all edge cases
2. No floating-point precision issues with GCD version
3. Clear and maintainable code
4. Efficient for given constraints

Remember:
- Points are unique
- Need to handle vertical lines
- Consider precision issues with floating-point slopes
- GCD version more precise but slightly more complex

## Summary
* **Yes, there is duplication** in calculating the same slopes multiple times
* **This duplication is intentional and necessary** for the algorithm's correctness
* Each point serves as an anchor, and we need to check all possible anchors
* The time complexity is O(n²) regardless, so the duplication doesn't change the asymptotic complexity
* While optimization is possible, the current approach is simpler and more intuitive

⠀The duplication ensures we don't miss any potential maximum by considering every point as a potential starting point for the optimal line.

# Leet - sqrt(x)
#interview/DSA/math


# Computing Square Root Using Binary Search

Here's an efficient solution to find the square root of a non-negative integer using binary search:

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x == 0:
            return 0
            
        left, right = 1, x
        
        while left <= right:
            mid = (left + right) // 2
            
            # Use division to avoid integer overflow
            if mid <= x // mid:
                left = mid + 1
            else:
                right = mid - 1
                
        return right
```

## Step-by-Step Explanation for x = 8:

```
Initial: left = 1, right = 8

Iteration 1:
mid = (1 + 8) // 2 = 4
4 > 8 // 4 (2)
right = 3

Iteration 2:
mid = (1 + 3) // 2 = 2
2 <= 8 // 2 (4)
left = 3

Iteration 3:
mid = (3 + 3) // 2 = 3
3 > 8 // 3 (2)
right = 2

Loop ends: left = 3, right = 2
Return right = 2
```

## Key Insights:

1. **Binary Search Approach**:
   - The square root of x must be between 1 and x
   - We can find it by narrowing this range

2. **Using Division Instead of Multiplication**:
   - We check if `mid <= x // mid` instead of `mid * mid <= x`
   - This avoids integer overflow for large values of x

3. **Why Return Right?**:
   - When the loop ends, `right` is the largest integer where `right * right <= x`
   - This gives us the floor value of the square root

## Time & Space Complexity:
- Time: O(log x) - Binary search halves the search space each time
- Space: O(1) - We only use a constant amount of extra space

This approach efficiently finds the integer square root without using any built-in exponent functions or operators.

# Step-by-Step Square Root Calculation for x = 9

Let me trace through the entire binary search algorithm for finding the square root of 9:

```python
def mySqrt(x):
    if x == 0:
        return 0
            
    left, right = 1, x
    
    while left <= right:
        mid = (left + right) // 2
        
        if mid <= x // mid:
            left = mid + 1
        else:
            right = mid - 1
                
    return right
```

## Initial Setup:
```
x = 9
left = 1, right = 9
```

## Iteration 1:
- mid = (1 + 9) // 2 = 5
- Check: Is 5 <= 9 // 5?
- 9 // 5 = 1 (integer division)
- 5 > 1, so condition is FALSE
- Update: right = mid - 1 = 4
- New bounds: left = 1, right = 4

## Iteration 2:
- mid = (1 + 4) // 2 = 2
- Check: Is 2 <= 9 // 2?
- 9 // 2 = 4 (integer division)
- 2 <= 4, so condition is TRUE
- Update: left = mid + 1 = 3
- New bounds: left = 3, right = 4

## Iteration 3:
- mid = (3 + 4) // 2 = 3
- Check: Is 3 <= 9 // 3?
- 9 // 3 = 3 (integer division)
- 3 <= 3, so condition is TRUE
- Update: left = mid + 1 = 4
- New bounds: left = 4, right = 4

## Iteration 4:
- mid = (4 + 4) // 2 = 4
- Check: Is 4 <= 9 // 4?
- 9 // 4 = 2 (integer division)
- 4 > 2, so condition is FALSE
- Update: right = mid - 1 = 3
- New bounds: left = 4, right = 3

## Loop Terminates:
Since left > right (4 > 3), the while loop ends

## Return Value:
Return right = 3

This gives us the correct result: the square root of 9 is 3.

Note that this binary search efficiently converges on the integer square root. We know that 3² = 9 exactly, so the algorithm returned the exact square root in this case.

# Leet - Pow
#interview/DSA/math

# Pow(x, n) - Optimal Solution

This problem asks us to implement the power function efficiently, calculating x raised to the power n.

## Algorithm

## Iterative Implementation (More Efficient)

We can also implement this iteratively to avoid recursion overhead:

```python
def myPow(x, n):
    # Handle negative exponent
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1
    current_product = x
    
    # Process bits of n from right to left
    while n > 0:
        # If current bit is 1, multiply result by current_product
        if n % 2 == 1:
            result *= current_product
        
        # Square the current_product for next bit
        current_product *= current_product
        
        # Move to next bit
        n //= 2
    
    return result
```


# Pow(x, n) - Detailed Examples with Nested Steps

Let me walk through two detailed examples of the binary exponentiation algorithm with nested steps to show exactly how it works.

## Example 1: x = 2.0, n = 10 (Positive Exponent)

Using the iterative approach:

```
Initialize:
  x = 2.0
  n = 10 (binary: 1010)
  result = 1.0
  current_product = 2.0

Iteration 1: n = 10 (binary: 1010)
  → Check if n is odd: 10 % 2 = 0 (even)
    • Skip multiplication (bit is 0)
  → Square current_product: 2.0 * 2.0 = 4.0
  → Divide n by 2: 10 // 2 = 5
  → State: result = 1.0, current_product = 4.0, n = 5

Iteration 2: n = 5 (binary: 101)
  → Check if n is odd: 5 % 2 = 1 (odd)
    • Multiply result: 1.0 * 4.0 = 4.0 (bit is 1)
  → Square current_product: 4.0 * 4.0 = 16.0
  → Divide n by 2: 5 // 2 = 2
  → State: result = 4.0, current_product = 16.0, n = 2

Iteration 3: n = 2 (binary: 10)
  → Check if n is odd: 2 % 2 = 0 (even)
    • Skip multiplication (bit is 0)
  → Square current_product: 16.0 * 16.0 = 256.0
  → Divide n by 2: 2 // 2 = 1
  → State: result = 4.0, current_product = 256.0, n = 1

Iteration 4: n = 1 (binary: 1)
  → Check if n is odd: 1 % 2 = 1 (odd)
    • Multiply result: 4.0 * 256.0 = 1024.0 (bit is 1)
  → Square current_product: 256.0 * 256.0 = 65536.0
  → Divide n by 2: 1 // 2 = 0
  → State: result = 1024.0, current_product = 65536.0, n = 0

Loop ends (n = 0)
Return result = 1024.0
```


## Example 2: x = 2.0, n = -3 (Negative Exponent)

Using the iterative approach:

```
Initialize:
  x = 2.0, n = -3
  Handle negative exponent:
    • x = 1/x = 1/2.0 = 0.5
    • n = -(-3) = 3
  result = 1.0
  current_product = 0.5

Iteration 1: n = 3 (binary: 11)
  → Check if n is odd: 3 % 2 = 1 (odd)
    • Multiply result: 1.0 * 0.5 = 0.5 (bit is 1)
  → Square current_product: 0.5 * 0.5 = 0.25
  → Divide n by 2: 3 // 2 = 1
  → State: result = 0.5, current_product = 0.25, n = 1

Iteration 2: n = 1 (binary: 1)
  → Check if n is odd: 1 % 2 = 1 (odd)
    • Multiply result: 0.5 * 0.25 = 0.125 (bit is 1)
  → Square current_product: 0.25 * 0.25 = 0.0625
  → Divide n by 2: 1 // 2 = 0
  → State: result = 0.125, current_product = 0.0625, n = 0

Loop ends (n = 0)
Return result = 0.125
```


## Example 3: x = 3.0, n = 5 (Using Recursive Approach)

Let's also trace through the recursive approach for a different example:

```
Call myPow(3.0, 5)
  → n is not negative, continue
  → n is not 0 or 1, continue
  → Calculate half = myPow(3.0, 5//2) = myPow(3.0, 2)
  
    Call myPow(3.0, 2)
      → n is not negative, continue
      → n is not 0 or 1, continue
      → Calculate half = myPow(3.0, 2//2) = myPow(3.0, 1)
      
        Call myPow(3.0, 1)
          → n is not negative, continue
          → n = 1, return x = 3.0
        
      → half = 3.0
      → n is even, return half * half = 3.0 * 3.0 = 9.0
    
  → half = 9.0
  → n is odd, return x * half * half = 3.0 * 9.0 * 9.0 = 3.0 * 81.0 = 243.0

Return 243.0
```


# Understanding the Connection Between Powers of 2 and Binary Representation

Let me clarify the direct relationship between the powers we calculate (2^2, 2^4, 2^8) and the binary representation of the exponent.

## The Key Connection

When we calculate x^n using binary exponentiation, we're essentially breaking down the calculation based on the binary representation of n. Here's the crucial insight:

1. **The powers we calculate (x, x^2, x^4, x^8, etc.) correspond to x raised to increasing powers of 2**
2. **The binary representation of n tells us which of these powers to multiply together**

## Example with x = 2, n = 10

Binary representation of 10 is 1010 (reading from right to left: 0, 1, 0, 1)

```
Bit position:    3    2    1    0
Powers of 2:    2³   2²   2¹   2⁰
                 8    4    2    1
Binary of 10:    1    0    1    0
```

This means 10 = 8 + 0 + 2 + 0 = 8 + 2

Now, for calculating 2^10:

```
For each bit position i:
  If bit is 1, include x^(2^i) in the product

Bit 0 (rightmost): 0 → Don't include x^(2^0) = x^1 = 2
Bit 1:             1 → Include x^(2^1) = x^2 = 4
Bit 2:             0 → Don't include x^(2^2) = x^4 = 16
Bit 3 (leftmost):  1 → Include x^(2^3) = x^8 = 256
```

So 2^10 = 2^8 × 2^2 = 256 × 4 = 1024

## How Our Algorithm Generates These Powers

In our algorithm:

```python
result = 1
current_product = x  # Starts at x^1

while n > 0:
    if n % 2 == 1:  # If current bit is 1
        result *= current_product
    
    current_product *= current_product  # Square to get next power
    n //= 2  # Move to next bit
```

The `current_product *= current_product` line is where we generate the sequence of powers:
- First iteration: current_product = x^1 → x^2
- Second iteration: current_product = x^2 → x^4
- Third iteration: current_product = x^4 → x^8
- Fourth iteration: current_product = x^8 → x^16
- And so on...

This sequence x^1, x^2, x^4, x^8, x^16, ... corresponds exactly to x raised to powers of 2: x^(2^0), x^(2^1), x^(2^2), x^(2^3), x^(2^4), ...

## Visual Representation of the Process

For calculating 2^10:

```
Iteration 1:
  • current_product = 2^1 = 2
  • Bit is 0, don't multiply result
  • Square: current_product becomes 2^2 = 4

Iteration 2:
  • current_product = 2^2 = 4
  • Bit is 1, multiply result: result = 1 × 4 = 4
  • Square: current_product becomes 2^4 = 16

Iteration 3:
  • current_product = 2^4 = 16
  • Bit is 0, don't multiply result
  • Square: current_product becomes 2^8 = 256

Iteration 4:
  • current_product = 2^8 = 256
  • Bit is 1, multiply result: result = 4 × 256 = 1024
  • Square: current_product becomes 2^16 = 65536
```

## The Elegant Connection

The beauty of this algorithm is that:

1. We generate exactly the powers we need (x^1, x^2, x^4, x^8, ...) through repeated squaring
2. The binary representation of n tells us precisely which of these powers to include in our final product
3. We process the bits from right to left, which matches how we read the binary number

This direct mapping between the binary representation and the powers we calculate is what makes binary exponentiation so elegant and efficient.



## Time & Space Complexity
- **Time Complexity**: O(log n) - We divide the exponent by 2 in each step
- **Space Complexity**: O(1) for the iterative solution, O(log n) for the recursive solution due to the call stack

This algorithm efficiently calculates x^n by reducing the number of multiplications from O(n) to O(log n), making it suitable for large exponents.







# Binary Exponentiation: Understanding the Binary Representation Approach

Binary exponentiation is a clever technique that uses the binary representation of the exponent to compute powers efficiently. Let me explain this concept in depth.

## The Binary Representation Concept

Every integer can be represented as a sum of powers of 2. For example:
- 10 in binary is 1010, which means 10 = 2^3 + 2^1 = 8 + 2
- 13 in binary is 1101, which means 13 = 2^3 + 2^2 + 2^0 = 8 + 4 + 1

Similarly, we can express x^n as a product of terms where each term is x raised to a power of 2:

x^n = x^(a₀×2⁰) × x^(a₁×2¹) × x^(a₂×2²) × ... × x^(aₖ×2ᵏ)

Where a₀, a₁, a₂, ..., aₖ are the binary digits of n (either 0 or 1).

## How It Works in the Algorithm

1. We compute successive squares: x, x², x⁴, x⁸, x¹⁶, ...
2. We multiply our result by these squares only when the corresponding bit in n is 1

### Visual Example: Computing 2^10

Binary representation of 10 is 1010 (reading right to left: 0, 1, 0, 1)

```
Powers of 2:   2³   2²   2¹   2⁰
Binary of 10:   1    0    1    0
                ↓    ↓    ↓    ↓
Powers of x:   x⁸   x⁴   x²   x¹
Include?:      Yes   No   Yes   No
```

So 2^10 = 2^8 × 2^2 = 256 × 4 = 1024

### Step-by-Step Calculation in Our Algorithm

Let's trace through calculating 2^10 using our iterative algorithm:

```
Initialize: result = 1, current_product = 2, n = 10 (binary: 1010)

Iteration 1: (rightmost bit)
  • Bit is 0, so don't multiply result
  • Square current_product: 2² = 4
  • n becomes 5 (binary: 101)

Iteration 2: (second bit from right)
  • Bit is 1, so multiply result: 1 × 4 = 4
  • Square current_product: 4² = 16
  • n becomes 2 (binary: 10)

Iteration 3: (third bit from right)
  • Bit is 0, so don't multiply result
  • Square current_product: 16² = 256
  • n becomes 1 (binary: 1)

Iteration 4: (leftmost bit)
  • Bit is 1, so multiply result: 4 × 256 = 1024
  • Square current_product: 256² = 65536
  • n becomes 0

Final result: 1024
```

## Why This Is Efficient

The naive approach would require n multiplications to compute x^n.

With binary exponentiation:
- We only need log₂(n) squaring operations (one for each bit in n)
- We perform at most log₂(n) multiplications (one for each '1' bit in n)

This reduces the time complexity from O(n) to O(log n), which is a dramatic improvement for large exponents.

## Connection to the Code

In our iterative implementation:

```python
def myPow(x, n):
    if n < 0:
        x = 1 / x
        n = -n
    
    result = 1
    current_product = x
    
    while n > 0:
        if n % 2 == 1:  # Check if current bit is 1
            result *= current_product
        
        current_product *= current_product  # Square for next bit
        n //= 2  # Move to next bit
    
    return result
```

- `n % 2 == 1` checks if the current rightmost bit is 1
- `current_product *= current_product` computes the next power of 2
- `n //= 2` shifts to the next bit (equivalent to right-shifting the binary representation)

This elegant algorithm leverages the binary representation of numbers to compute powers with minimal multiplications, making it extremely efficient for large exponents.

class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        # Create list of numbers 1 to n
        numbers = list(range(1, n+1))
        
        # Make k 0-indexed
        k -= 1
        
        # Build result
        result = []
        
        # Calculate factorial
        factorial = 1
        for i in range(1, n):
            factorial *= i
            
        # Find each digit of the permutation
        for i in range(n-1, 0, -1):
            # Find the index of the digit
            index = k // factorial
            
            # Add the digit to result
            result.append(str(numbers[index]))
            
            # Remove the used number
            numbers.pop(index)
            
            # Update k for next iteration
            k %= factorial
            
            # Update factorial for next total permutation
            factorial //= i
            
        # Add the last remaining number
        result.append(str(numbers[0]))
        
        return ''.join(result)

        # Leet - sqt root
#interview/DSA/math
# Square Root Solution Using Binary Search

Here's an efficient solution using binary search:

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x == 0:
            return 0
            
        left, right = 1, x
        
        while left <= right:
            mid = (left + right) // 2
            # Use division instead of multiplication to avoid overflow
            if mid == x // mid:
                return mid
            elif mid > x // mid:
                right = mid - 1
            else:
                left = mid + 1
                
        return right
```

## Let's understand how it works:

### Example 1: x = 8
```
Initial: left = 1, right = 8

Step 1:
mid = (1 + 8) // 2 = 4
4 > 8//4 (2)
right = 3

Step 2:
mid = (1 + 3) // 2 = 2
2 < 8//2 (4)
left = 3

Step 3:
mid = (3 + 3) // 2 = 3
3 > 8//3 (2)
right = 2

Loop ends: return 2
```

### Example 2: x = 16
```
Initial: left = 1, right = 16

Step 1:
mid = (1 + 16) // 2 = 8
8 > 16//8 (2)
right = 7

Step 2:
mid = (1 + 7) // 2 = 4
4 = 16//4 (4)
return 4
```

## Key Points:

1. Why Binary Search?
   - Square root of x lies between 1 and x
   - Can efficiently narrow down the range

2. Why Use Division?
   ```python
   # Instead of:
   if mid * mid == x    # Could overflow
   
   # We use:
   if mid == x // mid   # Avoids overflow
   ```

3. Why Return right?
   - When loop ends, right is the floor value
   - left would be ceiling value

## Alternative Solution (Newton's Method):
```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x == 0:
            return 0
        
        r = x
        while r > x // r:
            r = (r + x//r) // 2
        return r
```

## Time & Space Complexity:
1. Binary Search:
   - Time: O(log x)
   - Space: O(1)

2. Newton's Method:
   - Time: O(log x)
   - Space: O(1)

## Edge Cases:
```python
x = 0  → 0
x = 1  → 1
x = 2  → 1
x = 3  → 1
x = 4  → 2
```

## Why This Works:
1. Binary search continuously narrows the range
2. Division avoids integer overflow
3. Returns floor value automatically
4. Handles all cases efficiently

Choose binary search solution because:
1. More intuitive
2. Stable performance
3. Easy to understand
4. Handles all edge cases

Remember:
- Result is rounded down
- No built-in math functions needed
- Works for all non-negative integers
- Efficient for large numbers

# Leet - factorial trailing zeroes
#interview/DSA/math
# Factorial Trailing Zeroes Solution

The key insight is that trailing zeros come from pairs of 2 and 5 as factors. Since 2s are always more abundant than 5s, we only need to count the number of 5s.

```python
class Solution:
    def trailingZeroes(self, n: int) -> int:
        count = 0
        # Count factors of 5
        while n > 0:
            n //= 5
            count += n
        return count
```

## Understanding How It Works:

### 1. Why Count 5s?
- Trailing zeros come from 2 × 5 pairs
- Every even number provides 2s
- 5s are less common, so they're the limiting factor

### 2. Examples:

#### Example 1: n = 5
```
Numbers contributing 5s: 5
5! = 1 × 2 × 3 × 4 × 5 = 120
Count = 1 trailing zero
```

#### Example 2: n = 25
```
First level 5s: 5, 10, 15, 20, 25 (5 numbers)
Second level 5s: 25 (1 number, contributes extra 5)
25! has 6 trailing zeros

Process:
n = 25
First iteration:  25//5 = 5  (count += 5)
Second iteration: 5//5 = 1   (count += 1)
Third iteration:  1//5 = 0   (stop)
Total count = 6
```

#### Example 3: n = 30
```
First level 5s: 5, 10, 15, 20, 25, 30 (6 numbers)
Second level 5s: 25 (1 number)
Total = 7 trailing zeros

Process:
n = 30
First iteration:  30//5 = 6  (count += 6)
Second iteration: 6//5 = 1   (count += 1)
Third iteration:  1//5 = 0   (stop)
Total count = 7
```

## Why This Works:

1. First Division by 5:
   - Counts numbers divisible by 5

2. Second Division by 5:
   - Counts numbers divisible by 25 (contributing extra 5)

3. Third Division by 5:
   - Counts numbers divisible by 125 (contributing extra 5)

And so on...

## Time & Space Complexity:
- Time: O(log n) - number of divisions by 5
- Space: O(1) - only using a counter

## Alternative Solution (More Explicit):
```python
class Solution:
    def trailingZeroes(self, n: int) -> int:
        count = 0
        power = 5
        while power <= n:
            count += n // power
            power *= 5
        return count
```

This version:
- More clearly shows power of 5 progression
- Easier to understand the counting process
- Same time complexity

## Key Points:
1. Only need to count 5s (2s are abundant)
2. Numbers like 25, 125 contribute multiple 5s
3. Solution is logarithmic
4. No need to calculate actual factorial

## Examples of Factor Counting:
```
5  -> 1 (5)
10 -> 2 (5, 10)
15 -> 3 (5, 10, 15)
20 -> 4 (5, 10, 15, 20)
25 -> 6 (5, 10, 15, 20, 25[counts twice])
30 -> 7 (5, 10, 15, 20, 25[counts twice], 30)
```

Choose this solution because:
1. Optimal logarithmic time complexity
2. No factorial calculation needed
3. Handles all cases efficiently
4. Easy to understand and maintain

# Leet - add one
#interview/DSA/math
# Plus One Solution

Here's a clean solution with detailed explanation:

```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        # Start from rightmost digit
        for i in range(len(digits)-1, -1, -1):
            # If digit is less than 9, just increment and return
            if digits[i] < 9:
                digits[i] += 1
                return digits
            # If digit is 9, make it 0 and continue to next digit
            digits[i] = 0
        
        # If we're here, all digits were 9
        return [1] + digits
```

## Let's break down how it works with examples:

### Example 1: digits = [1,2,3]
```
Start from right: i = 2
digits[2] = 3 < 9
digits[2] += 1
return [1,2,4]
```

### Example 2: digits = [1,2,9]
```
Start from right: i = 2
digits[2] = 9
digits[2] = 0

i = 1
digits[1] = 2 < 9
digits[1] += 1
return [1,3,0]
```

### Example 3: digits = [9,9,9]
```
Start from right: i = 2
digits[2] = 9
digits[2] = 0

i = 1
digits[1] = 9
digits[1] = 0

i = 0
digits[0] = 9
digits[0] = 0

All digits processed, all were 9
return [1] + [0,0,0] = [1,0,0,0]
```

## Key Points:

1. Two main cases:
   - Regular case: Find first non-9 digit from right, increment it
   - All 9s case: Create new array with leading 1

2. Process from right to left because:
   - Addition starts from least significant digit
   - Carry propagates left

3. Optimization:
   - Return immediately when no carry is needed
   - No need to process remaining digits

## Time & Space Complexity:
- Time: O(n) worst case when all digits are 9
- Space: O(1) in most cases, O(n) when new array needed

## Alternative Solution (Using Carry):
```python
class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        carry = 1
        for i in range(len(digits)-1, -1, -1):
            total = digits[i] + carry
            digits[i] = total % 10
            carry = total // 10
            
        if carry:
            return [1] + digits
        return digits
```

This solution:
1. Uses explicit carry variable
2. More similar to manual addition
3. Slightly more verbose but maybe clearer

## Edge Cases Handled:
```python
[1,2,3] → [1,2,4]    # Regular case
[1,9,9] → [2,0,0]    # Multiple carries
[9,9,9] → [1,0,0,0]  # New digit needed
[0] → [1]            # Single digit
```

Choose the first solution because:
1. More concise
2. Early returns for better efficiency
3. Clearer logic flow
4. Handles all cases elegantly

# Leet - palindrome
#interview/DSA/math
# Palindrome Number Solutions

I'll show two approaches: string conversion (simple) and mathematical (optimal).

## 1. String Solution (Simple)
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        return str(x) == str(x)[::-1]
```

## 2. Mathematical Solution (Without String Conversion)
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Handle negative and numbers ending with 0
        if x < 0 or (x != 0 and x % 10 == 0):
            return False
            
        reversed_num = 0
        original = x
        
        # Reverse half of the number
        while x > reversed_num:
            reversed_num = reversed_num * 10 + x % 10
            x //= 10
            
        # Check if palindrome
        # For even length: x == reversed_num
        # For odd length: x == reversed_num//10
        return x == reversed_num or x == reversed_num//10
```

## Let's understand how the mathematical solution works:

### Example 1: x = 121
```
Initial: x = 121, reversed_num = 0

Step 1:
reversed_num = 0 * 10 + 121 % 10 = 1
x = 121 // 10 = 12

Step 2:
reversed_num = 1 * 10 + 12 % 10 = 12
x = 12 // 10 = 1

Loop ends as x (1) < reversed_num (12)
Check: x (1) == reversed_num//10 (12//10 = 1) ✓
Return: True
```

### Example 2: x = 1221
```
Initial: x = 1221, reversed_num = 0

Step 1:
reversed_num = 0 * 10 + 1221 % 10 = 1
x = 1221 // 10 = 122

Step 2:
reversed_num = 1 * 10 + 122 % 10 = 12
x = 122 // 10 = 12

Loop ends as x (12) == reversed_num (12)
Return: True
```

### Example 3: x = 10
```
Initial: x = 10

Since x % 10 == 0, return False immediately
(Numbers ending with 0 can't be palindromes unless they're 0)
```

## Key Points:

1. Special Cases:
   - Negative numbers are not palindromes
   - Numbers ending with 0 (except 0 itself) are not palindromes

2. For odd-length numbers:
   - Middle digit doesn't need to be compared
   - That's why we check x == reversed_num//10

3. For even-length numbers:
   - All digits need to match
   - That's why we check x == reversed_num

## Time & Space Complexity:
1. String Solution:
   - Time: O(log x) to convert to string
   - Space: O(log x) for string storage

2. Mathematical Solution:
   - Time: O(log x) - processing half the digits
   - Space: O(1) - using only variables

The mathematical solution is better because:
1. Uses constant space
2. Doesn't need string conversion
3. Only processes half the number
4. Handles edge cases efficiently

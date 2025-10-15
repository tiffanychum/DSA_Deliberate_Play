# lambda
#interview/python


# Understanding Lambda Functions in Python

## `lambda *args: "Hello World"` Explained

A lambda function is an anonymous (unnamed) function defined using the `lambda` keyword. The expression `lambda *args: "Hello World"` breaks down as:

- `lambda`: Keyword that defines an anonymous function
- `*args`: Parameter that collects any number of positional arguments into a tuple
- `"Hello World"`: The return value (everything after the colon is what the function returns)

This particular lambda function accepts any number of arguments but ignores them all, always returning the string "Hello World".

## Common Use Cases for Lambda Functions

### 1. Simple operations in functional programming

```python
# With map - apply function to each item in an iterable
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))  # [1, 4, 9, 16, 25]

# With filter - keep items that satisfy a condition
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))  # [2, 4]

# With sorted - custom sorting
pairs = [(1, 'one'), (3, 'three'), (2, 'two')]
sorted_by_second = sorted(pairs, key=lambda pair: pair[1])  # [(1, 'one'), (3, 'three'), (2, 'two')]
```

### 2. One-time use functions

```python
# Quick function for a specific calculation
discount_calculator = lambda price, discount: price * (1 - discount/100)
print(discount_calculator(100, 20))  # 80.0
```

### 3. Callbacks and event handlers

```python
# In GUI programming (e.g., with Tkinter)
button.bind("<Button-1>", lambda event: print("Button clicked!"))
```

### 6. Default arguments in functions

```python
def apply_operation(x, operation=lambda x: x):
    return operation(x)

print(apply_operation(5))  # 5
print(apply_operation(5, lambda x: x**2))  # 25
```

## When to Use Lambda Functions

Lambda functions are best used when:
- The function is simple (one expression)
- The function is used only once
- The function is used in a higher-order function (like map, filter, sorted)
- You need a quick throwaway function

For more complex logic, named functions with `def` are usually more readable and maintainable.

Great question! Here are many practical examples of lambda functions with multiple expressions and real-world use cases:

## **Sorting Examples**

### **Multi-Criteria Sorting**:
```python
# Sort by multiple criteria
students = [('Alice', 85, 'A'), ('Bob', 90, 'B'), ('Charlie', 85, 'A')]
students.sort(key=lambda x: (x[2], -x[1], x[0]))  # Grade, then score desc, then name
# Result: [('Alice', 85, 'A'), ('Bob', 90, 'B'), ('Charlie', 85, 'A')]

# Sort coordinates by distance from origin
points = [(3, 4), (1, 1), (0, 5), (2, 2)]
points.sort(key=lambda p: (p[0]**2 + p[1]**2)**0.5)
# Result: [(1, 1), (2, 2), (3, 4), (0, 5)]

# Sort strings by length, then alphabetically
words = ['python', 'java', 'c', 'javascript', 'go']
words.sort(key=lambda w: (len(w), w.lower()))
# Result: ['c', 'go', 'java', 'python', 'javascript']

# Sort intervals by start time, then by duration
intervals = [(1, 3), (2, 4), (1, 2), (3, 6)]
intervals.sort(key=lambda x: (x[0], x[1] - x[0]))
# Result: [(1, 2), (1, 3), (2, 4), (3, 6)]
```

### **Complex Object Sorting**:
```python
# Sort employees by department, then salary descending
employees = [
    {'name': 'Alice', 'dept': 'Engineering', 'salary': 80000},
    {'name': 'Bob', 'dept': 'Sales', 'salary': 60000},
    {'name': 'Charlie', 'dept': 'Engineering', 'salary': 90000}
]
employees.sort(key=lambda emp: (emp['dept'], -emp['salary']))

# Sort tasks by priority (High=1, Medium=2, Low=3), then deadline
tasks = [
    {'task': 'Fix bug', 'priority': 'High', 'deadline': '2024-01-15'},
    {'task': 'Review code', 'priority': 'Medium', 'deadline': '2024-01-10'},
    {'task': 'Update docs', 'priority': 'Low', 'deadline': '2024-01-12'}
]
priority_map = {'High': 1, 'Medium': 2, 'Low': 3}
tasks.sort(key=lambda t: (priority_map[t['priority']], t['deadline']))
```

---

## **Map Function Examples**

### **Data Transformation**:
```python
# Convert temperatures with rounding
celsius = [0, 20, 30, 40]
fahrenheit = list(map(lambda c: round(c * 9/5 + 32, 1), celsius))
# Result: [32.0, 68.0, 86.0, 104.0]

# Extract and format data
users = [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 30}]
formatted = list(map(lambda u: f"{u['name']} ({u['age']} years old)", users))
# Result: ['Alice (25 years old)', 'Bob (30 years old)']

# Calculate compound interest
principals = [1000, 2000, 5000]
amounts = list(map(lambda p: round(p * (1 + 0.05)**10, 2), principals))
# Result: [1628.89, 3257.79, 8144.47]

# Parse and validate coordinates
coord_strings = ['(3,4)', '(0,0)', '(-1,2)']
coordinates = list(map(lambda s: tuple(map(int, s.strip('()').split(','))), coord_strings))
# Result: [(3, 4), (0, 0), (-1, 2)]
```

---

## **Filter Function Examples**

### **Complex Filtering**:
```python
# Filter valid email addresses
emails = ['user@domain.com', 'invalid-email', 'test@test.org', '@invalid.com']
valid_emails = list(filter(lambda email: '@' in email and '.' in email.split('@')[-1], emails))
# Result: ['user@domain.com', 'test@test.org']

# Filter students who passed (grade >= 60 and attendance >= 80%)
students = [
    {'name': 'Alice', 'grade': 85, 'attendance': 90},
    {'name': 'Bob', 'grade': 55, 'attendance': 85},
    {'name': 'Charlie', 'grade': 75, 'attendance': 70}
]
passed = list(filter(lambda s: s['grade'] >= 60 and s['attendance'] >= 80, students))

# Filter prime numbers
numbers = range(2, 50)
primes = list(filter(lambda n: all(n % i != 0 for i in range(2, int(n**0.5) + 1)), numbers))

# Filter files by extension and size
files = [
    {'name': 'doc.pdf', 'size': 1024},
    {'name': 'image.jpg', 'size': 2048},
    {'name': 'script.py', 'size': 512}
]
large_docs = list(filter(lambda f: f['name'].endswith('.pdf') and f['size'] > 500, files))
```

---

## **Reduce Function Examples**

### **Complex Aggregations**:
```python
from functools import reduce

# Calculate compound product with condition
numbers = [2, 3, 4, 5]
product_of_evens = reduce(lambda acc, x: acc * x if x % 2 == 0 else acc, numbers, 1)
# Result: 8 (2 * 4)

# Find maximum by custom criteria
people = [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 30}, {'name': 'Charlie', 'age': 20}]
oldest = reduce(lambda a, b: a if a['age'] > b['age'] else b, people)
# Result: {'name': 'Bob', 'age': 30}

# Merge dictionaries with conflict resolution
dicts = [{'a': 1, 'b': 2}, {'b': 3, 'c': 4}, {'c': 5, 'd': 6}]
merged = reduce(lambda acc, d: {**acc, **{k: max(acc.get(k, 0), v) for k, v in d.items()}}, dicts, {})
# Result: {'a': 1, 'b': 3, 'c': 5, 'd': 6}
```

---

## **Algorithm and Data Structure Examples**

### **Graph and Tree Operations**:
```python
# Sort edges by weight for Kruskal's algorithm
edges = [(0, 1, 4), (0, 2, 3), (1, 2, 1), (1, 3, 2)]
edges.sort(key=lambda edge: edge[2])  # Sort by weight
# Result: [(1, 2, 1), (1, 3, 2), (0, 2, 3), (0, 1, 4)]

# Sort nodes by degree in graph
graph = {0: [1, 2], 1: [0, 2, 3], 2: [0, 1], 3: [1]}
nodes_by_degree = sorted(graph.keys(), key=lambda node: len(graph[node]))
# Result: [2, 3, 0, 1]

# Priority queue with custom priority
import heapq
tasks = [(2, 'medium'), (1, 'high'), (3, 'low')]
heapq.heapify(tasks)
# Custom priority: (priority, -timestamp, task)
heapq.heappush(tasks, (1, -1000, 'urgent'))
```

### **Dynamic Programming Examples**:
```python
# Sort coins for coin change problem (largest first)
coins = [1, 5, 10, 25]
coins.sort(key=lambda x: -x)  # Descending order
# Result: [25, 10, 5, 1]

# Sort intervals for interval scheduling
intervals = [(1, 3), (2, 4), (3, 5), (0, 6)]
intervals.sort(key=lambda x: x[1])  # Sort by end time
# Result: [(1, 3), (2, 4), (3, 5), (0, 6)]

# Sort jobs by deadline for scheduling
jobs = [{'id': 1, 'deadline': 4, 'profit': 20}, {'id': 2, 'deadline': 1, 'profit': 10}]
jobs.sort(key=lambda job: (-job['profit'], job['deadline']))  # Profit desc, deadline asc
```

---

## **String Processing Examples**

### **Text Analysis**:
```python
# Sort words by frequency, then alphabetically
text = "the quick brown fox jumps over the lazy dog"
word_freq = {}
for word in text.split():
    word_freq[word] = word_freq.get(word, 0) + 1

sorted_words = sorted(word_freq.items(), key=lambda item: (-item[1], item[0]))
# Result: [('the', 2), ('brown', 1), ('dog', 1), ('fox', 1), ...]

# Parse and sort log entries
logs = [
    "2024-01-01 10:30:15 ERROR Failed to connect",
    "2024-01-01 10:25:30 INFO User logged in",
    "2024-01-01 10:35:45 WARN Low memory"
]
parsed_logs = list(map(lambda log: {
    'timestamp': log[:19],
    'level': log.split()[2],
    'message': ' '.join(log.split()[3:])
}, logs))
parsed_logs.sort(key=lambda entry: (entry['level'], entry['timestamp']))
```

---

## **Mathematical and Scientific Examples**

### **Statistical Operations**:
```python
# Calculate weighted average
data = [(85, 3), (90, 4), (78, 2)]  # (score, weight)
weighted_avg = sum(map(lambda x: x[0] * x[1], data)) / sum(map(lambda x: x[1], data))

# Sort vectors by magnitude
vectors = [(3, 4), (1, 1), (0, 5)]
vectors.sort(key=lambda v: (v[0]**2 + v[1]**2)**0.5)

# Filter outliers using IQR method
import statistics
numbers = [1, 2, 3, 4, 5, 100, 6, 7, 8, 9]
q1, q3 = statistics.quantiles(numbers, n=4)[0], statistics.quantiles(numbers, n=4)[2]
iqr = q3 - q1
filtered = list(filter(lambda x: q1 - 1.5*iqr <= x <= q3 + 1.5*iqr, numbers))
```

---

## **Event Handling and Callbacks**

### **GUI and Event Processing**:
```python
# Sort events by timestamp, then priority
events = [
    {'type': 'click', 'time': 1000, 'priority': 2},
    {'type': 'keypress', 'time': 1000, 'priority': 1},
    {'type': 'scroll', 'time': 1001, 'priority': 3}
]
events.sort(key=lambda e: (e['time'], e['priority']))

# Process different event types
event_handlers = {
    'click': lambda e: f"Clicked at ({e['x']}, {e['y']})",
    'keypress': lambda e: f"Key '{e['key']}' pressed",
    'scroll': lambda e: f"Scrolled {e['delta']} pixels"
}

# Filter and transform API responses
api_responses = [
    {'status': 200, 'data': {'user': 'Alice'}, 'timestamp': 1000},
    {'status': 404, 'error': 'Not found', 'timestamp': 1001},
    {'status': 200, 'data': {'user': 'Bob'}, 'timestamp': 1002}
]
successful = list(filter(lambda r: r['status'] == 200, api_responses))
users = list(map(lambda r: r['data']['user'], successful))
```

---

## **Advanced Use Cases**

### **Functional Programming Patterns**:
```python
# Currying with lambdas
multiply = lambda x: lambda y: x * y
double = multiply(2)
triple = multiply(3)
print(double(5))  # 10
print(triple(4))  # 12

# Conditional expressions in lambdas
process_grade = lambda score: 'A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'F'

# Nested data structure processing
nested_data = [
    {'name': 'Alice', 'scores': [85, 90, 78]},
    {'name': 'Bob', 'scores': [92, 88, 95]}
]
averages = list(map(lambda student: {
    'name': student['name'], 
    'average': sum(student['scores']) / len(student['scores'])
}, nested_data))
```

---

## **Summary**

### **Key Patterns for Multi-Expression Lambdas**:
1. **Tuple expressions**: `(expr1, expr2, expr3)` for multi-criteria sorting
2. **Conditional expressions**: `expr1 if condition else expr2`
3. **Mathematical expressions**: `(x**2 + y**2)**0.5` for calculations
4. **Dictionary/list access**: `item['key']` or `item[index]`
5. **Function calls**: `len(item)`, `str.lower()`, etc.
6. **Boolean expressions**: `condition1 and condition2`

### **Best Practices**:
- Keep lambdas readable - if too complex, use regular functions
- Use meaningful variable names even in lambdas
- Consider performance for frequently called lambdas
- Combine with `map()`, `filter()`, `reduce()`, `sorted()` for powerful data processing

**Lambda functions excel at creating concise, inline transformations and comparisons that would otherwise require separate function definitions!** 🚀

# Defaultdict
#interview/python I'll explain how `defaultdict` is particularly useful in graph algorithms with some practical examples.

`defaultdict` is extremely valuable in graph algorithms because:

1. **Adjacency List Representation**
```python
# Without defaultdict
graph = {}
for edge in edges:
    if edge[0] not in graph:
        graph[edge[0]] = []
    graph[edge[0]].append(edge[1])

# With defaultdict
graph = defaultdict(list)
for edge in edges:
    graph[edge[0]].append(edge[1])
```

2. **Tracking In-degrees** (useful in topological sorting)
```python
# Without defaultdict
in_degree = {}
for node in graph:
    for neighbor in graph[node]:
        if neighbor not in in_degree:
            in_degree[neighbor] = 0
        in_degree[neighbor] += 1

# With defaultdict
in_degree = defaultdict(int)
for node in graph:
    for neighbor in graph[node]:
        in_degree[neighbor] += 1
```

3. **Component Counting** (useful in connected components)
```python
# Track nodes in each component
components = defaultdict(set)
for node in nodes:
    components[find_component(node)].add(node)
```

4. **Edge Weights** (useful in weighted graphs)
```python
# Create weighted graph
weighted_graph = defaultdict(lambda: defaultdict(int))
for u, v, weight in edges:
    weighted_graph[u][v] = weight
```

5. **Frequency Counting** (useful in various graph analytics)
```python
# Count node degrees
degree_count = defaultdict(int)
for node in graph:
    degree_count[len(graph[node])] += 1
```

I'll create a more comprehensive example with a graph that looks like this:
```
A ---5---> B ---3---> C
|          ^          |
2          |          4
|          1          |
v          |          v
D ---6---> E <--2--- F
```

Here's the code with detailed outputs:

```python
from collections import defaultdict

class WeightedGraph:
    def __init__(self):
        self.graph = defaultdict(lambda: defaultdict(int))
    
    def add_edge(self, from_vertex, to_vertex, weight=1):
        self.graph[from_vertex][to_vertex] = weight
    
    def get_weight(self, from_vertex, to_vertex):
        return self.graph[from_vertex][to_vertex]
    
    def get_neighbors(self, vertex):
        return list(self.graph[vertex].keys())
    
    def get_vertices(self):
        return list(self.graph.keys())

# Create the graph
g = WeightedGraph()

# Add edges
g.add_edge('A', 'B', 5)
g.add_edge('A', 'D', 2)
g.add_edge('B', 'C', 3)
g.add_edge('C', 'F', 4)
g.add_edge('D', 'E', 6)
g.add_edge('E', 'B', 1)
g.add_edge('F', 'E', 2)

# Test all functions
print("1. Testing get_weight():")
print(f"Weight A->B: {g.get_weight('A', 'B')}")  # 5
print(f"Weight D->E: {g.get_weight('D', 'E')}")  # 6
print(f"Weight A->C: {g.get_weight('A', 'C')}")  # 0 (no direct edge)
print(f"Weight X->Y: {g.get_weight('X', 'Y')}")  # 0 (non-existent vertices)

print("\n2. Testing get_neighbors():")
print(f"A's neighbors: {g.get_neighbors('A')}")  # ['B', 'D']
print(f"E's neighbors: {g.get_neighbors('E')}")  # ['B']
print(f"F's neighbors: {g.get_neighbors('F')}")  # ['E']
print(f"X's neighbors: {g.get_neighbors('X')}")  # [] (non-existent vertex)

print("\n3. Testing get_vertices():")
print(f"All vertices: {g.get_vertices()}")  # ['A', 'B', 'C', 'D', 'E', 'F']

# Print the entire graph structure
print("\n4. Graph structure:")
for vertex in g.get_vertices():
    neighbors = g.get_neighbors(vertex)
    for neighbor in neighbors:
        weight = g.get_weight(vertex, neighbor)
        print(f"{vertex} --{weight}--> {neighbor}")
```

This will output:
```
1. Testing get_weight():
Weight A->B: 5
Weight D->E: 6
Weight A->C: 0
Weight X->Y: 0

2. Testing get_neighbors():
A's neighbors: ['B', 'D']
E's neighbors: ['B']
F's neighbors: ['E']
X's neighbors: []

3. Testing get_vertices():
All vertices: ['A', 'B', 'C', 'D', 'E', 'F']

4. Graph structure:
A --5--> B
A --2--> D
B --3--> C
C --4--> F
D --6--> E
E --1--> B
F --2--> E
```

Key observations:
1. `get_weight()` returns 0 for non-existent edges
2. `get_neighbors()` returns an empty list for non-existent vertices
3. `get_vertices()` only includes vertices that have edges
4. The graph structure is directed (one-way edges)
5. The defaultdict handles all edge cases gracefully without raising errors

This implementation is particularly useful for:
- Pathfinding algorithms (Dijkstra's, A*)
- Network flow problems
- Any graph algorithm that needs weighted edges
- Sparse graphs where most vertices are not connected to each other

Key benefits of using `defaultdict` in graph algorithms:

1. **Cleaner Code**: Eliminates need for explicit key existence checks
2. **Fewer Edge Cases**: Automatically handles new vertices/edges
3. **Reduced Boilerplate**: No need for manual initialization
4. **Flexible Defaults**: Can use different default factories (`list`, `set`, `int`, etc.) based on needs
5. **Performance**: Slightly better performance than manual key checking

Common default factory types used in graph algorithms:
- `defaultdict(list)`: For adjacency lists
- `defaultdict(set)`: When you need unique neighbors
- `defaultdict(int)`: For counting/weighting
- `defaultdict(dict)`: For nested structures (like weighted graphs)
- `defaultdict(lambda: defaultdict(int))`: For matrix-like structures

Using `defaultdict` makes graph implementations more robust and easier to maintain, while reducing the likelihood of KeyError exceptions in your code.

I'll show you practical examples for each `defaultdict` pattern with real coding scenarios!

## 1. `defaultdict(list)` - For Adjacency Lists

### **Example 1: Building a Graph**
```python
from collections import defaultdict

# Build adjacency list for directed graph
graph = defaultdict(list)

# Add edges
edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E")]

for src, dst in edges:
    graph[src].append(dst)

print("Graph adjacency list:")
for node, neighbors in graph.items():
    print(f"{node} -> {neighbors}")

# Output:
# A -> ['B', 'C']
# B -> ['D']  
# C -> ['D']
# D -> ['E']
```

### **Example 2: Grouping Items**
```python
# Group students by grade
students = [
    ("Alice", "A"), ("Bob", "B"), ("Charlie", "A"), 
    ("Diana", "C"), ("Eve", "A"), ("Frank", "B")
]

grade_groups = defaultdict(list)

for name, grade in students:
    grade_groups[grade].append(name)

print("Students by grade:")
for grade, names in sorted(grade_groups.items()):
    print(f"Grade {grade}: {names}")

# Output:
# Grade A: ['Alice', 'Charlie', 'Eve']
# Grade B: ['Bob', 'Frank'] 
# Grade C: ['Diana']
```

### **Example 3: Building Index/Inverted Index**
```python
# Build inverted index for search
documents = {
    1: "python programming language",
    2: "java programming tutorial", 
    3: "python data structures",
    4: "programming best practices"
}

inverted_index = defaultdict(list)

for doc_id, text in documents.items():
    for word in text.split():
        inverted_index[word].append(doc_id)

print("Inverted index:")
for word, doc_ids in sorted(inverted_index.items()):
    print(f"'{word}' appears in documents: {doc_ids}")

# Output:
# 'best' appears in documents: [4]
# 'data' appears in documents: [3]
# 'java' appears in documents: [2]
# 'language' appears in documents: [1]
# 'practices' appears in documents: [4]
# 'programming' appears in documents: [1, 2, 4]
# 'python' appears in documents: [1, 3]
# 'structures' appears in documents: [3]
# 'tutorial' appears in documents: [2]
```

---

## 2. `defaultdict(set)` - For Unique Collections

### **Example 1: Undirected Graph (Unique Neighbors)**
```python
# Undirected graph - each edge goes both ways
graph = defaultdict(set)

edges = [("A", "B"), ("B", "C"), ("A", "C"), ("A", "B")]  # Note: A-B appears twice

for u, v in edges:
    graph[u].add(v)  # Add edge u -> v
    graph[v].add(u)  # Add edge v -> u (undirected)

print("Undirected graph (unique neighbors):")
for node, neighbors in sorted(graph.items()):
    print(f"{node}: {sorted(neighbors)}")

# Output:
# A: ['B', 'C']
# B: ['A', 'C'] 
# C: ['A', 'B']
```

### **Example 2: User Permissions/Roles**
```python
# Track user permissions (no duplicates)
user_permissions = defaultdict(set)

permission_grants = [
    ("alice", "read"), ("alice", "write"), ("alice", "read"),  # duplicate
    ("bob", "read"), ("bob", "admin"), 
    ("charlie", "write"), ("charlie", "delete")
]

for user, permission in permission_grants:
    user_permissions[user].add(permission)

print("User permissions:")
for user, perms in sorted(user_permissions.items()):
    print(f"{user}: {sorted(perms)}")

# Output:
# alice: ['read', 'write']  # No duplicate 'read'
# bob: ['admin', 'read']
# charlie: ['delete', 'write']
```

### **Example 3: Category Tagging**
```python
# Tag items with categories (unique tags per item)
item_tags = defaultdict(set)

tagging_data = [
    ("laptop", "electronics"), ("laptop", "computers"), ("laptop", "electronics"),  # duplicate
    ("book", "education"), ("book", "reading"),
    ("phone", "electronics"), ("phone", "mobile")
]

for item, tag in tagging_data:
    item_tags[item].add(tag)

print("Item tags:")
for item, tags in sorted(item_tags.items()):
    print(f"{item}: {sorted(tags)}")

# Output:
# book: ['education', 'reading']
# laptop: ['computers', 'electronics']  # No duplicate 'electronics'
# phone: ['electronics', 'mobile']
```

---

## 3. `defaultdict(int)` - For Counting/Weighting

### **Example 1: Frequency Counter**
```python
# Count character frequencies
text = "hello world programming"
char_count = defaultdict(int)

for char in text:
    if char != ' ':  # Skip spaces
        char_count[char] += 1

print("Character frequencies:")
for char, count in sorted(char_count.items()):
    print(f"'{char}': {count}")

# Output:
# 'a': 1
# 'd': 1
# 'e': 1
# 'g': 2
# 'h': 1
# 'i': 1
# 'l': 3
# 'm': 2
# 'n': 2
# 'o': 3
# 'p': 1
# 'r': 4
# 't': 1
# 'w': 1
```

### **Example 2: Vote Counting**
```python
# Count votes for candidates
votes = ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice", "Diana", "Bob"]
vote_count = defaultdict(int)

for candidate in votes:
    vote_count[candidate] += 1

print("Vote results:")
for candidate, votes in sorted(vote_count.items(), key=lambda x: x[1], reverse=True):
    print(f"{candidate}: {votes} votes")

# Output:
# Alice: 3 votes
# Bob: 3 votes  
# Charlie: 1 votes
# Diana: 1 votes
```

### **Example 3: Edge Weights in Graph**
```python
# Count edge weights (how many times each edge appears)
edges = [("A", "B"), ("B", "C"), ("A", "B"), ("C", "D"), ("A", "B")]
edge_weights = defaultdict(int)

for u, v in edges:
    edge_key = tuple(sorted([u, v]))  # Normalize edge direction
    edge_weights[edge_key] += 1

print("Edge weights:")
for edge, weight in sorted(edge_weights.items()):
    print(f"{edge[0]} <-> {edge[1]}: weight {weight}")

# Output:
# A <-> B: weight 3
# B <-> C: weight 1
# C <-> D: weight 1
```

---

## 4. `defaultdict(dict)` - For Nested Structures

### **Example 1: Weighted Graph**
```python
# Weighted directed graph
weighted_graph = defaultdict(dict)

# Add weighted edges: (source, target, weight)
edges = [("A", "B", 5), ("A", "C", 3), ("B", "C", 2), ("B", "D", 4), ("C", "D", 1)]

for src, dst, weight in edges:
    weighted_graph[src][dst] = weight

print("Weighted graph:")
for node, neighbors in weighted_graph.items():
    print(f"{node}: {dict(neighbors)}")

# Check edge weight
print(f"\nWeight from A to B: {weighted_graph['A']['B']}")
print(f"Weight from B to C: {weighted_graph['B']['C']}")

# Output:
# A: {'B': 5, 'C': 3}
# B: {'C': 2, 'D': 4}
# C: {'D': 1}
#
# Weight from A to B: 5
# Weight from B to C: 2
```

### **Example 2: Student Grades by Subject**
```python
# Store grades for students by subject
student_grades = defaultdict(dict)

grade_data = [
    ("Alice", "Math", 95), ("Alice", "Science", 87), ("Alice", "History", 92),
    ("Bob", "Math", 78), ("Bob", "Science", 85),
    ("Charlie", "Math", 88), ("Charlie", "History", 90)
]

for student, subject, grade in grade_data:
    student_grades[student][subject] = grade

print("Student grades:")
for student, subjects in student_grades.items():
    print(f"{student}: {dict(subjects)}")
    avg_grade = sum(subjects.values()) / len(subjects)
    print(f"  Average: {avg_grade:.1f}")

# Output:
# Alice: {'Math': 95, 'Science': 87, 'History': 92}
#   Average: 91.3
# Bob: {'Math': 78, 'Science': 85}
#   Average: 81.5
# Charlie: {'Math': 88, 'History': 90}
#   Average: 89.0
```

### **Example 3: Configuration Settings**
```python
# Hierarchical configuration
config = defaultdict(dict)

settings = [
    ("database", "host", "localhost"),
    ("database", "port", 5432),
    ("database", "name", "myapp"),
    ("cache", "type", "redis"),
    ("cache", "ttl", 3600),
    ("api", "version", "v1"),
    ("api", "rate_limit", 1000)
]

for section, key, value in settings:
    config[section][key] = value

print("Configuration:")
for section, settings in config.items():
    print(f"[{section}]")
    for key, value in settings.items():
        print(f"  {key} = {value}")
    print()

# Access config
db_host = config["database"]["host"]
print(f"Database host: {db_host}")

# Output:
# [database]
#   host = localhost
#   port = 5432
#   name = myapp
#
# [cache]
#   type = redis
#   ttl = 3600
#
# [api]
#   version = v1
#   rate_limit = 1000
#
# Database host: localhost
```

---

## 5. `defaultdict(lambda: defaultdict(int))` - For Matrix-like Structures

### **Example 1: 2D Sparse Matrix/Grid Counting**
```python
# Count occurrences in 2D grid
grid_counts = defaultdict(lambda: defaultdict(int))

# Points with their frequencies
points = [(1, 2), (3, 4), (1, 2), (5, 6), (3, 4), (1, 2), (0, 0)]

for x, y in points:
    grid_counts[x][y] += 1

print("2D Grid counts:")
for x in sorted(grid_counts.keys()):
    for y in sorted(grid_counts[x].keys()):
        print(f"({x}, {y}): {grid_counts[x][y]}")

# Access any coordinate (even unvisited ones)
print(f"\nCount at (1, 2): {grid_counts[1][2]}")
print(f"Count at (10, 10): {grid_counts[10][10]}")  # Returns 0 automatically

# Output:
# 2D Grid counts:
# (0, 0): 1
# (1, 2): 3
# (3, 4): 2
# (5, 6): 1
#
# Count at (1, 2): 3
# Count at (10, 10): 0
```

### **Example 2: User Activity Matrix**
```python
# Track user activity by date and action
user_activity = defaultdict(lambda: defaultdict(int))

activities = [
    ("alice", "2024-01-01", "login"), ("alice", "2024-01-01", "view_page"),
    ("alice", "2024-01-01", "login"), ("alice", "2024-01-02", "purchase"),
    ("bob", "2024-01-01", "login"), ("bob", "2024-01-01", "view_page"),
    ("bob", "2024-01-02", "view_page")
]

for user, date, action in activities:
    user_activity[user][f"{date}_{action}"] += 1

print("User activity matrix:")
for user in sorted(user_activity.keys()):
    print(f"{user}:")
    for activity, count in sorted(user_activity[user].items()):
        print(f"  {activity}: {count}")
    print()

# Query specific user activity
alice_logins_jan1 = user_activity["alice"]["2024-01-01_login"]
print(f"Alice's logins on 2024-01-01: {alice_logins_jan1}")

# Output:
# User activity matrix:
# alice:
#   2024-01-01_login: 2
#   2024-01-01_view_page: 1
#   2024-01-02_purchase: 1
#
# bob:
#   2024-01-01_login: 1
#   2024-01-01_view_page: 1
#   2024-01-02_view_page: 1
#
# Alice's logins on 2024-01-01: 2
```

### **Example 3: Distance Matrix for Graph**
```python
# Build distance matrix (shortest paths between all pairs)
distance_matrix = defaultdict(lambda: defaultdict(lambda: float('inf')))

# Initialize with direct edges
edges = [("A", "B", 4), ("A", "C", 2), ("B", "C", 1), ("B", "D", 5), ("C", "D", 8)]

# Add direct distances
for u, v, dist in edges:
    distance_matrix[u][v] = dist
    distance_matrix[v][u] = dist  # Undirected

# Set distance from node to itself as 0
nodes = set()
for u, v, _ in edges:
    nodes.update([u, v])

for node in nodes:
    distance_matrix[node][node] = 0

# Floyd-Warshall algorithm for all shortest paths
for k in nodes:
    for i in nodes:
        for j in nodes:
            if distance_matrix[i][k] + distance_matrix[k][j] < distance_matrix[i][j]:
                distance_matrix[i][j] = distance_matrix[i][k] + distance_matrix[k][j]

print("Distance matrix (shortest paths):")
print("     A    B    C    D")
for i in sorted(nodes):
    print(f"{i}:", end="")
    for j in sorted(nodes):
        dist = distance_matrix[i][j]
        if dist == float('inf'):
            print(f"  ∞", end="")
        else:
            print(f"{dist:4.0f}", end="")
    print()

# Query shortest path
print(f"\nShortest distance from A to D: {distance_matrix['A']['D']}")

# Output:
# Distance matrix (shortest paths):
#      A    B    C    D
# A:   0    3    2   10
# B:   3    0    1    5  
# C:   2    1    0    6
# D:  10    5    6    0
#
# Shortest distance from A to D: 10
```

## Summary of Use Cases

| Pattern | Best For | Key Benefit |
|---------|----------|-------------|
| `defaultdict(list)` | Adjacency lists, grouping, indexing | Automatic empty list creation |
| `defaultdict(set)` | Unique collections, undirected graphs | Automatic deduplication |
| `defaultdict(int)` | Counting, frequencies, weights | Starts at 0, supports += |
| `defaultdict(dict)` | Nested mappings, weighted graphs | Two-level hierarchy |
| `defaultdict(lambda: defaultdict(int))` | Matrices, multi-dimensional counting | Infinite nesting with auto-initialization |

Each pattern eliminates the need for existence checks and makes code cleaner and more readable! 🎯
I'll walk through the Distance Matrix example step-by-step, showing how the Floyd-Warshall algorithm builds the shortest path matrix.

## Initial Setup

```python
# Starting edges
edges = [("A", "B", 4), ("A", "C", 2), ("B", "C", 1), ("B", "D", 5), ("C", "D", 8)]
nodes = {"A", "B", "C", "D"}

# Initialize distance matrix with infinity
distance_matrix = defaultdict(lambda: defaultdict(lambda: float('inf')))
```

**Initial state** (all distances are ∞):
```
     A    B    C    D
A:   ∞    ∞    ∞    ∞
B:   ∞    ∞    ∞    ∞  
C:   ∞    ∞    ∞    ∞
D:   ∞    ∞    ∞    ∞
```

## Step 1: Add Direct Edges

```python
# Process each edge: (u, v, dist)
# ("A", "B", 4)
distance_matrix["A"]["B"] = 4
distance_matrix["B"]["A"] = 4

# ("A", "C", 2)  
distance_matrix["A"]["C"] = 2
distance_matrix["C"]["A"] = 2

# ("B", "C", 1)
distance_matrix["B"]["C"] = 1
distance_matrix["C"]["B"] = 1

# ("B", "D", 5)
distance_matrix["B"]["D"] = 5
distance_matrix["D"]["B"] = 5

# ("C", "D", 8)
distance_matrix["C"]["D"] = 8
distance_matrix["D"]["C"] = 8
```

**After adding direct edges**:
```
     A    B    C    D
A:   ∞    4    2    ∞
B:   4    ∞    1    5  
C:   2    1    ∞    8
D:   ∞    5    8    ∞
```

## Step 2: Set Diagonal to 0

```python
# Set distance from each node to itself as 0
distance_matrix["A"]["A"] = 0
distance_matrix["B"]["B"] = 0
distance_matrix["C"]["C"] = 0
distance_matrix["D"]["D"] = 0
```

**After setting diagonal**:
```
     A    B    C    D
A:   0    4    2    ∞
B:   4    0    1    5  
C:   2    1    0    8
D:   ∞    5    8    0
```

## Step 3: Floyd-Warshall Algorithm

### **k = "A" (via node A)**

```python
# For each pair (i, j), check if path i -> A -> j is shorter
# i="A", j="A": distance_matrix["A"]["A"] + distance_matrix["A"]["A"] = 0 + 0 = 0 ≮ 0
# i="A", j="B": distance_matrix["A"]["A"] + distance_matrix["A"]["B"] = 0 + 4 = 4 ≮ 4  
# i="A", j="C": distance_matrix["A"]["A"] + distance_matrix["A"]["C"] = 0 + 2 = 2 ≮ 2
# i="A", j="D": distance_matrix["A"]["A"] + distance_matrix["A"]["D"] = 0 + ∞ = ∞ ≮ ∞

# i="B", j="A": distance_matrix["B"]["A"] + distance_matrix["A"]["A"] = 4 + 0 = 4 ≮ 4
# i="B", j="B": distance_matrix["B"]["A"] + distance_matrix["A"]["B"] = 4 + 4 = 8 ≮ 0
# i="B", j="C": distance_matrix["B"]["A"] + distance_matrix["A"]["C"] = 4 + 2 = 6 ≮ 1
# i="B", j="D": distance_matrix["B"]["A"] + distance_matrix["A"]["D"] = 4 + ∞ = ∞ ≮ 5

# i="C", j="A": distance_matrix["C"]["A"] + distance_matrix["A"]["A"] = 2 + 0 = 2 ≮ 2
# i="C", j="B": distance_matrix["C"]["A"] + distance_matrix["A"]["B"] = 2 + 4 = 6 ≮ 1
# i="C", j="C": distance_matrix["C"]["A"] + distance_matrix["A"]["C"] = 2 + 2 = 4 ≮ 0
# i="C", j="D": distance_matrix["C"]["A"] + distance_matrix["A"]["D"] = 2 + ∞ = ∞ ≮ 8

# i="D", j="A": distance_matrix["D"]["A"] + distance_matrix["A"]["A"] = ∞ + 0 = ∞ ≮ ∞
# i="D", j="B": distance_matrix["D"]["A"] + distance_matrix["A"]["B"] = ∞ + 4 = ∞ ≮ 5
# i="D", j="C": distance_matrix["D"]["A"] + distance_matrix["A"]["C"] = ∞ + 2 = ∞ ≮ 8
# i="D", j="D": distance_matrix["D"]["A"] + distance_matrix["A"]["D"] = ∞ + ∞ = ∞ ≮ 0
```

**No updates after k="A"**:
```
     A    B    C    D
A:   0    4    2    ∞
B:   4    0    1    5  
C:   2    1    0    8
D:   ∞    5    8    0
```

### **k = "B" (via node B)**

```python
# Key updates:
# i="A", j="C": distance_matrix["A"]["B"] + distance_matrix["B"]["C"] = 4 + 1 = 5 ≮ 2 (no update)
# i="A", j="D": distance_matrix["A"]["B"] + distance_matrix["B"]["D"] = 4 + 5 = 9 < ∞ ✓
distance_matrix["A"]["D"] = 9

# i="C", j="A": distance_matrix["C"]["B"] + distance_matrix["B"]["A"] = 1 + 4 = 5 ≮ 2 (no update)  
# i="C", j="D": distance_matrix["C"]["B"] + distance_matrix["B"]["D"] = 1 + 5 = 6 < 8 ✓
distance_matrix["C"]["D"] = 6

# i="D", j="A": distance_matrix["D"]["B"] + distance_matrix["B"]["A"] = 5 + 4 = 9 < ∞ ✓
distance_matrix["D"]["A"] = 9

# i="D", j="C": distance_matrix["D"]["B"] + distance_matrix["B"]["C"] = 5 + 1 = 6 < 8 ✓
distance_matrix["D"]["C"] = 6
```

**After k="B"**:
```
     A    B    C    D
A:   0    4    2    9
B:   4    0    1    5  
C:   2    1    0    6
D:   9    5    6    0
```

### **k = "C" (via node C)**

```python
# Key updates:
# i="A", j="B": distance_matrix["A"]["C"] + distance_matrix["C"]["B"] = 2 + 1 = 3 < 4 ✓
distance_matrix["A"]["B"] = 3

# i="A", j="D": distance_matrix["A"]["C"] + distance_matrix["C"]["D"] = 2 + 6 = 8 < 9 ✓
distance_matrix["A"]["D"] = 8

# i="B", j="A": distance_matrix["B"]["C"] + distance_matrix["C"]["A"] = 1 + 2 = 3 < 4 ✓
distance_matrix["B"]["A"] = 3

# i="B", j="D": distance_matrix["B"]["C"] + distance_matrix["C"]["D"] = 1 + 6 = 7 ≮ 5 (no update)

# i="D", j="A": distance_matrix["D"]["C"] + distance_matrix["C"]["A"] = 6 + 2 = 8 < 9 ✓
distance_matrix["D"]["A"] = 8

# i="D", j="B": distance_matrix["D"]["C"] + distance_matrix["C"]["B"] = 6 + 1 = 7 ≮ 5 (no update)
```

**After k="C"**:
```
     A    B    C    D
A:   0    3    2    8
B:   3    0    1    5  
C:   2    1    0    6
D:   8    5    6    0
```

### **k = "D" (via node D)**

```python
# Key checks:
# i="A", j="B": distance_matrix["A"]["D"] + distance_matrix["D"]["B"] = 8 + 5 = 13 ≮ 3 (no update)
# i="A", j="C": distance_matrix["A"]["D"] + distance_matrix["D"]["C"] = 8 + 6 = 14 ≮ 2 (no update)

# i="B", j="A": distance_matrix["B"]["D"] + distance_matrix["D"]["A"] = 5 + 8 = 13 ≮ 3 (no update)
# i="B", j="C": distance_matrix["B"]["D"] + distance_matrix["D"]["C"] = 5 + 6 = 11 ≮ 1 (no update)

# i="C", j="A": distance_matrix["C"]["D"] + distance_matrix["D"]["A"] = 6 + 8 = 14 ≮ 2 (no update)
# i="C", j="B": distance_matrix["C"]["D"] + distance_matrix["D"]["B"] = 6 + 5 = 11 ≮ 1 (no update)
```

**Final matrix after k="D"** (no changes):
```
     A    B    C    D
A:   0    3    2    8
B:   3    0    1    5  
C:   2    1    0    6
D:   8    5    6    0
```

## Key Updates Summary

1. **k="A"**: No improvements (A not useful as intermediate)
2. **k="B"**: Found A↔D paths via B (A→B→D = 9, D→B→A = 9), C↔D improved via B (C→B→D = 6)
3. **k="C"**: Found better A↔B paths via C (A→C→B = 3), improved A↔D via C (A→C→D = 8)  
4. **k="D"**: No improvements (going via D is longer for remaining pairs)

**Final shortest distances:**
- A to D: 8 (via A→C→D: 2+6=8)
- B to A: 3 (via B→C→A: 1+2=3)
- All other pairs use direct or 2-hop paths

# map()
#interview/python
[Python map\(\) function](https://www.geeksforgeeks.org/python-map-function/)


# Common Use Cases of Python's map() Function

The `map()` function in Python is a powerful tool for applying a function to each item in an iterable. Let me demonstrate some common and practical use cases based on the information from [GeeksforGeeks](https://www.geeksforgeeks.org/python-map-function/).

## 1. Type Conversion

One of the most common uses is to convert all elements in a list from one type to another:

```python
# Converting a list of strings to integers
string_numbers = ['1', '2', '3', '4', '5']
numbers = list(map(int, string_numbers))
print(numbers)  # Output: [1, 2, 3, 4, 5]

# Converting numbers to strings
numbers = [1, 2, 3, 4, 5]
string_numbers = list(map(str, numbers))
print(string_numbers)  # Output: ['1', '2', '3', '4', '5']
```

## 2. String Manipulation

You can use `map()` to perform operations on strings in a list:

```python
# Converting all strings to uppercase
names = ['alice', 'bob', 'charlie']
uppercase_names = list(map(str.upper, names))
print(uppercase_names)  # Output: ['ALICE', 'BOB', 'CHARLIE']

# Removing whitespace from strings
messy_strings = ['  hello  ', '  world ', ' python  ']
clean_strings = list(map(str.strip, messy_strings))
print(clean_strings)  # Output: ['hello', 'world', 'python']
```

## 3. Mathematical Operations with Lambda Functions

Using `map()` with lambda functions for mathematical transformations:

```python
# Squaring all numbers in a list
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # Output: [1, 4, 9, 16, 25]

# Converting temperatures from Celsius to Fahrenheit
celsius = [0, 20, 37, 100]
fahrenheit = list(map(lambda c: (c * 9/5) + 32, celsius))
print(fahrenheit)  # Output: [32.0, 68.0, 98.6, 212.0]
```

## 4. Working with Multiple Iterables

The `map()` function can take multiple iterables when the function requires multiple arguments:

```python
# Adding corresponding elements from two lists
list1 = [1, 2, 3]
list2 = [4, 5, 6]
sums = list(map(lambda x, y: x + y, list1, list2))
print(sums)  # Output: [5, 7, 9]

# Combining first and last names
first_names = ['John', 'Jane', 'Michael']
last_names = ['Doe', 'Smith', 'Johnson']
full_names = list(map(lambda first, last: f"{first} {last}", first_names, last_names))
print(full_names)  # Output: ['John Doe', 'Jane Smith', 'Michael Johnson']
```

## 5. Data Extraction and Transformation

Using `map()` to extract specific data from complex structures:

```python
# Extracting specific keys from dictionaries
people = [
    {'name': 'Alice', 'age': 25},
    {'name': 'Bob', 'age': 30},
    {'name': 'Charlie', 'age': 35}
]
names = list(map(lambda person: person['name'], people))
print(names)  # Output: ['Alice', 'Bob', 'Charlie']

# Extracting first character from each string
words = ['apple', 'banana', 'cherry']
first_chars = list(map(lambda s: s[0], words))
print(first_chars)  # Output: ['a', 'b', 'c']
```

The `map()` function is particularly useful when you need to apply the same operation to all elements in a collection without writing explicit loops, making your code more concise and often more readable.

# str
#interview/python




# Handling Different String Types and Indexing in Python

Let me show you various string operations and indexing techniques in Python with examples:

## Basic String Indexing

```python
s = "Hello, World!"

# Accessing individual characters
first_char = s[0]  # 'H'
fifth_char = s[4]  # 'o'

# Negative indexing (counting from the end)
last_char = s[-1]  # '!'
second_last = s[-2]  # 'd'

# Getting the length
length = len(s)  # 13
```

## String Slicing

```python
s = "Hello, World!"

# Basic slicing [start:end] (end is exclusive)
first_five = s[0:5]  # "Hello"
# Shorthand for starting at 0
first_five = s[:5]  # "Hello"

# From index 7 to the end
world = s[7:]  # "World!"

# Negative indices in slicing
last_five = s[-5:]  # "orld!"

# Slicing with step [start:end:step]
every_second = s[::2]  # "Hlo ol!"
reverse = s[::-1]  # "!dlroW ,olleH"
```

## String Methods

```python
s = "  Hello, World!  "

# Removing whitespace
stripped = s.strip()  # "Hello, World!"
left_strip = s.lstrip()  # "Hello, World!  "
right_strip = s.rstrip()  # "  Hello, World!"

# Case conversion
upper = s.upper()  # "  HELLO, WORLD!  "
lower = s.lower()  # "  hello, world!  "
title = s.title()  # "  Hello, World!  "

# Checking content
starts_with = s.startswith("  He")  # True
ends_with = s.endswith("!  ")  # True
contains = "World" in s  # True

# Finding substrings
position = s.find("World")  # 9
count = s.count("l")  # 3

# Replacing
replaced = s.replace("World", "Python")  # "  Hello, Python!  "
```

## String Splitting and Joining

```python
# Splitting strings
sentence = "This is a sample sentence"
words = sentence.split()  # ["This", "is", "a", "sample", "sentence"]

csv = "apple,banana,cherry,date"
fruits = csv.split(",")  # ["apple", "banana", "cherry", "date"]

# Joining strings
joined = " ".join(words)  # "This is a sample sentence"
csv_again = ",".join(fruits)  # "apple,banana,cherry,date"
```

## String Iteration

```python
s = "Python"

# Character by character
for char in s:
    print(char)  # Prints P, y, t, h, o, n on separate lines

# With index
for i in range(len(s)):
    print(f"Character at index {i} is {s[i]}")
```

## String Checking Methods

```python
# Character type checking
s = "Python3.9"

# Check entire string
s.isalpha()  # False (contains numbers and a period)
s.isalnum()  # False (contains a period)
s.isdigit()  # False (contains letters and a period)

# Check individual characters
for char in s:
    if char.isalpha():
        print(f"{char} is a letter")
    elif char.isdigit():
        print(f"{char} is a digit")
    else:
        print(f"{char} is a special character")
```

## Parsing Numbers from Strings

```python
# Similar to the calculator problem
s = "123 456 789"
i = 0
numbers = []

while i < len(s):
    # Skip spaces
    if s[i] == ' ':
        i += 1
        continue
        
    # Parse number
    if s[i].isdigit():
        num = 0
        while i < len(s) and s[i].isdigit():
            num = num * 10 + int(s[i])
            i += 1
        numbers.append(num)
    else:
        i += 1

print(numbers)  # [123, 456, 789]
```

These examples cover a wide range of string operations and indexing techniques that are commonly used in Python programming, including those relevant to parsing and processing strings in problems like the Basic Calculator.

# Sorted
#interview/python
Yes, Python's `sorted()` function uses a hybrid sorting algorithm called Timsort, which is a combination of merge sort and insertion sort. The time complexity is indeed O(n log n) in the worst, average, and best cases.

Some key points about Timsort:

1. It was specifically designed for Python by Tim Peters in 2002
2. It's a hybrid sorting algorithm that:
   - Uses merge sort for larger sequences
   - Uses insertion sort for smaller sequences (typically less than 64 elements)
   - Takes advantage of pre-existing order in the data ("natural runs")

3. Space complexity is O(n)

4. It's very efficient for real-world data and is also used in other languages:
   - Java's `Arrays.sort()` and `Collections.sort()`
   - Android's default sorting implementation
   - Swift's sorting implementation

So in your activity selection code:
```python
activities = sorted(zip(start, end), key=lambda x: x[1])
```
The time complexity breaks down as:
- `zip()`: O(n)
- `sorted()`: O(n log n)
- Overall: O(n log n)

The space complexity is O(n) as it needs to store the zipped and sorted pairs.

This is actually optimal for comparison-based sorting algorithms - it's mathematically proven that comparison-based sorting cannot be done faster than O(n log n) in the worst and average cases.

Let me explain the key differences between Python's `sort()` method and the `sorted()` function:

1. **Return Value**:
   - `sort()` modifies the original list in-place and returns `None`
   - `sorted()` creates and returns a new sorted list, leaving the original unchanged

2. **Usage**:
   - `sort()` is a method that can only be used with lists
   - `sorted()` is a function that can work with any iterable (lists, tuples, strings, etc.)

Here's a practical example to demonstrate:

```python
# Using sort() method
original_list = [3, 1, 4, 1, 5]
result = original_list.sort()
print(result)         # None
print(original_list)  # [1, 1, 3, 4, 5]

# Using sorted() function
original_list = [3, 1, 4, 1, 5]
new_list = sorted(original_list)
print(new_list)       # [1, 1, 3, 4, 5]
print(original_list)  # [3, 1, 4, 1, 5] - original remains unchanged

# sorted() works with other iterables
tuple_example = (3, 1, 4, 1, 5)
sorted_tuple = sorted(tuple_example)  # Returns a list: [1, 1, 3, 4, 5]
string_example = "hello"
sorted_string = sorted(string_example)  # Returns a list: ['e', 'h', 'l', 'l', 'o']
```

In your code, `jobs.sort(key=lambda x: x[2], reverse=True)` modifies the `jobs` list in-place. If you wanted to keep the original list unchanged, you could use:

```python:data_structure/greedy.py
sorted_jobs = sorted(jobs, key=lambda x: x[2], reverse=True)
```

Choose between them based on:
- Use `sort()` when you want to modify the original list and don't need the original order
- Use `sorted()` when you need to preserve the original list or when working with non-list iterables

# Deque
#interview/python
```python
from collections import deque
```

Let me explain the key differences between `.extend()` and `.append()` with examples:

`.append()` adds a single element to the end of the list/deque:
```python
lst = [1, 2, 3]
lst.append([4, 5])
print(lst)  # [1, 2, 3, [4, 5]]  <- adds the entire list as ONE element
```

`.extend()` adds each element of the iterable individually:
```python
lst = [1, 2, 3]
lst.extend([4, 5])
print(lst)  # [1, 2, 3, 4, 5]  <- adds each element separately
```

In the context of your graph traversal code:
```python:data_structure/graph_sort.py
# Using append would be wrong:
queue.append(graph[node])  # Would add the entire neighbor list as one element
# ['A', ['B', 'C']]  <- wrong structure

# Using extend is correct:
queue.extend(graph[node])  # Adds each neighbor individually
# ['A', 'B', 'C']  <- correct structure
```

Common use cases:
- Use `.append()` when you want to add a single item
- Use `.extend()` when you want to add multiple items from an iterable (list, tuple, etc.)

Another example showing the difference:
```python
deque1 = deque([1, 2])
deque2 = deque([1, 2])

deque1.append([3, 4])
print(deque1)  # deque([1, 2, [3, 4]])

deque2.extend([3, 4])
print(deque2)  # deque([1, 2, 3, 4])
```

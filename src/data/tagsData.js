// Comprehensive tags data containing metadata, time/space complexities, rules, templates and edge cases.
// Generated dynamically from live Codeforces API data.
export const tagsData = {
  "dp": {
    "name": "Dynamic Programming",
    "category": "Optimization & Counting",
    "timeComplexity": "O(N * S)",
    "spaceComplexity": "O(N)",
    "timeProgress": 65,
    "spaceProgress": 40,
    "timeLabel": "O(State count * Transitions)",
    "spaceLabel": "O(State space)",
    "rules": [
      "The problem asks for an **optimal value** (min/max) or the **number of ways** to do something.",
      "The decision at state `i` depends on the optimal decisions of **smaller, overlapping subproblems**.",
      "The state can be represented with few variables, showing the **optimal substructure** property.",
      "You can solve it using top-down **memoization** or bottom-up iterative table filling."
    ],
    "keywords": [
      "overlapping subproblems",
      "optimal substructure",
      "state transition",
      "memoization",
      "tabulation",
      "knapsack",
      "subset sum"
    ],
    "templates": [
      {
        "name": "1D Memoization (Top-down)",
        "code": "// C++ Template: 1D Top-Down DP\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nconst int MOD = 1e9 + 7;\nvector<long long> memo;\n\nlong long solve(int n, const vector<int>& cost) {\n    if (n < 0) return 0;\n    if (n == 0 || n == 1) return cost[n];\n    if (memo[n] != -1) return memo[n];\n    \n    long long ans = cost[n] + min(solve(n - 1, cost), solve(n - 2, cost));\n    return memo[n] = ans % MOD;\n}\n\nint main() {\n    int n = 10;\n    vector<int> cost = {2, 4, 1, 5, 8, 3, 9, 2, 7, 6};\n    memo.assign(n, -1);\n    cout << \"Minimum Cost: \" << solve(n - 1, cost) << endl;\n    return 0;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Base Case Mistakes",
        "desc": "Forgetting to initialize dp[0] or initializing it incorrectly when looking for min/max."
      },
      {
        "title": "Integer Overflow",
        "desc": "Adding DP states can overflow. Apply modulo at each transition step."
      }
    ],
    "totalProblems": 2493
  },
  "graphs": {
    "name": "Graphs & Trees",
    "category": "Network & Traversal",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "timeProgress": 45,
    "spaceProgress": 60,
    "timeLabel": "O(V + E) for BFS/DFS, O(E log V) for Dijkstra",
    "spaceLabel": "O(V + E) Adjacency list & recursion stack",
    "rules": [
      "The problem represents elements as **nodes** and relationships as **edges**.",
      "Requires finding the **shortest path**, **connected components**, or topological sorting.",
      "Tree properties hold (no cycles, exactly $N-1$ edges, connected)."
    ],
    "keywords": [
      "nodes and edges",
      "connected components",
      "shortest path",
      "cycle detection",
      "topological sort",
      "bipartite"
    ],
    "templates": [
      {
        "name": "Depth First Search (DFS)",
        "code": "// C++ Template: DFS on Adjacency List\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> adj;\nvector<bool> visited;\n\nvoid dfs(int u) {\n    visited[u] = true;\n    for (int v : adj[u]) {\n        if (!visited[v]) {\n            dfs(v);\n        }\n    }\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Disconnected Components",
        "desc": "Graph contains multiple clusters. A single DFS from node 1 won't visit everything."
      }
    ],
    "totalProblems": 2188
  },
  "math": {
    "name": "Math & Number Theory",
    "category": "Arithmetic & Theory",
    "timeComplexity": "O(sqrt(N))",
    "spaceComplexity": "O(1)",
    "timeProgress": 35,
    "spaceProgress": 15,
    "timeLabel": "O(log N) for GCD, O(N log log N) for Sieve",
    "spaceLabel": "O(1) auxiliary space, O(N) for sieve store",
    "rules": [
      "The problem deals with prime factorization, divisors, or GCD / LCM.",
      "Combinatorics is involved (permutations, combinations, counting combinations under modulo).",
      "Values need modular inverse, modular exponentiation, or matrix exponentiation."
    ],
    "keywords": [
      "prime factorization",
      "gcd",
      "lcm",
      "modular inverse",
      "nCr combinations",
      "coprime"
    ],
    "templates": [
      {
        "name": "GCD & Fast Exponentiation",
        "code": "// Euclidean Algorithm\nlong long gcd(long long a, long long b) {\n    return b == 0 ? a : gcd(b, a % b);\n}\n\n// Binary Exponentiation O(log B)\nlong long power(long long base, long long exp, long long mod) {\n    long long res = 1;\n    base %= mod;\n    while (exp > 0) {\n        if (exp % 2 == 1) res = (res * base) % mod;\n        base = (base * base) % mod;\n        exp /= 2;\n    }\n    return res;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Modulo Negative Numbers",
        "desc": "In C++, a % b can be negative. Use (a % b + b) % b."
      }
    ],
    "totalProblems": 4086
  },
  "binary search": {
    "name": "Binary Search",
    "category": "Search & Divide",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "timeProgress": 20,
    "spaceProgress": 15,
    "timeLabel": "O(log N) operations",
    "spaceLabel": "O(1) constants",
    "rules": [
      "The answer lies in a **monotonic search space** (e.g. if X works, all Y > X also work).",
      "You need to find the first/last element satisfying a **boolean check function**."
    ],
    "keywords": [
      "monotonicity",
      "binary search on answer",
      "lower bound",
      "predicate function"
    ],
    "templates": [
      {
        "name": "Binary Search on Answer",
        "code": "// C++ Template: Binary Search on Monotonic Answer Space\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nbool isValid(long long x, const vector<int>& items, int k) {\n    int groups = 0;\n    long long current_sum = 0;\n    for (int val : items) {\n        if (val > x) return false;\n        if (current_sum + val > x) {\n            groups++;\n            current_sum = val;\n        } else {\n            current_sum += val;\n        }\n    }\n    if (current_sum > 0) groups++;\n    return groups <= k;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Mid Overflow",
        "desc": "Using (l + r) / 2 can trigger signed integer overflow. Use l + (r - l) / 2."
      }
    ],
    "totalProblems": 1284
  },
  "greedy": {
    "name": "Greedy Algorithms",
    "category": "Heuristic Selection",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(1)",
    "timeProgress": 50,
    "spaceProgress": 25,
    "timeLabel": "O(N log N) (typically due to sorting)",
    "spaceLabel": "O(1) auxiliary space",
    "rules": [
      "Making the **locally optimal choice** at each stage leads to a **globally optimal solution**.",
      "Sorting elements by weight, value, deadline, or index ratio reveals the ordering strategy."
    ],
    "keywords": [
      "local optimum",
      "global optimum",
      "sorting strategy",
      "interval scheduling"
    ],
    "templates": [
      {
        "name": "Activity Selection",
        "code": "// Activity selection: Sort by end time\n#include <vector>\n#include <algorithm>\nusing namespace std;\nstruct Interval { int start, end; };\nbool compareIntervals(const Interval& a, const Interval& b) { return a.end < b.end; }"
      }
    ],
    "edgeCases": [
      {
        "title": "Failure to Prove",
        "desc": "Greedy choice feels correct but fails on critical corner cases. Always sketch small boundary cases."
      }
    ],
    "totalProblems": 3497
  },
  "data structures": {
    "name": "Data Structures",
    "category": "Queries & Updates",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 55,
    "spaceProgress": 55,
    "timeLabel": "O(log N) per query/update",
    "spaceLabel": "O(N) data structure allocations",
    "rules": [
      "Requires frequent **range queries** (sum, min, max) and **point updates**.",
      "Segment Tree, Fenwick Tree, or DSU are required."
    ],
    "keywords": [
      "segment tree",
      "fenwick tree",
      "sparse table",
      "disjoint set union"
    ],
    "templates": [
      {
        "name": "Fenwick Tree (BIT)",
        "code": "// C++ Fenwick Tree\n#include <vector>\nusing namespace std;\nstruct Fenwick {\n    vector<int> tree;\n    Fenwick(int n) { tree.assign(n + 1, 0); }\n    void add(int idx, int delta) {\n        for (; idx < tree.size(); idx += idx & -idx) tree[idx] += delta;\n    }\n    int query(int idx) {\n        int sum = 0;\n        for (; idx > 0; idx -= idx & -idx) sum += tree[idx];\n        return sum;\n    }\n};"
      }
    ],
    "edgeCases": [
      {
        "title": "Off-by-one Indexing",
        "desc": "Fenwick tree requires 1-based indexing. Accessing index 0 leads to infinite loops."
      }
    ],
    "totalProblems": 2782
  },
  "strings": {
    "name": "Strings & Hashing",
    "category": "Sequence Matching",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 35,
    "spaceProgress": 35,
    "timeLabel": "O(N) matching / KMP",
    "spaceLabel": "O(N) suffix structures / hashes",
    "rules": [
      "The problem asks for substring matching, prefix/suffix relationships, or periodic structures.",
      "Requires checking occurrences of a pattern in a text efficiently."
    ],
    "keywords": [
      "rolling hash",
      "KMP",
      "trie",
      "lcp",
      "prefix function"
    ],
    "templates": [
      {
        "name": "Prefix Function (pi array)",
        "code": "// Compute prefix function\n#include <vector>\n#include <string>\nusing namespace std;\nvector<int> prefix_function(string s) {\n    int n = s.length();\n    vector<int> pi(n, 0);\n    for (int i = 1; i < n; i++) {\n        int j = pi[i - 1];\n        while (j > 0 && s[i] != s[j]) j = pi[j - 1];\n        if (s[i] == s[j]) j++;\n        pi[i] = j;\n    }\n    return pi;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Hash Collisions",
        "desc": "Single hashes are vulnerable to collision test cases. Use double hashes."
      }
    ],
    "totalProblems": 995
  },
  "two pointers": {
    "name": "Two Pointers",
    "category": "Array & Linear Search",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "timeProgress": 90,
    "spaceProgress": 95,
    "timeLabel": "O(N) single pass",
    "spaceLabel": "O(1) extra space",
    "rules": [
      "We maintain two indices (left and right) and move them towards each other or in the same direction based on a condition."
    ],
    "keywords": [
      "two pointers",
      "sliding window",
      "target sum",
      "subarray"
    ],
    "templates": [
      {
        "name": "Sliding Window Maximum Sum",
        "code": "// C++ Sliding Window Sum\n#include <vector>\nusing namespace std;\nint maxWindowSum(const vector<int>& a, int k) {\n    int sum = 0, n = a.size();\n    for (int i = 0; i < k; i++) sum += a[i];\n    int mx = sum;\n    for (int i = k; i < n; i++) {\n        sum += a[i] - a[i - k];\n        mx = max(mx, sum);\n    }\n    return mx;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Pointers Cross",
        "desc": "Ensure left and right pointers don't cross and index bounds are verified."
      }
    ],
    "totalProblems": 643
  },
  "sortings": {
    "name": "Sorting",
    "category": "Fundamentals & Ordering",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(1)",
    "timeProgress": 80,
    "spaceProgress": 85,
    "timeLabel": "O(N log N) comparison sort",
    "spaceLabel": "O(1) auxiliary space",
    "rules": [
      "Arranging elements in increasing or decreasing order simplifies the problem structure.",
      "Enables binary search, greedy choices, and coordinate compression."
    ],
    "keywords": [
      "sorting",
      "comparator",
      "quicksort",
      "mergesort"
    ],
    "templates": [
      {
        "name": "Strict Weak Ordering",
        "code": "// C++ Custom Comparator\n#include <vector>\n#include <algorithm>\nusing namespace std;\nstruct Pair { int x, y; };\nbool cmp(const Pair& a, const Pair& b) {\n    if (a.x != b.x) return a.x < b.x;\n    return a.y > b.y; // strict weak ordering\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Equality in Comparators",
        "desc": "Returning true for equal elements triggers segmentation faults in std::sort."
      }
    ],
    "totalProblems": 1233
  },
  "number theory": {
    "name": "Number Theory",
    "category": "Mathematics & Modulo Arithmetic",
    "timeComplexity": "O(sqrt(N))",
    "spaceComplexity": "O(N)",
    "timeProgress": 75,
    "spaceProgress": 60,
    "timeLabel": "O(sqrt(N)) primality check, O(N log log N) Sieve",
    "spaceLabel": "O(N) Sieve array",
    "rules": [
      "Involves prime factorization, divisors, GCD, LCM, or modular arithmetic."
    ],
    "keywords": [
      "prime",
      "sieve",
      "gcd",
      "modular inverse",
      "divisors"
    ],
    "templates": [
      {
        "name": "Prime Sieve",
        "code": "// C++ Prime Sieve\n#include <vector>\nusing namespace std;\nvector<int> min_prime;\nvoid sieve(int limit) {\n    min_prime.assign(limit + 1, 0);\n    for (int i = 2; i <= limit; i++) {\n        if (min_prime[i] == 0) {\n            for (int j = i; j <= limit; j += i) {\n                if (min_prime[j] == 0) min_prime[j] = i;\n            }\n        }\n    }\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Integer Overflow",
        "desc": "Multiplications in modular arithmetic must be cast to long long to prevent overflows."
      }
    ],
    "totalProblems": 881
  },
  "bitmasks": {
    "name": "Bit Manipulation",
    "category": "Bitwise Operations & Subsets",
    "timeComplexity": "O(2^N * N)",
    "spaceComplexity": "O(2^N)",
    "timeProgress": 85,
    "spaceProgress": 70,
    "timeLabel": "O(1) bitwise or O(2^N) subset iteration",
    "spaceLabel": "O(2^N) DP table",
    "rules": [
      "Represents subsets as integer bitmasks where the i-th bit indicates inclusion."
    ],
    "keywords": [
      "bitmask",
      "xor",
      "and",
      "or",
      "popcount",
      "subset"
    ],
    "templates": [
      {
        "name": "Bitwise Basics",
        "code": "// Bitwise Operations in C++\nint checkBit(int mask, int i) { return (mask >> i) & 1; }\nint setBit(int mask, int i) { return mask | (1 << i); }\nint clearBit(int mask, int i) { return mask & ~(1 << i); }\nint toggleBit(int mask, int i) { return mask ^ (1 << i); }"
      }
    ],
    "edgeCases": [
      {
        "title": "Integer Overflow",
        "desc": "1 << x overflows standard 32-bit limits if x >= 31. Use 1LL << x."
      }
    ],
    "totalProblems": 702
  },
  "constructive algorithms": {
    "name": "Constructive Algorithms",
    "category": "Ad-hoc & Pattern Design",
    "timeComplexity": "O(N) or O(1)",
    "spaceComplexity": "O(N) or O(1)",
    "timeProgress": 70,
    "spaceProgress": 80,
    "timeLabel": "O(N) or O(1) pattern construction",
    "spaceLabel": "O(1) extra space",
    "rules": [
      "Construct an answer satisfying specific bounds or invariants. Multiple valid configurations exist."
    ],
    "keywords": [
      "constructive",
      "pattern",
      "ad-hoc",
      "symmetry",
      "bounds"
    ],
    "templates": [
      {
        "name": "Checkerboard Constructive",
        "code": "// Construct checkerboard grid\n#include <vector>\nusing namespace std;\nvector<vector<int>> buildGrid(int n, int m) {\n    vector<vector<int>> g(n, vector<int>(m));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            g[i][j] = (i + j) % 2;\n    return g;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Boundary Violations",
        "desc": "Pattern logic often fails for N = 1 or N = 2. Verify minimal cases manually."
      }
    ],
    "totalProblems": 2089
  },
  "*special": {
    "name": "Special Problems",
    "category": "Interactive & Other",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "timeProgress": 10,
    "spaceProgress": 10,
    "timeLabel": "N/A",
    "spaceLabel": "N/A",
    "rules": [
      "These are unique, ad-hoc, or round-specific special configuration problems."
    ],
    "keywords": [
      "special",
      "ad-hoc",
      "round-specific"
    ],
    "templates": [
      {
        "name": "Interactive Flush Template",
        "code": "// C++ interactive flush\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"? 1 2\" << endl; // endl performs flush automatically\n    int ans; cin >> ans;\n    cout << \"! \" << ans << endl;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Buffered Streams",
        "desc": "Always flush stdout (using endl or cout << flush) to prevent interactive deadlock."
      }
    ],
    "totalProblems": 559
  },
  "2-sat": {
    "name": "2-Satisfiability",
    "category": "Graphs & Traversal",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "timeProgress": 40,
    "spaceProgress": 50,
    "timeLabel": "O(V + E) SCC contraction",
    "spaceLabel": "O(V + E) implication graph",
    "rules": [
      "The problem contains boolean variables and constraints of the form (A or B).",
      "Uses Strongly Connected Components (SCC) to solve via implication graph."
    ],
    "keywords": [
      "2-sat",
      "scc",
      "kosaraju",
      "tarjan",
      "implication graph"
    ],
    "templates": [
      {
        "name": "2-SAT Solver (Kosaraju)",
        "code": "// 2-SAT Kosaraju Solver\n#include <vector>\n#include <stack>\nusing namespace std;\nstruct TwoSAT {\n    int n;\n    vector<vector<int>> adj, adj_t;\n    vector<bool> visited;\n    vector<int> scc_id;\n    stack<int> order;\n    TwoSAT(int n) : n(n), adj(2 * n), adj_t(2 * n), visited(2 * n), scc_id(2 * n) {}\n    void add_clause(int u, bool u_val, int v, bool v_val) {\n        int nu = u + (u_val ? n : 0);\n        int tu = u + (u_val ? 0 : n);\n        int nv = v + (v_val ? n : 0);\n        int tv = v + (v_val ? 0 : n);\n        adj[tu].push_back(nv); adj_t[nv].push_back(tu);\n        adj[tv].push_back(nu); adj_t[nu].push_back(tv);\n    }\n};"
      }
    ],
    "edgeCases": [
      {
        "title": "Variable Indexing",
        "desc": "Index x and negate index !x correctly (e.g. index i and i + n) to avoid array bounds bugs."
      }
    ],
    "totalProblems": 40
  },
  "brute force": {
    "name": "Brute Force",
    "category": "Search & Heuristics",
    "timeComplexity": "O(N!)",
    "spaceComplexity": "O(N)",
    "timeProgress": 95,
    "spaceProgress": 95,
    "timeLabel": "O(N!) or O(2^N) backtracking search",
    "spaceLabel": "O(N) recursion stack",
    "rules": [
      "Constraints are small enough (e.g., N <= 10) to search all possible outcomes.",
      "Generate combinations, permutations, or subsets."
    ],
    "keywords": [
      "brute force",
      "backtracking",
      "permutations",
      "combinations",
      "recursion"
    ],
    "templates": [
      {
        "name": "Permutations Generator",
        "code": "// C++ Permutations\n#include <vector>\n#include <algorithm>\n#include <iostream>\nusing namespace std;\nvoid generate(vector<int>& a) {\n    sort(a.begin(), a.end());\n    do {\n        // Process permutation a\n    } while (next_permutation(a.begin(), a.end()));\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Time Limit Exceeded",
        "desc": "Brute force works only for small bounds. Trace complexity bounds carefully before coding."
      }
    ],
    "totalProblems": 1976
  },
  "chinese remainder theorem": {
    "name": "Chinese Remainder Theorem",
    "category": "Mathematics",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "timeProgress": 30,
    "spaceProgress": 10,
    "timeLabel": "O(log N) extended Euclidean algorithm",
    "spaceLabel": "O(1)",
    "rules": [
      "Solve system of modular equations of form X = a_i (mod m_i).",
      "Requires moduli to be pairwise coprime."
    ],
    "keywords": [
      "chinese remainder theorem",
      "crt",
      "modulo",
      "extended gcd"
    ],
    "templates": [
      {
        "name": "CRT Extended GCD Solver",
        "code": "// CRT Extended GCD\nlong long extGCD(long long a, long long b, long long &x, long long &y) {\n    if (b == 0) { x = 1; y = 0; return a; }\n    long long x1, y1;\n    long long g = extGCD(b, a % b, x1, y1);\n    x = y1;\n    y = x1 - y1 * (a / b);\n    return g;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Coprime Moduli",
        "desc": "Verify that moduli are pairwise coprime. If they aren't, standard CRT fails."
      }
    ],
    "totalProblems": 25
  },
  "combinatorics": {
    "name": "Combinatorics",
    "category": "Mathematics",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 60,
    "spaceProgress": 50,
    "timeLabel": "O(N) precomputations",
    "spaceLabel": "O(N) factorials array",
    "rules": [
      "Requires counting choices, arrangements, or combinations under modulo.",
      "Uses permutations, combinations, Catalan numbers, or partition theory."
    ],
    "keywords": [
      "combinatorics",
      "combinations",
      "permutations",
      "ncr",
      "catalan",
      "stars and bars"
    ],
    "templates": [
      {
        "name": "Combinatorics Precomputations",
        "code": "// C++ Permutations & Combinations\n#include <vector>\nusing namespace std;\nconst int MOD = 1e9 + 7;\nvector<long long> fact;\nvoid computeFact(int n) {\n    fact.assign(n + 1, 1);\n    for (int i = 2; i <= n; i++) fact[i] = (fact[i - 1] * i) % MOD;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Modulo Inverse Division",
        "desc": "Remember you cannot divide directly in modulo. Multiply by modular inverse."
      }
    ],
    "totalProblems": 830
  },
  "communication": {
    "name": "Communication Problems",
    "category": "Interactive & Other",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "timeProgress": 10,
    "spaceProgress": 10,
    "timeLabel": "N/A",
    "spaceLabel": "N/A",
    "rules": [
      "Problems involve message passing or communicating between separate executions of a program."
    ],
    "keywords": [
      "communication",
      "message passing",
      "distributed"
    ],
    "templates": [
      {
        "name": "Client-Server Mock Interface",
        "code": "// Mock protocol\nvoid sendMessage(int msg) { /* Write message */ }\nint receiveMessage() { /* Read message */ return 0; }"
      }
    ],
    "edgeCases": [
      {
        "title": "Buffer Flushing",
        "desc": "Check maximum allowed bytes or bits. Oversending causes presentation error or TLE."
      }
    ],
    "totalProblems": 8
  },
  "dfs and similar": {
    "name": "DFS & Graph Traversals",
    "category": "Graphs & Traversal",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "timeProgress": 45,
    "spaceProgress": 60,
    "timeLabel": "O(V + E) traversals",
    "spaceLabel": "O(V + E) visited states",
    "rules": [
      "Traverse graphs or trees, search connected components, check cycles, or compute sizes."
    ],
    "keywords": [
      "dfs",
      "traversal",
      "connected components",
      "cycle detection",
      "recursion"
    ],
    "templates": [
      {
        "name": "DFS Tree Traversal",
        "code": "// Tree DFS\n#include <vector>\nusing namespace std;\nvector<vector<int>> adj;\nvoid dfs(int u, int p) {\n    for (int v : adj[u]) {\n        if (v != p) dfs(v, u);\n    }\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Recursion Stack Overflow",
        "desc": "Deep trees can cause segmentation faults. On Windows/Linux, increase stack limits or convert to iteration."
      }
    ],
    "totalProblems": 1065
  },
  "divide and conquer": {
    "name": "Divide and Conquer",
    "category": "Search & Divide",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 60,
    "spaceProgress": 60,
    "timeLabel": "O(N log N) recursive splits",
    "spaceLabel": "O(N) auxiliary merge array",
    "rules": [
      "Divide problem into subproblems, solve recursively, and merge solutions.",
      "Examples include merge sort, binary search, and CDQ divide & conquer."
    ],
    "keywords": [
      "divide and conquer",
      "merge sort",
      "split and merge",
      "cdq"
    ],
    "templates": [
      {
        "name": "Merge Sort & Inversions Count",
        "code": "// Merge sort count inversions\n#include <vector>\nusing namespace std;\nlong long merge(vector<int>& a, int l, int mid, int r) {\n    long long inv = 0;\n    int i = l, j = mid + 1, k = 0;\n    vector<int> temp(r - l + 1);\n    while (i <= mid && j <= r) {\n        if (a[i] <= a[j]) { temp[k++] = a[i++]; }\n        else { temp[k++] = a[j++]; inv += (mid - i + 1); }\n    }\n    while (i <= mid) temp[k++] = a[i++];\n    while (j <= r) temp[k++] = a[j++];\n    for (i = l; i <= r; i++) a[i] = temp[i - l];\n    return inv;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Merge Space Allocation",
        "desc": "Allocating vectors repeatedly in recursion causes MLE/TLE. Reuse a global buffer or pass arrays."
      }
    ],
    "totalProblems": 361
  },
  "dsu": {
    "name": "Disjoint Set Union",
    "category": "Queries & Updates",
    "timeComplexity": "O(alpha(N))",
    "spaceComplexity": "O(N)",
    "timeProgress": 95,
    "spaceProgress": 95,
    "timeLabel": "O(Inverse Ackermann) operations",
    "spaceLabel": "O(N) parent/size tracking",
    "rules": [
      "Maintain disjoint components, union elements, and quickly check if two elements belong to the same set."
    ],
    "keywords": [
      "dsu",
      "union find",
      "path compression",
      "union by size"
    ],
    "templates": [
      {
        "name": "DSU Class Template",
        "code": "// DSU structure\n#include <vector>\n#include <numeric>\nusing namespace std;\nstruct DSU {\n    vector<int> parent, sz;\n    DSU(int n) : parent(n), sz(n, 1) { iota(parent.begin(), parent.end(), 0); }\n    int find(int i) { return parent[i] == i ? i : parent[i] = find(parent[i]); }\n    bool unite(int i, int j) {\n        int r1 = find(i), r2 = find(j);\n        if (r1 == r2) return false;\n        if (sz[r1] < sz[r2]) swap(r1, r2);\n        parent[r2] = r1; sz[r1] += sz[r2];\n        return true;\n    }\n};"
      }
    ],
    "edgeCases": [
      {
        "title": "Path Compression Omission",
        "desc": "Omitting path compression increases query complexity to O(N), leading to TLE."
      }
    ],
    "totalProblems": 410
  },
  "expression parsing": {
    "name": "Expression Parsing",
    "category": "Strings & Parsing",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 30,
    "spaceProgress": 30,
    "timeLabel": "O(N) parsing",
    "spaceLabel": "O(N) stacks",
    "rules": [
      "Evaluate mathematical expressions, parse strings with operator precedence (shunting-yard algorithm)."
    ],
    "keywords": [
      "expression parsing",
      "shunting-yard",
      "operators",
      "stacks",
      "precedence"
    ],
    "templates": [
      {
        "name": "Shunting-Yard Parser",
        "code": "// Basic expression parser\n#include <string>\n#include <stack>\nusing namespace std;\nint precedence(char op) {\n    if (op == '+' || op == '-') return 1;\n    if (op == '*' || op == '/') return 2;\n    return 0;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Nested Parentheses",
        "desc": "Verify parenthesized scopes are closed and precedence levels are correctly evaluated."
      }
    ],
    "totalProblems": 40
  },
  "fft": {
    "name": "Fast Fourier Transform",
    "category": "Mathematics",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 25,
    "spaceProgress": 40,
    "timeLabel": "O(N log N) polynomial multiplication",
    "spaceLabel": "O(N) complex vector allocations",
    "rules": [
      "Multiply two large polynomials, solve counting problems modeled as polynomial multiplication in O(N log N)."
    ],
    "keywords": [
      "fft",
      "polynomial multiplication",
      "complex numbers",
      "ntt"
    ],
    "templates": [
      {
        "name": "FFT Multiplication",
        "code": "// FFT Complex multiplication template\n#include <complex>\n#include <vector>\nusing namespace std;\ntypedef complex<double> cd;\nvoid fft(vector<cd>& a, bool invert) {\n    int n = a.size();\n    if (n == 1) return;\n    vector<cd> a0(n / 2), a1(n / 2);\n    for (int i = 0; 2 * i < n; i++) { a0[i] = a[2 * i]; a1[i] = a[2 * i + 1]; }\n    fft(a0, invert); fft(a1, invert);\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Vector Padding",
        "desc": "FFT requires vector sizes to be powers of 2. Pad vectors with zeroes up to the nearest power of 2."
      }
    ],
    "totalProblems": 112
  },
  "flows": {
    "name": "Network Flows",
    "category": "Graphs & Traversal",
    "timeComplexity": "O(V^2 E)",
    "spaceComplexity": "O(V + E)",
    "timeProgress": 30,
    "spaceProgress": 40,
    "timeLabel": "O(V^2 E) Dinic's max flow",
    "spaceLabel": "O(V + E) residual capacities",
    "rules": [
      "Find max flow / min cut in a flow network, solve maximum bipartite matching using flows."
    ],
    "keywords": [
      "flows",
      "max flow",
      "min cut",
      "dinic",
      "edmonds-karp"
    ],
    "templates": [
      {
        "name": "Dinic's Algorithm",
        "code": "// Dinic's Max Flow\n#include <vector>\n#include <queue>\nusing namespace std;\nstruct Edge { int to; long long cap, flow; int rev; };\nstruct Dinic {\n    int n;\n    vector<vector<Edge>> adj;\n    vector<int> level, ptr;\n    Dinic(int n) : n(n), adj(n), level(n), ptr(n) {}\n    void add_edge(int from, int to, long long cap) {\n        adj[from].push_back({to, cap, 0, (int)adj[to].size()});\n        adj[to].push_back({from, 0, 0, (int)adj[from].size() - 1});\n    }\n};"
      }
    ],
    "edgeCases": [
      {
        "title": "Residual Capacity",
        "desc": "Verify back edges are updated correctly during flow augmentation. Neglecting them breaks path construction."
      }
    ],
    "totalProblems": 162
  },
  "games": {
    "name": "Game Theory",
    "category": "Mathematics",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 60,
    "spaceProgress": 60,
    "timeLabel": "O(N) state evaluation",
    "spaceLabel": "O(N) memoization table",
    "rules": [
      "The problem involves two players playing optimally. Find the winner.",
      "Uses Sprague-Grundy theorem or Nim game logic."
    ],
    "keywords": [
      "games",
      "nim",
      "sprague-grundy",
      "impartial games",
      "combinatorial game theory"
    ],
    "templates": [
      {
        "name": "Sprague-Grundy Calculator",
        "code": "// Sprague-Grundy values calculator\n#include <vector>\n#include <set>\nusing namespace std;\nint calculateMex(const set<int>& s) {\n    int mex = 0;\n    while (s.count(mex)) mex++;\n    return mex;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Symmetric Game States",
        "desc": "Look for symmetry. If the second player can mirror every move of the first player, the second player always wins."
      }
    ],
    "totalProblems": 295
  },
  "geometry": {
    "name": "Geometry",
    "category": "Mathematics",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 45,
    "spaceProgress": 40,
    "timeLabel": "O(N log N) convex hull / sweep-line",
    "spaceLabel": "O(N) point arrays",
    "rules": [
      "Deals with coordinates, lines, polygons, circle intersections, or convex hulls."
    ],
    "keywords": [
      "geometry",
      "convex hull",
      "cross product",
      "dot product",
      "intersection"
    ],
    "templates": [
      {
        "name": "Convex Hull (Graham Scan)",
        "code": "// Point & Cross Product Convex Hull\n#include <vector>\n#include <algorithm>\nusing namespace std;\nstruct Point { long long x, y; };\nlong long crossProduct(Point a, Point b, Point c) {\n    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Precision Issues",
        "desc": "Avoid double precision division. Represent calculations using cross products (integers) whenever possible."
      }
    ],
    "totalProblems": 429
  },
  "graph matchings": {
    "name": "Graph Matchings",
    "category": "Graphs & Traversal",
    "timeComplexity": "O(V E)",
    "spaceComplexity": "O(V + E)",
    "timeProgress": 35,
    "spaceProgress": 50,
    "timeLabel": "O(VE) Kuhn's algorithm",
    "spaceLabel": "O(V) matching states",
    "rules": [
      "Requires finding maximum matching in a bipartite graph."
    ],
    "keywords": [
      "graph matchings",
      "bipartite matching",
      "kuhn",
      "hopcroft-karp"
    ],
    "templates": [
      {
        "name": "Kuhn's Algorithm",
        "code": "// Kuhn's Bipartite Matching\n#include <vector>\nusing namespace std;\nvector<vector<int>> adj;\nvector<int> mt;\nvector<bool> used;\nbool try_kuhn(int v) {\n    if (used[v]) return false;\n    used[v] = true;\n    for (int to : adj[v]) {\n        if (mt[to] == -1 || try_kuhn(mt[to])) {\n            mt[to] = v; return true;\n        }\n    }\n    return false;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Visits Reset",
        "desc": "Remember to reset the `used` array to false for each source node match attempt."
      }
    ],
    "totalProblems": 106
  },
  "hashing": {
    "name": "Hashing & Rabin-Karp",
    "category": "Strings & Parsing",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 60,
    "spaceProgress": 55,
    "timeLabel": "O(N) hash precomputations",
    "spaceLabel": "O(N) hashes array",
    "rules": [
      "Identify duplicates, check equality of substrings in O(1) time after O(N) precomputation."
    ],
    "keywords": [
      "hashing",
      "rolling hash",
      "string hash",
      "rabin-karp"
    ],
    "templates": [
      {
        "name": "Double String Hash",
        "code": "// Double rolling hash template\n#include <string>\n#include <vector>\nusing namespace std;\nconst int MOD1 = 1e9 + 7, MOD2 = 1e9 + 9;\nconst int BASE1 = 313, BASE2 = 331;"
      }
    ],
    "edgeCases": [
      {
        "title": "Hash Collisions",
        "desc": "Single hashes (e.g. modulo 10^9+7) can hit collisions with anti-hash test cases. Use double hashes."
      }
    ],
    "totalProblems": 237
  },
  "implementation": {
    "name": "Implementation",
    "category": "Fundamentals & Logic",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "timeProgress": 99,
    "spaceProgress": 99,
    "timeLabel": "O(N) or O(1) procedural execution",
    "spaceLabel": "O(1) constants",
    "rules": [
      "Solve standard simulation, input transformations, and straight-forward logical checks without advanced algorithm structures."
    ],
    "keywords": [
      "implementation",
      "simulation",
      "brute-force logic",
      "ad-hoc"
    ],
    "templates": [
      {
        "name": "Fast I/O Template",
        "code": "// Fast I/O C++\n#include <iostream>\nusing namespace std;\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    return 0;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "String Spaces",
        "desc": "Use getline(cin, s) instead of cin >> s if the input string contains space boundaries."
      }
    ],
    "totalProblems": 3026
  },
  "interactive": {
    "name": "Interactive Problems",
    "category": "Interactive & Other",
    "timeComplexity": "O(Q)",
    "spaceComplexity": "O(1)",
    "timeProgress": 75,
    "spaceProgress": 80,
    "timeLabel": "O(Q) queries",
    "spaceLabel": "O(1) constants",
    "rules": [
      "The problem asks you to query an oracle program and output the answer based on query responses."
    ],
    "keywords": [
      "interactive",
      "flush",
      "queries",
      "endl"
    ],
    "templates": [
      {
        "name": "Interactive Query",
        "code": "// Interactive query C++\n#include <iostream>\n#include <string>\nusing namespace std;\nint askQuery(int mid) {\n    cout << \"? \" << mid << endl;\n    int resp; cin >> resp;\n    return resp;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Buffered Streams",
        "desc": "Forgetting to flush stdout using endl or cout << flush blocks the referee program, causing TLE."
      }
    ],
    "totalProblems": 306
  },
  "matrices": {
    "name": "Matrices & Linear Algebra",
    "category": "Mathematics",
    "timeComplexity": "O(K^3 log N)",
    "spaceComplexity": "O(K^2)",
    "timeProgress": 35,
    "spaceProgress": 40,
    "timeLabel": "O(K^3 log N) matrix exponentiation",
    "spaceLabel": "O(K^2) matrix dimensions",
    "rules": [
      "Compute fibonacci numbers up to N=10^18, solve linear recurrence systems in O(K^3 log N) time."
    ],
    "keywords": [
      "matrices",
      "matrix exponentiation",
      "linear recurrence",
      "matrix multiplication"
    ],
    "templates": [
      {
        "name": "Matrix Exponentiation",
        "code": "// Matrix Exponentiation\n#include <vector>\nusing namespace std;\ntypedef vector<vector<long long>> Matrix;\nMatrix multiply(const Matrix& a, const Matrix& b, int mod) {\n    int r = a.size(), c = b[0].size(), m = a[0].size();\n    Matrix res(r, vector<long long>(c, 0));\n    for (int i = 0; i < r; i++)\n        for (int j = 0; j < c; j++)\n            for (int k = 0; k < m; k++)\n                res[i][j] = (res[i][j] + a[i][k] * b[k][j]) % mod;\n    return res;\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Modulus Operations",
        "desc": "Do modulo at each intermediate step inside the triple loop to avoid 64-bit overflow."
      }
    ],
    "totalProblems": 139
  },
  "meet-in-the-middle": {
    "name": "Meet in the Middle",
    "category": "Search & Divide",
    "timeComplexity": "O(2^(N/2))",
    "spaceComplexity": "O(2^(N/2))",
    "timeProgress": 45,
    "spaceProgress": 40,
    "timeLabel": "O(2^(N/2)) split searches",
    "spaceLabel": "O(2^(N/2)) hash-tables / sorting",
    "rules": [
      "Divide elements array into two halves (N <= 40), generate subset sums for both halves, and match them using binary search."
    ],
    "keywords": [
      "meet-in-the-middle",
      "subset sum",
      "split search",
      "binary search"
    ],
    "templates": [
      {
        "name": "Subset Sum Meet-in-the-Middle",
        "code": "// Meet in the Middle subset sums\n#include <vector>\n#include <algorithm>\nusing namespace std;\nvoid getSubsets(int l, int r, const vector<int>& a, vector<long long>& sums) {\n    int len = r - l + 1;\n    for (int i = 0; i < (1 << len); i++) {\n        long long sum = 0;\n        for (int j = 0; j < len; j++) {\n            if ((i >> j) & 1) sum += a[l + j];\n        }\n        sums.push_back(sum);\n    }\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Memory Allocation",
        "desc": "For N=40, 2^{20} values is around 1 million long long integers (~8MB), which is safe. For N=44, memory expands rapidly."
      }
    ],
    "totalProblems": 52
  },
  "probabilities": {
    "name": "Probabilities & Expected Value",
    "category": "Mathematics",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 50,
    "spaceProgress": 45,
    "timeLabel": "O(N) state calculations",
    "spaceLabel": "O(N) DP table",
    "rules": [
      "Calculate probability of states or expected value of operations using linearity of expectation."
    ],
    "keywords": [
      "probabilities",
      "expected value",
      "linearity of expectation",
      "probability dp"
    ],
    "templates": [
      {
        "name": "Expected Value DP",
        "code": "// Expected value DP: dp[i] = p * dp[i-1] + (1-p) * dp[i]"
      }
    ],
    "edgeCases": [
      {
        "title": "Linearity of Expectation",
        "desc": "Expectation of sum is sum of expectations: E[A + B] = E[A] + E[B], even if A and B are dependent."
      }
    ],
    "totalProblems": 267
  },
  "schedules": {
    "name": "Scheduling",
    "category": "Search & Heuristics",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 70,
    "spaceProgress": 60,
    "timeLabel": "O(N log N) sorting jobs",
    "spaceLabel": "O(N) storage",
    "rules": [
      "Determine optimal ordering of tasks / jobs with deadlines and durations."
    ],
    "keywords": [
      "schedules",
      "deadlines",
      "jobs",
      "greedy selection"
    ],
    "templates": [
      {
        "name": "Job Deadline Scheduling",
        "code": "// Greedy Job Scheduling"
      }
    ],
    "edgeCases": [
      {
        "title": "Ties in Deadlines",
        "desc": "Determine sorting priorities: sort by deadline ascending, then duration ascending."
      }
    ],
    "totalProblems": 15
  },
  "shortest paths": {
    "name": "Shortest Paths",
    "category": "Graphs & Traversal",
    "timeComplexity": "O(E log V)",
    "spaceComplexity": "O(V + E)",
    "timeProgress": 55,
    "spaceProgress": 50,
    "timeLabel": "O(E log V) Dijkstra / O(V*E) Bellman-Ford",
    "spaceLabel": "O(V + E) adjacency lists",
    "rules": [
      "Find shortest distance/paths between nodes in weighted or unweighted networks."
    ],
    "keywords": [
      "shortest paths",
      "dijkstra",
      "bellman-ford",
      "spfa",
      "floyd-warshall"
    ],
    "templates": [
      {
        "name": "Dijkstra Priority Queue",
        "code": "// Dijkstra Template\n#include <vector>\n#include <queue>\nusing namespace std;\nconst long long INF = 1e18;\nvector<vector<pair<int, int>>> adj;\nvector<long long> dist;\nvoid dijkstra(int s) {\n    dist.assign(adj.size(), INF);\n    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;\n    dist[s] = 0; pq.push({0, s});\n    while(!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.push({dist[v], v}); }\n        }\n    }\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Negative Cycles",
        "desc": "Dijkstra fails on graphs with negative weights. Use Bellman-Ford or SPFA if negative weights are present."
      }
    ],
    "totalProblems": 294
  },
  "string suffix structures": {
    "name": "String Suffix Structures",
    "category": "Strings & Parsing",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 20,
    "spaceProgress": 35,
    "timeLabel": "O(N log N) suffix array or O(N) Suffix Automaton",
    "spaceLabel": "O(N) transition tables",
    "rules": [
      "Advanced substring / pattern queries where standard hashing is too slow or complex."
    ],
    "keywords": [
      "suffix array",
      "suffix tree",
      "suffix automaton",
      "lcp array"
    ],
    "templates": [
      {
        "name": "Suffix Array builder",
        "code": "// Suffix Array Builder"
      }
    ],
    "edgeCases": [
      {
        "title": "Alphabet Bounds",
        "desc": "Ensure character arrays or transition tables correctly map character indices (e.g., s[i] - 'a')."
      }
    ],
    "totalProblems": 102
  },
  "ternary search": {
    "name": "Ternary Search",
    "category": "Search & Divide",
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "timeProgress": 30,
    "spaceProgress": 10,
    "timeLabel": "O(log N) unimodal query splits",
    "spaceLabel": "O(1)",
    "rules": [
      "Find peak (min/max) of a unimodal function by splitting range into three parts."
    ],
    "keywords": [
      "ternary search",
      "unimodal",
      "convex",
      "concave",
      "peak"
    ],
    "templates": [
      {
        "name": "Ternary Search Float",
        "code": "// Ternary Search Float\ndouble ternary_search(double l, double r) {\n    for (int i = 0; i < 100; i++) {\n        double m1 = l + (r - l) / 3;\n        double m2 = r - (r - l) / 3;\n        if (f(m1) < f(m2)) l = m1;\n        else r = m2;\n    }\n    return f(l);\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "Float Iterations Limit",
        "desc": "Always run float ternary search for a fixed number of iterations (e.g. 100) instead of while(r - l > EPS) to prevent infinite loops due to precision limits."
      }
    ],
    "totalProblems": 70
  },
  "trees": {
    "name": "Trees & Tree DP",
    "category": "Graphs & Traversal",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "timeProgress": 60,
    "spaceProgress": 65,
    "timeLabel": "O(N) recursion on child subtrees",
    "spaceLabel": "O(N) child states",
    "rules": [
      "Tree structure is guaranteed (N nodes, N-1 edges, no cycles). Involves tree diameter, LCA, or Tree DP."
    ],
    "keywords": [
      "trees",
      "lca",
      "tree dp",
      "diameter",
      "centroid",
      "heavy-light decomposition"
    ],
    "templates": [
      {
        "name": "LCA Binary Lifting",
        "code": "// LCA Binary Lifting\n#include <vector>\nusing namespace std;\nvector<vector<int>> adj;\nvector<int> depth;\nvector<vector<int>> up;\nvoid dfs_lca(int u, int p) {\n    up[u][0] = p;\n    for (int i = 1; i < 20; i++) up[u][i] = up[up[u][i - 1]][i - 1];\n    for (int v : adj[u]) {\n        if (v != p) { depth[v] = depth[u] + 1; dfs_lca(v, u); }\n    }\n}"
      }
    ],
    "edgeCases": [
      {
        "title": "LCA Root Parent",
        "desc": "Set up[root][i] = root or parent of root = root to avoid referencing index -1."
      }
    ],
    "totalProblems": 958
  }
};

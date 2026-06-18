export const stlData = {
  "vector": {
    name: "std::vector",
    include: "#include <vector>",
    description: "Dynamic contiguous array that manages its own memory and resizes automatically. Ideal for sequence retrieval and quick back updates.",
    spaceComplexity: "O(N)",
    complexities: {
      "Access (operator[])": "O(1)",
      "Insert/Delete at end": "O(1) amortized",
      "Insert/Delete arbitrary": "O(N)",
      "Find (unsorted)": "O(N)"
    },
    docsLink: "https://cplusplus.com/reference/vector/vector/",
    methods: [
      {
        signature: "push_back(const T& val)",
        desc: "Adds an element to the end of the vector.",
        example: "std::vector<int> v;\nv.push_back(42);"
      },
      {
        signature: "pop_back()",
        desc: "Removes the last element.",
        example: "v.pop_back();"
      },
      {
        signature: "size()",
        desc: "Returns the number of elements.",
        example: "int n = v.size();"
      },
      {
        signature: "clear()",
        desc: "Removes all elements, setting size to 0.",
        example: "v.clear();"
      },
      {
        signature: "resize(size_type n, value_type val = value_type())",
        desc: "Resizes the container to contain n elements.",
        example: "v.resize(10, -1);"
      },
      {
        signature: "assign(size_type n, const T& val)",
        desc: "Replaces contents with n copies of val.",
        example: "v.assign(5, 100);"
      }
    ]
  },
  "unordered_map": {
    name: "std::unordered_map",
    include: "#include <unordered_map>",
    description: "Hash-table based associative container storing key-value pairs with unique keys. Offers super-fast average-case lookups.",
    spaceComplexity: "O(N)",
    complexities: {
      "Lookup": "O(1) average, O(N) worst",
      "Insertion": "O(1) average, O(N) worst",
      "Deletion": "O(1) average, O(N) worst"
    },
    docsLink: "https://cplusplus.com/reference/unordered_map/unordered_map/",
    methods: [
      {
        signature: "operator[key]",
        desc: "Accesses or inserts the element with the key.",
        example: "std::unordered_map<string, int> mp;\nmp[\"hello\"] = 5;"
      },
      {
        signature: "count(const Key& key)",
        desc: "Returns 1 if the key exists, 0 otherwise.",
        example: "if (mp.count(\"hello\")) { /* exists */ }"
      },
      {
        signature: "find(const Key& key)",
        desc: "Returns iterator to the element if found, mp.end() otherwise.",
        example: "auto it = mp.find(\"hello\");\nif (it != mp.end()) { cout << it->second; }"
      },
      {
        signature: "erase(const Key& key)",
        desc: "Removes element associated with key.",
        example: "mp.erase(\"hello\");"
      },
      {
        signature: "clear()",
        desc: "Erases all elements.",
        example: "mp.clear();"
      }
    ]
  },
  "unordered_set": {
    name: "std::unordered_set",
    include: "#include <unordered_set>",
    description: "Hash-table based container storing unique keys. Ideal for checking element existence in average constant time.",
    spaceComplexity: "O(N)",
    complexities: {
      "Lookup": "O(1) average, O(N) worst",
      "Insertion": "O(1) average, O(N) worst",
      "Deletion": "O(1) average, O(N) worst"
    },
    docsLink: "https://cplusplus.com/reference/unordered_set/unordered_set/",
    methods: [
      {
        signature: "insert(const T& val)",
        desc: "Inserts an element if it doesn't exist.",
        example: "std::unordered_set<int> s;\ns.insert(10);"
      },
      {
        signature: "count(const T& val)",
        desc: "Checks if element exists (1) or not (0).",
        example: "if (s.count(10)) { /* found */ }"
      },
      {
        signature: "erase(const T& val)",
        desc: "Removes the element from set.",
        example: "s.erase(10);"
      },
      {
        signature: "size()",
        desc: "Returns number of unique elements.",
        example: "int n = s.size();"
      }
    ]
  },
  "priority_queue": {
    name: "std::priority_queue",
    include: "#include <queue>",
    description: "Heap-based container adapter providing logarithmic insertion and extraction of the largest (or smallest) element.",
    spaceComplexity: "O(N)",
    complexities: {
      "Top element access": "O(1)",
      "Push (insert)": "O(log N)",
      "Pop (extract)": "O(log N)"
    },
    docsLink: "https://cplusplus.com/reference/queue/priority_queue/",
    methods: [
      {
        signature: "push(const T& val)",
        desc: "Inserts element into priority queue and bubbles it to correct heap location.",
        example: "std::priority_queue<int> pq;\npq.push(10);"
      },
      {
        signature: "top()",
        desc: "Returns reference to the top (max by default) element.",
        example: "int max_val = pq.top();"
      },
      {
        signature: "pop()",
        desc: "Removes the top element.",
        example: "pq.pop();"
      },
      {
        signature: "empty()",
        desc: "Returns true if queue is empty.",
        example: "if (!pq.empty()) { /* do work */ }"
      },
      {
        signature: "Min-Heap Declaration",
        desc: "Syntax constructor to set priority queue to return smallest values first.",
        example: "std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;"
      }
    ]
  },
  "stack": {
    name: "std::stack",
    include: "#include <stack>",
    description: "LIFO (Last In First Out) container adapter. Excellent for backtracking, balanced parentheses, and DFS simulations.",
    spaceComplexity: "O(N)",
    complexities: {
      "Top access": "O(1)",
      "Push": "O(1)",
      "Pop": "O(1)"
    },
    docsLink: "https://cplusplus.com/reference/stack/stack/",
    methods: [
      {
        signature: "push(const T& val)",
        desc: "Pushes element onto stack.",
        example: "std::stack<int> st;\nst.push(5);"
      },
      {
        signature: "top()",
        desc: "Accesses top element.",
        example: "int val = st.top();"
      },
      {
        signature: "pop()",
        desc: "Removes top element.",
        example: "st.pop();"
      },
      {
        signature: "size()",
        desc: "Returns number of elements in stack.",
        example: "size_t sz = st.size();"
      }
    ]
  },
  "queue": {
    name: "std::queue",
    include: "#include <queue>",
    description: "FIFO (First In First Out) container adapter. Core container for Breadth First Search (BFS).",
    spaceComplexity: "O(N)",
    complexities: {
      "Front/Back access": "O(1)",
      "Push (enqueue)": "O(1)",
      "Pop (dequeue)": "O(1)"
    },
    docsLink: "https://cplusplus.com/reference/queue/queue/",
    methods: [
      {
        signature: "push(const T& val)",
        desc: "Inserts element at the back.",
        example: "std::queue<int> q;\nq.push(100);"
      },
      {
        signature: "front()",
        desc: "Accesses the oldest (front) element.",
        example: "int val = q.front();"
      },
      {
        signature: "pop()",
        desc: "Removes the oldest element.",
        example: "q.pop();"
      },
      {
        signature: "empty()",
        desc: "Checks if queue is empty.",
        example: "if (q.empty()) { cout << \"Empty\"; }"
      }
    ]
  },
  "deque": {
    name: "std::deque",
    include: "#include <deque>",
    description: "Double-ended queue that allows fast insertion and deletion at both its beginning and its end.",
    spaceComplexity: "O(N)",
    complexities: {
      "Access": "O(1)",
      "Push/Pop front": "O(1)",
      "Push/Pop back": "O(1)",
      "Insert/Delete middle": "O(N)"
    },
    docsLink: "https://cplusplus.com/reference/deque/deque/",
    methods: [
      {
        signature: "push_front(const T& val)",
        desc: "Inserts element at the start.",
        example: "std::deque<int> dq;\ndq.push_front(5);"
      },
      {
        signature: "push_back(const T& val)",
        desc: "Inserts element at the end.",
        example: "dq.push_back(10);"
      },
      {
        signature: "pop_front()",
        desc: "Removes first element.",
        example: "dq.pop_front();"
      },
      {
        signature: "pop_back()",
        desc: "Removes last element.",
        example: "dq.pop_back();"
      }
    ]
  },
  "map": {
    name: "std::map",
    include: "#include <map>",
    description: "Red-black tree based associative container. Keeps keys sorted. Crucial for range queries and lower/upper bound keys.",
    spaceComplexity: "O(N)",
    complexities: {
      "Lookup": "O(log N)",
      "Insertion": "O(log N)",
      "Deletion": "O(log N)"
    },
    docsLink: "https://cplusplus.com/reference/map/map/",
    methods: [
      {
        signature: "operator[key]",
        desc: "Accesses or inserts key. Keeps keys sorted.",
        example: "std::map<int, int> mp;\nmp[5] = 10;\nmp[2] = 20; // keys are sorted as: 2, 5"
      },
      {
        signature: "lower_bound(const Key& key)",
        desc: "Returns iterator to first element NOT LESS than key.",
        example: "auto it = mp.lower_bound(3); // returns element with key >= 3"
      },
      {
        signature: "upper_bound(const Key& key)",
        desc: "Returns iterator to first element GREATER than key.",
        example: "auto it = mp.upper_bound(5); // key > 5"
      },
      {
        signature: "begin() / end()",
        desc: "Returns iterators to traverse keys in sorted order.",
        example: "for (auto const& [k, v] : mp) { /* sorted * / }"
      }
    ]
  },
  "set": {
    name: "std::set",
    include: "#include <set>",
    description: "Red-black tree based container storing unique keys in sorted order. Essential for keeping track of dynamic sorted lists.",
    spaceComplexity: "O(N)",
    complexities: {
      "Lookup": "O(log N)",
      "Insertion": "O(log N)",
      "Deletion": "O(log N)"
    },
    docsLink: "https://cplusplus.com/reference/set/set/",
    methods: [
      {
        signature: "insert(const T& val)",
        desc: "Inserts element in sorted position.",
        example: "std::set<int> s;\ns.insert(3);\ns.insert(1); // sorted: 1, 3"
      },
      {
        signature: "lower_bound(const T& val)",
        desc: "Returns iterator to first key >= val.",
        example: "auto it = s.lower_bound(2); // points to 3"
      },
      {
        signature: "erase(const T& val)",
        desc: "Removes element.",
        example: "s.erase(3);"
      }
    ]
  },
  "string": {
    name: "std::string",
    include: "#include <string>",
    description: "Contiguous char container with string-specific methods like substring search and pattern utilities.",
    spaceComplexity: "O(N)",
    complexities: {
      "Char access": "O(1)",
      "Concatenation": "O(M) (where M is appended string length)",
      "Substring": "O(Sub length)"
    },
    docsLink: "https://cplusplus.com/reference/string/string/",
    methods: [
      {
        signature: "substr(size_t pos, size_t len)",
        desc: "Returns substring of length len starting at index pos.",
        example: "std::string s = \"leetcode\";\nstd::string sub = s.substr(0, 4); // \"leet\""
      },
      {
        signature: "find(const string& str)",
        desc: "Returns starting index of pattern search, or string::npos.",
        example: "size_t pos = s.find(\"code\");\nif (pos != std::string::npos) { /* found */ }"
      },
      {
        signature: "push_back(char c)",
        desc: "Appends single character.",
        example: "s.push_back('s');"
      },
      {
        signature: "length() / size()",
        desc: "Returns string size.",
        example: "int n = s.length();"
      }
    ]
  }
};

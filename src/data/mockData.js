// Mock data representing the default profile for Aaryanagrawal32
// Includes rich sample submissions so analytics widgets render correctly without API sync.

const now = Math.floor(Date.now() / 1000);
const day = 86400;

// Helper to build a submission object
const sub = (contestId, index, name, rating, tags, verdict, lang, daysAgo, code = null, trace = null, approach = null, timeComplexity = null, spaceComplexity = null) => ({
  id: `${contestId}-${index}-${verdict}-${daysAgo}`,
  contestId,
  verdict,
  programmingLanguage: lang,
  creationTimeSeconds: now - daysAgo * day,
  problem: { contestId, index, name, rating, tags },
  ...(code ? { code } : {}),
  ...(trace ? { trace } : {}),
  ...(approach ? { approach } : {}),
  ...(timeComplexity ? { timeComplexity } : {}),
  ...(spaceComplexity ? { spaceComplexity } : {})
});

export const mockData = {
  handle: "Aaryanagrawal32",
  userInfo: {
    handle: "Aaryanagrawal32",
    contribution: 0,
    friendOfCount: 0,
    titlePhoto: "https://userpic.codeforces.org/no-title.jpg",
    avatar: "https://userpic.codeforces.org/no-avatar.jpg",
    registrationTimeSeconds: 1780129250,
    lastOnlineTimeSeconds: 1781690797
  },
  ratingHistory: [],
  submissions: [
    // ── DP Problems ─────────────────────────────────────────────────────────────
    sub(1914, "C", "Quests", 1100, ["dp", "greedy"], "OK", "GNU C++17", 5,
      `#include <bits/stdc++.h>
using namespace std;
int main(){
    int n, k; cin >> n >> k;
    vector<int> a(n);
    for(auto& x : a) cin >> x;
    long long ans = 0, cur = 0;
    for(int i = 0; i < k; i++){
        cur += a[i];
        ans = max(ans, cur + (long long)a[0] * ((k-1-i)));
    }
    cout << ans << "\\n";
}`,
      [
        { line: "cur += a[i]", desc: "Accumulate sum of first i+1 elements" },
        { line: "ans = max(ans, ...)", desc: "Try repeating a[0] for remaining slots" },
        { line: "cout << ans", desc: "Output optimal quest score" }
      ],
      "Greedy + Prefix Sum: try each split point for the non-repeating prefix and repeat the first element",
      "O(k)", "O(1)"
    ),
    sub(1899, "F", "Alex and a Grid", 1300, ["dp", "implementation"], "OK", "GNU C++17", 12),
    sub(1920, "C", "Partitioning the Array", 1400, ["dp", "number theory", "math"], "OK", "GNU C++17", 18),
    sub(1741, "E", "Sending a Sequence Over the Network", 2000, ["dp"], "OK", "GNU C++17", 30),
    sub(1625, "C", "Road Optimization", 1900, ["dp"], "OK", "GNU C++17", 45),
    sub(1800, "F", "Dasha and Nightmares", 2000, ["dp", "data structures"], "OK", "GNU C++17", 60),
    sub(1890, "A", "Treasure Chest", 800, ["dp", "greedy"], "OK", "GNU C++17", 3),
    sub(706, "B", "Interesting Drink", 1100, ["dp", "binary search"], "OK", "GNU C++17", 8),

    // ── Graphs Problems ──────────────────────────────────────────────────────────
    sub(1760, "D", "Challenging Valleys", 900, ["graphs", "dfs and similar"], "OK", "GNU C++17", 2,
      `#include <bits/stdc++.h>
using namespace std;
int main(){
    int n; cin >> n;
    vector<int> a(n);
    for(auto& x : a) cin >> x;
    int ans = 0;
    for(int i = 0; i < n; i++){
        bool ok = true;
        if(i > 0 && a[i-1] <= a[i]) ok = false;
        if(i < n-1 && a[i+1] <= a[i]) ok = false;
        if(ok) ans++;
    }
    cout << ans << "\\n";
}`,
      [
        { line: "if(i > 0 && a[i-1] <= a[i])", desc: "Check left neighbor is strictly greater" },
        { line: "if(i < n-1 && a[i+1] <= a[i])", desc: "Check right neighbor is strictly greater" },
        { line: "if(ok) ans++", desc: "Count valleys where both neighbors are strictly larger" }
      ],
      "Linear scan: a position is a valley if both its neighbours (if they exist) are strictly greater.",
      "O(n)", "O(n)"
    ),
    sub(1873, "H", "Mad City", 1200, ["graphs", "shortest paths", "bfs"], "OK", "GNU C++17", 15),
    sub(1883, "D", "In Love", 1400, ["graphs", "trees"], "OK", "GNU C++17", 22),
    sub(1907, "G", "Lights", 2100, ["graphs", "dfs and similar"], "OK", "GNU C++17", 55),
    sub(1824, "B", "LuoTianyi and the Forest", 2000, ["graphs", "trees", "dfs and similar"], "OK", "GNU C++17", 70),
    sub(1633, "E", "Spanning Tree Queries", 2100, ["graphs", "spanning trees", "binary search"], "OK", "GNU C++17", 90),

    // ── Math Problems ────────────────────────────────────────────────────────────
    sub(1878, "A", "How Much Does Daytona Cost?", 800, ["math", "number theory"], "OK", "GNU C++17", 1),
    sub(1915, "B", "Good Kid", 800, ["math", "sorting", "greedy"], "OK", "GNU C++17", 4),
    sub(1914, "D", "Three Activities", 1200, ["math", "sorting"], "OK", "GNU C++17", 7),
    sub(1900, "D", "Small GCD", 1600, ["math", "number theory", "combinatorics"], "OK", "GNU C++17", 25),
    sub(1872, "G", "Replace With Product", 1800, ["math", "number theory"], "OK", "GNU C++17", 35),
    sub(1804, "E", "Routing", 2200, ["math", "number theory"], "OK", "GNU C++17", 80),

    // ── Binary Search Problems ───────────────────────────────────────────────────
    sub(1873, "E", "Building an Aquarium", 1100, ["binary search", "greedy"], "OK", "GNU C++17", 6),
    sub(1919, "C", "Grouping Increases", 1300, ["binary search", "greedy", "two pointers"], "OK", "GNU C++17", 14),
    sub(1872, "E", "Data Structures Fan", 1400, ["binary search", "data structures"], "OK", "GNU C++17", 20),
    sub(1840, "E", "Character Blocking", 1900, ["binary search", "string suffix structures"], "OK", "GNU C++17", 50),
    sub(1790, "F", "Timofey and Black-White Tree", 2000, ["binary search", "graphs", "dfs and similar"], "OK", "GNU C++17", 65),

    // ── Greedy Problems ──────────────────────────────────────────────────────────
    sub(1890, "B", "Qingshan Loves Strings", 900, ["greedy", "strings"], "OK", "GNU C++17", 9),
    sub(1901, "A", "Line Trip", 800, ["greedy", "math"], "OK", "GNU C++17", 11),
    sub(1878, "E", "Iva & Pav", 1500, ["greedy", "binary search", "prefix sums"], "OK", "GNU C++17", 28),
    sub(1805, "D", "A Wide, Wide Graph", 1900, ["greedy", "graphs", "trees"], "OK", "GNU C++17", 40),
    sub(1872, "F", "Selling a Menagerie", 1900, ["greedy", "graphs", "topological sort"], "OK", "GNU C++17", 48),

    // ── Data Structures Problems ─────────────────────────────────────────────────
    sub(1873, "F", "Money Trees", 1100, ["data structures", "implementation"], "OK", "GNU C++17", 13),
    sub(1850, "D", "Balanced Round", 900, ["data structures", "sorting"], "OK", "GNU C++17", 16),
    sub(1843, "D", "Apple Tree", 1000, ["data structures", "dfs and similar"], "OK", "GNU C++17", 19),
    sub(1791, "F", "Range Update Point Query", 1400, ["data structures", "dsu"], "OK", "GNU C++17", 32),
    sub(1840, "F", "Railguns", 2100, ["data structures", "graphs"], "OK", "GNU C++17", 75),
    sub(1707, "C", "DFS Trees", 2200, ["data structures", "trees", "dfs and similar"], "OK", "GNU C++17", 95),

    // ── Strings Problems ─────────────────────────────────────────────────────────
    sub(1915, "D", "Unnatural Language Processing", 900, ["strings", "implementation"], "OK", "GNU C++17", 10),
    sub(1873, "D", "1D Eraser", 800, ["strings", "implementation"], "OK", "GNU C++17", 17),
    sub(1791, "G2", "Teleporters (Hard Version)", 1600, ["strings", "binary search"], "OK", "GNU C++17", 38),
    sub(1783, "D", "Different Arrays", 1900, ["strings", "dp"], "OK", "GNU C++17", 58),
    sub(1690, "G", "Count the Trains", 2000, ["strings", "data structures"], "OK", "GNU C++17", 85),

    // ── Wrong Answer attempts (for WA/TLE stats) ─────────────────────────────────
    sub(1914, "E", "Sasha and a Game", 1500, ["greedy", "math"], "WRONG_ANSWER", "GNU C++17", 21),
    sub(1920, "D", "Array Repetition", 1800, ["binary search", "implementation"], "TIME_LIMIT_EXCEEDED", "GNU C++17", 33),
    sub(1872, "H", "MEX Order", 2100, ["data structures", "graphs"], "WRONG_ANSWER", "GNU C++17", 42),
    sub(1915, "F", "Greetings", 1700, ["greedy", "divide and conquer"], "WRONG_ANSWER", "GNU C++17", 52),
    sub(1850, "F", "We Were Both Children", 1100, ["strings", "math"], "WRONG_ANSWER", "GNU C++17", 62),
  ]
};

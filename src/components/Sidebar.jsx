import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, User, Hash, Star, Flame } from 'lucide-react';

export default function Sidebar({
  tags,
  activeTag,
  setActiveTag,
  currentView,
  setCurrentView,
  submissions,
  isSynced,
  problemsCountByTag, // maps tag -> total available count
  bookmarks = [],
  onMobileClose
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'DP', 'Graphs', 'Math & NT', 'Data Structures', 'Strings', 'Greedy & Constructive', 'Array & Sorting', 'Bit Manipulation'];

  // Helper to map category name to actual tag keys
  const categoryMap = {
    'DP': ['dp'],
    'Graphs': ['graphs'],
    'Math & NT': ['math', 'number theory'],
    'Data Structures': ['data structures'],
    'Strings': ['strings'],
    'Greedy & Constructive': ['greedy', 'constructive algorithms'],
    'Array & Sorting': ['two pointers', 'sortings'],
    'Bit Manipulation': ['bitmasks']
  };

  // Calculate daily solved streak
  const activeStreak = useMemo(() => {
    if (!isSynced || !submissions) return 0;
    
    const solvedDates = new Set();
    submissions.forEach(sub => {
      if (sub.verdict === 'OK') {
        const date = new Date(sub.creationTimeSeconds * 1000).toDateString();
        solvedDates.add(date);
      }
    });
    
    let streak = 0;
    const cursor = new Date();
    
    // If they haven't solved today, check starting from yesterday
    if (!solvedDates.has(cursor.toDateString())) {
      cursor.setDate(cursor.getDate() - 1);
    }
    
    while (solvedDates.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    
    return streak;
  }, [submissions, isSynced]);

  // Helper to compute solved count for a tag
  const getSolvedCount = (tagKey) => {
    if (!isSynced) {
      return tags[tagKey]?.solvedCount || 0;
    }
    const solvedSet = new Set();
    submissions.forEach(sub => {
      if (sub.verdict === 'OK' && sub.problem && sub.problem.tags) {
        const matchesTag = sub.problem.tags.some(t => {
          const tLower = t.toLowerCase();
          if (tagKey === 'dp' && tLower === 'dp') return true;
          if (tagKey === 'graphs' && (tLower.includes('graph') || tLower.includes('tree') || tLower.includes('dfs') || tLower.includes('shortest paths'))) return true;
          if (tagKey === 'math' && (tLower.includes('math') || tLower.includes('number theory') || tLower.includes('matrices'))) return true;
          if (tagKey === 'binary search' && tLower.includes('binary search')) return true;
          if (tagKey === 'greedy' && tLower.includes('greedy')) return true;
          if (tagKey === 'data structures' && (tLower.includes('data structures') || tLower.includes('dsu') || tLower.includes('trees'))) return true;
          if (tagKey === 'strings' && (tLower.includes('string') || tLower.includes('expression') || tLower.includes('hashing'))) return true;
          if (tagKey === 'two pointers' && tLower.includes('two pointers')) return true;
          if (tagKey === 'sortings' && tLower.includes('sortings')) return true;
          if (tagKey === 'number theory' && tLower.includes('number theory')) return true;
          if (tagKey === 'bitmasks' && tLower.includes('bitmasks')) return true;
          if (tagKey === 'constructive algorithms' && tLower.includes('constructive')) return true;
          return false;
        });
        if (matchesTag) {
          solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
        }
      }
    });
    return solvedSet.size;
  };

  // Helper to compute difficulty distributions of solved problems for the mini bar-chart
  const getMiniDifficultyDist = (tagKey) => {
    const buckets = [0, 0, 0, 0];
    
    if (!isSynced) {
      if (tagKey === 'dp') return [45, 30, 20, 5];
      if (tagKey === 'graphs') return [30, 40, 20, 10];
      if (tagKey === 'math') return [50, 25, 15, 10];
      if (tagKey === 'binary search') return [40, 30, 20, 10];
      if (tagKey === 'greedy') return [60, 25, 10, 5];
      if (tagKey === 'data structures') return [20, 35, 30, 15];
      if (tagKey === 'strings') return [35, 45, 15, 5];
      return [25, 25, 25, 25];
    }

    const solvedSet = new Set();
    submissions.forEach(sub => {
      if (sub.verdict === 'OK' && sub.problem && sub.problem.tags) {
        const matchesTag = sub.problem.tags.some(t => {
          const tLower = t.toLowerCase();
          if (tagKey === 'dp' && tLower === 'dp') return true;
          if (tagKey === 'graphs' && (tLower.includes('graph') || tLower.includes('tree') || tLower.includes('dfs') || tLower.includes('shortest paths'))) return true;
          if (tagKey === 'math' && (tLower.includes('math') || tLower.includes('number theory') || tLower.includes('matrices'))) return true;
          if (tagKey === 'binary search' && tLower.includes('binary search')) return true;
          if (tagKey === 'greedy' && tLower.includes('greedy')) return true;
          if (tagKey === 'data structures' && (tLower.includes('data structures') || tLower.includes('dsu') || tLower.includes('trees'))) return true;
          if (tagKey === 'strings' && (tLower.includes('string') || tLower.includes('expression') || tLower.includes('hashing'))) return true;
          if (tagKey === 'two pointers' && tLower.includes('two pointers')) return true;
          if (tagKey === 'sortings' && tLower.includes('sortings')) return true;
          if (tagKey === 'number theory' && tLower.includes('number theory')) return true;
          if (tagKey === 'bitmasks' && tLower.includes('bitmasks')) return true;
          if (tagKey === 'constructive algorithms' && tLower.includes('constructive')) return true;
          return false;
        });
        
        if (matchesTag) {
          const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
          if (!solvedSet.has(problemKey)) {
            solvedSet.add(problemKey);
            const r = sub.problem.rating || 800;
            if (r <= 1200) buckets[0]++;
            else if (r <= 1600) buckets[1]++;
            else if (r <= 2000) buckets[2]++;
            else buckets[3]++;
          }
        }
      }
    });

    return buckets;
  };

  // Filter tags
  const filteredTagKeys = Object.keys(tags).filter(key => {
    const tag = tags[key];
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    const allowedKeys = categoryMap[activeCategory] || [];
    return matchesSearch && allowedKeys.includes(key);
  });

  return (
    <div
      className={`h-screen flex flex-col border-r border-brand-border bg-slate-950/85 transition-all duration-300 relative ${
        isCollapsed ? 'w-18' : 'w-80'
      }`}
    >
      {/* Collapse Toggle Button (Hidden on Mobile) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-purple-600 border border-brand-border flex items-center justify-center text-white cursor-pointer hover:bg-purple-500 transition-colors z-20 shadow-md active:scale-90 hidden md:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Top Header Section */}
      <div className="p-4 border-b border-brand-border flex items-center justify-between gap-3">
        {isCollapsed ? (
          <button
            onClick={() => {
              setCurrentView('profile');
              setActiveTag(null);
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
              currentView === 'profile'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Profile Dashboard"
          >
            <User size={20} />
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentView('profile');
              setActiveTag(null);
              if (onMobileClose) onMobileClose(); // close drawer on mobile click
            }}
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
              currentView === 'profile'
                ? 'bg-gradient-to-r from-purple-600/30 to-cyan-500/30 border-purple-500/50 text-white shadow-lg shadow-purple-900/20 font-semibold'
                : 'bg-slate-900/60 border-brand-border text-slate-300 hover:text-white hover:border-purple-500/30 hover:bg-slate-900/90'
            }`}
          >
            <div className={`p-2 rounded-lg ${currentView === 'profile' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-400'}`}>
              <User size={18} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold">Profile Dashboard</div>
              <div className="text-xs text-slate-400">Sync &amp; Analytics</div>
            </div>
            {isSynced && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-glow-indicator"></span>
            )}
          </button>
        )}


      </div>

      {/* Streak Fire Banner */}
      {!isCollapsed && activeStreak > 0 && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono font-bold text-amber-400 shadow-md shadow-amber-500/5 animate-pulse">
          <div className="flex items-center gap-2">
            <Flame className="fill-amber-500 text-amber-500" size={16} />
            <span>SOLVE STREAK</span>
          </div>
          <span>{activeStreak} DAYS</span>
        </div>
      )}

      {/* Search Section */}
      {!isCollapsed && (
        <div className="px-4 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search active tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-brand-border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 font-sans transition-all"
            />
          </div>
        </div>
      )}

      {/* Categories Filter (Horizontal Slider) */}
      {!isCollapsed && (
        <div className="px-4 py-3 flex gap-1.5 overflow-x-auto custom-scrollbar whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-900/40 text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Workspace Subtitle */}
      {!isCollapsed && (
        <div className="px-4 pb-2 border-b border-brand-border/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Workspaces</span>
          <span className="text-xs text-slate-500 font-mono">{filteredTagKeys.length} available</span>
        </div>
      )}

      {/* Tag Cards List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-2">
        {filteredTagKeys.map((key) => {
          const tag = tags[key];
          const solved = getSolvedCount(key);
          const total = problemsCountByTag[key] || tag.totalProblems;
          const pct = total > 0 ? Math.min(100, Math.floor((solved / total) * 100)) : 0;
          const dist = getMiniDifficultyDist(key);
          const maxDist = Math.max(...dist, 1);
          const isActive = activeTag === key && currentView === 'workspace';

          if (isCollapsed) {
            return (
              <button
                key={key}
                onClick={() => {
                  setCurrentView('workspace');
                  setActiveTag(key);
                  if (onMobileClose) onMobileClose();
                }}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative ${
                  isActive
                    ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900/40 border border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/80'
                }`}
                title={`${tag.name} (${solved}/${total} solved)`}
              >
                <Hash size={18} />
                <span className="absolute bottom-1 text-[9px] font-mono text-slate-400 font-bold">{pct}%</span>
              </button>
            );
          }

          return (
            <div
              key={key}
              onClick={() => {
                setCurrentView('workspace');
                setActiveTag(key);
                if (onMobileClose) onMobileClose();
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col gap-2.5 glass-card ${
                isActive
                  ? 'border-purple-500/50 bg-purple-950/20 text-purple-100 shadow-lg shadow-purple-950/10'
                  : 'hover:border-purple-500/20 hover:bg-slate-900/30'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <Hash size={14} className={isActive ? 'text-purple-400' : 'text-slate-500'} />
                  <span className="text-sm font-semibold truncate leading-tight tracking-wide font-sans">{tag.name}</span>
                </div>
                <div className="text-[10.5px] font-mono text-slate-400 whitespace-nowrap">
                  <span className="font-bold text-slate-300">{solved}</span>
                  <span className="text-slate-600">/</span>
                  <span>{total}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[9px] font-mono text-slate-500">
                    <span>PROGRESS</span>
                    <span className="font-bold text-slate-400">{pct}%</span>
                  </div>
                </div>

                <div className="flex items-end gap-0.5 h-6 w-12 pb-1 border-b border-l border-slate-800 px-0.5">
                  {dist.map((val, idx) => {
                    const heightPct = Math.max(12, Math.floor((val / maxDist) * 100));
                    const colorMap = [
                      'bg-emerald-500/80',
                      'bg-cyan-500/80',
                      'bg-amber-500/80',
                      'bg-rose-500/80'
                    ];
                    return (
                      <div
                        key={idx}
                        className={`w-2 rounded-t-xs ${colorMap[idx]} transition-all duration-300`}
                        style={{ height: `${heightPct}%` }}
                        title={`${val} solved in range`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Personal Bookmarks Section */}
      {!isCollapsed && bookmarks.length > 0 && (
        <div className="border-t border-brand-border/40 p-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            <Star className="text-yellow-400 fill-yellow-400" size={13} />
            <span>Bookmarks ({bookmarks.length})</span>
          </div>
          <div className="space-y-1.5">
            {bookmarks.map((p, idx) => (
              <a
                key={idx}
                href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-brand-border/40 hover:border-purple-500/40 transition-all text-xs font-sans group"
              >
                <div className="min-w-0 w-2/3">
                  <div className="text-slate-300 group-hover:text-white truncate font-medium leading-tight">
                    {p.name}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    {p.contestId}{p.index}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-500 font-bold">
                  {p.rating || 1000}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer System Indicator */}
      {!isCollapsed && (
        <div className="p-3 border-t border-brand-border/40 bg-slate-950/95 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSynced ? 'bg-emerald-500 pulse-glow-indicator' : 'bg-slate-700'}`}></span>
            <span>STATUS: {isSynced ? 'ONLINE' : 'LOCAL'}</span>
          </div>
          <span>v1.2.0</span>
        </div>
      )}
    </div>
  );
}

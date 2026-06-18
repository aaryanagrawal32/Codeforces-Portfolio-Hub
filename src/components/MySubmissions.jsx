import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Play, Check, AlertCircle, FileCode2, Terminal, AlignLeft, Search, Star } from 'lucide-react';
import CodeBlock from './Shared/CodeBlock';
import { mockData } from '../data/mockData';

export default function MySubmissions({
  tagKey,
  isSynced,
  submissions,
  bookmarks = [],
  onToggleBookmark
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(15);
  const [expandedProblemId, setExpandedProblemId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('statement'); // 'statement', 'approach', 'code'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Trace simulator state
  const [runningTrace, setRunningTrace] = useState(false);
  const [traceStepIdx, setTraceStepIdx] = useState(-1);
  const [traceIntervalId, setTraceIntervalId] = useState(null);

  // Reset pagination, filters and expansion when changing tag workspace
  useEffect(() => {
    setActiveFilter('All');
    setVisibleCount(15);
    setExpandedProblemId(null);
    setSearchQuery('');
    stopTrace();
  }, [tagKey]);

  // Clean up trace interval on unmount
  useEffect(() => {
    return () => stopTrace();
  }, [traceIntervalId]);

  const stopTrace = () => {
    if (traceIntervalId) {
      clearInterval(traceIntervalId);
      setTraceIntervalId(null);
    }
    setRunningTrace(false);
    setTraceStepIdx(-1);
  };

  // Helper: map range filters to numerical ranges
  const matchesRange = (rating, rangeName) => {
    if (rangeName === 'All' || rangeName === 'Unsolved') return true;
    const r = rating || 800;
    if (rangeName === '800–1200') return r <= 1200;
    if (rangeName === '1300–1600') return r >= 1300 && r <= 1600;
    if (rangeName === '1700–2000') return r >= 1700 && r <= 2000;
    if (rangeName === '2100+') return r >= 2100;
    return true;
  };

  // Filter submissions corresponding to this tag
  const filteredSubmissions = useMemo(() => {
    const list = isSynced ? submissions : mockData.submissions;
    const uniqueSolves = new Map(); // problemKey -> submission

    list.forEach(sub => {
      const prob = sub.problem;
      if (!prob || !prob.tags) return;
      
      const matchesTag = prob.tags.some(t => {
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
        const probKey = `${prob.contestId}-${prob.index}`;
        // Prioritize OK verdict for unique problems list
        if (!uniqueSolves.has(probKey) || sub.verdict === 'OK') {
          uniqueSolves.set(probKey, sub);
        }
      }
    });

    return Array.from(uniqueSolves.values());
  }, [submissions, isSynced, tagKey]);

  // Compute solved problem counts per rating range & unsolved attempts count
  const filterCounts = useMemo(() => {
    const counts = { 'All': 0, '800–1200': 0, '1300–1600': 0, '1700–2000': 0, '2100+': 0, 'Unsolved': 0 };
    filteredSubmissions.forEach(sub => {
      if (sub.verdict === 'OK') {
        const r = sub.problem.rating || 800;
        counts['All']++;
        if (r <= 1200) counts['800–1200']++;
        else if (r <= 1600) counts['1300–1600']++;
        else if (r <= 2000) counts['1700–2000']++;
        else counts['2100+']++;
      } else {
        counts['Unsolved']++;
      }
    });
    return counts;
  }, [filteredSubmissions]);

  // Solves filtered by the active difficulty pill & search query
  const displayedSubmissions = useMemo(() => {
    return filteredSubmissions
      .filter(sub => {
        // Handle Unsolved vs Solved filter
        const isUnsolvedFilter = activeFilter === 'Unsolved';
        const matchesVerdict = isUnsolvedFilter ? sub.verdict !== 'OK' : sub.verdict === 'OK';
        
        // Handle Range
        const matchesRangeFilter = matchesRange(sub.problem.rating, activeFilter);
        
        // Handle Text Search
        const searchLower = searchQuery.toLowerCase().trim();
        const matchesSearch = !searchLower || 
          sub.problem.name.toLowerCase().includes(searchLower) ||
          `${sub.problem.contestId}-${sub.problem.index}`.toLowerCase().includes(searchLower);

        return matchesVerdict && matchesRangeFilter && matchesSearch;
      })
      .sort((a, b) => (b.problem.rating || 0) - (a.problem.rating || 0)); // Sort by rating desc
  }, [filteredSubmissions, activeFilter, searchQuery]);

  // Paginated list
  const paginatedSubmissions = useMemo(() => {
    return displayedSubmissions.slice(0, visibleCount);
  }, [displayedSubmissions, visibleCount]);

  // Check if a problem is a curated demo from local storage / mockData
  const getCuratedDetails = (contestId, index) => {
    return mockData.submissions.find(sub =>
      sub.problem.contestId === contestId && sub.problem.index === index && sub.code
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 2400) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (rating >= 2100) return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    if (rating >= 1900) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (rating >= 1600) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (rating >= 1400) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    if (rating >= 1200) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  };

  const handleRunTrace = (traceLength) => {
    if (runningTrace) {
      stopTrace();
      return;
    }
    
    setRunningTrace(true);
    setTraceStepIdx(0);
    
    const intervalId = setInterval(() => {
      setTraceStepIdx(prev => {
        if (prev >= traceLength - 1) {
          clearInterval(intervalId);
          setRunningTrace(false);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    
    setTraceIntervalId(intervalId);
  };

  const isBookmarked = (problem) => {
    const key = `${problem.contestId}-${problem.index}`;
    return bookmarks.some(b => `${b.contestId}-${b.index}` === key);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Difficulty Filters */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl glass-card">
        {/* Real-time Text Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search problems by name or code (e.g. 1899A)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(15);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-brand-border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {Object.keys(filterCounts).map(filter => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setVisibleCount(15);
                  setExpandedProblemId(null);
                  stopTrace();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono cursor-pointer transition-all border ${
                  activeFilter === filter
                    ? filter === 'Unsolved'
                      ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/20'
                      : 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-900/60 border-brand-border text-slate-400 hover:text-slate-200 hover:border-purple-500/20'
                }`}
              >
                {filter} ({filterCounts[filter]})
              </button>
            ))}
          </div>

          {/* Difficulty Stats Summary Bar */}
          <div className="w-full md:w-80 flex flex-col gap-1.5 font-mono text-[10.5px]">
            <div className="flex justify-between text-slate-400">
              <span>Solved Range Distribution</span>
              <span>Total: {filterCounts['All']}</span>
            </div>
            {/* Progress bar stack */}
            {(() => {
              const tot = filterCounts['All'] || 1;
              const pct1 = (filterCounts['800–1200'] / tot) * 100;
              const pct2 = (filterCounts['1300–1600'] / tot) * 100;
              const pct3 = (filterCounts['1700–2000'] / tot) * 100;
              const pct4 = (filterCounts['2100+'] / tot) * 100;

              return (
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-900">
                  {filterCounts['800–1200'] > 0 && <div className="h-full bg-emerald-500" style={{ width: `${pct1}%` }} title={`800-1200: ${filterCounts['800–1200']}`} />}
                  {filterCounts['1300–1600'] > 0 && <div className="h-full bg-cyan-400" style={{ width: `${pct2}%` }} title={`1300-1600: ${filterCounts['1300–1600']}`} />}
                  {filterCounts['1700–2000'] > 0 && <div className="h-full bg-amber-500" style={{ width: `${pct3}%` }} title={`1700-2000: ${filterCounts['1700–2000']}`} />}
                  {filterCounts['2100+'] > 0 && <div className="h-full bg-rose-500" style={{ width: `${pct4}%` }} title={`2100+: ${filterCounts['2100+']}`} />}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Paginated Problem List */}
      <div className="space-y-4">
        {paginatedSubmissions.map(sub => {
          const p = sub.problem;
          const problemKey = `${p.contestId}-${p.index}`;
          const isExpanded = expandedProblemId === problemKey;
          const curated = getCuratedDetails(p.contestId, p.index);
          const hasDetails = !!curated;
          const bookmarked = isBookmarked(p);

          return (
            <div
              key={problemKey}
              className={`rounded-2xl border transition-all duration-300 glass-card ${
                isExpanded ? 'border-purple-500/40 bg-purple-950/5 shadow-md shadow-purple-950/5' : 'hover:border-brand-border-glow'
              }`}
            >
              {/* Card Header Accordion Trigger */}
              <div
                onClick={() => {
                  if (isExpanded) {
                    setExpandedProblemId(null);
                    stopTrace();
                  } else {
                    setExpandedProblemId(problemKey);
                    setActiveSubTab('statement');
                    stopTrace();
                  }
                }}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-950/60 border border-brand-border px-2.5 py-1.5 rounded-lg">
                    {problemKey}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-200 truncate leading-tight tracking-wide">
                      {p.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      CF Round {p.contestId} {sub.verdict !== 'OK' && <span className="text-rose-400 font-bold ml-1.5">({sub.verdict})</span>}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Rating badge */}
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${getRatingColor(p.rating)}`}>
                    {p.rating || '800'}
                  </span>

                  {/* Bookmark Button */}
                  {onToggleBookmark && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(p);
                      }}
                      className="p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-brand-border transition-colors cursor-pointer"
                      title={bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                    >
                      <Star
                        size={15}
                        className={bookmarked ? "fill-yellow-400 text-yellow-400" : "text-slate-500 hover:text-slate-300"}
                      />
                    </button>
                  )}

                  {/* Accordion arrow */}
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded Problem Card IDE Sub-Tabs */}
              {isExpanded && (
                <div className="border-t border-brand-border/40 p-5 space-y-5 animate-slideDown">
                  <div className="flex gap-2 border-b border-brand-border/30 pb-3">
                    <button
                      onClick={() => { setActiveSubTab('statement'); stopTrace(); }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        activeSubTab === 'statement'
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <AlignLeft size={13} />
                      Problem Statement
                    </button>
                    <button
                      onClick={() => { setActiveSubTab('approach'); stopTrace(); }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        activeSubTab === 'approach'
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Terminal size={13} />
                      Approach &amp; Trace
                    </button>
                    <button
                      onClick={() => { setActiveSubTab('code'); stopTrace(); }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        activeSubTab === 'code'
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileCode2 size={13} />
                      C++ Code
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {activeSubTab === 'statement' && (
                    <div className="p-4 bg-slate-950/40 border border-brand-border/40 rounded-xl space-y-4 font-sans text-sm">
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Statement Overview</div>
                        <p className="text-slate-300 leading-relaxed max-w-2xl">
                          Codeforces problem <span className="font-bold text-white font-mono">{problemKey} - {p.name}</span> requires analyzing optimal values under index constraints. Check constraints and variables on the official server node.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-900 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-mono">CONSTRAINTS: 2.0s • 256MB</span>
                        <a
                          href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-brand-border hover:border-purple-500 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          View on Codeforces
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  )}

                  {activeSubTab === 'approach' && (
                    <div className="space-y-6 animate-fadeIn">
                      {hasDetails ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Intuition &amp; Algorithm</h5>
                              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                                {curated.approach}
                              </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-950/50 border border-brand-border/40 font-mono text-xs flex flex-col justify-center gap-3">
                              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                                <span className="text-slate-500">TIME</span>
                                <span className="text-cyan-400 font-bold">{curated.timeComplexity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">SPACE</span>
                                <span className="text-purple-400 font-bold">{curated.spaceComplexity}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border border-brand-border/40 rounded-xl bg-slate-950/60 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                                <Terminal size={14} className="text-purple-400" />
                                Dry-Run Trace Simulator
                              </h5>
                              <button
                                onClick={() => handleRunTrace(curated.trace.length)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
                                  runningTrace
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                <Play size={11} className={runningTrace ? 'animate-pulse' : ''} />
                                {runningTrace ? 'Stop Trace' : 'Run Trace'}
                              </button>
                            </div>

                            <div className="space-y-2.5 font-mono text-xs max-h-60 overflow-y-auto custom-scrollbar">
                              {curated.trace.map((step, idx) => {
                                const isVisible = idx <= traceStepIdx;
                                const isCurrent = idx === traceStepIdx;
                                const isFinal = idx === curated.trace.length - 1 && isCurrent;

                                if (!isVisible) return null;

                                return (
                                  <div
                                    key={step.step}
                                    className={`p-3 rounded-lg border transition-all duration-300 flex items-start gap-3 animate-slideDown ${
                                      isFinal
                                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                                        : isCurrent
                                        ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                                        : 'bg-slate-950/40 border-brand-border/20 text-slate-400'
                                    }`}
                                  >
                                    <span className="font-bold text-[10px] uppercase bg-slate-900 border border-brand-border px-1.5 py-0.5 rounded">
                                      STEP {step.step}
                                    </span>
                                    <span className="leading-relaxed">{step.desc}</span>
                                  </div>
                                );
                              })}

                              {traceStepIdx === -1 && (
                                <div className="py-8 text-center text-slate-500 text-xs font-sans italic">
                                  Click "Run Trace" to watch the execution timeline simulation.
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-6 text-center bg-slate-950/40 border border-brand-border/40 rounded-xl space-y-2">
                          <AlertCircle size={22} className="text-slate-500 mx-auto" />
                          <h6 className="text-sm font-bold text-slate-300">Detailed Dry-Run Unavailable</h6>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
                            This submission was synced from Codeforces. Choose a curated demo problem to play with the step-by-step trace simulator.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSubTab === 'code' && (
                    <div className="animate-fadeIn">
                      {hasDetails ? (
                        <CodeBlock code={curated.code} maxLinesHeight="max-h-[380px]" />
                      ) : (
                        <div className="p-6 text-center bg-slate-950/40 border border-brand-border/40 rounded-xl space-y-4">
                          <div className="space-y-1">
                            <AlertCircle size={22} className="text-slate-500 mx-auto" />
                            <h6 className="text-sm font-bold text-slate-300">Source Code Retrieval Locked</h6>
                            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                              Source code fetching is restricted by Codeforces CORS policy. View your code directly on Codeforces.
                            </p>
                          </div>
                          <a
                            href={`https://codeforces.com/contest/${p.contestId}/submission/${sub.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-brand-border hover:border-purple-500 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                          >
                            View Submission Code
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {displayedSubmissions.length === 0 && (
          <div className="py-12 text-center rounded-2xl border border-brand-border/40 bg-slate-950/15 text-slate-500 text-sm font-sans">
            No problems found matching search query and filters.
          </div>
        )}
      </div>

      {/* Show More Pagination Button */}
      {displayedSubmissions.length > visibleCount && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisibleCount(prev => prev + 15)}
            className="px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-brand-border hover:border-purple-500 text-slate-300 hover:text-white transition rounded-xl text-xs font-bold cursor-pointer font-mono active:scale-95"
          >
            Show More ({displayedSubmissions.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

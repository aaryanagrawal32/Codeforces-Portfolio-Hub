import React, { useMemo, useState, useEffect } from 'react';
import { ExternalLink, AlertCircle, Sparkles, Star } from 'lucide-react';
import { recommenderFallback } from '../data/recommenderFallback';

export default function PracticeProblems({
  tagKey,
  isSynced,
  submissions,
  bookmarks = [],
  onToggleBookmark
}) {
  // LocalStorage state for cleared problems through this arena
  const [clearedArenaProblems, setClearedArenaProblems] = useState(() => {
    try {
      const saved = localStorage.getItem(`cf_arena_cleared_${tagKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Reload cleared problems when tagKey changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cf_arena_cleared_${tagKey}`);
      setClearedArenaProblems(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setClearedArenaProblems([]);
    }
  }, [tagKey]);

  // Map user submissions to check solve/attempt status
  const solvedSet = useMemo(() => {
    const solved = new Set();
    if (!isSynced || !submissions) return solved;
    submissions.forEach(sub => {
      if (sub.problem && sub.verdict === 'OK') {
        solved.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });
    return solved;
  }, [submissions, isSynced]);

  const attemptedSet = useMemo(() => {
    const attempted = new Set();
    if (!isSynced || !submissions) return attempted;
    submissions.forEach(sub => {
      if (sub.problem && sub.verdict !== 'OK') {
        attempted.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });
    return attempted;
  }, [submissions, isSynced]);

  // Track cleared problems dynamically
  useEffect(() => {
    if (!isSynced || !submissions) return;
    const fallbackList = recommenderFallback[tagKey] || {};
    const categories = ['easy', 'medium', 'hard'];
    const newCleared = [...clearedArenaProblems];
    let changed = false;

    categories.forEach(cat => {
      const list = fallbackList[cat] || [];
      list.forEach(fallbackProb => {
        let currentProb = { ...fallbackProb };
        let shift = 0;
        
        while (solvedSet.has(`${currentProb.contestId}-${currentProb.index}`)) {
          const key = `${currentProb.contestId}-${currentProb.index}`;
          if (!newCleared.includes(key)) {
            newCleared.push(key);
            changed = true;
          }
          shift += 5;
          currentProb.contestId = fallbackProb.contestId + shift;
        }
      });
    });

    if (changed) {
      localStorage.setItem(`cf_arena_cleared_${tagKey}`, JSON.stringify(newCleared));
      setClearedArenaProblems(newCleared);
    }
  }, [tagKey, solvedSet, isSynced]);

  // Calculate total solved problems on CF for this specific tag
  const tagSolvedCount = useMemo(() => {
    if (!isSynced || !submissions) return 0;
    const solvedUnique = new Set();
    submissions.forEach(sub => {
      if (sub.problem && sub.verdict === 'OK') {
        const hasTag = sub.problem.tags && sub.problem.tags.some(t => {
          const lTag = t.toLowerCase();
          if (tagKey === 'dp') return lTag === 'dp';
          if (tagKey === 'graphs') return ['graphs', 'trees', 'shortest paths', 'dfs and similar'].includes(lTag);
          if (tagKey === 'math') return ['math', 'number theory', 'combinatorics', 'geometry'].includes(lTag);
          if (tagKey === 'binary search') return lTag === 'binary search';
          if (tagKey === 'greedy') return lTag === 'greedy';
          if (tagKey === 'data structures') return ['data structures', 'dsu', 'trees'].includes(lTag);
          if (tagKey === 'strings') return ['strings', 'string suffix structures', 'expression parsing'].includes(lTag);
          if (tagKey === 'two pointers') return lTag === 'two pointers';
          if (tagKey === 'sortings') return lTag === 'sortings';
          if (tagKey === 'number theory') return lTag === 'number theory';
          if (tagKey === 'bitmasks') return lTag === 'bitmasks';
          if (tagKey === 'constructive algorithms') return lTag === 'constructive';
          return false;
        });
        if (hasTag) {
          solvedUnique.add(`${sub.problem.contestId}-${sub.problem.index}`);
        }
      }
    });
    return solvedUnique.size;
  }, [submissions, isSynced, tagKey]);

  const problems = useMemo(() => {
    const fallbackList = recommenderFallback[tagKey] || {};
    const result = { easy: [], medium: [], hard: [] };

    const categories = ['easy', 'medium', 'hard'];
    categories.forEach(cat => {
      const list = fallbackList[cat] || [];
      const defaultProbs = {
        easy: { contestId: 1883, index: "C", name: "Dynamic Walk", rating: 1200 },
        medium: { contestId: 1915, index: "G", name: "Bicycles", rating: 1500 },
        hard: { contestId: 1800, index: "F", name: "Dasha and Nightmares", rating: 1800 }
      };

      for (let i = 0; i < 3; i++) {
        let fallbackProb = list[i] || defaultProbs[cat];
        let currentProb = { ...fallbackProb };
        let shift = 0;
        let suffix = "";

        // Infinite unsolved variant generation loop
        while (solvedSet.has(`${currentProb.contestId}-${currentProb.index}`)) {
          shift += 5;
          currentProb.contestId = fallbackProb.contestId + shift;
          if (shift === 5) suffix = " II";
          else if (shift === 10) suffix = " III";
          else if (shift === 15) suffix = " IV";
          else suffix = ` V (+${shift/5})`;
          
          currentProb.name = `${fallbackProb.name}${suffix}`;
          currentProb.rating = fallbackProb.rating + Math.min(300, Math.floor(shift / 5) * 50);
        }

        result[cat].push(currentProb);
      }
    });

    return result;
  }, [tagKey, solvedSet]);

  const isBookmarked = (problem) => {
    const key = `${problem.contestId}-${problem.index}`;
    return bookmarks.some(b => `${b.contestId}-${b.index}` === key);
  };

  const renderCategoryList = (catName, title, colorClass) => {
    const list = problems[catName] || [];

    return (
      <div className="flex flex-col gap-4 bg-slate-950/25 border border-brand-border/20 p-5 rounded-2xl">
        <div className="flex items-center justify-between border-b border-brand-border/10 pb-2.5">
          <h4 className={`text-xs font-bold font-mono tracking-wider uppercase ${colorClass}`}>
            {title} ({list.length})
          </h4>
        </div>

        <div className="flex flex-col gap-3">
          {list.length === 0 ? (
            <div className="text-slate-500 font-mono text-xs italic py-2">No practice problems in database</div>
          ) : (
            list.map((p, idx) => {
              const key = `${p.contestId}-${p.index}`;
              const isAttempted = attemptedSet.has(key);
              const bookmarked = isBookmarked(p);

              let statusBadge = (
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 text-[9px] font-semibold font-mono uppercase">
                  Unsolved
                </span>
              );

              if (isAttempted) {
                statusBadge = (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-semibold font-mono uppercase">
                    <AlertCircle size={9} />
                    Attempted
                  </span>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-brand-border/30 bg-slate-950/40 hover:bg-slate-950/75 hover:border-brand-border/70 transition-all duration-300 flex items-center justify-between gap-4 group"
                >
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-brand-border/40 flex items-center justify-center text-xs font-bold font-mono text-slate-400 group-hover:text-slate-200 transition">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-400 text-[10px] font-mono font-medium">
                          {p.contestId}{p.index}
                        </span>
                        {statusBadge}
                      </div>
                      <h5 className="text-xs font-bold text-slate-200 group-hover:text-white mt-1 truncate pr-2" title={p.name}>
                        {p.name}
                      </h5>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 font-semibold font-mono uppercase block leading-none">Rating</span>
                      <strong className="text-xs font-mono text-slate-300 font-bold block mt-0.5">{p.rating || '—'}</strong>
                    </div>

                    {/* Bookmark Star Button */}
                    {onToggleBookmark && (
                      <button
                        onClick={() => onToggleBookmark(p)}
                        className="p-1.5 rounded-md hover:bg-slate-900 border border-transparent hover:border-brand-border transition-colors cursor-pointer"
                        title={bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                      >
                        <Star
                          size={13}
                          className={bookmarked ? "fill-yellow-400 text-yellow-400" : "text-slate-500 hover:text-slate-300"}
                        />
                      </button>
                    )}

                    <a
                      href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6.5 h-6.5 rounded-lg bg-slate-900/40 border border-brand-border/20 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
                    >
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={16} />
            <h3 className="text-sm font-bold font-mono tracking-wider text-purple-400 uppercase">Topic Practice Arena</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-sans max-w-md">
            Master this topic by solving these 9 target problems. <span className="text-purple-400 font-semibold">Problems you solve are automatically replaced in real-time with higher-level unsolved variants</span> so your active set remains fresh.
          </p>
        </div>

        {isSynced && (
          <div className="bg-slate-950/40 border border-brand-border/30 rounded-xl p-4 flex gap-4 min-w-[280px] z-10 font-mono text-xs justify-center items-center">
            <div className="text-center flex-1">
              <span className="text-[8px] text-slate-500 uppercase block leading-tight">Total Solved ({tagKey.toUpperCase()})</span>
              <strong className="text-emerald-400 text-base font-bold block mt-0.5">{tagSolvedCount}</strong>
            </div>
            <div className="w-[1px] bg-slate-900 h-8"></div>
            <div className="text-center flex-1">
              <span className="text-[8px] text-slate-500 uppercase block leading-tight">Cleared Here</span>
              <strong className="text-purple-400 text-base font-bold block mt-0.5">{clearedArenaProblems.length} solved</strong>
            </div>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderCategoryList('easy', 'Easy Targets (< 1300)', 'text-cyan-400')}
        {renderCategoryList('medium', 'Medium Targets (1300-1900)', 'text-amber-500')}
        {renderCategoryList('hard', 'Hard Targets (≥ 1900)', 'text-rose-500')}
      </div>
    </div>
  );
}

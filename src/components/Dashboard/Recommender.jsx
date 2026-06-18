import React, { useMemo, useState } from 'react';
import { Target, ChevronRight, Award, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { recommenderFallback } from '../../data/recommenderFallback';

// Seeded pseudo-random number generator based on date string
function getSeededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    hash = (hash * 16807) % 2147483647;
    return Math.abs(hash) / 2147483647;
  };
}

export default function Recommender({ submissions, isSynced }) {
  const [showAll, setShowAll] = useState(false);

  // 1. Calculate user's weakest tag based on lowest solved percentage
  const weakestTag = useMemo(() => {
    const tagsList = ["dp", "graphs", "math", "binary search", "greedy", "data structures", "strings", "two pointers", "sortings", "number theory", "bitmasks", "constructive algorithms"];
    
    const solvedCounts = {};
    const totalFallbackCounts = {
      "dp": 2450, "graphs": 2200, "math": 2800, "binary search": 1800, "greedy": 2600, "data structures": 1950, "strings": 1200,
      "two pointers": 1800, "sortings": 3200, "number theory": 1500, "bitmasks": 1200, "constructive algorithms": 2200
    };

    tagsList.forEach(t => solvedCounts[t] = 0);

    if (isSynced && submissions) {
      submissions.forEach(sub => {
        if (sub.verdict === 'OK' && sub.problem && sub.problem.tags) {
          sub.problem.tags.forEach(tag => {
            const tLower = tag.toLowerCase();
            tagsList.forEach(tKey => {
              let matches = false;
              if (tKey === 'dp' && tLower === 'dp') matches = true;
              else if (tKey === 'graphs' && (tLower.includes('graph') || tLower.includes('tree') || tLower.includes('dfs') || tLower.includes('shortest paths'))) matches = true;
              else if (tKey === 'math' && (tLower.includes('math') || tLower.includes('number theory'))) matches = true;
              else if (tKey === 'binary search' && tLower.includes('binary search')) matches = true;
              else if (tKey === 'greedy' && tLower.includes('greedy')) matches = true;
              else if (tKey === 'data structures' && (tLower.includes('data structures') || tLower.includes('dsu') || tLower.includes('trees'))) matches = true;
              else if (tKey === 'strings' && (tLower.includes('string') || tLower.includes('hashing'))) matches = true;
              else if (tKey === 'two pointers' && tLower.includes('two pointers')) matches = true;
              else if (tKey === 'sortings' && tLower.includes('sortings')) matches = true;
              else if (tKey === 'number theory' && tLower.includes('number theory')) matches = true;
              else if (tKey === 'bitmasks' && tLower.includes('bitmasks')) matches = true;
              else if (tKey === 'constructive algorithms' && tLower.includes('constructive')) matches = true;

              if (matches) solvedCounts[tKey]++;
            });
          });
        }
      });
    }

    let minPct = 1.0;
    let weakest = 'dp';
    tagsList.forEach(t => {
      const solved = solvedCounts[t] || 0;
      const total = totalFallbackCounts[t] || 1000;
      const pct = solved / total;
      if (pct < minPct) {
        minPct = pct;
        weakest = t;
      }
    });

    return weakest;
  }, [submissions, isSynced]);

  // 2. Fetch problems for weakest tag
  const recommendations = useMemo(() => {
    const fallback = recommenderFallback[weakestTag] || recommenderFallback["dp"];
    
    if (showAll) {
      const list = [];
      const maxLength = Math.max(
        fallback.easy?.length || 0,
        fallback.medium?.length || 0,
        fallback.hard?.length || 0
      );
      for (let i = 0; i < maxLength; i++) {
        if (fallback.easy?.[i]) {
          list.push({ id: `rec-easy-${i}`, level: 'Easy', problem: fallback.easy[i] });
        }
        if (fallback.medium?.[i]) {
          list.push({ id: `rec-medium-${i}`, level: 'Medium', problem: fallback.medium[i] });
        }
        if (fallback.hard?.[i]) {
          list.push({ id: `rec-hard-${i}`, level: 'Hard', problem: fallback.hard[i] });
        }
      }
      return list;
    } else {
      return [
        { id: 'rec-easy-0', level: 'Easy', problem: fallback.easy[0] },
        { id: 'rec-medium-0', level: 'Medium', problem: fallback.medium[0] },
        { id: 'rec-hard-0', level: 'Hard', problem: fallback.hard[0] }
      ];
    }
  }, [weakestTag, showAll]);

  // 3. Problem of the Day (Seeded by Date)
  const problemOfTheDay = useMemo(() => {
    const todayStr = new Date().toDateString();
    const rand = getSeededRandom(todayStr);
    
    const fallback = recommenderFallback[weakestTag] || recommenderFallback["dp"];
    const allList = [...fallback.easy, ...fallback.medium, ...fallback.hard];
    
    if (allList.length === 0) {
      return {
        contestId: 1914,
        index: "C",
        name: "Quests",
        rating: 1100
      };
    }
    
    const idx = Math.floor(rand() * allList.length);
    return allList[idx] || allList[0];
  }, [weakestTag]);

  const getRatingBadgeDetails = (rating) => {
    let badgeColor = "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400";
    let badgeText = "Newbie";
    if (rating >= 2400) {
      badgeColor = "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.15)]";
      badgeText = "Grandmaster";
    } else if (rating >= 2100) {
      badgeColor = "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]";
      badgeText = "Master";
    } else if (rating >= 1900) {
      badgeColor = "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]";
      badgeText = "Candidate Master";
    } else if (rating >= 1600) {
      badgeColor = "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)]";
      badgeText = "Expert";
    } else if (rating >= 1400) {
      badgeColor = "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]";
      badgeText = "Specialist";
    } else if (rating >= 1200) {
      badgeColor = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      badgeText = "Pupil";
    }
    return { badgeColor, badgeText };
  };

  return (
    <div className="xl:col-span-3 p-6 rounded-2xl glass-card flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <Target className="text-purple-400 animate-pulse shrink-0" size={18} />
          <h4 className="text-sm font-bold font-mono tracking-wider text-purple-400 uppercase">Personalized Recommender</h4>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Weakest Focus Area:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold uppercase tracking-wide">
            {weakestTag}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* 1. Problem of the Day Card */}
        <div className="lg:col-span-1 p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 flex flex-col justify-between gap-4 shadow-lg shadow-amber-500/5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Flame size={14} className="animate-bounce" />
              Problem of the Day
            </div>
            <h5 className="text-sm font-black text-white leading-snug truncate" title={problemOfTheDay.name}>
              {problemOfTheDay.name}
            </h5>
            <span className="text-[10px] font-mono text-slate-500 block">
              CF Round {problemOfTheDay.contestId} • Index {problemOfTheDay.index}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-amber-500/20 pt-3">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 dark:bg-amber-500/20 text-white dark:text-amber-300 border border-transparent dark:border-amber-500/30 text-[10px] font-bold font-mono shadow-sm">
              Rating: {problemOfTheDay.rating}
            </span>
            <a
              href={`https://codeforces.com/problemset/problem/${problemOfTheDay.contestId}/${problemOfTheDay.index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-slate-900 border border-brand-border text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        {/* 2. Three Level Recommendations */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            const p = rec.problem;
            const rating = p.rating || 1200;
            const { badgeColor, badgeText } = getRatingBadgeDetails(rating);
            
            let difficultyColor = "text-cyan-600 dark:text-cyan-400 border-cyan-500/20 bg-cyan-500/5 dark:bg-cyan-950/10 hover:border-cyan-500/30 dark:hover:border-cyan-400/40";
            if (rec.level === "Medium") {
              difficultyColor = "text-amber-600 dark:text-amber-500 border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 hover:border-amber-500/40";
            } else if (rec.level === "Hard") {
              difficultyColor = "text-rose-600 dark:text-rose-500 border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/10 hover:border-rose-500/40";
            }

            return (
              <a
                key={rec.id}
                href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 transform hover:-translate-y-1 ${difficultyColor} group cursor-pointer`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono">
                      {rec.level} Target
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {p.contestId}{p.index}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-100 group-hover:text-white leading-snug truncate pr-2" title={p.name}>
                    {p.name}
                  </h5>
                </div>

                <div className="flex items-center justify-between border-t border-brand-border/10 pt-3 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold font-mono ${badgeColor}`}>
                    {badgeText}
                  </span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-xs font-bold">{rating}</span>
                    <ChevronRight size={12} className="transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-2 relative z-10 no-print">
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-5 py-2.5 text-xs font-bold font-mono tracking-wider text-purple-400 hover:text-white uppercase rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
        >
          {showAll ? 'Show Less' : 'Show More'}
          {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
  );
}

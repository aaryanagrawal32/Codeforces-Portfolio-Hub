import React, { useState, useMemo } from 'react';
import { Award, RefreshCw, User, Sword, Shield, AlertCircle, Sparkles, HelpCircle, ChevronDown, ChevronUp, X, Lock } from 'lucide-react';

// Sub-components
import StatsCard from './Dashboard/StatsCard';
import LeetCodeBridge from './Dashboard/LeetCodeBridge';
import Recommender from './Dashboard/Recommender';
import RivalDuelPanel from './Dashboard/RivalDuelPanel';
import ContestHeatmap from './Dashboard/ContestHeatmap';
import RatingGraph from './Dashboard/RatingGraph';
import MasteryCard, { getMasteryLevel } from './Dashboard/MasteryCard';

const DEFAULT_TOTAL_COUNTS = {
  "dp": 2450,
  "graphs": 2200,
  "math": 2800,
  "binary search": 1800,
  "greedy": 2600,
  "data structures": 1950,
  "strings": 1200,
  "two pointers": 1800,
  "sortings": 3200,
  "number theory": 1500,
  "bitmasks": 1200,
  "constructive algorithms": 2200
};

export default function ProfileDashboard({
  handleInput,
  setHandleInput,
  onSync,
  syncing,
  syncError,
  userData,
  ratingHistory,
  submissions,
  isSynced,
  onSelectTag,
  rivalInput,
  setRivalInput,
  rivalData,
  rivalRatingHistory,
  rivalSubmissions,
  isDuelActive,
  syncingRival,
  syncRivalError,
  onRivalSync,
  onRivalDisconnect
}) {
  const [showRivalInput, setShowRivalInput] = useState(false);
  const [showLeetCodeBridge, setShowLeetCodeBridge] = useState(false);
  const [expandCoOccur, setExpandCoOccur] = useState(false);
  const [isMasteryModalOpen, setIsMasteryModalOpen] = useState(false);

  // 1. Tag Solved Count mapping
  const solvedCountByTag = useMemo(() => {
    const tags = ["dp", "graphs", "math", "binary search", "greedy", "data structures", "strings", "two pointers", "sortings", "number theory", "bitmasks", "constructive algorithms"];
    const counts = {};
    tags.forEach(t => counts[t] = 0);

    if (!isSynced) {
      // Return a nice set of simulated counts
      return {
        dp: 142, graphs: 110, math: 185, "binary search": 95, greedy: 172, "data structures": 88, strings: 54,
        "two pointers": 45, sortings: 72, "number theory": 52, bitmasks: 38, "constructive algorithms": 64
      };
    }

    const solvedSet = {};
    tags.forEach(t => solvedSet[t] = new Set());

    submissions.forEach(sub => {
      if (sub.verdict === 'OK' && sub.problem && sub.problem.tags) {
        const probKey = `${sub.problem.contestId}-${sub.problem.index}`;
        sub.problem.tags.forEach(t => {
          const tLower = t.toLowerCase();
          tags.forEach(tKey => {
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

            if (matches) solvedSet[tKey].add(probKey);
          });
        });
      }
    });

    tags.forEach(t => counts[t] = solvedSet[t].size);
    return counts;
  }, [submissions, isSynced]);

  // Total Solved Problems count
  const totalSolvedCount = useMemo(() => {
    const solvedSet = new Set();
    submissions.forEach(sub => {
      if (sub.verdict === 'OK' && sub.problem) {
        solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    });
    return isSynced ? solvedSet.size : (solvedSet.size || 893);
  }, [submissions, isSynced]);

  // 2. LeetCode-style difficulty solved stats
  const solvedDifficultyStats = useMemo(() => {
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    const solvedUnique = new Set();
    const attemptedSet = new Set();

    submissions.forEach(sub => {
      if (!sub.problem) return;
      const probKey = `${sub.problem.contestId}-${sub.problem.index}`;
      attemptedSet.add(probKey);
      if (sub.verdict === "OK") {
        solvedUnique.add(probKey);
      }
    });

    solvedUnique.forEach(probKey => {
      const sub = submissions.find(s => s.problem && `${s.problem.contestId}-${s.problem.index}` === probKey);
      if (sub && sub.problem) {
        const rating = sub.problem.rating || 800;
        if (rating < 1300) easySolved++;
        else if (rating < 1900) mediumSolved++;
        else hardSolved++;
      }
    });

    const easyTotal = 2900;
    const mediumTotal = 4200;
    const hardTotal = 2100;
    const totalAvailable = easyTotal + mediumTotal + hardTotal;

    return {
      easySolved,
      easyTotal,
      mediumSolved,
      mediumTotal,
      hardSolved,
      hardTotal,
      totalSolved: isSynced ? solvedUnique.size : (solvedUnique.size || 893),
      totalAvailable,
      attempting: attemptedSet.size - solvedUnique.size
    };
  }, [submissions, isSynced]);

  // 3. Tag Co-occurrence Insights (Suggestion 17)
  const coOccurrenceInsights = useMemo(() => {
    if (!isSynced || !submissions) return [];
    
    const userSolvedSet = new Set();
    const unsolvedUnique = new Map();
    
    submissions.forEach(sub => {
      if (!sub.problem) return;
      const probKey = `${sub.problem.contestId}-${sub.problem.index}`;
      if (sub.verdict === 'OK') {
        userSolvedSet.add(probKey);
      }
    });

    submissions.forEach(sub => {
      if (!sub.problem) return;
      const probKey = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!userSolvedSet.has(probKey)) {
        unsolvedUnique.set(probKey, sub.problem);
      }
    });

    const coCounts = {};
    const tags = ["dp", "graphs", "math", "binary search", "greedy", "data structures", "strings", "two pointers", "sortings", "number theory", "bitmasks", "constructive algorithms"];

    unsolvedUnique.forEach(prob => {
      if (!prob.tags || prob.tags.length < 2) return;
      
      const matchedKeys = [];
      prob.tags.forEach(tag => {
        const tLower = tag.toLowerCase();
        tags.forEach(tKey => {
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

          if (matches && !matchedKeys.includes(tKey)) {
            matchedKeys.push(tKey);
          }
        });
      });

      for (let i = 0; i < matchedKeys.length; i++) {
        for (let j = i + 1; j < matchedKeys.length; j++) {
          const pair = [matchedKeys[i], matchedKeys[j]].sort().join(" + ");
          coCounts[pair] = (coCounts[pair] || 0) + 1;
        }
      }
    });

    return Object.entries(coCounts)
      .map(([pair, count]) => ({ pair, count }))
      .sort((a, b) => b.count - a.count);
  }, [submissions, isSynced]);

  // 4. Time-to-Solve Estimation box
  const timeToSolveEstimate = useMemo(() => {
    if (!isSynced || !submissions) return "N/A";
    
    // Sort submissions by time ascending
    const sortedSubs = [...submissions].sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);
    const firstAttempts = {};
    const solveDurations = [];

    sortedSubs.forEach(sub => {
      if (!sub.problem) return;
      const key = `${sub.problem.contestId}-${sub.problem.index}`;
      if (!firstAttempts[key]) {
        firstAttempts[key] = sub.creationTimeSeconds;
      }
      if (sub.verdict === 'OK') {
        const duration = (sub.creationTimeSeconds - firstAttempts[key]) / 60; // in minutes
        solveDurations.push(duration);
      }
    });

    if (solveDurations.length === 0) return isSynced ? "N/A" : "1.4 days avg";
    const avgMins = solveDurations.reduce((a, b) => a + b, 0) / solveDurations.length;
    if (avgMins < 60) return `${Math.round(avgMins)} mins avg`;
    const avgHours = avgMins / 60;
    if (avgHours < 24) return `${avgHours.toFixed(1)} hrs avg`;
    return `${(avgHours / 24).toFixed(1)} days avg`;
  }, [submissions, isSynced]);

  // Dynamic bubble positions layout for 12 tags
  const bubblePositions = [
    { key: "dp", name: "DP", cx: 65, cy: 55, r: 35 },
    { key: "graphs", name: "Graphs", cx: 155, cy: 55, r: 35 },
    { key: "math", name: "Math", cx: 245, cy: 55, r: 35 },
    { key: "binary search", name: "BSearch", cx: 335, cy: 55, r: 35 },
    { key: "greedy", name: "Greedy", cx: 425, cy: 55, r: 35 },
    { key: "data structures", name: "DataStruct", cx: 515, cy: 55, r: 35 },
    
    { key: "strings", name: "Strings", cx: 65, cy: 145, r: 35 },
    { key: "two pointers", name: "2Pointers", cx: 155, cy: 145, r: 35 },
    { key: "sortings", name: "Sorting", cx: 245, cy: 145, r: 35 },
    { key: "number theory", name: "NumTheory", cx: 335, cy: 145, r: 35 },
    { key: "bitmasks", name: "Bitmask", cx: 425, cy: 145, r: 35 },
    { key: "constructive algorithms", name: "Construct", cx: 515, cy: 145, r: 35 }
  ];

  // Map synced / fallback structures to rivals list format
  const rivalsList = useMemo(() => {
    if (!isDuelActive) return [];
    // Currently support 1 active rival, but structured as array to support Multi-Handle Compare
    return [{
      handle: rivalData?.handle || 'Rival',
      userData: rivalData,
      ratingHistory: rivalRatingHistory,
      submissions: rivalSubmissions
    }];
  }, [isDuelActive, rivalData, rivalRatingHistory, rivalSubmissions]);

  return (
    <div className="space-y-6">
      {/* A. Header & Sync bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl -z-10"></div>
        
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-wide text-white flex items-center gap-2">
            <Award className="text-purple-400" />
            Competitive Profile Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Analyze rating fluctuations, tag metrics, and co-occurrences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:items-center no-print">
          <div className="relative">
            <User className="absolute left-3.5 top-3 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Codeforces handle..."
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-950/80 border border-brand-border rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-full sm:w-56 font-mono"
            />
          </div>
          <button
            onClick={onSync}
            disabled={syncing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl text-sm font-semibold transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
          >
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Connecting...' : 'Sync Profile'}
          </button>
          
          {isSynced && (
            <button
              onClick={() => setShowRivalInput(!showRivalInput)}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 border rounded-xl text-sm font-semibold transition cursor-pointer active:scale-95 ${
                isDuelActive 
                  ? 'bg-amber-600/20 border-amber-500/40 text-amber-300' 
                  : 'bg-slate-900 border-brand-border text-slate-300 hover:border-amber-500/30'
              }`}
            >
              <Sword size={15} />
              {isDuelActive ? 'Active Duel' : 'VS Rival'}
            </button>
          )}
        </div>
      </div>

      {/* Rival Duel Input Sub-bar */}
      {showRivalInput && isSynced && (
        <div className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-amber-500/25 bg-amber-950/5 animate-slideDown no-print">
          <div className="flex items-center gap-2">
            <Sword className="text-amber-500" size={18} />
            <div className="text-sm font-semibold text-slate-200">Rival Duel Arena</div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:items-center">
            {isDuelActive && rivalData ? (
              <div className="flex items-center gap-3 bg-slate-950/40 border border-brand-border/40 px-3.5 py-2 rounded-xl text-xs font-mono">
                <span className="text-slate-400">VS:</span>
                <span className="text-amber-400 font-bold">{rivalData.handle}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300 font-semibold">{rivalData.rating ? `R: ${rivalData.rating}` : 'Unrated'}</span>
                <button
                  onClick={onRivalDisconnect}
                  className="text-rose-400 hover:text-rose-300 ml-2 font-bold cursor-pointer bg-transparent border-0"
                >
                  Exit
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 text-slate-500" size={14} />
                  <input
                    type="text"
                    placeholder="Rival handle..."
                    value={rivalInput}
                    onChange={(e) => setRivalInput(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-950/80 border border-brand-border rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-48 font-mono"
                  />
                </div>
                <button
                  onClick={() => onRivalSync()}
                  disabled={syncingRival}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={13} className={syncingRival ? 'animate-spin' : ''} />
                  {syncingRival ? 'Connecting...' : 'Duel'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Rival Sync Error / Sync Error Indicator */}
      {syncRivalError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{syncRivalError}</span>
        </div>
      )}
      {syncError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* B. Core Dashboard view */}
      {isSynced && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 1. Stats Info */}
            <StatsCard
              userData={userData}
              solvedCountByTag={solvedCountByTag}
              totalSolved={totalSolvedCount}
            />

            {/* 2. Rating graph */}
            <RatingGraph
              userData={userData}
              ratingHistory={ratingHistory}
              isSynced={isSynced}
              isDuelActive={isDuelActive}
              rivalRatingHistory={rivalRatingHistory}
            />
          </div>

          {/* 3. Recommender (Training targets + Problem of the Day) */}
          <div className="no-print">
            <Recommender
              submissions={submissions}
              isSynced={isSynced}
            />
          </div>

          {/* 4. Rival Duel panel (Radar & overlap solved lists) */}
          {isDuelActive && (
            <RivalDuelPanel
              isSynced={isSynced}
              submissions={submissions}
              rivals={rivalsList}
              isDuelActive={isDuelActive}
            />
          )}

          {/* 5. Heatmap activity calendar */}
          <ContestHeatmap
            submissions={submissions}
            isSynced={isSynced}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 6. Leetcode Solved bridge card */}
            <LeetCodeBridge
              userData={userData}
              showLeetCodeBridge={showLeetCodeBridge}
              setShowLeetCodeBridge={setShowLeetCodeBridge}
              solvedDifficultyStats={solvedDifficultyStats}
            />

            {/* 7. Bubble Cloud topic mastery */}
            <div className="xl:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-4 overflow-hidden relative">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-400 font-sans tracking-wide">Topic Mastery Cloud</h4>
                <span className="text-xs text-slate-500 font-mono">Dynamic liquid-fill completion status</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 py-2 justify-items-center select-none mastery-cloud-grid">
                {bubblePositions.map(pos => {
                  const solved = solvedCountByTag[pos.key] || 0;
                  const total = DEFAULT_TOTAL_COUNTS[pos.key] || 1500;
                  const pct = total > 0 ? Math.min(1.0, solved / total) : 0;
                  
                  // Coordinate space for individual 80x80 bubble SVGs
                  const cx = 40;
                  const cy = 40;
                  const r = 35;
                  const liquidY = cy + r - (pct * 2 * r);
                  const waveH = r * 0.12;
                  const clipId = `clip-${pos.key.replace(/\s+/g, '-')}`;

                  return (
                    <div
                      key={pos.key}
                      onClick={() => onSelectTag && onSelectTag(pos.key)}
                      className="flex flex-col items-center cursor-pointer group/bubble transition-transform duration-300 hover:scale-105"
                    >
                      <svg width="80" height="80" viewBox="0 0 80 80" className="select-none">
                        <defs>
                          <linearGradient id={`liquidFillGrad-${pos.key.replace(/\s+/g, '-')}`} x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0.32" />
                          </linearGradient>
                          <clipPath id={clipId}>
                            <circle cx={cx} cy={cy} r={r} />
                          </clipPath>
                        </defs>

                        <circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill="rgba(30, 27, 38, 0.65)"
                          stroke="rgba(168, 85, 247, 0.35)"
                          strokeWidth="1.5"
                          className="group-hover/bubble:stroke-purple-500 transition-colors"
                          style={{ filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.25))" }}
                        />

                        {pct > 0 && (
                          <path
                            d={`M ${cx - r} ${cy + r + 20} L ${cx - r} ${liquidY} Q ${cx} ${liquidY - waveH} ${cx + r} ${liquidY} L ${cx + r} ${cy + r + 20} Z`}
                            fill={`url(#liquidFillGrad-${pos.key.replace(/\s+/g, '-')})`}
                            clipPath={`url(#${clipId})`}
                          />
                        )}

                        <text
                          x={cx}
                          y={cy - 1}
                          textAnchor="middle"
                          fontSize="8"
                          fill="#f8fafc"
                          fontFamily="sans-serif"
                          fontWeight="700"
                        >
                          {pos.name}
                        </text>
                        <text
                          x={cx}
                          y={cy + 9}
                          textAnchor="middle"
                          fontSize="7.5"
                          fill="rgba(34, 211, 238, 0.95)"
                          fontFamily="monospace"
                          fontWeight="700"
                        >
                          {solved}/{total}
                        </text>
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 8. Tag Co-occurrence Insights Card */}
            {coOccurrenceInsights.length > 0 && (
              <div className="p-5 rounded-2xl glass-card flex flex-col justify-between space-y-4 relative hover:z-20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-400 shrink-0" size={16} />
                    <h4 className="text-sm font-semibold text-slate-400 font-sans tracking-wide">
                      Tag Co-occurrence Gaps (Weak Tag Pairs)
                    </h4>
                    <div className="relative group/tooltip inline-block shrink-0">
                      <HelpCircle className="text-slate-500 hover:text-slate-300 cursor-help transition-colors" size={13} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 border border-brand-border text-[10.5px] text-slate-300 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 text-center font-sans font-normal normal-case leading-normal">
                        Identifies pairs of topics (e.g. Greedy + Math) that frequently appear together in problems you have attempted but not solved. Helps focus practice on compound weaknesses.
                      </div>
                    </div>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pr-1 ${
                    expandCoOccur ? 'max-h-60 overflow-y-auto custom-scrollbar' : ''
                  }`}>
                    {(expandCoOccur ? coOccurrenceInsights : coOccurrenceInsights.slice(0, 4)).map((co, idx) => (
                      <div key={idx} className="p-3 bg-slate-950/40 border border-brand-border/30 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-400 font-bold uppercase truncate" title={co.pair}>
                          {co.pair}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-slate-500 font-sans">Unsolved attempts</span>
                          <strong className="text-rose-400">{co.count} problems</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {coOccurrenceInsights.length > 4 && (
                  <div className="flex justify-center mt-2 pt-1 border-t border-brand-border/10 no-print">
                    <button
                      onClick={() => setExpandCoOccur(!expandCoOccur)}
                      className="px-3.5 py-1.5 text-[10px] font-bold font-mono tracking-wider text-purple-400 hover:text-white uppercase rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-1 cursor-pointer"
                    >
                      {expandCoOccur ? 'Show Less' : 'Show More'}
                      {expandCoOccur ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mastery Card Widget */}
            <MasteryCard 
              solvedCountByTag={solvedCountByTag} 
              onOpenModal={() => setIsMasteryModalOpen(true)}
            />

            {/* 9. Time to Solve Estimation Card */}
            <div className="p-5 rounded-2xl glass-card space-y-4 relative hover:z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative group/tooltip inline-block shrink-0">
                    <HelpCircle className="text-cyan-400 cursor-help transition-colors" size={16} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 border border-brand-border text-[10.5px] text-slate-300 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 text-center font-sans font-normal normal-case leading-normal">
                      Estimates your typical speed to solve a problem. It measures the average duration between your first submission and your accepted (AC) verdict for each problem.
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-400 font-sans tracking-wide">
                    CF Practice Velocity
                  </h4>
                </div>
              </div>
              <div className="p-4 bg-slate-950/40 border border-brand-border/30 rounded-xl flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400 block font-sans">Time-to-Solve Estimation</span>
                  <span className="text-[10px] text-slate-500">Average time from first submission to AC verdict</span>
                </div>
                <div className="text-right">
                  <strong className="text-sm text-cyan-400 block">{timeToSolveEstimate}</strong>
                  <span className="text-[9px] text-slate-500">across unique solves</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render modal at root of dashboard to avoid parent backdrop-filter containing block bug in dark mode */}
      {isMasteryModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="w-full max-w-2xl p-6 rounded-2xl border border-brand-border bg-slate-950 shadow-2xl relative flex flex-col gap-4 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <Award className="text-purple-400" size={18} />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                  All Topic Mastery Badges
                </h3>
              </div>
              <button
                onClick={() => setIsMasteryModalOpen(false)}
                className="p-1.5 rounded-lg border border-brand-border bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1 py-1">
              {["dp", "graphs", "math", "binary search", "greedy", "data structures", "strings", "two pointers", "sortings", "number theory", "bitmasks", "constructive algorithms"].map(tag => {
                const count = solvedCountByTag[tag] || 0;
                const { level, color } = getMasteryLevel(count);

                return (
                  <div
                    key={tag}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between h-[90px] transition-all duration-300 ${color}`}
                  >
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <span className="text-[10.5px] font-bold font-mono uppercase truncate text-slate-500 dark:text-slate-400" title={tag}>
                        {tag}
                      </span>
                      {level === 'Locked' && <Lock size={12} className="text-slate-400 dark:text-slate-600 shrink-0" />}
                    </div>

                    <div className="mt-1.5 flex flex-col gap-1">
                      <span className="text-sm font-black font-sans leading-none">
                        {level}
                      </span>
                      <span className="text-[11px] font-sans text-slate-400 dark:text-slate-500 leading-none">
                        {count} solves
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

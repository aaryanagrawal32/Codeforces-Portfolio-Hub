import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

export function translateRating(cfRating) {
  if (!cfRating) return 1000;
  if (cfRating <= 1000) {
    return Math.round(cfRating * 1.3);
  } else if (cfRating <= 1500) {
    return Math.round(1300 + (cfRating - 1000) * 1.1);
  } else if (cfRating <= 2000) {
    return Math.round(1850 + (cfRating - 1500) * 0.9);
  } else {
    return Math.round(2300 + (cfRating - 2000) * 0.85);
  }
}

export default function LeetCodeBridge({ userData, showLeetCodeBridge, setShowLeetCodeBridge, solvedDifficultyStats }) {
  const cfRating = userData?.rating || 1000;
  const lcRating = translateRating(cfRating);

  let levelChar = 'P';
  let badgeName = '🛡️ Practitioner';
  if (lcRating >= 2200) {
    levelChar = 'G';
    badgeName = '🏆 Guardian';
  } else if (lcRating >= 1600) {
    levelChar = 'K';
    badgeName = '⚔️ Knight';
  }

  let percentile = 'Top 45.0%';
  if (lcRating >= 2400) percentile = 'Top 0.5%';
  else if (lcRating >= 2200) percentile = 'Top 1.0%';
  else if (lcRating >= 2000) percentile = 'Top 2.5%';
  else if (lcRating >= 1800) percentile = 'Top 8.0%';
  else if (lcRating >= 1600) percentile = 'Top 15.0%';

  return (
    <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 relative">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-400 font-sans tracking-wide">Solved Problems (LeetCode Style)</h4>
        <button
          onClick={() => setShowLeetCodeBridge(!showLeetCodeBridge)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 font-mono tracking-wide uppercase transition cursor-pointer bg-transparent border-0"
        >
          <ArrowRightLeft size={11} />
          {showLeetCodeBridge ? 'Stats' : 'Bridge'}
        </button>
      </div>
      
      {showLeetCodeBridge ? (
        <div className="flex-grow flex flex-col justify-between py-2 animate-fadeIn">
          <div className="flex items-center gap-4 bg-slate-900/40 dark:bg-slate-950/40 p-4 rounded-xl border border-brand-border/40 font-mono">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-lg font-extrabold shadow-md shadow-amber-900/20">
              {levelChar}
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">LeetCode Level</div>
              <div className="text-sm font-bold text-white uppercase mt-0.5">
                {badgeName}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 font-mono text-[11px]">
            <div className="bg-slate-900/30 dark:bg-slate-950/30 p-2.5 rounded-lg border border-brand-border/20 text-center">
              <span className="text-[9px] text-slate-500 uppercase block">LC Rating Eq.</span>
              <strong className="text-slate-200 text-sm mt-0.5 block">
                ~{lcRating}
              </strong>
            </div>
            <div className="bg-slate-900/30 dark:bg-slate-950/30 p-2.5 rounded-lg border border-brand-border/20 text-center">
              <span className="text-[9px] text-slate-500 uppercase block">Global Percentile</span>
              <strong className="text-slate-200 text-sm mt-0.5 block font-bold">
                {percentile}
              </strong>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 italic mt-3 text-center leading-normal">
            Translation uses community-established non-linear CF ↔ LC rating mappings.
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center gap-4 py-2">
          {/* Circular Progress Left */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="var(--chart-grid)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#solvedOrangeGrad)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 - (Math.min(1.0, (solvedDifficultyStats.totalSolved || 1) / (solvedDifficultyStats.totalAvailable || 1)) * 2 * Math.PI * 50)}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="solvedOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center Stats */}
            <div className="absolute flex flex-col items-center justify-center font-sans">
              <span className="text-xl font-bold font-mono text-white tracking-tighter leading-none">{solvedDifficultyStats.totalSolved}</span>
              <div className="w-6 h-[1px] bg-slate-300 dark:bg-slate-700 my-0.5"></div>
              <span className="text-[9.5px] text-slate-500 dark:text-slate-400 font-mono font-semibold">{solvedDifficultyStats.totalAvailable}</span>
              <span className="text-[8.5px] text-slate-400 dark:text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                <span className="w-1 h-1 rounded-full bg-purple-500"></span> Solved
              </span>
              {solvedDifficultyStats.attempting > 0 && (
                <span className="text-[8.5px] text-slate-500 dark:text-slate-400 mt-0.5">{solvedDifficultyStats.attempting} Attempting</span>
              )}
            </div>
          </div>

          {/* Progress Bars Right */}
          <div className="flex-1 grid grid-cols-[1fr_auto] gap-y-1 font-mono text-[11px] items-center">
            {/* Easy Row */}
            <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider whitespace-nowrap pr-2">Rating &lt; 1300</span>
            <span className="text-slate-300 font-semibold text-right">{solvedDifficultyStats.easySolved}<span className="text-slate-500 dark:text-slate-400 font-medium">/{solvedDifficultyStats.easyTotal}</span></span>
            <div className="col-span-2 w-full h-1.5 bg-slate-900 border border-brand-border/20 rounded-full overflow-hidden mb-2.5">
              <div
                className="h-full bg-cyan-500 dark:bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (solvedDifficultyStats.easySolved / (solvedDifficultyStats.easyTotal || 1)) * 100)}%` }}
              ></div>
            </div>

            {/* Medium Row */}
            <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider whitespace-nowrap pr-2">Rating 1300-1900</span>
            <span className="text-slate-300 font-semibold text-right">{solvedDifficultyStats.mediumSolved}<span className="text-slate-500 dark:text-slate-400 font-medium">/{solvedDifficultyStats.mediumTotal}</span></span>
            <div className="col-span-2 w-full h-1.5 bg-slate-900 border border-brand-border/20 rounded-full overflow-hidden mb-2.5">
              <div
                className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (solvedDifficultyStats.mediumSolved / (solvedDifficultyStats.mediumTotal || 1)) * 100)}%` }}
              ></div>
            </div>

            {/* Hard Row */}
            <span className="text-rose-600 dark:text-rose-500 font-bold uppercase tracking-wider whitespace-nowrap pr-2">Rating ≥ 1900</span>
            <span className="text-slate-300 font-semibold text-right">{solvedDifficultyStats.hardSolved}<span className="text-slate-500 dark:text-slate-400 font-medium">/{solvedDifficultyStats.hardTotal}</span></span>
            <div className="col-span-2 w-full h-1.5 bg-slate-900 border border-brand-border/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 dark:bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (solvedDifficultyStats.hardSolved / (solvedDifficultyStats.hardTotal || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Award, Lock, Maximize2, HelpCircle } from 'lucide-react';

export const getMasteryLevel = (count) => {
    if (count >= 30) {
      return { 
        level: 'Platinum', 
        color: 'border-cyan-500/30 dark:border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400' 
      };
    }
    if (count >= 16) {
      return { 
        level: 'Gold', 
        color: 'border-amber-500/30 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' 
      };
    }
    if (count >= 6) {
      return { 
        level: 'Silver', 
        color: 'border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/40 text-slate-500 dark:text-slate-300' 
      };
    }
    if (count >= 1) {
      return { 
        level: 'Bronze', 
        color: 'border-orange-500/30 dark:border-orange-500/40 bg-orange-50/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' 
      };
    }
    return { 
      level: 'Locked', 
      color: 'border-slate-200 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-950/10 text-slate-400 dark:text-slate-600' 
    };
  };

export default function MasteryCard({ solvedCountByTag, onOpenModal }) {

  const tagsList = [
    "dp", "graphs", "math", "binary search", "greedy", "data structures", 
    "strings", "two pointers", "sortings", "number theory", "bitmasks", "constructive algorithms"
  ];

  return (
    <div className="p-5 rounded-2xl glass-card flex flex-col justify-between relative hover:z-20">
      <div className="space-y-4">
        {/* Card Header with Pop-up Trigger at Top Right */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="text-purple-400 shrink-0" size={18} />
            <h4 className="text-sm font-semibold text-slate-400 font-sans tracking-wide">
              Topic Mastery Badges
            </h4>
            <div className="relative group/tooltip inline-block shrink-0">
              <HelpCircle className="text-slate-500 hover:text-slate-300 cursor-help transition-colors" size={13} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 border border-brand-border text-[10.5px] text-slate-300 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50 text-center font-sans font-normal normal-case leading-normal">
                Tracks your solved problem count per topic to assign mastery levels: Bronze (1+), Silver (6+), Gold (16+), and Platinum (30+). Solve more to unlock higher badges!
              </div>
            </div>
          </div>
          <button
            onClick={onOpenModal}
            className="p-1.5 rounded-lg border border-brand-border bg-slate-900/60 text-slate-400 hover:text-white transition cursor-pointer active:scale-95 no-print"
            title="View All Badges"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {/* Default Grid (Collapsed scroll view) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1 animate-fadeIn">
          {tagsList.map(tag => {
            const count = solvedCountByTag[tag] || 0;
            const { level, color } = getMasteryLevel(count);

            return (
              <div
                key={tag}
                className={`p-3 rounded-xl border flex flex-col justify-between h-[85px] transition-all duration-300 ${color}`}
              >
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <span className="text-[10px] font-bold font-mono uppercase truncate text-slate-500 dark:text-slate-400" title={tag}>
                    {tag}
                  </span>
                  {level === 'Locked' && <Lock size={10} className="text-slate-400 dark:text-slate-600 shrink-0" />}
                </div>

                <div className="mt-1 flex flex-col gap-0.5">
                  <span className="text-sm font-extrabold font-sans leading-none">
                    {level}
                  </span>
                  <span className="text-[10.5px] font-sans text-slate-400 dark:text-slate-500 leading-none">
                    {count} solves
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
}

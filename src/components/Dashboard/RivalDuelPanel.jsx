import React, { useMemo, useState } from 'react';
import { Sword, Users, AlertCircle, Hash, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function RivalDuelPanel({
  isSynced,
  submissions,
  rivals = [], // array of { handle, userData, ratingHistory, submissions }
  isDuelActive
}) {
  const [expandOverlap, setExpandOverlap] = useState(false);
  const tagsList = ["dp", "graphs", "math", "binary search", "greedy", "data structures", "strings", "two pointers", "sortings", "number theory", "bitmasks", "constructive algorithms"];

  // 1. Compute solved counts per tag for user
  const userSolvedCounts = useMemo(() => {
    const counts = {};
    tagsList.forEach(t => counts[t] = new Set());
    
    if (isSynced && submissions) {
      submissions.forEach(sub => {
        if (sub.verdict === 'OK' && sub.problem && sub.problem.tags) {
          const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
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

              if (matches) counts[tKey].add(problemKey);
            });
          });
        }
      });
    }
    
    const res = {};
    tagsList.forEach(t => res[t] = counts[t].size);
    return res;
  }, [submissions, isSynced]);

  // 2. Compute solved counts per tag for each rival
  const rivalsSolvedCounts = useMemo(() => {
    return rivals.map(rival => {
      const counts = {};
      tagsList.forEach(t => counts[t] = new Set());
      
      if (rival.submissions) {
        rival.submissions.forEach(sub => {
          if (sub.verdict === 'OK' && sub.problem && sub.problem.tags) {
            const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
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

                if (matches) counts[tKey].add(problemKey);
              });
            });
          }
        });
      }
      
      const res = {};
      tagsList.forEach(t => res[t] = counts[t].size);
      return { handle: rival.handle, counts: res };
    });
  }, [rivals]);

  // 3. Compute Max Scale for Radar
  const maxScale = useMemo(() => {
    let maxVal = 10;
    Object.values(userSolvedCounts).forEach(v => { if (v > maxVal) maxVal = v; });
    rivalsSolvedCounts.forEach(r => {
      Object.values(r.counts).forEach(v => { if (v > maxVal) maxVal = v; });
    });
    return Math.ceil(maxVal * 1.15 / 5) * 5 || 25; // Round to nearest 5
  }, [userSolvedCounts, rivalsSolvedCounts]);

  // 4. Calculate Radar Axes coordinates
  const radarAxes = useMemo(() => {
    const cx = 110, cy = 110, r = 85;
    const n = tagsList.length;
    return tagsList.map((tag, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      return {
        tag,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        labelX: cx + (r + 14) * Math.cos(angle),
        labelY: cy + (r + 14) * Math.sin(angle)
      };
    });
  }, [tagsList]);

  // Helper to generate polygon path
  const getPolygonPath = (solvedCounts) => {
    const cx = 110, cy = 110, r = 85;
    const n = tagsList.length;
    let points = [];
    tagsList.forEach((tag, i) => {
      const val = solvedCounts[tag] || 0;
      const factor = Math.min(1.0, val / maxScale);
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      points.push(`${cx + r * factor * Math.cos(angle)},${cy + r * factor * Math.sin(angle)}`);
    });
    return points.join(" ");
  };

  // 5. Problems Solved by Rival but NOT by you
  const rivalOverlapProblems = useMemo(() => {
    const userSolvedSet = new Set();
    if (submissions) {
      submissions.forEach(sub => {
        if (sub.verdict === 'OK' && sub.problem) {
          userSolvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
        }
      });
    }

    return rivals.map(rival => {
      const list = [];
      const seenProbs = new Set();
      
      if (rival.submissions) {
        rival.submissions.forEach(sub => {
          if (sub.verdict === 'OK' && sub.problem) {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            if (!userSolvedSet.has(key) && !seenProbs.has(key)) {
              seenProbs.add(key);
              list.push(sub.problem);
            }
          }
        });
      }
      
      // Sort by rating desc
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      return { handle: rival.handle, problems: list.slice(0, 10) }; // limit to top 10
    });
  }, [rivals, submissions]);

  if (!isDuelActive) return null;

  const rivalColors = [
    { fill: 'rgba(245, 158, 11, 0.15)', stroke: '#f59e0b' }, // Amber
    { fill: 'rgba(34, 211, 238, 0.1)', stroke: '#22d3ee' },   // Cyan
    { fill: 'rgba(16, 185, 129, 0.1)', stroke: '#10b981' }    // Emerald
  ];

  return (
    <div className="xl:col-span-3 p-6 rounded-2xl glass-card flex flex-col gap-6 relative border border-amber-500/20 bg-slate-950/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sword className="text-amber-500 animate-pulse shrink-0" size={18} />
          <h4 className="text-sm font-bold font-mono tracking-wider text-amber-500 uppercase">Rival Duel Comparison</h4>
        </div>
        <div className="text-xs font-mono text-slate-500">
          Comparing: <span className="text-slate-300 font-bold">You</span> vs {rivals.map(r => r.handle).join(', ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Radar Chart (12 points/axes) */}
        <div className="lg:col-span-5 flex justify-center">
          <svg width="220" height="220" className="select-none">
            {/* Draw background circles */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((f, i) => (
              <polygon
                key={i}
                points={radarAxes.map(ax => {
                  const angle = (2 * Math.PI * tagsList.indexOf(ax.tag)) / tagsList.length - Math.PI / 2;
                  return `${110 + 85 * f * Math.cos(angle)},${110 + 85 * f * Math.sin(angle)}`;
                }).join(" ")}
                fill="none"
                stroke="var(--chart-grid)"
                strokeWidth="1"
              />
            ))}

            {/* Draw Axes lines */}
            {radarAxes.map((ax, idx) => (
              <line
                key={idx}
                x1="110"
                y1="110"
                x2={ax.x}
                y2={ax.y}
                stroke="var(--chart-grid)"
                strokeWidth="1"
              />
            ))}

            {/* Primary User Polygon */}
            <polygon
              points={getPolygonPath(userSolvedCounts)}
              fill="rgba(139, 92, 246, 0.15)"
              stroke="#8b5cf6"
              strokeWidth="2.5"
            />

            {/* Rivals Polygons */}
            {rivalsSolvedCounts.map((r, idx) => {
              const style = rivalColors[idx % rivalColors.length];
              return (
                <polygon
                  key={r.handle}
                  points={getPolygonPath(r.counts)}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth="2"
                  strokeDasharray="2,2"
                />
              );
            })}

            {/* Labels */}
            {radarAxes.map((ax, idx) => {
              const angle = (2 * Math.PI * idx) / tagsList.length - Math.PI / 2;
              let anchor = "middle";
              if (Math.cos(angle) > 0.1) anchor = "start";
              else if (Math.cos(angle) < -0.1) anchor = "end";

              return (
                <text
                  key={idx}
                  x={ax.labelX}
                  y={ax.labelY + 3.5}
                  textAnchor={anchor}
                  fontSize="7.5"
                  fill="rgba(148, 163, 184, 0.85)"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {ax.tag.substring(0, 8).toUpperCase()}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Rival Solved, You Haven't Lists */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono border-b border-brand-border/30 pb-2">
              Target Problems: Rivals Solved, You Haven't
            </h5>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pr-1 ${
              expandOverlap ? 'max-h-80 overflow-y-auto custom-scrollbar' : ''
            }`}>
              {rivalOverlapProblems.map((group, idx) => {
                const style = rivalColors[idx % rivalColors.length];
                
                return (
                  <div key={group.handle} className="space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.stroke }} />
                      <span className="text-xs font-bold text-slate-300 font-mono">{group.handle}'s Solves</span>
                    </div>

                    <div className="space-y-1.5">
                      {(expandOverlap ? group.problems : group.problems.slice(0, 5)).map(p => (
                        <a
                          key={`${p.contestId}-${p.index}`}
                          href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-brand-border/40 hover:border-purple-500/30 transition-colors group"
                        >
                          <div className="min-w-0 w-2/3">
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                              {p.name}
                            </div>
                            <span className="text-[9px] font-mono text-slate-500">
                              {p.contestId}{p.index}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono font-bold text-amber-400">
                              {p.rating || 1000}
                            </span>
                            <ChevronRight size={10} className="text-slate-500 group-hover:text-white" />
                          </div>
                        </a>
                      ))}
                      {group.problems.length === 0 && (
                        <div className="py-6 text-center text-slate-500 text-xs italic bg-slate-950/25 border border-brand-border/20 rounded-lg">
                          No overlap gaps found!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {rivalOverlapProblems.some(g => g.problems.length > 5) && (
            <div className="flex justify-center mt-3 pt-1 border-t border-brand-border/10 no-print">
              <button
                onClick={() => setExpandOverlap(!expandOverlap)}
                className="px-3.5 py-1.5 text-[10px] font-bold font-mono tracking-wider text-amber-500 hover:text-white uppercase rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all duration-300 flex items-center gap-1 cursor-pointer"
              >
                {expandOverlap ? 'Show Less' : 'Show More'}
                {expandOverlap ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { Activity, Sliders, AlertCircle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export default function RatingGraph({
  userData,
  ratingHistory = [],
  isSynced,
  isDuelActive,
  rivalRatingHistory = []
}) {
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedRank, setSimulatedRank] = useState(500);
  const [simulatedAverageRating, setSimulatedAverageRating] = useState(1600);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showAllContests, setShowAllContests] = useState(false);

  // Best and worst ranks for highlights (Suggestion 7)
  const { bestRank, worstRank } = useMemo(() => {
    if (ratingHistory.length === 0) return { bestRank: null, worstRank: null };
    const ranks = ratingHistory.map(h => h.rank);
    return {
      bestRank: Math.min(...ranks),
      worstRank: Math.max(...ranks)
    };
  }, [ratingHistory]);

  const graphDimensions = { width: 800, height: 260 };
  const graphPadding = { top: 20, right: 20, bottom: 40, left: 50 };

  // 1. Compute rating boundaries across both users
  const graphMaxRatingVal = useMemo(() => {
    const primaryMax = ratingHistory.length > 0 
      ? Math.max(...ratingHistory.map(h => h.newRating)) 
      : 1500;
    const rivalMax = isDuelActive && rivalRatingHistory.length > 0 
      ? Math.max(...rivalRatingHistory.map(h => h.newRating)) 
      : 1500;
    return Math.max(primaryMax, rivalMax, 2400) + 200;
  }, [ratingHistory, rivalRatingHistory, isDuelActive]);

  const graphTimeRange = useMemo(() => {
    const times = [];
    if (ratingHistory.length > 0) {
      ratingHistory.forEach(h => times.push(h.ratingUpdateTimeSeconds));
    }
    if (isDuelActive && rivalRatingHistory.length > 0) {
      rivalRatingHistory.forEach(h => times.push(h.ratingUpdateTimeSeconds));
    }
    if (times.length === 0) {
      const now = Math.floor(Date.now() / 1000);
      return { min: now - 365 * 24 * 3600, max: now };
    }
    return { min: Math.min(...times), max: Math.max(...times) };
  }, [ratingHistory, rivalRatingHistory, isDuelActive]);

  // Map user coordinates
  const graphPoints = useMemo(() => {
    if (!isSynced || !ratingHistory.length) return [];
    
    const minRating = 1000;
    const minTime = graphTimeRange.min;
    const maxTime = graphTimeRange.max;
    
    const xSpan = maxTime - minTime || 1;
    const ySpan = graphMaxRatingVal - minRating || 1;

    return ratingHistory.map((item, idx) => {
      const x = graphPadding.left + ((item.ratingUpdateTimeSeconds - minTime) / xSpan) * (graphDimensions.width - graphPadding.left - graphPadding.right);
      const y = graphDimensions.height - graphPadding.bottom - ((item.newRating - minRating) / ySpan) * (graphDimensions.height - graphPadding.top - graphPadding.bottom);
      
      const prevRating = idx > 0 ? ratingHistory[idx - 1].newRating : 1200;
      const delta = item.newRating - prevRating;
      
      return {
        x,
        y,
        rating: item.newRating,
        contest: item.contestName,
        rank: item.rank,
        delta,
        date: new Date(item.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
      };
    });
  }, [ratingHistory, graphTimeRange, graphMaxRatingVal, isSynced]);

  // Map rival coordinates
  const rivalGraphPoints = useMemo(() => {
    if (!isDuelActive || !rivalRatingHistory.length) return [];
    
    const minRating = 1000;
    const minTime = graphTimeRange.min;
    const maxTime = graphTimeRange.max;
    
    const xSpan = maxTime - minTime || 1;
    const ySpan = graphMaxRatingVal - minRating || 1;

    return rivalRatingHistory.map((item, idx) => {
      const x = graphPadding.left + ((item.ratingUpdateTimeSeconds - minTime) / xSpan) * (graphDimensions.width - graphPadding.left - graphPadding.right);
      const y = graphDimensions.height - graphPadding.bottom - ((item.newRating - minRating) / ySpan) * (graphDimensions.height - graphPadding.top - graphPadding.bottom);
      
      const prevRating = idx > 0 ? rivalRatingHistory[idx - 1].newRating : 1200;
      const delta = item.newRating - prevRating;
      
      return {
        x,
        y,
        rating: item.newRating,
        contest: item.contestName,
        rank: item.rank,
        delta,
        date: new Date(item.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
      };
    });
  }, [rivalRatingHistory, graphTimeRange, graphMaxRatingVal, isDuelActive]);

  // 2. Linear rating simulator calculation
  const simulatedRatingStats = useMemo(() => {
    const currentRating = userData?.rating || 1200;
    const contestsCount = ratingHistory.length || 5;

    // Logarithmic delta estimation
    const expectedRank = simulatedAverageRating ? Math.round(3000 / (1 + Math.exp((currentRating - simulatedAverageRating) / 200))) : 1500;
    const delta = Math.round(Math.log(Math.max(1, expectedRank / simulatedRank)) * 220 / (1 + contestsCount / 10));

    return {
      expectedRank,
      delta,
      newRating: Math.max(100, currentRating + delta)
    };
  }, [simulatedRank, simulatedAverageRating, userData, ratingHistory]);

  // Map simulated next coordinate
  const simulatedGraphPoint = useMemo(() => {
    if (!showSimulator || graphPoints.length === 0) return null;
    
    const lastPoint = graphPoints[graphPoints.length - 1];
    const newRating = simulatedRatingStats.newRating;
    const minRating = 1000;
    const ySpan = graphMaxRatingVal - minRating || 1;

    const simulatedX = lastPoint.x + 35;
    const simulatedY = graphDimensions.height - graphPadding.bottom - ((newRating - minRating) / ySpan) * (graphDimensions.height - graphPadding.top - graphPadding.bottom);

    return {
      lastX: lastPoint.x,
      lastY: lastPoint.y,
      x: simulatedX,
      y: simulatedY
    };
  }, [showSimulator, graphPoints, simulatedRatingStats, graphMaxRatingVal]);

  // 3. Rating Predictor (Weighted Moving average of last 5 contests)
  const predictedNextRating = useMemo(() => {
    if (ratingHistory.length === 0) return null;
    const lastContests = ratingHistory.slice(-5);
    let totalWeight = 0;
    let weightedSum = 0;
    
    lastContests.forEach((c, idx) => {
      const weight = idx + 1; // More weight on recent contests
      weightedSum += c.newRating * weight;
      totalWeight += weight;
    });

    const predicted = Math.round(weightedSum / totalWeight);
    const lastRating = ratingHistory[ratingHistory.length - 1].newRating;
    const delta = predicted - lastRating;

    return { predicted, delta };
  }, [ratingHistory]);

  const handleMouseMove = (e, index, item) => {
    const rect = e.target.getBoundingClientRect();
    const svgParent = e.target.ownerSVGElement.getBoundingClientRect();
    setHoveredNode({
      index,
      x: rect.left - svgParent.left + rect.width / 2,
      y: rect.top - svgParent.top,
      ...item
    });
  };

  const rankBands = [
    { name: "LGM / GM", limit: 2400, fill: "rgba(239, 68, 68, 0.03)", y: graphPadding.top, height: 40 },
    { name: "Master", limit: 2100, fill: "rgba(245, 158, 11, 0.03)", y: graphPadding.top + 40, height: 40 },
    { name: "Candidate Master", limit: 1900, fill: "rgba(168, 85, 247, 0.03)", y: graphPadding.top + 80, height: 35 },
    { name: "Expert", limit: 1600, fill: "rgba(59, 130, 246, 0.03)", y: graphPadding.top + 115, height: 45 },
    { name: "Specialist", limit: 1400, fill: "rgba(6, 182, 212, 0.03)", y: graphPadding.top + 160, height: 30 },
    { name: "Pupil / Newbie", limit: 0, fill: "rgba(16, 185, 129, 0.02)", y: graphPadding.top + 190, height: 30 }
  ];

  return (
    <div className="xl:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-4 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="text-purple-400 shrink-0" size={18} />
          <h4 className="text-sm font-semibold text-slate-400 font-sans tracking-wide">Rating Progression History</h4>
        </div>
        
        <div className="flex items-center gap-2 no-print">
          {isDuelActive && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-bold font-mono uppercase">
              Duel Mode Active
            </span>
          )}
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`flex items-center gap-1 px-3 py-1.5 border rounded-xl text-xs font-semibold font-mono transition cursor-pointer active:scale-95 ${
              showSimulator 
                ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-brand-border text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders size={12} />
            Simulate
          </button>
        </div>
      </div>
      
      <div className="relative w-full overflow-x-auto custom-scrollbar">
        {/* Floating Tooltip */}
        {hoveredNode && (
          <div
            className="absolute z-30 p-3 rounded-lg bg-slate-950 border border-purple-500/30 text-xs shadow-xl w-60 pointer-events-none"
            style={{
              left: hoveredNode.x - 120,
              top: Math.max(10, hoveredNode.y - 105),
            }}
          >
            <div className="flex items-center gap-1.5 mb-1 font-semibold text-purple-400 truncate">
              {hoveredNode.isRival ? (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] uppercase font-bold">RIVAL</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[9px] uppercase font-bold">YOU</span>
              )}
              <span className="truncate">{hoveredNode.contest}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2 font-mono text-[11px] text-slate-300">
              <div>Rank: <span className="font-bold text-slate-100">{hoveredNode.rank}</span></div>
              <div>Rating: <span className="font-bold text-slate-100">{hoveredNode.rating}</span></div>
              <div>Delta: <span className={`font-bold ${hoveredNode.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hoveredNode.delta >= 0 ? `+${hoveredNode.delta}` : hoveredNode.delta}
              </span></div>
              <div>Date: <span className="text-slate-400">{hoveredNode.date}</span></div>
            </div>
          </div>
        )}

        {/* SVG Graph */}
        <svg
          width={graphDimensions.width}
          height={graphDimensions.height}
          className="mx-auto"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Draw Background Rank Bands */}
          {rankBands.map((band, idx) => (
            <rect
              key={idx}
              x={graphPadding.left}
              y={band.y}
              width={graphDimensions.width - graphPadding.left - graphPadding.right}
              height={band.height}
              fill={band.fill}
            />
          ))}

          {/* Draw grid lines */}
          {rankBands.map((band, idx) => {
            if (idx === 0) return null;
            return (
              <line
                key={idx}
                x1={graphPadding.left}
                y1={band.y}
                x2={graphDimensions.width - graphPadding.right}
                y2={band.y}
                stroke="var(--chart-grid)"
                strokeDasharray="4"
              />
            );
          })}

          {/* User Line Path */}
          {graphPoints.length > 1 && (
            <path
              d={graphPoints.reduce((acc, p, idx) => {
                return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
              }, "")}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="2.5"
              filter="url(#glow)"
            />
          )}

          {/* Rival Line Path */}
          {isDuelActive && rivalGraphPoints.length > 1 && (
            <path
              d={rivalGraphPoints.reduce((acc, p, idx) => {
                return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
              }, "")}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              filter="url(#glow)"
            />
          )}

          {/* Simulated Dashed line */}
          {showSimulator && simulatedGraphPoint && (
            <line
              x1={simulatedGraphPoint.lastX}
              y1={simulatedGraphPoint.lastY}
              x2={simulatedGraphPoint.x}
              y2={simulatedGraphPoint.y}
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="4, 4"
              filter="url(#glow)"
            />
          )}

          {/* User Points */}
          {graphPoints.map((p, idx) => (
            <circle
              key={`prim-${idx}`}
              cx={p.x}
              cy={p.y}
              r={hoveredNode?.index === idx && hoveredNode?.user === 'primary' ? 5.5 : 3}
              fill={hoveredNode?.index === idx && hoveredNode?.user === 'primary' ? "#22d3ee" : "#a855f7"}
              stroke="#0b0713"
              strokeWidth="1.5"
              className="cursor-pointer"
              onMouseEnter={(e) => handleMouseMove(e, idx, { ...p, user: 'primary' })}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}

          {/* Rival Points */}
          {isDuelActive && rivalGraphPoints.map((p, idx) => (
            <circle
              key={`rival-${idx}`}
              cx={p.x}
              cy={p.y}
              r={hoveredNode?.index === idx && hoveredNode?.user === 'rival' ? 5.5 : 3}
              fill={hoveredNode?.index === idx && hoveredNode?.user === 'rival' ? "#f59e0b" : "#d97706"}
              stroke="#0b0713"
              strokeWidth="1.5"
              className="cursor-pointer"
              onMouseEnter={(e) => handleMouseMove(e, idx, { ...p, user: 'rival', isRival: true })}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}

          {/* Simulated node */}
          {showSimulator && simulatedGraphPoint && (
            <circle
              cx={simulatedGraphPoint.x}
              cy={simulatedGraphPoint.y}
              r={5}
              fill="#10b981"
              stroke="#0b0713"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>

      {/* Simulator Inputs & Predictor Details */}
      {showSimulator && (
        <div className="p-5 bg-slate-950/40 border border-brand-border/40 rounded-xl space-y-4 animate-slideDown no-print">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
            <Sliders className="text-emerald-400" size={16} />
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Virtual Contest Simulator</h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between font-semibold">
                <span>Simulated Rank in Contest:</span>
                <span className="text-emerald-400 font-bold">{simulatedRank}</span>
              </div>
              <input
                type="range"
                min="1"
                max="3000"
                value={simulatedRank}
                onChange={(e) => setSimulatedRank(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 (Winner)</span>
                <span>1500 (Mid)</span>
                <span>3000 (Last)</span>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between font-semibold">
                <span>Contest Average Rating:</span>
                <span className="text-cyan-400 font-bold">{simulatedAverageRating}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="2800"
                value={simulatedAverageRating}
                onChange={(e) => setSimulatedAverageRating(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1000 (Div. 4/3)</span>
                <span>1600 (Div. 2)</span>
                <span>2400 (Div. 1)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950/60 border border-brand-border/20 rounded-lg text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Expected Rank</span>
              <strong className="text-sm text-slate-200">{simulatedRatingStats.expectedRank}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Predicted Delta</span>
              <strong className={`text-base ${simulatedRatingStats.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simulatedRatingStats.delta >= 0 ? `+${simulatedRatingStats.delta}` : simulatedRatingStats.delta}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Simulated Rating</span>
              <strong className="text-base text-white">{simulatedRatingStats.newRating}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Rating Trend & Predictor (Always Visible) */}
      {isSynced && predictedNextRating && (
        <div className="p-4 bg-purple-950/5 border border-purple-500/20 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-purple-400 shrink-0" size={16} />
            <div>
              <span className="text-slate-400 block">Performance Trend Rating Predictor</span>
              <span className="text-[10px] text-slate-500">Weighted average prediction based on recent contests</span>
            </div>
          </div>
          <div className="text-right">
            <strong className="text-sm text-white block">~{predictedNextRating.predicted}</strong>
            <span className={`text-[10px] font-bold ${predictedNextRating.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {predictedNextRating.delta >= 0 ? `+${predictedNextRating.delta}` : predictedNextRating.delta} next round
            </span>
          </div>
        </div>
      )}

      {/* Contest History Table (Suggestion 7) */}
      {isSynced && ratingHistory.length > 0 && (
        <div className="space-y-3 border-t border-brand-border/20 pt-4 mt-2">
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Contest History & Performance
            </h5>
            <span className="text-[10px] text-slate-500 font-mono">
              Showing last {showAllContests ? ratingHistory.length : 5} contests
            </span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-brand-border/20 text-[10px] uppercase tracking-wider">
                  <th className="py-2 pr-4 font-sans font-semibold">Contest</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-right">Rank</th>
                  <th className="py-2 px-3 text-right">Rating</th>
                  <th className="py-2 pl-4 text-right">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {(showAllContests ? [...ratingHistory].reverse() : [...ratingHistory].reverse().slice(0, 5)).map((item, idx) => {
                  const prevRating = ratingHistory[ratingHistory.length - 1 - idx - 1]?.newRating || item.oldRating;
                  const delta = item.newRating - prevRating;
                  const isBest = item.rank === bestRank;
                  const isWorst = item.rank === worstRank;
                  
                  return (
                    <tr key={item.contestId} className="hover:bg-slate-950/20 transition-colors">
                      <td className="py-2.5 pr-4 text-slate-300 font-sans font-medium truncate max-w-[240px]" title={item.contestName}>
                        {item.contestName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {new Date(item.ratingUpdateTimeSeconds * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-200">
                        <span className={`font-bold ${
                          isBest 
                            ? 'text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                            : isWorst 
                            ? 'text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20' 
                            : ''
                        }`} title={isBest ? "Best Rank Highlight" : isWorst ? "Worst Rank Highlight" : ""}>
                          #{item.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-white font-bold">
                        {item.newRating}
                      </td>
                      <td className="py-2.5 pl-4 text-right">
                        <span className={`inline-block px-1.5 py-0.5 rounded font-bold ${
                          delta >= 0 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                        }`}>
                          {delta >= 0 ? `+${delta}` : delta}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {ratingHistory.length > 5 && (
            <div className="flex justify-center mt-2 no-print">
              <button
                onClick={() => setShowAllContests(!showAllContests)}
                className="px-3 py-1.5 text-[10px] font-bold font-mono tracking-wider text-purple-400 hover:text-white uppercase rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-1 cursor-pointer"
              >
                {showAllContests ? 'Show Less' : 'Show All'}
                {showAllContests ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

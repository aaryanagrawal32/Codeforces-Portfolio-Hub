import React, { useMemo, useState } from 'react';
import { Activity, Download, Layers } from 'lucide-react';

export default function ContestHeatmap({ submissions, isSynced }) {
  const [activeBreakdownTag, setActiveBreakdownTag] = useState('All');
  const tagsList = ["dp", "graphs", "math", "binary search", "greedy", "data structures", "strings", "two pointers", "sortings", "number theory", "bitmasks", "constructive algorithms"];

  // 1. Calculate Heatmap Data
  const { heatmapData, monthLabels, totalActiveDays, maxStreak } = useMemo(() => {
    if (!isSynced || !submissions) {
      return { heatmapData: [], monthLabels: [], totalActiveDays: 0, maxStreak: 0 };
    }

    const counts = {};
    submissions.forEach(sub => {
      if (sub.verdict === "OK") {
        const date = new Date(sub.creationTimeSeconds * 1000);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    const data = [];
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Start at Sunday
    const startDay = oneYearAgo.getDay();
    const startDate = new Date(oneYearAgo);
    startDate.setDate(oneYearAgo.getDate() - startDay);

    const dateCursor = new Date(startDate);
    let totalActiveDays = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    while (dateCursor <= today) {
      const yyyy = dateCursor.getFullYear();
      const mm = String(dateCursor.getMonth() + 1).padStart(2, '0');
      const dd = String(dateCursor.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      const count = counts[key] || 0;

      if (count > 0) {
        totalActiveDays++;
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }

      data.push({
        dateStr: key,
        count,
        dayOfWeek: dateCursor.getDay(),
        month: dateCursor.getMonth()
      });
      
      dateCursor.setDate(dateCursor.getDate() + 1);
    }

    // Month Labels
    const labels = [];
    let prevMonth = -1;
    data.forEach((day, index) => {
      const colIndex = Math.floor(index / 7);
      const row = index % 7;
      if (row === 0 && day.month !== prevMonth) {
        labels.push({ colIndex, name: new Date(2020, day.month).toLocaleString('default', { month: 'short' }) });
        prevMonth = day.month;
      }
    });

    return { heatmapData: data, monthLabels: labels, totalActiveDays, maxStreak };
  }, [submissions, isSynced]);

  // 2. Month-over-month stacked breakdown per topic
  const monthTopicBreakdown = useMemo(() => {
    if (!isSynced || !submissions) return [];

    const monthData = {};
    const last6Months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      last6Months.push({ label, month: d.getMonth(), year: d.getFullYear(), tags: {} });
    }

    submissions.forEach(sub => {
      if (sub.verdict === "OK" && sub.problem && sub.problem.tags) {
        const date = new Date(sub.creationTimeSeconds * 1000);
        const m = date.getMonth();
        const y = date.getFullYear();

        const activeMonth = last6Months.find(lm => lm.month === m && lm.year === y);
        if (activeMonth) {
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

              if (matches) {
                activeMonth.tags[tKey] = (activeMonth.tags[tKey] || 0) + 1;
              }
            });
          });
        }
      }
    });

    return last6Months;
  }, [submissions, isSynced]);

  // 3. Export SVG to PNG
  const handleExportPNG = () => {
    const svgElement = document.getElementById('heatmap-svg-element');
    if (!svgElement) return;

    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 820;
        canvas.height = 145;
        const context = canvas.getContext('2d');
        
        // Fill dark background for screenshot export
        context.fillStyle = '#0b0713';
        context.fillRect(0, 0, 820, 145);

        context.drawImage(image, 0, 0);
        const png = canvas.toDataURL('image/png');
        
        const downloadLink = document.createElement('a');
        downloadLink.href = png;
        downloadLink.download = 'codeforces_activity_heatmap.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobURL);
      };
      image.src = blobURL;
    } catch (e) {
      console.error("Export PNG failed", e);
    }
  };

  const tagColors = {
    "dp": "bg-purple-500",
    "graphs": "bg-emerald-500",
    "math": "bg-amber-500",
    "binary search": "bg-blue-500",
    "greedy": "bg-cyan-500",
    "data structures": "bg-rose-500",
    "strings": "bg-indigo-500",
    "two pointers": "bg-pink-500",
    "sortings": "bg-teal-500",
    "number theory": "bg-violet-500",
    "bitmasks": "bg-yellow-500",
    "constructive algorithms": "bg-orange-500"
  };

  return (
    <div className="xl:col-span-3 p-6 rounded-2xl glass-card flex flex-col gap-6 overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="text-cyan-400 shrink-0" size={18} />
          <h4 className="text-sm font-bold font-mono tracking-wider text-cyan-400 uppercase">Submission Calendar</h4>
        </div>
        <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-3">
          <span>Total active days: <strong className="text-white font-bold text-sm">{totalActiveDays}</strong></span>
          <span className="text-purple-600/60">•</span>
          <span>Max streak: <strong className="text-white font-bold text-sm">{maxStreak}</strong></span>
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-brand-border text-[10px] text-slate-300 hover:text-white rounded-md transition-colors cursor-pointer no-print ml-2"
          >
            <Download size={11} />
            Export PNG
          </button>
        </div>
      </div>

      {/* SVG Heatmap Container */}
      <div className="overflow-x-auto custom-scrollbar pb-2 bg-slate-950/40 border border-brand-border/40 p-5 rounded-xl flex justify-center">
        <svg id="heatmap-svg-element" width="800" height="135" className="select-none text-[8px] font-mono fill-slate-500">
          {/* Months labels */}
          {monthLabels.map((m, idx) => (
            <text key={idx} x={m.colIndex * 13.5 + 40} y="15" className="fill-slate-500">
              {m.name}
            </text>
          ))}

          {/* Days of week labels */}
          <text x="5" y="38" className="fill-slate-500">Sun</text>
          <text x="5" y="62" className="fill-slate-500">Tue</text>
          <text x="5" y="86" className="fill-slate-500">Thu</text>
          <text x="5" y="110" className="fill-slate-500">Sat</text>

          {/* Heatmap Dots */}
          {heatmapData.map((day, idx) => {
            const col = Math.floor(idx / 7);
            const row = idx % 7;
            const cx = col * 13.5 + 40;
            const cy = row * 12 + 32;

            let fill = 'var(--heatmap-empty-fill)';
            let stroke = 'var(--heatmap-empty-stroke)';
            let filter = '';
            
            if (day.count > 0 && day.count <= 1) {
              fill = '#043627'; stroke = '#084b37';
            } else if (day.count > 1 && day.count <= 3) {
              fill = '#0b664a'; stroke = 'none';
            } else if (day.count > 3 && day.count <= 6) {
              fill = '#10b981'; stroke = 'none';
            } else if (day.count > 6) {
              fill = '#22d3ee'; stroke = 'none';
            }

            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="4.8"
                fill={fill}
                stroke={stroke}
                strokeWidth="0.8"
                className="transition duration-150 cursor-pointer hover:r-[6]"
              >
                <title>{`${day.dateStr}: ${day.count} solves`}</title>
              </circle>
            );
          })}
        </svg>
      </div>

      {/* Heatmap Legend */}
      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1">
        <span className="no-print">Hover dots to view submission details.</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--heatmap-empty-fill)] border border-[var(--heatmap-empty-stroke)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#043627] border border-[#084b37]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#0b664a]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#22d3ee]"></div>
          <span>More</span>
        </div>
      </div>

      {/* Stacked Month-Over-Month Topic Breakdown */}
      {isSynced && (
        <div className="border-t border-brand-border/40 pt-5 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="text-purple-400 shrink-0" size={16} />
            <h5 className="text-xs font-bold text-slate-400 font-sans tracking-wide">
              Timeline: Monthly Topic Solves Distribution
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 font-mono text-xs">
            {monthTopicBreakdown.map((m, idx) => {
              const totalMonthSolves = Object.values(m.tags).reduce((a, b) => a + b, 0);
              
              return (
                <div key={idx} className="p-3 bg-slate-950/40 border border-brand-border/30 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                    <span className="font-bold text-slate-200">{m.label}</span>
                    <span className="text-[10px] text-slate-400">{totalMonthSolves} Solves</span>
                  </div>

                  <div className="h-6 w-full bg-slate-900 rounded overflow-hidden flex">
                    {totalMonthSolves > 0 ? (
                      Object.entries(m.tags).map(([tag, count]) => {
                        const pct = (count / totalMonthSolves) * 100;
                        const color = tagColors[tag] || 'bg-slate-500';
                        return (
                          <div
                            key={tag}
                            className={`h-full ${color}`}
                            style={{ width: `${pct}%` }}
                            title={`${tag.toUpperCase()}: ${count} solves (${Math.round(pct)}%)`}
                          />
                        );
                      })
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center text-[9px] text-slate-600">
                        NO ACTIVITY
                      </div>
                    )}
                  </div>

                  {totalMonthSolves > 0 && (
                    <div className="text-[9px] text-slate-500 truncate max-w-full">
                      Top: {
                        Object.entries(m.tags)
                          .sort((a, b) => b[1] - a[1])[0]?.[0]
                          ?.toUpperCase() || '—'
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

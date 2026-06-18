import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Hash, ArrowUpRight, Copy, Check, Search, AlertTriangle, Layers, Edit3, Printer } from 'lucide-react';
import CodeBlock from './Shared/CodeBlock';
import { stlData } from '../data/stlData';

export default function CoreConcepts({
  tagKey,
  tagData,
  isSynced,
  submissions
}) {
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
  const [selectedStl, setSelectedStl] = useState('vector');
  const [stlSearch, setStlSearch] = useState('');
  const [copiedMethodIdx, setCopiedMethodIdx] = useState(null);
  
  // Local storage personal study notes
  const [personalNotes, setPersonalNotes] = useState('');

  // Load notes from localStorage when tagKey changes
  useEffect(() => {
    const saved = localStorage.getItem(`cf_notes_${tagKey}`);
    setPersonalNotes(saved || '');
    setActiveTemplateIdx(0);
  }, [tagKey]);

  const handleNotesChange = (e) => {
    setPersonalNotes(e.target.value);
    localStorage.setItem(`cf_notes_${tagKey}`, e.target.value);
  };

  // Trigger Print Cheat Sheet (CF Codesheet)
  const handlePrintCodesheet = () => {
    window.print();
  };

  // Count unique solved problems on Codeforces for this tag
  const actualSolvedCount = useMemo(() => {
    if (!isSynced) return 0;
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
  }, [submissions, isSynced, tagKey]);

  // Complexity Gauge colors selector
  const getGaugeColor = (val) => {
    if (val <= 25) return "#10b981"; // Green: O(1), O(log N)
    if (val <= 45) return "#0d9488"; // Teal: O(N)
    if (val <= 60) return "#06b6d4"; // Cyan: O(N log N)
    if (val <= 75) return "#f59e0b"; // Amber: O(N^2)
    return "#f43f5e"; // Rose: O(2^N), O(N!)
  };

  const getGaugeTrailColor = (val) => {
    if (val <= 25) return "rgba(16, 185, 129, 0.08)";
    if (val <= 45) return "rgba(13, 148, 136, 0.08)";
    if (val <= 60) return "rgba(6, 182, 212, 0.08)";
    if (val <= 75) return "rgba(245, 158, 11, 0.08)";
    return "rgba(244, 63, 94, 0.08)";
  };

  // Rule keyword highlighters
  const highlightKeywords = (text, keywords) => {
    if (!text) return "";
    let highlighted = text;
    const sortedKws = [...keywords].sort((a, b) => b.length - a.length);
    sortedKws.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="text-cyan-400 font-bold text-glow-cyan">$1</span>');
    });
    return highlighted;
  };

  // STL Method filters
  const stlInfo = stlData[selectedStl];
  const filteredStlMethods = useMemo(() => {
    if (!stlInfo) return [];
    return stlInfo.methods.filter(m =>
      m.signature.toLowerCase().includes(stlSearch.toLowerCase()) ||
      m.desc.toLowerCase().includes(stlSearch.toLowerCase())
    );
  }, [stlInfo, stlSearch]);

  const handleCopyMethod = (example, idx) => {
    navigator.clipboard.writeText(example);
    setCopiedMethodIdx(idx);
    setTimeout(() => setCopiedMethodIdx(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* A. Tag Header Banner */}
      <div className="p-6 rounded-2xl glass-card relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-brand-border text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            {tagData.category}
          </span>
          <h2 className="text-3xl font-bold font-sans text-white tracking-wide mt-2">
            {tagData.name} Workspace
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Print Codesheet Button */}
          <button
            onClick={handlePrintCodesheet}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-brand-border text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer no-print"
            title="Print Workspace Codesheet"
          >
            <Printer size={13} />
            Print Codesheet
          </button>

          {isSynced && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border bg-slate-950/60 font-mono text-xs text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-glow-indicator"></span>
              <span className="font-bold text-emerald-400">{actualSolvedCount} Solved on Codeforces</span>
            </div>
          )}
        </div>
      </div>

      {/* B. Identification Rules & Keyword Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Card (2/3 width) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-4">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <BookOpen size={16} className="text-purple-400" />
            Identification Guide
          </h3>
          <div className="space-y-3 font-sans text-sm text-slate-300">
            {tagData.rules.map((rule, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-slate-950/30 border border-brand-border/40 leading-relaxed">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: highlightKeywords(rule, tagData.keywords) }} />
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Cloud Card (1/3 width) */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-4">
          <h3 className="text-base font-semibold text-slate-200">Trigger Words</h3>
          <p className="text-xs text-slate-500 leading-normal">
            Look for these terms in problems to identify if this strategy applies.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {tagData.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1.5 bg-slate-900/60 border border-brand-border/60 rounded-xl text-xs font-mono font-bold text-slate-400 cursor-default hover:text-white hover:border-purple-500/30 transition-all duration-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* C. Complexity Speedometers & Personal notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Complexity Gauge */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-3 items-center justify-center relative overflow-hidden">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono self-start">Time Complexity</h4>
          <div className="relative w-36 h-36 flex items-center justify-center mt-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke={getGaugeTrailColor(tagData.timeProgress)} strokeWidth="5" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={getGaugeColor(tagData.timeProgress)}
                strokeWidth="5.5"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 - (tagData.timeProgress / 100) * 2 * Math.PI * 40}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-sans">Upper bound</span>
              <span className="text-base font-bold font-mono text-white mt-0.5 select-all">{tagData.timeComplexity}</span>
            </div>
          </div>
          <span className="text-[10.5px] text-slate-400 font-mono italic text-center mt-1 leading-normal">{tagData.timeLabel}</span>
        </div>

        {/* Space Complexity Gauge */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-3 items-center justify-center relative overflow-hidden">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono self-start">Space Complexity</h4>
          <div className="relative w-36 h-36 flex items-center justify-center mt-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke={getGaugeTrailColor(tagData.spaceProgress)} strokeWidth="5" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={getGaugeColor(tagData.spaceProgress)}
                strokeWidth="5.5"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 - (tagData.spaceProgress / 100) * 2 * Math.PI * 40}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-sans">State Aux</span>
              <span className="text-base font-bold font-mono text-white mt-0.5 select-all">{tagData.spaceComplexity}</span>
            </div>
          </div>
          <span className="text-[10.5px] text-slate-400 font-mono italic text-center mt-1 leading-normal">{tagData.spaceLabel}</span>
        </div>

        {/* Personal Study Notes Panel */}
        <div className="p-5 rounded-2xl glass-card flex flex-col gap-3 relative overflow-hidden">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Edit3 size={12} className="text-purple-400 no-print" />
            Study Notes &amp; Insights
          </h4>
          <p className="text-[10px] text-slate-500 leading-normal no-print">
            Jot down key equations, tips, or review strategies. Saved automatically.
          </p>
          <textarea
            placeholder="Write personal equations, pointers, or edge cases here..."
            value={personalNotes}
            onChange={handleNotesChange}
            className="flex-1 w-full p-3 bg-slate-950/60 border border-brand-border rounded-xl text-xs text-slate-300 font-sans focus:outline-none focus:border-purple-500/60 min-h-[100px] resize-none no-print"
          />
          {/* Print-only notes display */}
          <div className="hidden print:block text-xs text-slate-800 font-sans whitespace-pre-wrap border border-slate-300 p-4 rounded-xl bg-slate-50 mt-1">
            {personalNotes || "No personal study notes added yet."}
          </div>
        </div>
      </div>

      {/* D. Code Templates & STL Container Helper */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Template Code Viewer (2/3 width) */}
        <div className="xl:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/20 pb-4">
            <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" />
              Standard C++ Implementation Code Templates
            </h3>
            
            {/* Horizontal switchers */}
            <div className="flex flex-wrap gap-1.5 no-print">
              {tagData.templates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTemplateIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    activeTemplateIdx === idx
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Screen-only active template viewer */}
          <div className="relative no-print">
            {tagData.templates[activeTemplateIdx] ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500 px-1">
                  <span>TEMPLATE: {tagData.templates[activeTemplateIdx].name.toUpperCase()}</span>
                  <span>C++17 • Standard Input Stream</span>
                </div>
                <CodeBlock code={tagData.templates[activeTemplateIdx].code} maxLinesHeight="max-h-[380px]" />
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 italic">No code templates uploaded for this strategy.</div>
            )}
          </div>

          {/* Print-only list of all templates sequentially */}
          <div className="hidden print:block space-y-6">
            {tagData.templates && tagData.templates.length > 0 ? (
              tagData.templates.map((tpl, idx) => (
                <div key={idx} className="space-y-2 page-break-inside-avoid">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-600 px-1 border-b border-slate-300 pb-1">
                    <span className="font-bold text-slate-700">TEMPLATE {idx + 1}: {tpl.name.toUpperCase()}</span>
                    <span>C++17 • Standard Input Stream</span>
                  </div>
                  <CodeBlock code={tpl.code} maxLinesHeight="max-h-none" />
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-500 italic">No code templates uploaded for this strategy.</div>
            )}
          </div>
        </div>

        {/* STL Container Helper (1/3 width) */}
        <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 no-print">
          <div>
            <h3 className="text-base font-semibold text-slate-200">STL Container Method Finder</h3>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Quickly look up parameters and time complexities of standard C++ containers.
            </p>
          </div>

          {/* Search STL parameters */}
          <div className="flex gap-2">
            <select
              value={selectedStl}
              onChange={(e) => setSelectedStl(e.target.value)}
              className="bg-slate-900 border border-brand-border text-xs text-slate-200 rounded-lg p-2 focus:outline-none focus:border-purple-500 shrink-0 font-mono"
            >
              {Object.keys(stlData).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 text-slate-500" size={13} />
              <input
                type="text"
                placeholder="Search methods..."
                value={stlSearch}
                onChange={(e) => setStlSearch(e.target.value)}
                className="pl-8 pr-2 py-2 bg-slate-950/80 border border-brand-border rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-full font-sans"
              />
            </div>
          </div>

          {/* Container info overview */}
          {stlInfo && (
            <div className="p-3 bg-slate-950/40 border border-brand-border/40 rounded-xl space-y-2 text-xs font-sans">
              <div className="flex justify-between items-center font-mono">
                <span className="text-purple-400 font-bold">{stlInfo.include}</span>
                <span className="text-slate-500">Space: {stlInfo.spaceComplexity}</span>
              </div>
              <p className="text-slate-400 leading-normal text-[11.5px]">{stlInfo.description}</p>
              
              {/* Complexities table */}
              <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-1.5 font-mono text-[10.5px]">
                {Object.entries(stlInfo.complexities).map(([op, comp]) => (
                  <div key={op} className="flex flex-col">
                    <span className="text-slate-500 truncate">{op}</span>
                    <span className="text-cyan-400 font-semibold">{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Container scrollable methods list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-76 pr-1 space-y-2">
            {filteredStlMethods.map((m, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 border border-brand-border/30 rounded-xl flex flex-col gap-1.5 hover:border-purple-500/20 transition relative group">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-200 truncate pr-1" title={m.signature}>
                    {m.signature}
                  </span>
                  <button
                    onClick={() => handleCopyMethod(m.example, idx)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer active:scale-90"
                    title="Copy Syntax Example"
                  >
                    {copiedMethodIdx === idx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-normal">{m.desc}</p>
                <pre className="p-2 rounded bg-slate-950 border border-brand-border/10 font-mono text-[10.5px] text-emerald-400 overflow-x-auto select-all whitespace-pre-wrap leading-tight">
                  {m.example}
                </pre>
              </div>
            ))}

            {filteredStlMethods.length === 0 && (
              <div className="py-6 text-center text-slate-500 text-xs font-sans">
                No matching methods found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* E. Common Edge Cases & Pitfalls */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Edge Cases &amp; Algorithmic Pitfalls</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tagData.edgeCases.map((ec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-rose-950/5 border border-rose-950/20 shadow-md shadow-rose-950/2 flex flex-col gap-2.5 relative hover:border-rose-500/20 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 text-rose-500/80">
                <AlertTriangle size={18} />
              </div>
              <h4 className="text-sm font-bold font-sans text-rose-300/90 tracking-wide pr-6">
                {ec.title}
              </h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {ec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

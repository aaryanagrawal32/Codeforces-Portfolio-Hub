import React, { useState } from 'react';
import { User, Shield, Users, Building, Copy, FileText, Check, Award } from 'lucide-react';

export default function StatsCard({ userData, solvedCountByTag, totalSolved }) {
  const [copied, setCopied] = useState(false);

  const getRankColorClass = (rank = "") => {
    const r = (rank || "").toLowerCase();
    if (r.includes("legendary") || r.includes("grandmaster")) return "text-rose-600 dark:text-rose-500";
    if (r.includes("international master") || r.includes("master")) return "text-amber-700 dark:text-amber-500";
    if (r.includes("candidate master")) return "text-purple-600 dark:text-purple-400";
    if (r.includes("expert")) return "text-blue-600 dark:text-blue-400";
    if (r.includes("specialist")) return "text-cyan-600 dark:text-cyan-400";
    if (r.includes("pupil")) return "text-emerald-600 dark:text-emerald-400";
    return "text-slate-600 dark:text-slate-400";
  };

  const getRankBorderClass = (rank = "") => {
    const r = (rank || "").toLowerCase();
    if (r.includes("legendary") || r.includes("grandmaster")) return "border-rose-500/30 shadow-rose-500/5";
    if (r.includes("international master") || r.includes("master")) return "border-amber-500/30 shadow-amber-500/5";
    if (r.includes("candidate master")) return "border-purple-500/30 shadow-purple-500/5";
    if (r.includes("expert")) return "border-blue-500/30 shadow-blue-500/5";
    if (r.includes("specialist")) return "border-cyan-500/30 shadow-cyan-500/5";
    if (r.includes("pupil")) return "border-emerald-500/30 shadow-emerald-500/5";
    return "border-slate-500/30 shadow-slate-500/5";
  };

  const handleCopyStats = () => {
    const text = `Codeforces Profile Snapshot:
Handle: ${userData?.handle || 'N/A'}
Current Rank: ${userData?.rank || 'Unrated'} (${userData?.rating || 0})
Max Rank: ${userData?.maxRank || 'N/A'} (${userData?.maxRating || 0})
Total Solved Problems: ${totalSolved}
Workspaces Cleared: ${Object.entries(solvedCountByTag).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(', ')}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 rounded-2xl glass-card flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-bl-full z-0 pointer-events-none" />

      {/* User Info Card Header */}
      <div className="flex flex-col gap-4 z-10">
        <div className="flex items-center gap-4">
          {userData?.titlePhoto || userData?.avatar ? (
            <img
              src={userData.titlePhoto || userData.avatar}
              alt={userData?.handle || 'Avatar'}
              className="w-14 h-14 rounded-xl border border-purple-500/30 object-cover shadow-md shrink-0"
            />
          ) : (
            <div className="p-3 rounded-xl bg-purple-600/15 border border-purple-500/20 text-purple-400 shrink-0">
              <User size={20} />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">CF Candidate</h4>
            <h2 className="text-xl font-black text-white tracking-wide truncate">
              {userData?.handle || 'Aaryanagrawal32'}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-1 no-print">
          <button
            onClick={handleCopyStats}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 border border-brand-border hover:border-purple-500/50 text-[11px] font-bold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy Stats'}
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 border border-brand-border hover:border-purple-500/50 text-[11px] font-bold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <FileText size={12} />
            Export Portfolio
          </button>
        </div>

        {/* Detailed Stats Block */}
        <div className="p-4 bg-slate-900/40 dark:bg-slate-950/40 border border-brand-border/40 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-500 font-sans">Current Rank</span>
            <span className={`font-bold capitalize ${getRankColorClass(userData?.rank)}`}>
              {userData?.rank || 'Unrated'}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-t border-slate-900">
            <span className="text-slate-500 font-sans">Active Rating</span>
            <span className="text-white font-bold">{userData?.rating || 0}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-t border-slate-900">
            <span className="text-slate-500 font-sans">Max Rating Peak</span>
            <span className="text-slate-300 font-bold">{userData?.maxRating || 0}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-t border-slate-900">
            <span className="text-slate-500 font-sans">Total AC Solves</span>
            <span className="text-emerald-400 font-bold">{totalSolved}</span>
          </div>
        </div>

        {/* Meta details */}
        <div className="space-y-2.5 font-sans text-xs text-slate-400 pt-2 border-t border-slate-900">
          {userData?.organization && (
            <div className="flex items-center gap-2.5">
              <Building size={14} className="text-slate-500 shrink-0" />
              <span className="truncate">{userData.organization}</span>
            </div>
          )}
          {userData?.country && (
            <div className="flex items-center gap-2.5">
              <Shield size={14} className="text-slate-500 shrink-0" />
              <span className="truncate">{userData.country}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <Users size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">Active Candidate status</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function SkeletonCard({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'stats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl border border-brand-border/40 bg-slate-950/25 space-y-4">
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-8 bg-slate-800 rounded w-1/2"></div>
                <div className="h-3 bg-slate-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        );
      case 'graph':
        return (
          <div className="p-6 rounded-2xl border border-brand-border/40 bg-slate-950/25 space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-6 bg-slate-800 rounded w-1/4"></div>
              <div className="h-4 bg-slate-800 rounded w-1/6"></div>
            </div>
            <div className="h-64 bg-slate-900/40 rounded-xl flex items-end p-4 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-t w-full" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
              ))}
            </div>
          </div>
        );
      case 'heatmap':
        return (
          <div className="p-6 rounded-2xl border border-brand-border/40 bg-slate-950/25 space-y-4 animate-pulse">
            <div className="h-5 bg-slate-800 rounded w-1/3"></div>
            <div className="h-32 bg-slate-900/40 rounded-xl"></div>
          </div>
        );
      case 'list':
        return (
          <div className="space-y-4 animate-pulse">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-brand-border/30 bg-slate-950/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 w-2/3">
                  <div className="h-8 w-12 bg-slate-800 rounded-lg shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-800 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-slate-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        );
      case 'card':
      default:
        return (
          <div className="p-6 rounded-2xl border border-brand-border/40 bg-slate-950/25 space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-2/3"></div>
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            <div className="h-20 bg-slate-900/30 rounded-xl"></div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderSkeleton()}
    </div>
  );
}

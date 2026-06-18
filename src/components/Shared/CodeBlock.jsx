import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';

export default function CodeBlock({ code, maxLinesHeight = 'max-h-[480px]' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Single-pass tokenizer that prevents HTML class name pollution
  const highlightCpp = (text) => {
    if (!text) return "";
    
    // Escape HTML first
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const placeholders = [];
    let placeholderCounter = 0;

    // Helper to store token and return a placeholder
    const storePlaceholder = (val, className) => {
      const ph = `___TOKEN_PLACEHOLDER_${placeholderCounter++}___`;
      placeholders.push({
        ph,
        html: `<span class="${className}">${val}</span>`
      });
      return ph;
    };

    // 1. Extract comments (first priority to prevent internal highlighting)
    escaped = escaped.replace(/(\/\/.*)/g, (match) => {
      return storePlaceholder(match, "text-slate-500 italic");
    });

    // 2. Extract double quoted strings
    escaped = escaped.replace(/(&quot;.*?&quot;)/g, (match) => {
      return storePlaceholder(match, "text-emerald-400");
    });

    // 3. Extract single quoted characters
    escaped = escaped.replace(/(&#39;.*?&#39;)/g, (match) => {
      return storePlaceholder(match, "text-emerald-400");
    });

    // 4. Extract preprocessor includes (like <vector>)
    escaped = escaped.replace(/(&lt;.*?&gt;)/g, (match) => {
      if (match.includes("iostream") || match.includes("vector") || match.includes("queue") || 
          match.includes("stack") || match.includes("map") || match.includes("set") || 
          match.includes("bits/std") || match.includes("string") || match.includes("algorithm")) {
        return storePlaceholder(match, "text-emerald-400");
      }
      return match;
    });

    // 5. Highlight numbers, preprocessor directives, types, and keywords in a SINGLE pass
    // This completely prevents keywords/types matching text inside dynamically generated CSS classes
    const tokenRegex = /\b(\d+e\d+|\d+LL|\d+)\b|\b(int|long long|double|float|char|string|bool|void|auto|size_t|const|struct|class|pair|typename|vector|unordered_map|unordered_set|map|set|queue|priority_queue|stack|deque|if|else|for|while|do|return|break|continue|using|namespace|public|private|template|typename|greater|std|cin|cout|endl|abs|min|max|__gcd|push|pop|top|front|push_back|pop_back|resize|assign|size|clear|insert|count|find|erase|lower_bound|upper_bound|begin|end|iota)\b|(#include|#define|#ifndef|#endif)/g;

    escaped = escaped.replace(tokenRegex, (match) => {
      // Check if preprocessor directive
      if (match.startsWith('#')) {
        return `<span class="text-pink-500 font-bold">${match}</span>`;
      }
      
      // Check if number
      if (/^\d/.test(match)) {
        return `<span class="text-orange-400">${match}</span>`;
      }
      
      const dataTypes = [
        'int', 'long long', 'double', 'float', 'char', 'string', 'bool', 'void', 
        'auto', 'size_t', 'const', 'struct', 'class', 'pair', 'typename', 
        'vector', 'unordered_map', 'unordered_set', 'map', 'set', 'queue', 
        'priority_queue', 'stack', 'deque'
      ];
      
      if (dataTypes.includes(match)) {
        return `<span class="text-cyan-400 font-medium">${match}</span>`;
      }
      
      return `<span class="text-amber-400">${match}</span>`;
    });

    // 6. Restore comment and string placeholders
    placeholders.forEach(({ ph, html }) => {
      escaped = escaped.replace(ph, html);
    });

    return escaped;
  };

  // Pre-process and slice line arrays to remove trailing/leading empty lines
  const lines = React.useMemo(() => {
    if (!code) return [];
    const rawLines = code.split('\n');
    
    let startIdx = 0;
    while (startIdx < rawLines.length && rawLines[startIdx].trim() === '') {
      startIdx++;
    }
    
    let endIdx = rawLines.length - 1;
    while (endIdx >= startIdx && rawLines[endIdx].trim() === '') {
      endIdx--;
    }
    
    return rawLines.slice(startIdx, endIdx + 1).map(l => l.replace(/\r$/, ''));
  }, [code]);

  return (
    <div className="relative group border border-brand-border rounded-xl bg-slate-950/80 overflow-hidden font-mono text-sm leading-relaxed glass-card">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border bg-slate-900/60 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          <span className="ml-2 text-xs text-slate-400 font-sans font-medium">C++ Solution Template</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-sans cursor-pointer active:scale-95"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className={`overflow-auto custom-scrollbar select-text ${maxLinesHeight}`}>
        {/* Highlighted Code */}
        <pre className="px-4 py-4 overflow-x-auto text-slate-300 text-left select-text font-mono text-sm leading-6">
          <code className="select-text">
            {lines.map((line, i) => (
              <div
                key={i}
                className="h-6 flex items-center whitespace-pre select-text"
                dangerouslySetInnerHTML={{ __html: highlightCpp(line) || "&nbsp;" }}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

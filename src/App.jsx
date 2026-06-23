import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProfileDashboard from './components/ProfileDashboard';
import CoreConcepts from './components/CoreConcepts';
import MySubmissions from './components/MySubmissions';
import PracticeProblems from './components/PracticeProblems';
import { tagsData } from './data/tagsData';
import { mockData } from './data/mockData';
import { Layers, Terminal, Sparkles, LogOut, CheckCircle2, BookOpen, Menu, X, Keyboard, HelpCircle, Sun, Moon } from 'lucide-react';

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

export default function App() {
  const [activeTag, setActiveTag] = useState('dp'); // default tag
  const [currentView, setCurrentView] = useState('profile'); // 'profile' or 'workspace'
  const [activeTab, setActiveTab] = useState('concepts'); // 'concepts', 'submissions', or 'practice'
  
  // Codeforces handle & syncing states
  const [handleInput, setHandleInput] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [isSynced, setIsSynced] = useState(false);
  
  // Sync data
  const [userData, setUserData] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [problemsCountByTag, setProblemsCountByTag] = useState(DEFAULT_TOTAL_COUNTS);

  // Rival user states (Duel Mode)
  const [rivalInput, setRivalInput] = useState('');
  const [rivalData, setRivalData] = useState(null);
  const [rivalRatingHistory, setRivalRatingHistory] = useState([]);
  const [rivalSubmissions, setRivalSubmissions] = useState([]);
  const [isDuelActive, setIsDuelActive] = useState(false);
  const [syncingRival, setSyncingRival] = useState(false);
  const [syncRivalError, setSyncRivalError] = useState(null);

  // Mobile responsiveness drawer visibility
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Keyboard Shortcuts Modal state
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Theme support
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("cf_portfolio_theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Bookmarks persistence
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("cf_portfolio_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Apply Theme class to HTML node
  useEffect(() => {
    localStorage.setItem("cf_portfolio_theme", theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync bookmarks changes to localStorage
  useEffect(() => {
    localStorage.setItem("cf_portfolio_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Hotkeys navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keys inside input / textarea boxes
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key === '1') {
        if (currentView === 'workspace') setActiveTab('concepts');
      } else if (e.key === '2') {
        if (currentView === 'workspace') setActiveTab('practice');
      } else if (e.key === '3') {
        if (currentView === 'workspace') setActiveTab('submissions');
      } else if (e.key.toLowerCase() === 'p') {
        setCurrentView('profile');
      } else if (e.key.toLowerCase() === 'w') {
        setCurrentView('workspace');
      } else if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) searchInput.focus();
      } else if (e.key === '?') {
        setShowShortcutsHelp(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowShortcutsHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Load from localStorage on initialization
  useEffect(() => {
    const savedHandle = localStorage.getItem("cf_portfolio_handle");
    const savedUserData = localStorage.getItem("cf_portfolio_userData");
    const savedRating = localStorage.getItem("cf_portfolio_ratingHistory");
    const savedSubmissions = localStorage.getItem("cf_portfolio_submissions");
    const savedCounts = localStorage.getItem("cf_portfolio_problemsCountByTag");

    // Load rival details
    const savedRivalHandle = localStorage.getItem("cf_portfolio_rivalHandle");
    const savedRivalUserData = localStorage.getItem("cf_portfolio_rivalUserData");
    const savedRivalRating = localStorage.getItem("cf_portfolio_rivalRatingHistory");
    const savedRivalSubmissions = localStorage.getItem("cf_portfolio_rivalSubmissions");

    let parsedUserData = null;
    try {
      if (savedUserData) parsedUserData = JSON.parse(savedUserData);
    } catch (e) {}

    let parsedSubmissions = null;
    try {
      if (savedSubmissions) parsedSubmissions = JSON.parse(savedSubmissions);
    } catch (e) {}

    // Force clear any cached demo profile data that has empty submissions
    const isStaleAaryanagrawal32 = parsedUserData && parsedUserData.handle === 'Aaryanagrawal32' &&
      (!parsedSubmissions || parsedSubmissions.length === 0);

    const isOldMockData = parsedUserData && parsedUserData.handle === 'Aaryanagrawal32' && parsedUserData.rating === 1640;
    if (savedHandle && (savedHandle !== 'Aaryanagrawal32' || isOldMockData || isStaleAaryanagrawal32)) {
      localStorage.removeItem("cf_portfolio_handle");
      localStorage.removeItem("cf_portfolio_userData");
      localStorage.removeItem("cf_portfolio_ratingHistory");
      localStorage.removeItem("cf_portfolio_submissions");
      localStorage.removeItem("cf_portfolio_problemsCountByTag");
      
      localStorage.removeItem("cf_portfolio_rivalHandle");
      localStorage.removeItem("cf_portfolio_rivalUserData");
      localStorage.removeItem("cf_portfolio_rivalRatingHistory");
      localStorage.removeItem("cf_portfolio_rivalSubmissions");

      setIsSynced(false);
      return;
    }

    if (savedHandle && savedUserData) {
      setHandleInput(savedHandle);
      setUserData(JSON.parse(savedUserData));
      if (savedRating) setRatingHistory(JSON.parse(savedRating));
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
      if (savedCounts) setProblemsCountByTag(JSON.parse(savedCounts));
      setIsSynced(true);

      if (savedRivalHandle && savedRivalUserData) {
        setRivalInput(savedRivalHandle);
        setRivalData(JSON.parse(savedRivalUserData));
        if (savedRivalRating) setRivalRatingHistory(JSON.parse(savedRivalRating));
        if (savedRivalSubmissions) setRivalSubmissions(JSON.parse(savedRivalSubmissions));
        setIsDuelActive(true);
      }
    } else {
      setIsSynced(false);
    }
  }, []);

  // Sync profile details across parallel CF API endpoints
  const handleSync = async () => {
    const handle = handleInput.trim();
    if (!handle) {
      setSyncError("Please enter a valid Codeforces handle.");
      return;
    }
    
    setSyncing(true);
    setSyncError(null);

    try {
      const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      if (!userRes.ok) throw new Error(`Codeforces API request failed. Status: ${userRes.status}`);
      const userDataJson = await userRes.json();
      if (userDataJson.status !== "OK") {
        throw new Error(userDataJson.comment || "User not found.");
      }
      const fetchedUserInfo = userDataJson.result[0];

      let fetchedRatingHistory = [];
      let fetchedSubmissions = [];
      let fetchedProblemsCount = { ...DEFAULT_TOTAL_COUNTS };

      const ratingPromise = fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.status === "OK") fetchedRatingHistory = data.result;
        })
        .catch(err => console.warn("Soft fail: user.rating api down", err));

      const statusPromise = fetch(`https://codeforces.com/api/user.status?handle=${handle}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.status === "OK") fetchedSubmissions = data.result;
        })
        .catch(err => console.warn("Soft fail: user.status api down", err));

      const psetPromise = fetch(`https://codeforces.com/api/problemset.problems`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.status === "OK" && data.result && data.result.problems) {
            const counts = {
              dp: 0, graphs: 0, math: 0, "binary search": 0, greedy: 0, "data structures": 0, strings: 0,
              "two pointers": 0, sortings: 0, "number theory": 0, bitmasks: 0, "constructive algorithms": 0
            };
            data.result.problems.forEach(prob => {
              if (!prob.tags) return;
              prob.tags.forEach(t => {
                const tLower = t.toLowerCase();
                if (tLower === 'dp') counts['dp']++;
                else if (tLower.includes('graph') || tLower.includes('tree') || tLower.includes('dfs') || tLower.includes('shortest paths')) counts['graphs']++;
                else if (tLower.includes('math') || tLower.includes('number theory')) counts['math']++;
                else if (tLower.includes('binary search')) counts['binary search']++;
                else if (tLower.includes('greedy')) counts['greedy']++;
                else if (tLower.includes('data structures') || tLower.includes('dsu')) counts['data structures']++;
                else if (tLower.includes('string') || tLower.includes('hashing')) counts['strings']++;
                else if (tLower.includes('two pointers')) counts['two pointers']++;
                else if (tLower.includes('sortings')) counts['sortings']++;
                else if (tLower.includes('number theory')) counts['number theory']++;
                else if (tLower.includes('bitmasks')) counts['bitmasks']++;
                else if (tLower.includes('constructive algorithms')) counts['constructive algorithms']++;
              });
            });
            Object.keys(counts).forEach(k => {
              if (counts[k] > 0) fetchedProblemsCount[k] = counts[k];
            });
          }
        })
        .catch(err => console.warn("Soft fail: problemset.problems api down", err));

      await Promise.all([ratingPromise, statusPromise, psetPromise]);

      setUserData(fetchedUserInfo);
      setRatingHistory(fetchedRatingHistory);
      setSubmissions(fetchedSubmissions);
      setProblemsCountByTag(fetchedProblemsCount);
      setIsSynced(true);

      localStorage.setItem("cf_portfolio_handle", handle);
      localStorage.setItem("cf_portfolio_userData", JSON.stringify(fetchedUserInfo));
      localStorage.setItem("cf_portfolio_ratingHistory", JSON.stringify(fetchedRatingHistory));
      localStorage.setItem("cf_portfolio_submissions", JSON.stringify(fetchedSubmissions));
      localStorage.setItem("cf_portfolio_problemsCountByTag", JSON.stringify(fetchedProblemsCount));
    } catch (err) {
      setSyncError(err.message || "An unexpected error occurred during sync.");
    } finally {
      setSyncing(false);
    }
  };

  // Sync details for the rival user (Duel Mode)
  const handleRivalSync = async (rivalHandleName) => {
    const rHandle = (rivalHandleName || rivalInput).trim();
    if (!rHandle) {
      setSyncRivalError("Please enter a valid rival handle.");
      return;
    }
    
    if (rHandle.toLowerCase() === handleInput.toLowerCase()) {
      setSyncRivalError("Rival handle cannot be the same as your handle.");
      return;
    }

    setSyncingRival(true);
    setSyncRivalError(null);

    try {
      const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${rHandle}`);
      if (!userRes.ok) throw new Error(`Rival API request failed. Status: ${userRes.status}`);
      const userDataJson = await userRes.json();
      if (userDataJson.status !== "OK") {
        throw new Error(userDataJson.comment || "Rival not found.");
      }
      const fetchedUserInfo = userDataJson.result[0];

      await new Promise(res => setTimeout(res, 1000));

      let fetchedRatingHistory = [];
      let fetchedSubmissions = [];

      const ratingPromise = fetch(`https://codeforces.com/api/user.rating?handle=${rHandle}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.status === "OK") fetchedRatingHistory = data.result;
        })
        .catch(err => console.warn("Soft fail: rival user.rating api down", err));

      const statusPromise = fetch(`https://codeforces.com/api/user.status?handle=${rHandle}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.status === "OK") fetchedSubmissions = data.result;
        })
        .catch(err => console.warn("Soft fail: rival user.status api down", err));

      await Promise.all([ratingPromise, statusPromise]);

      setRivalData(fetchedUserInfo);
      setRivalRatingHistory(fetchedRatingHistory);
      setRivalSubmissions(fetchedSubmissions);
      setIsDuelActive(true);

      localStorage.setItem("cf_portfolio_rivalHandle", rHandle);
      localStorage.setItem("cf_portfolio_rivalUserData", JSON.stringify(fetchedUserInfo));
      localStorage.setItem("cf_portfolio_rivalRatingHistory", JSON.stringify(fetchedRatingHistory));
      localStorage.setItem("cf_portfolio_rivalSubmissions", JSON.stringify(fetchedSubmissions));
    } catch (err) {
      setSyncRivalError(err.message || "An unexpected error occurred during rival sync.");
    } finally {
      setSyncingRival(false);
    }
  };

  const handleDisconnectRival = () => {
    localStorage.removeItem("cf_portfolio_rivalHandle");
    localStorage.removeItem("cf_portfolio_rivalUserData");
    localStorage.removeItem("cf_portfolio_rivalRatingHistory");
    localStorage.removeItem("cf_portfolio_rivalSubmissions");

    setRivalInput('');
    setRivalData(null);
    setRivalRatingHistory([]);
    setRivalSubmissions([]);
    setIsDuelActive(false);
    setSyncRivalError(null);
  };

  const handleDisconnect = () => {
    localStorage.removeItem("cf_portfolio_handle");
    localStorage.removeItem("cf_portfolio_userData");
    localStorage.removeItem("cf_portfolio_ratingHistory");
    localStorage.removeItem("cf_portfolio_submissions");
    localStorage.removeItem("cf_portfolio_problemsCountByTag");
    
    setHandleInput('');
    setUserData(null);
    setRatingHistory([]);
    setSubmissions([]);
    setProblemsCountByTag(DEFAULT_TOTAL_COUNTS);
    setIsSynced(false);
    setSyncError(null);
    
    handleDisconnectRival();
    setCurrentView('profile');
  };

  const handleToggleBookmark = (problem) => {
    const key = `${problem.contestId}-${problem.index}`;
    setBookmarks(prev => {
      const exists = prev.some(p => `${p.contestId}-${p.index}` === key);
      if (exists) {
        return prev.filter(p => `${p.contestId}-${p.index}` !== key);
      } else {
        return [...prev, problem];
      }
    });
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg radial-bg text-slate-100 font-sans custom-scrollbar">
      {/* Sidebar - Desktop Layout (md+) & Mobile Drawer Layout */}
      <div className={`md:flex z-40 shrink-0 no-print ${isMobileSidebarOpen ? 'fixed inset-0 flex w-80' : 'hidden md:block'}`}>
        <Sidebar
          tags={tagsData}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          currentView={currentView}
          setCurrentView={setCurrentView}
          submissions={submissions}
          isSynced={isSynced}
          problemsCountByTag={problemsCountByTag}
          bookmarks={bookmarks}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-[-1] md:hidden cursor-pointer"
          />
        )}
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Top Control Navigation Header */}
        <header className="px-6 py-4 border-b border-brand-border bg-slate-950/60 flex items-center justify-between z-10 no-print">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu on Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-1.5 rounded-lg border border-brand-border bg-slate-900 text-slate-400 hover:text-white md:hidden cursor-pointer active:scale-95"
            >
              {isMobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Sparkles size={16} className="animate-pulse" />
              </span>
              <h1 className="text-sm font-bold tracking-wider font-mono text-white">
                CODEFORCES // PORTFOLIO_HUB
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Theme Toggle Button */}
            <button
              onClick={handleToggleTheme}
              className="p-1.5 rounded-lg bg-slate-900 border border-brand-border hover:border-purple-500 text-slate-400 hover:text-white transition-colors cursor-pointer active:scale-95 shrink-0"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>

            {/* Keyboard Shortcuts Trigger Button */}
            <button
              onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition cursor-pointer active:scale-95"
              title="Keyboard Shortcuts Guide (?)"
            >
              <Keyboard size={12} />
              Keybinds
            </button>

            {isSynced && userData && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right font-mono text-[10px]">
                  <span className="text-slate-300 font-bold">SYNCED: {userData.handle}</span>
                  <span className="text-emerald-400 font-bold">{userData.rating ? `RATING: ${userData.rating}` : 'UNRATED'}</span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-brand-border text-xs text-rose-400 hover:text-rose-300 transition rounded-lg cursor-pointer"
                  title="Disconnect Profile"
                >
                  <LogOut size={12} />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content view frame */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-6xl mx-auto">
            {currentView === 'profile' ? (
              <ProfileDashboard
                handleInput={handleInput}
                setHandleInput={setHandleInput}
                onSync={handleSync}
                syncing={syncing}
                syncError={syncError}
                userData={userData}
                ratingHistory={ratingHistory}
                submissions={submissions}
                isSynced={isSynced}
                onSelectTag={(tagKey) => {
                  setActiveTag(tagKey);
                  setCurrentView('workspace');
                  setActiveTab('concepts');
                }}
                rivalInput={rivalInput}
                setRivalInput={setRivalInput}
                rivalData={rivalData}
                rivalRatingHistory={rivalRatingHistory}
                rivalSubmissions={rivalSubmissions}
                isDuelActive={isDuelActive}
                syncingRival={syncingRival}
                syncRivalError={syncRivalError}
                onRivalSync={handleRivalSync}
                onRivalDisconnect={handleDisconnectRival}
              />
            ) : (
              // Workspace tabs view
              <div className="space-y-6">
                <div className="flex border-b border-brand-border/40 gap-6 text-sm font-semibold select-none no-print">
                  <button
                    onClick={() => setActiveTab('concepts')}
                    className={`pb-2.5 transition cursor-pointer relative flex items-center gap-1.5 ${
                      activeTab === 'concepts'
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers size={14} />
                    Core Concepts
                    {activeTab === 'concepts' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className={`pb-2.5 transition cursor-pointer relative flex items-center gap-1.5 ${
                      activeTab === 'practice'
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen size={14} />
                    Practice
                    {activeTab === 'practice' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`pb-2.5 transition cursor-pointer relative flex items-center gap-1.5 ${
                      activeTab === 'submissions'
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal size={14} />
                    My Submissions
                    {activeTab === 'submissions' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"></span>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  {activeTab === 'concepts' && (
                    <CoreConcepts
                      tagKey={activeTag}
                      tagData={tagsData[activeTag]}
                      isSynced={isSynced}
                      submissions={submissions}
                    />
                  )}
                  {activeTab === 'practice' && (
                    <PracticeProblems
                      tagKey={activeTag}
                      isSynced={isSynced}
                      submissions={submissions}
                      bookmarks={bookmarks}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  )}
                  {activeTab === 'submissions' && (
                    <MySubmissions
                      tagKey={activeTag}
                      isSynced={isSynced}
                      submissions={submissions}
                      bookmarks={bookmarks}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Keyboard Shortcuts Help Modal Overlay */}
      {showShortcutsHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border border-brand-border bg-slate-950 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowShortcutsHelp(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4">
              <Keyboard size={18} className="text-purple-400" />
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                Keyboard Shortcuts Guide
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between items-center py-1.5">
                <span>Go to Profile Dashboard</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">P</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-900">
                <span>Go to Active Workspace</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">W</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-900">
                <span>Switch Tab: Core Concepts</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">1</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-900">
                <span>Switch Tab: Practice Arena</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">2</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-900">
                <span>Switch Tab: My Submissions</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">3</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-900">
                <span>Focus Search Filters</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">/</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-900">
                <span>Toggle Keybinds Helper</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">?</kbd>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-900">
                <span>Close Active Modals / Blur Input</span>
                <kbd className="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-semibold text-[10px] text-purple-400">ESC</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

# 🏆 Codeforces Portfolio Hub

An interactive, high-end analytics dashboard and workspace for competitive programmers. Connect your Codeforces profile to analyze rating fluctuations, track topic mastery using dynamic liquid-fill indicators, compare stats in real-time with rivals, search C++ STL container complexities, and review essential algorithm templates.

<div align="center">
  <img src="public/favicon.svg" alt="Codeforces Portfolio Hub Logo" width="120" height="120" />
  <p><strong>Optimize, Track, and Dominate your Competitive Programming Journey.</strong></p>
</div>

---

## ✨ Features

### 📊 Competitive Profile Engine
- **Live Syncing**: Synchronizes handles in real-time directly with the **Codeforces API** (fetching user info, user rating history, and user submissions status).
- **Interactive Visualizations**: Beautiful, custom SVG charts for rating progression and contest history.
- **Activity Heatmap**: A GitHub-style calendar visualizing your submission frequency and consistency over the past year.
- **LeetCode-Style Difficulty Breakdown**: Maps your Codeforces rating brackets into Easy (<1300), Medium (1300–1900), and Hard (≥1900) categories for an intuitive summary of your skill profile.

### ⚔️ Rival Duel Arena (VS Mode)
- **Parallel Profile Analysis**: Sync a rival's handle to contrast your performance metrics.
- **Live Duels**: Compares overall ratings, submission counts, and problem-solving frequencies side-by-side.

### 🌊 Dynamic Topic Mastery Cloud
- **Liquid-Fill SVG Mastery Badges**: Displays problem-solving statistics across 12 core tags (DP, Graphs, Greedy, Math, Binary Search, Data Structures, etc.).
- **Visual Liquid Gauges**: Custom SVG gauges filled dynamically to represent your progress against total problems.
- **Co-occurrence Gaps (Weakness Locator)**: Evaluates multiple tags appearing together in your unsolved problems to highlight compound weaknesses.

### 📝 Core Concepts & Printing Cheatsheets
- **C++ Template Repository**: Standard implementations for DFS/BFS, binary exponentiation, Segment Trees, and more.
- **STL Container Method Finder**: Search standard C++ containers (`vector`, `map`, `set`, etc.) for method syntax, parameters, and time complexities.
- **Algorithmic Edge Cases**: Avoid penalties by studying curated lists of common pitfalls for each topic.
- **Printable Codesheets**: Features CSS `@media print` styling—click **Print Codesheet** to generate a clean, format-optimized PDF study guide.

### ⌨️ Advanced UX
- **Theme Support**: Seamlessly toggle between dark and light modes.
- **Bookmarks Persistence**: Save difficult or interesting problems to bookmarks with local storage persistence.
- **Keyboard Shortcuts**: Power-user bindings for lightning-fast dashboard navigation.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React State + Hooks (`useMemo`, `useEffect`) + LocalStorage persistence
- **Data Integration**: Standard Codeforces API endpoints

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine (v18 or higher recommended).

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/codeforces-summary.git
   cd codeforces-summary
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

### Available Scripts

- `npm run dev` — Starts Vite dev server with Hot Module Replacement (HMR).
- `npm run build` — Compiles production bundle to `dist/`.
- `npm run preview` — Previews the production build locally.
- `npm run lint` — Runs ESLint checks on source files.

---

## 🎹 Keyboard Shortcuts

Boost your efficiency with built-in navigation bindings:

| Key | Action |
| :---: | :--- |
| `P` | Switch to Profile Dashboard |
| `W` | Switch to Active Topic Workspace |
| `1` | Select **Core Concepts** Tab (inside Workspace) |
| `2` | Select **Practice Arena** Tab (inside Workspace) |
| `3` | Select **My Submissions** Tab (inside Workspace) |
| `/` | Focus search filter input |
| `?` | Toggle Keyboard Shortcuts Help Modal |
| `ESC` | Close active modals / blur focused inputs |

---

## 📂 Project Directory Structure

```text
├── public/                  # Static assets & icons
├── src/
│   ├── assets/              # Additional media assets
│   ├── components/
│   │   ├── Dashboard/       # Dashboard modules (Rating graph, Heatmap, Rival duel)
│   │   │   ├── ContestHeatmap.jsx
│   │   │   ├── LeetCodeBridge.jsx
│   │   │   ├── MasteryCard.jsx
│   │   │   ├── RatingGraph.jsx
│   │   │   ├── Recommender.jsx
│   │   │   ├── RivalDuelPanel.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── Shared/          # Code block renderer & skeletons
│   │   ├── CoreConcepts.jsx # Concept descriptions & STL Finder
│   │   ├── MySubmissions.jsx# Submissions log filter & statistics
│   │   ├── PracticeProblems.jsx # Recommender & problem picker
│   │   ├── ProfileDashboard.jsx # Dashboard wrapper
│   │   └── Sidebar.jsx      # Sticky tag & navigation sidebar
│   ├── data/
│   │   ├── mockData.js      # Mock profile data for offline demo mode
│   │   ├── recommenderFallback.js
│   │   ├── stlData.js       # C++ STL method helper definitions
│   │   └── tagsData.js      # Deep dive topics content and trigger keywords
│   ├── App.css
│   ├── App.jsx              # Main App layout and State controller
│   ├── index.css            # Tailwind CSS global styles
│   └── main.jsx             # React entry mount
├── index.html               # Main HTML entry document
├── vite.config.js           # Vite build configuration
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the Codeforces Portfolio Hub:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

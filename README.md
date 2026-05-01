# ?? SQL Viewer v2.0

A professional-grade, high-performance **Open Source** SQLite database manager built for 2026. Manage, visualize, and edit your databases directly in the browser with zero installation.

## ?? Key Features
- **WASM Engine**: Powered by sql-wasm.js for desktop-class performance in a browser.
- **Data Inspector**: Click any cell to inspect, copy, or live-edit data.
- **Horizontal & Vertical Control**: Custom scroll logic with dedicated sidebar/header controls.
- **Mobile Optimized**: Fully responsive UI with drawer-based navigation.
- **Zero Privacy Risk**: All processing happens client-side. Your data never leaves your machine.
- **Open Source**: Built for the community. Feel free to fork, improve, and share!

---

## ??? How It Works (Process Map)

Below is the logic flow of the SQL Viewer kernel:

`mermaid
graph TD
    A[User Opens App] --> B[Environment Init]
    B --> C{Mount SQLite File}
    C -->|Upload| D[WASM Kernel Loading]
    D --> E[Table Structure Mapping]
    E --> F[Sidebar Population]
    
    F --> G[Table Selection]
    G --> H[SQL Execution SELECT *]
    H --> I[UI Grid Rendering]
    
    I --> J{Data Interaction}
    J -->|Scroll| K[Horizontal/Vertical Scroll Container]
    J -->|Click Cell| L[Inspector Panel Opens]
    L --> M[Copy / Edit / Nullify]
    M -->|Commit| N[SQL UPDATE Query Execution]
    N --> H
`

---

## ??? Tech Stack
- **Engine**: [SQL.js](https://github.com/sql-js/sql.js) (SQLite compiled to WebAssembly)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Typography**: Space Grotesk & JetBrains Mono
- **Infrastructure**: Pure HTML5/JavaScript/CSS (No backend required)

---

## ?? Getting Started
1. Clone the repository: git clone <repo-url>
2. Open index.html in any modern browser.
3. Click **Mount DB** to start exploring.

## ?? License
This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

---
**Authenticated Session © 2026 Viewer Labs** ?????

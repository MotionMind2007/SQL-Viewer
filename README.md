## SQL Viewer v2.0

![License](https://img.shields.io/badge/license-MIT-white?style=flat-square)
![Version](https://img.shields.io/badge/version-2.0.0-white?style=flat-square)
![Status](https://img.shields.io/badge/status-active-green?style=flat-square)

A professional-grade, high-performance **Open Source** SQLite database manager built for 2026. Manage, visualize, and edit your databases directly in the browser with zero installation.

**Live Deployment**: [https://sql-viewer-chi.vercel.app/](https://sql-viewer-chi.vercel.app/)

---

## Key Features
- **WASM Kernel**: Powered by sql-wasm.js for desktop-class performance in a browser environment.
- **Universal Data Inspector**: Precise cell-level inspection, copying, and real-time editing.
- **Bi-Directional Scroll Control**: Engineered for large datasets with smooth horizontal and vertical navigation.
- **Mobile-Responsive Architecture**: Adaptive UI designed for seamless use across desktop and mobile devices.
- **Air-Gapped Privacy**: 100% client-side processing. Your data never touches a server.
- **Industry Standard UI**: Minimalist "Black & White" aesthetic focused on data clarity.

---

## How It Works (Process Map)

SQL Viewer implements a strictly client-side orchestration model to handle structured data.

`mermaid
graph TD
    A[Launch App] --> B[Kernel Initialization]
    B --> C{Mount SQLite Buffer}
    C -->|Binary Sync| D[WASM VM Loading]
    D --> E[Schema Discovery]
    E --> F[Sidebar Dynamic Generation]
    
    F --> G[Workspace Selection]
    G --> H[Engine Execution: SELECT *]
    H --> I[High-Performance Grid Render]
    
    I --> J{Active Interaction}
    J -->|Navigation| K[Smooth Scroll Orchestrator]
    J -->|Selection| L[Inspector Overlay]
    L --> M[Field Modification Buffer]
    M -->|Commit Change| N[UPDATE Protocol Execution]
    N --> H
`

---

## Tech Stack
- **Engine**: [SQL.js](https://github.com/sql-js/sql.js) (SQLite compiled to WebAssembly)
- **Framework**: Tailwind CSS (Utility-first styling)
- **Runtime**: Vanilla JavaScript (ES2026)
- **Typography**: Space Grotesk (Brand) & JetBrains Mono (Code)

---

## Getting Started

Build your own instance or run locally:

1. **Clone the Repository**
   `bash
   git clone https://github.com/MotionMind2007/SQL-Viewer.git
   `

2. **Navigate & Execute**
   `bash
   cd SQL-Viewer
   # Open index.html in any modern browser
   `

3. **Mount Data**
   Click the **Mount DB** button to initialize the WASM kernel with your database.

---

## License
This project is licensed under the **MIT License**. We believe in the power of the open-source community. Fork it, improve it, and build the future of data management.

---
**Maintained by [MotionMind2007](https://github.com/MotionMind2007)** ?????

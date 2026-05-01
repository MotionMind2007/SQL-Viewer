const config = {
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
};

class SQLNexus {
    constructor() {
        this.SQL = null;
        this.db = null;
        this.currentTable = null;
        this.totalRows = 0;
        
        this.activeCell = { col: null, value: null, rowData: null, tdElement: null };
        
        this.init();
    }

    async init() {
        this.cacheDOM();
        this.bindEvents();
        await this.initEngine();
    }

    cacheDOM() {
        this.dom = {
            dbUpload: document.getElementById("db-upload"),
            dbOutput: document.getElementById("db-output"),
            sidebar: document.getElementById("sidebar"),
            tableList: document.getElementById("table-list"),
            
            // Header Info
            currentTableLabel: document.getElementById("current-table-name"),
            rowsInfo: document.getElementById("rows-info"),
            statusLedger: document.getElementById("status-ledger"),
            refreshBtn: document.getElementById("refresh-view"),
            scrollLeftBtn: document.getElementById("scroll-left"),
            scrollRightBtn: document.getElementById("scroll-right"),

            // Mobile
            mobileToggle: document.getElementById("mobile-sidebar-toggle"),
            closeSidebar: document.getElementById("close-sidebar-mobile"),

            // Inspector
            inspector: document.getElementById("inspector"),
            closeInspector: document.getElementById("close-inspector"),
            cellEditor: document.getElementById("cell-value-editor"),
            copyBtn: document.getElementById("copy-cell"),
            deleteBtn: document.getElementById("delete-cell"),
            saveBtn: document.getElementById("save-cell"),
            metaCol: document.getElementById("meta-column"),
            metaTab: document.getElementById("meta-table")
        };
    }

    bindEvents() {
        this.dom.dbUpload.addEventListener("change", (e) => this.handleFileUpload(e));
        
        this.dom.refreshBtn.addEventListener("click", () => {
            if (this.currentTable) {
                this.loadTableData(this.currentTable);
            }
        });

        this.dom.scrollLeftBtn.addEventListener("click", () => {
            this.dom.dbOutput.scrollBy({ left: -300, behavior: 'smooth' });
        });

        this.dom.scrollRightBtn.addEventListener("click", () => {
            this.dom.dbOutput.scrollBy({ left: 300, behavior: 'smooth' });
        });

        // Mobile Handlers
        this.dom.mobileToggle?.addEventListener("click", () => {
            this.dom.sidebar.classList.add("open");
            this.toggleOverlay(true);
        });

        this.dom.closeSidebar?.addEventListener("click", () => {
            this.dom.sidebar.classList.remove("open");
            this.toggleOverlay(false);
        });

        // Inspector
        this.dom.closeInspector.addEventListener("click", () => this.hideInspector());
        
        this.dom.copyBtn.addEventListener("click", () => {
            const val = this.dom.cellEditor.value;
            navigator.clipboard.writeText(val);
            const original = this.dom.copyBtn.innerHTML;
            this.dom.copyBtn.innerText = "COPIED!";
            setTimeout(() => this.dom.copyBtn.innerHTML = original, 1000);
        });

        this.dom.deleteBtn.addEventListener("click", () => {
            if(confirm("DANGER: Set this cell to NULL?")) {
                this.updateDatabaseValue(null);
            }
        });

        this.dom.saveBtn.addEventListener("click", () => {
            this.updateDatabaseValue(this.dom.cellEditor.value);
        });
    }

    toggleOverlay(show) {
        let overlay = document.getElementById("sidebar-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "sidebar-overlay";
            this.dom.sidebar.after(overlay);
            overlay.onclick = () => this.dom.closeSidebar.click();
        }
        overlay.style.opacity = show ? "1" : "0";
        overlay.style.pointerEvents = show ? "auto" : "none";
    }

    async initEngine() {
        try {
            this.SQL = await window.initSqlJs(config);
        } catch (err) {
            this.showError("System Fail: " + err.message);
        }
    }

    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        this.showLoading(`MOUNTING ENGINE: ${file.name.toUpperCase()}...`);
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const uints = new Uint8Array(reader.result);
                if (this.db) this.db.close();
                this.db = new this.SQL.Database(uints);
                this.loadTableList();
                this.dom.statusLedger.classList.remove("hidden");
            } catch (err) {
                this.showError("Mount Failure: " + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    loadTableList() {
        const res = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
        this.dom.tableList.innerHTML = "";
        
        if (res.length === 0) {
            this.dom.tableList.innerHTML = `<div class="p-10 text-center text-white/10 uppercase tracking-widest text-[10px]">Empty Disk</div>`;
            return;
        }

        const tables = res[0].values;
        tables.forEach(table => {
            const name = table[0];
            const btn = document.createElement("button");
            btn.className = "w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent truncate";
            btn.textContent = name;
            btn.onclick = () => {
                this.loadTableData(name, btn);
                if (window.innerWidth < 1024) this.dom.closeSidebar.click();
            };
            this.dom.tableList.appendChild(btn);
        });

        if (tables.length > 0) this.loadTableData(tables[0][0], this.dom.tableList.firstChild);
    }

    loadTableData(tableName, activeBtn) {
        this.currentTable = tableName;
        this.dom.currentTableLabel.innerText = tableName;

        document.querySelectorAll("#table-list button").forEach(b => b.classList.remove("sidebar-link-active"));
        if (activeBtn) {
            activeBtn.classList.add("sidebar-link-active");
        } else {
            // Find btn manually if refreshed
            const btns = document.querySelectorAll("#table-list button");
            btns.forEach(b => { if(b.textContent === tableName) b.classList.add("sidebar-link-active") });
        }

        try {
            const res = this.db.exec(`SELECT * FROM "${tableName}"`);
            
            if (res.length > 0) {
                this.totalRows = res[0].values.length;
                this.renderTable(res[0]);
                this.dom.rowsInfo.innerText = `${this.totalRows.toLocaleString()} ROWS`;
            } else {
                this.dom.dbOutput.innerHTML = `<div class="h-full flex items-center justify-center text-white/10 uppercase tracking-widest font-black text-xs">Zero Rows Returned</div>`;
                this.totalRows = 0;
                this.dom.rowsInfo.innerText = `0 ROWS`;
            }
        } catch (err) {
            this.showError("Execution Error: " + err.message);
        }
    }

    renderTable(data) {
        const { columns, values } = data;
        
        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper custom-scrollbar";
        
        const table = document.createElement("table");
        table.className = "text-[11px] font-bold uppercase tracking-tight";
        
        const thead = document.createElement("thead");
        thead.innerHTML = `<tr>${columns.map(col => `
            <th class="px-6 py-4 text-white/30 text-left border-r border-white/5 last:border-0">${col}</th>
        `).join("")}</tr>`;
        
        const tbody = document.createElement("tbody");
        tbody.className = "divide-y divide-white/5";
        
        values.forEach(row => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-white/[0.03] transition-colors group cursor-pointer";
            
            const rowObj = {};
            columns.forEach((c, i) => rowObj[c] = row[i]);

            row.forEach((cell, idx) => {
                const td = document.createElement("td");
                td.className = "px-6 py-3 text-white/60 group-hover:text-white truncate max-w-[300px] border-r border-white/5 last:border-0";
                td.innerHTML = cell === null ? "<span class='opacity-10 italic'>NULL</span>" : cell;
                td.onclick = (e) => this.showInspector(columns[idx], cell, rowObj, td);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.append(thead, tbody);
        wrapper.appendChild(table);
        this.dom.dbOutput.innerHTML = "";
        this.dom.dbOutput.appendChild(wrapper);
    }

    updateUI() {
        const total = this.getTotalPages();
        this.dom.totalPagesLabel.innerText = total;
        this.dom.gotoInput.value = this.currentPage;
        
        const start = ((this.currentPage - 1) * this.pageSize) + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.totalRows);
        this.dom.rowsInfo.innerText = `${start}-${end} OF ${this.totalRows.toLocaleString()}`;

        this.dom.prevBtn.disabled = this.currentPage === 1;
        this.dom.nextBtn.disabled = this.currentPage === total;
    }

    showInspector(col, val, rowData, td) {
        this.activeCell = { col, value: val, rowData, tdElement: td };
        this.dom.metaCol.innerText = col;
        this.dom.metaTab.innerText = this.currentTable;
        this.dom.cellEditor.value = val === null ? "" : val;
        
        this.dom.inspector.classList.remove("translate-x-full");
    }

    hideInspector() {
        this.dom.inspector.classList.add("translate-x-full");
    }

    updateDatabaseValue(newValue) {
        if (!this.db || !this.currentTable) return;
        
        try {
            const keys = Object.keys(this.activeCell.rowData);
            const where = keys.map(k => {
                const v = this.activeCell.rowData[k];
                return v === null ? `"${k}" IS NULL` : `"${k}" = ?`;
            }).join(" AND ");
            
            const params = keys.map(k => this.activeCell.rowData[k]).filter(v => v !== null);
            
            const sql = `UPDATE "${this.currentTable}" SET "${this.activeCell.col}" = ? WHERE ${where}`;
            this.db.run(sql, [newValue, ...params]);
            
            this.loadTableData(this.currentTable);
            this.hideInspector();
        } catch (err) {
            alert("COMMIT ERROR: " + err.message);
        }
    }

    showError(msg) {
        this.dom.dbOutput.innerHTML = `
            <div class="h-full flex items-center justify-center p-10">
                <div class="border-l-2 border-red-500 bg-red-500/5 p-8 max-w-xl">
                    <h4 class="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 italic underline underline-offset-4">Kernel Panic</h4>
                    <p class="text-white/80 font-mono text-xs leading-relaxed truncate">${msg}</p>
                </div>
            </div>`;
    }

    showLoading(msg) {
        this.dom.dbOutput.innerHTML = `
            <div class="h-full flex items-center justify-center">
                <div class="text-center">
                    <div class="w-12 h-1 bg-white/20 mx-auto mb-4 overflow-hidden relative">
                        <div class="absolute inset-0 bg-white/60 w-1/2 animate-[load_1s_infinite]"></div>
                    </div>
                    <p class="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic animate-pulse">${msg}</p>
                </div>
            </div>
            <style>@keyframes load { 0% { left: -100% } 100% { left: 100% } }</style>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.App = new SQLNexus();
});
import { ICONS } from './icon.js';

const config = {
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
};

// গ্লোবাল ভেরিয়েবল (যাতে সব ফাংশন এক্সেস পায়)
let SQL, db, currentTableList = [];
let currentPage = 0;
const rowsPerPage = 20;

const outputContainer = document.getElementById('db-output');

async function initEngine() {
  try {
    SQL = await window.initSqlJs(config);
    console.log("SQL.js Engine Ready!");
  } catch (err) {
    outputContainer.innerHTML = `<span style="color: red;">Error: ${err}</span>`;
  }
}
initEngine();

document.getElementById('db-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  outputContainer.innerHTML = `<div class="loading">Reading ${file.name}...</div>`;

  reader.onload = function () {
    try {
      const Uints = new Uint8Array(reader.result);
      db = new SQL.Database(Uints);

      const res = db.exec("SELECT name FROM sqlite_master WHERE type='table';");

      if (res.length === 0 || res[0].values.length === 0) {
        outputContainer.innerHTML = "<span>No tables found!</span>";
        return;
      }

      currentTableList = res[0].values;
      renderSplitLayout();
      
      // ১ম টেবিল লোড করার সময় page ০ এবং element null পাস করা হচ্ছে
      window.loadTableData(currentTableList[0][0], null, 0);

    } catch (err) {
      outputContainer.innerHTML = `<span style="color: red;">Error: ${err.message}</span>`;
    }
  };
  reader.readAsArrayBuffer(file);
});

function renderSplitLayout() {
  outputContainer.innerHTML = `
    <div class="db-wrapper" style="display: flex; width: 100%; border: 1px solid #222;">
      <div id="table-list-sidebar" style="width: 200px; border-right: 1px solid #222; overflow-y: auto; padding: 10px; background: #050505;">
        <p style="font-size: 11px; color: #555; text-transform: uppercase; margin-bottom: 10px;">Tables</p>
        <div class="sidebar-links">
          ${currentTableList.map(table => `
            <button class="table-link-btn" onclick="window.loadTableData('${table[0]}', this, 0)" 
              style="display: flex; gap: 10px; width: 100%; align-items: center; text-align: left; background: transparent; color: #888; border: none; padding: 8px; cursor: pointer; font-size: 13px; border-radius: 4px; margin-bottom: 2px;">
              ${ICONS.folder} ${table[0]}
            </button>
          `).join('')}
        </div>
      </div>
      <div id="table-data-content" style="flex: 1; overflow: auto; padding: 15px; background: #000;"></div>
    </div>
  `;
}

window.loadTableData = (tableName, element = null, page = 0) => {
  try {
    if (!db) return;
    currentPage = page;

    // বাটন স্টাইল আপডেট
    if (element) {
      document.querySelectorAll('.table-link-btn').forEach(btn => {
        btn.style.background = "transparent";
        btn.style.color = "#888";
      });
      element.style.background = "#fff";
      element.style.color = "#000";
    }

    // ১. মোট রো সংখ্যা বের করা
    const countRes = db.exec(`SELECT COUNT(*) FROM ${tableName}`);
    const totalRows = countRes[0].values[0][0];
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // ২. পেজ অনুযায়ী ডাটা কুয়েরি
    const offset = currentPage * rowsPerPage;
    const res = db.exec(`SELECT * FROM ${tableName} LIMIT ${rowsPerPage} OFFSET ${offset};`);
    
    const dataContainer = document.getElementById('table-data-content');

    if (res.length === 0) {
      dataContainer.innerHTML = `<p>Table <b>${tableName}</b> is empty.</p>`;
      return;
    }

    const columns = res[0].columns;
    const values = res[0].values;

    
    dataContainer.innerHTML = `
      <div class="view-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h2 style="color: #fff; font-size: 18px; margin: 0;">${tableName} <small style="color: #555; font-size: 12px;">(${totalRows} rows)</small></h2>
    
        <div class="pagination" style="display: flex; gap: 8px; align-items: center;">
          <button 
            ${currentPage === 0 ? 'disabled style="opacity: 0.3; color: #8b8b8b; cursor: not-allowed;"' : `onclick="window.loadTableData('${tableName}', null, ${currentPage - 1})"`} 
            style="padding: 5px 10px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; cursor: pointer;">
            Prev
          </button>
      
          <div style="display: flex; align-items: center; gap: 5px; color: #888; font-size: 12px;">
            <span>Page</span>
            <input type="number" 
              value="${currentPage + 1}" 
              min="1" 
              max="${totalPages}" 
              onkeydown="if(event.key==='Enter') { 
                let p = parseInt(this.value) - 1; 
                if(p >= 0 && p < ${totalPages}) window.loadTableData('${tableName}', null, p);
                else alert('Invalid page number!');
              }"
              style="width: 75px; background: #111; border: 1px solid #444; color: #fff; text-align: center; border-radius: 4px; padding: 3px;">
            <span>of ${totalPages}</span>
          </div>
      
          <button 
            ${currentPage >= totalPages - 1 ? 'disabled style="opacity: 0.3; color: #8b8b8b; cursor: not-allowed;"' : `onclick="window.loadTableData('${tableName}', null, ${currentPage + 1})"`} 
            style="padding: 5px 10px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; cursor: pointer;">
            Next
          </button>
        </div>
      </div>

      <div class="data-grid-wrapper" style="overflow: auto;">
        <table class="modern-table" style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #333;">
          <thead>
            <tr style="background: #111;">
              ${columns.map(c => `<th style="padding: 10px; text-align: left; border: 1px solid #333; color: #888;">${c}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${values.map(row => `
              <tr>
                ${row.map(v => `
                  <td class="clickable-cell" onclick="window.inspectCell(this)" style="padding: 10px; border: 1px solid #222; color: #ccc; cursor: pointer;">
                    ${v !== null ? v : '<span class="null" style="color: #444; font-style: italic;">null</span>'}
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
  `;

  } catch (err) {
    alert("Error: " + err.message);
  }
};


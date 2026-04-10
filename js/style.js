import { ICONS } from './icon.js';
import { openMenu, closeMenu } from './bar.js';

const menuBtn = document.getElementById('menu-btn');
const downloadBtn = document.getElementById('download-btn');
const aboutBtn = document.getElementById('about');
const helpBtn = document.getElementById('help');

if (downloadBtn) {
    downloadBtn.innerHTML = ICONS.download + 'Download note.txt';
}
if (aboutBtn) {
    aboutBtn.innerHTML = ICONS.about + 'About';
}
if (helpBtn) {
    helpBtn.innerHTML = ICONS.help + 'Help';
}
menuBtn.innerHTML = ICONS.menu;
menuBtn.addEventListener('click', openMenu);

//menu button handle
const makeNoteBtn = document.getElementById('make-note-btn');
const sqlViewBtn = document.getElementById('sql-view-btn');
if (makeNoteBtn) {
    makeNoteBtn.addEventListener('click', () => {
        window.location.href = 'note.html';
    });
}
if (sqlViewBtn) {
    sqlViewBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
        window.location.href = 'about.html';
    })
}
if (helpBtn) {
    helpBtn.addEventListener('click', () => {
        window.location.href = 'help.html';
    })
}
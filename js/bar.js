// Sidebar Elements
const sidebar = document.querySelector('.menu-items');
const overlay = document.querySelector('.overlay');

function openMenu() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
}

function closeMenu() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
}
overlay.addEventListener('click', closeMenu);
const allButtons = document.querySelectorAll('button');
allButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('button.active')?.classList.remove('active');
    btn.classList.add('active');
  });
});

export { openMenu, closeMenu };
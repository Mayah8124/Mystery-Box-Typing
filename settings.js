const toggleThemeBtn = document.getElementById('toggle-theme');
const themeLabel = document.getElementById('theme-label');
const soundToggleBtn = document.getElementById('toggle-sound');
const fontButtons = document.querySelectorAll('.font-btn');
const body = document.body;

let isDark = localStorage.getItem('theme') === 'dark';
let soundEnabled = localStorage.getItem('sound') !== 'off';
let currentFont = localStorage.getItem('font');


if (isDark) {
  body.style.backgroundColor = '#256193';
  if (themeLabel) themeLabel.textContent = 'dark';
} else {
  body.style.backgroundColor = '#82ddf0';
  if (themeLabel) themeLabel.textContent = 'light';
}

if (soundToggleBtn) {
  soundToggleBtn.textContent = soundEnabled ? '🎵' : '🔇';
}

if (currentFont) {
  body.style.fontFamily = currentFont;
}


if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    body.style.backgroundColor = isDark ? '#256193' : '#87CEEB';
    themeLabel.textContent = isDark ? 'dark' : 'light';
  });
}

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sound', soundEnabled ? 'on' : 'off');
    soundToggleBtn.textContent = soundEnabled ? '🎵' : '🔇';
  });
}

fontButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedFont = button.getAttribute('data-font');
    body.style.fontFamily = selectedFont;
    localStorage.setItem('font', selectedFont);
  });
});

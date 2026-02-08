// @ts-check

/**
 * Returns the preferred theme based on:
 * 1. Explicit user choice in localStorage.
 * 2. Device preference (fallback).
 */
function resolveTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    // No stored preference -> follow device.
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

/** @type {HTMLElement} */ let lightDarkBtnEl;
/** @type {HTMLElement} */ let moonEl;
/** @type {HTMLElement} */ let sunEl;

/**
 * Applies the given theme to the document and related UI.
 * @param {'light' | 'dark'} theme The theme to apply.
 */
function applyTheme(theme) {
    const isDark = theme === 'dark';

    document.body.classList.toggle('dark-theme', isDark);
    moonEl.style.display = isDark ? 'none' : 'block';
    sunEl.style.display = isDark ? 'block' : 'none';

    // Sync Remark42 if present.
    if (window.REMARK42) {
        window.REMARK42.changeTheme(isDark ? 'dark' : 'light');
    }

    // Sync Giscus if present.
    const giscusFrame = document.querySelector('.giscus-frame');
    if (giscusFrame) {
        giscusFrame.contentWindow.postMessage(
            { giscus: { setConfig: { theme: isDark ? 'dark' : 'light' } } },
            'https://giscus.app'
        );
    }
}

/**
 * Cycles theme state:
 * device -> dark -> light -> device
 *
 * device is represented by removing localStorage key.
 */
function toggleTheme() {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === null) {
        // Currently following device -> force dark.
        localStorage.setItem('theme', 'dark');
        applyTheme('dark');
    } else if (storedTheme === 'dark') {
        // Dark -> light.
        localStorage.setItem('theme', 'light');
        applyTheme('light');
    } else {
        // Light -> back to device.
        localStorage.removeItem('theme');
        applyTheme(resolveTheme());
    }
}

// // -----------------------
// // Initialization
// // -----------------------

// Initial application.
const loadHandler = () => {
  lightDarkBtnEl = document.querySelector('.btn-light-dark');
  moonEl = document.querySelector('.moon');
  sunEl = document.querySelector('.sun');
  applyTheme(resolveTheme());
  // User toggle.
  lightDarkBtnEl.addEventListener('click', toggleTheme);
};
// document.addEventListener('DOMContentLoaded', loadHandler);
document.addEventListener('turbolinks:load', loadHandler);

// When Giscus iframe loads, sync its theme with ours if user has a manual override.
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://giscus.app') return;
    if (!event.data.giscus) return;
    // On first message from Giscus, push our current theme if we have a stored override.
    const stored = localStorage.getItem('theme');
    if (stored) {
        const giscusFrame = document.querySelector('.giscus-frame');
        if (giscusFrame) {
            giscusFrame.contentWindow.postMessage(
                { giscus: { setConfig: { theme: stored } } },
                'https://giscus.app'
            );
        }
    }
});

// React to device theme changes *only* if no user override exists.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === null) {
        applyTheme(resolveTheme());
    }
});

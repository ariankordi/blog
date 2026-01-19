/**
 * Returns the preferred theme based on:
 * 1. Explicit user choice in localStorage.
 * 2. Device preference (fallback).
 */
function resolveTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    // No stored preference -> follow device.
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

/**
 * Applies the given theme to the document and related UI.
 * @param {"light" | "dark"} theme The theme to apply.
 */
function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);
    moon.style.display = isDark ? "none" : "block";
    sun.style.display = isDark ? "block" : "none";

    // Sync Remark42 if present.
    if (window.REMARK42) {
        window.REMARK42.changeTheme(isDark ? "dark" : "light");
    }
}

/**
 * Cycles theme state:
 * device -> dark -> light -> device
 *
 * device is represented by removing localStorage key.
 */
function toggleTheme() {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === null) {
        // Currently following device -> force dark.
        localStorage.setItem("theme", "dark");
        applyTheme("dark");
    } else if (storedTheme === "dark") {
        // Dark -> light.
        localStorage.setItem("theme", "light");
        applyTheme("light");
    } else {
        // Light -> back to device.
        localStorage.removeItem("theme");
        applyTheme(resolveTheme());
    }
}

// // -----------------------
// // Initialization
// // -----------------------

const btn = document.querySelector(".btn-light-dark");
const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");

// Initial application.
applyTheme(resolveTheme());

// React to device theme changes *only* if no user override exists.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("theme") === null) {
        applyTheme(resolveTheme());
    }
});

// User toggle.
btn.addEventListener("click", toggleTheme);

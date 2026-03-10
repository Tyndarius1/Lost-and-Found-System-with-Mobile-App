/**
 * Reusable button loading state (spinner + disable). Use for Filter/Search/Submit actions.
 */
const SPIN_SVG = `<svg style="margin-right: 8px; animation: spin 1s linear infinite;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

/**
 * Show loading state on a button (spinner + optional text, disabled).
 * Injects spin keyframes if not present.
 * @param {HTMLButtonElement} btn
 * @param {string} loadingText e.g. "Filtering...", "Searching..."
 */
export function setLoading(btn, loadingText = "Loading...") {
    if (!btn) return;
    if (!document.getElementById("spinAnim")) {
        const style = document.createElement("style");
        style.id = "spinAnim";
        style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
    btn.dataset.originalContent = btn.innerHTML;
    btn.innerHTML = SPIN_SVG + loadingText;
    btn.disabled = true;
}

/**
 * Restore button to previous content and enabled state.
 * @param {HTMLButtonElement} btn
 */
export function restore(btn) {
    if (!btn) return;
    if (btn.dataset.originalContent) {
        btn.innerHTML = btn.dataset.originalContent;
        delete btn.dataset.originalContent;
    }
    btn.disabled = false;
}

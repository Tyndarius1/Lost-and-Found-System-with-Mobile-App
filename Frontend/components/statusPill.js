/**
 * Reusable status/badge pill for tables and cards.
 * @param {string} text Label to show (e.g. "PENDING", "LOST")
 * @returns {string} HTML string for the pill
 */
export function pill(text) {
    return `<span class="status-pill" style="padding:6px 10px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.06);font-size:12px;">${text}</span>`;
}

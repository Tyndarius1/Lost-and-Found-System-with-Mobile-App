/**
 * Reusable empty-state block for tables and grids.
 * @param {object} opts
 * @param {string} [opts.iconSvg] Optional SVG string
 * @param {string} opts.title
 * @param {string} [opts.description]
 * @param {string} [opts.actionHref]
 * @param {string} [opts.actionLabel]
 * @returns {string} HTML string
 */
export function renderEmptyState(opts) {
    const { iconSvg = "", title, description = "", actionHref = "", actionLabel = "" } = opts;
    const icon = iconSvg
        ? `<div class="empty-state-icon">${iconSvg}</div>`
        : "";
    const action = actionHref && actionLabel
        ? `<a href="${actionHref}" class="web-btn web-btn-primary" style="margin-top:8px;">${actionLabel}</a>`
        : "";
    return `
        <div class="empty-state" style="padding: 40px 24px;">
            ${icon}
            <p class="empty-state-title">${title}</p>
            ${description ? `<p class="empty-state-desc">${description}</p>` : ""}
            ${action}
        </div>
    `;
}

/** Default icon for "no reports" empty state */
export const emptyStateIcons = {
    noReports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:64px;height:64px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
};

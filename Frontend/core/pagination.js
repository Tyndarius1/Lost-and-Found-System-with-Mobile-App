/**
 * Pagination utilities for API responses (e.g. Laravel-style paginator).
 * Use from list pages (my-items, items, etc.) to normalize payloads and build next/prev paths.
 */
export function normalizePaginator(payload) {
    if (payload && Array.isArray(payload.data)) return payload;
    const arr = Array.isArray(payload) ? payload : [];
    return {
        data: arr,
        current_page: 1,
        last_page: 1,
        from: arr.length ? 1 : null,
        to: arr.length ?? null,
        total: arr.length ?? 0,
        next_page_url: null,
        prev_page_url: null,
    };
}

/**
 * Strip /api prefix from URL path so it can be passed to api.get(baseUrl + path).
 * @param {string|null} u Full URL or path
 * @returns {string|null}
 */
export function stripApiPrefix(u) {
    return u ? u.replace(/^\/api/, "") : null;
}

/**
 * Skeleton loading styles. Call once before rendering skeleton UI so keyframes exist.
 */
export function ensureSkeletonStyles() {
    if (document.getElementById("skeletonStyles")) return;
    const style = document.createElement("style");
    style.id = "skeletonStyles";
    style.textContent = `
        .skeleton-shimmer {
            background: linear-gradient(90deg, rgba(130,130,130,0.06) 25%, rgba(130,130,130,0.18) 50%, rgba(130,130,130,0.06) 75%);
            background-size: 200% 100%;
            animation: skeleton-load 1.5s infinite;
        }
        @keyframes skeleton-load {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
}

/** Single table row skeleton for items/reports tables (6 cells). */
export function tableRowSkeleton() {
    return `
    <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding:16px 24px;">
            <div class="skeleton-shimmer" style="height:16px; width:70%; border-radius:4px; margin-bottom: 6px;"></div>
            <div class="skeleton-shimmer" style="height:12px; width:20%; border-radius:4px;"></div>
        </td>
        <td style="padding:16px 24px;"><div class="skeleton-shimmer" style="height:24px; width:50px; border-radius:999px;"></div></td>
        <td style="padding:16px 24px;"><div class="skeleton-shimmer" style="height:24px; width:60px; border-radius:999px;"></div></td>
        <td style="padding:16px 24px;"><div class="skeleton-shimmer" style="height:16px; width:100px; border-radius:4px;"></div></td>
        <td style="padding:16px 24px;"><div class="skeleton-shimmer" style="height:16px; width:90px; border-radius:4px;"></div></td>
        <td style="padding:16px 24px;">
            <div style="display:flex; gap:8px;">
                <div class="skeleton-shimmer" style="height:32px; width:50px; border-radius:6px;"></div>
                <div class="skeleton-shimmer" style="height:32px; width:50px; border-radius:6px;"></div>
                <div class="skeleton-shimmer" style="height:32px; width:60px; border-radius:6px;"></div>
            </div>
        </td>
    </tr>
    `;
}

/** Card skeleton for grid (e.g. items browse). */
export function cardSkeleton() {
    return `
    <div class="web-card" style="padding:0; overflow:hidden; display:flex; flex-direction:column; gap:0; border-color: transparent; border-radius: 16px;">
        <div class="skeleton-shimmer" style="width: 100%; height: 220px; border-bottom: 1px solid var(--card-border);"></div>
        <div style="padding: 24px; display: flex; flex-direction: column; flex: 1;">
            <div class="skeleton-shimmer" style="height: 24px; border-radius: 6px; margin-bottom: 12px; width: 75%;"></div>
            <div class="skeleton-shimmer" style="height: 16px; border-radius: 4px; margin-bottom: 16px; width: 50%;"></div>
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom: 24px; margin-top: 8px;">
                <div class="skeleton-shimmer" style="height: 14px; border-radius: 4px; width: 100%;"></div>
                <div class="skeleton-shimmer" style="height: 14px; border-radius: 4px; width: 85%;"></div>
            </div>
            <div class="skeleton-shimmer" style="height: 48px; border-radius: 8px; margin-top: auto;"></div>
        </div>
    </div>
    `;
}

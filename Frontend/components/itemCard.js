import { ui } from "../core/ui.js";

/**
 * Renders a single item card for the browse feed (items grid).
 * @param {object} item Item with title, description, location, category, type, status, image_path, id
 * @returns {string} HTML string
 */
export function itemCard(item) {
    const statusClass = item.status || "default";
    const badgeBg = item.status === "pending" ? "rgba(255, 159, 10, 0.15)" :
        item.status === "matched" ? "rgba(94, 92, 230, 0.15)" :
            item.status === "claimed" ? "rgba(48, 209, 88, 0.15)" : "rgba(255,255,255,0.08)";
    const badgeColor = item.status === "pending" ? "#FF9F0A" :
        item.status === "matched" ? "#5E5CE6" :
            item.status === "claimed" ? "#30D158" : "#A1A1A6";
    const typeBg = item.type === "lost" ? "rgba(255, 69, 58, 0.15)" : "rgba(10, 132, 255, 0.15)";
    const typeColor = item.type === "lost" ? "#FF453A" : "#0A84FF";
    const img = item.image_path ? `/storage/${item.image_path}` : "";
    const title = ui.escapeHTML(item.title || "");
    const desc = ui.escapeHTML((item.description ?? "No description provided.").slice(0, 200));
    const location = ui.escapeHTML(item.location ?? "Unknown");
    const category = ui.escapeHTML(item.category ?? "Misc");

    return `
    <div class="web-card web-card-hoverable animate-in stagger-2" style="padding:0; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; gap:0;">
        <div style="width: 100%; height: 220px; background: rgba(0,0,0,0.5); position: relative; border-bottom: 1px solid var(--card-border); overflow: hidden;">
        ${img
        ? `<img src="${img}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/1d1d1f/white?text=No+Image&font=Inter';" alt="${title}" style="width:100%; height:100%; object-fit:cover; opacity: 0.9; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color: var(--text-muted); font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">No Image</div>`
    }
        <div style="position: absolute; top: 16px; left: 16px; display:flex; gap:8px; flex-wrap:wrap;">
            <span style="padding:4px 12px; border-radius:12px; background: ${typeBg}; color:${typeColor}; font-size:0.7rem; font-weight:600; letter-spacing:0.5px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.05);">
                ${(item.type || "").toUpperCase()}
            </span>
            <span style="padding:4px 12px; border-radius:12px; background: ${badgeBg}; color:${badgeColor}; font-size:0.7rem; font-weight:600; letter-spacing:0.5px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.05);">
                ${(item.status || "").toUpperCase()}
            </span>
        </div>
    </div>
    <div style="padding: 24px; display: flex; flex-direction: column; flex: 1; background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%);">
        <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0 0 12px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; letter-spacing: -0.01em;" title="${title}">
            ${title}
        </h3>
        <div style="display: flex; gap: 8px; color:var(--text-muted); font-size:0.8rem; font-weight: 500; letter-spacing: 0.5px; margin-bottom: 16px; align-items: center; text-transform: uppercase;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.7;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${location}</span>
            <span style="margin: 0 4px; opacity: 0.5;">•</span>
            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${category}</span>
        </div>
        <div style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin-bottom: 24px;">
            ${desc}
        </div>
        <button class="web-btn web-btn-glass" style="width: 100%; justify-content: center; margin-top: auto; padding: 12px 0; background: rgba(255,255,255,0.03);" data-open="${item.id}">
            View Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
        </button>
    </div>
    </div>
    `;
}

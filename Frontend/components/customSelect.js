/**
 * Custom dropdown (high-end-select) used on report and other forms.
 * Expects DOM: .high-end-select with .select-trigger, .select-trigger span, input[type=hidden], .select-options with div[data-value].
 */

/**
 * Initialize one custom select by container id.
 * @param {string} selectId ID of the .high-end-select container
 */
export function setupCustomSelect(selectId) {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;
    const trigger = selectEl.querySelector(".select-trigger");
    const hidden = selectEl.querySelector("input[type=hidden]");
    const display = selectEl.querySelector(".select-trigger span");
    const options = selectEl.querySelectorAll(".select-options div[data-value]");
    if (!trigger || !display || !options.length) return;

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".high-end-select").forEach((el) => {
            if (el !== selectEl) el.classList.remove("open");
        });
        selectEl.classList.toggle("open");
    });

    options.forEach((opt) => {
        opt.addEventListener("click", () => {
            const val = opt.getAttribute("data-value");
            if (hidden) hidden.value = val || "";
            display.textContent = val || "";
            trigger.classList.add("selected");
            selectEl.classList.remove("open");
        });
    });
}

/**
 * Initialize multiple custom selects and close on outside click.
 * @param {string[]} selectIds Array of container IDs
 */
export function initCustomSelects(selectIds) {
    selectIds.forEach((id) => setupCustomSelect(id));
    document.addEventListener("click", () => {
        document.querySelectorAll(".high-end-select").forEach((el) => el.classList.remove("open"));
    });
}

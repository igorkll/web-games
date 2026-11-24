function removeClassFromAllElements(className) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        element.classList.remove(className);
    });
}

function handle_pointerup(e) {
    if (e.pointerType !== "mouse") {
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    }
}

let enabled = false;

export function enable() {
    if (enabled) return;
    document.addEventListener("pointerup", handle_pointerup);
    enabled = true;
}

export function disable() {
    if (!enabled) return;
    document.removeEventListener("pointerup", handle_pointerup);
    enabled = false;
}

export function isEnabled() {
    return enabled;
}

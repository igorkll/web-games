function removeClassFromAllElements(className) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        element.classList.remove(className);
    });
}

function getElementsAt(x, y, all=false) {
    const elements = document.elementsFromPoint(x, y);
    return all ? elements : elements.slice(0, 1);
}

function handle_pointermove(e) {
    if (e.pointerType === "mouse") {
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.add("touch_hybrid_safe_hover-ts_active"));
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.add("touch_hybrid_safe_hover-ts_hover"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.add("touch_hybrid_safe_hover-ts_active-bubble"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.add("touch_hybrid_safe_hover-ts_hover-bubble"));
    } else {
        
    }
}

function handle_pointerup(e) {
    if (e.pointerType !== "mouse") {
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");
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

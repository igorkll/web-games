function removeClassFromAllElements(className) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        element.classList.remove(className);
    });
}

function getElementsAt(x, y, all=false) {
    const elements = document.elementsFromPoint(x, y);
    return all ? elements : elements.slice(0, 1);
}

function handle_pointerdown(e) {
    console.log("handle_pointerdown");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");
    
    getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active"));
    getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover"));
    getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active-bubble"));
    getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover-bubble"));
}

function handle_pointermove(e) {
    console.log("handle_pointermove");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");
    
    if (e.pointerType === "mouse") {
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active"));
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active-bubble"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover-bubble"));
    } else {
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover-bubble"));

        if (false) {
            getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active"));
            getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active-bubble"));
        }
    }
}

function handle_pointerup(e) {
    console.log("handle_pointerup");
    if (e.pointerType !== "mouse") {
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");
    }
}

function handle_pointercancel(e) {
    console.log("handle_pointercancel");
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
    document.addEventListener("pointerdown", handle_pointerdown);
    document.addEventListener("pointermove", handle_pointermove);
    document.addEventListener("pointerup", handle_pointerup);
    document.addEventListener("pointercancel", handle_pointercancel);
    enabled = true;
}

export function disable() {
    if (!enabled) return;
    document.removeEventListener("pointerdown", handle_pointerdown);
    document.removeEventListener("pointermove", handle_pointermove);
    document.removeEventListener("pointerup", handle_pointerup);
    document.removeEventListener("pointercancel", handle_pointercancel);
    enabled = false;
}

export function isEnabled() {
    return enabled;
}

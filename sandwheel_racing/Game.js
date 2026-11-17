import * as Three from 'three';
import * as Main from './Main.js';

// --------------------------------- car

const car = new Three.Group();
const body = new Three.Mesh(
    new Three.BoxGeometry(2, 0.7, 4),
    new Three.MeshStandardMaterial({ color: 0xff3333 })
);
car.add(body);

// --------------------------------- main

export function init() {
    Main.sunLight.position.set(50, 100, 50);

    Main.scene.background = new Three.Color(0x88ccff);
    Main.scene.add(car);
}

export function render(delta) {
    updateCamera(delta);
    updateControl(delta);
}

// --------------------------------- camera

const cameraOffset = new Three.Vector3(0, 4, -8);
const lookOffset = new Three.Vector3(0, 1, 0);

const cameraTarget = new Three.Vector3();
const lookTarget = new Three.Vector3();
const lerpLookTarget = new Three.Vector3();


function updateCamera(delta) {
    // pos
    const currentCameraOffset = cameraOffset.clone();
    currentCameraOffset.applyQuaternion(car.quaternion);
    cameraTarget.copy(car.position).add(currentCameraOffset);
    Main.camera.position.lerp(cameraTarget, 0.08);

    // look
    const currentLookOffset = lookOffset.clone();
    currentLookOffset.applyQuaternion(car.quaternion);
    lookTarget.copy(car.position).add(currentLookOffset);
    lerpLookTarget.lerp(lookTarget, 0.08);
    Main.camera.lookAt(lerpLookTarget);
}

// ----------------------------------- control

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    down: false,
    sprint: false
};

document.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "KeyW": keys.w = true; break;
        case "KeyA": keys.a = true; break;
        case "KeyS": keys.s = true; break;
        case "KeyD": keys.d = true; break;
        case "Space": keys.up = true; break;
        case "KeyC": keys.down = true; break;
        case "ShiftLeft": keys.sprint = true; break;
    }

    onDoubleSpace_keydown(e)
});

document.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyW": keys.w = false; break;
        case "KeyA": keys.a = false; break;
        case "KeyS": keys.s = false; break;
        case "KeyD": keys.d = false; break;
        case "Space": keys.up = false; break;
        case "KeyC": keys.down = false; break;
        case "ShiftLeft": keys.sprint = false; break;
    }

    onDoubleSpace_keyup(e)
});

function updateControl(delta) {

}

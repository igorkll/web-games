import * as Three from 'three';
import * as Main from './Main.js';

// --------------------------------- car

const car = new Three.Group();
const body = new Three.Mesh(
    new Three.BoxGeometry(2, 0.7, 4),
    new Three.MeshStandardMaterial({ color: 0xff3333 })
);
car.add(body);

// --------------------------------- camera vars

const cameraOffset = new Three.Vector3(0, 4, -8);
const lookOffset = new Three.Vector3(0, 1, 0);

const cameraTarget = new Three.Vector3();
const lookTarget = new Three.Vector3();

// ---------------------------------

export function init() {
    Main.sunLight.position.set(50, 100, 50);

    Main.scene.background = new Three.Color(0x88ccff);
    Main.scene.add(car);
}

function updateCamera() {
    // pos
    const currentCameraOffset = cameraOffset.clone();
    currentCameraOffset.applyQuaternion(car.quaternion);
    cameraTarget.copy(car.position).add(currentCameraOffset);
    Main.camera.position.lerp(cameraTarget, 0.08);

    // look
    const currentLookOffset = lookOffset.clone();
    currentLookOffset.applyQuaternion(car.quaternion);
    lookTarget.copy(car.position).add(currentLookOffset);
    Main.camera.lookAt(lookTarget);
}

export function render() {
    updateCamera();
}

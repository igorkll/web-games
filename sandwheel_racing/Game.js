import * as Three from 'three';
import * as Main from './Main.js';

const car = new Three.Group();

const body = new Three.Mesh(
    new Three.BoxGeometry(2, 0.7, 4),
    new Three.MeshStandardMaterial({ color: 0xff3333 })
);

car.add(body);

body.position.y = 0.7;

const cameraOffset = new Three.Vector3(0, 4, -8);
const cameraTarget = new Three.Vector3();
const lookTarget = new Three.Vector3();

export function init() {
    Main.sunLight.position.set(50, 100, 50);

    Main.scene.background = new Three.Color(0x88ccff);
    Main.scene.add(car);
}

function updateCamera() {
    const offset = cameraOffset.clone();
    offset.applyQuaternion(car.quaternion);
    cameraTarget.copy(car.position).add(offset);
    Main.camera.position.lerp(cameraTarget, 0.08);

    lookTarget.copy(car.position);
    lookTarget.y += 1;
    Main.camera.lookAt(lookTarget);
}

export function render() {
    updateCamera();
}

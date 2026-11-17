import * as Three from 'three';
import * as Main from './Main.js';

// --------------------------------- car

const car = new Three.Group();
const body = new Three.Mesh(
    new Three.BoxGeometry(2, 0.7, 4),
    new Three.MeshStandardMaterial({ color: 0xff3333 })
);
car.add(body);

// --------------------------------- functions

function getLerpValue(val, delta) {
    return 1 - Math.exp(-val * delta);
}

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
    Main.camera.position.lerp(cameraTarget, getLerpValue(8, delta));

    // look
    const currentLookOffset = lookOffset.clone();
    currentLookOffset.applyQuaternion(car.quaternion);
    lookTarget.copy(car.position).add(currentLookOffset);
    lerpLookTarget.lerp(lookTarget, getLerpValue(8, delta));
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
});

const velocity = new Three.Vector3();

const acceleration = 15;
const maxSpeed = 25;
const friction = 5;
const turnSpeed = 2;

function updateControl(delta) {
    const forward = keys.w ? 1 : 0;
    const backward = keys.s ? 1 : 0;

    // Разгон и торможение
    if (forward) velocity.z -= acceleration * delta;
    if (backward) velocity.z += acceleration * delta;

    // Ограничение скорости
    velocity.z = Three.MathUtils.clamp(
        velocity.z,
        -maxSpeed,
        maxSpeed
    );

    // Трение
    if (!forward && !backward) {
        velocity.z = Three.MathUtils.damp(
            velocity.z, 0, friction, delta
        );
    }

    // Поворот
    const speedFactor = Math.min(Math.abs(velocity.z) / maxSpeed, 1);

    if (keys.a) car.rotation.y += turnSpeed * speedFactor * delta;
    if (keys.d) car.rotation.y -= turnSpeed * speedFactor * delta;

    // Перемещение относительно направления машины
    const movement = new Three.Vector3(0, 0, velocity.z);
    movement.applyQuaternion(car.quaternion);

    car.position.addScaledVector(movement, delta);
}

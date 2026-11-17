import * as Three from 'three';
import * as Main from './Main.js';
import * as Road from './Road.js';
import * as Consts from './Consts.js';

// --------------------------------- car

const car = new Three.Group();
const body = new Three.Mesh(
    new Three.BoxGeometry(2, 0.7, 4),
    new Three.MeshStandardMaterial({ color: 0xff3333 })
);
car.add(body);

const hood = new Three.Mesh(
    new Three.BoxGeometry(1.5, 0.4, 1),
    new Three.MeshStandardMaterial({ color: 0xffff00 })
);
hood.position.set(0, 0.5, 1.5);
car.add(hood);

// --------------------------------- functions

function getLerpValue(val, delta) {
    return 1 - Math.exp(-val * delta);
}

// --------------------------------- main

function debugInit() {
    for (let ix = -5; ix < 5; ix++) {
        for (let iy = -5; iy < 5; iy++) {
            const debugCube = new Three.Mesh(
                new Three.BoxGeometry(1, 1, 1),
                new Three.MeshStandardMaterial({ color: 0xffffff })
            );
            debugCube.position.set(ix * 5, 0, iy * 5);
            Main.scene.add(debugCube);
        }
    }
}

let roadProcessTimer = 0;

export function init() {
    debugInit();

    Main.sunLight.position.set(50, 100, 50);

    Main.scene.background = new Three.Color(0x88ccff);
    Main.scene.add(car);

    resetControl();

    roadProcessTimer = 0;
    Road.process(0);

    Road.init();
}

export function render(delta) {
    roadProcessTimer += delta;

    if (roadProcessTimer > Consts.TILE_PROCESS_PER_TIME) {
        Road.process(delta);
        roadProcessTimer = 0;
    }
    
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
    Main.camera.position.lerp(cameraTarget, getLerpValue(15, delta));

    // look
    const currentLookOffset = lookOffset.clone();
    currentLookOffset.applyQuaternion(car.quaternion);
    lookTarget.copy(car.position).add(currentLookOffset);
    lerpLookTarget.lerp(lookTarget, getLerpValue(15, delta));
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

const gears = [3.8, 2.2, 1.4, 1.0, 0.8, 0.68];
let currentGear;
let velocity;
let acceleration;
let friction;
let brake;
let wheelBase;
let maxSteeringAngle;

function selectGear() {
    acceleration = 100 / gears[currentGear];
}

function resetControl() {
    currentGear = 0;

    velocity = new Three.Vector3();
    selectGear();
    friction = 20;
    brake = 50;

    wheelBase = 2.5;
    maxSteeringAngle = Three.MathUtils.degToRad(35);

    car.position.set(0, 0.7 / 2, 0);
}

function updateControl(delta) {
    // ------------------------------ velocity
    const forward = keys.w ? 1 : 0;
    const backward = keys.s ? 1 : 0;
    if (forward) velocity.z += acceleration * delta;
    if (backward) velocity.z -= acceleration * delta;

    const currentBrake = keys.up ? brake : 0;
    const deceleration = friction + currentBrake;

    velocity.z = Three.MathUtils.damp(
        velocity.z,
        0,
        deceleration / Math.max(Math.abs(velocity.z), 0.001),
        delta
    );

    // ------------------------------ rotation
    const steering = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);
    const steeringAngle = steering * maxSteeringAngle;
    const angularVelocity = velocity.z * Math.tan(steeringAngle) / wheelBase;
    car.rotation.y += angularVelocity * delta;

    // ------------------------------ movement
    const movement = new Three.Vector3(0, 0, velocity.z);
    movement.applyQuaternion(car.quaternion);
    car.position.addScaledVector(movement, delta);

    // ------------------------------ debug
    
    //console.log("position", car.position);
    //console.log("velocity", velocity);
}

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

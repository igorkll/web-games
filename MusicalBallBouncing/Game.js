import * as Three from 'three';
import * as Main from './Main.js';
import * as Consts from './Consts.js';
import * as Utils from './Utils.js';

// --------------------------------- ball

const texture = new Three.TextureLoader().load('./textures/ball.png');
const vertexShader = await fetch('./shaders/ball.vert').then(res => res.text());
const fragmentShader = await fetch('./shaders/ball.frag').then(res => res.text());

const material = new Three.ShaderMaterial({
    uniforms: {
        map: { value: texture },
        color1: { value: new Three.Color(0) },
        color2: { value: new Three.Color(0) }
    },

    vertexShader: vertexShader,
    fragmentShader: fragmentShader
});

const ball = new Three.Mesh(
    new Three.SphereGeometry(Consts.SPHERE_DIAMETER / 2, Consts.SPHERE_SEGMENTS, Consts.SPHERE_SEGMENTS),
    material
);

// --------------------------------- main

let current_rhythm = 0;
let current_running = false;
let current_height_pos = 0;
let current_height_vel = 0;
let current_time = 0;

function updateAmbientColor(color) {
    Main.scene.background = color;
    material.uniforms.color1.value.copy(color).multiplyScalar(7);
    material.uniforms.color2.value.copy(color).multiplyScalar(2);
}

export function init() {
    Main.sunLight.position.set(50, 100, 50);

    Main.scene.add(ball);

    updateAmbientColor(new Three.Color(0x29074b));
}

function jump() {
    current_height_vel = Consts.JUMP_FORCE;
}

export function render(delta) {
    current_time += delta;

    Main.camera.position.copy(Consts.CAMERA_POS);
    Main.camera.lookAt(Consts.CAMERA_LOOK);

    if (current_running) {
        if (current_height_pos <= Consts.GROUND_Y) {
            jump();
            current_height_pos = Consts.GROUND_Y
        }
    }

    current_height_vel -= Consts.GRAVITY * delta;
    current_height_pos += current_height_vel * delta;

    ball.position.set(0, current_height_pos, 0);
}

export function setRhythm(rhythm) {
    current_rhythm = rhythm;
}

export function start() {
    current_running = true;
    current_height_pos = 0;
    current_height_vel = 0;
    current_time = 0;
}

export function stop() {
    current_running = false;
}

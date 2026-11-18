import * as Three from 'three';
import * as Main from './Main.js';
import * as Consts from './Consts.js';
import * as Utils from './Utils.js';

const number_block = document.getElementById("number_block")

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
let current_pos = 0;
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

    Main.camera.position.set(Consts.CAMERA_POS.x, Consts.CAMERA_POS.y, Consts.CAMERA_POS.z + Main.additionalCameraOffset);
    Main.camera.lookAt(new Three.Vector3(Consts.CAMERA_LOOK.x, Consts.CAMERA_LOOK.y, Consts.CAMERA_LOOK.z + Main.additionalCameraOffset));

    if (current_running) {
        if (current_height_pos <= Consts.GROUND_Y) {
            jump();
            current_height_pos = Consts.GROUND_Y
        }
    }

    current_height_vel -= Consts.GRAVITY * delta;
    current_height_pos += current_height_vel * delta;

    if (!current_running) {
        if (current_height_pos < Consts.GROUND_Y) current_height_pos = Consts.GROUND_Y;
    }

    ball.position.set(current_pos * Consts.HOR_VIEW_SIZE, current_height_pos, 0);
}

export function setRhythm(rhythm) {
    current_rhythm = rhythm;
}

export function setPos(pos) {
    current_pos = pos;
}

function realStart() {
    current_running = true;
    current_height_pos = 0;
    current_height_vel = 0;
    current_time = 0;
    number_block.textContent = '';
}

export function start() {
    let timer = 4;
    let intervalId;
    const callback = () => {
        timer = timer - 1;
        number_block.textContent = timer;
        if (timer <= 0) {
            clearInterval(intervalId);
            realStart();
        }
    };
    callback();
    intervalId = setInterval(callback, 1000);
}

export function stop() {
    current_running = false;
}

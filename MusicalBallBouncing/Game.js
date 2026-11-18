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
let old_change_background_time = 0;

let current_palette;
let old_smoothed_ambient_color;
const palettes = [0x29074b, 0x074d1e, 0x07464d, 0x4d071e, 0x3c3a03];

function selectPalette() {
    let index;

    for (let i = 0; i < 50; i++) {
        index = Utils.randomInt(0, palettes.length - 1);
        if (index != current_palette) break;
    }

    return [palettes[index], index];
}

function updateAmbientColor(color) {
    Main.scene.background = color;
    material.uniforms.color1.value.copy(color).multiplyScalar(7);
    material.uniforms.color2.value.copy(color).multiplyScalar(2);
    old_smoothed_ambient_color = color;
}

function smoothedUpdateAmbientColor(color) {
    let old_color = old_smoothed_ambient_color;
    let value = 0;
    let needSteps = (1000 / Consts.CHANGE_BACKGROUND_SMOOTHED_TIMER) * Consts.CHANGE_BACKGROUND_SMOOTHED_SECONDS;
    let currentStep = 0;
    let intervalId;

    intervalId = setInterval(() => {
        currentStep++;
        value += 1 / needSteps;
        updateAmbientColor(old_color.clone().lerp(color, value));
        if (currentStep >= needSteps) clearInterval(intervalId);
    }, Consts.CHANGE_BACKGROUND_SMOOTHED_TIMER);

    old_smoothed_ambient_color = color;
}

function autoSelectAmbientColor() {
    const arr = selectPalette();
    current_palette = arr[1];

    const color = new Three.Color(arr[0]);

    if (old_smoothed_ambient_color) {
        smoothedUpdateAmbientColor(color);
    } else {
        updateAmbientColor(color);
    }
}

export function init() {
    Main.sunLight.position.set(50, 100, 50);

    Main.scene.add(ball);

    autoSelectAmbientColor();
}

function jump() {
    current_height_vel = Consts.JUMP_FORCE / current_rhythm;
}

function getBallLandingTime(platformY) {
    const y = current_height_pos;
    const v = current_height_vel;
    const g = Consts.GRAVITY * current_rhythm;

    const discriminant = v * v + 2 * g * (y - platformY);

    if (discriminant < 0 || g <= 0) return null;

    const t = (v + Math.sqrt(discriminant)) / g;

    return t;
}

export function render(delta) {
    current_time += delta;

    if (current_time > old_change_background_time + Consts.CHANGE_BACKGROUND_AFTER_TIME) {
        autoSelectAmbientColor();
        old_change_background_time = current_time;
    }

    Main.camera.position.set(Consts.CAMERA_POS.x, Consts.CAMERA_POS.y, Consts.CAMERA_POS.z + Main.additionalCameraOffset);
    Main.camera.lookAt(new Three.Vector3(Consts.CAMERA_LOOK.x, Consts.CAMERA_LOOK.y, Consts.CAMERA_LOOK.z + Main.additionalCameraOffset));

    if (current_running) {
        if (current_height_pos <= Consts.GROUND_Y) {
            jump();
            current_height_pos = Consts.GROUND_Y
        }
    }

    current_height_vel -= Consts.GRAVITY * current_rhythm * delta;
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

let startIntervalId;

export function start() {
    current_time = 0;

    autoSelectAmbientColor();

    let timer = 4;
    const callback = () => {
        timer = timer - 1;
        number_block.textContent = timer;
        if (timer <= 0) {
            clearInterval(startIntervalId);
            startIntervalId = null;
            realStart();
        }
    };
    callback();
    startIntervalId = setInterval(callback, 1000);
}

export function stop() {
    current_running = false;
    if (startIntervalId) {
        clearInterval(startIntervalId);
        startIntervalId = null;
    }
}

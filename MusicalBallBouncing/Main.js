import * as Three from 'three';
import * as Game from './Game.js';
import * as Consts from './Consts.js';
import * as Gui from './Gui.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ------------------------------------- init

export let additionalCameraOffset = 0;

export const clock = new Three.Clock();

export const scene = new Three.Scene()

export const renderer = new Three.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
})

export const composer = new EffectComposer(renderer);

document.body.appendChild(renderer.domElement);
Gui.setupCanvas(renderer.domElement);

// ------------------------------------- camera

function getVerticalFov(horizontalFov, aspect) {
    const hFov = Three.MathUtils.degToRad(horizontalFov);

    return Three.MathUtils.radToDeg(
        2 * Math.atan(Math.tan(hFov / 2) / aspect)
    );
}

const aspect = window.innerWidth / window.innerHeight;
export const camera = new Three.PerspectiveCamera(getVerticalFov(Consts.FOV, aspect), aspect, 0.1, 1000);

composer.addPass(
    new RenderPass(scene, camera)
);

const bloomPass = new UnrealBloomPass(
    new Three.Vector2(window.innerWidth, window.innerHeight),
    0.2,
    0.1,
    0
);

composer.addPass(bloomPass);

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    composer.setPixelRatio(window.devicePixelRatio);
    composer.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.fov = getVerticalFov(Consts.FOV, aspect);

    //additionalCameraOffset = Consts.HOR_VIEW_SIZE / 2 / aspect + 1.5;

    camera.updateProjectionMatrix();
}

resize();

// -------------------------------------

window.addEventListener('resize', resize);

let firstFrame = true;

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), Consts.MAX_DELTA);

    if (firstFrame) {
        Game.init();
        Gui.init();
        firstFrame = false;
    }

    Game.render(delta);

    composer.render();
}

animate();

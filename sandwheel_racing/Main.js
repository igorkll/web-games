import * as Three from 'three';
import * as Game from './Game.js';

// ------------------------------------- init

export const scene = new Three.Scene()

export const renderer = new Three.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
})

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// ------------------------------------- base objects

export const sunLight = new Three.DirectionalLight(0xffffff, 1.0); 
scene.add(sunLight)

export const ambientLight = new Three.AmbientLight(0xffffff)
scene.add(ambientLight)

export const camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

// -------------------------------------

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

let firstFrame = true;

function animate() {
    requestAnimationFrame(animate);

    if (firstFrame) {
        Game.init();
    }

    Game.render();

    renderer.render(scene, camera);
}

animate();

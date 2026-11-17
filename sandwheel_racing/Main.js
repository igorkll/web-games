import * as Three from 'three';

// ------------------------------------- init

const scene = new Three.Scene()
scene.background = new Three.Color(0x88ccff)

const renderer = new Three.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
})

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// ------------------------------------- base objects

const sunLight = new Three.DirectionalLight(0xffffff, 1.0); 
sunLight.position.set(50, 100, 50);
scene.add(sunLight)

const ambientLight = new Three.AmbientLight(0xffffff)
scene.add(ambientLight)

const camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

// -------------------------------------

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();

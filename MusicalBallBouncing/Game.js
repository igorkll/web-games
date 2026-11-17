import * as Three from 'three';
import * as Main from './Main.js';
import * as Consts from './Consts.js';

// --------------------------------- ball

const texture = new Three.TextureLoader().load('./textures/ball.png');

const material = new Three.MeshStandardMaterial({
    map: texture,
    color: 0xff0000,
    transparent: true
});

const ball = new Three.Mesh(
    new Three.SphereGeometry(Consts.SPHERE_DIAMETER / 2, Consts.SPHERE_SEGMENTS, Consts.SPHERE_SEGMENTS),
    new Three.MeshStandardMaterial({ color: 0xff3333 })
);

// --------------------------------- main

function updateAmbientColor(color) {

}

export function init() {
    Main.sunLight.position.set(50, 100, 50);

    Main.scene.background = new Three.Color(0x88ccff);
    Main.scene.add(ball);
}

export function render(delta) {
    Main.camera.position.copy(Consts.CAMERA_POS);
    Main.camera.lookAt(Consts.CAMERA_LOOK);
}

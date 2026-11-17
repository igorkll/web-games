import * as Three from 'three';
import * as Main from './Main.js';
import * as Game from './Game.js';
import * as Consts from './Consts.js';

let roadTiles = [];

function deleteRoadTile(roadTile) {
    Main.scene.remove(roadTile);
    roadTile.geometry.dispose();
    roadTile.material.dispose();
}

function createRoadTile(x, z) {
    const geometry = new Three.PlaneGeometry(Consts.TILE_SIZE, Consts.TILE_SIZE);
    const material = new Three.MeshStandardMaterial({
        color: 0x555555
    });

    const tile = new Three.Mesh(geometry, material);

    tile.rotation.x = -Math.PI / 2;
    tile.position.set(
        x * Consts.TILE_SIZE,
        0,
        z * Consts.TILE_SIZE
    );

    Main.scene.add(tile);

    return tile;
}

function recreateRoad() {
    roadTiles.forEach(roadTile => deleteRoadTile(roadTile));
    roadTiles = [];
}

export function init() {
    recreateRoad();
    createRoadTile(0, 0);
}

export function process(delta) {

}

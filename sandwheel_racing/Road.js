import * as Three from 'three';
import * as Main from './Main.js';
import * as Game from './Game.js';

let roadTiles = [];

function deleteRoadTile(roadTile) {
    Main.scene.remove(roadTile);
    roadTile.geometry.dispose();
}

function recreateRoad() {
    roadTiles.forEach(roadTile => deleteRoadTile(roadTile));
    roadTiles = [];
}

export function init() {
    recreateRoad();
}

export function process(delta) {

}

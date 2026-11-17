import * as Three from 'three';
import * as Main from './Main.js';

export function init() {
    Main.scene.background = new Three.Color(0x88ccff);
    Main.sunLight.position.set(50, 100, 50);
}

export function render() {
    
}

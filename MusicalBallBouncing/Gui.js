import * as Modals from './Modals.js';
import * as Utils from './Utils.js';
import * as Game from './Game.js';

const gui_base = document.getElementById("gui_base")

let _audio;

function stopGame() {
    if (_audio) {
        _audio.pause();
        _audio.currentTime = 0;
        _audio.removeAttribute('src');
        _audio.load();

        if (_audio._blobUrl) URL.revokeObjectURL(_audio._blobUrl);
        _audio = null;
    }

    Game.stop();

    gui_base.classList.remove("gui_base_hide");
}

function startGame(audio) {
    stopGame();

    audio.loop = true;
    audio.play();

    Game.setRhythm(1);
    Game.start();

    _audio = audio;

    gui_base.classList.add("gui_base_hide");
}

export function gameover() {
    stopGame();
}

export function init() {
    document.getElementById("import").addEventListener("click", () => {
        Modals.windowSelectFile("mp3", true).then(mp3data => {
            startGame(Utils.createAudioFromBuffer(mp3data));
        });
    })

    document.getElementById("test").addEventListener("click", () => {
        stopGame();
    })
}

export function setupCanvas(canvas) {
    canvas.addEventListener('pointermove', (event) => {
        Game.setPos((event.clientX / window.innerWidth) - 0.5);
    });
}

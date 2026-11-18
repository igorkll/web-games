import * as Modals from './Modals.js';
import * as Utils from './Utils.js';
import * as Game from './Game.js';

const gui_base = document.getElementById("gui_base")

let _audio;

function stopGame() {
    if (_audio) {
        Utils.stopAudio(_audio);
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
    Utils.playAudio("sounds/gameover.mp3");
}

export function init() {
    document.getElementById("import").addEventListener("click", () => {
        Modals.windowSelectFile("mp3", true).then(mp3data => {
            startGame(Utils.createAudioFromBuffer(mp3data));
        });
    })
}

export function setupCanvas(canvas) {
    const callback = (event) => {
        Game.setPos((event.clientX / window.innerWidth) - 0.5);
    };

    canvas.addEventListener('pointermove', callback);
    canvas.addEventListener('pointerdown', callback);
}

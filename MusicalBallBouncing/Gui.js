import * as Modals from './Modals.js';
import * as Utils from './Utils.js';
import * as Game from './Game.js';
import * as musicList from './music/musicList.js';

const gui_base = document.getElementById("gui_base")
const gui_music_list = document.getElementById("gui_music_list")

let _audio;

function stopGame() {
    if (_audio) {
        Utils.stopAudio(_audio);
        _audio = null;
    }

    Game.stop();

    gui_base.classList.remove("gui_base_hide");
}

function startGame(musicItem) {
    stopGame();

    let audio;
    if (musicItem.url) {
        audio = new Audio(musicItem.url);
    } else {
        //Utils.createAudioFromBuffer(mp3data)
    }

    audio.loop = true;
    audio.play();

    Game.setRhythm(1.1);
    Game.start();

    _audio = audio;

    gui_base.classList.add("gui_base_hide");
}

export function gameover() {
    stopGame();
    Utils.playAudio("sounds/gameover.mp3");
}

function addMusicToList(musicItem) {
    const item = document.createElement("div")
    item.classList.add("gui_music_item")
    item.textContent = musicItem.title;

    gui_music_list.appendChild(item);
}

function refreshMusicList() {
    gui_music_list.innerHTML = "";

    musicList.list.forEach(musicItem => addMusicToList(musicItem));
}

export function init() {
    document.getElementById("import").addEventListener("click", () => {
        Modals.windowSelectFile("mp3", true).then(mp3data => {
            startGame(Utils.createAudioFromBuffer(mp3data));
        });
    })

    refreshMusicList()
}

export function setupCanvas(canvas) {
    const callback = (event) => {
        Game.setPos((event.clientX / window.innerWidth) - 0.5);
    };

    canvas.addEventListener('pointermove', callback);
    canvas.addEventListener('pointerdown', callback);
}

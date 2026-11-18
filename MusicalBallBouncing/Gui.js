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
        console.log(musicItem.url, new URL(musicItem.url, import.meta.url).href)
        audio = new Audio(new URL(musicItem.url, import.meta.url).href);
    } else if (musicItem.mp3data) {
        audio = Utils.createAudioFromBuffer(musicItem.mp3data);
    }

    audio.loop = true;
    audio.play();

    Game.setRhythm(musicItem.rhythm);
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

    item.addEventListener("click", () => startGame(musicItem));

    gui_music_list.appendChild(item);
}

function refreshMusicList() {
    gui_music_list.innerHTML = "";

    musicList.list.forEach(musicItem => addMusicToList(musicItem));
}

export function init() {
    document.getElementById("import").addEventListener("click", () => {
        Modals.windowSelectFile("mp3", true).then(mp3data => {
            startGame({mp3data, rhythm: 1.2});
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

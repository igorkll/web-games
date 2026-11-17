import * as Modals from './Modals.js';
import * as Utils from './Utils.js';

export function init() {
    document.getElementById("import").addEventListener("click", () => {
        Modals.windowSelectFile("mp3", true).then(mp3data => {
            const audio = Utils.createAudioFromBuffer(mp3data);
            audio.loop = true;
            audio.play();
        });
    })
}

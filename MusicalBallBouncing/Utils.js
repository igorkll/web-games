export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

export function createAudioFromBuffer(mp3Data) {
    const blob = new Blob([mp3Data], {
        type: 'audio/mpeg'
    });

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio._blobUrl = url;
    return audio;
}

export function playAudio(audio) {
    audio.addEventListener("ended", audio >= stopAudio(audio))

    audio.loop = false;
    audio.play();
}

export function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute('src');
    audio.load();
    if (audio._blobUrl) URL.revokeObjectURL(audio._blobUrl);
}

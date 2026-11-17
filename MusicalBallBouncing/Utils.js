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
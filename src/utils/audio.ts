export default function playAudio(file: string) {
  const audio = document.createElement('audio');

  audio.src = `/assets/pokerking/sounds/${file}`;
  audio.autoplay = true;

  document.body.appendChild(audio); // add the audio element to the DOM

  audio.addEventListener('ended', () => {
    document.body.removeChild(audio); // remove the audio element from the DOM when playback is done
  });
}

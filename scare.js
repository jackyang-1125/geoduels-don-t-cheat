window.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('keydown', (e) => e.preventDefault());

window.focus();
window.addEventListener('blur', () => {
  setTimeout(() => {
    window.focus();
  }, 10);
});

const AUDIO_FILE = "Generated Audio September 05, 2026 - 8_03PM.wav";
const audioPool = [];
let isStarted = false;

function spawnDelayedTrack(delayMs, playbackRate) {
  setTimeout(() => {
    try {
      const sound = new Audio(AUDIO_FILE);
      sound.loop = true;
      sound.volume = 1.0;
      sound.playbackRate = playbackRate;
      sound.play().catch(() => {});
      audioPool.push(sound);
    } catch (err) {}
  }, delayMs);
}

function launchChaoticAudioSwarm() {
  if (isStarted) return;
  isStarted = true;

  spawnDelayedTrack(0, 1.0);

  const staggerSchedule = [
    { delay: 1200, rate: 0.96 },
    { delay: 2400, rate: 1.04 },
    { delay: 3500, rate: 0.92 },
    { delay: 4600, rate: 1.08 },
    { delay: 5800, rate: 0.88 },
    { delay: 6900, rate: 1.12 },
    { delay: 8000, rate: 0.95 },
    { delay: 9200, rate: 1.05 },
    { delay: 10500, rate: 1.15 }
  ];

  staggerSchedule.forEach((item) => {
    spawnDelayedTrack(item.delay, item.rate);
  });

  launchChaoticVoices();
}

function launchChaoticVoices() {
  if (typeof speechSynthesis === 'undefined') return;

  const phrases = [
    "DON'T CHEAT.",
    "I SEE YOU.",
    "DON'T LOOK AWAY.",
    "THERE IS NO ESCAPE.",
    "DON'T CHEAT."
  ];

  let count = 0;
  const interval = setInterval(() => {
    if (count >= 15) {
      clearInterval(interval);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(phrases[count % phrases.length]);
    utterance.pitch = 0.05 + ((count * 0.11) % 0.9);
    utterance.rate = 0.45 + (Math.random() * 0.35);
    utterance.volume = 1.0;

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[count % voices.length];
    }

    window.speechSynthesis.speak(utterance);
    count++;
  }, 1100);
}

window.addEventListener('DOMContentLoaded', launchChaoticAudioSwarm);
window.addEventListener('load', launchChaoticAudioSwarm);
window.addEventListener('pointerdown', launchChaoticAudioSwarm);
window.addEventListener('click', launchChaoticAudioSwarm);
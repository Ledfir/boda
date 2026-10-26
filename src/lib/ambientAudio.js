/**
 * Música ambiental: una sola instancia de audio para toda la invitación,
 * de modo que la canción nunca se reinicia al desplazarse entre secciones.
 */

let element = null;
let state = { available: false, playing: false, muted: false, volume: 0.35 };
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener(state));
}

export function subscribeAmbient(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAmbientState() {
  return state;
}

export function setupAmbient({ src, volume = 0.35 }) {
  if (!src) {
    state = { ...state, available: false, playing: false };
    emit();
    return;
  }
  if (!element) {
    element = new Audio(src);
    element.loop = true;
    element.preload = 'auto';
  }
  element.volume = Math.min(1, Math.max(0, volume));
  element.muted = false;
  state = { available: true, playing: false, muted: false, volume: element.volume };
  emit();
}

export function playAmbient() {
  if (!element) return;
  element
    .play()
    .then(() => {
      state = { ...state, playing: true, muted: false };
      emit();
    })
    .catch(() => {
      state = { ...state, playing: false };
      emit();
    });
}

export function pauseAmbient() {
  if (!element) return;
  element.pause();
  state = { ...state, playing: false };
  emit();
}

export function toggleAmbient() {
  if (!element) return;
  if (element.paused) playAmbient();
  else pauseAmbient();
}

export function setAmbientVolume(volume) {
  if (!element) return;
  element.volume = volume;
  state = { ...state, volume };
  emit();
}

export function updateAmbientTrack({ src, title, artist, volume = 0.35 }) {
  if (element) {
    element.pause();
    element = null;
  }
  state = { ...state, title, artist };
  setupAmbient({ src, volume });
}
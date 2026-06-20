import { SOUND_ASSETS } from './soundAssets';
import type { SoundEventKey } from './soundEvents';
import type { SettingsState } from '../game/types';

const audioCache = new Map<SoundEventKey, HTMLAudioElement | null>();
const lastPlayedAt = new Map<SoundEventKey, number>();

function getAudio(eventKey: SoundEventKey): HTMLAudioElement | null {
  if (audioCache.has(eventKey)) return audioCache.get(eventKey) ?? null;
  if (typeof Audio === 'undefined') {
    audioCache.set(eventKey, null);
    return null;
  }
  const asset = SOUND_ASSETS[eventKey];
  const audio = new Audio(asset.path);
  audio.preload = 'auto';
  audio.addEventListener('error', () => audioCache.set(eventKey, null), { once: true });
  audioCache.set(eventKey, audio);
  return audio;
}

export function playSound(eventKey: SoundEventKey, settings: SettingsState): void {
  if (settings.muted || settings.masterVolume <= 0 || settings.sfxVolume <= 0) return;
  const asset = SOUND_ASSETS[eventKey];
  const now = Date.now();
  if (now - (lastPlayedAt.get(eventKey) ?? 0) < asset.cooldownMs) return;
  const audio = getAudio(eventKey);
  if (!audio) return;
  lastPlayedAt.set(eventKey, now);
  audio.currentTime = 0;
  audio.volume = Math.max(0, Math.min(1, settings.masterVolume * settings.sfxVolume));
  audio.play().catch(() => {
    audioCache.set(eventKey, null);
  });
}

export function getSoundAssetStatus(): Array<{ eventKey: SoundEventKey; path: string; loaded: boolean }> {
  return Object.values(SOUND_ASSETS).map((asset) => ({
    eventKey: asset.eventKey,
    path: asset.path,
    loaded: audioCache.get(asset.eventKey) instanceof HTMLAudioElement
  }));
}

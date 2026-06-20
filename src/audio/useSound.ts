import { useCallback } from 'react';
import type { SettingsState } from '../game/types';
import { playSound } from './soundManager';
import type { SoundEventKey } from './soundEvents';

export function useSound(settings: SettingsState) {
  return useCallback((eventKey: SoundEventKey) => playSound(eventKey, settings), [settings]);
}

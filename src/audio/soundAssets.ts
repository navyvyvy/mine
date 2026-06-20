import type { SoundEventKey } from './soundEvents';

export type SoundAsset = {
  eventKey: SoundEventKey;
  path: string;
  cooldownMs: number;
};

export const SOUND_ASSETS: Record<SoundEventKey, SoundAsset> = {
  mine_aim: { eventKey: 'mine_aim', path: '/audio/mine-aim.ogg', cooldownMs: 90 },
  mine_impact: { eventKey: 'mine_impact', path: '/audio/mine-impact.ogg', cooldownMs: 80 },
  block_break: { eventKey: 'block_break', path: '/audio/block-break.ogg', cooldownMs: 120 },
  resource_gain: { eventKey: 'resource_gain', path: '/audio/resource-gain.ogg', cooldownMs: 70 },
  face_advance: { eventKey: 'face_advance', path: '/audio/face-advance.ogg', cooldownMs: 300 },
  reward_open: { eventKey: 'reward_open', path: '/audio/reward-open.ogg', cooldownMs: 300 },
  reward_select: { eventKey: 'reward_select', path: '/audio/reward-select.ogg', cooldownMs: 200 },
  core_unlock: { eventKey: 'core_unlock', path: '/audio/core-unlock.ogg', cooldownMs: 250 },
  ui_click: { eventKey: 'ui_click', path: '/audio/ui-click.ogg', cooldownMs: 60 },
  chapter_clear: { eventKey: 'chapter_clear', path: '/audio/chapter-clear.ogg', cooldownMs: 500 }
};

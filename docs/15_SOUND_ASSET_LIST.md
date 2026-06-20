# Sound Asset List / 사운드 에셋 목록

## 1. Purpose

This document defines the sound event keys, file path structure, and runtime sound manager requirements for Endless Mine.

MVP does not require final audio files.

However, the implementation must include the sound event system and asset mapping so that adding files later is enough to test sounds.

## 2. Sound Strategy

MVP sound strategy:

```text
event keys first
file-replaceable later
safe no-op when files are missing
```

Every important feedback moment should call `playSound(eventKey)`.

If the mapped audio file does not exist, the sound manager must fail silently.

This allows the project to ship with no sound files and later test sound by dropping files into the expected folders.

## 3. Directory Structure

Recommended structure:

```text
src/assets/audio/
  sfx/
    mining/
    resources/
    reward/
    mining-core/
    ui/
    offline/
    chapter/
```

Recommended code files:

```text
src/audio/soundEvents.ts
src/audio/soundAssets.ts
src/audio/soundManager.ts
src/audio/useSound.ts
```

## 4. File Format Rule

Preferred format:

```text
.ogg
```

Optional fallback:

```text
.mp3
```

The sound asset map may list multiple candidate files per event.

The manager should try candidates in order and play the first successfully loaded source.

## 5. Runtime Types

Recommended type:

```ts
type SoundEventKey =
  | 'PICKAXE_SWING'
  | 'BLOCK_HIT_DIRT'
  | 'BLOCK_HIT_STONE'
  | 'BLOCK_HIT_ORE'
  | 'BLOCK_HIT_DIAMOND_CORE'
  | 'CRACK_STAGE_1'
  | 'CRACK_STAGE_2'
  | 'CRACK_STAGE_3'
  | 'CRACK_STAGE_4'
  | 'BLOCK_BREAK_DIRT'
  | 'BLOCK_BREAK_STONE'
  | 'BLOCK_BREAK_ORE'
  | 'BLOCK_BREAK_RARE'
  | 'BLOCK_BREAK_DIAMOND_CORE'
  | 'FACE_CLEAR'
  | 'FACE_ADVANCE_START'
  | 'FACE_ADVANCE_WHOOSH'
  | 'FACE_ADVANCE_SETTLE'
  | 'RESOURCE_POP'
  | 'RESOURCE_FLY'
  | 'RESOURCE_HUD_PULSE'
  | 'RESOURCE_GAIN_COMMON'
  | 'RESOURCE_GAIN_ORE'
  | 'RESOURCE_GAIN_RARE'
  | 'RESOURCE_GAIN_DIAMOND'
  | 'BONUS_RESOURCE_GAIN'
  | 'REWARD_ENCOUNTER_OPEN'
  | 'REWARD_CARD_REVEAL'
  | 'REWARD_CARD_HOVER'
  | 'REWARD_SELECT'
  | 'REWARD_APPLY_PICKAXE'
  | 'REWARD_APPLY_LANTERN'
  | 'REWARD_APPLY_GLOVES'
  | 'REWARD_APPLY_MATERIAL'
  | 'TEMP_EFFECT_CHIP_SHOW'
  | 'NODE_HOVER'
  | 'NODE_SELECT'
  | 'NODE_UNLOCK_COMMON'
  | 'NODE_UNLOCK_MAGIC'
  | 'NODE_UNLOCK_RARE'
  | 'NODE_UNLOCK_UNIQUE'
  | 'NODE_UNLOCK_CENTER'
  | 'NODE_AFFORDABLE_PULSE'
  | 'BRANCH_RESET'
  | 'FULL_CORE_RESET'
  | 'EQUIPMENT_TIER_CHANGED'
  | 'AUTO_ON'
  | 'AUTO_OFF'
  | 'PANEL_OPEN'
  | 'PANEL_CLOSE'
  | 'BUTTON_TAP'
  | 'SETTINGS_OPEN'
  | 'SETTINGS_CLOSE'
  | 'OFFLINE_REWARD_OPEN'
  | 'OFFLINE_REWARD_CONFIRM'
  | 'LAYER_UNLOCK'
  | 'DIAMOND_CORE_APPEAR'
  | 'CHAPTER_CLEAR';
```

Recommended sound asset shape:

```ts
type SoundAssetRef = {
  key: SoundEventKey;
  group: SoundGroup;
  files: string[];
  volume?: number;
  cooldownMs?: number;
  randomPitch?: {
    min: number;
    max: number;
  };
};

type SoundGroup =
  | 'MINING'
  | 'RESOURCE'
  | 'REWARD'
  | 'MINING_CORE'
  | 'UI'
  | 'OFFLINE'
  | 'CHAPTER';
```

## 6. Sound Manager Requirements

The sound manager must provide:

```ts
playSound(eventKey: SoundEventKey): void
preloadSound(eventKey: SoundEventKey): Promise<void>
setMasterVolume(value: number): void
setSfxVolume(value: number): void
setMuted(value: boolean): void
```

Rules:

- missing files no-op safely
- missing eventKey no-op safely
- muted state prevents playback
- masterVolume applies to all sound
- sfxVolume applies to SFX
- cooldownMs prevents spam
- randomPitch adds small variation for repeated hits
- repeated mining sounds should not overlap too heavily
- UI sounds should be short and low volume

## 7. Settings Integration

Settings Panel includes:

- Master Volume
- SFX Volume
- Mute

Saved settings:

```ts
type SettingsSaveData = {
  masterVolume: number;
  sfxVolume: number;
  muted: boolean;
  reducedMotion: boolean;
  resourceFlyText: boolean;
  debugPanelEnabled: boolean;
  autoMiningEnabled: boolean;
};
```

Default values:

```ts
masterVolume = 0.8
sfxVolume = 0.8
muted = false
```

## 8. Mining Sound Events

### PICKAXE_SWING

Usage:
every pickaxe swing before impact.

Files:

```text
src/assets/audio/sfx/mining/pickaxe_swing_01.ogg
src/assets/audio/sfx/mining/pickaxe_swing_02.ogg
src/assets/audio/sfx/mining/pickaxe_swing_03.ogg
```

Settings:

```text
group = MINING
volume = 0.45
cooldownMs = 80
randomPitch = 0.96~1.04
```

### BLOCK_HIT_DIRT

Usage:
hit DIRT_BLOCK.

Files:

```text
src/assets/audio/sfx/mining/block_hit_dirt_01.ogg
src/assets/audio/sfx/mining/block_hit_dirt_02.ogg
```

### BLOCK_HIT_STONE

Usage:
hit STONE_BLOCK.

Files:

```text
src/assets/audio/sfx/mining/block_hit_stone_01.ogg
src/assets/audio/sfx/mining/block_hit_stone_02.ogg
src/assets/audio/sfx/mining/block_hit_stone_03.ogg
```

### BLOCK_HIT_ORE

Usage:
hit ore blocks.

Files:

```text
src/assets/audio/sfx/mining/block_hit_ore_01.ogg
src/assets/audio/sfx/mining/block_hit_ore_02.ogg
```

### BLOCK_HIT_DIAMOND_CORE

Usage:
hit DIAMOND_CORE_BLOCK.

Files:

```text
src/assets/audio/sfx/mining/block_hit_diamond_core_01.ogg
src/assets/audio/sfx/mining/block_hit_diamond_core_02.ogg
```

### CRACK_STAGE_1

Usage:
crack stage reaches 1.

Files:

```text
src/assets/audio/sfx/mining/crack_stage_1.ogg
```

### CRACK_STAGE_2

Usage:
crack stage reaches 2.

Files:

```text
src/assets/audio/sfx/mining/crack_stage_2.ogg
```

### CRACK_STAGE_3

Usage:
crack stage reaches 3.

Files:

```text
src/assets/audio/sfx/mining/crack_stage_3.ogg
```

### CRACK_STAGE_4

Usage:
crack stage reaches 4.

Files:

```text
src/assets/audio/sfx/mining/crack_stage_4.ogg
```

### BLOCK_BREAK_DIRT

Usage:
DIRT_BLOCK breaks.

Files:

```text
src/assets/audio/sfx/mining/block_break_dirt.ogg
```

### BLOCK_BREAK_STONE

Usage:
STONE_BLOCK breaks.

Files:

```text
src/assets/audio/sfx/mining/block_break_stone_01.ogg
src/assets/audio/sfx/mining/block_break_stone_02.ogg
```

### BLOCK_BREAK_ORE

Usage:
common ore block breaks.

Files:

```text
src/assets/audio/sfx/mining/block_break_ore_01.ogg
src/assets/audio/sfx/mining/block_break_ore_02.ogg
```

### BLOCK_BREAK_RARE

Usage:
rare ore block breaks, such as CRYSTAL or DIAMOND.

Files:

```text
src/assets/audio/sfx/mining/block_break_rare.ogg
```

### BLOCK_BREAK_DIAMOND_CORE

Usage:
DIAMOND_CORE_BLOCK breaks.

Files:

```text
src/assets/audio/sfx/mining/block_break_diamond_core.ogg
```

### FACE_CLEAR

Usage:
all 9 cells are broken.

Files:

```text
src/assets/audio/sfx/mining/face_clear.ogg
```

### FACE_ADVANCE_START

Usage:
inward transition begins.

Files:

```text
src/assets/audio/sfx/mining/face_advance_start.ogg
```

### FACE_ADVANCE_WHOOSH

Usage:
camera pushes deeper into the mine.

Files:

```text
src/assets/audio/sfx/mining/face_advance_whoosh.ogg
```

### FACE_ADVANCE_SETTLE

Usage:
new Mining Face settles into view.

Files:

```text
src/assets/audio/sfx/mining/face_advance_settle.ogg
```

## 9. Resource Sound Events

### RESOURCE_POP

Usage:
resource icon pops from broken block.

Files:

```text
src/assets/audio/sfx/resources/resource_pop.ogg
```

### RESOURCE_FLY

Usage:
resource flies toward HUD.

Files:

```text
src/assets/audio/sfx/resources/resource_fly.ogg
```

### RESOURCE_HUD_PULSE

Usage:
HUD resource number pulses.

Files:

```text
src/assets/audio/sfx/resources/resource_hud_pulse.ogg
```

### RESOURCE_GAIN_COMMON

Usage:
STONE, COAL, COPPER gain.

Files:

```text
src/assets/audio/sfx/resources/resource_gain_common.ogg
```

### RESOURCE_GAIN_ORE

Usage:
IRON, GOLD gain.

Files:

```text
src/assets/audio/sfx/resources/resource_gain_ore.ogg
```

### RESOURCE_GAIN_RARE

Usage:
CRYSTAL gain.

Files:

```text
src/assets/audio/sfx/resources/resource_gain_rare.ogg
```

### RESOURCE_GAIN_DIAMOND

Usage:
DIAMOND gain.

Files:

```text
src/assets/audio/sfx/resources/resource_gain_diamond.ogg
```

### BONUS_RESOURCE_GAIN

Usage:
bonus +1 reward succeeds.

Files:

```text
src/assets/audio/sfx/resources/bonus_resource_gain.ogg
```

## 10. Reward Sound Events

### REWARD_ENCOUNTER_OPEN

Usage:
Reward Encounter overlay opens.

Files:

```text
src/assets/audio/sfx/reward/reward_encounter_open.ogg
```

### REWARD_CARD_REVEAL

Usage:
each reward card appears.

Files:

```text
src/assets/audio/sfx/reward/reward_card_reveal.ogg
```

### REWARD_CARD_HOVER

Usage:
hover or focus reward card.

Files:

```text
src/assets/audio/sfx/reward/reward_card_hover.ogg
```

### REWARD_SELECT

Usage:
player selects a reward.

Files:

```text
src/assets/audio/sfx/reward/reward_select.ogg
```

### REWARD_APPLY_PICKAXE

Usage:
Pickaxe reward applies.

Files:

```text
src/assets/audio/sfx/reward/reward_apply_pickaxe.ogg
```

### REWARD_APPLY_LANTERN

Usage:
Lantern reward applies.

Files:

```text
src/assets/audio/sfx/reward/reward_apply_lantern.ogg
```

### REWARD_APPLY_GLOVES

Usage:
Gloves reward applies.

Files:

```text
src/assets/audio/sfx/reward/reward_apply_gloves.ogg
```

### REWARD_APPLY_MATERIAL

Usage:
Material reward applies.

Files:

```text
src/assets/audio/sfx/reward/reward_apply_material.ogg
```

### TEMP_EFFECT_CHIP_SHOW

Usage:
Temporary effect chip appears.

Files:

```text
src/assets/audio/sfx/reward/temp_effect_chip_show.ogg
```

## 11. Mining Core Sound Events

### NODE_HOVER

Usage:
node hover/focus.

Files:

```text
src/assets/audio/sfx/mining-core/node_hover.ogg
```

### NODE_SELECT

Usage:
node selected.

Files:

```text
src/assets/audio/sfx/mining-core/node_select.ogg
```

### NODE_UNLOCK_COMMON

Usage:
COMMON node unlock.

Files:

```text
src/assets/audio/sfx/mining-core/node_unlock_common.ogg
```

### NODE_UNLOCK_MAGIC

Usage:
MAGIC node unlock.

Files:

```text
src/assets/audio/sfx/mining-core/node_unlock_magic.ogg
```

### NODE_UNLOCK_RARE

Usage:
RARE node unlock.

Files:

```text
src/assets/audio/sfx/mining-core/node_unlock_rare.ogg
```

### NODE_UNLOCK_UNIQUE

Usage:
UNIQUE node unlock.

Files:

```text
src/assets/audio/sfx/mining-core/node_unlock_unique.ogg
```

### NODE_UNLOCK_CENTER

Usage:
CENTER node unlock or initial activation.

Files:

```text
src/assets/audio/sfx/mining-core/node_unlock_center.ogg
```

### NODE_AFFORDABLE_PULSE

Usage:
affordable node pulse, low frequency.

Files:

```text
src/assets/audio/sfx/mining-core/node_affordable_pulse.ogg
```

### BRANCH_RESET

Usage:
branch reset confirmed.

Files:

```text
src/assets/audio/sfx/mining-core/branch_reset.ogg
```

### FULL_CORE_RESET

Usage:
full Mining Core reset confirmed.

Files:

```text
src/assets/audio/sfx/mining-core/full_core_reset.ogg
```

### EQUIPMENT_TIER_CHANGED

Usage:
equipment/core visual tier changes.

Files:

```text
src/assets/audio/sfx/mining-core/equipment_tier_changed.ogg
```

## 12. UI Sound Events

### AUTO_ON

Usage:
AUTO toggled on.

Files:

```text
src/assets/audio/sfx/ui/auto_on.ogg
```

### AUTO_OFF

Usage:
AUTO toggled off.

Files:

```text
src/assets/audio/sfx/ui/auto_off.ogg
```

### PANEL_OPEN

Usage:
generic panel opens.

Files:

```text
src/assets/audio/sfx/ui/panel_open.ogg
```

### PANEL_CLOSE

Usage:
generic panel closes.

Files:

```text
src/assets/audio/sfx/ui/panel_close.ogg
```

### BUTTON_TAP

Usage:
generic button tap.

Files:

```text
src/assets/audio/sfx/ui/button_tap.ogg
```

### SETTINGS_OPEN

Usage:
Settings Panel opens.

Files:

```text
src/assets/audio/sfx/ui/settings_open.ogg
```

### SETTINGS_CLOSE

Usage:
Settings Panel closes.

Files:

```text
src/assets/audio/sfx/ui/settings_close.ogg
```

## 13. Offline and Chapter Sound Events

### OFFLINE_REWARD_OPEN

Usage:
Offline Reward popup opens.

Files:

```text
src/assets/audio/sfx/offline/offline_reward_open.ogg
```

### OFFLINE_REWARD_CONFIRM

Usage:
Offline Reward confirmed.

Files:

```text
src/assets/audio/sfx/offline/offline_reward_confirm.ogg
```

### LAYER_UNLOCK

Usage:
new layer reached.

Files:

```text
src/assets/audio/sfx/chapter/layer_unlock.ogg
```

### DIAMOND_CORE_APPEAR

Usage:
Chapter Core Face appears at chapterClearDepthM.

Files:

```text
src/assets/audio/sfx/chapter/diamond_core_appear.ogg
```

### CHAPTER_CLEAR

Usage:
Chapter Clear overlay appears.

Files:

```text
src/assets/audio/sfx/chapter/chapter_clear.ogg
```

## 14. Sound Asset Map Example

```ts
export const soundAssets: Record<SoundEventKey, SoundAssetRef> = {
  PICKAXE_SWING: {
    key: 'PICKAXE_SWING',
    group: 'MINING',
    files: [
      '/assets/audio/sfx/mining/pickaxe_swing_01.ogg',
      '/assets/audio/sfx/mining/pickaxe_swing_02.ogg',
      '/assets/audio/sfx/mining/pickaxe_swing_03.ogg',
    ],
    volume: 0.45,
    cooldownMs: 80,
    randomPitch: { min: 0.96, max: 1.04 },
  },
  NODE_UNLOCK_UNIQUE: {
    key: 'NODE_UNLOCK_UNIQUE',
    group: 'MINING_CORE',
    files: [
      '/assets/audio/sfx/mining-core/node_unlock_unique.ogg',
    ],
    volume: 0.8,
    cooldownMs: 200,
  },
};
```

## 15. Debug Panel Sound Test

Debug Panel should include a Sound Test section.

Show:

- masterVolume
- sfxVolume
- muted
- list of SoundEventKey values
- whether each event has a loaded file
- play test button per event

Controls:

- play selected event
- play mining sample sequence
- play reward sample sequence
- play Mining Core unlock sample sequence
- mute/unmute
- set volume

## 16. Validation

Manual validation:

- playSound does not crash when files are missing
- dropping an `.ogg` file at the mapped path allows immediate playback
- mute disables all sounds
- volume sliders affect playback
- repeated mining hits do not create excessive overlap
- Debug Panel can test every event key

## MVP Sound Style Decision

MVP sound direction is ordinary game mining feedback, not ASMR-focused.

Use:

```text
clear pickaxe swing
clear rock hit
clear block break
short reward/UI confirmations
one high-tier ore accent sound
one Diamond Core special sound
```

Do not create a different mining sound for every ore type in MVP.

Most mining hits can share the same file.

Example mapping:

```text
BLOCK_HIT_STONE
BLOCK_HIT_ORE
BLOCK_HIT_DIAMOND_CORE
```

may use similar or shared mining-hit files at first.

Recommended MVP sound file grouping:

```text
pickaxe_swing_01.ogg
mining_hit_rock_01.ogg
mining_hit_rock_02.ogg
block_break_common_01.ogg
ore_gain_common_01.ogg
ore_gain_high_tier_01.ogg
diamond_core_hit_01.ogg
diamond_core_break_01.ogg
ui_button_tap_01.ogg
reward_select_01.ogg
chapter_clear_01.ogg
```

High-tier accent rule:

```text
GOLD / CRYSTAL / DIAMOND gains may play one shared high-tier ore accent.
```

Diamond Core rule:

```text
DIAMOND_CORE_BLOCK can have a special hit/break sound because it is the Chapter Clear object.
```

Repeated mining sounds should be short and game-like, not harsh, not overly realistic, and not overly soft.

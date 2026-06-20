# Debug Panel / 디버그 패널

## 1. Purpose

Debug Panel is required for MVP.

It allows viewing state, adjusting values, forcing events, testing generation, validating UI regions, inspecting hitboxes, and checking logs.

## 2. Access

Settings Panel → Gameplay Settings → Debug Panel Toggle

Region:
디버그 패널 영역 / DEBUG_PANEL_REGION

## 3. Sections

Required sections:
- Overview
- Resources
- Mining Face
- Layer & Generation
- Reward Encounter
- Mining Core
- Passive Effects
- AUTO
- Offline
- Playtime
- UI Regions
- Save / Load
- Logs
- Tuning Overrides

## 4. Overview

Show currentDepth, highestDepth, currentLayer, currentFaceType, currentPattern, currentTargetCellIndex, clearedFaceCount, facesSinceLastEncounter, activeRewardEffectCount, activeNodeCount, currentHitIntervalMs, currentBonusResourceChance, AUTO state, current session time, and active overlay region.

Controls:
- Pause / Resume mining
- Step one hit
- Clear current face
- Generate new face
- Toggle AUTO

## 5. Resources

Show and edit:
- current resources
- lifetime mined
- lifetime spent
- lifetime refunded
- reward gained
- bonus gained

Controls:
- +1
- +10
- +100
- +1000
- set value
- add all +1000
- reset ledger

## 6. Mining Face

Show each cell:
- cell index
- block id
- block name
- reward resource
- requiredHits
- crackProgress
- broken
- target score

Controls:
- +1 crack
- set crack
- break/unbreak
- change block
- break all
- repair all
- force ore
- force diamond
- force hard face

## 7. Layer and Generation

Show current layer, base/effective weights, face type caps, ore pool, rare pool, and active modifiers.

Controls:
- set depth
- jump to layer
- force next face type
- force next pattern
- preview generated face
- generate actual face

## 8. Reward Encounter

Show isOpen, facesSinceLastEncounter, offered rewards, selected reward, pending reward effect, and active one-face effects.

Controls:
- open Reward Encounter now
- close Reward Encounter
- force reward pair
- select left
- select right
- clear active effects

## 9. Mining Core

Show activeNodeCount, selectedNodeId, selectedNodeState, selectedNodeCost, parent status, layer gate status, active visual tiers, branch spending, and refund preview.

Controls:
- unlock selected node
- lock selected node
- unlock branch up to selected
- reset branch
- reset all Mining Core
- force visual tier
- recalculate passives

## 10. Passive Effects

Show Pickaxe effects, Lantern effects, Gloves effects, Deep Core effects, hit interval, bonus resource chance, face generation modifiers, ore pool modifiers, minimum hit rules, and global caps.

Controls:
- recalculate all
- copy values JSON
- reset debug overrides

## 11. AUTO

Show AUTO ON/OFF, current target cell, target reason, target score table, hit interval timer, resource priority score, crack progress score, effect priority score, and tie breaker score.

Controls:
- toggle AUTO
- force target cell 0~8
- recalculate target scores
- step AUTO hit
- break current target

## 12. Offline

Show lastActiveAt, elapsed offline seconds, capped seconds, offline efficiency, estimated cleared faces, estimated depth gained, estimated resources, cap applied, and chapter blocked.

Controls:
- simulate 1m
- simulate 10m
- simulate 1h
- simulate 4h
- force offline popup
- clear offline summary

## 13. Playtime

Show currentSessionElapsedSeconds, totalActiveSeconds, totalAutoMiningSeconds, totalAutoOffSeconds, totalRewardChoiceSeconds, totalOfflineRewardedSeconds, average resources per minute, average faces cleared per minute, and average nodes unlocked per hour.

## 14. UI Regions

Show visible main regions, active overlay region, hovered region, pressed region, focused region, interactive hitboxes, and HUD collision warnings.

Main regions:
- TOP_STATUS_HUD_REGION
- MINING_FACE_REGION
- HAND_EQUIPMENT_REGION
- TEMP_EFFECT_CHIP_REGION
- TOAST_BANNER_REGION

Interactive regions:
- RESOURCE_STRIP_BUTTON_REGION
- LANTERN_BUTTON_REGION
- PICKAXE_BUTTON_REGION
- GLOVES_BUTTON_REGION
- AUTO_TOGGLE_REGION
- SETTINGS_BUTTON_REGION

Controls:
- toggle region outlines
- toggle hitbox outlines
- toggle collision warnings
- copy region layout JSON
- simulate narrow screen
- simulate tall screen
- simulate safe-area inset

Collision warnings:
- TOP_STATUS_HUD_REGION overlaps MINING_FACE_REGION
- RESOURCE_STRIP overflows top HUD
- AUTO_TOGGLE_REGION overlaps SETTINGS_BUTTON_REGION
- equipment hitbox blocks AUTO toggle
- TEMP_EFFECT_CHIP_REGION covers important ore cell
- modal active but mining not paused

## 15. Save / Load

Controls:
- save now
- load now
- clear save
- fresh save
- validate save
- repair save

## 16. Logs

Show logs with filters:
- all
- mining
- reward
- upgrade
- reset
- progress
- offline
- system
- debug

## 17. Tuning Overrides

Debug tuning may include baseHitIntervalMs, minHitIntervalMs, maxBonusResourceChance, encounter pacing, face type caps, requiredHits per block, cost budgets, reset refund rate, offline efficiency, max offline seconds, and max offline depth gain.


## Node Unlock Transaction Debug

Show:

- selectedNodeId
- selectedNodeName
- state: LOCKED / AVAILABLE / AFFORDABLE / ACTIVE
- parent requirement status
- required layer status
- current resources
- cost resources
- missing resources
- exact spend record preview
- passive recalculation preview
- visual tier change preview

Controls:

- unlock selected node
- lock selected node
- add missing resources
- recalculate selected node state

## Save Debug

Show save summary, validate save, clear save, and fresh save.

Save import/export is not part of MVP.


## First Minute Debug

Debug Panel should help validate first-minute pacing.

Show:

- seconds since new save start
- first block broken time
- first face clear time
- first affordable node time
- current affordable node count
- missing resources for selected node

Controls:

- reset to fresh first-minute test
- add early material bundle
- highlight affordable nodes


## Sound Test Section

Debug Panel includes a Sound Test section.

Show:

- masterVolume
- sfxVolume
- muted
- all SoundEventKey values
- mapped file paths
- loaded/missing status

Controls:

- play selected sound event
- play mining sample sequence
- play reward sample sequence
- play Mining Core unlock sample sequence
- play UI sample sequence
- toggle mute
- set master volume
- set SFX volume

Validation:

- missing files no-op safely
- adding an `.ogg` file to the mapped path allows immediate playback
- repeated mining sounds respect cooldownMs


## Image Asset Test Section

Debug Panel includes an Image Asset Test section.

Show:

- current visualAssetMode
- all ImageAssetKey values
- category
- mapped imagePath
- generatedFallbackClass
- loaded/missing/error status
- current preview
- forced generated preview
- forced image preview

Controls:

- set mode GENERATED
- set mode IMAGE
- set mode AUTO
- reload image asset registry
- preview selected asset
- toggle missing image fallback test
- copy asset key
- copy image path

Validation:

- missing images do not crash
- IMAGE mode falls back to generated fallback
- AUTO mode switches to image when available
- GENERATED mode ignores image files

## Development Entry

Debug Panel can be opened directly with URL query:

```text
?debug
?debug=1
?debug=true
```

`?debug=0` and `?debug=false` should not enable debug.

When debug is enabled by URL query, it opens as a side panel next to the game viewport.

## Development Side Panel Layout

Debug Panel must not cover the game screen during development.

Required layout:

```text
GAME VIEWPORT | DEBUG SIDE PANEL
```

Rules:

- game viewport remains visible
- debug side panel is independently scrollable
- debug controls do not overlap the 3x3 Mining Face
- debug controls do not block equipment buttons
- developer can watch AUTO mining while changing debug values
- developer can pause/resume/step mining from debug
- Reward Encounter and other overlays may appear on the game viewport while debug remains visible

Recommended width:

```text
debug side panel: 420px
minimum: 360px
maximum: 560px
```

## Debug Hotkey

Recommended hotkey:

```text
Ctrl + Shift + D
```

Behavior:

- toggle debug side panel
- preserve game state
- no save import/export

## Production Debug Lock

Debug Panel is for development and QA.

Production release builds should disable:

- `?debug`
- `Ctrl + Shift + D`
- visible debug entry points

Use build flag:

```ts
VITE_ENABLE_DEBUG
```

Default release behavior:

```text
debug disabled
```


## All Tuning Values Requirement

Debug Panel must expose all gameplay tuning values, not only a selected subset.

Required categories:

```text
runtime tuning values
all numeric constants
all effect values from docs/33_MINING_CORE_EFFECT_VALUES.md
all caps
all reward encounter chances
all reward effect values
all cost budgets
all branch cost weights
all offline reward values
all progression projection values
all PWA/platform flags relevant to debug
all generated node/effect summaries needed for validation
```

Examples:

```text
chapterClearDepthM
offlineMaxDepthRatioBeforeChapterCore
offlineMaxDepthBeforeChapterCoreM
baseHitIntervalMs
minimumHitIntervalMs
faceAdvanceTransitionMs
reward encounter chance values
ore density chance
ore upgrade chance
ore bonus chance
gloves debris clear speed
offline efficiency
offline depth cap
node cost budgets
branch cost weights
projected time to chapterClearDepthM
projected chapter clear timestamp
```

Rule:

```text
If a numeric value affects balance, pacing, reward, cost, offline progress, generation, or node effects,
it must be visible and adjustable in Debug Panel during development.
```

## Pickaxe Animation Tuning Values

Debug Panel must expose pickaxe strike animation tuning values.

```text
pickaxeAimDurationRatio
pickaxeWindUpDurationRatio
pickaxeImpactDurationRatio
pickaxeRecoverDurationRatio
pickaxeTravelScale
pickaxeImpactShake
pickaxeReducedMotionScale
```

These are gameplay feel values and must be adjustable during development.

## Lantern Reveal Debug Values

Debug Panel must expose the lantern reveal transition values.

```text
lanternRevealDurationMs
lanternRevealMinMs
lanternRevealMaxMs
reducedMotionLanternRevealMs
lanternRevealGlowScale
lanternRevealOreGlintDelayMs
```

Rule:

```text
The lantern reveal is visual pacing only.
It must not affect reward value, generation result, ore probability, depth, or AUTO target selection.
```

## Full Effect Debug Coverage

Debug Panel must cover the full effect system.

```text
Every effectKey recognized by the runtime must show its current computed value.
Every numeric tuning value used by an effect must be visible.
Every cap used by an effect must be visible.
Every generated node count and branch count must be visible.
Unlocked node count and active effect summary must be visible.
```

The Debug Panel is the balancing surface for the first playable build.

Debug Panel은 첫 플레이 가능 버전의 밸런싱 표면이다.

Do not hide tuning values because the UI is temporary.

UI가 임시라는 이유로 튜닝값을 숨기지 않는다.

## Debug Panel Layout and Isolation

Debug Panel must not behave like a normal game panel.

Rules:

```text
opening Debug Panel must not shift GameStage
opening Debug Panel must not move existing Resource/Core/Settings panels
Debug Panel is overlay or fixed side panel
Debug open state is independent from normal panels
game position remains stable
```

Debug content must be organized into collapsible sections.

Required categories:

```text
Runtime
Viewport
Mining
Pickaxe
Reward
Nodes
Economy
Offline
Save
Validation
```

Controls must align and not overlap.
Avoid horizontal overflow.

Normal player UI must not show Debug internals.
Raw node IDs, effectKeys, validation counts, target rectangles, and hitbox overlays belong here.

## Debug Panel No-Horizontal-Scroll Rule

Debug Panel may be dense, but it must still be usable.

Rules:

```text
Debug Panel is a fixed/overlay side panel.
Opening Debug Panel does not shift the GameStage.
No horizontal scrollbar is allowed on the Debug Panel.
All rows fit within panel width.
Inputs use consistent widths.
Buttons use consistent sizes.
Checkbox/toggle rows align to the same baseline.
Long logs scroll inside a fixed log box only.
Use collapsible sections for large groups.
```

Recommended collapsible sections:

```text
Runtime
Viewport
Mining
Pickaxe
Reward
Nodes
Economy
Offline
Save
Validation
```


## Current Debug Panel Usability Rule

Debug Panel may be dense, but it must be usable.

Default expansion:

```text
Runtime / Summary may be open by default.
Heavy sections are collapsed by default.
```

Heavy sections include:

```text
Economy
Mining
Pickaxe / AUTO
Reward
Nodes
Offline
Image Asset Test
Sound Test
Tuning Overrides
Node Effect Values
Logs
Validation
```

Layout rules:

```text
no horizontal scrollbar
all rows fit within panel width
long tuning keys truncate with ellipsis
full key may be shown in title tooltip or copied by small button
label column has stable width
inputs align to the right
button height is consistent
input height is consistent
checkbox/toggle row height is consistent
raw JSON is collapsed by default
logs use fixed-height monospace log box
log box may scroll vertically
log box must not create page-level horizontal scroll
```

Controls:

```text
Expand all
Collapse all
```

Debug Panel is allowed to show raw keys and technical labels.
Normal player UI is not.

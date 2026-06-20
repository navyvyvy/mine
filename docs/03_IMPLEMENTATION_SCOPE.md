# Implementation Scope / 구현 범위

## First MVP Target

Playable MVP with the full loop and all 189 Mining Core nodes.

## Technical Stack

- Vite
- React
- TypeScript
- React Context + useReducer
- requestAnimationFrame-based useGameLoop
- DOM/CSS/SVG rendering
- localStorage save
- CSS/SVG generated art
- assetKey-based future image replacement

No router is required. Panels and overlays use runtime UI state.

```ts
type ActivePanel = 'NONE' | 'MINING_CORE' | 'RESOURCE' | 'SETTINGS' | 'DEBUG';
type ActiveOverlay = 'NONE' | 'REWARD_ENCOUNTER' | 'OFFLINE_REWARD' | 'CHAPTER_CLEAR';
```

## Tuning

```ts
baseHitIntervalMs = 700
minimumHitIntervalMs = 150
faceAdvanceTransitionMs = 850
reducedMotionFaceAdvanceTransitionMs = 250
```

## Included Systems

- 3x3 Mining Face
- inward face advance transition
- AUTO mining
- AUTO OFF manual mining
- Reward Encounter
- reward timeout auto progression
- MATERIAL vs MATERIAL early-layer rewards
- Resource Screen
- Settings Panel
- Korean-English localization
- 189 Mining Core nodes
- node unlock transaction
- passive calculation
- localStorage save/load
- offline reward up to offlineMaxDepthBeforeChapterCoreM
- Chapter Core Face at `chapterClearDepthM`
- Chapter Clear
- Debug Panel

## Art

MVP art uses generated CSS/SVG placeholders. Every major visual object has an assetKey for later image replacement.

## Save

Use localStorage.

Save key:

```text
endless-mine-save-v1
```

Save import/export is not part of MVP.

## Sound

Sound manager exists. Audio files are optional. Missing sounds no-op safely.

## Validation

Run:

```bash
npm run build
npx tsc --noEmit
```


## First Minute Experience Gate

The first implementation must support a good first-minute experience.

Targets:

- AUTO starts immediately.
- First block breaks within about 15 seconds.
- Resource fly-to-HUD feedback is visible.
- First Mining Face clear happens early enough to understand the loop.
- First affordable Mining Core node appears within 60~90 seconds.
- Affordable nodes pulse.
- Missing resources are shown in the selected node detail.
- Unlocking a node spends resources and activates the node immediately.

This gate is validated manually during MVP testing.


## Sound Implementation Scope

MVP must implement the sound structure even if final audio files are not ready.

Required files:

```text
src/audio/soundEvents.ts
src/audio/soundAssets.ts
src/audio/soundManager.ts
src/audio/useSound.ts
```

Required behavior:

- all important feedback moments call playSound(eventKey)
- missing sound files no-op safely
- sound file paths are defined in soundAssets
- `.ogg` files can be added later without changing game logic
- Settings Panel controls Master Volume, SFX Volume, and Mute
- Debug Panel includes Sound Test controls


## Image Implementation Scope

MVP must implement the image asset structure even while using generated CSS/SVG visuals.

Required files:

```text
src/data/imageAssets.ts
src/components/common/VisualAsset.tsx
src/components/common/VisualAssetLayer.tsx
src/assets/assetMode.ts
src/assets/assetLoader.ts
src/assets/assetRegistry.ts
src/styles/generated-art.css
src/styles/visual-assets.css
```

Required behavior:

- all major visuals render through ImageAssetKey
- visualAssetMode supports GENERATED, IMAGE, and AUTO
- default mode is GENERATED
- IMAGE mode tries mapped image files
- AUTO mode uses image when available and generated fallback when missing
- missing images never crash the game
- Settings Panel exposes visual asset mode
- Debug Panel includes Image Asset Test
- dropping a PNG file into the mapped path allows immediate testing


## Debug Development Scope

Debug must be easy to open during development.

Required behavior:

```text
/?debug
```

opens the game with Debug Panel enabled.

Debug Panel should appear as a side panel next to the game viewport, not as a modal covering the game.

The developer must be able to see the game screen and operate debug controls at the same time.

Recommended files:

```text
src/components/debug/DebugShell.tsx
src/components/debug/DebugSidePanel.tsx
src/components/debug/DebugToolbar.tsx
src/debug/debugQuery.ts
```

Recommended hotkey:

```text
Ctrl + Shift + D
```

Debug side panel is runtime UI state and should not block the game viewport.


## Balance and Future Skeleton Decisions

The implementation must use the finalized balance documents:

- docs/21_REWARD_ENCOUNTERS.md
- docs/32_MINING_CORE_UNLOCK_AND_COSTS.md
- docs/33_MINING_CORE_EFFECT_VALUES.md

Rules:

- Mining Core costs use all resources unlocked by the cost preset.
- Branches use resource weight bias, not resource exclusion.
- Reward effects apply to the next Mining Face only.
- Reward reroll is not part of MVP.
- Autosave must run on Mining Face clear and all important progression changes.
- Endless Core is a future skeleton only.
- Post-diamond resources are reserved but not generated in MVP.
- Image source sizes are designed for a 480x720 responsive viewport and scaled down by CSS.


## Image Generation Prompt Scope

The document set includes image generation prompts for future image asset creation.

Implementation still uses generated CSS/SVG by default.

When image files are later created, they should follow:

```text
docs/17_IMAGE_GENERATION_PROMPTS.md
```

The game should look like a stylized game, not a realistic photo set or generic icon pack.


## Damage Visual Scope

MVP must implement visible damage progression for Mining Face cells.

Required:

- requiredHits table
- currentHits per cell
- damageRatio
- visual stage mapping
- CSS/SVG CellDamageOverlay
- shared MiningFaceWallOverlay
- shared vein continuation overlay for VEIN/RICH/RARE/DIAMOND_CORE
- EMPTY dark hole state
- face clear visual transition

Document:

```text
docs/18_MINING_FACE_DAMAGE_VISUAL_STAGES.md
```

## Gap Fix Scope

Implementation must follow the added guardrail documents:

```text
docs/19_MINING_FACE_GENERATION_PATTERNS.md
docs/23_HUD_RESOURCE_DISPLAY_AND_RESPONSIVE_UI.md
docs/41_SAVE_MIGRATION_AND_REPAIR.md
```

Do not invent face generation weights, HUD priority rules, save repair behavior, or remaining gameplay systems outside these docs.

## Locked Implementation Decisions

Implementation rules:

- Do not wait for image files; implement CSS/SVG generated art first.
- Keep VisualAsset replacement structure for later PNG files.
- Use ordinary game mining sounds, not ASMR-focused sound design.
- Map multiple mining events to shared common sound files when appropriate.
- Disable debug entry in production release builds by default.
- Tune progression toward chapterClearDepthM Chapter Clear in 8~10 hours.
- Use average face clear time as the pacing KPI.

## Deep Core Scope

Deep Core must not implement log/detail upgrade effects.

Use the final Deep Core table in:

```text
docs/30_MINING_CORE_FULL_MAP.md
docs/33_MINING_CORE_EFFECT_VALUES.md
```

Node 4046 opens the Endless Core tab.

MVP still does not implement active Endless Core node gameplay.

## Deep Core Cleanup Scope

Do not implement delayed claim-style systems for Deep Core.

Allowed Deep Core reward effects:

- immediate +1 same resource chance on mining resource gain
- immediate additional material line chance when selecting MATERIAL rewards

Not allowed in MVP:

- delayed reward object
- claimable chest
- delayed storage reward
- separate delayed reward UI

## Node Topology Scope

Runtime node data must use 189 nodes.

```text
Center = 1
Pickaxe = 47
Lantern = 47
Gloves = 47
Deep Core = 47
Total = 189
```

Final branch rule:

```text
slot 44 UNIQUE -> slot 45 RARE bridge -> slot 46 UNIQUE capstone
```

Do not place two final UNIQUE nodes directly adjacent.

## Effect Semantics Scope

Implementation must follow these semantics:

```text
Pickaxe = breaking power
Lantern = ore probability and discovery
Gloves = speed/rhythm/resonance
Deep Core = offline and long-term probability support
```

Resource/reward effects must not use direct amount multipliers.

Allowed reward/resource support:

```text
chance for one extra same resource
chance for one secondary material line
probability weight increase
```

Lantern tier effects increase appearance probability/weight only.
They do not guarantee extra ore blocks.

## Gloves Scope

Gloves must be AUTO mining handling upgrades.

Do not implement manual-feeling Break Recovery, Rhythm, or Combo systems.

Gloves should improve:

- hit interval
- opening acceleration
- cracked-cell targeting
- break recovery
- finishing heavily damaged cells
- adjacent crack resonance

## Pickaxe / Gloves Scope

Do not make Pickaxe and Gloves share adjacent crack effects.

Pickaxe may directly spread cracks to adjacent cells.

Gloves may improve AUTO handoff and target transition.

Gloves must not directly crack adjacent cells through this handoff effect.

## Pickaxe / Gloves Scope

AUTO target choice is already handled by targetScore.

Do not implement glove upgrades as resonant breaking or resonant breaking.

Pickaxe single-target focused crack:

```text
PICKAXE_FOCUSED_CRACK_CHANCE
```

Gloves adjacent resonant break:

```text
GLOVES_RESONANT_BREAK_CHANCE
```

## PWA MVP Scope

PWA is included in the web MVP implementation.

Required:

```text
manifest
icon placeholders
theme color
mobile viewport
installable shell
basic service worker with safe static cache
```

Not required:

```text
cloud save
push notification
background sync
account system
```


## Platform Scope

```text
Web PWA first.
Tauri is not implemented in MVP.
Architecture must remain Tauri-ready.
```

Required PWA MVP work:

```text
manifest
icon placeholders
theme color
mobile viewport support
installable shell
basic service worker with safe static cache
```

Tauri-ready architecture rules:

```text
isolate platform APIs
wrap save storage behind an adapter
avoid direct localStorage in reducers/systems/game loop
keep static web build output
do not add src-tauri in MVP
```

## First-person Pickaxe Strike Scope

MVP must include visible pickaxe strike animation.

Required:

```text
pickaxe moves toward current target cell
impact timing applies hit damage
target cell hit flash
crack update
small dust burst
recovery motion
```

Reference:

```text
docs/18_FIRST_PERSON_PICKAXE_STRIKE.md
```

## Full Mining Core Implementation Scope

The first implementation must include the full Mining Core node data.

첫 구현에는 전체 Mining Core 노드 데이터가 들어가야 한다.

Rules:

```text
All generated Mining Core nodes must be present in the app.
All generated nodes must be viewable in the Mining Core UI. Raw node IDs must be hidden in normal player UI and shown only in Debug Panel.
All generated parent relationships must be respected.
All generated cost presets must have a cost calculation path.
All generated effectKeys must be recognized by the effect system.
```

The first UI may be simple, but the data scope must not be reduced.

첫 UI는 단순해도 되지만, 데이터 범위를 줄이면 안 된다.

Implementation expectation:

```text
full node data
full unlock path
full passive recalculation path
full effectKey handler path
debug visibility for all numeric values
```

If an effect is not visually polished yet, it still needs a handler path and Debug Panel visibility.

효과 연출이 아직 완성도가 낮아도 handler 경로와 Debug Panel 노출은 있어야 한다.

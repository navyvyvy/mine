# Endless Mine Context

Use this context as the current source of truth summary.

## Core Direction

```text
Dark cozy first-person idle mining.
어두운 광산 안에서 손에 든 곡괭이와 랜턴으로 중앙 3x3 채굴면을 자동으로 부수는 1인칭 방치형 채굴 게임.
```

Core loop:

```text
AUTO mining
-> block cracking / breaking
-> resource gain
-> face clear
-> inward face advance transition
-> depth increase
-> reward encounter
-> Mining Core node unlock
-> deeper layers
-> Chapter Core at chapterClearDepthM
-> Chapter Clear
-> Endless Core tab as future expansion
```

## Source Documents

```text
docs/00_PROJECT_OVERVIEW.md
docs/02_FINAL_RULES.md
docs/03_IMPLEMENTATION_SCOPE.md
docs/13_ART_AND_SOUND_DIRECTION.md
docs/18_FIRST_PERSON_PICKAXE_STRIKE.md
docs/18_MINING_FACE_DAMAGE_VISUAL_STAGES.md
docs/19_MINING_FACE_GENERATION_PATTERNS.md
docs/20_MINING_FORMULAS_AND_COSTS.md
docs/21_REWARD_ENCOUNTERS.md
docs/22_AUTO_AND_OFFLINE_REWARD.md
docs/24_PROGRESSION_PACING_TARGETS.md
docs/25_LOCALIZATION_AND_COPY_TONE.md
docs/26_MVP_COMPLETION_AND_UI_CORRECTION_CHECKLIST.md
docs/30_MINING_CORE_FULL_MAP.md
docs/31_MINING_CORE_MAP_LAYOUT.md
docs/32_MINING_CORE_UNLOCK_AND_COSTS.md
docs/33_MINING_CORE_EFFECT_VALUES.md
docs/50_DEBUG_PANEL.md
docs/90_MVP_IMPLEMENTATION_ORDER.md
generated/miningCoreNodes.ts
generated/miningCoreNodes.json
```

## Runtime Tuning

```text
chapterClearDepthM is configurable.
Initial debug default: 3000.
3000 is not a final locked design value.
```

```text
offlineMaxDepthRatioBeforeChapterCore is configurable.
Initial debug default: 0.98.
offlineMaxDepthBeforeChapterCoreM =
  floor(chapterClearDepthM * offlineMaxDepthRatioBeforeChapterCore)
```

All progression projections and offline clamps must use these runtime values.

## Mining Core

```text
Center = 1
Pickaxe = 47
Lantern = 47
Gloves = 47
Deep Core = 47
Total = 189
```

Runtime node data has already been generated:

```text
generated/miningCoreNodes.ts
generated/miningCoreNodes.json
```

Implementation should copy:

```text
generated/miningCoreNodes.ts -> src/data/miningCoreNodes.ts
```

## Branch Identity

```text
Pickaxe = single-target breaking power and crack control
Lantern = ore appearance probability, ore density, ore upgrade chance, and discovery
Gloves = hand-work upgrades: speed, recovery, debris clear, resonant nearby breaking
Deep Core = offline and long-term probability support
```

## Debug Panel Rule

Debug Panel must expose all gameplay tuning values.

This includes:

```text
runtime tuning values
all numeric constants
all effect values
all caps
all reward encounter chances
all cost budgets and cost weights
all offline reward values
all progression projection values
all generated node/effect summaries needed for validation
```

Do not limit Debug Panel to a small selected list.

## Platform

```text
Web PWA first.
Tauri is not implemented in MVP.
Architecture must remain Tauri-ready.
```

Rules:

```text
isolate platform APIs
wrap save storage behind an adapter
avoid direct localStorage in reducers/systems/game loop
keep static web build output
do not add src-tauri in MVP
```

PWA is in MVP scope:

```text
manifest
icon placeholders
theme color
mobile viewport support
installable shell
basic service worker with safe static cache
```

## v29 First-person Pickaxe Strike

Core visual rule:

```text
Every AUTO hit must show the pickaxe moving toward the currently targeted block and striking it.
```

The wall cracking alone is not enough.

Implementation reference:

```text
docs/18_FIRST_PERSON_PICKAXE_STRIKE.md
```

Required hit flow:

```text
AUTO chooses target cell
-> pickaxe moves toward that cell
-> strike animation plays
-> damage applies at impact timing
-> crack/dust/resource feedback plays on that cell
```


## Lantern reveal transition

After a Reward Encounter choice is selected:

```text
apply reward
-> short darkness / tunnel advance
-> lantern glow reveals next Mining Face
-> AUTO mining resumes
```

Do not play this reveal after every normal face clear.

Use mainly after Reward Encounter selection, major layer change, or Chapter Core reveal.

This is visual pacing only and must not affect reward value, face generation, ore probability, depth, or AUTO target selection.

## Final implementation scope update

The first Codex implementation should build the full first playable MVP, not only a small skeleton.

Required:

```text
All generated Mining Core nodes must be included.
All generated nodes must be visible in the Mining Core UI. Raw node IDs must be hidden in normal player UI and shown only in Debug Panel.
All generated effectKeys must be recognized by the effect system.
All unlocked node effects must contribute through passive recalculation.
Debug Panel must expose all numeric tuning values.
```

Visual gameplay requirements:

```text
Pickaxe must move toward the current AUTO target cell.
Damage applies at pickaxe IMPACT timing.
After Reward Encounter selection, lantern reveal transition shows the next Mining Face.
```

## v32 Completion / UI Correction Source of Truth

This package adds implementation-source rules for missing MVP completion and current UI correction.

New implementation docs:

```text
docs/25_LOCALIZATION_AND_COPY_TONE.md
docs/26_MVP_COMPLETION_AND_UI_CORRECTION_CHECKLIST.md
```

Key rules:

```text
A feature is not complete just because it exists in code.
It must work and visually behave correctly in the running game screen.
Normal player UI must not show raw internal IDs, raw effectKeys, debug target boxes, or system-like wording.
Korean is the default player-facing language.
```

Main correction targets:

```text
complete offline reward / offline progress
complete Chapter Core / Chapter Clear flow at chapterClearDepthM
verify reward effects actually affect gameplay
verify every generated effectKey has a gameplay path
fix AUTO OFF manual mining
fix pickaxe impact alignment to exact target cell
fix Mining Core node click / pan / detail panel UX
simplify top HUD and remove duplicate controls
compact bottom controls
keep hands/equipment from blocking the 3x3 Mining Face
make Debug Panel overlay/fixed and collapsible
make Reward timeout bar visibly decrease
complete Korean copy for rewards, node details, toast, offline, and Chapter messages
```

Top HUD must be a thin information overlay, not a heavy panel.
Resource display should be a compact strip without individual thick bordered pills.

Bottom controls are:

```text
AUTO
자원
채굴 코어
설정
```

First-person equipment is visual foreground art. It must not steal Mining Face clicks in normal gameplay.
## v33 Mining Face / Ore Visual Clarification

Ore visuals must be natural embedded material, not repeated centered ore markers.

Rules:

```text
The 3x3 Mining Face reads as one connected mine wall.
Ore must not be drawn as the same repeated centered circle, dot, badge, icon, or simple mark on top of every block.
Ore should appear as irregular seams, partially buried veins, flakes, exposed fragments, or crack-revealed mineral surfaces.
Vein presets define embedded mineral distribution, not smooth decorative UI lines.
Ore visibility should increase naturally through damage stages.
EMPTY cells should become mined-out dark holes, not blank UI squares.
```

Reference docs:

```text
docs/13_ART_AND_SOUND_DIRECTION.md
docs/18_MINING_FACE_DAMAGE_VISUAL_STAGES.md
docs/19_MINING_FACE_GENERATION_PATTERNS.md
docs/26_MVP_COMPLETION_AND_UI_CORRECTION_CHECKLIST.md
```

## v34 Layout / Quick Controls / Reveal Alignment Correction

This package clarifies the main screen layout and key UI acceptance criteria.

Main layout rules:

```text
There is no separate bottom HUD bar.
Quick controls sit as a small lower-center strip in the empty visual space between the left hand/lantern and right hand/pickaxe.
Quick controls must not overlap the hands, lantern, pickaxe, or Mining Face.
Top HUD is a thin information strip only.
Toast appears directly below the thin top HUD, not inside the HUD and not as a browser-style top-right notification.
```

Main screen priorities:

```text
Mining Face is the primary visual and input area.
Hands/equipment frame the lower foreground.
Quick controls fit between the hands without reserving a full-width bottom bar.
Visible browser scrollbars are hidden from normal game panels.
Resource Panel uses compact table rows with fixed columns: 자원 / 보유 / 채굴 / 사용 / 보너스, not repeated resource cards.
Lantern reveal after rewards is centered on the rendered 3x3 Mining Face bounds.
```

Acceptance rule:

```text
If the implementation still reserves a large bottom HUD area, overlaps equipment art with quick controls, shows visible scrollbars in normal panels, or aligns the lantern reveal to the screen/container instead of the Mining Face center, the UI does not meet the v34 layout requirements.
```

## V37 clarification: active reward chip and resource icons

The reward selection panel itself can remain centered on screen.

The issue is the small indicator shown after a reward is selected and while a next-face-only effect is pending or active.

Official region name:

```text
활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION
also known as: 임시 효과 칩 / 이번 채굴면 효과 칩
```

Placement rule:

```text
below the thin top HUD
above the Mining Face
not inside the top HUD
not at the top HUD right edge
not mixed with the resource summary
compact one-line chip
```

The top HUD right edge is only for compact resources.

Resource icon clarification:
- stone, iron, and crystal icons must look like mined materials
- stone = rough gray chipped rock shard
- iron = rusty red-brown metallic ore chunk
- crystal = angular translucent shard with facets
- avoid flat circles, generic white dots, emoji-like icons, or icons that do not read as mineral/metal

## V41 clarification: toast/chip split placement and block pattern variety

The active reward chip / TEMP_EFFECT_CHIP_REGION and Toast / TOAST_BANNER_REGION both live under the thin top HUD, but they must not overlap.

Stacking rule:

```text
Toast anchors under the HUD on the left side.
The active reward chip anchors under the HUD on the right side. They should not overlap and should not occupy the HUD row.
Neither element may overlap the top HUD, the HUD resource summary, or each other.
Do not place the active reward chip inside the top HUD right resource area.
```

Mining block visual clarification:

```text
Do not over-interpret the old centered-circle ban.
A soft central shadow, scuff, highlight, or cloudy mineral exposure can be acceptable when it reads as natural rock texture.
The problem is using the same centered circle/dot/cloud as the repeated ore marker or using the same pattern on every block.
Blocks need varied cracks, chips, mineral seams, edge damage, lighting, and material signatures.
Ore veins can connect across cells, but the wall must not look like nine cloned stamps.
```

## V41 resource feedback and Hard Rock removal

HARD_STONE_BLOCK / Hard Rock is removed from normal MVP gameplay and docs as an active block.
Reason: it required extra hits while giving only STONE, which felt like an accidental extra tier between STONE and COAL.

Resource progression is:

```text
STONE -> COAL -> COPPER -> IRON -> GOLD -> CRYSTAL -> DIAMOND
```

Rules:
- COAL is the next resource after STONE.
- Do not generate HARD_STONE_BLOCK in normal Mining Faces.
- Do not use HARD_STONE_BLOCK in Diamond Core Face layout.
- If a legacy type remains for migration/type compatibility, it must be deprecated and not player-facing.

Resource gain feedback has two channels:
- Local Mining Face flyout: every actual block resource gain emits `+amount icon` near the mined cell.
- Top HUD pulse: if the gained resource is currently visible in the compact top HUD, pulse that resource number/icon without changing layout.

Global Toast is for major events only. Do not use global toast for every STONE/COAL/COPPER gain.

## V42 Visual Layout Lock Note

The main mining screen MVP visual has been corrected:

```text
3x3 Mining Face is a 480 x 480 square directly under the top HUD.
It fills the full reference width with no left/right margin.
The remaining space below is used for lantern, pickaxe, simplified hands, and quick controls.
Do not use cave room/floor/ceiling perspective for MVP.
Hands are simplified mitten/back-of-hand silhouettes with no detailed fingers.
Lantern and pickaxe must remain even if hand experiments are removed.
Pickaxe and right hand move together as one rig when the hand is visible.
Impact particles are separate effects and must not look like fingers.
```


## V43 Mining Core Connection Pattern Decision

The old Mining Core visual route pattern is deprecated.

Problem:

```text
one shared node topology was transformed into four branches
all four branches therefore repeat the same line rhythm
connection patterns look copied rather than designed
```

Current rule:

```text
Do not use the same visible connection pattern for all four branches.
Do not solve the issue only with glow/color.
The route topology and line path variation must change.
```

Branch visual silhouettes:

```text
PICKAXE = direct aggressive strike path
LANTERN = wandering discovery path
GLOVES = compact technique clusters
DEEP_CORE = heavy downward buried spine
```

See:

```text
docs/31_MINING_CORE_MAP_LAYOUT.md
docs/35_MINING_CORE_CONNECTION_PATTERN_REDESIGN.md
```

Generated node data remains usable for node ids/effects/costs, but generated visual coordinates/routes are legacy until regenerated.

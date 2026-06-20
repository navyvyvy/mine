
# MVP Completion and UI Correction Checklist / MVP 완성 및 UI 보정 체크리스트

## 1. Purpose

This document lists the implementation completion checks that must be true before moving from MVP implementation to polish-only work.

A feature is not complete just because it exists in code.
It must work and visually behave correctly in the running game screen.

## 2. Complete Documented MVP Systems

Required systems:

```text
3x3 Mining Face
AUTO mining
AUTO OFF manual mining
first-person pickaxe impact timing
Reward Encounter
Reward timeout and auto progression
reward effects actual gameplay application
lantern reveal after Reward Encounter
resource gain
face clear and depth progress
offline reward / offline progress
Chapter Core at chapterClearDepthM
Chapter Clear
Resource Screen
Settings Panel
Korean/English localization
Mining Core full 189-node board
Mining Core unlocks and passive effects
save/load/migration
PWA basics
Debug Panel
```

## 3. Offline Reward Completion

Offline reward must:

```text
save lastPlayedAt / lastActiveAt
calculate elapsed offline time on load
apply offline efficiency
apply offline depth cap
respect offlineMaxDepthRatioBeforeChapterCore
never clear/pass Chapter Core offline
show Korean offline reward summary
record save/log event
```

## 4. Chapter Core Completion

Chapter Core must:

```text
appear at chapterClearDepthM
not be cleared offline
require active online mining
show Chapter Clear after clear
persist Chapter Clear state
allow Endless Core future tab/locked area if documented
not implement active Endless Core gameplay in MVP
```

## 5. Reward Completion

Reward Encounter must:

```text
offer valid localized rewards
apply selected reward
apply timeout auto choice
show decreasing timeout progress bar or clear countdown
show selected/applied reward in natural Korean
apply temporary effects to actual gameplay
expire effects according to documented duration
show active reward effect summary/chip
```

## 6. EffectKey Completion

Every generated effectKey must:

```text
be recognized
map to a handler path
contribute to passive recalculation or correct gameplay system
be visible in Debug Panel summary
not appear as raw text in normal player UI
```

Recognition without gameplay application is incomplete.

## 7. Main Screen Completion

Main screen must:

```text
show thin compact top HUD
show 3x3 Mining Face unobstructed
show first-person hands/equipment lower in foreground
support AUTO ON automatic mining
support AUTO OFF cell tap/click manual mining
keep bottom controls compact
not duplicate Settings/AUTO controls in top HUD
not show debug target boxes/dots in normal gameplay
```

## 8. Mining Face / Ore Visual Completion

Mining Face visuals must:

```text
read as one connected mine wall
not look like nine flat UI cards
not use the same repeated centered circles/dots/badges/icons as ore markers
show ore as naturally embedded in rock
use irregular seams, buried veins, flakes, exposed fragments, or crack-revealed mineral surfaces
make ore visibility change naturally through damage stages
make non-EMPTY damage progress through cracks, chips, widened fractures, exposed surfaces, dust, and fragments
avoid early center-hole / side-hole damage masks before EMPTY
make EMPTY cells look like mined-out holes, not blank squares
keep debug labels/resource abbreviations/hit counts/center markers out of normal gameplay
```

Validation checks:

```text
ore cells do not use the same repeated centered circle/dot marker
ore appears to be part of the stone
ore visibility changes as damage increases
vein overlays do not look like UI lines floating above the wall
the full 3x3 face still reads as one connected mine wall
```

## 9. Mining Core Completion

Mining Core must:

```text
use node board, not a vertical list
show all 189 nodes
show four branches clearly
show parent links
hide internal IDs in normal UI
allow pan/drag without snap-back
clicking a node changes selected detail
selected detail fits without internal scroll
show only name/effect/cost/condition/unlock button in normal detail
put raw IDs/effectKeys/debug data only in Debug Panel
```

## 10. Debug Panel Completion

Debug Panel must:

```text
not shift GameStage or existing panels when opened
be overlay/fixed side panel
use collapsible sections
align controls and labels
avoid overlap and horizontal overflow
expose all gameplay tuning values
show validation summaries
```

## 11. Validation Commands

Run available commands only:

```bash
npm run context
npm run typecheck
npm run build
npm run lint
```

If a script does not exist, report it as unavailable.

## 12. Manual / Source Validation

Validate:

```text
node count = 189
CENTER=1, PICKAXE=47, LANTERN=47, GLOVES=47, DEEP_CORE=47
effectKey recognition = 50/50
invalid parent links = 0
src-tauri is not present
Korean is default and persists
Reward timeout bar visibly decreases
AUTO OFF manual mining works
pickaxe impact point reaches target cell
equipment does not block Mining Face clicks
Mining Core node click updates detail
Mining Core pan does not snap back
normal UI hides internal IDs/effectKeys
offline reward respects Chapter Core clamp
Chapter Core can be tested by lowering chapterClearDepthM
PWA build passes
```

## Layout and UI Acceptance Checklist

Main screen:

```text
[ ] Top HUD is a thin information strip only.
[ ] Toast appears directly below the thin top HUD, not top-right.
[ ] Toast anchors under HUD left and active reward chip anchors under HUD right; they do not overlap.
[ ] Active reward chip / TEMP_EFFECT_CHIP_REGION appears below the thin top HUD, not in the HUD right resource area, and never overlaps toast.
[ ] There is no separate bottom HUD bar.
[ ] Quick controls are centered in the empty lower-center space between the two hands.
[ ] Quick controls do not overlap hands, lantern, pickaxe, or Mining Face.
[ ] Mining Face remains fully visible and clickable.
[ ] Equipment artwork does not steal Mining Face input.
```

Panels:

```text
[ ] Resource Panel uses compact table rows with fixed columns: 자원 / 보유 / 채굴 / 사용 / 보너스.
[ ] Resource icons for stone/iron/crystal look like mined materials, not generic flat marks or circles.
[ ] Normal panels hide visible scrollbars.
[ ] Normal panels do not show horizontal scrollbars.
[ ] Mining Core board feels like drag-to-pan, not a browser overflow div.
[ ] Debug Panel has no horizontal scroll and uses collapsible sections.
```

Reward / transition:

```text
[ ] Reward timeout bar visibly decreases or is replaced by clear countdown text.
[ ] Lantern reveal after reward selection is centered on the rendered 3x3 Mining Face.
[ ] Lantern reveal covers all 9 blocks evenly and remains aligned under responsive scaling.
```

Mining Face / ore:

```text
[ ] Ore is not shown as the same repeated centered circle/dot/icon marker.
[ ] Ore remains visible and resource type is identifiable.
[ ] Ore appears naturally embedded in the rock.
[ ] The full 3x3 face reads as one connected mine wall.
```


## Current UI Acceptance Addendum

Main HUD:

```text
[ ] Depth + cave/layer information stays fixed on the left.
[ ] Timer/progress stays visually centered.
[ ] Resource summary stays fixed on the right end.
[ ] Top HUD does not contain AUTO or Settings controls.
[ ] Top HUD does not use resource pills/cards or thick per-resource borders.
[ ] Every broken-block resource gain creates a local `+amount icon` flyout near the mined cell.
[ ] If the gained resource is visible in the top HUD, that resource number/icon pulses without layout shift.
[ ] Global toast is not spammed for ordinary resource gains.
```

Mining Face / ore:

```text
[ ] Ore is not a repeated centered circle, corner dot, badge, or UI icon used as the resource marker.
[ ] Ore is not hidden as generic blur/noise.
[ ] Ore is embedded but readable by resource type.
[ ] Ore and rock patterns are irregular, varied, and may continue across neighboring cells.
[ ] The player can identify ore-bearing cells without reading toast/resource gain text.
[ ] HARD_STONE_BLOCK / Hard Rock is not generated or shown as a normal block.
[ ] Resource progression is STONE -> COAL -> COPPER -> IRON -> GOLD -> CRYSTAL -> DIAMOND.
[ ] Blocks do not all use the same centered cloudy/circular pattern.
[ ] Central highlights/shadows, if used, vary naturally and do not act as repeated ore markers.
```

First-person motion:

```text
[ ] Right hand moves together with pickaxe during strikes.
[ ] Pickaxe head reaches target cell at impact.
[ ] Left hand/lantern has subtle idle or periodic reveal motion.
[ ] Lantern motion does not cover Mining Face cells.
```

Resource Panel:

```text
[ ] Resource Panel uses a compact table layout.
[ ] Resource table columns are exactly 자원 / 보유 / 채굴 / 사용 / 보너스.
[ ] Next goal, shortage, and unlock context appear below the table, not as table columns.
[ ] Ambiguous labels such as 다음부족 or 최근보너스 are not used.
[ ] Rows do not wrap awkwardly.
```

Mining Core:

```text
[ ] Branch tabs act as quick navigation to branch progress point.
[ ] Tab row remains visible.
[ ] Reset/focus returns to center or current branch progress point.
[ ] Node detail uses compact state badge + effect + cost + condition + action.
[ ] ACTIVE nodes show compact 해금됨 state, not a large disabled button.
[ ] Branches read as growth paths with main spine, side branches, and capstone.
[ ] Links do not look like random tangled graph lines.
```

Balance:

```text
[ ] Early coal appears often enough to support first C1 unlocks.
[ ] Use docs/19 ore and preset weights before adding new coal-specific variables.
```

# Final Rules / 최종 규칙

## 1. Main Game Rule

Endless Mine is a first-person idle mining incremental game built around a 3x3 Mining Face, AUTO mining, Reward Encounter choices, and Mining Core permanent progression.

## 2. Main Screen Rule

Main permanent regions:
- 상단 상태 HUD 영역 / TOP_STATUS_HUD_REGION
- 채굴면 영역 / MINING_FACE_REGION
- 손/장비 영역 / HAND_EQUIPMENT_REGION

Main screen interactions:
- Resource strip opens Resource Screen.
- Lantern opens Mining Core focused on Lantern branch.
- Pickaxe opens Mining Core focused on Pickaxe branch.
- Gloves opens Mining Core focused on Gloves branch.
- ∞ toggles AUTO.
- ⚙ opens Settings Panel.

## 3. Resource Rule

1 broken block = 1 resource.

```ts
baseAmount = 1
bonusAmount = random() < bonusChance ? 1 : 0
finalAmount = baseAmount + bonusAmount
maxBonusChance = 0.75
```

## 4. Mining Face Rule

A Mining Face is a 3x3 grid.

```text
0 1 2
3 4 5
6 7 8
```

When all 9 cells are broken, depth += 1 and the next Mining Face appears.

## 5. AUTO Rule

AUTO is ON by default.
AUTO uses target scoring.
AUTO keeps hitting the same valid target until broken.
AUTO shows visible mining feedback.

## 6. Reward Encounter Rule

Reward Encounter shows 2 choices.
The player manually selects one.
Mining pauses while Reward Encounter is open.

Reward durations:
- IMMEDIATE
- NEXT_FACE_START
- NEXT_FACE_ACTIVE
- NEXT_FACE_CLEAR

## 7. Mining Core Rule

Mining Core is the main permanent progression system.

Node count:
- Center: 1
- Pickaxe: 46
- Lantern: 46
- Gloves: 46
- Deep Core: 46
- Total: 189

## 8. Cost and Reset Rule

Node cost is calculated from branch, rarity, and costPreset.

```ts
refundAmount = floor(spentAmount * 0.9)
```

Refund uses exact recorded spent resources.

## 9. Offline Reward Rule

Offline Reward eligibility:
- AUTO was ON
- Reward Encounter was not open
- offline time >= 60 seconds

Limits:
- max offline time = 4 hours
- offline efficiency = 35%
- max offline depth gain = 50m

## 10. Chapter Rule

Diamond Depth unlocks by layer pacing.
Chapter Core Face appears at `chapterClearDepthM`.
Chapter Core Face clear shows Chapter Clear.
After Chapter Clear, mining continues endlessly.

## 11. Save and Log Rule

Every resource gain, spend, refund, node unlock, reset, reward selection, offline claim, AUTO toggle, layer unlock, face clear, and chapter clear updates save data and unified logs.

Normal UI uses readable text.
Debug UI may show raw IDs.

## 12. Debug Rule

Debug Panel is required and includes system state, resources, Mining Face, generation, Reward Encounter, Mining Core, passive effects, AUTO, offline, playtime, save/load, logs, UI Region Inspector, HUD collision debug, and hitbox debug.


# MVP Scope Lock / MVP 범위 고정

## 1. Purpose

This document keeps MVP implementation focused.

It is not a list of discarded ideas.
It is a scope boundary for the first implementation.

## 2. MVP Includes

MVP includes:

- 3x3 Mining Face
- AUTO mining
- block damage stages
- face clear and inward advance transition
- depth and layer progression
- Reward Encounter with two choices
- MATERIAL rewards
- next-face-only temporary effects
- Mining Core 189 nodes
- Resource Screen
- Settings Panel
- generated image asset system
- sound event system
- Debug side panel through `?debug`
- Offline Reward
- Chapter Core at chapterClearDepthM
- Chapter Clear
- locked Endless Core skeleton

## 3. MVP Does Not Implement

MVP does not implement active versions of:

- prestige
- rebirth
- gacha
- card collection
- pet collection
- daily missions
- event pass
- rewarded ads
- cash shop
- cloud save
- account login
- save import/export
- active Endless Core nodes
- post-diamond resource generation
- reward reroll

These can be future work, but should not be implemented in MVP.

## 4. Future Skeletons Allowed

The following can exist as inactive or locked skeletons:

- Endless Core tab
- reserved future resource IDs
- reserved future equipment tiers
- image replacement mode
- sound file mapping
- debug tools

Skeleton means:

```text
state shape and UI placeholder can exist
active gameplay should not run
```

## 5. Implementation Rule

If an implementation choice is not in the current docs, do not invent a new feature.

Prefer:

```text
simple placeholder
debug-only control
locked future state
```

over adding a new gameplay system.

## Final UI / Completion Rules

- Korean is the default normal UI language.
- English is selectable in Settings.
- Normal UI must not show raw internal IDs or effectKeys.
- Top HUD is information only and must be thin/compact.
- Bottom controls are AUTO, 자원, 채굴 코어, 설정.
- Equipment art must not block the 3x3 Mining Face.
- AUTO OFF supports manual cell mining.
- Pickaxe impact point must visibly reach the selected target cell.
- Mining Core node click must update selected detail.
- Mining Core normal detail shows only name, effect, cost, condition, and unlock button.
- Debug Panel is independent overlay/fixed side panel and must not shift the game.
- Offline reward and Chapter Core flow must be actually implemented, not only typed.

## Final Layout Rules


Top HUD fixed positions:

```text
left = depth + cave/layer
center = time/progress
right = compact resources
```

The timer must remain centered; resources must remain right-aligned.

```text
No separate bottom HUD bar.
Quick controls are small and centered between the first-person hands.
Quick controls do not cover hands, lantern, pickaxe, or Mining Face.
Toast appears directly below the thin top HUD, not top-right.
Resource Panel uses compact table rows with fixed columns: 자원 / 보유 / 채굴 / 사용 / 보너스.
Visible browser scrollbars are hidden in normal player UI.
Lantern reveal after reward selection is centered on the rendered 3x3 Mining Face.
```

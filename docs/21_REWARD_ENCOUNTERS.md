# Reward Encounters / 보상 발견

## 1. Purpose

Reward Encounter is the active choice moment between Mining Faces.

It gives either immediate material rewards or a next-face-only temporary effect.

## 2. Core Rule

Reward effects apply to the next Mining Face only.

```ts
rewardEffectFaceLimit = 1
```

MVP does not include reroll.

```ts
rewardRerollEnabled = false
```

Future extension may allow rare effects to last up to 3 faces, but MVP uses exactly 1 face.

## 3. Flow

Mining Face clear
→ inward advance transition
→ encounter roll
→ if encounter occurs, mining pauses
→ two rewards appear
→ player chooses one
→ reward applies
→ next Mining Face is generated with effect if needed
→ mining resumes

NEXT_FACE_START effects apply to the next generated Mining Face immediately after reward selection.

## 4. Encounter Pacing

- minFacesBeforeEncounter = 2
- targetFacesBeforeEncounter = 3
- maxFacesBeforeEncounter = 5

Roll table:

| Faces Since Last Encounter | Chance |
|---:|---:|
| 1 | 0% |
| 2 | 25% |
| 3 | 45% |
| 4 | 70% |
| 5 | 100% |

Deep Core reward pacing may increase chance, but maxFacesBeforeEncounter still guarantees encounter by 5.

## 5. Reward Nature

- PICKAXE
- LANTERN
- GLOVES
- MATERIAL

## 6. Choice Composition

Dirt Layer:

- MATERIAL/MATERIAL 45%
- EFFECT/MATERIAL 45%
- EFFECT/EFFECT 10%

Stone Layer:

- MATERIAL/MATERIAL 30%
- EFFECT/MATERIAL 50%
- EFFECT/EFFECT 20%

Coal Vein and Iron Depth:

- MATERIAL/MATERIAL 15%
- EFFECT/MATERIAL 45%
- EFFECT/EFFECT 40%

Crystal Cave and Diamond Depth:

- MATERIAL/MATERIAL 8%
- EFFECT/MATERIAL 42%
- EFFECT/EFFECT 50%

EFFECT means PICKAXE, LANTERN, or GLOVES.

## 7. MATERIAL vs MATERIAL Rules

- same rewardId cannot appear on both sides
- same resourceId cannot appear on both sides
- at least one side should help current or near-future Mining Core unlocks
- Diamond material rewards appear only in Diamond Depth
- repeated same-tier material pairs should be avoided when alternatives exist

## 8. Material Reward Table

| Reward ID | Name | Resource | Amount | Rank | Required Layer |
|---:|---|---|---:|---|---|
| 5000 | 돌 꾸러미 / Stone Bundle | STONE | 12 | COMMON | Dirt Layer |
| 5001 | 석탄 꾸러미 / Coal Bundle | COAL | 8 | COMMON | Dirt Layer |
| 5002 | 구리 조각 / Copper Pieces | COPPER | 6 | COMMON | Stone Layer |
| 5003 | 철 조각 / Iron Pieces | IRON | 6 | UNCOMMON | Coal Vein |
| 5004 | 금 조각 / Gold Pieces | GOLD | 4 | UNCOMMON | Iron Depth |
| 5005 | 수정 조각 / Crystal Pieces | CRYSTAL | 3 | RARE | Crystal Cave |
| 5006 | 다이아 파편 / Diamond Shard | DIAMOND | 2 | RARE | Diamond Depth |

Material reward amount can be multiplied by future reward modifiers, but base MVP uses the table above.

## 9. Pickaxe Reward Table

| Reward ID | Name | Rank | Duration | Effect |
|---:|---|---|---|---|
| 1000 | 갈라진 벽 / Cracked Wall | COMMON | NEXT_FACE_START | next face all cells +1 crack |
| 1001 | 균열 폭탄 / Crack Bomb | COMMON | NEXT_FACE_START | random 3 cells +2 crack |
| 1002 | 중심 절개 / Center Split | COMMON | NEXT_FACE_START | center +2, cross cells +1 |
| 1003 | 단단한 파쇄 / Hard Breaker | UNCOMMON | NEXT_FACE_ACTIVE | hard blocks first hit +2 crack |
| 1004 | 첫 타격 / First Smash | COMMON | NEXT_FACE_ACTIVE | first hit +2 crack |
| 1005 | 무거운 곡괭이 / Heavy Pick | UNCOMMON | NEXT_FACE_ACTIVE | each hit 25% chance +1 crack |
| 1006 | 광석 끌 / Ore Chisel | UNCOMMON | NEXT_FACE_ACTIVE | ore blocks first hit +1 crack |
| 1007 | 돌파 / Breakthrough | RARE | NEXT_FACE_ACTIVE | on break, adjacent unbroken cells +1 crack |
| 1008 | 코어 강타 / Core Smash | RARE | NEXT_FACE_START | center cell +4 crack |
| 1009 | 돌 파쇄기 / Stone Crusher | COMMON | NEXT_FACE_START | 4 random non-ore rock cells +1 crack |
| 1010 | 깊은 균열 / Deep Fracture | RARE | NEXT_FACE_START | one random row or column +2 crack |

## 10. Lantern Reward Table

| Reward ID | Name | Rank | Duration | Effect |
|---:|---|---|---|---|
| 2000 | 광맥의 빛 / Vein Glimmer | COMMON | NEXT_FACE_START | next face at least VEIN |
| 2001 | 풍부한 빛 / Rich Glimmer | UNCOMMON | NEXT_FACE_START | next face RICH |
| 2002 | 광석 불꽃 / Ore Spark | COMMON | NEXT_FACE_START | next face +1 ore slot if valid |
| 2003 | 선명한 시야 / Clear Sight | COMMON | NEXT_FACE_ACTIVE | AUTO ore priority increased |
| 2004 | 희귀한 반짝임 / Rare Glint | RARE | NEXT_FACE_START | adds one rare slot if current layer supports rare pool |
| 2005 | 등불 훑기 / Lamp Sweep | UNCOMMON | NEXT_FACE_ACTIVE | ore blocks 20% chance +1 same resource |
| 2006 | 숨은 주머니 / Hidden Pocket | UNCOMMON | NEXT_FACE_CLEAR | face clear +1 key ore from current layer |
| 2007 | 인도하는 빛 / Guiding Glow | COMMON | NEXT_FACE_ACTIVE | ore priority + ore blocks 10% +1 chance |
| 2008 | 다이아 반짝임 / Diamond Glint | RARE | NEXT_FACE_START | Diamond Depth only, improves diamond slot quality |
| 2009 | 광석 메아리 / Ore Echo | RARE | NEXT_FACE_CLEAR | each ore broken 20% +1 same resource on clear |
| 2010 | 수정 광휘 / Crystal Shine | UNCOMMON | NEXT_FACE_ACTIVE | CRYSTAL blocks 25% chance +1 CRYSTAL |

## 11. Gloves Reward Table

| Reward ID | Name | Rank | Duration | Effect |
|---:|---|---|---|---|
| 3000 | 빠른 손놀림 / Quick Hands | COMMON | NEXT_FACE_ACTIVE | hit interval -25% |
| 3001 | 집중 그립 / Focused Grip | COMMON | NEXT_FACE_ACTIVE | first 5 hits +1 crack |
| 3002 | 안정된 박자 / Steady Opening Acceleration | COMMON | NEXT_FACE_ACTIVE | every 3rd hit +1 crack |
| 3003 | 더블 탭 / Break Recovery | UNCOMMON | NEXT_FACE_ACTIVE | 25% chance extra hit same target |
| 3004 | 깔끔한 파괴 / Clean Break | UNCOMMON | NEXT_FACE_ACTIVE | after break, next hit interval -40% |
| 3005 | 균열 파동 / Crack Burst | RARE | NEXT_FACE_ACTIVE | every 5th hit +1 to target and adjacent cells |
| 3006 | 단단한 그립 / Firm Grip | COMMON | NEXT_FACE_ACTIVE | consecutive same block hits 20% chance +1 crack |
| 3007 | 완벽한 스윙 / Perfect Swing | RARE | NEXT_FACE_ACTIVE | first target +4 crack |
| 3008 | 마무리 손놀림 / Debris Clear Hands | UNCOMMON | NEXT_FACE_ACTIVE | every 2nd consecutive hit same block +1 crack |
| 3009 | 스냅 타격 / Snap Strike | COMMON | NEXT_FACE_ACTIVE | first 3 hits interval -50% |
| 3010 | 공명하는 손 / Resonant Hands | RARE | NEXT_FACE_ACTIVE | after break, next hit +1 to target and adjacent cells |

## 12. Reward Rank Weights

| Rank | Weight |
|---|---:|
| COMMON | 70 |
| UNCOMMON | 25 |
| RARE | 5 |

Layer and unlock requirements filter invalid rewards before rolling.

## 13. Active Reward Chip / Temporary Effect Chip

Official region name:

```text
활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION
also known as: 임시 효과 칩 / 이번 채굴면 효과 칩

Placement clarification:
- this is the post-selection active/pending effect chip, not the centered reward choice panel
- it appears below the thin top HUD and above the Mining Face
- it must not occupy the HUD right resource area
- it must not overlap Toast / TOAST_BANNER_REGION
- when both active reward chip and toast are visible, anchor active reward chip under the HUD on the right and toast under the HUD on the left
```

This chip is the small indicator shown after a reward is selected and while a next-face-only effect is pending or active.
It is not the Reward Encounter selection panel.

Placement:

```text
directly below the thin top HUD
above the Mining Face
not inside the top HUD row
not at the HUD right edge
not mixed with the compact resource summary
not top-right
compact one-line chip when possible
```

Visible chip max: 2.  
Internal active/pending effect max: 4.  
Same effectKey refreshes duration and keeps stronger params.

Player-facing examples:

```text
이번 채굴면 효과: 빠른 손놀림
다음 채굴면: 광맥의 빛
균열 폭탄 대기 중
```

The top HUD right edge is for resources only. Do not place this chip there.

## 14. Save Rule

Reward selection is an important event and must save immediately.

Reward Encounter open state must also be saved so reloading does not lose the offered choices.


## Reward Encounter Sync

Reward Encounter effects must follow current branch identity.

```text
Pickaxe = current target breaking
Lantern = ore probability / ore density / ore upgrade / ore bonus
Gloves = hit speed / opening acceleration / break recovery / debris clear / resonant nearby breaking
Deep Core = offline / long-term probability support
```

Allowed reward effect directions:

```text
Pickaxe rewards:
- current target crack
- hard block crack
- ore block crack
- first-hit crack
- focused single-target crack

Lantern rewards:
- next face ore spot / vein / rich / rare weight
- ore density chance
- ore upgrade chance
- ore bonus chance

Gloves rewards:
- temporary hit interval reduction
- temporary opening acceleration
- temporary break recovery
- temporary debris clear speed
- temporary resonant nearby break chance

Material rewards:
- direct base MATERIAL reward is allowed as a reward choice
- node effects must not multiply material amounts
```

Reward effects must not introduce:

```text
manual combo gameplay
manual rhythm gameplay
manual double tap gameplay
target handoff logic
rare hint-only rewards
delayed cache/chest/storage rewards
```

## Reward to Next Face Lantern Reveal / 보상 후 다음 채굴면 랜턴 진입 연출

After a Reward Encounter choice is selected, the next Mining Face should be revealed through a short lantern advance animation.

보상 선택 후 다음 채굴면은 짧은 랜턴 진입 연출로 보여준다.

Sequence:

```text
Reward choice selected
-> apply reward
-> short darkness / tunnel advance
-> lantern glow reveals next Mining Face
-> AUTO mining resumes
```

This should not happen on every normal face clear.

일반 채굴면 클리어마다 재생하지 않는다.

Use it mainly after Reward Encounter selection so it feels like moving deeper into the mine without becoming repetitive.

## Reward Timeout and Copy Requirements

Reward Encounter must not block idle progress forever.

Required tuning:

```text
rewardChoiceTimeoutMs
rewardChoiceTimeoutWarningMs
rewardAutoPickEnabled
rewardAutoPickStrategy
```

Preferred timeout visual:

```text
progress bar width decreases from 100% to 0%
warning color below rewardChoiceTimeoutWarningMs
auto-selected card is clearly indicated without awkward system wording
```

If a real decreasing progress bar is not implemented, do not show a fake bar.
Use clear countdown text instead.

Player-facing Korean copy should be natural.

Use:

```text
곧 선택됩니다
잠시 후 진행
보상 적용
다음 채굴면으로 이동
```

Do not use:

```text
AUTO가 선택합니다
자동이 선택합니다
reward auto pick
```

Reward descriptions must match the actual gameplay effect.
Reward selection, timeout auto selection, and reward application must use the same effect path.

## Lantern Reveal Alignment Rule

After Reward Encounter selection, the lantern reveal / next-face transition must be aligned to the rendered 3x3 Mining Face, not to the whole screen or to the lantern artwork.

Rules:

```text
compute rendered Mining Face bounds
compute miningFaceCenter from those bounds
lantern reveal glow originates from miningFaceCenter
reveal mask / radial glow / light sweep aligns to the center of the 3x3 block area
reveal covers all 9 blocks evenly
reveal does not use whole screen center unless it equals Mining Face center
reveal does not use the lantern image position as its origin
reveal does not use panel/container center unless it equals Mining Face center
```

Validation:

```text
after reward selection, reveal starts from the center of the 3x3 Mining Face
reveal covers all 9 blocks evenly
reveal is not offset left/right/up/down from the Mining Face
reveal remains aligned when viewport scaling changes
```


## Reward Screen UI Acceptance

Reward timeout progress must reflect actual remaining time.

Formula:

```ts
remainingRatio = remainingMs / rewardChoiceTimeoutMs
progressBarWidth = remainingRatio * 100
```

Rules:

```text
100% remaining = bar full
50% remaining = bar half
10% remaining = bar nearly empty
0 = auto choice applies
warning color may appear near the end, but width still shrinks
do not show a fake full-width bar when time is almost over
```

Reward copy should be short and natural.

Use:

```text
보상을 선택하세요.
시간이 끝나면 선택된 보상이 적용됩니다.
다음 채굴면에서
다음 채굴면 진입 시
첫 타격이 더 깊은 균열을 냅니다.
광맥 한 줄이 더 깊게 드러납니다.
```

Avoid:

```text
시간이 끝나면 강조된 보상이 적용됩니다.
다음 채굴면 동안
다음 채굴면 시작
AUTO가 선택합니다
```

Auto-applied card state:

```text
small badge: 곧 적용 or 선택 예정
clear border/glow/background emphasis
warning red mainly for timeout urgency
reward panel should feel like an in-game event, not a web modal
```

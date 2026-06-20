# Project Overview / 프로젝트 개요

## 1. Game Identity

Endless Mine is a first-person idle mining incremental game.

The game is portrait-first and mobile-readable.

The player stands in front of a 3x3 Mining Face and watches automatic mining happen with visible hand, pickaxe, lantern, glove, crack, break, and resource feedback.

Core visual sentence:

어두운 광산 안에서 손에 든 곡괭이와 랜턴으로 중앙 3x3 채굴면을 자동으로 부수는 작고 선명한 1인칭 방치형 채굴 게임.

Core mood:
- dark
- cozy
- focused
- satisfying
- slightly mysterious

## 2. Player View

The player sees a first-person mining view.

- 왼손 = 랜턴
- 오른손 = 곡괭이
- 양손 = 장갑
- 중앙 = 3x3 Mining Face

The player interacts with visible objects.

- 랜턴 → Mining Core Lantern branch
- 곡괭이 → Mining Core Pickaxe branch
- 장갑 → Mining Core Gloves branch
- 자원 표시줄 → Resource Screen
- ∞ → AUTO toggle
- ⚙ → Settings Panel

## 3. Main Screen

The Main Mining Screen has three permanent regions.

- 상단 상태 HUD 영역 / TOP_STATUS_HUD_REGION
- 채굴면 영역 / MINING_FACE_REGION
- 손/장비 영역 / HAND_EQUIPMENT_REGION

Layout:

```text
┌────────────────────────────────────┐
│ 312m · 철 심층        12:34      석120 철31 │
├────────────────────────────────────┤
│     이번 채굴면 효과: 빠른 손놀림       │
│                                    │
│           3x3 Mining Face           │
│                                    │
│   왼손+랜턴    [AUTO][자원][코어][설정]  오른손+곡괭이 │
└────────────────────────────────────┘
```

## 4. Top HUD

상단 상태 HUD 영역 / TOP_STATUS_HUD_REGION contains:
- 깊이/지층 표시 / DEPTH_LAYER_DISPLAY
- 세션 시간 표시 / SESSION_TIMER_DISPLAY
- 자원 표시줄 / RESOURCE_STRIP
- 자원 표시줄 버튼 영역 / RESOURCE_STRIP_BUTTON_REGION

Example:

```text
312m · 철 심층     12:34     🪨120 ⚫31 🟠8 ⛓2
```

Main HUD resources use icon + number.

## 5. Mining Face

채굴면 영역 / MINING_FACE_REGION shows the current 3x3 Mining Face.

Cell index:

```text
0 1 2
3 4 5
6 7 8
```

Each cell has:
- blockId
- rewardResourceId
- requiredHits
- crackProgress
- broken

A hit increases crack progress.

```ts
crackProgress += 1
```

A block breaks when:

```ts
crackProgress >= requiredHits
```

When all 9 cells are broken:

```text
Mining Face clear
depth += 1
next Mining Face appears
```

## 6. Hand and Equipment Region

손/장비 영역 / HAND_EQUIPMENT_REGION contains:
- 왼손 영역 / LEFT_HAND_REGION
- 오른손 영역 / RIGHT_HAND_REGION
- 랜턴 버튼 영역 / LANTERN_BUTTON_REGION
- 곡괭이 버튼 영역 / PICKAXE_BUTTON_REGION
- 장갑 버튼 영역 / GLOVES_BUTTON_REGION
- 자동 채굴 토글 영역 / AUTO_TOGGLE_REGION
- 설정 버튼 영역 / SETTINGS_BUTTON_REGION
- 곡괭이 타격 영역 / PICKAXE_SWING_REGION
- 랜턴 빛 영역 / LANTERN_GLOW_REGION

Layout:

```text
왼손+랜턴      ∞  ⚙      오른손+곡괭이
```

## 7. Core Resource Rule

Base mining gives exactly one resource per broken block.

```text
1 broken block = 1 resource
```

Examples:
- STONE_BLOCK → STONE +1
- COAL_ORE_BLOCK → COAL +1
- IRON_ORE_BLOCK → IRON +1
- DIAMOND_ORE_BLOCK → DIAMOND +1

Extra rewards use bonus +1 chance.

```ts
baseAmount = 1
bonusAmount = random() < bonusChance ? 1 : 0
finalAmount = baseAmount + bonusAmount
maxBonusChance = 0.75
```

## 8. Resources

MVP resources:
- STONE
- COAL
- COPPER
- IRON
- GOLD
- CRYSTAL
- DIAMOND

Resource roles:
- STONE = basic material
- COAL = early lantern and support material
- COPPER = early/mid equipment material
- IRON = pickaxe and mid progression material
- GOLD = mid/late equipment material
- CRYSTAL = rare and late progression material
- DIAMOND = MVP milestone resource

## 9. Layers

MVP layers:
- 0m ~ 49m = 흙층 / Dirt Layer
- 50m ~ 199m = 돌 지층 / Stone Layer
- 200m ~ 449m = 석탄맥 / Coal Vein
- 450m ~ 899m = 철 심층 / Iron Depth
- 900m ~ 1499m = 수정 동굴 / Crystal Cave
- 1500m+ = 다이아 심층 / Diamond Depth

## 10. Reward Encounter

Reward Encounter appears between Mining Faces.

Title:

```text
보상 발견
```

Prompt:

```text
무엇을 가져갈까?
```

Reward duration types:
- IMMEDIATE
- NEXT_FACE_START
- NEXT_FACE_ACTIVE
- NEXT_FACE_CLEAR

Reward natures:
- PICKAXE
- LANTERN
- GLOVES
- MATERIAL

Temporary reward effects are shown through 활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION. This chip appears directly below the thin top HUD, not inside the HUD and not at the HUD right edge.

Examples:
- 빠른 손놀림 적용 중 · 이번 채굴면 동안
- 균열 폭탄 대기 중 · 다음 채굴면 시작 시
- 광맥의 빛 대기 중 · 다음 채굴면은 광맥 이상

## 11. AUTO Mining

AUTO Mining is the default mining behavior.

The AUTO toggle is 자동 채굴 토글 영역 / AUTO_TOGGLE_REGION.

Icon:

```text
∞
```

AUTO chooses target cells using target scoring.

Target scoring considers:
- resource priority
- crack progress
- reward effect priority
- pattern tie-breaker

AUTO keeps hitting the same valid target until it breaks.

AUTO shows all visible mining feedback.

## 12. Mining Core

Mining Core is the main permanent growth system.

```text
                 랜턴 / Lantern
                       ↑

장갑 / Gloves ← 채굴 코어 / Mining Core → 곡괭이 / Pickaxe

                       ↓
              심층 코어 / Deep Core
```

Node count:
- Center: 1
- Pickaxe: 46
- Lantern: 46
- Gloves: 46
- Deep Core: 46
- Total: 189

Rarity colors:
- CENTER = yellow
- COMMON = white
- MAGIC = green
- RARE = blue
- UNIQUE = purple
- LOCKED = dark gray

Unique tier nodes change visible equipment or core tier and act as branch milestones.

## 13. Mining Core Cost and Reset

Node cost is calculated from:
- branch
- rarity
- costPreset

Formula:

```ts
budget = COST_BUDGET[costPreset][rarity]
profile = COST_PROFILE[branch][costPreset]
cost = distributeBudget(budget, profile)
```

Reset refund:

```ts
refundAmount = floor(spentAmount * 0.9)
```

Refund uses exact recorded spent resources.

## 14. Offline Reward

Offline Reward is calculated on return.

Rules:
- AUTO was ON
- Reward Encounter was not open
- offline time >= 60 seconds
- max offline time = 4 hours
- offline efficiency = 35%
- max offline depth gain = 50m

Offline Reward appears through 오프라인 보상 영역 / OFFLINE_REWARD_REGION.

## 15. Save Data and Logs

The game tracks:
- progress
- resources
- Mining Core state
- current Mining Face
- Reward Encounter state
- offline data
- playtime stats
- settings
- unified logs

Unified logs use readable text.

Examples:
- [채굴] 312m 채굴면 클리어 - 돌 +4, 철 +2
- [보상] 균열 폭탄 / Crack Bomb 선택 - 다음 채굴면 3칸 균열 +2
- [강화] 균열 확산 / Fracture Spread 해금 - 돌 300, 철 20 사용
- [오프라인] 2시간 14분 보상 - 돌 +108, 석탄 +21

## 16. Chapter Goal

MVP chapter target:
- Diamond Depth unlocks by layer pacing.
- Chapter Core Face appears at `chapterClearDepthM`.
- Chapter Core Face clear → Chapter Clear.
- After Chapter Clear → continue mining endlessly.

Chapter Clear appears through 챕터 클리어 영역 / CHAPTER_CLEAR_REGION.

## 17. Debug Panel

Debug Panel is required.

It includes:
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

UI debugging includes:
- UI Region Inspector
- interactive hitbox debug
- HUD collision warnings

## 18. Monetization

Recommended model:

```text
Free Demo + Low-price Paid Full Game + Optional cosmetic/supporter DLC later
```

Recommended base price:

```text
$5.99 / ₩6,700
```

Safe lower price:

```text
$4.99 / ₩5,600
```

The monetization model is based on a one-time purchase game, with optional non-progression DLC later.

## 19. Final Priority

When design conflicts happen, prioritize:
1. Mining Face readability
2. AUTO mining feedback
3. resource ledger correctness
4. Mining Core clarity
5. debug visibility
6. clean progression pacing

## First-person Pickaxe Strike

Mining must be visually shown through the held pickaxe.

```text
The pickaxe moves toward the currently targeted Mining Face cell and strikes it.
Damage is applied at the impact timing.
```

Reference:

```text
docs/18_FIRST_PERSON_PICKAXE_STRIKE.md
```

# Mining Formulas and Costs / 채굴 수식과 비용

## Resources

0 STONE, 1 COAL, 2 COPPER, 3 IRON, 4 GOLD, 5 CRYSTAL, 6 DIAMOND.

## Blocks

0 DIRT_BLOCK, 1 STONE_BLOCK, 10 COAL_ORE_BLOCK, 11 COPPER_ORE_BLOCK, 12 IRON_ORE_BLOCK, 13 GOLD_ORE_BLOCK, 14 CRYSTAL_ORE_BLOCK, 15 DIAMOND_ORE_BLOCK, 16 DIAMOND_CORE_BLOCK.

## Required Hits

- DIRT_BLOCK = 1
- STONE_BLOCK = 2
- COAL_ORE_BLOCK = 2
- COPPER_ORE_BLOCK = 3
- IRON_ORE_BLOCK = 3
- GOLD_ORE_BLOCK = 4
- CRYSTAL_ORE_BLOCK = 5
- DIAMOND_ORE_BLOCK = 6
- DIAMOND_CORE_BLOCK = 30

## Resource Gain

1 broken block = 1 resource.

Resource order is explicit:

```text
STONE -> COAL -> COPPER -> IRON -> GOLD -> CRYSTAL -> DIAMOND
```

There is no HARD_STONE_BLOCK / hard-rock resource tier between STONE and COAL.

```ts
baseAmount = 1
bonusAmount = random() < bonusChance ? 1 : 0
finalAmount = baseAmount + bonusAmount
maxBonusChance = 0.75
```

## Depth and Layers

1 Mining Face clear = 1m deeper.

- Dirt Layer: 0m ~ 49m
- Stone Layer: 50m ~ 199m
- Coal Vein: 200m ~ 449m
- Iron Depth: 450m ~ 899m
- Crystal Cave: 900m ~ 1499m
- Diamond Depth: 1500m+

## Face Advance Transition

Mining Face clear plays an inward push-in transition.

```ts
faceAdvanceTransitionMs = 850
reducedMotionFaceAdvanceTransitionMs = 250
```

Sequence: last block breaks, dust bursts, current face darkens, tunnel opens, lantern glow reaches forward, camera pushes inward, side rock layers slide outward, new face approaches, depth HUD pulses.

## Diamond Core Face

Chapter Core Face appears at chapterClearDepthM.

```text
0 STONE_BLOCK          1 DIAMOND_ORE_BLOCK   2 STONE_BLOCK
3 DIAMOND_ORE_BLOCK   4 DIAMOND_CORE_BLOCK  5 DIAMOND_ORE_BLOCK
6 STONE_BLOCK          7 DIAMOND_ORE_BLOCK   8 STONE_BLOCK
```

Clear condition: all 9 cells broken.

Reward: DIAMOND +10 and Chapter Clear.


## Block Required Hits

MVP required hits:

| Block Type | Required Hits |
|---|---:|
| DIRT_BLOCK | 1 |
| STONE_BLOCK | 2 |
| COAL_ORE_BLOCK | 2 |
| COPPER_ORE_BLOCK | 3 |
| IRON_ORE_BLOCK | 3 |
| GOLD_ORE_BLOCK | 4 |
| CRYSTAL_ORE_BLOCK | 5 |
| DIAMOND_ORE_BLOCK | 6 |
| DIAMOND_CORE_BLOCK | 30 |

## Damage Visual Stage Formula

```ts
damageRatio = clamp(currentHits / requiredHits, 0, 1)
```

Visual stage:

```ts
if currentHits <= 0: INTACT
if currentHits >= requiredHits: EMPTY
if damageRatio <= 0.25: CHIPPED
if damageRatio <= 0.5: CRACKED
if damageRatio <= 0.75: EXPOSED
else: CRUMBLING
```

Detailed visual rules are in:

```text
docs/18_MINING_FACE_DAMAGE_VISUAL_STAGES.md
```

## Mining Face Generation Reference

Layer-based face generation tables are defined in:

```text
docs/19_MINING_FACE_GENERATION_PATTERNS.md
```

Use those tables for:

- base block weights
- ore pool weights
- face visual preset weights
- transform rules
- deterministic generation

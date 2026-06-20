# Mining Core Unlock and Costs / 채굴 코어 해금과 비용

## 1. Purpose

This document defines Mining Core node unlock states, unlock transaction, cost budgets, and resource distribution rules.

Cost must not use only one or two resources after more resources are unlocked.

Each cost preset must distribute cost across all resources unlocked by that stage, with branch-specific weight bias.

## 2. Starting Active Nodes

New save starts with these nodes active:

```text
0    채굴 코어 / Mining Core
1000 낡은 곡괭이 / Worn Pickaxe
2000 낡은 랜턴 / Worn Lantern
3000 낡은 장갑 / Worn Gloves
4000 깊은 코어 / Deep Core
```

These are baseline nodes and cost no resources.

The first paid nodes are slot 1+ nodes.

## 3. Node States

Node states:

```ts
type MiningCoreNodeState =
  | 'LOCKED'
  | 'AVAILABLE'
  | 'AFFORDABLE'
  | 'ACTIVE';
```

Meaning:

```text
LOCKED
= parent or layer requirement is not met

AVAILABLE
= parent and layer requirements are met, but resources are insufficient

AFFORDABLE
= requirements are met and resources are sufficient

ACTIVE
= already unlocked
```

AFFORDABLE nodes should pulse softly on the Mining Core map.

## 4. Node Detail UI

Normal player-facing node detail must be compact and game-like.

Show only:

```text
node name
state badge
effect summary 1~2 lines
cost
unlock condition
unlock button/state
```

Recommended layout:

```text
[노드 이름]                         [상태 배지]

효과 설명 1~2줄

비용: 석탄 12 / 철 3
조건: 이전 노드 필요

                                  [해금]
```

State badges:

```text
해금됨
해금 가능
재료 부족
조건 필요
```

Button rules:

```text
AFFORDABLE = active unlock button
AVAILABLE = disabled button + 부족 재료 text
LOCKED = disabled button + 조건 필요 text
ACTIVE = no large disabled button; show compact 해금됨 badge
```

Do not show these in normal UI:

```text
raw node id
raw slot
raw effectKey
raw branch key
parent id list
cost preset
validation/internal debug details
```

Those belong in Debug Panel only.

## 5. Unlock Transaction

When the player presses [해금] on an AFFORDABLE node:

1. Check parent node requirements.
2. Check required layer.
3. Check owned resources.
4. Subtract exact cost from currentResources.
5. Add spend to lifetimeSpentResources.
6. Add spend to miningCoreSpentResources.
7. Store exact spend in nodeSpendRecords[nodeId].
8. Add nodeId to activeNodeIds.
9. Recalculate passive effects.
10. Recalculate equipment/core visual tiers.
11. Add Unified Log.
12. Save immediately.
13. Refresh node detail and map state.

Example log:

```text
[강화] 철 곡괭이 / Iron Pickaxe 해금
사용: 🪨 돌 -450, ⚫ 석탄 -90, 🟠 구리 -120, ⛓ 철 -280, 🟡 금 -160
```

## 6. Cost Preset Resource Unlock Pools

Cost preset resource pools:

```text
C1 = STONE, COAL
C2 = STONE, COAL, COPPER
C3 = STONE, COAL, COPPER, IRON
C4 = STONE, COAL, COPPER, IRON, GOLD
C5 = STONE, COAL, COPPER, IRON, GOLD, CRYSTAL
C6 = STONE, COAL, COPPER, IRON, GOLD, CRYSTAL, DIAMOND
```

Rule:

```text
Every cost preset must use all resources in its unlock pool.
Branch identity is expressed by weight bias, not by excluding already unlocked resources.
```

Small budgets may round some tiny shares to 0 after integer rounding.
When possible, keep at least 1 of each unlocked resource once the budget is large enough.


## Ore Availability and Mixed Material Rule

Early C1 costs use STONE and COAL, so early face generation must provide enough COAL opportunities.
Later cost presets use mixed resources and continue to include lower-tier materials, so deeper layers must not remove lower-tier ores entirely.

Do not add extra early-coal catch-up variables for MVP.
Use the existing ore weight and preset weight tables in `docs/19_MINING_FACE_GENERATION_PATTERNS.md`.

Rules:

```text
New layers unlock new ore types.
New layers do not delete older ore types.
Lower-tier ores can become less common, but should remain available in deeper layers.
As depth increases, ore-bearing face presets should become more common because the resource pool becomes wider.
```

If early or mixed-material node unlocks feel blocked, first adjust:

```text
Dirt Layer ore preset weights
Stone Layer COAL/COPPER ore weight ratio
Coal Vein COAL/COPPER/IRON ore weight ratio
Iron/Crystal/Diamond lower-tier ore weights
Depth-layer preset weights in docs/19
```

Do not solve this by adding a separate hidden guarantee system unless a later design explicitly requires it.

## 7. Cost Budgets

Budget by costPreset and rarity:

| Cost Preset | COMMON | MAGIC | RARE | UNIQUE |
|---|---:|---:|---:|---:|
| C1 | 8 | 14 | 24 | 0 |
| C2 | 20 | 36 | 60 | 100 |
| C3 | 45 | 80 | 135 | 220 |
| C4 | 110 | 190 | 320 | 520 |
| C5 | 260 | 450 | 760 | 1200 |
| C6 | 650 | 1100 | 1800 | 3000 |

C1 UNIQUE is only used by starting baseline branch roots and is free.

## 8. Cost Distribution Algorithm

```ts
function calculateNodeCost(node: MiningCoreNode): ResourceAmountMap {
  const budget = COST_BUDGET[node.costPreset][node.rarity];
  const weights = COST_DISTRIBUTION[node.branch][node.costPreset];
  return distributeByWeightWithLargestRemainder(budget, weights);
}
```

Rules:

- use integer amounts
- total amount must equal budget
- use largest remainder rounding
- omit zero amounts from display
- never create negative costs
- root baseline nodes cost 0

## 9. PICKAXE Cost Distribution

Pickaxe favors stone, metal, hard materials, and late crystal/diamond, but still includes all unlocked resources.

| Preset | STONE | COAL | COPPER | IRON | GOLD | CRYSTAL | DIAMOND |
|---|---:|---:|---:|---:|---:|---:|---:|
| C1 | 80 | 20 | 0 | 0 | 0 | 0 | 0 |
| C2 | 55 | 20 | 25 | 0 | 0 | 0 | 0 |
| C3 | 35 | 15 | 20 | 30 | 0 | 0 | 0 |
| C4 | 20 | 10 | 15 | 35 | 20 | 0 | 0 |
| C5 | 12 | 8 | 12 | 25 | 18 | 25 | 0 |
| C6 | 8 | 6 | 8 | 18 | 15 | 25 | 20 |

## 10. LANTERN Cost Distribution

Lantern favors coal, gold, crystal, and discovery-related rare materials, but still includes all unlocked resources.

| Preset | STONE | COAL | COPPER | IRON | GOLD | CRYSTAL | DIAMOND |
|---|---:|---:|---:|---:|---:|---:|---:|
| C1 | 40 | 60 | 0 | 0 | 0 | 0 | 0 |
| C2 | 25 | 45 | 30 | 0 | 0 | 0 | 0 |
| C3 | 15 | 35 | 20 | 30 | 0 | 0 | 0 |
| C4 | 10 | 25 | 15 | 20 | 30 | 0 | 0 |
| C5 | 7 | 15 | 10 | 18 | 25 | 25 | 0 |
| C6 | 5 | 10 | 8 | 15 | 22 | 25 | 15 |

## 11. GLOVES Cost Distribution

Gloves favors copper, iron, speed/rhythm materials, and late crystal, but still includes all unlocked resources.

| Preset | STONE | COAL | COPPER | IRON | GOLD | CRYSTAL | DIAMOND |
|---|---:|---:|---:|---:|---:|---:|---:|
| C1 | 55 | 45 | 0 | 0 | 0 | 0 | 0 |
| C2 | 35 | 25 | 40 | 0 | 0 | 0 | 0 |
| C3 | 20 | 20 | 35 | 25 | 0 | 0 | 0 |
| C4 | 12 | 12 | 28 | 30 | 18 | 0 | 0 |
| C5 | 8 | 8 | 20 | 28 | 16 | 20 | 0 |
| C6 | 5 | 6 | 15 | 25 | 16 | 18 | 15 |

## 12. DEEP_CORE Cost Distribution

Deep Core is balanced and uses a broader spread of all unlocked resources.

| Preset | STONE | COAL | COPPER | IRON | GOLD | CRYSTAL | DIAMOND |
|---|---:|---:|---:|---:|---:|---:|---:|
| C1 | 50 | 50 | 0 | 0 | 0 | 0 | 0 |
| C2 | 35 | 35 | 30 | 0 | 0 | 0 | 0 |
| C3 | 25 | 25 | 25 | 25 | 0 | 0 | 0 |
| C4 | 18 | 18 | 22 | 22 | 20 | 0 | 0 |
| C5 | 12 | 12 | 16 | 20 | 20 | 20 | 0 |
| C6 | 8 | 8 | 12 | 18 | 18 | 20 | 16 |

## 13. Reset Refund

Reset refund:

```ts
refundAmount = floor(spentAmount * 0.9)
```

Refund uses exact nodeSpendRecords.

On reset:

1. Collect affected active nodes.
2. Sum exact nodeSpendRecords.
3. Refund 90%.
4. Remove active nodes.
5. Clear nodeSpendRecords for reset nodes.
6. Recalculate passives.
7. Recalculate visual tiers.
8. Add log.
9. Save immediately.

## 14. Autosave Rule

Node unlock and reset are important events.

They must save immediately after state mutation succeeds.

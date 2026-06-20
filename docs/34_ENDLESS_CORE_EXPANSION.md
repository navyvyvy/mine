# Endless Core Expansion Skeleton / 엔드리스 코어 확장 골격

## 1. Purpose

This document defines a future-safe expansion skeleton after Chapter Clear.

MVP does not implement active Endless Core gameplay.

MVP should include only the locked tab structure and data placeholders so future development can add high-tier nodes and post-diamond resources without interfering with the current Mining Core.

## 2. Unlock Timing

Endless Core tab visibility is opened by the final Deep Core unique node.

Unlocking node 4046:

```text
4046 엔드리스 문 / Endless Gate
effectKey = DEEP_CORE_ENDLESS_TAB_OPEN
```

sets:

```ts
endlessCore.visible = true
endlessCore.openedByNodeId = 4046
```

MVP behavior:

```text
Endless Core tab becomes visible.
Endless Core tab shows locked/future content message.
No active Endless Core nodes are implemented in MVP.
No post-diamond resource is generated in MVP.
```

Chapter Clear can update the message, but the tab itself is opened by the final Deep Core unique node.


## 3. UI Structure

Mining Core screen can support tabs:

```text
[Mining Core] [Endless Core]
```

MVP behavior:

```text
Mining Core tab = active current system
Endless Core tab = disabled / locked skeleton
```

Suggested locked message:

```text
엔드리스 코어
다이아 코어 이후 열리는 추가 성장 영역입니다.
현재 버전에서는 비활성화되어 있습니다.
```

## 4. Future Post-Diamond Resources

Reserve future resource IDs separately from MVP resources.

MVP resource IDs:

```text
0 STONE
1 COAL
2 COPPER
3 IRON
4 GOLD
5 CRYSTAL
6 DIAMOND
```

Reserved future resource IDs:

```text
100 ABYSS_STONE      / 심연석
101 MYTHRIL          / 미스릴
102 AETHER_CRYSTAL   / 에테르 결정
103 STAR_ORE         / 성광석
```

Rules:

- these resources are not generated in MVP
- these resources do not appear in normal Resource Screen unless debug/future flag is enabled
- no current Mining Core node should require these resources
- Endless Core future nodes may use these resources

## 5. Future Equipment Tiers

Reserved future equipment tiers:

```text
OBSIDIAN
MYTHRIL
AETHER
STELLAR
```

Future examples:

- 심연 곡괭이 / Abyss Pickaxe
- 미스릴 곡괭이 / Mythril Pickaxe
- 에테르 랜턴 / Aether Lantern
- 성광 장갑 / Stellar Gloves

MVP does not implement these as active equipment.

## 6. Future High-Tier Node Direction

Endless Core should focus on high-impact, satisfying effects that do not rewrite the MVP systems.

Future node categories:

- multi-face reward duration
- deeper ore generation
- post-diamond resource conversion
- high-tier equipment visuals
- larger resource bursts
- rare Diamond Core-style faces
- cosmetic mining effects
- advanced offline depth cap
- special chapter-like milestones

## 7. Implementation Skeleton

Recommended future-safe types:

```ts
type CoreTab = 'MINING_CORE' | 'ENDLESS_CORE';

type EndlessCoreState = {
  unlocked: boolean;
  visible: boolean;
  activeNodeIds: number[];
};
```

MVP default:

```ts
endlessCore.unlocked = false
endlessCore.visible = false
endlessCore.activeNodeIds = []
```

After unlocking node 4046 in MVP:

```ts
endlessCore.visible = true
endlessCore.unlocked = false
endlessCore.openedByNodeId = 4046
```

This allows the player to see that future growth can exist without enabling unfinished systems.

## 8. MVP Rule

Do not implement active Endless Core nodes in MVP.

Only prepare:

- optional tab structure
- locked UI copy
- reserved resource IDs
- reserved equipment tiers
- state shape

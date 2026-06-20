# Mining Core Map Layout / 채굴 코어 맵 레이아웃


## V43 Correction: Repeated Shared Topology Deprecated

The previous document used one shared slot topology and transformed it into four directions.
That creates four branches with the same connection rhythm and the same line pattern.

This is now deprecated for the final visual Mining Core board.

Keep the node count and effect structure unless a separate balance pass changes them, but do not treat the repeated shared topology as visually final.

The visible Mining Core route pattern must be branch-specific.
See:

```text
docs/35_MINING_CORE_CONNECTION_PATTERN_REDESIGN.md
```

The old coordinate table below may be used only as legacy implementation reference until the visual route data is regenerated.


## Coordinate System

Center is 0,0.

x positive = right.
x negative = left.
y positive = down.
y negative = up.

## Legacy Branch Transform / Deprecated for Final Visual Routes

PICKAXE: x = d, y = o  
LANTERN: x = o, y = -d  
GLOVES: x = -d, y = o  
DEEP_CORE: x = o, y = d

## Branch ID Bases

- PICKAXE = 1000
- LANTERN = 2000
- GLOVES = 3000
- DEEP_CORE = 4000

## Legacy Shared Slot Topology / Deprecated for Final Visual Routes

Each branch has 46 slots.

Rarity distribution:

- COMMON 18
- MAGIC 12
- RARE 10
- UNIQUE 6

Slot format:

```text
slot: rarity, d, o, parentSlots
```

```text
0: UNIQUE, 1, 0, center
1: COMMON, 2, 0, 0
2: COMMON, 3, -1, 1
3: COMMON, 3, 1, 1
4: MAGIC, 4, -2, 2
5: RARE, 4, 2, 3
6: COMMON, 5, -1, 4
7: MAGIC, 5, 1, 5
8: RARE, 6, 0, 6|7
9: COMMON, 7, -2, 8
10: COMMON, 7, 2, 8
11: MAGIC, 8, -3, 9
12: UNIQUE, 8, 3, 10|11
13: COMMON, 9, -1, 12
14: COMMON, 9, 1, 12
15: MAGIC, 10, -2, 13
16: RARE, 10, 2, 14|15
17: COMMON, 11, 0, 16
18: MAGIC, 12, -2, 17
19: MAGIC, 12, 2, 17
20: UNIQUE, 13, 0, 18|19
21: COMMON, 14, -3, 20
22: COMMON, 14, 3, 20
23: COMMON, 15, -1, 21
24: COMMON, 15, 1, 22
25: RARE, 16, -2, 23
26: RARE, 16, 2, 24
27: MAGIC, 17, -3, 25
28: MAGIC, 17, 3, 26
29: COMMON, 18, -1, 27
30: COMMON, 18, 1, 28
31: RARE, 19, 0, 29|30
32: COMMON, 20, -2, 31
33: UNIQUE, 20, 2, 31
34: COMMON, 21, -3, 32
35: COMMON, 21, 3, 33
36: MAGIC, 22, -2, 34
37: MAGIC, 22, 2, 35
38: RARE, 23, -1, 36
39: RARE, 23, 1, 37
40: MAGIC, 24, -3, 38
41: MAGIC, 24, 3, 39
42: RARE, 25, -1, 40
43: RARE, 25, 1, 41|42
44: UNIQUE, 26, -1, 43
45: UNIQUE, 27, 0, 44
```

## Parent Resolution

If parent is center, parent ID = 0.

Otherwise:

```ts
parentId = branchBase + parentSlot
```

## Interaction

If pointer moves more than 6px before release, treat as drag, not click.

Node click opens 노드 상세 영역 / NODE_DETAIL_REGION.

## Final Bridge Topology

Each branch has 47 nodes.

The final two UNIQUE nodes must not be directly adjacent.

Final path rule:

```text
slot 44 = late UNIQUE tier node
slot 45 = final bridge RARE node
slot 46 = capstone UNIQUE node
```

Branch capstones:

```text
1046 다이아 곡괭이 / Diamond Pickaxe
2046 다이아 랜턴 / Diamond Lantern
3046 다이아 장갑 / Diamond Gloves
4046 엔드리스 문 / Endless Gate
```

Reason:

```text
The player should feel one last push before the final capstone.
```

## Mining Core Player UI Rules

Mining Core is a node board, not a list.

Interaction must work:

```text
node click changes selectedNodeId
selected detail updates immediately
dragging board does not select nodes
click is separated from drag by movement threshold
pan position persists while panel is open
board does not snap back unless reset is explicitly requested
SVG layers must not block node clicks
```

Normal player-facing board must hide debug identifiers.

Do not show on normal board/detail:

```text
raw node id labels such as 2000 / 3000 / 4000
raw slot
raw effectKey
raw branch key
parent id list
cost preset
internal validation text
```

Player detail panel shows only:

```text
node name
effect summary
cost
unlock condition
unlock button
```

The selected detail panel should fit in one screen without internal scrolling.
If more data is needed, move it to Debug Panel.

Visual readability:

```text
larger readable nodes
visible parent links
strong selected ring
clear unlockable glow
clear unlocked fill
unique/capstone special frame
clear branch colors
Korean branch labels if shown
hidden scrollbars for board pan region
```

Recommended panel structure:

```text
fixed top header: title / close
middle: pannable node board
fixed bottom: compact selected node detail
```

## Direct Selection and No Visible Scrollbar Rule

Direct node selection is mandatory.

Rules:

```text
click/tap node -> selectedNodeId changes
selected ring moves to that node
detail panel immediately updates to that exact node
unlock button applies to selectedNodeId only
selection must not depend on tab/header selection
selection must not depend on scroll side effects
```

Board movement:

```text
hide visible scrollbars
preserve drag-to-pan behavior
no horizontal browser scrollbar
header stays fixed
detail panel stays fixed and compact
board does not snap back unless explicit reset is used
```


## Branch Quick Navigation Tabs

Mining Core may include compact branch quick navigation controls.

Tabs are not node detail selectors by themselves.
They are board navigation shortcuts.

Tabs:

```text
곡괭이
랜턴
장갑
심층
```

On branch tab click:

```text
1. focus the board on that branch
2. move to the branch progress point
3. branch progress point = next AFFORDABLE node if any
4. otherwise next AVAILABLE node if any
5. otherwise deepest ACTIVE node in that branch
6. otherwise branch root
```

The selected node may update to that progress point, but selected detail must still be based on an actual selected node ID.

Reset/focus behavior:

```text
if no branch tab is focused, reset view returns to center core
if a branch tab is focused, reset/focus returns to that branch progress point
```

The tab row must remain visible and must not be hidden by board scroll/pan.

## Mining Core Growth Path Visual Rule

Mining Core should read as a growth tree, not a generic graph.

Each branch should have:

```text
clear main spine
readable side branches
visible branch end / capstone
clear milestone nodes
less visual noise
strong current / next / unlocked path readability
```

Visual rules:

```text
main spine links are more important than side links
side branch links are thinner/subtler
unlocked path is brighter
next unlockable node has clear glow
selected node has strong ring
capstone/unique nodes have special frames
branch endings should be visually clear
lines should not look like random tangled graph edges
```



## V43 Node Connection Pattern Rule

The Mining Core board must not look like one connection pattern copied four times.

The main issue is not glow or line color.
The issue is repeated topology and repeated line rhythm.

Rules:

```text
all four branches must not share the same visible route pattern
all four branches must not use identical fork timing
all four branches must not use identical merge timing
all four branches must not use identical line bend shapes
```

Each branch needs its own visual silhouette:

```text
PICKAXE = direct aggressive strike path with short angled prongs
LANTERN = wandering discovery path with asymmetric side finds
GLOVES = compact grouped technique clusters with short lateral links
DEEP_CORE = heavier downward buried spine with sparse meaningful branches
```

Connection line route types should vary:

```text
straightShort
straightLong
softCurve
singleElbowA
singleElbowB
doglegShort
doglegLong
steppedCrack
shortHook
mergeFork
capstoneBridge
```

Do not use the same connector shape for every edge.
Do not solve this only with CSS glow.
The node route pattern itself must change.

Existing generated positions/routes are legacy visual data until regenerated.
Node ids, costs, effect keys, and unlock dependency basics remain usable.

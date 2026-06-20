# Mining Core Connection Pattern Redesign / 채굴 코어 연결 패턴 재설계

## Purpose

Mining Core node connections must be redesigned because the current documented pattern is too repetitive.

The problem is not simply line color, glow, or visual effect.
The real problem is that the current layout uses one repeated node topology and rotates/transforms it for every branch.
This makes all four branches feel like the same line pattern copied four times.

## Current Problem

The existing layout rules create these issues:

```text
same slot pattern
same parent rhythm
same branch silhouette
same line angles
same merge timing
same fork timing
same repeated visual route across all four branches
```

Result:

```text
The Mining Core board looks auto-generated instead of designed.
The four branches do not feel like different equipment systems.
The connection lines all have the same rhythm.
```

## V43 Decision

The old shared visual topology is deprecated.

Do not use one identical slot topology and rotate it four times for the final visible Mining Core board.

The branch effect count and node identity may remain similar, but the visible route pattern must be branch-specific.

```text
PICKAXE route shape must not match LANTERN.
LANTERN route shape must not match GLOVES.
GLOVES route shape must not match DEEP_CORE.
DEEP_CORE route shape must not match PICKAXE.
```

## What Must Stay

Keep these stable unless a separate balance pass changes them:

```text
Center node
4 main branches
47 nodes per branch
189 total nodes
branch identities
rarity distribution targets
effect value tables
unlock cost logic
capstone concept
```

## What Must Change

The visible node route topology must change.

Change:

```text
node coordinates
parent route shape
connection line path types
branch silhouettes
branch merge/fork rhythm
main spine shape
side branch spacing
```

Do not change only CSS stroke color and glow.
That does not solve the problem.

## Branch-Specific Route Silhouettes

### PICKAXE

Theme:

```text
strong, direct, tool-strike progression
```

Visual route:

```text
aggressive forward spine
short angled side prongs
few but clear merges
heavier milestone links
```

Avoid:

```text
soft symmetric wave
long repeated zig-zag
same fork pattern as Lantern
```

### LANTERN

Theme:

```text
light, discovery, ore reveal, exploration
```

Visual route:

```text
slightly wandering path
small side discoveries
asymmetric branches
occasional loop-like detours without forming real graph loops
```

Avoid:

```text
straight comb layout
same diagonal teeth as Pickaxe
perfect symmetry
```

### GLOVES

Theme:

```text
hand-work, speed, rhythm, cleanup, nearby impact
```

Visual route:

```text
compact clustered route
paired nearby nodes
short lateral links
branch groups that feel like work techniques
```

Avoid:

```text
long straight spine only
same wide branch spread as Deep Core
same repeated pair shape every layer
```

### DEEP_CORE

Theme:

```text
deep system, offline, long-term growth, buried power
```

Visual route:

```text
heavier downward spine
slower wider spacing
fewer but more meaningful side branches
deep milestone bridges
```

Avoid:

```text
busy small branches everywhere
same dense pattern as Gloves
same route rhythm as Pickaxe
```

## Connection Path Types

The renderer or node data should support varied path types.

Allowed path types:

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

Rules:

```text
Do not use the same path type for every edge.
Do not use the same path type more than 2 times consecutively on a branch spine.
Do not use the same path type sequence across all four branch roots.
Main spine edges and side branch edges should use different route families.
Merge edges should have a visibly different shape from normal single-parent edges.
Capstone edges should be deliberate and heavier.
```

## Visual Weight Rules

Connection lines should have hierarchy.

```text
main spine = clearest
milestone bridge = slightly heavier
side branch = thinner/subtler
locked path = dimmer
unlocked path = brighter
selected/next path = highlighted but not neon
```

Do not make all connection lines identical in:

```text
stroke width
brightness
bend count
bend direction
curve amount
spacing
pattern
```

## Data / Rendering Recommendation

A future implementation pass should add or derive edge visual metadata.

Recommended edge metadata:

```ts
edgeRole: 'spine' | 'side' | 'merge' | 'milestone' | 'capstone'
visualRouteType: 'straightShort' | 'softCurve' | 'singleElbowA' | 'doglegShort' | 'steppedCrack' | ...
visualWeight: 'main' | 'secondary' | 'dim' | 'milestone'
laneOffset: number
```

If the runtime node data is not regenerated yet, the renderer may derive these values from:

```text
branch
slot
rarity
parent count
is capstone
is main spine candidate
```

However, the final visible board must not rely on the old repeated topology as the visual source of truth.

## Existing Generated Node Data Status

The current generated node data is still usable for:

```text
node ids
branch ids
names
effect keys
cost presets
unlock dependency basics
```

But current generated positions and visible line routes should be treated as legacy visual data.

```text
Do not consider the current repeated coordinates/route pattern visually final.
```

## Validation Checklist

A Mining Core board passes this check only if:

```text
four branches have clearly different silhouettes
main branch paths are readable
side branches are readable but quieter
connection lines do not look copy-pasted
merge points do not repeat the same shape everywhere
capstone routes feel deliberate
node labels/details are not crossed by lines
lines remain behind nodes
```

Failure examples:

```text
all branches look like the same rotated comb
all paths have identical bend shape
all lines have the same thickness and brightness
all merge nodes have the same Y-shaped connector
side branches repeat every two slots with the same rhythm
```

## Summary

The Mining Core connection problem is a topology/pattern problem, not an effect problem.

The final Mining Core board needs designed route variation:

```text
branch-specific silhouettes
varied edge path types
hierarchical line weight
non-repeating fork/merge rhythm
clear main spine per branch
```

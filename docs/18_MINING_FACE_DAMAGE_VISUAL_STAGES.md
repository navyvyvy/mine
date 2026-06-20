# Mining Face Damage Visual Stages / 채굴면 파괴 단계

## 1. Purpose

This document defines how many hits each block requires and how the wall visually changes as it is damaged.

The player should feel that the wall is gradually breaking.

The gameplay remains cell-based, but the Mining Face should visually read as one continuous 3x3 mine wall.

## 2. Core Rule

Each Mining Face cell has:

```ts
requiredHits: number
currentHits: number
isBroken: boolean
```

Damage progress:

```ts
damageRatio = clamp(currentHits / requiredHits, 0, 1)
```

Visual stage is derived from `damageRatio`.

## 3. Required Hits

MVP required hits:

| Block Type | Required Hits | Purpose |
|---|---:|---|
| DIRT_BLOCK | 1 | very early fast break |
| STONE_BLOCK | 2 | basic wall block |
| COAL_ORE_BLOCK | 2 | early ore |
| COPPER_ORE_BLOCK | 3 | early-mid ore |
| IRON_ORE_BLOCK | 3 | mid ore |
| GOLD_ORE_BLOCK | 4 | rare mid-late ore |
| CRYSTAL_ORE_BLOCK | 5 | late rare ore |
| DIAMOND_ORE_BLOCK | 6 | endgame rare ore |
| DIAMOND_CORE_BLOCK | 30 | chapter clear core |

These values are the baseline before passive effects and temporary reward effects. HARD_STONE_BLOCK / Hard Rock is removed from normal MVP block lists.

## 4. Design Reason

The hit table should create this rhythm:

```text
DIRT
= breaks immediately, good first feedback

STONE / COAL
= 2 hits, player sees the first crack and then break

COPPER / IRON
= 3 hits, enough to show damage progression

GOLD / CRYSTAL / DIAMOND
= 4~6 hits, valuable blocks feel heavier

DIAMOND_CORE
= 30 hits, special chapter object with boss-like persistence
```

## 5. Visual Damage Stages

Visual stages:

```ts
type CellDamageVisualStage =
  | 'INTACT'
  | 'CHIPPED'
  | 'CRACKED'
  | 'EXPOSED'
  | 'CRUMBLING'
  | 'EMPTY';
```

Meaning:

| Stage | Ratio | Visual Meaning |
|---|---:|---|
| INTACT | 0 | untouched wall |
| CHIPPED | >0 and <=0.25 | small chips and hairline cracks |
| CRACKED | >0.25 and <=0.5 | visible cracks and chipped fragments; no open hole yet |
| EXPOSED | >0.5 and <=0.75 | widened fractures, exposed inner rock/ore surfaces; not an empty hole |
| CRUMBLING | >0.75 and <1 | almost broken, crumbling edges, deep fractures, loose fragments; still not fully hollow |
| EMPTY | >=1 | broken cell, mined-out dark hole/tunnel void |

Implementation:

```ts
function getCellDamageVisualStage(currentHits: number, requiredHits: number): CellDamageVisualStage {
  if (currentHits <= 0) return 'INTACT';
  if (currentHits >= requiredHits) return 'EMPTY';

  const ratio = currentHits / requiredHits;

  if (ratio <= 0.25) return 'CHIPPED';
  if (ratio <= 0.5) return 'CRACKED';
  if (ratio <= 0.75) return 'EXPOSED';
  return 'CRUMBLING';
}
```


## 5.1 Progressive Crack and Exposure Rule

Use the existing visual stages above. Do not add new damage state names for MVP.
The problem to avoid is interpreting EXPOSED or CRUMBLING as early punched holes.

Before `EMPTY`, the block is still present. Damage must progress through cracks and exposed surfaces, not through fixed circular holes.

Required progression:

```text
INTACT
= mostly whole stone face

CHIPPED
= small chips, hairline cracks, light dust

CRACKED
= cracks grow and branch from previous cracks

EXPOSED
= cracks widen; inner rock or embedded ore surface becomes visible

CRUMBLING
= edges and surfaces crumble; fragments loosen; ore is most visible if present

EMPTY
= only now the cell becomes a mined-out dark hole
```

Rules:

```text
Do not use a center hole as an early damage stage.
Do not use a lower-left hole or second hole as an early damage stage.
Do not use a fixed hole-mask sequence like: crack, crack, center hole, side hole, empty.
Every non-empty hit should add or deepen cracks, chips, widened fractures, exposed surfaces, dust, or fragments.
Only EMPTY may render as a true hollow mined-out hole.
```

Ore exposure rule:

```text
If the block contains ore, the ore should become progressively clearer as cracks and exposure increase.
CHIPPED: tiny hints or flakes only.
CRACKED: mineral color appears along crack lines.
EXPOSED: mineral surface becomes readable.
CRUMBLING: mineral is clearest before the final break.
EMPTY: ore overlay disappears because the resource has been mined.
```

Plain rock rule:

```text
If the block has no ore, the same stages show rock cracks, dust, chipped edges, and dark fractures only.
Do not fake ore color on plain rock.
```

Crack growth rule:

```text
A block should look like its existing cracks are growing.
Do not redraw unrelated random cracks on every hit.
Use deterministic seeded crack paths per face/cell/block, then reveal more of that path as currentHits increases.
```

## 6. Low Hit Block Rule

Blocks with very low requiredHits still need visual feedback.

### 1-hit blocks

DIRT_BLOCK jumps from INTACT to EMPTY, but should play a short break animation:

```text
hit flash
small dust burst
quick crack flash
break burst
empty hole
```

### 2-hit blocks

STONE_BLOCK and COAL_ORE_BLOCK show:

```text
0 hits = INTACT
1 hit = CRACKED, with visible cracks only; do not show a punched hole
2 hits = EMPTY
```

### 3-hit blocks

COPPER_ORE_BLOCK and IRON_ORE_BLOCK show:

```text
0 hits = INTACT
1 hit = CHIPPED
2 hits = EXPOSED, with widened cracks and exposed surface; do not show a full hole
3 hits = EMPTY
```

### 4~6-hit blocks

Gold, Crystal, Diamond, and Hard Stone should show more gradual stages.

## 7. Cell Layer Structure

Each MiningCell renders layered generated art:

```text
MiningCell
  base block layer
  embedded ore / exposed mineral layer
  damage mask layer
  crack SVG layer
  exposed inner layer
  crumble fragment layer
  break/empty layer
```

Recommended DOM:

```tsx
<div className={`mining-cell stage-${stage.toLowerCase()}`}>
  <VisualAsset assetKey={baseBlockAssetKey} />
  {oreAssetKey && <EmbeddedOreLayer assetKey={oreAssetKey} damageStage={stage} />}
  <CellDamageOverlay stage={stage} blockType={blockType} />
</div>
```

## 7.1 Embedded Ore Visibility Rule

Ore visibility must be tied to the block damage stage.

Ore should not look like a permanent icon sitting on top of the cell. It should feel buried in the rock and become more visible as the surface is chipped and cracked.

Stage rules:

| Stage | Ore visibility rule |
|---|---|
| INTACT | ore is hidden or only subtly hinted inside the rock texture |
| CHIPPED | small traces, flakes, or chipped mineral edges may appear |
| CRACKED | ore may become visible along cracks and broken surface lines |
| EXPOSED | embedded mineral surfaces become clearly visible |
| CRUMBLING | mineral fragments, broken rock edges, dust, and exposed pieces are visible |
| EMPTY | no ore overlay; the cell becomes a mined-out dark hole |

Avoid using repeated centered circles, dots, badges, raw resource symbols, or clean UI markers as the ore/resource marker in normal gameplay. A soft natural highlight, shadow, or cloudy mineral exposure can exist if it varies per block and reads as rock texture.



## 7.2 Embedded Ore Readability Rule

Ore visibility must not be reduced to the point that the resource type is unreadable.

Rules:

```text
embedded does not mean hidden
ore must become clearer as damage increases
ore-bearing cells must be distinguishable from plain rock
ore shape must not be a repeated centered circle, corner dot, badge, or icon used as the primary resource marker
ore should appear as irregular seams, fragments, mineral layers, shards, flakes, or exposed faces
resource type should be identifiable from color/shape/surface treatment
```

Texture/pattern variation rule:

```text
Do not make all blocks share the same centered cloudy mark or circular exposure.
A central scuff/highlight is acceptable only when it is part of varied natural rock lighting.
Ore exposure should vary by material, damage stage, crack direction, and neighboring vein layout.
The 3x3 wall should feel naturally connected, not like nine copies of one texture.
```

Fail if:

```text
the player cannot tell which cells contain ore
the player cannot distinguish major ore types visually
ore only becomes known after toast/resource gain text
ore looks like generic blur/noise
```

## 8. Generated CSS/SVG Damage Overlay

Damage stages can be expressed with CSS and SVG.

Recommended implementation files:

```text
src/components/mining/CellDamageOverlay.tsx
src/components/mining/MiningFaceWallOverlay.tsx
src/styles/mining-damage.css
src/styles/mining-wall-overlays.css
```

### CellDamageOverlay

Uses SVG paths and CSS masks.

It should render:

- small chips
- cracks
- exposed inner rock or ore surface
- chipped edge loss and loose fragments
- crumbling fragments
- empty dark hole only for EMPTY

The SVG does not need to be fully procedural.

Use deterministic presets by cell index and block type.

## 9. Damage SVG Presets

Recommended preset keys:

```ts
type DamagePresetKey =
  | 'CHIP_TOP_LEFT'
  | 'CHIP_RIGHT_EDGE'
  | 'CRACK_DIAGONAL'
  | 'CRACK_BRANCH'
  | 'EXPOSED_SURFACE_CENTER'
  | 'EXPOSED_SURFACE_EDGE'
  | 'CRUMBLE_TOP_EDGE'
  | 'CRUMBLE_BOTTOM_EDGE'
  | 'CRUMBLE_SURFACE_CENTER'
  | 'EMPTY_DARK_HOLE';
```

Pick preset deterministically:

```ts
preset = DAMAGE_PRESETS[(faceSeed + cellIndex + currentHits) % DAMAGE_PRESETS.length]
```

Rule:

```text
Use deterministic variety.
Do not use fully random visuals that change every render.
```

## 10. Example Damage Overlay SVG

```tsx
function CellDamageOverlay({ stage }: { stage: CellDamageVisualStage }) {
  return (
    <svg viewBox="0 0 100 100" className={`cell-damage-overlay stage-${stage.toLowerCase()}`}>
      {stage !== 'INTACT' && (
        <path className="damage-crack-main" d="M22 18 C35 34, 46 40, 58 64" />
      )}
      {(stage === 'CRACKED' || stage === 'EXPOSED' || stage === 'CRUMBLING') && (
        <path className="damage-crack-branch" d="M48 42 C60 38, 66 30, 78 25" />
      )}
      {(stage === 'EXPOSED' || stage === 'CRUMBLING') && (
        <path className="damage-exposed-surface" d="M36 38 C48 28, 66 36, 70 52 C66 68, 44 72, 32 58 Z" />
      )}
      {stage === 'CRUMBLING' && (
        <path className="damage-crumble-edge" d="M8 68 C18 58, 34 62, 40 78 L40 100 L0 100 Z" />
      )}
      {stage === 'EMPTY' && (
        <path className="damage-empty-hole" d="M5 5 H95 V95 H5 Z" />
      )}
    </svg>
  );
}
```

`damage-exposed-surface` must be styled as a chipped/exposed inner surface or exposed mineral face, not as a black hole.  
`damage-crumble-edge` may remove small edge fragments visually, but it must not look like a separate punched-through hole before `EMPTY`.

## 11. CSS Stage Treatment

```css
.mining-cell.stage-intact {
  filter: none;
}

.mining-cell.stage-chipped {
  filter: brightness(0.98);
}

.mining-cell.stage-cracked {
  filter: brightness(0.94);
}

.mining-cell.stage-exposed {
  filter: brightness(0.9) saturate(1.05);
}

.mining-cell.stage-crumbling {
  filter: brightness(0.82) contrast(1.08);
}

.mining-cell.stage-empty {
  background:
    radial-gradient(circle at 50% 45%, rgba(0, 0, 0, 0.95), rgba(4, 6, 9, 0.9) 52%, rgba(24, 20, 16, 0.6) 100%);
}
```

## 12. Continuous 3x3 Wall Rule

The Mining Face is a 3x3 block wall.

Each cell is an individual square rock block for gameplay clarity.

The whole face should still read as one continuous mine wall.

Use shared SVG overlays for:

- wall seams
- global lantern lighting
- large cracks crossing multiple cells
- vein continuation
- face-wide dust and shadow

Do not make each cell look like a separate UI card.

## 13. Mining Face Overlay Structure

Recommended structure:

```tsx
<div className="mining-face">
  <MiningCell index={0} />
  <MiningCell index={1} />
  <MiningCell index={2} />
  <MiningCell index={3} />
  <MiningCell index={4} />
  <MiningCell index={5} />
  <MiningCell index={6} />
  <MiningCell index={7} />
  <MiningCell index={8} />

  <MiningFaceWallOverlay />
  <MiningFaceVeinOverlay />
  <MiningFaceLightingOverlay />
  <MiningFaceDustOverlay />
</div>
```

## 14. Wall Seam Overlay

The wall seam overlay draws cracks and seams across the 3x3 face.

It should make blocks feel connected.

ViewBox:

```text
0 0 300 300
```

Cell bounds:

```text
0: x 0~100,   y 0~100
1: x 100~200, y 0~100
2: x 200~300, y 0~100
3: x 0~100,   y 100~200
4: x 100~200, y 100~200
5: x 200~300, y 100~200
6: x 0~100,   y 200~300
7: x 100~200, y 200~300
8: x 200~300, y 200~300
```

Use paths for seams instead of thick UI borders.

## 15. Vein Continuation Overlay

Vein continuation is pattern-based.

It only applies to:

- VEIN
- RICH
- RARE
- DIAMOND_CORE

Do not generate arbitrary random cross-cell lines.

Recommended preset:

```ts
type FaceVeinPreset =
  | 'NONE'
  | 'HORIZONTAL_TOP'
  | 'HORIZONTAL_MIDDLE'
  | 'HORIZONTAL_BOTTOM'
  | 'VERTICAL_LEFT'
  | 'VERTICAL_CENTER'
  | 'VERTICAL_RIGHT'
  | 'DIAGONAL_DOWN'
  | 'DIAGONAL_UP'
  | 'L_SHAPE'
  | 'CROSS'
  | 'CORE_RADIAL';
```

Example SVG path:

```tsx
<svg viewBox="0 0 300 300" className="face-vein-overlay">
  <path className={`vein-line vein-${resourceId}`} d="M20 150 C70 132, 112 164, 150 150 C202 128, 235 152, 280 138" />
</svg>
```

This SVG example describes vein placement only. Final visuals should be masked/blended into the rock texture so the vein looks partially buried and irregular, not like a smooth decorative line floating above the wall.

## 16. Empty Cell Design

When a cell is broken, it should become a dark hole.

EMPTY cell requirements:

- no ore overlay
- no crack overlay
- dark interior
- subtle edge rim
- dust fade
- can show slight tunnel depth
- should not look like a black UI square

The empty hole should help sell the feeling that the wall is being mined away.

## 17. Face Clear Visual

When all 9 cells are EMPTY:

1. last break burst plays
2. dust expands across the face
3. the whole 3x3 face darkens
4. center tunnel opens visually
5. lantern glow pushes forward
6. inward face advance transition starts
7. new Mining Face appears from darkness

## 18. Validation

Manual validation:

- each block type uses the requiredHits table
- currentHits never exceeds requiredHits after break
- 1-hit blocks still show a quick break flash
- 2-hit blocks show at least one damage state before EMPTY
- 4~6-hit blocks show multiple damage states
- DIAMOND_CORE_BLOCK clearly persists through many hits
- non-EMPTY stages do not show circular center holes or extra punched holes
- each hit grows cracks/chips/fractures/exposed surfaces instead of swapping to unrelated hole masks
- ore-bearing blocks reveal ore progressively as damage increases
- plain rock blocks show rock fracture progression without fake ore color
- broken cells become dark holes only in EMPTY
- fully cleared face feels like a mined-out wall
- shared overlays make the 3x3 feel like one wall
- cells do not look like separate UI cards

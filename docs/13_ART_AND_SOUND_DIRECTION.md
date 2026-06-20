# Art and Sound Direction / 아트와 사운드 방향

## 1. Design Concept

Dark cozy first-person idle mining.

Korean visual concept:
어두운 광산 안에서 손에 든 곡괭이와 랜턴으로 중앙 3x3 채굴면을 자동으로 부수는 작고 선명한 1인칭 방치형 채굴 게임.

## 2. Visual Pillars

- 3x3 Mining Face
- first-person hands
- visible lantern
- visible pickaxe
- visible gloves
- chunky cracks
- clear resource feedback
- readable embedded ores
- compact top HUD
- large passive Mining Core map

## 3. Main Screen Composition

Current MVP composition:

```text
┌────────────────────────────────────────┐
│ depth / cave         timer     resources│
├────────────────────────────────────────┤
│                                        │
│          480 x 480 square 3x3           │
│          Mining Face, full width        │
│                                        │
├────────────────────────────────────────┤
│ lantern + simple left hand              │
│                         pickaxe + simple right hand
│              [AUTO][자원][코어][설정]  │
└────────────────────────────────────────┘
```

The top HUD uses fixed left/center/right positions.
The Mining Face starts directly below the HUD and fills the full reference width.
Quick controls are tiny and centered in the lower empty space.
There is no separate full-width bottom HUD bar.

## 3.1 MVP Background and Hand Lock

This is the current MVP visual lock.

```text
Mining Face = full-width 480 x 480 square under the HUD
left/right margin around Mining Face = none
upper empty space above Mining Face = none, except the HUD
lower empty space below Mining Face = reserved for tools and quick controls
hands = simplified mitten/back-of-hand silhouettes
separate visible fingers = not used in MVP
lantern = visible lower-left tool
pickaxe = visible lower-right tool
impact particles = separate effect layer only; never attached to hand silhouette
```

Rationale:

```text
The game must read as a clear 3x3 mining game first.
Do not spend MVP time on anatomical hand rendering.
The hand is a foreground frame element, not the main selling point.
The Mining Face, cracks, ores, rewards, and core progression are the main selling points.
```

Avoid for MVP:

```text
small centered 3x3 board with too much surrounding cave background
side-view cave room / floor / ceiling perspective
complex individual fingers
finger-like impact particles near the pickaxe
hand and pickaxe moving separately
hands covering the center of the Mining Face
```

## 4. Visual Style

Recommended style:
- 2D illustrated
- dark cave background
- clear block silhouettes
- readable ore colors
- simple satisfying effects
- mobile-readable UI

## 5. Mining Face Art

The 3x3 Mining Face should read as one connected mine wall, not nine flat UI cards.

Each cell shows natural rock material, embedded mineral surfaces when applicable, crack/chip overlays, impact flash, and broken/mined-out state.

Ore must not rely on a repeated centered icon, dot, badge, or simple colored mark as the primary resource marker. Ore should look like it is part of the stone itself. A soft central shadow/highlight or cloudy mineral exposure is allowed when it reads as natural rock texture and is not reused as the same marker on every block.

MVP block visual direction:
- DIRT_BLOCK = soft brown earth with subtle grain and chipped edges
- STONE_BLOCK = basic gray rock with shade variation
- COAL_ORE_BLOCK = dark seams, rough patches, or buried black fragments inside stone
- COPPER_ORE_BLOCK = warm copper-colored seams, flakes, or rough embedded fragments
- IRON_ORE_BLOCK = dull rust/brown mineral fragments exposed through chips or cracks
- GOLD_ORE_BLOCK = small metallic seams or exposed specks blended into broken rock surfaces
- CRYSTAL_ORE_BLOCK = angular crystal shards or fractured glowing surfaces revealed through cracks
- DIAMOND_ORE_BLOCK = sharp bright embedded facets, not centered symbols
- DIAMOND_CORE_BLOCK = stronger embedded core glow with fractured rock surrounding it

Allowed ore shapes:
- irregular mineral seams
- partially buried veins
- chipped exposed mineral surfaces
- rough fragments inside cracks
- small flakes or glints blended into the stone
- broken mineral edges revealed by damage

Avoid:
- the same centered circle/dot used repeatedly as the ore marker
- clean icon-like ore markers
- smooth decorative lines drawn above the wall
- perfectly repeated ore symbols
- flat UI-card block appearance
- ore visuals that look pasted on top of the cell
- every cell sharing the same rock/ore pattern stamp


## 5.1 Ore Readability and Natural Pattern Rule

Removing centered ore icons does not mean hiding ore.

Ore must be naturally embedded in the rock and still readable by resource type.

Rules:

```text
ore is part of the rock surface
ore follows cracks, seams, chips, exposed surfaces, or broken mineral layers
ore shapes are irregular and organic
ore patterns may continue across neighboring cells
resource type is identifiable without reading toast text
ore must not become generic blur/noise
```

Pattern variation rule:

```text
The problem is not a single soft highlight, shadow, or cloudy mineral exposure.
The problem is making every block use the same centered pattern.
Each cell should use varied rock cracks, mineral exposure shapes, vein directions, chipped edges, and lighting.
Ore-bearing cells may share a connected vein direction, but they should not look like cloned stamps.
Plain rock, stone, iron, crystal, and rare blocks should each have distinct material signatures.
Use natural irregular repetition, not identical UI pattern repetition.
```

Avoid:

```text
same centered circle repeated on many cells as the ore marker
small round spot in a corner used as the ore marker
clean dot or badge
smooth decorative line floating above the wall
perfectly circular ore patch repeated as a stamp
flat UI marker
all blocks using the same pattern
```

Resource signatures:

```text
COAL = dark seams / rough black patches
COPPER = warm orange embedded streaks or fragments
IRON = dull red-brown embedded fragments
GOLD = small but clear metallic flakes or broken veins
CRYSTAL = angular shards or subtle glow inside cracks
DIAMOND / rare = sharp embedded facets or fractured surfaces
```

## 5.2 First-Person Equipment Motion Rule

The screen should feel alive while idle.

Rules:

```text
right hand moves with the pickaxe during every strike
hand, grip, handle, and pickaxe head remain visually connected
pickaxe head reaches the target cell at impact
left hand/lantern has subtle idle sway
once every few hits, lantern may lift/tilt to briefly brighten the Mining Face
lantern light may enhance ore glints or cracks
equipment motion must not cover Mining Face cells in resting pose
equipment motion is visual only and does not change reward/generation/targeting logic
```

## 6. Crack Stages

MVP crack stages follow the existing Mining Face damage stages.
Do not add new public stage names unless the damage-stage document is updated.

- stage 0 = no crack / INTACT
- stage 1 = small chips and light crack / CHIPPED
- stage 2 = medium branching crack / CRACKED
- stage 3 = widened fracture and exposed surface / EXPOSED
- stage 4 = heavy fracture, loose fragments, strongest ore exposure / CRUMBLING
- broken = EMPTY, mined-out dark hole

```ts
crackStage = floor((crackProgress / requiredHits) * 4)
```

Clamp to 0~4.

Important visual rule:
- stages 1~4 are cracks, chips, widened fractures, exposed surfaces, and crumbling fragments
- stages 1~4 are not circular holes
- do not show a center hole or lower-left hole before the block reaches EMPTY
- ore-bearing blocks should reveal the metal/crystal more clearly with each stage
- plain rock blocks should remain rock, showing deeper cracks and broken stone surfaces only

## 7. Hit Feedback

Every hit shows pickaxe swing, impact flash, target cell shake, crack update, hit sound, and dust particle.

The crack update should look cumulative.
A later hit should deepen or branch the existing crack pattern rather than replace it with an unrelated new mark.

## 8. Resource Feedback

When a block breaks:
- resource icon pops from block
- resource icon flies to top HUD
- HUD resource number pulses
- small +1 or +2 appears

## 9. Equipment Visual Tiers

Equipment visual tiers are determined by active unique tier nodes.

Tiers:
- Worn
- Stone
- Copper
- Iron
- Gold
- Crystal
- Diamond

## 10. Mining Core Visual Style

Mining Core should feel like a glowing ore constellation or mining nerve map.

Node colors:
- CENTER = yellow
- COMMON = white
- MAGIC = green
- RARE = blue
- UNIQUE = purple
- LOCKED = dark gray

## 11. Sound Event List

Mining:
- PICKAXE_SWING
- BLOCK_HIT_DIRT
- BLOCK_HIT_STONE
- BLOCK_HIT_ORE
- BLOCK_CRACK_STAGE
- BLOCK_BREAK_ROCK
- BLOCK_BREAK_ORE
- BLOCK_BREAK_RARE
- DIAMOND_GAIN
- DIAMOND_CORE_BREAK

Resource:
- RESOURCE_FLY
- RESOURCE_HUD_PULSE
- COMMON_RESOURCE_GAIN
- RARE_RESOURCE_GAIN
- BONUS_RESOURCE_GAIN

Reward:
- REWARD_ENCOUNTER_OPEN
- REWARD_PLATE_REVEAL
- REWARD_SELECT
- PICKAXE_REWARD_APPLY
- LANTERN_REWARD_APPLY
- GLOVES_REWARD_APPLY
- MATERIAL_REWARD_GAIN

Mining Core:
- NODE_HOVER
- NODE_SELECT
- NODE_UNLOCK_COMMON
- NODE_UNLOCK_MAGIC
- NODE_UNLOCK_RARE
- NODE_UNLOCK_UNIQUE
- BRANCH_RESET
- FULL_CORE_RESET
- EQUIPMENT_TIER_CHANGED

Utility:
- AUTO_ON
- AUTO_OFF
- SETTINGS_OPEN
- SETTINGS_CLOSE
- OFFLINE_REWARD_POPUP
- OFFLINE_REWARD_CONFIRM
- LAYER_UNLOCK
- CHAPTER_CLEAR

## 12. Priority

1. Mining Face readability
2. Hands and equipment visibility
3. AUTO mining feedback
4. Resource gain satisfaction
5. Mining Core clarity
6. Sound rhythm without spam


## Hit Feedback Minimum

Every hit should provide immediate feedback:

- pickaxe swing
- impact flash
- cell shake
- crack update
- hit sound event call

Every block break should provide:

- break burst
- dust or fragment effect
- resource pop
- resource fly-to-HUD
- HUD number pulse
- resource gain sound event call

Every Mining Face clear should feel like moving deeper into the mine:

- dust and fragments
- tunnel darkening
- lantern glow forward
- inward push-in transition
- new face appearing from darkness
- depth HUD pulse


## Sound Structure Requirement

Sound is part of the first MVP structure.

Final audio files are optional, but the project must include:

- sound event keys
- sound asset mapping
- sound manager
- settings volume controls
- debug sound test

Every hit, break, reward, node unlock, panel open, offline reward, layer unlock, and chapter clear should call an appropriate sound event.

Missing files should no-op safely.


## Image Replacement Requirement

MVP visuals are generated CSS/SVG by default.

The implementation must still route major visuals through image asset keys.

Required visual mode:

```ts
visualAssetMode = 'GENERATED' | 'IMAGE' | 'AUTO'
```

This allows the project to test final art later by adding image files and switching mode.

Generated visuals must remain as fallback even after images are added.


## Game-Ready Image Direction

Image assets should look like game assets.

Direction:

- stylized game art
- dark cozy mine
- readable chunky shapes
- clear silhouette
- soft lantern glow
- mineral veins and crystal chunks
- first-person equipment silhouettes

Avoid:

- photorealistic rock photos
- flat generic icons
- regular square pixel ore patterns
- voxel cube imitation
- tiny unreadable details

Image prompt details are in:

```text
docs/17_IMAGE_GENERATION_PROMPTS.md
```


## Mining Face Wall Continuity

The Mining Face is a 3x3 block wall.

Each cell is an individual square rock block for gameplay clarity.

The whole face should still read as one continuous mine wall.

Use shared SVG overlays for:

- wall seams
- global lantern lighting
- large cracks crossing multiple cells
- vein continuation
- face-wide dust and shadow

Avoid:

- each cell looking like a separate UI card
- regular pixel-dot ore patterns
- voxel cube imitation

Damage stages are defined in:

```text
docs/18_MINING_FACE_DAMAGE_VISUAL_STAGES.md
```

## CSS/SVG Generated Art Decision

MVP uses generated CSS/SVG art as the primary visual implementation.

Reason:

- low cost
- easy iteration
- no asset dependency for early implementation
- can express 3x3 wall, cracks, overlays, lighting, and mining feedback
- image replacement can happen later through VisualAsset mode

PNG/image assets remain optional replacement assets.

The implementation should not wait for final image files.

## First-person Equipment Shape Requirements

CSS/SVG placeholder art must be recognizable as equipment, not random primitives.

Left side:

```text
wrist / glove silhouette
lantern handle
lantern metal frame
lantern glass/body
lantern glow cone or soft glow
```

Right side:

```text
wrist / glove silhouette
pickaxe handle
pickaxe grip
metal pickaxe head
clear impact end point
```

Hands/gloves:

```text
hand back shape
finger mass suggestion
glove seam / outline
warm leather or muted mining color
```

Rules:

```text
resting equipment must sit low enough to avoid covering the 3x3 Mining Face
lantern body must not cover tappable cells
pickaxe rests low, then moves into target cell only during strike
impact flash belongs on the target cell
```

## Resource Icon Direction

Resource icons are separate from Mining Face ore overlays, but they must share the same material identity.

Problem to avoid:
- stone / iron / crystal icons looking like generic UI badges
- iron icon not reading as metal or ore
- crystal icon not reading as angular mineral
- stone icon looking like a flat gray circle

Rules:

```text
resource icons are small stylized material chunks
not emoji-like
not flat circles
not generic white marks
not smooth UI badges
clear silhouette at small HUD size
same material family as the embedded ore visuals
```

Icon direction:

```text
stone = rough gray rock shard, chipped irregular edges, matte surface
coal = dark black chunk, rough layered edges, low shine
copper = warm orange-brown ore fragment, dull metallic flecks
iron = dull red-brown metal ore chunk, rusty metallic facets, heavier silhouette
gold = small yellow metallic nugget/flakes, clear shine but not neon
crystal = angular blue/purple translucent shard, sharp facets, subtle glow
diamond = pale hard faceted shard, crisp highlights
```

HUD/resource-panel icons should be readable at tiny sizes, but they should still look like mined materials, not abstract UI symbols.

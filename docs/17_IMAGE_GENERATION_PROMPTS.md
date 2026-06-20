# Image Generation Prompts / 이미지 생성 프롬프트

## 1. Purpose

This document defines image generation prompt guidelines for Endless Mine.

The goal is to create game-ready assets that match the project direction.

The assets should look like a game, not like photos, generic icons, or raw concept art.

## 2. Core Art Direction

Style keywords:

```text
stylized game asset
dark cozy mine
first-person mining
chunky readable shapes
hand-painted game texture
soft lantern glow
clear silhouettes
high readability at small size
slightly exaggerated fantasy mining tools
not realistic photo
not flat generic icon
```

Korean direction:

```text
어둡지만 답답하지 않은 광산
랜턴 빛에 광물맥이 반짝이는 느낌
한눈에 읽히는 게임 에셋
실사 사진이 아니라 스타일라이즈된 게임 그래픽
작은 화면에서도 구분되는 실루엣
```

## 3. Avoided Visual Direction

Do not use these directions:

```text
regular square pixel ore pattern
gray cube with evenly spaced colored dots
voxel cube imitation
photorealistic rock photo
generic flat app icon
overly noisy texture
too many tiny details
UI-unreadable dark assets
```

Korean:

```text
정사각 픽셀 광물 패턴 금지
회색 돌에 색 점을 규칙적으로 박은 디자인 금지
복셀 큐브를 그대로 떠올리게 하는 디자인 금지
실사 암석 사진 느낌 금지
너무 일반적인 플랫 아이콘 금지
작은 화면에서 안 보이는 과한 디테일 금지
```

## 4. Global Prompt Template

Use this template for most image assets.

```text
Create a stylized game asset for a dark cozy first-person idle mining game.

Asset: {ASSET_NAME}
Purpose: {USAGE}
View: {VIEW}
Background: {BACKGROUND_RULE}
Style: hand-painted stylized game art, chunky readable shapes, clear silhouette, soft mine lighting, subtle fantasy detail, high readability at small mobile game size.
Mood: dark mine atmosphere with warm lantern highlights and crisp material contrast.
Do not make it photorealistic. Do not make it a flat generic icon. Do not use regular square pixel ore patterns or voxel cube imitation.
```

## 5. Block Prompt Template

Use this for block base images.

```text
Create a stylized square game tile for a first-person mining wall.

Asset: {BLOCK_NAME}
Material: {MATERIAL_DESCRIPTION}
Design: angular rock plates, carved surface, subtle cracks, chunky readable shapes, hand-painted game texture.
Lighting: dark mine ambient light with a soft lantern highlight from the lower left.
Canvas: square image, transparent background or clean tile background depending on implementation.
Readability: must be readable when displayed around 90 to 110 pixels wide.
Avoid: photorealistic rock photo, regular pixel art ore block, evenly spaced colored dots, voxel cube look.
```

## 6. Ore Overlay Prompt Template

Use this for ore overlays.

```text
Create a transparent overlay game asset for ore embedded in a mining wall tile.

Ore: {ORE_NAME}
Color: {ORE_COLOR}
Shape language: {ORE_SHAPE_LANGUAGE}
Design: irregular mineral veins, embedded chunks, small crystals, natural cracks, not regular dots.
Style: stylized hand-painted game asset, chunky readable silhouette, high contrast against dark rock.
Canvas: square transparent PNG overlay, designed to sit on top of a rock block.
Readability: must be visible at 90 to 110 pixels wide.
Avoid: evenly spaced pixel dots, voxel cube style, realistic photo texture, cluttered tiny noise.
```

## 7. Equipment Prompt Template

Use this for pickaxe, lantern, and gloves.

```text
Create a stylized first-person game equipment asset.

Asset: {EQUIPMENT_NAME}
Tier: {TIER}
View: first-person lower screen view, readable silhouette, angled slightly toward the center of the screen.
Style: hand-painted stylized game art, chunky shapes, fantasy mining tool, clear material identity, not realistic photo.
Background: transparent.
Lighting: warm lantern rim light and dark mine shading.
Readability: must read clearly in a 480x720 portrait game viewport.
Avoid: flat generic icon, realistic product render, overly thin details, cluttered design.
```

## 8. Background Prompt Template

Use this for cave backgrounds.

```text
Create a stylized vertical game background for a dark cozy first-person mining game.

Scene: {LAYER_NAME}
Design: mine tunnel wall, layered rock depth, soft darkness, subtle lantern glow, enough empty visual space for UI and 3x3 Mining Face.
Style: stylized game background, painterly but clean, not photorealistic, not noisy.
Composition: portrait 2:3 aspect ratio, center area supports a 3x3 mining wall, edges darker for depth.
Mood: mysterious, cozy, readable.
Avoid: realistic cave photo, horror, excessive detail, hard-to-read center area.
```

## 9. UI / Icon Prompt Template

Use this for resource icons and UI icons.

```text
Create a small stylized game UI icon.

Icon: {ICON_NAME}
Shape: clear silhouette, readable at 24 to 36 pixels.
Style: stylized game UI, slight bevel, soft shadow, crisp edges, high contrast.
Background: transparent.
Avoid: photorealism, generic emoji look, overly detailed illustration, unreadable tiny details.
```

## 10. Mining Core Prompt Template

Use this for Mining Core nodes and background.

```text
Create a stylized magical mining upgrade node asset.

Asset: {NODE_TYPE}
Design: glowing core node, readable rarity shape, subtle fantasy mining energy, clean circular/sigil-like silhouette.
Style: stylized game UI asset, high readability, soft glow, not too noisy.
Background: transparent.
Avoid: complex mandala, unreadable details, realistic gemstone photo.
```

## 11. Effect Prompt Template

Use this for hit, dust, resource fly, and chapter effects.

```text
Create a stylized game VFX sprite.

Effect: {EFFECT_NAME}
Design: {EFFECT_DESCRIPTION}
Style: crisp stylized game effect, transparent background, readable shape, short burst feeling, suitable for CSS or sprite animation.
Avoid: realistic particle photo, too many tiny particles, full-screen clutter.
```

## 12. Block and Ore Specific Prompts

### DIRT_BLOCK

```text
Create a stylized square game tile for a first-person mining wall.

Asset: Dirt block
Material: compact brown soil with small embedded pebbles and soft crumbly edges.
Design: angular but softer than stone, low-tier early mine material, chunky readable forms.
Lighting: dark mine ambient light with a warm lantern highlight.
Canvas: square game asset.
Avoid: realistic soil photo, voxel cube, regular pixel pattern.
```

### STONE_BLOCK

```text
Create a stylized square game tile for a first-person mining wall.

Asset: Stone block
Material: gray rock plates with subtle layered cracks.
Design: angular stone slabs, clean readable surface, not too noisy.
Lighting: soft lantern highlight and dark cave shading.
Canvas: square game asset.
Avoid: realistic rock photo, voxel cube, regular pixel ore pattern.
```

### COAL_ORE_BLOCK

```text
Create a stylized ore overlay for coal embedded in a mining wall tile.

Ore: Coal
Color: deep black with subtle blue-gray highlights.
Shape language: rounded dark chunks lodged in cracks.
Design: irregular embedded coal lumps, not regular dots.
Canvas: transparent square overlay.
Avoid: evenly spaced pixel dots, voxel cube style, realistic photo.
```

### COPPER_ORE_BLOCK

```text
Create a stylized ore overlay for copper embedded in a mining wall tile.

Ore: Copper
Color: warm orange copper with small turquoise oxidation accents.
Shape language: thin branching metal veins and small angular chunks.
Design: irregular copper veins following rock cracks.
Canvas: transparent square overlay.
Avoid: regular dots, voxel cube style, realistic photo.
```

### IRON_ORE_BLOCK

```text
Create a stylized ore overlay for iron embedded in a mining wall tile.

Ore: Iron
Color: dark red-brown and muted steel highlights.
Shape language: heavy rusty veins and dense metal patches.
Design: irregular iron seams in rock cracks, strong but not shiny.
Canvas: transparent square overlay.
Avoid: regular dots, voxel cube style, realistic photo.
```

### GOLD_ORE_BLOCK

```text
Create a stylized ore overlay for gold embedded in a mining wall tile.

Ore: Gold
Color: warm gold with bright yellow highlights.
Shape language: thin shining veins and small nuggets.
Design: irregular gold lines spreading through dark rock cracks.
Canvas: transparent square overlay.
Avoid: regular dots, plastic shine, voxel cube style, realistic photo.
```

### CRYSTAL_ORE_BLOCK

```text
Create a stylized ore overlay for crystal embedded in a mining wall tile.

Ore: Crystal
Color: cyan and violet crystal glow.
Shape language: small sharp crystals protruding from cracks.
Design: angular crystal shards, slight magical glow, readable silhouette.
Canvas: transparent square overlay.
Avoid: regular dots, realistic crystal photo, cluttered tiny shards.
```

### DIAMOND_ORE_BLOCK

```text
Create a stylized ore overlay for diamond embedded in a mining wall tile.

Ore: Diamond
Color: cold blue and pale cyan.
Shape language: faceted diamond shards set deep in cracks.
Design: rare bright crystal pieces with subtle glow, clean silhouette.
Canvas: transparent square overlay.
Avoid: regular dots, voxel cube style, realistic gemstone photo.
```

### DIAMOND_CORE_BLOCK

```text
Create a stylized square game tile for a special diamond core block in a first-person mining wall.

Asset: Diamond Core block
Material: dark cracked stone surrounding a large glowing blue diamond core.
Design: central core shape, cracks radiating outward, strong rare boss-like presence, high readability.
Lighting: cold blue inner glow plus warm lantern edge light.
Canvas: square game asset.
Avoid: realistic gemstone photo, cluttered details, regular ore-dot pattern.
```

## 13. Equipment Specific Prompts

### Worn Pickaxe

```text
Create a stylized first-person game equipment asset.

Asset: Worn pickaxe
Tier: Worn
View: right hand lower screen, angled toward center.
Design: old wooden handle, chipped iron head, simple readable silhouette.
Style: stylized game art, dark mine shading, warm lantern rim light.
Background: transparent.
Avoid: realistic product render, flat icon, tiny unreadable details.
```

### Stone Pickaxe

```text
Create a stylized first-person game equipment asset.

Asset: Stone pickaxe
Tier: Stone
View: right hand lower screen, angled toward center.
Design: heavy stone head bound to a wooden handle with rope, chunky primitive silhouette.
Background: transparent.
Style: stylized game art, readable at mobile size.
```

### Copper Pickaxe

```text
Create a stylized first-person game equipment asset.

Asset: Copper pickaxe
Tier: Copper
View: right hand lower screen, angled toward center.
Design: copper reinforced head, warm orange metal, copper rings on handle, clear upgrade feeling.
Background: transparent.
Style: stylized game art with mine lighting.
```

### Iron Pickaxe

```text
Create a stylized first-person game equipment asset.

Asset: Iron pickaxe
Tier: Iron
View: right hand lower screen, angled toward center.
Design: sharp iron head, sturdy mining tool, dark steel surface, strong practical silhouette.
Background: transparent.
Style: stylized game art, not realistic.
```

### Gold Pickaxe

```text
Create a stylized first-person game equipment asset.

Asset: Gold pickaxe
Tier: Gold
View: right hand lower screen, angled toward center.
Design: gold-trimmed mining pickaxe, shiny but not toy-like, ornate handle details.
Background: transparent.
Style: stylized game art, readable silhouette.
```

### Crystal Pickaxe

```text
Create a stylized first-person game equipment asset.

Asset: Crystal pickaxe
Tier: Crystal
View: right hand lower screen, angled toward center.
Design: crystal shards forming the pick head, cyan-violet glow, magical mining upgrade.
Background: transparent.
Style: stylized game art.
```

### Diamond Pickaxe

```text
Create a stylized first-person game equipment asset.

Asset: Diamond pickaxe
Tier: Diamond
View: right hand lower screen, angled toward center.
Design: faceted blue diamond blade, dark reinforced handle, premium endgame look, crisp glow.
Background: transparent.
Style: stylized game art, strong silhouette.
```

### Lantern Tiers

Use this prompt and replace `{TIER}` and `{MATERIAL_DETAIL}`.

```text
Create a stylized first-person game equipment asset.

Asset: {TIER} lantern
View: left hand lower screen, hanging slightly toward the center.
Design: compact mining lantern with {MATERIAL_DETAIL}, visible glass chamber, warm or magical glow.
Lighting: lantern emits soft light, edges readable against dark mine.
Background: transparent.
Style: stylized game art, not realistic product render, not flat icon.
```

Tier material details:

```text
Worn: old iron frame, weak yellow light
Stone: stone frame, small protected flame
Copper: copper frame, warm orange glow
Iron: sturdy iron frame, brighter mining lamp
Gold: gold reflector, wide warm light
Crystal: crystal lens, cyan-violet glow
Diamond: faceted blue lens, cold rare glow
```

### Gloves Tiers

Use this prompt and replace `{TIER}` and `{MATERIAL_DETAIL}`.

```text
Create stylized first-person game glove assets.

Asset: {TIER} gloves
View: both hands near lower screen, readable hand silhouettes.
Design: mining work gloves with {MATERIAL_DETAIL}, clear upgrade tier, strong wrist and knuckle shapes.
Background: transparent.
Style: stylized game art, readable at 480x720, not realistic product photo, not flat icon.
```

Tier material details:

```text
Worn: old cloth gloves, patched fabric
Stone: stone plates on knuckles
Copper: copper rivets and wrist bands
Iron: iron knuckle guards and reinforced fingers
Gold: gold trim and polished joints
Crystal: crystal shards on back of hand
Diamond: blue diamond knuckle plates and crisp glow
```

## 14. Background Specific Prompts

### Dirt Layer Background

```text
Create a stylized vertical game background for a dark cozy first-person mining game.

Scene: Dirt Layer mine tunnel
Design: brown soil walls, roots, small stones, warm lantern darkness, center area kept readable for a 3x3 mining wall.
Aspect ratio: portrait 2:3.
Style: stylized game background, painterly but clean.
Avoid: realistic cave photo, horror, excessive detail.
```

### Stone Layer Background

```text
Create a stylized vertical game background for a dark cozy first-person mining game.

Scene: Stone Layer mine tunnel
Design: gray stone walls, angular rock layers, soft lantern glow, dark edges, readable center.
Aspect ratio: portrait 2:3.
Style: stylized game background.
```

### Coal Vein Background

```text
Create a stylized vertical game background for a dark cozy first-person mining game.

Scene: Coal Vein mine tunnel
Design: dark gray rock, black coal seams, warm lantern glow, subtle dust in air, readable center.
Aspect ratio: portrait 2:3.
Style: stylized game background.
```

### Iron Depth Background

```text
Create a stylized vertical game background for a dark cozy first-person mining game.

Scene: Iron Depth mine tunnel
Design: deep stone walls with red-brown iron seams, heavier atmosphere, warm lantern highlight, readable center.
Aspect ratio: portrait 2:3.
Style: stylized game background.
```

### Crystal Cave Background

```text
Create a stylized vertical game background for a dark cozy first-person mining game.

Scene: Crystal Cave
Design: dark cave walls with cyan and violet crystal glows, magical but readable, center kept clear for Mining Face.
Aspect ratio: portrait 2:3.
Style: stylized game background, not too noisy.
```

### Diamond Depth Background

```text
Create a stylized vertical game background for a dark cozy first-person mining game.

Scene: Diamond Depth
Design: deep dark rock with cold blue diamond glints, rare endgame atmosphere, subtle glow, readable center.
Aspect ratio: portrait 2:3.
Style: stylized game background.
```

## 15. Game-Ready Checklist

Generated images should satisfy:

- looks like a game asset
- readable in 480x720 portrait viewport
- clear silhouette
- not too realistic
- not too generic
- not too noisy
- works with dark mine background
- has enough contrast
- has transparent background when used as overlay/equipment/icon/effect
- does not rely on tiny details
- can be replaced through image asset map without changing game logic


## Damage Stage Prompt Template

Use this for future damage overlay image assets if generated images are needed.

```text
Create a stylized transparent game VFX overlay for a square mining wall block.

Damage stage: {DAMAGE_STAGE}
Design: {STAGE_DESCRIPTION}
Style: stylized game asset, chunky readable cracks, clear broken rock silhouette, suitable for a 3x3 first-person mining wall.
Canvas: square transparent PNG overlay.
Readability: must be readable when displayed around 90 to 110 pixels wide.
Avoid: realistic photo cracks, excessive tiny noise, flat UI icon look, voxel cube imitation.
```

Stage descriptions:

```text
CHIPPED
small chips, hairline cracks, tiny dust marks

CRACKED
visible branching cracks, small rock fragments missing

EXPOSED
inner rock exposed, ore or deeper layer partially visible, larger cracks

CRUMBLING
large missing chunks, unstable edges, heavy cracks, almost broken

EMPTY
dark mined-out hole with subtle rim light and tunnel depth
```

## Continuous Wall Prompt

Use this if generating a full 3x3 Mining Face background or overlay.

```text
Create a stylized 3x3 block wall overlay for a first-person mining game.

Design: nine square rock blocks forming one continuous mine wall, subtle seams, shared cracks crossing cell borders, soft lantern lighting, natural wall continuity.
Style: stylized game art, readable, chunky, not photorealistic.
Avoid: each cell looking like a separate UI card, regular pixel-dot ore patterns, voxel cube imitation.
```

## MVP Main Screen Visual Prompt Lock

Use this direction when generating or asking for main-screen visual references.

```text
portrait mobile idle mining game screen, 480x720 reference,
thin top HUD, directly below HUD a full-width 480x480 square 3x3 mining face,
large readable rock tiles, embedded natural ore seams, subtle grid boundaries,
lower empty space for tools and small quick buttons,
lower-left lantern, lower-right pickaxe,
optional simplified mitten-like back-of-hand shapes, no detailed fingers,
no room/floor/ceiling perspective, no small centered mining board,
no impact particles that resemble fingers,
dark cozy mine, readable game UI, 2D illustrated pixel-friendly style
```

Negative prompt / avoid:

```text
wide concept art sheet, mockup collage, Minecraft copy, complex realistic hands,
individual fingers gripping handle, cave room perspective, floor plane, ceiling plane,
small 3x3 board floating in a large background, full bottom HUD bar,
hand/pickaxe/particle shapes merged into one unreadable silhouette
```

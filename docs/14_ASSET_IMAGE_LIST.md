# Image Asset List / 이미지 에셋 목록

## 1. Purpose

This document defines image asset keys, file path structure, generated fallback rules, runtime switching, and Debug Panel image testing for Endless Mine.

MVP uses generated CSS/SVG visuals first.

However, the implementation must include the image asset structure from the start so that dropping image files into the mapped paths and toggling image mode is enough to test image replacement.

## 2. Image Strategy

MVP image strategy:

```text
asset keys first
generated fallback by default
image replacement later
runtime toggle between generated and image mode
safe fallback when files are missing
```

Every important visual object should render through a shared `VisualAsset` layer.

The component should not directly hardcode final image paths.

## 3. Rendering Modes

Required render mode:

```ts
type VisualAssetMode =
  | 'GENERATED'
  | 'IMAGE'
  | 'AUTO';
```

Meaning:

```text
GENERATED
= always use CSS/SVG generated fallback

IMAGE
= try to use mapped imagePath
= if image is missing or fails to load, fall back to generated fallback

AUTO
= use image if available
= otherwise use generated fallback
```

MVP default:

```ts
visualAssetMode = 'GENERATED'
```

Debug testing default:

```ts
visualAssetMode = 'AUTO'
```

## 4. Required Files

Recommended implementation files:

```text
src/data/imageAssets.ts
src/assets/images/
src/components/common/VisualAsset.tsx
src/components/common/VisualAssetLayer.tsx
src/styles/generated-art.css
src/styles/visual-assets.css
```

Recommended hooks/utilities:

```text
src/assets/assetMode.ts
src/assets/assetLoader.ts
src/assets/assetRegistry.ts
```

## 5. Directory Structure

Recommended image structure:

```text
src/assets/images/
  backgrounds/
  blocks/
  ores/
  cracks/
  hands/
  equipment/
  icons/
  ui/
  rewards/
  mining-core/
  effects/
  panels/
```

## 6. Runtime Types

Recommended type:

```ts
type ImageAssetKey =
  | 'background.cave.default'
  | 'background.cave.dirt'
  | 'background.cave.stone'
  | 'background.cave.coal'
  | 'background.cave.iron'
  | 'background.cave.crystal'
  | 'background.cave.diamond'
  | 'block.dirt'
  | 'block.stone'
  | 'block.diamond_core'
  | 'ore.coal'
  | 'ore.copper'
  | 'ore.iron'
  | 'ore.gold'
  | 'ore.crystal'
  | 'ore.diamond'
  | 'crack.stage_1'
  | 'crack.stage_2'
  | 'crack.stage_3'
  | 'crack.stage_4'
  | 'hand.left.base'
  | 'hand.right.base'
  | 'hand.left.swing'
  | 'hand.right.swing'
  | 'equipment.pickaxe.worn'
  | 'equipment.pickaxe.stone'
  | 'equipment.pickaxe.copper'
  | 'equipment.pickaxe.iron'
  | 'equipment.pickaxe.gold'
  | 'equipment.pickaxe.crystal'
  | 'equipment.pickaxe.diamond'
  | 'equipment.lantern.worn'
  | 'equipment.lantern.stone'
  | 'equipment.lantern.copper'
  | 'equipment.lantern.iron'
  | 'equipment.lantern.gold'
  | 'equipment.lantern.crystal'
  | 'equipment.lantern.diamond'
  | 'equipment.gloves.worn'
  | 'equipment.gloves.stone'
  | 'equipment.gloves.copper'
  | 'equipment.gloves.iron'
  | 'equipment.gloves.gold'
  | 'equipment.gloves.crystal'
  | 'equipment.gloves.diamond'
  | 'icon.resource.stone'
  | 'icon.resource.coal'
  | 'icon.resource.copper'
  | 'icon.resource.iron'
  | 'icon.resource.gold'
  | 'icon.resource.crystal'
  | 'icon.resource.diamond'
  | 'icon.ui.auto_on'
  | 'icon.ui.auto_off'
  | 'icon.ui.settings'
  | 'icon.ui.close'
  | 'icon.ui.back'
  | 'reward.card.pickaxe'
  | 'reward.card.lantern'
  | 'reward.card.gloves'
  | 'reward.card.material'
  | 'reward.plate.left'
  | 'reward.plate.right'
  | 'mining_core.node.common'
  | 'mining_core.node.magic'
  | 'mining_core.node.rare'
  | 'mining_core.node.unique'
  | 'mining_core.node.center'
  | 'mining_core.line.active'
  | 'mining_core.line.locked'
  | 'mining_core.background'
  | 'effect.hit.impact'
  | 'effect.hit.dust'
  | 'effect.block.break'
  | 'effect.resource.fly'
  | 'effect.lantern.glow'
  | 'effect.reward.select'
  | 'effect.chapter.clear'
  | 'ui.panel.default'
  | 'ui.panel.reward'
  | 'ui.panel.offline'
  | 'ui.panel.settings'
  | 'ui.panel.resource'
  | 'ui.panel.debug';
```

Recommended asset shape:

```ts
type ImageAssetRef = {
  key: ImageAssetKey;
  category: ImageAssetCategory;
  generatedFallbackClass: string;
  imagePath?: string;
  width?: number;
  height?: number;
  alt: string;
  usage: string[];
};

type ImageAssetCategory =
  | 'BACKGROUND'
  | 'BLOCK'
  | 'ORE'
  | 'CRACK'
  | 'HAND'
  | 'EQUIPMENT'
  | 'ICON'
  | 'UI'
  | 'REWARD'
  | 'MINING_CORE'
  | 'EFFECT'
  | 'PANEL';
```

## 7. VisualAsset Component Requirement

All major visuals must use a shared component or shared rendering utility.

Recommended component:

```tsx
type VisualAssetProps = {
  assetKey: ImageAssetKey;
  mode?: VisualAssetMode;
  className?: string;
  children?: React.ReactNode;
};

function VisualAsset(props: VisualAssetProps) {
  // 1. read asset ref from imageAssets
  // 2. read visualAssetMode from settings/debug
  // 3. if GENERATED, render generated fallback
  // 4. if IMAGE or AUTO, try imagePath
  // 5. if image missing or onError, render generated fallback
}
```

Generated fallback should remain usable even after image replacement exists.

## 8. Settings Integration

Settings Panel includes a visual asset mode option.

Recommended UI label:

```text
그래픽 표시 방식
```

Options:

```text
Generated
Image
Auto
```

Save field:

```ts
type SettingsSaveData = {
  masterVolume: number;
  sfxVolume: number;
  muted: boolean;
  reducedMotion: boolean;
  resourceFlyText: boolean;
  visualAssetMode: VisualAssetMode;
  debugPanelEnabled: boolean;
  autoMiningEnabled: boolean;
};
```

Default:

```ts
visualAssetMode = 'GENERATED'
```

## 9. Debug Panel Image Test

Debug Panel must include an Image Asset Test section.

Show:

- current visualAssetMode
- all ImageAssetKey values
- category
- mapped imagePath
- generatedFallbackClass
- loaded/missing/error status
- preview using current mode
- preview forced generated
- preview forced image

Controls:

- set mode GENERATED
- set mode IMAGE
- set mode AUTO
- reload image asset registry
- preview selected asset
- toggle missing image fallback test
- copy asset key
- copy image path

Validation:

- missing files do not crash
- IMAGE mode falls back to generated fallback if image load fails
- AUTO mode uses image when available and generated fallback when missing
- GENERATED mode ignores image files
- changing mode updates the visible UI without reworking components

## 10. Background Images

### background.cave.default

Path:

```text
src/assets/images/backgrounds/cave_default.png
```

Fallback:

```text
generated-bg-cave-default
```

Usage:

- Main Mining Screen background

### background.cave.dirt

Path:

```text
src/assets/images/backgrounds/cave_dirt.png
```

Fallback:

```text
generated-bg-cave-dirt
```

Usage:

- Dirt Layer background tint

### background.cave.stone

Path:

```text
src/assets/images/backgrounds/cave_stone.png
```

Fallback:

```text
generated-bg-cave-stone
```

### background.cave.coal

Path:

```text
src/assets/images/backgrounds/cave_coal.png
```

Fallback:

```text
generated-bg-cave-coal
```

### background.cave.iron

Path:

```text
src/assets/images/backgrounds/cave_iron.png
```

Fallback:

```text
generated-bg-cave-iron
```

### background.cave.crystal

Path:

```text
src/assets/images/backgrounds/cave_crystal.png
```

Fallback:

```text
generated-bg-cave-crystal
```

### background.cave.diamond

Path:

```text
src/assets/images/backgrounds/cave_diamond.png
```

Fallback:

```text
generated-bg-cave-diamond
```

## 11. Block Base Images

### block.dirt

Path:

```text
src/assets/images/blocks/dirt_block.png
```

Fallback:

```text
generated-block-dirt
```

### block.stone

Path:

```text
src/assets/images/blocks/stone_block.png
```

Fallback:

```text
generated-block-stone
```

### block.diamond_core

Path:

```text
src/assets/images/blocks/diamond_core_block.png
```

Fallback:

```text
generated-block-diamond-core
```

## 12. Ore Overlay Images

Ore blocks should be composable:

```text
block base + ore overlay + crack overlay
```

### ore.coal

Path:

```text
src/assets/images/ores/coal_ore_overlay.png
```

Fallback:

```text
generated-ore-coal
```

### ore.copper

Path:

```text
src/assets/images/ores/copper_ore_overlay.png
```

Fallback:

```text
generated-ore-copper
```

### ore.iron

Path:

```text
src/assets/images/ores/iron_ore_overlay.png
```

Fallback:

```text
generated-ore-iron
```

### ore.gold

Path:

```text
src/assets/images/ores/gold_ore_overlay.png
```

Fallback:

```text
generated-ore-gold
```

### ore.crystal

Path:

```text
src/assets/images/ores/crystal_ore_overlay.png
```

Fallback:

```text
generated-ore-crystal
```

### ore.diamond

Path:

```text
src/assets/images/ores/diamond_ore_overlay.png
```

Fallback:

```text
generated-ore-diamond
```

## 13. Crack Overlay Images

### crack.stage_1

Path:

```text
src/assets/images/cracks/crack_stage_1.png
```

Fallback:

```text
generated-crack-stage-1
```

### crack.stage_2

Path:

```text
src/assets/images/cracks/crack_stage_2.png
```

Fallback:

```text
generated-crack-stage-2
```

### crack.stage_3

Path:

```text
src/assets/images/cracks/crack_stage_3.png
```

Fallback:

```text
generated-crack-stage-3
```

### crack.stage_4

Path:

```text
src/assets/images/cracks/crack_stage_4.png
```

Fallback:

```text
generated-crack-stage-4
```

## 14. Hand Images

- hand.left.base → src/assets/images/hands/left_hand_base.png → generated-hand-left-base
- hand.right.base → src/assets/images/hands/right_hand_base.png → generated-hand-right-base
- hand.left.swing → src/assets/images/hands/left_hand_swing.png → generated-hand-left-swing
- hand.right.swing → src/assets/images/hands/right_hand_swing.png → generated-hand-right-swing

## 15. Pickaxe Images

- equipment.pickaxe.worn → src/assets/images/equipment/pickaxe_worn.png → generated-pickaxe-worn
- equipment.pickaxe.stone → src/assets/images/equipment/pickaxe_stone.png → generated-pickaxe-stone
- equipment.pickaxe.copper → src/assets/images/equipment/pickaxe_copper.png → generated-pickaxe-copper
- equipment.pickaxe.iron → src/assets/images/equipment/pickaxe_iron.png → generated-pickaxe-iron
- equipment.pickaxe.gold → src/assets/images/equipment/pickaxe_gold.png → generated-pickaxe-gold
- equipment.pickaxe.crystal → src/assets/images/equipment/pickaxe_crystal.png → generated-pickaxe-crystal
- equipment.pickaxe.diamond → src/assets/images/equipment/pickaxe_diamond.png → generated-pickaxe-diamond

## 16. Lantern Images

- equipment.lantern.worn → src/assets/images/equipment/lantern_worn.png → generated-lantern-worn
- equipment.lantern.stone → src/assets/images/equipment/lantern_stone.png → generated-lantern-stone
- equipment.lantern.copper → src/assets/images/equipment/lantern_copper.png → generated-lantern-copper
- equipment.lantern.iron → src/assets/images/equipment/lantern_iron.png → generated-lantern-iron
- equipment.lantern.gold → src/assets/images/equipment/lantern_gold.png → generated-lantern-gold
- equipment.lantern.crystal → src/assets/images/equipment/lantern_crystal.png → generated-lantern-crystal
- equipment.lantern.diamond → src/assets/images/equipment/lantern_diamond.png → generated-lantern-diamond

## 17. Gloves Images

- equipment.gloves.worn → src/assets/images/equipment/gloves_worn.png → generated-gloves-worn
- equipment.gloves.stone → src/assets/images/equipment/gloves_stone.png → generated-gloves-stone
- equipment.gloves.copper → src/assets/images/equipment/gloves_copper.png → generated-gloves-copper
- equipment.gloves.iron → src/assets/images/equipment/gloves_iron.png → generated-gloves-iron
- equipment.gloves.gold → src/assets/images/equipment/gloves_gold.png → generated-gloves-gold
- equipment.gloves.crystal → src/assets/images/equipment/gloves_crystal.png → generated-gloves-crystal
- equipment.gloves.diamond → src/assets/images/equipment/gloves_diamond.png → generated-gloves-diamond

## 18. Resource Icon Images

- icon.resource.stone → src/assets/images/icons/resource_stone.png → generated-icon-resource-stone
- icon.resource.coal → src/assets/images/icons/resource_coal.png → generated-icon-resource-coal
- icon.resource.copper → src/assets/images/icons/resource_copper.png → generated-icon-resource-copper
- icon.resource.iron → src/assets/images/icons/resource_iron.png → generated-icon-resource-iron
- icon.resource.gold → src/assets/images/icons/resource_gold.png → generated-icon-resource-gold
- icon.resource.crystal → src/assets/images/icons/resource_crystal.png → generated-icon-resource-crystal
- icon.resource.diamond → src/assets/images/icons/resource_diamond.png → generated-icon-resource-diamond

## 19. Resource Icon Images

Resource icons are used in the top HUD, Resource Panel, reward material cards, and resource gain feedback.
They are not Mining Face ore overlays.

Asset keys:

```text
icon.resource.stone
icon.resource.coal
icon.resource.copper
icon.resource.iron
icon.resource.gold
icon.resource.crystal
icon.resource.diamond
```

Visual direction:

```text
stone = rough gray rock shard, irregular chipped edges, not a flat circle
coal = dark layered coal chunk, matte black, rough facets
copper = warm orange-brown ore piece with dull metallic flecks
iron = rusty red-brown metal ore chunk, heavier and more metallic than stone
gold = small bright yellow nugget/flakes, metallic but not neon
crystal = angular translucent shard, faceted, blue/purple glint
diamond = pale faceted shard with crisp hard highlights
```

Avoid:

```text
flat generic icons
smooth circles
white corner dots
emoji-like symbols
resource icons that do not resemble mined material
iron that looks like plain stone
crystal that looks like a random blue dot
```

## 20. UI Icon Images

- icon.ui.auto_on → src/assets/images/icons/ui_auto_on.png → generated-icon-ui-auto-on
- icon.ui.auto_off → src/assets/images/icons/ui_auto_off.png → generated-icon-ui-auto-off
- icon.ui.settings → src/assets/images/icons/ui_settings.png → generated-icon-ui-settings
- icon.ui.close → src/assets/images/icons/ui_close.png → generated-icon-ui-close
- icon.ui.back → src/assets/images/icons/ui_back.png → generated-icon-ui-back

## 21. Reward Card Images

- reward.card.pickaxe → src/assets/images/rewards/reward_card_pickaxe.png → generated-reward-card-pickaxe
- reward.card.lantern → src/assets/images/rewards/reward_card_lantern.png → generated-reward-card-lantern
- reward.card.gloves → src/assets/images/rewards/reward_card_gloves.png → generated-reward-card-gloves
- reward.card.material → src/assets/images/rewards/reward_card_material.png → generated-reward-card-material
- reward.plate.left → src/assets/images/rewards/reward_plate_left.png → generated-reward-plate-left
- reward.plate.right → src/assets/images/rewards/reward_plate_right.png → generated-reward-plate-right

## 22. Mining Core Images

- mining_core.node.common → src/assets/images/mining-core/node_common.png → generated-mining-core-node-common
- mining_core.node.magic → src/assets/images/mining-core/node_magic.png → generated-mining-core-node-magic
- mining_core.node.rare → src/assets/images/mining-core/node_rare.png → generated-mining-core-node-rare
- mining_core.node.unique → src/assets/images/mining-core/node_unique.png → generated-mining-core-node-unique
- mining_core.node.center → src/assets/images/mining-core/node_center.png → generated-mining-core-node-center
- mining_core.line.active → src/assets/images/mining-core/line_active.png → generated-mining-core-line-active
- mining_core.line.locked → src/assets/images/mining-core/line_locked.png → generated-mining-core-line-locked
- mining_core.background → src/assets/images/mining-core/mining_core_background.png → generated-mining-core-background

## 23. Effect Images

- effect.hit.impact → src/assets/images/effects/hit_impact.png → generated-effect-hit-impact
- effect.hit.dust → src/assets/images/effects/hit_dust.png → generated-effect-hit-dust
- effect.block.break → src/assets/images/effects/block_break.png → generated-effect-block-break
- effect.resource.fly → src/assets/images/effects/resource_fly.png → generated-effect-resource-fly
- effect.lantern.glow → src/assets/images/effects/lantern_glow.png → generated-effect-lantern-glow
- effect.reward.select → src/assets/images/effects/reward_select.png → generated-effect-reward-select
- effect.chapter.clear → src/assets/images/effects/chapter_clear.png → generated-effect-chapter-clear

## 24. Panel Images

- ui.panel.default → src/assets/images/panels/panel_default.png → generated-panel-default
- ui.panel.reward → src/assets/images/panels/panel_reward.png → generated-panel-reward
- ui.panel.offline → src/assets/images/panels/panel_offline.png → generated-panel-offline
- ui.panel.settings → src/assets/images/panels/panel_settings.png → generated-panel-settings
- ui.panel.resource → src/assets/images/panels/panel_resource.png → generated-panel-resource
- ui.panel.debug → src/assets/images/panels/panel_debug.png → generated-panel-debug

## 25. Image Asset Map Example

```ts
export const imageAssets: Record<ImageAssetKey, ImageAssetRef> = {
  'block.stone': {
    key: 'block.stone',
    category: 'BLOCK',
    generatedFallbackClass: 'generated-block-stone',
    imagePath: '/assets/images/blocks/stone_block.png',
    width: 128,
    height: 128,
    alt: 'Stone block',
    usage: ['MiningFaceCell'],
  },
  'equipment.pickaxe.iron': {
    key: 'equipment.pickaxe.iron',
    category: 'EQUIPMENT',
    generatedFallbackClass: 'generated-pickaxe-iron',
    imagePath: '/assets/images/equipment/pickaxe_iron.png',
    width: 256,
    height: 256,
    alt: 'Iron pickaxe',
    usage: ['PickaxeView', 'PickaxeButtonRegion'],
  },
};
```

## 26. Component Usage Examples

Mining Face block:

```tsx
<VisualAsset assetKey="block.stone" />
<VisualAsset assetKey="ore.iron" />
<VisualAsset assetKey="crack.stage_2" />
```

Equipment:

```tsx
<VisualAsset assetKey={`equipment.pickaxe.${pickaxeTier}`} />
<VisualAsset assetKey={`equipment.lantern.${lanternTier}`} />
<VisualAsset assetKey={`equipment.gloves.${glovesTier}`} />
```

Resource icon:

```tsx
<VisualAsset assetKey="icon.resource.iron" />
```

## 27. Validation

Manual validation:

- GENERATED mode renders the entire game without image files.
- IMAGE mode tries mapped image files.
- IMAGE mode falls back to generated visuals when files are missing.
- AUTO mode uses images when files are available and generated fallback otherwise.
- Debug Panel can preview every image asset key.
- Dropping a PNG file into a mapped path allows immediate visual testing.
- Main Mining Face, equipment, HUD, Reward Encounter, Mining Core, panels, and effects all route through asset keys.


## Image File List Confirmation

This document includes the required image file list, file paths, asset keys, generated fallback classes, runtime visual mode, and Debug Panel image testing requirements.

The implementation must allow generated visuals first and later image replacement by adding files and switching visualAssetMode.


## Source Image Size Guidelines

The game renders around a 480x720 portrait viewport.

Source image size is not the same as display size.

Source images can be larger and are scaled down by CSS.

Recommended source sizes:

| Asset Type | Source Size | Background | Runtime Display |
|---|---:|---|---|
| block base | 256x256 PNG | transparent | about 88~112px per cell |
| ore overlay | 256x256 PNG | transparent | same as block cell |
| crack overlay | 256x256 PNG | transparent | same as block cell |
| effect sprite | 256x256 PNG | transparent | variable, usually cell-sized |
| resource icon | 128x128 PNG | transparent | 18~36px |
| UI icon | 128x128 PNG | transparent | 24~44px |
| equipment hand/pickaxe/lantern/gloves | 512x512 PNG | transparent | about 140~240px |
| mining core node | 128x128 PNG | transparent | 8~30px rendered |
| mining core background | 1024x1024 PNG/JPG | opaque or transparent | scalable SVG/CSS area |
| panel background | 960x1440 PNG or 512x512 9-slice-ready PNG | transparent/opaque | responsive panel |
| cave background | 960x1440 or 1080x1620 PNG/JPG | opaque | full game viewport |

For pixel art:

```text
128x128 or 256x256 sources are acceptable.
Use image-rendering: pixelated only for pixel-art assets.
```

For non-pixel generated/painted art:

```text
256x256 block source is preferred for clean downscaling.
```

## Game Viewport and Responsive Scaling

Base viewport:

```ts
GAME_BASE_WIDTH = 480
GAME_BASE_HEIGHT = 720
GAME_ASPECT_RATIO = 2 / 3
```

The UI should scale from the base viewport.

Recommended CSS variables:

```css
:root {
  --game-base-width: 480;
  --game-base-height: 720;
  --game-scale: 1;
}
```

Mining Face target:

```text
The 3x3 Mining Face should fit comfortably inside MINING_FACE_REGION.
Each cell should render around 88~112px at 480x720.
```

Asset rule:

```text
Use source images larger than runtime display size.
Do not render block images at their full 256px source size on the 480px game viewport.
```

## Safe Area and Hitbox

Minimum touch target:

```text
default minimum = 44px
AUTO / Settings minimum = 40px
equipment button hitbox should be larger than the visible art
```

The image should not define the hitbox.
The UI region defines the hitbox.


## Image Generation Prompts

Image generation prompt guidelines are defined in:

```text
docs/17_IMAGE_GENERATION_PROMPTS.md
```

All final image assets should follow the game-ready stylized mining direction from that document.


## Damage Stage Asset Keys

Generated CSS/SVG damage overlays should exist even before final image files.

Recommended asset keys:

```ts
'damage.cell.chipped'
'damage.cell.cracked'
'damage.cell.exposed'
'damage.cell.crumbling'
'damage.cell.empty'
'damage.face.seams'
'damage.face.large_cracks'
'damage.face.vein_continuation'
'damage.face.lighting'
'damage.face.dust'
```

These can be generated CSS/SVG first and replaced later if needed.

The visual rules are defined in:

```text
docs/18_MINING_FACE_DAMAGE_VISUAL_STAGES.md
```

## Generated Art Primary Mode

MVP primary visual mode:

```ts
visualAssetMode = 'GENERATED'
```

Generated CSS/SVG is not a temporary empty placeholder.

It should be good enough for early playable testing.

Image replacement remains available through:

```ts
visualAssetMode = 'IMAGE' | 'AUTO'
```

This allows later PNG replacement without rewriting gameplay/UI components.


## V38 Block Pattern Variety Clarification

Stone/ore icons and block art should avoid cloned flat marks.
A soft central rock highlight, chip, shadow, or cloudy exposure can be used when it reads as natural material.
Do not use the same centered circle/dot/cloud as the repeated resource marker across all blocks.
Vary cracks, chips, mineral seam positions, silhouettes, and edge damage so stone, iron, crystal, and other resources read as different mined materials.

## MVP Foreground Tool Asset Decision

Current MVP visual assets should follow this simplified direction:

```text
Lantern = required foreground asset, lower-left
Pickaxe = required foreground asset, lower-right
Left hand = optional simple mitten/back-of-hand silhouette
Right hand = optional simple mitten/back-of-hand silhouette
Detailed individual fingers = not required for MVP
Impact particles = separate effect asset, not attached to hand or pickaxe sprite
```

Rules:

```text
Do not delete lantern or pickaxe when removing hand experiments.
Do not merge hand, impact particles, and pickaxe into one confusing silhouette.
If hand artwork is not reliable, keep tool-only version and add hand later as a separate asset.
```

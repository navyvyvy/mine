export type ImageAssetKey =
  | 'mine_wall'
  | 'block_dirt'
  | 'block_stone'
  | 'ore_coal'
  | 'ore_copper'
  | 'ore_iron'
  | 'ore_gold'
  | 'ore_crystal'
  | 'ore_diamond'
  | 'diamond_core'
  | 'pickaxe'
  | 'lantern'
  | 'gloves';

export type ImageAssetDefinition = {
  key: ImageAssetKey;
  category: 'mining' | 'equipment';
  imagePath: string;
  generatedFallbackClass: string;
};

export const IMAGE_ASSETS: Record<ImageAssetKey, ImageAssetDefinition> = {
  mine_wall: { key: 'mine_wall', category: 'mining', imagePath: '/assets/mine-wall.png', generatedFallbackClass: 'asset-mine-wall' },
  block_dirt: { key: 'block_dirt', category: 'mining', imagePath: '/assets/block-dirt.png', generatedFallbackClass: 'asset-block-dirt' },
  block_stone: { key: 'block_stone', category: 'mining', imagePath: '/assets/block-stone.png', generatedFallbackClass: 'asset-block-stone' },
  ore_coal: { key: 'ore_coal', category: 'mining', imagePath: '/assets/ore-coal.png', generatedFallbackClass: 'asset-ore-coal' },
  ore_copper: { key: 'ore_copper', category: 'mining', imagePath: '/assets/ore-copper.png', generatedFallbackClass: 'asset-ore-copper' },
  ore_iron: { key: 'ore_iron', category: 'mining', imagePath: '/assets/ore-iron.png', generatedFallbackClass: 'asset-ore-iron' },
  ore_gold: { key: 'ore_gold', category: 'mining', imagePath: '/assets/ore-gold.png', generatedFallbackClass: 'asset-ore-gold' },
  ore_crystal: { key: 'ore_crystal', category: 'mining', imagePath: '/assets/ore-crystal.png', generatedFallbackClass: 'asset-ore-crystal' },
  ore_diamond: { key: 'ore_diamond', category: 'mining', imagePath: '/assets/ore-diamond.png', generatedFallbackClass: 'asset-ore-diamond' },
  diamond_core: { key: 'diamond_core', category: 'mining', imagePath: '/assets/diamond-core.png', generatedFallbackClass: 'asset-diamond-core' },
  pickaxe: { key: 'pickaxe', category: 'equipment', imagePath: '/assets/pickaxe.png', generatedFallbackClass: 'asset-pickaxe' },
  lantern: { key: 'lantern', category: 'equipment', imagePath: '/assets/lantern.png', generatedFallbackClass: 'asset-lantern' },
  gloves: { key: 'gloves', category: 'equipment', imagePath: '/assets/gloves.png', generatedFallbackClass: 'asset-gloves' }
};

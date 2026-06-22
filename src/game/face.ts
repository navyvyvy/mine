import { clamp, pickWeighted, random01, RESOURCE_IDS } from './constants';
import type {
  ActiveRewardEffect,
  BlockType,
  CellDamageVisualStage,
  FacePattern,
  FaceType,
  MiningCell,
  MiningFace,
  PassiveEffects,
  ResourceId,
  TuningState
} from './types';

type LayerDefinition = {
  name: string;
  minDepth: number;
  baseBlock: BlockType;
  orePool: ResourceId[];
  rarePool: ResourceId[];
};

const LAYERS: LayerDefinition[] = [
  { name: 'Dirt Layer', minDepth: 0, baseBlock: 'DIRT_BLOCK', orePool: ['COAL'], rarePool: ['COAL'] },
  { name: 'Stone Layer', minDepth: 50, baseBlock: 'STONE_BLOCK', orePool: ['COAL', 'COPPER'], rarePool: ['COPPER'] },
  { name: 'Coal Vein', minDepth: 200, baseBlock: 'STONE_BLOCK', orePool: ['COAL', 'COPPER', 'IRON'], rarePool: ['IRON'] },
  { name: 'Iron Depth', minDepth: 450, baseBlock: 'STONE_BLOCK', orePool: ['COAL', 'COPPER', 'IRON', 'GOLD'], rarePool: ['GOLD'] },
  { name: 'Crystal Cave', minDepth: 900, baseBlock: 'STONE_BLOCK', orePool: ['COAL', 'COPPER', 'IRON', 'GOLD', 'CRYSTAL'], rarePool: ['CRYSTAL'] },
  { name: 'Diamond Depth', minDepth: 1500, baseBlock: 'STONE_BLOCK', orePool: ['COAL', 'COPPER', 'IRON', 'GOLD', 'CRYSTAL', 'DIAMOND'], rarePool: ['DIAMOND'] }
];

const BASE_BLOCK_WEIGHTS: Record<string, Partial<Record<BlockType, number>>> = {
  'Dirt Layer': { DIRT_BLOCK: 80, STONE_BLOCK: 20 },
  'Stone Layer': { STONE_BLOCK: 100 },
  'Coal Vein': { STONE_BLOCK: 100 },
  'Iron Depth': { STONE_BLOCK: 100 },
  'Crystal Cave': { STONE_BLOCK: 100 },
  'Diamond Depth': { STONE_BLOCK: 100 }
};

const ORE_BLOCK_BY_RESOURCE: Record<ResourceId, BlockType> = {
  STONE: 'STONE_BLOCK',
  COAL: 'COAL_ORE_BLOCK',
  COPPER: 'COPPER_ORE_BLOCK',
  IRON: 'IRON_ORE_BLOCK',
  GOLD: 'GOLD_ORE_BLOCK',
  CRYSTAL: 'CRYSTAL_ORE_BLOCK',
  DIAMOND: 'DIAMOND_ORE_BLOCK'
};

const LAYER_ORE_WEIGHTS: Record<string, Partial<Record<ResourceId, number>>> = {
  'Dirt Layer': { COAL: 100 },
  'Stone Layer': { COAL: 75, COPPER: 25 },
  'Coal Vein': { COAL: 55, COPPER: 30, IRON: 15 },
  'Iron Depth': { COAL: 20, COPPER: 25, IRON: 40, GOLD: 15 },
  'Crystal Cave': { COAL: 12, COPPER: 18, IRON: 30, GOLD: 25, CRYSTAL: 15 },
  'Diamond Depth': { COAL: 8, COPPER: 12, IRON: 20, GOLD: 25, CRYSTAL: 25, DIAMOND: 10 }
};

const FACE_TYPE_WEIGHTS: Record<string, Record<Exclude<FaceType, 'DIAMOND_CORE'>, number>> = {
  'Dirt Layer': { STANDARD: 50, ORE_SPOT: 40, VEIN: 10, RICH: 0, RARE: 0 },
  'Stone Layer': { STANDARD: 35, ORE_SPOT: 40, VEIN: 20, RICH: 5, RARE: 0 },
  'Coal Vein': { STANDARD: 22, ORE_SPOT: 30, VEIN: 32, RICH: 16, RARE: 0 },
  'Iron Depth': { STANDARD: 18, ORE_SPOT: 25, VEIN: 30, RICH: 26, RARE: 1 },
  'Crystal Cave': { STANDARD: 12, ORE_SPOT: 20, VEIN: 30, RICH: 35, RARE: 3 },
  'Diamond Depth': { STANDARD: 8, ORE_SPOT: 18, VEIN: 28, RICH: 38, RARE: 8 }
};

const PATTERN_CELLS: Record<Exclude<FacePattern, 'SCATTER' | 'CORE_RADIAL'>, number[]> = {
  HORIZONTAL_TOP: [0, 1, 2],
  HORIZONTAL_MIDDLE: [3, 4, 5],
  HORIZONTAL_BOTTOM: [6, 7, 8],
  VERTICAL_LEFT: [0, 3, 6],
  VERTICAL_CENTER: [1, 4, 7],
  VERTICAL_RIGHT: [2, 5, 8],
  DIAGONAL_DOWN: [0, 4, 8],
  DIAGONAL_UP: [6, 4, 2],
  CROSS: [1, 3, 4, 5, 7]
};

export function getLayer(depth: number): LayerDefinition {
  return [...LAYERS].reverse().find((layer) => depth >= layer.minDepth) ?? LAYERS[0];
}

function chooseBaseBlock(layer: LayerDefinition, seed: number): BlockType {
  const weights = BASE_BLOCK_WEIGHTS[layer.name];
  if (!weights) return layer.baseBlock;
  return pickWeighted<BlockType>(weights as Record<BlockType, number>, seed);
}

export function blockResource(blockType: BlockType): ResourceId {
  if (blockType === 'COAL_ORE_BLOCK') return 'COAL';
  if (blockType === 'COPPER_ORE_BLOCK') return 'COPPER';
  if (blockType === 'IRON_ORE_BLOCK') return 'IRON';
  if (blockType === 'GOLD_ORE_BLOCK') return 'GOLD';
  if (blockType === 'CRYSTAL_ORE_BLOCK') return 'CRYSTAL';
  if (blockType === 'DIAMOND_ORE_BLOCK' || blockType === 'DIAMOND_CORE_BLOCK') return 'DIAMOND';
  return 'STONE';
}

export function isOreBlock(blockType: BlockType): boolean {
  return blockType.endsWith('_ORE_BLOCK') || blockType === 'DIAMOND_CORE_BLOCK';
}

export function getEffectiveRequiredHits(blockType: BlockType, tuning: TuningState, passives: PassiveEffects): number {
  if (blockType === 'DIAMOND_CORE_BLOCK') {
    return tuning.progression.chapterCoreRequiredHits;
  }
  const base = tuning.requiredHits[blockType];
  const reduction = blockType === 'DIRT_BLOCK' ? 0 : passives.pickaxeRequiredHitReduction;
  return Math.max(1, base - reduction);
}

export function getCellDamageVisualStage(currentHits: number, requiredHits: number): CellDamageVisualStage {
  if (currentHits <= 0) return 'INTACT';
  if (currentHits >= requiredHits) return 'EMPTY';
  const ratio = currentHits / requiredHits;
  if (ratio <= 0.25) return 'CHIPPED';
  if (ratio <= 0.5) return 'CRACKED';
  if (ratio <= 0.75) return 'EXPOSED';
  return 'CRUMBLING';
}

function chooseFaceType(depth: number, seed: number, tuning: TuningState, passives: PassiveEffects): FaceType {
  if (depth >= tuning.runtime.chapterClearDepthM) return 'DIAMOND_CORE';
  const layer = getLayer(depth);
  const weights = FACE_TYPE_WEIGHTS[layer.name] ?? FACE_TYPE_WEIGHTS['Stone Layer'];
  return pickWeighted<Exclude<FaceType, 'DIAMOND_CORE'>>(
    {
      STANDARD: weights.STANDARD,
      ORE_SPOT: weights.ORE_SPOT + passives.lanternOreSpotWeight,
      VEIN: weights.VEIN + passives.lanternVeinWeight,
      RICH: weights.RICH + passives.lanternRichWeight,
      RARE: weights.RARE + passives.lanternRareWeight + passives.lanternDiamondWeight
    },
    seed
  );
}

function choosePattern(faceType: FaceType, seed: number): FacePattern {
  if (faceType === 'STANDARD' || faceType === 'ORE_SPOT') return 'SCATTER';
  if (faceType === 'DIAMOND_CORE') return 'CORE_RADIAL';
  const patterns = Object.keys(PATTERN_CELLS) as Exclude<FacePattern, 'SCATTER' | 'CORE_RADIAL'>[];
  return patterns[Math.floor(random01(seed + 9) * patterns.length)] ?? 'HORIZONTAL_MIDDLE';
}

function chooseOreResource(layer: LayerDefinition, faceType: FaceType, seed: number): ResourceId {
  if (faceType === 'RARE' && layer.rarePool.length > 0) {
    return layer.rarePool[Math.floor(random01(seed) * layer.rarePool.length)] ?? layer.rarePool[0];
  }
  const weights = LAYER_ORE_WEIGHTS[layer.name] ?? {};
  const weightedPool = RESOURCE_IDS.reduce(
    (acc, resource) => ({
      ...acc,
      [resource]: layer.orePool.includes(resource) ? (weights[resource] ?? 0) : 0
    }),
    {} as Record<ResourceId, number>
  );
  const total = RESOURCE_IDS.reduce((sum, resource) => sum + weightedPool[resource], 0);
  if (total > 0) return pickWeighted<ResourceId>(weightedPool, seed);
  return layer.orePool[Math.floor(random01(seed) * layer.orePool.length)] ?? 'STONE';
}

function createCell(index: number, blockType: BlockType, tuning: TuningState, passives: PassiveEffects): MiningCell {
  const requiredHits = getEffectiveRequiredHits(blockType, tuning, passives);
  return {
    index,
    blockType,
    resource: blockResource(blockType),
    requiredHits,
    currentHits: 0,
    broken: false,
    firstHitLanded: false,
    hitFlashUntilMs: 0,
    dustUntilMs: 0
  };
}

function addOreToCells(
  cells: MiningCell[],
  layer: LayerDefinition,
  indices: number[],
  faceType: FaceType,
  seed: number,
  tuning: TuningState,
  passives: PassiveEffects
): MiningCell[] {
  const next = cells.map((cell) => ({ ...cell }));
  for (const [offset, index] of indices.entries()) {
    const resource = chooseOreResource(layer, faceType, seed + offset * 17);
    const upgraded = maybeUpgradeOre(resource, layer, seed + offset * 31, passives);
    next[index] = createCell(index, ORE_BLOCK_BY_RESOURCE[upgraded], tuning, passives);
  }
  return next;
}

function maybeUpgradeOre(resource: ResourceId, layer: LayerDefinition, seed: number, passives: PassiveEffects): ResourceId {
  if (random01(seed) >= passives.lanternOreUpgradeChance) return resource;
  const currentIndex = RESOURCE_IDS.indexOf(resource);
  const candidates = [...layer.orePool, ...layer.rarePool]
    .filter((candidate) => RESOURCE_IDS.indexOf(candidate) > currentIndex)
    .sort((a, b) => RESOURCE_IDS.indexOf(a) - RESOURCE_IDS.indexOf(b));
  return candidates[0] ?? resource;
}

export function generateMiningFace(
  depth: number,
  faceId: number,
  tuning: TuningState,
  passives: PassiveEffects,
  seedBase = 1337
): MiningFace {
  const seed = seedBase + depth * 101 + faceId * 313;
  const layer = getLayer(depth);
  const faceType = chooseFaceType(depth, seed, tuning, passives);
  const pattern = choosePattern(faceType, seed);

  let cells = Array.from({ length: 9 }, (_, index) => {
    return createCell(index, chooseBaseBlock(layer, seed + index * 29), tuning, passives);
  });

  if (faceType === 'DIAMOND_CORE') {
    cells = cells.map((cell) => {
      if (cell.index === 4) return createCell(cell.index, 'DIAMOND_CORE_BLOCK', tuning, passives);
      if ([1, 3, 5, 7].includes(cell.index)) return createCell(cell.index, 'DIAMOND_ORE_BLOCK', tuning, passives);
      return createCell(cell.index, 'STONE_BLOCK', tuning, passives);
    });
  } else if (faceType === 'ORE_SPOT') {
    const index = Math.floor(random01(seed + 44) * 9);
    cells = addOreToCells(cells, layer, [index], faceType, seed + 200, tuning, passives);
  } else if (faceType === 'VEIN' || faceType === 'RICH' || faceType === 'RARE') {
    const basePattern = pattern !== 'SCATTER' && pattern !== 'CORE_RADIAL' ? PATTERN_CELLS[pattern] : [3, 4, 5];
    const extra = faceType === 'RICH' ? tuning.generation.richExtraOreSlots : faceType === 'RARE' ? tuning.generation.rareExtraOreSlots : 0;
    const extraCells = Array.from({ length: extra }, (_, offset) => Math.floor(random01(seed + 300 + offset * 19) * 9));
    cells = addOreToCells(cells, layer, Array.from(new Set([...basePattern, ...extraCells])), faceType, seed + 500, tuning, passives);
  }

  if (random01(seed + 900) < passives.lanternOreDensityChance) {
    const nonOre = cells.filter((cell) => !isOreBlock(cell.blockType) && !cell.broken);
    const pick = nonOre[Math.floor(random01(seed + 901) * nonOre.length)];
    if (pick) {
      cells = addOreToCells(cells, layer, [pick.index], faceType, seed + 902, tuning, passives);
    }
  }

  if (random01(seed + 1000) < passives.deepCoreStartingFractureChance) {
    const index = Math.floor(random01(seed + 1001) * 9);
    cells[index] = crackCell(cells[index], 1, 0);
  }

  return {
    id: faceId,
    seed,
    depth,
    layerName: layer.name,
    faceType,
    pattern,
    cells
  };
}

export function crackCell(cell: MiningCell, amount: number, nowMs: number): MiningCell {
  if (cell.broken) return cell;
  const currentHits = clamp(cell.currentHits + amount, 0, cell.requiredHits);
  const broken = currentHits >= cell.requiredHits;
  return {
    ...cell,
    currentHits,
    broken,
    firstHitLanded: cell.firstHitLanded || amount > 0,
    hitFlashUntilMs: nowMs > 0 ? nowMs + 180 : cell.hitFlashUntilMs,
    dustUntilMs: nowMs > 0 ? nowMs + 460 : cell.dustUntilMs
  };
}

function addOreSlot(face: MiningFace, seedOffset: number, tuning: TuningState, passives: PassiveEffects): MiningFace {
  const layer = getLayer(face.depth);
  const empty = face.cells.filter((cell) => !isOreBlock(cell.blockType) && !cell.broken);
  const pick = empty[Math.floor(random01(face.seed + seedOffset) * empty.length)];
  if (!pick) return face;
  const cells = addOreToCells(face.cells, layer, [pick.index], face.faceType, face.seed + seedOffset + 1, tuning, passives);
  return { ...face, cells };
}

export function applyNextFaceStartEffects(
  face: MiningFace,
  effects: ActiveRewardEffect[],
  tuning: TuningState,
  passives: PassiveEffects,
  nowMs: number
): MiningFace {
  let next = { ...face, cells: face.cells.map((cell) => ({ ...cell })) };
  for (const effect of effects) {
    switch (effect.effectKey) {
      case 'PICKAXE_CRACKED_WALL':
        next = { ...next, cells: next.cells.map((cell) => crackCell(cell, 1, nowMs)) };
        break;
      case 'PICKAXE_CRACK_BOMB': {
        const indices = [0, 1, 2].map((offset) => Math.floor(random01(next.seed + 40 + offset) * 9));
        next = { ...next, cells: next.cells.map((cell) => (indices.includes(cell.index) ? crackCell(cell, 2, nowMs) : cell)) };
        break;
      }
      case 'PICKAXE_CENTER_SPLIT':
        next = {
          ...next,
          cells: next.cells.map((cell) => ([4].includes(cell.index) ? crackCell(cell, 2, nowMs) : [1, 3, 5, 7].includes(cell.index) ? crackCell(cell, 1, nowMs) : cell))
        };
        break;
      case 'PICKAXE_CORE_SMASH':
        next = { ...next, cells: next.cells.map((cell) => (cell.index === 4 ? crackCell(cell, 4, nowMs) : cell)) };
        break;
      case 'PICKAXE_STONE_CRUSHER': {
        const targets = next.cells.filter((cell) => !isOreBlock(cell.blockType)).slice(0, 4).map((cell) => cell.index);
        next = { ...next, cells: next.cells.map((cell) => (targets.includes(cell.index) ? crackCell(cell, 1, nowMs) : cell)) };
        break;
      }
      case 'PICKAXE_DEEP_FRACTURE': {
        const rows = random01(next.seed + 80) > 0.5 ? [0, 1, 2] : [0, 3, 6];
        const offset = Math.floor(random01(next.seed + 81) * 3);
        const indices = rows.map((base) => base + offset);
        next = { ...next, cells: next.cells.map((cell) => (indices.includes(cell.index) ? crackCell(cell, 2, nowMs) : cell)) };
        break;
      }
      case 'LANTERN_FORCE_VEIN':
        next = {
          ...next,
          faceType: 'VEIN',
          pattern: next.pattern === 'SCATTER' ? 'HORIZONTAL_MIDDLE' : next.pattern
        };
        if (!next.cells.some((cell) => isOreBlock(cell.blockType))) {
          next = addOreSlot(next, 91, tuning, passives);
          next = addOreSlot(next, 92, tuning, passives);
          next = addOreSlot(next, 93, tuning, passives);
        }
        break;
      case 'LANTERN_FORCE_RICH':
        next = { ...next, faceType: 'RICH' };
        next = addOreSlot(addOreSlot(next, 101, tuning, passives), 102, tuning, passives);
        break;
      case 'LANTERN_ADD_ORE_SLOT':
      case 'LANTERN_RARE_SLOT':
      case 'LANTERN_DIAMOND_GLINT':
        next = addOreSlot(next, 111, tuning, passives);
        break;
      default:
        break;
    }
  }
  return next;
}

export function getAdjacentCellIndices(index: number): number[] {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const result: number[] = [];
  for (const [dr, dc] of [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ]) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) result.push(nr * 3 + nc);
  }
  return result;
}

export function isFaceCleared(face: MiningFace): boolean {
  return face.cells.every((cell) => cell.broken);
}

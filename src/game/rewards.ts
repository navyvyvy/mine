import { random01 } from './constants';
import { getLayer } from './face';
import type { PassiveEffects, ResourceId, RewardChoice, RewardRank, TuningState } from './types';

const MATERIAL_REWARDS: Array<Pick<RewardChoice, 'id' | 'nameKo' | 'nameEn' | 'resource' | 'amount' | 'rank'> & { requiredLayer: string }> = [
  { id: 5000, nameKo: '돌 꾸러미', nameEn: 'Stone Bundle', resource: 'STONE', amount: 12, rank: 'COMMON', requiredLayer: 'Dirt Layer' },
  { id: 5001, nameKo: '석탄 꾸러미', nameEn: 'Coal Bundle', resource: 'COAL', amount: 8, rank: 'COMMON', requiredLayer: 'Dirt Layer' },
  { id: 5002, nameKo: '구리 조각', nameEn: 'Copper Pieces', resource: 'COPPER', amount: 6, rank: 'COMMON', requiredLayer: 'Stone Layer' },
  { id: 5003, nameKo: '철 조각', nameEn: 'Iron Pieces', resource: 'IRON', amount: 6, rank: 'UNCOMMON', requiredLayer: 'Coal Vein' },
  { id: 5004, nameKo: '금 조각', nameEn: 'Gold Pieces', resource: 'GOLD', amount: 4, rank: 'UNCOMMON', requiredLayer: 'Iron Depth' },
  { id: 5005, nameKo: '수정 조각', nameEn: 'Crystal Pieces', resource: 'CRYSTAL', amount: 3, rank: 'RARE', requiredLayer: 'Crystal Cave' },
  { id: 5006, nameKo: '다이아 파편', nameEn: 'Diamond Shard', resource: 'DIAMOND', amount: 2, rank: 'RARE', requiredLayer: 'Diamond Depth' }
];

const EFFECT_REWARDS: RewardChoice[] = [
  {
    id: 1000,
    kind: 'PICKAXE',
    rank: 'COMMON',
    duration: 'NEXT_FACE_START',
    nameKo: '갈라진 벽',
    nameEn: 'Cracked Wall',
    description: 'Next face starts with every cell cracked once.',
    effectKey: 'PICKAXE_CRACKED_WALL',
    params: { crackAll: 1 }
  },
  {
    id: 1001,
    kind: 'PICKAXE',
    rank: 'COMMON',
    duration: 'NEXT_FACE_START',
    nameKo: '균열 폭탄',
    nameEn: 'Crack Bomb',
    description: 'Three random cells start with two cracks.',
    effectKey: 'PICKAXE_CRACK_BOMB',
    params: { targetCount: 3, crackAmount: 2 }
  },
  {
    id: 1002,
    kind: 'PICKAXE',
    rank: 'COMMON',
    duration: 'NEXT_FACE_START',
    nameKo: '중심 절개',
    nameEn: 'Center Split',
    description: 'Center starts cracked twice, cross cells once.',
    effectKey: 'PICKAXE_CENTER_SPLIT',
    params: { centerCrack: 2, crossCrack: 1 }
  },
  {
    id: 1003,
    kind: 'PICKAXE',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '단단한 파쇄',
    nameEn: 'Hard Breaker',
    description: 'First hit on hard blocks cracks harder.',
    effectKey: 'PICKAXE_HARD_BREAKER',
    params: { hardFirstHitPlus: 2 }
  },
  {
    id: 1004,
    kind: 'PICKAXE',
    rank: 'COMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '첫 타격',
    nameEn: 'First Smash',
    description: 'First hit on each target adds two cracks.',
    effectKey: 'PICKAXE_FIRST_SMASH_REWARD',
    params: { firstHitPlus: 2 }
  },
  {
    id: 1005,
    kind: 'PICKAXE',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '무거운 곡괭이',
    nameEn: 'Heavy Pick',
    description: 'Each hit has a chance to add one crack.',
    effectKey: 'PICKAXE_HEAVY_PICK',
    params: { extraCrackChance: 0.25 }
  },
  {
    id: 1006,
    kind: 'PICKAXE',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '광석 끌',
    nameEn: 'Ore Chisel',
    description: 'First hit on ore blocks adds one crack.',
    effectKey: 'PICKAXE_ORE_CHISEL_REWARD',
    params: { oreFirstHitPlus: 1 }
  },
  {
    id: 1007,
    kind: 'PICKAXE',
    rank: 'RARE',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '돌파',
    nameEn: 'Breakthrough',
    description: 'Breaking a cell cracks adjacent cells.',
    effectKey: 'PICKAXE_BREAKTHROUGH',
    params: { adjacentCrack: 1 }
  },
  {
    id: 1008,
    kind: 'PICKAXE',
    rank: 'RARE',
    duration: 'NEXT_FACE_START',
    nameKo: '코어 강타',
    nameEn: 'Core Smash',
    description: 'Center cell starts with four cracks.',
    effectKey: 'PICKAXE_CORE_SMASH',
    params: { centerCrack: 4 }
  },
  {
    id: 1009,
    kind: 'PICKAXE',
    rank: 'COMMON',
    duration: 'NEXT_FACE_START',
    nameKo: '돌 파쇄기',
    nameEn: 'Stone Crusher',
    description: 'Four non-ore rock cells start cracked.',
    effectKey: 'PICKAXE_STONE_CRUSHER',
    params: { targetCount: 4, crackAmount: 1 }
  },
  {
    id: 1010,
    kind: 'PICKAXE',
    rank: 'RARE',
    duration: 'NEXT_FACE_START',
    nameKo: '깊은 균열',
    nameEn: 'Deep Fracture',
    description: 'One row or column starts with deeper cracks.',
    effectKey: 'PICKAXE_DEEP_FRACTURE',
    params: { crackAmount: 2 }
  },
  {
    id: 2000,
    kind: 'LANTERN',
    rank: 'COMMON',
    duration: 'NEXT_FACE_START',
    nameKo: '광맥의 빛',
    nameEn: 'Vein Glimmer',
    description: 'Next face becomes at least a vein face.',
    effectKey: 'LANTERN_FORCE_VEIN',
    params: { minFaceType: 'VEIN' }
  },
  {
    id: 2001,
    kind: 'LANTERN',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_START',
    nameKo: '풍부한 빛',
    nameEn: 'Rich Glimmer',
    description: 'Next face becomes rich with ore.',
    effectKey: 'LANTERN_FORCE_RICH',
    params: { minFaceType: 'RICH' }
  },
  {
    id: 2002,
    kind: 'LANTERN',
    rank: 'COMMON',
    duration: 'NEXT_FACE_START',
    nameKo: '광석 불꽃',
    nameEn: 'Ore Spark',
    description: 'Next face gains one valid ore slot.',
    effectKey: 'LANTERN_ADD_ORE_SLOT',
    params: { oreSlots: 1 }
  },
  {
    id: 2003,
    kind: 'LANTERN',
    rank: 'COMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '선명한 시야',
    nameEn: 'Clear Sight',
    description: 'AUTO prioritizes ore more strongly.',
    effectKey: 'LANTERN_CLEAR_SIGHT',
    params: { orePriority: 24 }
  },
  {
    id: 2004,
    kind: 'LANTERN',
    rank: 'RARE',
    duration: 'NEXT_FACE_START',
    nameKo: '희귀한 반짝임',
    nameEn: 'Rare Glint',
    description: 'Next face gains a rare ore slot.',
    effectKey: 'LANTERN_RARE_SLOT',
    params: { rareSlots: 1 }
  },
  {
    id: 2005,
    kind: 'LANTERN',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '등불 훑기',
    nameEn: 'Lamp Sweep',
    description: 'Ore blocks can grant one extra same resource.',
    effectKey: 'LANTERN_LAMP_SWEEP',
    params: { oreBonusChance: 0.2 }
  },
  {
    id: 2006,
    kind: 'LANTERN',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_CLEAR',
    nameKo: '숨은 광주머니',
    nameEn: 'Hidden Pocket',
    description: 'Clearing the next face grants an extra mined resource.',
    effectKey: 'LANTERN_HIDDEN_POCKET',
    params: { resourceLines: 1 }
  },
  {
    id: 2007,
    kind: 'LANTERN',
    rank: 'COMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '인도하는 빛',
    nameEn: 'Guiding Glow',
    description: 'AUTO favors ore and ore can grant extra material.',
    effectKey: 'LANTERN_GUIDING_GLOW',
    params: { orePriority: 12, oreBonusChance: 0.1 }
  },
  {
    id: 2008,
    kind: 'LANTERN',
    rank: 'RARE',
    duration: 'NEXT_FACE_START',
    nameKo: '다이아 반짝임',
    nameEn: 'Diamond Glint',
    description: 'Next face has a better chance to reveal high-value ore.',
    effectKey: 'LANTERN_DIAMOND_GLINT',
    params: { diamondWeight: 1, oreSlots: 1 }
  },
  {
    id: 2009,
    kind: 'LANTERN',
    rank: 'RARE',
    duration: 'NEXT_FACE_CLEAR',
    nameKo: '광석 메아리',
    nameEn: 'Ore Echo',
    description: 'Clearing ore can echo into extra same resources.',
    effectKey: 'LANTERN_ORE_ECHO',
    params: { oreEchoChance: 0.2 }
  },
  {
    id: 2010,
    kind: 'LANTERN',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '수정 빛',
    nameEn: 'Crystal Shine',
    description: 'Crystal blocks can grant one extra crystal this face.',
    effectKey: 'LANTERN_CRYSTAL_SHINE',
    params: { crystalBonusChance: 0.25 }
  },
  {
    id: 3000,
    kind: 'GLOVES',
    rank: 'COMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '빠른 손놀림',
    nameEn: 'Quick Hands',
    description: 'Hit interval is reduced this face.',
    effectKey: 'GLOVES_QUICK_HANDS',
    params: { hitIntervalReduction: 0.25 }
  },
  {
    id: 3001,
    kind: 'GLOVES',
    rank: 'COMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '집중 장악',
    nameEn: 'Focused Grip',
    description: 'The first few hits on the face crack harder.',
    effectKey: 'GLOVES_FOCUSED_GRIP',
    params: { firstHits: 5, crackPlus: 1 }
  },
  {
    id: 3002,
    kind: 'GLOVES',
    rank: 'COMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '안정된 시작',
    nameEn: 'Steady Opening',
    description: 'Every third hit adds one extra crack this face.',
    effectKey: 'GLOVES_STEADY_OPENING',
    params: { everyHits: 3, crackPlus: 1 }
  },
  {
    id: 3003,
    kind: 'GLOVES',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '회수 동작',
    nameEn: 'Break Recovery',
    description: 'Strike recovery is faster this face.',
    effectKey: 'GLOVES_BREAK_RECOVERY_REWARD',
    params: { hitIntervalReduction: 0.12 }
  },
  {
    id: 3004,
    kind: 'GLOVES',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '깔끔한 파괴',
    nameEn: 'Clean Break',
    description: 'Hit interval is reduced while clearing this face.',
    effectKey: 'GLOVES_CLEAN_BREAK',
    params: { hitIntervalReduction: 0.15 }
  },
  {
    id: 3005,
    kind: 'GLOVES',
    rank: 'RARE',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '균열 파동',
    nameEn: 'Crack Burst',
    description: 'Every fifth hit cracks target and adjacent cells.',
    effectKey: 'GLOVES_CRACK_BURST',
    params: { everyHits: 5, adjacentCrack: 1 }
  },
  {
    id: 3006,
    kind: 'GLOVES',
    rank: 'COMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '단단한 손아귀',
    nameEn: 'Firm Grip',
    description: 'Each hit has a chance to add one extra crack.',
    effectKey: 'GLOVES_FIRM_GRIP',
    params: { chance: 0.2, crackPlus: 1 }
  },
  {
    id: 3007,
    kind: 'GLOVES',
    rank: 'RARE',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '완벽한 스윙',
    nameEn: 'Perfect Swing',
    description: 'The first swing on the face lands much harder.',
    effectKey: 'GLOVES_PERFECT_SWING',
    params: { firstTargetCrack: 4 }
  },
  {
    id: 3008,
    kind: 'GLOVES',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '잔해 정리 손놀림',
    nameEn: 'Debris Clear Hands',
    description: 'Every second hit adds an extra crack this face.',
    effectKey: 'GLOVES_DEBRIS_CLEAR_HANDS',
    params: { everyHits: 2, crackPlus: 1 }
  },
  {
    id: 3009,
    kind: 'GLOVES',
    rank: 'UNCOMMON',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '순간 타격',
    nameEn: 'Snap Strike',
    description: 'The first three hits recover much faster.',
    effectKey: 'GLOVES_SNAP_STRIKE',
    params: { firstHits: 3, hitIntervalReduction: 0.5 }
  },
  {
    id: 3010,
    kind: 'GLOVES',
    rank: 'RARE',
    duration: 'NEXT_FACE_ACTIVE',
    nameKo: '공명하는 손',
    nameEn: 'Resonant Hands',
    description: 'Breaking a cell cracks nearby cells.',
    effectKey: 'GLOVES_RESONANT_HANDS',
    params: { adjacentCrack: 1 }
  }
];

export function getRewardChoiceTemplate(rewardId: number): RewardChoice | undefined {
  return EFFECT_REWARDS.find((reward) => reward.id === rewardId);
}

const LAYER_ORDER = ['Dirt Layer', 'Stone Layer', 'Coal Vein', 'Iron Depth', 'Crystal Cave', 'Diamond Depth'];

function layerIndex(layerName: string): number {
  return Math.max(0, LAYER_ORDER.indexOf(layerName));
}

function rankWeight(rank: RewardRank, tuning: TuningState, passives: PassiveEffects): number {
  if (rank === 'COMMON') return tuning.rewards.commonWeight;
  if (rank === 'UNCOMMON') return tuning.rewards.uncommonWeight + passives.deepCoreRewardQualityWeight;
  return tuning.rewards.rareWeight + passives.deepCoreRewardQualityWeight * 0.5;
}

function rollRewardRank(seed: number, tuning: TuningState, passives: PassiveEffects): RewardRank {
  const weights = {
    COMMON: rankWeight('COMMON', tuning, passives),
    UNCOMMON: rankWeight('UNCOMMON', tuning, passives),
    RARE: rankWeight('RARE', tuning, passives)
  };
  const total = weights.COMMON + weights.UNCOMMON + weights.RARE;
  const roll = random01(seed) * total;
  if (roll < weights.RARE) return 'RARE';
  if (roll < weights.RARE + weights.UNCOMMON) return 'UNCOMMON';
  return 'COMMON';
}

export function generateRewardChoices(
  encounterId: number,
  depth: number,
  tuning: TuningState,
  passives: PassiveEffects
): [RewardChoice, RewardChoice] {
  const layer = getLayer(depth);
  const eligibleMaterial = MATERIAL_REWARDS.filter(
    (reward) => layerIndex(reward.requiredLayer) <= layerIndex(layer.name)
  ).map((reward) => ({
    id: reward.id,
    kind: 'MATERIAL' as const,
    rank: reward.rank,
    duration: 'IMMEDIATE' as const,
    nameKo: reward.nameKo,
    nameEn: reward.nameEn,
    description: `Gain ${Math.round((reward.amount ?? 0) * tuning.rewards.materialRewardScale)} ${reward.resource}.`,
    resource: reward.resource as ResourceId,
    amount: Math.round((reward.amount ?? 0) * tuning.rewards.materialRewardScale),
    params: { amount: Math.round((reward.amount ?? 0) * tuning.rewards.materialRewardScale) }
  }));
  const candidates = [...eligibleMaterial, ...EFFECT_REWARDS];
  const picks: RewardChoice[] = [];
  let cursor = encounterId * 109 + depth * 7;
  while (picks.length < 2 && cursor < encounterId * 109 + depth * 7 + 80) {
    const desiredRank = rollRewardRank(cursor, tuning, passives);
    const bucket = candidates.filter((reward) => reward.rank === desiredRank && !picks.some((pick) => pick.id === reward.id));
    const fallback = candidates.filter((reward) => !picks.some((pick) => pick.id === reward.id));
    const source = bucket.length > 0 ? bucket : fallback;
    const pick = source[Math.floor(random01(cursor + 3) * source.length)];
    if (pick) picks.push({ ...pick, params: { ...pick.params } });
    cursor += 1;
  }
  return [picks[0], picks[1]] as [RewardChoice, RewardChoice];
}

export function describeReward(choice: RewardChoice): string {
  if (choice.kind === 'MATERIAL') {
    return `Gain ${choice.amount ?? 0} ${choice.resource}.`;
  }
  return choice.description;
}

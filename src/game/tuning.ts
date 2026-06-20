import type { TuningState } from './types';

const effectValue = (common: number, magic: number, rare: number, unique = rare) => ({
  common,
  magic,
  rare,
  unique
});

export const DEFAULT_TUNING: TuningState = {
  runtime: {
    chapterClearDepthM: 3000,
    offlineMaxDepthRatioBeforeChapterCore: 0.98,
    autosaveIntervalMs: 10000
  },
  mining: {
    baseHitIntervalMs: 700,
    minimumHitIntervalMs: 150,
    manualMiningEnabled: true,
    manualStrikeCooldownMs: 220,
    baseResourceAmount: 1,
    maxBonusResourceChance: 0.75,
    firstMinuteAffordableTargetSeconds: 90
  },
  animation: {
    faceAdvanceTransitionMs: 850,
    reducedMotionFaceAdvanceTransitionMs: 250,
    pickaxeAimDurationRatio: 0.2,
    pickaxeWindUpDurationRatio: 0.2,
    pickaxeImpactDurationRatio: 0.2,
    pickaxeRecoverDurationRatio: 0.4,
    pickaxeTravelScale: 1,
    pickaxeImpactShake: 8,
    pickaxeReducedMotionScale: 0.35,
    pickaxeTargetHorizontalStepPx: 42,
    pickaxeTargetTopYPx: -112,
    pickaxeTargetMiddleYPx: -70,
    pickaxeTargetBottomYPx: -28,
    lanternRevealDurationMs: 650,
    lanternRevealMinMs: 350,
    lanternRevealMaxMs: 1200,
    reducedMotionLanternRevealMs: 180,
    lanternRevealGlowScale: 1.35,
    lanternRevealOreGlintDelayMs: 180,
    targetHitFlashMs: 180,
    targetDustMs: 460
  },
  generation: {
    baseStandardWeight: 58,
    baseOreSpotWeight: 18,
    baseVeinWeight: 10,
    baseRichWeight: 4,
    baseRareWeight: 1,
    richExtraOreSlots: 2,
    rareExtraOreSlots: 1,
    oreDensityMaxExtraSlots: 1
  },
  rewards: {
    minFacesBeforeEncounter: 3,
    maxFacesBeforeEncounter: 7,
    encounterChancePerFace: 0.35,
    rewardChoiceTimeoutMs: 8000,
    rewardChoiceTimeoutWarningMs: 3000,
    rewardAutoPickEnabled: true,
    rewardAutoPickStrategy: 'highestScore',
    commonWeight: 70,
    uncommonWeight: 25,
    rareWeight: 5,
    materialSecondaryChanceBase: 0.04,
    materialRewardScale: 1,
    oreBonusChanceLightSweep: 0.2,
    heavyPickExtraCrackChance: 0.25,
    breakRecoveryChance: 0.25,
    glovesTemporaryHitIntervalReduction: 0.25
  },
  costs: {
    refundRate: 0.9,
    costPresetBudgets: {
      FREE: 0,
      C1: 18,
      C2: 70,
      C3: 210,
      C4: 720,
      C5: 1800,
      C6: 4600
    },
    rarityMultipliers: {
      CENTER: 0,
      COMMON: 1,
      MAGIC: 1.35,
      RARE: 1.8,
      UNIQUE: 2.35
    },
    branchResourceWeights: {
      CENTER: {},
      PICKAXE: { STONE: 0.46, COAL: 0.22, COPPER: 0.16, IRON: 0.1, GOLD: 0.04, CRYSTAL: 0.015, DIAMOND: 0.005 },
      LANTERN: { STONE: 0.2, COAL: 0.36, COPPER: 0.18, IRON: 0.08, GOLD: 0.12, CRYSTAL: 0.045, DIAMOND: 0.015 },
      GLOVES: { STONE: 0.34, COAL: 0.12, COPPER: 0.2, IRON: 0.24, GOLD: 0.06, CRYSTAL: 0.03, DIAMOND: 0.01 },
      DEEP_CORE: { STONE: 0.24, COAL: 0.24, COPPER: 0.18, IRON: 0.14, GOLD: 0.08, CRYSTAL: 0.08, DIAMOND: 0.04 }
    }
  },
  offline: {
    maxOfflineSeconds: 14400,
    offlineEfficiency: 0.35,
    maxOfflineDepthAdvance: 50,
    minimumOfflineSeconds: 60,
    baseOfflineResourcesPerDepth: 5
  },
  progression: {
    targetChapterClearHours: 9,
    projectedAverageFaceClearSeconds: 10.8,
    chapterCoreRequiredHits: 30
  },
  caps: {
    maxRequiredHitReduction: 3,
    maxFocusedCrackChance: 0.6,
    maxOreDensityChance: 0.35,
    maxOreUpgradeChance: 0.3,
    maxOreBonusChance: 0.75,
    maxHitIntervalReduction: 0.78,
    maxBreakRecoveryChance: 0.65,
    maxDebrisClearSpeed: 0.35,
    maxResonantBreakChance: 0.45,
    maxExtraMaterialChance: 0.35,
    maxOfflineEfficiency: 0.7,
    maxOfflineDepthCapM: 250,
    maxStartingFractureChance: 0.6,
    maxMaterialFindChance: 0.45
  },
  requiredHits: {
    DIRT_BLOCK: 1,
    STONE_BLOCK: 2,
    COAL_ORE_BLOCK: 2,
    COPPER_ORE_BLOCK: 3,
    IRON_ORE_BLOCK: 3,
    GOLD_ORE_BLOCK: 4,
    CRYSTAL_ORE_BLOCK: 5,
    DIAMOND_ORE_BLOCK: 6,
    DIAMOND_CORE_BLOCK: 30
  },
  nodeEffectValues: {
    CENTER_UNLOCK: effectValue(0, 0, 0, 0),
    PICKAXE_BASE_UNLOCK: effectValue(0, 0, 0, 0),
    PICKAXE_CRACK_PLUS: effectValue(0.08, 0.16, 0.26, 0.32),
    PICKAXE_REQUIRED_HIT_REDUCTION: effectValue(0.18, 0.28, 0.44, 0.5),
    PICKAXE_HARD_CRACK_PLUS: effectValue(0.12, 0.22, 0.36, 0.44),
    PICKAXE_ORE_CRACK_PLUS: effectValue(0.12, 0.22, 0.36, 0.44),
    PICKAXE_FIRST_HIT_PLUS: effectValue(0.3, 0.6, 1, 1.2),
    PICKAXE_FOCUSED_CRACK_CHANCE: effectValue(0.04, 0.08, 0.14, 0.18),
    PICKAXE_TIER_STONE: effectValue(0, 0, 0, 0.2),
    PICKAXE_TIER_COPPER: effectValue(0, 0, 0, 0.3),
    PICKAXE_TIER_IRON: effectValue(0, 0, 0, 0.42),
    PICKAXE_TIER_CRYSTAL: effectValue(0, 0, 0, 0.55),
    PICKAXE_TIER_DIAMOND: effectValue(0, 0, 0, 0.75),
    LANTERN_BASE_UNLOCK: effectValue(0, 0, 0, 0),
    LANTERN_ORE_SPOT_WEIGHT: effectValue(1, 2, 3, 4),
    LANTERN_VEIN_WEIGHT: effectValue(1, 2, 3, 4),
    LANTERN_RICH_WEIGHT: effectValue(0.5, 1.5, 3, 4),
    LANTERN_RARE_WEIGHT: effectValue(0.25, 0.75, 1.5, 2),
    LANTERN_ORE_DENSITY_CHANCE: effectValue(0.04, 0.08, 0.14, 0.18),
    LANTERN_ORE_BONUS_CHANCE: effectValue(0.015, 0.03, 0.05, 0.065),
    LANTERN_ORE_UPGRADE_CHANCE: effectValue(0.03, 0.06, 0.1, 0.13),
    LANTERN_TIER_STONE: effectValue(0, 0, 0, 3),
    LANTERN_TIER_COPPER: effectValue(0, 0, 0, 3),
    LANTERN_TIER_IRON: effectValue(0, 0, 0, 3),
    LANTERN_TIER_CRYSTAL: effectValue(0, 0, 0, 0.12),
    LANTERN_TIER_DIAMOND: effectValue(0, 0, 0, 2),
    GLOVES_BASE_UNLOCK: effectValue(0, 0, 0, 0),
    GLOVES_HIT_INTERVAL_REDUCTION: effectValue(0.02, 0.04, 0.07, 0.09),
    GLOVES_OPENING_ACCELERATION_CHANCE: effectValue(0.08, 0.16, 0.28, 0.34),
    GLOVES_CRACK_TRACKING_PRIORITY: effectValue(8, 16, 28, 34),
    GLOVES_BREAK_RECOVERY_CHANCE: effectValue(0.1, 0.2, 0.35, 0.42),
    GLOVES_DEBRIS_CLEAR_SPEED: effectValue(0.03, 0.06, 0.1, 0.12),
    GLOVES_RESONANT_BREAK_CHANCE: effectValue(0.06, 0.12, 0.22, 0.28),
    GLOVES_TIER_STONE: effectValue(0, 0, 0, 0.08),
    GLOVES_TIER_COPPER: effectValue(0, 0, 0, 0.12),
    GLOVES_TIER_IRON: effectValue(0, 0, 0, 0.12),
    GLOVES_TIER_CRYSTAL: effectValue(0, 0, 0, 0.12),
    GLOVES_TIER_DIAMOND: effectValue(0, 0, 0, 0.16),
    DEEP_CORE_BASE_UNLOCK: effectValue(0, 0, 0, 0),
    DEEP_CORE_EXTRA_MATERIAL_CHANCE: effectValue(0.03, 0.06, 0.1, 0.12),
    DEEP_CORE_OFFLINE_EFFICIENCY: effectValue(0.02, 0.04, 0.07, 0.09),
    DEEP_CORE_OFFLINE_DEPTH_CAP: effectValue(5, 10, 20, 25),
    DEEP_CORE_STARTING_FRACTURE_CHANCE: effectValue(0.06, 0.12, 0.22, 0.28),
    DEEP_CORE_REWARD_QUALITY: effectValue(1, 2, 4, 5),
    DEEP_CORE_MATERIAL_FIND_CHANCE: effectValue(0.04, 0.08, 0.14, 0.18),
    DEEP_CORE_TIER_STONE: effectValue(0, 0, 0, 0.1),
    DEEP_CORE_TIER_COAL: effectValue(0, 0, 0, 0.1),
    DEEP_CORE_TIER_IRON: effectValue(0, 0, 0, 0.1),
    DEEP_CORE_TIER_CRYSTAL: effectValue(0, 0, 0, 0.1),
    DEEP_CORE_ENDLESS_TAB_OPEN: effectValue(0, 0, 0, 1)
  }
};

export function cloneDefaultTuning(): TuningState {
  return JSON.parse(JSON.stringify(DEFAULT_TUNING)) as TuningState;
}

export function getOfflineMaxDepthBeforeChapterCoreM(tuning: TuningState): number {
  return Math.floor(tuning.runtime.chapterClearDepthM * tuning.runtime.offlineMaxDepthRatioBeforeChapterCore);
}

export function setTuningNumber(tuning: TuningState, path: string[], value: number): TuningState {
  const next = JSON.parse(JSON.stringify(tuning)) as TuningState;
  let cursor: Record<string, unknown> = next as unknown as Record<string, unknown>;
  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = cursor[path[index]] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]] = Number.isFinite(value) ? value : 0;
  return next;
}

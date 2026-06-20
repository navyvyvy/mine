import { MINING_CORE_BRANCH_COUNTS, MINING_CORE_NODES } from '../data/miningCoreNodes';
import type { MiningCoreNodeData } from '../data/miningCoreNodes';
import { clamp } from './constants';
import { DEFAULT_TUNING } from './tuning';
import type { PassiveEffects, TuningState } from './types';

export const RECOGNIZED_EFFECT_KEYS = Object.keys(DEFAULT_TUNING.nodeEffectValues).sort();

const EMPTY_PASSIVES: Omit<PassiveEffects, 'activeEffectValues'> = {
  pickaxeCrackPlusChance: 0,
  pickaxeHardCrackPlus: 0,
  pickaxeOreCrackPlus: 0,
  pickaxeFirstHitPlus: 0,
  pickaxeRequiredHitReduction: 0,
  pickaxeFocusedCrackChance: 0,
  lanternOreSpotWeight: 0,
  lanternVeinWeight: 0,
  lanternRichWeight: 0,
  lanternRareWeight: 0,
  lanternOreDensityChance: 0,
  lanternOreUpgradeChance: 0,
  lanternOreBonusChance: 0,
  lanternDiamondWeight: 0,
  glovesHitIntervalReduction: 0,
  glovesOpeningAccelerationChance: 0,
  glovesCrackTrackingPriority: 0,
  glovesBreakRecoveryChance: 0,
  glovesDebrisClearSpeed: 0,
  glovesResonantBreakChance: 0,
  deepCoreExtraMaterialChance: 0,
  deepCoreOfflineEfficiency: 0,
  deepCoreOfflineDepthCapM: 0,
  deepCoreStartingFractureChance: 0,
  deepCoreMaterialFindChance: 0,
  deepCoreRewardQualityWeight: 0,
  endlessCoreVisible: false
};

function nodeValue(node: MiningCoreNodeData, tuning: TuningState): number {
  const values = tuning.nodeEffectValues[node.effectKey];
  if (!values) return 0;
  if (node.rarity === 'COMMON') return values.common;
  if (node.rarity === 'MAGIC') return values.magic;
  if (node.rarity === 'RARE') return values.rare;
  return values.unique;
}

export function calculatePassiveEffects(activeNodeIds: number[], tuning: TuningState): PassiveEffects {
  const activeSet = new Set(activeNodeIds);
  const activeEffectValues: Record<string, number> = Object.fromEntries(
    RECOGNIZED_EFFECT_KEYS.map((key) => [key, 0])
  );
  const passives: PassiveEffects = {
    ...EMPTY_PASSIVES,
    activeEffectValues
  };

  for (const node of MINING_CORE_NODES) {
    if (!activeSet.has(node.id)) continue;
    const value = nodeValue(node, tuning);
    activeEffectValues[node.effectKey] = (activeEffectValues[node.effectKey] ?? 0) + value;

    switch (node.effectKey) {
      case 'PICKAXE_CRACK_PLUS':
        passives.pickaxeCrackPlusChance += value;
        break;
      case 'PICKAXE_REQUIRED_HIT_REDUCTION':
        passives.pickaxeRequiredHitReduction += value;
        break;
      case 'PICKAXE_HARD_CRACK_PLUS':
        passives.pickaxeHardCrackPlus += value;
        break;
      case 'PICKAXE_ORE_CRACK_PLUS':
        passives.pickaxeOreCrackPlus += value;
        break;
      case 'PICKAXE_FIRST_HIT_PLUS':
        passives.pickaxeFirstHitPlus += value;
        break;
      case 'PICKAXE_FOCUSED_CRACK_CHANCE':
        passives.pickaxeFocusedCrackChance += value;
        break;
      case 'PICKAXE_TIER_STONE':
      case 'PICKAXE_TIER_COPPER':
      case 'PICKAXE_TIER_IRON':
      case 'PICKAXE_TIER_CRYSTAL':
      case 'PICKAXE_TIER_DIAMOND':
        passives.pickaxeCrackPlusChance += value * 0.45;
        passives.pickaxeRequiredHitReduction += value * 0.8;
        passives.pickaxeFocusedCrackChance += value * 0.16;
        break;
      case 'LANTERN_ORE_SPOT_WEIGHT':
        passives.lanternOreSpotWeight += value;
        break;
      case 'LANTERN_VEIN_WEIGHT':
        passives.lanternVeinWeight += value;
        break;
      case 'LANTERN_RICH_WEIGHT':
        passives.lanternRichWeight += value;
        break;
      case 'LANTERN_RARE_WEIGHT':
        passives.lanternRareWeight += value;
        break;
      case 'LANTERN_ORE_DENSITY_CHANCE':
        passives.lanternOreDensityChance += value;
        break;
      case 'LANTERN_ORE_UPGRADE_CHANCE':
        passives.lanternOreUpgradeChance += value;
        break;
      case 'LANTERN_ORE_BONUS_CHANCE':
        passives.lanternOreBonusChance += value;
        break;
      case 'LANTERN_TIER_STONE':
        passives.lanternOreSpotWeight += value;
        break;
      case 'LANTERN_TIER_COPPER':
        passives.lanternVeinWeight += value;
        break;
      case 'LANTERN_TIER_IRON':
        passives.lanternRichWeight += value;
        break;
      case 'LANTERN_TIER_CRYSTAL':
        passives.lanternOreUpgradeChance += value;
        passives.lanternRareWeight += value * 8;
        break;
      case 'LANTERN_TIER_DIAMOND':
        passives.lanternDiamondWeight += value;
        passives.lanternRareWeight += value;
        break;
      case 'GLOVES_HIT_INTERVAL_REDUCTION':
        passives.glovesHitIntervalReduction += value;
        break;
      case 'GLOVES_OPENING_ACCELERATION_CHANCE':
        passives.glovesOpeningAccelerationChance += value;
        break;
      case 'GLOVES_CRACK_TRACKING_PRIORITY':
        passives.glovesCrackTrackingPriority += value;
        break;
      case 'GLOVES_BREAK_RECOVERY_CHANCE':
        passives.glovesBreakRecoveryChance += value;
        break;
      case 'GLOVES_DEBRIS_CLEAR_SPEED':
        passives.glovesDebrisClearSpeed += value;
        break;
      case 'GLOVES_RESONANT_BREAK_CHANCE':
        passives.glovesResonantBreakChance += value;
        break;
      case 'GLOVES_TIER_STONE':
        passives.glovesHitIntervalReduction += value;
        break;
      case 'GLOVES_TIER_COPPER':
        passives.glovesOpeningAccelerationChance += value;
        passives.glovesBreakRecoveryChance += value;
        break;
      case 'GLOVES_TIER_IRON':
        passives.glovesDebrisClearSpeed += value;
        passives.glovesBreakRecoveryChance += value;
        break;
      case 'GLOVES_TIER_CRYSTAL':
        passives.glovesResonantBreakChance += value;
        passives.glovesDebrisClearSpeed += value;
        break;
      case 'GLOVES_TIER_DIAMOND':
        passives.glovesHitIntervalReduction += value;
        passives.glovesOpeningAccelerationChance += value;
        passives.glovesBreakRecoveryChance += value;
        passives.glovesResonantBreakChance += value;
        break;
      case 'DEEP_CORE_EXTRA_MATERIAL_CHANCE':
        passives.deepCoreExtraMaterialChance += value;
        break;
      case 'DEEP_CORE_OFFLINE_EFFICIENCY':
        passives.deepCoreOfflineEfficiency += value;
        break;
      case 'DEEP_CORE_OFFLINE_DEPTH_CAP':
        passives.deepCoreOfflineDepthCapM += value;
        break;
      case 'DEEP_CORE_STARTING_FRACTURE_CHANCE':
        passives.deepCoreStartingFractureChance += value;
        break;
      case 'DEEP_CORE_MATERIAL_FIND_CHANCE':
        passives.deepCoreMaterialFindChance += value;
        break;
      case 'DEEP_CORE_REWARD_QUALITY':
        passives.deepCoreRewardQualityWeight += value;
        break;
      case 'DEEP_CORE_TIER_STONE':
        passives.deepCoreStartingFractureChance += value;
        break;
      case 'DEEP_CORE_TIER_COAL':
        passives.deepCoreOfflineEfficiency += value;
        passives.deepCoreOfflineDepthCapM += value * 100;
        break;
      case 'DEEP_CORE_TIER_IRON':
        passives.deepCoreExtraMaterialChance += value;
        break;
      case 'DEEP_CORE_TIER_CRYSTAL':
        passives.deepCoreRewardQualityWeight += value * 10;
        passives.deepCoreMaterialFindChance += value;
        break;
      case 'DEEP_CORE_ENDLESS_TAB_OPEN':
        passives.endlessCoreVisible = true;
        break;
      case 'CENTER_UNLOCK':
      case 'PICKAXE_BASE_UNLOCK':
      case 'LANTERN_BASE_UNLOCK':
      case 'GLOVES_BASE_UNLOCK':
      case 'DEEP_CORE_BASE_UNLOCK':
        break;
      default:
        break;
    }
  }

  passives.pickaxeRequiredHitReduction = clamp(
    Math.floor(passives.pickaxeRequiredHitReduction),
    0,
    tuning.caps.maxRequiredHitReduction
  );
  passives.pickaxeFocusedCrackChance = clamp(passives.pickaxeFocusedCrackChance, 0, tuning.caps.maxFocusedCrackChance);
  passives.lanternOreDensityChance = clamp(passives.lanternOreDensityChance, 0, tuning.caps.maxOreDensityChance);
  passives.lanternOreUpgradeChance = clamp(passives.lanternOreUpgradeChance, 0, tuning.caps.maxOreUpgradeChance);
  passives.lanternOreBonusChance = clamp(passives.lanternOreBonusChance, 0, tuning.caps.maxOreBonusChance);
  passives.glovesHitIntervalReduction = clamp(passives.glovesHitIntervalReduction, 0, tuning.caps.maxHitIntervalReduction);
  passives.glovesBreakRecoveryChance = clamp(passives.glovesBreakRecoveryChance, 0, tuning.caps.maxBreakRecoveryChance);
  passives.glovesDebrisClearSpeed = clamp(passives.glovesDebrisClearSpeed, 0, tuning.caps.maxDebrisClearSpeed);
  passives.glovesResonantBreakChance = clamp(passives.glovesResonantBreakChance, 0, tuning.caps.maxResonantBreakChance);
  passives.deepCoreExtraMaterialChance = clamp(passives.deepCoreExtraMaterialChance, 0, tuning.caps.maxExtraMaterialChance);
  passives.deepCoreOfflineEfficiency = clamp(passives.deepCoreOfflineEfficiency, 0, tuning.caps.maxOfflineEfficiency);
  passives.deepCoreOfflineDepthCapM = clamp(passives.deepCoreOfflineDepthCapM, 0, tuning.caps.maxOfflineDepthCapM);
  passives.deepCoreStartingFractureChance = clamp(
    passives.deepCoreStartingFractureChance,
    0,
    tuning.caps.maxStartingFractureChance
  );
  passives.deepCoreMaterialFindChance = clamp(passives.deepCoreMaterialFindChance, 0, tuning.caps.maxMaterialFindChance);

  return passives;
}

export function validateEffectRecognition(): { missing: string[]; recognized: string[] } {
  const recognizedSet = new Set(RECOGNIZED_EFFECT_KEYS);
  const generatedKeys = Array.from(new Set(MINING_CORE_NODES.map((node) => node.effectKey))).sort();
  return {
    missing: generatedKeys.filter((key) => !recognizedSet.has(key)),
    recognized: generatedKeys.filter((key) => recognizedSet.has(key))
  };
}

export function miningCoreGeneratedSummary() {
  return {
    total: MINING_CORE_NODES.length,
    branchCounts: MINING_CORE_BRANCH_COUNTS,
    effectRecognition: validateEffectRecognition()
  };
}

import type { MiningCoreBranch, MiningCoreNodeData } from '../data/miningCoreNodes';

export type ResourceId = 'STONE' | 'COAL' | 'COPPER' | 'IRON' | 'GOLD' | 'CRYSTAL' | 'DIAMOND';
export type Language = 'ko' | 'en';

export type ResourceAmountMap = Record<ResourceId, number>;

export type BlockType =
  | 'DIRT_BLOCK'
  | 'STONE_BLOCK'
  | 'COAL_ORE_BLOCK'
  | 'COPPER_ORE_BLOCK'
  | 'IRON_ORE_BLOCK'
  | 'GOLD_ORE_BLOCK'
  | 'CRYSTAL_ORE_BLOCK'
  | 'DIAMOND_ORE_BLOCK'
  | 'DIAMOND_CORE_BLOCK';

export type FaceType = 'STANDARD' | 'ORE_SPOT' | 'VEIN' | 'RICH' | 'RARE' | 'DIAMOND_CORE';

export type FacePattern =
  | 'SCATTER'
  | 'HORIZONTAL_TOP'
  | 'HORIZONTAL_MIDDLE'
  | 'HORIZONTAL_BOTTOM'
  | 'VERTICAL_LEFT'
  | 'VERTICAL_CENTER'
  | 'VERTICAL_RIGHT'
  | 'DIAGONAL_DOWN'
  | 'DIAGONAL_UP'
  | 'CROSS'
  | 'CORE_RADIAL';

export type CellDamageVisualStage = 'INTACT' | 'CHIPPED' | 'CRACKED' | 'EXPOSED' | 'CRUMBLING' | 'EMPTY';

export type MiningCell = {
  index: number;
  blockType: BlockType;
  resource: ResourceId;
  requiredHits: number;
  currentHits: number;
  broken: boolean;
  firstHitLanded: boolean;
  hitFlashUntilMs: number;
  dustUntilMs: number;
};

export type MiningFace = {
  id: number;
  seed: number;
  depth: number;
  layerName: string;
  faceType: FaceType;
  pattern: FacePattern;
  cells: MiningCell[];
};

export type ActivePanel = 'NONE' | 'MINING_CORE' | 'RESOURCE' | 'SETTINGS';
export type ActiveOverlay = 'NONE' | 'REWARD_ENCOUNTER' | 'OFFLINE_REWARD' | 'CHAPTER_CLEAR';

export type PickaxeStrikePhase = 'READY' | 'AIM_TO_TARGET' | 'WIND_UP' | 'IMPACT' | 'RECOVER';

export type PickaxeStrikeState = {
  phase: PickaxeStrikePhase;
  targetCellIndex: number | null;
  startedAtMs: number;
  impactAtMs: number;
  endsAtMs: number;
  impactApplied: boolean;
};

export type RewardDuration = 'IMMEDIATE' | 'NEXT_FACE_START' | 'NEXT_FACE_ACTIVE' | 'NEXT_FACE_CLEAR';
export type RewardKind = 'MATERIAL' | 'PICKAXE' | 'LANTERN' | 'GLOVES';
export type RewardRank = 'COMMON' | 'UNCOMMON' | 'RARE';

export type RewardChoice = {
  id: number;
  kind: RewardKind;
  rank: RewardRank;
  duration: RewardDuration;
  nameKo: string;
  nameEn: string;
  description: string;
  resource?: ResourceId;
  amount?: number;
  effectKey?: string;
  params: Record<string, number | string>;
};

export type RewardEncounter = {
  id: number;
  openedAtDepth: number;
  openedAtMs: number;
  choices: [RewardChoice, RewardChoice];
  selectedId: number | null;
};

export type ActiveRewardEffect = {
  sourceRewardId: number;
  effectKey: string;
  label: string;
  duration: Exclude<RewardDuration, 'IMMEDIATE'>;
  params: Record<string, number | string>;
  faceId: number;
};

export type VisualAssetMode = 'GENERATED' | 'IMAGE' | 'AUTO';

export type SettingsState = {
  language: Language;
  reducedMotion: boolean;
  masterVolume: number;
  sfxVolume: number;
  muted: boolean;
  visualAssetMode: VisualAssetMode;
};

export type PassiveEffects = {
  pickaxeCrackPlusChance: number;
  pickaxeHardCrackPlus: number;
  pickaxeOreCrackPlus: number;
  pickaxeFirstHitPlus: number;
  pickaxeRequiredHitReduction: number;
  pickaxeFocusedCrackChance: number;
  lanternOreSpotWeight: number;
  lanternVeinWeight: number;
  lanternRichWeight: number;
  lanternRareWeight: number;
  lanternOreDensityChance: number;
  lanternOreUpgradeChance: number;
  lanternOreBonusChance: number;
  lanternDiamondWeight: number;
  glovesHitIntervalReduction: number;
  glovesOpeningAccelerationChance: number;
  glovesCrackTrackingPriority: number;
  glovesBreakRecoveryChance: number;
  glovesDebrisClearSpeed: number;
  glovesResonantBreakChance: number;
  deepCoreExtraMaterialChance: number;
  deepCoreOfflineEfficiency: number;
  deepCoreOfflineDepthCapM: number;
  deepCoreStartingFractureChance: number;
  deepCoreMaterialFindChance: number;
  deepCoreRewardQualityWeight: number;
  endlessCoreVisible: boolean;
  activeEffectValues: Record<string, number>;
};

export type TuningPath = string[];

export type TuningState = {
  runtime: {
    chapterClearDepthM: number;
    offlineMaxDepthRatioBeforeChapterCore: number;
    autosaveIntervalMs: number;
  };
  mining: {
    baseHitIntervalMs: number;
    minimumHitIntervalMs: number;
    manualMiningEnabled: boolean;
    manualStrikeCooldownMs: number;
    baseResourceAmount: number;
    maxBonusResourceChance: number;
    firstMinuteAffordableTargetSeconds: number;
  };
  animation: {
    faceAdvanceTransitionMs: number;
    reducedMotionFaceAdvanceTransitionMs: number;
    pickaxeAimDurationRatio: number;
    pickaxeWindUpDurationRatio: number;
    pickaxeImpactDurationRatio: number;
    pickaxeRecoverDurationRatio: number;
    pickaxeTravelScale: number;
    pickaxeImpactShake: number;
    pickaxeReducedMotionScale: number;
    pickaxeTargetHorizontalStepPx: number;
    pickaxeTargetTopYPx: number;
    pickaxeTargetMiddleYPx: number;
    pickaxeTargetBottomYPx: number;
    lanternRevealDurationMs: number;
    lanternRevealMinMs: number;
    lanternRevealMaxMs: number;
    reducedMotionLanternRevealMs: number;
    lanternRevealGlowScale: number;
    lanternRevealOreGlintDelayMs: number;
    targetHitFlashMs: number;
    targetDustMs: number;
  };
  generation: {
    baseStandardWeight: number;
    baseOreSpotWeight: number;
    baseVeinWeight: number;
    baseRichWeight: number;
    baseRareWeight: number;
    richExtraOreSlots: number;
    rareExtraOreSlots: number;
    oreDensityMaxExtraSlots: number;
  };
  rewards: {
    minFacesBeforeEncounter: number;
    maxFacesBeforeEncounter: number;
    encounterChancePerFace: number;
    rewardChoiceTimeoutMs: number;
    rewardChoiceTimeoutWarningMs: number;
    rewardAutoPickEnabled: boolean;
    rewardAutoPickStrategy: 'highestScore' | 'first';
    commonWeight: number;
    uncommonWeight: number;
    rareWeight: number;
    materialSecondaryChanceBase: number;
    materialRewardScale: number;
    oreBonusChanceLightSweep: number;
    heavyPickExtraCrackChance: number;
    breakRecoveryChance: number;
    glovesTemporaryHitIntervalReduction: number;
  };
  costs: {
    refundRate: number;
    costPresetBudgets: Record<string, number>;
    rarityMultipliers: Record<string, number>;
    branchResourceWeights: Record<MiningCoreBranch, Partial<Record<ResourceId, number>>>;
  };
  offline: {
    maxOfflineSeconds: number;
    offlineEfficiency: number;
    maxOfflineDepthAdvance: number;
    minimumOfflineSeconds: number;
    baseOfflineResourcesPerDepth: number;
  };
  progression: {
    targetChapterClearHours: number;
    projectedAverageFaceClearSeconds: number;
    chapterCoreRequiredHits: number;
  };
  caps: {
    maxRequiredHitReduction: number;
    maxFocusedCrackChance: number;
    maxOreDensityChance: number;
    maxOreUpgradeChance: number;
    maxOreBonusChance: number;
    maxHitIntervalReduction: number;
    maxBreakRecoveryChance: number;
    maxDebrisClearSpeed: number;
    maxResonantBreakChance: number;
    maxExtraMaterialChance: number;
    maxOfflineEfficiency: number;
    maxOfflineDepthCapM: number;
    maxStartingFractureChance: number;
    maxMaterialFindChance: number;
  };
  requiredHits: Record<BlockType, number>;
  nodeEffectValues: Record<string, { common: number; magic: number; rare: number; unique: number }>;
};

export type MiningCoreState = {
  activeNodeIds: number[];
  selectedNodeId: number;
  nodeSpendRecords: Record<number, ResourceAmountMap>;
  focusedBranch: MiningCoreBranch;
};

export type Flyout = {
  id: number;
  cellIndex: number;
  resource: ResourceId;
  amount: number;
  createdAtMs: number;
};

export type ToastMessage = {
  id: number;
  messageKo: string;
  messageEn: string;
  icon?: string;
  createdAtMs: number;
};

export type OfflineSummary = {
  elapsedSeconds: number;
  cappedSeconds: number;
  estimatedDepthGained: number;
  estimatedResources: ResourceAmountMap;
  chapterBlocked: boolean;
  message: string;
};

export type GameLog = {
  id: number;
  timeMs: number;
  category: 'mining' | 'reward' | 'upgrade' | 'progress' | 'offline' | 'system' | 'debug';
  message: string;
};

export type FirstMinuteStats = {
  startedAtMs: number;
  firstBlockBrokenAtMs: number | null;
  firstFaceClearedAtMs: number | null;
  firstAffordableNodeAtMs: number | null;
};

export type GameState = {
  nowMs: number;
  resources: ResourceAmountMap;
  lifetimeMinedResources: ResourceAmountMap;
  lifetimeSpentResources: ResourceAmountMap;
  lifetimeRefundedResources: ResourceAmountMap;
  rewardGainedResources: ResourceAmountMap;
  bonusGainedResources: ResourceAmountMap;
  depth: number;
  maxDepth: number;
  currentFace: MiningFace;
  clearedFaceCount: number;
  facesSinceLastEncounter: number;
  autoEnabled: boolean;
  miningPaused: boolean;
  activePanel: ActivePanel;
  activeOverlay: ActiveOverlay;
  targetCellIndex: number | null;
  forcedTargetCellIndex: number | null;
  targetScores: Record<number, number>;
  strike: PickaxeStrikeState | null;
  activeRewards: ActiveRewardEffect[];
  rewardEncounter: RewardEncounter | null;
  lanternRevealUntilMs: number;
  faceTransitionUntilMs: number;
  faceClearRevealUntilMs: number;
  miningCore: MiningCoreState;
  settings: SettingsState;
  debugOpen: boolean;
  tuning: TuningState;
  passives: PassiveEffects;
  logs: GameLog[];
  flyouts: Flyout[];
  toasts: ToastMessage[];
  offlineSummary: OfflineSummary | null;
  sessionStartedAtMs: number;
  totalHits: number;
  totalActiveSeconds: number;
  totalAutoMiningSeconds: number;
  totalAutoOffSeconds: number;
  totalRewardChoiceSeconds: number;
  totalOfflineRewardedSeconds: number;
  lastManualStrikeAtMs: number;
  chapterClearCompleted: boolean;
  lastActiveAt: number;
  saveRevision: number;
  lastSaveReason: string;
  saveStatusMessage: string;
  firstMinute: FirstMinuteStats;
};

export type NodeState = 'LOCKED' | 'AVAILABLE' | 'AFFORDABLE' | 'ACTIVE';

export type MiningCoreNodeView = {
  node: MiningCoreNodeData;
  state: NodeState;
  cost: ResourceAmountMap;
  missing: ResourceAmountMap;
};

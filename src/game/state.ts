import { MINING_CORE_NODES } from '../data/miningCoreNodes';
import type { MiningCoreBranch } from '../data/miningCoreNodes';
import {
  addResourceMaps,
  canAfford,
  clamp,
  createEmptyResources,
  random01,
  RESOURCE_PRIORITY,
  subtractResourceMaps
} from './constants';
import { calculateNodeCost, getNodeById } from './costs';
import { calculatePassiveEffects } from './effects';
import {
  applyNextFaceStartEffects,
  crackCell,
  generateMiningFace,
  getAdjacentCellIndices,
  isFaceCleared,
  isOreBlock
} from './face';
import { repairBaselineNodeIds } from './miningCoreBaseline';
import { generateRewardChoices } from './rewards';
import type { SaveData } from './save';
import { SAVE_VERSION } from './save';
import { cloneDefaultTuning, getOfflineMaxDepthBeforeChapterCoreM, setTuningNumber } from './tuning';
import type {
  ActivePanel,
  ActiveRewardEffect,
  GameLog,
  GameState,
  MiningCell,
  MiningFace,
  OfflineSummary,
  PickaxeStrikePhase,
  PickaxeStrikeState,
  ResourceAmountMap,
  ResourceId,
  RewardChoice,
  RewardEncounter,
  SettingsState,
  ToastMessage,
  TuningState
} from './types';

type GameAction =
  | { type: 'TICK'; nowMs: number }
  | { type: 'TOGGLE_AUTO' }
  | { type: 'SET_PANEL'; panel: ActivePanel; branch?: MiningCoreBranch }
  | { type: 'SET_DEBUG_OPEN'; open: boolean }
  | { type: 'TOGGLE_DEBUG' }
  | { type: 'SELECT_NODE'; nodeId: number }
  | { type: 'UNLOCK_NODE'; nodeId: number }
  | { type: 'SET_TUNING_NUMBER'; path: string[]; value: number }
  | { type: 'SET_REWARD_AUTO_PICK_ENABLED'; enabled: boolean }
  | { type: 'SET_REWARD_AUTO_PICK_STRATEGY'; strategy: 'highestScore' | 'first' }
  | { type: 'SET_MANUAL_MINING_ENABLED'; enabled: boolean }
  | { type: 'SET_SETTING'; key: keyof SettingsState; value: SettingsState[keyof SettingsState] }
  | { type: 'MANUAL_CELL_STRIKE'; cellIndex: number; nowMs: number }
  | { type: 'SELECT_REWARD'; rewardId: number }
  | { type: 'CLEAR_FACE' }
  | { type: 'GENERATE_FACE' }
  | { type: 'STEP_HIT' }
  | { type: 'SET_DEPTH'; depth: number }
  | { type: 'ADD_RESOURCE'; resource: ResourceId; amount: number }
  | { type: 'SET_RESOURCE'; resource: ResourceId; amount: number }
  | { type: 'ADD_ALL_RESOURCES'; amount: number }
  | { type: 'FORCE_TARGET'; cellIndex: number | null }
  | { type: 'OPEN_REWARD_NOW' }
  | { type: 'CLOSE_REWARD' }
  | { type: 'PAUSE_TOGGLE' }
  | { type: 'RESET_FRESH'; nowMs: number }
  | { type: 'CLEAR_SAVE_STATUS' };

export type { GameAction };

function log(state: GameState, category: GameLog['category'], message: string): GameState {
  const entry: GameLog = {
    id: state.logs.length > 0 ? state.logs[0].id + 1 : 1,
    timeMs: state.nowMs,
    category,
    message
  };
  return { ...state, logs: [entry, ...state.logs].slice(0, 120) };
}

const TOAST_RESOURCE_LABELS: Record<ResourceId, { ko: string; en: string }> = {
  STONE: { ko: '돌', en: 'Stone' },
  COAL: { ko: '석탄', en: 'Coal' },
  COPPER: { ko: '구리', en: 'Copper' },
  IRON: { ko: '철', en: 'Iron' },
  GOLD: { ko: '금', en: 'Gold' },
  CRYSTAL: { ko: '수정', en: 'Crystal' },
  DIAMOND: { ko: '다이아', en: 'Diamond' }
};

function addToast(state: GameState, toast: Omit<ToastMessage, 'id' | 'createdAtMs'>): GameState {
  const entry: ToastMessage = {
    ...toast,
    id: state.toasts.length > 0 ? state.toasts[0].id + 1 : state.logs.length + state.totalHits + 1,
    createdAtMs: state.nowMs
  };
  return { ...state, toasts: [entry, ...state.toasts].slice(0, 3) };
}

function keepRecentByCreatedAt<T extends { createdAtMs: number }>(items: T[], nowMs: number, lifetimeMs: number): T[] {
  const firstExpiredIndex = items.findIndex((item) => nowMs - item.createdAtMs >= lifetimeMs);
  return firstExpiredIndex === -1 ? items : items.slice(0, firstExpiredIndex);
}

function resourceToast(resource: ResourceId, amount: number): Omit<ToastMessage, 'id' | 'createdAtMs'> {
  const label = TOAST_RESOURCE_LABELS[resource];
  return {
    messageKo: `${label.ko} +${amount}`,
    messageEn: `${label.en} +${amount}`
  };
}

function defaultSettings(): SettingsState {
  return {
    language: 'ko',
    reducedMotion: false,
    masterVolume: 0.8,
    sfxVolume: 0.8,
    muted: false,
    visualAssetMode: 'GENERATED'
  };
}

function createRewardEncounter(state: GameState, depth: number): RewardEncounter {
  const id = state.clearedFaceCount + depth + 1;
  return {
    id,
    openedAtDepth: depth,
    openedAtMs: state.nowMs,
    choices: generateRewardChoices(id, depth, state.tuning, state.passives),
    selectedId: null
  };
}

function computeHitIntervalMs(state: GameState): number {
  const effects = currentFaceEffects(state);
  const quickHands = effects
    .filter((effect) => effect.effectKey === 'GLOVES_QUICK_HANDS')
    .reduce((sum, effect) => sum + Number(effect.params.hitIntervalReduction ?? 0), 0);
  const snapStrikeEffect = effects.find((effect) => effect.effectKey === 'GLOVES_SNAP_STRIKE');
  const snapStrike = snapStrikeEffect && currentFaceHitCount(state) < Number(snapStrikeEffect.params.firstHits ?? 3)
    ? Number(snapStrikeEffect.params.hitIntervalReduction ?? 0)
    : 0;
  const cleanBreak = effects.some((effect) => effect.effectKey === 'GLOVES_CLEAN_BREAK')
    ? Number(effects.find((effect) => effect.effectKey === 'GLOVES_CLEAN_BREAK')?.params.hitIntervalReduction ?? 0)
    : 0;
  const breakRecovery = effects.some((effect) => effect.effectKey === 'GLOVES_BREAK_RECOVERY_REWARD')
    ? Number(effects.find((effect) => effect.effectKey === 'GLOVES_BREAK_RECOVERY_REWARD')?.params.hitIntervalReduction ?? 0)
    : 0;
  const reduction = clamp(state.passives.glovesHitIntervalReduction + quickHands + snapStrike + cleanBreak + breakRecovery, 0, state.tuning.caps.maxHitIntervalReduction);
  return Math.max(state.tuning.mining.minimumHitIntervalMs, Math.round(state.tuning.mining.baseHitIntervalMs * (1 - reduction)));
}

function updateStrikePhase(strike: PickaxeStrikeState, nowMs: number, tuning: TuningState): PickaxeStrikeState {
  const duration = Math.max(1, strike.endsAtMs - strike.startedAtMs);
  const elapsedRatio = clamp((nowMs - strike.startedAtMs) / duration, 0, 1);
  const aimEnd = tuning.animation.pickaxeAimDurationRatio;
  const windEnd = aimEnd + tuning.animation.pickaxeWindUpDurationRatio;
  const impactEnd = windEnd + tuning.animation.pickaxeImpactDurationRatio;
  let phase: PickaxeStrikePhase = 'RECOVER';
  if (elapsedRatio < aimEnd) phase = 'AIM_TO_TARGET';
  else if (elapsedRatio < windEnd) phase = 'WIND_UP';
  else if (elapsedRatio < impactEnd) phase = 'IMPACT';
  return { ...strike, phase };
}

function startStrike(state: GameState, nowMs: number, targetCellIndex: number): GameState {
  const interval = computeHitIntervalMs(state);
  const impactAtMs =
    nowMs +
    interval * (state.tuning.animation.pickaxeAimDurationRatio + state.tuning.animation.pickaxeWindUpDurationRatio);
  const strike: PickaxeStrikeState = {
    phase: 'AIM_TO_TARGET',
    targetCellIndex,
    startedAtMs: nowMs,
    impactAtMs,
    endsAtMs: nowMs + interval,
    impactApplied: false
  };
  return { ...state, strike, targetCellIndex };
}

function requestManualStrike(state: GameState, cellIndex: number, nowMs: number): GameState {
  if (
    state.autoEnabled ||
    !state.tuning.mining.manualMiningEnabled ||
    state.miningPaused ||
    state.activeOverlay !== 'NONE' ||
    state.activePanel !== 'NONE' ||
    state.strike ||
    nowMs < state.faceTransitionUntilMs ||
    nowMs < state.lanternRevealUntilMs ||
    nowMs - state.lastManualStrikeAtMs < state.tuning.mining.manualStrikeCooldownMs
  ) {
    return state;
  }
  const cell = state.currentFace.cells[cellIndex];
  if (!cell || cell.broken) return state;
  return startStrike(
    {
      ...state,
      nowMs,
      lastManualStrikeAtMs: nowMs,
      targetScores: {}
    },
    nowMs,
    cell.index
  );
}

function targetScore(cell: MiningCell, state: GameState): number {
  if (cell.broken) return -Infinity;
  const clearSight = currentFaceEffects(state).some((effect) => effect.effectKey === 'LANTERN_CLEAR_SIGHT') && isOreBlock(cell.blockType) ? 24 : 0;
  const guidingGlow = isOreBlock(cell.blockType) ? activeRewardNumber(state, 'LANTERN_GUIDING_GLOW', 'orePriority') : 0;
  const crackProgressScore = cell.currentHits > 0 ? (cell.currentHits / cell.requiredHits) * 34 : 0;
  const finishScore = cell.requiredHits - cell.currentHits <= 1 ? 18 : 0;
  const patternPriority = cell.index === 4 ? 2 : 0;
  const tieBreaker = (8 - cell.index) * 0.01;
  return RESOURCE_PRIORITY[cell.resource] + crackProgressScore + finishScore + clearSight + guidingGlow + state.passives.glovesCrackTrackingPriority + patternPriority + tieBreaker;
}

function selectTarget(state: GameState): { cellIndex: number | null; scores: Record<number, number> } {
  const scores: Record<number, number> = {};
  for (const cell of state.currentFace.cells) scores[cell.index] = targetScore(cell, state);
  if (state.forcedTargetCellIndex !== null) {
    const forced = state.currentFace.cells[state.forcedTargetCellIndex];
    if (forced && !forced.broken) return { cellIndex: forced.index, scores };
  }
  const candidates = state.currentFace.cells.filter((cell) => !cell.broken).sort((a, b) => scores[b.index] - scores[a.index]);
  return { cellIndex: candidates[0]?.index ?? null, scores };
}

function rewardEffectFromChoice(choice: RewardChoice, faceId: number): ActiveRewardEffect | null {
  if (!choice.effectKey || choice.duration === 'IMMEDIATE') return null;
  return {
    sourceRewardId: choice.id,
    effectKey: choice.effectKey,
    label: choice.nameEn,
    duration: choice.duration,
    params: { ...choice.params },
    faceId
  };
}

function currentFaceEffects(state: GameState): ActiveRewardEffect[] {
  return state.activeRewards.filter((effect) => effect.duration === 'NEXT_FACE_ACTIVE' && effect.faceId === state.currentFace.id);
}

function currentFaceClearEffects(state: GameState): ActiveRewardEffect[] {
  return state.activeRewards.filter((effect) => effect.duration === 'NEXT_FACE_CLEAR' && effect.faceId === state.currentFace.id);
}

function currentFaceHitCount(state: GameState): number {
  return state.currentFace.cells.reduce((sum, cell) => sum + cell.currentHits, 0);
}

function activeRewardNumber(state: GameState, key: string, param: string): number {
  return currentFaceEffects(state)
    .filter((effect) => effect.effectKey === key)
    .reduce((sum, effect) => sum + Number(effect.params[param] ?? 0), 0);
}

function rewardScore(choice: RewardChoice): number {
  const rankScore = choice.rank === 'RARE' ? 300 : choice.rank === 'UNCOMMON' ? 180 : 100;
  const kindScore = choice.kind === 'MATERIAL' ? Number(choice.amount ?? 0) : 40;
  return rankScore + kindScore;
}

function getAutoRewardChoice(encounter: RewardEncounter, strategy: 'highestScore' | 'first'): RewardChoice {
  if (strategy === 'highestScore') {
    return [...encounter.choices].sort((a, b) => rewardScore(b) - rewardScore(a))[0] ?? encounter.choices[0];
  }
  return encounter.choices[0];
}

function calculateHitDamage(state: GameState, cell: MiningCell): number {
  let damage = 1;
  const seed = state.currentFace.seed + state.totalHits * 37 + cell.index * 11;
  const faceHitCount = currentFaceHitCount(state);
  if (random01(seed + 1) < state.passives.pickaxeCrackPlusChance) damage += 1;
  if (random01(seed + 2) < state.passives.pickaxeFocusedCrackChance) damage += 1;
  if (!cell.firstHitLanded) {
    damage += Math.floor(state.passives.pickaxeFirstHitPlus);
    if (random01(seed + 3) < state.passives.pickaxeFirstHitPlus % 1) damage += 1;
    damage += activeRewardNumber(state, 'PICKAXE_FIRST_SMASH_REWARD', 'firstHitPlus');
  }
  if (!cell.firstHitLanded && isOreBlock(cell.blockType)) {
    damage += Math.floor(state.passives.pickaxeOreCrackPlus);
    damage += activeRewardNumber(state, 'PICKAXE_ORE_CHISEL_REWARD', 'oreFirstHitPlus');
  }
  const heavyChance =
    activeRewardNumber(state, 'PICKAXE_HEAVY_PICK', 'extraCrackChance') || state.tuning.rewards.heavyPickExtraCrackChance;
  if (currentFaceEffects(state).some((effect) => effect.effectKey === 'PICKAXE_HEAVY_PICK') && random01(seed + 4) < heavyChance) {
    damage += 1;
  }
  if (currentFaceEffects(state).some((effect) => effect.effectKey === 'GLOVES_CRACK_BURST') && (state.totalHits + 1) % 5 === 0) {
    damage += 1;
  }
  if (faceHitCount < activeRewardNumber(state, 'GLOVES_FOCUSED_GRIP', 'firstHits')) {
    damage += activeRewardNumber(state, 'GLOVES_FOCUSED_GRIP', 'crackPlus');
  }
  const steadyEvery = activeRewardNumber(state, 'GLOVES_STEADY_OPENING', 'everyHits');
  if (steadyEvery > 0 && (faceHitCount + 1) % steadyEvery === 0) {
    damage += activeRewardNumber(state, 'GLOVES_STEADY_OPENING', 'crackPlus');
  }
  const firmChance = activeRewardNumber(state, 'GLOVES_FIRM_GRIP', 'chance');
  if (firmChance > 0 && random01(seed + 5) < firmChance) {
    damage += activeRewardNumber(state, 'GLOVES_FIRM_GRIP', 'crackPlus');
  }
  if (faceHitCount === 0) {
    damage += activeRewardNumber(state, 'GLOVES_PERFECT_SWING', 'firstTargetCrack');
  }
  const debrisEvery = activeRewardNumber(state, 'GLOVES_DEBRIS_CLEAR_HANDS', 'everyHits');
  if (debrisEvery > 0 && (faceHitCount + 1) % debrisEvery === 0) {
    damage += activeRewardNumber(state, 'GLOVES_DEBRIS_CLEAR_HANDS', 'crackPlus');
  }
  return Math.max(1, damage);
}

function grantResourceForCell(state: GameState, cell: MiningCell): GameState {
  const oreBonusChance = isOreBlock(cell.blockType)
    ? state.passives.lanternOreBonusChance +
      activeRewardNumber(state, 'LANTERN_LAMP_SWEEP', 'oreBonusChance') +
      activeRewardNumber(state, 'LANTERN_GUIDING_GLOW', 'oreBonusChance') +
      (cell.resource === 'CRYSTAL' ? activeRewardNumber(state, 'LANTERN_CRYSTAL_SHINE', 'crystalBonusChance') : 0)
    : 0;
  const bonusChance = clamp(
    oreBonusChance + state.passives.deepCoreExtraMaterialChance,
    0,
    state.tuning.mining.maxBonusResourceChance
  );
  const bonus = random01(state.currentFace.seed + state.totalHits * 47 + cell.index) < bonusChance ? 1 : 0;
  const amount = state.tuning.mining.baseResourceAmount + bonus;
  const delta = createEmptyResources();
  delta[cell.resource] = amount;
  const bonusDelta = createEmptyResources();
  bonusDelta[cell.resource] = bonus;
  return addToast({
    ...state,
    resources: addResourceMaps(state.resources, delta),
    lifetimeMinedResources: addResourceMaps(state.lifetimeMinedResources, delta),
    bonusGainedResources: addResourceMaps(state.bonusGainedResources, bonusDelta),
    flyouts: [
      { id: state.totalHits + state.flyouts.length + 1, cellIndex: cell.index, resource: cell.resource, amount, createdAtMs: state.nowMs },
      ...state.flyouts
    ].slice(0, 16),
    firstMinute: {
      ...state.firstMinute,
      firstBlockBrokenAtMs: state.firstMinute.firstBlockBrokenAtMs ?? state.nowMs
    }
  }, resourceToast(cell.resource, amount));
}

function applyAdjacentCracks(state: GameState, cells: MiningCell[], index: number): MiningCell[] {
  const shouldBreakthrough = currentFaceEffects(state).some((effect) => effect.effectKey === 'PICKAXE_BREAKTHROUGH');
  const shouldBurst = currentFaceEffects(state).some((effect) => effect.effectKey === 'GLOVES_CRACK_BURST') && (state.totalHits + 1) % 5 === 0;
  const shouldHandsResonate = currentFaceEffects(state).some((effect) => effect.effectKey === 'GLOVES_RESONANT_HANDS');
  const shouldResonate = random01(state.currentFace.seed + state.totalHits * 59) < state.passives.glovesResonantBreakChance;
  if (!shouldBreakthrough && !shouldBurst && !shouldHandsResonate && !shouldResonate) return cells;
  const adjacent = getAdjacentCellIndices(index);
  return cells.map((cell) => (adjacent.includes(cell.index) ? crackCell(cell, 1, state.nowMs) : cell));
}

function applyFaceClearRewardEffects(state: GameState): GameState {
  const clearEffects = currentFaceClearEffects(state);
  if (clearEffects.length === 0) return state;

  const oreCells = state.currentFace.cells.filter((cell) => isOreBlock(cell.blockType));
  const delta = createEmptyResources();
  for (const effect of clearEffects) {
    if (effect.effectKey === 'LANTERN_HIDDEN_POCKET') {
      const resourceLines = Math.max(1, Number(effect.params.resourceLines ?? 1));
      for (let i = 0; i < resourceLines; i += 1) {
        const resource = oreCells[i % Math.max(1, oreCells.length)]?.resource ?? 'STONE';
        delta[resource] += 1;
      }
    }
    if (effect.effectKey === 'LANTERN_ORE_ECHO') {
      const chance = Number(effect.params.oreEchoChance ?? 0);
      for (const cell of oreCells) {
        if (random01(state.currentFace.seed + cell.index * 97 + state.clearedFaceCount) < chance) {
          delta[cell.resource] += 1;
        }
      }
    }
  }

  const gained = Object.values(delta).some((amount) => amount > 0);
  if (!gained) return state;
  return {
    ...state,
    resources: addResourceMaps(state.resources, delta),
    lifetimeMinedResources: addResourceMaps(state.lifetimeMinedResources, delta),
    bonusGainedResources: addResourceMaps(state.bonusGainedResources, delta)
  };
}

function applyImpact(state: GameState, targetCellIndex: number): GameState {
  const cell = state.currentFace.cells[targetCellIndex];
  if (!cell || cell.broken) return state;
  const damage = calculateHitDamage(state, cell);
  const updatedCell = {
    ...crackCell(cell, damage, state.nowMs),
    hitFlashUntilMs: state.nowMs + state.tuning.animation.targetHitFlashMs,
    dustUntilMs: state.nowMs + state.tuning.animation.targetDustMs
  };
  const brokeNow = !cell.broken && updatedCell.broken;
  let cells = state.currentFace.cells.map((item) => (item.index === targetCellIndex ? updatedCell : item));
  if (brokeNow) cells = applyAdjacentCracks(state, cells, targetCellIndex);
  let next: GameState = {
    ...state,
    currentFace: { ...state.currentFace, cells },
    totalHits: state.totalHits + 1
  };
  if (brokeNow) {
    next = grantResourceForCell(next, updatedCell);
  }
  if (isFaceCleared(next.currentFace)) {
    next = advanceAfterFaceClear(next);
  }
  return next;
}

function shouldOpenReward(state: GameState, facesSinceLastEncounter: number, newDepth: number): boolean {
  if (newDepth >= state.tuning.runtime.chapterClearDepthM) return false;
  if (facesSinceLastEncounter < state.tuning.rewards.minFacesBeforeEncounter) return false;
  if (facesSinceLastEncounter >= state.tuning.rewards.maxFacesBeforeEncounter) return true;
  return random01(state.currentFace.seed + facesSinceLastEncounter * 71) < state.tuning.rewards.encounterChancePerFace;
}

function advanceAfterFaceClear(state: GameState): GameState {
  const rewardedState = applyFaceClearRewardEffects(state);
  const newDepth = rewardedState.depth + 1;
  const transitionMs = rewardedState.settings.reducedMotion
    ? rewardedState.tuning.animation.reducedMotionFaceAdvanceTransitionMs
    : Math.max(
        rewardedState.tuning.animation.reducedMotionFaceAdvanceTransitionMs,
        Math.round(rewardedState.tuning.animation.faceAdvanceTransitionMs * (1 - rewardedState.passives.glovesDebrisClearSpeed))
      );
  const clearedFaceCount = rewardedState.clearedFaceCount + 1;
  const facesSinceLastEncounter = rewardedState.facesSinceLastEncounter + 1;
  const base: GameState = {
    ...rewardedState,
    depth: newDepth,
    maxDepth: Math.max(rewardedState.maxDepth, newDepth),
    clearedFaceCount,
    facesSinceLastEncounter,
    activeRewards: rewardedState.activeRewards.filter((effect) => effect.faceId !== rewardedState.currentFace.id),
    strike: null,
    targetCellIndex: null,
    targetScores: {},
    faceTransitionUntilMs: rewardedState.nowMs + transitionMs,
    saveRevision: rewardedState.saveRevision + 1,
    lastSaveReason: 'face-clear',
    firstMinute: {
      ...rewardedState.firstMinute,
      firstFaceClearedAtMs: rewardedState.firstMinute.firstFaceClearedAtMs ?? rewardedState.nowMs
    }
  };

  if (rewardedState.currentFace.faceType === 'DIAMOND_CORE' || newDepth > rewardedState.tuning.runtime.chapterClearDepthM) {
    const chapterReward = createEmptyResources();
    chapterReward.DIAMOND = rewardedState.currentFace.faceType === 'DIAMOND_CORE' ? 10 : 0;
    const chapterBase = chapterReward.DIAMOND > 0
      ? {
          ...base,
          resources: addResourceMaps(base.resources, chapterReward),
          lifetimeMinedResources: addResourceMaps(base.lifetimeMinedResources, chapterReward),
          rewardGainedResources: addResourceMaps(base.rewardGainedResources, chapterReward)
        }
      : base;
    return log(
      {
        ...chapterBase,
        activeOverlay: 'CHAPTER_CLEAR',
        chapterClearCompleted: true,
        saveRevision: chapterBase.saveRevision + 1,
        lastSaveReason: 'chapter-clear'
      },
      'progress',
      'Chapter Core cleared.'
    );
  }

  const nextFace = generateMiningFace(newDepth, rewardedState.currentFace.id + 1, rewardedState.tuning, rewardedState.passives);
  if (shouldOpenReward(rewardedState, facesSinceLastEncounter, newDepth)) {
    const withReward: GameState = {
      ...base,
      currentFace: nextFace,
      activeOverlay: 'REWARD_ENCOUNTER',
      rewardEncounter: createRewardEncounter(base, newDepth),
      facesSinceLastEncounter: 0,
      saveRevision: base.saveRevision + 1,
      lastSaveReason: 'reward-opened'
    };
    return log(withReward, 'reward', 'Reward Encounter opened.');
  }

  return log({ ...base, currentFace: nextFace }, 'mining', `Advanced to ${newDepth}m.`);
}

function forceClearFace(state: GameState): GameState {
  return advanceAfterFaceClear({
    ...state,
    currentFace: {
      ...state.currentFace,
      cells: state.currentFace.cells.map((cell) => ({
        ...cell,
        currentHits: cell.requiredHits,
        broken: true,
        dustUntilMs: state.nowMs + state.tuning.animation.targetDustMs
      }))
    }
  });
}

function applyRewardSelection(state: GameState, choice: RewardChoice): GameState {
  let next: GameState = { ...state };
  if (choice.kind === 'MATERIAL' && choice.resource && choice.amount) {
    const delta = createEmptyResources();
    delta[choice.resource] = choice.amount;
    if (random01(state.nowMs + choice.id) < state.passives.deepCoreMaterialFindChance) {
      delta.STONE += 1;
    }
    next = {
      ...next,
      resources: addResourceMaps(next.resources, delta),
      rewardGainedResources: addResourceMaps(next.rewardGainedResources, delta)
    };
  }

  const rewardEffect = rewardEffectFromChoice(choice, next.currentFace.id);
  const activeRewards = rewardEffect ? [...next.activeRewards, rewardEffect].slice(-4) : next.activeRewards;
  const startEffects = rewardEffect && rewardEffect.duration === 'NEXT_FACE_START' ? [rewardEffect] : [];
  const currentFace =
    startEffects.length > 0
      ? applyNextFaceStartEffects(next.currentFace, startEffects, next.tuning, next.passives, next.nowMs)
      : next.currentFace;
  const revealDuration = next.settings.reducedMotion
    ? next.tuning.animation.reducedMotionLanternRevealMs
    : clamp(
        next.tuning.animation.lanternRevealDurationMs,
        next.tuning.animation.lanternRevealMinMs,
        next.tuning.animation.lanternRevealMaxMs
      );

  return addToast(log(
    {
      ...next,
      currentFace,
      activeRewards,
      rewardEncounter: next.rewardEncounter ? { ...next.rewardEncounter, selectedId: choice.id } : null,
      activeOverlay: 'NONE',
      lanternRevealUntilMs: next.nowMs + revealDuration,
      faceTransitionUntilMs: 0,
      saveRevision: next.saveRevision + 1,
      lastSaveReason: 'reward-selected'
    },
    'reward',
    `Selected reward: ${choice.nameEn}.`
  ), {
    icon: '✦',
    messageKo: `보상 적용: ${choice.nameKo}`,
    messageEn: `Reward applied: ${choice.nameEn}`
  });
}

function unlockNode(state: GameState, nodeId: number): GameState {
  const node = getNodeById(nodeId);
  if (!node) return state;
  if (state.miningCore.activeNodeIds.includes(nodeId)) {
    return addToast(state, { icon: '◆', messageKo: '이미 해금됨', messageEn: 'Already unlocked' });
  }
  const parentActive = node.parents.every((parentId) => state.miningCore.activeNodeIds.includes(parentId));
  const cost = calculateNodeCost(node, state.tuning);
  if (!parentActive) {
    return addToast(state, { icon: '◆', messageKo: '조건 필요', messageEn: 'Requirement needed' });
  }
  if (!canAfford(state.resources, cost)) {
    return addToast(state, { icon: '◆', messageKo: '재료가 부족합니다', messageEn: 'Not enough materials' });
  }
  const activeNodeIds = [...state.miningCore.activeNodeIds, nodeId].sort((a, b) => a - b);
  const resources = subtractResourceMaps(state.resources, cost);
  const passives = calculatePassiveEffects(activeNodeIds, state.tuning);
  const next: GameState = {
    ...state,
    resources,
    lifetimeSpentResources: addResourceMaps(state.lifetimeSpentResources, cost),
    miningCore: {
      ...state.miningCore,
      activeNodeIds,
      nodeSpendRecords: { ...state.miningCore.nodeSpendRecords, [nodeId]: cost },
      selectedNodeId: nodeId
    },
    passives,
    saveRevision: state.saveRevision + 1,
    lastSaveReason: 'node-unlocked',
    firstMinute: {
      ...state.firstMinute,
      firstAffordableNodeAtMs: state.firstMinute.firstAffordableNodeAtMs ?? state.nowMs
    }
  };
  return addToast(log(next, 'upgrade', `Unlocked ${node.nameEn} (${node.id}).`), {
    icon: '◆',
    messageKo: '채굴 코어 해금',
    messageEn: 'Mining Core unlocked'
  });
}

function createOfflineSummary(save: SaveData, state: GameState, nowMs: number): { state: GameState; summary: OfflineSummary | null } {
  const elapsedSeconds = Math.max(0, Math.floor((nowMs - save.lastActiveAt) / 1000));
  if (!save.autoEnabled || elapsedSeconds < state.tuning.offline.minimumOfflineSeconds || save.pendingRewardEncounter) {
    return { state, summary: null };
  }
  const cappedSeconds = Math.min(elapsedSeconds, state.tuning.offline.maxOfflineSeconds);
  const efficiency = clamp(state.tuning.offline.offlineEfficiency + state.passives.deepCoreOfflineEfficiency, 0, state.tuning.caps.maxOfflineEfficiency);
  const possibleDepth = Math.floor(cappedSeconds * efficiency / state.tuning.progression.projectedAverageFaceClearSeconds);
  const offlineMaxDepth = getOfflineMaxDepthBeforeChapterCoreM(state.tuning);
  const maxDepthGain = Math.max(
    0,
    Math.min(state.tuning.offline.maxOfflineDepthAdvance + state.passives.deepCoreOfflineDepthCapM, offlineMaxDepth - state.depth)
  );
  const estimatedDepthGained = Math.max(0, Math.min(possibleDepth, maxDepthGain));
  const chapterBlocked = state.depth + possibleDepth >= state.tuning.runtime.chapterClearDepthM;
  const estimatedResources = createEmptyResources();
  estimatedResources.STONE = estimatedDepthGained * state.tuning.offline.baseOfflineResourcesPerDepth;
  estimatedResources.COAL = Math.floor(estimatedResources.STONE * 0.35);
  const nextDepth = Math.min(offlineMaxDepth, state.depth + estimatedDepthGained);
  const nextFace = nextDepth !== state.depth ? generateMiningFace(nextDepth, state.currentFace.id + 1, state.tuning, state.passives) : state.currentFace;
  const offlineState: GameState = {
    ...state,
    depth: nextDepth,
    maxDepth: Math.max(state.maxDepth, nextDepth),
    currentFace: nextFace,
    resources: addResourceMaps(state.resources, estimatedResources),
    lifetimeMinedResources: addResourceMaps(state.lifetimeMinedResources, estimatedResources),
    totalOfflineRewardedSeconds: state.totalOfflineRewardedSeconds + cappedSeconds,
    activeOverlay: estimatedDepthGained > 0 ? 'OFFLINE_REWARD' : state.activeOverlay,
    saveRevision: state.saveRevision + (estimatedDepthGained > 0 ? 1 : 0),
    lastSaveReason: estimatedDepthGained > 0 ? 'offline-reward' : state.lastSaveReason,
    saveStatusMessage: chapterBlocked ? 'Offline reward stopped before Chapter Core.' : state.saveStatusMessage
  };
  const withToast = estimatedDepthGained > 0
    ? addToast(offlineState, { icon: '✦', messageKo: '오프라인 보상 도착', messageEn: 'Offline reward arrived' })
    : offlineState;
  return {
    state: estimatedDepthGained > 0 ? log(withToast, 'offline', `Offline reward: +${estimatedDepthGained}m.`) : withToast,
    summary: {
      elapsedSeconds,
      cappedSeconds,
      estimatedDepthGained,
      estimatedResources,
      chapterBlocked,
      message: chapterBlocked ? 'Next active mining can discover the Chapter Core.' : 'Offline AUTO mining rewards applied.'
    }
  };
}

export function createFreshGameState(nowMs = Date.now()): GameState {
  const tuning = cloneDefaultTuning();
  const activeNodeIds = repairBaselineNodeIds([]);
  const passives = calculatePassiveEffects(activeNodeIds, tuning);
  const currentFace = generateMiningFace(0, 1, tuning, passives);
  return {
    nowMs,
    resources: createEmptyResources(),
    lifetimeMinedResources: createEmptyResources(),
    lifetimeSpentResources: createEmptyResources(),
    lifetimeRefundedResources: createEmptyResources(),
    rewardGainedResources: createEmptyResources(),
    bonusGainedResources: createEmptyResources(),
    depth: 0,
    maxDepth: 0,
    currentFace,
    clearedFaceCount: 0,
    facesSinceLastEncounter: 0,
    autoEnabled: true,
    miningPaused: false,
    activePanel: 'NONE',
    activeOverlay: 'NONE',
    targetCellIndex: null,
    forcedTargetCellIndex: null,
    targetScores: {},
    strike: null,
    activeRewards: [],
    rewardEncounter: null,
    lanternRevealUntilMs: nowMs + tuning.animation.lanternRevealDurationMs,
    faceTransitionUntilMs: 0,
    miningCore: {
      activeNodeIds,
      selectedNodeId: 0,
      nodeSpendRecords: {},
      focusedBranch: 'CENTER'
    },
    settings: defaultSettings(),
    debugOpen: false,
    tuning,
    passives,
    logs: [],
    flyouts: [],
    toasts: [],
    offlineSummary: null,
    sessionStartedAtMs: nowMs,
    totalHits: 0,
    totalActiveSeconds: 0,
    totalAutoMiningSeconds: 0,
    totalAutoOffSeconds: 0,
    totalRewardChoiceSeconds: 0,
    totalOfflineRewardedSeconds: 0,
    lastManualStrikeAtMs: 0,
    chapterClearCompleted: false,
    lastActiveAt: nowMs,
    saveRevision: 0,
    lastSaveReason: 'fresh',
    saveStatusMessage: '',
    firstMinute: {
      startedAtMs: nowMs,
      firstBlockBrokenAtMs: null,
      firstFaceClearedAtMs: null,
      firstAffordableNodeAtMs: null
    }
  };
}

export function createGameStateFromSave(save: SaveData | null, nowMs = Date.now()): GameState {
  if (!save) return createFreshGameState(nowMs);
  const defaults = cloneDefaultTuning();
  const tuning = save.tuning?.runtime
    ? {
        ...defaults,
        ...save.tuning,
        runtime: { ...defaults.runtime, ...save.tuning.runtime },
        mining: { ...defaults.mining, ...save.tuning.mining },
        animation: { ...defaults.animation, ...save.tuning.animation },
        generation: { ...defaults.generation, ...save.tuning.generation },
        rewards: { ...defaults.rewards, ...save.tuning.rewards },
        costs: { ...defaults.costs, ...save.tuning.costs },
        offline: { ...defaults.offline, ...save.tuning.offline },
        progression: { ...defaults.progression, ...save.tuning.progression },
        caps: { ...defaults.caps, ...save.tuning.caps },
        requiredHits: { ...defaults.requiredHits, ...save.tuning.requiredHits },
        nodeEffectValues: { ...defaults.nodeEffectValues, ...save.tuning.nodeEffectValues }
      }
    : defaults;
  const activeNodeIds = repairBaselineNodeIds(save.activeNodeIds);
  const passives = calculatePassiveEffects(activeNodeIds, tuning);
  const base: GameState = {
    ...createFreshGameState(nowMs),
    resources: save.resources,
    lifetimeMinedResources: save.lifetimeMinedResources,
    lifetimeSpentResources: save.lifetimeSpentResources,
    lifetimeRefundedResources: save.lifetimeRefundedResources,
    rewardGainedResources: save.rewardGainedResources,
    bonusGainedResources: save.bonusGainedResources,
    depth: save.depth,
    maxDepth: save.maxDepth,
    currentFace: save.currentFace,
    clearedFaceCount: save.clearedFaceCount,
    facesSinceLastEncounter: save.facesSinceLastEncounter,
    autoEnabled: save.autoEnabled,
    activeOverlay: save.pendingRewardEncounter ? 'REWARD_ENCOUNTER' : 'NONE',
    rewardEncounter: save.pendingRewardEncounter,
    activeRewards: save.activeRewards,
    miningCore: {
      activeNodeIds,
      selectedNodeId: activeNodeIds[activeNodeIds.length - 1] ?? 0,
      nodeSpendRecords: save.nodeSpendRecords,
      focusedBranch: 'CENTER'
    },
    settings: save.settings,
    debugOpen: false,
    tuning,
    passives,
    totalActiveSeconds: save.playtimeSeconds,
    totalAutoMiningSeconds: save.totalAutoMiningSeconds,
    totalAutoOffSeconds: save.totalAutoOffSeconds,
    totalRewardChoiceSeconds: save.totalRewardChoiceSeconds,
    totalOfflineRewardedSeconds: save.totalOfflineRewardedSeconds,
    lastManualStrikeAtMs: 0,
    chapterClearCompleted: save.chapterClearCompleted,
    lastActiveAt: save.lastActiveAt,
    saveStatusMessage: 'Save loaded.'
  };
  const offline = createOfflineSummary(save, base, nowMs);
  return { ...offline.state, offlineSummary: offline.summary };
}

export function createSaveData(state: GameState): SaveData {
  return {
    version: SAVE_VERSION,
    createdAt: state.firstMinute.startedAtMs,
    updatedAt: Date.now(),
    resources: state.resources,
    lifetimeMinedResources: state.lifetimeMinedResources,
    lifetimeSpentResources: state.lifetimeSpentResources,
    lifetimeRefundedResources: state.lifetimeRefundedResources,
    rewardGainedResources: state.rewardGainedResources,
    bonusGainedResources: state.bonusGainedResources,
    depth: state.depth,
    maxDepth: state.maxDepth,
    clearedFaceCount: state.clearedFaceCount,
    facesSinceLastEncounter: state.facesSinceLastEncounter,
    autoEnabled: state.autoEnabled,
    activeNodeIds: state.miningCore.activeNodeIds,
    nodeSpendRecords: state.miningCore.nodeSpendRecords,
    currentFace: state.currentFace,
    pendingRewardEncounter: state.rewardEncounter,
    activeRewards: state.activeRewards,
    settings: state.settings,
    tuning: state.tuning,
    playtimeSeconds: state.totalActiveSeconds,
    totalAutoMiningSeconds: state.totalAutoMiningSeconds,
    totalAutoOffSeconds: state.totalAutoOffSeconds,
    totalRewardChoiceSeconds: state.totalRewardChoiceSeconds,
    totalOfflineRewardedSeconds: state.totalOfflineRewardedSeconds,
    chapterClearCompleted: state.chapterClearCompleted,
    lastActiveAt: Date.now()
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK': {
      let next: GameState = {
        ...state,
        nowMs: action.nowMs,
        flyouts: keepRecentByCreatedAt(state.flyouts, action.nowMs, 1200),
        toasts: keepRecentByCreatedAt(state.toasts, action.nowMs, 1800),
        totalActiveSeconds: state.totalActiveSeconds + Math.max(0, (action.nowMs - state.nowMs) / 1000),
        totalAutoMiningSeconds:
          state.totalAutoMiningSeconds + (state.autoEnabled && state.activeOverlay === 'NONE' ? Math.max(0, (action.nowMs - state.nowMs) / 1000) : 0),
        totalAutoOffSeconds:
          state.totalAutoOffSeconds + (!state.autoEnabled ? Math.max(0, (action.nowMs - state.nowMs) / 1000) : 0),
        totalRewardChoiceSeconds:
          state.totalRewardChoiceSeconds + (state.activeOverlay === 'REWARD_ENCOUNTER' ? Math.max(0, (action.nowMs - state.nowMs) / 1000) : 0)
      };
      if (
        next.activeOverlay === 'REWARD_ENCOUNTER' &&
        next.rewardEncounter &&
        next.tuning.rewards.rewardAutoPickEnabled &&
        action.nowMs - next.rewardEncounter.openedAtMs >= next.tuning.rewards.rewardChoiceTimeoutMs
      ) {
        return applyRewardSelection(next, getAutoRewardChoice(next.rewardEncounter, next.tuning.rewards.rewardAutoPickStrategy));
      }
      const blocked =
        !next.autoEnabled ||
        next.miningPaused ||
        next.activeOverlay !== 'NONE' ||
        next.activePanel !== 'NONE' ||
        action.nowMs < next.faceTransitionUntilMs ||
        action.nowMs < next.lanternRevealUntilMs;
      if (next.strike) {
        const strike = updateStrikePhase(next.strike, action.nowMs, next.tuning);
        next = { ...next, strike };
        if (!strike.impactApplied && strike.targetCellIndex !== null && action.nowMs >= strike.impactAtMs) {
          next = applyImpact({ ...next, strike: { ...strike, impactApplied: true } }, strike.targetCellIndex);
        }
        if (next.strike && action.nowMs >= next.strike.endsAtMs) {
          next = { ...next, strike: null };
        }
        return next;
      }
      if (blocked) return next;
      const { cellIndex, scores } = selectTarget(next);
      if (cellIndex === null) return { ...next, targetScores: scores };
      return startStrike({ ...next, targetScores: scores }, action.nowMs, cellIndex);
    }
    case 'TOGGLE_AUTO':
      return { ...state, autoEnabled: !state.autoEnabled, saveRevision: state.saveRevision + 1, lastSaveReason: 'auto-toggle' };
    case 'SET_PANEL':
      if (action.panel === 'NONE') {
        return { ...state, activePanel: 'NONE' };
      }
      return {
        ...state,
        activePanel: action.panel,
        miningCore: action.branch ? { ...state.miningCore, focusedBranch: action.branch } : state.miningCore
      };
    case 'SET_DEBUG_OPEN':
      return { ...state, debugOpen: action.open };
    case 'TOGGLE_DEBUG':
      return { ...state, debugOpen: !state.debugOpen };
    case 'SELECT_NODE':
      return { ...state, miningCore: { ...state.miningCore, selectedNodeId: action.nodeId } };
    case 'UNLOCK_NODE':
      return unlockNode(state, action.nodeId);
    case 'SET_TUNING_NUMBER': {
      const tuning = setTuningNumber(state.tuning, action.path, action.value);
      const passives = calculatePassiveEffects(state.miningCore.activeNodeIds, tuning);
      return { ...state, tuning, passives, saveRevision: state.saveRevision + 1, lastSaveReason: 'tuning-change' };
    }
    case 'SET_REWARD_AUTO_PICK_ENABLED':
      return {
        ...state,
        tuning: { ...state.tuning, rewards: { ...state.tuning.rewards, rewardAutoPickEnabled: action.enabled } },
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'tuning-change'
      };
    case 'SET_REWARD_AUTO_PICK_STRATEGY':
      return {
        ...state,
        tuning: { ...state.tuning, rewards: { ...state.tuning.rewards, rewardAutoPickStrategy: action.strategy } },
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'tuning-change'
      };
    case 'SET_MANUAL_MINING_ENABLED':
      return {
        ...state,
        tuning: { ...state.tuning, mining: { ...state.tuning.mining, manualMiningEnabled: action.enabled } },
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'tuning-change'
      };
    case 'SET_SETTING':
      return {
        ...state,
        settings: { ...state.settings, [action.key]: action.value },
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'settings-change'
      };
    case 'MANUAL_CELL_STRIKE':
      return requestManualStrike(state, action.cellIndex, action.nowMs);
    case 'SELECT_REWARD': {
      const choice = state.rewardEncounter?.choices.find((reward) => reward.id === action.rewardId);
      return choice ? applyRewardSelection(state, choice) : state;
    }
    case 'CLEAR_FACE':
      return forceClearFace(state);
    case 'GENERATE_FACE':
      return {
        ...state,
        currentFace: generateMiningFace(state.depth, state.currentFace.id + 1, state.tuning, state.passives),
        strike: null,
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'debug-generate-face'
      };
    case 'STEP_HIT': {
      const { cellIndex, scores } = selectTarget(state);
      return cellIndex === null ? { ...state, targetScores: scores } : applyImpact({ ...state, targetScores: scores, nowMs: Date.now() }, cellIndex);
    }
    case 'SET_DEPTH': {
      const depth = Math.max(0, Math.floor(action.depth));
      return {
        ...state,
        depth,
        maxDepth: Math.max(state.maxDepth, depth),
        currentFace: generateMiningFace(depth, state.currentFace.id + 1, state.tuning, state.passives),
        strike: null,
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'debug-set-depth'
      };
    }
    case 'ADD_RESOURCE': {
      const delta = createEmptyResources();
      delta[action.resource] = action.amount;
      return { ...state, resources: addResourceMaps(state.resources, delta), saveRevision: state.saveRevision + 1, lastSaveReason: 'debug-add-resource' };
    }
    case 'SET_RESOURCE':
      return {
        ...state,
        resources: { ...state.resources, [action.resource]: Math.max(0, Math.floor(action.amount)) },
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'debug-set-resource'
      };
    case 'ADD_ALL_RESOURCES': {
      const delta = createEmptyResources();
      for (const resource of Object.keys(delta) as ResourceId[]) delta[resource] = action.amount;
      return { ...state, resources: addResourceMaps(state.resources, delta), saveRevision: state.saveRevision + 1, lastSaveReason: 'debug-add-all-resources' };
    }
    case 'FORCE_TARGET':
      return { ...state, forcedTargetCellIndex: action.cellIndex };
    case 'OPEN_REWARD_NOW':
      return {
        ...state,
        activeOverlay: 'REWARD_ENCOUNTER',
        rewardEncounter: createRewardEncounter(state, state.depth),
        saveRevision: state.saveRevision + 1,
        lastSaveReason: 'debug-open-reward'
      };
    case 'CLOSE_REWARD':
      return { ...state, activeOverlay: 'NONE', rewardEncounter: null, saveRevision: state.saveRevision + 1, lastSaveReason: 'debug-close-reward' };
    case 'PAUSE_TOGGLE':
      return { ...state, miningPaused: !state.miningPaused };
    case 'RESET_FRESH':
      return createFreshGameState(action.nowMs);
    case 'CLEAR_SAVE_STATUS':
      return { ...state, saveStatusMessage: '', offlineSummary: null, activeOverlay: state.activeOverlay === 'OFFLINE_REWARD' ? 'NONE' : state.activeOverlay };
    default:
      return state;
  }
}

export function getAffordableNodeCount(state: GameState): number {
  return MINING_CORE_NODES.filter((node) => {
    if (state.miningCore.activeNodeIds.includes(node.id)) return false;
    const parentsActive = node.parents.every((parentId) => state.miningCore.activeNodeIds.includes(parentId));
    return parentsActive && canAfford(state.resources, calculateNodeCost(node, state.tuning));
  }).length;
}

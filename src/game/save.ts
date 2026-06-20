import { MINING_CORE_NODES } from '../data/miningCoreNodes';
import { webSaveStorage } from '../platform/saveStorage';
import { createEmptyResources, RESOURCE_IDS } from './constants';
import { repairBaselineNodeIds } from './miningCoreBaseline';
import { DEFAULT_TUNING } from './tuning';
import type {
  ActiveRewardEffect,
  BlockType,
  MiningFace,
  ResourceAmountMap,
  RewardChoice,
  RewardEncounter,
  SettingsState,
  TuningState,
  VisualAssetMode
} from './types';
import type { Language } from './types';

export const SAVE_KEY = 'endless-mine-save-v1';
export const SAVE_VERSION = 1;

const CURRENT_BLOCK_TYPES = new Set<BlockType>([
  'DIRT_BLOCK',
  'STONE_BLOCK',
  'COAL_ORE_BLOCK',
  'COPPER_ORE_BLOCK',
  'IRON_ORE_BLOCK',
  'GOLD_ORE_BLOCK',
  'CRYSTAL_ORE_BLOCK',
  'DIAMOND_ORE_BLOCK',
  'DIAMOND_CORE_BLOCK'
]);

export type SaveData = {
  version: number;
  createdAt: number;
  updatedAt: number;
  resources: ResourceAmountMap;
  lifetimeMinedResources: ResourceAmountMap;
  lifetimeSpentResources: ResourceAmountMap;
  lifetimeRefundedResources: ResourceAmountMap;
  rewardGainedResources: ResourceAmountMap;
  bonusGainedResources: ResourceAmountMap;
  depth: number;
  maxDepth: number;
  clearedFaceCount: number;
  facesSinceLastEncounter: number;
  autoEnabled: boolean;
  activeNodeIds: number[];
  nodeSpendRecords: Record<number, ResourceAmountMap>;
  currentFace: MiningFace;
  pendingRewardEncounter: RewardEncounter | null;
  activeRewards: ActiveRewardEffect[];
  settings: SettingsState;
  tuning: TuningState;
  playtimeSeconds: number;
  totalAutoMiningSeconds: number;
  totalAutoOffSeconds: number;
  totalRewardChoiceSeconds: number;
  totalOfflineRewardedSeconds: number;
  chapterClearCompleted: boolean;
  lastActiveAt: number;
};

export type LoadResult = {
  save: SaveData | null;
  warnings: string[];
  error: string | null;
};

function repairResources(input: unknown, warnings: string[], label: string): ResourceAmountMap {
  const source = typeof input === 'object' && input !== null ? (input as Partial<ResourceAmountMap>) : {};
  const next = createEmptyResources();
  for (const resource of RESOURCE_IDS) {
    const value = Number(source[resource]);
    if (!Number.isFinite(value) || value < 0) {
      if (source[resource] !== undefined) warnings.push(`${label}.${resource} repaired`);
      next[resource] = 0;
    } else {
      next[resource] = Math.floor(value);
    }
  }
  return next;
}

function validVisualAssetMode(value: unknown): VisualAssetMode {
  return value === 'IMAGE' || value === 'AUTO' || value === 'GENERATED' ? value : 'GENERATED';
}

function validLanguage(value: unknown): Language {
  return value === 'en' || value === 'ko' ? value : 'ko';
}

function repairSettings(input: unknown): SettingsState {
  const source = typeof input === 'object' && input !== null ? (input as Partial<SettingsState>) : {};
  return {
    language: validLanguage(source.language),
    reducedMotion: Boolean(source.reducedMotion),
    masterVolume: Math.min(1, Math.max(0, Number(source.masterVolume ?? 0.8))),
    sfxVolume: Math.min(1, Math.max(0, Number(source.sfxVolume ?? 0.8))),
    muted: Boolean(source.muted),
    visualAssetMode: validVisualAssetMode(source.visualAssetMode)
  };
}

function repairRewardEncounter(input: unknown, warnings: string[]): RewardEncounter | null {
  if (typeof input !== 'object' || input === null) return null;
  const source = input as Partial<RewardEncounter>;
  if (!Array.isArray(source.choices) || source.choices.length !== 2) return null;
  if (!Number.isFinite(Number(source.openedAtMs))) warnings.push('pendingRewardEncounter.openedAtMs repaired');
  return {
    id: Math.max(1, Math.floor(Number(source.id) || 1)),
    openedAtDepth: Math.max(0, Math.floor(Number(source.openedAtDepth) || 0)),
    openedAtMs: Number.isFinite(Number(source.openedAtMs)) ? Number(source.openedAtMs) : Date.now(),
    choices: source.choices as [RewardChoice, RewardChoice],
    selectedId: source.selectedId ?? null
  };
}

function repairNodeIds(input: unknown, warnings: string[]): number[] {
  const validIds = new Set(MINING_CORE_NODES.map((node) => node.id));
  const raw = Array.isArray(input) ? input : [];
  const ids = repairBaselineNodeIds(raw.map(Number).filter((id) => Number.isFinite(id) && validIds.has(id)));
  if (ids.length !== raw.length) warnings.push('activeNodeIds repaired');
  return ids;
}

function repairFace(input: unknown, warnings: string[]): MiningFace | null {
  if (typeof input !== 'object' || input === null) return null;
  const face = input as MiningFace;
  if (!Array.isArray(face.cells) || face.cells.length !== 9) return null;
  const cells = face.cells.map((cell, index) => {
    const blockType = CURRENT_BLOCK_TYPES.has(cell.blockType as BlockType) ? (cell.blockType as BlockType) : 'STONE_BLOCK';
    const defaultRequiredHits = DEFAULT_TUNING.requiredHits[blockType as keyof typeof DEFAULT_TUNING.requiredHits] ?? 1;
    const requiredHits = Math.max(1, Math.floor(Number(cell.requiredHits) || defaultRequiredHits));
    const currentHits = Math.min(requiredHits, Math.max(0, Math.floor(Number(cell.currentHits) || 0)));
    const broken = Boolean(cell.broken) || currentHits >= requiredHits;
    if (cell.currentHits !== currentHits) warnings.push(`currentFace.cells.${index}.currentHits repaired`);
    return {
      ...cell,
      blockType,
      index,
      requiredHits,
      currentHits: broken ? requiredHits : currentHits,
      broken
    };
  });
  return {
    ...face,
    id: Math.max(1, Math.floor(Number(face.id) || 1)),
    seed: Math.floor(Number(face.seed) || 1337),
    depth: Math.max(0, Math.floor(Number(face.depth) || 0)),
    cells
  };
}

export function migrateAndRepairSave(raw: unknown): LoadResult {
  const warnings: string[] = [];
  if (typeof raw !== 'object' || raw === null) {
    return { save: null, warnings, error: 'Save root is not an object.' };
  }
  const source = raw as Partial<SaveData>;
  if (source.version !== SAVE_VERSION) {
    warnings.push(`save.version repaired to ${SAVE_VERSION}`);
  }
  const currentFace = repairFace(source.currentFace, warnings);
  if (!currentFace) {
    return { save: null, warnings, error: 'Current face could not be repaired.' };
  }

  const createdAt = Number(source.createdAt);
  const updatedAt = Number(source.updatedAt);
  const depth = Math.max(0, Math.floor(Number(source.depth) || 0));
  const maxDepth = Math.max(depth, Math.floor(Number(source.maxDepth) || depth));
  const activeNodeIds = repairNodeIds(source.activeNodeIds, warnings);

  return {
    save: {
      version: SAVE_VERSION,
      createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
      updatedAt: Number.isFinite(updatedAt) ? updatedAt : Date.now(),
      resources: repairResources(source.resources, warnings, 'resources'),
      lifetimeMinedResources: repairResources(source.lifetimeMinedResources, warnings, 'lifetimeMinedResources'),
      lifetimeSpentResources: repairResources(source.lifetimeSpentResources, warnings, 'lifetimeSpentResources'),
      lifetimeRefundedResources: repairResources(source.lifetimeRefundedResources, warnings, 'lifetimeRefundedResources'),
      rewardGainedResources: repairResources(source.rewardGainedResources, warnings, 'rewardGainedResources'),
      bonusGainedResources: repairResources(source.bonusGainedResources, warnings, 'bonusGainedResources'),
      depth,
      maxDepth,
      clearedFaceCount: Math.max(0, Math.floor(Number(source.clearedFaceCount) || 0)),
      facesSinceLastEncounter: Math.max(0, Math.floor(Number(source.facesSinceLastEncounter) || 0)),
      autoEnabled: source.autoEnabled !== undefined ? Boolean(source.autoEnabled) : true,
      activeNodeIds,
      nodeSpendRecords: source.nodeSpendRecords ?? {},
      currentFace,
      pendingRewardEncounter: repairRewardEncounter(source.pendingRewardEncounter, warnings),
      activeRewards: Array.isArray(source.activeRewards) ? source.activeRewards : [],
      settings: repairSettings(source.settings),
      tuning: source.tuning as TuningState,
      playtimeSeconds: Math.max(0, Number(source.playtimeSeconds) || 0),
      totalAutoMiningSeconds: Math.max(0, Number(source.totalAutoMiningSeconds) || 0),
      totalAutoOffSeconds: Math.max(0, Number(source.totalAutoOffSeconds) || 0),
      totalRewardChoiceSeconds: Math.max(0, Number(source.totalRewardChoiceSeconds) || 0),
      totalOfflineRewardedSeconds: Math.max(0, Number(source.totalOfflineRewardedSeconds) || 0),
      chapterClearCompleted: Boolean(source.chapterClearCompleted),
      lastActiveAt: Math.max(0, Number(source.lastActiveAt) || Date.now())
    },
    warnings,
    error: null
  };
}

export function loadGameSave(): LoadResult {
  const raw = webSaveStorage.read(SAVE_KEY);
  if (!raw) return { save: null, warnings: [], error: null };
  try {
    return migrateAndRepairSave(JSON.parse(raw));
  } catch {
    return { save: null, warnings: [], error: 'Save JSON parse failed.' };
  }
}

export function writeGameSave(save: SaveData): void {
  webSaveStorage.write(SAVE_KEY, JSON.stringify({ ...save, updatedAt: Date.now() }));
}

export function clearGameSave(): void {
  webSaveStorage.remove(SAVE_KEY);
}

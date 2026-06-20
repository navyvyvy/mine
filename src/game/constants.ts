import type { ResourceAmountMap, ResourceId } from './types';

export const RESOURCE_IDS: ResourceId[] = [
  'STONE',
  'COAL',
  'COPPER',
  'IRON',
  'GOLD',
  'CRYSTAL',
  'DIAMOND'
];

export const RESOURCE_LABELS: Record<ResourceId, { name: string; short: string }> = {
  STONE: { name: 'Stone', short: 'Stone' },
  COAL: { name: 'Coal', short: 'Coal' },
  COPPER: { name: 'Copper', short: 'Copper' },
  IRON: { name: 'Iron', short: 'Iron' },
  GOLD: { name: 'Gold', short: 'Gold' },
  CRYSTAL: { name: 'Crystal', short: 'Crystal' },
  DIAMOND: { name: 'Diamond', short: 'Diamond' }
};

export const RESOURCE_PRIORITY: Record<ResourceId, number> = {
  STONE: 0,
  COAL: 20,
  COPPER: 30,
  IRON: 40,
  GOLD: 50,
  CRYSTAL: 65,
  DIAMOND: 90
};

export const EMPTY_RESOURCES: ResourceAmountMap = {
  STONE: 0,
  COAL: 0,
  COPPER: 0,
  IRON: 0,
  GOLD: 0,
  CRYSTAL: 0,
  DIAMOND: 0
};

export function createEmptyResources(): ResourceAmountMap {
  return { ...EMPTY_RESOURCES };
}

export function addResourceMaps(a: ResourceAmountMap, b: Partial<ResourceAmountMap>): ResourceAmountMap {
  const next = createEmptyResources();
  for (const resource of RESOURCE_IDS) {
    next[resource] = Math.max(0, (a[resource] ?? 0) + (b[resource] ?? 0));
  }
  return next;
}

export function subtractResourceMaps(a: ResourceAmountMap, b: Partial<ResourceAmountMap>): ResourceAmountMap {
  const next = createEmptyResources();
  for (const resource of RESOURCE_IDS) {
    next[resource] = Math.max(0, (a[resource] ?? 0) - (b[resource] ?? 0));
  }
  return next;
}

export function canAfford(resources: ResourceAmountMap, cost: Partial<ResourceAmountMap>): boolean {
  return RESOURCE_IDS.every((resource) => (resources[resource] ?? 0) >= (cost[resource] ?? 0));
}

export function missingResources(resources: ResourceAmountMap, cost: Partial<ResourceAmountMap>): ResourceAmountMap {
  const missing = createEmptyResources();
  for (const resource of RESOURCE_IDS) {
    missing[resource] = Math.max(0, (cost[resource] ?? 0) - (resources[resource] ?? 0));
  }
  return missing;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h >= 99) return '99h+';
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function random01(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return x - Math.floor(x);
}

export function pickWeighted<T extends string>(weights: Record<T, number>, seed: number): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, weight]) => sum + Math.max(0, weight), 0);
  let cursor = random01(seed) * total;
  for (const [key, weight] of entries) {
    cursor -= Math.max(0, weight);
    if (cursor <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

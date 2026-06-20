import { MINING_CORE_NODES } from '../data/miningCoreNodes';
import type { MiningCoreBranch, MiningCoreNodeData } from '../data/miningCoreNodes';
import { canAfford, createEmptyResources, missingResources, RESOURCE_IDS, subtractResourceMaps } from './constants';
import { BASELINE_NODE_IDS } from './miningCoreBaseline';
import type { GameState, MiningCoreNodeView, ResourceAmountMap, ResourceId, TuningState } from './types';

const COST_PRESET_RESOURCES: Record<string, ResourceId[]> = {
  FREE: [],
  C1: ['STONE', 'COAL'],
  C2: ['STONE', 'COAL', 'COPPER'],
  C3: ['STONE', 'COAL', 'COPPER', 'IRON'],
  C4: ['STONE', 'COAL', 'COPPER', 'IRON', 'GOLD'],
  C5: ['STONE', 'COAL', 'COPPER', 'IRON', 'GOLD', 'CRYSTAL'],
  C6: ['STONE', 'COAL', 'COPPER', 'IRON', 'GOLD', 'CRYSTAL', 'DIAMOND']
};

export function getCostPresetResources(costPreset: string): ResourceId[] {
  return COST_PRESET_RESOURCES[costPreset] ?? RESOURCE_IDS;
}

export function calculateNodeCost(node: MiningCoreNodeData, tuning: TuningState): ResourceAmountMap {
  const cost = createEmptyResources();
  if (node.costPreset === 'FREE' || BASELINE_NODE_IDS.includes(node.id as (typeof BASELINE_NODE_IDS)[number])) return cost;

  const budget = tuning.costs.costPresetBudgets[node.costPreset] ?? tuning.costs.costPresetBudgets.C1;
  const multiplier = tuning.costs.rarityMultipliers[node.rarity] ?? 1;
  const slotScale = node.slot === null ? 1 : 1 + Math.floor(node.slot / 8) * 0.16;
  const total = Math.max(1, Math.round(budget * multiplier * slotScale));
  const allowedResources = getCostPresetResources(node.costPreset);
  const branchWeights = tuning.costs.branchResourceWeights[node.branch] ?? {};
  const availableWeights = allowedResources.map((resource) => [resource, branchWeights[resource] ?? 0.05] as const);
  const weightTotal = availableWeights.reduce((sum, [, weight]) => sum + weight, 0);

  let allocated = 0;
  for (const [index, [resource, weight]] of availableWeights.entries()) {
    const amount = index === availableWeights.length - 1 ? total - allocated : Math.max(0, Math.round(total * (weight / weightTotal)));
    cost[resource] = amount;
    allocated += amount;
  }
  return cost;
}

export function areParentsActive(node: MiningCoreNodeData, activeNodeIds: number[]): boolean {
  const activeSet = new Set(activeNodeIds);
  return node.parents.every((parentId) => activeSet.has(parentId));
}

export function getNodeView(node: MiningCoreNodeData, state: GameState): MiningCoreNodeView {
  const cost = calculateNodeCost(node, state.tuning);
  const active = state.miningCore.activeNodeIds.includes(node.id);
  const parentsActive = areParentsActive(node, state.miningCore.activeNodeIds);
  const affordable = canAfford(state.resources, cost);
  const nodeState = active ? 'ACTIVE' : parentsActive ? (affordable ? 'AFFORDABLE' : 'AVAILABLE') : 'LOCKED';
  return {
    node,
    state: nodeState,
    cost,
    missing: missingResources(state.resources, cost)
  };
}

export function spendForNode(state: GameState, node: MiningCoreNodeData): ResourceAmountMap {
  return subtractResourceMaps(state.resources, calculateNodeCost(node, state.tuning));
}

export function getNodeById(nodeId: number): MiningCoreNodeData | undefined {
  return MINING_CORE_NODES.find((node) => node.id === nodeId);
}

export function getBranchNodes(branch: MiningCoreBranch): MiningCoreNodeData[] {
  return MINING_CORE_NODES.filter((node) => node.branch === branch).sort((a, b) => a.id - b.id);
}

export function validateParentRelationships(): { invalid: number[]; parentless: number } {
  const ids = new Set(MINING_CORE_NODES.map((node) => node.id));
  const invalid = MINING_CORE_NODES.filter((node) => node.parents.some((parentId) => !ids.has(parentId))).map((node) => node.id);
  return {
    invalid,
    parentless: MINING_CORE_NODES.filter((node) => node.parents.length === 0).length
  };
}

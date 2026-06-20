export const BASELINE_NODE_IDS = [0, 1000, 2000, 3000, 4000] as const;

export function repairBaselineNodeIds(input: number[]): number[] {
  return Array.from(new Set([...BASELINE_NODE_IDS, ...input])).sort((a, b) => a - b);
}

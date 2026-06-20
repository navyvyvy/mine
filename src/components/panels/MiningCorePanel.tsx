import { useEffect, useMemo, useRef } from 'react';
import type { Dispatch, PointerEvent } from 'react';
import { ResourceIcon } from '../ResourceIcon';
import { MINING_CORE_BRANCH_COUNTS, MINING_CORE_NODES } from '../../data/miningCoreNodes';
import type { MiningCoreBranch, MiningCoreNodeData } from '../../data/miningCoreNodes';
import type { GameAction } from '../../game/state';
import { getNodeView } from '../../game/costs';
import { clamp, RESOURCE_IDS } from '../../game/constants';
import type { GameState, MiningCoreNodeView, ResourceAmountMap } from '../../game/types';
import { effectSummary, resourceName, t } from '../../i18n';

type Props = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

type BoardPoint = {
  x: number;
  y: number;
};

type BoardNode = {
  node: MiningCoreNodeData;
  point: BoardPoint;
};

type EdgeRole = 'spine' | 'side' | 'merge' | 'milestone' | 'capstone';

type EdgeRouteType =
  | 'straightShort'
  | 'straightLong'
  | 'softCurve'
  | 'singleElbowA'
  | 'singleElbowB'
  | 'doglegShort'
  | 'doglegLong'
  | 'steppedCrack'
  | 'shortHook'
  | 'mergeFork'
  | 'capstoneBridge';

const BRANCHES: MiningCoreBranch[] = ['CENTER', 'PICKAXE', 'LANTERN', 'GLOVES', 'DEEP_CORE'];
const BOARD_SIZE = 2240;
const BOARD_CENTER = BOARD_SIZE / 2;
const NODE_SPACING = 34;

const BRANCH_ROUTE_BIAS: Record<MiningCoreBranch, number> = {
  CENTER: 0,
  PICKAXE: 1,
  LANTERN: -1,
  GLOVES: 0.72,
  DEEP_CORE: -0.82
};

const BRANCH_EDGE_ROUTE_TYPES: Record<MiningCoreBranch, Record<EdgeRole, EdgeRouteType>> = {
  CENTER: {
    spine: 'straightShort',
    side: 'straightShort',
    merge: 'straightShort',
    milestone: 'straightShort',
    capstone: 'straightShort'
  },
  PICKAXE: {
    spine: 'singleElbowA',
    side: 'shortHook',
    merge: 'mergeFork',
    milestone: 'capstoneBridge',
    capstone: 'straightLong'
  },
  LANTERN: {
    spine: 'softCurve',
    side: 'singleElbowB',
    merge: 'softCurve',
    milestone: 'shortHook',
    capstone: 'softCurve'
  },
  GLOVES: {
    spine: 'doglegShort',
    side: 'steppedCrack',
    merge: 'mergeFork',
    milestone: 'doglegLong',
    capstone: 'doglegShort'
  },
  DEEP_CORE: {
    spine: 'straightLong',
    side: 'doglegLong',
    merge: 'capstoneBridge',
    milestone: 'straightLong',
    capstone: 'capstoneBridge'
  }
};

const BRANCH_ICONS: Record<MiningCoreBranch, string> = {
  CENTER: '◆',
  PICKAXE: '⛏',
  LANTERN: '✦',
  GLOVES: '✋',
  DEEP_CORE: '◇'
};

function branchTabLabel(branch: MiningCoreBranch, language: GameState['settings']['language']): string {
  if (branch === 'CENTER') return language === 'ko' ? '중앙' : 'Core';
  if (branch === 'PICKAXE') return language === 'ko' ? '곡괭이' : 'Pick';
  if (branch === 'LANTERN') return language === 'ko' ? '랜턴' : 'Lamp';
  if (branch === 'GLOVES') return language === 'ko' ? '장갑' : 'Glove';
  return language === 'ko' ? '심층' : 'Deep';
}

function CostLine({ cost, missing, language }: { cost: ResourceAmountMap; missing: ResourceAmountMap; language: GameState['settings']['language'] }) {
  const entries = RESOURCE_IDS.filter((resource) => cost[resource] > 0);
  if (entries.length === 0) return <span className="cost-line free">{t(language, 'core.free')}</span>;
  return (
    <span className="cost-line">
          {entries.map((resource) => (
            <span key={resource} className={missing[resource] > 0 ? 'missing-cost' : ''} title={resourceName(language, resource)}>
          <ResourceIcon resource={resource} size="tiny" /> {cost[resource]}
        </span>
      ))}
    </span>
  );
}

function displayNodeName(node: MiningCoreNodeData, language: GameState['settings']['language']): string {
  return language === 'ko' ? node.nameKo : node.nameEn;
}

function transformSlotPosition(branch: MiningCoreBranch, d: number, o: number): BoardPoint {
  if (branch === 'PICKAXE') return { x: d, y: o };
  if (branch === 'LANTERN') return { x: o, y: -d };
  if (branch === 'GLOVES') return { x: -d, y: o };
  if (branch === 'DEEP_CORE') return { x: o, y: d };
  return { x: 0, y: 0 };
}

function parseNodePosition(node: MiningCoreNodeData): BoardPoint {
  const pair = node.position.match(/^\((-?\d+),(-?\d+)\)$/);
  if (pair) return { x: Number(pair[1]), y: Number(pair[2]) };
  const slotPosition = node.position.match(/^d=(-?\d+),o=(-?\d+)$/);
  if (slotPosition) return transformSlotPosition(node.branch, Number(slotPosition[1]), Number(slotPosition[2]));
  return transformSlotPosition(node.branch, (node.slot ?? 0) + 1, 0);
}

function toBoardPoint(point: BoardPoint): BoardPoint {
  return {
    x: BOARD_CENTER + point.x * NODE_SPACING,
    y: BOARD_CENTER + point.y * NODE_SPACING
  };
}

function branchFocusPoint(branch: MiningCoreBranch, nodes: BoardNode[]): BoardPoint {
  const branchNodes = nodes.filter((node) => node.node.branch === branch);
  if (branchNodes.length === 0) return { x: BOARD_CENTER, y: BOARD_CENTER };
  const sum = branchNodes.reduce((acc, node) => ({ x: acc.x + node.point.x, y: acc.y + node.point.y }), { x: 0, y: 0 });
  return { x: sum.x / branchNodes.length, y: sum.y / branchNodes.length };
}

function nodeDepthScore(node: MiningCoreNodeData): number {
  const point = parseNodePosition(node);
  if (node.branch === 'PICKAXE') return point.x;
  if (node.branch === 'LANTERN') return -point.y;
  if (node.branch === 'GLOVES') return -point.x;
  if (node.branch === 'DEEP_CORE') return point.y;
  return 0;
}

function getEdgeRole(node: MiningCoreNodeData): EdgeRole {
  if (node.parents.length > 1) return 'merge';
  if (node.slot === 46) return 'capstone';
  if (node.slot !== null && node.slot > 0 && node.slot % 8 === 0) return 'milestone';
  if (node.slot !== null && node.slot % 3 === 0) return 'side';
  return 'spine';
}

function getRouteType(branch: MiningCoreBranch, role: EdgeRole): EdgeRouteType {
  return BRANCH_EDGE_ROUTE_TYPES[branch][role];
}

function pointAt(
  parent: BoardPoint,
  child: BoardPoint,
  t: number,
  lateral: number
): BoardPoint {
  const dx = child.x - parent.x;
  const dy = child.y - parent.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  return {
    x: parent.x + dx * t + px * lateral,
    y: parent.y + dy * t + py * lateral
  };
}

function buildEdgePath(parent: BoardPoint, child: BoardPoint, branch: MiningCoreBranch, role: EdgeRole): string {
  const dx = child.x - parent.x;
  const dy = child.y - parent.y;
  const len = Math.hypot(dx, dy) || 1;
  const routeType = getRouteType(branch, role);
  const branchBias = BRANCH_ROUTE_BIAS[branch] * (role === 'merge' ? 1.18 : role === 'milestone' ? 1.26 : role === 'side' ? 0.78 : 1);
  const lateral = clamp(len * 0.18 * branchBias, -96, 96);
  const sweep = lateral === 0 ? 18 : lateral;
  const sweepHalf = lateral * 0.5;

  switch (routeType) {
    case 'straightShort':
      return `M ${parent.x} ${parent.y} L ${child.x} ${child.y}`;
    case 'straightLong':
      return `M ${parent.x} ${parent.y} L ${child.x} ${child.y}`;
    case 'softCurve': {
      const c1 = pointAt(parent, child, 0.28, sweepHalf);
      const c2 = pointAt(parent, child, 0.72, sweepHalf * 0.8);
      return `M ${parent.x} ${parent.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${child.x} ${child.y}`;
    }
    case 'singleElbowA': {
      const p1 = pointAt(parent, child, 0.42, sweep * 0.26);
      const p2 = pointAt(parent, child, 0.74, sweep * 0.72);
      return `M ${parent.x} ${parent.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${child.x} ${child.y}`;
    }
    case 'singleElbowB': {
      const p1 = pointAt(parent, child, 0.34, -sweep * 0.34);
      const p2 = pointAt(parent, child, 0.8, -sweep * 0.14);
      return `M ${parent.x} ${parent.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${child.x} ${child.y}`;
    }
    case 'doglegShort': {
      const p1 = pointAt(parent, child, 0.26, 0);
      const p2 = pointAt(parent, child, 0.26, sweep * 0.7);
      const p3 = pointAt(parent, child, 0.76, sweep * 0.62);
      return `M ${parent.x} ${parent.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${child.x} ${child.y}`;
    }
    case 'doglegLong': {
      const p1 = pointAt(parent, child, 0.2, 0);
      const p2 = pointAt(parent, child, 0.2, sweep * 0.84);
      const p3 = pointAt(parent, child, 0.84, sweep * 0.76);
      return `M ${parent.x} ${parent.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${child.x} ${child.y}`;
    }
    case 'steppedCrack': {
      const p1 = pointAt(parent, child, 0.2, sweep * 0.2);
      const p2 = pointAt(parent, child, 0.38, -sweep * 0.42);
      const p3 = pointAt(parent, child, 0.58, sweep * 0.48);
      const p4 = pointAt(parent, child, 0.82, -sweep * 0.12);
      return `M ${parent.x} ${parent.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} L ${child.x} ${child.y}`;
    }
    case 'shortHook': {
      const p1 = pointAt(parent, child, 0.58, sweep * 0.34);
      const p2 = pointAt(parent, child, 0.82, sweep * 0.78);
      return `M ${parent.x} ${parent.y} L ${p1.x} ${p1.y} Q ${p2.x} ${p2.y} ${child.x} ${child.y}`;
    }
    case 'mergeFork': {
      const p1 = pointAt(parent, child, 0.28, sweep * 0.18);
      const p2 = pointAt(parent, child, 0.58, sweep * 0.94);
      const p3 = pointAt(parent, child, 0.82, sweep * 0.16);
      return `M ${parent.x} ${parent.y} L ${p1.x} ${p1.y} C ${p2.x} ${p2.y}, ${p3.x} ${p3.y}, ${child.x} ${child.y}`;
    }
    case 'capstoneBridge': {
      const p1 = pointAt(parent, child, 0.22, sweep * 0.22);
      const p2 = pointAt(parent, child, 0.7, sweep * 0.2);
      return `M ${parent.x} ${parent.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${child.x} ${child.y}`;
    }
    default:
      return `M ${parent.x} ${parent.y} L ${child.x} ${child.y}`;
  }
}

export function MiningCorePanel({ state, dispatch }: Props) {
  const language = state.settings.language;
  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, scrollLeft: 0, scrollTop: 0, moved: false });
  const initialCenteredRef = useRef(false);
  const selectedNode = MINING_CORE_NODES.find((node) => node.id === state.miningCore.selectedNodeId) ?? MINING_CORE_NODES[0];
  const selectedView = getNodeView(selectedNode, state);
  const activeSet = useMemo(() => new Set(state.miningCore.activeNodeIds), [state.miningCore.activeNodeIds]);
  const selectedDisplayName = displayNodeName(selectedNode, language);

  const boardNodes = useMemo<BoardNode[]>(
    () =>
      MINING_CORE_NODES.map((node) => ({
        node,
        point: toBoardPoint(parseNodePosition(node))
      })),
    []
  );

  const nodeById = useMemo(() => new Map(boardNodes.map((boardNode) => [boardNode.node.id, boardNode])), [boardNodes]);
  const viewById = useMemo(
    () => new Map(MINING_CORE_NODES.map((node) => [node.id, getNodeView(node, state)])),
    [state.resources, state.miningCore.activeNodeIds, state.tuning]
  );
  const nodeNameById = useMemo(() => new Map(MINING_CORE_NODES.map((node) => [node.id, displayNodeName(node, language)])), [language]);
  const missingParentNames = selectedNode.parents.filter((parentId) => !activeSet.has(parentId)).map((parentId) => nodeNameById.get(parentId) ?? '');
  const missingCostNames = RESOURCE_IDS.filter((resource) => selectedView.missing[resource] > 0).map((resource) => resourceName(language, resource));
  const conditionText =
    missingParentNames.length > 0
      ? t(language, 'core.conditionNeedParent', { name: missingParentNames[0] })
      : missingCostNames.length > 0
        ? t(language, 'core.conditionNeedResource', { name: missingCostNames[0] })
        : '';
  const stateBadgeText = t(language, selectedView.state === 'ACTIVE' ? 'core.badgeActive' : selectedView.state === 'AFFORDABLE' ? 'core.badgeAffordable' : selectedView.state === 'AVAILABLE' ? 'core.badgeAvailable' : 'core.badgeLocked');

  const getBranchProgressNode = (branch: MiningCoreBranch): MiningCoreNodeData => {
    if (branch === 'CENTER') return MINING_CORE_NODES[0];
    const views = MINING_CORE_NODES
      .filter((node) => node.branch === branch)
      .map((node) => getNodeView(node, state));
    const byDepth = (a: MiningCoreNodeView, b: MiningCoreNodeView) => nodeDepthScore(b.node) - nodeDepthScore(a.node);
    return (
      [...views].filter((view) => view.state === 'AFFORDABLE').sort(byDepth)[0]?.node ??
      [...views].filter((view) => view.state === 'ACTIVE').sort(byDepth)[0]?.node ??
      views[0]?.node ??
      MINING_CORE_NODES[0]
    );
  };

  const centerOnNode = (nodeId: number, behavior: ScrollBehavior = 'smooth') => {
    const viewport = boardViewportRef.current;
    if (!viewport) return;
    const focus = nodeById.get(nodeId)?.point ?? branchFocusPoint('CENTER', boardNodes);
    viewport.scrollTo({
      left: Math.max(0, focus.x - viewport.clientWidth / 2),
      top: Math.max(0, focus.y - viewport.clientHeight / 2),
      behavior
    });
  };

  const focusBranch = (branch: MiningCoreBranch, behavior: ScrollBehavior = 'smooth') => {
    const node = getBranchProgressNode(branch);
    dispatch({ type: 'SET_PANEL', panel: 'MINING_CORE', branch });
    dispatch({ type: 'SELECT_NODE', nodeId: node.id });
    window.requestAnimationFrame(() => centerOnNode(node.id, behavior));
  };

  useEffect(() => {
    if (initialCenteredRef.current) return;
    centerOnNode(getBranchProgressNode(state.miningCore.focusedBranch).id, 'auto');
    initialCenteredRef.current = true;
  }, [boardNodes]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = boardViewportRef.current;
    if (!viewport) return;
    dragRef.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
      moved: false
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = boardViewportRef.current;
    if (!viewport || !dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    if (!dragRef.current.moved && Math.abs(dx) + Math.abs(dy) <= 6) return;
    if (!dragRef.current.moved) {
      dragRef.current.moved = true;
      if (!viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    viewport.scrollLeft = dragRef.current.scrollLeft - dx;
    viewport.scrollTop = dragRef.current.scrollTop - dy;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = boardViewportRef.current;
    if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
  };

  const selectNode = (nodeId: number, ignoreDrag = false) => {
    if (!ignoreDrag && dragRef.current.moved) return;
    dispatch({ type: 'SELECT_NODE', nodeId });
  };

  return (
    <section className="panel mining-core-panel" aria-label={t(language, 'core.title')}>
      <header className="panel-header">
        <div>
          <h2>{t(language, 'core.title')}</h2>
          <p>{t(language, 'core.subtitle', { total: MINING_CORE_NODES.length, active: state.miningCore.activeNodeIds.length })}</p>
        </div>
        <div className="panel-actions">
          <button type="button" onClick={() => focusBranch(state.miningCore.focusedBranch)}>
            {t(language, 'core.resetView')}
          </button>
          <button type="button" onClick={() => dispatch({ type: 'SET_PANEL', panel: 'NONE' })}>
            {t(language, 'panel.close')}
          </button>
        </div>
      </header>
      <div className="branch-tabs" role="tablist" aria-label={t(language, 'core.title')}>
        {BRANCHES.map((branch) => (
          <button
            key={branch}
            type="button"
            className={branch === state.miningCore.focusedBranch ? 'is-active' : ''}
            onClick={() => focusBranch(branch)}
          >
            <span aria-hidden="true">{BRANCH_ICONS[branch]}</span>
            {branchTabLabel(branch, language)} <span>{MINING_CORE_BRANCH_COUNTS[branch]}</span>
          </button>
        ))}
      </div>
      <div className="mining-core-content">
        <div
          ref={boardViewportRef}
          className="core-board-viewport"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label={t(language, 'core.nodeBoard')}
        >
          <svg className="core-board" width={BOARD_SIZE} height={BOARD_SIZE} viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`} role="img" aria-label={t(language, 'core.nodeBoard')}>
            <defs>
              <radialGradient id="coreCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.82 0.13 78)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="oklch(0.42 0.13 353)" stopOpacity="0.12" />
              </radialGradient>
            </defs>
            <g className="core-link-layer">
              {boardNodes.flatMap((boardNode) =>
                boardNode.node.parents.map((parentId) => {
                  const parent = nodeById.get(parentId);
                  if (!parent) return null;
                  const unlocked = activeSet.has(boardNode.node.id) && activeSet.has(parentId);
                  const role = getEdgeRole(boardNode.node);
                  const routeType = getRouteType(boardNode.node.branch, role);
                  return (
                    <path
                      key={`${parentId}-${boardNode.node.id}`}
                      className={`core-link branch-${boardNode.node.branch.toLowerCase()} edge-role-${role} edge-route-${routeType} ${unlocked ? 'is-unlocked' : ''}`}
                      d={buildEdgePath(parent.point, boardNode.point, boardNode.node.branch, role)}
                    />
                  );
                })
              )}
            </g>
            <g className="core-node-layer">
              {boardNodes.map((boardNode) => {
                const view = viewById.get(boardNode.node.id) as MiningCoreNodeView;
                const selected = boardNode.node.id === selectedNode.id;
                const capstone = boardNode.node.slot === 46 || boardNode.node.id === 0;
                const nodeLabel = displayNodeName(boardNode.node, language);
                return (
                  <g
                    key={boardNode.node.id}
                    role="button"
                    tabIndex={0}
                    aria-label={nodeLabel}
                    className={`core-node branch-${boardNode.node.branch.toLowerCase()} state-${view.state.toLowerCase()} rarity-${boardNode.node.rarity.toLowerCase()} ${selected ? 'is-selected' : ''} ${capstone ? 'is-capstone' : ''}`}
                    transform={`translate(${boardNode.point.x} ${boardNode.point.y})`}
                    onClick={() => selectNode(boardNode.node.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') selectNode(boardNode.node.id, true);
                    }}
                  >
                    <circle r={boardNode.node.id === 0 ? 15 : capstone ? 10 : 7} />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        <aside className="node-detail" aria-label={t(language, 'core.selectedNode')}>
          <div className={`node-detail-title branch-${selectedNode.branch.toLowerCase()}`}>
            <span aria-hidden="true">{BRANCH_ICONS[selectedNode.branch]}</span>
            <h3>{selectedDisplayName}</h3>
            <strong className={`node-state-badge state-${selectedView.state.toLowerCase()}`}>{stateBadgeText}</strong>
          </div>
          <dl>
            <div>
              <dt>{t(language, 'core.effect')}</dt>
              <dd>{effectSummary(language, selectedNode.effectKey, state.passives.activeEffectValues[selectedNode.effectKey])}</dd>
            </div>
            <div>
              <dt>{t(language, 'core.cost')}</dt>
              <dd>
                <CostLine cost={selectedView.cost} missing={selectedView.missing} language={language} />
              </dd>
            </div>
            {conditionText && (
              <div>
                <dt>{t(language, 'core.condition')}</dt>
                <dd>{conditionText}</dd>
              </div>
            )}
          </dl>
          {selectedView.state !== 'ACTIVE' && (
            <button
              type="button"
              className="primary-action"
              disabled={selectedView.state !== 'AFFORDABLE'}
              onClick={() => dispatch({ type: 'UNLOCK_NODE', nodeId: selectedNode.id })}
            >
              {selectedView.state === 'AFFORDABLE' ? t(language, 'core.unlock') : selectedView.state === 'AVAILABLE' ? t(language, 'core.badgeAvailable') : t(language, 'core.badgeLocked')}
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}

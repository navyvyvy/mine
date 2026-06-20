import { blockResource, getCellDamageVisualStage, isOreBlock } from '../../game/face';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Flyout, MiningCell, MiningFace as MiningFaceData, PickaxeStrikeState, SettingsState, TuningState } from '../../game/types';
import { getMiningCellTargetPoint } from '../../game/targeting';
import { resourceName, t } from '../../i18n';
import { ResourceIcon } from '../ResourceIcon';
import { CellDamageOverlay } from './CellDamageOverlay';
import { MiningFaceWallOverlay } from './MiningFaceWallOverlay';
import { PickaxeLayer } from './PickaxeLayer';

type Props = {
  face: MiningFaceData;
  settings: SettingsState;
  tuning: TuningState;
  strike: PickaxeStrikeState | null;
  targetCellIndex: number | null;
  autoEnabled: boolean;
  manualMiningEnabled: boolean;
  debugOpen: boolean;
  flyouts: Flyout[];
  nowMs: number;
  lanternRevealActive: boolean;
  faceTransitionActive: boolean;
  onManualStrike: (cellIndex: number) => void;
};

type FaceGeometry = {
  targetPoint: ReturnType<typeof getMiningCellTargetPoint>;
  centerXPercent: number;
  centerYPercent: number;
};

function blockClass(cell: MiningCell): string {
  if (cell.blockType === 'DIRT_BLOCK') return 'block-dirt';
  if (cell.blockType === 'DIAMOND_CORE_BLOCK') return 'block-diamond-core';
  if (isOreBlock(cell.blockType)) return `block-ore block-${blockResource(cell.blockType).toLowerCase()}`;
  return 'block-stone';
}

function MiningCellView({
  cell,
  isTarget,
  isImpact,
  manualReady,
  debugOpen,
  nowMs,
  language,
  onManualStrike
}: {
  cell: MiningCell;
  isTarget: boolean;
  isImpact: boolean;
  manualReady: boolean;
  debugOpen: boolean;
  nowMs: number;
  language: SettingsState['language'];
  onManualStrike: (cellIndex: number) => void;
}) {
  const stage = getCellDamageVisualStage(cell.currentHits, cell.requiredHits);
  const flash = nowMs < cell.hitFlashUntilMs;
  const dust = nowMs < cell.dustUntilMs;
  return (
    <button
      type="button"
      className={`mining-cell ${blockClass(cell)} stage-${stage.toLowerCase()} ${isTarget ? 'is-target' : ''} ${manualReady ? 'is-manual-ready' : ''} ${isImpact ? 'is-impact' : ''} ${flash ? 'is-flashing' : ''}`}
      data-cell-index={cell.index}
      aria-label={`${resourceName(language, cell.resource)} ${cell.currentHits}/${cell.requiredHits}`}
      aria-disabled={!manualReady}
      tabIndex={manualReady ? 0 : -1}
      onClick={() => {
        if (manualReady) onManualStrike(cell.index);
      }}
    >
      <div className="cell-material" />
      {isOreBlock(cell.blockType) && <span className={`embedded-ore ore-stage-${stage.toLowerCase()}`} aria-hidden="true" />}
      <CellDamageOverlay cell={cell} />
      {dust && <span className="dust-burst" />}
      {debugOpen && (
        <>
          <span className="debug-cell-id">{cell.index}</span>
          {isTarget && (
            <>
              <span className="debug-target-rect" />
              <span className="debug-target-dot" />
            </>
          )}
        </>
      )}
    </button>
  );
}

export function MiningFace({
  face,
  settings,
  tuning,
  strike,
  targetCellIndex,
  autoEnabled,
  manualMiningEnabled,
  debugOpen,
  flyouts,
  nowMs,
  lanternRevealActive,
  faceTransitionActive,
  onManualStrike
}: Props) {
  const mainResource = face.cells.find((cell) => isOreBlock(cell.blockType))?.resource ?? 'STONE';
  const activeTargetIndex = strike?.targetCellIndex ?? targetCellIndex ?? 4;
  const fallbackTargetPoint = useMemo(() => getMiningCellTargetPoint(activeTargetIndex), [activeTargetIndex]);
  const stageRef = useRef<HTMLElement | null>(null);
  const faceGridRef = useRef<HTMLDivElement | null>(null);
  const [faceGeometry, setFaceGeometry] = useState<FaceGeometry>({
    targetPoint: fallbackTargetPoint,
    centerXPercent: 50,
    centerYPercent: 46
  });
  const manualReady = !autoEnabled && manualMiningEnabled && !strike && !lanternRevealActive && !faceTransitionActive;

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const grid = faceGridRef.current;
      if (!stage || !grid) {
        setFaceGeometry({ targetPoint: fallbackTargetPoint, centerXPercent: 50, centerYPercent: 46 });
        return;
      }
      const stageRect = stage.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      if (stageRect.width <= 0 || stageRect.height <= 0 || gridRect.width <= 0 || gridRect.height <= 0) return;
      const row = Math.floor(activeTargetIndex / 3);
      const col = activeTargetIndex % 3;
      const cellWidth = gridRect.width / 3;
      const cellHeight = gridRect.height / 3;
      const targetX = gridRect.left - stageRect.left + (col + 0.5) * cellWidth;
      const targetY = gridRect.top - stageRect.top + (row + 0.5) * cellHeight;
      const centerX = gridRect.left - stageRect.left + gridRect.width / 2;
      const centerY = gridRect.top - stageRect.top + gridRect.height / 2;
      setFaceGeometry({
        targetPoint: {
          ...fallbackTargetPoint,
          xPercent: (targetX / stageRect.width) * 100,
          yPercent: (targetY / stageRect.height) * 100
        },
        centerXPercent: (centerX / stageRect.width) * 100,
        centerYPercent: (centerY / stageRect.height) * 100
      });
    };

    measure();
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (resizeObserver) {
      if (stageRef.current) resizeObserver.observe(stageRef.current);
      if (faceGridRef.current) resizeObserver.observe(faceGridRef.current);
    }
    window.addEventListener('resize', measure);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [activeTargetIndex, face.id, fallbackTargetPoint]);

  return (
    <section
      ref={stageRef}
      className={`mining-stage ${strike ? 'has-strike' : ''} ${lanternRevealActive ? 'lantern-reveal-active' : ''} ${faceTransitionActive ? 'face-transition-active' : ''}`}
      style={{
        '--impact-shake': `${tuning.animation.pickaxeImpactShake}px`,
        '--face-center-x': `${faceGeometry.centerXPercent}%`,
        '--face-center-y': `${faceGeometry.centerYPercent}%`
      } as CSSProperties}
      aria-label={t(settings.language, 'aria.miningFace')}
    >
      <div className="mining-depth-shadow" />
      <div ref={faceGridRef} className="mining-face-grid">
        {face.cells.map((cell) => (
          <MiningCellView
            key={`${face.id}-${cell.index}`}
            cell={cell}
            isTarget={cell.index === targetCellIndex}
            isImpact={strike?.phase === 'IMPACT' && strike.targetCellIndex === cell.index}
            manualReady={manualReady && !cell.broken}
            debugOpen={debugOpen}
            nowMs={nowMs}
            language={settings.language}
            onManualStrike={onManualStrike}
          />
        ))}
        <MiningFaceWallOverlay pattern={face.pattern} mainResource={mainResource} />
        <div className="lantern-light" />
      </div>
      {flyouts.map((flyout) => (
        <span key={flyout.id} className={`resource-flyout flyout-cell-${flyout.cellIndex}`}>
          +{flyout.amount}
          <ResourceIcon resource={flyout.resource} size="tiny" />
        </span>
      ))}
      <div className="first-person-equipment" aria-label={t(settings.language, 'aria.heldEquipment')}>
        <div className="held-equipment held-lantern-button" aria-hidden="true">
          <span className="lantern-object" aria-hidden="true">
            <span className="lantern-handle" />
            <span className="lantern-cap" />
            <span className="lantern-cage" />
            <span className="lantern-flame" />
          </span>
        </div>
      </div>
      <PickaxeLayer
        strike={strike}
        targetPoint={faceGeometry.targetPoint}
        reducedMotion={settings.reducedMotion}
        travelScale={tuning.animation.pickaxeTravelScale}
        reducedMotionScale={tuning.animation.pickaxeReducedMotionScale}
        debugOpen={debugOpen}
      />
      {lanternRevealActive && (
        <div
          className="lantern-reveal"
          style={{ '--lantern-scale': tuning.animation.lanternRevealGlowScale } as CSSProperties}
          aria-hidden="true"
        />
      )}
    </section>
  );
}

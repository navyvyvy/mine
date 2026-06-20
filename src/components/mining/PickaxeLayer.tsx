import type { PickaxeStrikeState } from '../../game/types';
import type { CSSProperties } from 'react';
import type { MiningCellTargetPoint } from '../../game/targeting';

type Props = {
  strike: PickaxeStrikeState | null;
  targetPoint: MiningCellTargetPoint;
  reducedMotion: boolean;
  travelScale: number;
  reducedMotionScale: number;
  debugOpen: boolean;
};

// Visual hit anchor: this pivot keeps the tool parked in the lower-right
// equipment zone while letting the beak land on the center block crack.
const TOOL_PIVOT_PERCENT = {
  x: 68,
  y: 95
};

const REFERENCE_STAGE_PX = {
  width: 480,
  height: 682
};

export function PickaxeLayer({
  strike,
  targetPoint,
  reducedMotion,
  travelScale,
  reducedMotionScale,
  debugOpen
}: Props) {
  const motionScale = reducedMotion ? reducedMotionScale : travelScale;
  const dxPx = ((targetPoint.xPercent - TOOL_PIVOT_PERCENT.x) / 100) * REFERENCE_STAGE_PX.width;
  const dyPx = ((targetPoint.yPercent - TOOL_PIVOT_PERCENT.y) / 100) * REFERENCE_STAGE_PX.height;
  // The swing uses only translate/rotate. These offsets were tuned so the
  // fixed-size pickaxe tip reaches the current block without scaling or reach.
  const approachX = Math.max(-190, Math.min(120, dxPx * 1.06));
  const approachY = Math.max(-390, Math.min(160, dyPx * 1.06));
  const strikeAngle = Math.atan2(dxPx, -dyPx) * (180 / Math.PI);
  const windAngle = strikeAngle - 24 * motionScale;
  const aimAngle = strikeAngle - 8 * motionScale;
  const recoverAngle = strikeAngle + 16 * motionScale;
  const style = {
    '--tool-pivot-x': `${TOOL_PIVOT_PERCENT.x}%`,
    '--tool-pivot-y': `${TOOL_PIVOT_PERCENT.y}%`,
    '--tool-approach-x': `${Math.round(approachX)}px`,
    '--tool-approach-y': `${Math.round(approachY)}px`,
    '--strike-angle': `${Math.round(strikeAngle * 100) / 100}deg`,
    '--aim-angle': `${Math.round(aimAngle * 100) / 100}deg`,
    '--wind-angle': `${Math.round(windAngle * 100) / 100}deg`,
    '--recover-angle': `${Math.round(recoverAngle * 100) / 100}deg`,
  } as CSSProperties;
  return (
    <div className={`pickaxe-layer phase-${(strike?.phase ?? 'READY').toLowerCase()}`} style={style} aria-hidden="true">
      <div className="pickaxe-rig">
        <svg className="pickaxe-assembly pickaxe-svg" viewBox="0 0 190 250" role="presentation" focusable="false">
          <g className="pickaxe-tool">
            <g className="pickaxe-tool-handle">
              <rect className="pickaxe-handle-core" x="87" y="34" width="16" height="168" rx="7" />
              <rect className="pickaxe-handle-shadow" x="90" y="34" width="4" height="168" rx="2" />
              <rect className="pickaxe-handle-grip pickaxe-handle-grip-top" x="79" y="140" width="32" height="7" rx="3.5" />
              <rect className="pickaxe-handle-grip pickaxe-handle-grip-bottom" x="79" y="164" width="32" height="7" rx="3.5" />
              <rect className="pickaxe-handle-cap" x="85" y="25" width="20" height="14" rx="4" />
            </g>
            <g className="pickaxe-tool-head">
              <path
                className="pickaxe-head-body"
                d="M77 49L108 39L137 49L122 66L92 71L70 66Z"
              />
              <path
                className="pickaxe-head-beak"
                d="M77 49L41 39L21 52L30 67L61 73L72 64Z"
              />
              <path
                className="pickaxe-head-adze"
                d="M108 42L140 48L130 67L102 61Z"
              />
              <rect className="pickaxe-collar" x="79" y="49" width="34" height="18" rx="5" />
              <path
                className="pickaxe-head-highlight"
                d="M48 47L72 42L86 44L72 55L52 58Z"
              />
              <path
                className="pickaxe-head-highlight pickaxe-head-highlight-tight"
                d="M104 46L122 49L117 58L99 55Z"
              />
            </g>
          </g>
        </svg>
      </div>
      {debugOpen && <span className="pickaxe-debug-target" />}
    </div>
  );
}

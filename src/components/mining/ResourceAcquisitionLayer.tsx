import type { CSSProperties } from 'react';
import type { Flyout, ResourceId } from '../../game/types';

type Bounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type FaceGeometry = {
  stageRect: Bounds;
  gridRect: Bounds;
};

type Props = {
  flyouts: Flyout[];
  viewportRect: Bounds | null;
  faceGeometry: FaceGeometry | null;
  hudTargets: Partial<Record<ResourceId, Bounds>>;
  resourceStripRect: Bounds | null;
  reducedMotion: boolean;
};

function cellCenter(gridRect: Bounds, index: number): { x: number; y: number } {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return {
    x: gridRect.left + (col + 0.5) * (gridRect.width / 3),
    y: gridRect.top + (row + 0.5) * (gridRect.height / 3)
  };
}

function resourceParticleCount(resource: ResourceId, amount: number, reducedMotion: boolean): number {
  const baseByResource: Record<ResourceId, number> = {
    STONE: 2,
    COAL: 3,
    COPPER: 3,
    IRON: 3,
    GOLD: 4,
    CRYSTAL: 4,
    DIAMOND: 5
  };
  const amountBonus = amount > 1 ? 1 : 0;
  const count = baseByResource[resource] + amountBonus;
  return reducedMotion ? Math.min(2, count) : Math.max(2, Math.min(5, count));
}

function seedFloat(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  return min + (x - Math.floor(x)) * (max - min);
}

export function ResourceAcquisitionLayer({
  flyouts,
  viewportRect,
  faceGeometry,
  hudTargets,
  resourceStripRect,
  reducedMotion
}: Props) {
  if (!viewportRect || !faceGeometry || flyouts.length === 0) return null;

  return (
    <div className="resource-acquisition-layer" aria-hidden="true">
      {flyouts.map((flyout) => {
        const targetRect = hudTargets[flyout.resource] ?? resourceStripRect;
        if (!targetRect) return null;
        const startPoint = cellCenter(faceGeometry.gridRect, flyout.cellIndex);
        const targetPoint = {
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2
        };
        const startX = startPoint.x - viewportRect.left;
        const startY = startPoint.y - viewportRect.top;
        const dx = targetPoint.x - startPoint.x;
        const dy = targetPoint.y - startPoint.y;
        const particleCount = resourceParticleCount(flyout.resource, flyout.amount, reducedMotion);
        const flightDuration = reducedMotion ? 760 : 980;
        const baseSeed = flyout.id * 31 + flyout.amount * 17 + flyout.resource.charCodeAt(0) * 7;
        return (
          <span
            key={flyout.id}
            className={`resource-acquisition resource-${flyout.resource.toLowerCase()} ${reducedMotion ? 'is-reduced-motion' : ''}`}
            style={{
              left: `${startX}px`,
              top: `${startY}px`,
              '--acquisition-dx': `${dx}px`,
              '--acquisition-dy': `${dy}px`,
              '--acquisition-duration': `${flightDuration}ms`
            } as CSSProperties}
          >
            <span className="resource-acquisition-core" />
            {Array.from({ length: particleCount }, (_, index) => {
              const seed = baseSeed + index * 29;
              const offsetX = seedFloat(seed, -18, 18);
              const offsetY = seedFloat(seed + 1, -16, 16);
              const rotation = seedFloat(seed + 2, -42, 42);
              const scale = seedFloat(seed + 3, 0.7, 1.08);
              const delay = seedFloat(seed + 4, 0, reducedMotion ? 80 : 120);
              return (
                <span
                  key={`${flyout.id}-${index}`}
                  className="resource-acquisition-shard"
                  style={
                    {
                      '--spark-x': `${offsetX}px`,
                      '--spark-y': `${offsetY}px`,
                      '--spark-rotate': `${rotation}deg`,
                      '--spark-scale': scale,
                      '--spark-delay': `${delay}ms`
                    } as CSSProperties
                  }
                />
              );
            })}
            <span className="resource-acquisition-value">+{flyout.amount}</span>
          </span>
        );
      })}
    </div>
  );
}

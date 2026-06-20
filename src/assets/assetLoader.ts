import type { VisualAssetMode } from '../game/types';
import { getImageAsset } from './assetRegistry';
import type { ImageAssetKey } from '../data/imageAssets';

const status = new Map<ImageAssetKey, 'unknown' | 'loaded' | 'missing'>();

export function resolveVisualAsset(key: ImageAssetKey, mode: VisualAssetMode): { useImage: boolean; path: string; className: string } {
  const asset = getImageAsset(key);
  const current = status.get(key) ?? 'unknown';
  if (mode === 'GENERATED' || current === 'missing') {
    return { useImage: false, path: asset.imagePath, className: asset.generatedFallbackClass };
  }
  return { useImage: mode === 'IMAGE' || mode === 'AUTO', path: asset.imagePath, className: asset.generatedFallbackClass };
}

export function markAssetLoaded(key: ImageAssetKey): void {
  status.set(key, 'loaded');
}

export function markAssetMissing(key: ImageAssetKey): void {
  status.set(key, 'missing');
}

export function getImageAssetStatuses() {
  return Array.from(status.entries()).map(([key, value]) => ({ key, status: value }));
}

import { IMAGE_ASSETS } from '../data/imageAssets';
import type { ImageAssetKey } from '../data/imageAssets';

export function getImageAsset(key: ImageAssetKey) {
  return IMAGE_ASSETS[key];
}

export function getAllImageAssets() {
  return Object.values(IMAGE_ASSETS);
}

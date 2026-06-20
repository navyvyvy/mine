import type { ImageAssetKey } from '../../data/imageAssets';
import type { VisualAssetMode } from '../../game/types';
import { markAssetLoaded, markAssetMissing, resolveVisualAsset } from '../../assets/assetLoader';

type Props = {
  assetKey: ImageAssetKey;
  mode: VisualAssetMode;
  className?: string;
};

export function VisualAsset({ assetKey, mode, className = '' }: Props) {
  const asset = resolveVisualAsset(assetKey, mode);
  if (!asset.useImage) {
    return <span className={`visual-asset generated ${asset.className} ${className}`} aria-hidden="true" />;
  }
  return (
    <img
      className={`visual-asset image ${className}`}
      src={asset.path}
      alt=""
      onLoad={() => markAssetLoaded(assetKey)}
      onError={(event) => {
        markAssetMissing(assetKey);
        event.currentTarget.style.display = 'none';
      }}
    />
  );
}

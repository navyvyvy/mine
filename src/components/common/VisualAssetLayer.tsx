import type { ImageAssetKey } from '../../data/imageAssets';
import type { VisualAssetMode } from '../../game/types';
import { VisualAsset } from './VisualAsset';

type Props = {
  assets: ImageAssetKey[];
  mode: VisualAssetMode;
};

export function VisualAssetLayer({ assets, mode }: Props) {
  return (
    <span className="visual-asset-layer" aria-hidden="true">
      {assets.map((assetKey) => (
        <VisualAsset key={assetKey} assetKey={assetKey} mode={mode} />
      ))}
    </span>
  );
}

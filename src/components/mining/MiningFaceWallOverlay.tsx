import type { FacePattern, ResourceId } from '../../game/types';

type Props = {
  pattern: FacePattern;
  mainResource: ResourceId;
};

const VEIN_SEGMENTS: Record<FacePattern, string[]> = {
  SCATTER: [],
  HORIZONTAL_TOP: [
    'M23 52 C46 43, 67 43, 88 50',
    'M112 56 C132 63, 151 58, 170 50',
    'M211 48 C233 43, 255 47, 278 41'
  ],
  HORIZONTAL_MIDDLE: [
    'M18 151 C42 143, 65 145, 88 152',
    'M111 157 C132 164, 151 158, 171 150',
    'M209 149 C233 144, 257 148, 282 139'
  ],
  HORIZONTAL_BOTTOM: [
    'M24 248 C47 239, 68 240, 91 249',
    'M116 255 C136 262, 154 256, 172 248',
    'M211 247 C234 240, 258 244, 281 239'
  ],
  VERTICAL_LEFT: [
    'M51 20 C44 45, 46 66, 54 88',
    'M50 115 C44 136, 43 154, 52 173',
    'M47 210 C42 233, 43 257, 39 281'
  ],
  VERTICAL_CENTER: [
    'M151 18 C145 42, 146 63, 153 84',
    'M150 116 C144 136, 144 154, 151 173',
    'M146 214 C142 236, 143 259, 138 282'
  ],
  VERTICAL_RIGHT: [
    'M249 20 C243 45, 244 68, 252 88',
    'M250 116 C244 136, 244 154, 251 172',
    'M246 212 C242 235, 242 257, 237 280'
  ],
  DIAGONAL_DOWN: [
    'M18 18 C39 38, 58 56, 78 76',
    'M117 114 C132 127, 144 139, 156 154',
    'M213 214 C235 237, 258 259, 282 282'
  ],
  DIAGONAL_UP: [
    'M20 281 C42 259, 61 241, 82 220',
    'M119 188 C133 176, 143 164, 156 148',
    'M213 88 C236 65, 258 43, 281 21'
  ],
  CROSS: [
    'M150 22 C147 46, 147 68, 150 90',
    'M22 150 C46 148, 68 148, 91 151',
    'M209 150 C232 151, 257 152, 281 150',
    'M150 211 C149 235, 148 259, 150 281'
  ],
  CORE_RADIAL: [
    'M150 150 C132 130, 113 113, 92 96',
    'M150 150 C170 130, 190 109, 211 90',
    'M150 150 C130 170, 111 190, 91 211',
    'M150 150 C171 172, 191 192, 213 213'
  ]
};

export function MiningFaceWallOverlay({ pattern, mainResource }: Props) {
  const veinSegments = VEIN_SEGMENTS[pattern];
  const veinResourceClass = `vein-${mainResource.toLowerCase()}`;

  return (
    <svg viewBox="0 0 300 300" className="mining-face-wall-overlay" aria-hidden="true">
      <path className="wall-seam" d="M100 8 C96 61, 105 110, 100 153 C95 205, 104 245, 100 292" />
      <path className="wall-seam" d="M200 8 C194 63, 204 111, 200 154 C195 206, 204 247, 200 292" />
      <path className="wall-seam" d="M8 100 C58 94, 111 105, 153 100 C205 95, 246 104, 292 100" />
      <path className="wall-seam" d="M8 200 C59 194, 112 205, 154 200 C205 194, 246 204, 292 200" />
      {veinSegments.map((path, index) => (
        <g key={`${pattern}-${index}`} className={`face-ore-seam ${veinResourceClass}`}>
          <path className="face-ore-seam-shadow" d={path} />
          <path className="face-ore-seam-color" d={path} />
        </g>
      ))}
    </svg>
  );
}

import { getCellDamageVisualStage } from '../../game/face';
import type { MiningCell } from '../../game/types';

type Props = {
  cell: MiningCell;
};

type DamageVariant = {
  anchorX: number;
  anchorY: number;
  impactScar: string;
  mainCrack: string;
  branchA: string;
  branchB: string;
  branchC: string;
  exposedFace: string;
  chipA: string;
  chipB: string;
  emptyRim: string;
  emptyCavity: string;
};

// Stable per-cell fracture presets. The anchor is the visual hit point for the
// selected block; a later pickaxe pass can aim the tool tip here without
// changing the crack art.
const DAMAGE_VARIANTS: DamageVariant[] = [
  {
    anchorX: 51,
    anchorY: 52,
    impactScar: 'M47 48 L53 45 L58 50 L55 57 L48 59 L43 54 Z',
    mainCrack: 'M51 52 C54 47, 58 42, 64 37 C70 31, 76 27, 82 20',
    branchA: 'M52 53 C47 58, 41 63, 34 69 C28 75, 22 80, 16 87',
    branchB: 'M54 53 C61 56, 68 61, 76 66 C81 69, 86 72, 91 76',
    branchC: 'M51 55 C52 62, 55 70, 59 78 C62 84, 66 88, 71 92',
    exposedFace: 'M38 43 L49 37 L63 42 L69 54 L62 66 L47 70 L35 61 Z',
    chipA: 'M0 75 L12 65 L29 63 L37 72 L35 100 L0 100 Z',
    chipB: 'M71 0 L88 8 L100 8 L100 27 L82 23 L68 13 Z',
    emptyRim: 'M18 12 L39 5 L63 7 L82 19 L94 39 L91 62 L78 83 L56 94 L32 90 L13 74 L7 51 L10 28 Z',
    emptyCavity: 'M25 19 L42 12 L63 15 L77 26 L86 43 L82 61 L70 76 L52 84 L34 80 L21 66 L15 49 L17 31 Z'
  },
  {
    anchorX: 49,
    anchorY: 50,
    impactScar: 'M44 46 L51 43 L57 47 L56 55 L49 59 L42 55 Z',
    mainCrack: 'M49 50 C44 46, 40 42, 35 37 C29 31, 24 25, 18 18',
    branchA: 'M49 51 C55 56, 61 62, 68 68 C75 73, 82 78, 89 84',
    branchB: 'M47 52 C43 60, 38 68, 32 75 C27 81, 21 86, 14 91',
    branchC: 'M50 52 C51 59, 53 66, 56 73 C58 79, 62 84, 67 88',
    exposedFace: 'M35 40 L47 35 L60 39 L67 50 L63 63 L50 70 L37 65 L31 52 Z',
    chipA: 'M67 0 L84 9 L100 12 L100 29 L83 24 L68 15 Z',
    chipB: 'M0 60 L15 53 L29 58 L34 70 L28 100 L0 100 Z',
    emptyRim: 'M12 22 L28 10 L50 6 L71 11 L88 25 L96 47 L90 69 L73 87 L50 95 L28 88 L11 72 L5 49 Z',
    emptyCavity: 'M20 27 L35 17 L51 14 L68 18 L80 31 L87 48 L81 64 L67 77 L49 85 L31 79 L17 65 L12 47 Z'
  },
  {
    anchorX: 50,
    anchorY: 51,
    impactScar: 'M46 47 L53 44 L59 49 L57 56 L50 60 L43 55 Z',
    mainCrack: 'M50 51 C55 48, 60 43, 66 38 C73 32, 79 27, 87 22',
    branchA: 'M49 52 C43 56, 36 60, 29 65 C22 70, 17 74, 10 79',
    branchB: 'M53 52 C59 55, 66 59, 73 63 C80 67, 86 71, 92 76',
    branchC: 'M50 54 C48 61, 47 68, 46 75 C45 81, 43 86, 40 91',
    exposedFace: 'M39 42 L51 36 L65 43 L69 57 L60 68 L45 70 L34 60 Z',
    chipA: 'M0 24 L15 19 L31 25 L34 39 L23 52 L0 55 Z',
    chipB: 'M73 0 L91 8 L100 16 L100 31 L82 25 L69 13 Z',
    emptyRim: 'M16 17 L36 8 L59 6 L78 14 L94 31 L99 53 L90 75 L72 91 L48 98 L26 91 L9 75 L4 53 L8 30 Z',
    emptyCavity: 'M24 22 L40 14 L59 13 L74 21 L85 36 L90 52 L82 68 L68 81 L49 88 L30 82 L16 67 L12 50 L15 33 Z'
  },
  {
    anchorX: 52,
    anchorY: 50,
    impactScar: 'M47 46 L54 42 L60 47 L58 55 L51 59 L45 54 Z',
    mainCrack: 'M52 50 C57 46, 62 41, 68 36 C75 30, 82 25, 89 18',
    branchA: 'M51 51 C46 55, 40 59, 34 64 C28 69, 22 75, 15 82',
    branchB: 'M54 51 C60 55, 67 59, 74 64 C80 68, 86 72, 92 75',
    branchC: 'M52 53 C54 61, 57 68, 61 75 C64 81, 69 86, 75 91',
    exposedFace: 'M40 40 L54 35 L66 42 L70 54 L64 65 L49 70 L37 62 L34 49 Z',
    chipA: 'M0 69 L10 60 L25 58 L35 66 L32 100 L0 100 Z',
    chipB: 'M72 0 L88 9 L100 14 L100 29 L83 25 L69 14 Z',
    emptyRim: 'M20 12 L40 5 L62 5 L82 16 L97 35 L99 56 L89 77 L70 91 L47 97 L24 90 L8 74 L3 52 L8 27 Z',
    emptyCavity: 'M28 18 L43 12 L61 12 L77 21 L88 37 L90 54 L82 69 L66 81 L47 88 L28 81 L15 66 L11 49 L15 31 Z'
  },
  {
    anchorX: 50,
    anchorY: 53,
    impactScar: 'M45 48 L52 44 L58 49 L57 57 L49 61 L42 56 Z',
    mainCrack: 'M50 53 C52 47, 55 42, 59 36 C64 29, 70 23, 77 16',
    branchA: 'M49 54 C44 59, 38 65, 32 72 C26 79, 20 85, 13 92',
    branchB: 'M52 54 C58 58, 65 62, 72 67 C78 71, 83 75, 88 80',
    branchC: 'M50 56 C50 63, 51 70, 53 78 C54 84, 57 89, 61 94',
    exposedFace: 'M38 44 L51 38 L63 43 L68 56 L61 68 L47 72 L35 63 Z',
    chipA: 'M9 0 L24 10 L38 16 L36 46 L20 51 L0 48 L0 0 Z',
    chipB: 'M70 82 L84 72 L100 72 L100 100 L73 100 Z',
    emptyRim: 'M21 14 L41 7 L65 8 L84 20 L97 39 L98 59 L86 80 L66 93 L42 98 L20 89 L7 71 L4 49 L10 27 Z',
    emptyCavity: 'M29 20 L45 13 L64 15 L79 25 L87 41 L88 58 L77 73 L60 83 L42 88 L25 80 L14 64 L12 47 L17 30 Z'
  },
  {
    anchorX: 50,
    anchorY: 50,
    impactScar: 'M46 45 L53 42 L59 47 L56 55 L49 59 L43 53 Z',
    mainCrack: 'M50 50 C55 46, 60 41, 66 35 C71 30, 78 25, 85 19',
    branchA: 'M49 51 C44 56, 38 62, 32 69 C26 75, 20 81, 14 87',
    branchB: 'M52 51 C58 55, 64 59, 71 63 C78 67, 84 71, 90 75',
    branchC: 'M50 53 C52 61, 54 68, 57 76 C60 83, 64 88, 70 93',
    exposedFace: 'M37 40 L50 34 L63 39 L69 52 L64 65 L50 72 L37 66 L32 52 Z',
    chipA: 'M4 24 L19 17 L36 20 L37 43 L26 55 L0 56 L0 30 Z',
    chipB: 'M65 84 L80 74 L100 75 L100 100 L70 100 Z',
    emptyRim: 'M15 14 L36 6 L59 5 L78 12 L94 29 L100 52 L91 74 L72 91 L49 98 L25 91 L7 75 L3 52 L7 27 Z',
    emptyCavity: 'M23 21 L39 13 L58 12 L74 19 L86 34 L91 51 L83 68 L68 82 L49 89 L30 82 L16 66 L12 49 L15 31 Z'
  }
];

export function CellDamageOverlay({ cell }: Props) {
  const stage = getCellDamageVisualStage(cell.currentHits, cell.requiredHits);
  const variant =
    DAMAGE_VARIANTS[
      (cell.index * 17 + cell.requiredHits * 11 + cell.blockType.length * 5 + cell.resource.length) % DAMAGE_VARIANTS.length
    ];

  return (
    <svg viewBox="0 0 100 100" className={`cell-damage-overlay stage-${stage.toLowerCase()}`} aria-hidden="true">
      <g className="damage-layer">
        <path className="damage-empty-rim" d={variant.emptyRim} />
        <path className="damage-empty-cavity" d={variant.emptyCavity} />
        <path className="damage-exposed-face" d={variant.exposedFace} />
        <path className="damage-chip-slab damage-chip-slab-a" d={variant.chipA} />
        <path className="damage-chip-slab damage-chip-slab-b" d={variant.chipB} />
        <path className="damage-impact-scar" d={variant.impactScar} />
        <path className="damage-main-crack" d={variant.mainCrack} />
        <path className="damage-main-crack damage-main-crack-edge" d={variant.mainCrack} />
        <path className="damage-branch damage-branch-a" d={variant.branchA} />
        <path className="damage-branch damage-branch-b" d={variant.branchB} />
        <path className="damage-branch damage-branch-c" d={variant.branchC} />
        <circle className="damage-hit-point" cx={variant.anchorX} cy={variant.anchorY} r="2" />
      </g>
    </svg>
  );
}

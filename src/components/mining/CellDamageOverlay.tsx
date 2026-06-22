import { getCellDamageVisualStage, isOreBlock } from '../../game/face';
import type { MiningCell } from '../../game/types';

type Props = {
  cell: MiningCell;
};

type DamageVariant = {
  hitDent: string;
  impactScar: string;
  mainCrack: string;
  branchA: string;
  branchB: string;
  branchC: string;
  exposedFace: string;
  chipA: string;
  chipB: string;
  emptyRim: string;
  emptyOre: string;
  shellLip: string;
};

// Stable per-cell fracture presets. The anchor is the visual hit point for the
// selected block; a later pickaxe pass can aim the tool tip here without
// changing the crack art.
const DAMAGE_VARIANTS: DamageVariant[] = [
  {
    hitDent: 'M48 49 L51 46 L55 47 L57 50 L56 54 L53 57 L49 56 L46 53 L46 50 Z',
    impactScar: 'M47 48 C49 46, 52 45, 56 47 C58 49, 58 53, 56 56 C53 58, 49 59, 46 56 C44 53, 44 50, 47 48 Z',
    mainCrack: 'M51 51 C54 48, 57 45, 60 43 C63 40, 66 37, 69 35 C73 31, 77 26, 84 20',
    branchA: 'M50 52 C47 55, 44 58, 40 62 C36 66, 31 71, 26 77 C23 80, 21 83, 19 85',
    branchB: 'M52 52 C56 54, 60 56, 64 58 C69 60, 74 62, 79 65 C84 67, 87 69, 90 71',
    branchC: 'M50 54 C50 58, 50 61, 51 65 C52 69, 54 74, 56 78 C58 82, 61 86, 64 90',
    exposedFace: 'M39 43 L48 37 L61 39 L69 48 L67 61 L57 70 L44 68 L35 58 Z',
    chipA: 'M0 73 L11 64 L26 63 L36 70 L32 100 L0 100 Z',
    chipB: 'M73 0 L89 8 L100 10 L100 26 L83 22 L69 13 Z',
    emptyRim: 'M14 34 L26 22 L40 17 L55 18 L69 24 L81 35 L86 48 L80 52 L68 44 L55 40 L40 42 L27 49 Z',
    emptyOre: 'M17 28 L28 16 L43 13 L59 17 L74 14 L87 26 L91 42 L87 55 L91 71 L80 86 L63 90 L47 87 L30 91 L16 79 L11 62 L14 47 L10 36 Z',
    shellLip: 'M25 43 L37 30 L50 33 L46 46 L33 50 L24 47 Z'
  },
  {
    hitDent: 'M47 48 L50 45 L54 45 L56 48 L56 52 L53 55 L49 55 L46 52 L46 49 Z',
    impactScar: 'M45 46 C48 44, 52 44, 55 46 C57 49, 58 52, 57 55 C55 58, 50 58, 47 58 C44 57, 43 53, 45 46 Z',
    mainCrack: 'M50 50 C47 46, 44 42, 41 39 C38 35, 34 30, 30 24 C27 21, 25 18, 23 16',
    branchA: 'M50 50 C53 53, 56 56, 60 60 C63 63, 67 67, 71 71 C75 75, 79 79, 83 81',
    branchB: 'M49 52 C46 55, 42 59, 38 63 C35 66, 31 70, 26 74 C21 78, 17 82, 14 85',
    branchC: 'M50 53 C51 57, 51 61, 52 65 C53 69, 55 73, 57 77 C59 81, 62 84, 65 88',
    exposedFace: 'M36 41 L47 35 L60 38 L67 49 L63 62 L51 69 L38 65 L31 53 Z',
    chipA: 'M66 0 L84 10 L100 13 L100 30 L83 25 L68 15 Z',
    chipB: 'M0 60 L15 53 L29 58 L34 71 L28 100 L0 100 Z',
    emptyRim: 'M15 31 L28 20 L42 16 L58 17 L72 24 L85 37 L88 50 L81 55 L69 46 L55 41 L40 43 L25 52 Z',
    emptyOre: 'M15 24 L29 14 L44 16 L59 11 L75 18 L88 31 L91 48 L86 63 L90 79 L77 90 L59 92 L43 87 L26 90 L12 78 L9 60 L12 44 L8 31 Z',
    shellLip: 'M58 63 L70 54 L82 58 L79 70 L67 74 L58 69 Z'
  },
  {
    hitDent: 'M48 49 L51 46 L55 46 L57 49 L56 53 L53 56 L49 56 L46 53 L46 50 Z',
    impactScar: 'M46 47 C49 45, 52 44, 56 46 C58 48, 59 51, 58 54 C56 57, 52 59, 48 59 C45 58, 43 54, 46 47 Z',
    mainCrack: 'M50 51 C54 47, 58 44, 61 42 C64 39, 67 37, 71 34 C74 31, 78 27, 82 24',
    branchA: 'M49 52 C45 55, 41 57, 36 60 C32 63, 27 66, 22 70 C19 72, 17 74, 15 76',
    branchB: 'M53 52 C57 54, 60 56, 64 58 C68 60, 73 62, 77 65 C82 68, 85 70, 87 72',
    branchC: 'M50 54 C49 58, 48 62, 47 66 C46 70, 46 74, 45 78 C44 81, 43 85, 41 89',
    exposedFace: 'M39 42 L51 36 L65 43 L69 57 L60 68 L45 70 L34 60 Z',
    chipA: 'M0 24 L15 19 L31 25 L34 39 L23 52 L0 55 Z',
    chipB: 'M73 0 L91 8 L100 16 L100 31 L82 25 L69 13 Z',
    emptyRim: 'M18 28 L31 18 L48 14 L64 17 L78 25 L89 39 L92 53 L84 58 L71 49 L56 43 L41 45 L27 55 Z',
    emptyOre: 'M20 18 L35 12 L52 14 L68 10 L84 20 L90 37 L88 55 L92 72 L80 87 L63 91 L47 89 L31 92 L15 81 L10 64 L13 47 L12 31 Z',
    shellLip: 'M20 25 L32 17 L45 20 L42 32 L30 36 L21 31 Z'
  },
  {
    hitDent: 'M49 48 L52 45 L56 45 L58 48 L57 52 L54 55 L50 55 L47 52 L47 49 Z',
    impactScar: 'M47 46 C50 44, 54 43, 57 46 C59 48, 60 52, 58 55 C56 58, 52 59, 48 59 C45 58, 44 53, 47 46 Z',
    mainCrack: 'M52 50 C56 46, 60 43, 63 41 C66 39, 69 36, 73 33 C76 29, 80 26, 84 23 C87 20, 89 18, 91 16',
    branchA: 'M51 51 C48 53, 45 55, 42 57 C39 59, 36 61, 33 64 C30 66, 27 68, 24 71 C21 74, 18 78, 15 82',
    branchB: 'M54 51 C58 53, 61 55, 64 57 C67 59, 71 61, 74 64 C77 66, 80 68, 83 70 C86 72, 89 74, 92 75',
    branchC: 'M52 53 C53 57, 55 61, 56 65 C58 69, 60 73, 62 77 C63 80, 65 84, 67 87 C69 89, 72 90, 75 91',
    exposedFace: 'M40 40 L54 35 L66 42 L70 54 L64 65 L49 70 L37 62 L34 49 Z',
    chipA: 'M0 69 L10 60 L25 58 L35 66 L32 100 L0 100 Z',
    chipB: 'M72 0 L88 9 L100 14 L100 29 L83 25 L69 14 Z',
    emptyRim: 'M17 25 L30 16 L47 12 L63 15 L78 23 L91 37 L93 50 L86 55 L73 47 L58 41 L43 43 L28 52 Z',
    emptyOre: 'M17 26 L28 15 L43 12 L59 15 L76 12 L88 24 L91 40 L88 56 L91 73 L79 86 L62 90 L45 87 L28 91 L14 80 L9 63 L11 47 L8 34 Z',
    shellLip: 'M66 35 L78 28 L89 33 L86 45 L75 49 L65 44 Z'
  },
  {
    hitDent: 'M47 50 L50 47 L54 47 L56 50 L55 54 L52 57 L48 56 L45 53 L45 50 Z',
    impactScar: 'M45 48 C48 46, 51 45, 55 47 C57 49, 58 53, 57 56 C54 59, 50 61, 46 59 C43 56, 42 52, 45 48 Z',
    mainCrack: 'M50 53 C51 49, 53 46, 55 42 C57 39, 59 36, 61 33 C63 30, 66 27, 68 23 C71 20, 74 17, 77 16',
    branchA: 'M49 54 C46 57, 43 60, 40 64 C37 67, 34 71, 31 74 C28 78, 24 82, 20 85 C17 88, 15 90, 13 92',
    branchB: 'M52 54 C55 57, 58 59, 61 62 C65 64, 69 67, 72 69 C75 71, 79 73, 83 75 C85 77, 87 78, 88 80',
    branchC: 'M50 56 C50 59, 50 63, 51 67 C52 71, 52 75, 53 78 C54 81, 55 85, 57 89 C59 92, 60 93, 61 94',
    exposedFace: 'M38 44 L51 38 L63 43 L68 56 L61 68 L47 72 L35 63 Z',
    chipA: 'M9 0 L24 10 L38 16 L36 46 L20 51 L0 48 L0 0 Z',
    chipB: 'M70 82 L84 72 L100 72 L100 100 L73 100 Z',
    emptyRim: 'M16 27 L28 18 L45 14 L61 16 L76 24 L88 37 L91 51 L84 56 L71 48 L56 42 L40 44 L26 53 Z',
    emptyOre: 'M33 12 L49 10 L66 16 L78 12 L92 25 L86 41 L90 57 L82 74 L68 90 L51 86 L36 92 L22 82 L11 66 L16 50 L10 34 L22 20 Z',
    shellLip: 'M18 66 L29 56 L43 59 L40 71 L28 75 L18 70 Z'
  },
  {
    hitDent: 'M47 48 L50 45 L54 45 L56 48 L55 52 L52 55 L48 55 L45 52 L45 49 Z',
    impactScar: 'M46 45 C49 43, 53 43, 56 46 C58 49, 57 53, 56 55 C53 58, 49 59, 45 57 C43 54, 42 49, 46 45 Z',
    mainCrack: 'M50 50 C54 47, 57 44, 60 41 C63 38, 66 35, 71 30 C75 26, 80 22, 85 19',
    branchA: 'M49 51 C46 54, 42 57, 38 62 C35 65, 31 69, 27 73 C24 77, 17 83, 14 87',
    branchB: 'M52 51 C56 53, 60 56, 64 59 C67 61, 72 64, 76 67 C80 69, 84 71, 90 75',
    branchC: 'M50 53 C51 57, 52 61, 53 66 C55 70, 57 75, 59 79 C60 83, 62 86, 70 93',
    exposedFace: 'M37 40 L50 34 L63 39 L69 52 L64 65 L50 72 L37 66 L32 52 Z',
    chipA: 'M4 24 L19 17 L36 20 L37 43 L26 55 L0 56 L0 30 Z',
    chipB: 'M65 84 L80 74 L100 75 L100 100 L70 100 Z',
    emptyRim: 'M15 29 L27 19 L43 14 L60 16 L74 24 L86 37 L89 50 L82 55 L70 47 L55 42 L40 44 L25 53 Z',
    emptyOre: 'M28 14 L44 8 L61 12 L76 9 L90 23 L87 41 L92 58 L84 75 L70 90 L53 94 L36 88 L20 92 L9 78 L12 60 L8 44 L12 28 Z',
    shellLip: 'M41 68 L54 58 L66 62 L63 75 L50 79 L40 74 Z'
  }
];

export function CellDamageOverlay({ cell }: Props) {
  const stage = getCellDamageVisualStage(cell.currentHits, cell.requiredHits);
  const oreBlock = isOreBlock(cell.blockType);
  const variant =
    DAMAGE_VARIANTS[
      (cell.index * 17 + cell.requiredHits * 11 + cell.blockType.length * 5 + cell.resource.length + cell.resource.charCodeAt(0) * 7) % DAMAGE_VARIANTS.length
    ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={`cell-damage-overlay stage-${stage.toLowerCase()} ${oreBlock ? 'is-ore' : 'is-stone'}`}
      data-resource={cell.resource.toLowerCase()}
      aria-hidden="true"
    >
      <g className="damage-layer">
        <path className="damage-empty-shell-shadow" d={variant.emptyRim} />
        <path className="damage-empty-rim" d={variant.emptyRim} />
        <path className="damage-empty-core-shadow" d={variant.emptyOre} />
        <path className="damage-empty-ore" d={variant.emptyOre} />
        <path className="damage-empty-core-glint" d={variant.emptyOre} />
        <path className="damage-empty-shell-lip" d={variant.shellLip} />
        <path className="damage-exposed-face" d={variant.exposedFace} />
        <path className="damage-chip-slab damage-chip-slab-a" d={variant.chipA} />
        <path className="damage-chip-slab damage-chip-slab-b" d={variant.chipB} />
        <path className="damage-impact-scar" d={variant.impactScar} />
        <path className="damage-main-crack" d={variant.mainCrack} />
        <path className="damage-main-crack damage-main-crack-edge" d={variant.mainCrack} />
        <path className="damage-branch damage-branch-a" d={variant.branchA} />
        <path className="damage-branch damage-branch-b" d={variant.branchB} />
        <path className="damage-branch damage-branch-c" d={variant.branchC} />
        <path className="damage-hit-point" d={variant.hitDent} />
      </g>
    </svg>
  );
}

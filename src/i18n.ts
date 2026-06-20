import type { MiningCoreBranch, MiningCoreRarity } from './data/miningCoreNodes';
import type { Language, NodeState, ResourceId, RewardChoice, RewardDuration, RewardKind, RewardRank } from './game/types';

const TRANSLATIONS = {
  ko: {
    'aria.topHud': '상단 상태',
    'aria.resources': '자원 열기',
    'aria.settings': '설정 열기',
    'aria.miningFace': '채굴면',
    'aria.bottomControls': '빠른 조작',
    'aria.heldEquipment': '손에 든 장비',
    'hud.depth': '깊이',
    'hud.autoOn': '자동',
    'hud.autoOff': '수동',
    'bottom.resources': '자원',
    'bottom.core': '채굴 코어',
    'bottom.auto': 'AUTO',
    'bottom.settings': '설정',
    'equipment.lanternBranch': '랜턴 가지 열기',
    'equipment.pickaxeBranch': '곡괭이 가지 열기',
    'equipment.glovesBranch': '장갑 가지 열기',
    'panel.close': '닫기',
    'resources.title': '자원',
    'resources.subtitle': '현재 보유량과 누적 기록',
    'resources.current': '현재',
    'resources.mined': '채굴',
    'resources.spent': '사용',
    'resources.reward': '보상 획득',
    'resources.resource': '자원',
    'resources.owned': '보유',
    'resources.bonus': '보너스',
    'resources.recent': '최근 획득',
    'resources.nextShortage': '부족 재료',
    'resources.noShortage': '대기 없음',
    'resources.totalOwned': '총 보유 {total}',
    'resources.waitingNodes': '재료 대기 {count}종',
    'resources.affordableCore': '해금 가능 코어 {count}개',
    'resources.nextGoal': '다음 목표: {target} · {resource} 필요',
    'settings.title': '설정',
    'settings.subtitle': '게임, 소리, 화면 설정',
    'settings.language': '언어',
    'settings.reducedMotion': '움직임 줄이기',
    'settings.mute': '음소거',
    'settings.masterVolume': '전체 음량',
    'settings.sfxVolume': '효과음',
    'settings.visualAssets': '비주얼 에셋',
    'settings.openDebug': '디버그 패널 열기',
    'reward.title': '보상 선택',
    'reward.autoHint': '다음 채굴면에 적용할 효과를 고르세요. 시간이 끝나면 선택된 보상이 적용됩니다.',
    'reward.manualHint': '보상을 하나 고르면 채굴이 계속됩니다.',
    'reward.autoPick': '선택 예정',
    'offline.title': '오프라인 보상',
    'offline.continue': '채굴 계속하기',
    'offline.credited': '반영',
    'chapter.title': '챕터 클리어',
    'chapter.body': '챕터 코어를 부쉈습니다. 엔드리스 코어는 이후 빌드에서 열립니다.',
    'chapter.viewDeepCore': '깊은 코어 보기',
    'core.title': '채굴 코어',
    'core.subtitle': '노드 {total}개 · 해금 {active}개',
    'core.resetView': '보기 초기화',
    'core.nodeBoard': '채굴 코어 노드 보드',
    'core.selectedNode': '선택한 노드',
    'core.state': '상태',
    'core.branch': '가지',
    'core.rarity': '희귀도',
    'core.parents': '부모 조건',
    'core.effect': '효과',
    'core.cost': '비용',
    'core.condition': '조건',
    'core.conditionOwned': '이미 해금되었습니다.',
    'core.conditionReady': '해금 가능',
    'core.conditionNeedParent': '먼저 {name} 해금이 필요합니다.',
    'core.conditionNeedResource': '{name}이 더 필요합니다.',
    'core.activeValue': '적용값',
    'core.costPreset': '비용 등급',
    'core.noParents': '없음',
    'core.free': '무료',
    'core.unlock': '해금',
    'core.unlockOwned': '이미 해금됨',
    'core.unlockLocked': '조건 부족',
    'core.badgeActive': '해금됨',
    'core.badgeAffordable': '해금 가능',
    'core.badgeAvailable': '재료 부족',
    'core.badgeLocked': '조건 필요',
    'core.parentReady': '충족',
    'core.parentMissing': '미충족',
    'state.owned': '보유',
    'state.unlockable': '해금 가능',
    'state.locked': '잠김',
    'state.available': '재료 부족',
    'rank.common': '일반',
    'rank.magic': '마법',
    'rank.rare': '희귀',
    'rank.unique': '고유',
    'rank.center': '중심',
    'rewardRank.common': '일반',
    'rewardRank.uncommon': '고급',
    'rewardRank.rare': '희귀',
    'duration.immediate': '즉시',
    'duration.nextFaceStart': '다음 채굴면 진입 시',
    'duration.nextFaceActive': '이번 채굴면에서',
    'duration.nextFaceClear': '채굴면 완료 시',
    'language.ko': '한국어',
    'language.en': 'English'
  },
  en: {
    'aria.topHud': 'Top status',
    'aria.resources': 'Open resources',
    'aria.settings': 'Open settings',
    'aria.miningFace': 'Mining face',
    'aria.bottomControls': 'Quick controls',
    'aria.heldEquipment': 'Held equipment',
    'hud.depth': 'Depth',
    'hud.autoOn': 'AUTO',
    'hud.autoOff': 'Manual',
    'bottom.resources': 'Resources',
    'bottom.core': 'Mining Core',
    'bottom.auto': 'AUTO',
    'bottom.settings': 'Settings',
    'equipment.lanternBranch': 'Open Lantern branch',
    'equipment.pickaxeBranch': 'Open Pickaxe branch',
    'equipment.glovesBranch': 'Open Gloves branch',
    'panel.close': 'Close',
    'resources.title': 'Resources',
    'resources.subtitle': 'Current stock and lifetime ledgers',
    'resources.current': 'Current',
    'resources.mined': 'Mined',
    'resources.spent': 'Spent',
    'resources.reward': 'Reward gained',
    'resources.resource': 'Resource',
    'resources.owned': 'Owned',
    'resources.bonus': 'Bonus',
    'resources.recent': 'Recent bonus',
    'resources.nextShortage': 'Next shortage',
    'resources.noShortage': 'None waiting',
    'resources.totalOwned': '{total} owned total',
    'resources.waitingNodes': '{count} types waiting',
    'resources.affordableCore': '{count} unlockable core nodes',
    'resources.nextGoal': 'Next goal: {target} needs {resource}',
    'settings.title': 'Settings',
    'settings.subtitle': 'Gameplay, sound, and visual options',
    'settings.language': 'Language',
    'settings.reducedMotion': 'Reduced motion',
    'settings.mute': 'Mute',
    'settings.masterVolume': 'Master volume',
    'settings.sfxVolume': 'SFX volume',
    'settings.visualAssets': 'Visual assets',
    'settings.openDebug': 'Open Debug Panel',
    'reward.title': 'Reward Encounter',
    'reward.autoHint': 'Choose a reward. The highlighted reward applies when time runs out.',
    'reward.manualHint': 'Choose one reward before mining continues.',
    'reward.autoPick': 'Applies soon',
    'offline.title': 'Offline Reward',
    'offline.continue': 'Continue mining',
    'offline.credited': 'credited',
    'chapter.title': 'Chapter Clear',
    'chapter.body': 'The Chapter Core is broken. Endless Core gameplay is reserved for a future build.',
    'chapter.viewDeepCore': 'View Deep Core',
    'core.title': 'Mining Core',
    'core.subtitle': '{total} nodes · {active} unlocked',
    'core.resetView': 'Reset View',
    'core.nodeBoard': 'Mining Core node board',
    'core.selectedNode': 'Selected node',
    'core.state': 'State',
    'core.branch': 'Branch',
    'core.rarity': 'Rarity',
    'core.parents': 'Parent requirement',
    'core.effect': 'Effect',
    'core.cost': 'Cost',
    'core.condition': 'Condition',
    'core.conditionOwned': 'Already unlocked.',
    'core.conditionReady': 'Ready to unlock.',
    'core.conditionNeedParent': 'Unlock {name} first.',
    'core.conditionNeedResource': 'Need more {name}.',
    'core.activeValue': 'Active value',
    'core.costPreset': 'Cost preset',
    'core.noParents': 'None',
    'core.free': 'Free',
    'core.unlock': 'Unlock node',
    'core.unlockOwned': 'Unlocked',
    'core.unlockLocked': 'Requirements missing',
    'core.badgeActive': 'Unlocked',
    'core.badgeAffordable': 'Unlockable',
    'core.badgeAvailable': 'Need materials',
    'core.badgeLocked': 'Requirement',
    'core.parentReady': 'Ready',
    'core.parentMissing': 'Missing',
    'state.owned': 'Owned',
    'state.unlockable': 'Unlockable',
    'state.locked': 'Locked',
    'state.available': 'Need resources',
    'rank.common': 'Common',
    'rank.magic': 'Magic',
    'rank.rare': 'Rare',
    'rank.unique': 'Unique',
    'rank.center': 'Center',
    'rewardRank.common': 'Common',
    'rewardRank.uncommon': 'Uncommon',
    'rewardRank.rare': 'Rare',
    'duration.immediate': 'Immediate',
    'duration.nextFaceStart': 'Next face start',
    'duration.nextFaceActive': 'Next face active',
    'duration.nextFaceClear': 'Next face clear',
    'language.ko': '한국어',
    'language.en': 'English'
  }
} as const satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof (typeof TRANSLATIONS)['ko'];

export function t(language: Language, key: TranslationKey, values: Record<string, string | number> = {}): string {
  let text: string = TRANSLATIONS[language][key] ?? TRANSLATIONS.ko[key] ?? key;
  for (const [name, value] of Object.entries(values)) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
}

const RESOURCE_NAMES: Record<Language, Record<ResourceId, { name: string; short: string }>> = {
  ko: {
    STONE: { name: '돌', short: '돌' },
    COAL: { name: '석탄', short: '석탄' },
    COPPER: { name: '구리', short: '구리' },
    IRON: { name: '철', short: '철' },
    GOLD: { name: '금', short: '금' },
    CRYSTAL: { name: '수정', short: '수정' },
    DIAMOND: { name: '다이아', short: '다이아' }
  },
  en: {
    STONE: { name: 'Stone', short: 'Stone' },
    COAL: { name: 'Coal', short: 'Coal' },
    COPPER: { name: 'Copper', short: 'Copper' },
    IRON: { name: 'Iron', short: 'Iron' },
    GOLD: { name: 'Gold', short: 'Gold' },
    CRYSTAL: { name: 'Crystal', short: 'Crystal' },
    DIAMOND: { name: 'Diamond', short: 'Diamond' }
  }
};

const BRANCH_NAMES: Record<Language, Record<MiningCoreBranch, string>> = {
  ko: {
    CENTER: '중심',
    PICKAXE: '곡괭이',
    LANTERN: '랜턴',
    GLOVES: '장갑',
    DEEP_CORE: '깊은 코어'
  },
  en: {
    CENTER: 'Core',
    PICKAXE: 'Pickaxe',
    LANTERN: 'Lantern',
    GLOVES: 'Gloves',
    DEEP_CORE: 'Deep Core'
  }
};

const LAYER_NAMES: Record<Language, Record<string, string>> = {
  ko: {
    'Dirt Layer': '흙층',
    'Stone Layer': '암석층',
    'Coal Vein': '석탄 광맥',
    'Iron Depth': '철 심도',
    'Crystal Cave': '수정 동굴',
    'Diamond Depth': '다이아 심도'
  },
  en: {}
};

const EFFECT_SUMMARIES_KO: Record<string, string> = {
  CENTER_UNLOCK: '채굴 코어의 중심입니다.',
  PICKAXE_BASE_UNLOCK: '곡괭이 가지를 엽니다.',
  LANTERN_BASE_UNLOCK: '랜턴 가지를 엽니다.',
  GLOVES_BASE_UNLOCK: '장갑 가지를 엽니다.',
  DEEP_CORE_BASE_UNLOCK: '깊은 코어 가지를 엽니다.',
  PICKAXE_CRACK_PLUS: '타격 시 추가 균열 확률이 증가합니다.',
  PICKAXE_REQUIRED_HIT_REDUCTION: '블록 필요 타격 수가 줄어듭니다.',
  PICKAXE_HARD_CRACK_PLUS: '밀도 높은 암석 첫 타격이 강해집니다.',
  PICKAXE_ORE_CRACK_PLUS: '광석 첫 타격이 강해집니다.',
  PICKAXE_FIRST_HIT_PLUS: '각 블록의 첫 타격이 더 강해집니다.',
  PICKAXE_FOCUSED_CRACK_CHANCE: '집중 타격 추가 균열 확률이 증가합니다.',
  LANTERN_ORE_SPOT_WEIGHT: '광석 지점 등장 비중이 증가합니다.',
  LANTERN_VEIN_WEIGHT: '광맥 채굴면 등장 비중이 증가합니다.',
  LANTERN_RICH_WEIGHT: '풍부한 채굴면 등장 비중이 증가합니다.',
  LANTERN_RARE_WEIGHT: '희귀 채굴면 등장 비중이 증가합니다.',
  LANTERN_ORE_DENSITY_CHANCE: '광석 밀도 증가 확률이 오릅니다.',
  LANTERN_ORE_BONUS_CHANCE: '광석 추가 자원 확률이 오릅니다.',
  LANTERN_ORE_UPGRADE_CHANCE: '광석 등급 상승 확률이 오릅니다.',
  GLOVES_HIT_INTERVAL_REDUCTION: '타격 간격이 줄어듭니다.',
  GLOVES_OPENING_ACCELERATION_CHANCE: '초반 타격 가속 확률이 증가합니다.',
  GLOVES_CRACK_TRACKING_PRIORITY: '자동 채굴이 균열 진행 블록을 더 선호합니다.',
  GLOVES_BREAK_RECOVERY_CHANCE: '파괴 후 회복 확률이 증가합니다.',
  GLOVES_DEBRIS_CLEAR_SPEED: '채굴면 전환 시간이 줄어듭니다.',
  GLOVES_RESONANT_BREAK_CHANCE: '주변 블록 공명 균열 확률이 증가합니다.',
  DEEP_CORE_EXTRA_MATERIAL_CHANCE: '추가 재료 획득 확률이 증가합니다.',
  DEEP_CORE_OFFLINE_EFFICIENCY: '오프라인 채굴 효율이 증가합니다.',
  DEEP_CORE_OFFLINE_DEPTH_CAP: '오프라인 최대 진행 깊이가 증가합니다.',
  DEEP_CORE_STARTING_FRACTURE_CHANCE: '새 채굴면 시작 균열 확률이 증가합니다.',
  DEEP_CORE_REWARD_QUALITY: '보상 품질 가중치가 증가합니다.',
  DEEP_CORE_MATERIAL_FIND_CHANCE: '보상 선택 시 추가 재료 발견 확률이 증가합니다.',
  DEEP_CORE_ENDLESS_TAB_OPEN: '엔드리스 코어 확장을 엽니다.',
  PICKAXE_CRACKED_WALL: '다음 채굴면을 미리 균열냅니다.',
  PICKAXE_CRACK_BOMB: '무작위 칸에 깊은 균열을 냅니다.',
  PICKAXE_CENTER_SPLIT: '가운데와 십자 칸을 먼저 가릅니다.',
  PICKAXE_HARD_BREAKER: '단단한 블록 첫 타격이 강해집니다.',
  PICKAXE_FIRST_SMASH_REWARD: '각 블록의 첫 타격이 강해집니다.',
  PICKAXE_HEAVY_PICK: '타격마다 추가 균열이 생길 수 있습니다.',
  PICKAXE_ORE_CHISEL_REWARD: '광석 첫 타격이 강해집니다.',
  PICKAXE_BREAKTHROUGH: '파괴 시 주변 칸도 갈라집니다.',
  PICKAXE_CORE_SMASH: '가운데 칸이 깊게 균열됩니다.',
  PICKAXE_STONE_CRUSHER: '암석 칸들이 먼저 갈라집니다.',
  PICKAXE_DEEP_FRACTURE: '한 줄이 깊게 균열됩니다.',
  LANTERN_FORCE_VEIN: '다음 채굴면을 광맥으로 밝힙니다.',
  LANTERN_FORCE_RICH: '다음 채굴면의 광석이 풍부해집니다.',
  LANTERN_ADD_ORE_SLOT: '광석 칸이 하나 늘어납니다.',
  LANTERN_CLEAR_SIGHT: '광석을 더 선명하게 찾습니다.',
  LANTERN_RARE_SLOT: '희귀 광석 기회가 생깁니다.',
  LANTERN_LAMP_SWEEP: '광석 추가 자원 확률이 생깁니다.',
  LANTERN_HIDDEN_POCKET: '채굴면 완료 시 숨은 자원을 얻습니다.',
  LANTERN_GUIDING_GLOW: '광석 우선 채굴과 보너스가 생깁니다.',
  LANTERN_DIAMOND_GLINT: '고가치 광석 기회가 생깁니다.',
  LANTERN_ORE_ECHO: '광석이 추가 자원으로 메아리칠 수 있습니다.',
  LANTERN_CRYSTAL_SHINE: '수정 보너스 획득 확률이 생깁니다.',
  GLOVES_QUICK_HANDS: '이번 채굴면의 타격이 빨라집니다.',
  GLOVES_FOCUSED_GRIP: '초반 타격이 더 강해집니다.',
  GLOVES_STEADY_OPENING: '일정 타격마다 균열이 추가됩니다.',
  GLOVES_BREAK_RECOVERY_REWARD: '이번 채굴면의 회수가 빨라집니다.',
  GLOVES_CLEAN_BREAK: '이번 채굴면의 타격 간격이 줄어듭니다.',
  GLOVES_CRACK_BURST: '다섯 번째 타격마다 균열이 번집니다.',
  GLOVES_FIRM_GRIP: '타격마다 추가 균열 기회가 생깁니다.',
  GLOVES_PERFECT_SWING: '첫 스윙이 크게 강해집니다.',
  GLOVES_DEBRIS_CLEAR_HANDS: '두 번째 타격마다 균열이 추가됩니다.',
  GLOVES_SNAP_STRIKE: '초반 타격 회수가 크게 빨라집니다.',
  GLOVES_RESONANT_HANDS: '파괴 시 주변 칸이 공명합니다.'
};

const EFFECT_SUMMARIES_EN: Record<string, string> = {
  CENTER_UNLOCK: 'Center node of the Mining Core.',
  PICKAXE_BASE_UNLOCK: 'Opens the Pickaxe branch.',
  LANTERN_BASE_UNLOCK: 'Opens the Lantern branch.',
  GLOVES_BASE_UNLOCK: 'Opens the Gloves branch.',
  DEEP_CORE_BASE_UNLOCK: 'Opens the Deep Core branch.',
  PICKAXE_CRACK_PLUS: 'Increases the chance for extra cracks on hit.',
  PICKAXE_REQUIRED_HIT_REDUCTION: 'Reduces required hits per block.',
  PICKAXE_HARD_CRACK_PLUS: 'Improves first hits against dense rock.',
  PICKAXE_ORE_CRACK_PLUS: 'Improves first hits against ore blocks.',
  PICKAXE_FIRST_HIT_PLUS: 'Adds power to the first hit on each block.',
  PICKAXE_FOCUSED_CRACK_CHANCE: 'Increases focused-hit extra crack chance.',
  LANTERN_ORE_SPOT_WEIGHT: 'Raises ore spot face weight.',
  LANTERN_VEIN_WEIGHT: 'Raises vein face weight.',
  LANTERN_RICH_WEIGHT: 'Raises rich face weight.',
  LANTERN_RARE_WEIGHT: 'Raises rare face weight.',
  LANTERN_ORE_DENSITY_CHANCE: 'Raises ore density chance.',
  LANTERN_ORE_BONUS_CHANCE: 'Raises extra resource chance from ore.',
  LANTERN_ORE_UPGRADE_CHANCE: 'Raises ore upgrade chance.',
  GLOVES_HIT_INTERVAL_REDUCTION: 'Reduces hit interval.',
  GLOVES_OPENING_ACCELERATION_CHANCE: 'Raises opening acceleration chance.',
  GLOVES_CRACK_TRACKING_PRIORITY: 'Makes AUTO prefer cracked blocks more.',
  GLOVES_BREAK_RECOVERY_CHANCE: 'Raises break recovery chance.',
  GLOVES_DEBRIS_CLEAR_SPEED: 'Reduces face transition time.',
  GLOVES_RESONANT_BREAK_CHANCE: 'Raises nearby resonant cracking chance.',
  DEEP_CORE_EXTRA_MATERIAL_CHANCE: 'Raises extra material chance.',
  DEEP_CORE_OFFLINE_EFFICIENCY: 'Improves offline AUTO efficiency.',
  DEEP_CORE_OFFLINE_DEPTH_CAP: 'Raises offline depth cap.',
  DEEP_CORE_STARTING_FRACTURE_CHANCE: 'Raises new-face starting fracture chance.',
  DEEP_CORE_REWARD_QUALITY: 'Improves reward quality weight.',
  DEEP_CORE_MATERIAL_FIND_CHANCE: 'Raises extra material find chance from rewards.',
  DEEP_CORE_ENDLESS_TAB_OPEN: 'Opens the Endless Core expansion.',
  PICKAXE_CRACKED_WALL: 'Pre-cracks the next mining face.',
  PICKAXE_CRACK_BOMB: 'Adds deep cracks to random cells.',
  PICKAXE_CENTER_SPLIT: 'Splits the center and cross cells.',
  PICKAXE_HARD_BREAKER: 'Hard block first hits are stronger.',
  PICKAXE_FIRST_SMASH_REWARD: 'First hits on each block are stronger.',
  PICKAXE_HEAVY_PICK: 'Hits can add an extra crack.',
  PICKAXE_ORE_CHISEL_REWARD: 'Ore block first hits are stronger.',
  PICKAXE_BREAKTHROUGH: 'Breaking a cell cracks neighbors.',
  PICKAXE_CORE_SMASH: 'Deeply cracks the center cell.',
  PICKAXE_STONE_CRUSHER: 'Pre-cracks rock cells.',
  PICKAXE_DEEP_FRACTURE: 'Deeply cracks one line.',
  LANTERN_FORCE_VEIN: 'Lights the next face into a vein.',
  LANTERN_FORCE_RICH: 'Makes the next face rich with ore.',
  LANTERN_ADD_ORE_SLOT: 'Adds one ore cell.',
  LANTERN_CLEAR_SIGHT: 'Finds ore more clearly.',
  LANTERN_RARE_SLOT: 'Adds a rare ore opportunity.',
  LANTERN_LAMP_SWEEP: 'Adds ore bonus material chance.',
  LANTERN_HIDDEN_POCKET: 'Grants hidden resources on clear.',
  LANTERN_GUIDING_GLOW: 'Adds ore priority and ore bonus chance.',
  LANTERN_DIAMOND_GLINT: 'Adds a high-value ore opportunity.',
  LANTERN_ORE_ECHO: 'Ore can echo into extra resources.',
  LANTERN_CRYSTAL_SHINE: 'Adds crystal bonus material chance.',
  GLOVES_QUICK_HANDS: 'Speeds hits for this face.',
  GLOVES_FOCUSED_GRIP: 'Early hits are stronger.',
  GLOVES_STEADY_OPENING: 'Adds cracks every few hits.',
  GLOVES_BREAK_RECOVERY_REWARD: 'Speeds recovery for this face.',
  GLOVES_CLEAN_BREAK: 'Reduces hit interval for this face.',
  GLOVES_CRACK_BURST: 'Every fifth hit spreads cracks.',
  GLOVES_FIRM_GRIP: 'Hits can add an extra crack.',
  GLOVES_PERFECT_SWING: 'The first swing is much stronger.',
  GLOVES_DEBRIS_CLEAR_HANDS: 'Every second hit adds a crack.',
  GLOVES_SNAP_STRIKE: 'Early strike recovery is much faster.',
  GLOVES_RESONANT_HANDS: 'Breaking a cell resonates nearby.'
};

export function resourceName(language: Language, resource: ResourceId, short = false): string {
  const label = RESOURCE_NAMES[language][resource] ?? RESOURCE_NAMES.en[resource];
  return short ? label.short : label.name;
}

export function branchName(language: Language, branch: MiningCoreBranch): string {
  return BRANCH_NAMES[language][branch] ?? BRANCH_NAMES.en[branch];
}

export function layerName(language: Language, source: string): string {
  return LAYER_NAMES[language][source] ?? source;
}

export function rarityName(language: Language, rarity: MiningCoreRarity): string {
  const key = `rank.${rarity.toLowerCase()}` as TranslationKey;
  return t(language, key);
}

export function nodeStateName(language: Language, state: NodeState): string {
  if (state === 'ACTIVE') return t(language, 'state.owned');
  if (state === 'AFFORDABLE') return t(language, 'state.unlockable');
  if (state === 'AVAILABLE') return t(language, 'state.available');
  return t(language, 'state.locked');
}

export function rewardRankName(language: Language, rank: RewardRank): string {
  const key = `rewardRank.${rank.toLowerCase()}` as TranslationKey;
  return t(language, key);
}

export function rewardDurationName(language: Language, duration: RewardDuration): string {
  const keys: Record<RewardDuration, TranslationKey> = {
    IMMEDIATE: 'duration.immediate',
    NEXT_FACE_START: 'duration.nextFaceStart',
    NEXT_FACE_ACTIVE: 'duration.nextFaceActive',
    NEXT_FACE_CLEAR: 'duration.nextFaceClear'
  };
  return t(language, keys[duration]);
}

export function rewardKindLabel(language: Language, kind: RewardKind): string {
  if (kind === 'PICKAXE') return branchName(language, 'PICKAXE');
  if (kind === 'LANTERN') return branchName(language, 'LANTERN');
  if (kind === 'GLOVES') return branchName(language, 'GLOVES');
  return language === 'ko' ? '재료' : 'Material';
}

export function rewardName(choice: RewardChoice, language: Language): string {
  return language === 'ko' ? choice.nameKo : choice.nameEn;
}

export function rewardDescription(choice: RewardChoice, language: Language): string {
  if (choice.kind === 'MATERIAL' && choice.resource) {
    if (language === 'ko') return `${resourceName(language, choice.resource)} ${choice.amount ?? 0}개 획득`;
    return `Gain ${choice.amount ?? 0} ${resourceName(language, choice.resource)}.`;
  }
  if (language === 'en') return choice.description;
  const summaries: Record<string, string> = {
    PICKAXE_CRACKED_WALL: '다음 채굴면의 모든 칸이 한 번 균열됩니다.',
    PICKAXE_CRACK_BOMB: '무작위 세 칸이 깊게 균열됩니다.',
    PICKAXE_CENTER_SPLIT: '가운데와 십자 칸이 먼저 갈라집니다.',
    PICKAXE_HARD_BREAKER: '단단한 블록 첫 타격이 강해집니다.',
    PICKAXE_FIRST_SMASH_REWARD: '각 목표의 첫 타격에 균열이 추가됩니다.',
    PICKAXE_HEAVY_PICK: '타격마다 추가 균열 확률이 생깁니다.',
    PICKAXE_ORE_CHISEL_REWARD: '광석 첫 타격에 균열이 추가됩니다.',
    PICKAXE_BREAKTHROUGH: '블록 파괴 시 인접 칸도 갈라집니다.',
    PICKAXE_CORE_SMASH: '가운데 칸이 깊게 균열된 채 시작합니다.',
    PICKAXE_STONE_CRUSHER: '광석이 아닌 암석 네 칸이 먼저 갈라집니다.',
    PICKAXE_DEEP_FRACTURE: '한 줄이 더 깊게 균열됩니다.',
    LANTERN_FORCE_VEIN: '다음 채굴면이 최소 광맥 등급이 됩니다.',
    LANTERN_FORCE_RICH: '다음 채굴면이 풍부한 광석을 가집니다.',
    LANTERN_ADD_ORE_SLOT: '다음 채굴면에 광석 칸 하나를 추가합니다.',
    LANTERN_CLEAR_SIGHT: '자동 채굴이 광석을 더 강하게 우선합니다.',
    LANTERN_RARE_SLOT: '다음 채굴면에 희귀 광석 기회를 추가합니다.',
    LANTERN_LAMP_SWEEP: '광석이 같은 자원을 하나 더 줄 수 있습니다.',
    LANTERN_HIDDEN_POCKET: '다음 채굴면 완료 시 숨은 자원을 얻습니다.',
    LANTERN_GUIDING_GLOW: '자동 채굴이 광석을 더 우선하고 광석 보너스가 생깁니다.',
    LANTERN_DIAMOND_GLINT: '다음 채굴면에 고가치 광석 기회를 추가합니다.',
    LANTERN_ORE_ECHO: '광석이 같은 자원을 추가로 남길 수 있습니다.',
    LANTERN_CRYSTAL_SHINE: '수정 블록이 추가 수정을 줄 수 있습니다.',
    GLOVES_QUICK_HANDS: '이번 채굴면의 타격 간격이 줄어듭니다.',
    GLOVES_FOCUSED_GRIP: '초반 타격이 더 강해집니다.',
    GLOVES_STEADY_OPENING: '세 번째 타격마다 균열이 추가됩니다.',
    GLOVES_BREAK_RECOVERY_REWARD: '이번 채굴면의 타격 회수가 빨라집니다.',
    GLOVES_CLEAN_BREAK: '이번 채굴면의 타격 간격이 줄어듭니다.',
    GLOVES_CRACK_BURST: '다섯 번째 타격마다 주변 칸도 균열됩니다.',
    GLOVES_FIRM_GRIP: '타격마다 추가 균열 확률이 생깁니다.',
    GLOVES_PERFECT_SWING: '첫 스윙이 크게 강해집니다.',
    GLOVES_DEBRIS_CLEAR_HANDS: '두 번째 타격마다 균열이 추가됩니다.',
    GLOVES_SNAP_STRIKE: '초반 세 번의 타격 회수가 크게 빨라집니다.',
    GLOVES_RESONANT_HANDS: '블록 파괴 시 주변 칸도 균열됩니다.'
  };
  return choice.effectKey ? summaries[choice.effectKey] ?? choice.description : choice.description;
}

export function effectSummary(language: Language, effectKey: string, value: number | undefined): string {
  const table = language === 'ko' ? EFFECT_SUMMARIES_KO : EFFECT_SUMMARIES_EN;
  const summary = table[effectKey] ?? (language === 'ko' ? '효과가 적용됩니다.' : 'Effect is active.');
  if (!value) return summary;
  return `${summary} (${value})`;
}

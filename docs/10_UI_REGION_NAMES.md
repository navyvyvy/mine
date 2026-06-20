# UI Region Names / UI 영역 이름

## 1. Naming Rule

All UI documents use:

```text
한국어명 / ENGLISH_REGION_ID
```

Component names use PascalCase.
CSS classes use kebab-case.
Region IDs use SCREAMING_SNAKE_CASE.

## 2. Main Screen Regions

### 상단 상태 HUD 영역 / TOP_STATUS_HUD_REGION

Shows depth, layer, session timer, and compact resources only. It must not contain active reward/effect chips.

Component: TopStatusHudRegion
CSS: .ui-region-top-status-hud

Contains:
- 깊이/지층 표시 / DEPTH_LAYER_DISPLAY
- 세션 시간 표시 / SESSION_TIMER_DISPLAY
- 자원 표시줄 / RESOURCE_STRIP

### 채굴면 영역 / MINING_FACE_REGION

Shows the current 3x3 Mining Face.

Component: MiningFaceRegion
CSS: .ui-region-mining-face

Contains block cells, crack overlays, target highlight, hit impact effects, break effects, and resource fly start points.

### 손/장비 영역 / HAND_EQUIPMENT_REGION

Shows first-person hands, lantern, pickaxe, gloves, and lower-center quick controls. Equipment artwork itself must not steal Mining Face input.

Component: HandEquipmentRegion
CSS: .ui-region-hand-equipment

Contains:
- 왼손 영역 / LEFT_HAND_REGION
- 오른손 영역 / RIGHT_HAND_REGION
- 하단 중앙 퀵컨트롤 영역 / LOWER_CENTER_QUICK_CONTROL_REGION
- 자동 채굴 토글 영역 / AUTO_TOGGLE_REGION
- 자원 버튼 영역 / RESOURCE_BUTTON_REGION
- 채굴 코어 버튼 영역 / MINING_CORE_BUTTON_REGION
- 설정 버튼 영역 / SETTINGS_BUTTON_REGION
- 곡괭이 타격 영역 / PICKAXE_SWING_REGION
- 랜턴 빛 영역 / LANTERN_GLOW_REGION

## 3. Interactive Regions

### 하단 중앙 퀵컨트롤 영역 / LOWER_CENTER_QUICK_CONTROL_REGION

Contains the small AUTO / 자원 / 채굴 코어 / 설정 quick controls. It sits between the two hands and is not a bottom HUD bar.

### 자원 버튼 영역 / RESOURCE_BUTTON_REGION

Action: openResourceScreen()

### 채굴 코어 버튼 영역 / MINING_CORE_BUTTON_REGION

Action: openMiningCore()

### 자동 채굴 토글 영역 / AUTO_TOGGLE_REGION

Icon: ∞
Action: toggleAutoMining()

### 설정 버튼 영역 / SETTINGS_BUTTON_REGION

Icon: ⚙
Action: openSettingsPanel()

## 4. Conditional Regions

### 활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION

Also called: 임시 효과 칩 / 이번 채굴면 효과 칩.

Shows active or pending Reward Encounter effects after a reward is selected.
This is the small next-face-only effect indicator, not the centered Reward Encounter selection panel.

Placement rule:
- not inside TOP_STATUS_HUD_REGION
- not at the top HUD right edge
- not mixed with the compact resource summary
- appears below the thin top HUD, above the Mining Face
- compact and one-line where possible
- disappears when the next-face-only effect is consumed or expired
- must not overlap TOAST_BANNER_REGION

Stacking rule with toast:
- TEMP_EFFECT_CHIP_REGION is the persistent under-HUD effect lane while an effect exists
- TOAST_BANNER_REGION is transient and anchors under the HUD on the left side
- TEMP_EFFECT_CHIP_REGION anchors under the HUD on the right side
- both regions remain outside the top HUD row and must not cover the HUD resource summary

### 토스트/배너 영역 / TOAST_BANNER_REGION

Shows short event notifications.

Placement rule:
- directly below the thin top HUD when no active reward chip is visible
- below TEMP_EFFECT_CHIP_REGION when an active reward chip is visible
- must never overlap the active reward chip
- must never overlap the top HUD row

## 5. Overlay Regions

- 모달 오버레이 영역 / MODAL_OVERLAY_REGION
- 보상 발견 영역 / REWARD_ENCOUNTER_REGION
- 오프라인 보상 영역 / OFFLINE_REWARD_REGION
- 챕터 클리어 영역 / CHAPTER_CLEAR_REGION
- 디버그 패널 영역 / DEBUG_PANEL_REGION

## 6. Screen and Panel Regions

### 채굴 코어 화면 영역 / MINING_CORE_SCREEN_REGION

Sub-regions:
- 채굴 코어 맵 영역 / MINING_CORE_MAP_REGION
- 노드 툴팁 영역 / NODE_TOOLTIP_REGION
- 노드 상세 영역 / NODE_DETAIL_REGION
- 코어 초기화 액션 영역 / CORE_RESET_ACTION_REGION

### 자원 화면 영역 / RESOURCE_SCREEN_REGION

Sub-regions:
- 현재 자원 영역 / CURRENT_RESOURCE_REGION
- 누적 요약 영역 / LIFETIME_SUMMARY_REGION
- 가지별 사용량 영역 / BRANCH_SPENDING_REGION
- 로그 필터 영역 / LOG_FILTER_REGION
- 통합 로그 영역 / UNIFIED_LOG_REGION

### 설정 패널 영역 / SETTINGS_PANEL_REGION

Sub-regions:
- 오디오 설정 영역 / AUDIO_SETTINGS_REGION
- 게임플레이 설정 영역 / GAMEPLAY_SETTINGS_REGION
- 저장 설정 영역 / SAVE_SETTINGS_REGION
- 정보 영역 / ABOUT_REGION

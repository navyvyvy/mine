# UI Screen Flow / UI 화면 흐름

## 1. Screen List

MVP screens and overlays:
- Main Mining Screen
- 채굴 코어 화면 영역 / MINING_CORE_SCREEN_REGION
- 자원 화면 영역 / RESOURCE_SCREEN_REGION
- 설정 패널 영역 / SETTINGS_PANEL_REGION
- 보상 발견 영역 / REWARD_ENCOUNTER_REGION
- 오프라인 보상 영역 / OFFLINE_REWARD_REGION
- 챕터 클리어 영역 / CHAPTER_CLEAR_REGION
- 디버그 패널 영역 / DEBUG_PANEL_REGION

## 2. Load Priority

On game load:
1. Save validation / migration
2. Offline Reward popup if eligible
3. Chapter Clear if pending
4. Reward Encounter if already open
5. Main Mining Screen

## 3. Main Mining Screen Flow

Main Mining Screen → tap 자원 quick control → Resource Screen → close → Main Mining Screen

Main Mining Screen → tap 채굴 코어 quick control → Mining Core Screen → close → Main Mining Screen

Main Mining Screen → tap 설정 quick control → Settings Panel → close → Main Mining Screen

Main Mining Screen → tap AUTO quick control → AUTO ON/OFF

Main Mining Screen → AUTO OFF + tap Mining Face cell → manual mining strike on tapped cell

Equipment artwork is not the primary panel entry point in MVP. It must not steal Mining Face input.

## 4. Mining Core Screen

Region: 채굴 코어 화면 영역 / MINING_CORE_SCREEN_REGION

Contains:
- 채굴 코어 맵 영역 / MINING_CORE_MAP_REGION
- 노드 툴팁 영역 / NODE_TOOLTIP_REGION
- 노드 상세 영역 / NODE_DETAIL_REGION
- 코어 초기화 액션 영역 / CORE_RESET_ACTION_REGION

Entry focus:
- Lantern tap → Lantern branch centered
- Pickaxe tap → Pickaxe branch centered
- Gloves tap → Gloves branch centered

Mining pauses while Mining Core Screen is open.

## 5. Resource Screen

Region: 자원 화면 영역 / RESOURCE_SCREEN_REGION

Contains:
- 현재 자원 영역 / CURRENT_RESOURCE_REGION
- 누적 요약 영역 / LIFETIME_SUMMARY_REGION
- 가지별 사용량 영역 / BRANCH_SPENDING_REGION
- 로그 필터 영역 / LOG_FILTER_REGION
- 통합 로그 영역 / UNIFIED_LOG_REGION

Mining pauses while Resource Screen is open.

## 6. Settings Panel

Region: 설정 패널 영역 / SETTINGS_PANEL_REGION

Contains:
- 오디오 설정 영역 / AUDIO_SETTINGS_REGION
- 게임플레이 설정 영역 / GAMEPLAY_SETTINGS_REGION
- 저장 설정 영역 / SAVE_SETTINGS_REGION
- 정보 영역 / ABOUT_REGION

Mining pauses while Settings Panel is open.

## 7. Reward Encounter

Region: 보상 발견 영역 / REWARD_ENCOUNTER_REGION

Trigger:
Mining Face clear, then encounter pacing check.

Behavior:
- mining pauses
- AUTO pauses
- player selects one of two rewards
- selected reward applies
- active/pending effects may show in 임시 효과 칩 영역 / TEMP_EFFECT_CHIP_REGION

## 8. Offline Reward

Region: 오프라인 보상 영역 / OFFLINE_REWARD_REGION

Shows offline elapsed time, applied efficiency, depth gained, faces cleared, resources gained, and confirm button.

## 9. Chapter Clear

Region: 챕터 클리어 영역 / CHAPTER_CLEAR_REGION

Trigger:
Chapter Core Face is cleared.

## 10. Pause and Resume

Mining pauses when a screen, panel, or modal is open.

Mining resumes when the blocking UI closes, AUTO is ON, and current face is valid.


## Development Debug Layout

During development, `?debug` opens the Debug Panel as a side panel.

Layout:

```text
GAME VIEWPORT | DEBUG SIDE PANEL
```

The Debug Panel should not cover the game viewport in this mode.

The game can remain visible and running while debug values are inspected.

Debug controls can still pause, resume, step, add resources, set depth, force rewards, and test assets.

## Overlay and Scroll Rules

Normal panels open as overlays above the main screen and must not shift the whole GameStage.

Rules:

```text
Top HUD remains stable.
Main layout remains stable.
Hands/equipment may dim behind panels.
Visible browser scrollbars are hidden in normal player UI.
No horizontal scrollbars in normal panels.
Touch drag / mouse wheel / trackpad scroll may still work.
```


Fixed HUD rule:

```text
Top HUD left = depth + cave/layer.
Top HUD center = time/progress.
Top HUD right = compact resources.
Quick controls are centered in the empty space between the two hands, not in a bottom bar.
```

Panel entry rules:

```text
AUTO / 자원 / 채굴 코어 / 설정 are small quick controls centered between the two hands.
No separate bottom HUD bar exists.
Equipment artwork does not open panels when it would conflict with Mining Face input.
```

## Reward Effect Chip Flow

After a Reward Encounter selection, next-face-only reward effects may be pending or active.

The small indicator for this is:

```text
활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION
also known as: 임시 효과 칩 / 이번 채굴면 효과 칩
```

This is different from the Reward Encounter selection panel.

Rules:

```text
Reward Encounter panel = centered blocking choice overlay.
TEMP_EFFECT_CHIP_REGION = compact effect indicator after selection.
TEMP_EFFECT_CHIP_REGION appears below the thin top HUD.
TEMP_EFFECT_CHIP_REGION does not occupy the top HUD right resource area.
TEMP_EFFECT_CHIP_REGION does not replace toast messages.
TEMP_EFFECT_CHIP_REGION must not overlap toast messages.
When both TEMP_EFFECT_CHIP_REGION and TOAST_BANNER_REGION are visible, anchor the effect chip under the HUD on the right side and the toast under the HUD on the left side.
TEMP_EFFECT_CHIP_REGION disappears when the one-face effect is consumed or expired.
```

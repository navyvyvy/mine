# Save Data and Logs / 저장 데이터와 로그

## Save

Use localStorage.

Save key:

```text
endless-mine-save-v1
```

Save import/export is not part of MVP.

Runtime UI state such as activePanel is not persisted as normal save data.

## Resource Screen

자원 화면 영역 / RESOURCE_SCREEN_REGION contains:

1. 현재 자원 영역 / CURRENT_RESOURCE_REGION
2. 누적 요약 영역 / LIFETIME_SUMMARY_REGION
3. 가지별 사용량 영역 / BRANCH_SPENDING_REGION
4. 통합 로그 영역 / UNIFIED_LOG_REGION

Resource display format:

```text
🪨 돌 / Stone
보유: 1,240
총 채굴: 4,810
총 사용: 3,200
총 반환: 420
```

Resource order: STONE, COAL, COPPER, IRON, GOLD, CRYSTAL, DIAMOND.

## Logs

Normal UI logs are grouped by meaningful events.

Do not show block-by-block logs in normal UI.

Create logs for:

- Mining Face clear
- Reward selected
- Material reward gained
- Node unlocked
- Branch reset
- Full core reset
- Offline reward claimed
- Layer reached
- AUTO toggled
- Chapter Clear

Log categories:

- MINING
- REWARD
- CORE
- RESET
- OFFLINE
- PROGRESS
- SYSTEM

Examples:

```text
[채굴] 312m 철 심층 채굴면 클리어
획득: 🪨 돌 +3, ⛓ 철 +2, 🟡 금 +1

[보상] 철 조각 / Iron Bundle 선택
획득: ⛓ 철 +6

[보상] 균열 폭탄 / Crack Bomb 선택
효과: 다음 채굴면 3칸 균열 +2

[강화] 철 곡괭이 / Iron Pickaxe 해금
사용: 🪨 돌 -450, ⛓ 철 -80

[초기화] 곡괭이 가지 초기화
반환: 🪨 돌 +405, ⛓ 철 +72

[오프라인] 2시간 14분 채굴 보상
깊이: +42m
획득: 🪨 돌 +180, ⚫ 석탄 +64, 🟠 구리 +22

[진행] 수정 동굴 / Crystal Cave 도달
깊이: 900m

[챕터] 다이아 코어 채굴 완료
보상: 💎 다이아 +10
```

## Settings

Settings Panel includes:

- Master Volume
- SFX Volume
- Mute
- Reduced Motion
- Resource Fly Text
- Debug Panel Toggle
- Clear Save
- Version
- Build Time


## Log Display Limit

Normal Resource Screen log display should show recent meaningful logs.

Recommended:

- show latest 50 entries
- group repeated mining logs when needed
- do not show every block hit
- do not show every individual animation event

Debug Panel may show more detailed internal events if needed.


## Visual Asset Mode Setting

Settings include:

```ts
visualAssetMode: 'GENERATED' | 'IMAGE' | 'AUTO'
```

Default:

```ts
visualAssetMode = 'GENERATED'
```

Settings Panel label:

```text
그래픽 표시 방식
```

Options:

- Generated
- Image
- Auto


## Autosave Policy

Save immediately after important events.

Important events:

- Mining Face clear
- depth increase
- layer unlock
- Reward Encounter opened
- Reward Encounter selected
- material reward applied
- node unlocked
- node reset
- branch reset
- full core reset
- passive-affecting node state changed
- equipment/core visual tier changed
- offline reward claimed
- Chapter Clear
- Settings changed
- visualAssetMode changed
- sound volume or mute changed
- debug action mutates saved game state

Periodic autosave:

```ts
autosaveIntervalMs = 10000
```

Browser events:

- save on visibilitychange hidden
- save on beforeunload

Mining Face clear save is mandatory because it is the main progression beat.

## Save Migration and Repair Reference

Save migration and repair details are defined in:

```text
docs/41_SAVE_MIGRATION_AND_REPAIR.md
```

This includes:

- save version
- load pipeline
- repair rules
- autosave policy
- debug save tools

## Save Persistence Requirements

Save data must persist:

```text
resources
depth / highest depth
current or regeneratable Mining Face state
unlocked Mining Core nodes
selected language
AUTO state
settings
chapter clear state
lastPlayedAt / lastActiveAt
offline reward summary if pending
```

Save migration must not crash older saves.

Language default is Korean when no setting exists.

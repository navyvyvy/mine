
# Localization and Copy Tone / 한글화와 문구 톤

## 1. Purpose

This document defines player-facing language, UI text tone, and localization rules.

이 문서는 플레이어에게 보이는 문구, UI 톤, 한글화 규칙을 정의한다.

## 2. Default Language

Default language:

```text
ko-KR
```

Settings must allow:

```text
한국어
English
```

Selected language must persist in save data.

## 3. Scope

All normal player-facing UI must use localization keys.

Localize:

```text
HUD labels
bottom controls
panel titles
Settings
Resources
Reward cards
Reward descriptions
Reward timeout text
Mining Core node details
unlock conditions
cost labels
toast messages
offline reward summary
Chapter Core / Chapter Clear messages
temporary effect chips
```

Debug Panel may use English or mixed technical text.

## 4. Forbidden Normal UI Text

Normal UI must not expose internal/debug wording.

Do not show these in normal gameplay UI:

```text
raw node id
raw slot
raw effectKey
raw branch key
parent id list
cost preset
internal validation details
manual target
current target
reward auto pick
AUTO가 선택합니다
자동이 선택합니다
effectKey-style names
raw system state labels
```

These may appear only in Debug Panel.

## 5. Korean Copy Tone

Player-facing Korean should be short, natural, and game-like.

Avoid machine-translated or overly explanatory text.

Prefer:

```text
곧 선택됩니다
잠시 후 진행
보상 적용
다음 채굴면으로 이동
채굴 중
대기 중
해금 가능
재료 부족
조건 필요
이미 해금됨
챕터 코어 발견
오프라인 보상
```

Avoid:

```text
AUTO가 선택합니다
자동 선택 예정
현재 타겟
수동 타겟
reward auto pick
manual mining target
```

## 6. Reward Copy

Reward card title and description must explain the actual effect in Korean.

Examples:

```text
빠른 손놀림
이번 채굴면 동안 타격 속도가 빨라집니다.

광맥의 빛
다음 채굴면에 광맥이 더 잘 드러납니다.

돌 꾸러미
돌을 즉시 얻습니다.
```

Timeout text must be natural:

```text
곧 선택됩니다
잠시 후 진행
```

Do not say:

```text
AUTO가 선택합니다
자동이 선택합니다
```

## 7. Toast Copy

Toast messages should be short and reserved for major events.
Small resource gains such as STONE +1 or COAL +1 are not global toast messages; they are local Mining Face flyouts with the format `+amount icon`.

Examples:

```text
보상 적용: 빠른 손놀림
채굴 코어 해금
챕터 코어 발견
오프라인 보상 도착
```

## 8. Mining Core Copy

Normal node detail should show only:

```text
node name
effect summary
cost
unlock condition
unlock button
```

Examples:

```text
빠른 손놀림 I
타격 간격이 조금 줄어듭니다.
비용: 돌 30
조건: 낡은 장갑 해금
[해금]
```

Internal IDs must not be shown in normal node board labels or normal detail panel.

## 8. v34 Toast Placement and Copy

Toast should feel attached to the game HUD layer, not to the browser window.

Position rules:

```text
not top-right
not inside the top HUD itself
directly below the thin top HUD
top-center or slightly right-of-center under the HUD
compact enough to avoid blocking Mining Face for long
fade out quickly
```

Visual rules:

```text
dark translucent mine-style panel
small icon
short Korean text
lantern-colored border/glow if needed
consistent typography with game UI
```

Good examples:

```text
재료가 부족합니다
채굴 코어 해금
보상 적용
석탄 +3
```

## Active Reward Chip Copy

The small next-face reward/buff indicator uses this region name:

```text
활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION
```

Player-facing copy should be short and clear.

Good examples:

```text
이번 채굴면 효과: 빠른 손놀림
다음 채굴면: 광맥의 빛
균열 폭탄 대기 중
광맥 한 줄 강화
``` 

Avoid:

```text
active reward effect
pending buff
reward effect chip
AUTO가 선택한 효과
```

Do not place this text inside the top HUD resource summary.

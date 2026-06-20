# HUD Resource Display and Responsive UI / HUD 자원 표시와 반응형 UI

## 1. Purpose

This document defines how the main HUD displays resources, how the Resource Panel presents resource data, and how the game scales around the 480x720 portrait reference viewport.

## 2. Base Viewport

Base viewport:

```ts
GAME_BASE_WIDTH = 480
GAME_BASE_HEIGHT = 720
GAME_ASPECT_RATIO = 2 / 3
```

Minimum supported portrait size:

```ts
GAME_MIN_WIDTH = 360
GAME_MIN_HEIGHT = 640
```

Rules:

```text
480x720 is reference resolution only, not fixed physical screen size.
The game viewport scales responsively.
Desktop layout centers the portrait game viewport.
Debug Panel may appear beside/over the viewport, but must not shift it unpredictably.
```

## 3. Fixed Top HUD Resource Layout

The top HUD has a fixed left/center/right information structure:

```text
left fixed                 center fixed              right fixed
깊이 + 동굴/지층 정보          시간/진행                 핵심 자원 요약
```

Example:

```text
⛏ 811m  수정 동굴        1:06        석177 철36 수정2
```

Rules:

```text
depth/layer stays left
time/progress stays centered
resource summary stays right-aligned
positions do not shift depending on text length
top HUD remains a thin strip
```

## 4. Main HUD Resource Limit

The top HUD cannot show all resources at all times.

Rule:

```ts
maxVisibleHudResources = 3
```

If more resources are relevant, show only the most important/owned resources and let the Resource Panel show the full list.

## 5. HUD Resource Priority

Sort visible HUD resources by this priority:

1. DIAMOND if owned or Diamond Depth reached
2. resource required by selected or nearest AFFORDABLE/AVAILABLE Mining Core node
3. current layer primary resource
4. recently gained resource
5. scarce resource for near-future unlock
6. STONE
7. COAL
8. COPPER
9. IRON
10. GOLD
11. CRYSTAL

Do not show every resource if it makes the top HUD cramped.

## 6. Current Layer Primary Resources

| Layer | Primary HUD Resources |
|---|---|
| Dirt Layer | STONE, COAL |
| Stone Layer | STONE, COAL, COPPER |
| Coal Vein | STONE, COAL, COPPER, IRON |
| Iron Depth | STONE, COAL, COPPER, IRON, GOLD |
| Crystal Cave | STONE, COAL, COPPER, IRON, GOLD, CRYSTAL |
| Diamond Depth | STONE, COAL, COPPER, IRON, GOLD, CRYSTAL, DIAMOND |

Primary resources include lower-tier resources because deeper layers continue to use mixed Mining Core costs. The HUD still displays only the top compact subset, but gain feedback must not skip resources that are not currently visible.

## 7. HUD Visual Rules

Use a single compact resource summary strip.

Do not use:

```text
individual bordered resource pills
large resource cards
thick outline per resource
oversized resource icons
repeated labels per resource in the HUD
```

Use:

```text
small icon or short Korean resource label
compact number
consistent spacing
right-aligned resource group
```

## 8. Resource Panel Table Layout

The Resource Panel uses a compact resource ledger table, not repeated large cards.

The table columns are fixed:

```text
자원 | 보유 | 채굴 | 사용 | 보너스
```

Column meaning:

```text
자원 = resource icon/name
보유 = current owned amount
채굴 = amount gained by mining, preferably total or current-run mined amount
사용 = amount spent/used
보너스 = amount gained through bonus effects or current bonus contribution
```

Do not put next-goal or shortage text inside the table columns.
Terms like 다음 목표, 부족 재료, 해금 가능, 현재 목표 belong in the bottom summary area, not in each resource row.

Avoid ambiguous or compressed labels such as 다음부족 or 최근보너스.
Do not use a column named 사용처 / 부족 재료.

Rules:

```text
one row per resource
small icon per resource
short column labels only
numbers aligned cleanly
no large bordered card per resource
no repeated identical labels in every row
Korean by default
rows must not wrap awkwardly
columns should remain readable in 480x720 reference layout
```

Example:

```text
자원    보유   채굴   사용   보너스
석탄    177    231    54     +3
철      36     48     12     +0
수정    2      3      1      +1
```

If some statistics such as 채굴, 사용, or 보너스 are not currently tracked, implement lightweight resource statistics for them rather than replacing the columns with goal text.

## 9. Resource Panel Bottom Summary

The Resource Panel should not show only raw resource statistics.

A compact bottom summary may show one or two useful resource-related facts below the table:

```text
next unlock material shortage
recently gained resources
current important material goal
how many currently affordable Mining Core nodes exist
current most-needed resource
```

Examples:

```text
다음 해금까지: 석탄 8 부족
해금 가능 코어: 2개
최근 획득: 수정 +1
현재 목표: 석탄을 모아 초기 코어를 해금하세요
```

Bottom summary text must not break the table alignment.
Do not add a complex economy screen.
Keep it compact and useful.

## 10. Touch Target Rule

Minimum touch target:

```ts
MIN_TOUCH_TARGET = 44
SMALL_ICON_TOUCH_TARGET = 40
```

Rules:

```text
visible art may be smaller than hitbox
quick controls may use small visible icons with adequate invisible hitboxes
Reward card choice should be easy to tap
Debug side panel controls may be smaller only on desktop
```

## 11. Mining Face Sizing

At 480x720:

```text
Mining Face should occupy the central area.
Each cell should render around 88~112px.
Gap should feel like rock seams, not UI card spacing.
```

Recommended:

```css
.mining-face {
  width: min(82vw, 336px);
  aspect-ratio: 1 / 1;
}
```

Cell sizing:

```css
.mining-cell {
  min-width: 88px;
  min-height: 88px;
}
```

At smaller screens, scale down proportionally.

## 12. Normal Panel Scrollbar Rule

Normal game panels should hide visible browser-style scrollbars.

Apply to:

```text
Resource Panel
Mining Core Panel
Settings Panel
Reward Panel if needed
normal modal/panel content
```

Rules:

```text
scrolling may work
visible scrollbars are hidden
horizontal scrollbars are not allowed in normal UI
pan/drag boards should hide scrollbars
Debug logs may scroll inside a fixed log box only
```

## 13. Validation

Manual validation:

```text
480x720 looks like the intended main layout
360x640 remains playable
top HUD does not overflow
timer remains centered
resources remain right-aligned
HUD shows max 3 resources
Resource Panel shows all resources in compact table rows
Resource Panel columns are exactly 자원 / 보유 / 채굴 / 사용 / 보너스
normal panels hide visible scrollbars
horizontal scrollbars do not appear in normal UI
3x3 cells are large enough to read damage states
```

## Active Reward Chip vs HUD Resources

The top HUD right side is reserved for compact resource summary only.

The active next-face reward/buff indicator is:

```text
활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION
```

Rules:

```text
TEMP_EFFECT_CHIP_REGION is not part of the resource strip.
TEMP_EFFECT_CHIP_REGION must not occupy the HUD right edge.
TEMP_EFFECT_CHIP_REGION appears below the thin top HUD.
TEMP_EFFECT_CHIP_REGION must not overlap toast.
TEMP_EFFECT_CHIP_REGION is anchored below the thin HUD toward the right side.
TOAST_BANNER_REGION is anchored below the thin HUD toward the left side.
Both remain outside the HUD row.
Both ellipsize internally if text is too long.
TEMP_EFFECT_CHIP_REGION uses compact one-line Korean text.
```

## 8. Resource Gain Feedback

Resource gain feedback is split into local Mining Face feedback and top HUD emphasis.

### 8.1 Local Mining Face Flyout

Every actual resource gain from a broken Mining Face block emits a local flyout near the mined cell.

Rules:

```text
show +amount first, then the resource icon
example: +1 [stone icon]
example: +1 [coal icon]
do not show only +1
do not use icon +amount order
do not depend on HUD resource priority
do not depend on ore-only blocks
base STONE gains must also show flyout
```

This is local mining feedback, not a global toast.

### 8.2 Top HUD Resource Pulse

When a resource amount increases and that resource is currently visible in the top HUD, pulse that HUD resource number/icon.

Rules:

```text
use transform/animation, not layout-changing font-size
HUD height and layout must not shift
compact number formatting must stay intact
repeated gains of the same resource must retrigger the pulse
if the gained resource is not currently visible, keep the local flyout and do not expand the HUD
```

Recommended pulse duration: 220ms~400ms.
Recommended scale: about 1.12~1.2 with subtle brightness/glow.

### 8.3 Global Toast Scope

Global toast is for major events only, such as reward application, Mining Core unlocks, chapter events, offline reward, or important warnings.

Do not spam global toast for every STONE/COAL/COPPER gain.

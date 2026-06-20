# Main Screen HUD and Navigation / 메인 화면 HUD와 내비게이션

## 1. Purpose

This document defines the final Main Mining Screen layout, top HUD, quick controls, and normal interaction entry points.

The main screen must read as a first-person idle mining game, not a web app dashboard.

## 2. Reference Layout

Reference canvas: 480 x 720.  
This is a reference layout only. The actual screen scales responsively.

```text
┌────────────────────────────────────────┐
│ ⛏ 811m  수정 동굴        1:06     석177 철36 수정2 │
├────────────────────────────────────────┤
│            재료가 부족합니다            │  ← toast, below HUD
│       이번 채굴면 효과: 빠른 손놀림      │  ← active reward chip, below HUD
│                                        │
│                                        │
│            ┌────┬────┬────┐            │
│            │    │    │    │            │
│            ├────┼────┼────┤            │  ← 3x3 Mining Face
│            │    │    │    │              primary visible/clickable area
│            ├────┼────┼────┤            │
│            │    │    │    │            │
│            └────┴────┴────┘            │
│                                        │
│  left hand + lantern      right hand + pickaxe
│       lower-left              lower-right
│                                        │
│             [AUTO][자원][코어][설정]    │  ← tiny quick controls
└────────────────────────────────────────┘
```

## 3. Fixed Top HUD Grid Rule

The top HUD is a thin fixed information strip.

The positions are locked:

```text
left fixed      center fixed       right fixed
깊이 + 동굴정보      시간/진행          핵심 자원 요약
```

Recommended composition:

```text
⛏ 811m  수정 동굴        1:06        석177 철36 수정2
```

Rules:

```text
left = depth + current cave/layer/type
center = session time or current progress time
right = compact resource summary, right-aligned to the HUD end
```

Do not let these regions drift based on text length or state changes.
The timer must remain visually centered.
Resources must remain aligned to the right end.
Depth and cave/layer information must remain aligned to the left.

## 4. Top HUD Forbidden Elements

Do not put these in the top HUD:

```text
AUTO toggle
manual/auto state control
Settings button
large control buttons
large resource pills
individual bordered resource cards
thick outlines around each resource
browser-like toast text
```

The top HUD is not a control bar.
It is information only.

## 5. Top HUD Visual Rule

The top HUD should feel like a thin overlay, not a panel.

Rules:

```text
low height
single baseline alignment
small icons
compact numbers
no heavy borders
no large capsules
no separate bordered pill per resource
resources do not dominate the mining screen
```

If too many resources are relevant, show only the important/owned resources in the HUD and show full details in the Resource Panel.

## 6. Toast Placement

Toast is not part of the HUD itself.

Rules:

```text
not top-right
not inside the HUD row
directly below the thin top HUD
top-center or slightly right-of-center below HUD
compact width
one-line preferred
fade quickly
```

Examples:

```text
재료가 부족합니다
채굴 코어 해금
보상 적용
석탄 +3
```

## 7. Active Reward Chip Placement

The active next-face reward/buff indicator is called:

```text
활성 보상 칩 영역 / TEMP_EFFECT_CHIP_REGION
also known as: 임시 효과 칩 / 이번 채굴면 효과 칩
```

This is not the Reward Encounter selection panel.
The Reward Encounter panel itself may remain centered in the screen.
This rule is for the small indicator shown after a reward is selected and while the next-face-only effect is pending or active.

Placement rules:

```text
not inside the top HUD row
not at the top HUD right edge
not mixed with the resource summary
below the thin top HUD
above the Mining Face
compact one-line chip when possible
short Korean text
small icon allowed
no large card
no permanent space reservation when no effect exists
must not overlap toast
```

Stacking with Toast:

```text
TEMP_EFFECT_CHIP_REGION is a persistent effect-status chip.
TOAST_BANNER_REGION is a transient event message.
When both are visible, place the active reward chip under the HUD on the right side and the toast under the HUD on the left side.
Do not vertically stack them by default.
Do not let either element cover the other or collide with HUD text.
```

Examples:

```text
이번 채굴면 효과: 빠른 손놀림
다음 채굴면: 광맥의 빛
균열 폭탄 대기 중
```

The top HUD right edge is reserved for compact resources only.
Do not place this chip there.

## 8. Mining Face

The 3x3 Mining Face is the main visual and interaction area.

Rules:

```text
must remain fully visible
must remain clickable/tappable
must not be covered by resting hands, lantern, pickaxe, or quick controls
cell click/tap has priority when AUTO is OFF
```

Cell index for debug only:

```text
0 1 2
3 4 5
6 7 8
```

Cell indices are Debug overlay only and must not appear in normal gameplay.

## 9. First-Person Equipment Region

First-person equipment frames the bottom foreground.

Layout:

```text
left hand + lantern = lower-left foreground
right hand + pickaxe = lower-right foreground
```

Rules:

```text
hands/equipment stay lower than the Mining Face in resting pose
resting equipment does not cover Mining Face cells
pickaxe may enter a target cell only during strike/impact
lantern may cast light upward but its body must not cover cells
```

## 10. Equipment Motion Rule

The idle screen should feel alive.

AUTO mining motion:

```text
right hand moves with the pickaxe during aim/wind-up/impact/recover
pickaxe head reaches the target cell at impact
hand and pickaxe remain visually connected
impact feedback occurs on the exact target cell
```

Lantern support motion:

```text
left hand/lantern performs subtle idle sway
once every few hits, lantern may lift or tilt slightly toward the Mining Face
lantern glow may briefly strengthen ore glints or cracks
lantern motion must not cover Mining Face cells
```

This motion is visual only and must not change reward value, ore probability, target selection, or depth.

## 11. Quick Controls Placement

There is no separate bottom HUD bar.

Quick controls are placed in the lower-center foreground, exactly in the empty visual space between the left hand/lantern and the right hand/pickaxe.

Required quick controls:

```text
AUTO
자원
채굴 코어
설정
```

Rules:

```text
quick controls are centered between the two hands
quick controls do not reserve a full-width bottom area
quick controls do not push the Mining Face upward
quick controls do not cover the Mining Face
quick controls do not cover hand/lantern/pickaxe artwork
quick controls use small icon-first buttons
large text buttons are not allowed
large rectangular cards are not allowed
oversized circular buttons are not allowed
thick bordered control panels are not allowed
```

Tiny labels are allowed if needed, but icons should carry the main meaning.

## 12. AUTO Toggle

Icon suggestion: ∞

States:

```text
AUTO ON = lit / active
AUTO OFF = dim / inactive
```

AUTO state saves and loads.

## 13. Equipment Input Rule

For MVP:

```text
Mining Face click/tap has priority.
Equipment artwork should not steal Mining Face clicks.
Use quick-control 채굴 코어 to open Mining Core.
Equipment branch shortcuts are optional/future and must not interfere with mining input.
```

## 14. Validation

Manual validation:

```text
Top HUD left/center/right positions remain fixed.
Timer remains visually centered.
Resource summary remains right-aligned.
Top HUD does not contain AUTO or Settings controls.
Toast appears below the HUD, not inside it and not top-right.
Active reward chip appears below the HUD too, but as a compact persistent effect chip, not as a toast and not in the HUD right resource area.
No full-width bottom HUD bar is visible.
Quick controls sit in the empty center space between both hands.
Quick controls do not cover hands, lantern, pickaxe, or Mining Face.
Mining Face remains fully visible and clickable.
AUTO OFF cell tap/click mines the tapped cell.
```

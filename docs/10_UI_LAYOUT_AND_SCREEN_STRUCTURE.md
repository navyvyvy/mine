

## Pickaxe Layer

The main mining screen must include a pickaxe layer above the Mining Face.

```text
Mining Face
-> Pickaxe Layer
-> Hit Effects
-> Overlays
```

The pickaxe layer follows the current AUTO target cell.

Reference:

```text
docs/18_FIRST_PERSON_PICKAXE_STRIKE.md
```

## Main Screen Layout Correction

The 3x3 Mining Face is the primary interactive area.

Rules:

```text
Mining Face must remain visible.
Mining Face must remain clickable/tappable.
Hands, lantern, gloves, and pickaxe resting pose must not cover Mining Face cells.
Equipment layer should sit lower in the foreground.
Pickaxe may enter the target cell only during strike/impact.
Equipment layer should not steal Mining Face clicks in normal gameplay.
```

Layer order:

```text
Mine background
3x3 Mining Face
cell hit feedback / cracks / dust
pickaxe impact animation
equipment foreground resting silhouettes
HUD / overlays
```

If AUTO is OFF, Mining Face cell click/tap triggers manual mining first.
Do not open Mining Core by tapping equipment when the tap overlaps the Mining Face.

## Main Screen Reference Layout

Reference resolution: 480 x 720. This is a reference layout only. The actual screen scales responsively.

Current MVP layout is now locked around a full-width square Mining Face.

```text
┌────────────────────────────────────────┐
│  517m   철 심도   38:15      석149 철43 │  ← thin top HUD, 480 x 38
├────────────────────────────────────────┤
│┌────────────── 480 x 480 ─────────────┐│
││                                        ││
││              3x3 Mining Face           ││
││       full width, square, no side gap  ││
││                                        ││
│└────────────────────────────────────────┘│
│                                        │
│  lantern only / left mitten   pickaxe only / right mitten
│  lower-left foreground        lower-right foreground
│                                        │
│              [AUTO][자원][코어][설정]  │  ← tiny quick controls
└────────────────────────────────────────┘
```

Rules:

```text
Top HUD is a thin information strip only.
Mining Face starts directly below the top HUD.
Mining Face is 480 x 480 at the 480px reference width.
Mining Face is a square 3x3 area and must never be stretched vertically.
Mining Face has no left/right margin in the 480px reference layout.
The remaining vertical space below the Mining Face is reserved for foreground equipment and quick controls.
There is no separate full-width bottom HUD bar.
Quick controls are centered in the lower empty space.
```

Important correction:

```text
Do not place a small 3x3 board in the middle of a large cave background.
Do not draw excessive cave wall above or below the 3x3 face.
Do not use a room/floor/ceiling perspective background for MVP.
The 3x3 Mining Face itself is the main background and main object.
```

Foreground equipment rule:

```text
left foreground = lantern + simplified left mitten/back-of-hand shape
right foreground = pickaxe + simplified right mitten/back-of-hand shape
hands are optional/simple framing elements, not precision anatomy
pickaxe and right hand should move as one connected rig if the hand is visible
pickaxe/tool should appear visually in front of the hand where overlap is needed
impact particles should be separate from hand/pickaxe silhouettes and must not look like fingers
```

## Quick Controls Placement Rule

There must be no separate bottom HUD bar.

Place AUTO / 자원 / 채굴 코어 / 설정 as a tiny lower-center quick-control strip in the empty visual space between the left hand/lantern and the right hand/pickaxe.

Required:

```text
left hand + lantern = lower-left foreground
right hand + pickaxe = lower-right foreground
quick controls = lower-center foreground, centered between both hands
quick controls do not reserve a full-width bottom area
quick controls do not push the Mining Face upward
quick controls do not cover the Mining Face
quick controls do not cover hand/lantern/pickaxe artwork
quick controls use small icon-first buttons
large rectangular cards are not allowed
oversized circular buttons are not allowed
thick bordered control panels are not allowed
```

Validation:

```text
No full-width bottom HUD bar is visible.
Quick controls are visually centered in the empty space between the hands.
Hands/equipment frame the controls from left and right.
Mining Face remains the main visual priority and stays clickable.
```

## Normal Panel Scrollbar Rule

Scrolling and panning may work, but browser-style visible scrollbars should be hidden in normal player UI.

Apply to:

```text
Resource Panel
Mining Core Panel
Settings Panel
Reward Panel if content overflows
normal modal/panel content
```

Rules:

```text
hide visible scrollbars
allow touch drag / mouse wheel / trackpad scroll where needed
avoid horizontal scroll completely
Mining Core board should feel like drag-to-pan, not a scrollable web div
Debug logs may scroll inside a log box only
```

## Current Fixed HUD and Quick-Control Layout Rule

Top HUD uses fixed left/center/right regions:

```text
left = depth + cave/layer
center = time/progress
right = compact resources
```

The timer must remain visually centered.
Resources must remain fixed to the right end.
Depth/cave information must remain fixed to the left.

Quick controls are not a bottom HUD. They sit in the lower-center empty space between the two hands and do not cover equipment art or the Mining Face.

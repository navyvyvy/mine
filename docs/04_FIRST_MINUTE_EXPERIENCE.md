# First Minute Experience / 첫 1분 경험

## 1. Purpose

The first minute must show the core fun of Endless Mine.

The player should quickly understand:

- blocks are being mined automatically
- cracks and breaks are visible
- resources are increasing
- the mine moves deeper after a face clear
- resources can unlock Mining Core nodes
- the next goal is visible

## 2. First Minute Timeline

Target pacing:

```text
0~5s
AUTO mining is already active.
Pickaxe swing and impact feedback are visible.

5~15s
First block breaks.
Local `+1 icon` flyout appears near the mined cell.
If that resource is visible in the top HUD, its number/icon pulses.

15~40s
Several blocks break.
At least one visible ore or resource reward appears.

40~60s
First Mining Face clear is likely.
Inward face advance transition plays.
Depth increases.
At least one early Mining Core node should be affordable or close to affordable.
```

## 3. First Node Target

The first affordable Mining Core node should be reachable quickly.

Target:

```text
first affordable node within 60~90 seconds
```

This can be achieved through:

- low C1 node costs
- early MATERIAL rewards
- first few Mining Faces giving enough STONE/COAL
- clear node affordability feedback

## 4. Immediate Feedback Requirements

Every hit should show:

- pickaxe swing
- impact flash
- cell shake
- crack update
- hit sound event call

Every block break should show:

- break flash
- dust or fragment effect
- resource icon pop
- resource fly-to-HUD
- HUD count pulse
- resource gain sound event call

Every Mining Face clear should show:

- last break effect
- inward push-in advance transition
- depth HUD pulse
- new Mining Face appearing from darkness

## 5. Early Reward Rhythm

Early layers should offer more immediate material choices.

Dirt Layer and Stone Layer may show MATERIAL vs MATERIAL.

MATERIAL vs MATERIAL rules:

- same rewardId cannot appear on both sides
- same resourceId cannot appear on both sides
- at least one side should help current or near-future Mining Core unlocks

## 6. Mining Core Clarity

When Mining Core is opened during the first minutes:

- affordable nodes should pulse
- selected node should show exact cost
- missing resources should be listed clearly
- unlock button should only be enabled for affordable nodes
- after unlock, the node becomes active immediately
- resource spend and passive change should be logged

Node detail example:

```text
균열 찍기 I / Crack Tap I

비용:
🪨 돌 8 / 보유 12

상태:
해금 가능

[해금]
```

Missing resource example:

```text
철 곡괭이 / Iron Pickaxe

비용:
🪨 돌 450 / 보유 620
⛓ 철 80 / 보유 63

부족:
⛓ 철 17
```

## 7. Validation

Manual validation:

- AUTO starts immediately.
- A block breaks within the first 15 seconds.
- Resource fly feedback is visible.
- The first face clear happens within a reasonable early window.
- The first affordable node is visible within 60~90 seconds.
- Missing resource text is clear.
- Unlocking a node spends resources and activates the node immediately.

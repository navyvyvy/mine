# First-person Pickaxe Strike / 1인칭 곡괭이 타격 연출

## 1. Purpose / 목적

Mining must be readable as first-person action.

채굴은 1인칭 행동으로 읽혀야 한다.

The player should see the pickaxe move toward the currently targeted block and strike it.

플레이어는 곡괭이가 현재 타겟 블록 앞으로 이동해서 내려찍는 것을 봐야 한다.

## 2. Core Rule / 핵심 규칙

```text
Every AUTO hit must have a visible pickaxe strike animation.
```

```text
모든 AUTO 타격에는 눈에 보이는 곡괭이 타격 연출이 있어야 한다.
```

The Mining Face cracking alone is not enough.

채굴면 균열만으로는 충분하지 않다.


## 2.1 MVP Foreground Equipment Lock / MVP 전경 도구 확정

For MVP, the foreground equipment is simplified.

```text
left side = lantern + optional simplified mitten/back-of-hand shape
right side = pickaxe + optional simplified mitten/back-of-hand shape
no detailed individual fingers
no extra finger-like particles near the pickaxe
right hand and pickaxe move together as one rig when the hand is visible
pickaxe is allowed to render visually in front of the hand/mitten
```

Important:

```text
If the right hand looks wrong, do not keep patching individual SVG finger pieces.
Use a simplified mitten/back-of-hand silhouette or temporarily hide the hand.
The pickaxe must remain visible even when the hand is removed.
Removing the hand must never remove the pickaxe or lantern.
```

Layer rule:

```text
Mining Face
-> cracks / hit feedback
-> foreground tool rig: lantern / pickaxe / simple hands
-> HUD / overlays
```

The foreground tool rig must not block Mining Face input.

## 3. Target-linked Pickaxe Motion / 타겟 연동 곡괭이 움직임

The pickaxe must move toward the currently selected target cell.

곡괭이는 현재 선택된 타겟 칸 쪽으로 움직여야 한다.

Target mapping:

```text
cell 0 = upper-left strike position
cell 1 = upper-center strike position
cell 2 = upper-right strike position
cell 3 = middle-left strike position
cell 4 = center strike position
cell 5 = middle-right strike position
cell 6 = lower-left strike position
cell 7 = lower-center strike position
cell 8 = lower-right strike position
```

Implementation concept:

```text
AUTO chooses target cell
-> pickaxe moves toward that cell
-> pickaxe strike animation plays
-> hit is applied at impact timing
-> crack/dust/resource feedback plays on that cell
```

## 4. Animation Phases / 애니메이션 단계

Each hit should have these phases:

```text
READY
AIM_TO_TARGET
WIND_UP
IMPACT
RECOVER
```

Meaning:

```text
READY: pickaxe rests near the right hand area
AIM_TO_TARGET: pickaxe shifts toward the target cell
WIND_UP: pickaxe pulls back slightly
IMPACT: pickaxe snaps down into the target cell
RECOVER: pickaxe returns toward ready position
```

한국어 의미:

```text
READY: 곡괭이가 오른손 근처 기본 위치에 있음
AIM_TO_TARGET: 현재 타겟 칸 앞으로 곡괭이가 이동
WIND_UP: 내려찍기 전 살짝 뒤로 젖힘
IMPACT: 타겟 칸을 향해 빠르게 내려찍음
RECOVER: 기본 위치로 돌아옴
```

## 5. Timing / 타이밍

The hit should apply at `IMPACT`, not at animation start.

타격 판정은 애니메이션 시작이 아니라 `IMPACT` 시점에 적용한다.

Recommended split within one hit interval:

```text
AIM_TO_TARGET: 20%
WIND_UP: 20%
IMPACT: 20%
RECOVER: 40%
```

If the hit interval becomes very short, the animation may compress but should not disappear.

타격 간격이 매우 짧아져도 애니메이션은 압축될 수 있지만 사라지면 안 된다.

## 6. Visual Requirements / 시각 요구사항

Required visible feedback:

```text
pickaxe moves to current target cell
pickaxe impact shake
target cell hit flash
crack overlay update
small dust burst at target cell
resource gain flyout when block breaks: +amount icon
```

Do not show only passive cracks appearing on the wall.

벽에 균열만 조용히 생기는 식으로 만들지 않는다.

## 7. Reduced Motion / 모션 감소 옵션

Reduced motion should simplify the animation, not remove feedback.

모션 감소 옵션은 애니메이션을 단순화하되 피드백을 없애면 안 된다.

Reduced motion behavior:

```text
shorter travel
less rotation
less shake
still show target flash and impact dust
```

## 8. Suggested Components / 권장 컴포넌트

```text
src/components/mining/PickaxeLayer.tsx
src/components/mining/PickaxeSprite.tsx
src/components/mining/HitImpactEffect.tsx
src/hooks/usePickaxeStrikeAnimation.ts
```

The pickaxe layer should sit above the Mining Face and below full-screen overlays.

곡괭이 레이어는 Mining Face 위, 전체 화면 오버레이 아래에 둔다.

Suggested structure:

```tsx
<div className="mining-face-stage">
  <MiningFace />
  <PickaxeLayer targetCellIndex={currentTargetCellIndex} strikeState={strikeState} />
  <MiningHitEffects />
</div>
```

## 9. State Model / 상태 모델

Recommended state:

```ts
type PickaxeStrikePhase =
  | 'READY'
  | 'AIM_TO_TARGET'
  | 'WIND_UP'
  | 'IMPACT'
  | 'RECOVER';

type PickaxeStrikeState = {
  phase: PickaxeStrikePhase;
  targetCellIndex: number | null;
  startedAtMs: number;
  impactAtMs: number;
  endsAtMs: number;
};
```

The game loop should know when impact happens.

게임 루프는 타격 판정 시점을 알아야 한다.

## 10. Debug Panel / 디버그 패널

Debug Panel should expose pickaxe animation tuning values.

Debug Panel은 곡괭이 애니메이션 튜닝값도 노출해야 한다.

Required values:

```text
pickaxeAimDurationRatio
pickaxeWindUpDurationRatio
pickaxeImpactDurationRatio
pickaxeRecoverDurationRatio
pickaxeTravelScale
pickaxeImpactShake
pickaxeReducedMotionScale
```

Rule:

```text
These values affect game feel, so they must be visible and adjustable in Debug Panel.
```

## Lantern Advance Reveal / 랜턴 진입 연출

The game should not instantly swap from Reward Encounter to the next Mining Face.

보상 선택 후 다음 채굴면으로 즉시 바뀌면 안 된다.

After the player selects a Reward Encounter choice, use a short first-person lantern reveal before the next Mining Face becomes fully visible.

보상 선택 후 다음 채굴면이 완전히 보이기 전에, 짧은 1인칭 랜턴 밝힘 연출을 사용한다.

### Trigger / 발동 조건

Use this reveal only for meaningful transitions.

의미 있는 전환에서만 사용한다.

```text
Reward Encounter choice selected
-> tunnel / darkness transition
-> lantern light sweeps forward
-> next Mining Face is revealed
-> AUTO mining resumes
```

Do not play this reveal after every normal face clear.

일반 채굴면을 하나 깰 때마다 이 연출을 재생하지 않는다.

Recommended triggers:

```text
after Reward Encounter selection
after major layer change
after Chapter Core reveal
```

Not recommended:

```text
every face clear
every depth increase
every AUTO hit
```

### Feel / 체감

The reveal should feel like a short loading/advance moment, not a blocking cutscene.

이 연출은 막히는 컷신이 아니라 짧은 로딩/전진 체감이어야 한다.

Target feel:

```text
short darkness
lantern glow expands
wall texture fades in
ore glints appear slightly later
AUTO resumes after reveal
```

### Timing / 시간

Recommended default:

```text
lanternRevealDurationMs = 650
lanternRevealMinMs = 350
lanternRevealMaxMs = 1200
```

Reduced motion:

```text
reducedMotionLanternRevealMs = 180
```

### Implementation Rule / 구현 규칙

The reveal is visual pacing only.

이 연출은 시각적 템포 조절용이다.

It must not change:

```text
reward value
ore probability
face generation result
depth calculation
AUTO target selection
```

### Debug Tuning / Debug 튜닝

Debug Panel must expose:

```text
lanternRevealDurationMs
lanternRevealMinMs
lanternRevealMaxMs
reducedMotionLanternRevealMs
lanternRevealGlowScale
lanternRevealOreGlintDelayMs
```

## Impact Alignment Requirement

Pickaxe correctness is judged by the visible impact point, not by the existence of an animation.

Required:

```text
compute targetCellCenter from the rendered 3x3 grid
at IMPACT, pickaxe head or impact point reaches the targetCellCenter area
impact motion stays within approximately one cell size
damage applies only at IMPACT timing
impact feedback occurs on the exact target cell
resting pickaxe does not cover the Mining Face
```

The handle/hand may remain lower in the screen, but the pickaxe head / strike point must visibly reach the current target block.

Normal gameplay must not show:

```text
yellow debug target box
yellow debug target point
raw hit rectangle
cell id
current target label
```

These are Debug-only overlays.

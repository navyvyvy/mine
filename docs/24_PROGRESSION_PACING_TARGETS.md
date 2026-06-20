# Progression Pacing Targets / 진행 속도 목표

## 1. Purpose

This document defines the Chapter Clear pacing target and the formula used to tune it.

The target should be calculated from Mining Face clear speed, not treated as a fixed timer.

## 2. Locked Target

Chapter Clear target:

```text
Chapter Core Face = chapterClearDepthM
depthPerFaceClear = +1m
targetChapterClearTime = 8~10 hours
hardTargetMax = about 10 hours
```

This is an active/idle mixed play target.

The game does not force a timer.  
The player reaches chapterClearDepthM by clearing Mining Faces.

## 3. Required Average Face Clear Time

Because chapterClearDepthM means about 3000 cleared faces:

```ts
targetSeconds = targetHours * 60 * 60
requiredAverageFaceClearSeconds = targetSeconds / 3000
```

Target range:

| Target Time | Required Average Face Clear Time |
|---:|---:|
| 8h | 9.6s / face |
| 9h | 10.8s / face |
| 10h | 12.0s / face |

Main tuning target:

```text
average face clear time across the full run = about 10~12 seconds
```

## 4. Face Clear Time Formula

Estimated face clear time:

```ts
expectedFaceClearSeconds =
  expectedEffectiveHitsToClearFace * currentHitIntervalMs / 1000
  + faceAdvanceTransitionSeconds
  + rewardPauseContributionSeconds
```

Where:

```text
expectedEffectiveHitsToClearFace
= sum of required hits after crack bonuses, passive effects, reward effects, and target selection efficiency
```

This means pacing is tuned by:

- block requiredHits
- hit interval
- Mining Core speed effects
- crack plus effects
- reward effects
- ore/hard block distribution
- face advance transition duration
- reward encounter frequency

## 5. Layer Time Targets

Approximate target pacing:

| Milestone | Depth | Target Time |
|---|---:|---:|
| First layer change | 50m | 8~12 min |
| Stone Layer complete | 200m | 35~50 min |
| Coal Vein complete | 450m | 1.4~2h |
| Iron Depth complete | 900m | 2.8~3.7h |
| Diamond Depth reached | 1500m | 4.5~5.7h |
| Chapter Core / Chapter Clear | `chapterClearDepthM` | 8~10h |

These are targets for balance testing, not hard timers.

## 6. Early Pacing Targets

First-minute targets remain:

```text
first block break within 15s
first affordable node within 60~90s
first Reward Encounter by 2~5 cleared faces
```

First 10-minute target:

```text
player should understand mining, resource gain, node unlock, reward choice, and face advance
```

## 7. Tuning Rule

If Chapter Clear is too fast:

- increase later face hard block ratio
- increase C4~C6 costs
- reduce late crack chance growth
- reduce offline efficiency
- increase Diamond Depth required hit pressure

If Chapter Clear is too slow:

- increase mid/late reward strength
- increase Gloves speed values
- increase Pickaxe crack values
- lower C4~C6 costs
- increase material rewards for scarce resources

## 8. Debug Panel Requirements

Debug Panel should show:

- average face clear time
- last 10 face clear average
- last 100 face clear average
- projected time to chapterClearDepthM
- current depth per hour
- projected Chapter Clear timestamp
- total cleared faces
- target average face clear time: 10~12s

## 9. Validation

Manual validation after implementation:

- simulate or play until each layer milestone
- compare actual time with target table
- inspect average face clear time
- tune costs/effects/rewards from data
- do not change `chapterClearDepthM` except through runtime tuning / balance validation


## Runtime Depth Tuning Update

Chapter clear depth is configurable.

```ts
chapterClearDepthM = 3000 // initial debug default, not final locked value
offlineMaxDepthRatioBeforeChapterCore = 0.98
offlineMaxDepthBeforeChapterCoreM =
  Math.floor(chapterClearDepthM * offlineMaxDepthRatioBeforeChapterCore)
```

All projections must use `chapterClearDepthM`.

Do not hard-code the final chapter depth in progression logic.


## Chapter Depth Runtime Variable

Use:

```ts
chapterClearDepthM: number
```

Initial debug default:

```ts
chapterClearDepthM = 3000
```

Rule:

```text
3000 is only an initial debug default.
Do not hard-code it as final design depth.
```

Offline limit:

```ts
offlineMaxDepthRatioBeforeChapterCore = 0.98

offlineMaxDepthBeforeChapterCoreM =
  Math.floor(chapterClearDepthM * offlineMaxDepthRatioBeforeChapterCore)
```

All projections must use:

```text
chapterClearDepthM
```

# AUTO and Offline Reward / 자동 채굴과 오프라인 보상

## AUTO

AUTO is ON by default.

AUTO icon: ∞

AUTO uses target scoring and keeps hitting the same target until it breaks.

Target score:

```ts
targetScore =
  resourcePriorityScore
  + crackProgressScore
  + effectPriorityScore
  + patternPriorityScore
  + tieBreakerScore
```

Resource priority:

- STONE 0
- COAL 20
- COPPER 30
- IRON 40
- GOLD 50
- CRYSTAL 65
- DIAMOND 90

AUTO always shows hand movement, swing, impact, crack, block break, resource fly, HUD pulse, and inward face advance transition.

## Offline Eligibility

- AUTO was ON
- Reward Encounter was not open
- valid save exists
- elapsed offline time >= 60 seconds

## Offline Limits

- maxOfflineSeconds = 14400
- offlineEfficiency = 0.35
- maxOfflineDepthAdvance = 50m
- maxOfflineDepthBeforeDiamondCore = offlineMaxDepthBeforeChapterCoreM

Offline reward can progress up to offlineMaxDepthBeforeChapterCoreM.

If offline calculation reaches chapterClearDepthM, clamp depth to 2999 and show:

```text
다음 채굴에서 챕터 코어를 발견할 수 있습니다.
```

Chapter Core Face and Chapter Clear require active online mining.

## AUTO OFF Manual Mining

AUTO OFF must still allow active play.

Rules:

```text
AUTO ON = automatic targetScore selection and repeated mining
AUTO OFF = player clicks/taps a Mining Face cell to trigger one manual strike
manual strike uses the same pickaxe animation system
manual damage applies at IMPACT timing
empty cells may be ignored or use a valid fallback
equipment layer must not steal Mining Face clicks
```

Debug values:

```text
manualMiningEnabled
manualStrikeCooldownMs
```

## Offline Completion Rule

Offline reward is complete only if it actually applies on load.

Required:

```text
save lastPlayedAt / lastActiveAt
calculate elapsed offline time on load
apply offlineEfficiency
apply offlineMaxDepthBeforeChapterCoreM clamp
never clear/pass Chapter Core offline
show Korean offline reward summary
record save/log event
```

Offline reward must not replace active mining.
It is limited support for idle return.

# MVP Implementation Order / MVP 구현 순서

## 1. Source of Truth / 기준 문서

Use the current repository files only.

현재 저장소에 실제로 존재하는 파일만 기준으로 사용한다.

Start by inspecting the actual file tree.

실제 파일 트리를 먼저 확인한다.

## 2. Implementation Target / 구현 대상

Implement the full first playable Web PWA MVP.

작은 skeleton만 만들지 않는다.

The first implementation must include:

```text
core mining loop
3x3 Mining Face
first-person pickaxe strike animation
lantern reveal transition after Reward Encounter
Reward Encounter
resource gain
depth progress
save/load
Resource Screen
Settings Panel
Debug Panel
PWA basics
full Mining Core node data
full Mining Core unlock path
full effectKey handler path
offline reward / offline progress
Chapter Core / Chapter Clear
Korean-English localization
AUTO OFF manual mining
```

## 3. Mining Core Data Requirement / Mining Core 데이터 요구사항

Generated Mining Core data must be integrated into app source.

생성된 Mining Core 데이터는 앱 소스에 반영해야 한다.

Rules:

```text
All generated nodes must exist in runtime.
All generated nodes must be visible in Mining Core UI.
All parent relationships must be respected.
All cost presets must have calculation path.
All effectKeys must be recognized by effect system.
Passive effects must be recalculated from unlocked nodes.
```

The UI may be simple, but the node data scope must be complete.

UI는 단순해도 되지만 노드 데이터 범위는 완전해야 한다.

## 4. Implementation Order / 구현 순서

```text
1. Inspect repository files and package scripts.
2. Create Vite + React + TypeScript app structure if missing.
3. Add generated Mining Core node data to app source.
4. Add runtime tuning config.
5. Add platform adapters:
   - saveStorage
   - platformInfo
   - pwa helpers
6. Implement save/load/migration through saveStorage adapter.
7. Implement 3x3 Mining Face generation and damage stages.
8. Implement AUTO target selection and mining loop.
9. Implement first-person pickaxe strike animation with IMPACT-timed damage.
10. Implement resource gain, face clear, face transition, and depth increase.
11. Implement Reward Encounter.
12. Implement lantern reveal transition after Reward Encounter selection.
13. Implement full Mining Core node UI, unlocks, costs, and passive effects.
14. Implement Resource Screen.
15. Implement Settings Panel.
16. Implement Debug Panel with all tuning values.
17. Implement PWA manifest and basic service worker.
18. Validate generated node count, branch counts, effectKey recognition, and build.
19. Run first playable balance test.
```

## 5. Pickaxe Strike Requirement / 곡괭이 타격 요구사항

Damage must be visually tied to the current target cell.

데미지는 현재 타겟 칸에 대한 곡괭이 타격 연출과 연결되어야 한다.

Sequence:

```text
AUTO selects target cell
-> pickaxe aims toward target cell
-> wind up
-> impact
-> damage applies at IMPACT timing
-> target cell crack/dust/shake feedback
-> recover
```

Do not silently apply damage only because a timer ticked.

타이머 tick만으로 조용히 데미지를 적용하면 안 된다.

## 6. Lantern Reveal Requirement / 랜턴 진입 연출 요구사항

After Reward Encounter selection, reveal the next Mining Face through a short lantern transition.

보상 선택 후 다음 채굴면은 짧은 랜턴 진입 연출로 보여준다.

Sequence:

```text
Reward choice selected
-> reward applied
-> short darkness / tunnel advance
-> lantern glow reveals next Mining Face
-> AUTO mining resumes
```

Do not play this reveal after every normal face clear.

일반 채굴면마다 재생하지 않는다.

## 7. Debug Panel Requirement / Debug Panel 요구사항

Debug Panel must expose all gameplay tuning values.

```text
If a numeric value affects balance, pacing, reward, cost, offline progress, generation, animation, transition, or node effects,
it must be visible and adjustable in Debug Panel during development.
```

Required categories:

```text
runtime tuning values
all numeric constants
animation timing values
pickaxe strike timing values
lantern reveal timing values
all effect values
all caps
reward encounter chances
reward effect values
node effect values
cost budgets
branch cost weights
offline reward values
progression projection values
generated node count
branch node counts
unlocked node count
active effect summary
projected time to chapterClearDepthM
projected chapter clear timestamp
```

## 8. Runtime Tuning / 런타임 튜닝

Use:

```text
chapterClearDepthM
offlineMaxDepthRatioBeforeChapterCore
offlineMaxDepthBeforeChapterCoreM =
  floor(chapterClearDepthM * offlineMaxDepthRatioBeforeChapterCore)
```

Initial debug default:

```text
chapterClearDepthM = 3000
```

This is not a final locked design constant.

최종 고정 설계값이 아니다.

## 9. Platform Rule / 플랫폼 규칙

```text
Web PWA first.
Do not add Tauri runtime in MVP.
Do not add src-tauri.
Keep architecture Tauri-ready.
```

Rules:

```text
isolate platform APIs
use saveStorage adapter
avoid direct localStorage in reducers/systems/game loop
keep static web build
```

## 10. PWA Scope / PWA 범위

Implement simple PWA.

```text
manifest
placeholder icons
theme color
mobile viewport support
installable shell
basic service worker with safe static cache
```

Do not implement:

```text
cloud save
push notification
background sync
account system
```

## 11. Not MVP / MVP 제외

Do not implement:

```text
shop
gacha
ads
prestige
town
home
return
active Endless Core nodes
Tauri runtime
```

## 12. Validation / 검증

Run available project commands only.

package.json scripts must be checked first.

Validate:

```text
build passes
typecheck passes if available
lint passes if available
node count matches generated data
branch counts match generated data
all generated effectKeys are recognized
chapterClearDepthM is not hard-coded as final depth
Debug Panel includes all tuning categories
PWA files exist
```

## Completion Pass Order

Before polish-only work, finish all documented MVP systems and current UI correction items.

Additional implementation order:

```text
20. Complete offline reward / offline progress and Chapter Core clamp.
21. Complete Chapter Core and Chapter Clear flow using chapterClearDepthM.
22. Verify reward effects actually affect gameplay.
23. Verify every generated effectKey has a gameplay handler path.
24. Add / complete Korean-English localization and natural player-facing copy.
25. Fix AUTO OFF manual mining and input priority.
26. Fix pickaxe impact alignment to actual target cell.
27. Fix Mining Core node click, pan, selected detail, and hidden internal IDs.
28. Simplify top HUD and compact bottom controls.
29. Move equipment lower so it does not block the 3x3 Mining Face.
30. Rework Debug Panel as independent fixed/overlay panel with collapsible sections.
31. Make Reward timeout bar visibly decrease or replace it with clear countdown text.
32. Validate save/load, offline, Chapter Core, Reward effects, PWA, node counts, and build.
```

Completion rule:

```text
Do not report a feature as complete just because it exists in code.
It must work and visually behave correctly in the running game screen.
```

Normal player UI rule:

```text
No raw internal IDs, raw effectKeys, raw branch keys, debug target boxes, or system-like copy in normal UI.
```

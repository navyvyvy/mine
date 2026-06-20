# Save Migration and Repair / 저장 마이그레이션과 복구

## 1. Purpose

This document defines save versioning, validation, migration, repair, and autosave behavior.

The game should avoid losing progress due to small save schema changes or minor corrupted values.

## 2. Save Key and Version

Save key:

```ts
SAVE_KEY = 'endless-mine-save-v1'
```

Current save version:

```ts
save.version = 1
```

Save format root:

```ts
type SaveData = {
  version: number;
  createdAt: number;
  updatedAt: number;
  resources: ResourceAmountMap;
  lifetimeMinedResources: ResourceAmountMap;
  lifetimeSpentResources: ResourceAmountMap;
  lifetimeRefundedResources: ResourceAmountMap;
  depth: number;
  maxDepth: number;
  activeNodeIds: number[];
  nodeSpendRecords: Record<number, ResourceAmountMap>;
  currentFace: SerializedMiningFace;
  pendingRewardEncounter?: SerializedRewardEncounter;
  settings: SettingsSaveData;
  playtimeSeconds: number;
  chapterClearCompleted: boolean;
  endlessCore?: EndlessCoreState;
};
```

## 3. Load Pipeline

On load:

```text
1. read localStorage
2. if empty, create fresh save
3. parse JSON
4. validate root shape
5. migrate save if version is older
6. repair minor invalid values
7. validate again
8. use save if valid
9. if unrecoverable, create fresh save and keep error in debug log
```

## 4. Migration

Recommended function:

```ts
function migrateSave(raw: unknown): SaveData {
  // versioned migrations
}
```

For MVP:

```ts
if version === 1:
  no migration needed
```

Future versions should migrate step by step:

```text
v1 -> v2 -> v3
```

Do not skip versions.

## 5. Repair Rules

Repair minor issues when safe.

Examples:

| Issue | Repair |
|---|---|
| missing resource amount | set to 0 |
| negative resource amount | clamp to 0 |
| missing lifetime counters | set to 0 |
| unknown active node id | remove from activeNodeIds |
| duplicate active node id | deduplicate |
| missing nodeSpendRecords for active paid node | set empty map and add debug warning |
| currentHits > requiredHits | clamp to requiredHits |
| currentHits < 0 | clamp to 0 |
| broken cell with currentHits < requiredHits | set currentHits = requiredHits |
| missing settings field | use default setting |
| invalid visualAssetMode | set GENERATED |
| invalid volume | clamp 0~1 |
| depth < 0 | set 0 |
| maxDepth < depth | set maxDepth = depth |

Unrecoverable examples:

- JSON parse failure
- root is not object
- no usable version and no compatible shape
- currentFace cannot be repaired

## 6. Autosave Policy

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

- visibilitychange hidden
- beforeunload

Mining Face clear save is mandatory.

## 7. Save Error UI

Normal UI should stay simple.

If save was repaired:

```text
저장 데이터를 복구했습니다.
```

If unrecoverable and fresh save was created:

```text
저장 데이터를 불러오지 못해 새로 시작했습니다.
```

Debug Panel should show detailed save errors.

## 8. Debug Panel Save Tools

Debug Panel should include:

- current save version
- last save time
- last save reason
- validation status
- repair warnings
- save size
- active node count
- nodeSpendRecords count
- pending reward status
- current face summary

Controls:

- validate save
- repair save
- fresh save
- clear save

No save import/export in MVP.

## 9. Validation

Manual validation:

- fresh save starts correctly
- invalid JSON does not crash the app
- missing resource fields are repaired
- negative resources are clamped
- duplicate active node ids are deduplicated
- Mining Face clear saves immediately
- settings changes save immediately
- debug mutation saves only when it changes saved game state

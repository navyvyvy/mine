# Mining Core Effect Values / 채굴 코어 효과 수치

## 1. Purpose / 목적

This document defines final gameplay behavior and initial tuning values for each `effectKey`.

이 문서는 각 `effectKey`의 최종 동작과 초기 튜닝 수치를 정의한다.

The goal is to prevent ambiguous implementation.

목표는 애매한 구현을 막는 것이다.

## 2. Branch Identity / 가지 컨셉

```text
Pickaxe / 곡괭이
= single-target breaking power
= 한 칸을 더 강하게 깨는 장비
```

```text
Lantern / 랜턴
= ore discovery probability
= 광물 등장 확률, 광물 밀도, 광석 승급 확률을 올리는 장비
```

```text
Gloves / 장갑
= hand-work upgrades
= 손쓰는 일을 강화하는 장비
= 속도, 회수, 잔해 정리, 주변 공명 파괴
```

```text
Deep Core / 심층 코어
= long-term support
= 방치, 장기 확률 보조, 엔드리스 탭 개방
```

## 3. Terms / 용어 정의

```text
chance = actual proc probability
확률 = 실제 발동 확률
```

```text
weight = probability weight used during generation
가중치 = 생성 확률 계산에 들어가는 값
```

```text
priority = targetScore influence
우선순위 = AUTO 타겟 점수에 영향을 주는 값
```

```text
AUTO target choice is handled by targetScore.
AUTO 타겟 선택은 targetScore가 처리한다.
```

Allowed resource support:

```text
chance to gain one extra same resource
chance to add one secondary material line
chance to add one extra ore slot during face generation
chance to upgrade one generated ore within the current layer
```

허용되는 자원 보조:

```text
같은 자원 1개 추가 획득 확률
보조 재료 1줄 추가 등장 확률
채굴면 생성 시 광석 칸 1개 추가 확률
생성된 광석 1개가 지층 내 상위 광석으로 승급될 확률
```

Not allowed:

```text
direct material amount multiplier
guaranteed extra ore count
guaranteed extra block count
delayed cache/chest/storage reward
```

금지:

```text
재료 수량 직접 배수
광물 개수 확정 추가
블록 개수 확정 추가
보관함/상자/지연 수령 보상
```

## 4. Pickaxe Effect Details / 곡괭이 효과 상세

Pickaxe is about breaking the current target harder.

곡괭이는 현재 치는 한 칸을 더 강하게 깨는 장비다.

### 4.1 PICKAXE_CRACK_PLUS

```text
Korean:
타격 시 현재 타겟에 추가 균열이 들어갈 확률

English:
Chance to add one extra crack to the current target on hit

Trigger:
When the current target is hit

Result:
The current target may receive one extra crack

Does not:
Affect adjacent cells
```

Recommended value:

```text
COMMON: 8%
MAGIC: 14%
RARE: 22%
Cap: 60%
```

### 4.2 PICKAXE_REQUIRED_HIT_REDUCTION

```text
Korean:
채굴면 생성 시 일반 암석의 필요 타격 수가 낮아질 확률

English:
Chance to reduce required hits of normal rock when a face is generated

Trigger:
When a Mining Face is generated

Result:
Some normal rock cells may require one fewer hit

Does not:
Reduce ore blocks
Reduce special blocks
Reduce below 1 required hit
```

Recommended value:

```text
COMMON: 10%
MAGIC: 18%
RARE: 30%
Minimum requiredHits: 1
```

### 4.3 PICKAXE_HARD_CRACK_PLUS

```text
Korean:
단단한 블록 첫 타격 시 현재 타겟에 추가 균열이 들어갈 확률

English:
Chance to add one extra crack to the current hard-block target on first hit

Trigger:
First hit on a hard block

Result:
The current hard-block target may receive one extra crack

Does not:
Affect adjacent cells
```

Recommended value:

```text
COMMON: 18%
MAGIC: 32%
RARE: 50%
Cap: 75%
```

### 4.4 PICKAXE_ORE_CRACK_PLUS

```text
Korean:
광석 블록 첫 타격 시 현재 타겟에 추가 균열이 들어갈 확률

English:
Chance to add one extra crack to the current ore-block target on first hit

Trigger:
First hit on an ore block

Result:
The current ore-block target may receive one extra crack

Does not:
Increase ore amount
Change ore appearance chance
```

Recommended value:

```text
COMMON: 14%
MAGIC: 25%
RARE: 40%
Cap: 70%
```

### 4.5 PICKAXE_FIRST_HIT_PLUS

```text
Korean:
새 채굴면에서 첫 타격이 강하게 들어갈 확률

English:
Chance for the first hit of a new face to be stronger

Trigger:
First hit after a new Mining Face appears

Result:
The current target may receive one extra crack

Does not:
Affect multiple cells
```

Recommended value:

```text
COMMON: 12%
MAGIC: 22%
RARE: 36%
Cap: 60%
```

### 4.6 PICKAXE_FOCUSED_CRACK_CHANCE

```text
Korean:
현재 치는 한 칸에 집중 파괴가 발동할 확률

English:
Chance to focus extra breaking power on the current target

Trigger:
When the current target is hit

Result:
The current target may receive one extra crack

Does not:
Affect adjacent cells
Change AUTO target score
```

Recommended value:

```text
COMMON: 10%
MAGIC: 18%
RARE: 30%
Current target only
```

### 4.7 Pickaxe Unique Tier Effects / 곡괭이 유니크 티어 효과

```text
PICKAXE_TIER_STONE
Korean: 돌 곡괭이. 첫 타격 파괴 체감 증가.
English: Stone Pickaxe. Improves first-hit breaking feel.
Effect: first-hit crack chance improves.
```

```text
PICKAXE_TIER_COPPER
Korean: 구리 곡괭이. 광석 블록 첫 타격 체감 증가.
English: Copper Pickaxe. Improves ore-block first-hit breaking.
Effect: ore first-hit crack chance improves.
```

```text
PICKAXE_TIER_IRON
Korean: 철 곡괭이. 단단한 블록 파괴 체감 증가.
English: Iron Pickaxe. Improves hard-block breaking.
Effect: hard-block crack chance improves.
```

```text
PICKAXE_TIER_CRYSTAL
Korean: 수정 곡괭이. 현재 타겟 집중 파괴 체감 증가.
English: Crystal Pickaxe. Improves focused current-target breaking.
Effect: focused crack chance improves.
```

```text
PICKAXE_TIER_DIAMOND
Korean: 다이아 곡괭이. 최종 파괴력 체감 증가.
English: Diamond Pickaxe. Final breaking-power capstone.
Effect: all pickaxe breaking proc chances improve.
```

## 5. Lantern Effect Details / 랜턴 효과 상세

Lantern is about discovering better ore faces.

랜턴은 더 좋은 광물/광맥 채굴면을 발견하는 장비다.

Lantern effects must not guarantee extra ore counts.

랜턴 효과는 광물 개수를 확정 추가하면 안 된다.

### 5.1 LANTERN_ORE_SPOT_WEIGHT

```text
Korean:
광물 점이 있는 채굴면 등장 확률 가중치 증가

English:
Increases probability weight for ore-spot faces

Trigger:
When a Mining Face is generated

Result:
Ore-spot faces become more likely

Does not:
Guarantee extra ore cells
```

Recommended value:

```text
COMMON: weight increases by 1 point
MAGIC: weight increases by 2 points
RARE: weight increases by 3 points
Cap: 45 total weight
```

### 5.2 LANTERN_VEIN_WEIGHT

```text
Korean:
광맥형 채굴면 등장 확률 가중치 증가

English:
Increases probability weight for vein faces

Trigger:
When a Mining Face is generated

Result:
Vein-shaped ore faces become more likely

Does not:
Guarantee a vein every face
```

Recommended value:

```text
COMMON: weight increases by 1 point
MAGIC: weight increases by 2 points
RARE: weight increases by 3 points
Cap: 30 total weight
```

### 5.3 LANTERN_RICH_WEIGHT

```text
Korean:
풍부한 광물 채굴면 등장 확률 가중치 증가

English:
Increases probability weight for rich ore faces

Trigger:
When a Mining Face is generated

Result:
Rich faces become more likely

Does not:
Guarantee rich faces
```

Recommended value:

```text
COMMON: weight increases by 0.5 points
MAGIC: weight increases by 1.5 points
RARE: weight increases by 3 points
Cap: 22 total weight
```

### 5.4 LANTERN_RARE_WEIGHT

```text
Korean:
희귀 광맥 등장 확률 가중치 증가

English:
Increases probability weight for rare vein faces

Trigger:
When a Mining Face is generated

Result:
Rare vein faces become more likely

Does not:
Guarantee rare ore
Guarantee diamond
```

Recommended value:

```text
COMMON: weight increases by 0.25 points
MAGIC: weight increases by 0.75 points
RARE: weight increases by 1.5 points
Cap: 8 total weight
```

### 5.5 LANTERN_ORE_DENSITY_CHANCE

```text
Korean:
채굴면 생성 시 광석 칸이 1개 더 생길 확률

English:
Chance for one additional ore slot when generating a Mining Face

Trigger:
When a Mining Face is generated

Result:
One non-ore cell may become an ore cell if the layer supports it

Does not:
Guarantee extra ore
Add more than one ore slot per face from this effect
Create ore outside the current layer pool
```

Recommended value:

```text
COMMON: 4%
MAGIC: 8%
RARE: 14%
Cap: 35%
Max one extra ore slot per face from this effect
```

### 5.6 LANTERN_ORE_UPGRADE_CHANCE

```text
Korean:
생성된 광석 1개가 현재 지층 내 더 좋은 광석으로 승급될 확률

English:
Chance to upgrade one generated ore to a better valid ore within the current layer

Trigger:
After ore slots are generated

Result:
One generated ore may upgrade to a higher-value ore allowed in the current layer

Does not:
Create new ore slots
Guarantee rare ore
Upgrade beyond current layer rules
```

Recommended value:

```text
COMMON: 3%
MAGIC: 6%
RARE: 10%
Cap: 30%
Max one ore upgrade per face from this effect
```

### 5.7 LANTERN_ORE_BONUS_CHANCE

```text
Korean:
광석 자원 획득 시 같은 광석 1개를 추가로 얻을 확률

English:
Chance to gain one extra same ore when ore is gained

Trigger:
When an ore resource is gained

Result:
The same ore may be gained one extra time

Does not:
Multiply ore amount
Guarantee extra ore
```

Recommended value:

```text
COMMON: chance increases by 1.5 percentage points
MAGIC: chance increases by 3 percentage points
RARE: chance increases by 5 percentage points
Global cap: maxBonusChance 75%
```

### 5.8 Lantern Unique Tier Effects / 랜턴 유니크 티어 효과

```text
LANTERN_TIER_STONE
Korean: 돌 랜턴. 광물 점 채굴면 등장 확률 체감 증가.
English: Stone Lantern. Improves ore-spot face appearance probability.
Effect: ore-spot weight increases.
```

```text
LANTERN_TIER_COPPER
Korean: 구리 랜턴. 광맥형 채굴면 등장 확률 체감 증가.
English: Copper Lantern. Improves vein-face appearance probability.
Effect: vein weight increases.
```

```text
LANTERN_TIER_IRON
Korean: 철 랜턴. 풍부한 광물 채굴면 등장 확률 체감 증가.
English: Iron Lantern. Improves rich-face appearance probability.
Effect: rich-face weight increases.
```

```text
LANTERN_TIER_CRYSTAL
Korean: 수정 랜턴. 광석 승급과 희귀 광맥 등장 확률 체감 증가.
English: Crystal Lantern. Improves ore upgrade and rare-vein appearance probability.
Effect: ore upgrade chance and rare weight improve.
```

```text
LANTERN_TIER_DIAMOND
Korean: 다이아 랜턴. 다이아 광석 발견 확률 체감 증가.
English: Diamond Lantern. Improves diamond ore discovery probability.
Effect: diamond ore appearance probability improves.
Does not: guarantee diamond.
```

## 6. Gloves Effect Details / 장갑 효과 상세

Gloves are hand-work upgrades.

장갑은 손쓰는 일을 강화하는 장비다.

Gloves should feel like:

```text
faster hands
better recovery
faster debris clearing
nearby resonant breaking
```

장갑은 다음 느낌이어야 한다:

```text
손이 빨라짐
파괴 후 회수가 빨라짐
잔해 정리가 빨라짐
주변 칸도 공명으로 같이 깨짐
```

### 6.1 GLOVES_HIT_INTERVAL_REDUCTION

```text
Korean:
기본 타격 간격 감소

English:
Reduces base hit interval

Trigger:
Passive stat calculation

Result:
AUTO mining hits faster

Does not:
Change target choice
Increase ore chance
```

Recommended value:

```text
COMMON: hit interval reduced by 2%
MAGIC: hit interval reduced by 4%
RARE: hit interval reduced by 7%
Minimum: minimumHitIntervalMs
```

### 6.2 GLOVES_OPENING_ACCELERATION_CHANCE

```text
Korean:
새 채굴면 시작 직후 빠른 손놀림이 발동할 확률

English:
Chance for faster hand movement at the start of a new face

Trigger:
First few hits after a new Mining Face appears

Result:
Early hits on the face may happen faster

Does not:
Add extra cracks directly
Change target choice
```

Recommended value:

```text
COMMON: 8%
MAGIC: 16%
RARE: 28%
First few hits only
```

### 6.3 GLOVES_CRACK_TRACKING_PRIORITY

```text
Korean:
이미 금 간 칸을 우선 마무리하려는 손놀림 보정

English:
Hand-work priority for finishing already cracked cells

Trigger:
When AUTO target score is calculated

Result:
Cracked cells receive higher target score

Does not:
Create a new target algorithm
Override AUTO rules
```

Recommended value:

```text
COMMON/MAGIC/RARE increase cracked-cell target score by tier
```

### 6.4 GLOVES_BREAK_RECOVERY_CHANCE

```text
Korean:
블록 파괴 후 다음 타격 회수가 빨라질 확률

English:
Chance for faster recovery after a block breaks

Trigger:
After a block breaks

Result:
The next hit may happen sooner

Does not:
Apply permanent speed increase
Change target choice
```

Recommended value:

```text
COMMON: 10%
MAGIC: 20%
RARE: 35%
One hit only
```

### 6.5 GLOVES_DEBRIS_CLEAR_SPEED

```text
Korean:
채굴면을 모두 깬 뒤 잔해 정리가 빨라져 다음 채굴면 전환 시간이 감소

English:
Reduces face advance transition time after a Mining Face is cleared

Trigger:
After a Mining Face is fully cleared

Result:
The transition to the next face becomes faster

Does not:
Change mining damage
Change ore appearance chance
Skip Reward Encounter
```

Recommended value:

```text
COMMON: transition time reduced by 3%
MAGIC: transition time reduced by 6%
RARE: transition time reduced by 10%
Cap: 35%
Minimum transition time still respects reduced motion rules
```

### 6.6 GLOVES_RESONANT_BREAK_CHANCE

```text
Korean:
타격 충격이 손을 통해 주변 칸으로 공명해 균열이 번질 확률

English:
Chance for hand resonance to spread cracks to adjacent cells

Trigger:
When a hit lands

Result:
Adjacent cells may receive one crack

Does not:
Change AUTO target score
Cause recursive chain reactions
```

Recommended value:

```text
COMMON: 6%
MAGIC: 12%
RARE: 22%
Cap: 45%
No recursive chain
```

### 6.7 Gloves Unique Tier Effects / 장갑 유니크 티어 효과

```text
GLOVES_TIER_STONE
Korean: 돌 장갑. 기본 채굴 속도 체감 증가.
English: Stone Gloves. Improves base mining speed.
Effect: hit interval reduction improves.
```

```text
GLOVES_TIER_COPPER
Korean: 구리 장갑. 시작 가속과 파괴 후 회수 체감 증가.
English: Copper Gloves. Improves opening acceleration and break recovery.
Effect: opening acceleration and break recovery improve.
```

```text
GLOVES_TIER_IRON
Korean: 철 장갑. 잔해 정리와 파괴 후 회수 체감 증가.
English: Iron Gloves. Improves debris clear and break recovery.
Effect: debris clear speed and recovery chance improve.
```

```text
GLOVES_TIER_CRYSTAL
Korean: 수정 장갑. 공명 파괴와 잔해 정리 체감 증가.
English: Crystal Gloves. Improves resonant nearby breaking and debris clear.
Effect: resonant break chance and debris clear speed improve.
```

```text
GLOVES_TIER_DIAMOND
Korean: 다이아 장갑. 손놀림 최종 강화.
English: Diamond Gloves. Final hand-work capstone.
Effect: glove speed and glove proc chances improve.
```

## 7. Pickaxe Focused Crack vs Gloves Resonant Break / 곡괭이 집중 파괴와 장갑 공명 파괴 차이

### 7.1 PICKAXE_FOCUSED_CRACK_CHANCE

```text
Branch:
Pickaxe

Korean:
현재 치는 한 칸을 더 세게 깬다.

English:
Breaks the current target harder.

Trigger:
When the current target is hit

Result:
The current target may receive one extra crack

Adjacent cells:
No effect
```

### 7.2 GLOVES_RESONANT_BREAK_CHANCE

```text
Branch:
Gloves

Korean:
손놀림과 타격 충격이 주변 칸으로 공명한다.

English:
Hand motion and impact resonate into nearby cells.

Trigger:
When a hit lands

Result:
Adjacent cells may receive one crack

Current target:
Normal hit still applies
```

## 8. Deep Core Effect Details / 심층 코어 효과 상세

Deep Core is long-term support.

심층 코어는 장기 보조 가지다.

It must not become a log/detail branch.

로그/기록 강화 가지가 되면 안 된다.

It must not add cache/chest/storage systems.

보관함/상자/지연 수령 시스템을 추가하면 안 된다.

### 8.1 DEEP_CORE_EXTRA_MATERIAL_CHANCE

```text
Korean:
채굴 자원 획득 시 같은 자원 1개를 추가로 얻을 확률

English:
Chance to gain one extra same resource when mining grants a resource

Trigger:
When mining grants a resource

Result:
The same resource may be gained one extra time

Does not:
Multiply resource amount
Create cache rewards
```

Recommended value:

```text
COMMON: 3%
MAGIC: 6%
RARE: 10%
Cap: 35%
Max one extra unit
```

### 8.2 DEEP_CORE_OFFLINE_EFFICIENCY

```text
Korean:
오프라인 채굴 보상 효율 증가

English:
Increases offline mining reward efficiency

Trigger:
Offline reward calculation

Result:
Offline reward becomes stronger

Does not:
Bypass Diamond Core online requirement
```

Recommended value:

```text
COMMON: 2%
MAGIC: 4%
RARE: 7%
Cap: 70%
```

### 8.3 DEEP_CORE_OFFLINE_DEPTH_CAP

```text
Korean:
오프라인으로 진행 가능한 깊이 한계 증가

English:
Increases offline depth progress cap

Trigger:
Offline reward calculation

Result:
Offline progress may reach slightly deeper

Does not:
Pass Diamond Core clamp
```

Recommended value:

```text
COMMON: 5m
MAGIC: 10m
RARE: 20m
Cap: 250m
```

### 8.4 DEEP_CORE_STARTING_FRACTURE_CHANCE

```text
Korean:
다음 채굴면 시작 시 한 칸이 미리 금 가 있을 확률

English:
Chance for a new face to start with one pre-cracked cell

Trigger:
When a new Mining Face is generated

Result:
One random unbroken cell may start with one crack

Does not:
Break cells immediately unless the cell has 1 required hit
```

Recommended value:

```text
COMMON: 6%
MAGIC: 12%
RARE: 22%
Cap: 60%
```

### 8.5 DEEP_CORE_MATERIAL_FIND_CHANCE

```text
Korean:
MATERIAL 보상 선택 시 보조 재료 1줄이 추가로 붙을 확률

English:
Chance for one secondary material line to appear when selecting MATERIAL rewards

Trigger:
When selecting a MATERIAL reward

Result:
One secondary material line may be added

Does not:
Multiply the base reward amount
Add more than one secondary line
```

Recommended value:

```text
COMMON: 4%
MAGIC: 8%
RARE: 14%
Cap: 45%
Max one secondary line
```

### 8.6 DEEP_CORE_REWARD_QUALITY

```text
Korean:
더 좋은 보상 선택지가 나올 확률 가중치 증가

English:
Increases probability weight for better reward choices

Trigger:
Reward Encounter choice generation

Result:
Higher-quality reward choices become more likely

Does not:
Add reward reroll
Guarantee rare rewards
```

Recommended value:

```text
COMMON: reward quality weight increases by 1 point
MAGIC: reward quality weight increases by 2 points
RARE: reward quality weight increases by 4 points
```

### 8.7 Deep Core Unique Tier Effects / 심층 코어 유니크 티어 효과

```text
DEEP_CORE_TIER_STONE
Korean: 돌 코어. 시작 균열 확률 체감 증가.
English: Stone Core. Improves starting fracture probability.
Effect: starting fracture chance improves.
```

```text
DEEP_CORE_TIER_COAL
Korean: 석탄 코어. 오프라인 효율과 오프라인 깊이 한계 체감 증가.
English: Coal Core. Improves offline efficiency and offline depth cap.
Effect: offline efficiency and depth cap improve.
```

```text
DEEP_CORE_TIER_IRON
Korean: 철 코어. 추가 재료 확률 체감 증가.
English: Iron Core. Improves extra material probability.
Effect: extra material chance improves.
```

```text
DEEP_CORE_TIER_CRYSTAL
Korean: 수정 코어. 보상 품질과 동반 발견 체감 증가.
English: Crystal Core. Improves reward quality and companion material find.
Effect: reward quality weight and material find chance improve.
```

```text
DEEP_CORE_ENDLESS_TAB_OPEN
Korean: 엔드리스 문. 엔드리스 코어 탭 개방.
English: Endless Gate. Opens the Endless Core tab.
Effect: endlessCore.visible = true.
```

## 9. Unique Tier Node Rule / 유니크 티어 노드 규칙

Unique tier nodes must feel like tier upgrades.

유니크 티어 노드는 장비/코어 등급 상승 체감이 있어야 한다.

Rules:

```text
1. A tier node must reinforce branch identity.
2. A tier node must not copy another branch's identity.
3. A tier node may improve chance, weight, priority, speed, or cap support.
4. A tier node must not guarantee extra ore or block counts.
5. A tier node must not directly multiply material amounts.
```

규칙:

```text
1. 티어 노드는 해당 가지 컨셉을 강화해야 한다.
2. 다른 가지 역할을 가져오면 안 된다.
3. 확률, 가중치, 우선순위, 속도, 한계 보조는 가능하다.
4. 광물/블록 개수를 확정 추가하면 안 된다.
5. 재료 수량을 직접 배수로 늘리면 안 된다.
```
